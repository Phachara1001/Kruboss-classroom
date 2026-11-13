<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as xlsx from 'xlsx'
import {
  BookOpen, PieChart, Info, CheckCircle, XCircle, FileText,
  Database, Layers, Shield, Users, ArrowRight, Target,
  Award, Lightbulb, ListOrdered, ChevronRight, Star,
  Code, Sparkles, BarChart3, RefreshCw, CheckCircle2, ChevronLeft, Eye, HelpCircle, Clock, Edit3,
  Trophy, FileSpreadsheet, AlertCircle, ClipboardList, CheckSquare,
  ShieldCheck, Filter, Globe, Download, Search, AlertTriangle, Table,
  AlertOctagon, Link as LinkIcon, Wrench, Trash2, Wand2, ExternalLink, Copy, Check, Scissors, ShoppingBag,
  Cpu, Coffee, Package, Car, Dumbbell, Tent, Swords, GraduationCap
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'

import { authUser } from '@/data/authStore'
import { isTeacherUser } from '@/data/studentsStore'

const router = useRouter()

// Current Course & Week context
const currentCourseId = '31901-2012'
const currentWeek = 3

// Modal States
const showPdfModal = ref(false)
const isTeacher = computed(() => isTeacherUser(authUser.value))



// ============================================================================
// DEMO DATASET EXPORT (.XLSX) FOR TEACHER & STUDENTS
// ============================================================================
const demoRawData = [
  { Order_ID: 'ORD-101', Customer: 'คุณสมชาย', Basket_Items: 'bread / cola / sprite', Total_Price: 85 },
  { Order_ID: 'ORD-102', Customer: 'คุณสายใจ', Basket_Items: '  milk / BREAD / Cola  ', Total_Price: 95 },
  { Order_ID: 'ORD-102', Customer: 'คุณสายใจ', Basket_Items: '  milk / BREAD / Cola  ', Total_Price: 95 },
  { Order_ID: 'ORD-103', Customer: 'คุณวิชัย', Basket_Items: 'sprite / chips /   bread ', Total_Price: 99999 },
  { Order_ID: 'ORD-104', Customer: 'คุณนภา', Basket_Items: 'COLA / water', Total_Price: null },
  { Order_ID: 'ORD-105', Customer: 'คุณกานดา', Basket_Items: 'bread /   milk / egg', Total_Price: 110 },
  { Order_ID: 'ORD-106', Customer: 'คุณเอกชัย', Basket_Items: 'COLA / water / chips', Total_Price: 75 },
  { Order_ID: 'ORD-107', Customer: 'คุณจินดา', Basket_Items: '  snack / tea / COLA ', Total_Price: 60 }
]

const downloadDemoExcel = () => {
  const ws = xlsx.utils.json_to_sheet(demoRawData)
  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws, 'Raw_Data')
  xlsx.writeFile(wb, 'demo_basket_cleansing_dataset.xlsx')
}

// ============================================================================
// SHARED GOOGLE SHEET (11 PROJECTS x 40 ROWS) - PREPARED BY THE TEACHER
// ============================================================================
const SHARED_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uEcppngjfwSzbclz3q1lfrOHlMrGhJidVYLEr9zq3g8/edit?usp=sharing'
const ROWS_PER_PROJECT = 40
const copiedSheetUrl = ref(false)
const copiedRowText = ref(false)

const copySharedSheetUrl = () => {
  navigator.clipboard.writeText(SHARED_SHEET_URL)
  copiedSheetUrl.value = true
  setTimeout(() => { copiedSheetUrl.value = false }, 2000)
}

const projectTopics = [
  { no: 1, icon: CheckSquare, name: 'ระบบเช็กชื่อเข้าเรียน' },
  { no: 2, icon: Trophy, name: 'ประวัติการแข่งขัน E-Sport' },
  { no: 3, icon: Cpu, name: 'สต็อกอุปกรณ์คอมพิวเตอร์ / IoT' },
  { no: 4, icon: BookOpen, name: 'ระบบยืม-คืนหนังสือ' },
  { no: 5, icon: Coffee, name: 'ออเดอร์ร้านคาเฟ่ / ชานม' },
  { no: 6, icon: Package, name: 'ข้อมูลลูกค้าและจัดส่งพัสดุ' },
  { no: 7, icon: Car, name: 'ข้อมูลการเข้าศูนย์บริการรถ' },
  { no: 8, icon: Dumbbell, name: 'บันทึกการออกกำลังกาย' },
  { no: 9, icon: Tent, name: 'ระบบสมัครเข้าค่าย / อีเวนต์' },
  { no: 10, icon: Swords, name: 'สถิติการขายไอเทมเกม' },
  { no: 11, icon: GraduationCap, name: 'คะแนนสอบและส่งงานรายวิชา' }
]

const selectedProjectNo = ref(1)
const selectedProject = computed(
  () => projectTopics.find(p => p.no === selectedProjectNo.value) || projectTopics[0]
)

const copyProjectNote = () => {
  const p = selectedProject.value
  const note = `รับผิดชอบโปรเจกต์ที่ ${p.no}: ${p.name} (ข้อมูล ${ROWS_PER_PROJECT} แถว)`
  navigator.clipboard.writeText(note)
  copiedRowText.value = true
  setTimeout(() => { copiedRowText.value = false }, 2000)
}

// ============================================================================
// INTERACTIVE DEMO: SHOPPING BASKET SPLIT & CLEAN (bread / cola / sprite)
// ============================================================================
const basketInput = ref('bread / cola / sprite')
const basketDelimiter = ref('/')
const basketStage = ref(0) // 0: Raw, 1: Split only, 2: Split + Trim, 3: Split + Trim + Proper Case

const basketPresets = [
  { label: 'ตัวอย่างหลัก: bread / cola / sprite', val: 'bread / cola / sprite', delim: '/' },
  { label: 'มีวรรคเกิน & ตัวพิมพ์ปน:   BREAD / cola  /  Sprite ', val: '  BREAD / cola  /  Sprite ', delim: '/' },
  { label: 'ตะกร้า 4 ชิ้น: milk / bread / egg / butter', val: 'milk / bread / egg / butter', delim: '/' },
  { label: 'คั่นด้วยลูกน้ำ: cola, sprite, chips', val: 'cola, sprite, chips', delim: ',' }
]

const applyBasketPreset = (preset) => {
  basketInput.value = preset.val
  basketDelimiter.value = preset.delim
}

const toProperCase = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const liveSplitTokens = computed(() => {
  const raw = basketInput.value || ''
  const delim = basketDelimiter.value || '/'
  const parts = raw.split(delim)
  return parts.map((p, idx) => {
    const trimmed = p.trim()
    const proper = toProperCase(trimmed)
    let display = p
    if (basketStage.value === 2) display = trimmed
    if (basketStage.value === 3) display = proper
    return {
      colName: `Item_${idx + 1}`,
      rawPart: p,
      trimmedPart: trimmed,
      properPart: proper,
      display,
      hasExtraSpace: p !== trimmed
    }
  })
})

const sampleBasketOrders = [
  { orderId: 'ORD-101', customer: 'คุณสมชาย', rawBasket: 'bread / cola / sprite', total: 85 },
  { orderId: 'ORD-102', customer: 'คุณสายใจ', rawBasket: '  milk / BREAD / cola  ', total: 95 },
  { orderId: 'ORD-103', customer: 'คุณวิชัย', rawBasket: 'sprite / chips /   bread ', total: 70 },
  { orderId: 'ORD-104', customer: 'คุณนภา', rawBasket: 'COLA / water', total: 35 },
  { orderId: 'ORD-105', customer: 'คุณกานดา', rawBasket: 'bread /   milk / egg', total: 110 }
]

const processedBasketOrders = computed(() => {
  return sampleBasketOrders.map(order => {
    const parts = order.rawBasket.split('/')
    const items = [0, 1, 2].map(i => {
      const part = parts[i] !== undefined ? parts[i] : ''
      if (!part) return ''
      if (basketStage.value === 1) return part
      if (basketStage.value === 2) return part.trim()
      if (basketStage.value === 3) return toProperCase(part.trim())
      return part
    })
    return {
      ...order,
      item1: items[0],
      item2: items[1],
      item3: items[2]
    }
  })
})

const basketItemSummary = computed(() => {
  const counts = {}
  processedBasketOrders.value.forEach(order => {
    ;[order.item1, order.item2, order.item3].forEach(it => {
      if (!it) return
      counts[it] = (counts[it] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// ============================================================================
// PRACTICE DATASET: 500-ROW DIRTY DATA GENERATOR (OPTIONAL SELF-PRACTICE CSV)
// ============================================================================
// Generate deterministic 500 rows with realistic Dirty Data problems for self-practice
const generate500DirtyRows = () => {
  const cleanDepts = [
    'ฝ่ายไอที (IT)',
    'ฝ่ายบัญชี (Accounting)',
    'ฝ่ายการตลาด (Marketing)',
    'ฝ่ายขาย (Sales)',
    'ฝ่ายทรัพยากรบุคคล (HR)',
    'ฝ่ายคลังสินค้า (Warehouse)'
  ]
  const dirtyDeptVariants = [
    '  it support ',
    'ไอที',
    'IT ',
    'บัญชีและการเงิน',
    '  การตลาด  ',
    'Marketing',
    'ฝ่ายขาย ',
    'HR Department',
    'คลังสินค้า'
  ]
  const channels = ['ระบบแจ้งซ่อมออนไลน์', 'โทรศัพท์ภายใน', 'LINE กลุ่มแผนก', 'เดินแจ้งหน้าห้อง IT']
  const dirtyChannels = ['  line กลุ่มแผนก ', 'โทรภายใน', 'แจ้งผ่าน LINE', 'Walk-in']

  const rows = []
  for (let i = 1; i <= 500; i++) {
    const recId = `REC-${String(i).padStart(3, '0')}`
    let empId = `EMP-${String(1000 + i)}`
    let dept = cleanDepts[i % cleanDepts.length]
    let channel = channels[i % channels.length]
    let waitHours = Number((((i * 7) % 35) * 0.25 + 0.5).toFixed(2))
    let ticketCount = ((i * 3) % 8) + 1
    let csatScore = ((i * 5) % 5) + 1
    let submitDate = `2026-11-${String((i % 28) + 1).padStart(2, '0')}`
    let status = 'สำเร็จ'
    let problemHint = 'ปกติ'

    // Inject Dirty Data systematically so every 20-25 row chunk has all 5 dirty types!
    const mod = i % 20

    if (mod === 2 || mod === 11) {
      // 1. Inconsistent Department Name & Extra Spaces
      dept = dirtyDeptVariants[i % dirtyDeptVariants.length]
      problemHint = 'Inconsistency (ชื่อแผนกไม่เป็นมาตรฐาน/เว้นวรรคเกิน)'
    } else if (mod === 4) {
      // 2. Missing Value in Wait_Hours
      waitHours = ''
      problemHint = 'Missing Value (ข้อมูลเวลารอคอยว่างเปล่า)'
    } else if (mod === 7) {
      // 3. Outlier in Wait_Hours (999 or -10)
      waitHours = i % 40 === 7 ? 999 : -12.5
      problemHint = 'Outlier / Inaccuracy (เวลารอคอยผิดปกติสุดโต่ง 999 หรือติดลบ)'
    } else if (mod === 9) {
      // 4. Duplicate Row (Copy previous row's Employee_ID and values)
      const prevIdx = rows.length - 1
      if (prevIdx >= 0) {
        empId = rows[prevIdx].empId
        dept = rows[prevIdx].dept
        channel = rows[prevIdx].channel
        waitHours = rows[prevIdx].waitHours
        ticketCount = rows[prevIdx].ticketCount
        csatScore = rows[prevIdx].csatScore
        submitDate = rows[prevIdx].submitDate
        problemHint = 'Duplicate (ข้อมูลส่งซ้ำกับแถวก่อนหน้า)'
      }
    } else if (mod === 13) {
      // 5. Invalid Data Type / Text in Numeric Column or Out-of-Range CSAT
      csatScore = i % 40 === 13 ? 55 : ''
      problemHint = i % 40 === 13
        ? 'Outlier / Validity (คะแนนความพึงพอใจเกินสเกล 1-5 เป็น 55)'
        : 'Missing Value (คะแนนความพึงพอใจว่างเปล่า)'
    } else if (mod === 16) {
      // 6. Inconsistent Date Format & Channel Name
      const day = String((i % 28) + 1).padStart(2, '0')
      submitDate = `${day}/11/2026`
      channel = dirtyChannels[i % dirtyChannels.length]
      problemHint = 'Inconsistency (รูปแบบวันที่ DD/MM/YYYY และช่องทางติดต่อไม่ตรงมาตรฐาน)'
    } else if (mod === 19) {
      // 7. Outdated Year (Timeliness issue)
      submitDate = `2019-05-${String((i % 28) + 1).padStart(2, '0')}`
      problemHint = 'Timeliness (ข้อมูลเก่าข้ามปี พ.ศ./ค.ศ. 2019 ปะปนเข้ามา)'
    }

    rows.push({
      rowNum: i,
      recId,
      empId,
      dept,
      channel,
      ticketCount,
      waitHours,
      csatScore,
      submitDate,
      status,
      problemHint
    })
  }
  return rows
}

const previewDirtyRows = computed(() => generate500DirtyRows().slice(0, 15))

const download500RowsCsv = () => {
  const rows = generate500DirtyRows()
  const headers = [
    'Row_No',
    'Record_ID',
    'Employee_ID',
    'Department',
    'Contact_Channel',
    'Tickets_Per_Month',
    'Wait_Hours',
    'Satisfaction_Score_1to5',
    'Submit_Date',
    'Resolution_Status'
  ]

  const escapeCsv = (val) => {
    const str = val === null || val === undefined ? '' : String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvLines = [
    headers.join(','),
    ...rows.map(r =>
      [
        r.rowNum,
        r.recId,
        r.empId,
        r.dept,
        r.channel,
        r.ticketCount,
        r.waitHours,
        r.csatScore,
        r.submitDate,
        r.status
      ]
        .map(escapeCsv)
        .join(',')
    )
  ]

  // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel & Google Sheets display Thai characters properly
  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'org_survey_dirty_500rows.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================================================
// GAME CENTER DATA (DRAG & DROP, MATCHING, 10-QUESTION QUIZ)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'พนักงานกรอกเวลารอซ่อมเป็น 999 ชั่วโมง หรือกรอกอายุ -15 ปี', type: 'outlier' },
  { id: 2, text: 'ช่องคะแนนความพึงพอใจถูกเว้นว่างไว้ (Blank / Null / NaN)', type: 'missing' },
  { id: 3, text: 'แผนกเดียวกันแต่พิมพ์ "IT", "  it support ", และ "ฝ่ายไอที" ปนกัน', type: 'inconsistent' },
  { id: 4, text: 'ผู้ตอบกดปุ่ม Submit ซ้ำรัวๆ ทำให้เกิดแถวข้อมูลเดียวกันซ้ำ 3 บรรทัด', type: 'duplicate' },
  { id: 5, text: 'กรอกวันที่แบบ 2026-11-05 ปนกับ 05/11/2026 ในคอลัมน์เดียวกัน', type: 'inconsistent' },
  { id: 6, text: 'ระบบเซนเซอร์เน็ตหลุดชั่วคราว ทำให้ค่าอุณหภูมิในตารางขาดหายไป 12 แถว', type: 'missing' }
]

const dragZonesData = [
  {
    id: 'missing',
    title: 'Missing Values (ข้อมูลสูญหาย / ความไม่ครบถ้วน)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากปัญหาข้อมูลแหว่งหาย / ช่องว่าง มาวางที่นี่'
  },
  {
    id: 'outlier',
    title: 'Outliers & Inaccuracy (ค่าผิดปกติสุดโต่ง / ไม่ถูกต้อง)',
    wrapperClass: 'border-rose-400/50 hover:bg-black/40',
    titleClass: 'text-rose-300 border-rose-400/30',
    itemBgClass: 'bg-rose-600/50 border-rose-400',
    emptyTextClass: 'text-rose-200/50',
    emptyText: 'ลากปัญหาตัวเลขโดดผิดปกติหรือเป็นไปไม่ได้จริงมาวางที่นี่'
  },
  {
    id: 'inconsistent',
    title: 'Inconsistency (รูปแบบไม่สอดคล้องกัน)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากปัญหาการสะกดคำหรือฟอร์แมตไม่ตรงกันมาวางที่นี่'
  },
  {
    id: 'duplicate',
    title: 'Duplicates (ข้อมูลซ้ำซ้อน)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากปัญหาข้อมูลเบิ้ลหรือแถวซ้ำซ้อนมาวางที่นี่'
  }
]

const matchLeftTerms = [
  { id: 'l1', text: '1. ฟังก์ชัน =TRIM(ข้อความ)', match: 'r1' },
  { id: 'l2', text: '2. การแทนค่าว่างด้วย Median (มัธยฐาน)', match: 'r2' },
  { id: 'l3', text: '3. เครื่องมือ Remove Duplicates', match: 'r3' },
  { id: 'l4', text: '4. การใช้ IQR / Box Plot หรือ Z-Score', match: 'r4' },
  { id: 'l5', text: '5. กระบวนการ Data Wrangling (Data Munging)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ลบช่องว่าง (Spacebar) ส่วนเกินที่ติดมาข้างหน้าและข้างหลังข้อความออกโดยอัตโนมัติ' },
  { id: 'r2', text: 'การเติมข้อมูลตัวเลขที่หายไป (Imputation) โดยทนทานต่อค่าสุดโต่ง (Outliers) ได้ดีกว่าค่าเฉลี่ย' },
  { id: 'r3', text: 'ตรวจจับและลบแถวข้อมูลที่มีการบันทึกซ้ำซ้อนกันออกให้เหลือเพียงรายการเดียว' },
  { id: 'r4', text: 'วิธีการทางสถิติสำหรับตรวจจับค่าผิดปกติ (Outliers) ที่กระโดดออกนอกกลุ่มข้อมูลส่วนใหญ่' },
  { id: 'r5', text: 'กระบวนการแปรสภาพ จัดโครงสร้าง และทำความสะอาดข้อมูลดิบ (Raw Data) ให้พร้อมนำไปวิเคราะห์ต่อ' }
]

const quizQuestions = [
  {
    id: 1,
    question: "ตามหลักการจากบทความ DataTH กระบวนการ 'Data Wrangling' (หรือ Data Munging) หมายถึงข้อใด?",
    options: [
      { id: 'a', text: "การลบฐานข้อมูลทั้งหมดทิ้งเพื่อประหยัดพื้นที่เซิร์ฟเวอร์", isCorrect: false },
      { id: 'b', text: "กระบวนการแปรสภาพ จัดโครงสร้าง และทำความสะอาดข้อมูลดิบ (Raw/Dirty Data) ให้อยู่ในรูปแบบที่พร้อมนำไปวิเคราะห์หรือสร้างโมเดล", isCorrect: true },
      { id: 'c', text: "การออกแบบโลโก้บริษัทด้วยโปรแกรมกราฟิก", isCorrect: false },
      { id: 'd', text: "การติดตั้งสายแลนและซ่อมบำรุงฮาร์ดแวร์ในห้องเซิร์ฟเวอร์", isCorrect: false }
    ],
    explanation: "Data Wrangling คือการนำข้อมูลดิบที่กระจัดกระจาย ไม่เป็นระเบียบ หรือมีข้อผิดพลาด มาจัดโครงสร้างและทำความสะอาด (Data Cleaning) ให้พร้อมใช้งานจริง"
  },
  {
    id: 2,
    question: "เหตุใดขั้นตอน Data Wrangling และ Data Cleansing จึงมักใช้เวลาคิดเป็น 60% - 80% ของเวลาทำงานทั้งหมดของ Data Analyst?",
    options: [
      { id: 'a', text: "เพราะข้อมูลดิบจากโลกจริงมักมีช่องว่าง พิมพ์ผิด รูปแบบไม่ตรงกัน และหากไม่คลีนก่อน ผลการวิเคราะห์จะผิดเพี้ยน (Garbage In, Garbage Out)", isCorrect: true },
      { id: 'b', text: "เพราะคอมพิวเตอร์ไม่สามารถบวกเลขได้เอง", isCorrect: false },
      { id: 'c', text: "เพราะกฎหมายบังคับให้ต้องพิมพ์ข้อมูลใหม่ด้วยมือทุกบรรทัด", isCorrect: false },
      { id: 'd', text: "เพราะโปรแกรม Google Sheets อนุญาตให้เปิดไฟล์ได้วันละ 10 นาที", isCorrect: false }
    ],
    explanation: "ตามกฎ Garbage In, Garbage Out (GIGO) หากนำข้อมูลขยะเข้าสู่วิเคราะห์ ต่อให้ใช้กราฟหรือ AI ดีเพียงใด ผลลัพธ์ที่ได้ก็จะผิดพลาดและนำไปสู่การตัดสินใจทางธุรกิจที่ผิด"
  },
  {
    id: 3,
    question: "หากพบว่าในคอลัมน์ 'เวลารอคอยรับบริการ (ชั่วโมง)' มีผู้ตอบกรอกค่า 999 ชั่วโมง ปะปนอยู่กับข้อมูลส่วนใหญ่ที่อยู่ระหว่าง 0.5 - 3.0 ชั่วโมง ปัญหานี้ส่งผลเสียต่อมิติคุณภาพข้อมูลใด และเรียกว่าอะไร?",
    options: [
      { id: 'a', text: "กระทบต่อ Accuracy (ความถูกต้อง) และเรียกว่าค่าผิดปกติสุดโต่ง (Outlier)", isCorrect: true },
      { id: 'b', text: "กระทบต่อ Timeliness และเรียกว่า Primary Key", isCorrect: false },
      { id: 'c', text: "กระทบต่อ Completeness และเรียกว่า Null Value", isCorrect: false },
      { id: 'd', text: "ไม่ส่งผลเสียใดๆ ต่อค่าเฉลี่ย (AVERAGE)", isCorrect: false }
    ],
    explanation: "ค่า 999 ชั่วโมงเป็นค่าที่กระโดดออกจากกลุ่มอย่างผิดปกติ (Outlier) จากการพิมพ์ผิด ซึ่งกระทบต่อมิติความถูกต้อง (Accuracy) และดึงค่าเฉลี่ย (Mean) ให้สูงเกินจริง"
  },
  {
    id: 4,
    question: "ในชุดข้อมูลที่พบว่ามีค่าสุดโต่ง (Outliers) ปะปนอยู่ หากต้องการเติมค่าว่าง (Missing Values Imputation) ในคอลัมน์ตัวเลข ควรเลือกใช้ค่าทางสถิติใดจึงจะไม่ถูกดึงให้เพี้ยน?",
    options: [
      { id: 'a', text: "ค่าสูงสุด (MAX)", isCorrect: false },
      { id: 'b', text: "ค่ามัธยฐาน (Median - ค่ากลางเมื่อเรียงลำดับข้อมูล)", isCorrect: true },
      { id: 'c', text: "ผลรวมทั้งหมด (SUM)", isCorrect: false },
      { id: 'd', text: "ค่าติดลบเสมอ", isCorrect: false }
    ],
    explanation: "มัธยฐาน (Median) คือค่าที่อยู่ตรงกลางเมื่อเรียงข้อมูลจากน้อยไปมาก จึงไม่ถูกค่าสุดโต่ง (Outliers) ดึงให้เบ้เหมือนค่าเฉลี่ยเลขคณิต (Mean)"
  },
  {
    id: 5,
    question: "หากคอลัมน์ 'ชื่อแผนก' เป็นข้อมูลเชิงคุณภาพ (Categorical Data) และมีข้อมูลว่างหายไปบางแถว วิธี Imputation (การแทนค่าว่าง) ที่เหมาะสมคือข้อใด?",
    options: [
      { id: 'a', text: "นำชื่อแผนกมาคูณกันด้วยสูตรคณิตศาสตร์", isCorrect: false },
      { id: 'b', text: "แทนที่ด้วยค่าฐานนิยม (Mode - หมวดหมู่ที่พบมากที่สุด) หรือกำหนดหมวดหมู่กลาง เช่น 'ไม่ระบุ'", isCorrect: true },
      { id: 'c', text: "ใส่ตัวเลข 9999 ลงไปแทนชื่อแผนก", isCorrect: false },
      { id: 'd', text: "ลบคอลัมน์อื่นๆ ทิ้งทั้งหมด", isCorrect: false }
    ],
    explanation: "สำหรับข้อมูลข้อความหรือหมวดหมู่ เราไม่สามารถคำนวณค่าเฉลี่ยได้ จึงนิยมใช้ฐานนิยม (Mode) หรือใส่ค่าคงที่ที่สื่อความหมายชัดเจนว่า 'ไม่ระบุ (Unknown)'"
  },
  {
    id: 6,
    question: "เมื่อใดที่เราควรเลือกวิธี 'ลบคอลัมน์ทิ้งทั้งคอลัมน์ (Drop Column)' ในการจัดการกับ Missing Values?",
    options: [
      { id: 'a', text: "เมื่อมีข้อมูลว่างหายไปเพียง 1 ช่องจาก 500 แถว", isCorrect: false },
      { id: 'b', text: "เมื่อคอลัมน์นั้นมีข้อมูลว่างหายไปเป็นสัดส่วนสูงมาก (เช่น มากกว่า 60% - 80%) และไม่ใช่ตัวแปรหลักในการวิเคราะห์", isCorrect: true },
      { id: 'c', text: "เมื่อคอลัมน์นั้นมีข้อมูลครบถ้วน 100%", isCorrect: false },
      { id: 'd', text: "เมื่อต้องการเปลี่ยนสีตารางให้สวยงาม", isCorrect: false }
    ],
    explanation: "หากคอลัมน์ใดมีข้อมูลแหว่งหายเกินกว่า 60-80% การพยายามเดาหรือเติมค่า (Impute) จะสร้างข้อมูลเทียมมากเกินไป จึงควรพิจารณาตัดคอลัมน์นั้นออกหากไม่ใช่ตัวแปรสำคัญ"
  },
  {
    id: 7,
    question: "ในคอลัมน์ Department พบข้อความว่า '  IT Support ' (มีเคาะวรรคข้างหน้า 2 ครั้ง และข้างหลัง 1 ครั้ง) จนทำให้โปรแกรมมองว่าเป็นคนละแผนกกับ 'IT Support' ควรใช้สูตรใดใน Google Sheets แก้ไข?",
    options: [
      { id: 'a', text: "=SUM()", isCorrect: false },
      { id: 'b', text: "=TRIM()", isCorrect: true },
      { id: 'c', text: "=RAND()", isCorrect: false },
      { id: 'd', text: "=NOW()", isCorrect: false }
    ],
    explanation: "ฟังก์ชัน =TRIM(text) จะช่วยตัดช่องว่าง (Leading & Trailing Spaces) ที่เกินมาด้านหน้าและด้านหลังข้อความออกทั้งหมด"
  },
  {
    id: 8,
    question: "วิธีการทางสถิติใดที่นิยมใช้กำหนดขอบเขตบนและขอบเขตล่าง เพื่อคัดกรองค่าผิดปกติ (Outliers) โดยใช้ค่าควอไทล์ที่ 1 (Q1) และควอไทล์ที่ 3 (Q3)?",
    options: [
      { id: 'a', text: "วิธี IQR (Interquartile Range: ขอบเขต Q1 - 1.5*IQR และ Q3 + 1.5*IQR)", isCorrect: true },
      { id: 'b', text: "การเรียงตัวอักษร ก-ฮ", isCorrect: false },
      { id: 'c', text: "การนับจำนวนตัวอักษรด้วย =LEN()", isCorrect: false },
      { id: 'd', text: "การเปลี่ยนสีพื้นหลังตาราง", isCorrect: false }
    ],
    explanation: "เกณฑ์ 1.5 * IQR (โดย IQR = Q3 - Q1) เป็นเกณฑ์มาตรฐานสากลที่ใช้ในแผนภาพกล่อง (Box Plot) เพื่อระบุว่าค่าใดที่ต่ำกว่า Q1 - 1.5(IQR) หรือสูงกว่า Q3 + 1.5(IQR) จัดเป็น Outlier"
  },
  {
    id: 9,
    question: "ปัญหาที่คอลัมน์ Submit_Date มีทั้งรูปแบบ '2026-11-05' และ '05/11/2026' ปะปนกัน จัดเป็นความบกพร่องของมิติคุณภาพข้อมูลข้อใด?",
    options: [
      { id: 'a', text: "Consistency (ความสอดคล้องของรูปแบบข้อมูล)", isCorrect: true },
      { id: 'b', text: "Uniqueness (ความเป็นเอกลักษณ์)", isCorrect: false },
      { id: 'c', text: "Completeness (ความครบถ้วน)", isCorrect: false },
      { id: 'd', text: "Hardware Failure (อุปกรณ์พัง)", isCorrect: false }
    ],
    explanation: "Consistency คือความสอดคล้องกันของรูปแบบและมาตรฐานการบันทึกข้อมูล การใช้วันที่คนละรูปแบบจะทำให้เรียงลำดับหรือกรองข้อมูลตามเดือนผิดพลาด"
  },
  {
    id: 10,
    question: "ในการทำเวิร์กช็อปทำความสะอาดชุดข้อมูลบน Google Sheets ขั้นตอนใดถือเป็นหลักปฏิบัติที่ปลอดภัยที่สุดก่อนเริ่มลบหรือแก้ไขข้อมูล?",
    options: [
      { id: 'a', text: "สำรองข้อมูลดิบไว้ในแท็บ 'Raw_Data' เสมอ แล้วคัดลอกออกมาทำในแท็บ 'Cleaned_Data' เพื่อป้องกันข้อมูลต้นฉบับสูญหาย", isCorrect: true },
      { id: 'b', text: "ลบข้อมูลต้นฉบับทิ้งทันทีโดยไม่ต้องตรวจสอบ", isCorrect: false },
      { id: 'c', text: "ผสานเซลล์ (Merge Cells) ทุกคอลัมน์เข้าด้วยกัน", isCorrect: false },
      { id: 'd', text: "สุ่มพิมพ์ตัวเลขใหม่ทับลงไปในทุกแถว", isCorrect: false }
    ],
    explanation: "กฎเหล็กของ Data Analyst คือห้ามแก้ไขทับไฟล์ Raw Data ต้นฉบับโดยตรง ต้องสำรองแท็บ Raw_Data ไว้เสมอ เพื่อให้สามารถตรวจสอบย้อนกลับ (Audit Trail) ได้เมื่อเกิดข้อผิดพลาด"
  }
]
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.5s_ease-out]">

    <!-- Hero Banner -->
    <div
      class="bg-gradient-to-br from-sky-700 via-cyan-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div class="absolute right-10 top-8 opacity-15 pointer-events-none hidden lg:block">
        <Wand2 class="w-48 h-48 text-white" />
      </div>

      <div class="relative z-10 max-w-4xl space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-cyan-200 text-xs font-black backdrop-blur-xs border border-white/20">
            <Sparkles class="w-3.5 h-3.5" />
            <span>สัปดาห์ที่ 3 • Phase 1: Data Analysis & Preparation</span>
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/30">
            <span>สืบเนื่องจากแบบสอบถามสัปดาห์ที่ 2</span>
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          การตรวจสอบคุณภาพข้อมูล การจัดระเบียบ และการทำความสะอาดข้อมูล (Data Quality, Data Wrangling & Cleansing)
        </h1>

        <p class="text-xs sm:text-sm text-sky-100/95 font-medium leading-relaxed">
          หลังจากที่เราออกแบบแบบสอบถาม <strong>Google Forms</strong> เก็บข้อมูลพัฒนาองค์กรในสัปดาห์ที่ 2 แล้ว
          เมื่อเปิดดูตารางผลลัพธ์จริง เราจะพบ <strong>"ข้อมูลขยะ (Dirty Data)"</strong> ปะปนอยู่มากมาย!
          สัปดาห์นี้เราจะเรียนรู้ทั้ง <strong>การตรวจวินิจฉัยสุขภาพข้อมูล 5 มิติ (Data Quality)</strong> ควบคู่กับ
          <strong>กระบวนการแปรสภาพและคลีนข้อมูล (Data Wrangling & Cleansing)</strong>
          พร้อมภารกิจประจำสัปดาห์: <strong>เลือก 1 โปรเจกต์จาก 11 หัวข้อ แล้วคลีนชุดข้อมูล 40
            แถวให้ถูกต้องและเป็นมาตรฐาน!</strong>
        </p>

        <div class="pt-2 flex flex-wrap gap-2 text-xs font-bold">
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-cyan-300" />
            5 Dimensions of Data Quality
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Wrench class="w-4 h-4 text-amber-300" />
            Data Wrangling Pipeline (DataTH)
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Filter class="w-4 h-4 text-emerald-300" />
            Missing Values & Outliers
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <FileSpreadsheet class="w-4 h-4 text-purple-300" />
            11 Projects Cleaning Lab (40 Rows)
          </span>
        </div>
      </div>
    </div>

    <!-- Check-in System Bar -->
    <CheckInSystem :course-id="currentCourseId" :week="currentWeek" />

    <!-- Bridge from Week 2 Banner (Garbage In, Garbage Out Case Study) -->
    <div
      class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white shadow-md relative overflow-hidden border border-sky-800/60">
      <div class="relative z-10 max-w-4xl space-y-3">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-400/30">
          <AlertTriangle class="w-3.5 h-3.5 text-rose-400" /> ร้อยเรียงจากสัปดาห์ที่ 2: ทำไมห้ามนำข้อมูลจาก Google Forms
          มาคำนวณทันที?
        </div>
        <h3 class="text-xl sm:text-2xl font-bold leading-tight">
          วิกฤต "Garbage In, Garbage Out (GIGO)" เมื่อตัวเลขผิดแค่แถวเดียว ทำรายงานทั้งบริษัทพัง!
        </h3>
        <p class="text-xs sm:text-sm text-sky-100 leading-relaxed">
          สมมติว่าในสัปดาห์ที่ 2 นักศึกษาปล่อยฟอร์มสำรวจ <strong>"ระยะเวลารอคอยการซ่อมคอมพิวเตอร์ของแผนก IT"</strong>
          พนักงาน 499 คนกรอกเวลาตามจริงอยู่ที่ประมาณ <strong>1 - 2 ชั่วโมง</strong> แต่มีพนักงาน 1 คนมือลั่นพิมพ์เลข
          <span class="text-amber-300 font-bold font-mono">999 ชั่วโมง</span> ลงไป และอีกคนพิมพ์ติดลบ
          <span class="text-rose-300 font-bold font-mono">-15 ชั่วโมง</span> แถมบางคนพิมพ์ชื่อแผนกว่า
          <code>"IT"</code>, <code>"ไอที"</code>, <code>"  it support "</code> ปนกันไปหมด<br />
          หากเรานำตารางนี้ไปใส่สูตร <code>=AVERAGE()</code> หรือทำกราฟทันที
          ค่าเฉลี่ยเวลารอซ่อมจะพุ่งกระฉูดและแยกแผนกผิดพลาดทั้งหมด!
          นี่คือเหตุผลที่นักวิเคราะห์ข้อมูลต้องทำ <strong>Data Quality Check & Data Wrangling</strong> ก่อนเสมอ
        </p>
      </div>
    </div>

    <!-- Main Lecture Content -->
    <section class="space-y-8">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-2xs">
            <BookOpen class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียนประจำสัปดาห์ที่ 3</h2>
            <p class="text-sm text-gray-500 mt-0.5">
              จับคู่ "การตรวจวินิจฉัยคุณภาพข้อมูล (Data Quality)" และ "การแปรสภาพ/คลีนข้อมูล (Data Wrangling &
              Cleansing)"
            </p>
          </div>
        </div>
        <button @click="showPdfModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-sky-200 text-sky-700 text-sm font-semibold hover:bg-sky-50 transition shadow-2xs cursor-pointer">
          <Download class="w-4 h-4" /> ดูใบสรุปเนื้อหา PDF
        </button>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 1: DATA WRANGLING CONCEPT & PIPELINE (REFERENCING DATATH)  -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
              หน่วยการเรียนรู้ที่ 1
            </span>
            <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
              <Wand2 class="w-6 h-6 text-sky-600" />
              Data Wrangling คืออะไร? และความสัมพันธ์ระหว่าง Data Quality กับ Data Cleansing
            </h3>
            <p class="text-gray-500 text-sm mt-1">
              ทำความเข้าใจกระบวนการที่ใช้เวลามากถึง 60%–80% ของงานสายข้อมูล (อ้างอิงแนวคิดจาก DataTH)
            </p>
          </div>
          <a href="https://blog.datath.com/data-wrangling/" target="_blank" rel="noopener noreferrer"
            class="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-all">
            <ExternalLink class="w-3.5 h-3.5" />
            <span>บทความอ้างอิง: DataTH (Data Wrangling)</span>
          </a>
        </div>

        <div class="space-y-5 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>Data Wrangling</strong> (หรือที่ในวงการเรียกว่า <em>Data Munging</em> และมักเรียกควบคู่กับ
            <em>Data Cleansing</em>) คือ <strong>กระบวนการแปรสภาพ จัดระเบียบโครงสร้าง และทำความสะอาดข้อมูลดิบ (Raw Data
              /
              Dirty Data)</strong> ที่มาจากแหล่งต่างๆ เช่น Google Forms, CSV, Excel, ฐานข้อมูล หรือ API
            ให้กลายเป็นชุดข้อมูลที่มีคุณภาพสูง (High Data Quality) และพร้อมนำไปวิเคราะห์ทางสถิติหรือสร้าง Dashboard
            ต่อได้ทันที
          </p>

          <!-- Doctor Analogy: Data Quality vs Data Cleansing -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-black text-sky-900 text-base flex items-center gap-2">
                  <Search class="w-5 h-5 text-sky-600" />
                  1. Data Quality (เปรียบเหมือน "หมอตรวจวินิจฉัยโรค")
                </span>
                <span class="px-2 py-0.5 rounded bg-sky-200 text-sky-900 text-[11px] font-bold">ขั้นตรวจจับ</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                คือเกณฑ์มาตรฐานในการ <strong>"ส่องหาจุดเสีย"</strong> ว่าชุดข้อมูลดิบของเรามีความสมบูรณ์หรือไม่
                พังที่คอลัมน์ไหน และพังในมิติใด (ความถูกต้อง, ความครบถ้วน, ความสอดคล้อง, ความเป็นปัจจุบัน,
                ความไม่ซ้ำซ้อน)
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-black text-emerald-900 text-base flex items-center gap-2">
                  <Wrench class="w-5 h-5 text-emerald-600" />
                  2. Data Cleansing / Wrangling (เปรียบเหมือน "หมอผ่าตัดรักษา")
                </span>
                <span
                  class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[11px] font-bold">ขั้นลงมือซ่อม</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                คือการนำเครื่องมือและฟังก์ชันใน <strong>Google Sheets / Excel / Python (Pandas) / SQL</strong>
                มาลงมือซ่อมแซมจุดที่ตรวจพบ เช่น ลบแถวซ้ำ, ตัดช่องว่างส่วนเกิน, แก้ไขค่าสุดโต่ง และเติมข้อมูลที่แหว่งหาย
              </p>
            </div>
          </div>

          <!-- 5 Steps of Data Wrangling Pipeline -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 class="font-bold text-cyan-300 flex items-center gap-2 text-base">
                <Layers class="w-5 h-5 text-cyan-400" />
                5 ขั้นตอนหลักของกระบวนการ Data Wrangling (ตั้งแต่ข้อมูลดิบจนพร้อมวิเคราะห์)
              </h4>
              <span class="text-xs font-mono text-slate-400">60-80% of Analytics Time</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px]">Step
                  1</span>
                <div class="font-bold text-white text-sm">Discovery & Profiling</div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                  สำรวจภาพรวมตาราง นับจำนวนแถว ดูชนิดข้อมูลในแต่ละคอลัมน์ และตรวจหาจุดผิดปกติเบื้องต้น
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">Step
                  2</span>
                <div class="font-bold text-white text-sm">Structuring</div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                  จัดโครงสร้างตารางให้อยู่ในรูป <strong>Tidy Data</strong> (1 คอลัมน์ = 1 ตัวแปร, 1 แถว = 1 รายการ,
                  ห้าม Merge Cells)
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-800/90 border-2 border-emerald-500/60 space-y-1.5">
                <span
                  class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">Step 3
                  (หัวใจหลัก)</span>
                <div class="font-bold text-emerald-300 text-sm">Data Cleaning</div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                  จัดการค่าว่าง (Missing Values), ค่าผิดปกติ (Outliers), รูปแบบที่ไม่ตรงกัน และลบข้อมูลซ้ำซ้อน
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">Step
                  4</span>
                <div class="font-bold text-white text-sm">Enriching</div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                  แปลงรูปแบบข้อมูล หรือสร้างคอลัมน์ใหม่ที่ช่วยวิเคราะห์ง่ายขึ้น (เช่น แปลงเวลาเป็นเกรดความเร็ว)
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">Step
                  5</span>
                <div class="font-bold text-white text-sm">Validating & Publishing</div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                  ตรวจสอบความถูกต้องรอบสุดท้ายว่าไม่มีข้อมูลขยะหลงเหลือ แล้วส่งออกสู่การทำสถิติและกราฟ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 2: 5 DIMENSIONS OF DATA QUALITY PAIRED WITH CLEANSING      -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 2
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <ShieldCheck class="w-6 h-6 text-sky-600" />
            5 มิติคุณภาพข้อมูล (Data Quality) จับคู่กับวิธีทำความสะอาด (Data Cleansing)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            เรียนรู้แบบเห็นภาพชัดเจน: "เมื่อตรวจเจอปัญหาในแต่ละมิติ เราจะซ่อมมันอย่างไรใน Google Sheets / Excel?"
          </p>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-900 text-white font-bold border-b border-slate-800">
              <tr>
                <th class="p-3.5 w-48">มิติคุณภาพข้อมูล (Dimension)</th>
                <th class="p-3.5">อาการของข้อมูลที่พัง (Dirty Symptom)</th>
                <th class="p-3.5">วิธีตรวจจับ (How to Detect)</th>
                <th class="p-3.5">วิธีทำความสะอาด (How to Clean in Sheets)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700 bg-white">
              <!-- 1. Completeness -->
              <tr class="hover:bg-sky-50/40">
                <td class="p-3.5 font-bold text-amber-800 bg-amber-50/40">
                  1. Completeness<br />
                  <span class="text-[11px] font-normal text-amber-700">(ความครบถ้วนสมบูรณ์)</span>
                </td>
                <td class="p-3.5 text-xs">
                  มีช่องว่างแหว่งหาย (<code>Blank</code>, <code>Null</code>, <code>N/A</code>, <code>-</code>)
                  ผู้ตอบข้ามไม่ยอมกรอกคะแนนหรือเวลา
                </td>
                <td class="p-3.5 text-xs font-mono">
                  ใช้ Filter กรองดูค่า <code>(Blanks)</code> หรือใช้สูตร <code>=COUNTBLANK(range)</code>
                </td>
                <td class="p-3.5 text-xs">
                  • ถ้าเป็นตัวเลข: แทนค่าด้วยค่าเฉลี่ย (<code>Mean</code>) หรือมัธยฐาน (<code>Median</code>)<br />
                  • ถ้าเป็นข้อความ: แทนด้วยฐานนิยม (<code>Mode</code>) หรือ <code>"ไม่ระบุ"</code><br />
                  • ถ้าแหว่งทั้งแถว: ลบแถวนั้นทิ้ง (Drop Row)
                </td>
              </tr>

              <!-- 2. Accuracy & Validity -->
              <tr class="hover:bg-sky-50/40">
                <td class="p-3.5 font-bold text-rose-800 bg-rose-50/40">
                  2. Accuracy & Validity<br />
                  <span class="text-[11px] font-normal text-rose-700">(ความถูกต้องตามความจริงและกฎ)</span>
                </td>
                <td class="p-3.5 text-xs">
                  เกิดค่าสุดโต่งที่เป็นไปไม่ได้จริง (<strong>Outliers</strong>) เช่น เวลารอคอย <code>999</code> ชม.,
                  เวลาติดลบ <code>-12.5</code> ชม., หรือคะแนนสเกล 1-5 แต่กรอก <code>55</code>
                </td>
                <td class="p-3.5 text-xs font-mono">
                  ใช้ <code>=MIN()</code>, <code>=MAX()</code>, เรียงลำดับ Sort น้อยไปมาก/มากไปน้อย หรือทำ Box Plot
                  (IQR)
                </td>
                <td class="p-3.5 text-xs">
                  • ตรวจสอบว่าเป็นพิมพ์เบิ้ลหรือไม่ (เช่น <code>55</code> แก้เป็น <code>5</code>)<br />
                  • หากเป็นค่ามั่วชัดเจน (<code>999</code> หรือ <code>-12.5</code>) ให้ลบเป็นช่องว่างแล้วแทนด้วยค่า
                  <code>Median</code> หรือตัดแถวออก
                </td>
              </tr>

              <!-- 3. Consistency -->
              <tr class="hover:bg-sky-50/40">
                <td class="p-3.5 font-bold text-sky-800 bg-sky-50/40">
                  3. Consistency<br />
                  <span class="text-[11px] font-normal text-sky-700">(ความสอดคล้องของรูปแบบ)</span>
                </td>
                <td class="p-3.5 text-xs">
                  ความหมายเดียวกันแต่เขียนคนละแบบ เช่น <code>"IT"</code>, <code>"  it support "</code>,
                  <code>"ไอที"</code> หรือวันที่ <code>2026-11-05</code> ปนกับ <code>05/11/2026</code>
                </td>
                <td class="p-3.5 text-xs font-mono">
                  กด Filter ดูรายการตัวเลือกที่ไม่ซ้ำ (Unique Values) ในหัวคอลัมน์
                </td>
                <td class="p-3.5 text-xs">
                  • ใช้ <code>=TRIM()</code> ลบช่องว่างหน้า-หลัง<br />
                  • ใช้ <code>Find & Replace (Ctrl+H)</code> แปลงชื่อแผนกให้เป็นมาตรฐานเดียวกัน<br />
                  • ตั้งค่า <code>Format &rarr; Number &rarr; Date (YYYY-MM-DD)</code>
                </td>
              </tr>

              <!-- 4. Uniqueness (No Duplicates) -->
              <tr class="hover:bg-sky-50/40">
                <td class="p-3.5 font-bold text-purple-800 bg-purple-50/40">
                  4. Uniqueness / Duplicate<br />
                  <span class="text-[11px] font-normal text-purple-700">(ความไม่ซ้ำซ้อน)</span>
                </td>
                <td class="p-3.5 text-xs">
                  พนักงานคนเดิม (<code>Employee_ID</code> เดียวกัน) กดส่งแบบฟอร์มเบิ้ล 2–3 ครั้งติดกัน
                  ทำให้จำนวนนับเบิ้ลเกินจริง
                </td>
                <td class="p-3.5 text-xs font-mono">
                  ใช้ Conditional Formatting ไฮไลต์ค่าซ้ำ หรือเช็ค <code>=UNIQUE()</code>
                </td>
                <td class="p-3.5 text-xs">
                  ไปที่เมนู <strong>Data &rarr; Data cleanup &rarr; Remove duplicates</strong>
                  โดยติ๊กตรวจสอบตามคอลัมน์รหัสพนักงานและข้อมูลคำตอบ
                </td>
              </tr>

              <!-- 5. Timeliness -->
              <tr class="hover:bg-sky-50/40">
                <td class="p-3.5 font-bold text-emerald-800 bg-emerald-50/40">
                  5. Timeliness<br />
                  <span class="text-[11px] font-normal text-emerald-700">(ความเป็นปัจจุบันทันสมัย)</span>
                </td>
                <td class="p-3.5 text-xs">
                  ต้องการวิเคราะห์ผลสำรวจเดือนพฤศจิกายน <code>2026</code> แต่มีข้อมูลเก่าปี <code>2019</code>
                  หลุดปะปนเข้ามาในตาราง
                </td>
                <td class="p-3.5 text-xs font-mono">
                  กรอง (Filter) คอลัมน์วันที่ <code>Submit_Date</code> ดูช่วงปี พ.ศ./ค.ศ.
                </td>
                <td class="p-3.5 text-xs">
                  คัดกรองเฉพาะข้อมูลที่อยู่ในกรอบเวลาของการวิเคราะห์ (เช่น ปี <code>2026</code>)
                  หรือแก้ไขปีที่พิมพ์ผิดหากตรวจสอบกับลำดับรายการได้ชัดเจน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 3: DEEP DIVE INTO MISSING VALUES & OUTLIERS (DATATH)       -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 3
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Filter class="w-6 h-6 text-sky-600" />
            เจาะลึกการจัดการ Missing Values (ข้อมูลสูญหาย) และ Outliers (ค่าผิดปกติ)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            หลักการตัดสินใจระดับมืออาชีพตามแนวทาง Data Wrangling จาก DataTH: เมื่อไหร่ควรลบ? เมื่อไหร่ควรเติมค่า?
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Missing Values Strategy -->
          <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
            <div class="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <AlertCircle class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="font-black text-amber-950 text-base">แนวทางจัดการ Missing Values (ข้อมูลที่หายไป)</h4>
                  <p class="text-xs text-amber-800">เมื่อเจอช่องว่าง (Null / NaN / Blank) มี 2 ทางเลือกหลัก</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
                <div class="font-bold text-amber-950 text-sm flex items-center justify-between">
                  <span>วิธีที่ 1: การลบทิ้ง (Deletion Strategy)</span>
                  <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">Drop</span>
                </div>
                <ul class="list-disc pl-4 text-slate-600 space-y-1 leading-relaxed">
                  <li>
                    <strong>ลบรายแถว (Drop Rows):</strong> ใช้เมื่อแถวนั้นมีข้อมูลแหว่งหายเกือบทุกคอลัมน์
                    หรือมีแถวที่ว่างเพียงไม่กี่แถวจากข้อมูลชุดใหญ่
                  </li>
                  <li>
                    <strong>ลบรายคอลัมน์ (Drop Column):</strong> ใช้เมื่อคอลัมน์นั้นมีข้อมูลว่างหายไปมากกว่า
                    <strong>60% – 80%</strong> และไม่ใช่ตัวแปรหลักในการตอบโจทย์ธุรกิจ
                  </li>
                </ul>
              </div>

              <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2 shadow-2xs">
                <div class="font-bold text-emerald-950 text-sm flex items-center justify-between">
                  <span>วิธีที่ 2: การแทนที่ค่าที่หายไป (Imputation Strategy)</span>
                  <span
                    class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">แนะนำสำหรับใบงานโปรเจกต์
                    40 แถว</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  แทนที่จะลบแถวทิ้งจนเสียข้อมูลคอลัมน์อื่น เราสามารถเติมค่าตัวแทนทางสถิติลงไปแทนช่องว่างได้ดังนี้:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div class="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
                    <span class="font-bold text-sky-900 block">1. Mean (ค่าเฉลี่ย)</span>
                    <span class="text-[11px] text-slate-600">ใช้กับตัวเลขที่กระจายตัวปกติ ไม่มีค่าโดด
                      (<code>=AVERAGE</code>)</span>
                  </div>
                  <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span class="font-bold text-emerald-900 block">2. Median (มัธยฐาน)</span>
                    <span class="text-[11px] text-slate-600">ใช้กับตัวเลขที่มี <strong>Outliers</strong> ปนอยู่
                      (<code>=MEDIAN</code>)</span>
                  </div>
                  <div class="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                    <span class="font-bold text-purple-900 block">3. Mode (ฐานนิยม)</span>
                    <span class="text-[11px] text-slate-600">ใช้กับข้อมูลหมวดหมู่/ข้อความ หรือสเกลความพึงพอใจ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Outliers Detection & Treatment -->
          <div class="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
            <div class="flex items-center justify-between border-b border-rose-200/80 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <AlertOctagon class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="font-black text-rose-950 text-base">แนวทางตรวจจับและจัดการ Outliers (ค่าผิดปกติสุดโต่ง)
                  </h4>
                  <p class="text-xs text-rose-800">ค่าที่โดดสูงหรือต่ำกว่ากลุ่มข้อมูลส่วนใหญ่อย่างผิดสังเกต</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2 shadow-2xs">
                <div class="font-bold text-rose-950 text-sm">2 วิธีมาตรฐานทางสถิติในการตรวจจับ Outliers:</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span class="font-bold text-slate-900 block">1. วิธี IQR (Interquartile Range)</span>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      คำนวณ <code>IQR = Q3 - Q1</code> ค่าใดที่ต่ำกว่า <code>Q1 - 1.5(IQR)</code> หรือสูงกว่า
                      <code>Q3 + 1.5(IQR)</code> จะถือเป็น Outlier ทันที
                    </p>
                  </div>
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span class="font-bold text-slate-900 block">2. วิธี Z-Score & Domain Rule</span>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      วัดว่าข้อมูลห่างจากค่าเฉลี่ยเกิน <code>3 SD</code> หรือไม่ หรือเช็คตามกฎความจริง (เช่น
                      เวลารอซ่อมห้าม
                      <code>&lt; 0</code> และห้ามเกิน <code>24 ชม.</code>)
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1.5 shadow-2xs">
                <div class="font-bold text-rose-950 text-sm">3 วิธีจัดการเมื่อตรวจพบ Outliers:</div>
                <ul class="list-disc pl-4 text-slate-600 space-y-1 leading-relaxed">
                  <li>
                    <strong>1. แก้ไขหากเกิดจากพิมพ์เบิ้ลชัดเจน (Fix Typo):</strong> เช่น สเกลความพึงพอใจ 1–5 แต่กรอก
                    <code>55</code> (นิ้วกดเลข 5 ซ้ำ) ให้แก้กลับเป็น <code>5</code>
                  </li>
                  <li>
                    <strong>2. เปลี่ยนเป็นค่าว่างแล้วทำ Imputation:</strong> หากกรอกเวลารอซ่อมเป็น <code>999</code> หรือ
                    <code>-12.5</code> ซึ่งไม่รู้ค่าจริง ให้ลบเลขนั้นแล้วแทนที่ด้วยค่ามัธยฐาน (<code>Median</code>)
                  </li>
                  <li>
                    <strong>3. การจำกัดเพดานค่า (Capping / Winsorizing):</strong> กำหนดขอบเขตสูงสุด-ต่ำสุดที่ยอมรับได้
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Google Sheets Formula Cheat Sheet for Data Cleansing -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-white/15 pb-3">
            <h4 class="font-bold text-emerald-300 text-base flex items-center gap-2">
              <FileSpreadsheet class="w-5 h-5 text-emerald-400" />
              คัมภีร์สูตรลัดและเครื่องมือ Google Sheets / Excel สำหรับคลีนข้อมูล 40 แถว
            </h4>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-mono">
              Sheets Cleansing Toolkit
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-amber-300 font-bold text-sm">=TRIM(A2)</code>
              <p class="text-slate-300 text-[11px]">ลบช่องว่าง (Space) ที่ติดมาข้างหน้าและข้างหลังข้อความออกทั้งหมด</p>
            </div>
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-cyan-300 font-bold text-sm">Data &rarr; Remove duplicates</code>
              <p class="text-slate-300 text-[11px]">เมนูสำเร็จรูปสำหรับตรวจหาและลบแถวข้อมูลที่ซ้ำกันในคลิกเดียว</p>
            </div>
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-emerald-300 font-bold text-sm">Ctrl + H (Find & Replace)</code>
              <p class="text-slate-300 text-[11px]">ค้นหาคำที่สะกดต่างกัน เช่น <code>"ไอที"</code> แล้วแทนที่ด้วย
                <code>"ฝ่ายไอที (IT)"</code> ทั้งคอลัมน์
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-purple-300 font-bold text-sm">=MEDIAN(G2:G41)</code>
              <p class="text-slate-300 text-[11px]">หาค่ามัธยฐานของคอลัมน์ตัวเลข เพื่อนำไปเติมในช่องว่าง (Missing Value)
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-rose-300 font-bold text-sm">=IF(OR(G2&lt;0, G2&gt;24), "Outlier", "OK")</code>
              <p class="text-slate-300 text-[11px]">สร้างคอลัมน์ช่วยตรวจจับว่าแถวไหนมีเวลารอคอยติดลบหรือเกิน 24 ชั่วโมง
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-1">
              <code class="text-sky-300 font-bold text-sm">=COUNTBLANK(A2:J41)</code>
              <p class="text-slate-300 text-[11px]">ตรวจสอบว่ายังมีช่องว่างหลงเหลืออยู่ในตารางอีกกี่ช่อง
                (คลีนเสร็จต้องได้ 0)</p>
            </div>
          </div>
        </div>
      </div>



      <!-- ================================================================= -->
      <!-- MODULE 5: STEP-BY-STEP VERTICAL WALKTHROUGH (1. -> 2. -> 3. ...)  -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 pb-5">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 bg-indigo-100 text-indigo-800 font-black text-xs rounded-full uppercase tracking-wider">
                หน่วยการเรียนรู้ที่ 4 • Step-by-Step Cleansing Guide
              </span>
              <span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                สาธิตทีละขั้นตอน 1 &rarr; 6
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 pt-1">
              <ShoppingBag class="w-6 h-6 text-indigo-600" />
              สาธิตขั้นตอนการคลีนข้อมูลตะกร้าสินค้า (<code>bread / cola / sprite</code>) เรียงตามลำดับ 1 ถึง 6
            </h3>
            <p class="text-slate-600 text-xs sm:text-sm">
              คู่มือพาทำทีละสเต็ปตั้งแต่ข้อมูลดิบที่กองรวมกันในเซลล์เดียว ไปจนถึงข้อมูลที่สะอาดพร้อมวิเคราะห์
              พร้อมอธิบายครบว่าแต่ละขั้น <strong>ทำยังไง, ทำไมต้องทำ, ได้ประโยชน์อะไร
                และถ้าไม่ทำจะเกิดผลเสียอย่างไร</strong>
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button @click="downloadDemoExcel" type="button"
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
              <Download class="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์สาธิต (.xlsx)</span>
            </button>
          </div>
        </div>

        <!-- STARTING POINT: RAW DIRTY TABLE -->
        <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 font-mono font-bold text-xs">
                จุดเริ่มต้น (Raw Data)
              </span>
              <h4 class="font-bold text-white text-sm sm:text-base">
                หน้าตาตารางข้อมูลดิบก่อนเริ่มคลีน (สังเกตปัญหาที่ซ่อนอยู่ในตารางนี้)
              </h4>
            </div>
            <span class="text-xs font-mono text-slate-400">Before Data Cleansing</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-800/90 text-slate-300 border-b border-slate-700 font-sans">
                <tr>
                  <th class="p-3">Row</th>
                  <th class="p-3">Order_ID</th>
                  <th class="p-3">Customer</th>
                  <th class="p-3 text-rose-300">Basket_Items (สินค้าในตะกร้า)</th>
                  <th class="p-3">Total_Price</th>
                  <th class="p-3 font-sans">ปัญหาที่พบในแถวนี้</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td class="p-3 text-slate-400">2</td>
                  <td class="p-3 font-bold text-sky-400">ORD-101</td>
                  <td class="p-3 font-sans">คุณสมชาย</td>
                  <td class="p-3 text-amber-300 font-bold">"bread / cola / sprite"</td>
                  <td class="p-3">85</td>
                  <td class="p-3 font-sans text-rose-300">สินค้า 3 ชิ้นอัดรวมกันในช่องเดียว +
                    มีเคาะวรรคหน้า-หลังเครื่องหมาย /</td>
                </tr>
                <tr>
                  <td class="p-3 text-slate-400">3</td>
                  <td class="p-3 font-bold text-sky-400">ORD-102</td>
                  <td class="p-3 font-sans">คุณสายใจ</td>
                  <td class="p-3 text-amber-300 font-bold">" milk / BREAD / Cola "</td>
                  <td class="p-3">95</td>
                  <td class="p-3 font-sans text-rose-300">มีวรรคเกินหน้า-หลังสุด + ตัวพิมพ์ใหญ่ BREAD / Cola
                    ไม่ตรงกับแถวอื่น</td>
                </tr>
                <tr>
                  <td class="p-3 text-slate-400">4</td>
                  <td class="p-3 font-bold text-sky-400">ORD-102</td>
                  <td class="p-3 font-sans">คุณสายใจ</td>
                  <td class="p-3 text-amber-300 font-bold">" milk / BREAD / Cola "</td>
                  <td class="p-3">95</td>
                  <td class="p-3 font-sans text-purple-300">ข้อมูลซ้ำซ้อน (Duplicate) กับแถวที่ 3 ทุกประการ</td>
                </tr>
                <tr>
                  <td class="p-3 text-slate-400">5</td>
                  <td class="p-3 font-bold text-sky-400">ORD-103</td>
                  <td class="p-3 font-sans">คุณวิชัย</td>
                  <td class="p-3 text-amber-300 font-bold">"sprite / chips / bread "</td>
                  <td class="p-3 text-rose-400 font-bold">99999</td>
                  <td class="p-3 font-sans text-rose-300">ยอดเงิน 99,999 บาท เป็นค่าผิดปกติสุดโต่ง (Outlier
                    พิมพ์เลขเกิน)</td>
                </tr>
                <tr>
                  <td class="p-3 text-slate-400">6</td>
                  <td class="p-3 font-bold text-sky-400">ORD-104</td>
                  <td class="p-3 font-sans">คุณนภา</td>
                  <td class="p-3 text-amber-300 font-bold">"COLA / water"</td>
                  <td class="p-3 text-amber-400 font-bold">[ว่างเปล่า / NULL]</td>
                  <td class="p-3 font-sans text-amber-300">ข้อมูลยอดเงินแหว่งหาย (Missing Value)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- VERTICAL STEP-BY-STEP LIST (1 to 6) -->
        <div class="space-y-6">

          <!-- ============================================================= -->
          <!-- STEP 1: DUPLICATE RAW SHEET                                   -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-slate-200 bg-slate-50/60 overflow-hidden shadow-2xs">
            <div class="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 1: สำรองข้อมูลต้นฉบับ (Duplicate แท็บชีตเป็น Cleaned_Data)
                  </h4>
                  <p class="text-xs text-slate-300">กฎเหล็กข้อแรกสุดก่อนแตะต้องข้อมูลใดๆ ในตาราง</p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-mono font-bold">
                Step 1: Backup Raw Data
              </span>
            </div>

            <div class="p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    คลิกขวาที่ชื่อแท็บชีตด้านล่างสุดของจอ Google Sheets เลือก <strong>Duplicate (ทำสำเนา)</strong>
                    แล้วตั้งชื่อแท็บเก่าว่า <code>Raw_Data</code> และแท็บใหม่ว่า <code>Cleaned_Data</code>
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพราะการคลีนข้อมูลมีการลบแถว แยกคอลัมน์ และแทนที่ค่าเดิม
                    หากทำทับไฟล์ต้นฉบับจะไม่มีข้อมูลดิบไว้ตรวจสอบย้อนกลับ
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    มีหลักฐานต้นฉบับ (Audit Trail) เสมอ และสามารถเปรียบเทียบผลลัพธ์ <strong>Before vs After</strong>
                    ได้ชัดเจน
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    หากเผลอลบข้อมูลผิดหรือแยกคอลัมน์ทับคอลัมน์ข้างๆ ข้อมูลจริงจะสูญหายถาวรและแก้ไขกลับไม่ได้!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 2: SPLIT BASKET ITEMS                                    -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-indigo-200 bg-indigo-50/30 overflow-hidden shadow-2xs">
            <div class="bg-indigo-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 2: แยกข้อความตะกร้าสินค้าออกจากกัน (Split Text to Columns / <code>=SPLIT</code>)
                  </h4>
                  <p class="text-xs text-indigo-200">
                    แปลงข้อมูลที่อัดรวมกัน <code>"bread / cola / sprite"</code> ให้แยกออกเป็นคอลัมน์
                    <code>Item_1</code>, <code>Item_2</code>, <code>Item_3</code>
                  </p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-mono font-bold">
                Step 2: Split Columns
              </span>
            </div>

            <div class="p-5 space-y-4">
              <!-- Visual Before -> After for Step 2 -->
              <div class="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-3">
                <div class="text-slate-400 font-sans text-xs font-bold">
                  ตัวอย่างการเปลี่ยนแปลงของข้อมูลในขั้นตอนที่ 2:
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                  <div class="lg:col-span-5 p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 space-y-1">
                    <span class="text-[10px] text-rose-300 font-sans uppercase font-bold block">ก่อนแยก (1
                      เซลล์รวมกัน):</span>
                    <div class="text-amber-300 font-bold text-sm">"bread / cola / sprite"</div>
                  </div>
                  <div class="lg:col-span-1 flex justify-center text-cyan-400 font-bold text-lg">
                    &rarr;
                  </div>
                  <div class="lg:col-span-6 grid grid-cols-3 gap-2">
                    <div class="p-2.5 rounded-lg bg-slate-800 border border-amber-400/50">
                      <span class="text-[10px] text-slate-400 font-sans block">Item_1</span>
                      <span class="text-white font-bold">"bread "</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-slate-800 border border-amber-400/50">
                      <span class="text-[10px] text-slate-400 font-sans block">Item_2</span>
                      <span class="text-white font-bold">" cola "</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-slate-800 border border-amber-400/50">
                      <span class="text-[10px] text-slate-400 font-sans block">Item_3</span>
                      <span class="text-white font-bold">" sprite"</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4 Explanation Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    • <strong>วิธีคลิกเมนู:</strong> คลุมคอลัมน์ตะกร้าสินค้า &rarr; เมนู <code>Data (ข้อมูล)</code>
                    &rarr; <code>Split text to columns</code> &rarr; เลือกตัวคั่น <code>Custom</code> แล้วพิมพ์
                    <code>/</code><br />
                    • <strong>วิธีเขียนสูตร:</strong> พิมพ์ <code>=SPLIT(C2, "/")</code> ในช่องว่างด้านขวา
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพราะตามกฎโครงสร้างตารางที่ดี (Tidy Data / 1NF) <strong>1 เซลล์ต้องเก็บข้อมูลเพียง 1
                      ค่าเท่านั้น</strong> การเอาสินค้า 3 ชิ้นมายัดไว้ในช่องเดียวกันทำให้โปรแกรมวิเคราะห์แยกชิ้นไม่ได้
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    สินค้าแต่ละชิ้นแยกออกมาอยู่คนละคอลัมน์อย่างชัดเจน ทำให้เราสามารถนับความถี่ได้ว่าสินค้าชิ้นที่ 1, 2,
                    3 คืออะไรบ้าง
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    Google Sheets และ Power BI จะมองว่า <code>"bread / cola / sprite"</code> คือชื่อของสินค้า 1 ชิ้น!
                    เวลาค้นหาว่ามีคนซื้อ <code>cola</code> กี่คน จะได้คำตอบเป็น <code>0</code> ทันที
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 3: TRIM WHITESPACE                                       -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-sky-200 bg-sky-50/30 overflow-hidden shadow-2xs">
            <div class="bg-sky-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-sky-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 3: ตัดช่องว่างส่วนเกินหน้า-หลังข้อความ (Trim Whitespace / <code>=TRIM</code>)
                  </h4>
                  <p class="text-xs text-sky-200">
                    กำจัดเคาะวรรค (Spacebar) ที่มองไม่เห็นแต่ติดมากับคำหลังแยกเครื่องหมาย <code>/</code>
                  </p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-200 border border-sky-300/30 text-xs font-mono font-bold">
                Step 3: Trim Spaces
              </span>
            </div>

            <div class="p-5 space-y-4">
              <!-- Visual Before -> After for Step 3 -->
              <div class="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-3">
                <div class="text-slate-400 font-sans text-xs font-bold">
                  ตัวอย่างการเปลี่ยนแปลงของข้อมูลในขั้นตอนที่ 3 (สังเกตช่องว่างที่หายไป):
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                  <div class="lg:col-span-5 grid grid-cols-3 gap-2">
                    <div class="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40">
                      <span class="text-[10px] text-rose-300 font-sans block">ก่อน Trim (6 ตัว)</span>
                      <span class="text-amber-300 font-bold">"bread<span class="bg-rose-500 text-white">_</span>"</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40">
                      <span class="text-[10px] text-rose-300 font-sans block">ก่อน Trim (6 ตัว)</span>
                      <span class="text-amber-300 font-bold">"<span class="bg-rose-500 text-white">_</span>cola<span
                          class="bg-rose-500 text-white">_</span>"</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40">
                      <span class="text-[10px] text-rose-300 font-sans block">ก่อน Trim (7 ตัว)</span>
                      <span class="text-amber-300 font-bold">"<span
                          class="bg-rose-500 text-white">_</span>sprite"</span>
                    </div>
                  </div>
                  <div class="lg:col-span-1 flex justify-center text-cyan-400 font-bold text-lg">
                    &rarr;
                  </div>
                  <div class="lg:col-span-6 grid grid-cols-3 gap-2">
                    <div class="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40">
                      <span class="text-[10px] text-emerald-300 font-sans block">หลัง Trim (5 ตัว)</span>
                      <span class="text-emerald-300 font-bold">"bread"</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40">
                      <span class="text-[10px] text-emerald-300 font-sans block">หลัง Trim (4 ตัว)</span>
                      <span class="text-emerald-300 font-bold">"cola"</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40">
                      <span class="text-[10px] text-emerald-300 font-sans block">หลัง Trim (6 ตัว)</span>
                      <span class="text-emerald-300 font-bold">"sprite"</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4 Explanation Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    • <strong>วิธีคลิกเมนู:</strong> คลุมคอลัมน์ที่แยกออกมาทั้งหมด &rarr; เมนู
                    <code>Data (ข้อมูล)</code> &rarr; <code>Data cleanup (การล้างข้อมูล)</code> &rarr;
                    <code>Trim whitespace (ตัดช่องว่าง)</code><br />
                    • <strong>วิธีเขียนสูตร:</strong> ใช้ <code>=TRIM(D2)</code> หรือครอบสูตร
                    <code>=ARRAYFORMULA(TRIM(SPLIT(C2, "/")))</code>
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพราะในข้อความ <code>"bread / cola / sprite"</code> มีการเคาะวรรคหน้าและหลังเครื่องหมาย
                    <code>/</code> พอแยกคำด้วย <code>/</code> เสร็จ ช่องว่างเหล่านั้นจึงยังติดค้างอยู่ที่หัวและท้ายคำ!
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    ข้อความทุกเซลล์จะเหลือเฉพาะตัวอักษรล้วนๆ ไม่มีช่องว่างขยะซ่อนอยู่ ทำให้การค้นหา จับคู่
                    (<code>VLOOKUP</code>) และนับจำนวนแม่นยำ 100%
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    ตาคนเรามองว่า <code>"cola"</code> กับ <code>" cola "</code> เหมือนกัน แต่คอมพิวเตอร์มองว่าเป็น
                    <strong>คนละคำกัน!</strong> เวลาสรุปยอดขายจะได้ <code>cola</code> แยกออกเป็น 2–3
                    บรรทัดโดยไม่รู้สาเหตุ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 4: STANDARDIZE CASE & SPELLING                           -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 overflow-hidden shadow-2xs">
            <div class="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 4: ปรับตัวพิมพ์เล็ก-ใหญ่และคำสะกดให้เป็นมาตรฐานเดียวกัน (Standardize Format)
                  </h4>
                  <p class="text-xs text-emerald-200">
                    รวมคำความหมายเดียวกัน เช่น <code>"BREAD"</code>, <code>"Bread"</code>, <code>"bread"</code>
                    ให้เป็นรูปแบบเดียวกันทั้งตาราง
                  </p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-xs font-mono font-bold">
                Step 4: Consistency
              </span>
            </div>

            <div class="p-5 space-y-4">
              <!-- Visual Before -> After for Step 4 -->
              <div class="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
                <div class="text-slate-400 font-sans text-xs font-bold">
                  ตัวอย่างการเปลี่ยนแปลงของข้อมูลในขั้นตอนที่ 4:
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30">
                    <span class="text-[10px] text-rose-300 font-sans block mb-1">ก่อนปรับมาตรฐาน (ตัวพิมพ์ปนกัน):</span>
                    <span class="text-amber-300">"BREAD"</span>, <span class="text-amber-300">"bread"</span>, <span
                      class="text-amber-300">"Cola"</span>, <span class="text-amber-300">"COLA"</span>
                  </div>
                  <div class="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                    <span class="text-[10px] text-emerald-300 font-sans block mb-1">หลังใช้ =LOWER() หรือ
                      =PROPER():</span>
                    <span class="text-emerald-300 font-bold">"bread"</span> (รวมเป็นคำเดียว), <span
                      class="text-emerald-300 font-bold">"cola"</span> (รวมเป็นคำเดียว)
                  </div>
                </div>
              </div>

              <!-- 4 Explanation Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    • ใช้สูตร <code>=LOWER(D2)</code> เพื่อแปลงเป็นตัวพิมพ์เล็กทั้งหมด (เช่น <code>bread</code>) หรือ
                    <code>=PROPER(D2)</code> (เช่น <code>Bread</code>)<br />
                    • หากสะกดคนละคำ (เช่น <code>"โค้ก"</code> กับ <code>"cola"</code>) ให้กด <code>Ctrl + H</code> (Find
                    & Replace) เพื่อแทนที่คำให้ตรงกัน
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพื่อแก้ปัญหาเรื่อง <strong>Consistency (ความสอดคล้องของรูปแบบ)</strong>
                    เพราะมนุษย์แต่ละคนพิมพ์ตัวเล็ก-ตัวใหญ่หรือใช้คำย่อไม่เหมือนกัน
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    จัดกลุ่มหมวดหมู่ (Grouping / Pivot Table) ได้อย่างสมบูรณ์แบบ ไม่มีชื่อหมวดหมู่หน้าตาแปลกๆ
                    แตกแขนงออกมา
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    กราฟนำเสนอจะแยกแท่งของ <code>BREAD</code>, <code>Bread</code> และ <code>bread</code> ออกจากกัน
                    ทำให้ดูไม่เป็นมืออาชีพและจัดอันดับสินค้าขายดีผิด!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 5: REMOVE DUPLICATES                                     -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-purple-200 bg-purple-50/30 overflow-hidden shadow-2xs">
            <div class="bg-purple-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-purple-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 5: ตรวจสอบและลบแถวข้อมูลที่ซ้ำซ้อน (Remove Duplicates)
                  </h4>
                  <p class="text-xs text-purple-200">
                    คัดกรองแถวที่เกิดจากการกดส่งฟอร์มเบิ้lหรือระบบบันทึกซ้ำออกไปให้เหลือเพียงรายการจริง
                  </p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-purple-400/20 text-purple-200 border border-purple-300/30 text-xs font-mono font-bold">
                Step 5: Uniqueness
              </span>
            </div>

            <div class="p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    คลุมตารางข้อมูล &rarr; ไปที่เมนู <code>Data (ข้อมูล)</code> &rarr;
                    <code>Data cleanup (การล้างข้อมูล)</code> &rarr; <code>Remove duplicates (ลบข้อมูลที่ซ้ำกัน)</code>
                    &rarr; ติ๊กถูก <em>Data has header row</em> แล้วกดลบ
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพราะในการเก็บข้อมูลจริง ผู้ตอบมักกดปุ่ม Submit ซ้ำตอนเน็ตช้า หรือเกิดการรวมไฟล์ซ้ำกัน
                    ทำให้มีแถวเดิมปรากฏ 2–3 บรรทัด
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    รับประกันมิติ <strong>Uniqueness (ความเป็นเอกลักษณ์)</strong> คือ 1 แถวแทน 1 เหตุการณ์จริง
                    ไม่มีการนับซ้ำ
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    ยอดขายรวม (<code>SUM</code>) และจำนวนออเดอร์ (<code>COUNT</code>) จะเฟ้อเกินจริง
                    และทำให้สัดส่วนของคนที่กดส่งซ้ำมีน้ำหนักมากเกินไป!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 6: HANDLE OUTLIERS & MISSING VALUES                      -->
          <!-- ============================================================= -->
          <div class="rounded-2xl border-2 border-amber-200 bg-amber-50/30 overflow-hidden shadow-2xs">
            <div class="bg-amber-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  6
                </span>
                <div>
                  <h4 class="font-black text-base text-white">
                    ขั้นตอนที่ 6: จัดการค่าผิดปกติสุดโต่ง (Outliers) และเติมช่องว่างที่หายไป (Missing Values)
                  </h4>
                  <p class="text-xs text-amber-200">
                    ด่านสุดท้ายเพื่อความถูกต้อง (Accuracy) และความครบถ้วน (Completeness) ก่อนนำไปคำนวณสถิติ
                  </p>
                </div>
              </div>
              <span
                class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-mono font-bold">
                Step 6: Accuracy & Completeness
              </span>
            </div>

            <div class="p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5">
                  <div class="font-black text-sky-900 text-sm flex items-center gap-1.5">
                    <Wrench class="w-4 h-4 text-sky-600" /> 1. ทำยังไง?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    • เปิด <code>Filter</code> ดูค่าต่ำสุด-สูงสุดในคอลัมน์ตัวเลข<br />
                    • หากเจอค่าสุดโต่งที่เป็นไปไม่ได้ (เช่น <code>99999</code> หรือติดลบ) และช่องว่าง
                    (<code>Blank</code>) ให้แทนที่ด้วยค่ามัธยฐาน <code>=MEDIAN()</code> หรือฐานนิยม <code>=MODE()</code>
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                  <div class="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                    <HelpCircle class="w-4 h-4 text-indigo-600" /> 2. ทำไมต้องทำ?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    เพราะค่า <code>Outlier</code> เพียงช่องเดียวจะดึงค่าเฉลี่ย (<code>Mean</code>)
                    ของทั้งตารางให้กระโดดผิดความจริง และช่องว่างทำให้จำนวนข้อมูลไม่ครบถ้วน
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                  <div class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600" /> 3. ได้ประโยชน์อะไร?
                  </div>
                  <p class="text-slate-600 leading-relaxed">
                    ค่าสถิติทั้งหมด (<code>AVERAGE</code>, <code>SUM</code>, <code>MIN</code>, <code>MAX</code>)
                    สะท้อนความจริงของธุรกิจ และตารางไม่มีช่องโหว่ (<code>COUNTBLANK = 0</code>)
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <div class="font-black text-rose-900 text-sm flex items-center gap-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" /> 4. ถ้าไม่ทำจะเป็นยังไง?
                  </div>
                  <p class="text-rose-900 leading-relaxed">
                    เช่น ลูกค้า 4 คนซื้อของคนละ ~85 บาท แต่มี 1 แถวพิมพ์ผิดเป็น <code>99,999</code> บาท
                    ค่าเฉลี่ยจะเพี้ยนเป็น <strong>20,068 บาทต่อคน</strong> ทันที!
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- FINAL CLEANED RESULT TABLE (AFTER STEP 1 - 6) -->
        <div class="p-5 sm:p-6 rounded-2xl bg-emerald-950 text-white border-2 border-emerald-500/60 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-800 pb-3">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono font-bold text-xs">
                ผลลัพธ์สุดท้าย (Cleaned Data)
              </span>
              <h4 class="font-bold text-white text-sm sm:text-base">
                ตารางข้อมูลที่ผ่านการคลีนครบทั้ง 6 ขั้นตอนแล้ว (สะอาด 100% พร้อมนำไปวิเคราะห์)
              </h4>
            </div>
            <span class="text-xs font-mono text-emerald-300">After Data Cleansing</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-emerald-800 bg-slate-950">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-emerald-900/60 text-emerald-200 border-b border-emerald-800 font-sans">
                <tr>
                  <th class="p-3">Order_ID</th>
                  <th class="p-3">Customer</th>
                  <th class="p-3">Item_1</th>
                  <th class="p-3">Item_2</th>
                  <th class="p-3">Item_3</th>
                  <th class="p-3">Total_Price</th>
                  <th class="p-3 font-sans">สิ่งที่ถูกซ่อมแซมแล้ว</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td class="p-3 font-bold text-sky-400">ORD-101</td>
                  <td class="p-3 font-sans">คุณสมชาย</td>
                  <td class="p-3 text-emerald-300 font-bold">"bread"</td>
                  <td class="p-3 text-emerald-300 font-bold">"cola"</td>
                  <td class="p-3 text-emerald-300 font-bold">"sprite"</td>
                  <td class="p-3">85</td>
                  <td class="p-3 font-sans text-emerald-400">แยกเป็น 3 คอลัมน์ + ตัดช่องว่างเรียบร้อย</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-400">ORD-102</td>
                  <td class="p-3 font-sans">คุณสายใจ</td>
                  <td class="p-3 text-emerald-300 font-bold">"milk"</td>
                  <td class="p-3 text-emerald-300 font-bold">"bread"</td>
                  <td class="p-3 text-emerald-300 font-bold">"cola"</td>
                  <td class="p-3">95</td>
                  <td class="p-3 font-sans text-emerald-400">ลบแถวซ้ำออกแล้ว + ปรับตัวพิมพ์เล็กทั้งหมด</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-400">ORD-103</td>
                  <td class="p-3 font-sans">คุณวิชัย</td>
                  <td class="p-3 text-emerald-300 font-bold">"sprite"</td>
                  <td class="p-3 text-emerald-300 font-bold">"chips"</td>
                  <td class="p-3 text-emerald-300 font-bold">"bread"</td>
                  <td class="p-3 text-amber-300 font-bold">90 (Median)</td>
                  <td class="p-3 font-sans text-emerald-400">แก้ค่า Outlier 99,999 ด้วยค่ามัธยฐาน (90 บาท)</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-sky-400">ORD-104</td>
                  <td class="p-3 font-sans">คุณนภา</td>
                  <td class="p-3 text-emerald-300 font-bold">"cola"</td>
                  <td class="p-3 text-emerald-300 font-bold">"water"</td>
                  <td class="p-3 text-slate-500">-</td>
                  <td class="p-3 text-amber-300 font-bold">90 (Median)</td>
                  <td class="p-3 font-sans text-emerald-400">เติมค่าว่าง (Missing Value) ด้วยค่ามัธยฐาน (90 บาท)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Center Section -->
    <GameCenterSection :course-id="currentCourseId" :week="currentWeek"
      drag-title="มินิเกม 1: นักสืบคัดแยกปัญหาคุณภาพข้อมูล (Dirty Data Classification)"
      drag-subtitle="ลากสถานการณ์ข้อมูลที่มีปัญหาด้านล่าง ไปวางลงในกลุ่มปัญหา Data Wrangling ที่ถูกต้อง"
      drag-tab-label="มินิเกมที่ 1: จำแนกข้อมูลขยะ" :drag-items="dragItemsData" :drag-zones="dragZonesData"
      match-title="มินิเกม 2: จับคู่เครื่องมือ Data Cleansing กับหน้าที่การใช้งาน"
      match-subtitle="จับคู่สูตรหรือวิธีการทางฝั่งซ้าย กับผลลัพธ์การทำความสะอาดข้อมูลทางฝั่งขวา"
      match-tab-label="มินิเกมที่ 2: จับคู่สูตรคลีนข้อมูล" :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs" quiz-title="แบบทดสอบหลังเรียน (Post-test): สัปดาห์ที่ 3"
      :quiz-questions="quizQuestions" />

    <!-- Lab Assignment Section (Clean 1 of 11 project datasets, 40 rows, in the teacher's Google Sheet) -->
    <AssignmentSection :courseId="currentCourseId" assignmentId="asm-3"
      assignmentTitle="ใบงานที่ 3: ตรวจสอบและทำความสะอาดข้อมูล (Data Cleaning) ชุดข้อมูลโปรเจกต์ 1 หัวข้อ จาก 11 หัวข้อ"
      :maxScore="10" workType="individual">
      <template #number>3</template>
      <template #description>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          ให้นักเรียนแต่ละคนรับผิดชอบ <strong>ชุดข้อมูล 1 โปรเจกต์ จากทั้งหมด 11 หัวข้อ</strong>
          โดยใช้ข้อมูลจำนวน <strong>{{ ROWS_PER_PROJECT }} แถว</strong> ใน Google Sheets ที่ครูจัดเตรียมไว้
          แล้วดำเนินการตรวจสอบและทำความสะอาดข้อมูล (Data Cleaning) ให้ <strong>ถูกต้องและเป็นมาตรฐาน</strong>
        </p>

        <!-- Prominent Sheet Banner inside Assignment -->
        <div
          class="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-2xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <FileSpreadsheet class="w-5 h-5 text-emerald-600" />
                <h4 class="font-black text-emerald-950 text-sm sm:text-base">
                  ไฟล์งาน Google Sheets ที่ครูจัดเตรียมไว้ (คลิกเพื่อเข้าทำใบงาน)
                </h4>
              </div>
              <p class="text-xs text-slate-600 font-mono break-all">
                {{ SHARED_SHEET_URL }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <a :href="SHARED_SHEET_URL" target="_blank" rel="noopener noreferrer"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
                <ExternalLink class="w-4 h-4" /> เปิด Google Sheets
              </a>
              <button @click="copySharedSheetUrl" type="button"
                class="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
                <Check v-if="copiedSheetUrl" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSheetUrl ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์' }}</span>
              </button>
            </div>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3.5 backdrop-blur-xs">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>11 หัวข้อโปรเจกต์ชุดข้อมูล (Dataset Projects)</span>
                  </div>
                  <p class="text-[11px] text-slate-500">คลิกเลือกหัวข้อที่ตนเองรับผิดชอบ เพื่อดูรายละเอียดและคัดลอกชื่อไปใช้ส่งงาน</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  คนละ 1 หัวข้อ ({{ ROWS_PER_PROJECT }} แถว)
                </span>
              </div>
            </div>

            <!-- 11 Topic Grid Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              <button
                v-for="p in projectTopics"
                :key="p.no"
                type="button"
                @click="selectedProjectNo = p.no"
                :class="[
                  'group text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2.5 cursor-pointer relative',
                  selectedProjectNo === p.no
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/50 scale-[1.01]'
                    : 'bg-white hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-950 border-slate-200/90 hover:border-emerald-300 shadow-2xs'
                ]"
              >
                <!-- Number Badge -->
                <span
                  :class="[
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-colors',
                    selectedProjectNo === p.no
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                  ]"
                >
                  {{ p.no }}
                </span>

                <!-- Icon Box -->
                <div
                  :class="[
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    selectedProjectNo === p.no
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                  ]"
                >
                  <component :is="p.icon" class="w-4 h-4" />
                </div>

                <!-- Name -->
                <span
                  :class="[
                    'text-xs font-bold truncate flex-1',
                    selectedProjectNo === p.no ? 'text-white' : 'text-slate-800 group-hover:text-emerald-900'
                  ]"
                >
                  {{ p.name }}
                </span>

                <!-- Indicator -->
                <CheckCircle2
                  v-if="selectedProjectNo === p.no"
                  class="w-4 h-4 text-emerald-200 shrink-0"
                />
                <span
                  v-else
                  class="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-400 shrink-0 transition-colors"
                ></span>
              </button>
            </div>

            <!-- Active Selected Project Highlight & Copy Button -->
            <div class="mt-3 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <component :is="selectedProject.icon" class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    โปรเจกต์ที่คุณกำลังเลือก (Active Selection)
                  </div>
                  <div class="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <span>โปรเจกต์ที่ {{ selectedProject.no }}: {{ selectedProject.name }}</span>
                    <span class="text-[11px] font-normal text-slate-500">({{ ROWS_PER_PROJECT }} แถว)</span>
                  </div>
                </div>
              </div>

              <button
                @click="copyProjectNote"
                type="button"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Check v-if="copiedRowText" class="w-3.5 h-3.5" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedRowText ? 'คัดลอกแล้ว!' : 'คัดลอกชื่อโปรเจกต์ไปใส่ช่องส่งงาน' }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <ul class="space-y-5 text-sm text-gray-700">
          <!-- Step 1 -->
          <li class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              1
            </div>
            <div class="space-y-1.5 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 1: เลือกโปรเจกต์ และเตรียมไฟล์ทำงาน</strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                เลือกชุดข้อมูล 1 โปรเจกต์จาก 11 หัวข้อ เปิด
                <a :href="SHARED_SHEET_URL" target="_blank" rel="noopener noreferrer"
                  class="text-sky-600 font-bold underline">Google Sheets ของครู</a>
                แล้วทำสำเนาข้อมูล {{ ROWS_PER_PROJECT }} แถวของโปรเจกต์นั้นเก็บไว้เป็น <code>Raw_Data</code>
                และทำงานจริงในแท็บ <code>Cleaned_Data</code>
              </p>
            </div>
          </li>

          <!-- Step 2 -->
          <li class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              2
            </div>
            <div class="space-y-1.5 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 2: ตรวจสอบและทำความสะอาดข้อมูล (Data Cleaning) {{
                ROWS_PER_PROJECT }} แถว</strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                ตรวจสอบข้อมูลทุกคอลัมน์ของโปรเจกต์ที่เลือก และลงมือคลีนตามหลักการที่เรียน:
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div class="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
                  <strong>1. การแยกข้อมูล (Splitting):</strong> หากมีหลายค่าอัดอยู่ในเซลล์เดียว ให้ใช้
                  <code>=SPLIT()</code> หรือ <code>Split text to columns</code> แยกออกเป็นคอลัมน์ย่อย
                </div>
                <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                  <strong>2. ความสอดคล้อง (Consistency):</strong> ใช้ <code>=TRIM()</code> หรือ
                  <code>Trim whitespace</code> ลบช่องว่างเกิน
                  และปรับตัวพิมพ์/ชื่อหมวดหมู่/รูปแบบวันที่ให้ตรงตามมาตรฐานเดียวกัน
                </div>
                <div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <strong>3. ความถูกต้อง & ค่าสุดโต่ง (Accuracy & Outliers):</strong> ตรวจสอบตัวเลขที่ผิดปกติ (เช่น
                  ติดลบ หรือสูงเกินจริง) แล้วแก้ไขหรือแทนที่ด้วยค่ากลางที่เหมาะสม
                </div>
                <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <strong>4. ความครบถ้วน & ข้อมูลซ้ำ (Completeness & Duplicates):</strong> จัดการช่องว่าง (Missing
                  Values) และตรวจสอบว่ามีรายการเบิ้ลซ้ำซ้อนหรือไม่
                </div>
              </div>
            </div>
          </li>

          <!-- Step 3 -->
          <li class="flex items-start gap-3">
            <div
              class="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              3
            </div>
            <div class="space-y-2 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 3: ส่งงานในระบบ พร้อมระบุโปรเจกต์ที่รับผิดชอบ</strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                เมื่อคลีนข้อมูลเสร็จเรียบร้อยแล้ว ให้กดปุ่ม <strong>"ส่งงาน / แนบลิงก์"</strong> ด้านล่าง
                โดยกรอกข้อมูลดังนี้:
              </p>
              <div class="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5 max-w-2xl">
                <div>
                  <strong class="text-emerald-950">1. ช่องชื่อลิงก์ (หัวข้อ):</strong>
                  <span class="text-slate-700"> ระบุโปรเจกต์ เช่น
                    <code>โปรเจกต์ที่ {{ selectedProject.no }}: {{ selectedProject.name }}</code></span>
                </div>
                <div>
                  <strong class="text-emerald-950">2. ช่อง URL ลิงก์งาน:</strong>
                  <span class="text-slate-700"> วางลิงก์ Google Sheets ที่มีแท็บ <code>Cleaned_Data</code> ของคุณ</span>
                </div>
                <div>
                  <strong class="text-emerald-950">3. ช่องรายละเอียดเพิ่มเติม / หมายเหตุถึงอาจารย์:</strong>
                  <span class="text-slate-700"> สรุปสั้นๆ ว่าในข้อมูล {{ ROWS_PER_PROJECT }}
                    แถวเจอปัญหาอะไรและคลีนอะไรไปบ้าง</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </AssignmentSection>

    <!-- PDF Summary Modal -->
    <AssignmentPdfModal v-model="showPdfModal" title="สรุปเนื้อหาสัปดาห์ที่ 3: Data Quality, Data Wrangling & Cleansing"
      subtitle="วิชาการวิเคราะห์และนำเสนอข้อมูล (31901-2012)">
      <template #pdf-content>
        <div class="space-y-5 text-sm text-gray-800 leading-relaxed">
          <div class="border-b border-gray-200 pb-3">
            <h3 class="text-lg font-bold text-sky-900">
              ใบสรุปความรู้: การตรวจสอบคุณภาพข้อมูลและการทำความสะอาดข้อมูล (Data Wrangling)
            </h3>
            <p class="text-xs text-gray-500">อ้างอิงหลักการ Data Wrangling จาก DataTH
              และมาตรฐานวิชาชีพนักวิเคราะห์ข้อมูล</p>
          </div>

          <div class="space-y-1.5">
            <h4 class="font-bold text-gray-900">1. Data Quality vs Data Cleansing / Wrangling</h4>
            <p class="text-xs text-gray-600">
              • <strong>Data Quality:</strong> การตรวจวินิจฉัยสุขภาพข้อมูล 5 มิติ (Completeness, Accuracy, Consistency,
              Uniqueness/Duplicate, Timeliness)<br />
              • <strong>Data Wrangling & Cleansing:</strong> กระบวนการแปรสภาพ จัดโครงสร้าง และลงมือซ่อมแซมข้อมูลดิบ
              (Raw Data) ให้สะอาดพร้อมนำไปวิเคราะห์
            </p>
          </div>

          <div class="space-y-1.5">
            <h4 class="font-bold text-gray-900">2. การจัดการ Missing Values (ข้อมูลที่หายไป)</h4>
            <ul class="list-disc pl-5 text-xs text-gray-600 space-y-1">
              <li><strong>การลบทิ้ง (Deletion):</strong> ลบแถวที่มีข้อมูลแหว่งเกือบหมด หรือลบคอลัมน์ที่ข้อมูลหายเกิน
                60–80%</li>
              <li><strong>การเติมค่า (Imputation):</strong> ข้อมูลตัวเลขใช้ <code>Mean</code> หรือ <code>Median</code>
                (กรณีมี Outliers), ข้อมูลหมวดหมู่ใช้ <code>Mode</code> หรือ <code>"ไม่ระบุ"</code></li>
            </ul>
          </div>

          <div class="space-y-1.5">
            <h4 class="font-bold text-gray-900">3. การตรวจจับและจัดการ Outliers (ค่าผิดปกติสุดโต่ง)</h4>
            <ul class="list-disc pl-5 text-xs text-gray-600 space-y-1">
              <li>ตรวจจับด้วยค่า <code>MIN / MAX</code>, เกณฑ์ <code>1.5 * IQR (Box Plot)</code> หรือ
                <code>Z-Score</code>
              </li>
              <li>จัดการโดยแก้ไขคำผิด (Typo), แปลงเป็นค่ามัธยฐาน (Median), หรือตัดแถวที่เป็น Noise ออก</li>
            </ul>
          </div>
        </div>
      </template>
    </AssignmentPdfModal>
  </div>
</template>