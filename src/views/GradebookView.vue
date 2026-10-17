<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
  TrendingUp, 
  ShieldCheck, 
  Shield, 
  RotateCcw, 
  Sparkles, 
  Info 
} from '@lucide/vue'
import { courses } from '../data/courses'
import { studentsList, courseClassrooms, isStudentInCourse, isStudent, fetchStudents } from '../data/studentsStore'
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
  fetchAllCourseData
} from '../data/gradesStore'
import { addCoins, deductCoins, getStudentCoins } from '../data/shopStore'
import { authUser } from '../data/authStore'

const route = useRoute()
const router = useRouter()

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

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

watch(studentClassroom, (room) => {
  if (!isTeacher.value && room) {
    selectedClassroom.value = room
  }
}, { immediate: true })

onMounted(async () => {
  await fetchAllCourseData(selectedCourseId.value)
  if (!isTeacher.value && studentClassroom.value) {
    selectedClassroom.value = studentClassroom.value
  }
  initDraftAssignmentScores()
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
  if (isTeacher.value) return courses
  const studentCourses = currentStudent.value?.courseIds || []
  if (studentCourses.length > 0) {
    return courses.filter(c => studentCourses.includes(c.id))
  }
  return courses
})

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
  return [...new Set([...roomsFromConfig, ...roomsFromData])].filter(Boolean)
})

// Students in this course & classroom (Locked to own classroom for students)
const courseStudents = computed(() => {
  const effectiveClassroom = isTeacher.value ? selectedClassroom.value : studentClassroom.value
  return studentsList.value.filter(s => {
    if (!isStudentInCourse(s, selectedCourseId.value)) return false
    if (!isStudent(s)) return false
    if (effectiveClassroom !== 'all' && s.classroom !== effectiveClassroom) return false

    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true

    return (s.name || '').toLowerCase().includes(query) || (s.studentId || '').includes(query)
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
  const key = `${selectedCourseId.value}_${studentId}_${week}`
  return attendanceStore.value[key] || { status: 'none', checkedAt: '-', note: 'ยังไม่ได้เช็คอิน' }
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
  if (courseStudents.value.length === 0) return 0
  let presentCount = 0
  courseStudents.value.forEach(s => {
    const rec = getAttendanceRecord(s.studentId, selectedWeek.value)
    if (rec.status === 'present' || rec.status === 'leave') presentCount++
  })
  return Math.round((presentCount / courseStudents.value.length) * 100)
})

// Feedback Message
const alertMessage = ref('')
const showAlert = (msg) => {
  alertMessage.value = msg
  setTimeout(() => { alertMessage.value = '' }, 2500)
}

// Draft Assignment Scores (กรอกคะแนนก่อน แล้วกดบันทึกทีเดียว)
const draftAssignmentScores = ref({})
const isSavingScores = ref(false)

const initDraftAssignmentScores = () => {
  const initial = {}
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
    const existing = raw[activeAssignment.value.id]
    initial[sId] = (existing !== undefined && existing !== null) ? existing : ''
  })
  draftAssignmentScores.value = initial
}

// Watchers to keep draft synchronized with selected assignment, course, classroom
watch([selectedAssignmentId, selectedCourseId, selectedClassroom], () => {
  initDraftAssignmentScores()
})

watch(courseStudents, () => {
  if (Object.keys(draftAssignmentScores.value).length === 0) {
    initDraftAssignmentScores()
  }
})

// Unsaved changes detection
const hasUnsavedAssignmentScores = computed(() => {
  return courseStudents.value.some(student => {
    const sId = student.studentId || student.id
    const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
    const saved = raw[activeAssignment.value.id]
    const draft = draftAssignmentScores.value[sId]
    
    const savedNum = (saved !== undefined && saved !== null) ? Number(saved) : null
    const draftNum = (draft !== '' && draft !== undefined && draft !== null && !isNaN(draft)) ? Number(draft) : null
    return savedNum !== draftNum
  })
})

const unsavedCount = computed(() => {
  return courseStudents.value.filter(student => {
    const sId = student.studentId || student.id
    const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
    const saved = raw[activeAssignment.value.id]
    const draft = draftAssignmentScores.value[sId]
    
    const savedNum = (saved !== undefined && saved !== null) ? Number(saved) : null
    const draftNum = (draft !== '' && draft !== undefined && draft !== null && !isNaN(draft)) ? Number(draft) : null
    return savedNum !== draftNum
  }).length
})

// Save All Scores at once (บันทึกคะแนนทีเดียว)
const saveAllAssignmentScores = async () => {
  if (!isTeacher.value) return
  isSavingScores.value = true
  try {
    let updatedCount = 0
    let totalCoinsGiven = 0
    const assignmentId = activeAssignment.value.id
    const maxScore = activeAssignment.value.maxScore

    for (const student of courseStudents.value) {
      const sId = student.studentId || student.id
      const raw = getStudentFullScore(selectedCourseId.value, sId)?.rawAssignments || {}
      const oldScore = (raw[assignmentId] !== undefined && raw[assignmentId] !== null) 
        ? Number(raw[assignmentId]) 
        : null
      const isFirstTime = oldScore === null || isNaN(oldScore)
      
      const draftVal = draftAssignmentScores.value[sId]
      if (draftVal === '' || draftVal === undefined || draftVal === null || isNaN(draftVal)) {
        continue
      }

      let val = parseFloat(draftVal)
      if (val < 0) val = 0
      if (val > maxScore) val = maxScore

      let shouldAwardCoins = false
      let coinsToAdd = 0

      if (isFirstTime && val > 0) {
        shouldAwardCoins = true
        coinsToAdd = Math.round(val * 4)
      } else if (oldScore !== null && val > oldScore) {
        shouldAwardCoins = true
        coinsToAdd = Math.round((val - oldScore) * 4)
      } else if (val > 0 && getStudentCoins(sId) <= 100) {
        // Recovery: ถ้าคะแนนมีแล้วแต่เหรียญยังติดอยู่ที่ 100 (เนื่องจากข้อผิดพลาดก่อนหน้า)
        shouldAwardCoins = true
        coinsToAdd = Math.round(val * 4)
      }

      if (oldScore !== val || shouldAwardCoins) {
        updatedCount++

        if (shouldAwardCoins && coinsToAdd > 0) {
          await addCoins(sId, coinsToAdd)
          totalCoinsGiven += coinsToAdd
        }

        await setAssignmentScore(selectedCourseId.value, sId, assignmentId, val)
      }
    }

    await fetchAllCourseData(selectedCourseId.value)
    await fetchStudents()
    initDraftAssignmentScores()

    if (updatedCount > 0) {
      let msg = `บันทึกคะแนนเรียบร้อย (${updatedCount} คน)`
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
const fillFullScoreForSubmitted = () => {
  if (!isTeacher.value) return
  let count = 0
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    if (getSubmission(student.studentId, activeAssignment.value.id)) {
      draftAssignmentScores.value[sId] = activeAssignment.value.maxScore
      count++
    }
  })
  if (count > 0) {
    showAlert(`ใส่คะแนนเต็ม (${activeAssignment.value.maxScore}) ให้นักศึกษาที่ส่งงานแล้ว ${count} คน (อย่าลืมกดบันทึกคะแนน)`)
  } else {
    showAlert('ยังไม่มีนักศึกษาที่ส่งงานในใบงานนี้')
  }
}

const resetDraftScores = () => {
  initDraftAssignmentScores()
  showAlert('รีเซ็ตค่าคะแนนกลับเป็นค่าที่บันทึกล่าสุด')
}

const handleGeneralScoreInput = (studentId, field, event, maxScore) => {
  if (!isTeacher.value) return
  let val = parseFloat(event.target.value)
  if (isNaN(val)) val = 0
  if (val > maxScore) val = maxScore
  if (val < 0) val = 0
  event.target.value = val
  updateGradeItem(selectedCourseId.value, studentId, field, val)
}

// Attendance Check-in action
const handleSetAttendance = (studentId, status) => {
  if (!isTeacher.value) return
  setAttendanceCheckIn(selectedCourseId.value, studentId, selectedWeek.value, status)
  showAlert('บันทึกการเช็คอินเรียบร้อย')
}

// Batch Check-in
const handleBatchAllPresent = () => {
  if (!isTeacher.value) return
  courseStudents.value.forEach(s => {
    setAttendanceCheckIn(selectedCourseId.value, s.studentId, selectedWeek.value, 'present')
  })
  showAlert(`เช็คชื่อ "มาเรียนตรงเวลา" ให้นักศึกษาทั้งหมด ${courseStudents.value.length} คนเรียบร้อยแล้ว`)
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

      <!-- Course & Classroom Dropdown Switcher -->
      <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
        <!-- Select Course -->
        <select 
          v-model="selectedCourseId"
          class="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-800 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
        >
          <option v-for="c in availableCourses" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.level }})
          </option>
        </select>

        <!-- Select Classroom (Teacher only) -->
        <select 
          v-if="isTeacher"
          v-model="selectedClassroom"
          class="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-800 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
        >
          <option value="all">ทุกห้องเรียน (ทั้งหมด)</option>
          <option v-for="room in availableClassrooms" :key="room" :value="room">
            ห้อง {{ room }}
          </option>
        </select>

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
            <span class="text-[10px] text-stone-300 block uppercase font-bold">นศ. ในชั้น</span>
            <span class="text-xl font-black text-white">{{ courseStudents.length }} คน</span>
          </div>
          <div class="text-center px-3 border-r border-white/20">
            <span class="text-[10px] text-stone-300 block uppercase font-bold">คะแนนเฉลี่ย</span>
            <span class="text-xl font-black text-emerald-400">{{ classAverageScore }}/100</span>
          </div>
          <div class="text-center px-3">
            <span class="text-[10px] text-stone-300 block uppercase font-bold">เข้าเรียนสัปดาห์นี้</span>
            <span class="text-xl font-black text-amber-400">{{ attendancePresentRate }}%</span>
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

      <!-- Quick Search input -->
      <div class="relative w-full sm:w-64">
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
          {{ isTeacher ? 'สามารถคลิกที่ช่องคะแนนความรับผิดชอบ, สอบกลางภาค, ปลายภาค เพื่อแก้ไขได้โดยตรง (บันทึกอัตโนมัติ)' : 'สรุปคะแนนสะสมและผลการเรียนในรายวิชา (โหมดดูข้อมูลเท่านั้น)' }}
        </span>
        <span>แสดง {{ courseStudents.length }} คน</span>
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
                    <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs overflow-hidden">
                      <img v-if="student.avatar && (student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.includes('localhost'))" 
                           :src="student.avatar.startsWith('http') ? student.avatar : (student.avatar.startsWith('data:') ? student.avatar : `http://${student.avatar.replace(/^http:\/\//, '')}`)" 
                           class="w-full h-full object-cover" />
                      <span v-else>{{ student.avatar }}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-stone-900 block">{{ student.name }}</span>
                        <span v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)" class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                          ตัวคุณ
                        </span>
                      </div>
                      <span class="text-stone-400 font-mono text-[10px]">{{ student.studentId }} • ห้อง {{ student.classroom }}</span>
                    </div>
                  </div>
                </td>

                <!-- 1. เข้าเรียน (10) - คำนวณอัตโนมัติจากการเช็คชื่อ -->
                <td class="py-3 px-3 text-center font-mono font-bold bg-emerald-50/30 border-x border-emerald-100" :title="'คำนวณจากการเข้าเรียนสัปดาห์ที่ 1 ถึง ' + totalRecordedWeeks">
                  <span :class="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore >= 8 ? 'text-emerald-700' : 'text-amber-700'">
                    {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore }}
                  </span>
                </td>

                <!-- 2. ความรับผิดชอบ (10) - แก้ไขได้เฉพาะอาจารย์ -->
                <td class="py-3 px-3 text-center bg-emerald-50/30 border-r border-emerald-100">
                  <input 
                    v-if="isTeacher"
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

                <!-- 4. สอบกลางภาค (20) - แก้ไขได้เฉพาะอาจารย์ -->
                <td class="py-3 px-3 text-center border-r border-stone-200">
                  <input 
                    v-if="isTeacher"
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

                <!-- 5. สอบปลายภาค (20) - แก้ไขได้เฉพาะอาจารย์ -->
                <td class="py-3 px-3 text-center border-r border-stone-200">
                  <input 
                    v-if="isTeacher"
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
    <!-- TAB 2: บันทึกคะแนนตามใบงาน (ASSIGNMENT SCORING) -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'assignments'" class="space-y-6">
      
      <!-- Assignment Selection Bar -->
      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-stone-900 text-sm">เลือกใบงานที่ต้องการลงคะแนน</h4>
            <p class="text-xs text-stone-500">{{ currentAssignments.length }} ใบงานในรายวิชานี้</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            v-for="a in currentAssignments"
            :key="a.id"
            @click="selectedAssignmentId = a.id"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer',
              selectedAssignmentId === a.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            ]"
          >
            {{ a.title.split(':')[0] }} ({{ a.maxScore }} คะแนน)
          </button>
        </div>
      </div>

      <!-- Current Selected Assignment Header Card -->
      <div class="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            {{ isTeacher ? 'กำลังลงคะแนนสำหรับ:' : 'กำลังดูคะแนนสำหรับ:' }}
          </span>
          <h4 class="text-base font-black text-emerald-950">{{ activeAssignment.title }}</h4>
          <span class="text-xs text-emerald-700">คะแนนเต็ม {{ activeAssignment.maxScore }} คะแนน</span>
        </div>

        <!-- Teacher Actions in Header -->
        <div v-if="isTeacher" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="fillFullScoreForSubmitted"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100/70 text-emerald-800 border border-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="กรอกคะแนนเต็มให้อัตโนมัติสำหรับทุกคนที่ส่งงานแล้ว"
          >
            <Sparkles class="w-3.5 h-3.5 text-amber-500" />
            <span>ใส่คะแนนเต็มผู้ส่งงาน</span>
          </button>
          
          <button
            type="button"
            @click="saveAllAssignmentScores"
            :disabled="isSavingScores"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
            title="บันทึกคะแนนทั้งหมดที่กรอกไว้"
          >
            <Save v-if="!isSavingScores" class="w-3.5 h-3.5" />
            <svg v-else class="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSavingScores ? 'กำลังบันทึก...' : 'บันทึกคะแนน' }}</span>
            <span v-if="unsavedCount > 0" class="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black">
              {{ unsavedCount }}
            </span>
          </button>
        </div>
        <span v-else class="px-3 py-1 bg-white text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 shadow-xs">
          คะแนนเก็บสะสมในส่วน 40 คะแนน
        </span>
      </div>

      <!-- Assignment Scoring Table -->
      <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs text-stone-700">
          <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">ลำดับ</th>
              <th class="py-3.5 px-4">นักศึกษา</th>
              <th class="py-3.5 px-4">รหัสนักศึกษา</th>
              <th class="py-3.5 px-4">ห้องเรียน</th>
              <th class="py-3.5 px-4 text-center">คะแนนที่ได้ (เต็ม {{ activeAssignment.maxScore }})</th>
              <th class="py-3.5 px-4 text-center">สถานะการส่งงาน</th>
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
              <td class="py-3 px-4 text-center text-stone-400 font-mono">{{ index + 1 }}</td>
              <td class="py-3 px-4 font-bold text-stone-900">
                <div class="flex items-center gap-1.5">
                  <span>{{ student.name }}</span>
                  <span v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)" class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                    ตัวคุณ
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 font-mono text-stone-600">{{ student.studentId }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded bg-stone-100 font-bold text-[11px]">{{ student.classroom }}</span>
              </td>
              
              <!-- Score Input (Teacher) / Score Badge (Student) -->
              <td class="py-3 px-4 text-center">
                <div v-if="isTeacher" class="inline-flex items-center gap-2">
                  <input 
                    type="number"
                    step="0.5"
                    min="0"
                    :max="activeAssignment.maxScore"
                    v-model="draftAssignmentScores[student.studentId || student.id]"
                    @keydown.enter="saveAllAssignmentScores"
                    placeholder="-"
                    class="w-20 px-3 py-1.5 text-center font-mono font-bold bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                    :class="{ 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300': (draftAssignmentScores[student.studentId || student.id] !== '' && draftAssignmentScores[student.studentId || student.id] !== undefined && Number(draftAssignmentScores[student.studentId || student.id]) !== (getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[activeAssignment.id] ?? null)) }"
                  />
                  <span class="text-stone-400 text-xs">/ {{ activeAssignment.maxScore }}</span>
                </div>
                <div v-else class="inline-flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm">
                  <span class="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800">
                    {{ getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[activeAssignment.id] || 0 }}
                  </span>
                  <span class="text-stone-400 text-xs">/ {{ activeAssignment.maxScore }}</span>
                </div>
              </td>

              <!-- Status Badge -->
              <td class="py-3 px-4 text-center">
                <div class="flex flex-col items-center gap-1.5">
                  <!-- ตรวจให้คะแนนแล้ว -->
                  <span 
                    v-if="(getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[activeAssignment.id] || 0) > 0"
                    class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> ตรวจแล้ว
                  </span>

                  <!-- ลิงก์ดูงาน (ถ้ามี) -->
                  <a v-if="getSubmission(student.studentId, activeAssignment.id)"
                     :href="getSubmission(student.studentId, activeAssignment.id).link"
                     target="_blank"
                     class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                  >
                    <Search class="w-3.5 h-3.5" /> ดูงาน (Link)
                  </a>
                  
                  <!-- ยังไม่มีอะไรเลย -->
                  <span 
                    v-if="!getSubmission(student.studentId, activeAssignment.id) && (getStudentFullScore(selectedCourseId, student.studentId).rawAssignments[activeAssignment.id] || 0) === 0"
                    class="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 font-semibold text-[11px]"
                  >
                    รอส่งงาน
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table Footer / Action Bar for Teacher -->
        <div v-if="isTeacher" class="p-4 bg-stone-50/80 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs">
            <span v-if="hasUnsavedAssignmentScores" class="inline-flex items-center gap-1.5 text-amber-800 font-bold bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              มีการแก้ไขคะแนน {{ unsavedCount }} รายการที่ยังไม่ได้บันทึก
            </span>
            <span v-else class="text-stone-500 font-medium">
              💡 กรอกคะแนนลงในตารางให้ครบทุกคน แล้วกดปุ่ม "บันทึกคะแนน" ด้านขวา
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
    <!-- TAB 3: เช็คชื่อการเข้าเรียนรายสัปดาห์ (WEEKLY ATTENDANCE) -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'attendance'" class="space-y-6">
      
      <!-- Week Selection & Quick Actions -->
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <!-- Week Buttons -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Calendar class="w-4 h-4 text-blue-600" />
            เลือกรอบสัปดาห์ที่เช็คชื่อ (สัปดาห์ที่ 1 - {{ totalCourseWeeks }})
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="w in totalCourseWeeks"
              :key="w"
              @click="selectedWeek = w"
              :class="[
                'w-10 h-10 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer',
                selectedWeek === w
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              ]"
            >
              W{{ w }}
            </button>
          </div>
        </div>

        <!-- Quick Batch Check-in (Teacher Only) -->
        <div v-if="isTeacher" class="flex items-center gap-2 self-stretch md:self-auto">
          <button
            @click="handleBatchAllPresent"
            class="w-full md:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserCheck class="w-4 h-4" />
            <span>มาเรียนตรงเวลาทุกคน (Quick Check-in)</span>
          </button>
        </div>

      </div>

      <!-- Warning / Deduction Policy Alert Banner -->
      <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <AlertCircle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong class="font-bold">กติกาการเช็คอินและการหักคะแนน:</strong>
          ระบบจิตพิสัยการเข้าเรียนมีคะแนนเต็ม <strong>10 คะแนน</strong>
          <ul class="list-disc pl-5 mt-1 space-y-0.5 text-amber-800">
            <li><strong>มาเรียนตรงเวลา (Present):</strong> เช็คอินก่อน {{ checkInTimeLimit }} ได้คะแนนเต็ม 100%</li>
            <li><strong>มาสาย (Late):</strong> เช็คอินหลังเวลาที่กำหนด ได้คะแนน 80% (หัก 0.2 คะแนนต่อครั้ง)</li>
            <li><strong>ขาดเรียน / ไม่เข้าเช็คอิน (Absent):</strong> ไม่ได้คะแนนในสัปดาห์นั้น (หักคะแนนจิตพิสัย)</li>
            <li><strong>ลากิจ/ลาป่วย (Leave):</strong> ยื่นใบลาพร้อมเหตุผล ได้รับการยกเว้นไม่หักคะแนน</li>
          </ul>
        </div>
      </div>

      <!-- Attendance Check-in Table -->
      <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-stone-100 flex items-center justify-between">
          <h4 class="font-bold text-sm text-stone-800 flex items-center gap-2">
            <Clock class="w-4 h-4 text-blue-600" />
            บันทึกการเข้าเรียน: สัปดาห์ที่ {{ selectedWeek }}
          </h4>
          <span class="text-xs text-stone-400">
            {{ isTeacher ? 'คลิกสถานะเพื่อปรับเปลี่ยนการเช็คอิน' : 'สรุปการเข้าเรียนประจำสัปดาห์ (ดูได้อย่างเดียว)' }}
          </span>
        </div>

        <table class="w-full text-left text-xs text-stone-700">
          <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">ลำดับ</th>
              <th class="py-3.5 px-4">นักศึกษา</th>
              <th class="py-3.5 px-4">รหัส / ห้อง</th>
              <th class="py-3.5 px-4 text-center">{{ isTeacher ? 'สถานะการเช็คอิน (คลิกเพื่อเลือก)' : 'สถานะการเช็คอิน' }}</th>
              <th class="py-3.5 px-4 text-center">เวลาที่เช็ค</th>
              <th class="py-3.5 px-4 text-center">คะแนนสะสมเข้าเรียน</th>
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
              <td class="py-3 px-4 text-center text-stone-400 font-mono">{{ index + 1 }}</td>
              <td class="py-3 px-4 font-bold text-stone-900">
                <div class="flex items-center gap-1.5">
                  <span>{{ student.name }}</span>
                  <span v-if="!isTeacher && (student.studentId === authUser?.studentId || student.studentId === authUser?.id)" class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                    ตัวคุณ
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 font-mono text-stone-500">{{ student.studentId }} ({{ student.classroom }})</td>

              <!-- Status Action Buttons Group (Teacher) / Read-only Badges (Student) -->
              <td class="py-3 px-4 text-center">
                <!-- Student Read-only Badges -->
                <div v-if="!isTeacher" class="inline-flex items-center justify-center">
                  <span 
                    v-if="getAttendanceRecord(student.studentId, selectedWeek).status === 'present'"
                    class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1 border border-emerald-200"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> มาเรียนตรงเวลา
                  </span>
                  <span 
                    v-else-if="getAttendanceRecord(student.studentId, selectedWeek).status === 'late'"
                    class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs inline-flex items-center gap-1 border border-amber-200"
                  >
                    <Clock class="w-3.5 h-3.5 text-amber-600" /> มาสาย
                  </span>
                  <span 
                    v-else-if="getAttendanceRecord(student.studentId, selectedWeek).status === 'leave'"
                    class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs inline-flex items-center gap-1 border border-blue-200"
                  >
                    <FileText class="w-3.5 h-3.5 text-blue-600" /> ลา
                  </span>
                  <span 
                    v-else-if="getAttendanceRecord(student.studentId, selectedWeek).status === 'absent'"
                    class="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs inline-flex items-center gap-1 border border-red-200"
                  >
                    <XCircle class="w-3.5 h-3.5 text-red-600" /> ขาดเรียน
                  </span>
                  <span 
                    v-else
                    class="px-3 py-1 rounded-full bg-stone-100 text-stone-500 font-medium text-xs inline-flex items-center gap-1 border border-stone-200"
                  >
                    ยังไม่เช็คอิน
                  </span>
                </div>

                <!-- Teacher Interactive Buttons -->
                <div v-else class="inline-flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
                  <!-- Present -->
                  <button 
                    type="button"
                    @click="handleSetAttendance(student.studentId, 'present')"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                      getAttendanceRecord(student.studentId, selectedWeek).status === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-white'
                    ]"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" /> มาเรียน
                  </button>

                  <!-- Late -->
                  <button 
                    type="button"
                    @click="handleSetAttendance(student.studentId, 'late')"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                      getAttendanceRecord(student.studentId, selectedWeek).status === 'late'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-white'
                    ]"
                  >
                    <Clock class="w-3.5 h-3.5" /> สาย
                  </button>

                  <!-- Leave -->
                  <button 
                    type="button"
                    @click="handleSetAttendance(student.studentId, 'leave')"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                      getAttendanceRecord(student.studentId, selectedWeek).status === 'leave'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-white'
                    ]"
                  >
                    <FileText class="w-3.5 h-3.5" /> ลา
                  </button>

                  <!-- Absent (ขาดเรียน / ไม่เข้าเช็คอิน) -->
                  <button 
                    type="button"
                    @click="handleSetAttendance(student.studentId, 'absent')"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                      getAttendanceRecord(student.studentId, selectedWeek).status === 'absent'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-white text-red-600'
                    ]"
                  >
                    <XCircle class="w-3.5 h-3.5" /> ขาดเรียน
                  </button>
                </div>
              </td>

              <!-- Checked At -->
              <td class="py-3 px-4 text-center font-mono text-xs text-stone-500">
                {{ getAttendanceRecord(student.studentId, selectedWeek).checkedAt }}
              </td>

              <!-- Current Total Attendance Score Out of 10 -->
              <td class="py-3 px-4 text-center font-mono font-black text-sm">
                <span :class="getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore >= 8 ? 'text-emerald-600' : 'text-red-600'">
                  {{ getStudentFullScore(selectedCourseId, student.studentId, totalRecordedWeeks).attendanceScore }}
                </span>
                <span class="text-stone-400 text-xs">/10</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<style scoped>
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
