<script setup>
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { X, Check, UploadCloud } from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'cropped'])

const cropperRef = ref(null)

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleCrop = () => {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
      // Get cropped image as base64 string
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9)
      emit('cropped', croppedImage)
      closeModal()
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity" 
        @click="closeModal"
      ></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[bounceIn_0.3s_ease-out] flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <UploadCloud class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-black text-lg text-stone-800">ปรับแต่งรูปโปรไฟล์</h3>
              <p class="text-xs text-stone-500 font-medium">ลากและขยายกรอบเพื่อครอบตัดรูปภาพของคุณ</p>
            </div>
          </div>
          <button 
            @click="closeModal" 
            class="text-stone-400 hover:text-stone-600 hover:bg-stone-200 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body (Cropper) -->
        <div class="p-4 bg-stone-900 flex-1 flex items-center justify-center">
          <cropper
            ref="cropperRef"
            class="cropper"
            :src="imageSrc"
            :stencil-component="CircleStencil"
            :stencil-props="{
              aspectRatio: 1
            }"
            image-restriction="stencil"
            :canvas="{
              minHeight: 256,
              minWidth: 256,
              maxHeight: 512,
              maxWidth: 512,
            }"
          />
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-5 py-2.5 rounded-xl text-stone-600 font-bold hover:bg-stone-200 transition-colors cursor-pointer text-sm"
          >
            ยกเลิก
          </button>
          <button 
            @click="handleCrop"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer text-sm"
          >
            <Check class="w-4 h-4" /> ยืนยันการตัดรูป
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cropper {
  background: transparent;
  width: 100%;
  height: 50vh;
  max-height: 400px;
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
