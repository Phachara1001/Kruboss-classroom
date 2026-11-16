<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Zap } from '@lucide/vue'
import { recordArcadeScore, getMyBestScores } from '@/data/arcadeGamesStore'
import ArcadeStage from './ArcadeStage.vue'
import ArcadeOverlay from './ArcadeOverlay.vue'

const emit = defineEmits(['score-updated'])

const canvasRef = ref(null)
const isPlaying = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const combo = ref(0)
const soundOn = ref(true)
const newRecordMessage = ref('')

let animationId = null
let audioCtx = null

// ---------- เสียง ----------
const playSound = (type, pitch = 1) => {
  if (!soundOn.value) return
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)()
    const now = audioCtx.currentTime

    if (type === 'perfect') {
      ;[523, 659, 784, 1046].forEach((f, i) => {
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(f * pitch, now + i * 0.05)
        gain.gain.setValueAtTime(0.16, now + i * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.12)
        osc.connect(gain).connect(audioCtx.destination)
        osc.start(now + i * 0.05)
        osc.stop(now + i * 0.05 + 0.12)
      })
      return
    }

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain).connect(audioCtx.destination)
    if (type === 'place') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320 * pitch, now)
      osc.frequency.exponentialRampToValueAtTime(440 * pitch, now + 0.1)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now); osc.stop(now + 0.1)
    } else if (type === 'fall') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(250, now)
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
      osc.start(now); osc.stop(now + 0.35)
    }
  } catch (e) { /* ไม่รองรับเสียง */ }
}

// ---------- ค่าเกม ----------
const W = 960
const H = 600
const BLOCK_HEIGHT = 34
const INITIAL_WIDTH = 260
const BASE_Y = H - 90
const PERFECT_TOLERANCE = 6

const PALETTE = [
  '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa',
  '#e879f9', '#f472b6', '#fb7185', '#fb923c', '#fbbf24', '#34d399'
]

let stack = []
let activeBlock = null
let fallingSlices = []
let particles = []
let floatingTexts = []
let cameraY = 0
let targetCameraY = 0
let bgScrollY = 0
const stars = Array.from({ length: 50 }, (_, i) => ({
  x: (i * 197) % W,
  y: (i * 83) % (H * 0.8),
  s: 1 + (i % 3) * 0.6
}))

// ---------- โหลดภาพพื้นหลังแนวนอน เลื่อนตามระดับความสูงของตึก ----------
let bgTowerImg = null

if (typeof window !== 'undefined') {
  bgTowerImg = new Image()
  // ใช้ภาพ SKYSTACKER-BG-High.png ที่มีทั้งระดับเมือง เมฆ และอวกาศ เลื่อนตามความสูง
  bgTowerImg.src = '/gameAssets/Sky Stacker/SKYSTACKER-BG-High.png'
}

const myBest = computed(() => getMyBestScores('tower'))

// ---------- วงจรเกม ----------
function initGame() {
  score.value = 0
  combo.value = 0
  isGameOver.value = false
  newRecordMessage.value = ''
  fallingSlices = []
  particles = []
  floatingTexts = []
  cameraY = 0
  targetCameraY = 0
  bgScrollY = 0

  stack = [{
    x: (W - INITIAL_WIDTH) / 2,
    y: BASE_Y,
    width: INITIAL_WIDTH,
    height: BLOCK_HEIGHT,
    color: '#334155'
  }]

  spawnNextBlock()
  isPlaying.value = true
}

function spawnNextBlock() {
  const prev = stack[stack.length - 1]
  const color = PALETTE[stack.length % PALETTE.length]
  const speed = 6.8 + Math.min(stack.length * 0.35, 7.2)
  const dir = stack.length % 2 === 0 ? 1 : -1

  activeBlock = {
    x: dir === 1 ? -prev.width : W,
    y: prev.y - BLOCK_HEIGHT,
    width: prev.width,
    height: BLOCK_HEIGHT,
    color,
    speed: speed * dir,
    minX: -prev.width - 20,
    maxX: W + 20
  }

  targetCameraY = Math.max(0, (stack.length - 8) * BLOCK_HEIGHT)
}

function addText(text, x, y, color) {
  floatingTexts.push({ text, x, y, color, opacity: 1 })
}

function dropBlock() {
  if (!isPlaying.value || !activeBlock) return

  const prev = stack[stack.length - 1]
  const diff = activeBlock.x - prev.x

  // พลาดสนิท
  if (Math.abs(diff) >= activeBlock.width) {
    fallingSlices.push({
      x: activeBlock.x, y: activeBlock.y,
      width: activeBlock.width, height: BLOCK_HEIGHT,
      color: activeBlock.color,
      vy: 2, vx: activeBlock.speed * 0.4,
      rotation: 0, rotSpeed: 0.05
    })
    activeBlock = null
    endGame()
    return
  }

  if (Math.abs(diff) < PERFECT_TOLERANCE) {
    // วางเป๊ะ
    activeBlock.x = prev.x
    combo.value++
    playSound('perfect', 1 + Math.min(combo.value * 0.1, 0.8))
    addText(combo.value > 1 ? `PERFECT x${combo.value}` : 'PERFECT', W / 2, 110, '#fde047')

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: activeBlock.x + Math.random() * activeBlock.width,
        y: activeBlock.y + BLOCK_HEIGHT / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        radius: 2.5 + Math.random() * 2,
        color: '#fde047',
        life: 1
      })
    }
  } else {
    // ตัดส่วนที่ยื่นเกิน
    combo.value = 0
    playSound('place')

    let newX, newWidth, sliceX, sliceWidth
    if (diff > 0) {
      newX = activeBlock.x
      newWidth = activeBlock.width - diff
      sliceX = activeBlock.x + newWidth
      sliceWidth = diff
    } else {
      newX = prev.x
      newWidth = activeBlock.width + diff
      sliceX = activeBlock.x
      sliceWidth = -diff
    }

    activeBlock.x = newX
    activeBlock.width = newWidth

    fallingSlices.push({
      x: sliceX, y: activeBlock.y,
      width: sliceWidth, height: BLOCK_HEIGHT,
      color: activeBlock.color,
      vy: 2, vx: diff > 0 ? 1.5 : -1.5,
      rotation: 0, rotSpeed: diff > 0 ? 0.04 : -0.04
    })
  }

  stack.push({
    x: activeBlock.x, y: activeBlock.y,
    width: activeBlock.width, height: BLOCK_HEIGHT,
    color: activeBlock.color
  })

  score.value++
  spawnNextBlock()
}

async function endGame() {
  isPlaying.value = false
  isGameOver.value = true
  playSound('fall')

  if (score.value > 0) {
    try {
      const res = await recordArcadeScore('tower', score.value)
      if (res?.isNewWeeklyBest) newRecordMessage.value = 'ทำลายสถิติประจำสัปดาห์ของคุณ!'
      emit('score-updated', { gameId: 'tower', score: score.value })
    } catch (e) { /* ignore */ }
  }
}

function onPointerDown() {
  if (isPlaying.value) dropBlock()
}

function onKeyDown(e) {
  if (e.code !== 'Space') return
  const tag = (e.target?.tagName || '').toLowerCase()
  if (tag === 'input' || tag === 'textarea') return
  e.preventDefault()
  if (isPlaying.value) dropBlock()
  else if (!isGameOver.value) initGame()
}

// ---------- อัปเดต ----------
function update(dt = 1) {
  if (isPlaying.value && activeBlock) {
    activeBlock.x += activeBlock.speed * dt
    if (activeBlock.speed > 0 && activeBlock.x > activeBlock.maxX) {
      activeBlock.speed = -Math.abs(activeBlock.speed)
    } else if (activeBlock.speed < 0 && activeBlock.x < activeBlock.minX) {
      activeBlock.speed = Math.abs(activeBlock.speed)
    }
  }

  // กล้องเคลื่อนที่แบบ Easing นุ่มนวล
  cameraY += (targetCameraY - cameraY) * (0.08 * dt)

  // พื้นหลังเลื่อนตามระดับชั้นแบบ LERP นุ่มนวล ไร้รอยกระตุก
  if (bgTowerImg && bgTowerImg.complete && bgTowerImg.naturalWidth > 0) {
    const scale = W / bgTowerImg.naturalWidth
    const drawH = bgTowerImg.naturalHeight * scale
    const maxScroll = Math.max(0, drawH - H)
    if (maxScroll > 0) {
      const maxClimb = 35 * BLOCK_HEIGHT
      const totalClimb = Math.max(0, (stack.length - 1) * BLOCK_HEIGHT)
      const targetProgress = Math.min(1, totalClimb / maxClimb)
      const targetScroll = targetProgress * maxScroll
      // Damping LERP อัตรา 0.045 ต่อเฟรม ค่อยๆ เลื่อนนุ่มนวลแบบ cinematic
      bgScrollY += (targetScroll - bgScrollY) * (0.045 * dt)
    }
  }

  for (let i = fallingSlices.length - 1; i >= 0; i--) {
    const s = fallingSlices[i]
    s.y += s.vy * dt
    s.x += s.vx * dt
    s.vy += 0.65 * dt
    s.rotation += s.rotSpeed * dt
    if (s.y + cameraY > H + 120) fallingSlices.splice(i, 1)
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.life -= 0.035 * dt
    if (p.life <= 0) particles.splice(i, 1)
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const t = floatingTexts[i]
    t.y -= 1.2 * dt
    t.opacity -= 0.024 * dt
    if (t.opacity <= 0) floatingTexts.splice(i, 1)
  }
}

// ---------- วาด ----------
function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // วาดพื้นหลังแนวนอน เลื่อนตามระดับความสูงของตึก (ตั้งแต่พื้นดิน ➔ เมฆ ➔ อวกาศ) ทั้ง PC และ MB
  if (bgTowerImg && bgTowerImg.complete && bgTowerImg.naturalWidth > 0) {
    const scale = W / bgTowerImg.naturalWidth
    const drawW = W
    const drawH = bgTowerImg.naturalHeight * scale
    const drawY = (H - drawH) + bgScrollY

    ctx.drawImage(bgTowerImg, 0, drawY, drawW, drawH)

    // ฟิลเตอร์ลดความสว่างเล็กน้อย (Dim Overlay 30%) เพื่อให้บล็อกตึกสีนีออนเด่นตา ไม่แสบตา
    ctx.fillStyle = 'rgba(5, 8, 22, 0.30)'
    ctx.fillRect(0, 0, W, H)
  } else {
    // Fallback ระหว่างที่ภาพกำลังโหลด
    const alt = Math.min(1, stack.length / 40)
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    if (alt < 0.4) {
      bg.addColorStop(0, '#0369a1'); bg.addColorStop(1, '#bae6fd')
    } else if (alt < 0.75) {
      bg.addColorStop(0, '#1e1b4b'); bg.addColorStop(1, '#0369a1')
    } else {
      bg.addColorStop(0, '#020617'); bg.addColorStop(1, '#1e1b4b')
    }
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
  }

  // ดวงดาวระยิบระยับเมื่อทะลุถึงชั้นอวกาศ (30+ ชั้น)
  const alt = Math.min(1, stack.length / 40)
  if (alt > 0.75) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.8, (alt - 0.75) * 3.5)})`
    for (const s of stars) ctx.fillRect(s.x, s.y, s.s, s.s)
  }

  // พื้นดิน (เลื่อนตามกล้อง)
  ctx.save()
  ctx.translate(0, cameraY)

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, BASE_Y + BLOCK_HEIGHT, W, 400)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, BASE_Y + BLOCK_HEIGHT, W, 3)

  // ตึกที่ต่อไว้ (วาดเฉพาะที่อยู่ในจอ)
  for (let idx = 0; idx < stack.length; idx++) {
    const b = stack[idx]
    const sy = b.y + cameraY
    if (sy > H + 10 || sy + b.height < -10) continue

    ctx.fillStyle = b.color
    ctx.fillRect(b.x, b.y, b.width, b.height)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillRect(b.x, b.y, b.width, 3)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.fillRect(b.x, b.y + b.height - 4, b.width, 4)

    if (idx > 0 && b.width > 40) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      const n = Math.floor((b.width - 16) / 28)
      for (let w = 0; w < n; w++) {
        ctx.fillRect(b.x + 12 + w * 28, b.y + 9, 14, 16)
      }
    }
  }

  fallingSlices.forEach(s => {
    ctx.save()
    ctx.translate(s.x + s.width / 2, s.y + s.height / 2)
    ctx.rotate(s.rotation)
    ctx.fillStyle = s.color
    ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height)
    ctx.restore()
  })

  if (isPlaying.value && activeBlock) {
    ctx.fillStyle = activeBlock.color
    ctx.fillRect(activeBlock.x, activeBlock.y, activeBlock.width, activeBlock.height)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(activeBlock.x, activeBlock.y, activeBlock.width, 3)

    // เส้นไกด์จางๆ ตามขอบบล็อกล่าสุด
    const prev = stack[stack.length - 1]
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.setLineDash([6, 8])
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y - 400)
    ctx.lineTo(prev.x, prev.y)
    ctx.moveTo(prev.x + prev.width, prev.y - 400)
    ctx.lineTo(prev.x + prev.width, prev.y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
  ctx.restore()

  // ข้อความ PERFECT (พิกัดหน้าจอ)
  floatingTexts.forEach(t => {
    ctx.globalAlpha = Math.max(0, t.opacity)
    ctx.fillStyle = t.color
    ctx.font = '800 34px Prompt, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(t.text, t.x, t.y + 80)
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

  update(dt)
  render()
  animationId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  stack = [{ x: (W - INITIAL_WIDTH) / 2, y: BASE_Y, width: INITIAL_WIDTH, height: BLOCK_HEIGHT, color: '#334155' }]
  window.addEventListener('keydown', onKeyDown)
  animationId = requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <ArcadeStage
    title="ต่อตึกระฟ้า"
    subtitle="แตะหน้าจอ / กด Spacebar เพื่อปล่อยบล็อก · วางให้ตรงเพื่อรักษาความกว้างและรับ PERFECT"
    accent="sky"
    v-model:soundOn="soundOn"
  >
    <template #hud>
      <div class="px-3.5 py-1.5 rounded-xl bg-sky-400/10 border border-sky-300/25 flex items-baseline gap-1.5">
        <span class="font-mono font-black text-xl text-sky-300 leading-none">{{ score }}</span>
        <span class="text-[11px] font-bold text-sky-200/80">ชั้น</span>
      </div>
      <div
        v-if="combo > 1"
        class="px-2.5 py-1.5 rounded-xl bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-black flex items-center gap-1"
      >
        <Zap class="w-3.5 h-3.5" /> PERFECT x{{ combo }}
      </div>
    </template>

    <canvas
      ref="canvasRef"
      :width="W"
      :height="H"
      class="w-full h-full object-contain cursor-pointer"
      @pointerdown.prevent="onPointerDown"
    />

    <div
      v-if="isPlaying"
      class="absolute top-5 inset-x-0 text-center pointer-events-none font-mono font-black text-6xl sm:text-7xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
    >
      {{ score }}
    </div>

    <ArcadeOverlay
      v-if="!isPlaying && !isGameOver"
      mode="start"
      accent="sky"
      title="Sky Stacker (ต่อตึกระฟ้า)"
      logo="/gameAssets/Sky Stacker/SKYSTACKER_LOGO.png"
      description="บล็อกจะเลื่อนไปมา กดปล่อยให้ตกลงบนตึกชั้นล่าง ส่วนที่ยื่นเกินจะถูกตัดทิ้ง วางตรงเป๊ะรับ PERFECT และยิ่งตึกสูง ท้องฟ้ายิ่งเปลี่ยนไปจนถึงอวกาศ"
      start-label="เริ่มต่อตึก"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      @start="initGame"
    />

    <ArcadeOverlay
      v-if="isGameOver"
      mode="over"
      accent="sky"
      over-title="ตึกถล่มแล้ว"
      :score="score"
      unit="ชั้น"
      :new-record="newRecordMessage"
      :best-weekly="myBest.weekly"
      :best-all-time="myBest.allTime"
      @start="initGame"
    />
  </ArcadeStage>
</template>
