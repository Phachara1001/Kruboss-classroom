<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  RotateCw, Cpu, Lightbulb, AlertTriangle, Zap, Terminal,
  Book, FileText, Target, Award, Layers, Radio, RefreshCw,
  ListOrdered, ChevronRight, Activity, Trophy, Play, Copy,
  Check, Cable, ToggleLeft, CheckCircle2, XCircle, SlidersHorizontal,
  Code2, ShieldCheck, Info, ArrowRight, PlayCircle, StopCircle
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import TinkercadLed from '@/components/iot/TinkercadLed.vue'
import TinkercadBuzzer from '@/components/iot/TinkercadBuzzer.vue'
import TinkercadPushButton from '@/components/iot/TinkercadPushButton.vue'
import TinkercadUltrasonicRadar from '@/components/iot/TinkercadUltrasonicRadar.vue'
import ArduinoCodeWalkthrough from '@/components/iot/ArduinoCodeWalkthrough.vue'
import WhileLoopWorkshop from '@/components/iot/WhileLoopWorkshop.vue'

import { authUser } from '@/data/authStore'
import { isTeacherUser } from '@/data/studentsStore'
import { fetchGameScores } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 5
const showTeacherModal = ref(false)
const isTeacher = computed(() => isTeacherUser(authUser.value))

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกองค์ประกอบ While Loop และอุปกรณ์ HC-SR04)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำสั่ง While Loop และขาพิน/สูตร HC-SR04)', maxScore: 6, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 5 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
]

onMounted(() => {
  fetchGameScores(currentCourseId, currentWeek)
})

// High-Contrast Importance-Based Arduino Syntax Highlighter
const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const highlightArduinoCode = (code) => {
  const tokenRe =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(while|do|for|if|else|return|break|continue)\b|\b(const|int|long|float|void|bool)\b|\b(pinMode|digitalWrite|digitalRead|delay|delayMicroseconds|tone|noTone|pulseIn|Serial|begin|print|println|getDistance|setup|loop)\b|\b(HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|true|false|BTN_PIN|STOP_BTN|LED_RED|LED_GREEN|BUZZER|TRIG_PIN|ECHO_PIN|DANGER_DISTANCE)\b|\b(\d+(?:\.\d+)?)\b/g

  return code
    .split('\n')
    .map((rawLine) => {
      const trimmed = rawLine.trim()
      if (!trimmed) {
        return '<div class="h-3"></div>'
      }

      const escaped = escapeHtml(rawLine)
      const highlighted = escaped.replace(
        tokenRe,
        (full, comment, str, ctrl, type, fn, hwConst, num) => {
          if (comment) {
            if (/อันตราย|Infinite Loop|มิฉะนั้น/.test(comment)) {
              return `<span class="text-rose-300 font-semibold">${comment}</span>`
            }
            return `<span class="text-sky-200 italic">${comment}</span>`
          }
          if (str) return `<span class="text-emerald-300">${str}</span>`
          if (ctrl) return `<span class="text-amber-300 font-bold">${ctrl}</span>`
          if (type) return `<span class="text-violet-300 font-semibold">${type}</span>`
          if (fn) return `<span class="text-cyan-300 font-bold">${fn}</span>`
          if (hwConst) return `<span class="text-rose-300 font-bold">${hwConst}</span>`
          if (num) return `<span class="text-orange-300">${num}</span>`
          return full
        }
      )

      let lineCls = 'pl-2.5 -ml-2.5 whitespace-pre'
      if (trimmed.startsWith('while (') || trimmed.startsWith('do {') || trimmed.startsWith('} while (')) {
        lineCls = 'bg-amber-500/15 border-l-2 border-amber-400 pl-2.5 -ml-2.5 rounded-r whitespace-pre'
      } else if (/^(btnState|distance)\s*=\s*(digitalRead|getDistance)\(/.test(trimmed)) {
        lineCls = 'bg-purple-500/15 border-l-2 border-purple-400 pl-2.5 -ml-2.5 rounded-r whitespace-pre'
      } else if (/อันตราย|Infinite Loop/.test(trimmed)) {
        lineCls = 'bg-rose-500/15 border-l-2 border-rose-400 pl-2.5 -ml-2.5 rounded-r whitespace-pre'
      }

      return `<div class="${lineCls}">${highlighted}</div>`
    })
    .join('')
}

// ============================================================================
// INTERACTIVE 1: LIVE WHILE LOOP CODE-LINE TRACER (SECTION 1)
// ============================================================================
const stepBtnPressed = ref(true) // true = LOW (กดค้าง), false = HIGH (ปล่อยปุ่ม)
const tracedBtnState = ref(null) // null | 'LOW' | 'HIGH'
const whilePhase = ref('idle') // 'idle' | 'init' | 'check' | 'body' | 'update' | 'exit'
const whileIteration = ref(0)

const tracerConditionTrue = computed(() => tracedBtnState.value === 'LOW')
const tracerRedOn = computed(() => whilePhase.value === 'body')
const tracerGreenOn = computed(() => whilePhase.value === 'exit')

const tracerLines = [
  {
    phase: 'init',
    lineNo: 1,
    tag: '1. เริ่มต้น',
    code: 'int btnState = digitalRead(BTN_PIN);',
    activeRow: 'bg-sky-500/20 border-l-4 border-sky-400 text-white',
    activeTag: 'bg-sky-500/30 text-sky-200 border-sky-400/50'
  },
  {
    phase: 'check',
    lineNo: 2,
    tag: '2. ตรวจเงื่อนไข',
    code: 'while (btnState == LOW) {',
    activeRow: 'bg-amber-500/20 border-l-4 border-amber-400 text-white',
    activeTag: 'bg-amber-500/30 text-amber-200 border-amber-400/50'
  },
  {
    phase: 'body',
    lineNo: 3,
    tag: '3. ทำซ้ำในลูป',
    code: '  alarmBlink(); // เปิดไฟแดง + เสียงเตือน',
    activeRow: 'bg-rose-500/20 border-l-4 border-rose-400 text-white',
    activeTag: 'bg-rose-500/30 text-rose-200 border-rose-400/50'
  },
  {
    phase: 'update',
    lineNo: 4,
    tag: '4. อัปเดตค่าปุ่ม',
    code: '  btnState = digitalRead(BTN_PIN);',
    activeRow: 'bg-purple-500/20 border-l-4 border-purple-400 text-white',
    activeTag: 'bg-purple-500/30 text-purple-200 border-purple-400/50'
  },
  {
    phase: 'exit',
    lineNo: 5,
    tag: '5. ออกจากลูป',
    code: 'digitalWrite(LED_GREEN, HIGH); // กลับสู่โหมดปกติ',
    activeRow: 'bg-emerald-500/20 border-l-4 border-emerald-400 text-white',
    activeTag: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50'
  }
]

const tracerExplanation = computed(() => {
  if (whilePhase.value === 'idle') {
    return {
      title: 'พร้อมเริ่มเดินทีละบรรทัด',
      detail: 'เลือกสถานะปุ่มกดด้านซ้าย (กดค้าง หรือ ปล่อยปุ่ม) แล้วกดปุ่มสีส้ม "เดินไปบรรทัดถัดไป" เพื่อดูว่าบอร์ดอ่านโค้ดทีละบรรทัดอย่างไรครับ',
      cardClass: 'bg-stone-950 border-stone-700',
      titleClass: 'text-stone-200'
    }
  }
  if (whilePhase.value === 'init') {
    return {
      title: `บรรทัดที่ 1: อ่านค่าปุ่มมาเก็บไว้ -> ได้ค่า ${tracedBtnState.value}`,
      detail: tracedBtnState.value === 'LOW'
        ? 'CPU ไปอ่านขา Pin 2 พบว่าปุ่มถูกกดค้างอยู่ จึงเก็บค่า LOW ลงในตัวแปร btnState ก่อนเข้าลูป'
        : 'CPU ไปอ่านขา Pin 2 พบว่าไม่ได้กดปุ่ม จึงเก็บค่า HIGH ลงในตัวแปร btnState ก่อนเข้าลูป',
      cardClass: 'bg-sky-950/60 border-sky-500/40',
      titleClass: 'text-sky-300'
    }
  }
  if (whilePhase.value === 'check') {
    if (tracerConditionTrue.value) {
      return {
        title: `บรรทัดที่ 2: ตรวจ while (btnState == LOW) -> เป็นจริง (TRUE) รอบที่ ${whileIteration.value}`,
        detail: 'เพราะค่า btnState ในหน่วยความจำเป็น LOW ตรงตามเงื่อนไข! สเต็ปถัดไป CPU จะเข้าไปทำคำสั่งบรรทัดที่ 3 ในปีกกาครับ',
        cardClass: 'bg-amber-950/60 border-amber-500/40',
        titleClass: 'text-amber-300'
      }
    }
    return {
      title: 'บรรทัดที่ 2: ตรวจ while (btnState == LOW) -> เป็นเท็จ (FALSE)',
      detail: whileIteration.value === 0
        ? 'เพราะ btnState เป็น HIGH ตั้งแต่แรก เงื่อนไขไม่เป็นจริง -> CPU จะกระโดดข้ามบรรทัดที่ 3 และ 4 ไปบรรทัดที่ 5 ทันที (ทำในลูป 0 รอบ)'
        : `เพราะตอนนี้ btnState เปลี่ยนเป็น HIGH แล้ว เงื่อนไขไม่เป็นจริง -> CPU ออกจากลูป while ไปทำบรรทัดที่ 5 ทันที (ทำครบทั้งหมด ${whileIteration.value} รอบ)`,
      cardClass: 'bg-emerald-950/60 border-emerald-500/40',
      titleClass: 'text-emerald-300'
    }
  }
  if (whilePhase.value === 'body') {
    return {
      title: `บรรทัดที่ 3: ทำงานในลูป while (รอบที่ ${whileIteration.value})`,
      detail: 'CPU สั่งให้ไฟ LED สีแดงติดเตือนภัย (ดูหลอดไฟสีแดงด้านซ้ายติดสว่าง) ระหว่างนี้คุณสามารถลองกดสลับปุ่มเป็น "ปล่อยปุ่ม (HIGH)" เพื่อเตรียมออกจากลูปในขั้นถัดไปได้ครับ',
      cardClass: 'bg-rose-950/60 border-rose-500/40',
      titleClass: 'text-rose-300'
    }
  }
  if (whilePhase.value === 'update') {
    return {
      title: `บรรทัดที่ 4: อ่านค่าปุ่มใหม่อีกครั้ง -> ได้ค่า ${tracedBtnState.value}`,
      detail: tracedBtnState.value === 'LOW'
        ? 'CPU อ่านขา Pin 2 อีกรอบ ได้ค่า LOW (ยังกดค้างอยู่) -> สเต็ปถัดไปจะวนกลับขึ้นไปตรวจเงื่อนไขบรรทัดที่ 2 เพื่อทำรอบต่อไป'
        : 'CPU อ่านขา Pin 2 อีกรอบ ได้ค่า HIGH (ปล่อยมือแล้ว!) -> สเต็ปถัดไปจะวนกลับขึ้นไปตรวจบรรทัดที่ 2 แล้วพบว่าเป็นเท็จเพื่อออกจากลูป',
      cardClass: 'bg-purple-950/60 border-purple-500/40',
      titleClass: 'text-purple-300'
    }
  }
  return {
    title: 'บรรทัดที่ 5: ออกจากลูป while แล้ว (กลับสู่โหมดปกติ)',
    detail: 'ไฟ LED สีเขียวติดสว่าง แจ้งว่าระบบปลอดภัยแล้ว กดปุ่มสีส้มอีกครั้งเพื่อลองเริ่มรอบใหม่ตั้งแต่บรรทัดที่ 1 ครับ',
    cardClass: 'bg-emerald-950/60 border-emerald-500/40',
    titleClass: 'text-emerald-300'
  }
})

const resetWhileStepper = () => {
  whilePhase.value = 'idle'
  whileIteration.value = 0
  tracedBtnState.value = null
}

const toggleStepButton = (pressed) => {
  stepBtnPressed.value = pressed
}

const nextWhileStep = () => {
  if (whilePhase.value === 'idle' || whilePhase.value === 'exit') {
    whileIteration.value = 0
    tracedBtnState.value = stepBtnPressed.value ? 'LOW' : 'HIGH'
    whilePhase.value = 'init'
    return
  }

  if (whilePhase.value === 'init') {
    whilePhase.value = 'check'
    if (tracedBtnState.value === 'LOW') {
      whileIteration.value = 1
    }
    return
  }

  if (whilePhase.value === 'check') {
    if (tracedBtnState.value === 'LOW') {
      whilePhase.value = 'body'
    } else {
      whilePhase.value = 'exit'
    }
    return
  }

  if (whilePhase.value === 'body') {
    whilePhase.value = 'update'
    tracedBtnState.value = stepBtnPressed.value ? 'LOW' : 'HIGH'
    return
  }

  if (whilePhase.value === 'update') {
    whilePhase.value = 'check'
    if (tracedBtnState.value === 'LOW') {
      whileIteration.value += 1
    }
  }
}

// ============================================================================
// WHILE LOOP TYPES & PRACTICAL USAGE PATTERNS (SECTION 1.3)
// ============================================================================
const activeWhilePattern = ref(0)

const whileStructureCompare = [
  {
    id: 'pre-test',
    badge: 'แบบที่ 1 • Pre-test Loop',
    title: 'while (condition) { ... }',
    subtitle: 'ตรวจเงื่อนไขก่อนทำเสมอ (ขั้นต่ำ 0 รอบ)',
    summary: 'บอร์ดจะถามเงื่อนไขในวงเล็บก่อนเข้าทำงาน ถ้าตั้งแต่รอบแรกเป็นเท็จ ก็จะไม่ทำคำสั่งข้างในเลยแม้แต่ครั้งเดียว',
    bestFor: 'งานที่ต้องเช็กความปลอดภัยหรือสถานะก่อนลงมือทำ เช่น เช็กว่ากดปุ่มค้างอยู่ไหม หรือวัตถุอยู่ใกล้กว่า 30 cm หรือไม่',
    cardClass: 'bg-amber-50/70 border-2 border-amber-300',
    badgeClass: 'bg-amber-600 text-white',
    titleClass: 'text-amber-950',
    code: `int btnState = digitalRead(BTN_PIN);
while (btnState == LOW) {
  // ทำเฉพาะตอนที่กดปุ่มอยู่เท่านั้น (ไม่กด = ทำ 0 รอบ)
  digitalWrite(LED_RED, HIGH);
  btnState = digitalRead(BTN_PIN);
}`
  },
  {
    id: 'post-test',
    badge: 'แบบที่ 2 • Post-test Loop',
    title: 'do { ... } while (condition);',
    subtitle: 'ลงมือทำก่อน 1 รอบ แล้วค่อยตรวจ (ขั้นต่ำ 1 รอบ)',
    summary: 'บังคับให้บอร์ดทำคำสั่งในปีกกาอย่างน้อย 1 ครั้งก่อนเสมอ จากนั้นค่อยมาตรวจเงื่อนไขตอนท้ายว่าจะวนทำซ้ำอีกรอบไหม',
    bestFor: 'งานที่ต้องอ่านค่าหรือส่งสัญญาณออกมาก่อนอย่างน้อย 1 ครั้ง เช่น วัดค่าเซนเซอร์จนกว่าจะได้ค่าที่เสถียร หรือส่งเสียงเตือนสั้นๆ อย่างน้อย 1 ที',
    cardClass: 'bg-indigo-50/70 border-2 border-indigo-300',
    badgeClass: 'bg-indigo-600 text-white',
    titleClass: 'text-indigo-950',
    note: 'ข้อควรจำ: หลังวงเล็บ while (...); ของ do-while ต้องใส่เครื่องหมายอัฒภาค (;) ปิดท้ายเสมอ!',
    code: `float dist;
do {
  dist = getDistance(); // วัดระยะอย่างน้อย 1 ครั้งก่อนเสมอ
  delay(100);
} while (dist > 400.0); // ถ้าค่ายังเพี้ยนเกิน 400 cm ให้วัดซ้ำ`
  }
]

const whileUsagePatterns = [
  {
    tabLabel: '1. นับจำนวนรอบ',
    badge: 'รูปแบบที่ 1 • Counter-Controlled While',
    title: 'ใช้ while นับจำนวนรอบแทน for loop',
    howItWorks: 'สร้างตัวแปรนับรอบ (เช่น count = 0) ไว้ก่อนลูป แล้วบวกค่าเพิ่ม (count++) ทุกจบรอบ จนกว่าจะครบจำนวนที่ต้องการ',
    difference: 'ทำงานเหมือน for loop ทุกประการ แต่แยกส่วนตั้งค่า เงื่อนไข และตัวนับออกคนละบรรทัด ทำให้อ่านลำดับง่ายเวลาในลูปมีคำสั่งเยอะ',
    bestFor: 'สั่งไฟกะพริบ 5 ครั้งตอนเปิดเครื่อง หรือกะพริบเตือนจำนวนครั้งที่กำหนดแน่นอน',
    caution: 'อย่าลืมใส่ count++; ท้ายลูป ไม่อย่างนั้น count จะเป็น 0 ตลอดและค้างไม่จบ',
    code: `int count = 0; // 1. ตั้งตัวนับเริ่มต้น

while (count < 5) { // 2. ทำจนกว่าจะครบ 5 รอบ
  digitalWrite(LED_RED, HIGH);
  delay(200);
  digitalWrite(LED_RED, LOW);
  delay(200);

  count++; // 3. เพิ่มตัวนับทีละ 1 (ถ้าลืมจะวนไม่รู้จบ)
}`
  },
  {
    tabLabel: '2. รอเหตุการณ์ / รอปุ่ม',
    badge: 'รูปแบบที่ 2 • Wait / Event-Driven While',
    title: 'ใช้ while หยุดรอจนกว่าจะเกิดเหตุการณ์ที่ต้องการ',
    howItWorks: 'ปล่อยให้ลูปวนคอยเช็กขาพินไปเรื่อยๆ ตราบใดที่เหตุการณ์ยังไม่เกิด และจะหลุดไปทำบรรทัดถัดไปทันทีเมื่อมีคนกดปุ่มหรือสัญญาณมาถึง',
    difference: 'ไม่ได้เอาไว้ทำงานซ้ำหลายรอบเพื่อโชว์ผล แต่ใช้เป็น "จุดหยุดรอ" (Wait Gate) ก่อนเดินหน้าต่อต่างจากแบบนับรอบ',
    bestFor: 'รอผู้ใช้กดปุ่ม Start ก่อนเริ่มทำงานใน setup() หรือรอให้ปล่อยนิ้วออกจากปุ่มก่อนนับกดครั้งใหม่',
    caution: 'ระหว่างที่โปรแกรมติดรออยู่ใน while บอร์ดจะยังไม่ทำคำสั่งส่วนอื่นจนกว่าเหตุการณ์นั้นจะเกิดขึ้น',
    code: `// หยุดรอจนกว่าผู้ใช้จะกดปุ่ม (ขา BTN_PIN กลายเป็น LOW)
Serial.println("Press button to start...");

while (digitalRead(BTN_PIN) == HIGH) {
  delay(10); // ยังไม่กด (HIGH) ก็รอวนอยู่ในนี้ไปเรื่อยๆ
}

Serial.println("System Started!"); // พอกดปุ่มปุ๊บ จะหลุดมาบรรทัดนี้ทันที`
  },
  {
    tabLabel: '3. คุมด้วยค่าเซนเซอร์',
    badge: 'รูปแบบที่ 3 • Sensor Condition While',
    title: 'ทำงานต่อเนื่องตราบใดที่ค่าเซนเซอร์ยังอยู่ในเกณฑ์',
    howItWorks: 'อ่านค่าจากเซนเซอร์ก่อนเข้าลูป ถ้าเข้าเงื่อนไข (เช่น ระยะ < 30 cm) ก็แจ้งเตือนซ้ำๆ แล้วอ่านค่าเซนเซอร์ใหม่อีกครั้งทุกจบรอบ',
    difference: 'ไม่รู้ล่วงหน้าเลยว่าจะทำกี่รอบ (อาจ 0 รอบ หรือ 50 รอบ) ขึ้นอยู่กับสภาพแวดล้อมจริงหน้าเซนเซอร์ ต่างจากแบบนับรอบที่กำหนดเลขไว้ตายตัว',
    bestFor: 'ระบบเตือนระยะใกล้ HC-SR04 (Lab 3 และใบงานที่ 5) ระบบคุมอุณหภูมิพัดลม หรือรดน้ำต้นไม้เมื่อดินแห้ง',
    caution: 'ต้องเรียกฟังก์ชันอ่านเซนเซอร์ซ้ำท้ายลูปทุกครั้ง เพื่อให้บอร์ดรู้เมื่อวัตถุถอยออกไปหรือสภาพแวดล้อมเปลี่ยนแล้ว',
    code: `float dist = getDistance(); // อ่านระยะครั้งแรกก่อนเข้าลูป

while (dist > 0 && dist < 30.0) { // เงื่อนไขคุมด้วยระยะจริง
  digitalWrite(LED_RED, HIGH);
  tone(BUZZER, 1000);
  delay(200);

  dist = getDistance(); // อัปเดตระยะใหม่เพื่อเช็กว่าพ้นระยะหรือยัง
}`
  },
  {
    tabLabel: '4. while(true) + break',
    badge: 'รูปแบบที่ 4 • Infinite Loop + Early Exit',
    title: 'ตั้งใจวนตลอดกาลด้วย while(true) แล้วใช้ break เพื่อออก',
    howItWorks: 'เขียนเงื่อนไขเป็น true ให้วนไม่หยุด จากนั้นใช้ if ตรวจจุดหยุดฉุกเฉินหรือเงื่อนไขหลายอย่างข้างใน แล้วสั่ง break; เพื่อดีดตัวออกจากลูปทันที',
    difference: 'กลับด้านกับ while ปกติที่เช็กเงื่อนไขแค่หัวลูป แบบนี้สามารถวางเงื่อนไขหยุดไว้ "กลางลูป" หรือมีทางออกได้หลายทางในลูปเดียว',
    bestFor: 'เมนูตั้งค่า โหมดทำงานต่อเนื่องที่ต้องมีปุ่มหยุดฉุกเฉิน (Emergency Stop) คั่นกลางระหว่างการทำงานหลายขั้นตอน',
    caution: 'ต้องมั่นใจว่ามีคำสั่ง break; ที่ทำงานได้จริงอยู่ข้างใน มิฉะนั้นบอร์ดจะค้างอยู่ในลูปตลอดกาลจนกว่าจะกด Reset',
    code: `while (true) { // ตั้งใจวนไปเรื่อยๆ
  if (digitalRead(STOP_BTN) == LOW) {
    break; // ถ้ากดปุ่มหยุดฉุกเฉิน ให้ดีดออกจากลูปทันที
  }

  digitalWrite(LED_RED, HIGH);
  delay(150);
  digitalWrite(LED_RED, LOW);
  delay(150);
}`
  }
]

const whileComparisonRows = [
  {
    name: 'while (condition)',
    checkPoint: 'ก่อนเข้าลูป (หัวลูป)',
    minRuns: '0 รอบ',
    useCase: 'ตรวจความพร้อมหรือเงื่อนไขก่อนเริ่มทำ (ใช้บ่อยที่สุด)'
  },
  {
    name: 'do { ... } while (condition);',
    checkPoint: 'หลังทำเสร็จ 1 รอบ (ท้ายลูป)',
    minRuns: '1 รอบ',
    useCase: 'ต้องทำงาน/วัดค่าอย่างน้อย 1 ครั้งก่อนแล้วค่อยตัดสินใจ'
  },
  {
    name: 'แบบนับจำนวนรอบ (Counter)',
    checkPoint: 'เมื่อตัวนับถึงเป้า (เช่น count < 5)',
    minRuns: '0 รอบ',
    useCase: 'กะพริบไฟหรือส่งเสียงตามจำนวนครั้งที่รู้แน่นอน'
  },
  {
    name: 'แบบรอเหตุการณ์ (Wait / Event)',
    checkPoint: 'รอจนกว่าสัญญาณขาพินจะเปลี่ยน',
    minRuns: '0 รอบ',
    useCase: 'หยุดรอคนกดปุ่ม Start หรือรอสัญญาณจากโมดูลอื่น'
  },
  {
    name: 'แบบคุมด้วยเซนเซอร์ (Sensor)',
    checkPoint: 'อัปเดตค่าเซนเซอร์ใหม่ทุกจบรอบ',
    minRuns: '0 รอบ',
    useCase: 'เตือนภัยเมื่อวัตถุเข้าใกล้ HC-SR04 หรืออุณหภูมิเกินค่า'
  },
  {
    name: 'while (true) + break',
    checkPoint: 'ตรวจ if (...) break; กลางลูป',
    minRuns: '1 รอบ (ถึงจุด break)',
    useCase: 'ทำงานต่อเนื่องที่มีปุ่มหยุดฉุกเฉินหรือหลายเงื่อนไขออก'
  }
]

// ============================================================================
// INTERACTIVE 2: HOLD-TO-ALARM BASIC HARDWARE SIMULATOR (SECTION 2)
// ============================================================================
const isHoldAlarmActive = ref(false)
const holdLedBlink = ref(false)
const holdLoopCount = ref(0)
let holdTimer = null

const startHoldAlarm = () => {
  if (isHoldAlarmActive.value) return
  isHoldAlarmActive.value = true
  holdLedBlink.value = true
  holdLoopCount.value = 1

  holdTimer = setInterval(() => {
    holdLedBlink.value = !holdLedBlink.value
    if (holdLedBlink.value) {
      holdLoopCount.value += 1
    }
  }, 300)
}

const stopHoldAlarm = () => {
  isHoldAlarmActive.value = false
  holdLedBlink.value = false
  if (holdTimer) {
    clearInterval(holdTimer)
    holdTimer = null
  }
}

const toggleHoldAlarm = () => {
  if (isHoldAlarmActive.value) {
    stopHoldAlarm()
  } else {
    startHoldAlarm()
  }
}

// ============================================================================
// INTERACTIVE 3: ASSIGNMENT 5 PREVIEW (ULTRASONIC + WHILE + BUTTON STATE)
// ============================================================================
const radarSystemOn = ref(true) // Button State (Pin 2): true = เปิดระบบ, false = ปิดระบบ
const simDistance = ref(45) // 5..100 cm
const simThreshold = ref(30) // 15..50 cm
const radarRedBlink = ref(false)
const radarWhileLoops = ref(0)
let radarTimer = null

const simDurationUs = computed(() => Math.round((simDistance.value * 2) / 0.034))
const isDangerZone = computed(() => radarSystemOn.value && simDistance.value > 0 && simDistance.value < simThreshold.value)

const updateRadarTimer = () => {
  if (isDangerZone.value) {
    if (!radarTimer) {
      radarRedBlink.value = true
      radarWhileLoops.value += 1
      radarTimer = setInterval(() => {
        radarRedBlink.value = !radarRedBlink.value
        if (radarRedBlink.value) {
          radarWhileLoops.value += 1
        }
      }, 250)
    }
  } else {
    radarRedBlink.value = false
    if (radarTimer) {
      clearInterval(radarTimer)
      radarTimer = null
    }
  }
}

const toggleRadarSystem = () => {
  radarSystemOn.value = !radarSystemOn.value
  updateRadarTimer()
}

const onRadarInput = () => {
  updateRadarTimer()
}

const onRadarDistanceChange = (nextCm) => {
  simDistance.value = nextCm
  updateRadarTimer()
}

onUnmounted(() => {
  if (holdTimer) clearInterval(holdTimer)
  if (radarTimer) clearInterval(radarTimer)
})

// ============================================================================
// ARDUINO C++ CODE SNIPPETS
// ============================================================================
const infiniteLoopWrongCode = `int btnState = digitalRead(BTN_PIN); // อ่านค่าครั้งเดียวก่อนเข้าลูป

while (btnState == LOW) {
  digitalWrite(LED_RED, HIGH);
  delay(200);
  digitalWrite(LED_RED, LOW);
  delay(200);
  // อันตราย! ลืมอัพเดตค่า btnState ใหม่ภายในลูป
  // แม้จะปล่อยปุ่มแล้ว btnState ก็ยังเป็น LOW ตลอดกาล (Infinite Loop!)
}`

const infiniteLoopRightCode = `int btnState = digitalRead(BTN_PIN); // 1. Initialization: อ่านค่าเริ่มต้น

while (btnState == LOW) {            // 2. Condition: ตรวจเงื่อนไข
  digitalWrite(LED_RED, HIGH);       // 3. Loop Body: ทำงานซ้ำ
  delay(200);
  digitalWrite(LED_RED, LOW);
  delay(200);

  btnState = digitalRead(BTN_PIN);   // 4. Update: อ่านค่าปุ่มใหม่ทุกจบ 1 รอบ
}`

const basicWhileCode = `// ============================================================================
// Lab 1: ฝึกใช้ While Loop กับอุปกรณ์พื้นฐาน (ปุ่มกด + LED 2 ดวง + Piezo Buzzer)
// - ปุ่มกด (Pin 2): ต่อลง GND แบบ INPUT_PULLUP
// - กดค้าง = เข้าเงื่อนไข while (ไฟแดงกะพริบ + เสียงเตือน Buzzer)
// - ปล่อยมือ = ออกจาก while ทันที (ไฟเขียวติดค้าง + ปิดเสียง)
// ============================================================================

const int BTN_PIN   = 2;
const int LED_RED   = 8;
const int LED_GREEN = 9;
const int BUZZER    = 10;

void setup() {
  Serial.begin(9600);
  pinMode(BTN_PIN, INPUT_PULLUP); // ปกติเป็น HIGH, กดปุ่มเป็น LOW
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.println("System Ready: Hold button to test while loop alarm");
}

void loop() {
  // 1. Initialization: อ่านสถานะปุ่มก่อนตรวจเงื่อนไข
  int btnState = digitalRead(BTN_PIN);

  // 2. While Loop: ตราบใดที่ยังกดปุ่มค้างไว้ (LOW) ให้เตือนภัยต่อเนื่อง
  while (btnState == LOW) {
    digitalWrite(LED_GREEN, LOW);    // ปิดไฟเขียว
    digitalWrite(LED_RED, HIGH);     // เปิดไฟแดง
    tone(BUZZER, 1000);              // ส่งเสียงความถี่ 1000 Hz
    delay(200);

    digitalWrite(LED_RED, LOW);      // ดับไฟแดง
    noTone(BUZZER);                  // หยุดเสียง
    delay(200);

    Serial.println("[WHILE] Alert! Button is still held (LOW)");

    // 3. Update: ต้องอ่านค่าปุ่มใหม่อีกครั้ง มิฉะนั้นจะติด Infinite Loop!
    btnState = digitalRead(BTN_PIN);
  }

  // เมื่อปล่อยปุ่ม (btnState == HIGH) เงื่อนไขเป็นเท็จ -> ออกจาก while มาทำบรรทัดนี้
  digitalWrite(LED_GREEN, HIGH);     // เปิดไฟเขียวสถานะปกติ
  digitalWrite(LED_RED, LOW);
  noTone(BUZZER);
}`

const lab1CodeTab = ref('while') // 'while' | 'dowhile'

const basicDoWhileCode = `// ============================================================================
// Lab 1 (แบบ Do While): ใช้ do...while กับอุปกรณ์พื้นฐาน (ปุ่มกด + LED + Buzzer)
// - ปุ่มกด (Pin 2): ต่อลง GND แบบ INPUT_PULLUP (ต่อวงจรเหมือนเดิมทุกจุด)
// - ใช้ if เช็กก่อนเริ่มกด -> จากนั้นเข้าลูป do...while (ทำงานก่อน 1 รอบ แล้วค่อยเช็ก)
// - ปล่อยมือ = จบรอบปัจจุบันแล้วออกจากลูปทันที (ไฟเขียวติดค้าง + ปิดเสียง)
// ============================================================================

const int BTN_PIN   = 2;
const int LED_RED   = 8;
const int LED_GREEN = 9;
const int BUZZER    = 10;

void setup() {
  Serial.begin(9600);
  pinMode(BTN_PIN, INPUT_PULLUP); // ปกติเป็น HIGH, กดปุ่มเป็น LOW
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.println("System Ready: Hold button to test do-while loop alarm");
}

void loop() {
  // 1. ตรวจว่าเริ่มกดปุ่มหรือยัง และประกาศตัวแปรนอก do
  if (digitalRead(BTN_PIN) == LOW) {
    int btnState;

    // 2. Do...While Loop: ทำเตือนภัยก่อนอย่างน้อย 1 รอบ แล้วค่อยเช็กตอนท้าย
    do {
      digitalWrite(LED_GREEN, LOW);    // ปิดไฟเขียว
      digitalWrite(LED_RED, HIGH);     // เปิดไฟแดง
      tone(BUZZER, 1000);              // ส่งเสียงความถี่ 1000 Hz
      delay(200);

      digitalWrite(LED_RED, LOW);      // ดับไฟแดง
      noTone(BUZZER);                  // หยุดเสียง
      delay(200);

      Serial.println("[DO-WHILE] Alert! Checking button at end of cycle");

      // 3. Update: อ่านค่าปุ่มใหม่ก่อนถึงเงื่อนไข while ตอนท้ายลูป
      btnState = digitalRead(BTN_PIN);
    } while (btnState == LOW); // ห้ามลืมเครื่องหมาย ; ปิดท้าย!
  }

  // เมื่อปล่อยปุ่ม (btnState == HIGH) ออกจากลูปมาเปิดไฟเขียวสถานะปกติ
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);
  noTone(BUZZER);
}`

const ultrasonicTestCode = `// ============================================================================
// Lab 2: ทดสอบอ่านค่าระยะทางจาก Ultrasonic Sensor (HC-SR04) ออก Serial Monitor
// ============================================================================

const int TRIG_PIN = 10;
const int ECHO_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT); // ขาส่งคลื่นเสียง
  pinMode(ECHO_PIN, INPUT);  // ขารับคลื่นเสียงสะท้อนกลับ
}

// ฟังก์ชันย่อยสำหรับยิงคลื่นและคำนวณระยะทางเป็นเซนติเมตร (cm)
float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);     // ยิงคลื่นเสียงสั้นๆ 10 ไมโครวินาที
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // จับเวลาไป-กลับ (us)
  float distance = duration * 0.034 / 2.0;        // แปลงเป็น cm
  return distance;
}

void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  delay(200);
}`

const serialUltrasonicWhileCode = `// ============================================================================
// Lab 3 (พาเขียน): While Loop + Ultrasonic HC-SR04 แสดงผลผ่าน Serial Monitor
// - ต่อเฉพาะเซนเซอร์ HC-SR04 (VCC -> 5V, TRIG -> Pin 10, ECHO -> Pin 9, GND -> GND)
// - ระยะทาง < 30 cm  : เข้าสู่ while แจ้งเตือน "[ALERT]" ต่อเนื่องบน Serial Monitor
// - ระยะทาง >= 30 cm : ออกจาก while แสดงสถานะ "[SAFE]" บน Serial Monitor
// ============================================================================

const int TRIG_PIN = 10;
const int ECHO_PIN = 9;

const float DANGER_DISTANCE = 30.0; // เกณฑ์ระยะอันตราย (เซนติเมตร)

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.println("================================================");
  Serial.println("HC-SR04 + While Loop (Serial Monitor Ready)");
  Serial.println("================================================");
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 999.0; // กันกรณี Timeout คืน 0 เพื่อไม่ให้ลั่นผิดพลาด
  return duration * 0.034 / 2.0;
}

void loop() {
  // 1. Initialization: วัดระยะทางเริ่มต้นก่อนตรวจสอบเงื่อนไข
  float distance = getDistance();

  // 2. While Loop: ตราบใดที่วัตถุเข้ามาใกล้กว่า 30 cm ให้แจ้งเตือนผ่าน Serial ไม่หยุด
  while (distance > 0 && distance < DANGER_DISTANCE) {
    Serial.print("[ALERT - INSIDE WHILE] Object too close: ");
    Serial.print(distance);
    Serial.println(" cm");
    delay(300);

    // 3. Update: วัดระยะทางใหม่อีกครั้ง เพื่อใช้ตัดสินใจว่าจะออกจากลูปหรือไม่
    distance = getDistance();
  }

  // หลุดออกจากลูป while เมื่อระยะทาง >= 30 cm (ปลอดภัย)
  Serial.print("[SAFE] Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(300);
}`

// ============================================================================
// STEP-BY-STEP CODE WALKTHROUGH DATA
// ============================================================================
const lab1Steps = [
  {
    tabLabel: 'ประกาศขาพิน',
    badge: '1. ส่วนบนสุดของไฟล์ (Global Constants)',
    title: 'ตั้งชื่อแทนหมายเลขขา Pin ที่ต่อกับอุปกรณ์',
    summary: 'ส่วนนี้เอาไว้ตั้งชื่อเรียกขาพินให้จำง่ายๆ จะได้ไม่ต้องจำเลขขาตลอดโค้ด ถ้าวันหลังย้ายสายไฟก็มาแก้เลขแค่ตรงนี้จุดเดียวครับ',
    code: `const int BTN_PIN   = 2;
const int LED_RED   = 8;
const int LED_GREEN = 9;
const int BUZZER    = 10;`,
    lines: [
      {
        code: 'const int BTN_PIN = 2;',
        desc: 'ตั้งชื่อปุ่มกดว่า BTN_PIN โดยต่ออยู่กับขา Digital 2 (คำว่า const คือค่าคงที่ ห้ามเปลี่ยนเลขขาระหว่างโปรแกรมรัน)'
      },
      {
        code: 'const int LED_RED = 8; / LED_GREEN = 9;',
        desc: 'กำหนดให้หลอดไฟ LED สีแดงอยู่ที่ขา 8 และหลอดไฟสีเขียวอยู่ที่ขา 9'
      },
      {
        code: 'const int BUZZER = 10;',
        desc: 'กำหนดให้ลำโพง Piezo Buzzer ต่ออยู่ที่ขา 10'
      }
    ]
  },
  {
    tabLabel: 'ตั้งค่า setup()',
    badge: '2. ฟังก์ชัน setup()',
    title: 'กำหนดหน้าที่ของแต่ละขาและเปิด Serial Monitor',
    summary: 'คำสั่งใน setup() จะทำงานแค่ครั้งเดียวตอนเปิดไฟให้บอร์ด Arduino เพื่อบอกบอร์ดว่าขาไหนใช้รับค่า และขาไหนใช้ส่งไฟออก',
    code: `void setup() {
  Serial.begin(9600);
  pinMode(BTN_PIN, INPUT_PULLUP); // ปกติเป็น HIGH, กดปุ่มเป็น LOW
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.println("System Ready: Hold button to test while loop alarm");
}`,
    lines: [
      {
        code: 'Serial.begin(9600);',
        desc: 'เปิดการสื่อสารกับหน้าจอ Serial Monitor ด้วยความเร็ว 9600 เพื่อให้เราดูข้อความแจ้งเตือนบนจอคอมพิวเตอร์ได้'
      },
      {
        code: 'pinMode(BTN_PIN, INPUT_PULLUP);',
        desc: 'ตั้งขาปุ่มกดเป็น INPUT_PULLUP คือเปิดตัวต้านทานภายในบอร์ดไว้ ทำให้ตอนไม่กดค่าจะเป็น HIGH และพอกดปุ่มลง GND ค่าจะกลายเป็น LOW'
      },
      {
        code: 'pinMode(LED_RED / LED_GREEN / BUZZER, OUTPUT);',
        desc: 'ตั้งขาไฟแดง ไฟเขียว และ Buzzer ให้เป็น OUTPUT เพราะบอร์ดต้องส่งสัญญาณไฟออกไปสั่งให้มันติดหรือดัง'
      },
      {
        code: 'Serial.println("System Ready...");',
        desc: 'พิมพ์ข้อความขึ้นหน้าจอ Serial Monitor ว่าระบบพร้อมทดสอบแล้ว'
      }
    ],
    tip: 'จำง่ายๆ สำหรับ INPUT_PULLUP: "ไม่กด = HIGH, กดปุ่ม = LOW" (กลับด้านกับความรู้สึกปกตินิดนึงนะครับ)'
  },
  {
    tabLabel: 'อ่านค่าเริ่มต้น',
    badge: '3. Initialization (ก่อนเข้าลูป)',
    title: 'อ่านสถานะปุ่มครั้งแรกก่อนตรวจเงื่อนไข while',
    summary: 'ก่อนจะถามเงื่อนไขของ while ได้ เราต้องไปหยิบค่าจากปุ่มกดมาเก็บใส่ตัวแปร btnState ไว้ก่อน 1 รอบ',
    code: `void loop() {
  // 1. Initialization: อ่านสถานะปุ่มก่อนตรวจเงื่อนไข
  int btnState = digitalRead(BTN_PIN);`,
    lines: [
      {
        code: 'int btnState = digitalRead(BTN_PIN);',
        desc: 'สั่งบอร์ดอ่านไฟจากขา BTN_PIN ว่าตอนนี้ปุ่มถูกกด (LOW) หรือปล่อยอยู่ (HIGH) แล้วเก็บใส่ตัวแปรชื่อ btnState'
      }
    ],
    tip: 'ถ้าไม่มีบรรทัดนี้ ตัวแปร btnState จะไม่มีค่าเริ่มต้นสำหรับเอาไปเทียบใน while (...) บรรทัดถัดไปครับ'
  },
  {
    tabLabel: 'ลูป while + อัปเดต',
    badge: '4. While Loop + Update',
    title: 'ตราบใดที่ยังกดปุ่มค้าง ให้ไฟแดงกะพริบพร้อมเสียงเตือน',
    summary: 'หัวใจของ Lab 1 อยู่ที่ตรงนี้ครับ ถ้ากดปุ่มค้าง (btnState == LOW) โปรแกรมจะวนทำซ้ำใน { ... } และก่อนจบรอบต้องอ่านค่าปุ่มใหม่ทุกครั้ง',
    code: `  // 2. While Loop: ตราบใดที่ยังกดปุ่มค้างไว้ (LOW) ให้เตือนภัยต่อเนื่อง
  while (btnState == LOW) {
    digitalWrite(LED_GREEN, LOW);    // ปิดไฟเขียว
    digitalWrite(LED_RED, HIGH);     // เปิดไฟแดง
    tone(BUZZER, 1000);              // ส่งเสียงความถี่ 1000 Hz
    delay(200);

    digitalWrite(LED_RED, LOW);      // ดับไฟแดง
    noTone(BUZZER);                  // หยุดเสียง
    delay(200);

    Serial.println("[WHILE] Alert! Button is still held (LOW)");

    // 3. Update: ต้องอ่านค่าปุ่มใหม่อีกครั้ง มิฉะนั้นจะติด Infinite Loop!
    btnState = digitalRead(BTN_PIN);
  }`,
    lines: [
      {
        code: 'while (btnState == LOW)',
        desc: 'ตรวจเงื่อนไขก่อนเข้าทำงาน ถ้า btnState เป็น LOW (แปลว่ากดปุ่มอยู่) ให้เข้าไปทำคำสั่งในปีกกา'
      },
      {
        code: 'digitalWrite(LED_GREEN, LOW);',
        desc: 'ดับไฟเขียวก่อน เพื่อสลับเข้าสู่โหมดเตือนภัย'
      },
      {
        code: 'digitalWrite(LED_RED, HIGH); tone(BUZZER, 1000); delay(200);',
        desc: 'สั่งไฟแดงติด + ลำโพง Buzzer ดังที่ความถี่ 1000 Hz นาน 0.2 วินาที'
      },
      {
        code: 'digitalWrite(LED_RED, LOW); noTone(BUZZER); delay(200);',
        desc: 'สั่งไฟแดงดับ + หยุดเสียงลำโพง นาน 0.2 วินาที (รวมบน-ล่างจึงเห็นเป็นจังหวะกะพริบเตือน)'
      },
      {
        code: 'Serial.println("[WHILE] Alert! ...");',
        desc: 'พิมพ์แจ้งบน Serial Monitor ว่าตอนนี้โปรแกรมยังวนอยู่ในลูป while นะ'
      },
      {
        code: 'btnState = digitalRead(BTN_PIN);',
        desc: 'ส่วน Update สำคัญที่สุด! อ่านค่าปุ่มใหม่อีกรอบก่อนวนขึ้นไปเช็ก while ถ้าปล่อยมือแล้ว btnState จะเปลี่ยนเป็น HIGH เพื่อออกจากลูป'
      }
    ],
    tip: 'ถ้าลืมบรรทัด btnState = digitalRead(BTN_PIN); ในตอนท้าย แม้เราปล่อยนิ้วออกจากปุ่มแล้ว btnState ก็ยังจำค่า LOW เดิม ทำให้ติด Infinite Loop ร้องไม่หยุดครับ!'
  },
  {
    tabLabel: 'หลังออกจากลูป',
    badge: '5. นอกลูป while (Safe State)',
    title: 'เมื่อปล่อยปุ่ม ให้กลับสู่โหมดปกติ (ไฟเขียวติดค้าง)',
    summary: 'ทันทีที่เงื่อนไข btnState == LOW เป็นเท็จ (เพราะปล่อยปุ่มเป็น HIGH) โปรแกรมจะกระโดดออกมาทำคำสั่งต่อจากปีกกาปิดของ while',
    code: `  // เมื่อปล่อยปุ่ม (btnState == HIGH) เงื่อนไขเป็นเท็จ -> ออกจาก while มาทำบรรทัดนี้
  digitalWrite(LED_GREEN, HIGH);     // เปิดไฟเขียวสถานะปกติ
  digitalWrite(LED_RED, LOW);
  noTone(BUZZER);
}`,
    lines: [
      {
        code: 'digitalWrite(LED_GREEN, HIGH);',
        desc: 'เปิดไฟสีเขียวค้างไว้เพื่อบอกสถานะว่าระบบปกติแล้ว'
      },
      {
        code: 'digitalWrite(LED_RED, LOW); noTone(BUZZER);',
        desc: 'ย้ำให้ไฟสีแดงดับสนิทและปิดเสียง Buzzer ให้เงียบ ก่อนจบรอบ void loop()'
      }
    ]
  }
]

const lab1DoWhileSteps = [
  {
    tabLabel: 'ประกาศขาพิน',
    badge: '1. ส่วนบนสุดของไฟล์ (Global Constants)',
    title: 'ประกาศขาพินเหมือนเดิม (ต่อวงจรชุดเดิมทุกเส้น)',
    summary: 'ใช้ขา Pin 2, 8, 9 และ 10 เหมือนแบบ while loop ทุกประการ ไม่ต้องถอดหรือย้ายสายไฟบนบอร์ดเลยครับ',
    code: `const int BTN_PIN   = 2;
const int LED_RED   = 8;
const int LED_GREEN = 9;
const int BUZZER    = 10;`,
    lines: [
      {
        code: 'const int BTN_PIN = 2;',
        desc: 'ปุ่มกดต่อที่ขา Digital 2 แบบ INPUT_PULLUP เหมือนเดิม'
      },
      {
        code: 'const int LED_RED = 8; / LED_GREEN = 9; / BUZZER = 10;',
        desc: 'หลอด LED แดง, เขียว และ Piezo Buzzer ต่อที่ขา 8, 9 และ 10 เหมือนเดิม'
      }
    ]
  },
  {
    tabLabel: 'ตั้งค่า setup()',
    badge: '2. ฟังก์ชัน setup()',
    title: 'กำหนดโหมด INPUT_PULLUP และ OUTPUT ใน setup()',
    summary: 'ตั้งค่าเริ่มต้นให้บอร์ด Arduino และเปิด Serial Monitor ที่ความเร็ว 9600 เหมือนแบบแรกครับ',
    code: `void setup() {
  Serial.begin(9600);
  pinMode(BTN_PIN, INPUT_PULLUP); // ปกติเป็น HIGH, กดปุ่มเป็น LOW
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.println("System Ready: Hold button to test do-while loop alarm");
}`,
    lines: [
      {
        code: 'pinMode(BTN_PIN, INPUT_PULLUP);',
        desc: 'ไม่กด = HIGH, กดปุ่มลง GND = LOW'
      },
      {
        code: 'pinMode(LED_RED / LED_GREEN / BUZZER, OUTPUT);',
        desc: 'ตั้งขาหลอดไฟและลำโพง Buzzer เป็น OUTPUT'
      }
    ]
  },
  {
    tabLabel: 'ดักเริ่มกด + ประกาศตัวแปร',
    badge: '3. Guard + Initialization (นอก do)',
    title: 'ใช้ if ดักการเริ่มกด และประกาศ int btnState; ก่อน do',
    summary: 'เพราะ do...while จะทำงานรอบแรกทันทีแม้เงื่อนไขเป็นเท็จ เราจึงใส่ if ครอบไว้เพื่อไม่ให้ดังเองตอนไม่ได้กด และประกาศตัวแปร btnState ไว้นอกปีกกา do',
    code: `void loop() {
  // 1. ตรวจว่าเริ่มกดปุ่มหรือยัง และประกาศตัวแปรนอก do
  if (digitalRead(BTN_PIN) == LOW) {
    int btnState;`,
    lines: [
      {
        code: 'if (digitalRead(BTN_PIN) == LOW)',
        desc: 'เช็กก่อนว่าตอนนี้มีคนกดปุ่มจริงไหม เพื่อกันไม่ให้ do...while ลั่นเตือนเองตอนเปิดเครื่องแบบไม่ได้กดปุ่ม'
      },
      {
        code: 'int btnState;',
        desc: 'ประกาศตัวแปรไว้นอก do { ... } เพื่อให้บรรทัด while (btnState == LOW); ตอนท้ายลูปมองเห็นตัวแปรนี้ได้'
      }
    ],
    tip: 'ข้อแตกต่างสำคัญ: ถ้าเอา int btnState ไปประกาศข้างใน do { ... } คำสั่ง while ตอนท้ายจะมองไม่เห็นตัวแปรแล้วขึ้น Error ตอน Compile ครับ!'
  },
  {
    tabLabel: 'ลูป do...while + อัปเดต',
    badge: '4. Post-test Loop + Update',
    title: 'ทำเตือนภัย 1 รอบก่อน แล้วค่อยตรวจเงื่อนไข while ตอนท้าย',
    summary: 'เมื่อเข้า do แล้วจะเปิดไฟแดง + เสียง 1000 Hz จนจบ 1 รอบ ก่อนอ่านค่าปุ่มใหม่แล้วตัดสินใจที่ } while (btnState == LOW); ด้านล่าง',
    code: `    // 2. Do...While Loop: ทำเตือนภัยก่อนอย่างน้อย 1 รอบ แล้วค่อยเช็กตอนท้าย
    do {
      digitalWrite(LED_GREEN, LOW);    // ปิดไฟเขียว
      digitalWrite(LED_RED, HIGH);     // เปิดไฟแดง
      tone(BUZZER, 1000);              // ส่งเสียงความถี่ 1000 Hz
      delay(200);

      digitalWrite(LED_RED, LOW);      // ดับไฟแดง
      noTone(BUZZER);                  // หยุดเสียง
      delay(200);

      Serial.println("[DO-WHILE] Alert! Checking button at end of cycle");

      // 3. Update: อ่านค่าปุ่มใหม่ก่อนถึงเงื่อนไข while ตอนท้ายลูป
      btnState = digitalRead(BTN_PIN);
    } while (btnState == LOW); // ห้ามลืมเครื่องหมาย ; ปิดท้าย!
  }`,
    lines: [
      {
        code: 'do { ... }',
        desc: 'เข้าไปทำงานเตือนภัยทันทีอย่างน้อย 1 รอบ (ไฟแดงติด-ดับ + Buzzer ดัง 1000 Hz) ถึงแม้กดสั้นๆ แล้วรีบปล่อยมือ ก็ยังทำจนจบรอบนั้นก่อน'
      },
      {
        code: 'btnState = digitalRead(BTN_PIN);',
        desc: 'ส่วน Update: อ่านสถานะปุ่มล่าสุดก่อนจบรอบ เพื่อใช้ตัดสินใจว่าจะวนกลับไปที่ do อีกรอบหรือไม่'
      },
      {
        code: '} while (btnState == LOW);',
        desc: 'ตรวจเงื่อนไขตอนท้ายรอบ ถ้ายังกดค้าง (LOW) ให้วนกลับขึ้นไป do ใหม่ แต่ถ้าปล่อยแล้ว (HIGH) ให้ออกจากลูปทันที'
      }
    ],
    tip: 'ห้ามลืมเครื่องหมายอัฒภาค (;) หลังวงเล็บ } while (btnState == LOW); เด็ดขาด ต่างจาก while ปกติที่ตามด้วยปีกกา { ครับ'
  },
  {
    tabLabel: 'หลังออกจากลูป',
    badge: '5. นอกลูป (Safe State)',
    title: 'ปล่อยปุ่มแล้วเปิดไฟเขียวสถานะปกติและปิดเสียง',
    summary: 'เมื่อจบรอบแล้วเงื่อนไข while (btnState == LOW); เป็นเท็จ โปรแกรมจะออกจากลูปมาเปิดไฟเขียวและปิด Buzzer ให้เงียบครับ',
    code: `  // เมื่อปล่อยปุ่ม (btnState == HIGH) ออกจากลูปมาเปิดไฟเขียวสถานะปกติ
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);
  noTone(BUZZER);
}`,
    lines: [
      {
        code: 'digitalWrite(LED_GREEN, HIGH);',
        desc: 'เปิดไฟสีเขียวค้างไว้แสดงสถานะปกติเมื่อไม่ได้กดปุ่ม'
      },
      {
        code: 'digitalWrite(LED_RED, LOW); noTone(BUZZER);',
        desc: 'สั่งดับไฟสีแดงและหยุดเสียง Buzzer ให้เรียบร้อยก่อนเริ่ม void loop() รอบถัดไป'
      }
    ]
  }
]

const lab2Steps = [
  {
    tabLabel: 'กำหนดขา TRIG/ECHO',
    badge: '1. ตั้งชื่อขาเซนเซอร์',
    title: 'กำหนดขา TRIG (ส่งคลื่น) และขา ECHO (รับคลื่น)',
    summary: 'เซนเซอร์ HC-SR04 ใช้ขาสัญญาณ 2 ขาในการวัดระยะทาง ขาหนึ่งไว้ยิงเสียง อีกขาไว้รอฟังเสียงสะท้อนกลับมา',
    code: `const int TRIG_PIN = 10;
const int ECHO_PIN = 9;`,
    lines: [
      {
        code: 'const int TRIG_PIN = 10;',
        desc: 'ขา Trigger (สายสีเหลือง) ต่อที่ Pin 10 ใช้สำหรับส่งคลื่นเสียงอัลตราโซนิกออกไปข้างหน้า'
      },
      {
        code: 'const int ECHO_PIN = 9;',
        desc: 'ขา Echo (สายสีเขียว) ต่อที่ Pin 9 ใช้สำหรับรับคลื่นเสียงที่ไปชนวัตถุแล้วสะท้อนกลับมา'
      }
    ]
  },
  {
    tabLabel: 'ตั้งค่า setup()',
    badge: '2. ฟังก์ชัน setup()',
    title: 'เปิด Serial Monitor และตั้งทิศทางขา TRIG / ECHO',
    summary: 'บอกบอร์ดว่าขา TRIG เป็นตัวส่งออก (OUTPUT) ส่วนขา ECHO เป็นตัวรับเข้า (INPUT)',
    code: `void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT); // ขาส่งคลื่นเสียง
  pinMode(ECHO_PIN, INPUT);  // ขารับคลื่นเสียงสะท้อนกลับ
}`,
    lines: [
      {
        code: 'Serial.begin(9600);',
        desc: 'เปิดช่องทางส่งข้อความแสดงระยะทางขึ้นหน้าจอ Serial Monitor'
      },
      {
        code: 'pinMode(TRIG_PIN, OUTPUT);',
        desc: 'TRIG เป็น OUTPUT เพราะบอร์ด Arduino ต้องสั่งปล่อยสัญญาณไฟออกไปกระตุ้นให้เซนเซอร์ยิงเสียง'
      },
      {
        code: 'pinMode(ECHO_PIN, INPUT);',
        desc: 'ECHO เป็น INPUT เพราะบอร์ดต้องรอรับสัญญาณสะท้อนกลับจากตัวเซนเซอร์'
      }
    ]
  },
  {
    tabLabel: 'ฟังก์ชัน getDistance()',
    badge: '3. ฟังก์ชันย่อยวัดระยะทาง',
    title: 'ยิงคลื่น 10 ไมโครวินาที จับเวลา แล้วแปลงเป็นเซนติเมตร',
    summary: 'เราแยกขั้นตอนการยิงคลื่น + จับเวลา + คำนวณระยะ มาเก็บไว้เป็นฟังก์ชันชื่อ getDistance() เพื่อเรียกใช้ง่ายๆ ได้ทั้งระยะที่เป็นทศนิยม (float)',
    code: `float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);     // ยิงคลื่นเสียงสั้นๆ 10 ไมโครวินาที
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // จับเวลาไป-กลับ (us)
  float distance = duration * 0.034 / 2.0;        // แปลงเป็น cm
  return distance;
}`,
    lines: [
      {
        code: 'digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);',
        desc: 'เคลียร์ขา TRIG ให้เป็น LOW นิ่งๆ ก่อน 2 ไมโครวินาที เพื่อให้สัญญาณสะอาด'
      },
      {
        code: 'digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);',
        desc: 'ส่งไฟ HIGH นาน 10 ไมโครวินาทีแล้วปิด เป็นการสะกิดให้ HC-SR04 ยิงคลื่นเสียงความถี่สูงออกไป 1 ชุด'
      },
      {
        code: 'long duration = pulseIn(ECHO_PIN, HIGH, 30000);',
        desc: 'สั่งจับเวลาว่าเสียงเดินทาง "ไปชนวัตถุ + สะท้อนกลับ" นานกี่ไมโครวินาที (กำหนด Timeout ไว้ที่ 30000 us เพื่อไม่ให้บอร์ดรอนานเกิน)'
      },
      {
        code: 'float distance = duration * 0.034 / 2.0;',
        desc: 'เสียงเดินทางด้วยความเร็ว 0.034 เซนติเมตรต่อไมโครวินาที จึงเอาเวลามาคูณ 0.034 แล้วหาร 2 เพราะเวลาที่จับได้คือระยะทางทั้งขาไปและขากลับ'
      },
      {
        code: 'return distance;',
        desc: 'ส่งค่าความยาว (หน่วย cm) กลับออกไปให้คนที่เรียกใช้ฟังก์ชันนี้'
      }
    ],
    tip: 'อย่าลืมหารด้วย 2.0 เสมอนะครับ! ไม่อย่างนั้นค่าระยะทางที่ได้จะยาวเป็น 2 เท่าของระยะจริง'
  },
  {
    tabLabel: 'แสดงผลใน loop()',
    badge: '4. ฟังก์ชัน loop()',
    title: 'เรียกใช้ getDistance() แล้วพิมพ์ระยะออก Serial Monitor',
    summary: 'ใน loop() เราแค่เรียก getDistance() มารับค่าระยะทาง แล้วพิมพ์ขึ้นหน้าจอทุกๆ 0.2 วินาที เพื่อเช็กว่าเซนเซอร์อ่านค่าแม่นหรือยัง',
    code: `void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  delay(200);
}`,
    lines: [
      {
        code: 'float dist = getDistance();',
        desc: 'เรียกฟังก์ชันวัดระยะทาง แล้วเก็บค่าทศนิยมที่ได้ลงในตัวแปร dist'
      },
      {
        code: 'Serial.print("Distance: "); Serial.print(dist); Serial.println(" cm");',
        desc: 'พิมพ์ข้อความต่อกันเป็น 1 บรรทัด เช่น "Distance: 24.50 cm" แล้วขึ้นบรรทัดใหม่'
      },
      {
        code: 'delay(200);',
        desc: 'หน่วงเวลา 200 มิลลิวินาที (0.2 วินาที) เพื่อไม่ให้ข้อความบน Serial Monitor วิ่งเร็วเกินไปจนอ่านไม่ทัน'
      }
    ]
  }
]

const lab3Steps = [
  {
    tabLabel: 'ขาพินและเกณฑ์ระยะ',
    badge: '1. ตัวแปรค่าคงที่ (Constants)',
    title: 'กำหนดขา HC-SR04 และตั้งเกณฑ์ระยะอันตราย 30 cm',
    summary: 'Lab 3 นี้เราเอาเซนเซอร์ HC-SR04 จาก Lab 2 มาผสานกับ While Loop โดยกำหนดเส้นแบ่งระยะอันตรายไว้ที่ 30 เซนติเมตรครับ',
    code: `const int TRIG_PIN = 10;
const int ECHO_PIN = 9;

const float DANGER_DISTANCE = 30.0; // เกณฑ์ระยะอันตราย (เซนติเมตร)`,
    lines: [
      {
        code: 'const int TRIG_PIN = 10; / ECHO_PIN = 9;',
        desc: 'ใช้ขา Pin 10 (TRIG) และ Pin 9 (ECHO) ต่อกับเซนเซอร์ HC-SR04 ตามภาพ Wiring Guide ด้านบน'
      },
      {
        code: 'const float DANGER_DISTANCE = 30.0;',
        desc: 'ตั้งเกณฑ์ระยะเตือนภัยไว้ที่ 30.0 cm ถ้าน้อยกว่านี้จะให้เข้าไปแจ้งเตือนในลูป while'
      }
    ]
  },
  {
    tabLabel: 'ตั้งค่า setup()',
    badge: '2. ฟังก์ชัน setup()',
    title: 'เตรียม Serial Monitor และแสดงหัวข้อเริ่มต้น',
    summary: 'ตั้งค่าขาพินเหมือนเดิม แล้วพิมพ์เส้นคั่นสวยๆ บน Serial Monitor เพื่อบอกว่าพร้อมทดสอบแล้ว',
    code: `void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.println("================================================");
  Serial.println("HC-SR04 + While Loop (Serial Monitor Ready)");
  Serial.println("================================================");
}`,
    lines: [
      {
        code: 'pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);',
        desc: 'กำหนด TRIG เป็นขาส่งคลื่น (OUTPUT) และ ECHO เป็นขารับคลื่นสะท้อน (INPUT)'
      },
      {
        code: 'Serial.println("HC-SR04 + While Loop (Serial Monitor Ready)");',
        desc: 'พิมพ์ข้อความหัวเรื่องออกทาง Serial Monitor เพียงครั้งเดียวตอนเริ่มทำงาน'
      }
    ]
  },
  {
    tabLabel: 'getDistance() + กัน Timeout',
    badge: '3. ฟังก์ชันวัดระยะแบบป้องกันพลาด',
    title: 'เพิ่มตัวดัก Timeout ไม่ให้ค่าระยะทางเพี้ยนเป็น 0',
    summary: 'จุดอัปเกรดจาก Lab 2 คือถ้าวัตถุอยู่ไกลมากจนคลื่นสะท้อนกลับมาไม่ทัน คำสั่ง pulseIn จะคืนเลข 0 ซึ่งจะหลอกโปรแกรมว่าวัตถุอยู่ใกล้ 0 cm จึงต้องดักไว้',
    code: `float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 999.0; // กันกรณี Timeout คืน 0 เพื่อไม่ให้ลั่นผิดพลาด
  return duration * 0.034 / 2.0;
}`,
    lines: [
      {
        code: 'long duration = pulseIn(ECHO_PIN, HIGH, 30000);',
        desc: 'ยิงคลื่นแล้วจับเวลาไป-กลับเหมือน Lab 2 (รอไม่เกิน 30,000 ไมโครวินาที)'
      },
      {
        code: 'if (duration == 0) return 999.0;',
        desc: 'ถ้า pulseIn หมดเวลาแล้วได้ 0 (คือไม่เจอวัตถุในระยะเซนเซอร์) ให้ตอบกลับเป็น 999.0 cm แทน เพื่อแปลว่าอยู่ไกลมาก ปลอดภัย'
      },
      {
        code: 'return duration * 0.034 / 2.0;',
        desc: 'ถ้าจับเวลาได้ปกติ ก็คำนวณเป็นเซนติเมตรแล้วส่งค่ากลับตามสูตรเดิม'
      }
    ],
    tip: 'ถ้าไม่มี if (duration == 0) return 999.0; เวลาไม่มีวัตถุอยู่หน้าเซนเซอร์ ระยะทางอาจกลายเป็น 0 cm จนทำให้เงื่อนไข < 30.0 เป็นจริงและลั่นเตือนมั่วได้ครับ'
  },
  {
    tabLabel: 'ลูป while เตือนระยะใกล้',
    badge: '4. Initialization + While Loop + Update',
    title: 'วนแจ้งเตือน "[ALERT]" ต่อเนื่องตราบใดที่วัตถุใกล้กว่า 30 cm',
    summary: 'ใช้โครงสร้าง 3 ขั้นของ While Loop แบบเดียวกับ Lab 1 เลยครับ แต่เปลี่ยนจาก "อ่านปุ่มกด" มาเป็น "วัดระยะทางจาก HC-SR04" แทน',
    code: `void loop() {
  // 1. Initialization: วัดระยะทางเริ่มต้นก่อนตรวจสอบเงื่อนไข
  float distance = getDistance();

  // 2. While Loop: ตราบใดที่วัตถุเข้ามาใกล้กว่า 30 cm ให้แจ้งเตือนผ่าน Serial ไม่หยุด
  while (distance > 0 && distance < DANGER_DISTANCE) {
    Serial.print("[ALERT - INSIDE WHILE] Object too close: ");
    Serial.print(distance);
    Serial.println(" cm");
    delay(300);

    // 3. Update: วัดระยะทางใหม่อีกครั้ง เพื่อใช้ตัดสินใจว่าจะออกจากลูปหรือไม่
    distance = getDistance();
  }`,
    lines: [
      {
        code: 'float distance = getDistance();',
        desc: 'ขั้น Initialization: วัดระยะวัตถุครั้งแรกก่อนเข้าลูป while'
      },
      {
        code: 'while (distance > 0 && distance < DANGER_DISTANCE)',
        desc: 'ขั้น Condition: ตรวจว่าค่าระยะมากกว่า 0 และน้อยกว่า 30.0 cm หรือไม่ ถ้าใช่ (เป็นจริง) ให้เข้าไปแจ้งเตือนในลูป'
      },
      {
        code: 'Serial.print("[ALERT - INSIDE WHILE] ..."); delay(300);',
        desc: 'ขั้น Loop Body: พิมพ์ข้อความเตือนระยะใกล้พร้อมตัวเลข cm ออกทาง Serial Monitor ทุกๆ 0.3 วินาที'
      },
      {
        code: 'distance = getDistance();',
        desc: 'ขั้น Update: วัดระยะทางใหม่อีกครั้งก่อนจบรอบปีกกา เผื่อวัตถุถอยออกไปแล้วจะได้หลุดออกจากลูป while'
      }
    ],
    tip: 'สังเกตคำว่า distance > 0 && distance < DANGER_DISTANCE: เครื่องหมาย && แปลว่า "และ" คือต้องผ่านทั้ง 2 เงื่อนไขพร้อมกันเพื่อความปลอดภัยยิ่งขึ้นครับ'
  },
  {
    tabLabel: 'สถานะปลอดภัย [SAFE]',
    badge: '5. หลังออกจากลูป while',
    title: 'พ้นระยะอันตราย (>= 30 cm) แสดงข้อความ "[SAFE]"',
    summary: 'เมื่อเลื่อนวัตถุถอยออกไปห่างตั้งแต่ 30 cm ขึ้นไป เงื่อนไขใน while จะเป็นเท็จ โปรแกรมจึงหลุดออกจากลูปมาพิมพ์สถานะปลอดภัยครับ',
    code: `  // หลุดออกจากลูป while เมื่อระยะทาง >= 30 cm (ปลอดภัย)
  Serial.print("[SAFE] Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(300);
}`,
    lines: [
      {
        code: 'Serial.print("[SAFE] Distance: "); Serial.print(distance); Serial.println(" cm");',
        desc: 'พิมพ์สถานะ [SAFE] พร้อมระยะทางปัจจุบันลงใน Serial Monitor'
      },
      {
        code: 'delay(300);',
        desc: 'หน่วงเวลา 0.3 วินาที ก่อนวนกลับขึ้นไปเริ่มรอบ void loop() ใหม่'
      }
    ]
  }
]

// ============================================================================
// MINI-GAMES DATA (SECTION 5)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'Condition: เงื่อนไขในวงเล็บ while (...) ที่ตรวจก่อนเข้าลูปเสมอ', type: 'while-core' },
  { id: 2, text: 'Update: คำสั่งอ่านค่าเซนเซอร์หรือปุ่มกดใหม่ก่อนจบรอบปีกกา', type: 'while-core' },
  { id: 3, text: 'หากเงื่อนไขเป็นเท็จตั้งแต่ครั้งแรก ลูปจะทำงาน 0 รอบแล้วข้ามทันที', type: 'while-pitfall' },
  { id: 4, text: 'ลืมอัปเดตตัวแปรในลูป ทำให้เงื่อนไขเป็นจริงตลอดกาล (Infinite Loop)', type: 'while-pitfall' },
  { id: 5, text: 'ขา TRIG (ส่งคลื่น 10 us) และขา ECHO (รับเสียงสะท้อนกลับ)', type: 'hcsr04' },
  { id: 6, text: 'สูตรคำนวณระยะทาง: distance = duration * 0.034 / 2.0', type: 'hcsr04' }
]

const dragZonesData = [
  {
    id: 'while-core',
    title: '1. องค์ประกอบสำคัญของ While Loop',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากองค์ประกอบโครงสร้างของ While Loop มาวางที่นี่'
  },
  {
    id: 'while-pitfall',
    title: '2. หลักการทำงานและข้อควรระวัง While Loop',
    wrapperClass: 'border-rose-400/50 hover:bg-black/40',
    titleClass: 'text-rose-300 border-rose-400/30',
    itemBgClass: 'bg-rose-600/50 border-rose-400',
    emptyTextClass: 'text-rose-200/50',
    emptyText: 'ลากพฤติกรรมและข้อควรระวังของ While Loop มาวางที่นี่'
  },
  {
    id: 'hcsr04',
    title: '3. อุปกรณ์และการคำนวณ Ultrasonic HC-SR04',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากข้อมูลขาพินและสูตรของ HC-SR04 มาวางที่นี่'
  }
]

const matchLeftTerms = [
  { id: 'l1', text: 'while (condition)', match: 'r1' },
  { id: 'l2', text: 'Infinite Loop', match: 'r2' },
  { id: 'l3', text: 'TRIG Pin (HC-SR04)', match: 'r3' },
  { id: 'l4', text: 'ECHO Pin (HC-SR04)', match: 'r4' },
  { id: 'l5', text: 'pulseIn(ECHO_PIN, HIGH)', match: 'r5' },
  { id: 'l6', text: 'duration * 0.034 / 2', match: 'r6' }
]

const matchRightDefs = [
  { id: 'r1', text: 'วนซ้ำทำคำสั่งในปีกกาตราบใดที่เงื่อนไขยังเป็นจริง (True)' },
  { id: 'r2', text: 'อาการลูปค้างไม่รู้จบ เพราะลืมอัปเดตตัวแปรในลูป' },
  { id: 'r3', text: 'ขาพินสำหรับส่งคลื่นเสียงความถี่สูง 40 kHz ออกไปจากเซนเซอร์' },
  { id: 'r4', text: 'ขาพินสำหรับรับสัญญาณเสียงที่สะท้อนจากวัตถุกลับมา' },
  { id: 'r5', text: 'คำสั่งจับระยะเวลาที่ขา ECHO มีสัญญาณ HIGH (หน่วยไมโครวินาที)' },
  { id: 'r6', text: 'สูตรแปลงเวลาเดินทางไป-กลับของเสียงให้เป็นระยะทาง (เซนติเมตร)' }
]

const quizQuestions = [
  {
    id: 1,
    question: 'ความแตกต่างสำคัญที่สุดระหว่างคำสั่ง "for loop" กับ "while loop" ในการเขียนโปรแกรม Arduino คือข้อใด?',
    options: [
      { id: 'a', text: 'for loop ใช้ได้กับหลอดไฟ LED เท่านั้น ส่วน while loop ใช้ได้เฉพาะกับเซนเซอร์', isCorrect: false },
      { id: 'b', text: 'for loop เหมาะกับงานที่รู้จำนวนรอบแน่นอน ส่วน while loop เหมาะกับงานที่ทำซ้ำตราบใดที่เงื่อนไขยังเป็นจริง', isCorrect: true },
      { id: 'c', text: 'for loop ไม่ต้องตรวจสอบเงื่อนไขก่อนทำงาน ส่วน while loop จะตรวจเงื่อนไขเฉพาะตอนจบรอบ', isCorrect: false },
      { id: 'd', text: 'for loop ทำงานได้สูงสุดไม่เกิน 10 รอบ ส่วน while loop ทำงานได้ไม่เกิน 100 รอบ', isCorrect: false }
    ],
    explanation: 'for loop ออกแบบมาสำหรับนับรอบที่รู้จำนวนชัดเจน (เช่น 0 ถึง 5) ขณะที่ while loop ทำซ้ำไปเรื่อยๆ โดยไม่รู้ล่วงหน้าว่าจะจบเมื่อใด ขึ้นอยู่กับว่าเงื่อนไขยังเป็นจริงอยู่หรือไม่'
  },
  {
    id: 2,
    question: 'คำสั่ง while loop เป็นลูปแบบ Pre-test Loop หากค่าเริ่มต้นทำให้เงื่อนไขในวงเล็บ while(...) เป็นเท็จ (FALSE) ตั้งแต่ครั้งแรก ลูปจะทำงานกี่รอบ?',
    options: [
      { id: 'a', text: 'ทำงาน 0 รอบ โดยโปรแกรมจะข้ามปีกกาของ while ไปทำคำสั่งถัดไปทันที', isCorrect: true },
      { id: 'b', text: 'ทำงาน 1 รอบก่อนเสมอ แล้วจึงตรวจสอบเงื่อนไขในตอนท้ายเพื่อออกจากลูป', isCorrect: false },
      { id: 'c', text: 'ทำงานตลอดไปไม่สิ้นสุดจนกว่าจะกดปุ่ม Reset บนบอร์ด Arduino', isCorrect: false },
      { id: 'd', text: 'คอมไพเลอร์จะแจ้ง Syntax Error และไม่สามารถอัปโหลดโค้ดลงบอร์ดได้', isCorrect: false }
    ],
    explanation: 'while loop ตรวจสอบเงื่อนไขก่อนเข้าสู่ปีกกาเสมอ (Pre-test) ดังนั้นถ้าเงื่อนไขเป็นเท็จตั้งแต่แรก ชุดคำสั่งภายใน while จะไม่ถูกเรียกใช้เลยแม้แต่รอบเดียว (0 รอบ)'
  },
  {
    id: 3,
    question: 'หากเขียนโค้ดว่า int btn = digitalRead(2); แล้วเข้าสู่ while (btn == LOW) { ... } โดยลืมสั่ง btn = digitalRead(2); ซ้ำในลูป จะเกิดปัญหาใดขึ้น?',
    options: [
      { id: 'a', text: 'ลูปจะทำงานเพียง 1 รอบแล้วหยุดลงเองแม้จะยังกดปุ่มค้างไว้ก็ตาม', isCorrect: false },
      { id: 'b', text: 'ปุ่มกดจะเปลี่ยนโหมดจาก INPUT_PULLUP เป็น OUTPUT โดยอัตโนมัติ', isCorrect: false },
      { id: 'c', text: 'เกิด Infinite Loop เพราะค่า btn เป็น LOW ค้างตลอดกาล แม้ผู้ใช้จะปล่อยมือจากปุ่มแล้ว', isCorrect: true },
      { id: 'd', text: 'หลอดไฟ LED จะสว่างค้างด้วยความสว่างลดลงครึ่งหนึ่งเพราะแรงดันไฟตก', isCorrect: false }
    ],
    explanation: 'เมื่อไม่ยอมอัปเดตตัวแปร btn ภายในปีกกา ค่าของ btn จะไม่มีวันเปลี่ยนจาก LOW เป็น HIGH ทำให้เงื่อนไข (btn == LOW) เป็นจริงตลอดกาลและติดลูปไม่รู้จบ'
  },
  {
    id: 4,
    question: 'องค์ประกอบส่วนใดของ while loop ที่ทำหน้าที่เป็น "ทางออก" เพื่อไม่ให้โปรแกรมติดอยู่ในลูปไม่รู้จบ?',
    options: [
      { id: 'a', text: 'คำสั่ง Serial.begin(9600) ในฟังก์ชัน setup()', isCorrect: false },
      { id: 'b', text: 'ส่วน Update หรือการอ่านค่าตัวแปร/เซนเซอร์ใหม่ภายในปีกกาของ while', isCorrect: true },
      { id: 'c', text: 'คำสั่ง pinMode(..., OUTPUT) ที่ประกาศไว้ก่อนเข้าลูป', isCorrect: false },
      { id: 'd', text: 'คำสั่ง delay() ที่ใส่ไว้เพื่อหน่วงเวลาการกะพริบของหลอดไฟ', isCorrect: false }
    ],
    explanation: 'ส่วน Update (เช่น btnState = digitalRead(2); หรือ distance = getDistance();) ช่วยอัปเดตข้อมูลล่าสุดเพื่อให้เงื่อนไขมีโอกาสกลายเป็นเท็จและออกจากลูปได้อย่างปลอดภัย'
  },
  {
    id: 5,
    question: 'ในการต่อปุ่มกดแบบ INPUT_PULLUP ที่ขา Pin 2 เพื่อใช้กับ while loop หากต้องการให้ระบบ "ร้องเตือนตราบใดที่ยังกดปุ่มค้างไว้" ต้องเขียนเงื่อนไขอย่างไร?',
    options: [
      { id: 'a', text: 'while (btnState == HIGH)', isCorrect: false },
      { id: 'b', text: 'while (btnState > 500)', isCorrect: false },
      { id: 'c', text: 'while (btnState == OUTPUT)', isCorrect: false },
      { id: 'd', text: 'while (btnState == LOW)', isCorrect: true }
    ],
    explanation: 'โหมด INPUT_PULLUP มีสถานะปกติเป็น HIGH และเมื่อกดปุ่มลงกราวด์ (GND) สัญญาณจะเปลี่ยนเป็น LOW ดังนั้นเงื่อนไขกดปุ่มค้างคือ btnState == LOW'
  },
  {
    id: 6,
    question: 'เซนเซอร์วัดระยะทาง Ultrasonic รุ่น HC-SR04 มีขาพินทั้งหมดกี่ขา และมีชื่อขาพินใดบ้าง?',
    options: [
      { id: 'a', text: 'มี 3 ขา ได้แก่ VCC, SIG และ GND', isCorrect: false },
      { id: 'b', text: 'มี 4 ขา ได้แก่ VCC, TRIG, ECHO และ GND', isCorrect: true },
      { id: 'c', text: 'มี 4 ขา ได้แก่ 5V, SDA, SCL และ GND', isCorrect: false },
      { id: 'd', text: 'มี 2 ขา ได้แก่ Anode (+) และ Cathode (-)', isCorrect: false }
    ],
    explanation: 'รุ่น HC-SR04 มี 4 ขา: VCC (ไฟเลี้ยง 5V), TRIG (ขาส่งคลื่นเสียง), ECHO (ขารับคลื่นสะท้อน) และ GND (กราวด์) ควรระวังไม่หยิบสลับกับรุ่น PING 3 ขาบน Tinkercad'
  },
  {
    id: 7,
    question: 'ขา TRIG และขา ECHO ของ HC-SR04 ต้องกำหนดโหมด pinMode ใน setup() อย่างไรให้ถูกต้อง?',
    options: [
      { id: 'a', text: 'TRIG เป็น OUTPUT และ ECHO เป็น INPUT', isCorrect: true },
      { id: 'b', text: 'TRIG เป็น INPUT และ ECHO เป็น OUTPUT', isCorrect: false },
      { id: 'c', text: 'ทั้ง TRIG และ ECHO ต้องตั้งเป็น OUTPUT เหมือนกัน', isCorrect: false },
      { id: 'd', text: 'ทั้ง TRIG และ ECHO ต้องตั้งเป็น INPUT_PULLUP เหมือนกัน', isCorrect: false }
    ],
    explanation: 'Arduino สั่งให้ TRIG ยิงคลื่นออกไปจึงเป็น OUTPUT ส่วน ECHO รอรับสัญญาณสะท้อนกลับเข้ามาที่บอร์ดจึงต้องตั้งเป็น INPUT'
  },
  {
    id: 8,
    question: 'ในสูตรคำนวณระยะทางของ Ultrasonic: distance = duration * 0.034 / 2.0 เหตุใดจึงต้องหารด้วย 2?',
    options: [
      { id: 'a', text: 'เพราะบอร์ด Arduino Uno ทำงานด้วยแรงดันไฟฟ้าเพียงครึ่งหนึ่งของเซนเซอร์', isCorrect: false },
      { id: 'b', text: 'เพราะคลื่นเสียงมีความเร็วลดลงครึ่งหนึ่งเมื่อกระทบกับวัตถุแข็ง', isCorrect: false },
      { id: 'c', text: 'เพราะค่า duration เป็นเวลาที่คลื่นเสียงเดินทางทั้งขาไปและขากลับ (ระยะทาง 2 เท่า)', isCorrect: true },
      { id: 'd', text: 'เพราะเซนเซอร์ HC-SR04 มีตัวรับและตัวส่งทำงานสลับกันคนละครึ่งเวลา', isCorrect: false }
    ],
    explanation: 'เวลา duration ที่ได้จาก pulseIn() นับตั้งแต่เสียงวิ่งออกไปชนวัตถุ (ขาไป) จนสะท้อนกลับมาถึงตัวรับ (ขากลับ) จึงต้องหาร 2 เพื่อให้ได้ระยะทางจริงเพียงขาเดียว'
  },
  {
    id: 9,
    question: 'คำสั่ง pulseIn(ECHO_PIN, HIGH) ที่ใช้ร่วมกับเซนเซอร์ HC-SR04 คืนค่าผลลัพธ์เป็นตัวเลขในหน่วยใด?',
    options: [
      { id: 'a', text: 'เซนติเมตร (Centimeters)', isCorrect: false },
      { id: 'b', text: 'มิลลิวินาที (Milliseconds)', isCorrect: false },
      { id: 'c', text: 'เฮิรตซ์ (Hertz)', isCorrect: false },
      { id: 'd', text: 'ไมโครวินาที (Microseconds)', isCorrect: true }
    ],
    explanation: 'pulseIn() วัดความกว้างของสัญญาณ HIGH ที่ขา ECHO เป็นหน่วยไมโครวินาที (1 วินาที = 1,000,000 ไมโครวินาที) ซึ่งตรงกับความเร็วเสียง 0.034 cm/us'
  },
  {
    id: 10,
    question: 'ในโปรเจกต์เตือนภัย HC-SR04 ใช้เงื่อนไข while (distance > 0 && distance < 30.0) การเพิ่มเงื่อนไข distance > 0 มีประโยชน์อย่างไร?',
    options: [
      { id: 'a', text: 'ช่วยให้เซนเซอร์สามารถวัดระยะทางได้ไกลเกินกว่า 10 เมตร', isCorrect: false },
      { id: 'b', text: 'ป้องกันการแจ้งเตือนผิดพลาดเมื่อเกิด Timeout หรือไม่มีคลื่นสะท้อนกลับจนได้ค่า 0', isCorrect: true },
      { id: 'c', text: 'ช่วยเร่งความเร็วเสียงของเซนเซอร์ให้ทำงานไวขึ้นเป็นสองเท่า', isCorrect: false },
      { id: 'd', text: 'บังคับให้ไฟเขียวและไฟแดงติดสว่างพร้อมกันตลอดเวลา', isCorrect: false }
    ],
    explanation: 'หากไม่มีวัตถุอยู่หน้าเซนเซอร์หรือสัญญาณสะท้อนหาย pulseIn() อาจหมดเวลา (Timeout) และคืนค่า 0 ซึ่งน้อยกว่า 30 เงื่อนไข distance > 0 จึงช่วยกันไม่ให้เตือนภัยลั่นเอง'
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
        <div class="flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <span
              class="px-4 py-1.5 bg-amber-500/20 text-amber-300 font-black rounded-full text-xs uppercase tracking-wider border border-amber-400/30">
              สัปดาห์ที่ 5 • รหัสวิชา 21901-2007
            </span>
            <span
              class="px-3.5 py-1.5 bg-white/10 text-stone-200 text-xs rounded-full font-bold border border-white/15">
              While Loop Control + Ultrasonic HC-SR04
            </span>
          </div>

          <button v-if="isTeacher" @click="showTeacherModal = true"
            class="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow cursor-pointer transition-colors">
            <Trophy class="w-3.5 h-3.5" />
            <span>ดูคะแนนเกม (ครู)</span>
          </button>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          คำสั่งวนซ้ำแบบมีเงื่อนไข <span class="text-amber-400 font-mono">While Loop</span><br />
          <span class="text-xl sm:text-2xl md:text-3xl text-orange-300 font-bold">
            จากอุปกรณ์พื้นฐาน (ปุ่มกด / LED / Buzzer) สู่เซนเซอร์วัดระยะทาง Ultrasonic (HC-SR04)
          </span>
        </h1>

        <p class="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          เจาะลึกโครงสร้างคำสั่งวนซ้ำ <code>while loop</code> แบบแยก 5 องค์ประกอบอย่างละเอียด พร้อมกับดัก Infinite Loop
          เริ่มฝึกปฏิบัติจริงร่วมกับอุปกรณ์พื้นฐานที่เรียนผ่านมาแล้ว ก่อนต่อยอดเข้าสู่เซนเซอร์ตัวใหม่
          <strong>Ultrasonic Distance Sensor (HC-SR04)</strong> เพื่อสร้างระบบแจ้งเตือนระยะใกล้บน Tinkercad
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200 font-bold">
            <RotateCw class="w-4 h-4 text-amber-400" />
            <span>หัวข้อที่ 1: แยกองค์ประกอบ While Loop</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200 font-bold">
            <ToggleLeft class="w-4 h-4 text-emerald-400" />
            <span>หัวข้อที่ 2: ฝึกกับปุ่มกด LED &amp; Buzzer</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-sky-500/30 flex items-center gap-2 text-xs text-sky-200 font-bold">
            <Radio class="w-4 h-4 text-sky-400" />
            <span>หัวข้อที่ 3: รู้จัก Ultrasonic HC-SR04</span>
          </div>
          <div
            class="px-4 py-2 rounded-2xl bg-black/35 border border-orange-500/30 flex items-center gap-2 text-xs text-orange-200 font-bold">
            <Activity class="w-4 h-4 text-orange-400" />
            <span>หัวข้อที่ 4: บูรณาการระบบเตือนระยะใกล้</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Check-In System -->
    <CheckInSystem :course-id="currentCourseId" :week-number="currentWeek" />

    <!-- ============================================================== -->
    <!-- SECTION 1: ANATOMY OF WHILE LOOP                               -->
    <!-- ============================================================== -->
    <section class="space-y-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-amber-100 rounded-2xl text-amber-700 shadow-sm">
          <RotateCw class="w-7 h-7" />
        </div>
        <div>
          <span class="text-xs font-black text-amber-700 uppercase tracking-wider">ส่วนที่ 1 • โครงสร้างพื้นฐาน
            C++</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900">
            แยกองค์ประกอบของคำสั่ง <span class="font-mono text-amber-700">While Loop</span> อย่างละเอียด
          </h2>
        </div>
      </div>

      <!-- 1.1 Compare For Loop vs While Loop -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-3xl p-6 bg-white border-2 border-stone-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-black">ทบทวนสัปดาห์ที่ 4</span>
            <span class="font-mono text-xs font-bold text-stone-500">Known Iterations</span>
          </div>
          <h3 class="text-xl font-black text-stone-900 flex items-center gap-2">
            <Layers class="w-5 h-5 text-amber-600" />
            <span>For Loop (รู้จำนวนรอบแน่นอน)</span>
          </h3>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
            ใช้เมื่อรู้ล่วงหน้าชัดเจนว่าจะทำซ้ำกี่รอบ เช่น วิ่งไฟ LED 6 ดวง (<code>i = 0</code> ถึง <code>5</code>)
            โดยเขียนค่าเริ่มต้น เงื่อนไข และการนับรอบรวมไว้ในบรรทัดเดียวกัน
          </p>
          <div
            class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs leading-relaxed">
            <span class="text-amber-300 font-bold">for</span> (<span class="text-violet-300 font-semibold">int</span> i
            = <span class="text-orange-300">0</span>; i &lt; <span class="text-orange-300">6</span>; i++) &#123;<br />
            &nbsp;&nbsp;<span class="text-sky-200 italic">// ทำงานครบ 6 รอบแน่นอนแล้วออก</span><br />
            &#125;
          </div>
        </div>

        <div class="rounded-3xl p-6 bg-amber-50/70 border-2 border-amber-300 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-black">เนื้อหาใหม่สัปดาห์ที่
              5</span>
            <span class="font-mono text-xs font-bold text-amber-800">Condition-Controlled</span>
          </div>
          <h3 class="text-xl font-black text-amber-950 flex items-center gap-2">
            <Zap class="w-5 h-5 text-amber-600" />
            <span>While Loop (ทำซ้ำตามเงื่อนไขไม่รู้จบแน่นอน)</span>
          </h3>
          <p class="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
            ใช้เมื่อ<strong>ไม่รู้ล่วงหน้าว่าจะทำกี่รอบ</strong> รู้แค่ว่า <strong>"ตราบใดที่เงื่อนไขยังเป็นจริง
              (TRUE)"</strong>
            ให้ทำซ้ำไปเรื่อยๆ เช่น ร้องเตือนตราบใดที่คนยังกดปุ่มค้าง หรือวัตถุยังอยู่ใกล้กว่า 30 ซม.
          </p>
          <div
            class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs leading-relaxed">
            <span class="text-amber-300 font-bold">while</span> (<span
              class="text-cyan-300 font-bold">digitalRead</span>(<span class="text-rose-300 font-bold">BTN</span>) ==
            <span class="text-rose-300 font-bold">LOW</span>) &#123;<br />
            &nbsp;&nbsp;<span class="text-sky-200 italic">// ทำซ้ำเรื่อยๆ จนกว่าจะปล่อยมือ!</span><br />
            &#125;
          </div>
        </div>
      </div>

      <!-- 1.2 Anatomy Breakdown: 5 Components of While Loop -->
      <div class="rounded-3xl p-6 sm:p-8 bg-white border border-amber-200 shadow-sm space-y-6">
        <div class="space-y-1">
          <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
            ผ่าโครงสร้าง 5 องค์ประกอบสำคัญ (Anatomy of While Loop)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-stone-900 pt-1">
            แยกส่วนประกอบทุกชิ้นของคำสั่ง while loop
          </h3>
          <p class="text-xs sm:text-sm text-stone-600">
            ต่างจาก <code>for</code> ที่รวบทุกอย่างไว้ในวงเล็บเดียว คำสั่ง <code>while</code> แยกตำแหน่งการเขียนออกเป็น
            5 ส่วนดังนี้:
          </p>
        </div>

        <!-- Annotated Code Diagram -->
        <div
          class="p-5 rounded-2xl bg-slate-950 text-white font-mono text-xs sm:text-sm space-y-3 shadow-inner overflow-x-auto border border-slate-800">
          <div class="text-slate-200 text-xs font-sans flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Code2 class="w-4 h-4 text-amber-400 shrink-0" />
            <span class="font-bold">แผนภาพแยกสีองค์ประกอบทั้ง 5 ส่วนของ While Loop:</span>
          </div>

          <div class="space-y-2 text-xs sm:text-sm">
            <!-- Line 1: Initialization -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold">
                int btnState = digitalRead(BTN_PIN);
              </span>
              <span class="text-sky-200 font-sans text-xs italic">
                // [1] Initialization (กำหนดค่าเริ่มต้นก่อนเข้าลูป)
              </span>
            </div>

            <!-- Line 2: Keyword + Condition -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <div class="flex items-center gap-1.5">
                <span
                  class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">while</span>
                <span class="text-slate-200 font-bold">(</span>
                <span
                  class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold">btnState
                  == LOW</span>
                <span class="text-slate-200 font-bold">) &#123;</span>
              </div>
              <span class="text-amber-300 font-sans text-xs italic">
                // [2] Keyword + [3] Condition (ตรวจเงื่อนไขก่อนทำ)
              </span>
            </div>

            <!-- Line 3-6: Loop Body -->
            <div class="pl-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                digitalWrite(LED_RED, HIGH);
              </span>
              <span class="text-emerald-300 font-sans text-xs italic">
                // [4] Loop Body (ชุดคำสั่งที่ทำซ้ำเมื่อเป็นจริง)
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                delay(200);
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                digitalWrite(LED_RED, LOW);
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                delay(200);
              </span>
            </div>

            <!-- Line 7: Update / Re-read -->
            <div class="pl-6 pt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold">
                btnState = digitalRead(BTN_PIN);
              </span>
              <span class="text-purple-300 font-sans text-xs italic">
                // [5] Update / Re-read (อัปเดตค่าใหม่เพื่อหาทางออก)
              </span>
            </div>

            <!-- Line 8: Closing brace -->
            <div class="text-slate-200 font-bold">&#125;</div>
          </div>
        </div>

        <!-- 5 Breakdown Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">ส่วนที่ 1</span>
            <h4 class="font-bold text-sky-950 text-sm">Initialization</h4>
            <p class="text-sky-900/80 leading-relaxed">
              กำหนดค่าตัวแปรตั้งต้น หรืออ่านค่าจากเซนเซอร์ครั้งแรก<strong>ก่อนถึงบรรทัด while</strong>
              เพื่อใช้ตรวจสอบในรอบแรก
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">ส่วนที่ 2</span>
            <h4 class="font-bold text-amber-950 text-sm">while Keyword</h4>
            <p class="text-amber-900/80 leading-relaxed">
              คำสั่งวนซ้ำแบบ <strong>Pre-test Loop</strong>
              คือจะตรวจเงื่อนไขก่อนเสมอแล้วค่อยตัดสินใจว่าจะเข้าไปทำงานหรือไม่
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">ส่วนที่ 3</span>
            <h4 class="font-bold text-rose-950 text-sm">(Condition)</h4>
            <p class="text-rose-900/80 leading-relaxed">
              นิพจน์ตรรกะ (True/False) ถ้าจริงทำต่อ ถ้าเท็จออกทันที <strong>หากเป็นเท็จตั้งแต่แรก ลูปทำ 0 รอบ</strong>
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">ส่วนที่ 4</span>
            <h4 class="font-bold text-emerald-950 text-sm">&#123; Loop Body &#125;</h4>
            <p class="text-emerald-900/80 leading-relaxed">
              คำสั่งทั้งหมดภายในปีกกา เช่น สั่งเปิด-ปิดไฟ LED หรือส่งเสียง Buzzer เตือนภัยซ้ำๆ ในแต่ละรอบ
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">ส่วนที่ 5</span>
            <h4 class="font-bold text-purple-950 text-sm">Update / Re-read</h4>
            <p class="text-purple-900/80 leading-relaxed">
              <strong>หัวใจสำคัญที่สุด!</strong>
              ต้องอัปเดตตัวแปรหรืออ่านค่าปุ่ม/เซนเซอร์ใหม่ทุกครั้งก่อนจบรอบเพื่อเปิดทางออกจากลูป
            </p>
          </div>
        </div>
      </div>

      <!-- 1.2B Anatomy Breakdown: 5 Components of do...while Loop -->
      <div class="rounded-3xl p-6 sm:p-8 bg-white border border-indigo-200 shadow-sm space-y-6">
        <div class="space-y-1">
          <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
            ผ่าโครงสร้าง 5 องค์ประกอบสำคัญ (Anatomy of do...while Loop)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-stone-900 pt-1">
            แยกส่วนประกอบทุกชิ้นของคำสั่ง do...while loop
          </h3>
          <p class="text-xs sm:text-sm text-stone-600">
            ต่างจาก <code>while</code> ที่ตรวจเงื่อนไขด้านบน คำสั่ง <code>do...while</code>
            จะย้ายเงื่อนไขมาตรวจ<strong>ตอนท้ายรอบ (Post-test Loop)</strong> และต้องปิดท้ายด้วยเครื่องหมาย <code>;</code> เสมอดังนี้:
          </p>
        </div>

        <!-- Annotated Code Diagram: do...while -->
        <div
          class="p-5 rounded-2xl bg-slate-950 text-white font-mono text-xs sm:text-sm space-y-3 shadow-inner overflow-x-auto border border-slate-800">
          <div class="text-slate-200 text-xs font-sans flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Code2 class="w-4 h-4 text-indigo-400 shrink-0" />
            <span class="font-bold">แผนภาพแยกสีองค์ประกอบทั้ง 5 ส่วนของ do...while Loop:</span>
          </div>

          <div class="space-y-2 text-xs sm:text-sm">
            <!-- Line 1: Initialization -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold">
                int btnState;
              </span>
              <span class="text-sky-200 font-sans text-xs italic">
                // [1] Initialization (ประกาศตัวแปรนอกลูปเพื่อให้ while ตอนท้ายมองเห็น)
              </span>
            </div>

            <!-- Line 2: do Keyword -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <div class="flex items-center gap-1.5">
                <span
                  class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">do</span>
                <span class="text-slate-200 font-bold">&#123;</span>
              </div>
              <span class="text-amber-300 font-sans text-xs italic">
                // [2] do Keyword (เปิดลูปแบบ Post-test บังคับเข้าทำทันทีโดยยังไม่เช็ก)
              </span>
            </div>

            <!-- Line 3-6: Loop Body -->
            <div class="pl-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                digitalWrite(LED_RED, HIGH);
              </span>
              <span class="text-emerald-300 font-sans text-xs italic">
                // [3] Loop Body (ชุดคำสั่งที่ทำก่อนอย่างน้อย 1 รอบเสมอ)
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                delay(200);
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                digitalWrite(LED_RED, LOW);
              </span>
            </div>
            <div class="pl-6">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                delay(200);
              </span>
            </div>

            <!-- Line 7: Update / Re-read -->
            <div class="pl-6 pt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold">
                btnState = digitalRead(BTN_PIN);
              </span>
              <span class="text-purple-300 font-sans text-xs italic">
                // [4] Update / Re-read (อ่านค่าใหม่เพื่อนำไปเช็กตอนจบรอบ)
              </span>
            </div>

            <!-- Line 8: Closing brace + while (Condition); -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <div class="flex items-center gap-1.5">
                <span class="text-slate-200 font-bold">&#125;</span>
                <span
                  class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">while</span>
                <span class="text-slate-200 font-bold">(</span>
                <span
                  class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold">btnState == LOW</span>
                <span class="text-slate-200 font-bold">)</span>
                <span
                  class="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400 font-black">;</span>
              </div>
              <span class="text-rose-300 font-sans text-xs italic">
                // [5] while (Condition); (ตรวจเงื่อนไขตอนท้าย + ห้ามลืมเครื่องหมาย ; ปิดท้าย!)
              </span>
            </div>
          </div>
        </div>

        <!-- 5 Breakdown Cards: do...while -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">ส่วนที่ 1</span>
            <h4 class="font-bold text-sky-950 text-sm">Initialization (นอกลูป)</h4>
            <p class="text-sky-900/80 leading-relaxed">
              <strong>ต้องประกาศตัวแปรก่อน <code>do</code></strong> เพื่อไม่ให้ติดปัญหาขอบเขตตัวแปร (Scope)
              ตอนนำไปเช็กใน <code>while (...)</code> ด้านล่าง
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">ส่วนที่ 2</span>
            <h4 class="font-bold text-amber-950 text-sm">do Keyword</h4>
            <p class="text-amber-900/80 leading-relaxed">
              คำสั่งเปิดลูปแบบ <strong>Post-test Loop</strong> สั่งให้ CPU เข้าไปทำงานรอบแรกทันทีโดยยังไม่ตรวจเงื่อนไข
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">ส่วนที่ 3</span>
            <h4 class="font-bold text-emerald-950 text-sm">&#123; Loop Body &#125;</h4>
            <p class="text-emerald-900/80 leading-relaxed">
              ชุดคำสั่งภายในปีกกาที่จะถูกทำงาน<strong>อย่างน้อย 1 รอบแน่นอน</strong> แม้เงื่อนไขจะเป็นเท็จตั้งแต่แรก
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">ส่วนที่ 4</span>
            <h4 class="font-bold text-purple-950 text-sm">Update / Re-read</h4>
            <p class="text-purple-900/80 leading-relaxed">
              อ่านค่าปุ่มกดหรือเซนเซอร์ใหม่ภายในปีกกา เพื่อส่งค่าล่าสุดไปตัดสินใจในเงื่อนไขตอนท้ายรอบ
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">ส่วนที่ 5</span>
            <h4 class="font-bold text-rose-950 text-sm">while (Condition);</h4>
            <p class="text-rose-900/80 leading-relaxed">
              ตรวจเงื่อนไขตอนจบรอบ ถ้าจริงวนกลับไปที่ <code>do</code> ถ้าเท็จออกทันที
              (<strong>ต้องมี <code>;</code> ปิดท้ายเสมอ!</strong>)
            </p>
          </div>
        </div>
      </div>

      <!-- 1.3 Types & Usage Patterns of While Loop -->
      <div class="rounded-3xl p-6 sm:p-8 bg-white border border-amber-200 shadow-sm space-y-6">
        <div class="space-y-1">
          <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
            ประเภทและวิธีใช้งานจริง (While Loop Types &amp; Patterns)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-stone-900 pt-1">
            While Loop มีกี่แบบ ทำแบบไหนได้บ้าง และแต่ละแบบต่างกันอย่างไร?
          </h3>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
            คำสั่งตระกูล <code>while</code> ในภาษา C++ / Arduino แบ่งโครงสร้างหลักออกเป็น <strong>2 แบบ</strong> (<code>while</code> vs <code>do...while</code>)
            และนิยมนำไปประยุกต์เขียนแก้โจทย์ได้ <strong>4 รูปแบบหลัก</strong> ดังนี้:
          </p>
        </div>

        <!-- Part A: Pre-test while vs Post-test do...while -->
        <div class="space-y-3">
          <div class="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
            <Layers class="w-4 h-4 text-amber-600" />
            <span>ก. โครงสร้างหลัก 2 แบบในภาษา C++ / Arduino</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div
              v-for="item in whileStructureCompare"
              :key="item.id"
              class="rounded-2xl p-5 space-y-3.5"
              :class="item.cardClass"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black" :class="item.badgeClass">
                  {{ item.badge }}
                </span>
                <span class="text-xs font-bold" :class="item.titleClass">
                  {{ item.subtitle }}
                </span>
              </div>

              <div>
                <h4 class="text-lg font-mono font-black" :class="item.titleClass">
                  {{ item.title }}
                </h4>
                <p class="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                  {{ item.summary }}
                </p>
              </div>

              <div
                class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto space-y-0.5"
                v-html="highlightArduinoCode(item.code)"
              ></div>

              <div class="text-xs text-stone-700 leading-relaxed">
                <strong class="text-stone-900">เหมาะกับงานแบบไหน:</strong> {{ item.bestFor }}
              </div>

              <div
                v-if="item.note"
                class="p-2.5 rounded-xl bg-white/80 border border-indigo-200 text-xs text-indigo-950 font-medium flex items-start gap-2"
              >
                <Info class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{{ item.note }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Part B: 4 Practical Arduino Patterns (Tabbed) -->
        <div class="space-y-4 pt-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <Code2 class="w-4 h-4 text-amber-600" />
              <span>ข. 4 รูปแบบการประยุกต์ใช้งานบน Arduino (กดเลือกดูทีละแบบ)</span>
            </div>
            <span class="text-[11px] text-stone-500">เลือกแท็บด้านล่างเพื่อเปรียบเทียบโค้ดและวิธีใช้</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="(pattern, idx) in whileUsagePatterns"
              :key="idx"
              type="button"
              @click="activeWhilePattern = idx"
              class="px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all"
              :class="activeWhilePattern === idx
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-300'"
            >
              {{ pattern.tabLabel }}
            </button>
          </div>

          <div class="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 text-slate-100">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div class="space-y-1">
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                  {{ whileUsagePatterns[activeWhilePattern].badge }}
                </span>
                <h4 class="text-base sm:text-lg font-black text-white">
                  {{ whileUsagePatterns[activeWhilePattern].title }}
                </h4>
              </div>
              <span class="text-xs font-mono text-slate-400">
                แบบที่ {{ activeWhilePattern + 1 }} / {{ whileUsagePatterns.length }}
              </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div class="lg:col-span-6 space-y-3 text-xs sm:text-sm">
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div class="font-bold text-sky-300 text-xs">หลักการทำงาน</div>
                  <p class="text-slate-200 leading-relaxed">{{ whileUsagePatterns[activeWhilePattern].howItWorks }}</p>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div class="font-bold text-emerald-300 text-xs">ต่างจากแบบอื่นอย่างไร?</div>
                  <p class="text-slate-200 leading-relaxed">{{ whileUsagePatterns[activeWhilePattern].difference }}</p>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div class="font-bold text-amber-300 text-xs">ตัวอย่างงาน IoT ที่นิยมใช้</div>
                  <p class="text-slate-200 leading-relaxed">{{ whileUsagePatterns[activeWhilePattern].bestFor }}</p>
                </div>
              </div>

              <div class="lg:col-span-6 space-y-3">
                <div class="rounded-xl bg-black border border-slate-800 overflow-hidden">
                  <div class="px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-amber-300 font-bold">
                    ตัวอย่างโค้ด Arduino ({{ whileUsagePatterns[activeWhilePattern].tabLabel }})
                  </div>
                  <div
                    class="p-4 font-mono text-xs leading-relaxed overflow-x-auto space-y-0.5"
                    v-html="highlightArduinoCode(whileUsagePatterns[activeWhilePattern].code)"
                  ></div>
                </div>

                <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-100 flex items-start gap-2 leading-relaxed">
                  <Lightbulb class="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-amber-300">ข้อควรระวัง:</strong> {{ whileUsagePatterns[activeWhilePattern].caution }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part C: Summary Comparison Table -->
        <div class="space-y-2.5 pt-2">
          <div class="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>ค. ตารางสรุปความแตกต่างของ While Loop แต่ละแบบ</span>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-stone-200">
            <table class="w-full text-xs text-left text-stone-700">
              <thead class="bg-stone-100 text-stone-900 font-black border-b border-stone-200">
                <tr>
                  <th class="p-3">รูปแบบ While Loop</th>
                  <th class="p-3">จุดตรวจเงื่อนไข / วิธีหยุด</th>
                  <th class="p-3">จำนวนรอบขั้นต่ำ</th>
                  <th class="p-3">เหมาะกับงานแบบไหน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-200 bg-white">
                <tr v-for="row in whileComparisonRows" :key="row.name" class="hover:bg-amber-50/40">
                  <td class="p-3 font-mono font-bold text-stone-900">{{ row.name }}</td>
                  <td class="p-3 text-stone-700">{{ row.checkPoint }}</td>
                  <td class="p-3 font-bold text-amber-700">{{ row.minRuns }}</td>
                  <td class="p-3 text-stone-600">{{ row.useCase }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 1.4 Trap: Infinite Loop (Wrong vs Right) -->
      <div class="rounded-3xl p-6 sm:p-8 bg-rose-50/60 border-2 border-rose-200 space-y-5">
        <div class="flex items-start gap-3">
          <div class="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-rose-950">
              ข้อควรระวังอันดับ 1: กับดัก Infinite Loop (ลูปไม่รู้จบ)
            </h3>
            <p class="text-xs sm:text-sm text-rose-900/80 mt-0.5 leading-relaxed">
              ความผิดพลาดที่พบบ่อยที่สุดในการสอน <code>while loop</code> คือการอ่านค่าใส่ตัวแปรไว้นอกลูปแล้ว
              <strong>ลืมอ่านค่าซ้ำข้างในลูป</strong> ทำให้บอร์ด Arduino ค้างอยู่ใน <code>while</code> ตลอดกาล
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Wrong -->
          <div class="rounded-2xl bg-white border-2 border-rose-300 overflow-hidden shadow-xs">
            <div
              class="px-4 py-2.5 bg-rose-100 border-b border-rose-200 flex items-center justify-between text-xs font-black text-rose-900">
              <span class="flex items-center gap-1.5">
                <XCircle class="w-4 h-4 text-rose-600" /> แบบผิด: ลืมอัพเดตค่าในลูป (ค้างตลอดกาล)
              </span>
            </div>
            <div class="p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto space-y-0.5"
              v-html="highlightArduinoCode(infiniteLoopWrongCode)"></div>
          </div>

          <!-- Right -->
          <div class="rounded-2xl bg-white border-2 border-emerald-300 overflow-hidden shadow-xs">
            <div
              class="px-4 py-2.5 bg-emerald-100 border-b border-emerald-200 flex items-center justify-between text-xs font-black text-emerald-900">
              <span class="flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" /> แบบถูก: อ่านค่าปุ่มใหม่ก่อนจบรอบทุกครั้ง
              </span>
            </div>
            <div class="p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto space-y-0.5"
              v-html="highlightArduinoCode(infiniteLoopRightCode)"></div>
          </div>
        </div>
      </div>

      <!-- 1.4 Interactive Step-by-Step While Loop Visualizer -->
      <div class="rounded-3xl p-6 sm:p-8 bg-stone-900 text-white border-2 border-stone-800 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div class="space-y-1">
            <span
              class="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              Interactive 1: Live While Loop Code Tracer
            </span>
            <h3 class="text-xl font-black text-white flex items-center gap-2">
              <Activity class="w-5 h-5 text-amber-400" />
              <span>ลองกดเดินทีละบรรทัด เพื่อดูการทำงานของ While Loop</span>
            </h3>
            <p class="text-xs text-stone-300">
              เลือกสถานะปุ่มกดด้านซ้าย แล้วกดปุ่มสีส้มเพื่อดูแถบไฮไลต์วิ่งทีละบรรทัดพร้อมสถานะหลอดไฟ LED จริง
            </p>
          </div>
          <button @click="resetWhileStepper"
            class="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer">
            <RefreshCw class="w-3.5 h-3.5" />
            <span>เริ่มใหม่</span>
          </button>
        </div>

        <!-- Controls + Visual Hardware -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div class="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div class="space-y-4">
              <!-- Physical Button Selector -->
              <div class="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div class="text-xs font-bold text-stone-200">1. เลือกสถานะปุ่มกดจริง (Pin 2):</div>
                <div class="grid grid-cols-2 gap-2">
                  <button @click="toggleStepButton(true)" :class="[
                    'py-2.5 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer',
                    stepBtnPressed
                      ? 'bg-rose-600 text-white border-rose-400 shadow'
                      : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-white'
                  ]">
                    กดค้าง (LOW)
                  </button>
                  <button @click="toggleStepButton(false)" :class="[
                    'py-2.5 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer',
                    !stepBtnPressed
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-white'
                  ]">
                    ปล่อยปุ่ม (HIGH)
                  </button>
                </div>
              </div>

              <!-- Hardware & CPU Memory Preview -->
              <div class="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-stone-200">สถานะอุปกรณ์และค่าในตัวแปร</span>
                  <span
                    class="px-2 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-[11px] text-amber-300">
                    รอบที่ทำใน while = {{ whileIteration }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-1">
                  <div class="p-3 rounded-xl bg-black border flex flex-col items-center justify-center gap-1.5"
                    :class="tracerRedOn ? 'border-rose-500/70' : 'border-stone-800'">
                    <TinkercadLed color="red" :on="tracerRedOn" size-class="w-10 h-12" />
                    <span class="text-[11px] font-bold" :class="tracerRedOn ? 'text-rose-300' : 'text-stone-400'">
                      ไฟแดง: {{ tracerRedOn ? 'ติดเตือนภัย' : 'ดับ' }}
                    </span>
                  </div>
                  <div class="p-3 rounded-xl bg-black border flex flex-col items-center justify-center gap-1.5"
                    :class="tracerGreenOn ? 'border-emerald-500/70' : 'border-stone-800'">
                    <TinkercadLed color="green" :on="tracerGreenOn" size-class="w-10 h-12" />
                    <span class="text-[11px] font-bold" :class="tracerGreenOn ? 'text-emerald-300' : 'text-stone-400'">
                      ไฟเขียว: {{ tracerGreenOn ? 'ติดปกติ' : 'ดับ' }}
                    </span>
                  </div>
                </div>

                <div
                  class="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span class="text-stone-300">btnState ในโค้ด =</span>
                  <span class="px-2 py-0.5 rounded font-black" :class="tracedBtnState === 'LOW'
                    ? 'bg-rose-500/20 text-rose-300'
                    : tracedBtnState === 'HIGH'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-stone-800 text-stone-400'">
                    {{ tracedBtnState ?? 'ยังไม่อ่านค่า' }}
                  </span>
                </div>
              </div>
            </div>

            <button @click="nextWhileStep"
              class="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Play class="w-4 h-4" />
              <span>{{ whilePhase === 'idle' || whilePhase === 'exit' ? 'เริ่มเดินบรรทัดที่ 1 (Next Step)' :
                'เดินไปบรรทัดถัดไป (Next Step)' }}</span>
            </button>
          </div>

          <!-- Right Panel: Live Highlighted Code Box + Plain Explanation -->
          <div class="lg:col-span-7 flex flex-col justify-between gap-4">
            <div class="rounded-2xl bg-slate-950 border border-stone-800 overflow-hidden">
              <div class="px-4 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
                <span class="font-bold text-amber-300 flex items-center gap-2">
                  <Code2 class="w-4 h-4" />
                  <span>ลำดับการอ่านโค้ดของบอร์ด Arduino (5 บรรทัดหลัก)</span>
                </span>
                <span class="text-[11px] font-mono text-stone-400">
                  {{ whilePhase === 'idle' ? 'รอเริ่ม' : `กำลังทำ: ${whilePhase.toUpperCase()}` }}
                </span>
              </div>

              <div class="p-3 space-y-1.5 font-mono text-xs">
                <div v-for="line in tracerLines" :key="line.phase"
                  class="px-3 py-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 transition-all"
                  :class="whilePhase === line.phase ? line.activeRow : 'text-stone-400 border-l-4 border-transparent'">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-4 shrink-0 flex items-center justify-center">
                      <ArrowRight v-if="whilePhase === line.phase" class="w-4 h-4 text-amber-300" />
                      <span v-else class="text-stone-600">{{ line.lineNo }}</span>
                    </span>
                    <span class="break-all" :class="whilePhase === line.phase ? 'font-bold text-white' : ''">
                      {{ line.code }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1.5 shrink-0">
                    <span v-if="line.phase === 'check' && whilePhase === 'check'"
                      class="px-2 py-0.5 rounded text-[10px] font-black border" :class="tracerConditionTrue
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                        : 'bg-emerald-500/25 border-emerald-400 text-emerald-200'">
                      {{ tracerConditionTrue ? 'TRUE -> เข้าในลูป' : 'FALSE -> ข้ามไปบรรทัด 5' }}
                    </span>
                    <span class="px-2 py-0.5 rounded border text-[10px] font-sans font-bold"
                      :class="whilePhase === line.phase ? line.activeTag : 'bg-stone-900 border-stone-800 text-stone-500'">
                      {{ line.tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Single-Step Explanation Card -->
            <div class="p-4 rounded-2xl border space-y-1.5 transition-all" :class="tracerExplanation.cardClass">
              <div class="text-[11px] font-black uppercase tracking-wider text-stone-400">
                กำลังเกิดอะไรขึ้นตอนนี้?
              </div>
              <div class="text-sm sm:text-base font-black" :class="tracerExplanation.titleClass">
                {{ tracerExplanation.title }}
              </div>
              <p class="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {{ tracerExplanation.detail }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 2: PRACTICE WITH BASIC HARDWARE (BUTTON + LED + BUZZER)-->
    <!-- ============================================================== -->
    <section class="space-y-8 pt-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-emerald-100 rounded-2xl text-emerald-700 shadow-sm">
          <ToggleLeft class="w-7 h-7" />
        </div>
        <div>
          <span class="text-xs font-black text-emerald-700 uppercase tracking-wider">ส่วนที่ 2 •
            ปฏิบัติการพื้นฐานก่อนเข้าเซนเซอร์ใหม่</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900">
            ฝึกใช้ <span class="font-mono text-emerald-700">While Loop</span> กับอุปกรณ์พื้นฐานเดิม (ปุ่มกด + LED +
            Buzzer)
          </h2>
        </div>
      </div>

      <div class="rounded-3xl p-6 sm:p-8 bg-white border border-emerald-200 shadow-sm space-y-6">
        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            Lab 1 (Warm-up): ระบบสัญญาณเตือนภัยแบบกดค้าง (Hold-to-Alarm)
          </span>
          <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
            ก่อนจะไปต่ออุปกรณ์ตัวใหม่ เรามาทดลองใช้ <code>while loop</code> ร่วมกับอุปกรณ์ที่เรียนผ่านมาในสัปดาห์ที่ 2–3
            (ปุ่มกด, LED 2 ดวง และ Piezo Buzzer) เพื่อให้เข้าใจจังหวะการทำงานของลูปอย่างแม่นยำ:
            <strong>กดปุ่มค้าง = ติดใน while (ไฟแดงกะพริบ + Buzzer ร้อง), ปล่อยปุ่ม = หลุดออกจาก while
              (ไฟเขียวติด)</strong>
          </p>
        </div>

        <!-- Basic Wiring Table -->
        <div class="overflow-x-auto rounded-2xl border border-stone-200">
          <table class="w-full text-xs text-left text-stone-700">
            <thead class="bg-stone-100 text-stone-900 font-black border-b border-stone-200">
              <tr>
                <th class="p-3">อุปกรณ์พื้นฐาน (จากสัปดาห์ที่ 2-3)</th>
                <th class="p-3">ขา Arduino</th>
                <th class="p-3">การต่อวงจรและหน้าที่ใน While Loop</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200 font-medium bg-white">
              <tr>
                <td class="p-3 font-bold text-stone-900">สวิตช์ปุ่มกด (Push Button)</td>
                <td class="p-3 font-mono font-bold text-sky-700">Pin 2 (INPUT_PULLUP)</td>
                <td class="p-3 text-stone-600">อีกขาต่อลง GND ใช้เป็นเงื่อนไขตรวจการกดค้าง
                  <code>while (btnState == LOW)</code></td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-rose-700">LED สีแดง + R 220Ω</td>
                <td class="p-3 font-mono font-bold text-rose-700">Pin 8 (OUTPUT)</td>
                <td class="p-3 text-stone-600">ขาลบลง GND ทำงานกะพริบเตือนภัยเฉพาะตอนอยู่ภายในปีกกา <code>while</code>
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-700">LED สีเขียว + R 220Ω</td>
                <td class="p-3 font-mono font-bold text-emerald-700">Pin 9 (OUTPUT)</td>
                <td class="p-3 text-stone-600">ขาลบลง GND ติดสว่างสถานะปกติเมื่อปล่อยปุ่มและหลุดออกจาก
                  <code>while</code></td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-amber-700">ลำโพง Piezo Buzzer</td>
                <td class="p-3 font-mono font-bold text-amber-700">Pin 10 (OUTPUT)</td>
                <td class="p-3 text-stone-600">ขั้วบวกเข้า Pin 10 ขั้วลบลง GND ส่งเสียงเตือนความถี่ 1000 Hz ภายในลูป
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Interactive 2: Hold-to-Alarm Simulator -->
        <div class="p-6 rounded-2xl bg-slate-900 text-white space-y-5 border border-slate-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span class="text-[11px] font-mono text-emerald-400 font-bold uppercase">Interactive 2 • Hold-to-Alarm
                Simulator</span>
              <h4 class="text-base sm:text-lg font-black text-white">ทดลองกดค้าง / สลับปุ่มเพื่อสังเกตการเข้า-ออก While
                Loop</h4>
            </div>
            <div class="flex items-center gap-2 font-mono text-xs">
              <span class="px-3 py-1 rounded-lg border"
                :class="isHoldAlarmActive ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'">
                {{ isHoldAlarmActive ? 'IN WHILE LOOP (btnState == LOW)' : 'OUTSIDE WHILE (btnState == HIGH)' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <!-- Control Button (Tinkercad Push Button) -->
            <div
              class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center flex flex-col items-center">
              <div class="text-xs text-slate-200 font-bold">ปุ่มกด Pin 2 (กดค้างไว้เพื่อเตือนภัย)</div>
              <TinkercadPushButton :pressed="isHoldAlarmActive" :active="isHoldAlarmActive" size-class="w-16 h-16"
                aria-label="ปุ่มกด Pin 2 Hold-to-Alarm" @hold-start="startHoldAlarm" @hold-end="stopHoldAlarm" />
              <button type="button" @click="toggleHoldAlarm"
                class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-[11px] font-semibold cursor-pointer transition-colors">
                {{ isHoldAlarmActive ? 'คลิกเพื่อปล่อยปุ่ม (HIGH)' : 'หรือคลิกล็อกปุ่มค้าง (LOW)' }}
              </button>
            </div>

            <!-- Tinkercad-style LEDs Visual -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-end justify-around">
              <div class="text-center space-y-1">
                <TinkercadLed color="red" :on="holdLedBlink" size-class="w-14 h-16" />
                <div class="text-[11px] font-bold text-rose-300">LED แดง (Pin 8)</div>
              </div>

              <div class="text-center space-y-1">
                <TinkercadLed color="green" :on="!isHoldAlarmActive" size-class="w-14 h-16" />
                <div class="text-[11px] font-bold text-emerald-300">LED เขียว (Pin 9)</div>
              </div>
            </div>

            <!-- Tinkercad-style Piezo Buzzer + Counter -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center">
              <TinkercadBuzzer :active="holdLedBlink" size-class="w-16 h-16" />
              <div class="text-xs font-bold text-amber-300">Piezo Buzzer (Pin 10)</div>
              <div class="text-xs font-mono font-black" :class="holdLedBlink ? 'text-rose-400' : 'text-slate-300'">
                {{ holdLedBlink ? 'BEEP! (1000 Hz)' : 'SILENT (noTone)' }}
              </div>
              <div class="text-[11px] font-mono text-slate-300">
                จำนวนรอบที่วนใน while: <strong class="text-amber-300">{{ holdLoopCount }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Code Block (2-Tab: while vs do...while Step-by-Step Walkthrough) -->
        <div class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div class="space-y-0.5">
              <div class="text-xs font-black text-stone-800">
                เลือกวิธีเขียนโค้ด (ต่อวงจรเหมือนกันทั้ง 2 แบบ: Pin 2, 8, 9, 10)
              </div>
              <div class="text-[11px] text-stone-600">
                ลองสลับแท็บเพื่อเปรียบเทียบการเขียนแบบ <code>while</code> และแบบ <code>do...while</code> บนอุปกรณ์ชุดเดียวกัน
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="lab1CodeTab = 'while'"
                class="px-3.5 py-2 rounded-xl border text-xs font-black cursor-pointer transition-all"
                :class="lab1CodeTab === 'while'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-400'"
              >
                1. เขียนด้วย While loop
              </button>
              <button
                type="button"
                @click="lab1CodeTab = 'dowhile'"
                class="px-3.5 py-2 rounded-xl border text-xs font-black cursor-pointer transition-all"
                :class="lab1CodeTab === 'dowhile'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-indigo-400'"
              >
                2. เขียนด้วย Do While
              </button>
            </div>
          </div>

          <ArduinoCodeWalkthrough
            :key="lab1CodeTab"
            :title="lab1CodeTab === 'while' ? 'Lab1_WhileLoop_BasicHardware.ino' : 'Lab1_DoWhile_BasicHardware.ino'"
            :subtitle="lab1CodeTab === 'while' ? 'แบบ while loop (ตรวจก่อนทำ) • 5 ขั้นตอน' : 'แบบ do...while (ทำก่อนตรวจ) • 5 ขั้นตอน'"
            :accent="lab1CodeTab === 'while' ? 'emerald' : 'indigo'"
            :full-code="lab1CodeTab === 'while' ? basicWhileCode : basicDoWhileCode"
            :steps="lab1CodeTab === 'while' ? lab1Steps : lab1DoWhileSteps"
            :highlighter="highlightArduinoCode"
          />
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- WORKSHOP: PRACTICE WHILE LOOP & DO WHILE                       -->
    <!-- ============================================================== -->
    <WhileLoopWorkshop />

    <!-- ============================================================== -->
    <!-- SECTION 3: INTRODUCING NEW DEVICE — ULTRASONIC SENSOR HC-SR04 -->
    <!-- ============================================================== -->
    <section class="space-y-8 pt-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-sky-100 rounded-2xl text-sky-700 shadow-sm">
          <Radio class="w-7 h-7" />
        </div>
        <div>
          <span class="text-xs font-black text-sky-700 uppercase tracking-wider">ส่วนที่ 3 • แนะนำอุปกรณ์ใหม่</span>
          <h2 class="text-2xl sm:text-3xl font-black text-stone-900">
            ทำความรู้จักเซนเซอร์วัดระยะทาง <span class="font-mono text-sky-700">Ultrasonic (HC-SR04)</span>
          </h2>
        </div>
      </div>

      <div class="rounded-3xl p-6 sm:p-8 bg-white border border-sky-200 shadow-sm space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-7 space-y-3">
            <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">
              หลักการทำงานแบบ Echo Location (เลียนแบบค้างคาว)
            </span>
            <h3 class="text-xl font-black text-stone-900">เซนเซอร์วัดระยะด้วยคลื่นเสียงความถี่สูง 40 kHz</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
              ตัวเซนเซอร์ประกอบด้วยดวงตากลม 2 ข้าง ข้างหนึ่งเป็น<strong>ตัวส่ง (Transmitter: ขา TRIG)</strong>
              ทำหน้าที่ยิงคลื่นเสียงความถี่สูงที่หูมนุษย์ไม่ได้ยินออกไป
              เมื่อคลื่นไปชนวัตถุข้างหน้าก็จะสะท้อนกลับมาเข้าที่
              <strong>ตัวรับ (Receiver: ขา ECHO)</strong> แล้วบอร์ด Arduino จะจับเวลาเดินทางไป-กลับมาคำนวณเป็นระยะทาง
            </p>
          </div>

          <div
            class="lg:col-span-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 text-xs text-amber-950">
            <div class="font-black text-amber-900 flex items-center gap-1.5 text-sm">
              <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0" />
              <span>ข้อควรระวังในการเลือกบน Tinkercad!</span>
            </div>
            <p class="leading-relaxed">
              ในช่องค้นหาอุปกรณ์ของ Tinkercad จะมี Ultrasonic อยู่ 2 รุ่น ให้เลือกตัวที่ชื่อ
              <strong>"Ultrasonic Distance Sensor (4 pin / HC-SR04)"</strong> ที่มี 4 ขา
              (<code>VCC, TRIG, ECHO, GND</code>) <strong>อย่าเลือกตัว 3 ขา (PING)</strong>
            </p>
          </div>
        </div>

        <!-- Wiring Guide Image + 4-Pin Hardware Reference -->
        <div class="rounded-2xl bg-slate-50 border border-sky-200 p-4 sm:p-6 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="space-y-1">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">
                <Cable class="w-3.5 h-3.5" /> Wiring Guide • ภาพตัวอย่างการต่อวงจร
              </span>
              <h4 class="text-lg font-black text-stone-900">
                ตัวอย่างการต่อ HC-SR04 เข้ากับ Arduino Uno (4 ขา)
              </h4>
            </div>
            <span class="text-xs font-mono font-bold text-stone-500">
              ต่อตรงจากเซนเซอร์เข้าบอร์ดได้ทันที
            </span>
          </div>

          <div class="rounded-2xl bg-white border border-stone-200 p-3 sm:p-4 shadow-sm">
            <img src="/iot/week5/hcsr04_wiring_guide.png"
              alt="ภาพตัวอย่างการต่อเซนเซอร์ Ultrasonic HC-SR04 กับ Arduino Uno"
              class="w-full max-w-2xl mx-auto rounded-xl object-contain" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-black text-rose-700 text-sm">1. VCC</span>
                <span class="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">สายสีแดง</span>
              </div>
              <div class="font-bold text-stone-900">ต่อเข้าขา 5V (แถบ POWER)</div>
              <p class="text-stone-600 leading-relaxed">
                ขาจ่ายไฟเลี้ยง +5 โวลต์จากบอร์ด Arduino Uno เพื่อเปิดการทำงานของเซนเซอร์
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-black text-amber-800 text-sm">2. TRIG</span>
                <span
                  class="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold">สายสีเหลือง</span>
              </div>
              <div class="font-bold text-stone-900">ต่อเข้าขา 10 (DIGITAL ~10)</div>
              <p class="text-stone-600 leading-relaxed">
                ขาสั่งการ (OUTPUT) ให้เซนเซอร์ยิงคลื่นเสียงความถี่สูงออกไป 10 ไมโครวินาที
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-black text-emerald-700 text-sm">3. ECHO</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">สายสีเขียว</span>
              </div>
              <div class="font-bold text-stone-900">ต่อเข้าขา 9 (DIGITAL ~9)</div>
              <p class="text-stone-600 leading-relaxed">
                ขารับสัญญาณ (INPUT) รอรับคลื่นเสียงที่สะท้อนกลับมาจากวัตถุเพื่อจับเวลา
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-black text-stone-800 text-sm">4. GND</span>
                <span class="px-2 py-0.5 rounded-full bg-stone-800 text-white text-[10px] font-bold">สายสีดำ</span>
              </div>
              <div class="font-bold text-stone-900">ต่อเข้าขา GND (แถบ POWER)</div>
              <p class="text-stone-600 leading-relaxed">
                ขากราวด์ 0V ต่อเชื่อมกับกราวด์ของบอร์ด Arduino เพื่อให้ไฟฟ้าครบวงจร
              </p>
            </div>
          </div>

          <div
            class="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5 leading-relaxed">
            <Info class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>หมายเหตุสำหรับใบงานที่ 5:</strong> ในตัวอย่างภาพนี้ใช้ <code>TRIG = Pin 10</code> และ
              <code>ECHO = Pin 9</code>
              สำหรับต่อทดสอบเฉพาะตัวเซนเซอร์ แต่หากนำไปต่อร่วมกับหลอด LED (Pin 8, 9) และ Buzzer (Pin 10) ในใบงานที่ 5
              สามารถย้ายสาย <code>TRIG / ECHO</code> ไปเสียบช่อง Digital ที่ว่างอยู่ (เช่น Pin 6 และ Pin 7)
              แล้วแก้เลขตัวแปรในโค้ดให้ตรงกันได้ครับ
            </div>
          </div>
        </div>

        <!-- Formula Breakdown -->
        <div class="p-5 rounded-2xl bg-slate-950 text-white space-y-4">
          <div class="flex items-center gap-2 text-sky-300 font-bold text-sm">
            <Info class="w-4 h-4" />
            <span>ผ่าสูตรคำนวณระยะทางทีละขั้น (ฟิสิกส์ + โปรแกรม)</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div class="font-bold text-amber-300">ขั้นที่ 1: ยิงคลื่นสั้น 10 µs</div>
              <div class="font-mono text-slate-100"><span class="text-cyan-300 font-bold">digitalWrite</span>(<span
                  class="text-rose-300 font-bold">TRIG</span>, <span
                  class="text-rose-300 font-bold">HIGH</span>);<br /><span
                  class="text-cyan-300 font-bold">delayMicroseconds</span>(<span class="text-orange-300">10</span>);
              </div>
              <p class="text-slate-200">กระตุ้นให้โมดูลส่งคลื่นเสียง 8 ลูกออกไปยังวัตถุ</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div class="font-bold text-emerald-300">ขั้นที่ 2: จับเวลาด้วย pulseIn()</div>
              <div class="font-mono text-slate-100"><span class="text-violet-300 font-semibold">long</span> duration =
                <span class="text-cyan-300 font-bold">pulseIn</span>(<span class="text-rose-300 font-bold">ECHO</span>,
                <span class="text-rose-300 font-bold">HIGH</span>);</div>
              <p class="text-slate-200">ได้เวลาเดินทางไป-กลับของเสียงในหน่วยไมโครวินาที (µs)</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div class="font-bold text-sky-300">ขั้นที่ 3: แปลงเป็นเซนติเมตร</div>
              <div class="font-mono text-slate-100 font-bold">distance = duration * <span
                  class="text-orange-300">0.034</span> / <span class="text-orange-300">2.0</span>;</div>
              <p class="text-slate-200">เสียงเดินทาง 0.034 cm/µs และต้องหาร 2 เพราะวัดระยะไป+กลับ</p>
            </div>
          </div>
        </div>

        <!-- Ultrasonic Test Code (Step-by-Step Walkthrough) -->
        <ArduinoCodeWalkthrough title="Lab2_HC_SR04_TestSerial.ino"
          subtitle="ทดสอบอ่านค่าระยะทางออก Serial Monitor • 4 ขั้นตอน" accent="sky" :full-code="ultrasonicTestCode"
          :steps="lab2Steps" :highlighter="highlightArduinoCode" />
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 5: MINI-GAMES & POST-TEST                              -->
    <!-- ============================================================== -->
    <GameCenterSection :course-id="currentCourseId" :week="currentWeek"
      drag-title="มินิเกมที่ 1: จำแนกองค์ประกอบ While Loop และอุปกรณ์ Ultrasonic HC-SR04"
      drag-subtitle="ลากการ์ดข้อความด้านล่างไปวางในหมวดหมู่ให้ถูกต้องครบทั้ง 6 ข้อ" :drag-items="dragItemsData"
      :drag-zones="dragZonesData" match-title="มินิเกมที่ 2: จับคู่คำสั่ง While Loop และขาพิน/สูตร HC-SR04"
      match-subtitle="จับคู่คำสั่งด้านซ้ายกับคำอธิบายการทำงานด้านขวาให้ถูกต้องครบทั้ง 6 คู่"
      :match-left-terms="matchLeftTerms" :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบหลังเรียนสัปดาห์ที่ 5 (While Loop & Ultrasonic HC-SR04)"
      quiz-subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจองค์ประกอบ While Loop และการใช้งาน HC-SR04"
      :quiz-questions="quizQuestions" :games="weekGames" />

    <!-- ============================================================== -->
    <!-- SECTION 6: ASSIGNMENT 5                                        -->
    <!-- ============================================================== -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-5"
      assignment-title="ใบงานที่ 5: ระบบเตือนเข้าใกล้พื้นที่หวงห้ามด้วยปุ่มเปิด-ปิด (Button State), While Loop และ Ultrasonic Sensor (HC-SR04) บน Tinkercad"
      :max-score="10">
      <template #number>5</template>
      <template #description>
        <p class="leading-relaxed">
          ให้นักศึกษาต่อวงจรและเขียนโปรแกรมภาษา C++ บน <strong>Autodesk Tinkercad Circuits</strong>
          โดยประยุกต์ใช้<strong>ปุ่มกดสลับสถานะเปิด-ปิดระบบ (Button State)</strong> ร่วมกับคำสั่งวนซ้ำ
          <strong>While Loop</strong> และเซนเซอร์วัดระยะทาง <strong>Ultrasonic (HC-SR04)</strong>
          พร้อมไฟ <strong>LED แดง / เขียว</strong> และ <strong>Piezo Buzzer</strong>
          (กดปุ่มเพื่อเปิดหรือปิดระบบเตือนภัยทั้งหมด และเมื่อระบบเปิดหากวัตถุเข้ามาใกล้กว่า <code>30 cm</code>
          ให้เข้าลูปแจ้งเตือนทันที)
        </p>
      </template>

      <template #tasks>
        <div class="space-y-8">
          <div
            class="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-md space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full bg-black/25 text-amber-100 text-xs font-black border border-white/15">
                ภารกิจปฏิบัติการรายบุคคล • 10 คะแนนเต็ม
              </span>
              <span class="px-3 py-1 rounded-xl bg-white/20 text-white text-xs font-black flex items-center gap-1.5">
                <Trophy class="w-4 h-4 text-amber-200" />
                จำลองบน Tinkercad + ส่งลิงก์วงจร
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black">
              ระบบเตือนเข้าใกล้พื้นที่หวงห้าม (Button State + HC-SR04 + While Loop Alarm)
            </h3>
            <p class="text-xs sm:text-sm text-amber-50 leading-relaxed">
              • <strong>เมื่อกดปุ่มเปิดระบบ (Button State = ON):</strong> หากวัตถุอยู่ใกล้กว่า <code>30 cm</code>
              เข้าสู่ <code>while</code> สั่งไฟ LED แดงกะพริบ + Buzzer ร้องเตือน และหากอยู่ห่าง <code>&gt;= 30 cm</code>
              ให้ไฟ LED เขียวติดค้าง<br />
              • <strong>เมื่อกดปุ่มปิดระบบ (Button State = OFF):</strong> ปิดหลอดไฟ LED ทั้ง 2 ดวงและปิดเสียง Buzzer
              ทั้งหมด (แม้มีวัตถุเข้าใกล้ก็ไม่แจ้งเตือน)
            </p>
          </div>

          <!-- Interactive 3: Assignment 5 Target Behavior Simulator (with Button State ON/OFF) -->
          <div class="rounded-3xl p-6 sm:p-8 bg-stone-900 text-white border-2 border-stone-800 shadow-2xl space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div class="space-y-1">
                <span
                  class="px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold">
                  ตัวอย่างผลลัพธ์ที่ต้องการ (Target Behavior Simulator)
                </span>
                <h4 class="text-xl font-black text-white flex items-center gap-2">
                  <SlidersHorizontal class="w-5 h-5 text-orange-400" />
                  <span>ทดลองกดปุ่มเปิด-ปิดระบบ และเลื่อนจุดสีฟ้าหน้าเซนเซอร์ HC-SR04</span>
                </h4>
                <p class="text-xs text-stone-200">
                  ลองกดปุ่ม <strong>Button State (Pin 2)</strong> เพื่อเปิด/ปิดระบบ
                  และคลิกลาก<strong>จุดสีฟ้า</strong>เข้า-ออกดูพฤติกรรมตัวอย่างก่อนลงมือต่อวงจรจริง
                </p>
              </div>

              <span class="px-3.5 py-1.5 rounded-xl font-mono text-xs font-black border self-start" :class="!radarSystemOn
                ? 'bg-stone-800 border-stone-600 text-stone-300'
                : isDangerZone
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                  : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'">
                {{ !radarSystemOn ? 'SYSTEM OFF (ปิดระบบ)' : isDangerZone ? `INSIDE WHILE (distance < ${simThreshold})`
                  : `SAFE / EXITED WHILE (>= ${simThreshold})` }}
              </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <!-- Tinkercad-style Interactive SVG Radar Canvas -->
              <div class="lg:col-span-6 space-y-4 p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-sky-300 flex items-center gap-1.5">
                    <Radio class="w-3.5 h-3.5" />
                    <span>พื้นที่จำลองเซนเซอร์ HC-SR04 (5 - 100 cm)</span>
                  </span>
                  <span class="font-mono font-black text-base px-2.5 py-0.5 rounded-lg border" :class="!radarSystemOn
                    ? 'bg-stone-800 border-stone-700 text-stone-300'
                    : isDangerZone
                      ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                      : 'bg-sky-500/20 border-sky-400/50 text-sky-200'">
                    {{ simDistance }} cm
                  </span>
                </div>

                <div class="rounded-2xl bg-slate-900/90 border border-slate-700/80 overflow-hidden shadow-inner">
                  <TinkercadUltrasonicRadar :distance="simDistance" :threshold="simThreshold" :enabled="radarSystemOn"
                    @update:distance="onRadarDistanceChange" />
                </div>

                <p class="text-[11px] text-sky-200 text-center">
                  ลากจุดสีฟ้าเข้า-ออกหน้าเซนเซอร์เพื่อจำลองระยะวัตถุ (เหมือนใน Tinkercad)
                </p>

                <div class="space-y-2 pt-2 border-t border-stone-800">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-amber-300">เกณฑ์ระยะอันตราย (DANGER_DISTANCE):</span>
                    <span class="font-mono font-black text-amber-300">&lt; {{ simThreshold }} cm</span>
                  </div>
                  <input v-model.number="simThreshold" @input="onRadarInput" type="range" min="15" max="50"
                    class="w-full accent-amber-400 cursor-pointer" />
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div class="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div class="text-stone-300 text-[10px]">เวลาสะท้อน (duration)</div>
                    <div class="text-sky-300 font-bold text-sm">{{ simDurationUs }} µs</div>
                  </div>
                  <div class="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div class="text-stone-300 text-[10px]">รอบที่ติดใน while</div>
                    <div class="text-amber-300 font-bold text-sm">{{ radarWhileLoops }} รอบ</div>
                  </div>
                </div>
              </div>

              <!-- Right Side: Button State Toggle + Tinkercad Hardware Output Visual -->
              <div class="lg:col-span-6 space-y-4">
                <!-- Push Button (Button State ON / OFF) -->
                <div
                  class="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="text-[11px] font-mono text-sky-300 font-bold">ปุ่มกดเปิด-ปิดระบบ • Digital Pin 2 (Button
                      State)</div>
                    <div class="text-xs text-stone-200">
                      สถานะปัจจุบัน:
                      <strong :class="radarSystemOn ? 'text-emerald-400' : 'text-rose-400'">
                        {{ radarSystemOn ? 'systemEnabled = true (เปิดระบบ)' : 'systemEnabled = false (ปิดระบบ)' }}
                      </strong>
                    </div>
                    <div class="text-[11px] text-stone-300">
                      คลิกที่ตัวปุ่ม Tinkercad ด้านขวาเพื่อสลับเปิด/ปิดระบบ
                    </div>
                  </div>
                  <div class="flex flex-col items-center shrink-0">
                    <TinkercadPushButton :active="radarSystemOn" size-class="w-16 h-16"
                      aria-label="ปุ่มกดเปิด-ปิดระบบ Pin 2" @press="toggleRadarSystem" />
                    <span class="text-[10px] font-mono font-bold mt-0.5"
                      :class="radarSystemOn ? 'text-emerald-400' : 'text-stone-300'">
                      {{ radarSystemOn ? 'ON (เปิด)' : 'OFF (ปิด)' }}
                    </span>
                  </div>
                </div>

                <!-- Tinkercad Hardware Output Visual -->
                <div class="p-5 rounded-2xl bg-black border border-stone-800 space-y-5">
                  <div class="flex items-end justify-around py-2">
                    <div class="text-center space-y-1.5">
                      <TinkercadLed color="red" :on="radarSystemOn && radarRedBlink" size-class="w-16 h-20" />
                      <div class="text-xs font-bold text-rose-300">LED แดง (Pin 8)</div>
                    </div>

                    <div class="text-center space-y-1.5">
                      <TinkercadLed color="green" :on="radarSystemOn && !isDangerZone" size-class="w-16 h-20" />
                      <div class="text-xs font-bold text-emerald-300">LED เขียว (Pin 9)</div>
                    </div>

                    <div class="text-center space-y-1.5">
                      <TinkercadBuzzer :active="radarSystemOn && radarRedBlink" size-class="w-20 h-20" />
                      <div class="text-xs font-bold text-amber-300">Piezo Buzzer (Pin 10)</div>
                    </div>
                  </div>

                  <div class="p-3.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs space-y-1">
                    <div class="text-stone-300 text-[10px]">Serial Monitor Output Preview:</div>
                    <div v-if="!radarSystemOn" class="text-stone-300 font-bold">
                      [SYSTEM OFF] Button State = false (All LEDs &amp; Buzzer OFF)
                    </div>
                    <div v-else-if="isDangerZone" class="text-rose-400 font-bold">
                      [ALERT - INSIDE WHILE] Object too close: {{ simDistance }}.00 cm
                    </div>
                    <div v-else class="text-emerald-400 font-bold">
                      [SAFE] Distance: {{ simDistance }}.00 cm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hardware Summary Table -->
          <div class="rounded-2xl p-6 bg-stone-50 border border-stone-200 space-y-4">
            <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
              <Cable class="w-5 h-5 text-amber-600" />
              สรุปการต่อสายวงจรบน Tinkercad (ปุ่มเปิด-ปิด + HC-SR04 + LED 2 ดวง + Buzzer)
            </h4>
            <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table class="w-full text-xs text-left text-stone-700">
                <thead class="bg-stone-100 text-stone-800 font-black border-b border-stone-200">
                  <tr>
                    <th class="p-3">อุปกรณ์</th>
                    <th class="p-3">ขา Arduino Uno</th>
                    <th class="p-3">รายละเอียดการต่อ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-200">
                  <tr class="bg-sky-50/40">
                    <td class="p-3 font-bold text-sky-900">Push Button (ปุ่มเปิด-ปิดระบบ)</td>
                    <td class="p-3 font-mono font-bold text-sky-700">Digital Pin 2</td>
                    <td class="p-3">ขาฝั่งหนึ่งเข้า Pin 2 (<code>INPUT_PULLUP</code>), ขาอีกฝั่งลง GND (ใช้สลับ Button
                      State ON/OFF)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-stone-900">HC-SR04 (4 ขา)</td>
                    <td class="p-3 font-mono font-bold text-sky-700">5V, Pin 6, Pin 7, GND</td>
                    <td class="p-3">VCC -&gt; 5V, TRIG -&gt; Pin 6, ECHO -&gt; Pin 7, GND -&gt; GND</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-rose-700">LED สีแดง + R 220Ω</td>
                    <td class="p-3 font-mono font-bold text-rose-700">Digital Pin 8</td>
                    <td class="p-3">ขาบวกผ่าน R 220Ω เข้า Pin 8, ขาลบลง GND (กะพริบเมื่ออยู่ใน while)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-emerald-700">LED สีเขียว + R 220Ω</td>
                    <td class="p-3 font-mono font-bold text-emerald-700">Digital Pin 9</td>
                    <td class="p-3">ขาบวกผ่าน R 220Ω เข้า Pin 9, ขาลบลง GND (ติดค้างเมื่อเปิดระบบและปลอดภัย)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-amber-700">Piezo Buzzer</td>
                    <td class="p-3 font-mono font-bold text-amber-700">Digital Pin 10</td>
                    <td class="p-3">ขั้วบวกเข้า Pin 10, ขั้วลบลง GND (ร้องเตือนด้วย tone() ใน while)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Grading Rubric -->
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
            <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
              <ListOrdered class="w-5 h-5 text-amber-600" />
              ขั้นตอนการปฏิบัติและเกณฑ์การให้คะแนน (10 คะแนนเต็ม)
            </h4>
            <ol class="space-y-3 text-xs sm:text-sm text-stone-700 list-decimal pl-5 leading-relaxed">
              <li>
                <strong>การต่อวงจรบน Tinkercad (3 คะแนน):</strong> เลือก Ultrasonic แบบ 4 ขา (HC-SR04) ถูกต้อง
                ต่อสาย <code>VCC/TRIG/ECHO/GND</code>, ปุ่มกด Pin 2, LED แดง/เขียว (ผ่าน R 220Ω) และ Piezo Buzzer
                ครบถ้วน
              </li>
              <li>
                <strong>ปุ่มเปิด-ปิดระบบ (Button State) และ Serial Monitor (3 คะแนน):</strong>
                กดปุ่มสลับสถานะเปิด-ปิดระบบได้ถูกต้อง
                เมื่อปิดระบบต้องดับไฟทุกดวงและปิดเสียง Buzzer พร้อมแสดงค่าระยะทางและสถานะทาง Serial Monitor
              </li>
              <li>
                <strong>การควบคุมด้วย While Loop และอัปเดตค่า (4 คะแนน):</strong> เมื่อเปิดระบบและวัตถุเข้าใกล้
                <code>while (systemEnabled &amp;&amp; distance &gt; 0 &amp;&amp; distance &lt; 30.0)</code>
                ต้องสั่งไฟแดงกะพริบและเสียงเตือนต่อเนื่อง พร้อมอัปเดตค่าในลูปให้หลุดกลับเป็นไฟเขียวได้โดยไม่ค้าง
                Infinite Loop
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
