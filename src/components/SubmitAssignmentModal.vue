<script setup>
import { ref, computed, watch } from 'vue'
import {
  X, UploadCloud, Link as LinkIcon, FileText, CheckCircle2,
  AlertCircle, Pencil, Users, User, UserPlus, Plus, Trash2,
  ExternalLink, Search
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { studentsList, isStudentInCourse, isStudent, isTeacherUser } from '@/data/studentsStore'
import {
  submissionsStore,
  submitAssignmentLink,
  fetchSubmissions,
  formatExternalUrl,
  getAssignmentSetting
} from '@/data/gradesStore'

const props = defineProps({
  isOpen: Boolean,
  courseId: String,
  assignmentId: String,
  assignmentTitle: String,
  assignmentWorkType: {
    type: String,
    default: ''
  },
  initialEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Work Type & Group Members
const workType = ref('individual') // 'individual' | 'pair' | 'group'
const members = ref([])
const memberSearch = ref('')
const showMemberDropdown = ref(false)

const workTypeLabel = computed(() => {
  if (workType.value === 'pair') return 'งานคู่ (จับคู่ 2 คน)'
  if (workType.value === 'group') return 'งานกลุ่ม (กลุ่มละ 3-5 คน)'
  return 'งานเดี่ยว (ทำคนเดียว 1 คน)'
})

// Multiple Links
const links = ref([
  { title: '', url: '' }
])

const studentNote = ref('')
const isSubmitting = ref(false)
const isEditing = ref(false)

const isTeacher = computed(() => isTeacherUser(authUser.value))

const studentId = computed(() => authUser.value?.studentId || authUser.value?.id)

const currentStudentObj = computed(() => {
  if (!studentId.value) return null
  return studentsList.value.find(s => (s.studentId || s.id) === studentId.value) || {
    studentId: studentId.value,
    name: authUser.value?.name || 'นักศึกษา',
    classroom: authUser.value?.classroom || ''
  }
})

const submissionKey = computed(() => {
  if (!studentId.value || isTeacher.value) return null
  return `${props.courseId}_${studentId.value}_${props.assignmentId}`
})

const currentSubmission = computed(() => {
  if (!submissionKey.value) return null
  return submissionsStore.value[submissionKey.value] ||
    (authUser.value?.id ? submissionsStore.value[`${props.courseId}_${authUser.value.id}_${props.assignmentId}`] : null)
})

// Quick Link Title Presets
const linkTitlePresets = [
  'Google Drive / ไฟล์งาน',
  'วงจร Tinkercad Circuits',
  'วิดีโอสาธิตการทำงาน',
  'GitHub / Source Code',
  'Canva / สไลด์สรุป'
]

// Add a new link item
const addLinkItem = () => {
  links.value.push({ title: '', url: '' })
}

// Remove a link item
const removeLinkItem = (index) => {
  if (links.value.length > 1) {
    links.value.splice(index, 1)
  } else {
    links.value[0] = { title: '', url: '' }
  }
}

// Available students for group/pair member selection
const availableStudents = computed(() => {
  if (!props.courseId) return []
  const myId = studentId.value
  const existingIds = new Set(members.value.map(m => m.studentId || m.id))
  if (myId) existingIds.add(myId)

  const query = memberSearch.value.trim().toLowerCase()

  return studentsList.value
    .filter(s => {
      if (!isStudent(s) || !isStudentInCourse(s, props.courseId)) return false
      const sId = s.studentId || s.id
      if (existingIds.has(sId)) return false
      if (!query) return true
      const name = (s.name || '').toLowerCase()
      const idStr = String(sId).toLowerCase()
      const room = (s.classroom || '').toLowerCase()
      return name.includes(query) || idStr.includes(query) || room.includes(query)
    })
    .slice(0, 15)
})

const addMember = (student) => {
  const sId = student.studentId || student.id
  if (members.value.some(m => (m.studentId || m.id) === sId)) return

  // Limit check
  if (workType.value === 'pair' && members.value.length >= 1) {
    // Exactly 1 partner (2 people total)
    members.value = [{
      studentId: sId,
      name: student.name,
      classroom: student.classroom || ''
    }]
  } else if (workType.value === 'group' && members.value.length >= 5) {
    return
  } else {
    members.value.push({
      studentId: sId,
      name: student.name,
      classroom: student.classroom || ''
    })
  }

  memberSearch.value = ''
  showMemberDropdown.value = false
}

const removeMember = (sId) => {
  members.value = members.value.filter(m => (m.studentId || m.id) !== sId)
}

const setWorkType = (type) => {
  workType.value = type
  if (type === 'individual') {
    members.value = []
  } else if (type === 'pair' && members.value.length > 1) {
    members.value = [members.value[0]]
  }
}

const hasValidLink = computed(() => {
  return links.value.some(l => l.url && l.url.trim().length > 0)
})

const startEdit = () => {
  const setting = getAssignmentSetting(props.courseId, props.assignmentId)
  const defaultType = setting?.workType || props.assignmentWorkType || 'individual'
  workType.value = defaultType

  if (currentSubmission.value) {
    // Load members
    if (Array.isArray(currentSubmission.value.members)) {
      const myId = studentId.value
      // Exclude self from partners list in edit state
      members.value = currentSubmission.value.members.filter(m => (m.studentId || m.id) !== myId)
    } else {
      members.value = []
    }

    // Load links
    if (Array.isArray(currentSubmission.value.links) && currentSubmission.value.links.length > 0) {
      links.value = currentSubmission.value.links.map(l => ({
        title: l.title || '',
        url: l.url || ''
      }))
    } else if (currentSubmission.value.link) {
      links.value = [{
        title: '',
        url: currentSubmission.value.link
      }]
    } else {
      links.value = [{ title: '', url: '' }]
    }

    studentNote.value = currentSubmission.value.note || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  initFormFromState()
}

const initFormFromState = () => {
  // Check if configured by assignment setting or prop
  const setting = getAssignmentSetting(props.courseId, props.assignmentId)
  const defaultType = setting?.workType || props.assignmentWorkType || 'individual'
  workType.value = defaultType

  if (currentSubmission.value) {
    const myId = studentId.value
    members.value = Array.isArray(currentSubmission.value.members)
      ? currentSubmission.value.members.filter(m => (m.studentId || m.id) !== myId)
      : []

    if (Array.isArray(currentSubmission.value.links) && currentSubmission.value.links.length > 0) {
      links.value = currentSubmission.value.links.map(l => ({ title: l.title || '', url: l.url || '' }))
    } else if (currentSubmission.value.link) {
      links.value = [{ title: '', url: currentSubmission.value.link }]
    } else {
      links.value = [{ title: '', url: '' }]
    }
    studentNote.value = currentSubmission.value.note || ''
  } else {
    members.value = []
    links.value = [{ title: '', url: '' }]
    studentNote.value = ''
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialEdit) {
      startEdit()
    } else {
      isEditing.value = false
      initFormFromState()
    }
    if (props.courseId) {
      fetchSubmissions(props.courseId)
    }
  }
})

const handleSubmit = async () => {
  if (!hasValidLink.value) return
  isSubmitting.value = true

  try {
    // Construct normalized members array (self + partners)
    const allMembers = []
    if (currentStudentObj.value) {
      allMembers.push({
        studentId: currentStudentObj.value.studentId || currentStudentObj.value.id,
        name: currentStudentObj.value.name,
        classroom: currentStudentObj.value.classroom || '',
        isSubmitter: true
      })
    }
    if (['pair', 'group'].includes(workType.value)) {
      members.value.forEach(m => {
        allMembers.push({
          studentId: m.studentId || m.id,
          name: m.name,
          classroom: m.classroom || '',
          isSubmitter: false
        })
      })
    }

    await submitAssignmentLink(
      props.courseId,
      studentId.value,
      props.assignmentId,
      links.value,
      studentNote.value,
      workType.value,
      allMembers
    )

    isEditing.value = false
    await fetchSubmissions(props.courseId)
    emit('close')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <h3 class="font-bold text-lg sm:text-xl flex items-center gap-2.5">
          <UploadCloud class="w-6 h-6 text-indigo-200" />
          <span>{{ isEditing ? 'แก้ไขการส่งงาน' : 'ส่งงาน' }}: {{ assignmentTitle }}</span>
        </h3>
        <button @click="emit('close')"
          class="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1">

        <!-- Already Submitted View (Only when NOT editing) -->
        <div v-if="currentSubmission && !isEditing"
          class="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
          <div
            class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <div>
            <h4 class="text-xl font-black text-emerald-900">ส่งงานเรียบร้อยแล้ว</h4>
            <p class="text-emerald-700 text-xs mt-0.5 font-mono">ส่งเมื่อ: {{ currentSubmission.submittedAt }}</p>
          </div>

          <!-- Submission Details Card -->
          <div class="p-5 bg-white rounded-2xl border border-emerald-100 text-left space-y-4 shadow-2xs">

            <!-- Work Type & Members Display -->
            <div class="pb-3 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-stone-500 uppercase">รูปแบบงาน:</span>
                <span v-if="currentSubmission.workType === 'pair'"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                  <Users class="w-3.5 h-3.5 text-blue-600" /> งานคู่ (2 คน)
                </span>
                <span v-else-if="currentSubmission.workType === 'group'"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
                  <Users class="w-3.5 h-3.5 text-purple-600" /> งานกลุ่ม
                </span>
                <span v-else
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-xs">
                  <User class="w-3.5 h-3.5 text-stone-600" /> งานเดี่ยว (ทำคนเดียว)
                </span>
              </div>

              <span v-if="currentSubmission.isGroupPartner"
                class="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ส่งโดยตัวแทนกลุ่ม: {{ currentSubmission.submittedBy }}
              </span>
            </div>

            <!-- Group Members List (if pair or group) -->
            <div v-if="['pair', 'group'].includes(currentSubmission.workType) && currentSubmission.members?.length"
              class="space-y-2">
              <p class="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-indigo-600" /> รายชื่อสมาชิกในกลุ่ม ({{ currentSubmission.members.length
                }} คน):
              </p>
              <div class="flex flex-wrap gap-2">
                <div v-for="mem in currentSubmission.members" :key="mem.studentId || mem.id"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <User class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span class="font-bold text-stone-800">{{ mem.name }}</span>
                  <span class="text-stone-400 font-mono text-[11px]">({{ mem.studentId }})</span>
                  <span v-if="mem.isSubmitter"
                    class="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">ผู้ส่ง</span>
                </div>
              </div>
            </div>

            <!-- Attached Links List -->
            <div class="space-y-2">
              <p class="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon class="w-3.5 h-3.5 text-blue-600" /> ลิงก์ผลงานที่แนบ ({{ (currentSubmission.links &&
                  currentSubmission.links.length) || 1 }} ลิงก์):
              </p>

              <!-- If multiple links array exists -->
              <div v-if="currentSubmission.links && currentSubmission.links.length" class="space-y-2">
                <div v-for="(lnk, idx) in currentSubmission.links" :key="idx"
                  class="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-blue-300 transition-colors gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <span
                      class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {{ idx + 1 }}
                    </span>
                    <div class="min-w-0">
                      <div v-if="lnk.title" class="font-bold text-xs text-stone-800">{{ lnk.title }}</div>
                      <div class="text-blue-600 font-mono text-xs truncate max-w-xs sm:max-w-md">{{ lnk.url }}</div>
                    </div>
                  </div>
                  <a :href="formatExternalUrl(lnk.url)" target="_blank" rel="noopener noreferrer"
                    class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1 shrink-0 transition-colors">
                    <span>เปิดลิงก์</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
              </div>

              <!-- Fallback to single link if old record -->
              <div v-else
                class="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                <div class="text-blue-600 text-xs font-mono truncate max-w-sm sm:max-w-md">{{ currentSubmission.link }}
                </div>
                <a :href="formatExternalUrl(currentSubmission.link)" target="_blank" rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1 shrink-0 transition-colors">
                  <span>เปิดลิงก์</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>
            </div>

            <!-- Note if any -->
            <div v-if="currentSubmission.note" class="pt-2 border-t border-stone-100">
              <p class="text-xs text-stone-500 font-bold mb-1 uppercase">ข้อความเพิ่มเติมถึงผู้สอน:</p>
              <p class="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl leading-relaxed">{{ currentSubmission.note }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button @click="startEdit"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer">
              <Pencil class="w-4 h-4" /> แก้ไขการส่งงาน
            </button>
            <button @click="emit('close')"
              class="py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl transition-colors cursor-pointer">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

        <!-- Submission Form View (When not yet submitted OR in editing mode) -->
        <div v-else class="space-y-6">

          <!-- Mode banner if editing -->
          <div v-if="isEditing"
            class="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-bold">
            <span class="flex items-center gap-2">
              <Pencil class="w-4 h-4 text-amber-600" /> โหมดแก้ไขการส่งงาน
              (สามารถเพิ่ม/เปลี่ยนลิงก์และเพื่อนร่วมกลุ่มได้)
            </span>
            <button v-if="currentSubmission" type="button" @click="cancelEdit"
              class="text-stone-500 hover:text-stone-800 underline font-normal cursor-pointer">
              ยกเลิก
            </button>
          </div>

          <!-- Instructions Card -->
          <div v-else class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div class="text-xs text-blue-900 leading-relaxed space-y-1">
              <p class="font-bold text-sm">คำแนะนำการส่งงาน:</p>
              <ul class="list-disc list-inside space-y-0.5 text-blue-800">
                <li>รูปแบบงาน: <strong>{{ workTypeLabel }}</strong></li>
                <li v-if="workType === 'pair' || workType === 'group'">สำหรับงานคู่หรืองานกลุ่ม ให้<strong>ตัวแทน 1
                    คนเป็นผู้ส่งงาน</strong> และเลือกรายชื่อเพื่อนในระบบ</li>
                <li>สามารถแนบได้<strong>หลายลิงก์</strong> เช่น Google Drive (เปิดแชร์แล้ว), Tinkercad, คลิปวิดีโอ ฯลฯ
                </li>
              </ul>
            </div>
          </div>

          <!-- SECTION 1: Work Type (Locked to Teacher Specification) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users class="w-4 h-4 text-indigo-600" /> 1. รูปแบบการทำงาน <span class="text-red-500">*</span>
              </label>
            </div>

            <div class="p-4 rounded-2xl border-2 flex items-center justify-between shadow-2xs" :class="{
              'border-blue-300 bg-blue-50/70 text-blue-950': workType === 'individual',
              'border-indigo-300 bg-indigo-50/70 text-indigo-950': workType === 'pair',
              'border-purple-300 bg-purple-50/70 text-purple-950': workType === 'group'
            }">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs"
                  :class="{
                    'bg-blue-600': workType === 'individual',
                    'bg-indigo-600': workType === 'pair',
                    'bg-purple-600': workType === 'group'
                  }">
                  <User v-if="workType === 'individual'" class="w-5 h-5" />
                  <Users v-else class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-bold text-sm sm:text-base flex items-center gap-2">
                    <span>{{ workTypeLabel }}</span>
                  </div>
                  <div class="text-xs opacity-75 mt-0.5">
                    {{ workType === 'individual' ? 'ส่งผลงานเดี่ยวของตนเอง (1 คน)' : workType === 'pair' ?
                      'ส่งผลงานร่วมกันเป็นคู่ (2 คน)' : 'ส่งผลงานร่วมกันเป็นกลุ่ม (3-5 คน)' }}
                  </div>
                </div>
              </div>
              <span
                class="text-xs font-bold px-3 py-1 rounded-xl bg-white/90 border border-stone-200 text-stone-700 shrink-0">
                {{ workType === 'individual' ? 'งานเดี่ยว' : workType === 'pair' ? 'งานคู่' : 'งานกลุ่ม' }}
              </span>
            </div>
          </div>

          <!-- SECTION 2: Member Selection (When pair or group) -->
          <div v-if="workType === 'pair' || workType === 'group'"
            class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus class="w-4 h-4 text-indigo-600" />
                สมาชิกในกลุ่ม ({{ workType === 'pair' ? 'จับคู่ 2 คน' : 'กลุ่มละ 3-5 คน' }})
              </label>
              <span
                class="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                รวมทั้งหมด {{ members.length + 1 }} คน
              </span>
            </div>

            <!-- Current Submitter Badge -->
            <div class="flex flex-wrap gap-2 items-center">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 text-xs">
                <User class="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span class="font-bold">{{ currentStudentObj?.name }}</span>
                <span class="text-blue-700 font-mono text-[11px]">({{ currentStudentObj?.studentId }})</span>
                <span class="px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold text-[10px]">คุณ (ผู้ส่งงาน)</span>
              </div>

              <!-- Selected Partners -->
              <div v-for="mem in members" :key="mem.studentId || mem.id"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-stone-800 border border-stone-300 text-xs shadow-2xs">
                <User class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span class="font-bold">{{ mem.name }}</span>
                <span class="text-stone-500 font-mono text-[11px]">({{ mem.studentId }})</span>
                <button type="button" @click="removeMember(mem.studentId || mem.id)"
                  class="ml-1 text-stone-400 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                  title="ลบเพื่อนคนนี้ออกจากกลุ่ม">
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Member Search & Add Box -->
            <div v-if="(workType === 'pair' && members.length < 1) || (workType === 'group' && members.length < 5)"
              class="relative pt-1">
              <div class="relative">
                <Search class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input v-model="memberSearch" @focus="showMemberDropdown = true" type="text"
                  :placeholder="workType === 'pair' ? 'ค้นหารหัสนักศึกษา หรือชื่อเพื่อนเพื่อจับคู่...' : 'ค้นหารหัสหรือชื่อเพื่อนเพื่อเพิ่มเข้ากลุ่ม...'"
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs transition-all" />
              </div>

              <!-- Autocomplete Dropdown -->
              <div v-if="showMemberDropdown && memberSearch.trim()"
                class="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-stone-100">
                <div v-if="availableStudents.length === 0" class="p-3 text-center text-xs text-stone-400">
                  ไม่พบรายชื่อเพื่อนที่ตรงกับ "{{ memberSearch }}"
                </div>
                <button v-for="s in availableStudents" :key="s.studentId || s.id" type="button" @click="addMember(s)"
                  class="w-full p-2.5 text-left hover:bg-indigo-50 transition-colors flex items-center justify-between text-xs cursor-pointer">
                  <div class="flex items-center gap-2">
                    <User class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <div>
                      <span class="font-bold text-stone-800">{{ s.name }}</span>
                      <span class="ml-2 text-stone-400 font-mono text-[11px]">{{ s.studentId }}</span>
                    </div>
                  </div>
                  <span class="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    + เลือก
                  </span>
                </button>
              </div>
            </div>

            <p class="text-[11px] text-stone-500">
              * เมื่อกดส่งงาน สมาชิกทุกคนในกลุ่มจะได้รับสถานะ <strong>"ส่งงานแล้ว"</strong>
              และได้รับการบันทึกคะแนนพร้อมกัน
            </p>
          </div>

          <!-- SECTION 3: Multiple Links Input -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon class="w-4 h-4 text-blue-600" /> 2. แนบลิงก์ผลงาน (แนบได้หลายลิงก์) <span
                  class="text-red-500">*</span>
              </label>
              <button type="button" @click="addLinkItem"
                class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" /> เพิ่มลิงก์อื่น
              </button>
            </div>

            <!-- Links Rows -->
            <div class="space-y-3">
              <div v-for="(lnk, index) in links" :key="index"
                class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 relative group hover:border-blue-300 transition-colors">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                    <span
                      class="w-5 h-5 rounded-md bg-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                      {{ index + 1 }}
                    </span>
                    <span>ลิงก์ที่ {{ index + 1 }}</span>
                  </span>

                  <button v-if="links.length > 1" type="button" @click="removeLinkItem(index)"
                    class="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                    title="ลบลิงก์นี้">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <!-- Title / Label -->
                  <div>
                    <input v-model="lnk.title" type="text" placeholder="ชื่อลิงก์ (เช่น Google Drive, Tinkercad)"
                      list="link-presets"
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
                  </div>
                  <!-- URL -->
                  <div class="sm:col-span-2">
                    <input v-model="lnk.url" type="url"
                      placeholder="https://drive.google.com/... หรือ https://www.tinkercad.com/..."
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono" />
                  </div>
                </div>
              </div>

              <!-- Datalist for preset titles -->
              <datalist id="link-presets">
                <option v-for="preset in linkTitlePresets" :key="preset" :value="preset" />
              </datalist>
            </div>
          </div>

          <!-- SECTION 4: Note to Teacher -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-stone-500" /> 3. ข้อความเพิ่มเติมถึงผู้สอน (ถ้ามี)
            </label>
            <textarea v-model="studentNote" rows="2"
              placeholder="พิมพ์ข้อความที่ต้องการแจ้งผู้สอนเพิ่มเติม เช่น ข้อสังเกต หรือรายงานการทำงานกลุ่ม..."
              class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xs resize-none"></textarea>
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center gap-3 pt-2">
            <button v-if="isEditing && currentSubmission" type="button" @click="cancelEdit"
              class="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl transition-all cursor-pointer text-xs">
              ยกเลิก
            </button>
            <button @click="handleSubmit" :disabled="!hasValidLink || isSubmitting" :class="[
              'flex-1 py-3.5 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm',
              hasValidLink
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            ]">
              <UploadCloud v-if="!isSubmitting" class="w-5 h-5" />
              <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSubmitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไขการส่งงาน' : 'ยืนยันการส่งงาน') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
