<script setup>
import { ref, computed } from 'vue'
import {
  GitCommit, GitBranch, Terminal, CheckCircle2, Target, Award,
  Lightbulb, Book, Clock, ShieldCheck, RotateCcw, FileCode,
  Search, Eye, Copy, Check, AlertTriangle, Layers, Code,
  FileText, User, Folder, FileX, Sliders, Zap, Play, ChevronRight,
  ExternalLink
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

// Current Course & Week Context
const currentCourseId = '21901-2012'
const currentWeek = 4

// Google Docs Assignment Link
const ASSIGNMENT_DOC_URL = 'https://docs.google.com/document/d/1PZZme-a9g6GV9AX20ejw0WBXw8WUJToMZ0gE-ogRmAM/edit?usp=sharing'

// Copy Code Snippet Helper
const copiedSnippet = ref('')
const copyText = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedSnippet.value = id
    setTimeout(() => {
      copiedSnippet.value = ''
    }, 2000)
  })
}

const gitDiffDemoSnippets = {
  logShow: `git log --oneline -n 5
git show 9f4e2a1`,
  gitignoreTemplate: `# ไฟล์บันทึกการทำงานและไฟล์ชั่วคราว
*.log
temp/

# ไฟล์ตั้งค่าความลับและตัวแปรสภาพแวดล้อม
.env
.env.local

# โฟลเดอร์ไลบรารีและไฟล์ผลลัพธ์จากการ Build
node_modules/
dist/

# ข้อยกเว้น: ต้องการติดตามไฟล์สำคัญแม้จะตรงกับกฎด้านบน
!important.log`,
  restoreSafe: `# ยกเลิกการแก้ไขใน Working Directory (ระวัง: แก้ไขที่ยังไม่เซฟจะหายไป)
git restore app.js

# นำไฟล์ออกจาก Staging Area กลับสู่ Working Directory (โค้ดที่แก้ยังอยู่ครบ)
git restore --staged app.js`
}

// ============================================================================
// INTERACTIVE DEMO 1: GIT DIFF VISUALIZER
// ============================================================================
const selectedDiffScenario = ref('price-fix')
const diffMode = ref('working') // 'working' | 'staged'

const diffScenarios = [
  {
    id: 'price-fix',
    label: '1. แก้สูตรคำนวณราคา (cart.js)',
    file: 'src/cart.js',
    working: {
      command: 'git diff src/cart.js',
      comparisonLabel: 'Working Directory <-> Staging Area',
      header: [
        'diff --git a/src/cart.js b/src/cart.js',
        'index 3a91c02..8f2d4b1 100644'
      ],
      oldFile: '--- a/src/cart.js',
      newFile: '+++ b/src/cart.js',
      hunk: '@@ -12,6 +12,7 @@ function calculateTotal(price, qty, discount) {',
      lines: [
        { type: 'context', text: '  const subtotal = price * qty;' },
        { type: 'remove', text: '- const total = subtotal - discount;' },
        { type: 'add', text: '+ const safeDiscount = Math.min(discount, subtotal);' },
        { type: 'add', text: '+ const total = subtotal - safeDiscount;' },
        { type: 'context', text: '  return total;' },
        { type: 'context', text: '}' }
      ],
      explanation: 'คำสั่ง git diff แสดงโค้ดที่เราเพิ่งแก้ใน VS Code (Working Directory) แต่ยังไม่ได้สั่ง git add โดยลบบรรทัดสีแดง (-) ที่อาจทำให้ยอดรวมติดลบ และเพิ่ม 2 บรรทัดสีเขียว (+) เพื่อจำกัดส่วนลดไม่ให้เกินราคาสินค้า'
    },
    staged: {
      command: 'git diff --staged src/cart.js',
      comparisonLabel: 'Staging Area <-> Last Commit (HEAD)',
      header: [
        'diff --git a/src/cart.js b/src/cart.js',
        'index 11b4e90..3a91c02 100644'
      ],
      oldFile: '--- a/src/cart.js (HEAD)',
      newFile: '+++ b/src/cart.js (Staged)',
      hunk: '@@ -4,5 +4,6 @@ const TAX_RATE = 0.07;',
      lines: [
        { type: 'context', text: 'function formatCurrency(amount) {' },
        { type: 'remove', text: '-  return amount + " THB";' },
        { type: 'add', text: '+  return Number(amount).toLocaleString("th-TH") + " บาท";' },
        { type: 'context', text: '}' }
      ],
      explanation: 'เมื่อรัน git add src/cart.js แล้ว คำสั่ง git diff ปกติจะไม่แสดงผลอะไร ต้องใช้ git diff --staged เพื่อตรวจทานสิ่งที่อยู่ใน Staging Area เทียบกับ Commit ล่าสุดก่อนสั่ง git commit'
    }
  },
  {
    id: 'login-bug',
    label: '2. แก้บั๊กรหัสผ่าน (auth.js)',
    file: 'src/auth.js',
    working: {
      command: 'git diff src/auth.js',
      comparisonLabel: 'Working Directory <-> Staging Area',
      header: [
        'diff --git a/src/auth.js b/src/auth.js',
        'index 7c12a88..d45e901 100644'
      ],
      oldFile: '--- a/src/auth.js',
      newFile: '+++ b/src/auth.js',
      hunk: '@@ -20,5 +20,6 @@ function validatePassword(password) {',
      lines: [
        { type: 'context', text: '  if (!password) return false;' },
        { type: 'remove', text: '-  return password.length > 4;' },
        { type: 'add', text: '+  const trimmed = password.trim();' },
        { type: 'add', text: '+  return trimmed.length >= 8;' },
        { type: 'context', text: '}' }
      ],
      explanation: 'ตรวจสอบการแก้เงื่อนไขความปลอดภัยในไฟล์ auth.js ก่อนเข้าคิว Staging โดยเปลี่ยนจากรับรหัสผ่านยาวกว่า 4 ตัว มาเป็นการตัดช่องว่างหัวท้ายและกำหนดขั้นต่ำ 8 ตัวอักษร'
    },
    staged: {
      command: 'git diff --staged src/auth.js',
      comparisonLabel: 'Staging Area <-> Last Commit (HEAD)',
      header: [
        'diff --git a/src/auth.js b/src/auth.js',
        'index 55c0e11..7c12a88 100644'
      ],
      oldFile: '--- a/src/auth.js (HEAD)',
      newFile: '+++ b/src/auth.js (Staged)',
      hunk: '@@ -1,4 +1,5 @@',
      lines: [
        { type: 'context', text: 'const MAX_LOGIN_ATTEMPTS = 5;' },
        { type: 'remove', text: '-const SESSION_TIMEOUT_MIN = 60;' },
        { type: 'add', text: '+const SESSION_TIMEOUT_MIN = 30;' },
        { type: 'context', text: 'export { MAX_LOGIN_ATTEMPTS, SESSION_TIMEOUT_MIN };' }
      ],
      explanation: 'ตรวจทานค่าคงที่ SESSION_TIMEOUT_MIN ที่ถูกแก้จาก 60 นาทีเหลือ 30 นาทีและถูก git add เตรียมไว้แล้ว เพื่อยืนยันความถูกต้องก่อนสร้าง Commit บันทึกถาวร'
    }
  },
  {
    id: 'add-feature',
    label: '3. เพิ่มป้ายสถานะ (profile.html)',
    file: 'profile.html',
    working: {
      command: 'git diff profile.html',
      comparisonLabel: 'Working Directory <-> Staging Area',
      header: [
        'diff --git a/profile.html b/profile.html',
        'index a01b221..f93c114 100644'
      ],
      oldFile: '--- a/profile.html',
      newFile: '+++ b/profile.html',
      hunk: '@@ -18,4 +18,6 @@ <div class="profile-card">',
      lines: [
        { type: 'context', text: '  <h2>Somchai Jaidee</h2>' },
        { type: 'remove', text: '-  <span class="role">Student</span>' },
        { type: 'add', text: '+  <span class="role">Student - Class 2/1</span>' },
        { type: 'add', text: '+  <span class="badge-online">Online</span>' },
        { type: 'context', text: '</div>' }
      ],
      explanation: 'เปรียบเทียบแท็ก HTML ที่กำลังปรับแก้ใน Working Directory เพื่อเช็กว่าไม่มีแท็กปิดขาดหาย หรือข้อความพิมพ์ผิดก่อนนำไปจัดเก็บลง Staging Area'
    },
    staged: {
      command: 'git diff --staged profile.html',
      comparisonLabel: 'Staging Area <-> Last Commit (HEAD)',
      header: [
        'diff --git a/profile.html b/profile.html',
        'index 88a7d01..a01b221 100644'
      ],
      oldFile: '--- a/profile.html (HEAD)',
      newFile: '+++ b/profile.html (Staged)',
      hunk: '@@ -1,4 +1,4 @@',
      lines: [
        { type: 'context', text: '<head>' },
        { type: 'remove', text: '-  <title>Profile</title>' },
        { type: 'add', text: '+  <title>Student Profile | Classroom</title>' },
        { type: 'context', text: '</head>' }
      ],
      explanation: 'ตรวจดูส่วน <head> ที่ถูก git add เข้า Staging Area แล้ว เทียบกับเวอร์ชันที่บันทึกไว้ใน Commit ก่อนหน้า เหมาะมากสำหรับการตรวจทานครั้งสุดท้ายก่อน git commit'
    }
  }
]

const activeDiffData = computed(() => {
  const scenario = diffScenarios.find(s => s.id === selectedDiffScenario.value) || diffScenarios[0]
  return scenario[diffMode.value]
})

// ============================================================================
// INTERACTIVE DEMO 2: GIT LOG DETECTIVE TERMINAL
// ============================================================================
const activeLogCmd = ref('log-oneline')

const logDetectiveCommands = [
  {
    id: 'log-oneline',
    label: 'git log --oneline --graph',
    command: 'git log --oneline --graph --decorate',
    lines: [
      { text: '* 9f4e2a1 (HEAD -> main) fix: correct discount rate in checkout', cls: 'text-amber-300 font-semibold' },
      { text: '* 7c2b108 feat: add coupon validation helper', cls: 'text-slate-300' },
      { text: '* 4a8d310 feat: create cart calculation module', cls: 'text-slate-300' },
      { text: '* 1e0f552 chore: add .gitignore and initial project setup', cls: 'text-slate-400' }
    ],
    analysis: 'แสดงประวัติ Commit ทั้งหมดแบบย่อ 1 บรรทัดต่อ 1 Commit พร้อมเส้นกราฟ (*) และป้ายบอกตำแหน่งปัจจุบัน (HEAD -> main) ช่วยให้ไล่ดูลำดับเวลาและคัดลอกรหัส Hash 7 ตัวแรก (เช่น 9f4e2a1) ไปใช้ตรวจต่อได้ทันที'
  },
  {
    id: 'log-stat',
    label: 'git log --stat -n 3',
    command: 'git log --stat -n 3',
    lines: [
      { text: 'commit 9f4e2a1c8d72b104e9a11223344556677889900a (HEAD -> main)', cls: 'text-amber-400 font-semibold' },
      { text: 'Author: Nattapong Dev <nattapong@college.ac.th>', cls: 'text-slate-300' },
      { text: 'Date:   Mon Nov 23 09:15:10 2026 +0700', cls: 'text-slate-400' },
      { text: '    fix: correct discount rate in checkout', cls: 'text-white pt-1' },
      { text: ' src/cart.js | 4 ++--', cls: 'text-cyan-300' },
      { text: ' 1 file changed, 2 insertions(+), 2 deletions(-)', cls: 'text-emerald-300 pb-2' },
      { text: 'commit 7c2b108f3b21e991a2b3c4d5e6f7a8b9c0d1e2f3', cls: 'text-amber-400 font-semibold' },
      { text: 'Author: Pimchanok UI <pimchanok@college.ac.th>', cls: 'text-slate-300' },
      { text: '    feat: add coupon validation helper', cls: 'text-white pt-1' },
      { text: ' src/coupon.js | 18 ++++++++++++++++++', cls: 'text-cyan-300' },
      { text: ' src/cart.js   |  3 ++-', cls: 'text-cyan-300' },
      { text: ' 2 files changed, 20 insertions(+), 1 deletion(-)', cls: 'text-emerald-300' }
    ],
    analysis: 'ตัวเลือก --stat -n 3 ใช้จำกัดการแสดงผลเฉพาะ 3 Commit ล่าสุด พร้อมสรุปรายชื่อไฟล์ที่ถูกแก้ไขและจำนวนบรรทัดที่เพิ่ม (+) หรือลบ (-) เหมาะสำหรับนักสืบหาว่าไฟล์ใดถูกแตะต้องในรอบนั้นบ้าง'
  },
  {
    id: 'show-commit',
    label: 'git show 9f4e2a1',
    command: 'git show 9f4e2a1',
    lines: [
      { text: 'commit 9f4e2a1c8d72b104e9a11223344556677889900a (HEAD -> main)', cls: 'text-amber-400 font-semibold' },
      { text: 'Author: Nattapong Dev <nattapong@college.ac.th>', cls: 'text-slate-300' },
      { text: 'Date:   Mon Nov 23 09:15:10 2026 +0700', cls: 'text-slate-400' },
      { text: '    fix: correct discount rate in checkout', cls: 'text-white py-1' },
      { text: 'diff --git a/src/cart.js b/src/cart.js', cls: 'text-slate-400' },
      { text: '@@ -14,3 +14,3 @@ function applyDiscount(total, percent) {', cls: 'text-cyan-400' },
      { text: '-  return total - (total * percent); // Bug: ลืมหาร 100', cls: 'text-rose-400 bg-rose-500/10' },
      { text: '+  return total - (total * (percent / 100));', cls: 'text-emerald-400 bg-emerald-500/10' }
    ],
    analysis: 'เมื่อพบ Commit ที่น่าสงสัยจาก git log ให้ใช้ git show <hash> เพื่อเปิดส่องรายละเอียดภายใน Commit นั้นทั้ง Metadata และโค้ด Diff ทุกบรรทัด ช่วยยืนยันจุดที่ทำให้เกิดบั๊กหรือวิธีแก้ไขได้อย่างแม่นยำ'
  },
  {
    id: 'blame-file',
    label: 'git blame src/cart.js',
    command: 'git blame src/cart.js',
    lines: [
      { text: '4a8d310 (Somchai Dev   2026-11-20 10:12:04 +0700  1) function calculateSubtotal(items) {', cls: 'text-slate-300' },
      { text: '4a8d310 (Somchai Dev   2026-11-20 10:12:04 +0700  2)   return items.reduce((sum, i) => sum + i.price, 0);', cls: 'text-slate-300' },
      { text: '4a8d310 (Somchai Dev   2026-11-20 10:12:04 +0700  3) }', cls: 'text-slate-300' },
      { text: '7c2b108 (Pimchanok UI  2026-11-21 14:40:22 +0700 13) function applyDiscount(total, percent) {', cls: 'text-cyan-300' },
      { text: '9f4e2a1 (Nattapong Dev 2026-11-23 09:15:10 +0700 14)   return total - (total * (percent / 100));', cls: 'text-amber-300 font-semibold' },
      { text: '7c2b108 (Pimchanok UI  2026-11-21 14:40:22 +0700 15) }', cls: 'text-cyan-300' }
    ],
    analysis: 'คำสั่ง git blame แสดงประวัติแบบเจาะลึกรายบรรทัดว่าโค้ดแต่ละบรรทัดมาจาก Commit Hash ใด ใครเป็นผู้แก้ไขล่าสุด และแก้เมื่อวันเวลาใด เพื่อให้นักพัฒนาติดต่อสอบถามเหตุผลเบื้องหลังโค้ดนั้นได้ตรงคน'
  }
]

const currentDetectiveOutput = computed(() => {
  return logDetectiveCommands.find(c => c.id === activeLogCmd.value) || logDetectiveCommands[0]
})

// ============================================================================
// GAME 1: DRAG & DROP (จำแนกหมวดหมู่คำสั่งติดตามและจัดการประวัติ Git)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'git diff (เทียบ Working กับ Staging)', type: 'diff' },
  { id: 2, text: 'git diff --staged (เทียบ Staging กับ Commit ล่าสุด)', type: 'diff' },
  { id: 3, text: 'git log --oneline --graph (ดูเส้นกราฟประวัติ)', type: 'history' },
  { id: 4, text: 'git show <hash> และ git blame <file>', type: 'history' },
  { id: 5, text: 'git restore --staged <file> (นำไฟล์ออกจากคิว)', type: 'undo' },
  { id: 6, text: 'กำหนดกฎในไฟล์ .gitignore เพื่อละเว้นไฟล์ขยะ', type: 'undo' }
]

const dragZonesData = [
  {
    id: 'diff',
    title: '1. กลุ่มตรวจสอบความแตกต่าง (Diffing)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากคำสั่งที่ใช้เทียบโค้ดก่อน Commit มาที่นี่'
  },
  {
    id: 'history',
    title: '2. กลุ่มสืบค้นประวัติ (History Inspection)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคำสั่งดูประวัติและสืบค้น Commit มาที่นี่'
  },
  {
    id: 'undo',
    title: '3. กลุ่มยกเลิกและละเว้นไฟล์ (Undo & Ignore)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากคำสั่งย้อนกลับและการตั้งค่า .gitignore มาที่นี่'
  }
]

// ============================================================================
// GAME 2: MATCHING GAME (จับคู่คำสั่ง Git และหน้าที่การทำงาน)
// ============================================================================
const matchLeftTerms = [
  { id: 'l1', text: 'git diff', match: 'r1' },
  { id: 'l2', text: 'git diff --staged', match: 'r2' },
  { id: 'l3', text: 'git log --oneline --graph', match: 'r3' },
  { id: 'l4', text: 'git show <hash>', match: 'r4' },
  { id: 'l5', text: 'git blame <file>', match: 'r5' },
  { id: 'l6', text: 'git restore --staged <file>', match: 'r6' }
]

const matchRightDefs = [
  { id: 'r1', text: 'เปรียบเทียบโค้ดที่แก้ใน Working Directory กับ Staging Area' },
  { id: 'r2', text: 'เปรียบเทียบไฟล์ที่อยู่บน Staging Area กับ Commit ล่าสุด' },
  { id: 'r3', text: 'แสดงประวัติ Commit แบบย่อบรรทัดเดียวพร้อมเส้นสายกราฟ' },
  { id: 'r4', text: 'เปิดดูรายละเอียด Metadata และโค้ด Diff ของ Commit ที่ระบุ' },
  { id: 'r5', text: 'แสดงประวัติผู้แก้ไข รหัส Commit และเวลาแบบรายบรรทัดในไฟล์' },
  { id: 'r6', text: 'ดึงไฟล์ออกจาก Staging Area โดยไม่ลบโค้ดที่เขียนแก้ไขไว้' }
]

// ============================================================================
// GAME 3: POST-TEST (10 ข้อ ตัวเลือกลวงแนบเนียน กระจาย A/B/C/D)
// ============================================================================
const quizQuestions = [
  {
    id: 1,
    question: 'คำสั่ง "git diff" (โดยไม่ใส่ Option เพิ่มเติม) ใช้เปรียบเทียบความแตกต่างระหว่างพื้นที่ใดกับพื้นที่ใด?',
    options: [
      { id: 'a', text: 'Staging Area กับ Local Repository (Commit ล่าสุด)', isCorrect: false },
      { id: 'b', text: 'Working Directory กับ Staging Area (Index)', isCorrect: true },
      { id: 'c', text: 'Local Repository กับ Remote Repository บน GitHub', isCorrect: false },
      { id: 'd', text: 'Commit ปัจจุบัน กับ Commit แรกสุดของโปรเจกต์', isCorrect: false }
    ],
    explanation: 'โดยค่าเริ่มต้น git diff จะเทียบไฟล์ที่เรากำลังแก้ใน Working Directory กับสถานะล่าสุดที่อยู่ใน Staging Area (หรือ Commit ล่าสุดหากยังไม่มีอะไรใน Staging)'
  },
  {
    id: 2,
    question: 'หลังจากนักพัฒนาสั่ง "git add app.js" แล้ว หากต้องการตรวจทานการเปลี่ยนแปลงของไฟล์นั้นก่อนสั่ง Commit ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'git diff app.js', isCorrect: false },
      { id: 'b', text: 'git status --diff app.js', isCorrect: false },
      { id: 'c', text: 'git diff --staged app.js', isCorrect: true },
      { id: 'd', text: 'git log --patch app.js', isCorrect: false }
    ],
    explanation: 'เมื่อไฟล์ถูก git add เข้า Staging Area แล้ว คำสั่ง git diff ปกติจะไม่แสดงผล ต้องใช้ git diff --staged (หรือ --cached) เพื่อเทียบ Staging Area กับ Commit ล่าสุด'
  },
  {
    id: 3,
    question: 'ในผลลัพธ์ของ git diff เครื่องหมาย "-" สีแดง และ "+" สีเขียวหน้าบรรทัดโค้ดมีความหมายอย่างไร?',
    options: [
      { id: 'a', text: 'เครื่องหมาย "-" คือบรรทัดที่ถูกลบออก และ "+" คือบรรทัดที่ถูกเพิ่มเข้าไปใหม่', isCorrect: true },
      { id: 'b', text: 'เครื่องหมาย "-" คือบรรทัดที่เกิด Syntax Error และ "+" คือบรรทัดที่คอมไพล์ผ่านแล้ว', isCorrect: false },
      { id: 'c', text: 'เครื่องหมาย "-" คือไฟล์ที่อยู่ใน .gitignore และ "+" คือไฟล์ที่ถูก Track ในระบบ', isCorrect: false },
      { id: 'd', text: 'เครื่องหมาย "-" คือโค้ดจาก Remote Branch และ "+" คือโค้ดจาก Local Branch', isCorrect: false }
    ],
    explanation: 'รูปแบบ Unified Diff ของ Git ใช้เครื่องหมายลบ (-) สีแดงแทนบรรทัดเดิมที่ถูกเอาออก และเครื่องหมายบวก (+) สีเขียวแทนบรรทัดใหม่ที่ถูกใส่เข้ามา'
  },
  {
    id: 4,
    question: 'หากต้องการดูประวัติ Commit แบบกระชับ 1 บรรทัดต่อ 1 Commit พร้อมเส้นกราฟและรายชื่อ Branch ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'git log --short --tree --list', isCorrect: false },
      { id: 'b', text: 'git log --brief --visual --branch', isCorrect: false },
      { id: 'c', text: 'git log --compact --line --head', isCorrect: false },
      { id: 'd', text: 'git log --oneline --graph --decorate', isCorrect: true }
    ],
    explanation: '--oneline ย่อให้เหลือรหัส Hash สั้นกับข้อความ 1 บรรทัด, --graph วาดเส้นเชื่อมประวัติ และ --decorate แสดงป้ายชี้เช่น HEAD -> main'
  },
  {
    id: 5,
    question: 'คำสั่ง "git log --stat -n 3" ให้ข้อมูลใดแก่นักพัฒนา?',
    options: [
      { id: 'a', text: 'แสดงเฉพาะ 3 ไฟล์ล่าสุดที่ถูกลบออกจาก Repository', isCorrect: false },
      { id: 'b', text: 'แสดงประวัติ 3 Commit ล่าสุด พร้อมสรุปชื่อไฟล์และจำนวนบรรทัดที่เพิ่มหรือลบ', isCorrect: true },
      { id: 'c', text: 'แสดงรายชื่อสมาชิกทีมทั้งหมด 3 คนที่เข้าใช้งานระบบในวันนี้', isCorrect: false },
      { id: 'd', text: 'คำนวณสถิติเวลาที่ใช้ในการเขียนโปรแกรมย้อนหลัง 3 สัปดาห์', isCorrect: false }
    ],
    explanation: 'Option -n 3 จำกัดจำนวนแสดงผล 3 Commit ล่าสุด และ --stat แสดงสถิติไฟล์ที่เปลี่ยนแปลงพร้อมจำนวน insertions (+) และ deletions (-)'
  },
  {
    id: 6,
    question: 'เมื่อพบรหัส Commit เช่น "9f4e2a1" จากคำสั่ง git log และต้องการเปิดดูรายละเอียดโค้ด Diff ทั้งหมดที่เกิดขึ้นใน Commit นั้น ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'git open 9f4e2a1', isCorrect: false },
      { id: 'b', text: 'git status 9f4e2a1', isCorrect: false },
      { id: 'c', text: 'git show 9f4e2a1', isCorrect: true },
      { id: 'd', text: 'git blame 9f4e2a1', isCorrect: false }
    ],
    explanation: 'คำสั่ง git show <commit-hash> ใช้แสดงข้อมูลผู้สร้าง เวลา ข้อความ Commit และ Diff ของการแก้ไขทั้งหมดใน Commit ที่ระบุ'
  },
  {
    id: 7,
    question: 'คำสั่ง "git blame index.js" มีประโยชน์หลักอย่างไรในการทำงานร่วมกันเป็นทีม?',
    options: [
      { id: 'a', text: 'ตรวจสอบความเร็วการทำงานของฟังก์ชันแต่ละตัวในไฟล์ index.js', isCorrect: false },
      { id: 'b', text: 'ส่งข้อความแจ้งเตือนไปยังหัวหน้าทีมเมื่อพบโค้ดที่ทำงานผิดพลาด', isCorrect: false },
      { id: 'c', text: 'ซ่อนชื่อผู้เขียนโค้ดเพื่อรักษาความเป็นส่วนตัวของสมาชิกก่อนส่งงาน', isCorrect: false },
      { id: 'd', text: 'แสดงว่าโค้ดแต่ละบรรทัดในไฟล์ถูกแก้ไขล่าสุดโดยใคร ใน Commit ใด และเมื่อไหร่', isCorrect: true }
    ],
    explanation: 'git blame แสดงข้อมูล Hash, ชื่อผู้แก้ไข และวันเวลาของทุกบรรทัดในไฟล์ ทำให้สามารถสืบค้นบริบทหรือสอบถามผู้พัฒนาที่เกี่ยวข้องได้อย่างแม่นยำ'
  },
  {
    id: 8,
    question: 'ข้อใดคือความหมายของรูปแบบกฎ "*.log" และ "!important.log" ที่เขียนเรียงกันภายในไฟล์ .gitignore?',
    options: [
      { id: 'a', text: 'ละเว้นไฟล์นามสกุล .log ทั้งหมด ยกเว้นไฟล์ชื่อ important.log ให้ติดตามตามปกติ', isCorrect: true },
      { id: 'b', text: 'ติดตามไฟล์ .log ทั้งหมด แต่บังคับให้ลบไฟล์ชื่อ important.log ทิ้งทันที', isCorrect: false },
      { id: 'c', text: 'เปลี่ยนชื่อไฟล์ .log ทุกไฟล์ให้ขึ้นต้นด้วยเครื่องหมายตกใจโดยอัตโนมัติ', isCorrect: false },
      { id: 'd', text: 'ซ่อนไฟล์ important.log ออกจากเครื่องคอมพิวเตอร์และบันทึกไฟล์ .log อื่นลง Git', isCorrect: false }
    ],
    explanation: 'เครื่องหมาย * ใช้แทนชื่อใดๆ ก็ได้ ส่วนเครื่องหมาย ! ด้านหน้าใช้เป็นข้อยกเว้น (Negation) เพื่อสั่งให้ Git กลับมาติดตามไฟล์ important.log แม้จะมีกฎ *.log ดักไว้ด้านบน'
  },
  {
    id: 9,
    question: 'หากเผลอสั่ง "git add config.json" เข้า Staging Area ไปแล้ว ต้องการดึงไฟล์นี้ออกจาก Staging โดย "ยังคงโค้ดที่แก้ไขไว้ครบ" ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'git restore config.json', isCorrect: false },
      { id: 'b', text: 'git restore --staged config.json', isCorrect: true },
      { id: 'c', text: 'git rm --force config.json', isCorrect: false },
      { id: 'd', text: 'git delete --stage config.json', isCorrect: false }
    ],
    explanation: 'git restore --staged <file> เป็นวิธีที่ปลอดภัยในการนำไฟล์ออกจาก Staging Area กลับลงมาที่ Working Directory โดยที่การแก้ไขทั้งหมดในไฟล์ยังคงอยู่'
  },
  {
    id: 10,
    question: 'ข้อใดคือข้อควรระวังสำคัญที่สุดก่อนตัดสินใจรันคำสั่ง "git restore app.js" (โดยไม่มี --staged)?',
    options: [
      { id: 'a', text: 'คำสั่งนี้จะลบโฟลเดอร์ .git และประวัติการ Commit ทั้งหมดในเครื่องทิ้ง', isCorrect: false },
      { id: 'b', text: 'คำสั่งนี้จะทำการส่งโค้ดขึ้นไปยัง GitHub ทันทีโดยไม่ผ่านการตรวจทาน', isCorrect: false },
      { id: 'c', text: 'การแก้ไขใน Working Directory ที่ยังไม่เคย Commit จะถูกลบทับและไม่สามารถกู้คืนได้', isCorrect: true },
      { id: 'd', text: 'ไฟล์ app.js จะถูกเพิ่มชื่อเข้าไปในไฟล์ .gitignore โดยอัตโนมัติ', isCorrect: false }
    ],
    explanation: 'git restore <file> จะเขียนทับไฟล์ใน Working Directory ด้วยเวอร์ชันจาก Staging/HEAD ทันที ดังนั้นโค้ดที่เพิ่งแก้และยังไม่ได้ Commit จะหายไปถาวร'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header Banner -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-indigo-500">
        <GitCommit class="w-[420px] h-[420px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span
            class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider shadow-sm">
            สัปดาห์ที่ 4
          </span>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
            หน่วยที่ 2 (การติดตามและตรวจสอบประวัติข้อมูล)
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-indigo-950 mb-4 leading-tight">
          การเก็บข้อมูลและการเรียกดูประวัติของแฟ้มข้อมูล<br />
          <span class="text-xl md:text-3xl text-indigo-700">(Tracking Changes & Inspecting History)</span>
        </h1>
        <p class="text-gray-600 text-base md:text-lg leading-relaxed">
          เจาะลึกการตรวจความแตกต่างของโค้ดด้วย <code class="font-mono font-bold text-indigo-700">git diff</code>,
          การสืบค้นประวัติด้วย <code class="font-mono font-bold text-indigo-700">git log</code>,
          <code class="font-mono font-bold text-indigo-700">git show</code> และ
          <code class="font-mono font-bold text-indigo-700">git blame</code>,
          การเขียนกฎละเว้นไฟล์ใน <code class="font-mono font-bold text-indigo-700">.gitignore</code>
          รวมถึงการยกเลิกการแก้ไขอย่างปลอดภัยด้วย <code class="font-mono font-bold text-indigo-700">git restore</code>
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->

    <!-- Unit Objectives & Competencies -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">แผนการจัดการเรียนรู้และจุดประสงค์ประจำหน่วย</h2>
          <p class="text-sm text-gray-500 mt-0.5">หน่วยที่ 2: การติดตามความเปลี่ยนแปลง สืบค้นประวัติ
            และการควบคุมไฟล์ในระบบ Git</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100 space-y-6">
        <!-- 3 Boxes: Learning Outcome, Competency, Objectives -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
                <Lightbulb class="w-5 h-5 shrink-0" />
                <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ผู้เรียนสามารถตรวจสอบความเปลี่ยนแปลงของโค้ดก่อนและหลังการจัดคิว Staging
                สืบค้นประวัติและตัวตนผู้แก้ไขย้อนหลังได้อย่างเป็นระบบ พร้อมทั้งคัดกรองไฟล์ที่ไม่ต้องการด้วย .gitignore
                และยกเลิกการแก้ไขได้อย่างปลอดภัย
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-teal-700 font-bold">
                <Award class="w-5 h-5 shrink-0" />
                <span>2. สมรรถนะประจำหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                ใช้เครื่องมือ Command Line ของ Git (diff, log, show, blame, restore) ในการตรวจสอบคุณภาพ
                สืบหาสาเหตุข้อผิดพลาด และควบคุมไฟล์ในโปรเจกต์ได้อย่างถูกต้องตามมาตรฐาน
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 text-purple-700 font-bold">
                <CheckCircle2 class="w-5 h-5 shrink-0" />
                <span>3. จุดประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-gray-700 space-y-2 list-disc pl-4">
                <li>อ่านผลลัพธ์ของ git diff และ git diff --staged เพื่อตรวจโค้ดก่อน Commit ได้</li>
                <li>ใช้ git log, git show และ git blame สืบค้นประวัติและผู้แก้ไขรายบรรทัดได้</li>
                <li>กำหนดกฎ .gitignore และใช้ git restore ยกเลิกการแก้ไขที่ไม่ต้องการได้ถูกต้อง</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 4 Sub-topics Badge List -->
        <div class="pt-4 border-t border-gray-100">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            โครงสร้างสาระการเรียนรู้สัปดาห์ที่ 4 (4 หัวข้อหลัก):
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span class="font-medium text-gray-800">การตรวจสอบความต่างด้วย git diff</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span class="font-medium text-gray-800">การสืบค้นประวัติด้วย git log และ git show</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span class="font-medium text-gray-800">การตรวจผู้แก้ไขรายบรรทัดและ .gitignore</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span
                class="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span class="font-medium text-gray-800">การยกเลิกการแก้ไขด้วย git restore</span>
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

        <!-- Topic 1: git diff & git diff --staged -->
        <div>
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 1: การตรวจสอบความแตกต่างของโค้ด (git diff และ git diff --staged)
          </h3>
          <p class="mb-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            หากคำสั่ง <code class="font-mono font-bold text-indigo-700">git status</code> ช่วยบอกว่า
            <strong>"ไฟล์ไหน"</strong> ถูกแก้ไข คำสั่ง <code class="font-mono font-bold text-indigo-700">git diff</code>
            จะช่วยเจาะลึกให้เห็นว่า <strong>"ข้างในไฟล์นั้นแก้บรรทัดไหนไปบ้าง"</strong> เพื่อตรวจทานโค้ดก่อนทำ Snapshot
            ทุกครั้ง:
          </p>

          <!-- Comparison Cards: git diff vs git diff --staged -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">โหมดที่ 1:
                  ยังไม่เข้า Staging</span>
                <FileCode class="w-4 h-4 text-blue-600" />
              </div>
              <h4 class="font-mono font-bold text-blue-950 text-base">git diff</h4>
              <p class="text-xs sm:text-sm text-blue-900/80 leading-relaxed">
                ใช้เปรียบเทียบความแตกต่างระหว่าง <strong>Working Directory</strong> (ไฟล์ที่เพิ่งแก้ในเครื่อง)
                กับ <strong>Staging Area</strong> เหมาะสำหรับเช็กโค้ดก่อนสั่ง <code class="font-bold">git add</code>
              </p>
              <div class="pt-2 border-t border-blue-200 text-[11px] font-mono font-bold text-blue-800">
                Working Directory &lt;-&gt; Staging Area
              </div>
            </div>

            <div class="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs">โหมดที่ 2:
                  อยู่ใน Staging แล้ว</span>
                <Layers class="w-4 h-4 text-cyan-600" />
              </div>
              <h4 class="font-mono font-bold text-cyan-950 text-base">git diff --staged <span
                  class="text-xs font-normal">(หรือ --cached)</span></h4>
              <p class="text-xs sm:text-sm text-cyan-900/80 leading-relaxed">
                ใช้เปรียบเทียบความแตกต่างระหว่าง <strong>Staging Area</strong> กับ <strong>Last Commit (HEAD)</strong>
                เหมาะสำหรับตรวจทานความพร้อมรอบสุดท้ายก่อนสั่ง <code class="font-bold">git commit</code>
              </p>
              <div class="pt-2 border-t border-cyan-200 text-[11px] font-mono font-bold text-cyan-800">
                Staging Area &lt;-&gt; Local Repository (HEAD)
              </div>
            </div>
          </div>

          <!-- Unified Diff Syntax Breakdown -->
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 mb-6">
            <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Eye class="w-4 h-4 text-indigo-600" />
              วิธีอ่านสัญลักษณ์ Unified Diff ของ Git
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                <code class="font-mono font-bold text-slate-700">--- a/file / +++ b/file</code>
                <p class="text-slate-600 text-[11px]">แสดงชื่อไฟล์เวอร์ชันเก่า (<code class="font-mono">a/</code>)
                  เทียบกับเวอร์ชันใหม่ (<code class="font-mono">b/</code>)</p>
              </div>
              <div class="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                <code class="font-mono font-bold text-cyan-700">@@ -12,6 +12,7 @@</code>
                <p class="text-slate-600 text-[11px]">ตำแหน่งบรรทัดที่เริ่มเปลี่ยนแปลง (เช่น เริ่มแถว 12 จำนวน 6 แถวเดิม
                  / 7 แถวใหม่)</p>
              </div>
              <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <code class="font-mono font-bold text-rose-700">- บรรทัดสีแดง</code>
                <p class="text-rose-900 text-[11px]">โค้ดเดิมที่ถูกลบออก หรือถูกแทนที่ด้วยบรรทัดใหม่</p>
              </div>
              <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <code class="font-mono font-bold text-emerald-700">+ บรรทัดสีเขียว</code>
                <p class="text-emerald-900 text-[11px]">โค้ดใหม่ที่ถูกเพิ่มเข้ามาแทนที่หรือต่อท้ายในไฟล์</p>
              </div>
            </div>
          </div>

          <!-- Interactive Demo 1: Git Diff Visualizer -->
          <div
            class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div class="space-y-1">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs inline-flex items-center gap-1.5">
                  <Zap class="w-3.5 h-3.5" /> Interactive Demo 1: Git Diff Visualizer
                </span>
                <h4 class="text-lg sm:text-xl font-bold text-white">ทดลองอ่านผลลัพธ์ git diff และ git diff --staged</h4>
              </div>
              <span
                class="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/10 text-cyan-200 border border-white/10 self-start sm:self-auto">
                {{ activeDiffData.comparisonLabel }}
              </span>
            </div>

            <!-- Controls -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div class="flex flex-wrap gap-2">
                <button v-for="item in diffScenarios" :key="item.id" @click="selectedDiffScenario = item.id" :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
                  selectedDiffScenario === item.id
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                ]">
                  {{ item.label }}
                </button>
              </div>

              <div class="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start">
                <button @click="diffMode = 'working'" :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer',
                  diffMode === 'working' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                ]">
                  git diff
                </button>
                <button @click="diffMode = 'staged'" :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer',
                  diffMode === 'staged' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                ]">
                  git diff --staged
                </button>
              </div>
            </div>

            <!-- Simulated Terminal Output -->
            <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span class="font-mono text-cyan-300 flex items-center gap-2">
                  <Terminal class="w-3.5 h-3.5" /> $ {{ activeDiffData.command }}
                </span>
                <button @click="copyText(activeDiffData.command, 'diff-demo')"
                  class="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'diff-demo'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'diff-demo' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง' }}</span>
                </button>
              </div>

              <div class="p-4 font-mono text-xs leading-relaxed space-y-0.5 overflow-x-auto">
                <div v-for="(h, idx) in activeDiffData.header" :key="idx" class="text-slate-400">{{ h }}</div>
                <div class="text-rose-300/80">{{ activeDiffData.oldFile }}</div>
                <div class="text-emerald-300/80">{{ activeDiffData.newFile }}</div>
                <div class="text-cyan-400 py-1">{{ activeDiffData.hunk }}</div>
                <div v-for="(line, idx) in activeDiffData.lines" :key="idx" :class="[
                  'px-2 py-0.5 rounded-sm whitespace-pre',
                  line.type === 'remove' ? 'bg-rose-500/15 text-rose-300 border-l-2 border-rose-500' :
                    line.type === 'add' ? 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-500' :
                      'text-slate-300'
                ]">{{ line.text }}</div>
              </div>
            </div>

            <!-- Explanation -->
            <div
              class="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed">
              <Lightbulb class="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong class="text-white">คำอธิบายผลลัพธ์:</strong> {{ activeDiffData.explanation }}
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 2: git log & git show -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 2: การสืบค้นและวิเคราะห์ประวัติการเปลี่ยนแปลง (git log และ git show)
          </h3>
          <p class="mb-5 text-base text-gray-700 leading-relaxed">
            เมื่อโปรเจกต์มีการบันทึก Commit สะสมจำนวนมาก นักพัฒนาจำเป็นต้องใช้ <code
              class="font-mono font-bold text-indigo-700">git log</code>
            ร่วมกับ Flags เพื่อคัดกรองประวัติให้สืบค้นง่าย และใช้ <code
              class="font-mono font-bold text-indigo-700">git show</code>
            เพื่อเจาะดูเนื้อหาภายใน Commit ที่ต้องการตรวจสอบ:
          </p>

          <!-- git log Flags Table -->
          <div class="bg-white rounded-2xl border border-indigo-200 overflow-hidden shadow-xs mb-6">
            <div
              class="p-3.5 bg-indigo-50 border-b border-indigo-200 font-bold text-xs sm:text-sm text-indigo-950 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-indigo-600" /> สรุปคำสั่งขีด (Flags) ยอดนิยมของ git log
              </span>
              <span class="text-[11px] font-normal text-indigo-700">สามารถพิมพ์ผสมกันได้ในบรรทัดเดียว</span>
            </div>
            <div class="divide-y divide-gray-100 text-xs">
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">--oneline</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">ย่อประวัติให้เหลือเพียงรหัส Commit 7
                  ตัวแรกและหัวข้อข้อความในบรรทัดเดียว</div>
              </div>
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">--graph --decorate</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">วาดเส้นสายกราฟความสัมพันธ์แบบ ASCII และแสดงป้ายตำแหน่ง Branch เช่น
                  (HEAD -&gt; main)</div>
              </div>
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">-n &lt;จำนวน&gt;</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">จำกัดการแสดงผลเฉพาะ N รายการล่าสุด เช่น <code
                    class="font-mono text-slate-800">git log -n 5</code></div>
              </div>
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">--stat</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">แสดงรายชื่อไฟล์ที่ถูกแก้ไขพร้อมสรุปจำนวนบรรทัดที่เพิ่ม (+) และลบ
                  (-) ในแต่ละ Commit</div>
              </div>
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">-p</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">ย่อมาจาก --patch แสดงรายละเอียดโค้ด Diff ของแต่ละ Commit
                  ออกมาพร้อมกัน</div>
              </div>
              <div class="p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 hover:bg-indigo-50/30">
                <div class="sm:w-1/3">
                  <code
                    class="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">--author="ชื่อ"</code>
                </div>
                <div class="sm:w-2/3 text-slate-600">กรองดูเฉพาะประวัติการ Commit ของผู้พัฒนาที่ระบุชื่อไว้</div>
              </div>
            </div>
          </div>

          <!-- Deep Dive: git show <hash> -->
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Search class="w-4 h-4 text-indigo-600" />
                เจาะดูรายละเอียดเฉพาะจุดด้วย <code
                  class="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">git show &lt;commit-hash&gt;</code>
              </h4>
              <button @click="copyText(gitDiffDemoSnippets.logShow, 'log-show')"
                class="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer">
                <Check v-if="copiedSnippet === 'log-show'" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSnippet === 'log-show' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง' }}</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              เมื่อพบ Commit Hash จาก <code class="font-mono font-bold">git log --oneline</code> สามารถนำรหัสย่อ 7
              ตัวแรกมาต่อท้าย
              <code class="font-mono font-bold">git show</code> เพื่อให้ Git แสดงทั้งชื่อผู้ทำ เวลา ข้อความ Commit
              และโค้ด Diff ทั้งหมดที่แก้ในครั้งนั้น
            </p>
            <div class="p-3.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs leading-relaxed">
              $ git log --oneline -n 5<br />
              $ git show 9f4e2a1
            </div>
          </div>

          <!-- Interactive Demo 2: Git Log Detective Terminal -->
          <div
            class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-500/20 space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div class="space-y-1">
                <span
                  class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs inline-flex items-center gap-1.5">
                  <Play class="w-3.5 h-3.5" /> Interactive Demo 2: Git Log Detective Terminal
                </span>
                <h4 class="text-lg sm:text-xl font-bold text-white">จำลองห้องปฏิบัติการสืบค้นประวัติ Commit</h4>
                <p class="text-xs text-slate-300">
                  คลิกเลือกคำสั่งด้านล่างเพื่อเปรียบเทียบผลลัพธ์ในการตามหาต้นตอของบั๊กในโปรเจกต์</p>
              </div>
            </div>

            <!-- Command Buttons -->
            <div class="flex flex-wrap gap-2">
              <button v-for="cmd in logDetectiveCommands" :key="cmd.id" @click="activeLogCmd = cmd.id" :class="[
                'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border',
                activeLogCmd === cmd.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm'
                  : 'bg-white/5 text-cyan-200 border-white/10 hover:bg-white/10'
              ]">
                $ {{ cmd.label }}
              </button>
            </div>

            <!-- Detective Terminal Output -->
            <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span class="font-mono text-emerald-400 font-bold">$ {{ currentDetectiveOutput.command }}</span>
                <button @click="copyText(currentDetectiveOutput.command, 'detective-cmd')"
                  class="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <Check v-if="copiedSnippet === 'detective-cmd'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedSnippet === 'detective-cmd' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง' }}</span>
                </button>
              </div>
              <div class="p-4 font-mono text-xs leading-relaxed space-y-1 overflow-x-auto">
                <div v-for="(line, i) in currentDetectiveOutput.lines" :key="i"
                  :class="['px-1.5 rounded-sm whitespace-pre', line.cls]">{{ line.text }}</div>
              </div>
            </div>

            <!-- Analysis Box -->
            <div
              class="p-4 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-100 flex items-start gap-2.5 leading-relaxed">
              <Search class="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong class="text-amber-300">วิเคราะห์แบบนักสืบ Git:</strong> {{ currentDetectiveOutput.analysis }}
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 3: git blame & Deep Dive .gitignore -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 3: การตรวจสอบผู้แก้ไขรายบรรทัด (git blame) และการจัดการ .gitignore เชิงลึก
          </h3>

          <!-- Part A: git blame -->
          <div class="mb-8 space-y-4">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <User class="w-4 h-4 text-indigo-600" />
              ส่วนที่ 1: เจาะลึกโครงสร้างผลลัพธ์ของ <code
                class="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">git blame &lt;file&gt;</code>
            </h4>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              เมื่อพบโค้ดที่ทำงานแปลกไปและอยากทราบว่าใครเป็นคนปรับปรุงบรรทัดนั้นครั้งล่าสุด สามารถใช้คำสั่ง
              <code class="font-mono font-bold">git blame ชื่อไฟล์</code> เพื่อดูข้อมูลกำกับครบ 5 ส่วนในแต่ละบรรทัด:
            </p>

            <!-- Annotated git blame example card -->
            <div
              class="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-3 shadow-inner overflow-x-auto">
              <div class="text-emerald-400 font-bold">$ git blame -L 13,15 src/cart.js</div>
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 whitespace-pre leading-relaxed">
                <span class="text-amber-400">7c2b108</span> (<span class="text-cyan-300">Pimchanok UI</span> <span
                  class="text-purple-300">2026-11-21 14:40:22 +0700</span> <span class="text-emerald-400">13</span>)
                <span class="text-white">function applyDiscount(total, percent) {</span><br />
                <span class="text-amber-400">9f4e2a1</span> (<span class="text-cyan-300">Nattapong Dev</span> <span
                  class="text-purple-300">2026-11-23 09:15:10 +0700</span> <span class="text-emerald-400">14</span>)
                <span class="text-white"> return total - (total * (percent / 100));</span><br />
                <span class="text-amber-400">7c2b108</span> (<span class="text-cyan-300">Pimchanok UI</span> <span
                  class="text-purple-300">2026-11-21 14:40:22 +0700</span> <span class="text-emerald-400">15</span>)
                <span class="text-white">}</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans text-[11px]">
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span class="font-mono font-bold text-amber-400 block">9f4e2a1</span>
                  <span class="text-slate-400">รหัส Commit Hash</span>
                </div>
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span class="font-mono font-bold text-cyan-300 block">Nattapong Dev</span>
                  <span class="text-slate-400">ชื่อผู้แก้ไขบรรทัด</span>
                </div>
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span class="font-mono font-bold text-purple-300 block">2026-11-23...</span>
                  <span class="text-slate-400">วันเวลาที่ Commit</span>
                </div>
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span class="font-mono font-bold text-emerald-400 block">14) return ...</span>
                  <span class="text-slate-400">เลขบรรทัดและโค้ด</span>
                </div>
              </div>
            </div>

            <div
              class="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5 leading-relaxed">
              <Lightbulb class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>มารยาทในการทำงานเป็นทีม (Team Debugging Etiquette):</strong>
                แม้คำสั่งจะชื่อว่า "blame" แต่จุดประสงค์แท้จริงในองค์กรซอฟต์แวร์ไม่ได้มีไว้เพื่อตำหนิเพื่อนร่วมทีม
                แต่มีไว้เพื่อค้นหา <strong>"บริบทและเหตุผล"</strong> ของโค้ด
                และทราบว่าควรสอบถามข้อมูลเพิ่มเติมจากสมาชิกคนใด
              </div>
            </div>
          </div>

          <!-- Part B: .gitignore patterns -->
          <div class="space-y-4">
            <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-amber-600" />
              ส่วนที่ 2: ไวยากรณ์และการเขียนกฎในไฟล์ <code
                class="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">.gitignore</code> อย่างมืออาชีพ
            </h4>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <!-- Pattern Rules Table -->
              <div class="lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div class="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-slate-800">
                  รูปแบบกฎสำคัญที่ใช้บ่อยในไฟล์ .gitignore
                </div>
                <div class="divide-y divide-gray-100 text-xs">
                  <div class="p-3 flex items-start justify-between gap-3">
                    <code
                      class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded shrink-0">*.log</code>
                    <span class="text-slate-600 text-right sm:text-left flex-1">ละเว้นทุกไฟล์ที่ลงท้ายด้วยนามสกุล .log
                      ทุกโฟลเดอร์</span>
                  </div>
                  <div class="p-3 flex items-start justify-between gap-3">
                    <code
                      class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded shrink-0">node_modules/</code>
                    <span class="text-slate-600 text-right sm:text-left flex-1">เครื่องหมาย /
                      ต่อท้ายหมายถึงละเว้นทั้งโฟลเดอร์และไฟล์ย่อยทั้งหมดข้างใน</span>
                  </div>
                  <div class="p-3 flex items-start justify-between gap-3">
                    <code class="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0">.env</code>
                    <span class="text-slate-600 text-right sm:text-left flex-1">ละเว้นไฟล์เก็บค่าความลับ
                      รหัสผ่านฐานข้อมูล และ API Key</span>
                  </div>
                  <div class="p-3 flex items-start justify-between gap-3">
                    <code
                      class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded shrink-0">dist/</code>
                    <span class="text-slate-600 text-right sm:text-left flex-1">ละเว้นโฟลเดอร์ผลลัพธ์จากการ Build
                      ซึ่งสามารถสร้างใหม่ได้จากโค้ดต้นฉบับ</span>
                  </div>
                  <div class="p-3 flex items-start justify-between gap-3">
                    <code
                      class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">!important.log</code>
                    <span class="text-slate-600 text-right sm:text-left flex-1">เครื่องหมาย ! ใช้ยกเว้นกฎด้านบน
                      เพื่อให้ติดตามเฉพาะไฟล์ important.log</span>
                  </div>
                </div>
              </div>

              <!-- Copyable .gitignore Template -->
              <div
                class="lg:col-span-5 p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs flex flex-col justify-between space-y-3 relative">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span class="text-amber-300 font-bold flex items-center gap-1.5">
                    <FileText class="w-3.5 h-3.5" /> ตัวอย่างไฟล์ .gitignore
                  </span>
                  <button @click="copyText(gitDiffDemoSnippets.gitignoreTemplate, 'gitignore-tpl')"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer">
                    <Check v-if="copiedSnippet === 'gitignore-tpl'" class="w-3 h-3 text-emerald-400" />
                    <Copy v-else class="w-3 h-3" />
                    <span>{{ copiedSnippet === 'gitignore-tpl' ? 'คัดลอกแล้ว!' : 'คัดลอกเทมเพลต' }}</span>
                  </button>
                </div>
                <pre
                  class="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">{{ gitDiffDemoSnippets.gitignoreTemplate }}</pre>
              </div>
            </div>

            <div
              class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
              <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>ข้อควรรู้สำคัญ:</strong> ไฟล์ <code class="font-mono font-bold">.gitignore</code>
                จะมีผลเฉพาะกับไฟล์ที่
                <strong>ยังไม่เคยถูก Track มาก่อน</strong> หากเผลอ Commit ไฟล์นั้นเข้า Git ไปแล้ว การมาเขียนเพิ่มใน
                .gitignore ทีหลังจะไม่หยุดติดตาม
                ต้องสั่ง <code
                  class="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">git rm --cached &lt;file&gt;</code>
                เพื่อถอนออกจาก Git Index โดยไม่ลบไฟล์จริงในเครื่องก่อนครับ
              </div>
            </div>
          </div>
        </div>

        <!-- Topic 4: Undoing Changes Safely with git restore -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-indigo-950 border-l-4 border-indigo-600 pl-4 mb-4">
            หัวข้อที่ 4: การยกเลิกและย้อนกลับการแก้ไขอย่างปลอดภัย (git restore)
          </h3>
          <p class="mb-5 text-base text-gray-700 leading-relaxed">
            ในการเขียนโค้ดย่อมมีเหตุการณ์ที่เราลองแก้โค้ดแล้วพัง หรือเผลอสั่ง <code
              class="font-mono font-bold">git add</code> ผิดไฟล์
            Git เวอร์ชันใหม่ได้ออกแบบคำสั่ง <code class="font-mono font-bold text-indigo-700">git restore</code>
            เพื่อแยกหน้าที่การย้อนกลับให้ชัดเจนและลดความสับสน:
          </p>

          <!-- Side-by-side comparison cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <!-- Card A: git restore <file> -->
            <div class="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">กรณีที่ 1:
                    ยกเลิกการแก้ในเครื่อง</span>
                  <FileX class="w-4 h-4 text-rose-600" />
                </div>
                <h4 class="font-mono font-bold text-rose-950 text-base">git restore &lt;file&gt;</h4>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  สั่งย้อนเนื้อหาไฟล์ใน <strong>Working Directory</strong> กลับไปเป็นสภาพล่าสุดที่อยู่ใน Staging หรือ
                  Commit ล่าสุด
                  ใช้เมื่อทดลองแก้โค้ดแล้วอยากทิ้งทั้งหมดเพื่อเริ่มต้นใหม่
                </p>
              </div>
              <div
                class="p-3 rounded-xl bg-rose-100/80 border border-rose-300 text-xs text-rose-950 flex items-start gap-2 leading-relaxed">
                <AlertTriangle class="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong>คำเตือนอันตราย:</strong> โค้ดที่เพิ่งแก้ในไฟล์นั้นและยังไม่ได้ Commit
                  จะ<strong>ถูกลบทิ้งถาวร</strong> ไม่สามารถกด Ctrl+Z ย้อนกลับมาได้
                  ควรตรวจสอบด้วย <code class="font-mono font-bold">git diff</code> ก่อนรันเสมอ
                </div>
              </div>
            </div>

            <!-- Card B: git restore --staged <file> -->
            <div
              class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">กรณีที่ 2:
                    นำไฟล์ออกจากคิว</span>
                  <RotateCcw class="w-4 h-4 text-emerald-600" />
                </div>
                <h4 class="font-mono font-bold text-emerald-950 text-base">git restore --staged &lt;file&gt;</h4>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  ใช้เมื่อเผลอสั่ง <code class="font-mono font-bold">git add</code> ผิดไฟล์เข้าสู่ <strong>Staging
                    Area</strong>
                  คำสั่งนี้จะย้ายสถานะไฟล์กลับมาอยู่ใน Working Directory เพื่อรอการตรวจทานใหม่
                </p>
              </div>
              <div
                class="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2 leading-relaxed">
                <CheckCircle2 class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>ปลอดภัย 100%:</strong> โค้ดที่คุณเขียนแก้ไขไว้ในไฟล์<strong>ยังอยู่ครบทุกบรรทัด</strong>
                  ไม่สูญหาย เพียงแค่ถูกถอนชื่อออกจากรายการเตรียม Commit เท่านั้น
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Reference: Modern vs Legacy -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sliders class="w-4 h-4" />
                <span>เทียบคำสั่งยุคใหม่ (Git 2.23+) กับคำสั่งแบบเดิมที่พบบ่อยในบทความเก่า</span>
              </div>
              <button @click="copyText(gitDiffDemoSnippets.restoreSafe, 'restore-cmd')"
                class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
                <Check v-if="copiedSnippet === 'restore-cmd'" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedSnippet === 'restore-cmd' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง' }}</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div class="text-slate-400 font-sans font-bold">1. ยกเลิกการแก้ไขใน Working Directory:</div>
                <div class="text-emerald-300">ยุคใหม่: git restore &lt;file&gt;</div>
                <div class="text-slate-400">แบบเดิม: git checkout -- &lt;file&gt;</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div class="text-slate-400 font-sans font-bold">2. นำไฟล์ออกจาก Staging Area (Unstage):</div>
                <div class="text-emerald-300">ยุคใหม่: git restore --staged &lt;file&gt;</div>
                <div class="text-slate-400">แบบเดิม: git reset HEAD &lt;file&gt;</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Game Center & Evaluation Section -->
    <GameCenterSection :course-id="currentCourseId" :week="currentWeek"
      drag-title="มินิเกมที่ 1: จัดกลุ่มคำสั่งติดตามและจัดการประวัติ Git"
      drag-subtitle="ลากการ์ดข้อความแต่ละใบไปวางในกลุ่มหน้าที่การทำงานของคำสั่ง Git ให้ถูกต้อง"
      drag-tab-label="มินิเกมที่ 1: จัดกลุ่มคำสั่ง Git" :drag-items="dragItemsData" :drag-zones="dragZonesData"
      match-title="มินิเกมที่ 2: จับคู่คำสั่งตรวจสอบและย้อนกลับของ Git"
      match-subtitle="คลิกเลือกจับคู่ระหว่างคำสั่งในแถบซ้าย และความหมายการทำงานในแถบขวาให้ถูกต้องครบทั้ง 6 คู่"
      match-tab-label="มินิเกมที่ 2: จับคู่คำสั่ง Git" :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบวัดความรู้หลังเรียน สัปดาห์ที่ 4 (Post-test: Tracking Changes & History)"
      :quiz-questions="quizQuestions" />

    <!-- Assignment Section -->
    <AssignmentSection course-id="21901-2012" assignment-id="asm-4"
      assignment-title="ใบงานที่ 4: วิเคราะห์กรณีศึกษาการติดตามความเปลี่ยนแปลง สืบค้นประวัติโค้ด และกู้คืนไฟล์ในระบบ Git (Google Docs)"
      :max-score="10" work-type="individual">
      <template #number>4</template>
      <template #description>
        นักศึกษารับบทเป็นนักพัฒนาที่ต้องสืบสวนและวิเคราะห์ปัญหาจากกรณีศึกษา
        <strong>"เหตุการณ์ระบบลงทะเบียนชมรมมีบั๊กก่อนวันเปิดงาน"</strong>
        โดยเปิดเอกสาร <strong>Google Docs</strong> ลิงก์ด้านล่าง แล้วกดทำสำเนา
        <strong>Tab ใหม่ภายในเอกสารเดียวกัน (Duplicate Tab)</strong> และเปลี่ยนชื่อ Tab เป็นรหัสนักศึกษาและชื่อของตนเอง
        เพื่อตอบคำถามวิเคราะห์ให้ครบทั้ง 4 ตอน

        <!-- Objectives Box -->
        <div class="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 mt-4">
          <h4 class="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-indigo-600" />
            จุดประสงค์การเรียนรู้ (เมื่อทำใบงานนี้เสร็จ ผู้เรียนสามารถ):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-indigo-900">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>1. วิเคราะห์ความเปลี่ยนแปลงของโค้ดจาก git diff และ --staged ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span>2. สืบค้นหาสาเหตุและผู้แก้ไขจาก git log, git show, git blame ได้</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span>3. ออกแบบกฎ .gitignore (รวมข้อยกเว้น !) และใช้ git restore ได้อย่างปลอดภัย</span>
            </div>
          </div>
        </div>

        <!-- Google Docs Shared Tab Banner -->
        <div
          class="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-indigo-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <h4 class="font-bold text-indigo-950 text-sm sm:text-base flex items-center gap-2">
              <FileText class="w-4 h-4 text-indigo-600 shrink-0" />
              <span>เอกสารใบงานที่ 4 (Google Docs ร่วมกันทั้งห้อง)</span>
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              เปิดเอกสาร Google Docs -> กดจุดสามจุด (<code class="font-mono font-bold">...</code>) ที่ Tab ต้นฉบับด้านซ้าย ->
              เลือก <strong>ทำสำเนา (Duplicate)</strong> -> เปลี่ยนชื่อ Tab เป็น
              <code
                class="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-800">รหัสนักศึกษา_ชื่อ-สกุล</code>
              <strong class="text-rose-700"> (ห้ามแก้ไขหรือพิมพ์ทับ Tab ต้นฉบับ)</strong>
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <a :href="ASSIGNMENT_DOC_URL" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors">
              <ExternalLink class="w-3.5 h-3.5" />
              <span>เปิดเอกสารใบงาน (Google Docs)</span>
            </a>
            <button type="button" @click="copyText(ASSIGNMENT_DOC_URL, 'asm-doc-url')"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer">
              <Check v-if="copiedSnippet === 'asm-doc-url'" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedSnippet === 'asm-doc-url' ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์' }}</span>
            </button>
          </div>
        </div>
      </template>

      <template #tasks>
        <div class="space-y-6 text-slate-700">

          <!-- Part 1: git diff & git diff --staged -->
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1</div>
                <strong class="text-sm sm:text-base text-indigo-950">ตอนที่ 1: วิเคราะห์ร่องรอยจาก git diff และ git diff
                  --staged</strong>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">3 คะแนน</span>
            </div>

            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ทีมพัฒนากำลังตรวจสอบไฟล์หน้าลงทะเบียน <code
                class="font-mono font-bold text-indigo-700">register.html</code>
              พบผลลัพธ์ของคำสั่ง <code class="font-mono font-bold">git diff register.html</code> ดังนี้:
            </p>

            <div class="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1 overflow-x-auto">
              <div class="text-emerald-400 font-bold mb-1">$ git diff register.html</div>
              <div class="text-slate-400">diff --git a/register.html b/register.html</div>
              <div class="text-cyan-400">@@ -18,5 +18,4 @@ &lt;form id="club-form"&gt;</div>
              <div class="text-slate-300 whitespace-pre"> &lt;label&gt;จำนวนผู้สมัครสูงสุด&lt;/label&gt;</div>
              <div class="text-rose-300 bg-rose-500/15 border-l-2 border-rose-500 px-1.5 whitespace-pre">- &lt;input
                type="number" max="50"&gt;</div>
              <div class="text-emerald-300 bg-emerald-500/15 border-l-2 border-emerald-500 px-1.5 whitespace-pre">+
                &lt;input type="number" max="5"&gt;</div>
              <div class="text-rose-300 bg-rose-500/15 border-l-2 border-rose-500 px-1.5 whitespace-pre">- &lt;button
                type="submit"&gt;ยืนยันการลงทะเบียน&lt;/button&gt;</div>
              <div class="text-slate-300 whitespace-pre"> &lt;/form&gt;</div>
            </div>

            <div class="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 leading-relaxed">
              <strong>สถานการณ์ B เพิ่มเติม:</strong> เพื่อนร่วมทีมอีกคนแก้ไขไฟล์ <code
                class="font-mono font-bold">config.js</code>
              แล้วพิมพ์สั่ง <code class="font-mono font-bold">git add config.js</code> จากนั้นลองพิมพ์ <code
                class="font-mono font-bold">git diff</code>
              แต่กลับพบว่าหน้าจอว่างเปล่า ไม่มีข้อความอะไรแสดงขึ้นมาเลย
            </div>

            <div class="space-y-2 text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-gray-200">
              <div class="font-bold text-indigo-900">คำถามวิเคราะห์ (พิมพ์ตอบใน Google Docs):</div>
              <p><strong>1.1</strong> จากผลลัพธ์ของ <code class="font-mono">git diff register.html</code>
                จงระบุบรรทัดที่ถูกลบออก (-) และบรรทัดที่ถูกเพิ่มเข้ามา (+) พร้อมวิเคราะห์ว่าหากเผลอ Commit
                โค้ดชุดนี้ขึ้นระบบจริง จะส่งผลกระทบอะไรต่อผู้ใช้งานหน้าเว็บ? (จงอธิบายให้ครบทั้ง 2 จุดที่เปลี่ยน)</p>
              <p><strong>1.2</strong> ในสถานการณ์ B เพราะเหตุใดคำสั่ง <code class="font-mono">git diff</code>
                จึงไม่แสดงผลความต่างของไฟล์ <code class="font-mono">config.js</code> ทั้งที่ยังไม่ได้ Commit
                และต้องพิมพ์คำสั่งใดเพื่อตรวจทานโค้ดก่อนสั่ง <code class="font-mono">git commit</code>?</p>
            </div>
          </div>

          <!-- Part 2: git log, git show, git blame -->
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2</div>
                <strong class="text-sm sm:text-base text-blue-950">ตอนที่ 2: สวมบทนักสืบสืบหาจุดเกิดบั๊กจาก git log, git
                  show และ git blame</strong>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">3 คะแนน</span>
            </div>

            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              วันต่อมามีผู้ใช้งานแจ้งว่าฟอร์มลงทะเบียนชมรมรับสมัครได้เพียง 5 คนทั้งที่จริงต้องรับได้ 50 คน
              ครูผู้คุมโปรเจกต์จึงสั่งตรวจสอบประวัติด้วยคำสั่ง <code class="font-mono font-bold">git log</code> และ
              <code class="font-mono font-bold">git blame</code> ได้ผลลัพธ์ดังนี้:
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div class="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1 overflow-x-auto">
                <div class="text-emerald-400 font-bold mb-1">$ git log --oneline --graph</div>
                <div class="text-slate-300 whitespace-pre">* e4b2c19 (HEAD -&gt; main) docs: update readme guide</div>
                <div class="text-slate-300 whitespace-pre">* a7f3d02 fix: adjust input limit for testing</div>
                <div class="text-slate-300 whitespace-pre">* 5c9e114 style: improve form button color</div>
                <div class="text-slate-300 whitespace-pre">* 1a0b883 feat: create club registration page</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1 overflow-x-auto">
                <div class="text-emerald-400 font-bold mb-1">$ git blame -L 18,21 register.html</div>
                <div class="text-slate-300 whitespace-pre">1a0b883 (Somchai    2026-11-20 09:00:12 +0700 18) &lt;form id="club-form"&gt;</div>
                <div class="text-slate-300 whitespace-pre">1a0b883 (Somchai    2026-11-20 09:00:12 +0700 19)   &lt;label&gt;จำนวนผู้สมัครสูงสุด&lt;/label&gt;</div>
                <div class="text-slate-300 whitespace-pre">a7f3d02 (Kanya      2026-11-21 16:45:03 +0700 20)   &lt;input type="number" max="5"&gt;</div>
                <div class="text-slate-300 whitespace-pre">5c9e114 (Natthapong 2026-11-21 14:10:55 +0700 21)   &lt;button type="submit"&gt;ยืนยัน&lt;/button&gt;</div>
              </div>
            </div>

            <div class="space-y-2 text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-gray-200">
              <div class="font-bold text-blue-900">คำถามวิเคราะห์ (พิมพ์ตอบใน Google Docs):</div>
              <p><strong>2.1</strong> บั๊กที่ทำให้รับสมัครได้เพียง 5 คน เกิดขึ้นในรหัส Commit Hash ใด ใครเป็นผู้แก้ไข
                และแก้เมื่อวันเวลาใด?</p>
              <p><strong>2.2</strong> หากต้องการเปิดดูรายละเอียดโค้ด Diff ทั้งหมดที่เกิดขึ้นใน Commit
                ที่ก่อให้เกิดบั๊กนั้น ต้องพิมพ์คำสั่งเต็มๆ ว่าอย่างไร?</p>
              <p><strong>2.3</strong> หากต้องการดูประวัติเฉพาะ <strong>2 Commit ล่าสุด</strong>
                พร้อมสรุปชื่อไฟล์และจำนวนบรรทัดที่เพิ่ม/ลบในแต่ละ Commit ต้องใช้คำสั่ง <code
                  class="font-mono">git log</code> ร่วมกับ Flags ใด?</p>
            </div>
          </div>

          <!-- Part 3: .gitignore Security & Exception -->
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3</div>
                <strong class="text-sm sm:text-base text-amber-950">ตอนที่ 3: วิเคราะห์ความปลอดภัยและออกแบบกฎ
                  .gitignore</strong>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">2 คะแนน</span>
            </div>

            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ภายในโฟลเดอร์โปรเจกต์ประกอบด้วยไฟล์และโฟลเดอร์ดังต่อไปนี้:
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">index.html</code>,
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">style.css</code>,
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">.env</code>
              (เก็บรหัสผ่านฐานข้อมูล),
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">server.log</code>,
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">important.log</code>
              (ไฟล์บันทึกที่ทีมต้องการเก็บเข้า Git),
              <code
                class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-gray-300">node_modules/</code>
            </p>

            <div class="space-y-2 text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-gray-200">
              <div class="font-bold text-amber-900">คำถามวิเคราะห์ (พิมพ์ตอบใน Google Docs):</div>
              <p><strong>3.1</strong> จงเขียนเนื้อหาในไฟล์ <code class="font-mono font-bold">.gitignore</code>
                เพื่อละเว้นไฟล์ขยะ ไฟล์ความลับ และโฟลเดอร์ไลบรารีทั้งหมด แต่มีเงื่อนไขว่า <strong>ต้องยกเว้นให้ Git
                  ติดตามไฟล์ important.log ตามปกติ</strong> (เขียนโค้ดกฎเรียงลำดับบรรทัดให้ถูกต้อง)</p>
              <p><strong>3.2</strong> หากสมาชิกในทีมเผลอสั่ง <code class="font-mono">git commit</code> ไฟล์ <code
                  class="font-mono">.env</code> ขึ้น Repository ไปก่อนหน้านี้แล้ว การมาเพิ่มบรรทัด <code
                  class="font-mono">.env</code> ลงในไฟล์ <code class="font-mono">.gitignore</code> ทีหลังจะทำให้ Git
                หยุดติดตามไฟล์ <code class="font-mono">.env</code> ทันทีหรือไม่ เพราะเหตุใด
                และต้องใช้คำสั่งใดถอนไฟล์ออกจาก Git โดยไม่ลบไฟล์จริงในเครื่อง?</p>
            </div>
          </div>

          <!-- Part 4: Safe Undo with git restore -->
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4</div>
                <strong class="text-sm sm:text-base text-emerald-950">ตอนที่ 4: ตัดสินใจเลือกวิธี Undo อย่างปลอดภัยด้วย
                  git restore</strong>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">2 คะแนน</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white border border-gray-200 space-y-1">
                <div class="font-bold text-indigo-800">เหตุการณ์ ก:</div>
                <p class="text-gray-600 leading-relaxed">
                  คุณกำลังเขียนโค้ดใน <code class="font-mono font-bold">register.html</code> มา 2 ชั่วโมงแต่ยังไม่เสร็จ
                  และเผลอสั่ง <code class="font-mono font-bold">git add .</code> ทำให้ไฟล์นี้ติดเข้าไปอยู่ใน Staging
                  Area ด้วย
                </p>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-gray-200 space-y-1">
                <div class="font-bold text-rose-800">เหตุการณ์ ข:</div>
                <p class="text-gray-600 leading-relaxed">
                  คุณทดลองแก้โค้ดตกแต่งใน <code class="font-mono font-bold">style.css</code> แล้วหน้าเว็บพังทั้งหมด
                  จึงต้องการล้างสิ่งที่เพิ่งแก้กลับไปเป็นสภาพล่าสุดที่เคย Commit ไว้
                </p>
              </div>
            </div>

            <div class="space-y-2 text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-gray-200">
              <div class="font-bold text-emerald-900">คำถามวิเคราะห์ (พิมพ์ตอบใน Google Docs):</div>
              <p><strong>4.1</strong> ในเหตุการณ์ ก และ เหตุการณ์ ข นักศึกษาต้องเลือกใช้คำสั่ง <code
                  class="font-mono">git restore</code> รูปแบบใดให้เหมาะสมกับแต่ละสถานการณ์?</p>
              <p><strong>4.2</strong> หากในเหตุการณ์ ก นักศึกษาเผลอพิมพ์คำสั่ง <code
                  class="font-mono">git restore register.html</code> (ลืมใส่ <code class="font-mono">--staged</code>)
                จะเกิดผลเสียร้ายแรงต่อโค้ดที่เขียนมา 2 ชั่วโมงหรือไม่ อย่างไร?</p>
            </div>
          </div>

          <!-- Submission Guide Box -->
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 space-y-2">
            <div class="font-bold text-amber-900 flex items-center gap-2 text-sm">
              <FileText class="w-4 h-4 text-amber-700 shrink-0" />
              <span>คำชี้แจงการจัดทำและการส่งงานใน Google Docs</span>
            </div>
            <ul class="list-disc pl-5 space-y-1 text-xs leading-relaxed">
              <li>เปิดลิงก์ Google Docs ด้านบน กดจุดสามจุด (<code class="font-mono font-bold">...</code>) ที่ Tab ต้นฉบับด้านซ้าย เลือก <strong>ทำสำเนา (Duplicate)</strong> เพื่อสร้าง Tab ใหม่ในไฟล์เดียวกัน <strong class="text-rose-700">(ห้ามพิมพ์ทับ Tab ต้นฉบับ)</strong></li>
              <li>เปลี่ยนชื่อ Tab ของตนเองเป็น <code
                  class="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-200">รหัสนักศึกษา_ชื่อ-สกุล</code>
                แล้วพิมพ์คำตอบวิเคราะห์ครบทั้ง <strong>4 ตอน (ข้อ 1.1 - 4.2)</strong> ด้วยสำนวนความเข้าใจของตนเอง</li>
              <li>เมื่อทำเสร็จแล้ว ให้ <strong>คัดลอกลิงก์ของ Tab ตนเอง</strong> (หรือระบุชื่อ Tab) ส่งผ่านแบบฟอร์มด้านล่างเพื่อยืนยันการส่งงาน</li>
            </ul>
          </div>

        </div>
      </template>
    </AssignmentSection>

  </div>
</template>
