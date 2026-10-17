<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import {
    Flame, Trophy, Star, Timer, Volume2, VolumeX, RotateCcw, Lightbulb,
    CheckCircle2, Sparkles, Target, BookOpen, GripVertical
} from '@lucide/vue'

const props = defineProps({
    title: { type: String, default: 'เติมคำในช่องว่าง' },
    subtitle: { type: String, default: 'ลากคำจากคลังไปวางในช่องว่างให้ถูกต้อง' },
    // ข้อความ ใช้ {id} แทนช่องว่าง, ขึ้นบรรทัดใหม่ด้วย \n
    passage: { type: String, required: true },
    // [{ id, answer, hint?, explanation? }]
    blanks: { type: Array, required: true },
    // คำหลอกเพิ่มเติม (ไม่ใช่คำตอบของช่องไหนเลย)
    distractors: { type: Array, default: () => [] }
})
const emit = defineEmits(['complete'])

/* ---------- แปลงข้อความเป็นส่วนๆ ---------- */
const paragraphs = computed(() =>
    props.passage.split('\n').filter(l => l.trim() !== '').map(line => {
        const parts = []
        const re = /\{([^}]+)\}/g
        let last = 0
        let m
        while ((m = re.exec(line))) {
            if (m.index > last) parts.push({ type: 'text', value: line.slice(last, m.index) })
            if (props.blanks.some(b => b.id === m[1])) parts.push({ type: 'blank', id: m[1] })
            last = m.index + m[0].length
        }
        if (last < line.length) parts.push({ type: 'text', value: line.slice(last) })
        return parts
    })
)

const blankOf = (id) => props.blanks.find(b => b.id === id)
const numOf = (id) => props.blanks.findIndex(b => b.id === id) + 1

/* ---------- state ---------- */
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}
const buildBank = () => shuffle([
    ...props.blanks.map((b, i) => ({ id: 'a' + i, text: b.answer })),
    ...props.distractors.map((d, i) => ({ id: 'd' + i, text: d }))
])

const bank = ref(buildBank())
const filled = ref({})            // blankId -> word (เฉพาะที่ถูกและล็อกแล้ว)
const attempts = reactive({})     // blankId -> จำนวนครั้งที่วางผิด
const dragged = ref(null)
const selected = ref(null)
const hoverBlank = ref(null)
const wrongBlank = ref(null)
const popBlank = ref(null)
const hintBlank = ref(null)       // ช่องที่ผิดครบ 3 ครั้ง -> เรืองแสงนำทาง
const toast = ref(null)
const xp = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const mistakes = ref(0)
const isFinished = ref(false)
const confetti = ref([])
const soundOn = ref(true)

const total = computed(() => props.blanks.length)
const doneCount = computed(() => Object.keys(filled.value).length)
const progress = computed(() => (total.value ? (doneCount.value / total.value) * 100 : 0))
const accuracy = computed(() => Math.round((total.value / (total.value + mistakes.value)) * 100))
const stars = computed(() => (accuracy.value >= 90 ? 3 : accuracy.value >= 65 ? 2 : 1))
const finishMessage = computed(() =>
    stars.value === 3 ? 'สุดยอด! เติมได้แม่นยำมาก' : stars.value === 2 ? 'เก่งมาก! เกือบสมบูรณ์แล้ว' : 'ผ่านแล้ว! ลองอีกรอบให้ได้ดาวเพิ่มนะ'
)
const glowWordIds = computed(() => {
    if (!hintBlank.value) return []
    const ans = blankOf(hintBlank.value)?.answer
    return bank.value.filter(w => w.text === ans).map(w => w.id)
})
const missedItems = computed(() =>
    props.blanks.filter(b => attempts[b.id] > 0).map(b => ({ ...b, tries: attempts[b.id], num: numOf(b.id) }))
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

onBeforeUnmount(() => { stopTimer(); clearTimeout(toastTimer) })

/* ---------- game logic ---------- */
const tryPlace = (word, blankId) => {
    if (isFinished.value || !word || filled.value[blankId]) return
    startTimer()
    const blank = blankOf(blankId)

    if (word.text === blank.answer) {
        const firstTry = !attempts[blankId]
        streak.value++
        bestStreak.value = Math.max(bestStreak.value, streak.value)
        const gain = (firstTry ? 100 : 50) + (streak.value > 1 ? (streak.value - 1) * 10 : 0)
        xp.value += gain

        filled.value = { ...filled.value, [blankId]: word }
        bank.value = bank.value.filter(w => w.id !== word.id)
        if (hintBlank.value === blankId) hintBlank.value = null

        popBlank.value = blankId
        setTimeout(() => { popBlank.value = null }, 500)
        const combo = streak.value >= 3 ? ` • คอมโบ x${streak.value} 🔥` : ''
        showToast('ok', `${praises[Math.floor(Math.random() * praises.length)]} +${gain} XP${combo}`, blank.explanation || '')
        tone([660, 880])

        if (doneCount.value === total.value) finish()
    } else {
        attempts[blankId] = (attempts[blankId] || 0) + 1
        mistakes.value++
        streak.value = 0
        wrongBlank.value = blankId
        setTimeout(() => { wrongBlank.value = null }, 500)

        let body = ''
        if (attempts[blankId] >= 3) {
            hintBlank.value = blankId
            body = 'ลองดูคำที่เรืองแสงในคลังนะ ✨'
        } else if (attempts[blankId] >= 2 && blank.hint) {
            body = `💡 คำใบ้ (ช่องที่ ${numOf(blankId)}): ${blank.hint}`
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
        color: ['#fbbf24', '#fb923c', '#34d399', '#38bdf8', '#f472b6'][i % 5],
        size: 6 + Math.random() * 6
    }))
    setTimeout(() => tone([523, 659, 784, 1046], 0.14), 250)
    emit('complete', { xp: xp.value, stars: stars.value, accuracy: accuracy.value, time: seconds.value, mistakes: mistakes.value })
}

/* ---------- drag & tap ---------- */
const onDragStart = (word) => { dragged.value = word; selected.value = null; startTimer() }
const onDragEnd = () => { dragged.value = null; hoverBlank.value = null }
const onDrop = (blankId) => {
    const word = dragged.value
    onDragEnd()
    tryPlace(word, blankId)
}
const onSelect = (word) => {
    startTimer()
    selected.value = selected.value?.id === word.id ? null : word
}
const onBlankClick = (blankId) => { if (selected.value) tryPlace(selected.value, blankId) }

const resetGame = () => {
    bank.value = buildBank()
    filled.value = {}
    Object.keys(attempts).forEach(k => delete attempts[k])
    xp.value = 0; streak.value = 0; bestStreak.value = 0; mistakes.value = 0
    seconds.value = 0; isFinished.value = false; confetti.value = []
    selected.value = null; dragged.value = null; hoverBlank.value = null
    hintBlank.value = null; toast.value = null
    stopTimer()
}
</script>

<template>
    <section
        class="quiz relative overflow-clip rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-orange-950 to-slate-900 p-5 text-white shadow-2xl md:p-10">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl">
        </div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl">
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
                        class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-amber-200">
                        <Sparkles class="h-3.5 w-3.5" /> กิจกรรมเติมคำ
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
                        <Target class="h-4 w-4" /> เติมถูกแล้ว
                    </span>
                    <span class="font-bold tabular-nums">{{ doneCount }} / {{ total }}</span>
                </div>
                <div class="h-3 overflow-hidden rounded-full bg-white/10">
                    <div class="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 transition-all duration-700 ease-out"
                        :style="{ width: progress + '%' }"></div>
                </div>
            </div>

            <!-- Result -->
            <div v-if="isFinished"
                class="result mb-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
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
                    <h5 class="mb-3 flex items-center gap-2 font-bold text-amber-200">
                        <BookOpen class="h-5 w-5" /> สิ่งที่ควรทบทวน
                    </h5>
                    <p v-if="missedItems.length === 0" class="text-emerald-300">ไม่มีข้อผิดพลาดเลย!
                        คุณเข้าใจเนื้อหานี้ดีมาก 🎉</p>
                    <ul v-else class="space-y-3">
                        <li v-for="m in missedItems" :key="m.id" class="rounded-lg bg-white/5 p-3">
                            <p class="font-semibold">
                                ช่องที่ {{ m.num }}: <span class="text-emerald-300">{{ m.answer }}</span>
                                <span class="ml-1 text-xs font-normal text-slate-400">(พลาด {{ m.tries }} ครั้ง)</span>
                            </p>
                            <p v-if="m.explanation" class="mt-1 text-sm text-slate-300">{{ m.explanation }}</p>
                        </li>
                    </ul>
                </div>

                <div class="mt-6 flex justify-center">
                    <button @click="resetGame"
                        class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 text-lg font-extrabold text-orange-950 shadow-lg shadow-orange-500/30 transition hover:scale-105 active:scale-95">
                        <RotateCcw class="h-5 w-5" /> เล่นอีกครั้ง
                    </button>
                </div>
            </div>

            <!-- Passage -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:p-8">
                <p v-for="(parts, pi) in paragraphs" :key="pi"
                    class="text-lg leading-[2.9] text-slate-100 md:text-2xl md:leading-[2.9]"
                    :class="pi > 0 ? 'mt-3' : ''">
                    <template v-for="(part, i) in parts" :key="i">
                        <span v-if="part.type === 'text'">{{ part.value }}</span>

                        <span v-else @dragover.prevent="hoverBlank = part.id" @dragleave="hoverBlank = null"
                            @drop.prevent="onDrop(part.id)" @click="onBlankClick(part.id)" :class="[
                                'mx-1 inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-0.5 align-middle text-center text-base font-bold transition-all duration-200 md:text-xl',
                                filled[part.id]
                                    ? 'border-emerald-400 bg-emerald-500/25 text-emerald-50'
                                    : hoverBlank === part.id && dragged
                                        ? 'scale-110 border-solid border-amber-300 bg-amber-300/30 shadow-[0_0_22px_rgba(252,211,77,0.5)]'
                                        : selected
                                            ? 'cursor-pointer border-dashed border-amber-300 bg-amber-300/20 hover:bg-amber-300/30'
                                            : 'border-dashed border-amber-300/50 bg-amber-300/10 text-amber-200/70',
                                popBlank === part.id ? 'anim-pop' : '',
                                wrongBlank === part.id ? 'anim-shake !border-rose-400 !bg-rose-500/25' : '',
                                hintBlank === part.id && !filled[part.id] ? 'anim-glow !border-solid !border-amber-300' : ''
                            ]">
                            <template v-if="filled[part.id]">
                                {{ filled[part.id].text }}
                                <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-300" />
                            </template>
                            <template v-else>
                                <span
                                    class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-300/30 text-xs font-black text-amber-100">{{
                                    numOf(part.id) }}</span>
                            </template>
                        </span>
                    </template>
                </p>
            </div>

            <!-- Word bank (ลอยติดขอบล่างจอ) -->
            <div v-if="!isFinished" class="sticky bottom-3 z-20 mt-6">
                <div class="rounded-2xl border border-white/15 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-md md:p-5">
                    <template v-if="bank.length">
                        <p class="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                            คลังคำ — ลากไปวาง หรือแตะคำแล้วแตะช่องว่าง
                        </p>
                        <div class="flex flex-wrap justify-center gap-2.5">
                            <TransitionGroup name="chip">
                                <div v-for="word in bank" :key="word.id" draggable="true" @dragstart="onDragStart(word)"
                                    @dragend="onDragEnd" @click="onSelect(word)" :class="[
                                        'flex cursor-grab select-none items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-slate-800 shadow-lg transition active:cursor-grabbing',
                                        selected?.id === word.id
                                            ? 'chip-selected bg-amber-200'
                                            : 'bg-white hover:-translate-y-1 hover:shadow-xl',
                                        dragged?.id === word.id ? 'opacity-40' : '',
                                        glowWordIds.includes(word.id) ? 'anim-glow' : ''
                                    ]">
                                    <GripVertical class="h-4 w-4 text-slate-400" />
                                    {{ word.text }}
                                </div>
                            </TransitionGroup>
                        </div>
                    </template>
                    <p v-else class="text-center font-semibold text-emerald-300">ใช้คำครบทุกช่องแล้ว!</p>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <Teleport to="body">
            <Transition name="toast">
                <div v-if="toast" :class="[
                    'fixed left-1/2 top-4 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border px-5 py-4 text-white shadow-2xl backdrop-blur-md',
                    toast.type === 'ok' ? 'border-emerald-400/50 bg-emerald-900/95' : 'border-rose-400/50 bg-rose-900/95'
                ]">
                    <p class="flex items-center gap-2 font-bold">
                        <CheckCircle2 v-if="toast.type === 'ok'" class="h-5 w-5 text-emerald-300" />
                        <Lightbulb v-else class="h-5 w-5 text-amber-300" />
                        {{ toast.title }}
                    </p>
                    <p v-if="toast.body" class="mt-1 text-sm text-white/85">{{ toast.body }}</p>
                </div>
            </Transition>
        </Teleport>
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
    transition: all 0.3s ease;
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
    transition: transform 0.3s ease;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -16px);
}

@keyframes pop {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.12);
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
        transform: translateX(-6px);
    }

    40% {
        transform: translateX(6px);
    }

    60% {
        transform: translateX(-4px);
    }

    80% {
        transform: translateX(4px);
    }
}

@keyframes glow {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
    }

    50% {
        box-shadow: 0 0 28px 6px rgba(251, 191, 36, 0.6);
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