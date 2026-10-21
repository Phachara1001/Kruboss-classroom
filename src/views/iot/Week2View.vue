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
  Trophy, Lock, FileSpreadsheet, PlayCircle, StopCircle
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 2
const showTeacherModal = ref(false)

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จัดกลุ่มคำสั่ง C++ สำหรับ Arduino)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่เครื่องมือและคำศัพท์ Tinkercad)', maxScore: 5, isQuiz: false },
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
  { icon: Cpu, label: 'Arduino Uno', desc: 'จำลองบอร์ดจริง' }
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
  { icon: MousePointerClick, title: 'สร้างวงจรใหม่', desc: 'เลือกเมนู Circuits แล้วกด Create new Circuit เพื่อเปิดพื้นที่ทำงานเปล่า' },
  { icon: Cable, title: 'ลากอุปกรณ์และต่อสาย', desc: 'ลาก Arduino, Breadboard, LED และ Resistor จากแถบด้านขวา แล้วคลิกที่ขาอุปกรณ์เพื่อลากสาย' },
  { icon: FileCode2, title: 'เขียนโปรแกรม', desc: 'กดปุ่ม Code เลือกโหมด Blocks, Text หรือ Blocks + Text แล้วเขียนคำสั่งควบคุมบอร์ด' },
  { icon: Play, title: 'กด Start Simulation', desc: 'ทดสอบวงจรและโค้ดได้ทันที หากผิดพลาดให้ตรวจสายและแก้โค้ดแล้วรันใหม่' }
]

const parts = [
  { icon: Cpu, name: 'Arduino Uno R3', desc: 'สมองของวงจร ประมวลผลคำสั่งที่เราเขียน' },
  { icon: LayoutGrid, name: 'Breadboard', desc: 'แผงต่อวงจรโดยไม่ต้องบัดกรี' },
  { icon: Lightbulb, name: 'LED', desc: 'หลอดไฟแสดงผล ต้องต่ออนุกรมกับ Resistor' },
  { icon: Zap, name: 'Resistor 220 Ω', desc: 'จำกัดกระแสเพื่อป้องกัน LED ไหม้' },
  { icon: ToggleRight, name: 'Pushbutton', desc: 'ปุ่มกดสำหรับรับค่าอินพุตดิจิทัล' },
  { icon: SlidersHorizontal, name: 'Potentiometer', desc: 'ตัวต้านทานปรับค่าได้ ใช้อ่านค่าอนาล็อก' }
]

const colorMap = {
  cyan: 'bg-cyan-100 text-cyan-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700'
}

// Mini-game State
const activeGame = ref('sort') // 'sort', 'match', 'quiz'

// Game 1: Drag & Drop (จำแนกหมวดหมู่คำสั่ง C++ สำหรับ Arduino)
const dragItemsData = [
  { id: 1, text: 'void setup() { ... }', type: 'structure' },
  { id: 2, text: 'void loop() { ... }', type: 'structure' },
  { id: 3, text: 'digitalWrite(13, HIGH);', type: 'output' },
  { id: 4, text: 'digitalWrite(13, LOW);', type: 'output' },
  { id: 5, text: 'pinMode(13, OUTPUT);', type: 'config' },
  { id: 6, text: 'delay(1000);', type: 'config' }
]

const dragZonesData = [
  {
    id: 'structure',
    title: 'ฟังก์ชันโครงสร้างหลัก (Structure)',
    wrapperClass: 'border-indigo-400/50 hover:bg-black/40',
    titleClass: 'text-indigo-300 border-indigo-400/30',
    itemBgClass: 'bg-indigo-600/50 border-indigo-400',
    emptyTextClass: 'text-indigo-200/50',
    emptyText: 'ลากฟังก์ชันโครงสร้างมาวางที่นี่'
  },
  {
    id: 'output',
    title: 'คำสั่งส่งสัญญาณเอาต์พุต (Digital Output)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคำสั่งเอาต์พุตมาวางที่นี่'
  },
  {
    id: 'config',
    title: 'คำสั่งกำหนดโหมดและหน่วงเวลา (Config / Timing)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากคำสั่งกำหนดค่ามาวางที่นี่'
  }
]

// Game 2: Matching (จับคู่เครื่องมือและคำศัพท์ Tinkercad)
const matchLeftTerms = [
  { id: 'l1', text: '1. Start Simulation', match: 'r1' },
  { id: 'l2', text: '2. Code Editor', match: 'r2' },
  { id: 'l3', text: '3. Serial Monitor', match: 'r3' },
  { id: 'l4', text: '4. Resistor 220 Ω', match: 'r4' },
  { id: 'l5', text: '5. Breadboard', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ปุ่มกดเริ่มต้นจำลองการทำงานของวงจรและประมวลผลโค้ดบนระบบเสมือนจริง' },
  { id: 'r2', text: 'หน้าต่างเขียนโปรแกรมควบคุมบอร์ด เลือกระหว่าง Blocks, Text หรือ Blocks + Text' },
  { id: 'r3', text: 'แถบตรวจสอบข้อความและตัวแปรที่ส่งมาจากบอร์ดแบบเรียลไทม์' },
  { id: 'r4', text: 'ตัวต้านทานสำหรับต่ออนุกรมกับหลอด LED เพื่อจำกัดกระแสไม่ให้หลอดขาด' },
  { id: 'r5', text: 'แผงทดลองวงจรอิเล็กทรอนิกส์ ช่วยให้เสียบสายและอุปกรณ์ได้โดยไม่ต้องบัดกรี' }
]

// Game 3: แบบทดสอบหลังเรียน Week 2 (Post-test 10 ข้อ 4 ตัวเลือก)
const quizQuestions = [
  {
    id: 1,
    question: 'จุดเด่นสำคัญที่สุดของการทดลองวงจรบนซอฟต์แวร์จำลอง Autodesk Tinkercad Circuits คือข้อใด?',
    options: [
      { id: 'a', text: 'ใช้งานฟรีผ่านเว็บ ปลอดภัย 100% ล้มเหลวและทดลองได้เต็มที่โดยไม่มีอุปกรณ์เสียหายจริง', isCorrect: true },
      { id: 'b', text: 'ใช้งานได้เฉพาะตอนเชื่อมต่อบอร์ดจริงผ่านสาย USB เท่านั้น', isCorrect: false },
      { id: 'c', text: 'ต้องซื้อลิขสิทธิ์รายเดือนราคาแพง', isCorrect: false },
      { id: 'd', text: 'ไม่รองรับการเขียนโค้ดภาษา C++', isCorrect: false }
    ],
    explanation: 'Tinkercad Circuits จำลองการทำงานของ Arduino, เซนเซอร์, และวงจรอิเล็กทรอนิกส์บนเว็บเบราว์เซอร์ ช่วยให้ทดลองได้โดยไม่ต้องกลัววงจรช็อตหรืออุปกรณ์ไหม้'
  },
  {
    id: 2,
    question: 'ข้อใดอธิบายความแตกต่างระหว่างฟังก์ชัน void setup() และ void loop() ในโค้ด Arduino ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'setup() ทำงานวนซ้ำเรื่อยๆ ส่วน loop() ทำงานเพียงครั้งเดียว', isCorrect: false },
      { id: 'b', text: 'setup() ทำงานเพียงครั้งเดียวตอนเปิดเครื่องเพื่อกำหนดค่าเริ่มต้น ส่วน loop() ทำงานวนซ้ำต่อเนื่องไม่รู้จบ', isCorrect: true },
      { id: 'c', text: 'ทั้งสองฟังก์ชันทำงานพร้อมกันแบบมัลติทาสก์ตลอดเวลา', isCorrect: false },
      { id: 'd', text: 'setup() ใช้เขียนเฉพาะภาษาบล็อก ส่วน loop() ใช้เขียน C++', isCorrect: false }
    ],
    explanation: 'void setup() จะรันครั้งเดียวเมื่อบอร์ดเริ่มทำงาน เพื่อตั้งค่าโหมดพิน เช่น pinMode() ส่วน void loop() จะรันวนซ้ำไปเรื่อยๆ จนกว่าจะตัดไฟ'
  },
  {
    id: 3,
    question: 'คำสั่ง pinMode(13, OUTPUT); มีหน้าที่อะไรในการเขียนโปรแกรม Arduino?',
    options: [
      { id: 'a', text: 'สั่งให้หลอดไฟที่พิน 13 ติดสว่างทันที', isCorrect: false },
      { id: 'b', text: 'กำหนดให้พินดิจิทัลหมายเลข 13 ทำหน้าที่เป็นพอร์ตส่งสัญญาณออก (Output)', isCorrect: true },
      { id: 'c', text: 'อ่านค่าแรงดันไฟฟ้าจากพิน 13', isCorrect: false },
      { id: 'd', text: 'รีเซ็ตการทำงานของบอร์ด', isCorrect: false }
    ],
    explanation: 'pinMode(pin, mode) ใช้สำหรับกำหนดทิศทางการทำงานของพิน เช่น OUTPUT (ส่งสัญญาณออก) หรือ INPUT (รับสัญญาณเข้า)'
  },
  {
    id: 4,
    question: 'หากต้องการให้บอร์ด Arduino หน่วงเวลาหยุดรอเป็นเวลา 2 วินาที ก่อนจะทำคำสั่งถัดไป ต้องเขียนคำสั่งอย่างไร?',
    options: [
      { id: 'a', text: 'delay(2);', isCorrect: false },
      { id: 'b', text: 'delay(200);', isCorrect: false },
      { id: 'c', text: 'delay(2000);', isCorrect: true },
      { id: 'd', text: 'wait(20);', isCorrect: false }
    ],
    explanation: 'ฟังก์ชัน delay(ms) รับค่าหน่วยเป็นมิลลิวินาที (Milliseconds) ดังนั้น 2 วินาที = 2,000 มิลลิวินาที -> delay(2000);'
  },
  {
    id: 5,
    question: 'หากต้องการสั่งจ่ายไฟ 5 โวลต์ไปยังพินดิจิทัลหมายเลข 13 เพื่อให้หลอดไฟ LED ติดสว่าง ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'digitalWrite(13, HIGH);', isCorrect: true },
      { id: 'b', text: 'digitalRead(13, HIGH);', isCorrect: false },
      { id: 'c', text: 'analogWrite(13, LOW);', isCorrect: false },
      { id: 'd', text: 'pinMode(13, HIGH);', isCorrect: false }
    ],
    explanation: 'คำสั่ง digitalWrite(pin, value) กำหนดระดับแรงดันดิจิทัล HIGH (5V หรือไฟติด) และ LOW (0V หรือไฟดับ)'
  },
  {
    id: 6,
    question: 'โหมดการเขียนโค้ดแบบใดใน Tinkercad Circuits ที่เหมาะสำหรับผู้เริ่มต้นที่ต้องการดูบล็อกลากวางควบคู่ไปกับโค้ดภาษา C++?',
    options: [
      { id: 'a', text: 'Blocks Mode', isCorrect: false },
      { id: 'b', text: 'Text Mode', isCorrect: false },
      { id: 'c', text: 'Blocks + Text Mode', isCorrect: true },
      { id: 'd', text: 'Assembly Mode', isCorrect: false }
    ],
    explanation: 'โหมด Blocks + Text จะแสดงบล็อกคำสั่งทางซ้ายควบคู่กับโค้ดภาษา C++ ทางขวา ช่วยให้เห็นการแปลงบล็อกเป็นคำสั่งจริง'
  },
  {
    id: 7,
    question: 'เครื่องมือใดใน Tinkercad Circuits ที่ใช้สำหรับแสดงผลข้อความหรือค่าตัวแปรแบบเรียลไทม์จากคำสั่ง Serial.println()?',
    options: [
      { id: 'a', text: 'Serial Monitor', isCorrect: true },
      { id: 'b', text: 'Breadboard', isCorrect: false },
      { id: 'c', text: 'Power Supply', isCorrect: false },
      { id: 'd', text: 'Oscilloscope', isCorrect: false }
    ],
    explanation: 'Serial Monitor (จอภาพอนุกรม) อยู่ด้านล่างหน้าต่างโค้ด ใช้ส่งและรับข้อมูลตัวอักษรระหว่างบอร์ดกับคอมพิวเตอร์'
  },
  {
    id: 8,
    question: 'เมื่อต้องการแก้ไขการต่อสายไฟหรือเพิ่มอุปกรณ์ใหม่ในวงจรบน Tinkercad นักศึกษาควรทำสิ่งใดก่อนเสมอ?',
    options: [
      { id: 'a', text: 'กดปุ่ม Stop Simulation เพื่อหยุดการจำลองก่อน', isCorrect: true },
      { id: 'b', text: 'ลบโปรแกรมทิ้งแล้วติดตั้งใหม่', isCorrect: false },
      { id: 'c', text: 'กดปุ่ม F5 รีเฟรชหน้าเว็บ', isCorrect: false },
      { id: 'd', text: 'ตัดสายอินเทอร์เน็ต', isCorrect: false }
    ],
    explanation: 'ขณะที่ระบบกำลังรัน Simulation อยู่ วงจรจะอยู่ในสถานะมีไฟเลี้ยง การแก้ไขสายไฟควรหยุดการจำลอง (Stop Simulation) ก่อนเสมอ'
  },
  {
    id: 9,
    question: 'การต่อหลอดไฟ LED บนแผง Breadboard ขาแอโนด (Anode / ขายาว) ควรต่อเข้ากับสิ่งใด?',
    options: [
      { id: 'a', text: 'ต่อตรงเข้ากับพิน GND โดยตรง', isCorrect: false },
      { id: 'b', text: 'ต่อเข้ากับพินสัญญาณดิจิทัลของบอร์ด (ผ่านตัวต้านทานจำกัดกระแส)', isCorrect: true },
      { id: 'c', text: 'ต่อเข้ากับช่อง USB', isCorrect: false },
      { id: 'd', text: 'ปล่อยลอยไว้ไม่ต้องต่อ', isCorrect: false }
    ],
    explanation: 'ขา Anode (ขายาว) เป็นขั้วบวก รับสัญญาณไฟจากพินดิจิทัล (ผ่านตัวต้านทาน 220 โอห์ม) ส่วนขา Cathode (ขาสั้น) ต่อลงกราวด์ (GND)'
  },
  {
    id: 10,
    question: 'หากเริ่มต้นเขียนโค้ดโปรแกรมไฟกระพริบสลับติด-ดับ แต่ลืมใส่คำสั่ง delay(1000) หลังจากสั่งดับไฟ จะเกิดผลอย่างไร?',
    options: [
      { id: 'a', text: 'หลอดไฟจะติดค้างตลอดเวลาจนมองไม่เห็นการดับ เนื่องจากดับเพียงเศษเสี้ยวไมโครวินาทีแล้ววนกลับมาติดทันที', isCorrect: true },
      { id: 'b', text: 'บอร์ด Arduino จะไหม้ทันที', isCorrect: false },
      { id: 'c', text: 'หลอดไฟจะดับสนิทไม่ติดอีกเลย', isCorrect: false },
      { id: 'd', text: 'คอมพิวเตอร์จะดับเครื่องอัตโนมัติ', isCorrect: false }
    ],
    explanation: 'การทำงานของ loop() รวดเร็วระดับไมโครวินาที หากไม่มี delay() หลังคำสั่งดับไฟ หลอดไฟจะดับเพียงเสี้ยววินาทีแล้ววนมาเปิดใหม่ทันที ทำให้ตาเรามองเห็นเหมือนไฟติดค้าง'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header (Orange / Tinkercad Theme) -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-orange-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-orange-600">
        <Laptop class="w-[400px] h-[400px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-orange-100 text-orange-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">
          สัปดาห์ที่ 2
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-orange-950 mb-4 leading-tight">
          การจำลองวงจรและเขียนโปรแกรมควบคุมบอร์ด<br />
          <span class="text-3xl text-orange-700">(Circuit Simulation & Arduino Programming with Tinkercad)</span>
        </h1>
        <p class="text-gray-600 text-xl leading-relaxed">
          เริ่มต้นใช้งานห้องแล็บเสมือนจริง Autodesk Tinkercad Circuits เรียนรู้การต่อวงจรทดลองบน Breadboard การเขียนโค้ดควบคุมบอร์ด Arduino ด้วย Blocks และภาษา C/C++ โครงสร้าง void setup() และ void loop() พร้อมทดลองสร้างโครงงานไฟกะพริบแรก
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียนและการฝึกปฏิบัติ (Lecture & Lab Content)</h2>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-orange-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- Part 1: Tinkercad Simulator (Hands-on Lab) -->
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
                    <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-100">Hands-on Lab Simulator</span>
                    <h2 class="text-2xl sm:text-3xl font-black leading-tight">1. เครื่องมือฝึกปฏิบัติ: Autodesk Tinkercad Circuits</h2>
                    <p class="text-sm text-cyan-50/90 mt-1">ห้องแล็บอิเล็กทรอนิกส์และจำลองบอร์ด Arduino เสมือนจริงบนเว็บเบราว์เซอร์</p>
                  </div>
                </div>
                <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-cyan-800 font-bold text-sm shadow-lg hover:bg-cyan-50 hover:-translate-y-0.5 transition-all">
                  เข้าสู่ Tinkercad.com
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

            <div class="p-6 sm:p-8 space-y-10">
              <!-- Intro + preview -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <figure class="overflow-hidden rounded-2xl border border-gray-200 shadow-md group bg-gray-50">
                  <img src="/img/tinkercad_circuits_preview.jpg" alt="Autodesk Tinkercad Circuits Simulator Preview"
                    class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  <figcaption class="p-3 border-t border-gray-100 text-center text-xs text-gray-500">
                    จำลองการต่อวงจรและเขียนโปรแกรมควบคุม Arduino เสมือนจริง 100% บน Autodesk Tinkercad
                  </figcaption>
                </figure>

                <div class="space-y-4">
                  <h3 class="text-xl font-black text-gray-900">Tinkercad Circuits คืออะไร?</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Tinkercad Circuits เป็นโปรแกรมจำลองวงจรอิเล็กทรอนิกส์ออนไลน์จาก Autodesk
                    ที่ให้เราลากอุปกรณ์มาวางบนพื้นที่ทำงาน ต่อสายด้วยเมาส์ และเขียนโปรแกรมควบคุมบอร์ด Arduino
                    ได้เหมือนทำงานกับอุปกรณ์จริง โดยสามารถกดจำลองการทำงานเพื่อดูผลลัพธ์ได้ทันที
                  </p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    เครื่องมือนี้เหมาะกับผู้เริ่มต้น เพราะลดอุปสรรคเรื่องค่าอุปกรณ์ ความเสี่ยงที่อุปกรณ์เสียหาย
                    และการติดตั้งโปรแกรม ทำให้เรามีเวลาโฟกัสกับ <span
                      class="font-bold text-gray-900">ตรรกะของวงจรและโปรแกรม</span> อย่างเต็มที่
                  </p>
                </div>
              </div>

              <!-- Why Tinkercad -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">ทำไมเราจึงใช้ Tinkercad ในการเริ่มต้นเรียนรู้?</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="r in reasons" :key="r.title"
                    class="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all space-y-3">
                    <div class="flex items-center gap-3">
                      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', colorMap[r.color]]">
                        <component :is="r.icon" class="w-5 h-5" />
                      </div>
                      <p class="font-bold text-gray-900 text-sm">{{ r.title }}</p>
                    </div>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ r.desc }}</p>
                    <p class="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle class="w-3.5 h-3.5" /> {{ r.note }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Workflow -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">ขั้นตอนการใช้งานเบื้องต้น 5 ขั้นตอน</h3>
                <ol class="relative space-y-3">
                  <li v-for="(s, i) in steps" :key="s.title"
                    class="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:bg-cyan-50/40 transition-colors">
                    <div
                      class="w-9 h-9 shrink-0 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center">
                      {{ i + 1 }}
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-gray-900 text-sm">{{ s.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">{{ s.desc }}</p>
                    </div>
                    <component :is="s.icon" class="w-5 h-5 text-cyan-600 shrink-0 hidden sm:block mt-1" />
                  </li>
                </ol>
              </div>

              <!-- Components in Tinkercad -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">อุปกรณ์จำลองพื้นฐานในแถบ Component</h3>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="p in parts" :key="p.name"
                    class="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <component :is="p.icon" class="w-6 h-6 text-cyan-700" />
                    <p class="font-bold text-gray-900 text-sm">{{ p.name }}</p>
                    <p class="text-[11px] text-gray-500 leading-relaxed">{{ p.desc }}</p>
                  </div>
                </div>
              </div>

              <!-- Tips & Precautions -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                  <p class="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                    <Lightbulb class="w-4 h-4" /> เคล็ดลับการฝึกปฏิบัติ
                  </p>
                  <ul class="text-xs text-emerald-900/80 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>เปลี่ยนสีสายไฟเสมอ: สีแดง = ไฟบวก 5V, สีดำ = กราวด์ GND, สีเหลือง/เขียว = ขาสัญญาณ</li>
                    <li>ใช้เมาส์คลิกเพื่อสร้างจุดหักมุมของสายไฟ เพื่อให้วงจรเป็นระเบียบสวยงามและไล่สายง่าย</li>
                    <li>ทดลองเปลี่ยนค่าใน delay() เพื่อสังเกตจังหวะการกะพริบของหลอดไฟ</li>
                  </ul>
                </div>
                <div class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                  <p class="flex items-center gap-2 font-bold text-amber-800 text-sm">
                    <AlertTriangle class="w-4 h-4" /> ข้อควรระวัง
                  </p>
                  <ul class="text-xs text-amber-900/80 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>อย่าลืมหยุดการจำลอง (Stop Simulation) ก่อนทำการเคลื่อนย้ายอุปกรณ์หรือแก้ไขสายไฟ</li>
                    <li>ต้องต่อตัวต้านทาน 220 Ω อนุกรมกับ LED เสมอ แม้ในโปรแกรมจำลองจะจำลองควันขึ้นเตือน</li>
                    <li>ระวังการต่อขั้วผิด: ขา Anode (ขายาว/ขางอ) คือบวก, ขา Cathode (ขาสั้น) คือลบ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2: C/C++ Programming Structure -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-2">
            ส่วนที่ 2: ภาษาและโครงสร้างการเขียนโปรแกรมควบคุม Arduino (C/C++)
          </h3>
          <p class="text-base text-gray-600">
            โปรแกรมควบคุมบอร์ด Arduino เขียนด้วยภาษา C/C++ โดยโปรแกรมทุกตัวจะมีโครงสร้างพื้นฐาน 2 ฟังก์ชันหลักที่ต้องมีเสมอ:
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Code Structure -->
            <div
              class="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-4 font-mono text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <span class="text-amber-400 font-bold">// โครงสร้างหลักของไฟล์ .ino (Arduino Code)</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">C/C++ Syntax</span>
              </div>

              <div class="space-y-3">
                <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                  <span class="text-pink-400 font-bold">void</span> <span
                    class="text-yellow-300 font-bold">setup</span>() {<br />
                  &nbsp;&nbsp;<span class="text-slate-500">// 1. ทำงานเพียง "ครั้งเดียว" ตอนเปิดบอร์ด</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">pinMode</span>(<span class="text-orange-400">13</span>, <span
                    class="text-emerald-400">OUTPUT</span>); <span class="text-slate-500">// กำหนดให้พิน 13 เป็นเอาต์พุต</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">Serial</span>.<span class="text-yellow-300">begin</span>(<span class="text-orange-400">9600</span>); <span class="text-slate-500">// เปิดพอร์ตสื่อสาร</span><br />
                  }
                </div>

                <div class="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/30">
                  <span class="text-pink-400 font-bold">void</span> <span
                    class="text-yellow-300 font-bold">loop</span>() {<br />
                  &nbsp;&nbsp;<span class="text-slate-500">// 2. ทำงาน "วนซ้ำตลอดเวลา" ไม่รู้จบ</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">13</span>,
                  <span class="text-emerald-400">HIGH</span>); <span class="text-slate-500">// สั่งจ่ายไฟ 5V (ไฟติด)</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span
                    class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
                    class="text-slate-500">// หน่วงเวลา 1 วินาที</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">13</span>,
                  <span class="text-emerald-400">LOW</span>);&nbsp;&nbsp;<span class="text-slate-500">// สั่งตัดไฟ 0V (ไฟดับ)</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span
                    class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
                    class="text-slate-500">// หน่วงเวลา 1 วินาที</span><br />
                  }
                </div>
              </div>
            </div>

            <!-- Right: Explanation of Code Mode in Tinkercad -->
            <div class="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
              <h4 class="text-lg font-black text-gray-900">รูปแบบการเขียนโค้ด 3 โหมดบน Tinkercad Circuits</h4>

              <div class="space-y-3 text-xs text-gray-600">
                <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <p class="font-bold text-amber-900 mb-1">🧱 1. Blocks Mode (บล็อกลากวาง)</p>
                  <p>เหมาะสำหรับผู้เริ่มต้น ลากบล็อกคำสั่ง เช่น <span
                      class="font-mono bg-white px-1.5 py-0.5 rounded border">set built-in LED to HIGH</span>
                    มาต่อกันเหมือนตัวต่อเลโก้</p>
                </div>

                <div class="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                  <p class="font-bold text-indigo-900 mb-1">💻 2. Text Mode (C/C++ Code)</p>
                  <p>เหมาะสำหรับนักศึกษาสายไอที/คอมพิวเตอร์ เขียนโค้ดภาษา C/C++ ด้วยมือจริง ช่วยให้เข้าใจการทำงานลึกซึ้ง
                    และนำไปใช้งานกับบอร์ดจริงในแล็บได้ 100%</p>
                </div>

                <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                  <p class="font-bold text-teal-900 mb-1">🔄 3. Blocks + Text Mode (แนะนำในสัปดาห์นี้)</p>
                  <p>โหมดแนะนำ ลากบล็อกคำสั่งทางซ้าย แล้วดูโค้ดภาษา C++ ที่ถูกสร้างขึ้นมาอัตโนมัติทางขวาเพื่อเปรียบเทียบคำสั่ง</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 3: First Project Lab (Blink LED) -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <h3 class="text-2xl font-bold text-emerald-900 border-l-4 border-emerald-500 pl-4 mb-2">
            ส่วนที่ 3: โครงงานฝึกปฏิบัติแรก: วงจรไฟกะพริบ (Blink LED Project)
          </h3>
          <p class="text-base text-gray-600">
            ทดลองสร้างวงจรไฟกะพริบ 2 รูปแบบ: 1) ไฟกะพริบพิน 13 (Built-in LED บนบอร์ด) และ 2) วงจรต่อหลอด LED ภายนอกผ่าน Breadboard
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div class="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <span class="px-3 py-1 bg-amber-200 text-amber-900 font-bold rounded-lg text-xs">แล็บที่ 1</span>
              <h4 class="text-base font-bold text-gray-900">ทดสอบ Built-in LED พิน 13 บนบอร์ด Arduino</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                ลากบอร์ด Arduino Uno R3 ออกมาวางใน Tinkercad โดยยังไม่ต้องต่อสายไฟใดๆ กดปุ่ม <strong>Code</strong> และกด <strong>Start Simulation</strong> ได้ทันที
                สังเกตไฟดวงเล็กๆ ตัวอักษร "L" บนตัวบอร์ดจะกะพริบติด 1 วินาที ดับ 1 วินาที ตามโค้ดดีฟอลต์
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <span class="px-3 py-1 bg-emerald-200 text-emerald-900 font-bold rounded-lg text-xs">แล็บที่ 2</span>
              <h4 class="text-base font-bold text-gray-900">ต่อวงจรหลอด LED ภายนอกบน Breadboard</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                ลาก Breadboard, LED สีแดง และตัวต้านทาน 220 Ω ออกมาวาง ลากสายไฟจากพินดิจิทัล 13 ไปเข้าตัวต้านทาน แล้วต่อเข้าขา Anode (ขายาว) ของ LED
                จากนั้นต่อขา Cathode (ขาสั้น) เข้ากับช่อง GND ของบอร์ด Arduino แล้วกด Start Simulation
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Game Center -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจสัปดาห์ที่ 2</h2>
            <p class="text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-900 to-amber-900 hover:from-orange-800 hover:to-amber-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-orange-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-orange-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่ 2</span>
            <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
              <span>สถานะ:</span>
              <span v-if="studentNorm.isAllCompleted" class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ ทำครบทุกกิจกรรมแล้ว (3/3)
              </span>
              <span v-else-if="studentNorm.completedCount > 0" class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⏳ กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
              </span>
              <span v-else class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                ยังไม่ได้เริ่มทำ
              </span>
            </div>
          </div>

          <!-- Total Normalized Score (Scaled to 10) -->
          <div class="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 rounded-xl border border-orange-100">
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
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-1'] ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. จัดกลุ่มคำสั่งภาษา C++</span>
              <span class="text-[11px] text-gray-500">เต็ม 6 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / 6` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Game 2 -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-2'] ? 'bg-cyan-50/70 border-cyan-200 text-cyan-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">2. จับคู่เครื่องมือ Tinkercad</span>
              <span class="text-[11px] text-gray-500">เต็ม 5 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / 5` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Post-test -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
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
          <span>มินิเกมที่ 1: จัดกลุ่มคำสั่งภาษา C++</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่เครื่องมือ Tinkercad</span>
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
        game-title="เกมลากวาง: จำแนกคำสั่งและโครงสร้างภาษา C++ สำหรับ Arduino"
        title="จัดกลุ่มคำสั่งและฟังก์ชัน C++ สำหรับบอร์ด Arduino"
        subtitle="ลากชื่อคำสั่งไปใส่ในหมวดหมู่การทำงานที่ถูกต้องให้ครบ!"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="game-2"
        game-title="เกมจับคู่: เครื่องมือและฟังก์ชันสำคัญบน Autodesk Tinkercad"
        title="จับคู่เครื่องมือและคำศัพท์สำคัญบน Tinkercad Circuits"
        subtitle="จับคู่ชื่อเครื่องมือด้านซ้ายกับความหมายและหน้าที่ด้านขวาให้ถูกต้องครบทั้ง 5 คู่"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs"
      />

      <!-- Game 3: Pop Quiz (Post-test) -->
      <PopQuiz v-if="activeGame === 'quiz'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="quiz"
        game-title="แบบทดสอบหลังเรียน Week 2 (Tinkercad Circuits & Arduino Programming)"
        title="แบบทดสอบหลังเรียน: สัปดาห์ที่ 2 (Tinkercad Circuits & C++ Arduino)"
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

    <!-- Assignment Section (Tinkercad Lab Assignment) -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-2"
      assignment-title="ใบงานที่ 2: การสมัครและเริ่มต้นสร้างวงจรเสมือนจริงบน Tinkercad" :max-score="10">
      <template #number>2</template>
      <template #description>
        ให้นักศึกษาสมัครบัญชี Autodesk Tinkercad และทดสอบสร้างวงจรจำลองบอร์ด Arduino Uno R3
        พร้อมทดลองรันโค้ดไฟกระพริบแรก (Blink) บนระบบเสมือนจริง
      </template>
      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>เข้าไปที่เว็บไซต์ <a href="https://www.tinkercad.com/circuits" target="_blank"
              class="text-cyan-600 font-bold underline">tinkercad.com/circuits</a> แล้วสมัครสมาชิก (Sign Up)
            หรือเข้าสู่ระบบด้วย Google Account ของนักศึกษา</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>กดปุ่ม <strong>+ Create</strong> เลือก <strong>Circuit</strong> จากนั้นลากบอร์ด <strong>Arduino Uno
              R3</strong> ออกมาวางในพื้นที่ทำงาน</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>กดปุ่ม <strong>Code</strong> ด้านบนขวา เลือกโหมด <strong>Blocks + Text</strong> แล้วกด <strong>Start
              Simulation</strong> เพื่อสังเกตไฟสีส้มที่พิน 13 (Built-in LED) กระพริบติด-ดับ</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>จับภาพหน้าจอ (Screenshot) วงจรและโค้ดของตนเองบน Tinkercad นำไปอัปโหลดขึ้น Google Drive
            หรือแชร์ลิงก์สาธารณะของวงจร แล้วนำ URL มาส่งในปุ่ม <strong>ส่งงานด้วยลิงก์</strong> ด้านล่าง</span>
        </li>
      </template>
    </AssignmentSection>

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
