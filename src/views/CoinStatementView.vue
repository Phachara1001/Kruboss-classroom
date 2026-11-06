<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Search,
  Filter,
  CheckCircle,
  Target,
  ShoppingBag,
  Gift,
  Award,
  RefreshCw,
  ShieldCheck,
  Calendar,
  Sparkles,
  UserCheck,
  Layers,
  Users,
  BarChart2,
  Eye,
  SlidersHorizontal,
  User
} from '@lucide/vue'
import { authUser } from '../data/authStore'
import { studentsList, isTeacherUser, isStudent } from '../data/studentsStore'
import {
  buildStudentCoinStatement,
  buildSystemCoinOverview,
  syncStudentStatementData,
  syncAllStudentsStatementData,
  isLedgerLoading
} from '../data/coinLedgerStore'
import StudentAvatar from '@/components/StudentAvatar.vue'

const route = useRoute()
const router = useRouter()

const isTeacher = computed(() => isTeacherUser(authUser.value))
const myStudentId = computed(() => String(authUser.value?.studentId || authUser.value?.id || '').trim())

// View Mode for Teacher/Admin: 'system' (ภาพรวมทั้งระบบ) | 'individual' (ดูรายบุคคล)
const viewMode = ref('individual')
const adminSubTab = ref('feed') // 'feed' (รายการเคลื่อนไหวทั้งหมด) | 'students' (สรุปรายบุคคล)
const selectedClassroomFilter = ref('all')

// Teacher can inspect a specific student in 'individual' mode; Student is strictly locked to their own ID
const selectedTeacherStudentId = ref('')

const activeStudentId = computed(() => {
  if (!isTeacher.value) {
    return myStudentId.value
  }
  return selectedTeacherStudentId.value || String(route.query.studentId || '').trim() || myStudentId.value
})

const currentStudentProfile = computed(() => {
  const sId = activeStudentId.value
  return (
    studentsList.value.find(
      s => String(s.studentId).trim() === sId || String(s.id).trim() === sId
    ) || authUser.value
  )
})

const allStudentOptions = computed(() => {
  if (!isTeacher.value) return []
  return studentsList.value
    .filter(s => isStudent(s))
    .slice()
    .sort((a, b) => String(a.studentId || '').localeCompare(String(b.studentId || '')))
})

// Filters
const selectedTypeFilter = ref('all') // 'all' | 'income' | 'expense'
const selectedCategoryFilter = ref('all')
const searchQuery = ref('')

const categoryConfig = {
  assignment: {
    label: 'คะแนนใบงาน',
    icon: Award,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  attendance: {
    label: 'เช็คชื่อเข้าเรียน',
    icon: UserCheck,
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  quest: {
    label: 'ภารกิจประจำสัปดาห์',
    icon: Target,
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  initial: {
    label: 'เหรียญเริ่มต้นระบบ',
    icon: Sparkles,
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  refund: {
    label: 'คืนเหรียญไอเทมซ้ำ',
    icon: RefreshCw,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  teacher: {
    label: 'รายการปรับยอด/โบนัส',
    icon: CheckCircle,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  shop: {
    label: 'ซื้อไอเทมร้านค้า',
    icon: ShoppingBag,
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  gacha: {
    label: 'เปิดกล่องสุ่มกาชา',
    icon: Gift,
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200'
  }
}

const getCategoryMeta = (cat) => {
  return (
    categoryConfig[cat] || {
      label: 'รายการทั่วไป',
      icon: Coins,
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-200'
    }
  )
}

// Individual Statement Data
const statement = computed(() => {
  return buildStudentCoinStatement(activeStudentId.value)
})

// Admin System-Wide Overview Data
const systemOverview = computed(() => {
  if (!isTeacher.value) return null
  return buildSystemCoinOverview(selectedClassroomFilter.value)
})

// Active Summary Data (depends on whether Admin is in 'system' mode or 'individual' mode)
const activeSummary = computed(() => {
  if (isTeacher.value && viewMode.value === 'system' && systemOverview.value) {
    return {
      currentBalance: systemOverview.value.totalCurrentBalance,
      totalLifetimeCoins: systemOverview.value.totalLifetimeCoins,
      totalReceived: systemOverview.value.totalReceived,
      totalSpent: systemOverview.value.totalSpent,
      incomeCount: systemOverview.value.incomeCount,
      expenseCount: systemOverview.value.expenseCount,
      categorySummary: systemOverview.value.categorySummary
    }
  }
  return statement.value
})

// Clear label indicating WHOSE data is currently displayed
const currentOwnerLabel = computed(() => {
  if (isTeacher.value && viewMode.value === 'system') {
    if (selectedClassroomFilter.value === 'all') {
      return `นักศึกษาทุกห้องเรียนรวมกัน (${systemOverview.value?.totalStudents || 0} คน)`
    }
    return `เฉพาะห้องเรียน ${selectedClassroomFilter.value} (${systemOverview.value?.totalStudents || 0} คน)`
  }
  const name = currentStudentProfile.value?.name || 'ผู้ใช้งาน'
  const sId = activeStudentId.value
  const room = currentStudentProfile.value?.classroom ? ` | ห้อง ${currentStudentProfile.value.classroom}` : ''
  return `${name} (รหัส: ${sId}${room})`
})

const filteredTransactions = computed(() => {
  const list =
    isTeacher.value && viewMode.value === 'system' && systemOverview.value
      ? systemOverview.value.allTransactions
      : statement.value.transactions || []

  const q = searchQuery.value.trim().toLowerCase()

  return list.filter(tx => {
    if (selectedTypeFilter.value !== 'all' && tx.type !== selectedTypeFilter.value) {
      return false
    }
    if (selectedCategoryFilter.value !== 'all' && tx.category !== selectedCategoryFilter.value) {
      return false
    }
    if (q) {
      const titleMatch = (tx.title || '').toLowerCase().includes(q)
      const detailMatch = (tx.detail || '').toLowerCase().includes(q)
      const catLabel = getCategoryMeta(tx.category).label.toLowerCase().includes(q)
      const studentNameMatch = (tx.studentName || '').toLowerCase().includes(q)
      const studentIdMatch = (tx.studentId || '').toLowerCase().includes(q)
      if (!titleMatch && !detailMatch && !catLabel && !studentNameMatch && !studentIdMatch) {
        return false
      }
    }
    return true
  })
})

const filteredStudentSummaries = computed(() => {
  if (!systemOverview.value) return []
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return systemOverview.value.studentSummaries
  return systemOverview.value.studentSummaries.filter(s => {
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.studentId || '').toLowerCase().includes(q) ||
      (s.classroom || '').toLowerCase().includes(q)
    )
  })
})

const spentPercentage = computed(() => {
  const total = activeSummary.value.totalReceived
  if (!total || total <= 0) return 0
  return Math.min(100, Math.round((activeSummary.value.totalSpent / total) * 100))
})

const remainingPercentage = computed(() => {
  return Math.max(0, 100 - spentPercentage.value)
})

const formatDate = (isoStr) => {
  if (!isoStr) return '-'
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return String(isoStr)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const inspectStudentStatement = async (studentId) => {
  selectedTeacherStudentId.value = String(studentId).trim()
  viewMode.value = 'individual'
  await syncStudentStatementData(selectedTeacherStudentId.value)
}

const switchToSystemMode = async () => {
  viewMode.value = 'system'
  await syncAllStudentsStatementData()
}

const handleRefresh = async () => {
  if (isTeacher.value && viewMode.value === 'system') {
    await syncAllStudentsStatementData()
  } else if (activeStudentId.value) {
    await syncStudentStatementData(activeStudentId.value)
  }
}

onMounted(async () => {
  if (isTeacher.value) {
    if (route.query.studentId) {
      selectedTeacherStudentId.value = String(route.query.studentId).trim()
      viewMode.value = 'individual'
      await syncStudentStatementData(selectedTeacherStudentId.value)
    } else {
      viewMode.value = 'system'
      await syncAllStudentsStatementData()
    }
  } else if (activeStudentId.value) {
    viewMode.value = 'individual'
    await syncStudentStatementData(activeStudentId.value)
  }
})

watch(activeStudentId, async (newId) => {
  if (newId && viewMode.value === 'individual') {
    await syncStudentStatementData(newId)
  }
})
</script>

<template>
  <div class="w-full lg:h-full flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out] lg:overflow-hidden">
    <!-- 1. Compact Header & Mode Switcher (Fixed Height) -->
    <div class="shrink-0 bg-white rounded-2xl px-4 py-3 border border-emerald-100 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
      <!-- Left: Header Info -->
      <div class="flex items-center gap-3.5 min-w-0">
        <template v-if="isTeacher && viewMode === 'system'">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <BarChart2 class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-base sm:text-lg font-black text-stone-800 tracking-tight truncate">
                ภาพรวมการเคลื่อนไหวเหรียญทั้งระบบ (Admin Coin Analytics)
              </h1>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <ShieldCheck class="w-3 h-3" />
                <span>ผู้ดูแลระบบ</span>
              </span>
            </div>
            <p class="text-xs text-stone-600 font-bold truncate mt-0.5">
              กำลังแสดงข้อมูลของ: <span class="text-emerald-700">{{ currentOwnerLabel }}</span>
            </p>
          </div>
        </template>

        <template v-else>
          <div class="p-1 shrink-0">
            <StudentAvatar
              :avatar="currentStudentProfile?.avatar"
              :frame="currentStudentProfile?.equippedFrame"
              :name="currentStudentProfile?.name"
              size="w-10 h-10"
              avatarClass="bg-emerald-50 text-emerald-900"
              borderClass="border border-emerald-200"
            />
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-1.5">
              <h1 class="text-base sm:text-lg font-black text-stone-800 tracking-tight flex items-center gap-1.5">
                <FileText class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>รายการเดินบัญชีเหรียญรายบุคคล (Coin Statement)</span>
              </h1>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck class="w-3 h-3" />
                <span>บัญชีส่วนบุคคล</span>
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
              <span class="text-stone-500 font-bold">เจ้าของบัญชี:</span>
              <span class="font-black text-stone-900">{{ currentStudentProfile?.name || 'ผู้ใช้งาน' }}</span>
              <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[11px] font-black">
                รหัส: {{ activeStudentId }}
              </span>
              <span v-if="currentStudentProfile?.classroom" class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-black">
                ห้อง: {{ currentStudentProfile.classroom }}
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- Right: Admin Mode Switcher & Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Admin Mode Toggle (Visible ONLY to Teacher) -->
        <div v-if="isTeacher" class="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
          <button
            @click="switchToSystemMode"
            class="px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            :class="
              viewMode === 'system'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            "
          >
            <BarChart2 class="w-3.5 h-3.5" />
            <span>ภาพรวมระบบ (Admin)</span>
          </button>
          <button
            @click="viewMode = 'individual'"
            class="px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            :class="
              viewMode === 'individual'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            "
          >
            <Users class="w-3.5 h-3.5" />
            <span>ดูรายบุคคล</span>
          </button>
        </div>

        <!-- Teacher Student Selector when in Individual Mode -->
        <div
          v-if="isTeacher && viewMode === 'individual'"
          class="flex items-center gap-1.5 bg-indigo-50/80 px-2.5 py-1 rounded-xl border border-indigo-200"
        >
          <span class="text-[11px] font-black text-indigo-800 whitespace-nowrap">เลือกดูของ:</span>
          <select
            v-model="selectedTeacherStudentId"
            class="bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[210px]"
          >
            <option value="">บัญชีของฉัน ({{ myStudentId }})</option>
            <option
              v-for="s in allStudentOptions"
              :key="s.studentId"
              :value="s.studentId"
            >
              {{ s.studentId }} - {{ s.name }} ({{ s.classroom }})
            </option>
          </select>
        </div>

        <button
          @click="handleRefresh"
          :disabled="isLedgerLoading"
          class="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLedgerLoading }" />
          <span>อัปเดต</span>
        </button>

        <button
          v-if="isTeacher"
          @click="router.push('/coins')"
          class="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>เพิ่ม/ลดเหรียญ</span>
        </button>

        <button
          @click="router.push('/shop')"
          class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <ShoppingBag class="w-3.5 h-3.5" />
          <span>ร้านค้า</span>
        </button>
      </div>
    </div>

    <!-- 2. Four Compact KPI Summary Cards (Fixed Height) -->
    <div class="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      <!-- 1. ยอดเหรียญปัจจุบัน (Current Balance) -->
      <div class="bg-gradient-to-br from-amber-50 via-white to-amber-50/60 rounded-2xl px-3.5 py-2.5 border border-amber-300 shadow-xs flex items-center justify-between gap-2">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
            <Wallet class="w-3 h-3 text-amber-600" />
            {{ isTeacher && viewMode === 'system' ? 'เหรียญหมุนเวียนปัจจุบัน' : 'ยอดเหรียญคงเหลือปัจจุบัน' }}
          </span>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-black font-mono text-amber-600 leading-none">
              {{ activeSummary.currentBalance.toLocaleString() }}
            </span>
            <span class="text-[10px] font-black text-amber-700 uppercase">Coins</span>
          </div>
          <p class="text-[11px] text-stone-500 font-semibold truncate mt-0.5">
            {{ isTeacher && viewMode === 'system' ? `รวมของ ${currentOwnerLabel}` : `ของ ${currentStudentProfile?.name || activeStudentId}` }}
          </p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
          <Coins class="w-4 h-4" />
        </div>
      </div>

      <!-- 2. ยอดเหรียญรวมสะสม (Total Lifetime Coins) -->
      <div class="bg-gradient-to-br from-indigo-50 via-white to-indigo-50/60 rounded-2xl px-3.5 py-2.5 border border-indigo-200 shadow-xs flex items-center justify-between gap-2">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1 text-[11px] font-black text-indigo-800 bg-indigo-100/90 px-2 py-0.5 rounded-md border border-indigo-200">
            <Layers class="w-3 h-3 text-indigo-600" />
            {{ isTeacher && viewMode === 'system' ? 'เหรียญสะสมทั้งระบบ' : 'ยอดเหรียญรวมสะสม' }}
          </span>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-black font-mono text-indigo-700 leading-none">
              {{ activeSummary.totalLifetimeCoins.toLocaleString() }}
            </span>
            <span class="text-[10px] font-black text-indigo-600 uppercase">Coins</span>
          </div>
          <p class="text-[11px] text-stone-500 font-semibold truncate mt-0.5">
            {{ isTeacher && viewMode === 'system' ? 'เหรียญทั้งหมดที่แจกจ่าย' : 'เหรียญสะสมตั้งแต่เริ่มเรียน' }}
          </p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <Award class="w-4 h-4" />
        </div>
      </div>

      <!-- 3. รายรับรวม (Total Received - GREEN) -->
      <div class="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 rounded-2xl px-3.5 py-2.5 border border-emerald-400 shadow-xs flex items-center justify-between gap-2">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md border border-emerald-400">
            <ArrowDownLeft class="w-3 h-3 text-emerald-700" />
            {{ isTeacher && viewMode === 'system' ? 'ยอดรับรวมทั้งระบบ (+)' : 'ได้รับทั้งหมด (รายรับ)' }}
          </span>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-black font-mono text-emerald-600 leading-none">
              +{{ activeSummary.totalReceived.toLocaleString() }}
            </span>
            <span class="text-[10px] font-black text-emerald-700 uppercase">Coins</span>
          </div>
          <p class="text-[11px] text-emerald-700 font-bold truncate mt-0.5">
            รวม {{ activeSummary.incomeCount.toLocaleString() }} รายการที่ได้รับ
          </p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <TrendingUp class="w-4 h-4" />
        </div>
      </div>

      <!-- 4. รายจ่ายรวม (Total Spent - RED/ROSE) -->
      <div class="bg-gradient-to-br from-rose-50 via-white to-rose-50/70 rounded-2xl px-3.5 py-2.5 border border-rose-400 shadow-xs flex items-center justify-between gap-2">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1 text-[11px] font-black text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded-md border border-rose-400">
            <ArrowUpRight class="w-3 h-3 text-rose-700" />
            {{ isTeacher && viewMode === 'system' ? 'ยอดจ่ายรวมทั้งระบบ (-)' : 'จ่ายออกทั้งหมด (รายจ่าย)' }}
          </span>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-black font-mono text-rose-600 leading-none">
              -{{ activeSummary.totalSpent.toLocaleString() }}
            </span>
            <span class="text-[10px] font-black text-rose-700 uppercase">Coins</span>
          </div>
          <p class="text-[11px] text-rose-700 font-bold truncate mt-0.5">
            รวม {{ activeSummary.expenseCount.toLocaleString() }} รายการที่ใช้จ่าย
          </p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <TrendingDown class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- 3. Main Split Workspace: Left Breakdown Box + Right Fixed-Height Scrollable Box -->
    <div class="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-3">
      <!-- LEFT COLUMN (4 cols): Compact Statement Breakdown & Classroom Filter -->
      <div class="xl:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-xs p-3.5 flex flex-col gap-2.5 min-h-0 xl:overflow-y-auto">
        <!-- Clear Owner Banner at top of Left Panel -->
        <div class="rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-[10px] font-black uppercase text-stone-400">ข้อมูลสรุปของ</p>
            <p class="text-xs font-black text-stone-800 truncate">{{ currentOwnerLabel }}</p>
          </div>
          <span class="shrink-0 text-[11px] font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
            คงเหลือ {{ activeSummary.currentBalance.toLocaleString() }}
          </span>
        </div>

        <!-- Classroom Filter inside Left Panel when in Admin System Mode -->
        <div v-if="isTeacher && viewMode === 'system' && systemOverview" class="space-y-1.5 border-b border-stone-100 pb-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-stone-700 flex items-center gap-1.5">
              <Users class="w-3.5 h-3.5 text-emerald-600" />
              เลือกกรองตามห้องเรียน
            </span>
            <span class="text-[10px] text-stone-400 font-bold">คลิกเพื่อสลับห้อง</span>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              @click="selectedClassroomFilter = 'all'"
              class="px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
              :class="
                selectedClassroomFilter === 'all'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300'
              "
            >
              <span class="text-xs font-black truncate">ทุกห้องเรียน</span>
              <span class="text-[11px] font-bold opacity-80">
                {{ studentsList.filter(s => isStudent(s)).length }} คน
              </span>
            </button>

            <button
              v-for="room in systemOverview.classroomBreakdown"
              :key="room.classroom"
              @click="selectedClassroomFilter = room.classroom"
              class="px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
              :class="
                selectedClassroomFilter === room.classroom
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300'
              "
            >
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-black truncate">{{ room.classroom }}</span>
                <span class="text-[10px] font-bold opacity-80">{{ room.studentCount }} คน</span>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono font-bold mt-0.5">
                <span :class="selectedClassroomFilter === room.classroom ? 'text-emerald-300' : 'text-emerald-600'">
                  +{{ room.totalReceived.toLocaleString() }}
                </span>
                <span :class="selectedClassroomFilter === room.classroom ? 'text-rose-300' : 'text-rose-600'">
                  -{{ room.totalSpent.toLocaleString() }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Statement Ratio Bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold">
            <span class="text-emerald-700 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              คงเหลือ ({{ remainingPercentage }}%)
            </span>
            <span class="text-rose-700 flex items-center gap-1">
              ใช้จ่ายแล้ว ({{ spentPercentage }}%)
              <span class="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            </span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden flex border border-stone-200 p-0.5 gap-0.5">
            <div
              class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-l-full transition-all duration-500"
              :style="{ width: `${remainingPercentage}%` }"
            ></div>
            <div
              class="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-r-full transition-all duration-500"
              :style="{ width: `${spentPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Income Breakdown Box (Compact) -->
        <div class="rounded-xl bg-emerald-50/60 border border-emerald-200 p-2.5 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-emerald-900 flex items-center gap-1">
              <ArrowDownLeft class="w-3.5 h-3.5 text-emerald-600" />
              แยกตามแหล่งรายรับ (+ ได้รับ)
            </span>
            <span class="text-xs font-black font-mono text-emerald-700">
              +{{ activeSummary.totalReceived.toLocaleString() }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-1.5 text-[11px]">
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">คะแนนใบงาน</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.assignment || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">เช็คชื่อเข้าเรียน</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.attendance || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">ภารกิจสัปดาห์</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.quest || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">เหรียญตั้งต้น</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.initial || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">โบนัสอาจารย์</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.teacher || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p class="text-stone-500 font-semibold truncate">คืนเหรียญซ้ำ</p>
              <p class="text-xs font-black text-emerald-700 font-mono">
                +{{ (activeSummary.categorySummary.income.refund || 0).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Expense Breakdown Box (Compact) -->
        <div class="rounded-xl bg-rose-50/60 border border-rose-200 p-2.5 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-rose-900 flex items-center gap-1">
              <ArrowUpRight class="w-3.5 h-3.5 text-rose-600" />
              แยกตามหมวดรายจ่าย (- จ่ายออก)
            </span>
            <span class="text-xs font-black font-mono text-rose-700">
              -{{ activeSummary.totalSpent.toLocaleString() }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-1.5 text-[11px]">
            <div class="bg-white rounded-lg p-1.5 border border-rose-100">
              <p class="text-stone-500 font-semibold truncate">ซื้อร้านค้า</p>
              <p class="text-xs font-black text-rose-600 font-mono">
                -{{ (activeSummary.categorySummary.expense.shop || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-rose-100">
              <p class="text-stone-500 font-semibold truncate">สุ่มกาชา</p>
              <p class="text-xs font-black text-rose-600 font-mono">
                -{{ (activeSummary.categorySummary.expense.gacha || 0).toLocaleString() }}
              </p>
            </div>
            <div class="bg-white rounded-lg p-1.5 border border-rose-100">
              <p class="text-stone-500 font-semibold truncate">ปรับลด/อื่นๆ</p>
              <p class="text-xs font-black text-rose-600 font-mono">
                -{{ (activeSummary.categorySummary.expense.teacher || 0).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (8 cols): Fixed-Height Box with Separated Header & Internal Scroll Body -->
      <div class="xl:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col min-h-0 overflow-hidden h-[500px] xl:h-full">
        <!-- Admin Sub-Tab Header (Only in System Mode) -->
        <div
          v-if="isTeacher && viewMode === 'system'"
          class="shrink-0 px-3.5 pt-2.5 border-b border-stone-200 bg-stone-100/70 flex flex-wrap items-center gap-1.5"
        >
          <button
            @click="adminSubTab = 'feed'"
            class="px-3 py-1.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-t border-x"
            :class="
              adminSubTab === 'feed'
                ? 'bg-white text-emerald-700 border-stone-200 -mb-px'
                : 'bg-transparent text-stone-500 border-transparent hover:text-stone-800'
            "
          >
            <FileText class="w-3.5 h-3.5" />
            <span>รายการเคลื่อนไหวเหรียญทั้งระบบ ({{ systemOverview?.allTransactions.length || 0 }})</span>
          </button>
          <button
            @click="adminSubTab = 'students'"
            class="px-3 py-1.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-t border-x"
            :class="
              adminSubTab === 'students'
                ? 'bg-white text-indigo-700 border-stone-200 -mb-px'
                : 'bg-transparent text-stone-500 border-transparent hover:text-stone-800'
            "
          >
            <Users class="w-3.5 h-3.5" />
            <span>ตารางสรุปยอดเหรียญรายบุคคล ({{ systemOverview?.studentSummaries.length || 0 }} คน)</span>
          </button>
        </div>

        <!-- Filter Controls Bar (Fixed at top of box) -->
        <div class="shrink-0 px-3.5 py-2 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <!-- Type Tabs (All / Received / Spent) -->
          <div v-if="!(isTeacher && viewMode === 'system' && adminSubTab === 'students')" class="flex flex-wrap items-center gap-1.5">
            <button
              @click="selectedTypeFilter = 'all'"
              class="px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1"
              :class="
                selectedTypeFilter === 'all'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              "
            >
              <span>ทั้งหมด ({{ (activeSummary.incomeCount + activeSummary.expenseCount).toLocaleString() }})</span>
            </button>

            <button
              @click="selectedTypeFilter = 'income'"
              class="px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1"
              :class="
                selectedTypeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              "
            >
              <ArrowDownLeft class="w-3.5 h-3.5" />
              <span>ได้รับ (+{{ activeSummary.incomeCount.toLocaleString() }})</span>
            </button>

            <button
              @click="selectedTypeFilter = 'expense'"
              class="px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1"
              :class="
                selectedTypeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
              "
            >
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>จ่ายออก (-{{ activeSummary.expenseCount.toLocaleString() }})</span>
            </button>
          </div>
          <div v-else class="text-xs font-black text-stone-700 flex items-center gap-1.5">
            <Users class="w-3.5 h-3.5 text-indigo-600" />
            <span>ตารางสรุปยอดรับ-จ่ายเหรียญแยกตามรายชื่อนักศึกษา</span>
          </div>

          <!-- Category Select & Search -->
          <div class="flex items-center gap-2">
            <div
              v-if="!(isTeacher && viewMode === 'system' && adminSubTab === 'students')"
              class="relative flex items-center"
            >
              <Filter class="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
              <select
                v-model="selectedCategoryFilter"
                class="pl-7 pr-6 py-1 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">ทุกหมวดหมู่</option>
                <option value="assignment">คะแนนใบงาน (+)</option>
                <option value="attendance">เช็คชื่อเข้าเรียน (+)</option>
                <option value="quest">ภารกิจสัปดาห์ (+)</option>
                <option value="shop">ซื้อร้านค้า (-)</option>
                <option value="gacha">สุ่มกาชา (-)</option>
                <option value="refund">คืนเหรียญซ้ำ (+)</option>
                <option value="teacher">โบนัส/ปรับยอด</option>
                <option value="initial">เหรียญตั้งต้น (+)</option>
              </select>
            </div>

            <div class="relative flex-1 sm:w-52">
              <Search class="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="isTeacher && viewMode === 'system' ? 'ค้นหาชื่อ, รหัส, รายการ...' : 'ค้นหารายการ...'"
                class="w-full pl-8 pr-3 py-1 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- A) ADMIN STUDENT SUMMARY TABLE (Separated Header + Scroll) -->
        <!-- ========================================================= -->
        <template v-if="isTeacher && viewMode === 'system' && adminSubTab === 'students'">
          <!-- Fixed Column Header Outside Scroll Container (Never Overlaps!) -->
          <div class="shrink-0 hidden sm:grid sm:grid-cols-12 items-center px-4 py-2 bg-stone-100 border-b border-stone-200 text-[11px] font-black text-stone-600 uppercase">
            <div class="col-span-5">นักศึกษา (ชื่อ - รหัสนักศึกษา)</div>
            <div class="col-span-1 text-center">ห้องเรียน</div>
            <div class="col-span-2 text-right text-emerald-700">ได้รับสะสม (+)</div>
            <div class="col-span-2 text-right text-rose-700">จ่ายออกสะสม (-)</div>
            <div class="col-span-2 text-right text-amber-800">คงเหลือ / ดูข้อมูล</div>
          </div>

          <!-- Scrollable Student Rows -->
          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-stone-100">
            <div
              v-for="item in filteredStudentSummaries"
              :key="item.studentId"
              class="px-4 py-3 grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-3 hover:bg-stone-50/90 transition-colors"
            >
              <!-- Col 1: Student Clear Name & ID (Badge เด่นๆ ไม่มีรูปและกรอบ) -->
              <div class="sm:col-span-5 flex items-center gap-2.5 min-w-0">
                <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <User class="w-4 h-4" />
                </span>
                <div class="min-w-0">
                  <p class="text-xs sm:text-sm font-black text-stone-900 truncate">{{ item.name }}</p>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-black">
                      รหัส: {{ item.studentId }}
                    </span>
                    <span class="text-[10px] text-stone-400 font-bold">
                      ({{ item.txCount }} รายการ)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Col 2: Classroom -->
              <div class="sm:col-span-1 flex sm:justify-center">
                <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-black">
                  {{ item.classroom }}
                </span>
              </div>

              <!-- Col 3: Total Received -->
              <div class="sm:col-span-2 flex sm:justify-end items-center justify-between">
                <span class="sm:hidden text-[11px] font-bold text-stone-500">ได้รับสะสม:</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-black">
                  +{{ item.totalReceived.toLocaleString() }}
                </span>
              </div>

              <!-- Col 4: Total Spent -->
              <div class="sm:col-span-2 flex sm:justify-end items-center justify-between">
                <span class="sm:hidden text-[11px] font-bold text-stone-500">จ่ายออกสะสม:</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-black">
                  -{{ item.totalSpent.toLocaleString() }}
                </span>
              </div>

              <!-- Col 5: Current Balance + View Button -->
              <div class="sm:col-span-2 flex items-center justify-between sm:justify-end gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 font-mono text-xs font-black">
                  {{ item.currentBalance.toLocaleString() }}
                </span>
                <button
                  @click="inspectStudentStatement(item.studentId)"
                  class="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="ดู Statement ของนักศึกษาคนนี้"
                >
                  <Eye class="w-3 h-3" />
                  <span>ดู</span>
                </button>
              </div>
            </div>

            <div v-if="filteredStudentSummaries.length === 0" class="py-12 text-center text-stone-400 font-bold text-xs">
              ไม่พบรายชื่อนักศึกษาที่ค้นหา
            </div>
          </div>
        </template>

        <!-- ========================================================= -->
        <!-- B) TRANSACTIONS FEED (Separated Header + Internal Scroll) -->
        <!-- ========================================================= -->
        <template v-else>
          <!-- Fixed Column Header Outside Scroll Container (Never Overlaps!) -->
          <div class="shrink-0 hidden md:grid md:grid-cols-12 items-center px-4 py-2 bg-stone-100 border-b border-stone-200 text-[11px] font-black text-stone-600 uppercase">
            <div class="col-span-4">เจ้าของรายการ (นักศึกษา)</div>
            <div class="col-span-5">รายละเอียดรายการ / หมวดหมู่</div>
            <div class="col-span-3 text-right">จำนวนเหรียญ (รับ / จ่าย) & คงเหลือ</div>
          </div>

          <!-- Scrollable Transaction Rows -->
          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-stone-100">
            <div
              v-for="tx in filteredTransactions"
              :key="tx.id"
              class="px-4 py-3 grid grid-cols-1 md:grid-cols-12 items-center gap-2.5 md:gap-3 transition-colors border-l-4"
              :class="
                tx.type === 'income'
                  ? 'border-l-emerald-500 bg-emerald-50/15 hover:bg-emerald-50/45'
                  : 'border-l-rose-500 bg-rose-50/15 hover:bg-rose-50/45'
              "
            >
              <!-- COLUMN 1 (4 cols): WHOSE TRANSACTION THIS IS (Badge ชื่อเด่นๆ ไม่มีรูปและกรอบ) -->
              <div class="md:col-span-4 flex items-center justify-between gap-2 bg-stone-50/90 hover:bg-white px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <User class="w-3.5 h-3.5" />
                    </span>
                    <p class="text-xs sm:text-sm font-black text-stone-900 truncate tracking-tight">
                      {{ tx.studentName || currentStudentProfile?.name || 'ผู้ใช้งาน' }}
                    </p>
                  </div>
                  <div class="flex flex-wrap items-center gap-1.5 mt-1 ml-7.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] font-black">
                      รหัส: {{ tx.studentId || activeStudentId }}
                    </span>
                    <span
                      v-if="tx.studentClassroom || currentStudentProfile?.classroom"
                      class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold"
                    >
                      {{ tx.studentClassroom || currentStudentProfile?.classroom }}
                    </span>
                  </div>
                </div>

                <button
                  v-if="isTeacher && viewMode === 'system' && tx.studentId"
                  @click="inspectStudentStatement(tx.studentId)"
                  class="shrink-0 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-[11px] font-black transition-all cursor-pointer flex items-center gap-1"
                  title="ดู Statement เฉพาะของนักศึกษาคนนี้"
                >
                  <Eye class="w-3 h-3" />
                  <span>ดูคนนี้</span>
                </button>
              </div>

              <!-- COLUMN 2 (5 cols): TRANSACTION DETAILS & CATEGORY -->
              <div class="md:col-span-5 min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <!-- Clear Income / Expense Badge -->
                  <span
                    class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black uppercase border"
                    :class="
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    "
                  >
                    <ArrowDownLeft v-if="tx.type === 'income'" class="w-3 h-3" />
                    <ArrowUpRight v-else class="w-3 h-3" />
                    {{ tx.type === 'income' ? 'ได้รับเหรียญ' : 'จ่ายเหรียญ' }}
                  </span>

                  <!-- Category Badge -->
                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border"
                    :class="getCategoryMeta(tx.category).badgeClass"
                  >
                    <component :is="getCategoryMeta(tx.category).icon" class="w-2.5 h-2.5" />
                    <span>{{ getCategoryMeta(tx.category).label }}</span>
                  </span>

                  <!-- Date -->
                  <span class="inline-flex items-center gap-1 text-[10px] text-stone-400 font-semibold">
                    <Calendar class="w-2.5 h-2.5" />
                    {{ formatDate(tx.createdAt) }}
                  </span>
                </div>

                <h3 class="text-xs sm:text-sm font-black text-stone-800 break-words leading-snug">
                  {{ tx.title }}
                </h3>
                <p v-if="tx.detail" class="text-[11px] text-stone-500 font-medium break-words">
                  {{ tx.detail }}
                </p>
              </div>

              <!-- COLUMN 3 (3 cols): AMOUNT (+ GREEN / - RED) & BALANCE AFTER -->
              <div class="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0">
                <div
                  class="px-2.5 py-1 rounded-lg font-mono text-xs sm:text-sm font-black border flex items-center gap-1"
                  :class="
                    tx.type === 'income'
                      ? 'bg-emerald-100/90 text-emerald-700 border-emerald-300'
                      : 'bg-rose-100/90 text-rose-700 border-rose-300'
                  "
                >
                  <span>{{ tx.type === 'income' ? `+${tx.amount.toLocaleString()}` : `-${tx.amount.toLocaleString()}` }}</span>
                  <span class="text-[10px] font-bold">Coins</span>
                </div>
                <span
                  v-if="tx.balanceAfter !== undefined"
                  class="text-[10px] font-bold text-stone-500 mt-1 font-mono"
                >
                  คงเหลือของบัญชีนี้: {{ tx.balanceAfter.toLocaleString() }} Coins
                </span>
              </div>
            </div>

            <div
              v-if="filteredTransactions.length === 0"
              class="py-12 text-center space-y-1.5 text-stone-400"
            >
              <Coins class="w-8 h-8 mx-auto text-stone-300" />
              <p class="text-xs font-bold text-stone-500">ไม่พบรายการเดินบัญชีเหรียญตามเงื่อนไขที่เลือก</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
