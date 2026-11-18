import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { courses } from './courses'
import { allCourseQuizzes, allFlatQuestions } from './allCourseQuizzes'
import { gameScoresStore, saveGameScore } from './gameScoresStore'
import { API_BASE_URL } from '@/config/api'

const STORAGE_KEY_QUESTIONS = 'kmutnb_classroom_question_bank_v1'
const STORAGE_KEY_ATTEMPTS = 'kmutnb_classroom_quiz_attempts_v1'

// Default seeds based on curriculum
const initialQuestionsSeed = allFlatQuestions

function loadQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUESTIONS)
    if (raw) {
      let parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // Group and count questions per course & week
        const weekCounts = {}
        allFlatQuestions.forEach(q => {
          const key = `${q.courseId}_${q.week}`
          weekCounts[key] = (weekCounts[key] || 0) + 1
        })

        const existingCounts = {}
        parsed.forEach(q => {
          const key = `${q.courseId}_${q.week}`
          existingCounts[key] = (existingCounts[key] || 0) + 1
        })

        let needsUpdate = false
        Object.entries(weekCounts).forEach(([key, expectedCount]) => {
          const currentCount = existingCounts[key] || 0
          if (currentCount < expectedCount) {
            const [cId, w] = key.split('_')
            const seedQuestions = allFlatQuestions.filter(q => String(q.courseId) === cId && Number(q.week) === Number(w))
            parsed = parsed.filter(q => !(String(q.courseId) === cId && Number(q.week) === Number(w)))
            parsed.push(...seedQuestions)
            needsUpdate = true
          }
        })

        if (needsUpdate) {
          localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(parsed))
        }
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to parse question bank from storage:', e)
  }
  return [...allFlatQuestions]
}

function loadAttempts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse quiz attempts from storage:', e)
  }
  return {}
}

export const questionBankStore = ref(loadQuestions())
export const questionsStore = questionBankStore
export const quizAttemptsStore = ref(loadAttempts())

watch(
  questionBankStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(val))
    } catch (e) {}
  },
  { deep: true }
)

watch(
  quizAttemptsStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(val))
    } catch (e) {}
  },
  { deep: true }
)

// ==========================================
// Question Bank Management & Central Server Sync
// ==========================================

export async function fetchQuestionsFromAPI(courseId, week) {
  try {
    let url = `${API_BASE_URL}/questions`
    const params = new URLSearchParams()
    if (courseId) params.append('courseId', courseId)
    if (week) params.append('week', week)
    if (params.toString()) url += `?${params.toString()}`

    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        data.questions.forEach((remoteQ) => {
          const idx = questionBankStore.value.findIndex((localQ) => localQ.id === remoteQ.id)
          if (idx !== -1) {
            questionBankStore.value[idx] = { ...questionBankStore.value[idx], ...remoteQ }
          } else {
            questionBankStore.value.push(remoteQ)
          }
        })
      }
    }
  } catch (err) {
    // Graceful offline fallback
    console.warn('Central server question sync skipped (offline or local mode):', err.message)
  }
}

// Initial server sync in background (non-blocking)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchQuestionsFromAPI()
  }, 50)
}

export function getQuestionsByTopic(courseId, week) {
  if (!courseId || !week) return []
  const fromStore = questionBankStore.value.filter(
    (q) => String(q.courseId) === String(courseId) && Number(q.week) === Number(week)
  )
  if (fromStore && fromStore.length >= 5) {
    return fromStore
  }
  const fallback = allCourseQuizzes[courseId]?.[week] || []
  return fallback
}

export function addQuestion(questionData) {
  const newQuestion = {
    id: `qb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    courseId: questionData.courseId || '',
    week: Number(questionData.week) || 1,
    type: questionData.type || 'choice',
    question: questionData.question || '',
    options: questionData.options || [
      { id: 'a', text: '', isCorrect: true },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false }
    ],
    score: Number(questionData.score) || 1,
    explanation: questionData.explanation || '',
    createdAt: new Date().toISOString()
  }
  questionBankStore.value.push(newQuestion)

  // Asynchronously sync to central server database
  fetch(`${API_BASE_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newQuestion)
  }).catch(() => {})

  return newQuestion
}

export function updateQuestion(id, updatedFields) {
  const index = questionBankStore.value.findIndex((q) => q.id === id)
  if (index !== -1) {
    questionBankStore.value[index] = {
      ...questionBankStore.value[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    }

    // Sync to backend
    fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionBankStore.value[index])
    }).catch(() => {})

    return true
  }
  return false
}

export function deleteQuestion(id) {
  const index = questionBankStore.value.findIndex((q) => q.id === id)
  if (index !== -1) {
    questionBankStore.value.splice(index, 1)

    // Sync to backend
    fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE'
    }).catch(() => {})

    return true
  }
  return false
}

export function bulkImportQuestions(questionsList) {
  if (!Array.isArray(questionsList) || questionsList.length === 0) return 0
  const valid = questionsList.map((q, idx) => ({
    id: q.id || `qb-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
    courseId: q.courseId || '',
    week: Number(q.week) || 1,
    type: q.type || 'choice',
    question: String(q.question || '').trim(),
    options: Array.isArray(q.options) ? q.options : [],
    score: Number(q.score) || 1,
    explanation: q.explanation || '',
    createdAt: new Date().toISOString()
  }))
  questionBankStore.value.push(...valid)

  // Asynchronously sync bulk array to central server database
  fetch(`${API_BASE_URL}/questions/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions: valid })
  }).catch(() => {})

  return valid.length
}

// ==========================================
// Parsing Engines: XLS/XLSX, TXT, DOCX
// ==========================================

export const parseQuestionsFromXLSX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const questions = []
        rows.forEach((row, i) => {
          const qText = row['คำถาม'] || row['Question'] || row['question'] || row['ข้อสอบ']
          if (!qText) return

          const optA = String(row['ตัวเลือก A'] || row['A'] || row['Option A'] || '').trim()
          const optB = String(row['ตัวเลือก B'] || row['B'] || row['Option B'] || '').trim()
          const optC = String(row['ตัวเลือก C'] || row['C'] || row['Option C'] || '').trim()
          const optD = String(row['ตัวเลือก D'] || row['D'] || row['Option D'] || '').trim()
          const correctKey = String(row['เฉลย'] || row['Answer'] || row['correct'] || 'A').trim().toUpperCase()
          const explanation = String(row['คำอธิบาย'] || row['Explanation'] || '').trim()
          const score = Number(row['คะแนน'] || row['Score'] || 1) || 1
          const week = Number(row['สัปดาห์'] || row['Week'] || 1) || 1
          const courseId = String(row['รหัสวิชา'] || row['CourseId'] || '').trim()

          const options = []
          if (optA) options.push({ id: 'a', text: optA, isCorrect: correctKey === 'A' || correctKey === '1' })
          if (optB) options.push({ id: 'b', text: optB, isCorrect: correctKey === 'B' || correctKey === '2' })
          if (optC) options.push({ id: 'c', text: optC, isCorrect: correctKey === 'C' || correctKey === '3' })
          if (optD) options.push({ id: 'd', text: optD, isCorrect: correctKey === 'D' || correctKey === '4' })

          // Fallback if no option marked correct
          if (options.length > 0 && !options.some((o) => o.isCorrect)) {
            options[0].isCorrect = true
          }

          questions.push({
            id: `import-${Date.now()}-${i}`,
            courseId,
            week,
            type: options.length === 2 && (optA.includes('ถูก') || optB.includes('ผิด')) ? 'boolean' : 'choice',
            question: qText,
            options,
            score,
            explanation
          })
        })

        resolve(questions)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (err) => reject(err)
    reader.readAsArrayBuffer(file)
  })
}

export const parseQuestionsFromTXT = async (input) => {
  let rawText = ''
  if (typeof input === 'string') {
    rawText = input
  } else if (input && typeof input.text === 'function') {
    rawText = await input.text()
  } else if (input instanceof Blob || (typeof File !== 'undefined' && input instanceof File)) {
    rawText = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(input, 'UTF-8')
    })
  } else if (input) {
    rawText = String(input)
  }

  if (typeof rawText !== 'string') rawText = String(rawText || '')
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const questions = []
  let currentQ = null

  const thaiToKey = {
    'ก': 'A', 'ข': 'B', 'ค': 'C', 'ง': 'D',
    '1': 'A', '2': 'B', '3': 'C', '4': 'D'
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    // Clean outer formatting / markdown asterisks
    const line = rawLine.replace(/^\*{1,2}|\*{1,2}$/g, '').trim()

    // Detect question start: "1. คำถาม..." or "ข้อ 1: ..." or "1) ..."
    const qMatch = line.match(/^(\d+)[\.\:\)]\s*(.+)/) || line.match(/^ข้อ\s*(\d+)[\.\:\)]?\s*(.+)/i)
    if (qMatch) {
      if (currentQ && currentQ.question && currentQ.options.length >= 2) {
        finalizeQuestion(currentQ)
        questions.push(currentQ)
      }
      currentQ = {
        id: `import-${Date.now()}-${questions.length}`,
        question: qMatch[2].replace(/\*+/g, '').trim(),
        options: [],
        correctKey: 'A',
        explanation: '',
        score: 1,
        type: 'choice'
      }
      continue
    }

    if (!currentQ) continue

    // Detect options: "A. ตัวเลือก", "a) ...", "A) ...", "ก. ...", "ก) ...", "1) ..."
    const optMatch = line.match(/^([A-Da-dก-ง1-4])[\.\)\-]\s*(.+)/) || line.match(/^\(([A-Da-dก-ง1-4])\)\s*(.+)/)
    if (optMatch) {
      const rawId = optMatch[1].trim()
      const normKey = thaiToKey[rawId] || rawId.toUpperCase()
      const text = optMatch[2].replace(/\*+/g, '').trim()
      currentQ.options.push({
        id: normKey.toLowerCase(),
        keyLetter: normKey,
        text,
        isCorrect: false
      })
      continue
    }

    // Detect answer: "เฉลย: A" or "Answer: B" or "คำตอบ: B" or "**เฉลย:** B" or "เฉลยข้อ B"
    const ansMatch = line.match(/^(?:เฉลย|Answer|คำตอบ|เฉลยข้อ)\s*[\:\=\-]?\s*([A-Da-dก-ง1-4])/i)
    if (ansMatch) {
      const ansKey = ansMatch[1].trim()
      currentQ.correctKey = thaiToKey[ansKey] || ansKey.toUpperCase()
      continue
    }

    // Detect explanation: "คำอธิบาย: ..." or "Explanation: ..."
    const expMatch = line.match(/^(?:คำอธิบาย|Explanation|เหตุผล|อธิบาย)\s*[\:\=\-]?\s*(.+)/i)
    if (expMatch) {
      currentQ.explanation = expMatch[1].replace(/\*+/g, '').trim()
      continue
    }

    // Append multiline question or explanation if needed
    if (currentQ.explanation) {
      currentQ.explanation += ' ' + line.replace(/\*+/g, '').trim()
    } else if (currentQ.options.length === 0) {
      currentQ.question += ' ' + line.replace(/\*+/g, '').trim()
    }
  }

  if (currentQ && currentQ.question && currentQ.options.length >= 2) {
    finalizeQuestion(currentQ)
    questions.push(currentQ)
  }

  function finalizeQuestion(qObj) {
    qObj.options.forEach((opt) => {
      opt.isCorrect = (opt.keyLetter === qObj.correctKey)
      delete opt.keyLetter
    })
    if (!qObj.options.some((o) => o.isCorrect)) {
      qObj.options[0].isCorrect = true
    }
    if (qObj.options.length === 2 && (qObj.options[0].text.includes('ถูก') || qObj.options[0].text.includes('ผิด'))) {
      qObj.type = 'boolean'
    }
  }

  return questions
}

export const parseQuestionsFromDOCX = async (file) => {
  // A .docx file is a ZIP archive containing word/document.xml
  try {
    const arrayBuffer = await file.arrayBuffer()
    const textDecoder = new TextDecoder('utf-8')
    const bytes = new Uint8Array(arrayBuffer)

    // Locate "word/document.xml" inside the docx zip
    let extractedXml = ''
    for (let i = 0; i < bytes.length - 20; i++) {
      if (bytes[i] === 60 && bytes[i + 1] === 119 && bytes[i + 2] === 58 && bytes[i + 3] === 112) {
        const slice = bytes.slice(i, Math.min(bytes.length, i + 500000))
        extractedXml = textDecoder.decode(slice)
        break
      }
    }

    if (extractedXml) {
      const plainText = extractedXml
        .replace(/<\/w:p>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')

      const parsed = await parseQuestionsFromTXT(plainText)
      if (parsed && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Docx extraction error, checking text fallback:', e)
  }

  // Fallback for HTML-based .doc or plain-text files saved with .doc extension
  try {
    const rawText = await file.text()
    if (rawText && rawText.length > 0) {
      const cleanText = rawText
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')

      const parsed = await parseQuestionsFromTXT(cleanText)
      if (parsed && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Fallback doc reading error:', err)
  }

  return []
}

// Download templates for teachers
export const downloadQuizTemplate = (format = 'xlsx') => {
  if (format === 'xlsx') {
    const rows = [
      {
        สัปดาห์: 1,
        รหัสวิชา: '31901-2007',
        คำถาม: 'ข้อใดคือจุดเด่นหลักของระบบฐานข้อมูลเชิงสัมพันธ์ (Relational DBMS)?',
        'ตัวเลือก A': 'เก็บข้อมูลแบบไม่มีโครงสร้าง',
        'ตัวเลือก B': 'รองรับการเชื่อมโยงตารางด้วย Foreign Key และ ACID Properties',
        'ตัวเลือก C': 'ไม่รองรับคำสั่ง SQL',
        'ตัวเลือก D': 'ใช้หน่วยความจำน้อยกว่าไฟล์ Text ธรรมดาเสมอ',
        เฉลย: 'B',
        คะแนน: 1,
        คำอธิบาย: 'Relational DBMS โดดเด่นด้านความคงสภาพ (ACID) และการเชื่อมโยง Primary Key กับ Foreign Key'
      },
      {
        สัปดาห์: 1,
        รหัสวิชา: '31901-2007',
        คำถาม: 'คำสั่ง SQL ชนิด DDL (Data Definition Language) มีหน้าที่ทำอะไร?',
        'ตัวเลือก A': 'ค้นหาและดึงข้อมูลออกมาแสดงผล',
        'ตัวเลือก B': 'กำหนดโครงสร้าง เช่น สร้างหรือแก้ไขตาราง (CREATE, ALTER, DROP)',
        'ตัวเลือก C': 'เพิ่ม ลบ แก้ไขข้อมูลในแถว',
        'ตัวเลือก D': 'จัดการสิทธิ์ผู้ใช้งาน',
        เฉลย: 'B',
        คะแนน: 1,
        คำอธิบาย: 'DDL ใช้สำหรับนิยามโครงสร้างฐานข้อมูลและตาราง'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz_Template')
    XLSX.writeFile(workbook, 'Template_Question_Bank.xlsx')
  } else if (format === 'txt') {
    const txtContent = `1. ข้อใดคือจุดเด่นหลักของระบบฐานข้อมูลเชิงสัมพันธ์ (Relational DBMS)?
A. เก็บข้อมูลแบบไม่มีโครงสร้าง
B. รองรับการเชื่อมโยงตารางด้วย Foreign Key และ ACID Properties
C. ไม่รองรับคำสั่ง SQL
D. ใช้หน่วยความจำน้อยกว่าไฟล์ Text ธรรมดาเสมอ
เฉลย: B
คำอธิบาย: Relational DBMS โดดเด่นด้านความคงสภาพ (ACID) และการเชื่อมโยง Primary Key กับ Foreign Key

2. คำสั่ง SQL ชนิด DDL (Data Definition Language) มีหน้าที่ทำอะไร?
A. ค้นหาและดึงข้อมูลออกมาแสดงผล
B. กำหนดโครงสร้าง เช่น สร้างหรือแก้ไขตาราง (CREATE, ALTER, DROP)
C. เพิ่ม ลบ แก้ไขข้อมูลในแถว
D. จัดการสิทธิ์ผู้ใช้งาน
เฉลย: B
คำอธิบาย: DDL ใช้สำหรับนิยามโครงสร้างฐานข้อมูลและตาราง
`
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Template_Question_Bank.txt'
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === 'docx' || format === 'doc') {
    // Generates a Word-compatible HTML format with UTF-8 BOM
    const htmlContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
</w:WordDocument>
</xml>
<![endif]-->
<style>
body { font-family: 'Sarabun', 'Calibri', sans-serif; font-size: 14pt; line-height: 1.6; }
p { margin: 4px 0; }
</style>
</head>
<body>
<p><strong>แบบฟอร์มคลังข้อสอบ (Question Bank Template)</strong></p>
<p>สามารถพิมพ์ข้อสอบตามรูปแบบด้านล่างนี้:</p>
<br>
<p>1. ข้อใดคือจุดเด่นหลักของระบบฐานข้อมูลเชิงสัมพันธ์ (Relational DBMS)?</p>
<p>A. เก็บข้อมูลแบบไม่มีโครงสร้าง</p>
<p>B. รองรับการเชื่อมโยงตารางด้วย Foreign Key และ ACID Properties</p>
<p>C. ไม่รองรับคำสั่ง SQL</p>
<p>D. ใช้หน่วยความจำน้อยกว่าไฟล์ Text ธรรมดาเสมอ</p>
<p>เฉลย: B</p>
<p>คำอธิบาย: Relational DBMS โดดเด่นด้านความคงสภาพ (ACID) และการเชื่อมโยง Primary Key กับ Foreign Key</p>
<br>
<p>2. คำสั่ง SQL ชนิด DDL (Data Definition Language) มีหน้าที่ทำอะไร?</p>
<p>A. ค้นหาและดึงข้อมูลออกมาแสดงผล</p>
<p>B. กำหนดโครงสร้าง เช่น สร้างหรือแก้ไขตาราง (CREATE, ALTER, DROP)</p>
<p>C. เพิ่ม ลบ แก้ไขข้อมูลในแถว</p>
<p>D. จัดการสิทธิ์ผู้ใช้งาน</p>
<p>เฉลย: B</p>
<p>คำอธิบาย: DDL ใช้สำหรับนิยามโครงสร้างฐานข้อมูลและตาราง</p>
</body>
</html>`
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Template_Question_Bank.doc'
    a.click()
    URL.revokeObjectURL(url)
  }
}

// ==========================================
// ==========================================
// Pre-test & Post-test Attempts Engine (Database & Local)
// ==========================================

export const fetchTestAttempts = async (courseId, week) => {
  if (!courseId || !week) return {}
  try {
    const res = await fetch(`${API_BASE_URL}/test-attempts/${courseId}/${week}`)
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) {
        quizAttemptsStore.value = { ...quizAttemptsStore.value, ...json.data }
        return json.data
      }
    }
  } catch (err) {
    console.warn('Failed to fetch test attempts from DB:', err.message)
  }
  return {}
}

export const fetchStudentTestRecordFromDB = async (courseId, week, studentId) => {
  if (!courseId || !week || !studentId) return null
  try {
    const res = await fetch(`${API_BASE_URL}/test-attempts/${courseId}/${week}/${studentId}`)
    if (res.ok) {
      const json = await res.json()
      if (json.success) {
        if (json.pre) {
          quizAttemptsStore.value[`${courseId}_${week}_${studentId}_pre`] = json.pre
        }
        if (json.post) {
          quizAttemptsStore.value[`${courseId}_${week}_${studentId}_post`] = json.post
        }
        return json
      }
    }
  } catch (err) {
    console.warn('Failed to check student test record in DB:', err.message)
  }
  return null
}

export const getStudentTestRecord = (courseId, week, studentId, type = 'post') => {
  if (!courseId || !week || !studentId) return null
  const key = `${courseId}_${week}_${studentId}_${type}`
  const attemptRec = quizAttemptsStore.value[key]
  if (attemptRec) return attemptRec

  // Check gameScoresStore which is synced directly from database
  const gameScoreKey = `${courseId}_${week}_${studentId}`
  const targetGameId = type === 'pre' ? 'pre-test' : 'quiz'
  const existingGameScore = gameScoresStore.value[gameScoreKey]?.scores?.[targetGameId]
  if (existingGameScore) {
    return {
      courseId,
      week: Number(week),
      studentId,
      type,
      score: existingGameScore.score,
      maxScore: existingGameScore.maxScore || 10,
      percentage: Math.round(((existingGameScore.score || 0) / (existingGameScore.maxScore || 10)) * 100),
      completedAt: existingGameScore.submittedAt || new Date().toISOString(),
      timeSpentSeconds: 0,
      attemptsCount: 1,
      source: 'database',
      attempts: [
        {
          attemptNumber: 1,
          score: existingGameScore.score,
          maxScore: existingGameScore.maxScore || 10,
          completedAt: existingGameScore.submittedAt || new Date().toISOString()
        }
      ]
    }
  }

  return null
}

export const saveTestAttempt = async ({
  courseId,
  week,
  studentId,
  type = 'pre', // 'pre' | 'post'
  score,
  maxScore = 10,
  timeSpentSeconds = 0,
  answers = {}
}) => {
  if (!courseId || !week || !studentId) {
    return { success: false, message: 'ข้อมูลไม่ครบถ้วน' }
  }

  const key = `${courseId}_${week}_${studentId}_${type}`
  const existing = quizAttemptsStore.value[key]

  const newScore = Math.min(Number(score), Number(maxScore))
  const percentage = maxScore > 0 ? Math.round((newScore / maxScore) * 100) : 0
  const now = new Date().toISOString()

  const attemptsHistory = existing?.attempts ? [...existing.attempts] : []
  attemptsHistory.push({
    attemptNumber: attemptsHistory.length + 1,
    score: newScore,
    maxScore: Number(maxScore),
    percentage,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    answers,
    completedAt: now
  })

  const updatedRecord = {
    courseId,
    week: Number(week),
    studentId,
    type,
    // Keep first score or best score (preserving original first score without destroying history)
    score: existing?.score !== undefined ? existing.score : newScore,
    latestScore: newScore,
    maxScore: Number(maxScore),
    percentage: existing?.percentage !== undefined ? existing.percentage : percentage,
    completedAt: existing?.completedAt || now,
    latestCompletedAt: now,
    timeSpentSeconds: existing?.timeSpentSeconds || timeSpentSeconds,
    attemptsCount: attemptsHistory.length,
    attempts: attemptsHistory,
    source: 'database'
  }

  quizAttemptsStore.value[key] = updatedRecord

  // Persist directly to Central Server Database via API
  try {
    await fetch(`${API_BASE_URL}/test-attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        week: Number(week),
        studentId,
        type,
        score: newScore,
        maxScore: Number(maxScore),
        timeSpentSeconds,
        answers
      })
    })
  } catch (err) {
    console.warn('Failed to save test attempt to DB API:', err.message)
  }

  // Also sync to gameScoresStore for gradebook & leaderboards
  try {
    await saveGameScore(courseId, week, studentId, type === 'pre' ? 'pre-test' : 'quiz', newScore, maxScore)
  } catch (e) {
    console.error('Failed to sync to gameScoresStore:', e)
  }

  return { success: true, record: updatedRecord }
}

export { allCourseQuizzes, allFlatQuestions }
