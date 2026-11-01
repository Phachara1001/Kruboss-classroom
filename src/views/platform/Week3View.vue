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

// Game 3: Post-test 10 ข้อ
const quizQuestions = [
  {
    id: 1,
    question: "โครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees) ของ Git ประกอบด้วยอะไรบ้างตามลำดับ?",
    options: [
      { id: 'a', text: "CPU, RAM, และ Harddisk", isCorrect: false },
      { id: 'b', text: "Working Directory, Staging Area, และ Local Repository", isCorrect: true },
      { id: 'c', text: "HTML, CSS, และ JavaScript", isCorrect: false },
      { id: 'd', text: "Frontend, Backend, และ Database", isCorrect: false }
    ],
    explanation: "สถาปัตยกรรมหัวใจสำคัญของ Git คือ Working Directory (พื้นที่ไฟล์จริง) -> Staging Area (จุดพักไฟล์ก่อนยืนยัน) -> Local Repository (ที่จัดเก็บ Snapshot ถาวรในโฟลเดอร์ .git)"
  },
  {
    id: 2,
    question: "คำสั่งใดใช้สำหรับสร้าง Local Git Repository ขึ้นใหม่ในโฟลเดอร์โครงการปัจจุบัน?",
    options: [
      { id: 'a', text: "git create-new", isCorrect: false },
      { id: 'b', text: "git start", isCorrect: false },
      { id: 'c', text: "git init", isCorrect: true },
      { id: 'd', text: "git install", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git init' ย่อมาจาก initialize ใช้สร้างโฟลเดอร์ซ่อนชื่อ .git ขึ้นมาเพื่อเริ่มติดตามการเปลี่ยนแปลงไฟล์ในโฟลเดอร์นั้น"
  },
  {
    id: 3,
    question: "การตั้งค่า Identity ระบุตัวตนผู้ Commit เป็นครั้งแรกด้วยคำสั่งใดจึงจะถูกต้องตามหลักการ?",
    options: [
      { id: 'a', text: "git config --global user.name 'ชื่อ' และ git config --global user.email 'อีเมล'", isCorrect: true },
      { id: 'b', text: "git set user 'ชื่อ' 'อีเมล'", isCorrect: false },
      { id: 'c', text: "git login -u ชื่อ -p รหัสผ่าน", isCorrect: false },
      { id: 'd', text: "git register --account 'อีเมล'", isCorrect: false }
    ],
    explanation: "Git บันทึกประวัติว่าใครแก้ไขด้วย user.name และ user.email ผ่านคำสั่ง git config --global เพื่อใช้ร่วมกันทุกโปรเจกต์ในเครื่อง"
  },
  {
    id: 4,
    question: "โฟลเดอร์สำคัญใดที่ Git แอบสร้างไว้ในเครื่องเพื่อเก็บข้อมูลประวัติ Commit และการตั้งค่าทั้งหมดของ Repository?",
    options: [
      { id: 'a', text: "โฟลเดอร์ node_modules/", isCorrect: false },
      { id: 'b', text: "โฟลเดอร์ .git/", isCorrect: true },
      { id: 'c', text: "โฟลเดอร์ .vscode/", isCorrect: false },
      { id: 'd', text: "โฟลเดอร์ dist/", isCorrect: false }
    ],
    explanation: "โฟลเดอร์ .git/ เป็นโฟลเดอร์ซ่อนที่เก็บฐานข้อมูล Snapshot, HEAD, Object และ Config ทั้งหมดของ Git หากลบโฟลเดอร์นี้ประวัติ Git จะหายทันที"
  },
  {
    id: 5,
    question: "เมื่อสร้างไฟล์ใหม่ขึ้นมาในโปรเจกต์ ไฟล์นั้นจะมีสถานะใดในระบบของ Git ก่อนถูกเรียกใช้คำสั่งใดๆ?",
    options: [
      { id: 'a', text: "Committed (บันทึกแล้ว)", isCorrect: false },
      { id: 'b', text: "Staged (เตรียมจัดเก็บ)", isCorrect: false },
      { id: 'c', text: "Untracked (ยังไม่ได้รับการติดตาม)", isCorrect: true },
      { id: 'd', text: "Ignored (ถูกเพิกเฉยถาวร)", isCorrect: false }
    ],
    explanation: "ไฟล์ที่สร้างขึ้นใหม่เอี่ยม Git จะมองเห็นเป็น Untracked หมายถึง Git รับรู้ว่ามีไฟล์นี้อยู่แต่ยังไม่ได้เริ่มติดตามบันทึกเวอร์ชัน"
  },
  {
    id: 6,
    question: "คำสั่งใดใช้สำหรับนำไฟล์ที่แก้ไขแล้วเข้าสู่ Staging Area เพื่อเตรียมพร้อมสำหรับการ Commit?",
    options: [
      { id: 'a', text: "git push", isCorrect: false },
      { id: 'b', text: "git save", isCorrect: false },
      { id: 'c', text: "git add <ชื่อไฟล์>", isCorrect: true },
      { id: 'd', text: "git upload", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git add' ทำหน้าที่หยิบไฟล์จาก Working Directory เข้าไปวางไว้ใน Staging Area (Index) เพื่อเตรียม Commit"
  },
  {
    id: 7,
    question: "ข้อใดคือหน้าที่สำคัญที่สุดของไฟล์ '.gitignore' ในโปรเจกต์ Git?",
    options: [
      { id: 'a', text: "ป้องกันไม่ให้โปรแกรมเปิดทำงาน", isCorrect: false },
      { id: 'b', text: "ระบุรายชื่อไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้ Git ติดตาม เช่น รหัสผ่าน (.env) หรือไลบรารีขนาดใหญ่ (node_modules/)", isCorrect: true },
      { id: 'c', text: "ลบไฟล์ทั้งหมดออกจากฮาร์ดดิสก์อัตโนมัติ", isCorrect: false },
      { id: 'd', text: "เข้ารหัสข้อความ Commit Message ไม่ให้ผู้อื่นอ่านออก", isCorrect: false }
    ],
    explanation: ".gitignore ทำหน้าที่บอกให้ Git เพิกเฉยต่อไฟล์ที่ไม่ควรขึ้นระบบ เช่น ไฟล์ชั่วคราว, ค่า Config ส่วนตัว (.env), และโฟลเดอร์ดาวน์โหลด (node_modules)"
  },
  {
    id: 8,
    question: "การบันทึก Commit ที่ดีควรยึดหลักการใดจึงจะช่วยให้ทีมทำงานร่วมกันได้สะดวกที่สุด?",
    options: [
      { id: 'a', text: "เขียนรวมโค้ด 10 สัปดาห์ไว้ใน 1 Commit แล้วใส่ข้อความ 'update'", isCorrect: false },
      { id: 'b', text: "ทำ Commit แยกเป็นหน่วยย่อยที่มีความหมาย (Atomic Commit) พร้อมระบุข้อความอธิบายการเปลี่ยนแปลงชัดเจน เช่น 'feat: add login page'", isCorrect: true },
      { id: 'c', text: "ต้องตั้งชื่อ Commit เป็นภาษาอังกฤษคำเดียว เช่น 'done'", isCorrect: false },
      { id: 'd', text: "บันทึก Commit เฉพาะวันที่ส่งงานเท่านั้น", isCorrect: false }
    ],
    explanation: "หลักการ Atomic Commit และ Conventional Commits (เช่น feat:, fix:, docs:) ช่วยให้ย้อนประวัติ ตรวจสอบสาเหตุบั๊ก และทำงานร่วมกันในทีมได้อย่างมีประสิทธิภาพ"
  },
  {
    id: 9,
    question: "คำสั่งใดใช้ตรวจสอบสถานะปัจจุบันของไฟล์ว่ามีไฟล์ใดแก้ไขแล้ว ไฟล์ใดอยู่ใน Staging หรือไฟล์ใดยัง Untracked?",
    options: [
      { id: 'a', text: "git check", isCorrect: false },
      { id: 'b', text: "git status", isCorrect: true },
      { id: 'c', text: "git list", isCorrect: false },
      { id: 'd', text: "git info", isCorrect: false }
    ],
    explanation: "คำสั่ง 'git status' เป็นคำสั่งพื้นฐานที่ใช้บ่อยที่สุดเพื่อตรวจดูสถานะของไฟล์ในแต่ละพื้นที่ก่อนทำคำสั่งถัดไป"
  },
  {
    id: 10,
    question: "หากต้องการคัดลอกโปรเจกต์ที่มีอยู่แล้วบนคลาวด์แพลตฟอร์ม (เช่น GitHub) ลงมาทำงานบนเครื่องตนเอง ต้องใช้คำสั่งใด?",
    options: [
      { id: 'a', text: "git copy <url>", isCorrect: false },
      { id: 'b', text: "git download <url>", isCorrect: false },
      { id: 'c', text: "git clone <url>", isCorrect: true },
      { id: 'd', text: "git fetch-all <url>", isCorrect: false }
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
          <span class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider shadow-sm">
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
          ศึกษาโครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees of Git), วงจรชีวิตของไฟล์ (File Lifecycle States), การกำหนดค่าตัวตน Identity, การสร้างและโคลน Repository, การกำหนดไฟล์ .gitignore และการบันทึกประวัติการพัฒนาด้วย Commit มาตรฐาน
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
                ผู้เรียนสามารถอธิบายสถาปัตยกรรม 3 พื้นที่หลักของ Git และวงจรชีวิตของไฟล์ได้อย่างถูกต้อง ตลอดจนสามารถเริ่มต้นสร้าง Local Repository, กำหนดค่าไฟล์ .gitignore และบันทึกประวัติการพัฒนาด้วย Commit ได้อย่างมีประสิทธิภาพ
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
                แสดงความรู้และทักษะการใช้งานคำสั่งพื้นฐานของ Git ในการจัดการพื้นที่เก็บข้อมูล (Repository) และควบคุมวงจรชีวิตของไฟล์ได้อย่างถูกต้องตามมาตรฐาน
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
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span class="font-medium text-gray-800">สถาปัตยกรรม 3 พื้นที่หลักของ Git</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span class="font-medium text-gray-800">การสร้าง & โคลน Repository (.git)</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span class="font-medium text-gray-800">วงจรชีวิตของไฟล์ และ .gitignore</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
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

      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-indigo-100 space-y-12 text-gray-700 leading-relaxed">

        <!-- Topic 1: สถาปัตยกรรม 3 พื้นที่หลักของ Git (Three Trees Architecture) -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 1: สถาปัตยกรรม 3 พื้นที่หลักของกิต (The Three Trees of Git)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            จุดแข็งและกลไกสำคัญที่สุดของ Git คือการไม่บันทึกไฟล์สุ่มสี่สุ่มห้า แต่แบ่งสถานะและพื้นที่การทำงานออกเป็น <strong>3 พื้นที่ (Three Areas)</strong> บนเครื่องคอมพิวเตอร์ของนักพัฒนา ทำให้เราสามารถเลือกจัดคิวเฉพาะไฟล์ที่ต้องการ เพื่อสร้างประวัติโค้ดที่สะอาด เป็นระเบียบ และสามารถย้อนดูได้ตลอดเวลา:
          </p>

          <!-- 3 Areas Visual Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <!-- Area 1: Working Directory -->
            <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 relative">
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
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
              <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Layers class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">พื้นที่ที่ 2</span>
                <h4 class="text-base font-bold text-amber-950">Staging Area (พื้นที่เตรียมจัดเก็บ)</h4>
                <p class="text-xs sm:text-sm text-amber-900/80 mt-1 leading-relaxed">
                  จุดพักไฟล์หรือพื้นที่คัดเลือก เปรียบเสมือนกล่องพัสดุที่กำลังแพ็กของ เราสั่ง <code class="font-bold">git add</code> เพื่อนำเฉพาะไฟล์ที่พร้อมส่งเข้ามารอไว้
                </p>
              </div>
              <div class="pt-2 border-t border-amber-200/80 text-[11px] text-amber-800 font-mono font-bold">
                คำสั่ง: git add &lt;file&gt;
              </div>
            </div>

            <!-- Area 3: Local Repository -->
            <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 relative">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Database class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">พื้นที่ที่ 3</span>
                <h4 class="text-base font-bold text-emerald-950">Local Repository (.git)</h4>
                <p class="text-xs sm:text-sm text-emerald-900/80 mt-1 leading-relaxed">
                  ฐานข้อมูลประวัติถาวรที่ถูกปิดผนึกไว้ในโฟลเดอร์ซ่อน <code class="font-bold">.git/</code> เมื่อเราสั่ง <code class="font-bold">git commit</code> ข้อมูลจะถูกบันทึกเป็น Snapshot ทันที
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
              ก่อนเริ่ม Commit งาน Git บังคับให้เราระบุ <strong>ชื่อ</strong> และ <strong>อีเมล</strong> เพื่อใช้แปะป้ายกำกับในทุก Commit ว่าใครเป็นผู้แก้ไข:
            </p>

            <div class="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 relative shadow-inner">
              <button 
                @click="copyText(gitConfigSnippet, 'cfg')"
                class="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
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
                  <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">วิธีที่ 1: สร้างขึ้นเองในเครื่อง</span>
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
              <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs">วิธีที่ 2: โคลนจากคลาวด์</span>
                  <Cloud class="w-4 h-4 text-cyan-600" />
                </div>
                <h5 class="font-bold text-slate-900 text-sm">คำสั่ง: git clone &lt;url&gt;</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ใช้เมื่อมี Repository อยู่บน GitHub/GitLab แล้ว และต้องการคัดลอกโค้ดพร้อมประวัติทั้งหมดลงมาที่เครื่อง:
                </p>
                <div class="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs truncate">
                  git clone https://github.com/user/repo.git
                </div>
                <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ได้ทั้งโค้ด ประวัติ และการเชื่อมโยงกับ Remote ทันที</span>
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
              ในโปรเจกต์จะมีไฟล์บางประเภทที่<strong>ห้ามนำเข้า Git เด็ดขาด</strong> เช่น รหัสผ่าน/API Key ในไฟล์ <code class="font-bold">.env</code>, โฟลเดอร์ไลบรารีขนาดใหญ่ <code class="font-bold">node_modules/</code>, หรือไฟล์คอมไพล์ <code class="font-bold">dist/</code> เราจึงต้องสร้างไฟล์ชื่อ <code class="font-bold">.gitignore</code> วางไว้ที่รูทของโปรเจกต์:
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
              &nbsp;&nbsp;new file:   index.html<br />
              <br />
              <span class="text-rose-400">Untracked files:</span> (ไฟล์ใหม่ที่ยังไม่ได้ add - สีแดง)<br />
              &nbsp;&nbsp;style.css<br />
            </div>
          </div>
        </div>

        <!-- Topic 4: การสร้าง Commit มาตรฐาน และการเรียกดูประวัติ -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 4: การสร้าง Commit มาตรฐาน (Conventional Commits) และการเรียกดูประวัติ (git log)
          </h3>
          
          <!-- Conventional Commits Guide -->
          <div class="space-y-3 mb-6">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommit class="w-4 h-4 text-emerald-600" />
              โครงสร้างของคำสั่ง Commit และรูปแบบ Conventional Commits
            </h4>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
              คำสั่ง <code class="font-bold font-mono">git commit -m "ข้อความ"</code> เป็นการสร้างจุดเซฟ (Snapshot) ประจำโปรเจกต์ โดยมีคำนำหน้ามาตรฐานที่นิยมใช้ในระดับสากลดังนี้:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">feat:</span>
                <p class="text-slate-600 text-[11px]">เพิ่มฟีเจอร์ใหม่ เช่น <code class="text-slate-800">feat: add login</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">fix:</span>
                <p class="text-slate-600 text-[11px]">แก้ไขบั๊ก เช่น <code class="text-slate-800">fix: header overflow</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">docs:</span>
                <p class="text-slate-600 text-[11px]">แก้ไขเอกสารหรือ README เช่น <code class="text-slate-800">docs: update api</code></p>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span class="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">refactor:</span>
                <p class="text-slate-600 text-[11px]">ปรับปรุงโค้ดให้สะอาดขึ้นโดยผลลัพธ์คงเดิม</p>
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
              คำสั่ง <code class="font-bold font-mono">git log</code> ใช้แสดงประวัติว่ามีใครทำอะไรไปบ้าง หากต้องการดูแบบกระชับบรรทัดเดียวให้ใช้ <code class="font-bold font-mono">git log --oneline</code>:
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
              <span v-else class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
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
          <span v-if="studentWeekScores['game-1'] !== undefined" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'match'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่คำสั่ง Git Command</span>
          <span v-if="studentWeekScores['game-2'] !== undefined" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
          activeGame === 'quiz'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>แบบทดสอบหลังเรียน (4 ตัวเลือก 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz'] !== undefined" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓ บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Games -->
      <DragDropGame 
        v-if="activeGame === 'sort'"
        :course-id="currentCourseId" 
        :week="currentWeek" 
        game-id="game-1"
        title="มินิเกมที่ 1: จัดกลุ่ม 3 พื้นที่หลักของ Git (Three Trees Sorting)"
        subtitle="ลากการ์ดข้อความแต่ละใบไปวางในพื้นที่ของ Git ให้ถูกต้องตามบทบาทหน้าที่"
        :initial-items="dragItemsData"
        :zones="dragZonesData"
      />

      <MatchingGame 
        v-else-if="activeGame === 'match'"
        :course-id="currentCourseId" 
        :week="currentWeek" 
        game-id="game-2"
        title="มินิเกมที่ 2: จับคู่คำสั่ง Git Command และคำอธิบายหน้าที่การทำงาน"
        subtitle="คลิกเลือกจับคู่ระหว่างคำสั่ง Git ในแถบซ้าย และความหมายการทำงานในแถบขวาให้ถูกต้องครบทั้ง 6 คู่"
        :initial-left-terms="matchLeftTerms"
        :initial-right-defs="matchRightDefs"
      />

      <PopQuiz 
        v-else
        :course-id="currentCourseId" 
        :week="currentWeek" 
        game-id="quiz"
        title="แบบทดสอบวัดความรู้หลังเรียน สัปดาห์ที่ 3 (Post-test: Git Basics & Repository)"
        subtitle="แบบทดสอบ 4 ตัวเลือก วัดความเข้าใจเรื่อง Git พื้นที่ 3 ส่วน และการบันทึก Commit (10 ข้อ)"
        :questions="quizQuestions"
      />

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal 
        :show="showTeacherModal" 
        :is-open="showTeacherModal" 
        :course-id="currentCourseId" 
        course-name="การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม"
        :week="currentWeek" 
        week-title="สัปดาห์ที่ 3: หลักการพื้นฐานของกิต (GIT) และพื้นที่เก็บข้อมูล (Repository)"
        :games="weekGames" 
        @close="showTeacherModal = false" 
      />
    </section>

    <!-- Assignment Section -->
    <AssignmentSection 
      course-id="21901-2012"
      assignment-id="asm-3"
      assignment-title="ใบงานที่ 3: การเริ่มต้นสร้าง Git Repository, กำหนด .gitignore และบันทึกประวัติด้วย Commit มาตรฐาน"
      :max-score="10"
      work-type="pair"
      :min-members="2"
      :max-members="4"
    >
      <template #number>3</template>
      <template #description>
        ให้นักศึกษาฝึกปฏิบัติตามคำสั่งของ Git Command Line บนเครื่องคอมพิวเตอร์ โดยทำการสร้างโฟลเดอร์โปรเจกต์ใหม่ ทำการตั้งค่า Identity, สร้าง Local Repository ด้วย <code class="font-bold">git init</code>, กำหนดไฟล์ <code class="font-bold">.gitignore</code>, บันทึกการเปลี่ยนแปลงไฟล์อย่างน้อย 3 Commit ตามรูปแบบ Conventional Commits และตรวจสอบประวัติด้วย <code class="font-bold">git log</code> จากนั้นแคปภาพหน้าจอและรวบรวมส่งเป็นรายงาน หรือแนบลิงก์ GitHub Repository ร่วมกันในระบบ

        <!-- Objectives Box -->
        <div class="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 mt-4">
          <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-indigo-600" />
            จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-indigo-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>1. ตั้งค่า Identity user.name และ user.email ได้ถูกต้อง</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>2. ริเริ่ม Local Repo ด้วย git init และสร้าง .gitignore ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>3. บันทึก Commit ตาม Conventional และตรวจ log ได้</span>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <ul class="space-y-4 text-slate-700">
          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div>
              <strong>ตอนที่ 1: ตั้งค่า Identity และตรวจสอบ Config</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                เปิด Terminal (Git Bash หรือ VS Code Terminal) พิมพ์คำสั่งตั้งชื่อ <code class="font-bold font-mono">user.name</code> และ <code class="font-bold font-mono">user.email</code> ของตนเอง จากนั้นสั่ง <code class="font-bold font-mono">git config --list</code> แล้วแคปภาพหน้าจอผลลัพธ์
              </p>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2
            </div>
            <div>
              <strong>ตอนที่ 2: สร้าง Repository และสร้างไฟล์ .gitignore</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                สร้างโฟลเดอร์ชื่อ <code class="font-bold font-mono">git-lab-week3</code> สั่ง <code class="font-bold font-mono">git init</code> เพื่อเริ่มต้น Repository และสร้างไฟล์ <code class="font-bold font-mono">.gitignore</code> ระบุไฟล์ที่ไม่ต้องการติดตาม เช่น <code class="font-bold">*.log</code>, <code class="font-bold">.env</code>
              </p>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3
            </div>
            <div>
              <strong>ตอนที่ 3: ฝึกฝนการทำ Staging และ Commit อย่างน้อย 3 ครั้ง</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                สร้างไฟล์ <code class="font-bold">index.html</code> และ <code class="font-bold">style.css</code> สั่ง <code class="font-bold">git add</code> และบันทึก Commit โดยใช้ Prefix มาตรฐาน (เช่น <code class="font-bold">feat: initial project</code>, <code class="font-bold">feat: add layout</code>, <code class="font-bold">style: add color theme</code>) รวมอย่างน้อย 3 Commit จากนั้นพิมพ์คำสั่ง <code class="font-bold font-mono">git log --oneline</code> เพื่อแสดงประวัติ
              </p>
            </div>
          </li>

          <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              4
            </div>
            <div>
              <strong>ตอนที่ 4: การส่งผลงานในระบบ (รองรับงานเดี่ยว / งานคู่ / งานกลุ่ม)</strong>
              <p class="text-xs text-gray-500 mt-0.5">
                รวบรวมภาพหลักฐานบันทึกเป็นเอกสาร PDF อัปโหลดขึ้น Google Drive (เปิดแชร์) และ/หรือนำโค้ดขึ้น GitHub สามารถ<strong>แนบได้หลายลิงก์</strong>ในช่องส่งงาน หากทำงานเป็นคู่หรือกลุ่ม ให้ตัวแทน 1 คนเป็นผู้ส่งและเลือกชื่อเพื่อนร่วมกลุ่มในระบบ
              </p>
            </div>
          </li>
        </ul>
      </template>
    </AssignmentSection>

  </div>
</template>
