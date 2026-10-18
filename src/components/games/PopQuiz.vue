<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX, Lightbulb,
  CheckCircle2, XCircle, Sparkles, BookOpen, ChevronRight, ChevronLeft,
  Send, Lock, AlertCircle, FileQuestion, ArrowRight
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { gameScoresStore, getStudentGameScore, saveGameScore } from '@/data/gameScoresStore'

const props = defineProps({
  title: { type: String, default: 'แบบทดสอบหลังเรียน (Post-test)' },
  subtitle: { type: String, default: 'แบบทดสอบ 4 ตัวเลือก วัดความรู้ความเข้าใจหลังเรียน ทำได้เพียงครั้งเดียวเท่านั้น' },
  // [{ id, question, options: [{ id, text, isCorrect }], explanation }]
  questions: { type: Array, required: true },
  gameId: { type: String, default: 'quiz' },
  courseId: { type: String, default: '' },
  week: { type: Number, default: 1 }
})

const emit = defineEmits(['complete'])

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

/* ---------- state ---------- */
const current = ref(0)
const selectedAnswers = reactive({})     // idx -> optionId
const isFinished = ref(false)
const isAlreadyPlayed = ref(false)
const confetti = ref([])
const soundOn = ref(true)
const isSubmitting = ref(false)
const examScore = ref(0)

const q = computed(() => props.questions[current.value])
const total = computed(() => props.questions.length)
const answeredCount = computed(() => Object.keys(selectedAnswers).length)
const isLast = computed(() => current.value === total.value - 1)

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')

// ตรวจสอบคะแนนเดิม
const checkExistingScore = () => {
  if (!currentStudentId.value || !props.courseId || !props.week || !props.gameId) return
  const record = getStudentGameScore(props.courseId, props.week, currentStudentId.value, props.gameId)
  if (record) {
    isAlreadyPlayed.value = true
    isFinished.value = true
    examScore.value = record.score
  }
}

onMounted(() => {
  checkExistingScore()
})

const percent = computed(() => (total.value ? Math.round((examScore.value / total.value) * 100) : 0))
const stars = computed(() => (percent.value >= 80 ? 3 : percent.value >= 50 ? 2 : 1))

const finishMessage = computed(() =>
  stars.value === 3 ? 'ยอดเยี่ยมมาก! คุณเข้าใจเนื้อหาอย่างลึกซึ้ง' : stars.value === 2 ? 'เก่งมาก! ทำคะแนนได้ดี' : 'ทำแบบทดสอบเสร็จสิ้น หมั่นทบทวนเนื้อหานะ'
)

const correctOptionOf = (question) => question.options.find(o => o.isCorrect)

/* ---------- timer ---------- */
const seconds = ref(0)
let timer = null
const startTimer = () => { if (!timer && !isFinished.value) timer = setInterval(() => seconds.value++, 1000) }
const stopTimer = () => { clearInterval(timer); timer = null }
const timeText = computed(() => {
  const m = String(Math.floor(seconds.value / 60)).padStart(2, '0')
  const s = String(seconds.value % 60).padStart(2, '0')
  return `${m}:${s}`
})
onBeforeUnmount(stopTimer)

/* ---------- sound ---------- */
let audioCtx
const tone = (freqs, dur = 0.12) => {
  if (!soundOn.value) return
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)()
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator()
      const g = audioCtx.createGain()
      const t = audioCtx.currentTime + i * dur
      o.type = 'sine'
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      o.connect(g).connect(audioCtx.destination)
      o.start(t)
      o.stop(t + dur + 0.02)
    })
  } catch { /* ข้าม */ }
}

/* ---------- actions ---------- */
const selectOption = (optId) => {
  if (isFinished.value) return
  startTimer()
  selectedAnswers[current.value] = optId
  tone([520], 0.06)
}

const goToQuestion = (idx) => {
  if (idx >= 0 && idx < total.value) {
    current.value = idx
  }
}

const prevQuestion = () => {
  if (current.value > 0) current.value--
}

const nextQuestion = () => {
  if (current.value < total.value - 1) current.value++
}

// ส่งแบบทดสอบและบันทึกคะแนน
const submitQuiz = async () => {
  if (isFinished.value || isSubmitting.value) return

  const unanswered = []
  for (let i = 0; i < total.value; i++) {
    if (!selectedAnswers[i]) unanswered.push(i + 1)
  }

  if (unanswered.length > 0) {
    const confirm = window.confirm(`คุณยังไม่ได้ตอบคำถามข้อ: ${unanswered.join(', ')} (เหลืออีก ${unanswered.length} ข้อ)\nต้องการยืนยันส่งแบบทดสอบและบันทึกคะแนนตอนนี้หรือไม่?`)
    if (!confirm) return
  }

  isSubmitting.value = true
  stopTimer()

  // ตรวจคำตอบทุกข้อ
  let correctCount = 0
  props.questions.forEach((question, idx) => {
    const chosenOptId = selectedAnswers[idx]
    const correctOpt = correctOptionOf(question)
    if (chosenOptId && correctOpt && chosenOptId === correctOpt.id) {
      correctCount++
    }
  })

  examScore.value = correctCount

  // บันทึกคะแนนเข้าระบบ (ครั้งเดียวเท่านั้น)
  if (currentStudentId.value && props.courseId && props.week) {
    await saveGameScore(
      props.courseId,
      props.week,
      currentStudentId.value,
      props.gameId,
      correctCount,
      total.value
    )
  }

  isFinished.value = true
  isSubmitting.value = false

  confetti.value = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.4 + Math.random() * 1.8,
    color: ['#34d399', '#2dd4bf', '#fbbf24', '#38bdf8', '#f472b6'][i % 5],
    size: 6 + Math.random() * 6
  }))
  setTimeout(() => tone(stars.value >= 2 ? [523, 659, 784, 1046] : [440, 523], 0.14), 200)

  emit('complete', {
    score: correctCount,
    total: total.value,
    accuracy: percent.value,
    time: seconds.value
  })
}

// คีย์ลัด: A-D หรือ 1-4 เลือกตัวเลือก
const onKey = (e) => {
  if (isFinished.value) return
  const k = e.key.toLowerCase()
  let idx = -1
  if (/^[1-4]$/.test(k)) idx = Number(k) - 1
  else if (/^[a-d]$/.test(k)) idx = k.charCodeAt(0) - 97
  if (idx >= 0 && q.value.options[idx]) {
    selectOption(q.value.options[idx].id)
  }
}
</script>

<template>
  <section tabindex="0" @keydown="onKey"
    class="quiz relative flex min-h-[540px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-950 p-5 text-white shadow-2xl outline-none md:p-10">
    <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl"></div>

    <!-- Confetti -->
    <div v-if="isFinished && confetti.length" class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <span v-for="c in confetti" :key="c.id" class="confetti"
        :style="{ left: c.left + '%', animationDelay: c.delay + 's', animationDuration: c.dur + 's', background: c.color, width: c.size + 'px', height: c.size * 1.6 + 'px' }"></span>
    </div>

    <!-- Header -->
    <div class="relative z-10 mx-auto flex w-full max-w-4xl flex-col">
      <header class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            class="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-200">
            <Sparkles class="h-3.5 w-3.5" /> {{ title }} • กิจกรรมสุดท้าย
          </div>
          <p class="text-xs text-slate-300 mt-1">{{ subtitle }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div v-if="isFinished" class="stat bg-emerald-500/20 border-emerald-400/40 text-emerald-200">
            <CheckCircle2 class="h-4 w-4 text-emerald-300" />
            <span class="font-bold">คะแนน: {{ examScore }} / {{ total }}</span>
          </div>
          <div class="stat">
            <Timer class="h-4 w-4 text-sky-300" /><b class="tabular-nums">{{ timeText }}</b>
          </div>
          <button class="stat transition hover:bg-white/15" @click="soundOn = !soundOn"
            :aria-label="soundOn ? 'ปิดเสียง' : 'เปิดเสียง'">
            <Volume2 v-if="soundOn" class="h-4 w-4" />
            <VolumeX v-else class="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>

      <!-- Alert if already played previously -->
      <div v-if="isAlreadyPlayed" class="mb-6 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 backdrop-blur">
        <div class="flex items-center gap-3">
          <Lock class="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <h4 class="font-bold text-amber-200 text-lg">คุณได้ส่งแบบทดสอบหลังเรียนนี้แล้ว</h4>
            <p class="text-amber-100/80 text-sm mt-0.5">
              คะแนนที่บันทึกได้คือ <span class="font-bold text-white text-base">{{ examScore }} / {{ total }}</span> คะแนน (ตามกติกาทำได้เพียงครั้งเดียว ไม่สามารถแก้ไขได้)
            </p>
          </div>
        </div>
      </div>

      <!-- ================= หน้าผลคะแนนและเฉลยละเอียด ================= -->
      <div v-if="isFinished" class="space-y-6">
        <div class="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8 text-center">
          <div class="mb-3 flex justify-center gap-2">
            <Star v-for="n in 3" :key="n"
              :class="['h-12 w-12 md:h-14 md:w-14', n <= stars ? 'fill-amber-300 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.7)]' : 'text-white/20']" />
          </div>
          <h4 class="text-2xl font-black md:text-3xl">{{ finishMessage }}</h4>
          <p class="text-slate-300 text-sm mt-1">บันทึกคะแนนเข้าสู่ระบบเรียบร้อยแล้ว</p>

          <div class="grid grid-cols-2 gap-3 md:grid-cols-3 max-w-lg mx-auto my-6">
            <div class="result-card bg-emerald-500/20 border-emerald-400/30">
              <span class="text-emerald-200">คะแนนที่ได้</span>
              <b class="text-2xl text-emerald-300">{{ examScore }} / {{ total }}</b>
            </div>
            <div class="result-card">
              <span>ความแม่นยำ</span>
              <b>{{ percent }}%</b>
            </div>
            <div class="result-card">
              <span>เวลาที่ใช้</span>
              <b>{{ timeText }}</b>
            </div>
          </div>
        </div>

        <!-- รายการเฉลยข้อสอบทั้งหมด -->
        <div class="rounded-2xl border border-white/10 bg-black/30 p-5 md:p-7 space-y-5">
          <h5 class="flex items-center gap-2 text-xl font-bold text-emerald-300">
            <BookOpen class="h-6 w-6" /> เฉลยและคำอธิบายแบบทดสอบหลังเรียน ({{ total }} ข้อ)
          </h5>

          <div class="space-y-4">
            <div v-for="(question, qIdx) in questions" :key="question.id || qIdx"
              :class="[
                'p-5 rounded-2xl border transition-colors',
                selectedAnswers[qIdx] === correctOptionOf(question)?.id
                  ? 'border-emerald-500/40 bg-emerald-950/30'
                  : 'border-rose-500/40 bg-rose-950/25'
              ]">
              <div class="flex items-start justify-between gap-3 mb-3">
                <h6 class="font-bold text-base md:text-lg text-white">
                  ข้อที่ {{ qIdx + 1 }}. {{ question.question }}
                </h6>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1',
                  selectedAnswers[qIdx] === correctOptionOf(question)?.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                ]">
                  <CheckCircle2 v-if="selectedAnswers[qIdx] === correctOptionOf(question)?.id" class="w-3.5 h-3.5" />
                  <XCircle v-else class="w-3.5 h-3.5" />
                  <span>{{ selectedAnswers[qIdx] === correctOptionOf(question)?.id ? 'ถูกต้อง (+1)' : 'ไม่ถูกต้อง (0)' }}</span>
                </span>
              </div>

              <!-- Options review -->
              <div class="space-y-2 mb-3">
                <div v-for="(opt, optIdx) in question.options" :key="opt.id"
                  :class="[
                    'flex items-center gap-3 p-3 rounded-xl text-sm font-medium border',
                    opt.isCorrect
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-100'
                      : selectedAnswers[qIdx] === opt.id
                        ? 'bg-rose-500/25 border-rose-400 text-rose-100 line-through'
                        : 'bg-white/5 border-white/5 text-slate-400'
                  ]">
                  <span class="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center font-bold text-xs shrink-0">
                    {{ letters[optIdx] }}
                  </span>
                  <span class="flex-1">{{ opt.text }}</span>
                  <span v-if="opt.isCorrect" class="text-xs text-emerald-300 font-bold shrink-0">✓ คำตอบที่ถูกต้อง</span>
                  <span v-else-if="selectedAnswers[qIdx] === opt.id" class="text-xs text-rose-300 font-bold shrink-0">✗ คำตอบที่คุณเลือก</span>
                </div>
              </div>

              <!-- Explanation -->
              <div v-if="question.explanation" class="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
                <Lightbulb class="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-amber-200">คำอธิบาย:</strong> {{ question.explanation }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center items-center gap-2 text-slate-400 text-sm py-4">
          <Lock class="w-4 h-4 text-slate-400" />
          <span>บันทึกคะแนนเรียบร้อยแล้ว ไม่สามารถทำซ้ำได้</span>
        </div>
      </div>

      <!-- ================= กำลังทำแบบทดสอบ ================= -->
      <div v-if="!isFinished" class="space-y-6">
        <!-- แถบเลือกข้อแบบปุ่มตัวเลข (Question Palette) -->
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
              ข้อสอบทั้งหมด ({{ total }} ข้อ 4 ตัวเลือก)
            </span>
            <span class="text-xs font-semibold text-emerald-300">
              ตอบแล้ว {{ answeredCount }} / {{ total }} ข้อ
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button v-for="(question, qIdx) in questions" :key="qIdx"
              @click="goToQuestion(qIdx)"
              :class="[
                'w-9 h-9 rounded-xl font-bold text-sm transition-all flex items-center justify-center',
                qIdx === current
                  ? 'ring-2 ring-emerald-300 bg-emerald-500 text-slate-950 scale-105 shadow-md'
                  : selectedAnswers[qIdx]
                    ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/35'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/15 hover:text-white'
              ]">
              {{ qIdx + 1 }}
            </button>
          </div>
        </div>

        <!-- กล่องคำถาม -->
        <div class="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              ข้อที่ {{ current + 1 }} จาก {{ total }}
            </span>
            <span v-if="selectedAnswers[current]" class="text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" /> เลือกคำตอบแล้ว
            </span>
            <span v-else class="text-xs text-amber-300/80 font-medium">
              ยังไม่ได้เลือกคำตอบ
            </span>
          </div>

          <h3 class="mb-6 text-xl md:text-2xl font-bold leading-relaxed text-white">
            {{ q.question }}
          </h3>

          <!-- ตัวเลือก 4 ชอยส์ (A, B, C, D) -->
          <div class="space-y-3 mb-8">
            <button v-for="(option, oi) in q.options" :key="option.id"
              @click="selectOption(option.id)"
              :class="[
                'group flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-sm md:text-base font-medium transition-all duration-200',
                selectedAnswers[current] === option.id
                  ? 'border-emerald-400 bg-emerald-500/25 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-[1.01]'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10'
              ]">
              <span :class="[
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition-colors',
                selectedAnswers[current] === option.id
                  ? 'border-emerald-300 bg-emerald-300 text-emerald-950 font-black'
                  : 'border-white/20 bg-black/30 text-white'
              ]">{{ letters[oi] }}</span>
              <span class="flex-1 leading-relaxed">{{ option.text }}</span>
              <div v-if="selectedAnswers[current] === option.id" class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
            </button>
          </div>

          <!-- Bottom Nav / Submit -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button @click="prevQuestion" :disabled="current === 0"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                <ChevronLeft class="w-4 h-4" /> ก่อนหน้า
              </button>
              <button @click="nextQuestion" :disabled="current === total - 1"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                ถัดไป <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <!-- Submit Button -->
            <button @click="submitQuiz" :disabled="isSubmitting"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-7 py-3 text-sm md:text-base font-black text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50">
              <Send class="h-4 w-4" />
              <span>{{ isSubmitting ? 'กำลังบันทึกคะแนน...' : 'ส่งแบบทดสอบและบันทึกคะแนน' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.875rem;
  color: #e2e8f0;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.result-card span {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}
.result-card b {
  font-size: 1.25rem;
}

.confetti {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation: fall linear forwards;
}

@keyframes fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}
</style>