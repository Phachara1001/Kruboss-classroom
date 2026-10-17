<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authUser } from '@/data/authStore'
import { 
  attendanceStore, setAttendanceCheckIn, 
  checkInSessionsStore, openCheckInSession, closeCheckInSession,
  fetchCheckInSessions, fetchAttendance
} from '@/data/gradesStore'
import { 
  CheckCircle, XCircle, Clock, MousePointer2, 
  Settings, Power, AlertCircle 
} from '@lucide/vue'
import { addCoins } from '@/data/shopStore'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
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

// Session State
const sessionKey = computed(() => `${props.courseId}_${props.weekNumber}`)
const currentSession = computed(() => checkInSessionsStore.value[sessionKey.value])
const isSessionOpen = computed(() => currentSession.value?.isOpen)

// Student Attendance State
const studentAttendance = computed(() => {
  if (!authUser.value || isTeacher.value) return null
  const key = `${props.courseId}_${authUser.value.id}_${props.weekNumber}`
  return attendanceStore.value[key] || null
})

// --- Teacher Actions ---
const handleToggleSession = () => {
  if (isSessionOpen.value) {
    closeCheckInSession(props.courseId, props.weekNumber)
  } else {
    openCheckInSession(props.courseId, props.weekNumber)
  }
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
  
  setAttendanceCheckIn(props.courseId, authUser.value.id, props.weekNumber, status)
  addCoins(authUser.value.id, earnedCoins)
}

// Format duration
const getDuration = (startIso) => {
  const diff = Math.floor((currentTime.value - new Date(startIso)) / 1000) // seconds
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
      
      <div class="relative z-10 space-y-2 text-center md:text-left">
        <h2 class="text-2xl font-black flex items-center justify-center md:justify-start gap-2">
          <Settings class="w-6 h-6" /> แผงควบคุมระบบเช็คชื่อ (สัปดาห์ที่ {{ weekNumber }})
        </h2>
        <p class="text-gray-300 text-sm">
          สถานะปัจจุบัน: 
          <span v-if="isSessionOpen" class="text-emerald-400 font-bold animate-pulse">กำลังเปิดรับเช็คชื่อ</span>
          <span v-else-if="currentSession?.endTime" class="text-red-400 font-bold">ปิดระบบแล้ว</span>
          <span v-else class="text-amber-400 font-bold">ยังไม่เริ่ม</span>
        </p>
        <p v-if="isSessionOpen" class="text-emerald-200 text-sm font-mono mt-1">
          เวลาที่ผ่านไป: {{ getDuration(currentSession.startTime) }}
        </p>
      </div>
      
      <div class="relative z-10 shrink-0 text-center">
        <button 
          @click="handleToggleSession"
          :class="[isSessionOpen ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/50', 'px-8 py-4 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg']"
        >
          <Power class="w-5 h-5" /> 
          {{ isSessionOpen ? 'ปิดระบบเช็คชื่อ' : 'เปิดให้เช็คชื่อ' }}
        </button>
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
          <CheckCircle class="w-6 h-6" /> ระบบเช็คชื่อเข้าเรียน (สัปดาห์ที่ {{ weekNumber }})
        </h2>
        <p class="text-blue-100 text-sm">
          <template v-if="isSessionOpen">
            สถานะ: ครูเปิดให้เช็คชื่อแล้ว (เช็คชื่อภายใน 15 นาที เพื่อรับคะแนนตรงเวลา)
          </template>
          <template v-else-if="!currentSession">
            สถานะ: ครูยังไม่เปิดให้เช็คชื่อ
          </template>
          <template v-else>
            สถานะ: ครูปิดระบบเช็คชื่อแล้ว
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
