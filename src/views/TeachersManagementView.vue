<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ShieldCheck,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  KeyRound,
  Copy,
  Check,
  BookOpen,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Edit3,
  Filter,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  ChevronDown,
  Layers,
  Database,
  GitBranch,
  LineChart,
  Cpu
} from '@lucide/vue'
import { courses } from '../data/courses'
import {
  teachersList,
  isLoadingTeachers,
  fetchTeachers,
  createTeacherAccount,
  updateTeacherAccount,
  deleteTeacherAccount
} from '../data/teachersStore'
import ConfirmModal from '@/components/ConfirmModal.vue'
import StudentAvatar from '@/components/StudentAvatar.vue'

const courseIcons = {
  '31901-2007': Database,
  '21901-2012': GitBranch,
  '31901-2012': LineChart,
  '21901-2007': Cpu
}

// Filters & UI state
const searchQuery = ref('')
const selectedCourseFilter = ref('all')
const showCourseFilterMenu = ref(false)
const toastMessage = ref('')
const copiedTeacherId = ref(null)
const isSaving = ref(false)
const modalError = ref('')
const listError = ref('')

const handleOutsideClick = (e) => {
  if (!e.target.closest('.teacher-course-filter-dropdown')) {
    showCourseFilterMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// Create / Edit modal state
const showFormModal = ref(false)
const isEditMode = ref(false)
const editingTeacherId = ref(null)

const positionPresets = ['ครูประจำวิชา', 'ครูพี่เลี้ยง', 'หัวหน้าแผนก']

const form = ref({
  username: '',
  name: '',
  teacherPosition: 'ครูประจำวิชา',
  courseIds: [],
  canGrade: false,
  password: '',
  resetPassword: false
})

// Confirm modal state
const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'confirm',
  confirmText: 'ยืนยัน',
  onConfirm: null
})

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = ''
  }, 3200)
}

const loadTeachers = async () => {
  listError.value = ''
  try {
    await fetchTeachers()
  } catch (err) {
    listError.value = err?.message || 'ไม่สามารถโหลดรายชื่อครูประจำวิชาได้'
  }
}

onMounted(() => {
  loadTeachers()
})

// Stats
const stats = computed(() => {
  const all = teachersList.value
  const activeCount = all.filter(t => t.isActive !== false).length
  const canGradeCount = all.filter(t => Boolean(t.canGrade)).length
  const coveredCourseIds = new Set()
  all.forEach(t => {
    if (t.isActive !== false && Array.isArray(t.courseIds)) {
      t.courseIds.forEach(cid => coveredCourseIds.add(cid))
    }
  })
  return {
    total: all.length,
    active: activeCount,
    canGrade: canGradeCount,
    coveredCourses: coveredCourseIds.size
  }
})

// Filtered table rows
const filteredTeachers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return teachersList.value.filter(t => {
    if (selectedCourseFilter.value !== 'all') {
      if (!Array.isArray(t.courseIds) || !t.courseIds.includes(selectedCourseFilter.value)) {
        return false
      }
    }
    if (!q) return true
    return (
      (t.name || '').toLowerCase().includes(q) ||
      (t.studentId || '').toLowerCase().includes(q) ||
      (t.teacherPosition || '').toLowerCase().includes(q)
    )
  })
})

const getCourseObj = (courseId) => {
  return courses.find(c => c.id === courseId) || null
}

// Modal Openers
const openCreateModal = () => {
  isEditMode.value = false
  editingTeacherId.value = null
  modalError.value = ''
  form.value = {
    username: '',
    name: '',
    teacherPosition: 'ครูประจำวิชา',
    courseIds: courses.length > 0 ? [courses[0].id] : [],
    canGrade: false,
    password: '',
    resetPassword: false
  }
  showFormModal.value = true
}

const openEditModal = (teacher) => {
  isEditMode.value = true
  editingTeacherId.value = teacher.studentId || teacher.id
  modalError.value = ''
  form.value = {
    username: teacher.studentId || teacher.username,
    name: teacher.name || '',
    teacherPosition: teacher.teacherPosition || 'ครูประจำวิชา',
    courseIds: Array.isArray(teacher.courseIds) ? [...teacher.courseIds] : [],
    canGrade: Boolean(teacher.canGrade),
    password: '',
    resetPassword: false
  }
  showFormModal.value = true
}

const toggleCourseSelection = (courseId) => {
  const list = form.value.courseIds
  if (list.includes(courseId)) {
    form.value.courseIds = list.filter(id => id !== courseId)
  } else {
    form.value.courseIds = [...list, courseId]
  }
}

const selectAllCourses = () => {
  form.value.courseIds = courses.map(c => c.id)
}

const clearAllCourses = () => {
  form.value.courseIds = []
}

// Submit Create / Update
const handleSaveTeacher = async () => {
  modalError.value = ''
  const cleanUsername = String(form.value.username || '').trim()
  const cleanName = String(form.value.name || '').trim()
  const cleanPass = String(form.value.password || '').trim()

  if (!isEditMode.value) {
    if (!cleanUsername || cleanUsername.length < 3 || /\s/.test(cleanUsername)) {
      modalError.value = 'ชื่อผู้ใช้งาน (Username) ต้องมีอย่างน้อย 3 ตัวอักษรและห้ามเว้นวรรค'
      return
    }
  }
  if (!cleanName) {
    modalError.value = 'กรุณากรอกชื่อ - นามสกุล'
    return
  }
  if (!Array.isArray(form.value.courseIds) || form.value.courseIds.length === 0) {
    modalError.value = 'กรุณาเลือกอย่างน้อย 1 รายวิชาที่ครูประจำวิชาสามารถเข้าดูได้'
    return
  }
  if (cleanPass && cleanPass.length < 4) {
    modalError.value = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'
    return
  }

  isSaving.value = true
  try {
    if (isEditMode.value) {
      await updateTeacherAccount(editingTeacherId.value, {
        name: cleanName,
        teacherPosition: form.value.teacherPosition,
        courseIds: form.value.courseIds,
        canGrade: form.value.canGrade,
        resetPassword: form.value.resetPassword,
        ...(cleanPass && !form.value.resetPassword ? { newPassword: cleanPass } : {})
      })
      showToast(`อัปเดตข้อมูล "${cleanName}" เรียบร้อยแล้ว`)
    } else {
      await createTeacherAccount({
        username: cleanUsername,
        name: cleanName,
        teacherPosition: form.value.teacherPosition,
        courseIds: form.value.courseIds,
        canGrade: form.value.canGrade,
        password: cleanPass || null
      })
      showToast(`สร้างบัญชี "${cleanUsername}" สำเร็จแล้ว`)
    }
    showFormModal.value = false
  } catch (err) {
    modalError.value = err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    isSaving.value = false
  }
}

// Active Status Toggle
const handleToggleActive = async (teacher) => {
  const nextActive = teacher.isActive === false
  try {
    await updateTeacherAccount(teacher.studentId || teacher.id, { isActive: nextActive })
    showToast(nextActive ? `เปิดใช้งานบัญชี "${teacher.name}" แล้ว` : `ระงับบัญชี "${teacher.name}" ชั่วคราวแล้ว`)
  } catch (err) {
    showToast(err?.message || 'ไม่สามารถเปลี่ยนสถานะบัญชีได้')
  }
}

// Quick Reset Password
const handleConfirmResetPassword = (teacher) => {
  confirmState.value = {
    isOpen: true,
    title: 'ยืนยันการรีเซ็ตรหัสผ่าน',
    message: `ต้องการล้างรหัสผ่านของ "${teacher.name}" (@${teacher.studentId}) เพื่อให้ตั้งรหัสผ่านใหม่เมื่อเข้าสู่ระบบครั้งถัดไปใช่หรือไม่?`,
    type: 'confirm',
    confirmText: 'ล้างรหัสผ่าน',
    onConfirm: async () => {
      try {
        await updateTeacherAccount(teacher.studentId || teacher.id, { resetPassword: true })
        showToast(`ล้างรหัสผ่านของ "${teacher.name}" แล้ว`)
      } catch (err) {
        showToast(err?.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้')
      }
    }
  }
}

// Delete Teacher Account
const handleConfirmDelete = (teacher) => {
  confirmState.value = {
    isOpen: true,
    title: 'ยืนยันการลบบัญชีครูประจำวิชา',
    message: `ต้องการลบบัญชี "${teacher.name}" (@${teacher.studentId}) ออกจากระบบใช่หรือไม่? การลบไม่สามารถกู้คืนได้`,
    type: 'danger',
    confirmText: 'ลบบัญชี',
    onConfirm: async () => {
      try {
        await deleteTeacherAccount(teacher.studentId || teacher.id)
        showToast(`ลบบัญชี "${teacher.name}" เรียบร้อยแล้ว`)
      } catch (err) {
        showToast(err?.message || 'ไม่สามารถลบบัญชีได้')
      }
    }
  }
}

// Copy Login Credentials
const handleCopyCredentials = async (teacher) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const courseNames = (teacher.courseIds || [])
    .map(cid => {
      const c = getCourseObj(cid)
      return c ? `${c.code} ${c.name}` : cid
    })
    .join(', ')
  const passNote = teacher.hasPassword ? '(ใช้รหัสผ่านที่ครูผู้สอนกำหนดให้)' : '(เข้าสู่ระบบครั้งแรก ระบบจะให้ตั้งรหัสผ่านเอง)'
  const text = [
    `ข้อมูลเข้าสู่ระบบสำหรับ${teacher.teacherPosition || 'ครูประจำวิชา'}`,
    `ลิงก์เข้าสู่ระบบ: ${origin}/login`,
    `ชื่อผู้ใช้งาน (Username): ${teacher.studentId}`,
    `รหัสผ่าน: ${passNote}`,
    `รายวิชาที่เข้าดูได้: ${courseNames || '-'}`,
    `สิทธิ์การใช้งาน: ${teacher.canGrade ? 'ดูเนื้อหา + ตรวจงาน/เช็กชื่อได้' : 'ดูเนื้อหาและคะแนนอย่างเดียว'}`
  ].join('\n')

  try {
    await navigator.clipboard.writeText(text)
    copiedTeacherId.value = teacher.studentId
    showToast(`คัดลอกข้อมูลเข้าสู่ระบบของ "${teacher.name}" แล้ว`)
    setTimeout(() => {
      if (copiedTeacherId.value === teacher.studentId) copiedTeacherId.value = null
    }, 2000)
  } catch {
    showToast('ไม่สามารถคัดลอกลงคลิปบอร์ดได้')
  }
}
</script>

<template>
  <div class="space-y-8 pb-16 animate-[fadeIn_0.3s_ease-out]">

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 px-4 py-3 bg-stone-900 text-white text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-2 animate-[bounceIn_0.3s_ease-out]"
    >
      <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
            จัดการบัญชีครูประจำวิชา
          </h2>
          <p class="text-sm text-stone-500">
            สร้างบัญชีและกำหนดสิทธิ์ให้ครูประจำวิชาเข้าดูเนื้อหา สไลด์ และผลการเรียนเฉพาะรายวิชาที่รับผิดชอบ
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
      >
        <UserPlus class="w-4 h-4" />
        <span>สร้างบัญชีครูประจำวิชา</span>
      </button>
    </div>

    <!-- 4 Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
        <div class="text-xs font-bold text-stone-500">ครูประจำวิชาทั้งหมด</div>
        <div class="text-3xl font-black font-mono text-stone-900">{{ stats.total }}</div>
        <div class="text-[11px] text-stone-400">บัญชีในระบบทั้งหมด</div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
        <div class="text-xs font-bold text-emerald-700">บัญชีที่เปิดใช้งาน</div>
        <div class="text-3xl font-black font-mono text-emerald-700">{{ stats.active }}</div>
        <div class="text-[11px] text-emerald-600/80">สามารถเข้าสู่ระบบได้</div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-indigo-200 shadow-2xs space-y-1">
        <div class="text-xs font-bold text-indigo-700">สิทธิ์ตรวจงาน &amp; เช็กชื่อ</div>
        <div class="text-3xl font-black font-mono text-indigo-700">{{ stats.canGrade }}</div>
        <div class="text-[11px] text-indigo-600/80">ลงคะแนนในวิชาตนได้</div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-sky-200 shadow-2xs space-y-1">
        <div class="text-xs font-bold text-sky-700">รายวิชาที่มีผู้ดูแล</div>
        <div class="text-3xl font-black font-mono text-sky-700">
          {{ stats.coveredCourses }} <span class="text-base text-stone-400">/ {{ courses.length }}</span>
        </div>
        <div class="text-[11px] text-sky-600/80">รายวิชาที่เปิดสอน</div>
      </div>
    </div>

    <!-- Error Alert if failed to load -->
    <div
      v-if="listError"
      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
        <span>{{ listError }}</span>
      </div>
      <button
        type="button"
        @click="loadTeachers"
        class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shrink-0"
      >
        ลองใหม่
      </button>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาชื่อครูประจำวิชา, Username หรือตำแหน่ง..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Custom Professional Course Filter Dropdown -->
        <div class="relative teacher-course-filter-dropdown">
          <button
            type="button"
            @click="showCourseFilterMenu = !showCourseFilterMenu"
            class="flex items-center justify-between gap-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-700 transition-all cursor-pointer min-w-[230px]"
            :class="{ 'ring-2 ring-emerald-500/40 border-emerald-400 bg-white': showCourseFilterMenu }"
          >
            <div class="flex items-center gap-2 truncate">
              <Filter class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span class="truncate">
                {{ selectedCourseFilter === 'all' ? 'ทุกวิชาในระบบ (ทั้งหมด)' : `${getCourseObj(selectedCourseFilter)?.code} - ${getCourseObj(selectedCourseFilter)?.name}` }}
              </span>
            </div>
            <ChevronDown class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180 text-emerald-600': showCourseFilterMenu }" />
          </button>

          <!-- Floating Dropdown Menu -->
          <div
            v-if="showCourseFilterMenu"
            class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-1.5 z-50 space-y-1 animate-[fadeIn_0.15s_ease-out]"
          >
            <button
              type="button"
              @click="selectedCourseFilter = 'all'; showCourseFilterMenu = false"
              class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
              :class="selectedCourseFilter === 'all' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-50 text-stone-700'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <Layers class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs font-bold">ทุกวิชาในระบบ</div>
                  <div class="text-[10px] text-stone-400">แสดงครูประจำวิชาทั้งหมด ({{ courses.length }} รายวิชา)</div>
                </div>
              </div>
              <Check v-if="selectedCourseFilter === 'all'" class="w-4 h-4 text-emerald-600 shrink-0" />
            </button>

            <div class="border-t border-stone-100 my-1"></div>

            <button
              v-for="c in courses"
              :key="c.id"
              type="button"
              @click="selectedCourseFilter = c.id; showCourseFilterMenu = false"
              class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
              :class="selectedCourseFilter === c.id ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-stone-50 text-stone-700'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="c.levelGroup === 'ปวส.' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'"
                >
                  <component :is="courseIcons[c.id] || BookOpen" class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-stone-900 truncate">{{ c.name }}</div>
                  <div class="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <span class="font-mono text-emerald-700 font-semibold">{{ c.code }}</span>
                    <span>•</span>
                    <span>ห้อง {{ c.level }}</span>
                  </div>
                </div>
              </div>
              <Check v-if="selectedCourseFilter === c.id" class="w-4 h-4 text-emerald-600 shrink-0" />
            </button>
          </div>
        </div>

        <button
          type="button"
          @click="loadTeachers"
          :disabled="isLoadingTeachers"
          class="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoadingTeachers }" />
          <span>รีเฟรช</span>
        </button>
      </div>
    </div>

    <!-- Teachers List Table -->
    <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-stone-700">
          <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="py-3.5 px-4">ครูประจำวิชา / Username</th>
              <th class="py-3.5 px-4">รายวิชาที่เข้าดูได้</th>
              <th class="py-3.5 px-4">สิทธิ์การใช้งาน</th>
              <th class="py-3.5 px-4 text-center">สถานะรหัสผ่าน</th>
              <th class="py-3.5 px-4 text-center">สถานะบัญชี</th>
              <th class="py-3.5 px-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr
              v-for="t in filteredTeachers"
              :key="t.id || t.studentId"
              class="hover:bg-stone-50/80 transition-colors"
              :class="{ 'opacity-60 bg-stone-50/40': t.isActive === false }"
            >
              <!-- Name & Username -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <StudentAvatar
                    :avatar="t.avatar"
                    :frame="t.equippedFrame || '/img/frame/Teacher.png'"
                    :name="t.name"
                    size="w-9 h-9"
                    avatarClass="bg-sky-100 text-sky-800 text-xs"
                    class="shrink-0"
                  />
                  <div>
                    <div class="font-bold text-stone-900 text-sm">{{ t.name }}</div>
                    <div class="flex items-center gap-2 text-[11px] text-stone-500">
                      <span class="font-mono font-bold text-sky-700">@{{ t.studentId }}</span>
                      <span>•</span>
                      <span>{{ t.teacherPosition || 'ครูประจำวิชา' }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Assigned Courses -->
              <td class="py-3.5 px-4">
                <div class="flex flex-wrap gap-1.5 max-w-xs">
                  <span
                    v-for="cid in t.courseIds"
                    :key="cid"
                    class="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-800 inline-flex items-center gap-1"
                    :title="getCourseObj(cid)?.name || cid"
                  >
                    <BookOpen class="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{{ getCourseObj(cid)?.code || cid }}</span>
                    <span class="text-stone-500 font-normal truncate max-w-[120px]">{{ getCourseObj(cid)?.name || '' }}</span>
                  </span>
                  <span v-if="!t.courseIds?.length" class="text-stone-400 italic">ยังไม่ได้เลือกรายวิชา</span>
                </div>
              </td>

              <!-- Permission Level -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  v-if="t.canGrade"
                  class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <Edit3 class="w-3 h-3" />
                  <span>ตรวจงาน &amp; เช็กชื่อได้</span>
                </span>
                <span
                  v-else
                  class="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <Eye class="w-3 h-3" />
                  <span>ดูเนื้อหาอย่างเดียว</span>
                </span>
              </td>

              <!-- Password Status -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span
                  v-if="t.hasPassword"
                  class="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <CheckCircle2 class="w-3 h-3 text-emerald-600" />
                  <span>ตั้งรหัสผ่านแล้ว</span>
                </span>
                <span
                  v-else
                  class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <KeyRound class="w-3 h-3 text-amber-600" />
                  <span>รอตั้งรหัสครั้งแรก</span>
                </span>
              </td>

              <!-- Active Status Toggle -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <button
                  type="button"
                  @click="handleToggleActive(t)"
                  class="px-3 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 border transition-colors cursor-pointer"
                  :class="t.isActive !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'"
                  :title="t.isActive !== false ? 'คลิกเพื่อระงับบัญชีชั่วคราว' : 'คลิกเพื่อเปิดใช้งานบัญชี'"
                >
                  <CheckCircle2 v-if="t.isActive !== false" class="w-3 h-3" />
                  <XCircle v-else class="w-3 h-3" />
                  <span>{{ t.isActive !== false ? 'เปิดใช้งาน' : 'ระงับชั่วคราว' }}</span>
                </button>
              </td>

              <!-- Action Buttons -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    @click="handleCopyCredentials(t)"
                    class="p-2 rounded-xl bg-stone-100 hover:bg-sky-100 text-stone-600 hover:text-sky-700 transition-colors cursor-pointer"
                    title="คัดลอกข้อมูลเข้าสู่ระบบส่งให้ครูประจำวิชา"
                  >
                    <Check v-if="copiedTeacherId === t.studentId" class="w-4 h-4 text-emerald-600" />
                    <Copy v-else class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    @click="openEditModal(t)"
                    class="p-2 rounded-xl bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    title="แก้ไขข้อมูลและรายวิชา"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    @click="handleConfirmResetPassword(t)"
                    class="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
                    title="ล้างรหัสผ่านเพื่อให้ตั้งรหัสผ่านใหม่"
                  >
                    <KeyRound class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    @click="handleConfirmDelete(t)"
                    class="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 transition-colors cursor-pointer"
                    title="ลบบัญชีครูประจำวิชา"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredTeachers.length === 0">
              <td colspan="6" class="py-12 text-center text-stone-400 space-y-2">
                <div class="font-bold text-stone-500">
                  {{ isLoadingTeachers ? 'กำลังโหลดข้อมูล...' : 'ยังไม่มีบัญชีครูประจำวิชาในระบบ (หรือไม่มีรายการที่ตรงกับคำค้นหา)' }}
                </div>
                <div v-if="!isLoadingTeachers && teachersList.length === 0" class="text-xs">
                  กดปุ่ม "สร้างบัญชีครูประจำวิชา" มุมขวาบนเพื่อเพิ่มบัญชีครูสำหรับเข้าดูเนื้อหาเฉพาะวิชา
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Subject Teacher Modal -->
    <Teleport to="body">
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
        @click.self="showFormModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col">
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <ShieldCheck class="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 class="font-black text-base">
                  {{ isEditMode ? 'แก้ไขบัญชีครูประจำวิชา' : 'สร้างบัญชีครูประจำวิชาใหม่' }}
                </h3>
                <p class="text-[11px] text-emerald-200">
                  กำหนด Username, รายวิชาที่รับผิดชอบ และขอบเขตสิทธิ์การใช้งาน
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="showFormModal = false"
              class="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Form Body -->
          <form @submit.prevent="handleSaveTeacher" class="p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
            <!-- Username -->
            <div class="space-y-1.5">
              <label class="block font-bold text-stone-800">
                ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบ (Username) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.username"
                type="text"
                :disabled="isEditMode"
                placeholder="เช่น teacher_db หรือ kru_somchai"
                class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-100 disabled:text-stone-500"
              />
              <p class="text-[11px] text-stone-400">
                {{ isEditMode ? 'ไม่สามารถเปลี่ยน Username หลังสร้างบัญชีได้' : 'ใช้ตัวอักษรภาษาอังกฤษ ตัวเลข จุด ขีดล่าง หรือขีดกลาง (ห้ามเว้นวรรค)' }}
              </p>
            </div>

            <!-- Full Name -->
            <div class="space-y-1.5">
              <label class="block font-bold text-stone-800">
                ชื่อ - นามสกุล <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="เช่น อาจารย์สมชาย ใจดี"
                class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <!-- Position -->
            <div class="space-y-1.5">
              <label class="block font-bold text-stone-800">ตำแหน่ง / บทบาทที่แสดง</label>
              <input
                v-model="form.teacherPosition"
                type="text"
                placeholder="เช่น ครูประจำวิชา"
                class="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="pos in positionPresets"
                  :key="pos"
                  type="button"
                  @click="form.teacherPosition = pos"
                  class="px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer"
                  :class="form.teacherPosition === pos
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'"
                >
                  {{ pos }}
                </button>
              </div>
            </div>

            <!-- Assigned Courses (Custom Checkbox Cards matching AddStudentModal) -->
            <div class="space-y-2 pt-1">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <label class="font-bold text-stone-800 flex items-center gap-1.5">
                  <GraduationCap class="w-3.5 h-3.5 text-emerald-600" />
                  <span>รายวิชาที่อนุญาตให้เข้าดูได้ <span class="text-rose-500">*</span></span>
                </label>
                <div class="flex items-center gap-2 text-[11px]">
                  <span class="text-emerald-700 font-semibold mr-1">เลือกแล้ว {{ form.courseIds.length }} วิชา</span>
                  <button type="button" @click="selectAllCourses" class="text-emerald-700 hover:underline font-bold cursor-pointer">
                    เลือกทุกวิชา
                  </button>
                  <span class="text-stone-300">|</span>
                  <button type="button" @click="clearAllCourses" class="text-stone-500 hover:underline font-bold cursor-pointer">
                    ล้างทั้งหมด
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="c in courses"
                  :key="c.id"
                  @click="toggleCourseSelection(c.id)"
                  :class="[
                    'p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none',
                    form.courseIds.includes(c.id)
                      ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                  ]"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      :class="[
                        'w-5 h-5 rounded-lg flex items-center justify-center transition-colors border shrink-0',
                        form.courseIds.includes(c.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'border-stone-300 bg-white'
                      ]"
                    >
                      <Check v-if="form.courseIds.includes(c.id)" class="w-3.5 h-3.5" stroke-width="3" />
                    </div>

                    <div class="min-w-0">
                      <span class="text-xs font-bold text-stone-900 block truncate">{{ c.name }}</span>
                      <span class="text-[10px] text-stone-500">รหัส {{ c.code }} • ระดับ {{ c.level }}</span>
                    </div>
                  </div>

                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0',
                      c.levelGroup === 'ปวส.'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-purple-100 text-purple-800 border-purple-200'
                    ]"
                  >
                    {{ c.levelGroup }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Grading Permission (Custom Checkbox Card) -->
            <div
              @click="form.canGrade = !form.canGrade"
              :class="[
                'flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all select-none',
                form.canGrade
                  ? 'bg-indigo-50/90 border-indigo-400 ring-1 ring-indigo-400/50 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              ]"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-lg flex items-center justify-center transition-colors border shrink-0 mt-0.5',
                  form.canGrade
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                    : 'border-stone-300 bg-white'
                ]"
              >
                <Check v-if="form.canGrade" class="w-3.5 h-3.5" stroke-width="3" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-stone-900 flex items-center justify-between gap-2">
                  <span>อนุญาตให้ตรวจงาน ลงคะแนน และเช็กชื่อในรายวิชาที่ดูแลได้</span>
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0"
                    :class="form.canGrade
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      : 'bg-stone-200/70 text-stone-600 border-stone-300'"
                  >
                    {{ form.canGrade ? 'ตรวจงานได้' : 'View-Only' }}
                  </span>
                </div>
                <p class="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  หากไม่ติ๊ก ครูประจำวิชาจะดูเนื้อหา สไลด์ โจทย์ใบงาน และดูคะแนน/สถิติเข้าเรียนได้อย่างเดียว (View-Only)
                </p>
              </div>
            </div>

            <!-- Password Options -->
            <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div
                v-if="isEditMode"
                @click="form.resetPassword = !form.resetPassword"
                class="flex items-center gap-2.5 font-bold text-amber-900 cursor-pointer select-none"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-lg flex items-center justify-center transition-colors border shrink-0',
                    form.resetPassword
                      ? 'bg-amber-600 border-amber-600 text-white shadow-2xs'
                      : 'border-stone-300 bg-white'
                  ]"
                >
                  <Check v-if="form.resetPassword" class="w-3.5 h-3.5" stroke-width="3" />
                </div>
                <span>ล้างรหัสผ่านเดิม (ให้ครูประจำวิชาตั้งรหัสผ่านใหม่ตอนเข้าสู่ระบบครั้งถัดไป)</span>
              </div>

              <div v-if="!isEditMode || !form.resetPassword" class="space-y-1">
                <label class="block font-bold text-stone-800">
                  {{ isEditMode ? 'กำหนดรหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)' : 'รหัสผ่านเริ่มต้น (เว้นว่างได้)' }}
                </label>
                <input
                  v-model="form.password"
                  type="text"
                  placeholder="อย่างน้อย 4 ตัวอักษร (หากเว้นว่าง ระบบจะให้ตั้งรหัสเองตอนเข้าครั้งแรก)"
                  class="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Inline Error -->
            <div
              v-if="modalError"
              class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2"
            >
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ modalError }}</span>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                @click="showFormModal = false"
                class="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                {{ isSaving ? 'กำลังบันทึก...' : (isEditMode ? 'บันทึกการแก้ไข' : 'สร้างบัญชีทันที') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :type="confirmState.type"
      :confirmText="confirmState.confirmText"
      @confirm="confirmState.onConfirm && confirmState.onConfirm()"
    />
  </div>
</template>
