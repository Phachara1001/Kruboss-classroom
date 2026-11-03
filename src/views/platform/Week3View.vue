<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GitBranch, GitCommit, GitMerge, GitPullRequest, Terminal, CheckCircle2,
  XCircle, FileText, Upload, Database, Layers, ShieldCheck, Users, Server,
  FileQuestion, ArrowRight, Target, Award, Book, Lightbulb, Gamepad2,
  ListOrdered, ChevronRight, Star, Shuffle, MousePointer2, Code, Settings,
  Cloud, RefreshCw, Clock, Trophy, Lock, Download, Monitor, CheckSquare,
  AlertTriangle, Cpu, Laptop, HardDrive, Share2, HelpCircle,
  FolderArchive, FileX, RotateCcw, AlertOctagon, User, ArrowDown,
  Tag, BookOpen, ExternalLink, Zap, Eye, Play, Sparkles, Folder,
  Check, Copy, FileCode, Sliders, FileSpreadsheet
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Current Course & Week Context
const currentCourseId = '21901-2012'
const currentWeek = 3

// Router
const route = useRoute()
const router = useRouter()

// Modal & Game Config
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จัดกลุ่ม 3 พื้นที่หลักของ Git)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำสั่ง Git Command และหน้าที่)', maxScore: 6, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 3 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
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

// Copy Code Snippet Helper
const copiedSnippet = ref('')
const gitConfigSnippet = `git config --global user.name "Firstname Lastname"
git config --global user.email "student@example.com"
git config --list`
const gitCloneSnippet = 'git clone https://github.com/Phachara1001/workshop1-clonetest.git'

const copyText = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedSnippet.value = id
    setTimeout(() => {
      copiedSnippet.value = ''
    }, 2000)
  })
}

// Active Game Selector
const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'

// Game 1: Drag & Drop (จัดกลุ่ม 3 พื้นที่หลักของ Git)
const dragItemsData = [
  { id: 1, text: 'ไฟล์ที่กำลังเขียนอยู่ใน VS Code', type: 'working' },
  { id: 2, text: 'คำสั่ง git add index.html', type: 'staging' },
  { id: 3, text: 'โฟลเดอร์ซ่อน .git ในเครื่อง', type: 'repo' },
  { id: 4, text: 'ไฟล์ใหม่ที่ยังเป็นสถานะ Untracked', type: 'working' },
  { id: 5, text: 'พื้นที่เตรียมพร้อมก่อนทำ Commit (Index)', type: 'staging' },
  { id: 6, text: 'บันทึกประวัติแบบถาวรด้วย Commit Object', type: 'repo' }
]

const dragZonesData = [
  {
    id: 'working',
    title: '1. Working Directory (พื้นที่ทำงาน)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากข้อความเกี่ยวกับ Working Directory มาที่นี่'
  },
  {
    id: 'staging',
    title: '2. Staging Area (พื้นที่เตรียมจัดเก็บ)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากข้อความเกี่ยวกับ Staging Area มาที่นี่'
  },
  {
    id: 'repo',
    title: '3. Local Repository (ที่เก็บข้อมูลถาวร)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากข้อความเกี่ยวกับ Local Repository มาที่นี่'
  }
]

// Game 2: Matching Game (คำสั่ง Git Command กับหน้าที่การทำงาน)
const matchLeftTerms = [
  { id: 'l1', text: 'git init', match: 'r1' },
  { id: 'l2', text: 'git clone <url>', match: 'r2' },
  { id: 'l3', text: 'git status', match: 'r3' },
  { id: 'l4', text: 'git add <file>', match: 'r4' },
  { id: 'l5', text: 'git commit -m "..."', match: 'r5' },
  { id: 'l6', text: 'git log --oneline', match: 'r6' }
]

const matchRightDefs = [
  { id: 'r1', text: 'เริ่มต้นสร้าง Git Repository เปล่าในโฟลเดอร์ปัจจุบัน' },
  { id: 'r2', text: 'คัดลอก Repository ทั้งหมดจากอินเทอร์เน็ตลงมาที่เครื่อง' },
  { id: 'r3', text: 'ตรวจสอบสถานะไฟล์ใน Working Directory และ Staging Area' },
  { id: 'r4', text: 'ย้ายไฟล์ที่แก้ไขเข้าสู่ Staging Area เพื่อเตรียม Commit' },
  { id: 'r5', text: 'บันทึก Snapshot ประวัติการเปลี่ยนแปลงลง Local Repository' },
  { id: 'r6', text: 'แสดงประวัติการ Commit ย้อนหลังแบบกระชับบรรทัดเดียว' }
]

// Game 3: Post-test 10 ข้อ (ตัวเลือกลวงแนบเนียน ความยาวสมดุล กระจาย A/B/C/D)
const quizQuestions = [
  {
    id: 1,
    question: "โครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees) ของ Git ในเครื่องคอมพิวเตอร์ประกอบด้วยส่วนใดบ้างตามลำดับการทำงาน?",
    options: [
      { id: 'a', text: "Working Directory, Remote Repository, และ Staging Area", isCorrect: false },
      { id: 'b', text: "Staging Area, Working Directory, และ Git Archive", isCorrect: false },
      { id: 'c', text: "Working Directory, Staging Area, และ Local Repository", isCorrect: true },
      { id: 'd', text: "Working Directory, Commit Cache, และ Cloud Repository", isCorrect: false }
    ],
    explanation: "สถาปัตยกรรม 3 พื้นที่หลักของ Git ทำงานเรียงลำดับจาก Working Directory (พื้นที่แก้ไขไฟล์จริง) -> Staging Area (พื้นที่เตรียมพร้อมและคัดเลือกไฟล์) -> Local Repository (พื้นที่จัดเก็บ Snapshot ถาวรในโฟลเดอร์ .git)"
  },
  {
    id: 2,
    question: "คำสั่งใดใช้สำหรับเริ่มต้นสร้าง Git Repository ขึ้นใหม่ในโฟลเดอร์โปรเจกต์ปัจจุบัน?",
    options: [
      { id: 'a', text: "git init", isCorrect: true },
      { id: 'b', text: "git start", isCorrect: false },
      { id: 'c', text: "git setup", isCorrect: false },
      { id: 'd', text: "git create", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git init' (ย่อมาจาก initialize) ใช้สร้างโฟลเดอร์ซ่อนชื่อ .git ขึ้นมาเพื่อเริ่มติดตามการเปลี่ยนแปลงไฟล์ในโฟลเดอร์นั้น"
  },
  {
    id: 3,
    question: "หากต้องการกำหนดชื่อและอีเมลของผู้พัฒนาสำหรับใช้บันทึกประวัติการ Commit ในเครื่องเป็นค่าเริ่มต้นทุกโปรเจกต์ ต้องใช้คำสั่งใด?",
    options: [
      { id: 'a', text: "git config --system author.name \"ชื่อ\" และ author.email \"อีเมล\"", isCorrect: false },
      { id: 'b', text: "git set-identity --default user.name \"ชื่อ\" และ user.email \"อีเมล\"", isCorrect: false },
      { id: 'c', text: "git profile --all user.name \"ชื่อ\" และ user.email \"อีเมล\"", isCorrect: false },
      { id: 'd', text: "git config --global user.name \"ชื่อ\" และ git config --global user.email \"อีเมล\"", isCorrect: true }
    ],
    explanation: "Git บันทึกประวัติว่าใครแก้ไขด้วย user.name และ user.email ผ่านคำสั่ง git config --global เพื่อใช้เป็นค่าตั้งต้นร่วมกันทุกโปรเจกต์ในเครื่อง"
  },
  {
    id: 4,
    question: "โฟลเดอร์ใดทำหน้าที่เป็นพื้นที่จัดเก็บประวัติ Commit, ข้อมูล Object, และการตั้งค่าทั้งหมดของ Local Repository?",
    options: [
      { id: 'a', text: "โฟลเดอร์ .github/", isCorrect: false },
      { id: 'b', text: "โฟลเดอร์ .git/", isCorrect: true },
      { id: 'c', text: "โฟลเดอร์ .stage/", isCorrect: false },
      { id: 'd', text: "โฟลเดอร์ .repo/", isCorrect: false }
    ],
    explanation: "โฟลเดอร์ .git/ เป็นโฟลเดอร์ซ่อนที่เก็บฐานข้อมูล Snapshot, HEAD, Object และ Config ทั้งหมดของ Git หากลบโฟลเดอร์นี้ประวัติ Git จะหายทันที"
  },
  {
    id: 5,
    question: "เมื่อผู้พัฒนาสร้างไฟล์โค้ดใหม่ขึ้นมาในโฟลเดอร์โปรเจกต์ แต่ยังไม่ได้สั่งคำสั่ง Git ใดๆ ไฟล์นั้นจะอยู่ในสถานะใด?",
    options: [
      { id: 'a', text: "Untracked (ยังไม่ได้รับการติดตาม)", isCorrect: true },
      { id: 'b', text: "Modified (ไฟล์ได้รับการแก้ไข)", isCorrect: false },
      { id: 'c', text: "Unstaged (ไฟล์รอการเตรียมพร้อม)", isCorrect: false },
      { id: 'd', text: "Ignored (ไฟล์ถูกละเว้นถาวร)", isCorrect: false }
    ],
    explanation: "ไฟล์ที่สร้างขึ้นใหม่เอี่ยม Git จะมองเห็นเป็น Untracked หมายถึง Git รับรู้ว่ามีไฟล์นี้อยู่แต่ยังไม่ได้เริ่มติดตามบันทึกเวอร์ชัน"
  },
  {
    id: 6,
    question: "หากต้องการนำไฟล์ที่แก้ไขแล้วเข้าสู่ Staging Area เพื่อคัดเลือกเตรียมพร้อมสำหรับการบันทึก Snapshot ต้องใช้คำสั่งใด?",
    options: [
      { id: 'a', text: "git commit <ชื่อไฟล์>", isCorrect: false },
      { id: 'b', text: "git stage <ชื่อไฟล์>", isCorrect: false },
      { id: 'c', text: "git track <ชื่อไฟล์>", isCorrect: false },
      { id: 'd', text: "git add <ชื่อไฟล์>", isCorrect: true }
    ],
    explanation: "คำสั่ง 'git add' ทำหน้าที่หยิบไฟล์จาก Working Directory เข้าไปวางไว้ใน Staging Area (Index) เพื่อเตรียม Commit"
  },
  {
    id: 7,
    question: "ข้อใดอธิบายวัตถุประสงค์หลักของการกำหนดไฟล์ '.gitignore' ในโปรเจกต์ได้อย่างถูกต้องที่สุด?",
    options: [
      { id: 'a', text: "ป้องกันไม่ให้สมาชิกคนอื่นในทีมดึงไฟล์โค้ดไปแก้ไขโดยไม่ได้รับอนุญาต", isCorrect: false },
      { id: 'b', text: "ระบุรายชื่อไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้ระบบ Git ติดตามและนำขึ้นระบบ", isCorrect: true },
      { id: 'c', text: "ซ่อนไฟล์สำคัญไม่ให้แสดงบนโปรแกรมแก้ไขโค้ดเพื่อความปลอดภัยของข้อมูล", isCorrect: false },
      { id: 'd', text: "ลบไฟล์ขยะและไฟล์ชั่วคราวออกจากระบบฮาร์ดดิสก์โดยอัตโนมัติเมื่อสั่งรันโปรแกรม", isCorrect: false }
    ],
    explanation: ".gitignore ทำหน้าที่บอกให้ Git เพิกเฉยต่อไฟล์ที่ไม่ควรขึ้นระบบ เช่น ไฟล์ชั่วคราว, ค่า Config ส่วนตัว (.env), และโฟลเดอร์ดาวน์โหลด (node_modules)"
  },
  {
    id: 8,
    question: "ตามแนวคิด Atomic Commit และมาตรฐาน Conventional Commits ข้อใดคือแนวปฏิบัติที่ดีในการบันทึก Commit?",
    options: [
      { id: 'a', text: "รวบรวมงานทั้งหมดที่ทำตลอดสัปดาห์ไว้ใน Commit เดียวเพื่อลดประวัติที่ซ้ำซ้อน", isCorrect: false },
      { id: 'b', text: "บันทึก Commit ทุกครั้งที่กดปุ่ม Save ใน Text Editor เพื่อบันทึกงานให้ละเอียดที่สุด", isCorrect: false },
      { id: 'c', text: "แยกการบันทึกแต่ละ Commit ตามงานย่อยที่สมบูรณ์ในตัวเองพร้อมข้อความที่ชัดเจน", isCorrect: true },
      { id: 'd', text: "บันทึกเฉพาะไฟล์โค้ดส่วนของโปรแกรมหลักเท่านั้น ส่วนไฟล์เอกสารไม่ต้องทำ Commit", isCorrect: false }
    ],
    explanation: "หลักการ Atomic Commit และ Conventional Commits (เช่น feat:, fix:, docs:) ช่วยให้ย้อนประวัติ ตรวจสอบสาเหตุบั๊ก และทำงานร่วมกันในทีมได้อย่างมีประสิทธิภาพ"
  },
  {
    id: 9,
    question: "คำสั่งใดใช้สำหรับตรวจสอบสถานะปัจจุบันของไฟล์ในโปรเจกต์ ทั้งไฟล์ที่แก้ไขแล้ว ไฟล์ที่อยู่ใน Staging และไฟล์ที่ยังไม่ถูกติดตาม?",
    options: [
      { id: 'a', text: "git log", isCorrect: false },
      { id: 'b', text: "git diff", isCorrect: false },
      { id: 'c', text: "git show", isCorrect: false },
      { id: 'd', text: "git status", isCorrect: true }
    ],
    explanation: "คำสั่ง 'git status' เป็นคำสั่งพื้นฐานที่ใช้บ่อยที่สุดเพื่อตรวจดูสถานะของไฟล์ในแต่ละพื้นที่ก่อนทำคำสั่งถัดไป"
  },
  {
    id: 10,
    question: "หากต้องการคัดลอก Remote Repository จากเซิร์ฟเวอร์ (เช่น GitHub หรือ GitLab) ลงมาสร้างเป็น Local Repository ในเครื่องคอมพิวเตอร์ ต้องใช้คำสั่งใด?",
    options: [
      { id: 'a', text: "git clone <url>", isCorrect: true },
      { id: 'b', text: "git pull <url>", isCorrect: false },
      { id: 'c', text: "git fetch <url>", isCorrect: false },
      { id: 'd', text: "git checkout <url>", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git clone <url>' ใช้คัดลอก Repository ทางไกล (Remote Repository) พร้อมประวัติการ Commit ทั้งหมดลงมาเป็น Local Repository ในเครื่องของเราทันที"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header Banner (ตามดีไซน์มาตรฐานของวิชา Platform เช่นเดียวกับสัปดาห์ที่ 2) -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-indigo-500">
        <GitBranch class="w-[420px] h-[420px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <div class="flex items-center gap-2 mb-4">
          <span
            class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider shadow-sm">
            สัปดาห์ที่ 3
          </span>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
            หน่วยที่ 1 (สอนครั้งที่ 1-4)
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-indigo-950 mb-4 leading-tight">
          หลักการพื้นฐานของกิต (GIT)<br />
          <span class="text-2xl md:text-3xl text-indigo-700">และพื้นที่เก็บข้อมูล (Repository)</span>
        </h1>
        <p class="text-gray-600 text-base md:text-lg leading-relaxed">
          ศึกษาโครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees of Git), วงจรชีวิตของไฟล์ (File Lifecycle States),
          การกำหนดค่าตัวตน Identity, การสร้างและโคลน Repository, การกำหนดไฟล์ .gitignore และการบันทึกประวัติการพัฒนาด้วย
          Commit มาตรฐาน
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :course-id="currentCourseId" :week-number="currentWeek" />

    <!-- Unit Objectives & Competencies (อิงตามแผนการจัดการเรียนรู้ประจำหน่วย) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">แผนการจัดการเรียนรู้และจุดประสงค์ประจำหน่วย</h2>
          <p class="text-sm text-gray-500 mt-0.5">หน่วยที่ 1: พื้นฐาน DevOps และระบบควบคุมเวอร์ชัน (ทฤษฎี 4 ชม. ปฏิบัติ
            8 ชม.)</p>
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
                ผู้เรียนสามารถอธิบายสถาปัตยกรรม 3 พื้นที่หลักของ Git และวงจรชีวิตของไฟล์ได้อย่างถูกต้อง
                ตลอดจนสามารถเริ่มต้นสร้าง Local Repository, กำหนดค่าไฟล์ .gitignore และบันทึกประวัติการพัฒนาด้วย Commit
                ได้อย่างมีประสิทธิภาพ
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
                แสดงความรู้และทักษะการใช้งานคำสั่งพื้นฐานของ Git ในการจัดการพื้นที่เก็บข้อมูล (Repository)
                และควบคุมวงจรชีวิตของไฟล์ได้อย่างถูกต้องตามมาตรฐาน
              </p>
            </div>
          </div>

          <!-- 3. จุดประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-purple-700 font-bold">
                <CheckCircle2 class="w-5 h-5 shrink-0" />
                <span>3. จุดประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4">
                <li>อธิบายความแตกต่างระหว่าง Working Directory, Staging Area และ Local Repository ได้</li>
                <li>สร้าง Repository ด้วย git init และ git clone พร้อมตั้งค่า Git Identity ได้ถูกต้อง</li>
                <li>กำหนดข้อยกเว้นไฟล์ด้วย .gitignore และบันทึกประวัติด้วย Commit Message ที่สื่อความหมายได้</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 4 Sub-topics Badge List -->
        <div class="pt-4 border-t border-gray-100">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            โครงสร้างสาระการเรียนรู้สัปดาห์ที่ 3 (4 หัวข้อหลัก):
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span class="font-medium text-gray-800">สถาปัตยกรรม 3 พื้นที่หลักของ Git</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span class="font-medium text-gray-800">การสร้าง & โคลน Repository (.git)</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span class="font-medium text-gray-800">วงจรชีวิตของไฟล์ และ .gitignore</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span class="font-medium text-gray-800">การบันทึกประวัติ Commit & Log</span>
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

      <div
        class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-indigo-100 space-y-12 text-gray-700 leading-relaxed">

        <!-- Topic 1: สถาปัตยกรรม 3 พื้นที่หลักของ Git (Three Trees Architecture) -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 1: สถาปัตยกรรม 3 พื้นที่หลักของกิต (The Three Trees of Git)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            จุดแข็งและกลไกสำคัญที่สุดของ Git คือการไม่บันทึกไฟล์สุ่มสี่สุ่มห้า แต่แบ่งสถานะและพื้นที่การทำงานออกเป็น
            <strong>3 พื้นที่ (Three Areas)</strong> บนเครื่องคอมพิวเตอร์ของนักพัฒนา
            ทำให้เราสามารถเลือกจัดคิวเฉพาะไฟล์ที่ต้องการ เพื่อสร้างประวัติโค้ดที่สะอาด เป็นระเบียบ
            และสามารถย้อนดูได้ตลอดเวลา:
          </p>

          <!-- 3 Areas Visual Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <!-- Area 1: Working Directory -->
            <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 relative">
              <div
                class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Laptop class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">พื้นที่ที่ 1</span>
                <h4 class="text-base font-bold text-blue-950">Working Directory (พื้นที่ทำงาน)</h4>
                <p class="text-xs sm:text-sm text-blue-900/80 mt-1 leading-relaxed">
                  โฟลเดอร์ไฟล์งานจริงในเครื่องที่เราเปิดเขียนโค้ดด้วย VS Code มีการแก้ไข ลบ หรือเพิ่มไฟล์ใหม่ตลอดเวลา
                </p>
              </div>
              <div class="pt-2 border-t border-blue-200/80 text-[11px] text-blue-800 font-mono font-bold">
                สถานะ: Untracked / Modified
              </div>
            </div>

            <!-- Area 2: Staging Area -->
            <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 relative">
              <div
                class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Layers class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">พื้นที่ที่ 2</span>
                <h4 class="text-base font-bold text-amber-950">Staging Area (พื้นที่เตรียมจัดเก็บ)</h4>
                <p class="text-xs sm:text-sm text-amber-900/80 mt-1 leading-relaxed">
                  จุดพักไฟล์หรือพื้นที่คัดเลือก เปรียบเสมือนกล่องพัสดุที่กำลังแพ็กของ เราสั่ง <code
                    class="font-bold">git add</code> เพื่อนำเฉพาะไฟล์ที่พร้อมส่งเข้ามารอไว้
                </p>
              </div>
              <div class="pt-2 border-t border-amber-200/80 text-[11px] text-amber-800 font-mono font-bold">
                คำสั่ง: git add &lt;file&gt;
              </div>
            </div>

            <!-- Area 3: Local Repository -->
            <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 relative">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Database class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">พื้นที่ที่ 3</span>
                <h4 class="text-base font-bold text-emerald-950">Local Repository (.git)</h4>
                <p class="text-xs sm:text-sm text-emerald-900/80 mt-1 leading-relaxed">
                  ฐานข้อมูลประวัติถาวรที่ถูกปิดผนึกไว้ในโฟลเดอร์ซ่อน <code class="font-bold">.git/</code> เมื่อเราสั่ง
                  <code class="font-bold">git commit</code> ข้อมูลจะถูกบันทึกเป็น Snapshot ทันที
                </p>
              </div>
              <div class="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-mono font-bold">
                คำสั่ง: git commit -m "..."
              </div>
            </div>
          </div>

          <!-- Architecture Flow Pipeline -->
          <div class="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-sm">
            <div class="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Terminal class="w-4 h-4 text-cyan-400" />
              <span>แผนภาพวงจรการเดินทางของข้อมูลใน Git (Git Data Flow Pipeline)</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
              <div class="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div class="font-bold text-blue-400">1. Working Directory</div>
                <div class="text-[11px] text-slate-400 mt-1">เขียนโค้ด / แก้ไขไฟล์จริง</div>
              </div>
              <div class="p-4 bg-slate-800 rounded-xl border border-slate-700 relative">
                <div class="font-mono text-cyan-300 font-bold mb-1">➔ git add ➔</div>
                <div class="font-bold text-amber-400">2. Staging Area</div>
                <div class="text-[11px] text-slate-400 mt-1">เตรียมข้อมูลเป็น Snapshot</div>
              </div>
              <div class="p-4 bg-slate-800 rounded-xl border border-slate-700 relative">
                <div class="font-mono text-cyan-300 font-bold mb-1">➔ git commit ➔</div>
                <div class="font-bold text-emerald-400">3. Local Repository</div>
                <div class="text-[11px] text-slate-400 mt-1">บันทึกถาวรลง .git</div>
              </div>
              <div class="p-4 bg-slate-800 rounded-xl border border-slate-700 relative">
                <div class="font-mono text-cyan-300 font-bold mb-1">➔ git push ➔</div>
                <div class="font-bold text-purple-400">4. Remote (GitHub)</div>
                <div class="text-[11px] text-slate-400 mt-1">แชร์ให้ทีมบนคลาวด์</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 2: การตั้งค่า Identity และการสร้างหรือโคลน Repository -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 2: การตั้งค่าระบุตัวตน และการเริ่มต้นสร้างหรือโคลน Repository
          </h3>
          <p class="mb-5 text-base text-gray-700 leading-relaxed">
            ขั้นตอนปฏิบัติจริงด้วย Command Line สำหรับการเริ่มต้นใช้งาน Git ครั้งแรกบนเครื่องคอมพิวเตอร์:
          </p>

          <!-- Step 1: Config Identity -->
          <div class="space-y-3 mb-6">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <User class="w-4 h-4 text-indigo-600" />
              ขั้นตอนที่ 1: การตั้งค่าระบุตัวตนผู้ใช้ (Git Identity Configuration)
            </h4>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
              ก่อนเริ่ม Commit งาน Git บังคับให้เราระบุ <strong>ชื่อ</strong> และ <strong>อีเมล</strong>
              เพื่อใช้แปะป้ายกำกับในทุก Commit ว่าใครเป็นผู้แก้ไข:
            </p>

            <div class="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 relative shadow-inner">
              <button @click="copyText(gitConfigSnippet, 'cfg')"
                class="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer">
                <Check v-if="copiedSnippet === 'cfg'" class="w-3 h-3 text-emerald-400" />
                <Copy v-else class="w-3 h-3" />
                <span>{{ copiedSnippet === 'cfg' ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด' }}</span>
              </button>
              <div><span class="text-slate-500"># 1. กำหนดชื่อ-สกุลภาษาอังกฤษ</span></div>
              <div class="text-cyan-300">git config --global user.name "Firstname Lastname"</div>
              <div><span class="text-slate-500"># 2. กำหนดอีเมล (ใช้อีเมลเดียวกับที่ใช้สมัคร GitHub)</span></div>
              <div class="text-cyan-300">git config --global user.email "student@example.com"</div>
              <div><span class="text-slate-500"># 3. ตรวจสอบการตั้งค่าทั้งหมด</span></div>
              <div class="text-amber-300">git config --list</div>
            </div>
          </div>

          <!-- Step 2: 2 Ways to get a Repository -->
          <div class="space-y-4 mb-6">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <Folder class="w-4 h-4 text-indigo-600" />
              ขั้นตอนที่ 2: 2 วิธีในการได้มาซึ่ง Git Repository
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Way A: git init -->
              <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">วิธีที่ 1:
                    สร้างขึ้นเองในเครื่อง</span>
                  <Code class="w-4 h-4 text-indigo-600" />
                </div>
                <h5 class="font-bold text-slate-900 text-sm">คำสั่ง: git init</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ใช้เมื่อเรามีโฟลเดอร์โปรเจกต์อยู่ในเครื่องแล้ว และต้องการเปลี่ยนให้กลายเป็น Git Repository:
                </p>
                <div class="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs">
                  cd my-project<br />
                  git init
                </div>
                <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ระบบจะสร้างโฟลเดอร์ซ่อนชื่อ <code class="font-bold">.git/</code> ขึ้นมาทันที</span>
                </div>
              </div>

              <!-- Way B: git clone -->
              <div class="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs">วิธีที่ 2:
                    โคลนจากคลาวด์</span>
                  <Cloud class="w-4 h-4 text-cyan-600" />
                </div>
                <h5 class="font-bold text-slate-900 text-sm">คำสั่ง: git clone &lt;url&gt;</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ใช้เมื่อมี Repository อยู่บน GitHub/GitLab แล้ว และต้องการคัดลอกโค้ดพร้อมประวัติทั้งหมดลงมาที่เครื่อง:
                </p>

                <!-- Workshop Clone Box -->
                <div class="p-3.5 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                  <div
                    class="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span class="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Terminal class="w-3.5 h-3.5" /> ตัวอย่างคำสั่งทดลองปฏิบัติ (Workshop Clone)
                    </span>
                    <button @click="copyText(gitCloneSnippet, 'clone-box')"
                      class="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <Check v-if="copiedSnippet === 'clone-box'" class="w-3.5 h-3.5 text-emerald-400" />
                      <Copy v-else class="w-3.5 h-3.5" />
                      <span>{{ copiedSnippet === 'clone-box' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง' }}</span>
                    </button>
                  </div>
                  <div class="font-mono text-xs text-cyan-300 selection:bg-cyan-900 break-all">
                    git clone https://github.com/Phachara1001/workshop1-clonetest.git
                  </div>
                  <div class="font-mono text-xs text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                    <div class="text-[11px] text-slate-400 font-sans">เมื่อโคลนเสร็จให้เข้าไปตรวจดูประวัติ Commit:</div>
                    <div class="text-cyan-200">cd workshop1-clonetest</div>
                    <div class="text-cyan-200">git log --oneline</div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px] pt-1">
                  <span class="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ได้ทั้งโค้ด ประวัติ และการเชื่อมโยงกับ Remote ทันที</span>
                  </span>
                  <a href="https://github.com/Phachara1001/workshop1-clonetest" target="_blank"
                    rel="noopener noreferrer"
                    class="text-cyan-700 hover:text-cyan-800 font-bold inline-flex items-center gap-1 hover:underline">
                    <span>เปิดดูบน GitHub</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: .gitignore file -->
          <div class="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-amber-600" />
              ความสำคัญของไฟล์ .gitignore (การละเว้นไฟล์ที่ไม่ต้องการขึ้นระบบ)
            </h4>
            <p class="text-xs text-amber-900/90 leading-relaxed">
              ในโปรเจกต์จะมีไฟล์บางประเภทที่<strong>ห้ามนำเข้า Git เด็ดขาด</strong> เช่น รหัสผ่าน/API Key ในไฟล์ <code
                class="font-bold">.env</code>, โฟลเดอร์ไลบรารีขนาดใหญ่ <code class="font-bold">node_modules/</code>,
              หรือไฟล์คอมไพล์ <code class="font-bold">dist/</code> เราจึงต้องสร้างไฟล์ชื่อ <code
                class="font-bold">.gitignore</code> วางไว้ที่รูทของโปรเจกต์:
            </p>
            <div class="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs leading-relaxed">
              # ละเว้นโฟลเดอร์ไลบรารี<br />
              node_modules/<br />
              # ละเว้นไฟล์เก็บความลับ<br />
              .env<br />
              # ละเว้นไฟล์ของระบบปฏิบัติการ<br />
              .DS_Store<br />
              Thumbs.db
            </div>
          </div>
        </div>

        <!-- Topic 3: วงจรชีวิตของไฟล์ใน Git (File Lifecycle) -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 3: วงจรชีวิตของไฟล์ใน Git (File Lifecycle States) และการใช้งาน .gitignore
          </h3>
          <p class="mb-5 text-base text-gray-700 leading-relaxed">
            ไฟล์แต่ละไฟล์ใน Working Directory จะหมุนเวียนอยู่ในสถานะใดสถานะหนึ่งจาก 4 สถานะหลัก ดังนี้:
          </p>

          <!-- 4 Lifecycle States Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">สถานะที่ 1</span>
              <h5 class="font-bold text-slate-900 text-sm">Untracked</h5>
              <p class="text-xs text-slate-600 leading-relaxed">
                ไฟล์ที่เพิ่งสร้างขึ้นมาใหม่ในโฟลเดอร์ Git ยังไม่เคยบันทึกประวัติมาก่อน
              </p>
              <div class="text-[11px] font-mono text-indigo-600 font-bold">➔ ใช้ git add เพื่อเริ่มติดตาม</div>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">สถานะที่ 2</span>
              <h5 class="font-bold text-slate-900 text-sm">Modified</h5>
              <p class="text-xs text-slate-600 leading-relaxed">
                ไฟล์ที่มีการติดตามอยู่แล้ว แต่มีเนื้อหาถูกแก้ไขเพิ่มเติม ยังไม่ได้เข้า Staging
              </p>
              <div class="text-[11px] font-mono text-indigo-600 font-bold">➔ ใช้ git add เพื่อนำเข้าคิว</div>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">สถานะที่ 3</span>
              <h5 class="font-bold text-slate-900 text-sm">Staged</h5>
              <p class="text-xs text-slate-600 leading-relaxed">
                ไฟล์ที่ถูกเลือกเข้า Staging Area พร้อมสำหรับการสร้าง Commit ครั้งถัดไป
              </p>
              <div class="text-[11px] font-mono text-emerald-600 font-bold">➔ ใช้ git commit เพื่อบันทึก</div>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">สถานะที่ 4</span>
              <h5 class="font-bold text-slate-900 text-sm">Unmodified</h5>
              <p class="text-xs text-slate-600 leading-relaxed">
                ไฟล์ที่บันทึก Commit ถาวรแล้ว และเนื้อหาปัจจุบันตรงกับใน Snapshot ทุกประการ
              </p>
              <div class="text-[11px] font-mono text-slate-500 font-bold">✓ สะอาด พร้อมทำงานต่อ</div>
            </div>
          </div>

          <!-- git status command example -->
          <div class="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal class="w-3.5 h-3.5" /> ตัวอย่างการตรวจสอบสถานะด้วย git status
              </span>
            </div>
            <div class="text-emerald-400">$ git status</div>
            <div class="text-slate-400 leading-relaxed">
              On branch main<br />
              <span class="text-emerald-400">Changes to be committed:</span> (ไฟล์ใน Staging Area - สีเขียว)<br />
              &nbsp;&nbsp;new file: index.html<br />
              <br />
              <span class="text-rose-400">Untracked files:</span> (ไฟล์ใหม่ที่ยังไม่ได้ add - สีแดง)<br />
              &nbsp;&nbsp;style.css<br />
            </div>
          </div>

        </div>

        <!-- Topic 4: การสร้าง Commit มาตรฐาน และการเรียกดูประวัติ -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 4: การเช็คอินเวอร์ชัน (Check-in Workflow) และการบันทึก Commit มาตรฐาน
          </h3>

          <!-- Workflow: เมื่อทำงานเสร็จในแต่ละรอบ (Check-in Workflow) -->
          <div
            class="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div class="space-y-1">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs inline-flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" /> ขั้นตอนปฏิบัติมาตรฐาน (Standard Workflow)
                </span>
                <h4 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>กระบวนการเช็คอินเวอร์ชัน: เมื่อเขียนโค้ดเสร็จในแต่ละรอบ</span>
                </h4>
                <p class="text-xs text-slate-300">
                  ทุกครั้งที่ทำงานเสร็จ 1 ฟังก์ชันหรือแก้บั๊กเสร็จ 1 จุด ให้รัน 4 สเต็ปนี้ตามลำดับ ห้ามข้ามขั้นตอน
                </p>
              </div>
              <span
                class="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white/10 text-cyan-300 self-start sm:self-auto shrink-0 border border-white/10">
                4 Steps Check-in
              </span>
            </div>

            <!-- 4 Steps: 2-Column Cards (Left: Command, Right: Explanation & Purpose) -->
            <div class="space-y-3.5">

              <!-- Step 1: git status -->
              <div
                class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <!-- Left: Command -->
                <div
                  class="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div class="flex items-center justify-between">
                    <span
                      class="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                    <span class="text-[11px] font-bold text-cyan-400 font-mono">สเต็ปที่ 1: ตรวจสอบสถานะ</span>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 flex items-center gap-2">
                    <span class="text-slate-500 select-none">$</span>
                    <span class="font-bold">git status</span>
                  </div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span>มองหาไฟล์ที่มีการแก้ไข (จะแสดงเป็น <strong class="text-rose-400">สีแดง</strong>)</span>
                  </div>
                </div>
                <!-- Right: Explanation & Purpose -->
                <div
                  class="md:col-span-7 p-4 rounded-xl bg-white text-slate-800 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div>
                    <span class="font-bold text-xs text-indigo-900 flex items-center gap-1.5 mb-1">
                      <Terminal class="w-3.5 h-3.5 text-indigo-600" /> แยกคำสั่ง: <code
                        class="font-mono text-indigo-700 bg-indigo-50 px-1 rounded">git status</code>
                    </span>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      ใช้สั่งให้ Git ตรวจสอบโฟลเดอร์ทำงาน (Working Directory) ว่ามีไฟล์ใดถูกสร้างขึ้นใหม่ (Untracked)
                      หรือไฟล์ใดถูกแก้ไขเนื้อหา (Modified) ไปบ้าง
                    </p>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                    <span class="font-bold block text-amber-900">จุดประสงค์ของขั้นตอนนี้:</span>
                    <p class="leading-relaxed">
                      เพื่อตรวจดูความเรียบร้อยก่อนแอดไฟล์ ป้องกันการลืมว่าเราแตะไฟล์ไหนไปบ้าง
                      และเช็กว่าไม่มีไฟล์ขยะที่ไม่ต้องการหลุดเข้ามา
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 2: git add . -->
              <div
                class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <!-- Left: Command -->
                <div
                  class="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div class="flex items-center justify-between">
                    <span
                      class="w-6 h-6 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center">2</span>
                    <span class="text-[11px] font-bold text-blue-400 font-mono">สเต็ปที่ 2: รวบรวมเข้าคิว</span>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-blue-300 flex items-center gap-2">
                    <span class="text-slate-500 select-none">$</span>
                    <span class="font-bold">git add .</span>
                  </div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                    <span>หยิบทุกลูกไฟล์ในโฟลเดอร์นี้ขึ้นมาวางบนสายพาน</span>
                  </div>
                </div>
                <!-- Right: Explanation & Purpose -->
                <div
                  class="md:col-span-7 p-4 rounded-xl bg-white text-slate-800 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div>
                    <span class="font-bold text-xs text-blue-900 flex items-center gap-1.5 mb-1">
                      <Code class="w-3.5 h-3.5 text-blue-600" /> แยกคำสั่ง: <code
                        class="font-mono text-blue-700 bg-blue-50 px-1 rounded">add</code> + <code
                        class="font-mono text-amber-700 bg-amber-50 px-1 rounded">. (จุด)</code>
                    </span>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      <code class="font-bold">add</code> คือคำสั่งนำไฟล์เข้าสู่ Staging Area ส่วนเครื่องหมายจุด <code
                        class="font-bold">.</code> หมายถึง Current Directory
                      คือสั่งรวมทุกลูกไฟล์ที่มีการแก้ไขในโฟลเดอร์นี้ทั้งหมด
                    </p>
                  </div>
                  <div class="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-950 space-y-0.5">
                    <span class="font-bold block text-blue-900">จุดประสงค์ของขั้นตอนนี้:</span>
                    <p class="leading-relaxed">
                      เพื่อจัดกลุ่มและเตรียมไฟล์ทั้งหมดให้พร้อมสำหรับการทำ Snapshot
                      (เหมือนการคัดเลือกและจัดของลงกล่องพัสดุก่อนปิดกล่อง)
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3: git status เพื่อเช็คซ้ำอีกที -->
              <div
                class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <!-- Left: Command -->
                <div
                  class="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div class="flex items-center justify-between">
                    <span
                      class="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
                    <span class="text-[11px] font-bold text-amber-400 font-mono">สเต็ปที่ 3: เช็คซ้ำอีกที
                      (Re-check)</span>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <span class="text-slate-500 select-none">$</span>
                    <span class="font-bold">git status</span>
                  </div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>ตรวจดูว่าไฟล์เปลี่ยนเป็น <strong class="text-emerald-400">สีเขียว</strong> แล้วหรือไม่</span>
                  </div>
                </div>
                <!-- Right: Explanation & Purpose -->
                <div
                  class="md:col-span-7 p-4 rounded-xl bg-white text-slate-800 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div>
                    <span class="font-bold text-xs text-amber-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 class="w-3.5 h-3.5 text-amber-600" /> ตรวจสอบความพร้อม: <code
                        class="font-mono text-amber-700 bg-amber-50 px-1 rounded">git status</code> รอบที่สอง
                    </span>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      สั่งตรวจสถานะซ้ำอีกครั้งหลังจากรันคำสั่ง <code class="font-bold">git add .</code> ไปแล้ว
                      เพื่อดูรายการในหมวด <em class="text-emerald-700 font-semibold font-mono">Changes to be
                        committed</em>
                    </p>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 space-y-0.5">
                    <span class="font-bold block text-emerald-900">จุดประสงค์ของขั้นตอนนี้ (สำคัญมาก!):</span>
                    <p class="leading-relaxed">
                      เพื่อ Re-check ยืนยันความมั่นใจว่าไฟล์ทั้งหมดเปลี่ยนเป็น <strong>สีเขียว</strong> ครบถ้วนแล้ว
                      และตรวจดูว่ามีไฟล์ที่ไม่ควรขึ้นระบบ (เช่น ไฟล์รหัสผ่าน, ไฟล์ขยะ) เผลอติดเข้ามาด้วยหรือไม่
                      ก่อนจะกดบันทึกจริง
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 4: git commit -m "ข้อความ" -->
              <div
                class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <!-- Left: Command -->
                <div
                  class="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div class="flex items-center justify-between">
                    <span
                      class="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">4</span>
                    <span class="text-[11px] font-bold text-emerald-400 font-mono">สเต็ปที่ 4: บันทึกจุดเซฟถาวร</span>
                  </div>
                  <div
                    class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
                    <span class="text-slate-500 select-none">$</span>
                    <span class="font-bold break-all">git commit -m "ข้อความ"</span>
                  </div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>ได้จุดเซฟ Snapshot พร้อมรหัส Commit Hash ประจำรอบ</span>
                  </div>
                </div>
                <!-- Right: Explanation & Purpose -->
                <div
                  class="md:col-span-7 p-4 rounded-xl bg-white text-slate-800 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div>
                    <span class="font-bold text-xs text-emerald-900 flex items-center gap-1.5 mb-1">
                      <GitCommit class="w-3.5 h-3.5 text-emerald-600" /> แยกคำสั่ง: <code
                        class="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">commit</code> + <code
                        class="font-mono text-teal-700 bg-teal-50 px-1 rounded">-m "ข้อความ"</code>
                    </span>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      <code class="font-bold">commit</code> คือสั่งบันทึกสถานะไฟล์ปัจจุบันลงสู่โฟลเดอร์ <code
                        class="font-bold">.git/</code> อย่างถาวร และ <code class="font-bold">-m</code>
                      คือระบุข้อความอธิบายความเปลี่ยนแปลงกำกับไว้
                    </p>
                  </div>
                  <div class="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-[11px] text-teal-950 space-y-0.5">
                    <span class="font-bold block text-teal-900">จุดประสงค์ของขั้นตอนนี้:</span>
                    <p class="leading-relaxed">
                      บันทึกหมุดหมายประวัติการพัฒนาโค้ด เพื่อให้เราและเพื่อนร่วมทีมสามารถตรวจสอบ ย้อนดู
                      และกู้คืนโค้ดกลับมาได้เสมอเมื่อเกิดข้อผิดพลาด
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Conventional Commits Guide -->
          <div class="space-y-3 mb-6">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommit class="w-4 h-4 text-emerald-600" />
              โครงสร้างของคำสั่ง Commit และรูปแบบ Conventional Commits
            </h4>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
              คำสั่ง <code class="font-bold font-mono">git commit -m "ข้อความ"</code> เป็นการสร้างจุดเซฟ (Snapshot)
              ประจำโปรเจกต์ โดยมีคำนำหน้ามาตรฐานที่นิยมใช้ในระดับสากลดังนี้:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">feat:</span>
                <p class="text-slate-600 text-[11px]">เพิ่มฟีเจอร์ใหม่ เช่น <code
                    class="text-slate-800">feat: add login</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">fix:</span>
                <p class="text-slate-600 text-[11px]">แก้ไขบั๊ก เช่น <code
                    class="text-slate-800">fix: header overflow</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">docs:</span>
                <p class="text-slate-600 text-[11px]">แก้ไขเอกสารหรือ README เช่น <code
                    class="text-slate-800">docs: update api</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">refactor:</span>
                <p class="text-slate-600 text-[11px]">ปรับปรุงโค้ดให้สะอาดขึ้นโดยผลลัพธ์คงเดิม</p>
              </div>
            </div>
          </div>

          <!-- Deep Dive: git commit -m and Flags -->
          <div class="mb-6 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <h4 class="font-bold text-emerald-950 text-base flex items-center gap-2">
              <GitCommit class="w-5 h-5 text-emerald-600" />
              เจาะลึกคำสั่ง: <code
                class="font-mono bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 text-emerald-700 font-bold">git commit -m "..."</code>
              และรวมคำสั่งขีด (Flags) ที่ควรรู้
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">1</span>
                  <span class="font-mono font-bold text-emerald-700 text-sm">commit คืออะไร?</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  คือการ <strong>"บันทึกจุดเซฟถาวร (Snapshot)"</strong> จากของที่คัดเลือกไว้ใน Staging Area
                  ลงสู่ฐานข้อมูล <code class="font-bold text-emerald-800">.git/</code> โดย Git จะสร้างรหัส
                  <strong>Commit Hash (SHA-1)</strong> 40 ตัวอักษร เช่น <code
                    class="font-mono font-bold text-slate-800">e3b0c44...</code> ประจำจุดเซฟนั้น
                  เพื่อให้สามารถย้อนกลับมาดูประวัติได้ตลอดเวลา
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-teal-600 text-white font-mono font-bold flex items-center justify-center text-xs">2</span>
                  <span class="font-mono font-bold text-teal-700 text-sm">-m คืออะไร?</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  ย่อมาจากคำว่า <strong><code class="font-bold text-teal-800">--message</code></strong>
                  คือทางลัดในการระบุข้อความอธิบายการเปลี่ยนแปลง (Commit Message) ในบรรทัดเดียวกัน<br />
                  <span class="text-amber-800 font-medium">*ข้อควรระวัง: หากพิมพ์แค่ <code
                      class="font-mono">git commit</code> โดยไม่ใส่ <code class="font-mono">-m</code> Git จะเด้งโปรแกรม
                    Text Editor (เช่น Vim หรือ Nano) ขึ้นมาให้พิมพ์ข้อความ ซึ่งมือใหม่อาจกดออกจากโปรแกรมไม่ถูก</span>
                </p>
              </div>
            </div>

            <!-- Table of Common Flags for git commit -->
            <div class="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-2xs">
              <div
                class="p-3 bg-emerald-100/60 border-b border-emerald-200 font-bold text-xs text-emerald-950 flex items-center justify-between">
                <span>สรุปคำสั่งขีด (Flags / Options) ของ git commit ที่นิยมใช้งาน:</span>
                <span class="text-[10px] text-emerald-700 font-normal">ใช้บ่อยในการทำงานจริง</span>
              </div>
              <div class="divide-y divide-gray-100 text-xs">
                <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                  <div class="sm:w-1/3">
                    <code
                      class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">-m "ข้อความ"</code>
                    <span class="text-[10px] text-gray-400 block sm:inline sm:ml-2">(--message)</span>
                  </div>
                  <div class="sm:w-2/3 text-stone-600 text-[11px]">
                    ใส่ข้อความอธิบาย Commit โดยตรงในบรรทัดคำสั่ง
                  </div>
                </div>

                <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                  <div class="sm:w-1/3">
                    <code
                      class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">-am "ข้อความ"</code>
                    <span class="text-[10px] text-gray-400 block sm:inline sm:ml-2">(-a + -m)</span>
                  </div>
                  <div class="sm:w-2/3 text-stone-600 text-[11px]">
                    ย่อมาจาก <code class="font-bold">--all</code> ทำการ add ไฟล์ที่มีการแก้ไข (Tracked) อัตโนมัติแล้ว
                    Commit ทันทีโดยไม่ต้องสั่ง git add ก่อน <em>(ใช้ไม่ได้กับไฟล์ใหม่ Untracked)</em>
                  </div>
                </div>

                <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                  <div class="sm:w-1/3">
                    <code
                      class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">--amend</code>
                    <span class="text-[10px] text-gray-400 block sm:inline sm:ml-2">(แก้ไขจุดเซฟล่าสุด)</span>
                  </div>
                  <div class="sm:w-2/3 text-stone-600 text-[11px]">
                    ใช้แก้ไขข้อความของ Commit ล่าสุด หรือนำไฟล์ที่ลืม add มารวมเข้ากับ Commit
                    ล่าสุดโดยไม่เพิ่มประวัติใหม่ เช่น <code
                      class="font-mono text-slate-800">git commit --amend -m "ข้อความใหม่"</code>
                  </div>
                </div>

                <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                  <div class="sm:w-1/3">
                    <code
                      class="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">-v</code>
                    <span class="text-[10px] text-gray-400 block sm:inline sm:ml-2">(--verbose)</span>
                  </div>
                  <div class="sm:w-2/3 text-stone-600 text-[11px]">
                    แสดงรายละเอียดโค้ด Diff ทุกบรรทัดที่เปลี่ยนแปลงในหน้าต่าง Editor
                    เพื่อให้ตรวจทานความถูกต้องก่อนกดยืนยันบันทึก
                  </div>
                </div>

                <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-emerald-50/30">
                  <div class="sm:w-1/3">
                    <code
                      class="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">--allow-empty</code>
                    <span class="text-[10px] text-gray-400 block sm:inline sm:ml-2">(เซฟแบบไม่มีไฟล์)</span>
                  </div>
                  <div class="sm:w-2/3 text-stone-600 text-[11px]">
                    อนุญาตให้บันทึก Commit ได้แม้ไม่มีไฟล์ใดเปลี่ยนแปลงเลย มักใช้สำหรับทดสอบ Pipeline ระบบ
                    หรือทำหมุดหมายเริ่มต้นโครงการ
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Viewing History with git log -->
          <div class="space-y-3">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock class="w-4 h-4 text-cyan-600" />
              การเรียกดูประวัติการ Commit ด้วยคำสั่ง git log
            </h4>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
              คำสั่ง <code class="font-bold font-mono">git log</code> ใช้แสดงประวัติว่ามีใครทำอะไรไปบ้าง
              หากต้องการดูแบบกระชับบรรทัดเดียวให้ใช้ <code class="font-bold font-mono">git log --oneline</code>:
            </p>

            <div class="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2">
              <div class="text-emerald-400">$ git log --oneline</div>
              <div class="text-slate-300 leading-relaxed">
                <span class="text-amber-400">a3f9b1c</span> (HEAD -> main) feat: add contact form<br />
                <span class="text-amber-400">8d2e4f0</span> fix: correct responsive padding<br />
                <span class="text-amber-400">5c1a7d2</span> feat: initial project structure with .gitignore
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

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-indigo-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Score Summary Card -->
      <div class="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
              สรุปคะแนนของคุณประจำสัปดาห์ที่ 3
            </span>
            <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
              <span>สถานะ:</span>
              <span v-if="studentNorm.isAllCompleted"
                class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> ทำครบทุกกิจกรรมแล้ว (3/3)
              </span>
              <span v-else-if="studentNorm.completedCount > 0"
                class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" /> กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
              </span>
              <span v-else
                class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                ยังไม่ได้เริ่มทำ
              </span>
            </div>
          </div>

          <div class="text-right">
            <span class="text-[11px] text-gray-400 font-bold uppercase block">คะแนนเฉลี่ยรวมสัปดาห์นี้</span>
            <span class="text-3xl font-black text-indigo-600 font-mono">{{ studentNorm.normalizedScore }}</span>
            <span class="text-xs text-gray-400 font-bold ml-1 font-mono">/ 10</span>
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
          <span>มินิเกมที่ 1: จัดกลุ่ม 3 พื้นที่หลักของ Git</span>
          <span v-if="studentWeekScores['game-1'] !== undefined"
            class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'match'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่คำสั่ง Git Command</span>
          <span v-if="studentWeekScores['game-2'] !== undefined"
            class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'quiz'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>แบบทดสอบหลังเรียน (4 ตัวเลือก 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz'] !== undefined"
            class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Games -->
      <DragDropGame v-if="activeGame === 'sort'" :course-id="currentCourseId" :week="currentWeek" game-id="game-1"
        title="มินิเกมที่ 1: จัดกลุ่ม 3 พื้นที่หลักของ Git (Three Trees Sorting)"
        subtitle="ลากการ์ดข้อความแต่ละใบไปวางในพื้นที่ของ Git ให้ถูกต้องตามบทบาทหน้าที่" :initial-items="dragItemsData"
        :zones="dragZonesData" />

      <MatchingGame v-else-if="activeGame === 'match'" :course-id="currentCourseId" :week="currentWeek" game-id="game-2"
        title="มินิเกมที่ 2: จับคู่คำสั่ง Git Command และคำอธิบายหน้าที่การทำงาน"
        subtitle="คลิกเลือกจับคู่ระหว่างคำสั่ง Git ในแถบซ้าย และความหมายการทำงานในแถบขวาให้ถูกต้องครบทั้ง 6 คู่"
        :initial-left-terms="matchLeftTerms" :initial-right-defs="matchRightDefs" />

      <PopQuiz v-else :course-id="currentCourseId" :week="currentWeek" game-id="quiz"
        title="แบบทดสอบวัดความรู้หลังเรียน สัปดาห์ที่ 3 (Post-test: Git Basics & Repository)"
        subtitle="แบบทดสอบ 4 ตัวเลือก วัดความเข้าใจเรื่อง Git พื้นที่ 3 ส่วน และการบันทึก Commit (10 ข้อ)"
        :questions="quizQuestions" />

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal :show="showTeacherModal" :is-open="showTeacherModal" :course-id="currentCourseId"
        course-name="การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม" :week="currentWeek"
        week-title="สัปดาห์ที่ 3: หลักการพื้นฐานของกิต (GIT) และพื้นที่เก็บข้อมูล (Repository)" :games="weekGames"
        @close="showTeacherModal = false" />
    </section>

    <!-- Assignment Section -->
    <AssignmentSection course-id="21901-2012" assignment-id="asm-3"
      assignment-title="ใบงานที่ 3: ปฏิบัติการสร้าง Local Repository และเช็คอินเวอร์ชัน (HTML Versioning Lab)"
      :max-score="10" work-type="individual">
      <template #number>3</template>
      <template #description>
        ให้นักศึกษาฝึกปฏิบัติการสร้าง Local Repository และบันทึกเวอร์ชันด้วยคำสั่ง Git Command Line โดยสร้างไฟล์ <code class="font-bold font-mono">index.html</code> ใส่ชื่อของตนเองแล้ว Commit เป็นเวอร์ชันที่ 1 จากนั้นแก้ไขไฟล์เพิ่มชื่อเพื่อนร่วมชั้น 1 คน แล้ว Commit เป็นเวอร์ชันที่ 2 พร้อมเรียกดูประวัติด้วย <code class="font-bold font-mono">git log --oneline</code> <strong>เมื่อทำเสร็จเรียบร้อยให้เรียกครูผู้สอนมาตรวจงานที่หน้าจอคอมพิวเตอร์</strong>

        <!-- Objectives Box -->
        <div class="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 mt-4">
          <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-indigo-600" />
            จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-indigo-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>1. สร้าง Local Repo ด้วยคำสั่ง git init ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>2. บันทึก Commit เวอร์ชันที่ 1 (ชื่อตนเอง) ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>3. แก้ไขไฟล์และ Commit เวอร์ชันที่ 2 (เพิ่มชื่อเพื่อน) ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span>4. ตรวจสอบ git log และเรียกครูผู้สอนตรวจงานได้</span>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <ul class="space-y-4 text-slate-700">
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div class="space-y-1">
              <strong>ตอนที่ 1: สร้างโฟลเดอร์และเริ่มต้น Local Repository</strong>
              <p class="text-xs text-gray-500 leading-relaxed">
                สร้างโฟลเดอร์ใหม่บนเครื่องคอมพิวเตอร์ เช่น ชื่อโฟลเดอร์ <code class="font-bold font-mono">my-profile</code> จากนั้นเปิด Terminal (หรือเปิดโฟลเดอร์ใน VS Code) แล้วพิมพ์คำสั่งเริ่มต้นสร้าง Repository:
              </p>
              <div class="p-2 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs inline-block">
                git init
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2
            </div>
            <div class="space-y-1.5">
              <strong>ตอนที่ 2: สร้างไฟล์ HTML มีชื่อตัวเอง และ Commit เป็นเวอร์ชันแรก (Version 1)</strong>
              <p class="text-xs text-gray-500 leading-relaxed">
                สร้างไฟล์ชื่อ <code class="font-bold font-mono text-blue-700">index.html</code> ภายในไฟล์ให้พิมพ์โค้ด HTML ระบุ <strong>ชื่อ-นามสกุล และรหัสนักศึกษาของตนเอง</strong> จากนั้นกดบันทึกไฟล์ (Save) แล้วใช้คำสั่ง Git เพื่อเช็คอินเวอร์ชันแรก:
              </p>
              <div class="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs space-y-1 max-w-lg">
                <div class="text-slate-400"># 1. เช็กสถานะไฟล์ใหม่</div>
                <div class="text-cyan-300">git status</div>
                <div class="text-slate-400 pt-0.5"># 2. นำไฟล์ index.html เข้าสู่ Staging Area</div>
                <div class="text-cyan-300">git add .</div>
                <div class="text-slate-400 pt-0.5"># 3. บันทึกจุดเซฟเวอร์ชันแรก</div>
                <div class="text-emerald-400">git commit -m "feat: add my name to index.html"</div>
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3
            </div>
            <div class="space-y-1.5">
              <strong>ตอนที่ 3: แก้ไขไฟล์เพิ่มชื่อเพื่อน 1 คน และ Commit เป็นเวอร์ชันที่สอง (Version 2)</strong>
              <p class="text-xs text-gray-500 leading-relaxed">
                เปิดไฟล์ <code class="font-bold font-mono">index.html</code> เดิมขึ้นมาแก้ไข โดยพิมพ์เพิ่ม <strong>ชื่อ-นามสกุลของเพื่อนร่วมชั้น 1 คน</strong> ต่อท้ายชื่อของตนเอง จากนั้นกดบันทึกไฟล์ (Save) แล้วเช็คอินเวอร์ชันที่สอง:
              </p>
              <div class="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs space-y-1 max-w-lg">
                <div class="text-slate-400"># 1. ตรวจสอบดูไฟล์ที่มีการแก้ไข (จะเห็นเป็นสีแดง)</div>
                <div class="text-cyan-300">git status</div>
                <div class="text-slate-400 pt-0.5"># 2. นำไฟล์ที่แก้ไขเข้าสู่ Staging Area</div>
                <div class="text-cyan-300">git add .</div>
                <div class="text-slate-400 pt-0.5"># 3. บันทึกจุดเซฟเวอร์ชันที่สอง</div>
                <div class="text-emerald-400">git commit -m "feat: add friend name to index.html"</div>
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div
              class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              4
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <strong>ตอนที่ 4: ตรวจสอบประวัติ Commit และเรียกครูผู้สอนตรวจงาน</strong>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  ตรวจหน้าจอ
                </span>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed">
                พิมพ์คำสั่งตรวจสอบประวัติการ Commit บน Terminal เพื่อแสดงรายการทั้ง 2 เวอร์ชัน:
              </p>
              <div class="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs inline-block">
                git log --oneline
              </div>
              
              <!-- Call Teacher Notice Box -->
              <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1 max-w-xl">
                <span class="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 class="w-4 h-4 text-amber-600" /> ขั้นตอนตรวจงาน:
                </span>
                <p class="leading-relaxed">
                  เมื่อหน้าจอ Terminal แสดงรายการครบทั้ง 2 Commit (เวอร์ชันชื่อตนเอง และ เวอร์ชันเพิ่มชื่อเพื่อน) ให้<strong>ยกมือเรียกครูผู้สอนมาตรวจงานที่หน้าจอคอมพิวเตอร์</strong> เพื่อให้คะแนนทันทีในคาบเรียน (และสามารถแคปภาพหน้าจอ Terminal แนบส่งในระบบเป็นหลักฐานเพิ่มเติมได้)
                </p>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </AssignmentSection>

  </div>
</template>
