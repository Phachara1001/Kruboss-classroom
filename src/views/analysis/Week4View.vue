<script setup>
import { ref, computed, watch } from 'vue'
import {
  BookOpen, PieChart, BarChart3, LineChart, TrendingUp, SlidersHorizontal,
  Info, CheckCircle, CheckCircle2, XCircle, FileText, Layers, ArrowRight,
  Target, Award, Lightbulb, Sparkles, RefreshCw, HelpCircle, Trophy,
  FileSpreadsheet, AlertCircle, AlertTriangle, ClipboardList, CheckSquare,
  Filter, Download, Search, Table, Wrench, ExternalLink, Copy, Check,
  Coffee, Cpu, Package, Car, Dumbbell, Tent, Swords, GraduationCap,
  Zap, Play, Code
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import PreTestModal from '@/components/PreTestModal.vue'

// Current Course & Week context
const currentCourseId = '31901-2012'
const currentWeek = 4

// Modal States
const showPdfModal = ref(false)
const showPreTestModal = ref(false)

// Copy-to-clipboard feedback helper
const copiedKey = ref('')
const copyText = (text, key) => {
  navigator.clipboard.writeText(text)
  copiedKey.value = key
  setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = ''
  }, 2000)
}

// ============================================================================
// MODULE 1: EXCEL / GOOGLE SHEETS BASIC FORMULAS MINI-LAB (+, -, *, /, SUM, COUNT)
// ============================================================================
const defaultBasicCalcSeed = () => [
  { rowNum: 2, name: 'อเมริกาโน่เย็น', qty: 2, unitPrice: 65, discount: 10 },
  { rowNum: 3, name: 'ชาเขียวมัทฉะ', qty: 1, unitPrice: 80, discount: 0 },
  { rowNum: 4, name: 'ครัวซองต์อัลมอนด์', qty: 3, unitPrice: 95, discount: 25 }
]

const basicCalcItems = ref(defaultBasicCalcSeed())

const resetBasicCalc = () => {
  basicCalcItems.value = defaultBasicCalcSeed()
}

const basicCalcRows = computed(() => {
  return basicCalcItems.value.map(item => {
    const qty = Math.max(0, Number(item.qty) || 0)
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0)
    const discount = Math.max(0, Number(item.discount) || 0)
    const subtotal = qty * unitPrice
    const netTotal = Math.max(0, subtotal - discount)
    const avgPerUnit = qty > 0 ? netTotal / qty : 0
    return {
      ...item,
      qty,
      unitPrice,
      discount,
      subtotal,
      netTotal,
      avgPerUnit
    }
  })
})

const basicCalcTotals = computed(() => {
  const rows = basicCalcRows.value
  const totalQty = rows.reduce((acc, r) => acc + r.qty, 0)
  const totalSubtotal = rows.reduce((acc, r) => acc + r.subtotal, 0)
  const totalDiscount = rows.reduce((acc, r) => acc + r.discount, 0)
  const totalNet = rows.reduce((acc, r) => acc + r.netTotal, 0)
  const countItems = rows.length
  return { totalQty, totalSubtotal, totalDiscount, totalNet, countItems }
})

// ============================================================================
// MEAN VS MEDIAN TRAP INTERACTIVE DEMO (MODULE 1)
// ============================================================================
const baseCafeBills = [
  { id: 'B-01', customer: 'คุณก้อง', item: 'ลาเต้เย็น', amount: 65 },
  { id: 'B-02', customer: 'คุณมิน', item: 'ชาเขียวมัทฉะ', amount: 75 },
  { id: 'B-03', customer: 'คุณนนท์', item: 'อเมริกาโน่ + ครัวซองต์', amount: 80 },
  { id: 'B-04', customer: 'คุณพลอย', item: 'โกโก้เย็น', amount: 85 },
  { id: 'B-05', customer: 'คุณบอส', item: 'คาปูชิโน่เย็น', amount: 90 },
  { id: 'B-06', customer: 'คุณฟ้า', item: 'ชานมไต้หวัน + มุก', amount: 95 },
  { id: 'B-07', customer: 'คุณเต้', item: 'มอคค่าเย็น + เค้ก', amount: 100 },
  { id: 'B-08', customer: 'คุณเบลล์', item: 'ชุดอาหารเช้า', amount: 110 },
  { id: 'B-09', customer: 'คุณอาร์ต', item: 'อเมริกาโน่ x2', amount: 120 }
]

const includeVipOutlier = ref(false)

const trapBills = computed(() => {
  if (!includeVipOutlier.value) return baseCafeBills
  return [
    ...baseCafeBills,
    { id: 'B-10', customer: 'บริษัท XYZ (จัดเลี้ยง)', item: 'เหมาเครื่องดื่ม + ขนม 50 ชุด', amount: 4500, isOutlier: true }
  ]
})

const calcMedianValue = (nums) => {
  if (!nums.length) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const trapMean = computed(() => {
  const arr = trapBills.value.map(b => b.amount)
  const sum = arr.reduce((acc, v) => acc + v, 0)
  return arr.length ? sum / arr.length : 0
})

const trapMedian = computed(() => {
  return calcMedianValue(trapBills.value.map(b => b.amount))
})

const trapMeanWithoutOutlier = computed(() => {
  const sum = baseCafeBills.reduce((acc, b) => acc + b.amount, 0)
  return sum / baseCafeBills.length
})

const trapMedianWithoutOutlier = computed(() => {
  return calcMedianValue(baseCafeBills.map(b => b.amount))
})

const trapDiff = computed(() => {
  return Math.abs(trapMean.value - trapMedian.value)
})

// ============================================================================
// INTERACTIVE DEMO DATASET & EXCEL EXPORTER (12 CLEANED ROWS IN LAB + 24 IN XLSX)
// ============================================================================
const demoOrders = [
  { row: 2, orderId: 'ORD-001', branch: 'สาขาสยาม', category: 'กาแฟ', menuItem: 'อเมริกาโน่เย็น', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 2, unitPrice: 65, totalSales: 130 },
  { row: 3, orderId: 'ORD-002', branch: 'สาขาสยาม', category: 'กาแฟ', menuItem: 'ลาเต้ร้อน', payment: 'บัตรเครดิต', tier: 'VIP', qty: 3, unitPrice: 75, totalSales: 225 },
  { row: 4, orderId: 'ORD-003', branch: 'สาขาลาดพร้าว', category: 'ชา', menuItem: 'ชาเขียวมัทฉะ', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 1, unitPrice: 80, totalSales: 80 },
  { row: 5, orderId: 'ORD-004', branch: 'สาขาอโศก', category: 'เบเกอรี่', menuItem: 'ครัวซองต์อัลมอนด์', payment: 'เงินสด', tier: 'ทั่วไป', qty: 2, unitPrice: 95, totalSales: 190 },
  { row: 6, orderId: 'ORD-005', branch: 'สาขาสยาม', category: 'ชา', menuItem: 'ชาไทยเย็น', payment: 'QR PromptPay', tier: 'VIP', qty: 4, unitPrice: 60, totalSales: 240 },
  { row: 7, orderId: 'ORD-006', branch: 'สาขาลาดพร้าว', category: 'กาแฟ', menuItem: 'คาปูชิโน่เย็น', payment: 'เงินสด', tier: 'ทั่วไป', qty: 2, unitPrice: 70, totalSales: 140 },
  { row: 8, orderId: 'ORD-007', branch: 'สาขาอโศก', category: 'กาแฟ', menuItem: 'เอสเพรสโซ่เย็น', payment: 'QR PromptPay', tier: 'VIP', qty: 2, unitPrice: 65, totalSales: 130 },
  { row: 9, orderId: 'ORD-008', branch: 'สาขาสยาม', category: 'เบเกอรี่', menuItem: 'ชีสเค้กหน้าไหม้', payment: 'บัตรเครดิต', tier: 'VIP', qty: 2, unitPrice: 120, totalSales: 240 },
  { row: 10, orderId: 'ORD-009', branch: 'สาขาลาดพร้าว', category: 'ชา', menuItem: 'ชานมไต้หวัน', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 2, unitPrice: 65, totalSales: 130 },
  { row: 11, orderId: 'ORD-010', branch: 'สาขาอโศก', category: 'ชา', menuItem: 'ชาเขียวมัทฉะ', payment: 'เงินสด', tier: 'ทั่วไป', qty: 1, unitPrice: 80, totalSales: 80 },
  { row: 12, orderId: 'ORD-011', branch: 'สาขาสยาม', category: 'กาแฟ', menuItem: 'มอคค่าเย็น', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 1, unitPrice: 75, totalSales: 75 },
  { row: 13, orderId: 'ORD-012', branch: 'สาขาลาดพร้าว', category: 'เบเกอรี่', menuItem: 'บราวนี่ดาร์กช็อก', payment: 'บัตรเครดิต', tier: 'VIP', qty: 3, unitPrice: 90, totalSales: 270 }
]

const excelExportRows = [
  ...demoOrders,
  { row: 14, orderId: 'ORD-013', branch: 'สาขาสยาม', category: 'กาแฟ', menuItem: 'ลาเต้เย็น', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 1, unitPrice: 75, totalSales: 75 },
  { row: 15, orderId: 'ORD-014', branch: 'สาขาอโศก', category: 'เบเกอรี่', menuItem: 'ครัวซองต์เนยสด', payment: 'บัตรเครดิต', tier: 'VIP', qty: 4, unitPrice: 85, totalSales: 340 },
  { row: 16, orderId: 'ORD-015', branch: 'สาขาลาดพร้าว', category: 'กาแฟ', menuItem: 'อเมริกาโน่เย็น', payment: 'QR PromptPay', tier: 'VIP', qty: 3, unitPrice: 65, totalSales: 195 },
  { row: 17, orderId: 'ORD-016', branch: 'สาขาสยาม', category: 'ชา', menuItem: 'ชาพีชโซดา', payment: 'เงินสด', tier: 'ทั่วไป', qty: 2, unitPrice: 70, totalSales: 140 },
  { row: 18, orderId: 'ORD-017', branch: 'สาขาอโศก', category: 'กาแฟ', menuItem: 'คาราเมลมัคคิอาโต้', payment: 'บัตรเครดิต', tier: 'VIP', qty: 2, unitPrice: 90, totalSales: 180 },
  { row: 19, orderId: 'ORD-018', branch: 'สาขาลาดพร้าว', category: 'เบเกอรี่', menuItem: 'เค้กแครอท', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 1, unitPrice: 110, totalSales: 110 },
  { row: 20, orderId: 'ORD-019', branch: 'สาขาสยาม', category: 'กาแฟ', menuItem: 'อเมริกาโน่น้ำส้ม', payment: 'QR PromptPay', tier: 'VIP', qty: 2, unitPrice: 85, totalSales: 170 },
  { row: 21, orderId: 'ORD-020', branch: 'สาขาอโศก', category: 'ชา', menuItem: 'ชามะนาวเย็น', payment: 'เงินสด', tier: 'ทั่วไป', qty: 3, unitPrice: 55, totalSales: 165 },
  { row: 22, orderId: 'ORD-021', branch: 'สาขาลาดพร้าว', category: 'กาแฟ', menuItem: 'ลาเต้เย็น', payment: 'บัตรเครดิต', tier: 'ทั่วไป', qty: 2, unitPrice: 75, totalSales: 150 },
  { row: 23, orderId: 'ORD-022', branch: 'สาขาสยาม', category: 'เบเกอรี่', menuItem: 'ครัวซองต์อัลมอนด์', payment: 'QR PromptPay', tier: 'VIP', qty: 3, unitPrice: 95, totalSales: 285 },
  { row: 24, orderId: 'ORD-023', branch: 'สาขาอโศก', category: 'กาแฟ', menuItem: 'เอสเพรสโซ่ร้อน', payment: 'QR PromptPay', tier: 'ทั่วไป', qty: 1, unitPrice: 60, totalSales: 60 },
  { row: 25, orderId: 'ORD-024', branch: 'สาขาลาดพร้าว', category: 'ชา', menuItem: 'ชาเขียวมัทฉะ', payment: 'บัตรเครดิต', tier: 'VIP', qty: 4, unitPrice: 80, totalSales: 320 }
]

const downloadDemoExcel = async () => {
  const xlsx = await import('xlsx')
  const masterDataRows = excelExportRows.map(r => ({
    Order_ID: r.orderId,
    Branch: r.branch,
    Category: r.category,
    Menu_Item: r.menuItem,
    Payment_Method: r.payment,
    Member_Tier: r.tier,
    Qty: r.qty,
    Unit_Price: r.unitPrice,
    Total_Sales: r.totalSales
  }))
  const wsMaster = xlsx.utils.json_to_sheet(masterDataRows)
  wsMaster['!cols'] = [
    { wch: 11 }, { wch: 14 }, { wch: 11 }, { wch: 22 }, { wch: 15 },
    { wch: 12 }, { wch: 6 }, { wch: 11 }, { wch: 12 }
  ]

  // Build Numeric_Dashboard sheet: Left A1:I25 = copied data from Master_data, J = spacer, Right K1:O30 = 4-Zone Dashboard
  const dashboardRightBlocks = [
    ['CAFE NUMERIC KPI DASHBOARD (สรุปยอดขาย 24 รายการในชีตเดียวกัน)', '', '', '', ''], // Row 1 (idx 0)
    ['ข้อมูลด้านซ้าย A2:I25 ทำสำเนามาจาก Master_data (เขียนสูตรในชีตนี้ได้เลยไม่ต้องเชื่อมข้ามชีต)', '', '', '', ''], // Row 2 (idx 1)
    ['ตัวชี้วัดภาพรวม (Zone 1: Overall KPIs)', 'ผลลัพธ์ (ใส่สูตรที่นี่)', 'หน่วย', 'คำใบ้สูตร (ช่วง $I$2:$I$25)', ''], // Row 3 (idx 2)
    ['จำนวนบิลทั้งหมด (COUNT / COUNTA)', '', 'บิล', '=COUNT($I$2:$I$25)', ''], // Row 4 -> L4
    ['ยอดขายรวมทั้งหมด (SUM)', '', 'บาท', '=SUM($I$2:$I$25)', ''], // Row 5 -> L5
    ['ยอดขายเฉลี่ยต่อบิล (AVERAGE)', '', 'บาท', '=AVERAGE($I$2:$I$25)', ''], // Row 6 -> L6
    ['ค่ากลางมัธยฐาน (MEDIAN)', '', 'บาท', '=MEDIAN($I$2:$I$25)', ''], // Row 7 -> L7
    ['ยอดขายต่อบิลต่ำสุด (MIN)', '', 'บาท', '=MIN($I$2:$I$25)', ''], // Row 8 -> L8
    ['ยอดขายต่อบิลสูงสุด (MAX)', '', 'บาท', '=MAX($I$2:$I$25)', ''], // Row 9 -> L9
    ['ส่วนเบี่ยงเบนมาตรฐาน (STDEV.S)', '', 'บาท', '=STDEV.S($I$2:$I$25)', ''], // Row 10 -> L10
    ['', '', '', '', ''], // Row 11
    ['สาขา (Zone 2: Branch Summary)', 'จำนวนบิล (COUNTIF)', 'ยอดขายรวม (SUMIF)', 'เฉลี่ย/บิล (AVERAGEIF)', 'สัดส่วน % (% Share)'], // Row 12
    ['สาขาสยาม', '', '', '', ''], // Row 13 -> K13, L13:O13
    ['สาขาลาดพร้าว', '', '', '', ''], // Row 14 -> K14, L14:O14
    ['สาขาอโศก', '', '', '', ''], // Row 15 -> K15, L15:O15
    ['รวมทั้งหมด', '', '', '', ''], // Row 16 -> K16, L16:O16
    ['', '', '', '', ''], // Row 17
    ['Zone 3: ตารางเจาะลึก 2 มิติ (ยอดขายรวม: สาขา x หมวดสินค้า)', '', '', '', ''], // Row 18
    ['สาขา / หมวดสินค้า', 'กาแฟ', 'ชา', 'เบเกอรี่', 'รวมรายสาขา'], // Row 19 -> L19='กาแฟ', M19='ชา', N19='เบเกอรี่', O19='รวมรายสาขา'
    ['สาขาสยาม', '', '', '', ''], // Row 20 -> K20, L20:O20
    ['สาขาลาดพร้าว', '', '', '', ''], // Row 21 -> K21, L21:O21
    ['สาขาอโศก', '', '', '', ''], // Row 22 -> K22, L22:O22
    ['', '', '', '', ''], // Row 23
    ['คำถามวิเคราะห์เจาะลึก (Zone 4: Multi-Condition KPIs)', 'ผลลัพธ์ (ใส่สูตรที่นี่)', 'หน่วย', 'ฟังก์ชันที่แนะนำ', ''], // Row 24
    ['จำนวนบิลลูกค้า VIP ที่จ่ายด้วย QR PromptPay', '', 'บิล', 'COUNTIFS (2 เงื่อนไข)', ''], // Row 25 -> L25
    ['ยอดขายรวมลูกค้า VIP ที่จ่ายด้วยบัตรเครดิต', '', 'บาท', 'SUMIFS (2 เงื่อนไข)', ''], // Row 26 -> L26
    ['ยอดเฉลี่ยต่อบิลของลูกค้า VIP', '', 'บาท', 'AVERAGEIF (1 เงื่อนไข)', ''], // Row 27 -> L27
    ['ยอดเฉลี่ยต่อบิลของลูกค้าทั่วไป', '', 'บาท', 'AVERAGEIF (1 เงื่อนไข)', ''], // Row 28 -> L28
    ['จำนวนบิลยอดซื้อสูง (>= 200 บาท)', '', 'บิล', 'COUNTIF (เงื่อนไข >=200)', ''], // Row 29 -> L29
    ['ยอดขายรวมของบิลช่วง 100 - 200 บาท', '', 'บาท', 'SUMIFS (ช่วง 100 ถึง 200)', ''] // Row 30 -> L30
  ]

  const dashboardCombinedRows = dashboardRightBlocks.map((rightCols, idx) => {
    let leftCols = ['', '', '', '', '', '', '', '', '']
    if (idx === 0) {
      leftCols = ['Order_ID', 'Branch', 'Category', 'Menu_Item', 'Payment_Method', 'Member_Tier', 'Qty', 'Unit_Price', 'Total_Sales']
    } else if (idx >= 1 && idx <= excelExportRows.length) {
      const src = excelExportRows[idx - 1]
      leftCols = [src.orderId, src.branch, src.category, src.menuItem, src.payment, src.tier, src.qty, src.unitPrice, src.totalSales]
    }
    return [...leftCols, '', ...rightCols] // A..I (0..8), J spacer (9), K..O (10..14)
  })

  const wsDashboard = xlsx.utils.aoa_to_sheet(dashboardCombinedRows)
  wsDashboard['!cols'] = [
    { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 21 }, { wch: 15 },
    { wch: 11 }, { wch: 5 }, { wch: 10 }, { wch: 11 },
    { wch: 3 }, // Col J spacer
    { wch: 44 }, { wch: 22 }, { wch: 22 }, { wch: 26 }, { wch: 20 } // Cols K..O
  ]

  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, wsMaster, 'Master_data')
  xlsx.utils.book_append_sheet(wb, wsDashboard, 'Numeric_Dashboard')
  xlsx.writeFile(wb, 'demo_week4_numeric_dashboard.xlsx')
}

// ============================================================================
// MODULE 5: HANDS-ON WORKSHOP TO BUILD A NUMERIC KPI DASHBOARD (6 STEPS)
// ============================================================================
const activeLabTab = ref('workshop') // 'workshop' | 'conditional'
const activeWorkshopStep = ref(1)
const showAllWorkshopSteps = ref(false)
const showAll24Preview = ref(false)
const showErrorCheat = ref(true)

const workshopStepsMeta = [
  { step: 1, shortTitle: '1. แยกชีต Master_data', title: 'ขั้นที่ 1: เตรียมไฟล์แยก Master_data และ Numeric_Dashboard' },
  { step: 2, shortTitle: '2. โซนที่ 1: KPIs', title: 'ขั้นที่ 2: สร้างกล่องตัวชี้วัดภาพรวม (Zone 1: L4:L10)' },
  { step: 3, shortTitle: '3. โซนที่ 2: รายสาขา', title: 'ขั้นที่ 3: สร้างตารางสรุปรายสาขา + % Share (Zone 2: L13:O16)' },
  { step: 4, shortTitle: '4. โซนที่ 3: Matrix', title: 'ขั้นที่ 4: ตารางเจาะลึก 2 มิติ สาขา × หมวด (Zone 3: L20:O22)' },
  { step: 5, shortTitle: '5. โซนที่ 4: เจาะกลุ่ม', title: 'ขั้นที่ 5: ตัวเลขเจาะกลุ่ม VIP และเงื่อนไขพิเศษ (Zone 4: L25:L30)' },
  { step: 6, shortTitle: '6. แดชบอร์ดสมบูรณ์', title: 'ขั้นที่ 6: ตกแต่งและตรวจคำตอบแดชบอร์ดตัวเลขฉบับสมบูรณ์' }
]

const shouldShowStep = (stepNum) => {
  return showAllWorkshopSteps.value || activeWorkshopStep.value === stepNum
}

const previewMasterRows = computed(() => {
  return showAll24Preview.value ? excelExportRows : excelExportRows.slice(0, 8)
})

// Computed Answers from 24 rows (Guaranteed 100% accurate live verification)
const dashboardKpis = computed(() => {
  const vals = excelExportRows.map(r => r.totalSales)
  const count = vals.length
  const sum = vals.reduce((a, b) => a + b, 0)
  const average = count ? sum / count : 0
  const median = calcMedianValue(vals)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const stdev = count > 1
    ? Math.sqrt(vals.reduce((acc, v) => acc + Math.pow(v - average, 2), 0) / (count - 1))
    : 0
  return { count, sum, average, median, min, max, stdev }
})

const zone1FormulaGuide = computed(() => {
  const k = dashboardKpis.value
  return [
    { cell: 'L4', label: 'จำนวนบิลทั้งหมด', formula: '=COUNT($I$2:$I$25)', answer: `${k.count} บิล`, color: 'sky' },
    { cell: 'L5', label: 'ยอดขายรวมทั้งหมด', formula: '=SUM($I$2:$I$25)', answer: `${k.sum.toLocaleString()} บาท`, color: 'emerald' },
    { cell: 'L6', label: 'ยอดขายเฉลี่ยต่อบิล', formula: '=AVERAGE($I$2:$I$25)', answer: `${k.average.toFixed(2)} บาท`, color: 'indigo' },
    { cell: 'L7', label: 'ค่ากลางมัธยฐาน', formula: '=MEDIAN($I$2:$I$25)', answer: `${k.median.toFixed(2)} บาท`, color: 'teal' },
    { cell: 'L8', label: 'ยอดขายต่อบิลต่ำสุด', formula: '=MIN($I$2:$I$25)', answer: `${k.min.toLocaleString()} บาท`, color: 'slate' },
    { cell: 'L9', label: 'ยอดขายต่อบิลสูงสุด', formula: '=MAX($I$2:$I$25)', answer: `${k.max.toLocaleString()} บาท`, color: 'amber' },
    { cell: 'L10', label: 'ส่วนเบี่ยงเบนมาตรฐาน', formula: '=STDEV.S($I$2:$I$25)', answer: `${k.stdev.toFixed(2)} บาท`, color: 'rose' }
  ]
})

const branchList = ['สาขาสยาม', 'สาขาลาดพร้าว', 'สาขาอโศก']
const categoryList = ['กาแฟ', 'ชา', 'เบเกอรี่']

const dashboardBranchSummary = computed(() => {
  const totalRev = dashboardKpis.value.sum || 1
  return branchList.map((branch, idx) => {
    const rows = excelExportRows.filter(r => r.branch === branch)
    const count = rows.length
    const sum = rows.reduce((a, b) => a + b.totalSales, 0)
    const average = count ? sum / count : 0
    const sharePercent = (sum / totalRev) * 100
    return {
      rowNum: 13 + idx,
      branch,
      count,
      sum,
      average,
      sharePercent
    }
  })
})

const topBranch = computed(() => {
  return [...dashboardBranchSummary.value].sort((a, b) => b.sum - a.sum)[0]
})

const dashboardMatrix = computed(() => {
  let maxCell = 0
  let maxBranch = ''
  let maxCategory = ''
  const rows = branchList.map((branch, rIdx) => {
    const cells = {}
    let rowTotal = 0
    categoryList.forEach(cat => {
      const val = excelExportRows
        .filter(r => r.branch === branch && r.category === cat)
        .reduce((a, b) => a + b.totalSales, 0)
      cells[cat] = val
      rowTotal += val
      if (val > maxCell) {
        maxCell = val
        maxBranch = branch
        maxCategory = cat
      }
    })
    return {
      rowNum: 20 + rIdx,
      branch,
      cells,
      rowTotal
    }
  })

  const colTotals = {}
  categoryList.forEach(cat => {
    colTotals[cat] = excelExportRows
      .filter(r => r.category === cat)
      .reduce((a, b) => a + b.totalSales, 0)
  })
  const grandTotal = rows.reduce((a, r) => a + r.rowTotal, 0)

  return { rows, colTotals, grandTotal, maxCell, maxBranch, maxCategory }
})

const dashboardSegments = computed(() => {
  const vipRows = excelExportRows.filter(r => r.tier === 'VIP')
  const generalRows = excelExportRows.filter(r => r.tier === 'ทั่วไป')
  const vipQrRows = excelExportRows.filter(r => r.tier === 'VIP' && r.payment === 'QR PromptPay')
  const vipCardRows = excelExportRows.filter(r => r.tier === 'VIP' && r.payment === 'บัตรเครดิต')
  const highOrders = excelExportRows.filter(r => r.totalSales >= 200)
  const midOrders = excelExportRows.filter(r => r.totalSales >= 100 && r.totalSales <= 200)

  const vipAvg = vipRows.length ? vipRows.reduce((a, b) => a + b.totalSales, 0) / vipRows.length : 0
  const generalAvg = generalRows.length ? generalRows.reduce((a, b) => a + b.totalSales, 0) / generalRows.length : 0

  return {
    vipQrCount: vipQrRows.length,
    vipCardSum: vipCardRows.reduce((a, b) => a + b.totalSales, 0),
    vipAvg,
    generalAvg,
    vipVsGeneralDiff: vipAvg - generalAvg,
    highOrderCount: highOrders.length,
    midRangeSum: midOrders.reduce((a, b) => a + b.totalSales, 0)
  }
})

const zone4FormulaGuide = computed(() => {
  const s = dashboardSegments.value
  return [
    {
      cell: 'L25',
      title: 'จำนวนบิลลูกค้า VIP ที่จ่ายด้วย QR PromptPay',
      funcTag: 'COUNTIFS',
      formula: '=COUNTIFS($F$2:$F$25, "VIP", $E$2:$E$25, "QR PromptPay")',
      answer: `${s.vipQrCount} บิล`
    },
    {
      cell: 'L26',
      title: 'ยอดขายรวมลูกค้า VIP ที่จ่ายด้วยบัตรเครดิต',
      funcTag: 'SUMIFS',
      formula: '=SUMIFS($I$2:$I$25, $F$2:$F$25, "VIP", $E$2:$E$25, "บัตรเครดิต")',
      answer: `${s.vipCardSum.toLocaleString()} บาท`
    },
    {
      cell: 'L27',
      title: 'ยอดเฉลี่ยต่อบิลของลูกค้า VIP',
      funcTag: 'AVERAGEIF',
      formula: '=AVERAGEIF($F$2:$F$25, "VIP", $I$2:$I$25)',
      answer: `${s.vipAvg.toFixed(2)} บาท`
    },
    {
      cell: 'L28',
      title: 'ยอดเฉลี่ยต่อบิลของลูกค้าทั่วไป',
      funcTag: 'AVERAGEIF',
      formula: '=AVERAGEIF($F$2:$F$25, "ทั่วไป", $I$2:$I$25)',
      answer: `${s.generalAvg.toFixed(2)} บาท`
    },
    {
      cell: 'L29',
      title: 'จำนวนบิลยอดซื้อสูง (>= 200 บาท)',
      funcTag: 'COUNTIF',
      formula: '=COUNTIF($I$2:$I$25, ">=200")',
      answer: `${s.highOrderCount} บิล`
    },
    {
      cell: 'L30',
      title: 'ยอดขายรวมของบิลช่วง 100 - 200 บาท',
      funcTag: 'SUMIFS',
      formula: '=SUMIFS($I$2:$I$25, $I$2:$I$25, ">=100", $I$2:$I$25, "<=200")',
      answer: `${s.midRangeSum.toLocaleString()} บาท`
    }
  ]
})

// --- Tab 2: Conditional Formula Builder ---
const condFunc = ref('SUMIFS') // 'COUNTIF' | 'SUMIF' | 'AVERAGEIF' | 'COUNTIFS' | 'SUMIFS' | 'AVERAGEIFS'
const cond1Field = ref('Branch')
const cond1Value = ref('สาขาสยาม')
const cond2Field = ref('Category')
const cond2Value = ref('กาแฟ')

const cond1FieldMeta = {
  Branch: { label: 'Branch (สาขา - คอลัมน์ B)', col: 'B2:B13', prop: 'branch', options: ['สาขาสยาม', 'สาขาลาดพร้าว', 'สาขาอโศก'] },
  Category: { label: 'Category (หมวดสินค้า - คอลัมน์ C)', col: 'C2:C13', prop: 'category', options: ['กาแฟ', 'ชา', 'เบเกอรี่'] },
  Payment_Method: { label: 'Payment_Method (การจ่ายเงิน - คอลัมน์ E)', col: 'E2:E13', prop: 'payment', options: ['QR PromptPay', 'เงินสด', 'บัตรเครดิต'] },
  Member_Tier: { label: 'Member_Tier (ระดับสมาชิก - คอลัมน์ F)', col: 'F2:F13', prop: 'tier', options: ['VIP', 'ทั่วไป'] }
}

const cond2FieldMeta = {
  Category: { label: 'Category (หมวดสินค้า - คอลัมน์ C)', col: 'C2:C13', prop: 'category', options: ['กาแฟ', 'ชา', 'เบเกอรี่'] },
  Payment_Method: { label: 'Payment_Method (การจ่ายเงิน - คอลัมน์ E)', col: 'E2:E13', prop: 'payment', options: ['QR PromptPay', 'เงินสด', 'บัตรเครดิต'] },
  Member_Tier: { label: 'Member_Tier (ระดับสมาชิก - คอลัมน์ F)', col: 'F2:F13', prop: 'tier', options: ['VIP', 'ทั่วไป'] },
  Total_Sales_Gte: { label: 'Total_Sales >= (ยอดขายตั้งแต่ - คอลัมน์ I)', col: 'I2:I13', prop: 'totalSales', options: ['100', '150', '200', '300'] }
}

watch(cond1Field, (newField) => {
  const opts = cond1FieldMeta[newField]?.options || []
  if (!opts.includes(cond1Value.value)) {
    cond1Value.value = opts[0] || ''
  }
})

watch(cond2Field, (newField) => {
  const opts = cond2FieldMeta[newField]?.options || []
  if (!opts.includes(cond2Value.value)) {
    cond2Value.value = opts[0] || ''
  }
})

const isMultiConditionFunc = computed(() => condFunc.value.endsWith('IFS'))

const rowMatchesCriteria = (orderRow, fieldKey, val, isSecond = false) => {
  const meta = isSecond ? cond2FieldMeta[fieldKey] : cond1FieldMeta[fieldKey]
  if (!meta) return false
  if (fieldKey === 'Total_Sales_Gte') {
    return Number(orderRow.totalSales) >= Number(val)
  }
  return String(orderRow[meta.prop]) === String(val)
}

const matchedRows = computed(() => {
  return demoOrders.filter(order => {
    const pass1 = rowMatchesCriteria(order, cond1Field.value, cond1Value.value, false)
    if (!isMultiConditionFunc.value) return pass1
    const pass2 = rowMatchesCriteria(order, cond2Field.value, cond2Value.value, true)
    return pass1 && pass2
  })
})

const matchedRowIds = computed(() => new Set(matchedRows.value.map(r => r.orderId)))

const generatedFormula = computed(() => {
  const m1 = cond1FieldMeta[cond1Field.value]
  const m2 = cond2FieldMeta[cond2Field.value]
  const c1Crit = `"${cond1Value.value}"`
  const c2Crit = cond2Field.value === 'Total_Sales_Gte' ? `">=${cond2Value.value}"` : `"${cond2Value.value}"`

  switch (condFunc.value) {
    case 'COUNTIF':
      return `=COUNTIF(${m1.col}, ${c1Crit})`
    case 'SUMIF':
      return `=SUMIF(${m1.col}, ${c1Crit}, I2:I13)`
    case 'AVERAGEIF':
      return `=AVERAGEIF(${m1.col}, ${c1Crit}, I2:I13)`
    case 'COUNTIFS':
      return `=COUNTIFS(${m1.col}, ${c1Crit}, ${m2.col}, ${c2Crit})`
    case 'SUMIFS':
      return `=SUMIFS(I2:I13, ${m1.col}, ${c1Crit}, ${m2.col}, ${c2Crit})`
    case 'AVERAGEIFS':
      return `=AVERAGEIFS(I2:I13, ${m1.col}, ${c1Crit}, ${m2.col}, ${c2Crit})`
    default:
      return ''
  }
})

const totalDemoRevenue = demoOrders.reduce((acc, r) => acc + r.totalSales, 0)

const computedCondResult = computed(() => {
  const rows = matchedRows.value
  const count = rows.length
  const sum = rows.reduce((acc, r) => acc + r.totalSales, 0)
  const avg = count > 0 ? sum / count : 0
  if (condFunc.value === 'COUNTIF' || condFunc.value === 'COUNTIFS') {
    return { mainValue: `${count} รายการ`, numeric: count, unit: 'รายการ' }
  }
  if (condFunc.value === 'SUMIF' || condFunc.value === 'SUMIFS') {
    return { mainValue: `${sum.toLocaleString()} บาท`, numeric: sum, unit: 'บาท' }
  }
  return { mainValue: `${avg.toFixed(2)} บาท`, numeric: avg, unit: 'บาท/บิล' }
})

const shareOfTotalPercent = computed(() => {
  const rows = matchedRows.value
  const sum = rows.reduce((acc, r) => acc + r.totalSales, 0)
  if (condFunc.value === 'COUNTIF' || condFunc.value === 'COUNTIFS') {
    return ((rows.length / demoOrders.length) * 100).toFixed(1)
  }
  return ((sum / totalDemoRevenue) * 100).toFixed(1)
})

const formulaExplanation = computed(() => {
  const cond1Text = `${cond1Field.value} = "${cond1Value.value}"`
  const cond2Text = cond2Field.value === 'Total_Sales_Gte'
    ? `Total_Sales >= ${cond2Value.value}`
    : `${cond2Field.value} = "${cond2Value.value}"`

  if (condFunc.value === 'COUNTIF') {
    return `นับจำนวนแถวที่ ${cond1Text} พบทั้งหมด ${matchedRows.value.length} จาก ${demoOrders.length} บิล`
  }
  if (condFunc.value === 'SUMIF') {
    return `สังเกต: SUMIF วาง criteria_range (${cond1FieldMeta[cond1Field.value].col}) ก่อน แล้ววาง sum_range (I2:I13) ไว้ท้ายสุด`
  }
  if (condFunc.value === 'AVERAGEIF') {
    return `สังเกต: AVERAGEIF วาง criteria_range (${cond1FieldMeta[cond1Field.value].col}) ก่อน แล้ววาง average_range (I2:I13) ไว้ท้ายสุด`
  }
  if (condFunc.value === 'COUNTIFS') {
    return `นับเฉพาะแถวที่ตรงทั้ง 2 เงื่อนไข (${cond1Text} และ ${cond2Text}) จากทั้งหมด ${demoOrders.length} บิล`
  }
  if (condFunc.value === 'SUMIFS') {
    return `สังเกต: SUMIFS ต้องย้าย sum_range (I2:I13) มาไว้เป็นอาร์กิวเมนต์ตัวแรกสุดเสมอ แล้วค่อยตามด้วยคู่เงื่อนไข (${cond1Text} และ ${cond2Text})`
  }
  return `สังเกต: AVERAGEIFS ต้องย้าย average_range (I2:I13) มาไว้เป็นอาร์กิวเมนต์ตัวแรกสุดเสมอ แล้วค่อยตามด้วยคู่เงื่อนไข (${cond1Text} และ ${cond2Text})`
})

// ============================================================================
// SHARED GOOGLE SHEET & 11 PROJECTS (CONNECTED FROM WEEK 3)
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
  {
    no: 1,
    icon: CheckSquare,
    name: 'ระบบเช็กชื่อเข้าเรียน',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'หาจำนวนรายการเช็กชื่อทั้งหมด (COUNTA), รวมชั่วโมงเข้าเรียนทั้งหมด (SUM) และค่าเฉลี่ย % การเข้าเรียนภาพรวม (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐาน (MEDIAN), ต่ำสุด-สูงสุด (MIN/MAX) เพื่อสแกนค่าหลุดกรอบ และวัดความสม่ำเสมอการเข้าเรียนด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนครั้งที่มาเรียน / มาสาย / ขาดเรียน แยกตามสถานะหรือรายวิชา พร้อมคำนวณสัดส่วน % Share (รวมได้ 100%)' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมชั่วโมงเข้าเรียนและหาค่าเฉลี่ย % การเข้าเรียนแยกตามแต่ละรายวิชาหรือห้องเรียน (ล็อกช่วงข้อมูลด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมชั่วโมงเข้าเรียนหรือนับครั้งที่มาสาย/ขาดเรียนเฉพาะห้องที่กำหนดในสัปดาห์ >= 3 (หรือทำตาราง Matrix รายวิชา × สถานะ)' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ย % การเข้าเรียนแยกตามระดับชั้นและสถานะ แล้วสรุป Mini-Insights 3 ข้อพร้อมเทียบ AVERAGE vs MEDIAN' }
    ]
  },
  {
    no: 2,
    icon: Trophy,
    name: 'ประวัติการแข่งขัน E-Sport',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนแมตช์ทั้งหมด (COUNTA), รวม Kill หรือเงินรางวัลทั้งหมด (SUM) และหาค่าเฉลี่ยคะแนน/KDA ภาพรวม (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐาน KDA (MEDIAN), ต่ำสุด-สูงสุด (MIN/MAX) และวัดความนิ่งของฟอร์มการเล่นด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนแมตช์ที่ชนะ (Win) และแพ้ (Lose) แยกตามชื่อทีมหรือเกม พร้อมคำนวณสัดส่วน Win Rate (% Share)' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมคะแนน Kill / เงินรางวัล และหาค่าเฉลี่ย KDA แยกตามแต่ละทีมหรือแต่ละโหมดการเล่น (ล็อกช่วงด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมคะแนน Kill หรือเงินรางวัลเฉพาะโหมด Ranked ที่ชนะ (Win) หรือสร้างตาราง Matrix ทีม × โหมดการแข่งขัน' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ย KDA ของผู้เล่นตำแหน่ง Carry ในแมตช์ระดับทัวร์นาเมนต์ แล้วสรุป Mini-Insights 3 ข้อพร้อมตัวเลขจริง' }
    ]
  },
  {
    no: 3,
    icon: Cpu,
    name: 'สต็อกอุปกรณ์คอมพิวเตอร์ / IoT',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนรายการอุปกรณ์ทั้งหมด (COUNTA), รวมมูลค่าสต็อกทั้งหมด (SUM) และหาค่าเฉลี่ยราคาต่อชิ้น (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานราคาอุปกรณ์ (MEDIAN), ต่ำสุด-สูงสุด (MIN/MAX) เพื่อตรวจสต็อกติดลบ และดูการกระจายราคาด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนรายการอุปกรณ์แยกตามหมวดหมู่และนับรายการที่คงเหลือ < 5 ชิ้น พร้อมคิดสัดส่วน % Share ของแต่ละหมวด' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมมูลค่าสต็อกและหาค่าเฉลี่ยราคาต่อหน่วยแยกตามหมวดหมู่อุปกรณ์ (เช่น Sensor, Microcontroller, สายสัญญาณ)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมมูลค่าสต็อกเฉพาะหมวด Sensor ในคลัง A หรือสร้างตาราง Matrix คลังเก็บ × หมวดหมู่อุปกรณ์' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยราคาต่อหน่วยของ Microcontroller ที่มีสถานะ "พร้อมใช้งาน" แล้วสรุป Mini-Insights 3 ข้อเพื่อวางแผนสั่งซื้อ' }
    ]
  },
  {
    no: 4,
    icon: BookOpen,
    name: 'ระบบยืม-คืนหนังสือ',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนรายการยืมทั้งหมด (COUNTA), รวมค่าปรับทั้งหมด (SUM) และหาค่าเฉลี่ยจำนวนวันที่ยืมต่อครั้ง (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานจำนวนวันยืม (MEDIAN), ค่าปรับต่ำสุด-สูงสุด (MIN/MAX) และความแตกต่างระยะเวลายืมด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนรายการที่คืนตรงเวลาและคืนเกินกำหนด (Overdue) แยกตามหมวดหนังสือ พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมยอดค่าปรับและหาค่าเฉลี่ยจำนวนวันยืมแยกตามหมวดหมู่หนังสือหรือคณะ/สาขา (ล็อกช่วงเซลล์ด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมค่าปรับทั้งหมดของหมวดหนังสือเทคโนโลยีในภาคเรียนที่ 2 หรือสร้างตาราง Matrix คณะ/สาขา × หมวดหนังสือ' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยจำนวนวันยืมแยกตามคณะและสถานะการคืน แล้วสรุป Mini-Insights 3 ข้อพร้อมเทียบ AVERAGE vs MEDIAN' }
    ]
  },
  {
    no: 5,
    icon: Coffee,
    name: 'ออเดอร์ร้านคาเฟ่ / ชานม',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนบิลทั้งหมด (COUNTA), รวมยอดขายสุทธิทั้งหมด (SUM) และหายอดขายเฉลี่ยต่อบิล (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานยอดต่อบิล (MEDIAN), บิลต่ำสุด-สูงสุด (MIN/MAX) เพื่อเช็กบิล Outlier และวัดความแกว่งยอดขายด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนบิลแยกตามสาขาหรือหมวดเมนู (กาแฟ/ชา/เบเกอรี่) และช่องทางจ่าย QR PromptPay พร้อมคิดสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมยอดขายและหาค่าเฉลี่ยต่อบิลแยกตามสาขาหรือระดับสมาชิก (VIP vs ทั่วไป) โดยล็อกช่วงเซลล์ด้วย $' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมยอดขายสมาชิก VIP ในสาขาหลัก หรือสร้างตาราง Matrix 2 มิติ สาขา × หมวดสินค้าด้วย SUMIFS' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยยอดต่อบิลของออเดอร์ที่สั่ง >= 2 แก้วแยกตามกลุ่มลูกค้า แล้วสรุป Mini-Insights 3 ข้อพร้อมตัวเลขจริง' }
    ]
  },
  {
    no: 6,
    icon: Package,
    name: 'ข้อมูลลูกค้าและจัดส่งพัสดุ',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนพัสดุทั้งหมด (COUNTA), รวมค่าจัดส่งหรือยอด COD ทั้งหมด (SUM) และหาค่าเฉลี่ยวันจัดส่งภาพรวม (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานระยะเวลาส่ง (MEDIAN), ช้าสุด-เร็วสุด (MIN/MAX) และวัดความสม่ำเสมอการขนส่งด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนพัสดุที่จัดส่งสำเร็จ/กำลังส่งแยกตามบริษัทขนส่งหรือภาคปลายทาง พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมค่าจัดส่ง/ยอด COD และหาค่าเฉลี่ยวันจัดส่งแยกตามบริษัทขนส่งหรือประเภทบริการ (ล็อกช่วงด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมค่าจัดส่งหรือยอด COD ของพัสดุส่งด่วน Express ที่ส่งสำเร็จ หรือสร้างตาราง Matrix บริษัทขนส่ง × ภูมิภาค' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยระยะเวลาจัดส่ง (วัน) ของภาคกลางที่เป็นสมาชิก VIP แล้วสรุป Mini-Insights 3 ข้อเปรียบเทียบขนส่ง' }
    ]
  },
  {
    no: 7,
    icon: Car,
    name: 'ข้อมูลการเข้าศูนย์บริการรถ',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนรถเข้าศูนย์ทั้งหมด (COUNTA), รวมรายได้ค่าซ่อมทั้งหมด (SUM) และหาค่าซ่อมเฉลี่ยต่อคัน (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานค่าซ่อม (MEDIAN) เพื่อลดผลจากเคสซ่อมใหญ่, ค่าซ่อมต่ำสุด-สูงสุด (MIN/MAX) และความแกว่งด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนรถที่เข้าศูนย์แยกตามประเภทงานซ่อม (เช็กระยะ/ซ่อมเครื่อง/ช่วงล่าง) พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมรายได้ค่าบริการและหาค่าซ่อมเฉลี่ยแยกตามประเภทรถ (Sedan/SUV/กระบะ) หรือประเภทงานซ่อม (ล็อกช่วงด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมรายได้ค่าบริการของรถ SUV ที่ชำระผ่านบัตรเครดิต หรือสร้างตาราง Matrix ประเภทรถ × ประเภทงานซ่อม' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยค่าซ่อมต่อคันของลูกค้าประจำที่มีระยะทาง >= 50,000 กม. แล้วสรุป Mini-Insights 3 ข้อพร้อมตัวเลขจริง' }
    ]
  },
  {
    no: 8,
    icon: Dumbbell,
    name: 'บันทึกการออกกำลังกาย',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนครั้งที่ออกกำลังกายทั้งหมด (COUNTA), รวมแคลอรีและนาทีทั้งหมด (SUM) และหาแคลอรีเฉลี่ยต่อครั้ง (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานแคลอรี/เวลา (MEDIAN), ต่ำสุด-สูงสุด (MIN/MAX) และวัดความสม่ำเสมอการออกกำลังกายด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนครั้งแยกตามประเภทกิจกรรม (Cardio / Weight Training / Yoga) พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมแคลอรีที่เผาผลาญและหาค่าเฉลี่ยเวลา/อัตราหัวใจแยกตามประเภทกิจกรรมหรือช่วงเวลา (ล็อกช่วงด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมแคลอรีที่เผาผลาญในช่วงเย็นที่ใช้เวลา >= 45 นาที หรือสร้างตาราง Matrix ประเภทกิจกรรม × ช่วงเวลา' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยอัตราการเต้นหัวใจ (BPM) แยกตามประเภทกิจกรรมและเพศ แล้วสรุป Mini-Insights 3 ข้อเทียบ Mean vs Median' }
    ]
  },
  {
    no: 9,
    icon: Tent,
    name: 'ระบบสมัครเข้าค่าย / อีเวนต์',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนผู้สมัครทั้งหมด (COUNTA), รวมรายได้ค่าลงทะเบียนทั้งหมด (SUM) และหาค่าลงทะเบียน/อายุเฉลี่ย (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานอายุผู้เข้าร่วม (MEDIAN), อายุน้อยสุด-มากสุด (MIN/MAX) และความหลากหลายช่วงอายุด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนผู้สมัครที่ชำระเงินแล้วแยกตามขนาดเสื้อ, จังหวัด หรือเวิร์กช็อป พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมรายได้ค่าลงทะเบียนและหาค่าเฉลี่ยต่อคนแยกตามประเภทบัตร (Early Bird / Regular / VIP) โดยล็อกช่วงด้วย $' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมรายได้ค่าลงทะเบียนของบัตร Early Bird ในเวิร์กช็อป AI หรือสร้างตาราง Matrix ประเภทบัตร × เวิร์กช็อป' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยอายุของผู้เข้าร่วมกลุ่มนักศึกษา ปวส. ที่ยืนยันสิทธิ์แล้ว พร้อมสรุป Mini-Insights 3 ข้อสำหรับผู้จัดงาน' }
    ]
  },
  {
    no: 10,
    icon: Swords,
    name: 'สถิติการขายไอเทมเกม',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนรายการขายไอเทมทั้งหมด (COUNTA), รวมรายได้ Gold/THB ทั้งหมด (SUM) และหาราคาขายเฉลี่ยต่อชิ้น (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานราคาไอเทม (MEDIAN) ป้องกันไอเทมแรร์ดึงค่าเฉลี่ย, ต่ำสุด-สูงสุด (MIN/MAX) และความผันผวนราคาด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนไอเทมที่ขายออกแยกตามระดับความหายาก (Common / Epic / Legendary) พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมรายได้และหาราคาขายเฉลี่ยแยกตามสายไอเทม (Weapon / Armor / Skin) หรือเซิร์ฟเวอร์ (ล็อกช่วงด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมยอดรายได้ของไอเทมสาย Weapon ในเซิร์ฟเวอร์ SEA หรือสร้างตาราง Matrix เซิร์ฟเวอร์ × ระดับความหายาก' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยราคาขายไอเทมระดับ Legendary/Epic ที่ซื้อโดยผู้เล่นระดับ Pro แล้วสรุป Mini-Insights 3 ข้อพร้อมตัวเลขจริง' }
    ]
  },
  {
    no: 11,
    icon: GraduationCap,
    name: 'คะแนนสอบและส่งงานรายวิชา',
    tasks: [
      { tag: 'COUNTA / SUM / AVERAGE', text: 'นับจำนวนนักศึกษาทั้งหมด (COUNTA), รวมคะแนนเก็บใบงาน (SUM) และหาค่าเฉลี่ยคะแนนสอบภาพรวม (AVERAGE)' },
      { tag: 'MEDIAN / MIN-MAX / STDEV.S', text: 'หาค่ามัธยฐานคะแนน (MEDIAN), คะแนนต่ำสุด-สูงสุด (MIN/MAX) และวัดการกระจายตัวของคะแนนทั้งห้องด้วย STDEV.S' },
      { tag: 'COUNTIF + % Share', text: 'นับจำนวนนักศึกษาที่สอบผ่านเกณฑ์ (>= 50 คะแนน) และไม่ผ่าน หรือส่งงานครบ พร้อมคำนวณสัดส่วน % Share' },
      { tag: 'SUMIF / AVERAGEIF', text: 'รวมคะแนนใบงานและหาค่าเฉลี่ยคะแนนสอบแยกตามกลุ่มเรียน/ห้องเรียน (ล็อกช่วงเซลล์ด้วย $)' },
      { tag: 'COUNTIFS / SUMIFS', text: 'รวมคะแนนเก็บของห้อง ปวส.1/1 ที่ส่งงานตรงเวลา หรือสร้างตาราง Matrix กลุ่มเรียน × สถานะการส่งงาน' },
      { tag: 'AVERAGEIFS + Insight', text: 'หาค่าเฉลี่ยคะแนนสอบกลางภาคแยกตามกลุ่มเรียนและสถานะการเข้าเรียน แล้วสรุป Mini-Insights 3 ข้อเทียบ Mean vs Median' }
    ]
  }
]

const selectedProjectNo = ref(5)
const selectedProject = computed(
  () => projectTopics.find(p => p.no === selectedProjectNo.value) || projectTopics[0]
)

const copyProjectNote = () => {
  const p = selectedProject.value
  const note = `ใบงานที่ 4 - โปรเจกต์ที่ ${p.no}: ${p.name} (วิเคราะห์ข้อมูล ${ROWS_PER_PROJECT} แถว)`
  navigator.clipboard.writeText(note)
  copiedRowText.value = true
  setTimeout(() => { copiedRowText.value = false }, 2000)
}

// ============================================================================
// GAME CENTER DATA (DRAG & DROP, MATCHING, 10-QUESTION QUIZ)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'หาค่ากลางของเงินเดือนหรือยอดบิลเมื่อในชุดข้อมูลมีค่า Outliers ปะปนอยู่', type: 'summary' },
  { id: 2, text: 'นับจำนวนออเดอร์ที่เกิดใน "สาขาสยาม" และลูกค้าเป็นระดับ "VIP"', type: 'count' },
  { id: 3, text: 'รวมยอดขายทั้งหมดเฉพาะสินค้าหมวด "กาแฟ" ที่มียอดบิล >= 150 บาท', type: 'sum' },
  { id: 4, text: 'หาค่าเฉลี่ยราคาต่อบิลเฉพาะลูกค้าที่จ่ายผ่าน QR PromptPay ในสาขาอโศก', type: 'average' },
  { id: 5, text: 'วัดระดับความแกว่งหรือความกระจายตัวของยอดขายรายวันด้วยค่าเบี่ยงเบนมาตรฐาน', type: 'summary' },
  { id: 6, text: 'นับจำนวนใบงานที่มีสถานะการส่งเป็น "ส่งแล้ว" จากรายชื่อนักศึกษาทั้งหมด', type: 'count' }
]

const dragZonesData = [
  {
    id: 'summary',
    title: 'กลุ่มสถิติพื้นฐานภาพรวม (MEDIAN / STDEV.S)',
    wrapperClass: 'border-teal-400/50 hover:bg-black/40',
    titleClass: 'text-teal-300 border-teal-400/30',
    itemBgClass: 'bg-teal-600/50 border-teal-400',
    emptyTextClass: 'text-teal-200/50',
    emptyText: 'ลากโจทย์สถิติภาพรวมและการกระจายตัวมาวางที่นี่'
  },
  {
    id: 'count',
    title: 'กลุ่มนับจำนวนแบบมีเงื่อนไข (COUNTIF / COUNTIFS)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากโจทย์นับจำนวนตามเงื่อนไขมาวางที่นี่'
  },
  {
    id: 'sum',
    title: 'กลุ่มรวมผลลัพธ์แบบมีเงื่อนไข (SUMIF / SUMIFS)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากโจทย์รวมยอดเงินหรือคะแนนตามเงื่อนไขมาวางที่นี่'
  },
  {
    id: 'average',
    title: 'กลุ่มหาค่าเฉลี่ยแบบมีเงื่อนไข (AVERAGEIF / AVERAGEIFS)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากโจทย์หาค่าเฉลี่ยเฉพาะกลุ่มเป้าหมายมาวางที่นี่'
  }
]

const matchLeftTerms = [
  { id: 'l1', text: '1. =MEDIAN(range)', match: 'r1' },
  { id: 'l2', text: '2. =COUNTIF(range, criteria)', match: 'r2' },
  { id: 'l3', text: '3. =SUMIFS(sum_range, c_range1, c1, ...)', match: 'r3' },
  { id: 'l4', text: '4. =AVERAGEIF(c_range, criteria, avg_range)', match: 'r4' },
  { id: 'l5', text: '5. เครื่องหมาย $ ($B$2:$B$41)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'หาค่ากลางของข้อมูลที่เรียงลำดับแล้ว ทนทานต่อค่าสุดโต่ง (Outliers) ได้ดีกว่าค่าเฉลี่ย' },
  { id: 'r2', text: 'นับจำนวนเซลล์ที่เข้าเกณฑ์ 1 เงื่อนไข เช่น นับจำนวนคำสั่งซื้อของสาขาสยาม' },
  { id: 'r3', text: 'รวมยอดตัวเลขเมื่อผ่านเงื่อนไขตั้งแต่ 2 ข้อขึ้นไป โดยต้องวางช่วงผลรวม (sum_range) ไว้ตัวแรกสุด' },
  { id: 'r4', text: 'หาค่าเฉลี่ยของตัวเลขเฉพาะแถวที่เข้าเกณฑ์ 1 เงื่อนไข โดยวางช่วงเงื่อนไขก่อนแล้วตามด้วยช่วงค่าเฉลี่ย' },
  { id: 'r5', text: 'ล็อกช่วงเซลล์แบบ Absolute Reference เพื่อไม่ให้สูตรเลื่อนเพี้ยนเมื่อกดลากลงแถวถัดไป' }
]

const quizQuestions = [
  {
    id: 1,
    question: "เหตุใดในงานวิเคราะห์ข้อมูลจริง เมื่อข้อมูลมีค่าผิดปกติสุดโต่ง (Outliers) ปะปนอยู่ เช่น ยอดจัดเลี้ยงขนาดใหญ่ 1 บิล เราจึงควรดูค่า MEDIAN ควบคู่กับ AVERAGE?",
    options: [
      { id: 'a', text: "เพราะ MEDIAN ใช้หาค่าสูงสุดของตารางได้เร็วกว่า", isCorrect: false },
      { id: 'b', text: "เพราะ AVERAGE (ค่าเฉลี่ย) ถูกดึงให้สูงหรือต่ำเกินจริงได้ง่ายจากค่าสุดโต่ง ส่วน MEDIAN วัดค่าตำแหน่งตรงกลางจึงทนทานต่อ Outlier ได้ดีกว่า", isCorrect: true },
      { id: 'c', text: "เพราะ Google Sheets ไม่อนุญาตให้ใช้ AVERAGE กับข้อมูลเกิน 10 แถว", isCorrect: false },
      { id: 'd', text: "เพราะ MEDIAN นับได้เฉพาะตัวหนังสือเท่านั้น", isCorrect: false }
    ],
    explanation: "ค่าเฉลี่ยเลขคณิต (AVERAGE) นำทุกค่ามาบวกกันแล้วหารด้วยจำนวนทั้งหมด จึงถูกค่าที่สูงมากเพียงตัวเดียวดึงขึ้นทันที ต่างจากมัธยฐาน (MEDIAN) ที่พิจารณาจากลำดับตำแหน่งตรงกลาง"
  },
  {
    id: 2,
    question: "ข้อใดอธิบายความแตกต่างระหว่างฟังก์ชัน COUNT และ COUNTA ใน Google Sheets / Excel ได้ถูกต้อง?",
    options: [
      { id: 'a', text: "COUNT นับเฉพาะเซลล์ที่มี 'ตัวเลข/วันที่' ส่วน COUNTA นับทุกเซลล์ที่ 'ไม่ว่างเปล่า' (ทั้งข้อความและตัวเลข)", isCorrect: true },
      { id: 'b', text: "COUNT นับเฉพาะข้อความ ส่วน COUNTA นับเฉพาะค่าลบ", isCorrect: false },
      { id: 'c', text: "COUNT ใช้นับแบบมีเงื่อนไข ส่วน COUNTA ใช้รวมยอดเงิน", isCorrect: false },
      { id: 'd', text: "ทั้งสองฟังก์ชันทำงานเหมือนกันทุกประการ ต่างกันแค่ชื่อ", isCorrect: false }
    ],
    explanation: "COUNT(range) จะนับเฉพาะข้อมูลตัวเลขและวันที่ (ไม่นับข้อความ) ในขณะที่ COUNTA(range) ย่อมาจาก Count All คือนับทุกเซลล์ที่มีข้อมูลอยู่จริงไม่ว่าจะเป็นข้อความหรือตัวเลข"
  },
  {
    id: 3,
    question: "ใน Excel / Google Sheets หากพิมพ์สูตร =100-20*2 กับ =(100-20)*2 ผลลัพธ์ที่ได้คือข้อใดตามลำดับ และหากต้องการคูณในสูตรต้องใช้สัญลักษณ์ใด?",
    options: [
      { id: 'a', text: "ได้ 160 และ 60 โดยใช้ตัวอักษร x แทนการคูณ", isCorrect: false },
      { id: 'b', text: "ได้ 60 และ 160 โดยต้องใช้เครื่องหมายดอกจัน (*) แทนการคูณ", isCorrect: true },
      { id: 'c', text: "ได้ 160 เท่ากันทั้งสองสูตร โดยใช้เครื่องหมาย / แทนการคูณ", isCorrect: false },
      { id: 'd', text: "สูตรทั้งสองจะขึ้น Error #NAME? เพราะมีเครื่องหมายลบและคูณอยู่ในสูตรเดียวกัน", isCorrect: false }
    ],
    explanation: "Excel / Google Sheets คำนวณคูณและหารก่อนบวกและลบเสมอ ดังนั้น =100-20*2 จะทำ 20*2=40 ก่อนแล้วค่อย 100-40=60 ส่วน =(100-20)*2 จะทำในวงเล็บก่อนได้ 80*2=160 และต้องใช้ * แทนการคูณ (ห้ามใช้ x)"
  },
  {
    id: 4,
    question: "จากโครงสร้างตารางยอดขาย (B2:B41 = สาขา, I2:I41 = ยอดขาย) ข้อใดเขียนสูตร 'รวมยอดขายเฉพาะสาขาสยาม' ด้วยฟังก์ชัน SUMIF ได้ถูกต้อง?",
    options: [
      { id: 'a', text: '=SUMIF(I2:I41, B2:B41, "สาขาสยาม")', isCorrect: false },
      { id: 'b', text: '=SUMIF("สาขาสยาม", B2:B41, I2:I41)', isCorrect: false },
      { id: 'c', text: '=SUMIF(B2:B41, "สาขาสยาม", I2:I41)', isCorrect: true },
      { id: 'd', text: '=SUMIFS(B2:B41, "สาขาสยาม", I2:I41)', isCorrect: false }
    ],
    explanation: "โครงสร้างของ SUMIF แบบ 1 เงื่อนไขคือ =SUMIF(criteria_range, criteria, sum_range) โดยเอาช่วงเงื่อนไขขึ้นก่อน และเอาช่วงตัวเลขที่จะบวก (I2:I41) ไว้ตัวสุดท้าย"
  },
  {
    id: 5,
    question: "ข้อใดคือ 'จุดผิดพลาดที่พบบ่อยที่สุด' เมื่อเปลี่ยนจากการเขียนสูตร SUMIF (1 เงื่อนไข) ไปเป็น SUMIFS (หลายเงื่อนไข)?",
    options: [
      { id: 'a', text: "SUMIFS ใช้กับตัวเลขติดทศนิยมไม่ได้", isCorrect: false },
      { id: 'b', text: "ลืมสลับตำแหน่ง sum_range จากตัวสุดท้ายของ SUMIF มาวางเป็นอาร์กิวเมนต์ 'ตัวแรกสุด' ใน SUMIFS", isCorrect: true },
      { id: 'c', text: "SUMIFS บังคับให้ใช้เงื่อนไขได้ไม่เกิน 2 ข้อเท่านั้น", isCorrect: false },
      { id: 'd', text: "ใน SUMIFS ห้ามใส่เครื่องหมายคำพูดครอบเงื่อนไขข้อความ", isCorrect: false }
    ],
    explanation: "กฎเหล็กที่ต้องจำ: SUMIF วางช่วงผลรวม (sum_range) ไว้ท้ายสุด แต่ SUMIFS และ AVERAGEIFS ต้องย้าย sum_range / average_range มาวางไว้เป็นตัวแรกสุดเสมอ แล้วค่อยตามด้วยคู่เงื่อนไข"
  },
  {
    id: 6,
    question: "ต้องการหา 'ยอดขายรวม' เฉพาะสาขาสยาม (B2:B41) ที่สั่งเมนูหมวด 'กาแฟ' (C2:C41) โดยยอดขายอยู่ที่ I2:I41 ต้องเขียนสูตรใด?",
    options: [
      { id: 'a', text: '=SUMIFS(I2:I41, B2:B41, "สาขาสยาม", C2:C41, "กาแฟ")', isCorrect: true },
      { id: 'b', text: '=SUMIFS(B2:B41, "สาขาสยาม", C2:C41, "กาแฟ", I2:I41)', isCorrect: false },
      { id: 'c', text: '=SUMIF(I2:I41, B2:B41, "สาขาสยาม", C2:C41, "กาแฟ")', isCorrect: false },
      { id: 'd', text: '=COUNTIFS(I2:I41, B2:B41, "สาขาสยาม", C2:C41, "กาแฟ")', isCorrect: false }
    ],
    explanation: "SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2) เริ่มด้วย I2:I41 แล้วตามด้วยคู่ของคอลัมน์ B=\"สาขาสยาม\" และคู่ของคอลัมน์ C=\"กาแฟ\""
  },
  {
    id: 7,
    question: "หากต้องการนับจำนวนบิลในคอลัมน์ I2:I41 ที่มียอดขาย 'ตั้งแต่ 150 บาทขึ้นไป' ต้องเขียนเงื่อนไข (Criteria) ในสูตร COUNTIF อย่างไร?",
    options: [
      { id: 'a', text: '=COUNTIF(I2:I41, >=150)', isCorrect: false },
      { id: 'b', text: '=COUNTIF(I2:I41, ">=150")', isCorrect: true },
      { id: 'c', text: '=COUNTIF(I2:I41, =>150)', isCorrect: false },
      { id: 'd', text: '=COUNTIF(I2:I41, "มากกว่าเท่ากับ 150")', isCorrect: false }
    ],
    explanation: "เมื่อใช้ตัวดำเนินการเปรียบเทียบ เช่น >, >=, <, <=, <> ในฟังก์ชันตระกูล IF/IFS ต้องเขียนเครื่องหมายตามหลักคณิตศาสตร์ (>= ไม่ใช่ =>) และครอบด้วยเครื่องหมายคำพูด \">=150\""
  },
  {
    id: 8,
    question: "ข้อใดเขียนสูตร 'นับจำนวนบิลที่มียอดขายอยู่ระหว่าง 100 ถึง 300 บาท (รวม 100 และ 300)' ในช่วง I2:I41 ได้ถูกต้อง?",
    options: [
      { id: 'a', text: '=COUNTIF(I2:I41, ">=100 AND <=300")', isCorrect: false },
      { id: 'b', text: '=COUNTIFS(I2:I41, ">=100", I2:I41, "<=300")', isCorrect: true },
      { id: 'c', text: '=COUNTIF(I2:I41, 100-300)', isCorrect: false },
      { id: 'd', text: '=SUMIFS(I2:I41, ">=100", "<=300")', isCorrect: false }
    ],
    explanation: "การเช็กช่วงตัวเลขบนคอลัมน์เดียวกันใช้ COUNTIFS โดยระบุช่วง I2:I41 ซ้ำเป็น 2 เงื่อนไข คือ >=100 และ <=300 เพื่อให้เข้าเงื่อนไขทั้งสองข้อพร้อมกัน"
  },
  {
    id: 9,
    question: "เหตุใดเมื่อสร้างตารางสรุปแล้วลากสูตรลงด้านล่าง (เช่น ลากจาก 'สาขาสยาม' ลงไป 'สาขาลาดพร้าว' และ 'สาขาอโศก') จึงต้องใส่เครื่องหมาย $ เช่น $B$2:$B$41?",
    options: [
      { id: 'a', text: "เพื่อเปลี่ยนสกุลเงินของยอดขายให้เป็นดอลลาร์สหรัฐ", isCorrect: false },
      { id: 'b', text: "เพื่อล็อกช่วงข้อมูลต้นทางแบบ Absolute Reference ไม่ให้ตำแหน่งแถวขยับเลื่อนตามเมื่อคัดลอกสูตรลงมา", isCorrect: true },
      { id: 'c', text: "เพื่อซ่อนตัวเลขไม่ให้ผู้อื่นมองเห็นสูตร", isCorrect: false },
      { id: 'd', text: "เพื่อบังคับให้สูตรคำนวณเฉพาะค่าจำนวนเต็มเท่านั้น", isCorrect: false }
    ],
    explanation: "ถ้าไม่ใส่เครื่องหมาย $ (กด F4) เมื่อคัดลอกสูตรลง 1 แถว ช่วงข้อมูล B2:B41 จะเลื่อนเป็น B3:B42 และหลุดข้อมูลแถวบนๆ ไปเรื่อยๆ ทำให้ผลรวมหรือจำนวนนับผิดพลาด"
  },
  {
    id: 10,
    question: "ค่า STDEV.S (Sample Standard Deviation) ที่คำนวณได้จากยอดขายต่อบิลของสาขาหนึ่ง มีประโยชน์ต่อการตัดสินใจทางธุรกิจอย่างไร?",
    options: [
      { id: 'a', text: "บอกได้ว่ายอดขายต่อบิลมีความสม่ำเสมอหรือแกว่งตัวห่างจากค่าเฉลี่ยมากน้อยเพียงใด", isCorrect: true },
      { id: 'b', text: "บอกชื่อเมนูที่ขายดีที่สุดในร้านได้โดยตรง", isCorrect: false },
      { id: 'c', text: "ใช้แทนฟังก์ชัน SUM เพื่อคำนวณกำไรสุทธิ", isCorrect: false },
      { id: 'd', text: "ใช้ลบข้อมูลซ้ำซ้อนออกจากตารางอัตโนมัติ", isCorrect: false }
    ],
    explanation: "ส่วนเบี่ยงเบนมาตรฐาน (Standard Deviation) ใช้วัดการกระจายตัวของข้อมูล ถ้าค่า STDEV สูงแสดงว่ายอดซื้อแต่ละบิลต่างกันมาก (มีทั้งบิลเล็กมากและบิลใหญ่มาก) ถ้าต่ำแสดงว่าลูกค้าจ่ายใกล้เคียงกันสม่ำเสมอ"
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-12 px-4 md:px-8">

    <!-- =================================================================== -->
    <!-- HERO BANNER                                                         -->
    <!-- =================================================================== -->
    <div
      class="bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
      <div class="absolute right-8 top-6 opacity-15 pointer-events-none hidden lg:block">
        <BarChart3 class="w-52 h-52 text-white" />
      </div>

      <div class="relative z-10 max-w-4xl space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-cyan-200 text-xs font-black border border-white/20">
            <Sparkles class="w-3.5 h-3.5" />
            <span>สัปดาห์ที่ 4 • Phase 1: Data Analysis (รหัสวิชา 31901-2012)</span>
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-300/30">
            <span>ต่อยอดจาก Cleaned Data สัปดาห์ที่ 3</span>
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          การวิเคราะห์เชิงสถิติและการสรุปข้อมูลแบบมีเงื่อนไข<br />
          <span class="text-lg sm:text-2xl text-cyan-200 font-bold">
            (Summary Statistics &amp; Conditional Aggregations)
          </span>
        </h1>

        <p class="text-xs sm:text-sm text-sky-100/95 font-medium leading-relaxed">
          เมื่อข้อมูลจากสัปดาห์ที่ 3 สะอาด 100% แล้ว สัปดาห์นี้เราจะปูพื้นฐาน <strong>สูตรคำนวณ Excel/Sheets (+ &minus; &times; &divide;, SUM, COUNT)</strong>
          ต่อยอดสู่ <strong>สถิติภาพรวม (<code>Mean vs Median</code>)</strong>, การเขียนสูตรเงื่อนไข 1 มิติและหลายมิติ
          (<code>COUNTIF/S</code>, <code>SUMIF/S</code>, <code>AVERAGEIF/S</code>) และ <strong>ลงมือภาคปฏิบัติสร้างแดชบอร์ดตัวเลข 4 โซน (Numeric KPI Dashboard)</strong>!
        </p>

        <div class="pt-2 flex flex-wrap gap-2 text-xs font-bold">
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <FileSpreadsheet class="w-4 h-4 text-emerald-300" />
            Basic Excel (+ &minus; &times; &divide;, SUM, COUNT)
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <TrendingUp class="w-4 h-4 text-cyan-300" />
            Summary Stats &amp; Mean vs Median
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Filter class="w-4 h-4 text-amber-300" />
            IF / IFS &amp; Formula Vocabulary
          </span>
          <span
            class="px-3 py-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <SlidersHorizontal class="w-4 h-4 text-purple-300" />
            Numeric KPI Dashboard (6 Steps)
          </span>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- CHECK-IN BAR & QUICK ACTION BUTTONS                                 -->
    <!-- =================================================================== -->
    <div class="space-y-4">
      <CheckInSystem :course-id="currentCourseId" :week-number="currentWeek" />

      <div class="flex items-center justify-end gap-3 flex-wrap">
        <button @click="showPreTestModal = true" type="button"
          class="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95">
          <Sparkles class="w-4 h-4 text-amber-300" />
          <span>แบบทดสอบก่อนเรียน (Pre-test)</span>
        </button>

        <button @click="showPdfModal = true" type="button"
          class="px-5 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 cursor-pointer transition-all active:scale-95">
          <Download class="w-4 h-4" />
          <span>ดูใบสรุปสูตร PDF</span>
        </button>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- BRIDGE FROM WEEK 3 BANNER                                           -->
    <!-- =================================================================== -->
    <div
      class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white shadow-md relative overflow-hidden border border-sky-800/60">
      <div class="relative z-10 max-w-4xl space-y-3">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
          <Zap class="w-3.5 h-3.5 text-emerald-400" /> จากข้อมูลตั้งต้น Master_data สู่ชีตวิเคราะห์แยกเฉพาะ Numeric_Dashboard
        </div>
        <h3 class="text-xl sm:text-2xl font-bold leading-tight">
          คลีนข้อมูลเสร็จแล้ว... แยกชีต <code>Master_data</code> เก็บไว้เป็นต้นฉบับ แล้วคัดลอกไปทำแดชบอร์ดในชีตใหม่!
        </h3>
        <p class="text-xs sm:text-sm text-sky-100 leading-relaxed">
          หลักการทำงานที่ดีของ Data Analyst คือ<strong>เก็บข้อมูลที่คลีนเรียบร้อยแล้วไว้ในชีต <code>Master_data</code> ห้ามแก้ไขทับโดยตรง</strong>
          เมื่อต้องการวิเคราะห์หรือสร้างรายงานเรื่องใด ให้<strong>คัดลอกแยกออกมาเป็นอีกชีต (หรืออีกไฟล์ Spreadsheet)</strong>
          เช่น ชีต <strong><code>Numeric_Dashboard</code></strong> แล้วเขียนสูตร
          <code>=SUM()</code>, <code>=MEDIAN()</code>, <code>=STDEV.S()</code>, <code>=COUNTIFS()</code>, <code>=SUMIFS()</code>
          อ้างอิงข้อมูลในชีตเดียวกันเลย โดยไม่ต้องเชื่อมสูตรข้ามตารางให้สับสน!
        </p>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- CHAPTER OBJECTIVES & COMPETENCIES                                   -->
    <!-- =================================================================== -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-sky-100 rounded-xl text-sky-700 shadow-2xs">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-800">จุดประสงค์และสมรรถนะประจำสัปดาห์ที่ 4</h2>
          <p class="text-sm text-slate-500 mt-0.5">
            หน่วยการเรียนรู้: สูตรพื้นฐาน Excel, สถิติเชิงพรรณนา และการสรุปแดชบอร์ดตัวเลขแบบมีเงื่อนไข
          </p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-2xs border border-sky-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. ผลลัพธ์การเรียนรู้ -->
          <div class="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
            <div class="flex items-center gap-2 text-sky-900 font-bold">
              <Lightbulb class="w-5 h-5 shrink-0 text-sky-600" />
              <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              ผู้เรียนสามารถเขียนสูตรคำนวณพื้นฐาน (+, -, *, /, ()), ฟังก์ชัน <code>SUM</code>, ตระกูล <code>COUNT</code>, เลือกใช้ค่ากลางทางสถิติ (Mean vs Median)
              และเขียนสูตรสรุปข้อมูลแบบมีเงื่อนไข 1 มิติและหลายมิติบน Google Sheets / Excel ได้อย่างถูกต้อง
            </p>
          </div>

          <!-- 2. สมรรถนะประจำหน่วย -->
          <div class="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-100 space-y-2">
            <div class="flex items-center gap-2 text-cyan-900 font-bold">
              <Award class="w-5 h-5 shrink-0 text-cyan-600" />
              <span>2. สมรรถนะประจำหน่วย</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              จัดการข้อมูลแบบมืออาชีพด้วยชีตต้นฉบับ <code>Master_data</code> แล้วแยกคัดลอกเป็นชีต <code>Numeric_Dashboard</code>
              เพื่อสร้างแดชบอร์ดตัวเลข 4 โซน: คำนวณ KPI ภาพรวม (รวม <code>MEDIAN</code>, <code>STDEV.S</code>, <code>MIN/MAX</code>),
              สรุป 1 เงื่อนไข + % Share, ตาราง Matrix 2 มิติ และสรุป Mini-Insights 3 ข้อสนับสนุนการตัดสินใจได้จริง
            </p>
          </div>

          <!-- 3. วัตถุประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="flex items-center gap-2 text-slate-900 font-bold">
              <CheckSquare class="w-5 h-5 shrink-0 text-slate-700" />
              <span>3. วัตถุประสงค์เชิงพฤติกรรม</span>
            </div>
            <ul class="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>เขียนสูตร <code>+ - * / ()</code>, <code>SUM</code> และแยกใช้ <code>COUNT/COUNTA/COUNTBLANK</code> ได้</li>
              <li>คำนวณ <code>AVERAGE</code>, <code>MEDIAN</code>, <code>MIN</code>, <code>MAX</code>, <code>STDEV.S</code> และอธิบายกับดัก Outlier ได้</li>
              <li>เข้าใจพารามิเตอร์ <code>criteria_range</code>, <code>criteria</code>, <code>sum_range</code>, <code>average_range</code></li>
              <li>ประยุกต์ใช้ <code>IF/IFS</code> พร้อมล็อกเซลล์ (<code>$A$1</code>, <code>$K20</code>, <code>L$19</code>) และแก้ไข Error ยอดฮิตได้</li>
              <li>สร้างแดชบอร์ดตัวเลข 4 โซนและคำนวณสัดส่วนร้อยละ (% Share) ได้</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- MAIN LECTURE CONTENT                                                -->
    <!-- =================================================================== -->
    <section class="space-y-8">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-sky-100 rounded-xl text-sky-600 shadow-2xs">
            <BookOpen class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">เนื้อหาบทเรียนประจำสัปดาห์ที่ 4</h2>
            <p class="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-1.5">
              <span>ปูพื้นฐานสูตร Excel (+ &minus; &times; &divide;, SUM, COUNT)</span>
              <ArrowRight class="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>สถิติภาพรวม</span>
              <ArrowRight class="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>สูตร 1 เงื่อนไข</span>
              <ArrowRight class="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>สูตรหลายเงื่อนไข</span>
              <ArrowRight class="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>แยกชีตปฏิบัติสร้างแดชบอร์ดตัวเลข</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 1: EXCEL / GOOGLE SHEETS BASIC FORMULAS (+ - * / SUM COUNT)-->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-200 shadow-2xs space-y-6">
        <div class="border-b border-emerald-100 pb-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider">
              หน่วยการเรียนรู้ที่ 1 • ปูพื้นฐานก่อนเริ่ม
            </span>
            <span class="px-2.5 py-0.5 bg-sky-100 text-sky-800 font-bold text-xs rounded-full">
              Basic Excel &amp; Google Sheets Formulas
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-emerald-950 mt-2 flex items-center gap-2">
            <FileSpreadsheet class="w-6 h-6 text-emerald-600" />
            พื้นฐานการเขียนสูตรคำนวณ Excel / Google Sheets (บวก ลบ คูณ หาร, SUM และ COUNT)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            ก่อนจะไปเขียนสูตรขั้นสูง ต้องเข้าใจวิธีพิมพ์สูตรเริ่มต้น การอ้างอิงเซลล์ และความแตกต่างระหว่างฟังก์ชัน <code>SUM</code> กับตระกูล <code>COUNT</code> ให้แม่นยำก่อน
          </p>
        </div>

        <!-- 1.1 Golden Rules of Writing Formulas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
            <div class="font-black text-sky-900 text-sm">กฎข้อที่ 1: ต้องขึ้นต้นด้วย = เสมอ</div>
            <p class="text-slate-600 leading-relaxed">
              ทุกสูตรใน Excel / Google Sheets ต้องเริ่มด้วยเครื่องหมาย <code>=</code> เช่น <code>=B2*C2</code>
              หากลืมใส่ <code>=</code> โปรแกรมจะมองว่าเป็นตัวหนังสือธรรมดาและไม่คำนวณให้
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div class="font-black text-emerald-900 text-sm">กฎข้อที่ 2: อ้างอิง "ชื่อเซลล์" แทนพิมพ์ตัวเลข</div>
            <p class="text-slate-600 leading-relaxed">
              ให้พิมพ์ <code>=B2*C2</code> แทน <code>=2*65</code> เพราะเมื่อแก้ไขราคาหรือจำนวนในตาราง ผลลัพธ์จะอัปเดตตามทันทีอัตโนมัติ (Dynamic)
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
            <div class="font-black text-indigo-900 text-sm">กฎข้อที่ 3: รู้จัก : ("ถึง") vs , ("และ")</div>
            <p class="text-slate-600 leading-relaxed">
              • <code>=SUM(F2:F4)</code> ใช้ <code>:</code> แปลว่า <strong>ตั้งแต่ F2 ถึง F4</strong> (F2, F3, F4)<br />
              • <code>=SUM(F2, F4)</code> ใช้ <code>,</code> แปลว่า <strong>เฉพาะ F2 และ F4 เท่านั้น</strong>
            </p>
          </div>
        </div>

        <!-- 1.2 Basic Arithmetic Operators (+, -, *, /, ()) -->
        <div class="space-y-3">
          <div class="font-black text-slate-800 text-sm sm:text-base">
            เครื่องหมายคำนวณพื้นฐาน 5 แบบใน Excel / Google Sheets (ห้ามใช้ตัว x หรือ &divide;)
          </div>
          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-800 text-white">
                <tr>
                  <th class="p-3 font-bold">การคำนวณ</th>
                  <th class="p-3 font-bold text-center">สัญลักษณ์ที่ต้องพิมพ์</th>
                  <th class="p-3 font-bold">ตัวอย่างสูตรจริง</th>
                  <th class="p-3 font-bold">คำอธิบาย &amp; จุดที่มักพิมพ์ผิด</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
                <tr>
                  <td class="p-3 font-bold text-sky-900">บวก (Addition)</td>
                  <td class="p-3 text-center font-mono text-lg font-black text-sky-600">+</td>
                  <td class="p-3 font-mono text-xs text-sky-700 font-bold">=B2+C2</td>
                  <td class="p-3 text-xs">นำค่าในเซลล์ <code>B2</code> มาบวกกับค่าในเซลล์ <code>C2</code></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-rose-900">ลบ (Subtraction)</td>
                  <td class="p-3 text-center font-mono text-lg font-black text-rose-600">-</td>
                  <td class="p-3 font-mono text-xs text-rose-700 font-bold">=E2-D2</td>
                  <td class="p-3 text-xs">นำราคารวมหักลบส่วนลด (<code>E2 - D2</code>) หรือคำนวณกำไร = รายรับ - ต้นทุน</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-emerald-900">คูณ (Multiplication)</td>
                  <td class="p-3 text-center font-mono text-lg font-black text-emerald-600">*</td>
                  <td class="p-3 font-mono text-xs text-emerald-700 font-bold">=B2*C2</td>
                  <td class="p-3 text-xs text-rose-700 font-medium">
                    ต้องใช้เครื่องหมายดอกจัน <code>*</code> เสมอ <strong>ห้ามพิมพ์ตัวอักษร x</strong> (สูตรจะ Error <code>#NAME?</code>)
                  </td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-purple-900">หาร (Division)</td>
                  <td class="p-3 text-center font-mono text-lg font-black text-purple-600">/</td>
                  <td class="p-3 font-mono text-xs text-purple-700 font-bold">=F2/B2</td>
                  <td class="p-3 text-xs text-rose-700 font-medium">
                    ใช้เครื่องหมายทับ <code>/</code> (ระวังอย่าหารด้วย <code>0</code> เพราะจะขึ้น Error <code>#DIV/0!</code>)
                  </td>
                </tr>
                <tr class="bg-amber-50/50">
                  <td class="p-3 font-bold text-amber-950">วงเล็บ (Order of Operations)</td>
                  <td class="p-3 text-center font-mono text-lg font-black text-amber-600">( )</td>
                  <td class="p-3 font-mono text-xs text-amber-800 font-bold">=(B2*C2)-D2</td>
                  <td class="p-3 text-xs">
                    Excel คิด <strong>คูณ/หาร ก่อน บวก/ลบ</strong> เสมอ เช่น <code>=100-20*2</code> ได้ <strong>60</strong>
                    แต่ถ้าอยากลบก่อนต้องใส่วงเล็บ <code>=(100-20)*2</code> จะได้ <strong>160</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 1.3 Interactive Basic Arithmetic + SUM Mini-Lab -->
        <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                Interactive Mini-Lab • ลองแก้ตัวเลขแล้วดูผลจากสูตร + - * / และ SUM สดๆ
              </span>
              <h4 class="font-black text-base text-white mt-1.5">
                จำลองตารางสเปรดชีตคิดเงินร้านคาเฟ่ (ปรับช่อง จำนวน / ราคา / ส่วนลด ด้านล่างได้ทันที)
              </h4>
            </div>
            <button @click="resetBasicCalc" type="button"
              class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
              <RefreshCw class="w-3.5 h-3.5" />
              <span>รีเซ็ตค่าเริ่มต้น</span>
            </button>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-800 text-slate-300 font-sans">
                <tr>
                  <th class="p-2.5">Row</th>
                  <th class="p-2.5">A: รายการสินค้า</th>
                  <th class="p-2.5 text-center">B: จำนวน (แก้ได้)</th>
                  <th class="p-2.5 text-center">C: ราคา/ชิ้น (แก้ได้)</th>
                  <th class="p-2.5 text-center">D: ส่วนลด (แก้ได้)</th>
                  <th class="p-2.5 text-right">E: ราคาก่อนลด (=B*C)</th>
                  <th class="p-2.5 text-right">F: ยอดสุทธิ (=(B*C)-D)</th>
                  <th class="p-2.5 text-right">G: เฉลี่ย/ชิ้น (=F/B)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-200">
                <tr v-for="(item, idx) in basicCalcRows" :key="item.rowNum">
                  <td class="p-2.5 text-slate-500">{{ item.rowNum }}</td>
                  <td class="p-2.5 font-sans font-bold text-white">{{ item.name }}</td>
                  <td class="p-2 text-center">
                    <input v-model.number="basicCalcItems[idx].qty" type="number" min="0" max="999"
                      class="w-16 px-2 py-1 rounded bg-slate-800 border border-sky-500/50 text-center text-sky-300 font-bold focus:outline-none focus:border-sky-400" />
                  </td>
                  <td class="p-2 text-center">
                    <input v-model.number="basicCalcItems[idx].unitPrice" type="number" min="0" max="9999"
                      class="w-20 px-2 py-1 rounded bg-slate-800 border border-sky-500/50 text-center text-amber-300 font-bold focus:outline-none focus:border-amber-400" />
                  </td>
                  <td class="p-2 text-center">
                    <input v-model.number="basicCalcItems[idx].discount" type="number" min="0" max="9999"
                      class="w-20 px-2 py-1 rounded bg-slate-800 border border-rose-500/40 text-center text-rose-300 font-bold focus:outline-none focus:border-rose-400" />
                  </td>
                  <td class="p-2.5 text-right">
                    <div class="font-bold text-slate-200">{{ item.subtotal.toLocaleString() }}</div>
                    <div class="text-[10px] text-slate-500">=B{{ item.rowNum }}*C{{ item.rowNum }}</div>
                  </td>
                  <td class="p-2.5 text-right">
                    <div class="font-black text-emerald-300 text-sm">{{ item.netTotal.toLocaleString() }}</div>
                    <div class="text-[10px] text-emerald-500/80">=(B{{ item.rowNum }}*C{{ item.rowNum }})-D{{ item.rowNum }}</div>
                  </td>
                  <td class="p-2.5 text-right">
                    <div class="font-bold text-purple-300">{{ item.avgPerUnit.toFixed(2) }}</div>
                    <div class="text-[10px] text-slate-500">=F{{ item.rowNum }}/B{{ item.rowNum }}</div>
                  </td>
                </tr>
                <!-- Row 5: Total SUM & COUNT -->
                <tr class="bg-emerald-950/60 border-t-2 border-emerald-500/50 font-bold">
                  <td class="p-2.5 text-emerald-400">5</td>
                  <td class="p-2.5 font-sans text-emerald-300">
                    รวมทั้งหมด (<code>=SUM(...)</code>)<br />
                    <span class="text-[10px] font-mono text-sky-300">นับจำนวนแถว: =COUNT(F2:F4) &rarr; {{ basicCalcTotals.countItems }} แถว</span>
                  </td>
                  <td class="p-2.5 text-center text-sky-300">
                    {{ basicCalcTotals.totalQty }}<br />
                    <span class="text-[10px] text-slate-400 font-normal">=SUM(B2:B4)</span>
                  </td>
                  <td class="p-2.5 text-center text-slate-500">-</td>
                  <td class="p-2.5 text-center text-rose-300">
                    {{ basicCalcTotals.totalDiscount }}<br />
                    <span class="text-[10px] text-slate-400 font-normal">=SUM(D2:D4)</span>
                  </td>
                  <td class="p-2.5 text-right text-slate-200">
                    {{ basicCalcTotals.totalSubtotal.toLocaleString() }}<br />
                    <span class="text-[10px] text-slate-400 font-normal">=SUM(E2:E4)</span>
                  </td>
                  <td class="p-2.5 text-right text-emerald-300 text-base font-black">
                    {{ basicCalcTotals.totalNet.toLocaleString() }} ฿<br />
                    <span class="text-[10px] text-emerald-400 font-normal">=SUM(F2:F4)</span>
                  </td>
                  <td class="p-2.5 text-right text-slate-500">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 1.4 SUM & COUNT Family Comparison (COUNT vs COUNTA vs COUNTBLANK) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-emerald-950 text-base">ทำไมต้องใช้ SUM แทน + ทีละช่อง?</span>
              <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[11px] font-bold">ฟังก์ชันผลรวม</span>
            </div>
            <div class="p-3 rounded-xl bg-white border border-emerald-200 font-mono text-xs space-y-1.5">
              <div class="flex items-center gap-1.5 text-rose-600">
                <XCircle class="w-4 h-4 shrink-0" />
                <span>บวกมือช้ามาก: =I2+I3+I4+...+I25</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <span>ใช้ฟังก์ชัน: =SUM(I2:I25)</span>
              </div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              <code>=SUM(ช่วงข้อมูล)</code> ช่วยรวมตัวเลขทีละร้อยหรือพันแถวได้ในคลิกเดียว และข้ามช่องที่เป็นข้อความให้โดยไม่เกิด Error
            </p>
          </div>

          <div class="lg:col-span-7 p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="font-black text-sky-950 text-base">รู้จัก 3 พี่น้องตระกูลนับ: COUNT vs COUNTA vs COUNTBLANK</span>
              <span class="px-2 py-0.5 rounded bg-sky-200 text-sky-900 text-[11px] font-bold">ตัวอย่างช่วง A2:A7</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <!-- Sample Column A2:A7 -->
              <div class="sm:col-span-4 rounded-xl bg-white border border-sky-200 overflow-hidden text-xs font-mono">
                <div class="bg-slate-800 text-white px-3 py-1.5 font-bold text-center">ตัวอย่าง A2:A7</div>
                <div class="divide-y divide-slate-100">
                  <div class="px-3 py-1 flex justify-between"><span class="text-slate-400">A2</span><span class="font-bold text-slate-800">65</span></div>
                  <div class="px-3 py-1 flex justify-between"><span class="text-slate-400">A3</span><span class="font-bold text-slate-800">75</span></div>
                  <div class="px-3 py-1 flex justify-between bg-amber-50"><span class="text-slate-400">A4</span><span class="font-sans text-amber-800">"ยกเลิก"</span></div>
                  <div class="px-3 py-1 flex justify-between bg-rose-50"><span class="text-slate-400">A5</span><span class="font-sans text-rose-500 italic">(ช่องว่าง)</span></div>
                  <div class="px-3 py-1 flex justify-between"><span class="text-slate-400">A6</span><span class="font-bold text-slate-800">120</span></div>
                  <div class="px-3 py-1 flex justify-between"><span class="text-slate-400">A7</span><span class="font-bold text-slate-800">80</span></div>
                </div>
              </div>

              <!-- 3 Result Cards -->
              <div class="sm:col-span-8 space-y-2 text-xs">
                <div class="p-2.5 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
                  <div>
                    <code class="font-bold text-sky-700">=COUNT(A2:A7)</code>
                    <p class="text-slate-600 text-[11px]">นับเฉพาะช่องที่เป็น <strong>"ตัวเลข/วันที่"</strong> (ข้าม "ยกเลิก" และช่องว่าง)</p>
                  </div>
                  <span class="px-3 py-1 rounded-lg bg-sky-600 text-white font-mono font-black text-sm shrink-0">4</span>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-indigo-200 flex items-center justify-between gap-2">
                  <div>
                    <code class="font-bold text-indigo-700">=COUNTA(A2:A7)</code>
                    <p class="text-slate-600 text-[11px]">Count All: นับทุกช่องที่ <strong>"ไม่ว่างเปล่า"</strong> (นับทั้งตัวเลข + คำว่า "ยกเลิก")</p>
                  </div>
                  <span class="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-black text-sm shrink-0">5</span>
                </div>

                <div class="p-2.5 rounded-xl bg-white border border-rose-200 flex items-center justify-between gap-2">
                  <div>
                    <code class="font-bold text-rose-700">=COUNTBLANK(A2:A7)</code>
                    <p class="text-slate-600 text-[11px]">นับเฉพาะ <strong>"ช่องว่างเปล่า"</strong> (ใช้ตรวจหา Missing Values จากสัปดาห์ที่ 3)</p>
                  </div>
                  <span class="px-3 py-1 rounded-lg bg-rose-600 text-white font-mono font-black text-sm shrink-0">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 2: SUMMARY STATISTICS & MEAN VS MEDIAN TRAP                -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 2
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <TrendingUp class="w-6 h-6 text-sky-600" />
            สถิติเชิงพรรณนาภาพรวม (Summary Statistics) และกับดัก Mean vs Median
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            รู้จักตัวชี้วัดพื้นฐาน 10 ตัวที่ Data Analyst ต้องคำนวณทุกครั้งเมื่อเปิดตารางข้อมูลใหม่
          </p>
        </div>

        <!-- 2.1 Glossary Box + Comparison Table -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sky-900 font-black text-base">
            <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-mono">2.1</span>
            <span>ภาพรวมคำศัพท์สำคัญและตารางฟังก์ชันสถิติพื้นฐาน</span>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-sky-200/80 space-y-3">
            <div class="flex items-center gap-2 text-sky-950 font-black text-sm">
              <Info class="w-4 h-4 text-sky-600 shrink-0" />
              <span>คำศัพท์พื้นฐานทางสถิติและสเปรดชีตที่ต้องรู้ก่อนเริ่ม (Key Terms)</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div class="font-bold text-sky-800 font-mono">1. range (ช่วงเซลล์ข้อมูล)</div>
                <p class="text-slate-600 leading-relaxed">
                  กลุ่มเซลล์ที่ลากคลุมต่อเนื่องกัน เช่น <code>I2:I41</code> หมายถึงช่วงข้อมูลตั้งแต่แถวที่ 2 ถึง 41 ในคอลัมน์ <code>I</code>
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div class="font-bold text-emerald-800 font-mono">2. KPI (Key Performance Indicator)</div>
                <p class="text-slate-600 leading-relaxed">
                  ตัวชี้วัดหลักที่ใช้สรุปภาพรวมผลงานธุรกิจ เช่น ยอดขายรวม, จำนวนบิลทั้งหมด, ค่าเฉลี่ยต่อบิล
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div class="font-bold text-rose-700 font-mono">3. Outlier (ค่าผิดปกติสุดโต่ง)</div>
                <p class="text-slate-600 leading-relaxed">
                  ตัวเลขที่สูงหรือต่ำโดดออกจากกลุ่มมาก (เช่น บิลทั่วไป 80 บาท แต่มีบิลจัดเลี้ยงบริษัท 4,500 บาท)
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div class="font-bold text-purple-800 font-mono">4. Percentile &amp; % Share</div>
                <p class="text-slate-600 leading-relaxed">
                  <code>Percentile</code> คือเส้นแบ่งอันดับ (เช่น <code>0.9</code> = ท็อป 10%) ส่วน <code>% Share</code> คือสัดส่วนร้อยละเทียบยอดรวม
                </p>
              </div>
            </div>
          </div>

          <!-- Comparison Table of Summary Functions -->
          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-sky-900 text-white">
                <tr>
                  <th class="p-3.5 font-bold">กลุ่มสถิติ</th>
                  <th class="p-3.5 font-bold">ฟังก์ชัน Google Sheets / Excel</th>
                  <th class="p-3.5 font-bold">หน้าที่และการนำไปใช้ตอบคำถาม</th>
                  <th class="p-3.5 font-bold">ข้อควรระวัง (Pro Tip)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 bg-white">
                <tr class="hover:bg-sky-50/40 bg-slate-50/50">
                  <td class="p-3.5 font-bold text-sky-800">ทวนจากหน่วยที่ 1:<br />ปริมาณ &amp; ผลรวม</td>
                  <td class="p-3.5 font-mono text-xs text-sky-700 font-bold">
                    =COUNT(I2:I41)<br />=COUNTA(A2:A41)<br />=SUM(I2:I41)
                  </td>
                  <td class="p-3.5">
                    ใช้สรุปจำนวนบิลและยอดขายรวมทั้งหมดก่อนคำนวณสถิติอื่น (รายละเอียดและตัวอย่างอยู่ในหน่วยที่ 1)
                  </td>
                  <td class="p-3.5 text-xs text-slate-500">
                    ย้ำ: <code>COUNTA</code> ใช้กับคอลัมน์รหัสข้อความ เช่น Order_ID
                  </td>
                </tr>
                <tr class="hover:bg-sky-50/40">
                  <td class="p-3.5 font-bold text-indigo-800">ค่ากลางของข้อมูล<br />(Central Tendency)</td>
                  <td class="p-3.5 font-mono text-xs text-indigo-700 font-bold">
                    =AVERAGE(I2:I41)<br />=MEDIAN(I2:I41)<br />=MODE(I2:I41)
                  </td>
                  <td class="p-3.5">
                    • <code>AVERAGE</code> ค่าเฉลี่ยเลขคณิต (รวมหารจำนวน)<br />
                    • <code>MEDIAN</code> ค่ามัธยฐาน (ค่าตรงกลางเมื่อเรียงลำดับ)<br />
                    • <code>MODE</code> ฐานนิยม (ค่าหรือราคาที่พบบ่อยที่สุด)
                  </td>
                  <td class="p-3.5 text-xs text-rose-700 font-medium">
                    ถ้าข้อมูลเบ้หรือมีบิลใหญ่โดด (Outlier) ต้องรายงาน <code>MEDIAN</code> คู่กับ <code>AVERAGE</code> เสมอ
                  </td>
                </tr>
                <tr class="hover:bg-sky-50/40">
                  <td class="p-3.5 font-bold text-amber-800">ขอบเขต &amp; การกระจาย<br />(Dispersion)</td>
                  <td class="p-3.5 font-mono text-xs text-amber-700 font-bold">
                    =MIN(I2:I41)<br />=MAX(I2:I41)<br />=STDEV.S(I2:I41)<br />=PERCENTILE(I2:I41, 0.9)
                  </td>
                  <td class="p-3.5">
                    • <code>MIN / MAX</code> หาค่าต่ำสุดและสูงสุด (และใช้สแกนหาข้อมูลหลุดกรอบ)<br />
                    • <code>STDEV.S</code> วัดความแกว่งของข้อมูลเทียบกับค่าเฉลี่ย<br />
                    • <code>PERCENTILE</code> หาเกณฑ์กลุ่มหัวแถว (เช่น Top 10% ใช้ 0.9)
                  </td>
                  <td class="p-3.5 text-xs text-slate-500">
                    <code>STDEV.S</code> ใช้กับข้อมูลกลุ่มตัวอย่าง (Sample) ซึ่งเป็นมาตรฐานงานธุรกิจทั่วไป
                  </td>
                </tr>
                <tr class="hover:bg-sky-50/40">
                  <td class="p-3.5 font-bold text-emerald-800">สัดส่วนร้อยละ<br />(% Share of Total)</td>
                  <td class="p-3.5 font-mono text-xs text-emerald-700 font-bold">
                    =C2 / $C$10
                  </td>
                  <td class="p-3.5">
                    คำนวณว่ายอดขายของกลุ่มหนึ่งคิดเป็นกี่เปอร์เซ็นต์ของยอดรวมทั้งหมด (นำยอดกลุ่มหารด้วยยอดรวมทั้งหมด แล้วตั้ง Format เป็น %)
                  </td>
                  <td class="p-3.5 text-xs text-slate-500">
                    ตัวหารที่เป็นยอดรวมทั้งหมดต้องล็อกเซลล์ด้วย <code>$</code> เสมอ (เช่น <code>$C$10</code>)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.2 Deep Dive: MEDIAN, STDEV.S, and MIN / MAX -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2 text-sky-900 font-black text-base">
              <span class="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-mono">2.2</span>
              <span>เจาะลึก 3 ค่าสถิติสำคัญ: คืออะไร? อ่านค่ายังไง? เอาไปใช้งานกรณีไหน?</span>
            </div>
            <span class="text-xs text-slate-500">เข้าใจง่าย ไม่ต้องจำสูตรคณิตศาสตร์ซับซ้อน</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Card 1: MEDIAN -->
            <div class="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="p-2 rounded-xl bg-indigo-600 text-white">
                      <SlidersHorizontal class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="font-black text-indigo-950 text-base">ค่ามัธยฐาน (MEDIAN)</h4>
                      <p class="text-[11px] font-mono text-indigo-700 font-bold">=MEDIAN(range)</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">ค่ากลางแท้จริง</span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-indigo-100 space-y-1 text-xs">
                  <div class="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Info class="w-3.5 h-3.5 text-indigo-600 shrink-0" /> คืออะไร?
                  </div>
                  <p class="text-slate-700 leading-relaxed">
                    <strong>ค่าที่อยู่ "ตรงกลางเป๊ะ"</strong> เมื่อนำข้อมูลทั้งหมดมาเรียงลำดับจากน้อยไปหามาก (เช่น เรียง 5 บิล: 60, 75, <strong>80</strong>, 90, 4,500 บาท ค่าตรงกลางคือ <strong>80 บาท</strong>) ข้อดีคือ<strong>ไม่โดนตัวเลขกระโดด (Outlier) ดึงค่าจนเพี้ยน</strong>
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-white border border-indigo-100 space-y-1 text-xs">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lightbulb class="w-3.5 h-3.5 text-amber-500 shrink-0" /> เอาไปใช้งานจริงในกรณีไหน?
                  </div>
                  <ul class="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                    <li><strong>ยอดใช้จ่ายลูกค้าทั่วไป / เงินเดือน / ราคาบ้าน:</strong> ป้องกันคนรวย 1 คนหรือบิลจัดเลี้ยง 1 ใบมาหลอกว่าลูกค้าทั่วไปจ่ายแพง</li>
                    <li><strong>ตั้งราคาโปรโมชันกลางร้าน:</strong> ใช้ <code>MEDIAN</code> ดูว่า "ลูกค้าส่วนใหญ่ครึ่งร้าน" จ่ายกี่บาท เพื่อตั้งเป้า Upsell ที่เอื้อมถึงจริง</li>
                    <li><strong>เช็กความเบ้ของข้อมูล:</strong> ถ้า <code>AVERAGE &gt; MEDIAN</code> มาก แปลว่ามีบิลใหญ่พิเศษไม่กี่ใบดึงยอดเฉลี่ยให้ดูสูงเกินจริง</li>
                  </ul>
                </div>
              </div>

              <div class="pt-2 border-t border-indigo-200/70 text-[11px] text-indigo-900 font-medium flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>จำง่าย: "AVERAGE โดนตัวโดดหลอกง่าย แต่ MEDIAN ซื่อตรงกับคนส่วนใหญ่"</span>
              </div>
            </div>

            <!-- Card 2: STDEV.S -->
            <div class="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="p-2 rounded-xl bg-rose-600 text-white">
                      <BarChart3 class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="font-black text-rose-950 text-base">ส่วนเบี่ยงเบนมาตรฐาน (STDEV.S)</h4>
                      <p class="text-[11px] font-mono text-rose-700 font-bold">=STDEV.S(range)</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">ความนิ่ง/แกว่ง</span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1 text-xs">
                  <div class="font-bold text-rose-900 flex items-center gap-1.5">
                    <Info class="w-3.5 h-3.5 text-rose-600 shrink-0" /> คืออะไร?
                  </div>
                  <p class="text-slate-700 leading-relaxed">
                    <strong>ตัวเลขวัด "ความแกว่ง" ของข้อมูลเทียบกับค่าเฉลี่ย</strong>
                    ถ้าค่า <code>STDEV.S</code> <strong>ต่ำ</strong> = ข้อมูลเกาะกลุ่มนิ่งสม่ำเสมอ แต่ถ้า <strong>สูง</strong> = วันไหนขายดีก็พุ่งมาก วันไหนเงียบก็ร่วงหนัก (ยอดแกว่ง เดาใจยาก)
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-white border border-rose-100 space-y-1 text-xs">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lightbulb class="w-3.5 h-3.5 text-amber-500 shrink-0" /> เอาไปใช้งานจริงในกรณีไหน?
                  </div>
                  <ul class="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                    <li><strong>เทียบความสม่ำเสมอของ 2 สาขา:</strong> สาขา A และ B เฉลี่ยวันละ 10,000 บาทเท่ากัน แต่สาขาที่ <code>STDEV.S</code> ต่ำกว่าบริหารสต๊อกและกะพนักงานง่ายกว่า</li>
                    <li><strong>ควบคุมคุณภาพ/เวลาจัดส่ง:</strong> เช็กว่าเวลาส่งอาหารหรือคะแนนสอบนักเรียนเกาะกลุ่มใกล้เกณฑ์ หรือเหวี่ยงต่างกันสุดขั้ว</li>
                    <li><strong>ตรวจจับความเสี่ยง (Risk):</strong> <code>STDEV.S</code> พุ่งสูงผิดปกติเป็นสัญญาณเตือนว่ายอดขายไม่เสถียรหรือมีบิลแปลกปลอมเข้ามา</li>
                  </ul>
                </div>
              </div>

              <div class="pt-2 border-t border-rose-200/70 text-[11px] text-rose-900 font-medium flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>จำง่าย: "STDEV.S น้อย = นิ่งและสม่ำเสมอ | STDEV.S มาก = แกว่งและแตกต่างสูง"</span>
              </div>
            </div>

            <!-- Card 3: MIN & MAX -->
            <div class="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="p-2 rounded-xl bg-amber-600 text-white">
                      <Target class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="font-black text-amber-950 text-base">ค่าต่ำสุด &amp; สูงสุด (MIN / MAX)</h4>
                      <p class="text-[11px] font-mono text-amber-800 font-bold">=MIN(range) | =MAX(range)</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">ขอบเขตข้อมูล</span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-amber-100 space-y-1 text-xs">
                  <div class="font-bold text-amber-900 flex items-center gap-1.5">
                    <Info class="w-3.5 h-3.5 text-amber-600 shrink-0" /> คืออะไร?
                  </div>
                  <p class="text-slate-700 leading-relaxed">
                    <strong><code>MIN</code></strong> คือก้นเหว (ตัวเลขน้อยที่สุดในช่วง) และ <strong><code>MAX</code></strong> คือยอดเขา (ตัวเลขมากที่สุดในช่วง) ใช้ตีกรอบให้เห็นทันทีว่าชุดข้อมูลของเราวิ่งอยู่ตั้งแต่เลขไหนถึงเลขไหน
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-white border border-amber-100 space-y-1 text-xs">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lightbulb class="w-3.5 h-3.5 text-amber-500 shrink-0" /> เอาไปใช้งานจริงในกรณีไหน?
                  </div>
                  <ul class="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                    <li><strong>สแกนหาข้อมูลพัง/คีย์ผิด (Data Audit):</strong> เปิดไฟล์ใหม่ให้รัน <code>MIN / MAX</code> ทันที ถ้าเจอ <code>MIN &lt; 0</code> (ยอดขายติดลบ) หรือ <code>MAX</code> พุ่งผิดธรรมชาติ แสดงว่ามีจุดที่ต้องตรวจสอบ</li>
                    <li><strong>วิเคราะห์ช่วงราคา &amp; โปรโมชัน:</strong> ดูบิลต่ำสุดกับสูงสุดเพื่อจัดชุดคูปองส่วนลดหรือกำหนดยอดขั้นต่ำส่งฟรีให้เหมาะกับพฤติกรรมซื้อ</li>
                    <li><strong>วัดพิสัยความต่าง (Range = MAX - MIN):</strong> ใช้ดูช่วงคะแนน สต๊อกสินค้าต่ำสุดก่อนสั่งเพิ่ม หรือยอดขายจุดสูงสุดเพื่อเตรียมกำลังผลิต</li>
                  </ul>
                </div>
              </div>

              <div class="pt-2 border-t border-amber-200/70 text-[11px] text-amber-950 font-medium flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>จำง่าย: "MIN-MAX คือไฟฉายส่องหัว-ท้ายตาราง ทั้งสรุปสถิติและดัก Error"</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2.3 INTERACTIVE DEMO: MEAN VS MEDIAN TRAP -->
        <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/40 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                2.3 Interactive Demo • ทำไมต้องดู Mean คู่กับ Median?
              </span>
              <h4 class="font-black text-base sm:text-lg text-white mt-2">
                ทดลองเพิ่ม "บิลจัดเลี้ยง 4,500 บาท" เพียง 1 ใบ แล้วสังเกตการเปลี่ยนแปลงของค่ากลาง
              </h4>
            </div>

            <button @click="includeVipOutlier = !includeVipOutlier" type="button"
              :class="[
                'px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md',
                includeVipOutlier
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/60'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              ]">
              <RefreshCw class="w-4 h-4" />
              <span>{{ includeVipOutlier ? 'เอาบิลจัดเลี้ยง 4,500 ฿ ออก' : '+ เพิ่มบิลจัดเลี้ยง VIP (4,500 ฿)' }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <!-- Bills List -->
            <div class="lg:col-span-7 bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-2.5">
              <div class="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>รายการบิลลูกค้า ({{ trapBills.length }} บิลเรียงจากน้อยไปมาก)</span>
                <span class="font-mono text-sky-400">หน่วย: บาท</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div v-for="(bill, idx) in trapBills" :key="bill.id"
                  :class="[
                    'p-2.5 rounded-xl border text-xs transition-all',
                    bill.isOutlier
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200 col-span-2 sm:col-span-5 flex items-center justify-between'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200'
                  ]">
                  <div>
                    <div class="text-[10px] font-mono text-slate-400">#{{ idx + 1 }} • {{ bill.customer }}</div>
                    <div class="font-bold text-sm font-mono" :class="bill.isOutlier ? 'text-rose-300' : 'text-emerald-300'">
                      {{ bill.amount.toLocaleString() }} ฿
                    </div>
                  </div>
                  <span v-if="bill.isOutlier" class="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]">
                    บิลใหญ่โดด (Outlier)
                  </span>
                </div>
              </div>
            </div>

            <!-- Live Mean vs Median Result Cards -->
            <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div class="p-4 rounded-xl bg-slate-800/90 border"
                :class="includeVipOutlier ? 'border-rose-400/70' : 'border-sky-500/40'">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-300">ค่าเฉลี่ย (AVERAGE / Mean)</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-sky-300">=AVERAGE(...)</span>
                </div>
                <div class="text-2xl sm:text-3xl font-black font-mono mt-1"
                  :class="includeVipOutlier ? 'text-rose-400' : 'text-sky-300'">
                  {{ trapMean.toFixed(2) }} ฿
                </div>
                <p class="text-[11px] mt-1" :class="includeVipOutlier ? 'text-rose-200' : 'text-slate-400'">
                  {{ includeVipOutlier
                    ? `พุ่งจาก ${trapMeanWithoutOutlier.toFixed(2)} เป็น ${trapMean.toFixed(2)} ฿ (+${(trapMean - trapMeanWithoutOutlier).toFixed(0)} ฿) ทั้งที่ลูกค้า 9 คนซื้อไม่เกิน 120 ฿!`
                    : 'เมื่อไม่มีบิลโดด ค่าเฉลี่ยสะท้อนลูกค้าทั่วไปได้ใกล้เคียงความจริง' }}
                </p>
              </div>

              <div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/50">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-emerald-200">ค่ามัธยฐาน (MEDIAN)</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-300">=MEDIAN(...)</span>
                </div>
                <div class="text-2xl sm:text-3xl font-black font-mono text-emerald-300 mt-1">
                  {{ trapMedian.toFixed(2) }} ฿
                </div>
                <p class="text-[11px] text-emerald-100/90 mt-1">
                  {{ includeVipOutlier
                    ? `ขยับจาก ${trapMedianWithoutOutlier.toFixed(2)} เป็น ${trapMedian.toFixed(2)} ฿ เท่านั้น (ต่างจาก Mean ถึง ${trapDiff.toFixed(2)} ฿)`
                    : 'อยู่ตรงกลางเป๊ะที่ 90.00 ฿ และทนทานต่อบิลที่มีขนาดใหญ่ผิดปกติ' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 3: 1-CONDITION FUNCTIONS (COUNTIF, SUMIF, AVERAGEIF)       -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-cyan-100 text-cyan-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 3
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Filter class="w-6 h-6 text-cyan-600" />
            การนับและคำนวณแบบ 1 เงื่อนไข (COUNTIF, SUMIF, AVERAGEIF)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            ใช้เมื่อต้องการสรุปข้อมูลตามเกณฑ์เงื่อนไข 1 ข้อ (1 Criteria) เช่น แยกตามสาขา, แยกตามหมวดสินค้า หรือคัดตามยอดเงินขั้นต่ำ
          </p>
        </div>

        <!-- Formula Anatomy & Key Terms -->
        <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-5 border border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <Code class="w-5 h-5 text-cyan-400 shrink-0" />
              <h4 class="font-black text-sm sm:text-base text-white">
                ผ่าโครงสร้างสูตร &amp; คำศัพท์พารามิเตอร์ที่ต้องรู้ก่อนเขียน (Formula Vocabulary)
              </h4>
            </div>
            <span class="text-[11px] font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-400/30">
              อ่านคำแปลของ Argument ให้ขาด เขียนได้ทุกสูตร!
            </span>
          </div>

          <!-- Formula Anatomy Visual Bar -->
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="text-sm sm:text-base font-mono font-bold flex flex-wrap items-center gap-1 leading-relaxed">
              <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">=</span>
              <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">SUMIF</span>
              <span class="text-slate-400">(</span>
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">criteria_range</span>
              <span class="text-slate-400">,</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">criteria</span>
              <span class="text-slate-400">,</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">sum_range</span>
              <span class="text-slate-400">)</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <code class="text-slate-200 font-bold">=</code>
                <span class="text-slate-400"> เครื่องหมายเริ่มต้นสูตรทุกครั้ง (ไม่ใส่ = โปรแกรมจะมองเป็นข้อความธรรมดา)</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <code class="text-cyan-300 font-bold">SUMIF</code>
                <span class="text-slate-400"> ชื่อฟังก์ชัน (คำสั่งที่สั่งให้ Google Sheets / Excel ทำงาน)</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <code class="text-slate-200 font-bold">( ... )</code>
                <span class="text-slate-400"> วงเล็บเปิด–ปิดสำหรับใส่ค่าพารามิเตอร์ (Arguments)</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <code class="text-slate-200 font-bold">,</code>
                <span class="text-slate-400"> ลูกน้ำสำหรับคั่นช่องพารามิเตอร์แต่ละตัวตามลำดับ</span>
              </div>
            </div>
          </div>

          <!-- 6 Parameter Vocabulary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-sky-300 text-sm">criteria_range</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 font-bold">ช่วงตรวจเงื่อนไข</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                <strong>ช่วงคอลัมน์ที่ต้องการเข้าไปตรวจสอบ</strong> เช่น คอลัมน์ชื่อสาขา <code>$B$2:$B$41</code>
                (จำง่ายๆ: range คือช่วง, criteria คือเงื่อนไข)
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-amber-300 text-sm">criteria</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold">เงื่อนไข / เกณฑ์</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                <strong>สิ่งที่เราอยากกรองหาจากคอลัมน์แรก</strong> เช่น <code>"สาขาสยาม"</code>,
                <code>{{ '">=150"' }}</code> หรือคลิกอ้างอิงจากเซลล์ <code>A5</code>
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-emerald-300 text-sm">sum_range</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-bold">ช่วงตัวเลขที่จะบวก</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                <strong>คอลัมน์ตัวเลขที่ให้รวมยอด</strong> เฉพาะแถวที่ผ่านเงื่อนไขแล้ว เช่น คอลัมน์ยอดขาย <code>$I$2:$I$41</code>
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-purple-300 text-sm">average_range</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold">ช่วงตัวเลขที่จะเฉลี่ย</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                <strong>คอลัมน์ตัวเลขที่ให้หาค่าเฉลี่ย</strong> เฉพาะแถวที่ผ่านเงื่อนไข เช่น <code>$I$2:$I$41</code> (ถ้าไม่ใส่จะเฉลี่ยช่วงเงื่อนไขแทน)
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-rose-300 text-sm">$ (Absolute Reference)</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 font-bold">ล็อกช่วงเซลล์</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                สัญลักษณ์ตรึงคอลัมน์และแถว (กด <code>F4</code>) เช่น <code>$B$2:$B$41</code> เพื่อไม่ให้ช่วงข้อมูลขยับหนีเมื่อลากสูตรลงด้านล่าง
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-400/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <code class="font-bold text-indigo-300 text-sm">* และ "..." (Wildcard / ข้อความ)</code>
                <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 font-bold">สัญลักษณ์เสริม</span>
              </div>
              <p class="text-slate-300 leading-relaxed">
                <code>"..."</code> ใช้ครอบข้อความหรือเงื่อนไข เช่น <code>"กาแฟ"</code>, <code>"&gt;500"</code> ส่วน <code>*</code> แทนคำใดๆ ใช้หาคำบางส่วน เช่น <code>"*ชา*"</code>
              </p>
            </div>
          </div>
        </div>

        <!-- 3 Syntax Cards (Color-matched Parameters) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-sky-950 text-base">1. COUNTIF</span>
              <span class="px-2 py-0.5 rounded bg-sky-200 text-sky-900 text-[11px] font-bold">นับจำนวน 1 เงื่อนไข</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              =COUNTIF(<span class="text-sky-300 font-bold">criteria_range</span>, <span class="text-amber-300 font-bold">criteria</span>)
            </div>
            <ul class="text-[11px] text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-sky-200/70">
              <li><code class="font-bold text-sky-700">criteria_range</code> = ช่วงคอลัมน์ที่จะตรวจ (เช่น สาขา)</li>
              <li><code class="font-bold text-amber-700">criteria</code> = เงื่อนไขที่ค้นหา (เช่น <code>"สาขาสยาม"</code>)</li>
            </ul>
            <p class="text-xs text-slate-600 leading-relaxed">
              <strong>ตัวอย่าง:</strong> <code>=COUNTIF($B$2:$B$41, "สาขาสยาม")</code><br />
              นับว่าในคอลัมน์สาขา (B2:B41) มีกี่รายการที่เป็น "สาขาสยาม"
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-emerald-950 text-base">2. SUMIF</span>
              <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[11px] font-bold">รวมยอด 1 เงื่อนไข</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              =SUMIF(<span class="text-sky-300 font-bold">criteria_range</span>, <span class="text-amber-300 font-bold">criteria</span>, <span class="text-emerald-300 font-bold">sum_range</span>)
            </div>
            <ul class="text-[11px] text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-emerald-200/70">
              <li><code class="font-bold text-sky-700">criteria_range</code> = ช่วงคอลัมน์ที่จะตรวจ (เช่น สาขา)</li>
              <li><code class="font-bold text-amber-700">criteria</code> = เงื่อนไขที่ค้นหา (เช่น ช่อง <code>A5</code>)</li>
              <li><code class="font-bold text-emerald-700">sum_range</code> = ช่วงตัวเลขที่จะบวก (เช่น ยอดขาย)</li>
            </ul>
            <p class="text-xs text-slate-600 leading-relaxed">
              <strong>ตัวอย่าง:</strong> <code>=SUMIF($B$2:$B$41, A5, $I$2:$I$41)</code><br />
              ตรวจคอลัมน์สาขาให้ตรงกับคำในเซลล์ <code>A5</code> แล้วไปรวมตัวเลขที่คอลัมน์ยอดขาย <code>I2:I41</code>
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-purple-950 text-base">3. AVERAGEIF</span>
              <span class="px-2 py-0.5 rounded bg-purple-200 text-purple-900 text-[11px] font-bold">หาค่าเฉลี่ย 1 เงื่อนไข</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              =AVERAGEIF(<span class="text-sky-300 font-bold">criteria_range</span>, <span class="text-amber-300 font-bold">criteria</span>, <span class="text-purple-300 font-bold">average_range</span>)
            </div>
            <ul class="text-[11px] text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-purple-200/70">
              <li><code class="font-bold text-sky-700">criteria_range</code> = ช่วงคอลัมน์ที่จะตรวจ (เช่น หมวด)</li>
              <li><code class="font-bold text-amber-700">criteria</code> = เงื่อนไขที่ค้นหา (เช่น <code>"กาแฟ"</code>)</li>
              <li><code class="font-bold text-purple-700">average_range</code> = ช่วงตัวเลขที่จะเฉลี่ย (เช่น ยอดขาย)</li>
            </ul>
            <p class="text-xs text-slate-600 leading-relaxed">
              <strong>ตัวอย่าง:</strong> <code>=AVERAGEIF($C$2:$C$41, "กาแฟ", $I$2:$I$41)</code><br />
              หาค่าเฉลี่ยยอดขายต่อบิลเฉพาะรายการที่เป็นหมวดหมู่ "กาแฟ"
            </p>
          </div>
        </div>

        <!-- Criteria Operators & Absolute Reference Callout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-7 overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-800 text-white">
                <tr>
                  <th class="p-3 font-bold">รูปแบบเงื่อนไข (Criteria)</th>
                  <th class="p-3 font-bold">ตัวอย่างการเขียนในสูตร</th>
                  <th class="p-3 font-bold">ความหมาย</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 bg-white">
                <tr>
                  <td class="p-3 font-bold text-slate-900">ตรงตัว (Exact Match)</td>
                  <td class="p-3 font-mono text-sky-700">"VIP" หรืออ้างอิงเซลล์ A5</td>
                  <td class="p-3">ข้อความต้องใส่ <code>"..."</code> ส่วนอ้างอิงเซลล์ไม่ต้องใส่ฟันหนู</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">เปรียบเทียบตัวเลข</td>
                  <td class="p-3 font-mono text-sky-700">{{ '">=150" หรือ "<100"' }}</td>
                  <td class="p-3">มากกว่าหรือเท่ากับ 150 / น้อยกว่า 100 (ต้องครอบฟันหนู!)</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">ไม่เท่ากับ (Not Equal)</td>
                  <td class="p-3 font-mono text-sky-700">{{ '"<>เงินสด"' }}</td>
                  <td class="p-3">นับหรือรวมยอดทุกรายการที่ไม่ใช่เงินสด</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">คำบางส่วน (Wildcard)</td>
                  <td class="p-3 font-mono text-sky-700">"*ชา*" หรือ "ORD-*"</td>
                  <td class="p-3"><code>*</code> แทนตัวอักษรใดก็ได้ เช่น มีคำว่า "ชา" อยู่ในชื่อเมนู</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">เชื่อมตัวแปรจากเซลล์</td>
                  <td class="p-3 font-mono text-sky-700">{{ '">=" & G2' }}</td>
                  <td class="p-3">ดึงเกณฑ์ตัวเลขจากเซลล์ <code>G2</code> เพื่อเปลี่ยนค่าได้สะดวก</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="lg:col-span-5 p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-amber-950 font-black text-sm">
                <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0" />
                <span>ความสำคัญของการล็อกเซลล์ ($ Absolute Reference)</span>
              </div>
              <p class="text-xs text-amber-900 leading-relaxed">
                เมื่อสร้างตารางสรุปแล้วต้องการ <strong>ลากสูตรลงด้านล่าง</strong> (AutoFill) จากสาขาสยามลงไปสาขาลาดพร้าว:
              </p>
              <div class="p-3 rounded-xl bg-white border border-amber-200 font-mono text-xs space-y-1.5">
                <div class="flex items-center gap-1.5 text-rose-600 flex-wrap">
                  <XCircle class="w-4 h-4 shrink-0" />
                  <span>ผิด: =SUMIF(B2:B41, K13, I2:I41) <span class="font-sans text-[11px]">(ลากแล้วช่วงเลื่อนเป็น B3:B42!)</span></span>
                </div>
                <div class="flex items-center gap-1.5 text-emerald-700 font-bold flex-wrap">
                  <CheckCircle2 class="w-4 h-4 shrink-0" />
                  <span>ถูก: =SUMIF($B$2:$B$41, K13, $I$2:$I$41)</span>
                </div>
              </div>

              <!-- 4 Types of Cell Reference ($) -->
              <div class="overflow-x-auto rounded-xl border border-amber-200 bg-white">
                <table class="w-full text-left text-[11px]">
                  <thead class="bg-amber-900/90 text-white">
                    <tr>
                      <th class="p-2">รูปแบบ</th>
                      <th class="p-2">ประเภท</th>
                      <th class="p-2">ผลเมื่อคัดลอกสูตร (AutoFill)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-amber-100 text-slate-700">
                    <tr>
                      <td class="p-2 font-mono font-bold text-slate-900">A1</td>
                      <td class="p-2 font-bold">ไม่ล็อก (Relative)</td>
                      <td class="p-2">ลากไปทางไหน เลื่อนทั้งคอลัมน์และแถว</td>
                    </tr>
                    <tr class="bg-emerald-50/60">
                      <td class="p-2 font-mono font-bold text-emerald-700">$A$1</td>
                      <td class="p-2 font-bold text-emerald-800">ล็อกทั้งคู่ (Absolute)</td>
                      <td class="p-2">ไม่เลื่อนเลย ใช้ล็อกช่วงข้อมูล <code>$B$2:$B$25</code></td>
                    </tr>
                    <tr>
                      <td class="p-2 font-mono font-bold text-sky-700">$K20</td>
                      <td class="p-2 font-bold text-sky-800">ล็อกคอลัมน์ (Mixed)</td>
                      <td class="p-2">ลากขวาคอลัมน์เดิม ลากลงเปลี่ยนแถว (ใช้ใน Matrix)</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-mono font-bold text-indigo-700">L$19</td>
                      <td class="p-2 font-bold text-indigo-800">ล็อกแถว (Mixed)</td>
                      <td class="p-2">ลากลงแถวเดิม ลากขวาเปลี่ยนคอลัมน์ (ใช้ใน Matrix)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p class="text-[11px] text-amber-800">
              <strong>คีย์ลัดมือโปร:</strong> คลุมช่วงเซลล์ในสูตรแล้วกดปุ่ม <strong><code>F4</code></strong> (Windows) หรือ <strong><code>Fn + F4</code></strong> (Mac) กดซ้ำเพื่อสลับครบทั้ง 4 รูปแบบอัตโนมัติ
            </p>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 4: MULTI-CONDITION FUNCTIONS (COUNTIFS, SUMIFS, AVERAGEIFS)-->
      <!-- ================================================================= -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-2xs space-y-6">
        <div class="border-b border-gray-100 pb-4">
          <span class="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-full uppercase tracking-wider">
            หน่วยการเรียนรู้ที่ 4
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-sky-900 mt-2 flex items-center gap-2">
            <Layers class="w-6 h-6 text-indigo-600" />
            การเจาะลึกหลายมิติแบบหลายเงื่อนไข (COUNTIFS, SUMIFS, AVERAGEIFS)
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            ตอบคำถามทางธุรกิจแบบเจาะจง 2–3 เงื่อนไขพร้อมกัน (ตรรกะ AND: ต้องตรงครบทุกเงื่อนไขจึงจะนำมาคำนวณ)
          </p>
        </div>

        <!-- #1 PITFALL ALERT: PARAMETER POSITION SWAP -->
        <div class="p-5 sm:p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h4 class="font-black text-rose-950 text-base sm:text-lg">
                จุดผิดพลาดอันดับ 1 ที่เด็กสับสนบ่อยที่สุด: ตำแหน่งของ sum_range และ average_range สลับที่!
              </h4>
              <p class="text-xs sm:text-sm text-rose-900 leading-relaxed">
                สูตร <strong>1 เงื่อนไข (ไม่มี S)</strong> เอาช่วงตัวเลขที่จะบวก/เฉลี่ยไว้ <strong>ท้ายสุด</strong>
                แต่สูตร <strong>หลายเงื่อนไข (เติม S: SUMIFS / AVERAGEIFS)</strong> บังคับให้ย้ายช่วงตัวเลขที่จะบวก/เฉลี่ยมาไว้ <strong>ตัวแรกสุดเสมอ!</strong>
                (เพราะเงื่อนไขด้านหลังสามารถต่อเพิ่มได้เรื่อยๆ ไม่จำกัดจำนวนคู่)
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div class="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2">
              <div class="font-sans font-bold text-slate-700">แบบ 1 เงื่อนไข (ช่วงผลรวม/ค่าเฉลี่ย อยู่ท้ายสุด):</div>
              <div class="text-slate-800 leading-relaxed">
                =SUMIF(<span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria</span>,
                <span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">sum_range (ช่วงผลรวม)</span>)
              </div>
              <div class="text-slate-800 leading-relaxed">
                =AVERAGEIF(<span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria</span>,
                <span class="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">average_range (ช่วงค่าเฉลี่ย)</span>)
              </div>
            </div>
            <div class="p-3.5 rounded-xl bg-white border-2 border-emerald-400 space-y-2">
              <div class="font-sans font-bold text-emerald-900">แบบหลายเงื่อนไข (ย้าย sum_range / average_range มาตัวแรกสุด!):</div>
              <div class="text-slate-800 leading-relaxed">
                =SUMIFS(<span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">sum_range (ช่วงผลรวม)</span>,
                <span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range1 (ช่วงเงื่อนไข 1)</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria1 (เงื่อนไข 1)</span>,
                <span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range2</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria2</span>)
              </div>
              <div class="text-slate-800 leading-relaxed">
                =AVERAGEIFS(<span class="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">average_range (ช่วงค่าเฉลี่ย)</span>,
                <span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range1 (ช่วงเงื่อนไข 1)</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria1 (เงื่อนไข 1)</span>,
                <span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">criteria_range2</span>,
                <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">criteria2</span>)
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-white/90 border border-rose-200 text-xs text-rose-950 leading-relaxed">
            <strong>หมายเหตุเลขต่อท้าย <code>1, 2, ...</code> และกฎขนาดช่วงเซลล์:</strong>
            ในสูตร <code>*IFS</code> ต้องใส่พารามิเตอร์เงื่อนไขมาเป็น <strong>คู่ๆ เสมอ</strong> คือ <code>(criteria_range1, criteria1)</code> ตามด้วย <code>(criteria_range2, criteria2)</code>
            และ <strong>ทุกช่วงเซลล์ต้องมีจำนวนแถวเท่ากันเป๊ะ</strong> (เช่น เริ่มแถว <code>2</code> ถึงแถว <code>41</code> เหมือนกันทุกช่วง มิฉะนั้นสูตรจะ Error <code>#VALUE!</code> ทันที)
          </div>
        </div>

        <!-- Practical Multi-Condition Examples including Numeric Range -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">ตัวอย่างที่ 1 • COUNTIFS (2 มิติ)</span>
            <p class="font-bold text-slate-900 text-sm">นับจำนวนบิลสมาชิก VIP ที่จ่ายด้วย QR PromptPay</p>
            <div class="p-2.5 rounded-xl bg-slate-900 text-cyan-300 font-mono overflow-x-auto">
              =COUNTIFS($F$2:$F$41, "VIP", $E$2:$E$41, "QR PromptPay")
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ตัวอย่างที่ 2 • SUMIFS (2 มิติ)</span>
            <p class="font-bold text-slate-900 text-sm">รวมยอดขายหมวด "กาแฟ" ของสาขาสยาม</p>
            <div class="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono overflow-x-auto">
              =SUMIFS($I$2:$I$41, $B$2:$B$41, "สาขาสยาม", $C$2:$C$41, "กาแฟ")
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">ตัวอย่างที่ 3 • ช่วงตัวเลขบนคอลัมน์เดิม</span>
            <p class="font-bold text-slate-900 text-sm">นับบิลยอดขายระหว่าง 100 ถึง 300 บาท</p>
            <div class="p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono overflow-x-auto">
              {{ '=COUNTIFS($I$2:$I$41, ">=100", $I$2:$I$41, "<=300")' }}
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MODULE 5: HANDS-ON WORKSHOP — BUILD A NUMERIC KPI DASHBOARD       -->
      <!-- ================================================================= -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-200 shadow-sm space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-100 pb-5">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 bg-sky-100 text-sky-800 font-black text-xs rounded-full uppercase tracking-wider">
                หน่วยการเรียนรู้ที่ 5 • HANDS-ON PRACTICAL LAB
              </span>
              <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                ภาคปฏิบัติสร้างแดชบอร์ดตัวเลข (6 ขั้นตอน)
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal class="w-6 h-6 text-sky-600" />
              ภาคปฏิบัติ: พาลงมือใช้สูตรสร้าง "แดชบอร์ดตัวเลข (Numeric KPI Dashboard)" ทีละขั้นตอน
            </h3>
            <p class="text-slate-600 text-xs sm:text-sm">
              โหลดไฟล์ฝึกปฏิบัติแล้วทำตามทีละขั้นตอน ตั้งแต่จัดวางตาราง, ใส่สูตรสถิติภาพรวม, ตารางสรุปรายสาขา, ตาราง Matrix 2 มิติ ไปจนถึงแดชบอร์ดตัวเลขฉบับสมบูรณ์พร้อมคำตอบให้ตรวจเช็กทันที
            </p>
          </div>

          <button @click="downloadDemoExcel" type="button"
            class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95">
            <Download class="w-4 h-4" />
            <span>ดาวน์โหลดไฟล์ปฏิบัติการ (.xlsx) 24 แถว</span>
          </button>
        </div>

        <!-- Mode Switcher (Workshop Default + Sandbox Secondary) -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button @click="activeLabTab = 'workshop'" type="button"
              :class="[
                'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer',
                activeLabTab === 'workshop' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]">
              <Play class="w-4 h-4" />
              <span>โหมดภาคปฏิบัติ: สร้างแดชบอร์ดตัวเลข 6 ขั้นตอน</span>
            </button>
            <button @click="activeLabTab = 'conditional'" type="button"
              :class="[
                'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer',
                activeLabTab === 'conditional' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]">
              <Code class="w-4 h-4" />
              <span>โหมด Sandbox: ทดลองสร้างสูตร IF/IFS แบบไฮไลต์แถวสด</span>
            </button>
          </div>

          <button v-if="activeLabTab === 'workshop'" @click="showAllWorkshopSteps = !showAllWorkshopSteps" type="button"
            class="px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            :class="showAllWorkshopSteps ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'">
            <Layers class="w-3.5 h-3.5" />
            <span>{{ showAllWorkshopSteps ? 'สลับเป็นดูทีละขั้นตอน (1-6)' : 'แสดงทุกขั้นตอนพร้อมกัน (1-6)' }}</span>
          </button>
        </div>

        <!-- =============================================================== -->
        <!-- TAB 1: HANDS-ON WORKSHOP TO BUILD A NUMERIC KPI DASHBOARD       -->
        <!-- =============================================================== -->
        <div v-if="activeLabTab === 'workshop'" class="space-y-6">

          <!-- 5 Common Errors & Quick Troubleshooting Box -->
          <div class="rounded-2xl border border-rose-200 bg-rose-50/60 overflow-hidden">
            <div class="px-4 py-3 bg-rose-900 text-white flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 text-xs sm:text-sm font-black">
                <AlertTriangle class="w-4 h-4 text-amber-300 shrink-0" />
                <span>คู่มือแก้ 5 Error ยอดฮิตเวลาพิมพ์สูตรหน้าห้อง (Troubleshooting)</span>
              </div>
              <button @click="showErrorCheat = !showErrorCheat" type="button"
                class="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer transition-all">
                {{ showErrorCheat ? 'ซ่อนกล่องแก้ Error' : 'เปิดดูวิธีแก้ Error' }}
              </button>
            </div>
            <div v-if="showErrorCheat" class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                <code class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-black">#NAME?</code>
                <div class="font-bold text-slate-900 pt-1">พิมพ์ชื่อสูตร/สัญลักษณ์ผิด</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  เช่น พิมพ์ <code>=SUME</code>, ใช้ตัว <code>x</code> แทน <code>*</code>, หรือลืมใส่ฟันหนู <code>"..."</code> ครอบข้อความภาษาไทย
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                <code class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black">#VALUE!</code>
                <div class="font-bold text-slate-900 pt-1">ขนาดช่วงเซลล์ไม่เท่ากัน</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  ช่วงใน <code>SUMIFS/COUNTIFS</code> แถวไม่ตรงกัน (เช่น <code>B2:B25</code> กับ <code>I2:I24</code>) หรือนำตัวหนังสือมาบวกคูณ
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                <code class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-black">#DIV/0!</code>
                <div class="font-bold text-slate-900 pt-1">ตัวหารเป็นศูนย์</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  ใส่สูตร <code>% Share</code> ก่อนใส่สูตรยอดรวมแถว 16 หรือใช้ <code>AVERAGEIF</code> แล้วไม่มีแถวใดตรงเงื่อนไขเลย
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                <code class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-black">#REF!</code>
                <div class="font-bold text-slate-900 pt-1">อ้างอิงเซลล์/คอลัมน์ไม่เจอ</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  เผลอลบแถวหรือคอลัมน์ข้อมูลที่สูตรกำลังอ้างอิงอยู่ (เช่น ลบคอลัมน์ยอดขาย <code>I</code> หรือพิมพ์ช่วงเซลล์ผิด)
                </p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-sky-200 space-y-1">
                <code class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-black">ได้ผลลัพธ์เป็น 0</code>
                <div class="font-bold text-slate-900 pt-1">คำในเงื่อนไขไม่ตรงเป๊ะ</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  เช่น พิมพ์ <code>"สยาม"</code> แทน <code>"สาขาสยาม"</code> หรือมีเว้นวรรคส่วนเกินซ่อนอยู่ในข้อความ
                </p>
              </div>
            </div>
          </div>

          <!-- 6-Step Horizontal Stepper Bar -->
          <div v-if="!showAllWorkshopSteps" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button v-for="s in workshopStepsMeta" :key="s.step" @click="activeWorkshopStep = s.step" type="button"
              :class="[
                'p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1',
                activeWorkshopStep === s.step
                  ? 'bg-gradient-to-br from-sky-600 to-indigo-700 text-white border-sky-600 shadow-md ring-2 ring-sky-300/60 scale-[1.01]'
                  : activeWorkshopStep > s.step
                    ? 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300'
              ]">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold uppercase opacity-80">STEP {{ s.step }}</span>
                <CheckCircle2 v-if="activeWorkshopStep > s.step" class="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div class="text-xs font-black leading-snug">{{ s.shortTitle }}</div>
            </button>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 1: PREPARE FILE & INSPECT MASTER_DATA (24 ROWS)          -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(1)" class="rounded-3xl border-2 border-slate-200 bg-slate-50/60 p-5 sm:p-6 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 text-xs font-mono font-bold">STEP 1 of 6</span>
                <h4 class="text-lg sm:text-xl font-black text-slate-900 mt-1.5">
                  ขั้นที่ 1: แยกชีต Master_data ไว้เป็นต้นฉบับ และเตรียมชีต Numeric_Dashboard
                </h4>
              </div>
              <button @click="downloadDemoExcel" type="button"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                <Download class="w-4 h-4" />
                <span>โหลด demo_week4_numeric_dashboard.xlsx</span>
              </button>
            </div>

            <!-- 3 Mini Setup Instructions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div class="font-black text-sky-800">1. อัปโหลดไฟล์เข้า Google Sheets</div>
                <p class="text-slate-600 leading-relaxed">
                  กดดาวน์โหลดไฟล์ <code>.xlsx</code> ด้านบน &rarr; อัปโหลดเข้า Google Drive &rarr; คลิกขวา <em>"เปิดด้วย Google Sheets"</em> (หรือบันทึกเป็น Google Sheets)
                </p>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div class="font-black text-indigo-800">2. รู้จักโครงสร้าง 2 ชีต (ไม่ปะปนต้นฉบับ)</div>
                <p class="text-slate-600 leading-relaxed">
                  ชีต <code>Master_data</code> เก็บข้อมูลต้นฉบับ 24 แถวไว้เฉยๆ <strong>ห้ามแก้ไข</strong><br />
                  ชีต <code>Numeric_Dashboard</code> คัดลอกตารางไว้ซ้าย (<code>A1:I25</code>) + พิมพ์สูตรสรุปทางขวา (<code>K1:O30</code>) ในชีตเดียวกัน!
                </p>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div class="font-black text-emerald-800">3. แผนผัง 4 โซน (ฝั่งขวา K1:O30)</div>
                <p class="text-slate-600 leading-relaxed">
                  • <strong>Zone 1 (L4:L10):</strong> KPI ภาพรวม 7 ค่า<br />
                  • <strong>Zone 2 (K13:O16):</strong> สรุปรายสาขา + % Share<br />
                  • <strong>Zone 3 (K19:O22):</strong> Matrix สาขา &times; หมวด<br />
                  • <strong>Zone 4 (L25:L30):</strong> เจาะกลุ่ม VIP &amp; เงื่อนไขพิเศษ
                </p>
              </div>
            </div>

            <!-- Column Dictionary A-I -->
            <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div class="text-xs font-bold text-cyan-300">พจนานุกรมคอลัมน์ข้อมูลฝั่งซ้ายในชีต Numeric_Dashboard (สำเนามาจาก Master_data แถว 2-25):</div>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px] font-mono">
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-sky-300 font-bold">A2:A25</span> &rarr; Order_ID</div>
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-sky-300 font-bold">B2:B25</span> &rarr; Branch (สาขา)</div>
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-sky-300 font-bold">C2:C25</span> &rarr; Category (หมวด)</div>
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-amber-300 font-bold">E2:E25</span> &rarr; Payment_Method</div>
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-amber-300 font-bold">F2:F25</span> &rarr; Member_Tier (VIP/ทั่วไป)</div>
                <div class="p-2 rounded-lg bg-slate-800 border border-slate-700"><span class="text-slate-300 font-bold">D, G, H</span> &rarr; Menu, Qty, Price</div>
                <div class="p-2 rounded-lg bg-emerald-900/60 border border-emerald-500/50 sm:col-span-2 lg:col-span-2">
                  <span class="text-emerald-300 font-bold">I2:I25</span> &rarr; Total_Sales (ยอดขายรวม - ใช้เป็น sum_range / average_range)
                </div>
              </div>
            </div>

            <!-- Preview Master_data Table -->
            <div class="space-y-2">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="text-xs font-black text-slate-800">ตัวอย่างข้อมูลตั้งต้นในชีต Master_data (ทั้งหมด 24 แถว):</span>
                <button @click="showAll24Preview = !showAll24Preview" type="button"
                  class="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer">
                  {{ showAll24Preview ? 'ย่อเหลือ 8 แถวแรก' : 'ดูข้อมูลครบทั้ง 24 แถว' }}
                </button>
              </div>
              <div class="overflow-x-auto rounded-2xl border border-slate-200 max-h-72 overflow-y-auto">
                <table class="w-full text-left text-xs font-mono">
                  <thead class="bg-slate-800 text-slate-200 font-sans sticky top-0">
                    <tr>
                      <th class="p-2.5">Row</th>
                      <th class="p-2.5">A: Order_ID</th>
                      <th class="p-2.5">B: Branch</th>
                      <th class="p-2.5">C: Category</th>
                      <th class="p-2.5">D: Menu_Item</th>
                      <th class="p-2.5">E: Payment</th>
                      <th class="p-2.5">F: Tier</th>
                      <th class="p-2.5 text-right">I: Total_Sales</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
                    <tr v-for="r in previewMasterRows" :key="r.orderId" class="hover:bg-sky-50/40">
                      <td class="p-2 text-slate-400">{{ r.row }}</td>
                      <td class="p-2 font-bold text-sky-700">{{ r.orderId }}</td>
                      <td class="p-2 font-sans">{{ r.branch }}</td>
                      <td class="p-2 font-sans">{{ r.category }}</td>
                      <td class="p-2 font-sans">{{ r.menuItem }}</td>
                      <td class="p-2 font-sans">{{ r.payment }}</td>
                      <td class="p-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-sans font-bold"
                          :class="r.tier === 'VIP' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'">
                          {{ r.tier }}
                        </span>
                      </td>
                      <td class="p-2 text-right font-bold text-emerald-700">{{ r.totalSales.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex justify-end pt-2">
              <button @click="activeWorkshopStep = 2" type="button"
                class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer">
                <span>ไปขั้นที่ 2: สร้างกล่อง KPI ภาพรวม (Zone 1)</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 2: ZONE 1 — OVERALL KPI SCORECARDS (CELLS L4:L10)        -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(2)" class="rounded-3xl border-2 border-sky-200 bg-sky-50/30 p-5 sm:p-6 space-y-5">
            <div class="border-b border-sky-200 pb-4">
              <span class="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-mono font-bold">STEP 2 of 6</span>
              <h4 class="text-lg sm:text-xl font-black text-sky-950 mt-1.5">
                ขั้นที่ 2: สร้างโซนที่ 1 — กล่อง KPI สถิติภาพรวม (ในชีต Numeric_Dashboard ช่อง L4 ถึง L10)
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 mt-1">
                คลิกที่ช่อง <code>L4</code> ถึง <code>L10</code> (ฝั่งขวาในชีต <code>Numeric_Dashboard</code>) แล้วพิมพ์สูตรที่อ้างอิงตารางฝั่งซ้าย <code>$I$2:$I$25</code> ในชีตเดียวกันได้เลย
              </p>
            </div>

            <!-- Formula Guide Table L4:L10 -->
            <div class="overflow-x-auto rounded-2xl border border-sky-200 bg-white">
              <table class="w-full text-left text-xs">
                <thead class="bg-sky-900 text-white">
                  <tr>
                    <th class="p-3">พิกัดเซลล์</th>
                    <th class="p-3">ตัวชี้วัด (KPI)</th>
                    <th class="p-3">สูตรที่ต้องพิมพ์ใน Google Sheets</th>
                    <th class="p-3 text-right">คำตอบที่ต้องได้ (ตรวจผล)</th>
                    <th class="p-3 text-center">คัดลอก</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="item in zone1FormulaGuide" :key="item.cell" class="hover:bg-sky-50/50">
                    <td class="p-3 font-mono font-black text-sky-700">{{ item.cell }}</td>
                    <td class="p-3 font-bold text-slate-800">{{ item.label }}</td>
                    <td class="p-3 font-mono text-emerald-700 font-bold">{{ item.formula }}</td>
                    <td class="p-3 text-right font-mono font-black text-slate-900">{{ item.answer }}</td>
                    <td class="p-3 text-center">
                      <button @click="copyText(item.formula, `z1-${item.cell}`)" type="button"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 font-bold inline-flex items-center gap-1 cursor-pointer">
                        <Check v-if="copiedKey === `z1-${item.cell}`" class="w-3.5 h-3.5 text-emerald-600" />
                        <Copy v-else class="w-3.5 h-3.5" />
                        <span>{{ copiedKey === `z1-${item.cell}` ? 'แล้ว' : 'Copy' }}</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Live Preview Zone 1 Cards -->
            <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div class="text-xs font-bold text-cyan-300">ผลลัพธ์ Live Preview โซนที่ 1 (เมื่อใส่สูตรครบ L4:L10):</div>
              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                <div v-for="card in zone1FormulaGuide" :key="`pv-${card.cell}`"
                  class="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                  <div class="text-[10px] font-mono text-sky-300">{{ card.cell }} • {{ card.label }}</div>
                  <div class="text-sm sm:text-base font-black font-mono text-emerald-300">{{ card.answer }}</div>
                </div>
              </div>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex items-center justify-between pt-2">
              <button @click="activeWorkshopStep = 1" type="button"
                class="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                &larr; ย้อนกลับขั้นที่ 1
              </button>
              <button @click="activeWorkshopStep = 3" type="button"
                class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer">
                <span>ไปขั้นที่ 3: ตารางสรุปรายสาขา + % Share (Zone 2)</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 3: ZONE 2 — BRANCH SUMMARY + % SHARE (K13:O16)           -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(3)" class="rounded-3xl border-2 border-emerald-200 bg-emerald-50/30 p-5 sm:p-6 space-y-5">
            <div class="border-b border-emerald-200 pb-4">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-mono font-bold">STEP 3 of 6</span>
              <h4 class="text-lg sm:text-xl font-black text-emerald-950 mt-1.5">
                ขั้นที่ 3: สร้างโซนที่ 2 — ตารางสรุปรายสาขา + สัดส่วน % Share (ช่อง K13 ถึง O16)
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 mt-1">
                หัวใจของการทำงานเร็ว: <strong>พิมพ์สูตรแค่แถวแรก (แถว 13: สาขาสยาม) พร้อมใส่ <code>$</code> ล็อกช่วงข้อมูล แล้วลากลงแถว 14–15 ทันที!</strong>
              </p>
            </div>

            <!-- Row 13 Formula Instructions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-black text-emerald-950">ช่อง L13 • จำนวนบิล (COUNTIF)</span>
                  <button @click="copyText('=COUNTIF($B$2:$B$25, $K13)', 'z2-l13')" type="button"
                    class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold cursor-pointer">
                    {{ copiedKey === 'z2-l13' ? 'คัดลอกแล้ว' : 'Copy สูตร' }}
                  </button>
                </div>
                <code class="block p-2.5 rounded-xl bg-slate-900 text-sky-300 font-mono break-all">
                  =COUNTIF($B$2:$B$25, $K13)
                </code>
                <p class="text-slate-600">อ้างอิงชื่อสาขาจาก <code>$K13</code> (ไม่ล็อกเลขแถว 13 เพื่อให้ลากลงไปเป็น <code>$K14</code>, <code>$K15</code> อัตโนมัติ)</p>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-black text-emerald-950">ช่อง M13 • ยอดขายรวม (SUMIF)</span>
                  <button @click="copyText('=SUMIF($B$2:$B$25, $K13, $I$2:$I$25)', 'z2-m13')" type="button"
                    class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold cursor-pointer">
                    {{ copiedKey === 'z2-m13' ? 'คัดลอกแล้ว' : 'Copy สูตร' }}
                  </button>
                </div>
                <code class="block p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono break-all">
                  =SUMIF($B$2:$B$25, $K13, $I$2:$I$25)
                </code>
                <p class="text-slate-600">ตรวจคอลัมน์สาขา <code>$B$2:$B$25</code> ให้ตรงกับ <code>$K13</code> แล้วไปรวมยอดขายที่ <code>$I$2:$I$25</code></p>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-black text-emerald-950">ช่อง N13 • เฉลี่ยต่อบิล (AVERAGEIF)</span>
                  <button @click="copyText('=AVERAGEIF($B$2:$B$25, $K13, $I$2:$I$25)', 'z2-n13')" type="button"
                    class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold cursor-pointer">
                    {{ copiedKey === 'z2-n13' ? 'คัดลอกแล้ว' : 'Copy สูตร' }}
                  </button>
                </div>
                <code class="block p-2.5 rounded-xl bg-slate-900 text-purple-300 font-mono break-all">
                  =AVERAGEIF($B$2:$B$25, $K13, $I$2:$I$25)
                </code>
                <p class="text-slate-600">หาค่าเฉลี่ยยอดขายเฉพาะบิลของสาขานั้น</p>
              </div>

              <div class="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-black text-emerald-950">ช่อง O13 • สัดส่วน % Share (ล็อกตัวหาร $M$16)</span>
                  <button @click="copyText('=M13/$M$16', 'z2-o13')" type="button"
                    class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold cursor-pointer">
                    {{ copiedKey === 'z2-o13' ? 'คัดลอกแล้ว' : 'Copy สูตร' }}
                  </button>
                </div>
                <code class="block p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono break-all">
                  =M13/$M$16
                </code>
                <p class="text-slate-600">
                  อย่าลืมใส่สูตรรวมแถว 16 ก่อน: <code>L16</code>=<code>=SUM(L13:L15)</code>, <code>M16</code>=<code>=SUM(M13:M15)</code>, <code>N16</code>=<code>=M16/L16</code>, <code>O16</code>=<code>=SUM(O13:O15)</code> แล้วกดรูป <strong>%</strong> บนแถบเครื่องมือ
                </p>
              </div>
            </div>

            <!-- Live Preview Zone 2 Table -->
            <div class="overflow-x-auto rounded-2xl border border-emerald-200 bg-white">
              <div class="px-4 py-2.5 bg-emerald-900 text-white text-xs font-bold flex items-center justify-between">
                <span>ตารางคำตอบที่ถูกต้องสำหรับ Zone 2 (K13:O16)</span>
                <span class="font-mono text-emerald-200">ลากสูตรแถว 13 &rarr; 15</span>
              </div>
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th class="p-3">K: สาขา</th>
                    <th class="p-3 text-right">L: จำนวนบิล (COUNTIF)</th>
                    <th class="p-3 text-right">M: ยอดขายรวม (SUMIF)</th>
                    <th class="p-3 text-right">N: เฉลี่ย/บิล (AVERAGEIF)</th>
                    <th class="p-3">O: สัดส่วน % Share</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="b in dashboardBranchSummary" :key="b.branch" class="hover:bg-emerald-50/40">
                    <td class="p-3 font-bold text-slate-900">แถว {{ b.rowNum }}: {{ b.branch }}</td>
                    <td class="p-3 text-right font-mono font-bold text-sky-700">{{ b.count }}</td>
                    <td class="p-3 text-right font-mono font-bold text-emerald-700">{{ b.sum.toLocaleString() }} ฿</td>
                    <td class="p-3 text-right font-mono font-bold text-purple-700">{{ b.average.toFixed(2) }} ฿</td>
                    <td class="p-3">
                      <div class="flex items-center gap-2">
                        <div class="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${b.sharePercent}%` }"></div>
                        </div>
                        <span class="font-mono font-black text-emerald-800">{{ b.sharePercent.toFixed(1) }}%</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="bg-emerald-50 font-black text-emerald-950 border-t-2 border-emerald-300">
                    <td class="p-3">แถว 16: รวมทั้งหมด</td>
                    <td class="p-3 text-right font-mono">{{ dashboardKpis.count }}</td>
                    <td class="p-3 text-right font-mono">{{ dashboardKpis.sum.toLocaleString() }} ฿</td>
                    <td class="p-3 text-right font-mono">{{ dashboardKpis.average.toFixed(2) }} ฿</td>
                    <td class="p-3 font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex items-center justify-between pt-2">
              <button @click="activeWorkshopStep = 2" type="button"
                class="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                &larr; ย้อนกลับขั้นที่ 2
              </button>
              <button @click="activeWorkshopStep = 4" type="button"
                class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer">
                <span>ไปขั้นที่ 4: ตาราง Matrix 2 มิติ (Zone 3)</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 4: ZONE 3 — 2D MATRIX (BRANCH x CATEGORY, K19:O22)       -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(4)" class="rounded-3xl border-2 border-indigo-200 bg-indigo-50/30 p-5 sm:p-6 space-y-5">
            <div class="border-b border-indigo-200 pb-4">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold">STEP 4 of 6</span>
              <h4 class="text-lg sm:text-xl font-black text-indigo-950 mt-1.5">
                ขั้นที่ 4: สร้างโซนที่ 3 — ตารางเจาะลึก 2 มิติ "สาขา &times; หมวดสินค้า" (ช่อง K19 ถึง O22)
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 mt-1">
                ใช้ <code>=SUMIFS()</code> เพื่อดูว่าแต่ละสาขาขายหมวดสินค้าใดได้เงินเท่าไหร่ — พิมพ์สูตรเดียวที่ช่อง <code>L20</code> แล้วลากคลุมได้ทั้ง 9 ช่อง!
              </p>
            </div>

            <!-- Formula Explanation: Mixed Reference vs Manual -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div class="lg:col-span-8 p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="text-xs font-bold text-cyan-300">สูตรมือโปรที่ช่อง L20 (ใช้ Mixed Reference ลากได้ทั้ง 9 ช่อง!):</span>
                  <button @click="copyText('=SUMIFS($I$2:$I$25, $B$2:$B$25, $K20, $C$2:$C$25, L$19)', 'z3-l20')" type="button"
                    class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Check v-if="copiedKey === 'z3-l20'" class="w-3.5 h-3.5" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedKey === 'z3-l20' ? 'คัดลอกแล้ว' : 'Copy สูตร L20' }}</span>
                  </button>
                </div>
                <div class="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 font-mono text-xs sm:text-sm text-emerald-300 break-all">
                  =SUMIFS($I$2:$I$25, $B$2:$B$25, <span class="text-amber-300 font-bold">$K20</span>, $C$2:$C$25, <span class="text-sky-300 font-bold">L$19</span>)
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div class="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                    <code class="text-amber-300 font-bold">$K20</code> (ล็อกคอลัมน์ K, ปล่อยเลขแถว 20): เวลาลากไปทางขวา ชื่อสาขาจะยังอ่านจากคอลัมน์ K เสมอ แต่พอลงล่างจะเปลี่ยนเป็น K21, K22
                  </div>
                  <div class="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                    <code class="text-sky-300 font-bold">L$19</code> (ปล่อยคอลัมน์ L, ล็อกเลขแถว 19): เวลาลากไปขวาจะอ่านหัวตาราง M19 (ชา), N19 (เบเกอรี่) แต่พอลงล่างจะไม่หลุดจากแถว 19
                  </div>
                </div>
              </div>

              <div class="lg:col-span-4 p-4 rounded-2xl bg-white border border-indigo-200 space-y-2.5 text-xs flex flex-col justify-between">
                <div class="space-y-1.5">
                  <div class="font-black text-indigo-950">สรุป 3 สเต็ปในโซนที่ 3:</div>
                  <ol class="list-decimal pl-4 space-y-1 text-slate-600">
                    <li>วางสูตรข้างต้นลงในช่อง <code>L20</code></li>
                    <li>ลากมุมขวาล่างจาก <code>L20</code> &rarr; <code>N20</code> แล้วลากลงถึง <code>N22</code></li>
                    <li>ช่อง <code>O20</code> ใส่สูตร <code>=SUM(L20:N20)</code> แล้วลากลงถึง <code>O22</code></li>
                  </ol>
                </div>
                <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>สำหรับผู้เริ่มต้น:</strong> หากยังสับสน <code>$K20</code> สามารถพิมพ์ชื่อเงื่อนไขตรงๆ ได้ เช่น <code>"สาขาสยาม"</code>, <code>"กาแฟ"</code> ทีละช่อง
                </div>
              </div>
            </div>

            <!-- Live Preview Zone 3 Matrix with Heatmap Highlight -->
            <div class="overflow-x-auto rounded-2xl border border-indigo-200 bg-white">
              <div class="px-4 py-2.5 bg-indigo-900 text-white text-xs font-bold flex items-center justify-between">
                <span>ตารางคำตอบที่ถูกต้องสำหรับ Zone 3 (Matrix ยอดขาย สาขา &times; หมวดสินค้า)</span>
                <span class="font-mono text-amber-300">ช่องยอดสูงสุด: {{ dashboardMatrix.maxBranch }} &times; {{ dashboardMatrix.maxCategory }}</span>
              </div>
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th class="p-3">K: สาขา / หมวดสินค้า</th>
                    <th class="p-3 text-right">L: กาแฟ</th>
                    <th class="p-3 text-right">M: ชา</th>
                    <th class="p-3 text-right">N: เบเกอรี่</th>
                    <th class="p-3 text-right">O: รวมรายสาขา (=SUM)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="row in dashboardMatrix.rows" :key="row.branch">
                    <td class="p-3 font-bold text-slate-900">แถว {{ row.rowNum }}: {{ row.branch }}</td>
                    <td v-for="cat in categoryList" :key="cat" class="p-3 text-right font-mono font-bold"
                      :class="row.cells[cat] === dashboardMatrix.maxCell ? 'bg-amber-100 text-amber-950 font-black' : 'text-slate-700'">
                      {{ row.cells[cat].toLocaleString() }} ฿
                    </td>
                    <td class="p-3 text-right font-mono font-black text-indigo-800 bg-indigo-50/60">
                      {{ row.rowTotal.toLocaleString() }} ฿
                    </td>
                  </tr>
                  <tr class="bg-indigo-50 font-black text-indigo-950 border-t-2 border-indigo-300">
                    <td class="p-3">รวมตามหมวดสินค้า</td>
                    <td v-for="cat in categoryList" :key="`tot-${cat}`" class="p-3 text-right font-mono">
                      {{ dashboardMatrix.colTotals[cat].toLocaleString() }} ฿
                    </td>
                    <td class="p-3 text-right font-mono">{{ dashboardMatrix.grandTotal.toLocaleString() }} ฿</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex items-center justify-between pt-2">
              <button @click="activeWorkshopStep = 3" type="button"
                class="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                &larr; ย้อนกลับขั้นที่ 3
              </button>
              <button @click="activeWorkshopStep = 5" type="button"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer">
                <span>ไปขั้นที่ 5: ตัวเลขเจาะกลุ่ม VIP และเงื่อนไขพิเศษ (Zone 4)</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 5: ZONE 4 — SEGMENT & MULTI-CONDITION KPIS (L25:L30)     -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(5)" class="rounded-3xl border-2 border-purple-200 bg-purple-50/30 p-5 sm:p-6 space-y-5">
            <div class="border-b border-purple-200 pb-4">
              <span class="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-mono font-bold">STEP 5 of 6</span>
              <h4 class="text-lg sm:text-xl font-black text-purple-950 mt-1.5">
                ขั้นที่ 5: สร้างโซนที่ 4 — ตัวเลขเจาะกลุ่มลูกค้าและเงื่อนไขพิเศษ (ช่อง L25 ถึง L30)
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 mt-1">
                ฝึกใช้ฟังก์ชัน <code>COUNTIFS</code>, <code>SUMIFS</code>, <code>AVERAGEIF</code> และเงื่อนไขช่วงตัวเลข (<code>&gt;=</code>, <code>&lt;=</code>) เพื่อตอบคำถามเชิงพฤติกรรมลูกค้า
              </p>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-purple-200 bg-white">
              <table class="w-full text-left text-xs">
                <thead class="bg-purple-900 text-white">
                  <tr>
                    <th class="p-3">เซลล์</th>
                    <th class="p-3">ฟังก์ชัน</th>
                    <th class="p-3">โจทย์คำถามธุรกิจ</th>
                    <th class="p-3">สูตร Google Sheets</th>
                    <th class="p-3 text-right">คำตอบจริง</th>
                    <th class="p-3 text-center">คัดลอก</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="z4 in zone4FormulaGuide" :key="z4.cell" class="hover:bg-purple-50/50">
                    <td class="p-3 font-mono font-black text-purple-700">{{ z4.cell }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">{{ z4.funcTag }}</span>
                    </td>
                    <td class="p-3 font-bold text-slate-800">{{ z4.title }}</td>
                    <td class="p-3 font-mono text-emerald-700 text-[11px] break-all">{{ z4.formula }}</td>
                    <td class="p-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">{{ z4.answer }}</td>
                    <td class="p-3 text-center">
                      <button @click="copyText(z4.formula, `z4-${z4.cell}`)" type="button"
                        class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 font-bold inline-flex items-center gap-1 cursor-pointer">
                        <Check v-if="copiedKey === `z4-${z4.cell}`" class="w-3.5 h-3.5 text-emerald-600" />
                        <Copy v-else class="w-3.5 h-3.5" />
                        <span>{{ copiedKey === `z4-${z4.cell}` ? 'แล้ว' : 'Copy' }}</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Live Preview VIP vs General Comparison -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="p-4 rounded-2xl bg-white border border-amber-200 space-y-1">
                <div class="text-[11px] font-bold text-amber-800">L27 • ค่าเฉลี่ยลูกค้า VIP</div>
                <div class="text-2xl font-black font-mono text-amber-600">{{ dashboardSegments.vipAvg.toFixed(2) }} ฿</div>
                <div class="text-[11px] text-slate-500">สูงกว่าลูกค้าทั่วไป +{{ dashboardSegments.vipVsGeneralDiff.toFixed(2) }} ฿/บิล</div>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <div class="text-[11px] font-bold text-slate-600">L28 • ค่าเฉลี่ยลูกค้าทั่วไป</div>
                <div class="text-2xl font-black font-mono text-slate-800">{{ dashboardSegments.generalAvg.toFixed(2) }} ฿</div>
                <div class="text-[11px] text-slate-500">เปรียบเทียบตรงๆ ด้วย AVERAGEIF</div>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-purple-200 space-y-1">
                <div class="text-[11px] font-bold text-purple-800">L25 &amp; L26 • VIP QR / บัตรเครดิต</div>
                <div class="text-xl font-black font-mono text-purple-700">{{ dashboardSegments.vipQrCount }} บิล / {{ dashboardSegments.vipCardSum.toLocaleString() }} ฿</div>
                <div class="text-[11px] text-slate-500">เจาะช่องทางจ่ายเงินด้วย COUNTIFS/SUMIFS</div>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1">
                <div class="text-[11px] font-bold text-emerald-800">L29 &amp; L30 • บิลมูลค่าสูง &amp; ช่วงกลาง</div>
                <div class="text-xl font-black font-mono text-emerald-700">{{ dashboardSegments.highOrderCount }} บิล / {{ dashboardSegments.midRangeSum.toLocaleString() }} ฿</div>
                <div class="text-[11px] text-slate-500">บิล &gt;=200 บาท และช่วง 100–200 บาท</div>
              </div>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex items-center justify-between pt-2">
              <button @click="activeWorkshopStep = 4" type="button"
                class="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                &larr; ย้อนกลับขั้นที่ 4
              </button>
              <button @click="activeWorkshopStep = 6" type="button"
                class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer">
                <span>ไปขั้นที่ 6: ตกแต่งเป็นแดชบอร์ดฉบับสมบูรณ์!</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- ============================================================= -->
          <!-- STEP 6: POLISH & COMPLETE NUMERIC KPI DASHBOARD SHOWCASE      -->
          <!-- ============================================================= -->
          <div v-if="shouldShowStep(6)" class="rounded-3xl border-2 border-teal-300 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-5 sm:p-7 space-y-6 shadow-lg">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <span class="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-black">STEP 6 of 6 • FINAL RESULT</span>
                <h4 class="text-lg sm:text-2xl font-black text-white mt-1.5">
                  ขั้นที่ 6: ตกแต่งและตรวจสอบ "แดชบอร์ดตัวเลขฉบับสมบูรณ์ (Final Numeric KPI Dashboard)"
                </h4>
              </div>
              <span class="px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-mono border border-white/20 shrink-0">
                24 Rows Verified
              </span>
            </div>

            <!-- 4-Point Google Sheets Polish Checklist -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div class="font-bold text-cyan-300">1. ซ่อนเส้น Gridlines</div>
                <p class="text-slate-200">เมนู <code>View &rarr; Show &rarr; Gridlines</code> (เอาติ๊กถูกออก) เพื่อเปลี่ยนแผ่นงานให้ดูเหมือนหน้า Dashboard สะอาดตา</p>
              </div>
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div class="font-bold text-emerald-300">2. จัด Format ตัวเลข &amp; %</div>
                <p class="text-slate-200">ใส่ลูกน้ำหลักพัน <code>#,##0</code> ให้ช่องยอดขาย และตั้งค่าทศนิยม 1 ตำแหน่ง <code>0.0%</code> ให้คอลัมน์สัดส่วน</p>
              </div>
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div class="font-bold text-amber-300">3. ใส่ Color Scale (Heatmap)</div>
                <p class="text-slate-200">คลุม <code>L20:N22</code> &rarr; <code>Format &rarr; Conditional formatting &rarr; Color scale</code> เพื่อไฮไลต์จุดขายดีด้วยสีอัตโนมัติ</p>
              </div>
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div class="font-bold text-purple-300">4. เขียน Executive Insights</div>
                <p class="text-slate-200">สรุปสิ่งที่ค้นพบด้านล่างตารางด้วยตัวเลขและเปอร์เซ็นต์จริง 3 ข้อ เพื่อให้ผู้บริหารตัดสินใจได้ทันที</p>
              </div>
            </div>

            <!-- Unified Final Complete Numeric Dashboard Preview -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div class="font-black text-base text-white flex items-center gap-2">
                  <BarChart3 class="w-5 h-5 text-cyan-400" />
                  <span>ตัวอย่างหน้าตาแดชบอร์ดตัวเลขฉบับสมบูรณ์ (ตรวจเทียบคำตอบครบทุกโซน)</span>
                </div>
                <span class="text-xs font-mono text-emerald-300">Numeric_Dashboard (24 Orders from Master_data)</span>
              </div>

              <!-- Zone 1 Strip -->
              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                <div v-for="card in zone1FormulaGuide" :key="`fin-${card.cell}`"
                  class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div class="text-[10px] text-slate-400">{{ card.label }}</div>
                  <div class="text-sm font-black font-mono text-cyan-300 mt-0.5">{{ card.answer }}</div>
                </div>
              </div>

              <!-- Zone 2 & Zone 3 Side-by-Side -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <!-- Zone 2 Mini -->
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div class="font-bold text-emerald-300">Zone 2: สรุปรายสาขา (% Share)</div>
                  <div class="space-y-2">
                    <div v-for="b in dashboardBranchSummary" :key="`fin-b-${b.branch}`" class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-white">{{ b.branch }} ({{ b.count }} บิล)</span>
                        <span class="font-mono text-emerald-300 font-bold">{{ b.sum.toLocaleString() }} ฿ ({{ b.sharePercent.toFixed(1) }}%)</span>
                      </div>
                      <div class="w-full bg-slate-800 rounded-full h-1.5">
                        <div class="h-full bg-emerald-400 rounded-full" :style="{ width: `${b.sharePercent}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Zone 3 Mini Heatmap -->
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div class="font-bold text-amber-300">Zone 3: Matrix สาขา &times; หมวดสินค้า (Heatmap)</div>
                  <table class="w-full text-left font-mono text-[11px]">
                    <thead class="text-slate-400 border-b border-slate-800 font-sans">
                      <tr>
                        <th class="pb-1.5">สาขา</th>
                        <th class="pb-1.5 text-right">กาแฟ</th>
                        <th class="pb-1.5 text-right">ชา</th>
                        <th class="pb-1.5 text-right">เบเกอรี่</th>
                        <th class="pb-1.5 text-right">รวม</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                      <tr v-for="row in dashboardMatrix.rows" :key="`fin-m-${row.branch}`">
                        <td class="py-1.5 font-sans font-bold text-slate-200">{{ row.branch }}</td>
                        <td v-for="cat in categoryList" :key="`fin-c-${cat}`" class="py-1.5 text-right"
                          :class="row.cells[cat] === dashboardMatrix.maxCell ? 'text-amber-300 font-black' : 'text-slate-300'">
                          {{ row.cells[cat].toLocaleString() }}
                        </td>
                        <td class="py-1.5 text-right text-cyan-300 font-bold">{{ row.rowTotal.toLocaleString() }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Auto-Computed Executive Insights -->
              <div class="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-2">
                <div class="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <Lightbulb class="w-4 h-4 text-amber-300" />
                  <span>ตัวอย่าง Executive Mini-Insights 3 ข้อ (สร้างจากตัวเลขจริงของแดชบอร์ด):</span>
                </div>
                <ul class="list-disc pl-5 text-xs text-slate-200 space-y-1 leading-relaxed">
                  <li>
                    <strong>ภาพรวม &amp; การกระจายตัว:</strong> จาก {{ dashboardKpis.count }} บิล สร้างยอดขายรวม <strong>{{ dashboardKpis.sum.toLocaleString() }} บาท</strong> ค่าเฉลี่ย <strong>{{ dashboardKpis.average.toFixed(2) }} บาท</strong> ใกล้เคียงกับมัธยฐาน <strong>{{ dashboardKpis.median.toFixed(2) }} บาท</strong> แสดงว่ายอดซื้อปกติกระจายตัวสมดุล
                  </li>
                  <li>
                    <strong>สาขาและสินค้าทำเงิน:</strong> <strong>{{ topBranch.branch }}</strong> ทำยอดขายสูงสุด <strong>{{ topBranch.sum.toLocaleString() }} บาท ({{ topBranch.sharePercent.toFixed(1) }}%)</strong> โดยคู่ที่ทำรายได้สูงสุดในร้านคือ <strong>{{ dashboardMatrix.maxBranch }} &times; {{ dashboardMatrix.maxCategory }} ({{ dashboardMatrix.maxCell.toLocaleString() }} บาท)</strong>
                  </li>
                  <li>
                    <strong>พฤติกรรมกลุ่มลูกค้า:</strong> สมาชิก <strong>VIP</strong> มียอดเฉลี่ยต่อบิล <strong>{{ dashboardSegments.vipAvg.toFixed(2) }} บาท</strong> สูงกว่าลูกค้าทั่วไป ({{ dashboardSegments.generalAvg.toFixed(2) }} บาท) อยู่ถึง <strong>+{{ dashboardSegments.vipVsGeneralDiff.toFixed(2) }} บาทต่อบิล</strong> จึงควรจัดโปรโมชันดึงลูกค้าทั่วไปสมัครสมาชิก VIP
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="!showAllWorkshopSteps" class="flex items-center justify-between pt-2">
              <button @click="activeWorkshopStep = 5" type="button"
                class="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 cursor-pointer">
                &larr; ย้อนกลับขั้นที่ 5
              </button>
              <span class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4" /> เสร็จสิ้นภาคปฏิบัติ! เลื่อนลงด้านล่างเพื่อทำมินิเกมและใบงานที่ 4 ได้เลย
              </span>
            </div>
          </div>
        </div>

        <!-- =============================================================== -->
        <!-- TAB 2: CONDITIONAL FORMULA BUILDER                              -->
        <!-- =============================================================== -->
        <div v-if="activeLabTab === 'conditional'" class="space-y-5">
          <!-- Controls Panel -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-5">
            <!-- Step 1: Select Function -->
            <div class="space-y-2">
              <div class="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                1. เลือกฟังก์ชันที่ต้องการทดสอบ (สังเกตความต่างระหว่าง 1 เงื่อนไข กับ หลายเงื่อนไข):
              </div>
              <div class="flex flex-wrap gap-2">
                <button v-for="fn in ['COUNTIF', 'SUMIF', 'AVERAGEIF', 'COUNTIFS', 'SUMIFS', 'AVERAGEIFS']" :key="fn"
                  @click="condFunc = fn" type="button"
                  :class="[
                    'px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer border',
                    condFunc === fn
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  ]">
                  ={{ fn }}(...)
                </button>
              </div>
            </div>

            <!-- Step 2: Criteria Selectors -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Criteria 1 -->
              <div class="p-4 rounded-xl bg-slate-800/80 border border-sky-500/40 space-y-2.5">
                <div class="text-xs font-black text-sky-300">เงื่อนไขที่ 1 (Criteria 1)</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-[11px] text-slate-400 mb-1">คอลัมน์ตรวจสอบ:</label>
                    <select v-model="cond1Field"
                      class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400">
                      <option v-for="(meta, key) in cond1FieldMeta" :key="key" :value="key">{{ meta.label }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-400 mb-1">ค่าเงื่อนไขที่ต้องการ:</label>
                    <select v-model="cond1Value"
                      class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400">
                      <option v-for="opt in cond1FieldMeta[cond1Field].options" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Criteria 2 -->
              <div class="p-4 rounded-xl border space-y-2.5 transition-all"
                :class="isMultiConditionFunc ? 'bg-slate-800/80 border-purple-500/40' : 'bg-slate-800/30 border-slate-800 opacity-50 pointer-events-none'">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-purple-300">เงื่อนไขที่ 2 (Criteria 2)</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-300">
                    {{ isMultiConditionFunc ? 'เปิดใช้งาน' : 'เลือกสูตร *IFS เพื่อใช้เงื่อนไขที่ 2' }}
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-[11px] text-slate-400 mb-1">คอลัมน์ตรวจสอบ:</label>
                    <select v-model="cond2Field" :disabled="!isMultiConditionFunc"
                      class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400">
                      <option v-for="(meta, key) in cond2FieldMeta" :key="key" :value="key">{{ meta.label }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-400 mb-1">ค่าเงื่อนไขที่ต้องการ:</label>
                    <select v-model="cond2Value" :disabled="!isMultiConditionFunc"
                      class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400">
                      <option v-for="opt in cond2FieldMeta[cond2Field].options" :key="opt" :value="opt">
                        {{ cond2Field === 'Total_Sales_Gte' ? `>= ${opt} บาท` : opt }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Generated Formula & Live Result -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
              <div class="lg:col-span-8 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[11px] font-bold text-emerald-300 uppercase">สูตรที่ระบบสร้างให้อัตโนมัติ (ช่วงข้อมูล A2:I13):</span>
                  <button @click="copyText(generatedFormula, 'cond-gen')" type="button"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                    <Check v-if="copiedKey === 'cond-gen'" class="w-3.5 h-3.5" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedKey === 'cond-gen' ? 'คัดลอกแล้ว' : 'คัดลอกสูตร' }}</span>
                  </button>
                </div>
                <div class="font-mono text-sm sm:text-base font-bold text-amber-300 break-all">
                  {{ generatedFormula }}
                </div>
                <p class="text-[11px] text-slate-300">{{ formulaExplanation }}</p>
              </div>

              <div class="lg:col-span-4 p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white space-y-1 shadow-md">
                <div class="text-xs font-bold text-emerald-100">ผลลัพธ์จากการคำนวณ (Matched {{ matchedRows.length }}/{{ demoOrders.length }} แถว)</div>
                <div class="text-2xl sm:text-3xl font-black font-mono">{{ computedCondResult.mainValue }}</div>
                <div class="text-[11px] text-emerald-100 font-semibold">
                  คิดเป็นสัดส่วน {{ shareOfTotalPercent }}% ของทั้งหมด ({{ totalDemoRevenue.toLocaleString() }} ฿)
                </div>
              </div>
            </div>
          </div>

          <!-- Highlighted 12-row Table showing which rows passed the conditions -->
          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-800 text-white font-sans">
                <tr>
                  <th class="p-3">สถานะเงื่อนไข</th>
                  <th class="p-3">A: Order_ID</th>
                  <th class="p-3">B: Branch</th>
                  <th class="p-3">C: Category</th>
                  <th class="p-3">D: Menu_Item</th>
                  <th class="p-3">E: Payment</th>
                  <th class="p-3">F: Tier</th>
                  <th class="p-3 text-right">I: Total_Sales</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-for="r in demoOrders" :key="r.orderId"
                  :class="matchedRowIds.has(r.orderId) ? 'bg-emerald-50/90 text-emerald-950 font-bold' : 'text-slate-400 opacity-55'">
                  <td class="p-2.5 font-sans">
                    <span v-if="matchedRowIds.has(r.orderId)"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      <CheckCircle2 class="w-3 h-3" /> ตรงเงื่อนไข
                    </span>
                    <span v-else class="text-[10px] text-slate-400">ไม่เข้าเกณฑ์</span>
                  </td>
                  <td class="p-2.5">{{ r.orderId }}</td>
                  <td class="p-2.5 font-sans">{{ r.branch }}</td>
                  <td class="p-2.5 font-sans">{{ r.category }}</td>
                  <td class="p-2.5 font-sans">{{ r.menuItem }}</td>
                  <td class="p-2.5 font-sans">{{ r.payment }}</td>
                  <td class="p-2.5 font-sans">{{ r.tier }}</td>
                  <td class="p-2.5 text-right">{{ r.totalSales.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- GAME CENTER SECTION (2 MINI GAMES + 10-QUESTION POST-TEST)          -->
    <!-- =================================================================== -->
    <GameCenterSection :course-id="currentCourseId" :week="currentWeek"
      drag-title="มินิเกม 1: จับคู่วิธีคิด — โจทย์แบบนี้ใช้ฟังก์ชันสถิติ/เงื่อนไขกลุ่มไหน?"
      drag-subtitle="ลากสถานการณ์วิเคราะห์ข้อมูลด้านล่าง ไปวางลงในกลุ่มฟังก์ชัน Google Sheets ที่ถูกต้อง"
      drag-tab-label="มินิเกมที่ 1: เลือกใช้ฟังก์ชันให้ถูกโจทย์" :drag-items="dragItemsData" :drag-zones="dragZonesData"
      match-title="มินิเกม 2: จับคู่โครงสร้างสูตรและการล็อกเซลล์กับคำอธิบาย"
      match-subtitle="จับคู่สูตรทางฝั่งซ้าย กับหน้าที่และกฎการใช้งานทางฝั่งขวาให้ถูกต้อง"
      match-tab-label="มินิเกมที่ 2: จับคู่สูตรสถิติและเงื่อนไข" :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs" quiz-title="แบบทดสอบหลังเรียน (Post-test): สัปดาห์ที่ 4"
      :quiz-questions="quizQuestions" />

    <!-- =================================================================== -->
    <!-- LAB ASSIGNMENT SECTION (40-ROW PROJECT FOLLOW-UP FROM WEEK 3)       -->
    <!-- =================================================================== -->
    <AssignmentSection :courseId="currentCourseId" assignmentId="asm-4"
      assignmentTitle="ใบงานที่ 4: ปฏิบัติการวิเคราะห์เชิงสถิติและสรุปข้อมูลแบบมีเงื่อนไข (Summary Statistics & Conditional Aggregations)"
      :maxScore="10">
      <template #number>4</template>

      <template #description>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          ต่อยอดจากชุดข้อมูลโปรเจกต์ <strong>{{ ROWS_PER_PROJECT }} แถว</strong> ที่นักศึกษาจัดทำและคลีนเรียบร้อยแล้ว
          โดยให้เก็บตารางต้นฉบับไว้ในชีต/Spreadsheet ชื่อ <strong><code>Master_data</code></strong> (ห้ามแก้ไขทับ)
          จากนั้น<strong>คัดลอกแยกออกมาเป็นอีกชีต</strong> ชื่อ <strong><code>Numeric_Dashboard</code></strong>
          เพื่อสร้างแดชบอร์ดตัวเลข 4 โซนบนชีตเดียวกัน ตามแบบที่ฝึกปฏิบัติในหน่วยที่ 5 พร้อมสรุปข้อค้นพบจริง 3 ข้อ
        </p>

        <!-- Shared Google Sheets Banner & Project Selector -->
        <div
          class="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-indigo-50 border-2 border-sky-300 shadow-2xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <FileSpreadsheet class="w-5 h-5 text-sky-600" />
                <h4 class="font-black text-sky-950 text-sm sm:text-base">
                  ลิงก์ไฟล์ข้อมูลกลาง Google Sheets (อ้างอิงชุดข้อมูลจากสัปดาห์ที่ 3)
                </h4>
              </div>
              <p class="text-xs text-slate-600 font-mono break-all">
                {{ SHARED_SHEET_URL }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0 flex-wrap">
              <a :href="SHARED_SHEET_URL" target="_blank" rel="noopener noreferrer"
                class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
                <ExternalLink class="w-4 h-4" /> เปิด Google Sheets
              </a>
              <button @click="copySharedSheetUrl" type="button"
                class="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-sky-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
                <Check v-if="copiedSheetUrl" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSheetUrl ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์' }}</span>
              </button>
            </div>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200/90 shadow-2xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Sparkles class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm font-black text-slate-800">
                    เลือกโปรเจกต์เดิมจากสัปดาห์ที่ 3 เพื่อดูรายการสิ่งที่ต้องทำ (6 ข้อ)
                  </div>
                  <p class="text-[11px] text-slate-500">
                    คลิกเลือกหัวข้อโปรเจกต์ของตนเอง เพื่อดูเช็กลิสต์ 6 ข้อที่ต้องวิเคราะห์จริง (ตั้งแต่สถิติภาพรวม, สูตร 1 เงื่อนไข + % Share, สูตรหลายเงื่อนไข ไปจนถึงสรุป Insights)
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold shrink-0">
                ใช้ข้อมูลโปรเจกต์เดิม ({{ ROWS_PER_PROJECT }} แถว)
              </span>
            </div>

            <!-- 11 Topic Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              <button v-for="p in projectTopics" :key="p.no" type="button" @click="selectedProjectNo = p.no"
                :class="[
                  'group text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2.5 cursor-pointer',
                  selectedProjectNo === p.no
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/50 scale-[1.01]'
                    : 'bg-white hover:bg-sky-50/60 text-slate-700 hover:text-sky-950 border-slate-200/90 hover:border-sky-300 shadow-2xs'
                ]">
                <span
                  :class="[
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0',
                    selectedProjectNo === p.no ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700'
                  ]">
                  {{ p.no }}
                </span>
                <div
                  :class="[
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    selectedProjectNo === p.no ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-600 group-hover:bg-sky-100'
                  ]">
                  <component :is="p.icon" class="w-4 h-4" />
                </div>
                <span :class="['text-xs font-bold truncate flex-1', selectedProjectNo === p.no ? 'text-white' : 'text-slate-800']">
                  {{ p.name }}
                </span>
                <CheckCircle2 v-if="selectedProjectNo === p.no" class="w-4 h-4 text-cyan-200 shrink-0" />
              </button>
            </div>

            <!-- Selected Project Sample Questions Box -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50/60 to-sky-50 border border-sky-200 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <component :is="selectedProject.icon" class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                      รายการสิ่งที่ต้องทำสำหรับโปรเจกต์ที่ {{ selectedProject.no }} (6 ข้อ)
                    </div>
                    <div class="text-xs sm:text-sm font-black text-slate-900">
                      {{ selectedProject.name }} ({{ ROWS_PER_PROJECT }} แถว)
                    </div>
                  </div>
                </div>

                <button @click="copyProjectNote" type="button"
                  class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0">
                  <Check v-if="copiedRowText" class="w-3.5 h-3.5" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedRowText ? 'คัดลอกชื่อโปรเจกต์แล้ว!' : 'คัดลอกชื่อโปรเจกต์ไปส่งงาน' }}</span>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs pt-1">
                <div v-for="(task, idx) in selectedProject.tasks" :key="idx"
                  class="p-3 rounded-xl bg-white border border-sky-200/90 space-y-2 shadow-2xs flex flex-col justify-between">
                  <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-full bg-sky-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {{ idx + 1 }}
                      </span>
                      <span class="font-black text-sky-900 text-[11px]">สิ่งที่ต้องทำที่ {{ idx + 1 }}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold text-[10px]">
                      {{ task.tag }}
                    </span>
                  </div>
                  <p class="text-slate-700 leading-relaxed">{{ task.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #tasks>
        <ul class="space-y-5 text-sm text-gray-700">
          <!-- Step 1 -->
          <li class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              1
            </div>
            <div class="space-y-1 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 1: เก็บข้อมูลต้นฉบับไว้ใน <code>Master_data</code> และคัดลอกแยกชีต <code>Numeric_Dashboard</code></strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                เปิดไฟล์ Google Sheets โปรเจกต์ของตนเอง (40 แถว) ตรวจสอบให้แน่ใจว่ามีชีตต้นฉบับชื่อ <strong><code>Master_data</code></strong> (เก็บไว้เป็นข้อมูลเดิม <strong>ห้ามแก้ไขทับ</strong>)
                จากนั้นคลิกขวาเลือก <em>Duplicate (ทำสำเนา)</em> แยกออกมาเป็นชีตใหม่ชื่อ <strong><code>Numeric_Dashboard</code></strong> (หรือสร้างแยกเป็นอีก Spreadsheet)
                เพื่อวางตารางข้อมูลไว้ฝั่งซ้ายและสร้างแดชบอร์ดตัวเลข 4 โซนไว้ฝั่งขวาบนชีตเดียวกัน โดยไม่ต้องเชื่อมสูตรข้ามตาราง
              </p>
            </div>
          </li>

          <!-- Step 2 -->
          <li class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              2
            </div>
            <div class="space-y-1.5 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 2: สร้างแดชบอร์ดตัวเลข 4 โซน ตามโครงสร้างหน่วยที่ 5 (KPI ภาพรวม + 1 เงื่อนไข + Matrix/หลายเงื่อนไข)</strong>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                <div class="p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <strong>ส่วนที่ A • โซน 1 (สถิติภาพรวม 7 ค่า):</strong><br />
                  คำนวณ <code>COUNT/COUNTA</code>, <code>SUM</code>, <code>AVERAGE</code>, <code>MEDIAN</code>, <code>MIN</code>, <code>MAX</code>, <code>STDEV.S</code> จากคอลัมน์ตัวเลขหลัก (ใส่ <code>MODE</code> เพิ่มเป็นคะแนนเสริมได้)
                </div>
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <strong>ส่วนที่ B • โซน 2 (ตาราง 1 เงื่อนไข + % Share):</strong><br />
                  สรุปตามหมวดหมู่หลักด้วย <code>COUNTIF</code>, <code>SUMIF</code>, <code>AVERAGEIF</code> พร้อมคอลัมน์ <strong>สัดส่วน %</strong> (รวมต้องได้ 100%)
                </div>
                <div class="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <strong>ส่วนที่ C • โซน 3–4 (Matrix / หลายเงื่อนไข 3+ ข้อ):</strong><br />
                  สร้างตาราง Matrix 2 มิติหรือตั้งคำถามเจาะลึก 3 ข้อ แล้วตอบด้วย <code>COUNTIFS</code>, <code>SUMIFS</code>, <code>AVERAGEIFS</code> (ใช้ <code>$</code> ล็อกช่วงครบทุกสูตร)
                </div>
              </div>
            </div>
          </li>

          <!-- Step 3 -->
          <li class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              3
            </div>
            <div class="space-y-1 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 3: เขียนสรุปข้อค้นพบ (Mini-Insights 3 ข้อ)</strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                เขียนสรุปสิ่งที่ค้นพบจากการวิเคราะห์ไว้ด้านล่างของแท็บ <code>Numeric_Dashboard</code> จำนวน 3 ข้อ
                โดยระบุ <strong>ตัวเลขจริงหรือเปอร์เซ็นต์</strong> ประกอบทุกข้อ และระบุด้วยว่า <code>AVERAGE</code> กับ <code>MEDIAN</code> ของโปรเจกต์คุณใกล้เคียงหรือต่างกันอย่างไร
              </p>
            </div>
          </li>

          <!-- Step 4 -->
          <li class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
              4
            </div>
            <div class="space-y-2 flex-1">
              <strong class="text-slate-900 text-sm">ขั้นตอนที่ 4: ตั้งค่าแชร์และส่งลิงก์ Google Sheets เข้าระบบ (10 คะแนนเต็ม)</strong>
              <p class="text-xs text-gray-600 leading-relaxed">
                ตั้งค่า Share เป็น <strong>"ทุกคนที่มีลิงก์มีสิทธิ์ดู (Anyone with the link can view)"</strong> แล้วกดปุ่ม "ส่งงานด้วยลิงก์" ด้านล่าง
                พร้อมระบุ <strong>ชื่อโปรเจกต์ที่ทำ</strong> และ <strong>สรุป Insight เด่นที่สุด 1 ข้อ</strong> ในช่องหมายเหตุ
              </p>
              <div class="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1 max-w-2xl">
                <div class="font-bold text-emerald-950">เกณฑ์การให้คะแนน (10 คะแนน):</div>
                <ul class="list-disc pl-5 text-slate-700 space-y-0.5">
                  <li>ตารางสถิติภาพรวมครบ 7 ค่า KPI ภาพรวม (<code>COUNT/COUNTA</code>, <code>SUM</code>, <code>AVERAGE</code>, <code>MEDIAN</code>, <code>MIN</code>, <code>MAX</code>, <code>STDEV.S</code> และใส่ <code>MODE</code> เสริมได้) (2 คะแนน)</li>
                  <li>ตาราง 1 เงื่อนไข (COUNTIF/SUMIF/AVERAGEIF) พร้อมสัดส่วน % Share และล็อกเซลล์ $ ถูกต้อง (3 คะแนน)</li>
                  <li>ตารางหลายเงื่อนไข / Matrix (COUNTIFS/SUMIFS/AVERAGEIFS) ครบ 3 โจทย์ ไม่สลับตำแหน่ง sum_range (3 คะแนน)</li>
                  <li>การเขียนสรุป Mini-Insights 3 ข้อ พร้อมอ้างอิงตัวเลขจริงและความเป็นระเบียบของแดชบอร์ด (2 คะแนน)</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </AssignmentSection>

    <!-- =================================================================== -->
    <!-- PDF SUMMARY SHEET MODAL (DEFAULT SLOT)                              -->
    <!-- =================================================================== -->
    <AssignmentPdfModal v-model="showPdfModal"
      title="สรุปสูตรสัปดาห์ที่ 4: Summary Statistics & Conditional Aggregations"
      subtitle="วิชาการวิเคราะห์และนำเสนอข้อมูล (31901-2012)">
      <div class="space-y-5 text-sm text-gray-800 leading-relaxed">
        <div class="border-b border-gray-200 pb-3">
          <h3 class="text-lg font-bold text-sky-900">
            Cheat Sheet: สถิติภาพรวมและการสรุปข้อมูลแบบมีเงื่อนไข (Google Sheets / Excel)
          </h3>
          <p class="text-xs text-gray-500">คู่มือสูตรคำนวณสำหรับชีต Numeric_Dashboard (คัดลอกแยกจาก Master_data • สัปดาห์ที่ 4)</p>
        </div>

        <div class="space-y-1.5">
          <h4 class="font-bold text-gray-900">1. สูตรคำนวณพื้นฐาน (+, -, *, /, (), SUM และตระกูล COUNT)</h4>
          <ul class="list-disc pl-5 text-xs text-gray-700 space-y-1">
            <li>ทุกสูตรต้องขึ้นต้นด้วย <code>=</code> เสมอ | ใช้ <code>*</code> แทนคูณ (ห้ามใช้ <code>x</code>) | ใช้ <code>/</code> แทนหาร (ห้ามหารด้วย <code>0</code>)</li>
            <li><code>=(B2*C2)-D2</code> ใช้วงเล็บควบคุมลำดับการทำงาน (ถ้าไม่ใส่วงเล็บจะทำคูณ/หารก่อนบวก/ลบ)</li>
            <li><code>=SUM(I2:I25)</code> รวมผลลัพธ์ต่อเนื่องในช่วง (ใช้ <code>:</code> แปลว่า "ถึง", ใช้ <code>,</code> แปลว่า "และ")</li>
            <li><code>=COUNT(range)</code> นับเฉพาะตัวเลข/วันที่ | <code>=COUNTA(range)</code> นับทุกช่องที่ไม่ว่าง | <code>=COUNTBLANK(range)</code> นับช่องว่าง</li>
          </ul>
        </div>

        <div class="space-y-1.5">
          <h4 class="font-bold text-gray-900">2. คำศัพท์พารามิเตอร์ที่ต้องรู้ก่อนเขียนสูตร (Formula Vocabulary)</h4>
          <ul class="list-disc pl-5 text-xs text-gray-700 space-y-1">
            <li><code>range</code> = ช่วงเซลล์ข้อมูลต่อเนื่องกัน เช่น <code>I2:I41</code></li>
            <li><code>criteria_range</code> = ช่วงคอลัมน์ที่จะเข้าไปตรวจสอบเงื่อนไข เช่น ช่วงคอลัมน์สาขา <code>$B$2:$B$41</code></li>
            <li><code>criteria</code> = เงื่อนไข/เกณฑ์ที่ค้นหา เช่น <code>"สาขาสยาม"</code>, <code>{{ '">=150"' }}</code> หรือเซลล์ <code>A5</code></li>
            <li><code>sum_range</code> / <code>average_range</code> = ช่วงคอลัมน์ตัวเลขที่ต้องการนำมาบวกหรือหาค่าเฉลี่ยเฉพาะแถวที่ผ่านเงื่อนไข</li>
            <li><code>$</code> = ล็อกช่วงเซลล์ (Absolute Reference กด <code>F4</code>) ไม่ให้เลื่อนเมื่อลากสูตร | <code>"..."</code> = ครอบข้อความ/เงื่อนไข | <code>*</code> = Wildcard แทนคำใดๆ</li>
          </ul>
        </div>

        <div class="space-y-1.5">
          <h4 class="font-bold text-gray-900">3. สถิติเชิงพรรณนาภาพรวม (Summary Statistics)</h4>
          <ul class="list-disc pl-5 text-xs text-gray-700 space-y-1">
            <li><code>=COUNT(range)</code> นับตัวเลข/วันที่ | <code>=COUNTA(range)</code> นับทุกเซลล์ที่ไม่ว่าง</li>
            <li><code>=SUM(range)</code> ผลรวม | <code>=AVERAGE(range)</code> ค่าเฉลี่ย (ไวต่อค่าสุดโต่ง)</li>
            <li><code>=MEDIAN(range)</code> ค่ามัธยฐาน (ค่าตรงกลางเมื่อเรียงลำดับ ใช้แทนค่าเฉลี่ยเมื่อมีตัวเลขกระโดด/Outlier) | <code>=MODE(range)</code> ฐานนิยม (ค่าที่พบบ่อยสุด)</li>
            <li><code>=MIN(range)</code> / <code>=MAX(range)</code> ค่าต่ำสุด-สูงสุด (ดูช่วงข้อมูลและสแกนหาค่าผิดปกติ เช่น ยอดติดลบ) | <code>=STDEV.S(range)</code> ส่วนเบี่ยงเบนมาตรฐาน (วัดความนิ่ง/ความแกว่งเทียบค่าเฉลี่ย)</li>
          </ul>
        </div>

        <div class="space-y-1.5">
          <h4 class="font-bold text-gray-900">4. สูตรแบบ 1 เงื่อนไข vs หลายเงื่อนไข (ระวังตำแหน่ง range!)</h4>
          <ul class="list-disc pl-5 text-xs text-gray-700 space-y-1 font-mono">
            <li>=COUNTIF(criteria_range, criteria)</li>
            <li>=SUMIF(criteria_range, criteria, sum_range)  &larr; sum_range อยู่ท้ายสุด</li>
            <li>=AVERAGEIF(criteria_range, criteria, average_range)</li>
            <li>=COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, ...)</li>
            <li>=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2) &larr; sum_range ย้ายมาตัวแรก!</li>
            <li>=AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2)</li>
          </ul>
        </div>

        <div class="space-y-1.5">
          <h4 class="font-bold text-gray-900">5. กฎทอง 3 ข้อก่อนส่งงาน Numeric_Dashboard</h4>
          <ol class="list-decimal pl-5 text-xs text-gray-700 space-y-1">
            <li>เก็บข้อมูลต้นฉบับไว้ในชีต <code>Master_data</code> ห้ามแก้ทับ — แยกคัดลอกเป็นชีต <code>Numeric_Dashboard</code> และล็อกช่วงเซลล์ด้วย <code>$</code> (เช่น <code>$B$2:$B$41</code>) ก่อนลากสูตรเสมอ</li>
            <li>เครื่องหมายเปรียบเทียบต้องครอบด้วยฟันหนู เช่น <code>{{ '">=150"' }}</code> หรือเชื่อมเซลล์ด้วย <code>{{ '">=" & G2' }}</code></li>
            <li>เขียนสรุป Insight พร้อมตัวเลขและเปอร์เซ็นต์กำกับทุกครั้ง (Chart/Number &ne; Insight)</li>
          </ol>
        </div>
      </div>
    </AssignmentPdfModal>

    <!-- =================================================================== -->
    <!-- PRE-TEST MODAL                                                      -->
    <!-- =================================================================== -->
    <PreTestModal
      :is-open="showPreTestModal"
      :course-id="currentCourseId"
      :week="currentWeek"
      :questions="quizQuestions"
      topic-title="แบบทดสอบก่อนเรียน: สถิติพื้นฐานและการสรุปข้อมูลแบบมีเงื่อนไข"
      @close="showPreTestModal = false"
    />
  </div>
</template>
