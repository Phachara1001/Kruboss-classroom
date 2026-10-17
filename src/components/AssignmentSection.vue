<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Upload, XCircle, CheckCircle, CheckCircle2, FileText, FileSignature,
  Pencil, Link as LinkIcon, ExternalLink, Award, Clock,
  Smile, Laugh, Meh, Frown, Sparkles, AlertCircle
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { submissionsStore, gradesStore, fetchSubmissions, fetchGrades } from '@/data/gradesStore'
import SubmitAssignmentModal from '@/components/SubmitAssignmentModal.vue'
import GradeAssignmentModal from '@/components/GradeAssignmentModal.vue'

const props = defineProps({
  courseId: { type: String, required: true },
  assignmentId: { type: String, required: true },
  assignmentTitle: { type: String, required: true },
  maxScore: { type: Number, default: 10 }
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
const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id)

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
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm border border-rose-200">
        <FileSignature class="w-5 h-5" />
      </div>
      <h2 class="text-xl font-bold text-slate-800">ใบงานประจำสัปดาห์ (Assignment)</h2>
    </div>

    <div class="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
      <div class="flex gap-6">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl shrink-0">
          <slot name="number">1</slot>
        </div>
        <div class="flex-1 space-y-6">
          <div>
            <h3 class="text-xl font-bold text-slate-800">{{ assignmentTitle }}</h3>
            
            <div class="mt-2 text-slate-600">
              <slot name="description"></slot>
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
                class="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div class="flex items-start sm:items-center gap-3.5">
                  <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 class="w-6 h-6" />
                  </div>
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-black text-slate-900 text-sm">ส่งงานเรียบร้อยแล้ว</span>
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ส่งแล้ว
                      </span>
                      <span v-if="currentSubmission.submittedAt" class="text-xs text-stone-400 font-mono">
                        (ส่งเมื่อ: {{ currentSubmission.submittedAt }})
                      </span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-stone-600">
                      <span class="text-stone-400 font-medium">ลิงก์ที่ส่ง:</span>
                      <a 
                        :href="currentSubmission.link" 
                        target="_blank" 
                        class="text-blue-600 hover:text-blue-700 font-mono underline font-medium flex items-center gap-1 truncate max-w-xs sm:max-w-md"
                      >
                        <LinkIcon class="w-3.5 h-3.5 shrink-0" />
                        <span class="truncate">{{ currentSubmission.link }}</span>
                        <ExternalLink class="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button 
                    v-if="isSubmissionOpen"
                    @click="openSubmitModal(true)"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <Pencil class="w-3.5 h-3.5" /> แก้ไขลิงก์ส่งงาน
                  </button>
                  <span v-else class="text-xs text-stone-400 font-medium px-3 py-1.5 bg-stone-100 rounded-lg">
                    ปิดรับการแก้ไขแล้ว
                  </span>
                </div>
              </div>

              <!-- Case B: Not Yet Submitted -->
              <div 
                v-else
                class="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                    </div>
                    <p class="text-xs text-stone-500 mt-0.5">
                      เมื่อปฏิบัติกิจกรรมเสร็จสิ้น ให้คัดลอกลิงก์ผลงาน (Google Drive / OneDrive / Tinkercad) มาส่งที่นี่
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
            <div v-else class="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
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

    <!-- Modals -->
    <SubmitAssignmentModal 
      :is-open="showSubmitModal"
      @close="showSubmitModal = false"
      :course-id="courseId"
      :assignment-id="assignmentId"
      :assignment-title="assignmentTitle"
      :initial-edit="initialEditMode"
    />

    <GradeAssignmentModal
      :is-open="showGradeModal"
      @close="showGradeModal = false"
      :course-id="courseId"
      :assignment-id="assignmentId"
      :assignment-title="assignmentTitle"
      :max-score="maxScore"
    />
  </section>
</template>
