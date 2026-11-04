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
  ShieldCheck, Filter, Globe, Download, Send, Search, AlertTriangle, Coffee, Table,
  HelpCircle as QuestionIcon, AlertOctagon, User, Link as LinkIcon, Presentation,
  Building2
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import SlidePreviewModal from '@/components/SlidePreviewModal.vue'
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
const showSlideModal = ref(false)

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

// Interactive Demo State for 6 Form Input Types (Internal IT & Workplace Service Survey)
const activeDemoTab = ref('mc') // 'mc' | 'scale' | 'discrete' | 'continuous' | 'datetime' | 'text'
const demoInputs = ref({
  multipleChoice: 'ฝ่ายการตลาด (Marketing)',
  linearScale: 4,
  discreteNumber: 3,
  continuousNumber: 1.50,
  dateTime: '2026-11-04T12:30',
  paragraphText: 'อยากให้มีระบบแจ้งเตือนสถานะงานซ่อมผ่าน Line Notify และเพิ่มทีมงานแก้ไขด่วนช่วงบ่ายครับ'
})

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
          เจาะลึกทักษะหัวใจของ Data Analyst: การสอบถามความต้องการทางธุรกิจ (Requirements Gathering), กรอบ 5W1H,
          การออกแบบเครื่องมือสอบถาม (Survey, Interview, Observation), การจับคู่คำถามกับระดับการวัดข้อมูล (NOIR)
          และการป้องกันข้อมูลขยะด้วย Data Validation
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
          <div class="p-5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
            <div class="flex items-center gap-2 text-sky-900 font-bold text-base">
              <Target class="w-5 h-5 text-sky-600" />
              <span>1. ผลลัพธ์การเรียนรู้ (Learning Outcome)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ผู้เรียนสามารถวิเคราะห์ความต้องการของผู้ใช้ ออกแบบเครื่องมือสอบถามข้อมูล
              และวางแผนเก็บรวบรวมข้อมูลได้อย่างถูกต้องตามหลักสถิติและกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </div>

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

          <div class="p-5 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-2">
            <div class="flex items-center gap-2 text-cyan-900 font-bold text-base">
              <Award class="w-5 h-5 text-cyan-600" />
              <span>3. การวัดและประเมินผล (Assessment)</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ประเมินจากใบงานปฏิบัติการออกแบบแบบสอบถาม (10 คะแนน), การมีส่วนร่วมในมินิเกมจำแนกข้อมูล
              และแบบทดสอบหลังเรียน (Post-test 10 ข้อ)
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Case Study Banner: Real-world Context -->
    <div
      class="p-6 rounded-2xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 text-white shadow-md relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
        <Coffee class="w-64 h-64 -translate-y-12 translate-x-12" />
      </div>
      <div class="relative z-10 max-w-4xl space-y-3">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <Lightbulb class="w-3.5 h-3.5 text-yellow-300" /> กรณีศึกษาจุดประกายความคิด (Case Study)
        </div>
        <h3 class="text-xl sm:text-2xl font-bold leading-tight">
          เมื่อร้านชานม "Teaboss Cafe" ยอดขายตกช่วงบ่าย 14:00 - 16:00 น.
        </h3>
        <p class="text-xs sm:text-sm text-sky-100 leading-relaxed">
          เจ้าของร้าน <strong>"เดาเอาเอง"</strong> ว่าลูกค้าน่าจะไม่ชอบรสหวาน จึงสั่งปรับสูตรชาและลดราคาลง 20%
          แต่ผลลัพธ์คือยอดขายยิ่งลดลงและขาดทุนเพิ่ม! <br />
          ทว่าเมื่อ <strong>Data Analyst</strong> เข้ามาทำ <strong>Data Inquiry (สอบถามข้อมูลอย่างเป็นระบบ)</strong>
          โดยสำรวจลูกค้าในละแวกนั้น พบความจริงว่า: <span class="text-yellow-300 font-bold">"ลูกค้าชอบรสชาติเดิมมาก
            แต่ช่วง 14:00 - 16:00 น. หน้าร้านมีรถจอดขวางจนหาที่จอดไม่ได้ และไม่มีบริการสั่งผ่านแอปเดลิเวอรีเลย"</span>
          <br />
          บทเรียนนี้ชี้ชัดว่า: <strong>"อย่าเพิ่งวิเคราะห์ข้อมูล ถ้าคุณยังไม่ได้สอบถามหาปัญหาที่แท้จริง!"</strong>
        </p>
      </div>
    </div>

    <!-- Detailed Lecture Modules -->
    <section class="space-y-10">
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

      <!-- Module 1: Data Inquiry & 5W1H Framework -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 1
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Search class="w-6 h-6 text-sky-600" />
            การสอบถามข้อมูลเพื่อระบุความต้องการ (Data Inquiry & Requirement Gathering)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            กระบวนการสืบค้นและทำความเข้าใจเป้าหมายที่แท้จริงของผู้มีส่วนได้ส่วนเสีย (Stakeholders)
          </p>
        </div>

        <div class="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>
            การเริ่มต้นโปรเจกต์ข้อมูลโดยไม่มี <strong>Data Inquiry</strong>
            เปรียบเหมือนหมอที่สั่งจ่ายยาโดยไม่ซักประวัติคนไข้ สิ่งที่ Data Analyst ต้องค้นหาให้พบประกอบด้วย 3 มิติหลัก:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl border border-sky-100 bg-sky-50/50 space-y-1.5">
              <span class="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                <Target class="w-4 h-4 text-sky-600" /> 1. Business Objective
              </span>
              <p class="text-xs text-gray-600">
                เป้าหมายทางธุรกิจคืออะไร เช่น ต้องการเพิ่มกำไร 15%, ลดเวลาการรอคอยของลูกค้า, หรือปรับปรุงหลักสูตรการสอน
              </p>
            </div>
            <div class="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1.5">
              <span class="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                <BarChart3 class="w-4 h-4 text-blue-600" /> 2. Success Metric (KPI)
              </span>
              <p class="text-xs text-gray-600">
                จะวัดความสำเร็จด้วยตัวเลขใด เช่น คะแนนความพึงพอใจเฉลี่ย (CSAT), ยอดสั่งซื้อซ้ำ (Repeat Order),
                หรืออัตราการเข้าเรียน
              </p>
            </div>
            <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-1.5">
              <span class="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                <Database class="w-4 h-4 text-indigo-600" /> 3. Required Data Points
              </span>
              <p class="text-xs text-gray-600">
                ต้องใช้ตัวแปรใดบ้างในการคำนวณ และมีแหล่งข้อมูลอยู่แล้วหรือต้องสร้างเครื่องมือขึ้นมาเก็บใหม่
              </p>
            </div>
          </div>

          <!-- 5W1H Deep Dive Table -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-sky-200/80 space-y-3">
            <h4 class="font-bold text-sky-950 flex items-center gap-2 text-base">
              <HelpCircle class="w-5 h-5 text-sky-600" />
              กรอบการวิเคราะห์ 5W1H สำหรับการตั้งคำถามสืบค้นข้อมูล
            </h4>
            <div class="overflow-x-auto rounded-xl border border-sky-100 bg-white shadow-2xs">
              <table class="w-full text-left text-xs sm:text-sm">
                <thead class="bg-sky-100/70 text-sky-900 font-bold border-b border-sky-200">
                  <tr>
                    <th class="p-3 w-28">คำถาม</th>
                    <th class="p-3 w-52">มิติการสืบค้น (Focus Area)</th>
                    <th class="p-3">ตัวอย่างการประยุกต์ใช้ในโจทย์จริง</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td class="p-3 font-bold text-sky-800">WHY (ทำไม)</td>
                    <td class="p-3 text-xs font-semibold">เหตุผล & วัตถุประสงค์หลัก</td>
                    <td class="p-3 text-xs">ทำไมผู้บริหารจึงอยากทำแบบสำรวจนี้? นำผลลัพธ์ไปตัดสินใจเรื่องใด? (เช่น
                      ปรับปรุงบริการโรงอาหาร)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-sky-800">WHAT (อะไร)</td>
                    <td class="p-3 text-xs font-semibold">ตัวแปรและข้อมูลที่จำเป็น</td>
                    <td class="p-3 text-xs">ต้องการข้อมูลด้านใดบ้าง? (รสชาติ, ราคา, ความสะอาด, ความรวดเร็ว,
                      ช่วงเวลาที่มารับประทาน)</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-sky-800">WHO (ใคร)</td>
                    <td class="p-3 text-xs font-semibold">กลุ่มเป้าหมายผู้ให้ข้อมูล</td>
                    <td class="p-3 text-xs">ใครคือผู้ตอบ? (นักศึกษา ปวช., ปวส., ครูอาจารย์, หรือบุคคลภายนอก)
                      ต้องสุ่มตัวอย่างกี่คน?</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-sky-800">WHEN (เมื่อใด)</td>
                    <td class="p-3 text-xs font-semibold">กรอบเวลาและความถี่</td>
                    <td class="p-3 text-xs">เก็บข้อมูลช่วงเวลาใด? (ก่อนสอบ, หลังเปิดเทอม, พักเที่ยง)
                      เก็บครั้งเดียวหรือเก็บทุกสัปดาห์?</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-sky-800">WHERE (ที่ไหน)</td>
                    <td class="p-3 text-xs font-semibold">ขอบเขตสถานที่และแหล่งข้อมูล</td>
                    <td class="p-3 text-xs">เก็บที่โรงอาหารอาคาร 1 หรืออาคาร 2? แจกผ่าน QR Code หน้าร้าน
                      หรือส่งลิงก์เข้ากลุ่ม LINE?</td>
                  </tr>
                  <tr>
                    <td class="p-3 font-bold text-sky-800">HOW (อย่างไร)</td>
                    <td class="p-3 text-xs font-semibold">เครื่องมือและวิธีการจัดเก็บ</td>
                    <td class="p-3 text-xs">จะใช้ Google Forms แบบออนไลน์ หรือเดินสัมภาษณ์สุ่ม 50 คน
                      หรือดึงยอดขายจากเครื่อง POS?</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 2: Inquiry Formats & Methodologies -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 2
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <ClipboardList class="w-6 h-6 text-sky-600" />
            รูปแบบและเครื่องมือในการสอบถามข้อมูล (Inquiry Formats & Methodologies)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            การเลือกใช้วิธีการสอบถามให้เหมาะสมกับขนาดกลุ่มตัวอย่าง ระยะเวลา และงบประมาณ
          </p>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Format 1 -->
            <div class="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-3">
              <div class="flex items-center gap-2.5 text-sky-900 font-bold text-base">
                <div
                  class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <span>แบบสอบถามออนไลน์ (Online Questionnaires / Surveys)</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                สร้างด้วย <strong>Google Forms, Microsoft Forms, Typeform</strong> เหมาะกับการสอบถามกลุ่มคนจำนวนมาก
                (ตั้งแต่หลักร้อยถึงหลักหมื่นคน) สามารถกระจายผ่าน QR Code, SMS หรือ Social Media ได้ทันที
              </p>
              <div class="p-3 rounded-xl bg-white border border-sky-100 space-y-1 text-xs">
                <div class="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ได้ข้อมูลปริมาณมาก รวดเร็ว ส่งออกเข้า Google Sheets
                  อัตโนมัติ
                </div>
                <div class="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ไม่สามารถซักถามต่อได้ และอาจมีอัตราการตอบไม่ครบถ้วน
                  (Incomplete)
                </div>
              </div>
            </div>

            <!-- Format 2 -->
            <div class="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div class="flex items-center gap-2.5 text-blue-900 font-bold text-base">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span>การสัมภาษณ์ (Interviews: Structured & Semi-Structured)</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                การพูดคุยตัวต่อตัวกับผู้ใช้งานหรือผู้บริหาร แบ่งเป็น <strong>แบบมีโครงสร้าง (ถามตามข้อ)</strong> และ
                <strong>แบบกึ่งมีโครงสร้าง (มีหัวข้อหลักแต่เปิดให้ถามเจาะลึกได้)</strong>
              </p>
              <div class="p-3 rounded-xl bg-white border border-blue-100 space-y-1 text-xs">
                <div class="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ได้ Insight เชิงลึก เข้าใจ 'ทำไม' และ 'ความรู้สึก'
                  ที่ตัวเลขในกราฟบอกไม่ได้
                </div>
                <div class="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ใช้เวลาและแรงงานสูง ไม่เหมาะกับกลุ่มตัวอย่างขนาดใหญ่
                </div>
              </div>
            </div>

            <!-- Format 3 -->
            <div class="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div class="flex items-center gap-2.5 text-indigo-900 font-bold text-base">
                <div
                  class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span>การสังเกตการณ์หน้างาน (Field Observation & Behavior Tracking)</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                การบันทึกพฤติกรรมจริงของผู้ใช้งานโดยไม่มีการสอบถาม เช่น การยืนจับเวลาลูกค้าต่อคิวจ่ายเงิน,
                การนับจำนวนคนที่เดินผ่านประตู, หรือการติดตั้งกล้องตรวจจับความหนาแน่น
              </p>
              <div class="p-3 rounded-xl bg-white border border-indigo-100 space-y-1 text-xs">
                <div class="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: ปราศจากอคติจากการตอบคำถาม (เพราะวัดจากการกระทำจริง)
                </div>
                <div class="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: ไม่ทราบเหตุผลในใจ และอาจมีอคติของผู้สังเกต (Observer
                  Bias)
                </div>
              </div>
            </div>

            <!-- Format 4 -->
            <div class="p-5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
              <div class="flex items-center gap-2.5 text-purple-900 font-bold text-base">
                <div
                  class="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span>การสนทนากลุ่มและการประชุมเชิงปฏิบัติการ (Focus Group & Workshop)</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                การรวมกลุ่มผู้ใช้งานหรือตัวแทนแผนก 6–10 คน เพื่อระดมความคิดเห็น อภิปรายปัญหา
                และสร้างข้อตกลงร่วมกันเกี่ยวกับนิยามตัวแปรข้อมูล
              </p>
              <div class="p-3 rounded-xl bg-white border border-purple-100 space-y-1 text-xs">
                <div class="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> ข้อดี: เกิดการต่อยอดความคิดเห็น (Brainstorming)
                  และเห็นมุมมองรอบด้าน
                </div>
                <div class="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> ข้อจำกัด: อาจถูกครอบงำด้วยความคิดเห็นของบุคคลที่มีอิทธิพลในกลุ่ม
                  (Groupthink)
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison Matrix Table -->
          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-100 text-slate-800 font-bold border-b border-gray-200">
                <tr>
                  <th class="p-3">รูปแบบการสอบถาม</th>
                  <th class="p-3">ขนาดกลุ่มตัวอย่าง</th>
                  <th class="p-3">ระยะเวลา & ต้นทุน</th>
                  <th class="p-3">ความลึกของข้อมูล (Depth)</th>
                  <th class="p-3">ระดับความเสี่ยงของอคติ (Bias)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-700">
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">แบบสอบถามออนไลน์ (Survey)</td>
                  <td class="p-3">ขนาดใหญ่มาก (&gt; 500 คน)</td>
                  <td class="p-3 text-emerald-700 font-semibold">ต่ำมาก (ประหยัดสุด)</td>
                  <td class="p-3 text-amber-700">ระดับภาพรวม (กว้างแต่ไม่ลึก)</td>
                  <td class="p-3">ปานกลาง (ตอบส่งเดช / ตอบเอาใจ)</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">การสัมภาษณ์เชิงลึก (Interview)</td>
                  <td class="p-3">ขนาดเล็ก (5–20 คน)</td>
                  <td class="p-3 text-rose-700 font-semibold">สูง (ใช้เวลามาก)</td>
                  <td class="p-3 text-emerald-700 font-bold">ลึกมาก (เข้าใจเหตุผลที่มา)</td>
                  <td class="p-3">ต่ำ (หากผู้สัมภาษณ์ไม่ถามชี้นำ)</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">การสังเกตการณ์ (Observation)</td>
                  <td class="p-3">ปานกลาง (100–300 เคส)</td>
                  <td class="p-3 text-amber-700 font-semibold">ปานกลาง</td>
                  <td class="p-3">พฤติกรรมจริงในสถานการณ์</td>
                  <td class="p-3 text-emerald-700 font-bold">ต่ำมาก (ไม่มีคำโกหก)</td>
                </tr>
                <tr class="hover:bg-gray-50/80">
                  <td class="p-3 font-semibold text-sky-900">สนทนากลุ่ม (Focus Group)</td>
                  <td class="p-3">กลุ่มเล็ก (1–3 กลุ่ม)</td>
                  <td class="p-3 text-amber-700 font-semibold">ปานกลาง-สูง</td>
                  <td class="p-3 text-emerald-700">ลึกในมิติการแลกเปลี่ยน</td>
                  <td class="p-3">ปานกลาง (คล้อยตามคนเสียงดัง)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Module 3: Question Design, Traps & Data Types -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 3
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Edit3 class="w-6 h-6 text-sky-600" />
            ศิลปะการออกแบบคำถามและการแปลงเป็นประเภทข้อมูล (Question Design & Data Types)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            "ตั้งคำถามอย่างไรให้ได้คำตอบจริง ไม่ชี้นำ และเชื่อมโยงสู่การวิเคราะห์ทางสถิติได้อย่างถูกต้อง"
          </p>
        </div>

        <div class="space-y-6">
          <!-- 5 Traps to Avoid -->
          <div class="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <h4 class="font-bold text-rose-950 flex items-center gap-2 text-base">
              <AlertTriangle class="w-5 h-5 text-rose-600" />
              5 กับดักข้อผิดพลาดที่ห้ามทำในการออกแบบคำถาม (Common Questionnaire Traps)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1">
                <span class="font-bold text-rose-800">1. คำถามชี้นำ (Leading Question)</span>
                <p class="text-gray-500">ใส่คำโน้มน้าวทำให้ผู้ตอบเลือกข้าง</p>
                <div class="text-[11px] text-rose-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">ผิด</span>
                  <span>ท่านคิดว่าอาหารร้านเราสะอาดและอร่อยมากใช่ไหม?</span>
                </div>
                <div class="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">ถูก</span>
                  <span>ท่านประเมินรสชาติอาหารของร้านเราในระดับใด?</span>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1">
                <span class="font-bold text-rose-800">2. คำถามสองประเด็นในข้อเดียว (Double-Barreled)</span>
                <p class="text-gray-500">ถาม 2 เรื่องพร้อมกันจนผู้ตอบไม่รู้จะตอบอันไหน</p>
                <div class="text-[11px] text-rose-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">ผิด</span>
                  <span>ท่านพึงพอใจต่อราคาและความเร็วในการเสิร์ฟหรือไม่?</span>
                </div>
                <div class="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">ถูก</span>
                  <span>แยกเป็น 2 ข้อ: ด้านราคา (1 ข้อ) และด้านความเร็ว (1 ข้อ)</span>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1">
                <span class="font-bold text-rose-800">3. ตัวเลือกทับซ้อนกัน (Overlapping Choices)</span>
                <p class="text-gray-500">ช่วงตัวเลขชนกันทำให้ผู้ตอบสับสน</p>
                <div class="text-[11px] text-rose-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">ผิด</span>
                  <span>อายุ [15-20], [20-25], [25-30] (คนอายุ 20 จะเลือกช่องไหน?)</span>
                </div>
                <div class="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">ถูก</span>
                  <span>อายุ [15-19], [20-24], [25-29] ปี</span>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1">
                <span class="font-bold text-rose-800">4. คำถามคลุมเครือไม่ระบุเวลา (Vague Question)</span>
                <p class="text-gray-500">ถามคำว่า 'บ่อยแค่ไหน' ซึ่งแต่ละคนนิยามไม่เท่ากัน</p>
                <div class="text-[11px] text-rose-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">ผิด</span>
                  <span>ปกติท่านซื้อเครื่องดื่มบ่อยแค่ไหน?</span>
                </div>
                <div class="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">ถูก</span>
                  <span>ในรอบ 7 วันที่ผ่านมา ท่านซื้อเครื่องดื่มกี่ครั้ง?</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Question Type to Data Type Mapping Table -->
          <div class="space-y-3">
            <h4 class="font-bold text-sky-950 flex items-center gap-2 text-base">
              <Table class="w-5 h-5 text-sky-600" />
              ตารางจับคู่ชนิดคำถามใน Google Forms สู่ประเภทข้อมูลและสถิติ (Data Types Mapping)
            </h4>
            <div class="overflow-x-auto rounded-xl border border-gray-200">
              <table class="w-full text-left text-xs sm:text-sm">
                <thead class="bg-sky-50 text-sky-900 border-b border-gray-200 font-bold">
                  <tr>
                    <th class="p-3">ชนิดคำถามใน Google Forms</th>
                    <th class="p-3">ตัวอย่างคำถาม</th>
                    <th class="p-3">ระดับการวัดทางสถิติ (NOIR)</th>
                    <th class="p-3">สูตรสถิติที่คำนวณได้</th>
                    <th class="p-3">กราฟที่เหมาะสมที่สุด</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700">
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">หลายตัวเลือก (Multiple Choice)</td>
                    <td class="p-3 text-xs">เพศ, จังหวัด, ช่องทางชำระเงิน</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-xs">Nominal
                        (นามบัญญัติ)</span></td>
                    <td class="p-3 text-xs"><code>COUNT</code>, <code>MODE</code> (ฐานนิยม)</td>
                    <td class="p-3 text-xs font-semibold">Bar Chart, Donut Chart</td>
                  </tr>
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">สเกลเชิงเส้น (Linear Scale 1-5)</td>
                    <td class="p-3 text-xs">ความพึงพอใจ (1 น้อยสุด - 5 มากสุด)</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-xs">Ordinal
                        (เรียงลำดับ)</span></td>
                    <td class="p-3 text-xs"><code>AVERAGE</code>, <code>MEDIAN</code>, SD</td>
                    <td class="p-3 text-xs font-semibold">Stacked Bar Chart, Radar Chart</td>
                  </tr>
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">คำตอบสั้นๆ แบบบังคับตัวเลข</td>
                    <td class="p-3 text-xs">จำนวนครั้งที่เข้าใช้, จำนวนแก้วที่ซื้อ</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">Discrete
                        (จำนวนเต็ม)</span></td>
                    <td class="p-3 text-xs"><code>SUM</code>, <code>AVERAGE</code>, MIN/MAX</td>
                    <td class="p-3 text-xs font-semibold">Column Chart, Histogram</td>
                  </tr>
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">คำตอบสั้นๆ (ทศนิยม/ยอดเงิน)</td>
                    <td class="p-3 text-xs">ค่าใช้จ่ายเฉลี่ยต่อมื้อ (บาท)</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-xs">Continuous
                        (ต่อเนื่อง)</span></td>
                    <td class="p-3 text-xs"><code>SUM</code>, <code>AVERAGE</code>, MIN, MAX</td>
                    <td class="p-3 text-xs font-semibold">Box Plot, Scatter Plot</td>
                  </tr>
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">วันที่ / เวลา (Date / Time)</td>
                    <td class="p-3 text-xs">วันเวลาที่เข้ามาใช้บริการ</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-xs">Time
                        Series (ช่วงเวลา)</span></td>
                    <td class="p-3 text-xs">นับความถี่ตามชั่วโมง, เดือน, วัน</td>
                    <td class="p-3 text-xs font-semibold">Line Chart (ดูกราฟแนวโน้ม)</td>
                  </tr>
                  <tr class="hover:bg-gray-50/80">
                    <td class="p-3 font-semibold text-sky-900">ย่อหน้า (Paragraph Text)</td>
                    <td class="p-3 text-xs">ข้อเสนอแนะเพิ่มเติมเพื่อปรับปรุง</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-xs">Unstructured
                        Text</span></td>
                    <td class="p-3 text-xs">Text Analytics, Word Cloud</td>
                    <td class="p-3 text-xs font-semibold">Word Cloud, Sentiment Bar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Interactive Form Input Sandbox (ห้องทดลอง Input เสมือนจริง) -->
          <div
            class="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg space-y-6 border border-indigo-900/60">
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/70 pb-4">
              <div>
                <span
                  class="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-400/30">
                  Interactive Sandbox
                </span>
                <h4 class="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                  <Sparkles class="w-5 h-5 text-yellow-400" />
                  ห้องทดลองชนิดคำถามเสมือนจริง (Live Form Inputs & Data Inspector)
                </h4>
                <p class="text-xs text-slate-300 mt-0.5">
                  กดทดลองคลิก/พิมพ์กรอกข้อมูลแต่ละชนิดคำถาม เพื่อดูว่าหลังบ้านของ Data Analyst
                  จะได้รับข้อมูลเป็นประเภทใดและบันทึกลงตารางอย่างไร
                </p>
              </div>
            </div>

            <!-- Tabs Selection (6 Types) -->
            <div class="flex flex-wrap gap-1.5 p-1.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
              <button @click="activeDemoTab = 'mc'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'mc' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>1. หลายตัวเลือก (Nominal)</span>
              </button>
              <button @click="activeDemoTab = 'scale'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'scale' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>2. สเกล 1-5 (Ordinal)</span>
              </button>
              <button @click="activeDemoTab = 'discrete'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'discrete' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>3. ตัวเลขเต็ม (Discrete)</span>
              </button>
              <button @click="activeDemoTab = 'continuous'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'continuous' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>4. ทศนิยม/ยอดเงิน (Continuous)</span>
              </button>
              <button @click="activeDemoTab = 'datetime'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'datetime' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>5. วันที่/เวลา (DateTime)</span>
              </button>
              <button @click="activeDemoTab = 'text'"
                class="px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeDemoTab === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'">
                <span>6. ย่อหน้า (Text)</span>
              </button>
            </div>

            <!-- Tab Content (Split-view: Form UI vs Inspector) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              <!-- LEFT COLUMN: Form Input UI (Google Forms Style) -->
              <div
                class="lg:col-span-6 bg-white text-slate-800 rounded-2xl p-5 sm:p-6 shadow-md border-t-4 border-indigo-600 space-y-4">
                <div
                  class="text-xs text-indigo-600 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>หน้าต่างผู้ตอบแบบสอบถาม (Google Form UI)</span>
                  <span class="text-rose-500 font-mono text-[11px]">* บังคับตอบ</span>
                </div>

                <!-- 1. Multiple Choice -->
                <div v-if="activeDemoTab === 'mc'" class="space-y-3">
                  <div class="font-bold text-slate-900 text-sm sm:text-base">
                    แผนกหรือฝ่ายงานที่ท่านสังกัดในปัจจุบัน <span class="text-rose-500">*</span>
                  </div>
                  <div class="space-y-2 text-xs sm:text-sm">
                    <label
                      v-for="opt in ['ฝ่ายขาย (Sales)', 'ฝ่ายการตลาด (Marketing)', 'ฝ่ายบัญชีและการเงิน (Accounting)', 'ฝ่ายผลิตและคลังสินค้า (Operations)']"
                      :key="opt" class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                      :class="demoInputs.multipleChoice === opt ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-2xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'">
                      <input type="radio" v-model="demoInputs.multipleChoice" :value="opt"
                        class="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer" />
                      <span>{{ opt }}</span>
                    </label>
                  </div>
                </div>

                <!-- 2. Linear Scale as Range Slider -->
                <div v-if="activeDemoTab === 'scale'" class="space-y-4">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="font-bold text-slate-900 text-sm sm:text-base">
                        ระดับความพึงพอใจต่อความรวดเร็วและคุณภาพในการให้บริการ <span class="text-rose-500">*</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-0.5">ลากแถบเลื่อนสเกล (Range Slider) เพื่อกำหนดคะแนน 1 ถึง 5
                      </p>
                    </div>
                    <span
                      class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs shrink-0 font-mono">
                      {{ demoInputs.linearScale }} / 5
                    </span>
                  </div>

                  <!-- Range Slider Box -->
                  <div
                    class="p-4 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-blue-50/40 rounded-2xl border border-indigo-100 space-y-3">
                    <!-- Star Rating Display -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1">
                        <Star v-for="s in 5" :key="s" class="w-5 h-5 transition-transform"
                          :class="s <= demoInputs.linearScale ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-300'" />
                      </div>
                      <span class="text-xs font-bold text-indigo-700">
                        {{ demoInputs.linearScale === 1 ? '1: น้อยที่สุด' : demoInputs.linearScale === 2 ? '2: น้อย' :
                          demoInputs.linearScale === 3 ? '3: ปานกลาง' : demoInputs.linearScale === 4 ? '4: มาก' :
                            '5:มากที่สุด' }}
                      </span>
                    </div>

                    <!-- Interactive Range Slider -->
                    <div class="space-y-1.5 pt-1">
                      <input type="range" min="1" max="5" step="1" v-model.number="demoInputs.linearScale"
                        class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all" />

                      <!-- Scale Ticks -->
                      <div class="flex justify-between text-xs font-mono font-bold px-1 text-slate-400">
                        <span v-for="val in [1, 2, 3, 4, 5]" :key="val" @click="demoInputs.linearScale = val"
                          class="cursor-pointer hover:text-indigo-600 transition-all"
                          :class="demoInputs.linearScale === val ? 'text-indigo-600 scale-125 font-black' : ''">
                          {{ val }}
                        </span>
                      </div>
                    </div>

                    <!-- Footnote Range Legend -->
                    <div class="flex justify-between text-[11px] text-slate-500 border-t border-indigo-100/70 pt-2">
                      <span>1 (ระดับต่ำสุด)</span>
                      <span>3 (ระดับปานกลาง)</span>
                      <span>5 (ระดับสูงสุด)</span>
                    </div>
                  </div>
                </div>

                <!-- 3. Discrete Number -->
                <div v-if="activeDemoTab === 'discrete'" class="space-y-3">
                  <div class="font-bold text-slate-900 text-sm sm:text-base">
                    ในรอบ 1 เดือนที่ผ่านมา ท่านแจ้งขอรับบริการหรือแจ้งซ่อมกี่ครั้ง? (ระบุจำนวนเต็ม) <span
                      class="text-rose-500">*</span>
                  </div>
                  <div class="space-y-1">
                    <input type="number" min="0" max="50" step="1" v-model.number="demoInputs.discreteNumber"
                      class="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-mono text-base outline-none"
                      placeholder="เช่น 1, 2, 3..." />
                    <div class="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                      เปิด Validation: บังคับจำนวนเต็มบวก 0–50 ครั้ง
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button v-for="n in [1, 3, 5, 7]" :key="n" @click="demoInputs.discreteNumber = n" type="button"
                      class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer">
                      ทดลองใส่: {{ n }}
                    </button>
                  </div>
                </div>

                <!-- 4. Continuous Number -->
                <div v-if="activeDemoTab === 'continuous'" class="space-y-3">
                  <div class="font-bold text-slate-900 text-sm sm:text-base">
                    ระยะเวลาเฉลี่ยที่ท่านต้องรอคอยตั้งแต่แจ้งปัญหาจนเริ่มแก้ไข (ชั่วโมง) <span
                      class="text-rose-500">*</span>
                  </div>
                  <div class="space-y-1">
                    <div class="relative">
                      <input type="number" min="0" step="0.25" v-model.number="demoInputs.continuousNumber"
                        class="w-full p-3 pr-16 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-mono text-base outline-none"
                        placeholder="เช่น 1.50" />
                      <span class="absolute right-4 top-3.5 text-xs text-slate-400 font-semibold">ชั่วโมง</span>
                    </div>
                    <div class="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                      เปิด Validation: บังคับตัวเลขทศนิยม &gt;= 0.00 ชั่วโมง
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button v-for="p in [0.50, 1.50, 2.75]" :key="p" @click="demoInputs.continuousNumber = p"
                      type="button"
                      class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer">
                      ทดลองใส่: {{ p.toFixed(2) }} ชม.
                    </button>
                  </div>
                </div>

                <!-- 5. Date & Time -->
                <div v-if="activeDemoTab === 'datetime'" class="space-y-3">
                  <div class="font-bold text-slate-900 text-sm sm:text-base">
                    วันและเวลาที่ท่านพบปัญหาหรือขอรับบริการล่าสุด <span class="text-rose-500">*</span>
                  </div>
                  <div class="space-y-1">
                    <input type="datetime-local" v-model="demoInputs.dateTime"
                      class="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-mono text-sm outline-none" />
                    <div class="text-[11px] text-slate-500">
                      Google Form บันทึกรูปแบบ ISO 8601 (YYYY-MM-DD HH:mm)
                    </div>
                  </div>
                </div>

                <!-- 6. Paragraph Text -->
                <div v-if="activeDemoTab === 'text'" class="space-y-3">
                  <div class="font-bold text-slate-900 text-sm sm:text-base">
                    ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงการให้บริการและระบบงานในองค์กร (ปลายเปิด)
                  </div>
                  <textarea rows="3" v-model="demoInputs.paragraphText"
                    class="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm outline-none resize-none leading-relaxed"
                    placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."></textarea>
                  <div class="text-[11px] text-slate-400">
                    ความยาว: {{ demoInputs.paragraphText.length }} ตัวอักษร
                  </div>
                </div>
              </div>

              <!-- RIGHT COLUMN: Data Analyst Live Inspector -->
              <div
                class="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 font-mono text-xs">
                <div class="flex items-center justify-between text-slate-400 font-sans border-b border-slate-800 pb-2">
                  <span class="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Search class="w-4 h-4 text-cyan-400" />
                    หลังบ้าน Data Analyst (Live Data Inspector)
                  </span>
                  <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Real-time Sync</span>
                </div>

                <!-- Captured Raw Value -->
                <div class="space-y-1">
                  <div class="text-slate-400 font-sans text-[11px]">1. ข้อมูลดิบที่ระบบดึงได้ (Captured Raw Value):
                  </div>
                  <div class="p-3 rounded-xl bg-black/60 border border-slate-800 text-emerald-400 break-all font-bold">
                    <template v-if="activeDemoTab === 'mc'">"{{ demoInputs.multipleChoice }}"</template>
                    <template v-else-if="activeDemoTab === 'scale'">{{ demoInputs.linearScale }}</template>
                    <template v-else-if="activeDemoTab === 'discrete'">{{ demoInputs.discreteNumber }}</template>
                    <template v-else-if="activeDemoTab === 'continuous'">{{
                      Number(demoInputs.continuousNumber).toFixed(2) }}</template>
                    <template v-else-if="activeDemoTab === 'datetime'">"{{ demoInputs.dateTime }}"</template>
                    <template v-else-if="activeDemoTab === 'text'">"{{ demoInputs.paragraphText }}"</template>
                  </div>
                </div>

                <!-- Data Type Classification -->
                <div class="space-y-1.5">
                  <div class="text-slate-400 font-sans text-[11px]">2. การจำแนกประเภทข้อมูล (Data Classification):</div>
                  <div class="grid grid-cols-2 gap-2 font-sans">
                    <div class="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      <span class="text-slate-400 text-[10px] block">กลุ่มข้อมูลหลัก</span>
                      <span class="font-bold"
                        :class="['mc', 'scale', 'text'].includes(activeDemoTab) ? 'text-amber-400' : 'text-emerald-400'">
                        {{ ['mc', 'scale', 'text'].includes(activeDemoTab) ? 'Qualitative (เชิงคุณภาพ)' : 'Quantitative (เชิงปริมาณ)' }}
                      </span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      <span class="text-slate-400 text-[10px] block">ระดับการวัด (Scale)</span>
                      <span class="font-bold text-cyan-300">
                        <template v-if="activeDemoTab === 'mc'">Nominal (นามบัญญัติ)</template>
                        <template v-else-if="activeDemoTab === 'scale'">Ordinal (เรียงลำดับ)</template>
                        <template v-else-if="activeDemoTab === 'discrete'">Discrete (จำนวนเต็ม)</template>
                        <template v-else-if="activeDemoTab === 'continuous'">Continuous (ต่อเนื่อง)</template>
                        <template v-else-if="activeDemoTab === 'datetime'">Time Series / Date</template>
                        <template v-else-if="activeDemoTab === 'text'">Unstructured Text</template>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Real Spreadsheet Table Simulation -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-slate-400 font-sans text-[11px]">
                    <span class="flex items-center gap-1.5 font-bold text-emerald-400">
                      <FileSpreadsheet class="w-3.5 h-3.5" /> 3. ตัวอย่างการบันทึกในตาราง Google Sheets (Form
                      Responses):
                    </span>
                    <span class="text-[10px] text-slate-400">Sheet: Form Responses 1</span>
                  </div>

                  <!-- Google Sheets Simulated Grid Table -->
                  <div class="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 shadow-inner">
                    <table class="w-full text-left text-[11px] font-mono border-collapse">
                      <!-- Column Headers: Index, A, B, C -->
                      <thead class="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px]">
                        <tr>
                          <th class="w-7 p-1.5 text-center bg-slate-800/80 border-r border-slate-700 text-slate-400">#
                          </th>
                          <th
                            class="p-1.5 border-r border-slate-800 font-sans font-bold text-center text-slate-300 w-36">
                            A</th>
                          <th
                            class="p-1.5 border-r border-slate-800 font-sans font-bold text-center text-slate-300 w-28">
                            B</th>
                          <th class="p-1.5 font-sans font-bold text-center text-slate-300">C</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800">
                        <!-- Row 1: Header Titles -->
                        <tr class="bg-slate-900/90 text-slate-300 font-sans font-bold text-[10.5px]">
                          <td
                            class="p-1.5 text-center bg-slate-800/60 border-r border-slate-700 font-mono text-slate-400">
                            1</td>
                          <td class="p-1.5 border-r border-slate-800 text-slate-300">Timestamp</td>
                          <td class="p-1.5 border-r border-slate-800 text-slate-300">Respondent_ID</td>
                          <td class="p-1.5 text-cyan-300">
                            <template v-if="activeDemoTab === 'mc'">Department_Name</template>
                            <template v-else-if="activeDemoTab === 'scale'">Satisfaction_Score (1-5)</template>
                            <template v-else-if="activeDemoTab === 'discrete'">Request_Count</template>
                            <template v-else-if="activeDemoTab === 'continuous'">Resolution_Hours</template>
                            <template v-else-if="activeDemoTab === 'datetime'">Incident_Timestamp</template>
                            <template v-else-if="activeDemoTab === 'text'">Suggestions_Text</template>
                          </td>
                        </tr>
                        <!-- Row 2: Live Active Response (Selected) -->
                        <tr class="bg-indigo-950/40 text-emerald-400">
                          <td
                            class="p-1.5 text-center bg-indigo-900/50 border-r border-slate-700 font-mono text-cyan-300 font-bold">
                            2
                          </td>
                          <td class="p-1.5 border-r border-slate-800 text-slate-400 whitespace-nowrap text-[10.5px]">
                            2026-11-04 12:30:15
                          </td>
                          <td class="p-1.5 border-r border-slate-800 text-cyan-300 font-bold whitespace-nowrap">RESP-001
                          </td>
                          <td
                            class="p-1.5 text-amber-300 font-bold bg-amber-400/10 border-2 border-amber-400/50 rounded-sm">
                            <template v-if="activeDemoTab === 'mc'">"{{ demoInputs.multipleChoice }}"</template>
                            <template v-else-if="activeDemoTab === 'scale'">{{ demoInputs.linearScale }}</template>
                            <template v-else-if="activeDemoTab === 'discrete'">{{ demoInputs.discreteNumber
                            }}</template>
                            <template v-else-if="activeDemoTab === 'continuous'">{{
                              Number(demoInputs.continuousNumber).toFixed(2) }}</template>
                            <template v-else-if="activeDemoTab === 'datetime'">"{{ demoInputs.dateTime }}"</template>
                            <template v-else-if="activeDemoTab === 'text'">"{{ demoInputs.paragraphText }}"</template>
                          </td>
                        </tr>
                        <!-- Row 3: Sample Past Row -->
                        <tr class="bg-slate-950 text-slate-500 text-[10px]">
                          <td
                            class="p-1 text-center bg-slate-900/40 border-r border-slate-700 font-mono text-slate-600">3
                          </td>
                          <td class="p-1 border-r border-slate-800 whitespace-nowrap">2026-11-04 12:28:40</td>
                          <td class="p-1 border-r border-slate-800 whitespace-nowrap">RESP-000</td>
                          <td class="p-1 text-slate-500 truncate max-w-[200px]">
                            <template v-if="activeDemoTab === 'mc'">"ฝ่ายบัญชีและการเงิน (Accounting)"</template>
                            <template v-else-if="activeDemoTab === 'scale'">3</template>
                            <template v-else-if="activeDemoTab === 'discrete'">2</template>
                            <template v-else-if="activeDemoTab === 'continuous'">0.75</template>
                            <template v-else-if="activeDemoTab === 'datetime'">"2026-11-04 11:15"</template>
                            <template v-else-if="activeDemoTab === 'text'">"การประสานงานรวดเร็วดีมาก
                              แต่ขอให้มีคู่มือวิธีแก้ปัญหาเบื้องต้นด้วยครับ"</template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Analysis & Visualization Formula -->
                <div class="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/60 font-sans text-xs space-y-1">
                  <div class="font-bold text-indigo-300 flex items-center gap-1.5">
                    <BarChart3 class="w-3.5 h-3.5 text-indigo-400" /> สูตรคำนวณและชาร์ตที่เหมาะ:
                  </div>
                  <p class="text-slate-300 text-[11px] leading-relaxed">
                    <template v-if="activeDemoTab === 'mc'">
                      ใช้สูตร <code>=COUNTIF(C:C, "*การตลาด*")</code> เพื่อนับสัดส่วนแต่ละแผนก และสร้างเป็น
                      <strong>Donut Chart หรือ Bar Chart</strong>
                    </template>
                    <template v-else-if="activeDemoTab === 'scale'">
                      ใช้สูตร <code>=AVERAGE(C:C)</code> และ <code>=MEDIAN(C:C)</code> เพื่อหาคะแนนความพึงพอใจเฉลี่ย
                      นำเสนอด้วย <strong>Stacked Bar Chart</strong>
                    </template>
                    <template v-else-if="activeDemoTab === 'discrete'">
                      ใช้สูตร <code>=SUM(C:C)</code> หารวมจำนวนครั้งที่แจ้งซ่อม และ <code>=AVERAGE(C:C)</code>
                      นำเสนอด้วย <strong>Histogram / Bar Chart</strong>
                    </template>
                    <template v-else-if="activeDemoTab === 'continuous'">
                      ใช้สูตร <code>=AVERAGE(C:C)</code>, <code>=MIN(C:C)</code>, <code>=MAX(C:C)</code> หาระยะเวลาแก้ไข
                      นำเสนอด้วย <strong>Box Plot / Scatter Plot</strong>
                    </template>
                    <template v-else-if="activeDemoTab === 'datetime'">
                      ใช้สูตรจัดกลุ่มตามชั่วโมง/วัน เพื่อหาช่วงเวลาแจ้งซ่อมหนาแน่น (Peak Hours) นำเสนอด้วย <strong>Line
                        Chart (กราฟเส้นแสดงแนวโน้ม)</strong>
                    </template>
                    <template v-else-if="activeDemoTab === 'text'">
                      ใช้เทคนิค Text Mining วิเคราะห์คำสำคัญยอดฮิต (Keywords) นำเสนอด้วย <strong>Word Cloud หรือตาราง
                        Sentiment Analysis</strong>
                    </template>
                  </p>
                </div>
              </div>

            </div>
          </div>

          <!-- Data Validation Deep Dive -->
          <div
            class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-3">
            <div class="flex items-center gap-2 font-bold text-amber-900 text-base">
              <ShieldCheck class="w-5 h-5 text-amber-600" />
              <span>เทคนิคขั้นสูง: การตั้งค่า Data Validation ป้องกันข้อมูลขยะใน Google Forms</span>
            </div>
            <p class="leading-relaxed">
              กว่า 70% ของเวลาทำงาน Data Analyst มักหมดไปกับการทำความสะอาดข้อมูล (Data Cleaning)
              แต่เราสามารถลดภาระนี้ได้ตั้งแต่ต้นทางด้วยการเปิดใช้ <strong>"การตรวจสอบการตอบกลับ (Response
                Validation)"</strong>:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div class="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <span class="font-bold text-amber-800 font-sans block">1. ล็อกช่วงตัวเลขอายุ</span>
                <div class="text-slate-600">ประเภท: ตัวเลข (Number)</div>
                <div class="text-slate-600">เงื่อนไข: ระหว่าง 1 ถึง 100</div>
                <div class="text-rose-600 text-[11px] pt-1 font-sans">กันคนพิมพ์ "อายุ 500" หรือ "-10"</div>
              </div>

              <div class="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <span class="font-bold text-amber-800 font-sans block">2. ล็อกรูปแบบเบอร์โทรศัพท์</span>
                <div class="text-slate-600">ประเภท: Regular Expression</div>
                <div class="text-slate-600">รูปแบบ: ^0[0-9]{9}$</div>
                <div class="text-rose-600 text-[11px] pt-1 font-sans">บังคับตัวเลข 10 หลักขึ้นต้นด้วย 0</div>
              </div>

              <div class="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <span class="font-bold text-amber-800 font-sans block">3. สวิตช์บังคับกรอก (Required)</span>
                <div class="text-slate-600">ประเภท: Toggle Switch</div>
                <div class="text-slate-600">เปิดเป็น ON สำหรับข้อสำคัญ</div>
                <div class="text-rose-600 text-[11px] pt-1 font-sans">ป้องกันค่าว่าง (Missing Value)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 4: Collection Channels, Pipeline & PDPA -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 4
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Database class="w-6 h-6 text-sky-600" />
            ช่องทางการเก็บรวบรวมข้อมูลและกฎหมายคุ้มครองข้อมูลส่วนบุคคล (Collection Channels & PDPA)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            สถาปัตยกรรมการไหลของข้อมูลจากแหล่งกำเนิด และหลักธรรมาภิบาลข้อมูล
          </p>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-2">
              <span class="font-bold text-sky-900 flex items-center gap-2 text-base">
                <Layers class="w-5 h-5 text-sky-600" /> ข้อมูลปฐมภูมิ (Primary Data)
              </span>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                ข้อมูลที่นักวิเคราะห์เป็นผู้ลงมือเก็บรวบรวมขึ้นมาใหม่ด้วยตนเอง เช่น การทำแบบสำรวจ Google Forms,
                การสัมภาษณ์ลูกค้า หรือการนับสถิติหน้างาน
              </p>
              <div class="pt-2 text-xs text-sky-800 font-semibold">
                จุดเด่น: ตรงกับวัตถุประสงค์เฉพาะของเรา 100% และควบคุมคุณภาพได้ตั้งแต่ต้นทาง
              </div>
            </div>

            <div class="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
              <span class="font-bold text-purple-900 flex items-center gap-2 text-base">
                <Globe class="w-5 h-5 text-purple-600" /> ข้อมูลทุติยภูมิ (Secondary Data)
              </span>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                ข้อมูลที่มีผู้อื่นเก็บรวบรวมและจัดเก็บไว้ในระบบอยู่แล้ว เช่น ฐานข้อมูลการขาย (POS Database),
                ข้อมูลเปิดภาครัฐ
                (Data.go.th), หรือรายงานสถิติของธนาคาร
              </p>
              <div class="pt-2 text-xs text-purple-800 font-semibold">
                จุดเด่น: ประหยัดเวลา ได้ข้อมูลปริมาณมหาศาลทันที ไม่ต้องรบกวนเวลาของผู้ตอบ
              </div>
            </div>
          </div>

          <!-- Deep Dive: PDPA Legal Requirements & Data Protection -->
          <div
            class="p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-red-50/60 border border-rose-200/90 shadow-sm space-y-6 text-xs sm:text-sm text-slate-800">
            <div class="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 font-bold text-rose-900 text-base">
                <div
                  class="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-base sm:text-lg">การคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                    และข้อพิจารณาทางกฎหมายในการเก็บรวบรวมข้อมูล</h4>
                  <p class="text-[11px] text-rose-700 font-normal">พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal
                    Data
                    Protection Act) สำหรับนักวิเคราะห์ข้อมูล</p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] self-start sm:self-auto border border-rose-200">
                มีผลบังคับใช้ตามกฎหมาย
              </span>
            </div>

            <!-- 1. Difference: General PII vs Sensitive PII -->
            <div class="space-y-3">
              <h5 class="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <AlertOctagon class="w-4 h-4 text-rose-600" />
                1. ต้องแยกแยะให้ออก: ข้อมูลส่วนบุคคลทั่วไป VS ข้อมูลส่วนบุคคลที่อ่อนไหว (Sensitive Data)
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <div class="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-indigo-700">
                    <User class="w-3.5 h-3.5" /> ข้อมูลส่วนบุคคลทั่วไป (General Personal Data)
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    ข้อมูลที่สามารถระบุตัวตนบุคคลนั้นได้ไม่ว่าทางตรงหรือทางอ้อม เช่น <strong>ชื่อ-นามสกุล,
                      หมายเลขโทรศัพท์,
                      ที่อยู่อีเมล, เลขบัตรประชาชน, ทะเบียนรถ, พิกัด GPS, IP Address, หรือรูปถ่ายใบหน้า</strong>
                  </p>
                  <div class="text-[11px] text-indigo-800 font-semibold bg-indigo-50 p-2 rounded-lg">
                    เกณฑ์การเก็บ: ต้องแจ้งวัตถุประสงค์ (Privacy Notice) และได้รับความยินยอม (Consent) ก่อนเก็บรวบรวมเสมอ
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-1.5">
                  <div class="font-bold text-rose-800 flex items-center gap-1.5 text-xs">
                    <AlertTriangle class="w-3.5 h-3.5 text-rose-600" /> ข้อมูลส่วนบุคคลที่มีความอ่อนไหว (Sensitive PII -
                    ม.26)
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    ข้อมูลที่มีความเสี่ยงสูงต่อการเลือกปฏิบัติและกระทบต่อสิทธิอย่างร้ายแรง ได้แก่ <strong>เชื้อชาติ,
                      เผ่าพันธุ์, ความคิดเห็นทางการเมือง, ความเชื่อทางศาสนา, พฤติกรรมทางเพศ, ประวัติอาชญากรรม,
                      ข้อมูลสุขภาพ/ความพิการ, และข้อมูลไบโอเมตริกซ์ (ลายนิ้วมือ/สแกนใบหน้า)</strong>
                  </p>
                  <div class="text-[11px] text-rose-900 font-bold bg-rose-100/80 p-2 rounded-lg">
                    ข้อควรระวังขั้นเด็ดขาด: ห้ามจัดเก็บในแบบสอบถามทั่วไปโดยเด็ดขาด!
                    การเก็บโดยไม่มีฐานกฎหมายรองรับมีโทษทางอาญา
                    (จำคุกสูงสุด 1 ปี หรือปรับสูงสุด 1-5 ล้านบาท)
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Legal Precautions (4 Must-Know Principles) -->
            <div class="space-y-3">
              <h5 class="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Shield class="w-4 h-4 text-sky-600" />
                2. ข้อควรระวัง 4 ประการทางกฎหมายในการเก็บข้อมูลผ่านแบบสอบถาม (Legal Precautions)
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1.5">
                  <span class="font-bold text-rose-900 flex items-center gap-1">
                    <CheckSquare class="w-3.5 h-3.5 text-rose-600" /> 1. ความยินยอมโดยอิสระ
                  </span>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    การขอ Consent ต้องให้ผู้ตอบเป็นคนกดเลือกเอง <strong>ห้ามทำเครื่องหมายติ๊กถูกไว้ล่วงหน้า (Pre-ticked
                      box)</strong> และต้องถอนความยินยอมได้ง่ายเท่ากับตอนให้
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1.5">
                  <span class="font-bold text-rose-900 flex items-center gap-1">
                    <Target class="w-3.5 h-3.5 text-rose-600" /> 2. การจำกัดวัตถุประสงค์
                  </span>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    แจ้งว่าจะนำข้อมูลไปใช้วิจัยเรื่องใด
                    <strong>ห้ามนำไปใช้ผิดวัตถุประสงค์โดยไม่ได้รับอนุญาตใหม่</strong>
                    (เช่น แจ้งว่าสำรวจอาหาร แต่แอบนำเบอร์โทรไปขายต่อให้บริษัทประกัน)
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1.5">
                  <span class="font-bold text-rose-900 flex items-center gap-1">
                    <Filter class="w-3.5 h-3.5 text-rose-600" /> 3. เก็บเฉพาะเท่าที่จำเป็น
                  </span>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    (Data Minimization) หากโจทย์ต้องการทราบเพียง <em>"ความพึงพอใจแยกตามเพศหรือระดับชั้น"</em>
                    <strong>ไม่จำเป็นต้องถามชื่อ นามสกุล หรือเลขบัตรประชาชน</strong>
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1.5">
                  <span class="font-bold text-rose-900 flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5 text-rose-600" /> 4. มีกำหนดเวลาจัดเก็บ
                  </span>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    (Storage Limitation) ต้องระบุว่าชุดข้อมูลนี้จะถูกเก็บไว้นานเท่าใด (เช่น สิ้นสุดภาคการศึกษา 2/2569)
                    และเมื่อเสร็จสิ้นการวิเคราะห์จะต้องลบทำลายทิ้ง
                  </p>
                </div>
              </div>
            </div>

            <!-- 3. Technical Safeguards (How Analysts Protect Data) -->
            <div class="space-y-3">
              <h5 class="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Lock class="w-4 h-4 text-emerald-600" />
                3. แนวทางปฏิบัติและมาตรการคุ้มครองข้อมูลทางเทคนิคของ Data Analyst (Data Protection Measures)
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div class="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                  <div class="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck class="w-4 h-4" /> 1. การนิรนามข้อมูล (Anonymization)
                  </div>
                  <p class="text-[11px] text-slate-300 leading-relaxed font-sans">
                    การตัดข้อมูลที่ระบุตัวตนออกอย่างถาวร (เช่น ตัดชื่อและเบอร์โทรทิ้ง)
                    จนไม่สามารถเชื่อมโยงกลับไปยังตัวบุคคลจริงได้อีกเลย ซึ่ง<strong>ข้อมูลที่ผ่านการ Anonymize แล้ว
                      จะไม่จัดเป็นข้อมูลส่วนบุคคลตาม PDPA อีกต่อไป</strong> ทำให้นำไปวิเคราะห์และทำ Dashboard
                    เผยแพร่ได้อย่างปลอดภัย 100%
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                  <div class="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Code class="w-4 h-4" /> 2. การแฝงข้อมูล (Pseudonymization & Masking)
                  </div>
                  <p class="text-[11px] text-slate-300 leading-relaxed font-sans">
                    การแทนที่ข้อมูลระบุตัวตนด้วยรหัสเทียม เช่น แทนชื่อ "นายสมชาย ใจดี" ด้วย <code
                      class="text-cyan-300 font-mono">USER_0481</code> หรือการมาสก์ข้อมูลสำคัญ เช่น เบอร์โทรศัพท์ <code
                      class="text-cyan-300 font-mono">081-xxx-5678</code>
                    เพื่อให้คนที่ดูข้อมูลไม่มีทางรู้ตัวตนจริงของผู้ตอบ
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                  <div class="font-bold text-amber-400 flex items-center gap-1.5">
                    <Lock class="w-4 h-4" /> 3. การควบคุมสิทธิ์การเข้าถึง (Access Control)
                  </div>
                  <p class="text-[11px] text-slate-300 leading-relaxed font-sans">
                    ไฟล์ผลลัพธ์ใน Google Sheets หรือฐานข้อมูล SQL <strong>ต้องไม่แชร์เป็น Public Link (Anyone with the
                      link
                      can edit)</strong> แต่ต้องจำกัดสิทธิ์เฉพาะผู้มีหน้าที่วิเคราะห์เท่านั้น (Least Privilege
                    Principle)
                    เพื่อป้องกันข้อมูลลูกค้ารั่วไหลสู่ภายนอก
                  </p>
                </div>
              </div>
            </div>

            <!-- 4. PDPA Checklist for Students -->
            <div class="p-4 rounded-xl bg-white border border-rose-200 space-y-2">
              <span class="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-rose-800">
                <CheckSquare class="w-4 h-4 text-rose-600" /> รายการตรวจสอบ (PDPA Checklist) ก่อนกดแชร์แบบสอบถาม Google
                Forms:
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div class="flex items-start gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>มีข้อความแจ้งวัตถุประสงค์และชื่อผู้จัดทำไว้ที่ส่วนหัวแบบฟอร์มอย่างชัดเจน</span>
                </div>
                <div class="flex items-start gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>มี Checkbox ขอความยินยอม (Consent) ให้ผู้ตอบกดยอมรับก่อนเข้าสู่คำถามถัดไป</span>
                </div>
                <div class="flex items-start gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>ไม่มีการสอบถามข้อมูลอ่อนไหว เช่น โรคประจำตัว, ศาสนา หรือเลขบัตรประชาชน</span>
                </div>
                <div class="flex items-start gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>ไฟล์ Google Sheets ที่เชื่อมโยง ตั้งค่าสิทธิ์เป็น Viewer
                    หรือจำกัดสิทธิ์เฉพาะอาจารย์ผู้ตรวจ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 5: Data Dictionary Model Example -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 5
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <FileSpreadsheet class="w-6 h-6 text-sky-600" />
            ตัวอย่างพจนานุกรมข้อมูลฉบับสมบูรณ์ (Complete Data Dictionary Model)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            แม่แบบมาตรฐานที่นักศึกษาต้องใช้จัดทำในใบงานที่ 2 เมื่อส่งออกข้อมูลจาก Google Forms สู่ Google Sheets
          </p>
        </div>

        <div class="space-y-4">
          <p class="text-gray-700 text-sm leading-relaxed">
            เมื่อรวบรวมข้อมูลเสร็จแล้ว Data Analyst ต้องจัดทำ <strong>Data Dictionary</strong> ในแท็บชีตใหม่
            เพื่ออธิบายโครงสร้างคอลัมน์ทั้งหมดของตาราง:
          </p>

          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-900 text-slate-100 border-b border-slate-800 font-bold font-sans">
                <tr>
                  <th class="p-3">Column Name</th>
                  <th class="p-3">คำอธิบาย</th>
                  <th class="p-3">ประเภทข้อมูล (Data Type)</th>
                  <th class="p-3">ระดับสถิติ</th>
                  <th class="p-3">สูตรสถิติที่เหมาะสม</th>
                  <th class="p-3">ชาร์ตแนะนำ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-800 bg-white">
                <tr>
                  <td class="p-3 font-bold text-sky-700">Timestamp</td>
                  <td class="p-3 font-sans">วันและเวลาที่ตอบแบบสอบถาม</td>
                  <td class="p-3 text-purple-700">DateTime</td>
                  <td class="p-3 font-sans">ช่วงเวลา</td>
                  <td class="p-3">COUNT ตามวัน/เวลา</td>
                  <td class="p-3 font-sans">Line Chart</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Student_Level</td>
                  <td class="p-3 font-sans">ระดับชั้น (ปวช. / ปวส.)</td>
                  <td class="p-3 text-indigo-700">Text / Categorical</td>
                  <td class="p-3 font-sans">Nominal</td>
                  <td class="p-3">COUNT, MODE</td>
                  <td class="p-3 font-sans">Donut Chart</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Visits_Per_Week</td>
                  <td class="p-3 font-sans">ความถี่ในการใช้บริการต่อสัปดาห์</td>
                  <td class="p-3 text-emerald-700">Integer (ตัวเลขเต็ม)</td>
                  <td class="p-3 font-sans">Discrete</td>
                  <td class="p-3">SUM, AVERAGE</td>
                  <td class="p-3 font-sans">Column Chart</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Avg_Expense</td>
                  <td class="p-3 font-sans">ยอดเงินใช้จ่ายเฉลี่ยต่อมื้อ (บาท)</td>
                  <td class="p-3 text-teal-700">Decimal (ทศนิยม)</td>
                  <td class="p-3 font-sans">Continuous</td>
                  <td class="p-3">AVERAGE, MIN, MAX</td>
                  <td class="p-3 font-sans">Histogram / Box Plot</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Taste_Rating</td>
                  <td class="p-3 font-sans">ความพึงพอใจต่อรสชาติ (1-5)</td>
                  <td class="p-3 text-blue-700">Rating Scale 1-5</td>
                  <td class="p-3 font-sans">Ordinal</td>
                  <td class="p-3">AVERAGE, MEDIAN</td>
                  <td class="p-3 font-sans">Stacked Bar Chart</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Payment_Method</td>
                  <td class="p-3 font-sans">ช่องทางชำระเงินที่ใช้บ่อยสุด</td>
                  <td class="p-3 text-indigo-700">Text / Categorical</td>
                  <td class="p-3 font-sans">Nominal</td>
                  <td class="p-3">COUNT, % Ratio</td>
                  <td class="p-3 font-sans">Bar Chart</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-700">Feedback_Text</td>
                  <td class="p-3 font-sans">ข้อเสนอแนะเพิ่มเติมเพื่อปรับปรุง</td>
                  <td class="p-3 text-amber-700">Long Text</td>
                  <td class="p-3 font-sans">Unstructured</td>
                  <td class="p-3">Text Analytics</td>
                  <td class="p-3 font-sans">Word Cloud / Summary</td>
                </tr>
              </tbody>
            </table>
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
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="activeGame === 'sort' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <Shuffle class="w-4 h-4" />
          มินิเกม 1 (จำแนกช่องทางเก็บข้อมูล)
        </button>
        <button @click="activeGame = 'match'"
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="activeGame === 'match' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <MousePointer2 class="w-4 h-4" />
          มินิเกม 2 (จับคู่วิธีการ)
        </button>
        <button @click="activeGame = 'quiz'"
          class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          :class="activeGame === 'quiz' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
          <Star class="w-4 h-4" />
          แบบทดสอบหลังเรียน (10 ข้อ)
        </button>
      </div>

      <!-- Game Container Cards -->
      <div class="space-y-6">
        <!-- Game 1: Drag and Drop -->
        <DragDropGame v-if="activeGame === 'sort'" :courseId="currentCourseId" :week="currentWeek" gameId="game-1"
          title="มินิเกม 1: จัดกลุ่มรูปแบบการสอบถามและช่องทางการเก็บรวบรวมข้อมูล"
          subtitle="ลากสถานการณ์การเก็บข้อมูลด้านล่างไปใส่ลงในกล่องช่องทางการรวบรวมข้อมูลที่ถูกต้อง"
          :initialItems="dragItemsData" :zones="dragZonesData" />

        <!-- Game 2: Matching -->
        <MatchingGame v-if="activeGame === 'match'" :courseId="currentCourseId" :week="currentWeek" gameId="game-2"
          title="มินิเกม 2: จับคู่วัตถุประสงค์กับเครื่องมือสอบถามข้อมูล"
          subtitle="จับคู่เครื่องมือหรือรูปแบบการสอบถามทางฝั่งซ้าย กับคำอธิบายวัตถุประสงค์ที่ถูกต้องทางฝั่งขวา"
          :initialLeftTerms="matchLeftTerms" :initialRightDefs="matchRightDefs" />

        <!-- Game 3: PopQuiz -->
        <PopQuiz v-if="activeGame === 'quiz'" :courseId="currentCourseId" :week="currentWeek" gameId="quiz"
          title="แบบทดสอบหลังเรียน (Post-test): สัปดาห์ที่ 2"
          subtitle="ทดสอบความรู้ความเข้าใจเกี่ยวกับการสอบถามข้อมูล รูปแบบการเก็บรวบรวมข้อมูล และการออกแบบคำถาม (10 ข้อ 10 คะแนน)"
          :questions="quizQuestions" />
      </div>
    </section>

    <!-- Lab Assignment Section -->
    <AssignmentSection :courseId="currentCourseId" assignmentId="asm-2"
      assignmentTitle="ใบงานที่ 2: การวิเคราะห์และวางแผนเก็บรวบรวมข้อมูลเพื่อพัฒนาองค์กร (Data Collection for Organizational Development)"
      :maxScore="10" workType="individual">
      <template #number>2</template>
      <template #description>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          ให้นักศึกษาฝึกปฏิบัติการเป็น <strong>Data Analyst เพื่อพัฒนาองค์กร (งานเดี่ยว)</strong>
          โดยเลือกปัญหาหรือประเด็นการดำเนินงานในองค์กร บริษัท หรือสถานศึกษา 1 เรื่อง
          นำมาวิเคราะห์และสร้างเครื่องมือแบบสอบถามออนไลน์ จากนั้นสรุปเนื้อหาเป็นสไลด์เพื่อนำเสนอหน้าห้องเรียน
        </p>

        <!-- Quick Roadmap Box (สรุปงานให้เห็นภาพรวมใน 1 นาที) -->
        <div
          class="mb-5 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 shadow-2xs">
          <div class="flex items-center gap-2 mb-2">
            <Building2 class="w-4 h-4 text-sky-600" />
            <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider">สรุปงานนี้ทำอะไร และส่งอะไรบ้าง?
              (Quick Summary)</h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div class="p-2.5 rounded-xl bg-white border border-sky-100 flex items-start gap-2">
              <span
                class="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">1</span>
              <div>
                <strong class="text-slate-800">เลือก 1 ปัญหาในองค์กร:</strong>
                <p class="text-slate-500 text-[11px] mt-0.5">เลือกจาก 5 ธีมการพัฒนาองค์กร หรือระบบงานจริง</p>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-indigo-100 flex items-start gap-2">
              <span
                class="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">2</span>
              <div>
                <strong class="text-indigo-900">วิเคราะห์ข้อมูลที่ต้องใช้:</strong>
                <p class="text-slate-500 text-[11px] mt-0.5">หาว่าต้องเก็บข้อมูลอะไรบ้าง เพื่อตอบโจทย์ปัญหา</p>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-blue-100 flex items-start gap-2">
              <span
                class="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">3</span>
              <div>
                <strong class="text-blue-900">ชิ้นงานที่ 1: Google Form</strong>
                <p class="text-slate-500 text-[11px] mt-0.5">สร้างแบบสอบถามออนไลน์จริง มีคำถาม 5–6 ข้อ</p>
              </div>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-purple-100 flex items-start gap-2">
              <span
                class="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">4</span>
              <div>
                <strong class="text-purple-900">ชิ้นงานที่ 2: สไลด์ Canva </strong>
                <p class="text-slate-500 text-[11px] mt-0.5">สรุปผลการวิเคราะห์ ตัวอย่างตารางข้อมูล และแผนงาน</p>
              </div>
            </div>
          </div>
          <div
            class="mt-3 pt-2.5 border-t border-sky-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span class="text-slate-600 flex items-center gap-1 font-medium">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
              <strong>สิ่งที่ต้องส่ง:</strong> แนบ <strong>2 ลิงก์</strong> (ลิงก์ Form + ลิงก์ Canva) ในระบบเท่านั้น
              (ไม่ต้องพิมพ์รายงานเล่ม)
            </span>
            <div class="flex items-center gap-2">
              <span class="text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                นำเสนอหน้าห้องคนละ 3 นาที
              </span>
              <button @click="showSlideModal = true" type="button"
                class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all">
                <Presentation class="w-3.5 h-3.5" /> ดูตัวอย่างสไลด์
              </button>
            </div>
          </div>
        </div>

        <!-- Objectives Box -->
        <div class="mb-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
          <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-indigo-600" />
            จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>1. วิเคราะห์ปัญหาการทำงานในองค์กรและกำหนดเป้าหมายด้วย 5W1H ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>2. กำหนดและจำแนกตัวแปรข้อมูล (5–6 ข้อ) ที่จำเป็นต่อการพัฒนาองค์กรได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>3. สร้างแบบสอบถามออนไลน์ (Google Form) ที่ถูกต้องตามหลัก Workplace PDPA ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span>4. สรุปเนื้อหาและตัวอย่างตารางข้อมูลใส่สไลด์ Canva พร้อมนำเสนอได้อย่างมั่นใจ</span>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <ul class="space-y-6 text-sm text-gray-700">

          <!-- ขั้นตอนที่ 1 -->
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-7 h-7 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              1
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <strong class="text-slate-900 text-sm">ขั้นตอนที่ 1: เลือกหัวข้อปัญหาการดำเนินงานในองค์กร 1 เรื่อง
                  (เลือก 1 จาก 5 ธีม)</strong>
                <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">เลือก 1 เรื่อง</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                ให้นักศึกษาเลือกปัญหาในการทำงานหรือระบบบริการในองค์กร <strong>จำนวน 1 เรื่อง</strong>
                เพื่อใช้เป็นโจทย์ในการวิเคราะห์และสร้างแบบสอบถาม (หรือเลือกจากระบบงานจริงในวิทยาลัย/ที่ฝึกงานได้):
              </p>

              <!-- 5 Organizational Improvement Themes Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2">
                <!-- Theme 1 -->
                <div
                  class="p-3 rounded-xl bg-white border border-sky-200 hover:border-sky-400 transition-all shadow-2xs">
                  <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">ธีมที่ 1: IT &
                    Helpdesk</span>
                  <h5 class="font-bold text-slate-800 text-xs mt-1">คุณภาพการบริการ IT Support องค์กร</h5>
                  <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                    เวลารอคอยแก้ไขปัญหาระบบคอมฯ เน็ตหลุด อุปกรณ์ขัดข้อง และความพึงพอใจต่อช่าง IT
                  </p>
                </div>

                <!-- Theme 2 -->
                <div
                  class="p-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 transition-all shadow-2xs">
                  <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">ธีมที่ 2: HR &
                    พนักงาน</span>
                  <h5 class="font-bold text-slate-800 text-xs mt-1">ความผูกพันและภาวะหมดไฟในการทำงาน</h5>
                  <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                    ชั่วโมงทำงานล่วงเวลา ความเครียดสะสม และความพึงพอใจต่อสวัสดิการของพนักงาน
                  </p>
                </div>

                <!-- Theme 3 -->
                <div
                  class="p-3 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow-2xs">
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">ธีมที่ 3:
                    บริการลูกค้า (CS)</span>
                  <h5 class="font-bold text-slate-800 text-xs mt-1">ความพึงพอใจในการให้บริการลูกค้าหน้าร้าน</h5>
                  <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                    ระยะเวลารอคอยคิว ความสุภาพของพนักงาน และข้อร้องเรียนจากลูกค้าที่มาใช้บริการ
                  </p>
                </div>

                <!-- Theme 4 -->
                <div
                  class="p-3 rounded-xl bg-white border border-amber-200 hover:border-amber-400 transition-all shadow-2xs">
                  <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">ธีมที่ 4:
                    คลังสินค้า & จัดส่ง</span>
                  <h5 class="font-bold text-slate-800 text-xs mt-1">ปัญหาการส่งมอบสินค้าล่าช้าและสต็อกสินค้า</h5>
                  <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                    ความผิดพลาดในการแพ็กของ ระยะเวลาจัดส่ง และการประสานงานระหว่างฝ่ายขายกับคลัง
                  </p>
                </div>

                <!-- Theme 5 -->
                <div
                  class="p-3 rounded-xl bg-white border border-purple-200 hover:border-purple-400 transition-all shadow-2xs sm:col-span-2 lg:col-span-2">
                  <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">ธีมที่ 5:
                    สำนักงาน & อุปกรณ์</span>
                  <h5 class="font-bold text-slate-800 text-xs mt-1">คุณภาพสิ่งแวดล้อมและสิ่งอำนวยความสะดวกในสำนักงาน
                  </h5>
                  <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                    ความพร้อมของห้องประชุม แอร์ เครื่องพิมพ์เอกสาร และพื้นที่ทำงานส่วนกลางเพื่อเพิ่มประสิทธิภาพงาน
                  </p>
                </div>
              </div>
            </div>
          </li>

          <!-- ขั้นตอนที่ 2 -->
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              2
            </div>
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <strong class="text-slate-900 text-sm">ขั้นตอนที่ 2: วิเคราะห์ความต้องการของปัญหา (Data Requirements Analysis)</strong>
                <span class="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">วิเคราะห์ข้อมูล</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                วิเคราะห์ความต้องการของปัญหาที่เลือก ว่าก่อนจะนำปัญหานี้ไปวิเคราะห์เพื่อพัฒนาองค์กร <strong>เราต้องการเก็บข้อมูลอะไรบ้าง</strong> เพื่อตอบโจทย์ปัญหานั้น (กำหนดรายการคำถาม 5–6 ข้อ พร้อมระบุชนิดข้อมูล Nominal, Ordinal, Discrete, Continuous หรือ Text) เพื่อเตรียมนำไปสร้างแบบฟอร์ม
              </p>
            </div>
          </li>

          <!-- ขั้นตอนที่ 3 -->
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              3
            </div>
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <strong class="text-slate-900 text-sm">ขั้นตอนที่ 3: สร้าง Form ในการเก็บข้อมูลโดยใช้ Google Forms</strong>
                <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">ชิ้นงานที่ 1</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                นำรายการข้อมูลและคำถามที่วิเคราะห์ได้จากขั้นตอนที่ 2 ไปสร้างแบบฟอร์ม (Form) ในการเก็บรวบรวมข้อมูลจริงโดยใช้ <strong>Google Forms</strong> พร้อมคัดลอกลิงก์แบบสอบถามไว้สำหรับส่งเป็น <strong>ลิงก์ที่ 1: Form</strong>
              </p>
            </div>
          </li>

          <!-- ขั้นตอนที่ 4 -->
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              4
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <strong class="text-slate-900 text-sm">ขั้นตอนที่ 4: ทำสไลด์นำเสนอใน Canva (ชิ้นงานที่ 2 เพื่อส่งลิงก์ Canva)</strong>
                <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">ชิ้นงานที่ 2</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                เปิดเว็บไซต์ <strong>Canva</strong> เลือกเทมเพลต 'งานนำเสนอ 16:9' แล้วจัดทำสไลด์สรุปเนื้อหา
                <strong>จำนวน 6–7 หน้า</strong> (ไม่ต้องพิมพ์รายงานเล่ม ให้ใส่เนื้อหาทั้งหมดในสไลด์ Canva):
              </p>

              <div class="flex items-center justify-between flex-wrap gap-2 pt-1 pb-1">
                <span class="text-xs text-purple-950 font-bold">โครงสร้างสไลด์:</span>
                <button @click="showSlideModal = true" type="button"
                  class="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs">
                  <Eye class="w-3.5 h-3.5 text-purple-600" /> กดดูตัวอย่างสไลด์จริง (Modal Preview)
                </button>
              </div>

              <!-- Slide Blueprint Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 1: หน้าปก</span>
                    <span class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Cover</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    ชื่อหัวข้อปัญหาในองค์กร, ชื่อ-นามสกุล, รหัสนักศึกษา, แผนก/สาขา และชื่อวิชา
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 2: ที่มาของปัญหา</span>
                    <span class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">5W1H</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    ทำไมต้องแก้ปัญหานี้? ใครได้รับผลกระทบ? งานสะดุดที่แผนกไหน/เวลาใด
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 3: ตารางตัวแปร</span>
                    <span
                      class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Variables</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    ตารางระบุคำถาม 5–6 ข้อ พร้อมชนิดข้อมูล (Nominal / Ordinal / Discrete)
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 4: เครื่องมือ & 2 วิธี</span>
                    <span
                      class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Methods</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    รูปหน้าจอ Google Form + อีก 1 วิธีเก็บข้อมูลคู่กัน (เช่น สัมภาษณ์หัวหน้าแผนก)
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <div class="font-bold text-emerald-900 mb-1 flex items-center justify-between">
                    <span>หน้า 5: ตารางข้อมูลตัวอย่าง</span>
                    <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Data
                      Table</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    ตารางจำลองชุดข้อมูล Google Sheets 5–6 แถว แสดงข้อมูลจริงที่จะได้รับ
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 6: มาตรการ PDPA</span>
                    <span
                      class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Privacy</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    การไม่ระบุตัวตนพนักงาน (Anonymous) เพื่อให้ตอบความจริง และการจำกัดสิทธิ์ดูไฟล์
                  </p>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs sm:col-span-2">
                  <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
                    <span>หน้า 7: แผนการเก็บรวบรวมข้อมูล</span>
                    <span class="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Action
                      Plan</span>
                  </div>
                  <p class="text-[11px] text-slate-600">
                    สรุปแผนปล่อยแบบสอบถาม (ช่องทางสื่อสาร/กลุ่มเป้าหมาย 80–100 คน/ระยะเวลา 7 วัน) และการเตรียมส่งออกไฟล์
                    CSV สู่การตรวจสอบคุณภาพข้อมูลในสัปดาห์ถัดไป
                  </p>
                </div>
              </div>

            </div>
          </li>

          <!-- ขั้นตอนที่ 5 -->
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              5
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <strong class="text-slate-900 text-sm">ขั้นตอนที่ 5: ส่งผลงาน 2 ลิงก์ในระบบ & นำเสนอหน้าห้องเรียน</strong>
                <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">ส่งงาน</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                เมื่อทำเสร็จทั้ง Google Form และสไลด์ Canva ให้กดปุ่ม <strong>"ส่งงาน / แนบลิงก์"</strong> ด้านล่าง
                โดยแนบส่ง 2 ลิงก์ ดังนี้:
              </p>

              <!-- Final 2 Links Box -->
              <div class="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-2 max-w-xl text-xs">
                <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                  <span
                    class="w-5 h-5 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">1</span>
                  <div>
                    <div class="font-bold text-blue-900 flex items-center gap-1">
                      <LinkIcon class="w-3.5 h-3.5 text-blue-600" /> ลิงก์ที่ 1: Form (Google Forms)
                    </div>
                    <div class="text-[11px] text-slate-500">
                      วางลิงก์ฟอร์มสำรวจในองค์กรที่เปิดสิทธิ์ให้พนักงานเข้าตอบได้
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                  <span
                    class="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">2</span>
                  <div>
                    <div class="font-bold text-purple-900 flex items-center gap-1">
                      <LinkIcon class="w-3.5 h-3.5 text-purple-600" /> ลิงก์ที่ 2: Canva
                    </div>
                    <div class="text-[11px] text-slate-500">
                      วางลิงก์ Canva ที่เปิดสิทธิ์ Anyone with the link can view
                    </div>
                  </div>
                </div>

                <div class="pt-1 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>เมื่อส่งงานแล้ว เตรียมตัวนำเสนอสไลด์หน้าห้องเรียนคนละ <strong>3 นาที</strong>
                    ตามคิวที่ครูกำหนด</span>
                </div>
              </div>
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
              Why (ทำไมต้องเก็บ) - What (เก็บตัวแปรใดบ้าง) - Who (ใครคือกลุ่มเป้าหมาย) - When (ช่วงเวลาใด) - Where
              (แหล่งข้อมูลอยู่ที่ไหน) - How (ใช้เครื่องมืออะไร)
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
              แจ้งวัตถุประสงค์ให้ชัดเจน, ขอความยินยอม (Consent) ก่อนเสมอ และเก็บเฉพาะข้อมูลที่จำเป็นต่อการวิเคราะห์
              (Data Minimization)
            </p>
          </div>
        </div>
      </template>
    </AssignmentPdfModal>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal v-model="showTeacherModal" :courseId="currentCourseId" :weekNumber="currentWeek"
      courseName="การวิเคราะห์และนำเสนอข้อมูล" :games="weekGames" />

    <!-- Slide Preview Modal -->
    <SlidePreviewModal v-model="showSlideModal" />

  </div>
</template>
