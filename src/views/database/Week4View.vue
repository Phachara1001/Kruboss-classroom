<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Database, Table, Code, PlusCircle, Search, Filter, ArrowUpDown,
  Edit3, Trash2, ShieldAlert, CheckCircle2, XCircle, FileText, Upload,
  AlertTriangle, Copy, Check, Terminal, BookOpen, Target, Award,
  Book, Lightbulb, Gamepad2, MousePointer2, ListOrdered, FileQuestion,
  FileSpreadsheet, Clock, ArrowRight, Layers, Eye, RefreshCw, Key,
  Sparkles, CheckSquare, HelpCircle, AlertOctagon, ExternalLink,
  Play, Info, AlertCircle, Laptop, Compass, Zap, UserCheck, Phone,
  Calendar, Hash, Download, FileCode, Briefcase, MessageSquare, GitFork,
  Link, Unlink, Network, GitCommit, Split
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course & Week Context
const currentCourseId = '31901-2007'
const currentWeek = 4

// Router & Modal States
const route = useRoute()
const router = useRouter()
const showTeacherModal = ref(false)
const activeGame = ref('sort') // 'sort' | 'match' | 'quiz'

// Code snippet copy helper
const copiedSnippet = ref('')
const copyText = (text, key) => {
  navigator.clipboard.writeText(text)
  copiedSnippet.value = key
  setTimeout(() => {
    copiedSnippet.value = ''
  }, 2000)
}

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกประเภทความสัมพันธ์ 1:1, 1:N, N:M)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่ตำแหน่งการวาง Foreign Key)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 4 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
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

// Game 1 Data: Drag & Drop (จำแนกความสัมพันธ์ 1:1, 1:N, N:M จากสถานการณ์ชีวิตจริง)
const dragItemsData = [
  { id: 1, text: 'ประชาชน 1 คน กับ หมายเลขบัตรประชาชน 1 ใบ', type: 'one_to_one' },
  { id: 2, text: '1 สาขาวิชา (Department) กับ นักศึกษาหลายคนในสังกัด', type: 'one_to_many' },
  { id: 3, text: 'นักศึกษา 1 คน กับ สิทธิ์ครอบครองตู้ล็อกเกอร์ประจำตัว 1 ตู้', type: 'one_to_one' },
  { id: 4, text: '1 คำสั่งซื้อ (Order) กับ รายการสินค้าหลายชิ้นในออเดอร์', type: 'one_to_many' },
  { id: 5, text: 'นักศึกษาหลายคน กับ รายวิชาเรียนหลายวิชาที่ลงทะเบียน', type: 'many_to_many' },
  { id: 6, text: 'หมอตรวจคนไข้หลายคน กับ คนไข้ตรวจกับหมอได้หลายคน', type: 'many_to_many' }
]

const dragZonesData = [
  {
    id: 'one_to_one',
    title: '1. One-to-One (1:1 หนึ่งต่อหนึ่ง)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากความสัมพันธ์ที่เป็น 1 ต่อ 1 มาวางที่นี่'
  },
  {
    id: 'one_to_many',
    title: '2. One-to-Many (1:N หนึ่งต่อกลุ่ม)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากความสัมพันธ์ที่เป็น 1 ต่อกลุ่มมาวางที่นี่'
  },
  {
    id: 'many_to_many',
    title: '3. Many-to-Many (N:M กลุ่มต่อกลุ่ม)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากความสัมพันธ์ที่เป็นกลุ่มต่อกลุ่มมาวางที่นี่'
  }
]

// Game 2 Data: Matching Game (จับคู่หลักการและตำแหน่งการวาง Foreign Key)
const matchLeftTerms = [
  { id: 'l1', text: '1. กฎเหล็กของ One-to-Many (1:N)', match: 'r1' },
  { id: 'l2', text: '2. Junction Table (ตารางตัวกลาง)', match: 'r2' },
  { id: 'l3', text: '3. Foreign Key (คีย์นอก)', match: 'r3' },
  { id: 'l4', text: '4. ON DELETE CASCADE', match: 'r4' },
  { id: 'l5', text: '5. Schema Visualizer บน Supabase', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'คอลัมน์ Foreign Key ต้องไปฝังตัวอยู่ที่ตารางฝั่ง Many เสมอ' },
  { id: 'r2', text: 'ตารางที่สร้างขึ้นมาเพื่อแปลงความสัมพันธ์ Many-to-Many ให้กลายเป็น 1:N สองเส้น' },
  { id: 'r3', text: 'คอลัมน์ที่เก็บค่าอ้างอิงไปยัง Primary Key ของอีกตารางหนึ่ง' },
  { id: 'r4', text: 'คำสั่งให้ลบแถวข้อมูลลูกทิ้งโดยอัตโนมัติ เมื่อข้อมูลแถวแม่ในตารางหลักถูกลบ' },
  { id: 'r5', text: 'เครื่องมือแสดงแผนภาพความสัมพันธ์ (ER Diagram) ระหว่างตารางแบบโต้ตอบได้' }
]

// Game 3 Data: PopQuiz (10 Multiple Choice Questions)
const quizQuestions = [
  {
    id: 1,
    question: 'สาเหตุสำคัญที่สุดที่ระบบฐานข้อมูลเชิงสัมพันธ์ (RDBMS) ต้องแยกข้อมูลออกเป็นหลายตารางคือข้อใด?',
    options: [
      { id: 'a', text: 'ลดความซ้ำซ้อนของข้อมูล (Data Redundancy) และป้องกันความผิดพลาดในการแก้ไขหรือลบข้อมูล', isCorrect: true },
      { id: 'b', text: 'ทำให้พื้นที่จัดเก็บข้อมูลบนฮาร์ดดิสก์เพิ่มขึ้น 2 เท่า', isCorrect: false },
      { id: 'c', text: 'เพื่อให้สามารถใส่รหัสผ่านได้หลายชุดในตารางเดียว', isCorrect: false },
      { id: 'd', text: 'ระบบฐานข้อมูลบังคับให้มีได้ตารางละ 1 คอลัมน์เท่านั้น', isCorrect: false }
    ],
    explanation: 'การเก็บข้อมูลทุกอย่างไว้ในตารางเดียวจะทำให้เกิดข้อมูลซ้ำซ้อน (Redundancy) เช่น พิมพ์ชื่อแผนกเดิมซ้ำเป็นพันครั้ง และเกิดปัญหาผิดพลาดเวลาแก้ไขหรือลบข้อมูล (Data Anomalies)'
  },
  {
    id: 2,
    question: 'ในความสัมพันธ์แบบ 1 to Many (1:N) เช่น 1 สาขาวิชา (departments) มีนักศึกษาในสังกัดได้หลายคน (students) คอลัมน์ Foreign Key (department_id) ต้องถูกสร้างไว้ที่ตารางใด?',
    options: [
      { id: 'a', text: 'ตาราง students (ฝั่ง Many)', isCorrect: true },
      { id: 'b', text: 'ตาราง departments (ฝั่ง 1)', isCorrect: false },
      { id: 'c', text: 'ต้องสร้างทั้งสองตารางพร้อมกัน', isCorrect: false },
      { id: 'd', text: 'ไม่ต้องสร้างที่ไหนเลย เพราะระบบเชื่อมโยงด้วยชื่อตารางเอง', isCorrect: false }
    ],
    explanation: 'กฎเหล็กของความสัมพันธ์ 1 to Many คือ "Foreign Key ต้องอยู่ฝั่ง Many เสมอ" เพื่อให้นักศึกษาแต่ละแถวเก็บรหัสอ้างอิงกลับไปยังสาขาวิชาที่ตนสังกัดได้'
  },
  {
    id: 3,
    question: 'ข้อใดคือตัวอย่างความสัมพันธ์ของข้อมูลแบบ One-to-One (1:1) ในชีวิตจริง?',
    options: [
      { id: 'a', text: 'ประชาชน 1 คน มีหมายเลขบัตรประจำตัวประชาชนได้ 1 ใบ และบัตรใบนั้นเป็นของคนๆ นั้นคนเดียว', isCorrect: true },
      { id: 'b', text: 'ลูกค้า 1 คน สามารถสั่งซื้อสินค้าได้หลายออเดอร์', isCorrect: false },
      { id: 'c', text: 'นักศึกษา 1 คน ลงทะเบียนเรียนได้หลายวิชา', isCorrect: false },
      { id: 'd', text: 'อาจารย์ 1 ท่าน สอนนักศึกษาได้หลายคน', isCorrect: false }
    ],
    explanation: 'ความสัมพันธ์แบบ 1:1 หมายถึง ข้อมูล 1 รายการในตารางแรก สัมพันธ์กับข้อมูลเพียง 1 รายการในตารางที่สอง เช่น บัตรประชาชนกับเจ้าของบัตร'
  },
  {
    id: 4,
    question: 'ความสัมพันธ์แบบ Many-to-One (N:1) มีความหมายอย่างไรเมื่อเทียบกับ One-to-Many (1:N)?',
    options: [
      { id: 'a', text: 'เป็นความสัมพันธ์แบบเดียวกัน เพียงแต่มองจากมุมของฝั่ง Many ย้อนกลับไปหาฝั่ง 1', isCorrect: true },
      { id: 'b', text: 'เป็นคนละเรื่องกันโดยสิ้นเชิง', isCorrect: false },
      { id: 'c', text: 'Many-to-One ไม่สามารถสร้าง Foreign Key ได้', isCorrect: false },
      { id: 'd', text: 'Many-to-One ใช้ได้เฉพาะกับฐานข้อมูล NoSQL เท่านั้น', isCorrect: false }
    ],
    explanation: 'Many-to-One เป็นเพียงการมองย้อนมุมของ 1:N เช่น "นักศึกษาหลายคน สังกัดอยู่ 1 สาขาวิชา" (N:1) ก็คือเรื่องเดียวกับ "1 สาขาวิชา มีนักศึกษาหลายคน" (1:N)'
  },
  {
    id: 5,
    question: 'เหตุใดระบบฐานข้อมูลเชิงสัมพันธ์จึงไม่สามารถเชื่อมโยง Many-to-Many (N:M) ระหว่าง 2 ตารางได้โดยตรง?',
    options: [
      { id: 'a', text: 'เพราะไม่สามารถใส่รหัส ID หลายๆ ค่าเป็นลิสต์คั่นด้วยจุลภาคลงในคอลัมน์เดียวได้ (ผิดกฎความเป็นอะตอม 1NF)', isCorrect: true },
      { id: 'b', text: 'เพราะไมโครซอฟท์และออราเคิลไม่ได้จดสิทธิบัตรนี้ไว้', isCorrect: false },
      { id: 'c', text: 'เพราะระบบฐานข้อมูลรองรับ Foreign Key ได้แค่ตารางละ 1 ตัว', isCorrect: false },
      { id: 'd', text: 'เพราะตัวเลข ID ของนักศึกษาจะชนกับตัวเลข ID ของวิชาเรียน', isCorrect: false }
    ],
    explanation: 'ในฐานข้อมูลเชิงสัมพันธ์ แต่ละช่องของแถวต้องเก็บค่าเดี่ยว (Atomic Value) การเก็บ ID หลายตัวเป็นลิสต์จะทำให้ค้นหา เรียงลำดับ และตรวจสอบความถูกต้องของข้อมูลไม่ได้'
  },
  {
    id: 6,
    question: 'ตารางตัวกลาง (Junction Table หรือ Bridge Table) ทำหน้าที่อย่างไรในการแก้ปัญหา Many-to-Many?',
    options: [
      { id: 'a', text: 'ทำหน้าที่แตกความสัมพันธ์ Many-to-Many ออกเป็นความสัมพันธ์ 1 to Many จำนวน 2 เส้นเชื่อมเข้าหาตารางกลาง', isCorrect: true },
      { id: 'b', text: 'ทำหน้าที่สำรองข้อมูลตารางเก่าไว้เมื่อฮาร์ดดิสก์เต็ม', isCorrect: false },
      { id: 'c', text: 'ทำหน้าที่เปลี่ยนรหัสผ่านของผู้ดูแลระบบฐานข้อมูล', isCorrect: false },
      { id: 'd', text: 'ทำหน้าที่ลบข้อมูลทั้งสองตารางทิ้งพร้อมกัน', isCorrect: false }
    ],
    explanation: 'Junction Table เช่น ตาราง enrollments จะเก็บ Foreign Key จากทั้งตารางนักศึกษาและตารางวิชาเรียน ทำให้ความสัมพันธ์ N:M กลายเป็น 1:N สองเส้นได้อย่างสมบูรณ์'
  },
  {
    id: 7,
    question: 'ในตารางตัวกลาง enrollments ที่เชื่อมระหว่าง students กับ courses คอลัมน์ที่จำเป็นต้องมีอย่างน้อยที่สุดคือข้อใด?',
    options: [
      { id: 'a', text: 'student_id (FK อ้างอิง students) และ course_id (FK อ้างอิง courses)', isCorrect: true },
      { id: 'b', text: 'เบอร์โทรศัพท์ของนักศึกษา และชื่อวิชา', isCorrect: false },
      { id: 'c', text: 'รหัสผ่านผู้ดูแลระบบ และ IP Address', isCorrect: false },
      { id: 'd', text: 'ยอดเงินคงเหลือในบัญชีธนาคาร', isCorrect: false }
    ],
    explanation: 'ตารางตัวกลางจะต้องมี Foreign Key อย่างน้อย 2 ตัวที่ชี้กลับไปยัง Primary Key ของตารางแม่ทั้งสองฝั่ง เพื่อบอกว่า "ใคร (student_id) ลงทะเบียนวิชาอะไร (course_id)"'
  },
  {
    id: 8,
    question: 'เงื่อนไข ON DELETE CASCADE เมื่อกำหนดให้กับ Foreign Key มีผลต่อการทำงานอย่างไร?',
    options: [
      { id: 'a', text: 'เมื่อแถวข้อมูลในตารางแม่ถูกลบ ข้อมูลที่เชื่อมโยงกันในตารางลูกจะถูกลบทิ้งตามไปด้วยโดยอัตโนมัติ', isCorrect: true },
      { id: 'b', text: 'ห้ามลบข้อมูลในตารางแม่เด็ดขาดถ้ายังมีข้อมูลลูกอยู่', isCorrect: false },
      { id: 'c', text: 'เปลี่ยนค่า Foreign Key ให้กลายเป็นข้อความว่างเปล่า (NULL)', isCorrect: false },
      { id: 'd', text: 'สำเนาข้อมูลที่ถูกลบส่งไปยังอีเมลของอาจารย์ผู้สอน', isCorrect: false }
    ],
    explanation: 'CASCADE หมายถึง "การไหลต่อกันเป็นทอดๆ" เมื่อลบข้อมูลตารางแม่ (เช่น ลบนักศึกษา) รายการลงทะเบียนเรียนของนักศึกษาคนนั้นในตารางลูกจะถูกลบทิ้งตามไปอัตโนมัติ'
  },
  {
    id: 9,
    question: 'หากเราต้องการป้องกันไม่ให้ผู้ใช้เผลอลบ "สาขาวิชา" ที่ยังมีนักศึกษาเรียนอยู่ ควรตั้งค่าข้อกำหนดการลบของ Foreign Key เป็นแบบใด?',
    options: [
      { id: 'a', text: 'ON DELETE RESTRICT (หรือ NO ACTION) เพื่อระงับการลบและแจ้งเตือนข้อผิดพลาด', isCorrect: true },
      { id: 'b', text: 'ON DELETE CASCADE', isCorrect: false },
      { id: 'c', text: 'DROP DATABASE ALL', isCorrect: false },
      { id: 'd', text: 'DELETE WITHOUT WHERE', isCorrect: false }
    ],
    explanation: 'RESTRICT จะไม่อนุญาตให้ลบข้อมูลตารางแม่ ตราบใดที่ยังมีข้อมูลในตารางลูกอ้างอิงถึงอยู่ เพื่อป้องกันไม่ให้นักศึกษากลายเป็นเด็กไร้สังกัด'
  },
  {
    id: 10,
    question: 'บนระบบ Supabase Dashboard หากต้องการเปิดดูแผนภาพเส้นสายความสัมพันธ์ (ER Diagram) ระหว่างตารางทั้งหมด ต้องไปที่เมนูใด?',
    options: [
      { id: 'a', text: 'เมนู Schema Visualizer ในหมวด Database', isCorrect: true },
      { id: 'b', text: 'เมนู Project Settings', isCorrect: false },
      { id: 'c', text: 'ปุ่ม Start Simulation', isCorrect: false },
      { id: 'd', text: 'เมนู Storage Buckets', isCorrect: false }
    ],
    explanation: 'Supabase มีเครื่องมือ Schema Visualizer ที่ช่วยวาดไดอะแกรมความสัมพันธ์ระหว่างตารางและเส้นโยง Foreign Key ให้เห็นเป็นภาพกราฟิกแบบอัตโนมัติ'
  }
]

// SQL Code Snippets for Workshop
const sqlCreateSchema = `-- ==========================================
-- สัปดาห์ที่ 4: การสร้างความสัมพันธ์ระหว่างตารางใน Supabase
-- Mini University Schema (departments, students, courses, enrollments)
-- ==========================================

-- 1. สร้างตารางสาขาวิชา departments (ฝั่ง 1 ของความสัมพันธ์ 1:N)
CREATE TABLE IF NOT EXISTS departments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  dept_code VARCHAR(10) NOT NULL UNIQUE,
  dept_name VARCHAR(100) NOT NULL,
  building VARCHAR(50)
);

-- 2. สร้างตารางนักศึกษา students (ฝั่ง Many ที่มี Foreign Key ชี้ไปหา departments)
CREATE TABLE IF NOT EXISTS students (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  student_code VARCHAR(15) NOT NULL UNIQUE,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  year INT DEFAULT 1,
  department_id BIGINT REFERENCES departments(id) ON DELETE RESTRICT
);

-- 3. สร้างตารางวิชาเรียน courses (ฝั่ง 1 ของวิชาเรียน)
CREATE TABLE IF NOT EXISTS courses (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  course_code VARCHAR(10) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  credits INT DEFAULT 3
);

-- 4. สร้างตารางตัวกลาง enrollments (Junction Table สำหรับ Many-to-Many)
CREATE TABLE IF NOT EXISTS enrollments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  semester VARCHAR(10) NOT NULL,
  grade VARCHAR(2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, semester)
);`

const sqlInsertData = `-- ==========================================
-- ข้อมูลจำลองสำหรับทดสอบความสัมพันธ์ (Mock Data)
-- ==========================================

-- 1. เพิ่มสาขาวิชา (3 แผนก)
INSERT INTO departments (dept_code, dept_name, building) VALUES
  ('CPE', 'วิศวกรรมคอมพิวเตอร์', 'อาคาร 81 ชั้น 4'),
  ('IT', 'เทคโนโลยีสารสนเทศ', 'อาคาร 82 ชั้น 2'),
  ('EE', 'วิศวกรรมไฟฟ้าและพลังงาน', 'อาคาร 75 ชั้น 1');

-- 2. เพิ่มนักศึกษาและผูกกับสาขาวิชา (department_id)
INSERT INTO students (student_code, firstname, lastname, year, department_id) VALUES
  ('6601001', 'สมชาย', 'สายโค้ด', 1, 1),
  ('6601002', 'สมหญิง', 'รักดีไซน์', 1, 1),
  ('6601003', 'กิตติศักดิ์', 'มั่นคง', 2, 2),
  ('6601004', 'นภัสสร', 'แก้วกานดา', 2, 2),
  ('6601005', 'ธนากร', 'พลังงานไฟฟ้า', 3, 3);

-- 3. เพิ่มรายวิชาเรียน (4 วิชา)
INSERT INTO courses (course_code, course_name, credits) VALUES
  ('CS-101', 'Introduction to Database Systems', 3),
  ('CS-102', 'Object-Oriented Programming', 3),
  ('IT-201', 'Web & Cloud Technologies', 3),
  ('EE-301', 'Embedded IoT & Hardware Microcontroller', 3);

-- 4. บันทึกการลงทะเบียนเรียนในตารางตัวกลาง (enrollments)
INSERT INTO enrollments (student_id, course_id, semester, grade) VALUES
  (1, 1, '1/2567', 'A'),
  (1, 2, '1/2567', 'B+'),
  (2, 1, '1/2567', 'A'),
  (2, 3, '1/2567', 'B'),
  (3, 1, '1/2567', 'C+'),
  (3, 3, '1/2567', 'A'),
  (4, 3, '1/2567', 'B+'),
  (5, 4, '1/2567', 'A');`
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header Banner (ธีมสีเขียว-ทีล สไตล์ระบบจัดการความสัมพันธ์ฐานข้อมูล) -->
    <div
      class="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl p-8 md:p-12 border border-teal-800/80 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[260px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-teal-400">
        <Network class="w-[440px] h-[440px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-5/6 lg:w-3/4 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-4 py-1.5 bg-teal-500/20 text-teal-300 font-bold rounded-full text-xs uppercase tracking-wider border border-teal-400/30 shadow-sm backdrop-blur-sm">
            สัปดาห์ที่ 4
          </span>
          <span class="px-3 py-1 bg-white/10 text-slate-200 text-xs rounded-full font-medium border border-white/10">
            Relational Modeling & Schema Design
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
          การออกแบบความสัมพันธ์ของข้อมูลและ Cardinality<br />
          <span class="text-2xl sm:text-3xl md:text-4xl text-teal-400 font-bold font-mono">
            (1:1, 1:N, N:1, N:M และ Junction Table ใน Supabase)
          </span>
        </h1>
        <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          ก้าวข้ามจากการจัดการตารางเดี่ยว สู่หัวใจที่แท้จริงของระบบฐานข้อมูลเชิงสัมพันธ์ (RDBMS) ทำความเข้าใจปัญหาของความซ้ำซ้อน 
          เรียนรู้การวิเคราะห์ความสัมพันธ์ 4 รูปแบบ กฎเหล็กการวาง Foreign Key การแก้ปัญหา Many-to-Many ด้วยตารางตัวกลาง 
          และการตรวจดูเส้นสายความสัมพันธ์จริงผ่าน Schema Visualizer บน Supabase
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :course-id="currentCourseId" :week-number="currentWeek" />

    <!-- Chapter Objectives & Competencies Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-teal-100 rounded-xl text-teal-700 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">จุดประสงค์และสมรรถนะประจำสัปดาห์ที่ 4</h2>
          <p class="text-sm text-gray-500 mt-0.5">หน่วยการเรียนรู้: การออกแบบความสัมพันธ์และคีย์นอกในฐานข้อมูล (ทฤษฎี 2 ชม. ปฏิบัติ 4 ชม.)</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-teal-100 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. ผลลัพธ์การเรียนรู้ -->
          <div class="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-teal-800 font-bold">
                <Lightbulb class="w-5 h-5 shrink-0" />
                <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ผู้เรียนเข้าใจเหตุผลความจำเป็นในการแบ่งข้อมูลออกเป็นหลายตาราง สามารถวิเคราะห์และระบุประเภทความสัมพันธ์ (1:1, 1:N, N:1, N:M) จากโจทย์ในชีวิตจริงได้อย่างถูกต้อง และเข้าใจหลักการสร้างคีย์นอก (Foreign Key)
              </p>
            </div>
          </div>

          <!-- 2. สมรรถนะประจำหน่วย -->
          <div class="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
                <Award class="w-5 h-5 shrink-0" />
                <span>2. สมรรถนะประจำหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                แสดงทักษะการออกแบบและสร้างโครงสร้างความสัมพันธ์ระหว่างตาราง พร้อมระบุ Foreign Key และข้อกำหนดการลบ (ON DELETE) ใน Supabase ได้อย่างถูกต้องตามหลักการออกแบบฐานข้อมูลเชิงสัมพันธ์
              </p>
            </div>
          </div>

          <!-- 3. วัตถุประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-slate-800 font-bold">
                <CheckSquare class="w-5 h-5 shrink-0" />
                <span>3. วัตถุประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>อธิบายปัญหาความซ้ำซ้อนของข้อมูล (Data Redundancy) ได้</li>
                <li>จำแนกความแตกต่างของความสัมพันธ์ 4 รูปแบบได้ถูกต้อง</li>
                <li>บอกตำแหน่งที่ต้องวาง Foreign Key ในความสัมพันธ์ 1:N ได้</li>
                <li>สร้างตารางตัวกลาง (Junction Table) แก้ปัญหา N:M ได้</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- LECTURE CONTENT SECTION                                        -->
    <!-- ============================================================== -->
    <section class="space-y-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-teal-100 rounded-xl text-teal-700 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
          <p class="text-sm text-gray-500 mt-0.5">5 หัวข้อสำคัญสู่การเข้าใจแก่นแท้ของ Relational Database Modeling</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-teal-100 space-y-16 text-gray-700 leading-relaxed">

        <!-- TOPIC 1: WHY RELATIONSHIPS? -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              หัวข้อที่ 1
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-teal-950 border-l-4 border-teal-600 pl-4 mb-4">
            จากตารางเดี่ยวสู่หลายตาราง: ทำไมข้อมูลต้องมีความสัมพันธ์กัน?
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            ในสัปดาห์ที่ 2 และ 3 พวกเราได้ลองจัดการข้อมูลในตารางเดี่ยว <strong>students</strong> แต่ถ้าเราต้องการเก็บข้อมูล "อาจารย์ที่ปรึกษา", "สาขาวิชา", และ "วิชาที่ลงทะเบียน" ถ้าเรายัดทุกอย่างไว้ในตารางเดียวจะเกิดอะไรขึ้น?
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div class="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div class="flex items-center gap-2 text-rose-900 font-bold">
                <AlertTriangle class="w-5 h-5 text-rose-600 shrink-0" />
                <span>1. ข้อมูลซ้ำซ้อนมหาศาล (Redundancy)</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                ถ้ามีนักศึกษา 1,000 คนอยู่ในสาขา "วิศวกรรมคอมพิวเตอร์" เราต้องพิมพ์คำว่า "วิศวกรรมคอมพิวเตอร์", "อาคาร 81", "หัวหน้าภาคชื่อ..." ซ้ำๆ ถึง 1,000 ครั้ง เปลืองพื้นที่และมีโอกาสพิมพ์ตกหล่น
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div class="flex items-center gap-2 text-amber-900 font-bold">
                <Edit3 class="w-5 h-5 text-amber-600 shrink-0" />
                <span>2. แก้ไขยาก ลำบากทุกขั้นตอน (Update Anomaly)</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                หากสาขาวิชาย้ายตึกเรียนจาก "อาคาร 81" ไป "อาคาร 90" เราต้องเขียนคำสั่งอัปเดตข้อมูลนักศึกษาทั้งหมด 1,000 แถว หากอัปเดตตกหล่นแม้แต่แถวเดียว ข้อมูลในระบบจะเกิดความขัดแย้งทันที
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div class="flex items-center gap-2 text-purple-900 font-bold">
                <Trash2 class="w-5 h-5 text-purple-600 shrink-0" />
                <span>3. ข้อมูลสูญหายโดยไม่ตั้งใจ (Delete Anomaly)</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                ถ้าสาขาวิชาหนึ่งมีนักศึกษาเรียนอยู่เพียงคนเดียว แล้ววันหนึ่งนักศึกษาคนนั้นลาออก เมื่อเราลบแถวนักศึกษาทิ้ง ประวัติการมีอยู่ของ "สาขาวิชา" นั้นก็จะหายวับไปจากฐานข้อมูลด้วย
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
            <h4 class="font-bold flex items-center gap-2 text-sm sm:text-base">
              <Lightbulb class="w-5 h-5 text-teal-600 shrink-0" />
              ทางออกที่ถูกต้องตามหลัก Relational Database:
            </h4>
            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
              เราจะ <strong>"แยกตารางตามเอนทิตี (Entity)"</strong> โดยสร้างตาราง <code>departments</code> แยกไว้ต่างหาก แล้วสร้างตาราง <code>students</code> โดยเก็บเพียงรหัสอ้างอิง <code>department_id</code> เชื่อมโยงกลับไปเท่านั้น ทำให้ข้อมูลสาขาวิชาถูกบันทึกเพียงครั้งเดียว แก้ไขง่าย และไม่มีข้อมูลซ้ำซ้อน
            </p>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- TOPIC 2: 4 CARDINALITY TYPES -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              หัวข้อที่ 2
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-teal-950 border-l-4 border-teal-600 pl-4 mb-4">
            เจาะลึกความสัมพันธ์ 4 รูปแบบ (Cardinality Deep Dive)
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            คำว่า <strong>Cardinality</strong> คือตัวเลขที่ระบุ "จำนวนความสัมพันธ์" ระหว่างข้อมูล 2 ฝั่ง ซึ่งในโลกความจริงมีรูปแบบหลักๆ อยู่ 4 แบบดังนี้:
          </p>

          <div class="space-y-8">
            <!-- 2.1 One-to-One -->
            <div class="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border-2 border-blue-200/80 shadow-md space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-base shadow-sm">1 : 1</span>
                  <h4 class="text-xl font-black text-blue-950">One-to-One (หนึ่งต่อหนึ่ง)</h4>
                </div>
                <span class="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold border border-blue-200">ความสัมพันธ์ระดับเอกสิทธิ์ (Exclusive)</span>
              </div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                ข้อมูล 1 แถวในตาราง A จะสัมพันธ์กับข้อมูลได้เพียง <strong>1 แถวในตาราง B เท่านั้น</strong> และในทางกลับกัน ตาราง B ก็ผูกกับตาราง A ได้เพียง 1 แถวเท่านั้น
              </p>

              <!-- Visual Connection Diagram 1:1 -->
              <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-inner overflow-x-auto">
                <div class="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span class="flex items-center gap-2">
                    <Database class="w-4 h-4 text-blue-400" />
                    แผนภาพโครงสร้างความสัมพันธ์ (Schema Visualizer: เส้นโค้งเชื่อมฟิลด์ PK ไปยัง FK แบบ 1:1)
                  </span>
                  <span class="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    citizens.id (1) ───&gt; (1) id_cards.citizen_id
                  </span>
                </div>

                <div class="flex flex-col lg:flex-row items-stretch lg:items-start justify-between min-w-[300px]">
                  <!-- Table A: citizens -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-blue-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-blue-900/70 border-b border-blue-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-blue-400" />
                        <span class="font-bold text-sm text-blue-100">citizens (ประชาชน)</span>
                      </div>
                      <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-sans">ตารางแม่</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="text-amber-300 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-amber-200 font-bold text-[11px]">101</span>
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#fbbf24] z-10"></span>
                    </div>
                    <!-- Row 2: citizen_id_num (Y center = 105px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-slate-200">citizen_id_num</span>
                      <span class="text-slate-400 text-[11px]">'110050...'</span>
                    </div>
                    <!-- Row 3: fullname (Y center = 145px) -->
                    <div class="h-10 px-3.5 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">fullname</span>
                      <span class="text-slate-400 text-[11px]">'สมชาย ใจดี'</span>
                    </div>
                  </div>

                  <!-- Curved SVG Field-to-Field Connector (Row 1 Y=65 -> Row 2 Y=105) -->
                  <div class="hidden lg:block w-40 shrink-0 select-none">
                    <svg width="160" height="165" viewBox="0 0 160 165" class="overflow-visible">
                      <defs>
                        <linearGradient id="grad-1to1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#fbbf24" />
                          <stop offset="50%" stop-color="#38bdf8" />
                          <stop offset="100%" stop-color="#22d3ee" />
                        </linearGradient>
                      </defs>
                      <!-- Glow under-stroke -->
                      <path d="M 0 65 C 80 65, 80 105, 160 105" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="8" stroke-linecap="round" />
                      <!-- Main curved Bezier line -->
                      <path d="M 0 65 C 80 65, 80 105, 160 105" fill="none" stroke="url(#grad-1to1)" stroke-width="3" />
                      <!-- Animated dashed pulse line -->
                      <path d="M 0 65 C 80 65, 80 105, 160 105" fill="none" stroke="#e0f2fe" stroke-width="1.5" stroke-dasharray="4 4" />
                      <!-- Left 1 Tick mark (at PK) -->
                      <line x1="14" y1="57" x2="14" y2="73" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                      <rect x="20" y="42" width="20" height="16" rx="4" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1" />
                      <text x="30" y="53" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="monospace" font-weight="bold">1</text>
                      <!-- Right 1 Tick mark & Arrowhead (at FK) -->
                      <line x1="144" y1="97" x2="144" y2="113" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" />
                      <polygon points="156,105 147,100 147,110" fill="#22d3ee" />
                      <rect x="118" y="114" width="20" height="16" rx="4" fill="#083344" stroke="#22d3ee" stroke-width="1" />
                      <text x="128" y="125" text-anchor="middle" fill="#67e8f9" font-size="10" font-family="monospace" font-weight="bold">1</text>
                    </svg>
                  </div>

                  <!-- Mobile Connector Fallback -->
                  <div class="flex lg:hidden items-center justify-center py-2 text-xs font-mono text-cyan-300 gap-2">
                    <span>citizens.id (1)</span>
                    <span>──&gt;</span>
                    <span>(1) id_cards.citizen_id</span>
                  </div>

                  <!-- Table B: id_cards -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-blue-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-blue-900/70 border-b border-blue-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-blue-400" />
                        <span class="font-bold text-sm text-blue-100">id_cards (บัตรประชาชน)</span>
                      </div>
                      <span class="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/30 font-sans">ตารางลูก</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-amber-400 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-slate-400 text-[11px]">501</span>
                    </div>
                    <!-- Row 2: citizen_id [FK, UNIQUE] (Y center = 105px) -->
                    <div class="h-10 px-3.5 bg-cyan-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#22d3ee] z-10"></span>
                      <span class="text-cyan-300 font-bold flex items-center gap-1.5">
                        <Link class="w-3.5 h-3.5 text-cyan-400" /> citizen_id [FK, UNIQUE]
                      </span>
                      <span class="text-cyan-200 font-bold text-[11px]">101</span>
                    </div>
                    <!-- Row 3: issue_date (Y center = 145px) -->
                    <div class="h-10 px-3.5 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">issue_date</span>
                      <span class="text-slate-400 text-[11px]">'2025-01-10'</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs text-blue-200">
                  <Zap class="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>กฎทางเทคนิค:</strong> เส้นโค้งลากจาก <code>citizens.id</code> [PK] ไปเข้าที่ฟิลด์ <code>id_cards.citizen_id</code> [FK] ซึ่งต้องตั้งค่าเป็น <strong>UNIQUE</strong> เพื่อบังคับให้เชื่อมได้แค่ 1 ต่อ 1 เท่านั้น</span>
                </div>
              </div>

              <!-- Examples -->
              <div class="p-4 rounded-2xl bg-white border border-blue-100 text-xs sm:text-sm space-y-2">
                <span class="font-bold text-blue-950 block">ตัวอย่างในชีวิตจริง:</span>
                <ul class="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li><strong>ประชาชน กับ บัตรประชาชน:</strong> ประชาชน 1 คน มีบัตรประจำตัวประชาชนได้ 1 ใบ และบัตร 1 ใบก็ระบุเจ้าของได้ 1 คนเท่านั้น</li>
                  <li><strong>นักศึกษา กับ ตู้ล็อกเกอร์ประจำตัว:</strong> นักศึกษา 1 คน ได้รับสิทธิ์กุญแจตู้ล็อกเกอร์ประจำตัว 1 ตู้</li>
                  <li><strong>ผู้ใช้ระบบ กับ ข้อมูลสุขภาพเชิงลึก:</strong> แยกตาราง <code>users</code> กับ <code>health_records</code> เพื่อแยกข้อมูลความลับออกจากข้อมูลล็อกอินทั่วไป</li>
                </ul>
              </div>
            </div>

            <!-- 2.2 One-to-Many -->
            <div class="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border-2 border-emerald-300 shadow-md space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl bg-emerald-600 text-white font-mono font-black text-base shadow-sm">1 : N</span>
                  <h4 class="text-xl font-black text-emerald-950">One-to-Many (หนึ่งต่อกลุ่ม)</h4>
                </div>
                <span class="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold border border-emerald-300">พบมากที่สุดในโลกจริงกว่า 80%</span>
              </div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                ข้อมูล 1 แถวในตารางหลัก สามารถสัมพันธ์กับข้อมูลในตารางรองได้ <strong>หลายแถว (Many: N)</strong> แต่ข้อมูลแต่ละแถวในตารางรอง จะชี้กลับมาหาข้อมูลตารางหลักได้เพียงแถวเดียวเสมอ
              </p>

              <!-- Visual Connection Diagram 1:N -->
              <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-inner overflow-x-auto">
                <div class="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span class="flex items-center gap-2">
                    <Database class="w-4 h-4 text-emerald-400" />
                    แผนภาพโครงสร้างความสัมพันธ์ (Schema Visualizer: เส้นโค้งเชื่อมฟิลด์ PK ไปยัง FK แบบ 1:N)
                  </span>
                  <span class="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    departments.id (1) ───&lt; (N) students.dept_id
                  </span>
                </div>

                <div class="flex flex-col lg:flex-row items-stretch lg:items-start justify-between min-w-[300px]">
                  <!-- Table A: departments (1) -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-emerald-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-emerald-950/80 border-b border-emerald-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-emerald-400" />
                        <span class="font-bold text-sm text-emerald-100">departments (แผนกวิชา)</span>
                      </div>
                      <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-sans">ฝั่งแม่ (1)</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="text-amber-300 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-amber-200 font-bold text-[11px]">1</span>
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#fbbf24] z-10"></span>
                    </div>
                    <!-- Row 2: dept_name (Y center = 105px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-slate-200">dept_name</span>
                      <span class="text-slate-300 text-[11px]">'ช่างอิเล็กทรอนิกส์'</span>
                    </div>
                    <!-- Row 3: building (Y center = 145px) -->
                    <div class="h-10 px-3.5 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">building</span>
                      <span class="text-slate-400 text-[11px]">'ตึก 52'</span>
                    </div>
                  </div>

                  <!-- Curved SVG Field-to-Field Connector (Row 1 Y=65 -> Row 3 Y=145) -->
                  <div class="hidden lg:block w-40 shrink-0 select-none">
                    <svg width="160" height="165" viewBox="0 0 160 165" class="overflow-visible">
                      <defs>
                        <linearGradient id="grad-1ton" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#fbbf24" />
                          <stop offset="50%" stop-color="#10b981" />
                          <stop offset="100%" stop-color="#34d399" />
                        </linearGradient>
                      </defs>
                      <!-- Glow under-stroke -->
                      <path d="M 0 65 C 80 65, 80 145, 160 145" fill="none" stroke="rgba(16, 185, 129, 0.25)" stroke-width="8" stroke-linecap="round" />
                      <!-- Main curved Bezier line -->
                      <path d="M 0 65 C 80 65, 80 145, 160 145" fill="none" stroke="url(#grad-1ton)" stroke-width="3" />
                      <!-- Animated dashed overlay -->
                      <path d="M 0 65 C 80 65, 80 145, 160 145" fill="none" stroke="#d1fae5" stroke-width="1.5" stroke-dasharray="4 4" />
                      <!-- Left 1 Tick mark -->
                      <line x1="14" y1="57" x2="14" y2="73" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                      <rect x="20" y="42" width="20" height="16" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1" />
                      <text x="30" y="53" text-anchor="middle" fill="#6ee7b7" font-size="10" font-family="monospace" font-weight="bold">1</text>
                      <!-- Right Crow's Foot (Many symbol <) landing on Row 3 (Y=145) -->
                      <path d="M 138 145 L 156 135 M 138 145 L 156 145 M 138 145 L 156 155" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" />
                      <circle cx="134" cy="145" r="3.5" fill="#064e3b" stroke="#34d399" stroke-width="2" />
                      <rect x="114" y="118" width="22" height="16" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1" />
                      <text x="125" y="129" text-anchor="middle" fill="#6ee7b7" font-size="10" font-family="monospace" font-weight="bold">N</text>
                    </svg>
                  </div>

                  <!-- Mobile Connector Fallback -->
                  <div class="flex lg:hidden items-center justify-center py-2 text-xs font-mono text-emerald-300 gap-2">
                    <span>departments.id (1)</span>
                    <span>──&lt;</span>
                    <span>(N) students.dept_id</span>
                  </div>

                  <!-- Table B: students (N) -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-emerald-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-emerald-950/80 border-b border-emerald-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-emerald-400" />
                        <span class="font-bold text-sm text-emerald-100">students (นักศึกษา)</span>
                      </div>
                      <span class="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30 font-sans">ฝั่งลูก (N)</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-amber-400 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-slate-400 text-[11px]">6701, 6702, 6703</span>
                    </div>
                    <!-- Row 2: student_name (Y center = 105px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-slate-200">student_name</span>
                      <span class="text-slate-300 text-[11px]">'สมศักดิ์', 'นภา', 'กิตติ'</span>
                    </div>
                    <!-- Row 3: dept_id [FK] (Y center = 145px) -->
                    <div class="h-10 px-3.5 bg-emerald-500/15 flex items-center justify-between rounded-b-xl relative">
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#34d399] z-10"></span>
                      <span class="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Link class="w-3.5 h-3.5 text-emerald-400" /> dept_id [FK]
                      </span>
                      <span class="text-emerald-200 font-bold text-[11px]">1, 1, 1</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs text-emerald-200">
                  <Zap class="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>กฎทอง (Golden Rule):</strong> เส้นโค้งลากจากฟิลด์ <code>departments.id</code> [PK] (แถวที่ 1 ของตารางแม่) โค้งลงมาเชื่อมเข้ากับฟิลด์ <code>students.dept_id</code> [FK] (แถวที่ 3 ของตารางลูก) พร้อมหัวลูกศรตีนกา (Crow's Foot) ฝั่ง Many</span>
                </div>
              </div>

              <!-- Examples -->
              <div class="p-4 rounded-2xl bg-white border border-emerald-100 text-xs sm:text-sm space-y-2">
                <span class="font-bold text-emerald-950 block">ตัวอย่างในชีวิตจริง:</span>
                <ul class="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li><strong>1 สาขาวิชา มีนักศึกษาได้หลายคน:</strong> แผนกมีนักศึกษา 150 คน แต่นักศึกษาแต่ละคนสังกัดได้เพียง 1 แผนกเท่านั้น</li>
                  <li><strong>1 ลูกค้า มีได้หลายคำสั่งซื้อ (Orders):</strong> ลูกค้าคนเดิมสั่งซื้อสินค้าได้บ่อยครั้งตามต้องการ</li>
                  <li><strong>1 คาบเรียน มีนักเรียนนั่งเรียนหลายคน:</strong> นักเรียนหลายคนนั่งรวมกันอยู่ในห้องเรียนเดียว</li>
                </ul>
              </div>
            </div>

            <!-- 2.3 Many-to-One -->
            <div class="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-2 border-indigo-200/80 shadow-md space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl bg-indigo-600 text-white font-mono font-black text-base shadow-sm">N : 1</span>
                  <h4 class="text-xl font-black text-indigo-950">Many-to-One (กลุ่มต่อหนึ่ง)</h4>
                </div>
                <span class="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold border border-indigo-200">มุมมองกลับด้านของ 1:N</span>
              </div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Many-to-One เป็นเพียง <strong>"มุมมองย้อนศรของ One-to-Many"</strong> ขึ้นอยู่กับว่าเรายืนพูดอยู่บนตารางฝั่งใด เช่น หากเรามองจากตาราง <code>students</code> มองย้อนกลับไปหา <code>departments</code> เราจะพูดว่า "นักศึกษาหลายคน (N) สังกัดอยู่ในแผนกวิชาเดียวกัน (1)"
              </p>

              <!-- Visual Connection Diagram N:1 -->
              <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-inner overflow-x-auto">
                <div class="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span class="flex items-center gap-2">
                    <Database class="w-4 h-4 text-indigo-400" />
                    แผนภาพโครงสร้างความสัมพันธ์ (Schema Visualizer: เส้นโค้งจากฟิลด์ FK ชี้ย้อนขึ้นไปหา PK แบบ N:1)
                  </span>
                  <span class="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-500/30">
                    students.dept_id (N) &gt;─── (1) departments.id
                  </span>
                </div>

                <div class="flex flex-col lg:flex-row items-stretch lg:items-start justify-between min-w-[300px]">
                  <!-- Table N: students -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-indigo-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-indigo-950/80 border-b border-indigo-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-indigo-400" />
                        <span class="font-bold text-sm text-indigo-100">students (นักศึกษาหลายคน)</span>
                      </div>
                      <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 font-sans">ฝั่งต้นทาง (N)</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-amber-400 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-slate-400 text-[11px]">6701, 6702, 6703</span>
                    </div>
                    <!-- Row 2: student_name (Y center = 105px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-slate-200">student_name</span>
                      <span class="text-slate-300 text-[11px]">'สมศักดิ์', 'นภา', 'กิตติ'</span>
                    </div>
                    <!-- Row 3: dept_id [FK] (Y center = 145px) -->
                    <div class="h-10 px-3.5 bg-indigo-500/20 flex items-center justify-between rounded-b-xl relative">
                      <span class="text-indigo-300 font-bold flex items-center gap-1.5">
                        <Link class="w-3.5 h-3.5 text-indigo-400" /> dept_id [FK]
                      </span>
                      <span class="text-indigo-200 font-bold text-[11px]">1, 1, 1</span>
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-indigo-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#818cf8] z-10"></span>
                    </div>
                  </div>

                  <!-- Curved SVG Field-to-Field Connector (Row 3 Y=145 -> Row 1 Y=65) -->
                  <div class="hidden lg:block w-40 shrink-0 select-none">
                    <svg width="160" height="165" viewBox="0 0 160 165" class="overflow-visible">
                      <defs>
                        <linearGradient id="grad-nto1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#818cf8" />
                          <stop offset="50%" stop-color="#38bdf8" />
                          <stop offset="100%" stop-color="#fbbf24" />
                        </linearGradient>
                      </defs>
                      <!-- Glow under-stroke -->
                      <path d="M 0 145 C 80 145, 80 65, 160 65" fill="none" stroke="rgba(129, 140, 248, 0.25)" stroke-width="8" stroke-linecap="round" />
                      <!-- Main curved Bezier line curving UP from Y=145 to Y=65 -->
                      <path d="M 0 145 C 80 145, 80 65, 160 65" fill="none" stroke="url(#grad-nto1)" stroke-width="3" />
                      <!-- Animated dashed overlay -->
                      <path d="M 0 145 C 80 145, 80 65, 160 65" fill="none" stroke="#e0e7ff" stroke-width="1.5" stroke-dasharray="4 4" />
                      <!-- Left Crow's Foot (Many >) at Row 3 (Y=145) -->
                      <path d="M 22 145 L 4 135 M 22 145 L 4 145 M 22 145 L 4 155" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" />
                      <circle cx="26" cy="145" r="3.5" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
                      <rect x="22" y="118" width="22" height="16" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
                      <text x="33" y="129" text-anchor="middle" fill="#a5b4fc" font-size="10" font-family="monospace" font-weight="bold">N</text>
                      <!-- Right 1 Tick mark & Arrowhead at Row 1 (Y=65) -->
                      <line x1="144" y1="57" x2="144" y2="73" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                      <polygon points="156,65 147,60 147,70" fill="#fbbf24" />
                      <rect x="118" y="42" width="20" height="16" rx="4" fill="#1e1b4b" stroke="#fbbf24" stroke-width="1" />
                      <text x="128" y="53" text-anchor="middle" fill="#fde68a" font-size="10" font-family="monospace" font-weight="bold">1</text>
                    </svg>
                  </div>

                  <!-- Mobile Connector Fallback -->
                  <div class="flex lg:hidden items-center justify-center py-2 text-xs font-mono text-indigo-300 gap-2">
                    <span>students.dept_id (N)</span>
                    <span>&gt;──</span>
                    <span>(1) departments.id</span>
                  </div>

                  <!-- Table 1: departments -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-indigo-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3.5 bg-indigo-950/80 border-b border-indigo-500/30 rounded-t-xl flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Table class="w-4 h-4 text-indigo-400" />
                        <span class="font-bold text-sm text-indigo-100">departments (แผนกวิชา)</span>
                      </div>
                      <span class="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30 font-sans">ฝั่งปลายทาง (1)</span>
                    </div>
                    <!-- Row 1: id [PK] (Y center = 65px) -->
                    <div class="h-10 px-3.5 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="hidden lg:block w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#fbbf24] z-10"></span>
                      <span class="text-amber-300 font-bold flex items-center gap-1.5">
                        <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-amber-200 font-bold text-[11px]">1</span>
                    </div>
                    <!-- Row 2: dept_name (Y center = 105px) -->
                    <div class="h-10 px-3.5 border-b border-slate-700/60 flex items-center justify-between">
                      <span class="text-slate-200">dept_name</span>
                      <span class="text-slate-300 text-[11px]">'ช่างอิเล็กทรอนิกส์'</span>
                    </div>
                    <!-- Row 3: building (Y center = 145px) -->
                    <div class="h-10 px-3.5 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">building</span>
                      <span class="text-slate-400 text-[11px]">'ตึก 52'</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2.4 Many-to-Many -->
            <div class="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border-2 border-purple-200/80 shadow-md space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl bg-purple-600 text-white font-mono font-black text-base shadow-sm">N : M</span>
                  <h4 class="text-xl font-black text-purple-950">Many-to-Many (กลุ่มต่อกลุ่ม)</h4>
                </div>
                <span class="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold border border-purple-200">ต้องใช้ตารางตัวกลาง (Junction Table) ช่วย</span>
              </div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                ข้อมูล 1 แถวในตาราง A สัมพันธ์กับหลายแถวในตาราง B และข้อมูล 1 แถวในตาราง B ก็สัมพันธ์กับหลายแถวในตาราง A ในฐานข้อมูลเชิงสัมพันธ์ <strong>ห้ามเชื่อม N:M ชนกันตรงๆ เด็ดขาด</strong> ต้องแตกออกเป็นตารางตัวกลาง
              </p>

              <!-- Visual Connection Diagram N:M with Curved Field-to-Field Junction Bridge -->
              <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-inner overflow-x-auto">
                <div class="text-xs font-bold text-purple-300 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span class="flex items-center gap-2">
                    <Database class="w-4 h-4 text-purple-400" />
                    แผนภาพโครงสร้างความสัมพันธ์ (Schema Visualizer: เส้นโค้งจาก PK ทั้ง 2 ฝั่งพุ่งเข้าฟิลด์ FK ในตารางกลาง)
                  </span>
                  <span class="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-500/30">
                    students.id (1) ──&lt; enrollments &gt;── (1) courses.id
                  </span>
                </div>

                <div class="flex flex-col xl:flex-row items-stretch xl:items-start justify-between min-w-[300px]">
                  <!-- Left Table: students -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-teal-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3 bg-teal-950/80 border-b border-teal-500/30 rounded-t-xl flex items-center justify-between">
                      <span class="font-bold text-teal-200">students (นศ.)</span>
                      <span class="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-sans">ตารางแม่ 1</span>
                    </div>
                    <!-- Row 1: id [PK] (Y = 65) -->
                    <div class="h-10 px-3 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="text-amber-300 font-bold flex items-center gap-1">
                        <Key class="w-3 h-3 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-amber-200 font-bold">101</span>
                      <span class="hidden xl:block w-3 h-3 rounded-full bg-teal-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#2dd4bf] z-10"></span>
                    </div>
                    <!-- Row 2: fullname (Y = 105) -->
                    <div class="h-10 px-3 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">fullname</span>
                      <span class="text-slate-400">'สมชาย'</span>
                    </div>
                  </div>

                  <!-- Left Curved Connector: students.id (Y=65) -> enrollments.student_id (Y=105) -->
                  <div class="hidden xl:block w-28 shrink-0 select-none">
                    <svg width="112" height="165" viewBox="0 0 112 165" class="overflow-visible">
                      <path d="M 0 65 C 56 65, 56 105, 112 105" fill="none" stroke="rgba(45, 212, 191, 0.25)" stroke-width="7" stroke-linecap="round" />
                      <path d="M 0 65 C 56 65, 56 105, 112 105" fill="none" stroke="#2dd4bf" stroke-width="2.5" />
                      <path d="M 0 65 C 56 65, 56 105, 112 105" fill="none" stroke="#ccfbf1" stroke-width="1.5" stroke-dasharray="4 4" />
                      <line x1="10" y1="58" x2="10" y2="72" stroke="#2dd4bf" stroke-width="2" />
                      <text x="18" y="54" fill="#5eead4" font-size="10" font-family="monospace" font-weight="bold">1</text>
                      <path d="M 94 105 L 108 97 M 94 105 L 108 105 M 94 105 L 108 113" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round" />
                      <text x="84" y="94" fill="#5eead4" font-size="10" font-family="monospace" font-weight="bold">N</text>
                    </svg>
                  </div>

                  <!-- Mobile Connector 1 -->
                  <div class="flex xl:hidden items-center justify-center py-1.5 text-[11px] font-mono text-teal-300">
                    students.id (1) ──&lt; (N) enrollments.student_id
                  </div>

                  <!-- Center Junction Table: enrollments -->
                  <div class="flex-1 rounded-xl bg-indigo-950/95 border-2 border-indigo-400 shadow-xl font-mono text-xs overflow-visible">
                    <div class="h-11 px-3 bg-indigo-900 border-b border-indigo-400/60 rounded-t-xl flex items-center justify-between">
                      <span class="font-bold text-white">enrollments (กลาง)</span>
                      <span class="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-sans font-bold">Junction</span>
                    </div>
                    <!-- Row 1: id [PK] (Y = 65) -->
                    <div class="h-10 px-3 border-b border-indigo-800/60 flex items-center justify-between">
                      <span class="text-amber-400 font-bold flex items-center gap-1">
                        <Key class="w-3 h-3" /> id [PK]
                      </span>
                      <span class="text-slate-300">1</span>
                    </div>
                    <!-- Row 2: student_id [FK] (Y = 105) -->
                    <div class="h-10 px-3 bg-teal-500/20 border-b border-indigo-800/60 flex items-center justify-between relative">
                      <span class="hidden xl:block w-3 h-3 rounded-full bg-teal-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#2dd4bf] z-10"></span>
                      <span class="text-teal-300 font-bold flex items-center gap-1">
                        <Link class="w-3 h-3" /> student_id [FK]
                      </span>
                      <span class="text-teal-200 font-bold">101</span>
                    </div>
                    <!-- Row 3: course_id [FK] (Y = 145) -->
                    <div class="h-10 px-3 bg-purple-500/20 flex items-center justify-between rounded-b-xl relative">
                      <span class="text-purple-300 font-bold flex items-center gap-1">
                        <Link class="w-3 h-3" /> course_id [FK]
                      </span>
                      <span class="text-purple-200 font-bold">501</span>
                      <span class="hidden xl:block w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#c084fc] z-10"></span>
                    </div>
                  </div>

                  <!-- Mobile Connector 2 -->
                  <div class="flex xl:hidden items-center justify-center py-1.5 text-[11px] font-mono text-purple-300">
                    enrollments.course_id (N) &gt;── (1) courses.id
                  </div>

                  <!-- Right Curved Connector: courses.id (Y=65) -> enrollments.course_id (Y=145) -->
                  <div class="hidden xl:block w-28 shrink-0 select-none">
                    <svg width="112" height="165" viewBox="0 0 112 165" class="overflow-visible">
                      <path d="M 112 65 C 56 65, 56 145, 0 145" fill="none" stroke="rgba(192, 132, 252, 0.25)" stroke-width="7" stroke-linecap="round" />
                      <path d="M 112 65 C 56 65, 56 145, 0 145" fill="none" stroke="#c084fc" stroke-width="2.5" />
                      <path d="M 112 65 C 56 65, 56 145, 0 145" fill="none" stroke="#f3e8ff" stroke-width="1.5" stroke-dasharray="4 4" />
                      <line x1="102" y1="58" x2="102" y2="72" stroke="#c084fc" stroke-width="2" />
                      <text x="90" y="54" fill="#d8b4fe" font-size="10" font-family="monospace" font-weight="bold">1</text>
                      <path d="M 18 145 L 4 137 M 18 145 L 4 145 M 18 145 L 4 153" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" />
                      <text x="20" y="134" fill="#d8b4fe" font-size="10" font-family="monospace" font-weight="bold">N</text>
                    </svg>
                  </div>

                  <!-- Right Table: courses -->
                  <div class="flex-1 rounded-xl bg-slate-800/95 border border-purple-500/40 shadow-lg font-mono text-xs overflow-visible">
                    <div class="h-11 px-3 bg-purple-950/80 border-b border-purple-500/30 rounded-t-xl flex items-center justify-between">
                      <span class="font-bold text-purple-200">courses (วิชา)</span>
                      <span class="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-sans">ตารางแม่ 2</span>
                    </div>
                    <!-- Row 1: id [PK] (Y = 65) -->
                    <div class="h-10 px-3 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                      <span class="hidden xl:block w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#c084fc] z-10"></span>
                      <span class="text-amber-300 font-bold flex items-center gap-1">
                        <Key class="w-3 h-3 text-amber-400" /> id [PK]
                      </span>
                      <span class="text-amber-200 font-bold">501</span>
                    </div>
                    <!-- Row 2: course_name (Y = 105) -->
                    <div class="h-10 px-3 flex items-center justify-between rounded-b-xl">
                      <span class="text-slate-200">course_name</span>
                      <span class="text-slate-400">'Database'</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Examples -->
              <div class="p-4 rounded-2xl bg-white border border-purple-100 text-xs sm:text-sm space-y-2">
                <span class="font-bold text-purple-950 block">ตัวอย่างในชีวิตจริง:</span>
                <ul class="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li><strong>นักศึกษา กับ รายวิชา:</strong> นักศึกษา 1 คนลงเรียนได้หลายวิชา และ 1 รายวิชาก็มีนักศึกษาลงทะเบียนได้หลายคน</li>
                  <li><strong>คุณหมอ กับ คนไข้:</strong> คุณหมอ 1 ท่านตรวจคนไข้ได้หลายคน และคนไข้ 1 คนก็พบหมอเฉพาะทางหลายท่านได้</li>
                  <li><strong>ผู้ใช้ Facebook กับ กลุ่มชุมชน (Groups):</strong> 1 คนเข้าร่วมได้หลายกลุ่ม และแต่ละกลุ่มก็มีสมาชิกได้หลายคน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- TOPIC 3: FOREIGN KEY PLACEMENT RULE -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              หัวข้อที่ 3
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-teal-950 border-l-4 border-teal-600 pl-4 mb-4">
            กฎเหล็กการวาง Foreign Key: คีย์นอกต้องไปอยู่ที่ตารางใคร?
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            คำถามที่พบบ่อยที่สุด: <em>"ถ้ามีตาราง departments กับ students เราต้องเอา ID ของใครไปใส่ในตารางใคร?"</em> มาจำกฎข้อนี้ให้ขึ้นใจ:
          </p>

          <!-- Golden Rule Banner -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white space-y-3 shadow-md">
            <div class="flex items-center gap-3">
              <Key class="w-6 h-6 text-teal-400 shrink-0" />
              <h4 class="text-lg font-black text-teal-300">กฎทองคำของการสร้าง Foreign Key ในความสัมพันธ์ 1:N</h4>
            </div>
            <p class="text-sm sm:text-base font-bold text-white leading-relaxed">
              "คอลัมน์ Foreign Key (คีย์นอก) จะต้องไปฝังตัวอยู่ที่ตารางฝั่ง Many เสมอ!"
            </p>
            <p class="text-xs text-slate-300 leading-relaxed">
              <strong>เหตุผลทางตรรกะ:</strong> เพราะฝั่ง Many (นักศึกษา) มีหลายคน แต่ละคนจึงสามารถบันทึกตัวเลข <code>department_id</code> บอกว่าตนเองสังกัดสาขาใดได้อย่างลงตัว ถ้าเราไปฝืนใส่ <code>student_id</code> ไว้ในตาราง departments เราจะต้องสร้างคอลัมน์ไม่รู้จบเพื่อเก็บรหัสนักศึกษาทุกคน ซึ่งทำไม่ได้ในระบบ RDBMS
            </p>
          </div>

          <!-- ON DELETE Rules -->
          <div class="mt-6 space-y-3">
            <h4 class="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldAlert class="w-5 h-5 text-indigo-600" />
              ข้อกำหนดการลบข้อมูล (Referential Actions: ON DELETE)
            </h4>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              เมื่อตารางแม่ถูกลบข้อมูล จะให้เกิดอะไรขึ้นกับแถวข้อมูลในตารางลูก? เราสามารถกำหนดพฤติกรรมได้ 3 แบบ:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span class="font-mono font-bold text-rose-700 text-sm">ON DELETE CASCADE</span>
                <p class="text-gray-600 leading-relaxed">
                  <strong>ลบตามเป็นทอดๆ:</strong> เมื่อลบข้อมูลตารางแม่ แถวข้อมูลในตารางลูกที่อ้างอิงอยู่จะถูกลบทิ้งไปด้วยอัตโนมัติ (เช่น ลบ Order รายการสินค้าใน Order นั้นหายตาม)
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span class="font-mono font-bold text-amber-700 text-sm">ON DELETE RESTRICT</span>
                <p class="text-gray-600 leading-relaxed">
                  <strong>ห้ามลบเด็ดขาด:</strong> ถ้าระบบตรวจพบว่ายังมีข้อมูลลูกอ้างอิงอยู่ จะระงับการลบและแจ้งข้อผิดพลาด (เช่น ห้ามลบสาขาวิชาถ้ายังมีนักศึกษาเรียนอยู่)
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span class="font-mono font-bold text-blue-700 text-sm">ON DELETE SET NULL</span>
                <p class="text-gray-600 leading-relaxed">
                  <strong>ตั้งค่าเป็นว่าง:</strong> เมื่อตารางแม่ถูกลบ คอลัมน์ Foreign Key ในตารางลูกจะถูกเปลี่ยนให้เป็น NULL (กลายเป็นข้อมูลที่ยังไม่มีสังกัด)
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- TOPIC 4: RESOLVING MANY-TO-MANY WITH JUNCTION TABLE -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              หัวข้อที่ 4
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-teal-950 border-l-4 border-teal-600 pl-4 mb-4">
            การแก้ปัญหา Many-to-Many ด้วย "ตารางตัวกลาง (Junction Table)"
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            เนื่องจาก RDBMS ห้ามเก็บข้อมูลแบบอาร์เรย์หรือลิสต์คั่นด้วยจุลภาค <code>course_ids: '1, 2, 5'</code> เพราะจะค้นหาไม่ได้ เราจึงต้องใช้เทคนิค <strong>Junction Table (หรือ Bridge Table / Associative Table)</strong>:
          </p>

          <!-- The Junction Transformation Diagram Card -->
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white space-y-6 shadow-2xl border-2 border-indigo-500/40">
            <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4 flex-wrap gap-2">
              <span class="text-indigo-300 font-bold flex items-center gap-2.5 text-base sm:text-lg">
                <Split class="w-6 h-6 text-indigo-400" />
                สูตรแปลง Many-to-Many: แปลง N:M เป็น 1:N สองเส้น ผ่าน Junction Table
              </span>
              <span class="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/40 font-mono font-bold tracking-wide">
                RELATIONAL CORE PATTERN
              </span>
            </div>

            <!-- 3 Schema Tables with Curved Field-to-Field Connectors -->
            <div class="flex flex-col xl:flex-row items-stretch xl:items-start justify-between font-mono min-w-[300px]">
              <!-- TABLE 1: students (Parent 1) -->
              <div class="flex-1 rounded-2xl bg-slate-900/95 border-2 border-teal-500/40 shadow-xl flex flex-col justify-between overflow-visible">
                <div>
                  <!-- Header: 44px (h-11) -->
                  <div class="h-11 px-4 bg-gradient-to-r from-teal-950 to-slate-900 border-b border-teal-500/30 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Table class="w-4 h-4 text-teal-400" />
                      <span class="font-bold text-sm text-teal-200">students</span>
                    </div>
                    <span class="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/40 font-sans font-bold">ตารางแม่ 1 (ฝั่ง 1)</span>
                  </div>

                  <!-- Row 1: id [PK] (Y center = 66px) -->
                  <div class="h-10 px-4 bg-amber-500/15 border-b border-slate-800 flex items-center justify-between text-xs relative">
                    <span class="text-amber-300 font-bold flex items-center gap-1.5">
                      <Key class="w-3.5 h-3.5 text-amber-400" /> id
                    </span>
                    <span class="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PK (BIGINT)</span>
                    <span class="hidden xl:block w-3.5 h-3.5 rounded-full bg-teal-400 border-2 border-slate-950 absolute -right-2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#2dd4bf] z-10"></span>
                  </div>
                  <!-- Row 2: student_code (Y center = 106px) -->
                  <div class="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-200">student_code</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(10)</span>
                  </div>
                  <!-- Row 3: fullname (Y center = 146px) -->
                  <div class="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-200">fullname</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(100)</span>
                  </div>
                </div>

                <!-- Sample Data Preview -->
                <div class="p-3 bg-slate-950/80 rounded-b-2xl text-[11px]">
                  <div class="text-[10px] text-teal-400/90 font-sans font-bold mb-1.5 flex items-center gap-1">
                    <Eye class="w-3 h-3" /> ข้อมูลตัวอย่าง (Sample Records):
                  </div>
                  <table class="w-full text-left text-slate-300">
                    <thead>
                      <tr class="border-b border-slate-800 text-[10px] text-slate-500">
                        <th class="py-1">id</th>
                        <th>code</th>
                        <th>fullname</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">1</td>
                        <td>STD01</td>
                        <td>สมชาย</td>
                      </tr>
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">2</td>
                        <td>STD02</td>
                        <td>วิภา</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- CURVED CONNECTOR 1: students.id (Row 1, Y=66) -> enrollments.student_id (Row 2, Y=106) -->
              <div class="hidden xl:block w-28 shrink-0 select-none">
                <svg width="112" height="170" viewBox="0 0 112 170" class="overflow-visible">
                  <defs>
                    <linearGradient id="grad-junc-left" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#fbbf24" />
                      <stop offset="40%" stop-color="#2dd4bf" />
                      <stop offset="100%" stop-color="#5eead4" />
                    </linearGradient>
                  </defs>
                  <!-- Outer Glow -->
                  <path d="M 0 66 C 56 66, 56 106, 112 106" fill="none" stroke="rgba(45, 212, 191, 0.28)" stroke-width="8" stroke-linecap="round" />
                  <!-- Main Bezier Curve -->
                  <path d="M 0 66 C 56 66, 56 106, 112 106" fill="none" stroke="url(#grad-junc-left)" stroke-width="3" />
                  <!-- Animated Dash Overlay -->
                  <path d="M 0 66 C 56 66, 56 106, 112 106" fill="none" stroke="#ccfbf1" stroke-width="1.5" stroke-dasharray="4 4" />
                  <!-- Left 1 Tick & Badge at Y=66 -->
                  <line x1="12" y1="58" x2="12" y2="74" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" />
                  <rect x="16" y="38" width="22" height="16" rx="4" fill="#042f2e" stroke="#2dd4bf" stroke-width="1" />
                  <text x="27" y="49" text-anchor="middle" fill="#5eead4" font-size="10" font-family="monospace" font-weight="bold">1</text>
                  <!-- Right Crow's Foot (Many <) & Badge at Y=106 -->
                  <path d="M 92 106 L 108 97 M 92 106 L 108 106 M 92 106 L 108 115" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" />
                  <circle cx="88" cy="106" r="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="2" />
                  <rect x="74" y="116" width="22" height="16" rx="4" fill="#042f2e" stroke="#2dd4bf" stroke-width="1" />
                  <text x="85" y="127" text-anchor="middle" fill="#5eead4" font-size="10" font-family="monospace" font-weight="bold">N</text>
                </svg>
              </div>

              <!-- Mobile Connector 1 -->
              <div class="flex xl:hidden items-center justify-center py-2 text-xs font-mono text-teal-300">
                students.id (1) ───&lt; (N) enrollments.student_id
              </div>

              <!-- TABLE 2: enrollments (Junction Table) -->
              <div class="flex-1 rounded-2xl bg-indigo-950/95 border-2 border-indigo-400 shadow-2xl flex flex-col justify-between overflow-visible">
                <div>
                  <!-- Header: 44px (h-11) -->
                  <div class="h-11 px-4 bg-gradient-to-r from-indigo-900 to-purple-950 border-b border-indigo-400/50 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Table class="w-4 h-4 text-indigo-300" />
                      <span class="font-bold text-sm text-white">enrollments</span>
                    </div>
                    <span class="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-sans font-black shadow">Junction Table (กลาง)</span>
                  </div>

                  <!-- Row 1: id [PK] (Y center = 66px) -->
                  <div class="h-10 px-4 border-b border-indigo-900/70 flex items-center justify-between text-xs">
                    <span class="text-amber-400 font-bold flex items-center gap-1.5">
                      <Key class="w-3.5 h-3.5 text-amber-400" /> id
                    </span>
                    <span class="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PK (BIGINT)</span>
                  </div>
                  <!-- Row 2: student_id [FK] (Y center = 106px) <-- Connected from Left Table Row 1 -->
                  <div class="h-10 px-4 bg-teal-500/20 border-b border-indigo-900/70 flex items-center justify-between text-xs relative">
                    <span class="hidden xl:block w-3.5 h-3.5 rounded-full bg-teal-400 border-2 border-slate-950 absolute -left-2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#2dd4bf] z-10"></span>
                    <span class="text-teal-300 font-bold flex items-center gap-1.5">
                      <Link class="w-3.5 h-3.5 text-teal-400" /> student_id
                    </span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/30 text-teal-200 font-bold">FK -&gt; students.id</span>
                  </div>
                  <!-- Row 3: course_id [FK] (Y center = 146px) <-- Connected from Right Table Row 1 -->
                  <div class="h-10 px-4 bg-purple-500/20 border-b border-indigo-900/70 flex items-center justify-between text-xs relative">
                    <span class="text-purple-300 font-bold flex items-center gap-1.5">
                      <Link class="w-3.5 h-3.5 text-purple-400" /> course_id
                    </span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-bold">FK -&gt; courses.id</span>
                    <span class="hidden xl:block w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-slate-950 absolute -right-2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#c084fc] z-10"></span>
                  </div>
                  <!-- Row 4: semester (Y center = 186px) -->
                  <div class="h-10 px-4 border-b border-indigo-900/70 flex items-center justify-between text-xs">
                    <span class="text-slate-200">semester</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(10)</span>
                  </div>
                  <!-- Row 5: grade (Y center = 226px) -->
                  <div class="h-10 px-4 border-b border-indigo-900/70 flex items-center justify-between text-xs">
                    <span class="text-slate-200">grade</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(2)</span>
                  </div>
                </div>

                <!-- Sample Data Preview -->
                <div class="p-3 bg-slate-950/90 rounded-b-2xl text-[11px]">
                  <div class="text-[10px] text-indigo-300 font-sans font-bold mb-1.5 flex items-center gap-1">
                    <Eye class="w-3 h-3" /> ข้อมูลลงทะเบียน (เชื่อม N:M):
                  </div>
                  <table class="w-full text-left text-slate-300">
                    <thead>
                      <tr class="border-b border-slate-800 text-[10px] text-slate-500">
                        <th class="py-1">id</th>
                        <th class="text-teal-400">stu_id</th>
                        <th class="text-purple-400">crs_id</th>
                        <th>grade</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">1</td>
                        <td class="text-teal-300 font-bold">1 <span class="text-[9px] text-slate-400 font-sans">(สมชาย)</span></td>
                        <td class="text-purple-300 font-bold">101 <span class="text-[9px] text-slate-400 font-sans">(DB)</span></td>
                        <td class="text-emerald-400 font-bold">A</td>
                      </tr>
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">2</td>
                        <td class="text-teal-300 font-bold">1 <span class="text-[9px] text-slate-400 font-sans">(สมชาย)</span></td>
                        <td class="text-purple-300 font-bold">102 <span class="text-[9px] text-slate-400 font-sans">(IoT)</span></td>
                        <td class="text-emerald-400 font-bold">B+</td>
                      </tr>
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">3</td>
                        <td class="text-teal-300 font-bold">2 <span class="text-[9px] text-slate-400 font-sans">(วิภา)</span></td>
                        <td class="text-purple-300 font-bold">101 <span class="text-[9px] text-slate-400 font-sans">(DB)</span></td>
                        <td class="text-emerald-400 font-bold">A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Mobile Connector 2 -->
              <div class="flex xl:hidden items-center justify-center py-2 text-xs font-mono text-purple-300">
                enrollments.course_id (N) &gt;─── (1) courses.id
              </div>

              <!-- CURVED CONNECTOR 2: courses.id (Row 1, Y=66) -> enrollments.course_id (Row 3, Y=146) -->
              <div class="hidden xl:block w-28 shrink-0 select-none">
                <svg width="112" height="170" viewBox="0 0 112 170" class="overflow-visible">
                  <defs>
                    <linearGradient id="grad-junc-right" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stop-color="#fbbf24" />
                      <stop offset="40%" stop-color="#c084fc" />
                      <stop offset="100%" stop-color="#d8b4fe" />
                    </linearGradient>
                  </defs>
                  <!-- Outer Glow -->
                  <path d="M 112 66 C 56 66, 56 146, 0 146" fill="none" stroke="rgba(192, 132, 252, 0.28)" stroke-width="8" stroke-linecap="round" />
                  <!-- Main Bezier Curve -->
                  <path d="M 112 66 C 56 66, 56 146, 0 146" fill="none" stroke="url(#grad-junc-right)" stroke-width="3" />
                  <!-- Animated Dash Overlay -->
                  <path d="M 112 66 C 56 66, 56 146, 0 146" fill="none" stroke="#f3e8ff" stroke-width="1.5" stroke-dasharray="4 4" />
                  <!-- Right 1 Tick & Badge at Y=66 -->
                  <line x1="100" y1="58" x2="100" y2="74" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" />
                  <rect x="74" y="38" width="22" height="16" rx="4" fill="#3b0764" stroke="#c084fc" stroke-width="1" />
                  <text x="85" y="49" text-anchor="middle" fill="#e9d5ff" font-size="10" font-family="monospace" font-weight="bold">1</text>
                  <!-- Left Crow's Foot (Many >) & Badge at Y=146 -->
                  <path d="M 20 146 L 4 137 M 20 146 L 4 146 M 20 146 L 4 155" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" />
                  <circle cx="24" cy="146" r="3" fill="#3b0764" stroke="#c084fc" stroke-width="2" />
                  <rect x="16" y="118" width="22" height="16" rx="4" fill="#3b0764" stroke="#c084fc" stroke-width="1" />
                  <text x="27" y="129" text-anchor="middle" fill="#e9d5ff" font-size="10" font-family="monospace" font-weight="bold">N</text>
                </svg>
              </div>

              <!-- TABLE 3: courses (Parent 2) -->
              <div class="flex-1 rounded-2xl bg-slate-900/95 border-2 border-purple-500/40 shadow-xl flex flex-col justify-between overflow-visible">
                <div>
                  <!-- Header: 44px (h-11) -->
                  <div class="h-11 px-4 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/30 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Table class="w-4 h-4 text-purple-400" />
                      <span class="font-bold text-sm text-purple-200">courses</span>
                    </div>
                    <span class="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/40 font-sans font-bold">ตารางแม่ 2 (ฝั่ง 1)</span>
                  </div>

                  <!-- Row 1: id [PK] (Y center = 66px) -->
                  <div class="h-10 px-4 bg-amber-500/15 border-b border-slate-800 flex items-center justify-between text-xs relative">
                    <span class="hidden xl:block w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-slate-950 absolute -left-2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#c084fc] z-10"></span>
                    <span class="text-amber-300 font-bold flex items-center gap-1.5">
                      <Key class="w-3.5 h-3.5 text-amber-400" /> id
                    </span>
                    <span class="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PK (BIGINT)</span>
                  </div>
                  <!-- Row 2: course_code (Y center = 106px) -->
                  <div class="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-200">course_code</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(10)</span>
                  </div>
                  <!-- Row 3: course_name (Y center = 146px) -->
                  <div class="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-200">course_name</span>
                    <span class="text-[10px] text-slate-400 font-sans">VARCHAR(100)</span>
                  </div>
                  <!-- Row 4: credits (Y center = 186px) -->
                  <div class="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-200">credits</span>
                    <span class="text-[10px] text-slate-400 font-sans">INT</span>
                  </div>
                </div>

                <!-- Sample Data Preview -->
                <div class="p-3 bg-slate-950/80 rounded-b-2xl text-[11px]">
                  <div class="text-[10px] text-purple-400/90 font-sans font-bold mb-1.5 flex items-center gap-1">
                    <Eye class="w-3 h-3" /> ข้อมูลตัวอย่าง (Sample Records):
                  </div>
                  <table class="w-full text-left text-slate-300">
                    <thead>
                      <tr class="border-b border-slate-800 text-[10px] text-slate-500">
                        <th class="py-1">id</th>
                        <th>code</th>
                        <th>course_name</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">101</td>
                        <td>31901-2007</td>
                        <td>Database Sys</td>
                      </tr>
                      <tr>
                        <td class="py-1 text-amber-400 font-bold">102</td>
                        <td>31901-2008</td>
                        <td>IoT Systems</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Summary Bar -->
            <div class="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-400/40 text-xs sm:text-sm font-sans text-indigo-100 leading-relaxed flex items-start gap-3">
              <Zap class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>บทสรุปกลไกสำคัญ:</strong> จากเดิมที่นักศึกษา 1 คนลงได้หลายวิชา และ 1 วิชามีนักเรียนได้หลายคน (Many-to-Many) เมื่อใส่ตารางตัวกลาง <code>enrollments</code> เข้ามา:
                <ul class="list-disc pl-5 mt-1.5 space-y-1 text-indigo-200 text-xs">
                  <li><code>students</code> (1) เชื่อมไปยัง <code>enrollments</code> (N) ด้วย <code>student_id</code> (นักศึกษา 1 คนมีหลายแถวการลงทะเบียน)</li>
                  <li><code>courses</code> (1) เชื่อมไปยัง <code>enrollments</code> (N) ด้วย <code>course_id</code> (รายวิชา 1 วิชามีหลายแถวการลงทะเบียน)</li>
                  <li>ทำให้ความสัมพันธ์ N:M กลายเป็น <strong>1:N สองเส้น</strong> ที่ถูกกฎฐานข้อมูล RDBMS 100% ค้นหาเร็ว และไม่เกิดข้อมูลซ้ำซ้อน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- TOPIC 5: SUPABASE SCHEMA VISUALIZER -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              หัวข้อที่ 5
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-teal-950 border-l-4 border-teal-600 pl-4 mb-4">
            การสร้าง Foreign Key และการตรวจดูผ่าน Schema Visualizer บน Supabase
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            Supabase มีเครื่องมือพิเศษที่ช่วยให้นักพัฒนาเห็นภาพโครงสร้างฐานข้อมูลแบบกราฟิกจำลอง (Interactive ER Diagram) โดยมีขั้นตอนการใช้งานดังนี้:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <p class="font-bold text-gray-900">สร้างตารางแม่ก่อนเสมอ</p>
              <p class="text-gray-600 text-[11px] leading-relaxed">
                สร้างตาราง <code>departments</code> ให้มี Primary Key ให้เรียบร้อย ก่อนจะไปสร้างตารางลูกที่ต้องอ้างอิงถึง
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <p class="font-bold text-gray-900">เพิ่มคอลัมน์ Foreign Key</p>
              <p class="text-gray-600 text-[11px] leading-relaxed">
                ในตารางลูก ให้สร้างคอลัมน์ เช่น <code>department_id</code> แล้วเลือกปุ่ม <strong>"Add foreign key relation"</strong> ชี้ไปหา <code>departments.id</code>
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <p class="font-bold text-gray-900">กำหนด Action ON DELETE</p>
              <p class="text-gray-600 text-[11px] leading-relaxed">
                เลือกระหว่าง <code>Cascade</code>, <code>Restrict</code> หรือ <code>Set Null</code> ตามความเหมาะสมของระบบ
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">4</span>
              <p class="font-bold text-gray-900">เปิด Schema Visualizer</p>
              <p class="text-gray-600 text-[11px] leading-relaxed">
                ที่แถบเมนูด้านซ้ายในหมวด Database คลิกเปิด <strong>Schema Visualizer</strong> เพื่อดูเส้นโยงความสัมพันธ์สีเขียว-ฟ้าแบบสดๆ!
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ============================================================== -->
    <!-- INTERACTIVE MINI-GAMES & POST-TEST                             -->
    <!-- ============================================================== -->
    <GameCenterSection
      :course-id="currentCourseId"
      :week="currentWeek"
      drag-title="มินิเกมที่ 1: จัดกลุ่มประเภทความสัมพันธ์ของข้อมูล (Cardinality)"
      drag-subtitle="ลากสถานการณ์จำลองด้านล่างไปใส่ลงในกล่องความสัมพันธ์ที่ถูกต้อง: 1:1, 1:N หรือ N:M (เล่นได้ครั้งเดียว)"
      :drag-items="dragItemsData"
      :drag-zones="dragZonesData"
      match-title="มินิเกมที่ 2: จับคู่หลักการ Foreign Key และ Junction Table"
      match-subtitle="จับคู่คำศัพท์และกฎด้านซ้ายกับคำอธิบายด้านขวาให้ถูกต้องครบทั้ง 5 คู่ (เล่นได้ครั้งเดียว)"
      :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบหลังเรียนสัปดาห์ที่ 4 (Data Relationships & Foreign Keys)"
      quiz-subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจเรื่อง Cardinality และ Foreign Key ทำได้เพียงครั้งเดียว"
      :quiz-questions="quizQuestions"
      :games="weekGames"
    />

    <!-- ============================================================== -->
    <!-- HANDS-ON WORKSHOP & ASSIGNMENT SECTION                         -->
    <!-- ============================================================== -->
    <AssignmentSection
      assignment-id="assign-db-week4"
      :course-id="currentCourseId"
      :week-number="currentWeek"
      assignment-title="ใบงานที่ 4: การสร้างความสัมพันธ์ระหว่างตารางระบบมหาวิทยาลัย (Mini University Schema บน Supabase)"
      assignment-badge="คะแนนเต็ม 10 คะแนน"
      due-date-text="กำหนดส่ง: ท้ายคาบเรียนสัปดาห์ที่ 4"
      submit-btn-text="ส่งงานใบงานที่ 4"
    >
      <template #description>
        <p class="leading-relaxed">
          ในใบงานนี้นักศึกษาจะได้รับมอบหมายให้ออกแบบและสร้างฐานข้อมูลจำลองระบบมหาวิทยาลัย <strong>Mini University Schema</strong> 
          บน Supabase ซึ่งประกอบด้วย 4 ตารางที่มีความสัมพันธ์ทั้งแบบ <strong>One-to-Many (1:N)</strong> และ <strong>Many-to-Many (N:M ผ่าน Junction Table)</strong> 
          จากนั้นเปิดหน้าต่าง <strong>Schema Visualizer</strong> เพื่อตรวจสอบเส้นสายการเชื่อมโยง Foreign Key และทดสอบเพิ่มข้อมูลจริงลงในตาราง
        </p>
      </template>

      <template #tasks>
        <div class="space-y-6">
          <!-- Step 1: SQL Code for Schema -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs border border-slate-800">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-teal-400 font-bold flex items-center gap-2">
                <Terminal class="w-4 h-4" />
                สเต็ปที่ 1: รันคำสั่ง SQL สร้าง 4 ตารางพร้อม Foreign Key ใน SQL Editor
              </span>
              <button
                @click="copyText(sqlCreateSchema, 'create_schema')"
                class="px-2.5 py-1 rounded bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check v-if="copiedSnippet === 'create_schema'" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSnippet === 'create_schema' ? 'คัดลอกแล้ว' : 'คัดลอก SQL' }}</span>
              </button>
            </div>
            <pre class="overflow-x-auto text-slate-300 leading-relaxed max-h-64 select-text"><code>{{ sqlCreateSchema }}</code></pre>
          </div>

          <!-- Step 2: SQL Code for Mock Data -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs border border-slate-800">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-indigo-400 font-bold flex items-center gap-2">
                <Terminal class="w-4 h-4" />
                สเต็ปที่ 2: รันคำสั่งเพิ่มข้อมูลทดสอบ (Mock Data) เชื่อมโยงแต่ละตาราง
              </span>
              <button
                @click="copyText(sqlInsertData, 'insert_mock')"
                class="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check v-if="copiedSnippet === 'insert_mock'" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSnippet === 'insert_mock' ? 'คัดลอกแล้ว' : 'คัดลอก SQL' }}</span>
              </button>
            </div>
            <pre class="overflow-x-auto text-slate-300 leading-relaxed max-h-64 select-text"><code>{{ sqlInsertData }}</code></pre>
          </div>

          <!-- Step 3: Schema Visualizer Check -->
          <div class="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-3">
            <h4 class="font-bold flex items-center gap-2 text-sm sm:text-base">
              <Network class="w-5 h-5 text-teal-600" />
              สเต็ปที่ 3: ตรวจสอบแผนภาพความสัมพันธ์บน Schema Visualizer
            </h4>
            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
              ให้นักศึกษาเปิดหน้าต่าง <strong>Schema Visualizer</strong> บนแถบเมนู Database ของ Supabase จัดตำแหน่งตารางให้เห็นเส้นเชื่อมโยง Foreign Key ทั้งหมด 3 เส้นอย่างชัดเจน:
            </p>
            <ul class="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
              <li>เส้นที่ 1: จาก <code>departments.id</code> เชื่อมไปยัง <code>students.department_id</code> (1:N)</li>
              <li>เส้นที่ 2: จาก <code>students.id</code> เชื่อมไปยัง <code>enrollments.student_id</code> (1:N)</li>
              <li>เส้นที่ 3: จาก <code>courses.id</code> เชื่อมไปยัง <code>enrollments.course_id</code> (1:N)</li>
            </ul>
          </div>
        </div>
      </template>

      <template #submission-guide>
        <div class="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p class="font-bold text-gray-800">เกณฑ์การให้คะแนน (10 คะแนนเต็ม):</p>
          <ul class="space-y-1.5 list-disc pl-5">
            <li>สร้างตารางครบทั้ง 4 ตาราง พร้อมกำหนด Primary Key และ Foreign Key ถูกต้องตามข้อกำหนด (4 คะแนน)</li>
            <li>เพิ่มข้อมูลทดสอบ (Mock Data) ลงในตารางครบถ้วน และข้อมูลอ้างอิงรหัสถูกต้อง (3 คะแนน)</li>
            <li>แผนภาพใน Schema Visualizer แสดงเส้นความสัมพันธ์ครบทั้ง 3 เส้นอย่างสมบูรณ์ (3 คะแนน)</li>
          </ul>
        </div>
      </template>
    </AssignmentSection>

  </div>
</template>

