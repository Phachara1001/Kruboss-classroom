<script setup>
import { ref, watch, computed } from 'vue'
import { X, Check, User, Phone, Sparkles, Image as ImageIcon, Smile, ChevronRight } from '@lucide/vue'
import { updateStudent } from '../data/studentsStore'
import { getStudentItems, directShopItems, fetchStudentInventory } from '../data/shopStore'
import { authUser, updateAuthUser } from '../data/authStore'
import { useRouter } from 'vue-router'
import ImageCropperModal from './ImageCropperModal.vue'
import { API_UPLOAD_URL } from '@/config/api'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'updated'])
const router = useRouter()

// Editable Fields
const avatar = ref('')
const nickname = ref('')
const phone = ref('')
const quote = ref('')
const facebook = ref('')
const facebookUrl = ref('')
const ig = ref('')
const igUrl = ref('')

// Compute active frame from equipment store
const activeFrame = computed(() => {
  if (!props.student) return null
  return props.student.equippedFrame || null
})

const errorMessage = ref('')
const successMessage = ref('')

// Image Cropper State
const showCropperModal = ref(false)
const rawImageSrc = ref('')
const croppedAvatar = ref('')

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      rawImageSrc.value = e.target.result
      showCropperModal.value = true
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const handleCropped = (croppedImageBase64) => {
  croppedAvatar.value = croppedImageBase64
  avatar.value = croppedImageBase64
}

watch(
  () => props.student,
  (s) => {
    if (s) {
      avatar.value = (s.avatar && (s.avatar.includes('/') || s.avatar.includes('http') || s.avatar.startsWith('data:'))) ? s.avatar : ''
      nickname.value = s.nickname === '-' ? '' : (s.nickname || '')
      phone.value = s.phone || ''
      quote.value = s.quote === 'ยังไม่ได้ระบุคำคมประจำใจ' ? '' : (s.quote || '')
      facebook.value = s.facebook || ''
      facebookUrl.value = s.facebookUrl || ''
      ig.value = s.ig || ''
      igUrl.value = s.igUrl || ''
      errorMessage.value = ''
      successMessage.value = ''
      
      if (props.modelValue && s.studentId) {
        fetchStudentInventory(s.studentId)
      }
    }
  },
  { immediate: true }
)

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.student?.studentId) {
    fetchStudentInventory(props.student.studentId)
  }
})

const closeModal = () => {
  emit('update:modelValue', false)
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSave = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!props.student) return

  try {
    let finalAvatar = avatar.value.trim()
    
    // If it's a new cropped image (base64)
    if (finalAvatar.startsWith('data:image')) {
      // Convert base64 to Blob
      const res = await fetch(finalAvatar)
      const blob = await res.blob()
      
      const formData = new FormData()
      formData.append('file', blob, 'avatar.png')
      
      const uploadRes = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        finalAvatar = uploadData.url
      } else {
        throw new Error('อัปโหลดรูปภาพไม่สำเร็จ')
      }
    } else if (!finalAvatar.includes('/') && !finalAvatar.includes('http')) {
      finalAvatar = finalAvatar.substring(0, 2)
    }

    const updated = await updateStudent(props.student.id, {
      avatar: finalAvatar,
      nickname: nickname.value.trim() || '-',
      phone: phone.value.trim(),
      quote: quote.value.trim() || 'ยังไม่ได้ระบุคำคมประจำใจ',
      facebook: facebook.value.trim(),
      facebookUrl: facebookUrl.value.trim(),
      ig: ig.value.trim(),
      igUrl: igUrl.value.trim()
    })

    if (authUser.value?.id === props.student.studentId) {
      updateAuthUser({
        name: updated.name,
        avatar: updated.avatar,
        equippedFrame: updated.equippedFrame
      })
    }

    successMessage.value = 'บันทึกข้อมูลเรียบร้อยแล้ว!'
    emit('updated', updated)

    setTimeout(() => {
      closeModal()
    }, 800)
  } catch (err) {
    errorMessage.value = err.message || 'เกิดข้อผิดพลาดในการบันทึก'
  }
}

// Available Frames for selection
const baseAvailableFrames = computed(() => {
  return [
    { id: '', name: 'ไม่มีกรอบ', image: '' },
    ...directShopItems.value.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image
    }))
  ]
})

// Filter frames based on what the student actually owns in their inventory
const availableFrames = computed(() => {
  if (!props.student) return [baseAvailableFrames.value[0]]
  
  const inventory = getStudentItems(props.student.studentId) || []
  // Map inventory items to frame IDs (e.g., '/img/frame/Cyber.png')
  const ownedFrameImagePaths = inventory.filter(inv => inv.item?.itemType === 'frame').map(inv => inv.item?.image)
  
  return baseAvailableFrames.value.filter(frame => {
    // Empty frame is always available
    if (frame.id === '') return true
    // Otherwise, check if they own it
    return ownedFrameImagePaths.includes(frame.id)
  })
})

const getFrameName = (id) => {
  const f = baseAvailableFrames.value.find(f => f.id === id)
  return f ? f.name : 'ไม่มีกรอบ'
}

</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue && student"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-sm">
        <!-- Backdrop click to close -->
        <div class="absolute inset-0" @click="closeModal"></div>

        <!-- Modal Dialog -->
        <div
          class="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-[bounceIn_0.3s_ease-out] flex flex-col max-h-[94vh]">

          <!-- Header -->
          <div
            class="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="relative w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-sm border border-white/30 shrink-0 overflow-hidden z-0">
                <!-- Frame overlay in header -->
                <img v-if="activeFrame" :src="activeFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <img :src="avatar && (avatar.startsWith('data:') || avatar.includes('/') || avatar.includes('http')) ? avatar : '/placeholder_profile.png'" class="w-full h-full object-cover object-top" @error="$event.target.src = '/placeholder_profile.png'" />
              </div>
              <div>
                <h3 class="font-black text-lg text-white leading-tight">โปรไฟล์ของฉัน</h3>
                <p class="text-xs text-emerald-100">ปรับแต่งข้อมูลและรูปโปรไฟล์ของคุณ</p>
              </div>
            </div>

            <button @click="closeModal"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body Form -->
          <form @submit.prevent="handleSave" class="p-6 overflow-y-auto space-y-5 text-stone-800 no-scrollbar">

            <!-- Alert Messages -->
            <div v-if="errorMessage"
              class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span class="font-bold">ข้อผิดพลาด:</span> {{ errorMessage }}
            </div>

            <div v-if="successMessage"
              class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 font-bold">
              <Check class="w-4 h-4 text-teal-600" />
              <span>{{ successMessage }}</span>
            </div>

            <!-- Read-only Info Block -->
            <div class="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">รหัสนักศึกษา</span>
                  <span class="font-mono text-sm font-bold text-stone-700">{{ student.studentId }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">ห้องเรียน</span>
                  <span class="text-sm font-bold text-stone-700">{{ student.classroom }}</span>
                </div>
              </div>
              <div class="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">ชื่อ-นามสกุล</span>
                  <span class="text-sm font-bold text-stone-700">{{ student.name }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">ตำแหน่ง</span>
                  <span class="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{{ student.role }}</span>
                </div>
              </div>
            </div>

            <!-- Profile Picture Upload -->
            <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center gap-3">
              <div class="relative w-20 h-20 group">
                <img v-if="activeFrame" :src="activeFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-black text-stone-700 border-2 border-white shadow-sm overflow-hidden relative z-0">
                  <img :src="avatar && (avatar.startsWith('data:') || avatar.includes('/') || avatar.includes('http')) ? avatar : '/placeholder_profile.png'" class="w-full h-full object-cover object-top" @error="$event.target.src = '/placeholder_profile.png'" />
                  
                  <!-- Overlay for upload -->
                  <label class="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <ImageIcon class="w-5 h-5 mb-0.5" />
                    <span class="text-[9px] font-bold">เปลี่ยนรูป</span>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                  </label>
                </div>
              </div>
              <p class="text-[10px] text-stone-500 text-center max-w-[200px] leading-tight">
                คลิกที่รูปเพื่ออัปโหลดโปรไฟล์ใหม่ <br/><span class="text-stone-400">(ระบบจะให้คุณปรับสัดส่วนรูป 1:1)</span>
              </p>
              
              <!-- Fallback to emoji input if they want to type -->
              <div v-if="!avatar || (!avatar.startsWith('data:') && !avatar.includes('http'))" class="w-full mt-2 space-y-1">
                <label class="block text-[10px] font-bold text-stone-700 flex items-center gap-1.5 justify-center">
                  <Smile class="w-3 h-3 text-stone-500" /> หรือตั้งเป็นตัวอักษร/Emoji
                </label>
                <input v-model="avatar" type="text" placeholder="เช่น น, A, 🐱"
                  class="w-full px-3 py-1.5 text-center bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none" />
              </div>
              <div v-else class="w-full mt-2 flex justify-center">
                <button type="button" @click="avatar = ''" class="text-[10px] text-red-500 hover:text-red-600 font-bold px-3 py-1 bg-red-50 rounded-lg">
                  ลบรูปภาพและใช้ตัวอักษร
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-700">ชื่อเล่น</label>
              <input v-model="nickname" type="text" placeholder="เช่น นัท, บอส, วิน"
                class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none" />
            </div>

            <!-- Profile Equipment Link -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-emerald-500" /> ของตกแต่งโปรไฟล์
              </label>
              <button type="button" @click="closeModal(); router.push('/inventory')" class="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between hover:border-emerald-400 hover:bg-emerald-100/50 transition-colors cursor-pointer group">
                <div class="flex items-center gap-4">
                  <div class="text-left">
                    <p class="text-sm font-bold text-emerald-800">เปลี่ยนกรอบโปรไฟล์และของตกแต่ง</p>
                    <p class="text-xs text-emerald-600/80">ไปที่หน้าคลังไอเทมเพื่อสวมใส่</p>
                  </div>
                </div>
                <div class="w-8 h-8 rounded-full bg-emerald-200 group-hover:bg-emerald-300 flex items-center justify-center text-emerald-600 transition-colors">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </button>
            </div>

            <!-- Phone Number -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-stone-500" /> เบอร์โทรศัพท์
              </label>
              <input v-model="phone" type="tel" placeholder="เช่น 0812345678"
                class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none" />
            </div>

            <!-- Quote -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-amber-500" /> คำคมประจำใจ
              </label>
              <textarea v-model="quote" rows="2" placeholder="เช่น ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น"
                class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none resize-none"></textarea>
            </div>

            <!-- Social Media -->
            <div class="space-y-4">
              <!-- Facebook -->
              <div class="bg-blue-50/40 rounded-2xl border border-blue-100 p-4 relative overflow-hidden">
                <div class="flex items-center gap-2 mb-3 relative z-10">
                  <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span class="text-sm font-bold text-blue-900">Facebook</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                  <div class="space-y-1">
                    <label class="block text-[11px] font-semibold text-blue-700">ชื่อที่แสดง (Name)</label>
                    <input v-model="facebook" type="text" placeholder="เช่น Gawin Jaidee"
                      class="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-blue-900" />
                  </div>
                  <div class="space-y-1">
                    <label class="block text-[11px] font-semibold text-blue-700">ลิงก์โปรไฟล์ (URL)</label>
                    <input v-model="facebookUrl" type="text" placeholder="https://facebook.com/gawin.jaidee"
                      class="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none text-blue-600" />
                  </div>
                </div>
              </div>

              <!-- Instagram -->
              <div class="bg-pink-50/40 rounded-2xl border border-pink-100 p-4 relative overflow-hidden">
                <div class="flex items-center gap-2 mb-3 relative z-10">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <span class="text-sm font-bold text-pink-900">Instagram</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                  <div class="space-y-1">
                    <label class="block text-[11px] font-semibold text-pink-700">ชื่อที่แสดง (Name)</label>
                    <input v-model="ig" type="text" placeholder="เช่น gawin_j"
                      class="w-full px-3 py-1.5 bg-white border border-pink-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-500 outline-none text-pink-900" />
                  </div>
                  <div class="space-y-1">
                    <label class="block text-[11px] font-semibold text-pink-700">ลิงก์โปรไฟล์ (URL)</label>
                    <input v-model="igUrl" type="text" placeholder="https://instagram.com/gawin_j"
                      class="w-full px-3 py-1.5 bg-white border border-pink-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-500 outline-none text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="pt-3 border-t border-stone-100 flex items-center justify-end">
              <div class="flex items-center gap-2">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer">
                  ยกเลิก
                </button>
                <button type="submit"
                  class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                  <Check class="w-4 h-4" />
                  บันทึกการแก้ไข
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </Transition>
    
    <!-- Cropper Modal -->
    <ImageCropperModal
      v-model="showCropperModal"
      :image-src="rawImageSrc"
      @cropped="handleCropped"
    />
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .animate-\[bounceIn_0\.3s_ease-out\] {
  transform: scale(0.95) translateY(10px);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
