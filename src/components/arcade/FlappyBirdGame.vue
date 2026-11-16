<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { recordArcadeScore, getMyBestScores } from '@/data/arcadeGamesStore'
import ArcadeStage from './ArcadeStage.vue'
import ArcadeOverlay from './ArcadeOverlay.vue'

const emit = defineEmits(['score-updated'])

const canvasRef = ref(null)
// idle -> countdown -> playing -> over
const phase = ref('idle')
const countdown = ref(3)
const score = ref(0)
const soundOn = ref(true)
const newRecordMessage = ref('')

let animationId = null
let countdownTimer = null
let audioCtx = null
let bgCanvas = null

// ตัวละคร Flappy (ครูบอสขับเครื่องบิน IT LOEI)
const sprite = new Image()
let spriteReady = false
sprite.onload = () => { spriteReady = true }
sprite.src = `${import.meta.env.BASE_URL}gameAssets/Flappy/flappy-kruboss-256.png`

// ---------- เสียง ----------
const playSound = (type) => {
  if (!soundOn.value) return
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)()
    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain).connect(audioCtx.destination)

    if (type === 'flap') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(380, now)
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09)
      osc.start(now); osc.stop(now + 0.09)
    } else if (type === 'point') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(660, now)
      osc.frequency.setValueAtTime(880, now + 0.07)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now); osc.stop(now + 0.2)
    } else if (type === 'tick') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, now)
      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14)
      osc.start(now); osc.stop(now + 0.14)
    } else if (type === 'go') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(780, now)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now); osc.stop(now + 0.3)
    } else if (type === 'hit') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(190, now)
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now); osc.stop(now + 0.25)
    }
  } catch (e) { /* ไม่รองรับเสียง */ }
}

// ---------- ค่าเกม (จูนให้เร็ว กระชับ 60 FPS สนุกมันส์) ----------
const W = 960
const H = 600
const GROUND_Y = H - 90
const GRAVITY = 0.44
const JUMP_FORCE = -7.4
const MAX_FALL = 10.5
const PIPE_W = 88
const PIPE_GAP = 225
const PIPE_SPACING = 380
const BASE_SPEED = 4.2
const SPRITE_W = 96
const SPRITE_H = Math.round(SPRITE_W * (1241 / 1267))
const HIT_R = 22 // ขอบเขตชนเล็กกว่ารูปจริง เพื่อให้ไม่โหดเกินไป

const bird = { x: 220, y: H / 2, vy: 0, rotation: 0 }
let pipes = []
let particles = []
let clouds = []
let groundOffset = 0
let speed = BASE_SPEED
let tick = 0

const myBest = computed(() => getMyBestScores('flappy'))

// ---------- วงจรเกม ----------
function spawnPipe(x) {
  const minCenter = PIPE_GAP / 2 + 70
  const maxCenter = GROUND_Y - PIPE_GAP / 2 - 70
  const center = minCenter + Math.random() * (maxCenter - minCenter)
  pipes.push({
    x,
    gapTop: center - PIPE_GAP / 2,
    gapBottom: center + PIPE_GAP / 2,
    passed: false
  })
}

function prepareWorld() {
  score.value = 0
  newRecordMessage.value = ''
  particles = []
  pipes = []
  speed = BASE_SPEED
  bird.x = 220
  bird.y = H / 2
  bird.vy = 0
  bird.rotation = 0
  spawnPipe(W + 220)
  spawnPipe(W + 220 + PIPE_SPACING)
  spawnPipe(W + 220 + PIPE_SPACING * 2)
  clouds = [
    { x: 80, y: 90, s: 1.0, v: 0.25 },
    { x: 360, y: 150, s: 0.7, v: 0.18 },
    { x: 620, y: 70, s: 1.2, v: 0.3 },
    { x: 860, y: 170, s: 0.8, v: 0.2 }
  ]
}

function startCountdown() {
  clearInterval(countdownTimer)
  prepareWorld()
  phase.value = 'countdown'
  countdown.value = 3
  playSound('tick')

  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value > 0) {
      playSound('tick')
    } else {
      clearInterval(countdownTimer)
      playSound('go')
      phase.value = 'playing'
      bird.vy = JUMP_FORCE * 0.75
    }
  }, 550)
}

function flap() {
  if (phase.value !== 'playing') return
  bird.vy = JUMP_FORCE
  playSound('flap')
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: bird.x - 40,
      y: bird.y + 6 + (Math.random() - 0.5) * 8,
      vx: -1.2 - Math.random() * 1.6,
      vy: (Math.random() - 0.5) * 1.2,
      size: 4 + Math.random() * 4,
      color: '255,255,255',
      life: 0.8
    })
  }
}

async function endGame() {
  if (phase.value !== 'playing') return
  phase.value = 'over'
  playSound('hit')

  for (let i = 0; i < 22; i++) {
    particles.push({
      x: bird.x,
      y: bird.y,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.5) * 9,
      size: 3 + Math.random() * 4,
      color: i % 2 ? '250,204,21' : '255,255,255',
      life: 1
    })
  }

  if (score.value > 0) {
    try {
      const res = await recordArcadeScore('flappy', score.value)
      if (res?.isNewWeeklyBest) newRecordMessage.value = 'ทำลายสถิติประจำสัปดาห์ของคุณ!'
      emit('score-updated', { gameId: 'flappy', score: score.value })
    } catch (e) { /* ignore */ }
  }
}

function onPointerDown() {
  flap()
}

function onKeyDown(e) {
  if (e.code !== 'Space' && e.code !== 'ArrowUp') return
  const tag = (e.target?.tagName || '').toLowerCase()
  if (tag === 'input' || tag === 'textarea') return
  e.preventDefault()
  if (phase.value === 'playing') flap()
  else if (phase.value === 'idle' || phase.value === 'over') startCountdown()
}

// ---------- อัปเดต ----------
function update(dt = 1) {
  tick += dt
  groundOffset = (groundOffset + (phase.value === 'over' ? 0 : speed * dt)) % 32

  clouds.forEach(c => {
    c.x -= c.v * dt
    if (c.x < -140) c.x = W + 100
  })

  if (phase.value === 'countdown') {
    // ลอยเตรียมพร้อม
    bird.y = H / 2 + Math.sin(tick / 14) * 10
    bird.rotation = Math.sin(tick / 14) * 0.05
  }

  if (phase.value === 'playing') {
    speed = BASE_SPEED + Math.min(score.value * 0.04, 1.6)

    bird.vy = Math.min(bird.vy + GRAVITY * dt, MAX_FALL)
    bird.y += bird.vy * dt
    bird.rotation = Math.max(-0.4, Math.min(0.65, bird.vy * 0.08))

    if (bird.y - HIT_R < 0) {
      bird.y = HIT_R
      bird.vy = Math.max(bird.vy, 0)
    }
    if (bird.y + HIT_R >= GROUND_Y) {
      bird.y = GROUND_Y - HIT_R
      endGame()
      return
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i]
      p.x -= speed * dt

      if (!p.passed && p.x + PIPE_W < bird.x - HIT_R) {
        p.passed = true
        score.value++
        playSound('point')
      }

      if (bird.x + HIT_R > p.x && bird.x - HIT_R < p.x + PIPE_W) {
        if (bird.y - HIT_R < p.gapTop || bird.y + HIT_R > p.gapBottom) {
          endGame()
          return
        }
      }

      if (p.x + PIPE_W < -40) pipes.splice(i, 1)
    }

    const last = pipes[pipes.length - 1]
    if (!last || last.x < W) spawnPipe((last ? last.x : W) + PIPE_SPACING)

    // ควันท้ายเครื่อง
    if (Math.floor(tick) % 4 === 0) {
      particles.push({
        x: bird.x - 44,
        y: bird.y + 10,
        vx: -2.0 - Math.random() * 2.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 4 + Math.random() * 4,
        color: '255,255,255',
        life: 0.7
      })
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]
    pt.x += pt.vx * dt
    pt.y += pt.vy * dt
    pt.life -= 0.035 * dt
    if (pt.life <= 0) particles.splice(i, 1)
  }
}

// ---------- วาด ----------
function buildBackground() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')

  const sky = g.createLinearGradient(0, 0, 0, GROUND_Y)
  sky.addColorStop(0, '#0b3b7a')
  sky.addColorStop(0.55, '#2b8be0')
  sky.addColorStop(1, '#bfe6ff')
  g.fillStyle = sky
  g.fillRect(0, 0, W, GROUND_Y)

  // ดวงอาทิตย์
  const sun = g.createRadialGradient(780, 150, 10, 780, 150, 170)
  sun.addColorStop(0, 'rgba(255,244,200,0.95)')
  sun.addColorStop(0.25, 'rgba(255,230,150,0.35)')
  sun.addColorStop(1, 'rgba(255,230,150,0)')
  g.fillStyle = sun
  g.fillRect(0, 0, W, GROUND_Y)

  // เทือกเขาไกลๆ
  g.fillStyle = 'rgba(30, 90, 140, 0.35)'
  g.beginPath()
  g.moveTo(0, GROUND_Y)
  for (let x = 0; x <= W; x += 40) {
    g.lineTo(x, GROUND_Y - 70 - Math.sin(x / 90) * 28 - Math.sin(x / 37) * 10)
  }
  g.lineTo(W, GROUND_Y)
  g.closePath()
  g.fill()

  g.fillStyle = 'rgba(20, 110, 90, 0.45)'
  g.beginPath()
  g.moveTo(0, GROUND_Y)
  for (let x = 0; x <= W; x += 30) {
    g.lineTo(x, GROUND_Y - 32 - Math.sin(x / 60 + 2) * 16)
  }
  g.lineTo(W, GROUND_Y)
  g.closePath()
  g.fill()

  return c
}

function drawCloud(ctx, c) {
  const r = 26 * c.s
  ctx.fillStyle = `rgba(255,255,255,${0.55 + c.s * 0.15})`
  ctx.beginPath()
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2)
  ctx.arc(c.x + r * 1.1, c.y - r * 0.4, r * 1.2, 0, Math.PI * 2)
  ctx.arc(c.x + r * 2.3, c.y, r, 0, Math.PI * 2)
  ctx.rect(c.x, c.y, r * 2.3, r)
  ctx.fill()
}

function drawPipe(ctx, p) {
  const capH = 30
  const capX = p.x - 7
  const capW = PIPE_W + 14

  const drawBody = (y, h) => {
    ctx.fillStyle = '#15803d'
    ctx.fillRect(p.x, y, PIPE_W, h)
    ctx.fillStyle = 'rgba(134, 239, 172, 0.45)'
    ctx.fillRect(p.x + 8, y, 10, h)
    ctx.fillStyle = 'rgba(2, 44, 22, 0.35)'
    ctx.fillRect(p.x + PIPE_W - 16, y, 16, h)
  }
  const drawCap = (y) => {
    ctx.fillStyle = '#16a34a'
    ctx.fillRect(capX, y, capW, capH)
    ctx.fillStyle = 'rgba(187, 247, 208, 0.5)'
    ctx.fillRect(capX + 6, y + 4, 10, capH - 8)
    ctx.fillStyle = 'rgba(2, 44, 22, 0.3)'
    ctx.fillRect(capX + capW - 14, y, 14, capH)
    ctx.strokeStyle = '#052e16'
    ctx.lineWidth = 3
    ctx.strokeRect(capX, y, capW, capH)
  }

  // ท่อบน
  drawBody(0, p.gapTop - capH)
  drawCap(p.gapTop - capH)
  // ท่อล่าง
  drawBody(p.gapBottom + capH, GROUND_Y - p.gapBottom - capH)
  drawCap(p.gapBottom)
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0)
  clouds.forEach(c => drawCloud(ctx, c))

  pipes.forEach(p => drawPipe(ctx, p))

  // พื้นดิน
  ctx.fillStyle = '#4d7c0f'
  ctx.fillRect(0, GROUND_Y, W, 16)
  ctx.fillStyle = '#65a30d'
  for (let gx = -groundOffset; gx < W; gx += 32) {
    ctx.fillRect(gx, GROUND_Y, 16, 16)
  }
  ctx.fillStyle = '#78350f'
  ctx.fillRect(0, GROUND_Y + 16, W, H - GROUND_Y - 16)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  for (let gx = -groundOffset * 1.0; gx < W; gx += 64) {
    ctx.fillRect(gx + 10, GROUND_Y + 40, 26, 6)
    ctx.fillRect(gx + 40, GROUND_Y + 62, 18, 6)
  }

  // ควัน/อนุภาค
  particles.forEach(pt => {
    ctx.fillStyle = `rgba(${pt.color},${Math.max(0, pt.life)})`
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
    ctx.fill()
  })

  // ตัวละคร
  ctx.save()
  ctx.translate(bird.x, bird.y)
  ctx.rotate(bird.rotation)
  if (spriteReady) {
    ctx.drawImage(sprite, -SPRITE_W / 2, -SPRITE_H / 2 - 4, SPRITE_W, SPRITE_H)
  } else {
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(0, 0, HIT_R, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

let lastTime = 0
function gameLoop(timestamp = 0) {
  if (!lastTime) lastTime = timestamp
  const elapsed = timestamp - lastTime
  lastTime = timestamp
  // Normalized 60 FPS delta (16.667ms = 1.0)
  const dt = Math.min(Math.max(elapsed / 16.667, 0.5), 2.0)

  update(dt)
  render()
  animationId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  bgCanvas = buildBackground()
  prepareWorld()
  window.addEventListener('keydown', onKeyDown)
  animationId = requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  clearInterval(countdownTimer)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <ArcadeStage
    title="Flappy Kruboss"
    subtitle="แตะหน้าจอ / กด Spacebar เพื่อบินขึ้น · บินลอดช่องท่อให้ได้มากที่สุด"
    accent="emerald"
    v-model:soundOn="soundOn"
  >
    <template #hud>
      <div class="px-3.5 py-1.5 rounded-xl bg-emerald-400/10 border border-emerald-300/25 flex items-baseline gap-1.5">
        <span class="font-mono font-black text-xl text-emerald-300 leading-none">{{ score }}</span>
        <span class="text-[11px] font-bold text-emerald-200/80">คะแนน</span>
      </div>
    </template>

    <canvas
      ref="canvasRef"
      :width="W"
      :height="H"
      class="w-full h-full object-contain cursor-pointer"
      @pointerdown.prevent="onPointerDown"
    />

    <!-- คะแนนตัวใหญ่กลางจอ -->
    <div
      v-if="phase === 'playing'"
      class="absolute top-5 inset-x-0 text-center pointer-events-none font-mono font-black text-6xl sm:text-7xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
    >
      {{ score }}
    </div>

    <ArcadeOverlay
      v-if="phase === 'idle'"
      mode="start"
      accent="emerald"
      title="Flappy Kruboss"
      logo="/gameAssets/Flappy/FLAPPY_LOGO.png"
      description="ควบคุมครูบอสบินฝ่าช่องท่อ แตะหน้าจอหรือกด Spacebar เพื่อบินขึ้น ปล่อยให้ตกเพื่อลดระดับ บินผ่านท่อแต่ละคู่ได้ 1 คะแนน ช่องกว้างและเล่นง่าย!"
      start-label="เริ่มเกม"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      hint="เมื่อกดเริ่มจะมีการนับถอยหลัง 3 วินาทีก่อนเริ่มบิน"
      @start="startCountdown"
    />

    <ArcadeOverlay
      v-else-if="phase === 'countdown'"
      mode="countdown"
      accent="emerald"
      :count="countdown"
    />

    <ArcadeOverlay
      v-else-if="phase === 'over'"
      mode="over"
      accent="emerald"
      over-title="ชนสิ่งกีดขวาง"
      :score="score"
      unit="คะแนน"
      :new-record="newRecordMessage"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      @start="startCountdown"
    />
  </ArcadeStage>
</template>
