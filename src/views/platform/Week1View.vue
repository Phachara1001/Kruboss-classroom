<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload, Database,
  Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target, Award,
  Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star, Shuffle,
  MousePointer2, Code, Settings, Cloud, RefreshCw, GitBranch, GitCommit,
  GitMerge, Clock, Trophy, Lock, FileSpreadsheet
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

// Current Course & Week context
const currentCourseId = '21901-2012'
const currentWeek = 1

// Router
const route = useRoute()
const router = useRouter()

// Grading Criteria Data
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-indigo-400' },
  { name: 'คะแนนเก็บ (ใบงาน/โปรเจกต์)', score: 40, color: 'bg-indigo-500' },
  { name: 'สอบกลางภาค (Midterm)', score: 20, color: 'bg-blue-600' },
  { name: 'สอบปลายภาค (Final)', score: 20, color: 'bg-cyan-700' }
]

// Modal & Game Config
const showTeacherModal = ref(false)
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (แยกประเภทแบบเก่า vs DevOps)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (โยงคำศัพท์ Git & DevOps)', maxScore: 5, isQuiz: false },
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
    question: "ข้อใดคือความหมายและเป้าหมายที่แท้จริงของคำว่า 'DevOps'?",
    options: [
      { id: 'a', text: "เครื่องมือเขียนโปรแกรมคอมไพเลอร์ภาษาใหม่", isCorrect: false },
      { id: 'b', text: "วัฒนธรรมและการทำงานร่วมกันอย่างใกล้ชิดระหว่างทีม Dev และ ทีม Ops เพื่อส่งมอบซอฟต์แวร์ได้อย่างรวดเร็วและมีเสถียรภาพ", isCorrect: true },
      { id: 'c', text: "โปรแกรมสำหรับสแกนและกำจัดไวรัสในเซิร์ฟเวอร์", isCorrect: false },
      { id: 'd', text: "แผนกจัดซื้ออุปกรณ์ฮาร์ดแวร์ประจำองค์กร", isCorrect: false }
    ],
    explanation: "DevOps ไม่ใช่แค่โปรแกรม แต่เป็น 'วัฒนธรรม' และ 'แนวปฏิบัติ' ที่ผสานทีม Development และ Operations เข้าด้วยกันเพื่อความรวดเร็วและคุณภาพ"
  },
  {
    id: 2,
    question: "ปัญหาคลาสสิก 'Works on my machine' (รันบนเครื่องฉันได้ แต่เครื่องคนอื่นพัง) มักเกิดจากสาเหตุใดมากที่สุด?",
    options: [
      { id: 'a', text: "ความเร็วเครือข่ายอินเทอร์เน็ตของแต่ละคนไม่เท่ากัน", isCorrect: false },
      { id: 'b', text: "สภาพแวดล้อม (Environment) เวอร์ชันของโปรแกรม และไลบรารีไม่ตรงกันระหว่างเครื่องนักพัฒนาและเซิร์ฟเวอร์", isCorrect: true },
      { id: 'c', text: "ขนาดหน้าจอคอมพิวเตอร์มีความกว้างต่างกัน", isCorrect: false },
      { id: 'd', text: "ยี่ห้อของเมนบอร์ดและคีย์บอร์ดไม่เหมือนกัน", isCorrect: false }
    ],
    explanation: "ความแตกต่างของ OS, runtime version, หรือ library dependencies ระหว่างเครื่องทำให้เกิดปัญหานี้ ซึ่ง DevOps จะแก้ด้วย Container เช่น Docker"
  },
  {
    id: 3,
    question: "ระบบควบคุมเวอร์ชัน (Version Control System เช่น Git) มีประโยชน์หลักอย่างไรในการทำงานเป็นทีม?",
    options: [
      { id: 'a', text: "ติดตามประวัติการแก้ไข รวมโค้ดของทุกคนเข้าด้วยกันอย่างเป็นระบบ และสามารถย้อนกลับเวอร์ชันเดิมได้ตลอดเวลา", isCorrect: true },
      { id: 'b', text: "แปลงโค้ดภาษา Python ให้กลายเป็นภาษา Java อัตโนมัติ", isCorrect: false },
      { id: 'c', text: "ป้องกันไม่ให้ใครเปิดดูโค้ดของตนเองได้", isCorrect: false },
      { id: 'd', text: "ทำหน้าที่เป็นระบบปฏิบัติการแทน Windows หรือ Linux", isCorrect: false }
    ],
    explanation: "Git ช่วยบันทึกประวัติการเปลี่ยนแปลง (Commit) และสนับสนุนการทำงานร่วมกันแบบหลายกิ่ง (Branching) ได้อย่างมีประสิทธิภาพ"
  },
  {
    id: 4,
    question: "ในระบบ Git คำสั่งหรือการทำ 'Commit' มีความหมายตรงกับข้อใด?",
    options: [
      { id: 'a', text: "การลบไฟล์และโฟลเดอร์ที่ไม่ต้องการออกจากฮาร์ดดิสก์", isCorrect: false },
      { id: 'b', text: "การเปิดหน้าต่างแก้ไขโค้ดขึ้นมาใหม่", isCorrect: false },
      { id: 'c', text: "การบันทึกภาพถ่ายสถานะและการเปลี่ยนแปลงของไฟล์โค้ด ณ จุดนั้น พร้อมข้อความอธิบายความเปลี่ยนแปลง", isCorrect: true },
      { id: 'd', text: "การรีสตาร์ทเครื่องคอมพิวเตอร์เพื่อล้างหน่วยความจำ", isCorrect: false }
    ],
    explanation: "Commit เปรียบเสมือนจุดเช็คพอยต์ (Snapshot) ที่บันทึกสถานะของงานพร้อมเหตุผลประกอบ เพื่อให้ตรวจสอบและย้อนกลับได้"
  },
  {
    id: 5,
    question: "การแตกสายการทำงาน (Branch) ใน Git มีจุดประสงค์เพื่ออะไร?",
    options: [
      { id: 'a', text: "แยกสายงานออกไปพัฒนาฟีเจอร์ใหม่โดยไม่ส่งผลกระทบต่อโค้ดหลักที่ใช้งานอยู่", isCorrect: true },
      { id: 'b', text: "เพิ่มความเร็วในการคำนวณของซีพียู", isCorrect: false },
      { id: 'c', text: "บีบอัดไฟล์ให้มีขนาดเล็กลงเพื่อส่งอีเมล", isCorrect: false },
      { id: 'd', text: "ปิดไม่ให้นักพัฒนาคนอื่นเข้าถึงอินเทอร์เน็ตได้", isCorrect: false }
    ],
    explanation: "Branch ช่วยให้นักพัฒนาแยกไปทดลองหรือสร้างฟีเจอร์ใหม่ได้อย่างอิสระ เมื่อทดสอบเสร็จจึงค่อยนำมารวม (Merge) กลับเข้าสายงานหลัก"
  },
  {
    id: 6,
    question: "ระบบ Continuous Integration (CI) มีหน้าที่สำคัญอย่างไรในวงจร DevOps?",
    options: [
      { id: 'a', text: "นำโค้ดของทุกคนมารวมกันที่ส่วนกลางสม่ำเสมอ พร้อม Build และรัน Automated Tests ทันทีเพื่อตรวจหาบั๊กโดยเร็ว", isCorrect: true },
      { id: 'b', text: "ยกเลิกการทดสอบโค้ดทั้งหมดเพื่อปล่อยโปรแกรมให้เร็วที่สุด", isCorrect: false },
      { id: 'c', text: "จ้างพนักงานพิมพ์เอกสารรายงานข้อผิดพลาดส่งทางไปรษณีย์", isCorrect: false },
      { id: 'd', text: "ลบประวัติการเขียนโค้ดทิ้งทั้งหมดเพื่อความปลอดภัย", isCorrect: false }
    ],
    explanation: "CI ช่วยผสานโค้ดอย่างสม่ำเสมอและทดสอบแบบอัตโนมัติ ทำให้พบปัญหาทันที ไม่ต้องรอจนถึงวันส่งมอบงาน"
  },
  {
    id: 7,
    question: "Continuous Delivery / Deployment (CD) หมายถึงกระบวนการใด?",
    options: [
      { id: 'a', text: "การส่งมอบแผ่นซีดีโปรแกรมให้กับลูกค้าทางพัสดุ", isCorrect: false },
      { id: 'b', text: "กระบวนการนำซอฟต์แวร์ที่ผ่านการทดสอบแล้วไปติดตั้งลงสภาพแวดล้อมจริง (Production) แบบอัตโนมัติหรือคลิกเดียว", isCorrect: true },
      { id: 'c', text: "การสั่งซื้อเครื่องเซิร์ฟเวอร์ใหม่ทุกสัปดาห์", isCorrect: false },
      { id: 'd', text: "การเขียนโค้ดต่อเนื่องติดต่อกัน 48 ชั่วโมงโดยไม่หยุดพัก", isCorrect: false }
    ],
    explanation: "CD ทำหน้าที่นำซอฟต์แวร์ที่ผ่าน CI แล้วขึ้นสู่เซิร์ฟเวอร์จริงได้อย่างราบรื่น ลดข้อผิดพลาดจากการติดตั้งด้วยมือ (Manual Error)"
  },
  {
    id: 8,
    question: "ข้อใดเรียงลำดับขั้นตอนใน DevOps Infinity Loop 8 ขั้นตอนได้อย่างถูกต้อง?",
    options: [
      { id: 'a', text: "Plan → Code → Build → Test → Release → Deploy → Operate → Monitor", isCorrect: true },
      { id: 'b', text: "Deploy → Monitor → Plan → Release → Test → Build → Operate → Code", isCorrect: false },
      { id: 'c', text: "Code → Deploy → Test → Plan → Monitor → Operate → Release → Build", isCorrect: false },
      { id: 'd', text: "Monitor → Operate → Plan → Code → Deploy → Build → Test → Release", isCorrect: false }
    ],
    explanation: "วงจรเริ่มจากฝั่ง Dev (Plan, Code, Build, Test) ต่อเนื่องไปยังฝั่ง Ops (Release, Deploy, Operate, Monitor) เป็นวงรอบต่อเนื่องไม่สิ้นสุด"
  },
  {
    id: 9,
    question: "เทคโนโลยี Container เช่น 'Docker' เข้ามาช่วยแก้ปัญหาสำคัญข้อใดในยุค DevOps?",
    options: [
      { id: 'a', text: "ช่วยแพ็กแอปพลิเคชันพร้อม dependencies ทั้งหมดให้ทำงานได้เหมือนกันทุกที่ หมดปัญหาโค้ดรันได้แค่บางเครื่อง", isCorrect: true },
      { id: 'b', text: "เพิ่มขนาดความจุของฮาร์ดดิสก์ทางกายภาพให้เพิ่มขึ้น", isCorrect: false },
      { id: 'c', text: "ป้องกันไฟฟ้าดับในห้องควบคุมคอมพิวเตอร์", isCorrect: false },
      { id: 'd', text: "ช่วยแปลโค้ดภาษาอังกฤษเป็นภาษาไทยได้ทันที", isCorrect: false }
    ],
    explanation: "Container จำลองสภาพแวดล้อมที่จำเป็นสำหรับแอป ทำให้มั่นใจได้ว่าโค้ดที่รันบนเครื่อง Dev จะทำงานบนเซิร์ฟเวอร์จริงได้เหมือนกัน 100%"
  },
  {
    id: 10,
    question: "วัฒนธรรมการทำงานแบบ DevOps ส่งเสริมพฤติกรรมใดมากที่สุด?",
    options: [
      { id: 'a', text: "การโยนความผิดให้ทีมอื่นเมื่อเซิร์ฟเวอร์ล่ม (Blaming Culture)", isCorrect: false },
      { id: 'b', text: "การทำงานแบบแยกส่วน ปิดกั้นข้อมูลระหว่างแผนก (Silo)", isCorrect: false },
      { id: 'c', text: "ความรับผิดชอบร่วมกันตลอดทั้งวงจร (Shared Responsibility) และสื่อสารอย่างโปร่งใส", isCorrect: true },
      { id: 'd', text: "ปล่อยให้ทีม Ops แก้ปัญหาโค้ดทั้งหมดเพียงลำพังหลังปล่อยฟีเจอร์", isCorrect: false }
    ],
    explanation: "หัวใจของ DevOps คือ Shared Responsibility ทั้งสองฝ่ายเป็นเจ้าของความสำเร็จและปัญหาของระบบร่วมกัน"
  }
]

const activeGame = ref('sort') // 'sort', 'order', 'quiz'

// Game 1: Drag & Drop (6 items, max 6)
const dragItemsData = [
  { id: 1, text: 'ทำงานแยกแผนกกัน (Silo)', type: 'traditional' },
  { id: 2, text: 'ทำงานร่วมกันอย่างใกล้ชิด', type: 'devops' },
  { id: 3, text: 'Deploy ด้วยมือแบบ Manual', type: 'traditional' },
  { id: 4, text: 'มีระบบอัตโนมัติ (CI/CD)', type: 'devops' },
  { id: 5, text: 'ผลักภาระให้ทีมอื่นเมื่อมีปัญหา', type: 'traditional' },
  { id: 6, text: 'รับผิดชอบร่วมกันทั้งวงจร', type: 'devops' }
]
const dragZonesData = [
  { 
    id: 'traditional', 
    title: 'การทำงานแบบเก่า (Traditional)', 
    wrapperClass: 'border-gray-400/50 hover:bg-black/40', 
    titleClass: 'text-gray-300 border-gray-400/30', 
    itemBgClass: 'bg-gray-600/50 border-gray-400', 
    emptyTextClass: 'text-gray-200/50', 
    emptyText: 'ลากลักษณะแบบเก่ามาที่นี่' 
  },
  { 
    id: 'devops', 
    title: 'การทำงานแบบเดวอปส์ (DevOps)', 
    wrapperClass: 'border-blue-400/50 hover:bg-black/40', 
    titleClass: 'text-blue-300 border-blue-400/30', 
    itemBgClass: 'bg-blue-600/50 border-blue-400', 
    emptyTextClass: 'text-blue-200/50', 
    emptyText: 'ลากลักษณะแบบ DevOps มาที่นี่' 
  }
]

// Game 2: Matching (5 pairs, max 5)
const matchLeftTerms = [
  { id: 'l1', text: 'Repository', match: 'r2' },
  { id: 'l2', text: 'Commit', match: 'r3' },
  { id: 'l3', text: 'Branch', match: 'r1' },
  { id: 'l4', text: 'Merge', match: 'r4' },
  { id: 'l5', text: 'Clone', match: 'r5' }
]
const matchRightDefs = [
  { id: 'r1', text: 'การแตกสายการทำงานออกไปชั่วคราวเพื่อทำฟีเจอร์ใหม่โดยไม่กระทบงานหลัก' },
  { id: 'r2', text: 'พื้นที่สำหรับจัดเก็บไฟล์โค้ดและประวัติการทำงานของโปรเจกต์' },
  { id: 'r3', text: 'การบันทึกภาพถ่ายสถานะและการเปลี่ยนแปลงของไฟล์พร้อมข้อความอธิบาย' },
  { id: 'r4', text: 'การนำโค้ดที่พัฒนาเสร็จแล้วจากสายงานย่อยมารวมเข้ากับสายงานหลัก' },
  { id: 'r5', text: 'การคัดลอกโปรเจกต์ทั้งหมดจากเซิร์ฟเวอร์ส่วนกลางลงมายังเครื่องตนเอง' }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-indigo-500">
        <GitMerge class="w-[400px] h-[400px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">สัปดาห์ที่
          1</span>
        <h1 class="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 leading-tight">บทนำสู่ DevOps<br /><span
            class="text-3xl text-indigo-700">(Introduction to DevOps)</span></h1>
        <p class="text-gray-600 text-xl leading-relaxed">ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน
          และแนวคิดแบบ DevOps รวมถึงความสำคัญของการทำงานร่วมกันด้วย Version Control
          เนื้อหาบรรยาย 2 ชั่วโมงเต็ม</p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Course Syllabus Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">ข้อมูลรายวิชา (Course Syllabus)</h2>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-indigo-100 space-y-10">
        <!-- Course Code & Name -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-sm shadow-sm">21901-2012</span>
              <span
                class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">1-2-2</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-indigo-900">การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม</h3>
            <p class="text-gray-500 text-lg">Collaboration Tools for Software Development</p>
          </div>
        </div>

        <!-- Course Description -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-indigo-500" /> คำอธิบายรายวิชา
          </h4>
          <p
            class="text-gray-700 leading-relaxed text-lg bg-indigo-50 p-6 md:p-8 rounded-xl border border-indigo-100 shadow-inner">
            ศึกษาและปฏิบัติเกี่ยวกับการดำเนินการพัฒนาซอฟต์แวร์แบบเดวอปส์ (DevOps) การควบคุมเวอร์ชัน (Version Control) สร้างพื้นที่เก็บข้อมูล (Repository) เก็บและการเรียกดูประวัติของแฟ้มข้อมูล หลักการพื้นฐานของกิต (GIT) การแยกสาขา (Branch) การรวมสาขา (Merge) การใช้งานคอนเทนเนอร์ (Containers) การสร้างการทำงานเป็นทีม และการจัดการสภาพแวดล้อมในการทำงานของระบบสารสนเทศเบื้องต้น
          </p>
        </div>

        <!-- Grid for Objectives, Competencies, Outcomes -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              ใช้ระบบควบคุมเวอร์ชันในการสร้างการทำงานร่วมกันเป็นทีม และจัดการสภาพแวดล้อมในการทำงานของระบบสารสนเทศ ด้วยความละเอียดรอบคอบ รับผิดชอบ สื่อสาร คิดเชิงนวัตกรรมและทำงานเป็นทีม
            </p>
          </div>

          <!-- Objectives -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">จุดประสงค์รายวิชา เพื่อให้</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-base flex-1">
              <li>เข้าใจการพัฒนาซอฟต์แวร์ตามแนวคิดแบบเดวอปส์ (Devops)</li>
              <li>มีทักษะในการใช้ระบบควบคุมเวอร์ชันในการสร้างการทำงานเป็นทีม</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียดรอบคอบ รับผิดชอบ สื่อสาร คิดเชิงนวัตกรรม และทำงานเป็นทีม</li>
              <li>มีความสามารถประยุกต์ใช้ระบบควบคุมเวอร์ชันในการสร้างการทำงานเป็นทีม</li>
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
              <li>แสดงความรู้เกี่ยวกับการพัฒนาซอฟต์แวร์ตามแนวคิดแบบเดวอปส์ (Devops) ตามหลักการ</li>
              <li>ใช้ระบบควบคุมเวอร์ชันในการสร้างการทำงานเป็นทีม</li>
              <li>ประยุกต์ใช้ระบบควบคุมเวอร์ชันในการสร้างการทำงานเป็นทีมและจัดการสภาพแวดล้อม ในการทำงานของระบบสารสนเทศ</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <PieChart class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เกณฑ์การให้คะแนน (Course Syllabus & Grading)</h2>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100">

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
            class="flex flex-col gap-3 p-6 rounded-xl border-2 border-gray-50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm group">
            <div class="flex items-center justify-between">
              <div
                :class="[item.color, 'w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg']">
                {{ item.score }}</div>
            </div>
            <p class="font-bold text-gray-800 text-lg group-hover:text-indigo-800 transition-colors">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
      </div>

      <div
        class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-indigo-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- DevOps Animation Explainer -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-6">ส่วนที่ 1: แนะนำแนวคิด DevOps</h3>
          <p class="mb-6">
            DevOps มาจากการรวมคำว่า <strong>Development (การพัฒนา)</strong> และ <strong>Operations (การดูแลระบบ)</strong> 
            เข้าด้วยกัน ไม่ใช่เพียงแค่เครื่องมือหรือซอฟต์แวร์ตัวใดตัวหนึ่ง แต่เป็น <strong>"วัฒนธรรมและปรัชญาการทำงาน"</strong> ที่มุ่งเน้นการทำลายกำแพง (Silo) ระหว่างทีมที่สร้างซอฟต์แวร์และทีมที่นำซอฟต์แวร์ไปให้บริการ
          </p>
          
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
            <h4 class="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <Info class="w-5 h-5" /> ทำไมเราถึงต้องมี DevOps? (The Wall of Confusion)
            </h4>
            <p class="text-gray-700 mb-4">ในอดีต การพัฒนาซอฟต์แวร์มักเจอปัญหาความขัดแย้งระหว่าง 2 ทีมหลัก ได้แก่:</p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1 flex-shrink-0"><Code class="w-5 h-5" /></div>
                <div>
                  <strong class="text-blue-800">ทีม Dev (นักพัฒนา):</strong> ต้องการสร้างฟีเจอร์ใหม่ๆ และปล่อยของใหม่ให้เร็วที่สุด มักเจอปัญหา <span class="italic text-gray-500">"ก็โค้ดรันบนเครื่องฉันได้ปกติ ทำไมไปรันบนเซิร์ฟเวอร์แล้วพัง?"</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="bg-cyan-100 p-2 rounded-lg text-cyan-600 mt-1 flex-shrink-0"><Settings class="w-5 h-5" /></div>
                <div>
                  <strong class="text-cyan-800">ทีม Ops (ผู้ดูแลระบบ):</strong> ต้องการความเสถียร (Stability) ไม่อยากให้ระบบล่ม จึงไม่อยากให้มีการเปลี่ยนแปลงระบบบ่อยๆ และต้องคอยตามแก้ปัญหาจากโค้ดที่ Dev ส่งมา
                </div>
              </li>
            </ul>
            <p class="mt-5 text-gray-700 border-t border-indigo-200 pt-4">
              <strong>กำแพงแห่งความไม่เข้าใจ</strong>นี้ทำให้การส่งมอบซอฟต์แวร์ล่าช้า DevOps จึงเข้ามาเปลี่ยนวิธีคิด ให้ทั้งสองทีมมีความรับผิดชอบร่วมกันตลอดทั้งวงจรชีวิตของการพัฒนาซอฟต์แวร์ (Software Development Lifecycle) โดยมีเป้าหมายหลักคือการส่งมอบซอฟต์แวร์ที่มีคุณภาพได้อย่างต่อเนื่องและรวดเร็ว
            </p>
          </div>
          
          <h4 class="text-xl font-bold text-indigo-900 mb-4">ประโยชน์หลักของการทำ DevOps</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-green-300 transition-colors">
              <div class="flex items-center gap-2 mb-2 text-green-600 font-bold"><RefreshCw class="w-5 h-5" /> Speed & Delivery</div>
              <p class="text-sm text-gray-600">ส่งมอบซอฟต์แวร์และอัปเดตฟีเจอร์ใหม่ๆ ให้ลูกค้าได้รวดเร็วและบ่อยครั้งขึ้น ตอบสนองตลาดได้ทันที</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
              <div class="flex items-center gap-2 mb-2 text-blue-600 font-bold"><Shield class="w-5 h-5" /> Reliability</div>
              <p class="text-sm text-gray-600">ลดข้อผิดพลาดจากการทำด้วยมนุษย์ (Manual) ด้วยการใช้ระบบอัตโนมัติ (Automation) ทำให้ระบบมีความเสถียรสูง</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-purple-300 transition-colors">
              <div class="flex items-center gap-2 mb-2 text-purple-600 font-bold"><Users class="w-5 h-5" /> Better Collaboration</div>
              <p class="text-sm text-gray-600">ทีมงานสื่อสารกันมากขึ้น ทำงานเป็นน้ำหนึ่งใจเดียวกัน ทำลายวัฒนธรรมการโยนความผิดเมื่อเกิดปัญหา</p>
            </div>
          </div>

          <div class="bg-slate-900 text-slate-200 rounded-2xl p-8 shadow-xl overflow-hidden relative">
            <div class="text-center mb-8">
              <h4 class="text-2xl font-bold text-white mb-2">วัฏจักรการทำงานแบบ DevOps (The DevOps Infinity Loop)</h4>
              <p class="text-slate-400">การทำงานเป็นวงจรที่ไม่สิ้นสุด (Continuous) ตั้งแต่การวางแผน เขียนโค้ด ไปจนถึงตรวจสอบระบบ</p>
            </div>
            
            <div class="flex flex-col md:flex-row items-center justify-center gap-4 relative py-10">
              
              <!-- Dev Side -->
              <div class="bg-blue-600/20 border border-blue-500/50 p-6 rounded-2xl w-full md:w-1/3 flex flex-col items-center z-10 hover:-translate-y-2 transition-transform shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                <div class="bg-blue-600 p-4 rounded-full mb-4 animate-bounce">
                  <Code class="w-10 h-10 text-white" />
                </div>
                <h5 class="text-xl font-bold text-blue-400 mb-2">Development (Dev)</h5>
                <ul class="text-sm text-left space-y-2 text-slate-300 w-full mt-4">
                  <li class="flex items-start gap-2 border-b border-blue-500/30 pb-2"><strong class="text-blue-300 w-14 shrink-0">Plan:</strong> <span>รวบรวม Requirement และวางแผน</span></li>
                  <li class="flex items-start gap-2 border-b border-blue-500/30 pb-2"><strong class="text-blue-300 w-14 shrink-0">Code:</strong> <span>เขียนโค้ดและทำ Version Control</span></li>
                  <li class="flex items-start gap-2 border-b border-blue-500/30 pb-2"><strong class="text-blue-300 w-14 shrink-0">Build:</strong> <span>คอมไพล์และประกอบร่างโค้ด</span></li>
                  <li class="flex items-start gap-2 pb-1"><strong class="text-blue-300 w-14 shrink-0">Test:</strong> <span>รัน Automated Testing หาบั๊ก</span></li>
                </ul>
              </div>

              <!-- Infinity center -->
              <div class="hidden md:flex flex-col items-center px-4 relative">
                <RefreshCw class="w-16 h-16 text-indigo-500 animate-spin-slow" />
                <div class="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 absolute top-1/2 -z-10 blur-sm"></div>
              </div>

              <!-- Ops Side -->
              <div class="bg-cyan-600/20 border border-cyan-500/50 p-6 rounded-2xl w-full md:w-1/3 flex flex-col items-center z-10 hover:-translate-y-2 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <div class="bg-cyan-600 p-4 rounded-full mb-4 animate-pulse">
                  <Settings class="w-10 h-10 text-white" />
                </div>
                <h5 class="text-xl font-bold text-cyan-400 mb-2">Operations (Ops)</h5>
                <ul class="text-sm text-left space-y-2 text-slate-300 w-full mt-4">
                  <li class="flex items-start gap-2 border-b border-cyan-500/30 pb-2"><strong class="text-cyan-300 w-16 shrink-0">Release:</strong> <span>เตรียมความพร้อมก่อนขึ้นระบบ</span></li>
                  <li class="flex items-start gap-2 border-b border-cyan-500/30 pb-2"><strong class="text-cyan-300 w-16 shrink-0">Deploy:</strong> <span>ติดตั้งแอปพลิเคชันลงเซิร์ฟเวอร์</span></li>
                  <li class="flex items-start gap-2 border-b border-cyan-500/30 pb-2"><strong class="text-cyan-300 w-16 shrink-0">Operate:</strong> <span>ดูแลรักษาระบบและเซิร์ฟเวอร์</span></li>
                  <li class="flex items-start gap-2 pb-1"><strong class="text-cyan-300 w-16 shrink-0">Monitor:</strong> <span>เฝ้าระวังและเก็บ Log เพื่อปรับปรุง</span></li>
                </ul>
              </div>
            </div>

            <!-- Animated floating elements -->
            <Cloud class="absolute top-4 left-4 w-12 h-12 text-slate-700/50 animate-pulse" />
            <Cloud class="absolute bottom-4 right-8 w-16 h-16 text-slate-700/50 animate-pulse" style="animation-delay: 1s;" />
          </div>

          <!-- Explanation of the 8 Phases -->
          <div class="mt-10 mb-6 px-4">
            <h4 class="text-xl font-bold text-indigo-900 mb-6">เจาะลึก 8 ขั้นตอนของ DevOps Lifecycle</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
              <div class="space-y-4 relative before:absolute before:left-[11px] before:top-8 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-blue-100">
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">1</div>
                  <div><strong class="text-blue-800">Plan (วางแผน):</strong> กำหนดสิ่งที่ต้องทำ แผนงาน และประเมินเวลา (มักใช้ Agile/Scrum)</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">2</div>
                  <div><strong class="text-blue-800">Code (พัฒนา):</strong> นักพัฒนาเริ่มเขียนโค้ดและแชร์กันด้วย Git (Version Control)</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">3</div>
                  <div><strong class="text-blue-800">Build (คอมไพล์):</strong> นำโค้ดของทุกคนมารวมกันและแปลงให้เป็นไฟล์โปรแกรมที่พร้อมใช้งาน (CI)</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">4</div>
                  <div><strong class="text-blue-800">Test (ทดสอบ):</strong> ใช้สคริปต์อัตโนมัติทดสอบหาบั๊กและช่องโหว่ทันที</div>
                </div>
              </div>
              <div class="space-y-4 relative before:absolute before:left-[11px] before:top-8 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-cyan-100">
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">5</div>
                  <div><strong class="text-cyan-800">Release (เตรียมพร้อม):</strong> นำซอฟต์แวร์ที่ผ่านการทดสอบมาเตรียมไว้สำหรับการขึ้นระบบจริง</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">6</div>
                  <div><strong class="text-cyan-800">Deploy (ขึ้นระบบ):</strong> นำซอฟต์แวร์ไปติดตั้งบนเซิร์ฟเวอร์จริงให้ลูกค้าใช้งาน (CD)</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">7</div>
                  <div><strong class="text-cyan-800">Operate (ดูแล):</strong> ปรับแต่งค่าต่างๆ ควบคุมและบริหารเซิร์ฟเวอร์ให้รองรับผู้ใช้งาน</div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 mt-1">8</div>
                  <div><strong class="text-cyan-800">Monitor (เฝ้าระวัง):</strong> เก็บข้อมูลพฤติกรรมการใช้งาน และเฝ้าระวังระบบล่ม เพื่อนำกลับไปวางแผน (Plan) ใหม่ในรอบถัดไป</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-6">ส่วนที่ 2: เครื่องมือสำหรับการทำงานร่วมกัน</h3>
          <p class="mb-6">
            เพื่อให้ทีม Dev และทีม Ops หรือแม้นักพัฒนาหลายๆ คนสามารถทำงานร่วมกันได้อย่างราบรื่น จึงต้องมีระบบเข้ามารองรับ โดยพื้นฐานที่สุดคือ <strong>ระบบควบคุมเวอร์ชัน (Version Control System)</strong>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-base">
            <div class="p-6 bg-white rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500 group-hover:h-2 transition-all"></div>
              <GitCommit class="w-8 h-8 text-indigo-500 mb-3" />
              <h4 class="font-bold text-indigo-900 mb-2 text-lg">Git & History</h4>
              <p class="text-gray-600">กิต (Git) เป็นระบบ Version Control ที่ได้รับความนิยมมากที่สุด บันทึกประวัติทุกการแก้ไขว่าใครทำอะไร เมื่อไหร่ และสามารถย้อนกลับได้เสมอ</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-cyan-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500 group-hover:h-2 transition-all"></div>
              <GitBranch class="w-8 h-8 text-cyan-500 mb-3" />
              <h4 class="font-bold text-cyan-900 mb-2 text-lg">Branching & Merging</h4>
              <p class="text-gray-600">สามารถแยกสายการทำงานออกไปทำฟีเจอร์ใหม่ๆ พร้อมกันหลายคน (Branch) โดยไม่กระทบงานหลัก และนำกลับมารวมกันได้ (Merge)</p>
            </div>

            <div class="p-6 bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div class="absolute top-0 left-0 w-full h-1 bg-blue-500 group-hover:h-2 transition-all"></div>
              <Server class="w-8 h-8 text-blue-500 mb-3" />
              <h4 class="font-bold text-blue-900 mb-2 text-lg">Containers</h4>
              <p class="text-gray-600">เทคโนโลยีจำลองสภาพแวดล้อม (เช่น Docker) เพื่อให้โค้ดรันได้เหมือนกันทุกที่ หมดปัญหา "เครื่องฉันรันได้ ทำไมเซิร์ฟเวอร์รันไม่ได้"</p>
            </div>
          </div>
        </div>

        <!-- Part 3 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-6">ส่วนที่ 3: ระบบอัตโนมัติ (CI/CD)</h3>
          <p class="mb-6">
            หัวใจสำคัญของการทำ DevOps คือความเร็วและความถูกต้อง ซึ่งเราไม่สามารถทำด้วยมนุษย์ตลอดเวลาได้ จึงเกิดสิ่งที่เรียกว่า <strong>CI/CD Pipeline</strong> ขึ้นมาเพื่อทำให้ทุกอย่างเป็นอัตโนมัติ
          </p>

          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 bg-blue-500 text-white rounded-xl shadow-md"><RefreshCw class="w-6 h-6" /></div>
                <h4 class="text-xl font-bold text-indigo-900">Continuous Integration (CI)</h4>
              </div>
              <p class="text-gray-700 leading-relaxed text-sm">
                การนำโค้ดของนักพัฒนาทุกคนมารวมกันที่ส่วนกลางอย่างสม่ำเสมอ (มักจะทำทุกวันหรือทุกครั้งที่มีการ Commit) ระบบ CI จะทำการ Build และรัน Automated Tests ทันที หากโค้ดมีปัญหา ระบบจะแจ้งเตือนให้นักพัฒนาทราบก่อนที่จะหลุดไปถึงเซิร์ฟเวอร์
              </p>
            </div>
            
            <div class="flex-1 bg-gradient-to-br from-cyan-50 to-teal-50 p-6 rounded-2xl border border-cyan-100 shadow-sm">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 bg-cyan-500 text-white rounded-xl shadow-md"><Upload class="w-6 h-6" /></div>
                <h4 class="text-xl font-bold text-cyan-900">Continuous Delivery/Deployment (CD)</h4>
              </div>
              <p class="text-gray-700 leading-relaxed text-sm">
                ต่อเนื่องจาก CI เมื่อโค้ดผ่านการทดสอบแล้ว ระบบ CD จะเตรียมความพร้อมของซอฟต์แวร์นั้นเพื่อนำไปติดตั้ง (Deploy) สู่สภาพแวดล้อมจริง (Production) แบบอัตโนมัติ หรือเพียงแค่กดปุ่มคลิกเดียว ช่วยลดความผิดพลาดจากการติดตั้งด้วยมือ (Manual)
              </p>
            </div>
          </div>
        </div>

        <!-- Part 4 -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-6">ส่วนที่ 4: ทักษะที่จำเป็นสำหรับ DevOps (DevOps Skills)</h3>
          <p class="mb-6">
            หากนักเรียนสนใจสายงาน <strong>DevOps Engineer</strong> ซึ่งเป็นที่ต้องการสูงมากในตลาดแรงงาน จะต้องเตรียมความพร้อมในด้านใดบ้าง?
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div class="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
              <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2"><Layers class="w-5 h-5 text-indigo-500" /> Hard Skills (ทักษะทางเทคนิค)</h4>
              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>ระบบปฏิบัติการ (OS):</strong> โดยเฉพาะ Linux และการใช้ Command Line</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Version Control:</strong> การใช้งาน Git อย่างคล่องแคล่ว</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Containers:</strong> การสร้างและจัดการสภาพแวดล้อมด้วย Docker / Kubernetes</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Cloud Computing:</strong> รู้จักบริการของ AWS, Azure หรือ Google Cloud</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Scripting:</strong> สามารถเขียนสคริปต์อัตโนมัติด้วย Bash, Python หรือ Go ได้</li>
              </ul>
            </div>
            <div class="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
              <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2"><Users class="w-5 h-5 text-indigo-500" /> Soft Skills (ทักษะทางสังคมและวิธีคิด)</h4>
              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>การสื่อสาร (Communication):</strong> เป็นตัวกลางเชื่อมความเข้าใจระหว่างทีม Dev และ Ops</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>การทำงานเป็นทีม (Teamwork):</strong> ส่งเสริมวัฒนธรรมแบบไม่โยนความผิด (Blameless)</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>การแก้ปัญหา (Problem Solving):</strong> มองหาสาเหตุของปัญหาและป้องกันข้อผิดพลาดซ้ำ</li>
                <li class="flex items-start gap-2"><CheckCircle class="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>รักการเรียนรู้ (Continuous Learning):</strong> เทคโนโลยีใหม่ๆ เกิดขึ้นตลอดเวลา ต้องอัปเดตตัวเองเสมอ</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>



    <!-- Interactive Game Center -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน</h2>
            <p class="text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-indigo-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่ 1</span>
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
          <div class="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-xl border border-indigo-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-indigo-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-indigo-950 leading-tight">
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
              <span class="font-bold block">1. แยกประเภท (Drag & Drop)</span>
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
              <span class="font-bold block">2. โยงคำศัพท์ (Matching)</span>
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

      <!-- Game Tabs (ลำดับกิจกรรม: มินิเกม -> สุดท้ายคือแบบทดสอบหลังเรียน) -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: แยกประเภท</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'order'" :class="[
          activeGame === 'order' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: โยงคำศัพท์</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>🎯 แบบทดสอบหลังเรียน (4 ชอยส์ 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop (examMode: true) -->
      <DragDropGame v-if="activeGame === 'sort'" 
        title="มินิเกมที่ 1: วัฒนธรรมองค์กร แบบเก่า vs DevOps"
        subtitle="ลากลักษณะการทำงานไปใส่กล่องที่ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-1"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2: Matching (examMode: true) -->
      <MatchingGame v-if="activeGame === 'order'"
        title="มินิเกมที่ 2: เครื่องมือและคำศัพท์ Git & DevOps"
        subtitle="จับคู่คำศัพท์กับการทำงาน ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-2"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs"
      />

      <!-- Game 3: Final Post-test (4 choices, 10 questions) -->
      <PopQuiz v-if="activeGame === 'quiz'" 
        title="แบบทดสอบหลังเรียน (Post-test): บทนำสู่ DevOps"
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
        courseName="การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม"
        :week="currentWeek"
        weekTitle="สัปดาห์ที่ 1: บทนำสู่ DevOps"
        :games="weekGames"
        @close="showTeacherModal = false"
      />
    </section>

    <!-- Assignment Section -->
    <AssignmentSection
      course-id="21901-2012"
      assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: สรุปหลักการ DevOps และวงจรการพัฒนาซอฟต์แวร์"
      :max-score="10"
    >
      <template #number>1</template>
      <template #description>
        <div>
          <p class="text-base text-gray-700 leading-relaxed mb-4">
            ให้นักศึกษาศึกษาเนื้อหาในบทเรียนสัปดาห์ที่ 1 เรื่อง <strong>"บทนำสู่ DevOps"</strong> แล้วจัดทำใบงานสรุปความรู้ความเข้าใจลงในเอกสาร (พิมพ์เป็นไฟล์ PDF หรือเขียนลงกระดาษสมุดรายงานแล้วสแกน/ถ่ายภาพรวมเป็นไฟล์ PDF) เพื่อประเมินผลความรู้รวบยอด ก่อนเริ่มลงมือปฏิบัติด้านเครื่องมือ Git Version Control ในสัปดาห์ถัดไป
          </p>

          <!-- Objectives Box -->
          <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-indigo-600" />
              จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-900">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span>1. อธิบายความหมายและแนวคิดสำคัญของวัฒนธรรม DevOps ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span>2. วิเคราะห์สาเหตุของปัญหา Wall of Confusion ระหว่างทีม Dev และ Ops ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span>3. สรุปขั้นตอนทั้ง 8 ลำดับของ DevOps Infinity Loop ได้ถูกต้อง</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span>4. สำรวจทักษะและความพร้อมของตนเองเพื่อเตรียมใช้งาน Git ในสัปดาห์หน้าได้</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <div class="space-y-4">
          <!-- Part 1 -->
          <div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all shadow-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs font-black">ตอนที่ 1</span>
                <span>กำแพงแห่งความสับสน (The Wall of Confusion) และแนวคิด DevOps</span>
              </span>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 คะแนน</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              ให้อธิบายว่า ในกระบวนการพัฒนาซอฟต์แวร์แบบดั้งเดิม ทีม <strong>Dev (Development)</strong> และทีม <strong>Ops (Operations)</strong> มีเป้าหมายในการทำงานที่ขัดแย้งกันอย่างไร มักพบปัญหาคลาสสิกอะไรบ้าง (เช่น <em>"Works on my machine"</em>) และแนวคิดแบบ <strong>DevOps</strong> เข้ามาช่วยแก้ปัญหาเหล่านี้ด้วยวัฒนธรรมการทำงานแบบใด
            </p>
          </div>

          <!-- Part 2 -->
          <div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-blue-900 text-sm flex items-center gap-2">
                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-black">ตอนที่ 2</span>
                <span>เจาะลึกวงจร DevOps Infinity Loop ทั้ง 8 ขั้นตอน</span>
              </span>
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">4 คะแนน</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed mb-2">
              ให้เขียนอธิบายสรุปขั้นตอนทั้ง 8 ขั้นตอนของ DevOps Infinity Loop โดยสรุปหน้าที่และกิจกรรมสำคัญของแต่ละขั้นตอน 1-2 บรรทัด ได้แก่:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div class="text-blue-800">
                <strong>• ฝั่ง Dev:</strong> 1. Plan, 2. Code, 3. Build, 4. Test
              </div>
              <div class="text-cyan-800">
                <strong>• ฝั่ง Ops:</strong> 5. Release, 6. Deploy, 7. Operate, 8. Monitor
              </div>
            </div>
          </div>

          <!-- Part 3 -->
          <div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all shadow-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-xs font-black">ตอนที่ 3</span>
                <span>การสำรวจทักษะและการเตรียมความพร้อมส่วนบุคคลสำหรับสัปดาห์หน้า</span>
              </span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 คะแนน</span>
            </div>
            <ul class="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
              <li>จากทักษะ Hard Skills และ Soft Skills ที่จำเป็นของ DevOps นักศึกษาคิดว่าตนเองต้องพัฒนาทักษะด้านใดมากที่สุด เพราะเหตุใด?</li>
              <li>เตรียมความพร้อมสำหรับ <strong>สัปดาห์ที่ 2</strong> โดยระบุ <strong>Email</strong> (อีเมลมหาวิทยาลัยหรืออีเมลส่วนตัว) ที่ตนเองสามารถจำรหัสผ่านได้ พร้อมใช้งานสำหรับสมัครบัญชี <strong>GitHub</strong> ในสัปดาห์ถัดไป</li>
            </ul>
          </div>

          <!-- Submission Guidelines -->
          <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong class="block mb-0.5 font-bold">ข้อกำหนดการส่งงาน:</strong>
              จัดทำเป็นไฟล์เอกสาร <strong>PDF</strong> อัปโหลดขึ้น Google Drive หรือ OneDrive ของตนเอง (ตั้งค่าสิทธิ์ให้ <em>"ทุกคนที่มีลิงก์สามารถดูได้"</em>) แล้วนำลิงก์ (URL) มาส่งที่ปุ่ม <strong>ส่งงานด้วยลิงก์ (Submit)</strong> ด้านล่าง
            </div>
          </div>
        </div>
      </template>
    </AssignmentSection>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
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
