<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { X, CheckCircle2, Search, Link as LinkIcon, User, RefreshCw, Save, Sparkles, Coins, FlaskConical } from '@lucide/vue'
import { studentsList, isStudentInCourse, isStudent, fetchStudents } from '@/data/studentsStore'
import { addCoins, getStudentCoins } from '@/data/shopStore'
import { 
  getStudentFullScore, 
  setAssignmentScore, 
  submissionsStore,
  fetchSubmissions,
  fetchGrades,
  formatExternalUrl
} from '@/data/gradesStore'
import { triggerTestReward } from '@/data/rewardNotificationStore'

const props = defineProps({
  isOpen: Boolean,
  courseId: String,
  assignmentId: String,
  assignmentTitle: String,
  maxScore: { type: Number, default: 10 }
})

const emit = defineEmits(['close'])

const isRefreshing = ref(false)
const isSaving = ref(false)
const saveSuccessMessage = ref('')
const draftScores = ref({})

const courseStudents = computed(() => {
  return studentsList.value.filter(s => isStudentInCourse(s, props.courseId) && isStudent(s))
})

const initDraftScores = () => {
  const initial = {}
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    const full = getStudentFullScore(props.courseId, sId)
    const existing = full?.rawAssignments?.[props.assignmentId]
    initial[sId] = existing !== undefined && existing !== null ? existing : ''
  })
  draftScores.value = initial
}

const loadData = async () => {
  if (!props.courseId) return
  isRefreshing.value = true
  try {
    await Promise.allSettled([
      fetchSubmissions(props.courseId),
      fetchGrades(props.courseId),
      fetchStudents()
    ])
    initDraftScores()
  } finally {
    isRefreshing.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    saveSuccessMessage.value = ''
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.isOpen) {
    loadData()
  }
})

// Auto init when students change
watch(courseStudents, () => {
  if (Object.keys(draftScores.value).length === 0) {
    initDraftScores()
  }
})

const getSubmission = (studentOrId) => {
  if (!studentOrId) return null
  const studentId = typeof studentOrId === 'object' ? (studentOrId.studentId || studentOrId.id) : studentOrId
  const fallbackId = typeof studentOrId === 'object' ? studentOrId.id : null
  
  const key1 = `${props.courseId}_${studentId}_${props.assignmentId}`
  if (submissionsStore.value?.[key1]) return submissionsStore.value[key1]
  
  if (fallbackId && String(fallbackId) !== String(studentId)) {
    const key2 = `${props.courseId}_${fallbackId}_${props.assignmentId}`
    if (submissionsStore.value?.[key2]) return submissionsStore.value[key2]
  }
  return null
}

// Quick action: Pre-fill full score for students who submitted
const fillFullScoreForSubmitted = () => {
  courseStudents.value.forEach(student => {
    const sId = student.studentId || student.id
    if (getSubmission(student)) {
      draftScores.value[sId] = props.maxScore
    }
  })
}

// Unsaved changes detector
const hasUnsavedChanges = computed(() => {
  return courseStudents.value.some(student => {
    const sId = student.studentId || student.id
    const rawAssignments = getStudentFullScore(props.courseId, sId)?.rawAssignments || {}
    const currentSaved = rawAssignments[props.assignmentId]
    const draft = draftScores.value[sId]
    
    const currentNum = currentSaved !== undefined && currentSaved !== null ? Number(currentSaved) : null
    const draftNum = draft !== '' && draft !== undefined && draft !== null && !isNaN(draft) ? Number(draft) : null
    
    return currentNum !== draftNum
  })
})

// Save all modified scores at once
const saveAllScores = async () => {
  isSaving.value = true
  saveSuccessMessage.value = ''
  try {
    let updatedCount = 0
    let totalCoinsGiven = 0

    for (const student of courseStudents.value) {
      const sId = student.studentId || student.id
      const rawAssignments = getStudentFullScore(props.courseId, sId)?.rawAssignments || {}
      const oldScore = (rawAssignments[props.assignmentId] !== undefined && rawAssignments[props.assignmentId] !== null) 
        ? Number(rawAssignments[props.assignmentId]) 
        : null
      const isFirstTime = oldScore === null || isNaN(oldScore)
      
      const draftVal = draftScores.value[sId]
      if (draftVal === '' || draftVal === undefined || draftVal === null || isNaN(draftVal)) {
        continue
      }

      let val = parseFloat(draftVal)
      if (val < 0) val = 0
      if (val > props.maxScore) val = props.maxScore

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

        await setAssignmentScore(props.courseId, sId, props.assignmentId, val)
      }
    }

    await fetchGrades(props.courseId)
    await fetchStudents()
    initDraftScores()

    if (updatedCount > 0) {
      let msg = `บันทึกคะแนนเรียบร้อย (${updatedCount} คน)`
      if (totalCoinsGiven > 0) {
        msg += ` พร้อมมอบ ${totalCoinsGiven} Coins สำเร็จ`
      }
      saveSuccessMessage.value = msg
    } else {
      saveSuccessMessage.value = 'บันทึกคะแนนเรียบร้อยแล้ว'
    }

    setTimeout(() => {
      saveSuccessMessage.value = ''
    }, 4500)
  } catch (err) {
    console.error('Error saving scores:', err)
  } finally {
    isSaving.value = false
  }
}

const handleTestRewardModal = () => {
  triggerTestReward({
    coins: Math.round((props.maxScore || 10) * 4),
    assignmentTitle: props.assignmentTitle || 'ใบงานที่ตรวจ',
    courseName: props.courseId || 'รายวิชา',
    score: props.maxScore || 10,
    maxScore: props.maxScore || 10
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      @click="emit('close')"
    ></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 class="w-6 h-6 text-indigo-200" />
            ตรวจงาน: {{ assignmentTitle }}
          </h2>
          <p class="text-indigo-200 text-sm mt-1">คะแนนเต็ม {{ maxScore }} คะแนน</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Test Reward Modal button -->
          <button 
            type="button"
            @click="handleTestRewardModal"
            class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/40 font-bold text-xs transition-colors cursor-pointer mr-1"
            title="ทดสอบดูหน้าต่างแจ้งเตือนเหรียญรางวัลที่จะแสดงให้นักเรียนเห็น"
          >
            <FlaskConical class="w-3.5 h-3.5 text-amber-300" />
            <span>ทดสอบ Modal เหรียญ</span>
          </button>

          <!-- Quick button to fill full scores -->
          <button 
            type="button"
            @click="fillFullScoreForSubmitted"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer mr-1"
            title="กรอกคะแนนเต็มให้อัตโนมัติสำหรับทุกคนที่ส่งงานแล้ว"
          >
            <Sparkles class="w-3.5 h-3.5 text-amber-300" /> ใส่คะแนนเต็มผู้ส่งงาน
          </button>

          <!-- Quick Save Button in Header -->
          <button 
            type="button"
            @click="saveAllScores"
            :disabled="isSaving"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="บันทึกคะแนนทั้งหมด"
          >
            <Save class="w-3.5 h-3.5" />
            <span>{{ isSaving ? 'กำลังบันทึก...' : 'บันทึกคะแนน' }}</span>
          </button>
          
          <button 
            @click="loadData"
            :disabled="isRefreshing"
            class="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" />
          </button>
          <button 
            @click="emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Body: Student List -->
      <div class="p-6 overflow-y-auto bg-stone-50/50 flex-1">
        <div class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <table class="w-full text-sm text-left">
            <thead class="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
              <tr>
                <th class="py-3 px-4 w-12 text-center">#</th>
                <th class="py-3 px-4">ชื่อ-สกุล</th>
                <th class="py-3 px-4 text-center">ห้อง</th>
                <th class="py-3 px-4 text-center">งานที่ส่ง</th>
                <th class="py-3 px-4 text-center w-40">ให้คะแนน</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr 
                v-for="(student, index) in courseStudents" 
                :key="student.id"
                class="hover:bg-stone-50 transition-colors"
              >
                <td class="py-3 px-4 text-center text-stone-400 font-mono">{{ index + 1 }}</td>
                <td class="py-3 px-4 font-bold text-stone-900">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <User class="w-4 h-4" />
                    </div>
                    <div>
                      <div>{{ student.name }}</div>
                      <div class="text-xs text-stone-500 font-mono mt-0.5">{{ student.studentId }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="px-2 py-0.5 rounded bg-stone-100 font-bold text-[11px]">{{ student.classroom }}</span>
                </td>
                
                <td class="py-3 px-4 text-center">
                  <a v-if="getSubmission(student)"
                     :href="formatExternalUrl(getSubmission(student).link)"
                     target="_blank"
                     rel="noopener noreferrer"
                     class="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LinkIcon class="w-3.5 h-3.5" /> ดูผลงาน
                  </a>
                  <span v-else class="text-stone-400 text-xs font-medium">ยังไม่ส่งงาน</span>
                </td>

                <td class="py-3 px-4 text-center">
                  <div class="inline-flex items-center gap-2 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:bg-white transition-all">
                    <input 
                      type="number"
                      step="0.5"
                      min="0"
                      :max="maxScore"
                      v-model="draftScores[student.studentId || student.id]"
                      @keydown.enter="saveAllScores"
                      placeholder="-"
                      class="w-14 text-center font-mono font-bold bg-transparent text-sm outline-none"
                    />
                    <span class="text-stone-400 text-xs">/ {{ maxScore }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer: Save & Close Controls -->
      <div class="px-6 py-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-2 text-xs">
          <span v-if="saveSuccessMessage" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" /> {{ saveSuccessMessage }}
          </span>
          <span v-else-if="hasUnsavedChanges" class="inline-flex items-center gap-1.5 text-amber-700 font-medium">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            มีการแก้ไขคะแนนที่ยังไม่ได้บันทึก
          </span>
          <span v-else class="text-stone-400">
            กรอกคะแนนในตารางให้เรียบร้อย แล้วกดปุ่ม "บันทึกคะแนน"
          </span>
        </div>

        <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button 
            @click="emit('close')"
            type="button"
            class="px-5 py-2.5 rounded-xl font-bold text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          >
            ปิด
          </button>
          <button 
            @click="saveAllScores"
            :disabled="isSaving"
            class="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save v-if="!isSaving" class="w-4 h-4" />
            <svg v-else class="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSaving ? 'กำลังบันทึก...' : 'บันทึกคะแนน' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
