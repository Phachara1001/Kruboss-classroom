<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { celebration } from '../composables/celebration'

/* ---------- ธีมต่อระดับ ---------- */
const THEMES = {
  common: {
    eyebrow: 'ซื้อสำเร็จ', title: 'ได้รับไอเทมแล้ว!', sub: 'เพิ่มเข้าคลังของคุณเรียบร้อย',
    hues: [210, 200], bursts: 1, gap: 0, count: 28, power: 4, shape: 'dot',
    ringHue: 205, duration: 1600, bannerMs: 2200,
  },
  epic: {
    eyebrow: '✦ EPIC ✦', title: 'ยอดเยี่ยม!', sub: 'คุณได้ไอเทมระดับ Epic มาครอง',
    hues: [285, 265, 310], bursts: 4, gap: 330, count: 56, power: 5.8, shape: 'dot',
    trail: true, ringHue: 280, rings: 2, rays: true, dim: 'rgba(46,16,101,.38)',
    duration: 2800, bannerMs: 3200,
  },
  legendary: {
    eyebrow: '★ LEGENDARY ★', title: 'ตำนานบังเกิด!', sub: 'ไอเทมระดับตำนานเป็นของคุณแล้ว',
    hues: [45, 38, 30], bursts: 8, gap: 330, count: 76, power: 6.8, shape: 'star',
    trail: true, rain: true, confetti: 70, ringHue: 42, rings: 3, rays: true,
    dim: 'rgba(69,26,3,.45)', duration: 3800, bannerMs: 4000,
  },
  secret: {
    eyebrow: '▞ SECRET UNLOCKED ▚', title: 'ความลับถูกเปิดเผย...', sub: 'มีเพียงไม่กี่คนที่เคยครอบครองสิ่งนี้',
    hues: [350, 0, 340], bursts: 6, gap: 400, count: 64, power: 6.2, shape: 'dot',
    trail: true, embers: true, shake: true, flash: true, ringHue: 350, rings: 3,
    dim: 'rgba(0,0,0,.68)', scan: true, duration: 3800, bannerMs: 4000,
  },
  special: {
    eyebrow: '✧ SPECIAL COLLECTION ✧', title: 'ขอแสดงความยินดี!', sub: 'คุณได้ครอบครองของสะสมสุดพิเศษ',
    rainbow: true, bursts: 14, gap: 280, count: 96, power: 7.2, shape: 'star',
    trail: true, rain: true, confetti: 150, ringHue: 0, rings: 4, rays: true,
    dim: 'rgba(10,8,22,.62)', duration: 5200, bannerMs: 5200,
  },
}

const cv = ref(null)
const banner = ref(null)
const flash = ref(false)

let ctx, raf = 0, w = 0, h = 0, endAt = 0, theme = null
let rockets = [], parts = [], rings = []
let timers = []

const rand = (a, b) => a + Math.random() * (b - a)
const pickHue = (t) => (t.rainbow ? rand(0, 360) : (t.hues || [t.ringHue])[Math.floor(Math.random() * (t.hues || [1]).length)])

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  cv.value.width = w * dpr
  cv.value.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function launch(t) {
  rockets.push({
    x: rand(w * 0.12, w * 0.88), y: h + 10,
    vx: rand(-1, 1), vy: -rand(11, 15) * Math.max(h / 800, 0.7),
    ty: rand(h * 0.1, h * 0.42), hue: pickHue(t), t,
  })
}

function explode(x, y, hue0, t) {
  for (let i = 0; i < t.count; i++) {
    const a = (Math.PI * 2 * i) / t.count + rand(-0.1, 0.1)
    const sp = rand(0.35, 1) * t.power
    parts.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 1, decay: rand(0.010, 0.020), g: 0.05,
      hue: t.rainbow ? hue0 + rand(-50, 50) : hue0 + rand(-12, 12),
      size: rand(1.6, 3.2), star: t.shape === 'star' && Math.random() < 0.45,
    })
  }
  // วงแหวนช็อกเวฟเล็ก ๆ ตอนระเบิด
  if (t.rings) rings.push({ x, y, r: 4, max: rand(60, 110), hue: hue0, life: 1, lw: 2 })
}

/* ปืนกระดาษสี ยิงจากมุมล่างซ้าย-ขวา */
function cannon(t) {
  const n = Math.floor(t.confetti / 2)
  for (const side of [0, 1]) {
    for (let i = 0; i < n; i++) {
      const dir = side ? -1 : 1
      const a = rand(-1.25, -0.55)
      const sp = rand(9, 17)
      parts.push({
        conf: true, x: side ? w + 5 : -5, y: h * rand(0.82, 1),
        vx: Math.cos(a) * sp * dir, vy: Math.sin(a) * sp,
        life: 1, decay: rand(0.0035, 0.007), g: 0.16,
        hue: pickHue(t) + rand(-15, 15), size: rand(5, 10),
        rot: rand(0, 6.28), vr: rand(-0.3, 0.3),
      })
    }
  }
}

function ambient(t) {
  if (t.rain && Math.random() < 0.6) {
    parts.push({
      x: rand(0, w), y: -10, vx: rand(-0.3, 0.3), vy: rand(1.5, 3),
      life: 1, decay: 0.006, g: 0, hue: t.rainbow ? rand(0, 360) : t.hues[0],
      size: rand(1.5, 3), star: true,
    })
  }
  if (t.embers && Math.random() < 0.8) {
    parts.push({
      x: rand(0, w), y: h + 10, vx: rand(-0.5, 0.5), vy: -rand(1.5, 3.8),
      life: 1, decay: 0.008, g: -0.01, hue: rand(345, 360),
      size: rand(1.5, 3.2), star: false,
    })
  }
}

function drawStar(x, y, r) {
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    const rr = i % 2 ? r * 0.4 : r
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
  }
  ctx.closePath()
  ctx.fill()
}

function frame(now) {
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'

  if (now < endAt) ambient(theme)

  // วงแหวนช็อกเวฟ
  rings = rings.filter((g) => {
    g.r += (g.max - g.r) * 0.09 + 1.2
    g.life -= 0.022
    if (g.life <= 0) return false
    ctx.strokeStyle = `hsl(${g.hue} 100% 70% / ${g.life * 0.8})`
    ctx.lineWidth = g.lw * g.life + 0.5
    ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke()
    return true
  })

  rockets = rockets.filter((r) => {
    r.x += r.vx; r.y += r.vy
    ctx.fillStyle = `hsl(${r.hue} 100% 75%)`
    ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2); ctx.fill()
    if (r.t.trail) {          // หางประกายตามจรวด
      parts.push({
        x: r.x, y: r.y, vx: rand(-0.4, 0.4), vy: rand(0, 0.8),
        life: 1, decay: 0.055, g: 0, hue: r.hue + rand(-10, 10),
        size: rand(1, 2.2), star: false,
      })
    }
    if (r.y <= r.ty) { explode(r.x, r.y, r.hue, r.t); return false }
    return true
  })

  parts = parts.filter((p) => {
    p.vx *= 0.985; p.vy = p.vy * 0.985 + p.g
    p.x += p.vx; p.y += p.vy; p.life -= p.decay
    if (p.life <= 0 || p.y > h + 30) return false
    ctx.fillStyle = `hsl(${p.hue} 100% ${55 + p.life * 20}% / ${p.life})`
    if (p.conf) {             // เศษกระดาษหมุนพลิกไปมา
      p.rot += p.vr
      ctx.save()
      ctx.translate(p.x, p.y); ctx.rotate(p.rot)
      ctx.scale(1, Math.cos(p.rot * 1.7))
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    } else if (p.star) drawStar(p.x, p.y, p.size * 2.2)
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill() }
    return true
  })

  if (now < endAt || rockets.length || parts.length || rings.length) {
    raf = requestAnimationFrame(frame)
  } else {
    ctx.clearRect(0, 0, w, h)
    raf = 0
  }
}

function stopAll() {
  timers.forEach(clearTimeout); timers = []
  cancelAnimationFrame(raf); raf = 0
  rockets = []; parts = []; rings = []
  ctx?.clearRect(0, 0, w, h)
  document.body.classList.remove('cele-shake')
}

function run({ tier, itemName, itemImage }) {
  stopAll()
  theme = THEMES[tier] || THEMES.common
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  banner.value = { ...theme, tier, itemName, itemImage }
  timers.push(setTimeout(() => (banner.value = null), theme.bannerMs))

  if (theme.flash) {
    flash.value = false
    requestAnimationFrame(() => (flash.value = true))
    timers.push(setTimeout(() => (flash.value = false), 700))
  }
  if (reduce) return

  if (theme.shake) {
    document.body.classList.add('cele-shake')
    timers.push(setTimeout(() => document.body.classList.remove('cele-shake'), 700))
  }

  resize()
  endAt = performance.now() + theme.duration

  // ช็อกเวฟกลางจอตอนแบนเนอร์เด้งออกมา
  const cx = w / 2, cy = h * 0.36
  for (let i = 0; i < (theme.rings || 1); i++) {
    timers.push(setTimeout(() => {
      rings.push({
        x: cx, y: cy, r: 10, max: Math.max(w, h) * 0.55,
        hue: theme.rainbow ? rand(0, 360) : theme.ringHue, life: 1, lw: 5,
      })
    }, i * 160))
  }

  if (theme.confetti) {
    cannon(theme)
    timers.push(setTimeout(() => cannon(theme), 450))
    if (theme.confetti > 100) timers.push(setTimeout(() => cannon(theme), 1100))
  }

  for (let i = 0; i < theme.bursts; i++) {
    timers.push(setTimeout(() => launch(theme), 120 + i * theme.gap))
  }
  raf = requestAnimationFrame(frame)
}

watch(celebration, (ev) => {
  if (!ev) return
  if (!ctx) ctx = cv.value.getContext('2d')
  run(ev)
})

onBeforeUnmount(stopAll)
</script>

<template>
  <Teleport to="body">
    <canvas ref="cv" class="fixed inset-0 z-[9998] pointer-events-none" />

    <div v-if="flash" class="cele-flash fixed inset-0 z-[9997] pointer-events-none" />

    <!-- ฉากหลังมืดลง + ลายสแกน (Secret) -->
    <Transition name="cele-fade">
      <div v-if="banner && banner.dim" class="fixed inset-0 z-[9996] pointer-events-none"
        :class="{ 'cele-scan': banner.scan }"
        :style="{ background: `radial-gradient(ellipse at 50% 36%, transparent 0%, ${banner.dim} 75%), ${banner.dim}` }" />
    </Transition>

    <Transition name="cele">
      <div v-if="banner" class="fixed inset-x-0 top-[28%] z-[9999] flex justify-center px-4 pointer-events-none">
        <div class="relative">
          <!-- แสงรัศมีหมุนอยู่หลังแบนเนอร์ -->
          <div v-if="banner.rays" class="cele-rays" :class="`cele-rays-${banner.tier}`" />
          <div class="cele-banner text-center" :class="`cele-${banner.tier}`">
            <p class="cele-eyebrow">{{ banner.eyebrow }}</p>
            
            <div v-if="banner.itemImage" class="flex justify-center my-6 mt-8">
              <div class="relative w-48 sm:w-56 max-w-full shrink-0 aspect-square flex items-center justify-center">
                <div class="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <img :src="banner.itemImage" class="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-[cele-float_3s_ease-in-out_infinite]" />
              </div>
            </div>

            <h2 class="cele-title">{{ banner.title }}</h2>
            <p class="cele-sub">{{ banner.sub }}</p>
            <p v-if="banner.itemName" class="cele-item">{{ banner.itemName }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@property --cele-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.cele-banner {
  position: relative;
  overflow: hidden;
  padding: 1.4rem 2.5rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  min-width: min(22rem, 88vw);
  max-width: 28rem;
}

/* ประกายแสงวิ่งผ่านแบนเนอร์ */
.cele-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, .45) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: cele-sheen 1.6s .5s ease-out 2;
}

.cele-common::after {
  display: none;
}

.cele-eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .28em;
  opacity: .92;
}

.cele-title {
  font-size: clamp(1.75rem, 5vw, 2.6rem);
  font-weight: 900;
  line-height: 1.25;
  margin: .25rem 0;
  animation: cele-title-in .8s .1s cubic-bezier(.2, 1.2, .3, 1) both;
}

.cele-sub {
  font-size: 13px;
  opacity: .88;
}

.cele-item {
  margin-top: .7rem;
  font-size: 14px;
  font-weight: 800;
  padding-top: .6rem;
  border-top: 1px solid currentColor;
  border-image: linear-gradient(90deg, transparent, currentColor, transparent) 1;
}

/* ===== Rays ===== */
.cele-rays {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 170vmax;
  height: 170vmax;
  transform: translate(-50%, -50%);
  z-index: -1;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(closest-side, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .25) 14%, transparent 30%);
  mask-image: radial-gradient(closest-side, rgba(0, 0, 0, .6) 0%, rgba(0, 0, 0, .25) 14%, transparent 30%);
  animation: cele-rays-spin 14s linear infinite, cele-rays-in 1s ease-out both;
}

.cele-rays-epic {
  background: repeating-conic-gradient(from 0deg, rgba(192, 132, 252, .55) 0 6deg, transparent 6deg 18deg);
}

.cele-rays-legendary {
  background: repeating-conic-gradient(from 0deg, rgba(253, 224, 71, .7) 0 5deg, transparent 5deg 15deg);
  animation-duration: 9s, 1s;
}

.cele-rays-special {
  background: repeating-conic-gradient(from var(--cele-angle), #ff6ec7 0 6deg, #ffb86c 6deg 12deg, #fff48a 12deg 18deg,
      #7dffb2 18deg 24deg, #6ee7ff 24deg 30deg, #a78bfa 30deg 36deg);
  animation: cele-rays-spin 8s linear infinite, cele-rays-in 1s ease-out both;
}

/* ===== Common ===== */
.cele-common {
  background: rgba(255, 255, 255, .92);
  color: #1e3a8a;
  box-shadow: 0 10px 30px -8px rgba(59, 130, 246, .5);
}

/* ===== Epic ===== */
.cele-epic {
  background: linear-gradient(135deg, rgba(88, 28, 135, .94), rgba(109, 40, 217, .94) 55%, rgba(67, 20, 120, .94));
  color: #fae8ff;
  border-color: rgba(216, 180, 254, .6);
  box-shadow: 0 0 40px rgba(168, 85, 247, .7), 0 0 90px rgba(139, 92, 246, .4), inset 0 0 30px rgba(216, 180, 254, .25);
  animation: cele-pulse 1.6s ease-in-out infinite;
}

.cele-epic .cele-title {
  color: #f5d0fe;
  text-shadow: 0 0 16px rgba(232, 121, 249, .9), 0 0 36px rgba(168, 85, 247, .7);
}

/* ===== Legendary ===== */
.cele-legendary {
  background: linear-gradient(135deg, rgba(120, 53, 15, .95), rgba(202, 138, 4, .92) 50%, rgba(120, 53, 15, .95));
  color: #fef3c7;
  border: 2px solid rgba(253, 224, 71, .8);
  box-shadow: 0 0 60px rgba(245, 158, 11, .85), 0 0 120px rgba(251, 191, 36, .45), inset 0 0 36px rgba(253, 224, 71, .35);
  animation: cele-pulse 1.1s ease-in-out infinite;
}

.cele-legendary .cele-title {
  color: #fde047;
  text-shadow: 0 0 20px rgba(253, 224, 71, .95), 0 2px 0 #92400e, 0 0 50px rgba(245, 158, 11, .8);
}

/* ===== Secret ===== */
.cele-secret {
  background: radial-gradient(circle at 50% 0%, rgba(76, 5, 25, .97), rgba(8, 4, 6, .97));
  color: #ffe4e6;
  border-color: rgba(244, 63, 94, .7);
  box-shadow: 0 0 60px rgba(244, 63, 94, .8), 0 0 120px rgba(190, 18, 60, .4), inset 0 0 40px rgba(244, 63, 94, .25);
  animation: cele-flicker 2.4s infinite;
}

.cele-secret .cele-eyebrow {
  color: #fb7185;
}

.cele-secret .cele-title {
  text-shadow: 2px 0 #f43f5e, -2px 0 #22d3ee;
  animation: cele-title-in .8s .1s both, cele-glitch 1.2s 1s infinite;
}

.cele-scan {
  background-blend-mode: normal;
}

.cele-scan::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, .28) 0 2px, transparent 2px 4px);
  mix-blend-mode: multiply;
}

/* ===== Special ===== */
.cele-special {
  color: #fff;
  border: 3px solid transparent;
  background:
    linear-gradient(170deg, rgb(22, 17, 36), rgb(6, 5, 10)) padding-box,
    conic-gradient(from var(--cele-angle), #ff6ec7, #ffb86c, #fff48a, #7dffb2, #6ee7ff, #a78bfa, #ff6ec7) border-box;
  box-shadow: 0 0 60px rgba(167, 139, 250, .7), 0 0 110px rgba(110, 231, 255, .4);
  animation: cele-spin 3s linear infinite, cele-pulse 1.4s ease-in-out infinite;
}

.cele-special .cele-title {
  background: linear-gradient(90deg, #ff6ec7, #ffb86c, #fff48a, #7dffb2, #6ee7ff, #a78bfa, #ff6ec7);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.4;
  padding: 0.1em 0;
  animation: cele-title-in .8s .1s both, cele-hue 3s linear infinite;
}

/* ===== เข้า/ออก ===== */
.cele-enter-active {
  animation: cele-pop .6s cubic-bezier(.2, 1.4, .4, 1);
}

.cele-leave-active {
  transition: opacity .6s, transform .6s;
}

.cele-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(.96);
}

.cele-fade-enter-active {
  transition: opacity .35s;
}

.cele-fade-leave-active {
  transition: opacity .8s;
}

.cele-fade-enter-from,
.cele-fade-leave-to {
  opacity: 0;
}

.cele-flash {
  background: radial-gradient(circle, rgba(244, 63, 94, .55), transparent 70%);
  animation: cele-flash .7s ease-out forwards;
}

body.cele-shake {
  animation: cele-shake .6s linear;
}

@keyframes cele-pop {
  0% {
    opacity: 0;
    transform: scale(.4) translateY(30px) rotate(-3deg);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes cele-title-in {
  0% {
    opacity: 0;
    transform: scale(1.6);
    filter: blur(12px);
  }

  100% {
    opacity: 1;
    transform: none;
    filter: blur(0);
  }
}

@keyframes cele-sheen {
  to {
    transform: translateX(120%);
  }
}

@keyframes cele-pulse {
  50% {
    transform: scale(1.035);
  }
}

@keyframes cele-flash {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes cele-spin {
  to {
    --cele-angle: 360deg;
  }
}

@keyframes cele-hue {
  to {
    background-position: 250% 0;
  }
}

@keyframes cele-rays-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes cele-rays-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes cele-flicker {

  0%,
  100% {
    opacity: 1;
  }

  41% {
    opacity: 1;
  }

  43% {
    opacity: .75;
  }

  45% {
    opacity: 1;
  }

  78% {
    opacity: .85;
  }

  80% {
    opacity: 1;
  }
}

@keyframes cele-shake {

  0%,
  100% {
    transform: none;
  }

  15% {
    transform: translate(-7px, 3px);
  }

  30% {
    transform: translate(7px, -3px);
  }

  45% {
    transform: translate(-5px, -2px);
  }

  60% {
    transform: translate(5px, 2px);
  }

  80% {
    transform: translate(-2px, 1px);
  }
}

@keyframes cele-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes cele-glitch {

  0%,
  88%,
  100% {
    transform: none;
  }

  90% {
    transform: translate(-4px, 1px) skewX(6deg);
  }

  93% {
    transform: translate(4px, -1px) skewX(-6deg);
  }

  96% {
    transform: translate(-2px, 0) skewX(3deg);
  }
}

@media (prefers-reduced-motion: reduce) {

  .cele-banner,
  .cele-banner *,
  .cele-banner::before,
  .cele-banner::after,
  .cele-rays,
  .cele-flash {
    animation: none !important;
  }
}
</style>