import * as xlsx from 'xlsx'
import { courses } from '@/data/courses'
import { isStudent, isStudentInCourse } from '@/data/studentsStore'
import { attendanceStore, checkInSessionsStore, calculateStudentAttendanceScore } from '@/data/gradesStore'

/**
 * แปลงสถานะการเช็คชื่อเป็นสัญลักษณ์มาตรฐานของสถานศึกษาอาชีวศึกษา
 * - present -> / (มาเรียนตรงเวลา)
 * - late -> ส (มาสาย)
 * - leave -> ล (ลา)
 * - absent -> ข (ขาดเรียน)
 */
export const getAttendanceSymbol = (status) => {
  switch (status) {
    case 'present':
      return '/'
    case 'late':
      return 'ส'
    case 'leave':
      return 'ล'
    case 'absent':
      return 'ข'
    default:
      return ''
  }
}

/**
 * ดึงสถานะการเช็คชื่อของนักศึกษาในสัปดาห์นั้นๆ
 */
export const getStudentWeekAttendance = (courseId, studentId, week) => {
  const key = `${courseId}_${studentId}_${week}`
  const rec = attendanceStore.value[key]
  if (rec && rec.status) {
    return rec.status
  }

  // หากครูปิด session เช็คชื่อสัปดาห์นั้นแล้ว แต่นักเรียนไม่ได้เช็ค -> absent
  const sessionKey = `${courseId}_${week}`
  const session = checkInSessionsStore.value?.[sessionKey]
  if (session && session.endTime && !session.isOpen) {
    return 'absent'
  }

  return 'none'
}

/**
 * ส่งออกตารางการเข้าเรียนเป็นไฟล์ Excel โดยใช้ Template /Student_CheckIn_Template.xls
 * @param {string} courseId รหัสวิชา เช่น '31901-2007'
 * @param {string} classroom ห้องเรียน เช่น 'ปวส.1/1' หรือ 'all'
 * @param {Array} allStudents รายชื่อนักศึกษาทั้งหมดจาก studentsStore
 */
export const exportAttendanceToExcel = async ({
  courseId,
  classroom = 'all',
  allStudents = []
}) => {
  const course = courses.find(c => c.id === courseId) || {
    id: courseId,
    code: courseId,
    name: 'รายวิชา',
    levelGroup: 'ปวช.'
  }

  const totalWeeks = course.levelGroup === 'ปวส.' ? 15 : 18

  // 1. กรองรายชื่อนักศึกษาเฉพาะในวิชาและห้องที่เลือก
  const targetStudents = allStudents.filter(s => {
    if (!isStudent(s)) return false
    const matchCourse = isStudentInCourse(s, courseId)
    if (!matchCourse) return false
    if (classroom && classroom !== 'all') {
      return s.classroom === classroom
    }
    return true
  })

  // เรียงตามรหัสนักศึกษา
  targetStudents.sort((a, b) => {
    const idA = String(a.studentId || a.id || '')
    const idB = String(b.studentId || b.id || '')
    return idA.localeCompare(idB)
  })

  const targetClassroomText = classroom === 'all' 
    ? (course.level || 'ทุกกลุ่มเรียน') 
    : classroom

  let workbook = null
  let useFallback = false

  // 2. พยายามโหลด Template จาก public/Student_CheckIn_Template.xls
  try {
    const templateRes = await fetch('/Student_CheckIn_Template.xls')
    if (templateRes.ok) {
      const arrayBuffer = await templateRes.arrayBuffer()
      workbook = xlsx.read(arrayBuffer, { type: 'array', cellStyles: true })
    } else {
      useFallback = true
    }
  } catch (err) {
    console.warn('Cannot load template, falling back to dynamic generator:', err)
    useFallback = true
  }

  if (workbook && workbook.SheetNames && workbook.SheetNames.length > 0) {
    try {
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rawRows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' })

      // หาตำแหน่ง Header และช่องข้อมูลใน Template
      let headerRowIndex = -1
      let idColIndex = -1
      let nameColIndex = -1
      let firstWeekColIndex = -1

      // สแกน 25 แถวแรกเพื่อหาโครงสร้าง
      for (let r = 0; r < Math.min(25, rawRows.length); r++) {
        const row = rawRows[r]
        if (!Array.isArray(row)) continue

        for (let c = 0; c < row.length; c++) {
          const val = String(row[c] || '').trim()

          // ตรวจหา Header คอลัมน์
          if (val.includes('รหัสนักศึกษา') || val.includes('รหัสประจำตัว') || val.includes('รหัส')) {
            if (idColIndex === -1) {
              headerRowIndex = r
              idColIndex = c
            }
          }
          if (val.includes('ชื่อ-สกุล') || val.includes('ชื่อ - สกุล') || val.includes('ชื่อและนามสกุล') || val.includes('ชื่อ')) {
            if (nameColIndex === -1) {
              nameColIndex = c
            }
          }
          if ((val === '1' || val === 'สัปดาห์ที่ 1' || val === 'W1') && firstWeekColIndex === -1) {
            // มักเป็นหัวคอลัมน์สัปดาห์ที่ 1
            if (c > (nameColIndex !== -1 ? nameColIndex : 1)) {
              firstWeekColIndex = c
            }
          }

          // อัปเดตข้อมูลหัวเอกสารใน Template
          if (val.includes('วิชา') || val.includes('รายวิชา')) {
            // ถ้าเป็นหัวข้อให้ต่อชื่อวิชา
            if (val.endsWith(':') || val.endsWith(' ')) {
              rawRows[r][c] = `${val} ${course.code} ${course.name}`
            }
          }
          if (val.includes('กลุ่ม') || val.includes('ชั้น') || val.includes('ห้อง')) {
            if (val.endsWith(':') || val.endsWith(' ')) {
              rawRows[r][c] = `${val} ${targetClassroomText}`
            }
          }
        }
      }

      // ถ้าตรวจไม่พบคอลัมน์ที่ชัดเจน ให้กำหนดค่า Default ที่พบบ่อยในแบบฟอร์มอาชีวะ
      if (idColIndex === -1) idColIndex = 2
      if (nameColIndex === -1) nameColIndex = 6
      if (firstWeekColIndex === -1) firstWeekColIndex = 8
      if (headerRowIndex === -1) headerRowIndex = 6

      const dataStartRow = headerRowIndex + 1

      // สร้างตารางข้อมูลนักศึกษา
      // ลบข้อมูลนักเรียนเดิม (ถ้ามี) แล้วเขียนข้อมูลจริงของนักเรียนในห้อง
      const updatedRows = rawRows.slice(0, dataStartRow)

      targetStudents.forEach((student, idx) => {
        const studentId = student.studentId || student.id || ''
        const studentName = student.name || ''

        // คำนวณสถิติ
        let presentCount = 0
        let lateCount = 0
        let leaveCount = 0
        let absentCount = 0

        const weekSymbols = []
        for (let w = 1; w <= totalWeeks; w++) {
          const st = getStudentWeekAttendance(courseId, studentId, w)
          const sym = getAttendanceSymbol(st)
          weekSymbols.push(sym)

          if (st === 'present') presentCount++
          else if (st === 'late') lateCount++
          else if (st === 'leave') leaveCount++
          else if (st === 'absent') absentCount++
        }

        const totalAttended = presentCount + lateCount + leaveCount
        const attendancePercent = totalWeeks > 0 ? Math.round((totalAttended / totalWeeks) * 100) : 100
        const attendanceScore = calculateStudentAttendanceScore(courseId, studentId, totalWeeks)

        // สร้าง Row ใหม่ตาม template
        const newRow = []
        newRow[0] = idx + 1 // ลำดับ
        newRow[idColIndex] = studentId
        newRow[nameColIndex] = studentName

        // ใส่สัปดาห์
        for (let w = 0; w < totalWeeks; w++) {
          newRow[firstWeekColIndex + w] = weekSymbols[w]
        }

        // ใส่สรุปท้ายแถว
        const summaryCol = firstWeekColIndex + totalWeeks
        newRow[summaryCol] = presentCount
        newRow[summaryCol + 1] = lateCount
        newRow[summaryCol + 2] = leaveCount
        newRow[summaryCol + 3] = absentCount
        newRow[summaryCol + 4] = `${attendancePercent}%`
        newRow[summaryCol + 5] = attendanceScore

        updatedRows.push(newRow)
      })

      // อัปเดตข้อมูลกลับเข้า worksheet
      const newWorksheet = xlsx.utils.aoa_to_sheet(updatedRows)
      // คง column widths จาก template เดิมไว้ถ้ามี
      if (worksheet['!cols']) newWorksheet['!cols'] = worksheet['!cols']
      if (worksheet['!merges']) newWorksheet['!merges'] = worksheet['!merges']

      workbook.Sheets[sheetName] = newWorksheet
    } catch (err) {
      console.error('Error populating template, falling back to generator:', err)
      useFallback = true
    }
  } else {
    useFallback = true
  }

  // 3. Fallback: กรณีโหลดหรือ populate template มีปัญหา ให้สร้าง Workbook แบบสมบูรณ์ตามมาตรฐาน
  if (useFallback) {
    workbook = xlsx.utils.book_new()
    const sheetData = []

    // Header เอกสาร
    sheetData.push(['แบบบันทึกเวลาเรียนและประเมินผลการเรียนรู้ (Attendance Record)'])
    sheetData.push([`รหัสวิชา: ${course.code}`, `ชื่อวิชา: ${course.name}`, `ระดับชั้น/กลุ่มเรียน: ${targetClassroomText}`])
    sheetData.push([`อาจารย์ผู้สอน: ครูบอส (อาจารย์ผู้รับผิดชอบรายวิชา)`, `จำนวนสัปดาห์: ${totalWeeks} สัปดาห์`, `พิมพ์เมื่อ: ${new Date().toLocaleDateString('th-TH')}`])
    sheetData.push([]) // บรรทัดว่าง

    // แถวหัวตาราง (Table Header)
    const headerRow1 = ['ลำดับ', 'รหัสนักศึกษา', 'ชื่อ - สกุล', 'ห้องเรียน']
    for (let w = 1; w <= totalWeeks; w++) {
      headerRow1.push(`สัปดาห์ ${w}`)
    }
    headerRow1.push('มา (ครั้ง)', 'สาย (ครั้ง)', 'ลา (ครั้ง)', 'ขาด (ครั้ง)', 'ร้อยละเวลาเรียน', 'คะแนนจิตพิสัย (10)')
    sheetData.push(headerRow1)

    // ข้อมูลนักศึกษาแต่ละคน
    targetStudents.forEach((student, idx) => {
      const sId = student.studentId || student.id || ''
      const sName = student.name || ''
      const sClass = student.classroom || targetClassroomText

      let presentCount = 0
      let lateCount = 0
      let leaveCount = 0
      let absentCount = 0

      const row = [idx + 1, sId, sName, sClass]

      for (let w = 1; w <= totalWeeks; w++) {
        const st = getStudentWeekAttendance(courseId, sId, w)
        const sym = getAttendanceSymbol(st)
        row.push(sym)

        if (st === 'present') presentCount++
        else if (st === 'late') lateCount++
        else if (st === 'leave') leaveCount++
        else if (st === 'absent') absentCount++
      }

      const totalAttended = presentCount + lateCount + leaveCount
      const attendancePercent = totalWeeks > 0 ? Math.round((totalAttended / totalWeeks) * 100) : 100
      const score = calculateStudentAttendanceScore(courseId, sId, totalWeeks)

      row.push(presentCount, lateCount, leaveCount, absentCount, `${attendancePercent}%`, score)
      sheetData.push(row)
    })

    // คำอธิบายสัญลักษณ์ท้ายตาราง
    sheetData.push([])
    sheetData.push(['สัญลักษณ์การเช็คชื่อ:', '/ = มาเรียนตรงเวลา', 'ส = มาสาย', 'ล = ลากิจ/ลาป่วย', 'ข = ขาดเรียน', '(ช่องว่าง) = ยังไม่ถึงกำหนดเช็คชื่อ'])

    const ws = xlsx.utils.aoa_to_sheet(sheetData)

    // กำหนดความกว้างคอลัมน์ให้อ่านง่าย
    const cols = [
      { wch: 6 },  // ลำดับ
      { wch: 16 }, // รหัส
      { wch: 28 }, // ชื่อ-สกุล
      { wch: 12 }, // ห้อง
    ]
    for (let w = 0; w < totalWeeks; w++) {
      cols.push({ wch: 8 }) // สัปดาห์
    }
    cols.push({ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 16 })
    ws['!cols'] = cols

    xlsx.utils.book_append_sheet(workbook, ws, 'ตารางการเข้าเรียน')
  }

  // 4. บันทึกและดาวน์โหลดไฟล์ออกมาเป็น .xls
  const cleanClassroom = classroom === 'all' ? 'ทุกกลุ่มเรียน' : classroom.replace(/[/\\?%*:|"<>]/g, '_')
  const fileName = `ตารางการเข้าเรียน_${course.code}_${cleanClassroom}_${new Date().toISOString().slice(0, 10)}.xls`

  xlsx.writeFile(workbook, fileName, { bookType: 'biff8' })
  return fileName
}
