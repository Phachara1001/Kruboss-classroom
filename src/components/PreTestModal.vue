<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-scrollbar bg-stone-900/80 backdrop-blur-sm transition-opacity"
      style="scrollbar-width: none; -ms-overflow-style: none;"
      @click.self="handleCloseAttempt"
    >
      <div
        class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-sm shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Sparkles class="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-100 border border-emerald-400/30">
                  Pre-test แบบทดสอบก่อนเรียน
                </span>
                <span class="text-xs text-emerald-200">หน่วยที่ {{ week }}</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-white truncate max-w-md">
                {{ topicTitle || 'วัดความรู้ก่อนเริ่มเรียน' }}
              </h3>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Timer (if active) -->
            <div v-if="!isCompleted && testQuestions.length > 0" class="flex items-center space-x-1.5 px-3 py-1 bg-black/25 rounded-lg text-emerald-100 text-xs font-mono">
              <Clock class="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{{ formattedTime }}</span>
            </div>

            <!-- Close Button (Always visible) -->
            <button
              type="button"
              @click="handleCloseAttempt"
              class="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition cursor-pointer"
              title="ปิดหน้าต่าง (Close)"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Modal Body (Scrollable with hidden scrollbar) -->
        <div
          class="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 no-scrollbar"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <!-- State 1: No Questions Available -->
          <div v-if="testQuestions.length === 0" class="text-center py-12 space-y-4">
            <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertCircle class="w-8 h-8" />
            </div>
            <div class="space-y-1">
              <h4 class="text-lg font-bold text-stone-800">ยังไม่มีข้อสอบ Pre-test ในหัวข้อนี้</h4>
              <p class="text-sm text-stone-500 max-w-md mx-auto">
                ครูผู้สอนยังไม่ได้เพิ่มข้อสอบสำหรับสัปดาห์นี้ นักศึกษาสามารถเข้าสู่บทเรียนได้ทันที
              </p>
            </div>
            <button
              @click="proceedToLesson"
              class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition inline-flex items-center space-x-2"
            >
              <span>เข้าสู่บทเรียนทันที</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <!-- State 2: Already Completed Record Found -->
          <div v-else-if="existingRecord && !isRetaking && !isCompleted" class="text-center py-8 space-y-6">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 class="w-10 h-10" />
            </div>
            <div class="space-y-2">
              <h4 class="text-xl font-bold text-stone-900">คุณทำแบบทดสอบก่อนเรียนนี้แล้ว</h4>
              <p class="text-sm text-stone-600">
                ระบบได้บันทึกคะแนน Pre-test ครั้งแรกของคุณไว้แล้วอย่างปลอดภัย
              </p>
              <div class="inline-flex items-center space-x-4 bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-xl">
                <div>
                  <div class="text-xs text-emerald-600 font-semibold">คะแนนที่ได้</div>
                  <div class="text-2xl font-black text-emerald-700">
                    {{ existingRecord.score }} <span class="text-sm font-normal text-emerald-500">/ {{ existingRecord.maxScore }}</span>
                  </div>
                </div>
                <div class="w-px h-8 bg-emerald-200"></div>
                <div>
                  <div class="text-xs text-emerald-600 font-semibold">คิดเป็น</div>
                  <div class="text-2xl font-black text-emerald-700">
                    {{ existingRecord.percentage }}%
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center space-x-3 pt-2">
              <button
                @click="startRetake"
                class="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium rounded-xl transition text-sm flex items-center space-x-2"
              >
                <RotateCcw class="w-4 h-4" />
                <span>ทดสอบใหม่อีกครั้ง (ฝึกฝน)</span>
              </button>
              <button
                @click="proceedToLesson"
                class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>เข้าสู่เนื้อหาบทเรียน</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- State 3: Taking Test -->
          <div v-else-if="!isCompleted" class="space-y-6 pb-2">
            <!-- Instructions Notice -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs sm:text-sm text-amber-900">
              <HelpCircle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p class="font-bold">คำชี้แจงแบบทดสอบก่อนเรียน (Pre-test)</p>
                <p class="text-amber-800 mt-0.5">
                  แบบทดสอบนี้มีทั้งหมด {{ testQuestions.length }} ข้อ มีไว้เพื่อวัดระดับความรู้พื้นฐานก่อนเริ่มเรียน
                  ตอบตามความเข้าใจจริง ไม่ต้องกังวลเรื่องคะแนน คะแนนนี้จะนำไปเปรียบเทียบกับ Post-test เพื่อดูพัฒนาการของคุณ
                </p>
              </div>
            </div>

            <!-- Question Items -->
            <div class="space-y-6">
              <div
                v-for="(q, qIndex) in testQuestions"
                :key="q.id || qIndex"
                class="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3">
                    <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {{ qIndex + 1 }}
                    </span>
                    <span class="font-medium text-stone-900 text-sm sm:text-base leading-relaxed">
                      {{ q.question }}
                    </span>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-600 font-mono shrink-0 ml-2">
                    1 คะแนน
                  </span>
                </div>

                <!-- Choice options -->
                <div class="grid grid-cols-1 gap-2.5 pt-1 pl-10">
                  <label
                    v-for="(opt, optIdx) in q.options"
                    :key="opt.id || optIdx"
                    :class="[
                      'flex items-center space-x-3 p-3 rounded-lg border transition cursor-pointer text-sm',
                      selectedAnswers[q.id || qIndex] === (opt.id || opt.text)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
                    ]"
                  >
                    <input
                      type="radio"
                      :name="`q_${q.id || qIndex}`"
                      :value="opt.id || opt.text"
                      v-model="selectedAnswers[q.id || qIndex]"
                      class="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span class="font-bold text-stone-400 text-xs w-4">
                      {{ String.fromCharCode(65 + optIdx) }}.
                    </span>
                    <span class="flex-1">{{ opt.text }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- State 4: Completed Result Screen -->
          <div v-else class="text-center py-6 space-y-6">
            <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce">
              <Trophy class="w-10 h-10" />
            </div>

            <div class="space-y-1">
              <span class="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                ทำแบบทดสอบสำเร็จ
              </span>
              <h4 class="text-2xl font-black text-stone-900 mt-2">ยอดเยี่ยมมาก!</h4>
              <p class="text-sm text-stone-500">
                บันทึกผลการทำแบบทดสอบก่อนเรียนเรียบร้อยแล้ว
              </p>
            </div>

            <!-- Score Cards -->
            <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div class="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div class="text-xs text-stone-500">คะแนนที่ได้</div>
                <div class="text-2xl font-black text-emerald-600">
                  {{ resultScore }} <span class="text-xs font-normal text-stone-400">/ {{ testQuestions.length }}</span>
                </div>
              </div>
              <div class="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div class="text-xs text-stone-500">คิดเป็น</div>
                <div class="text-2xl font-black text-teal-600">
                  {{ resultPercentage }}%
                </div>
              </div>
              <div class="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div class="text-xs text-stone-500">เวลาที่ใช้</div>
                <div class="text-2xl font-black text-amber-600">
                  {{ formattedTime }}
                </div>
              </div>
            </div>

            <!-- Encouragement Note -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs sm:text-sm text-emerald-900 space-y-1">
              <p class="font-bold flex items-center space-x-1.5">
                <Sparkles class="w-4 h-4 text-emerald-600" />
                <span>พร้อมสำหรับการเรียนรู้!</span>
              </p>
              <p class="text-emerald-800">
                ตอนนี้คุณพร้อมเข้าสู่เนื้อหาบทเรียนแล้ว เมื่อเรียนจบอย่าลืมทำ Post-test ท้ายบท เพื่อสะสมเหรียญและวัดผลสัมฤทธิ์
              </p>
            </div>

            <div class="pt-2">
              <button
                @click="proceedToLesson"
                class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition inline-flex items-center space-x-2 text-base"
              >
                <span>เข้าสู่เนื้อหาบทเรียนทันที</span>
                <ArrowRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Action Bar (Fixed at Modal Footer, Outside scrollable area) -->
        <div
          v-if="!isCompleted && testQuestions.length > 0 && !(existingRecord && !isRetaking)"
          class="shrink-0 px-6 py-3.5 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-sm z-10"
        >
          <div class="text-xs text-stone-500">
            ตอบแล้ว <span class="font-bold text-emerald-600">{{ answeredCount }}</span> จาก {{ testQuestions.length }} ข้อ
          </div>

          <div class="flex items-center space-x-3">
            <button
              type="button"
              @click="handleCloseAttempt"
              class="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border border-stone-200"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="answeredCount < testQuestions.length || isSubmitting"
              class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition flex items-center space-x-2 text-sm cursor-pointer"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
              <span>ส่งคำตอบ Pre-test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Sparkles, X, Clock, AlertCircle, ArrowRight, CheckCircle2,
  RotateCcw, HelpCircle, Send, Trophy, Loader2
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import {
  getQuestionsByTopic,
  getStudentTestRecord,
  saveTestAttempt,
  fetchStudentTestRecordFromDB
} from '@/data/questionBankStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  courseId: {
    type: String,
    required: true
  },
  week: {
    type: [Number, String],
    required: true
  },
  topicTitle: {
    type: String,
    default: ''
  },
  canSkip: {
    type: Boolean,
    default: false
  },
  questions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'completed', 'proceed'])

const testQuestions = ref([])
const selectedAnswers = ref({})
const isSubmitting = ref(false)
const isCompleted = ref(false)
const isRetaking = ref(false)
const resultScore = ref(0)
const resultPercentage = ref(0)
const timerSeconds = ref(0)
let timerInterval = null

const existingRecord = computed(() => {
  const studentId = authUser.value?.studentId || authUser.value?.id
  if (!studentId || !props.courseId || !props.week) return null
  return getStudentTestRecord(props.courseId, props.week, studentId, 'pre')
})

const answeredCount = computed(() => {
  return Object.keys(selectedAnswers.value).filter(k => selectedAnswers.value[k] !== undefined).length
})

const formattedTime = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const loadQuestions = () => {
  if (props.questions && props.questions.length > 0) {
    testQuestions.value = JSON.parse(JSON.stringify(props.questions))
  } else {
    const list = getQuestionsByTopic(props.courseId, props.week)
    testQuestions.value = [...list]
  }
  selectedAnswers.value = {}
  isCompleted.value = false
  isRetaking.value = false
  timerSeconds.value = 0

  const studentId = authUser.value?.studentId || authUser.value?.id
  if (props.courseId && props.week && studentId) {
    fetchStudentTestRecordFromDB(props.courseId, props.week, studentId)
  }
}

const startTimer = () => {
  stopTimer()
  timerSeconds.value = 0
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const startRetake = () => {
  isRetaking.value = true
  selectedAnswers.value = {}
  isCompleted.value = false
  startTimer()
}

const handleSubmit = async () => {
  if (answeredCount.value < testQuestions.value.length) return
  isSubmitting.value = true
  stopTimer()

  try {
    let score = 0
    testQuestions.value.forEach((q, idx) => {
      const qKey = q.id || idx
      const chosen = selectedAnswers.value[qKey]
      const correctOpt = q.options.find(o => o.isCorrect)
      if (correctOpt && (
        chosen === correctOpt.id ||
        String(chosen).toLowerCase() === String(correctOpt.id).toLowerCase() ||
        chosen === correctOpt.text
      )) {
        score += (q.score || 1)
      }
    })

    const maxScore = testQuestions.value.reduce((sum, q) => sum + (q.score || 1), 0)
    resultScore.value = score
    resultPercentage.value = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

    const studentId = authUser.value?.studentId || authUser.value?.id
    await saveTestAttempt({
      courseId: props.courseId,
      week: Number(props.week),
      studentId,
      type: 'pre',
      score,
      maxScore,
      timeSpentSeconds: timerSeconds.value,
      answers: selectedAnswers.value
    })

    isCompleted.value = true
    emit('completed', { score, maxScore, percentage: resultPercentage.value })
  } catch (err) {
    console.error('Error submitting pre-test:', err)
  } finally {
    isSubmitting.value = false
  }
}

const proceedToLesson = () => {
  emit('proceed')
  emit('close')
}

const handleCloseAttempt = () => {
  emit('close')
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleCloseAttempt()
  }
}

watch([() => props.isOpen, () => props.courseId, () => props.week], ([newVal]) => {
  if (newVal) {
    loadQuestions()
    if (!existingRecord.value) {
      startTimer()
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeydown)
    }
  } else {
    stopTimer()
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeydown)
    }
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadQuestions()
    if (!existingRecord.value) {
      startTimer()
    }
  }
})

onUnmounted(() => {
  stopTimer()
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0px;
  background: transparent;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
