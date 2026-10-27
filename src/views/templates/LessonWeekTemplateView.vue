<script setup>
/**
 * ==============================================================================
 * 🌟 UNIVERSAL LESSON VIEW TEMPLATE: แม่แบบหน้าบทเรียนประจำสัปดาห์ (Week N)
 * ==============================================================================
 * ออกแบบตามโครงสร้างมาตรฐานของห้องเรียน:
 * 1. ข้อมูลประจำบทเรียน & คำอธิบายรายบท (Chapter Overview) - [ไม่มีสัดส่วนคะแนน 20-40-20-20]
 * 2. ระบบเช็คชื่อเข้าเรียน (CheckInSystem)
 * 3. เนื้อหาบทเรียนประจำสัปดาห์ (Lecture Content)
 * 4. Game Center: มินิเกม 1 + มินิเกม 2 + แบบทดสอบหลังเรียน 10 ข้อ (เล่นได้ครั้งเดียว หารเต็ม 10)
 * 5. ตารางคะแนนสำหรับคุณครู (TeacherScoreboardModal - Read-only)
 * 6. ใบงานประจำสัปดาห์ (AssignmentSection)
 * ==============================================================================
 * 📌 ขั้นตอนการสร้างสัปดาห์ใหม่:
 * 1. คัดลอกไฟล์นี้ไปวางในโฟลเดอร์รายวิชา เช่น src/views/database/Week2View.vue
 * 2. เปลี่ยนรหัสวิชา, สัปดาห์, ชื่อบทเรียน, คำอธิบายรายบทในโซน [⚙️ CONFIGURATION]
 * 3. ใส่เนื้อหาบทเรียนในโซน [📖 3. เนื้อหาบทเรียน]
 * 4. กำหนดข้อมูลมินิเกม 1, มินิเกม 2, และโจทย์แบบทดสอบหลังเรียน 10 ข้อ
 * 5. ลงทะเบียน Route ใน src/router/index.js เช่น /course/31901-2007/week/2
 * ==============================================================================
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  BookOpen, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Clock, Trophy, Lock, FileSpreadsheet, Code2,
  AlertTriangle, Sparkles, CheckCircle2, BookmarkCheck, HelpCircle,
  ExternalLink, Laptop, Cpu, GitBranch, BarChart3
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

// ==============================================================================
// ⚙️ [CONFIGURATION]: ปรับแต่งข้อมูลประจำบทเรียนตรงนี้
// ==============================================================================
const currentCourseId = '31901-2007' // 🔹 รหัสวิชา: '31901-2007' (Database), '21901-2012' (Platform), '21900-1004' (OOAD), '21901-2007' (IoT), '31901-2012' (Analysis)
const currentWeek = 2               // 🔹 สัปดาห์ที่เรียน (Week Number: 2, 3, 4, ...)
const courseName = 'เทคโนโลยีการจัดการฐานข้อมูล'
const weekNumberText = `สัปดาห์ที่ ${currentWeek}`
const lessonTitle = 'ชื่อบทเรียนประจำสัปดาห์'
const lessonTitleEn = 'Weekly Lesson Title in English'
const lessonHours = '4 ชั่วโมง (ทฤษฎี 1 ชม. ปฏิบัติ 3 ชม.)'

// ธีมสี (เปลี่ยนคลาสสี Tailwind ให้เหมาะกับวิชา):
// Database = green/emerald, Platform = indigo, OOAD = purple, IoT = amber, Analysis = sky
const themeColor = {
  primaryBg: 'bg-emerald-600',
  primaryText: 'text-emerald-900',
  accentBadge: 'bg-emerald-100 text-emerald-800',
  border: 'border-emerald-200',
  bannerGradient: 'from-emerald-900 to-teal-900',
  buttonActive: 'bg-emerald-600 text-white shadow-lg scale-105',
  buttonInactive: 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
}

// Modal States
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

// ==============================================================================
// 🎯 ข้อมูลประจำบทเรียน & คำอธิบายรายบท (Chapter Overview)
// (แทนที่คำอธิบายรายวิชา และไม่มีสัดส่วนคะแนน 20-40-20-20 แล้ว)
// ==============================================================================
const chapterDescription = `ศึกษาและปฏิบัติเกี่ยวกับ [ใส่คำอธิบายภาพรวมของบทเรียนในสัปดาห์นี้ว่าผู้เรียนจะได้เรียนรู้อะไร มีความสำคัญอย่างไรในสายงาน และครอบคลุมหัวข้อสำคัญใดบ้าง]`

const chapterObjectives = [
  'อธิบายหลักการและความสำคัญของหัวข้อในบทเรียนนี้ได้',
  'วิเคราะห์และเลือกใช้วิธีการ/เครื่องมือที่เหมาะสมกับโจทย์ได้',
  'ปฏิบัติตามขั้นตอนได้อย่างถูกต้องตามมาตรฐาน',
  'ประยุกต์ใช้ความรู้ในการแก้ไขปัญหาจากกรณีศึกษาจริงได้'
]

const chapterCompetencies = [
  'ประมวลความรู้ความเข้าใจตามหลักการของเนื้อหาประจำบท',
  'ปฏิบัติการและแก้ไขปัญหาตามโจทย์สถานการณ์ที่กำหนด',
  'ประยุกต์ใช้ทักษะในการทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ'
]

const chapterOutcomes = `ผู้เรียนสามารถปฏิบัติงานตามใบงานประจำสัปดาห์ได้ถูกต้องตามข้อกำหนด และสามารถทำคะแนนแบบทดสอบหลังเรียนผ่านเกณฑ์ร้อยละ 60 ขึ้นไป`

// ==============================================================================
// 🎮 Game Center Configuration
// กฎเหล็ก: เล่นได้ครั้งเดียว ไม่เฉลยระหว่างทำ กิจกรรมสุดท้ายคือแบบทดสอบหลังเรียน 10 ข้อ
// รวมคะแนนดิบทุกกิจกรรมหารเฉลี่ยให้เหลือเต็ม 10.0 คะแนน
// ==============================================================================
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (เกมลากวาง Drag & Drop)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (เกมจับคู่ Matching)', maxScore: 5, isQuiz: false },
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
// 🕹️ มินิเกมที่ 1: Drag & Drop (จำแนกหมวดหมู่ - 6 รายการ, เต็ม 6 คะแนน)
// ------------------------------------------------------------------------------
const dragItemsData = [
  { id: 1, text: 'ตัวอย่างข้อความที่ 1', type: 'categoryA' },
  { id: 2, text: 'ตัวอย่างข้อความที่ 2', type: 'categoryB' },
  { id: 3, text: 'ตัวอย่างข้อความที่ 3', type: 'categoryA' },
  { id: 4, text: 'ตัวอย่างข้อความที่ 4', type: 'categoryB' },
  { id: 5, text: 'ตัวอย่างข้อความที่ 5', type: 'categoryA' },
  { id: 6, text: 'ตัวอย่างข้อความที่ 6', type: 'categoryB' }
]

const dragZonesData = [
  { 
    id: 'categoryA', 
    title: 'หมวดหมู่ ก (Category A)', 
    wrapperClass: 'border-blue-400/50 hover:bg-black/40', 
    titleClass: 'text-blue-300 border-blue-400/30', 
    itemBgClass: 'bg-blue-600/50 border-blue-400', 
    emptyTextClass: 'text-blue-200/50', 
    emptyText: 'ลากรายการหมวดหมู่ ก มาวางที่นี่' 
  },
  { 
    id: 'categoryB', 
    title: 'หมวดหมู่ ข (Category B)', 
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40', 
    titleClass: 'text-emerald-300 border-emerald-400/30', 
    itemBgClass: 'bg-emerald-600/50 border-emerald-400', 
    emptyTextClass: 'text-emerald-200/50', 
    emptyText: 'ลากรายการหมวดหมู่ ข มาวางที่นี่' 
  }
]

// ------------------------------------------------------------------------------
// 🕹️ มินิเกมที่ 2: Matching (จับคู่ความสัมพันธ์ - 5 คู่, เต็ม 5 คะแนน)
// ------------------------------------------------------------------------------
const matchLeftTerms = [
  { id: 'l1', text: '1. คำศัพท์ / คำถามที่ 1', match: 'r1' },
  { id: 'l2', text: '2. คำศัพท์ / คำถามที่ 2', match: 'r2' },
  { id: 'l3', text: '3. คำศัพท์ / คำถามที่ 3', match: 'r3' },
  { id: 'l4', text: '4. คำศัพท์ / คำถามที่ 4', match: 'r4' },
  { id: 'l5', text: '5. คำศัพท์ / คำถามที่ 5', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ความหมาย หรือหน้าที่การทำงานที่ตรงกับคำศัพท์ข้อ 1' },
  { id: 'r2', text: 'ความหมาย หรือหน้าที่การทำงานที่ตรงกับคำศัพท์ข้อ 2' },
  { id: 'r3', text: 'ความหมาย หรือหน้าที่การทำงานที่ตรงกับคำศัพท์ข้อ 3' },
  { id: 'r4', text: 'ความหมาย หรือหน้าที่การทำงานที่ตรงกับคำศัพท์ข้อ 4' },
  { id: 'r5', text: 'ความหมาย หรือหน้าที่การทำงานที่ตรงกับคำศัพท์ข้อ 5' }
]

// ------------------------------------------------------------------------------
// 📝 มินิเกมที่ 3: แบบทดสอบหลังเรียน (Post-test 10 ข้อ 4 ตัวเลือก A-D, เต็ม 10 คะแนน)
// ------------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 1,
    question: "คำถามข้อที่ 1 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลว่าทำไมข้อ A จึงถูกต้องเพื่อเป็นความรู้หลังทำเสร็จ"
  },
  {
    id: 2,
    question: "คำถามข้อที่ 2 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 2"
  },
  {
    id: 3,
    question: "คำถามข้อที่ 3 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'c', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 3"
  },
  {
    id: 4,
    question: "คำถามข้อที่ 4 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 4"
  },
  {
    id: 5,
    question: "คำถามข้อที่ 5 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 5"
  },
  {
    id: 6,
    question: "คำถามข้อที่ 6 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'c', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 6"
  },
  {
    id: 7,
    question: "คำถามข้อที่ 7 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 7"
  },
  {
    id: 8,
    question: "คำถามข้อที่ 8 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 8"
  },
  {
    id: 9,
    question: "คำถามข้อที่ 9 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'c', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 9"
  },
  {
    id: 10,
    question: "คำถามข้อที่ 10 เกี่ยวกับเนื้อหาสำคัญในบทเรียนนี้?",
    options: [
      { id: 'a', text: "คำตอบที่ถูกต้องตามหลักการ", isCorrect: true },
      { id: 'b', text: "ตัวเลือกลวงข้อที่ 1", isCorrect: false },
      { id: 'c', text: "ตัวเลือกลวงข้อที่ 2", isCorrect: false },
      { id: 'd', text: "ตัวเลือกลวงข้อที่ 3", isCorrect: false }
    ],
    explanation: "คำอธิบายเหตุผลประกอบคำตอบข้อที่ 10"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- ========================================================================= -->
    <!-- 1. Header ประจำสัปดาห์ (Page Header)                                      -->
    <!-- ========================================================================= -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[240px]">
      <div class="absolute right-0 top-0 opacity-5 pointer-events-none">
        <BookOpen class="w-[380px] h-[380px] -translate-y-16 translate-x-16 text-gray-900" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-sm uppercase tracking-wider mb-5 inline-block shadow-sm">
          {{ weekNumberText }}
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
          {{ lessonTitle }}<br />
          <span class="text-2xl sm:text-3xl text-emerald-700 font-semibold">({{ lessonTitleEn }})</span>
        </h1>
        <p class="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3">
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
    <!--    (แทนที่คำอธิบายรายวิชาเดิม และไม่มีการแสดงสัดส่วนคะแนน 20-40-20-20 แล้ว)       -->
    <!-- ========================================================================= -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">ข้อมูลประจำบทเรียน (Chapter Overview)</h2>
          <p class="text-sm text-gray-500 mt-0.5">ขอบเขตเนื้อหา จุดประสงค์ และผลลัพธ์การเรียนรู้ประจำ{{ weekNumberText }}</p>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-blue-100 space-y-8">
        <!-- Chapter Header Badge & Time -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-sm">{{ currentCourseId }}</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">{{ courseName }}</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-sm border border-emerald-200 flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" /> {{ lessonHours }}
              </span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-blue-900">{{ lessonTitle }}</h3>
            <p class="text-gray-500 text-base md:text-lg">{{ lessonTitleEn }}</p>
          </div>
        </div>

        <!-- คำอธิบายรายบท (Chapter Description) -->
        <div>
          <h4 class="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-blue-500" /> คำอธิบายรายบท (Chapter Description)
          </h4>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg bg-blue-50/80 p-6 md:p-8 rounded-xl border border-blue-100 shadow-inner">
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
    <!-- ========================================================================= -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
          <p class="text-sm text-gray-500 mt-0.5">ศึกษาเนื้อหาและทฤษฎีเพื่อเตรียมพร้อมทำมินิเกมและแบบทดสอบ</p>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 space-y-10 text-gray-700 leading-relaxed text-base sm:text-lg">

        <!-- ตัวอย่างบล็อกเนื้อหาที่ 1: หัวข้อย่อยและเนื้อหาบรรยาย -->
        <div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4 mb-4">
            ส่วนที่ 1: หัวข้อหลักและแนวคิดสำคัญ (Key Concepts)
          </h3>
          <p class="mb-4">
            [ใส่คำอธิบายเนื้อหาและหลักการสำคัญในหัวข้อที่ 1 สามารถใส่ข้อความ ตัวหนา ลิสต์รายการ หรือลิงก์ที่เกี่ยวข้องได้]
          </p>

          <!-- ตัวอย่างการ์ดข้อมูลแบบคู่ -->
          <div class="grid md:grid-cols-2 gap-6 mt-6">
            <div class="bg-blue-50/70 p-6 rounded-xl border border-blue-200">
              <h4 class="font-bold text-blue-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-blue-600" /> ประเด็นที่ 1 (Concept A)
              </h4>
              <p class="text-sm text-gray-600 mb-3">
                อธิบายแนวคิด หลักการ หรือคุณลักษณะเด่นของประเด็นแรก
              </p>
              <div class="bg-white p-3.5 rounded-lg border border-blue-100 text-xs text-gray-700">
                <strong>ตัวอย่าง:</strong> ข้อมูลหรือตัวอย่างการนำไปใช้จริงในองค์กร
              </div>
            </div>

            <div class="bg-emerald-50/70 p-6 rounded-xl border border-emerald-200">
              <h4 class="font-bold text-emerald-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-emerald-600" /> ประเด็นที่ 2 (Concept B)
              </h4>
              <p class="text-sm text-gray-600 mb-3">
                อธิบายแนวคิด หลักการ หรือคุณลักษณะเด่นของประเด็นที่สอง
              </p>
              <div class="bg-white p-3.5 rounded-lg border border-emerald-100 text-xs text-gray-700">
                <strong>ตัวอย่าง:</strong> ข้อมูลหรือตัวอย่างการนำไปใช้จริงในองค์กร
              </div>
            </div>
          </div>
        </div>

        <!-- ตัวอย่างบล็อกเนื้อหาที่ 2: กล่องข้อความโค้ด / ไวยากรณ์คำสั่ง -->
        <div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4 mb-4">
            ส่วนที่ 2: รูปแบบคำสั่งและตัวอย่างปฏิบัติการ (Syntax & Code Example)
          </h3>
          <p class="mb-4">
            [ใส่คำอธิบายโค้ด คำสั่ง ไวยากรณ์ หรือโครงสร้างคำสั่งที่ใช้ในการปฏิบัติงาน]
          </p>
          
          <div class="bg-slate-950 text-slate-100 p-5 rounded-2xl font-mono text-sm overflow-x-auto shadow-inner border border-slate-800">
            <div class="flex items-center justify-between text-xs text-slate-400 pb-3 mb-3 border-b border-slate-800">
              <span>Code / Script Template</span>
              <span>Language: SQL / C++ / Python</span>
            </div>
            <pre class="leading-relaxed"><code>-- ตัวอย่างโค้ดคำสั่งสำหรับนักศึกษาศึกษา
SELECT customer_id, customer_name, SUM(total_amount) AS total_spent
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_id, customer_name
ORDER BY total_spent DESC;</code></pre>
          </div>
        </div>

        <!-- ตัวอย่างบล็อกเนื้อหาที่ 3: กล่องเน้นข้อควรระวัง / Tips -->
        <div class="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm text-amber-950 flex items-start gap-4">
          <AlertTriangle class="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h5 class="font-bold text-base mb-1">ข้อควรระวังและแนวปฏิบัติที่ดี (Best Practices)</h5>
            <ul class="list-disc pl-5 space-y-1 text-xs sm:text-sm text-amber-900">
              <li>ตรวจสอบความถูกต้องของเงื่อนไขและข้อมูลนำเข้าก่อนประมวลผลเสมอ</li>
              <li>หลีกเลี่ยงการกระทำที่อาจส่งผลกระทบต่อความปลอดภัยและประสิทธิภาพของระบบ</li>
            </ul>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 5. Interactive Game Center (ระบบมินิเกมและแบบทดสอบหลังเรียน)                    -->
    <!--    (บันทึกคะแนนครั้งเดียว ไม่เฉลยระหว่างทำ กิจกรรมสุดท้ายคือ Post-test 10 ข้อ)       -->
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
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-emerald-700 shrink-0 cursor-pointer">
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
              <span class="font-bold block">1. มินิเกมที่ 1 (ลากวาง)</span>
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
              <span class="font-bold block">2. มินิเกมที่ 2 (จับคู่)</span>
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

      <!-- Game Tabs (มินิเกม 1 -> มินิเกม 2 -> สุดท้ายคือแบบทดสอบหลังเรียน) -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: ลากวาง</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่ความสัมพันธ์</span>
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
        game-title="เกมลากวาง: จำแนกหมวดหมู่"
        title="มินิเกมที่ 1: จำแนกหมวดหมู่"
        subtitle="ลากชื่อรายการข้อมูลไปใส่ในกล่องหมวดหมู่ที่ถูกต้องให้ครบทั้ง 6 ข้อ!"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'"
        :course-id="currentCourseId"
        :week="currentWeek"
        game-id="game-2"
        game-title="เกมจับคู่: คำศัพท์และความหมาย"
        title="มินิเกมที่ 2: จับคู่ความสัมพันธ์"
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
      :assignment-title="`ใบงานที่ ${currentWeek}: การฝึกปฏิบัติงานประจำบทเรียน`"
      :max-score="10"
    >
      <template #number>{{ currentWeek }}</template>
      
      <template #description>
        ให้นักศึกษาฝึกปฏิบัติตามโจทย์กรณีศึกษาที่กำหนด บันทึกผลการทดลอง และส่งรายงานผลการปฏิบัติงาน
        พร้อมแนบไฟล์หรือลิงก์ผลงานผ่านระบบส่งงานด้านล่าง
      </template>

      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>ศึกษาขั้นตอนและคำแนะนำในใบงานอย่างละเอียดก่อนลงมือทำ</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>ลงมือปฏิบัติตามโจทย์และบันทึกภาพหน้าจอผลลัพธ์ (Screenshot) ทุกขั้นตอน</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>สรุปผลการทดลอง ตอบคำถามท้ายบท และอัปโหลดไฟล์/แชร์ลิงก์ส่งงาน</span>
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
/* สไตล์ตกแต่งเพิ่มเติม */
</style>
