<script setup>
import { ref, watch } from 'vue'
import { X, Check, Image as ImageIcon } from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedFrame: {
    type: String,
    default: ''
  },
  avatarText: {
    type: String,
    default: 'U'
  },
  frames: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:selectedFrame'])

const tempFrame = ref(props.selectedFrame)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      tempFrame.value = props.selectedFrame
    }
  }
)

const handleSelect = (frameId) => {
  tempFrame.value = frameId
}

const handleSave = () => {
  emit('update:selectedFrame', tempFrame.value)
  emit('update:modelValue', false)
}

const handleClose = () => {
  tempFrame.value = props.selectedFrame
  emit('update:modelValue', false)
}

const getFrameName = (id) => {
  const f = props.frames.find(f => f.id === id)
  return f ? f.name : 'ไม่มีกรอบ'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md">
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="handleClose"></div>

        <!-- Modal Content -->
        <div class="relative z-10 w-full max-w-4xl bg-stone-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          
          <!-- Left side: Preview -->
          <div class="w-full md:w-2/5 bg-gradient-to-b from-stone-800 to-stone-900 p-8 flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-[url('/img/noise.png')] mix-blend-overlay"></div>
            
            <button @click="handleClose" class="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors md:hidden">
              <X class="w-4 h-4" />
            </button>
            
            <h3 class="font-black text-xl mb-1 z-10">ดูตัวอย่างโปรไฟล์</h3>
            <p class="text-sm text-stone-400 mb-8 z-10">เลือกกรอบที่ใช่สำหรับคุณ</p>

            <div class="relative w-40 h-40 md:w-48 md:h-48 z-10 flex items-center justify-center">
              <!-- Avatar Circle -->
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-stone-100 flex items-center justify-center text-5xl font-black text-stone-700 shadow-xl border-4 border-white overflow-hidden absolute">
                <img :src="(avatarText && (avatarText.includes('/') || avatarText.includes('http') || avatarText.startsWith('data:'))) ? avatarText : '/placeholder_profile.png'" class="w-full h-full object-cover object-top" @error="$event.target.src = '/placeholder_profile.png'" />
              </div>
              
              <!-- Frame Overlay -->
              <img v-if="tempFrame" :src="tempFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-2xl z-20 transition-all duration-300" />
            </div>
            
            <div class="mt-8 text-center z-10">
              <span class="px-3 py-1 bg-stone-700/50 rounded-full text-xs font-medium text-stone-300 border border-stone-600 backdrop-blur-sm">
                {{ getFrameName(tempFrame) }}
              </span>
            </div>
          </div>

          <!-- Right side: Selection Grid -->
          <div class="w-full md:w-3/5 bg-white flex flex-col h-full max-h-[60vh] md:max-h-none">
            <div class="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2">
                <ImageIcon class="w-5 h-5 text-indigo-500" />
                <h3 class="font-black text-lg text-stone-800">คอลเลกชันกรอบรูป</h3>
              </div>
              <button @click="handleClose" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors hidden md:flex">
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="p-6 overflow-y-auto bg-stone-50/50 flex-1">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <button
                  v-for="frame in frames"
                  :key="frame.id"
                  @click="handleSelect(frame.id)"
                  :class="[
                    'relative group aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all cursor-pointer bg-white shadow-sm',
                    tempFrame === frame.id 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-md transform scale-[1.02]' 
                      : 'border-stone-200 hover:border-indigo-300 hover:shadow-md'
                  ]"
                >
                  <div class="relative w-full h-full flex items-center justify-center">
                    <img v-if="frame.image" :src="frame.image" class="w-20 h-20 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />
                    <span v-else class="text-xs font-bold text-stone-400">ไม่มีกรอบ</span>
                  </div>
                  
                  <span class="mt-3 text-xs font-bold text-stone-700 text-center line-clamp-1 w-full">{{ frame.name }}</span>
                  
                  <div v-if="tempFrame === frame.id" class="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-short">
                    <Check class="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
              </div>
            </div>

            <div class="p-4 border-t border-stone-100 bg-white flex justify-end gap-3 shrink-0">
              <button @click="handleClose" class="px-5 py-2.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 transition-colors">
                ยกเลิก
              </button>
              <button @click="handleSave" class="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2">
                <Check class="w-4 h-4" /> เลือกกรอบนี้
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.animate-bounce-short {
  animation: bounce-short 0.4s ease-out 1;
}
@keyframes bounce-short {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}
</style>
