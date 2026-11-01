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
  Calendar, Hash, Download, FileCode, Briefcase, MessageSquare
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

// Course & Week Context
const currentCourseId = '31901-2007'
const currentWeek = 3

// Router & Modal States
const route = useRoute()
const router = useRouter()
const showTeacherModal = ref(false)
const showPdfModal = ref(false)
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
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกคำสั่งจัดการตาราง students ตามกลุ่ม CRUD)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำสั่งสืบค้นและเงื่อนไข Filtering)', maxScore: 6, isQuiz: false },
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

// Game 1 Data: Drag & Drop (จำแนกคำสั่งตาราง students ตามกลุ่ม CRUD)
const dragItemsData = [
  { id: 1, text: "INSERT INTO students (prefix, firstname, lastname, year) VALUES ('นาย', 'สมชาย', 'ใจดี', 1);", type: 'create' },
  { id: 2, text: "SELECT firstname, lastname, telephone FROM students WHERE year = 1;", type: 'read' },
  { id: 3, text: "UPDATE students SET telephone = '0812345678' WHERE id = 10;", type: 'update' },
  { id: 4, text: "DELETE FROM students WHERE year = 4;", type: 'delete' },
  { id: 5, text: "กดปุ่ม 'Insert Row' ใน Table Editor ของตาราง students", type: 'create' },
  { id: 6, text: "SELECT DISTINCT year FROM students ORDER BY year;", type: 'read' }
]

const dragZonesData = [
  {
    id: 'create',
    title: '1. Create (การเพิ่มข้อมูล)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากคำสั่งเกี่ยวกับการเพิ่มข้อมูลมาที่นี่'
  },
  {
    id: 'read',
    title: '2. Read (การอ่าน/สืบค้นข้อมูล)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากคำสั่งเกี่ยวกับการอ่าน/ค้นหาข้อมูลมาที่นี่'
  },
  {
    id: 'update',
    title: '3. Update (การแก้ไขข้อมูล)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคำสั่งเกี่ยวกับการแก้ไขข้อมูลมาที่นี่'
  },
  {
    id: 'delete',
    title: '4. Delete (การลบข้อมูล)',
    wrapperClass: 'border-rose-400/50 hover:bg-black/40',
    titleClass: 'text-rose-300 border-rose-400/30',
    itemBgClass: 'bg-rose-600/50 border-rose-400',
    emptyTextClass: 'text-rose-200/50',
    emptyText: 'ลากคำสั่งเกี่ยวกับการลบข้อมูลมาที่นี่'
  }
]

// Game 2 Data: Matching (จับคู่คำสั่งและหน้าที่การทำงานกับตาราง students)
const matchLeftTerms = [
  { id: 'l1', text: "WHERE year BETWEEN 1 AND 2", match: 'r1' },
  { id: 'l2', text: "WHERE firstname ILIKE '%สม%'", match: 'r2' },
  { id: 'l3', text: "WHERE prefix IN ('นาย', 'นางสาว')", match: 'r3' },
  { id: 'l4', text: "WHERE telephone IS NULL", match: 'r4' },
  { id: 'l5', text: "ORDER BY year DESC, firstname ASC", match: 'r5' },
  { id: 'l6', text: "LIMIT 10 OFFSET 20", match: 'r6' }
]

const matchRightDefs = [
  { id: 'r1', text: "กรองเฉพาะข้อมูลนักศึกษาที่อยู่ชั้นปีที่ 1 ถึง 2 (รวมขอบปี 1 และปี 2)" },
  { id: 'r2', text: "ค้นหาชื่อนักศึกษาที่มีคำว่า 'สม' ปนอยู่ โดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่" },
  { id: 'r3', text: "กรองแถวที่คำนำหน้าชื่อตรงกับสมาชิกในเซต ('นาย' หรือ 'นางสาว')" },
  { id: 'r4', text: "ตรวจสอบหานักศึกษาที่ยังไม่ได้กรอกเบอร์โทรศัพท์ (ช่องว่าง Null)" },
  { id: 'r5', text: "จัดเรียงลำดับผลลัพธ์จากชั้นปีสูงลงมา และเรียงชื่อตามตัวอักษร ก-ฮ" },
  { id: 'r6', text: "จำกัดแสดง 10 รายการ โดยข้าม 20 รายการแรกไป (สำหรับแบ่งหน้านักศึกษา หน้า 3)" }
]

// Game 3 Data: Post-test 10 ข้อ (ตัวลวงแนบเนียน ช้อยส์สมดุล ไม่โดดเด่นเกินไป)
const quizQuestions = [
  {
    id: 1,
    question: "ตัวย่อ 'CRUD' ในการจัดการฐานข้อมูล ประกอบด้วย 4 การกระทำพื้นฐานที่มีลำดับความหมายตรงกับข้อใด?",
    options: [
      { id: 'a', text: "Create (สร้าง), Remove (ลบ), Update (แก้ไข), Duplicate (ทำสำเนา)", isCorrect: false },
      { id: 'b', text: "Connect (เชื่อมต่อ), Read (อ่าน), Unlink (ยกเลิก), Delete (ลบ)", isCorrect: false },
      { id: 'c', text: "Create (เพิ่มข้อมูล), Read (อ่าน/สืบค้น), Update (แก้ไข), Delete (ลบ)", isCorrect: true },
      { id: 'd', text: "Control (ควบคุม), Retrieve (ดึงข้อมูล), Upload (ส่งข้อมูล), Drop (ทิ้งตาราง)", isCorrect: false }
    ],
    explanation: "CRUD เป็นคำย่อสากลของการดำเนินการกับข้อมูล 4 ประการ ได้แก่ Create (สร้าง/เพิ่มแถวใหม่), Read (อ่านหรือคิวรีข้อมูล), Update (แก้ไขข้อมูลเดิม), และ Delete (ลบข้อมูล)"
  },
  {
    id: 2,
    question: "คำสั่ง SQL ข้อใดต่อไปนี้ใช้เพิ่มข้อมูลนักศึกษาใหม่ 1 แถวเข้าสู่ตาราง students ได้ถูกต้องตามหลักไวยากรณ์?",
    options: [
      { id: 'a', text: "INSERT INTO students (prefix, firstname, lastname, year) VALUES ('นาย', 'สมชาย', 'ใจดี', 1);", isCorrect: true },
      { id: 'b', text: "INSERT INTO students (prefix, firstname, lastname, year) SET ('นาย', 'สมชาย', 'ใจดี', 1);", isCorrect: false },
      { id: 'c', text: "INSERT TO students VALUES (prefix='นาย', firstname='สมชาย', lastname='ใจดี', year=1);", isCorrect: false },
      { id: 'd', text: "INSERT INTO students (prefix, firstname, lastname, year) VALUES (\"นาย\", \"สมชาย\", \"ใจดี\", \"1\");", isCorrect: false }
    ],
    explanation: "ไวยากรณ์มาตรฐานของ SQL คือ INSERT INTO ตามด้วยชื่อตาราง ระบุชื่อคอลัมน์ในวงเล็บ แล้วตามด้วยคีย์เวิร์ด VALUES พร้อมส่งค่าข้อมูลที่เรียงลำดับตรงกัน โดยข้อความต้องครอบด้วย single quote ('...')"
  },
  {
    id: 3,
    question: "ในภาษา SQL หากต้องการสืบค้นเฉพาะนักศึกษาที่ 'ยังไม่มีเบอร์โทรศัพท์' (เป็นค่าว่างในฐานข้อมูล) ต้องเขียนเงื่อนไข WHERE อย่างไรจึงจะถูกต้อง?",
    options: [
      { id: 'a', text: "WHERE telephone = NULL;", isCorrect: false },
      { id: 'b', text: "WHERE telephone = '';", isCorrect: false },
      { id: 'c', text: "WHERE telephone == 'NULL';", isCorrect: false },
      { id: 'd', text: "WHERE telephone IS NULL;", isCorrect: true }
    ],
    explanation: "ในฐานข้อมูลเชิงสัมพันธ์ ค่า NULL คือความว่างเปล่าที่ไม่มีค่าอยู่จริง จึงไม่สามารถใช้ตัวดำเนินการ = หรือ == เปรียบเทียบได้ ต้องใช้คำสั่ง IS NULL (หรือ IS NOT NULL) เท่านั้น"
  },
  {
    id: 4,
    question: "เมื่อรันคำสั่ง 'SELECT DISTINCT year FROM students;' ผลลัพธ์ที่ได้จากการประมวลผลจะเป็นอย่างไร?",
    options: [
      { id: 'a', text: "แสดงรายชื่อนักศึกษาทั้งหมดโดยเรียงลำดับตามชั้นปีจากน้อยไปหามาก", isCorrect: false },
      { id: 'b', text: "แสดงเฉพาะค่าระดับชั้นปีที่ไม่ซ้ำกัน โดยตัดค่าชั้นปีที่ซ้ำซ้อนออกทั้งหมด", isCorrect: true },
      { id: 'c', text: "กรองเฉพาะแถวนักศึกษาที่ข้อมูลในคอลัมน์ year ไม่เป็นค่าว่าง (Not Null)", isCorrect: false },
      { id: 'd', text: "คำนวณนับจำนวนนักศึกษาทั้งหมดที่สังกัดอยู่ในแต่ละระดับชั้นปี", isCorrect: false }
    ],
    explanation: "คีย์เวิร์ด DISTINCT ทำหน้าที่คัดกรองแถวผลลัพธ์ที่มีค่าซ้ำกันในคอลัมน์ที่เลือกออกไป เพื่อแสดงเฉพาะค่าที่เป็นเอกลักษณ์ (Unique values) เพียงค่าละ 1 บรรทัด"
  },
  {
    id: 5,
    question: "ในระบบฐานข้อมูล PostgreSQL บน Supabase คำสั่ง ILIKE มีพฤติกรรมการค้นหาที่แตกต่างจากคำสั่ง LIKE ปกติอย่างไร?",
    options: [
      { id: 'a', text: "ILIKE ใช้ค้นหาข้อมูลเฉพาะชนิดตัวเลข ส่วน LIKE ใช้ค้นหาข้อมูลชนิดข้อความ", isCorrect: false },
      { id: 'b', text: "ILIKE บังคับค้นหาคำที่ตรงกันเป๊ะ 100% ส่วน LIKE อนุญาตให้มีคำสะกดผิดได้", isCorrect: false },
      { id: 'c', text: "ILIKE ไม่คำนึงถึงความต่างของตัวพิมพ์เล็ก/ใหญ่ (Case-insensitive) ส่วน LIKE แยกตัวพิมพ์เล็ก/ใหญ่", isCorrect: true },
      { id: 'd', text: "ILIKE ค้นหาข้อมูลได้เร็วกว่าเนื่องจากระบบจะสร้าง Index ให้โดยอัตโนมัติขณะรัน", isCorrect: false }
    ],
    explanation: "ใน PostgreSQL คำสั่ง LIKE จะเป็น Case-sensitive (เช่น 'Somchai' จะไม่เจอ 'somchai') แต่คำสั่ง ILIKE (Insensitive LIKE) จะมองข้ามความต่างของตัวพิมพ์เล็กและใหญ่ ทำให้สะดวกในการค้นหาข้อความ"
  },
  {
    id: 6,
    question: "คำสั่ง 'SELECT * FROM students WHERE firstname ILIKE \'%สม%\';' จะดึงข้อมูลนักศึกษาคนใดออกมาบ้าง?",
    options: [
      { id: 'a', text: "ดึงเฉพาะนักศึกษาที่มีชื่อว่า 'สม' พอดีเป๊ะเพียง 2 ตัวอักษรเท่านั้น", isCorrect: false },
      { id: 'b', text: "ดึงเฉพาะนักศึกษาที่มีชื่อลงท้ายด้วยคำว่า 'สม' เท่านั้น เช่น 'พรสม'", isCorrect: false },
      { id: 'c', text: "ดึงเฉพาะนักศึกษาที่มีชื่อขึ้นต้นด้วยคำว่า 'สม' เท่านั้น เช่น 'สมชาย', 'สมศักดิ์'", isCorrect: false },
      { id: 'd', text: "ดึงนักศึกษาทุกคนที่มีคำว่า 'สม' ปรากฏอยู่ตรงส่วนใดก็ได้ของชื่อจริง", isCorrect: true }
    ],
    explanation: "เครื่องหมาย Wildcard '%' มีความหมายว่ามีตัวอักษรใดๆ จำนวนเท่าใดก็ได้ การใส่ '%สม%' ประกบทั้งหน้าและหลังจึงหมายถึงชื่อที่มีคำว่า 'สม' อยู่ตำแหน่งใดก็ได้ (ต้นชื่อ กลางชื่อ หรือท้ายชื่อ)"
  },
  {
    id: 7,
    question: "คำสั่ง 'WHERE year BETWEEN 1 AND 2;' มีขอบเขตการดึงข้อมูลเทียบเท่ากับการเขียนเงื่อนไขในข้อใดอย่างถูกต้อง?",
    options: [
      { id: 'a', text: "WHERE year >= 1 AND year <= 2;", isCorrect: true },
      { id: 'b', text: "WHERE year > 1 AND year < 2;", isCorrect: false },
      { id: 'c', text: "WHERE year = 1 OR year = 3;", isCorrect: false },
      { id: 'd', text: "WHERE year >= 1 AND year < 2;", isCorrect: false }
    ],
    explanation: "ตัวดำเนินการ BETWEEN ในภาษา SQL มีคุณสมบัติเป็น Inclusive คือนับรวมค่าขอบเขตทั้งสองด้าน (รวมทั้งค่า 1 และ 2 เข้าไปด้วย)"
  },
  {
    id: 8,
    question: "หากต้องการดึงรายชื่อนักศึกษาโดย 'เรียงจากชั้นปีมากไปน้อย (ปี 2 ก่อนปี 1) และจำกัดแสดงผลเพียง 5 คนแรก' ต้องเขียนคำสั่งต่อท้าย SQL อย่างไร?",
    options: [
      { id: 'a', text: "SORT BY year ASC LIMIT 5;", isCorrect: false },
      { id: 'b', text: "ORDER BY year ASC LIMIT 5;", isCorrect: false },
      { id: 'c', text: "ORDER BY year DESC LIMIT 5;", isCorrect: true },
      { id: 'd', text: "ORDER BY year DESC TOP 5;", isCorrect: false }
    ],
    explanation: "การเรียงจากมากไปน้อยต้องใช้ ORDER BY ตามด้วยคอลัมน์และคำว่า DESC (Descending) และการจำกัดจำนวนแถวใน PostgreSQL ใช้คำสั่ง LIMIT ไม่ใช่คำว่า TOP (TOP เป็นคำสั่งของ MS SQL Server)"
  },
  {
    id: 9,
    question: "ทำไมการรันคำสั่ง 'UPDATE students SET year = 2;' โดยไม่มีเงื่อนไข WHERE จึงจัดเป็นข้อผิดพลาดร้ายแรง?",
    options: [
      { id: 'a', text: "เพราะจะทำให้คำสั่งติด Syntax Error และถูกระบบ Supabase ระงับบัญชีถาวร", isCorrect: false },
      { id: 'b', text: "เพราะระบบจะเปลี่ยนค่าชั้นปีของนักศึกษา 'ทุกแถวในตาราง' ให้กลายเป็นปี 2 ทั้งหมด", isCorrect: true },
      { id: 'c', text: "เพราะระบบจะไม่อนุญาตให้อัปเดตและจะทำการ Rollback ลบตารางทิ้งทันที", isCorrect: false },
      { id: 'd', text: "เพราะคำสั่งจะสุ่มเลือกอัปเดตเฉพาะแถวแรกสุดของตารางเพียงแถวเดียว", isCorrect: false }
    ],
    explanation: "คำสั่ง UPDATE หรือ DELETE ใน SQL หากไม่ระบุเงื่อนไข WHERE คำสั่งจะมีผลต่อทุกระเบียนข้อมูล (All Records) ในตารางทันทีโดยไม่มีการแจ้งเตือนถามซ้ำ"
  },
  {
    id: 10,
    question: "ก่อนที่จะตัดสินใจรันคำสั่ง 'DELETE FROM students WHERE year = 4;' แนวปฏิบัติที่ปลอดภัยที่สุด (Safe Practice) คือข้อใด?",
    options: [
      { id: 'a', text: "เขียนคำสั่ง DROP TABLE students; เพื่อล้างตารางแล้วสร้างโครงสร้างใหม่", isCorrect: false },
      { id: 'b', text: "เปลี่ยนเงื่อนไขเป็น WHERE year != 4; เพื่อทดสอบลบกลุ่มอื่นดูก่อน", isCorrect: false },
      { id: 'c', text: "สั่งคำสั่ง UPDATE students SET year = 0; เพื่อทำเครื่องหมายว่าพร้อมลบ", isCorrect: false },
      { id: 'd', text: "เขียนคำสั่ง SELECT * FROM students WHERE year = 4; มารันตรวจสอบแถวเป้าหมายก่อน", isCorrect: true }
    ],
    explanation: "การรันคำสั่ง SELECT ด้วยเงื่อนไข WHERE เดียวกันก่อน จะช่วยให้ผู้ใช้งานมองเห็นเรคคอร์ดข้อมูลที่จะได้รับผลกระทบด้วยตาตนเองก่อนทำการลบจริง ป้องกันการลบข้อมูลผิดพลาดได้อย่างปลอดภัย 100%"
  }
]

// Focused Code Snippets for `students` Table
// Columns: prefix (text), firstname (text), lastname (text), year (int2), telephone (text)
const sqlSnippets = {
  // Topic 1: Introduction
  firstQuery: `SELECT * FROM students;`,

  // Topic 2: Create (INSERT)
  insertSingle: `INSERT INTO students (prefix, firstname, lastname, year, telephone)
VALUES ('นาย', 'สมชาย', 'ใจดี', 1, '0812345678');`,

  insertMulti: `INSERT INTO students (prefix, firstname, lastname, year, telephone)
VALUES 
  ('นางสาว', 'กานดา', 'มีสุข', 1, '0891112233'),
  ('นาย', 'ธีรพัฒน์', 'รักเรียน', 2, '0823334455'),
  ('นางสาว', 'นภัสสร', 'สุขเกษม', 1, NULL);`,

  insertReturning: `INSERT INTO students (prefix, firstname, lastname, year, telephone)
VALUES ('นาย', 'อัครเดช', 'ยอดเยี่ยม', 2, '0958889900')
RETURNING id, prefix, firstname, lastname, year;`,

  // Topic 3: Read (SELECT)
  selectAll: `SELECT * FROM students;`,

  selectColumns: `SELECT prefix, firstname, lastname, year, telephone 
FROM students;`,

  selectAlias: `SELECT 
  prefix AS "คำนำหน้า",
  firstname AS "ชื่อจริง",
  lastname AS "นามสกุล",
  year AS "ชั้นปี",
  telephone AS "เบอร์โทรศัพท์"
FROM students;`,

  selectDistinct: `SELECT DISTINCT year 
FROM students;`,

  // Topic 4: Filtering & Sorting (WHERE, ORDER BY)
  filterComparison: `SELECT prefix, firstname, lastname, year, telephone
FROM students
WHERE year = 1 AND telephone IS NOT NULL;`,

  filterBetween: `SELECT prefix, firstname, lastname, year
FROM students
WHERE year BETWEEN 1 AND 2;`,

  filterIn: `SELECT prefix, firstname, lastname, year
FROM students
WHERE prefix IN ('นาย', 'นางสาว');`,

  filterIlike: `SELECT prefix, firstname, lastname, telephone
FROM students
WHERE firstname ILIKE '%สม%';`,

  filterNull: `SELECT prefix, firstname, lastname, year
FROM students
WHERE telephone IS NULL;`,

  sortLimit: `SELECT prefix, firstname, lastname, year
FROM students
ORDER BY year ASC, firstname ASC
LIMIT 5;`,

  // Topic 5: Safe Update & Delete
  safeSelectCheck: `SELECT id, prefix, firstname, lastname, telephone
FROM students
WHERE id = 3;`,

  safeUpdate: `UPDATE students
SET 
  telephone = '0899998877',
  year = 2
WHERE id = 3;`,

  safeDelete: `DELETE FROM students
WHERE id = 5 AND year = 1;`
}

// Assignment 3: Setup Script for Table `products`
const showSetupSql = ref(false)
const sqlSetupProductTable = `-- 1. คำสั่งสร้างตาราง Product (หรือ products)
CREATE TABLE IF NOT EXISTS products (
  id bigint PRIMARY KEY,
  product_name text NOT NULL,
  category text NOT NULL,
  price numeric(10, 2) NOT NULL,
  stock int4 NOT NULL DEFAULT 0,
  description text
);

-- 2. นำเข้าข้อมูลสินค้าตัวอย่าง 20 รายการ
INSERT INTO products (id, product_name, category, price, stock, description)
VALUES
  (1, 'เมาส์ไร้สาย Ergonomic Wireless', 'IT', 690.00, 45, 'เมาส์สุขภาพลดอาการปวดข้อมือ เชื่อมต่อไร้สาย 2.4GHz'),
  (2, 'คีย์บอร์ดเกมมิ่ง RGB Mechanical', 'Gaming', 1490.00, 25, 'คีย์บอร์ดสวิตช์สีน้ำเงิน แสงไฟ RGB ปรับได้ 14 โหมด'),
  (3, 'หูฟังไร้สาย Bluetooth Headset', 'Audio', 890.00, 15, 'หูฟังบลูทูธ 5.3 ตัดเสียงรบกวน แบตเตอรี่ใช้งานได้ 30 ชม.'),
  (4, 'แผ่นรองเมาส์ Speed Edition XL', 'Gaming', 199.00, 100, 'แผ่นรองเมาส์ผิวเรียบพิเศษ ขนาด 80x30 ซม. เย็บขอบอย่างดี'),
  (5, 'ไมโครโฟนตั้งโต๊ะ USB Condenser', 'Audio', 1290.00, 8, 'ไมค์บันทึกเสียงคุณภาพสูง เหมาะสำหรับสตรีมมิ่งและพอดแคสต์'),
  (6, 'แท่นวางโน้ตบุ๊กอลูมิเนียมพับได้', 'Office', 350.00, 30, 'ขาตั้งโน้ตบุ๊กระบายความร้อน ปรับความสูงได้ 6 ระดับ'),
  (7, 'จอคอมพิวเตอร์ 24 นิ้ว 100Hz IPS', 'IT', 3190.00, 12, 'จอมอนิเตอร์ขอบบางพิเศษ ความละเอียด Full HD 1080p'),
  (8, 'ฮับต่อพ่วง USB-C 7-in-1 Multifunction', 'Gadget', 590.00, 20, NULL),
  (9, 'สายชาร์จ Type-C to Lightning Fast Charge', 'Gadget', 150.00, 60, 'สายถักไนลอนทนทาน รองรับชาร์จไว 20W PD'),
  (10, 'กล้องเว็บแคม Full HD 1080p with Mic', 'IT', 790.00, 0, 'กล้องสำหรับประชุมออนไลน์ ไมค์ตัดเสียงรบกวนในตัว'),
  (11, 'เก้าอี้เพื่อสุขภาพ Ergonomic Mesh Chair', 'Office', 4290.00, 5, 'เก้าอี้ปรับระดับได้ตามสรีระ ผ้าตาข่ายระบายอากาศ'),
  (12, 'พัดลมตั้งโต๊ะพกพา Mini USB Fan', 'Gadget', 129.00, 40, NULL),
  (13, 'หูฟังอินเอียร์ In-Ear Studio Monitor', 'Audio', 490.00, 35, 'หูฟังสเตอริโอเบสแน่น สายถอดเปลี่ยนได้'),
  (14, 'คีย์บอร์ดพกพา Wireless Mini Keyboard', 'Office', 450.00, 18, 'คีย์บอร์ดไร้สายขนาดกะทัดรัด น้ำหนักเบา พกพาสะดวก'),
  (15, 'เราเตอร์ไร้สาย Wi-Fi 6 Dual-Band Router', 'IT', 1690.00, 10, 'เราเตอร์กิกะบิตกระจายสัญญาณเสถียร ครอบคลุมพื้นที่กว้าง'),
  (16, 'ไฟเส้น LED RGB Smart Strip Light 5m', 'Gaming', 390.00, 50, NULL),
  (17, 'จอยเกมไร้สาย Wireless Pro Controller', 'Gaming', 990.00, 0, 'จอยเกมมิ่งระบบสั่นคู่ รองรับ PC และ Android'),
  (18, 'ปากกาสไตลัส Stylus Pen for Tablet', 'Gadget', 550.00, 22, 'ปากกาเขียนหน้าจอสัมผัส วาดภาพลื่นไหลไม่ดีเลย์'),
  (19, 'ลำโพงบลูทูธพกพา Waterproof Speaker', 'Audio', 850.00, 14, 'ลำโพงกันน้ำมาตรฐาน IPX7 เสียงรอบทิศทาง 360 องศา'),
  (20, 'แท่นชาร์จไร้สาย 3-in-1 Wireless Charger', 'Gadget', 790.00, 16, 'แท่นชาร์จเร็วไร้สาย สำหรับสมาร์ตโฟน นาฬิกา และหูฟัง');`
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header Banner (ธีมสีเขียวมรกต สไตล์ระบบจัดการฐานข้อมูล Supabase) -->
    <div
      class="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-8 md:p-12 border border-emerald-800 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[260px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-emerald-400">
        <Database class="w-[440px] h-[440px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-5/6 lg:w-3/4 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs uppercase tracking-wider border border-emerald-400/30 shadow-sm backdrop-blur-sm">
            สัปดาห์ที่ 3
          </span>
          <span class="px-3 py-1 bg-white/10 text-slate-200 text-xs rounded-full font-medium border border-white/10">
            Cloud DBMS & PostgreSQL Data Manipulation
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
          การจัดการและสืบค้นข้อมูลใน Supabase<br />
          <span class="text-2xl sm:text-3xl md:text-4xl text-emerald-400 font-bold font-mono">
            (Introduction to SQL & CRUD Operations: ตาราง students)
          </span>
        </h1>
        <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          ปูพื้นฐานการเขียนภาษา SQL จากศูนย์ ทำความเข้าใจโครงสร้างคำสั่งและการสั่งงานผ่าน Supabase SQL Editor
          กับตารางข้อมูลนักศึกษา <strong>students</strong> ฝึกปฏิบัติการเพิ่ม (Create), อ่านสืบค้น (Read), แก้ไข
          (Update) และลบข้อมูล (Delete) พร้อมเทคนิคการกรองด้วย WHERE และการจัดเรียงลำดับ ORDER BY
          อย่างเป็นระบบและปลอดภัย
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :course-id="currentCourseId" :week-number="currentWeek" />

    <!-- Chapter Objectives & Competencies Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">จุดประสงค์และสมรรถนะประจำสัปดาห์ที่ 3</h2>
          <p class="text-sm text-gray-500 mt-0.5">หน่วยการเรียนรู้: การปูพื้นฐานภาษา SQL และการจัดการข้อมูล CRUD
            ตารางนักศึกษา (ทฤษฎี 2 ชม. ปฏิบัติ 4 ชม.)</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
        <!-- 3 Boxes: Learning Outcome, Competency, Objectives -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. ผลลัพธ์การเรียนรู้ -->
          <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                <Lightbulb class="w-5 h-5 shrink-0" />
                <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ผู้เรียนเข้าใจหลักการและไวยากรณ์พื้นฐานของภาษา SQL สามารถใช้เครื่องมือ SQL Editor บน Supabase
                ในการจัดการข้อมูลตารางนักศึกษา (students) ครบทั้ง 4 ด้าน (CRUD)
                และสามารถเขียนคำสั่งสืบค้นพร้อมกำหนดเงื่อนไขการกรองข้อมูลได้อย่างถูกต้อง
              </p>
            </div>
          </div>

          <!-- 2. สมรรถนะประจำหน่วย -->
          <div class="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-teal-800 font-bold">
                <Award class="w-5 h-5 shrink-0" />
                <span>2. สมรรถนะประจำหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                แสดงทักษะการเขียนคำสั่ง SQL ในกลุ่ม DML (Data Manipulation Language) เพื่อเพิ่ม อ่าน แก้ไข
                และลบข้อมูลนักศึกษา โดยคำนึงถึงความถูกต้องของรูปแบบคำสั่ง ชนิดข้อมูล เงื่อนไข และความปลอดภัยของฐานข้อมูล
              </p>
            </div>
          </div>

          <!-- 3. จุดประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-cyan-800 font-bold">
                <CheckCircle2 class="w-5 h-5 shrink-0" />
                <span>3. จุดประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4">
                <li>อธิบายความหมาย บทบาท และไวยากรณ์พื้นฐานของภาษา SQL ได้</li>
                <li>ใช้เครื่องมือ SQL Editor ใน Supabase เพื่อพิมพ์และรันคำสั่งได้อย่างถูกต้อง</li>
                <li>เขียนคำสั่ง INSERT ข้อมูลนักศึกษา และ SELECT พร้อมใช้งาน Column Alias และ DISTINCT ได้</li>
                <li>เขียนเงื่อนไข WHERE ร่วมกับ AND, OR, BETWEEN, IN และ ILIKE เพื่อค้นหาข้อมูลนักศึกษาได้</li>
                <li>ดำเนินการ UPDATE และ DELETE ตาราง students พร้อมใส่เงื่อนไขความปลอดภัยเพื่อป้องกันข้อมูลสูญหาย</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 5 Sub-topics Badge List -->
        <div class="pt-4 border-t border-gray-100">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            โครงสร้างสาระการเรียนรู้สัปดาห์ที่ 3 (5 หัวข้อหลัก):
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span class="font-medium text-gray-800">ปูพื้นฐานภาษา SQL สำหรับมือใหม่</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span class="font-medium text-gray-800">การเพิ่มข้อมูลนักศึกษา (Create: INSERT)</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span class="font-medium text-gray-800">การอ่านสืบค้น (Read: SELECT)</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span class="font-medium text-gray-800">การกรองและจัดเรียง (WHERE & ORDER BY)</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">5</span>
              <span class="font-medium text-gray-800">การแก้ไขและลบอย่างปลอดภัย (UPDATE & DELETE)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Table Schema Blueprint Card: students -->
    <section>
      <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6 md:p-8 space-y-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Table class="w-6 h-6" />
            </div>
            <div>
              <span
                class="text-xs font-bold text-emerald-800 uppercase tracking-wider">โครงสร้างตารางจริงที่ใช้ในบทเรียนนี้</span>
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 font-mono">ตาราง students (ข้อมูลนักศึกษา)</h3>
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
            Supabase Table Schema
          </span>
        </div>

        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          ในบทเรียนสัปดาห์นี้ เราจะใช้ตาราง <strong>students</strong> ซึ่งประกอบด้วย 5 คอลัมน์หลักตามที่สร้างไว้บน
          Supabase ดังนี้:
        </p>

        <!-- Column Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <!-- Col 1: prefix -->
          <div class="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-sm text-emerald-950">prefix</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">text</span>
            </div>
            <p class="text-xs text-gray-500">คำนำหน้าชื่อ</p>
            <p class="text-[11px] text-gray-700 font-mono">เช่น 'นาย', 'นางสาว'</p>
          </div>

          <!-- Col 2: firstname -->
          <div class="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-sm text-emerald-950">firstname</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">text</span>
            </div>
            <p class="text-xs text-gray-500">ชื่อจริงของนักศึกษา</p>
            <p class="text-[11px] text-gray-700 font-mono">เช่น 'สมชาย', 'กานดา'</p>
          </div>

          <!-- Col 3: lastname -->
          <div class="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-sm text-emerald-950">lastname</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">text</span>
            </div>
            <p class="text-xs text-gray-500">นามสกุล</p>
            <p class="text-[11px] text-gray-700 font-mono">เช่น 'ใจดี', 'มีสุข'</p>
          </div>

          <!-- Col 4: year -->
          <div class="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-sm text-emerald-950">year</span>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">int2</span>
            </div>
            <p class="text-xs text-gray-500">ระดับชั้นปี (ตัวเลข)</p>
            <p class="text-[11px] text-gray-700 font-mono">เช่น 1, 2 (ปวส.1, ปวส.2)</p>
          </div>

          <!-- Col 5: telephone -->
          <div class="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-sm text-emerald-950">telephone</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">text</span>
            </div>
            <p class="text-xs text-gray-500">หมายเลขเบอร์โทรศัพท์</p>
            <p class="text-[11px] text-gray-700 font-mono">เช่น '0812345678' (หรือ NULL)</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lecture Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content)</h2>
      </div>

      <div
        class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-emerald-100 space-y-16 text-gray-700 leading-relaxed">

        <!-- ========================================== -->
        <!-- TOPIC 1: INTRODUCTION TO SQL FOR BEGINNERS -->
        <!-- ========================================== -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span
              class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              หน่วยเริ่มต้น: ปูพื้นฐานภาษา SQL
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-emerald-950 border-l-4 border-emerald-600 pl-4 mb-4">
            หัวข้อที่ 1: ภาษา SQL คืออะไร? และทำไมเราถึงต้องเขียนโค้ด?
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            ในสัปดาห์ที่ 2 พวกเราได้ทดลองสร้างตาราง <strong>students</strong> และกำหนดฟิลด์ผ่านหน้าเว็บคลิกด้วยเมาส์
            (UI) บน Supabase ไปแล้ว แต่ในการทำงานจริงของนักพัฒนาซอฟต์แวร์ เราต้องใช้ <strong>ภาษา SQL</strong>
            ในการสั่งการฐานข้อมูล มาทำความเข้าใจกันทีละก้าว:
          </p>

          <!-- 1.1 What is SQL Card -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div class="flex items-center gap-2 text-emerald-900 font-bold text-lg">
                <Terminal class="w-5 h-5 text-emerald-600" />
                <span>1. SQL คืออะไร?</span>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                <strong>SQL</strong> ย่อมาจาก <em>Structured Query Language</em> เป็นภาษามาตรฐานสากลที่ออกแบบมาเพื่อ
                "สนทนาและสั่งงาน" ระบบฐานข้อมูลเชิงสัมพันธ์ (RDBMS) เช่น PostgreSQL ที่อยู่เบื้องหลัง Supabase
              </p>
              <div class="p-3 rounded-xl bg-white border border-emerald-100 text-xs text-gray-600 space-y-1">
                <span class="font-bold text-emerald-800 block">การเปรียบเทียบให้เห็นภาพ:</span>
                ถ้า Supabase คือ "ห้องทะเบียนที่เก็บประวัตินักศึกษาทั้งหมด" คำสั่ง SQL ก็คือ
                <strong>"ใบคำร้องหรือคำสั่งของอาจารย์ฝ่ายทะเบียน"</strong> ที่ส่งไปบอกเจ้าหน้าที่ว่า
                ให้เพิ่มประวัตินักศึกษาใหม่, ค้นหาเด็กปี 1, อัปเดตเบอร์โทรศัพท์ หรือลบข้อมูลที่ซ้ำซ้อน
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div class="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <HelpCircle class="w-5 h-5 text-teal-600" />
                <span>2. ทำไมต้องเขียน SQL ทั้งที่มีปุ่มบนหน้าเว็บให้กด?</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>แอปพลิเคชันไม่มีคนไปนั่งคลิกให้:</strong> เมื่อเราพัฒนาเว็บรับสมัครนักศึกษา
                  หรือระบบเช็กชื่อเข้าเรียน ตัวแอปจะส่ง "คำสั่ง SQL" ไปยังฐานข้อมูลเพื่อบันทึกประวัติโดยอัตโนมัติ
                </li>
                <li>
                  <strong>จัดการข้อมูลจำนวนมากในพริบตา:</strong> หากต้องเลื่อนชั้นปีนักศึกษาจากปี 1 ขึ้นเป็นปี 2 จำนวน
                  500 คนพร้อมกัน ถ้าคลิกแก้ทีละคนคงใช้เวลาทั้งวัน แต่คำสั่ง SQL รันเสร็จในเวลาไม่ถึง 0.05 วินาที
                </li>
                <li>
                  <strong>การค้นหาแบบมีเงื่อนไขซับซ้อน:</strong> เช่น "ดึงรายชื่อนักศึกษาชายชั้นปี 1
                  ที่ยังไม่ได้กรอกเบอร์โทรศัพท์" ซึ่งการพิมพ์ SQL จะทำได้รวดเร็วและแม่นยำกว่าการนั่งไล่ดูด้วยสายตา
                </li>
              </ul>
            </div>
          </div>

          <!-- 1.2 Where to type SQL in Supabase -->
          <div
            class="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white mb-8 space-y-5 shadow-lg">
            <div class="flex items-center gap-3 border-b border-emerald-500/30 pb-3">
              <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Laptop class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-bold text-lg text-white">เราพิมพ์คำสั่ง SQL ตรงไหนใน Supabase?</h4>
                <p class="text-xs text-emerald-300">ขั้นตอนการเปิดและใช้งาน SQL Editor บน Supabase Dashboard</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div class="flex items-center gap-2 font-bold text-emerald-400">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
                  <span>เปิด SQL Editor</span>
                </div>
                <p class="text-slate-300">
                  ที่แถบเมนูด้านซ้ายมือของ Supabase ให้คลิกที่ไอคอน <strong>SQL Editor</strong> (ไอคอนรูปสัญลักษณ์ <code
                    class="font-mono text-emerald-300 font-bold">>_</code> หรือรูปเทอร์มินัล)
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div class="flex items-center gap-2 font-bold text-emerald-400">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                  <span>สร้าง New Query</span>
                </div>
                <p class="text-slate-300">
                  คลิกปุ่ม <strong>"+ New query"</strong> ด้านบน เพื่อเปิดหน้าต่างพิมพ์โค้ดว่างๆ สำหรับเขียนคำสั่งใหม่
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div class="flex items-center gap-2 font-bold text-emerald-400">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
                  <span>กดปุ่ม Run สั่งประมวลผล</span>
                </div>
                <p class="text-slate-300">
                  พิมพ์คำสั่ง SQL แล้วกดปุ่มสีเขียว <strong>"Run"</strong> หรือใช้คีย์ลัด <kbd
                    class="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/20">Ctrl +
                    Enter</kbd> (Mac: <kbd
                    class="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/20">Cmd +
                    Enter</kbd>) แล้วดูตารางผลลัพธ์ที่ด้านล่าง
                </p>
              </div>
            </div>
          </div>

          <!-- 1.3 4 Basic Rules of SQL Syntax -->
          <div class="mb-8 space-y-4">
            <h4 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-amber-500" />
              <span>กฎเหล็ก 4 ข้อของไวยากรณ์ SQL ที่มือใหม่ทุกคนต้องจำ</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <!-- Rule 1: Keywords Uppercase -->
              <div class="p-4 rounded-xl bg-white border-2 border-emerald-100 shadow-sm space-y-2">
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">กฎข้อที่
                  1</span>
                <h5 class="font-bold text-gray-900 text-sm">คำสั่งพิมพ์ตัวพิมพ์ใหญ่</h5>
                <p class="text-gray-600 leading-relaxed">
                  คำสั่งมาตรฐานของ SQL (Keywords) นิยมเขียนด้วย <strong>ตัวพิมพ์ใหญ่</strong> เช่น <code
                    class="font-mono text-emerald-700 font-bold">SELECT</code>, <code
                    class="font-mono text-emerald-700 font-bold">FROM</code>, <code
                    class="font-mono text-emerald-700 font-bold">WHERE</code> เพื่อให้อ่านแยกแยะจากชื่อตาราง <code
                    class="font-mono text-slate-800">students</code> หรือชื่อคอลัมน์ได้อย่างชัดเจน
                </p>
              </div>

              <!-- Rule 2: Semicolon -->
              <div class="p-4 rounded-xl bg-white border-2 border-emerald-100 shadow-sm space-y-2">
                <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">กฎข้อที่ 2</span>
                <h5 class="font-bold text-gray-900 text-sm">ปิดท้ายด้วย Semicolon ( ; )</h5>
                <p class="text-gray-600 leading-relaxed">
                  เมื่อเขียนคำสั่งเสร็จสิ้นหนึ่งประโยค จะต้องปิดท้ายด้วยเครื่องหมาย <strong>; (เซมิโคลอน)</strong> เสมอ
                  เพื่อเป็นสัญญาณบอกให้ฐานข้อมูลทราบว่าคำสั่งนี้จบลงแล้ว
                </p>
              </div>

              <!-- Rule 3: Single Quote for Text -->
              <div class="p-4 rounded-xl bg-white border-2 border-emerald-100 shadow-sm space-y-2">
                <span class="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px]">กฎข้อที่ 3</span>
                <h5 class="font-bold text-gray-900 text-sm">ข้อความใส่ 'Single Quote'</h5>
                <p class="text-gray-600 leading-relaxed">
                  ข้อมูลที่เป็นข้อความ (Text) เช่น <code class="font-mono text-cyan-800 font-bold">'นาย'</code>, <code
                    class="font-mono text-cyan-800 font-bold">'สมชาย'</code>, <code
                    class="font-mono text-cyan-800 font-bold">'0812345678'</code> ต้องครอบด้วยเครื่องหมายขีดเดี่ยวเสมอ
                  (ห้ามใช้ Double Quote <code class="font-mono">"..."</code> กับค่าข้อมูล)
                </p>
              </div>

              <!-- Rule 4: Numbers without Quotes -->
              <div class="p-4 rounded-xl bg-white border-2 border-emerald-100 shadow-sm space-y-2">
                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">กฎข้อที่
                  4</span>
                <h5 class="font-bold text-gray-900 text-sm">ตัวเลขห้ามใส่เครื่องหมาย</h5>
                <p class="text-gray-600 leading-relaxed">
                  ข้อมูลที่เป็นตัวเลข เช่น ระดับชั้นปี <code class="font-mono text-amber-800 font-bold">1</code> หรือ
                  <code class="font-mono text-amber-800 font-bold">2</code> ให้พิมพ์ตัวเลขลงไปได้ทันที
                  <strong>ห้ามใส่เครื่องหมายคำพูดครอบ</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- 1.4 Your First SQL Command Card -->
          <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div
              class="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800 text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="text-xs font-mono text-slate-300 ml-2 font-bold">คำสั่ง SQL แรกในชีวิต:
                  ลองดึงข้อมูลทั้งหมดจากตาราง students</span>
              </div>
              <button @click="copyText(sqlSnippets.firstQuery, 'intro')"
                class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                <Check v-if="copiedSnippet === 'intro'" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSnippet === 'intro' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
              </button>
            </div>

            <div class="bg-slate-950 p-5 font-mono text-sm text-emerald-300 overflow-x-auto leading-relaxed">
              <pre>{{ sqlSnippets.firstQuery }}</pre>
            </div>

            <!-- Breakdown of the First Query -->
            <div class="p-5 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-3">
              <div class="font-bold text-gray-900 flex items-center gap-2">
                <Code class="w-4 h-4 text-emerald-600" />
                <span>ชำแหละคำสั่ง: ประโยคนี้แปลว่าอะไรในภาษาคน?</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                  <span
                    class="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">SELECT</span>
                  <p class="text-gray-600 text-[11px]">แปลว่า <strong>"ขอเลือกดู..."</strong>
                    เป็นคำสั่งบอกว่าเราต้องการอ่านข้อมูล</p>
                </div>
                <div class="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                  <span class="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">*
                    (ดอกจัน)</span>
                  <p class="text-gray-600 text-[11px]">สัญลักษณ์แทนคำว่า <strong>"ทุกคอลัมน์"</strong> (ดึง prefix,
                    firstname, lastname, year, telephone มาทั้งหมด)</p>
                </div>
                <div class="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                  <span class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">FROM
                    students;</span>
                  <p class="text-gray-600 text-[11px]">แปลว่า <strong>"จากตารางที่ชื่อ students"</strong>
                    และปิดท้ายด้วยเครื่องหมาย <code class="font-bold">;</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TOPIC 2: CREATE - INSERT INTO             -->
        <!-- ========================================== -->
        <div class="pt-8 border-t border-gray-200">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              CRUD ตัวที่ 1: CREATE (การเพิ่มข้อมูล)
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-emerald-950 border-l-4 border-emerald-600 pl-4 mb-4">
            หัวข้อที่ 2: การเพิ่มข้อมูลนักศึกษาใหม่เข้าสู่ตาราง (INSERT INTO students)
          </h3>
          <p class="text-base text-gray-700 leading-relaxed mb-6">
            เมื่อเราสร้างตาราง <strong>students</strong> เรียบร้อยแล้ว
            ขั้นตอนต่อมาคือการเพิ่มประวัตินักศึกษาใหม่เข้าสู่ระบบ มาดูโครงสร้างคำสั่งและการใช้งานในรูปแบบต่างๆ กัน:
          </p>

          <!-- Syntax Anatomy Blueprint -->
          <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 space-y-3">
            <h4 class="font-bold text-emerald-900 text-sm flex items-center gap-2">
              <Compass class="w-4 h-4 text-emerald-700" />
              <span>พิมพ์เขียวโครงสร้างคำสั่ง (Syntax Blueprint สำหรับตาราง students)</span>
            </h4>
            <div
              class="p-3 rounded-xl bg-white border border-emerald-200 font-mono text-xs text-gray-800 overflow-x-auto">
              <span class="text-emerald-700 font-bold">INSERT INTO</span> students (prefix, firstname, lastname, year,
              telephone) <br />
              <span class="text-emerald-700 font-bold">VALUES</span> ('นาย', 'สมชาย', 'ใจดี', 1, '0812345678');
            </div>
          </div>

          <div class="space-y-6">
            <!-- Block 2.1: Single Row Insert -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 2.1: การเพิ่มข้อมูลนักศึกษา 1
                    คนแบบระบุชื่อคอลัมน์ครบถ้วน</span>
                </div>
                <button @click="copyText(sqlSnippets.insertSingle, 'ins-single')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'ins-single'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'ins-single' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.insertSingle }}</pre>
              </div>

              <!-- Explanation & Anatomy -->
              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">คำอธิบายการทำงานทีละบรรทัด:</span>
                <ul class="space-y-1.5 list-disc pl-5 text-gray-600">
                  <li><code class="font-bold text-slate-900 font-mono">INSERT INTO students (...)</code>:
                    สั่งให้ฐานข้อมูลนำข้อมูลไปใส่ลงในตาราง <code class="font-bold text-emerald-700">students</code>
                    โดยระบุว่าจะหยอดใส่ 5 คอลัมน์</li>
                  <li><code
                      class="font-bold text-slate-900 font-mono">VALUES ('นาย', 'สมชาย', 'ใจดี', 1, '0812345678');</code>:
                    ค่าข้อมูลที่ต้องการบันทึก ต้องเรียงลำดับให้ตรงกับชื่อคอลัมน์ด้านบนเป๊ะๆ (ข้อความครอบด้วย <code
                      class="font-mono text-cyan-800">'...'</code> ส่วนชั้นปีเป็นตัวเลข <code
                      class="font-mono text-amber-800">1</code> พิมพ์ได้เลย)</li>
                  <li><strong>ข้อสังเกต:</strong> ทำไมไม่มีคอลัมน์ <code
                      class="font-mono text-slate-800 font-bold">id</code>? เพราะระบบ Supabase ได้ตั้งค่า <code
                      class="font-mono">id</code> เป็น Auto-increment Identity ไว้แล้ว ฐานข้อมูลจะรันเลข 1, 2, 3
                    ให้เองอัตโนมัติ!</li>
                </ul>
              </div>
            </div>

            <!-- Block 2.2: Multi-row Insert -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 2.2:
                    การเพิ่มข้อมูลนักศึกษาหลายคนพร้อมกันในคำสั่งเดียว (Multi-row Insert)</span>
                </div>
                <button @click="copyText(sqlSnippets.insertMulti, 'ins-multi')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'ins-multi'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'ins-multi' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.insertMulti }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">เทคนิคการเพิ่มข้อมูลครั้งละหลายคน:</span>
                <p class="text-gray-600 leading-relaxed">
                  เวลาขึ้นปีการศึกษาใหม่ มีนักศึกษาเข้ามาเป็นห้อง เราสามารถใส่ชุดวงเล็บ <code
                    class="font-mono text-slate-800">(...)</code> ต่อท้ายคำว่า <code
                    class="font-mono font-bold">VALUES</code> แล้วคั่นแต่ละแถวด้วยเครื่องหมายจุลภาค <strong>,
                    (Comma)</strong> และปิดท้ายแถวสุดท้ายด้วยเครื่องหมาย <strong>;</strong> โดยในแถวที่ 3
                  หากนักศึกษายังไม่มีเบอร์โทรศัพท์ สามารถใส่คำว่า <code
                    class="font-mono font-bold text-purple-700">NULL</code> ได้
                </p>
              </div>
            </div>

            <!-- Block 2.3: Returning Technique -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 2.3: เทคนิค Supabase —
                    ให้ฐานข้อมูลส่งข้อมูลนักศึกษาที่เพิ่งบันทึกกลับมาทันทีด้วย RETURNING</span>
                </div>
                <button @click="copyText(sqlSnippets.insertReturning, 'ins-ret')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'ins-ret'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'ins-ret' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.insertReturning }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ทำไมต้องใช้ RETURNING?</span>
                <p class="text-gray-600 leading-relaxed">
                  โดยปกติเมื่อเรารัน INSERT ฐานข้อมูลจะบอกแค่ว่า "INSERT 0 1" แต่เราจะไม่เห็นว่านักศึกษาคนนั้นได้รับรหัส
                  <code class="font-mono">id</code> อะไร การเติม <code
                    class="font-mono font-bold text-amber-700">RETURNING id, prefix, firstname, lastname, year;</code>
                  ต่อท้าย จะทำให้ Supabase นำข้อมูลแถวนั้นกลับมาแสดงผลให้เราดูบนหน้าจอทันที
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TOPIC 3: READ - SELECT, ALIAS, DISTINCT   -->
        <!-- ========================================== -->
        <div class="pt-8 border-t border-gray-200">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              CRUD ตัวที่ 2: READ (การอ่านและสืบค้นข้อมูล)
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-emerald-950 border-l-4 border-emerald-600 pl-4 mb-4">
            หัวข้อที่ 3: การอ่านและสืบค้นข้อมูลนักศึกษา (SELECT, Column Alias & DISTINCT)
          </h3>
          <p class="text-base text-gray-700 leading-relaxed mb-6">
            คำสั่ง <code class="font-bold text-blue-700 font-mono">SELECT</code>
            คือคำสั่งที่ใช้ค้นหาและดึงประวัตินักศึกษาจากตาราง <strong>students</strong> มาดูการเลือกคอลัมน์ที่จำเป็น
            การเปลี่ยนชื่อหัวตารางเป็นภาษาไทย และการกรองค่าซ้ำ:
          </p>

          <div class="space-y-6">
            <!-- Block 3.1: Specific Columns vs SELECT * -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 3.1: การดึงเฉพาะคอลัมน์ที่ต้องการ (Best
                    Practice)</span>
                </div>
                <button @click="copyText(sqlSnippets.selectColumns, 'sel-col')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'sel-col'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'sel-col' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.selectColumns }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ทำไมไม่ควรใช้ SELECT * ตลอดเวลา?</span>
                <p class="text-gray-600 leading-relaxed">
                  แม้ว่า <code class="font-mono text-slate-800">SELECT *</code> จะสะดวกตอนทดสอบ
                  แต่ถ้าในอนาคตตารางมีข้อมูลนักศึกษาเป็นพันคนและมีคอลัมน์เพิ่มขึ้นเรื่อยๆ การดึงทุกอย่างจะกิน Bandwidth
                  เครือข่าย การระบุเฉพาะชื่อคอลัมน์ที่ต้องการ เช่น <code
                    class="font-mono text-blue-700">SELECT prefix, firstname, lastname, year FROM students;</code>
                  จึงเป็นแนวปฏิบัติที่ดีที่สุด
                </p>
              </div>
            </div>

            <!-- Block 3.2: Column Alias with AS -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 3.2:
                    การตั้งชื่อหัวตารางผลลัพธ์เป็นภาษาไทยด้วย AS (Column Alias)</span>
                </div>
                <button @click="copyText(sqlSnippets.selectAlias, 'sel-alias')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'sel-alias'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'sel-alias' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.selectAlias }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ประโยชน์ของคำสั่ง AS:</span>
                <p class="text-gray-600 leading-relaxed">
                  ชื่อคอลัมน์ในฐานข้อมูลเป็นภาษาอังกฤษ (<code
                    class="font-mono">prefix, firstname, lastname, year, telephone</code>) แต่เวลาออกรายงานผลการเรียน
                  หรือส่งข้อมูลไปแสดงบนหน้าระบบ เราสามารถใส่ <code
                    class="font-mono font-bold text-teal-700">AS "ชื่อภาษาไทย"</code>
                  เพื่อให้หัวตารางในผลลัพธ์อ่านเข้าใจได้ง่ายสำหรับผู้ใช้งาน
                </p>
              </div>
            </div>

            <!-- Block 3.3: DISTINCT -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 3.3:
                    การตัดค่าซ้ำเพื่อตรวจสอบว่ามีนักศึกษาอยู่ชั้นปีใดบ้างด้วย DISTINCT</span>
                </div>
                <button @click="copyText(sqlSnippets.selectDistinct, 'sel-dist')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'sel-dist'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'sel-dist' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-purple-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.selectDistinct }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ตัวอย่างการใช้งานจริง:</span>
                <p class="text-gray-600 leading-relaxed">
                  ถ้าในตารางมีนักศึกษา 100 คน การใช้ <code class="font-mono">SELECT year FROM students;</code> จะแสดงเลข
                  1 และเลข 2 ซ้ำๆ กัน 100 บรรทัด! แต่เมื่อเติมคำว่า <code
                    class="font-mono font-bold text-purple-700">DISTINCT</code> เข้าไป ฐานข้อมูลจะตัดค่าที่ซ้ำออกทั้งหมด
                  เหลือแสดงเพียงเลขชั้นปีที่มีนักศึกษาอยู่จริงๆ เช่น เหลือเพียงแถว <code class="font-mono">1</code> และ
                  <code class="font-mono">2</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TOPIC 4: FILTERING & SORTING (WHERE, ORDER BY) -->
        <!-- ========================================== -->
        <div class="pt-8 border-t border-gray-200">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              การสืบค้นขั้นสูง: FILTERING & SORTING
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-emerald-950 border-l-4 border-emerald-600 pl-4 mb-4">
            หัวข้อที่ 4: การกรองข้อมูลและการจัดเรียงลำดับ (WHERE & ORDER BY)
          </h3>
          <p class="text-base text-gray-700 leading-relaxed mb-6">
            หากอาจารย์ต้องการ "ค้นหาเฉพาะนักศึกษาที่ตรงตามเงื่อนไข" เช่น ค้นหาเด็กปี 1 ที่มีเบอร์โทร
            หรือค้นหาชื่อนักศึกษา เราจะใช้คำสั่ง <code class="font-bold text-amber-700 font-mono">WHERE</code> และใช้
            <code class="font-bold text-emerald-700 font-mono">ORDER BY</code> เพื่อจัดเรียงลำดับ
            มาดูตัวอย่างแยกเป็นกรณีๆ:
          </p>

          <div class="space-y-6">
            <!-- Filter 4.1: Comparison & Logical (AND, OR) -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.1: ค้นหานักศึกษาชั้นปีที่ 1
                    และมีเบอร์โทรศัพท์ (WHERE ... AND ...)</span>
                </div>
                <button @click="copyText(sqlSnippets.filterComparison, 'flt-comp')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-comp'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-comp' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.filterComparison }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">การเชื่อมเงื่อนไข:</span>
                <p class="text-gray-600 leading-relaxed">
                  <code class="font-mono text-slate-800">year = 1</code> ตรวจสอบว่าอยู่ชั้นปี 1 หรือไม่ และ <code
                    class="font-mono text-slate-800">AND telephone IS NOT NULL</code> บังคับว่าต้องมีเบอร์โทรศัพท์ด้วย
                  (เป็นจริงทั้ง 2 เงื่อนไขพร้อมกัน)
                </p>
              </div>
            </div>

            <!-- Filter 4.2: BETWEEN -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.2: ค้นหาช่วงชั้นปีด้วยคำสั่ง
                    BETWEEN</span>
                </div>
                <button @click="copyText(sqlSnippets.filterBetween, 'flt-btwn')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-btwn'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-btwn' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.filterBetween }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ข้อควรรู้เกี่ยวกับ BETWEEN:</span>
                <p class="text-gray-600 leading-relaxed">
                  คำสั่ง <code class="font-mono font-bold text-cyan-800">WHERE year BETWEEN 1 AND 2</code>
                  จะดึงข้อมูลนักศึกษาที่อยู่ชั้นปี 1 ถึงปี 2 โดยนับรวมตัวเลขที่ขอบทั้งสองฝั่ง (ปี 1 และปี 2)
                  เขียนสั้นและอ่านเข้าใจง่ายกว่าการเขียน <code
                    class="font-mono text-slate-700">WHERE year >= 1 AND year <= 2</code>
                </p>
              </div>
            </div>

            <!-- Filter 4.3: IN -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.3:
                    กรองหาข้อมูลที่ตรงกับสมาชิกในกลุ่มด้วย IN (...)</span>
                </div>
                <button @click="copyText(sqlSnippets.filterIn, 'flt-in')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-in'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-in' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-indigo-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.filterIn }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">แทนการเขียน OR ซ้ำหลายครั้ง:</span>
                <p class="text-gray-600 leading-relaxed">
                  แทนที่จะต้องเขียน <code
                    class="font-mono text-slate-700">WHERE prefix = 'นาย' OR prefix = 'นางสาว'</code>
                  เราสามารถรวบคำให้สั้นกระชับด้วย <code
                    class="font-mono font-bold text-indigo-800">WHERE prefix IN ('นาย', 'นางสาว')</code> ได้ทันที
                </p>
              </div>
            </div>

            <!-- Filter 4.4: ILIKE with Wildcard % -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.4:
                    ค้นหาชื่อนักศึกษาที่มีคำที่ต้องการด้วย ILIKE และเครื่องหมาย %</span>
                </div>
                <button @click="copyText(sqlSnippets.filterIlike, 'flt-ilike')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-ilike'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-ilike' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.filterIlike }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">สัญลักษณ์ % (Wildcard) ทำงานอย่างไร:</span>
                <ul class="space-y-1 list-disc pl-5 text-gray-600">
                  <li><code class="font-mono text-emerald-700">'%สม%'</code>: หมายถึง มีคำว่า <strong>"สม"</strong>
                    อยู่ตรงไหนของชื่อก็ได้ เช่น <em>สมชาย, สมศักดิ์, พรสวรรค์สม, นฤมลสม</em></li>
                  <li><code class="font-mono text-emerald-700">'สม%'</code>: หมายถึง ชื่อต้อง <strong>ขึ้นต้นด้วยคำว่า
                      สม</strong> เท่านั้น เช่น <em>สมเกียรติ, สมาน</em></li>
                  <li>คำสั่ง <code class="font-mono font-bold text-emerald-700">ILIKE</code> บน PostgreSQL
                    จะไม่สนใจตัวพิมพ์เล็ก-ใหญ่ (Case-insensitive) ทำให้ค้นหาชื่อภาษาอังกฤษได้สะดวกมาก</li>
                </ul>
              </div>
            </div>

            <!-- Filter 4.5: IS NULL -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.5:
                    ค้นหานักศึกษาที่ยังไม่ได้กรอกเบอร์โทรศัพท์ (IS NULL)</span>
                </div>
                <button @click="copyText(sqlSnippets.filterNull, 'flt-null')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-null'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-null' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-rose-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.filterNull }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ข้อควรระวังสำคัญที่สุด:</span>
                <p class="text-gray-600 leading-relaxed">
                  ในภาษา SQL <strong>ห้ามเขียน <code
                      class="font-mono text-rose-700 font-bold">WHERE telephone = NULL</code> เด็ดขาด!</strong> เพราะค่า
                  NULL ในทางฐานข้อมูลคือ "ความว่างเปล่าที่ไม่มีอยู่จริง" จึงไม่สามารถนำเครื่องหมายเท่ากับ (=)
                  ไปเปรียบเทียบได้ ต้องใช้คำสั่งเฉพาะคือ <code class="font-mono font-bold text-slate-900">IS NULL</code>
                  (หรือ <code class="font-mono font-bold text-slate-900">IS NOT NULL</code> เมื่อต้องการคนที่มีเบอร์)
                  เสมอ
                </p>
              </div>
            </div>

            <!-- Filter 4.6: ORDER BY and LIMIT -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span class="text-xs font-mono font-bold text-white">ตัวอย่าง 4.6: การจัดเรียงรายชื่อตามชั้นปีและชื่อ
                    (ORDER BY) พร้อมจำกัด 5 คนแรก (LIMIT)</span>
                </div>
                <button @click="copyText(sqlSnippets.sortLimit, 'flt-sort')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'flt-sort'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'flt-sort' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.sortLimit }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">การควบคุมลำดับการแสดงผล:</span>
                <ul class="space-y-1 list-disc pl-5 text-gray-600">
                  <li><code class="font-mono text-blue-700 font-bold">ORDER BY year ASC, firstname ASC</code>:
                    เรียงลำดับจากชั้นปีน้อยไปหามาก (ปี 1 ก่อน แล้วตามด้วยปี 2) และถ้าอยู่ชั้นปีเดียวกัน
                    ให้เรียงตามตัวอักษรชื่อจริง (ก-ฮ)</li>
                  <li><code class="font-mono text-blue-700 font-bold">LIMIT 5</code>: ดึงมาแสดงเพียง 5 คนแรกเท่านั้น
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TOPIC 5: SAFE UPDATE & DELETE OPERATIONS  -->
        <!-- ========================================== -->
        <div class="pt-8 border-t border-gray-200">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
              CRUD ตัวที่ 3 & 4: UPDATE & DELETE (ความปลอดภัยระดับสูง)
            </span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-emerald-950 border-l-4 border-emerald-600 pl-4 mb-4">
            หัวข้อที่ 5: การแก้ไขและการลบข้อมูลอย่างปลอดภัย (Safe UPDATE & DELETE ในตาราง students)
          </h3>
          <p class="text-base text-gray-700 leading-relaxed mb-6">
            คำสั่งแก้ไขประวัตินักศึกษา (<code class="font-mono text-amber-700 font-bold">UPDATE</code>) และคำสั่งลบ
            (<code class="font-mono text-rose-700 font-bold">DELETE</code>) เป็นคำสั่งอันตรายที่สุดในระบบ
            หากเขียนผิดพลาด ข้อมูลนักศึกษาอาจหายหมดทั้งแผนกโดยไม่มีปุ่ม Ctrl+Z ให้กู้คืน! มาเรียนรู้
            <strong>ขั้นตอนปฏิบัติที่ปลอดภัย (Safe Workflow)</strong> กัน:
          </p>

          <!-- Golden Rule Warning Box -->
          <div
            class="p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 mb-8 space-y-3 shadow-sm">
            <div class="flex items-center gap-3 text-rose-900 font-black text-base sm:text-lg">
              <AlertOctagon class="w-6 h-6 text-rose-600 shrink-0" />
              <span>กฎเหล็กชี้เป็นชี้ตาย: ห้ามรัน UPDATE หรือ DELETE โดยไม่มี WHERE เด็ดขาด!</span>
            </div>
            <p class="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
              หากเรารันคำสั่ง <code
                class="font-mono font-bold bg-white px-2 py-0.5 rounded border border-rose-200">DELETE FROM students;</code>
              โดยลืมใส่ WHERE ฐานข้อมูลจะ <strong>ลบประวัตินักศึกษาทุกคนในวิทยาลัยเกลี้ยงทันที!</strong> และถ้าสั่ง
              <code
                class="font-mono font-bold bg-white px-2 py-0.5 rounded border border-rose-200">UPDATE students SET year = 1;</code>
              นักศึกษาทุกคนทุกชั้นปีจะกลายเป็นเด็กปี 1 ทั้งหมดทันที!
            </p>
          </div>

          <!-- Step by Step Safe Workflow -->
          <div class="space-y-6">
            <h4 class="font-bold text-gray-900 text-base flex items-center gap-2">
              <ShieldAlert class="w-5 h-5 text-emerald-600" />
              <span>กระบวนการ 2 ขั้นตอนเพื่อความปลอดภัย 100% (The Safe Workflow)</span>
            </h4>

            <!-- Step 1: SELECT Check -->
            <div class="rounded-2xl border-2 border-emerald-200 overflow-hidden bg-white shadow-sm">
              <div class="bg-emerald-900 px-5 py-3 flex items-center justify-between text-white">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-bold">ขั้นตอนที่ 1</span>
                  <span class="text-xs font-mono font-bold">ตรวจเช็กแถวนักศึกษาด้วย SELECT ก่อนเสมอ!</span>
                </div>
                <button @click="copyText(sqlSnippets.safeSelectCheck, 'safe-sel')"
                  class="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'safe-sel'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'safe-sel' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div
                class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.safeSelectCheck }}</pre>
              </div>

              <div class="p-4 bg-emerald-50/50 border-t border-emerald-100 text-xs text-gray-700">
                <p class="text-emerald-950 font-medium leading-relaxed">
                  รันคำสั่งนี้ดูก่อน เพื่อให้ตาเราเห็นข้อมูลจริงบนหน้าจอว่านักศึกษาแถวที่ <code
                    class="font-mono font-bold">id = 3</code> คือคนที่ต้องการแก้เบอร์โทรศัพท์จริงๆ ไม่ได้จำรหัส ID ผิดคน
                </p>
              </div>
            </div>

            <!-- Step 2A: Safe UPDATE -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-amber-500 text-slate-900 text-[10px] font-bold">ขั้นตอนที่
                    2ก</span>
                  <span class="text-xs font-mono font-bold text-white">การแก้ไขข้อมูลด้วย UPDATE ... SET ... WHERE
                    ...</span>
                </div>
                <button @click="copyText(sqlSnippets.safeUpdate, 'safe-upd')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'safe-upd'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'safe-upd' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.safeUpdate }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ชำแหละคำสั่ง UPDATE:</span>
                <ul class="space-y-1 list-disc pl-5 text-gray-600">
                  <li><code class="font-mono text-slate-900 font-bold">UPDATE students</code>:
                    สั่งว่าจะแก้ไขข้อมูลในตาราง students</li>
                  <li><code class="font-mono text-slate-900 font-bold">SET telephone = '0899998877', year = 2</code>:
                    ระบุคอลัมน์และค่าใหม่ที่ต้องการแก้ไข (ถ้ามีหลายคอลัมน์คั่นด้วยจุลภาค)</li>
                  <li><code class="font-mono text-rose-700 font-bold">WHERE id = 3;</code>: สำคัญที่สุด!
                    เจาะจงเฉพาะนักศึกษาคนที่มี id = 3 เท่านั้น คนอื่นจะไม่ได้รับผลกระทบ</li>
                </ul>
              </div>
            </div>

            <!-- Step 2B: Safe DELETE -->
            <div class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div
                class="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">ขั้นตอนที่ 2ข</span>
                  <span class="text-xs font-mono font-bold text-white">การลบข้อมูลอย่างปลอดภัยด้วย DELETE FROM ... WHERE
                    ...</span>
                </div>
                <button @click="copyText(sqlSnippets.safeDelete, 'safe-del')"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'safe-del'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'safe-del' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL' }}</span>
                </button>
              </div>

              <div class="bg-slate-950 p-4 font-mono text-xs sm:text-sm text-rose-300 overflow-x-auto leading-relaxed">
                <pre>{{ sqlSnippets.safeDelete }}</pre>
              </div>

              <div class="p-4 bg-slate-50 border-t border-gray-200 text-xs text-gray-700 space-y-2">
                <span class="font-bold text-gray-900 block">ชำแหละคำสั่ง DELETE:</span>
                <p class="text-gray-600 leading-relaxed">
                  ระบุ <code class="font-mono text-slate-900 font-bold">DELETE FROM students</code> แล้วตามด้วยเงื่อนไข
                  <code class="font-mono text-rose-700 font-bold">WHERE id = 5 AND year = 1;</code>
                  ซึ่งเป็นการเพิ่มเงื่อนไขป้องกันซ้อนสองชั้น เพื่อให้มั่นใจว่าจะไม่ไปลบข้อมูลนักศึกษาผิดคน
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
          <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
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

        <!-- Teacher Scoreboard Button (Only visible to teacher) -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-emerald-700 shrink-0 cursor-pointer">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Score Summary Card -->
      <div class="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
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
            <span class="text-3xl font-black text-emerald-600 font-mono">{{ studentNorm.normalizedScore }}</span>
            <span class="text-xs text-gray-400 font-bold ml-1 font-mono">/ 10</span>
          </div>
        </div>
      </div>

      <!-- Game Tab Buttons -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <button @click="activeGame = 'sort'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer',
          activeGame === 'sort'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: จัดกลุ่มคำสั่งตามประเภท CRUD</span>
          <span v-if="studentWeekScores['game-1'] !== undefined"
            class="inline-flex items-center ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            <Check class="w-3 h-3 inline mr-1" /> บันทึกแล้ว
          </span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer',
          activeGame === 'match'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่เงื่อนไข Filtering</span>
          <span v-if="studentWeekScores['game-2'] !== undefined"
            class="inline-flex items-center ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            <Check class="w-3 h-3 inline mr-1" /> บันทึกแล้ว
          </span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer',
          activeGame === 'quiz'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>แบบทดสอบหลังเรียน (4 ตัวเลือก 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz'] !== undefined"
            class="inline-flex items-center ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            <Check class="w-3 h-3 inline mr-1" /> บันทึกแล้ว
          </span>
        </button>
      </div>

      <!-- Games Components -->
      <DragDropGame v-if="activeGame === 'sort'" :course-id="currentCourseId" :week="currentWeek" game-id="game-1"
        title="มินิเกมที่ 1: จัดกลุ่มคำสั่ง SQL ตามประเภทการทำงาน CRUD (ตาราง students)"
        subtitle="ลากคำสั่ง SQL และการกระทำด้านล่างไปใส่กล่องประเภท CRUD (Create, Read, Update, Delete) ให้ถูกต้อง"
        :initial-items="dragItemsData" :zones="dragZonesData" />

      <MatchingGame v-if="activeGame === 'match'" :course-id="currentCourseId" :week="currentWeek" game-id="game-2"
        title="มินิเกมที่ 2: จับคู่คำสั่งสืบค้นและเงื่อนไข Filtering ตาราง students"
        subtitle="คลิกจับคู่ระหว่างคำสั่ง SQL ฝั่งซ้าย และผลลัพธ์การทำงานที่ถูกต้องฝั่งขวา"
        :initial-left-terms="matchLeftTerms" :initial-right-defs="matchRightDefs" />

      <PopQuiz v-if="activeGame === 'quiz'" :course-id="currentCourseId" :week="currentWeek" game-id="quiz"
        title="แบบทดสอบหลังเรียน: การจัดการและสืบค้นข้อมูลใน Supabase (Post-test)" :questions="quizQuestions" />
    </section>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal v-if="isTeacher" :show="showTeacherModal" :course-id="currentCourseId" :week="currentWeek"
      :games="weekGames" @close="showTeacherModal = false" />

    <!-- PDF Viewer Modal -->
    <AssignmentPdfModal :show="showPdfModal" pdf-url=""
      title="ใบงานที่ 3: ปฏิบัติการจัดการและสืบค้นข้อมูลในตาราง Product ด้วยคำสั่ง SQL (10 ข้อ)"
      @close="showPdfModal = false" />

    <!-- Assignment Section (asm-3) -->
    <section>
      <AssignmentSection assignment-id="asm-3" :course-id="currentCourseId"
        :assignment-title="'ใบงานที่ 3: ปฏิบัติการจัดการและสืบค้นข้อมูลในตาราง Product ด้วยคำสั่ง SQL (10 ข้อ)'"
        :max-score="10" work-type="pair" :min-members="1" :max-members="4" @open-pdf="showPdfModal = true">
        <template #number>3</template>

        <template #description>
          <div class="space-y-4 mb-4 text-gray-700">
            <!-- Step 1: Preparation & File Download Card -->
            <div
              class="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 space-y-4">
              <div class="flex items-center gap-2.5 text-emerald-900 font-bold text-base">
                <Table class="w-5 h-5 text-emerald-700" />
                <span>ขั้นตอนที่ 1: สร้างตาราง Product และนำเข้าข้อมูลตัวอย่าง (Dataset Preparation)</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ให้นักเรียนเปิด Supabase แล้วสร้างตารางชื่อ <strong>Product</strong> (หรือ <code
                  class="font-mono font-bold text-emerald-800">products</code>) โดยกำหนดคอลัมน์: <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">id (bigint, PK)</code>,
                <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">product_name (text)</code>,
                <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">category (text)</code>,
                <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">price (numeric)</code>,
                <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">stock (int4)</code>,
                และ <code
                  class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-emerald-200">description (text)</code>
              </p>

              <!-- Download and SQL Quick Actions -->
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <!-- CSV Download Button -->
                <a href="/downloads/products_sample_data.csv" download="products_sample_data.csv"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:shadow active:scale-95 cursor-pointer">
                  <Download class="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์ข้อมูลสินค้า (products_sample_data.csv)</span>
                </a>

                <!-- Toggle SQL Setup Script Button -->
                <button type="button" @click="showSetupSql = !showSetupSql"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-300 shadow-xs transition-all cursor-pointer">
                  <FileCode class="w-4 h-4 text-emerald-700" />
                  <span>{{ showSetupSql ? 'ซ่อนคำสั่ง SQL นำเข้า' : 'หรือคัดลอกคำสั่ง SQL นำเข้าข้อมูล (20 แถว)'
                  }}</span>
                </button>
              </div>

              <!-- Collapsible SQL Setup Script Box -->
              <div v-if="showSetupSql"
                class="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 text-slate-200 font-mono text-xs space-y-2 mt-3">
                <div
                  class="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-slate-400 border-b border-slate-800">
                  <span class="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Terminal class="w-3.5 h-3.5" /> โค้ด SQL: สร้างตารางและเพิ่มข้อมูลสินค้า 20 รายการใน 1 คลิก
                  </span>
                  <button @click="copyText(sqlSetupProductTable, 'setup-product')"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer">
                    <Check v-if="copiedSnippet === 'setup-product'" class="w-3.5 h-3.5 text-emerald-400" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedSnippet === 'setup-product' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL ทั้งหมด' }}</span>
                  </button>
                </div>
                <pre
                  class="p-4 overflow-x-auto text-emerald-300 max-h-56 overflow-y-auto leading-relaxed">{{ sqlSetupProductTable }}</pre>
              </div>
            </div>

            <!-- Step 2: Submission Rules & Format -->
            <div class="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <FileText class="w-4 h-4 text-amber-600" />
                <span>คำชี้แจงรูปแบบการจัดทำและส่งงาน (ทำลงในไฟล์ Docx / Word):</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                <li>
                  ให้นักเรียนทำรายงานลงในไฟล์เอกสาร <strong>Microsoft Word (.docx)</strong> หรือ <strong>Google
                    Docs</strong> (หรือบันทึกส่งออกเป็น .pdf)
                </li>
                <li>
                  ในแต่ละข้อจาก 10 ข้อ จะต้องประกอบด้วย 2 ส่วนสำคัญ ได้แก่:
                  <div class="mt-1 flex flex-wrap gap-2 text-xs">
                    <span class="px-2 py-0.5 rounded bg-white border border-amber-300 font-semibold text-gray-800">
                      1. ข้อความคำสั่ง SQL ที่เขียนใช้สั่งงาน
                    </span>
                    <span class="px-2 py-0.5 rounded bg-white border border-amber-300 font-semibold text-gray-800">
                      2. ภาพแคปหน้าจอ (Screenshot) ที่เห็นคำสั่งและตารางผลลัพธ์ (Results) ใน Supabase ชัดเจน
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <template #tasks>
          <div class="space-y-4 text-xs sm:text-sm">

            <!-- Workplace Scenario Banner -->
            <div class="p-3.5 rounded-xl bg-slate-900 text-white flex items-center gap-3 shadow-xs">
              <Briefcase class="w-5 h-5 text-emerald-400 shrink-0" />
              <div class="text-xs">
                <span class="font-bold text-emerald-300 block">สถานการณ์จำลอง (Workplace Scenario):</span>
                <span>คุณรับบทเป็นผู้ดูแลฐานข้อมูลประจำร้านค้าไอที และนี่คือข้อความสั่งงานจริง 10
                  ข้อจากหัวหน้างานที่ต้องการให้คุณเขียนคำสั่ง SQL ไปจัดการตาราง products</span>
              </div>
            </div>

            <!-- Task 1 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 1: บันทึกข้อมูลสินค้าใหม่เข้าคลัง</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">เพิ่มข้อมูลใหม่</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "มีสินค้าตัวใหม่เพิ่งมาส่งหน้าร้าน ช่วยเอาเข้าระบบฐานข้อมูลที ชื่อแว่นตากรองแสงสีฟ้า หมวดหมู่ Gadget
                    ราคาขาย 390 บาท, รับเข้ามา 50 ชิ้น, รายละเอียดเพิ่มเติม แว่นถนอมสายตาสำหรับคนทำงานหน้าจอคอม"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 2 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 2: ตรวจเช็กสินค้าทั้งหมดในระบบ</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">แสดงข้อมูลทั้งหมด</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ช่วยเปิดระบบดึงข้อมูลสินค้าทั้งหมดออกมาดูหน่อย อยากเช็กความเรียบร้อยว่าในคลังมีของอะไรอยู่บ้าง
                    และสินค้าตัวใหม่ที่เพิ่งเพิ่มเข้าไปขึ้นในระบบหรือยัง"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 3 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 3: เตรียมข้อมูลทำป้ายราคาหน้าร้าน</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-100">เลือกคอลัมน์
                  & ตั้งชื่อหัวตาราง</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ฝ่ายการตลาดขอรายการสินค้าเฉพาะชื่อสินค้า หมวดหมู่ แล้วก็ราคาขาย ช่วยดึงออกมาให้หน่อย
                    แต่ขอเปลี่ยนหัวตารางให้อ่านง่ายเป็นภาษาไทยว่า 'ชื่อสินค้า', 'หมวดหมู่สินค้า' และ 'ราคาขาย'
                    จะเอาไปพิมพ์ติดป้ายหน้าร้าน"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 4 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">4</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 4: สรุปหมวดหมู่สินค้าทั้งหมดในร้าน</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-100">คัดกรองค่าไม่ซ้ำ</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ช่วยสรุปให้ดูหน่อยว่าร้านเรามีสินค้าหมวดหมู่อะไรขายบ้าง ขอเฉพาะชื่อหมวดหมู่แบบไม่ซ้ำกันนะ
                    จะเอาไปจัดหมวดป้ายแผนกในร้าน"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 5 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">5</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 5: คัดสินค้าพร้อมส่งราคา 500 บาทขึ้นไป</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-100">เงื่อนไขหลายชั้น</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "มีลูกค้า VIP กำลังยืนรออยู่หน้าร้าน เขาอยากได้สินค้าที่มีราคาตั้งแต่ 500 บาทขึ้นไป
                    และต้องพร้อมส่งมีของอยู่ในคลังทันที ช่วยค้นหารายการสินค้าตามนี้ออกมาให้ลูกค้าเลือกดูหน่อย"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 6 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">6</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 6: จัดชุดสินค้าโปรโมชันงบกลาง</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 font-semibold border border-cyan-100">ค้นหาตามช่วงตัวเลข</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ฝ่ายขายจะจัดแคมเปญโปรโมชันสินค้าราคาจับต้องได้ช่วง 200 ถึง 1,500 บาท
                    ช่วยค้นหาสินค้าที่ราคาอยู่ในช่วงนี้ออกมาให้ฝ่ายขายทำแบนเนอร์โปรโมตหน่อย
                    ขอเฉพาะชื่อสินค้ากับราคาขายนะ"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 7 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">7</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 7: คัดสินค้าไปจัดแสดงบูธงานไอที</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">ค้นหาตามกลุ่มรายการ</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "เสาร์-อาทิตย์นี้ร้านเราจะไปออกบูธงานไอที ช่วยคัดสินค้าที่อยู่ในหมวดหมู่ IT, Gaming หรือ Gadget
                    ออกมาให้ดูหน่อย ดึงเฉพาะชื่อสินค้า หมวดหมู่ และราคามานะ"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 8 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">8</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 8: ค้นหาอุปกรณ์ไร้สายให้ลูกค้า</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">ค้นหาข้อความบางส่วน</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ลูกค้าโทรมาสอบถามว่าร้านเรามีอุปกรณ์ตัวไหนที่เป็นแบบไร้สายบ้าง ช่วยค้นหาสินค้าที่มีคำว่า Wireless
                    อยู่ในชื่อสินค้ามาให้ดูหน่อย ขอชื่อสินค้า ราคาขาย และจำนวนสต็อกที่เหลือ"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 9 -->
            <div
              class="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">9</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 9: ตรวจหาสินค้าที่ข้อมูลยังไม่ครบ</span>
                </div>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-100">ตรวจสอบค่าว่าง</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ฝ่ายคอนเทนต์แจ้งว่ามีสินค้าบางตัวที่ยังไม่ได้พิมพ์รายละเอียดสินค้า
                    ช่วยค้นหาออกมาหน่อยว่ามีสินค้าตัวไหนบ้างที่ยังไม่มีข้อมูลในช่องนี้ จะได้สั่งให้แอดมินไปเขียนเพิ่ม"
                  </p>
                </div>
              </div>
            </div>

            <!-- Task 10 -->
            <div
              class="p-4 rounded-xl bg-white border-2 border-emerald-300 hover:border-emerald-400 transition-colors shadow-2xs space-y-2.5">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">10</span>
                  <span class="font-bold text-gray-900 text-sm">ภารกิจที่ 10: จัดลำดับสินค้าท็อป
                    และจัดการสต็อกอย่างปลอดภัย</span>
                </div>
                <span class="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-semibold">จัดลำดับ &
                  ปรับปรุง/ลบ</span>
              </div>
              <div
                class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <span class="font-bold text-amber-900 block text-[11px]">คำสั่ง:</span>
                  <p class="leading-relaxed font-medium">
                    "ผู้จัดการสั่งงานเรื่องสต็อกสินค้า 3 เรื่องด่วน ช่วยจัดการตามนี้ที:<br />
                    1. ดึงสินค้า 5 อันดับแรกที่ราคาแพงที่สุดในร้าน เรียงจากแพงไปหาถูกมาดูซิ<br />
                    2. สินค้าชิ้นแรก (รหัส 1) ให้ปรับราคาขายเป็น 750 บาท แล้วเพิ่มจำนวนสต็อกเป็น 50 ชิ้น<br />
                    3. สินค้าตัวไหนที่สต็อกหมดเกลี้ยง (เหลือ 0 ชิ้น) ช่วยลบรายการทิ้งออกจากระบบ 1 ตัวที<br />
                    (อย่าลืมค้นหาตรวจสอบข้อมูลก่อนแก้ไขและก่อนลบด้วยนะ เดี๋ยวไปแก้หรือลบผิดตัว!)"
                  </p>
                </div>
              </div>
              <div class="text-xs text-gray-600 space-y-1.5 pl-1">
                <p><strong>สิ่งที่คุณต้องทำ:</strong> (แยกทำเป็น 3 ข้อย่อยพร้อมแนบรูปภาพผลลัพธ์)</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li><strong>10.1:</strong> เขียนคำสั่ง SQL เรียงลำดับสินค้าตามราคาจากแพงที่สุดไปถูกที่สุด
                    และดึงมาแสดงผลเพียง 5 รายการแรก</li>
                  <li><strong>10.2:</strong> เขียนคำสั่งตรวจสอบสินค้ารหัส 1 ก่อน แล้วเขียนคำสั่ง SQL
                    ปรับปรุงราคาขายและสต็อกตามที่ได้รับมอบหมาย</li>
                  <li><strong>10.3:</strong> เขียนคำสั่งค้นหาสินค้าที่สต็อกเหลือ 0 ชิ้นก่อน แล้วเขียนคำสั่ง SQL
                    ลบสินค้ารายการนั้นออกจากระบบจำนวน 1 รายการ</li>
                </ul>
              </div>
            </div>

          </div>
        </template>
      </AssignmentSection>
    </section>

  </div>
</template>
