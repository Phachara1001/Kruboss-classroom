<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  questsList, 
  saveQuest, 
  deleteQuest, 
  approveQuestForStudent, 
  batchApproveQuest, 
  getStudentQuestCompletions, 
  fetchQuests, 
  fetchQuestProgress, 
  fetchAllQuestProgress, 
  allQuestProgress 
} from '../data/questsStore'
import { authUser } from '../data/authStore'
import { studentsList, isStudent, fetchStudents } from '../data/studentsStore'
import { directShopItems } from '../data/shopStore'
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  Coins, 
  Gift, 
  Search, 
  X, 
  Check, 
  Image as ImageIcon, 
  BadgeCheck, 
  Filter, 
  CheckSquare, 
  Square, 
  School, 
  Users, 
  Sparkles, 
  RotateCcw,
  Clock,
  ChevronDown,
  Circle,
  GraduationCap
} from '@lucide/vue'

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})
const activeStudentId = computed(() => authUser.value?.studentId || authUser.value?.id)

const isQuestCompleted = (quest) => {
  const sId = activeStudentId.value
  const completions = getStudentQuestCompletions(quest.id, sId)
  return quest.maxCompletions > 0 && completions >= quest.maxCompletions
}

const getQuestProgress = (quest) => {
  const sId = activeStudentId.value
  const current = getStudentQuestCompletions(quest.id, sId)
  const max = quest.maxCompletions || 1
  const percent = Math.min(100, Math.round((current / max) * 100))
  return { current, max, percent }
}

onMounted(async () => {
  await fetchQuests()
  await fetchStudents()
  if (activeStudentId.value) {
    await fetchQuestProgress(activeStudentId.value)
  }
  if (isTeacher.value) {
    await fetchAllQuestProgress()
  }
})

watch(activeStudentId, async (newId) => {
  if (newId) {
    await fetchQuestProgress(newId)
  }
}, { immediate: true })

// Modals state
const showAddModal = ref(false)
const showAwardModal = ref(false)
const editingQuest = ref(null)
const awardingQuest = ref(null)

// Add/Edit Quest Form
const formData = ref({
  id: '',
  title: '',
  description: '',
  maxCompletions: 1,
  isActive: true,
  rewards: [{ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' }]
})

const openAddModal = () => {
  editingQuest.value = null
  formData.value = {
    id: '',
    title: '',
    description: '',
    maxCompletions: 1,
    isActive: true,
    rewards: [{ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' }]
  }
  showAddModal.value = true
}

const openEditModal = (quest) => {
  editingQuest.value = quest
  formData.value = JSON.parse(JSON.stringify(quest))
  showAddModal.value = true
}

const handleSaveQuest = async () => {
  await saveQuest(formData.value)
  showAddModal.value = false
}

const handleDeleteQuest = (id) => {
  if (confirm('คุณต้องการลบภารกิจนี้ใช่หรือไม่?')) {
    deleteQuest(id)
  }
}

// ==========================================
// Awarding Quest Form state & Detailed Filters
// ==========================================
const selectedStudentIds = ref([])
const studentSearchQuery = ref('')
const selectedClassroomFilter = ref('all')
const selectedStatusFilter = ref('all') // 'all' | 'not_started' | 'in_progress' | 'completed'
const isClassroomDropdownOpen = ref(false)
const isStatusDropdownOpen = ref(false)

const statusOptions = [
  { value: 'all', label: 'ทุกสถานะ', icon: Target, iconColor: 'text-emerald-600' },
  { value: 'not_started', label: 'ยังไม่เคยรับ (0)', icon: Circle, iconColor: 'text-stone-400' },
  { value: 'in_progress', label: 'กำลังทำ (ยังไม่ครบ)', icon: Clock, iconColor: 'text-amber-500' },
  { value: 'completed', label: 'รับครบแล้ว (✓)', icon: CheckCircle, iconColor: 'text-emerald-600' }
]

const currentStatusOption = computed(() => {
  return statusOptions.find(o => o.value === selectedStatusFilter.value) || statusOptions[0]
})

const isAwarding = ref(false)
const awardMessage = ref('')
const awardError = ref('')

// Classrooms list for filter
const availableClassrooms = computed(() => {
  const rooms = studentsList.value
    .filter(isStudent)
    .map(s => s.classroom)
    .filter(Boolean)
  return [...new Set(rooms)].sort()
})

const getCompletions = (studentId) => {
  if (!awardingQuest.value) return 0
  return getStudentQuestCompletions(studentId, awardingQuest.value.id)
}

const filteredStudents = computed(() => {
  const quest = awardingQuest.value
  const max = quest?.maxCompletions || 1
  const query = studentSearchQuery.value.trim().toLowerCase()

  return studentsList.value
    .filter(s => {
      if (!isStudent(s)) return false

      // Classroom filter
      if (selectedClassroomFilter.value !== 'all' && s.classroom !== selectedClassroomFilter.value) {
        return false
      }

      // Search filter
      if (query) {
        const nameMatch = (s.name || '').toLowerCase().includes(query)
        const idMatch = (s.studentId || '').toLowerCase().includes(query)
        const nicknameMatch = (s.nickname || '').toLowerCase().includes(query)
        if (!nameMatch && !idMatch && !nicknameMatch) return false
      }

      // Status filter
      if (quest) {
        const comp = getCompletions(s.studentId || s.id)
        if (selectedStatusFilter.value === 'not_started' && comp !== 0) return false
        if (selectedStatusFilter.value === 'in_progress' && (comp === 0 || (quest.maxCompletions > 0 && comp >= max))) return false
        if (selectedStatusFilter.value === 'completed' && (quest.maxCompletions > 0 && comp < max)) return false
      }

      return true
    })
    .sort((a, b) => {
      const idA = String(a.studentId || a.id || '')
      const idB = String(b.studentId || b.id || '')
      return idA.localeCompare(idB, undefined, { numeric: true })
    })
})

const openAwardModal = async (quest) => {
  awardingQuest.value = quest
  selectedStudentIds.value = []
  studentSearchQuery.value = ''
  selectedClassroomFilter.value = 'all'
  selectedStatusFilter.value = 'all'
  isClassroomDropdownOpen.value = false
  isStatusDropdownOpen.value = false
  awardMessage.value = ''
  awardError.value = ''
  await fetchAllQuestProgress()
  showAwardModal.value = true
}

const toggleSelectStudent = (studentId) => {
  const quest = awardingQuest.value
  if (!quest) return
  const currentComp = getCompletions(studentId)
  if (quest.maxCompletions > 0 && currentComp >= quest.maxCompletions) {
    return // Already completed max times
  }

  const idx = selectedStudentIds.value.indexOf(studentId)
  if (idx !== -1) {
    selectedStudentIds.value.splice(idx, 1)
  } else {
    selectedStudentIds.value.push(studentId)
  }
}

const isStudentSelected = (studentId) => {
  return selectedStudentIds.value.includes(studentId)
}

// Students that can be selected (not yet maxed out)
const selectableFilteredStudents = computed(() => {
  const quest = awardingQuest.value
  if (!quest) return []
  return filteredStudents.value.filter(s => {
    const comp = getCompletions(s.studentId || s.id)
    return quest.maxCompletions === 0 || comp < quest.maxCompletions
  })
})

const isAllFilteredSelected = computed(() => {
  if (selectableFilteredStudents.value.length === 0) return false
  return selectableFilteredStudents.value.every(s => isStudentSelected(s.studentId || s.id))
})

const toggleSelectAll = () => {
  if (isAllFilteredSelected.value) {
    // Deselect all in selectable list
    const idsToRemove = new Set(selectableFilteredStudents.value.map(s => s.studentId || s.id))
    selectedStudentIds.value = selectedStudentIds.value.filter(id => !idsToRemove.has(id))
  } else {
    // Add all selectable to selected list
    const newIds = new Set(selectedStudentIds.value)
    selectableFilteredStudents.value.forEach(s => {
      newIds.add(s.studentId || s.id)
    })
    selectedStudentIds.value = Array.from(newIds)
  }
}

const clearSelection = () => {
  selectedStudentIds.value = []
}

// Batch Award
const handleAwardQuest = async () => {
  awardMessage.value = ''
  awardError.value = ''

  if (selectedStudentIds.value.length === 0) {
    awardError.value = 'กรุณาเลือกนักศึกษาอย่างน้อย 1 คน'
    return
  }

  isAwarding.value = true
  try {
    const res = await batchApproveQuest(selectedStudentIds.value, awardingQuest.value.id)
    if (res.success) {
      if (res.count === res.total) {
        awardMessage.value = `ตรวจภารกิจและมอบรางวัลให้นักศึกษาสำเร็จ ${res.count} คน!`
      } else {
        awardMessage.value = `ตรวจภารกิจและมอบรางวัลให้นักศึกษาสำเร็จ ${res.count}/${res.total} คน`
        if (res.errors && res.errors.length > 0) {
          awardError.value = res.errors.join(', ')
        }
      }
      selectedStudentIds.value = []
      await fetchAllQuestProgress()
      await fetchStudents()
      setTimeout(() => {
        if (awardMessage.value.startsWith('ตรวจภารกิจและมอบรางวัล')) {
          awardMessage.value = ''
        }
      }, 3000)
    } else {
      awardError.value = res.errors?.[0] || 'เกิดข้อผิดพลาดในการมอบรางวัล'
    }
  } catch (err) {
    console.error(err)
    awardError.value = 'เซิร์ฟเวอร์เกิดข้อผิดพลาด'
  } finally {
    isAwarding.value = false
  }
}

// Quick Single Award (+1)
const handleQuickAward = async (studentId) => {
  awardMessage.value = ''
  awardError.value = ''
  isAwarding.value = true
  try {
    const res = await approveQuestForStudent(studentId, awardingQuest.value.id)
    if (res.success) {
      awardMessage.value = `มอบรางวัลให้นักศึกษาสำเร็จ! (ความคืบหน้า: ${res.completions}/${awardingQuest.value?.maxCompletions || 1})`
      await fetchAllQuestProgress()
      await fetchStudents()
      setTimeout(() => { 
        if (awardMessage.value.startsWith('มอบรางวัลให้นักศึกษาสำเร็จ!')) {
          awardMessage.value = '' 
        }
      }, 2500)
    } else {
      awardError.value = res.message
    }
  } catch (err) {
    awardError.value = 'เกิดข้อผิดพลาด'
  } finally {
    isAwarding.value = false
  }
}

// Helpers
const getRewardIcon = (type) => {
  if (type === 'coin') return Coins
  if (type === 'frame') return ImageIcon
  return Gift
}

const getRewardImage = (reward) => {
  if (reward.type === 'frame' && reward.itemId) {
    const item = directShopItems.value.find(i => i.id === reward.itemId)
    return item ? item.image : null
  }
  return null
}
</script>

<template>
  <div class="space-y-6 animate-[fadeIn_0.5s_ease-out]">

    <!-- Header -->
    <div
      class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
      <!-- Decorative background -->
      <div
        class="absolute -right-20 -top-20 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse">
      </div>
      <div
        class="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style="animation-delay: 2s;"></div>

      <div class="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3 drop-shadow-md">
            <Target class="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400" />
            ภารกิจประจำสัปดาห์
          </h1>
          <p class="text-indigo-200 text-sm sm:text-base max-w-lg font-medium drop-shadow">
            ทำภารกิจที่ได้รับมอบหมายแล้วส่งหลักฐานให้ครูผู้สอนเพื่อรับรางวัลสุดพิเศษ
          </p>
        </div>

        <div v-if="isTeacher">
          <button @click="openAddModal"
            class="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer">
            <Plus class="w-5 h-5" /> สร้างภารกิจใหม่
          </button>
        </div>
      </div>
    </div>

    <!-- Quests List -->
    <div class="flex flex-col gap-4 w-full">
      <div v-if="questsList.length === 0"
        class="py-16 text-center text-stone-400 bg-white rounded-3xl border-2 border-dashed border-stone-200">
        <Target class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p class="text-xl font-bold">ยังไม่มีภารกิจในขณะนี้</p>
        <p class="text-sm mt-2">โปรดรอครูผู้สอนเพิ่มภารกิจประจำสัปดาห์</p>
      </div>

      <div v-for="quest in questsList" :key="quest.id"
        class="rounded-[2rem] p-4 sm:p-5 border-2 transition-all duration-300 w-full"
        :class="[
          !isTeacher && isQuestCompleted(quest) 
            ? 'bg-[#e5f4d3] border-transparent' 
            : 'bg-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative group hover:-translate-y-1 ' + (quest.isActive ? 'border-indigo-100 hover:border-indigo-300 shadow-indigo-100/30' : 'border-stone-200 opacity-60')
        ]">

        <!-- COMPLETED STUDENT VIEW -->
        <template v-if="!isTeacher && isQuestCompleted(quest)">
          <div class="flex items-center gap-4 px-1 py-1 sm:px-2 w-full relative group/complete cursor-default">
            
            <div class="shrink-0 flex items-center justify-center text-[#55b359] relative">
              <!-- Pulsing glow behind the badge -->
              <div class="absolute inset-0 bg-[#55b359] blur-md opacity-40 animate-pulse rounded-full"></div>
              
              <!-- Badge with slight hover pop and spin -->
              <BadgeCheck class="w-10 h-10 relative z-10 transition-transform duration-500 group-hover/complete:scale-110 group-hover/complete:rotate-[15deg]" fill="currentColor" stroke="#e5f4d3" stroke-width="2.5" />
            </div>

            <div class="flex-1 w-full relative z-10">
              <h3 class="font-black text-lg sm:text-xl text-[#469e4a] transition-all duration-300 group-hover/complete:translate-x-1 drop-shadow-sm">{{ quest.title }}</h3>
            </div>
          </div>
        </template>

        <!-- TEACHER VIEW OR IN-PROGRESS STUDENT VIEW -->
        <template v-else>
          <!-- Left: Icon -->
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner bg-indigo-100 text-indigo-500">
            <Target class="w-8 h-8" />
          </div>

          <!-- Middle: Info & Progress -->
          <div class="flex-1 w-full relative">
            <span v-if="!quest.isActive"
              class="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px] font-bold mb-1">
              ปิดรับภารกิจ
            </span>
            <h3 class="font-black text-lg sm:text-xl text-stone-800 leading-tight mb-2">{{ quest.title }}</h3>

            <div class="flex items-center gap-3 mt-1">
              <!-- Progress text & bar -->
              <div
                class="flex-1 max-w-[200px] flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200/60">
                <span class="text-[11px] font-black text-stone-600 w-8 text-right shrink-0">
                  {{ getQuestProgress(quest).current }} / {{ getQuestProgress(quest).max }}
                </span>
                <div class="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 transition-all duration-500 rounded-full"
                    :style="{ width: `${getQuestProgress(quest).percent}%` }">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Actions & Rewards -->
          <div class="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <template v-if="isTeacher">
              <button @click="openAwardModal(quest)"
                class="px-5 py-2.5 bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 text-sm font-black rounded-xl transition-colors cursor-pointer w-full sm:w-auto text-center border border-stone-200 hover:border-emerald-200 shadow-sm">
                ตรวจภารกิจ
              </button>
              <div class="flex gap-1 justify-end w-full">
                <button @click="openEditModal(quest)"
                  class="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDeleteQuest(quest.id)"
                  class="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-end">
                <!-- Reward Card -->
                <div class="flex flex-row items-center gap-2">
                  <div v-for="(reward, idx) in quest.rewards" :key="idx"
                    class="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-2xl p-2 w-16 h-16 shadow-sm relative group overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img v-if="getRewardImage(reward)" :src="getRewardImage(reward)" class="w-7 h-7 object-contain mb-1 relative z-10 drop-shadow-sm" />
                    <span v-else-if="reward.type === 'coin'" class="text-2xl mb-1 relative z-10 leading-none">🪙</span>
                    <component v-else :is="getRewardIcon(reward.type)" class="w-6 h-6 text-amber-500 mb-1 relative z-10" />
                    <span class="text-[10px] font-black text-stone-600 relative z-10 mt-0.5">x{{ reward.type === 'coin' ? (reward.amount || 1) : 1 }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Modals -->

    <!-- Add/Edit Quest Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
        <div
          class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div
            class="px-6 py-5 bg-gradient-to-r from-indigo-800 to-purple-900 text-white flex justify-between items-center shrink-0">
            <h3 class="font-black text-lg flex items-center gap-2">
              <Target class="w-5 h-5 text-fuchsia-400" />
              {{ editingQuest ? 'แก้ไขภารกิจ' : 'สร้างภารกิจใหม่' }}
            </h3>
            <button @click="showAddModal = false" class="text-white/60 hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSaveQuest" class="p-6 overflow-y-auto space-y-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">ชื่อภารกิจ</label>
              <input v-model="formData.title" type="text" required placeholder="เช่น ส่งงานตรงเวลา 3 ครั้ง"
                class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">รายละเอียด</label>
              <textarea v-model="formData.description" required rows="2" placeholder="อธิบายเงื่อนไขภารกิจ..."
                class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">จำนวนครั้งที่ทำได้ (ต่อคน)</label>
                <input v-model.number="formData.maxCompletions" type="number" min="1" required
                  class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div class="flex items-center pt-6">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.isActive" class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner">
                  </div>
                  <span class="ml-3 text-sm font-bold text-stone-700">เปิดใช้งานภารกิจนี้</span>
                </label>
              </div>
            </div>

            <!-- Rewards Section -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Gift class="w-4 h-4" /> ของรางวัล (สามารถให้ได้หลายชิ้น)
                </p>
                <button type="button"
                  @click="formData.rewards.push({ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' })"
                  class="text-[10px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                  <Plus class="w-3 h-3" /> เพิ่มรางวัล
                </button>
              </div>

              <div v-for="(reward, index) in formData.rewards" :key="index"
                class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative group transition-all flex gap-4">

                <button v-if="formData.rewards.length > 1" type="button" @click="formData.rewards.splice(index, 1)"
                  class="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer z-10"
                  title="ลบรางวัลนี้">
                  <Trash2 class="w-4 h-4" />
                </button>

                <!-- Reward Preview -->
                <div class="w-16 h-16 shrink-0 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-sm relative overflow-hidden mt-1">
                  <div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent"></div>
                  <img v-if="getRewardImage(reward)" :src="getRewardImage(reward)" class="w-8 h-8 object-contain mb-1 relative z-10 drop-shadow-sm" />
                  <span v-else-if="reward.type === 'coin'" class="text-2xl mb-1 relative z-10 leading-none">🪙</span>
                  <component v-else :is="getRewardIcon(reward.type)" class="w-7 h-7 text-amber-500 mb-1 relative z-10" />
                  <span class="text-[10px] font-black text-indigo-900 relative z-10 leading-none">x{{ reward.type === 'coin' ? (reward.amount || 1) : 1 }}</span>
                </div>

                <div class="flex-1 space-y-3 pr-6">
                  <div>
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">ประเภทของรางวัล</label>
                    <select v-model="reward.type"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none">
                      <option value="coin">เหรียญ (Coins)</option>
                      <option value="frame">ไอเทม/กรอบรูป (จากร้านค้า)</option>
                    </select>
                  </div>

                  <div v-if="reward.type === 'coin'">
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">จำนวนเหรียญ</label>
                    <input v-model.number="reward.amount" type="number" min="1"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none" />
                  </div>

                  <div v-if="reward.type === 'frame'">
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">เลือกไอเทม</label>
                    <select v-model="reward.itemId"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none">
                      <option value="" disabled>-- เลือกไอเทม --</option>
                      <option v-for="item in directShopItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">ชื่อที่แสดงให้ผู้เรียนเห็น</label>
                    <input v-model="reward.name" type="text" placeholder="เช่น เหรียญ 50 Coins"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" @click="showAddModal = false"
                class="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 cursor-pointer">ยกเลิก</button>
              <button type="submit"
                class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-2">
                <Check class="w-4 h-4" /> บันทึกภารกิจ
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Award Quest Modal (Multi-Select & Detailed Filters) -->
    <Teleport to="body">
      <div v-if="showAwardModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" @click="showAwardModal = false"></div>
        <div
          class="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[84vh] animate-[bounceIn_0.3s_ease-out]">
          
          <!-- Header -->
          <div class="px-6 py-4.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex justify-between items-center shrink-0 shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md shrink-0">
                <Gift class="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-black text-base sm:text-lg">
                    ตรวจภารกิจ: {{ awardingQuest?.title }}
                  </h3>
                  <span class="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    จำกัด {{ awardingQuest?.maxCompletions || 1 }} ครั้ง
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-emerald-100 mt-0.5">
                  <span>รางวัล:</span>
                  <span v-for="(rew, idx) in awardingQuest?.rewards" :key="idx" class="font-bold inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg text-[11px]">
                    <span v-if="rew.type === 'coin'">🪙 {{ rew.amount }} Coins</span>
                    <span v-else>{{ rew.name || 'ไอเทมพิเศษ' }}</span>
                  </span>
                </div>
              </div>
            </div>
            <button @click="showAwardModal = false" class="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-4 sm:p-6 flex-1 overflow-hidden flex flex-col bg-stone-50">

            <!-- Alert Messages -->
            <div v-if="awardError"
              class="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shrink-0 animate-[fadeIn_0.2s_ease-out]">
              <ShieldAlert class="w-4 h-4 text-red-500 shrink-0" />
              <span>{{ awardError }}</span>
            </div>

            <div v-if="awardMessage"
              class="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between gap-2 shrink-0 animate-[fadeIn_0.2s_ease-out]">
              <div class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{{ awardMessage }}</span>
              </div>
              <button @click="awardMessage = ''" class="text-emerald-600 hover:text-emerald-800 p-1">
                <X class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Detailed Filters & Controls Toolbar -->
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-xs mb-3 space-y-3 shrink-0">
              
              <!-- Filter Row 1: Search, Classroom, Status -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <!-- Search Box -->
                <div class="sm:col-span-5 relative">
                  <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    v-model="studentSearchQuery" 
                    type="text" 
                    placeholder="ค้นหาชื่อ, รหัสนักศึกษา หรือชื่อเล่น..."
                    class="w-full pl-9 pr-8 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                  <button v-if="studentSearchQuery" @click="studentSearchQuery = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Classroom Filter Custom Dropdown -->
                <div class="sm:col-span-4 relative">
                  <button 
                    type="button"
                    @click.stop="isClassroomDropdownOpen = !isClassroomDropdownOpen; isStatusDropdownOpen = false"
                    class="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-700 flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs select-none"
                    :class="{ 'ring-2 ring-emerald-500 bg-white border-emerald-400': isClassroomDropdownOpen }"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <School v-if="selectedClassroomFilter === 'all'" class="w-4 h-4 text-emerald-600 shrink-0" />
                      <GraduationCap v-else class="w-4 h-4 text-emerald-600 shrink-0" />
                      <span class="truncate">
                        {{ selectedClassroomFilter === 'all' ? 'ทุกห้องเรียน (ทั้งหมด)' : `ห้อง ${selectedClassroomFilter}` }}
                      </span>
                    </div>
                    <ChevronDown class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180 text-emerald-600': isClassroomDropdownOpen }" />
                  </button>

                  <!-- Backdrop to close -->
                  <div v-if="isClassroomDropdownOpen" @click="isClassroomDropdownOpen = false" class="fixed inset-0 z-20"></div>

                  <!-- Dropdown Menu -->
                  <div 
                    v-if="isClassroomDropdownOpen"
                    class="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-30 max-h-60 overflow-y-auto no-scrollbar animate-[fadeIn_0.15s_ease-out]"
                  >
                    <button 
                      type="button"
                      @click="selectedClassroomFilter = 'all'; isClassroomDropdownOpen = false"
                      class="w-full px-3.5 py-2 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      :class="selectedClassroomFilter === 'all' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'"
                    >
                      <div class="flex items-center gap-2.5">
                        <School class="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>ทุกห้องเรียน (ทั้งหมด)</span>
                      </div>
                      <Check v-if="selectedClassroomFilter === 'all'" class="w-4 h-4 text-emerald-600 shrink-0" />
                    </button>

                    <button 
                      v-for="room in availableClassrooms" 
                      :key="room"
                      type="button"
                      @click="selectedClassroomFilter = room; isClassroomDropdownOpen = false"
                      class="w-full px-3.5 py-2 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      :class="selectedClassroomFilter === room ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'"
                    >
                      <div class="flex items-center gap-2.5">
                        <GraduationCap class="w-4 h-4 text-stone-500 shrink-0" />
                        <span>ห้อง {{ room }}</span>
                      </div>
                      <Check v-if="selectedClassroomFilter === room" class="w-4 h-4 text-emerald-600 shrink-0" />
                    </button>
                  </div>
                </div>

                <!-- Status Filter Custom Dropdown -->
                <div class="sm:col-span-3 relative">
                  <button 
                    type="button"
                    @click.stop="isStatusDropdownOpen = !isStatusDropdownOpen; isClassroomDropdownOpen = false"
                    class="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-700 flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs select-none"
                    :class="{ 'ring-2 ring-emerald-500 bg-white border-emerald-400': isStatusDropdownOpen }"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <component :is="currentStatusOption.icon" class="w-4 h-4 shrink-0" :class="currentStatusOption.iconColor" />
                      <span class="truncate">{{ currentStatusOption.label }}</span>
                    </div>
                    <ChevronDown class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180 text-emerald-600': isStatusDropdownOpen }" />
                  </button>

                  <!-- Backdrop to close -->
                  <div v-if="isStatusDropdownOpen" @click="isStatusDropdownOpen = false" class="fixed inset-0 z-20"></div>

                  <!-- Dropdown Menu -->
                  <div 
                    v-if="isStatusDropdownOpen"
                    class="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-30 overflow-hidden animate-[fadeIn_0.15s_ease-out]"
                  >
                    <button 
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      type="button"
                      @click="selectedStatusFilter = opt.value; isStatusDropdownOpen = false"
                      class="w-full px-3.5 py-2 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      :class="selectedStatusFilter === opt.value ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'"
                    >
                      <div class="flex items-center gap-2.5">
                        <component :is="opt.icon" class="w-4 h-4 shrink-0" :class="opt.iconColor" />
                        <span>{{ opt.label }}</span>
                      </div>
                      <Check v-if="selectedStatusFilter === opt.value" class="w-4 h-4 text-emerald-600 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Filter Row 2: Batch Select Actions & Counts -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                <div class="flex items-center gap-2">
                  <!-- Select All Button -->
                  <button 
                    type="button"
                    @click="toggleSelectAll"
                    class="px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold cursor-pointer"
                    :class="isAllFilteredSelected 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'"
                  >
                    <CheckSquare v-if="isAllFilteredSelected" class="w-3.5 h-3.5" />
                    <Square v-else class="w-3.5 h-3.5 text-stone-400" />
                    <span>{{ isAllFilteredSelected ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทุกคนที่ยังไม่ครบ' }}</span>
                  </button>

                  <!-- Clear Selection Button -->
                  <button 
                    v-if="selectedStudentIds.length > 0"
                    type="button"
                    @click="clearSelection"
                    class="px-2.5 py-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw class="w-3 h-3" />
                    <span>ล้างการเลือก</span>
                  </button>
                </div>

                <!-- Status Badges -->
                <div class="flex items-center gap-2">
                  <span class="text-stone-400">พบ {{ filteredStudents.length }} คน</span>
                  <span 
                    class="px-2.5 py-1 rounded-full font-bold transition-all"
                    :class="selectedStudentIds.length > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-500'"
                  >
                    เลือกแล้ว {{ selectedStudentIds.length }} คน
                  </span>
                </div>
              </div>

            </div>

            <!-- Students Cards Grid -->
            <div class="flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="student in filteredStudents" 
                  :key="student.studentId || student.id"
                  @click="toggleSelectStudent(student.studentId || student.id)"
                  class="bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer relative flex flex-col justify-between group shadow-xs select-none"
                  :class="[
                    isStudentSelected(student.studentId || student.id)
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-400/20'
                      : (getCompletions(student.studentId || student.id) >= (awardingQuest?.maxCompletions || 1) && awardingQuest?.maxCompletions > 0)
                        ? 'border-stone-100 bg-stone-50/80 opacity-70 cursor-default'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/50'
                  ]"
                >
                  <!-- Card Header: Checkbox + Avatar + Info -->
                  <div class="flex items-start gap-2.5">
                    <!-- Checkbox -->
                    <div class="mt-0.5 shrink-0">
                      <div 
                        class="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all"
                        :class="isStudentSelected(student.studentId || student.id) 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : (getCompletions(student.studentId || student.id) >= (awardingQuest?.maxCompletions || 1) && awardingQuest?.maxCompletions > 0)
                            ? 'bg-stone-100 border-stone-200 text-transparent'
                            : 'bg-white border-stone-300 group-hover:border-emerald-400'"
                      >
                        <Check v-if="isStudentSelected(student.studentId || student.id)" class="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <!-- Avatar + Frame -->
                    <div class="relative w-10 h-10 shrink-0">
                      <img 
                        v-if="student.equippedFrame" 
                        :src="student.equippedFrame"
                        class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" 
                      />
                      <div class="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold overflow-hidden border border-emerald-200 relative z-0 text-xs">
                        <img 
                          :src="(student.avatar && (student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.includes('localhost') || student.avatar.startsWith('data:'))) ? (student.avatar.startsWith('http') ? student.avatar : (student.avatar.startsWith('data:') ? student.avatar : `http://${student.avatar}`)) : '/placeholder_profile.png'"
                          class="w-full h-full object-cover object-top" 
                          @error="$event.target.src = '/placeholder_profile.png'"
                        />
                      </div>
                    </div>

                    <!-- Student Name & Classroom -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <p class="text-xs font-bold text-stone-900 truncate" :title="student.name">{{ student.name }}</p>
                        <span v-if="student.nickname" class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                          {{ student.nickname }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="text-[10px] text-stone-400 font-mono">{{ student.studentId }}</span>
                        <span class="px-1.5 py-0.2 bg-stone-100 rounded text-[9px] font-bold text-stone-600">
                          {{ student.classroom }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Card Footer: Progress Bar + Action -->
                  <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <!-- Progress Bar & Count -->
                    <div class="flex-1">
                      <div class="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span class="text-stone-500">ความคืบหน้า</span>
                        <span 
                          :class="(getCompletions(student.studentId || student.id) >= (awardingQuest?.maxCompletions || 1) && awardingQuest?.maxCompletions > 0) ? 'text-emerald-700 font-black' : 'text-stone-700 font-mono'"
                        >
                          {{ getCompletions(student.studentId || student.id) }} / {{ awardingQuest?.maxCompletions || 1 }} ครั้ง
                        </span>
                      </div>
                      <div class="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-300"
                          :class="(getCompletions(student.studentId || student.id) >= (awardingQuest?.maxCompletions || 1) && awardingQuest?.maxCompletions > 0) ? 'bg-emerald-500' : 'bg-amber-400'"
                          :style="`width: ${Math.min(100, (getCompletions(student.studentId || student.id) / (awardingQuest?.maxCompletions || 1)) * 100)}%`"
                        ></div>
                      </div>
                    </div>

                    <!-- Quick +1 Button or Completed Badge -->
                    <div class="shrink-0">
                      <span 
                        v-if="getCompletions(student.studentId || student.id) >= (awardingQuest?.maxCompletions || 1) && awardingQuest?.maxCompletions > 0"
                        class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-0.5"
                      >
                        <CheckCircle class="w-3 h-3 text-emerald-600" /> รับครบแล้ว
                      </span>
                      <button 
                        v-else
                        type="button"
                        @click.stop="handleQuickAward(student.studentId || student.id)"
                        :disabled="isAwarding"
                        class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 rounded-lg text-[10px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="มอบรางวัล +1 ให้คนนี้ทันที"
                      >
                        <Plus class="w-3 h-3" />
                        <span>+1 มอบ</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredStudents.length === 0" class="py-16 text-center text-stone-400">
                <Search class="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p class="font-bold text-sm">ไม่พบรายชื่อนักศึกษาตามเงื่อนไขตัวกรอง</p>
                <p class="text-xs mt-1 text-stone-400">ลองล้างคำค้นหาหรือเปลี่ยนห้องเรียน</p>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 bg-white border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <!-- Left Info -->
            <div class="text-xs text-stone-500 flex items-center gap-2">
              <span class="font-bold text-stone-800">เลือกอยู่ {{ selectedStudentIds.length }} คน</span>
              <span v-if="selectedStudentIds.length > 0" class="text-stone-400">• จะได้รับรางวัลคนละ {{ awardingQuest?.rewards?.map(r => r.type === 'coin' ? `${r.amount} Coins` : r.name).join(' + ') }}</span>
            </div>

            <!-- Right Buttons -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                type="button"
                @click="showAwardModal = false"
                class="px-4 py-2.5 rounded-xl text-stone-600 font-bold hover:bg-stone-100 transition-colors cursor-pointer text-xs sm:text-sm"
              >
                ปิดหน้าต่าง
              </button>

              <button 
                type="button"
                @click="handleAwardQuest" 
                :disabled="selectedStudentIds.length === 0 || isAwarding"
                class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <Gift v-if="!isAwarding" class="w-4 h-4" />
                <svg v-else class="animate-spin -ml-0.5 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isAwarding ? 'กำลังบันทึก...' : `มอบรางวัลให้นักศึกษาที่เลือก (${selectedStudentIds.length} คน)` }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
