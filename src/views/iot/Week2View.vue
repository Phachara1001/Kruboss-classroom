<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Laptop, ExternalLink, CheckCircle, Globe, ShieldCheck, Code2, Cpu,
  UserPlus, MousePointerClick, Cable, FileCode2, Play, Lightbulb,
  AlertTriangle, Zap, ToggleRight, SlidersHorizontal, LayoutGrid, Terminal,
  Info, PieChart, Book, FileText, Target, Award, Layers, Sliders, Radio,
  RefreshCw, Gamepad2, MousePointer2, ListOrdered, FileQuestion, ChevronRight,
  Activity, Sun, Thermometer, Volume2, ArrowDownToLine, ArrowUpFromLine,
  Trophy, Lock, FileSpreadsheet, PlayCircle, StopCircle, Copy, Check,
  Sparkles, RotateCw, ArrowRight, Gauge, Boxes, Tag, BookOpen
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 2
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จัดกลุ่มคำสั่ง C++ และ Function)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำสั่งและแนวคิดวงจรไฟวิ่ง)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 2 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
]

onMounted(() => {
  fetchGameScores(currentCourseId, currentWeek)
})

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')
const isTeacher = computed(() => !isStudent(authUser.value))

const studentWeekScores = computed(() => {
  if (!currentStudentId.value) return {}
  const key = `${currentCourseId}_${currentWeek}_${currentStudentId.value}`
  return gameScoresStore.value[key]?.scores || {}
})

const studentNorm = computed(() => {
  return calculateNormalizedScore(studentWeekScores.value, weekGames)
})

const router = useRouter()

// Tinkercad Section Data
const quickFacts = [
  { icon: Globe, label: 'ใช้ฟรี', desc: 'ผ่านเว็บเบราว์เซอร์' },
  { icon: ShieldCheck, label: 'ปลอดภัย', desc: 'ไม่มีอุปกรณ์เสียหาย' },
  { icon: Code2, label: 'Blocks + C++', desc: 'เขียนโค้ดได้ 2 แบบ' },
  { icon: Cpu, label: 'Arduino Uno', desc: 'จำลองบอร์ดจริง 100%' }
]

const reasons = [
  {
    icon: Globe, color: 'cyan',
    title: 'ใช้งานได้ฟรีผ่าน Web Browser',
    desc: 'ไม่ต้องดาวน์โหลดหรือติดตั้งโปรแกรม รองรับทั้ง Windows, Mac, iPad และ Chromebook เพียงสมัครบัญชี Autodesk ฟรีก็เริ่มได้ทันที',
    note: 'เหมาะกับห้องเรียนที่คอมพิวเตอร์มีสเปกจำกัด'
  },
  {
    icon: ShieldCheck, color: 'emerald',
    title: 'ปลอดภัย 100% ไม่ต้องกลัวอุปกรณ์ไหม้',
    desc: 'หากต่อสายผิด ช็อต หรือลืมต่อตัวต้านทาน (Resistor) ระบบจะจำลองควันหรือ LED แตกเตือนทันที โดยไม่มีอุปกรณ์จริงเสียหาย',
    note: 'ล้มเหลวได้ไม่จำกัด เรียนรู้จากข้อผิดพลาดได้เต็มที่'
  },
  {
    icon: Code2, color: 'violet',
    title: 'เขียนโค้ดได้ทั้งแบบ Blocks และ Text (C++)',
    desc: 'สลับดูโค้ด C++ ควบคู่กับบล็อกคำสั่งได้ทันที ช่วยให้เข้าใจตรรกะโปรแกรมก่อนก้าวไปสู่การเขียนโค้ดเต็มรูปแบบ',
    note: 'มีโหมด Blocks + Text แสดงสองแบบพร้อมกัน'
  },
  {
    icon: Terminal, color: 'amber',
    title: 'มี Serial Monitor ให้ตรวจสอบค่า',
    desc: 'ใช้ Serial.println() เพื่อดูค่าจากเซ็นเซอร์หรือสถานะของโปรแกรมแบบเรียลไทม์ ช่วยดีบักได้เหมือนการทำงานกับบอร์ดจริง',
    note: 'ฝึกทักษะดีบักที่ใช้ได้จริงในอนาคต'
  }
]

const steps = [
  { icon: UserPlus, title: 'สมัครและเข้าสู่ระบบ', desc: 'ไปที่ tinkercad.com สมัครบัญชี Autodesk ฟรี หรือเข้าสู่ระบบด้วยบัญชี Google' },
  { icon: MousePointerClick, title: 'สร้างวงจรใหม่', desc: 'เลือกเมนู Designs > Circuits แล้วกด Create Circuit เพื่อเปิดพื้นที่ทำงานเปล่า' },
  { icon: Cable, title: 'ลากอุปกรณ์และต่อสาย', desc: 'ลาก Arduino Uno R3, Breadboard, LED 1 ตัว และ Resistor 220Ω แล้วต่อสายไฟให้ถูกต้อง' },
  { icon: FileCode2, title: 'เขียนโปรแกรม', desc: 'กดปุ่ม Code เลือกโหมด Text (C++) แล้วเขียนคำสั่ง void setup(), void loop() และสร้าง Function' },
  { icon: Play, title: 'กด Start Simulation', desc: 'ทดสอบวงจรและโค้ดได้ทันที สังเกตไฟกะพริบติด-ดับตามโปรแกรมที่เขียนไว้' }
]

const colorMap = {
  cyan: 'bg-cyan-100 text-cyan-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700'
}

// -------------------------------------------------------------
// Mini-games Data
// -------------------------------------------------------------
const activeGame = ref('sort') // 'sort', 'match', 'quiz'

// Game 1: Drag & Drop (จัดกลุ่มคำสั่ง C++ สำหรับ Arduino)
const dragItemsData = [
  { id: 1, text: 'void setup() { ... }', type: 'structure' },
  { id: 2, text: 'void loop() { ... }', type: 'structure' },
  { id: 3, text: 'pinMode(2, OUTPUT);', type: 'io' },
  { id: 4, text: 'digitalWrite(2, HIGH);', type: 'io' },
  { id: 5, text: 'void blinkLED() { ... }', type: 'fn' },
  { id: 6, text: 'blinkLED();', type: 'fn' }
]

const dragZonesData = [
  {
    id: 'structure',
    title: '1. ฟังก์ชันโครงสร้างหลัก (Program Structure)',
    wrapperClass: 'border-indigo-400/50 hover:bg-black/40',
    titleClass: 'text-indigo-300 border-indigo-400/30',
    itemBgClass: 'bg-indigo-600/50 border-indigo-400',
    emptyTextClass: 'text-indigo-200/50',
    emptyText: 'ลากฟังก์ชันโครงสร้างหลัก setup / loop มาวางที่นี่'
  },
  {
    id: 'io',
    title: '2. คำสั่งจัดการ INPUT / OUTPUT',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคำสั่งกำหนดโหมดและจ่ายไฟ pinMode / digitalWrite มาวางที่นี่'
  },
  {
    id: 'fn',
    title: '3. การเขียนและเรียกใช้งาน Function (Custom Function)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากการสร้างฟังก์ชันและคำสั่งเรียกใช้ Function มาวางที่นี่'
  }
]

// Game 2: Matching (จับคู่เครื่องมือและคำศัพท์)
const matchLeftTerms = [
  { id: 'l1', text: '1. void setup()', match: 'r1' },
  { id: 'l2', text: '2. void loop()', match: 'r2' },
  { id: 'l3', text: '3. pinMode(pin, OUTPUT)', match: 'r3' },
  { id: 'l4', text: '4. Anode (แอโนด / ขั้วบวก)', match: 'r4' },
  { id: 'l5', text: '5. Cathode (แคโทด / ขั้วลบ)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ฟังก์ชันที่ทำงานเพียง "ครั้งเดียว" ตอนเปิดบอร์ด ใช้กำหนดค่าเริ่มต้น' },
  { id: 'r2', text: 'ฟังก์ชันที่ทำงาน "วนซ้ำต่อเนื่องไม่รู้จบ" ตราบใดที่ยังมีไฟเลี้ยงบอร์ด' },
  { id: 'r3', text: 'คำสั่งกำหนดให้พินดิจิทัลทำหน้าที่ส่งสัญญาณไฟ 5V/0V ออกไปควบคุมอุปกรณ์ภายนอก' },
  { id: 'r4', text: 'ขาขั้วบวกของ LED (ขายาว / แผ่นในเล็ก) ต่อเข้าพินดิจิทัลผ่านตัวต้านทาน 220 Ω' },
  { id: 'r5', text: 'ขาขั้วลบของ LED (ขาสั้น / ขอบบากเรียบ / แผ่นในใหญ่) ต่อลงขากราวด์ GND' }
]

// Game 3: Pop Quiz (Post-test 10 ข้อ 4 ตัวเลือก)
const quizQuestions = [
  {
    id: 1,
    question: 'จุดเด่นสำคัญที่สุดของการทดลองวงจรบน Autodesk Tinkercad Circuits คือข้อใด?',
    options: [
      { id: 'a', text: 'ใช้งานฟรีผ่านเว็บเบราว์เซอร์ ปลอดภัย 100% ทดลองและเรียนรู้ได้โดยไม่มีอุปกรณ์จริงเสียหาย', isCorrect: true },
      { id: 'b', text: 'ต้องเชื่อมต่อกับฮาร์ดแวร์จริงผ่านพอร์ต USB เสมอจึงจะรันได้', isCorrect: false },
      { id: 'c', text: 'รองรับเฉพาะภาษา Assembly เท่านั้น ไม่รองรับภาษา C++', isCorrect: false },
      { id: 'd', text: 'ต้องเสียค่าลิขสิทธิ์รายเดือนราคาแพง', isCorrect: false }
    ],
    explanation: 'Tinkercad Circuits เป็นเว็บแอปพลิเคชันจำลองวงจรอิเล็กทรอนิกส์ฟรีจาก Autodesk ช่วยให้ฝึกต่อวงจรและเขียนโค้ดได้ทุกที่โดยไม่ต้องกลัววงจรช็อตหรืออุปกรณ์เสียหาย'
  },
  {
    id: 2,
    question: 'ข้อใดอธิบายการทำงานของฟังก์ชัน void setup() ใน Arduino ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'ทำงานวนซ้ำไปเรื่อยๆ จนกว่าจะกดปุ่ม Stop', isCorrect: false },
      { id: 'b', text: 'ทำงานเพียง "ครั้งเดียว" เมื่อบอร์ดเริ่มทำงานหรือถูกกดรีเซ็ต เพื่อกำหนดค่าเริ่มต้น', isCorrect: true },
      { id: 'c', text: 'ทำงานเฉพาะตอนมีสัญญาณอินพุตเข้ามาเท่านั้น', isCorrect: false },
      { id: 'd', text: 'ใช้สำหรับคำนวณสูตรคณิตศาสตร์เท่านั้น', isCorrect: false }
    ],
    explanation: 'void setup() คือฟังก์ชันที่คอมไพเลอร์จะเรียกทำงานเพียงรอบเดียวตอนเปิดเครื่อง เพื่อเตรียมความพร้อม เช่น กำหนดโหมดพินด้วย pinMode()'
  },
  {
    id: 3,
    question: 'ข้อใดอธิบายพฤติกรรมการทำงานของฟังก์ชัน void loop() ได้ถูกต้อง?',
    options: [
      { id: 'a', text: 'ทำงานวนซ้ำคำสั่งตั้งแต่บรรทัดแรกจนถึงบรรทัดสุดท้าย แล้ววนกลับมาเริ่มใหม่ไม่รู้จบ', isCorrect: true },
      { id: 'b', text: 'ทำงาน 10 รอบแล้วหยุดอัตโนมัติ', isCorrect: false },
      { id: 'c', text: 'ทำงานพร้อมกับ setup() สลับกันทีละคำสั่ง', isCorrect: false },
      { id: 'd', text: 'จะทำงานก็ต่อเมื่อเกิดข้อผิดพลาดขึ้นในโปรแกรมเท่านั้น', isCorrect: false }
    ],
    explanation: 'void loop() คือวงรอบการทำงานหลัก (Main Loop) ของไมโครคอนโทรลเลอร์ ซึ่งจะทำงานวนซ้ำคำสั่งในบล็อกเรื่อยๆ ตราบใดที่มีไฟเลี้ยง'
  },
  {
    id: 4,
    question: 'หากต้องการให้พินดิจิทัลหมายเลข 2 ทำหน้าที่เป็นพอร์ตส่งสัญญาณออกไปเปิดหลอดไฟ LED ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'pinMode(2, OUTPUT);', isCorrect: true },
      { id: 'b', text: 'pinMode(2, INPUT);', isCorrect: false },
      { id: 'c', text: 'digitalWrite(2, OUTPUT);', isCorrect: false },
      { id: 'd', text: 'digitalRead(2, HIGH);', isCorrect: false }
    ],
    explanation: 'คำสั่ง pinMode(pin, mode) ใช้กำหนดทิศทางของพิน โดย OUTPUT คือส่งสัญญาณออกไปควบคุมอุปกรณ์ภายนอก'
  },
  {
    id: 5,
    question: 'เมื่อต้องการสั่งจ่ายไฟ 5 โวลต์ (ตรรกะ 1) ไปยังพินดิจิทัลเพื่อให้หลอดไฟติดสว่าง ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'digitalWrite(pin, HIGH);', isCorrect: true },
      { id: 'b', text: 'digitalWrite(pin, LOW);', isCorrect: false },
      { id: 'c', text: 'digitalRead(pin, HIGH);', isCorrect: false },
      { id: 'd', text: 'pinMode(pin, HIGH);', isCorrect: false }
    ],
    explanation: 'digitalWrite(pin, HIGH) จะส่งระดับแรงดัน 5V ออกทางพิน ทำให้หลอดไฟ LED สว่าง ส่วน LOW จะสั่งตัดไฟเป็น 0V'
  },
  {
    id: 6,
    question: 'ประโยชน์สำคัญของการสร้าง Function (ฟังก์ชันขึ้นมาเอง) ในการเขียนโปรแกรมควบคุมไฟคือข้อใด?',
    options: [
      { id: 'a', text: 'ช่วยลดความซ้ำซ้อนของโค้ด ทำให้โค้ดเป็นระเบียบ อ่านง่าย และสามารถเรียกใช้งานซ้ำได้สะดวก', isCorrect: true },
      { id: 'b', text: 'ทำให้หลอดไฟสว่างมากกว่าการเขียนโค้ดใน loop() ตรงๆ', isCorrect: false },
      { id: 'c', text: 'ช่วยประหยัดกระแสไฟฟ้าของบอร์ด Arduino', isCorrect: false },
      { id: 'd', text: 'ทำให้ไม่จำเป็นต้องต่อตัวต้านทานในวงจร', isCorrect: false }
    ],
    explanation: 'การแยกโค้ดเป็นฟังก์ชัน (Modular Programming) ช่วยให้โปรแกรมกระชับ ไม่ต้องเขียนโค้ดเดิมซ้ำๆ และเรียกใช้งานซ้ำได้ทุกจุด'
  },
  {
    id: 7,
    question: 'ตามรูปภาพกายวิภาคของหลอด LED ขา Anode (ขั้วบวก) มีลักษณะสังเกตภายนอกอย่างไร?',
    options: [
      { id: 'a', text: 'เป็นขายาวกว่า (Longer lead) และแผ่นโลหะด้านในหลอดมีขนาดเล็กกว่า', isCorrect: true },
      { id: 'b', text: 'เป็นขาสั้นกว่า และขอบเลนส์พลาสติกมีรอยบากแบน', isCorrect: false },
      { id: 'c', text: 'เป็นสายสีดำเสมอ', isCorrect: false },
      { id: 'd', text: 'หลอด LED มีขาสองข้างเท่ากันทุกประการ ไม่สามารถแยกได้', isCorrect: false }
    ],
    explanation: 'ตามคู่มือ Arduino: Anode (+) คือขายาว และแผ่นด้านในเล็ก ส่วน Cathode (-) คือขาสั้น มีรอยบากแบน (Flat rim) และแผ่นในรูปทั่งใหญ่'
  },
  {
    id: 8,
    question: 'การต่อขาของหลอดไฟ LED 1 ดวงเข้ากับวงจร Arduino บน Breadboard ข้อใดถูกต้อง?',
    options: [
      { id: 'a', text: 'ขา Anode (ขายาว/ขั้วบวก) ต่อเข้าพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω) และขา Cathode (ขาสั้น/ขั้วลบ) ต่อลงพิน GND', isCorrect: true },
      { id: 'b', text: 'ขา Anode ต่อลง GND และขา Cathode ต่อเข้าพินดิจิทัล 5V โดยไม่ต้องมีตัวต้านทาน', isCorrect: false },
      { id: 'c', text: 'ต่อขาทั้งสองข้างเข้าช่อง GND ทั้งคู่', isCorrect: false },
      { id: 'd', text: 'ต้องต่อเข้ากับไฟบ้าน 220V เสมอ', isCorrect: false }
    ],
    explanation: 'ขา Anode รับไฟบอกจากพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω เพื่อจำกัดกระแส) ส่วน Cathode ต่อลง GND ของบอร์ด'
  },
  {
    id: 9,
    question: 'ทำไมจึงต้องต่อตัวต้านทาน (Resistor) ขนาด 220 Ω อนุกรมกับหลอดไฟ LED เสมอ?',
    options: [
      { id: 'a', text: 'เพื่อจำกัดกระแสไฟฟ้าไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือบอร์ดเสียหาย', isCorrect: true },
      { id: 'b', text: 'เพื่อเพิ่มแรงดันไฟฟ้าจาก 5V ให้เป็น 12V', isCorrect: false },
      { id: 'c', text: 'เพื่อเปลี่ยนสีของหลอดไฟ LED ตามความต้านทาน', isCorrect: false },
      { id: 'd', text: 'เพื่อให้หลอดไฟกระพริบได้เองโดยไม่ต้องเขียนโค้ด', isCorrect: false }
    ],
    explanation: 'LED มีความต้านทานภายในต่ำมาก หากไม่มีตัวต้านทานจำกัดกระแส (Current Limiting Resistor) กระแสไฟจะไหลเกินพิกัด ส่งผลให้หลอดขาดทันที'
  },
  {
    id: 10,
    question: 'ในการทำใบงานไฟวิ่ง 5 ดวง หากต้องการให้ไฟวิ่งเร็วขึ้น (เปลี่ยนดวงไวขึ้น) ควรปรับแต่งที่จุดใด?',
    options: [
      { id: 'a', text: 'ลดค่าตัวเลขในคำสั่ง delay() เช่น จาก delay(500) เป็น delay(150)', isCorrect: true },
      { id: 'b', text: 'เพิ่มค่าตัวเลขในคำสั่ง delay() ให้มากขึ้น เช่น delay(5000)', isCorrect: false },
      { id: 'c', text: 'เปลี่ยนพินจาก Pin 2 เป็น Pin 13', isCorrect: false },
      { id: 'd', text: 'ลบฟังก์ชัน void setup() ทิ้ง', isCorrect: false }
    ],
    explanation: 'ฟังก์ชัน delay(ms) รับค่าเวลาเป็นมิลลิวินาที ยิ่งค่าน้อย ระยะเวลาหยุดรอยิ่งสั้น ทำให้ไฟสลับติดดับได้รวดเร็วขึ้น'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-16 px-4 md:px-8">

    <!-- Page Header (Orange / Tinkercad Theme) -->
    <div
      class="bg-white rounded-3xl p-8 md:p-12 border border-orange-200/80 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[260px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-orange-600">
        <Laptop class="w-[420px] h-[420px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <div class="flex items-center gap-2 mb-4">
          <span
            class="px-4 py-1.5 bg-orange-100 text-orange-800 font-bold rounded-full text-xs uppercase tracking-wider shadow-sm">
            สัปดาห์ที่ 2
          </span>
          <span class="px-3 py-1 bg-amber-50 text-amber-700 font-medium rounded-full text-xs border border-amber-200">
            Tinkercad Circuits & Arduino C++
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-orange-950 mb-4 leading-tight">
          การจำลองวงจรบน Tinkercad, โครงสร้างโปรแกรม Arduino C++<br />
          <span class="text-2xl md:text-3xl text-orange-700 font-bold">การต่อหลอด LED 1 ดวง และการสร้าง Function</span>
        </h1>
        <p class="text-gray-600 text-base md:text-lg leading-relaxed">
          เริ่มต้นใช้งานแล็บเสมือนจริง Autodesk Tinkercad Circuits เรียนรู้โครงสร้างภาษา C++ สำหรับไมโครคอนโทรลเลอร์
          ทำความเข้าใจฟังก์ชัน <code>void setup()</code>, <code>void loop()</code>, การกำหนดโหมด <code>pinMode(INPUT/OUTPUT)</code>,
          การต่อวงจรหลอด LED 1 ดวง (รู้จักขา Anode และ Cathode) และการเขียน <code>Custom Function</code>
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Content Section -->
    <section class="space-y-10">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-orange-100 rounded-2xl text-orange-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-black text-gray-900">เนื้อหาบทเรียนและการฝึกปฏิบัติในคาบเรียน (Lecture & Lab Guide)</h2>
          <p class="text-sm text-gray-500">ทฤษฎีพื้นฐาน กายวิภาคหลอด LED และตัวอย่างการต่อวงจร LED 1 ตัวพร้อมโค้ดคำสั่ง</p>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-sm border border-orange-100 space-y-12 text-gray-700 leading-relaxed">

        <!-- Part 1: Tinkercad Simulator -->
        <div>
          <div class="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden">
            <!-- Header band -->
            <div class="relative p-6 sm:p-8 bg-gradient-to-br from-cyan-600 via-cyan-700 to-sky-800 text-white">
              <div class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
              <div class="relative flex items-start justify-between flex-wrap gap-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Laptop class="w-6 h-6" />
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-100">Virtual Lab Simulator</span>
                    <h2 class="text-2xl sm:text-3xl font-black leading-tight">1. รู้จักกับ Autodesk Tinkercad Circuits</h2>
                    <p class="text-sm text-cyan-50/90 mt-1">ห้องแล็บอิเล็กทรอนิกส์และเขียนโค้ดจำลองบอร์ดเสมือนจริงบน Cloud</p>
                  </div>
                </div>
                <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-cyan-800 font-bold text-sm shadow-lg hover:bg-cyan-50 hover:-translate-y-0.5 transition-all">
                  <span>เข้าสู่ Tinkercad Circuits</span>
                  <ExternalLink class="w-4 h-4" />
                </a>
              </div>

              <!-- Quick facts -->
              <div class="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div v-for="f in quickFacts" :key="f.label"
                  class="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur">
                  <component :is="f.icon" class="w-5 h-5 shrink-0 text-cyan-100" />
                  <div class="leading-tight">
                    <p class="text-sm font-bold">{{ f.label }}</p>
                    <p class="text-[11px] text-cyan-100/90">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 sm:p-8 space-y-8">
              <!-- Intro + preview -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <figure class="overflow-hidden rounded-2xl border border-gray-200 shadow-md group bg-gray-50">
                  <img src="/img/tinkercad_circuits_preview.jpg" alt="Autodesk Tinkercad Circuits Simulator Preview"
                    class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  <figcaption class="p-3 border-t border-gray-100 text-center text-xs text-gray-500">
                    พื้นที่ทำงาน Circuits บน Autodesk Tinkercad จำลองทั้งวงจรและประมวลผลโค้ด C++
                  </figcaption>
                </figure>

                <div class="space-y-4 text-sm text-gray-600">
                  <h3 class="text-xl font-black text-gray-900">ทำไมเราจึงฝึกปฏิบัติด้วย Tinkercad Circuits?</h3>
                  <p class="leading-relaxed">
                    <strong>Tinkercad Circuits</strong> เป็นเว็บแอปพลิเคชันจาก Autodesk ที่จำลองการทำงานของวงจรอิเล็กทรอนิกส์และไมโครคอนโทรลเลอร์ Arduino ได้เสมือนจริง 100% โดยไม่ต้องติดตั้งโปรแกรมลงในคอมพิวเตอร์
                  </p>
                  <p class="leading-relaxed">
                    จุดเด่นคือ <strong>"ความปลอดภัยและการเรียนรู้ไร้ขีดจำกัด"</strong> เมื่อเราต่อสายไฟผิด ต่อไฟช็อต หรือลืมต่อตัวต้านทาน ระบบจะแสดงควันหรือคำเตือนทันทีโดยไม่มีอุปกรณ์เสียหายจริง ช่วยให้นักศึกษากล้าทดลอง ลองผิดลองถูก และเข้าใจตรรกะได้อย่างมั่นใจก่อนลงมือกับอุปกรณ์จริง
                  </p>
                </div>
              </div>

              <!-- Workflow 5 Steps -->
              <div class="space-y-4">
                <h3 class="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sliders class="w-5 h-5 text-cyan-600" /> 5 ขั้นตอนหลักในการสร้างวงจรบน Tinkercad
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div v-for="(s, i) in steps" :key="s.title"
                    class="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-cyan-50/40 hover:border-cyan-200 transition-all flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="w-7 h-7 rounded-full bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                          {{ i + 1 }}
                        </span>
                        <component :is="s.icon" class="w-4 h-4 text-cyan-600" />
                      </div>
                      <h4 class="font-bold text-gray-900 text-xs mb-1">{{ s.title }}</h4>
                      <p class="text-[11px] text-gray-500 leading-normal">{{ s.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Useful Shortcuts & Tips in Tinkercad -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <span class="font-bold text-amber-900 flex items-center gap-1.5">
                    <RotateCw class="w-4 h-4 text-amber-600" /> การหมุนอุปกรณ์ (Rotate)
                  </span>
                  <p class="text-amber-800">
                    คลิกเลือกอุปกรณ์แล้วกดปุ่ม <kbd class="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono font-bold text-amber-900">R</kbd> บนคีย์บอร์ด หรือกดไอคอนหมุนที่แถบเครื่องมือด้านบนซ้าย
                  </p>
                </div>
                <div class="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1.5">
                  <span class="font-bold text-cyan-900 flex items-center gap-1.5">
                    <Cable class="w-4 h-4 text-cyan-600" /> สีของสายไฟตามมาตรฐาน
                  </span>
                  <p class="text-cyan-800">
                    <strong>สีแดง</strong> = ไฟบวก 5V, <strong>สีดำ</strong> = ขากราวด์ GND, <strong>สีอื่นๆ</strong> (เขียว/เหลือง/ส้ม) = สายสัญญาณดิจิทัล
                  </p>
                </div>
                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <span class="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Code2 class="w-4 h-4 text-emerald-600" /> โหมดการเขียนโค้ด (Code Editor)
                  </span>
                  <p class="text-emerald-800">
                    กดปุ่ม <strong>Code</strong> ด้านบนขวา เลือกโหมด <strong>Text</strong> (กด Continue ยืนยัน) เพื่อเขียนโค้ดภาษา C/C++ สำหรับ Arduino
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2: Structure void setup() & void loop() -->
        <div class="pt-8 border-t border-gray-100 space-y-8">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">2</span>
            <div>
              <h3 class="text-2xl sm:text-3xl font-black text-gray-900">
                โครงสร้างหลักของโปรแกรม Arduino C++ : void setup() และ void loop()
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 mt-0.5">2 ฟังก์ชันแกนหลักที่ต้องมีเสมอในโปรแกรมไมโครคอนโทรลเลอร์ทุกโปรแกรม</p>
            </div>
          </div>

          <!-- Lifecycle Pipeline Visualizer -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 shadow-md">
            <div class="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Zap class="w-3.5 h-3.5" /> วงจรชีวิตของโปรแกรม (Program Execution Lifecycle)
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <!-- Step 1 -->
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <span class="w-7 h-7 shrink-0 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center text-xs">1</span>
                <div>
                  <p class="font-bold text-emerald-300">Power On / Reset</p>
                  <p class="text-[11px] text-slate-300">จ่ายไฟเข้าบอร์ด หรือกดปุ่มรีเซ็ต</p>
                </div>
              </div>
              <!-- Step 2 -->
              <div class="p-3 rounded-xl bg-white/10 border border-indigo-400/40 flex items-center gap-3 relative">
                <span class="w-7 h-7 shrink-0 rounded-full bg-indigo-500 text-white font-black flex items-center justify-center text-xs">2</span>
                <div>
                  <p class="font-bold text-indigo-300">void setup()</p>
                  <p class="text-[11px] text-indigo-100/90 font-medium">รันคำสั่งครั้งเดียว (Single Run)</p>
                </div>
                <ArrowRight class="w-4 h-4 text-slate-500 absolute -right-2 hidden md:block" />
              </div>
              <!-- Step 3 -->
              <div class="p-3 rounded-xl bg-white/10 border border-amber-400/40 flex items-center gap-3">
                <span class="w-7 h-7 shrink-0 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-xs">3</span>
                <div>
                  <p class="font-bold text-amber-300">void loop()</p>
                  <p class="text-[11px] text-amber-100/90 font-medium flex items-center gap-1">
                    <span>รันวนซ้ำตลอดเวลา (Infinite Loop)</span>
                    <RefreshCw class="w-3 h-3 text-amber-300 animate-spin" style="animation-duration: 6s;" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2 Master Cards with Striking Premium Design -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            <!-- Card 1: void setup() -->
            <div class="rounded-3xl bg-gradient-to-b from-indigo-50/90 via-white to-blue-50/50 border-2 border-indigo-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
              <!-- Top decorative accent bar -->
              <div class="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 w-full"></div>

              <div class="p-6 sm:p-8 space-y-6 flex-1">
                <!-- Header Badge & Tag -->
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs shadow-md tracking-wide flex items-center gap-1.5">
                    <CheckCircle class="w-3.5 h-3.5" />
                    <span>1. ฟังก์ชันตั้งค่าเริ่มต้น</span>
                  </span>
                  <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black border border-indigo-200 flex items-center gap-1.5">
                    <Zap class="w-3.5 h-3.5 text-indigo-700" />
                    <span>ทำงานเพียง 1 ครั้งเท่านั้น</span>
                  </span>
                </div>

                <!-- 1. ชื่อ (Name) -->
                <div class="space-y-1.5 bg-white p-4 rounded-2xl border border-indigo-150 shadow-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Tag class="w-3.5 h-3.5" />
                    </div>
                    <span class="text-xs font-black uppercase tracking-wider text-indigo-900">ชื่อ (Name)</span>
                  </div>
                  <h4 class="text-2xl font-black text-indigo-950 font-mono tracking-tight pl-8">
                    void setup() { ... }
                  </h4>
                  <p class="text-xs font-semibold text-indigo-700/90 pl-8">
                    ฟังก์ชันกำหนดค่าเริ่มต้นและเตรียมความพร้อมของระบบ (Initialization Function)
                  </p>
                </div>

                <!-- 2. คำอธิบาย (Description) -->
                <div class="space-y-2 bg-white p-4 rounded-2xl border border-indigo-150 shadow-sm text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <BookOpen class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-blue-950">คำอธิบาย (Description)</span>
                  </div>
                  <p class="text-gray-700 leading-relaxed pl-8">
                    เป็นฟังก์ชันที่จะถูกบอร์ดเรียกขึ้นมาประมวลผลโดยอัตโนมัติเป็นลำดับแรกสุดทันทีที่เปิดสวิตช์จ่ายไฟเข้าบอร์ด หรือเมื่อถูกกดปุ่ม <strong>Reset</strong> โดยจะทำงานคำสั่งที่อยู่ภายในบล็อกเครื่องหมายปีกกา <code>{ ... }</code> จากบรรทัดบนลงล่างเพียง <strong>"ครั้งเดียวเท่านั้น"</strong> แล้วจะส่งการควบคุมต่อไปยังฟังก์ชัน <code>void loop()</code> โดยไม่มีการวนกลับมาทำซ้ำอีก
                  </p>
                </div>

                <!-- 3. จุดประสงค์ (Purpose) -->
                <div class="space-y-2 bg-white p-4 rounded-2xl border border-indigo-150 shadow-sm text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Target class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-emerald-950">จุดประสงค์ (Purpose)</span>
                  </div>
                  <ul class="pl-8 space-y-1.5 text-gray-700 list-disc">
                    <li><strong>เตรียมสภาพแวดล้อมฮาร์ดแวร์:</strong> บอกไมโครคอนโทรลเลอร์ล่วงหน้าว่าขาพินแต่ละขาจะใช้ทำหน้าที่อะไร</li>
                    <li><strong>ป้องกันข้อผิดพลาด:</strong> อุปกรณ์จะไม่สามารถรับหรือส่งไฟได้อย่างถูกต้องหากไม่กำหนดโหมดก่อน</li>
                    <li><strong>ประหยัดรอบการประมวลผล:</strong> แยกคำสั่งที่ต้องทำครั้งเดียวออกมา ไม่ต้องไปรันซ้ำให้เสียเวลาในลูป</li>
                  </ul>
                </div>

                <!-- 4. ใช้ในสถานการณ์ไหน (When to use / Scenarios) -->
                <div class="space-y-2.5 bg-indigo-900/5 p-4 rounded-2xl border border-indigo-200 text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Lightbulb class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-indigo-950">ใช้ในสถานการณ์ไหน (When to use)</span>
                  </div>
                  <div class="grid grid-cols-1 gap-2 pl-8 text-gray-700">
                    <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                      <p class="font-bold text-indigo-900">1. กำหนดทิศทางขาพิน (Pin Mode Configuration):</p>
                      <p class="font-mono text-[11px] text-indigo-700 mt-0.5">pinMode(2, OUTPUT); // กำหนดขา 2 เป็นเอาต์พุตสำหรับ LED</p>
                    </div>
                    <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                      <p class="font-bold text-indigo-900">2. เปิดช่องทางสื่อสารข้อมูลกับคอมพิวเตอร์ (Serial Begin):</p>
                      <p class="font-mono text-[11px] text-indigo-700 mt-0.5">Serial.begin(9600); // เปิด Serial Monitor ที่ 9600 bps</p>
                    </div>
                    <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                      <p class="font-bold text-indigo-900">3. กำหนดสถานะเริ่มต้นของอุปกรณ์ (Initial State):</p>
                      <p class="text-[11px] text-gray-600 mt-0.5">เช่น สั่งดับไฟทุกดวงก่อนเริ่มทำงาน หรือตั้งมุมมอเตอร์เซอร์โวไปที่ 0 องศา</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Card 2: void loop() -->
            <div class="rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-orange-50/50 border-2 border-amber-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
              <!-- Top decorative accent bar -->
              <div class="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 w-full"></div>

              <div class="p-6 sm:p-8 space-y-6 flex-1">
                <!-- Header Badge & Tag -->
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white font-bold text-xs shadow-md tracking-wide flex items-center gap-1.5">
                    <RotateCw class="w-3.5 h-3.5 animate-spin" style="animation-duration: 4s;" />
                    <span>2. ฟังก์ชันการทำงานหลัก</span>
                  </span>
                  <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black border border-amber-200 flex items-center gap-1.5">
                    <RefreshCw class="w-3.5 h-3.5 text-amber-800" />
                    <span>ทำงานวนซ้ำตลอดเวลาไม่รู้จบ</span>
                  </span>
                </div>

                <!-- 1. ชื่อ (Name) -->
                <div class="space-y-1.5 bg-white p-4 rounded-2xl border border-amber-150 shadow-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Tag class="w-3.5 h-3.5" />
                    </div>
                    <span class="text-xs font-black uppercase tracking-wider text-amber-900">ชื่อ (Name)</span>
                  </div>
                  <h4 class="text-2xl font-black text-amber-950 font-mono tracking-tight pl-8">
                    void loop() { ... }
                  </h4>
                  <p class="text-xs font-semibold text-amber-700/90 pl-8">
                    ฟังก์ชันการทำงานหลักและประมวลผลวนซ้ำไม่รู้จบ (Main Execution Loop)
                  </p>
                </div>

                <!-- 2. คำอธิบาย (Description) -->
                <div class="space-y-2 bg-white p-4 rounded-2xl border border-amber-150 shadow-sm text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                      <BookOpen class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-orange-950">คำอธิบาย (Description)</span>
                  </div>
                  <p class="text-gray-700 leading-relaxed pl-8">
                    เป็นฟังก์ชันที่จะเริ่มต้นทำงานทันทีหลังจาก <code>void setup()</code> จบลง โดยบอร์ดจะประมวลผลคำสั่งในบล็อก <code>{ ... }</code> ตั้งแต่บรรทัดแรกจนถึงบรรทัดสุดท้าย เมื่อถึงบรรทัดล่างสุดแล้ว ตัวประมวลผลจะกระโดดวนกลับขึ้นมาเริ่มทำบรรทัดแรกใหม่อีกครั้ง และจะทำงาน <strong>"วนซ้ำต่อเนื่องไม่รู้จบ (Infinite Loop)"</strong> ตราบใดที่ยังมีกระแสไฟฟ้าเลี้ยงบอร์ดอยู่
                  </p>
                </div>

                <!-- 3. จุดประสงค์ (Purpose) -->
                <div class="space-y-2 bg-white p-4 rounded-2xl border border-amber-150 shadow-sm text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Target class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-emerald-950">จุดประสงค์ (Purpose)</span>
                  </div>
                  <ul class="pl-8 space-y-1.5 text-gray-700 list-disc">
                    <li><strong>ขับเคลื่อนการทำงานแบบเรียลไทม์:</strong> เพื่อให้อุปกรณ์ตอบสนองต่อเหตุการณ์ภายนอกได้ตลอดเวลา</li>
                    <li><strong>ตรวจจับและอ่านค่าอย่างต่อเนื่อง:</strong> ทำให้ไมโครคอนโทรลเลอร์คอยเช็คการกดปุ่มหรืออ่านเซนเซอร์ได้ไม่ขาดตอน</li>
                    <li><strong>สร้างรูปแบบการแสดงผลต่อเนื่อง:</strong> เช่น สั่งให้หลอดไฟกะพริบ หรือสั่งให้ไฟ 5 ดวงวิ่งวนไปเรื่อยๆ</li>
                  </ul>
                </div>

                <!-- 4. ใช้ในสถานการณ์ไหน (When to use / Scenarios) -->
                <div class="space-y-2.5 bg-amber-900/5 p-4 rounded-2xl border border-amber-200 text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Lightbulb class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black uppercase tracking-wider text-amber-950">ใช้ในสถานการณ์ไหน (When to use)</span>
                  </div>
                  <div class="grid grid-cols-1 gap-2 pl-8 text-gray-700">
                    <div class="p-2.5 bg-white rounded-xl border border-amber-100">
                      <p class="font-bold text-amber-900">1. สั่งเปิด-ปิดไฟตามจังหวะเวลา (Actuator Control):</p>
                      <p class="font-mono text-[11px] text-amber-800 mt-0.5">digitalWrite(2, HIGH); delay(1000); digitalWrite(2, LOW);</p>
                    </div>
                    <div class="p-2.5 bg-white rounded-xl border border-amber-100">
                      <p class="font-bold text-amber-900">2. อ่านค่าจากเซนเซอร์หรือปุ่มกดอย่างสม่ำเสมอ (Sensor Reading):</p>
                      <p class="font-mono text-[11px] text-amber-800 mt-0.5">int buttonVal = digitalRead(7); // อ่านสถานะปุ่มกด</p>
                    </div>
                    <div class="p-2.5 bg-white rounded-xl border border-amber-100">
                      <p class="font-bold text-amber-900">3. เรียกใช้งาน Custom Function ที่เราเขียนขึ้นมา:</p>
                      <p class="font-mono text-[11px] text-amber-800 mt-0.5">blinkLED(); // เรียกฟังก์ชันสั่งไฟกระพริบให้วนซ้ำเรื่อยๆ</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Part 3: INPUT & OUTPUT Configuration -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-sm">3</span>
            <h3 class="text-2xl font-black text-amber-950">
              การตั้งค่าและคำสั่งจัดการ INPUT / OUTPUT (I/O Control)
            </h3>
          </div>
          <p class="text-sm text-gray-600">
            พินดิจิทัล (Digital Pins 0 - 13) ของบอร์ด Arduino Uno สามารถทำหน้าที่ได้ทั้ง <strong>ส่งออกสัญญาณ (OUTPUT)</strong> และ <strong>รับเข้าสัญญาณ (INPUT)</strong> โดยต้องใช้คำสั่งกำหนดโหมดและสั่งงานดังนี้:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-mono font-bold">pinMode(pin, mode);</span>
              <h5 class="font-bold text-gray-900 text-sm mt-1">กำหนดโหมดการทำงานของขา</h5>
              <p class="text-gray-600 leading-relaxed">
                ใช้ใน <code>void setup()</code> เพื่อบอกบอร์ดว่าจะใช้พินนั้นทำอะไร เช่น:
              </p>
              <ul class="list-disc pl-4 text-gray-500 space-y-1">
                <li><code>pinMode(2, OUTPUT);</code> : จ่ายไฟออกไปควบคุม LED</li>
                <li><code>pinMode(7, INPUT);</code> : รับค่าจากปุ่มกดภายนอก</li>
              </ul>
            </div>

            <div class="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold">digitalWrite(pin, value);</span>
              <h5 class="font-bold text-gray-900 text-sm mt-1">สั่งจ่ายหรือตัดกระแสไฟดิจิทัล</h5>
              <p class="text-gray-600 leading-relaxed">
                ใช้กำหนดสถานะแรงดันไฟฟ้าที่ขานั้น:
              </p>
              <ul class="list-disc pl-4 text-gray-500 space-y-1">
                <li><code>HIGH</code> = จ่ายไฟ 5V (ตรรกะ 1 / หลอดไฟติด)</li>
                <li><code>LOW</code> = จ่ายไฟ 0V (ตรรกะ 0 / หลอดไฟดับ)</li>
              </ul>
            </div>

            <div class="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
              <span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold">delay(milliseconds);</span>
              <h5 class="font-bold text-gray-900 text-sm mt-1">สั่งหน่วงเวลาหยุดรอ</h5>
              <p class="text-gray-600 leading-relaxed">
                หยุดรอเป็นเวลาตามมิลลิวินาที (1,000 ms = 1 วินาที):
              </p>
              <ul class="list-disc pl-4 text-gray-500 space-y-1">
                <li><code>delay(1000);</code> : หยุดรอ 1 วินาที (ไฟกระพริบช้า)</li>
                <li><code>delay(200);</code> : หยุดรอ 0.2 วินาที (ไฟกระพริบไว/ไฟวิ่ง)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Part 4: Custom Function Creation & Call with Single LED -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm">4</span>
            <h3 class="text-2xl font-black text-emerald-950">
              การสร้าง Function ขึ้นมาเอง (Custom Function) แล้วนำมาเรียกใช้งาน
            </h3>
          </div>
          <p class="text-sm text-gray-600">
            ในการเริ่มต้นเขียนโปรแกรม เราจะสร้าง <strong>Function สำหรับสั่งกระพริบหลอดไฟ 1 ดวง</strong> เพื่อให้นักศึกษาเข้าใจหลักการสร้างฟังก์ชันและการเรียกใช้งาน (Function Call) ได้อย่างชัดเจนที่สุด:
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left: Reasons & Syntax -->
            <div class="lg:col-span-5 space-y-3 text-xs">
              <div class="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <h5 class="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <Sparkles class="w-4 h-4 text-emerald-600" /> ทำไมต้องเขียนฟังก์ชันแยก?
                </h5>
                <ul class="list-disc pl-4 text-emerald-800/90 space-y-1 leading-relaxed">
                  <li><strong>ลดความซ้ำซ้อนของโค้ด:</strong> ไม่ต้องเขียนคำสั่งเปิด-ดับซ้ำๆ หลายบรรทัดใน <code>loop()</code></li>
                  <li><strong>โค้ดเป็นระเบียบ อ่านเข้าใจง่าย:</strong> ใน <code>loop()</code> จะเหลือแค่ชื่อฟังก์ชัน เช่น <code>blinkLED();</code> บ่งบอกการทำงานชัดเจน</li>
                  <li><strong>แก้ไขปรับปรุงได้รวดเร็ว:</strong> หากต้องการเปลี่ยนจังหวะกระพริบ ก็แก้ไขในฟังก์ชันเพียงจุดเดียว</li>
                </ul>
              </div>

              <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <h5 class="font-bold text-gray-900 text-sm">โครงสร้างการประกาศฟังก์ชัน:</h5>
                <pre class="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto leading-relaxed"><code>void blinkLED() {
  digitalWrite(2, HIGH); // สั่งเปิดไฟ
  delay(1000);            // รอ 1 วินาที
  digitalWrite(2, LOW);  // สั่งปิดไฟ
  delay(1000);            // รอ 1 วินาที
}</code></pre>
              </div>
            </div>

            <!-- Right: Function Flow Comparison for Single LED -->
            <div class="lg:col-span-7 p-5 rounded-3xl bg-slate-900 text-white font-mono text-xs border border-slate-800 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <span class="text-emerald-400 font-bold">// โค้ดตัวอย่างในคาบเรียน: สร้างฟังก์ชันสั่งกระพริบไฟ 1 ดวง</span>
                <span class="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Arduino C++</span>
              </div>

              <div class="space-y-3 leading-relaxed">
                <div class="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                  <span class="text-slate-500">// 1. สร้าง Custom Function ขึ้นมาเอง</span><br/>
                  <span class="text-pink-400 font-bold">void</span> <span class="text-yellow-300 font-bold">blinkLED</span>() {<br/>
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">2</span>, <span class="text-emerald-400">HIGH</span>); <span class="text-slate-500">// สั่งจ่ายไฟ 5V (ไฟติด)</span><br/>
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-slate-500">// รอ 1 วินาที</span><br/>
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">2</span>, <span class="text-emerald-400">LOW</span>);&nbsp;&nbsp;<span class="text-slate-500">// สั่งตัดไฟ 0V (ไฟดับ)</span><br/>
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-slate-500">// รอ 1 วินาที</span><br/>
                  }
                </div>

                <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30">
                  <span class="text-pink-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span>() {<br/>
                  &nbsp;&nbsp;<span class="text-cyan-300">pinMode</span>(<span class="text-orange-400">2</span>, <span class="text-emerald-400">OUTPUT</span>); <span class="text-slate-500">// ตั้งค่าขา 2 เป็นเอาต์พุต</span><br/>
                  }<br/><br/>
                  <span class="text-pink-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span>() {<br/>
                  &nbsp;&nbsp;<span class="text-yellow-300 font-bold">blinkLED</span>(); <span class="text-slate-500">// 2. เรียกใช้งานฟังก์ชันใน loop()</span><br/>
                  &nbsp;&nbsp;<span class="text-slate-500">// ฟังก์ชันจะวนซ้ำติด-ดับ 1 วินาทีไปเรื่อยๆ</span><br/>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 5: Single LED Wiring on Breadboard & LED Anatomy (Official Arduino Diagram) -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black flex items-center justify-center text-sm">5</span>
            <div>
              <h3 class="text-2xl font-black text-rose-950">
                กายวิภาคของหลอด LED (Anode & Cathode) และการต่อวงจรทดลอง 1 ดวง
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">ในคาบเรียนเราจะพาต่อหลอด LED 1 ตัวเดียวก่อน เพื่อให้เข้าใจขั้วอุปกรณ์และการทำงานอย่างถ่องแท้</p>
            </div>
          </div>

          <!-- Official Arduino LED Anatomy Card with Graphic -->
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-orange-50 border-2 border-rose-200/80 shadow-md space-y-6">
            <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-rose-200">
              <span class="px-3.5 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb class="w-4 h-4" /> แผนภาพกายวิภาคหลอด LED (Official Arduino Reference)
              </span>
              <span class="text-xs text-rose-800 font-semibold">อ้างอิงจาก Arduino Knowledge Base</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <!-- Official Arduino LED Diagram Image -->
              <div class="lg:col-span-6 flex flex-col items-center">
                <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-md max-w-[340px] w-full">
                  <img
                    src="https://support.arduino.cc/hc/article_attachments/12416016395676"
                    alt="Arduino LED Anatomy Diagram: Anode (+) vs Cathode (-)"
                    class="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                  />
                  <div class="mt-3 text-center border-t border-gray-100 pt-2">
                    <span class="text-[11px] font-bold text-gray-700">ภาพแสดงขั้ว Anode (+) และ Cathode (-) ของหลอด LED</span>
                    <p class="text-[10px] text-gray-400 mt-0.5">ขายาวคือบวก (Anode) • ขาสั้นมีขอบบากคือลบ (Cathode)</p>
                  </div>
                </div>
              </div>

              <!-- Pin Explanation Comparison Cards -->
              <div class="lg:col-span-6 space-y-4 text-xs">
                <!-- Anode Card -->
                <div class="p-4 rounded-2xl bg-white border-2 border-rose-200 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-rose-700 text-sm flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                      1. ขา Anode (แอโนด / ขั้วบวก +)
                    </span>
                    <span class="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[10px]">ต่อเข้าไฟบวก 5V</span>
                  </div>
                  <ul class="list-disc pl-5 text-gray-700 space-y-1 leading-relaxed">
                    <li><strong>ลักษณะขาภายนอก:</strong> เป็น <strong>"ขายาวกว่า"</strong> (Long lead) หรือใน Tinkercad จะงอขาเล็กน้อย</li>
                    <li><strong>ลักษณะภายในหลอด:</strong> มีแผ่นตัวนำโลหะด้านใน <strong>"ขนาดเล็กกว่า"</strong> (Smaller plate)</li>
                    <li><strong>วิธีต่อใช้งาน:</strong> ต่อเข้ากับ <strong>Digital Pin (เช่น Pin 2)</strong> ผ่านตัวต้านทาน 220 Ω เสมอ</li>
                  </ul>
                </div>

                <!-- Cathode Card -->
                <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-800 text-sm flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                      2. ขา Cathode (แคโทด / ขั้วลบ -)
                    </span>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px]">ต่อลงกราวด์ GND</span>
                  </div>
                  <ul class="list-disc pl-5 text-gray-700 space-y-1 leading-relaxed">
                    <li><strong>ลักษณะขาภายนอก:</strong> เป็น <strong>"ขาสั้นกว่า"</strong> (Short lead)</li>
                    <li><strong>ขอบเลนส์พลาสติก:</strong> มีรอยตัดเรียบ <strong>"ขอบบากแบน"</strong> (Flat rim edge) เพื่อให้คลำหรือสังเกตได้</li>
                    <li><strong>ลักษณะภายในหลอด:</strong> มีแผ่นตัวนำโลหะรูปทรงทั่ง <strong>"ขนาดใหญ่กว่า"</strong> (Larger plate / Anvil)</li>
                    <li><strong>วิธีต่อใช้งาน:</strong> ต่อตรงลง <strong>ขากราวด์ (GND)</strong> ของบอร์ด Arduino</li>
                  </ul>
                </div>

                <!-- Resistor Note -->
                <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed text-xs">
                  <span class="inline-flex items-center gap-1 font-bold text-amber-950 mr-1">
                    <Zap class="w-3.5 h-3.5 text-amber-600 inline" />
                    ทำไมต้องมีตัวต้านทาน 220 Ω (Resistor)?
                  </span>
                  <span>เพื่อจำกัดกระแสไฟฟ้า (Current Limiting) ไม่ให้ไหลผ่านหลอด LED มากเกินไปจนหลอดขาดในเสี้ยววินาที</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step-by-Step Single LED Wiring Guide -->
          <div class="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-4 text-xs">
            <h4 class="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Cable class="w-4 h-4 text-cyan-600" /> ขั้นตอนการต่อวงจรหลอด LED 1 ดวงใน Tinkercad Circuits
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-gray-700">
              <div class="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span class="font-bold text-cyan-700">ขั้นตอนที่ 1:</span>
                <p>ลากบอร์ด <strong>Arduino Uno R3</strong> และ <strong>Breadboard Small</strong> มาวางบนพื้นที่ทำงาน</p>
              </div>
              <div class="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span class="font-bold text-cyan-700">ขั้นตอนที่ 2:</span>
                <p>ลากหลอด <strong>LED สีแดง 1 ตัว</strong> เสียบลงบน Breadboard สังเกตขา Anode (ขายาว) และ Cathode (ขาสั้น)</p>
              </div>
              <div class="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span class="font-bold text-cyan-700">ขั้นตอนที่ 3:</span>
                <p>ลาก <strong>Resistor 220 Ω</strong> มาต่ออนุกรมเข้ากับขา <strong>Anode</strong> แล้วลากสายต่อไปเข้า <strong>Pin 2</strong></p>
              </div>
              <div class="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span class="font-bold text-cyan-700">ขั้นตอนที่ 4:</span>
                <p>ลากสายไฟสีดำจากขา <strong>Cathode</strong> ของ LED เสียบเข้าพิน <strong>GND</strong> ของบอร์ด Arduino</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Game Center -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-2xl text-orange-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-gray-900">Game Center: ทดสอบความเข้าใจสัปดาห์ที่ 2</h2>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-900 to-amber-900 hover:from-orange-800 hover:to-amber-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-orange-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-orange-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่ 2</span>
            <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
              <span>สถานะ:</span>
              <span v-if="studentNorm.isAllCompleted" class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5" /> ทำครบทุกกิจกรรมแล้ว (3/3)
              </span>
              <span v-else-if="studentNorm.completedCount > 0" class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                <Activity class="w-3.5 h-3.5" /> กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
              </span>
              <span v-else class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                ยังไม่ได้เริ่มทำ
              </span>
            </div>
          </div>

          <!-- Total Normalized Score (Scaled to 10) -->
          <div class="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 rounded-2xl border border-orange-100">
            <Trophy class="w-7 h-7 text-orange-500 shrink-0" />
            <div>
              <span class="text-xs text-orange-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-orange-950 leading-tight">
                <span>{{ studentNorm.normalized }}</span>
                <span class="text-xs font-bold text-gray-400"> / 10.0 คะแนน</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 Activity Status Badges -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium">
          <!-- Game 1 -->
          <div :class="[
            'p-3.5 rounded-2xl border flex items-center justify-between',
            studentWeekScores['game-1'] ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. จัดกลุ่มคำสั่ง C++ และ Function</span>
              <span class="text-[11px] text-gray-500">เต็ม 6 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / 6` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Game 2 -->
          <div :class="[
            'p-3.5 rounded-2xl border flex items-center justify-between',
            studentWeekScores['game-2'] ? 'bg-cyan-50/70 border-cyan-200 text-cyan-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">2. จับคู่คำสั่งและแนวคิดไฟวิ่ง</span>
              <span class="text-[11px] text-gray-500">เต็ม 5 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / 5` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Post-test -->
          <div :class="[
            'p-3.5 rounded-2xl border flex items-center justify-between',
            studentWeekScores['quiz'] ? 'bg-orange-50/70 border-orange-200 text-orange-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">3. แบบทดสอบหลังเรียน 10 ข้อ</span>
              <span class="text-[11px] text-gray-500">เต็ม 10 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['quiz'] ? `${studentWeekScores['quiz'].score} / 10` : 'ยังไม่ได้ทำ' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Game Tabs -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: จัดกลุ่มคำสั่ง C++ & Function</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่คำสั่งและแนวคิดไฟวิ่ง</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-orange-600 text-white shadow-lg scale-105' : 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>กิจกรรมสุดท้าย: แบบทดสอบหลังเรียน (Post-test 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop -->
      <DragDropGame v-if="activeGame === 'sort'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="game-1"
        game-title="มินิเกม 1: จัดกลุ่มคำสั่งภาษา C++ สำหรับ Arduino และการใช้ Function"
        title="จัดกลุ่มคำสั่ง C++ และ Function สำหรับ Arduino"
        subtitle="ลากชื่อคำสั่งไปใส่ในหมวดหมู่ที่ถูกต้อง: โครงสร้างหลัก, คำสั่ง I/O, หรือการสร้าง/เรียกใช้งาน Function"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="game-2"
        game-title="มินิเกม 2: จับคู่คำสั่งและแนวคิดสำคัญของวงจรไฟวิ่ง Arduino"
        title="จับคู่คำสั่งและแนวคิดวงจรไฟวิ่ง Arduino"
        subtitle="จับคู่ชื่อคำสั่งและอุปกรณ์ด้านซ้ายกับหน้าที่การทำงานด้านขวาให้ถูกต้องครบทั้ง 5 คู่"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs"
      />

      <!-- Game 3: Pop Quiz (Post-test) -->
      <PopQuiz v-if="activeGame === 'quiz'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="quiz"
        game-title="แบบทดสอบหลังเรียน Week 2 (Tinkercad Circuits, Arduino C++ & Running LED)"
        title="แบบทดสอบหลังเรียน: สัปดาห์ที่ 2 (Tinkercad, C++ & วงจรไฟวิ่ง)"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจรอบด้าน ทำได้เพียงครั้งเดียวเท่านั้น"
        :questions="quizQuestions"
      >
        <template #actions>
          <RouterLink to="/courses"
            class="px-8 py-4 bg-orange-600 border-2 border-orange-500 text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- Assignment Section (5-LED Running Light Assignment Challenge) -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-2"
      assignment-title="ใบงานที่ 2: วงจรไฟวิ่ง 5 ดวง วิ่งวนไปเรื่อยๆ (Running LED 5 LEDs) บน Tinkercad" :max-score="10">
      <template #number>2</template>
      <template #description>
        หลังจากที่นักศึกษาได้เรียนรู้การต่อวงจรและเขียนฟังก์ชันควบคุมหลอดไฟ LED 1 ดวงในคาบเรียนแล้ว
        ในใบงานนี้ให้นักศึกษานำความรู้ดังกล่าวมาต่อยอดจำลองวงจรบน Autodesk Tinkercad Circuits โดยต่อหลอดไฟ LED จำนวน 5 ดวงบน Breadboard
        และเขียนโปรแกรมควบคุมด้วยบอร์ด Arduino Uno R3 โดยใช้การสร้าง Function แล้วนำมาเรียกใช้งานใน void loop()
        ให้ไฟ 5 ดวงติด-ดับไล่ระดับ วิ่งวนไปเรื่อยๆ ไม่รู้จบ เมื่อเสร็จแล้วให้บันทึกภาพหน้าจอ (Screenshot) วงจรและโค้ด
        อัปโหลดรูปภาพลง Google Drive และนำลิงก์มาส่ง
      </template>
      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>1. เข้าใช้งาน Tinkercad Circuits:</strong> เข้าไปที่เว็บไซต์ <a href="https://www.tinkercad.com/circuits" target="_blank"
              class="text-cyan-600 font-bold underline">tinkercad.com/circuits</a> เข้าสู่ระบบ แล้วกดปุ่ม <strong>+ Create &gt; Circuit</strong> เพื่อเปิดพื้นที่ทำงานใหม่</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>2. ต่อยอดจาก 1 ดวงเป็น 5 ดวง:</strong> วางบอร์ด <strong>Arduino Uno R3</strong>, <strong>Breadboard Small</strong>, <strong>LED จำนวน 5 ดวง</strong> (เลือกผสมสีได้ตามใจชอบ) และ <strong>ตัวต้านทาน 220 Ω จำนวน 5 ตัว</strong></span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>3. การต่อสายไฟ:</strong>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-xs text-gray-600">
              <li>ต่อขา <strong>Anode (ขั้วบวก / ขายาว)</strong> ของ LED 1-5 เข้ากับพิน <strong>Pin 2, 3, 4, 5, 6</strong> โดยแต่ละดวงต้องต่อผ่านตัวต้านทาน 220 Ω เสมอ</li>
              <li>ต่อขา <strong>Cathode (ขั้วลบ / ขาสั้น)</strong> ของ LED ทุกดวงลงรางขั้วลบ (-) ของ Breadboard แล้วลากสายจัมป์เปอร์สีดำไปต่อเข้าพิน <strong>GND</strong> ของบอร์ด Arduino</li>
            </ul>
          </span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>4. การเขียนโค้ดภาษา C++ (โหมด Code &gt; Text):</strong>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-xs text-gray-600">
              <li>ใน <code>void setup()</code> ตั้งค่า <code>pinMode</code> ของพิน 2 ถึง 6 ให้เป็น <code>OUTPUT</code> ทั้งหมด</li>
              <li>สร้าง <strong>Custom Function</strong> อย่างน้อย 1 ฟังก์ชัน เช่น <code>void runForward()</code> หรือ <code>void runningLight()</code> เพื่อควบคุมจังหวะไฟติด-ดับทีละดวง</li>
              <li>เรียกใช้งานฟังก์ชันใน <code>void loop()</code> เพื่อให้ไฟวิ่งวนซ้ำไปเรื่อยๆ อย่างต่อเนื่อง</li>
            </ul>
          </span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>5. ทดสอบวงจร:</strong> กดปุ่ม <strong>Start Simulation</strong> ตรวจสอบว่าไฟ LED ทั้ง 5 ดวงติด-ดับวิ่งวนตามลำดับอย่างถูกต้องและราบรื่น</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>6. แคปรูปภาพส่งงาน (Screenshot):</strong> จับภาพหน้าจอให้เห็นทั้ง <strong>วงจรจำลองที่มีไฟติด</strong> และ <strong>หน้าต่างโค้ดโปรแกรมภาษา C++</strong> รวมถึงชื่อโปรเจกต์ของตนเองอย่างชัดเจน</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>7. อัปโหลดลง Google Drive และแชร์ลิงก์:</strong> อัปโหลดรูปภาพลง Google Drive คลิกขวาเลือก <strong>แชร์ (Share)</strong> และตั้งค่าสิทธิ์การเข้าถึงเป็น <strong>"ทุกคนที่มีลิงก์ (Anyone with the link)"</strong> สามารถดูได้</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>8. ส่งงาน:</strong> คัดลอก URL ลิงก์จาก Google Drive แล้วนำมากรอกในปุ่ม <strong>"ส่งงานด้วยลิงก์"</strong> ด้านล่างนี้</span>
        </li>

        <!-- PDF Example Button Card -->
        <div class="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-amber-600" /> ต้องการดูตัวอย่างเอกสารใบงานที่ 2?
            </h5>
            <p class="text-xs text-gray-500 mt-0.5">
              กดเปิดดูตัวอย่างโครงสร้างรายงานผลการปฏิบัติงานใบงานที่ 2 (แบบฟอร์มมาตรฐาน ขนาด A4)
            </p>
          </div>
          <button @click="showPdfModal = true" type="button"
            class="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
            <FileText class="w-4 h-4 text-amber-200" />
            <span>เปิดดูตัวอย่างใบงาน (PDF Preview)</span>
          </button>
        </div>
      </template>
    </AssignmentSection>

    <!-- Assignment PDF Modal for IoT Week 2 (A4 Format) -->
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="ใบงานที่_2_วงจรไฟวิ่ง5ดวงบนTinkercad_ปวช.pdf"
      subtitle="แบบฟอร์มเอกสารรายงานผลการปฏิบัติงาน ขนาด A4 (จำนวน 1 หน้า)"
      footer-text="แบบฟอร์มใบงานมาตรฐาน • รายวิชาเทคโนโลยีระบบสมองกลฝังตัวและไอโอที (21901-2007)"
      :show-print="true"
      :multi-page="false"
    >
      <div
        class="printable-a4-sheet bg-white text-gray-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-11 shadow-2xl border border-gray-300 flex flex-col justify-between text-xs sm:text-sm font-sans box-border relative"
        style="background-color: #ffffff !important; color: #111827 !important;"
      >
        <div class="space-y-4">
          <!-- Page Header -->
          <div class="border-b-2 border-black pb-3 text-center space-y-1 relative">
            <span class="absolute top-0 right-0 px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-[10px] font-mono text-gray-600">
              หน้า 1 / 1
            </span>
            <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              ใบงานที่ 2: วงจรไฟวิ่ง 5 ดวง วิ่งวนไปเรื่อยๆ (Running LED 5 LEDs) บน Tinkercad
            </h2>
            <p class="text-xs text-gray-600">วิชา: เทคโนโลยีระบบสมองกลฝังตัวและไอโอที (รหัสวิชา 21901-2007)</p>
          </div>

          <!-- Student Meta Line -->
          <div class="py-2 text-xs text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
            <span><strong>ชื่อ-นามสกุล:</strong> [ ระบุชื่อ - นามสกุล นักศึกษา ]</span>
            <span><strong>รหัสนักศึกษา:</strong> [ ระบุรหัสประจำตัว ]</span>
            <span><strong>ระดับชั้น:</strong> ปวช.3/2</span>
          </div>

          <!-- Instructions Box -->
          <div class="bg-amber-50/70 p-2.5 rounded border border-amber-200 text-xs text-amber-950 leading-relaxed">
            <strong>คำชี้แจง:</strong> ให้นักศึกษาต่อยอดจากวงจรหลอด LED 1 ดวงที่เรียนในห้อง มาสร้างเป็นวงจรหลอด LED 5 ดวง และเขียนโปรแกรมควบคุมด้วยบอร์ด Arduino Uno R3 บน Autodesk Tinkercad Circuits โดยใช้การเขียน Function แล้วนำภาพถ่ายหน้าจอวงจรและโค้ดมาแนบส่งในพื้นที่ที่กำหนด
          </div>

          <!-- Section 1: Circuit Diagram & Pinout -->
          <div class="space-y-2 pt-1">
            <h4 class="font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-200 pb-1">
              ตอนที่ 1: ตารางบันทึกการต่อขาอุปกรณ์ 5 ดวง (Hardware Pin Mapping)
            </h4>
            <table class="w-full text-[11px] text-left border border-gray-300">
              <thead class="bg-gray-100 font-bold border-b border-gray-300">
                <tr>
                  <th class="p-1.5 border-r border-gray-300">อุปกรณ์</th>
                  <th class="p-1.5 border-r border-gray-300">พิน Arduino (ขา Anode +)</th>
                  <th class="p-1.5 border-r border-gray-300">ตัวต้านทาน</th>
                  <th class="p-1.5">ขั้วกราวด์ (ขา Cathode -)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="p-1.5 border-r border-gray-300">LED 1 (แดง)</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">Digital Pin 2</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">220 Ω</td>
                  <td class="p-1.5 font-mono">GND บน Breadboard</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r border-gray-300">LED 2 (เหลือง)</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">Digital Pin 3</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">220 Ω</td>
                  <td class="p-1.5 font-mono">GND บน Breadboard</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r border-gray-300">LED 3 (เขียว)</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">Digital Pin 4</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">220 Ω</td>
                  <td class="p-1.5 font-mono">GND บน Breadboard</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r border-gray-300">LED 4 (ฟ้า)</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">Digital Pin 5</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">220 Ω</td>
                  <td class="p-1.5 font-mono">GND บน Breadboard</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r border-gray-300">LED 5 (ม่วง/ส้ม)</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">Digital Pin 6</td>
                  <td class="p-1.5 border-r border-gray-300 font-mono">220 Ω</td>
                  <td class="p-1.5 font-mono">GND บน Breadboard</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 2: Screenshot Evidence Placeholder -->
          <div class="space-y-2 pt-1">
            <h4 class="font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-200 pb-1">
              ตอนที่ 2: ภาพถ่ายหน้าจอผลการทดลองบน Tinkercad Circuits (Screenshot Evidence)
            </h4>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 text-gray-500 text-xs space-y-1">
              <p class="font-bold text-gray-700">[ พื้นที่แนบภาพถ่ายหน้าจอผลการจำลองไฟวิ่ง 5 ดวงและโค้ดโปรแกรม C++ ]</p>
              <p class="text-[11px] text-gray-500">ต้องแสดงให้เห็นวงจรที่ไฟกำลังติดสว่าง และหน้าต่างโค้ดที่มีการสร้าง Custom Function อย่างชัดเจน</p>
            </div>
          </div>

          <!-- Section 3: Google Drive Link -->
          <div class="space-y-1.5 pt-1">
            <h4 class="font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-200 pb-1">
              ตอนที่ 3: ลิงก์ไฟล์ภาพและโปรเจกต์ Google Drive (Public Link)
            </h4>
            <div class="p-2.5 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-700">
              URL: https://drive.google.com/file/d/your-screenshot-id/view?usp=sharing
            </div>
            <p class="text-[10px] text-gray-500">* ตรวจสอบให้แน่ใจว่าได้เปิดสิทธิ์การแชร์เป็น "ทุกคนที่มีลิงก์ (Anyone with the link)" ก่อนส่งงาน</p>
          </div>
        </div>

        <!-- Sheet Footer -->
        <div class="border-t border-gray-300 pt-3 text-[10px] text-gray-500 flex justify-between items-center">
          <span>แผนกวิชาเทคโนโลยีคอมพิวเตอร์ • วิทยาลัยเทคนิค / มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</span>
          <span>ลงชื่อผู้ตรวจ: ....................................................</span>
        </div>
      </div>
    </AssignmentPdfModal>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal
      :is-open="showTeacherModal"
      :course-id="currentCourseId"
      :week="currentWeek"
      :games="weekGames"
      @close="showTeacherModal = false"
    />

  </div>
</template>
