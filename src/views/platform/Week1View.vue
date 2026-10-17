<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload, Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target, Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star, Shuffle, MousePointer2, Code, Settings, Cloud, RefreshCw, GitBranch, GitCommit, GitMerge, Clock } from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

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

// Mini-game State
const quizQuestions = [
  {
    id: 1,
    question: "ข้อใดคือความหมายที่ถูกต้องที่สุดของคำว่า 'DevOps'?",
    options: [
      { id: 'a', text: "เครื่องมือที่ใช้ในการเขียนโค้ดภาษาใหม่", isCorrect: false },
      { id: 'b', text: "การรวมกันระหว่าง Development (การพัฒนา) และ Operations (การดูแลระบบ) เป็นวัฒนธรรมการทำงานร่วมกัน", isCorrect: true },
      { id: 'c', text: "โปรแกรมสำหรับตรวจสอบไวรัสในระบบ", isCorrect: false }
    ],
    explanation: "DevOps ไม่ใช่แค่เครื่องมือ แต่เป็น 'วัฒนธรรม' และ 'แนวปฏิบัติ' ที่นำทีม Dev และ Ops มาทำงานร่วมกันอย่างใกล้ชิด เพื่อให้ส่งมอบซอฟต์แวร์ได้รวดเร็วและมีเสถียรภาพ"
  },
  {
    id: 2,
    question: "ปัญหาคลาสสิก 'Works on my machine' (รันบนเครื่องฉันได้ แต่เครื่องคนอื่นพัง) มักเกิดจากอะไร?",
    options: [
      { id: 'a', text: "สเปกคอมพิวเตอร์ต่างกัน", isCorrect: false },
      { id: 'b', text: "สภาพแวดล้อมและเวอร์ชันของโปรแกรมไม่ตรงกัน", isCorrect: true },
      { id: 'c', text: "เขียนโค้ดผิดพลาดตั้งแต่แรก", isCorrect: false }
    ],
    explanation: "ปัญหาเกิดจาก Environment ที่แตกต่างกันระหว่างเครื่องนักพัฒนาและเซิร์ฟเวอร์จริง ซึ่งในยุค DevOps จะแก้ปัญหานี้ด้วยการใช้ Container เช่น Docker"
  },
  {
    id: 3,
    question: "ระบบ Version Control (เช่น Git) มีประโยชน์อย่างไรในการทำงานเป็นทีม?",
    options: [
      { id: 'a', text: "ใช้ติดตามประวัติการแก้ไข และรวมโค้ดของหลายๆ คนเข้าด้วยกันอย่างเป็นระบบ", isCorrect: true },
      { id: 'b', text: "ใช้แปลภาษาโค้ดจากภาษาหนึ่งไปอีกภาษาหนึ่ง", isCorrect: false },
      { id: 'c', text: "ใช้บีบอัดไฟล์ให้เล็กลงเพื่อให้ส่งอีเมลได้", isCorrect: false }
    ],
    explanation: "Git ช่วยบันทึก (Commit) ว่าใครทำอะไร เมื่อไหร่ และสามารถแยกสายการทำงาน (Branch) ออกไปทำพร้อมกัน ก่อนจะนำมารวมกัน (Merge) ในภายหลังได้"
  }
]

const activeGame = ref('sort') // 'sort', 'order', 'quiz'

// Game 1: Drag & Drop
const dragItemsData = [
  { id: 1, text: 'ทำงานแยกแผนกกัน (Silo)', type: 'traditional' },
  { id: 2, text: 'ทำงานร่วมกันอย่างใกล้ชิด', type: 'devops' },
  { id: 3, text: 'Deploy ด้วยมือแบบ Manual', type: 'traditional' },
  { id: 4, text: 'มีระบบอัตโนมัติ (CI/CD)', type: 'devops' },
  { id: 5, text: 'ผลักภาระให้ทีมอื่น', type: 'traditional' },
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

// Game 2: Matching
const matchLeftTerms = [
  { id: 'l1', text: 'Repository', match: 'r2' },
  { id: 'l2', text: 'Commit', match: 'r3' },
  { id: 'l3', text: 'Branch', match: 'r1' }
]
const matchRightDefs = [
  { id: 'r1', text: 'การแตกสายการทำงานออกไปชั่วคราวเพื่อทำฟีเจอร์ใหม่' },
  { id: 'r2', text: 'พื้นที่สำหรับจัดเก็บไฟล์โค้ดและประวัติการทำงาน' },
  { id: 'r3', text: 'การบันทึกประวัติการเปลี่ยนแปลงของไฟล์พร้อมข้อความอธิบาย' }
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
    <section>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <h2 class="text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ</h2>
        </div>
      </div>

      <!-- Game Tabs -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="activeGame = 'sort'" :class="[activeGame === 'sort' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2']">
          <MousePointer2 class="w-5 h-5" /> แยกประเภท (Drag & Drop)
        </button>
        <button @click="activeGame = 'order'" :class="[activeGame === 'order' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2']">
          <ListOrdered class="w-5 h-5" /> โยงความสัมพันธ์ (Match)
        </button>
        <button @click="activeGame = 'quiz'" :class="[activeGame === 'quiz' ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200', 'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2']">
          <FileQuestion class="w-5 h-5" /> Pop Quiz สุดท้าย
        </button>
      </div>

      <!-- Game 1 -->
      <DragDropGame v-if="activeGame === 'sort'" 
        title="วัฒนธรรมองค์กร: แบบเก่า vs แบบ DevOps"
        subtitle="ลากลักษณะการทำงานไปใส่กล่องที่ถูกต้อง"
        :initialItems="dragItemsData"
        :zones="dragZonesData"
      />

      <!-- Game 2 -->
      <MatchingGame v-if="activeGame === 'order'"
        title="เครื่องมือและคำศัพท์ที่ควรรู้จัก"
        subtitle="จับคู่คำศัพท์กับการทำงาน"
        :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs"
      />

      <!-- Game 3 -->
      <PopQuiz v-if="activeGame === 'quiz'" :questions="quizQuestions">
        <template #actions>
          <RouterLink to="/courses" class="px-8 py-4 bg-indigo-500 border-2 border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- Assignment Section -->
    <AssignmentSection
      course-id="21901-2012"
      assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: เตรียมความพร้อมสู่วิถี DevOps"
      :max-score="10"
    >
      <template #number>1</template>
      <template #description>
        ให้นักศึกษาเตรียมสภาพแวดล้อมบนคอมพิวเตอร์ของตนเองให้พร้อมสำหรับการเรียนในสัปดาห์ถัดไป
      </template>
      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>ดาวน์โหลดและติดตั้งโปรแกรม <strong>Visual Studio Code</strong> และ <strong>Git</strong> ตามคู่มือในหน้า <a href="#" @click.prevent="router.push(`/course/${route.params.id}/tools`)" class="text-blue-600 font-bold hover:underline">เครื่องมือเรียน</a></span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>สมัครบัญชี <strong>GitHub</strong> (github.com) โดยใช้ Email ของมหาวิทยาลัยหรือ Email ส่วนตัวให้เรียบร้อย</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>จับภาพหน้าจอ (Screenshot) <strong>หน้าต่างโปรแกรม VS Code</strong> และ <strong>หน้าโปรไฟล์ GitHub</strong> ของตนเอง (รวม 2 ภาพ)</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>นำลิงก์ (URL) ของไฟล์รูปภาพที่อัปโหลดขึ้น Drive แล้ว มาส่งที่ปุ่ม <strong>ส่งงานด้วยลิงก์</strong> ด้านล่าง</span>
        </li>
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
