<script setup>
/**
 * ==============================================================================
 * 📄 TEMPLATE: หน้าเว็บบทเรียนประจำสัปดาห์ (Weekly Lesson View Template)
 * ==============================================================================
 * วิธีใช้งาน:
 * 1. คัดลอกไฟล์นี้ไปเป็น WeekXView.vue (เช่น Week2View.vue, Week3View.vue)
 * 2. ปรับเปลี่ยนตัวแปรในส่วน [⚙️ 1. ข้อมูลพื้นฐานประจำบทเรียน]
 * 3. ใส่เนื้อหาบทเรียนในส่วน [📖 Lecture Content]
 * 4. กำหนดข้อมูลมินิเกม 1, มินิเกม 2 และแบบทดสอบหลังเรียน 10 ข้อ
 * 5. ปรับข้อมูลใบงานและการบ้านในส่วน [📝 AssignmentSection]
 * 6. เพิ่ม Route ใน src/router/index.js เพื่อเปิดใช้งาน
 * ==============================================================================
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  BookOpen, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Clock, Trophy, Lock, FileSpreadsheet, Code2,
  AlertTriangle, Sparkles, CheckCircle2, BookmarkCheck, HelpCircle
} from '@lucide/vue'

// Components
import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

// Store & Context
import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// ------------------------------------------------------------------------------
// ⚙️ 1. ข้อมูลพื้นฐานประจำบทเรียน (Lesson Info Configuration)
// ------------------------------------------------------------------------------
const currentCourseId = '31901-2007' // รหัสวิชา (เช่น 31901-2007, 21901-2012, 21900-1004, 21901-2007, 31901-2012)
const currentWeek = 2               // สัปดาห์ที่เรียน (Week 2, 3, 4, ...)
const courseName = 'เทคโนโลยีการจัดการฐานข้อมูล'
const weekNumberText = `สัปดาห์ที่ ${currentWeek}`
const lessonTitle = 'การออกแบบฐานข้อมูลเชิงสัมพันธ์และแบบจำลอง E-R'
const lessonTitleEn = 'Relational Database Design & Entity-Relationship Model'
const lessonHours = '4 ชั่วโมง (บรรยาย 1 ชม. ปฏิบัติ 3 ชม.)'

// Modal States
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

// ------------------------------------------------------------------------------
// 🎯 2. ข้อมูลประจำบทเรียน & คำอธิบายรายบท (Chapter Overview)
// ------------------------------------------------------------------------------
const chapterDescription = `ศึกษาและปฏิบัติเกี่ยวกับหลักการออกแบบฐานข้อมูลเชิงสัมพันธ์ (Relational Model), 
การแปลงความต้องการทางธุรกิจไปสู่แบบจำลองความสัมพันธ์ระหว่างข้อมูล (Entity-Relationship Diagram: ERD), 
การระบุ Entity, Attribute, Key (Primary Key, Foreign Key, Composite Key), 
และการกำหนดประเภทของความสัมพันธ์ (Cardinality: 1:1, 1:N, M:N) เพื่อเตรียมนำไปสร้างตารางจริงใน DBMS`

const chapterObjectives = [
  'อธิบายหลักการพื้นฐานและโครงสร้างของแบบจำลองฐานข้อมูลเชิงสัมพันธ์ได้',
  'จำแนกความแตกต่างระหว่าง Entity, Attribute, และ Relationship ได้อย่างถูกต้อง',
  'กำหนดและเลือกใช้ Primary Key, Foreign Key, และ Candidate Key ได้เหมาะสม',
  'ออกแบบแผนภาพ E-R Diagram จากโจทย์กรณีศึกษาระบบงานจริงได้'
]

const chapterCompetencies = [
  'วิเคราะห์ความต้องการของระบบและสกัดเป็น Entity และ Attribute ตามหลักการ',
  'ออกแบบและสร้างแบบจำลอง E-R Diagram พร้อมระบุ Cardinality ได้ถูกต้อง',
  'แปลงแผนภาพ E-R Diagram ให้อยู่ในรูปของ Relational Schema เพื่อพร้อมใช้งาน'
]

const chapterOutcomes = `สามารถออกแบบผังแบบจำลองข้อมูล E-R Diagram สำหรับกรณีศึกษาระบบงานธุรกิจที่กำหนด 
พร้อมอธิบายความสัมพันธ์และคีย์หลัก-คีย์นอกได้อย่างถูกต้องตามมาตรฐาน`

// ------------------------------------------------------------------------------
// 🎮 3. การตั้งค่าคะแนนมินิเกม (Game Center Configuration)
// กฎเหล็ก: เล่นได้ครั้งเดียว ไม่เฉลยระหว่างทำ กิจกรรมสุดท้ายคือแบบทดสอบหลังเรียน 10 ข้อ
// ------------------------------------------------------------------------------
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนก Entity vs Attribute)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำศัพท์และสัญลักษณ์ E-R Diagram)', maxScore: 5, isQuiz: false },
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

const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'

// ------------------------------------------------------------------------------
// 🕹️ ข้อมูลเกมที่ 1: Drag & Drop (จำแนกหมวดหมู่ - 6 รายการ, เต็ม 6 คะแนน)
// ------------------------------------------------------------------------------
const dragItemsData = [
  { id: 1, text: 'ลูกค้า (Customer)', type: 'entity' },
  { id: 2, text: 'รหัสลูกค้า (CustomerID)', type: 'attribute' },
  { id: 3, text: 'สินค้า (Product)', type: 'entity' },
  { id: 4, text: 'ราคาสินค้า (Price)', type: 'attribute' },
  { id: 5, text: 'ใบเสร็จสั่งซื้อ (Order)', type: 'entity' },
  { id: 6, text: 'วันที่สั่งซื้อ (OrderDate)', type: 'attribute' }
]

const dragZonesData = [
  { 
    id: 'entity', 
    title: 'Entity (เอนทิตี - สิ่งที่สนใจจัดเก็บข้อมูล)', 
    wrapperClass: 'border-blue-400/50 hover:bg-black/40', 
    titleClass: 'text-blue-300 border-blue-400/30', 
    itemBgClass: 'bg-blue-600/50 border-blue-400', 
    emptyTextClass: 'text-blue-200/50', 
    emptyText: 'ลาก Entity มาวางที่นี่' 
  },
  { 
    id: 'attribute', 
    title: 'Attribute (แอตทริบิวต์ - คุณลักษณะของเอนทิตี)', 
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40', 
    titleClass: 'text-emerald-300 border-emerald-400/30', 
    itemBgClass: 'bg-emerald-600/50 border-emerald-400', 
    emptyTextClass: 'text-emerald-200/50', 
    emptyText: 'ลาก Attribute มาวางที่นี่' 
  }
]

// ------------------------------------------------------------------------------
// 🕹️ ข้อมูลเกมที่ 2: Matching (จับคู่ความสัมพันธ์ - 5 คู่, เต็ม 5 คะแนน)
// ------------------------------------------------------------------------------
const matchLeftTerms = [
  { id: 'l1', text: '1. Primary Key (PK)', match: 'r1' },
  { id: 'l2', text: '2. Foreign Key (FK)', match: 'r2' },
  { id: 'l3', text: '3. รูปสี่เหลี่ยมผืนผ้า (Rectangle)', match: 'r3' },
  { id: 'l4', text: '4. รูปวงรี (Ellipse)', match: 'r4' },
  { id: 'l5', text: '5. รูปข้าวหลามตัด (Diamond)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'คีย์หลักที่ระบุแต่ละแถวได้อย่างไม่ซ้ำซ้อนและห้ามมีค่าว่าง (Unique & Not NULL)' },
  { id: 'r2', text: 'คีย์นอกที่ใช้อ้างอิงไปยังคีย์หลักของอีกตารางหนึ่งเพื่อเชื่อมโยงความสัมพันธ์' },
  { id: 'r3', text: 'สัญลักษณ์ใน E-R Diagram ที่ใช้แทน "Entity" (เอนทิตี)' },
  { id: 'r4', text: 'สัญลักษณ์ใน E-R Diagram ที่ใช้แทน "Attribute" (แอตทริบิวต์)' },
  { id: 'r5', text: 'สัญลักษณ์ใน E-R Diagram ที่ใช้แทน "Relationship" (ความสัมพันธ์)' }
]

// ------------------------------------------------------------------------------
// 📝 ข้อมูลเกมที่ 3: แบบทดสอบหลังเรียน (Post-test 10 ข้อ 4 ตัวเลือก, เต็ม 10 คะแนน)
// ------------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 1,
    question: "ข้อใดให้ความหมายของ 'Entity' ในแบบจำลอง E-R Diagram ได้ถูกต้องที่สุด?",
    options: [
      { id: 'a', text: "สิ่งที่สนใจในการจัดเก็บข้อมูล อาจเป็นบุคคล สถานที่ สิ่งของ หรือเหตุการณ์", isCorrect: true },
      { id: 'b', text: "ความเร็วในการประมวลผลของฮาร์ดดิสก์", isCorrect: false },
      { id: 'c', text: "สูตรคำนวณทางคณิตศาสตร์ในโปรแกรมสเปรดชีต", isCorrect: false },
      { id: 'd', text: "สายสัญญาณที่เชื่อมต่อระหว่างคอมพิวเตอร์", isCorrect: false }
    ],
    explanation: "Entity หมายถึง สิ่งที่ระบบสนใจจัดเก็บข้อมูล เช่น ลูกค้า, สินค้า, พนักงาน, หรือคำสั่งซื้อ"
  },
  {
    id: 2,
    question: "คุณสมบัติสำคัญที่สุดของ 'Primary Key (คีย์หลัก)' คือข้อใด?",
    options: [
      { id: 'a', text: "ต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์ใหญ่เท่านั้น", isCorrect: false },
      { id: 'b', text: "ต้องมีค่าที่ไม่ซ้ำซ้อนกันในแต่ละแถว และห้ามมีค่าว่าง (Unique and NOT NULL)", isCorrect: true },
      { id: 'c', text: "ต้องเป็นตัวเลขจำนวนเงินเสมอ", isCorrect: false },
      { id: 'd', text: "สามารถมีค่าซ้ำกันได้หากผู้ใช้อนุญาต", isCorrect: false }
    ],
    explanation: "Primary Key มีกฎเหล็กคือ ห้ามซ้ำ (Uniqueness) และห้ามว่าง (Entity Integrity Constraint - NOT NULL)"
  },
  {
    id: 3,
    question: "หากต้องการเชื่อมโยงความสัมพันธ์ระหว่างตาราง 'คำสั่งซื้อ' กับตาราง 'ลูกค้า' ต้องใช้คีย์ประเภทใดเป็นตัวเชื่อม?",
    options: [
      { id: 'a', text: "Composite Key", isCorrect: false },
      { id: 'b', text: "Foreign Key (คีย์นอก)", isCorrect: true },
      { id: 'c', text: "Candidate Key", isCorrect: false },
      { id: 'd', text: "Alternate Key", isCorrect: false }
    ],
    explanation: "Foreign Key คือคอลัมน์ในตารางหนึ่งที่อ้างอิงไปยัง Primary Key ของอีกตารางหนึ่ง เพื่อสร้างความสัมพันธ์เชิงตรรกะ"
  },
  {
    id: 4,
    question: "ความสัมพันธ์ระหว่าง 'อาจารย์ที่ปรึกษา 1 คน ดูแลนักศึกษาได้หลายคน' แต่ 'นักศึกษา 1 คน มีอาจารย์ที่ปรึกษาได้เพียงคนเดียว' เป็นความสัมพันธ์รูปแบบใด?",
    options: [
      { id: 'a', text: "One-to-One (1:1)", isCorrect: false },
      { id: 'b', text: "One-to-Many (1:N)", isCorrect: true },
      { id: 'c', text: "Many-to-Many (M:N)", isCorrect: false },
      { id: 'd', text: "Recursive Relationship", isCorrect: false }
    ],
    explanation: "อาจารย์ 1 คน ดูแลนักศึกษาได้หลายคน จัดเป็นความสัมพันธ์แบบ One-to-Many (1:N)"
  },
  {
    id: 5,
    question: "ความสัมพันธ์แบบ Many-to-Many (M:N) เช่น 'นักศึกษาสามารถลงทะเบียนได้หลายวิชา' และ 'แต่ละวิชามีนักศึกษาได้หลายคน' ต้องแก้ไขอย่างไรในฐานข้อมูลเชิงสัมพันธ์จริง?",
    options: [
      { id: 'a', text: "ลบวิชาที่มีนักศึกษาเยอะทิ้ง", isCorrect: false },
      { id: 'b', text: "สร้างตารางตัวกลาง (Junction Table / Bridge Table) ขึ้นมาคั่น เพื่อแปลงเป็น 1:N สองเส้น", isCorrect: true },
      { id: 'c', text: "เก็บรหัสนักศึกษาต่อกันด้วยเครื่องหมายจุลภาคในช่องเดียว", isCorrect: false },
      { id: 'd', text: "ไม่สามารถทำได้ในระบบฐานข้อมูล", isCorrect: false }
    ],
    explanation: "ความสัมพันธ์ M:N ใน Relational DB ต้องแตกออกเป็นตารางตัวกลาง (Composite Entity / Junction Table) เช่น ตาราง Enrollment"
  },
  {
    id: 6,
    question: "สัญลักษณ์รูปวงรี (Ellipse) ในแผนภาพ E-R Diagram ใช้แทนสิ่งใด?",
    options: [
      { id: 'a', text: "Entity (เอนทิตี)", isCorrect: false },
      { id: 'b', text: "Attribute (แอตทริบิวต์)", isCorrect: true },
      { id: 'c', text: "Relationship (ความสัมพันธ์)", isCorrect: false },
      { id: 'd', text: "Constraint (ข้อจำกัด)", isCorrect: false }
    ],
    explanation: "ใน E-R Diagram สัญลักษณ์รูปวงรีแทน Attribute ส่วนสี่เหลี่ยมผืนผ้าแทน Entity และข้าวหลามตัดแทน Relationship"
  },
  {
    id: 7,
    question: "Attribute ที่มีเส้นใต้ทึบ (Underline) อยู่ใต้ชื่อใน E-R Diagram มีความหมายพิเศษอย่างไร?",
    options: [
      { id: 'a', text: "เป็น Attribute ที่เก็บข้อความยาว", isCorrect: false },
      { id: 'b', text: "เป็น Primary Key (คีย์หลัก) ของ Entity นั้น", isCorrect: true },
      { id: 'c', text: "เป็นข้อมูลที่ไม่สำคัญ", isCorrect: false },
      { id: 'd', text: "เป็นข้อมูลที่มีข้อผิดพลาด", isCorrect: false }
    ],
    explanation: "การขีดเส้นใต้ที่ชื่อ Attribute ใน E-R Diagram หมายถึงการกำหนดให้ Attribute นั้นทำหน้าที่เป็น Primary Key หรือ Identifier"
  },
  {
    id: 8,
    question: "แอตทริบิวต์ 'อายุ (Age)' ที่สามารถคำนวณได้จาก 'วันเดือนปีเกิด (Date of Birth)' จัดเป็นแอตทริบิวต์ประเภทใด?",
    options: [
      { id: 'a', text: "Derived Attribute (แอตทริบิวต์ที่ได้จากการคำนวณ)", isCorrect: true },
      { id: 'b', text: "Multivalued Attribute", isCorrect: false },
      { id: 'c', text: "Composite Attribute", isCorrect: false },
      { id: 'd', text: "Key Attribute", isCorrect: false }
    ],
    explanation: "Derived Attribute คือข้อมูลที่ไม่จำเป็นต้องเก็บค่าจริงลงตาราง แต่สามารถคำนวณได้จาก Attribute อื่น แสดงด้วยเส้นประวงรี"
  },
  {
    id: 9,
    question: "แอตทริบิวต์ 'เบอร์โทรศัพท์' ที่ลูกค้า 1 คน สามารถมีได้มากกว่า 1 เบอร์ จัดเป็นแอตทริบิวต์ประเภทใด?",
    options: [
      { id: 'a', text: "Single-valued Attribute", isCorrect: false },
      { id: 'b', text: "Multivalued Attribute (แอตทริบิวต์หลายค่า)", isCorrect: true },
      { id: 'c', text: "Derived Attribute", isCorrect: false },
      { id: 'd', text: "Foreign Attribute", isCorrect: false }
    ],
    explanation: "Multivalued Attribute คือแอตทริบิวต์ที่มีหลายค่าในเอนทิตีเดียวกัน แสดงด้วยสัญลักษณ์วงรีซ้อนสองชั้น (Double Ellipse)"
  },
  {
    id: 10,
    question: "ข้อใดคือประโยชน์สำคัญของการออกแบบ E-R Diagram ก่อนเริ่มสร้างฐานข้อมูลจริงในคอมพิวเตอร์?",
    options: [
      { id: 'a', text: "ช่วยให้เห็นภาพรวมโครงสร้างข้อมูล สื่อสารกับผู้ใช้งานได้เข้าใจตรงกัน และลดความผิดพลาดในการสร้างตาราง", isCorrect: true },
      { id: 'b', text: "ทำให้คอมพิวเตอร์ทำงานโดยไม่ต้องใช้ไฟฟ้า", isCorrect: false },
      { id: 'c', text: "ช่วยลดขนาดหน้าจอของคอมพิวเตอร์ลง", isCorrect: false },
      { id: 'd', text: "บังคับให้ผู้ใช้ทุกคนต้องเขียนโค้ดภาษา SQL ได้", isCorrect: false }
    ],
    explanation: "การออกแบบ E-R Diagram ทำหน้าที่เหมือนพิมพ์เขียว (Blueprint) ช่วยให้เห็นความสัมพันธ์ของข้อมูลชัดเจน ป้องกันการออกแบบผิดพลาด"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- ========================================================================= -->
    <!-- 1. Header ประจำสัปดาห์ / สัปดาห์ที่และชื่อบทเรียน                            -->
    <!-- ========================================================================= -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-green-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-5 pointer-events-none">
        <Database class="w-[400px] h-[400px] -translate-y-20 translate-x-20 text-green-900" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">
          {{ weekNumberText }}
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-green-900 mb-4 leading-tight">
          {{ lessonTitle }}<br />
          <span class="text-3xl text-green-700">({{ lessonTitleEn }})</span>
        </h1>
        <p class="text-gray-600 text-xl leading-relaxed">
          {{ chapterDescription }}
        </p>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 2. ระบบเช็คชื่อเข้าชั้นเรียน (Check-In System)                                -->
    <!-- ========================================================================= -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- ========================================================================= -->
    <!-- 3. ข้อมูลประจำบทเรียน & คำอธิบายรายบท (Chapter Overview)                     -->
    <!--    (แทนที่ข้อมูลรายวิชาเดิม สัดส่วนคะแนนไม่มีแล้วสำหรับสัปดาห์ต่อๆ ไป)           -->
    <!-- ========================================================================= -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-bold text-gray-800">ข้อมูลประจำบทเรียน (Chapter Overview)</h2>
          <p class="text-sm text-gray-500 mt-0.5">ขอบเขตเนื้อหา จุดประสงค์ และผลลัพธ์การเรียนรู้ประจำ{{ weekNumberText }}</p>
        </div>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-blue-100 space-y-8">
        <!-- Chapter Header Badge & Time -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-sm">{{ currentCourseId }}</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">{{ courseName }}</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-sm border border-emerald-200 flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" /> {{ lessonHours }}
              </span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-blue-900">{{ lessonTitle }}</h3>
            <p class="text-gray-500 text-lg">{{ lessonTitleEn }}</p>
          </div>
        </div>

        <!-- คำอธิบายรายบท (Chapter Description) -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-blue-500" /> คำอธิบายรายบท (Chapter Description)
          </h4>
          <p class="text-gray-700 leading-relaxed text-lg bg-blue-50/80 p-6 md:p-8 rounded-xl border border-blue-100 shadow-inner">
            {{ chapterDescription }}
          </p>
        </div>

        <!-- 3 Columns: จุดประสงค์ / สมรรถนะ / ผลลัพธ์การเรียนรู้ -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Objectives -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">จุดประสงค์การเรียนรู้ประจำบท</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-2.5 text-sm flex-1">
              <li v-for="(obj, idx) in chapterObjectives" :key="idx">{{ obj }}</li>
            </ol>
          </div>

          <!-- Competencies -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-amber-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Award class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">สมรรถนะประจำบท</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-2.5 text-sm flex-1">
              <li v-for="(comp, idx) in chapterCompetencies" :key="idx">{{ comp }}</li>
            </ol>
          </div>

          <!-- Outcomes -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-teal-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Lightbulb class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">ผลลัพธ์การเรียนรู้ประจำบท</h4>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed flex-1 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
              {{ chapterOutcomes }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 4. เนื้อหาบทเรียนประจำสัปดาห์ (Lecture Content)                              -->
    <!--    (สามารถใส่เนื้อหา, โค้ดตัวอย่าง, แผนภาพ, และกล่องเน้นข้อความได้ตามต้องการ)      -->
    <!-- ========================================================================= -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-green-100 rounded-xl text-green-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
          <p class="text-sm text-gray-500 mt-0.5">ศึกษาเนื้อหาและทำความเข้าใจก่อนเริ่มกิจกรรมมินิเกม</p>
        </div>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-green-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- ส่วนที่ 1: หัวข้อหลักและคำอธิบาย -->
        <div>
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-4">
            ส่วนที่ 1: โครงสร้างของฐานข้อมูลเชิงสัมพันธ์ (Relational Model Concepts)
          </h3>
          <p class="mb-4">
            ฐานข้อมูลเชิงสัมพันธ์จัดเก็บข้อมูลในรูปแบบของ <strong>ตาราง (Table หรือ Relation)</strong> ซึ่งประกอบด้วย 
            <strong>แถว (Row หรือ Tuple)</strong> แทนแต่ละรายการข้อมูล และ <strong>คอลัมน์ (Column หรือ Attribute)</strong> แทนคุณลักษณะของข้อมูล
          </p>

          <!-- ตัวอย่างการ์ดคู่เปรียบเทียบ -->
          <div class="grid md:grid-cols-2 gap-6 mt-6">
            <div class="bg-blue-50/60 p-6 rounded-xl border border-blue-200">
              <h4 class="font-bold text-blue-900 text-xl mb-2 flex items-center gap-2">
                <Database class="w-5 h-5 text-blue-600" /> Entity (เอนทิตี)
              </h4>
              <p class="text-sm text-gray-600 mb-3">
                สิ่งที่ระบบสนใจจัดเก็บข้อมูล เทียบเท่ากับ <strong>ตาราง (Table)</strong> 1 ตาราง
              </p>
              <div class="bg-white p-3.5 rounded-lg border border-blue-100 text-xs">
                <strong>ตัวอย่าง:</strong> ตาราง Customer, ตาราง Product, ตาราง Orders
              </div>
            </div>

            <div class="bg-emerald-50/60 p-6 rounded-xl border border-emerald-200">
              <h4 class="font-bold text-emerald-900 text-xl mb-2 flex items-center gap-2">
                <FileText class="w-5 h-5 text-emerald-600" /> Attribute (แอตทริบิวต์)
              </h4>
              <p class="text-sm text-gray-600 mb-3">
                คุณสมบัติย่อยของเอนทิตี เทียบเท่ากับ <strong>คอลัมน์ (Column)</strong> ในตาราง
              </p>
              <div class="bg-white p-3.5 rounded-lg border border-emerald-100 text-xs">
                <strong>ตัวอย่าง:</strong> CustomerID, Firstname, Lastname, Email, Price
              </div>
            </div>
          </div>
        </div>

        <!-- ส่วนที่ 2: สรุปความสัมพันธ์ (Cardinality) -->
        <div>
          <h3 class="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4 mb-4">
            ส่วนที่ 2: ประเภทของความสัมพันธ์ระหว่างข้อมูล (Cardinality Types)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
            <div class="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 inline-block mb-2">1:1</span>
              <h4 class="font-bold text-gray-800 text-base mb-1">One-to-One</h4>
              <p class="text-gray-600 text-xs">ข้อมูล 1 รายการสัมพันธ์กับอีกฝั่ง 1 รายการเท่านั้น เช่น พลเมือง 1 คน มีบัตรประชาชนได้ 1 ใบ</p>
            </div>
            <div class="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 inline-block mb-2">1:N</span>
              <h4 class="font-bold text-gray-800 text-base mb-1">One-to-Many</h4>
              <p class="text-gray-600 text-xs">พบบ่อยที่สุด ฝั่งหนึ่งสัมพันธ์ได้หลายรายการ เช่น ลูกค้า 1 คน สร้างคำสั่งซื้อได้หลายใบเสร็จ</p>
            </div>
            <div class="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 inline-block mb-2">M:N</span>
              <h4 class="font-bold text-gray-800 text-base mb-1">Many-to-Many</h4>
              <p class="text-gray-600 text-xs">ทั้งสองฝั่งสัมพันธ์ได้หลายรายการ ต้องแตกเป็นตารางตัวกลาง (Junction Table) เสมอ</p>
            </div>
          </div>
        </div>

        <!-- ส่วนที่ 3: กล่องเน้นข้อควรระวัง / Tips -->
        <div class="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm text-amber-950 flex items-start gap-4">
          <AlertTriangle class="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h5 class="font-bold text-base mb-1">กฎเหล็กในการกำหนด Primary Key และ Foreign Key</h5>
            <ul class="list-disc pl-5 space-y-1 text-xs sm:text-sm text-amber-900">
              <li><strong>Entity Integrity:</strong> Primary Key ต้องไม่เป็นค่าว่าง (NOT NULL) และห้ามซ้ำกันโดยเด็ดขาด</li>
              <li><strong>Referential Integrity:</strong> ค่าใน Foreign Key จะต้องตรงกับค่า Primary Key ของตารางที่อ้างอิงไป หรือเป็น NULL เท่านั้น</li>
            </ul>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 5. Interactive Game Center (ระบบมินิเกมและแบบทดสอบหลังเรียน)                    -->
    <!-- ========================================================================= -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-xl text-purple-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน</h2>
            <p class="text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน</p>
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
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำ{{ weekNumberText }}</span>
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
          <div class="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 rounded-xl border border-emerald-100">
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
              <span class="font-bold block">1. จำแนก Entity vs Attribute</span>
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
              <span class="font-bold block">2. จับคู่คำศัพท์ & สัญลักษณ์</span>
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
          <span>มินิเกมที่ 1: Entity vs Attribute</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: สัญลักษณ์ E-R Diagram</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200',
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
        game-title="เกมลากวาง: จำแนก Entity vs Attribute"
        title="จำแนก Entity และ Attribute"
        subtitle="ลากชื่อรายการข้อมูลไปใส่ในกล่อง Entity หรือ Attribute ให้ถูกต้องครบทั้ง 6 ข้อ!"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="game-2"
        game-title="เกมจับคู่: คำศัพท์และสัญลักษณ์ E-R Diagram"
        title="คำศัพท์และสัญลักษณ์ใน E-R Diagram"
        subtitle="จับคู่คำศัพท์ด้านซ้ายกับความหมายและหน้าที่ด้านขวาให้ถูกต้องครบทั้ง 5 คู่"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs"
      />

      <!-- Game 3: Pop Quiz (Post-test) -->
      <PopQuiz v-if="activeGame === 'quiz'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="quiz"
        :game-title="`แบบทดสอบหลังเรียน Week ${currentWeek} (${lessonTitle})`"
        :title="`แบบทดสอบหลังเรียน: สัปดาห์ที่ ${currentWeek}`"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจรอบด้าน ทำได้เพียงครั้งเดียวเท่านั้น"
        :questions="quizQuestions"
      >
        <template #actions>
          <RouterLink to="/courses"
            class="px-8 py-4 bg-emerald-600 border-2 border-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- ========================================================================= -->
    <!-- 6. ส่วนใบงานประจำสัปดาห์ (Assignment Section)                                -->
    <!-- ========================================================================= -->
    <AssignmentSection
      :course-id="currentCourseId"
      :assignment-id="`asm-${currentWeek}`"
      :assignment-title="`ใบงานที่ ${currentWeek}: การออกแบบและสร้างแบบจำลอง E-R Diagram`"
      :max-score="10"
    >
      <template #number>{{ currentWeek }}</template>
      
      <template #description>
        ให้นักศึกษาวิเคราะห์กรณีศึกษาธุรกิจที่ตนเองสนใจ หรือโจทย์ที่กำหนดให้ ออกแบบและเขียนแผนภาพ 
        <strong>E-R Diagram</strong> ระบุ Entity, Attribute, Primary Key, Foreign Key 
        และ Cardinality ให้สมบูรณ์ พร้อมสรุปเป็น Relational Schema
      </template>

      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>กำหนดขอบเขตระบบงาน และระบุรายชื่อ <strong>Entity อย่างน้อย 3-4 เอนทิตี</strong></span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>ระบุ <strong>Attribute</strong> ของแต่ละเอนทิตี พร้อมขีดเส้นใต้ระบุ <strong>Primary Key</strong> ให้ชัดเจน</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>วาดเส้นความสัมพันธ์ (Relationship) พร้อมระบุอัตราส่วน <strong>Cardinality (1:1, 1:N, หรือ M:N)</strong></span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>บันทึกไฟล์ภาพ E-R Diagram หรือเอกสาร PDF อัปโหลดส่งผ่านระบบส่งงานด้านล่าง</span>
        </li>
      </template>
    </AssignmentSection>

    <!-- ========================================================================= -->
    <!-- 7. ตารางคะแนนสำหรับคุณครู (Teacher Scoreboard Modal)                           -->
    <!-- ========================================================================= -->
    <TeacherScoreboardModal
      :show="showTeacherModal"
      :isOpen="showTeacherModal"
      :course-id="currentCourseId"
      :courseName="courseName"
      :week="currentWeek"
      :weekTitle="lessonTitle"
      :games="weekGames"
      @close="showTeacherModal = false"
    />

  </div>
</template>

<style scoped>
/* สไตล์เพิ่มเติมสำหรับแอนิเมชันเนื้อหา */
</style>
