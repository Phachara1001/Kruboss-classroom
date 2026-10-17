<script setup>
import { ref, computed } from 'vue'
import { Coins, Users, Search, Plus, Minus, ArrowLeft } from '@lucide/vue'
import { studentsList, getAvatarInitial, isStudent } from '../data/studentsStore'
import { getStudentCoins, addCoins, deductCoins } from '../data/shopStore'

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
    addCoins(studentId, coinAdjustAmount.value)
  }
}

const handleDeductCoins = (studentId) => {
  if (coinAdjustAmount.value > 0) {
    deductCoins(studentId, coinAdjustAmount.value)
  }
}
</script>

<template>
  <div class="p-4 sm:p-8 space-y-8 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-stone-800 flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center shadow-inner">
            <Coins class="w-5 h-5" />
          </span>
          ระบบจัดการเหรียญ (Coins)
        </h1>
        <p class="text-stone-500 text-sm">ดูและจัดการยอดเหรียญสะสมของนักศึกษาแยกตามห้องเรียน</p>
      </div>
    </div>

    <!-- Classroom Selection (Visible when no classroom is selected) -->
    <div v-if="!selectedClassroom" class="space-y-4">
      <h2 class="text-lg font-black text-stone-700 flex items-center gap-2">
        <Users class="w-5 h-5 text-indigo-500" />
        เลือกห้องเรียน
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="room in classrooms" 
          :key="room"
          @click="selectClassroom(room)"
          class="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex items-center gap-4"
        >
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-black text-stone-800 group-hover:text-indigo-600 transition-colors">{{ room }}</h3>
            <p class="text-sm text-stone-500 font-medium">
              จำนวนนักศึกษา: {{ studentsList.filter(s => s.classroom === room && isStudent(s)).length }} คน
            </p>
          </div>
        </div>
        
        <div v-if="classrooms.length === 0" class="col-span-full py-12 text-center text-stone-500 font-bold bg-white rounded-3xl border border-stone-200">
          ยังไม่มีข้อมูลห้องเรียนในระบบ
        </div>
      </div>
    </div>

    <!-- Student List (Visible when a classroom is selected) -->
    <div v-else class="space-y-6">
      
      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <button 
          @click="selectedClassroom = null"
          class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          กลับไปเลือกห้อง
        </button>
        
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <!-- Quick Coin Setting -->
          <div class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Coins class="w-4 h-4 text-amber-500" />
            <span class="text-xs font-bold text-amber-700">ปรับยอดครั้งละ:</span>
            <input 
              v-model.number="coinAdjustAmount"
              type="number" 
              min="1"
              class="w-16 bg-white border border-amber-300 rounded-lg px-2 py-1 text-sm font-bold text-amber-600 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <!-- Search -->
          <div class="relative flex-1 sm:flex-none">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ..."
              class="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">ห้องเรียนที่เลือก</p>
            <h3 class="text-xl font-black text-indigo-900">{{ selectedClassroom }}</h3>
          </div>
          <Users class="w-8 h-8 text-indigo-200" />
        </div>
        <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">เหรียญรวมทั้งห้อง</p>
            <h3 class="text-xl font-black text-amber-700">{{ totalCoinsInClassroom }} <span class="text-sm">Coins</span></h3>
          </div>
          <Coins class="w-8 h-8 text-amber-200" />
        </div>
      </div>

      <!-- Students Table -->
      <div class="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-stone-50 border-b border-stone-200">
                <th class="py-4 px-6 text-xs font-black text-stone-500 uppercase">นักศึกษา</th>
                <th class="py-4 px-6 text-xs font-black text-stone-500 uppercase">รหัสนักศึกษา</th>
                <th class="py-4 px-6 text-xs font-black text-stone-500 uppercase text-center">ยอดเหรียญ (Coins)</th>
                <th class="py-4 px-6 text-xs font-black text-stone-500 uppercase text-center">จัดการเหรียญ</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="student in filteredStudents" 
                :key="student.id"
                class="border-b border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <td class="py-3 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">
                      {{ getAvatarInitial(student.name) }}
                    </div>
                    <div>
                      <p class="font-bold text-sm text-stone-800">{{ student.name }}</p>
                      <p class="text-[11px] text-stone-500 font-medium">{{ student.role }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-6">
                  <span class="font-mono text-sm font-bold text-stone-600">{{ student.studentId }}</span>
                </td>
                <td class="py-3 px-6 text-center">
                  <div class="inline-flex items-center justify-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 min-w-[80px]">
                    <Coins class="w-4 h-4 text-amber-500" />
                    <span class="font-black text-amber-700">{{ getStudentCoins(student.studentId) }}</span>
                  </div>
                </td>
                <td class="py-3 px-6">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      @click="handleDeductCoins(student.studentId)"
                      class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200"
                      title="ลดเหรียญ"
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <button 
                      @click="handleAddCoins(student.studentId)"
                      class="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200"
                      title="เพิ่มเหรียญ"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="py-12 text-center text-stone-500 font-bold">
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
