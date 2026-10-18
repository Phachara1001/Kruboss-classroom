<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Flame, Trophy, Star, Timer, Volume2, VolumeX,
  Lightbulb, CheckCircle2, XCircle, GripVertical, Sparkles, Target, BookOpen, Inbox,
  Send, Lock, AlertCircle, ArrowRight
} from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { gameScoresStore, getStudentGameScore, saveGameScore } from '@/data/gameScoresStore'

const props = defineProps({
  title: { type: String, default: 'ลากแล้ววาง' },
  subtitle: { type: String, default: 'ลากการ์ดไปใส่กลุ่มที่ถูกต้อง แล้วกดบันทึกคำตอบ' },
  // item: { id, text, type, hint?, explanation? }
  initialItems: { type: Array, required: true },
  // zone: { id, title, icon? (emoji), accent? (0-3), emptyText? }
  zones: { type: Array, required: true },
  examMode: { type: Boolean, default: true }, // โหมดสอบ: ไม่เฉลยระหว่างทำ บันทึกทีเดียว เล่นได้ครั้งเดียว
  gameId: { type: String, default: 'game-1' },
  courseId: { type: String, default: '' },
  week: { type: Number, default: 1 }
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
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const pool = ref(shuffle(props.initialItems))
const placed = ref({})
props.zones.forEach(z => { placed.value[z.id] = [] })

const dragged = ref(null)
const selected = ref(null)          // แตะเลือก (มือถือหรือคลิก)
const hoverZone = ref(null)
const flash = ref({ zone: null, type: null, key: 0 })
const toast = ref(null)
const xp = ref(0)
const isFinished = ref(false)
const isAlreadyPlayed = ref(false)
const confetti = ref([])
const soundOn = ref(true)
const isSubmitting = ref(false)
const submitError = ref('')

// Score tracking
const examScore = ref(0)

const total = computed(() => props.initialItems.length)
const totalPlaced = computed(() => {
  let count = 0
  Object.values(placed.value).forEach(list => { count += list.length })
  return count
})
const progress = computed(() => (total.value ? (totalPlaced.value / total.value) * 100 : 0))

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')

// ตรวจสอบว่าเคยเล่นและบันทึกคะแนนไปแล้วหรือไม่ (Single Attempt Rule)
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
  stars.value === 3 ? 'ยอดเยี่ยมมาก! ถูกต้องเกือบทั้งหมด' : stars.value === 2 ? 'เก่งมาก! ทำได้ดี' : 'ทำเสร็จเรียบร้อย! หมั่นทบทวนเนื้อหานะ'
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
  } catch { /* ข้าม */ }
}

/* ---------- game logic ---------- */
// ใน examMode: วางได้อิสระ ไม่เฉลยว่าถูกหรือผิดระหว่างทำ
const tryPlace = (item, zoneId) => {
  if (isFinished.value || !item) return
  startTimer()

  // ลบออกจาก pool หรือ zone เดิม
  const poolIdx = pool.value.findIndex(i => i.id === item.id)
  if (poolIdx !== -1) {
    pool.value.splice(poolIdx, 1)
  } else {
    props.zones.forEach(z => {
      const zIdx = placed.value[z.id].findIndex(i => i.id === item.id)
      if (zIdx !== -1) placed.value[z.id].splice(zIdx, 1)
    })
  }

  // เพิ่มไปยัง zone ปลายทาง
  placed.value[zoneId].push(item)
  flash.value = { zone: zoneId, type: 'neutral', key: flash.value.key + 1 }
  tone([520], 0.08)
  selected.value = null
}

// เอาการ์ดกลับไปที่ pool
const returnToPool = (item, zoneId) => {
  if (isFinished.value) return
  const idx = placed.value[zoneId].findIndex(i => i.id === item.id)
  if (idx !== -1) {
    placed.value[zoneId].splice(idx, 1)
    pool.value.push(item)
    tone([420], 0.06)
  }
}

// ส่งคำตอบและบันทึกคะแนนทีเดียว
const submitExam = async () => {
  if (isFinished.value || isSubmitting.value) return

  if (totalPlaced.value < total.value) {
    const remaining = total.value - totalPlaced.value
    const confirm = window.confirm(`คุณยังวางการ์ดไม่ครบ (เหลืออีก ${remaining} ใบ)\nต้องการยืนยันส่งคำตอบและบันทึกคะแนนตอนนี้หรือไม่?`)
    if (!confirm) return
  }

  isSubmitting.value = true
  stopTimer()

  // ตรวจคำตอบ
  let correct = 0
  props.zones.forEach(z => {
    placed.value[z.id].forEach(item => {
      if (item.type === z.id) {
        correct++
      }
    })
  })

  examScore.value = correct
  xp.value = correct * 100

  // บันทึกคะแนนเข้าระบบ (ครั้งเดียวเท่านั้น)
  if (currentStudentId.value && props.courseId && props.week) {
    const res = await saveGameScore(
      props.courseId,
      props.week,
      currentStudentId.value,
      props.gameId,
      correct,
      total.value
    )
    if (!res.success && res.message) {
      submitError.value = res.message
    }
  }

  isFinished.value = true
  isSubmitting.value = false

  // แสดง confetti และเสียง
  confetti.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.4 + Math.random() * 1.8,
    color: ['#a78bfa', '#34d399', '#fbbf24', '#38bdf8', '#f472b6'][i % 5],
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
</script>

<template>
  <section
    class="quiz relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 text-white shadow-2xl md:p-10">
    <!-- แสงพื้นหลัง -->
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl"></div>

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
            class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
            <Sparkles class="h-3.5 w-3.5" /> มินิเกมบันทึกคะแนน • เล่นได้ครั้งเดียว
          </div>
          <h3 class="text-3xl font-black tracking-tight md:text-4xl">{{ title }}</h3>
          <p class="mt-1 max-w-xl text-slate-300">{{ subtitle }}</p>
        </div>

        <!-- Stats -->
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
          <h5 class="mb-4 flex items-center gap-2 font-bold text-violet-200 text-lg">
            <BookOpen class="h-5 w-5" /> ตรวจสอบผลการจำแนกคำตอบ
          </h5>
          
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="zone in zones" :key="zone.id" class="rounded-xl border border-white/10 bg-white/5 p-4">
              <h6 class="font-bold text-white mb-3 flex items-center gap-2">
                <span>{{ zone.title }}</span>
              </h6>
              
              <ul class="space-y-2">
                <li v-for="item in placed[zone.id]" :key="item.id"
                  :class="[
                    'flex items-center justify-between p-2.5 rounded-lg text-sm font-medium',
                    item.type === zone.id ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-200' : 'bg-rose-500/20 border border-rose-400/40 text-rose-200'
                  ]">
                  <span>{{ item.text }}</span>
                  <span class="flex items-center gap-1 text-xs shrink-0 font-bold">
                    <CheckCircle2 v-if="item.type === zone.id" class="w-4 h-4 text-emerald-400" />
                    <template v-else>
                      <XCircle class="w-4 h-4 text-rose-400" />
                      <span class="text-rose-300">(ที่ถูกคือ: {{ zones.find(z => z.id === item.type)?.title }})</span>
                    </template>
                  </span>
                </li>
                <li v-if="placed[zone.id].length === 0" class="text-xs text-slate-400 italic py-2 text-center">
                  ไม่มีการ์ดในกลุ่มนี้
                </li>
              </ul>
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
              <Target class="h-4 w-4 text-violet-400" /> วางการ์ดแล้ว
            </span>
            <span class="font-bold tabular-nums text-violet-200">{{ totalPlaced }} / {{ total }} ใบ</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 transition-all duration-300"
              :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- Card pool -->
        <div class="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
              กองการ์ดคำตอบ — ลากไปวาง หรือแตะเลือกการ์ดแล้วแตะกล่องด้านล่าง
            </p>
            <span class="text-xs text-amber-300 font-medium">เหลือ {{ pool.length }} ใบ</span>
          </div>

          <div v-if="pool.length > 0" class="flex flex-wrap justify-center gap-3 min-h-[50px]">
            <TransitionGroup name="chip">
              <div v-for="item in pool" :key="item.id" draggable="true" @dragstart="onDragStart(item)"
                @dragend="onDragEnd" @click="onSelect(item)" :class="[
                  'chip flex cursor-grab select-none items-center gap-2 rounded-xl px-5 py-3 font-bold text-slate-800 shadow-lg transition active:cursor-grabbing',
                  selected?.id === item.id ? 'chip-selected bg-amber-200 ring-2 ring-amber-400' : 'bg-white hover:-translate-y-1 hover:shadow-xl',
                  dragged?.id === item.id ? 'opacity-40' : ''
                ]">
                <GripVertical class="h-4 w-4 text-slate-400" />
                {{ item.text }}
              </div>
            </TransitionGroup>
          </div>
          <div v-else class="text-center py-3 text-sm text-emerald-300 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 class="w-5 h-5" /> วางการ์ดครบทุกใบแล้ว! ตรวจสอบความถูกต้องแล้วกดบันทึกคำตอบด้านล่าง
          </div>
        </div>

        <!-- Zones -->
        <div class="grid gap-5 md:grid-cols-2 mb-8">
          <div v-for="(zone, zi) in zones" :key="zone.id" :class="[
            'relative flex min-h-[250px] flex-col rounded-2xl border-2 p-5 backdrop-blur transition-all duration-300',
            accentOf(zone, zi).soft,
            hoverZone === zone.id && dragged
              ? ['border-solid scale-[1.02] shadow-2xl ring-2', accentOf(zone, zi).border]
              : ['border-dashed', accentOf(zone, zi).border],
            selected ? 'cursor-pointer hover:bg-white/10' : '',
            zone.wrapperClass
          ]" @dragover.prevent="hoverZone = zone.id" @dragleave="hoverZone = null" @drop.prevent="onDrop(zone.id)"
            @click="onZoneClick(zone.id)">

            <div class="mb-4 flex items-center gap-3">
              <div
                :class="['flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-lg', accentOf(zone, zi).grad]">
                {{ zone.icon || (zi + 1) }}
              </div>
              <h4 :class="['flex-1 text-xl font-extrabold', zone.titleClass]">{{ zone.title }}</h4>
              <span class="rounded-full bg-black/40 px-3 py-1 text-xs font-bold tabular-nums text-slate-200">
                {{ placed[zone.id].length }} ใบ
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-2.5">
              <TransitionGroup name="chip">
                <div v-for="item in placed[zone.id]" :key="item.id"
                  class="group flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-4 py-3 font-semibold text-white shadow-sm transition-colors">
                  <span>{{ item.text }}</span>
                  <button @click.stop="returnToPool(item, zone.id)" title="นำการ์ดกลับไปที่กองกลาง"
                    class="opacity-60 hover:opacity-100 hover:text-rose-300 p-1 rounded transition-opacity text-xs bg-black/30">
                    ✕ นำออก
                  </button>
                </div>
              </TransitionGroup>

              <div v-if="placed[zone.id].length === 0"
                :class="['flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm font-medium text-slate-400', zone.emptyTextClass]">
                <Inbox class="h-8 w-8 opacity-40" stroke-width="1.5" />
                {{ zone.emptyText || 'วางการ์ดที่นี่ (ลากมาวางหรือคลิกเลือกการ์ด)' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Action Bar -->
        <div class="rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-5 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-slate-300 text-center sm:text-left">
            <p class="font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Lock class="w-4 h-4 text-amber-300" /> ส่งได้ครั้งเดียวเท่านั้น ระบบจะให้คะแนนทันที
            </p>
            <p class="text-xs text-slate-400 mt-0.5">โปรดตรวจสอบการ์ดในแต่ละช่องให้มั่นใจก่อนกดปุ่มส่งคำตอบ</p>
          </div>

          <button @click="submitExam" :disabled="isSubmitting"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 px-8 py-3.5 text-base font-black shadow-lg shadow-indigo-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50">
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
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) rotate(720deg);
    opacity: 0;
  }
}

.chip-enter-active,
.chip-leave-active {
  transition: all 0.25s ease;
}
.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>