<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Laptop, ExternalLink, CheckCircle, Globe, ShieldCheck, Code2, Cpu,
  MousePointerClick, Cable, FileCode2, Play, Lightbulb,
  AlertTriangle, Zap, ToggleRight, SlidersHorizontal, LayoutGrid, Terminal,
  Info, Book, FileText, Target, Award, Layers, Sliders, Radio,
  RefreshCw, Gamepad2, ListOrdered, ChevronRight,
  Activity, ArrowDownToLine, ArrowUpFromLine,
  Trophy, PlayCircle, StopCircle, Copy, Check,
  Sparkles, RotateCw, ArrowRight, ArrowLeft, Boxes, BookOpen,
  ToggleLeft, GitCommit, SlidersVertical, HelpCircle, CheckCircle2, XCircle
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 4
const showTeacherModal = ref(false)
const router = useRouter()

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกโครงสร้าง For Loop & หน้าที่ปุ่มกด 2 ปุ่ม)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่โค้ด For Loop, Array และ State Machine)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 4 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
]

onMounted(() => {
  fetchGameScores(currentCourseId, currentWeek)
})

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')
const isTeacher = computed(() => isTeacherUser(authUser.value))

const studentWeekScores = computed(() => {
  if (!currentStudentId.value) return {}
  const key = `${currentCourseId}_${currentWeek}_${currentStudentId.value}`
  return gameScoresStore.value[key]?.scores || {}
})

const studentNorm = computed(() => {
  return calculateNormalizedScore(studentWeekScores.value, weekGames)
})

// Copy code helper
const copiedKey = ref('')
const copyCode = (key, text) => {
  navigator.clipboard.writeText(text)
  copiedKey.value = key
  setTimeout(() => {
    copiedKey.value = ''
  }, 2000)
}

// ============================================================================
// INTERACTIVE FOR LOOP STEP-BY-STEP VISUALIZER (SECTION 1)
// ============================================================================
const loopTargetMax = ref(4)
const loopCurrentI = ref(-1) // -1 = not started, 0..5 = active iteration, 99 = finished
const loopPhase = ref('idle') // 'idle' | 'init' | 'check_true' | 'body' | 'update' | 'check_false'
const loopLogs = ref([
  'พร้อมจำลองการทำงานของคำสั่ง for (int i = 0; i < targetLeds; i++)'
])

const resetLoopStepper = () => {
  loopCurrentI.value = -1
  loopPhase.value = 'idle'
  loopLogs.value = [
    `รีเซ็ตตัวจำลองแล้ว: กำหนดค่า targetLeds = ${loopTargetMax.value} ดวง`
  ]
}

const nextLoopStep = () => {
  if (loopPhase.value === 'idle' || loopPhase.value === 'check_false') {
    loopCurrentI.value = 0
    loopPhase.value = 'init'
    loopLogs.value.unshift(`[Step 1: Initialization] กำหนดค่าเริ่มต้น int i = 0 (ทำแค่ครั้งเดียวตอนเริ่มลูป)`)
    return
  }

  if (loopPhase.value === 'init' || loopPhase.value === 'update') {
    if (loopCurrentI.value < loopTargetMax.value) {
      loopPhase.value = 'check_true'
      loopLogs.value.unshift(`[Step 2: Condition] ตรวจสอบ i < ${loopTargetMax.value} (${loopCurrentI.value} < ${loopTargetMax.value}) ➔ เป็นจริง (TRUE) เข้าสู่ปีกกา`)
    } else {
      loopPhase.value = 'check_false'
      loopLogs.value.unshift(`[Step 2: Condition] ตรวจสอบ i < ${loopTargetMax.value} (${loopCurrentI.value} < ${loopTargetMax.value}) ➔ เป็นเท็จ (FALSE) จบลูปทันที!`)
    }
    return
  }

  if (loopPhase.value === 'check_true') {
    loopPhase.value = 'body'
    loopLogs.value.unshift(`[Step 3: Loop Body] สั่งไฟ LED ดวงที่ ${loopCurrentI.value + 1} (Pin ${loopCurrentI.value + 2}) ติดสว่าง ➔ หน่วงเวลา ➔ สั่งดับ`)
    return
  }

  if (loopPhase.value === 'body') {
    loopCurrentI.value += 1
    loopPhase.value = 'update'
    loopLogs.value.unshift(`[Step 4: Update] เพิ่มค่ารอบด้วยคำสั่ง i++ ➔ ตอนนี้ i กลายเป็น ${loopCurrentI.value}`)
    return
  }
}

// ============================================================================
// 6 LEDs Configurations (6 distinct colors - Red, Yellow, Green, Blue, Orange, Purple)
// ============================================================================
const ledConfigs = [
  {
    idx: 1,
    pin: 2,
    colorName: 'สีแดง',
    colorEn: 'Red',
    onBulb: 'bg-red-500 border-red-200 text-white shadow-[0_0_35px_rgba(239,68,68,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-red-950/70 border-red-800/60 text-red-500/70',
    haloColor: 'bg-red-500/40',
    textColor: 'text-red-400',
    dotBg: 'bg-red-500'
  },
  {
    idx: 2,
    pin: 3,
    colorName: 'สีเหลือง',
    colorEn: 'Yellow',
    onBulb: 'bg-yellow-400 border-amber-100 text-stone-950 shadow-[0_0_35px_rgba(250,204,21,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-yellow-950/70 border-yellow-800/60 text-yellow-500/70',
    haloColor: 'bg-yellow-400/40',
    textColor: 'text-yellow-400',
    dotBg: 'bg-yellow-400'
  },
  {
    idx: 3,
    pin: 4,
    colorName: 'สีเขียว',
    colorEn: 'Green',
    onBulb: 'bg-emerald-400 border-emerald-100 text-stone-950 shadow-[0_0_35px_rgba(52,211,153,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-500/70',
    haloColor: 'bg-emerald-500/40',
    textColor: 'text-emerald-400',
    dotBg: 'bg-emerald-400'
  },
  {
    idx: 4,
    pin: 5,
    colorName: 'สีน้ำเงิน',
    colorEn: 'Blue',
    onBulb: 'bg-sky-400 border-sky-100 text-stone-950 shadow-[0_0_35px_rgba(56,189,248,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-sky-950/70 border-sky-800/60 text-sky-500/70',
    haloColor: 'bg-sky-500/40',
    textColor: 'text-sky-400',
    dotBg: 'bg-sky-400'
  },
  {
    idx: 5,
    pin: 6,
    colorName: 'สีส้ม',
    colorEn: 'Orange',
    onBulb: 'bg-orange-500 border-orange-200 text-white shadow-[0_0_35px_rgba(249,115,22,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-orange-950/70 border-orange-800/60 text-orange-500/70',
    haloColor: 'bg-orange-500/40',
    textColor: 'text-orange-400',
    dotBg: 'bg-orange-500'
  },
  {
    idx: 6,
    pin: 7,
    colorName: 'สีม่วง',
    colorEn: 'Purple',
    onBulb: 'bg-purple-500 border-purple-200 text-white shadow-[0_0_35px_rgba(168,85,247,0.95),0_0_15px_#ffffff]',
    offBulb: 'bg-purple-950/70 border-purple-800/60 text-purple-500/70',
    haloColor: 'bg-purple-500/40',
    textColor: 'text-purple-400',
    dotBg: 'bg-purple-500'
  }
]

// ============================================================================
// TOPIC 3: INTERACTIVE 6-LED FOR LOOP DEMONSTRATOR (สาธิตไฟ 6 ดวงล้วนๆ)
// ============================================================================
const demoPattern = ref('forward') // 'forward' | 'backward' | 'pingpong' | 'stack'
const demoIsRunning = ref(false)
const demoActiveIndex = ref(-1)
const demoStacked = ref([false, false, false, false, false, false])
const demoCurrentI = ref(null)
const demoSpeedMs = ref(250)
let demoTimer = null

const runDemoForward = (i = 0) => {
  if (!demoIsRunning.value) return
  if (i < 6) {
    demoCurrentI.value = i
    demoActiveIndex.value = i
    demoTimer = setTimeout(() => {
      runDemoForward(i + 1)
    }, demoSpeedMs.value)
  } else {
    demoActiveIndex.value = -1
    demoTimer = setTimeout(() => {
      if (demoIsRunning.value) runDemoForward(0)
    }, demoSpeedMs.value)
  }
}

const runDemoBackward = (i = 5) => {
  if (!demoIsRunning.value) return
  if (i >= 0) {
    demoCurrentI.value = i
    demoActiveIndex.value = i
    demoTimer = setTimeout(() => {
      runDemoBackward(i - 1)
    }, demoSpeedMs.value)
  } else {
    demoActiveIndex.value = -1
    demoTimer = setTimeout(() => {
      if (demoIsRunning.value) runDemoBackward(5)
    }, demoSpeedMs.value)
  }
}

let pingpongDir = 1
const runDemoPingpong = (i = 0) => {
  if (!demoIsRunning.value) return
  demoCurrentI.value = i
  demoActiveIndex.value = i
  demoTimer = setTimeout(() => {
    let nextI = i + pingpongDir
    if (nextI > 5) {
      pingpongDir = -1
      nextI = 4
    } else if (nextI < 0) {
      pingpongDir = 1
      nextI = 1
    }
    runDemoPingpong(nextI)
  }, demoSpeedMs.value)
}

const runDemoStack = (i = 0) => {
  if (!demoIsRunning.value) return
  if (i < 6) {
    demoCurrentI.value = i
    demoStacked.value[i] = true
    demoTimer = setTimeout(() => {
      runDemoStack(i + 1)
    }, demoSpeedMs.value)
  } else {
    demoTimer = setTimeout(() => {
      demoStacked.value = [false, false, false, false, false, false]
      if (demoIsRunning.value) runDemoStack(0)
    }, demoSpeedMs.value * 2)
  }
}

const startDemo = () => {
  if (demoIsRunning.value) return
  demoIsRunning.value = true
  if (demoPattern.value === 'forward') runDemoForward(0)
  else if (demoPattern.value === 'backward') runDemoBackward(5)
  else if (demoPattern.value === 'pingpong') { pingpongDir = 1; runDemoPingpong(0) }
  else if (demoPattern.value === 'stack') {
    demoStacked.value = [false, false, false, false, false, false]
    runDemoStack(0)
  }
}

const pauseDemo = () => {
  if (demoTimer) clearTimeout(demoTimer)
  demoIsRunning.value = false
}

const resetDemo = () => {
  pauseDemo()
  demoActiveIndex.value = -1
  demoCurrentI.value = null
  demoStacked.value = [false, false, false, false, false, false]
}

const changeDemoPattern = (pat) => {
  pauseDemo()
  demoPattern.value = pat
  resetDemo()
  startDemo()
}

// ============================================================================
// INTERACTIVE 2-BUTTON + 6-LED SIMULATOR (ASSIGNMENT 4 PREVIEW & VALIDATION)
// ============================================================================
const simLedCount = ref(1) // ตั้งค่าเริ่มต้น 1 ดวง (1 - 6)
const simActiveLedIndex = ref(-1) // -1 = ปิดทุกดวง, 0..5 = ดวงที่กำลังติด
const simLoopVarI = ref(null)
const simIsRunning = ref(false)
const simBtn1Pressed = ref(false)
const simBtn2Pressed = ref(false)
const simSpeedMs = ref(300)
let simTimer = null

const simSerialLines = ref([
  { time: '00:00.0', type: 'sys', text: '=== System Ready: ตั้งค่าเริ่มต้นไฟวิ่ง = 1 ดวง ===' },
  { time: '00:00.1', type: 'info', text: 'กดปุ่ม 1 (Pin 8) เพื่อตั้งจำนวนไฟ | กดปุ่ม 2 (Pin 9) เพื่อสั่งไฟวิ่ง 1 รอบ' }
])

const getNowStamp = () => {
  const d = new Date()
  const s = String(d.getSeconds()).padStart(2, '0')
  const ms = Math.floor(d.getMilliseconds() / 100)
  return `00:${s}.${ms}`
}

const addSimSerial = (text, type = 'info') => {
  simSerialLines.value.unshift({
    time: getNowStamp(),
    type,
    text
  })
  if (simSerialLines.value.length > 25) {
    simSerialLines.value.pop()
  }
}

// ปุ่มที่ 1: ตั้งค่าจำนวนไฟวิ่ง (1 - 6 ดวง) แสดงค่าผ่าน Serial
const pressSetupButton = () => {
  if (simIsRunning.value) {
    addSimSerial('! รอให้ไฟวิ่งครบรอบก่อนจึงจะเปลี่ยนค่าได้ (Blocking For Loop)', 'warn')
    return
  }
  simBtn1Pressed.value = true
  setTimeout(() => { simBtn1Pressed.value = false }, 180)

  simLedCount.value = (simLedCount.value % 6) + 1
  addSimSerial(`>> [BUTTON 1 - SETUP] ตั้งค่าจำนวนไฟวิ่ง = ${simLedCount.value} ดวง`, 'set')
}

// ปุ่มที่ 2: กดเล่น (Play) ให้ไฟวิ่งตามที่ตั้งค่าไว้ 1 รอบ
const pressPlayButton = () => {
  if (simIsRunning.value) return
  simBtn2Pressed.value = true
  setTimeout(() => { simBtn2Pressed.value = false }, 180)

  simIsRunning.value = true
  const target = simLedCount.value
  addSimSerial(`>> [BUTTON 2 - PLAY] เริ่มรัน For Loop วิ่งไฟจำนวน ${target} ดวง (1 รอบ)...`, 'play')

  let i = 0
  const runStep = () => {
    if (i < target) {
      simLoopVarI.value = i
      simActiveLedIndex.value = i
      addSimSerial(`   [For Loop] รอบ i = ${i} -> เปิดไฟ LED ดวงที่ ${i + 1} (Pin ${i + 2})`, 'loop')
      i++
      simTimer = setTimeout(runStep, simSpeedMs.value)
    } else {
      simLoopVarI.value = target
      simActiveLedIndex.value = -1
      simIsRunning.value = false
      addSimSerial(`>> [DONE] จบลูป (i = ${target} ไม่น้อยกว่า ${target}) วิ่งครบ 1 รอบแล้ว!`, 'sys')
    }
  }

  runStep()
}

const resetSimulator = () => {
  if (simTimer) clearTimeout(simTimer)
  simIsRunning.value = false
  simActiveLedIndex.value = -1
  simLoopVarI.value = null
  simLedCount.value = 1
  simSerialLines.value = [
    { time: getNowStamp(), type: 'sys', text: '=== รีเซ็ตระบบ: ตั้งค่าเริ่มต้นไฟวิ่ง = 1 ดวง ===' }
  ]
}

onUnmounted(() => {
  if (simTimer) clearTimeout(simTimer)
  if (demoTimer) clearTimeout(demoTimer)
})

// ============================================================================
// CODE SNIPPETS FOR LESSON (HARDCODE VS FOR LOOP & DEMO 6 LEDS)
// ============================================================================
const hardcodePinModeCode = `// [Hardcode] กำหนดโหมดขาไฟ LED 6 ขาแบบพิมพ์ทีละบรรทัด
void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
}`

const forLoopPinModeCode = `// [For Loop] กำหนดโหมดขาไฟ LED 6 ขาด้วยคำสั่งวนซ้ำเพียง 3 บรรทัด
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

void setup() {
  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}`

const hardcodeRunCode = `// [Hardcode] สั่งไฟ LED 6 ดวงติด-ดับไล่ทีละดวง (ยาว 18 บรรทัด และปรับจำนวนดวงไม่ได้)
void loop() {
  digitalWrite(2, HIGH); delay(200); digitalWrite(2, LOW);
  digitalWrite(3, HIGH); delay(200); digitalWrite(3, LOW);
  digitalWrite(4, HIGH); delay(200); digitalWrite(4, LOW);
  digitalWrite(5, HIGH); delay(200); digitalWrite(5, LOW);
  digitalWrite(6, HIGH); delay(200); digitalWrite(6, LOW);
  digitalWrite(7, HIGH); delay(200); digitalWrite(7, LOW);
}`

const forLoopRunCode = `// [For Loop] สั่งไฟ LED 6 ดวงติด-ดับไล่ทีละดวง (สั้น กระชับ ควบคุมง่าย)
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

void loop() {
  for (int i = 0; i < 6; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(200);
    digitalWrite(ledPins[i], LOW);
  }
}`

const demo6LedForwardCode = `// สาธิตที่ 1: ไฟวิ่งซ้ายไปขวา (Digital Pin 2 ถึง 7)
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

void setup() {
  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }
}

void loop() {
  // วิ่งจากดวงที่ 0 ถึง 5 (Pin 2 ถึง 7)
  for (int i = 0; i < 6; i++) {
    digitalWrite(ledPins[i], HIGH); // เปิดไฟดวงที่ i
    delay(250);                     // หน่วงเวลา
    digitalWrite(ledPins[i], LOW);  // ปิดไฟดวงที่ i
  }
}`

const demo6LedBounceCode = `// สาธิตที่ 2: ไฟวิ่งไป-กลับ (Knight Rider / Ping-pong)
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

void setup() {
  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  // ขาไป: ซ้ายไปขวา (ดวงที่ 0 -> 5)
  for (int i = 0; i < 6; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(150);
    digitalWrite(ledPins[i], LOW);
  }

  // ขากลับ: ขวามาซ้าย (ดวงที่ 4 -> 1)
  for (int i = 4; i > 0; i--) {
    digitalWrite(ledPins[i], HIGH);
    delay(150);
    digitalWrite(ledPins[i], LOW);
  }
}`

const demo6LedStackCode = `// สาธิตที่ 3: ไฟติดสะสมทีละดวงจนเต็มบาร์ แล้วดับพร้อมกัน (Bar Graph)
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

void setup() {
  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  // สั่งติดสะสมทีละดวง
  for (int i = 0; i < 6; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(200);
  }

  delay(600); // ติดค้างไว้ครู่หนึ่ง

  // สั่งดับทุกดวงพร้อมกันด้วย For loop
  for (int i = 0; i < 6; i++) {
    digitalWrite(ledPins[i], LOW);
  }

  delay(400);
}
`

const fourLoopPatternsCode = `// รูปแบบที่ 1: วิ่งจากซ้ายไปขวา (0 ถึง 5)
for (int i = 0; i < 6; i++) {
  digitalWrite(ledPins[i], HIGH);
  delay(250);
  digitalWrite(ledPins[i], LOW);
}

// รูปแบบที่ 2: วิ่งย้อนกลับจากขวาไปซ้าย (5 ลงมา 0: i--)
for (int i = 5; i >= 0; i--) {
  digitalWrite(ledPins[i], HIGH);
  delay(250);
  digitalWrite(ledPins[i], LOW);
}

// รูปแบบที่ 3: วิ่งสเต็ปข้ามทีละ 2 ดวง (i += 2)
for (int i = 0; i < 6; i += 2) {
  digitalWrite(ledPins[i], HIGH);
  delay(250);
  digitalWrite(ledPins[i], LOW);
}

// รูปแบบที่ 4: สั่งดับไฟทุกดวงพร้อมกัน (เคลียร์สถานะ)
for (int i = 0; i < 6; i++) {
  digitalWrite(ledPins[i], LOW);
}`

const fullWorkshopCode = `// ============================================================================
// สัปดาห์ที่ 4: ระบบตั้งค่าและสั่งเล่นไฟวิ่ง LED 6 ดวง ด้วยปุ่มกด 2 ปุ่ม (State + For Loop)
// - ปุ่มที่ 1 (Pin 8): กดเพื่อตั้งค่าจำนวนไฟที่จะวิ่ง (1 - 6 ดวง) แสดงผลทาง Serial Monitor
// - ปุ่มที่ 2 (Pin 9): กดเพื่อสั่งให้ไฟวิ่งตามจำนวนที่ตั้งค่าไว้ 1 รอบ ด้วยคำสั่ง For Loop
// ============================================================================

// 1. กำหนดขาพินของไฟ LED ทั้ง 6 ดวง (เก็บใน Array เพื่อใช้คู่กับ For Loop)
const int ledPins[6] = {2, 3, 4, 5, 6, 7};

// 2. กำหนดขาพินของสวิตช์ปุ่มกดทั้ง 2 ปุ่ม
const int BTN_SET_PIN  = 8; // ปุ่มที่ 1: ปุ่มตั้งค่าจำนวนไฟ (Setup Button)
const int BTN_PLAY_PIN = 9; // ปุ่มที่ 2: ปุ่มสั่งเล่นไฟวิ่ง 1 รอบ (Play Button)

// 3. ตัวแปร State สำหรับเก็บจำนวนไฟที่ตั้งค่าไว้ และจำสถานะปุ่มกดรอบก่อนหน้า
int ledCount = 1;           // เริ่มต้นตั้งค่าให้ไฟวิ่ง 1 ดวง (ปรับได้ 1 ถึง 6)
int lastBtnSetState  = HIGH; // จำสถานะปุ่มตั้งค่ารอบก่อนหน้า (ตรวจจับ Falling Edge)
int lastBtnPlayState = HIGH; // จำสถานะปุ่มเล่นรอบก่อนหน้า (ตรวจจับ Falling Edge)

void setup() {
  // เปิดพอร์ตสื่อสาร Serial Monitor ที่ความเร็ว 9600 baud
  Serial.begin(9600);

  // ใช้ For Loop กำหนดโหมดขา LED ทั้ง 6 ดวงให้เป็น OUTPUT
  for (int i = 0; i < 6; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW); // ปิดไฟทุกดวงไว้ก่อนตอนเริ่มต้น
  }

  // กำหนดโหมดปุ่มกดทั้ง 2 ปุ่ม (ต่อสวิตช์ลง GND)
  pinMode(BTN_SET_PIN, INPUT_PULLUP);
  pinMode(BTN_PLAY_PIN, INPUT_PULLUP);

  Serial.println("================================================");
  Serial.println("System Ready! ระบบควบคุมไฟวิ่งด้วย State + For Loop");
  Serial.print("ค่าเริ่มต้นปัจจุบัน: ไฟวิ่งจำนวน ");
  Serial.print(ledCount);
  Serial.println(" ดวง");
  Serial.println("================================================");
}

void loop() {
  // อ่านค่าสถานะปัจจุบันของปุ่มทั้ง 2 ปุ่ม
  int currentBtnSet  = digitalRead(BTN_SET_PIN);
  int currentBtnPlay = digitalRead(BTN_PLAY_PIN);

  // ------------------------------------------------------------------
  // ส่วนที่ 1: ตรวจจับการกด "ปุ่มที่ 1 (ตั้งค่าจำนวนไฟ)"
  // ------------------------------------------------------------------
  if (lastBtnSetState == HIGH && currentBtnSet == LOW) {
    ledCount++; // เพิ่มจำนวนไฟที่จะวิ่งขึ้น 1 ดวง
    if (ledCount > 6) {
      ledCount = 1; // ถ้าเกิน 6 ดวง ให้วนกลับมาเริ่มที่ 1 ดวงใหม่
    }

    // แสดงค่าที่ตั้งไว้ผ่านหน้าจอ Serial Monitor
    Serial.print(">> [SET] ตั้งค่าจำนวนไฟวิ่ง: ");
    Serial.print(ledCount);
    Serial.println(" ดวง");

    delay(50); // Debounce ป้องกันปุ่มเด้งเบิ้ล
  }

  // ------------------------------------------------------------------
  // ส่วนที่ 2: ตรวจจับการกด "ปุ่มที่ 2 (ปุ่มเล่นไฟวิ่ง 1 รอบ)"
  // ------------------------------------------------------------------
  if (lastBtnPlayState == HIGH && currentBtnPlay == LOW) {
    Serial.print(">> [PLAY] เริ่มวิ่งไฟจำนวน ");
    Serial.print(ledCount);
    Serial.println(" ดวง (จำนวน 1 รอบ)...");

    // ใช้คำสั่ง For Loop วิ่งไฟตั้งแต่ดวงที่ 0 จนถึงดวงที่ ledCount - 1
    for (int i = 0; i < ledCount; i++) {
      Serial.print("   -> เปิดไฟดวงที่ ");
      Serial.println(i + 1);

      digitalWrite(ledPins[i], HIGH); // สั่งให้ไฟดวงที่ i ติดสว่าง
      delay(300);                     // หน่วงเวลา 0.3 วินาที
      digitalWrite(ledPins[i], LOW);  // สั่งให้ไฟดวงที่ i ดับลง
    }

    Serial.println(">> [DONE] วิ่งไฟครบ 1 รอบเรียบร้อย! รอคำสั่งต่อไป...");
    delay(50); // Debounce ป้องกันปุ่มเด้งเบิ้ล
  }

  // บันทึกสถานะปุ่มไว้เปรียบเทียบในรอบถัดไป
  lastBtnSetState  = currentBtnSet;
  lastBtnPlayState = currentBtnPlay;
}`

// ============================================================================
// MINI-GAMES DATA (SECTION 5)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'int i = 0; (กำหนดค่าเริ่มต้นของตัวแปรนับรอบ)', type: 'for_syntax' },
  { id: 2, text: 'i < ledCount; (ตรวจสอบเงื่อนไขก่อนเข้าทำในแต่ละรอบ)', type: 'for_syntax' },
  { id: 3, text: 'ledCount++; if (ledCount > 6) ledCount = 1;', type: 'btn_set' },
  { id: 4, text: 'Serial.print("ตั้งค่าจำนวนไฟวิ่ง: "); Serial.println(ledCount);', type: 'btn_set' },
  { id: 5, text: 'สั่งรันลูป for (int i = 0; i < ledCount; i++) วิ่งไฟ 1 รอบ', type: 'btn_play' },
  { id: 6, text: 'digitalWrite(ledPins[i], HIGH); delay(300); digitalWrite(ledPins[i], LOW);', type: 'btn_play' }
]

const dragZonesData = [
  {
    id: 'for_syntax',
    title: '1. โครงสร้างเงื่อนไขของคำสั่ง For Loop',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากส่วนประกอบในวงเล็บของคำสั่ง for (...) มาวางที่นี่'
  },
  {
    id: 'btn_set',
    title: '2. หน้าที่ของปุ่มที่ 1 (ปุ่มตั้งค่า State & Serial)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากคำสั่งเพิ่มค่าจำนวนไฟและแสดงผล Serial มาวางที่นี่'
  },
  {
    id: 'btn_play',
    title: '3. หน้าที่ของปุ่มที่ 2 (ปุ่มสั่งเล่นไฟวิ่ง 1 รอบ)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากคำสั่งสั่งรันไฟวิ่งตามค่าที่ตั้งไว้ 1 รอบมาวางที่นี่'
  }
]

const matchLeftTerms = [
  { id: 'l1', text: '1. int i = 0; ในวงเล็บ for loop', match: 'r1' },
  { id: 'l2', text: '2. i < ledCount; ในวงเล็บ for loop', match: 'r2' },
  { id: 'l3', text: '3. i++ ในวงเล็บ for loop', match: 'r3' },
  { id: 'l4', text: '4. const int ledPins[6] = {2,3,4,5,6,7};', match: 'r4' },
  { id: 'l5', text: '5. if (ledCount > 6) ledCount = 1;', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ส่วนกำหนดค่าเริ่มต้น (Initialization) ทำงานเพียงครั้งเดียวตอนเริ่มเข้าลูป' },
  { id: 'r2', text: 'ส่วนตรวจสอบเงื่อนไข (Condition) ถ้าเป็นจริงจะทำต่อ ถ้าเป็นเท็จจะหยุดลูปทันที' },
  { id: 'r3', text: 'ส่วนปรับปรุงค่ารอบ (Update) เพิ่มค่าตัวแปร i ทีละ 1 หลังจบการทำงานแต่ละรอบ' },
  { id: 'r4', text: 'การเก็บหมายเลขขาพินทั้ง 6 ดวงไว้ใน Array เพื่ออ้างอิงด้วยลำดับ Index 0 ถึง 5' },
  { id: 'r5', text: 'ตรรกะวนค่ากลับ (Wrap-around State) เมื่อกดตั้งค่าเกิน 6 ดวงให้กลับเป็น 1 ดวงใหม่' }
]

const quizQuestions = [
  {
    id: 1,
    question: 'โครงสร้างมาตรฐานของคำสั่ง for loop ในภาษา C++ ของ Arduino ประกอบด้วย 3 ส่วนใดตามลำดับ?',
    options: [
      { id: 'a', text: 'for (เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า)', isCorrect: false },
      { id: 'b', text: 'for (การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น)', isCorrect: false },
      { id: 'c', text: 'for (กำหนดค่าเริ่มต้น; เงื่อนไขการวนซ้ำ; การเพิ่มหรือลดค่า)', isCorrect: true },
      { id: 'd', text: 'for (กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ)', isCorrect: false }
    ],
    explanation: 'โครงสร้างของ for loop คือ for (Initialization; Condition; Update) เช่น for (int i = 0; i < 6; i++)'
  },
  {
    id: 2,
    question: 'หากกำหนดให้ ledCount = 4; แล้วรันคำสั่ง for (int i = 0; i < ledCount; i++) คำสั่งภายในลูปจะทำงานกี่รอบ และ i มีค่าอะไรบ้าง?',
    options: [
      { id: 'a', text: 'ทำงาน 4 รอบ โดยค่า i คือ 1, 2, 3 และ 4', isCorrect: false },
      { id: 'b', text: 'ทำงาน 5 รอบ โดยค่า i คือ 0, 1, 2, 3 และ 4', isCorrect: false },
      { id: 'c', text: 'ทำงาน 3 รอบ โดยค่า i คือ 0, 1 และ 2', isCorrect: false },
      { id: 'd', text: 'ทำงาน 4 รอบ โดยค่า i คือ 0, 1, 2 และ 3', isCorrect: true }
    ],
    explanation: 'เริ่มจาก i = 0 และทำตราบใดที่ i < 4 ดังนั้น i จะเป็น 0, 1, 2, 3 (รวม 4 รอบ) พอ i เพิ่มเป็น 4 เงื่อนไข 4 < 4 จะเป็นเท็จและออกจากลูปทันที'
  },
  {
    id: 3,
    question: 'เมื่อประกาศ const int ledPins[6] = {2, 3, 4, 5, 6, 7}; คำสั่ง ledPins[0] และ ledPins[5] อ้างอิงถึงขาพินหมายเลขใดตามลำดับ?',
    options: [
      { id: 'a', text: 'ledPins[0] คือขาพิน 1 และ ledPins[5] คือขาพิน 6', isCorrect: false },
      { id: 'b', text: 'ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 7', isCorrect: true },
      { id: 'c', text: 'ledPins[0] คือขาพิน 0 และ ledPins[5] คือขาพิน 5', isCorrect: false },
      { id: 'd', text: 'ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 6', isCorrect: false }
    ],
    explanation: 'Index ของ Array เริ่มนับที่ 0 เสมอ ดังนั้น ledPins[0] มีค่าเท่ากับ 2 และ ledPins[5] (ตัวที่หก) มีค่าเท่ากับ 7'
  },
  {
    id: 4,
    question: 'ส่วนแรกของ for loop คือ int i = 0; จะถูกประมวลผลกี่ครั้งต่อการรัน for loop 1 ชุด?',
    options: [
      { id: 'a', text: 'ทำงานทุกรอบของลูป ทำให้ค่า i กลับเป็น 0 ทุกครั้ง', isCorrect: false },
      { id: 'b', text: 'ทำงานเฉพาะรอบสุดท้ายก่อนออกจากลูป', isCorrect: false },
      { id: 'c', text: 'ทำงานเท่ากับจำนวนรอบของลูปที่กำหนดไว้ในเงื่อนไข', isCorrect: false },
      { id: 'd', text: 'ทำงานเพียงครั้งเดียวตอนเริ่มเข้าสู่ลูป', isCorrect: true }
    ],
    explanation: 'ส่วน Initialization (int i = 0;) ทำงานแค่ครั้งเดียวตอนเริ่มเข้าลูป จากนั้นในแต่ละรอบจะทำงานเฉพาะ Condition -> Body -> Update (i++)'
  },
  {
    id: 5,
    question: 'ในใบงานที่มีปุ่มกด 2 ปุ่ม หากกด "ปุ่มตั้งค่า" ขณะที่ ledCount เท่ากับ 6 อยู่แล้ว โปรแกรมควรจัดการค่า ledCount อย่างไร?',
    options: [
      { id: 'a', text: 'ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 1', isCorrect: true },
      { id: 'b', text: 'ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้ปล่อยค่าไว้เป็น 7', isCorrect: false },
      { id: 'c', text: 'ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 0', isCorrect: false },
      { id: 'd', text: 'ไม่ต้องตรวจสอบ เพราะ for loop จะหยุดเองเมื่อครบ 6 ดวง', isCorrect: false }
    ],
    explanation: 'มี LED 6 ดวง หากตั้งค่าเกิน 6 จะทำให้เข้าถึง Array เกินขอบเขต (Out of Bounds) จึงต้องวนค่ากลับมาเริ่มที่ 1 ใหม่ (ค่า 0 จะไม่มีไฟวิ่งเลย)'
  },
  {
    id: 6,
    question: 'เหตุใดเมื่อกด "ปุ่มเล่น" ไฟ LED จึงวิ่งตามจำนวนที่ตั้งไว้เพียง 1 รอบแล้วหยุด ไม่วิ่งวนซ้ำตลอด?',
    options: [
      { id: 'a', text: 'เพราะ for loop อยู่ในฟังก์ชัน setup() ซึ่งทำงานเพียงครั้งเดียว', isCorrect: false },
      { id: 'b', text: 'เพราะ Serial.begin(9600) ทำให้ลูปหยุดหลังจบ 1 รอบ', isCorrect: false },
      { id: 'c', text: 'เพราะ for loop อยู่ในเงื่อนไขตรวจจับการกดปุ่มครั้งเดียว (lastBtnPlayState == HIGH && currentBtnPlay == LOW)', isCorrect: true },
      { id: 'd', text: 'เพราะ delay(300) ทำให้ลูปถูกยกเลิกเมื่อครบเวลา', isCorrect: false }
    ],
    explanation: 'การวาง for loop ไว้ใน if (lastBtnPlayState == HIGH && currentBtnPlay == LOW) ทำให้ลูปรันเฉพาะจังหวะที่กดปุ่มลง 1 ครั้ง พอรันครบ 1 รอบก็กลับไปเช็คปุ่มต่อ'
  },
  {
    id: 7,
    question: 'หากต้องการให้ไฟ LED วิ่งย้อนกลับจากดวงที่ 6 ลงมาดวงที่ 1 (Index 5 ลงมา 0) ต้องเขียนหัวคำสั่ง for loop อย่างไร?',
    options: [
      { id: 'a', text: 'for (int i = 5; i > 0; i--)', isCorrect: false },
      { id: 'b', text: 'for (int i = 6; i >= 0; i--)', isCorrect: false },
      { id: 'c', text: 'for (int i = 5; i >= 0; i++)', isCorrect: false },
      { id: 'd', text: 'for (int i = 5; i >= 0; i--)', isCorrect: true }
    ],
    explanation: 'ต้องเริ่ม i = 5, เงื่อนไข i >= 0 (เพื่อให้รวม Index 0) และลดค่าทีละ 1 ด้วย i-- ตัวเลือกอื่นพลาด Index 0, เริ่มที่ 6 ซึ่งเกิน Array หรือเพิ่มค่าแทนที่จะลด'
  },
  {
    id: 8,
    question: 'ถ้าเขียนผิดเป็น for (int i = 0; i < 6; i--) ซึ่งเริ่มที่ 0 แต่ลดค่า i ลงเรื่อย ๆ (0, -1, -2, ...) จะเกิดผลอย่างไร?',
    options: [
      { id: 'a', text: 'ลูปทำงานเพียงรอบเดียวแล้วออกจากลูปทันที', isCorrect: false },
      { id: 'b', text: 'เกิด Infinite Loop เพราะ i ติดลบและน้อยกว่า 6 เสมอ ทำให้อ้างอิงขาพินผิดพลาด', isCorrect: true },
      { id: 'c', text: 'ลูปไม่ทำงานเลย เพราะค่าเริ่มต้นไม่ตรงกับเงื่อนไข', isCorrect: false },
      { id: 'd', text: 'ลูปทำงาน 6 รอบตามปกติ แต่ไฟวิ่งย้อนกลับ', isCorrect: false }
    ],
    explanation: 'เมื่อ i ลดเป็น -1, -2, -3 เงื่อนไข i < 6 จะเป็นจริงตลอด โปรแกรมจึงติดอยู่ในลูปไม่รู้จบ (Infinite Loop) และอ่านค่าหน่วยความจำนอก Array'
  },
  {
    id: 9,
    question: 'ทำไมภายในลูปไฟวิ่งจึงต้องมีคำสั่ง digitalWrite(ledPins[i], LOW); ตามหลัง delay(300);?',
    options: [
      { id: 'a', text: 'เพื่อดับไฟดวงปัจจุบันก่อนขยับไปเปิดดวงถัดไป ให้เห็นเป็นไฟวิ่งทีละดวง', isCorrect: true },
      { id: 'b', text: 'เพื่อรีเซ็ตค่า i ให้กลับเป็น 0 ก่อนเริ่มรอบถัดไป', isCorrect: false },
      { id: 'c', text: 'เพื่อลดแรงดันไฟที่จ่ายให้ขาพินไม่ให้สูงเกินไป', isCorrect: false },
      { id: 'd', text: 'เพื่อให้ delay(300) ทำงานได้ถูกต้องในรอบถัดไป', isCorrect: false }
    ],
    explanation: 'หากสั่งแต่ HIGH โดยไม่สั่ง LOW หลอดไฟจะติดค้างสะสมไปเรื่อย ๆ การสั่ง HIGH -> delay -> LOW ในแต่ละรอบของ i จึงทำให้เห็นไฟติดและดับไล่ทีละดวง'
  },
  {
    id: 10,
    question: 'การใช้ pinMode(BTN_PIN, INPUT_PULLUP); ร่วมกับการต่อปุ่มกดลง GND มีข้อดีอย่างไรในการต่อวงจร?',
    options: [
      { id: 'a', text: 'ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น LOW ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น HIGH', isCorrect: false },
      { id: 'b', text: 'ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น HIGH ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น LOW', isCorrect: true },
      { id: 'c', text: 'ใช้ตัวต้านทานภายนอกที่ต่อพ่วงในปุ่มกด ทำให้สัญญาณเป็น HIGH ปกติ', isCorrect: false },
      { id: 'd', text: 'ไม่ใช้ตัวต้านทานเลย แต่ใช้การหน่วงเวลาในโปรแกรมแทนการกันสัญญาณรบกวน', isCorrect: false }
    ],
    explanation: 'INPUT_PULLUP เปิดใช้ตัวต้านทาน Pull-up ภายในชิป ATmega328P ทำให้ไม่ต้องต่อตัวต้านทานภายนอก สัญญาณปกติเป็น HIGH และเมื่อกดปุ่ม (ต่อลง GND) จะเป็น LOW'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-12 px-4 md:px-8">

    <!-- ============================================================== -->
    <!-- HERO HEADER BANNER                                             -->
    <!-- ============================================================== -->
    <div
      class="bg-gradient-to-br from-amber-950 via-stone-900 to-orange-950 rounded-3xl p-8 md:p-12 border border-amber-700/50 shadow-2xl relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-amber-400">
        <RotateCw class="w-[400px] h-[400px] -translate-y-16 translate-x-16" />
      </div>

      <div class="relative z-10 max-w-4xl space-y-5">
        <div class="flex flex-wrap items-center gap-2.5">
          <span
            class="px-4 py-1.5 bg-amber-500/20 text-amber-300 font-black rounded-full text-xs uppercase tracking-wider border border-amber-400/30">
            สัปดาห์ที่ 4 • รหัสวิชา 21901-2007
          </span>
          <span class="px-3.5 py-1.5 bg-white/10 text-stone-200 text-xs rounded-full font-bold border border-white/15">
            For Loop Iteration + State Machine Controller
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          การควบคุมแบบวนซ้ำด้วยคำสั่ง <span class="text-amber-400 font-mono">For Loop</span> อย่างละเอียด<br />
          <span class="text-xl sm:text-2xl md:text-3xl text-orange-300 font-bold">
            เปรียบเทียบโค้ด Hardcode vs For Loop และสาธิตไฟวิ่ง LED 6 ดวง
          </span>
        </h1>

        <p class="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          เจาะลึกโครงสร้างคำสั่งวนซ้ำ <code>for loop</code> ในภาษา C++ สำหรับระบบสมองกลฝังตัว ตั้งแต่ไวยากรณ์ 3
          ส่วนสำคัญ,
          วงจรการประมวลผล 4 จังหวะของ CPU, ความแตกต่างระหว่างการเขียนแบบ Hardcode กับการใช้ For Loop,
          สาธิตการควบคุมไฟ LED 6 ดวง (Pin 2 ถึง 7) และปิดท้ายด้วยภารกิจท้าทายสั่งงาน State Machine ควบคุมไฟวิ่งด้วย 2
          ปุ่มกด
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200 font-bold">
            <RotateCw class="w-4 h-4 text-amber-400" />
            <span>หัวข้อที่ 1: โครงสร้าง For Loop อย่างละเอียด</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200 font-bold">
            <Layers class="w-4 h-4 text-rose-400" />
            <span>หัวข้อที่ 2: Hardcode VS For Loop</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-yellow-500/30 flex items-center gap-2 text-xs text-yellow-200 font-bold">
            <Lightbulb class="w-4 h-4 text-yellow-400" />
            <span>หัวข้อที่ 3: สาธิตไฟวิ่ง LED 6 ดวง</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200 font-bold">
            <Trophy class="w-4 h-4 text-emerald-400" />
            <span>สั่งงานภารกิจ: State Machine 2 ปุ่มกด</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- CHECK-IN SYSTEM & TEACHER SCOREBOARD BUTTON                    -->
    <!-- ============================================================== -->
    <div class="space-y-4">

      <div v-if="isTeacher" class="flex justify-end">
        <button @click="showTeacherModal = true"
          class="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all">
          <Trophy class="w-4 h-4" />
          <span>ดูตารางคะแนนมินิเกมและแบบทดสอบ (สำหรับครู)</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TOPIC 1: โครงสร้างคำสั่งของ FOR LOOP อย่างละเอียด                 -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-amber-600 uppercase tracking-wider">Topic 1 • Core Syntax &
            Mechanics</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2.5">
            <RotateCw class="w-7 h-7 text-amber-600 shrink-0" />
            โครงสร้างและกลไกการทำงานของคำสั่ง For Loop อย่างละเอียด
          </h2>
        </div>
        <span
          class="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start">
          หัวใจหลักของการประมวลผลแบบวนซ้ำ
        </span>
      </div>

      <div class="space-y-4">
        <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
          คำสั่ง <code>for loop</code> เป็นคำสั่งควบคุมแบบวนซ้ำ (Iteration Control) ที่นิยมใช้มากที่สุดเมื่อเรา
          <strong>ทราบจำนวนรอบที่แน่นอน</strong> ว่าต้องการให้ไมโครคอนโทรลเลอร์ทำงานกี่รอบ เช่น สั่งให้อ่านค่าเซนเซอร์
          10 ครั้ง,
          สั่งตั้งค่าพิน 6 ขา หรือสั่งเปิดไฟ LED ทีละดวงเรียงกันตามลำดับ
        </p>

        <!-- โครงสร้างไวยากรณ์ Syntax Banner -->
        <div
          class="rounded-2xl bg-stone-900 border border-stone-800 p-5 text-white font-mono text-sm sm:text-base space-y-2">
          <div class="text-[11px] font-mono text-stone-400 font-bold uppercase tracking-wider">
            // ไวยากรณ์มาตรฐานของคำสั่ง For Loop ในภาษา C++ (Arduino)
          </div>
          <div class="text-amber-300 font-bold">
            <span class="text-purple-400">for</span> ( <span class="text-sky-300">initialization</span> ; <span
              class="text-amber-300">condition</span> ; <span class="text-emerald-300">update</span> ) &#123;
          </div>
          <div class="pl-6 text-stone-300 text-xs sm:text-sm">
            // ชุดคำสั่งที่ต้องการให้ทำซ้ำในแต่ละรอบ (Loop Body)<br />
            // จะทำงานตราบใดที่เงื่อนไข condition ยังคงเป็นจริง (true)
          </div>
          <div class="text-amber-300 font-bold">&#125;</div>
        </div>
      </div>

      <!-- วงจรการประมวลผล 4 จังหวะของ CPU -->
      <div class="rounded-3xl p-6 sm:p-8 bg-amber-50/60 border-2 border-amber-200 space-y-5">
        <div class="space-y-1">
          <h3 class="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
            <Zap class="w-5 h-5 text-amber-600" />
            วงจรการประมวลผล 4 จังหวะของไมโครคอนโทรลเลอร์ (Flow of Execution)
          </h3>
          <p class="text-xs sm:text-sm text-stone-600">
            เมื่อโปรแกรม Arduino วิ่งมาถึงคำสั่ง <code>for</code> ตัวประมวลผลจะทำงานตามลำดับ 4 ขั้นตอนอย่างเคร่งครัด:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2 relative">
            <span
              class="w-7 h-7 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">1</span>
            <h4 class="font-black text-stone-900 text-sm">จังหวะที่ 1: กำหนดค่าเริ่มต้น</h4>
            <div class="font-mono text-xs text-sky-700 font-bold bg-sky-50 p-2 rounded-lg">int i = 0;</div>
            <p class="text-[11px] text-stone-600 leading-relaxed">
              ทำงานเพียง <strong>ครั้งเดียวเท่านั้น</strong> ตอนเริ่มเข้าสู่ลูป เพื่อสร้างตัวแปรนับรอบและตั้งค่าเริ่มต้น
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2 relative">
            <span
              class="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">2</span>
            <h4 class="font-black text-stone-900 text-sm">จังหวะที่ 2: ตรวจสอบเงื่อนไข</h4>
            <div class="font-mono text-xs text-amber-700 font-bold bg-amber-50 p-2 rounded-lg">i &lt; 6; (True/False)
            </div>
            <p class="text-[11px] text-stone-600 leading-relaxed">
              ตรวจก่อนเข้าลูปทุกรอบ! ถ้าเป็น <strong>จริง</strong> จะเข้าทำงานในปีกกา ถ้าเป็น <strong>เท็จ</strong>
              จะหลุดออกจากลูปทันที
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2 relative">
            <span
              class="w-7 h-7 rounded-full bg-purple-500 text-white font-black text-xs flex items-center justify-center">3</span>
            <h4 class="font-black text-stone-900 text-sm">จังหวะที่ 3: ทำคำสั่งในปีกกา</h4>
            <div class="font-mono text-xs text-purple-700 font-bold bg-purple-50 p-2 rounded-lg">&#123;
              digitalWrite(...); &#125;</div>
            <p class="text-[11px] text-stone-600 leading-relaxed">
              ประมวลผลคำสั่งจริงในบล็อก <code>&#123; ... &#125;</code> เช่น การสั่งเปิดหรือดับไฟ LED ดวงที่
              <code>i</code>
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2 relative">
            <span
              class="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">4</span>
            <h4 class="font-black text-stone-900 text-sm">จังหวะที่ 4: ปรับปรุงค่าตัวแปร</h4>
            <div class="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">i++ (i = i + 1)</div>
            <p class="text-[11px] text-stone-600 leading-relaxed">
              เมื่อทำคำสั่งในปีกกาเสร็จ จะเพิ่มค่า <code>i</code> ขึ้น 1 แล้ว<strong>วนกลับไปตรวจสอบเงื่อนไขในจังหวะที่
                2 ทันที</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- กายวิภาค 3 ส่วนของ For Loop -->
      <div class="rounded-3xl bg-stone-900 text-white p-6 sm:p-8 space-y-6 border border-stone-800">
        <div class="space-y-1">
          <h3 class="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-2">
            <Code2 class="w-5 h-5" />
            กายวิภาคของคำสั่ง For Loop ทั้ง 3 ส่วน (Anatomy of a For Loop)
          </h3>
          <p class="text-xs sm:text-sm text-stone-300">
            ภายในวงเล็บของคำสั่ง <code>for ( ส่วนที่ 1 ; ส่วนที่ 2 ; ส่วนที่ 3 )</code> คั่นด้วยเครื่องหมายเซมิโคลอน
            (<code>;</code>) เสมอ มีลำดับการทำงานดังนี้:
          </p>
        </div>

        <div
          class="p-4 sm:p-6 rounded-2xl bg-black/80 border border-stone-700 font-mono text-sm sm:text-lg text-center overflow-x-auto text-white">
          <span class="text-purple-400 font-black">for</span> <span class="text-stone-300 font-bold">(</span>
          <span class="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">int i =
            0;</span>
          <span
            class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold mx-1.5">i
            &lt; ledCount;</span>
          <span
            class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">i++</span>
          <span class="text-stone-300 font-bold">)</span> <span class="text-yellow-400 font-bold">&#123;</span> <span
            class="text-stone-400">...</span> <span class="text-yellow-400 font-bold">&#125;</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl bg-sky-950/50 border border-sky-700/50 space-y-2">
            <span class="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black">
              ส่วนที่ 1: Initialization
            </span>
            <h4 class="font-mono font-black text-base text-white">int i = 0;</h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              <strong>การกำหนดค่าเริ่มต้นของตัวแปรนับรอบ:</strong> ทำงานเพียง <strong>ครั้งเดียวเท่านั้น</strong>
              ตอนเริ่มเข้าสู่ลูป มักตั้งชื่อตัวแปรว่า <code>i</code> (ย่อมาจาก Index / Iterator) เริ่มที่ <code>0</code>
              เพื่อให้ตรงกับลำดับแรกของ Array
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-950/50 border border-amber-700/50 space-y-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
              ส่วนที่ 2: Condition (ตรวจทุกๆ รอบ)
            </span>
            <h4 class="font-mono font-black text-base text-white">i &lt; ledCount;</h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              <strong>เงื่อนไขการวนซ้ำ:</strong> ตรวจสอบ <strong>ก่อนเข้าไปทำคำสั่งในปีกกาทุกครั้ง</strong> หากเป็นจริง
              (<code>true</code>) จะเข้าไปทำคำสั่งในปีกกา แต่ถ้าเป็นเท็จ (<code>false</code>)
              จะ<strong>กระโดดออกจากลูปทันที!</strong>
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/50 space-y-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
              ส่วนที่ 3: Update / Step
            </span>
            <h4 class="font-mono font-black text-base text-white">i++ (เท่ากับ i = i + 1)</h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              <strong>การเพิ่ม/ลดค่าตัวแปรนับรอบ:</strong> จะทำงาน <strong>หลังจากทำคำสั่งในปีกกาจบรอบนั้นๆ
                แล้ว</strong> เพื่อขยับค่า <code>i</code> ไปยังดวงถัดไป แล้ววนกลับไปเช็คเงื่อนไขในส่วนที่ 2 ใหม่
            </p>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE FOR LOOP STEP-BY-STEP VISUALIZER -->
      <div class="rounded-3xl bg-amber-50/70 border-2 border-amber-200 p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-xs font-black text-amber-800 uppercase tracking-wider">Interactive Step Visualizer</span>
            <h3 class="text-lg sm:text-xl font-black text-stone-900">
              ทดลองกดไล่สเต็ปการทำงานของ For Loop ทีละจังหวะ
            </h3>
            <p class="text-xs text-stone-600">
              เลือกจำนวนไฟที่ต้องการ (<code>targetLeds</code>) แล้วกดปุ่ม <strong>"ก้าวถัดไป (Next Step)"</strong>
              เพื่อดูว่า CPU ประมวลผลส่วนไหนของ For Loop
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <label class="text-xs font-bold text-stone-700">กำหนด targetLeds:</label>
            <select v-model.number="loopTargetMax" @change="resetLoopStepper"
              class="px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-mono font-bold text-xs text-stone-800 cursor-pointer">
              <option v-for="n in 6" :key="n" :value="n">{{ n }} ดวง</option>
            </select>

            <button @click="nextLoopStep"
              class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all">
              <Play class="w-3.5 h-3.5" />
              <span>ก้าวถัดไป (Next Step)</span>
            </button>

            <button @click="resetLoopStepper"
              class="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
              <RefreshCw class="w-3.5 h-3.5" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>

        <!-- Highlighted Code Row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div
            class="lg:col-span-7 p-4 rounded-2xl bg-stone-900 text-white font-mono text-xs sm:text-sm space-y-2 border border-stone-800">
            <div>
              <span class="text-purple-400 font-bold">for</span> <span class="text-stone-300 font-bold">(</span>
              <span class="px-1.5 py-0.5 rounded transition-all font-mono"
                :class="loopPhase === 'init' ? 'bg-sky-500 text-black font-black ring-2 ring-sky-300' : 'text-sky-300'">int
                i = 0;</span>
              <span class="px-1.5 py-0.5 rounded mx-1 transition-all font-mono"
                :class="loopPhase === 'check_true' ? 'bg-emerald-400 text-black font-black ring-2 ring-emerald-200' : (loopPhase === 'check_false' ? 'bg-rose-500 text-white font-black ring-2 ring-rose-300' : 'text-amber-300')">i
                &lt; {{ loopTargetMax }};</span>
              <span class="px-1.5 py-0.5 rounded transition-all font-mono"
                :class="loopPhase === 'update' ? 'bg-amber-400 text-black font-black ring-2 ring-amber-200' : 'text-emerald-300'">i++</span>
              <span class="text-stone-300 font-bold">)</span> <span class="text-yellow-400 font-bold">&#123;</span>
            </div>
            <div class="pl-6 py-1.5 rounded-lg transition-all space-y-1 font-mono text-xs sm:text-sm"
              :class="loopPhase === 'body' ? 'bg-amber-500/25 border border-amber-400 text-amber-200 font-bold' : 'text-stone-300'">
              <div><span class="text-sky-300">digitalWrite</span><span class="text-stone-300">(</span><span
                  class="text-sky-200">ledPins</span><span class="text-stone-300">[</span><span
                  class="text-sky-200">i</span><span class="text-stone-300">]</span><span
                  class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                  class="text-stone-300">);</span></div>
              <div><span class="text-yellow-300">delay</span><span class="text-stone-300">(</span><span
                  class="text-orange-400 font-bold">300</span><span class="text-stone-300">);</span></div>
              <div><span class="text-sky-300">digitalWrite</span><span class="text-stone-300">(</span><span
                  class="text-sky-200">ledPins</span><span class="text-stone-300">[</span><span
                  class="text-sky-200">i</span><span class="text-stone-300">]</span><span
                  class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                  class="text-stone-300">);</span></div>
            </div>
            <div><span class="text-yellow-400 font-bold">&#125;</span></div>
          </div>

          <div class="lg:col-span-5 grid grid-cols-2 gap-3">
            <div class="p-4 rounded-2xl bg-white border border-amber-200 text-center">
              <div class="text-[11px] font-bold text-stone-500">ค่าตัวแปร i ปัจจุบัน</div>
              <div class="font-mono font-black text-3xl text-amber-600 mt-1">
                {{ loopCurrentI === -1 ? '-' : loopCurrentI }}
              </div>
              <div class="text-[11px] text-stone-500 mt-0.5">
                {{ loopCurrentI >= 0 && loopCurrentI < 6 ? `อ้างอิง ledPins[${loopCurrentI}] (Pin ${loopCurrentI + 2})`
                  : 'นอกลูป' }} </div>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-amber-200 text-center">
                <div class="text-[11px] font-bold text-stone-500">ผลการตรวจ i &lt; {{ loopTargetMax }}</div>
                <div class="font-mono font-black text-lg mt-2"
                  :class="loopCurrentI === -1 ? 'text-stone-400' : (loopCurrentI < loopTargetMax ? 'text-emerald-600' : 'text-rose-600')">
                  {{ loopCurrentI === -1 ? 'รอเริ่มลูป' : (loopCurrentI < loopTargetMax ? `${loopCurrentI} <
                    ${loopTargetMax} (TRUE)` : `${loopCurrentI} < ${loopTargetMax} (FALSE)`) }} </div>
                    <div class="text-[11px] text-stone-500 mt-1">
                      {{ loopPhase === 'check_false' ? 'ออกจากลูปทันที!' : 'ทำต่อในลูป' }}
                    </div>
                </div>
              </div>
            </div>

            <!-- 6 LEDs Mini Preview in Stepper (Clean without frames, colored bulbs) -->
            <div class="py-3 px-2 rounded-2xl bg-stone-900/90 border border-stone-800">
              <div class="grid grid-cols-6 gap-1 sm:gap-2 text-center items-end">
                <div v-for="(led, i) in ledConfigs" :key="led.pin"
                  class="flex flex-col items-center py-1 transition-all"
                  :class="i < loopTargetMax ? 'opacity-100' : 'opacity-40'">
                  <div class="text-[9px] sm:text-[10px] font-mono text-stone-400 mb-1">Pin {{ led.pin }}</div>
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-150"
                    :class="[
                      loopPhase === 'body' && loopCurrentI === i
                        ? [led.onBulb, 'scale-110']
                        : [led.offBulb, 'scale-90']
                    ]">
                    <Lightbulb class="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div class="text-[10px] sm:text-xs font-bold text-stone-200 mt-1">LED {{ i + 1 }}</div>
                  <div class="text-[9px] font-medium" :class="led.textColor">{{ led.colorName }}</div>
                  <div class="text-[9px] font-mono text-stone-500">i = {{ i }}</div>
                </div>
              </div>
            </div>

            <div
              class="p-3.5 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs space-y-1 max-h-28 overflow-y-auto">
              <div v-for="(l, idx) in loopLogs" :key="idx"
                :class="idx === 0 ? 'text-amber-300 font-bold' : 'text-stone-400'">
                {{ l }}
              </div>
            </div>
          </div>

    </section>

    <!-- ============================================================== -->
    <!-- TOPIC 2: เปรียบเทียบความแตกต่างระหว่าง HARDCODE กับ FOR LOOP      -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-rose-600 uppercase tracking-wider">Topic 2 • Comparative Analysis</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2.5">
            <Layers class="w-7 h-7 text-rose-600 shrink-0" />
            เปรียบเทียบชัดเจน: การเขียนแบบ Hardcode VS การใช้คำสั่ง For Loop
          </h2>
        </div>
        <span
          class="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold self-start">
          การลดรูปคำสั่งซ้ำซ้อน
        </span>
      </div>

      <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
        <strong>การเขียนแบบ Hardcode</strong> คือการพิมพ์คำสั่งเดิมซ้ำๆ หลายสิบบรรทัด โดยระบุค่าพินหรือการทำงานแบบตายตัว
        (Fixed Values)
        ซึ่งเป็นวิธีที่ไม่มีประสิทธิภาพเมื่อมีอุปกรณ์หลายตัว ในขณะที่ <strong>คำสั่ง For Loop</strong>
        ช่วยให้เราเขียนตรรกะคำสั่งเพียงครั้งเดียว
        แล้วสั่งให้ไมโครคอนโทรลเลอร์วนลูปจัดการพินทั้งหมดใน Array โดยอัตโนมัติ
      </p>

      <!-- ตารางเปรียบเทียบ 4 มิติ -->
      <div class="overflow-x-auto rounded-2xl border border-stone-200">
        <table class="w-full text-xs sm:text-sm text-left">
          <thead class="bg-stone-100 text-stone-800 font-black border-b border-stone-200">
            <tr>
              <th class="p-3.5 sm:p-4">มิติการเปรียบเทียบ</th>
              <th class="p-3.5 sm:p-4 text-rose-700 bg-rose-50/50">แบบ Hardcode (เขียนซ้ำทีละบรรทัด)</th>
              <th class="p-3.5 sm:p-4 text-emerald-700 bg-emerald-50/50">แบบใช้ For Loop + Array</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 text-stone-700 font-medium">
            <tr>
              <td class="p-3.5 sm:p-4 font-bold text-stone-900">1. ปริมาณโค้ด (Lines of Code)</td>
              <td class="p-3.5 sm:p-4 text-rose-700 bg-rose-50/20">โค้ดยาวมาก ต้องเขียนซ้ำ 1 คำสั่งต่อ 1 ขา (6 ขา = 6
                บรรทัด, 20 ขา = 20 บรรทัด)</td>
              <td class="p-3.5 sm:p-4 text-emerald-800 bg-emerald-50/20 font-bold">โค้ดสั้นกระชับ ใช้เพียง 3 บรรทัด
                ไม่ว่าจะคุม 6 ขา หรือ 50 ขา</td>
            </tr>
            <tr>
              <td class="p-3.5 sm:p-4 font-bold text-stone-900">2. ความยืดหยุ่น (Flexibility)</td>
              <td class="p-3.5 sm:p-4 text-rose-700 bg-rose-50/20">ตายตัว ปรับเปลี่ยนจำนวนอุปกรณ์ขณะรันโปรแกรมไม่ได้
                (ต้องแก้โค้ดใหม่เสมอ)</td>
              <td class="p-3.5 sm:p-4 text-emerald-800 bg-emerald-50/20 font-bold">ยืดหยุ่นสูงมาก
                สามารถนำตัวแปรสถานะมากำหนดเงื่อนไข <code>i &lt; count</code> ได้ทันที</td>
            </tr>
            <tr>
              <td class="p-3.5 sm:p-4 font-bold text-stone-900">3. ความเสี่ยงเกิดข้อผิดพลาด</td>
              <td class="p-3.5 sm:p-4 text-rose-700 bg-rose-50/20">สูงมากจากการ Copy-Paste อาจลืมเปลี่ยนหมายเลขพิน
                หรือพิมพ์ตัวเลขสลับกัน</td>
              <td class="p-3.5 sm:p-4 text-emerald-800 bg-emerald-50/20 font-bold">ต่ำมาก มีตรรกะชุดเดียว
                ตรวจสอบและแก้ไขได้รวดเร็ว</td>
            </tr>
            <tr>
              <td class="p-3.5 sm:p-4 font-bold text-stone-900">4. การดูแลรักษาโค้ด (Maintenance)</td>
              <td class="p-3.5 sm:p-4 text-rose-700 bg-rose-50/20">ยาก หากย้ายขาพินฮาร์ดแวร์
                ต้องไล่แก้ตัวเลขทุกจุดในโค้ด</td>
              <td class="p-3.5 sm:p-4 text-emerald-800 bg-emerald-50/20 font-bold">ง่ายที่สุด แก้ไขเพียงตัวเลขในอาร์เรย์
                <code>ledPins[]</code> จุดเดียวจบ
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- กล่องเปรียบเทียบ Side-by-Side: 1. pinMode() และ 2. digitalWrite() -->
      <div class="space-y-6">
        <h3 class="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <Code2 class="w-5 h-5 text-amber-600" />
          ตัวอย่างโค้ดเปรียบเทียบชัดเจน 2 สถานการณ์
        </h3>

        <!-- สถานการณ์ที่ 1: การตั้งค่า pinMode -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              สถานการณ์ที่ 1: การกำหนดโหมด pinMode() ให้ไฟ LED 6 ขาในฟังก์ชัน setup()
            </span>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Hardcode Card 1 -->
            <div class="p-4 rounded-2xl bg-stone-950 border border-rose-500/40 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                  แบบ Hardcode (6 บรรทัด)
                </span>
                <button @click="copyCode('hc_pin', hardcodePinModeCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'hc_pin'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'hc_pin' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <div class="font-mono text-xs leading-relaxed space-y-1 text-stone-200">
                <div><span class="text-stone-400 italic">// [Hardcode] กำหนดโหมดขาไฟ LED 6 ขาแบบพิมพ์ทีละบรรทัด</span>
                </div>
                <div><span class="text-purple-400 font-bold">void</span> <span
                    class="text-amber-300 font-bold">setup</span><span class="text-stone-300">()</span> <span
                    class="text-yellow-400 font-bold">&#123;</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">2</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">3</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">4</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">5</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">6</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">pinMode</span><span class="text-stone-300">(</span><span
                    class="text-orange-400 font-bold">7</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div><span class="text-yellow-400 font-bold">&#125;</span></div>
              </div>
            </div>

            <!-- For Loop Card 1 -->
            <div class="p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  แบบใช้ For Loop + Array (3 บรรทัด)
                </span>
                <button @click="copyCode('for_pin', forLoopPinModeCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'for_pin'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'for_pin' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <div class="font-mono text-xs leading-relaxed space-y-1 text-stone-200">
                <div><span class="text-emerald-400/80 italic">// [For Loop] กำหนดโหมดขาไฟ LED 6 ขาด้วยคำสั่งวนซ้ำเพียง 3
                    บรรทัด</span></div>
                <div><span class="text-purple-400 font-bold">const int</span> <span
                    class="text-sky-300 font-bold">ledPins</span><span class="text-stone-300">[</span><span
                    class="text-orange-400 font-bold">6</span><span class="text-stone-300">]</span> <span
                    class="text-pink-300 font-bold">=</span> <span class="text-yellow-400 font-bold">&#123;</span><span
                    class="text-orange-400">2</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">3</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">4</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">5</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">6</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">7</span><span class="text-yellow-400 font-bold">&#125;</span><span
                    class="text-stone-300">;</span></div>
                <div class="pt-1"><span class="text-purple-400 font-bold">void</span> <span
                    class="text-amber-300 font-bold">setup</span><span class="text-stone-300">()</span> <span
                    class="text-yellow-400 font-bold">&#123;</span></div>
                <div class="pl-4">
                  <span class="text-purple-400 font-bold">for</span> <span class="text-stone-300">(</span><span
                    class="text-sky-300 font-bold">int</span> <span class="text-sky-200 font-bold">i</span> <span
                    class="text-pink-300 font-bold">=</span> <span class="text-orange-400 font-bold">0</span><span
                    class="text-stone-300">;</span> <span class="text-sky-200 font-bold">i</span> <span
                    class="text-pink-300 font-bold">&lt;</span> <span class="text-orange-400 font-bold">6</span><span
                    class="text-stone-300">;</span> <span class="text-emerald-300 font-bold">i++</span><span
                    class="text-stone-300">)</span> <span class="text-yellow-400 font-bold">&#123;</span>
                </div>
                <div class="pl-8"><span class="text-sky-300 font-bold">pinMode</span><span
                    class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                    class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                    class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-yellow-400 font-bold">&#125;</span></div>
                <div><span class="text-yellow-400 font-bold">&#125;</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- สถานการณ์ที่ 2: การสั่งไฟวิ่ง -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              สถานการณ์ที่ 2: การสั่งเปิด-ปิดไฟ LED ติดเรียงทีละดวงในฟังก์ชัน loop()
            </span>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Hardcode Card 2 -->
            <div class="p-4 rounded-2xl bg-stone-950 border border-rose-500/40 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                  แบบ Hardcode (ยาว 18 บรรทัด และปรับจำนวนไม่ได้)
                </span>
                <button @click="copyCode('hc_run', hardcodeRunCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'hc_run'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'hc_run' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <div class="font-mono text-xs leading-relaxed space-y-1 text-stone-200">
                <div><span class="text-stone-400 italic">// [Hardcode] สั่งไฟ LED 6 ดวงติด-ดับไล่ทีละดวง</span></div>
                <div><span class="text-purple-400 font-bold">void</span> <span
                    class="text-amber-300 font-bold">loop</span><span class="text-stone-300">()</span> <span
                    class="text-yellow-400 font-bold">&#123;</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">2</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">2</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">3</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">3</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">4</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">4</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">5</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">5</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">6</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">6</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">7</span><span
                    class="text-stone-300">,</span> <span class="text-emerald-300 font-bold">HIGH</span><span
                    class="text-stone-300">);</span> <span class="text-yellow-300">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span> <span class="text-sky-300">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">7</span><span
                    class="text-stone-300">,</span> <span class="text-rose-400 font-bold">LOW</span><span
                    class="text-stone-300">);</span></div>
                <div><span class="text-yellow-400 font-bold">&#125;</span></div>
              </div>
            </div>

            <!-- For Loop Card 2 -->
            <div class="p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  แบบใช้ For Loop (สั้น ยืดหยุ่น ปรับจำนวนดวงได้)
                </span>
                <button @click="copyCode('for_run', forLoopRunCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'for_run'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'for_run' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <div class="font-mono text-xs leading-relaxed space-y-1 text-stone-200">
                <div><span class="text-emerald-400/80 italic">// [For Loop] สั่งไฟ LED 6 ดวงติด-ดับไล่ทีละดวง</span>
                </div>
                <div><span class="text-purple-400 font-bold">const int</span> <span
                    class="text-sky-300 font-bold">ledPins</span><span class="text-stone-300">[</span><span
                    class="text-orange-400 font-bold">6</span><span class="text-stone-300">]</span> <span
                    class="text-pink-300 font-bold">=</span> <span class="text-yellow-400 font-bold">&#123;</span><span
                    class="text-orange-400">2</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">3</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">4</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">5</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">6</span><span class="text-stone-300">,</span> <span
                    class="text-orange-400">7</span><span class="text-yellow-400 font-bold">&#125;</span><span
                    class="text-stone-300">;</span></div>
                <div class="pt-1"><span class="text-purple-400 font-bold">void</span> <span
                    class="text-amber-300 font-bold">loop</span><span class="text-stone-300">()</span> <span
                    class="text-yellow-400 font-bold">&#123;</span></div>
                <div class="pl-4">
                  <span class="text-purple-400 font-bold">for</span> <span class="text-stone-300">(</span><span
                    class="text-sky-300 font-bold">int</span> <span class="text-sky-200 font-bold">i</span> <span
                    class="text-pink-300 font-bold">=</span> <span class="text-orange-400 font-bold">0</span><span
                    class="text-stone-300">;</span> <span class="text-sky-200 font-bold">i</span> <span
                    class="text-pink-300 font-bold">&lt;</span> <span class="text-orange-400 font-bold">6</span><span
                    class="text-stone-300">;</span> <span class="text-emerald-300 font-bold">i++</span><span
                    class="text-stone-300">)</span> <span class="text-yellow-400 font-bold">&#123;</span>
                </div>
                <div class="pl-8"><span class="text-sky-300 font-bold">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                    class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                    class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                    class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
                <div class="pl-8"><span class="text-yellow-300 font-bold">delay</span><span
                    class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                    class="text-stone-300">);</span></div>
                <div class="pl-8"><span class="text-sky-300 font-bold">digitalWrite</span><span
                    class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                    class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                    class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                    class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
                <div class="pl-4"><span class="text-yellow-400 font-bold">&#125;</span></div>
                <div><span class="text-yellow-400 font-bold">&#125;</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 รูปแบบการประยุกต์ใช้ For Loop ยอดนิยม (แยกการ์ด 4 สี ชัดเจน สบายตา) -->
      <div class="space-y-4 pt-4 border-t border-stone-200">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="space-y-0.5">
            <h3 class="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <Layers class="w-5 h-5 text-amber-600" />
              4 รูปแบบการประยุกต์ใช้ For Loop กับอาร์เรย์หลอดไฟ LED
            </h3>
            <p class="text-xs text-stone-600">จำแนกตามทิศทางและความเร็วในการนับรอบตัวแปร i (แยกเป็น 4 รูปแบบอย่างชัดเจน)
            </p>
          </div>
          <button @click="copyCode('patterns', fourLoopPatternsCode)"
            class="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Check v-if="copiedKey === 'patterns'" class="w-3.5 h-3.5 text-emerald-600" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copiedKey === 'patterns' ? 'คัดลอกครบทั้ง 4 รูปแบบแล้ว' : 'คัดลอกโค้ดทั้ง 4 รูปแบบ' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- รูปแบบที่ 1: วิ่งจากซ้ายไปขวา (ธีมสีอำพัน Amber) -->
          <div class="p-4 rounded-2xl bg-stone-950 border-2 border-amber-500/40 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2">
              <span
                class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                รูปแบบที่ 1 • วิ่งจากซ้ายไปขวา (i++)
              </span>
              <span class="text-[11px] text-stone-400 font-mono">0 ➔ 5</span>
            </div>
            <p class="text-xs text-stone-400">วิ่งเรียงตามลำดับดวงที่ 0 ถึง 5 โดยเพิ่มค่าตัวแปรทีละ 1 ด้วย
              <code>i++</code>
            </p>
            <div
              class="p-3 rounded-xl bg-black/80 font-mono text-xs leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300 font-bold">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">250</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>
            </div>
          </div>

          <!-- รูปแบบที่ 2: วิ่งย้อนกลับ (ธีมสีฟ้า Sky) -->
          <div class="p-4 rounded-2xl bg-stone-950 border-2 border-sky-500/40 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2">
              <span
                class="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-black">
                รูปแบบที่ 2 • วิ่งย้อนกลับขวามาซ้าย (i--)
              </span>
              <span class="text-[11px] text-stone-400 font-mono">5 ➔ 0</span>
            </div>
            <p class="text-xs text-stone-400">เริ่มต้นที่ดวงที่ 5 แล้วลดค่าตัวแปรลงทีละ 1 ด้วย <code>i--</code> จนถึง 0
            </p>
            <div
              class="p-3 rounded-xl bg-black/80 font-mono text-xs leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">5</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&gt;=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-rose-400 font-bold">i--</span><span class="text-stone-300 font-bold">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">250</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>
            </div>
          </div>

          <!-- รูปแบบที่ 3: วิ่งสเต็ปข้ามทีละ 2 ดวง (ธีมสีมรกต Emerald) -->
          <div class="p-4 rounded-2xl bg-stone-950 border-2 border-emerald-500/40 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2">
              <span
                class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                รูปแบบที่ 3 • วิ่งข้ามทีละ 2 ดวง (i += 2)
              </span>
              <span class="text-[11px] text-stone-400 font-mono">0, 2, 4 (ดวงคู่)</span>
            </div>
            <p class="text-xs text-stone-400">กระโดดข้ามทีละ 2 ดวง เหมาะสำหรับเล่นไฟสลับดวงคู่/ดวงคี่</p>
            <div
              class="p-3 rounded-xl bg-black/80 font-mono text-xs leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-cyan-400 font-bold">i += 2</span><span class="text-stone-300 font-bold">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">250</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>
            </div>
          </div>

          <!-- รูปแบบที่ 4: สั่งดับทุกดวงพร้อมกัน (ธีมสีม่วง Purple) -->
          <div class="p-4 rounded-2xl bg-stone-950 border-2 border-purple-500/40 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2">
              <span
                class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black">
                รูปแบบที่ 4 • สั่งดับไฟทุกดวงพร้อมกัน
              </span>
              <span class="text-[11px] text-stone-400 font-mono">Reset All LOW</span>
            </div>
            <p class="text-xs text-stone-400">วนลูปสั่ง <code>LOW</code> โดยไม่ใส่ delay เพื่อรีเซ็ตไฟทุกดวงให้ดับสนิท
            </p>
            <div
              class="p-3 rounded-xl bg-black/80 font-mono text-xs leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300 font-bold">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300 font-bold">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-4"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>
              <div class="text-stone-400 italic pt-1">// จบลูปในเสี้ยววินาที ไฟดับหมดทุกดวง</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- TOPIC 3: สาธิตพาใช้ FOR LOOP กับไฟ LED 6 ดวงเฉยๆ (ไม่มีปุ่ม)     -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-amber-600 uppercase tracking-wider">Topic 3 • Hands-on
            Demonstration</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2.5">
            <Lightbulb class="w-7 h-7 text-amber-500 shrink-0" />
            สาธิตการใช้ For Loop กับไฟ LED 6 ดวง (Pure 6-LED Circuit)
          </h2>
        </div>
        <span
          class="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start">
          วงจรไฟ 6 ดวงล้วนๆ ไม่มีปุ่มกด
        </span>
      </div>

      <div
        class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
        <div class="font-bold text-amber-900 flex items-center gap-2">
          <Info class="w-4 h-4 text-amber-700" />
          <span>แนวทางการสาธิตในห้องเรียน:</span>
        </div>
        <p>
          ในขั้นตอนนี้ เราจะต่อวงจรและเขียนโปรแกรมควบคุม <strong>หลอดไฟ LED 6 ดวงล้วนๆ (ยังไม่มีปุ่มกด)</strong>
          เพื่อให้เห็นว่าคำสั่ง <code>for loop</code> สามารถนำมาสร้างลวดลายไฟวิ่งที่หลากหลาย เช่น ไฟวิ่งทางเดียว,
          ไฟวิ่งไป-กลับสไตล์ Knight Rider และไฟติดสะสมเป็นแถบบาร์กราฟได้อย่างไร
        </p>
      </div>

      <!-- ตารางการต่อวงจร 6 LEDs -->
      <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h3 class="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <Cable class="w-5 h-5 text-amber-600" />
            ตารางการต่อวงจรฮาร์ดแวร์ไฟ LED 6 ดวง (ต่อเข้า Digital Pin 2 ถึง Pin 7)
          </h3>
          <span class="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
            ใช้ตัวต้านทาน 220Ω ต่ออนุกรมกับ LED ทุกดวง
          </span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table class="w-full text-xs text-left text-stone-700">
            <thead class="bg-stone-100 text-stone-800 font-black border-b border-stone-200">
              <tr>
                <th class="p-3">อุปกรณ์</th>
                <th class="p-3">ตำแหน่งใน Array</th>
                <th class="p-3">ต่อเข้าขา Arduino</th>
                <th class="p-3">รายละเอียดการต่อวงจร</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200 font-medium">
              <tr v-for="(led, idx) in ledConfigs" :key="led.pin" class="hover:bg-amber-50/40">
                <td class="p-3 font-black text-stone-900 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full shrink-0 shadow-sm" :class="led.dotBg"></span>
                  หลอดไฟ LED ดวงที่ {{ idx + 1 }}
                  <span class="text-xs font-bold" :class="led.textColor">({{ led.colorName }})</span>
                </td>
                <td class="p-3 font-mono text-amber-700 font-bold">ledPins[{{ idx }}]</td>
                <td class="p-3">
                  <span class="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                    Digital Pin {{ led.pin }}
                  </span>
                </td>
                <td class="p-3 text-stone-600">
                  ขาบวก (Anode) ต่อผ่านตัวต้านทาน <strong>220Ω</strong> เข้า Pin {{ led.pin }} / ขาลบ (Cathode) ต่อลง
                  <strong>GND</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- โค้ดสาธิต 3 รูปแบบ (เน้นแยกสีและจัดรูปแบบให้อ่านง่าย สบายตา) -->
      <div class="space-y-4">
        <div class="space-y-0.5">
          <h3 class="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <FileCode2 class="w-5 h-5 text-amber-600" />
            โค้ดสาธิต 3 รูปแบบยอดนิยม สำหรับไฟ LED 6 ดวง
          </h3>
          <p class="text-xs text-stone-600">แสดงไวยากรณ์คำสั่ง Arduino C++ แยกสีชัดเจน (Keywords, Functions, Numbers,
            Comments)</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- แบบที่ 1: ไฟวิ่งทางเดียว -->
          <div
            class="p-5 rounded-2xl bg-stone-950 border-2 border-amber-500/40 shadow-sm flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2">
                <span
                  class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                  สาธิต 1 • วิ่งทางเดียว (0 ➔ 5)
                </span>
                <button @click="copyCode('demo_fwd', demo6LedForwardCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'demo_fwd'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'demo_fwd' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <h4 class="font-bold text-white text-sm">ไฟวิ่งจากซ้ายไปขวา</h4>
              <p class="text-[11px] text-stone-400">ใช้ <code>for (int i = 0; i &lt; 6; i++)</code>
                วิ่งเรียงทีละดวงแล้ววนซ้ำ</p>
            </div>

            <div
              class="p-4 rounded-xl bg-black/80 font-mono text-[11px] leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-stone-400 italic">// กำหนดขา Pin 2 ถึง 7 ใน Array</span></div>
              <div><span class="text-purple-400 font-bold">const int</span> <span
                  class="text-sky-300 font-bold">ledPins</span><span class="text-stone-300">[</span><span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">]</span> <span
                  class="text-pink-300 font-bold">=</span> <span class="text-yellow-400 font-bold">&#123;</span><span
                  class="text-orange-400">2</span><span class="text-stone-300">,</span> <span
                  class="text-orange-400">3</span><span class="text-stone-300">,</span> <span
                  class="text-orange-400">4</span><span class="text-stone-300">,</span> <span
                  class="text-orange-400">5</span><span class="text-stone-300">,</span> <span
                  class="text-orange-400">6</span><span class="text-stone-300">,</span> <span
                  class="text-orange-400">7</span><span class="text-yellow-400 font-bold">&#125;</span><span
                  class="text-stone-300">;</span></div>

              <div class="pt-2"><span class="text-purple-400 font-bold">void</span> <span
                  class="text-amber-300 font-bold">setup</span><span class="text-stone-300">()</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-6"><span class="text-sky-300 font-bold">pinMode</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">OUTPUT</span><span class="text-stone-300">);</span></div>
              <div class="pl-6"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>

              <div class="pt-2"><span class="text-purple-400 font-bold">void</span> <span
                  class="text-amber-300 font-bold">loop</span><span class="text-stone-300">()</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-stone-400 italic">// วิ่งจากดวงที่ 0 ถึง 5</span></div>
              <div class="pl-3"><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-6"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-6"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">250</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-6"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>
              <div><span class="text-yellow-400 font-bold">&#125;</span></div>
            </div>
          </div>

          <!-- แบบที่ 2: วิ่งไป-กลับ Knight Rider -->
          <div
            class="p-5 rounded-2xl bg-stone-950 border-2 border-sky-500/40 shadow-sm flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2">
                <span
                  class="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-black">
                  สาธิต 2 • ไป-กลับ (Knight Rider)
                </span>
                <button @click="copyCode('demo_bnc', demo6LedBounceCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'demo_bnc'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'demo_bnc' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <h4 class="font-bold text-white text-sm">ไฟวิ่งไป-กลับสไตล์สปอร์ต</h4>
              <p class="text-[11px] text-stone-400">ใช้ลูปขาไป <code>i++</code> ต่อด้วยลูปขากลับ <code>i--</code>
                ต่อเนื่องกัน</p>
            </div>

            <div
              class="p-4 rounded-xl bg-black/80 font-mono text-[11px] leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-stone-400 italic">// ขาไป: ซ้ายไปขวา (0 -> 5)</span></div>
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">150</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>

              <div class="pt-2"><span class="text-stone-400 italic">// ขากลับ: ขวามาซ้าย (4 ลงมา 1)</span></div>
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">4</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&gt;</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-rose-400 font-bold">i--</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">150</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>
            </div>
          </div>

          <!-- แบบที่ 3: ติดสะสม Bar Graph -->
          <div
            class="p-5 rounded-2xl bg-stone-950 border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-stone-800 pb-2">
                <span
                  class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  สาธิต 3 • ติดสะสม (Bar Graph)
                </span>
                <button @click="copyCode('demo_stk', demo6LedStackCode)"
                  class="text-stone-400 hover:text-white text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Check v-if="copiedKey === 'demo_stk'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'demo_stk' ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
              <h4 class="font-bold text-white text-sm">ไฟติดสะสมทีละดวงจนเต็ม</h4>
              <p class="text-[11px] text-stone-400">เปิดค้างไว้ทีละดวงจนครบ 6 ดวง แล้วสั่งดับพร้อมกันด้วยอีกหนึ่งลูป</p>
            </div>

            <div
              class="p-4 rounded-xl bg-black/80 font-mono text-[11px] leading-relaxed space-y-1 border border-stone-800/80 text-stone-200">
              <div><span class="text-stone-400 italic">// 1. สั่งเปิดไฟสะสมทีละดวง</span></div>
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-emerald-300 font-bold">HIGH</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">200</span><span
                  class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>

              <div class="pt-1"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">600</span><span
                  class="text-stone-300">);</span> <span class="text-stone-400 italic">// ค้างไว้ครู่หนึ่ง</span></div>

              <div class="pt-1"><span class="text-stone-400 italic">// 2. สั่งดับทุกดวงพร้อมกันด้วย For loop</span>
              </div>
              <div><span class="text-purple-400 font-bold">for</span> <span
                  class="text-stone-300 font-bold">(</span><span class="text-sky-300 font-bold">int</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">=</span> <span
                  class="text-orange-400 font-bold">0</span><span class="text-stone-300">;</span> <span
                  class="text-sky-200 font-bold">i</span> <span class="text-pink-300 font-bold">&lt;</span> <span
                  class="text-orange-400 font-bold">6</span><span class="text-stone-300">;</span> <span
                  class="text-emerald-300 font-bold">i++</span><span class="text-stone-300">)</span> <span
                  class="text-yellow-400 font-bold">&#123;</span></div>
              <div class="pl-3"><span class="text-sky-300 font-bold">digitalWrite</span><span
                  class="text-stone-300">(</span><span class="text-sky-200">ledPins</span><span
                  class="text-stone-300">[</span><span class="text-sky-200">i</span><span
                  class="text-stone-300">]</span><span class="text-stone-300">,</span> <span
                  class="text-rose-400 font-bold">LOW</span><span class="text-stone-300">);</span></div>
              <div class="pl-3"><span class="text-yellow-400 font-bold">&#125;</span></div>

              <div class="pt-1"><span class="text-yellow-300 font-bold">delay</span><span
                  class="text-stone-300">(</span><span class="text-orange-400 font-bold">400</span><span
                  class="text-stone-300">);</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE 6-LED PLAYGROUND SIMULATOR -->
      <div class="rounded-3xl p-6 sm:p-8 bg-stone-950 border-2 border-stone-800 text-white shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div class="space-y-1">
            <span
              class="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
              Pure 6-LED Playground Simulator
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Cpu class="w-6 h-6 text-amber-400" />
              ห้องทดลองจำลองการทำงาน: ไฟ LED 6 ดวง
            </h3>
            <p class="text-xs text-stone-400">
              ทดลองสลับรูปแบบไฟวิ่ง ปรับความเร็ว แล้วกดเริ่มรันเพื่อสังเกตการทำงานของ For Loop แบบสดๆ
            </p>
          </div>

          <!-- Simulator Action Buttons -->
          <div class="flex items-center gap-2">
            <button v-if="!demoIsRunning" @click="startDemo"
              class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all">
              <Play class="w-3.5 h-3.5" />
              <span>เริ่มเล่นสาธิต (Start)</span>
            </button>
            <button v-else @click="pauseDemo"
              class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all">
              <StopCircle class="w-3.5 h-3.5" />
              <span>หยุดชั่วคราว (Pause)</span>
            </button>
            <button @click="resetDemo"
              class="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-stone-700">
              <RefreshCw class="w-3.5 h-3.5" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>

        <!-- Pattern Selector Tabs & Speed Slider -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-7 flex flex-wrap gap-2">
            <button @click="changeDemoPattern('forward')"
              class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
              :class="demoPattern === 'forward' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'">
              1. วิ่งทางเดียว (0 -> 5)
            </button>
            <button @click="changeDemoPattern('pingpong')"
              class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
              :class="demoPattern === 'pingpong' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'">
              2. วิ่งไป-กลับ (Knight Rider)
            </button>
            <button @click="changeDemoPattern('stack')"
              class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
              :class="demoPattern === 'stack' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'">
              3. ติดสะสม (Bar Graph)
            </button>
          </div>

          <!-- Speed Slider -->
          <div class="md:col-span-5 flex items-center gap-3 bg-stone-900/90 p-3 rounded-2xl border border-stone-800">
            <Clock class="w-4 h-4 text-amber-400 shrink-0" />
            <div class="flex-1 space-y-1">
              <div class="flex justify-between text-[11px] font-bold">
                <span class="text-stone-300">ความเร็วหน่วงเวลา (delay):</span>
                <span class="font-mono text-amber-300">{{ demoSpeedMs }} ms</span>
              </div>
              <input type="range" min="80" max="800" step="20" v-model.number="demoSpeedMs"
                class="w-full accent-amber-500 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- 6 LEDs Graphical Display (Clean without frames, 6 distinct colors) -->
        <div class="p-6 rounded-3xl bg-black/70 border border-stone-800 space-y-5">
          <div class="flex items-center justify-between text-xs text-stone-400">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              สถานะหลอดไฟ LED 6 ดวงบนบอร์ด (6 สีแยกชัดเจน)
            </span>
            <span
              class="font-mono text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
              ตัวแปร i = {{ demoCurrentI === null ? '-' : demoCurrentI }} | ขา Pin = {{ demoCurrentI !== null ?
                demoCurrentI + 2 : '-' }}
            </span>
          </div>

          <!-- Clean row of LED lights without individual box frames -->
          <div class="py-5 px-3 rounded-2xl bg-stone-950/60 border border-stone-900">
            <div class="grid grid-cols-6 gap-2 sm:gap-4 items-end text-center">
              <div v-for="(led, i) in ledConfigs" :key="led.pin"
                class="flex flex-col items-center justify-center transition-all duration-150 relative py-2">
                <!-- Pin label on top -->
                <div class="text-[10px] sm:text-xs font-mono text-stone-400 font-semibold mb-2">
                  Pin {{ led.pin }}
                </div>

                <!-- Realistic LED bulb dome (no box, just the lightbulb with distinct color) -->
                <div class="relative flex items-center justify-center my-1">
                  <!-- Glow halo when active -->
                  <div v-if="(demoPattern === 'stack' ? demoStacked[i] : demoActiveIndex === i)"
                    class="absolute inset-0 rounded-full blur-xl scale-150 transition-opacity duration-150"
                    :class="led.haloColor"></div>

                  <!-- The LED bulb itself -->
                  <div
                    class="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-150 border-2 relative z-10"
                    :class="[
                      (demoPattern === 'stack' ? demoStacked[i] : demoActiveIndex === i)
                        ? [led.onBulb, 'scale-110']
                        : [led.offBulb, 'opacity-70 scale-95']
                    ]">
                    <Lightbulb class="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>

                <!-- Label below bulb -->
                <div class="mt-2 text-xs font-bold text-stone-200">
                  LED {{ i + 1 }}
                </div>
                <!-- Color tag -->
                <div class="text-[11px] font-semibold mt-0.5" :class="led.textColor">
                  {{ led.colorName }}
                </div>
                <!-- i index -->
                <div class="text-[10px] font-mono text-stone-500 mt-0.5">
                  i = {{ i }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 5: MINI-GAMES & POST-TEST                              -->
    <!-- ============================================================== -->
    <GameCenterSection :course-id="currentCourseId" :week="currentWeek"
      drag-title="มินิเกมที่ 1: จำแนกโครงสร้าง For Loop และหน้าที่ของปุ่มกดทั้ง 2 ปุ่ม"
      drag-subtitle="ลากชุดคำสั่งด้านล่างไปวางในหมวดหมู่ให้ถูกต้องครบทั้ง 6 ข้อ (เล่นได้ครั้งเดียว)"
      :drag-items="dragItemsData" :drag-zones="dragZonesData"
      match-title="มินิเกมที่ 2: จับคู่ส่วนประกอบของ For Loop, Array และ State"
      match-subtitle="จับคู่โค้ดด้านซ้ายกับคำอธิบายการทำงานด้านขวาให้ถูกต้องครบทั้ง 5 คู่ (เล่นได้ครั้งเดียว)"
      :match-left-terms="matchLeftTerms" :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบหลังเรียนสัปดาห์ที่ 4 (For Loop & State Machine)"
      quiz-subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจเรื่อง For Loop, Array และการควบคุมไฟวิ่งด้วย 2 ปุ่มกด"
      :quiz-questions="quizQuestions" :games="weekGames" />

    <!-- ============================================================== -->
    <!-- SECTION 6: ASSIGNMENT 4 (2 BUTTONS + 6 LEDS FOR LOOP)          -->
    <!-- ============================================================== -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-4"
      assignment-title="ใบงานที่ 4: การนำ State มารวมกับ For Loop ควบคุมไฟวิ่ง LED 6 ดวง ด้วยปุ่มกด 2 ปุ่ม บน Tinkercad"
      :max-score="10">
      <template #number>4</template>
      <template #description>
        <p class="leading-relaxed">
          ให้นักศึกษาต่อวงจรและเขียนโปรแกรมภาษา C++ บน <strong>Autodesk Tinkercad Circuits</strong>
          โดยนำแนวคิดการเก็บค่าสถานะ (<strong>State</strong>)
          มารวมกับคำสั่งวนซ้ำ (<strong>For Loop</strong>) ประกอบด้วย <strong>สวิตช์ปุ่มกด 2 ปุ่ม</strong> และ
          <strong>หลอดไฟ LED 6 ดวง</strong>:
          <br />• <strong>ปุ่มแรก (Setup Button):</strong> กดเพื่อตั้งค่าว่าจะให้ไฟวิ่งกี่ดวง (1 ถึง 6 ดวง)
          พร้อมแสดงค่าที่ตั้งไว้ผ่าน <strong>Serial Monitor</strong>
          <br />• <strong>ปุ่มที่สอง (Play Button):</strong> เมื่อกดปุ่มเล่น ไฟ LED จะวิ่งเรียงตามจำนวนดวงที่ตั้งค่าไว้
          <strong>จำนวน 1 รอบ</strong> แล้วหยุดรอคำสั่งต่อไป
        </p>
      </template>

      <template #tasks>
        <div class="space-y-8">
          <!-- แบนเนอร์ภารกิจ -->
          <div
            class="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-md space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full bg-black/25 text-amber-100 text-xs font-black border border-white/15">
                ภารกิจปฏิบัติการรายบุคคล • 10 คะแนนเต็ม
              </span>
              <span class="px-3 py-1 rounded-xl bg-white/20 text-white text-xs font-black flex items-center gap-1.5">
                <Trophy class="w-4 h-4 text-amber-200" />
                ตรวจการทำงานจริง + ส่งลิงก์ Tinkercad
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black">
              ระบบตั้งค่าและสั่งเล่นไฟวิ่ง LED 6 ดวง ด้วยปุ่มกด 2 ปุ่ม (State + For Loop)
            </h3>
            <p class="text-xs sm:text-sm text-amber-50 leading-relaxed">
              ฝึกฝนการประยุกต์ใช้คำสั่ง <code>for (int i = 0; i &lt; ledCount; i++)</code> ร่วมกับตัวแปรสถานะ
              <code>ledCount</code>
              โดยปุ่มแรกทำหน้าที่เปลี่ยนค่าและแสดงผลผ่าน Serial Monitor ส่วนปุ่มที่สองทำหน้าที่สั่งรันลูปไฟวิ่ง 1
              รอบตามค่าที่ตั้งไว้
            </p>
          </div>

          <!-- แนวคิดการแยก 2 ปุ่มกด -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- ปุ่มที่ 1: ปุ่มตั้งค่า -->
            <div class="rounded-2xl p-6 bg-sky-50/70 border-2 border-sky-200 space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-black">
                  ปุ่มที่ 1 (Pin 8) • Setup Button
                </span>
                <span class="font-mono text-xs font-bold text-sky-800">เก็บค่าในตัวแปร ledCount</span>
              </div>
              <h3 class="text-lg font-black text-stone-900">
                กดเพื่อตั้งค่าว่าจะให้ไฟวิ่งกี่ดวง (1 - 6 ดวง) + แสดงผ่าน Serial Monitor
              </h3>
              <ul class="space-y-2 text-xs sm:text-sm text-stone-700 list-disc pl-5 leading-relaxed">
                <li>ใช้ตัวแปร <code>int ledCount = 1;</code> เก็บจำนวนดวงไฟที่ต้องการให้วิ่ง</li>
                <li>ตรวจจับจังหวะกด (Falling Edge) เพื่อเพิ่มค่า <code>ledCount++</code> ทีละ 1</li>
                <li>หากค่าเกิน 6 ดวง (<code>if (ledCount &gt; 6) ledCount = 1;</code>) จะวนกลับมาเริ่มต้นที่ 1 ดวงใหม่
                </li>
                <li>พิมพ์แจ้งค่าปัจจุบันออกทาง <strong>Serial Monitor</strong> ทันที</li>
              </ul>
            </div>

            <!-- ปุ่มที่ 2: ปุ่มเล่น -->
            <div class="rounded-2xl p-6 bg-emerald-50/70 border-2 border-emerald-200 space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black">
                  ปุ่มที่ 2 (Pin 9) • Play Button
                </span>
                <span class="font-mono text-xs font-bold text-emerald-800">รัน for (int i = 0; i &lt; ledCount;
                  i++)</span>
              </div>
              <h3 class="text-lg font-black text-stone-900">
                กดเพื่อสั่งเล่นให้ไฟวิ่งตามที่ตั้งค่าไว้ 1 รอบ
              </h3>
              <ul class="space-y-2 text-xs sm:text-sm text-stone-700 list-disc pl-5 leading-relaxed">
                <li>เมื่อตรวจพบการกดปุ่มที่ 2 โปรแกรมจะเข้าสู่คำสั่ง <code>for (int i = 0; i &lt; ledCount; i++)</code>
                </li>
                <li>ในแต่ละรอบจะสั่งเปิดไฟดวงที่ <code>ledPins[i]</code> ค้างไว้ <code>300 ms</code> แล้วสั่งดับ
                  ก่อนขยับไปดวงถัดไป</li>
                <li>เมื่อครบตามจำนวน <code>ledCount</code> ที่ตั้งไว้ ลูปจะจบลงอัตโนมัติ (<strong>วิ่งเพียง 1
                    รอบ</strong>) แล้วหยุดรอรับการกดครั้งต่อไป</li>
              </ul>
            </div>
          </div>

          <!-- ตารางการต่อวงจรฮาร์ดแวร์สำหรับใบงาน -->
          <div class="rounded-2xl p-6 bg-stone-50 border border-stone-200 space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
                <Cable class="w-5 h-5 text-amber-600" />
                ตารางการต่อวงจรฮาร์ดแวร์บน Tinkercad (ไฟ LED 6 ดวง + ปุ่มกด 2 ปุ่ม)
              </h4>
              <span class="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                ต่อสวิตช์ปุ่มกดลง GND แบบ INPUT_PULLUP
              </span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table class="w-full text-xs text-left text-stone-700">
                <thead class="bg-stone-100 text-stone-800 font-black border-b border-stone-200">
                  <tr>
                    <th class="p-3">อุปกรณ์ (Component)</th>
                    <th class="p-3">ตำแหน่งในโค้ด (Variable / Array)</th>
                    <th class="p-3">ต่อเข้าขา Arduino Uno</th>
                    <th class="p-3">รายละเอียดการต่อวงจร</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-200 font-medium">
                  <tr v-for="n in 6" :key="n" class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-stone-900 flex items-center gap-1.5">
                      <Lightbulb class="w-4 h-4 text-amber-500 shrink-0" />
                      หลอดไฟ LED ดวงที่ {{ n }}
                    </td>
                    <td class="p-3 font-mono text-amber-700 font-bold">ledPins[{{ n - 1 }}]</td>
                    <td class="p-3">
                      <span class="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                        Digital Pin {{ n + 1 }}
                      </span>
                    </td>
                    <td class="p-3 text-stone-600">
                      ขาบวก (Anode) ต่อผ่านตัวต้านทาน <strong>220Ω</strong> เข้า Pin {{ n + 1 }} / ขาลบ (Cathode) ต่อลง
                      <strong>GND</strong>
                    </td>
                  </tr>
                  <tr class="bg-sky-50/40 hover:bg-sky-50">
                    <td class="p-3 font-black text-sky-900 flex items-center gap-1.5">
                      <ToggleLeft class="w-4 h-4 text-sky-600 shrink-0" />
                      ปุ่มกดที่ 1 (ปุ่มตั้งค่าจำนวนไฟ)
                    </td>
                    <td class="p-3 font-mono text-sky-700 font-bold">BTN_SET_PIN</td>
                    <td class="p-3">
                      <span class="px-2.5 py-0.5 rounded bg-sky-100 text-sky-900 font-mono font-bold">
                        Digital Pin 8
                      </span>
                    </td>
                    <td class="p-3 text-stone-700">
                      ขาฝั่งหนึ่งต่อเข้า <strong>Pin 8</strong> และขาอีกฝั่งต่อลง <strong>GND</strong> (ใช้โหมด
                      <code>INPUT_PULLUP</code>)
                    </td>
                  </tr>
                  <tr class="bg-emerald-50/40 hover:bg-emerald-50">
                    <td class="p-3 font-black text-emerald-900 flex items-center gap-1.5">
                      <PlayCircle class="w-4 h-4 text-emerald-600 shrink-0" />
                      ปุ่มกดที่ 2 (ปุ่มเล่นไฟวิ่ง 1 รอบ)
                    </td>
                    <td class="p-3 font-mono text-emerald-700 font-bold">BTN_PLAY_PIN</td>
                    <td class="p-3">
                      <span class="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold">
                        Digital Pin 9
                      </span>
                    </td>
                    <td class="p-3 text-stone-700">
                      ขาฝั่งหนึ่งต่อเข้า <strong>Pin 9</strong> และขาอีกฝั่งต่อลง <strong>GND</strong> (ใช้โหมด
                      <code>INPUT_PULLUP</code>)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- INTERACTIVE HARDWARE SIMULATOR (2 BUTTONS + 6 LEDS + SERIAL) -->
          <div class="rounded-3xl p-6 sm:p-8 bg-stone-900 border-2 border-stone-800 text-white shadow-2xl space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    class="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                    Interactive Hardware Simulator
                  </span>
                  <span v-if="simIsRunning" class="text-xs font-bold text-emerald-400 animate-pulse">
                    • กำลังรัน For Loop วิ่งไฟ...
                  </span>
                </div>
                <h4 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Cpu class="w-6 h-6 text-amber-400" />
                  จำลองการทำงานจริง: 2 ปุ่มกด + ไฟ LED 6 ดวง + Serial Monitor
                </h4>
                <p class="text-xs text-stone-400">
                  ทดลองกด <strong>ปุ่มที่ 1</strong> เพื่อเลือกจำนวนไฟ 1-6 ดวง และกด <strong>ปุ่มที่ 2</strong>
                  เพื่อสั่งไฟวิ่ง 1 รอบเพื่อเข้าใจโจทย์ก่อนลงมือทำจริง!
                </p>
              </div>

              <button @click="resetSimulator"
                class="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer">
                <RefreshCw class="w-3.5 h-3.5" />
                <span>รีเซ็ตวงจร</span>
              </button>
            </div>

            <!-- 6 LEDs Display Board -->
            <div class="p-5 rounded-2xl bg-black/50 border border-stone-800 space-y-4">
              <div class="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div class="text-stone-300 font-bold flex items-center gap-2">
                  <Lightbulb class="w-4 h-4 text-amber-400" />
                  <span>แผงหลอดไฟ LED 6 ดวง (Pin 2 ถึง Pin 7)</span>
                </div>
                <div class="flex items-center gap-3 font-mono">
                  <span class="px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">
                    State (ledCount) = {{ simLedCount }} ดวง
                  </span>
                  <span
                    class="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    For Loop (i) = {{ simLoopVarI === null ? 'รอสั่งรัน' : simLoopVarI }}
                  </span>
                </div>
              </div>

              <!-- Clean row of LED lights without individual box frames -->
              <div class="py-5 px-3 rounded-2xl bg-stone-950/60 border border-stone-900">
                <div class="grid grid-cols-6 gap-2 sm:gap-4 items-end text-center">
                  <div v-for="(led, i) in ledConfigs" :key="led.pin"
                    class="flex flex-col items-center justify-center transition-all duration-200 relative py-2" :class="[
                      i < simLedCount ? 'opacity-100' : 'opacity-40'
                    ]">
                    <!-- Pin & Range status -->
                    <div class="flex flex-col items-center text-[10px] sm:text-xs font-mono mb-2">
                      <span class="text-stone-400 font-semibold">Pin {{ led.pin }}</span>
                      <span class="text-[9px] px-1.5 py-0.5 rounded-full mt-1 font-bold"
                        :class="i < simLedCount ? 'text-sky-300 bg-sky-500/20 border border-sky-500/40' : 'text-stone-500 bg-stone-800/80'">
                        {{ i < simLedCount ? 'ในรอบ' : 'ข้าม' }} </span>
                    </div>

                    <!-- Realistic LED bulb dome (no box frame) -->
                    <div class="relative flex items-center justify-center my-1">
                      <!-- Glow halo when active -->
                      <div v-if="simActiveLedIndex === i"
                        class="absolute inset-0 rounded-full blur-xl scale-150 transition-opacity duration-150"
                        :class="led.haloColor"></div>

                      <!-- The LED bulb itself with distinct color -->
                      <div
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-150 border-2 relative z-10"
                        :class="[
                          simActiveLedIndex === i
                            ? [led.onBulb, 'scale-110']
                            : [led.offBulb, 'scale-95']
                        ]">
                        <Lightbulb class="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>

                    <!-- Label below bulb -->
                    <div class="mt-2 text-xs font-bold text-stone-200">
                      LED {{ i + 1 }}
                    </div>
                    <!-- Color tag -->
                    <div class="text-[11px] font-semibold mt-0.5" :class="led.textColor">
                      {{ led.colorName }}
                    </div>
                    <div class="text-[10px] font-mono text-stone-500 mt-0.5">
                      ledPins[{{ i }}]
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2 Buttons Controls & Serial Monitor -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <!-- Buttons -->
              <div class="lg:col-span-5 space-y-4">
                <!-- Button 1: Setup -->
                <div class="p-4 rounded-2xl bg-sky-950/40 border border-sky-700/50 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-sky-300">ปุ่มที่ 1 • Digital Pin 8</span>
                    <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 text-[10px] font-bold">
                      ค่าปัจจุบัน: {{ simLedCount }} ดวง
                    </span>
                  </div>
                  <h5 class="text-sm font-black text-white">ปุ่มตั้งค่าจำนวนไฟ (Setup Button)</h5>
                  <button @click="pressSetupButton"
                    class="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <SlidersHorizontal class="w-4 h-4" />
                    <span>กดปุ่มที่ 1: ตั้งค่าจำนวนไฟ (เพิ่มเป็น {{ (simLedCount % 6) + 1 }} ดวง)</span>
                  </button>
                </div>

                <!-- Button 2: Play -->
                <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-emerald-300">ปุ่มที่ 2 • Digital Pin 9</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-bold">
                      วิ่ง 1 รอบ ({{ simLedCount }} ดวง)
                    </span>
                  </div>
                  <h5 class="text-sm font-black text-white">ปุ่มสั่งเล่น (Play Button)</h5>
                  <button @click="pressPlayButton" :disabled="simIsRunning"
                    class="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 active:scale-95 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <Play class="w-4 h-4" />
                    <span>{{ simIsRunning ? 'ไฟกำลังวิ่ง...' : `กดปุ่มที่ 2: เล่นไฟวิ่ง ${simLedCount} ดวง (1 รอบ)`
                    }}</span>
                  </button>
                </div>
              </div>

              <!-- Serial Monitor Output -->
              <div
                class="lg:col-span-7 p-4 rounded-2xl bg-black border border-stone-800 font-mono text-xs flex flex-col justify-between space-y-3">
                <div class="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span class="text-amber-400 font-bold flex items-center gap-2">
                    <Terminal class="w-4 h-4" />
                    Serial Monitor (9600 baud)
                  </span>
                  <span class="text-[10px] text-stone-500">พิมพ์ผลเรียลไทม์</span>
                </div>

                <div class="h-48 overflow-y-auto space-y-1.5 pr-1">
                  <div v-for="(line, i) in simSerialLines" :key="i" class="flex items-start gap-2 leading-relaxed">
                    <span class="text-stone-600 shrink-0">[{{ line.time }}]</span>
                    <span :class="[
                      line.type === 'set' ? 'text-sky-400 font-bold' :
                        line.type === 'play' ? 'text-emerald-400 font-bold' :
                          line.type === 'loop' ? 'text-amber-300' :
                            line.type === 'warn' ? 'text-rose-400 font-bold' :
                              'text-stone-300'
                    ]">
                      {{ line.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ขั้นตอนการปฏิบัติและเกณฑ์การให้คะแนน -->
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
            <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
              <ListOrdered class="w-5 h-5 text-amber-600" />
              ขั้นตอนการปฏิบัติและเกณฑ์การให้คะแนน (10 คะแนนเต็ม)
            </h4>
            <ol class="space-y-3 text-xs sm:text-sm text-stone-700 list-decimal pl-5 leading-relaxed">
              <li>
                <strong>การต่อวงจรบน Tinkercad (3 คะแนน):</strong> วางบอร์ด Arduino Uno R3, Breadboard, ต่อหลอดไฟ LED 6
                ดวง (ขา Pin 2 ถึง Pin 7) พร้อมตัวต้านทาน 220Ω ทุกดวง และต่อสวิตช์ปุ่มกด 2 ปุ่ม (ปุ่มตั้งค่าที่ Pin 8
                และปุ่มเล่นที่ Pin 9) ขาอีกฝั่งลงกราวด์ GND ให้ถูกต้องเรียบร้อย
              </li>
              <li>
                <strong>การทำงานของปุ่มที่ 1 - ปุ่มตั้งค่าและ Serial Monitor (3 คะแนน):</strong> เมื่อกดปุ่มแรก
                สามารถเพิ่มจำนวนไฟที่จะวิ่ง (1 ถึง 6 ดวง และเมื่อเกิน 6 วนกลับเป็น 1 ได้)
                พร้อมส่งข้อความแจ้งจำนวนดวงปัจจุบันออกทางหน้าจอ Serial Monitor อย่างถูกต้อง
              </li>
              <li>
                <strong>การทำงานของปุ่มที่ 2 - ปุ่มเล่นด้วยคำสั่ง For Loop (4 คะแนน):</strong> เมื่อกดปุ่มที่สอง
                โปรแกรมใช้คำสั่ง <code>for (int i = 0; i &lt; ledCount; i++)</code> สั่งให้ไฟ LED
                วิ่งเรียงลำดับตามจำนวนที่ตั้งค่าไว้ <strong>1 รอบ</strong> แล้วหยุดรอคำสั่งต่อไปได้อย่างแม่นยำ
              </li>
            </ol>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal v-if="showTeacherModal" :course-id="currentCourseId" :week="currentWeek" :games="weekGames"
      @close="showTeacherModal = false" />
  </div>
</template>
