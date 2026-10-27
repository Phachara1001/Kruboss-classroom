<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  BookOpen, PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Code, Settings, Sparkles, BarChart3, LineChart,
  TrendingUp, RefreshCw, FileCheck, CheckCircle2, ChevronLeft, Eye, HelpCircle, Clock, Edit3,
  Trophy, Lock, FileSpreadsheet, AlertCircle, Coffee
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

const router = useRouter()

// Current Course & Week context
const currentCourseId = '31901-2012'
const currentWeek = 1

// Modal States
const showPdfModal = ref(false)
const showSubmitModal = ref(false)
const showTeacherModal = ref(false)

// Grading Criteria Data (เหมือนกับวิชาอื่นๆ: 20 - 40 - 20 - 20 รวม 100)
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-sky-400' },
  { name: 'คะแนนเก็บ (ใบงานและการปฏิบัติการ)', score: 40, color: 'bg-sky-500' },
  { name: 'สอบกลางภาค (Midterm Practical)', score: 20, color: 'bg-blue-600' },
  { name: 'สอบปลายภาค (Final Presentation)', score: 20, color: 'bg-cyan-700' }
]

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (บทบาทสายงานข้อมูล Data Roles)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (ระดับของการวิเคราะห์ข้อมูล)', maxScore: 5, isQuiz: false },
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

// Mini-game State
const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'

// Game 1: Drag & Drop (Data Careers / Roles)
const dragItemsData = [
  { id: 1, text: 'สร้างและดูแลระบบท่อส่งข้อมูล (Data Pipeline) และ Data Warehouse', type: 'engineer' },
  { id: 2, text: 'วิเคราะห์หาแนวโน้ม คลีนข้อมูล และสรุป Insight เพื่อช่วยผู้บริหารตัดสินใจ', type: 'analyst' },
  { id: 3, text: 'สร้างโมเดล Machine Learning ในการทำนายพฤติกรรมในอนาคต (Predictive)', type: 'scientist' },
  { id: 4, text: 'จัดการสถาปัตยกรรมฐานข้อมูลและเชื่อมโยงข้อมูลดิบให้ไหลเวียนอย่างเสถียร', type: 'engineer' },
  { id: 5, text: 'ออกแบบ Interactive Dashboard ด้วย Power BI นำเสนอผลลัพธ์ให้เข้าใจง่าย', type: 'analyst' },
  { id: 6, text: 'ใช้คณิตศาสตร์และสถิติขั้นสูงเพื่อค้นหารูปแบบที่ซับซ้อนในข้อมูลขนาดใหญ่', type: 'scientist' }
]

const dragZonesData = [
  {
    id: 'engineer',
    title: 'Data Engineer (วิศวกรข้อมูล)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากบทบาทหน้าที่ของ Data Engineer มาวางที่นี่'
  },
  {
    id: 'analyst',
    title: 'Data Analyst (นักวิเคราะห์ข้อมูล)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากบทบาทหน้าที่ของ Data Analyst มาวางที่นี่'
  },
  {
    id: 'scientist',
    title: 'Data Scientist (นักวิทยาศาสตร์ข้อมูล)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากบทบาทหน้าที่ของ Data Scientist มาวางที่นี่'
  }
]

// Game 2: Matching Game (ระดับของการวิเคราะห์ข้อมูล & ธรรมาภิบาล)
const matchLeftTerms = [
  { id: 'l1', text: '1. Descriptive Analytics', match: 'r1' },
  { id: 'l2', text: '2. Diagnostic Analytics', match: 'r2' },
  { id: 'l3', text: '3. Predictive Analytics', match: 'r3' },
  { id: 'l4', text: '4. Prescriptive Analytics', match: 'r4' },
  { id: 'l5', text: '5. Data Governance', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'วิเคราะห์เชิงพรรณนา อธิบายว่า "เกิดอะไรขึ้นในอดีต" เช่น รายงานสรุปผลยอดขายและ Dashboard' },
  { id: 'r2', text: 'วิเคราะห์เชิงวินิจฉัย เจาะลึกหาสาเหตุว่า "ทำไมสิ่งนั้นจึงเกิดขึ้น" โดยเปรียบเทียบข้อมูล' },
  { id: 'r3', text: 'วิเคราะห์เชิงพยากรณ์ คาดการณ์แนวโน้มว่า "น่าจะเกิดอะไรขึ้นต่อไปในอนาคต" ด้วยแบบจำลองสถิติ/AI' },
  { id: 'r4', text: 'วิเคราะห์เชิงแนะนำ เสนอแนะทางเลือกว่า "ควรดำเนินการอย่างไรต่อไปเพื่อให้ได้ผลลัพธ์ที่ดีที่สุด"' },
  { id: 'r5', text: 'ธรรมาภิบาลข้อมูล กรอบนโยบายกำหนดสิทธิ์ คุณภาพ ความถูกต้อง และความมั่นคงปลอดภัยของข้อมูล' }
]

// Game 3: แบบทดสอบหลังเรียน (Post-test 10 ข้อ 4 ตัวเลือก)
const quizQuestions = [
  {
    id: 1,
    question: "ข้อใดคือเป้าหมายสูงสุดของ 'การวิเคราะห์และนำเสนอข้อมูล' (Data Analysis & Visualization)?",
    options: [
      { id: 'a', text: "เพื่อสร้างกราฟิกสีสันสดใสตกแต่งรายงานเท่านั้น", isCorrect: false },
      { id: 'b', text: "เพื่อเปลี่ยนข้อมูลดิบให้เป็นข้อค้นพบ (Insights) สนับสนุนการตัดสินใจทางธุรกิจ (Data-Driven Decision Making)", isCorrect: true },
      { id: 'c', text: "เพื่อเก็บสะสมข้อมูลให้มีขนาดใหญ่ที่สุดเท่าที่จะทำได้", isCorrect: false },
      { id: 'd', text: "เพื่อลดจำนวนพนักงานและปิดกิจการแผนกต่างๆ", isCorrect: false }
    ],
    explanation: "หัวใจของการวิเคราะห์ข้อมูลไม่ใช่เพียงแค่การวาดชาร์ตสวยงาม แต่คือการกลั่นกรอง Insight เพื่อนำไปสู่การตัดสินใจ (Data-Driven Decision Making) ที่ลดความเสี่ยงทางธุรกิจ"
  },
  {
    id: 2,
    question: "ข้อใดคือความแตกต่างสำคัญระหว่างการตัดสินใจด้วยความรู้สึก (Intuition) กับการตัดสินใจด้วยข้อมูล (Data-Driven)?",
    options: [
      { id: 'a', text: "การตัดสินใจด้วยข้อมูลใช้หลักฐานเชิงประจักษ์ที่ตรวจสอบได้และช่วยลดอคติ (Bias) ส่วนการใช้ความรู้สึกตรวจสอบความถูกต้องได้ยาก", isCorrect: true },
      { id: 'b', text: "การใช้ความรู้สึกให้ผลลัพธ์แม่นยำกว่าการใช้ข้อมูลเสมอ", isCorrect: false },
      { id: 'c', text: "การตัดสินใจด้วยข้อมูลไม่ต้องใช้เวลาหรือเครื่องมือใดๆ ในการเก็บรวบรวม", isCorrect: false },
      { id: 'd', text: "การตัดสินใจด้วยข้อมูลใช้ได้กับองค์กรขนาดใหญ่เท่านั้น", isCorrect: false }
    ],
    explanation: "Data-Driven ตัดสินใจจากหลักฐานเชิงประจักษ์ (Evidence) จึงลดอคติ ตรวจสอบที่มาที่ไปได้ และวัดผลปรับปรุงได้อย่างต่อเนื่อง"
  },
  {
    id: 3,
    question: "ตามพีระมิด DIKW เมื่อเรานำข้อมูลยอดขายขนมปัง 'วันจันทร์ขายได้ 25 จาก 50 ชิ้น' มาวิเคราะห์จนพบว่า 'วันธรรมดาขายได้เพียงครึ่งเดียวแต่วันหยุดขายหมดทุกสัปดาห์' ขั้นตอนนี้จัดอยู่ในระดับใด?",
    options: [
      { id: 'a', text: "Knowledge (ความรู้ / ความเข้าใจในแบบแผนและความสัมพันธ์ของข้อมูล)", isCorrect: true },
      { id: 'b', text: "Data (ข้อมูลดิบที่ยังไม่ได้ประมวลผล)", isCorrect: false },
      { id: 'c', text: "Hardware (อุปกรณ์คอมพิวเตอร์)", isCorrect: false },
      { id: 'd', text: "Machine Code (รหัสเครื่อง)", isCorrect: false }
    ],
    explanation: "Knowledge คือระดับที่เห็นรูปแบบ (Pattern) หรือความสัมพันธ์เชิงสาเหตุ ตอบได้ว่า 'ทำไม' หรือเกิดแนวโน้มอย่างไร จากสารสนเทศที่จัดระเบียบแล้ว"
  },
  {
    id: 4,
    question: "เหตุใดองค์กรจึงนิยมนำเสนอข้อมูลด้วย Data Visualization มากกว่าตารางตัวเลขดิบ?",
    options: [
      { id: 'a', text: "เพราะสมองมนุษย์ประมวลผลการรับรู้ทางสายตา (Visual Perception) ได้เร็วกว่าการอ่านตัวเลขหลายหมื่นเท่า", isCorrect: true },
      { id: 'b', text: "เพราะกราฟมีตัวหนังสือน้อยกว่าตารางเสมอ", isCorrect: false },
      { id: 'c', text: "เพราะคอมพิวเตอร์ไม่อนุญาตให้อ่านตัวเลขดิบ", isCorrect: false },
      { id: 'd', text: "เพราะไม่ต้องใช้ข้อมูลจริงในการสร้างกราฟ", isCorrect: false }
    ],
    explanation: "สมองมนุษย์จับคู่รูปแบบ แนวโน้ม (Trends) และจุดผิดปกติ (Outliers) จากภาพและกราฟได้รวดเร็วกว่าการกวาดสายตาอ่านตัวเลขในตารางหลายสิบบรรทัด"
  },
  {
    id: 5,
    question: "ในวงจรชีวิตของการวิเคราะห์ข้อมูล (Data Analytics Lifecycle) ขั้นตอนแรกสุดที่นักวิเคราะห์ข้อมูลควรทำคืออะไร?",
    options: [
      { id: 'a', text: "ลงมือสร้าง Dashboard ทันทีโดยไม่ต้องคิด", isCorrect: false },
      { id: 'b', text: "ทำความเข้าใจปัญหาและตั้งคำถามทางธุรกิจที่ชัดเจน (Ask / Business Understanding)", isCorrect: true },
      { id: 'c', text: "ลบข้อมูลที่คิดว่าไม่สำคัญทิ้งทั้งหมด", isCorrect: false },
      { id: 'd', text: "ซื้อโปรแกรมซอฟต์แวร์ราคาแพงที่สุดมาติดตั้ง", isCorrect: false }
    ],
    explanation: "ขั้นตอนแรกคือการทำความเข้าใจบริบทและตั้งคำถามทางธุรกิจ (Ask) เพื่อให้ทราบว่าเรากำลังจะวิเคราะห์เพื่อตอบโจทย์อะไรและช่วยเหลือใคร"
  },
  {
    id: 6,
    question: "ข้อมูลประเภท 'ข้อความรีวิวสินค้าบน Social Media และคลิปวิดีโอสัมภาษณ์ลูกค้า' จัดอยู่ในกลุ่มข้อมูลประเภทใด?",
    options: [
      { id: 'a', text: "Structured Data (ข้อมูลที่มีโครงสร้างตารางชัดเจน)", isCorrect: false },
      { id: 'b', text: "Unstructured Data (ข้อมูลที่ไม่มีโครงสร้างแน่นอน)", isCorrect: true },
      { id: 'c', text: "Relational Database Data", isCorrect: false },
      { id: 'd', text: "Machine Code Binary Data", isCorrect: false }
    ],
    explanation: "ข้อความรีวิว ภาพถ่าย เสียง และคลิปวิดีโอ เป็นข้อมูลที่ไม่ได้จัดเก็บในรูปแบบแถวและคอลัมน์เหมือนตารางทั่วไป จึงจัดเป็น Unstructured Data"
  },
  {
    id: 7,
    question: "การวิเคราะห์ระดับใดที่มุ่งตอบคำถามว่า 'ทำไมสิ่งนี้จึงเกิดขึ้น' (Why did it happen?) โดยการเปรียบเทียบข้อมูลและหาสาเหตุที่แท้จริง?",
    options: [
      { id: 'a', text: "Descriptive Analytics (เชิงพรรณนา)", isCorrect: false },
      { id: 'b', text: "Diagnostic Analytics (เชิงวินิจฉัย)", isCorrect: true },
      { id: 'c', text: "Predictive Analytics (เชิงพยากรณ์)", isCorrect: false },
      { id: 'd', text: "Prescriptive Analytics (เชิงแนะนำ)", isCorrect: false }
    ],
    explanation: "Diagnostic Analytics มุ่งเน้นการเจาะลึกเพื่อหาสาเหตุของปัญหา (Root Cause Analysis) เช่น ตรวจสอบว่าทำไมยอดขายจึงลดลงในกลุ่มสินค้าบางประเภท"
  },
  {
    id: 8,
    question: "ขั้นตอน 'Data Cleaning' (การทำความสะอาดข้อมูล) มีความสำคัญสูงสุดต่อการวิเคราะห์อย่างไร?",
    options: [
      { id: 'a', text: "จัดการค่าสูญหาย (Missing Values), ข้อมูลซ้ำซ้อน และข้อผิดพลาด เพื่อให้ผลลัพธ์การวิเคราะห์มีความน่าเชื่อถือ", isCorrect: true },
      { id: 'b', text: "ลบคอลัมน์ทั้งหมดให้เหลือเพียงฟิลด์เดียว", isCorrect: false },
      { id: 'c', text: "สแกนหาไวรัสในไฟล์ข้อมูลเท่านั้น", isCorrect: false },
      { id: 'd', text: "เปลี่ยนภาษาในชุดข้อมูลให้เป็นภาษาละติน", isCorrect: false }
    ],
    explanation: "Data Cleaning ช่วยขจัดข้อมูลผิดพลาด ข้อมูลซ้ำ และช่องว่าง เพื่อป้องกันปัญหาขยะเข้าขยะออก (Garbage In, Garbage Out)"
  },
  {
    id: 9,
    question: "กฎหมาย PDPA (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล) กำหนดให้นักวิเคราะห์ข้อมูลต้องปฏิบัติตามอย่างไร?",
    options: [
      { id: 'a', text: "ห้ามใช้คอมพิวเตอร์หลังเวลา 18.00 น.", isCorrect: false },
      { id: 'b', text: "ต้องได้รับความยินยอมและปกป้องข้อมูลส่วนบุคคล (PII) ของลูกค้า เช่น ปกปิดข้อมูลระบุตัวตน (Anonymization)", isCorrect: true },
      { id: 'c', text: "บังคับให้นักวิเคราะห์ข้อมูลต้องเปิดเผยเงินเดือนของตนเองต่อสาธารณะ", isCorrect: false },
      { id: 'd', text: "ห้ามวิเคราะห์ข้อมูลที่มีมูลค่ามากกว่า 1,000 บาท", isCorrect: false }
    ],
    explanation: "PDPA กำหนดให้การเก็บและวิเคราะห์ข้อมูลส่วนบุคคล (PII) ต้องได้รับความยินยอมและมีมาตรการรักษาความปลอดภัย เช่น การทำ Masking หรือ Anonymization"
  },
  {
    id: 10,
    question: "ทักษะด้านใดของ Data Analyst ที่มีความสำคัญอย่างยิ่งในการเปลี่ยนข้อค้นพบ (Insights) ให้กลายเป็นการตัดสินใจและการลงมือทำของผู้บริหาร?",
    options: [
      { id: 'a', text: "การสื่อสารและเล่าเรื่องด้วยข้อมูล (Data Storytelling & Communication)", isCorrect: true },
      { id: 'b', text: "การเขียนภาษา Assembly ขั้นสูง", isCorrect: false },
      { id: 'c', text: "การซ่อมแซมและประกอบฮาร์ดแวร์คอมพิวเตอร์", isCorrect: false },
      { id: 'd', text: "การออกแบบวงจรอิเล็กทรอนิกส์", isCorrect: false }
    ],
    explanation: "Data Analyst ไม่เพียงแต่ต้องวิเคราะห์เป็น แต่ต้องมีทักษะ Data Storytelling เพื่อนำเสนอ Insight ที่เข้าใจง่าย ตรงประเด็น และสามารถโน้มน้าวผู้บริหารให้นำไปสู่การตัดสินใจเชิงกลยุทธ์ได้จริง"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header (Identical design to other courses) -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-sky-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-5 pointer-events-none">
        <BarChart3 class="w-[400px] h-[400px] -translate-y-20 translate-x-20 text-sky-900" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-sky-100 text-sky-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">สัปดาห์ที่
          1</span>
        <h1 class="text-4xl md:text-5xl font-bold text-sky-900 mb-4 leading-tight">
          บทนำสู่การวิเคราะห์และนำเสนอข้อมูล<br /><span class="text-3xl text-sky-700">(Introduction to Data Analytics &
            Visualization)</span></h1>
        <p class="text-gray-600 text-xl leading-relaxed">ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน
          มาตรฐานคุณวุฒิวิชาชีพนักวิเคราะห์ข้อมูล (Data Analyst ระดับ 4) วงจรชีวิตของข้อมูล และเจาะลึก 5
          มิติคุณภาพข้อมูล
          เนื้อหาทฤษฎีและปฏิบัติการ 5 ชั่วโมงเต็ม</p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Course Syllabus Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">ข้อมูลรายวิชา (Course Syllabus)</h2>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-sky-100 space-y-10">
        <!-- Course Code & Name -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-sky-600 text-white font-bold rounded-lg text-sm shadow-sm">31901-2012</span>
              <span
                class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">1-4-3</span>
              <span class="px-3 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg text-sm border border-sky-200">ระดับ
                ปวส.1</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-sky-900">การวิเคราะห์และนำเสนอข้อมูล</h3>
            <p class="text-gray-500 text-lg">Data Visualization and Analyst</p>
          </div>
          <div class="text-left md:text-right">
            <span class="text-xs text-gray-400 block">อ้างอิงมาตรฐานอาชีพ</span>
            <span class="text-sm font-bold text-gray-700">สถาบันคุณวุฒิวิชาชีพ: นักวิเคราะห์ข้อมูล (Data Analyst) ระดับ
              4</span>
          </div>
        </div>

        <!-- Course Description -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-sky-500" /> คำอธิบายรายวิชา
          </h4>
          <p
            class="text-gray-700 leading-relaxed text-lg bg-sky-50 p-6 md:p-8 rounded-xl border border-sky-100 shadow-inner">
            ศึกษาและปฏิบัติเกี่ยวกับการวิเคราะห์และนำเสนอข้อมูล วิธีการตรวจสอบความถูกต้อง ความทันสมัย ความไม่ทันสมัย
            ความเป็นปัจจุบัน ความไม่เป็นปัจจุบัน ความสมบูรณ์ และความไม่สมบูรณ์ของข้อมูล รายงานผลการตรวจสอบคุณภาพข้อมูล
            การระบุและสรุปผล การเก็บรวบรวม การวิเคราะห์สรุปผลข้อมูล
            รวมทั้งนำเสนอกระบวนการและเทคโนโลยีที่นำมาใช้เพื่อลดความเสี่ยงความปลอดภัยที่จำเป็นในการใช้ข้อมูล
            ระบุกลุ่มผู้ชมหรือความต้องการ รวมทั้งกำหนดข้อมูลที่ตอบสนองกับความต้องการผู้รับชม กรอบแนวคิด ลักษณะการนำเสนอ
            คัดเลือกภาพ เนื้อหา กราฟิกหรืออื่น ๆ ประกอบการนำเสนอข้อมูล เลือกใช้เครื่องมือสร้างภาพจากชุดข้อมูล
          </p>
        </div>

        <!-- Grid for Objectives, Competencies, Outcomes -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Objectives -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">จุดประสงค์รายวิชา</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-base flex-1">
              <li>เข้าใจเกี่ยวกับการวิเคราะห์ข้อมูล การใช้งานเครื่องมือสร้างภาพจากชุดข้อมูล และเทคโนโลยีที่เกี่ยวข้อง
              </li>
              <li>มีทักษะในการตรวจสอบข้อมูล วิเคราะห์ข้อมูล และนำเสนอข้อมูล ทักษะด้านการออกแบบประสบการณ์ของผู้ใช้งาน
                (UX)</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียด รอบคอบ รับผิดชอบ การสื่อสาร
                คิดเชิงนวัตกรรมและการทำงานเป็นทีม</li>
              <li>มีความสามารถประยุกต์การคำนวณหรือคาดการณ์ วิเคราะห์ข้อมูล เพื่อนำข้อมูลมาสนับสนุนการตัดสินใจ</li>
            </ol>
          </div>

          <!-- Competencies -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-amber-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Award class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">สมรรถนะรายวิชา</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-base flex-1">
              <li>ประมวลความรู้ เกี่ยวกับการวิเคราะห์ข้อมูลและนำเสนอข้อมูลตามหลักการ</li>
              <li>ตรวจสอบข้อมูล วิเคราะห์ข้อมูล และนำเสนอข้อมูลอย่างเป็นระบบตามหลักการ</li>
              <li>คำนวณ คาดการณ์ วิเคราะห์ แก้ไขปัญหาเฉพาะหน้าอย่างเป็นระบบตามหลักการ</li>
              <li>ถ่ายทอดความคิด ความรู้ ความเข้าใจ และเนื้อหาผ่านช่องทางต่าง ๆ ได้อย่างสร้างสรรค์</li>
              <li>ประยุกต์การคำนวณหรือคาดการณ์ วิเคราะห์ข้อมูล เพื่อนำข้อมูลมาสนับสนุนการตัดสินใจ</li>
            </ol>
          </div>

          <!-- Outcomes -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-teal-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Lightbulb class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">ผลลัพธ์การเรียนรู้ระดับรายวิชา</h4>
            </div>
            <p
              class="text-gray-600 text-base leading-relaxed flex-1 bg-teal-50/50 p-4 rounded-lg border border-teal-100/50">
              วิเคราะห์และนำเสนอข้อมูล เพื่อสนับสนุนการตัดสินใจตามหลักการ ด้วยความละเอียด รอบคอบ รับผิดชอบ
              สื่อสาร คิดเชิงนวัตกรรมและทำงานเป็นทีม
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Section (Identical format to other courses) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
          <PieChart class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เกณฑ์การให้คะแนน (Course Syllabus & Grading)</h2>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-sky-100">

        <!-- Progress Bar Visualization -->
        <div class="flex h-12 rounded-xl overflow-hidden mb-10 shadow-inner group">
          <div v-for="(item, index) in grading" :key="index"
            :class="[item.color, 'h-full flex items-center justify-center text-white text-sm md:text-base font-bold transition-all duration-300 hover:scale-y-110 cursor-pointer']"
            :style="{ width: `${item.score}%` }" :title="item.name">
            {{ item.score }}%
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, index) in grading" :key="index"
            class="flex flex-col gap-3 p-6 rounded-xl border-2 border-gray-50 hover:border-sky-200 hover:bg-sky-50/50 transition-all shadow-sm group">
            <div class="flex items-center justify-between">
              <div
                :class="[item.color, 'w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg']">
                {{ item.score }}</div>
            </div>
            <p class="font-bold text-gray-800 text-lg group-hover:text-sky-800 transition-colors">{{ item.name }}</p>
          </div>
        </div>

        <!-- Total Score Prominent Banner -->
        <div class="mt-8 pt-6">
          <div
            class="w-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-6 text-white transform hover:scale-[1.02] transition-transform cursor-default">
            <div class="bg-white/20 p-4 rounded-full">
              <PieChart class="w-10 h-10" />
            </div>
            <div class="text-center sm:text-left">
              <p class="text-sky-100 text-lg font-bold uppercase tracking-wider mb-1">คะแนนรวมทั้งหมด</p>
              <div class="text-5xl font-black drop-shadow-md">100 <span class="text-3xl font-medium">คะแนน</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content - 5 Hours)</h2>
      </div>

      <div
        class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-sky-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- Part 1 -->
        <div>
          <h3 class="text-2xl font-bold text-sky-900 border-l-4 border-sky-500 pl-4 mb-6">ส่วนที่ 1: การวิเคราะห์ข้อมูล
            (Data Analytics) และบทบาท Data Analyst</h3>
          <p class="mb-4">
            ในยุคปัจจุบัน องค์กรธุรกิจทั่วโลกได้เปลี่ยนผ่านจากการตัดสินใจโดยใช้ความรู้สึกส่วนบุคคล (Intuition-driven)
            มาสู่ <strong>การตัดสินใจโดยใช้ข้อมูลเป็นศูนย์กลาง (Data-Driven Decision Making)</strong>
            นักวิเคราะห์ข้อมูล (Data Analyst) จึงมีบทบาทสำคัญในการเปลี่ยนข้อมูลดิบให้กลายเป็น
            <strong>ข้อค้นพบที่มีคุณค่า (Actionable Insights)</strong> เพื่อตอบคำถามว่า <em>"เกิดอะไรขึ้น ทำไมจึงเกิด
              และควรตัดสินใจอย่างไรต่อไป"</em>
          </p>
          <div class="p-5 rounded-xl bg-sky-50 border border-sky-200 mb-8 flex items-start gap-3">
            <Lightbulb class="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
            <p class="text-base text-gray-700">
              <strong class="text-sky-900">นิยาม: การวิเคราะห์ข้อมูล (Data Analytics)</strong> คือ
              กระบวนการรวบรวม จัดระเบียบ ตรวจสอบ และตีความข้อมูล เพื่อค้นหารูปแบบ แนวโน้ม และความสัมพันธ์
              แล้วนำผลลัพธ์ไปใช้ <strong>สนับสนุนการตัดสินใจ</strong> ให้แม่นยำและมีเหตุผลมากขึ้น
            </p>
          </div>

          <!-- 1.1 Intuition vs Data-Driven -->
          <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target class="w-5 h-5 text-sky-600" /> 1.1 การตัดสินใจด้วยความรู้สึก VS การตัดสินใจด้วยข้อมูล
          </h4>
          <div class="grid md:grid-cols-2 gap-6 mb-10 text-base">
            <div class="p-6 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div class="flex items-center gap-2 text-rose-800 font-bold text-lg">
                <XCircle class="w-5 h-5" /> Intuition-Driven (ใช้ความรู้สึก)
              </div>
              <ul class="space-y-2 text-gray-700 list-disc pl-5">
                <li>ตัดสินใจจากประสบการณ์ ความเชื่อ หรือ "ความรู้สึกว่าน่าจะใช่"</li>
                <li>รวดเร็ว แต่ <strong>ตรวจสอบไม่ได้</strong> ว่าถูกหรือผิด</li>
                <li>มักเกิดอคติ (Bias) เช่น เชื่อในสิ่งที่ตัวเองชอบ</li>
                <li>เมื่อผิดพลาด มักไม่รู้สาเหตุ จึงแก้ไขไม่ตรงจุด</li>
              </ul>
              <div class="text-sm bg-white/70 p-3 rounded-lg border border-rose-100 text-gray-700">
                <strong class="text-rose-700">ตัวอย่าง:</strong> "ผมว่าคนแถวนี้ชอบกาแฟเข้ม สั่งเมล็ดคั่วเข้มมาเยอะๆ เลย"
              </div>
            </div>
            <div class="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div class="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <CheckCircle class="w-5 h-5" /> Data-Driven (ใช้ข้อมูล)
              </div>
              <ul class="space-y-2 text-gray-700 list-disc pl-5">
                <li>ตัดสินใจจากหลักฐานเชิงประจักษ์ (Evidence) ที่เก็บรวบรวมได้จริง</li>
                <li>ใช้เวลามากกว่า แต่ <strong>อธิบายและตรวจสอบได้</strong></li>
                <li>ลดอคติ เพราะตัวเลขบอกสิ่งที่เกิดขึ้นจริง</li>
                <li>วัดผลหลังตัดสินใจได้ และปรับปรุงต่อได้อย่างต่อเนื่อง</li>
              </ul>
              <div class="text-sm bg-white/70 p-3 rounded-lg border border-emerald-100 text-gray-700">
                <strong class="text-emerald-700">ตัวอย่าง:</strong> "ยอดขาย 3 เดือนล่าสุด ชาเขียวมัทฉะขายได้มากกว่ากาแฟเข้ม
                3 เท่า ควรลดการสั่งเมล็ดคั่วเข้มลง"
              </div>
            </div>
          </div>

          <!-- 1.2 DIKW -->
          <h4 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Layers class="w-5 h-5 text-sky-600" /> 1.2 จากข้อมูลดิบสู่การตัดสินใจ (DIKW Pyramid)
          </h4>
          <p class="mb-4 text-base">
            ข้อมูลดิบเพียงอย่างเดียวยังไม่มีประโยชน์ ต้องผ่านการจัดระเบียบและตีความเป็นลำดับขั้น
            ซึ่งเป็นหัวใจของงาน Data Analyst:
          </p>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-base">
            <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">ขั้นที่ 1</span>
              <h5 class="font-bold text-slate-900">Data (ข้อมูลดิบ)</h5>
              <p class="text-sm text-gray-600">ตัวเลขหรือข้อความที่ยังไม่มีความหมาย</p>
              <p class="text-sm text-gray-700 bg-white p-2 rounded border border-slate-100"><em>"ขนมปังเนยสด, 25,
                  จันทร์"</em></p>
            </div>
            <div class="p-5 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-800">ขั้นที่ 2</span>
              <h5 class="font-bold text-sky-900">Information (สารสนเทศ)</h5>
              <p class="text-sm text-gray-600">ข้อมูลที่จัดระเบียบแล้ว ตอบได้ว่า "อะไร เมื่อไร"</p>
              <p class="text-sm text-gray-700 bg-white p-2 rounded border border-sky-100"><em>"วันจันทร์ขายขนมปังได้ 25
                  จาก 50 ชิ้น"</em></p>
            </div>
            <div class="p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800">ขั้นที่ 3</span>
              <h5 class="font-bold text-blue-900">Knowledge (ความรู้)</h5>
              <p class="text-sm text-gray-600">เห็นรูปแบบหรือความสัมพันธ์ ตอบได้ว่า "ทำไม"</p>
              <p class="text-sm text-gray-700 bg-white p-2 rounded border border-blue-100"><em>"วันธรรมดาขายได้ครึ่งเดียว
                  แต่เสาร์-อาทิตย์ขายหมดทุกสัปดาห์"</em></p>
            </div>
            <div class="p-5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">ขั้นที่ 4</span>
              <h5 class="font-bold text-indigo-900">Wisdom / Insight (การตัดสินใจ)</h5>
              <p class="text-sm text-gray-600">นำความรู้ไปลงมือทำ ตอบได้ว่า "ควรทำอะไร"</p>
              <p class="text-sm text-gray-700 bg-white p-2 rounded border border-indigo-100"><em>"อบวันธรรมดา 25 ชิ้น
                  วันหยุด 70 ชิ้น"</em></p>
            </div>
          </div>

          <!-- 1.3 Four types of analytics -->
          <h4 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-sky-600" /> 1.3 ระดับของการวิเคราะห์ข้อมูล (4 Types of Analytics)
          </h4>
          <p class="mb-4 text-base">
            การวิเคราะห์ข้อมูลแบ่งได้ 4 ระดับ ยิ่งระดับสูงขึ้นยิ่งซับซ้อน แต่ให้คุณค่าทางธุรกิจมากขึ้น
            (วิชานี้เน้นระดับที่ 1–2 และแนะนำระดับที่ 3 เบื้องต้น)
          </p>
          <div class="overflow-x-auto mb-10">
            <table class="w-full text-base border-collapse">
              <thead>
                <tr class="bg-sky-600 text-white text-left">
                  <th class="p-3 rounded-tl-xl">ระดับ</th>
                  <th class="p-3">คำถามที่ตอบ</th>
                  <th class="p-3 rounded-tr-xl">ตัวอย่างร้าน Kopitiam Cafe</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr class="border-b border-sky-100 bg-white">
                  <td class="p-3 font-bold text-sky-800">1. Descriptive<br><span
                      class="font-normal text-sm text-gray-500">เชิงพรรณนา</span></td>
                  <td class="p-3">เกิดอะไรขึ้น? (What happened?)</td>
                  <td class="p-3">เดือนที่แล้วขายเครื่องดื่มได้ทั้งหมด 2,400 แก้ว</td>
                </tr>
                <tr class="border-b border-sky-100 bg-sky-50/50">
                  <td class="p-3 font-bold text-blue-800">2. Diagnostic<br><span
                      class="font-normal text-sm text-gray-500">เชิงวินิจฉัย</span></td>
                  <td class="p-3">ทำไมจึงเกิดขึ้น? (Why did it happen?)</td>
                  <td class="p-3">ยอดกาแฟเข้มต่ำ เพราะลูกค้าหลักเป็นนักศึกษาที่ชอบเครื่องดื่มหวาน</td>
                </tr>
                <tr class="border-b border-sky-100 bg-white">
                  <td class="p-3 font-bold text-indigo-800">3. Predictive<br><span
                      class="font-normal text-sm text-gray-500">เชิงพยากรณ์</span></td>
                  <td class="p-3">จะเกิดอะไรขึ้นต่อไป? (What will happen?)</td>
                  <td class="p-3">ช่วงสอบปลายภาค คาดว่ายอดขายช่วงเย็นจะเพิ่มขึ้น 30%</td>
                </tr>
                <tr class="bg-sky-50/50">
                  <td class="p-3 font-bold text-purple-800">4. Prescriptive<br><span
                      class="font-normal text-sm text-gray-500">เชิงแนะนำ</span></td>
                  <td class="p-3">ควรทำอย่างไร? (What should we do?)</td>
                  <td class="p-3">ควรเปิดร้านถึง 4 ทุ่มช่วงสอบ และจัดโปรชาเขียวคู่ขนมปัง</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 1.4 Data roles -->
          <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users class="w-5 h-5 text-sky-600" /> 1.4 อาชีพสายข้อมูล (Data Careers)
          </h4>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2 mb-3 text-amber-600">
                <Database class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Engineer</h4>
              </div>
              <p class="text-gray-600 text-base mb-3">
                สร้างและดูแลท่อส่งข้อมูล (Data Pipeline) จัดการ Data Warehouse เพื่อให้ข้อมูลไหลเวียนอย่างมีเสถียรภาพ
                รวดเร็ว และปลอดภัย
              </p>
              <span
                class="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md">ผู้สร้างและดูแลระบบท่อข้อมูล</span>
            </div>

            <div class="bg-sky-50 p-6 rounded-xl border-2 border-sky-400 shadow-sm relative">
              <span
                class="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-sky-600 text-white text-xs font-bold">จุดเน้นในวิชานี้</span>
              <div class="flex items-center gap-2 mb-3 text-sky-800">
                <BarChart3 class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Analyst</h4>
              </div>
              <p class="text-gray-700 text-base mb-3">
                ตรวจสอบคุณภาพ คลีนข้อมูล วิเคราะห์หาแนวโน้ม และสร้าง Dashboard
                นำเสนอเพื่อสนับสนุนการตัดสินใจของผู้บริหาร
              </p>
              <span class="text-xs font-semibold px-2.5 py-1 bg-sky-200 text-sky-900 rounded-md">ผู้กลั่นกรอง Insight
                สู่ธุรกิจ</span>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2 mb-3 text-purple-600">
                <Sparkles class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Scientist</h4>
              </div>
              <p class="text-gray-600 text-base mb-3">
                ใช้คณิตศาสตร์ สถิติขั้นสูง และโมเดล Machine Learning ในการทำนายพฤติกรรมในอนาคต (Predictive Modeling)
              </p>
              <span
                class="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md">ผู้พยากรณ์ด้วยโมเดลสถิติ</span>
            </div>
          </div>

          <!-- 1.5 Data Analyst skills -->
          <h4 class="text-xl font-bold text-gray-800 mt-10 mb-4 flex items-center gap-2">
            <Award class="w-5 h-5 text-sky-600" /> 1.5 ทักษะสำคัญของ Data Analyst
          </h4>
          <div class="grid md:grid-cols-2 gap-6 mb-10 text-base">
            <div class="p-6 rounded-xl bg-white border border-sky-200 shadow-sm">
              <h5 class="font-bold text-sky-900 text-lg mb-3 flex items-center gap-2">
                <Settings class="w-5 h-5 text-sky-600" /> Hard Skills (ทักษะด้านเทคนิค)
              </h5>
              <ul class="space-y-2 text-gray-700">
                <li class="flex gap-2"><FileSpreadsheet class="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <span><strong>Excel / Google Sheets</strong> – จัดการตาราง สูตรคำนวณ และ Pivot Table</span></li>
                <li class="flex gap-2"><Database class="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                  <span><strong>SQL</strong> – ดึงข้อมูลจากฐานข้อมูลตามเงื่อนไขที่ต้องการ</span></li>
                <li class="flex gap-2"><BarChart3 class="w-4 h-4 text-yellow-600 shrink-0 mt-1" />
                  <span><strong>Power BI / Looker Studio</strong> – สร้างกราฟและ Dashboard</span></li>
                <li class="flex gap-2"><PieChart class="w-4 h-4 text-sky-600 shrink-0 mt-1" />
                  <span><strong>สถิติพื้นฐาน</strong> – ค่าเฉลี่ย ร้อยละ การเปรียบเทียบ และแนวโน้ม</span></li>
              </ul>
            </div>
            <div class="p-6 rounded-xl bg-white border border-sky-200 shadow-sm">
              <h5 class="font-bold text-sky-900 text-lg mb-3 flex items-center gap-2">
                <Users class="w-5 h-5 text-sky-600" /> Soft Skills (ทักษะด้านความคิดและการสื่อสาร)
              </h5>
              <ul class="space-y-2 text-gray-700">
                <li class="flex gap-2"><HelpCircle class="w-4 h-4 text-sky-600 shrink-0 mt-1" />
                  <span><strong>การตั้งคำถามที่ดี</strong> – เข้าใจว่าธุรกิจต้องการรู้อะไรจริงๆ</span></li>
                <li class="flex gap-2"><Lightbulb class="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <span><strong>การคิดเชิงวิพากษ์ (Critical Thinking)</strong> – ไม่เชื่อตัวเลขทันที ตรวจสอบก่อนเสมอ</span>
                </li>
                <li class="flex gap-2"><Target class="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                  <span><strong>ความเข้าใจธุรกิจ (Business Sense)</strong> – รู้ว่าตัวเลขไหนสำคัญต่อร้าน</span></li>
                <li class="flex gap-2"><Book class="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                  <span><strong>การสื่อสาร (Data Storytelling)</strong> – อธิบายผลให้คนไม่ใช่สายข้อมูลเข้าใจ</span></li>
              </ul>
            </div>
          </div>

          <!-- 1.6 Real-world examples -->
          <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star class="w-5 h-5 text-sky-600" /> 1.6 ตัวอย่างการใช้ข้อมูลขับเคลื่อนธุรกิจในชีวิตจริง
          </h4>
          <div class="grid md:grid-cols-3 gap-6 text-base">
            <div class="p-5 rounded-xl bg-gradient-to-br from-rose-50 to-white border border-rose-200 space-y-2">
              <h5 class="font-bold text-rose-900 flex items-center gap-2">
                <Play class="w-5 h-5 text-rose-600" /> แพลตฟอร์มสตรีมมิ่ง
              </h5>
              <p class="text-gray-700 text-sm">
                เก็บข้อมูลว่าผู้ใช้ดูอะไร ดูนานแค่ไหน หยุดดูตรงไหน แล้วนำมาแนะนำหนังและซีรีส์ที่ผู้ใช้น่าจะชอบ
                ช่วยให้ผู้ใช้อยู่กับแพลตฟอร์มนานขึ้น
              </p>
            </div>
            <div class="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 space-y-2">
              <h5 class="font-bold text-emerald-900 flex items-center gap-2">
                <Server class="w-5 h-5 text-emerald-600" /> ร้านสะดวกซื้อ
              </h5>
              <p class="text-gray-700 text-sm">
                วิเคราะห์ยอดขายแต่ละสาขาตามพื้นที่และช่วงเวลา เช่น สาขาใกล้โรงเรียนสต็อกขนมและนมมากขึ้นช่วงเช้า
                สาขาใกล้ออฟฟิศสต็อกอาหารพร้อมทานช่วงกลางวัน
              </p>
            </div>
            <div class="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 space-y-2">
              <h5 class="font-bold text-amber-900 flex items-center gap-2">
                <Clock class="w-5 h-5 text-amber-600" /> แอปสั่งอาหาร
              </h5>
              <p class="text-gray-700 text-sm">
                ดูว่าช่วงเวลาและพื้นที่ใดมีคำสั่งซื้อน้อย แล้วจัดโปรโมชันส่วนลดเฉพาะช่วงนั้น
                เพื่อกระจายยอดขายและเพิ่มรายได้ให้ร้านค้า
              </p>
            </div>
          </div>
        </div>

        <!-- Part 2 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-sky-900 border-l-4 border-sky-500 pl-4 mb-6">ส่วนที่ 2: วงจรชีวิตของข้อมูล
            (Data Lifecycle: 6 ขั้นตอนหลัก)</h3>
          <p class="mb-6">
            กระบวนการทำงานของนักวิเคราะห์ข้อมูลตามมาตรฐานสากล จะดำเนินไปตามวงจรชีวิต 6 ขั้นตอน
            เพื่อให้ได้ผลการวิเคราะห์ที่ถูกต้องและนำไปใช้จริงได้ โดยแต่ละขั้นตอนจะได้เรียนเชิงลึกในสัปดาห์ต่อๆ ไป
            (ดูป้ายสัปดาห์ในแต่ละการ์ด):
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base">
            <div class="p-6 bg-white rounded-xl border border-sky-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-sky-900 text-lg">1. ASK (ตั้งคำถาม)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">สัปดาห์ 1</span>
              </div>
              <p class="text-gray-600">ทำความเข้าใจปัญหาทางธุรกิจและระบุคำถามหลักที่ต้องการคำตอบจากข้อมูล</p>
              <p class="text-sm bg-sky-50 p-3 rounded-lg text-gray-700"><strong class="text-sky-800">Kopitiam:</strong>
                "ทำไมขนมปังเหลือทิ้งทุกวันธรรมดา และควรอบวันละกี่ชิ้น?"</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-blue-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-blue-900 text-lg">2. PREPARE (เก็บรวบรวม)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">สัปดาห์ 2</span>
              </div>
              <p class="text-gray-600">รวบรวมข้อมูลจากแหล่งต่างๆ เช่น ไฟล์ CSV, Database, APIs และแบบสำรวจ</p>
              <p class="text-sm bg-blue-50 p-3 rounded-lg text-gray-700"><strong class="text-blue-800">Kopitiam:</strong>
                รวบรวมบิลขายจากเครื่อง POS 3 เดือน และสมุดจดจำนวนขนมที่อบแต่ละวัน</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-cyan-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-cyan-900 text-lg">3. PROCESS (ทำความสะอาด)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 shrink-0">สัปดาห์ 3–4</span>
              </div>
              <p class="text-gray-600">ตรวจสอบคุณภาพ ลบข้อมูลที่ซ้ำซ้อน และจัดการค่าสูญหาย (Data Cleaning)</p>
              <p class="text-sm bg-cyan-50 p-3 rounded-lg text-gray-700"><strong class="text-cyan-800">Kopitiam:</strong>
                ลบบิลที่ถูกบันทึกซ้ำ และแก้ชื่อเมนูที่สะกดไม่ตรงกันให้เป็นชื่อเดียวกัน</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-teal-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-teal-900 text-lg">4. ANALYZE (วิเคราะห์ข้อมูล)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">สัปดาห์ 5–6</span>
              </div>
              <p class="text-gray-600">คำนวณค่าสถิติ ค้นหาความสัมพันธ์ แนวโน้ม และสรุปผลด้วย Pivot Table</p>
              <p class="text-sm bg-teal-50 p-3 rounded-lg text-gray-700"><strong class="text-teal-800">Kopitiam:</strong>
                หาค่าเฉลี่ยยอดขายขนมปังแยกวันธรรมดากับวันหยุด และหาเมนูที่ขายดีที่สุด 5 อันดับ</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-indigo-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-indigo-900 text-lg">5. SHARE (สร้างภาพนำเสนอ)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 shrink-0">สัปดาห์ 8–13</span>
              </div>
              <p class="text-gray-600">สร้าง Data Visualization แดชบอร์ด (Power BI) และเล่าเรื่องด้วยข้อมูล (Data
                Storytelling)</p>
              <p class="text-sm bg-indigo-50 p-3 rounded-lg text-gray-700"><strong class="text-indigo-800">Kopitiam:</strong>
                ทำกราฟแท่งเปรียบเทียบยอดขายรายวัน ให้คุณสมศักดิ์เห็นปัญหาได้ในพริบตา</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden space-y-3">
              <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-emerald-900 text-lg">6. ACT (การนำไปตัดสินใจ)</h4>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">โปรเจกต์ปลายภาค</span>
              </div>
              <p class="text-gray-600">ผู้บริหารนำข้อเสนอแนะและข้อค้นพบไปวางแผนกลยุทธ์แก้ไขปัญหาจริง</p>
              <p class="text-sm bg-emerald-50 p-3 rounded-lg text-gray-700"><strong class="text-emerald-800">Kopitiam:</strong>
                ปรับการอบขนมปังตามวัน แล้วติดตามผลว่าของเสียลดลงจริงหรือไม่</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-base">
            <RefreshCw class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p class="text-gray-700">
              <strong class="text-amber-900">ทำไมเรียกว่า "วงจร"?</strong> เพราะเมื่อถึงขั้น ACT แล้ว
              ผลลัพธ์จากการตัดสินใจจะกลายเป็นข้อมูลชุดใหม่ และมักทำให้เกิดคำถามใหม่ (กลับไปขั้น ASK อีกครั้ง)
              เช่น หลังปรับการอบขนมปังแล้ว คุณสมศักดิ์อาจถามต่อว่า "ควรเพิ่มเมนูขนมใหม่ในวันหยุดไหม?"
            </p>
          </div>

          <!-- 2.1 Why visualize -->
          <h4 class="text-xl font-bold text-gray-800 mt-10 mb-2 flex items-center gap-2">
            <Eye class="w-5 h-5 text-sky-600" /> 2.1 ทำไมต้องนำเสนอข้อมูลด้วยภาพ (Why Data Visualization?)
          </h4>
          <p class="mb-4 text-base">
            สมองมนุษย์รับรู้ภาพได้เร็วกว่าตัวเลขในตารางมาก ลองเปรียบเทียบข้อมูลยอดขายขนมปังเนยสด (อบวันละ 50 ชิ้น)
            ของร้าน Kopitiam ใน 1 สัปดาห์ ที่แสดงในรูปแบบตารางและกราฟ:
          </p>
          <div class="grid md:grid-cols-2 gap-6 mb-4 text-base">
            <div class="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <p class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileSpreadsheet class="w-5 h-5 text-emerald-600" /> แบบตาราง
              </p>
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-gray-100 text-gray-700">
                    <th class="border border-gray-200 p-2 text-left">วัน</th>
                    <th class="border border-gray-200 p-2 text-right">ขายได้ (ชิ้น)</th>
                    <th class="border border-gray-200 p-2 text-right">เหลือทิ้ง (ชิ้น)</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr v-for="d in [['จันทร์', 24], ['อังคาร', 26], ['พุธ', 25], ['พฤหัสบดี', 23], ['ศุกร์', 28], ['เสาร์', 50], ['อาทิตย์', 50]]"
                    :key="d[0]">
                    <td class="border border-gray-200 p-2">{{ d[0] }}</td>
                    <td class="border border-gray-200 p-2 text-right">{{ d[1] }}</td>
                    <td class="border border-gray-200 p-2 text-right">{{ 50 - d[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col">
              <p class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart3 class="w-5 h-5 text-sky-600" /> แบบกราฟแท่ง
              </p>
              <div class="flex-1 flex items-end justify-between gap-2 h-56 border-b-2 border-l-2 border-gray-300 px-2 pt-4">
                <div v-for="d in [['จ.', 24], ['อ.', 26], ['พ.', 25], ['พฤ.', 23], ['ศ.', 28], ['ส.', 50], ['อา.', 50]]"
                  :key="d[0]" class="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span class="text-xs font-bold" :class="d[1] === 50 ? 'text-emerald-700' : 'text-rose-600'">{{ d[1]
                    }}</span>
                  <div class="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                    :class="d[1] === 50 ? 'bg-emerald-500' : 'bg-rose-400'" :style="{ height: `${d[1] * 1.7}%` }"></div>
                </div>
              </div>
              <div class="flex justify-between gap-2 px-2 pt-1 text-xs text-gray-500">
                <span v-for="d in ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.']" :key="d" class="flex-1 text-center">{{ d
                  }}</span>
              </div>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-sky-50 border border-sky-200 text-base text-gray-700 flex items-start gap-3">
            <Lightbulb class="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <p>
              <strong class="text-sky-900">สังเกต:</strong> จากกราฟเราเห็นทันทีว่า <strong>วันหยุดขายหมด
                แต่วันธรรมดาขายได้แค่ครึ่งเดียว</strong> ขณะที่ตารางต้องไล่อ่านตัวเลขทีละแถว
              นี่คือพลังของ Data Visualization ซึ่งเราจะเรียนหลักการเลือกกราฟอย่างละเอียดในสัปดาห์ที่ 8
            </p>
          </div>

          <!-- 2.2 Course roadmap -->
          <h4 class="text-xl font-bold text-gray-800 mt-10 mb-4 flex items-center gap-2">
            <ListOrdered class="w-5 h-5 text-sky-600" /> 2.2 เส้นทางการเรียนรู้ตลอดภาคเรียน (Course Roadmap)
          </h4>
          <div class="grid md:grid-cols-3 gap-6 text-base">
            <div class="p-6 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">สัปดาห์ 1–6</span>
              <h5 class="font-bold text-sky-900 text-lg">Phase 1: Data Analysis</h5>
              <p class="text-sm text-gray-600">ตอบให้ได้ว่า <em>"ข้อมูลนี้มีคุณภาพไหม และกำลังบอกอะไรเรา?"</em></p>
              <p class="text-sm text-gray-700">เก็บข้อมูล → ตรวจคุณภาพ → คลีนข้อมูล → วิเคราะห์และหา Insight</p>
              <p class="text-xs font-semibold text-sky-700 pt-1">สัปดาห์ 7: สอบกลางภาค (Practical)</p>
            </div>
            <div class="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">สัปดาห์ 8–12</span>
              <h5 class="font-bold text-indigo-900 text-lg">Phase 2: Visualization &amp; Dashboard</h5>
              <p class="text-sm text-gray-600">ตอบให้ได้ว่า <em>"จะสื่อสารสิ่งที่ข้อมูลบอกให้เข้าใจง่ายได้อย่างไร?"</em></p>
              <p class="text-sm text-gray-700">เลือกกราฟ → สร้าง Dashboard (Power BI) → ออกแบบตามผู้ใช้ → คาดการณ์</p>
            </div>
            <div class="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">สัปดาห์ 13–15</span>
              <h5 class="font-bold text-emerald-900 text-lg">Phase 3: Storytelling &amp; Project</h5>
              <p class="text-sm text-gray-600">ตอบให้ได้ว่า <em>"ควรตัดสินใจอย่างไรจากข้อมูลนี้?"</em></p>
              <p class="text-sm text-gray-700">เล่าเรื่องด้วยข้อมูล → พัฒนาโปรเจกต์ → นำเสนอปลายภาค</p>
            </div>
          </div>

          <!-- Key takeaways -->
          <div
            class="mt-10 p-6 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg space-y-3 text-base">
            <p class="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 class="w-6 h-6" /> สรุปสาระสำคัญประจำสัปดาห์ (Key Takeaways)
            </p>
            <ul class="space-y-1.5 list-disc pl-6 text-sky-50">
              <li>การตัดสินใจด้วยข้อมูล (Data-Driven) ช่วยลดความเสี่ยงและอคติจากการใช้ความรู้สึก</li>
              <li>ข้อมูลดิบต้องผ่านการจัดระเบียบและตีความ (Data → Information → Knowledge → Insight) จึงมีคุณค่า</li>
              <li>การวิเคราะห์มี 4 ระดับ: Descriptive, Diagnostic, Predictive และ Prescriptive</li>
              <li>Data Analyst ต้องมีทั้งทักษะเทคนิคและทักษะการสื่อสาร เพื่อเปลี่ยนข้อมูลเป็น Insight ให้ผู้บริหาร</li>
              <li>งานวิเคราะห์ทุกชิ้นดำเนินตามวงจร 6 ขั้น: Ask → Prepare → Process → Analyze → Share → Act</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Mini-Games & Interactive Lab Section (Identical design to other courses) -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน
            </h2>
            <p class="text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10
              คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-900 to-blue-900 hover:from-sky-800 hover:to-blue-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-sky-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-sky-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่
              1</span>
            <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
              <span>สถานะ:</span>
              <span v-if="studentNorm.isAllCompleted"
                class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ ทำครบทุกกิจกรรมแล้ว (3/3)
              </span>
              <span v-else-if="studentNorm.completedCount > 0"
                class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⏳ กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
              </span>
              <span v-else
                class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                ยังไม่ได้เริ่มทำ
              </span>
            </div>
          </div>

          <!-- Total Normalized Score (Scaled to 10) -->
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-2.5 rounded-xl border border-sky-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-sky-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-sky-950 leading-tight">
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
            studentWeekScores['game-1'] ? 'bg-sky-50/70 border-sky-200 text-sky-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. บทบาทสายงานข้อมูล</span>
              <span class="text-[11px] text-gray-500">เต็ม 6 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / 6` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Game 2 -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-2'] ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">2. ระดับการวิเคราะห์ข้อมูล</span>
              <span class="text-[11px] text-gray-500">เต็ม 5 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / 5` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Post-test -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['quiz'] ? 'bg-cyan-50/70 border-cyan-200 text-cyan-900' : 'bg-gray-50 border-gray-200 text-gray-600'
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

      <!-- Game Tabs (มินิเกม -> มินิเกม -> สุดท้ายคือแบบทดสอบหลังเรียน) -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort' ? 'bg-sky-600 text-white shadow-lg scale-105' : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: บทบาทสายงานข้อมูล</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: ระดับการวิเคราะห์ข้อมูล</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>กิจกรรมสุดท้าย: แบบทดสอบหลังเรียน (Post-test 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop (Data Careers / Roles) -->
      <DragDropGame v-if="activeGame === 'sort'" :course-id="currentCourseId" :week="currentWeek" game-id="game-1"
        game-title="เกมลากวาง: จำแนกบทบาทสายงานข้อมูล (Data Roles)"
        title="ลากแล้ววาง: จำแนกบทบาทสายงานข้อมูล (Data Roles)"
        subtitle="ลากลักษณะงานและหน้าที่ด้านล่างไปใส่กล่องอาชีพสายงานข้อมูลให้ถูกต้องครบทั้ง 3 สายงาน!"
        :initialItems="dragItemsData" :zones="dragZonesData" />

      <!-- Game 2: Matching Game -->
      <MatchingGame v-if="activeGame === 'match'" :course-id="currentCourseId" :week="currentWeek" game-id="game-2"
        game-title="เกมจับคู่: ระดับของการวิเคราะห์ข้อมูล (Types of Analytics)"
        title="ระดับของการวิเคราะห์ข้อมูล & ธรรมาภิบาล"
        subtitle="จับคู่ระดับการวิเคราะห์ข้อมูลทางธุรกิจด้านซ้าย กับนิยามและวัตถุประสงค์ด้านขวาให้ถูกต้องครบ 5 คู่"
        :initialLeftTerms="matchLeftTerms" :initialRightDefs="matchRightDefs" />

      <!-- Game 3: Pop Quiz (Post-test) -->
      <PopQuiz v-if="activeGame === 'quiz'" :course-id="currentCourseId" :week="currentWeek" game-id="quiz"
        game-title="แบบทดสอบหลังเรียน Week 1 (Data Analytics & Visualization)"
        title="แบบทดสอบหลังเรียน: สัปดาห์ที่ 1 (Data Analytics)"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจรอบด้าน ทำได้เพียงครั้งเดียวเท่านั้น"
        :questions="quizQuestions">
        <template #actions>
          <RouterLink to="/courses"
            class="px-8 py-4 bg-sky-500 border-2 border-sky-400 text-white font-bold rounded-xl hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- Assignment Section (Identical design to other courses) -->
    <!-- Assignment Section (Identical design to other courses) -->
    <AssignmentSection course-id="31901-2012" assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: การสำรวจบทบาท Data Analyst และการขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making)"
      :max-score="10">
      <template #number>1</template>
      <template #description>
        <div class="space-y-4">
          <p class="text-slate-700 leading-relaxed text-sm sm:text-base">
            ให้นักศึกษาสวมบทบาทเป็น <strong>Data Analyst (นักวิเคราะห์ข้อมูล)</strong>
            เพื่อศึกษาและวิเคราะห์กรณีศึกษาของร้านกาแฟและเบเกอรี่ <em>"Kopitiam Cafe"</em>
            ที่กำลังประสบปัญหาขาดทุนจากการตัดสินใจด้วยความรู้สึกส่วนบุคคล (Intuition-driven)
            และประยุกต์ใช้วงจรชีวิตข้อมูล (Data Lifecycle) เพื่อช่วยให้ผู้บริหารเปลี่ยนผ่านสู่
            <strong>การขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making)</strong>
          </p>

          <!-- Business Scenario Box -->
          <div
            class="p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-sky-50 to-blue-50 border border-amber-200/80 shadow-2xs">
            <div class="flex items-start gap-3.5">
              <div
                class="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Coffee class="w-6 h-6" />
              </div>
              <div class="space-y-2 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="font-black text-slate-900 text-base sm:text-lg">กรณีศึกษาโจทย์: ร้านกาแฟ & เบเกอรี่
                    "Kopitiam Cafe"</h4>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/70 text-amber-900">โจทย์วิเคราะห์ประจำสัปดาห์</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong>สถานการณ์:</strong> <em>คุณสมศักดิ์</em> เปิดร้านกาแฟและเบเกอรี่มาได้ 1 ปี
                  แต่ปัจจุบันกำลังเผชิญกับ <strong>สภาวะขาดทุนต่อเนื่องและมีวัตถุดิบเน่าเสียเหลือทิ้งจำนวนมาก</strong>
                  เนื่องจากตลอดระยะเวลาที่ผ่านมา คุณสมศักดิ์บริหารร้านโดย <strong>"ใช้ความรู้สึกและสัญชาตญาณส่วนตัว
                    (Intuition / Gut Feeling)"</strong> เช่น:
                </p>

                <!-- Cartoon Illustration Card -->
                <div
                  class="w-[1000px] h-auto mx-auto rounded-2xl overflow-hidden border border-amber-200/80 shadow-sm bg-white">
                  <img src="/img/somsak_cafe_trouble.jpg" alt="กรณีศึกษา: คุณสมศักดิ์และร้าน Kopitiam Cafe"
                    class="block w-full h-auto" />
                  <div
                    class="p-3 bg-amber-50/60 text-xs text-slate-600 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span class="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertCircle class="w-4 h-4 text-amber-600 shrink-0" />
                      ภาพประกอบ: ปัญหาสต็อกกาแฟคั่วเข้มค้างสต็อก เบเกอรี่เหลือทิ้ง และความต้องการจริงของลูกค้า
                    </span>
                    <span class="text-[11px] text-slate-500 italic">การบริหารโดยใช้ความรู้สึก (Intuition)
                      ขาดการเก็บและวิเคราะห์ข้อมูลจริง</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
                  <div class="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
                    <span class="font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertCircle class="w-3.5 h-3.5 text-rose-600" /> ปัญหาที่ 1: สต็อกเมล็ดกาแฟ
                    </span>
                    <p class="text-slate-600">
                      คิดเอาเองว่า <em>"คนแถวนี้ชอบกินกาแฟเข้มๆ"</em> จึงสั่งเมล็ดกาแฟคั่วเข้มมาตุนไว้เยอะมาก
                      แต่ความจริงลูกค้าแถวนั้นส่วนใหญ่เป็นวัยรุ่นและนักศึกษาที่ชอบดื่ม <strong>ชาเขียวมัทฉะ ชาไทย
                        และกาแฟนมหวานน้อย</strong> ทำให้เมล็ดกาแฟคั่วเข้มค้างสต็อกจนหมดอายุ
                    </p>
                  </div>
                  <div class="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
                    <span class="font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertCircle class="w-3.5 h-3.5 text-rose-600" /> ปัญหาที่ 2: เบเกอรี่เหลือทิ้ง
                    </span>
                    <p class="text-slate-600">
                      คิดเอาเองว่า <em>"ขนมปังเนยสดน่าจะขายดีทุกวัน"</em> จึงสั่งอบสดวันละ 50 ชิ้นเท่ากันทุกวัน ปรากฏว่า
                      <strong>วันธรรมดาเหลือทิ้งวันละ 25 ชิ้น</strong> แต่วันเสาร์-อาทิตย์กลับขายหมดตั้งแต่เที่ยงวัน
                      เสียโอกาสในการขายไปอย่างน่าเสียดาย
                    </p>
                  </div>
                </div>
                <div
                  class="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-sky-600 shrink-0" />
                  <span><strong>ภารกิจของคุณ:</strong> คุณสมศักดิ์ต้องการให้คุณในฐานะ <strong>Data Analyst</strong>
                    ช่วยวิเคราะห์เพื่อวางแผนเปลี่ยนผ่านร้านสู่การตัดสินใจด้วยข้อมูล
                    เพื่อลดการสูญเสียและเพิ่มยอดขาย</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Objectives -->
          <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <h4 class="font-bold text-sky-950 text-sm mb-2 flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-sky-600" />
              จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-sky-900">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>1. อธิบายบทบาทหน้าที่และความสำคัญของ Data Analyst ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>2. เปรียบเทียบความต่าง Intuition vs Data-Driven ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>3. กำหนดความต้องการข้อมูล (Data Requirements) ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>4. ประยุกต์ใช้ Data Lifecycle 6 ขั้นตอนกับธุรกิจจริงได้</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <div class="space-y-4">
          <p class="text-xs text-slate-500 font-medium">
            ให้นักศึกษาพิมพ์คำตอบลงในเอกสาร (Google Docs / Microsoft Word) หรือเขียนลงในแบบฟอร์มใบงาน
            แล้วแนบลิงก์ส่งงานด้านล่าง โดยตอบคำถาม 4 ข้อย่อยดังต่อไปนี้:
          </p>

          <ul class="space-y-4 text-slate-700">
            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div
                class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                1</div>
              <div class="space-y-1">
                <strong class="text-slate-900 text-sm">ข้อที่ 1: การตัดสินใจด้วยความรู้สึก VS การตัดสินใจด้วยข้อมูล
                  (Intuition vs Data-Driven)</strong>
                <p class="text-xs text-slate-600 leading-relaxed">
                  จากกรณีศึกษาของคุณสมศักดิ์ ให้อธิบายว่าการบริหารโดยใช้ <em>"ความรู้สึกส่วนตัว (Intuition)"</em>
                  ส่งผลเสียและความเสี่ยงต่อธุรกิจอย่างไร? และหากเปลี่ยนมาใช้ <em>"การตัดสินใจด้วยข้อมูล (Data-Driven
                    Decision Making)"</em> จะเข้ามาช่วยแก้ปัญหาการสั่งเมล็ดกาแฟและขนมปังเนยสดได้อย่างไร?
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div
                class="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                2</div>
              <div class="space-y-1">
                <strong class="text-slate-900 text-sm">ข้อที่ 2: การกำหนดความต้องการข้อมูล (Data Requirements &
                  Ask)</strong>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ในฐานะ Data Analyst เพื่อแก้ปัญหาให้ตรงจุด ให้นักศึกษาระบุ
                  <strong>ข้อมูลที่จำเป็นต้องเริ่มเก็บรวบรวมอย่างน้อย 3–4 รายการ</strong> (เช่น ข้อมูลยอดขายแยกตามเมนู,
                  ข้อมูลของเหลือทิ้งรายวันแยกระหว่างวันธรรมดาและวันหยุด, ข้อมูลช่วงเวลาพีคที่ลูกค้าเข้าร้าน)
                  พร้อมระบุเหตุผลสั้นๆ ว่าเก็บข้อมูลนั้นไปเพื่ออะไร
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div
                class="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                3</div>
              <div class="space-y-1">
                <strong class="text-slate-900 text-sm">ข้อที่ 3: การประยุกต์ใช้วงจรชีวิตข้อมูล 6 ขั้นตอน (Data
                  Lifecycle)</strong>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ให้นักศึกษาวางแผนขั้นตอนการทำงานของตนเองเพื่อกอบกู้ร้าน Kopitiam Cafe ตามขั้นตอน Data Lifecycle
                  (เขียนอธิบายสั้นๆ ขั้นละ 1–2 บรรทัด):
                </p>
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 mt-1">
                  <div><strong>1. ASK (ตั้งคำถาม):</strong> ตั้งโจทย์ธุรกิจที่ต้องการตอบ</div>
                  <div><strong>2. PREPARE (เก็บข้อมูล):</strong> แหล่งที่มาของข้อมูลที่จะใช้</div>
                  <div><strong>3. PROCESS (จัดเตรียม):</strong> ตรวจสอบความพร้อมของข้อมูล</div>
                  <div><strong>4. ANALYZE (วิเคราะห์):</strong> คำนวณและหาแนวโน้มเมนู/เวลาขายดี</div>
                  <div><strong>5. SHARE (นำเสนอ):</strong> วิธีนำเสนอข้อมูลให้เจ้าของร้านเข้าใจ</div>
                  <div><strong>6. ACT (นำไปใช้จริง):</strong> เจ้าของร้านนำผลลัพธ์ไปปรับปรุงธุรกิจ</div>
                </div>
              </div>
            </li>

            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div
                class="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                4</div>
              <div class="space-y-1">
                <strong class="text-slate-900 text-sm">ข้อที่ 4: บทบาทหน้าที่และทักษะของ Data Analyst (Role &
                  Skills)</strong>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ทำไมงานช่วยเหลือร้าน Kopitiam Cafe ครั้งนี้จึงเป็นบทบาทของ <strong>Data Analyst</strong> (แตกต่างจาก
                  Data Engineer และ Data Scientist อย่างไรตามที่เรียนในส่วนที่ 1)? และนักศึกษาคิดว่า
                  <em>"ทักษะการสื่อสารและเล่าเรื่องด้วยข้อมูล (Data Storytelling)"</em>
                  มีความสำคัญอย่างไรในการทำงานร่วมกับเจ้าของร้าน?
                </p>
              </div>
            </li>
          </ul>
        </div>

        <!-- PDF Example Button -->
        <div
          class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-sky-600" /> ต้องการดูตัวอย่างการเขียนใบงานที่ 1?
            </h5>
            <p class="text-xs text-gray-500 mt-0.5">
              กดเปิดดูตัวอย่างการเขียนใบงานที่ 1 ฉบับสมบูรณ์ (รูปแบบเอกสารมาตรฐานทางการ ขนาด A4)
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="showPdfModal = true"
              class="px-5 py-3 rounded-2xl font-bold text-sm bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
              <FileText class="w-4 h-4" />
              เปิดดูตัวอย่างใบงาน (PDF Preview)
            </button>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Assignment PDF Modal Component -->
    <AssignmentPdfModal v-model="showPdfModal" title="ใบงานที่_1_บทบาทDataAnalystและการขับเคลื่อนด้วยข้อมูล_ปวส1.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)" footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 (Assignment Format)">
      <!-- Official Worksheet Header -->
      <div class="border-b-2 border-black pb-3 text-center">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 1: การสำรวจบทบาทนักวิเคราะห์ข้อมูลและการขับเคลื่อนธุรกิจด้วยข้อมูล
        </h2>
      </div>

      <!-- Student Meta Line -->
      <div
        class="py-2 text-xs sm:text-sm text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
        <span><strong>ชื่อ-นามสกุล</strong> ..........นายสมชาย ใจดี............</span>
        <span><strong>รหัส</strong> .....67309010001........</span>
        <span><strong>ชั้น</strong> .....ปวส.1/1 ทส.........</span>
      </div>

      <!-- Instructions -->
      <div class="bg-gray-100 p-2.5 rounded border border-gray-300 text-xs text-gray-800">
        <strong>คำชี้แจง:</strong> ให้นักศึกษาวิเคราะห์กรณีศึกษาร้านกาแฟและเบเกอรี่ "Kopitiam Cafe"
        และเขียนตอบคำถามตามโครงสร้าง 4 ข้อด้านล่างนี้ลงในเอกสารส่งงาน
      </div>

      <!-- Task 1 -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          1. การตัดสินใจด้วยความรู้สึก VS การตัดสินใจด้วยข้อมูล (Intuition vs Data-Driven)
        </h4>
        <div
          class="text-xs text-gray-700 space-y-1.5 bg-amber-50/40 p-2.5 rounded border border-dashed border-amber-300">
          <p><strong>• ผลเสียจากการใช้ความรู้สึก (Intuition):</strong> <span
              class="text-gray-500 italic">[ให้นักศึกษาอธิบายผลกระทบและความเสียหายที่เกิดขึ้นกับร้าน
              จากการที่คุณสมศักดิ์ตัดสินใจสั่งวัตถุดิบตามสัญชาตญาณส่วนตัว]</span></p>
          <p><strong>• การแก้ไขด้วยข้อมูล (Data-Driven):</strong> <span
              class="text-gray-500 italic">[ให้นักศึกษาเสนอแนะว่าหากเปลี่ยนมาใช้ข้อมูลจริงในการตัดสินใจ
              จะช่วยแก้ปัญหาของค้างสต็อกและของเหลือทิ้งได้อย่างไร]</span></p>
        </div>
      </div>

      <!-- Task 2 -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          2. การกำหนดความต้องการข้อมูล (Data Requirements & Ask)
        </h4>
        <div class="text-xs text-gray-700 space-y-1.5 p-2.5 bg-gray-50 rounded border border-dashed border-gray-300">
          <p class="text-gray-600 font-medium mb-1">[ระบุข้อมูลที่จำเป็นต้องจัดเก็บอย่างน้อย 3–4 รายการ
            พร้อมระบุเหตุผลว่าเก็บข้อมูลนั้นเพื่ออะไร]:</p>
          <div class="space-y-1 pl-2">
            <p><strong>1. ข้อมูลรายการที่ 1:</strong> <span class="text-gray-500 italic">[ระบุชื่อข้อมูล] — เหตุผล:
                [อธิบายวัตถุประสงค์ในการเก็บ]</span></p>
            <p><strong>2. ข้อมูลรายการที่ 2:</strong> <span class="text-gray-500 italic">[ระบุชื่อข้อมูล] — เหตุผล:
                [อธิบายวัตถุประสงค์ในการเก็บ]</span></p>
            <p><strong>3. ข้อมูลรายการที่ 3:</strong> <span class="text-gray-500 italic">[ระบุชื่อข้อมูล] — เหตุผล:
                [อธิบายวัตถุประสงค์ในการเก็บ]</span></p>
            <p><strong>4. ข้อมูลรายการที่ 4:</strong> <span class="text-gray-500 italic">[ระบุชื่อข้อมูล] — เหตุผล:
                [อธิบายวัตถุประสงค์ในการเก็บ]</span></p>
          </div>
        </div>
      </div>

      <!-- Task 3 (Data Lifecycle Table) -->
      <div class="space-y-1.5 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          3. แผนการดำเนินงานตามวงจรชีวิตข้อมูล 6 ขั้นตอน (Data Lifecycle Plan)
        </h4>
        <table class="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="border border-gray-400 p-1.5 text-left w-1/4">ขั้นตอน Data Lifecycle</th>
              <th class="border border-gray-400 p-1.5 text-left">แนวทางการเขียนอธิบาย (Guideline)</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold">1. ASK (ตั้งคำถาม)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">
                [ระบุการตั้งคำถามและโจทย์ปัญหาหลักของร้านที่ต้องการใช้ข้อมูลมาตอบ]</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold">2. PREPARE (เก็บข้อมูล)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">[ระบุแหล่งที่มาของข้อมูลที่จะไปรวบรวม เช่น
                บิลขายหน้าร้าน, บันทึกสต็อก]</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold">3. PROCESS (จัดเตรียม)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">
                [ระบุวิธีการนำข้อมูลมาตรวจสอบความถูกต้องและจัดหมวดหมู่ก่อนใช้งาน]</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold">4. ANALYZE (วิเคราะห์)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">[ระบุการคำนวณและวิเคราะห์หาแนวโน้ม เช่น
                ยอดขายเปรียบเทียบวันธรรมดา vs วันหยุด]</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold">5. SHARE (นำเสนอ)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">[ระบุรูปแบบการสร้างชาร์ต/กราฟิกสรุปผล
                เพื่อสื่อสารให้คุณสมศักดิ์เข้าใจง่าย]</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold">6. ACT (นำไปใช้จริง)</td>
              <td class="border border-gray-400 p-1.5 text-gray-500 italic">[ระบุการนำข้อค้นพบไปสู่การลงมือปฏิบัติจริง
                เช่น
                การปรับจำนวนอบขนมปัง]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Task 4 -->
      <div class="space-y-1 pt-1 pb-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          4. บทบาทหน้าที่และทักษะของ Data Analyst (Role & Skills)
        </h4>
        <div
          class="p-2.5 bg-sky-50/50 border border-dashed border-sky-300 rounded text-xs text-gray-700 leading-relaxed space-y-1">
          <p><strong>• บทบาทหน้าที่:</strong> <span class="text-gray-500 italic">[อธิบายว่าทำไมงานนี้จึงเป็นหน้าที่ของ
              Data
              Analyst และแตกต่างจาก Data Engineer หรือ Data Scientist อย่างไร]</span></p>
          <p><strong>• ทักษะสำคัญ:</strong> <span
              class="text-gray-500 italic">[อธิบายเหตุผลว่าทำไมทักษะการสื่อสารและเล่าเรื่องด้วยข้อมูล (Data
              Storytelling)
              จึงมีความสำคัญในการโน้มน้าวเจ้าของร้าน]</span></p>
        </div>
      </div>
    </AssignmentPdfModal>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal :is-open="showTeacherModal" :course-id="currentCourseId" :week="currentWeek"
      :games="weekGames" @close="showTeacherModal = false" />

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
