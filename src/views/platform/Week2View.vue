<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GitBranch, GitCommit, GitMerge, GitPullRequest, Terminal, CheckCircle,
  XCircle, FileText, Upload, Database, Layers, Shield, Users, Server,
  FileQuestion, ArrowRight, Target, Award, Book, Lightbulb, Gamepad2,
  ListOrdered, ChevronRight, Star, Shuffle, MousePointer2, Code, Settings,
  Cloud, RefreshCw, Clock, Trophy, Lock, Download, Monitor, CheckSquare,
  AlertTriangle, Cpu, Laptop, HardDrive, Share2, HelpCircle,
  FolderArchive, FileX, RotateCcw, UserX, AlertOctagon, Flame,
  User, ArrowDown
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Current Course & Week Context
const currentCourseId = '21901-2012'
const currentWeek = 2

// Router
const route = useRoute()
const router = useRouter()

// Modal & Game Config
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนก Centralized vs Distributed VCS)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำศัพท์และโครงสร้าง Version Control)', maxScore: 5, isQuiz: false },
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

// แบบทดสอบหลังเรียน (Post-test) 4 ตัวเลือก 10 ข้อ อิงตามแผนการจัดการเรียนรู้
const quizQuestions = [
  {
    id: 1,
    question: "ระบบควบคุมเวอร์ชัน (Version Control System: VCS) มีบทบาทหน้าที่หลักคือข้อใด?",
    options: [
      { id: 'a', text: "แปลงโค้ดโปรแกรมให้เป็นไฟล์ติดตั้ง (.exe) อัตโนมัติ", isCorrect: false },
      { id: 'b', text: "บันทึกประวัติการเปลี่ยนแปลงของไฟล์ ทำให้สามารถตรวจสอบ ย้อนกลับ และทำงานร่วมกันเป็นทีมได้อย่างเป็นระบบ", isCorrect: true },
      { id: 'c', text: "สแกนไวรัสและป้องกันมัลแวร์ในเครื่องคอมพิวเตอร์", isCorrect: false },
      { id: 'd', text: "เพิ่มความเร็วสัญญาณเครือข่ายอินเทอร์เน็ตของทีมพัฒนา", isCorrect: false }
    ],
    explanation: "VCS ทำหน้าที่บันทึกประวัติการแก้ไขของไฟล์อย่างต่อเนื่อง ทำให้ย้อนเวลากลับไปดูหรือกู้คืนโค้ดเวอร์ชันเดิมได้ตลอดเวลา"
  },
  {
    id: 2,
    question: "ปัญหาข้อใดคือผลเสียที่ร้ายแรงที่สุดของการพัฒนาโปรแกรมโดย 'ไม่มี' การใช้ระบบควบคุมเวอร์ชัน?",
    options: [
      { id: 'a', text: "หน้าจอแสดงผลของโปรแกรมมีสีสันไม่สวยงาม", isCorrect: false },
      { id: 'b', text: "การตั้งชื่อไฟล์ซ้ำซ้อนสับสน เช่น final_v2_edit.zip และเสี่ยงต่อการเขียนไฟล์ทับงานของเพื่อนจนข้อมูลสูญหาย", isCorrect: true },
      { id: 'c', text: "ไม่สามารถเชื่อมต่อแป้นพิมพ์และเมาส์พร้อมกันได้", isCorrect: false },
      { id: 'd', text: "โปรแกรมไม่ยอมเปิดให้ใช้งานหากไม่ได้เชื่อมต่อบลูทูธ", isCorrect: false }
    ],
    explanation: "การไม่ใช้ VCS มักทำให้เกิดปัญหาไฟล์งานทับกัน (File Overwrite), สับสนเวอร์ชันล่าสุด และไม่รู้ว่าใครแก้ไขโค้ดตรงไหนเมื่อไหร่"
  },
  {
    id: 3,
    question: "ข้อใดคือลักษณะสำคัญของระบบควบคุมเวอร์ชันแบบรวมศูนย์ (Centralized VCS เช่น SVN)?",
    options: [
      { id: 'a', text: "ทุกเครื่องของนักพัฒนาจะมีสำเนาประวัติโปรเจกต์ทั้งหมดอย่างสมบูรณ์โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์", isCorrect: false },
      { id: 'b', text: "มีเซิร์ฟเวอร์ส่วนกลางเพียงเครื่องเดียวที่เก็บประวัติไฟล์ทั้งหมด หากเซิร์ฟเวอร์ล่มจะทำงานไม่ได้และเสี่ยงข้อมูลสูญหาย", isCorrect: true },
      { id: 'c', text: "ไม่สามารถใช้งานผ่านสาย LAN ได้เลย", isCorrect: false },
      { id: 'd', text: "ไม่บันทึกชื่อผู้แก้ไขไฟล์ลงในระบบ", isCorrect: false }
    ],
    explanation: "Centralized VCS มีจุดบกพร่องสำคัญคือ Single Point of Failure หากเซิร์ฟเวอร์กลางเสียหายหรือเครือข่ายหลุด จะไม่สามารถบันทึกหรือย้อนประวัติได้"
  },
  {
    id: 4,
    question: "ข้อใดคือจุดเด่นที่ทำให้ระบบแบบกระจาย (Distributed VCS เช่น Git) เหนือกว่าแบบรวมศูนย์ (Centralized VCS)?",
    options: [
      { id: 'a', text: "นักพัฒนาทุกคนจะมีพื้นที่เก็บข้อมูล (Repository) และประวัติทั้งหมดครบถ้วนอยู่ในเครื่องตนเอง สามารถทำงานออฟไลน์ได้ 100%", isCorrect: true },
      { id: 'b', text: "ไม่ต้องใช้พื้นที่ฮาร์ดดิสก์ในการจัดเก็บไฟล์เลย", isCorrect: false },
      { id: 'c', text: "เขียนโค้ดได้โดยไม่ต้องพิมพ์ตัวอักษร", isCorrect: false },
      { id: 'd', text: "จำกัดให้มีนักพัฒนาทำงานได้เพียงคนเดียวต่อโปรเจกต์", isCorrect: false }
    ],
    explanation: "ใน DVCS เครื่องลูกข่ายทุกเครื่องเปรียบเสมือน Backup สมบูรณ์ของเซิร์ฟเวอร์ ทำงาน ดูประวัติ และ Commit ได้โดยไม่ต้องต่อเน็ต"
  },
  {
    id: 5,
    question: "ข้อใดคือตัวอย่างของซอฟต์แวร์ประเภท Distributed Version Control System (DVCS)?",
    options: [
      { id: 'a', text: "CVS และ Microsoft Word", isCorrect: false },
      { id: 'b', text: "Git และ Mercurial", isCorrect: true },
      { id: 'c', text: "Apache Subversion (SVN) และ Perforce", isCorrect: false },
      { id: 'd', text: "Adobe Photoshop และ Illustrator", isCorrect: false }
    ],
    explanation: "Git และ Mercurial เป็นตัวแทนของ DVCS ส่วน SVN, CVS และ Perforce เป็นระบบแบบ Centralized (CVCS)"
  },
  {
    id: 6,
    question: "Git บันทึกการเปลี่ยนแปลงของไฟล์ในแต่ละช่วงเวลา (Version) ด้วยแนวคิดใด?",
    options: [
      { id: 'a', text: "เก็บภาพถ่ายสถานะรวมของทั้งโปรเจกต์ (Snapshot) ในจุดเวลานั้นๆ", isCorrect: true },
      { id: 'b', text: "บันทึกเฉพาะรูปภาพหน้าจอของคอมพิวเตอร์", isCorrect: false },
      { id: 'c', text: "ลบไฟล์เก่าทิ้งแล้วสร้างโฟลเดอร์ใหม่เสมอ", isCorrect: false },
      { id: 'd', text: "ส่งไฟล์ทั้งหมดไปเก็บไว้ที่แผ่นดิสก์เก็ต", isCorrect: false }
    ],
    explanation: "Git จัดเก็บข้อมูลแบบ Snapshot (เสมือนถ่ายภาพสถานะของไฟล์ทั้งหมด ณ ขณะนั้น) หากไฟล์ไหนไม่เปลี่ยนก็จะชี้ไปยังไฟล์เดิมเพื่อประหยัดเนื้อที่"
  },
  {
    id: 7,
    question: "หลังจากติดตั้ง Git ลงในเครื่องคอมพิวเตอร์แล้ว คำสั่งแรกที่ใช้สำหรับตรวจสอบว่า Git ติดตั้งสำเร็จหรือไม่คือคำสั่งใด?",
    options: [
      { id: 'a', text: "git --version", isCorrect: true },
      { id: 'b', text: "git start", isCorrect: false },
      { id: 'c', text: "git download", isCorrect: false },
      { id: 'd', text: "git run program", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git --version' ใช้ตรวจสอบเวอร์ชันของ Git หากติดตั้งสำเร็จจะแสดงข้อความเช่น git version 2.x.x"
  },
  {
    id: 8,
    question: "คำสั่งใดใช้สำหรับตั้งค่าชื่อ (Name) ของผู้ใช้งานใน Git แบบส่วนกลาง (Global)?",
    options: [
      { id: 'a', text: "git set username \"สมชาย ใจดี\"", isCorrect: false },
      { id: 'b', text: "git config --global user.name \"สมชาย ใจดี\"", isCorrect: true },
      { id: 'c', text: "git user:name = \"สมชาย ใจดี\"", isCorrect: false },
      { id: 'd', text: "git register \"สมชาย ใจดี\"", isCorrect: false }
    ],
    explanation: "การตั้งค่าผู้ใช้ใน Git ใช้คำสั่ง 'git config --global user.name \"ชื่อ\"' และ 'git config --global user.email \"อีเมล\"'"
  },
  {
    id: 9,
    question: "เพราะเหตุใดจึงจำเป็นต้องตั้งค่า user.name และ user.email ก่อนเริ่มใช้งาน Git?",
    options: [
      { id: 'a', text: "เพื่อให้ Git แนบตัวตนของผู้แก้ไขไปกับทุกๆ Commit อย่างชัดเจน สามารถระบุได้ว่าใครเป็นคนทำอะไร", isCorrect: true },
      { id: 'b', text: "เพื่อให้ระบบหักเงินค่าบริการรายเดือนผ่านทางอีเมล", isCorrect: false },
      { id: 'c', text: "เพื่อใช้สมัครบัญชีเฟซบุ๊กอัตโนมัติ", isCorrect: false },
      { id: 'd', text: "เพื่อล็อกไม่ให้เครื่องคอมพิวเตอร์เครื่องอื่นเปิดไฟล์ได้", isCorrect: false }
    ],
    explanation: "ข้อมูล user.name และ user.email จะถูกฝังลงในบันทึกประวัติ (Commit Metadata) เพื่อใช้ตรวจสอบและยืนยันตัวตนของผู้เขียนโค้ด"
  },
  {
    id: 10,
    question: "คำสั่งใดใช้สำหรับตรวจสอบรายการคอนฟิกและค่าการตั้งค่าทั้งหมดของ Git ในเครื่องปัจจุบัน?",
    options: [
      { id: 'a', text: "git show all", isCorrect: false },
      { id: 'b', text: "git config --list", isCorrect: true },
      { id: 'c', text: "git verify config", isCorrect: false },
      { id: 'd', text: "git find settings", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git config --list' จะแสดงรายการค่าตัวแปรทั้งหมดที่กำหนดไว้ เช่น user.name, user.email, core.editor ฯลฯ"
  }
]

const activeGame = ref('sort') // 'sort', 'order', 'quiz'

// Game 1: Drag & Drop (6 items, max 6) - Centralized vs Distributed VCS
const dragItemsData = [
  { id: 1, text: 'มี Repository สมบูรณ์อยู่ที่เครื่องทุกคน ทำงานออฟไลน์ได้', type: 'dvcs' },
  { id: 2, text: 'ต้องเชื่อมต่ออินเทอร์เน็ตกับเซิร์ฟเวอร์กลางตลอดเวลาที่ Commit', type: 'cvcs' },
  { id: 3, text: 'หากเซิร์ฟเวอร์ส่วนกลางพัง ทุกคนยังคงมีประวัติโค้ดสำรองครบ', type: 'dvcs' },
  { id: 4, text: 'มีจุดเสี่ยงล่มจุดเดียว (Single Point of Failure)', type: 'cvcs' },
  { id: 5, text: 'ตัวอย่างโปรแกรม: Git, Mercurial', type: 'dvcs' },
  { id: 6, text: 'ตัวอย่างโปรแกรม: SVN (Subversion), CVS', type: 'cvcs' }
]

const dragZonesData = [
  {
    id: 'cvcs',
    title: 'Centralized VCS (แบบรวมศูนย์)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคุณลักษณะแบบ Centralized มาที่นี่'
  },
  {
    id: 'dvcs',
    title: 'Distributed VCS (แบบกระจาย)',
    wrapperClass: 'border-indigo-400/50 hover:bg-black/40',
    titleClass: 'text-indigo-300 border-indigo-400/30',
    itemBgClass: 'bg-indigo-600/50 border-indigo-400',
    emptyTextClass: 'text-indigo-200/50',
    emptyText: 'ลากคุณลักษณะแบบ Distributed มาที่นี่'
  }
]

// Game 2: Matching (5 pairs, max 5) - โครงสร้างและคำศัพท์ Version Control
const matchLeftTerms = [
  { id: 'l1', text: 'Version Control (VCS)', match: 'r2' },
  { id: 'l2', text: 'Centralized VCS', match: 'r4' },
  { id: 'l3', text: 'Distributed VCS (Git)', match: 'r1' },
  { id: 'l4', text: 'git config', match: 'r3' },
  { id: 'l5', text: 'Snapshot', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ระบบกระจายศูนย์ ทุกเครื่องมีประวัติครบถ้วน ทำงานออฟไลน์ได้เสรี' },
  { id: 'r2', text: 'ระบบบันทึกและจัดการประวัติการเปลี่ยนแปลงของไฟล์ตามลำดับเวลา' },
  { id: 'r3', text: 'คำสั่งสำหรับกำหนดค่าเริ่มต้น เช่น ชื่อผู้ใช้และอีเมลประจำเครื่อง' },
  { id: 'r4', text: 'ระบบรวมศูนย์ที่เก็บประวัติไว้ที่เซิร์ฟเวอร์กลางเพียงจุดเดียว' },
  { id: 'r5', text: 'การบันทึกภาพถ่ายสถานะรวมของไฟล์ทั้งหมด ณ ช่วงเวลาที่มีการ Commit' }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header Banner -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-indigo-500">
        <GitBranch class="w-[420px] h-[420px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider shadow-sm">
            สัปดาห์ที่ 2
          </span>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
            หน่วยที่ 1 (สอนครั้งที่ 1-4)
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-indigo-950 mb-4 leading-tight">
          งานระบบควบคุมเวอร์ชัน<br />
          <span class="text-2xl md:text-3xl text-indigo-700">(Version Control System: VCS)</span>
        </h1>
        <p class="text-gray-600 text-base md:text-lg leading-relaxed">
          ศึกษาหลักการ สถาปัตยกรรม และประโยชน์ของระบบควบคุมเวอร์ชัน เปรียบเทียบความแตกต่างระหว่าง
          Centralized VCS และ Distributed VCS พร้อมฝึกปฏิบัติการติดตั้งและเตรียมความพร้อมเครื่องมือ Git
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Unit Objectives & Competencies (อิงตามภาพแผนการจัดการเรียนรู้) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">แผนการจัดการเรียนรู้และจุดประสงค์ประจำหน่วย</h2>
          <p class="text-sm text-gray-500 mt-0.5">หน่วยที่ 1: พื้นฐาน DevOps และระบบควบคุมเวอร์ชัน (ทฤษฎี 4 ชม. ปฏิบัติ 8 ชม.)</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100 space-y-6">
        <!-- 3 Boxes: Learning Outcome, Competency, Objectives -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. ผลลัพธ์การเรียนรู้ -->
          <div class="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
                <Lightbulb class="w-5 h-5 shrink-0" />
                <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ผู้เรียนสามารถอธิบายหลักการ ความสำคัญ และประโยชน์ของระบบควบคุมเวอร์ชัน (VCS) ได้อย่างถูกต้อง
                ตลอดจนมีความพร้อมในการเปรียบเทียบและเลือกใช้เครื่องมือจัดการเวอร์ชันเบื้องต้น
                เพื่อเตรียมความพร้อมสำหรับการปฏิบัติงานพัฒนาซอฟต์แวร์ร่วมกันเป็นทีมในสถานการณ์จริง
              </p>
            </div>
          </div>

          <!-- 2. สมรรถนะประจำหน่วย -->
          <div class="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-teal-700 font-bold">
                <Award class="w-5 h-5 shrink-0" />
                <span>2. สมรรถนะประจำหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                แสดงความรู้ความเข้าใจเกี่ยวกับหลักการของระบบควบคุมเวอร์ชัน (VCS)
                และเปรียบเทียบความแตกต่างระหว่างระบบที่มีและไม่มีการใช้ VCS ได้อย่างถูกต้องเหมาะสม
              </p>
            </div>
          </div>

          <!-- 3. จุดประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-purple-700 font-bold">
                <CheckCircle class="w-5 h-5 shrink-0" />
                <span>3. จุดประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4">
                <li>อธิบายหลักการทำงาน สถาปัตยกรรม และประโยชน์ของ VCS ได้ถูกต้อง</li>
                <li>เปรียบเทียบระบบที่ไม่มี VCS กับมี VCS พร้อมติดตั้งเครื่องมือได้ตามขั้นตอน</li>
                <li>แสดงออกถึงความสนใจใฝ่รู้ มีระเบียบวินัย และความร่วมมือในการทำงานกลุ่ม</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 4 Sub-topics Badge List -->
        <div class="pt-4 border-t border-gray-100">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            โครงสร้างสาระการเรียนรู้สัปดาห์ที่ 2 (4 หัวข้อหลัก):
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span class="font-medium text-gray-800">หลักการและแนวคิดพื้นฐาน VCS</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span class="font-medium text-gray-800">เปรียบเทียบ Centralized vs Distributed</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span class="font-medium text-gray-800">ประโยชน์ต่อการจัดการโค้ดและการทำงานเป็นทีม</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span class="font-medium text-gray-800">การเตรียมความพร้อมและติดตั้ง Git</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lecture Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
      </div>

      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-indigo-100 space-y-12 text-gray-700 leading-relaxed">

        <!-- Topic 1: Principle & Foundations -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 1: หลักการและแนวคิดพื้นฐานของระบบควบคุมเวอร์ชัน (Version Control Systems: VCS)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            <strong>ระบบควบคุมเวอร์ชัน (Version Control System: VCS)</strong> คือระบบซอฟต์แวร์ที่ทำหน้าที่บันทึก
            ประวัติการเปลี่ยนแปลงของไฟล์เอกสารหรือซอร์สโค้ด (Source Code) ในโครงการตามลำดับเวลาอย่างต่อเนื่อง
            ทำหน้าที่เปรียบเสมือน <em>"กล้องวงจรปิดและไทม์แมชชีนของนักพัฒนา"</em> ที่คอยบันทึกทุกการเคลื่อนไหว ทุกตัวอักษรที่พิมพ์เพิ่มหรือลบออก
            ทำให้ทีมงานสามารถตรวจสอบย้อนหลังได้อย่างโปร่งใสว่า <strong>"ใครเป็นคนแก้ไข? (Who), แก้ไขไฟล์หรือบรรทัดไหน? (What), ทำเมื่อวันเวลาใด? (When), และทำไปด้วยเหตุผลใด? (Why)"</strong>
            ตลอดจนสามารถสั่งย้อนเวลากลับไปดูหรือกู้คืนโค้ดในอดีตได้ตลอดเวลาโดยไม่มีวันสูญหาย
          </p>

          <!-- Problem of Old-School Manual Versioning (Redesigned with Lucide Icons) -->
          <div class="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-orange-50/40 border-2 border-rose-200/80 mb-10 shadow-sm relative overflow-hidden">
            <!-- Background accent decoration -->
            <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-rose-600">
              <AlertOctagon class="w-64 h-64" />
            </div>

            <!-- Section Title & Subtitle -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
                  <Flame class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-xl font-black text-rose-950 flex items-center gap-2">
                    เปรียบเทียบสถานการณ์จริง: 4 หายนะของการพัฒนาโปรแกรมโดย "ไม่มี VCS"
                  </h4>
                  <p class="text-xs text-rose-700/90 mt-0.5">The 4 Nightmares of Manual Versioning • จำลองเหตุการณ์จริงเมื่อทำงานกลุ่มโดยส่งไฟล์ผ่าน LINE หรือ Flash Drive</p>
                </div>
              </div>
              <span class="px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded-full text-xs border border-rose-200/60 self-start sm:self-auto shrink-0 flex items-center gap-1.5 shadow-sm">
                <AlertTriangle class="w-3.5 h-3.5 text-rose-600" />
                ไม่มีระบบควบคุมเวอร์ชัน
              </span>
            </div>

            <!-- 4 Modern Interactive Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              <!-- Card 1: File Duplication -->
              <div class="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <!-- Header: Icon + Title + Badge -->
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/70 group-hover:scale-105 transition-transform">
                        <FolderArchive class="w-5 h-5" />
                      </div>
                      <div>
                        <span class="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">ปัญหาที่ 1</span>
                        <h5 class="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                          มหากาพย์ชื่อไฟล์ซ้ำซ้อนและสับสน
                        </h5>
                      </div>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                      วิกฤตความสับสน
                    </span>
                  </div>

                  <!-- Visual Scenario Diagram -->
                  <div class="bg-amber-50/70 rounded-xl border border-amber-200/80 p-3 mb-3 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-amber-900 pb-1 border-b border-amber-200/60">
                      <span class="flex items-center gap-1.5">
                        <FolderArchive class="w-3.5 h-3.5 text-amber-600" />
                        ไฟล์สำรองที่สะสมในโฟลเดอร์เครื่อง
                      </span>
                      <span class="text-[10px] text-amber-700 font-medium">ไร้ระบบบันทึก</span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px] text-center">
                      <div class="bg-white p-1.5 rounded border border-gray-200 text-gray-600 truncate shadow-2xs">Project_v1</div>
                      <div class="bg-white p-1.5 rounded border border-gray-200 text-gray-600 truncate shadow-2xs">v2_final</div>
                      <div class="bg-white p-1.5 rounded border border-gray-200 text-gray-600 truncate shadow-2xs">final_จริง.zip</div>
                      <div class="bg-rose-50 p-1.5 rounded border border-rose-300 font-bold text-rose-700 truncate shadow-2xs">final_ส่งครู_v3</div>
                    </div>
                    <div class="bg-white rounded-lg p-2 border border-amber-200 flex items-center justify-between text-[11px]">
                      <span class="text-gray-700 font-medium">คำถามเมื่อต้องส่งงาน:</span>
                      <span class="px-2 py-0.5 bg-amber-200/80 text-amber-900 font-bold rounded text-[10px]">
                        ❓ อันไหนคือตัวล่าสุดที่รันผ่าน?
                      </span>
                    </div>
                  </div>

                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    ต้องสร้างสำเนาโฟลเดอร์เพิ่มขึ้นเรื่อยๆ เพื่อเก็บสำรอง จนในเครื่องเต็มไปด้วยไฟล์บีบอัดหลายสิบเวอร์ชัน ไม่สามารถเปรียบเทียบความแตกต่างได้
                  </p>
                </div>

                <!-- Consequence Footer -->
                <div class="pt-3 border-t border-amber-100 flex items-start gap-2 text-xs text-amber-900 font-medium bg-amber-50/40 -mx-5 -mb-5 p-3 rounded-b-2xl">
                  <XCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>ผลกระทบ:</strong> ผ่านไป 2 วัน จำไม่ได้ว่าไฟล์ไหนทำงานได้ เสี่ยงส่งงานผิดเวอร์ชันให้ครู</span>
                </div>
              </div>

              <!-- Card 2: File Overwrite (Redesigned Clear Diagram) -->
              <div class="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <!-- Header: Icon + Title + Badge -->
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200/70 group-hover:scale-105 transition-transform">
                        <FileX class="w-5 h-5" />
                      </div>
                      <div>
                        <span class="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">ปัญหาที่ 2</span>
                        <h5 class="text-base font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                          การเซฟทับงานเพื่อนโดยไม่รู้ตัว
                        </h5>
                      </div>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                      วิกฤตงานสูญหาย
                    </span>
                  </div>

                  <!-- Visual Scenario Diagram (Step-by-step conflict) -->
                  <div class="bg-rose-50/70 rounded-xl border border-rose-200/80 p-3 mb-3 space-y-2">
                    <!-- Step 1: 2 Devs working concurrently -->
                    <div class="grid grid-cols-2 gap-2 text-[11px]">
                      <div class="bg-white rounded-lg p-2 border border-blue-200 shadow-2xs">
                        <div class="flex items-center gap-1 font-bold text-blue-700 mb-0.5">
                          <User class="w-3.5 h-3.5 shrink-0" />
                          <span>Dev A (22:00 น.)</span>
                        </div>
                        <div class="text-gray-600 text-[10px] leading-tight">
                          เขียนระบบ <strong class="text-gray-800">Login</strong> ในไฟล์ <code class="text-blue-600 bg-blue-50 px-1 py-0.2 rounded font-mono">app.js</code>
                        </div>
                      </div>
                      <div class="bg-white rounded-lg p-2 border border-purple-200 shadow-2xs">
                        <div class="flex items-center gap-1 font-bold text-purple-700 mb-0.5">
                          <User class="w-3.5 h-3.5 shrink-0" />
                          <span>Dev B (22:30 น.)</span>
                        </div>
                        <div class="text-gray-600 text-[10px] leading-tight">
                          แก้ระบบ <strong class="text-gray-800">Cart</strong> ใน <code class="text-purple-600 bg-purple-50 px-1 py-0.2 rounded font-mono">app.js</code> (ไฟล์เก่า)
                        </div>
                      </div>
                    </div>

                    <!-- Step 2: Overwrite Action -->
                    <div class="flex items-center justify-center gap-1.5 py-1 px-2 bg-rose-100 text-rose-800 rounded-lg border border-rose-300 text-[11px] font-bold">
                      <ArrowDown class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Dev B ส่งไฟล์ทับลงโฟลเดอร์กลาง / กลุ่ม LINE</span>
                    </div>

                    <!-- Step 3: Disaster Outcome -->
                    <div class="bg-white rounded-lg p-2 border border-rose-300 flex items-center justify-between text-[11px] shadow-2xs">
                      <div class="flex items-center gap-1.5 text-gray-800">
                        <FileX class="w-4 h-4 text-rose-600 shrink-0" />
                        <span class="text-gray-600">ไฟล์ปลายทางเหลือแค่ Cart:</span>
                      </div>
                      <span class="px-2 py-0.5 bg-rose-600 text-white font-bold rounded text-[10px] shrink-0">
                        โค้ด Login ของ Dev A ถูกลบหายไป 100%!
                      </span>
                    </div>
                  </div>

                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    เพื่อนคนที่ 1 นั่งแก้โค้ดหน้า Login ทั้งคืน ส่วนคนที่ 2 แก้ฟังก์ชันตะกร้าสินค้าในไฟล์เดียวกัน เมื่อส่งไฟล์มาเซฟทับ งานของคนที่ 1 จะถูกลบหายไปทันที
                  </p>
                </div>

                <!-- Consequence Footer -->
                <div class="pt-3 border-t border-rose-100 flex items-start gap-2 text-xs text-rose-900 font-medium bg-rose-50/40 -mx-5 -mb-5 p-3 rounded-b-2xl">
                  <XCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>ผลกระทบ:</strong> เสียเวลาเขียนโค้ดใหม่ทั้งหมด เกิดความขัดแย้งและเสียบรรยากาศการทำงานในทีม</span>
                </div>
              </div>

              <!-- Card 3: Irreversible Bug -->
              <div class="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <!-- Header: Icon + Title + Badge -->
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/70 group-hover:scale-105 transition-transform">
                        <RotateCcw class="w-5 h-5" />
                      </div>
                      <div>
                        <span class="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">ปัญหาที่ 3</span>
                        <h5 class="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          ติดกับดักบั๊ก ไม่สามารถย้อนกลับได้
                        </h5>
                      </div>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80 shrink-0">
                      วิกฤตระบบพัง
                    </span>
                  </div>

                  <!-- Visual Scenario Diagram -->
                  <div class="bg-purple-50/70 rounded-xl border border-purple-200/80 p-3 mb-3 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-purple-900 pb-1 border-b border-purple-200/60">
                      <span class="flex items-center gap-1.5">
                        <RotateCcw class="w-3.5 h-3.5 text-purple-600" />
                        ลำดับเหตุการณ์เมื่อเกิดบั๊กวิกฤต
                      </span>
                      <span class="text-[10px] text-purple-700 font-medium">ไม่มี Git Commit</span>
                    </div>
                    <div class="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div class="bg-white p-1.5 rounded border border-emerald-200 text-emerald-700 font-bold shadow-2xs">
                        1. โค้ดรันผ่าน
                      </div>
                      <div class="bg-white p-1.5 rounded border border-gray-200 text-gray-700 shadow-2xs">
                        2. เพิ่ม 100 บรรทัด
                      </div>
                      <div class="bg-white p-1.5 rounded border border-rose-300 text-rose-700 font-bold shadow-2xs">
                        3. พัง Error 500!
                      </div>
                    </div>
                    <div class="bg-white rounded-lg p-2 border border-purple-200 flex items-center justify-between text-[11px]">
                      <span class="text-gray-700 font-medium">เผลอปิดโปรแกรม / เซฟทับ:</span>
                      <span class="px-2 py-0.5 bg-purple-200/80 text-purple-900 font-bold rounded text-[10px]">
                        กดปุ่ม Ctrl + Z กู้คืนไม่ได้แล้ว!
                      </span>
                    </div>
                  </div>

                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    เมื่อพยายามปรับแก้ฟีเจอร์ใหม่จนระบบพังเปิดไม่ติด ปุ่ม <code>Ctrl + Z</code> ในโปรแกรมช่วยไม่ได้อีกต่อไป เพราะเผลอปิดหน้าต่างหรือเซฟทับไปแล้ว
                  </p>
                </div>

                <!-- Consequence Footer -->
                <div class="pt-3 border-t border-purple-100 flex items-start gap-2 text-xs text-purple-900 font-medium bg-purple-50/40 -mx-5 -mb-5 p-3 rounded-b-2xl">
                  <XCircle class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>ผลกระทบ:</strong> สืบหาจุดเริ่มบั๊กไม่ได้ ไม่รู้ว่าพังจากไฟล์ไหน ต้องรื้อแก้โค้ดใหม่ทั้งหมด</span>
                </div>
              </div>

              <!-- Card 4: Zero Accountability (Redesigned Clear Diagram) -->
              <div class="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <!-- Header: Icon + Title + Badge -->
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/70 group-hover:scale-105 transition-transform">
                        <UserX class="w-5 h-5" />
                      </div>
                      <div>
                        <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">ปัญหาที่ 4</span>
                        <h5 class="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          ไร้หลักฐานการสืบสวนและตรวจสอบ
                        </h5>
                      </div>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                      วิกฤตความโปร่งใส
                    </span>
                  </div>

                  <!-- Visual Scenario Diagram (Investigation Fail) -->
                  <div class="bg-blue-50/70 rounded-xl border border-blue-200/80 p-3 mb-3 space-y-2">
                    <!-- Step 1: Incident -->
                    <div class="bg-white rounded-lg p-2 border border-rose-200 flex items-center justify-between text-[11px] shadow-2xs">
                      <div class="flex items-center gap-1.5 font-bold text-gray-800">
                        <AlertTriangle class="w-4 h-4 text-rose-600 shrink-0" />
                        <span>เกิดเหตุ: โค้ดตัดเงินลูกค้าผิดพลาด</span>
                      </div>
                      <span class="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-[10px]">
                        พบบั๊กวิกฤต
                      </span>
                    </div>

                    <!-- Step 2: Raw file without Git trail -->
                    <div class="grid grid-cols-3 gap-1.5 text-center">
                      <div class="bg-white p-2 rounded-lg border border-gray-200 shadow-2xs">
                        <div class="text-[10px] text-gray-500 mb-0.5">ใครเป็นคนแก้?</div>
                        <div class="font-bold text-rose-600 flex items-center justify-center gap-1 text-[10px]">
                          <UserX class="w-3 h-3 shrink-0" /> ไม่ระบุชื่อ
                        </div>
                      </div>
                      <div class="bg-white p-2 rounded-lg border border-gray-200 shadow-2xs">
                        <div class="text-[10px] text-gray-500 mb-0.5">แก้เมื่อวันไหน?</div>
                        <div class="font-bold text-rose-600 flex items-center justify-center gap-1 text-[10px]">
                          <Clock class="w-3 h-3 shrink-0" /> ไม่มีบันทึก
                        </div>
                      </div>
                      <div class="bg-white p-2 rounded-lg border border-gray-200 shadow-2xs">
                        <div class="text-[10px] text-gray-500 mb-0.5">แก้เพื่ออะไร?</div>
                        <div class="font-bold text-rose-600 flex items-center justify-center gap-1 text-[10px]">
                          <HelpCircle class="w-3 h-3 shrink-0" /> ไร้เหตุผล
                        </div>
                      </div>
                    </div>

                    <!-- Step 3: Team Conflict Outcome -->
                    <div class="bg-white rounded-lg p-2 border border-blue-200 flex items-center justify-between text-[11px] shadow-2xs">
                      <div class="flex items-center gap-1.5 text-gray-700">
                        <Users class="w-4 h-4 text-blue-600 shrink-0" />
                        <span>ถามในกลุ่ม: ทุกคนตอบ <em>"ไม่ได้ทำ"</em></span>
                      </div>
                      <span class="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px] shrink-0">
                        จับมือใครดมไม่ได้
                      </span>
                    </div>
                  </div>

                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    เมื่อเกิดข้อผิดพลาดในระบบ ไม่มีทางตรวจสอบย้อนหลังได้ว่าใครเป็นคนเขียนหรือแก้ไขโค้ดบรรทัดนั้น แก้ไขเมื่อวันไหน และมีเจตนาหรือเหตุผลใด
                  </p>
                </div>

                <!-- Consequence Footer -->
                <div class="pt-3 border-t border-blue-100 flex items-start gap-2 text-xs text-blue-900 font-medium bg-blue-50/40 -mx-5 -mb-5 p-3 rounded-b-2xl">
                  <XCircle class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>ผลกระทบ:</strong> กลายเป็นการกล่าวโทษกันในทีม ขาดความโปร่งใส และป้องกันข้อผิดพลาดซ้ำไม่ได้</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deep Dive: The 3 States of Git Architecture (Redesigned with Clear Visual Pipeline & Real-Life Analogy) -->
          <div class="mb-8 p-6 md:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 border border-indigo-200/90 shadow-sm relative overflow-hidden">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
                  <Layers class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-xl font-black text-indigo-950 flex items-center gap-2">
                    กลไกการทำงานภายใน: 3 สถานะหลักของ Git (The 3 States of Git)
                  </h4>
                  <p class="text-xs text-indigo-700/90 mt-0.5">
                    ทำไมต้องมี Git Add และ Commit? เข้าใจเส้นทางการเดินทางของไฟล์จาก "โต๊ะทำงาน" สู่ "ตู้เซฟถาวร"
                  </p>
                </div>
              </div>
              <span class="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-full text-xs border border-indigo-200 self-start sm:self-auto shrink-0 flex items-center gap-1.5 shadow-2xs">
                <GitCommit class="w-3.5 h-3.5 text-indigo-600" />
                ขั้นตอนการบันทึกเวอร์ชัน
              </span>
            </div>

            <!-- Intro Analogy Banner -->
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200/80 mb-6 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                💡
              </div>
              <div class="leading-relaxed">
                <strong class="font-bold text-amber-900 block mb-0.5">หลักการจำง่ายๆ ให้เห็นภาพ (โต๊ะทำงาน ➔ ตะกร้าพัสดุ ➔ ตู้เซฟถาวร):</strong>
                เวลาเราเขียนโปรแกรม Git ไม่ได้บันทึกทุกตัวอักษรที่เรากดแป้นพิมพ์ทันที แต่จะแบ่งไฟล์ออกเป็น <strong>3 สถานะตามลำดับการทำงาน</strong> เพื่อให้เราสามารถเลือกเฉพาะโค้ดที่ผ่านการทดสอบแล้วนำไปบันทึกเป็นประวัติได้อย่างเป็นระเบียบ
              </div>
            </div>

            <!-- The 3 States Pipeline (Horizontal Flow with Connecting Arrow bridges) -->
            <div class="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
              <!-- Step 1: Working Directory -->
              <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all relative group">
                <!-- Top Badge & Step -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                      ขั้นตอนที่ 1
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      ยังไม่บันทึก (Modified)
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Laptop class="w-5 h-5" />
                    </div>
                    <div>
                      <h5 class="font-black text-gray-900 text-base leading-tight">Working Directory</h5>
                      <span class="text-xs text-gray-500 font-medium">โฟลเดอร์ทำงานบนเครื่องคอม</span>
                    </div>
                  </div>

                  <!-- Analogy Card -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 mb-3 text-xs space-y-1.5">
                    <div class="font-bold text-slate-800 flex items-center gap-1">
                      <span>เปรียบเหมือน:</span>
                      <span class="text-indigo-700 font-black">"โต๊ะทำงานรกๆ"</span>
                    </div>
                    <p class="text-gray-600 text-[11px] leading-relaxed">
                      คือไฟล์จริงใน VS Code ที่เรากำลังพิมพ์โค้ด แก้ไข หรือลบไฟล์ สามารถรันเทสเล่นได้ตามสบาย <strong>ยังไม่มีการเก็บประวัติใดๆ</strong> ถ้าเผลอกดลบไฟล์จะกู้คืนยาก
                    </p>
                  </div>
                </div>

                <!-- Action Bridge to Step 2 -->
                <div class="mt-2 pt-3 border-t border-slate-100">
                  <div class="flex items-center justify-between bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 text-xs">
                    <div>
                      <span class="text-[10px] text-indigo-700 font-bold block uppercase tracking-wider">คำสั่งย้ายไปขั้นถัดไป:</span>
                      <code class="font-mono font-bold text-indigo-950 text-xs">git add [ชื่อไฟล์]</code>
                    </div>
                    <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowRight class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Staging Area -->
              <div class="bg-white p-5 rounded-2xl border-2 border-indigo-400 shadow-md shadow-indigo-100 flex flex-col justify-between hover:border-indigo-500 transition-all relative group ring-2 ring-indigo-500/10">
                <!-- Top Badge & Step -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-black text-xs flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                      ขั้นตอนที่ 2 (จุดพักคอย)
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      เตรียมบันทึก (Staged)
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <CheckSquare class="w-5 h-5" />
                    </div>
                    <div>
                      <h5 class="font-black text-indigo-950 text-base leading-tight">Staging Area (Index)</h5>
                      <span class="text-xs text-indigo-600 font-medium">จุดคัดเลือกไฟล์เตรียมถ่ายรูป</span>
                    </div>
                  </div>

                  <!-- Analogy Card -->
                  <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200/70 mb-3 text-xs space-y-1.5">
                    <div class="font-bold text-indigo-950 flex items-center gap-1">
                      <span>เปรียบเหมือน:</span>
                      <span class="text-indigo-700 font-black">"ตะกร้าเตรียมแพ็คของ"</span>
                    </div>
                    <p class="text-indigo-900/90 text-[11px] leading-relaxed">
                      เหมือนเราหยิบเฉพาะเอกสารที่ตรวจทานเสร็จแล้วใส่ตะกร้า ช่วยคัดแยกว่าจะบันทึกเฉพาะไฟล์ไหน <em>(เช่น แก้ไป 5 ไฟล์ แต่พร้อมส่งแค่ไฟล์ Login ไฟล์เดียว)</em>
                    </p>
                  </div>
                </div>

                <!-- Action Bridge to Step 3 -->
                <div class="mt-2 pt-3 border-t border-indigo-100">
                  <div class="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs">
                    <div>
                      <span class="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">คำสั่งย้ายไปขั้นถัดไป:</span>
                      <code class="font-mono font-bold text-emerald-950 text-xs">git commit -m "ข้อความ"</code>
                    </div>
                    <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowRight class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Git Repository -->
              <div class="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all relative group">
                <!-- Top Badge & Step -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                      ขั้นตอนที่ 3 (สำเร็จ)
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      บันทึกถาวร (Committed)
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Database class="w-5 h-5" />
                    </div>
                    <div>
                      <h5 class="font-black text-gray-900 text-base leading-tight">Git Repository (.git)</h5>
                      <span class="text-xs text-emerald-700 font-medium">คลังประวัติศาสตร์ถาวร</span>
                    </div>
                  </div>

                  <!-- Analogy Card -->
                  <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 mb-3 text-xs space-y-1.5">
                    <div class="font-bold text-emerald-950 flex items-center gap-1">
                      <span>เปรียบเหมือน:</span>
                      <span class="text-emerald-800 font-black">"ตู้เซฟเก็บหลักฐานถาวร"</span>
                    </div>
                    <p class="text-emerald-950/90 text-[11px] leading-relaxed">
                      ข้อมูลถูกปิดผนึกเป็น <strong>จุดเช็คพอยต์ (Commit)</strong> พร้อมรหัส Hash ถาวร ใครแก้ แก้เมื่อไหร่ แก้ทำไม ถูกบันทึกไว้ตลอดกาล สามารถย้อนเวลากลับมาดูเวอร์ชันนี้ได้ 100%
                    </p>
                  </div>
                </div>

                <!-- Final Status Badge -->
                <div class="mt-2 pt-3 border-t border-emerald-100">
                  <div class="flex items-center justify-between bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>สถานะ: ปลอดภัย ไม่สูญหาย</span>
                    </div>
                    <span class="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                      Snapshot Saved
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Real-World Example Story Box (Clear Scenario Walkthrough) -->
            <div class="mt-5 p-4 rounded-xl bg-white border border-indigo-200 shadow-2xs">
              <div class="flex items-center gap-2 font-bold text-xs text-indigo-900 mb-2">
                <Target class="w-4 h-4 text-indigo-600" />
                <span>ตัวอย่างสถานการณ์จริงที่พบบ่อย (ทำไมต้องมี Staging Area?):</span>
              </div>
              <div class="text-xs text-gray-700 leading-relaxed space-y-1">
                <p>
                  • สมมติว่านักเรียนนั่งทำงานทั้งวัน มีการแก้ไขไฟล์ไป 3 ไฟล์: 
                  <code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">login.html</code> (ทำเสร็จแล้วสมบูรณ์), 
                  <code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">cart.html</code> (กำลังแก้ค้างไว้ยังไม่เสร็จ), และ 
                  <code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">test.log</code> (ไฟล์ทดลองชั่วคราว)
                </p>
                <p>
                  • ถ้านักเรียนอยากบันทึกเฉพาะระบบ Login เข้าสู่ประวัติงาน โดย<strong>ไม่เอา</strong>โค้ดตะกร้าที่ยังพังอยู่ไปปน ➔ 
                  นักเรียนแค่สั่ง <code class="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded font-mono">git add login.html</code> (นำเฉพาะ Login เข้าตะกร้า Staging) แล้วสั่ง 
                  <code class="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">git commit -m "เพิ่มระบบ Login สำเร็จ"</code> 
                  ... ส่วนอีก 2 ไฟล์ยังคงอยู่บนโต๊ะทำงานอย่างปลอดภัย โดยไม่เข้าไปรบกวนประวัติงานหลักของทีม!
                </p>
              </div>
            </div>
          </div>

          <!-- Concept of Snapshot vs Delta -->
          <div class="mb-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Camera class="w-5 h-5 text-purple-600 shrink-0" />
              ทำไม Git ถึงเร็วกว่าระบบอื่น? ความลับของ "Snapshots, Not Differences"
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span class="font-bold text-gray-700 block mb-1">ระบบในอดีต (Delta-based / Diff-based):</span>
                <p class="text-gray-600 leading-relaxed">
                  เช่น CVS หรือ SVN จะบันทึกไฟล์เวอร์ชันแรกไว้ แล้วทุกครั้งที่มีการแก้ไข จะบันทึกเฉพาะ <strong>"ความแตกต่างหรือผลต่างของบรรทัด (Diff)"</strong> ต่อเป็นลูกโซ่ยาวๆ ข้อเสียคือ ยิ่งประวัติยาวนาน การจะเรียกไฟล์เวอร์ชันล่าสุดขึ้นมา ระบบต้องนำผลต่างตั้งแต่ครั้งแรกมาบวกทบกันไปเรื่อยๆ ทำให้ทำงานช้าลงเรื่อยๆ ตามเวลา
                </p>
              </div>
              <div class="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                <span class="font-bold text-purple-900 block mb-1">ระบบของ Git (Stream of Snapshots):</span>
                <p class="text-purple-950 leading-relaxed">
                  Git มองข้อมูลเป็น <strong>"สตรีมของภาพถ่าย (Snapshots)"</strong> ทุกครั้งที่เราสั่ง Commit ตัว Git จะเสมือนกดชัตเตอร์ถ่ายภาพสถานะของไฟล์ทั้งหมด ณ เวลานั้นไว้ และเพื่อความประหยัดพื้นที่ หากไฟล์ใดไม่มีการเปลี่ยนแปลง Git จะไม่ก็อปปี้ไฟล์ซ้ำ แต่จะสร้างเพียงตัวชี้ (Link/Pointer) ไปยังไฟล์เดิม ส่งผลให้ Git ทำงานได้อย่างรวดเร็วมากเมื่อต้องการกู้คืนประวัติ
                </p>
              </div>
            </div>
          </div>

          <!-- Evolution of VCS: Local -> Centralized -> Distributed -->
          <div class="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl shadow-md">
            <h4 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw class="w-5 h-5 text-indigo-400" />
              วิวัฒนาการ 3 ยุคของระบบควบคุมเวอร์ชัน (Evolution of VCS)
            </h4>
            <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              มนุษย์ได้พัฒนาระบบควบคุมเวอร์ชันเพื่อเอาชนะอุปสรรคในการประสานงานมาอย่างต่อเนื่องถึง 3 ยุคสมัย:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
                <div>
                  <span class="px-2.5 py-1 rounded bg-slate-700 text-xs font-bold text-slate-300 inline-block mb-2">ยุคที่ 1 (1970s - 1980s)</span>
                  <h5 class="text-base font-bold text-indigo-300 mb-2">1. Local VCS (ควบคุมเฉพาะเครื่อง)</h5>
                  <p class="text-slate-300 text-xs leading-relaxed mb-3">
                    เช่น โปรแกรม <strong>RCS (Revision Control System)</strong> เก็บฐานข้อมูลของไฟล์ไว้ภายในฮาร์ดดิสก์เครื่องตนเอง
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-700/60 text-[11px] text-rose-300">
                  ❌ ข้อจำกัด: ร่วมงานกับคนอื่นในระบบเครือข่ายไม่ได้ หากฮาร์ดดิสก์เสียหาย ประวัติจะสูญหายทันที
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
                <div>
                  <span class="px-2.5 py-1 rounded bg-slate-700 text-xs font-bold text-slate-300 inline-block mb-2">ยุคที่ 2 (1990s - 2000s)</span>
                  <h5 class="text-base font-bold text-amber-300 mb-2">2. Centralized VCS (ระบบรวมศูนย์)</h5>
                  <p class="text-slate-300 text-xs leading-relaxed mb-3">
                    เช่น <strong>CVS, Apache Subversion (SVN), Perforce</strong> มีเซิร์ฟเวอร์ส่วนกลาง 1 เครื่องเก็บไฟล์และประวัติทั้งหมด นักพัฒนาจะ Checkout ดึงไฟล์เวอร์ชันล่าสุดมาทำ
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-700/60 text-[11px] text-amber-300">
                  ⚠️ ข้อจำกัด: หากเซิร์ฟเวอร์ล่มหรือเน็ตตัด จะไม่สามารถ Commit หรือดูประวัติได้ (Single Point of Failure)
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
                <div>
                  <span class="px-2.5 py-1 rounded bg-indigo-900/60 text-xs font-bold text-emerald-400 inline-block mb-2 border border-emerald-500/30">ยุคที่ 3 (2005 - ปัจจุบัน)</span>
                  <h5 class="text-base font-bold text-emerald-300 mb-2">3. Distributed VCS (ระบบกระจายศูนย์)</h5>
                  <p class="text-slate-300 text-xs leading-relaxed mb-3">
                    เช่น <strong>Git, Mercurial</strong> ถือกำเนิดขึ้นโดย Linus Torvalds ผู้สร้าง Linux โดยกำหนดให้นักพัฒนาทุกคนที่ Clone งาน จะได้รับสำเนา Repository และประวัติครบ 100%
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-700/60 text-[11px] text-emerald-300">
                  ✅ จุดเด่น: ทำงานออฟไลน์ได้สมบูรณ์แบบ แตก Branch รวดเร็ว และเป็นมาตรฐานอุตสาหกรรมปัจจุบัน
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 2: CVCS vs DVCS -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 2: ความแตกต่างระหว่างแบบรวมศูนย์ (Centralized VCS) และแบบกระจาย (Distributed VCS)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            สถาปัตยกรรมทั้งสองแบบมีหลักการทำงานและโครงสร้างการจัดเก็บข้อมูลที่แตกต่างกันในระดับรากฐาน
            ซึ่งส่งผลโดยตรงต่อ <strong>ความปลอดภัยของข้อมูล ความคล่องตัวในการทำงาน และความต่อเนื่องทางธุรกิจ (Business Continuity)</strong>
          </p>

          <!-- Side by Side Architecture Cards with Detailed Workflow -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Centralized VCS Card -->
            <div class="p-6 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <Server class="w-6 h-6 text-amber-600" />
                    <h4 class="text-lg font-bold text-amber-950">Centralized VCS (ระบบรวมศูนย์)</h4>
                  </div>
                  <span class="text-xs px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full font-bold">Client-Server Model</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-700 mb-4 leading-relaxed">
                  <strong>โครงสร้างการทำงาน:</strong> ทุกคนในทีมเชื่อมต่อกับ <em>Central Repository Server</em> เครื่องเดียว
                  เมื่อจะเริ่มทำงาน นักพัฒนาจะทำการ <code>Checkout</code> เฉพาะ Snapshot ไฟล์ล่าสุดมาลงเครื่องตนเองเพื่อเปิดเขียนโค้ด (Working Copy)
                  และเมื่อทำเสร็จ จะต้อง <code>Commit</code> ส่งกลับไปยังเซิร์ฟเวอร์กลางทันที
                </p>

                <div class="space-y-2.5 text-xs sm:text-sm text-gray-800 bg-white/80 p-4 rounded-xl border border-amber-200/80 mb-4">
                  <div class="flex items-start gap-2">
                    <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>จุดแข็ง:</strong> บริหารจัดการสิทธิ์การเข้าถึงจากศูนย์กลางง่าย ผู้ดูแลระบบ (Admin) ควบคุมได้ชัดเจนว่าใครอ่านหรือแก้ไฟล์ใดได้บ้าง
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <XCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>จุดอ่อนวิกฤต (Single Point of Failure):</strong> หากเซิร์ฟเวอร์ส่วนกลางฮาร์ดดิสก์พัง ไฟดับ หรือโดนโจมตี ทุกคนในบริษัทจะหยุดชะงัก ไม่สามารถ Commit บันทึกงาน หรือย้อนดูประวัติไฟล์ได้เลย
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <XCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ข้อจำกัดด้านเครือข่าย:</strong> ต้องเชื่อมต่ออินเทอร์เน็ตตลอดเวลา การดู Log หรือเปรียบเทียบโค้ดย้อนหลัง (Diff) จะช้าเพราะต้องดึงข้อมูลผ่านสายแลนทุกครั้ง
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-[11px] text-amber-800 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200">
                📌 <strong>ตัวอย่างซอฟต์แวร์:</strong> Apache Subversion (SVN), CVS, Perforce Helix Core
              </div>
            </div>

            <!-- Distributed VCS Card -->
            <div class="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <Share2 class="w-6 h-6 text-indigo-600" />
                    <h4 class="text-lg font-bold text-indigo-950">Distributed VCS (ระบบกระจายศูนย์)</h4>
                  </div>
                  <span class="text-xs px-2.5 py-1 bg-indigo-200 text-indigo-900 rounded-full font-bold">Peer-to-Peer Model</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-700 mb-4 leading-relaxed">
                  <strong>โครงสร้างการทำงาน:</strong> เมื่อนักพัฒนาสั่งคำสั่ง <code>Clone</code> โปรเจกต์ลงมาที่เครื่อง
                  ระบบจะคัดลอก <em>ประวัติศาสตร์ทั้งหมดของทุกไฟล์และทุกกิ่งงาน (Branch)</em> มาไว้ในโฟลเดอร์ <code>.git</code> ในเครื่องตัวเองอย่างสมบูรณ์
                  ทำให้เครื่องนักพัฒนาทุกคนกลายเป็นเซิร์ฟเวอร์คลังข้อมูลย่อย (Full Local Repository) ในตัวเอง
                </p>

                <div class="space-y-2.5 text-xs sm:text-sm text-gray-800 bg-white/80 p-4 rounded-xl border border-indigo-200/80 mb-4">
                  <div class="flex items-start gap-2">
                    <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ทำงานออฟไลน์ได้ 100%:</strong> แม้สัญญาณเน็ตจะหลุด หรือนั่งทำงานบนเครื่องบิน ก็ยังสามารถเขียนโค้ด, สั่ง <code>git add</code>, และ <code>git commit</code> บันทึกประวัติในเครื่องตัวเองได้ต่อเนื่องตามปกติ
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ความปลอดภัยระดับสูงสุด (Self-Healing Backup):</strong> แม้เซิร์ฟเวอร์หลัก (เช่น GitHub) จะล่มสลาย เราสามารถใช้เครื่องคอมพิวเตอร์ของนักพัฒนาคนใดคนหนึ่งในทีม อัปโหลดกู้คืนประวัติทั้งหมดกลับคืนมาได้ทันที
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ความเร็วในการประมวลผลสูงมาก:</strong> การเรียกดูประวัติ <code>git log</code> หรือการเปรียบเทียบโค้ด <code>git diff</code> ทำงานกับข้อมูลในดิสก์เครื่องตนเอง จึงแสดงผลได้ทันทีโดยไม่ต้องรอเครือข่าย
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-[11px] text-indigo-800 bg-indigo-100/60 p-2.5 rounded-lg border border-indigo-200">
                📌 <strong>ตัวอย่างซอฟต์แวร์:</strong> Git, Mercurial, Bazaar
              </div>
            </div>
          </div>

          <!-- Comprehensive Comparison Table -->
          <div class="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6">
            <table class="w-full text-xs sm:text-sm text-left border-collapse">
              <thead class="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
                <tr>
                  <th class="p-4 border-r border-gray-200 w-1/4">ประเด็นการเปรียบเทียบ</th>
                  <th class="p-4 border-r border-gray-200 text-amber-900 bg-amber-50/70 w-3/8">Centralized VCS (เช่น SVN)</th>
                  <th class="p-4 text-indigo-900 bg-indigo-50/70 w-3/8">Distributed VCS (เช่น Git)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 text-gray-700">
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">1. การจัดเก็บประวัติ (History Storage)</td>
                  <td class="p-3.5 border-r border-gray-200">เก็บไว้ที่เซิร์ฟเวอร์กลางแห่งเดียว เครื่องลูกข่ายมีเพียงสำเนาไฟล์ล่าสุด</td>
                  <td class="p-3.5 font-medium text-indigo-950">ทุกเครื่องมีสำเนาประวัติศาสตร์โครงการฉบับสมบูรณ์ 100%</td>
                </tr>
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">2. การทำงานแบบออฟไลน์ (Offline Capability)</td>
                  <td class="p-3.5 border-r border-gray-200 text-rose-600 font-medium">ไม่สามารถ Commit หรือดูประวัติได้หากขาดการเชื่อมต่ออินเทอร์เน็ต</td>
                  <td class="p-3.5 text-emerald-600 font-medium">ทำได้เต็มรูปแบบ (Commit, Branch, Log, Diff) โดยไม่ต้องเชื่อมต่อเน็ต</td>
                </tr>
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">3. ความปลอดภัยหากเซิร์ฟเวอร์ล่ม (Fault Tolerance)</td>
                  <td class="p-3.5 border-r border-gray-200 text-rose-600 font-medium">เสี่ยงสูงมาก (Single Point of Failure) หากเซิร์ฟเวอร์พังและไม่มีสำรอง ข้อมูลจะหายสิ้นเชิง</td>
                  <td class="p-3.5 text-emerald-600 font-medium">ความเสี่ยงต่ำมาก เพราะเครื่องนักพัฒนาทุกคนคือตัวสำรองที่สมบูรณ์</td>
                </tr>
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">4. ประสิทธิภาพและความเร็ว (Performance)</td>
                  <td class="p-3.5 border-r border-gray-200">ช้ากว่า เพราะเกือบทุกคำสั่งต้องวิ่งผ่านสายแลน/อินเทอร์เน็ตไปถามเซิร์ฟเวอร์</td>
                  <td class="p-3.5 font-medium text-emerald-700">รวดเร็วระดับมิลลิวินาที เพราะคำนวณและเขียนลงพื้นที่ฮาร์ดดิสก์ตนเอง</td>
                </tr>
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">5. การแยกสาขางาน (Branching & Merging)</td>
                  <td class="p-3.5 border-r border-gray-200">ยุ่งยาก ใช้เวลานาน กินเนื้อที่เซิร์ฟเวอร์ และมักหลีกเลี่ยงการทำ Branch ย่อย</td>
                  <td class="p-3.5 font-bold text-indigo-700">ง่ายดาย เบาบาง (Lightweight) รวดเร็ว และเป็นจุดแข็งที่สุดของ Git</td>
                </tr>
                <tr class="hover:bg-gray-50/50">
                  <td class="p-3.5 font-semibold border-r border-gray-200 bg-gray-50/30">6. การรวมงานเข้าหากัน (Sharing Changes)</td>
                  <td class="p-3.5 border-r border-gray-200">ทุกคน Commit ส่งตรงเข้าเซิร์ฟเวอร์กลางพร้อมๆ กัน เสี่ยงต่อโค้ดชนกันบ่อย</td>
                  <td class="p-3.5">ใช้โมเดล Push / Pull และรองรับการทำ Pull Request (Code Review) ก่อนรวมงาน</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Topic 3: Benefits for Code Management & Teamwork -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 3: ประโยชน์ของการใช้ระบบควบคุมเวอร์ชันในการบริหารจัดการซอร์สโค้ดและการทำงานร่วมกันเป็นทีม
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            ในบริบทการทำงานวิศวกรรมซอฟต์แวร์ระดับอาชีพและในแนวคิด DevOps ระบบควบคุมเวอร์ชันไม่ใช่แค่โปรแกรมบันทึกงาน
            แต่เป็น <strong>"วัฒนธรรมการทำงานร่วมกันและการบริหารความเสี่ยง (Collaboration & Risk Management)"</strong>
            ที่ช่วยยกระดับคุณภาพของทีมอย่างมีนัยสำคัญ:
          </p>

          <!-- 4 Core Pillars of VCS in Teamwork -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Pillar 1: Time Travel & Rollback -->
            <div class="p-6 rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Clock class="w-5 h-5" />
                  </div>
                  <h4 class="font-bold text-gray-900 text-base">1. การย้อนเวลาและกู้คืนระบบ (Time Travel & Rollback)</h4>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  ในการเขียนโปรแกรมจริง มักมีสถานการณ์ที่ฟังก์ชันที่เพิ่งปล่อยไปทำให้ระบบพัง หากไม่มี VCS ทีมอาจต้องใช้เวลาหลายวันในการไล่ลบโค้ดทีละบรรทัด
                  แต่ด้วยระบบ VCS เราสามารถสั่งย้อนสถานะโปรเจกต์กลับไปยังจุด Commit ล่าสุดที่ระบบยังเสถียรได้ในเวลาเพียงไม่กี่วินาที ทำให้ลดความสูญเสียทางธุรกิจได้อย่างมหาศาล
                </p>
              </div>

              <!-- Terminal Codeblock -->
              <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span class="ml-1 text-slate-300 font-semibold">Terminal</span>
                  </div>
                  <span class="text-[10px] text-slate-500">Rollback Commands</span>
                </div>
                <div class="p-3 text-xs font-mono space-y-1.5">
                  <div class="text-slate-500 text-[10px]">// ย้อนยกเลิก Commit ที่มีบั๊ก โดยไม่กระทบประวัติเดิม</div>
                  <div class="flex items-center flex-wrap">
                    <span class="text-emerald-400 select-none mr-2 font-bold">$</span>
                    <span class="text-cyan-300">git</span>
                    <span class="text-emerald-300 ml-1.5">revert</span>
                    <span class="text-amber-300 ml-1.5">[commit_id]</span>
                  </div>
                  <div class="text-slate-500 text-[10px] pt-1">// หรือสลับย้อนกลับไปดูเวอร์ชันของ Branch อื่น</div>
                  <div class="flex items-center flex-wrap">
                    <span class="text-emerald-400 select-none mr-2 font-bold">$</span>
                    <span class="text-cyan-300">git</span>
                    <span class="text-emerald-300 ml-1.5">checkout</span>
                    <span class="text-purple-300 ml-1.5">main</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pillar 2: Branching Strategy -->
            <div class="p-6 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <GitBranch class="w-5 h-5" />
                  </div>
                  <h4 class="font-bold text-gray-900 text-base">2. การแยกสายงานคู่ขนานอย่างอิสระ (Branching Strategy)</h4>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  ทีมสามารถกำหนดให้สายงานหลัก (เช่น <code>main</code> หรือ <code>production</code>) บรรจุเฉพาะโค้ดที่ผ่านการทดสอบแล้วเท่านั้น
                  สมาชิกในทีมแต่ละคนจะแตกสายงานย่อยของตนเอง (Feature Branch) เช่น <code>feature/login</code>, <code>feature/payment</code>, หรือ <code>bugfix/header</code>
                  ทุกคนจึงสามารถทดลองเขียนโค้ดได้อย่างอิสระเต็มที่ โดยไม่มีทางส่งผลกระทบต่อระบบที่ลูกค้ากำลังใช้งานอยู่
                </p>
              </div>

              <!-- Terminal Codeblock -->
              <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span class="ml-1 text-slate-300 font-semibold">Terminal</span>
                  </div>
                  <span class="text-[10px] text-slate-500">Create & Switch Branch</span>
                </div>
                <div class="p-3 text-xs font-mono space-y-1.5">
                  <div class="text-slate-500 text-[10px]">// แตกกิ่งใหม่และสลับไปทำงานทันที</div>
                  <div class="flex items-center flex-wrap">
                    <span class="text-emerald-400 select-none mr-2 font-bold">$</span>
                    <span class="text-cyan-300">git</span>
                    <span class="text-emerald-300 ml-1.5">checkout</span>
                    <span class="text-purple-300 ml-1.5">-b</span>
                    <span class="text-amber-300 ml-1.5">feature/login-page</span>
                  </div>
                  <div class="text-emerald-400 text-[11px] pt-0.5">
                    Switched to a new branch 'feature/login-page'
                  </div>
                </div>
              </div>
            </div>

            <!-- Pillar 3: Merge Conflict Resolution -->
            <div class="p-6 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckSquare class="w-5 h-5" />
                  </div>
                  <h4 class="font-bold text-gray-900 text-base">3. กลไกจัดการข้อขัดแย้ง (Merge Conflict Resolution)</h4>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  เมื่อสมาชิก 2 คนแก้ไขบรรทัดเดียวกันในไฟล์เดียวกัน ระบบ VCS จะ <strong>"ไม่ยอมให้ใครเซฟทับใครโดยเด็ดขาด"</strong>
                  แต่ Git จะหยุดกระบวนการรวมงานชั่วคราว พร้อมแทรกสัญลักษณ์เตือนข้อขัดแย้ง (Conflict Markers) ลงในโค้ด เพื่อบังคับให้นักพัฒนาทั้งสองฝ่ายมานั่งเปิดดูร่วมกันว่า
                  จะเลือกใช้โค้ดของใคร หรือจะนำโค้ดของทั้งสองคนมาผสานเข้าด้วยกัน
                </p>
              </div>

              <!-- Conflict Markers Codeblock -->
              <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span class="ml-1 text-slate-300 font-semibold">app.js (ตัวอย่าง Conflict Marker)</span>
                  </div>
                  <span class="text-[10px] text-rose-400 font-bold">Merge Conflict</span>
                </div>
                <div class="p-3 text-[11px] font-mono leading-relaxed space-y-1 bg-slate-950">
                  <div class="text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border-l-2 border-rose-500">
                    &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (โค้ดบนเครื่องเรา)
                  </div>
                  <div class="text-emerald-300 pl-3">
                    const buttonColor = "blue";
                  </div>
                  <div class="text-slate-500 font-bold px-2 py-0.5">
                    ======= (เส้นคั่นจุดที่ชนกัน)
                  </div>
                  <div class="text-amber-300 pl-3">
                    const buttonColor = "red";
                  </div>
                  <div class="text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded border-l-2 border-blue-500">
                    &gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/cart (โค้ดของเพื่อนที่ดึงมา)
                  </div>
                </div>
              </div>
            </div>

            <!-- Pillar 4: Traceability & Audit -->
            <div class="p-6 rounded-2xl border border-gray-200 bg-white hover:border-purple-300 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Shield class="w-5 h-5" />
                  </div>
                  <h4 class="font-bold text-gray-900 text-base">4. ความโปร่งใสและการตรวจสอบย้อนกลับ (Traceability & Audit)</h4>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  ทุกๆ บรรทัดของซอร์สโค้ดในโปรเจกต์จะมีลายเซ็นและข้อมูลกำกับไว้เสมอ ผ่านคำสั่ง <code>git blame</code> หรือการดู <code>git log</code>
                  ทำให้หัวหน้างานและทีมสามารถสืบสวนหาต้นตอของบั๊กได้อย่างแม่นยำ พร้อมทั้งทราบวัตถุประสงค์ของการแก้ไขจากข้อความอธิบาย (Commit Message)
                  เปลี่ยนวัฒนธรรมการกล่าวโทษให้กลายเป็นการเรียนรู้และปรับปรุงร่วมกัน
                </p>
              </div>

              <!-- Terminal Codeblock -->
              <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span class="ml-1 text-slate-300 font-semibold">Terminal</span>
                  </div>
                  <span class="text-[10px] text-slate-500">Audit & Trace Commands</span>
                </div>
                <div class="p-3 text-xs font-mono space-y-1.5">
                  <div class="text-slate-500 text-[10px]">// ดูประวัติกราฟ Commit ย่อ 1 บรรทัด</div>
                  <div class="flex items-center flex-wrap">
                    <span class="text-emerald-400 select-none mr-2 font-bold">$</span>
                    <span class="text-cyan-300">git</span>
                    <span class="text-emerald-300 ml-1.5">log</span>
                    <span class="text-purple-300 ml-1.5">--oneline</span>
                    <span class="text-purple-300 ml-1.5">--graph</span>
                  </div>
                  <div class="text-slate-500 text-[10px] pt-1">// หรือสืบหาคนเขียนและวันเวลาของแต่ละบรรทัดในไฟล์</div>
                  <div class="flex items-center flex-wrap">
                    <span class="text-emerald-400 select-none mr-2 font-bold">$</span>
                    <span class="text-cyan-300">git</span>
                    <span class="text-emerald-300 ml-1.5">blame</span>
                    <span class="text-amber-300 ml-1.5">src/services/payment.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 4: Hands-on Setup & Installation of Git -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 4: การเตรียมความพร้อมและติดตั้งเครื่องมือระบบควบคุมเวอร์ชันขั้นพื้นฐาน (Git Installation & First Setup)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            ในการปฏิบัติงานจริง เราจะใช้ <strong>Git (Command Line Interface: CLI)</strong> ควบคู่กับโปรแกรมแก้ไขโค้ดที่นิยมที่สุดในโลกคือ
            <strong>Visual Studio Code (VS Code)</strong> ซึ่งมีส่วนขยายรองรับ Git มาในตัว
          </p>

          <!-- Misconception Clear Box: Git vs GitHub -->
          <div class="p-5 rounded-2xl bg-amber-50 border border-amber-200 mb-8 flex items-start gap-3 shadow-sm">
            <Lightbulb class="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div class="text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong class="font-bold text-sm text-amber-900 block mb-1">💡 ข้อควรระวัง: ความแตกต่างระหว่าง Git กับ GitHub (มักเข้าใจสับสนบ่อยที่สุด!)</strong>
              <ul class="list-disc pl-4 space-y-1">
                <li><strong>Git:</strong> คือ <em>โปรแกรมเครื่องมือ (Tool / Software)</em> ที่ติดตั้งลงในคอมพิวเตอร์ของเรา ทำหน้าที่บันทึกประวัติการเปลี่ยนแปลงของไฟล์ในเครื่อง (ทำงานออฟไลน์ได้โดยไม่ต้องมีเน็ต)</li>
                <li><strong>GitHub / GitLab:</strong> คือ <em>ผู้ให้บริการพื้นที่ฝากไฟล์บนอินเทอร์เน็ต (Cloud Hosting Platform)</em> ที่ใช้ Git เป็นตัวขับเคลื่อนเบื้องหลัง เพื่อให้เราสามารถซิงค์โค้ดขึ้นคลาวด์และทำงานร่วมกับเพื่อนทั่วโลกได้</li>
              </ul>
            </div>
          </div>

          <!-- 4 Steps of Installation & Setup with Detailed Instructions -->
          <div class="space-y-5">
            <!-- Step 1 -->
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-start gap-4 shadow-sm">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow">
                1
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-gray-900 text-base">ดาวน์โหลดและติดตั้งโปรแกรม Git SCM</h4>
                  <span class="text-xs font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">ขั้นตอนที่ 1</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                  เข้าไปที่เว็บไซต์อย่างเป็นทางการ <a href="https://git-scm.com/downloads" target="_blank" class="text-indigo-600 font-bold underline hover:text-indigo-800">https://git-scm.com/downloads</a>
                  แล้วเลือกดาวน์โหลดตัวติดตั้งตามระบบปฏิบัติการของเครื่องตนเอง (Windows, macOS หรือ Linux)
                </p>
                <div class="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
                  <span class="font-bold block">💡 ข้อแนะนำสำคัญระหว่างกดติดตั้งบน Windows:</span>
                  <ul class="list-disc pl-4 space-y-1 text-gray-700">
                    <li><strong>Choosing default editor:</strong> เลือก <em>Use Visual Studio Code as Git's default editor</em></li>
                    <li><strong>Adjusting PATH environment:</strong> เลือก <em>Git from the command line and also from 3rd-party software (Recommended)</em> เพื่อให้คำสั่ง <code>git</code> ใช้งานได้ใน VS Code Terminal และ Command Prompt</li>
                    <li><strong>Configuring the line ending conversions:</strong> เลือก <em>Checkout Windows-style, commit Unix-style line endings</em> ป้องกันปัญหาขึ้นบรรทัดใหม่เพี้ยนเมื่อนำไปรันบน Linux/Server</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-start gap-4 shadow-sm">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow">
                2
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-gray-900 text-base">ตรวจสอบความพร้อมของการติดตั้งผ่านหน้าต่างคำสั่ง (Terminal Verification)</h4>
                  <span class="text-xs font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">ขั้นตอนที่ 2</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 leading-relaxed">
                  เปิดโปรแกรม <strong>Git Bash</strong>, <strong>Command Prompt (cmd)</strong>, หรือเปิด Terminal ใน <strong>Visual Studio Code (กด <code>Ctrl + `</code>)</strong> แล้วพิมพ์คำสั่ง:
                </p>
                <div class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
                  <code>$ git --version</code>
                  <span class="text-emerald-400 text-xs">// ตัวอย่างผลลัพธ์: git version 2.45.2.windows.1</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-2">
                  * หากแสดงหมายเลขเวอร์ชัน แสดงว่าการติดตั้งระบบสำเร็จสมบูรณ์และพร้อมใช้งาน
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-start gap-4 shadow-sm">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow">
                3
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-gray-900 text-base">กำหนดค่าตัวตนผู้ใช้งานครั้งแรก (First-Time Identity Configuration)</h4>
                  <span class="text-xs font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">ขั้นตอนที่ 3 (บังคับทำ)</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                  Git จำเป็นต้องทราบ <strong>ชื่อ (User Name)</strong> และ <strong>อีเมล (User Email)</strong> ของผู้พัฒนา เพื่อแนบตัวตนลงในทุกบันทึก Commit ถาวร
                  (ใช้แฟล็ก <code>--global</code> เพื่อให้การตั้งค่านี้มีผลกับทุกโปรเจกต์ในเครื่องคอมพิวเตอร์ของคุณ โดยไม่ต้องพิมพ์ตั้งค่าซ้ำอีก):
                </p>
                <div class="space-y-3">
                  <div class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs sm:text-sm shadow-inner">
                    <span class="text-slate-400 block mb-1"># 1. กำหนดชื่อและนามสกุลของคุณ (ภาษาอังกฤษ แนะนำให้ตรงกับโปรไฟล์ทางการ)</span>
                    <code>git config --global user.name "Somchai Jaidee"</code>
                  </div>
                  <div class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs sm:text-sm shadow-inner">
                    <span class="text-slate-400 block mb-1"># 2. กำหนดอีเมลจริงของคุณ (ควรตรงกับอีเมลที่ใช้สมัครบัญชี GitHub ในอนาคต)</span>
                    <code>git config --global user.email "somchai.j@gmail.com"</code>
                  </div>
                  <div class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs sm:text-sm shadow-inner">
                    <span class="text-slate-400 block mb-1"># 3. กำหนดชื่อ Branch เริ่มต้นของทุกโปรเจกต์ให้เป็น 'main' ตามมาตรฐานสากล</span>
                    <code>git config --global init.defaultBranch main</code>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-start gap-4 shadow-sm">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow">
                4
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-gray-900 text-base">ตรวจสอบและยืนยันรายการคอนฟิกทั้งหมด (Verify Configuration List)</h4>
                  <span class="text-xs font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">ขั้นตอนที่ 4</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 leading-relaxed">
                  ตรวจสอบความถูกต้องว่าชื่อและอีเมลถูกบันทึกลงในระบบเรียบร้อยแล้ว ด้วยคำสั่ง:
                </p>
                <div class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs sm:text-sm shadow-inner">
                  <span class="text-slate-400 block mb-1">$ git config --list</span>
                  <div class="text-emerald-400 text-xs space-y-0.5 pt-1 border-t border-slate-800">
                    <div>user.name=Somchai Jaidee</div>
                    <div>user.email=somchai.j@gmail.com</div>
                    <div>init.defaultbranch=main</div>
                    <div>core.autocrlf=true</div>
                  </div>
                </div>
                <p class="text-[11px] text-gray-500 mt-2">
                  * หากต้องการตรวจสอบเฉพาะชื่อ ให้พิมพ์ <code>git config user.name</code> หรือตรวจสอบเฉพาะอีเมลด้วย <code>git config user.email</code>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Game Center & Evaluation Section -->
    <section>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
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

        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all self-start sm:self-auto">
          <Trophy class="w-4 h-4" />
          <span>แดชบอร์ดคะแนนนักศึกษา</span>
        </button>
      </div>

      <!-- Score Summary Card -->
      <div class="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
              สรุปคะแนนของคุณประจำสัปดาห์ที่ 2
            </span>
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
            class="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-xl border border-indigo-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-indigo-950 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black text-indigo-700">
                  {{ studentNorm.completedCount === 0 ? '-' : studentNorm.normalizedScore }}
                </span>
                <span class="text-xs text-gray-400 font-semibold">/ 10 คะแนน</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 Activity Status Badges -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div v-for="g in weekGames" :key="g.id"
            class="flex items-center justify-between p-3 rounded-xl border"
            :class="studentWeekScores[g.id] ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-500'">
            <div class="flex items-center gap-2 truncate">
              <span v-if="studentWeekScores[g.id]" class="text-emerald-600 font-bold">✓</span>
              <span v-else class="text-gray-400 font-bold">○</span>
              <span class="font-medium truncate">{{ g.name }}</span>
            </div>
            <span class="font-bold shrink-0 ml-2">
              <template v-if="studentWeekScores[g.id]">
                {{ studentWeekScores[g.id].score }} / {{ g.maxScore }}
              </template>
              <template v-else>
                - / {{ g.maxScore }}
              </template>
            </span>
          </div>
        </div>
      </div>

      <!-- Game Tab Buttons -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <button @click="activeGame = 'sort'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'sort'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: จำแนก Centralized vs Distributed</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'order'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'order'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่คำศัพท์ Version Control</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'quiz'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>🎯 แบบทดสอบหลังเรียน (4 ชอยส์ 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop (Sort) -->
      <DragDropGame v-if="activeGame === 'sort'"
        title="มินิเกมที่ 1: จำแนก Centralized VCS vs Distributed VCS"
        subtitle="ลากข้อความด้านล่างไปใส่กล่องที่ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-1"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialItems="dragItemsData"
        :zones="dragZonesData" />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'order'"
        title="มินิเกมที่ 2: จับคู่คำศัพท์และโครงสร้าง Version Control System"
        subtitle="จับคู่คำศัพท์กับคำอธิบายให้ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)"
        gameId="game-2"
        :courseId="currentCourseId"
        :week="currentWeek"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs" />

      <!-- Game 3: Pop Quiz -->
      <PopQuiz v-if="activeGame === 'quiz'"
        title="แบบทดสอบหลังเรียน (Post-test): งานระบบควบคุมเวอร์ชัน (VCS)"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดผลความรู้หลังเรียน ตอบให้ครบแล้วกดส่งคำตอบ (ทำได้ครั้งเดียวเท่านั้น)"
        gameId="quiz"
        :courseId="currentCourseId"
        :week="currentWeek"
        :questions="quizQuestions" />

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal
        :show="showTeacherModal"
        :courseId="currentCourseId"
        courseName="การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม"
        :week="currentWeek"
        weekTitle="สัปดาห์ที่ 2: งานระบบควบคุมเวอร์ชัน (Version Control System)"
        :games="weekGames"
        @close="showTeacherModal = false" />
    </section>

    <!-- Assignment Section -->
    <AssignmentSection
      course-id="21901-2012"
      assignment-id="asm-2"
      assignment-title="ใบงานที่ 2: งานระบบควบคุมเวอร์ชัน (Version Control System)"
      :max-score="10">
      <template #number>2</template>
      <template #description>
        วิเคราะห์เปรียบเทียบสถาปัตยกรรมระบบควบคุมเวอร์ชันแบบรวมศูนย์ (CVCS) กับแบบกระจาย (DVCS)
        พร้อมทั้งปฏิบัติการติดตั้งโปรแกรม Git บนเครื่องคอมพิวเตอร์ และบันทึกผลการตั้งค่าคอนฟิกผู้ใช้ (user.name / user.email)

        <!-- Objectives Box -->
        <div class="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 mt-4">
          <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-indigo-600" />
            จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-indigo-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>1. อธิบายสถาปัตยกรรมและข้อแตกต่างของ CVCS และ DVCS ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>2. ติดตั้งเครื่องมือ Git CLI ลงในเครื่องคอมพิวเตอร์ได้ถูกต้อง</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>3. ดำเนินการตั้งค่า user.name, user.email และตรวจสอบได้</span>
            </div>
          </div>
        </div>

        <!-- 4 Step Tasks -->
        <ul class="space-y-4 text-slate-700">
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div>
              <strong>ตอนที่ 1: การวิเคราะห์และเปรียบเทียบสถาปัตยกรรม CVCS vs DVCS</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                เขียนตารางเปรียบเทียบการทำงานระหว่าง Centralized VCS (เช่น SVN) และ Distributed VCS (เช่น Git)
                ในมิติของการทำงานแบบออฟไลน์, ความเสี่ยง Single Point of Failure และประสิทธิภาพความเร็ว
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2
            </div>
            <div>
              <strong>ตอนที่ 2: บันทึกผลการติดตั้งโปรแกรม Git บนเครื่องคอมพิวเตอร์</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                แคปหน้าจอการรันคำสั่ง <code>git --version</code> บน Terminal / Command Prompt เพื่อยืนยันว่าติดตั้ง Git บนเครื่องตนเองเรียบร้อยสมบูรณ์
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3
            </div>
            <div>
              <strong>ตอนที่ 3: บันทึกผลการตั้งค่าตัวตนผู้ใช้ (Git Global Configuration)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                รันคำสั่งตั้งค่า <code>user.name</code>, <code>user.email</code> และแคปหน้าจอผลลัพธ์จากคำสั่ง <code>git config --list</code> ที่แสดงชื่อและอีเมลของตนเอง
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              4
            </div>
            <div>
              <strong>ตอนที่ 4: สรุปประโยชน์ของ Version Control ในการทำงานพัฒนาโปรแกรมเป็นทีม</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                เขียนสรุปข้อคิดเห็นว่าการนำ Git เข้ามาใช้จะช่วยแก้ปัญหาการทำงานกลุ่มในวิชาโครงงานหรือการทำงานในชีวิตจริงได้อย่างไรบ้าง
              </p>
            </div>
          </li>
        </ul>

        <!-- PDF Example Modal Trigger Button -->
        <div class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-indigo-600" /> ต้องการดูตัวอย่างการเขียนใบงานที่ 2?
            </h5>
            <p class="text-xs text-gray-500 mt-0.5">กดดูเอกสารจำลองโครงสร้างทางการขนาด A4 พร้อมรูปแบบการตอบ</p>
          </div>
          <button @click="showPdfModal = true"
            class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-2 shadow-sm">
            <Monitor class="w-4 h-4" /> ดูตัวอย่างแบบฟอร์ม A4 (PDF Preview)
          </button>
        </div>
      </template>
    </AssignmentSection>

    <!-- Assignment PDF Modal for Week 2 (A4 Format) -->
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="ใบงานที่_2_งานระบบควบคุมเวอร์ชัน_ปวช.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)"
      footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 • รายวิชาการพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม (21901-2012)">
      <!-- Official Worksheet Header -->
      <div class="border-b-2 border-black pb-3 text-center space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 2: งานระบบควบคุมเวอร์ชัน (Version Control System: VCS)
        </h2>
        <p class="text-xs text-gray-700">
          รหัสวิชา 21901-2012 การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม (หน่วยที่ 1 สอนครั้งที่ 1-4)
        </p>
      </div>

      <!-- Student Meta Line -->
      <div class="py-2 text-xs sm:text-sm text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
        <span><strong>ชื่อ-นามสกุล</strong> ..........[นาย/นางสาว นักศึกษา]............</span>
        <span><strong>รหัสนักศึกษา</strong> .....[รหัสประจำตัว]........</span>
        <span><strong>ระดับชั้น</strong> .....ปวช.2/1 สาขาวิชาเทคโนโลยีสารสนเทศ.........</span>
      </div>

      <!-- Instructions Box -->
      <div class="bg-gray-100 p-2.5 rounded border border-gray-300 text-xs text-gray-800 leading-relaxed">
        <strong>คำชี้แจง:</strong> ให้นักศึกษาตอบคำถามเชิงเปรียบเทียบสถาปัตยกรรมระบบควบคุมเวอร์ชัน และบันทึกหลักฐานผลการติดตั้งตั้งค่า Git บนเครื่องคอมพิวเตอร์ของตนเองให้ครบถ้วน
      </div>

      <!-- Section 1 -->
      <div class="space-y-1 pt-1">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          1. ตารางเปรียบเทียบ Centralized VCS (เช่น SVN) กับ Distributed VCS (เช่น Git)
        </h4>
        <table class="w-full text-[11px] border-collapse border border-gray-400 mt-1">
          <thead>
            <tr class="bg-gray-200 text-gray-900">
              <th class="border border-gray-400 p-1 w-1/4">เกณฑ์การพิจารณา</th>
              <th class="border border-gray-400 p-1 w-3/8">Centralized VCS (SVN)</th>
              <th class="border border-gray-400 p-1 w-3/8">Distributed VCS (Git)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 p-1 font-semibold">การจัดเก็บประวัติ</td>
              <td class="border border-gray-400 p-1">เก็บที่เซิร์ฟเวอร์กลางเพียงแห่งเดียว</td>
              <td class="border border-gray-400 p-1">มีประวัติฉบับสมบูรณ์อยู่ในเครื่องนักพัฒนาทุกคน</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-400 p-1 font-semibold">การทำงานแบบออฟไลน์</td>
              <td class="border border-gray-400 p-1">ทำไม่ได้ ต้องต่อเน็ตกับเซิร์ฟเวอร์เสมอ</td>
              <td class="border border-gray-400 p-1">ทำได้สมบูรณ์ สามารถ Commit และแตก Branch ออฟไลน์ได้</td>
            </tr>
            <tr>
              <td class="border border-gray-400 p-1 font-semibold">ความเสี่ยงระบบล่ม</td>
              <td class="border border-gray-400 p-1">มีความเสี่ยงสูงแบบ Single Point of Failure</td>
              <td class="border border-gray-400 p-1">ความเสี่ยงต่ำมาก ทุกเครื่องสามารถใช้เป็น Backup ได้</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section 2 & 3 -->
      <div class="space-y-1.5 pt-2">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          2. ผลการติดตั้งและตั้งค่าเครื่องมือ Git CLI
        </h4>
        <div class="text-xs text-gray-800 space-y-1.5 pl-2">
          <p><strong>2.1 ผลการรันคำสั่งเช็กเวอร์ชัน (git --version):</strong></p>
          <div class="p-2 bg-gray-50 rounded border border-dashed border-gray-300 font-mono text-[11px]">
            $ git --version<br />
            git version 2.45.2.windows.1 [แนบรูปภาพหน้าจอ Terminal]
          </div>
          <p><strong>2.2 ผลการตั้งค่าตัวตนผู้ใช้งาน (git config --list):</strong></p>
          <div class="p-2 bg-gray-50 rounded border border-dashed border-gray-300 font-mono text-[11px]">
            user.name=นายสมชาย ใจดี<br />
            user.email=somchai.j@example.com<br />
            init.defaultbranch=main [แนบรูปภาพหน้าจอผลลัพธ์]
          </div>
        </div>
      </div>

      <!-- Section 4 -->
      <div class="space-y-1 pt-2">
        <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
          3. สรุปประโยชน์ของ Version Control ในการทำงานร่วมกันเป็นทีม
        </h4>
        <div class="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded text-xs text-gray-800 leading-relaxed">
          "ระบบควบคุมเวอร์ชัน (โดยเฉพาะ Git) ช่วยแก้ปัญหาความสับสนของไฟล์งานทับกันได้อย่างมีประสิทธิภาพ ทำให้สมาชิกทุกคนสามารถแยกย้ายกันไปพัฒนาฟีเจอร์ของตนเองบน Branch แยกได้อย่างอิสระโดยไม่ต้องกลัวว่าจะทำโค้ดหลักพัง และเมื่อนำมารวมกัน (Merge) ระบบยังมีกลไกตรวจสอบข้อขัดแย้ง (Conflict) อย่างชัดเจน ช่วยเพิ่มความเร็ว ความมั่นใจ และความสามัคคีในการพัฒนาโครงงานซอฟต์แวร์ร่วมกันเป็นทีมได้อย่างแท้จริง"
        </div>
      </div>
    </AssignmentPdfModal>

  </div>
</template>

<style scoped>
</style>
