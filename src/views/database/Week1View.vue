<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BookOpen, PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Clock, Trophy, Lock, FileSpreadsheet
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

// Current Course & Week context
const currentCourseId = '31901-2007'
const currentWeek = 1

// PDF Modal State
const showPdfModal = ref(false)
const showTeacherModal = ref(false)

// Grading Criteria Data
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-green-400' },
  { name: 'คะแนนเก็บ (ใบงานและแบบฝึกหัด)', score: 40, color: 'bg-green-500' },
  { name: 'สอบกลางภาค (Midterm)', score: 20, color: 'bg-emerald-600' },
  { name: 'สอบปลายภาค (Final)', score: 20, color: 'bg-teal-700' }
]

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (Data vs Information)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (ระดับข้อมูล & สถาปัตยกรรม DBMS)', maxScore: 5, isQuiz: false },
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
    question: "ข้อใดต่อไปนี้จัดว่าเป็น 'ข้อมูล (Data)' ที่แท้จริง?",
    options: [
      { id: 'a', text: "รายงานสรุปยอดขายประจำเดือนที่พิมพ์เสนอผู้บริหาร", isCorrect: false },
      { id: 'b', text: "ตัวเลข 150, 200, 350 ที่จดบันทึกไว้บนเศษกระดาษโดยยังไม่ได้ประมวลผล", isCorrect: true },
      { id: 'c', text: "กราฟแท่งเปรียบเทียบผลกำไรขาดทุนประจำปี", isCorrect: false },
      { id: 'd', text: "บทวิเคราะห์พฤติกรรมการซื้อสินค้าของผู้บริโภค", isCorrect: false }
    ],
    explanation: "ข้อมูล (Data) คือข้อเท็จจริงดิบที่ยังไม่ได้ผ่านการประมวลผล ส่วนรายงานหรือกราฟสรุปจัดเป็น 'สารสนเทศ (Information)'"
  },
  {
    id: 2,
    question: "ปัญหาใดที่มักเกิดขึ้นบ่อยที่สุดในระบบแฟ้มข้อมูลแบบดั้งเดิม (File-based System)?",
    options: [
      { id: 'a', text: "Data Redundancy (ความซ้ำซ้อนของข้อมูลที่ถูกบันทึกไว้หลายที่)", isCorrect: true },
      { id: 'b', text: "Data Encryption (การเข้ารหัสข้อมูลที่รัดกุมเกินไป)", isCorrect: false },
      { id: 'c', text: "System Overheating (เซิร์ฟเวอร์มีความร้อนสูงเกินปกติ)", isCorrect: false },
      { id: 'd', text: "Automatic Indexing (ระบบจัดทำดัชนีอัตโนมัติมากเกินไป)", isCorrect: false }
    ],
    explanation: "ในระบบแฟ้มข้อมูลดั้งเดิม ข้อมูลเดียวกันมักถูกเก็บซ้ำๆ ในหลายแผนก ทำให้เปลืองเนื้อที่และนำไปสู่ข้อมูลขัดแย้ง (Inconsistency)"
  },
  {
    id: 3,
    question: "การใช้โปรแกรม Microsoft Excel ในการเก็บข้อมูลพนักงาน ถือว่าเป็นระบบจัดการฐานข้อมูล (DBMS) หรือไม่ เพราะเหตุใด?",
    options: [
      { id: 'a', text: "เป็น เพราะ Excel สามารถเรียงลำดับและใส่สูตรคำนวณได้", isCorrect: false },
      { id: 'b', text: "ไม่เป็น เพราะ Excel เป็น Spreadsheet ขาดระบบจัดการ Transaction และการควบคุม Concurrent Access ที่ปลอดภัย", isCorrect: true },
      { id: 'c', text: "เป็น เพราะมีหน้าตาเป็นตารางแถวและคอลัมน์เหมือนกัน", isCorrect: false },
      { id: 'd', text: "ไม่เป็น เพราะ Excel ไม่สามารถบันทึกข้อความภาษาไทยได้", isCorrect: false }
    ],
    explanation: "Excel เป็น Spreadsheet ที่ออกแบบมาสำหรับคำนวณ ไม่ใช่ DBMS เพราะขาดกลไก ACID, การล็อกระดับเรคคอร์ด และการจัดการความปลอดภัยขั้นสูง"
  },
  {
    id: 4,
    question: "ใครคือผู้มีหน้าที่กำหนดโครงสร้างสถาปัตยกรรมฐานข้อมูล ดูแลสิทธิ์การเข้าถึง และการสำรอง/กู้คืนข้อมูล?",
    options: [
      { id: 'a', text: "Database Administrator (DBA - ผู้บริหารฐานข้อมูล)", isCorrect: true },
      { id: 'b', text: "End User (ผู้ใช้ระบบทั่วไป)", isCorrect: false },
      { id: 'c', text: "Hardware Technician (ช่างประกอบคอมพิวเตอร์)", isCorrect: false },
      { id: 'd', text: "Data Entry Clerk (เจ้าหน้าที่พิมพ์ดีดเอกสาร)", isCorrect: false }
    ],
    explanation: "DBA มีหน้าที่รับผิดชอบบริหารจัดการภาพรวมทั้งหมดของฐานข้อมูล รวมถึงประสิทธิภาพ ความปลอดภัย และการสำรองข้อมูล"
  },
  {
    id: 5,
    question: "ระดับการมองข้อมูล (Three-Level Architecture) ระดับใดที่ซ่อนความซับซ้อนและแสดงเฉพาะข้อมูลที่ผู้ใช้นั้นมีสิทธิ์ดู?",
    options: [
      { id: 'a', text: "Physical Level (ระดับกายภาพ)", isCorrect: false },
      { id: 'b', text: "Logical Level (ระดับตรรกะ)", isCorrect: false },
      { id: 'c', text: "View Level หรือ External Level (ระดับวิว/ภายนอก)", isCorrect: true },
      { id: 'd', text: "Storage Level (ระดับตัวแผ่นแม่เหล็ก)", isCorrect: false }
    ],
    explanation: "View Level เป็นระดับสูงสุดที่ติดต่อกับผู้ใช้ โดยสร้างมุมมองเฉพาะ (View) ให้ผู้ใช้เห็นเฉพาะส่วนที่เกี่ยวข้องกับหน้าที่ตนเอง"
  },
  {
    id: 6,
    question: "ระดับตรรกะ (Logical Level หรือ Conceptual Level) มีบทบาทหน้าที่สำคัญข้อใด?",
    options: [
      { id: 'a', text: "อธิบายว่าฐานข้อมูลเก็บข้อมูลอะไรบ้าง มี Entity ใด และมีความสัมพันธ์ (Relationship) อย่างไร", isCorrect: true },
      { id: 'b', text: "กำหนดชนิดและรอบหมุนของจานแม่เหล็กในฮาร์ดดิสก์", isCorrect: false },
      { id: 'c', text: "ออกแบบหน้าต่างกราฟิกสำหรับกดปุ่มคลิกของแอปมือถือ", isCorrect: false },
      { id: 'd', text: "คำนวณค่าไฟฟ้าของห้องแม่ข่ายคอมพิวเตอร์", isCorrect: false }
    ],
    explanation: "Logical Level เป็นระดับที่ DBA ออกแบบว่าระบบประกอบด้วยข้อมูลอะไรบ้าง มีฟิลด์ใด และเชื่อมโยงกันอย่างไร โดยไม่ขึ้นกับฮาร์ดแวร์"
  },
  {
    id: 7,
    question: "Physical Level (ระดับกายภาพ) เกี่ยวข้องกับสิ่งใดโดยตรง?",
    options: [
      { id: 'a', text: "การจัดเก็บข้อมูลจริงลงในหน่วยความจำ ฮาร์ดดิสก์ โครงสร้างไฟล์ และดัชนี (Indexing)", isCorrect: true },
      { id: 'b', text: "การตั้งชื่อหน้าจอเมนูให้กับผู้ใช้งานภายนอก", isCorrect: false },
      { id: 'c', text: "การเขียนเงื่อนไขทางธุรกิจในใบเสร็จรับเงิน", isCorrect: false },
      { id: 'd', text: "การนำเสนอข้อมูลต่อคณะกรรมการบริษัท", isCorrect: false }
    ],
    explanation: "Physical Level เป็นระดับล่างสุดที่บอกว่าข้อมูลถูกแปลงเป็นไบต์และบล็อกจัดเก็บบนสื่อบันทึกข้อมูลอย่างไร"
  },
  {
    id: 8,
    question: "คุณสมบัติ 'ความเป็นอิสระของข้อมูล' (Data Independence) มีประโยชน์อย่างไร?",
    options: [
      { id: 'a', text: "สามารถปรับเปลี่ยนโครงสร้างระดับล่างได้โดยไม่ต้องเขียนโปรแกรมประยุกต์ใหม่ทั้งหมด", isCorrect: true },
      { id: 'b', text: "ทำให้คอมพิวเตอร์ทำงานได้โดยไม่ต้องเสียบปลั๊กไฟ", isCorrect: false },
      { id: 'c', text: "อนุญาตให้ใครก็ได้ลบฐานข้อมูลทิ้งได้ตลอดเวลา", isCorrect: false },
      { id: 'd', text: "ยกเลิกระบบความปลอดภัยทั้งหมดเพื่อให้เข้าถึงได้เร็วขึ้น", isCorrect: false }
    ],
    explanation: "Data Independence แบ่งเป็น Physical และ Logical ช่วยให้การแก้โครงสร้างข้อมูลไม่กระทบโปรแกรมที่เรียกใช้งานอยู่"
  },
  {
    id: 9,
    question: "ปัญหา 'Data Inconsistency' (ความไม่สอดคล้องกันของข้อมูล) มักส่งผลเสียต่อธุรกิจอย่างไร?",
    options: [
      { id: 'a', text: "เกิดข้อมูลขัดแย้งกันในระบบ ทำให้รายงานไม่ตรงกันและไม่รู้ว่าข้อมูลชุดใดถูกต้อง", isCorrect: true },
      { id: 'b', text: "ทำให้คีย์บอร์ดพิมพ์ตัวเลขไม่ติด", isCorrect: false },
      { id: 'c', text: "ทำให้คอมพิวเตอร์ส่งเสียงแจ้งเตือนตลอดเวลา", isCorrect: false },
      { id: 'd', text: "ทำให้กระดาษพิมพ์รายงานหมดเร็วกว่าปกติ", isCorrect: false }
    ],
    explanation: "เมื่อข้อมูลซ้ำซ้อนถูกอัปเดตไม่ครบทุกจุด จะทำให้ข้อมูลแต่ละที่ขัดแย้งกัน เช่น ยอดสต็อกในบัญชีไม่ตรงกับยอดหน้าร้าน"
  },
  {
    id: 10,
    question: "ข้อใดคือข้อดีที่เด่นชัดที่สุดของการเปลี่ยนจากระบบแฟ้มข้อมูลมาเป็นระบบจัดการฐานข้อมูล (DBMS)?",
    options: [
      { id: 'a', text: "ลดความซ้ำซ้อน มีความปลอดภัยสูง ควบคุมการใช้งานพร้อมกันได้ และข้อมูลมีความถูกต้องน่าเชื่อถือ", isCorrect: true },
      { id: 'b', text: "ไม่ต้องซื้ออุปกรณ์คอมพิวเตอร์มาใช้งานอีกต่อไป", isCorrect: false },
      { id: 'c', text: "ยกเลิกการตั้งรหัสผ่านเพื่อให้ทำงานได้รวดเร็วที่สุด", isCorrect: false },
      { id: 'd', text: "บังคับให้ผู้ใช้งานทุกคนต้องเขียนภาษา SQL เป็นทุกคน", isCorrect: false }
    ],
    explanation: "DBMS ช่วยรวมศูนย์ข้อมูล ควบคุมการเข้าถึง ป้องกันความซ้ำซ้อน และรักษาความสมบูรณ์ถูกต้อง (Integrity) ของข้อมูล"
  }
]

const activeGame = ref('sort') // 'sort', 'order', 'quiz'

// Game 1: Drag & Drop (Data vs Info - 6 items, max 6)
const dragItemsData = [
  { id: 1, text: 'รายงานสรุปยอดขายประจำเดือน', type: 'info' },
  { id: 2, text: 'ตัวเลข 15, 20, 25 บนกระดาษจด', type: 'data' },
  { id: 3, text: 'รูปภาพสลิปใบเสร็จรับเงินดิบ', type: 'data' },
  { id: 4, text: 'กราฟแสดงแนวโน้มกำไรประจำปี', type: 'info' },
  { id: 5, text: 'รายชื่อลูกค้าเรียงตามยอดซื้อ', type: 'info' },
  { id: 6, text: 'อุณหภูมิที่วัดได้รายชั่วโมง', type: 'data' }
]
const dragZonesData = [
  {
    id: 'data',
    title: 'Data (ข้อมูลดิบ)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลาก Data มาวางที่นี่'
  },
  {
    id: 'info',
    title: 'Information (สารสนเทศ)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลาก Information มาวางที่นี่'
  }
]

// Game 2: Matching / โยงความสัมพันธ์ (5 pairs, max 5)
const matchLeftTerms = [
  { id: 'l1', text: 'View Level', match: 'r2' },
  { id: 'l2', text: 'Logical Level', match: 'r3' },
  { id: 'l3', text: 'Physical Level', match: 'r1' },
  { id: 'l4', text: 'Database Schema', match: 'r4' },
  { id: 'l5', text: 'Data Dictionary', match: 'r5' }
]
const matchRightDefs = [
  { id: 'r1', text: 'ระดับล่างสุดที่อธิบายว่าข้อมูลถูกจัดเก็บบนฮาร์ดดิสก์อย่างไร' },
  { id: 'r2', text: 'ระดับที่แสดงมุมมองเฉพาะของผู้ใช้แต่ละกลุ่มและซ่อนรายละเอียดความซับซ้อน' },
  { id: 'r3', text: 'ระดับที่อธิบายว่าเก็บข้อมูลอะไรและความสัมพันธ์เป็นอย่างไร (DBA ดูแล)' },
  { id: 'r4', text: 'โครงสร้างโดยรวมและการออกแบบสถาปัตยกรรมฐานข้อมูล' },
  { id: 'r5', text: 'พจนานุกรมข้อมูลที่เก็บ metadata หรือคำอธิบายโครงสร้างข้อมูลทั้งหมด' }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-green-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-5 pointer-events-none">
        <Database class="w-[400px] h-[400px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">สัปดาห์ที่
          1</span>
        <h1 class="text-4xl md:text-5xl font-bold text-green-900 mb-4 leading-tight">บทนำสู่ระบบฐานข้อมูล<br /><span
            class="text-3xl text-green-700">(Introduction to Database)</span></h1>
        <p class="text-gray-600 text-xl leading-relaxed">ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน
          และเจาะลึกพื้นฐานของข้อมูล (Data), สารสนเทศ (Information) รวมถึงวิวัฒนาการสู่ระบบฐานข้อมูล (Database System)
          เนื้อหาบรรยาย 2 ชั่วโมงเต็ม</p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Course Syllabus Section (New) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">ข้อมูลรายวิชา (Course Syllabus)</h2>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-blue-100 space-y-10">
        <!-- Course Code & Name -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-sm">31901-2007</span>
              <span
                class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">1-4-3</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-blue-900">เทคโนโลยีการจัดการฐานข้อมูล</h3>
            <p class="text-gray-500 text-lg">Database Management Technology</p>
          </div>
        </div>

        <!-- Course Description -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-blue-500" /> คำอธิบายรายวิชา
          </h4>
          <p
            class="text-gray-700 leading-relaxed text-lg bg-blue-50 p-6 md:p-8 rounded-xl border border-blue-100 shadow-inner">
            ศึกษาและปฏิบัติเกี่ยวกับการเลือกใช้เทคโนโลยีที่ใช้ในการจัดการฐานข้อมูล รูปแบบการเก็บข้อมูล (Relational,
            Non-Relational, Key-value, Document, In-memory, Polyglot Persistence) ลักษณะของ Storage Engine การใช้ View
            การใช้ Routine (Stored Procedure, Function, Event, Trigger) การใช้ Transaction การทำ Replication การซ่อมแซม
            การใช้ฐานข้อมูลสมัยใหม่
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
              <li>มีความเข้าใจในการเลือกใช้เทคโนโลยีในการจัดการฐานข้อมูล</li>
              <li>มีทักษะในการใช้เทคโนโลยีในการจัดการฐานข้อมูล</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียดรอบคอบ รับผิดชอบ การสื่อสาร
                การคิดเชิงนวัตกรรมและการทำงานเป็นทีม</li>
              <li>มีความสามารถประยุกต์ใช้เทคโนโลยีในการจัดการฐานข้อมูลให้เหมาะสมกับระบบงาน</li>
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
              <li>ประมวลความรู้เกี่ยวกับเทคโนโลยีการจัดการฐานข้อมูลตามหลักการ</li>
              <li>ใช้เทคโนโลยีในการจัดการฐานข้อมูลตามหลักการ</li>
              <li>ประยุกต์ใช้เทคโนโลยีในการจัดการฐานข้อมูลให้เหมาะสมกับระบบงาน</li>
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
              ออกแบบและบริหารฐานข้อมูลตามหลักการ ด้วยความละเอียดรอบคอบ รับผิดชอบ การสื่อสาร
              การคิดเชิงนวัตกรรมและการทำงานเป็นทีม
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-green-100 rounded-xl text-green-600 shadow-sm">
          <PieChart class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เกณฑ์การให้คะแนน (Course Syllabus & Grading)</h2>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-green-100">

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
            class="flex flex-col gap-3 p-6 rounded-xl border-2 border-gray-50 hover:border-green-200 hover:bg-green-50/50 transition-all shadow-sm group">
            <div class="flex items-center justify-between">
              <div
                :class="[item.color, 'w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg']">
                {{ item.score }}</div>
            </div>
            <p class="font-bold text-gray-800 text-lg group-hover:text-green-800 transition-colors">{{ item.name }}</p>
          </div>
        </div>

        <!-- Total Score Prominent -->
        <div class="mt-8 pt-6">
          <div
            class="w-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-6 text-white transform hover:scale-[1.02] transition-transform cursor-default">
            <div class="bg-white/20 p-4 rounded-full">
              <PieChart class="w-10 h-10" />
            </div>
            <div class="text-center sm:text-left">
              <p class="text-green-100 text-lg font-bold uppercase tracking-wider mb-1">คะแนนรวมทั้งหมด</p>
              <div class="text-5xl font-black drop-shadow-md">100 <span class="text-3xl font-medium">คะแนน</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-green-100 rounded-xl text-green-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content - 2 Hours)</h2>
      </div>

      <div
        class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-green-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- Part 1 -->
        <div>
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-6">ส่วนที่ 1: ข้อมูล (Data)
            vs สารสนเทศ (Information)</h3>
          <p class="mb-4">
            สิ่งแรกที่เราต้องแยกให้ออกก่อนที่จะศึกษาเรื่องฐานข้อมูล คือความแตกต่างระหว่าง ข้อมูล และ สารสนเทศ
            หลายคนมักใช้สองคำนี้สลับกัน แต่ในทางวิทยาการคอมพิวเตอร์และระบบสารสนเทศ
            มันมีความหมายและลำดับชั้นที่ต่างกันชัดเจน ตามแนวคิด <strong>DIKW Pyramid (Data, Information, Knowledge,
              Wisdom)</strong>
          </p>

          <div class="grid md:grid-cols-2 gap-8 mt-6">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2 mb-3 text-green-700">
                <Database class="w-6 h-6" />
                <h4 class="text-xl font-bold">ข้อมูล (Data)</h4>
              </div>
              <p class="text-gray-600 mb-4">คือ ข้อเท็จจริง ตัวเลข ตัวอักษร สัญลักษณ์ หรือรูปภาพ
                ที่ยังไม่ได้ผ่านกระบวนการประมวลผลใดๆ
                ข้อมูลดิบเหล่านี้ยังไม่มีความหมายในตัวมันเองเพียงพอที่จะนำไปใช้ตัดสินใจได้</p>
              <div class="bg-white p-4 rounded border border-gray-100 text-sm">
                <strong>ตัวอย่าง:</strong>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li>ตัวเลข: 15, 20, 100, 350</li>
                  <li>ข้อความ: "สมชาย", "ขาย", "มกราคม"</li>
                  <li>รายการบันทึกอุณหภูมิแต่ละวันโดยยังไม่หาค่าเฉลี่ย</li>
                </ul>
              </div>
            </div>

            <div class="bg-green-50 p-6 rounded-xl border border-green-200">
              <div class="flex items-center gap-2 mb-3 text-green-800">
                <FileText class="w-6 h-6" />
                <h4 class="text-xl font-bold">สารสนเทศ (Information)</h4>
              </div>
              <p class="text-gray-600 mb-4">คือ ข้อมูลที่ผ่านกระบวนการประมวลผล (Processing) การจัดรูปแบบ การคำนวณ
                หรือการสรุปผลแล้ว ทำให้มีความหมายและสามารถนำไปใช้ประกอบการตัดสินใจได้</p>
              <div class="bg-white p-4 rounded border border-green-100 text-sm">
                <strong>ตัวอย่าง:</strong>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li>รายงานยอดขายเฉลี่ยประจำเดือนมกราคมคือ 350 ชิ้น</li>
                  <li>กราฟแสดงแนวโน้มอุณหภูมิที่สูงขึ้นในสัปดาห์นี้</li>
                  <li>สลิปเงินเดือนที่คำนวณภาษีและประกันสังคมแล้ว</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-6">ส่วนที่ 2:
            ปัญหาของระบบแฟ้มข้อมูลดั้งเดิม (File-Based System)</h3>
          <p class="mb-6">
            ก่อนที่จะมีระบบฐานข้อมูล (Database System) องค์กรต่างๆ จัดเก็บข้อมูลในรูปแบบแฟ้มข้อมูล (File-based system)
            เช่น การบันทึกลงสมุด, การใช้แฟ้มเอกสารกระดาษ, หรือแม้กระทั่งการใช้โปรแกรม Spreadsheet (เช่น Excel)
            แยกกันในแต่ละแผนก ระบบแบบนี้ก่อให้เกิดปัญหาใหญ่หลายประการเมื่อข้อมูลมีขนาดใหญ่ขึ้น:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-base">
            <div
              class="p-6 bg-white rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <h4 class="font-bold text-red-800 mb-2 text-lg">1. Data Redundancy</h4>
              <p class="text-gray-600"><strong>(ความซ้ำซ้อนของข้อมูล)</strong> ข้อมูลเดียวกันถูกจัดเก็บไว้หลายที่ เช่น
                แผนกบุคคลมีข้อมูลที่อยู่พนักงาน แผนกบัญชีก็มีข้อมูลที่อยู่พนักงานคนเดียวกัน
                ทำให้สิ้นเปลืองพื้นที่จัดเก็บ</p>
            </div>

            <div
              class="p-6 bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <h4 class="font-bold text-orange-800 mb-2 text-lg">2. Data Inconsistency</h4>
              <p class="text-gray-600"><strong>(ความขัดแย้งของข้อมูล)</strong> เป็นผลพวงมาจากความซ้ำซ้อน
                หากพนักงานย้ายบ้าน แล้วแจ้งแก้ที่แผนกบุคคล แต่ไม่ได้แก้ที่แผนกบัญชี
                ทำให้ข้อมูลขัดแย้งกันและไม่รู้ว่าอันไหนคือข้อมูลจริง</p>
            </div>

            <div
              class="p-6 bg-white rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <h4 class="font-bold text-yellow-800 mb-2 text-lg">3. Data Isolation</h4>
              <p class="text-gray-600"><strong>(ความโดดเดี่ยวของข้อมูล)</strong>
                ข้อมูลถูกเก็บแยกกันคนละไฟล์หรือคนละฟอร์แมต ทำให้การนำข้อมูลจากหลายๆ ไฟล์มาประมวลผลร่วมกันทำได้ยากมาก</p>
            </div>

            <div
              class="p-6 bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
              <h4 class="font-bold text-blue-800 mb-2 text-lg">4. Integrity Problems</h4>
              <p class="text-gray-600"><strong>(ปัญหาความถูกต้องของข้อมูล)</strong> การควบคุมเงื่อนไข (Constraints)
                ทำได้ยาก เช่น การบังคับให้ยอดเงินในบัญชีต้องไม่ติดลบ ในระบบไฟล์ต้องเขียนโค้ดเช็คเองทุกครั้ง</p>
            </div>

            <div
              class="p-6 bg-white rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-purple-400"></div>
              <h4 class="font-bold text-purple-800 mb-2 text-lg">5. Security Problems</h4>
              <p class="text-gray-600"><strong>(ปัญหาด้านความปลอดภัย)</strong> การกำหนดสิทธิ์เข้าถึง (Access Control)
                ทำได้ยาก ไม่สามารถระบุได้ว่าให้พนักงาน A ดูได้เฉพาะคอลัมน์เงินเดือน แต่ห้ามดูคอลัมน์โบนัส เป็นต้น</p>
            </div>

            <div
              class="p-6 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
              <h4 class="font-bold text-gray-800 mb-2 text-lg">6. Concurrent Access</h4>
              <p class="text-gray-600"><strong>(ปัญหาการเข้าใช้งานพร้อมกัน)</strong>
                หากมีผู้ใช้หลายคนเปิดไฟล์เดียวกันเพื่อแก้ไขพร้อมๆ กัน อาจทำให้ข้อมูลสูญหาย หรือเกิดการบันทึกทับกัน (Lost
                Update)</p>
            </div>
          </div>
        </div>

        <!-- Part 3 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-6">ส่วนที่ 3:
            ระบบจัดการฐานข้อมูล (Database Management System - DBMS) คืออะไร?</h3>
          <p class="mb-4">
            เพื่อแก้ปัญหาของระบบแฟ้มข้อมูล จึงได้มีการพัฒนา <strong>DBMS</strong> ขึ้นมา
            ซึ่งเป็นซอฟต์แวร์ที่ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้ (User) หรือแอปพลิเคชัน (Application) กับฐานข้อมูล
            (Database)
          </p>
          <div class="flex flex-col lg:flex-row gap-8 items-center bg-gray-50 p-6 rounded-2xl">
            <div class="w-full lg:w-1/3 flex flex-col items-center gap-4">
              <div
                class="bg-white p-4 rounded-xl border-2 border-blue-200 text-center w-full shadow-sm font-bold text-blue-800">
                Users / Applications</div>
              <ArrowRight class="w-8 h-8 text-gray-400 rotate-90 lg:rotate-0" />
              <div class="bg-green-600 p-6 rounded-xl text-center w-full shadow-lg font-bold text-white text-xl">
                DBMS<br /><span class="text-sm font-normal text-green-200">(MySQL, Oracle, SQL Server)</span></div>
              <ArrowRight class="w-8 h-8 text-gray-400 rotate-90 lg:rotate-0" />
              <div
                class="bg-white p-4 rounded-xl border-2 border-gray-300 text-center w-full shadow-sm font-bold text-gray-800 flex items-center justify-center gap-2">
                <Database class="w-5 h-5 text-gray-500" /> Database Storage
              </div>
            </div>
            <div class="w-full lg:w-2/3">
              <h4 class="text-xl font-bold text-green-800 mb-3">หน้าที่หลักของ DBMS:</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Data Definition:</strong> จัดการโครงสร้างข้อมูล สร้างตาราง กำหนดชนิดข้อมูล</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Data Manipulation:</strong> เพิ่ม (Insert), อ่าน (Select), แก้ไข (Update), ลบ (Delete)
                    ข้อมูล (CRUD Operations)</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Data Security & Integrity:</strong> ควบคุมสิทธิ์การเข้าถึง
                    และตรวจสอบความถูกต้องของข้อมูลตามกฎที่ตั้งไว้</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Concurrency Control:</strong>
                    จัดการเมื่อมีผู้ใช้หลายคนพยายามแก้ไขข้อมูลเดียวกันในเวลาเดียวกัน ด้วยระบบ Transaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Part 4 & 5 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-6">ส่วนที่ 4: Data
            Abstraction (ระดับการมองข้อมูล)</h3>
          <p class="mb-6">ระบบฐานข้อมูลมีความซับซ้อนสูงมากในการเก็บข้อมูลลงฮาร์ดดิสก์ เพื่อให้ผู้ใช้ใช้งานได้ง่าย DBMS
            จึงแบ่งระดับการมองข้อมูลออกเป็น 3 ระดับ:</p>

          <div class="space-y-4">
            <div
              class="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl items-center hover:bg-gray-50 transition-colors">
              <div class="bg-purple-100 p-4 rounded-full text-purple-700">
                <Layers class="w-8 h-8" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-800">1. View Level (ระดับวิว) - สูงสุด</h4>
                <p class="text-gray-600">ซ่อนรายละเอียดทั้งหมด
                  ผู้ใช้แต่ละคนจะเห็นข้อมูลในมุมมองที่ต่างกันตามสิทธิ์การเข้าถึง เช่น พนักงานบัญชีเห็นหน้าจอเงินเดือน
                  แต่พนักงานทั่วไปไม่เห็น</p>
              </div>
            </div>

            <div
              class="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl items-center hover:bg-gray-50 transition-colors">
              <div class="bg-blue-100 p-4 rounded-full text-blue-700">
                <Database class="w-8 h-8" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-800">2. Logical Level (ระดับตรรกะ) - กลาง</h4>
                <p class="text-gray-600">อธิบายว่า "มีข้อมูลอะไรบ้าง" ที่ถูกเก็บในฐานข้อมูล และมีความสัมพันธ์กันอย่างไร
                  (เช่น ตารางพนักงาน สัมพันธ์กับ ตารางแผนก) มักดูแลโดย Database Administrator</p>
              </div>
            </div>

            <div
              class="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl items-center hover:bg-gray-50 transition-colors">
              <div class="bg-gray-200 p-4 rounded-full text-gray-700">
                <Server class="w-8 h-8" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-800">3. Physical Level (ระดับกายภาพ) - ต่ำสุด</h4>
                <p class="text-gray-600">อธิบายว่าข้อมูลถูก "บันทึกและจัดเก็บจริงๆ อย่างไร" บนฮาร์ดดิสก์ (เช่น โครงสร้าง
                  B-Tree, ไบต์, บล็อก) ซึ่งมีความซับซ้อนมากที่สุด</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 6 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-6">ส่วนที่ 5:
            บทบาทในสภาพแวดล้อมฐานข้อมูล (Database Users)</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-green-50 rounded-xl p-6 text-center border border-green-200">
              <Shield class="w-12 h-12 text-green-700 mx-auto mb-4" />
              <h4 class="text-lg font-bold text-green-900 mb-2">Database Administrator (DBA)</h4>
              <p class="text-sm text-gray-600">ผู้บริหารฐานข้อมูล มีอำนาจสูงสุด ดูแลระบบ ความปลอดภัย สิทธิ์การเข้าถึง
                และรับผิดชอบเรื่อง Backup/Recovery</p>
            </div>
            <div class="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
              <FileText class="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h4 class="text-lg font-bold text-blue-900 mb-2">Application Programmer</h4>
              <p class="text-sm text-gray-600">นักพัฒนาโปรแกรมที่เขียนโค้ด (เช่น Python, Java, PHP)
                เพื่อเชื่อมต่อและสั่งการฐานข้อมูลผ่าน DBMS</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
              <Users class="w-12 h-12 text-orange-700 mx-auto mb-4" />
              <h4 class="text-lg font-bold text-orange-900 mb-2">End User</h4>
              <p class="text-sm text-gray-600">ผู้ใช้ทั่วไปที่ใช้งานผ่านแอปพลิเคชัน (UI)
                โดยไม่จำเป็นต้องรู้เรื่องโครงสร้างฐานข้อมูลใดๆ เลย</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Game Center -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm">
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
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-emerald-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span
              class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่
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
            class="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 rounded-xl border border-emerald-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-emerald-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-emerald-950 leading-tight">
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
            studentWeekScores['game-1'] ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. จำแนก Data vs Info</span>
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
              <span class="font-bold block">2. โยงระดับข้อมูล & สถาปัตยกรรม</span>
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
          activeGame === 'sort' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: Data vs Info</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'order'" :class="[
          activeGame === 'order' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: โยงระดับข้อมูล</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-teal-600 text-white shadow-lg scale-105' : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-300',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>🎯 แบบทดสอบหลังเรียน (4 ชอยส์ 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop (Data vs Info) -->
      <DragDropGame v-if="activeGame === 'sort'" title="มินิเกมที่ 1: จำแนก Data vs Information"
        subtitle="ลากข้อความด้านล่างไปใส่กล่องที่ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-1" :courseId="currentCourseId" :week="currentWeek" :initialItems="dragItemsData"
        :zones="dragZonesData" />

      <!-- Game 2: Matching / โยงความสัมพันธ์ -->
      <MatchingGame v-if="activeGame === 'order'" title="มินิเกมที่ 2: โยงความสัมพันธ์ Data Abstraction & DBMS"
        subtitle="จับคู่คำศัพท์กับคำอธิบายให้ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-2" :courseId="currentCourseId" :week="currentWeek" :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs" />

      <!-- Game 3: Final Post-test -->
      <PopQuiz v-if="activeGame === 'quiz'" title="แบบทดสอบหลังเรียน (Post-test): บทนำสู่ระบบฐานข้อมูล"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดผลความรู้หลังเรียน ตอบให้ครบแล้วกดส่งคำตอบ (ทำได้ครั้งเดียวเท่านั้น)"
        gameId="quiz" :courseId="currentCourseId" :week="currentWeek" :questions="quizQuestions" />

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal :show="showTeacherModal" :courseId="currentCourseId" courseName="ระบบจัดการฐานข้อมูล"
        :week="currentWeek" weekTitle="สัปดาห์ที่ 1: บทนำสู่ระบบฐานข้อมูล" :games="weekGames"
        @close="showTeacherModal = false" />
    </section>

    <!-- Assignment Section -->
    <AssignmentSection course-id="31901-2007" assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: สำรวจปัญหาแฟ้มข้อมูลและเสนอแนะระบบจัดการฐานข้อมูล (DBMS)" :max-score="10">
      <template #number>1</template>
      <template #description>
        สำรวจระบบงานรอบตัวที่ยังใช้การจดบันทึกลงสมุดหรือ Spreadsheet (เช่น ร้านขายของชำ, ร้านอาหาร, คลินิก)
        เพื่อวิเคราะห์ปัญหาตามหลัก 6 ข้อ และเสนอแนะแนวทางแก้ปัญหาด้วย DBMS

        <!-- Objectives -->
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <h4 class="font-bold text-emerald-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-emerald-600" />
            จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-emerald-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>1. อธิบายความแตกต่างระหว่าง Data และ Information ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>2. วิเคราะห์ปัญหาของระบบแฟ้มข้อมูลเดิมตามหลัก 6 ข้อได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>3. เสนอแนะหน้าที่และบทบาทของ DBMS ในการแก้ปัญหาได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>4. กำหนดกลุ่มผู้ใช้งานและสิทธิ์การเข้าถึงข้อมูลเบื้องต้นได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>5. สรุปผลการประเมินความคุ้มค่าของการเปลี่ยนผ่านสู่ DBMS ได้</span>
            </div>
          </div>
        </div>

        <!-- Objectives -->

        <ul class="space-y-4 text-slate-700">
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1</div>
            <div>
              <strong>1. ข้อมูลระบบงานที่เลือกศึกษา (System Overview)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                เลือกระบบงานรอบตัว 1 ระบบ (เช่น ร้านขายของชำ, ร้านอาหาร, หอพัก, คลินิก)
                พร้อมอธิบายลักษณะการเก็บข้อมูลแบบเดิม (ใช้สมุดจดบันทึก หรือโปรแกรม Excel อย่างไร)
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2</div>
            <div>
              <strong>2. วิเคราะห์ปัญหาของระบบเดิมตามหลัก 6 ข้อ (Problems Analysis)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                วิเคราะห์ปัญหาที่พบตาม 6 ปัญหาหลักของ File-based System: Data Redundancy, Data Inconsistency, Data
                Isolation, Integrity, Security และ Concurrent Access
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3</div>
            <div>
              <strong>3. ข้อเสนอแนะและแนวทางแก้ไขด้วยระบบจัดการฐานข้อมูล (DBMS Recommendation)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                อธิบายว่าหากเปลี่ยนมาใช้ระบบจัดการฐานข้อมูล (DBMS) จะนำหน้าที่หลัก (CRUD, Integrity Constraints,
                Concurrency, Security) เข้ามาช่วยแก้ไขปัญหาได้อย่างไร
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              4</div>
            <div>
              <strong>4. สรุปผลการประเมิน (Conclusion)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                สรุปประโยชน์ที่องค์กรหรือธุรกิจจะได้รับ และความคุ้มค่าของการเปลี่ยนผ่านจากแฟ้มข้อมูลสู่ระบบฐานข้อมูล
              </p>
            </div>
          </li>
        </ul>

        <!-- PDF Example Button -->
        <div
          class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-emerald-600" /> ต้องการดูตัวอย่างการเขียนใบงานที่ 1?
            </h5>
            <p class="text-xs text-gray-500 mt-0.5">
              กดเปิดดูตัวอย่างการเขียนใบงานที่ 1 ฉบับสมบูรณ์ (รูปแบบเอกสารมาตรฐานทางการ ขนาด A4)
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="showPdfModal = true"
              class="px-5 py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
              <FileText class="w-4 h-4" />
              เปิดดูตัวอย่างใบงาน (PDF Preview)
            </button>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Reusable PDF Viewer Modal for Database Assignment 1 -->
    <AssignmentPdfModal v-model="showPdfModal" title="ใบงานที่_1_สำรวจปัญหาแฟ้มข้อมูลและเสนอแนะDBMS_ปวส1.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)" footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 (Assignment Format)">
      <!-- Official Worksheet Header -->
      <div class="border-b-2 border-black pb-3 text-center space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 1: สำรวจปัญหาแฟ้มข้อมูลและเสนอแนะระบบจัดการฐานข้อมูล (DBMS)
        </h2>
      </div>

      <!-- Student Meta Line (Simple Format) -->
      <div
        class="py-2 text-xs sm:text-sm text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
        <span><strong>ชื่อ-นามสกุล</strong> ..........นายสมชาย ใจดี............</span>
        <span><strong>รหัส</strong> .....67309010001........</span>
        <span><strong>ชั้น</strong> .....ปวส.1/1 ทส.........</span>
      </div>

      <!-- Instructions -->
      <div class="bg-gray-100 p-2.5 rounded border border-gray-300 text-xs text-gray-800">
        <strong>คำชี้แจง:</strong> ให้นักศึกษาสำรวจระบบงานที่สนใจ 1 ระบบ พร้อมวิเคราะห์ปัญหาของระบบแฟ้มข้อมูลเดิมตามหลัก
        6
        ข้อ และเสนอแนะแนวทางการนำระบบจัดการฐานข้อมูล (DBMS) เข้ามาแก้ไขปัญหาให้สมบูรณ์
      </div>

      <!-- 1: ข้อมูลระบบ -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          1. ข้อมูลระบบงานที่เลือกศึกษา (System Overview)
        </h4>
        <div class="text-xs text-gray-800 space-y-1">
          <p><strong>ชื่อระบบงาน:</strong> ระบบจัดการสต็อกสินค้าและบันทึกยอดขาย ร้านขายของชำ "เจ๊พรพาณิชย์"</p>
          <p><strong>ลักษณะการเก็บข้อมูลแบบเดิม:</strong> บันทึกลงในสมุดจดบัญชีรายวัน ควบคู่กับการใช้ตารางคำนวณ
            Microsoft
            Excel แบบแยกไฟล์รายเดือน</p>
          <p><strong>ผู้ใช้งานในระบบ:</strong> เจ้าของร้าน (ผู้จัดการสต็อกและดูยอดขายรวม), พนักงานขายหน้าร้าน (2 คน
            ทำหน้าที่คิดเงินและบันทึกตัดสต็อก)</p>
          <p><strong>ลักษณะงาน:</strong> บันทึกรับสินค้าเข้าสต็อก, ตัดสต็อกยอดขายหน้าร้าน, สรุปยอดขายประจำวัน
            และคำนวณกำไร-ขาดทุนรายเดือน</p>
        </div>
      </div>

      <!-- 2: วิเคราะห์ปัญหา (Table) -->
      <div class="space-y-1.5 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          2. วิเคราะห์ปัญหาของระบบแฟ้มข้อมูลแบบเดิม (File-based System Problems Analysis)
        </h4>
        <table class="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="border border-gray-400 p-1.5 text-left w-1/4">ปัญหาหลัก 6 ข้อ</th>
              <th class="border border-gray-400 p-1.5 text-left w-2/5">ลักษณะปัญหาที่พบในร้าน (Cause)</th>
              <th class="border border-gray-400 p-1.5 text-left">ผลกระทบต่อธุรกิจ (Impact)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">1. Data Redundancy<br><span
                  class="font-normal text-gray-500">(ความซ้ำซ้อน)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">บันทึกชื่อสินค้า ราคา และผู้จัดจำหน่ายซ้ำๆ ในไฟล์ Excel
                หลายเดือน</td>
              <td class="border border-gray-400 p-1.5 align-top">เปลืองเนื้อที่จัดเก็บ
                และหากเปลี่ยนราคาต้องไล่แก้ทุกไฟล์
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold align-top">2. Data Inconsistency<br><span
                  class="font-normal text-gray-500">(ข้อมูลขัดแย้ง)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">แก้ไขยอดขายในสมุดจด แต่ลืมแก้ในไฟล์ Excel
                หรืออัปเดตไม่ตรงกัน</td>
              <td class="border border-gray-400 p-1.5 align-top">ตัวเลขสต็อกกับเงินในลิ้นชักไม่ตรงกัน
                ไม่รู้ข้อมูลใดถูกต้อง
              </td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">3. Data Isolation<br><span
                  class="font-normal text-gray-500">(ความโดดเดี่ยว)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">
                ไฟล์ยอดขายกับไฟล์ข้อมูลลูกหนี้แยกกันคนละไฟล์และคนละโฟลเดอร์
              </td>
              <td class="border border-gray-400 p-1.5 align-top">นำข้อมูลมารวมเพื่อดูภาพรวมหรือวิเคราะห์แนวโน้มได้ยากมาก
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold align-top">4. Integrity Problems<br><span
                  class="font-normal text-gray-500">(ความถูกต้อง)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">พนักงานเผลอพิมพ์จำนวนสต็อกติดลบ
                หรือพิมพ์ตัวอักษรลงช่องราคา
              </td>
              <td class="border border-gray-400 p-1.5 align-top">ไม่มีระบบตรวจสอบเงื่อนไข (Constraint)
                ข้อมูลผิดพลาดนำไปใช้ต่อไม่ได้</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">5. Security Problems<br><span
                  class="font-normal text-gray-500">(ความปลอดภัย)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">ไม่มีการล็อกรหัสผ่าน
                ใครเปิดเครื่องก็เห็นข้อมูลต้นทุนและกำไรทั้งหมด</td>
              <td class="border border-gray-400 p-1.5 align-top">ข้อมูลความลับทางการค้ารั่วไหล
                และเสี่ยงต่อการถูกลบไฟล์โดยไม่ตั้งใจ</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold align-top">6. Concurrent Access<br><span
                  class="font-normal text-gray-500">(ใช้งานพร้อมกัน)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">พนักงาน 2 คนเปิดไฟล์ Excel
                เดียวกันผ่านแชร์ไดรฟ์แล้วกดบันทึกทับกัน</td>
              <td class="border border-gray-400 p-1.5 align-top">เกิดปัญหา Lost Update ข้อมูลยอดขายของพนักงานคนแรกหายไป
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3: ข้อเสนอแนะ DBMS -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          3. ข้อเสนอแนะและแนวทางแก้ไขด้วยระบบจัดการฐานข้อมูล (DBMS Recommendation)
        </h4>
        <div class="text-xs text-gray-800 space-y-1">
          <p><strong>3.1 การจัดเก็บแบบรวมศูนย์ (Centralized Database):</strong>
            ย้ายข้อมูลทั้งหมดมาจัดเก็บในระบบฐานข้อมูลเชิงสัมพันธ์ (Relational DBMS เช่น MySQL/PostgreSQL)
            เพื่อขจัดความซ้ำซ้อนและเชื่อมโยงตารางผ่าน Primary Key และ Foreign Key</p>
          <p><strong>3.2 การควบคุมความถูกต้อง (Data Integrity):</strong> กำหนดเงื่อนไขตรวจสอบข้อมูล เช่น ห้ามค่าว่าง
            (NOT
            NULL), ห้ามยอดสต็อกติดลบ (CHECK), และตรวจสอบราคาสินค้าอัตโนมัติ</p>
          <p><strong>3.3 การควบคุมการเข้าถึงพร้อมกัน (Concurrency Control):</strong> ใช้ระบบจัดการ Transaction (ACID
            Properties) เพื่อรองรับการขายสินค้าหลายจุดพร้อมกันโดยไม่เกิดข้อมูลทับซ้อน</p>
          <p><strong>3.4 การรักษาความปลอดภัย (Security & Authorization):</strong> กำหนดสิทธิ์ผู้ใช้ (User Privileges)
            ให้พนักงานหน้าร้านบันทึกขายได้เท่านั้น แต่ดูข้อมูลต้นทุนหรือรายงานกำไรไม่ได้</p>
        </div>
      </div>

      <!-- 4: สรุปผลการประเมิน -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          4. สรุปผลการประเมิน (Conclusion)
        </h4>
        <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-gray-800 leading-relaxed">
          "การเปลี่ยนผ่านจากระบบแฟ้มข้อมูลแบบเดิม (สมุดจดและ Excel) มาสู่ระบบจัดการฐานข้อมูล (DBMS)
          จะช่วยลดความผิดพลาดและความสูญเสียจากสต็อกสินค้าสูญหายได้อย่างสิ้นเชิง
          เพิ่มความรวดเร็วในการให้บริการลูกค้าหน้าร้าน
          ป้องกันการรั่วไหลของข้อมูลการค้า และช่วยให้เจ้าของร้านได้รับรายงานยอดขายและแจ้งเตือนสินค้าใกล้หมดแบบเรียลไทม์
          ซึ่งช่วยยกระดับความสามารถในการแข่งขันของธุรกิจร้านขายของชำได้อย่างยั่งยืน"
        </div>
      </div>
    </AssignmentPdfModal>

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
