<script setup>
import { AlertTriangle, CheckCircle, Info, X } from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'ยืนยันการดำเนินการ'
  },
  message: {
    type: String,
    default: 'คุณแน่ใจหรือไม่?'
  },
  type: {
    type: String,
    default: 'confirm', // 'confirm', 'alert', 'danger', 'success'
    validator: (value) => ['confirm', 'alert', 'danger', 'success'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'ตกลง'
  },
  cancelText: {
    type: String,
    default: 'ยกเลิก'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const close = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const confirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="close"></div>
        
        <!-- Dialog -->
        <div class="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-[bounceIn_0.3s_ease-out] flex flex-col">
          
          <!-- Body -->
          <div class="p-6 text-center space-y-4">
            
            <!-- Icon based on type -->
            <div class="flex justify-center mb-2">
              <div v-if="type === 'danger'" class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-inner">
                <AlertTriangle class="w-8 h-8" />
              </div>
              <div v-else-if="type === 'success'" class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                <CheckCircle class="w-8 h-8" />
              </div>
              <div v-else class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
                <Info class="w-8 h-8" />
              </div>
            </div>

            <!-- Text Content -->
            <div>
              <h3 class="text-xl font-black text-stone-800 mb-2">{{ title }}</h3>
              <p class="text-sm text-stone-500 leading-relaxed">{{ message }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-3">
            <button 
              v-if="type !== 'alert' && type !== 'success'"
              type="button" 
              @click="close"
              class="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-bold text-sm transition-colors cursor-pointer"
            >
              {{ cancelText }}
            </button>
            <button 
              type="button" 
              @click="confirm"
              :class="[
                'flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-lg',
                type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
          
          <button 
            @click="close"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
