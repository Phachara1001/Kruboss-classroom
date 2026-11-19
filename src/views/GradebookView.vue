<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Edit3, 
  Save, 
  UserCheck, 
  FileText, 
  Filter, 
  GraduationCap, 
  School, 
  Search, 
  ChevronRight,
  ChevronDown,
  Check,
  Layers,
  BookOpen,
  Database,
  GitBranch,
  LineChart,
  Cpu,
  TrendingUp, 
  ShieldCheck, 
  Shield, 
  RotateCcw, 
  Sparkles, 
  FlaskConical,
  FileSpreadsheet,
  Info,
  Users,
  CalendarOff,
  Landmark,
  ExternalLink
} from '@lucide/vue'
import { courses } from '../data/courses'
import { exportAttendanceToExcel } from '../utils/exportAttendanceExcel'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { studentsList, courseClassrooms, isStudentInCourse, isStudent, fetchStudents, isTeacherUser, isMainTeacher, isSubjectTeacher, canManageCourse } from '../data/studentsStore'
import { 
  gradingConfig, 
  courseAssignments, 
  getStudentFullScore, 
  setAssignmentScore, 
  updateGradeItem, 
  attendanceStore, 
  setAttendanceCheckIn, 
  batchCheckInClassroom,
  submissionsStore,
  fetchAllCourseData,
  formatExternalUrl,
  checkInSessionsStore,
  holidaysStore,
  isWeekHoliday,
  getWeekHoliday,
  setWeekHoliday
} from '../data/gradesStore'
import { addCoins, deductCoins, getStudentCoins } from '../data/shopStore'
import { authUser } from '../data/authStore'
import { triggerTestReward, resetClaimedRewards } from '../data/rewardNotificationStore'
import StudentAvatar from '@/components/StudentAvatar.vue'

const route = useRoute()
const router = useRouter()

const isTeacher = computed(() => isTeacherUser(authUser.value))
const isMainTeacherUser = computed(() => isMainTeacher(authUser.value))
const isSubjectTeacherUser = computed(() => isSubjectTeacher(authUser.value))

const currentStudent = computed(() => {
  if (isTeacher.value || !authUser.value) return null
  const id = authUser.value.studentId || authUser.value.id
  return studentsList.value.find(s => s.studentId === id || s.id === id) || authUser.value
})

const studentClassroom = computed(() => {
  return currentStudent.value?.classroom || authUser.value?.classroom || 'ปวส.1/1'
})

// Selected Course and Classroom
const selectedCourseId = ref(route.query.courseId || '31901-2007')
const selectedClassroom = ref(isTeacher.value ? 'all' : studentClassroom.value)
const searchQuery = ref('')

const courseIcons = {
  '31901-2007': Database,
  '21901-2012': GitBranch,
  '31901-2012': LineChart,
  '21901-2007': Cpu
}

const showCourseDropdown = ref(false)
const showClassroomDropdown = ref(false)

const handleOutsideDropdownClick = (e) => {
  if (!e.target.closest('.gradebook-course-dropdown')) {
    showCourseDropdown.value = false
  }
  if (!e.target.closest('.gradebook-classroom-dropdown')) {
    showClassroomDropdown.value = false
  }
}

const getRoomStudentCount = (room) => {
  return studentsList.value.filter(s => {
    if (!isStudentInCourse(s, selectedCourseId.value) || !isStudent(s)) return false
    return room === 'all' ? true : s.classroom === room
  }).length
}

const canEditGradebook = computed(() => canManageCourse(authUser.value, selectedCourseId.value))

watch(studentClassroom, (room) => {
  if (!isTeacher.value && room) {
    selectedClassroom.value = room
  }
}, { immediate: true })

onMounted(async () => {
  document.addEventListener('click', handleOutsideDropdownClick)
  await fetchAllCourseData(selectedCourseId.value)
  if (!isTeacher.value && studentClassroom.value) {
    selectedClassroom.value = studentClassroom.value
  }
  initDraftAssignmentScores()
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideDropdownClick)
})

watch(selectedCourseId, async (newId) => {
  if (newId) {
    await fetchAllCourseData(newId)
    initDraftAssignmentScores()
  }
})

// Active Tab: 'summary' (สมุดคะแนนรวม) | 'assignments' (คะแนนใบงาน) | 'attendance' (เช็คชื่อเข้าเรียน)
const activeTab = ref(route.query.tab || 'summary')

// Selected Assignment for grading tab
const selectedAssignmentId = ref('asm-1')

// Selected Week for attendance tab
const selectedWeek = ref(1)
const totalRecordedWeeks = ref(4) // Weeks conducted so far
const checkInTimeLimit = ref('09:15 น.')

// Available courses for dropdown
const availableCourses = computed(() => {
  if (isMainTeacherUser.value) return courses
  if (isSubjectTeacherUser.value) {
    const allowedIds = authUser.value?.courseIds || []
    return courses.filter(c => allowedIds.includes(c.id))
  }
  const studentCourses = currentStudent.value?.courseIds || []
  if (studentCourses.length > 0) {
    return courses.filter(c => studentCourses.includes(c.id))
  }
  return courses
})

watch(availableCourses, (list) => {
  if (Array.isArray(list) && list.length > 0 && !list.some(c => c.id === selectedCourseId.value)) {
    selectedCourseId.value = list[0].id
  }
}, { immediate: true })

// Course info
const currentCourse = computed(() => {
  return courses.find(c => c.id === selectedCourseId.value) || courses[0]
})

const totalCourseWeeks = computed(() => {
  return (currentCourse.value?.levelGroup === 'ปวส.') ? 15 : 18
})

// Classrooms for selected course
const availableClassrooms = computed(() => {
  const roomsFromConfig = courseClassrooms[selectedCourseId.value] || []
  const roomsFromData = studentsList.value
    .filter(s => isStudentInCourse(s, selectedCourseId.value) && isStudent(s))
    .map(s => s.classroom)
  return [...new Set([...roomsFromConfig, ...roomsFromData])].filter(r => r && r !== 'teacher_room')
})

// Students in this course & classroom (Locked to own classroom for teacher filter, strictly own record for students, Sorted by studentId ascending)
const courseStudents = computed(() => {
  const effectiveClassroom = isTeacher.value ? selectedClassroom.value : studentClassroom.value
  return studentsList.value
    .filter(s => {
      if (!isStudentInCourse(s, selectedCourseId.value)) return false
      if (!isStudent(s)) return false
      if (effectiveClassroom !== 'all' && s.classroom !== effectiveClassroom) return false

      // ถ้าเป็นนักศึกษา (ไม่ใช่ครู/อาจารย์) ให้ดูได้เฉพาะข้อมูลของตัวเองเท่านั้น!
      if (!isTeacher.value) {
        const myStudentId = String(currentStudent.value?.studentId || authUser.value?.studentId || authUser.value?.id || '').trim()
        const sStudentId = String(s.studentId || '').trim()
        const sId = String(s.id || '').trim()
        if (myStudentId && sStudentId !== myStudentId && sId !== myStudentId) return false
      }

      const query = searchQuery.value.trim().toLowerCase()
      if (!query) return true

      return (s.name || '').toLowerCase().includes(query) || (s.studentId || '').includes(query)
    })
    .sort((a, b) => {
      const idA = String(a.studentId || a.id || '')
      const idB = String(b.studentId || b.id || '')
      return idA.localeCompare(idB, undefined, { numeric: true })
    })
})

// Assignments of current course
const currentAssignments = computed(() => {
  return courseAssignments[selectedCourseId.value] || []
})

const activeAssignment = computed(() => {
  return currentAssignments.value.find(a => a.id === selectedAssignmentId.value) || currentAssignments.value[0] || { id: 'asm-1', title: 'ใบงานที่ 1', maxScore: 10 }
})

const getSubmission = (studentId, assignmentId) => {
  const key = `${selectedCourseId.value}_${studentId}_${assignmentId}`
  return submissionsStore.value?.[key] || null
}

// Quick attendance status for a student in selectedWeek
const getAttendanceRecord = (studentId, week) => {
  // If this week is marked as a public holiday -> return holiday status
  if (isWeekHoliday(selectedCourseId.value, week)) {
    const holiday = getWeekHoliday(selectedCourseId.value, week)
    return {
      status: 'holiday',
      checkedAt: '-',
      note: holiday?.name || 'วันหยุดราชการ'
    }
  }

  const key = `${selectedCourseId.value}_${studentId}_${week}`
  const rec = attendanceStore.value[key]
  if (rec) return rec

  // If the check-in session for this week is closed and student didn't check in -> absent
  const sessionKey = `${selectedCourseId.value}_${week}`
  const session = checkInSessionsStore.value?.[sessionKey]
  if (session && session.endTime && !session.isOpen) {
    return { status: 'absent', checkedAt: '-', note: 'หมดเวลาเช็คชื่อ (ขาดเรียน)' }
  }

  return { status: 'none', checkedAt: '-', note: 'ยังไม่ได้เช็คอิน' }
}

// Stats computed
const classAverageScore = computed(() => {
  if (courseStudents.value.length === 0) return 0
  const sum = courseStudents.value.reduce((acc, s) => {
    const full = getStudentFullScore(selectedCourseId.value, s.studentId, totalRecordedWeeks.value)
    return acc + full.totalScore
  }, 0)
  return Math.round((sum / courseStudents.value.length) * 10) / 10
})

const attendancePresentRate = computed(() => {
  // If the week is a holiday, attendance rate is 100% (no deductions)
  if (isWeekHoliday(selectedCourseId.value, selectedWeek.value)) {
    return 100
  }
  if (courseStudents.value.length === 0) return 0
  let presentCount = 0
  courseStudents.value.forEach(s => {
    const rec = getAttendanceRecord(s.studentId, selectedWeek.value)
    if (rec.status === 'present' || rec.status === 'leave' || rec.status === 'holiday') presentCount++
  })
  return Math.round((presentCount / courseStudents.value.length) * 100)
})

// Attendance check status for each week: complete (green), partial (yellow), holiday (red), none (default)
const getWeekAttendanceStatus = (week) => {
  if (isWeekHoliday(selectedCourseId.value, week)) {
    return {
      status: 'holiday',
      checkedCount: 0,
      totalCount: courseStudents.value.length,
      label: 'หยุด'
    }
  }

  const total = courseStudents.value.length
  if (total === 0) {
    return {
      status: 'none',
      checkedCount: 0,
      totalCount: 0,
      label: ''
    }
  }

  let checkedCount = 0
  for (const s of courseStudents.value) {
    const sId = s.studentId || s.id
    const rec = getAttendanceRecord(sId, week)
    if (rec && rec.status && rec.status !== 'none') {
      checkedCount++
    }
  }

  if (checkedCount === 0) {
    return {
      status: 'none',
      checkedCount: 0,
      totalCount: total,
      label: ''
    }
  }

  if (checkedCount >= total) {
    return {
      status: 'complete',
      checkedCount: total,
      totalCount: total,
      label: 'เช็คแล้ว'
    }
  }

  return {
    status: 'partial',
    checkedCount,
    totalCount: total,
    label: `เช็คแล้ว ${checkedCount}/${total}`
  }
}

const myScoreSummary = computed(() => {
  const sId = currentStudent.value?.studentId || authUser.value?.studentId || authUser.value?.id
  if (!sId) return { totalScore: 0, gradeInfo: { grade: '0', letter: 'F' } }
  return getStudentFullScore(selectedCourseId.value, sId, totalRecordedWeeks.value)
})

// Feedback Message
const alertMessage = ref('')
const showAlert = (msg) => {
  alertMessage.value = msg
  setTimeout(() => { alertMessage.value = '' }, 2500)
}

// Draft Assignment Scores (กรอกคะแนนแบบตาราง Excel ทั้งหมด แล้วกดบันทึกทีเดียว)
const draftAssignmentScores = ref({})
const isSavingScores = ref(false)

const getCellKey = (studentId, assignmentId) => `${studentId}__${assignmentId}`

const totalAssignmentsMaxScore = computed(() => {
  return currentAssignments.value.reduce((acc, a) => acc + (Number(a.maxScore) || 0), 0)
})

const getSubmittedCount = (assignmentId) => {
  return courseStudents.value.filter(s => !!getSubmission(s.studentId || s.id, assignmentId)).length
}

const getAssignmentAvgScore = (assignmentId) => {
  if (courseStudents.value.length === 0) return '0.0'
  let sum = 0
  let count = 0
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
    const val = canEditGradebook.value ? draftAssignmentScores.value[getCellKey(sId, assignmentId)] : raw[assignmentId]
    if (val !== '' && val !== undefined && val !== null && !isNaN(val)) {
      sum += Number(val)
      count++
    }
  })
  if (count === 0) return '-'
  return (sum / count).toFixed(1)
}

const getStudentRawAssignmentSum = (studentId) => {
  const raw = getStudentFullScore(selectedCourseId.value, studentId)?.rawAssignments || {}
  let sum = 0
  currentAssignments.value.forEach(a => {
    const val = canEditGradebook.value ? draftAssignmentScores.value[getCellKey(studentId, a.id)] : raw[a.id]
    if (val !== '' && val !== undefined && val !== null && !isNaN(val)) {
      sum += Number(val)
    }
  })
  return Math.round(sum * 10) / 10
}

const getStudentScaledAssignmentScore = (studentId) => {
  const maxSum = totalAssignmentsMaxScore.value
  if (maxSum <= 0) return 0
  const rawSum = getStudentRawAssignmentSum(studentId)
  return Math.round((rawSum / maxSum) * gradingConfig.assignments.total * 10) / 10
}

const initDraftAssignmentScores = () => {
  const initial = {}
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
    currentAssignments.value.forEach(a => {
      const existing = raw[a.id]
      initial[getCellKey(sId, a.id)] = (existing !== undefined && existing !== null) ? existing : ''
    })
  })
  draftAssignmentScores.value = initial
}

// Watchers to keep draft synchronized with selected course, classroom, assignments
watch([selectedCourseId, selectedClassroom, currentAssignments], () => {
  initDraftAssignmentScores()
})

watch(courseStudents, () => {
  if (Object.keys(draftAssignmentScores.value).length === 0) {
    initDraftAssignmentScores()
  }
})

const isCellDirty = (studentId, assignmentId) => {
  const raw = getStudentFullScore(selectedCourseId.value, studentId)?.rawAssignments || {}
  const saved = raw[assignmentId]
  const draft = draftAssignmentScores.value[getCellKey(studentId, assignmentId)]

  const savedNum = (saved !== undefined && saved !== null && saved !== '') ? Number(saved) : null
  const draftNum = (draft !== '' && draft !== undefined && draft !== null && !isNaN(draft)) ? Number(draft) : null
  return draftNum !== null && savedNum !== draftNum
}

// Unsaved changes detection across all (student x assignment) cells
const unsavedCount = computed(() => {
  let count = 0
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    currentAssignments.value.forEach(a => {
      if (isCellDirty(sId, a.id)) count++
    })
  })
  return count
})

const hasUnsavedAssignmentScores = computed(() => unsavedCount.value > 0)

// Save All Changed Scores at once (บันทึกคะแนนทุกใบงานทีเดียว)
const saveAllAssignmentScores = async () => {
  if (!canEditGradebook.value) return
  isSavingScores.value = true
  try {
    let updatedCount = 0
    let totalCoinsGiven = 0

    for (const student of courseStudents.value) {
      const sId = student.studentId || student.id
      const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}

      for (const a of currentAssignments.value) {
        const assignmentId = a.id
        const maxScore = Number(a.maxScore) || 10
        const oldScore = (raw[assignmentId] !== undefined && raw[assignmentId] !== null && raw[assignmentId] !== '')
          ? Number(raw[assignmentId])
          : null
        const isFirstTime = oldScore === null || isNaN(oldScore)

        const draftVal = draftAssignmentScores.value[getCellKey(sId, assignmentId)]
        if (draftVal === '' || draftVal === undefined || draftVal === null || isNaN(draftVal)) {
          continue
        }

        let val = parseFloat(draftVal)
        if (val < 0) val = 0
        if (val > maxScore) val = maxScore

        if (oldScore !== val) {
          let coinsToAdd = 0
          if (isFirstTime && val > 0) {
            coinsToAdd = Math.round(val * 4)
          } else if (oldScore !== null && val > oldScore) {
            coinsToAdd = Math.round((val - oldScore) * 4)
          }

          updatedCount++

          if (coinsToAdd > 0) {
            await addCoins(sId, coinsToAdd)
            totalCoinsGiven += coinsToAdd
          }

          await setAssignmentScore(selectedCourseId.value, sId, assignmentId, val)
        }
      }
    }

    await fetchAllCourseData(selectedCourseId.value)
    await fetchStudents()
    initDraftAssignmentScores()

    if (updatedCount > 0) {
      let msg = `บันทึกคะแนนเรียบร้อย (${updatedCount} ช่อง)`
      if (totalCoinsGiven > 0) {
        msg += ` พร้อมมอบ ${totalCoinsGiven} Coins สำเร็จ`
      }
      showAlert(msg)
    } else {
      showAlert('บันทึกคะแนนเรียบร้อยแล้ว')
    }
  } catch (err) {
    console.error('Error saving assignment scores:', err)
    showAlert('เกิดข้อผิดพลาดในการบันทึกคะแนน')
  } finally {
    isSavingScores.value = false
  }
}

// Quick action: Pre-fill full score for students who submitted
const fillFullScoreForSubmitted = (targetAssignmentId = null) => {
  if (!canEditGradebook.value) return
  const targetAssignments = targetAssignmentId
    ? currentAssignments.value.filter(a => a.id === targetAssignmentId)
    : currentAssignments.value

  let count = 0
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    targetAssignments.forEach(a => {
      const key = getCellKey(sId, a.id)
      const currentVal = draftAssignmentScores.value[key]
      const isEmptyOrZero = currentVal === '' || currentVal === undefined || currentVal === null || Number(currentVal) === 0
      if (getSubmission(sId, a.id) && (targetAssignmentId || isEmptyOrZero)) {
        draftAssignmentScores.value[key] = a.maxScore
        count++
      }
    })
  })

  if (count > 0) {
    showAlert(`ใส่คะแนนเต็มให้นักศึกษาที่ส่งงานแล้ว ${count} ช่อง (อย่าลืมกดบันทึกคะแนน)`)
  } else {
    showAlert(targetAssignmentId ? 'ยังไม่มีนักศึกษาที่ส่งงานในใบงานนี้' : 'ไม่มีช่องที่ต้องใส่คะแนนเต็มเพิ่มสำหรับผู้ส่งงาน')
  }
}

const resetDraftScores = () => {
  initDraftAssignmentScores()
  showAlert('รีเซ็ตค่าคะแนนกลับเป็นค่าที่บันทึกล่าสุด')
}

const handleExcelCellKeydown = (event, rowIdx, colIdx) => {
  let targetRow = rowIdx
  if (event.key === 'Enter' || event.key === 'ArrowDown') {
    event.preventDefault()
    targetRow = rowIdx + 1
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    targetRow = rowIdx - 1
  } else {
    return
  }

  const nextInput = document.querySelector(`input[data-excel-row="${targetRow}"][data-excel-col="${colIdx}"]`)
  if (nextInput) {
    nextInput.focus()
    nextInput.select()
  }
}

const handleGeneralScoreInput = (studentId, field, event, maxScore) => {
  if (!canEditGradebook.value) return
  let val = parseFloat(event.target.value)
  if (isNaN(val)) val = 0
  if (val > maxScore) val = maxScore
  if (val < 0) val = 0
  event.target.value = val
  updateGradeItem(selectedCourseId.value, studentId, field, val)
}

// Holiday Management State (วันหยุดราชการ)
const showHolidayModal = ref(false)
const holidayTargetWeek = ref(1)
const holidayReason = ref('วันหยุดราชการ')
const holidayPresets = [
  'วันหยุดราชการ',
  'วันหยุดชดเชย',
  'วันหยุดนักขัตฤกษ์',
  'วันพ่อแห่งชาติ',
  'วันแม่แห่งชาติ',
  'วันปิยมหาราช',
  'วันสงกรานต์',
  'วันขึ้นปีใหม่',
  'วันครู / กิจกรรมวิทยาลัย'
]

// Custom Confirm Modal State (แทนที่ browser confirm)
const confirmModalState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'confirm',
  confirmText: 'ยืนยัน',
  cancelText: 'ยกเลิก',
  onConfirm: null
})

const openConfirmDialog = ({ title, message, type = 'confirm', confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', onConfirm }) => {
  confirmModalState.value = {
    isOpen: true,
    title,
    message,
    type,
    confirmText,
    cancelText,
    onConfirm
  }
}

const handleConfirmDialogAction = async () => {
  if (typeof confirmModalState.value.onConfirm === 'function') {
    await confirmModalState.value.onConfirm()
  }
}

const handleOpenHolidayModal = (week) => {
  if (!canEditGradebook.value) return
  holidayTargetWeek.value = week || selectedWeek.value
  const existing = getWeekHoliday(selectedCourseId.value, holidayTargetWeek.value)
  holidayReason.value = existing?.name || 'วันหยุดราชการ'
  showHolidayModal.value = true
}

const handleConfirmHoliday = async () => {
  if (!canEditGradebook.value) return
  const finalName = holidayReason.value.trim() || 'วันหยุดราชการ'
  await setWeekHoliday(selectedCourseId.value, holidayTargetWeek.value, true, finalName)
  showHolidayModal.value = false
  showAlert(`กำหนดสัปดาห์ที่ ${holidayTargetWeek.value} เป็น "${finalName}" เรียบร้อย`)
}

const handleRemoveHoliday = (week) => {
  if (!canEditGradebook.value) return
  const targetW = week || selectedWeek.value
  const holidayName = getWeekHoliday(selectedCourseId.value, targetW)?.name || 'วันหยุดราชการ'
  openConfirmDialog({
    title: `ยกเลิกวันหยุดราชการ (สัปดาห์ที่ ${targetW})`,
    message: `ต้องการยกเลิก "${holidayName}" ของสัปดาห์ที่ ${targetW} และเปิดให้เช็คชื่อเข้าเรียนตามปกติใช่หรือไม่?`,
    type: 'confirm',
    confirmText: 'ยืนยันยกเลิกวันหยุด',
    cancelText: 'ปิด',
    onConfirm: async () => {
      await setWeekHoliday(selectedCourseId.value, targetW, false)
      showAlert(`ยกเลิกวันหยุดสัปดาห์ที่ ${targetW} เรียบร้อยแล้ว`)
    }
  })
}

// Attendance Check-in action & Excel Matrix Helpers
const attendanceStampMode = ref('cycle') // 'cycle' | 'present' | 'late' | 'leave' | 'absent'

const stampModeOptions = [
  { id: 'cycle', label: 'คลิกสลับ (มา/สาย/ลา/ขาด)', badgeClass: 'bg-stone-800 text-white border-stone-800' },
  { id: 'present', label: 'ปั๊ม: มาเรียน', badgeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'late', label: 'ปั๊ม: มาสาย', badgeClass: 'bg-amber-500 text-white border-amber-500' },
  { id: 'leave', label: 'ปั๊ม: ลา', badgeClass: 'bg-blue-600 text-white border-blue-600' },
  { id: 'absent', label: 'ปั๊ม: ขาด', badgeClass: 'bg-red-600 text-white border-red-600' }
]

const getWeekTopicTitle = (week) => {
  const wNum = Number(week)
  if (isWeekHoliday(selectedCourseId.value, wNum)) {
    const hName = getWeekHoliday(selectedCourseId.value, wNum)?.name || 'วันหยุดราชการ'
    return `สัปดาห์ที่ ${wNum}: [วันหยุด] ${hName}`
  }
  const topic = currentCourse.value?.topics?.find(t => Number(t.weekNumber) === wNum)
  const topicName = topic?.name || topic?.title || ''
  return topicName ? `สัปดาห์ที่ ${wNum}: ${topicName}` : `สัปดาห์ที่ ${wNum}`
}

const getAttendanceStatusShortLabel = (status) => {
  if (status === 'holiday') return 'หยุด'
  if (status === 'present') return 'มา'
  if (status === 'late') return 'สาย'
  if (status === 'leave') return 'ลา'
  if (status === 'absent') return 'ขาด'
  return '-'
}

const getStudentAttendanceCounts = (studentId) => {
  const counts = { present: 0, late: 0, leave: 0, absent: 0 }
  for (let w = 1; w <= totalCourseWeeks.value; w++) {
    const st = getAttendanceRecord(studentId, w).status
    if (st === 'present') counts.present++
    else if (st === 'late') counts.late++
    else if (st === 'leave') counts.leave++
    else if (st === 'absent') counts.absent++
  }
  return counts
}

const getWeekPresentCount = (week) => {
  let count = 0
  courseStudents.value.forEach(s => {
    const st = getAttendanceRecord(s.studentId || s.id, week).status
    if (st === 'present' || st === 'late') count++
  })
  return count
}

const handleSetAttendance = async (studentId, status, targetWeek = null) => {
  if (!canEditGradebook.value) return
  const weekToUse = targetWeek || selectedWeek.value
  selectedWeek.value = weekToUse
  if (isWeekHoliday(selectedCourseId.value, weekToUse)) {
    openConfirmDialog({
      title: `สัปดาห์ที่ ${weekToUse} เป็นวันหยุดราชการ`,
      message: `สัปดาห์ที่ ${weekToUse} ถูกกำหนดเป็นวันหยุดราชการอยู่ หากทำการเช็คชื่อ ระบบจะเปลี่ยนสัปดาห์นี้กลับเป็นการเรียนการสอนปกติ ต้องการดำเนินการต่อหรือไม่?`,
      type: 'confirm',
      confirmText: 'เปิดเช็คชื่อปกติ',
      cancelText: 'ยกเลิก',
      onConfirm: async () => {
        await setWeekHoliday(selectedCourseId.value, weekToUse, false)
        setAttendanceCheckIn(selectedCourseId.value, studentId, weekToUse, status)
      }
    })
    return
  }
  setAttendanceCheckIn(selectedCourseId.value, studentId, weekToUse, status)
}

const handleCellAttendanceClick = async (studentId, week) => {
  if (!canEditGradebook.value) return
  selectedWeek.value = week
  const currentSt = getAttendanceRecord(studentId, week).status
  let nextStatus = 'present'
  if (attendanceStampMode.value !== 'cycle') {
    nextStatus = attendanceStampMode.value
  } else {
    if (currentSt === 'present') nextStatus = 'late'
    else if (currentSt === 'late') nextStatus = 'leave'
    else if (currentSt === 'leave') nextStatus = 'absent'
    else nextStatus = 'present'
  }
  await handleSetAttendance(studentId, nextStatus, week)
}

// Batch Check-in
const handleBatchAllPresent = async (targetWeek = null) => {
  if (!canEditGradebook.value) return
  const weekToUse = typeof targetWeek === 'number' ? targetWeek : selectedWeek.value
  selectedWeek.value = weekToUse

  const applyAllPresent = () => {
    courseStudents.value.forEach(s => {
      setAttendanceCheckIn(selectedCourseId.value, s.studentId, weekToUse, 'present')
    })
    showAlert(`เช็คชื่อ "มาเรียนตรงเวลา" สัปดาห์ที่ ${weekToUse} ให้นักศึกษาทั้งหมด ${courseStudents.value.length} คนเรียบร้อยแล้ว`)
  }

  if (isWeekHoliday(selectedCourseId.value, weekToUse)) {
    openConfirmDialog({
      title: `สัปดาห์ที่ ${weekToUse} เป็นวันหยุดราชการ`,
      message: `สัปดาห์ที่ ${weekToUse} ถูกกำหนดเป็นวันหยุดราชการอยู่ หากเช็คชื่อมาเรียนทุกคน ระบบจะเปลี่ยนสัปดาห์นี้กลับเป็นการเรียนการสอนปกติ ต้องการดำเนินการต่อหรือไม่?`,
      type: 'confirm',
      confirmText: 'เช็คมาเรียนทุกคน',
      cancelText: 'ยกเลิก',
      onConfirm: async () => {
        await setWeekHoliday(selectedCourseId.value, weekToUse, false)
        applyAllPresent()
      }
    })
    return
  }
  applyAllPresent()
}

// Test Graded Assignment Reward Modal
const handleTestRewardModal = () => {
  const firstAsm = currentAssignments.value?.[0]
  triggerTestReward({
    coins: 40,
    assignmentTitle: firstAsm?.title || 'ใบงานที่ 1: การสำรวจปัญหาแฟ้มข้อมูล',
    courseName: currentCourse.value?.name || 'เทคโนโลยีการจัดการฐานข้อมูล',
    score: firstAsm?.maxScore || 10,
    maxScore: firstAsm?.maxScore || 10
  })
}

// Export Attendance Table to Excel (Template)
const isExportingExcel = ref(false)
const handleExportAttendanceExcel = async () => {
  if (!isTeacher.value) return
  isExportingExcel.value = true
  try {
    const fileName = await exportAttendanceToExcel({
      courseId: selectedCourseId.value,
      classroom: selectedClassroom.value,
      allStudents: studentsList.value
    })
    showAlert(`ดาวน์โหลดตารางการเข้าเรียนสำเร็จ (${fileName})`)
  } catch (err) {
    console.error('Export attendance excel error:', err)
    showAlert('เกิดข้อผิดพลาดในการสร้างไฟล์ Excel')
  } finally {
    isExportingExcel.value = false
  }
}
</script>

<template>
  <div class="space-y-8 pb-16 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Top Header Bar -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-6">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
            <Award class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-gray-900 leading-tight">สมุดคะแนนและเช็คชื่อเข้าเรียน</h2>
            <p class="text-gray-500 text-sm">ระบบวัดและประเมินผลตามสภาพจริง พร้อมระบบเช็คอินการเข้าเรียนรายสัปดาห์</p>
          </div>
        </div>
      </div>

      <!-- Course & Classroom Dropdown Switcher + Test Button -->
      <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
        <!-- Print/Export Attendance Excel (Teacher only) -->
        <button 
          v-if="isTeacher"
          type="button"
          @click="handleExportAttendanceExcel"
          :disabled="isExportingExcel"
          class="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          title="พิมพ์ตารางการเข้าเรียนออกมาเป็นไฟล์ Excel ตามแบบฟอร์ม (เฉพาะอาจารย์)"
        >
          <FileSpreadsheet class="w-4 h-4 text-emerald-200" />
          <span>{{ isExportingExcel ? 'กำลังสร้างไฟล์...' : 'พิมพ์ตารางเข้าเรียน (Excel)' }}</span>
        </button>

        <!-- Test Reward Modal (Main Teacher only) -->
        <button 
          v-if="isMainTeacherUser"
          type="button"
          @click="handleTestRewardModal"
          class="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          title="คลิกเพื่อทดสอบดู Modal แจ้งเตือนเหรียญรางวัลของนักเรียน"
        >
          <FlaskConical class="w-4 h-4 text-amber-600" />
          <span>ทดสอบ Modal เหรียญ</span>
        </button>

        <!-- Custom Professional Course Selector Dropdown -->
        <div class="relative gradebook-course-dropdown">
          <button
            type="button"
            @click="showCourseDropdown = !showCourseDropdown; showClassroomDropdown = false"
            class="flex items-center justify-between gap-2.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-2xl text-xs sm:text-sm font-bold text-stone-800 shadow-xs transition-all cursor-pointer min-w-[260px]"
            :class="{ 'ring-2 ring-emerald-500/40 border-emerald-400 shadow-md': showCourseDropdown }"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                :class="currentCourse?.levelGroup === 'ปวส.' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'"
              >
                <component :is="courseIcons[currentCourse?.id] || BookOpen" class="w-4 h-4" />
              </div>
              <div class="text-left min-w-0">
                <div class="text-xs font-black text-stone-900 truncate max-w-[200px]">
                  {{ currentCourse?.name }}
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-stone-500 font-normal">
                  <span class="font-mono font-bold text-emerald-700">{{ currentCourse?.code }}</span>
                  <span>•</span>
                  <span
                    class="px-1.5 py-0.2 rounded font-bold"
                    :class="currentCourse?.levelGroup === 'ปวส.' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'"
                  >
                    ห้อง {{ currentCourse?.level }}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180 text-emerald-600': showCourseDropdown }"
            />
          </button>

          <!-- Floating Course Options Menu -->
          <div
            v-if="showCourseDropdown"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 space-y-1 animate-[fadeIn_0.15s_ease-out]"
          >
            <div class="px-2.5 py-1.5 text-[10px] font-black text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>เลือกรายวิชาที่ต้องการดูข้อมูล</span>
              <span>{{ availableCourses.length }} รายวิชา</span>
            </div>

            <button
              v-for="c in availableCourses"
              :key="c.id"
              type="button"
              @click="selectedCourseId = c.id; showCourseDropdown = false"
              class="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border"
              :class="selectedCourseId === c.id
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                : 'bg-white border-transparent hover:bg-stone-50 text-stone-700'"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                  :class="c.levelGroup === 'ปวส.' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'"
                >
                  <component :is="courseIcons[c.id] || BookOpen" class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-black text-stone-900 truncate">{{ c.name }}</div>
                  <div class="flex items-center gap-1.5 text-[10px] text-stone-500 mt-0.5">
                    <span class="font-mono font-bold text-stone-700">รหัส {{ c.code }}</span>
                    <span>•</span>
                    <span>ระดับ {{ c.level }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                  :class="c.levelGroup === 'ปวส.'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-purple-100 text-purple-800 border-purple-200'"
                >
                  {{ c.levelGroup }}
                </span>
                <div
                  class="w-5 h-5 rounded-lg flex items-center justify-center border transition-colors"
                  :class="selectedCourseId === c.id
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-200 bg-stone-50'"
                >
                  <Check v-if="selectedCourseId === c.id" class="w-3.5 h-3.5" stroke-width="3" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Custom Professional Classroom Selector Dropdown (Teacher only) -->
        <div v-if="isTeacher" class="relative gradebook-classroom-dropdown">
          <button
            type="button"
            @click="showClassroomDropdown = !showClassroomDropdown; showCourseDropdown = false"
            class="flex items-center justify-between gap-2.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-2xl text-xs sm:text-sm font-bold text-stone-800 shadow-xs transition-all cursor-pointer min-w-[185px]"
            :class="{ 'ring-2 ring-emerald-500/40 border-emerald-400 shadow-md': showClassroomDropdown }"
          >
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <School class="w-4 h-4 text-emerald-600" />
              </div>
              <div class="text-left">
                <div class="text-xs font-black text-stone-900">
                  {{ selectedClassroom === 'all' ? 'ทุกห้องเรียน' : (selectedClassroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + selectedClassroom) }}
                </div>
                <div class="text-[10px] text-stone-500 font-normal">
                  นักศึกษา {{ getRoomStudentCount(selectedClassroom) }} คน
                </div>
              </div>
            </div>
            <ChevronDown
              class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180 text-emerald-600': showClassroomDropdown }"
            />
          </button>

          <!-- Floating Classroom Options Menu -->
          <div
            v-if="showClassroomDropdown"
            class="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 p-1.5 z-50 space-y-1 animate-[fadeIn_0.15s_ease-out]"
          >
            <div class="px-2.5 py-1 text-[10px] font-black text-stone-400 uppercase tracking-wider">
              เลือกกลุ่ม / ห้องเรียน
            </div>

            <button
              type="button"
              @click="selectedClassroom = 'all'; showClassroomDropdown = false"
              class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer"
              :class="selectedClassroom === 'all' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-stone-50 text-stone-700'"
            >
              <div class="flex items-center gap-2">
                <Layers class="w-4 h-4 text-emerald-600" />
                <span class="text-xs font-bold">ทุกห้องเรียน (ทั้งหมด)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-mono text-[10px] font-bold">
                  {{ getRoomStudentCount('all') }} คน
                </span>
                <Check v-if="selectedClassroom === 'all'" class="w-4 h-4 text-emerald-600" />
              </div>
            </button>

            <div v-if="availableClassrooms.length > 0" class="border-t border-stone-100 my-1"></div>

            <button
              v-for="room in availableClassrooms"
              :key="room"
              type="button"
              @click="selectedClassroom = room; showClassroomDropdown = false"
              class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer"
              :class="selectedClassroom === room ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-stone-50 text-stone-700'"
            >
              <div class="flex items-center gap-2">
                <School class="w-4 h-4 text-stone-500" />
                <span class="text-xs font-bold">{{ room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-mono text-[10px] font-bold">
                  {{ getRoomStudentCount(room) }} คน
                </span>
                <Check v-if="selectedClassroom === room" class="w-4 h-4 text-emerald-600" />
              </div>
            </button>
          </div>
        </div>

        <!-- Locked Classroom Badge for Students -->
        <div 
          v-else
          class="px-3.5 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold text-emerald-900 shadow-xs flex items-center gap-1.5"
        >
          <School class="w-4 h-4 text-emerald-600" />
          <span>ห้อง {{ studentClassroom }}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold ml-1">ห้องของคุณ</span>
        </div>
      </div>
    </div>

    <!-- Subject Teacher View-Only Notice Banner -->
    <div
      v-if="isSubjectTeacherUser && !canEditGradebook"
      class="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs"
    >
      <div class="flex items-center gap-2.5 font-bold">
        <ShieldCheck class="w-5 h-5 text-sky-600 shrink-0" />
        <span>โหมดครูประจำวิชา (ดูข้อมูลอย่างเดียว) • แสดงเฉพาะรายวิชาที่ได้รับมอบหมาย</span>
      </div>
      <span class="text-sky-700 font-medium">สามารถดูคะแนน การส่งงาน สถิติเข้าเรียน และพิมพ์ไฟล์ Excel ได้</span>
    </div>

    <!-- Alert Toast Notification -->
    <div v-if="alertMessage" class="fixed bottom-6 right-6 z-50 p-4 bg-stone-900 text-white text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-2 animate-[bounceIn_0.3s_ease-out]">
      <CheckCircle2 class="w-4 h-4 text-emerald-400" />
      <span>{{ alertMessage }}</span>
    </div>

    <!-- Grading Proportions Visual Banner (สัดส่วนคะแนน 100 คะแนน) -->
    <div class="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-300 border border-white/10">
            <GraduationCap class="w-3.5 h-3.5" />
            <span>เกณฑ์การให้คะแนนตามหลักสูตร (100 คะแนนเต็ม)</span>
          </div>
          <h3 class="text-2xl font-black">{{ currentCourse.name }}</h3>
          <p class="text-xs text-stone-300 max-w-2xl leading-relaxed">
            จิตพิสัย 20 คะแนน (เข้าเรียน 10 + ความรับผิดชอบ 10) • คะแนนเก็บใบงาน 40 คะแนน • สอบกลางภาค 20 คะแนน • สอบปลายภาค 20 คะแนน
          </p>
        </div>

        <!-- Quick Summary Stats -->
        <div class="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
          <div class="text-center px-3 border-r border-white/20">
            <span class="text-[10px] text-stone-300 block uppercase font-bold">{{ isTeacher ? 'นศ. ในชั้น' : 'สถานะ' }}</span>
            <span class="text-xl font-black text-white">{{ isTeacher ? `${courseStudents.length} คน` : (currentStudent?.name?.split(' ')[0] || 'นักศึกษา') }}</span>
          </div>
          <div class="text-center px-3 border-r border-white/20">
            <span class="text-[10px] text-stone-300 block uppercase font-bold">{{ isTeacher ? 'คะแนนเฉลี่ย' : 'คะแนนสะสม' }}</span>
            <span class="text-xl font-black text-emerald-400">
              {{ isTeacher ? `${classAverageScore}/100` : `${myScoreSummary.totalScore}/100` }}
            </span>
          </div>
          <div class="text-center px-3">
            <span class="text-[10px] text-stone-300 block uppercase font-bold">{{ isTeacher ? 'เข้าเรียนสัปดาห์นี้' : 'เกรดปัจจุบัน' }}</span>
            <span class="text-xl font-black text-amber-400">
              {{ isTeacher ? `${attendancePresentRate}%` : `${myScoreSummary.gradeInfo?.grade || 0} (${myScoreSummary.gradeInfo?.letter || 'F'})` }}
            </span>
          </div>
        </div>
      </div>

      <!-- Score Weight Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
        <!-- 1. จิตพิสัย: เข้าเรียน 10 + ความรับผิดชอบ 10 -->
        <div class="bg-white/5 rounded-2xl p-3.5 border border-white/10">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-stone-300 font-bold">จิตพิสัย (รวม 20)</span>
            <span class="font-mono text-emerald-400 font-bold">20%</span>
          </div>
          <div class="text-[11px] text-stone-400 space-y-0.5">
            <p>• เข้าเรียน/ตรงต่อเวลา: <strong>10 คะแนน</strong></p>
            <p>• ความรับผิดชอบ: <strong>10 คะแนน</strong></p>
          </div>
        </div>

        <!-- 2. คะแนนเก็บใบงาน 40 -->
        <div class="bg-white/5 rounded-2xl p-3.5 border border-white/10">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-stone-300 font-bold">คะแนนเก็บใบงาน</span>
            <span class="font-mono text-emerald-400 font-bold">40%</span>
          </div>
          <div class="text-[11px] text-stone-400">
            <p>ใบงานปฏิบัติการ {{ currentAssignments.length }} ชิ้น</p>
            <p>เก็บสะสมตลอดภาคเรียน</p>
          </div>
        </div>

        <!-- 3. สอบกลางภาค 20 -->
        <div class="bg-white/5 rounded-2xl p-3.5 border border-white/10">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-stone-300 font-bold">สอบกลางภาค</span>
            <span class="font-mono text-emerald-400 font-bold">20%</span>
          </div>
          <div class="text-[11px] text-stone-400">
            <p>สัปดาห์ที่ 8-9</p>
            <p>ข้อสอบข้อเขียนและปฏิบัติ</p>
          </div>
        </div>

        <!-- 4. สอบปลายภาค 20 -->
        <div class="bg-white/5 rounded-2xl p-3.5 border border-white/10">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-stone-300 font-bold">สอบปลายภาค</span>
            <span class="font-mono text-emerald-400 font-bold">20%</span>
          </div>
          <div class="text-[11px] text-stone-400">
            <p>สัปดาห์ที่ 15-18</p>
            <p>โครงงานและสอบประมวล</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs (สลับโหมดการทำงาน) -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
      <div class="flex items-center gap-2">
        <button
          @click="activeTab = 'summary'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'summary'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          ]"
        >
          <FileText class="w-4 h-4" />
          <span>สมุดคะแนนรวม (100 คะแนน)</span>
        </button>

        <button
          @click="activeTab = 'assignments'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'assignments'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          ]"
        >
          <Edit3 class="w-4 h-4" />
          <span>บันทึกคะแนนตามใบงาน (40 คะแนน)</span>
        </button>

        <button
          @click="activeTab = 'attendance'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          ]"
        >
          <Clock class="w-4 h-4" />
          <span>เช็คชื่อเข้าเรียนรายสัปดาห์ (10 คะแนน)</span>
        </button>
      </div>

      <!-- Quick Search input (Teacher only) -->
      <div v-if="isTeacher" class="relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ค้นหาชื่อ หรือรหัสนักศึกษา..." 
          class="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: สมุดคะแนนรวม (GRADE SUMMARY TABLE) -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'summary'" class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500">
        <span class="flex items-center gap-1.5">
          <Info class="w-4 h-4" :class="isTeacher ? 'text-emerald-600' : 'text-blue-600'" />
          {{ isTeacher ? 'สามารถคลิกที่ช่องคะแนนความรับผิดชอบ, สอบกลางภาค, ปลายภาค เพื่อแก้ไขได้โดยตรง (บันทึกอัตโนมัติ)' : 'สรุปคะแนนสะสมและผลการเรียนในรายวิชา (โหมดดูข้อมูลเฉพาะตนเอง)' }}
        </span>
        <span>{{ isTeacher ? `แสดง ${courseStudents.length} คน` : 'ข้อมูลเฉพาะตนเอง' }}</span>
      </div>

      <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-stone-700">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th class="py-4 px-4 w-12 text-center">ลำดับ</th>
                <th class="py-4 px-4 min-w-[180px]">นักศึกษา</th>
                <th class="py-4 px-3 text-center bg-emerald-50/50 text-emerald-900 border-x border-emerald-100" title="คำนวณจากประวัติการเช็คอิน">
                  เข้าเรียน<br><span class="font-normal text-[10px]">(10)</span>
                </th>
                <th class="py-4 px-3 text-center bg-emerald-50/50 text-emerald-900 border-r border-emerald-100">
                  รับผิดชอบ<br><span class="font-normal text-[10px]">(10)</span>
                </th>
                <th class="py-4 px-3 text-center font-bold text-emerald-900 bg-emerald-100/50 border-r border-emerald-200">
                  รวมจิตพิสัย<br><span class="font-normal text-[10px]">(20)</span>
                </th>
                <th class="py-4 px-3 text-center bg-indigo-50/40 text-indigo-900 border-r border-indigo-100">
                  คะแนนใบงาน<br><span class="font-normal text-[10px]">(40)</span>
                </th>
                <th class="py-4 px-3 text-center border-r border-stone-200">
                  กลางภาค<br><span class="font-normal text-[10px]">(20)</span>
                </th>
                <th class="py-4 px-3 text-center border-r border-stone-200">
                  ปลายภาค<br><span class="font-normal text-[10px]">(20)</span>
                </th>
                <th class="py-4 px-4 text-center font-black text-stone-900 bg-stone-100 border-r border-stone-200">
                  รวมทั้งหมด<br><span class="font-normal text-[10px]">(100)</span>
                </th>
                <th class="py-4 px-4 text-center font-black">
                  เกรด (Grade)
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr 
                v-for="(student, index) in courseStudents" 
                :key="student.id"
                :class="[
                  'hover:bg-stone-50/80 transition-colors',
                  (!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)) ? 'bg-emerald-50/50 font-medium' : ''
                ]"
              >
                <!-- Index -->
                <td class="py-3 px-4 text-center text-stone-400 font-mono">
                  {{ index + 1 }}
                </td>

                <!-- Student Info -->
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2.5">
                    <StudentAvatar
                      :avatar="student.avatar"
                      :frame="student.equippedFrame"
                      :name="student.name"
                      size="w-8 h-8"
                      avatarClass="bg-emerald-100 text-emerald-800 text-xs"
                      class="shrink-0"
                    />
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-stone-900 block">{{ student.name }}</span>
                        <span v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)" class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                          ตัวคุณ
                        </span>
                      </div>
                      <span class="text-stone-400 font-mono text-[10px]">{{ student.studentId }} • {{ student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + student.classroom }}</span>
                    </div>
                  </div>
                </td>

                <!-- 1. เข้าเรียน (10) - คำนวณอัตโนมัติจากการเช็คชื่อ -->
                <td class="py-3 px-3 text-center font-mono font-bold bg-emerald-50/30 border-x border-emerald-100" :title="'คำนวณจากการเข้าเรียนสัปดาห์ที่ 1 ถึง ' + totalRecordedWeeks">
                  <span :class="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore >= 8 ? 'text-emerald-700' : 'text-amber-700'">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore }}
                  </span>
                </td>

                <!-- 2. ความรับผิดชอบ (10) - แก้ไขได้เฉพาะผู้มีสิทธิ์ -->
                <td class="py-3 px-3 text-center bg-emerald-50/30 border-r border-emerald-100">
                  <input 
                    v-if="canEditGradebook"
                    type="number" 
                    step="0.5" 
                    min="0" 
                    max="10"
                    :value="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).responsibilityScore"
                    @change="handleGeneralScoreInput(student.studentId, 'responsibility', $event, 10)"
                    class="w-14 px-1.5 py-1 text-center font-mono font-bold bg-white border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span v-else class="font-mono font-bold text-stone-800 text-xs">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).responsibilityScore }}
                  </span>
                </td>

                <!-- รวมจิตพิสัย (20) -->
                <td class="py-3 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-100/40 border-r border-emerald-200">
                  {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).affectiveTotal }}
                </td>

                <!-- 3. คะแนนเก็บใบงาน (40) -->
                <td class="py-3 px-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/30 border-r border-indigo-100">
                  {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).assignmentsScore }}
                </td>

                <!-- 4. สอบกลางภาค (20) - แก้ไขได้เฉพาะผู้มีสิทธิ์ -->
                <td class="py-3 px-3 text-center border-r border-stone-200">
                  <input 
                    v-if="canEditGradebook"
                    type="number" 
                    step="0.5" 
                    min="0" 
                    max="20"
                    :value="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).midtermScore"
                    @change="handleGeneralScoreInput(student.studentId, 'midterm', $event, 20)"
                    class="w-14 px-1.5 py-1 text-center font-mono font-bold bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span v-else class="font-mono font-bold text-stone-800 text-xs">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).midtermScore }}
                  </span>
                </td>

                <!-- 5. สอบปลายภาค (20) - แก้ไขได้เฉพาะผู้มีสิทธิ์ -->
                <td class="py-3 px-3 text-center border-r border-stone-200">
                  <input 
                    v-if="canEditGradebook"
                    type="number" 
                    step="0.5" 
                    min="0" 
                    max="20"
                    :value="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).finalScore"
                    @change="handleGeneralScoreInput(student.studentId, 'final', $event, 20)"
                    class="w-14 px-1.5 py-1 text-center font-mono font-bold bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span v-else class="font-mono font-bold text-stone-800 text-xs">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).finalScore }}
                  </span>
                </td>

                <!-- รวมทั้งหมด (100) -->
                <td class="py-3 px-4 text-center font-mono font-black text-sm bg-stone-100/70 border-r border-stone-200 text-stone-900">
                  {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).totalScore }}
                </td>

                <!-- Grade Badge -->
                <td class="py-3 px-4 text-center">
                  <span 
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-black border inline-block min-w-[50px]',
                      getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).gradeInfo.color
                    ]"
                  >
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).gradeInfo.grade }}
                    <span class="text-[10px] font-normal">({{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).gradeInfo.letter }})</span>
                  </span>
                </td>
              </tr>

              <tr v-if="courseStudents.length === 0">
                <td colspan="10" class="py-12 text-center text-stone-400">
                  ไม่พบข้อมูลนักศึกษาในวิชาและห้องเรียนที่เลือก
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: บันทึกคะแนนตามใบงาน (EXCEL MATRIX SCORING) -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'assignments'" class="space-y-5">

      <!-- Excel Toolbar Header Card -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-stone-900 text-sm sm:text-base">
              {{ canEditGradebook ? 'ตารางกรอกคะแนนใบงานทั้งหมด (แบบ Excel Matrix)' : (isTeacher ? 'ตารางคะแนนใบงานทั้งหมด (ดูอย่างเดียว)' : 'ตารางคะแนนใบงานรายสัปดาห์ของคุณ') }}
            </h4>
            <p class="text-xs text-stone-500">
              {{ currentAssignments.length }} ใบงาน • คะแนนดิบรวมเต็ม {{ totalAssignmentsMaxScore }} คะแนน (คิดเป็นคะแนนเก็บ {{ gradingConfig.assignments.total }} คะแนน)
            </p>
          </div>
        </div>

        <!-- Teacher Actions (Main Teacher or Authorized Subject Teacher) -->
        <div v-if="canEditGradebook" class="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          <button
            type="button"
            @click="fillFullScoreForSubmitted(null)"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="กรอกคะแนนเต็มให้อัตโนมัติสำหรับทุกช่องที่ส่งงานแล้วและยังไม่มีคะแนน"
          >
            <Sparkles class="w-3.5 h-3.5 text-amber-500" />
            <span>ใส่คะแนนเต็มผู้ส่งงาน</span>
          </button>

          <button
            v-if="hasUnsavedAssignmentScores"
            type="button"
            @click="resetDraftScores"
            class="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>รีเซ็ตค่า</span>
          </button>

          <button
            type="button"
            @click="saveAllAssignmentScores"
            :disabled="isSavingScores"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
            title="บันทึกคะแนนที่แก้ไขทั้งหมด"
          >
            <Save v-if="!isSavingScores" class="w-3.5 h-3.5" />
            <svg v-else class="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSavingScores ? 'กำลังบันทึก...' : 'บันทึกคะแนนทั้งหมด' }}</span>
            <span v-if="unsavedCount > 0" class="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black">
              {{ unsavedCount }}
            </span>
          </button>
        </div>

        <!-- Student Legend -->
        <div v-else class="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">ตรวจแล้ว</span>
          <span class="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">ส่งแล้ว / รอตรวจ</span>
          <span class="px-2.5 py-1 rounded-lg bg-stone-50 text-stone-500 border border-stone-200">ยังไม่ส่ง (-)</span>
          <span class="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
            คะแนนเก็บส่วน {{ gradingConfig.assignments.total }} คะแนน
          </span>
        </div>
      </div>

      <!-- Color Legend Strip for Editable Mode -->
      <div v-if="canEditGradebook" class="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-stone-600">
        <div class="flex flex-wrap items-center gap-3 font-medium">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-3 h-3 rounded border border-emerald-300 bg-emerald-50 inline-block"></span>
            ตรวจให้คะแนนแล้ว
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="w-3 h-3 rounded border border-sky-300 bg-sky-50 inline-block"></span>
            ส่งงานแล้ว (รอตรวจ)
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="w-3 h-3 rounded border border-amber-400 bg-amber-100 inline-block"></span>
            แก้ไขแล้วยังไม่บันทึก
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="w-3 h-3 rounded border border-stone-300 bg-white inline-block"></span>
            ยังไม่ส่งงาน
          </span>
        </div>
        <span class="text-stone-400">
          กด Enter หรือลูกศร ขึ้น/ลง เพื่อเลื่อนช่องคะแนน • คลิกมุมขวาบนของช่องเพื่อเปิดลิงก์งาน
        </span>
      </div>

      <!-- Compact Excel Matrix Table -->
      <div class="bg-white rounded-3xl border border-stone-300 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-xs text-stone-700">
            <thead>
              <!-- Row 1: Rotated Assignment Headers -->
              <tr class="bg-stone-100 text-stone-800">
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-bold w-10">
                  ลำดับ
                </th>
                <th rowspan="2" class="border border-stone-300 px-2.5 py-2 text-center font-bold w-28">
                  รหัสนักศึกษา
                </th>
                <th rowspan="2" class="border border-stone-300 px-3 py-2 text-left font-bold min-w-[190px] sticky left-0 z-20 bg-stone-100">
                  ชื่อ - นามสกุล
                </th>
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-bold w-16">
                  ห้อง
                </th>

                <!-- Vertical Rotated (Clockwise / Tilt Head) Assignment Columns -->
                <th
                  v-for="a in currentAssignments"
                  :key="a.id"
                  class="excel-th-vertical border border-stone-300 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                  :title="a.title + ' (เต็ม ' + a.maxScore + ' คะแนน)'"
                >
                  <div class="excel-vertical-text">{{ a.title }}</div>
                </th>

                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-bold bg-stone-100 w-16 leading-tight">
                  <span>รวมดิบ</span>
                  <span class="block text-[10px] font-mono text-stone-500 mt-0.5">({{ totalAssignmentsMaxScore }})</span>
                </th>
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-black bg-indigo-50 text-indigo-900 w-16 leading-tight">
                  <span>เก็บ</span>
                  <span class="block text-[10px] font-mono text-indigo-700 mt-0.5">({{ gradingConfig.assignments.total }})</span>
                </th>
              </tr>

              <!-- Row 2: Compact Max Score & Quick Column Fill -->
              <tr class="bg-emerald-100/50 text-[10px]">
                <th
                  v-for="a in currentAssignments"
                  :key="`sub-${a.id}`"
                  class="border border-stone-300 px-1 py-1 text-center font-mono text-emerald-950"
                >
                  <div class="font-black">เต็ม {{ a.maxScore }}</div>
                  <div v-if="isTeacher" class="flex items-center justify-center gap-0.5 mt-0.5">
                    <span class="text-[9px] font-sans text-stone-500">ส่ง {{ getSubmittedCount(a.id) }}</span>
                    <button
                      v-if="canEditGradebook"
                      type="button"
                      @click="fillFullScoreForSubmitted(a.id)"
                      class="p-0.5 rounded hover:bg-amber-100 text-amber-600 cursor-pointer transition-colors"
                      :title="'ใส่คะแนนเต็ม (' + a.maxScore + ') ให้ทุกคนที่ส่ง ' + a.title.split(':')[0]"
                    >
                      <Sparkles class="w-2.5 h-2.5" />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, index) in courseStudents"
                :key="student.id"
                class="group transition-colors"
                :class="(!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)) ? 'bg-emerald-50/40' : 'hover:bg-stone-50/60'"
              >
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono text-stone-400">
                  {{ index + 1 }}
                </td>
                <td class="border border-stone-300 px-2.5 py-1.5 text-center font-mono text-[11px] text-stone-600 whitespace-nowrap">
                  {{ student.studentId }}
                </td>
                <td
                  class="border border-stone-300 px-3 py-1.5 font-bold text-stone-900 sticky left-0 z-10 whitespace-nowrap"
                  :class="(!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)) ? 'bg-emerald-50' : 'bg-white group-hover:bg-stone-50'"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ student.name }}</span>
                    <span
                      v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)"
                      class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold shrink-0"
                    >
                      ตัวคุณ
                    </span>
                  </div>
                </td>
                <td class="border border-stone-300 px-2 py-1.5 text-center whitespace-nowrap">
                  <span class="px-1.5 py-0.5 rounded bg-stone-100 font-bold text-[10px]">
                    {{ student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : student.classroom }}
                  </span>
                </td>

                <!-- Compact Excel Assignment Cells -->
                <td
                  v-for="(a, aIdx) in currentAssignments"
                  :key="`cell-${student.id}-${a.id}`"
                  class="relative p-0 border border-stone-300 text-center align-middle w-[56px] min-w-[54px] max-w-[64px]"
                  :class="[
                    canEditGradebook && isCellDirty(student.studentId || student.id, a.id)
                      ? 'bg-amber-100/90'
                      : ((getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] || 0) > 0
                          ? 'bg-emerald-50/70'
                          : (getSubmission(student.studentId, a.id) ? 'bg-sky-50/80' : 'bg-white'))
                  ]"
                >
                  <!-- Editable Input Cell (Main Teacher or Authorized Subject Teacher) -->
                  <template v-if="canEditGradebook">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      :max="a.maxScore"
                      v-model="draftAssignmentScores[getCellKey(student.studentId || student.id, a.id)]"
                      :data-excel-row="index"
                      :data-excel-col="aIdx"
                      @keydown="handleExcelCellKeydown($event, index, aIdx)"
                      placeholder="-"
                      :title="student.name + ' • ' + a.title + ' (เต็ม ' + a.maxScore + ')'"
                      class="excel-score-input w-full h-9 px-1 text-center font-mono font-bold text-xs text-stone-900 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                    />
                  </template>

                  <!-- Student Read-Only Cell -->
                  <template v-else>
                    <div
                      class="h-9 flex items-center justify-center font-mono font-bold text-xs px-1"
                      :class="[
                        (getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] || 0) > 0
                          ? 'text-emerald-800'
                          : (getSubmission(student.studentId, a.id) ? 'text-sky-700' : 'text-stone-400')
                      ]"
                      :title="a.title + ' • คะแนน ' + (getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] ?? 0) + '/' + a.maxScore"
                    >
                      <template v-if="getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] !== undefined && getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] !== null && getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] !== ''">
                        {{ getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[a.id] }}
                      </template>
                      <template v-else-if="getSubmission(student.studentId, a.id)">
                        <span class="text-[10px] font-sans font-bold">รอตรวจ</span>
                      </template>
                      <template v-else>-</template>
                    </div>
                  </template>

                  <!-- Corner Link Icon when Submitted -->
                  <a
                    v-if="getSubmission(student.studentId, a.id)"
                    :href="formatExternalUrl(getSubmission(student.studentId, a.id).link)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="absolute top-0.5 right-0.5 p-0.5 rounded bg-blue-100/90 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                    :title="(getSubmission(student.studentId, a.id).workType === 'pair' ? '[งานคู่] ' : (getSubmission(student.studentId, a.id).workType === 'group' ? '[งานกลุ่ม] ' : '')) + 'เปิดลิงก์งานที่ส่ง: ' + a.title"
                  >
                    <ExternalLink class="w-2.5 h-2.5" />
                  </a>
                </td>

                <!-- Raw Sum Column -->
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono font-bold text-stone-800 bg-stone-50/80">
                  {{ getStudentRawAssignmentSum(student.studentId || student.id) }}
                </td>

                <!-- Scaled (40) Column -->
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono font-black text-indigo-800 bg-indigo-50/50">
                  {{ getStudentScaledAssignmentScore(student.studentId || student.id) }}
                </td>
              </tr>

              <tr v-if="courseStudents.length === 0">
                <td :colspan="6 + currentAssignments.length" class="py-10 text-center text-stone-400 border border-stone-300">
                  ไม่พบข้อมูลนักศึกษาในวิชาและห้องเรียนที่เลือก
                </td>
              </tr>
            </tbody>

            <!-- Footer Average Row for Teacher -->
            <tfoot v-if="isTeacher && courseStudents.length > 0">
              <tr class="bg-stone-100 font-bold text-stone-700 text-[11px]">
                <td colspan="4" class="border border-stone-300 px-3 py-2 text-right">
                  ค่าเฉลี่ยแต่ละใบงาน (จำนวนผู้ส่งงาน):
                </td>
                <td
                  v-for="a in currentAssignments"
                  :key="`avg-${a.id}`"
                  class="border border-stone-300 px-1 py-1.5 text-center font-mono"
                >
                  <div class="text-emerald-800">{{ getAssignmentAvgScore(a.id) }}</div>
                  <div class="text-[9px] text-stone-500 font-sans">{{ getSubmittedCount(a.id) }}/{{ courseStudents.length }}</div>
                </td>
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono text-stone-500">-</td>
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono text-indigo-700">-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Bottom Action Bar for Editable Mode -->
        <div v-if="canEditGradebook" class="p-4 bg-stone-50/80 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs">
            <span v-if="hasUnsavedAssignmentScores" class="inline-flex items-center gap-1.5 text-amber-800 font-bold bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              มีการแก้ไขคะแนน {{ unsavedCount }} ช่องที่ยังไม่ได้บันทึก
            </span>
            <span v-else class="text-stone-500 font-medium inline-flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>กรอกคะแนนลงในตารางแบบ Excel แล้วกดปุ่ม "บันทึกคะแนนทั้งหมด" ด้านขวา</span>
            </span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              v-if="hasUnsavedAssignmentScores"
              type="button"
              @click="resetDraftScores"
              class="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              รีเซ็ตค่า
            </button>
            <button
              type="button"
              @click="saveAllAssignmentScores"
              :disabled="isSavingScores"
              class="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save v-if="!isSavingScores" class="w-4 h-4" />
              <svg v-else class="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSavingScores ? 'กำลังบันทึกคะแนน...' : 'บันทึกคะแนนทั้งหมด' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 3: เช็คชื่อการเข้าเรียนรายสัปดาห์ (EXCEL ATTENDANCE MATRIX) -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'attendance'" class="space-y-5">

      <!-- Excel Attendance Toolbar Card -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-stone-900 text-sm sm:text-base">
                {{ canEditGradebook ? 'ตารางเช็คชื่อเข้าเรียนรายสัปดาห์ทั้งหมด (แบบ Excel Matrix)' : 'ตารางสรุปการเข้าเรียนรายสัปดาห์ทั้งหมด' }}
              </h4>
              <p class="text-xs text-stone-500">
                รวม {{ totalCourseWeeks }} สัปดาห์ • จิตพิสัยการเข้าเรียนเต็ม 10 คะแนน (มาเรียน 100%, มาสายหัก 0.2 คะแนน, ลา/วันหยุดไม่หักคะแนน)
              </p>
            </div>
          </div>

          <!-- Top Actions: Week Holiday / Quick Check-in / Export Excel -->
          <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <template v-if="canEditGradebook">
              <button
                v-if="!isWeekHoliday(selectedCourseId, selectedWeek)"
                @click="handleOpenHolidayModal(selectedWeek)"
                type="button"
                class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="กำหนดให้สัปดาห์ที่เลือกเป็นวันหยุดราชการ (ไม่หักคะแนนเข้าเรียน)"
              >
                <CalendarOff class="w-3.5 h-3.5 text-rose-500" />
                <span>ตั้ง W{{ selectedWeek }} เป็นวันหยุด</span>
              </button>

              <button
                v-else
                @click="handleRemoveHoliday(selectedWeek)"
                type="button"
                class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>ยกเลิกวันหยุด (W{{ selectedWeek }})</span>
              </button>

              <button
                @click="handleBatchAllPresent(selectedWeek)"
                :disabled="isWeekHoliday(selectedCourseId, selectedWeek)"
                type="button"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <UserCheck class="w-3.5 h-3.5" />
                <span>มาเรียนครบทุกคน (W{{ selectedWeek }})</span>
              </button>
            </template>

            <button
              v-if="isTeacher"
              @click="handleExportAttendanceExcel"
              :disabled="isExportingExcel"
              type="button"
              class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-200" />
              <span>{{ isExportingExcel ? 'กำลังสร้างไฟล์...' : 'พิมพ์ตารางเข้าเรียน (Excel)' }}</span>
            </button>
          </div>
        </div>

        <!-- Stamp Mode Selector (Editable Teacher) OR Legend Strip (Read-Only / Student) -->
        <div class="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div v-if="canEditGradebook" class="flex flex-wrap items-center gap-1.5">
            <span class="font-bold text-stone-600 mr-1">โหมดคลิกช่องตาราง:</span>
            <button
              v-for="mode in stampModeOptions"
              :key="mode.id"
              type="button"
              @click="attendanceStampMode = mode.id"
              class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer"
              :class="attendanceStampMode === mode.id
                ? mode.badgeClass + ' shadow-2xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'"
            >
              {{ mode.label }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">มา = มาเรียนตรงเวลา</span>
            <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">สาย = มาสาย (-0.2)</span>
            <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">ลา = ลากิจ/ป่วย</span>
            <span class="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">ขาด = ขาดเรียน</span>
            <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">หยุด = วันหยุดราชการ</span>
          </div>
        </div>
      </div>

      <!-- Compact Excel Attendance Matrix Table -->
      <div class="bg-white rounded-3xl border border-stone-300 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-xs text-stone-700">
            <thead>
              <!-- Row 1: Rotated Vertical Week Topic Headers -->
              <tr class="bg-stone-100 text-stone-800">
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-bold w-10">
                  ลำดับ
                </th>
                <th rowspan="2" class="border border-stone-300 px-2.5 py-2 text-center font-bold w-28">
                  รหัสนักศึกษา
                </th>
                <th rowspan="2" class="border border-stone-300 px-3 py-2 text-left font-bold min-w-[190px] sticky left-0 z-20 bg-stone-100">
                  ชื่อ - นามสกุล
                </th>
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-bold w-16">
                  ห้อง
                </th>

                <!-- Vertical Rotated Week Columns (W1..W15/18) -->
                <th
                  v-for="w in totalCourseWeeks"
                  :key="`th-w-${w}`"
                  @click="selectedWeek = w"
                  class="excel-th-week-vertical border border-stone-300 transition-colors cursor-pointer"
                  :class="isWeekHoliday(selectedCourseId, w)
                    ? 'bg-rose-50/90 hover:bg-rose-100/80'
                    : (selectedWeek === w ? 'bg-blue-100/70' : 'bg-blue-50/35 hover:bg-blue-50/80')"
                  :title="getWeekTopicTitle(w)"
                >
                  <div
                    class="excel-week-vertical-text"
                    :class="{ 'text-rose-800': isWeekHoliday(selectedCourseId, w) }"
                  >
                    สัปดาห์ที่ {{ w }}
                  </div>
                </th>

                <!-- Rightmost Summary Headers -->
                <th rowspan="2" class="border border-stone-300 px-1.5 py-2 text-center font-black bg-emerald-50 text-emerald-800 w-11">
                  มา
                </th>
                <th rowspan="2" class="border border-stone-300 px-1.5 py-2 text-center font-black bg-amber-50 text-amber-800 w-11">
                  สาย
                </th>
                <th rowspan="2" class="border border-stone-300 px-1.5 py-2 text-center font-black bg-blue-50 text-blue-800 w-11">
                  ลา
                </th>
                <th rowspan="2" class="border border-stone-300 px-1.5 py-2 text-center font-black bg-red-50 text-red-800 w-11">
                  ขาด
                </th>
                <th rowspan="2" class="border border-stone-300 px-2 py-2 text-center font-black bg-indigo-50 text-indigo-900 w-14 leading-tight">
                  <span>คะแนน</span>
                  <span class="block text-[10px] font-mono text-indigo-700 mt-0.5">(10)</span>
                </th>
              </tr>

              <!-- Row 2: Week Number + Quick Actions per Column -->
              <tr class="bg-blue-50/60 text-[10px]">
                <th
                  v-for="w in totalCourseWeeks"
                  :key="`sub-w-${w}`"
                  @click="selectedWeek = w"
                  class="border border-stone-300 px-1 py-1 text-center font-mono cursor-pointer transition-colors"
                  :class="selectedWeek === w ? 'bg-blue-100/90 ring-1 ring-inset ring-blue-400' : ''"
                >
                  <div class="font-black text-stone-900">W{{ w }}</div>
                  <div v-if="isWeekHoliday(selectedCourseId, w)" class="text-[9px] font-sans font-bold text-rose-700">
                    หยุด
                  </div>
                  <div v-else class="text-[9px] font-sans text-stone-500">
                    {{ getWeekAttendanceStatus(w).checkedCount }}/{{ courseStudents.length }}
                  </div>

                  <!-- Column Quick Buttons for Editable Teacher -->
                  <div v-if="canEditGradebook" class="flex items-center justify-center gap-0.5 mt-0.5">
                    <button
                      v-if="!isWeekHoliday(selectedCourseId, w)"
                      type="button"
                      @click.stop="handleBatchAllPresent(w)"
                      class="p-0.5 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer transition-colors"
                      :title="'เช็คมาเรียนครบทุกคนในสัปดาห์ที่ ' + w"
                    >
                      <UserCheck class="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      @click.stop="isWeekHoliday(selectedCourseId, w) ? handleRemoveHoliday(w) : handleOpenHolidayModal(w)"
                      class="p-0.5 rounded hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                      :title="isWeekHoliday(selectedCourseId, w) ? 'ยกเลิกวันหยุดสัปดาห์ที่ ' + w : 'ตั้งสัปดาห์ที่ ' + w + ' เป็นวันหยุดราชการ'"
                    >
                      <CalendarOff class="w-2.5 h-2.5" />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, index) in courseStudents"
                :key="`att-row-${student.id}`"
                class="group transition-colors"
                :class="(!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)) ? 'bg-emerald-50/40' : 'hover:bg-stone-50/60'"
              >
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono text-stone-400">
                  {{ index + 1 }}
                </td>
                <td class="border border-stone-300 px-2.5 py-1.5 text-center font-mono text-[11px] text-stone-600 whitespace-nowrap">
                  {{ student.studentId }}
                </td>
                <td
                  class="border border-stone-300 px-3 py-1.5 font-bold text-stone-900 sticky left-0 z-10 whitespace-nowrap"
                  :class="(!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)) ? 'bg-emerald-50' : 'bg-white group-hover:bg-stone-50'"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ student.name }}</span>
                    <span
                      v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)"
                      class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold shrink-0"
                    >
                      ตัวคุณ
                    </span>
                  </div>
                </td>
                <td class="border border-stone-300 px-2 py-1.5 text-center whitespace-nowrap">
                  <span class="px-1.5 py-0.5 rounded bg-stone-100 font-bold text-[10px]">
                    {{ student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : student.classroom }}
                  </span>
                </td>

                <!-- Compact Excel Attendance Cells (1 Cell per Week) -->
                <td
                  v-for="w in totalCourseWeeks"
                  :key="`att-${student.id}-w-${w}`"
                  @click="canEditGradebook && handleCellAttendanceClick(student.studentId, w)"
                  class="p-0 border border-stone-300 text-center align-middle w-[50px] min-w-[46px] max-w-[58px] h-9 select-none transition-colors"
                  :class="[
                    canEditGradebook ? 'cursor-pointer hover:ring-2 hover:ring-inset hover:ring-blue-400' : '',
                    getAttendanceRecord(student.studentId, w).status === 'holiday'
                      ? 'bg-rose-50/90 text-rose-700 font-bold'
                      : getAttendanceRecord(student.studentId, w).status === 'present'
                        ? 'bg-emerald-50/90 text-emerald-800 font-black'
                        : getAttendanceRecord(student.studentId, w).status === 'late'
                          ? 'bg-amber-100/90 text-amber-900 font-black'
                          : getAttendanceRecord(student.studentId, w).status === 'leave'
                            ? 'bg-blue-100/90 text-blue-800 font-black'
                            : getAttendanceRecord(student.studentId, w).status === 'absent'
                              ? 'bg-red-100/90 text-red-800 font-black'
                              : 'bg-white text-stone-300'
                  ]"
                  :title="`${student.name} • สัปดาห์ที่ ${w}: ${getAttendanceStatusShortLabel(getAttendanceRecord(student.studentId, w).status)}${getAttendanceRecord(student.studentId, w).checkedAt && getAttendanceRecord(student.studentId, w).checkedAt !== '-' ? ' (เวลา ' + getAttendanceRecord(student.studentId, w).checkedAt + ')' : ''}`"
                >
                  <span class="text-[11px]">
                    {{ getAttendanceStatusShortLabel(getAttendanceRecord(student.studentId, w).status) }}
                  </span>
                </td>

                <!-- Rightmost Summary Counts & Score -->
                <td class="border border-stone-300 px-1.5 py-1.5 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40">
                  {{ getStudentAttendanceCounts(student.studentId).present }}
                </td>
                <td class="border border-stone-300 px-1.5 py-1.5 text-center font-mono font-bold text-amber-800 bg-amber-50/40">
                  {{ getStudentAttendanceCounts(student.studentId).late }}
                </td>
                <td class="border border-stone-300 px-1.5 py-1.5 text-center font-mono font-bold text-blue-800 bg-blue-50/40">
                  {{ getStudentAttendanceCounts(student.studentId).leave }}
                </td>
                <td class="border border-stone-300 px-1.5 py-1.5 text-center font-mono font-bold text-red-700 bg-red-50/40">
                  {{ getStudentAttendanceCounts(student.studentId).absent }}
                </td>
                <td class="border border-stone-300 px-2 py-1.5 text-center font-mono font-black bg-indigo-50/50">
                  <span :class="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore >= 8 ? 'text-indigo-800' : 'text-red-600'">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore }}
                  </span>
                </td>
              </tr>

              <tr v-if="courseStudents.length === 0">
                <td :colspan="9 + totalCourseWeeks" class="py-10 text-center text-stone-400 border border-stone-300">
                  ไม่พบข้อมูลนักศึกษาในวิชาและห้องเรียนที่เลือก
                </td>
              </tr>
            </tbody>

            <!-- Footer Summary Row for Teacher -->
            <tfoot v-if="isTeacher && courseStudents.length > 0">
              <tr class="bg-stone-100 font-bold text-stone-700 text-[10px]">
                <td colspan="4" class="border border-stone-300 px-3 py-2 text-right">
                  จำนวนผู้เข้าเรียนแต่ละสัปดาห์ (มา+สาย):
                </td>
                <td
                  v-for="w in totalCourseWeeks"
                  :key="`foot-w-${w}`"
                  class="border border-stone-300 px-1 py-1.5 text-center font-mono"
                >
                  <span v-if="isWeekHoliday(selectedCourseId, w)" class="text-rose-700 font-sans font-bold">หยุด</span>
                  <span v-else class="text-emerald-800">{{ getWeekPresentCount(w) }}/{{ courseStudents.length }}</span>
                </td>
                <td colspan="5" class="border border-stone-300 px-2 py-1.5 text-center font-sans text-stone-500">
                  เฉลี่ยเข้าเรียน W{{ selectedWeek }}: {{ attendancePresentRate }}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>

    <!-- ========================================== -->
    <!-- MODAL: กำหนดวันหยุดราชการ (Holiday Modal) -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div
        v-if="showHolidayModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
        @click.self="showHolidayModal = false"
      >
        <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 my-auto animate-[bounceIn_0.25s_ease-out]">
          
          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <CalendarOff class="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 class="text-base font-black text-stone-900">
                  กำหนดวันหยุดราชการ: สัปดาห์ที่ {{ holidayTargetWeek }}
                </h3>
                <p class="text-xs text-stone-500 mt-0.5">
                  วิชา: {{ currentCourse?.name }}
                </p>
              </div>
            </div>
            <button
              @click="showHolidayModal = false"
              type="button"
              class="text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <XCircle class="w-5 h-5" />
            </button>
          </div>

          <!-- Info Description -->
          <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900 leading-relaxed space-y-1">
            <div class="font-bold flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4 text-rose-600" />
              สัปดาห์นี้จะถูกยกเว้นการหักคะแนนเข้าเรียน
            </div>
            <p class="text-rose-700 text-[11px]">
              เมื่อตั้งเป็นวันหยุดราชการ นักศึกษาทุกคนจะไม่ถูกหักคะแนนจิตพิสัย และระบบเช็คชื่อสัปดาห์นี้จะถูกปิดอัตโนมัติ
            </p>
          </div>

          <!-- Quick Presets -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-stone-700">
              เลือกประเภท / ชื่อวันหยุดด่วน:
            </label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="preset in holidayPresets"
                :key="preset"
                @click="holidayReason = preset"
                type="button"
                class="px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer"
                :class="holidayReason === preset 
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-bold' 
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'"
              >
                {{ preset }}
              </button>
            </div>
          </div>

          <!-- Custom Reason Input -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-700">
              หรือระบุชื่อวันหยุดเอง:
            </label>
            <input
              v-model="holidayReason"
              type="text"
              maxlength="60"
              class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-800"
              placeholder="เช่น วันหยุดราชการ, วันเฉลิมพระชนมพรรษา..."
              @keyup.enter="handleConfirmHoliday"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              @click="showHolidayModal = false"
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              @click="handleConfirmHoliday"
              type="button"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarOff class="w-3.5 h-3.5" />
              <span>ยืนยันตั้งเป็นวันหยุดราชการ</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Custom Confirm Modal (แทนที่ Browser Alert / Confirm) -->
    <ConfirmModal
      v-model="confirmModalState.isOpen"
      :title="confirmModalState.title"
      :message="confirmModalState.message"
      :type="confirmModalState.type"
      :confirmText="confirmModalState.confirmText"
      :cancelText="confirmModalState.cancelText"
      @confirm="handleConfirmDialogAction"
    />

  </div>
</template>

<style scoped>
.excel-th-vertical {
  height: 215px;
  vertical-align: bottom;
  padding: 10px 4px 8px;
  width: 58px;
  min-width: 54px;
  max-width: 68px;
}

.excel-vertical-text {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  max-height: 195px;
  max-width: 48px;
  overflow: hidden;
  text-align: left;
  line-height: 1.3;
  font-size: 11px;
  font-weight: 700;
  color: #1c1917;
  margin: 0 auto;
  word-break: break-word;
}

.excel-th-week-vertical {
  height: 98px;
  vertical-align: middle;
  padding: 8px 4px;
  width: 50px;
  min-width: 46px;
  max-width: 58px;
}

.excel-week-vertical-text {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  white-space: nowrap;
  text-align: center;
  line-height: 1.2;
  font-size: 11px;
  font-weight: 800;
  color: #1c1917;
  margin: 0 auto;
}

.excel-score-input::-webkit-outer-spin-button,
.excel-score-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.excel-score-input {
  -moz-appearance: textfield;
  appearance: textfield;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
