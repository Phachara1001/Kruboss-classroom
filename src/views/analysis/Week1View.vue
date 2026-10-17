<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  BookOpen, PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Code, Settings, Sparkles, BarChart3, LineChart,
  TrendingUp, RefreshCw, FileCheck, CheckCircle2, ChevronLeft, Eye, HelpCircle, Clock, Edit3
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import WordblankGame from '@/components/games/WordblankGame.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import SubmitAssignmentModal from '@/components/SubmitAssignmentModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

const router = useRouter()

// Current Course & Week context
const currentCourseId = '31901-2012'
const currentWeek = 1

// Modal States
const showPdfModal = ref(false)
const showSubmitModal = ref(false)

// Grading Criteria Data (เหมือนกับวิชาอื่นๆ: 20 - 40 - 20 - 20 รวม 100)
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-sky-400' },
  { name: 'คะแนนเก็บ (ใบงานและการปฏิบัติการ)', score: 40, color: 'bg-sky-500' },
  { name: 'สอบกลางภาค (Midterm Practical)', score: 20, color: 'bg-blue-600' },
  { name: 'สอบปลายภาค (Final Presentation)', score: 20, color: 'bg-cyan-700' }
]

// Mini-game State
const activeGame = ref('quiz') // 'quiz' | 'sort'

// Game 1: Pop Quiz
const quizQuestions = [
  {
    id: 1,
    question: "ข้อใดคือเป้าหมายสูงสุดของ 'การวิเคราะห์และนำเสนอข้อมูล' (Data Analysis & Visualization)?",
    options: [
      { id: 'a', text: "เพื่อสร้างกราฟิกสีสันสดใสตกแต่งรายงานเท่านั้น", isCorrect: false },
      { id: 'b', text: "เพื่อเปลี่ยนข้อมูลดิบให้เป็นข้อค้นพบ (Insights) สนับสนุนการตัดสินใจทางธุรกิจได้อย่างถูกต้อง", isCorrect: true },
      { id: 'c', text: "เพื่อเก็บสะสมข้อมูลให้มีขนาดใหญ่ที่สุดเท่าที่จะทำได้", isCorrect: false }
    ],
    explanation: "หัวใจของการวิเคราะห์ข้อมูลไม่ใช่เพียงแค่การวาดชาร์ตสวยงาม แต่คือการกลั่นกรอง Insight เพื่อนำไปสู่การตัดสินใจ (Data-Driven Decision Making) ที่ลดความเสี่ยงทางธุรกิจ"
  },
  {
    id: 2,
    question: "มิติคุณภาพข้อมูลด้าน 'ความสมบูรณ์' (Completeness) หมายถึงลักษณะใด?",
    options: [
      { id: 'a', text: "ชุดข้อมูลไม่มีค่าสูญหาย (Missing Value) บันทึกข้อมูลครบทุกช่องที่จำเป็นต่อการวิเคราะห์", isCorrect: true },
      { id: 'b', text: "ชุดข้อมูลถูกจัดเก็บไว้จนเต็มความจุของฮาร์ดดิสก์", isCorrect: false },
      { id: 'c', text: "ข้อมูลถูกส่งผ่านสายเคเบิลความเร็วสูงเท่านั้น", isCorrect: false }
    ],
    explanation: "Completeness คือความครบถ้วนของข้อมูล ไม่มีฟิลด์สำคัญถูกเว้นว่างไว้ เช่น รายการสั่งซื้อต้องมีทั้งราคาสินค้า จำนวน รหัสลูกค้า และวันที่"
  },
  {
    id: 3,
    question: "หากบริษัทนำข้อมูลยอดขายเมื่อ 5 ปีก่อนมาวางแผนสต็อกสินค้าสัปดาห์หน้า จะส่งผลกระทบต่อมิติคุณภาพใดมากที่สุด?",
    options: [
      { id: 'a', text: "ความทันสมัยและความเป็นปัจจุบัน (Timeliness & Currency)", isCorrect: true },
      { id: 'b', text: "ความลับของข้อมูล (Confidentiality)", isCorrect: false },
      { id: 'c', text: "รูปแบบตัวอักษร (Typography)", isCorrect: false }
    ],
    explanation: "ข้อมูลที่เก่าและล้าสมัย (Outdated Data) ขาดความทันสมัยและความเป็นปัจจุบัน พฤติกรรมผู้บริโภคเปลี่ยนไปแล้ว ทำให้การคาดการณ์ผิดพลาดอย่างรุนแรง"
  },
  {
    id: 4,
    question: "เหตุใดองค์กรจึงนิยมนำเสนอข้อมูลด้วย Data Visualization มากกว่าตารางตัวเลขดิบ?",
    options: [
      { id: 'a', text: "เพราะสมองมนุษย์ประมวลผลการรับรู้ทางสายตา (Visual Perception) ได้เร็วกว่าการอ่านตัวเลขหลายหมื่นเท่า", isCorrect: true },
      { id: 'b', text: "เพราะกราฟมีตัวหนังสือน้อยกว่าตารางเสมอ", isCorrect: false },
      { id: 'c', text: "เพราะคอมพิวเตอร์ไม่อนุญาตให้อ่านตัวเลข", isCorrect: false }
    ],
    explanation: "สมองมนุษย์จับคู่รูปแบบ แนวโน้ม (Trends) และจุดผิดปกติ (Outliers) จากภาพและกราฟได้รวดเร็วกว่าการกวาดสายตาอ่านตัวเลขในตารางหลายสิบบรรทัด"
  },
  {
    id: 5,
    question: "ในวงจรชีวิตของข้อมูล (Data Lifecycle) ขั้นตอนแรกสุดที่นักวิเคราะห์ข้อมูลควรทำคืออะไร?",
    options: [
      { id: 'a', text: "ลงมือสร้าง Dashboard ทันที", isCorrect: false },
      { id: 'b', text: "ทำความเข้าใจปัญหาและตั้งคำถามทางธุรกิจที่ชัดเจน (Ask / Define Problem)", isCorrect: true },
      { id: 'c', text: "ลบข้อมูลที่คิดว่าไม่สำคัญทิ้งทั้งหมด", isCorrect: false }
    ],
    explanation: "ขั้นตอนแรกคือการทำความเข้าใจบริบทและตั้งคำถามทางธุรกิจ (Ask) เพื่อให้ทราบว่าเรากำลังจะวิเคราะห์เพื่อตอบโจทย์อะไรและช่วยเหลือใคร"
  }
]

// Game 2: Drag & Drop (Data Quality Dimensions)
const dragItemsData = [
  { id: 1, text: 'ตัวเลขยอดขายตรงกับใบเสร็จจริงทุกประการ', type: 'accuracy' },
  { id: 2, text: 'ไม่มีช่องว่างหรือ Missing Value ในคอลัมน์สำคัญ', type: 'completeness' },
  { id: 3, text: 'ตัวเลขยอดขายอัปเดตแบบ Real-time ของวันนี้', type: 'timeliness' },
  { id: 4, text: 'รหัสไปรษณีย์มีตัวเลขครบ 5 หลักตามมาตรฐาน', type: 'accuracy' },
  { id: 5, text: 'บันทึกข้อมูลลูกค้าครบทั้งชื่อ เบอร์โทร และที่อยู่', type: 'completeness' },
  { id: 6, text: 'ข้อมูลราคาหุ้นล่าสุดในช่วง 15 นาทีที่ผ่านมา', type: 'timeliness' }
]

const dragZonesData = [
  { 
    id: 'accuracy', 
    title: 'ความถูกต้อง (Accuracy)', 
    wrapperClass: 'border-blue-400/50 hover:bg-black/40', 
    titleClass: 'text-blue-300 border-blue-400/30', 
    itemBgClass: 'bg-blue-600/50 border-blue-400', 
    emptyTextClass: 'text-blue-200/50', 
    emptyText: 'ลากข้อมูลที่เกี่ยวกับความถูกต้องมาวางที่นี่' 
  },
  { 
    id: 'completeness', 
    title: 'ความสมบูรณ์ (Completeness)', 
    wrapperClass: 'border-cyan-400/50 hover:bg-black/40', 
    titleClass: 'text-cyan-300 border-cyan-400/30', 
    itemBgClass: 'bg-cyan-600/50 border-cyan-400', 
    emptyTextClass: 'text-cyan-200/50', 
    emptyText: 'ลากข้อมูลที่เกี่ยวกับความครบถ้วนมาวางที่นี่' 
  },
  { 
    id: 'timeliness', 
    title: 'ความเป็นปัจจุบัน (Timeliness)', 
    wrapperClass: 'border-teal-400/50 hover:bg-black/40', 
    titleClass: 'text-teal-300 border-teal-400/30', 
    itemBgClass: 'bg-teal-600/50 border-teal-400', 
    emptyTextClass: 'text-teal-200/50', 
    emptyText: 'ลากข้อมูลที่เกี่ยวกับความทันสมัยมาวางที่นี่' 
  }
]

// Game 3: Word Blank (Data Lifecycle)
const wordblankPassage = "กระบวนการวิเคราะห์ข้อมูลเริ่มต้นที่ขั้นตอน {b1} เพื่อทำความเข้าใจปัญหาและตั้งคำถามทางธุรกิจ จากนั้นจึง {b2} ข้อมูลจากแหล่งต่างๆ เมื่อได้ข้อมูลมาแล้วต้องนำมา {b3} เพื่อตรวจสอบคุณภาพและแก้ไขข้อมูลที่ผิดพลาด ขั้นตอนต่อไปคือการ {b4} เพื่อหาแนวโน้มและข้อค้นพบที่ซ่อนอยู่ แล้วจึงนำผลลัพธ์ไป {b5} ผ่านการสร้าง Dashboard สุดท้ายผู้บริหารจะนำข้อค้นพบนี้ไป {b6} เพื่อแก้ไขปัญหาและวางแผนธุรกิจต่อไป"

const wordblankBlanks = [
  { id: 'b1', answer: 'Ask (ตั้งคำถาม)', hint: 'เริ่มต้นด้วยการตั้งคำถาม' },
  { id: 'b2', answer: 'Prepare (รวบรวม)', hint: 'เอาข้อมูลมาจากหลายๆ ที่' },
  { id: 'b3', answer: 'Process (ทำความสะอาด)', hint: 'Data Cleaning' },
  { id: 'b4', answer: 'Analyze (วิเคราะห์)', hint: 'หา Insights' },
  { id: 'b5', answer: 'Share (นำเสนอ)', hint: 'เล่าเรื่องด้วยข้อมูล' },
  { id: 'b6', answer: 'Act (ตัดสินใจ)', hint: 'นำไปปฏิบัติจริง' }
]

const wordblankDistractors = ['Delete (ลบทิ้ง)', 'Guess (คาดเดา)', 'Store (จัดเก็บ)']
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
        <h1 class="text-4xl md:text-5xl font-bold text-sky-900 mb-4 leading-tight">บทนำสู่การวิเคราะห์และนำเสนอข้อมูล<br /><span
            class="text-3xl text-sky-700">(Introduction to Data Analytics & Visualization)</span></h1>
        <p class="text-gray-600 text-xl leading-relaxed">ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน
          มาตรฐานคุณวุฒิวิชาชีพนักวิเคราะห์ข้อมูล (Data Analyst ระดับ 4) วงจรชีวิตของข้อมูล และเจาะลึก 5 มิติคุณภาพข้อมูล
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
              <span
                class="px-3 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg text-sm border border-sky-200">ระดับ ปวส.1</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-sky-900">การวิเคราะห์และนำเสนอข้อมูล</h3>
            <p class="text-gray-500 text-lg">Data Visualization and Analyst</p>
          </div>
          <div class="text-left md:text-right">
            <span class="text-xs text-gray-400 block">อ้างอิงมาตรฐานอาชีพ</span>
            <span class="text-sm font-bold text-gray-700">สถาบันคุณวุฒิวิชาชีพ: นักวิเคราะห์ข้อมูล (Data Analyst) ระดับ 4</span>
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
            การระบุและสรุปผล การเก็บรวบรวม การวิเคราะห์สรุปผลข้อมูล รวมทั้งนำเสนอกระบวนการและเทคโนโลยีที่นำมาใช้เพื่อลดความเสี่ยงความปลอดภัยที่จำเป็นในการใช้ข้อมูล 
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
              <li>เข้าใจเกี่ยวกับการวิเคราะห์ข้อมูล การใช้งานเครื่องมือสร้างภาพจากชุดข้อมูล และเทคโนโลยีที่เกี่ยวข้อง</li>
              <li>มีทักษะในการตรวจสอบข้อมูล วิเคราะห์ข้อมูล และนำเสนอข้อมูล ทักษะด้านการออกแบบประสบการณ์ของผู้ใช้งาน (UX)</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียด รอบคอบ รับผิดชอบ การสื่อสาร คิดเชิงนวัตกรรมและการทำงานเป็นทีม</li>
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
          <h3 class="text-2xl font-bold text-sky-900 border-l-4 border-sky-500 pl-4 mb-6">ส่วนที่ 1: การวิเคราะห์ข้อมูล (Data Analytics) และบทบาท Data Analyst</h3>
          <p class="mb-4">
            ในยุคปัจจุบัน องค์กรธุรกิจทั่วโลกได้เปลี่ยนผ่านจากการตัดสินใจโดยใช้ความรู้สึกส่วนบุคคล (Intuition-driven) 
            มาสู่ <strong>การตัดสินใจโดยใช้ข้อมูลเป็นศูนย์กลาง (Data-Driven Decision Making)</strong> 
            นักวิเคราะห์ข้อมูล (Data Analyst) จึงมีบทบาทสำคัญในการเปลี่ยนข้อมูลดิบให้กลายเป็น <strong>ข้อค้นพบที่มีคุณค่า (Actionable Insights)</strong> เพื่อตอบคำถามว่า <em>"เกิดอะไรขึ้น ทำไมจึงเกิด และควรตัดสินใจอย่างไรต่อไป"</em>
          </p>

          <div class="grid md:grid-cols-3 gap-6 mt-6">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2 mb-3 text-amber-600">
                <Database class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Engineer</h4>
              </div>
              <p class="text-gray-600 text-base mb-3">
                สร้างและดูแลท่อส่งข้อมูล (Data Pipeline) จัดการ Data Warehouse เพื่อให้ข้อมูลไหลเวียนอย่างมีเสถียรภาพ รวดเร็ว และปลอดภัย
              </p>
              <span class="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md">ผู้สร้างและดูแลระบบท่อข้อมูล</span>
            </div>

            <div class="bg-sky-50 p-6 rounded-xl border-2 border-sky-400 shadow-sm relative">
              <span class="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-sky-600 text-white text-xs font-bold">จุดเน้นในวิชานี้</span>
              <div class="flex items-center gap-2 mb-3 text-sky-800">
                <BarChart3 class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Analyst</h4>
              </div>
              <p class="text-gray-700 text-base mb-3">
                ตรวจสอบคุณภาพ คลีนข้อมูล วิเคราะห์หาแนวโน้ม และสร้าง Dashboard นำเสนอเพื่อสนับสนุนการตัดสินใจของผู้บริหาร
              </p>
              <span class="text-xs font-semibold px-2.5 py-1 bg-sky-200 text-sky-900 rounded-md">ผู้กลั่นกรอง Insight สู่ธุรกิจ</span>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2 mb-3 text-purple-600">
                <Sparkles class="w-6 h-6" />
                <h4 class="text-xl font-bold">Data Scientist</h4>
              </div>
              <p class="text-gray-600 text-base mb-3">
                ใช้คณิตศาสตร์ สถิติขั้นสูง และโมเดล Machine Learning ในการทำนายพฤติกรรมในอนาคต (Predictive Modeling)
              </p>
              <span class="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md">ผู้พยากรณ์ด้วยโมเดลสถิติ</span>
            </div>
          </div>
        </div>

        <!-- Part 2 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-sky-900 border-l-4 border-sky-500 pl-4 mb-6">ส่วนที่ 2: วงจรชีวิตของข้อมูล (Data Lifecycle: 6 ขั้นตอนหลัก)</h3>
          <p class="mb-6">
            กระบวนการทำงานของนักวิเคราะห์ข้อมูลตามมาตรฐานสากล จะดำเนินไปตามวงจรชีวิต 6 ขั้นตอน เพื่อให้ได้ผลการวิเคราะห์ที่ถูกต้องและนำไปใช้จริงได้:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base">
            <div class="p-6 bg-white rounded-xl border border-sky-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
              <h4 class="font-bold text-sky-900 mb-2 text-lg">1. ASK (ตั้งคำถาม)</h4>
              <p class="text-gray-600">ทำความเข้าใจปัญหาทางธุรกิจและระบุคำถามหลักที่ต้องการคำตอบจากข้อมูล</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-blue-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h4 class="font-bold text-blue-900 mb-2 text-lg">2. PREPARE (เก็บรวบรวม)</h4>
              <p class="text-gray-600">รวบรวมข้อมูลจากแหล่งต่างๆ เช่น ไฟล์ CSV, Database, APIs และแบบสำรวจ</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-cyan-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
              <h4 class="font-bold text-cyan-900 mb-2 text-lg">3. PROCESS (ทำความสะอาด)</h4>
              <p class="text-gray-600">ตรวจสอบคุณภาพ ลบข้อมูลที่ซ้ำซ้อน และจัดการค่าสูญหาย (Data Cleaning)</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-teal-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
              <h4 class="font-bold text-teal-900 mb-2 text-lg">4. ANALYZE (วิเคราะห์ข้อมูล)</h4>
              <p class="text-gray-600">คำนวณค่าสถิติ ค้นหาความสัมพันธ์ แนวโน้ม และสรุปผลด้วย Pivot Table</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-indigo-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <h4 class="font-bold text-indigo-900 mb-2 text-lg">5. SHARE (สร้างภาพนำเสนอ)</h4>
              <p class="text-gray-600">สร้าง Data Visualization แดชบอร์ด (Power BI) และเล่าเรื่องด้วยข้อมูล (Data Storytelling)</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <h4 class="font-bold text-emerald-900 mb-2 text-lg">6. ACT (การนำไปตัดสินใจ)</h4>
              <p class="text-gray-600">ผู้บริหารนำข้อเสนอแนะและข้อค้นพบไปวางแผนกลยุทธ์แก้ไขปัญหาจริง</p>
            </div>
          </div>
        </div>

        <!-- Part 3 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-sky-900 border-l-4 border-sky-500 pl-4 mb-6">ส่วนที่ 3: มิติการตรวจสอบคุณภาพข้อมูล (Data Quality Dimensions)</h3>
          <p class="mb-4">
            ก่อนที่จะนำข้อมูลไปวิเคราะห์ นักวิเคราะห์ต้องตรวจสอบคุณภาพข้อมูลตาม 5 มิติหลักตามคำอธิบายรายวิชา 
            หากข้อมูลดิบไม่มีคุณภาพ ผลการวิเคราะห์ย่อมผิดพลาดตามหลักการ <strong>"Garbage In, Garbage Out"</strong>:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div class="p-6 bg-sky-50 rounded-xl border border-sky-200">
              <h4 class="font-bold text-sky-900 text-lg mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-sky-600" /> 1. ความถูกต้อง (Accuracy)
              </h4>
              <p class="text-gray-700">
                ข้อมูลต้องตรงกับความเป็นจริง เช่น ยอดขายตรงกับใบเสร็จ ชื่อ-นามสกุลถูกต้อง รหัสไปรษณีย์มี 5 หลักตามมาตรฐาน
              </p>
            </div>

            <div class="p-6 bg-cyan-50 rounded-xl border border-cyan-200">
              <h4 class="font-bold text-cyan-900 text-lg mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-cyan-600" /> 2. ความสมบูรณ์ (Completeness)
              </h4>
              <p class="text-gray-700">
                ไม่มีฟิลด์สำคัญที่ถูกเว้นว่างหรือมีค่าสูญหาย (No Missing Values) เช่น บันทึกข้อมูลลูกค้าครบทั้งชื่อ เบอร์โทร และที่อยู่
              </p>
            </div>

            <div class="p-6 bg-teal-50 rounded-xl border border-teal-200">
              <h4 class="font-bold text-teal-900 text-lg mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-teal-600" /> 3. ความทันสมัยและความเป็นปัจจุบัน (Timeliness & Currency)
              </h4>
              <p class="text-gray-700">
                ข้อมูลต้องอัปเดตตรงตามช่วงเวลาที่ต้องการใช้ ไม่ล้าสมัย เช่น ข้อมูลสต็อกสินค้าต้องเป็นยอดปัจจุบันของวันนี้
              </p>
            </div>

            <div class="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
              <h4 class="font-bold text-indigo-900 text-lg mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-indigo-600" /> 4. ความสอดคล้อง (Consistency)
              </h4>
              <p class="text-gray-700">
                ข้อมูลระหว่างระบบต่างๆ ต้องไม่ขัดแย้งกันเอง เช่น ยอดขายในระบบแคชเชียร์หน้าร้านต้องตรงกับยอดตัดสต็อกในคลัง
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Mini-Games & Interactive Lab Section (Identical design to other courses) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-100 rounded-xl text-purple-600 shadow-sm">
          <Gamepad2 class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">มินิเกมทบทวนความรู้ (Interactive Review)</h2>
      </div>

      <!-- Game Navigation Tabs -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="activeGame = 'sort'" :class="[activeGame === 'sort' ? 'bg-sky-600 text-white shadow-lg scale-105' : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer']">
          <Shuffle class="w-5 h-5" /> เกมจัดกลุ่มคุณภาพข้อมูล (Drag & Drop)
        </button>
        <button @click="activeGame = 'wordblank'" :class="[activeGame === 'wordblank' ? 'bg-sky-600 text-white shadow-lg scale-105' : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer']">
          <Edit3 class="w-5 h-5" /> เกมเติมคำ (Fill in the Blanks)
        </button>
        <button @click="activeGame = 'quiz'" :class="[activeGame === 'quiz' ? 'bg-sky-600 text-white shadow-lg scale-105' : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer']">
          <FileQuestion class="w-5 h-5" /> Pop Quiz สุดท้าย
        </button>
      </div>

      <!-- Game 1: Drag & Drop (Data Quality Dimensions) -->
      <DragDropGame v-if="activeGame === 'sort'" 
        title="ลากแล้ววาง: มิติคุณภาพข้อมูล (Data Quality Dimensions)"
        subtitle="ลากข้อความสถานการณ์ข้อมูลด้านล่างไปใส่กล่องมิติคุณภาพข้อมูลที่ถูกต้องให้ครบ!"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 3: Word Blank -->
      <WordblankGame v-if="activeGame === 'wordblank'"
        title="เติมคำในช่องว่าง: วงจรชีวิตของการวิเคราะห์ข้อมูล"
        subtitle="ลากคำศัพท์ที่เกี่ยวข้องกับ Data Lifecycle ทั้ง 6 ขั้นตอนไปเติมในช่องว่างให้สมบูรณ์"
        :passage="wordblankPassage"
        :blanks="wordblankBlanks"
        :distractors="wordblankDistractors"
      />

      <!-- Game 2: Pop Quiz -->
      <PopQuiz v-if="activeGame === 'quiz'" :questions="quizQuestions">
        <template #actions>
          <RouterLink to="/courses" class="px-8 py-4 bg-sky-500 border-2 border-sky-400 text-white font-bold rounded-xl hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- Assignment Section (Identical design to other courses) -->
    <!-- Assignment Section (Identical design to other courses) -->
    <AssignmentSection
      course-id="31901-2012"
      assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: การสำรวจบทบาท Data Analyst และการตรวจสอบคุณภาพชุดข้อมูล"
      :max-score="10"
    >
      <template #number>1</template>
      <template #description>
        สำรวจกรณีศึกษาธุรกิจรอบตัวที่สนใจ 1 ธุรกิจ วิเคราะห์ปัญหาที่พบและข้อมูลที่จำเป็นในการขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making) พร้อมทั้งตรวจสอบมิติคุณภาพข้อมูลตัวอย่าง และเขียนสรุปผลรายงาน
        
        <!-- Objectives -->
          <div class="mb-6 p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <h4 class="font-bold text-sky-950 text-sm mb-2 flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-sky-600" />
              จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-sky-900">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>1. อธิบายบทบาทหน้าที่ของ Data Analyst ในองค์กรได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>2. ยกตัวอย่างการใช้ข้อมูลเพื่อการตัดสินใจทางธุรกิจได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>3. ตรวจสอบมิติคุณภาพข้อมูล (Accuracy, Completeness, Timeliness) ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>4. เสนอแนวทางการทำความสะอาดข้อมูล (Data Cleaning) เบื้องต้นได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>5. จัดทำรายงานสรุปผลการตรวจสอบคุณภาพข้อมูล (Audit Report) ได้</span>
              </div>
            </div>
          </div>

      </template>

      <template #tasks>
            <ul class="space-y-4 text-slate-700">
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div class="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
                <div>
                  <strong>1. ข้อมูลธุรกิจและการขับเคลื่อนด้วยข้อมูล (Business Overview & Data-Driven)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    เลือกกรณีศึกษาธุรกิจที่สนใจ 1 แห่ง (เช่น ร้านค้าปลีก, ร้านอาหาร, ร้านกาแฟ, หอพัก) พร้อมระบุปัญหาที่ธุรกิจกำลังเผชิญ
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div class="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                <div>
                  <strong>2. การกำหนดความต้องการข้อมูล (Data Requirements)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    วิเคราะห์และระบุว่าต้องเก็บรวบรวมข้อมูลใดบ้างเพื่อตอบคำถามและแก้ปัญหาธุรกิจดังกล่าว (เช่น ยอดขายรายชั่วโมง, ข้อมูลสมาชิก)
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div class="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
                <div>
                  <strong>3. การตรวจสอบคุณภาพชุดข้อมูลตัวอย่าง (Data Quality Audit)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    ตรวจสอบชุดข้อมูลตัวอย่างที่ได้รับ ระบุข้อผิดพลาดตามมิติความถูกต้อง (Accuracy), ความสมบูรณ์ (Completeness), และความเป็นปัจจุบัน (Timeliness)
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
                <div class="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">4</div>
                <div>
                  <strong>4. ข้อเสนอแนะเชิงการตัดสินใจและข้อสรุป (Actionable Insights & Conclusion)</strong>
                  <p class="text-xs text-gray-500 mt-0.5">
                    สรุปว่าผลการตรวจสอบคุณภาพข้อมูลจะช่วยลดความเสี่ยง และช่วยให้ผู้บริหารตัดสินใจทางธุรกิจได้อย่างมีประสิทธิภาพอย่างไร
                  </p>
                </div>
              </li>
            </ul>

        <!-- PDF Example Button -->
        <div class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="ใบงานที่_1_สำรวจบทบาทDataAnalystและตรวจคุณภาพข้อมูล_ปวส1.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)"
      footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 (Assignment Format)"
    >
      <!-- Official Worksheet Header -->
      <div class="border-b-2 border-black pb-3 text-center space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 1: การสำรวจบทบาทนักวิเคราะห์ข้อมูลและประเมินคุณภาพชุดข้อมูล
        </h2>
        <p class="text-xs text-gray-800 font-semibold">
          (Data Analyst Role Exploration & Data Quality Assessment)
        </p>
        <p class="text-xs text-gray-700">
          รายวิชา การวิเคราะห์และนำเสนอข้อมูล (รหัสวิชา 31901-2012)
        </p>
        <p class="text-[11px] text-gray-600">
          หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) พุทธศักราช 2567 สาขาวิชาเทคโนโลยีสารสนเทศ
        </p>
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
        <strong>คำชี้แจง:</strong> ให้นักศึกษาสำรวจกรณีศึกษาธุรกิจที่สนใจ 1 ธุรกิจ ระบุปัญหาและความต้องการข้อมูล พร้อมประเมินคุณภาพชุดข้อมูลตัวอย่างตามมิติหลัก 3 ด้าน และเสนอแนะแนวทางแก้ไขให้ถูกต้อง
      </div>

      <!-- Task 1 -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          1. ข้อมูลธุรกิจและการขับเคลื่อนด้วยข้อมูล (Data-Driven Decision Making)
        </h4>
        <div class="text-xs text-gray-800 space-y-1">
          <p><strong>ชื่อธุรกิจที่เลือกศึกษา:</strong> ร้านชานมไข่มุก "Bubble Tea Express" สาขาหน้าวิทยาลัย</p>
          <p><strong>ปัญหาหลักของธุรกิจ:</strong> ยอดขายช่วงบ่ายลดลง และสต็อกไข่มุกกับนมสดเน่าเสียบ่อยครั้งเนื่องจากสั่งวัตถุดิบไม่ตรงกับความต้องการจริง</p>
          <p><strong>ข้อมูลที่จำเป็นต้องเก็บรวบรวม:</strong> ข้อมูลยอดขายรายชั่วโมง, เมนูยอดนิยม, ข้อมูลสต็อกวัตถุดิบ และช่วงเวลาเลิกเรียนของนักศึกษา</p>
          <p><strong>ประโยชน์ที่คาดว่าจะได้รับ:</strong> ลดขยะวัตถุดิบเน่าเสียได้ 25% และเพิ่มยอดขายช่วงบ่ายด้วยการจัดโปรโมชันตรงกลุ่มเป้าหมาย</p>
        </div>
      </div>

      <!-- Task 2 (Table) -->
      <div class="space-y-1.5 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          2. ตารางบันทึกผลการตรวจสอบคุณภาพข้อมูล (Data Quality Audit Table)
        </h4>
        <table class="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="border border-gray-400 p-1.5 text-left w-1/4">มิติคุณภาพข้อมูล</th>
              <th class="border border-gray-400 p-1.5 text-left w-2/5">ปัญหาที่ตรวจพบในชุดข้อมูล</th>
              <th class="border border-gray-400 p-1.5 text-left">แนวทางแก้ไข (Data Cleaning)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">1. ความถูกต้อง<br><span class="font-normal text-gray-500">(Accuracy)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">ราคาเมนูเครื่องดื่มบางรายการบันทึกเป็นค่าติดลบ หรือสะกดชื่อเมนูผิด เช่น "ชาเขีบว"</td>
              <td class="border border-gray-400 p-1.5 align-top">กำหนดเงื่อนไขตรวจสอบ (Validation Rule) ให้ราคาต้องมากกว่า 0 และแก้ไขชื่อเมนูให้ตรงตามมาตรฐาน</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1.5 font-semibold align-top">2. ความสมบูรณ์<br><span class="font-normal text-gray-500">(Completeness)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">คอลัมน์ "ระดับความหวาน" และ "ประเภทการชำระเงิน" มีช่องว่าง (Missing Value) ร้อยละ 15</td>
              <td class="border border-gray-400 p-1.5 align-top">กำหนดให้เป็นฟิลด์บังคับกรอก (Required Field) ที่หน้าจอแคชเชียร์ POS</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1.5 font-semibold align-top">3. ความเป็นปัจจุบัน<br><span class="font-normal text-gray-500">(Timeliness)</span></td>
              <td class="border border-gray-400 p-1.5 align-top">ข้อมูลสต็อกวัตถุดิบล่าช้ากว่าความเป็นจริง 2 วัน เนื่องจากใช้การนับสต็อกแบบแมนนวลช่วงสิ้นสัปดาห์</td>
              <td class="border border-gray-400 p-1.5 align-top">เชื่อมโยงระบบตัดสต็อกอัตโนมัติทุกครั้งที่มีการกดขายสินค้าหน้าร้าน (Real-time Inventory)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Task 3 -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          3. บทสรุปและข้อเสนอแนะเชิงการตัดสินใจ (Actionable Insights)
        </h4>
        <div class="p-3 bg-sky-50 border border-sky-200 rounded text-xs text-gray-800 leading-relaxed">
          "จากการตรวจสอบคุณภาพข้อมูลพบว่า การเก็บข้อมูลที่ถูกต้องและเป็นปัจจุบันแบบเรียลไทม์จะช่วยให้ผู้บริหารร้านชานมไข่มุกตัดสินใจสั่งซื้อวัตถุดิบได้แม่นยำยิ่งขึ้น ช่วยลดต้นทุนวัตถุดิบค้างสต็อก และยังสามารถนำข้อมูลช่วงเวลาขายดีมาออกแบบแคมเปญส่งเสริมการขายเพื่อเพิ่มยอดขายในช่วงบ่ายได้อย่างมีประสิทธิภาพ"
        </div>
      </div>

      <!-- Grading Rubric Footer -->
      <div class="border-t border-gray-300 pt-2 text-[11px] flex justify-between text-gray-600">
        <span>เกณฑ์ประเมิน: ความถูกต้องของข้อมูล (5 คะแนน) • การวิเคราะห์คุณภาพ (3 คะแนน) • ความสมบูรณ์และตรงเวลา (2 คะแนน)</span>
        <span class="font-bold text-black">ลงชื่อผู้ประเมิน: ............................................</span>
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
