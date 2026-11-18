<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { 
  Upload, XCircle, CheckCircle, CheckCircle2, FileText, FileSignature,
  Pencil, Link as LinkIcon, ExternalLink, Award, Clock,
  Smile, Laugh, Meh, Frown, Sparkles, AlertCircle, Users, User,
  UserCheck, Settings2, Shuffle, Check, Save, X, ChevronDown, ChevronUp
} from '@lucide/vue'
import { studentsList, isStudent, isStudentInCourse, isTeacherUser } from '@/data/studentsStore'
import { authUser } from '@/data/authStore'
import { 
  submissionsStore, 
  gradesStore, 
  fetchSubmissions, 
  fetchGrades, 
  formatExternalUrl,
  assignmentSettingsStore,
  setAssignmentSetting
} from '@/data/gradesStore'

const SubmitAssignmentModal = defineAsyncComponent(() => import('@/components/SubmitAssignmentModal.vue'))
const GradeAssignmentModal = defineAsyncComponent(() => import('@/components/GradeAssignmentModal.vue'))

const props = defineProps({
  courseId: { type: String, required: true },
  assignmentId: { type: String, required: true },
  assignmentTitle: { type: String, required: true },
  maxScore: { type: Number, default: 10 },
  workType: { type: String, default: '' }, // 'individual' | 'pair' | 'group'
  minMembers: { type: Number, default: 2 },
  maxMembers: { type: Number, default: 5 }
})

const showSubmitModal = ref(false)
const showGradeModal = ref(false)
const initialEditMode = ref(false)
const isSubmissionOpen = ref(true)

const toggleSubmission = () => {
  isSubmissionOpen.value = !isSubmissionOpen.value
}

const openSubmitModal = (editMode = false) => {
  initialEditMode.value = editMode
  showSubmitModal.value = true
}

// User / Role Context
const isTeacher = computed(() => isTeacherUser(authUser.value))

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id)

// Assignment Settings & Format Management
const currentSetting = computed(() => {
  return assignmentSettingsStore.value?.[`${props.courseId}_${props.assignmentId}`] || {}
})

const effectiveWorkType = computed(() => {
  if (currentSetting.value?.workType) return currentSetting.value.workType
  return props.workType || 'individual'
})

const effectivePairingMode = computed(() => currentSetting.value?.pairingMode || 'manual')
const effectiveGroupingMode = computed(() => currentSetting.value?.groupingMode || 'manual')
const effectiveGroupCount = computed(() => Number(currentSetting.value?.groupCount) || 3)
const savedRandomizedPairs = computed(() => currentSetting.value?.randomizedPairs || [])
const savedRandomizedGroups = computed(() => currentSetting.value?.randomizedGroups || [])

const formatBadgeSummary = computed(() => {
  if (effectiveWorkType.value === 'individual') return 'งานเดี่ยว'
  if (effectiveWorkType.value === 'pair') {
    return effectivePairingMode.value === 'auto' ? 'งานคู่ (สุ่มอัตโนมัติ)' : 'งานคู่ (เลือกเอง)'
  }
  if (effectiveWorkType.value === 'group') {
    return effectiveGroupingMode.value === 'auto'
      ? `งานกลุ่ม (สุ่ม ${savedRandomizedGroups.value.length || effectiveGroupCount.value} กลุ่ม)`
      : 'งานกลุ่ม (เลือกเอง)'
  }
  return 'งานเดี่ยว'
})

// Current student partner / group info
const myPairInfo = computed(() => {
  if (effectiveWorkType.value !== 'pair' || effectivePairingMode.value !== 'auto') return null
  const sId = currentStudentId.value
  if (!sId) return null
  return savedRandomizedPairs.value.find(p => p.members?.some(m => (m.studentId || m.id) === sId)) || null
})

const myGroupInfo = computed(() => {
  if (effectiveWorkType.value !== 'group' || effectiveGroupingMode.value !== 'auto') return null
  const sId = currentStudentId.value
  if (!sId) return null
  return savedRandomizedGroups.value.find(g => g.members?.some(m => (m.studentId || m.id) === sId)) || null
})

// Modal & Draft State
const showFormatModal = ref(false)
const showRosterDrawer = ref(false)
const saveSuccessMessage = ref('')

const draftWorkType = ref('individual')
const draftPairingMode = ref('manual') // 'manual' | 'auto'
const draftGroupingMode = ref('manual') // 'manual' | 'auto'
const draftGroupCount = ref(3)
const draftTargetClassroom = ref('all')
const draftRandomizedPairs = ref([])
const draftRandomizedGroups = ref([])

const availableClassroomsForCourse = computed(() => {
  const rooms = new Set()
  studentsList.value.forEach(s => {
    if (isStudent(s) && isStudentInCourse(s, props.courseId) && s.classroom && s.classroom !== 'teacher_room') {
      rooms.add(s.classroom)
    }
  })
  return Array.from(rooms).sort()
})

const eligibleStudentsForDraft = computed(() => {
  return studentsList.value.filter(s => {
    if (!isStudent(s) || !isStudentInCourse(s, props.courseId)) return false
    if (draftTargetClassroom.value !== 'all' && s.classroom !== draftTargetClassroom.value) return false
    return true
  })
})

// Randomize Pairs: Pair by 2, if remainder, last pair gets 3
function generateRandomPairs(students) {
  const shuffled = [...students].sort(() => Math.random() - 0.5)
  if (shuffled.length === 0) return []
  if (shuffled.length <= 3) {
    return [{
      pairIndex: 1,
      isTrio: shuffled.length === 3,
      members: shuffled.map(s => ({
        studentId: s.studentId || s.id,
        name: s.name,
        classroom: s.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (s.classroom || '')
      }))
    }]
  }

  const remainder = shuffled.length % 2
  const normalPairStudentCount = remainder === 1 ? shuffled.length - 3 : shuffled.length
  const pairs = []
  let pIdx = 1

  for (let i = 0; i < normalPairStudentCount; i += 2) {
    pairs.push({
      pairIndex: pIdx++,
      isTrio: false,
      members: [
        { studentId: shuffled[i].studentId || shuffled[i].id, name: shuffled[i].name, classroom: shuffled[i].classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (shuffled[i].classroom || '') },
        { studentId: shuffled[i+1].studentId || shuffled[i+1].id, name: shuffled[i+1].name, classroom: shuffled[i+1].classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (shuffled[i+1].classroom || '') }
      ]
    })
  }

  if (remainder === 1) {
    const lastThree = shuffled.slice(shuffled.length - 3)
    pairs.push({
      pairIndex: pIdx,
      isTrio: true,
      members: lastThree.map(s => ({
        studentId: s.studentId || s.id,
        name: s.name,
        classroom: s.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (s.classroom || '')
      }))
    })
  }

  return pairs
}

// Randomize Groups: divide into N groups evenly
function generateRandomGroups(students, groupCount) {
  if (students.length === 0) return []
  const count = Math.max(2, Math.min(Number(groupCount) || 3, students.length))
  const shuffled = [...students].sort(() => Math.random() - 0.5)
  const groups = Array.from({ length: count }, (_, i) => ({
    groupIndex: i + 1,
    groupName: `กลุ่มที่ ${i + 1}`,
    members: []
  }))

  shuffled.forEach((student, index) => {
    const targetGroup = groups[index % count]
    targetGroup.members.push({
      studentId: student.studentId || student.id,
      name: student.name,
      classroom: student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (student.classroom || '')
    })
  })

  return groups
}

const openFormatSettingsModal = () => {
  const setting = currentSetting.value
  draftWorkType.value = setting.workType || effectiveWorkType.value || 'individual'
  draftPairingMode.value = setting.pairingMode || 'manual'
  draftGroupingMode.value = setting.groupingMode || 'manual'
  draftGroupCount.value = Number(setting.groupCount) || 3
  draftTargetClassroom.value = setting.targetClassroom || 'all'
  draftRandomizedPairs.value = setting.randomizedPairs ? JSON.parse(JSON.stringify(setting.randomizedPairs)) : []
  draftRandomizedGroups.value = setting.randomizedGroups ? JSON.parse(JSON.stringify(setting.randomizedGroups)) : []

  if (draftWorkType.value === 'pair' && draftPairingMode.value === 'auto' && draftRandomizedPairs.value.length === 0) {
    rollRandomPairs()
  }
  if (draftWorkType.value === 'group' && draftGroupingMode.value === 'auto' && draftRandomizedGroups.value.length === 0) {
    rollRandomGroups()
  }

  showFormatModal.value = true
}

const rollRandomPairs = () => {
  draftRandomizedPairs.value = generateRandomPairs(eligibleStudentsForDraft.value)
}

const rollRandomGroups = () => {
  draftRandomizedGroups.value = generateRandomGroups(eligibleStudentsForDraft.value, draftGroupCount.value)
}

const saveFormatSettings = () => {
  setAssignmentSetting(props.courseId, props.assignmentId, {
    workType: draftWorkType.value,
    pairingMode: draftPairingMode.value,
    groupingMode: draftGroupingMode.value,
    groupCount: draftGroupCount.value,
    targetClassroom: draftTargetClassroom.value,
    randomizedPairs: (draftWorkType.value === 'pair' && draftPairingMode.value === 'auto') ? draftRandomizedPairs.value : [],
    randomizedGroups: (draftWorkType.value === 'group' && draftGroupingMode.value === 'auto') ? draftRandomizedGroups.value : [],
    updatedAt: new Date().toISOString()
  })

  saveSuccessMessage.value = 'บันทึกรูปแบบการส่งงานเรียบร้อยแล้ว!'
  setTimeout(() => {
    saveSuccessMessage.value = ''
    showFormatModal.value = false
  }, 900)
}

// Student Submission Data
const currentSubmission = computed(() => {
  if (!currentStudentId.value) return null
  const sId = currentStudentId.value
  const key1 = `${props.courseId}_${sId}_${props.assignmentId}`
  if (submissionsStore.value?.[key1]) return submissionsStore.value[key1]
  if (authUser.value?.id && authUser.value.id !== sId) {
    const key2 = `${props.courseId}_${authUser.value.id}_${props.assignmentId}`
    if (submissionsStore.value?.[key2]) return submissionsStore.value[key2]
  }
  return null
})

const isSubmitted = computed(() => !!currentSubmission.value)

// Student Grade Data
const currentGradeRecord = computed(() => {
  if (!currentStudentId.value) return null
  const sId = currentStudentId.value
  const key1 = `${props.courseId}_${sId}`
  if (gradesStore.value?.[key1]) return gradesStore.value[key1]
  if (authUser.value?.id && authUser.value.id !== sId) {
    const key2 = `${props.courseId}_${authUser.value.id}`
    if (gradesStore.value?.[key2]) return gradesStore.value[key2]
  }
  return null
})

const assignmentScore = computed(() => {
  if (!currentGradeRecord.value?.assignments) return undefined
  const val = currentGradeRecord.value.assignments[props.assignmentId]
  if (val === undefined || val === null || val === '') return undefined
  return Number(val)
})

const isGraded = computed(() => assignmentScore.value !== undefined)

// 4 Evaluation Tiers: ปรับปรุง, ใช้ได้, ดี, ดีมาก
const scoreCriteria = computed(() => {
  if (!isGraded.value) return null
  const score = assignmentScore.value
  const max = props.maxScore || 10
  const ratio = max > 0 ? (score / max) * 100 : 0

  if (ratio >= 80) {
    return {
      level: 'ดีมาก',
      icon: Laugh,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cardBg: 'from-emerald-50/90 via-teal-50/40 to-white border-emerald-200',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-200',
      textScoreColor: 'text-emerald-700',
      barColor: 'bg-emerald-500',
      feedback: 'ผลงานยอดเยี่ยม มีความสมบูรณ์ ครบถ้วนตามข้อกำหนด และทำได้ประณีตมาก'
    }
  } else if (ratio >= 70) {
    return {
      level: 'ดี',
      icon: Smile,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      cardBg: 'from-blue-50/90 via-indigo-50/40 to-white border-blue-200',
      iconBg: 'bg-blue-500 text-white shadow-blue-200',
      textScoreColor: 'text-blue-700',
      barColor: 'bg-blue-500',
      feedback: 'ผลงานดี ทำงานได้ถูกต้องตามโจทย์ มีความเข้าใจในเนื้อหาเป็นอย่างดี'
    }
  } else if (ratio >= 50) {
    return {
      level: 'ใช้ได้',
      icon: Meh,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      cardBg: 'from-amber-50/90 via-yellow-50/40 to-white border-amber-200',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      textScoreColor: 'text-amber-700',
      barColor: 'bg-amber-500',
      feedback: 'ผลงานระดับพอใช้ ผ่านเกณฑ์ขั้นต่ำ ชิ้นงานทำงานได้ แต่ยังมีรายละเอียดที่สามารถพัฒนาต่อได้'
    }
  } else {
    return {
      level: 'ปรับปรุง',
      icon: Frown,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      cardBg: 'from-rose-50/90 via-pink-50/40 to-white border-rose-200',
      iconBg: 'bg-rose-500 text-white shadow-rose-200',
      textScoreColor: 'text-rose-700',
      barColor: 'bg-rose-500',
      feedback: 'ผลงานยังไม่ผ่านเกณฑ์ที่กำหนด ควรตรวจสอบข้อผิดพลาด ศึกษาเพิ่มเติม และปรับปรุงแก้ไขงานใหม่'
    }
  }
})

onMounted(() => {
  if (props.courseId) {
    fetchSubmissions(props.courseId)
    fetchGrades(props.courseId)
  }
})
</script>

<template>
  <section class="mt-8">
    <div class="flex items-center justify-between flex-wrap gap-3 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm border border-rose-200">
          <FileSignature class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">ใบงานประจำสัปดาห์ (Assignment)</h2>
          <p class="text-xs text-stone-500">ภาระงานและการส่งผลงานพร้อมระบบประเมินคะแนน</p>
        </div>
      </div>

      <!-- Teacher Format Settings Button (Gear / ฟันเฟือง) -->
      <div v-if="isTeacher" class="flex items-center gap-2">
        <button 
          @click="openFormatSettingsModal" 
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer group"
        >
          <Settings2 class="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>ตั้งค่ารูปแบบการส่งงาน</span>
          <span class="px-2 py-0.5 rounded-lg bg-white/20 text-[11px] font-medium text-stone-200">
            {{ formatBadgeSummary }}
          </span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl shrink-0">
          <slot name="number">1</slot>
        </div>
        <div class="flex-1 space-y-6">
          <div>
            <!-- Header Badges -->
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <!-- Work Type Badge -->
              <span v-if="effectiveWorkType === 'pair'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold shadow-2xs">
                <Users class="w-3.5 h-3.5 text-indigo-600" />
                <span>รูปแบบ: {{ formatBadgeSummary }}</span>
              </span>
              <span v-else-if="effectiveWorkType === 'group'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold shadow-2xs">
                <Users class="w-3.5 h-3.5 text-purple-600" />
                <span>รูปแบบ: {{ formatBadgeSummary }}</span>
              </span>
              <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-2xs">
                <User class="w-3.5 h-3.5 text-blue-600" />
                <span>รูปแบบ: งานเดี่ยว (ทำคนเดียว)</span>
              </span>

              <!-- Multi-links supported badge -->
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-medium">
                <LinkIcon class="w-3 h-3 text-stone-500" /> แนบได้หลายลิงก์
              </span>

              <!-- Max Score Badge -->
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                <Award class="w-3 h-3 text-amber-600" /> {{ maxScore }} คะแนน
              </span>
            </div>

            <h3 class="text-xl font-bold text-slate-800">{{ assignmentTitle }}</h3>
            
            <div class="mt-2 text-slate-600">
              <slot name="description"></slot>
            </div>

            <!-- Group / Pair Work Instructions Banner & Roster View -->
            <div v-if="effectiveWorkType === 'pair' || effectiveWorkType === 'group'" 
              class="mt-4 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 space-y-3">
              <div class="flex items-start gap-3">
                <Users class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div class="space-y-1 flex-1">
                  <div class="font-bold text-sm">
                    คำแนะนำสำหรับการทำงาน{{ effectiveWorkType === 'pair' ? 'คู่' : 'กลุ่ม' }}:
                  </div>
                  <p class="leading-relaxed text-indigo-800/90">
                    ส่งผลงานเพียง <strong>1 คนต่อ{{ effectiveWorkType === 'pair' ? 'คู่' : 'กลุ่ม' }}</strong> โดยเมื่อกดส่งงานให้เลือกชื่อเพื่อนร่วมกลุ่มในระบบ ระบบจะเชื่อมโยงการส่งงานและคะแนนการตรวจให้อัตโนมัติ และสามารถแนบได้หลายลิงก์ (เช่น ลิงก์ Google Drive, Tinkercad, วิดีโอ ฯลฯ)
                  </p>
                </div>
              </div>

              <!-- My Partner or Group Highlight for logged-in Student -->
              <div v-if="!isTeacher && myPairInfo" class="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs flex items-center justify-between">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="font-black text-indigo-950">คู่ของคุณ (คู่ที่ {{ myPairInfo.pairIndex }}):</span>
                  <span class="text-stone-700 font-bold">
                    {{ myPairInfo.members.filter(m => (m.studentId || m.id) !== currentStudentId).map(m => m.name).join(', ') || 'คุณ' }}
                  </span>
                  <span v-if="myPairInfo.isTrio" class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    กลุ่มพิเศษ 3 คน (เนื่องจากมีเศษ)
                  </span>
                </div>
              </div>

              <div v-if="!isTeacher && myGroupInfo" class="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs flex items-center justify-between">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                  <span class="font-black text-purple-950">กลุ่มของคุณ ({{ myGroupInfo.groupName }}):</span>
                  <span class="text-stone-700 font-bold">
                    {{ myGroupInfo.members.map(m => (m.studentId || m.id) === currentStudentId ? `${m.name} (คุณ)` : m.name).join(', ') }}
                  </span>
                </div>
              </div>

              <!-- Toggle Roster Button for Randomized Pairs/Groups -->
              <div v-if="(effectiveWorkType === 'pair' && savedRandomizedPairs.length > 0) || (effectiveWorkType === 'group' && savedRandomizedGroups.length > 0)" class="pt-1">
                <button
                  type="button"
                  @click="showRosterDrawer = !showRosterDrawer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition cursor-pointer"
                >
                  <Users class="w-3.5 h-3.5 text-indigo-600" />
                  <span>{{ showRosterDrawer ? 'ซ่อนรายชื่อที่จัดไว้' : (effectiveWorkType === 'pair' ? `ดูรายชื่อคู่ทั้งหมด (${savedRandomizedPairs.length} คู่)` : `ดูรายชื่อกลุ่มทั้งหมด (${savedRandomizedGroups.length} กลุ่ม)`) }}</span>
                  <component :is="showRosterDrawer ? ChevronUp : ChevronDown" class="w-3.5 h-3.5 ml-0.5" />
                </button>

                <!-- Expanded Roster Grid -->
                <div v-if="showRosterDrawer" class="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-2.5 bg-white/90 rounded-2xl border border-indigo-100">
                  <!-- Pair Cards -->
                  <template v-if="effectiveWorkType === 'pair'">
                    <div
                      v-for="p in savedRandomizedPairs"
                      :key="p.pairIndex"
                      class="p-2.5 rounded-xl border text-xs"
                      :class="p.members.some(m => (m.studentId || m.id) === currentStudentId) ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400' : 'bg-white border-stone-200'"
                    >
                      <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-100">
                        <span class="font-black text-indigo-900">คู่ที่ {{ p.pairIndex }}</span>
                        <div class="flex items-center gap-1">
                          <span v-if="p.isTrio" class="text-[9px] bg-amber-100 text-amber-800 px-1.5 rounded font-bold">เศษ 3 คน</span>
                          <span v-if="p.members.some(m => (m.studentId || m.id) === currentStudentId)" class="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">คู่คุณ</span>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div v-for="m in p.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                          <span :class="(m.studentId || m.id) === currentStudentId ? 'font-bold text-indigo-900' : ''">{{ m.name }}</span>
                          <span class="text-stone-400 font-mono text-[10px] shrink-0 ml-1">{{ m.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : m.classroom }}</span>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Group Cards -->
                  <template v-else-if="effectiveWorkType === 'group'">
                    <div
                      v-for="g in savedRandomizedGroups"
                      :key="g.groupIndex"
                      class="p-2.5 rounded-xl border text-xs"
                      :class="g.members.some(m => (m.studentId || m.id) === currentStudentId) ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400' : 'bg-white border-stone-200'"
                    >
                      <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-100">
                        <span class="font-black text-purple-900">{{ g.groupName }}</span>
                        <div class="flex items-center gap-1">
                          <span class="text-[10px] text-stone-500 font-mono">({{ g.members.length }} คน)</span>
                          <span v-if="g.members.some(m => (m.studentId || m.id) === currentStudentId)" class="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-bold">กลุ่มคุณ</span>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div v-for="m in g.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                          <span :class="(m.studentId || m.id) === currentStudentId ? 'font-bold text-purple-900' : ''">{{ m.name }}</span>
                          <span class="text-stone-400 font-mono text-[10px] shrink-0 ml-1">{{ m.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : m.classroom }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Tasks Box -->
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h4 class="font-bold text-slate-800 mb-4">โจทย์ที่ต้องปฏิบัติ:</h4>
            <div class="space-y-4">
              <slot name="tasks"></slot>
            </div>

            <!-- Student View: Status, Actions & Score Card -->
            <div v-if="!isTeacher" class="mt-6 pt-6 border-t border-slate-200 space-y-4">
              
              <!-- 1. Submission Status & Action Bar -->
              <!-- Case A: Submitted -->
              <div 
                v-if="isSubmitted"
                class="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div class="flex items-start gap-3.5 min-w-0 flex-1">
                  <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle2 class="w-6 h-6" />
                  </div>
                  <div class="space-y-2.5 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-black text-slate-900 text-sm">ส่งงานเรียบร้อยแล้ว</span>
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ส่งแล้ว
                      </span>

                      <!-- Work Type indicator badge -->
                      <span v-if="currentSubmission.workType === 'pair'" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Users class="w-3 h-3" /> งานคู่
                      </span>
                      <span v-else-if="currentSubmission.workType === 'group'" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Users class="w-3 h-3" /> งานกลุ่ม
                      </span>

                      <span v-if="currentSubmission.submittedAt" class="text-xs text-stone-400 font-mono">
                        (ส่งเมื่อ: {{ currentSubmission.submittedAt }})
                      </span>
                    </div>

                    <!-- Group Partners Display -->
                    <div v-if="['pair', 'group'].includes(currentSubmission.workType) && currentSubmission.members?.length" class="text-xs text-stone-600 space-y-1">
                      <div class="text-stone-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <Users class="w-3 h-3 text-indigo-500" /> สมาชิกในกลุ่ม ({{ currentSubmission.members.length }} คน):
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <span v-for="mem in currentSubmission.members" :key="mem.studentId || mem.id"
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 text-[11px]">
                          <User class="w-3 h-3 text-stone-500" />
                          <span class="font-semibold">{{ mem.name }}</span>
                          <span class="text-stone-400 font-mono">({{ mem.studentId }})</span>
                        </span>
                      </div>
                    </div>

                    <!-- Submitted Links Display (Multiple Links Support) -->
                    <div class="space-y-1.5 pt-1">
                      <div class="text-stone-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <LinkIcon class="w-3 h-3 text-blue-500" /> ลิงก์ผลงานที่ส่ง ({{ (currentSubmission.links && currentSubmission.links.length) || 1 }} ลิงก์):
                      </div>

                      <!-- Multiple Links list -->
                      <div v-if="currentSubmission.links && currentSubmission.links.length" class="space-y-1.5">
                        <div v-for="(lnk, idx) in currentSubmission.links" :key="idx"
                          class="flex items-center gap-2 text-xs text-stone-700 flex-wrap">
                          <span class="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-mono font-bold text-[10px]">
                            ลิงก์ {{ idx + 1 }}
                          </span>
                          <span v-if="lnk.title" class="font-bold text-stone-800">{{ lnk.title }}:</span>
                          <a 
                            :href="formatExternalUrl(lnk.url)" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="text-blue-600 hover:text-blue-700 font-mono underline font-medium flex items-center gap-1 truncate max-w-xs sm:max-w-md"
                          >
                            <span class="truncate">{{ lnk.url }}</span>
                            <ExternalLink class="w-3 h-3 shrink-0 opacity-70" />
                          </a>
                        </div>
                      </div>

                      <!-- Fallback single link -->
                      <div v-else class="flex items-center gap-1.5 text-xs text-stone-600">
                        <a 
                          :href="formatExternalUrl(currentSubmission.link)" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:text-blue-700 font-mono underline font-medium flex items-center gap-1 truncate max-w-xs sm:max-w-md"
                        >
                          <LinkIcon class="w-3.5 h-3.5 shrink-0" />
                          <span class="truncate">{{ currentSubmission.link }}</span>
                          <ExternalLink class="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                      </div>
                    </div>

                    <!-- Student Note if any -->
                    <div v-if="currentSubmission.note" class="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span class="font-bold text-stone-700">ข้อความถึงผู้สอน:</span> {{ currentSubmission.note }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0 self-end md:self-auto pt-2 md:pt-0">
                  <button 
                    v-if="isSubmissionOpen"
                    @click="openSubmitModal(true)"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <Pencil class="w-3.5 h-3.5" /> แก้ไขการส่งงาน
                  </button>
                  <span v-else class="text-xs text-stone-400 font-medium px-3 py-1.5 bg-stone-100 rounded-lg">
                    ปิดรับการแก้ไขแล้ว
                  </span>
                </div>
              </div>

              <!-- Case B: Not Yet Submitted -->
              <div 
                v-else
                class="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="flex items-center gap-3.5">
                  <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Upload class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-sm">ยังไม่ได้ส่งงาน</span>
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600">
                        รอส่งงาน
                      </span>
                      <span v-if="effectiveWorkType === 'pair'" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        งานคู่
                      </span>
                      <span v-else-if="effectiveWorkType === 'group'" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        งานกลุ่ม
                      </span>
                    </div>
                    <p class="text-xs text-stone-500 mt-0.5">
                      {{ effectiveWorkType === 'pair' || effectiveWorkType === 'group' 
                        ? 'ตัวแทนกลุ่มสามารถส่งงานและเลือกชื่อเพื่อนร่วมกลุ่มได้ทันที สามารถแนบได้หลายลิงก์' 
                        : 'เมื่อปฏิบัติกิจกรรมเสร็จสิ้น ให้คัดลอกลิงก์ผลงาน (Google Drive / OneDrive / Tinkercad ฯลฯ) มาส่งที่นี่' }}
                    </p>
                  </div>
                </div>

                <div class="shrink-0 self-end sm:self-auto">
                  <button 
                    v-if="isSubmissionOpen" 
                    @click="openSubmitModal(false)"
                    class="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload class="w-4 h-4" /> ส่งงานด้วยลิงก์ (Submit)
                  </button>
                  <div v-else class="px-4 py-2 rounded-xl font-bold text-xs bg-stone-100 text-stone-500 border border-stone-200 flex items-center gap-1.5">
                    <XCircle class="w-4 h-4" /> ปิดรับการส่งงานแล้ว
                  </div>
                </div>
              </div>

              <!-- 2. Score & Evaluation Card -->
              <!-- Case A: ครูลงคะแนนแล้ว (Graded) -->
              <div 
                v-if="isGraded"
                class="rounded-3xl p-5 md:p-6 border bg-gradient-to-br shadow-sm transition-all space-y-4"
                :class="scoreCriteria.cardBg"
              >
                <!-- Card Header -->
                <div class="flex items-center justify-between border-b border-black/5 pb-3.5">
                  <div class="flex items-center gap-2">
                    <Award class="w-5 h-5" :class="scoreCriteria.textScoreColor" />
                    <span class="font-black text-slate-800 text-sm">ผลการประเมินคะแนน (Evaluation Result)</span>
                  </div>
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs"
                    :class="scoreCriteria.badgeClass"
                  >
                    ระดับ: {{ scoreCriteria.level }}
                  </span>
                </div>

                <!-- Card Middle: Icon, Score & Feedback -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <!-- Face Icon & Level Text -->
                  <div class="flex items-center gap-4">
                    <div 
                      class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105"
                      :class="scoreCriteria.iconBg"
                    >
                      <component :is="scoreCriteria.icon" class="w-9 h-9" />
                    </div>
                    <div class="space-y-1">
                      <div class="text-xs font-bold text-stone-500 uppercase tracking-wider">เกณฑ์ประเมินคุณภาพ</div>
                      <div class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <span>ระดับ "{{ scoreCriteria.level }}"</span>
                      </div>
                      <div class="text-xs text-stone-500">
                        คิดเป็น {{ Math.round((assignmentScore / maxScore) * 100) }}% ของคะแนนเต็ม
                      </div>
                    </div>
                  </div>

                  <!-- Score Display -->
                  <div class="text-left sm:text-right sm:border-l sm:border-black/5 sm:pl-6 shrink-0">
                    <div class="text-xs font-bold text-stone-500 uppercase">คะแนนที่ได้รับ</div>
                    <div class="flex items-baseline gap-1 mt-0.5">
                      <span class="text-4xl font-black font-mono tracking-tight" :class="scoreCriteria.textScoreColor">
                        {{ assignmentScore }}
                      </span>
                      <span class="text-base font-bold text-stone-400 font-mono">/ {{ maxScore }}</span>
                      <span class="text-xs font-bold text-stone-500 ml-1">คะแนน</span>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-700"
                    :class="scoreCriteria.barColor"
                    :style="{ width: `${Math.min(100, Math.max(0, (assignmentScore / maxScore) * 100))}%` }"
                  ></div>
                </div>

                <!-- Feedback Box -->
                <div class="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-black/5 space-y-1.5">
                  <div class="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5" :class="scoreCriteria.textScoreColor" />
                    <span>คำติชมตามเกณฑ์ประเมิน:</span>
                  </div>
                  <p class="text-sm font-medium text-slate-800 leading-relaxed pl-3.5 border-l-2" :class="scoreCriteria.textScoreColor.replace('text-', 'border-')">
                    "{{ scoreCriteria.feedback }}"
                  </p>
                </div>

                <!-- Criteria Level Guide (4 Proportions: ปรับปรุง, ใช้ได้, ดี, ดีมาก) -->
                <div class="pt-2 border-t border-black/5">
                  <div class="text-[11px] font-bold text-stone-400 mb-2 uppercase tracking-wider">เกณฑ์สัดส่วนคะแนน:</div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div 
                      class="p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1"
                      :class="scoreCriteria.level === 'ปรับปรุง' ? 'bg-rose-100/90 border-rose-300 font-bold text-rose-900 shadow-2xs scale-[1.02]' : 'bg-white/50 border-stone-200/70 text-stone-500'"
                    >
                      <Frown class="w-4 h-4 text-rose-500" />
                      <span>ปรับปรุง (&lt;50%)</span>
                    </div>
                    <div 
                      class="p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1"
                      :class="scoreCriteria.level === 'ใช้ได้' ? 'bg-amber-100/90 border-amber-300 font-bold text-amber-900 shadow-2xs scale-[1.02]' : 'bg-white/50 border-stone-200/70 text-stone-500'"
                    >
                      <Meh class="w-4 h-4 text-amber-500" />
                      <span>ใช้ได้ (50-69%)</span>
                    </div>
                    <div 
                      class="p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1"
                      :class="scoreCriteria.level === 'ดี' ? 'bg-blue-100/90 border-blue-300 font-bold text-blue-900 shadow-2xs scale-[1.02]' : 'bg-white/50 border-stone-200/70 text-stone-500'"
                    >
                      <Smile class="w-4 h-4 text-blue-500" />
                      <span>ดี (70-79%)</span>
                    </div>
                    <div 
                      class="p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1"
                      :class="scoreCriteria.level === 'ดีมาก' ? 'bg-emerald-100/90 border-emerald-300 font-bold text-emerald-900 shadow-2xs scale-[1.02]' : 'bg-white/50 border-stone-200/70 text-stone-500'"
                    >
                      <Laugh class="w-4 h-4 text-emerald-500" />
                      <span>ดีมาก (80-100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Case B: ครูยังไม่ลงคะแนน (Not Graded Yet) -->
              <div 
                v-else
                class="rounded-3xl p-5 md:p-6 border border-stone-200 bg-gradient-to-br from-stone-50 via-amber-50/20 to-white shadow-2xs space-y-4"
              >
                <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div class="flex items-center gap-2">
                    <Award class="w-5 h-5 text-amber-500" />
                    <span class="font-black text-slate-800 text-sm">ผลการประเมินคะแนน</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5" /> ยังไม่ลงคะแนน
                  </span>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <!-- Clock Icon -->
                    <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
                      <Clock class="w-7 h-7 text-amber-600 animate-pulse" />
                    </div>
                    <div>
                      <div class="text-base font-black text-slate-800">สถานะ: ยังไม่ลงคะแนน</div>
                      <p class="text-xs text-stone-500 mt-0.5">
                        {{ isSubmitted ? 'ส่งงานเรียบร้อยแล้ว อยู่ระหว่างรออาจารย์ผู้สอนตรวจชิ้นงานและบันทึกคะแนน' : 'ยังไม่ได้ส่งงาน กรุณาส่งงานเพื่อให้อาจารย์ผู้สอนตรวจและให้คะแนน' }}
                      </p>
                    </div>
                  </div>

                  <div class="text-left sm:text-right sm:border-l sm:border-stone-100 sm:pl-6 shrink-0">
                    <div class="text-xs font-bold text-stone-400 uppercase">คะแนนที่ได้</div>
                    <div class="flex items-baseline gap-1 mt-0.5">
                      <span class="text-3xl font-black font-mono text-stone-300">-</span>
                      <span class="text-sm font-bold text-stone-400 font-mono">/ {{ maxScore }}</span>
                      <span class="text-xs font-medium text-stone-400 ml-1">คะแนน</span>
                    </div>
                  </div>
                </div>

                <!-- Criteria Scale Preview -->
                <div class="pt-2 border-t border-stone-100">
                  <div class="text-[11px] font-bold text-stone-400 mb-2 uppercase tracking-wider">เกณฑ์การตัดสัดส่วนคะแนนเมื่อตรวจเสร็จ:</div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-center flex flex-col items-center gap-1 text-stone-600">
                      <Frown class="w-4 h-4 text-rose-500" />
                      <span class="font-bold text-rose-700">ปรับปรุง</span>
                      <span class="text-[10px] text-stone-400">&lt; 50%</span>
                    </div>
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-center flex flex-col items-center gap-1 text-stone-600">
                      <Meh class="w-4 h-4 text-amber-500" />
                      <span class="font-bold text-amber-700">ใช้ได้</span>
                      <span class="text-[10px] text-stone-400">50 - 69%</span>
                    </div>
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-center flex flex-col items-center gap-1 text-stone-600">
                      <Smile class="w-4 h-4 text-blue-500" />
                      <span class="font-bold text-blue-700">ดี</span>
                      <span class="text-[10px] text-stone-400">70 - 79%</span>
                    </div>
                    <div class="p-2 rounded-xl bg-white border border-stone-200 text-center flex flex-col items-center gap-1 text-stone-600">
                      <Laugh class="w-4 h-4 text-emerald-500" />
                      <span class="font-bold text-emerald-700">ดีมาก</span>
                      <span class="text-[10px] text-stone-400">80 - 100%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Teacher View Controls -->
            <div v-else class="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3 flex-wrap">
              <button 
                @click="toggleSubmission"
                class="px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                :class="isSubmissionOpen ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'"
              >
                <component :is="isSubmissionOpen ? XCircle : CheckCircle" class="w-4 h-4" />
                {{ isSubmissionOpen ? 'ปิดรับงาน' : 'เปิดให้ส่งงาน' }}
              </button>
              
              <button 
                @click="showGradeModal = true"
                class="px-5 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <FileText class="w-4 h-4" />
                ตรวจงานนักเรียน
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Teacher Assignment Format Settings (Settings2 Gear) -->
    <Teleport to="body">
      <div
        v-if="showFormatModal"
        class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-sm overflow-y-auto"
        @click.self="showFormatModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0">
                <Settings2 class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-base sm:text-lg text-white">ตั้งค่ารูปแบบการส่งงาน</h3>
                <p class="text-xs text-stone-400 truncate max-w-md">
                  {{ assignmentTitle }} • วิชา {{ courseId }}
                </p>
              </div>
            </div>
            <button @click="showFormatModal = false" class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body (Settings Form & Preview) -->
          <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800 text-xs">
            
            <!-- Alert Banner if saved -->
            <div v-if="saveSuccessMessage" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <Check class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{{ saveSuccessMessage }}</span>
            </div>

            <!-- Target Classroom Filter -->
            <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <label class="font-black text-stone-700 block text-xs">
                ห้องเรียนเป้าหมายสำหรับการจัดกลุ่ม / สุ่ม:
              </label>
              <div class="flex items-center gap-3">
                <select
                  v-model="draftTargetClassroom"
                  @change="draftWorkType === 'pair' && draftPairingMode === 'auto' ? rollRandomPairs() : (draftWorkType === 'group' && draftGroupingMode === 'auto' ? rollRandomGroups() : null)"
                  class="flex-1 px-3 py-2 bg-white rounded-xl border border-stone-300 font-bold text-stone-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">ทุกห้องเรียนในรายวิชา (ทั้งหมด)</option>
                  <option v-for="room in availableClassroomsForCourse" :key="room" :value="room">
                    ห้อง {{ room }}
                  </option>
                </select>
                <span class="px-3 py-2 rounded-xl bg-stone-200/70 text-stone-700 font-mono font-bold whitespace-nowrap">
                  พบ นศ. {{ eligibleStudentsForDraft.length }} คน
                </span>
              </div>
            </div>

            <!-- STEP 1: Main Work Format Selector (เดี่ยว / คู่ / กลุ่ม) -->
            <div class="space-y-2.5">
              <label class="font-black text-stone-800 block text-xs uppercase tracking-wider">
                1. เลือกรูปแบบการส่งงาน:
              </label>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <!-- Individual -->
                <button
                  type="button"
                  @click="draftWorkType = 'individual'"
                  class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="draftWorkType === 'individual' ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/40 text-blue-950 shadow-xs' : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <User class="w-4 h-4" />
                    </div>
                    <span v-if="draftWorkType === 'individual'" class="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">✓</span>
                  </div>
                  <div class="font-black text-sm">งานเดี่ยว</div>
                  <div class="text-[11px] text-stone-500 mt-0.5">ทำและส่งงานคนเดียว</div>
                </button>

                <!-- Pair Work -->
                <button
                  type="button"
                  @click="draftWorkType = 'pair'; if (draftPairingMode === 'auto' && draftRandomizedPairs.length === 0) rollRandomPairs()"
                  class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="draftWorkType === 'pair' ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400/40 text-indigo-950 shadow-xs' : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Users class="w-4 h-4" />
                    </div>
                    <span v-if="draftWorkType === 'pair'" class="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</span>
                  </div>
                  <div class="font-black text-sm">งานคู่</div>
                  <div class="text-[11px] text-stone-500 mt-0.5">จับคู่ 2 คน (เศษเป็น 3 คน)</div>
                </button>

                <!-- Group Work -->
                <button
                  type="button"
                  @click="draftWorkType = 'group'; if (draftGroupingMode === 'auto' && draftRandomizedGroups.length === 0) rollRandomGroups()"
                  class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="draftWorkType === 'group' ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-400/40 text-purple-950 shadow-xs' : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Users class="w-4 h-4" />
                    </div>
                    <span v-if="draftWorkType === 'group'" class="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">✓</span>
                  </div>
                  <div class="font-black text-sm">งานกลุ่ม</div>
                  <div class="text-[11px] text-stone-500 mt-0.5">แบ่งกลุ่มตามอาจารย์กำหนด</div>
                </button>
              </div>
            </div>

            <!-- STEP 2A: FLOW FOR PAIR WORK (งานคู่) -->
            <div v-if="draftWorkType === 'pair'" class="p-4 bg-indigo-50/60 rounded-3xl border border-indigo-200 space-y-4 animate-in fade-in">
              <div class="flex items-center justify-between">
                <label class="font-black text-indigo-950 text-xs flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-indigo-600" />
                  <span>2. วิธีจัดคู่ทำงาน (Pairing Method):</span>
                </label>
                <span class="text-[11px] text-indigo-800 font-bold">
                  {{ eligibleStudentsForDraft.length }} คน แบ่งได้ {{ Math.ceil(eligibleStudentsForDraft.length / 2) }} คู่
                </span>
              </div>

              <!-- Options: Manual vs Auto Random -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="draftPairingMode === 'manual' ? 'border-indigo-500 ring-2 ring-indigo-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input
                    type="radio"
                    v-model="draftPairingMode"
                    value="manual"
                    class="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div class="font-bold text-stone-900">ให้นักศึกษาเลือกเอง</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">
                      นักศึกษาค้นหาและเลือกชื่อเพื่อนคู่หู 1 คนในระบบเวลาส่งงาน
                    </div>
                  </div>
                </label>

                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="draftPairingMode === 'auto' ? 'border-indigo-500 ring-2 ring-indigo-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input
                    type="radio"
                    v-model="draftPairingMode"
                    value="auto"
                    @change="rollRandomPairs"
                    class="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div class="font-bold text-stone-900">ระบบสุ่มจับคู่อัตโนมัติ</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">
                      แบ่งคู่ตามจำนวนคนในห้อง (ถ้าเศษจะมี 1 คู่นึงมี 3 คน)
                    </div>
                  </div>
                </label>
              </div>

              <!-- Auto Randomized Pairs Preview -->
              <div v-if="draftPairingMode === 'auto'" class="space-y-2.5 pt-2 border-t border-indigo-100">
                <div class="flex items-center justify-between">
                  <div class="font-black text-indigo-900 text-xs flex items-center gap-1.5">
                    <span>รายชื่อคู่ที่สุ่มได้ ({{ draftRandomizedPairs.length }} คู่):</span>
                    <span v-if="eligibleStudentsForDraft.length % 2 === 1" class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      มีเศษ 1 คน -> รวมเป็นคู่ 3 คน
                    </span>
                  </div>

                  <button
                    type="button"
                    @click="rollRandomPairs"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Shuffle class="w-3.5 h-3.5" />
                    <span>สุ่มจับคู่ใหม่</span>
                  </button>
                </div>

                <!-- Pairs List Grid Preview -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  <div
                    v-for="p in draftRandomizedPairs"
                    :key="p.pairIndex"
                    class="p-2.5 rounded-xl border bg-white border-indigo-200/80 shadow-2xs text-xs space-y-1"
                  >
                    <div class="flex items-center justify-between pb-1 border-b border-stone-100">
                      <span class="font-black text-indigo-950">คู่ที่ {{ p.pairIndex }}</span>
                      <span v-if="p.isTrio" class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">เศษ 3 คน</span>
                    </div>
                    <div v-for="m in p.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                      <span>{{ m.name }}</span>
                      <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2B: FLOW FOR GROUP WORK (งานกลุ่ม) -->
            <div v-if="draftWorkType === 'group'" class="p-4 bg-purple-50/60 rounded-3xl border border-purple-200 space-y-4 animate-in fade-in">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <label class="font-black text-purple-950 text-xs flex items-center gap-1.5">
                  <Users class="w-4 h-4 text-purple-600" />
                  <span>2. กำหนดจำนวนกลุ่มและวิธีจัดกลุ่ม:</span>
                </label>
                <span class="text-[11px] text-purple-800 font-bold">
                  (นศ. {{ eligibleStudentsForDraft.length }} คน ÷ {{ draftGroupCount }} กลุ่ม ≈ กลุ่มละ {{ Math.floor(eligibleStudentsForDraft.length / Math.max(1, draftGroupCount)) }}-{{ Math.ceil(eligibleStudentsForDraft.length / Math.max(1, draftGroupCount)) }} คน)
                </span>
              </div>

              <!-- Group Count Stepper / Selector -->
              <div class="p-3 bg-white rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                <span class="font-bold text-stone-800 text-xs">จำนวนกลุ่มที่ต้องการ:</span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="if (draftGroupCount > 2) { draftGroupCount--; if (draftGroupingMode === 'auto') rollRandomGroups(); }"
                    class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span class="w-12 text-center font-mono font-black text-sm text-purple-900">{{ draftGroupCount }} กลุ่ม</span>
                  <button
                    type="button"
                    @click="if (draftGroupCount < Math.min(10, eligibleStudentsForDraft.length)) { draftGroupCount++; if (draftGroupingMode === 'auto') rollRandomGroups(); }"
                    class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Options: Manual vs Auto Random -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="draftGroupingMode === 'manual' ? 'border-purple-500 ring-2 ring-purple-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input
                    type="radio"
                    v-model="draftGroupingMode"
                    value="manual"
                    class="mt-1 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div class="font-bold text-stone-900">ให้นักศึกษาเลือกเอง</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">
                      นักศึกษาค้นหาและเลือกสมาชิกในกลุ่มด้วยตนเองในระบบ
                    </div>
                  </div>
                </label>

                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="draftGroupingMode === 'auto' ? 'border-purple-500 ring-2 ring-purple-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input
                    type="radio"
                    v-model="draftGroupingMode"
                    value="auto"
                    @change="rollRandomGroups"
                    class="mt-1 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div class="font-bold text-stone-900">ระบบสุ่มจัดกลุ่มให้อัตโนมัติ</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">
                      ระบบเกลี่ยคนลงใน {{ draftGroupCount }} กลุ่มให้จำนวนเท่ากันที่สุด
                    </div>
                  </div>
                </label>
              </div>

              <!-- Auto Randomized Groups Preview -->
              <div v-if="draftGroupingMode === 'auto'" class="space-y-2.5 pt-2 border-t border-purple-100">
                <div class="flex items-center justify-between">
                  <span class="font-black text-purple-900 text-xs">
                    รายชื่อสมาชิกใน {{ draftRandomizedGroups.length }} กลุ่ม:
                  </span>

                  <button
                    type="button"
                    @click="rollRandomGroups"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Shuffle class="w-3.5 h-3.5" />
                    <span>สุ่มจัดกลุ่มใหม่</span>
                  </button>
                </div>

                <!-- Groups List Grid Preview -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                  <div
                    v-for="g in draftRandomizedGroups"
                    :key="g.groupIndex"
                    class="p-2.5 rounded-xl border bg-white border-purple-200/80 shadow-2xs text-xs space-y-1.5"
                  >
                    <div class="flex items-center justify-between pb-1 border-b border-stone-100">
                      <span class="font-black text-purple-950">{{ g.groupName }}</span>
                      <span class="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.2 rounded">
                        {{ g.members.length }} คน
                      </span>
                    </div>
                    <div class="space-y-1">
                      <div v-for="m in g.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                        <span>{{ m.name }}</span>
                        <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer Actions -->
          <div class="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              @click="showFormatModal = false"
              class="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200 font-bold transition text-xs cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="button"
              @click="saveFormatSettings"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Save class="w-4 h-4 text-emerald-400" />
              <span>บันทึกรูปแบบการส่งงาน</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modals -->
    <SubmitAssignmentModal 
      v-if="showSubmitModal"
      :is-open="showSubmitModal"
      @close="showSubmitModal = false"
      :course-id="courseId"
      :assignment-id="assignmentId"
      :assignment-title="assignmentTitle"
      :assignment-work-type="effectiveWorkType"
      :initial-edit="initialEditMode"
    />

    <GradeAssignmentModal
      v-if="showGradeModal"
      :is-open="showGradeModal"
      @close="showGradeModal = false"
      :course-id="courseId"
      :assignment-id="assignmentId"
      :assignment-title="assignmentTitle"
      :max-score="maxScore"
      :assignment-work-type="effectiveWorkType"
    />
  </section>
</template>
