<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { authUser } from '@/data/authStore'
import { 
  attendanceStore, setAttendanceCheckIn, 
  checkInSessionsStore, openCheckInSession, closeCheckInSession, cancelCheckInSession,
  fetchCheckInSessions, fetchAttendance
} from '@/data/gradesStore'
import { courses } from '@/data/courses'
import { 
  CheckCircle, XCircle, Clock, MousePointer2, 
  Settings, Power, AlertCircle, RotateCcw, Calendar
} from '@lucide/vue'
import { addCoins } from '@/data/shopStore'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  weekNumber: {
    type: Number,
    default: 1
  }
})

// State
const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const checkInMessage = ref('')
const currentTime = ref(new Date())
let timerInterval = null

// Determine total weeks based on course
const currentCourse = computed(() => courses.find(c => c.id === props.courseId))
const totalWeeks = computed(() => {
  if (currentCourse.value?.levelGroup === 'ปวส.') return 15
  return 18
})

// Selected week by teacher (default to props.weekNumber or 1)
const selectedWeek = ref(props.weekNumber || 1)

// Find any currently open session for this course
const openSessionEntry = computed(() => {
  for (let w = 1; w <= totalWeeks.value; w++) {
    const key = `${props.courseId}_${w}`
    if (checkInSessionsStore.value[key]?.isOpen) {
      return { week: w, session: checkInSessionsStore.value[key] }
    }
  }
  return null
})

// Active week to display/operate on:
// If there is an open session, use that week; otherwise use selectedWeek
const activeWeek = computed(() => {
  if (openSessionEntry.value) {
    return openSessionEntry.value.week
  }
  return selectedWeek.value
})

// Current Session State
const currentSessionKey = computed(() => `${props.courseId}_${activeWeek.value}`)
const currentSession = computed(() => checkInSessionsStore.value[currentSessionKey.value])
const isSessionOpen = computed(() => !!currentSession.value?.isOpen)

// Keep selectedWeek in sync with active open session if any
watch(openSessionEntry, (newVal) => {
  if (newVal) {
    selectedWeek.value = newVal.week
  }
}, { immediate: true })

// Helper: check week status label for dropdown
const getWeekStatusText = (w) => {
  const key = `${props.courseId}_${w}`
  const sess = checkInSessionsStore.value[key]
  if (sess?.isOpen) return '(กำลังเปิดเช็คชื่อ)'
  if (sess?.endTime) return '(เคยบันทึกแล้ว)'
  return '(ยังไม่เคยเช็ค)'
}

// Student Attendance State for active week
const studentAttendance = computed(() => {
  if (!authUser.value || isTeacher.value) return null
  const key = `${props.courseId}_${authUser.value.id}_${activeWeek.value}`
  return attendanceStore.value[key] || null
})

// --- Teacher Actions ---
// 1. Normal toggle (Open or Close & Save absent)
const handleToggleSession = async () => {
  if (isSessionOpen.value) {
    await closeCheckInSession(props.courseId, activeWeek.value)
  } else {
    await openCheckInSession(props.courseId, selectedWeek.value)
  }
}

// 2. Close without saving (Cancel & Reset attendance, students keep coins)
const handleCancelWithoutSaving = async () => {
  if (!confirm(`ยืนยัน "ปิดแบบไม่บันทึก" ของสัปดาห์ที่ ${activeWeek.value} ใช่หรือไม่?\n\nระบบจะรีเซ็ตสถานะการเช็คชื่อของรอบนี้ แต่นักเรียนที่ได้เหรียญไปแล้วจะไม่ถูกดึงเหรียญคืน`)) {
    return
  }
  await cancelCheckInSession(props.courseId, activeWeek.value)
}

// --- Student Actions ---
const handleStudentCheckIn = () => {
  if (!authUser.value || isTeacher.value || !isSessionOpen.value) return
  
  const now = new Date()
  const startTime = new Date(currentSession.value.startTime)
  const diffMinutes = Math.floor((now - startTime) / 60000)
  
  // Rule: <= 15 mins = Present, > 15 mins = Late
  let status = 'present'
  let earnedCoins = 0
  if (diffMinutes > 15) {
    status = 'late'
    earnedCoins = 10
    checkInMessage.value = `เช็คอินสำเร็จ (สถานะ: สาย ${diffMinutes} นาที) ได้รับ +${earnedCoins} Coins`
  } else {
    earnedCoins = 20
    checkInMessage.value = `เช็คอินสำเร็จ (สถานะ: ตรงเวลา) ได้รับ +${earnedCoins} Coins`
  }
  
  setAttendanceCheckIn(props.courseId, authUser.value.id, activeWeek.value, status)
  addCoins(authUser.value.id, earnedCoins)
}

// Format duration
const getDuration = (startIso) => {
  if (!startIso) return '0 นาที 0 วินาที'
  const diff = Math.floor((currentTime.value - new Date(startIso)) / 1000)
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${m} นาที ${s} วินาที`
}

onMounted(() => {
  fetchCheckInSessions(props.courseId)
  fetchAttendance(props.courseId)
  timerInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="animate-[fadeIn_0.4s_ease-out]">
    <!-- ================= TEACHER VIEW ================= -->
    <div v-if="isTeacher" class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      
      <!-- Background Graphic -->
      <div class="absolute -right-10 -top-10 opacity-10 pointer-events-none">
        <Settings class="w-48 h-48 animate-spin-slow" />
      </div>
      
      <div class="relative z-10 space-y-3 text-center md:text-left flex-1">
        <div class="flex items-center justify-center md:justify-start gap-2 flex-wrap">
          <h2 class="text-2xl font-black flex items-center gap-2">
            <Settings class="w-6 h-6 text-orange-400" /> แผงควบคุมระบบเช็คชื่อ
          </h2>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-orange-200">
            สัปดาห์ที่ {{ activeWeek }}
          </span>
        </div>

        <!-- Week Selector (Before opening session) -->
        <div v-if="!isSessionOpen" class="flex flex-wrap items-center gap-2.5 pt-1">
          <label class="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <Calendar class="w-4 h-4 text-orange-400" />
            <span>เลือกสัปดาห์ที่ต้องการเปิดเช็ค:</span>
          </label>
          <select 
            v-model="selectedWeek" 
            class="px-3.5 py-1.5 bg-gray-800 text-white border border-gray-600 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-inner"
          >
            <option v-for="w in totalWeeks" :key="w" :value="w">
              สัปดาห์ที่ {{ w }} {{ getWeekStatusText(w) }}
            </option>
          </select>
        </div>
        
        <p class="text-gray-300 text-sm">
          สถานะปัจจุบัน: 
          <span v-if="isSessionOpen" class="text-emerald-400 font-bold animate-pulse">
            กำลังเปิดรับเช็คชื่อ (สัปดาห์ที่ {{ activeWeek }})
          </span>
          <span v-else-if="currentSession?.endTime" class="text-red-400 font-bold">
            ปิดระบบแล้ว (สัปดาห์ที่ {{ activeWeek }})
          </span>
          <span v-else class="text-amber-400 font-bold">
            พร้อมเปิดระบบ (สัปดาห์ที่ {{ activeWeek }})
          </span>
        </p>

        <p v-if="isSessionOpen" class="text-emerald-200 text-sm font-mono flex items-center gap-2">
          <Clock class="w-4 h-4 animate-spin text-emerald-400" />
          <span>เวลาที่เปิดไปแล้ว: {{ getDuration(currentSession?.startTime) }}</span>
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="relative z-10 shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 text-center">
        <!-- 1. Open Button (When closed) -->
        <button 
          v-if="!isSessionOpen"
          @click="handleToggleSession"
          class="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/50 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <Power class="w-5 h-5" /> 
          <span>เปิดให้เช็คชื่อ (สัปดาห์ที่ {{ selectedWeek }})</span>
        </button>

        <!-- 2. Dual Action Buttons (When open) -->
        <template v-else>
          <!-- Button A: Close & Save Absent -->
          <button 
            @click="handleToggleSession"
            class="px-6 py-3.5 bg-red-500 hover:bg-red-600 shadow-red-500/50 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Power class="w-4 h-4" /> 
            <span>ปิดระบบและบันทึกคะแนน</span>
          </button>

          <!-- Button B: Close without saving (Cancel & Reset) -->
          <button 
            @click="handleCancelWithoutSaving"
            class="px-6 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-sm"
            title="ยกเลิกการเช็คชื่อรอบนี้และรีเซ็ตสถานะนักเรียนกลับเป็นยังไม่เช็ค (เหรียญ Coins ยังคงให้นักเรียน)"
          >
            <RotateCcw class="w-4 h-4" /> 
            <span>ปิดแบบไม่บันทึก (รีเซ็ต)</span>
          </button>
          
          <span class="text-[10px] text-gray-400 max-w-[220px] leading-tight">
            * ปิดแบบไม่บันทึก: รีเซ็ตสถานะรอบนี้ แต่นักเรียนจะได้รับเหรียญไปเลย
          </span>
        </template>
      </div>
    </div>

    <!-- ================= STUDENT VIEW ================= -->
    <div v-else class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      
      <!-- Background Graphic -->
      <div class="absolute -right-10 -top-10 opacity-20 pointer-events-none">
        <Clock class="w-48 h-48" />
      </div>
      
      <div class="relative z-10 space-y-2 text-center md:text-left">
        <h2 class="text-2xl font-black flex items-center justify-center md:justify-start gap-2">
          <CheckCircle class="w-6 h-6" /> ระบบเช็คชื่อเข้าเรียน (สัปดาห์ที่ {{ activeWeek }})
        </h2>
        <p class="text-blue-100 text-sm">
          <template v-if="isSessionOpen">
            สถานะ: ครูเปิดให้เช็คชื่อแล้ว (เช็คชื่อภายใน 15 นาที เพื่อรับคะแนนตรงเวลา)
          </template>
          <template v-else-if="!currentSession">
            สถานะ: ครูยังไม่เปิดให้เช็คชื่อ (รอครูเปิดระบบ)
          </template>
          <template v-else>
            สถานะ: ครูปิดระบบเช็คชื่อของสัปดาห์นี้แล้ว
          </template>
        </p>
      </div>
      
      <div class="relative z-10 shrink-0 text-center">
        <!-- Not Checked In Yet -->
        <div v-if="!studentAttendance">
          <button 
            v-if="isSessionOpen"
            @click="handleStudentCheckIn"
            class="px-8 py-4 bg-white text-blue-700 font-black rounded-2xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer"
          >
            <MousePointer2 class="w-5 h-5" /> กดเช็คชื่อเข้าเรียน
          </button>
          <div v-else-if="currentSession?.endTime" class="bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-2xl p-4 text-red-200 font-bold flex items-center justify-center gap-2">
            <XCircle class="w-5 h-5" /> หมดเวลาเช็คชื่อ (ขาดเรียน)
          </div>
          <div v-else class="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 text-white font-bold flex items-center justify-center gap-2">
            <Clock class="w-5 h-5 animate-pulse" /> รอครูเปิดระบบ...
          </div>
        </div>

        <!-- Already Checked In -->
        <div v-else class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div v-if="studentAttendance.status === 'present'" class="flex items-center gap-2 text-emerald-300 font-bold text-lg">
            <CheckCircle class="w-6 h-6" /> เช็คอินเรียบร้อย (ตรงเวลา)
          </div>
          <div v-else-if="studentAttendance.status === 'late'" class="flex items-center gap-2 text-amber-300 font-bold text-lg">
            <Clock class="w-6 h-6" /> เช็คอินเรียบร้อย (สาย)
          </div>
          <div v-else-if="studentAttendance.status === 'absent'" class="flex items-center gap-2 text-red-300 font-bold text-lg">
            <XCircle class="w-6 h-6" /> ขาดเรียน (หักคะแนน)
          </div>
          <p class="text-xs text-white/70 mt-1">บันทึกเมื่อ: {{ studentAttendance.checkedAt }}</p>
        </div>
        
        <p v-if="checkInMessage" class="mt-3 text-sm font-bold text-emerald-200 animate-pulse">{{ checkInMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
