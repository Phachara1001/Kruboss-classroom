<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Image as ImageIcon, Link as LinkIcon } from '@lucide/vue'
import { announcements, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../data/announcementStore'
import { API_UPLOAD_URL } from '@/config/api'

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentAnnouncementId = ref(null)

const formData = ref({
  image: '',
  url: '',
  isActive: true
})

const fileInput = ref(null)
const isUploading = ref(false)

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  isUploading.value = true

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
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (err) {
    alert('ไม่สามารถอัปโหลดรูปภาพได้: ' + err.message)
  } finally {
    isUploading.value = false
    event.target.value = '' // reset input
  }
}

onMounted(async () => {
  await fetchAnnouncements()
})

const openAddModal = () => {
  isEditing.value = false
  currentAnnouncementId.value = null
  formData.value = { image: '', url: '', isActive: true }
  isModalOpen.value = true
}

const openEditModal = (announcement) => {
  isEditing.value = true
  currentAnnouncementId.value = announcement.id
  formData.value = {
    image: announcement.image,
    url: announcement.url || '',
    isActive: announcement.isActive
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  if (!formData.value.image) {
    alert('กรุณาระบุ URL รูปภาพ')
    return
  }

  const dataToSave = {
    image: formData.value.image,
    url: formData.value.url || null,
    isActive: formData.value.isActive
  }

  let success = false
  if (isEditing.value) {
    success = await updateAnnouncement(currentAnnouncementId.value, dataToSave)
  } else {
    success = await createAnnouncement(dataToSave)
  }

  if (success) {
    isModalOpen.value = false
  } else {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const handleDelete = async (id) => {
  if (confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
    const success = await deleteAnnouncement(id)
    if (!success) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }
}

const toggleActive = async (announcement) => {
  await updateAnnouncement(announcement.id, {
    image: announcement.image,
    url: announcement.url,
    isActive: !announcement.isActive
  })
}

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `http://${url}`
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
      <div>
        <h1 class="text-2xl font-black text-gray-800 flex items-center gap-3">
          <span class="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
            <ImageIcon class="w-6 h-6" />
          </span>
          จัดการประกาศ (Announcements)
        </h1>
        <p class="text-gray-500 mt-1">ตั้งค่าป๊อปอัปประกาศที่จะแสดงเมื่อนักศึกษาเข้าสู่ระบบ</p>
      </div>
      <button @click="openAddModal" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
        <Plus class="w-5 h-5" /> สร้างประกาศใหม่
      </button>
    </div>

    <!-- Announcements List -->
    <div v-if="announcements.length === 0" class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
        <ImageIcon class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-gray-700 mb-2">ยังไม่มีประกาศ</h3>
      <p class="text-gray-500">กดปุ่ม "สร้างประกาศใหม่" เพื่อเริ่มต้นแสดงป๊อปอัปให้นักศึกษา</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="ann in announcements" :key="ann.id" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
        <div class="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
          <img v-if="ann.image" :src="getImageUrl(ann.image)" class="w-full h-full object-cover" />
          <ImageIcon v-else class="w-10 h-10 text-gray-300" />
          
          <div class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border border-white/20"
               :class="ann.isActive ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'">
            {{ ann.isActive ? 'แสดงผลอยู่' : 'ปิดการแสดงผล' }}
          </div>
        </div>
        
        <div class="p-5 flex flex-col flex-1 gap-4">
          <div v-if="ann.url" class="flex items-start gap-2 text-sm text-blue-600 font-medium">
            <LinkIcon class="w-4 h-4 mt-0.5 shrink-0" />
            <a :href="ann.url" target="_blank" class="hover:underline line-clamp-2 break-all">{{ ann.url }}</a>
          </div>
          <div v-else class="text-sm text-gray-400 italic">ไม่มีลิงก์ปลายทาง</div>
          
          <div class="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
            <button @click="toggleActive(ann)" class="flex-1 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center justify-center gap-1"
                    :class="ann.isActive ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'">
              <component :is="ann.isActive ? XCircle : CheckCircle" class="w-4 h-4" />
              {{ ann.isActive ? 'ปิดการแสดง' : 'เปิดการแสดง' }}
            </button>
            <button @click="openEditModal(ann)" class="w-10 h-10 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              <Edit2 class="w-4 h-4" />
            </button>
            <button @click="handleDelete(ann.id)" class="w-10 h-10 flex items-center justify-center rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isModalOpen = false"></div>
          
          <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-[popIn_0.2s_ease-out]">
            <div class="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 class="text-lg font-black text-gray-800">
                {{ isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่' }}
              </h3>
              <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle class="w-6 h-6" />
              </button>
            </div>
            
            <div class="p-6 space-y-5">
              <!-- Image Preview -->
              <div v-if="formData.image" class="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img :src="getImageUrl(formData.image)" class="w-full h-full object-cover" />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">อัปโหลดรูปภาพประกาศ (ภาพป๊อปอัป) *</label>
                
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload">
                
                <button @click="triggerFileUpload" :disabled="isUploading"
                  class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-dashed transition-all cursor-pointer"
                  :class="isUploading ? 'bg-gray-100 border-gray-300 text-gray-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300'">
                  <ImageIcon class="w-5 h-5" />
                  {{ isUploading ? 'กำลังอัปโหลด...' : (formData.image ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพเพื่ออัปโหลด') }}
                </button>

                <p class="text-xs text-emerald-600 font-bold mt-1">ขนาดภาพที่แนะนำ: 800 x 800 พิกเซล (สัดส่วน 1:1) หรือ 800 x 600 พิกเซล (สัดส่วน 4:3)</p>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">ลิงก์ปลายทาง (เมื่อคลิกที่รูปภาพ)</label>
                <select v-model="formData.url" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all cursor-pointer">
                  <option value="">-- ไม่ระบุลิงก์ (ไม่มีการคลิก) --</option>
                  <option value="/">หน้าแรก (Home)</option>
                  <option value="/courses">ห้องเรียน (Courses)</option>
                  <option value="/quests">ภารกิจประจำสัปดาห์ (Quests)</option>
                  <option value="/shop">ร้านค้าและกล่องสุ่ม (Shop)</option>
                  <option value="/inventory">กระเป๋าไอเทม (Inventory)</option>
                  <option value="/schedule">ตารางสอน (Schedule)</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">ถ้าระบุลิงก์ นักศึกษาจะสามารถคลิกที่รูปภาพเพื่อเปิดหน้านี้ได้</p>
              </div>
              
              <div class="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <input v-model="formData.isActive" type="checkbox" id="activeToggle" class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600">
                <label for="activeToggle" class="font-bold text-gray-700 cursor-pointer select-none">
                  เปิดให้แสดงผลทันที
                </label>
              </div>
            </div>
            
            <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button @click="isModalOpen = false" class="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">
                ยกเลิก
              </button>
              <button @click="handleSubmit" class="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm">
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
