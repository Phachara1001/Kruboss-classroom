<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX,
  Lightbulb, CheckCircle2, XCircle, Sparkles, Target, BookOpen, Link2,
  Send, Lock, AlertCircle
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { gameScoresStore, getStudentGameScore, saveGameScore } from '@/data/gameScoresStore'

const props = defineProps({
  title: { type: String, default: 'โยงความสัมพันธ์' },
  subtitle: { type: String, default: 'เลือกคำศัพท์ทางซ้าย แล้วเลือกคำอธิบายที่ตรงกันทางขวา แล้วกดบันทึกคำตอบ' },
  // [{ id, text, match, hint?, explanation? }]
  initialLeftTerms: { type: Array, required: true },
  // [{ id, text }]
  initialRightDefs: { type: Array, required: true },
  examMode: { type: Boolean, default: true },
  gameId: { type: String, default: 'game-2' },
  courseId: { type: String, default: '' },
  week: { type: Number, default: 1 }
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
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/* ---------- state ---------- */
const leftTerms = computed(() => props.initialLeftTerms)
const rightDefs = ref(shuffle([...props.initialRightDefs]))

const pairs = ref({})              // leftId -> rightId (จับคู่ไว้)
const activeLeft = ref(null)
const xp = ref(0)
const isFinished = ref(false)
const isAlreadyPlayed = ref(false)
const confetti = ref([])
const soundOn = ref(true)
const isSubmitting = ref(false)
const examScore = ref(0)

const total = computed(() => leftTerms.value.length)
const doneCount = computed(() => Object.keys(pairs.value).length)
const progress = computed(() => (total.value ? (doneCount.value / total.value) * 100 : 0))

const indexOfLeft = (id) => leftTerms.value.findIndex(t => t.id === id)
const colorOf = (id) => palette[indexOfLeft(id) % palette.length]
const numOf = (id) => indexOfLeft(id) + 1

const isLeftMatched = (id) => pairs.value[id] !== undefined
const pairedLeftOfRight = (rightId) => leftTerms.value.find(l => pairs.value[l.id] === rightId)
const isRightMatched = (rightId) => !!pairedLeftOfRight(rightId)

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')

// ตรวจสอบคะแนนเดิม
const checkExistingScore = () => {
  if (!currentStudentId.value || !props.courseId || !props.week || !props.gameId) return
  const record = getStudentGameScore(props.courseId, props.week, currentStudentId.value, props.gameId)
  if (record) {
    isAlreadyPlayed.value = true
    isFinished.value = true
    examScore.value = record.score
    xp.value = record.score * 100
  }
}

onMounted(() => {
  checkExistingScore()
})

const stars = computed(() => {
  const percent = total.value > 0 ? (examScore.value / total.value) * 100 : 0
  return percent >= 80 ? 3 : percent >= 50 ? 2 : 1
})

const finishMessage = computed(() =>
  stars.value === 3 ? 'สุดยอด! จับคู่ถูกต้องครบถ้วน' : stars.value === 2 ? 'เก่งมาก! ทำได้คะแนนดี' : 'ทำเสร็จเรียบร้อยแล้ว หมั่นทบทวนนะ'
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
  } catch { /* ข้าม */ }
}

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
})

/* ---------- game logic ---------- */
const clickLeft = (item) => {
  if (isFinished.value) return
  startTimer()

  // หากจับคู่อยู่แล้ว การคลิกอีกครั้งจะยกเลิกการจับคู่เพื่อให้เลือกใหม่
  if (isLeftMatched(item.id)) {
    const nextPairs = { ...pairs.value }
    delete nextPairs[item.id]
    pairs.value = nextPairs
    activeLeft.value = item.id
    tone([420], 0.06)
    nextTick(computeLines)
    return
  }

  activeLeft.value = activeLeft.value === item.id ? null : item.id
  tone([520], 0.05)
}

const clickRight = (def) => {
  if (isFinished.value) return
  startTimer()

  // หากไม่มี left ที่ active อยู่ แต่คลิกขวาที่มีคู่อยู่ ให้ปลดคู่
  const pairedLeft = pairedLeftOfRight(def.id)
  if (!activeLeft.value && pairedLeft) {
    const nextPairs = { ...pairs.value }
    delete nextPairs[pairedLeft.id]
    pairs.value = nextPairs
    tone([420], 0.06)
    nextTick(computeLines)
    return
  }

  if (!activeLeft.value) return

  // จับคู่ (โดยไม่เฉลยว่าถูกหรือผิด)
  const leftId = activeLeft.value

  // ถ้าคำอธิบายนี้เคยจับคู่กับคำอื่น ให้ปลดอันเดิม
  const nextPairs = { ...pairs.value }
  Object.keys(nextPairs).forEach(k => {
    if (nextPairs[k] === def.id) delete nextPairs[k]
  })

  nextPairs[leftId] = def.id
  pairs.value = nextPairs
  activeLeft.value = null
  tone([600], 0.08)
  nextTick(computeLines)
}

// ส่งคำตอบและบันทึกคะแนนทีเดียว
const submitExam = async () => {
  if (isFinished.value || isSubmitting.value) return

  if (doneCount.value < total.value) {
    const remaining = total.value - doneCount.value
    const confirm = window.confirm(`คุณยังจับคู่ไม่ครบ (เหลืออีก ${remaining} คู่)\nต้องการยืนยันส่งคำตอบและบันทึกคะแนนตอนนี้หรือไม่?`)
    if (!confirm) return
  }

  isSubmitting.value = true
  stopTimer()

  // ตรวจคำตอบ
  let correct = 0
  leftTerms.value.forEach(l => {
    if (pairs.value[l.id] === l.match) {
      correct++
    }
  })

  examScore.value = correct
  xp.value = correct * 100

  // บันทึกคะแนนเข้าระบบ (ครั้งเดียวเท่านั้น)
  if (currentStudentId.value && props.courseId && props.week) {
    await saveGameScore(
      props.courseId,
      props.week,
      currentStudentId.value,
      props.gameId,
      correct,
      total.value
    )
  }

  isFinished.value = true
  isSubmitting.value = false

  confetti.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.4 + Math.random() * 1.8,
    color: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'][i % 5],
    size: 6 + Math.random() * 6
  }))
  setTimeout(() => tone([523, 659, 784, 1046], 0.14), 200)

  emit('complete', {
    score: correct,
    maxScore: total.value,
    xp: xp.value,
    time: seconds.value
  })
}
</script>

<template>
  <section
    class="quiz relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-2xl md:p-10">
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl"></div>

    <!-- Confetti -->
    <div v-if="isFinished && confetti.length" class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <span v-for="c in confetti" :key="c.id" class="confetti"
        :style="{ left: c.left + '%', animationDelay: c.delay + 's', animationDuration: c.dur + 's', background: c.color, width: c.size + 'px', height: c.size * 1.6 + 'px' }"></span>
    </div>

    <div class="relative z-10">
      <!-- Header -->
      <header class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
            <Sparkles class="h-3.5 w-3.5" /> มินิเกมบันทึกคะแนน • เล่นได้ครั้งเดียว
          </div>
          <h3 class="text-3xl font-black tracking-tight md:text-4xl">{{ title }}</h3>
          <p class="mt-1 max-w-xl text-slate-300">{{ subtitle }}</p>
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
            <h4 class="font-bold text-amber-200 text-lg">คุณได้ส่งคำตอบกิจกรรมนี้แล้ว</h4>
            <p class="text-amber-100/80 text-sm mt-0.5">
              คะแนนที่บันทึกได้คือ <span class="font-bold text-white text-base">{{ examScore }} / {{ total }}</span> คะแนน (ตามกติกาเล่นได้เพียงครั้งเดียว ไม่สามารถแก้ไขได้)
            </p>
          </div>
        </div>
      </div>

      <!-- Result Screen (After Submit) -->
      <div v-if="isFinished" class="result mb-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
        <div class="mb-6 text-center">
          <div class="mb-3 flex justify-center gap-2">
            <Star v-for="n in 3" :key="n"
              :class="['star h-12 w-12 md:h-14 md:w-14', n <= stars ? 'fill-amber-300 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.7)]' : 'text-white/20']"
              :style="{ animationDelay: n * 0.25 + 's' }" />
          </div>
          <h4 class="text-2xl font-black md:text-3xl">{{ finishMessage }}</h4>
          <p class="text-slate-300 text-sm mt-1">บันทึกคะแนนเข้าสู่ระบบเรียบร้อยแล้ว</p>
        </div>

        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 max-w-xl mx-auto mb-6">
          <div class="result-card bg-emerald-500/20 border-emerald-400/30">
            <span class="text-emerald-200">คะแนนที่ได้</span>
            <b class="text-2xl text-emerald-300">{{ examScore }} / {{ total }}</b>
          </div>
          <div class="result-card">
            <span>ความแม่นยำ</span>
            <b>{{ total > 0 ? Math.round((examScore / total) * 100) : 0 }}%</b>
          </div>
          <div class="result-card">
            <span>เวลาที่ใช้</span>
            <b>{{ timeText }}</b>
          </div>
        </div>

        <!-- เฉลยและทบทวนความเข้าใจ -->
        <div class="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
          <h5 class="mb-4 flex items-center gap-2 font-bold text-sky-200 text-lg">
            <BookOpen class="h-5 w-5" /> ตรวจสอบความถูกต้องของแต่ละคู่
          </h5>

          <div class="space-y-3">
            <div v-for="l in leftTerms" :key="l.id"
              :class="[
                'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm',
                pairs[l.id] === l.match ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/40 bg-rose-500/10 text-rose-100'
              ]">
              <div class="flex items-center gap-2 font-bold">
                <span class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs">{{ numOf(l.id) }}</span>
                <span class="text-base text-white">{{ l.text }}</span>
              </div>

              <div class="flex-1 md:text-right">
                <div v-if="pairs[l.id] === l.match" class="flex items-center md:justify-end gap-1.5 text-emerald-300 font-semibold">
                  <CheckCircle2 class="w-4 h-4" />
                  <span>{{ initialRightDefs.find(r => r.id === l.match)?.text }}</span>
                </div>
                <div v-else class="space-y-1">
                  <div class="flex items-center md:justify-end gap-1.5 text-rose-300 line-through opacity-75">
                    <XCircle class="w-4 h-4 shrink-0" />
                    <span>คุณเลือก: {{ initialRightDefs.find(r => r.id === pairs[l.id])?.text || '(ไม่ได้จับคู่)' }}</span>
                  </div>
                  <div class="text-emerald-300 font-semibold text-xs md:text-right">
                    คำตอบที่ถูก: {{ initialRightDefs.find(r => r.id === l.match)?.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center items-center gap-2 text-slate-400 text-sm">
          <Lock class="w-4 h-4 text-slate-400" />
          <span>บันทึกคะแนนเรียบร้อยแล้ว ไม่สามารถเล่นซ้ำได้</span>
        </div>
      </div>

      <!-- Play Screen -->
      <template v-if="!isFinished">
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="mb-1.5 flex items-center justify-between text-sm">
            <span class="flex items-center gap-1.5 font-semibold text-slate-300">
              <Link2 class="h-4 w-4 text-sky-400" /> จับคู่แล้ว
            </span>
            <span class="font-bold tabular-nums text-sky-200">{{ doneCount }} / {{ total }} คู่</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 transition-all duration-300"
              :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- Board -->
        <div ref="boardRef" class="relative mb-8 grid gap-8 md:grid-cols-2">
          <!-- SVG เส้นโยง (แสดงบน desktop) -->
          <svg class="pointer-events-none absolute inset-0 hidden h-full w-full md:block z-20">
            <path v-for="line in lines" :key="line.id" :d="line.d" :stroke="line.color" stroke-width="3.5"
              fill="none" stroke-linecap="round" stroke-dasharray="6 4" class="anim-dash" />
          </svg>

          <!-- ซ้าย: คำศัพท์ -->
          <div class="flex flex-col gap-3.5">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              คำศัพท์ (แตะเลือก แล้วเลือกคำอธิบายทางขวา)
            </p>
            <button v-for="item in leftTerms" :key="item.id" :ref="el => itemEls['l-' + item.id] = el"
              @click="clickLeft(item)" :class="[
                'term-card group relative flex items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200',
                isLeftMatched(item.id)
                  ? 'border-white/30 bg-white/10 text-white shadow-md'
                  : activeLeft === item.id
                    ? 'scale-[1.02] border-sky-300 bg-sky-500/25 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
              ]">
              <div class="flex items-center gap-3">
                <span :class="[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors',
                  isLeftMatched(item.id) ? colorOf(item.id).badge : 'bg-white/10 text-white'
                ]">{{ numOf(item.id) }}</span>
                <span class="text-base md:text-lg font-bold">{{ item.text }}</span>
              </div>

              <div class="flex items-center gap-1.5 text-xs">
                <span v-if="isLeftMatched(item.id)" class="text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-full font-medium">
                  จับคู่แล้ว (คลิกเพื่อแก้)
                </span>
                <span v-else-if="activeLeft === item.id" class="text-amber-300 animate-pulse font-medium">
                  กำลังเลือก...
                </span>
              </div>
            </button>
          </div>

          <!-- ขวา: คำอธิบาย -->
          <div class="flex flex-col gap-3.5">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              คำอธิบาย (แตะเพื่อเชื่อมต่อ)
            </p>
            <button v-for="def in rightDefs" :key="def.id" :ref="el => itemEls['r-' + def.id] = el"
              @click="clickRight(def)" :class="[
                'def-card group relative flex items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200',
                isRightMatched(def.id)
                  ? 'border-white/30 bg-white/10 text-white shadow-md'
                  : activeLeft
                    ? 'border-white/20 bg-white/5 hover:border-sky-300 hover:bg-sky-500/15'
                    : 'border-white/10 bg-white/5'
              ]">
              <div class="flex items-center gap-3 flex-1">
                <span v-if="isRightMatched(def.id)" :class="[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black',
                  colorOf(pairedLeftOfRight(def.id)?.id).badge
                ]">
                  {{ numOf(pairedLeftOfRight(def.id)?.id) }}
                </span>
                <span v-else class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 text-xs">
                  •
                </span>
                <span class="text-sm md:text-base font-medium leading-relaxed">{{ def.text }}</span>
              </div>

              <span v-if="isRightMatched(def.id)" class="text-xs text-slate-400 hover:text-rose-300 px-2 py-1 rounded bg-black/30">
                ✕ ปลดคู่
              </span>
            </button>
          </div>
        </div>

        <!-- Submit Action Bar -->
        <div class="rounded-2xl border border-sky-500/30 bg-sky-950/40 p-5 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-slate-300 text-center sm:text-left">
            <p class="font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Lock class="w-4 h-4 text-amber-300" /> ส่งได้ครั้งเดียวเท่านั้น ระบบจะให้คะแนนทันที
            </p>
            <p class="text-xs text-slate-400 mt-0.5">โปรดตรวจสอบการโยงคู่ให้มั่นใจก่อนกดปุ่มบันทึกคำตอบ</p>
          </div>

          <button @click="submitExam" :disabled="isSubmitting"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-8 py-3.5 text-base font-black shadow-lg shadow-blue-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50">
            <Send class="h-4 w-4" />
            <span>{{ isSubmitting ? 'กำลังบันทึกคะแนน...' : 'บันทึกและส่งคำตอบ' }}</span>
          </button>
        </div>
      </template>
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

@keyframes dash {
  to { stroke-dashoffset: -40; }
}
.anim-dash {
  animation: dash 2.5s linear infinite;
}
</style>