<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX, RotateCcw, Lightbulb,
  CheckCircle2, XCircle, Sparkles, BookOpen, Info, ChevronRight
} from '@lucide/vue'

const props = defineProps({
  // [{ question, options: [{ id, text, isCorrect }], explanation }]
  questions: { type: Array, required: true }
})
const emit = defineEmits(['complete'])

const letters = ['A', 'B', 'C', 'D', 'E', 'F']
const MAX_HINTS = 2

/* ---------- state ---------- */
const current = ref(0)
const selected = ref(null)
const phase = ref('answering')           // 'answering' | 'checked'
const answers = reactive({})             // idx -> { optionId, correct, hint }
const hintUsedOn = reactive({})          // idx -> true
const eliminated = ref([])               // option id ที่ถูกตัดออกในข้อปัจจุบัน
const hintsLeft = ref(MAX_HINTS)
const xp = ref(0)
const lastGain = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const isFinished = ref(false)
const showOnlyMissed = ref(false)
const confetti = ref([])
const soundOn = ref(true)

const q = computed(() => props.questions[current.value])
const total = computed(() => props.questions.length)
const isLast = computed(() => current.value === total.value - 1)
const score = computed(() => Object.values(answers).filter(a => a.correct).length)
const percent = computed(() => (total.value ? Math.round((score.value / total.value) * 100) : 0))
const stars = computed(() => (percent.value >= 90 ? 3 : percent.value >= 60 ? 2 : 1))
const finishMessage = computed(() =>
  stars.value === 3 ? 'สุดยอด! เข้าใจเนื้อหาดีมาก' : stars.value === 2 ? 'เก่งมาก! อีกนิดเดียวก็เต็ม' : 'ผ่านแล้ว! ทบทวนอีกหน่อยแล้วลองใหม่นะ'
)
const correctOptionOf = (question) => question.options.find(o => o.isCorrect)
const reviewList = computed(() =>
  props.questions
    .map((question, idx) => ({ question, idx, ans: answers[idx] }))
    .filter(r => !showOnlyMissed.value || (r.ans && !r.ans.correct))
)
const missedCount = computed(() => Object.values(answers).filter(a => !a.correct).length)

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
  } catch { /* ข้ามถ้าไม่รองรับเสียง */ }
}

/* ---------- actions ---------- */
const select = (id) => {
  if (phase.value !== 'answering' || eliminated.value.includes(id)) return
  startTimer()
  selected.value = id
}

const useHint = () => {
  if (phase.value !== 'answering' || hintsLeft.value <= 0 || hintUsedOn[current.value]) return
  startTimer()
  const wrongs = q.value.options.filter(o => !o.isCorrect)
  const removeCount = Math.min(2, wrongs.length - 1) // เหลือตัวหลอกอย่างน้อย 1 ตัว
  if (removeCount <= 0) return
  const picked = [...wrongs].sort(() => Math.random() - 0.5).slice(0, removeCount).map(o => o.id)
  eliminated.value = picked
  if (picked.includes(selected.value)) selected.value = null
  hintsLeft.value--
  hintUsedOn[current.value] = true
  tone([520, 440])
}

const check = () => {
  if (phase.value !== 'answering' || selected.value === null) return
  const opt = q.value.options.find(o => o.id === selected.value)
  const correct = !!opt?.isCorrect
  const hint = !!hintUsedOn[current.value]
  answers[current.value] = { optionId: selected.value, correct, hint }

  if (correct) {
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
    lastGain.value = (hint ? 60 : 100) + (streak.value > 1 ? (streak.value - 1) * 10 : 0)
    xp.value += lastGain.value
    tone([660, 880])
  } else {
    streak.value = 0
    lastGain.value = 0
    tone([300, 220])
  }
  phase.value = 'checked'
}

const next = () => {
  if (phase.value !== 'checked') return
  if (isLast.value) return finish()
  current.value++
  selected.value = null
  eliminated.value = []
  phase.value = 'answering'
}

const finish = () => {
  isFinished.value = true
  stopTimer()
  if (stars.value >= 2) {
    confetti.value = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 2.4 + Math.random() * 1.8,
      color: ['#34d399', '#2dd4bf', '#fbbf24', '#38bdf8', '#f472b6'][i % 5],
      size: 6 + Math.random() * 6
    }))
  }
  setTimeout(() => tone(stars.value >= 2 ? [523, 659, 784, 1046] : [440, 523], 0.14), 250)
  emit('complete', { score: score.value, total: total.value, xp: xp.value, stars: stars.value, accuracy: percent.value, time: seconds.value })
}

const resetQuiz = () => {
  current.value = 0; selected.value = null; phase.value = 'answering'
  Object.keys(answers).forEach(k => delete answers[k])
  Object.keys(hintUsedOn).forEach(k => delete hintUsedOn[k])
  eliminated.value = []; hintsLeft.value = MAX_HINTS
  xp.value = 0; lastGain.value = 0; streak.value = 0; bestStreak.value = 0
  seconds.value = 0; isFinished.value = false; showOnlyMissed.value = false; confetti.value = []
  stopTimer()
}

// คีย์ลัด: 1-6 / A-F เลือกตัวเลือก, Enter ตรวจ/ถัดไป (เมื่อโฟกัสที่การ์ด)
const onKey = (e) => {
  if (isFinished.value) return
  const k = e.key.toLowerCase()
  let idx = -1
  if (/^[1-6]$/.test(k)) idx = Number(k) - 1
  else if (/^[a-f]$/.test(k)) idx = k.charCodeAt(0) - 97
  if (idx >= 0 && q.value.options[idx]) { select(q.value.options[idx].id); return }
  if (e.key === 'Enter' && e.target === e.currentTarget) {
    phase.value === 'answering' ? check() : next()
  }
}
</script>

<template>
  <section tabindex="0" @keydown="onKey"
    class="quiz relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 p-5 text-white shadow-2xl outline-none md:p-10">
    <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl"></div>

    <!-- Confetti -->
    <div v-if="isFinished && confetti.length" class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <span v-for="c in confetti" :key="c.id" class="confetti"
        :style="{ left: c.left + '%', animationDelay: c.delay + 's', animationDuration: c.dur + 's', background: c.color, width: c.size + 'px', height: c.size * 1.6 + 'px' }"></span>
    </div>

    <!-- ================= กำลังทำข้อสอบ ================= -->
    <div v-if="!isFinished" class="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col">
      <header class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          class="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-200">
          <Sparkles class="h-3.5 w-3.5" /> แบบทดสอบ
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="stat">
            <Trophy class="h-4 w-4 text-amber-300" /><b class="tabular-nums">{{ xp }}</b><span>XP</span>
          </div>
          <div :class="['stat', streak >= 3 ? 'stat-hot' : '']">
            <Flame :class="['h-4 w-4', streak >= 3 ? 'text-orange-300' : 'text-slate-400']" />
            <b class="tabular-nums">x{{ streak }}</b><span>คอมโบ</span>
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

      <!-- Segmented progress -->
      <div class="mb-2 flex gap-1.5">
        <div v-for="(_, i) in questions" :key="i" :class="[
          'h-2.5 flex-1 rounded-full transition-all duration-500',
          answers[i] ? (answers[i].correct ? 'bg-emerald-400' : 'bg-rose-400')
            : i === current ? 'seg-now bg-white/80' : 'bg-white/10'
        ]"></div>
      </div>
      <p class="mb-7 text-right text-sm font-semibold text-emerald-200">ข้อที่ {{ current + 1 }} / {{ total }}</p>

      <!-- Question -->
      <div :key="current" class="q-in flex-1">
        <h3 class="mb-8 text-2xl font-black leading-snug drop-shadow-md md:text-4xl">{{ q.question }}</h3>

        <div class="space-y-3">
          <button v-for="(option, oi) in q.options" :key="option.id" @click="select(option.id)"
            :disabled="phase === 'checked' || eliminated.includes(option.id)" :class="[
              'group flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all duration-200 md:text-xl',
              /* ก่อนตรวจ */
              phase === 'answering' && eliminated.includes(option.id)
                ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/25 line-through' : '',
              phase === 'answering' && !eliminated.includes(option.id)
                ? (selected === option.id
                  ? 'scale-[1.02] border-emerald-300 bg-emerald-500/25 shadow-[0_0_24px_rgba(52,211,153,0.35)]'
                  : 'border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10')
                : '',
              /* หลังตรวจ */
              phase === 'checked' && option.isCorrect ? 'anim-pop border-emerald-400 bg-emerald-500/25 text-emerald-50' : '',
              phase === 'checked' && !option.isCorrect && selected === option.id ? 'anim-shake border-rose-400 bg-rose-500/25 text-rose-50' : '',
              phase === 'checked' && !option.isCorrect && selected !== option.id ? 'border-transparent bg-white/5 opacity-40' : ''
            ]">
            <span :class="[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base font-black transition-colors',
              phase === 'checked' && option.isCorrect ? 'border-emerald-300 bg-emerald-400 text-emerald-950'
                : phase === 'checked' && selected === option.id ? 'border-rose-300 bg-rose-400 text-rose-950'
                  : selected === option.id && phase === 'answering' ? 'border-emerald-300 bg-emerald-300 text-emerald-950'
                    : 'border-white/25 bg-black/20 text-white/80'
            ]">{{ letters[oi] }}</span>
            <span class="flex-1">{{ option.text }}</span>
            <CheckCircle2 v-if="phase === 'checked' && option.isCorrect" class="h-6 w-6 shrink-0 text-emerald-300" />
            <XCircle v-else-if="phase === 'checked' && selected === option.id" class="h-6 w-6 shrink-0 text-rose-300" />
          </button>
        </div>

        <!-- Feedback -->
        <Transition name="fb">
          <div v-if="phase === 'checked'" class="mt-6">
            <div :class="[
              'rounded-2xl border p-5',
              answers[current]?.correct ? 'border-emerald-400/40 bg-emerald-950/60' : 'border-rose-400/40 bg-rose-950/50'
            ]">
              <p class="flex flex-wrap items-center gap-2 text-lg font-extrabold">
                <template v-if="answers[current]?.correct">
                  <CheckCircle2 class="h-6 w-6 text-emerald-300" /> ถูกต้อง!
                  <span class="rounded-full bg-amber-300/20 px-3 py-0.5 text-sm font-bold text-amber-200">+{{ lastGain
                    }} XP</span>
                  <span v-if="streak >= 3"
                    class="rounded-full bg-orange-400/20 px-3 py-0.5 text-sm font-bold text-orange-200">คอมโบ x{{ streak
                    }} 🔥</span>
                </template>
                <template v-else>
                  <Lightbulb class="h-6 w-6 text-amber-300" /> ยังไม่ถูก ไม่เป็นไร มาดูเหตุผลกัน
                </template>
              </p>
              <p v-if="!answers[current]?.correct" class="mt-2 text-sm text-rose-100">
                คำตอบที่ถูกคือ: <b>{{ correctOptionOf(q)?.text }}</b>
              </p>
              <div v-if="q.explanation" class="mt-4 flex items-start gap-3 rounded-xl bg-black/25 p-4">
                <Info class="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                <div>
                  <p class="mb-1 text-xs font-bold uppercase tracking-wider text-sky-300">คำอธิบาย</p>
                  <p class="text-sky-50">{{ q.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Actions -->
      <footer class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        <button @click="useHint"
          :disabled="phase !== 'answering' || hintsLeft <= 0 || hintUsedOn[current] || q.options.filter(o => !o.isCorrect).length < 2"
          class="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-35">
          <Lightbulb class="h-4 w-4" /> ตัดตัวเลือก 50:50
          <span class="rounded-full bg-black/30 px-2 py-0.5 text-xs">เหลือ {{ hintsLeft }}</span>
        </button>

        <button v-if="phase === 'answering'" @click="check" :disabled="selected === null" :class="[
          'inline-flex items-center gap-2 rounded-xl px-8 py-3 text-lg font-extrabold shadow-lg transition',
          selected !== null
            ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 hover:scale-105 active:scale-95'
            : 'cursor-not-allowed bg-white/10 text-white/40'
        ]">
          <CheckCircle2 class="h-5 w-5" /> ตรวจคำตอบ
        </button>
        <button v-else @click="next"
          class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-extrabold text-emerald-900 shadow-lg transition hover:scale-105 active:scale-95">
          {{ isLast ? 'ดูผลสรุป' : 'ข้อถัดไป' }}
          <ChevronRight class="h-5 w-5" />
        </button>
      </footer>
    </div>

    <!-- ================= ผลสรุป ================= -->
    <div v-else class="result relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col">
      <div class="mb-8 text-center">
        <div class="mb-3 flex justify-center gap-2">
          <Star v-for="n in 3" :key="n"
            :class="['star h-12 w-12 md:h-14 md:w-14', n <= stars ? 'fill-amber-300 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.7)]' : 'text-white/20']"
            :style="{ animationDelay: n * 0.25 + 's' }" />
        </div>
        <h3 class="text-3xl font-black md:text-4xl">{{ finishMessage }}</h3>
        <p class="mt-1 text-emerald-200">
          ตอบถูก <b class="text-white">{{ score }}</b> จาก {{ total }} ข้อ
        </p>
      </div>

      <div class="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="result-card"><span>คะแนน</span><b>{{ score }}/{{ total }}</b></div>
        <div class="result-card"><span>คะแนน XP</span><b>{{ xp }}</b></div>
        <div class="result-card"><span>คอมโบสูงสุด</span><b>x{{ bestStreak }}</b></div>
        <div class="result-card"><span>เวลา</span><b>{{ timeText }}</b></div>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <h4 class="flex items-center gap-2 text-lg font-bold text-emerald-200">
          <BookOpen class="h-5 w-5" /> ทบทวนรายข้อ
        </h4>
        <label class="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-200">
          <input type="checkbox" v-model="showOnlyMissed" class="h-4 w-4 accent-emerald-400" />
          เฉพาะข้อที่พลาด ({{ missedCount }})
        </label>
      </div>

      <div class="custom-scrollbar max-h-[520px] flex-1 space-y-5 overflow-y-auto pr-2">
        <p v-if="reviewList.length === 0" class="rounded-2xl bg-black/20 p-6 text-center text-emerald-300">
          ไม่มีข้อที่พลาดเลย! เยี่ยมมาก 🎉
        </p>
        <div v-for="r in reviewList" :key="r.idx"
          class="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:p-6">
          <h5 class="mb-4 flex gap-3 text-lg font-bold">
            <span :class="['shrink-0', r.ans?.correct ? 'text-emerald-400' : 'text-rose-400']">{{ r.idx + 1 }}.</span>
            <span>{{ r.question.question }}</span>
          </h5>
          <div class="space-y-2">
            <div v-for="(option, oi) in r.question.options" :key="option.id" :class="[
              'flex items-start gap-3 rounded-xl border p-3',
              option.isCorrect ? 'border-emerald-500/50 bg-emerald-900/40'
                : r.ans?.optionId === option.id ? 'border-rose-500/50 bg-rose-900/40'
                  : 'border-transparent bg-white/5 opacity-50'
            ]">
              <CheckCircle2 v-if="option.isCorrect" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <XCircle v-else-if="r.ans?.optionId === option.id" class="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <span v-else class="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-white/20"></span>
              <div>
                <p class="font-medium">{{ letters[oi] }}. {{ option.text }}</p>
                <p v-if="r.ans?.optionId === option.id && !option.isCorrect"
                  class="mt-0.5 text-xs font-bold text-rose-300">
                  คำตอบของคุณ</p>
                <p v-if="option.isCorrect" class="mt-0.5 text-xs font-bold text-emerald-300">คำตอบที่ถูกต้อง</p>
              </div>
            </div>
          </div>
          <div v-if="r.question.explanation"
            class="mt-4 flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-900/20 p-4">
            <Info class="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
            <div>
              <p class="mb-1 text-xs font-bold uppercase tracking-wider text-sky-300">คำอธิบาย</p>
              <p class="text-sky-100">{{ r.question.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6">
        <button @click="resetQuiz"
          class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-3.5 text-lg font-extrabold text-emerald-950 shadow-lg transition hover:scale-105 active:scale-95">
          <RotateCcw class="h-5 w-5" /> ทำใหม่อีกครั้ง
        </button>
        <slot name="actions"></slot>
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

.stat span {
  color: #94a3b8;
  font-size: 0.75rem;
}

.stat-hot {
  background: rgba(251, 146, 60, 0.2);
  border-color: rgba(251, 146, 60, 0.5);
  animation: pop 0.4s ease;
}

.seg-now {
  animation: pulse 1.4s ease-in-out infinite;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: 0.9rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.result-card span {
  font-size: 0.75rem;
  color: #94a3b8;
}

.result-card b {
  font-size: 1.75rem;
  font-weight: 900;
}

.q-in {
  animation: slideUp 0.4s ease-out;
}

.result {
  animation: slideUp 0.5s ease-out;
}

.star {
  animation: starIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.anim-pop {
  animation: pop 0.45s ease;
}

.anim-shake {
  animation: shake 0.45s ease;
}

.confetti {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  opacity: 0;
  animation-name: fall;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.fb-enter-active {
  transition: all 0.35s ease;
}

.fb-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.03);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-8px);
  }

  40% {
    transform: translateX(8px);
  }

  60% {
    transform: translateX(-5px);
  }

  80% {
    transform: translateX(5px);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

@keyframes starIn {
  from {
    opacity: 0;
    transform: scale(0) rotate(-90deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fall {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }

  100% {
    opacity: 0;
    transform: translateY(560px) rotate(540deg);
  }
}
</style>