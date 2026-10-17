<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  X, RotateCcw, Package, Volume2, VolumeX, FastForward, Check,
  Circle, Leaf, Droplets, Zap, Trophy, Crown, Gem
} from '@lucide/vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  box: { type: Object, default: null },
  drawnItem: { type: Object, default: null },
  studentCoins: { type: Number, default: 0 },
  isDuplicate: { type: Boolean, default: false },
  refundCoins: { type: Number, default: 0 }
})
const emit = defineEmits(['close', 'drawAgain'])

const BOX_IMG = '/img/Gacha/AETHERIA/Box.png'
const FALLBACK_IMG = '/img/Gacha/AETHERIA/Aetherwyrm - secret.png'
const TAU = Math.PI * 2
const R = (a, b) => a + Math.random() * (b - a)
const pick = (a) => a[(Math.random() * a.length) | 0]

/* ------------------------------------------------------------------ */
/* TIERS: ต่ำ -> สูง (Special Collection สูงสุด)                        */
/* dur = เวลาชาร์จ (ms) | lock = ช่วงนิ่งก่อนระเบิด | quake = แรงสั่นจอ     */
/* ------------------------------------------------------------------ */
const TIERS = [
  {
    key: 'Common', label: 'COMMON', icon: Circle, c1: '#34d399', c2: '#059669', rgb: '52,211,153',
    dur: 2200, lock: 350, quake: 0, emit: 0,
    msg: 'สหายตัวน้อยผู้น่ารักเข้าสู่คลังของคุณ', lockText: 'พบสัญญาณแล้ว…',
    pal: ['#6ee7b7', '#34d399', '#d1fae5'], nameGrad: 'linear-gradient(180deg,#fff,#6ee7b7)'
  },
  {
    key: 'Uncommon', label: 'UNCOMMON', icon: Leaf, c1: '#2dd4bf', c2: '#16a34a', rgb: '45,212,191',
    dur: 2600, lock: 450, quake: 0, emit: 380,
    msg: 'ภูติสายลมและธรรมชาติสีมรกตมาอยู่เคียงข้างคุณ', lockText: 'สายลมเปลี่ยนทิศ…',
    pal: ['#5eead4', '#4ade80', '#bbf7d0', '#2dd4bf'], nameGrad: 'linear-gradient(180deg,#fff,#5eead4)'
  },
  {
    key: 'Rare', label: 'RARE', icon: Droplets, c1: '#22d3ee', c2: '#2563eb', rgb: '34,211,238',
    dur: 3000, lock: 550, quake: 3, emit: 220,
    msg: 'คลื่นพลังสายน้ำและผลึกไพลินหายากตอบรับเสียงเรียก', lockText: 'ระลอกคลื่นพลังกำลังก่อตัว!',
    pal: ['#67e8f9', '#22d3ee', '#93c5fd', '#e0f2fe'], nameGrad: 'linear-gradient(180deg,#fff,#22d3ee)'
  },
  {
    key: 'Epic', label: 'EPIC', icon: Zap, c1: '#a855f7', c2: '#6366f1', rgb: '168,85,247',
    dur: 3600, lock: 700, quake: 6, emit: 1400,
    msg: 'สายฟ้าสีม่วงระดับมหากาพย์ผ่าลงมา!', lockText: 'พลังเวทกำลังระเบิดออก!',
    pal: ['#c084fc', '#a855f7', '#e879f9', '#ddd6fe'], nameGrad: 'linear-gradient(180deg,#f5e8ff,#a855f7)'
  },
  {
    key: 'Legendary', label: 'LEGENDARY', icon: Trophy, c1: '#fbbf24', c2: '#ea580c', rgb: '251,191,36',
    dur: 4300, lock: 900, quake: 10, emit: 45,
    msg: 'ประกายทองระดับตำนานส่องสว่างทั่วทั้งอาณาจักร!', lockText: 'แสงสีทองแห่งตำนานกำลังจะปรากฏ!',
    pal: ['#fde047', '#fbbf24', '#f59e0b', '#fff7ed'], nameGrad: 'linear-gradient(180deg,#fffbeb,#fbbf24 55%,#ea580c)'
  },
  {
    key: 'Secret', label: 'SECRET', icon: Crown, c1: '#e11d48', c2: '#4c1d95', rgb: '225,29,72',
    dur: 5000, lock: 1100, quake: 14, emit: 100,
    msg: 'ค้นพบสิ่งลี้ลับที่ซ่อนอยู่ในห้วงจักรวาล!', lockText: 'พลังงานทะลุขีดจำกัดแล้ว!',
    pal: () => Math.random() < 0.2 ? '#ffffff' : pick(['#f43f5e', '#be123c', '#9f1239', '#4c1d95', '#2e1065']),
    nameGrad: 'linear-gradient(90deg,#f43f5e,#fb7185,#e11d48,#9f1239,#f43f5e)'
  },
  {
    key: 'Special Collection', label: 'SPECIAL COLLECTION', icon: Gem, c1: '#f9a8d4', c2: '#67e8f9', rgb: '249,168,212',
    dur: 5800, lock: 1300, quake: 16, emit: 65,
    msg: 'ไอเทมสะสมสุดพิเศษ มีเพียงไม่กี่คนที่ได้ครอบครอง!', lockText: 'คอลเลกชันพิเศษตอบรับคุณแล้ว!',
    pal: ['#fda4af', '#fde68a', '#bbf7d0', '#a5f3fc', '#c4b5fd', '#f9a8d4', '#ffffff'],
    nameGrad: 'linear-gradient(90deg,#fda4af,#fde68a,#bbf7d0,#a5f3fc,#c4b5fd,#fda4af)'
  }
]
const P = (i) => TIERS[i].pal

const tierIndexOf = (r) => {
  const s = String(r || '').trim().toLowerCase()
  if (s.includes('special')) return 6
  const i = TIERS.findIndex((t) => t.key.toLowerCase() === s)
  return i === -1 ? 0 : i
}

/* ------------------------------ state ------------------------------ */
// stages: charging -> lock -> burst -> revealed
const stage = ref('charging')
const progress = ref(0)
const litIdx = ref(0) // ระดับที่ "ไต่" ถึงบนบันไดตอนนี้
const quaking = ref(false)
const soundEnabled = ref(true)
const canvasEl = ref(null)
const focusEl = ref(null)

const finalIdx = computed(() => tierIndexOf(props.drawnItem?.rarity))
const tier = computed(() => TIERS[finalIdx.value])
const litTier = computed(() => TIERS[litIdx.value])
const bgIdx = computed(() => (stage.value === 'charging' ? litIdx.value : finalIdx.value))
const canAfford = computed(() => props.studentCoins >= (props.box?.price || 0))

const rootStyle = computed(() => ({
  '--c1': tier.value.c1, '--c2': tier.value.c2, '--rgb': tier.value.rgb, '--q': tier.value.quake + 'px'
}))
const statusText = computed(() => {
  if (stage.value === 'lock') return tier.value.lockText
  if (stage.value === 'burst') return ''
  const p = progress.value
  return p < 0.3 ? 'กำลังรวบรวมพลังงาน…' : p < 0.65 ? 'พลังงานกำลังพุ่งสูงขึ้น…' : 'ใกล้แล้ว… อย่ากระพริบตา!'
})
const beat = computed(() => (1.15 - progress.value * 0.75).toFixed(2))
const auraBg = computed(() => `radial-gradient(circle, rgba(${litTier.value.rgb},.6) 0%, transparent 68%)`)
const bannerStyle = computed(() => ({
  color: tier.value.c1,
  background: `linear-gradient(90deg, rgba(${tier.value.rgb},.28), rgba(${tier.value.rgb},.08))`,
  border: `1px solid rgba(${tier.value.rgb},.75)`,
  boxShadow: `0 0 36px rgba(${tier.value.rgb},.55), inset 0 0 18px rgba(${tier.value.rgb},.18)`
}))
const nameStyle = computed(() => ({ backgroundImage: tier.value.nameGrad }))

/* ------------------------------ audio ------------------------------ */
let audioCtx = null
const getCtx = () => {
  if (!soundEnabled.value) return null
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    audioCtx = audioCtx || new AC()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
  } catch { return null }
}
const tone = (f, t = 0, d = 0.3, { type = 'sine', vol = 0.1, to = null, swell = false } = {}) => {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + t
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d)
  g.gain.setValueAtTime(0.0001, t0)
  if (swell) {
    g.gain.exponentialRampToValueAtTime(vol, t0 + d * 0.92)
  } else {
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, d / 3))
  }
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d)
  o.connect(g)
  g.connect(c.destination)
  o.start(t0)
  o.stop(t0 + d + 0.05)
}
const CHORDS = [
  [440, 554.37], [392, 493.88, 587.33], [349.23, 440, 523.25, 698.46],
  [220, 261.63, 329.63, 440, 523.25, 659.25], [293.66, 369.99, 440, 587.33, 739.99, 880],
  [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5],
  [329.63, 415.3, 493.88, 659.25, 830.61, 987.77, 1318.5]
]
const sfx = {
  riser() {
    const i = finalIdx.value, d = tier.value.dur / 1000
    tone(90, 0, d, { type: 'sawtooth', vol: 0.04 + i * 0.008, to: 200 + i * 160, swell: true })
    if (i >= 3) tone(400, 0, d, { type: 'triangle', vol: 0.03, to: 1600, swell: true })
  },
  tick(k) {
    tone(300 + k * 70, 0, 0.14, { type: 'triangle', vol: 0.09 })
    if (k >= 4) tone((300 + k * 70) * 2, 0.02, 0.2, { vol: 0.05 })
  },
  heartbeat() {
    tone(70, 0, 0.18, { to: 38, vol: 0.35 })
    tone(70, 0.22, 0.24, { to: 34, vol: 0.4 })
  },
  boom() {
    const i = finalIdx.value
    tone(150, 0, 0.9 + i * 0.12, { to: 30, vol: 0.3 + i * 0.03 })
  },
  chord() {
    const i = finalIdx.value, n = CHORDS[i]
    n.forEach((f, k) => tone(f, k * 0.06, 1.8, { type: i >= 5 ? 'sine' : 'triangle', vol: 0.16 / Math.sqrt(n.length) }))
    if (i >= 4) for (let j = 0; j < 6; j++) tone(R(1200, 3000), 0.4 + j * 0.09, 0.35, { vol: 0.04 })
  }
}

/* ------------------------- particle engine ------------------------- */
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const N = (n) => Math.max(1, Math.round(n * (reduced ? 0.4 : 1)))
let ctx = null, W = 0, H = 0, fx = [], timers = [], sparkN = 0

const later = (fn, ms) => { timers.push(setTimeout(fn, ms)) }
const clearTimers = () => { timers.forEach(clearTimeout); timers = [] }
const spawn = (p) => {
  fx.push({
    vx: 0, vy: 0, g: 0, drag: 0.985, size: 3, life: 1, decay: 0.015, color: '#fff', shape: 'dot',
    rot: 0, vr: 0, t: 0, sway: 0, add: true, glow: 6, ...p
  })
  if (fx.length > 900) fx.shift()
}
const focus = () => {
  const r = focusEl.value?.getBoundingClientRect()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: W / 2, y: H / 2 }
}
const radial = (o, { n, sp, size, decay, pal, shape = 'dot', ...rest }) => {
  for (let i = 0; i < N(n); i++) {
    const a = R(0, TAU), s = R(sp[0], sp[1])
    spawn({
      x: o.x, y: o.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: R(size[0], size[1]),
      decay: R(decay[0], decay[1]), color: typeof pal === 'function' ? pal() : pick(pal),
      shape, rot: R(0, TAU), vr: R(-0.2, 0.2), ...rest
    })
  }
}
const ring = (o, color, grow = 7, lw = 4, decay = 0.02, delay = 0) => {
  const go = () => spawn({ x: o.x, y: o.y, shape: 'ring', size: 10, grow, lw, decay, color, drag: 1, glow: 14 })
  delay ? later(go, delay) : go()
}
const bolt = (o, color) => {
  const a = R(0, TAU), len = R(260, 520), pts = [[o.x, o.y]]
  for (let i = 1; i <= 9; i++) {
    const d = (len * i) / 9, j = R(-26, 26)
    pts.push([o.x + Math.cos(a) * d + Math.cos(a + 1.57) * j, o.y + Math.sin(a) * d + Math.sin(a + 1.57) * j])
  }
  spawn({ shape: 'bolt', pts, lw: R(1.5, 3.5), decay: 0.07, color, drag: 1, glow: 18 })
}
const firework = (x, y) => {
  radial({ x, y }, { n: 28, sp: [2, 7], size: [1.8, 3.6], decay: [0.015, 0.03], pal: P(6), g: 0.07, drag: 0.97 })
  radial({ x, y }, { n: 6, sp: [1, 4], size: [3, 6], decay: [0.015, 0.03], pal: P(6), shape: 'star', g: 0.05 })
}

// เอฟเฟกต์ตอนกล่องแตก (ทุกระดับ)
const shatterFx = () => {
  const o = focus(), i = finalIdx.value, t = tier.value
  radial(o, { n: 20 + i * 8, sp: [4, 14], size: [4, 10], decay: [0.02, 0.03], pal: [t.c1, '#fff'], shape: 'shard', g: 0.2, add: false })
  ring(o, '#fff', 16, 6, 0.04)
  ring(o, t.c1, 10, 5, 0.03, 80)
}

// เอฟเฟกต์ตอนเฉลย — ต่างกันทุกระดับ
const REVEAL = [
  // Common: ประกายเล็กๆ ผุดขึ้น
  (o) => {
    radial(o, { n: 34, sp: [2, 7], size: [2, 4.5], decay: [0.012, 0.02], pal: P(0), g: 0.05 })
    radial(o, { n: 8, sp: [1, 5], size: [3, 6], decay: [0.012, 0.02], pal: P(0), shape: 'star' })
  },
  // Uncommon: ใบไม้พัดหมุนวน
  (o) => radial(o, { n: 26, sp: [2, 6], size: [5, 9], decay: [0.006, 0.011], pal: P(1), shape: 'leaf', g: 0.02, drag: 0.985, sway: 1.4, add: false, glow: 0 }),
  // Rare: คลื่นน้ำกระเพื่อม + ฟองลอย
  (o) => {
    ;[0, 1, 2].forEach((i) => ring(o, TIERS[2].c1, 6, 4, 0.016, i * 220))
    radial(o, { n: 34, sp: [1, 5], size: [2, 5], decay: [0.008, 0.014], pal: P(2), g: -0.03 })
  },
  // Epic: สายฟ้าฟาด
  (o) => {
    for (let i = 0; i < 8; i++) later(() => bolt(o, pick(P(3))), i * 70)
    radial(o, { n: 50, sp: [2, 10], size: [2, 5], decay: [0.01, 0.018], pal: P(3) })
    ring(o, '#c084fc', 14, 5, 0.03)
  },
  // Legendary: คลื่นทอง + ดาวทองพุ่งกระจาย
  (o) => {
    ;[0, 1, 2].forEach((i) => ring(o, '#fde047', 14, 5, 0.02, i * 160))
    radial(o, { n: 80, sp: [4, 14], size: [3, 6.5], decay: [0.007, 0.012], pal: P(4), shape: 'star', g: 0.04 })
  },
  // Secret: กระจกแตกสีรุ้ง + วงแหวนรุ้ง
  (o) => {
    ;[0, 1, 2, 3].forEach((i) => ring(o, `hsl(${i * 90},95%,65%)`, 15, 5, 0.022, i * 140))
    radial(o, { n: 70, sp: [5, 16], size: [5, 12], decay: [0.01, 0.018], pal: TIERS[5].pal, shape: 'shard', g: 0.12, add: false })
    radial(o, { n: 50, sp: [2, 12], size: [2, 5], decay: [0.008, 0.014], pal: TIERS[5].pal })
  },
  // Special Collection: พลุหลายลูก + ริบบิ้นคอนเฟตติ
  (o) => {
    firework(o.x, o.y - 30)
    for (let i = 0; i < 3; i++) later(() => firework(R(0.15, 0.85) * W, R(0.12, 0.55) * H), 200 + i * 400)
    for (let i = 0; i < N(50); i++) {
      spawn({
        x: R(0, W), y: R(-200, -10), vx: R(-1, 1), vy: R(2, 5), g: 0.01, drag: 0.995, size: R(4, 8),
        decay: 0.005, color: pick(P(6)), shape: 'ribbon', rot: R(0, TAU), vr: R(-0.1, 0.1), sway: 1, add: false, glow: 0
      })
    }
    ring(o, '#fff', 14, 5, 0.025)
  }
]

// เอฟเฟกต์ต่อเนื่องหลังเฉลย
const SUSTAIN = [
  null,
  () => spawn({
    x: R(0, W), y: -20, vx: R(-0.5, 0.5), vy: R(1, 2.2), size: R(5, 8), decay: 0.0035, shape: 'leaf',
    color: pick(P(1)), sway: 1.3, rot: R(0, TAU), vr: R(-0.05, 0.05), add: false, glow: 0, drag: 1
  }),
  () => spawn({ x: R(0, W), y: H + 20, vy: -R(1.5, 3.2), size: R(2, 5), decay: 0.005, g: -0.004, color: pick(P(2)), sway: 0.6, drag: 1 }),
  (o) => bolt(o, pick(P(3))),
  () => spawn({
    x: R(0, W), y: -20, vy: R(2, 5), size: R(2, 4.5), decay: 0.0045, g: 0.01, color: pick(P(4)),
    shape: Math.random() < 0.4 ? 'star' : 'dot', drag: 1
  }),
  () => {
    const s = R(10, 16)
    spawn({
      x: R(0.2 * W, 1.1 * W), y: -40, vx: -s * 0.6, vy: s, size: R(1.5, 3), decay: 0.007, shape: 'meteor',
      tail: R(5, 9), color: TIERS[5].pal(), drag: 1, glow: 14
    })
  },
  (o) => {
    if (++sparkN % 2 === 0) {
      spawn({
        x: o.x + R(-280, 280), y: o.y + R(-260, 260), size: R(3, 8), decay: 0.03, shape: 'star',
        color: pick(P(6)), vr: R(-0.05, 0.05), drag: 1, glow: 12
      })
    }
    if (sparkN % 36 === 0) firework(R(0.1, 0.9) * W, R(0.1, 0.5) * H)
  }
]

const chargeFx = (o, f) => {
  if (Math.random() > (0.25 + progress.value * 1.6) * f) return
  const a = R(0, TAU), d = R(160, 340), frames = R(34, 48), pal = litTier.value.pal
  spawn({
    x: o.x + Math.cos(a) * d, y: o.y + Math.sin(a) * d, vx: (-Math.cos(a) * d) / frames, vy: (-Math.sin(a) * d) / frames,
    size: R(1.5, 3.2), decay: 1 / frames, color: typeof pal === 'function' ? pal() : pick(pal), drag: 1
  })
}

const step = (p, f) => {
  p.t += f
  if (p.shape === 'bolt') { p.life -= p.decay * f; return }
  const d = Math.pow(p.drag, f)
  p.vx *= d; p.vy *= d; p.vy += p.g * f
  p.x += p.vx * f + (p.sway ? Math.sin(p.t * 0.08) * p.sway * f : 0)
  p.y += p.vy * f
  p.rot += p.vr * f
  if (p.shape === 'ring') p.size += p.grow * f
  p.life -= p.decay * f
}

const drawP = (p) => {
  ctx.globalAlpha = Math.min(1, Math.max(0, p.life))
  ctx.globalCompositeOperation = p.add ? 'lighter' : 'source-over'
  ctx.fillStyle = ctx.strokeStyle = p.color
  ctx.shadowColor = p.color
  ctx.shadowBlur = p.glow
  if (p.shape === 'ring') {
    ctx.lineWidth = Math.max(0.5, p.lw * p.life)
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.stroke(); return
  }
  if (p.shape === 'bolt') {
    ctx.lineWidth = p.lw; ctx.lineJoin = 'round'; ctx.beginPath()
    p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke(); return
  }
  if (p.shape === 'meteor') {
    ctx.lineWidth = p.size; ctx.lineCap = 'round'; ctx.beginPath()
    ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * p.tail, p.y - p.vy * p.tail); ctx.stroke(); return
  }
  const s = p.size
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  if (p.shape === 'ribbon') ctx.scale(1, Math.cos(p.t * 0.15))
  ctx.beginPath()
  if (p.shape === 'star') {
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2
      ctx.lineTo(Math.cos(a) * s * 2, Math.sin(a) * s * 2)
      ctx.lineTo(Math.cos(a + Math.PI / 4) * s * 0.55, Math.sin(a + Math.PI / 4) * s * 0.55)
    }
    ctx.closePath()
  } else if (p.shape === 'leaf') ctx.ellipse(0, 0, s, s * 0.45, 0, 0, TAU)
  else if (p.shape === 'shard') { ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, s * 0.8); ctx.lineTo(-s * 0.7, s * 0.5); ctx.closePath() }
  else if (p.shape === 'ribbon') ctx.rect(-s / 2, -s * 1.2, s, s * 2.4)
  else ctx.arc(0, 0, s, 0, TAU)
  ctx.fill()
  ctx.restore()
}

/* ----------------------- timeline / main loop ----------------------- */
let raf = 0, last = 0, stageAt = 0, nextPip = 1, pipAt = [], emitAcc = 0, runId = 0

const setStage = (s, now = performance.now()) => {
  stage.value = s
  stageAt = now
  if (s === 'lock') {
    progress.value = 1
    litIdx.value = finalIdx.value
    sfx.heartbeat()
  } else if (s === 'burst') {
    quaking.value = tier.value.quake > 0 && !reduced
    sfx.boom()
    shatterFx()
    later(() => { quaking.value = false }, 750)
  } else if (s === 'revealed') {
    sfx.chord()
    nextTick(() => REVEAL[finalIdx.value](focus()))
  }
}

const frame = (now) => {
  raf = requestAnimationFrame(frame)
  const dt = Math.min(40, last ? now - last : 16.7)
  last = now
  const f = dt / 16.67

  // timeline
  if (stage.value === 'charging') {
    progress.value = Math.min(1, (now - stageAt) / tier.value.dur)
    while (nextPip <= finalIdx.value && progress.value >= pipAt[nextPip]) {
      litIdx.value = nextPip
      sfx.tick(nextPip)
      ring(focus(), TIERS[nextPip].c1, 6, 4, 0.04)
      nextPip++
    }
    if (progress.value >= 1) setStage('lock', now)
  } else if (stage.value === 'lock' && now - stageAt >= tier.value.lock) setStage('burst', now)
  else if (stage.value === 'burst' && now - stageAt >= 550) setStage('revealed', now)

  if (!ctx) return
  const o = focus()
  if (stage.value === 'charging' || stage.value === 'lock') chargeFx(o, f)
  if (stage.value === 'revealed' && tier.value.emit) {
    emitAcc += dt
    if (emitAcc >= tier.value.emit) { emitAcc = 0; SUSTAIN[finalIdx.value]?.(o) }
  }

  ctx.clearRect(0, 0, W, H)
  let w = 0
  for (let i = 0; i < fx.length; i++) {
    const p = fx[i]
    step(p, f)
    const inside = p.shape === 'bolt' || (p.x > -150 && p.x < W + 150 && p.y > -250 && p.y < H + 150)
    if (p.life > 0 && inside) { drawP(p); fx[w++] = p }
  }
  fx.length = w
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
  ctx.globalCompositeOperation = 'source-over'
}

const setupCanvas = () => {
  const c = canvasEl.value
  if (!c) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth
  H = window.innerHeight
  c.width = W * dpr
  c.height = H * dpr
  ctx = c.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const halt = () => {
  runId++
  cancelAnimationFrame(raf)
  clearTimers()
  fx = []
  ctx?.clearRect(0, 0, W, H)
}

const begin = async () => {
  halt()
  const id = runId
  stage.value = 'charging'
  progress.value = 0
  litIdx.value = 0
  quaking.value = false
  await nextTick()
  if (id !== runId || !props.isOpen) return
  setupCanvas()
  const F = finalIdx.value
  pipAt = [0]
  for (let k = 1; k <= F; k++) pipAt[k] = 0.14 + 0.66 * Math.pow(k / F, 1.25)
  nextPip = 1
  emitAcc = 0
  sparkN = 0
  last = 0
  stageAt = performance.now()
  sfx.riser()
  raf = requestAnimationFrame(frame)
}

const skip = () => {
  if (stage.value !== 'charging' && stage.value !== 'lock') return
  progress.value = 1
  litIdx.value = finalIdx.value
  setStage('burst')
}

watch(() => [props.isOpen, props.drawnItem], ([open, item]) => {
  if (open && item) begin()
  else {
    halt()
    stage.value = 'charging'
    progress.value = 0
    litIdx.value = 0
  }
}, { immediate: true })

const onKey = (e) => {
  if (!props.isOpen || e.key !== 'Escape') return
  stage.value === 'revealed' ? emit('close') : skip()
}
const onResize = () => { if (canvasEl.value) setupCanvas() }
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  halt()
  audioCtx?.close?.()
})

const onImgError = (e) => {
  if (e.target.dataset.fallback) return
  e.target.dataset.fallback = '1'
  e.target.src = FALLBACK_IMG
}
</script>

<template>
  <Teleport to="body">
    <Transition name="gx-fade">
      <div v-if="isOpen" role="dialog" aria-modal="true" aria-label="เปิดกล่องกาชา"
        class="gx-root fixed inset-0 z-50 overflow-hidden bg-black text-white select-none"
        :class="{ 'gx-quake': quaking }" :style="rootStyle">
        <!-- พื้นหลังเปลี่ยนตามระดับที่ "ไต่" ถึง: ยิ่งสูงยิ่งอลังการ -->
        <div class="gx-bgwrap" :style="{ opacity: stage === 'charging' ? 0.5 + progress * 0.5 : 1 }">
          <Transition name="gx-bg">
            <div :key="bgIdx" class="gx-bg" :class="'gx-bg-' + bgIdx">
              <i class="l1" /><i class="l2" /><i class="l3" />
            </div>
          </Transition>
        </div>
        <div class="gx-vignette" />

        <canvas ref="canvasEl" class="pointer-events-none absolute inset-0 z-40" aria-hidden="true" />
        <div v-if="stage === 'burst'" class="gx-flash" />

        <!-- ปุ่มมุมบน -->
        <div class="absolute left-4 top-4 z-50 sm:left-6 sm:top-6">
          <button type="button"
            class="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-md transition hover:bg-white/20"
            :aria-pressed="soundEnabled" @click="soundEnabled = !soundEnabled">
            <Volume2 v-if="soundEnabled" class="h-4 w-4 text-emerald-400" />
            <VolumeX v-else class="h-4 w-4 text-stone-400" />
            <span>{{ soundEnabled ? 'เสียงเปิด' : 'ปิดเสียง' }}</span>
          </button>
        </div>
        <div class="absolute right-4 top-4 z-50 sm:right-6 sm:top-6">
          <button v-if="stage === 'charging' || stage === 'lock'" type="button"
            class="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-stone-200 backdrop-blur-md transition hover:bg-white/20"
            @click="skip">
            <FastForward class="h-4 w-4" />
            <span>ข้ามอนิเมชั่น</span>
          </button>
          <button v-else-if="stage === 'revealed'" type="button" aria-label="ปิด"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:scale-105 hover:bg-white/20"
            @click="emit('close')">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="absolute inset-0 z-30 overflow-y-auto">
          <div class="flex min-h-full flex-col items-center justify-center px-4 py-16 text-center">

            <!-- ============ ช่วงลุ้น: charging / lock / burst ============ -->
            <div v-if="stage !== 'revealed'" class="flex w-full max-w-md flex-col items-center">
              <!-- บันไดระดับ: ไฟไต่ขึ้นทีละขั้นแล้วไปหยุดที่ผลจริง -->
              <div class="mb-3 flex items-center gap-1.5" aria-hidden="true">
                <span v-for="(t, i) in TIERS" :key="t.key" class="gx-pip"
                  :class="{ 'is-lit': i <= litIdx, 'is-top': i === litIdx }" :style="{ '--pc': t.c1 }" />
              </div>
              <p class="mb-6 h-5 text-xs font-extrabold tracking-[0.2em]" :style="{ color: litTier.c1 }">
                {{ litTier.label }}
              </p>

              <div ref="focusEl" class="gx-boxwrap relative h-64 w-64 sm:h-80 sm:w-80" :class="'is-' + stage"
                :style="{ '--c1': litTier.c1, '--rgb': litTier.rgb }">
                <div class="gx-aura" :style="{ background: auraBg, opacity: 0.35 + progress * 0.65 }" />
                <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1.2" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke-width="1.8" stroke-linecap="round"
                    :stroke="litTier.c1" stroke-dasharray="289" :stroke-dashoffset="289 * (1 - progress)"
                    style="filter: drop-shadow(0 0 3px var(--c1))" />
                </svg>
                <div class="gx-runes gx-runes-a" />
                <div class="gx-runes gx-runes-b" />
                <div class="gx-orbit" :class="{ 'is-fast': progress > 0.6 }">
                  <i v-for="n in 6" :key="n" :style="{ '--i': n }" />
                </div>
                <img :src="box?.image || BOX_IMG" :alt="box?.name" class="gx-box"
                  :style="stage === 'charging' ? { animationDuration: beat + 's' } : null" />
              </div>

              <div class="mt-8 min-h-[4.5rem] space-y-1.5" aria-live="polite">
                <h3 class="text-xl font-bold tracking-wide sm:text-2xl">{{ statusText }}</h3>
                <p class="text-sm text-white/60">{{ box?.name }}</p>
              </div>
            </div>

            <!-- ====================== เฉลยผล ====================== -->
            <div v-else-if="stage === 'revealed' && drawnItem" class="flex w-full max-w-2xl flex-col items-center">
              <div
                class="gx-in relative z-50 inline-flex items-center gap-3 rounded-full px-6 py-2 text-sm font-extrabold tracking-[0.18em] backdrop-blur-md sm:text-base"
                :style="[bannerStyle, { '--d': '.15s' }]">
                <component :is="tier.icon" class="h-5 w-5" />
                <span>{{ tier.label }}</span>
                <component :is="tier.icon" class="h-5 w-5" />
              </div>
              <p class="gx-in mt-3 text-sm text-white/75 sm:text-base" style="--d: .3s">{{ tier.msg }}</p>

              <div ref="focusEl" class="gx-art gx-pop relative mt-6">
                <img :src="drawnItem.image" :alt="drawnItem.name" class="gx-art-img gx-float" @error="onImgError" />
              </div>

              <h1 class="gx-name gx-in mt-8" :class="{ 'gx-shimmer': finalIdx >= 5 }"
                :style="[nameStyle, { '--d': '.45s' }]">
                {{ drawnItem.name }}
              </h1>
              <p class="gx-in mt-3 max-w-xl px-4 text-base leading-relaxed text-white/85 sm:text-lg" style="--d: .55s">
                {{ drawnItem.description || 'สหายภูติผู้พิทักษ์แห่งอาณาจักร Aetheria' }}
              </p>

              <div class="gx-in mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70"
                style="--d: .65s">
                <span v-if="drawnItem.rate !== undefined && drawnItem.rate !== null"
                  class="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  โอกาสออก {{ drawnItem.rate }}%
                </span>
                <span v-if="box?.name" class="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  จาก {{ box.name }}
                </span>
              </div>

              <div class="gx-in mt-6" style="--d: .75s">
                <div v-if="!isDuplicate"
                  class="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/50 px-6 py-2 text-sm font-bold text-emerald-400 backdrop-blur-md">
                  <Check class="h-5 w-5" />
                  <span>บันทึกเข้า "คลังไอเทม" เรียบร้อยแล้ว</span>
                </div>
                <div v-else
                  class="flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/50 px-6 py-2 text-sm font-bold text-amber-400 backdrop-blur-md">
                  <RotateCcw class="h-5 w-5" />
                  <span>ได้ไอเทมซ้ำ! คืนเหรียญให้ <strong class="text-white">+{{ refundCoins }} Coins</strong> 🪙</span>
                </div>
              </div>

              <div class="gx-in mt-7 flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row" style="--d: .85s">
                <button type="button" :disabled="!canAfford"
                  class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-600 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-6 py-4 text-sm font-black text-stone-950 shadow-[0_0_30px_rgba(245,158,11,0.35)] transition hover:brightness-110 active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                  @click="emit('drawAgain')">
                  <RotateCcw class="h-5 w-5" />
                  <span>สุ่มอีกครั้ง ({{ box?.price }} Coins)</span>
                </button>
                <button type="button"
                  class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:flex-1"
                  @click="emit('close')">
                  <Package class="h-5 w-5" />
                  <span>กลับสู่ร้านค้า</span>
                </button>
              </div>
              <p v-if="!canAfford" class="mt-3 text-xs text-rose-300">เหรียญไม่พอสำหรับการสุ่มอีกครั้ง</p>
              <p class="mt-4 text-xs text-white/55">
                เหรียญคงเหลือ <span class="font-mono font-bold text-amber-400">🪙 {{ studentCoins }} Coins</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gx-fade-enter-active,
.gx-fade-leave-active {
  transition: opacity .4s ease;
}

.gx-fade-enter-from,
.gx-fade-leave-to {
  opacity: 0;
}

/* ---------------- BACKGROUNDS (7 ระดับ) ---------------- */
.gx-bg-enter-active,
.gx-bg-leave-active {
  transition: opacity .9s ease;
}

.gx-bg-enter-from,
.gx-bg-leave-to {
  opacity: 0;
}

.gx-bgwrap {
  position: absolute;
  inset: 0;
  transition: opacity .6s;
}

.gx-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gx-bg>i {
  position: absolute;
  inset: 0;
  display: block;
}

.gx-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, .65) 100%);
}

@keyframes gx-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes gx-breathe {
  50% {
    transform: scale(1.15);
  }
}

@keyframes gx-rise {
  to {
    background-position: 0 calc(var(--y1) * -2), 0 calc(var(--y2) * -2);
  }
}

@keyframes gx-twinkle {
  from {
    opacity: .3;
  }

  to {
    opacity: 1;
  }
}

/* 0 Common: ฝุ่นแสงมรกตลอยขึ้น */
.gx-bg-0 {
  background: #04100c;
}

.gx-bg-0 .l1 {
  background: radial-gradient(circle at 50% 50%, rgba(52, 211, 153, .28), transparent 62%);
}

.gx-bg-0 .l2 {
  --y1: 110px;
  --y2: 73px;
  opacity: .5;
  background-image: radial-gradient(circle, rgba(167, 243, 208, .7) 0 1.5px, transparent 2px), radial-gradient(circle, rgba(110, 231, 183, .5) 0 1px, transparent 1.5px);
  background-size: 90px 110px, 57px 73px;
  animation: gx-rise 22s linear infinite;
}

/* 1 Uncommon: สายลมพัดเป็นริ้ว */
.gx-bg-1 {
  background: #031210;
}

.gx-bg-1 .l1 {
  background: radial-gradient(circle at 30% 60%, rgba(45, 212, 191, .25), transparent 55%), radial-gradient(circle at 75% 35%, rgba(74, 222, 128, .18), transparent 50%);
}

.gx-bg-1 .l2 {
  background: repeating-linear-gradient(0deg, transparent 0 57px, rgba(94, 234, 212, .5) 57px 59px);
  -webkit-mask: linear-gradient(90deg, transparent, #000 35%, transparent 70%) 0 0 / 460px 100% repeat-x;
  mask: linear-gradient(90deg, transparent, #000 35%, transparent 70%) 0 0 / 460px 100% repeat-x;
  animation: gx-wind 2.6s linear infinite;
}

@keyframes gx-wind {
  to {
    -webkit-mask-position: -460px 0;
    mask-position: -460px 0;
  }
}

/* 2 Rare: ใต้น้ำ คลื่นกระเพื่อมจากขอบล่าง + ฟองอากาศ */
.gx-bg-2 {
  background: #020a14;
}

.gx-bg-2 .l1 {
  background: radial-gradient(circle at 50% 55%, rgba(34, 211, 238, .32), rgba(37, 99, 235, .14) 45%, transparent 70%);
  animation: gx-breathe 3.5s ease-in-out infinite;
}

.gx-bg-2 .l2 {
  transform-origin: 50% 115%;
  background: repeating-radial-gradient(circle at 50% 115%, transparent 0 46px, rgba(103, 232, 249, .22) 46px 48px);
  animation: gx-swell 5s linear infinite;
}

.gx-bg-2 .l3 {
  --y1: 160px;
  --y2: 120px;
  opacity: .55;
  background-image: radial-gradient(circle, rgba(165, 243, 252, .7) 0 2px, transparent 3px), radial-gradient(circle, rgba(125, 211, 252, .5) 0 3px, transparent 4px);
  background-size: 140px 160px, 95px 120px;
  animation: gx-rise 14s linear infinite;
}

@keyframes gx-swell {
  0% {
    transform: scale(1);
    opacity: .9;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 3 Epic: พลาสม่าสีม่วง + สายฟ้าแลบ */
.gx-bg-3 {
  background: #07020f;
}

.gx-bg-3 .l1 {
  inset: -50%;
  filter: blur(60px);
  background: conic-gradient(from 0deg, rgba(168, 85, 247, .5), rgba(99, 102, 241, .15), rgba(217, 70, 239, .45), rgba(30, 27, 75, .1), rgba(168, 85, 247, .5));
  animation: gx-spin 14s linear infinite;
}

.gx-bg-3 .l2 {
  opacity: 0;
  background: radial-gradient(ellipse at 50% -10%, rgba(233, 213, 255, .75), transparent 55%);
  animation: gx-bolt 3.4s steps(1, end) infinite;
}

.gx-bg-3 .l3 {
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, .35), transparent 60%);
  animation: gx-breathe 2.2s ease-in-out infinite;
}

@keyframes gx-bolt {

  0%,
  100% {
    opacity: 0;
  }

  10% {
    opacity: .9;
  }

  12% {
    opacity: .1;
  }

  14% {
    opacity: .7;
  }

  17% {
    opacity: 0;
  }

  58% {
    opacity: 0;
  }

  60% {
    opacity: .8;
  }

  62% {
    opacity: 0;
  }
}

/* 4 Legendary: รัศมีทองหมุน + เสาแสงจากฟ้า + ประกายไฟลอย */
.gx-bg-4 {
  background: #0d0801;
}

.gx-bg-4 .l1 {
  inset: -30%;
  background: repeating-conic-gradient(rgba(251, 191, 36, .34) 0 7deg, transparent 7deg 22deg);
  -webkit-mask: radial-gradient(circle, #000 5%, transparent 62%);
  mask: radial-gradient(circle, #000 5%, transparent 62%);
  animation: gx-spin 38s linear infinite;
}

.gx-bg-4 .l2 {
  background: radial-gradient(ellipse 18% 100% at 50% 0%, rgba(253, 230, 138, .55), transparent 80%), radial-gradient(circle at 50% 50%, rgba(245, 158, 11, .4), transparent 60%);
  animation: gx-breathe 3s ease-in-out infinite;
}

.gx-bg-4 .l3 {
  --y1: 130px;
  --y2: 90px;
  background-image: radial-gradient(circle, rgba(253, 224, 71, .95) 0 1.5px, transparent 2.5px), radial-gradient(circle, rgba(251, 146, 60, .8) 0 1px, transparent 2px);
  background-size: 110px 130px, 70px 90px;
  animation: gx-rise 9s linear infinite;
}

/* 5 Secret: ห้วงจักรวาล วงแหวนรุ้งหมุน + ดาวระยิบ */
.gx-bg-5 {
  background: #030008;
}

.gx-bg-5 .l1 {
  inset: -60%;
  filter: blur(80px);
  opacity: .6;
  background: conic-gradient(from 0deg, #be123c, #4c1d95, #000000, #9f1239, #2e1065, #be123c);
  animation: gx-spin 10s linear infinite;
}

.gx-bg-5 .l2 {
  background-image: radial-gradient(circle, #fff 0 1px, transparent 1.5px), radial-gradient(circle, #fda4af 0 1.2px, transparent 2px), radial-gradient(circle, #c4b5fd 0 1px, transparent 1.5px);
  background-size: 130px 150px, 210px 190px, 90px 100px;
  background-position: 0 0, 40px 70px, 20px 30px;
  animation: gx-twinkle 2.4s ease-in-out infinite alternate;
}

/* Removed .gx-bg-5 .l3 rainbow ring */

/* 6 Special Collection: โฮโลแกรมไอริเดสเซนต์ + แสงกวาด + ลายเพชร */
.gx-bg-6 {
  background: #0b0716;
}

.gx-bg-6 .l1 {
  inset: -60%;
  filter: blur(80px);
  opacity: .42;
  background: conic-gradient(from 0deg, #fda4af, #fde68a, #bbf7d0, #a5f3fc, #c4b5fd, #f9a8d4, #fda4af);
  animation: gx-spin 18s linear infinite;
}

.gx-bg-6 .l2 {
  background: repeating-linear-gradient(45deg, transparent 0 38px, rgba(255, 255, 255, .07) 38px 39px), repeating-linear-gradient(-45deg, transparent 0 38px, rgba(255, 255, 255, .07) 38px 39px);
  animation: gx-twinkle 4s ease-in-out infinite alternate;
}

.gx-bg-6 .l3 {
  opacity: .55;
  mix-blend-mode: screen;
  background-size: 250% 100%;
  background-image: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, .5) 48%, rgba(253, 224, 255, .35) 52%, transparent 65%);
  animation: gx-sweep 3.2s ease-in-out infinite;
}

@keyframes gx-sweep {
  from {
    background-position: 130% 0;
  }

  to {
    background-position: -130% 0;
  }
}

/* ---------------- LADDER ---------------- */
.gx-pip {
  width: 30px;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, .12);
  transition: all .25s;
}

@media (min-width: 640px) {
  .gx-pip {
    width: 40px;
  }
}

.gx-pip.is-lit {
  background: var(--pc);
  box-shadow: 0 0 10px var(--pc);
}

.gx-pip.is-top {
  transform: scaleY(1.9);
  box-shadow: 0 0 18px var(--pc), 0 0 4px #fff;
}

/* ---------------- BOX SCENE ---------------- */
.gx-boxwrap {
  --r: 118px;
}

@media (min-width: 640px) {
  .gx-boxwrap {
    --r: 147px;
  }
}

.gx-aura {
  position: absolute;
  inset: -25%;
  border-radius: 50%;
  filter: blur(30px);
  transition: background .5s;
}

.gx-box {
  position: absolute;
  inset: 16%;
  width: 68%;
  height: 68%;
  object-fit: contain;
  filter: drop-shadow(0 25px 40px rgba(0, 0, 0, .85));
  animation: gx-beat 1s ease-in-out infinite;
}

@keyframes gx-beat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.07);
  }
}

.is-lock .gx-box {
  animation: gx-tremor .16s linear infinite;
  filter: brightness(1.6) drop-shadow(0 0 30px var(--c1));
}

@keyframes gx-tremor {
  25% {
    transform: translate(2px, -1px) scale(1.12);
  }

  75% {
    transform: translate(-2px, 1px) scale(1.12);
  }
}

.is-burst .gx-box {
  animation: gx-burst .5s ease-in forwards;
}

@keyframes gx-burst {
  to {
    transform: scale(2.4);
    opacity: 0;
    filter: brightness(6);
  }
}

.gx-runes {
  position: absolute;
  border-radius: 50%;
  inset: 6%;
  border: 2px dashed var(--c1);
  opacity: .5;
  animation: gx-spin 6s linear infinite;
  transition: border-color .4s;
}

.gx-runes-b {
  inset: -4%;
  border: 1px dotted var(--c1);
  animation-direction: reverse;
  animation-duration: 9s;
}

.gx-orbit {
  position: absolute;
  inset: 0;
  animation: gx-spin 4s linear infinite;
}

.gx-orbit.is-fast {
  animation-duration: 1.4s;
}

.gx-orbit i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 7px;
  height: 7px;
  margin: -3.5px;
  border-radius: 50%;
  background: var(--c1);
  box-shadow: 0 0 12px var(--c1);
  transform: rotate(calc(var(--i) * 60deg)) translateY(calc(var(--r) * -1));
}

.gx-flash {
  position: absolute;
  inset: 0;
  z-index: 45;
  pointer-events: none;
  background: radial-gradient(circle, #fff 0%, rgba(var(--rgb), .85) 35%, transparent 75%);
  animation: gx-flash .55s ease-out forwards;
}

@keyframes gx-flash {
  0% {
    opacity: 0;
  }

  18% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.gx-quake {
  animation: gx-quake .7s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes gx-quake {

  10%,
  90% {
    transform: translate3d(calc(var(--q) * -.5), 0, 0);
  }

  20%,
  80% {
    transform: translate3d(var(--q), calc(var(--q) * .4), 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(calc(var(--q) * -1.4), calc(var(--q) * -.4), 0);
  }

  40%,
  60% {
    transform: translate3d(calc(var(--q) * 1.4), 0, 0);
  }
}

/* ---------------- REVEAL ---------------- */
.gx-in {
  animation: gx-in .6s ease-out both;
  animation-delay: var(--d, 0s);
}

@keyframes gx-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.gx-pop {
  animation: gx-pop .9s cubic-bezier(.2, .9, .25, 1.15) both;
}

@keyframes gx-pop {
  0% {
    transform: scale(.2);
    opacity: 0;
    filter: brightness(4);
  }

  55% {
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
    filter: none;
  }
}

.gx-art {
  width: min(22rem, 38vh);
  height: min(22rem, 38vh);
}

.gx-art-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, .85));
}

.gx-float {
  animation: gx-float 4.5s ease-in-out infinite;
}

@keyframes gx-float {
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

.gx-name {
  font-weight: 900;
  font-size: clamp(2rem, 6vw, 3.75rem);
  line-height: 1.15;
  padding: 0 .5rem;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, .7));
}

.gx-shimmer {
  background-size: 220% 100%;
  animation: gx-in .6s ease-out both, gx-textflow 4s linear infinite;
  animation-delay: var(--d, 0s), 0s;
}

@keyframes gx-textflow {
  to {
    background-position: -220% 0;
  }
}

/* กรอบรัศมีหลังภาพ ต่างกันทุกระดับ */
.halo {
  position: absolute;
  inset: -18%;
  pointer-events: none;
}

.halo i {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.halo .h1 {
  background: radial-gradient(circle, rgba(var(--rgb), .55), transparent 68%);
  filter: blur(24px);
  animation: gx-breathe 3s ease-in-out infinite;
}

.halo-2 .h2 {
  border: 2px solid rgba(var(--rgb), .7);
  animation: gx-ripple 2.4s ease-out infinite;
}

@keyframes gx-ripple {
  from {
    transform: scale(.6);
    opacity: .9;
  }

  to {
    transform: scale(1.25);
    opacity: 0;
  }
}

.halo-3 .h2 {
  border: 2px dashed rgba(var(--rgb), .8);
  box-shadow: inset 0 0 30px rgba(var(--rgb), .5);
  animation: gx-spin 14s linear infinite;
}

.halo-4 .h2 {
  inset: -45%;
  background: repeating-conic-gradient(rgba(251, 191, 36, .45) 0 6deg, transparent 6deg 18deg);
  -webkit-mask: radial-gradient(circle, #000 8%, transparent 60%);
  mask: radial-gradient(circle, #000 8%, transparent 60%);
  animation: gx-spin 26s linear infinite;
}

.halo-5 .h2 {
  inset: -8%;
  background: conic-gradient(#f43f5e, #fbbf24, #34d399, #60a5fa, #c084fc, #f43f5e);
  -webkit-mask: radial-gradient(circle, transparent 62%, #000 63%, #000 66%, transparent 67%);
  mask: radial-gradient(circle, transparent 62%, #000 63%, #000 66%, transparent 67%);
  animation: gx-spin 7s linear infinite;
}

.halo-6 .h2 {
  inset: -12%;
  background: conic-gradient(#fda4af, #fde68a, #bbf7d0, #a5f3fc, #c4b5fd, #f9a8d4, #fda4af);
  -webkit-mask: radial-gradient(circle, transparent 60%, #000 61%, #000 68%, transparent 69%);
  mask: radial-gradient(circle, transparent 60%, #000 61%, #000 68%, transparent 69%);
  animation: gx-spin 9s linear infinite reverse;
}

@media (prefers-reduced-motion: reduce) {

  .gx-quake,
  .gx-bg *,
  .gx-orbit,
  .gx-runes,
  .halo *,
  .gx-float,
  .gx-shimmer {
    animation: none !important;
  }
}
</style>