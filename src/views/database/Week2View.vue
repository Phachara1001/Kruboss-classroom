<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BookOpen, PieChart, Info, Play, CheckCircle, XCircle, FileText, Upload,
  Database, Layers, Shield, Users, Server, FileQuestion, ArrowRight, Target,
  Award, Book, Lightbulb, Gamepad2, ListOrdered, ChevronRight, Star,
  Shuffle, MousePointer2, Clock, Trophy, Lock, FileSpreadsheet, Key, Hash,
  Binary, Calendar, Type, CheckSquare, Sparkles, AlertCircle, HelpCircle,
  Copy, ExternalLink, Code2, AlertTriangle, Table, Check, ArrowDown, Cpu,
  Link2, AlertOctagon
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Current Course & Week context
const currentCourseId = '31901-2007'
const currentWeek = 2

// UI States
const showPdfModal = ref(false)
const showTeacherModal = ref(false)
const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'
const activeTab = ref('gui')   // 'gui' | 'sql'
const activeAnatomyHover = ref(null) // null | 'table' | 'row' | 'column' | 'domain'
const copiedCode = ref(false)

// Copy SQL Snippet
const copySql = (text) => {
  navigator.clipboard.writeText(text)
  copiedCode.value = true
  setTimeout(() => copiedCode.value = false, 2000)
}

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกชนิดข้อมูล Supabase)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่ฟิลด์กับ Constraints ที่เหมาะสม)', maxScore: 5, isQuiz: false },
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

// ------------------------------------------------------------------------------
// [GAME 1]: Drag & Drop (จำแนกหมวดหมู่ชนิดข้อมูลใน Supabase - 6 รายการ, เต็ม 6 คะแนน)
// ------------------------------------------------------------------------------
const dragItemsData = [
  { id: 1, text: 'numeric(10, 2) / decimal', type: 'numeric' },
  { id: 2, text: 'text / varchar', type: 'text' },
  { id: 3, text: 'timestamptz (Time Zone)', type: 'special' },
  { id: 4, text: 'int8 (bigint) Auto Identity', type: 'numeric' },
  { id: 5, text: 'uuid (gen_random_uuid)', type: 'special' },
  { id: 6, text: 'char(5) รหัสไปรษณีย์', type: 'text' }
]

const dragZonesData = [
  {
    id: 'numeric',
    title: 'กลุ่มตัวเลข (Numeric Types)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากชนิดข้อมูลตัวเลขมาวางที่นี่'
  },
  {
    id: 'text',
    title: 'กลุ่มข้อความ (Text / String Types)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากชนิดข้อมูลข้อความมาวางที่นี่'
  },
  {
    id: 'special',
    title: 'กลุ่มวันเวลา & คีย์พิเศษ (DateTime & Identifier)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากชนิดพิเศษมาวางที่นี่'
  }
]

// ------------------------------------------------------------------------------
// [GAME 2]: Matching (จับคู่สถานการณ์จริงกับ Data Type & Constraint ที่เหมาะสม - 5 คู่)
// ------------------------------------------------------------------------------
const matchLeftTerms = [
  { id: 'l1', text: '1. รหัสสมาชิกสากล ป้องกันการเดา ID สุ่มอัตโนมัติ', match: 'r1' },
  { id: 'l2', text: '2. ยอดเงินคงเหลือในบัญชี / ราคาสินค้า ป้องกันปัดเศษเพี้ยน', match: 'r2' },
  { id: 'l3', text: '3. อีเมลที่ใช้ล็อกอิน ห้ามว่าง และห้ามซ้ำกันในระบบ', match: 'r3' },
  { id: 'l4', text: '4. วันที่และเวลาที่สร้างเรคคอร์ด บันทึกเวลาสากลอัตโนมัติ', match: 'r4' },
  { id: 'l5', text: '5. จำนวนสินค้าในสต็อก ต้องมากกว่าหรือเท่ากับ 0 เสมอ', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()' },
  { id: 'r2', text: 'numeric(12, 2) NOT NULL CHECK (... >= 0)' },
  { id: 'r3', text: 'text NOT NULL UNIQUE' },
  { id: 'r4', text: 'timestamptz NOT NULL DEFAULT now()' },
  { id: 'r5', text: 'int4 NOT NULL DEFAULT 0 CHECK (stock_qty >= 0)' }
]

// ------------------------------------------------------------------------------
// [GAME 3]: แบบทดสอบหลังเรียน (Post-test 10 ข้อ 4 ตัวเลือก พร้อมเฉลยละเอียด)
// ------------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 1,
    question: "ทำไมในระบบฐานข้อมูล PostgreSQL และ Supabase จึงแนะนำให้จัดเก็บ 'ยอดเงิน/ราคาสินค้า' ด้วย numeric มากกว่า float?",
    options: [
      { id: 'a', text: "เพราะ float ประมวลผลได้ช้ากว่า numeric มาก", isCorrect: false },
      { id: 'b', text: "เพราะ float มีข้อจำกัดเรื่อง Floating-point Rounding Error ทำให้ทศนิยมปัดเศษคลาดเคลื่อน ส่วน numeric ให้ค่าแม่นยำแน่นอน", isCorrect: true },
      { id: 'c', text: "เพราะ float เก็บค่าติดลบไม่ได้", isCorrect: false },
      { id: 'd', text: "เพราะ Supabase ไม่อนุญาตให้ใช้ float ในทุกกรณี", isCorrect: false }
    ],
    explanation: "float ใช้เลขฐานสองแทนทศนิยม จึงเกิดการปัดเศษคลาดเคลื่อนทางคณิตศาสตร์ได้ (เช่น 0.1 + 0.2 != 0.3) สำหรับการเงินจึงต้องใช้ numeric/decimal เสมอ"
  },
  {
    id: 2,
    question: "ข้อใดคือ 'กฎเหล็ก 2 ข้อ' ของ Primary Key (คีย์หลัก) ที่ขาดไม่ได้เด็ดขาด?",
    options: [
      { id: 'a', text: "ต้องเป็นตัวเลขจำนวนเต็ม และต้องเรียงลำดับจากน้อยไปมาก", isCorrect: false },
      { id: 'b', text: "ต้องเป็นค่าที่ไม่ซ้ำซ้อนกันในตาราง (Unique) และห้ามมีค่าว่าง (Not Null)", isCorrect: true },
      { id: 'c', text: "ต้องมีความยาวไม่เกิน 10 ตัวอักษร และต้องเป็นภาษาอังกฤษ", isCorrect: false },
      { id: 'd', text: "ต้องเชื่อมโยงไปยังตารางภายนอก และต้องมีดัชนี Index เสมอ", isCorrect: false }
    ],
    explanation: "Primary Key มีข้อบังคับพื้นฐานตามหลัก Entity Integrity คือ ต้องระบุแต่ละแถวได้อย่างเป็นเอกลักษณ์ (Unique) และต้องมีค่าเสมอ (NOT NULL)"
  },
  {
    id: 3,
    question: "ใน Supabase และ PostgreSQL การจัดเก็บข้อความทั่วไป เช่น ชื่อ-นามสกุล หรือ ที่อยู่ ข้อใดคือ Best Practice ที่แนะนำมากที่สุด?",
    options: [
      { id: 'a', text: "ใช้ char(255) เพื่อให้พื้นที่ตารางคงที่เท่ากันทุกแถว", isCorrect: false },
      { id: 'b', text: "ใช้ text เพราะ PostgreSQL จัดการ Storage Engine ของ text และ varchar มีประสิทธิภาพเท่ากัน ไม่จำเป็นต้องกะความยาวล่วงหน้า", isCorrect: true },
      { id: 'c', text: "ใช้ bytea เพราะปลอดภัยต่อการถูก SQL Injection", isCorrect: false },
      { id: 'd', text: "ใช้ blob เพราะรองรับภาษาไทยได้ดีกว่า", isCorrect: false }
    ],
    explanation: "ใน PostgreSQL ชนิดข้อมูล text, varchar และ varchar(n) ใช้วิธีจัดเก็บแบบเดียวกัน ความเร็วเท่ากัน จึงนิยมใช้ text เพื่อความยืดหยุ่น"
  },
  {
    id: 4,
    question: "เพราะเหตุใด 'หมายเลขโทรศัพท์ (Phone Number)' และ 'เลขบัตรประชาชน 13 หลัก' จึงห้ามเก็บเป็นชนิดข้อมูล integer?",
    options: [
      { id: 'a', text: "เพราะฐานข้อมูลจะปฏิเสธไม่ให้บันทึกถ้ามีเลข 9", isCorrect: false },
      { id: 'b', text: "เพราะตัวเลขเหล่านี้มีเลข 0 นำหน้า ซึ่งชนิด integer จะตัดเลข 0 ตัวหน้าทิ้งทันที และข้อมูลนี้เป็นรหัสระบุตัวตนไม่ได้นำไปคำนวณ", isCorrect: true },
      { id: 'c', text: "เพราะ integer เก็บข้อมูลได้ไม่เกิน 5 หลัก", isCorrect: false },
      { id: 'd', text: "เพราะ Supabase บังคับให้เบอร์โทรศัพท์ต้องเป็น boolean เท่านั้น", isCorrect: false }
    ],
    explanation: "เบอร์โทรศัพท์ขึ้นต้นด้วย 0 เช่น '0812345678' หากเป็น int ระบบจะตัดเลข 0 ทิ้งเหลือ 812345678 และไม่ได้นำไปบวกลบคูณหาร จึงต้องเก็บเป็น text/varchar"
  },
  {
    id: 5,
    question: "ข้อดีสำคัญที่สุดของการเลือกใช้ 'UUID' เป็น Primary Key บนระบบ Cloud DBMS (Supabase) เมื่อเทียบกับ Auto-increment (1, 2, 3...) คืออะไร?",
    options: [
      { id: 'a', text: "ใช้พื้นที่ฮาร์ดดิสก์น้อยกว่าตัวเลขจำนวนเต็ม", isCorrect: false },
      { id: 'b', text: "ป้องกันการคาดเดา ID (Enumeration Attack) และสร้าง ID ได้จาก Client/หลาย Server พร้อมกันโดยไม่ชนกัน", isCorrect: true },
      { id: 'c', text: "ค้นหาข้อมูลได้เร็วกว่าตัวเลข 10 เท่าเสมอ", isCorrect: false },
      { id: 'd', text: "สามารถพิมพ์ด้วยตัวพิมพ์ใหญ่เท่านั้น", isCorrect: false }
    ],
    explanation: "UUID ป้องกันแฮกเกอร์เดารหัส เช่น เปลี่ยน URL จาก /orders/101 เป็น /orders/102 และเหมาะกับระบบคลาวด์แบบกระจายศูนย์ (Distributed Systems)"
  },
  {
    id: 6,
    question: "หากต้องการบันทึกวันเวลาที่สร้างข้อมูล โดยปรับเวลาตามโซนเวลาสากลอัตโนมัติ ควรเลือกชนิดข้อมูลและค่า Default ใดใน Supabase?",
    options: [
      { id: 'a', text: "date และค่าเริ่มต้น '2026-01-01'", isCorrect: false },
      { id: 'b', text: "timestamptz พร้อมค่าเริ่มต้น now()", isCorrect: true },
      { id: 'c', text: "time พร้อมค่าเริ่มต้น CURRENT_DATE", isCorrect: false },
      { id: 'd', text: "varchar(20) พร้อมค่าเริ่มต้น 'today'", isCorrect: false }
    ],
    explanation: "timestamptz (Timestamp with time zone) เก็บเวลาแบบ UTC และแปลงตามโซนเวลาของผู้ใช้ได้อย่างถูกต้อง คู่กับฟังก์ชัน now() หรือ CURRENT_TIMESTAMP"
  },
  {
    id: 7,
    question: "ข้อกำหนด (Constraint) ชนิดใดที่ใช้สำหรับตรวจสอบเงื่อนไขทางตรรกะของข้อมูล เช่น 'ราคาสินค้าต้องมากกว่า 0' หรือ 'อายุต้องอยู่ระหว่าง 15 ถึง 100 ปี'?",
    options: [
      { id: 'a', text: "FOREIGN KEY", isCorrect: false },
      { id: 'b', text: "CHECK Constraint", isCorrect: true },
      { id: 'c', text: "AUTO_INCREMENT", isCorrect: false },
      { id: 'd', text: "NOT NULL", isCorrect: false }
    ],
    explanation: "CHECK Constraint ใช้กำหนดเงื่อนไขทางตรรกะ หากข้อมูลที่ Insert หรือ Update ไม่ผ่านเงื่อนไข ระบบจะปฏิเสธและแจ้ง Error ทันที"
  },
  {
    id: 8,
    question: "ข้อใดอธิบายความแตกต่างระหว่าง 'PRIMARY KEY' และ 'UNIQUE Constraint' ได้ถูกต้อง?",
    options: [
      { id: 'a', text: "PRIMARY KEY ยอมให้มีค่าว่าง (NULL) ได้ 1 แถว ส่วน UNIQUE ห้ามมีค่าว่าง", isCorrect: false },
      { id: 'b', text: "1 ตารางมี PRIMARY KEY ได้เพียงชุดเดียวและห้ามเป็น NULL ส่วน UNIQUE มีได้หลายคอลัมน์ในตารางเดียวกันและยอมให้เป็น NULL ได้", isCorrect: true },
      { id: 'c', text: "UNIQUE ใช้ได้เฉพาะตัวเลข ส่วน PRIMARY KEY ใช้ได้เฉพาะข้อความ", isCorrect: false },
      { id: 'd', text: "ทั้งสองข้อกำหนดทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง", isCorrect: false }
    ],
    explanation: "ตารางมี PK ได้เพียง 1 ตัวและห้ามเป็น NULL แต่สามารถสร้าง UNIQUE Constraint ได้หลายคอลัมน์ (เช่น email, phone) และยอมรับค่า NULL หากไม่ได้ล็อก NOT NULL"
  },
  {
    id: 9,
    question: "คำสั่ง SQL DDL ข้อใดต่อไปนี้สร้างคอลัมน์ auto-increment ที่เป็น Primary Key ตามมาตรฐาน PostgreSQL ยุคใหม่บน Supabase ได้ถูกต้อง?",
    options: [
      { id: 'a', text: "id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY", isCorrect: true },
      { id: 'b', text: "id number AUTO_INCREMENT PRIMARY KEY", isCorrect: false },
      { id: 'c', text: "id integer CHECK (id > 0)", isCorrect: false },
      { id: 'd', text: "id text DEFAULT 'auto'", isCorrect: false }
    ],
    explanation: "มาตรฐาน SQL สากลและ PostgreSQL ยุคใหม่ใช้ GENERATED ALWAYS/BY DEFAULT AS IDENTITY แทนชนิดข้อมูล serial แบบเก่า"
  },
  {
    id: 10,
    question: "หากต้องการเก็บข้อมูล 'สถานะคำสั่งซื้อ' โดยจำกัดให้ใส่ได้เพียง 'pending', 'paid', 'shipped', หรือ 'cancelled' เท่านั้น ควรใช้ข้อกำหนดใด?",
    options: [
      { id: 'a', text: "DEFAULT 'shipped'", isCorrect: false },
      { id: 'b', text: "CHECK (order_status IN ('pending', 'paid', 'shipped', 'cancelled'))", isCorrect: true },
      { id: 'c', text: "UNIQUE (order_status)", isCorrect: false },
      { id: 'd', text: "PRIMARY KEY (order_status)", isCorrect: false }
    ],
    explanation: "การใช้ CHECK ร่วมกับคำสั่ง IN ช่วยควบคุมโดเมนของข้อมูล (Domain Integrity) ป้องกันไม่ให้มีการสะกดคำผิดหรือใส่สถานะที่ไม่ได้รับอนุญาต"
  }
]

// SQL Snippets for Demonstration
const sqlExamples = {
  customers: `-- 1. ตารางลูกค้าและสมาชิก (customers)
CREATE TABLE customers (
  customer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number varchar(15) UNIQUE,
  reward_points int4 NOT NULL DEFAULT 0 CHECK (reward_points >= 0),
  is_active boolean NOT NULL DEFAULT true,
  registered_at timestamptz NOT NULL DEFAULT now()
);`,

  products: `-- 2. ตารางสินค้าและสต็อก (products)
CREATE TABLE products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sku_barcode varchar(20) NOT NULL UNIQUE,
  product_title text NOT NULL,
  cost_price numeric(10, 2) NOT NULL CHECK (cost_price >= 0),
  sell_price numeric(10, 2) NOT NULL CHECK (sell_price >= cost_price),
  stock_qty int4 NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  expiry_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);`,

  orders: `-- 3. ตารางคำสั่งซื้อ (orders)
CREATE TABLE orders (
  order_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(customer_id),
  total_amount numeric(12, 2) NOT NULL CHECK (total_amount >= 0),
  order_status text NOT NULL DEFAULT 'pending' 
    CHECK (order_status IN ('pending', 'paid', 'shipped', 'cancelled')),
  shipping_address text NOT NULL,
  order_date timestamptz NOT NULL DEFAULT now()
);`,

  order_items: `-- 4. ตารางรายการสินค้าในคำสั่งซื้อ (order_items) - ตัวอย่าง Composite PK
CREATE TABLE order_items (
  order_id uuid NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity int4 NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, product_id)
);`
}
</script>

<template>
  <div class="w-full space-y-10 pb-16 px-4 md:px-8">

    <!-- Hero / Header Section -->
    <div
      class="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[280px] border border-emerald-500/20">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
        <Database class="w-[420px] h-[420px] -translate-y-16 translate-x-16" />
      </div>
      <div class="relative z-10 w-full md:w-5/6 lg:w-3/4 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs uppercase tracking-wider border border-emerald-400/30 shadow-sm backdrop-blur-sm">
            สัปดาห์ที่ 2
          </span>
          <span class="px-3 py-1 bg-white/10 text-slate-200 text-xs rounded-full font-medium border border-white/10">
            Cloud DBMS & PostgreSQL Architecture
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
          ชนิดข้อมูล คีย์หลัก และข้อกำหนดใน Supabase<br />
          <span class="text-2xl sm:text-3xl md:text-4xl text-emerald-400 font-bold font-mono">
            (Data Types, Primary Key & Constraints)
          </span>
        </h1>
        <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          เจาะลึกสถาปัตยกรรมชนิดข้อมูลของ PostgreSQL บนแพลตฟอร์ม Supabase Cloud, การออกแบบ Primary Key แบบ Auto-increment vs UUID, 
          และการบังคับใช้ Integrity Constraints (NOT NULL, UNIQUE, CHECK, DEFAULT) เพื่อสร้างฐานข้อมูลที่มีความปลอดภัยและเสถียรภาพสูงสุด
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Chapter Objectives & Competencies Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">จุดประสงค์และสมรรถนะประจำสัปดาห์ที่ 2</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500 group-hover:h-2 transition-all"></div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <BookOpen class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-800 text-lg">จุดประสงค์การเรียนรู้</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>จำแนกคุณสมบัติและเลือกใช้ชนิดข้อมูลใน Supabase ได้ถูกต้อง</li>
            <li>อธิบายกฎเหล็กและการเลือกใช้ Primary Key (Auto-inc vs UUID) ได้</li>
            <li>กำหนดข้อกำหนด (Constraints) เพื่อป้องกันข้อมูลผิดพลาดได้สมบูรณ์</li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-teal-500 group-hover:h-2 transition-all"></div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Award class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-800 text-lg">สมรรถนะรายวิชา</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>ออกแบบ Relational Schema บน Supabase Table Editor และ SQL DDL</li>
            <li>ประยุกต์ใช้ Domain Constraint (CHECK, ENUM) กับเงื่อนไขทางธุรกิจ</li>
            <li>ตรวจสอบและรักษาความคงสภาพของข้อมูล (Data Integrity) ตามมาตรฐาน</li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-cyan-500 group-hover:h-2 transition-all"></div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
              <Lightbulb class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-800 text-lg">ผลลัพธ์การเรียนรู้ (Outcome)</h3>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed bg-cyan-50/50 p-3.5 rounded-xl border border-cyan-100/50">
            ผู้เรียนสามารถวิเคราะห์กรณีศึกษา 3 ตารางหลัก แล้วเลือกชนิดข้อมูล กำหนด Primary Key และระบุ Constraints พร้อมเขียนคำสั่ง SQL ได้อย่างสมบูรณ์แบบ
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION 0: Table Anatomy & The 3 Pillars of Data Integrity -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Database class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">บทนำ: กายวิภาคของตารางและ 3 เสาหลักความสมบูรณ์ของข้อมูล</h2>
          <p class="text-gray-500 text-sm">ทำความเข้าใจโครงสร้างเชิงตรรกะ (Logical Schema) และกฎเกณฑ์ความปลอดภัยของข้อมูลในระบบ Relational DBMS</p>
        </div>
      </div>

      <!-- Relational Terminology Cards (Hover to Highlight Table) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Relation / Table -->
        <div
          @mouseenter="activeAnatomyHover = 'table'"
          @mouseleave="activeAnatomyHover = null"
          @click="activeAnatomyHover = (activeAnatomyHover === 'table' ? null : 'table')"
          class="bg-white p-5 rounded-2xl border shadow-sm space-y-2 cursor-pointer transition-all duration-200 select-none"
          :class="[
            activeAnatomyHover === 'table'
              ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-md bg-emerald-50/50 -translate-y-1'
              : 'border-gray-200 hover:border-emerald-400 hover:shadow-sm'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-bold rounded-lg border border-emerald-200/50">Relation / Table</span>
            <span v-if="activeAnatomyHover === 'table'" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
              กำลังไฮไลต์
            </span>
          </div>
          <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
            <Table class="w-4 h-4 text-emerald-600" /> ตาราง (Table)
          </h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            โครงสร้างสองมิติที่เก็บข้อมูลของเอนทิตี (Entity) เช่น ตารางลูกค้า <code class="font-mono bg-gray-100 px-1 rounded">customers</code> หรือตารางสินค้า <code class="font-mono bg-gray-100 px-1 rounded">products</code>
          </p>
          <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
            <span class="flex items-center gap-1"><MousePointer2 class="w-3 h-3 text-emerald-600" /> ชี้เพื่อดูตารางทั้งหมด</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </div>

        <!-- Card 2: Tuple / Row -->
        <div
          @mouseenter="activeAnatomyHover = 'row'"
          @mouseleave="activeAnatomyHover = null"
          @click="activeAnatomyHover = (activeAnatomyHover === 'row' ? null : 'row')"
          class="bg-white p-5 rounded-2xl border shadow-sm space-y-2 cursor-pointer transition-all duration-200 select-none"
          :class="[
            activeAnatomyHover === 'row'
              ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-md bg-blue-50/50 -translate-y-1'
              : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 bg-blue-50 text-blue-700 font-mono text-xs font-bold rounded-lg border border-blue-200/50">Tuple / Row</span>
            <span v-if="activeAnatomyHover === 'row'" class="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">
              กำลังไฮไลต์
            </span>
          </div>
          <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
            <Layers class="w-4 h-4 text-blue-600" /> แถว / เรคคอร์ด (Record)
          </h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            ข้อมูลของสิ่งนั้นๆ 1 รายการเต็มแถวในแนวนอน เช่น ข้อมูลลูกค้านายสมชายคนเดียวครบทุกฟิลด์
          </p>
          <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
            <span class="flex items-center gap-1"><MousePointer2 class="w-3 h-3 text-blue-600" /> ชี้เพื่อดูแถวแนวนอน</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </div>

        <!-- Card 3: Attribute / Column -->
        <div
          @mouseenter="activeAnatomyHover = 'column'"
          @mouseleave="activeAnatomyHover = null"
          @click="activeAnatomyHover = (activeAnatomyHover === 'column' ? null : 'column')"
          class="bg-white p-5 rounded-2xl border shadow-sm space-y-2 cursor-pointer transition-all duration-200 select-none"
          :class="[
            activeAnatomyHover === 'column'
              ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-md bg-purple-50/50 -translate-y-1'
              : 'border-gray-200 hover:border-purple-400 hover:shadow-sm'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 bg-purple-50 text-purple-700 font-mono text-xs font-bold rounded-lg border border-purple-200/50">Attribute / Column</span>
            <span v-if="activeAnatomyHover === 'column'" class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full animate-pulse">
              กำลังไฮไลต์
            </span>
          </div>
          <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
            <Hash class="w-4 h-4 text-purple-600" /> คอลัมน์ / ฟิลด์ (Field)
          </h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            คุณลักษณะเฉพาะ 1 อย่างในแนวตั้ง เช่น คอลัมน์ <code class="font-mono bg-gray-100 px-1 rounded">email</code> หรือ <code class="font-mono bg-gray-100 px-1 rounded">price</code>
          </p>
          <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <span class="flex items-center gap-1"><MousePointer2 class="w-3 h-3 text-purple-600" /> ชี้เพื่อดูคอลัมน์แนวตั้ง</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </div>

        <!-- Card 4: Domain Constraint -->
        <div
          @mouseenter="activeAnatomyHover = 'domain'"
          @mouseleave="activeAnatomyHover = null"
          @click="activeAnatomyHover = (activeAnatomyHover === 'domain' ? null : 'domain')"
          class="bg-white p-5 rounded-2xl border shadow-sm space-y-2 cursor-pointer transition-all duration-200 select-none"
          :class="[
            activeAnatomyHover === 'domain'
              ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md bg-amber-50/50 -translate-y-1'
              : 'border-gray-200 hover:border-amber-400 hover:shadow-sm'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 bg-amber-50 text-amber-700 font-mono text-xs font-bold rounded-lg border border-amber-200/50">Domain Constraint</span>
            <span v-if="activeAnatomyHover === 'domain'" class="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
              กำลังไฮไลต์
            </span>
          </div>
          <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
            <Shield class="w-4 h-4 text-amber-600" /> โดเมน (Domain)
          </h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            ชนิดข้อมูลและขอบเขตค่าที่อนุญาตให้ใส่ได้ เช่น อายุต้องเป็นตัวเลขจำนวนเต็มบวก 15 ถึง 100 เท่านั้น
          </p>
          <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
            <span class="flex items-center gap-1"><MousePointer2 class="w-3 h-3 text-amber-600" /> ชี้เพื่อดูขอบเขตโดเมน</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <!-- INTERACTIVE EXAMPLE TABLE: Real-time visual anatomy demonstrator -->
      <div
        class="bg-white rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 transition-all duration-300"
        :class="[
          activeAnatomyHover === 'table'
            ? 'border-emerald-500 ring-4 ring-emerald-400/20 shadow-lg'
            : 'border-gray-200'
        ]"
      >
        <!-- Table Mockup Top Toolbar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Table class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-gray-900 text-sm font-mono">ตารางตัวอย่าง: customers (เอนทิตีลูกค้า)</h4>
                <span class="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">public.customers</span>
              </div>
              <p class="text-xs text-gray-500">จำลองข้อมูลจริงเพื่อศึกษาองค์ประกอบเชิงกายวิภาคของระบบจัดการฐานข้อมูลเชิงสัมพันธ์</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="px-2.5 py-1 bg-purple-50 text-purple-700 font-mono font-bold rounded-lg border border-purple-200/50">
              5 Attributes (คอลัมน์)
            </span>
            <span class="px-2.5 py-1 bg-blue-50 text-blue-700 font-mono font-bold rounded-lg border border-blue-200/50">
              3 Tuples (แถว)
            </span>
          </div>
        </div>

        <!-- Dynamic Live Feedback Bar -->
        <div class="transition-all duration-200">
          <div
            v-if="!activeAnatomyHover"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/60 text-xs text-gray-600"
          >
            <div class="flex items-center gap-2 font-medium">
              <MousePointer2 class="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>นำเมาส์ไปชี้ (Hover) ที่การ์ดทั้ง 4 ด้านบน เพื่อดูไฮไลต์ตำแหน่งจริงในตารางแบบสดๆ</span>
            </div>
            <span class="text-[11px] text-gray-400 font-mono">Interactive Anatomy</span>
          </div>

          <!-- Highlight: Table -->
          <div
            v-else-if="activeAnatomyHover === 'table'"
            class="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium"
          >
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded">Relation / Table</span>
              <span><strong>ตาราง (Table):</strong> ไฮไลต์พื้นที่ทั้งหมดของตาราง <code class="font-mono bg-white px-1 rounded text-emerald-800">customers</code> ซึ่งเป็นโครงสร้างสองมิติที่จัดเก็บกลุ่มข้อมูลของเอนทิตีนี้</span>
            </div>
            <span class="text-[11px] font-mono text-emerald-700">กรอบเขียวรอบตารางทั้งหมด</span>
          </div>

          <!-- Highlight: Row -->
          <div
            v-else-if="activeAnatomyHover === 'row'"
            class="flex items-center justify-between p-3 bg-blue-50 border border-blue-300 rounded-2xl text-xs text-blue-900 font-medium"
          >
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded">Tuple / Row</span>
              <span><strong>แถว (Row / Record):</strong> ไฮไลต์ข้อมูลแนวนอน 1 รายการเต็มแถว เช่น ข้อมูลลูกค้านายสมชาย ครบทุก 5 คุณลักษณะ</span>
            </div>
            <span class="text-[11px] font-mono text-blue-700">แถบสีฟ้าแนวนอน (Row 1)</span>
          </div>

          <!-- Highlight: Column -->
          <div
            v-else-if="activeAnatomyHover === 'column'"
            class="flex items-center justify-between p-3 bg-purple-50 border border-purple-300 rounded-2xl text-xs text-purple-900 font-medium"
          >
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-purple-600 text-white font-mono text-[10px] font-bold rounded">Attribute / Column</span>
              <span><strong>คอลัมน์ (Column / Field):</strong> ไฮไลต์คุณลักษณะเฉพาะ 1 เรื่องในแนวตั้ง เช่น คอลัมน์ <code class="font-mono bg-white px-1 rounded text-purple-800">email</code> ของลูกค้าทุกคน</span>
            </div>
            <span class="text-[11px] font-mono text-purple-700">แถบสีม่วงแนวตั้ง (Column email)</span>
          </div>

          <!-- Highlight: Domain -->
          <div
            v-else-if="activeAnatomyHover === 'domain'"
            class="flex items-center justify-between p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 font-medium"
          >
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-amber-600 text-white font-mono text-[10px] font-bold rounded">Domain Constraint</span>
              <span><strong>โดเมน (Domain):</strong> ไฮไลต์ขอบเขตชนิดข้อมูลและเงื่อนไข เช่น คอลัมน์ <code class="font-mono bg-white px-1 rounded text-amber-800">age</code> ต้องเป็น <code class="font-mono">int2</code> และอยู่ในช่วง <strong>15 ถึง 100 ปี</strong></span>
            </div>
            <span class="text-[11px] font-mono text-amber-700">ช่องสีส้ม (Domain Range: 15-100)</span>
          </div>
        </div>

        <!-- The Responsive Mockup Table -->
        <div
          class="overflow-x-auto rounded-2xl border transition-all duration-300"
          :class="[
            activeAnatomyHover === 'table' ? 'border-emerald-400 ring-2 ring-emerald-400/40' : 'border-gray-200'
          ]"
        >
          <table class="w-full text-left text-xs font-mono">
            <!-- Table Header (Attributes) -->
            <thead class="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
              <tr>
                <th class="p-3 border-r border-gray-200 text-gray-600">
                  <div class="text-[10px] text-gray-400 font-normal">int8 (PK)</div>
                  <span>id</span>
                </th>
                <th class="p-3 border-r border-gray-200 text-gray-600">
                  <div class="text-[10px] text-gray-400 font-normal">text</div>
                  <span>full_name</span>
                </th>
                <!-- Highlight Column: email -->
                <th
                  class="p-3 border-r transition-all duration-200"
                  :class="[
                    activeAnatomyHover === 'column'
                      ? 'bg-purple-100 border-x-2 border-purple-500 text-purple-900 shadow-inner'
                      : 'border-gray-200 text-gray-600'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[10px]" :class="activeAnatomyHover === 'column' ? 'text-purple-700 font-bold' : 'text-gray-400 font-normal'">varchar(100)</span>
                    <span v-if="activeAnatomyHover === 'column'" class="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-sans">1 Column</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>email</span>
                  </div>
                </th>
                <!-- Highlight Domain: age -->
                <th
                  class="p-3 border-r transition-all duration-200"
                  :class="[
                    activeAnatomyHover === 'domain'
                      ? 'bg-amber-100 border-x-2 border-amber-500 text-amber-900'
                      : 'border-gray-200 text-gray-600'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[10px]" :class="activeAnatomyHover === 'domain' ? 'text-amber-800 font-bold' : 'text-gray-400 font-normal'">int2 (15-100)</span>
                    <span v-if="activeAnatomyHover === 'domain'" class="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-sans">Domain</span>
                  </div>
                  <span>age</span>
                </th>
                <th class="p-3 text-gray-600">
                  <div class="text-[10px] text-gray-400 font-normal">numeric(10,2)</div>
                  <span>balance</span>
                </th>
              </tr>
            </thead>

            <!-- Table Body (Tuples / Records) -->
            <tbody class="divide-y divide-gray-100 bg-white">
              <!-- ROW 1 (Highlighted when hovering 'row') -->
              <tr
                class="transition-all duration-200"
                :class="[
                  activeAnatomyHover === 'row'
                    ? 'bg-blue-100/90 ring-2 ring-blue-500 text-blue-950 font-semibold shadow-sm'
                    : 'hover:bg-gray-50/80'
                ]"
              >
                <td class="p-3 border-r border-gray-100 text-emerald-700 font-bold">
                  <div class="flex items-center gap-1.5">
                    <Key class="w-3.5 h-3.5 text-amber-600" />
                    <span>101</span>
                  </div>
                </td>
                <td class="p-3 border-r border-gray-100 font-sans">สมชาย สายช้อป</td>
                <td
                  class="p-3 border-r transition-all duration-200 font-sans"
                  :class="[
                    activeAnatomyHover === 'column'
                      ? 'bg-purple-100 border-x-2 border-purple-500 text-purple-900 font-bold'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  somchai@email.com
                </td>
                <td
                  class="p-3 border-r transition-all duration-200"
                  :class="[
                    activeAnatomyHover === 'domain'
                      ? 'bg-amber-100 border-x-2 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  <span>24</span>
                  <span v-if="activeAnatomyHover === 'domain'" class="text-[10px] text-amber-800 ml-1 font-sans">(อยู่ในช่วง 15-100)</span>
                </td>
                <td class="p-3 text-right font-mono">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-blue-700 font-bold font-sans" v-if="activeAnatomyHover === 'row'">[1 Tuple / Row]</span>
                    <span class="ml-auto">1,500.00</span>
                  </div>
                </td>
              </tr>

              <!-- ROW 2 -->
              <tr class="hover:bg-gray-50/80 transition-all duration-200">
                <td class="p-3 border-r border-gray-100 text-emerald-700 font-bold">
                  <div class="flex items-center gap-1.5">
                    <Key class="w-3.5 h-3.5 text-amber-600" />
                    <span>102</span>
                  </div>
                </td>
                <td class="p-3 border-r border-gray-100 font-sans">สมหญิง มั่นคง</td>
                <td
                  class="p-3 border-r transition-all duration-200 font-sans"
                  :class="[
                    activeAnatomyHover === 'column'
                      ? 'bg-purple-100 border-x-2 border-purple-500 text-purple-900 font-bold'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  somying@email.com
                </td>
                <td
                  class="p-3 border-r transition-all duration-200"
                  :class="[
                    activeAnatomyHover === 'domain'
                      ? 'bg-amber-100 border-x-2 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  <span>29</span>
                  <span v-if="activeAnatomyHover === 'domain'" class="text-[10px] text-amber-800 ml-1 font-sans">(อยู่ในช่วง 15-100)</span>
                </td>
                <td class="p-3 text-right font-mono">8,250.50</td>
              </tr>

              <!-- ROW 3 -->
              <tr class="hover:bg-gray-50/80 transition-all duration-200">
                <td class="p-3 border-r border-gray-100 text-emerald-700 font-bold">
                  <div class="flex items-center gap-1.5">
                    <Key class="w-3.5 h-3.5 text-amber-600" />
                    <span>103</span>
                  </div>
                </td>
                <td class="p-3 border-r border-gray-100 font-sans">กิตติศักดิ์ เจริญ</td>
                <td
                  class="p-3 border-r transition-all duration-200 font-sans"
                  :class="[
                    activeAnatomyHover === 'column'
                      ? 'bg-purple-100 border-x-2 border-purple-500 text-purple-900 font-bold'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  kittisak@email.com
                </td>
                <td
                  class="p-3 border-r transition-all duration-200"
                  :class="[
                    activeAnatomyHover === 'domain'
                      ? 'bg-amber-100 border-x-2 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                      : 'border-gray-100 text-gray-700'
                  ]"
                >
                  <span>19</span>
                  <span v-if="activeAnatomyHover === 'domain'" class="text-[10px] text-amber-800 ml-1 font-sans">(อยู่ในช่วง 15-100)</span>
                </td>
                <td class="p-3 text-right font-mono">450.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend Footer -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-gray-500 border-t border-gray-100">
          <div class="flex flex-wrap items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
              <strong>Relation:</strong> ทั้งตาราง 2 มิติ
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-blue-500 inline-block"></span>
              <strong>Tuple:</strong> ข้อมูลแนวนอน 1 แถว
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-purple-500 inline-block"></span>
              <strong>Attribute:</strong> คอลัมน์แนวตั้ง
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-amber-500 inline-block"></span>
              <strong>Domain:</strong> ขอบเขตและชนิดข้อมูล
            </span>
          </div>
          <span class="font-mono text-gray-400 text-[10px]">RDBMS Standard Conceptual Model</span>
        </div>
      </div>

      <!-- 3 Pillars of Data Integrity Banner -->
      <div class="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-6 border border-emerald-500/20">
        <div class="border-b border-emerald-500/20 pb-4">
          <span class="text-xs uppercase font-bold text-emerald-400 tracking-wider">ทฤษฎีระบบฐานข้อมูลสากล (Database Integrity Theory)</span>
          <h3 class="text-xl sm:text-2xl font-black mt-1 text-white">3 เสาหลักความคงสภาพและความสมบูรณ์ของข้อมูล (The 3 Pillars of Data Integrity)</h3>
          <p class="text-slate-300 text-xs sm:text-sm mt-1">
            เหตุผลสำคัญที่สุดที่ระบบจัดการฐานข้อมูล (DBMS) ถูกคิดค้นขึ้นมาแทนที่ Excel หรือแฟ้มข้อมูล คือการมีกลไกตรวจสอบความถูกต้อง 3 ระดับนี้:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2.5 backdrop-blur-sm">
            <div class="flex items-center gap-2 text-emerald-400 font-bold">
              <span class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs border border-emerald-400/30">1</span>
              <h4>Entity Integrity</h4>
            </div>
            <p class="text-xs font-bold text-slate-200">ความสมบูรณ์ระดับเอนทิตี</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              ทุกแถวในตารางต้องสามารถระบุตัวตนได้อย่างไม่ซ้ำซ้อน และคอลัมน์ที่เป็นคีย์หลัก <strong>ห้ามมีค่าว่าง (NOT NULL)</strong> เด็ดขาด
            </p>
            <div class="pt-2">
              <span class="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">บังคับใช้ด้วย: PRIMARY KEY</span>
            </div>
          </div>

          <div class="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2.5 backdrop-blur-sm">
            <div class="flex items-center gap-2 text-blue-400 font-bold">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-400/30">2</span>
              <h4>Domain Integrity</h4>
            </div>
            <p class="text-xs font-bold text-slate-200">ความสมบูรณ์ระดับโดเมน</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              ค่าในแต่ละคอลัมน์ต้องถูกต้องตรงตามชนิดข้อมูล รูปแบบ และเงื่อนไขที่กำหนด เช่น สต็อกห้ามติดลบ อีเมลต้องมี @
            </p>
            <div class="pt-2">
              <span class="text-[11px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">บังคับใช้ด้วย: DATA TYPES, CHECK, NOT NULL</span>
            </div>
          </div>

          <div class="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2.5 backdrop-blur-sm">
            <div class="flex items-center gap-2 text-purple-400 font-bold">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs border border-purple-400/30">3</span>
              <h4>Referential Integrity</h4>
            </div>
            <p class="text-xs font-bold text-slate-200">ความสมบูรณ์ระดับการอ้างอิง</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              ความสัมพันธ์ระหว่างตารางต้องถูกต้อง คีย์นอก (Foreign Key) ต้องชี้ไปยังคีย์หลักที่มีอยู่จริง ป้องกันไม่ให้มีข้อมูลลูกกำพร้า (Orphan Rows)
            </p>
            <div class="pt-2">
              <span class="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">บังคับใช้ด้วย: FOREIGN KEY (REFERENCES)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 1: Supabase Data Types Deep Dive -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Binary class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">1. ชนิดข้อมูลใน Supabase & PostgreSQL (Engineering Deep Dive)</h2>
          <p class="text-gray-500 text-sm">การเลือกชนิดข้อมูลที่ถูกต้องส่งผลโดยตรงต่อพื้นที่จัดเก็บในหน่วยความจำ (RAM/Disk) ความเร็วของ B-Tree Index และความปลอดภัยของแอปพลิเคชัน</p>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- 1. Numeric Types -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Hash class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-lg">กลุ่มตัวเลข (Numeric Types)</h3>
              <p class="text-xs text-gray-500">จำนวนเต็ม ทศนิยม และการเงิน</p>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-blue-700">
                <span>int2 (smallint)</span>
                <span class="text-xs text-gray-500 font-sans font-normal">2 bytes (16-bit)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">ช่วงค่า -32,768 ถึง 32,767 เหมาะกับอายุ, ลำดับเดือน (1-12), จำนวนชั้น, คะแนนเก็บย่อย ช่วยประหยัด RAM บนตารางขนาดใหญ่</p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-blue-700">
                <span>int4 (integer)</span>
                <span class="text-xs text-gray-500 font-sans font-normal">4 bytes (32-bit)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">ช่วงค่า $\pm 2.14$ พันล้าน (-2,147,483,648 ถึง 2,147,483,647) เหมาะกับสต็อกสินค้า, ยอดแต้มสะสม, คะแนนสอบรวม</p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-blue-700">
                <span>int8 (bigint)</span>
                <span class="text-xs text-gray-500 font-sans font-normal">8 bytes (64-bit)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">ช่วงค่ามหาศาล ($\pm 9 \times 10^{18}$) นิยมใช้เป็น <strong>Auto-increment Primary Key</strong> เพื่อป้องกันเลขล้น</p>
            </div>

            <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <div class="flex items-center justify-between font-mono font-bold text-amber-800">
                <span>numeric(p, s) / decimal</span>
                <span class="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-sans font-bold"><span class="inline-flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-amber-700 text-amber-700" /> มาตรฐานการเงินสากล</span></span>
              </div>
              <p class="text-amber-900 text-xs mt-1 leading-relaxed">
                จัดเก็บแบบ Fixed-point ตัวเลขแม่นยำแน่นอน เช่น <code class="bg-amber-100 px-1 py-0.5 rounded font-mono">numeric(10, 2)</code> (ความยาวรวม 10 หลัก โดยมีทศนิยม 2 หลัก = รองรับยอดเงินสูงสุด 99,999,999.99 บาท)
              </p>
            </div>
          </div>
        </div>

        <!-- 2. Text / String Types -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Type class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-lg">กลุ่มข้อความ (String / Text Types)</h3>
              <p class="text-xs text-gray-500">อักขระ ความยาวคงที่ และข้อความขนาดยาว</p>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-emerald-700">
                <span>char(n)</span>
                <span class="text-xs text-gray-500 font-sans font-normal">Fixed-length</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">ถ้าข้อความสั้นกว่า $n$ จะเติมช่องว่าง (Space) จนครบ เหมาะกับข้อมูลที่ความยาวคงที่แน่นอน 100% เช่น รหัสไปรษณีย์ <code class="bg-gray-200 px-1 rounded">char(5)</code>, รหัสสกุลเงิน <code class="bg-gray-200 px-1 rounded">char(3)</code> ('THB', 'USD')</p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-emerald-700">
                <span>varchar(n)</span>
                <span class="text-xs text-gray-500 font-sans font-normal">Variable with limit</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">เก็บตามความยาวจริง สูงสุดไม่เกิน $n$ ตัวอักษร เช่น หมายเลขโทรศัพท์ <code class="bg-gray-200 px-1 rounded">varchar(15)</code>, ทะเบียนรถ <code class="bg-gray-200 px-1 rounded">varchar(20)</code></p>
            </div>

            <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div class="flex items-center justify-between font-mono font-bold text-emerald-800">
                <span>text</span>
                <span class="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-sans font-bold"><span class="inline-flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" /> แนะนำสูงสุดใน Supabase</span></span>
              </div>
              <p class="text-emerald-900 text-xs mt-1 leading-relaxed">
                เก็บข้อความความยาวไม่จำกัด (สูงสุด 1 GB) ใน PostgreSQL และ Supabase ชนิดข้อมูล <code class="font-mono">text</code> มีความเร็วเท่ากับ <code class="font-mono">varchar</code> ทุกประการ ไม่เปลืองเนื้อที่เกินจริง
              </p>
            </div>

            <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <strong class="inline-flex items-center gap-1"><Lightbulb class="w-4 h-4 text-emerald-700 shrink-0 inline" /> กลไก TOAST ของ PostgreSQL:</strong> หากข้อความในฟิลด์ <code class="font-mono font-bold">text</code> มีขนาดยาวเกิน 2 KB ระบบจะบีบอัดและย้ายไปเก็บที่ Out-of-line storage อัตโนมัติ ทำให้การสแกนตารางหลักรวดเร็วเหมือนเดิม ไม่กินแรม
            </div>
          </div>
        </div>

        <!-- 3. Date & Time Types -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-lg">กลุ่มวันที่และเวลา (Date & Time Types)</h3>
              <p class="text-xs text-gray-500">วัน เวลา และโซนเวลาสากล</p>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-indigo-700">
                <span>date</span>
                <span class="text-xs text-gray-500 font-sans font-normal">YYYY-MM-DD (4 bytes)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">เก็บเฉพาะวันเดือนปี ไม่มีเวลา เหมาะกับ วันเกิด (<code class="bg-gray-200 px-1 rounded">birth_date</code>), วันหมดอายุของสินค้า, วันหยุดราชการ</p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-indigo-700">
                <span>time</span>
                <span class="text-xs text-gray-500 font-sans font-normal">HH:MM:SS (8 bytes)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">เก็บเฉพาะเวลา ไม่มีวันที่ เหมาะกับเวลาเปิด-ปิดร้านค้า (<code class="bg-gray-200 px-1 rounded">opening_time</code>), ตารางคาบเรียน</p>
            </div>

            <div class="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200">
              <div class="flex items-center justify-between font-mono font-bold text-indigo-800">
                <span>timestamptz</span>
                <span class="text-xs bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-sans font-bold"><span class="inline-flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-indigo-700 text-indigo-700" /> Cloud Standard</span></span>
              </div>
              <p class="text-indigo-900 text-xs mt-1 leading-relaxed">
                <strong>Timestamp with Time Zone:</strong> บันทึกวันเวลาพร้อมเก็บ Offset โซนเวลาสากล (UTC) เมื่อ Client ดึงข้อมูล ระบบจะแปลงเป็นเวลาท้องถิ่นให้อัตโนมัติ นิยมใช้คู่กับ <code class="bg-indigo-100 px-1 rounded font-mono">DEFAULT now()</code>
              </p>
            </div>
          </div>
        </div>

        <!-- 4. Special & Cloud Types -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div class="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Sparkles class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-lg">กลุ่มพิเศษและคลาวด์ (UUID & Boolean)</h3>
              <p class="text-xs text-gray-500">รหัสสากล ค่าความจริง และข้อมูลโครงสร้าง</p>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
              <div class="flex items-center justify-between font-mono font-bold text-purple-800">
                <span>uuid</span>
                <span class="text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-sans font-bold"><span class="inline-flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-purple-700 text-purple-700" /> Supabase Auth Standard</span></span>
              </div>
              <p class="text-purple-900 text-xs mt-1 leading-relaxed">
                รหัสสุ่ม 128 บิต (36 ตัวอักษร เช่น <code class="bg-purple-100 px-1 rounded font-mono text-[11px]">a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11</code>) สุ่มสร้างได้ $5.3 \times 10^{36}$ รูปแบบ ปลอดภัยสูง ไม่ซ้ำใครในโลก
              </p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-purple-700">
                <span>boolean</span>
                <span class="text-xs text-gray-500 font-sans font-normal">1 byte (true / false / null)</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">เก็บค่าจริงหรือเท็จ เช่น <code class="bg-gray-200 px-1 rounded">is_active</code>, <code class="bg-gray-200 px-1 rounded">is_verified</code> แนะนำให้ใส่ <code class="bg-gray-200 px-1 rounded font-mono">NOT NULL DEFAULT false</code></p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between font-mono font-bold text-purple-700">
                <span>jsonb</span>
                <span class="text-xs text-gray-500 font-sans font-normal">Binary JSON</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">เก็บข้อมูล NoSQL กึ่งโครงสร้าง ค้นหาข้อมูลข้างในและสร้าง GIN Index ได้รวดเร็ว จุดเด่นของ PostgreSQL</p>
            </div>
          </div>
        </div>

      </div>

      <!-- DEEP DIVE ENGINEERING SPOTLIGHTS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <!-- Spotlight 1: Floating Point Math Hazard -->
        <div class="bg-rose-50 rounded-2xl p-6 border border-rose-200 space-y-3">
          <div class="flex items-center gap-2 text-rose-800 font-bold">
            <AlertTriangle class="w-5 h-5 text-rose-600" />
            <h4 class="text-base font-bold">การทดลองสด: ทำไม $0.1 + 0.2 \neq 0.3$ ในระบบคอมพิวเตอร์? (Floating-Point Hazard)</h4>
          </div>
          <p class="text-xs text-rose-950 leading-relaxed">
            คอมพิวเตอร์เก็บตัวเลขทศนิยมด้วยเลขฐานสอง (มาตรฐาน IEEE 754) ซึ่งเลข $0.1$ และ $0.2$ แปลงเป็นฐานสองจะได้เลขซ้ำไม่รู้จบ จึงเกิด <strong>Rounding Error</strong> ขึ้น:
          </p>
          <div class="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs space-y-1.5 border border-slate-800">
            <div class="text-rose-400">-- [FAIL] ถ้าใช้ float กับการเงิน</div>
            <div>SELECT (0.1::float8 + 0.2::float8) = 0.3::float8;</div>
            <div class="text-gray-400 pl-4"><ArrowRight class="w-3.5 h-3.5 text-rose-400 inline mr-1" /> ผลลัพธ์: <span class="text-rose-400 font-bold">FALSE</span> (เพราะคำนวณได้ 0.30000000000000004)</div>
            <div class="text-emerald-400 pt-1">-- [PASS] ต้องใช้ numeric สำหรับการเงินเสมอ</div>
            <div>SELECT (0.1::numeric + 0.2::numeric) = 0.3::numeric;</div>
            <div class="text-gray-400 pl-4"><ArrowRight class="w-3.5 h-3.5 text-emerald-400 inline mr-1" /> ผลลัพธ์: <span class="text-emerald-400 font-bold">TRUE</span> (ได้ 0.3 แม่นยำ 100%)</div>
          </div>
          <p class="text-xs font-bold text-rose-900">
            <AlertTriangle class="w-4 h-4 text-rose-600 inline mr-1 shrink-0" /> <strong>กฎเหล็ก:</strong> ยอดเงิน, ราคาสินค้า, ภาษี VAT, ดอกเบี้ย ต้องใช้ <code class="font-mono bg-rose-200 px-1 rounded">numeric(p, s)</code> เท่านั้น!
          </p>
        </div>

        <!-- Spotlight 2: YouTube Gangnam Style Bug -->
        <div class="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-3">
          <div class="flex items-center gap-2 text-amber-800 font-bold">
            <Cpu class="w-5 h-5 text-amber-600" />
            <h4 class="text-base font-bold">กรณีศึกษาประวัติศาสตร์: YouTube Gangnam Style Bug (32-bit Integer Overflow)</h4>
          </div>
          <p class="text-xs text-amber-950 leading-relaxed">
            เดิมที YouTube ใช้ตัวนับยอดวิวเป็น <strong>32-bit Signed Integer (int4)</strong> ซึ่งเก็บค่าสูงสุดได้ $2,147,483,647$ ครั้ง แต่ในเดือนธันวาคม ปี 2014 มิวสิควิดีโอเพลง "Gangnam Style" ของศิลปิน PSY มียอดวิวพุ่งเกินขีดจำกัดนี้ ทำให้ตัวนับเกิดอาการ <strong>Integer Overflow</strong> และตีกลับเป็นค่าติดลบ!
          </p>
          <div class="p-3 bg-amber-100/70 rounded-xl text-xs text-amber-900 font-mono space-y-1 border border-amber-200">
            <div>32-bit max:  2,147,483,647  (int4) [OVERFLOW ล้นทะลุกลายเป็นติดลบ]</div>
            <div class="text-emerald-800 font-bold">64-bit max:  9,223,372,036,854,775,807 (int8 / bigint)</div>
          </div>
          <p class="text-xs text-amber-900">
            <Lightbulb class="w-4 h-4 text-amber-500 inline mr-1 shrink-0" /> <strong>บทเรียนสำหรับสถาปนิกฐานข้อมูล:</strong> รหัส Auto-increment Primary Key ของตารางหลัก หรือระบบที่คาดว่าจะมี Transaction มหาศาล ให้เลือกใช้ <strong>int8 (bigint)</strong> เสมอ
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Primary Key & Foreign Key Deep Dive -->
    <section class="space-y-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-amber-100 rounded-xl text-amber-700 shadow-sm">
          <Key class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">2. เจาะลึกคีย์หลัก (Primary Key: PK) และ คีย์นอก (Foreign Key: FK)</h2>
          <p class="text-gray-500 text-sm">หัวใจสำคัญที่สุดในการสร้างฐานข้อมูลเชิงสัมพันธ์ (Relational Model) ที่ถูกต้อง ปลอดภัย และมีประสิทธิภาพสูงสุด</p>
        </div>
      </div>

      <!-- 2.1 PRIMARY KEY DEEP DIVE -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg text-xs font-mono">CORE CONCEPT 1</span>
          <h3 class="text-xl sm:text-2xl font-black text-gray-900 mt-2 flex items-center gap-2">
            <Key class="w-6 h-6 text-amber-600" />
            Primary Key (PK - คีย์หลัก) คืออะไร?
          </h3>
          <p class="text-gray-600 text-sm mt-1 leading-relaxed">
            <strong>คีย์หลัก (Primary Key)</strong> คือ คอลัมน์ (หรือกลุ่มของคอลัมน์) ที่ถูกกำหนดขึ้นเพื่อทำหน้าที่เป็น <strong>"ตัวระบุเอกลักษณ์เฉพาะ (Unique Identifier)"</strong> เพียงหนึ่งเดียวสำหรับแต่ละแถว (Tuple/Record) ในตาราง
          </p>
        </div>

        <!-- Real World Analogy -->
        <div class="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="p-3 bg-amber-200 text-amber-900 rounded-xl shrink-0"><Lightbulb class="w-6 h-6 text-amber-900" /></div>
          <div class="space-y-1 text-xs text-amber-950">
            <h4 class="font-bold text-sm text-amber-900">เปรียบเทียบกับชีวิตจริงให้เห็นภาพ:</h4>
            <p class="leading-relaxed">
              เปรียบเสมือน <strong>"เลขประจำตัวประชาชน 13 หลัก"</strong> ของคนไทย หรือ <strong>"รหัสนักศึกษา"</strong> ในวิทยาลัย 
              แม้คนสองคนจะมีชื่อ-นามสกุล วันเกิด และที่อยู่เหมือนกันทุกประการ แต่รหัสประจำตัวจะไม่มีทางซ้ำกัน ทำให้ระบบสามารถแยกแยะคนทั้งสองออกจากกันได้อย่างเด็ดขาด 100%
            </p>
          </div>
        </div>

        <!-- 2 Inviolable Rules -->
        <div>
          <h4 class="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            <Shield class="w-5 h-5 text-emerald-600" />
            กฎเหล็ก 2 ข้อของ Primary Key (The 2 Inviolable Rules)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-emerald-900 text-sm flex items-center gap-1.5 font-mono">
                <Check class="w-4 h-4 text-emerald-700" /> 1. Uniqueness (ห้ามซ้ำกันเด็ดขาด)
              </span>
              <p class="text-emerald-950 leading-relaxed">
                ค่าในคอลัมน์ PK ของแต่ละแถวต้องแตกต่างกัน ห้ามมีค่าซ้ำกันในตารางเดียวกันแม้แต่แถวเดียว หากใครพยายาม Insert ข้อมูลที่ PK ซ้ำ ระบบ Database จะปฏิเสธทันที
              </p>
            </div>
            <div class="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-rose-900 text-sm flex items-center gap-1.5 font-mono">
                <XCircle class="w-4 h-4 text-rose-700" /> 2. Entity Integrity / NOT NULL (ห้ามว่างเด็ดขาด)
              </span>
              <p class="text-rose-950 leading-relaxed">
                ทุกแถวที่ถูกบันทึกลงตารางต้องมีค่า PK เสมอ จะปล่อยเป็นค่าว่าง (NULL) ไม่ได้ เพราะถ้าไม่มีค่า ระบบจะไม่รู้ว่าจะระบุตัวตนของข้อมูลแถวนั้นได้อย่างไร
              </p>
            </div>
          </div>
        </div>

        <!-- Why PK is Critical: 5 Reasons -->
        <div>
          <h4 class="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-amber-600" />
            ทำไม Primary Key ถึงสำคัญมาก? (5 ความสำคัญที่ขาดไม่ได้)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">1</span>
                ป้องกันความกำกวมของข้อมูล
              </span>
              <p class="text-gray-600 leading-relaxed">
                หากไม่มี PK แล้วมีลูกค้าชื่อ "สมชาย ใจดี" สมัครเข้ามา 2 คน ระบบจะไม่สามารถแยกแยะได้เลยว่าใครเป็นใคร และอาจส่งของผิดคน
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">2</span>
                ระบุเป้าหมาย UPDATE และ DELETE
              </span>
              <p class="text-gray-600 leading-relaxed">
                เมื่อต้องการแก้เบอร์โทรหรือลบประวัติ ถ้าสั่งแก้ด้วยชื่อ อาจไปแก้โดนคนอื่น แต่ถ้าใช้ PK เช่น <code class="font-mono bg-white px-1 rounded">WHERE id = ...</code> จะแม่นยำเจาะจง 100%
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">3</span>
                ความเร็วค้นหาระดับแสง (B-Tree Index)
              </span>
              <p class="text-gray-600 leading-relaxed">
                PostgreSQL จะสร้าง Unique B-Tree Index ให้ PK อัตโนมัติ ทำให้การค้นหาข้อมูลจาก 10,000,000 แถว ทำได้ในเวลาเพียงเสี้ยววินาที ($O(\log N)$)
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">4</span>
                เป็นแกนยึดความสัมพันธ์กับตารางอื่น
              </span>
              <p class="text-gray-600 leading-relaxed">
                หากตารางแม่ไม่มี PK ตารางอื่นจะไม่สามารถเชื่อมโยง (Foreign Key) มาหาได้เลย ความเป็นฐานข้อมูลเชิงสัมพันธ์จะพังทลายทันที
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px]">5</span>
                หัวใจของ Supabase & Realtime
              </span>
              <p class="text-gray-600 leading-relaxed">
                Supabase Realtime, Row Level Security (RLS) และ ORM จำเป็นต้องใช้ PK เพื่อระบุแถวในการ Sync หน้าจอมือถือและเว็บแบบสดๆ
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
              <span class="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">6</span>
                Surrogate Key vs Natural Key
              </span>
              <p class="text-gray-600 leading-relaxed">
                แนะนำให้ใช้ <strong>Surrogate Key (คีย์ตัวแทนที่ระบบสร้าง เช่น UUID / Auto-inc)</strong> ดีกว่า Natural Key เช่น เลขบัตร ปชช. เพราะไม่มีวันเปลี่ยนแปลง
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 FOREIGN KEY DEEP DIVE -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded-lg text-xs font-mono">CORE CONCEPT 2</span>
          <h3 class="text-xl sm:text-2xl font-black text-gray-900 mt-2 flex items-center gap-2">
            <Link2 class="w-6 h-6 text-rose-600" />
            Foreign Key (FK - คีย์นอก) คืออะไร?
          </h3>
          <p class="text-gray-600 text-sm mt-1 leading-relaxed">
            <strong>คีย์นอก (Foreign Key)</strong> คือ คอลัมน์ในตารางหนึ่ง (เรียกว่า <strong>ตารางลูก / Child Table</strong>) ที่เก็บค่าของ Primary Key จากอีกตารางหนึ่ง (เรียกว่า <strong>ตารางแม่ / Parent Table</strong>) เพื่อทำหน้าที่เป็น <strong>"สะพานเชื่อมความสัมพันธ์เชิงตรรกะ (Logical Relational Link)"</strong>
          </p>
        </div>

        <!-- Real World Analogy for FK -->
        <div class="p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="p-3 bg-rose-200 text-rose-900 rounded-xl shrink-0"><Link2 class="w-6 h-6 text-rose-900" /></div>
          <div class="space-y-1 text-xs text-rose-950">
            <h4 class="font-bold text-sm text-rose-900">ตัวอย่างการเชื่อมโยงจริง:</h4>
            <p class="leading-relaxed">
              ตารางลูกค้า (<code class="font-mono bg-white px-1 rounded font-bold">customers</code>) มี PK คือ <code class="font-mono bg-white px-1 rounded">customer_id</code><br />
              ตารางคำสั่งซื้อ (<code class="font-mono bg-white px-1 rounded font-bold">orders</code>) จะสร้างคอลัมน์ FK ชื่อ <code class="font-mono bg-white px-1 rounded">customer_id</code> ขึ้นมา เพื่อระบุชัดเจนว่า <em>"คำสั่งซื้อใบนี้ เป็นของลูกค้าคนไหนในตารางลูกค้า"</em>
            </p>
          </div>
        </div>

        <!-- Visual Schema Relationship Diagram (PK -> FK) -->
        <div class="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
              <h4 class="font-bold text-sm text-white">แผนภาพจำลองการเชื่อมโยงจริง (Visual Relational Architecture: 1-to-Many)</h4>
            </div>
            <span class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Parent PK -> Child FK
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <!-- Parent Table (customers) -->
            <div class="bg-slate-900/90 rounded-xl p-4 border border-amber-500/30 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-300 font-mono">ตารางแม่: customers (Parent Table)</span>
                <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Referenced</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-[11px] font-mono">
                  <thead class="text-slate-400 border-b border-slate-800">
                    <tr>
                      <th class="py-1 px-2 text-amber-400">id (PK)</th>
                      <th class="py-1 px-2">full_name</th>
                      <th class="py-1 px-2">phone</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/50 text-slate-300">
                    <tr class="bg-amber-500/10 text-amber-200 font-bold">
                      <td class="py-1.5 px-2 text-amber-300">101</td>
                      <td class="py-1.5 px-2">สมชาย สายช้อป</td>
                      <td class="py-1.5 px-2">081-111-2222</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 px-2 text-amber-400/80">102</td>
                      <td class="py-1.5 px-2">สมหญิง มั่นคง</td>
                      <td class="py-1.5 px-2">089-999-8888</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-[10px] text-amber-300/80 italic">
                * ค่าใน id ต้องไม่ซ้ำ (Unique) และห้ามว่าง (NOT NULL)
              </p>
            </div>

            <!-- Child Table (orders) -->
            <div class="bg-slate-900/90 rounded-xl p-4 border border-rose-500/30 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-rose-300 font-mono">ตารางลูก: orders (Child Table)</span>
                <span class="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">Referencing</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-[11px] font-mono">
                  <thead class="text-slate-400 border-b border-slate-800">
                    <tr>
                      <th class="py-1 px-2 text-slate-300">order_id</th>
                      <th class="py-1 px-2 text-rose-400">customer_id (FK)</th>
                      <th class="py-1 px-2">amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/50 text-slate-300">
                    <tr class="bg-rose-500/10 text-rose-200">
                      <td class="py-1.5 px-2 text-slate-400">ORD-001</td>
                      <td class="py-1.5 px-2 font-bold text-rose-300">101 -> ชี้ไปสมชาย</td>
                      <td class="py-1.5 px-2">1,500.00</td>
                    </tr>
                    <tr class="bg-rose-500/10 text-rose-200">
                      <td class="py-1.5 px-2 text-slate-400">ORD-002</td>
                      <td class="py-1.5 px-2 font-bold text-rose-300">101 -> ชี้ไปสมชาย</td>
                      <td class="py-1.5 px-2">490.00</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 px-2 text-slate-400">ORD-003</td>
                      <td class="py-1.5 px-2 font-bold text-rose-400/80">102 -> ชี้ไปสมหญิง</td>
                      <td class="py-1.5 px-2">3,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-[10px] text-rose-300/80 italic">
                * สังเกต: FK ในตารางลูกซ้ำได้ (ลูกค้า 1 คน สั่งซื้อได้ 2 บิล)
              </p>
            </div>
          </div>

          <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
            <Lightbulb class="w-4 h-4 text-amber-400 shrink-0 inline" />
            <span>
              <strong>สรุปข้อคิด:</strong> ตารางแม่ 1 แถว เชื่อมโยงไปยังตารางลูกได้หลายแถว (<code class="text-emerald-400 font-mono">1:N Relationship</code>) และหากมีใครพยายามบันทึก order ที่มี <code class="text-rose-400 font-mono">customer_id = 999</code> ฐานข้อมูลจะฟ้อง <strong>FK Violation</strong> ทันที
            </span>
          </div>
        </div>

        <!-- Referential Integrity & Orphan Data -->
        <div class="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div class="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertOctagon class="w-5 h-5 text-rose-500" />
            กฎเหล็ก Referential Integrity: ป้องกัน "ข้อมูลลูกกำพร้า" (Prevent Orphan Records)
          </div>
          <p class="text-slate-300 leading-relaxed">
            ค่าที่กรอกลงในช่อง Foreign Key <strong>ต้องเป็นค่าที่มีอยู่จริงในคอลัมน์ Primary Key ของตารางแม่เท่านั้น</strong> (หรือเป็น NULL ได้หากธุรกิจอนุญาต)<br />
            <ArrowRight class="w-4 h-4 text-rose-400 inline mr-1" /> <strong>ตัวอย่าง:</strong> หากในตารางลูกค้ามีลูกค้า ID 1 ถึง ID 10 แล้วมีพนักงานพยายาม Insert ใบสั่งซื้อที่ระบุ <code class="font-mono text-rose-400 font-bold">customer_id = 999</code> เข้ามา ระบบ Database จะสั่งบล็อกและฟ้อง Error ทันที เพราะไม่มีลูกค้าเบอร์ 999 อยู่จริง!
          </p>
        </div>

        <!-- ON DELETE Policies Breakdown -->
        <div>
          <h4 class="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-amber-600" />
            นโยบายเมื่อข้อมูลแม่ถูกลบ (ON DELETE Action Policies ใน PostgreSQL/Supabase)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">ON DELETE RESTRICT</span>
                <span class="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">ค่าเริ่มต้น</span>
              </div>
              <h5 class="font-bold text-gray-800">1. นโยบายห้ามลบเด็ดขาด (ปลอดภัยสูงสุด)</h5>
              <p class="text-gray-600 leading-relaxed">
                หากข้อมูลแม่ยังมีข้อมูลลูกอ้างอิงอยู่ <strong>ระบบจะปฏิเสธไม่ยอมให้ลบข้อมูลแม่เด็ดขาด</strong> เช่น ห้ามลบข้อมูลลูกค้า หากลูกค้ารายนั้นยังมีประวัติการสั่งซื้ออยู่ในระบบ เพื่อรักษาประวัติทางบัญชี
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">ON DELETE CASCADE</span>
                <span class="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">ลบตามลูกโซ่</span>
              </div>
              <h5 class="font-bold text-gray-800">2. นโยบายลบข้อมูลลูกตามไปด้วย</h5>
              <p class="text-gray-600 leading-relaxed">
                เมื่อข้อมูลแม่ถูกลบ <strong>ระบบจะตามไปลบข้อมูลลูกที่เกี่ยวข้องทิ้งทั้งหมดอัตโนมัติ</strong> เช่น เมื่อลบใบสั่งซื้อ (<code class="font-mono">orders</code>) ให้ระบบลบรายการสินค้าในใบนั้น (<code class="font-mono">order_items</code>) ทิ้งตามไปด้วยทันที
              </p>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">ON DELETE SET NULL</span>
                <span class="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">ปรับเป็นว่าง</span>
              </div>
              <h5 class="font-bold text-gray-800">3. นโยบายเปลี่ยนเป็นค่าว่าง (NULL)</h5>
              <p class="text-gray-600 leading-relaxed">
                เมื่อข้อมูลแม่ถูกลบ ให้แก้ค่า FK ในตารางลูกให้เป็น NULL เช่น เมื่อหัวหน้าแผนกลาออก ให้ปรับฟิลด์ <code class="font-mono">manager_id</code> ของลูกน้องเป็นค่าว่างชั่วคราว จนกว่าจะแต่งตั้งคนใหม่
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- 2.3 COMPARISON TABLE: PK VS FK -->
      <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2">
            <Shuffle class="w-5 h-5 text-emerald-700" />
            ตารางสรุปเปรียบเทียบมวยเอก: Primary Key (PK) VS Foreign Key (FK)
          </h3>
          <span class="text-xs bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-full font-bold"><span class="inline-flex items-center gap-1"><Award class="w-3.5 h-3.5 text-emerald-800" /> ออกสอบบ่อย</span></span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th class="p-3.5">มิติการเปรียบเทียบ</th>
                <th class="p-3.5 text-amber-800 bg-amber-50/50">Primary Key (PK - คีย์หลัก)</th>
                <th class="p-3.5 text-rose-800 bg-rose-50/50">Foreign Key (FK - คีย์นอก)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">1. หน้าที่หลัก (Primary Purpose)</td>
                <td class="p-3.5 text-gray-700">ระบุเอกลักษณ์ของแถวข้อมูลในตารางตัวเอง</td>
                <td class="p-3.5 text-gray-700">สร้างสะพานเชื่อมโยงไปยังคีย์หลักของอีกตารางหนึ่ง</td>
              </tr>
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">2. ตำแหน่งที่อยู่ (Table Role)</td>
                <td class="p-3.5 text-gray-700">อยู่ในตารางแม่ (Parent / Referenced Table)</td>
                <td class="p-3.5 text-gray-700">อยู่ในตารางลูก (Child / Referencing Table)</td>
              </tr>
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">3. ความซ้ำซ้อน (Uniqueness)</td>
                <td class="p-3.5 text-emerald-700 font-bold">ห้ามซ้ำกันเด็ดขาด 100%</td>
                <td class="p-3.5 text-blue-700 font-bold">ซ้ำได้ (ลูกค้า 1 คน สามารถมีใบสั่งซื้อได้หลายใบ 1:N)</td>
              </tr>
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">4. การยอมรับค่าว่าง (Nullability)</td>
                <td class="p-3.5 text-rose-700 font-bold">ห้ามเป็น NULL เด็ดขาด (Entity Integrity)</td>
                <td class="p-3.5 text-gray-700">ยอมรับค่า NULL ได้ (หากความสัมพันธ์เป็นแบบ Optional)</td>
              </tr>
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">5. จำนวนที่มีได้ใน 1 ตาราง</td>
                <td class="p-3.5 text-purple-700 font-bold">มีได้เพียง 1 ชุดเท่านั้น ต่อ 1 ตาราง</td>
                <td class="p-3.5 text-purple-700 font-bold">มีได้หลายตัวในตารางเดียวกัน (เช่น orders มีทั้ง customer_id, shipper_id)</td>
              </tr>
              <tr class="hover:bg-gray-50/80">
                <td class="p-3.5 font-bold text-gray-800">6. การสร้าง Index อัตโนมัติ</td>
                <td class="p-3.5 text-emerald-700 font-bold">ระบบสร้าง Unique B-Tree Index ให้อัตโนมัติ</td>
                <td class="p-3.5 text-gray-700">ควรสร้าง Index เพิ่มเติมเองเพื่อความเร็วเวลาคำสั่ง JOIN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2.4 ARCHITECTURE DECISION MATRIX: IDENTITY VS UUID -->
      <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2">
            <Cpu class="w-5 h-5 text-indigo-700" />
            ตารางเปรียบเทียบเชิงสถาปัตยกรรม: Auto-increment Identity (int8) VS UUIDv4
          </h3>
          <span class="text-xs bg-indigo-200/60 text-indigo-900 px-2.5 py-1 rounded-full font-bold"><span class="inline-flex items-center gap-1"><Sparkles class="w-3.5 h-3.5 text-indigo-800" /> เทคนิคเลือก PK ใน Supabase</span></span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th class="p-3">เกณฑ์การพิจารณา (Criteria)</th>
                <th class="p-3 text-blue-700">Auto-increment Identity (int8)</th>
                <th class="p-3 text-purple-700">UUIDv4 (gen_random_uuid)</th>
                <th class="p-3">คำแนะนำในการตัดสินใจ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-800">ขนาดพื้นที่ (Storage Footprint)</td>
                <td class="p-3 text-emerald-700 font-mono font-bold">8 bytes (กะทัดรัดมาก)</td>
                <td class="p-3 text-amber-700 font-mono">16 bytes (ใหญ่กว่า 2 เท่า)</td>
                <td class="p-3 text-gray-600">Auto-inc ประหยัดทั้ง Disk และ RAM Index มากกว่า</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-800">ความปลอดภัย (Security / Enumeration Attack)</td>
                <td class="p-3 text-rose-600 font-bold"><span class="inline-flex items-center gap-1.5"><XCircle class="w-4 h-4 text-rose-600 shrink-0" /> เสี่ยงสูง (เดา ID ถัดไปได้ง่าย)</span></td>
                <td class="p-3 text-emerald-700 font-bold"><span class="inline-flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" /> ปลอดภัยสูงมาก (สุ่มเดาไม่ได้)</span></td>
                <td class="p-3 text-gray-600">หากเปิด API สู่ภายนอก ต้องใช้ UUID เพื่อป้องกันแฮกเกอร์กวาดข้อมูล</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-800">การสร้าง ID จากฝั่ง Client (Offline First)</td>
                <td class="p-3 text-rose-600">ทำไม่ได้ (ต้องรอ Database รัน Sequence)</td>
                <td class="p-3 text-emerald-700 font-bold"><span class="inline-flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" /> ทำได้ทันทีบน Mobile/Web</span></td>
                <td class="p-3 text-gray-600">แอปที่มีโหมด Offline ให้ Client สร้าง UUID ล่วงหน้าก่อนส่ง Sync ได้</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-800">ความเร็ว B-Tree Index (Insertion Performance)</td>
                <td class="p-3 text-emerald-700 font-bold">เร็วสูงสุด (ต่อท้าย B-Tree เรียงลำดับ)</td>
                <td class="p-3 text-amber-700">ช้ากว่าเล็กน้อย (กระจายแบบสุ่มใน Index)</td>
                <td class="p-3 text-gray-600">ในระดับล้านแถว Auto-inc จะเขียนเร็วกว่าเล็กน้อย</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-800">การรวมฐานข้อมูล (Database Merging)</td>
                <td class="p-3 text-rose-600">ชนกันแน่นอน (ID 1 ชนกับ ID 1)</td>
                <td class="p-3 text-emerald-700 font-bold"><span class="inline-flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" /> รวมได้ทันที รหัสไม่ซ้ำกันในโลก</span></td>
                <td class="p-3 text-gray-600">ระบบที่มีหลายสาขาหรือ Distributed DB ต้องใช้ UUID</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Security Highlight & Composite Key Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Security Spotlight: BOLA -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
          <div class="flex items-center gap-2 text-rose-700 font-bold">
            <Shield class="w-5 h-5 text-rose-600" />
            <h4 class="text-base font-bold">ความปลอดภัยระบบ API: ป้องกัน Broken Object Level Authorization (BOLA)</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            ลองนึกภาพระบบร้านค้าที่มี URL ดูใบสั่งซื้อ:
          </p>
          <div class="bg-gray-50 p-3 rounded-xl font-mono text-xs text-gray-700 border border-gray-200 space-y-1">
            <div class="text-rose-600 font-bold flex items-center gap-1.5"><XCircle class="w-4 h-4 text-rose-600 shrink-0" /> แบบ Auto-increment: https://shop.com/api/orders/1001</div>
            <p class="text-[11px] text-gray-500 font-sans">แฮกเกอร์สามารถเขียนโปรแกรมวนลูปเปลี่ยนเลขเป็น 1002, 1003 เพื่อดูข้อมูลลูกค้ารายอื่นทั้งหมดได้ทันที</p>
            <div class="text-emerald-700 font-bold pt-1 flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" /> แบบ UUID: https://shop.com/api/orders/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11</div>
            <p class="text-[11px] text-gray-500 font-sans">แฮกเกอร์ไม่สามารถคาดเดา ID ถัดไปได้เด็ดขาด</p>
          </div>
        </div>

        <!-- Composite Key Card -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
          <div class="flex items-center gap-2 text-indigo-700 font-bold">
            <Layers class="w-5 h-5 text-indigo-600" />
            <h4 class="text-base font-bold">Composite Primary Key (คีย์หลักร่วมหลายคอลัมน์)</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            ในกรณีของ <strong>ตารางเชื่อมความสัมพันธ์แบบ Many-to-Many (M:N)</strong> เช่น ตารางรายการสินค้าในคำสั่งซื้อ (<code class="font-mono bg-gray-100 px-1 rounded">order_items</code>) หรือตารางลงทะเบียนเรียน (<code class="font-mono bg-gray-100 px-1 rounded">enrollments</code>) เราสามารถใช้ 2 คอลัมน์มารวมกันเป็น PK:
          </p>
          <div class="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] border border-slate-800">
            <div>PRIMARY KEY (order_id, product_id)</div>
            <p class="text-gray-400 font-sans mt-1 text-[10px]">
              <ArrowRight class="w-3.5 h-3.5 text-gray-400 inline mr-1" /> ป้องกันไม่ให้มีสินค้าชิ้นเดิมซ้ำ 2 บรรทัดในคำสั่งซื้อเดียวกัน (ถ้าสั่งเพิ่มให้ไปอัปเดตที่ฟิลด์ quantity แทน)
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 3: Integrity Constraints Deep Dive -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-teal-100 rounded-xl text-teal-700 shadow-sm">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">3. ข้อกำหนดความถูกต้องสมบูรณ์ (Integrity Constraints)</h2>
          <p class="text-gray-500 text-sm">กฎระเบียบที่ฐานข้อมูลบังคับใช้ เพื่อป้องกันไม่ให้ข้อมูลขยะหรือข้อมูลที่ผิดพลาดถูกบันทึกลงในระบบ</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- NOT NULL -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-emerald-400 transition-colors">
          <div class="flex items-center gap-2 text-emerald-700 font-bold">
            <span class="px-2 py-0.5 bg-emerald-100 rounded text-xs font-mono">NOT NULL</span>
            <h4>ห้ามว่าง</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            บังคับว่าทุกแถวที่บันทึก <strong>ต้องมีค่าเสมอ</strong> จะปล่อยเป็นค่าว่าง (NULL) ไม่ได้ เพื่อป้องกันปัญหา Three-Valued Logic ใน SQL (<code class="font-mono">NULL = NULL</code> จะได้ผลลัพธ์เป็น Unknown)
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            full_name text NOT NULL
          </div>
          <p class="text-[11px] text-gray-400">ใช้กับ: ชื่อ, อีเมล, ราคาสินค้า, รหัสผ่าน</p>
        </div>

        <!-- UNIQUE -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-blue-400 transition-colors">
          <div class="flex items-center gap-2 text-blue-700 font-bold">
            <span class="px-2 py-0.5 bg-blue-100 rounded text-xs font-mono">UNIQUE</span>
            <h4>ห้ามซ้ำกัน</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            บังคับว่าค่าในคอลัมน์นั้น <strong>ห้ามซ้ำกับแถวอื่นในตาราง</strong> แต่ยอมให้เป็น NULL ได้ (ถ้าไม่ได้ใส่ NOT NULL) แตกต่างจาก PK ที่ใน 1 ตารางสามารถมี UNIQUE ได้หลายคอลัมน์
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            email text UNIQUE NOT NULL
          </div>
          <p class="text-[11px] text-gray-400">ใช้กับ: อีเมล, เบอร์โทรศัพท์, รหัสบาร์โค้ด SKU</p>
        </div>

        <!-- DEFAULT -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-purple-400 transition-colors">
          <div class="flex items-center gap-2 text-purple-700 font-bold">
            <span class="px-2 py-0.5 bg-purple-100 rounded text-xs font-mono">DEFAULT</span>
            <h4>ค่าเริ่มต้นอัตโนมัติ</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            กำหนดค่าเริ่มต้นให้ทันที หากผู้ใช้งานไม่ได้ระบุค่ามาในขณะที่ Insert ข้อมูล ช่วยลดภาระของโปรแกรมฝั่ง Frontend และ Backend
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            created_at timestamptz DEFAULT now()
          </div>
          <p class="text-[11px] text-gray-400">ใช้กับ: เวลาที่สร้าง, สถานะ 'pending', แต้มสะสม 0</p>
        </div>

        <!-- CHECK -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-amber-400 transition-colors">
          <div class="flex items-center gap-2 text-amber-700 font-bold">
            <span class="px-2 py-0.5 bg-amber-100 rounded text-xs font-mono">CHECK (...)</span>
            <h4>ตรวจเงื่อนไขตรรกะ</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            กำหนดสูตรตรวจสอบเงื่อนไขทางธุรกิจ (Business Rules) หากข้อมูลที่ส่งเข้ามาไม่ตรงตามเงื่อนไข Database จะปฏิเสธและแจ้ง Error ทันที
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            CHECK (sell_price &gt;= cost_price)
          </div>
          <p class="text-[11px] text-gray-400">ใช้กับ: สต็อกห้ามติดลบ, ราคาขาย &ge; ราคาทุน, อายุ 15-100 ปี</p>
        </div>

        <!-- PRIMARY KEY -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-indigo-400 transition-colors">
          <div class="flex items-center gap-2 text-indigo-700 font-bold">
            <span class="px-2 py-0.5 bg-indigo-100 rounded text-xs font-mono">PRIMARY KEY</span>
            <h4>คีย์หลักประจำตาราง</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            เป็นทั้ง <code class="font-mono">UNIQUE</code> และ <code class="font-mono">NOT NULL</code> ในตัวเดียวกัน เพื่อระบุแต่ละแถวได้ 1 เดียว และสร้าง B-Tree Index ให้โดยอัตโนมัติ
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            id uuid PRIMARY KEY DEFAULT gen_random_uuid()
          </div>
          <p class="text-[11px] text-gray-400">1 ตารางมีได้เพียง 1 Primary Key เท่านั้น</p>
        </div>

        <!-- FOREIGN KEY -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-rose-400 transition-colors">
          <div class="flex items-center gap-2 text-rose-700 font-bold">
            <span class="px-2 py-0.5 bg-rose-100 rounded text-xs font-mono">REFERENCES (FK)</span>
            <h4>เชื่อมโยงข้ามตาราง</h4>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            คีย์นอกที่อ้างอิงไปยัง Primary Key ของตารางหลัก พร้อมกำหนดพฤติกรรมการลบข้อมูล เช่น <code class="font-mono">ON DELETE CASCADE</code> (ลบลูกตาม) หรือ <code class="font-mono">ON DELETE RESTRICT</code> (ห้ามลบแม่)
          </p>
          <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 border border-gray-100">
            customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT
          </div>
          <p class="text-[11px] text-gray-400">ใช้กับ: รหัสลูกค้าในตารางคำสั่งซื้อ</p>
        </div>

      </div>

      <!-- CHECK CONSTRAINT 4 FLAVORS SPOTLIGHT -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 class="font-bold text-gray-800 text-base flex items-center gap-2">
          <CheckSquare class="w-5 h-5 text-emerald-600" />
          เจาะลึก 4 รูปแบบการเขียน CHECK Constraint ในงานจริง
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span class="font-sans font-bold text-emerald-700 block">1. ช่วงค่าตัวเลข (Range Check)</span>
            <div class="text-slate-800 bg-white p-2 rounded border border-gray-100">CHECK (age &gt;= 18 AND age &lt;= 60)</div>
            <p class="font-sans text-[11px] text-gray-500">ควบคุมอายุให้อยู่ในช่วงวัยทำงาน</p>
          </div>

          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span class="font-sans font-bold text-blue-700 block">2. รายการคำที่อนุญาต (Enum Check)</span>
            <div class="text-slate-800 bg-white p-2 rounded border border-gray-100">CHECK (status IN ('draft', 'published', 'archived'))</div>
            <p class="font-sans text-[11px] text-gray-500">ป้องกันการสะกดคำผิดในสถานะ</p>
          </div>

          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span class="font-sans font-bold text-purple-700 block">3. เปรียบเทียบข้ามคอลัมน์ (Cross-column)</span>
            <div class="text-slate-800 bg-white p-2 rounded border border-gray-100">CHECK (sell_price &gt;= cost_price)</div>
            <p class="font-sans text-[11px] text-gray-500">ป้องกันการตั้งราคาขายขาดทุน</p>
          </div>

          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span class="font-sans font-bold text-amber-700 block">4. ตรวจสอบรูปแบบ (Regex Check)</span>
            <div class="text-slate-800 bg-white p-2 rounded border border-gray-100">CHECK (sku ~ '^[A-Z]{3}-[0-9]{4}$')</div>
            <p class="font-sans text-[11px] text-gray-500">บังคับรูปแบบ SKU เช่น "ABC-1234"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3.5: TOP 5 DATABASE ANTI-PATTERNS -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-rose-100 rounded-xl text-rose-700 shadow-sm">
          <AlertOctagon class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">5 หลุมพรางยอดฮิตที่มือใหม่มักพลาด (Top 5 Database Anti-Patterns)</h2>
          <p class="text-gray-500 text-sm">ข้อผิดพลาดในการออกแบบโครงสร้างตารางที่พบได้บ่อยที่สุด และแนวทางปฏิบัติที่ถูกต้องตามมาตรฐานสากล</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Anti-Pattern 1 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">1</span>
              <h4 class="font-bold text-gray-800 text-sm">เก็บเบอร์โทรศัพท์ด้วย integer</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> phone integer</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> phone varchar(15) หรือ text</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> เลข 0 นำหน้าจะหายไปทันที (เช่น 0812345678 กลายเป็น 812345678) และไม่สามารถเก็บเครื่องหมาย + สำหรับเบอร์โทรระหว่างประเทศได้
            </p>
          </div>
        </div>

        <!-- Anti-Pattern 2 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">2</span>
              <h4 class="font-bold text-gray-800 text-sm">เก็บเงินและราคาด้วย float</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> price float8</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> price numeric(10, 2)</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> ทศนิยมของ float จะเกิดข้อผิดพลาดในการปัดเศษ (Rounding Error) เมื่อนำมาบวกลบยอดขายจะเกิดปัญหาเงินขาดหรือเกินบัญชี
            </p>
          </div>
        </div>

        <!-- Anti-Pattern 3 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">3</span>
              <h4 class="font-bold text-gray-800 text-sm">ลืมใส่ NOT NULL ในฟิลด์สำคัญ</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> full_name text</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> full_name text NOT NULL</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> แอปพลิเคชัน Frontend จะเสี่ยงต่อการเกิด Null Pointer Exception หรือหน้าจอพังเพราะดึงข้อมูลที่ไม่มีอยู่จริงมาแสดงผล
            </p>
          </div>
        </div>

        <!-- Anti-Pattern 4 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">4</span>
              <h4 class="font-bold text-gray-800 text-sm">ใช้ Auto-inc บนตารางที่มี Public API</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> id bigint (บนตาราง orders / users)</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> id uuid DEFAULT gen_random_uuid()</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> แฮกเกอร์สามารถสุ่มเดาหมายเลข ID 1, 2, 3... เพื่อดักขโมยข้อมูลของลูกค้ารายอื่นทั้งหมด (Enumeration Attack)
            </p>
          </div>
        </div>

        <!-- Anti-Pattern 5 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">5</span>
              <h4 class="font-bold text-gray-800 text-sm">ใช้ Natural Key ที่เปลี่ยนได้เป็น PK</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> email text PRIMARY KEY</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> id uuid PK + email text UNIQUE NOT NULL</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> หากผู้ใช้ขอเปลี่ยนอีเมล หรือกรอกอีเมลผิดตอนสมัคร การตามไปอัปเดต Foreign Key ในทุกตารางลูกจะเสี่ยงต่อข้อมูลพังเสียหาย
            </p>
          </div>
        </div>

        <!-- Anti-Pattern 6 -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">6</span>
              <h4 class="font-bold text-gray-800 text-sm">ใช้ timestamp ธรรมดาบนระบบ Cloud</h4>
            </div>
            <div class="p-2.5 bg-rose-50 text-rose-900 rounded-xl text-xs font-mono border border-rose-200">
              <span class="inline-flex items-center gap-1 font-mono text-rose-700"><XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" /> created_at timestamp</span>
            </div>
            <div class="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-mono border border-emerald-200">
              <span class="inline-flex items-center gap-1 font-mono text-emerald-700"><CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> created_at timestamptz DEFAULT now()</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              <strong>ทำไมถึงผิด:</strong> เซิร์ฟเวอร์บนคลาวด์ใช้เวลา UTC เวลาในระบบจะคลาดเคลื่อนจากเวลาประเทศไทย (+07:00) ไป 7 ชั่วโมงทันที
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 4: Live Practical Demonstration (Supabase Studio Table Editor vs SQL DDL) -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
            <Code2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">4. เวิร์กช็อปภาคปฏิบัติ: สร้าง 3 ตารางใน Supabase</h2>
            <p class="text-gray-500 text-sm">เปรียบเทียบการตั้งค่าผ่านหน้า GUI (Table Editor) และการรันคำสั่ง SQL DDL</p>
          </div>
        </div>

        <!-- Mode Switcher -->
        <div class="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
          <button @click="activeTab = 'gui'" :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2', activeTab === 'gui' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
            <Table class="w-4 h-4" /> หน้าจอ Supabase Studio (GUI)
          </button>
          <button @click="activeTab = 'sql'" :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2', activeTab === 'sql' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
            <Code2 class="w-4 h-4" /> SQL Editor (DDL Code)
          </button>
        </div>
      </div>

      <!-- Tab Content: GUI Preview -->
      <div v-if="activeTab === 'gui'" class="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 class="font-bold text-gray-800 text-lg">ตัวอย่างการกำหนดคอลัมน์ใน Supabase Dashboard (Table Editor Modal)</h3>
          </div>
          <span class="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
            Supabase Studio v2.x
          </span>
        </div>

        <!-- Simulated Supabase UI Table -->
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
              <tr>
                <th class="p-3">Name</th>
                <th class="p-3">Type</th>
                <th class="p-3 text-center">Primary Key</th>
                <th class="p-3 text-center">Is Nullable</th>
                <th class="p-3 text-center">Is Unique</th>
                <th class="p-3">Default Value</th>
                <th class="p-3">คำอธิบาย</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-mono">
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="p-3 font-bold text-emerald-900">customer_id</td>
                <td class="p-3 text-purple-700 font-bold">uuid</td>
                <td class="p-3 text-center"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">YES (PK)</span></td>
                <td class="p-3 text-center text-rose-600 font-bold">NO</td>
                <td class="p-3 text-center text-emerald-600 font-bold">YES</td>
                <td class="p-3 text-gray-700">gen_random_uuid()</td>
                <td class="p-3 font-sans text-gray-500">รหัสลูกค้าแบบสุ่ม ไม่ซ้ำในโลก</td>
              </tr>
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="p-3 font-bold text-gray-800">full_name</td>
                <td class="p-3 text-blue-700 font-bold">text</td>
                <td class="p-3 text-center text-gray-400">-</td>
                <td class="p-3 text-center text-rose-600 font-bold">NO</td>
                <td class="p-3 text-center text-gray-400">NO</td>
                <td class="p-3 text-gray-400">NULL</td>
                <td class="p-3 font-sans text-gray-500">ชื่อ-นามสกุลลูกค้า ห้ามว่าง</td>
              </tr>
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="p-3 font-bold text-gray-800">email</td>
                <td class="p-3 text-blue-700 font-bold">text</td>
                <td class="p-3 text-center text-gray-400">-</td>
                <td class="p-3 text-center text-rose-600 font-bold">NO</td>
                <td class="p-3 text-center text-emerald-600 font-bold">YES</td>
                <td class="p-3 text-gray-400">NULL</td>
                <td class="p-3 font-sans text-gray-500">อีเมลห้ามซ้ำ ใช้ล็อกอิน</td>
              </tr>
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="p-3 font-bold text-gray-800">reward_points</td>
                <td class="p-3 text-emerald-700 font-bold">int4</td>
                <td class="p-3 text-center text-gray-400">-</td>
                <td class="p-3 text-center text-rose-600 font-bold">NO</td>
                <td class="p-3 text-center text-gray-400">NO</td>
                <td class="p-3 text-gray-700">0</td>
                <td class="p-3 font-sans text-gray-500">แต้มสะสม เริ่มต้นที่ 0</td>
              </tr>
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="p-3 font-bold text-gray-800">registered_at</td>
                <td class="p-3 text-indigo-700 font-bold">timestamptz</td>
                <td class="p-3 text-center text-gray-400">-</td>
                <td class="p-3 text-center text-rose-600 font-bold">NO</td>
                <td class="p-3 text-center text-gray-400">NO</td>
                <td class="p-3 text-gray-700">now()</td>
                <td class="p-3 font-sans text-gray-500">วันที่และเวลาสมัครสมาชิกอัตโนมัติ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <Info class="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div class="text-xs text-emerald-900 leading-relaxed">
            <strong>ทริกสำหรับนักศึกษา:</strong> ใน Supabase Studio เมื่อกดติ๊กเลือก <strong>Primary Key</strong> ระบบจะปลดเครื่องหมาย <em>Is Nullable</em> ออกให้อัตโนมัติ เพราะตามกฎเหล็กของคีย์หลักจะไม่มีค่าว่าง (NOT NULL) เสมอ
          </div>
        </div>
      </div>

      <!-- Tab Content: SQL DDL Preview -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Code Box 1 -->
          <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between text-white">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span class="font-bold text-xs text-emerald-400 font-mono">1. customers.sql</span>
                <button @click="copySql(sqlExamples.customers)" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Copy class="w-3.5 h-3.5" /> คัดลอก
                </button>
              </div>
              <pre class="text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-xl"><code>{{ sqlExamples.customers }}</code></pre>
            </div>
            <p class="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <Info class="w-4 h-4 text-emerald-400 inline mr-1 shrink-0" /> <strong>จุดสำคัญ:</strong> ใช้ <code class="text-emerald-300">uuid</code> เป็น PK + <code class="text-emerald-300">now()</code> + <code class="text-emerald-300">CHECK &gt;= 0</code>
            </p>
          </div>

          <!-- Code Box 2 -->
          <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between text-white">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span class="font-bold text-xs text-blue-400 font-mono">2. products.sql</span>
                <button @click="copySql(sqlExamples.products)" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Copy class="w-3.5 h-3.5" /> คัดลอก
                </button>
              </div>
              <pre class="text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-xl"><code>{{ sqlExamples.products }}</code></pre>
            </div>
            <p class="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <Info class="w-4 h-4 text-emerald-400 inline mr-1 shrink-0" /> <strong>จุดสำคัญ:</strong> ใช้ <code class="text-blue-300">IDENTITY</code> (Auto-inc) + <code class="text-blue-300">numeric(10,2)</code> + ตรวจสอบราคาขาย &ge; ราคาทุน
            </p>
          </div>

          <!-- Code Box 3 -->
          <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between text-white">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span class="font-bold text-xs text-purple-400 font-mono">3. orders.sql</span>
                <button @click="copySql(sqlExamples.orders)" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Copy class="w-3.5 h-3.5" /> คัดลอก
                </button>
              </div>
              <pre class="text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-xl"><code>{{ sqlExamples.orders }}</code></pre>
            </div>
            <p class="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <Info class="w-4 h-4 text-emerald-400 inline mr-1 shrink-0" /> <strong>จุดสำคัญ:</strong> FK เชื่อมโยงลูกค้า + <code class="text-purple-300">CHECK (order_status IN (...))</code> จำกัดสถานะ
            </p>
          </div>

          <!-- Code Box 4: order_items -->
          <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between text-white">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span class="font-bold text-xs text-amber-400 font-mono">4. order_items.sql (Composite PK)</span>
                <button @click="copySql(sqlExamples.order_items)" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Copy class="w-3.5 h-3.5" /> คัดลอก
                </button>
              </div>
              <pre class="text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-xl"><code>{{ sqlExamples.order_items }}</code></pre>
            </div>
            <p class="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <Info class="w-4 h-4 text-emerald-400 inline mr-1 shrink-0" /> <strong>จุดสำคัญ:</strong> <code class="text-amber-300">PRIMARY KEY(order_id, product_id)</code> + <code class="text-amber-300">ON DELETE CASCADE</code>
            </p>
          </div>

        </div>

        <div v-if="copiedCode" class="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl text-center shadow-lg transition-all">
          <Check class="w-4 h-4 text-emerald-400 inline mr-1" /> คัดลอกโค้ด SQL ไปยังคลิปบอร์ดแล้ว นำไปวางใน Supabase SQL Editor ได้ทันที!
        </div>
      </div>
    </section>

    <!-- GAME CENTER SECTION -->
    <section class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-indigo-100 rounded-xl text-indigo-700 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">ศูนย์ทดสอบความรู้และมินิเกม (Game Center)</h2>
            <p class="text-gray-500 text-sm">ทบทวนความรู้ประจำสัปดาห์ที่ 2 ผ่านกิจกรรม 3 ด่าน (คะแนนรวมเก็บในระบบ)</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <Trophy class="w-4 h-4" /> ดูตารางคะแนนนักศึกษาทั้งหมด
        </button>
      </div>

      <!-- Student Score Summary Card -->
      <div class="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-1 text-center md:text-left">
          <span class="text-xs text-emerald-300 uppercase tracking-wider font-bold">สถานะคะแนนสะสมสัปดาห์ที่ 2</span>
          <h3 class="text-xl font-bold">คะแนนรวมกิจกรรมของคุณ: {{ studentNorm?.earned ?? 0 }} / {{ studentNorm?.max ?? 21 }} คะแนน</h3>
          <p class="text-xs text-slate-300">แปลงเป็นคะแนนจิตพิสัย/เก็บ: {{ studentNorm?.normalized ?? '0.0' }} / 10.0 คะแนน</p>
        </div>

        <!-- Navigation Tabs for Games -->
        <div class="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/10 text-xs">
          <button @click="activeGame = 'sort'" :class="['px-3.5 py-2 rounded-lg font-bold transition-all', activeGame === 'sort' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white']">
            มินิเกม 1 (จำแนกชนิด)
          </button>
          <button @click="activeGame = 'match'" :class="['px-3.5 py-2 rounded-lg font-bold transition-all', activeGame === 'match' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white']">
            มินิเกม 2 (จับคู่ฟิลด์)
          </button>
          <button @click="activeGame = 'quiz'" :class="['px-3.5 py-2 rounded-lg font-bold transition-all', activeGame === 'quiz' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white']">
            แบบทดสอบ (Post-test)
          </button>
        </div>
      </div>

      <!-- Active Game Component Container -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <!-- Game 1: Drag Drop -->
        <DragDropGame
          v-if="activeGame === 'sort'"
          :courseId="currentCourseId"
          :week="currentWeek"
          gameId="game-1"
          title="มินิเกม 1: ลากและจำแนกชนิดข้อมูลลงในหมวดหมู่ที่ถูกต้อง"
          subtitle="ลากชนิดข้อมูลด้านล่าง ไปวางลงในกล่องหมวดหมู่ที่สอดคล้องกันให้ถูกต้อง (เล่นได้ครั้งเดียว)"
          :initialItems="dragItemsData"
          :zones="dragZonesData"
        />

        <!-- Game 2: Matching -->
        <MatchingGame
          v-if="activeGame === 'match'"
          :courseId="currentCourseId"
          :week="currentWeek"
          gameId="game-2"
          title="มินิเกม 2: จับคู่โจทย์สถานการณ์จริงกับ Data Type & Constraint ที่เหมาะสม"
          subtitle="คลิกเลือกสถานการณ์ทางธุรกิจฝั่งซ้าย แล้วคลิกเลือกชนิดข้อมูลและข้อกำหนดฝั่งขวาให้ตรงกัน (เล่นได้ครั้งเดียว)"
          :initialLeftTerms="matchLeftTerms"
          :initialRightDefs="matchRightDefs"
        />

        <!-- Game 3: Pop Quiz -->
        <PopQuiz
          v-if="activeGame === 'quiz'"
          :courseId="currentCourseId"
          :week="currentWeek"
          quizId="quiz"
          title="แบบทดสอบหลังเรียนสัปดาห์ที่ 2: ชนิดข้อมูล คีย์หลัก และข้อกำหนด (Post-test 10 ข้อ)"
          subtitle="ทดสอบความรู้ความเข้าใจเรื่อง Data Types, PK และ Constraints ใน Supabase (เต็ม 10 คะแนน)"
          :questions="quizQuestions"
        />
      </div>

      <!-- Teacher Scoreboard Modal -->
      <TeacherScoreboardModal
        :show="showTeacherModal"
        :courseId="currentCourseId"
        courseName="เทคโนโลยีการจัดการฐานข้อมูล"
        :week="currentWeek"
        weekTitle="สัปดาห์ที่ 2: ชนิดข้อมูล คีย์หลัก และข้อกำหนดใน Supabase"
        :games="weekGames"
        @close="showTeacherModal = false"
      />
    </section>

    <!-- ASSIGNMENT SECTION (ใบงานที่ 2) -->
    <section>
      <AssignmentSection
        course-id="31901-2007"
        assignment-id="asm-2"
        assignment-title="ใบงานที่ 2: การออกแบบ Relational Schema และกำหนดชนิดข้อมูล คีย์หลัก และข้อกำหนดใน Supabase"
        :max-score="10"
      >
        <template #number>2</template>
        <template #description>
          วิเคราะห์ระบบงาน 3 ตาราง (ลูกค้า, สินค้า, คำสั่งซื้อ) เพื่อเลือกชนิดข้อมูลใน Supabase, กำหนด Primary Key, ระบุ Integrity Constraints และเขียนคำตอบลงในแบบฟอร์มให้สมบูรณ์

          <!-- Learning Objectives for Assignment -->
          <div class="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <h4 class="font-bold text-emerald-950 text-sm mb-2 flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600" />
              จุดประสงค์การเรียนรู้ประจำใบงาน (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-emerald-900">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>1. เลือกชนิดข้อมูลใน Supabase ให้ตรงกับลักษณะงานได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>2. กำหนดคีย์หลัก (Auto-inc หรือ UUID) ได้อย่างเหมาะสม</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>3. ระบุ Constraints (NOT NULL, UNIQUE, CHECK, DEFAULT) ได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>4. อธิบายเหตุผลการตัดสินใจทางสถาปัตยกรรมข้อมูลได้</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>5. ตอบคำถามคิดวิเคราะห์ด้านความปลอดภัยและระบบคลาวด์ได้</span>
              </div>
            </div>
          </div>

          <!-- Assignment Tasks List -->
          <ul class="space-y-4 text-slate-700">
            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
              <div>
                <strong>ตารางที่ 1: ตารางผู้ใช้งานและสมาชิกร้านค้า (customers)</strong>
                <p class="text-xs text-gray-500 mt-0.5">
                  วิเคราะห์ 7 คอลัมน์ (customer_id, full_name, email, phone_number, reward_points, is_active, registered_at) โดยกำหนดชนิดข้อมูล, PK, Constraints และเหตุผลประกอบ
                </p>
              </div>
            </li>
            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div class="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
              <div>
                <strong>ตารางที่ 2: ตารางสินค้าและคลังสินค้า (products)</strong>
                <p class="text-xs text-gray-500 mt-0.5">
                  วิเคราะห์ 7 คอลัมน์ (id, sku_barcode, product_title, cost_price, sell_price, stock_qty, expiry_date) กำหนดทศนิยมการเงินและเงื่อนไขราคาขาย &ge; ราคาทุน
                </p>
              </div>
            </li>
            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div class="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
              <div>
                <strong>ตารางที่ 3: ตารางรายการสั่งซื้อสินค้า (orders)</strong>
                <p class="text-xs text-gray-500 mt-0.5">
                  วิเคราะห์ 6 คอลัมน์ (order_id, customer_id, total_amount, order_status, shipping_address, order_date) พร้อมเชื่อม Foreign Key และจำกัดสถานะด้วย CHECK
                </p>
              </div>
            </li>
            <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
              <div class="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">4</div>
              <div>
                <strong>คำถามคิดวิเคราะห์ท้ายบท (Critical Thinking 2 ข้อ)</strong>
                <p class="text-xs text-gray-500 mt-0.5">
                  ตอบคำถามเรื่องทำไม Cloud ถึงนิยม UUID มากกว่า Auto-increment และทำไมเบอร์โทรศัพท์/บัตรประชาชนห้ามเก็บเป็น integer
                </p>
              </div>
            </li>
          </ul>

          <!-- PDF Preview Action -->
          <div class="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <FileText class="w-4 h-4 text-emerald-600" /> ต้องการดูตัวอย่างรูปเล่มใบงานที่ 2?
              </h5>
              <p class="text-xs text-gray-500 mt-0.5">
                กดเปิดดูตัวอย่างการเขียนใบงานที่ 2 ฉบับสมบูรณ์ (รูปแบบเอกสารมาตรฐานทางการ ขนาด A4 พร้อมตารางทั้ง 3 ชุด)
              </p>
            </div>
            <button @click="showPdfModal = true"
              class="px-5 py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
              <FileText class="w-4 h-4" />
              เปิดดูตัวอย่างใบงาน (PDF Preview)
            </button>
          </div>
        </template>
      </AssignmentSection>
    </section>

    <!-- OFFICIAL WORKSHEET MODAL (A4 Format) -->
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="ใบงานที่_2_ชนิดข้อมูล_PK_และ_Constraints_ปวส1.pdf"
      subtitle="แบบฟอร์มเอกสารทางการ ขนาด A4 (3 ตาราง)"
      footer-text="แบบฟอร์มใบงานมาตรฐานขนาด A4 • รายวิชาเทคโนโลยีการจัดการฐานข้อมูล (31901-2007)"
    >
      <!-- Official Header -->
      <div class="border-b-2 border-black pb-3 text-center space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
          ใบงานที่ 2: การออกแบบ Relational Schema และกำหนดชนิดข้อมูล คีย์หลัก และข้อกำหนดใน Supabase
        </h2>
        <p class="text-xs text-gray-600">วิชาเทคโนโลยีการจัดการฐานข้อมูล (31901-2007) ระดับชั้น ปวส.1 แผนกวิชาคอมพิวเตอร์ธุรกิจ/เทคโนโลยีสารสนเทศ</p>
      </div>

      <!-- Student Meta Line -->
      <div class="py-2 text-xs sm:text-sm text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
        <span><strong>ชื่อ-นามสกุล:</strong> นายปริญญา ตัวอย่างเลิศ</span>
        <span><strong>รหัสประจำตัว:</strong> 67309010022</span>
        <span><strong>ระดับชั้น:</strong> ปวส.1/1</span>
      </div>

      <!-- Worksheet Instructions -->
      <div class="bg-gray-100 p-2.5 rounded border border-gray-300 text-xs text-gray-800 leading-relaxed">
        <strong>คำชี้แจง:</strong> ให้นักศึกษาวิเคราะห์สถานการณ์จำลองระบบงาน 3 ตาราง แล้วเลือกชนิดข้อมูล (Data Type) ใน Supabase, กำหนด Primary Key (PK), ระบุข้อกำหนด (Constraints) และเขียนเหตุผลประกอบการออกแบบให้สมบูรณ์
      </div>

      <!-- TABLE 1: customers -->
      <div class="space-y-2 pt-2">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-black text-xs sm:text-sm">ตารางที่ 1: ตารางผู้ใช้งานและสมาชิก (customers)</h4>
          <span class="text-[11px] text-gray-600 font-mono">Table: customers</span>
        </div>
        <table class="w-full border-collapse border border-black text-[11px]">
          <thead class="bg-gray-200 text-black">
            <tr>
              <th class="border border-black p-1.5 w-8 text-center">#</th>
              <th class="border border-black p-1.5 text-left">Column Name</th>
              <th class="border border-black p-1.5 text-left">ชนิดข้อมูล (Data Type)</th>
              <th class="border border-black p-1.5 text-center w-12">PK</th>
              <th class="border border-black p-1.5 text-left">ข้อกำหนด (Constraints)</th>
              <th class="border border-black p-1.5 text-left">เหตุผลในการออกแบบ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-black p-1 text-center font-bold">1</td>
              <td class="border border-black p-1 font-mono font-bold">customer_id</td>
              <td class="border border-black p-1 font-mono">uuid</td>
              <td class="border border-black p-1 text-center font-bold font-mono">[ / ]</td>
              <td class="border border-black p-1 font-mono text-[10px]">PRIMARY KEY, DEFAULT gen_random_uuid()</td>
              <td class="border border-black p-1 text-gray-800">รหัสสากล สุ่มอัตโนมัติ ป้องกันการคาดเดา ID</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">2</td>
              <td class="border border-black p-1 font-mono font-bold">full_name</td>
              <td class="border border-black p-1 font-mono">text</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL</td>
              <td class="border border-black p-1 text-gray-800">ชื่อลูกค้าต้องมีเสมอ ภาษาไทยรองรับ text ได้ดี</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">3</td>
              <td class="border border-black p-1 font-mono font-bold">email</td>
              <td class="border border-black p-1 font-mono">text</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, UNIQUE</td>
              <td class="border border-black p-1 text-gray-800">ใช้อีเมลล็อกอิน ห้ามซ้ำกันเด็ดขาดในระบบ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">4</td>
              <td class="border border-black p-1 font-mono font-bold">phone_number</td>
              <td class="border border-black p-1 font-mono">varchar(15)</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">UNIQUE</td>
              <td class="border border-black p-1 text-gray-800">มีเลข 0 นำหน้า ห้ามใช้ int และไม่ควรซ้ำกัน</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">5</td>
              <td class="border border-black p-1 font-mono font-bold">reward_points</td>
              <td class="border border-black p-1 font-mono">int4</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT 0, CHECK (reward_points &gt;= 0)</td>
              <td class="border border-black p-1 text-gray-800">แต้มเป็นจำนวนเต็ม เริ่มต้น 0 และห้ามติดลบ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">6</td>
              <td class="border border-black p-1 font-mono font-bold">is_active</td>
              <td class="border border-black p-1 font-mono">boolean</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT true</td>
              <td class="border border-black p-1 text-gray-800">สถานะเปิด/ปิดการใช้งาน ค่าเริ่มต้นพร้อมใช้</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">7</td>
              <td class="border border-black p-1 font-mono font-bold">registered_at</td>
              <td class="border border-black p-1 font-mono">timestamptz</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT now()</td>
              <td class="border border-black p-1 text-gray-800">บันทึกวันเวลาที่สมัครตามโซนเวลาสากลอัตโนมัติ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TABLE 2: products -->
      <div class="space-y-2 pt-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-black text-xs sm:text-sm">ตารางที่ 2: ตารางสินค้าและสต็อก (products)</h4>
          <span class="text-[11px] text-gray-600 font-mono">Table: products</span>
        </div>
        <table class="w-full border-collapse border border-black text-[11px]">
          <thead class="bg-gray-200 text-black">
            <tr>
              <th class="border border-black p-1.5 w-8 text-center">#</th>
              <th class="border border-black p-1.5 text-left">Column Name</th>
              <th class="border border-black p-1.5 text-left">ชนิดข้อมูล (Data Type)</th>
              <th class="border border-black p-1.5 text-center w-12">PK</th>
              <th class="border border-black p-1.5 text-left">ข้อกำหนด (Constraints)</th>
              <th class="border border-black p-1.5 text-left">เหตุผลในการออกแบบ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-black p-1 text-center font-bold">1</td>
              <td class="border border-black p-1 font-mono font-bold">id</td>
              <td class="border border-black p-1 font-mono">int8</td>
              <td class="border border-black p-1 text-center font-bold font-mono">[ / ]</td>
              <td class="border border-black p-1 font-mono text-[10px]">PRIMARY KEY GENERATED ALWAYS AS IDENTITY</td>
              <td class="border border-black p-1 text-gray-800">Auto-increment ภายใน ค้นหาและทำ Index ได้เร็ว</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">2</td>
              <td class="border border-black p-1 font-mono font-bold">sku_barcode</td>
              <td class="border border-black p-1 font-mono">varchar(20)</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, UNIQUE</td>
              <td class="border border-black p-1 text-gray-800">รหัสบาร์โค้ดสากล ห้ามซ้ำกันเด็ดขาด</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">3</td>
              <td class="border border-black p-1 font-mono font-bold">product_title</td>
              <td class="border border-black p-1 font-mono">text</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL</td>
              <td class="border border-black p-1 text-gray-800">ชื่อสินค้าต้องระบุเสมอ ไม่จำกัดความยาว</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">4</td>
              <td class="border border-black p-1 font-mono font-bold">cost_price</td>
              <td class="border border-black p-1 font-mono">numeric(10, 2)</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, CHECK (cost_price &gt;= 0)</td>
              <td class="border border-black p-1 text-gray-800">ราคาทุนต้องแม่นยำ ห้ามใช้ float และไม่ติดลบ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">5</td>
              <td class="border border-black p-1 font-mono font-bold">sell_price</td>
              <td class="border border-black p-1 font-mono">numeric(10, 2)</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, CHECK (sell_price &gt;= cost_price)</td>
              <td class="border border-black p-1 text-gray-800">ราคาขายต้องมากกว่าหรือเท่ากับราคาทุนเสมอ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">6</td>
              <td class="border border-black p-1 font-mono font-bold">stock_qty</td>
              <td class="border border-black p-1 font-mono">int4</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT 0, CHECK (stock_qty &gt;= 0)</td>
              <td class="border border-black p-1 text-gray-800">จำนวนสต็อกสินค้าห้ามติดลบ เริ่มต้นที่ 0</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">7</td>
              <td class="border border-black p-1 font-mono font-bold">expiry_date</td>
              <td class="border border-black p-1 font-mono">date</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px] text-gray-400">NULL (ยอมให้ว่างได้)</td>
              <td class="border border-black p-1 text-gray-800">เก็บเฉพาะวันที่ และยอมให้ว่างสำหรับสินค้าไม่มีวันหมดอายุ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TABLE 3: orders -->
      <div class="space-y-2 pt-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-black text-xs sm:text-sm">ตารางที่ 3: ตารางคำสั่งซื้อ (orders)</h4>
          <span class="text-[11px] text-gray-600 font-mono">Table: orders</span>
        </div>
        <table class="w-full border-collapse border border-black text-[11px]">
          <thead class="bg-gray-200 text-black">
            <tr>
              <th class="border border-black p-1.5 w-8 text-center">#</th>
              <th class="border border-black p-1.5 text-left">Column Name</th>
              <th class="border border-black p-1.5 text-left">ชนิดข้อมูล (Data Type)</th>
              <th class="border border-black p-1.5 text-center w-12">PK</th>
              <th class="border border-black p-1.5 text-left">ข้อกำหนด (Constraints)</th>
              <th class="border border-black p-1.5 text-left">เหตุผลในการออกแบบ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-black p-1 text-center font-bold">1</td>
              <td class="border border-black p-1 font-mono font-bold">order_id</td>
              <td class="border border-black p-1 font-mono">uuid</td>
              <td class="border border-black p-1 text-center font-bold font-mono">[ / ]</td>
              <td class="border border-black p-1 font-mono text-[10px]">PRIMARY KEY, DEFAULT gen_random_uuid()</td>
              <td class="border border-black p-1 text-gray-800">รหัสใบสั่งซื้อสากล ป้องกันการเดาหมายเลขคำสั่งซื้อ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">2</td>
              <td class="border border-black p-1 font-mono font-bold">customer_id</td>
              <td class="border border-black p-1 font-mono">uuid</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, REFERENCES customers(customer_id)</td>
              <td class="border border-black p-1 text-gray-800">Foreign Key ชี้ไปตารางลูกค้า ชนิดข้อมูลต้องตรงกัน</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">3</td>
              <td class="border border-black p-1 font-mono font-bold">total_amount</td>
              <td class="border border-black p-1 font-mono">numeric(12, 2)</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, CHECK (total_amount &gt;= 0)</td>
              <td class="border border-black p-1 text-gray-800">ยอดเงินรวมสุทธิ มีทศนิยม 2 ตำแหน่ง ห้ามติดลบ</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">4</td>
              <td class="border border-black p-1 font-mono font-bold">order_status</td>
              <td class="border border-black p-1 font-mono">text</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT 'pending', CHECK (...)</td>
              <td class="border border-black p-1 text-gray-800">จำกัดเฉพาะ 'pending', 'paid', 'shipped', 'cancelled'</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">5</td>
              <td class="border border-black p-1 font-mono font-bold">shipping_address</td>
              <td class="border border-black p-1 font-mono">text</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL</td>
              <td class="border border-black p-1 text-gray-800">ที่อยู่จัดส่งสินค้าโดยละเอียด</td>
            </tr>
            <tr>
              <td class="border border-black p-1 text-center font-bold">6</td>
              <td class="border border-black p-1 font-mono font-bold">order_date</td>
              <td class="border border-black p-1 font-mono">timestamptz</td>
              <td class="border border-black p-1 text-center text-gray-400">-</td>
              <td class="border border-black p-1 font-mono text-[10px]">NOT NULL, DEFAULT now()</td>
              <td class="border border-black p-1 text-gray-800">บันทึกวันและเวลาสั่งซื้ออัตโนมัติตามเวลาสากล</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Critical Thinking Answers in Modal -->
      <div class="space-y-2 pt-3 border-t border-gray-300">
        <h4 class="font-bold text-black text-xs sm:text-sm">ส่วนที่ 2: คำถามคิดวิเคราะห์ (Critical Thinking)</h4>
        <div class="space-y-2 text-[11px] text-gray-800">
          <p>
            <strong>1. ทำไมระบบ Cloud DBMS ยุคใหม่ถึงนิยมใช้ UUID เป็น Primary Key มากกว่าตัวเลข Auto-increment?</strong><br />
            <span class="text-gray-700 bg-gray-50 p-1.5 rounded block mt-0.5 border border-gray-200">
              <strong>ตอบ:</strong> 1) ด้านความปลอดภัย (Security): ป้องกันการถูกโจมตีแบบ Enumeration Attack แฮกเกอร์ไม่สามารถสุ่มเดาหมายเลข ID ถัดไปได้ 2) ด้านสถาปัตยกรรมกระจายศูนย์ (Distributed System): ฝั่ง Client หรือหลาย Server สามารถสุ่มสร้าง UUID ได้ทันทีโดยไม่ต้องรอ Sequence กลาง และไม่มีปัญหารหัสชนกันเมื่อรวมฐานข้อมูล
            </span>
          </p>
          <p>
            <strong>2. เหตุใดหมายเลขโทรศัพท์และเลขบัตรประชาชน 13 หลัก จึงต้องเก็บเป็น text หรือ varchar ห้ามเก็บเป็น integer?</strong><br />
            <span class="text-gray-700 bg-gray-50 p-1.5 rounded block mt-0.5 border border-gray-200">
              <strong>ตอบ:</strong> 1) ตัวเลขเหล่านี้มักมีเลข 0 นำหน้า (เช่น 081-xxx-xxxx) หากเก็บเป็น integer ตัวเลข 0 นำหน้าจะถูกระบบตัดทิ้งทันที 2) ข้อมูลเหล่านี้มีสถานะเป็น "รหัสระบุตัวตน (Code/Identifier)" ไม่เคยถูกนำไปคำนวณทางคณิตศาสตร์ (ไม่มีการบวกลบคูณหารเบอร์โทร) จึงต้องจัดเก็บเป็นชนิดข้อความ
            </span>
          </p>
        </div>
      </div>
    </AssignmentPdfModal>

  </div>
</template>
