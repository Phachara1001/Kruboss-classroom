<script setup>
import { ref, watch, computed } from 'vue'
import { X, Check, User, Phone, Sparkles, AlertCircle, Trash2, GraduationCap, Image as ImageIcon, ChevronRight } from '@lucide/vue'
import { courses } from '../data/courses'
import { updateStudent, deleteStudent } from '../data/studentsStore'
import { getStudentItems, directShopItems } from '../data/shopStore'
import ConfirmModal from './ConfirmModal.vue'
import FrameSelectionModal from './FrameSelectionModal.vue'
import ImageCropperModal from './ImageCropperModal.vue'
import { API_UPLOAD_URL } from '@/config/api'

// Confirm Modal State
const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'confirm',
  onConfirm: null
})

const showConfirm = (title, message, type, onConfirm) => {
  confirmState.value = {
    isOpen: true,
    title,
    message,
    type,
    onConfirm
  }
}

const handleConfirm = () => {
  if (confirmState.value.onConfirm) {
    confirmState.value.onConfirm()
  }
}

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

const emit = defineEmits(['update:modelValue', 'updated', 'deleted'])

const name = ref('')
const nickname = ref('')
const phone = ref('')
const quote = ref('')
const facebook = ref('')
const facebookUrl = ref('')
const ig = ref('')
const igUrl = ref('')
const status = ref('online')
const role = ref('นักศึกษา')
const enrolledCourseIds = ref([])
const equippedFrame = ref('')
const showFrameModal = ref(false)
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
  // Reset input value so the same file can be selected again
  event.target.value = ''
}

const handleCropped = (croppedImageBase64) => {
  croppedAvatar.value = croppedImageBase64
}

const toggleCourse = (cId) => {
  const idx = enrolledCourseIds.value.indexOf(cId)
  if (idx !== -1) {
    if (enrolledCourseIds.value.length === 1) {
      errorMessage.value = 'นักศึกษาต้องเรียนอย่างน้อย 1 รายวิชา'
      return
    }
    enrolledCourseIds.value.splice(idx, 1)
  } else {
    enrolledCourseIds.value.push(cId)
  }
  errorMessage.value = ''
}

watch(
  () => props.student,
  (s) => {
    if (s) {
      name.value = s.name || ''
      nickname.value = s.nickname === '-' ? '' : (s.nickname || '')
      phone.value = s.phone || ''
      quote.value = s.quote === 'ยังไม่ได้ระบุคำคมประจำใจ' ? '' : (s.quote || '')
      facebook.value = s.facebook || ''
      facebookUrl.value = s.facebookUrl || ''
      ig.value = s.ig || ''
      igUrl.value = s.igUrl || ''
      status.value = s.status || 'online'
      role.value = s.role || 'นักศึกษา'
      equippedFrame.value = s.equippedFrame || ''
      enrolledCourseIds.value = Array.isArray(s.courseIds) && s.courseIds.length > 0
        ? [...s.courseIds]
        : [s.courseId || '31901-2007']
      croppedAvatar.value = s.avatar || ''
      errorMessage.value = ''
      successMessage.value = ''
    }
  },
  { immediate: true }
)

const closeModal = () => {
  emit('update:modelValue', false)
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSave = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!props.student) return

  if (!name.value.trim()) {
    errorMessage.value = 'ชื่อ-นามสกุลต้องไม่เว้นว่าง'
    return
  }

  try {
    let finalAvatar = props.student.avatar || ''
    if (croppedAvatar.value && croppedAvatar.value.startsWith('data:')) {
      try {
        const blob = await fetch(croppedAvatar.value).then(r => r.blob())
        const uploadData = new FormData()
        uploadData.append('file', blob, `avatar-${props.student.studentId || props.student.id}-${Date.now()}.png`)
        const uploadRes = await fetch(API_UPLOAD_URL, {
          method: 'POST',
          body: uploadData
        })
        const uploadDataJson = await uploadRes.json()
        if (uploadDataJson.success && uploadDataJson.url) {
          finalAvatar = uploadDataJson.url
        }
      } catch (uploadErr) {
        console.error('Failed to upload avatar to MinIO:', uploadErr)
      }
    } else if (croppedAvatar.value) {
      finalAvatar = croppedAvatar.value
    }

    const updated = await updateStudent(props.student.id, {
      name: name.value.trim(),
      nickname: nickname.value.trim() || '-',
      phone: phone.value.trim(),
      quote: quote.value.trim() || 'ยังไม่ได้ระบุคำคมประจำใจ',
      facebook: facebook.value.trim(),
      facebookUrl: facebookUrl.value.trim(),
      ig: ig.value.trim(),
      igUrl: igUrl.value.trim(),
      status: status.value,
      role: role.value,
      equippedFrame: equippedFrame.value,
      courseIds: enrolledCourseIds.value,
      avatar: finalAvatar
    })

    successMessage.value = 'บันทึกข้อมูลเรียบร้อยแล้ว!'
    emit('updated', updated)

    setTimeout(() => {
      closeModal()
    }, 800)
  } catch (err) {
    errorMessage.value = err.message || 'เกิดข้อผิดพลาดในการบันทึก'
  }
}

const handleDelete = () => {
  if (!props.student) return
  showConfirm(
    'ยืนยันการลบข้อมูล',
    `คุณต้องการลบข้อมูลของ ${props.student.name} (${props.student.studentId}) ออกจากรายวิชานี้ใช่หรือไม่?`,
    'danger',
    () => {
      const deleted = deleteStudent(props.student.id)
      emit('deleted', deleted)
      closeModal()
    }
  )
}
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
  const ownedFrameImagePaths = inventory.filter(item => item.itemType === 'frame').map(item => item.image)

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
            class="px-6 py-5 bg-gradient-to-r from-stone-800 to-stone-900 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div
                class="relative w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md shadow-sm border border-white/20 shrink-0">
                <!-- Frame overlay in header -->
                <img v-if="equippedFrame" :src="equippedFrame"
                  class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <User class="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 class="font-black text-lg text-white leading-tight">แก้ไขข้อมูลส่วนตัวนักศึกษา</h3>
                <p class="text-xs text-stone-300">รหัส {{ student.studentId }} • ห้อง {{ student.classroom }}</p>
              </div>
            </div>

            <button @click="closeModal"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body Form -->
          <form @submit.prevent="handleSave" class="p-6 overflow-y-auto space-y-4 text-stone-800 no-scrollbar">

            <!-- Alert Messages -->
            <div v-if="errorMessage"
              class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0 text-red-500" />
              <span>{{ errorMessage }}</span>
            </div>

            <div v-if="successMessage"
              class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
              <Check class="w-4 h-4 text-emerald-600" />
              <span>{{ successMessage }}</span>
            </div>

            <!-- Profile Picture Upload -->
            <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center gap-3">
              <div class="relative w-20 h-20 group">
                <img v-if="equippedFrame" :src="equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-black text-stone-700 border-2 border-white shadow-sm overflow-hidden relative z-0">
                  <img v-if="croppedAvatar && (croppedAvatar.startsWith('data:') || croppedAvatar.includes('/') || croppedAvatar.includes('http'))" :src="croppedAvatar" class="w-full h-full object-cover object-top" />
                  <span v-else>{{ student.avatar }}</span>
                  
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
            </div>

            <!-- Student ID (Readonly) -->
            <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span class="text-stone-500 block">รหัสนักศึกษา (ไม่สามารถแก้ไขได้)</span>
                <span class="font-bold font-mono text-sm text-stone-800">{{ student.studentId }}</span>
              </div>
              <span class="px-2.5 py-1 bg-stone-200 text-stone-700 font-bold rounded-lg text-[11px]">
                ห้อง {{ student.classroom }}
              </span>
            </div>

            <!-- Enrolled Courses Selection (รองรับเรียนมากกว่า 1 วิชา) -->
            <div class="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <GraduationCap class="w-3.5 h-3.5 text-emerald-600" />
                  รายวิชาที่นักศึกษาลงทะเบียนเรียน ({{ enrolledCourseIds.length }} วิชา)
                </label>
                <span class="text-[10px] text-stone-500">คลิกเพื่อเพิ่ม/ลดวิชา</span>
              </div>
              <div class="grid grid-cols-1 gap-1.5">
                <button v-for="c in courses" :key="c.id" type="button" @click="toggleCourse(c.id)" :class="[
                  'px-3 py-2 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-all cursor-pointer',
                  enrolledCourseIds.includes(c.id)
                    ? 'bg-white border-emerald-400 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-400/40'
                    : 'bg-white/60 border-stone-200 text-stone-500 hover:bg-white hover:text-stone-800'
                ]">
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'w-4 h-4 rounded-md flex items-center justify-center text-[10px] border',
                      enrolledCourseIds.includes(c.id)
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    ]">
                      <Check v-if="enrolledCourseIds.includes(c.id)" class="w-3 h-3" />
                    </span>
                    <span>{{ c.name }}</span>
                  </div>
                  <span class="text-[10px] text-stone-400">{{ c.level }}</span>
                </button>
              </div>
            </div>

            <!-- Name & Nickname -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-stone-700">ชื่อ-นามสกุล</label>
                <input v-model="name" type="text"
                  class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none" />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-bold text-stone-700">ชื่อเล่น</label>
                <input v-model="nickname" type="text" placeholder="เช่น นัท, บอส, วิน"
                  class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none" />
              </div>
            </div>

            <!-- Role & Status -->
            <div class="space-y-3">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-stone-700">ตำแหน่ง / บทบาทในห้อง</label>
                <select v-model="role"
                  class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer">
                  <option value="นักศึกษา">นักศึกษา</option>
                  <option value="หัวหน้าห้อง">หัวหน้าห้อง</option>
                  <option value="รองหัวหน้าห้อง">รองหัวหน้าห้อง</option>
                </select>
              </div>

            </div>

            <!-- Profile Frame Selection -->
            <div class="space-y-2 pt-2 border-t border-stone-100">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <ImageIcon class="w-3.5 h-3.5 text-indigo-500" /> กรอบรูปโปรไฟล์
              </label>
              <div class="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600 border border-stone-300">
                    {{ student?.avatar || 'U' }}
                    <img v-if="equippedFrame" :src="equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold text-stone-800">{{ equippedFrame ? 'กำลังสวมใส่' : 'ไม่มีกรอบโปรไฟล์' }}</p>
                    <p class="text-xs text-stone-500">ไปที่เมนูกระเป๋าเพื่อเปลี่ยนกรอบรูป</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phone Number -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-stone-500" /> เบอร์โทรศัพท์
              </label>
              <input v-model="phone" type="tel" placeholder="เช่น 0812345678"
                class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none" />
            </div>

            <!-- Quote -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-amber-500" /> คำคมประจำใจ
              </label>
              <textarea v-model="quote" rows="2" placeholder="เช่น ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น"
                class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none resize-none"></textarea>
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
            <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button type="button" @click="handleDelete"
                class="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="ลบนักศึกษาคนนี้ออกจากห้อง">
                <Trash2 class="w-4 h-4" />
                ลบนักศึกษา
              </button>

              <div class="flex items-center gap-2">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer">
                  ยกเลิก
                </button>
                <button type="submit"
                  class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
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

  <!-- Global Confirm Modal -->
  <ConfirmModal v-model="confirmState.isOpen" :title="confirmState.title" :message="confirmState.message"
    :type="confirmState.type" @confirm="handleConfirm" />

  <!-- Frame Selection Modal -->
  <FrameSelectionModal v-model="showFrameModal" v-model:selectedFrame="equippedFrame"
    :avatarText="student?.avatar || 'U'" :frames="availableFrames" />

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
