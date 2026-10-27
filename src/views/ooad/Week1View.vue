<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload, Layers,
  Shield, Users, Server, FileQuestion, ArrowRight, Target, Award, Book,
  Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star, Shuffle,
  MousePointer2, Code, Settings, Sparkles, Box, Cpu, Compass, ChevronLeft,
  ExternalLink, HelpCircle, Eye, GitBranch, Terminal, ClipboardList, Search,
  MessageSquare, MonitorCheck, ShoppingCart, CreditCard, Receipt, Database,
  Smartphone, UserCheck, BarChart3, AlertCircle, RefreshCw, Zap,
  Calendar, ChevronDown, ChevronUp, Printer, Download, X,
  UtensilsCrossed, Library, Building2, Clock, Trophy, Lock, FileSpreadsheet
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import { courses } from '@/data/courses'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Router
const route = useRoute()
const router = useRouter()

// Current Course & Week context
const currentCourseId = '21900-1004'
const currentWeek = 1

// Course Curriculum Data
const ooadCourse = courses.find(c => c.id === '21900-1004')
const showFullCurriculum = ref(false)

// PDF & Submit Modal State
const showPdfModal = ref(false)
const showTeacherModal = ref(false)

// Grading Criteria Data
const grading = [
  { name: 'จิตพิสัย', score: 20, color: 'bg-purple-500' },
  { name: 'คะแนนเก็บ', score: 40, color: 'bg-indigo-600' },
  { name: 'สอบกลางภาค (Midterm Examination)', score: 20, color: 'bg-violet-600' },
  { name: 'สอบปลายภาค (Final Examination)', score: 20, color: 'bg-fuchsia-600' }
]

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (Input vs Output ของระบบ)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (5 ขั้นตอนในวงจร SDLC)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียน (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
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

// แบบทดสอบหลังเรียน (Post-test) 4 ตัวเลือก 10 ข้อ
const quizQuestions = [
  {
    id: 1,
    question: "ข้อใดคือความหมายที่ถูกต้องและครอบคลุมที่สุดของคำว่า 'ระบบ' (System)?",
    options: [
      { id: 'a', text: "การเปิดเครื่องคอมพิวเตอร์ทิ้งไว้เพื่อดาวน์โหลดไฟล์ขนาดใหญ่", isCorrect: false },
      { id: 'b', text: "กลุ่มขององค์ประกอบที่ทำงานประสานกันอย่างมีเป้าหมาย (Input ➔ Process ➔ Storage ➔ Output ➔ Feedback) เพื่อบรรลุวัตถุประสงค์เดียวกัน", isCorrect: true },
      { id: 'c', text: "โปรแกรมระบบปฏิบัติการ Windows หรือ macOS ที่ติดตั้งในเครื่อง", isCorrect: false },
      { id: 'd', text: "ตู้เซิร์ฟเวอร์คอมพิวเตอร์ที่มีสายสัญญาณเชื่อมต่อกันอย่างซับซ้อน", isCorrect: false }
    ],
    explanation: "ระบบคือกลุ่มขององค์ประกอบที่ประสานกัน ทำงานรับ Input เข้ามาประมวลผล จัดเก็บ ส่งมอบ Output และมี Feedback เพื่อควบคุมเป้าหมาย"
  },
  {
    id: 2,
    question: "ปัญหาคลาสสิกของระบบที่ดำเนินการด้วยมือ (Manual System เช่น การจดสมุด) คือข้อใด?",
    options: [
      { id: 'a', text: "ความผิดพลาดจากมนุษย์ (Human Error), เอกสารสูญหาย, ค้นหายาก และสรุปยอดขายได้ล่าช้า", isCorrect: true },
      { id: 'b', text: "ไม่มีการใช้กระแสไฟฟ้าในสำนักงาน", isCorrect: false },
      { id: 'c', text: "คอมพิวเตอร์ติดไวรัสได้ง่ายกว่าระบบดิจิทัล", isCorrect: false },
      { id: 'd', text: "ไม่สามารถส่งจดหมายทางไปรษณีย์ได้", isCorrect: false }
    ],
    explanation: "ระบบ Manual มักมีปัญหาความผิดพลาดในการคำนวณ การบันทึกซ้ำซ้อน เอกสารชำรุดสูญหาย และไม่สามารถเรียกดูภาพรวมได้ทันที"
  },
  {
    id: 3,
    question: "นักวิเคราะห์ระบบ (System Analyst: SA) เปรียบเสมือนวิชาชีพใดในกระบวนการก่อสร้าง?",
    options: [
      { id: 'a', text: "ช่างฉาบปูนและทาสีที่คอยเก็บรายละเอียดหน้างาน", isCorrect: false },
      { id: 'b', text: "สถาปนิกผู้ออกแบบพิมพ์เขียว ที่แปลงความต้องการของเจ้าของบ้านเป็นแบบแปลนให้ช่างก่อสร้าง", isCorrect: true },
      { id: 'c', text: "เจ้าหน้าที่รักษาความปลอดภัยที่คอยเฝ้าหน้าประตูทางเข้า", isCorrect: false },
      { id: 'd', text: "พนักงานขายวัสดุก่อสร้างประจำร้านค้า", isCorrect: false }
    ],
    explanation: "SA เปรียบเสมือนสถาปนิก ทำหน้าที่รวบรวมความต้องการของลูกค้า แปลงเป็นพิมพ์เขียวระบบ (UML) เพื่อให้โปรแกรมเมอร์ (ช่าง) นำไปเขียนโค้ด"
  },
  {
    id: 4,
    question: "หัวใจสำคัญของแนวคิด 'เชิงวัตถุ' (Object-Oriented) ในการพัฒนาระบบคืออะไร?",
    options: [
      { id: 'a', text: "การมองสิ่งต่างๆ ในโลกแห่งความเป็นจริงเป็น 'ออบเจกต์ (Object)' ที่มีคุณลักษณะและพฤติกรรมในตัวเอง", isCorrect: true },
      { id: 'b', text: "การเขียนโค้ดคำสั่งเรียงตามลำดับจากบรรทัดบนลงล่างโดยไม่สร้างฟังก์ชัน", isCorrect: false },
      { id: 'c', text: "การใช้วัตถุที่เป็นสิ่งของจริงมาวางบนคีย์บอร์ดคอมพิวเตอร์", isCorrect: false },
      { id: 'd', text: "การบังคับให้นักพัฒนาทุกคนใช้เมาส์แบบไร้สายเท่านั้น", isCorrect: false }
    ],
    explanation: "Object-Oriented มองระบบเป็นกลุ่มของ Object ที่มีสถานะ (Attribute) และพฤติกรรม (Method) สื่อสารกัน สอดคล้องกับโลกความจริง"
  },
  {
    id: 5,
    question: "ความสัมพันธ์ระหว่าง 'คลาส (Class)' และ 'ออบเจกต์ (Object)' เปรียบได้กับข้อใด?",
    options: [
      { id: 'a', text: "แบบแปลนพิมพ์เขียวบ้าน (Class) กับ บ้านที่สร้างขึ้นจริง (Object)", isCorrect: true },
      { id: 'b', text: "จอคอมพิวเตอร์ (Class) กับ ปลั๊กไฟ (Object)", isCorrect: false },
      { id: 'c', text: "กระดาษ A4 (Class) กับ หมึกพิมพ์ (Object)", isCorrect: false },
      { id: 'd', text: "ถนนลาดยาง (Class) กับ ป้ายจราจร (Object)", isCorrect: false }
    ],
    explanation: "Class เป็นแม่พิมพ์หรือแบบแปลน (Blueprint) ส่วน Object คือชิ้นงานที่ถูกสร้างขึ้นจริง (Instance) ตามแบบแปลนนั้น"
  },
  {
    id: 6,
    question: "คุณลักษณะประจำตัวของออบเจกต์ (Attribute) และพฤติกรรมการทำงาน (Method) ข้อใดจับคู่ได้ถูกต้อง?",
    options: [
      { id: 'a', text: "Attribute: สีรถยนต์, ความเร็วสูงสุด / Method: สตาร์ทเครื่อง, เหยียบเบรก", isCorrect: true },
      { id: 'b', text: "Attribute: เดิน, วิ่ง / Method: สีตา, ส่วนสูง", isCorrect: false },
      { id: 'c', text: "Attribute: กดปุ่มสั่งซื้อ / Method: ชื่อสินค้า, ราคาสินค้า", isCorrect: false },
      { id: 'd', text: "Attribute: พิมพ์รายงาน / Method: วันที่ผลิต", isCorrect: false }
    ],
    explanation: "Attribute คือคุณสมบัติหรือข้อมูล (Data) เช่น สี, ชื่อ ส่วน Method คือการกระทำหรือฟังก์ชัน (Behavior) เช่น ขับ, คำนวณ"
  },
  {
    id: 7,
    question: "ภาษา UML (Unified Modeling Language) ถูกสร้างขึ้นเพื่อจุดประสงค์ใดเป็นสำคัญ?",
    options: [
      { id: 'a', text: "เป็นภาษาสัญลักษณ์มาตรฐานสากลในการจำลองภาพพิมพ์เขียวระบบเชิงวัตถุ เพื่อให้ทีมงานเข้าใจตรงกัน", isCorrect: true },
      { id: 'b', text: "ใช้สำหรับเขียนสูตรคำนวณบัญชีในโปรแกรม Excel", isCorrect: false },
      { id: 'c', text: "ใช้แปลภาษาต่างประเทศในเบราว์เซอร์อัตโนมัติ", isCorrect: false },
      { id: 'd', text: "ใช้ควบคุมความเร็วรอบพัดลมระบายความร้อนของซีพียู", isCorrect: false }
    ],
    explanation: "UML เป็นภาษาสัญลักษณ์มาตรฐาน (Visual Modeling) ช่วยให้นักวิเคราะห์ โปรแกรมเมอร์ และผู้ใช้งานสื่อสารโครงสร้างระบบได้อย่างถูกต้อง"
  },
  {
    id: 8,
    question: "ข้อใดเรียงลำดับขั้นตอนในวงจรการพัฒนาระบบ (SDLC 5 ขั้นตอนหลัก) ได้อย่างถูกต้อง?",
    options: [
      { id: 'a', text: "Planning (วางแผน) ➔ Analysis (วิเคราะห์) ➔ Design (ออกแบบ) ➔ Implementation (พัฒนา) ➔ Maintenance (บำรุงรักษา)", isCorrect: true },
      { id: 'b', text: "Implementation ➔ Design ➔ Planning ➔ Maintenance ➔ Analysis", isCorrect: false },
      { id: 'c', text: "Design ➔ Planning ➔ Analysis ➔ Maintenance ➔ Implementation", isCorrect: false },
      { id: 'd', text: "Maintenance ➔ Analysis ➔ Planning ➔ Implementation ➔ Design", isCorrect: false }
    ],
    explanation: "ลำดับมาตรฐานเริ่มจากวางแผนโครงการ (Planning), วิเคราะห์ความต้องการ (Analysis), ออกแบบพิมพ์เขียว (Design), พัฒนาโค้ด (Implementation) และบำรุงรักษา (Maintenance)"
  },
  {
    id: 9,
    question: "การจัดทำ 'Problem Statement' (การระบุปัญหาทางธุรกิจ) ในสัปดาห์ที่ 1 มีความสำคัญอย่างไร?",
    options: [
      { id: 'a', text: "ช่วยชี้ชัดว่าระบบที่จะสร้างขึ้นมานั้น จะเข้าไปแก้ปัญหาอะไรของธุรกิจ และสร้างคุณค่าใดให้ผู้ใช้", isCorrect: true },
      { id: 'b', text: "ใช้สำหรับการยื่นขอสินเชื่อจากธนาคารพาณิชย์", isCorrect: false },
      { id: 'c', text: "ช่วยลดขนาดพื้นที่จัดเก็บของไฟล์ในฮาร์ดดิสก์", isCorrect: false },
      { id: 'd', text: "ใช้กำหนดรหัสผ่านให้กับผู้ดูแลระบบ", isCorrect: false }
    ],
    explanation: "Problem Statement ช่วยให้ทีมพัฒนาเข้าใจเป้าหมายที่แท้จริง ไม่หลงทาง และมั่นใจว่าซอฟต์แวร์ที่สร้างตอบโจทย์ปัญหาธุรกิจจริง"
  },
  {
    id: 10,
    question: "ในวงจร SDLC หากทีมข้ามขั้นตอน Analysis & Design ไปลงมือเขียนโค้ดทันที มักจะเกิดผลเสียข้อใดมากที่สุด?",
    options: [
      { id: 'a', text: "โปรแกรมไม่ตรงกับความต้องการจริงของผู้ใช้ ต้องรื้อเขียนใหม่ เสียเวลาและงบประมาณบานปลาย", isCorrect: true },
      { id: 'b', text: "หน้าจอคอมพิวเตอร์จะดับทันทีที่เริ่มเปิดโปรแกรม", isCorrect: false },
      { id: 'c', text: "ทำให้หมึกพิมพ์ของเครื่องพิมพ์หมดเร็วกว่าปกติ", isCorrect: false },
      { id: 'd', text: "ทำให้ระบบอินเทอร์เน็ตของทั้งบริษัทถูกระงับการใช้งาน", isCorrect: false }
    ],
    explanation: "การเขียนโค้ดโดยไม่มีพิมพ์เขียว (No Design) เหมือนสร้างบ้านโดยไม่มีแบบแปลน มักสร้างสิ่งที่ลูกค้าไม่ได้ต้องการและต้องรื้อแก้ซ้ำซาก"
  }
]

const activeGame = ref('sort') // 'sort', 'order', 'quiz'

// Game 1: Drag & Drop (System Elements: Input vs Output - 6 items, max 6)
const dragItemsData = [
  { id: 1, text: 'ยิงสแกนเนอร์บาร์โค้ดรหัสสินค้าที่เคาน์เตอร์', type: 'input' },
  { id: 2, text: 'พิมพ์ใบเสร็จรับเงินออกจากเครื่องพิมพ์ความร้อน', type: 'output' },
  { id: 3, text: 'สแกน QR Code PromptPay เพื่อจ่ายเงิน', type: 'input' },
  { id: 4, text: 'หน้าจอ Monitor แสดงหมายเลขคิวรับอาหาร', type: 'output' },
  { id: 5, text: 'ป้อนเลขมิเตอร์ไฟฟ้าประจำเดือนของห้องพัก', type: 'input' },
  { id: 6, text: 'ระบบส่งใบแจ้งหนี้ค่าเช่าห้องพักเป็นไฟล์ PDF', type: 'output' }
]

const dragZonesData = [
  {
    id: 'input',
    title: 'Input (ข้อมูลนำเข้าสู่ระบบ)',
    description: 'ข้อมูลดิบหรือคำสั่งที่ผู้ใช้นำเข้าสู่ระบบคอมพิวเตอร์',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากรายการ Input มาวางที่นี่'
  },
  {
    id: 'output',
    title: 'Output (ผลลัพธ์ที่ได้จากระบบ)',
    description: 'สารสนเทศ เอกสาร หรือสัญญาณแจ้งเตือนที่ระบบส่งมอบให้ผู้ใช้',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากรายการ Output มาวางที่นี่'
  }
]

// Game 2: Matching Game (5 SDLC Phases, max 5)
const matchLeftTerms = [
  { id: 'l1', text: '1. Planning (วางแผน)', match: 'r1' },
  { id: 'l2', text: '2. Analysis (วิเคราะห์)', match: 'r2' },
  { id: 'l3', text: '3. Design (ออกแบบ)', match: 'r3' },
  { id: 'l4', text: '4. Implementation (พัฒนา)', match: 'r4' },
  { id: 'l5', text: '5. Maintenance (บำรุงรักษา)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ศึกษาความเป็นไปได้ กำหนดงบประมาณและระยะเวลาโครงการ' },
  { id: 'r2', text: 'สำรวจปัญหาและเก็บรวบรวมความต้องการจากผู้ใช้งานจริง' },
  { id: 'r3', text: 'เขียนพิมพ์เขียว ไดอะแกรม UML ออกแบบหน้าจอ UI และฐานข้อมูล' },
  { id: 'r4', text: 'ลงมือเขียนโค้ดโปรแกรมและทดสอบระบบตามพิมพ์เขียว' },
  { id: 'r5', text: 'ดูแลรักษาระบบ แก้ไขข้อผิดพลาด และปรับปรุงระบบหลังขึ้นใช้งานจริง' }
]
</script>

<template>
  <div class="w-full space-y-12 pb-20 px-4 md:px-8 animate-[fadeIn_0.3s_ease-out]">

    <!-- Back Button -->
    <div>
      <button @click="router.push('/course/21900-1004')"
        class="flex items-center text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors">
        <ChevronLeft class="w-4 h-4 mr-1" /> กลับไปหน้ารวมสัปดาห์
      </button>
    </div>

    <!-- Page Header (Premium Hero Banner) -->
    <div
      class="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[280px]">
      <!-- Background Decorative Lights -->
      <div class="absolute -right-16 -top-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none">
      </div>
      <div class="absolute right-1/3 -bottom-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none">
      </div>
      <div class="absolute right-6 top-8 opacity-10 pointer-events-none hidden lg:block">
        <Layers class="w-96 h-96 text-white" />
      </div>

      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-4 py-1.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold rounded-full text-xs uppercase tracking-wider shadow-sm backdrop-blur-md">
            สัปดาห์ที่ 1
          </span>
          <span
            class="px-3 py-1 bg-white/10 text-white font-bold rounded-lg text-xs border border-white/20 backdrop-blur-md">
            ระดับชั้น ปวช.1/1
          </span>
          <span
            class="px-3 py-1 bg-purple-400/20 text-purple-200 font-bold rounded-lg text-xs border border-purple-400/20 backdrop-blur-md">
            รหัสวิชา 21900-1004
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
          ปฐมนิเทศและภาพรวมการวิเคราะห์ระบบ<br />
          <span class="text-xl md:text-3xl text-purple-300 font-medium">(Course Orientation & System Analysis
            Overview)</span>
        </h1>
        <p class="text-purple-200/90 text-base md:text-lg leading-relaxed pt-1">
          เริ่มต้นก้าวแรกของการเรียนรู้วิชาการวิเคราะห์และออกแบบระบบ เข้าใจความหมายของระบบและระบบสารสนเทศ
          Software Application ในธุรกิจ ปัญหาและความต้องการ ภาพรวมกระบวนการวิเคราะห์และออกแบบระบบ
          วงจรการพัฒนาระบบ (SDLC) และตำแหน่งของ OOAD ในกระบวนการพัฒนาซอฟต์แวร์
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Course Syllabus Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-100 rounded-2xl text-purple-700 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-gray-800">ข้อมูลรายวิชา (Course Syllabus)</h2>
          <p class="text-gray-500 text-sm">หลักสูตรประกาศนียบัตรวิชาชีพ (ปวช.) สาขาวิชาเทคโนโลยีสารสนเทศ</p>
        </div>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-purple-100 space-y-10">
        <!-- Course Code, Name, Level -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-purple-700 text-white font-black rounded-lg text-sm shadow-sm">21900-1004</span>
              <span
                class="px-3 py-1 bg-purple-100 text-purple-800 font-bold rounded-lg text-sm border border-purple-200">ท-ป-น
                1-2-2</span>
              <span
                class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-sm border border-emerald-200">ห้อง
                ปวช.1/1</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-black text-purple-950">หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ</h3>
            <p class="text-gray-500 text-lg font-medium">Principle of Object-Oriented Analysis and Design</p>
          </div>
          <div class="text-left md:text-right">
            <span class="text-xs text-gray-400 font-semibold block uppercase tracking-wider">ระยะเวลาการศึกษา</span>
            <span class="text-xl font-bold text-gray-800">18 สัปดาห์ (54 คาบ)</span>
          </div>
        </div>

        <!-- Course Description -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-purple-600" /> คำอธิบายรายวิชา (Course Description)
          </h4>
          <p
            class="text-gray-700 leading-relaxed text-lg bg-purple-50/70 p-6 md:p-8 rounded-2xl border border-purple-100 shadow-inner">
            ศึกษาและปฏิบัติเกี่ยวกับหลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ เขียนโครงสร้างและความต้องการทางธุรกิจ
            กำหนดกลุ่มเป้าหมายของความต้องการ ออกแบบแบบสำรวจข้อมูล สร้างแบบสอบถาม
            เก็บรวบรวมข้อมูลที่ถูกต้องตรงกับความต้องการ วิเคราะห์ สรุปผลลัพธ์ และเลือกเครื่องมือให้สอดคล้องกับรูปแบบ
            วิเคราะห์ความหมาย ลำดับขั้นของงานแต่ละรูปแบบ จำแนกรูปแบบการสร้างแบบจำลองตามมาตรฐานสากล
          </p>
        </div>

        <!-- Grid for Objectives, Competencies, Outcomes (3 Columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Objectives (จุดประสงค์รายวิชา) -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-purple-600 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-purple-50 rounded-lg text-purple-700">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">จุดประสงค์รายวิชา เพื่อให้</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-sm flex-1 leading-relaxed">
              <li>รู้และเข้าใจเกี่ยวกับหลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ</li>
              <li>มีทักษะในการเขียนแบบจำลองตามรูปแบบมาตรฐาน UML</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความรับผิดชอบ การคิดเชิงนวัตกรรมและการทำงานเป็นทีม</li>
              <li>มีความสามารถประยุกต์ใช้กระบวนการวิเคราะห์และออกแบบระบบเชิงวัตถุในการพัฒนาอุตสาหกรรมหรือธุรกิจ</li>
            </ol>
          </div>

          <!-- Competencies (สมรรถนะรายวิชา) -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-violet-600 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-violet-50 rounded-lg text-violet-700">
                <Award class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">สมรรถนะรายวิชา</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-2 text-sm flex-1 leading-relaxed">
              <li>แสดงความรู้เกี่ยวกับการวิเคราะห์และออกแบบระบบเชิงวัตถุตามหลักการ</li>
              <li>สำรวจความต้องการทางธุรกิจในการพัฒนา Software Applications บนอุปกรณ์คอมพิวเตอร์ตามหลักการ</li>
              <li>วิเคราะห์ความต้องการทางธุรกิจในการพัฒนา Software Applications บนอุปกรณ์คอมพิวเตอร์ตามหลักการ</li>
              <li>ออกแบบสถาปัตยกรรมซอฟต์แวร์ระบบเบื้องต้นด้วย UML Modeling ตามความต้องการของผู้ใช้งาน</li>
              <li>ประยุกต์ใช้กระบวนการวิเคราะห์และออกแบบระบบเชิงวัตถุเพื่อใช้ในการพัฒนาอุตสาหกรรมหรือธุรกิจ</li>
            </ol>
          </div>

          <!-- Outcomes (ผลลัพธ์การเรียนรู้ระดับรายวิชา & มาตรฐานอาชีพ) -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-fuchsia-600 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-fuchsia-50 rounded-lg text-fuchsia-700">
                <Lightbulb class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">ผลลัพธ์การเรียนรู้ระดับรายวิชา</h4>
            </div>
            <div
              class="text-gray-600 text-sm leading-relaxed flex-1 bg-fuchsia-50/50 p-4 rounded-xl border border-fuchsia-100/60 mb-4">
              สำรวจและวิเคราะห์ความต้องการทางธุรกิจในการพัฒนา Software Applications บนอุปกรณ์คอมพิวเตอร์
              เขียนแผนภาพตรงความต้องการทางธุรกิจออกมาในรูปแบบของมาตรฐาน UML ตามความต้องการทางธุรกิจ ด้วยความรับผิดชอบ
              การคิดเชิงนวัตกรรมและการทำงานเป็นทีม
            </div>
            <div class="pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span class="font-bold text-fuchsia-800 block mb-1">มาตรฐานอาชีพที่รองรับ:</span>
              สถาบันคุณวุฒิวิชาชีพ (TPQI) อาชีพ <strong class="text-gray-800">นักออกแบบสถาปัตยกรรมด้านซอฟต์แวร์ ระดับ
                3</strong>
            </div>
          </div>

        </div>

        <!-- 18-Week Course Curriculum Overview -->
        <div class="pt-6 border-t border-purple-100">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-purple-600" /> แผนการจัดการเรียนรู้ตลอด 18 สัปดาห์ (18-Week Course
                Curriculum)
              </h4>
              <p class="text-sm text-gray-500 mt-1">
                โครงสร้าง 18 สัปดาห์ (54 คาบ) แบ่งออกเป็น 4
                ช่วงการเรียนรู้หลักตามแนวคิดการวิเคราะห์และออกแบบระบบเชิงวัตถุ
              </p>
            </div>
            <button @click="showFullCurriculum = !showFullCurriculum"
              class="px-5 py-2.5 rounded-xl font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-2 shadow-xs shrink-0">
              <span>{{ showFullCurriculum ? 'ย่อรายละเอียดแผนการสอน' : 'ดูโครงสร้างทั้ง 18 สัปดาห์' }}</span>
              <ChevronUp v-if="showFullCurriculum" class="w-4 h-4" />
              <ChevronDown v-else class="w-4 h-4" />
            </button>
          </div>

          <!-- 18-Week Grid -->
          <div v-if="showFullCurriculum"
            class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-purple-100">
            <div v-for="topic in ooadCourse?.topics" :key="topic.id" :class="[
              'p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between',
              topic.isOpen ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-400/20 shadow-sm' : 'bg-white border-gray-200 hover:border-purple-200'
            ]">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span :class="[
                    'px-2 py-0.5 rounded font-bold text-[11px]',
                    topic.isOpen ? 'bg-purple-600 text-white shadow-xs' : (topic.id.includes('สอบ') ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600')
                  ]">
                    {{ topic.id }}
                  </span>
                  <span v-if="topic.phase" class="text-[10px] text-gray-500 font-semibold truncate max-w-[150px]">
                    {{ topic.phase.split(':')[0] }}
                  </span>
                </div>
                <h5 class="font-bold text-gray-900 text-sm mb-1 leading-snug">
                  {{ topic.name }}
                </h5>
                <p v-if="topic.desc" class="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-1">
                  {{ topic.desc }}
                </p>
              </div>
              <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span :class="topic.isOpen ? 'text-purple-700 font-bold flex items-center gap-1' : 'text-gray-400'">
                  <span v-if="topic.isOpen" class="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
                  {{ topic.isOpen ? 'กำลังเรียนในสัปดาห์นี้' : 'ตามกำหนดการสอน' }}
                </span>
                <span class="text-gray-400 font-medium">3 คาบ/สัปดาห์</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Section (Visual Progress Bar + 4 Cards + Total) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-100 rounded-2xl text-purple-700 shadow-sm">
          <PieChart class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-gray-800">เกณฑ์การให้คะแนน (Course Grading - 100 คะแนน)</h2>
          <p class="text-gray-500 text-sm">การประเมินผลสัมฤทธิ์ตามสภาพจริงตลอด 18 สัปดาห์</p>
        </div>
      </div>

      <div class="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-purple-100">
        <!-- Progress Bar Visualization -->
        <div class="flex h-12 rounded-2xl overflow-hidden mb-10 shadow-inner group">
          <div v-for="(item, index) in grading" :key="index"
            :class="[item.color, 'h-full flex items-center justify-center text-white text-sm md:text-base font-bold transition-all duration-300 hover:scale-y-110 cursor-pointer']"
            :style="{ width: `${item.score}%` }" :title="item.name">
            {{ item.score }}%
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, index) in grading" :key="index"
            class="flex flex-col gap-3 p-6 rounded-2xl border-2 border-gray-50 hover:border-purple-200 hover:bg-purple-50/40 transition-all shadow-sm group">
            <div class="flex items-center justify-between">
              <div
                :class="[item.color, 'w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg']">
                {{ item.score }}
              </div>
              <span class="text-xs font-semibold text-gray-400">คะแนนเต็ม</span>
            </div>
            <p class="font-bold text-gray-800 text-base group-hover:text-purple-900 transition-colors leading-snug">
              {{ item.name }}
            </p>
          </div>
        </div>

        <!-- Total Score Banner -->
        <div class="mt-8 pt-6">
          <div
            class="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 px-8 py-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-6 text-white transform hover:scale-[1.01] transition-transform cursor-default">
            <div class="bg-white/20 p-4 rounded-full">
              <PieChart class="w-10 h-10" />
            </div>
            <div class="text-center sm:text-left">
              <p class="text-purple-200 text-lg font-bold uppercase tracking-wider mb-1">คะแนนรวมทั้งหมดตลอดภาคเรียน</p>
              <div class="text-5xl font-black drop-shadow-md">100 <span class="text-3xl font-medium">คะแนน</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deep Lecture Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-100 rounded-2xl text-purple-700 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-gray-800">เนื้อหาบทเรียน (Lecture Content - 3 ชั่วโมง)</h2>
          <p class="text-gray-500 text-sm">บทที่ 1: ปฐมนิเทศและภาพรวมการวิเคราะห์ระบบ (Course Orientation & System
            Analysis Overview)</p>
        </div>
      </div>

      <div
        class="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-purple-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- Part 1: What is a System & POS Interactive Diagram -->
        <div>
          <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4 mb-6">
            ส่วนที่ 1: "ระบบ" (System) คืออะไร? และทำไมระบบสารสนเทศจึงเป็นหัวใจของธุรกิจ
          </h3>
          <p class="mb-4">
            ก่อนจะเริ่มออกแบบสิ่งใด เราต้องเข้าใจความหมายของคำว่า <strong>"ระบบ" (System)</strong> เสียก่อน
            ในทางเทคโนโลยีสารสนเทศ ระบบคือ <em>"กลุ่มขององค์ประกอบต่างๆ ที่ทำงานร่วมกันอย่างมีเป้าหมาย
              เพื่อบรรลุวัตถุประสงค์เดียวกัน"</em>
          </p>
          <p class="mb-6">
            ในชีวิตประจำวันของนักศึกษา ทุกสิ่งรอบตัวล้วนเป็นระบบ เช่น เมื่อเราเดินเข้า <strong>ร้านสะดวกซื้อ
              7-Eleven</strong> แล้วซื้อของ:
          </p>

          <!-- System Flow Architecture Diagram (Pure CSS/UI - No Broken Image!) -->
          <div
            class="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-slate-800 mb-8">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
              <div>
                <span class="text-purple-400 text-xs font-bold uppercase tracking-wider">Interactive Architecture
                  Flow</span>
                <h4 class="text-2xl font-black text-white">แบบจำลองสถาปัตยกรรมระบบขายหน้าร้าน (Point of Sale: POS)</h4>
              </div>
              <span
                class="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold">
                Input ➔ Process ➔ Output ➔ Feedback
              </span>
            </div>

            <!-- Flow Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">

              <!-- Step 1: Input -->
              <div
                class="bg-slate-800/80 rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between group">
                <div>
                  <div
                    class="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart class="w-6 h-6" />
                  </div>
                  <span class="text-xs text-purple-400 font-bold uppercase block mb-1">ขั้นตอนที่ 1</span>
                  <h5 class="text-lg font-bold text-white mb-2">1. Input (ข้อมูลเข้า)</h5>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    ยิงบาร์โค้ดสินค้า, รับข้อมูลยอดเงินสด, สแกน QR Code PromptPay หรือแตะบัตรสมาชิก All Member
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-500 font-mono">
                  data: { barcode: "885...", qty: 2 }
                </div>
              </div>

              <!-- Step 2: Process -->
              <div
                class="bg-slate-800/80 rounded-2xl p-5 border border-indigo-500/30 hover:border-indigo-400 transition-all flex flex-col justify-between group">
                <div>
                  <div
                    class="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    <Cpu class="w-6 h-6" />
                  </div>
                  <span class="text-xs text-indigo-400 font-bold uppercase block mb-1">ขั้นตอนที่ 2</span>
                  <h5 class="text-lg font-bold text-white mb-2">2. Process (ประมวลผล)</h5>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    ค้นหาฐานข้อมูลราคาสินค้า, คำนวณโปรโมชันลดราคา 1 แถม 1, คิดภาษีมูลค่าเพิ่ม 7%, และหักยอดคลังสินค้า
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-500 font-mono">
                  total = price * 1.07 - discount
                </div>
              </div>

              <!-- Step 3: Storage -->
              <div
                class="bg-slate-800/80 rounded-2xl p-5 border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col justify-between group">
                <div>
                  <div
                    class="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    <Database class="w-6 h-6" />
                  </div>
                  <span class="text-xs text-blue-400 font-bold uppercase block mb-1">ขั้นตอนที่ 3</span>
                  <h5 class="text-lg font-bold text-white mb-2">3. Storage (จัดเก็บ)</h5>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    บันทึกประวัติการขายลงฐานข้อมูลหลัก และซิงก์ข้อมูลขึ้น Cloud HQ สำนักงานใหญ่แบบ Real-time
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-500 font-mono">
                  INSERT INTO sales_log ...
                </div>
              </div>

              <!-- Step 4: Output -->
              <div
                class="bg-slate-800/80 rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between group">
                <div>
                  <div
                    class="w-12 h-12 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    <Receipt class="w-6 h-6" />
                  </div>
                  <span class="text-xs text-emerald-400 font-bold uppercase block mb-1">ขั้นตอนที่ 4</span>
                  <h5 class="text-lg font-bold text-white mb-2">4. Output (ผลลัพธ์)</h5>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    พิมพ์ใบเสร็จรับเงิน, ลิ้นชักเงินสดเด้งเปิด, หน้าจอลูกค้าแสดงคะแนนสะสม และเสียงแจ้งเตือน "ขอบคุณค่ะ"
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-500 font-mono">
                  status: SUCCESS (200 OK)
                </div>
              </div>

            </div>

            <!-- Feedback Loop -->
            <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span class="flex items-center gap-2">
                <RefreshCw class="w-4 h-4 text-purple-400 animate-spin-slow" />
                <strong>Feedback Loop:</strong> ข้อมูลยอดขายจะถูกนำไปวิเคราะห์เพื่อสั่งเติมสินค้าที่ใกล้หมดโดยอัตโนมัติ
              </span>
              <span class="text-slate-500 hidden sm:inline">Enterprise POS Architecture</span>
            </div>
          </div>

          <!-- Real POS System Showcase (Local High-res Image) -->
          <div class="bg-purple-50/60 rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span class="px-3 py-1 bg-purple-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider">
                  ภาพตัวอย่างระบบจริง (Real-World Case Study)
                </span>
                <h4 class="text-2xl font-black text-purple-950 mt-2">
                  อุปกรณ์จริงของระบบขายหน้าร้าน (Point of Sale Hardware & Software)
                </h4>
              </div>
              <span
                class="text-xs text-purple-700 font-semibold bg-white px-3 py-1.5 rounded-full border border-purple-200 shadow-xs">
                ตัวอย่างการทำงานแบบ Input ➔ Process ➔ Output
              </span>
            </div>

            <!-- Image with interactive overlays -->
            <div class="rounded-2xl overflow-hidden shadow-lg border border-purple-200 relative group">
              <img src="/img/ooad/pos_system.jpg" alt="ระบบขายหน้าร้าน POS ในชีวิตประจำวัน"
                class="w-full h-auto max-h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500" />
              <div
                class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                <p class="font-bold text-lg mb-1 flex items-center gap-2">
                  <CheckCircle class="w-5 h-5 text-emerald-400" />
                  จุดเชื่อมต่อในระบบจริง: สแกนเนอร์บาร์โค้ด (Input) ➔ หน้าจอสัมผัส POS (Process) ➔ เครื่องพิมพ์ใบเสร็จ &
                  ลิ้นชักเงินสด (Output)
                </p>
                <p class="text-xs text-purple-200/90 leading-relaxed">
                  นักวิเคราะห์ระบบ (SA) ต้องสำรวจอุปกรณ์ฮาร์ดแวร์เหล่านี้และออกแบบซอฟต์แวร์ให้เชื่อมต่อกับอุปกรณ์ต่างๆ
                  ได้อย่างถูกต้องและรวดเร็ว
                </p>
              </div>
            </div>
          </div>

          <!-- Data vs Information & 5 Components of Information System -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Data vs Information -->
            <div class="p-6 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-3">
              <h4 class="text-lg font-black text-purple-950 flex items-center gap-2">
                <Database class="w-5 h-5 text-purple-600" />
                ความแตกต่างระหว่าง "ข้อมูล (Data)" กับ "สารสนเทศ (Information)"
              </h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                หัวใจของการทำระบบคอมพิวเตอร์ คือการเปลี่ยน <strong>"ข้อมูลดิบ"</strong> ให้กลายเป็น
                <strong>"สารสนเทศที่มีคุณค่า"</strong>:
              </p>
              <div class="space-y-2 text-xs">
                <div class="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span class="font-bold text-purple-900 flex items-center gap-1.5 mb-0.5">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    ข้อมูล (Data):
                  </span>
                  <span class="text-gray-600">ข้อเท็จจริงดิบที่ยังไม่ผ่านการประมวลผล เช่น ตัวเลขบาร์โค้ด
                    <code>8850123...</code>, ยอดเงิน <code>45</code> บาท, เวลา <code>12:30</code></span>
                </div>
                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span class="font-bold text-emerald-900 flex items-center gap-1.5 mb-0.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                    สารสนเทศ (Information):
                  </span>
                  <span class="text-gray-600">ข้อมูลที่ผ่านการประมวลผล จัดหมวดหมู่ และวิเคราะห์แล้ว เช่น
                    <em>"วันนี้ยอดขายชานมไข่มุกรวม 150 แก้ว เป็นสินค้าขายดีอันดับ 1 ในช่วงพักเที่ยง"</em>
                    เจ้าของร้านสามารถนำไปใช้วางแผนสั่งของล่วงหน้าได้</span>
                </div>
              </div>
            </div>

            <!-- 5 Components of Information System -->
            <div class="p-6 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-3">
              <h4 class="text-lg font-black text-indigo-950 flex items-center gap-2">
                <Server class="w-5 h-5 text-indigo-600" />
                5 องค์ประกอบของระบบสารสนเทศ (CBIS)
              </h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                ระบบสารสนเทศไม่ได้มีแค่คอมพิวเตอร์ แต่ประกอบด้วย 5 ส่วนที่ต้องทำงานสอดประสานกัน:
              </p>
              <ul class="text-xs text-gray-700 space-y-1.5 pl-1">
                <li class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span><strong>ฮาร์ดแวร์ (Hardware):</strong> เครื่องคอมพิวเตอร์, เซิร์ฟเวอร์, สแกนเนอร์,
                    เครื่องพิมพ์</span>
                </li>
                <li class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span><strong>ซอฟต์แวร์ (Software):</strong> แอปพลิเคชันและโปรแกรมที่เขียนขึ้นเพื่อสั่งการ</span>
                </li>
                <li class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span><strong>บุคลากร (Peopleware):</strong> ผู้ใช้งาน, เจ้าของร้าน, นักวิเคราะห์ระบบ,
                    โปรแกรมเมอร์</span>
                </li>
                <li class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">4</span>
                  <span><strong>ข้อมูล (Data):</strong> ข้อเท็จจริงเกี่ยวกับสินค้า ลูกค้า และธุรกรรมการเงิน</span>
                </li>
                <li class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">5</span>
                  <span><strong>ขั้นตอนการปฏิบัติงาน (Procedures):</strong> กฎระเบียบและวิธีใช้งานระบบที่ชัดเจน</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Part 2: Software Applications in Business & Everyday Systems -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4 mb-4">
            ส่วนที่ 2: ซอฟต์แวร์แอปพลิเคชันในธุรกิจ (Software Applications in Business)
          </h3>
          <p class="mb-6">
            ในยุคดิจิทัล ธุรกิจทุกประเภทไม่ว่าจะเล็กหรือใหญ่ ต่างจำเป็นต้องนำ <strong>Software Application</strong>
            เข้ามาช่วยในการบริหารจัดการ เพื่อลดความผิดพลาด เพิ่มความเร็ว และสร้างความประทับใจให้แก่ลูกค้า มาดูตัวอย่าง
            <strong>3 ระบบใกล้ตัว</strong> ที่นักศึกษาคุ้นเคยในชีวิตประจำวัน:
          </p>

          <!-- 3 Everyday Systems Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- System 1: Restaurant -->
            <div
              class="p-6 bg-gradient-to-b from-orange-50/70 to-white rounded-3xl border border-orange-200 shadow-sm flex flex-col justify-between">
              <div>
                <div
                  class="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md mb-4">
                  <UtensilsCrossed class="w-6 h-6" />
                </div>
                <span class="px-2.5 py-0.5 bg-orange-100 text-orange-800 font-bold text-[11px] rounded-md">ตัวอย่างที่
                  1</span>
                <h5 class="font-black text-xl text-gray-900 mt-2 mb-2">ระบบร้านอาหาร (Restaurant System)</h5>
                <p class="text-xs text-gray-600 leading-relaxed mb-4">
                  จัดการตั้งแต่ลูกค้าเข้าร้าน สั่งอาหารผ่านหน้าจอแท็บเล็ตหรือสแกน QR Code ที่โต๊ะ
                  ออเดอร์เด้งเข้าครัวทันที ออกใบเสร็จ และตัดสต็อกวัตถุดิบ
                </p>
                <div class="bg-white p-3 rounded-xl border border-orange-100 text-xs space-y-1 text-gray-700">
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-orange-600" /> รับออเดอร์อัตโนมัติ ไม่ต้องรอนาน
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-orange-600" /> ห้องครัวปรุงอาหารตามคิวแม่นยำ
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-orange-600" /> คำนวณเงินและค่าอาหารไม่ผิดพลาด
                  </div>
                </div>
              </div>
            </div>

            <!-- System 2: Library -->
            <div
              class="p-6 bg-gradient-to-b from-blue-50/70 to-white rounded-3xl border border-blue-200 shadow-sm flex flex-col justify-between">
              <div>
                <div
                  class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-4">
                  <Library class="w-6 h-6" />
                </div>
                <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-[11px] rounded-md">ตัวอย่างที่
                  2</span>
                <h5 class="font-black text-xl text-gray-900 mt-2 mb-2">ระบบห้องสมุดวิทยาลัย (Library System)</h5>
                <p class="text-xs text-gray-600 leading-relaxed mb-4">
                  จัดการหนังสือ ยืม-คืนด้วยบาร์โค้ด ตรวจสอบสถานะว่าหนังสือเล่มนี้อยู่บนชั้นใด มีผู้ยืมไปหรือไม่
                  พร้อมคำนวณค่าปรับเกินกำหนดอัตโนมัติ
                </p>
                <div class="bg-white p-3 rounded-xl border border-blue-100 text-xs space-y-1 text-gray-700">
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-blue-600" /> ค้นหาหนังสือได้รวดเร็วตามชื่อ/หมวด
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-blue-600" /> ยืม-คืนด้วยการยิงบาร์โค้ดใน 5 วินาที
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-blue-600" /> แจ้งเตือนคืนหนังสือผ่านระบบออนไลน์
                  </div>
                </div>
              </div>
            </div>

            <!-- System 3: Dormitory -->
            <div
              class="p-6 bg-gradient-to-b from-emerald-50/70 to-white rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
              <div>
                <div
                  class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-4">
                  <Building2 class="w-6 h-6" />
                </div>
                <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-md">ตัวอย่างที่
                  3</span>
                <h5 class="font-black text-xl text-gray-900 mt-2 mb-2">ระบบหอพักนักศึกษา (Dormitory System)</h5>
                <p class="text-xs text-gray-600 leading-relaxed mb-4">
                  บันทึกข้อมูลผู้พักอาศัย บันทึกหน่วยมิเตอร์ค่าน้ำ-ค่าไฟ คำนวณบิลค่าเช่าห้องอัตโนมัติ
                  พร้อมส่งใบแจ้งหนี้ให้ผู้เช่าและบันทึกหลักฐานการชำระเงิน
                </p>
                <div class="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-1 text-gray-700">
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600" /> คำนวณค่าน้ำ-ไฟอัตโนมัติ ไม่ต้องกดเครื่องคิดเลข
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600" /> ออกบิลค่าเช่าห้องเป็นไฟล์ PDF ชัดเจน
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600" /> ตรวจสอบห้องว่างและห้องค้างชำระได้ทันที
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison: Manual System vs Software Application -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div
              class="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-800 flex items-center justify-between">
              <span>ตารางเปรียบเทียบ: การทำงานแบบเดิม (Manual) VS การใช้ระบบซอฟต์แวร์แอปพลิเคชัน</span>
              <span class="text-xs text-purple-700 font-medium">ทำไมธุรกิจต้องเปลี่ยนผ่านสู่ระบบสารสนเทศ?</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th class="p-3 w-1/4">มิติการดำเนินงาน</th>
                    <th class="p-3 w-3/8 text-rose-700 bg-rose-50/50">ระบบเดิม (จดมือ / เอกสารกระดาษ)</th>
                    <th class="p-3 w-3/8 text-emerald-700 bg-emerald-50/50">ระบบซอฟต์แวร์ (Software Application)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td class="p-3 font-bold text-gray-900">1. ความรวดเร็วในการบริการ</td>
                    <td class="p-3 text-rose-800">ช้า ต้องเดินจด ค้นหาเอกสารในตู้เสียเวลานาน</td>
                    <td class="p-3 text-emerald-800">รวดเร็ว ค้นหาข้อมูลและออกบิลได้ในไม่กี่วินาที</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-gray-900">2. ความถูกต้องแม่นยำ</td>
                    <td class="p-3 text-rose-800">เสี่ยงต่อ Human Error เช่น คิดเงินผิด จดเลขอ่านไม่ออก</td>
                    <td class="p-3 text-emerald-800">แม่นยำสูง ระบบคอมพิวเตอร์คำนวณตามสูตรที่ตั้งไว้</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-gray-900">3. ความปลอดภัยของข้อมูล</td>
                    <td class="p-3 text-rose-800">กระดาษสูญหาย ฉีกขาด ปลวกกิน น้ำท่วมเสียหายง่าย</td>
                    <td class="p-3 text-emerald-800">จัดเก็บลงฐานข้อมูล ปลอดภัย มีระบบสำรองข้อมูล (Backup)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-gray-900">4. การดูรายงานและตัดสินใจ</td>
                    <td class="p-3 text-rose-800">ต้องรอสิ้นเดือนเพื่อรวมสมุดบัญชี สรุปยอดขายช้า</td>
                    <td class="p-3 text-emerald-800">ดู Dashboard ยอดขายและรายงานสถิติได้แบบ Real-time ทันที</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Part 3: Business Problems & Business Requirements -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4 mb-4">
            ส่วนที่ 3: ปัญหาและความต้องการทางธุรกิจ (Business Problems & Business Requirements)
          </h3>
          <p class="mb-6">
            จำไว้เสมอว่า <strong>"ไม่มีซอฟต์แวร์ใดเกิดขึ้นโดยไม่มีเหตุผล"</strong> ทุกการสร้างระบบเริ่มต้นจาก
            <strong>ปัญหา (Problem)</strong> หรือ <strong>โอกาสในการปรับปรุงธุรกิจ (Business Opportunity)</strong> เสมอ:
          </p>

          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- Business Problems -->
            <div class="p-6 bg-rose-50/70 border border-rose-200 rounded-3xl space-y-4">
              <div class="flex items-center gap-2 text-rose-700">
                <AlertCircle class="w-6 h-6" />
                <h4 class="text-xl font-bold text-rose-950">1. ปัญหาทางธุรกิจ (Business Problems)</h4>
              </div>
              <p class="text-xs text-gray-700 leading-relaxed">
                อุปสรรคหรือความยากลำบากที่เกิดขึ้นในการดำเนินงานประจำวัน ซึ่งสร้างความเสียหายหรือเสียโอกาสแก่ธุรกิจ
                เช่น:
              </p>
              <ul class="text-xs text-gray-700 space-y-2">
                <li class="flex items-start gap-2">
                  <XCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>คิวยาว ลูกค้ารอนาน:</strong> ในช่วงเวลาเร่งด่วน พนักงานรับออเดอร์ไม่ทัน
                    ลูกค้ายกเลิกและเปลี่ยนใจไปร้านอื่น</span>
                </li>
                <li class="flex items-start gap-2">
                  <XCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>ยอดสต็อกไม่ตรง:</strong> ของในโกดังหมดแต่ไม่รู้ตัว ทำให้ต้องปฏิเสธลูกค้า
                    หรือสั่งของซ้ำซ้อนจนของเน่าเสีย</span>
                </li>
                <li class="flex items-start gap-2">
                  <XCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>การทุจริตหรือเงินหาย:</strong> การรับเงินสดโดยไม่มีระบบบันทึก
                    ตรวจสอบยอดเงินทอนกับยอดขายได้ยาก</span>
                </li>
              </ul>
            </div>

            <!-- Business Requirements -->
            <div class="p-6 bg-purple-50/70 border border-purple-200 rounded-3xl space-y-4">
              <div class="flex items-center gap-2 text-purple-700">
                <Target class="w-6 h-6" />
                <h4 class="text-xl font-bold text-purple-950">2. ความต้องการทางธุรกิจ (Business Requirements)</h4>
              </div>
              <p class="text-xs text-gray-700 leading-relaxed">
                เป้าหมายหรือสภาพที่เจ้าของธุรกิจต้องการให้เกิดขึ้น เพื่อแก้ปัญหาข้างต้นและทำให้กิจการเติบโตขึ้น เช่น:
              </p>
              <ul class="text-xs text-gray-700 space-y-2">
                <li class="flex items-start gap-2">
                  <Target class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>ต้องการลดเวลารอคิว:</strong>
                    ให้ลูกค้าสามารถสั่งอาหารและชำระเงินด้วยตนเองได้ในเวลาไม่เกิน 2 นาที</span>
                </li>
                <li class="flex items-start gap-2">
                  <Target class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>ต้องการระบบตัดสต็อกอัตโนมัติ:</strong> เมื่อขายสินค้าออกไป 1 ชิ้น
                    ระบบต้องตัดยอดคงเหลือทันที และแจ้งเตือนเมื่อใกล้หมด</span>
                </li>
                <li class="flex items-start gap-2">
                  <Target class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>ต้องการความโปร่งใสทางการเงิน:</strong> บันทึกยอดขายทุกออเดอร์ลงระบบ และรองรับการสแกนจ่าย
                    QR Code ไร้เงินสด</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Part 4: Overview of System Analysis & Design Process -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4 mb-4">
            ส่วนที่ 4: ภาพรวมกระบวนการวิเคราะห์และออกแบบระบบ (System Analysis & Design Process)
          </h3>
          <p class="mb-6">
            เมื่อธุรกิจมีปัญหาและความต้องการ จึงต้องมีผู้เชี่ยวชาญเข้ามาทำหน้าที่สำรวจ วิเคราะห์ และออกแบบระบบขึ้นมา
            บุคคลนั้นคือ <strong>นักวิเคราะห์ระบบ (System Analyst: SA)</strong>
          </p>

          <!-- System Analyst Role Banner -->
          <div
            class="p-6 md:p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl text-white shadow-lg mb-8 flex flex-col md:flex-row items-center gap-6">
            <div
              class="w-16 h-16 rounded-2xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center shrink-0">
              <Compass class="w-9 h-9" />
            </div>
            <div>
              <h4 class="text-xl font-black text-white mb-2">นักวิเคราะห์ระบบ (System Analyst: SA) คือใคร?</h4>
              <p class="text-sm text-purple-200/90 leading-relaxed">
                SA เปรียบเสมือน <strong>"สถาปนิกผู้ออกแบบบ้าน"</strong> หรือ <strong>"ล่ามคนกลาง"</strong>
                ที่ทำหน้าที่รับฟังความต้องการจากเจ้าของธุรกิจและผู้ใช้งาน (ซึ่งพูดภาษาธุรกิจ) แล้วนำมาเรียบเรียง
                วิเคราะห์ ออกแบบเป็น <strong>"พิมพ์เขียวระบบ (System Blueprint / UML)"</strong>
                เพื่อส่งมอบให้โปรแกรมเมอร์ (ช่างก่อสร้าง) นำไปเขียนโค้ดได้อย่างถูกต้องแม่นยำ ไม่ต้องเสียเวลาเดาใจกัน
              </p>
            </div>
          </div>

          <!-- 4 Main Steps of SA Workflow -->
          <h4 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Layers class="w-5 h-5 text-purple-600" />
            4 ขั้นตอนหลักของกระบวนการวิเคราะห์และออกแบบระบบ
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              class="p-5 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 transition-all shadow-xs">
              <div
                class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center mb-3">
                1</div>
              <h5 class="font-bold text-gray-900 text-sm mb-1">ทำความเข้าใจปัญหา (Understand Problem)</h5>
              <p class="text-xs text-gray-500 leading-relaxed">พูดคุยกับเจ้าของธุรกิจ ศึกษาขั้นตอนการทำงานปัจจุบัน
                เพื่อระบุว่าจุดติดขัดอยู่ที่ใด</p>
            </div>

            <div
              class="p-5 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 transition-all shadow-xs">
              <div
                class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-3">
                2</div>
              <h5 class="font-bold text-gray-900 text-sm mb-1">สำรวจและรวบรวมข้อมูล (Fact-Finding)</h5>
              <p class="text-xs text-gray-500 leading-relaxed">สัมภาษณ์ผู้ใช้ สังเกตการณ์หน้างาน ออกแบบแบบสอบถาม
                (จะเรียนเจาะลึกในสัปดาห์ที่ 2)</p>
            </div>

            <div
              class="p-5 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 transition-all shadow-xs">
              <div
                class="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center mb-3">
                3</div>
              <h5 class="font-bold text-gray-900 text-sm mb-1">วิเคราะห์และสรุปความต้องการ (Requirements Analysis)</h5>
              <p class="text-xs text-gray-500 leading-relaxed">จัดกลุ่มความต้องการ
                แยกแยะสิ่งที่ระบบต้องทำและเงื่อนไขความปลอดภัย (จะเรียนในสัปดาห์ที่ 3)</p>
            </div>

            <div
              class="p-5 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 transition-all shadow-xs">
              <div
                class="w-8 h-8 rounded-lg bg-fuchsia-100 text-fuchsia-700 font-bold flex items-center justify-center mb-3">
                4</div>
              <h5 class="font-bold text-gray-900 text-sm mb-1">ออกแบบแบบจำลองระบบ (System Modeling)</h5>
              <p class="text-xs text-gray-500 leading-relaxed">แปลงความต้องการเป็นพิมพ์เขียวมาตรฐาน UML เช่น Use Case,
                Class, Sequence เพื่อส่งต่อให้โปรแกรมเมอร์</p>
            </div>
          </div>

          <!-- Real Requirements & User Research Workshop Showcase (Local High-res Image) -->
          <div
            class="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span class="px-3 py-1 bg-purple-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider">
                  ภาพการปฏิบัติงานจริง (Professional Workshop)
                </span>
                <h4 class="text-2xl font-black text-purple-950 mt-2">
                  การประชุมระดมสมองวิเคราะห์ความต้องการทางธุรกิจ (Business Analysis Workshop)
                </h4>
              </div>
              <span
                class="text-xs text-purple-700 font-semibold bg-white px-3 py-1.5 rounded-full border border-purple-200 shadow-xs">
                ทักษะการทำงานเป็นทีม & การสื่อสาร
              </span>
            </div>

            <div class="rounded-2xl overflow-hidden shadow-lg border border-purple-200 relative group bg-white">
              <img src="/img/ooad/requirements_workshop.jpg" alt="ภาพการประชุมวิเคราะห์ความต้องการทางธุรกิจ"
                class="w-full h-auto max-h-[460px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-500" />
              <div
                class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                <p class="font-bold text-lg mb-1 flex items-center gap-2">
                  <CheckCircle class="w-5 h-5 text-emerald-400" />
                  กระบวนการจริงของนักวิเคราะห์ระบบ: แปลงเสียงของผู้ใช้ (User Voice)
                  เป็นข้อกำหนดทางธุรกิจบนบอร์ดร่วมกับทีม
                </p>
                <p class="text-xs text-purple-200/90 leading-relaxed">
                  การเป็นนักวิเคราะห์ระบบที่ดี ไม่ใช่แค่เก่งคอมพิวเตอร์ แต่ต้องมีทักษะการพูดคุย รับฟัง
                  และเข้าใจความต้องการของมนุษย์อย่างลึกซึ้ง
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 5: SDLC Overview & The Position of OOAD -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4 mb-4">
            ส่วนที่ 5: วงจรการพัฒนาระบบ (SDLC Overview) และตำแหน่งของ OOAD
          </h3>
          <p class="mb-6">
            ในการพัฒนาซอฟต์แวร์ระดับมืออาชีพ จะมีกระบวนการดำเนินงานอย่างเป็นขั้นตอนตามมาตรฐานสากลที่เรียกว่า
            <strong>วงจรชีวิตการพัฒนาระบบ (Software Development Life Cycle: SDLC)</strong>:
          </p>

          <!-- SDLC Process Infographic Image -->
          <div
            class="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white rounded-3xl p-6 md:p-8 border border-indigo-200 shadow-sm space-y-4 mb-8">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span class="px-3 py-1 bg-indigo-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider">
                  แผนภาพกระบวนการมาตรฐาน (Standard Process Infographic)
                </span>
                <h4 class="text-2xl font-black text-indigo-950 mt-2">
                  ภาพรวมวงจรการพัฒนาระบบซอฟต์แวร์ (SDLC Process Overview)
                </h4>
              </div>
              <span
                class="text-xs text-indigo-700 font-semibold bg-white px-3 py-1.5 rounded-full border border-indigo-200 shadow-xs">
                กระบวนการทำงานต่อเนื่องแบบครบวงจร
              </span>
            </div>

            <div class="rounded-2xl overflow-hidden shadow-lg border border-indigo-200 relative group bg-white">
              <img src="/img/ooad/sdlc_cycle.jpg" alt="แผนภาพวงจรการพัฒนาระบบ SDLC Cycle"
                class="w-full h-auto max-h-[460px] object-contain object-center group-hover:scale-[1.01] transition-transform duration-500 mx-auto" />
              <div
                class="bg-indigo-950/90 p-4 md:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p class="text-sm font-medium text-indigo-100 flex items-center gap-2">
                  <Sparkles class="w-5 h-5 text-amber-400 shrink-0" />
                  <span>เห็นภาพรวมขั้นตอน: วางแผน ➔ <strong>วิเคราะห์ (Analysis) ➔ ออกแบบ (Design)</strong> ➔ พัฒนาโค้ด
                    ➔ ทดสอบ ➔ ติดตั้ง ➔ ดูแลรักษา</span>
                </p>
                <span
                  class="text-xs bg-indigo-800 text-indigo-200 px-3 py-1 rounded-lg border border-indigo-700 shrink-0">
                  SDLC Overview
                </span>
              </div>
            </div>
          </div>

          <!-- Highlight: Where does OOAD fit in SDLC? -->
          <div
            class="p-6 md:p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl shadow-xl space-y-6 mb-8">
            <div class="flex items-center gap-3 border-b border-purple-800 pb-4">
              <div
                class="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                ⭐
              </div>
              <div>
                <h4 class="text-2xl font-black text-white">วิชา OOAD อยู่ตำแหน่งใดของ SDLC?</h4>
                <p class="text-xs text-purple-200">หัวใจสำคัญของการเรียนวิชานี้ตลอด 18 สัปดาห์</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div class="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                <span class="text-purple-300 font-bold block text-xs uppercase tracking-wider">ตำแหน่งของรายวิชา</span>
                <h5 class="text-lg font-bold text-white">อยู่ในขั้นตอน Analysis & Design</h5>
                <p class="text-purple-100 text-xs leading-relaxed">
                  วิชา <strong>หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ</strong> ของเราไม่ได้สอนให้รีบเปิดโปรแกรมเขียนโค้ด
                  แต่ทำหน้าที่อยู่ใน <strong>ขั้นตอนที่ 2 (Analysis) และขั้นตอนที่ 3 (Design)</strong>
                  เพื่อสกัดความต้องการทางธุรกิจ แล้วร่างเป็นพิมพ์เขียวที่โปรแกรมเมอร์นำไปเขียนได้ทันที
                </p>
              </div>

              <div class="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                <span class="text-violet-300 font-bold block text-xs uppercase tracking-wider">เครื่องมือ &
                  แนวคิดที่ใช้</span>
                <h5 class="text-lg font-bold text-white">มองระบบเป็น "วัตถุ" + สื่อสารด้วย "UML"</h5>
                <p class="text-purple-100 text-xs leading-relaxed">
                  เราจะเปลี่ยนมุมมองจากการเขียนโปรแกรมตามลำดับฟังก์ชันแบบเดิม มามองระบบเป็น <strong>"วัตถุ
                    (Objects)"</strong> เช่น ลูกค้า, เมนูอาหาร, โต๊ะ, หนังสือ และใช้ <strong>UML (Unified Modeling
                    Language)</strong> เป็นภาษากลางภาพมาตรฐานสากลในการออกแบบ
                </p>
              </div>
            </div>
          </div>

          <!-- Why Early Analysis Matters (1:10:100 Rule) -->
          <div
            class="p-6 md:p-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl border border-purple-200 flex flex-col md:flex-row items-center gap-6">
            <div
              class="w-16 h-16 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Lightbulb class="w-8 h-8" />
            </div>
            <div>
              <h4 class="text-xl font-black text-purple-950 mb-1">กฎเหล็ก 1:10:100 —
                ทำไมวิเคราะห์และออกแบบก่อนจึงประหยัดที่สุด?</h4>
              <p class="text-sm text-gray-700 leading-relaxed">
                หากพบข้อผิดพลาดหรือเข้าใจความต้องการผิดใน <strong>ขั้นการวิเคราะห์และออกแบบ (Analysis & Design)</strong>
                ค่าใช้จ่ายในการแก้ไขคือ <strong>1 เท่า</strong> (แก้ในกระดาษหรือลบรูปในโปรแกรม)<br>
                แต่ถ้าปล่อยให้หลุดไปจนถึง <strong>ขั้นเขียนโค้ด (Implementation)</strong> จะเสียค่าใช้จ่าย <strong>10
                  เท่า</strong><br>
                และถ้าปล่อยให้หลุดไปถึงมือ <strong>ผู้ใช้งานจริง (Production)</strong> จะต้องเสียค่าใช้จ่ายสูงถึง
                <strong>100 เท่า!</strong> เพราะต้องรื้อทั้งระบบและกระทบต่อชื่อเสียงของธุรกิจ
              </p>
            </div>
          </div>
        </div>

        <!-- Part 6: Roadmap to UML Modeling & System Development -->
        <div class="pt-8 border-t border-gray-100">
          <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 class="text-2xl font-bold text-purple-950 border-l-4 border-purple-600 pl-4">
              ส่วนที่ 6: แผนที่การเดินทางสู่การสร้างแบบจำลองมาตรฐานและการพัฒนาจริง (18-Week Roadmap)
            </h3>
            <span
              class="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
              เส้นทางสู่มืออาชีพ ปวช.1/1
            </span>
          </div>
          <p class="mb-6 text-gray-700 leading-relaxed">
            ตลอดระยะเวลา 18 สัปดาห์ของการเรียนรู้วิชานี้ เราจะเดินทางร่วมกันผ่าน 4 ช่วงการเรียนรู้หลัก
            จาก <strong>"การสำรวจและวิเคราะห์ความต้องการ (Requirements)"</strong> สู่
            <strong>"แนวคิดเชิงวัตถุและแบบจำลอง UML"</strong>
            การบูรณาการระบบ จนถึงการทำ <strong>"โครงงานระบบจริง (Capstone Project)"</strong> ดังนี้:
          </p>

          <div
            class="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-6 md:p-8 rounded-3xl text-white space-y-6 shadow-xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">

              <!-- Step 1: Requirements Analysis -->
              <div
                class="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-purple-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 1 - 3</span>
                    <span
                      class="px-2 py-0.5 bg-purple-500/30 rounded text-[10px] text-purple-200 font-semibold border border-purple-400/30">Phase
                      1</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-purple-200 transition-colors">1.
                    วิเคราะห์ปัญหาและความต้องการ</h6>
                  <p class="text-purple-200 leading-relaxed pt-1">
                    สำรวจปัญหา สัมภาษณ์ผู้ใช้ สร้างแบบสอบถาม Google Forms และจัดทำข้อกำหนด Functional & Non-Functional
                    Requirements
                  </p>
                </div>
                <span class="text-[11px] text-purple-300/80 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  เอกสารข้อกำหนดความต้องการระบบ</span>
              </div>

              <!-- Step 2: OO Concepts & UML -->
              <div
                class="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-indigo-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 4 - 8</span>
                    <span
                      class="px-2 py-0.5 bg-indigo-500/30 rounded text-[10px] text-indigo-200 font-semibold border border-indigo-400/30">Phase
                      2</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-indigo-200 transition-colors">2.
                    แนวคิดเชิงวัตถุและ UML</h6>
                  <p class="text-purple-200 leading-relaxed pt-1">
                    เรียนรู้ Class/Object สร้าง Use Case Diagram, Use Case Description และ Activity Diagram ผ่าน
                    Workshop ก่อนสอบกลางภาค (Week 9)
                  </p>
                </div>
                <span class="text-[11px] text-indigo-300/80 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  แบบจำลองฟังก์ชันและกระบวนการทำงาน</span>
              </div>

              <!-- Step 3: Class Diagram & Multiplicity -->
              <div
                class="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-violet-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 10 - 11</span>
                    <span
                      class="px-2 py-0.5 bg-violet-500/30 rounded text-[10px] text-violet-200 font-semibold border border-violet-400/30">Structure</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-violet-200 transition-colors">3.
                    คลาสและความสัมพันธ์</h6>
                  <p class="text-purple-200 leading-relaxed pt-1">
                    วิเคราะห์หา Candidate Class, ออกแบบ Attribute, Operation, Visibility และระบุความสัมพันธ์
                    Association, Aggregation, Inheritance
                  </p>
                </div>
                <span class="text-[11px] text-violet-300/80 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  โครงสร้างข้อมูลและ Class Diagram สมบูรณ์</span>
              </div>

              <!-- Step 4: Sequence Diagram -->
              <div
                class="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-fuchsia-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 12</span>
                    <span
                      class="px-2 py-0.5 bg-fuchsia-500/30 rounded text-[10px] text-fuchsia-200 font-semibold border border-fuchsia-400/30">Interaction</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-fuchsia-200 transition-colors">4.
                    แผนภาพลำดับและการโต้ตอบ</h6>
                  <p class="text-purple-200 leading-relaxed pt-1">
                    แปลง Use Case Description สู่ Sequence Diagram แสดงการส่งผ่าน Messages ระหว่าง Actor และ Objects
                    ในระบบตามลำดับเวลา
                  </p>
                </div>
                <span class="text-[11px] text-fuchsia-300/80 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  การทำงานร่วมกันระหว่างวัตถุตามกาลเวลา</span>
              </div>

              <!-- Step 5: Integrated UML & Software Application -->
              <div
                class="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-pink-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 13 - 14</span>
                    <span
                      class="px-2 py-0.5 bg-pink-500/30 rounded text-[10px] text-pink-200 font-semibold border border-pink-400/30">Integration</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-pink-200 transition-colors">5. บูรณาการ UML
                    สู่การพัฒนา</h6>
                  <p class="text-purple-200 leading-relaxed pt-1">
                    ตรวจสอบความสอดคล้องของแบบจำลอง (Traceability) และประยุกต์สู่การพัฒนาซอฟต์แวร์พร้อมเลือก Tech Stack /
                    Tools ที่เหมาะสม
                  </p>
                </div>
                <span class="text-[11px] text-pink-300/80 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  สถาปัตยกรรมระบบที่สอดคล้องและเครื่องมือพัฒนา</span>
              </div>

              <!-- Step 6: Capstone Project & Showcase -->
              <div
                class="p-5 bg-gradient-to-br from-purple-800/60 to-pink-800/40 rounded-2xl border border-purple-400/40 space-y-2 hover:bg-white/20 transition-all group flex flex-col justify-between shadow-lg">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-yellow-300 font-bold text-xs uppercase tracking-wider">สัปดาห์ที่ 15 - 17</span>
                    <span
                      class="px-2 py-0.5 bg-yellow-400/30 rounded text-[10px] text-yellow-200 font-bold border border-yellow-400/40">Phase
                      4</span>
                  </div>
                  <h6 class="font-black text-white text-lg group-hover:text-yellow-200 transition-colors">6.
                    โครงงานบูรณาการและการนำเสนอ</h6>
                  <p class="text-purple-100 leading-relaxed pt-1">
                    ทำโครงงานระบบจริงเป็นทีม: จัดทำ Project Proposal, วิเคราะห์ความต้องการ, ออกแบบ UML ครบชุด
                    และนำเสนอผลงานก่อนสอบปลายภาค (Week 18)
                  </p>
                </div>
                <span class="text-[11px] text-yellow-300 font-medium pt-3 border-t border-white/10 block">ผลลัพธ์:
                  โครงงาน OOAD ผลงานวิชาชีพจริงพร้อมนำเสนอ</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Mini-Game Interactive Section -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-2xl text-purple-700 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-gray-800">Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน</h2>
            <p class="text-gray-500 text-sm mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-purple-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-purple-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่ 1</span>
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
          <div class="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2.5 rounded-xl border border-purple-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-purple-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-purple-950 leading-tight">
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
            studentWeekScores['game-1'] ? 'bg-purple-50/70 border-purple-200 text-purple-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. จำแนก Input vs Output</span>
              <span class="text-[11px] text-gray-500">เต็ม 6 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / 6` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Game 2 -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-2'] ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">2. ลำดับ 5 ขั้นตอน SDLC</span>
              <span class="text-[11px] text-gray-500">เต็ม 5 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / 5` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Post-test -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['quiz'] ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
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

      <!-- Game Mode Selector Buttons (มินิเกม -> มินิเกม -> สุดท้ายคือแบบทดสอบหลังเรียน) -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'"
          :class="['px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer', activeGame === 'sort' ? 'bg-purple-700 text-white shadow-purple-200 scale-105' : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200']">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: Input vs Output</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'order'"
          :class="['px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer', activeGame === 'order' ? 'bg-blue-600 text-white shadow-blue-200 scale-105' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200']">
          <Shuffle class="w-4 h-4" />
          <span>มินิเกมที่ 2: วงจร SDLC</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'"
          :class="['px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer', activeGame === 'quiz' ? 'bg-emerald-600 text-white shadow-emerald-200 scale-105' : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200']">
          <FileQuestion class="w-4 h-4" />
          <span>🎯 แบบทดสอบหลังเรียน (4 ชอยส์ 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: DragDrop -->
      <DragDropGame v-if="activeGame === 'sort'" 
        title="มินิเกมที่ 1: จำแนก Input vs Output ของระบบ"
        subtitle="ลากรายการการทำงานไปใส่ในกล่องให้ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-1"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialItems="dragItemsData" 
        :zones="dragZonesData" 
      />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'order'" 
        title="มินิเกมที่ 2: ลำดับ 5 ขั้นตอนในวงจร SDLC"
        subtitle="จับคู่ขั้นตอนหลักกับการกระทำที่ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)" 
        gameId="game-2"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs" 
      />

      <!-- Game 3: Final Post-test -->
      <PopQuiz v-if="activeGame === 'quiz'" 
        title="แบบทดสอบหลังเรียน (Post-test): หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดผลความรู้หลังเรียน ตอบให้ครบแล้วกดส่งคำตอบ (ทำได้ครั้งเดียวเท่านั้น)"
        gameId="quiz"
        :courseId="currentCourseId"
        :week="currentWeek"
        :questions="quizQuestions"
      />

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal
        :show="showTeacherModal"
        :courseId="currentCourseId"
        courseName="หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ"
        :week="currentWeek"
        weekTitle="สัปดาห์ที่ 1: บทนำสู่การวิเคราะห์ระบบ"
        :games="weekGames"
        @close="showTeacherModal = false"
      />
    </section>

    <!-- Assignment Section (Matching Week 1 Style) -->
    <AssignmentSection
      course-id="21900-1004"
      assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: วิเคราะห์ระบบและปัญหาทางธุรกิจ"
      :max-score="10"
    >
      <template #number>1</template>
      <template #description>
        เริ่มต้นชิ้นงานแรกของภาคเรียน: เลือกกรณีศึกษาระบบ 1 ระบบเพื่อใช้ต่อเนื่องตลอด 18 สัปดาห์
        และฝึกวิเคราะห์ปัญหา นำไปสู่การจัดทำ <strong>Problem Statement</strong>
        
        <!-- Objectives from Week_Assignment_OOAD.md -->
          <div class="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h4 class="font-bold text-purple-950 text-sm mb-2 flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-purple-600" />
              จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-purple-900">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                <span>1. อธิบายความหมายของระบบและ Software ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                <span>2. วิเคราะห์ปัญหาของระบบเดิมได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                <span>3. ระบุผู้มีส่วนเกี่ยวข้องกับระบบได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                <span>4. กำหนดกลุ่มเป้าหมายเบื้องต้นได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                <span>5. เขียน Problem Statement ได้อย่างเป็นระบบ</span>
              </div>
            </div>
          </div>

      </template>

      <template #tasks>
            <ul class="space-y-4 text-slate-700">
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div
                  class="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  1</div>
                <div>
                  <strong>ภารกิจที่ 1: ข้อมูลระบบ (System Overview)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    เลือก 1 ระบบที่พบในชีวิตประจำวันหรือระบบธุรกิจที่สนใจ (เช่น ระบบร้านอาหาร, ระบบห้องสมุด, ระบบหอพัก,
                    ร้านค้าออนไลน์ ฯลฯ) ระบุ: ชื่อระบบ, ประเภทของระบบ, วัตถุประสงค์, ผู้ใช้งาน และกลุ่มเป้าหมาย
                    <em>(แนะนำให้เลือกหัวข้อที่สนใจเพื่อใช้ต่อยอดตลอดภาคเรียน)</em>
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div
                  class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  2</div>
                <div>
                  <strong>ภารกิจที่ 2: วิเคราะห์ปัญหา (Problem Analysis Table)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    จัดทำตารางวิเคราะห์ปัญหาของระบบเดิมอย่างน้อย 3 ประเด็น โดยแจกแจงเป็น 3 ส่วน ได้แก่ <strong>[ ปัญหา |
                      สาเหตุ | ผลกระทบ ]</strong>
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div
                  class="w-6 h-6 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  3</div>
                <div>
                  <strong>ภารกิจที่ 3: ผู้มีส่วนเกี่ยวข้องกับระบบ (Stakeholders Table)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    จัดทำตารางระบุกลุ่มบุคคลหรือหน่วยงานที่เกี่ยวข้องกับการใช้งานระบบอย่างน้อย 3 กลุ่ม โดยระบุ <strong>[
                      บุคคล/กลุ่ม | หน้าที่ | ความต้องการ ]</strong>
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div
                  class="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  4</div>
                <div>
                  <strong>ภารกิจที่ 4: แถลงการณ์สรุปปัญหา (Problem Statement)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    เขียนเรียบเรียงสรุปว่า ระบบปัจจุบันมีปัญหาอะไร ใครได้รับผลกระทบ
                    และเหตุใดจึงควรพัฒนาระบบใหม่เพื่อแก้ไขปัญหาดังกล่าว (ความยาวประมาณ 4-6 บรรทัด)
                  </p>
                </div>
              </li>
            </ul>

            <!-- PDF Example Button -->
            <div
              class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <FileText class="w-4 h-4 text-rose-600" /> ต้องการดูตัวอย่างการเขียนใบงานที่ 1?
                </h5>
                <p class="text-xs text-gray-500 mt-0.5">
                  กดเปิดดูตัวอย่างการเขียนใบงานที่ 1 ฉบับสมบูรณ์ (รูปแบบเอกสารมาตรฐานทางการ ขนาด A4)
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <button @click="showPdfModal = true"
                  class="px-5 py-3 rounded-2xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
                  <FileText class="w-4 h-4" />
                  เปิดดูตัวอย่างใบงาน (PDF Preview)
                </button>
              </div>
            </div>
      </template>
    </AssignmentSection>

    <!-- Reusable PDF Viewer Modal for Assignment 1 -->
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="ใบงานที่_1_วิเคราะห์ระบบและปัญหาทางธุรกิจ_ปวช1.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)"
      footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 (Assignment Format)"
    >
      <!-- Official Worksheet Header -->
      <div class="border-b-2 border-black pb-3 text-center space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 1: วิเคราะห์ระบบและปัญหาทางธุรกิจ
        </h2>
        <p class="text-xs text-gray-800 font-semibold">
          (System & Business Problem Analysis)
        </p>
        <p class="text-xs text-gray-700">
          รายวิชา หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ (รหัสวิชา 21900-1004)
        </p>
        <p class="text-[11px] text-gray-600">
          หลักสูตรประกาศนียบัตรวิชาชีพ (ปวช.) พุทธศักราช 2567 สาขาวิชาเทคโนโลยีสารสนเทศ
        </p>
      </div>

      <!-- Student Meta Line (Simple Format) -->
      <div
        class="py-2 text-xs sm:text-sm text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
        <span><strong>ชื่อ-นามสกุล</strong> ..........นายสมชาย ใจดี............</span>
        <span><strong>รหัส</strong> .....67209010001........</span>
        <span><strong>ชั้น</strong> .....ปวช.1/1 ทส.........</span>
      </div>

      <!-- Instructions -->
      <div class="bg-gray-100 p-2.5 rounded border border-gray-300 text-xs text-gray-800">
        <strong>คำชี้แจง:</strong> ให้นักศึกษาเลือกกรณีศึกษาระบบธุรกิจที่สนใจ 1 ระบบ เพื่อวิเคราะห์ข้อมูล ปัญหา
        ผู้มีส่วนเกี่ยวข้อง และจัดทำ Problem Statement โดยชิ้นงานนี้จะนำไปใช้ต่อยอดในสัปดาห์ถัดไปตลอดภาคเรียน
      </div>

      <!-- 1: ข้อมูลระบบ -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          1. ข้อมูลระบบ (System Overview)
        </h4>
        <div class="text-xs text-gray-800 space-y-1">
          <p><strong>ชื่อระบบ:</strong> ระบบจัดการร้านอาหารและสั่งอาหารผ่าน QR Code (Smart Restaurant Order System)</p>
          <p><strong>ประเภทของระบบ:</strong> ระบบสารสนเทศการจัดการงานบริการและขายหน้าร้าน (Point of Sale & Order Management)</p>
          <p><strong>ระบบนี้มีไว้เพื่ออะไร:</strong> เพื่อจัดการรับคำสั่งซื้ออาหารจากโต๊ะลูกค้าโดยตรง ส่งเข้าห้องครัว และสรุปยอดชำระเงินอัตโนมัติ</p>
          <p><strong>ใครเป็นผู้ใช้งาน:</strong> ลูกค้าที่มารับประทานอาหาร, พนักงานเสิร์ฟ, พ่อครัวในห้องครัว, แคชเชียร์ และผู้จัดการร้าน</p>
          <p><strong>กลุ่มเป้าหมายคือใคร:</strong> ร้านอาหารขนาดกลางถึงใหญ่ที่มีผู้ใช้บริการหนาแน่น และต้องการลดระยะเวลาการรอคอยของลูกค้า</p>
        </div>
      </div>

      <!-- 2: วิเคราะห์ปัญหา (Table) -->
      <div class="space-y-1.5 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          2. วิเคราะห์ปัญหาของระบบเดิม (Problem Analysis)
        </h4>
        <table class="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="border border-gray-400 p-1.5 text-left w-1/3">ปัญหา (Problem)</th>
              <th class="border border-gray-400 p-1.5 text-left w-1/3">สาเหตุ (Cause)</th>
              <th class="border border-gray-400 p-1.5 text-left w-1/3">ผลกระทบ (Impact)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 p-1.5 align-top">1. ออเดอร์ตกหล่น หรือส่งอาหารผิดโต๊ะ</td>
              <td class="border border-gray-400 p-1.5 align-top">พนักงานจดด้วยกระดาษ ลายมืออ่านยาก และใบสั่งอาหารปลิวสูญหาย</td>
              <td class="border border-gray-400 p-1.5 align-top">ลูกค้ารอนาน ได้อาหารไม่ตรงตามสั่ง เกิดความไม่พอใจ ร้านเสียต้นทุน</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 align-top">2. คิวสั่งอาหารและคิดเงินล่าช้าในช่วงคนแน่น</td>
              <td class="border border-gray-400 p-1.5 align-top">ช่วงพักเที่ยงพนักงานบริการไม่เพียงพอต่อจำนวนโต๊ะ</td>
              <td class="border border-gray-400 p-1.5 align-top">โต๊ะหมุนเวียนช้า ลูกค้าปฏิเสธไม่รอ เสียโอกาสในการขาย</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 align-top">3. วัตถุดิบหมดกะทันหันขณะปรุง</td>
              <td class="border border-gray-400 p-1.5 align-top">ไม่มีการเชื่อมโยงยอดขายเข้ากับสต็อกวัตถุดิบแบบเรียลไทม์</td>
              <td class="border border-gray-400 p-1.5 align-top">ต้องปฏิเสธและคืนเงินลูกค้า เสียความเชื่อมั่นของร้านค้า</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3: ผู้มีส่วนเกี่ยวข้อง (Table) -->
      <div class="space-y-1.5 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          3. ผู้มีส่วนเกี่ยวข้องกับระบบ (Stakeholders)
        </h4>
        <table class="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="border border-gray-400 p-1.5 text-left w-1/4">บุคคล / กลุ่ม (Stakeholder)</th>
              <th class="border border-gray-400 p-1.5 text-left w-1/3">หน้าที่ (Role)</th>
              <th class="border border-gray-400 p-1.5 text-left">ความต้องการต่อระบบ (Needs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">ลูกค้า (Customers)</td>
              <td class="border border-gray-400 p-1.5 align-top">สั่งอาหารและชำระค่าบริการ</td>
              <td class="border border-gray-400 p-1.5 align-top">สแกน QR สั่งอาหารได้เองจากโต๊ะ ดูรูปภาพ-ราคาชัดเจน และติดตามสถานะได้</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold align-top">แผนกครัว (Kitchen Staff)</td>
              <td class="border border-gray-400 p-1.5 align-top">ปรุงอาหารตามคำสั่งซื้อ</td>
              <td class="border border-gray-400 p-1.5 align-top">รับออเดอร์ผ่านหน้าจอห้องครัว (Kitchen Display) ตามลำดับคิวโดยไม่ต้องใช้กระดาษ</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">เจ้าของร้าน (Shop Owner)</td>
              <td class="border border-gray-400 p-1.5 align-top">บริหารร้านและสรุปยอด</td>
              <td class="border border-gray-400 p-1.5 align-top">ดูรายงานยอดขายแบบเรียลไทม์ และแจ้งเตือนสต็อกวัตถุดิบใกล้หมดเพื่อสั่งซื้อล่วงหน้า</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4: Problem Statement -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          4. แถลงการณ์สรุปปัญหา (Problem Statement)
        </h4>
        <div class="p-3 bg-purple-50/70 border border-purple-200 rounded text-xs text-gray-800 leading-relaxed">
          "ระบบการบริหารจัดการร้านอาหารในปัจจุบัน ประสบปัญหาสำคัญด้านความล่าช้าและความผิดพลาดจากการจดบันทึกคำสั่งซื้อด้วยกระดาษ ส่งผลกระทบโดยตรงต่อลูกค้าที่ต้องรอนานและได้รับอาหารไม่ตรงตามสั่ง โดยเฉพาะในช่วงเวลาเร่งด่วนที่พนักงานบริการไม่เพียงพอ ทำให้ร้านสูญเสียโอกาสทางธุรกิจและสร้างความไม่พึงพอใจแก่ลูกค้า นอกจากนี้ยังขาดการเชื่อมโยงข้อมูลยอดขายกับสต็อกวัตถุดิบแบบเรียลไทม์ ทำให้เกิดปัญหารายการอาหารหมดกะทันหัน ดังนั้น จึงมีความจำเป็นอย่างยิ่งที่จะต้องพัฒนา <strong>'ระบบจัดการร้านอาหารและสั่งอาหารผ่าน QR Code'</strong> เพื่อช่วยให้ลูกค้าสั่งอาหารได้ด้วยตนเองอย่างถูกต้อง รวดเร็ว ลดภาระงานของพนักงาน และช่วยให้ผู้บริหารร้านมีข้อมูลที่แม่นยำในการตัดสินใจทางธุรกิจ"
        </div>
      </div>
    </AssignmentPdfModal>

  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
