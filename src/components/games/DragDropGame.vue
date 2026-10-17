<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX, RotateCcw,
  Lightbulb, CheckCircle2, GripVertical, Sparkles, Target, BookOpen, Inbox
} from '@lucide/vue'

const props = defineProps({
  title: { type: String, default: 'ลากแล้ววาง' },
  subtitle: { type: String, default: 'ลากการ์ดไปใส่กลุ่มที่ถูกต้อง ยิ่งต่อเนื่องยิ่งได้คะแนนเยอะ!' },
  // item: { id, text, type, hint?, explanation? }
  initialItems: { type: Array, required: true },
  // zone: { id, title, icon? (emoji), accent? (0-3), emptyText? }
  zones: { type: Array, required: true }
})
const emit = defineEmits(['complete'])

/* ---------- สีประจำกลุ่ม ---------- */
const accents = [
  { grad: 'from-violet-500 to-fuchsia-500', border: 'border-violet-400/60', soft: 'bg-violet-500/10', glow: 'shadow-violet-500/50', text: 'text-violet-200' },
  { grad: 'from-emerald-400 to-teal-500', border: 'border-emerald-400/60', soft: 'bg-emerald-500/10', glow: 'shadow-emerald-500/50', text: 'text-emerald-200' },
  { grad: 'from-amber-400 to-orange-500', border: 'border-amber-400/60', soft: 'bg-amber-500/10', glow: 'shadow-amber-500/50', text: 'text-amber-200' },
  { grad: 'from-sky-400 to-blue-500', border: 'border-sky-400/60', soft: 'bg-sky-500/10', glow: 'shadow-sky-500/50', text: 'text-sky-200' }
]
const accentOf = (zone, i) => accents[(zone.accent ?? i) % accents.length]

/* ---------- state ---------- */
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const pool = ref(shuffle([...props.initialItems]))
const placed = ref({})
props.zones.forEach(z => { placed.value[z.id] = [] })

const attempts = reactive({})       // id -> จำนวนครั้งที่วางผิด
const dragged = ref(null)
const selected = ref(null)          // แตะเลือก (มือถือ)
const hoverZone = ref(null)
const flash = ref({ zone: null, type: null, key: 0 })
const glowZone = ref(null)          // กล่องที่เรืองแสงเป็นคำใบ้
const toast = ref(null)
const xp = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const mistakes = ref(0)
const isFinished = ref(false)
const confetti = ref([])
const soundOn = ref(true)

const total = computed(() => props.initialItems.length)
const doneCount = computed(() => total.value - pool.value.length)
const progress = computed(() => (total.value ? (doneCount.value / total.value) * 100 : 0))
const accuracy = computed(() => Math.round((total.value / (total.value + mistakes.value)) * 100))
const stars = computed(() => (accuracy.value >= 90 ? 3 : accuracy.value >= 65 ? 2 : 1))
const missedItems = computed(() =>
  props.initialItems.filter(i => attempts[i.id] > 0).map(i => ({
    ...i,
    tries: attempts[i.id],
    zoneTitle: props.zones.find(z => z.id === i.type)?.title
  }))
)
const finishMessage = computed(() =>
  stars.value === 3 ? 'สุดยอด! แม่นยำมาก' : stars.value === 2 ? 'เก่งมาก! เกือบเต็มแล้ว' : 'ผ่านแล้ว! ลองอีกรอบให้ได้ดาวเพิ่มนะ'
)

/* ---------- timer ---------- */
const seconds = ref(0)
let timer = null
const startTimer = () => {
  if (timer || isFinished.value) return
  timer = setInterval(() => seconds.value++, 1000)
}
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
  } catch { /* ไม่รองรับเสียง ข้ามไป */ }
}

/* ---------- toast ---------- */
let toastTimer
const showToast = (type, title, body = '') => {
  toast.value = { type, title, body }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3200)
}

const praises = ['ถูกต้อง!', 'เยี่ยมมาก!', 'เก่งมาก!', 'ใช่เลย!', 'ยอดเยี่ยม!']

/* ---------- game logic ---------- */
const tryPlace = (item, zoneId) => {
  if (isFinished.value || !item) return
  startTimer()
  glowZone.value = null

  if (item.type === zoneId) {
    const firstTry = !attempts[item.id]
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
    const gain = (firstTry ? 100 : 50) + (streak.value > 1 ? (streak.value - 1) * 10 : 0)
    xp.value += gain

    const idx = pool.value.findIndex(i => i.id === item.id)
    if (idx !== -1) pool.value.splice(idx, 1)
    placed.value[zoneId].push(item)

    flash.value = { zone: zoneId, type: 'ok', key: flash.value.key + 1 }
    const combo = streak.value >= 3 ? ` • คอมโบ x${streak.value} 🔥` : ''
    showToast('ok', `${praises[Math.floor(Math.random() * praises.length)]} +${gain} XP${combo}`, item.explanation || '')
    tone([660, 880])

    if (pool.value.length === 0) finish()
  } else {
    attempts[item.id] = (attempts[item.id] || 0) + 1
    mistakes.value++
    streak.value = 0
    flash.value = { zone: zoneId, type: 'bad', key: flash.value.key + 1 }

    let body = ''
    if (attempts[item.id] >= 3) {
      glowZone.value = item.type
      body = 'ลองดูกล่องที่เรืองแสงอยู่นะ ✨'
    } else if (attempts[item.id] >= 2 && item.hint) {
      body = `💡 คำใบ้: ${item.hint}`
    }
    showToast('bad', 'ยังไม่ใช่ ลองใหม่อีกครั้ง!', body)
    tone([300, 220])
  }
  selected.value = null
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

/* ---------- drag & tap ---------- */
const onDragStart = (item) => { dragged.value = item; selected.value = null; startTimer() }
const onDragEnd = () => { dragged.value = null; hoverZone.value = null }
const onDrop = (zoneId) => {
  const item = dragged.value
  onDragEnd()
  tryPlace(item, zoneId)
}
const onSelect = (item) => {
  startTimer()
  selected.value = selected.value?.id === item.id ? null : item
}
const onZoneClick = (zoneId) => { if (selected.value) tryPlace(selected.value, zoneId) }

const resetGame = () => {
  pool.value = shuffle([...props.initialItems])
  props.zones.forEach(z => { placed.value[z.id] = [] })
  Object.keys(attempts).forEach(k => delete attempts[k])
  xp.value = 0; streak.value = 0; bestStreak.value = 0; mistakes.value = 0
  seconds.value = 0; isFinished.value = false; confetti.value = []
  selected.value = null; dragged.value = null; glowZone.value = null; toast.value = null
  flash.value = { zone: null, type: null, key: 0 }
  stopTimer()
}
</script>

<template>
  <section
    class="quiz relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 text-white shadow-2xl md:p-10">
    <!-- แสงพื้นหลัง -->
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl"></div>

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
            class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-200">
            <Sparkles class="h-3.5 w-3.5" /> กิจกรรมฝึกคิด
          </div>
          <h3 class="text-3xl font-black tracking-tight md:text-4xl">{{ title }}</h3>
          <p class="mt-1 max-w-xl text-slate-300">{{ subtitle }}</p>
        </div>

        <!-- Stats -->
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
            <Target class="h-4 w-4" /> จัดถูกแล้ว
          </span>
          <span class="font-bold tabular-nums">{{ doneCount }} / {{ total }}</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 transition-all duration-700 ease-out"
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

        <!-- Reflection -->
        <div class="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
          <h5 class="mb-3 flex items-center gap-2 font-bold text-violet-200">
            <BookOpen class="h-5 w-5" /> สิ่งที่ควรทบทวน
          </h5>
          <p v-if="missedItems.length === 0" class="text-emerald-300">ไม่มีข้อผิดพลาดเลย! คุณเข้าใจเนื้อหานี้ดีมาก 🎉
          </p>
          <ul v-else class="space-y-3">
            <li v-for="m in missedItems" :key="m.id" class="rounded-lg bg-white/5 p-3">
              <p class="font-semibold">{{ m.text }}
                <span class="ml-1 text-sm font-medium text-emerald-300">→ {{ m.zoneTitle }}</span>
                <span class="ml-1 text-xs text-slate-400">(พลาด {{ m.tries }} ครั้ง)</span>
              </p>
              <p v-if="m.explanation" class="mt-1 text-sm text-slate-300">{{ m.explanation }}</p>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex justify-center">
          <button @click="resetGame"
            class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3.5 text-lg font-bold shadow-lg shadow-fuchsia-500/30 transition hover:scale-105 active:scale-95">
            <RotateCcw class="h-5 w-5" /> เล่นอีกครั้ง
          </button>
        </div>
      </div>

      <!-- Card pool -->
      <div v-if="!isFinished" class="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p class="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">การ์ดคำตอบ — ลากไปวาง
          หรือแตะเลือกแล้วแตะกล่อง</p>
        <div class="flex flex-wrap justify-center gap-3">
          <TransitionGroup name="chip">
            <div v-for="item in pool" :key="item.id" draggable="true" @dragstart="onDragStart(item)"
              @dragend="onDragEnd" @click="onSelect(item)" :class="[
                'chip flex cursor-grab select-none items-center gap-2 rounded-xl px-5 py-3 font-bold text-slate-800 shadow-lg transition active:cursor-grabbing',
                selected?.id === item.id ? 'chip-selected bg-amber-200' : 'bg-white hover:-translate-y-1 hover:shadow-xl',
                dragged?.id === item.id ? 'opacity-40' : '',
                attempts[item.id] ? 'anim-shake' : ''
              ]">
              <GripVertical class="h-4 w-4 text-slate-400" />
              {{ item.text }}
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Zones -->
      <div class="grid gap-5 md:grid-cols-2">
        <div v-for="(zone, zi) in zones" :key="zone.id + '-' + (flash.zone === zone.id ? flash.key : 0)" :class="[
          'relative flex min-h-[230px] flex-col rounded-2xl border-2 p-5 backdrop-blur transition-all duration-300',
          accentOf(zone, zi).soft,
          hoverZone === zone.id && dragged
            ? ['border-solid scale-[1.03] shadow-2xl', accentOf(zone, zi).border, accentOf(zone, zi).glow]
            : ['border-dashed', accentOf(zone, zi).border],
          selected ? 'cursor-pointer' : '',
          flash.zone === zone.id && flash.type === 'ok' ? 'anim-pop !border-solid !border-emerald-400' : '',
          flash.zone === zone.id && flash.type === 'bad' ? 'anim-shake !border-solid !border-rose-400' : '',
          glowZone === zone.id ? 'anim-glow !border-solid' : '',
          zone.wrapperClass
        ]" @dragover.prevent="hoverZone = zone.id" @dragleave="hoverZone = null" @drop.prevent="onDrop(zone.id)"
          @click="onZoneClick(zone.id)">

          <div class="mb-4 flex items-center gap-3">
            <div
              :class="['flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-lg', accentOf(zone, zi).grad]">
              {{ zone.icon || (zi + 1) }}
            </div>
            <h4 :class="['flex-1 text-xl font-extrabold', zone.titleClass]">{{ zone.title }}</h4>
            <span class="rounded-full bg-black/30 px-2.5 py-0.5 text-sm font-bold tabular-nums text-slate-200">{{
              placed[zone.id].length }}</span>
          </div>

          <div class="flex flex-1 flex-col gap-2.5">
            <TransitionGroup name="chip">
              <div v-for="item in placed[zone.id]" :key="item.id"
                :class="['flex items-center justify-between gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 font-semibold text-emerald-50', zone.itemBgClass]">
                <span>{{ item.text }}</span>
                <CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-400" />
              </div>
            </TransitionGroup>

            <div v-if="placed[zone.id].length === 0"
              :class="['flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center text-sm font-medium text-slate-400', zone.emptyTextClass]">
              <Inbox class="h-8 w-8 opacity-50" stroke-width="1.5" />
              {{ zone.emptyText || 'วางการ์ดที่ใช่ที่นี่' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback toast -->
    <Transition name="toast">
      <div v-if="toast" :class="[
        'absolute bottom-5 left-1/2 z-40 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md',
        toast.type === 'ok' ? 'border-emerald-400/50 bg-emerald-900/90' : 'border-rose-400/50 bg-rose-900/90'
      ]">
        <p class="flex items-center gap-2 font-bold">
          <Lightbulb v-if="toast.type === 'bad'" class="h-5 w-5 text-amber-300" />
          <CheckCircle2 v-else class="h-5 w-5 text-emerald-300" />
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

.chip-selected {
  box-shadow: 0 0 0 3px #fbbf24, 0 10px 30px rgba(251, 191, 36, 0.4);
  transform: translateY(-4px) scale(1.04);
}

.star {
  animation: starIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.result {
  animation: slideUp 0.5s ease-out;
}

.anim-pop {
  animation: pop 0.45s ease;
}

.anim-shake {
  animation: shake 0.45s ease;
}

.anim-glow {
  animation: glow 1.2s ease-in-out infinite;
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

.chip-enter-active,
.chip-leave-active {
  transition: all 0.35s ease;
}

.chip-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(8px);
}

.chip-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.chip-move {
  transition: transform 0.35s ease;
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
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.0);
    border-color: rgba(251, 191, 36, 0.5);
  }

  50% {
    box-shadow: 0 0 35px 6px rgba(251, 191, 36, 0.55);
    border-color: rgba(251, 191, 36, 1);
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