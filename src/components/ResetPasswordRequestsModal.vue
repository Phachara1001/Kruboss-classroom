<script setup>
import { computed } from 'vue'
import { X, ShieldAlert, Check, UserX } from '@lucide/vue'
import { passwordResetRequests, approvePasswordReset, rejectPasswordReset, fetchPasswordResetRequests } from '../data/authStore'
import { studentsList } from '../data/studentsStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

import { watch } from 'vue'

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fetchPasswordResetRequests()
  }
})

const pendingRequests = computed(() => {
  return passwordResetRequests.value
    .filter(req => req.status === 'pending')
    .map(req => {
      const student = studentsList.value.find(s => s.studentId === req.studentId)
      return {
        ...req,
        studentName: student ? student.name : 'Unknown Student'
      }
    })
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleApprove = (reqId, studentId) => {
  // Reset the password in studentsStore
  const student = studentsList.value.find(s => s.studentId === studentId)
  if (student) {
    student.password = '' // Clear password so they have to set it up again
  }
  approvePasswordReset(reqId)
}

const handleReject = (reqId) => {
  rejectPasswordReset(reqId)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="closeModal"></div>
      
      <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-[bounceIn_0.3s_ease-out]">
        
        <div class="px-6 py-5 bg-gradient-to-r from-stone-800 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-red-400 border border-white/20">
              <ShieldAlert class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-black text-lg text-white leading-tight">คำขอรีเซ็ตรหัสผ่าน</h3>
              <p class="text-xs text-stone-300">รอการอนุมัติ {{ pendingRequests.length }} รายการ</p>
            </div>
          </div>
          <button @click="closeModal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-3 bg-stone-50 flex-1">
          <div v-if="pendingRequests.length === 0" class="text-center py-10 text-stone-400">
            <ShieldAlert class="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p class="font-bold">ไม่มีคำขอรีเซ็ตรหัสผ่านใหม่</p>
          </div>

          <div 
            v-for="req in pendingRequests" 
            :key="req.id"
            class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div class="text-center sm:text-left w-full">
              <p class="font-bold text-stone-800">{{ req.studentName }}</p>
              <p class="text-xs font-mono text-stone-500">รหัส: {{ req.studentId }}</p>
              <p class="text-[10px] text-stone-400 mt-1">{{ new Date(req.timestamp).toLocaleString('th-TH') }}</p>
            </div>
            
            <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-center">
              <button 
                @click="handleReject(req.id)"
                class="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <UserX class="w-3.5 h-3.5" /> ไม่อนุมัติ
              </button>
              <button 
                @click="handleApprove(req.id, req.studentId)"
                class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Check class="w-3.5 h-3.5" /> อนุมัติการรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
