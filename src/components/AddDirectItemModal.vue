<script setup>
import { ref, watch } from 'vue'
import { X, Save, Image as ImageIcon, Check, Pencil } from '@lucide/vue'
import { availableFrameAssets, rarityConfig } from '../data/shopStore'
import { API_UPLOAD_URL } from '@/config/api'

const props = defineProps({
  isOpen: Boolean,
  itemToEdit: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  id: '',
  name: '',
  price: 250,
  image: '',
  description: '',
  itemType: 'frame',
  rarity: 'Epic',
  isSale: true
})

const errorMessage = ref('')
const isUploading = ref(false)
const fileInput = ref(null)
const showAssetPicker = ref(false) // Keeping old asset picker for backward compatibility if needed

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.itemToEdit) {
      formData.value = { ...props.itemToEdit }
    } else {
      formData.value = {
        id: `direct-${Date.now()}`,
        name: '',
        price: 250,
        image: '',
        description: '',
        itemType: 'frame',
        rarity: 'Epic',
        isSale: true
      }
    }
    errorMessage.value = ''
    showAssetPicker.value = false
  }
})

const closeModal = () => {
  emit('close')
}

const handleSave = () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'กรุณาใส่ชื่อไอเทม'
    return
  }
  if (!formData.value.image) {
    errorMessage.value = 'กรุณาเลือกรูปภาพไอเทม'
    return
  }

  // Only for NEW frames, set id to image path. When editing, preserve the existing id!
  if (!props.itemToEdit && formData.value.itemType === 'frame') {
    formData.value.id = formData.value.image
  }

  emit('save', { ...formData.value })
  closeModal()
}

const selectAsset = (asset) => {
  formData.value.image = asset.path
  if (!formData.value.name) {
    formData.value.name = `กรอบรูป ${asset.name}`
  }
  showAssetPicker.value = false
}

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  isUploading.value = true
  errorMessage.value = ''

  const uploadData = new FormData()
  uploadData.append('file', file)

  try {
    const res = await fetch(API_UPLOAD_URL, {
      method: 'POST',
      body: uploadData
    })
    
    if (!res.ok) throw new Error('Upload failed')
    
    const data = await res.json()
    if (data.success && data.url) {
      formData.value.image = data.url
      if (!formData.value.name) {
        formData.value.name = file.name.replace(/\.[^/.]+$/, "")
      }
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (err) {
    errorMessage.value = 'ไม่สามารถอัปโหลดรูปภาพได้: ' + err.message
  } finally {
    isUploading.value = false
    event.target.value = '' // reset input
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto no-scrollbar">
        <div class="absolute inset-0" @click="closeModal"></div>

        <div
          class="relative z-10 w-full max-w-2xl bg-stone-950 text-white rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-stone-800 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-[bounceIn_0.4s_ease-out]">

          <div class="p-6 sm:p-8 border-b border-stone-800 flex items-center justify-between shrink-0 bg-stone-900/50">
            <h2 class="text-xl sm:text-2xl font-black flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <ImageIcon v-if="!itemToEdit" class="w-5 h-5" />
                <Pencil v-else class="w-5 h-5" />
              </span>
              {{ itemToEdit ? 'แก้ไขไอเทม' : 'เพิ่มไอเทมในร้านค้าแฟชั่น' }}
            </h2>
            <button @click="closeModal"
              class="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white text-stone-400 flex items-center justify-center transition-all cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 sm:p-8 flex-1 overflow-y-auto no-scrollbar space-y-6">

            <div v-if="errorMessage"
              class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-2">
              <X class="w-5 h-5 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Left: Image Picker -->
              <div class="space-y-4">
                <label class="block text-sm font-bold text-stone-300">รูปภาพไอเทม <span
                    class="text-rose-400">*</span></label>
                
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

                <div
                  class="aspect-square rounded-3xl border-2 border-dashed border-stone-700 bg-stone-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-400/5 transition-colors relative overflow-hidden group"
                  @click="triggerFileUpload">
                  
                  <div v-if="isUploading" class="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm z-30">
                    <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span class="mt-3 text-sm font-bold text-indigo-400 animate-pulse">กำลังอัปโหลด...</span>
                  </div>

                  <img v-else-if="formData.image" :src="formData.image"
                    class="w-full h-full object-contain p-4 relative z-10" />
                  
                  <div v-else class="text-stone-500 flex flex-col items-center gap-3">
                    <ImageIcon class="w-10 h-10" />
                    <span class="text-sm font-bold">คลิกเพื่ออัปโหลดรูปภาพ</span>
                  </div>

                  <div v-if="!isUploading"
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center backdrop-blur-sm">
                    <span
                      class="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg border border-indigo-500 flex items-center gap-2">
                      <ImageIcon class="w-4 h-4" /> เลือกไฟล์รูปภาพ
                    </span>
                  </div>
                </div>
                
                <!-- Fallback to old picker -->
                <button v-if="false" @click="showAssetPicker = true" class="w-full py-2 text-xs font-bold text-stone-500 hover:text-indigo-400 underline decoration-stone-700 hover:decoration-indigo-400 transition-colors">
                  หรือเลือกจากไฟล์ระบบ (โฟลเดอร์เก่า)
                </button>
              </div>

              <!-- Right: Details -->
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">ชื่อไอเทม <span
                      class="text-rose-400">*</span></label>
                  <input v-model="formData.name" type="text" placeholder="เช่น กรอบรูป 8-Bit"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">คำอธิบาย</label>
                  <textarea v-model="formData.description" rows="2" placeholder="รายละเอียดเพิ่มเติม"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-400">ราคา (Coins) <span
                        class="text-rose-400">*</span></label>
                    <input v-model.number="formData.price" type="number" min="0"
                      class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-black text-amber-400 focus:outline-none focus:border-indigo-500 transition-all text-center" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-400">ระดับความหายาก</label>
                    <select v-model="formData.rarity"
                      class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option v-for="(cfg, rKey) in rarityConfig" :key="rKey" :value="rKey" :class="cfg.textColor">
                        {{ rKey }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">ประเภทไอเทม</label>
                  <select v-model="formData.itemType"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="frame">กรอบรูปโปรไฟล์</option>
                    <option value="pet">สัตว์เลี้ยง</option>
                    <option value="privilege">การ์ดสิทธิพิเศษ</option>
                    <option value="buff">บัฟ</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div class="p-6 sm:p-8 border-t border-stone-800 flex justify-end gap-3 bg-stone-900/50 shrink-0">
            <button @click="closeModal"
              class="px-6 py-3 rounded-xl font-bold text-sm text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button @click="handleSave"
              class="px-8 py-3 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2 cursor-pointer active:scale-95">
              <Save class="w-4 h-4" />
              บันทึกไอเทม
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Asset Picker Overlay -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showAssetPicker"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm select-none">
        <div class="absolute inset-0" @click="showAssetPicker = false"></div>

        <div
          class="relative z-10 w-full max-w-4xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          <div class="p-6 flex items-center justify-between border-b border-white/5 bg-stone-950">
            <h3 class="font-black text-lg text-white flex items-center gap-2">
              <ImageIcon class="w-5 h-5 text-indigo-400" /> เลือกกรอบรูปโปรไฟล์
            </h3>
            <button @click="showAssetPicker = false" class="text-stone-500 hover:text-white cursor-pointer">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            <div v-for="asset in availableFrameAssets" :key="asset.path" @click="selectAsset(asset)"
              class="bg-stone-950 rounded-2xl p-4 border-2 border-transparent hover:border-indigo-500 cursor-pointer flex flex-col items-center gap-3 transition-all hover:bg-stone-800 hover:-translate-y-1 group relative">
              <div class="w-full aspect-square relative flex items-center justify-center">
                <img :src="asset.path"
                  class="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
              <span class="text-xs font-bold text-stone-400 text-center line-clamp-1 group-hover:text-white">{{
                asset.file }}</span>
              <div
                class="absolute inset-0 border-2 border-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              </div>
            </div>

            <div v-if="availableFrameAssets.length === 0"
              class="col-span-full py-12 text-center text-stone-500 font-bold">
              ไม่พบรูปภาพในโฟลเดอร์ /public/img/frame/
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
