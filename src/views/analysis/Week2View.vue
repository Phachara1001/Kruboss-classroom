<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  BookOpen, PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Code, Settings, Sparkles, BarChart3, LineChart,
  TrendingUp, RefreshCw, FileCheck, CheckCircle2, ChevronLeft, Eye, HelpCircle, Clock, Edit3,
  Trophy, Lock, FileSpreadsheet, AlertCircle, MessageSquare, ClipboardList, CheckSquare,
  HelpCircle as QuestionIcon, ShieldCheck, Filter, Globe, Download, Send, Search
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

const router = useRouter()

// Current Course & Week context
const currentCourseId = '31901-2012'
const currentWeek = 2

// Modal States
const showPdfModal = ref(false)
const showTeacherModal = ref(false)

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกช่องทางการเก็บรวบรวมข้อมูล)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่วัตถุประสงค์กับการสอบถามข้อมูล)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 2 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
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

// Mini-game State
const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'

// Game 1: Drag & Drop (Data Collection Channels & Types)
const dragItemsData = [
  { id: 1, text: 'สร้าง Google Forms ส่งให้นักศึกษาตอบความพึงพอใจห้องเรียน', type: 'survey' },
  { id: 2, text: 'บันทึกเวลาเปิด-ปิดและพฤติกรรมการคลิกปุ่มลง Web Log อัตโนมัติ', type: 'system' },
  { id: 3, text: 'สัมภาษณ์ผู้จัดการฝ่ายบุคคล (HR) เชิงลึกเพื่อหาสาเหตุการลาออก', type: 'survey' },
  { id: 4, text: 'ดึงข้อมูลพิกัดและรายงานสภาพอากาศย้อนหลังจาก Open API กรมอุตุนิยมวิทยา', type: 'external' },
  { id: 5, text: 'ดึงประวัติการออกใบเสร็จและยอดซื้อจากระบบ POS หน้าร้านลงฐานข้อมูล', type: 'system' },
  { id: 6, text: 'ดาวน์โหลดสถิติประชากรรายจังหวัดจากเว็บไซต์ data.go.th ของภาครัฐ', type: 'external' }
]

const dragZonesData = [
  {
    id: 'survey',
    title: 'การสอบถามโดยตรง (Survey & Interview)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากวิธีการสอบถามโดยตรง (ผู้ตอบกรอกเอง) มาวางที่นี่'
  },
  {
    id: 'system',
    title: 'ระบบธุรกรรมและ Log อัตโนมัติ (System & Log)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากวิธีการเก็บข้อมูลจากระบบอัตโนมัติมาวางที่นี่'
  },
  {
    id: 'external',
    title: 'ข้อมูลภายนอกและ API (External & Secondary Data)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากวิธีการดึงข้อมูลภายนอกและแหล่งข้อมูลทุติยภูมิมาวางที่นี่'
  }
]

// Game 2: Matching Game (Inquiry Purpose & Question Format)
const matchLeftTerms = [
  { id: 'l1', text: '1. แบบสอบถามออนไลน์ (Online Survey)', match: 'r1' },
  { id: 'l2', text: '2. การสัมภาษณ์แบบกึ่งมีโครงสร้าง (Semi-structured)', match: 'r2' },
  { id: 'l3', text: '3. มาตรวัดประเมิน (Likert Scale 1-5)', match: 'r3' },
  { id: 'l4', text: '4. การสังเกตการณ์หน้างาน (Field Observation)', match: 'r4' },
  { id: 'l5', text: '5. การตั้งค่าตรวจสอบข้อมูล (Data Validation)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'รวบรวมข้อมูลจากกลุ่มตัวอย่างจำนวนมากได้อย่างรวดเร็ว ประหยัดต้นทุน และแปลงเป็นตารางได้ทันที' },
  { id: 'r2', text: 'เจาะลึกมุมมอง เปิดโอกาสให้ผู้ตอบอธิบายเหตุผลและข้อเสนอแนะที่แบบสอบถามปรนัยอาจครอบคลุมไม่ถึง' },
  { id: 'r3', text: 'แปลงความรู้สึก ทัศนคติ หรือความพึงพอใจของมนุษย์ ให้เป็นสเกลตัวเลขที่นำไปคำนวณสถิติหาค่าเฉลี่ยได้' },
  { id: 'r4', text: 'บันทึกพฤติกรรมจริงของผู้ใช้งานโดยไม่มีอคติจากการตอบคำถาม เช่น การนับเวลาที่ลูกค้ายืนเลือกสินค้า' },
  { id: 'r5', text: 'กำหนดกฎป้องกันข้อมูลขยะตั้งแต่ต้นทาง เช่น บังคับกรอก, ตรวจสอบรูปแบบอีเมล และจำกัดช่วงตัวเลข' }
]

// Game 3: Quiz Questions (Post-test 10 ข้อ 4 ตัวเลือกพร้อมเฉลยและคำอธิบาย)
const quizQuestions = [
  {
    id: 1,
    question: "เหตุใดในกระบวนการ Data Analytics จึงต้องเริ่มต้นด้วย 'การสอบถามข้อมูลและความต้องการ (Data Inquiry)' ก่อนการลงมือสร้างตารางหรือกราฟ?",
    options: [
      { id: 'a', text: "เพื่อลดงบประมาณในการซื้อคอมพิวเตอร์เครื่องใหม่", isCorrect: false },
      { id: 'b', text: "เพื่อให้เข้าใจวัตถุประสงค์ทางธุรกิจ กลุ่มเป้าหมาย และระบุได้ว่าจำเป็นต้องใช้ข้อมูลตัวแปรใดบ้างในการตอบคำถาม", isCorrect: true },
      { id: 'c', text: "เพื่อให้เสียเวลาในการทำงานนานขึ้นตามเกณฑ์ชั่วโมงสอน", isCorrect: false },
      { id: 'd', text: "เพื่อป้องกันไม่ให้ผู้อื่นเข้าถึงโปรแกรม Power BI ได้", isCorrect: false }
    ],
    explanation: "การสอบถามข้อมูล (Data Inquiry) ช่วยให้นักวิเคราะห์เข้าใจเป้าหมายที่แท้จริงของผู้มีส่วนได้ส่วนเสีย (Stakeholders) ทำให้ทราบว่าต้องเก็บข้อมูลอะไรบ้าง และไม่เก็บข้อมูลที่ไม่จำเป็น"
  },
  {
    id: 2,
    question: "ตามกรอบแนวคิด 5W1H ในการสอบถามข้อมูล ตัวอักษร 'Why' มุ่งเน้นไปที่การค้นหาคำตอบในเรื่องใด?",
    options: [
      { id: 'a', text: "สถานที่ที่จัดเก็บไฟล์ฐานข้อมูล", isCorrect: false },
      { id: 'b', text: "เหตุผล วัตถุประสงค์ และเป้าหมายที่ต้องนำข้อมูลนี้ไปช่วยตัดสินใจแก้ไขปัญหา", isCorrect: true },
      { id: 'c', text: "รายชื่อโปรแกรมเมอร์ที่เป็นผู้เขียนโค้ด", isCorrect: false },
      { id: 'd', text: "จำนวนหน่วยความจำ RAM ของเครื่องเซิร์ฟเวอร์", isCorrect: false }
    ],
    explanation: "'Why' คือการค้นหา 'ทำไมต้องวิเคราะห์ข้อมูลนี้ และผลลัพธ์จะนำไปแก้ปัญหาหรือพัฒนาเรื่องใด' ซึ่งเป็นหัวใจสำคัญสูงสุดของการทำ Analytics"
  },
  {
    id: 3,
    question: "หากต้องการทราบความพึงพอใจของลูกค้าจำนวน 5,000 คนทั่วประเทศต่อรสชาติอาหาร รูปแบบการสอบถามข้อมูลใดมีความเหมาะสมและคุ้มค่าที่สุด?",
    options: [
      { id: 'a', text: "การเดินทางไปสัมภาษณ์ตัวต่อตัวให้ครบทั้ง 5,000 คน", isCorrect: false },
      { id: 'b', text: "แบบสอบถามออนไลน์ (Online Questionnaire / Google Forms) โดยส่งผ่านทาง SMS หรือ QR Code", isCorrect: true },
      { id: 'c', text: "การเปิดกล้องวงจรปิดสังเกตการณ์ลูกค้าทั้งวัน", isCorrect: false },
      { id: 'd', text: "การเดาและสุ่มตัวเลขยอดขายขึ้นมาเอง", isCorrect: false }
    ],
    explanation: "แบบสอบถามออนไลน์เหมาะสำหรับการเข้าถึงกลุ่มตัวอย่างขนาดใหญ่ (Large Scale) รวดเร็ว ประหยัดค่าใช้จ่าย และผู้ตอบสามารถตอบผ่านสมาร์ตโฟนได้สะดวก"
  },
  {
    id: 4,
    question: "คำถามแบบสอบถามลักษณะใดต่อไปนี้ จัดเป็น 'คำถามชี้นำ (Leading Question)' ซึ่งเป็นข้อผิดพลาดร้ายแรงในการเก็บข้อมูล?",
    options: [
      { id: 'a', text: "ท่านคิดว่าเครื่องดื่มสูตรใหม่ของเราอร่อยและคุ้มค่ามากใช่หรือไม่?", isCorrect: true },
      { id: 'b', text: "ท่านมีความพึงพอใจต่อรสชาติเครื่องดื่มอยู่ในระดับใด (1 ถึง 5)", isCorrect: false },
      { id: 'c', text: "ใน 1 สัปดาห์ ท่านซื้อเครื่องดื่มประมาณกี่แก้ว", isCorrect: false },
      { id: 'd', text: "ท่านชำระเงินด้วยช่องทางใดบ่อยที่สุด", isCorrect: false }
    ],
    explanation: "คำถามที่ใส่ข้อความโน้มน้าว เช่น 'อร่อยและคุ้มค่ามากใช่หรือไม่' จะชี้นำให้ผู้ตอบเลือกตอบทางบวก ทำให้ข้อมูลที่ได้มีอคติ (Bias) และบิดเบือนจากความจริง"
  },
  {
    id: 5,
    question: "การสอบถามระดับความพึงพอใจแบบ Likert Scale 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด) จัดเป็นข้อมูลประเภทใด และมีประโยชน์ต่องานวิเคราะห์อย่างไร?",
    options: [
      { id: 'a', text: "ข้อมูลข้อความที่ไม่สามารถนำมาทำอะไรได้เลย", isCorrect: false },
      { id: 'b', text: "ข้อมูลเชิงคุณภาพแบบเรียงลำดับ (Ordinal) ที่แปลงเป็นตัวเลขเพื่อคำนวณหาค่าเฉลี่ยและเปรียบเทียบความพึงพอใจได้", isCorrect: true },
      { id: 'c', text: "ข้อมูลพิกัดละติจูด-ลองจิจูด", isCorrect: false },
      { id: 'd', text: "ข้อมูลไบนารีระดับล่างของฮาร์ดแวร์", isCorrect: false }
    ],
    explanation: "Likert Scale เป็นการวัดระดับความรู้สึก (Ordinal) ที่นำมารวมเป็นสเกลคะแนน สามารถหาค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (SD) เพื่อเปรียบเทียบความพึงพอใจของแต่ละด้านได้"
  },
  {
    id: 6,
    question: "ข้อใดคือตัวอย่างของการรวบรวมข้อมูลแบบ 'ปฐมภูมิ (Primary Data Collection)'?",
    options: [
      { id: 'a', text: "การดาวน์โหลดรายงานสรุปภาวะเศรษฐกิจจากธนาคารแห่งประเทศไทย", isCorrect: false },
      { id: 'b', text: "การแจกแบบสอบถามเพื่อถามพฤติกรรมการเดินทางของนักศึกษาในวิทยาลัยด้วยตนเอง", isCorrect: true },
      { id: 'c', text: "การอ่านบทความวิจัยที่ตีพิมพ์เมื่อ 3 ปีก่อน", isCorrect: false },
      { id: 'd', text: "การคัดลอกตารางจากวิกิพีเดีย", isCorrect: false }
    ],
    explanation: "ข้อมูลปฐมภูมิ (Primary Data) คือข้อมูลที่ผู้ศึกษาเป็นผู้ลงมือเก็บรวบรวมขึ้นมาใหม่ด้วยตนเองโดยตรงจากกลุ่มเป้าหมายเพื่อตอบวัตถุประสงค์เฉพาะของงานวิจัยนั้น"
  },
  {
    id: 7,
    question: "ในการสร้าง Google Forms การกำหนด 'Data Validation' เช่น บังคับให้กรอก 'ตัวเลขจำนวนเต็มบวก 1-100' ในช่องอายุ มีประโยชน์หลักอย่างไร?",
    options: [
      { id: 'a', text: "ทำให้แบบฟอร์มเปลี่ยนสีสันได้ตามใจชอบ", isCorrect: false },
      { id: 'b', text: "ป้องกันข้อมูลผิดรูปแบบตั้งแต่ต้นทาง ลดภาระในการทำ Data Cleaning และป้องกันข้อมูลขยะ (Garbage In)", isCorrect: true },
      { id: 'c', text: "ทำให้ระบบส่งอีเมลแจ้งเตือนทุกครั้งที่มีคนกดดูแบบฟอร์ม", isCorrect: false },
      { id: 'd', text: "เพิ่มจำนวนผู้ตอบแบบสอบถามขึ้นเป็นสองเท่าโดยอัตโนมัติ", isCorrect: false }
    ],
    explanation: "Data Validation ช่วยตรวจสอบความถูกต้อง (Accuracy & Consistency) ตั้งแต่ตอนที่ผู้ใช้พิมพ์ข้อมูล ป้องกันการกรอกข้อความในช่องตัวเลข หรือกรอกตัวเลขติดลบ"
  },
  {
    id: 8,
    question: "ข้อมูลชนิดใดที่ระบบคอมพิวเตอร์บันทึกได้โดยอัตโนมัติ โดยที่ผู้ใช้งานไม่ต้องเป็นผู้กรอกแบบสอบถามเอง?",
    options: [
      { id: 'a', text: "Web Server Access Log บันทึกเวลาที่เข้าชมเว็บและ IP Address", isCorrect: true },
      { id: 'b', text: "ความฝันในอนาคตของนักศึกษา", isCorrect: false },
      { id: 'c', text: "เหตุผลส่วนตัวที่นักศึกษาไม่ชอบวิชาคณิตศาสตร์", isCorrect: false },
      { id: 'd', text: "ความคิดเห็นเกี่ยวกับภาพยนตร์ที่ยังไม่ได้ฉาย", isCorrect: false }
    ],
    explanation: "Server Log, เซนเซอร์ IoT และฐานข้อมูล POS เป็นตัวอย่างของระบบบันทึกอัตโนมัติ (Automated / Transactional Data) ที่เก็บพฤติกรรมจริงโดยไม่ต้องรบกวนให้ผู้ใช้ตอบ"
  },
  {
    id: 9,
    question: "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) เมื่อสร้างแบบฟอร์มเก็บรวบรวมข้อมูลลูกค้า สิ่งใดที่ต้องมีเสมอ?",
    options: [
      { id: 'a', text: "ของรางวัลแจกฟรีมูลค่ามากกว่า 1,000 บาท", isCorrect: false },
      { id: 'b', text: "ข้อความแจ้งวัตถุประสงค์การเก็บข้อมูลและช่องให้ผู้ตอบยินยอม (Consent) อย่างชัดเจน", isCorrect: true },
      { id: 'c', text: "การบังคับให้ผู้ตอบต้องถ่ายรูปบัตรประชาชนส่งมาด้วยเสมอ", isCorrect: false },
      { id: 'd', text: "การระบุว่าจะนำข้อมูลไปขายต่อให้บริษัทประกันภัยทุกกรณี", isCorrect: false }
    ],
    explanation: "หลักการสำคัญของ PDPA คือต้องแจ้งวัตถุประสงค์ (Purpose Limitation) ว่าเก็บข้อมูลไปทำอะไร และได้รับความยินยอม (Consent) จากเจ้าของข้อมูลก่อนเสมอ"
  },
  {
    id: 10,
    question: "เมื่อเก็บข้อมูลจากแบบสอบถามเสร็จสิ้น เอกสารใดที่ Data Analyst ควรจัดทำขึ้นเพื่ออธิบายความหมายและประเภทของแต่ละคอลัมน์?",
    options: [
      { id: 'a', text: "พจนานุกรมข้อมูล (Data Dictionary / Codebook)", isCorrect: true },
      { id: 'b', text: "ใบแจ้งหนี้ (Invoice)", isCorrect: false },
      { id: 'c', text: "ใบรับประกันสินค้า", isCorrect: false },
      { id: 'd', text: "แผนผังที่นั่งห้องเรียน", isCorrect: false }
    ],
    explanation: "Data Dictionary หรือ Codebook คือเอกสารกำกับชุดข้อมูลที่ระบุชื่อคอลัมน์, คำอธิบาย, ชนิดข้อมูล (Data Type), ค่าที่เป็นไปได้ และหน่วยวัด เพื่อให้ทุกคนในทีมเข้าใจข้อมูลตรงกัน"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-sky-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-5 pointer-events-none">
        <ClipboardList class="w-[400px] h-[400px] -translate-y-20 translate-x-20 text-sky-900" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-sky-100 text-sky-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">
          สัปดาห์ที่ 2
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-sky-900 mb-4 leading-tight">
          การสอบถามและการเก็บรวบรวมข้อมูล<br />
          <span class="text-3xl text-sky-700">(Data Inquiry, Formats & Data Collection)</span>
        </h1>
        <p class="text-gray-600 text-xl leading-relaxed">
          ศึกษาหลักการสอบถามความต้องการทางธุรกิจ (Business Requirements), กรอบแนวคิด 5W1H, รูปแบบและเครื่องมือการสอบถามข้อมูล (Survey, Interview, Observation), การออกแบบคำถามและการกำหนดเงื่อนไขความถูกต้อง (Data Validation) เพื่อป้องกันข้อมูลขยะตั้งแต่ต้นทาง
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Unit Plan & Learning Objectives -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-bold text-gray-800">แผนการจัดการเรียนรู้ประจำหน่วยที่ 2</h2>
          <p class="text-sm text-gray-500 mt-0.5">Phase 1: Data Analysis (ทฤษฎี 1 ชม. ปฏิบัติ 4 ชม.)</p>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-sm space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="p-5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
            <div class="flex items-center gap-2 text-sky-900 font-bold text-base">
              <Target class="w-5 h-5 text-sky-600" />
              <span>1. ผลลัพธ์การเรียนรู้ (Learning Outcome)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ผู้เรียนสามารถวิเคราะห์ความต้องการของผู้ใช้ ออกแบบเครื่องมือสอบถามข้อมูล และวางแผนเก็บรวบรวมข้อมูลได้อย่างถูกต้องตามหลักสถิติและกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </div>

          <!-- Card 2 -->
          <div class="p-5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div class="flex items-center gap-2 text-blue-900 font-bold text-base">
              <CheckCircle2 class="w-5 h-5 text-blue-600" />
              <span>2. สมรรถนะประจำสัปดาห์ (Competencies)</span>
            </div>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>ประยุกต์ใช้ 5W1H ในการกำหนดตัวแปรข้อมูล</li>
              <li>ออกแบบแบบสอบถามออนไลน์ด้วย Google Forms</li>
              <li>กำหนดเงื่อนไข Data Validation ป้องกันข้อมูลขยะ</li>
              <li>จัดทำพจนานุกรมข้อมูล (Data Dictionary)</li>
            </ul>
          </div>

          <!-- Card 3 -->
          <div class="p-5 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-2">
            <div class="flex items-center gap-2 text-cyan-900 font-bold text-base">
              <Award class="w-5 h-5 text-cyan-600" />
              <span>3. การวัดและประเมินผล (Assessment)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ประเมินจากใบงานปฏิบัติการออกแบบแบบสอบถาม (10 คะแนน), การมีส่วนร่วมในมินิเกมจำแนกข้อมูล และแบบทดสอบหลังเรียน (Post-test 10 ข้อ)
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lecture Section: Detailed Content -->
    <section class="space-y-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
            <BookOpen class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียนประจำสัปดาห์ที่ 2</h2>
            <p class="text-sm text-gray-500 mt-0.5">การสอบถามข้อมูล รูปแบบการสอบถาม และช่องทางการเก็บรวบรวมข้อมูล</p>
          </div>
        </div>
        <button @click="showPdfModal = true"
          class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-sky-200 text-sky-700 text-sm font-semibold hover:bg-sky-50 transition shadow-2xs">
          <Download class="w-4 h-4" /> ดูใบสรุปเนื้อหา PDF
        </button>
      </div>

      <!-- Topic 1: Data Inquiry & 5W1H Framework -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            ตอนที่ 1
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Search class="w-6 h-6 text-sky-600" />
            การสอบถามข้อมูลเพื่อระบุความต้องการ (Data Inquiry & Requirement Gathering)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            ทำไมนักวิเคราะห์ข้อมูลต้อง "สอบถาม" ก่อนเริ่มเปิดโปรแกรมคำนวณหรือวาดกราฟ?
          </p>
        </div>

        <div class="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>
            ในชีวิตการทำงานจริง ปัญหาที่พบบ่อยที่สุดของ <strong>Data Analyst</strong> ไม่ใช่การเขียนสูตรคำนวณไม่เป็น แต่คือ <strong>"ไม่รู้ว่าต้องวิเคราะห์เพื่อตอบอะไร หรือเก็บข้อมูลมาผิดประเภทจนใช้การไม่ได้"</strong> ดังนั้นขั้นตอนแรกสุดที่สำคัญที่สุดจึงเรียกว่า <strong>Data Inquiry (การสอบถามข้อมูล)</strong>
          </p>

          <!-- 5W1H Grid Card -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200/80 space-y-4">
            <h4 class="font-bold text-sky-950 flex items-center gap-2 text-base">
              <Lightbulb class="w-5 h-5 text-amber-500" />
              กรอบแนวคิด 5W1H สำหรับการสอบถามข้อมูล (Data Inquiry Framework)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">WHY (ทำไม)</span>
                <p class="font-semibold text-gray-800 text-xs">ทำไมต้องเก็บข้อมูลนี้?</p>
                <p class="text-xs text-gray-500">เป้าหมายคืออะไร เช่น ต้องการแก้ปัญหายอดขายตก หรือต้องการพัฒนาคุณภาพอาหาร</p>
              </div>

              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">WHAT (อะไร)</span>
                <p class="font-semibold text-gray-800 text-xs">ต้องการข้อมูลตัวแปรใดบ้าง?</p>
                <p class="text-xs text-gray-500">ระบุคอลัมน์ที่จำเป็น เช่น ยอดซื้อ (บาท), ประเภทสินค้า, ระดับความพึงพอใจ</p>
              </div>

              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">WHO (ใคร)</span>
                <p class="font-semibold text-gray-800 text-xs">กลุ่มเป้าหมายผู้ให้ข้อมูลคือใคร?</p>
                <p class="text-xs text-gray-500">ลูกค้าหน้าร้าน, ผู้ใช้งานแอปพลิเคชัน, นักศึกษา หรือผู้บริหารระดับสูง</p>
              </div>

              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">WHEN (เมื่อใด)</span>
                <p class="font-semibold text-gray-800 text-xs">ช่วงเวลาใดที่ต้องการวิเคราะห์?</p>
                <p class="text-xs text-gray-500">ความถี่ในการเก็บ เช่น ทุกครั้งที่ซื้อ, สรุปรายสัปดาห์ หรือย้อนหลัง 1 ปี</p>
              </div>

              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">WHERE (ที่ไหน)</span>
                <p class="font-semibold text-gray-800 text-xs">แหล่งที่มาของข้อมูลอยู่ที่ใด?</p>
                <p class="text-xs text-gray-500">หน้าร้านสาขาใด, ฐานข้อมูล PostgreSQL, ระบบ Google Forms หรือไฟล์ CSV</p>
              </div>

              <div class="p-3.5 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">HOW (อย่างไร)</span>
                <p class="font-semibold text-gray-800 text-xs">มีวิธีการและเครื่องมืออย่างไร?</p>
                <p class="text-xs text-gray-500">จะใช้แบบสอบถามออนไลน์, สัมภาษณ์ หรือดึง Log จากระบบขาย</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Topic 2: Inquiry Formats & Tools -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            ตอนที่ 2
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <ClipboardList class="w-6 h-6 text-sky-600" />
            รูปแบบและเครื่องมือในการสอบถามข้อมูล (Inquiry Formats & Tools)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            การเลือกเครื่องมือสอบถามให้เหมาะสมกับขนาดกลุ่มตัวอย่างและวัตถุประสงค์ของข้อมูล
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Format 1: Survey -->
          <div class="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-3">
            <div class="flex items-center gap-2.5 text-sky-900 font-bold text-base">
              <div class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span>แบบสอบถามออนไลน์ (Online Questionnaires / Surveys)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              เครื่องมือยอดนิยม เช่น <strong>Google Forms, Microsoft Forms</strong> เหมาะกับการสอบถามกลุ่มคนจำนวนมาก (ตั้งแต่หลักร้อยถึงหลักหมื่นคน)
            </p>
            <div class="space-y-1 text-xs">
              <div class="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ประหยัดเวลา รวดเร็ว ข้อมูลแปลงเป็น Google Sheets ได้ทันที
              </div>
              <div class="text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ไม่สามารถซักถามเชิงลึกได้ และมีโอกาสที่ผู้ตอบจะตอบมั่ว
              </div>
            </div>
          </div>

          <!-- Format 2: Interview -->
          <div class="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
            <div class="flex items-center gap-2.5 text-blue-900 font-bold text-base">
              <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span>การสัมภาษณ์ (Interviews: Structured & Semi-Structured)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              การพูดคุยกับผู้ใช้งานหรือผู้บริหารโดยตรง แบ่งเป็น <strong>แบบมีโครงสร้าง</strong> (ถามตามแบบฟอร์มเป๊ะๆ) และ <strong>แบบกึ่งมีโครงสร้าง</strong> (มีหัวข้อหลักแต่ซักถามต่อได้)
            </p>
            <div class="space-y-1 text-xs">
              <div class="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ได้ Insight เชิงลึก เข้าใจ 'เหตุผล' ที่ตัวเลขในกราฟอธิบายไม่ได้
              </div>
              <div class="text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ใช้เวลานาน ต้นทุนสูง และทำกับกลุ่มตัวอย่างจำนวนมากไม่ได้
              </div>
            </div>
          </div>

          <!-- Format 3: Observation -->
          <div class="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <div class="flex items-center gap-2.5 text-indigo-900 font-bold text-base">
              <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span>การสังเกตการณ์หน้างาน (Field Observation & Behavior Tracking)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              การส่งผู้สำรวจหรือติดตั้งกล้องนับสถิติเพื่อบันทึกพฤติกรรมจริง เช่น สังเกตพฤติกรรมลูกค้าว่าเดินแวะดูเชลฟ์สินค้าใดก่อนในร้านสะดวกซื้อ
            </p>
            <div class="space-y-1 text-xs">
              <div class="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ปราศจากอคติจากการตอบคำถาม (เพราะดูจากการกระทำจริง)
              </div>
              <div class="text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ผู้สำรวจอาจมีอคติในการสังเกต และไม่รู้ความคิดในใจของผู้บริโภค
              </div>
            </div>
          </div>

          <!-- Format 4: Stakeholder Workshop -->
          <div class="p-5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
            <div class="flex items-center gap-2.5 text-purple-900 font-bold text-base">
              <div class="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <span>การประชุมข้อกำหนดร่วม (Requirements Workshop & Joint Session)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              การจัดประชุมระดมความคิดร่วมกันระหว่าง Data Analyst, ฝ่ายการตลาด, ฝ่ายขาย และผู้บริหาร เพื่อตกลงนิยามของตัวชี้วัด (KPIs Definitions) ให้ตรงกัน
            </p>
            <div class="space-y-1 text-xs">
              <div class="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ป้องกันการเข้าใจตัวชี้วัดไม่ตรงกัน (เช่น นิยามคำว่า 'ลูกค้าใหม่')
              </div>
              <div class="text-amber-700 font-semibold flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ต้องใช้ทักษะการประสานงานและการสื่อสารสูง
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Topic 3: Question Design & Data Types Mapping -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            ตอนที่ 3
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Edit3 class="w-6 h-6 text-sky-600" />
            การออกแบบคำถามและการแปลงเป็นประเภทข้อมูล (Question Design & Data Types)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            "ตั้งคำถามแบบไหน จะได้ข้อมูลประเภทใด และวิเคราะห์ต่อได้อย่างไร"
          </p>
        </div>

        <div class="space-y-4">
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
            เมื่อนักศึกษาเปิด Google Forms ขึ้นมาสร้างคำถาม แต่ละตัวเลือกคำถามจะส่งผลโดยตรงต่อชนิดข้อมูล (Data Type) ที่ระบบจะบันทึกในตาราง Excel/Spreadsheets:
          </p>

          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-sky-50 text-sky-900 border-b border-gray-200 font-bold">
                <tr>
                  <th class="p-3">ชนิดคำถามใน Google Forms</th>
                  <th class="p-3">ตัวอย่างคำถาม</th>
                  <th class="p-3">ประเภทข้อมูลที่ได้ (Data Type)</th>
                  <th class="p-3">การคำนวณและชาร์ตที่เหมาะ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-700">
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">1. ตัวเลือกหลายข้อ (Multiple Choice)</td>
                  <td class="p-3">ช่องทางชำระเงินที่ชอบ (เงินสด, โอน, บัตร)</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold">Nominal (เชิงคุณภาพ)</span></td>
                  <td class="p-3">นับจำนวน <code>COUNT</code>, สร้าง Column Chart หรือ Donut Chart</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">2. สเกลเชิงเส้น (Linear Scale 1-5)</td>
                  <td class="p-3">ระดับความพึงพอใจต่อบริการ (1 น้อยสุด - 5 มากสุด)</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-semibold">Ordinal (เรียงอันดับ)</span></td>
                  <td class="p-3">หาค่าเฉลี่ย <code>AVERAGE</code>, <code>MEDIAN</code>, สร้าง Bar Chart จัดอันดับ</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">3. คำตอบสั้นๆ แบบบังคับตัวเลข</td>
                  <td class="p-3">จำนวนแก้วที่ดื่มต่อสัปดาห์ (ระบุตัวเลขจำนวนเต็ม)</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">Quantitative Discrete</span></td>
                  <td class="p-3">หาผลรวม <code>SUM</code>, ค่าเฉลี่ย, ค่าสูงสุด-ต่ำสุด MIN/MAX</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">4. ข้อความย่อหน้า (Paragraph / Text)</td>
                  <td class="p-3">ข้อเสนอแนะเพิ่มเติมเพื่อปรับปรุงบริการ</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-semibold">Unstructured Text</span></td>
                  <td class="p-3">วิเคราะห์ข้อความ (Text Analysis / Word Cloud / Sentiment)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Data Validation Callout Box -->
          <div class="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
            <div class="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck class="w-5 h-5 text-amber-600" />
              <span>เทคนิคสำคัญ: การกำหนดเงื่อนไขความถูกต้องของข้อมูล (Data Validation)</span>
            </div>
            <p class="leading-relaxed">
              ใน Google Forms ให้คลิกที่ <strong>จุดสามจุด (⋮)</strong> มุมล่างขวาของคำถาม แล้วเลือก <strong>"การตรวจสอบการตอบกลับ (Response Validation)"</strong> เสมอ เช่น:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div class="p-2.5 rounded bg-white border border-amber-200">
                <strong>ตรวจอายุ:</strong> กำหนดเป็นตัวเลข &gt; 0 และ &lt; 100 ป้องกันคนกรอกอายุ 999 หรือติดลบ
              </div>
              <div class="p-2.5 rounded bg-white border border-amber-200">
                <strong>ตรวจเบอร์โทร:</strong> กำหนด Regular Expression ให้เป็นตัวเลข 10 หลักขึ้นต้นด้วย 0
              </div>
              <div class="p-2.5 rounded bg-white border border-amber-200">
                <strong>จำเป็นต้องตอบ:</strong> เปิดสวิตช์ Required เพื่อป้องกัน Missing Value (ค่าสูญหาย)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Topic 4: Data Collection Channels & PDPA -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            ตอนที่ 4
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Database class="w-6 h-6 text-sky-600" />
            ช่องทางการเก็บรวบรวมข้อมูลและข้อกำหนดทางกฎหมาย (Collection Channels & PDPA)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            ภาพรวมการไหลเวียนของข้อมูลจากแหล่งกำเนิดสู่ฐานข้อมูล และการคุ้มครองข้อมูลส่วนบุคคล
          </p>
        </div>

        <div class="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <span class="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <Layers class="w-4 h-4 text-sky-600" /> ข้อมูลปฐมภูมิ (Primary Data)
              </span>
              <p class="text-xs text-gray-600 leading-relaxed">
                ข้อมูลที่เก็บรวบรวมขึ้นใหม่โดยตรงด้วยตนเอง เช่น การทำแบบสอบถามออนไลน์, การสัมภาษณ์เชิงลึก, การนับสถิติหน้างาน <strong>ข้อดีคือตรงกับโจทย์เฉพาะของเรา 100%</strong> แต่ใช้เวลาและงบประมาณในการเก็บ
              </p>
            </div>

            <div class="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <span class="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <Globe class="w-4 h-4 text-purple-600" /> ข้อมูลทุติยภูมิ (Secondary Data)
              </span>
              <p class="text-xs text-gray-600 leading-relaxed">
                ข้อมูลที่มีผู้อื่นเก็บรวบรวมและบันทึกไว้ในระบบอยู่แล้ว เช่น ยอดขายในฐานข้อมูล ERP/POS, ข้อมูลสถิติเปิดของภาครัฐ (Data.go.th), ข้อมูลจากรายงานวิจัย <strong>ข้อดีคือรวดเร็วและมีปริมาณมาก</strong>
              </p>
            </div>
          </div>

          <!-- PDPA Compliance Box -->
          <div class="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-2">
            <div class="flex items-center gap-2 font-bold text-rose-900">
              <Shield class="w-5 h-5 text-rose-600" />
              <span>หลักการคุ้มครองข้อมูลส่วนบุคคล (PDPA Compliance) ในการเก็บข้อมูล</span>
            </div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-rose-900/90 leading-relaxed">
              <li><strong>แจ้งวัตถุประสงค์ (Purpose Limitation):</strong> ระบุให้ชัดเจนที่หัวแบบสอบถามว่าจะนำข้อมูลไปใช้ทำอะไร และจะไม่นำไปใช้นอกเหนือจากที่ระบุ</li>
              <li><strong>ขอความยินยอม (Consent):</strong> มีกล่องข้อความให้ผู้ตอบกดยอมรับก่อนเริ่มตอบแบบสอบถาม</li>
              <li><strong>เก็บเฉพาะที่จำเป็น (Data Minimization):</strong> หากไม่จำเป็นต้องใช้ ห้ามถามข้อมูลส่วนบุคคลที่ระบุตัวตนได้ เช่น เลขบัตรประชาชน หรือรูปถ่ายบัตรประชาชน</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Center & Evaluation Section -->
    <section>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
              Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน
            </h2>
            <p class="text-sm text-gray-500 mt-0.5">
              เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน
            </p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-900 to-sky-800 hover:from-sky-800 hover:to-sky-700 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-sky-700 shrink-0">
          <Trophy class="w-5 h-5 text-yellow-400" />
          <span>แดชบอร์ดครูผู้สอน</span>
        </button>
      </div>

      <!-- Navigation Tabs between Games -->
      <div class="flex gap-2 p-1.5 bg-gray-100 rounded-2xl max-w-xl mb-6">
        <button @click="activeGame = 'sort'"
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          :class="activeGame === 'sort' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <Shuffle class="w-4 h-4" />
          มินิเกม 1 (จำแนกช่องทางเก็บข้อมูล)
        </button>
        <button @click="activeGame = 'match'"
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          :class="activeGame === 'match' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <MousePointer2 class="w-4 h-4" />
          มินิเกม 2 (จับคู่วิธีการ)
        </button>
        <button @click="activeGame = 'quiz'"
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          :class="activeGame === 'quiz' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <Star class="w-4 h-4" />
          แบบทดสอบหลังเรียน (10 ข้อ)
        </button>
      </div>

      <!-- Game Container Cards -->
      <div class="space-y-6">
        <!-- Game 1: Drag and Drop -->
        <div v-show="activeGame === 'sort'">
          <DragDropGame :courseId="currentCourseId" :weekNumber="currentWeek" gameId="game-1"
            title="มินิเกม 1: จัดกลุ่มรูปแบบการสอบถามและช่องทางการเก็บรวบรวมข้อมูล"
            description="ลากสถานการณ์การเก็บข้อมูลด้านล่างไปใส่ลงในกล่องช่องทางการรวบรวมข้อมูลที่ถูกต้อง"
            :items="dragItemsData" :zones="dragZonesData" :maxScore="6" />
        </div>

        <!-- Game 2: Matching -->
        <div v-show="activeGame === 'match'">
          <MatchingGame :courseId="currentCourseId" :weekNumber="currentWeek" gameId="game-2"
            title="มินิเกม 2: จับคู่วัตถุประสงค์กับเครื่องมือสอบถามข้อมูล"
            description="จับคู่เครื่องมือหรือรูปแบบการสอบถามทางฝั่งซ้าย กับคำอธิบายวัตถุประสงค์ที่ถูกต้องทางฝั่งขวา"
            :leftTerms="matchLeftTerms" :rightDefs="matchRightDefs" :maxScore="5" />
        </div>

        <!-- Game 3: PopQuiz -->
        <div v-show="activeGame === 'quiz'">
          <PopQuiz :courseId="currentCourseId" :weekNumber="currentWeek" gameId="quiz"
            title="แบบทดสอบหลังเรียน (Post-test): สัปดาห์ที่ 2"
            description="ทดสอบความรู้ความเข้าใจเกี่ยวกับการสอบถามข้อมูล รูปแบบการเก็บรวบรวมข้อมูล และการออกแบบคำถาม (10 ข้อ 10 คะแนน)"
            :questions="quizQuestions" :maxScore="10" />
        </div>
      </div>
    </section>

    <!-- Lab Assignment Section -->
    <AssignmentSection
      :courseId="currentCourseId"
      assignmentId="asm-2"
      assignmentTitle="ใบงานที่ 2: ปฏิบัติการออกแบบเครื่องมือสอบถามและจัดทำข้อกำหนดการเก็บรวบรวมข้อมูล (Data Inquiry & Collection Workshop)"
      :maxScore="10"
      workType="individual"
    >
      <template #content>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          ให้นักศึกษาฝึกปฏิบัติการเป็น <strong>Data Analyst</strong> โดยจำลองการสอบถามความต้องการทางธุรกิจ ออกแบบแบบสอบถามออนไลน์บน Google Forms เพื่อเก็บข้อมูลจริงอย่างน้อย 8 คำถาม พร้อมจัดทำพจนานุกรมข้อมูล (Data Dictionary Table) กำกับชนิดตัวแปรและประเภทข้อมูล
        </p>

        <div class="p-4 rounded-xl bg-sky-50 border border-sky-100 mb-6 space-y-1.5">
          <span class="font-bold text-sky-900 flex items-center gap-2 text-sm">
            <Target class="w-4 h-4 text-sky-600" /> จุดประสงค์การเรียนรู้ประจำใบงาน:
          </span>
          <ul class="text-xs text-sky-950 space-y-1 list-disc pl-5 leading-relaxed">
            <li>สามารถวิเคราะห์โจทย์ธุรกิจและกำหนดคำถาม 5W1H เพื่อระบุตัวแปรข้อมูลได้</li>
            <li>สามารถออกแบบแบบสอบถามออนไลน์ด้วย Google Forms ได้ครบทั้งตัวแปร Nominal, Ordinal, Discrete และ Continuous</li>
            <li>สามารถตั้งค่าการตรวจสอบการตอบกลับ (Data Validation) เพื่อป้องกันข้อมูลขยะได้</li>
            <li>สามารถจัดทำพจนานุกรมข้อมูล (Data Dictionary) เพื่อสรุปโครงสร้างของชุดข้อมูลได้</li>
          </ul>
        </div>

        <!-- Steps List -->
        <ul class="space-y-4 text-sm text-gray-700">
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div>
              <strong>ตอนที่ 1: กำหนดหัวข้อและวิเคราะห์ 5W1H</strong>
              <p class="text-xs text-gray-500 leading-relaxed mt-0.5">
                เลือกหัวข้อธุรกิจที่สนใจ 1 หัวข้อ (เช่น แบบสำรวจความพึงพอใจร้านอาหาร/กาแฟ, พฤติกรรมการใช้จ่ายของนักศึกษา, หรือการประเมินการใช้ห้องปฏิบัติการคอมพิวเตอร์) แล้วเขียนสรุป 5W1H ลงในเอกสาร: Why, What, Who, When, Where, How
              </p>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2
            </div>
            <div>
              <strong>ตอนที่ 2: สร้างแบบสอบถามออนไลน์บน Google Forms</strong>
              <p class="text-xs text-gray-500 leading-relaxed mt-0.5">
                สร้างแบบฟอร์มบน Google Forms อย่างน้อย <strong>8 คำถาม</strong> โดยต้องมีองค์ประกอบครบถ้วน:
              </p>
              <ul class="list-disc pl-5 text-xs text-gray-600 space-y-0.5 mt-1">
                <li>มีข้อความแจ้งวัตถุประสงค์และขอความยินยอม (Consent) ตามหลัก PDPA</li>
                <li>มีคำถามแบบเลือกตอบกลุ่ม (Nominal) เช่น เพศ หรือช่องทางการชำระเงิน</li>
                <li>มีคำถามวัดระดับความพึงพอใจ (Ordinal / Likert Scale 1-5) อย่างน้อย 3 ด้าน</li>
                <li>มีคำถามเชิงตัวเลขจำนวนนับ (Discrete/Continuous) และ<strong>เปิดใช้ Data Validation</strong> บังคับช่วงตัวเลขที่ถูกต้อง</li>
                <li>มีคำถามปลายเปิด (Text) เพื่อรับข้อเสนอแนะเพิ่มเติม</li>
              </ul>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3
            </div>
            <div>
              <strong>ตอนที่ 3: จำลองการเก็บข้อมูลและเชื่อมโยง Google Sheets</strong>
              <p class="text-xs text-gray-500 leading-relaxed mt-0.5">
                ทดลองส่งลิงก์หรือสลับเป็นโหมดพรีวิวเพื่อกรอกข้อมูลตัวอย่างอย่างน้อย <strong>5-10 รายการ</strong> จากนั้นกดสร้างสเปรดชีต (Link to Sheets) เพื่อตรวจสอบโครงสร้างแถวและคอลัมน์ของตารางข้อมูลที่ได้
              </p>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              4
            </div>
            <div>
              <strong>ตอนที่ 4: จัดทำตารางพจนานุกรมข้อมูล (Data Dictionary) และส่งงาน</strong>
              <p class="text-xs text-gray-500 leading-relaxed mt-0.5">
                สร้างตารางสรุปพจนานุกรมข้อมูลในสเปรดชีต ระบุ: <strong>ชื่อคอลัมน์ | ตัวอย่างข้อมูล | ชนิดตัวแปร (Nominal/Ordinal/Discrete/Continuous) | สูตรสถิติที่เหมาะสม | กราฟที่ควรนำเสนอ</strong> จากนั้นคัดลอกลิงก์ Google Forms และลิงก์ Google Sheets (เปิดสิทธิ์ Anyone with the link can view) แนบส่งในระบบ
              </p>
            </div>
          </li>
        </ul>
      </template>
    </AssignmentSection>

    <!-- PDF Modal -->
    <AssignmentPdfModal v-model="showPdfModal" title="สรุปเนื้อหาสัปดาห์ที่ 2: Data Inquiry & Collection"
      subtitle="วิชาการวิเคราะห์และนำเสนอข้อมูล (31901-2012)">
      <template #pdf-content>
        <div class="space-y-6 text-sm text-gray-800 leading-relaxed">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-bold text-sky-900">สรุปสาระสำคัญ: การสอบถามและการเก็บรวบรวมข้อมูล</h3>
            <p class="text-xs text-gray-500">หน่วยที่ 2: Data Inquiry, Formats & Data Collection Methods</p>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-gray-900">1. กรอบแนวคิด 5W1H</h4>
            <p class="text-xs text-gray-600">
              Why (ทำไมต้องเก็บ) - What (เก็บตัวแปรใดบ้าง) - Who (ใครคือกลุ่มเป้าหมาย) - When (ช่วงเวลาใด) - Where (แหล่งข้อมูลอยู่ที่ไหน) - How (ใช้เครื่องมืออะไร)
            </p>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-gray-900">2. การจับคู่คำถามกับประเภทข้อมูล</h4>
            <ul class="list-disc pl-5 text-xs text-gray-600 space-y-1">
              <li>Multiple Choice &rarr; Nominal Data (นับความถี่ COUNT)</li>
              <li>Linear Scale 1-5 &rarr; Ordinal Data (หาค่าเฉลี่ย AVERAGE, MEDIAN)</li>
              <li>ตัวเลขจำนวนนับ &rarr; Discrete/Continuous Data (หาผลรวม SUM, ค่าเฉลี่ย, MIN/MAX)</li>
              <li>Paragraph &rarr; Unstructured Text Data (วิเคราะห์ข้อความ)</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-gray-900">3. ข้อควรระวัง PDPA</h4>
            <p class="text-xs text-gray-600">
              แจ้งวัตถุประสงค์ให้ชัดเจน, ขอความยินยอม (Consent) ก่อนเสมอ และเก็บเฉพาะข้อมูลที่จำเป็นต่อการวิเคราะห์ (Data Minimization)
            </p>
          </div>
        </div>
      </template>
    </AssignmentPdfModal>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal v-model="showTeacherModal" :courseId="currentCourseId" :weekNumber="currentWeek"
      courseName="การวิเคราะห์และนำเสนอข้อมูล" :games="weekGames" />

  </div>
</template>
