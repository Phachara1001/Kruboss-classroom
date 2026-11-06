<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Coins, Users, Search, Plus, Minus, ArrowLeft, FileText } from '@lucide/vue'
import { studentsList, getAvatarInitial, isStudent } from '../data/studentsStore'
import { getStudentCoins, addCoins, deductCoins } from '../data/shopStore'
import StudentAvatar from '@/components/StudentAvatar.vue'

const router = useRouter()

// State
const selectedClassroom = ref(null)
const searchQuery = ref('')
const coinAdjustAmount = ref(10)

// Computed
const classrooms = computed(() => {
  const rooms = new Set(studentsList.value.filter(s => isStudent(s)).map(s => s.classroom).filter(Boolean))
  return Array.from(rooms).sort()
})

const filteredStudents = computed(() => {
  if (!selectedClassroom.value) return []
  
  let list = studentsList.value.filter(s => s.classroom === selectedClassroom.value && isStudent(s))
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.studentId.toLowerCase().includes(q)
    )
  }
  
  // Sort by studentId
  return list.sort((a, b) => a.studentId.localeCompare(b.studentId))
})

const totalCoinsInClassroom = computed(() => {
  return filteredStudents.value.reduce((total, student) => {
    return total + getStudentCoins(student.studentId)
  }, 0)
})

// Methods
const selectClassroom = (room) => {
  selectedClassroom.value = room
  searchQuery.value = ''
}

const handleAddCoins = (studentId) => {
  if (coinAdjustAmount.value > 0) {
    addCoins(studentId, coinAdjustAmount.value, {
      category: 'teacher',
      title: 'อาจารย์เพิ่มเหรียญพิเศษ',
      detail: `ปรับเพิ่ม +${coinAdjustAmount.value} Coins โดยอาจารย์ผู้สอน`
    })
  }
}

const handleDeductCoins = (studentId) => {
  if (coinAdjustAmount.value > 0) {
    deductCoins(studentId, coinAdjustAmount.value, {
      category: 'teacher',
      title: 'อาจารย์ปรับลดเหรียญ',
      detail: `ปรับลด -${coinAdjustAmount.value} Coins โดยอาจารย์ผู้สอน`
    })
  }
}
</script>

<template>
  <div class="w-full lg:h-full flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out] lg:overflow-hidden">
    
    <!-- Header Section -->
    <div class="shrink-0 bg-white rounded-2xl px-4 py-3 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-0.5">
        <h1 class="text-lg sm:text-xl font-black text-stone-800 flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shadow-inner">
            <Coins class="w-4 h-4" />
          </span>
          ระบบจัดการเหรียญ (Coins)
        </h1>
        <p class="text-stone-500 text-xs font-semibold">ดูและจัดการยอดเหรียญสะสมของนักศึกษาแยกตามห้องเรียน</p>
      </div>
      <button
        @click="router.push('/wallet')"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
      >
        <FileText class="w-3.5 h-3.5" />
        ดูภาพรวมการเคลื่อนไหวเหรียญทั้งระบบ (Admin Statement)
      </button>
    </div>

    <!-- Classroom Selection (Visible when no classroom is selected) -->
    <div v-if="!selectedClassroom" class="space-y-3">
      <h2 class="text-sm font-black text-stone-700 flex items-center gap-1.5">
        <Users class="w-4 h-4 text-indigo-500" />
        เลือกห้องเรียน
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="room in classrooms" 
          :key="room"
          @click="selectClassroom(room)"
          class="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex items-center gap-3.5"
        >
          <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-black text-stone-800 group-hover:text-indigo-600 transition-colors">{{ room }}</h3>
            <p class="text-xs text-stone-500 font-semibold">
              จำนวนนักศึกษา: {{ studentsList.filter(s => s.classroom === room && isStudent(s)).length }} คน
            </p>
          </div>
        </div>
        
        <div v-if="classrooms.length === 0" class="col-span-full py-10 text-center text-stone-500 text-xs font-bold bg-white rounded-2xl border border-stone-200">
          ยังไม่มีข้อมูลห้องเรียนในระบบ
        </div>
      </div>
    </div>

    <!-- Student List (Visible when a classroom is selected) -->
    <div v-else class="flex-1 min-h-0 flex flex-col gap-3">
      
      <!-- Action Bar & Stats Combined -->
      <div class="shrink-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs">
        <div class="flex flex-wrap items-center gap-2.5">
          <button 
            @click="selectedClassroom = null"
            class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            กลับไปเลือกห้อง
          </button>

          <div class="flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100">
            <Users class="w-3.5 h-3.5 text-indigo-600" />
            <span class="text-xs font-black text-indigo-900">{{ selectedClassroom }}</span>
          </div>

          <div class="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
            <Coins class="w-3.5 h-3.5 text-amber-600" />
            <span class="text-xs font-bold text-amber-800">รวมทั้งห้อง:</span>
            <span class="text-xs font-black font-mono text-amber-700">{{ totalCoinsInClassroom.toLocaleString() }} Coins</span>
          </div>
        </div>
        
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Quick Coin Setting -->
          <div class="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            <Coins class="w-3.5 h-3.5 text-amber-500" />
            <span class="text-xs font-bold text-amber-700">ปรับครั้งละ:</span>
            <input 
              v-model.number="coinAdjustAmount"
              type="number" 
              min="1"
              class="w-14 bg-white border border-amber-300 rounded-lg px-1.5 py-0.5 text-xs font-bold text-amber-600 text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ..."
              class="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 border-none text-xs font-bold focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Students Table (Fixed-Height Box with Internal Scroll) -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col overflow-hidden h-[460px] lg:h-full">
        <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10 bg-stone-50 shadow-2xs">
              <tr class="border-b border-stone-200">
                <th class="py-2.5 px-4 text-[11px] font-black text-stone-500 uppercase">นักศึกษา</th>
                <th class="py-2.5 px-4 text-[11px] font-black text-stone-500 uppercase">รหัสนักศึกษา</th>
                <th class="py-2.5 px-4 text-[11px] font-black text-stone-500 uppercase text-center">ยอดเหรียญ (Coins)</th>
                <th class="py-2.5 px-4 text-[11px] font-black text-stone-500 uppercase text-center">จัดการเหรียญ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-xs">
              <tr 
                v-for="student in filteredStudents" 
                :key="student.id"
                class="hover:bg-stone-50 transition-colors"
              >
                <td class="py-2 px-4">
                  <div class="flex items-center gap-2.5">
                    <StudentAvatar
                      :avatar="student.avatar"
                      :frame="student.equippedFrame"
                      :name="student.name"
                      size="w-8 h-8"
                      avatarClass="bg-indigo-50"
                      borderClass="border border-stone-200"
                    />
                    <div>
                      <p class="font-bold text-xs text-stone-800">{{ student.name }}</p>
                      <p class="text-[10px] text-stone-500 font-medium">{{ student.role }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-2 px-4">
                  <span class="font-mono text-xs font-bold text-stone-600">{{ student.studentId }}</span>
                </td>
                <td class="py-2 px-4 text-center">
                  <div class="inline-flex items-center justify-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 min-w-[70px]">
                    <Coins class="w-3.5 h-3.5 text-amber-500" />
                    <span class="font-black text-amber-700 font-mono text-xs">{{ getStudentCoins(student.studentId).toLocaleString() }}</span>
                  </div>
                </td>
                <td class="py-2 px-4">
                  <div class="flex items-center justify-center gap-1.5">
                    <button 
                      @click="handleDeductCoins(student.studentId)"
                      class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200 cursor-pointer"
                      title="ลดเหรียญ"
                    >
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <button 
                      @click="handleAddCoins(student.studentId)"
                      class="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200 cursor-pointer"
                      title="เพิ่มเหรียญ"
                    >
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="router.push({ path: '/wallet', query: { studentId: student.studentId } })"
                      class="px-2 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 transition-colors border border-indigo-200 cursor-pointer"
                      title="ดูประวัติ Statement"
                    >
                      <FileText class="w-3 h-3" />
                      <span>Statement</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="py-10 text-center text-stone-500 font-bold text-xs">
                  ไม่พบข้อมูลนักศึกษาที่ค้นหา
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
