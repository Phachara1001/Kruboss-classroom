<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Flame } from '@lucide/vue'
import { recordArcadeScore, getMyBestScores } from '@/data/arcadeGamesStore'
import ArcadeStage from './ArcadeStage.vue'
import ArcadeOverlay from './ArcadeOverlay.vue'

const emit = defineEmits(['score-updated'])

const canvasRef = ref(null)
const isPlaying = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const streak = ref(0)
const soundOn = ref(true)
const newRecordMessage = ref('')

let animationId = null
let audioCtx = null
let bgCanvas = null

// ---------- เสียง ----------
const playSound = (type) => {
  if (!soundOn.value) return
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)()
    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain).connect(audioCtx.destination)

    if (type === 'swish') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(820, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      osc.start(now); osc.stop(now + 0.18)
    } else if (type === 'rim') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(230, now)
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08)
      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
      osc.start(now); osc.stop(now + 0.08)
    } else if (type === 'shoot') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.1)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now); osc.stop(now + 0.1)
    } else if (type === 'miss') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.4)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
      osc.start(now); osc.stop(now + 0.4)
    }
  } catch (e) { /* ไม่รองรับเสียง */ }
}

// ---------- ค่าคงที่ฟิสิกส์ (จูนให้เร็ว กระชับ 60 FPS) ----------
const W = 960
const H = 600
const FLOOR = 500
const GRAVITY = 0.62
const POWER_FACTOR = 0.17
const MAX_DRAG = 190
const MIN_DRAG = 24
const BALL_R = 22
const BALL_START = { x: 150, y: 440 }

const ball = { x: BALL_START.x, y: BALL_START.y, vx: 0, vy: 0, isFlying: false, rotation: 0 }
const aim = { on: false, sx: 0, sy: 0, cx: 0, cy: 0 }
const hoop = { x: 720, y: 230, tx: 720, ty: 230, rimR: 42 }

let floatingTexts = []
let particles = []
let scoredThisShot = false
let basketCount = 0
let netSwing = 0

const myBest = computed(() => getMyBestScores('basketball'))

// ---------- วงจรเกม ----------
function resetBall() {
  ball.x = BALL_START.x
  ball.y = BALL_START.y
  ball.vx = 0
  ball.vy = 0
  ball.isFlying = false
  ball.rotation = 0
  scoredThisShot = false
}

function moveHoopTarget() {
  // ตั้งแต่ลงห่วงครั้งที่ 3 เป็นต้นไป ห่วงจะเปลี่ยนตำแหน่งให้ท้าทายขึ้น
  if (basketCount < 2) return
  let nx, ny
  do {
    nx = 640 + Math.random() * 190
    ny = 170 + Math.random() * 130
  } while (Math.hypot(nx - hoop.x, ny - hoop.y) < 60)
  hoop.tx = nx
  hoop.ty = ny
}

function initGame() {
  score.value = 0
  streak.value = 0
  basketCount = 0
  isGameOver.value = false
  newRecordMessage.value = ''
  floatingTexts = []
  particles = []
  hoop.x = hoop.tx = 720
  hoop.y = hoop.ty = 230
  netSwing = 0
  resetBall()
  isPlaying.value = true
}

async function endGame() {
  if (isGameOver.value) return
  isPlaying.value = false
  isGameOver.value = true
  aim.on = false
  playSound('miss')

  if (score.value > 0) {
    try {
      const res = await recordArcadeScore('basketball', score.value)
      if (res?.isNewWeeklyBest) newRecordMessage.value = 'ทำลายสถิติประจำสัปดาห์ของคุณ!'
      emit('score-updated', { gameId: 'basketball', score: score.value })
    } catch (e) { /* ignore */ }
  }
}

// ---------- อินพุต (เมาส์/ทัช) ----------
function toCanvasPoint(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  // canvas ใช้ object-contain จึงต้องคิด letterbox
  const scale = Math.min(rect.width / W, rect.height / H)
  const offX = (rect.width - W * scale) / 2
  const offY = (rect.height - H * scale) / 2
  return {
    x: (e.clientX - rect.left - offX) / scale,
    y: (e.clientY - rect.top - offY) / scale
  }
}

function onPointerDown(e) {
  if (!isPlaying.value || ball.isFlying) return
  const p = toCanvasPoint(e)
  aim.on = true
  aim.sx = aim.cx = p.x
  aim.sy = aim.cy = p.y
}

function onPointerMove(e) {
  if (!aim.on) return
  const p = toCanvasPoint(e)
  aim.cx = p.x
  aim.cy = p.y
}

function getAimVector() {
  let dx = aim.sx - aim.cx
  let dy = aim.sy - aim.cy
  const len = Math.hypot(dx, dy)
  if (len > MAX_DRAG) {
    dx = (dx / len) * MAX_DRAG
    dy = (dy / len) * MAX_DRAG
  }
  return { dx, dy, len: Math.min(len, MAX_DRAG) }
}

function onPointerUp() {
  if (!aim.on) return
  aim.on = false
  const { dx, dy, len } = getAimVector()
  if (len < MIN_DRAG) return
  ball.vx = dx * POWER_FACTOR
  ball.vy = dy * POWER_FACTOR
  ball.isFlying = true
  playSound('shoot')
}

// ---------- ฟิสิกส์ ----------
function collidePoint(px, py, pr) {
  const dx = ball.x - px
  const dy = ball.y - py
  const dist = Math.hypot(dx, dy)
  const minDist = BALL_R + pr
  if (dist >= minDist || dist === 0) return false
  const nx = dx / dist
  const ny = dy / dist
  ball.x = px + nx * minDist
  ball.y = py + ny * minDist
  const vn = ball.vx * nx + ball.vy * ny
  if (vn < 0) {
    ball.vx -= 1.65 * vn * nx
    ball.vy -= 1.65 * vn * ny
  }
  return true
}

function onBasket() {
  scoredThisShot = true
  basketCount++
  streak.value++
  const points = 2 + Math.min(streak.value - 1, 3)
  score.value += points
  netSwing = 1
  playSound('swish')

  floatingTexts.push({
    text: streak.value > 1 ? `+${points}  STREAK x${streak.value}` : `+${points}  SWISH`,
    x: hoop.x,
    y: hoop.y - 30,
    opacity: 1,
    color: streak.value > 2 ? '#fbbf24' : '#34d399'
  })

  for (let i = 0; i < 18; i++) {
    particles.push({
      x: hoop.x,
      y: hoop.y + 8,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() - 0.9) * 6,
      radius: 2.5 + Math.random() * 3,
      color: ['#fbbf24', '#f59e0b', '#fde68a', '#34d399'][i % 4],
      life: 1
    })
  }
}

function stepBall(dt) {
  const prevY = ball.y
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  ball.vy += GRAVITY * dt
  ball.rotation += ball.vx * 0.03 * dt

  // แป้นกระดาน (ด้านขวาของห่วง)
  const bbX = hoop.x + hoop.rimR + 10
  const bbTop = hoop.y - 100
  const bbBottom = hoop.y + 24
  if (
    ball.x + BALL_R > bbX &&
    ball.x - BALL_R < bbX + 12 &&
    ball.y > bbTop && ball.y < bbBottom &&
    ball.vx > 0
  ) {
    ball.x = bbX - BALL_R
    ball.vx = -ball.vx * 0.6
    playSound('rim')
  }

  // ขอบห่วงหน้า/หลัง
  if (collidePoint(hoop.x - hoop.rimR, hoop.y, 4.5)) playSound('rim')
  if (collidePoint(hoop.x + hoop.rimR, hoop.y, 4.5)) playSound('rim')

  // ลงห่วง: ผ่านเส้นขอบห่วงจากบนลงล่าง
  if (
    !scoredThisShot &&
    ball.vy > 0 &&
    prevY < hoop.y &&
    ball.y >= hoop.y &&
    Math.abs(ball.x - hoop.x) < hoop.rimR - 4
  ) {
    onBasket()
  }
}

function updatePhysics(dt = 1) {
  // เลื่อนห่วงเข้าตำแหน่งใหม่แบบนุ่มนวล
  hoop.x += (hoop.tx - hoop.x) * (0.12 * dt)
  hoop.y += (hoop.ty - hoop.y) * (0.12 * dt)
  netSwing *= Math.pow(0.92, dt)

  if (ball.isFlying) {
    stepBall(0.5 * dt)
    stepBall(0.5 * dt)

    const touchedFloor = ball.vy > 0 && ball.y > FLOOR - BALL_R
    const outOfBounds = ball.x > W + 70 || ball.x < -90

    if (scoredThisShot) {
      // ยิงเข้าแล้ว: พอลูกลอดพ้นตาข่ายเริ่มลูกใหม่ทันใจ ไม่ต้องรอให้ตกลงพื้น
      const clearedNet = ball.y > hoop.y + 70 && ball.vy > 0
      if (clearedNet || touchedFloor || outOfBounds) {
        moveHoopTarget()
        resetBall()
      }
    } else if (touchedFloor || outOfBounds) {
      // พลาด = จบเกม
      endGame()
    }
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i]
    ft.y -= 1.4 * dt
    ft.opacity -= 0.025 * dt
    if (ft.opacity <= 0) floatingTexts.splice(i, 1)
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 0.2 * dt
    p.life -= 0.035 * dt
    if (p.life <= 0) particles.splice(i, 1)
  }
}

// ---------- วาด ----------
function buildBackground() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')

  // ผนังสนาม
  const wall = g.createLinearGradient(0, 0, 0, FLOOR)
  wall.addColorStop(0, '#060a14')
  wall.addColorStop(1, '#16213a')
  g.fillStyle = wall
  g.fillRect(0, 0, W, FLOOR)

  // แสงสปอตไลต์
  for (const lx of [180, 480, 780]) {
    const beam = g.createLinearGradient(lx, 0, lx, FLOOR)
    beam.addColorStop(0, 'rgba(148,197,255,0.16)')
    beam.addColorStop(1, 'rgba(148,197,255,0)')
    g.fillStyle = beam
    g.beginPath()
    g.moveTo(lx - 12, 0)
    g.lineTo(lx + 12, 0)
    g.lineTo(lx + 150, FLOOR)
    g.lineTo(lx - 150, FLOOR)
    g.closePath()
    g.fill()
    g.fillStyle = '#e0f2fe'
    g.beginPath()
    g.arc(lx, 8, 7, 0, Math.PI * 2)
    g.fill()
  }

  // อัฒจันทร์ (แถบจางๆ)
  for (let i = 0; i < 5; i++) {
    g.fillStyle = `rgba(255,255,255,${0.02 + i * 0.008})`
    g.fillRect(0, 300 + i * 38, W, 26)
  }

  // พื้นไม้
  const floor = g.createLinearGradient(0, FLOOR, 0, H)
  floor.addColorStop(0, '#b4691f')
  floor.addColorStop(1, '#5c300f')
  g.fillStyle = floor
  g.fillRect(0, FLOOR, W, H - FLOOR)

  g.strokeStyle = 'rgba(0,0,0,0.18)'
  g.lineWidth = 1
  for (let x = 0; x < W; x += 60) {
    g.beginPath()
    g.moveTo(x, FLOOR)
    g.lineTo(x - (x - W / 2) * 0.25, H)
    g.stroke()
  }

  // เส้นสนาม
  g.strokeStyle = 'rgba(255,255,255,0.55)'
  g.lineWidth = 3
  g.beginPath()
  g.moveTo(0, FLOOR)
  g.lineTo(W, FLOOR)
  g.stroke()
  g.beginPath()
  g.ellipse(W - 120, FLOOR, 290, 60, 0, 0, Math.PI)
  g.stroke()

  return c
}

function drawBall(ctx) {
  ctx.save()
  ctx.translate(ball.x, ball.y)
  ctx.rotate(ball.rotation)
  const grad = ctx.createRadialGradient(-7, -7, 3, 0, 0, BALL_R)
  grad.addColorStop(0, '#fdba74')
  grad.addColorStop(0.55, '#ea580c')
  grad.addColorStop(1, '#9a3412')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, BALL_R, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#3b1405'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.arc(0, 0, BALL_R, 0, Math.PI * 2)
  ctx.moveTo(-BALL_R, 0); ctx.lineTo(BALL_R, 0)
  ctx.moveTo(0, -BALL_R); ctx.lineTo(0, BALL_R)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(-BALL_R * 1.15, 0, BALL_R * 0.9, -0.95, 0.95)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(BALL_R * 1.15, 0, BALL_R * 0.9, Math.PI - 0.95, Math.PI + 0.95)
  ctx.stroke()
  ctx.restore()
}

function drawHoop(ctx) {
  const bbX = hoop.x + hoop.rimR + 10
  const bbTop = hoop.y - 100

  // เสา + ฐาน
  const poleX = bbX + 34
  const pole = ctx.createLinearGradient(poleX, 0, poleX + 14, 0)
  pole.addColorStop(0, '#475569')
  pole.addColorStop(0.5, '#94a3b8')
  pole.addColorStop(1, '#334155')
  ctx.fillStyle = pole
  ctx.fillRect(poleX, bbTop + 40, 14, FLOOR - (bbTop + 40))
  ctx.fillRect(bbX + 12, hoop.y - 6, poleX - bbX - 12, 8)
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(poleX - 22, FLOOR - 10, 58, 12)

  // แป้น
  ctx.fillStyle = 'rgba(186, 230, 253, 0.16)'
  ctx.fillRect(bbX, bbTop, 12, 124)
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 2
  ctx.strokeRect(bbX, bbTop, 12, 124)
  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 2
  ctx.strokeRect(bbX - 1, hoop.y - 50, 8, 44)

  // ตาข่าย
  const sw = netSwing * Math.sin(performance.now() / 55) * 5
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 1.3
  const topL = hoop.x - hoop.rimR + 3
  const topR = hoop.x + hoop.rimR - 3
  const botL = hoop.x - 22 + sw
  const botR = hoop.x + 22 + sw
  const depth = 46
  ctx.beginPath()
  for (let i = 0; i <= 5; i++) {
    const t = i / 5
    ctx.moveTo(topL + (topR - topL) * t, hoop.y)
    ctx.lineTo(botL + (botR - botL) * t, hoop.y + depth)
  }
  for (let j = 1; j <= 3; j++) {
    const t = j / 4
    const yy = hoop.y + depth * t
    const l = topL + (botL - topL) * t
    const r = topR + (botR - topR) * t
    ctx.moveTo(l, yy)
    ctx.lineTo(r, yy)
  }
  ctx.stroke()

  // ขอบห่วง
  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(hoop.x - hoop.rimR, hoop.y)
  ctx.lineTo(hoop.x + hoop.rimR, hoop.y)
  ctx.stroke()
  ctx.lineCap = 'butt'
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)
  if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0)

  drawHoop(ctx)

  // เงาลูกบอล
  const shadowScale = Math.max(0.35, 1 - (FLOOR - ball.y) / 520)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(ball.x, FLOOR + 14, BALL_R * shadowScale * 1.2, 6 * shadowScale, 0, 0, Math.PI * 2)
  ctx.fill()

  // เส้นทางเล็ง
  if (aim.on && isPlaying.value && !ball.isFlying) {
    const { dx, dy, len } = getAimVector()
    if (len >= MIN_DRAG) {
      let sx = ball.x
      let sy = ball.y
      let svx = dx * POWER_FACTOR
      let svy = dy * POWER_FACTOR
      for (let step = 0; step < 56; step++) {
        sx += svx * 0.5
        sy += svy * 0.5
        svy += GRAVITY * 0.5
        if (step % 2 === 0) {
          ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0.12, 0.9 - step * 0.016)})`
          ctx.beginPath()
          ctx.arc(sx, sy, Math.max(2, 5 - step * 0.06), 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    // วงแสดงแรง
    ctx.strokeStyle = 'rgba(253,224,71,0.75)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, BALL_R + 8, -Math.PI / 2, -Math.PI / 2 + (len / MAX_DRAG) * Math.PI * 2)
    ctx.stroke()
  }

  drawBall(ctx)

  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  floatingTexts.forEach(ft => {
    ctx.globalAlpha = Math.max(0, ft.opacity)
    ctx.fillStyle = ft.color
    ctx.font = '800 26px Prompt, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(ft.text, ft.x, ft.y)
  })
  ctx.globalAlpha = 1
}

let lastTime = 0
function gameLoop(timestamp = 0) {
  if (!lastTime) lastTime = timestamp
  const elapsed = timestamp - lastTime
  lastTime = timestamp
  // Normalized 60 FPS delta (16.667ms = 1.0)
  const dt = Math.min(Math.max(elapsed / 16.667, 0.5), 2.0)

  if (isPlaying.value) updatePhysics(dt)
  render()
  animationId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  bgCanvas = buildBackground()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  animationId = requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
})
</script>

<template>
  <ArcadeStage
    title="ชู้ตบาสเกตบอล"
    subtitle="ลากถอยหลังแล้วปล่อยเพื่อยิง · ลงห่วงต่อเนื่องได้แต้มโบนัส · พลาดเมื่อไรจบเกมทันที"
    accent="amber"
    v-model:soundOn="soundOn"
  >
    <template #hud>
      <div class="px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-300/25 flex items-baseline gap-1.5">
        <span class="font-mono font-black text-xl text-amber-300 leading-none">{{ score }}</span>
        <span class="text-[11px] font-bold text-amber-200/80">แต้ม</span>
      </div>
      <div
        v-if="streak > 1"
        class="px-2.5 py-1.5 rounded-xl bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-black flex items-center gap-1"
      >
        <Flame class="w-3.5 h-3.5" /> x{{ streak }}
      </div>
    </template>

    <canvas
      ref="canvasRef"
      :width="W"
      :height="H"
      class="w-full h-full object-contain cursor-crosshair"
      @pointerdown.prevent="onPointerDown"
    />

    <!-- คะแนนตัวใหญ่บนเวที -->
    <div v-if="isPlaying" class="absolute top-4 left-5 pointer-events-none">
      <div class="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">Score</div>
      <div class="font-mono font-black text-5xl sm:text-6xl text-white leading-none drop-shadow-lg">{{ score }}</div>
    </div>

    <ArcadeOverlay
      v-if="!isPlaying && !isGameOver"
      mode="start"
      accent="amber"
      title="Slamshot (ชู้ตบาสเกตบอล)"
      logo="/gameAssets/SlamShot/SLAMSHOT_LOGO.png"
      description="กดค้างที่ไหนก็ได้บนจอ ลากถอยหลังเพื่อเล็งทิศและแรง แล้วปล่อยเพื่อยิง ยิงลงห่วงต่อเนื่องเพื่อเก็บแต้มโบนัส แต่ถ้าพลาดเมื่อไรเกมจบทันที!"
      start-label="เริ่มเกม"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      hint="ตั้งแต่ลงห่วงครั้งที่ 3 ห่วงจะเริ่มเปลี่ยนตำแหน่ง"
      @start="initGame"
    />

    <ArcadeOverlay
      v-if="isGameOver"
      mode="over"
      accent="amber"
      over-title="ลูกบาสพลาดห่วง"
      :score="score"
      unit="แต้ม"
      :new-record="newRecordMessage"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      @start="initGame"
    />
  </ArcadeStage>
</template>
