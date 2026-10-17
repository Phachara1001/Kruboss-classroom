<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX, RotateCcw,
  Lightbulb, CheckCircle2, Sparkles, Target, BookOpen, Link2
} from '@lucide/vue'

const props = defineProps({
  title: { type: String, default: 'โยงความสัมพันธ์' },
  subtitle: { type: String, default: 'เลือกคำศัพท์ทางซ้าย แล้วเลือกคำอธิบายที่ตรงกันทางขวา' },
  // [{ id, text, match, hint?, explanation? }]
  initialLeftTerms: { type: Array, required: true },
  // [{ id, text }]
  initialRightDefs: { type: Array, required: true }
})
const emit = defineEmits(['complete'])

/* ---------- สีของแต่ละคู่ ---------- */
const palette = [
  { hex: '#ec4899', badge: 'bg-pink-500 text-white' },
  { hex: '#3b82f6', badge: 'bg-blue-500 text-white' },
  { hex: '#22c55e', badge: 'bg-green-500 text-white' },
  { hex: '#eab308', badge: 'bg-yellow-400 text-black' },
  { hex: '#a855f7', badge: 'bg-purple-500 text-white' },
  { hex: '#f97316', badge: 'bg-orange-500 text-white' },
  { hex: '#14b8a6', badge: 'bg-teal-500 text-white' },
  { hex: '#ef4444', badge: 'bg-red-500 text-white' },
  { hex: '#6366f1', badge: 'bg-indigo-500 text-white' },
  { hex: '#84cc16', badge: 'bg-lime-400 text-black' }
]

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/* ---------- state ---------- */
const leftTerms = computed(() => props.initialLeftTerms)
const rightDefs = ref(shuffle([...props.initialRightDefs]))

const pairs = ref({})              // leftId -> rightId (เฉพาะคู่ที่ถูกและล็อกแล้ว)
const attempts = reactive({})      // leftId -> จำนวนครั้งที่จับผิด
const activeLeft = ref(null)
const wrongLeft = ref(null)
const wrongRight = ref(null)
const toast = ref(null)
const xp = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const mistakes = ref(0)
const isFinished = ref(false)
const confetti = ref([])
const soundOn = ref(true)

const total = computed(() => leftTerms.value.length)
const doneCount = computed(() => Object.keys(pairs.value).length)
const progress = computed(() => (total.value ? (doneCount.value / total.value) * 100 : 0))
const accuracy = computed(() => Math.round((total.value / (total.value + mistakes.value)) * 100))
const stars = computed(() => (accuracy.value >= 90 ? 3 : accuracy.value >= 65 ? 2 : 1))
const finishMessage = computed(() =>
  stars.value === 3 ? 'สุดยอด! จับคู่แม่นมาก' : stars.value === 2 ? 'เก่งมาก! เกือบเต็มแล้ว' : 'ผ่านแล้ว! ลองอีกรอบให้ได้ดาวเพิ่มนะ'
)

const indexOfLeft = (id) => leftTerms.value.findIndex(t => t.id === id)
const colorOf = (id) => palette[indexOfLeft(id) % palette.length]
const numOf = (id) => indexOfLeft(id) + 1

const isLeftMatched = (id) => pairs.value[id] !== undefined
const pairedLeftOfRight = (rightId) => leftTerms.value.find(l => pairs.value[l.id] === rightId)
const isRightMatched = (rightId) => !!pairedLeftOfRight(rightId)

// คำใบ้ขั้นสุดท้าย: ผิดครบ 3 ครั้ง -> คำตอบที่ถูกเรืองแสง
const glowRightId = computed(() => {
  const l = leftTerms.value.find(t => t.id === activeLeft.value)
  return l && attempts[l.id] >= 3 ? l.match : null
})

const missedItems = computed(() =>
  leftTerms.value.filter(l => attempts[l.id] > 0).map(l => ({
    ...l,
    tries: attempts[l.id],
    answer: props.initialRightDefs.find(r => r.id === l.match)?.text
  }))
)

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

/* ---------- toast ---------- */
let toastTimer
const showToast = (type, title, body = '') => {
  toast.value = { type, title, body }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3200)
}
const praises = ['ถูกต้อง!', 'เยี่ยมมาก!', 'เก่งมาก!', 'ใช่เลย!', 'ยอดเยี่ยม!']

/* ---------- เส้นโยง ---------- */
const boardRef = ref(null)
const itemEls = {}
const lines = ref([])

const computeLines = () => {
  const board = boardRef.value
  if (!board || window.innerWidth < 768) { lines.value = []; return }
  const b = board.getBoundingClientRect()
  lines.value = leftTerms.value
    .filter(l => isLeftMatched(l.id))
    .map(l => {
      const a = itemEls['l-' + l.id]
      const c = itemEls['r-' + pairs.value[l.id]]
      if (!a || !c) return null
      const ar = a.getBoundingClientRect()
      const cr = c.getBoundingClientRect()
      const x1 = ar.right - b.left
      const y1 = ar.top + ar.height / 2 - b.top
      const x2 = cr.left - b.left
      const y2 = cr.top + cr.height / 2 - b.top
      const mx = (x1 + x2) / 2
      return { id: l.id, d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`, color: colorOf(l.id).hex }
    })
    .filter(Boolean)
}

onMounted(() => window.addEventListener('resize', computeLines))
onBeforeUnmount(() => {
  window.removeEventListener('resize', computeLines)
  stopTimer()
  clearTimeout(toastTimer)
})

/* ---------- game logic ---------- */
const clickLeft = (item) => {
  if (isFinished.value || isLeftMatched(item.id)) return
  startTimer()
  activeLeft.value = activeLeft.value === item.id ? null : item.id
}

const clickRight = (def) => {
  if (isFinished.value || isRightMatched(def.id)) return
  startTimer()
  const left = leftTerms.value.find(l => l.id === activeLeft.value)
  if (!left) {
    showToast('info', 'เลือกคำศัพท์ทางซ้ายก่อนนะ', 'แล้วค่อยเลือกคำอธิบายที่ตรงกัน')
    return
  }

  if (left.match === def.id) {
    const firstTry = !attempts[left.id]
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
    const gain = (firstTry ? 100 : 50) + (streak.value > 1 ? (streak.value - 1) * 10 : 0)
    xp.value += gain
    pairs.value = { ...pairs.value, [left.id]: def.id }
    activeLeft.value = null

    const combo = streak.value >= 3 ? ` • คอมโบ x${streak.value} 🔥` : ''
    showToast('ok', `${praises[Math.floor(Math.random() * praises.length)]} +${gain} XP${combo}`, left.explanation || '')
    tone([660, 880])
    nextTick(computeLines)

    if (doneCount.value === total.value) finish()
  } else {
    attempts[left.id] = (attempts[left.id] || 0) + 1
    mistakes.value++
    streak.value = 0
    wrongLeft.value = left.id
    wrongRight.value = def.id
    setTimeout(() => { wrongLeft.value = null; wrongRight.value = null }, 500)

    let body = ''
    if (attempts[left.id] >= 3) body = 'ลองดูคำอธิบายที่เรืองแสงอยู่นะ ✨'
    else if (attempts[left.id] >= 2 && left.hint) body = `💡 คำใบ้: ${left.hint}`
    showToast('bad', 'ยังไม่ใช่ ลองใหม่อีกครั้ง!', body)
    tone([300, 220])
  }
}

const finish = () => {
  isFinished.value = true
  stopTimer()
  confetti.value = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.4 + Math.random() * 1.8,
    color: ['#a78bfa', '#34d399', '#fbbf24', '#38bdf8', '#f472b6'][i % 5],
    size: 6 + Math.random() * 6
  }))
  setTimeout(() => tone([523, 659, 784, 1046], 0.14), 250)
  emit('complete', { xp: xp.value, stars: stars.value, accuracy: accuracy.value, time: seconds.value, mistakes: mistakes.value })
}

const resetGame = () => {
  rightDefs.value = shuffle([...props.initialRightDefs])
  pairs.value = {}
  Object.keys(attempts).forEach(k => delete attempts[k])
  xp.value = 0; streak.value = 0; bestStreak.value = 0; mistakes.value = 0
  seconds.value = 0; isFinished.value = false; confetti.value = []
  activeLeft.value = null; wrongLeft.value = null; wrongRight.value = null
  toast.value = null; lines.value = []
  stopTimer()
}
</script>

<template>
  <section
    class="quiz relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-2xl md:p-10">
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl">
    </div>

    <!-- Confetti -->
    <div v-if="isFinished" class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <span v-for="c in confetti" :key="c.id" class="confetti"
        :style="{ left: c.left + '%', animationDelay: c.delay + 's', animationDuration: c.dur + 's', background: c.color, width: c.size + 'px', height: c.size * 1.6 + 'px' }"></span>
    </div>

    <div class="relative z-10">
      <!-- Header -->
      <header class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-sky-200">
            <Sparkles class="h-3.5 w-3.5" /> กิจกรรมจับคู่
          </div>
          <h3 class="text-3xl font-black tracking-tight md:text-4xl">{{ title }}</h3>
          <p class="mt-1 max-w-xl text-slate-300">{{ subtitle }}</p>
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

      <!-- Progress -->
      <div v-if="!isFinished" class="mb-8">
        <div class="mb-1.5 flex items-center justify-between text-sm">
          <span class="flex items-center gap-1.5 font-semibold text-slate-300">
            <Target class="h-4 w-4" /> จับคู่ถูกแล้ว
          </span>
          <span class="font-bold tabular-nums">{{ doneCount }} / {{ total }}</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 transition-all duration-700 ease-out"
            :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <!-- Result -->
      <div v-if="isFinished" class="result mb-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
        <div class="mb-6 text-center">
          <div class="mb-3 flex justify-center gap-2">
            <Star v-for="n in 3" :key="n"
              :class="['star h-12 w-12 md:h-14 md:w-14', n <= stars ? 'fill-amber-300 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.7)]' : 'text-white/20']"
              :style="{ animationDelay: n * 0.25 + 's' }" />
          </div>
          <h4 class="text-2xl font-black md:text-3xl">{{ finishMessage }}</h4>
        </div>

        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div class="result-card"><span>คะแนน XP</span><b>{{ xp }}</b></div>
          <div class="result-card"><span>ความแม่นยำ</span><b>{{ accuracy }}%</b></div>
          <div class="result-card"><span>คอมโบสูงสุด</span><b>x{{ bestStreak }}</b></div>
          <div class="result-card"><span>เวลา</span><b>{{ timeText }}</b></div>
        </div>

        <div class="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
          <h5 class="mb-3 flex items-center gap-2 font-bold text-sky-200">
            <BookOpen class="h-5 w-5" /> สิ่งที่ควรทบทวน
          </h5>
          <p v-if="missedItems.length === 0" class="text-emerald-300">ไม่มีข้อผิดพลาดเลย! คุณเข้าใจเนื้อหานี้ดีมาก 🎉
          </p>
          <ul v-else class="space-y-3">
            <li v-for="m in missedItems" :key="m.id" class="rounded-lg bg-white/5 p-3">
              <p class="font-semibold">
                {{ m.text }}
                <span class="ml-1 text-xs font-normal text-slate-400">(พลาด {{ m.tries }} ครั้ง)</span>
              </p>
              <p class="mt-1 text-sm text-emerald-300">→ {{ m.answer }}</p>
              <p v-if="m.explanation" class="mt-1 text-sm text-slate-300">{{ m.explanation }}</p>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex justify-center">
          <button @click="resetGame"
            class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-fuchsia-500 px-8 py-3.5 text-lg font-bold shadow-lg shadow-fuchsia-500/30 transition hover:scale-105 active:scale-95">
            <RotateCcw class="h-5 w-5" /> เล่นอีกครั้ง
          </button>
        </div>
      </div>

      <!-- Board -->
      <div ref="boardRef" class="relative grid gap-8 md:grid-cols-2 md:gap-24">
        <!-- เส้นโยง -->
        <svg class="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible md:block">
          <path v-for="ln in lines" :key="ln.id" :d="ln.d" fill="none" :stroke="ln.color" stroke-width="4"
            stroke-linecap="round" pathLength="1" class="line-draw"
            :style="{ filter: `drop-shadow(0 0 6px ${ln.color})` }" />
        </svg>

        <!-- ซ้าย: คำศัพท์ -->
        <div class="relative z-10 space-y-4">
          <h4 class="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-sky-300">
            <span :class="['step-dot', !activeLeft && !isFinished ? 'step-on' : '']">1</span> เลือกคำศัพท์
          </h4>
          <button v-for="item in leftTerms" :key="item.id" :ref="(el) => (itemEls['l-' + item.id] = el)"
            @click="clickLeft(item)" :disabled="isFinished || isLeftMatched(item.id)" :class="[
              'group flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left text-lg font-bold transition-all duration-200 md:text-xl',
              isLeftMatched(item.id)
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-50'
                : activeLeft === item.id
                  ? 'scale-[1.04] border-sky-300 bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_0_28px_rgba(56,189,248,0.55)]'
                  : 'border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15',
              wrongLeft === item.id ? 'anim-shake' : ''
            ]">
            <span class="flex items-center gap-3">
              <span
                :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black shadow-md', colorOf(item.id).badge]">
                {{ numOf(item.id) }}
              </span>
              {{ item.text }}
            </span>
            <CheckCircle2 v-if="isLeftMatched(item.id)" class="h-6 w-6 shrink-0 text-emerald-400" />
          </button>
        </div>

        <!-- ขวา: คำอธิบาย -->
        <div class="relative z-10 space-y-4">
          <h4 class="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-sky-300">
            <span :class="['step-dot', activeLeft && !isFinished ? 'step-on' : '']">2</span> เลือกคำอธิบายที่ตรงกัน
          </h4>
          <button v-for="def in rightDefs" :key="def.id" :ref="(el) => (itemEls['r-' + def.id] = el)"
            @click="clickRight(def)" :disabled="isFinished || isRightMatched(def.id)" :class="[
              'flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left text-base font-medium transition-all duration-200 md:text-lg',
              isRightMatched(def.id)
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-50'
                : activeLeft
                  ? 'cursor-pointer border-sky-400/50 bg-white/10 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-500/20'
                  : 'border-white/10 bg-white/5 text-white/80',
              wrongRight === def.id ? 'anim-shake !border-rose-400 !bg-rose-500/20' : '',
              glowRightId === def.id ? 'anim-glow !border-amber-300' : ''
            ]">
            <span class="flex items-center gap-3">
              <span v-if="isRightMatched(def.id)"
                :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black shadow-md', colorOf(pairedLeftOfRight(def.id).id).badge]">
                {{ numOf(pairedLeftOfRight(def.id).id) }}
              </span>
              <span v-else
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/25 text-white/40">
                <Link2 class="h-4 w-4" />
              </span>
              {{ def.text }}
            </span>
            <CheckCircle2 v-if="isRightMatched(def.id)" class="h-6 w-6 shrink-0 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" :class="[
        'absolute bottom-5 left-1/2 z-40 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md',
        toast.type === 'ok' ? 'border-emerald-400/50 bg-emerald-900/90'
          : toast.type === 'bad' ? 'border-rose-400/50 bg-rose-900/90'
            : 'border-sky-400/50 bg-slate-800/95'
      ]">
        <p class="flex items-center gap-2 font-bold">
          <CheckCircle2 v-if="toast.type === 'ok'" class="h-5 w-5 text-emerald-300" />
          <Lightbulb v-else class="h-5 w-5 text-amber-300" />
          {{ toast.title }}
        </p>
        <p v-if="toast.body" class="mt-1 text-sm text-white/85">{{ toast.body }}</p>
      </div>
    </Transition>
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

.step-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  transition: all 0.3s;
}

.step-on {
  background: #38bdf8;
  color: #0f172a;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.7);
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

.star {
  animation: starIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.result {
  animation: slideUp 0.5s ease-out;
}

.anim-shake {
  animation: shake 0.45s ease;
}

.anim-glow {
  animation: glow 1.2s ease-in-out infinite;
}

.line-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 0.6s ease-out forwards;
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.05);
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

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }

  50% {
    box-shadow: 0 0 32px 6px rgba(251, 191, 36, 0.55);
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
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
    transform: translateY(20px);
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