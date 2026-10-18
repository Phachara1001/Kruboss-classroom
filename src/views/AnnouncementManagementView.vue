<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Trash2, Pencil, Image as ImageIcon, Link as LinkIcon, X,
  UploadCloud, Megaphone, Eye, EyeOff, Loader2, MousePointerClick
} from '@lucide/vue'
import { announcements, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../data/announcementStore'
import { API_UPLOAD_URL } from '@/config/api'

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const currentAnnouncementId = ref(null)
const activeFilter = ref('all')
const isDragging = ref(false)

const formData = ref({ image: '', url: '', isActive: true })

const fileInput = ref(null)
const isUploading = ref(false)

const linkOptions = [
  { value: '', label: 'ไม่ระบุลิงก์ (ดูรูปอย่างเดียว)' },
  { value: '/', label: 'หน้าแรก' },
  { value: '/courses', label: 'ห้องเรียน' },
  { value: '/quests', label: 'ภารกิจประจำสัปดาห์' },
  { value: '/shop', label: 'ร้านค้าและกล่องสุ่ม' },
  { value: '/inventory', label: 'กระเป๋าไอเทม' },
  { value: '/schedule', label: 'ตารางสอน' }
]

const linkLabel = (url) => linkOptions.find((o) => o.value === url)?.label || url

const stats = computed(() => {
  const total = announcements.value.length
  const active = announcements.value.filter((a) => a.isActive).length
  return { total, active, inactive: total - active }
})

const filters = computed(() => [
  { key: 'all', label: 'ทั้งหมด', count: stats.value.total },
  { key: 'active', label: 'แสดงผลอยู่', count: stats.value.active },
  { key: 'inactive', label: 'ปิดการแสดงผล', count: stats.value.inactive }
])

const filteredAnnouncements = computed(() => {
  if (activeFilter.value === 'active') return announcements.value.filter((a) => a.isActive)
  if (activeFilter.value === 'inactive') return announcements.value.filter((a) => !a.isActive)
  return announcements.value
})

const triggerFileUpload = () => fileInput.value?.click()

const uploadFile = async (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
    return
  }

  isUploading.value = true
  const uploadData = new FormData()
  uploadData.append('file', file)

  try {
    const res = await fetch(API_UPLOAD_URL, { method: 'POST', body: uploadData })
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
  }
}

const handleFileUpload = async (event) => {
  await uploadFile(event.target.files?.[0])
  event.target.value = ''
}

const handleDrop = async (event) => {
  isDragging.value = false
  await uploadFile(event.dataTransfer?.files?.[0])
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
    alert('กรุณาอัปโหลดรูปภาพประกาศ')
    return
  }

  const dataToSave = {
    image: formData.value.image,
    url: formData.value.url || null,
    isActive: formData.value.isActive
  }

  isSaving.value = true
  let success = false
  if (isEditing.value) {
    success = await updateAnnouncement(currentAnnouncementId.value, dataToSave)
  } else {
    success = await createAnnouncement(dataToSave)
  }
  isSaving.value = false

  if (success) {
    isModalOpen.value = false
  } else {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const handleDelete = async (id) => {
  if (confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
    const success = await deleteAnnouncement(id)
    if (!success) alert('เกิดข้อผิดพลาดในการลบข้อมูล')
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
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed
  }
  return `https://${trimmed}`
}

const onImgError = (e) => {
  e.target.style.display = 'none'
  e.target.nextElementSibling?.classList.remove('hidden')
}
</script>

<template>
  <div class="w-full space-y-6 pb-20 animate-fade-in">
    <!-- Hero header -->
    <section
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10">
      <div class="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div>
      <div class="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl">
      </div>

      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start gap-4">
          <span
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Megaphone class="h-7 w-7" />
          </span>
          <div>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">จัดการประกาศ</h1>
            <p class="mt-1 max-w-md text-sm leading-relaxed text-emerald-50/90 sm:text-base">
              ป๊อปอัปที่นักศึกษาจะเห็นทันทีหลังเข้าสู่ระบบ อัปโหลดรูป เลือกหน้าปลายทาง แล้วเปิดใช้งานได้เลย
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex gap-3">
            <div class="min-w-24 rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
              <p class="text-2xl font-black leading-none">{{ stats.total }}</p>
              <p class="mt-1 text-xs text-emerald-50/80">ประกาศทั้งหมด</p>
            </div>
            <div class="min-w-24 rounded-2xl bg-white px-4 py-3 text-emerald-700 shadow-sm">
              <p class="text-2xl font-black leading-none">{{ stats.active }}</p>
              <p class="mt-1 text-xs text-emerald-600/80">แสดงผลอยู่</p>
            </div>
          </div>
          <button @click="openAddModal"
            class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-emerald-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Plus class="h-5 w-5" /> สร้างประกาศใหม่
          </button>
        </div>
      </div>
    </section>

    <!-- Filter tabs -->
    <div v-if="announcements.length > 0" class="flex flex-wrap gap-2">
      <button v-for="f in filters" :key="f.key" @click="activeFilter = f.key"
        class="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition" :class="activeFilter === f.key
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'bg-white text-stone-500 ring-1 ring-stone-200 hover:text-emerald-700 hover:ring-emerald-300'">
        {{ f.label }}
        <span class="rounded-full px-2 py-0.5 text-xs"
          :class="activeFilter === f.key ? 'bg-white/20' : 'bg-stone-100 text-stone-500'">{{ f.count }}</span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="announcements.length === 0"
      class="flex flex-col items-center rounded-[2rem] border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-20 text-center">
      <div
        class="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-emerald-400 shadow-sm ring-1 ring-emerald-100">
        <ImageIcon class="h-10 w-10" stroke-width="1.5" />
      </div>
      <h3 class="text-xl font-black text-stone-700">ยังไม่มีประกาศ</h3>
      <p class="mt-1 max-w-sm text-sm text-stone-500">สร้างประกาศแรกเพื่อแสดงป๊อปอัปให้นักศึกษาเห็นเมื่อเข้าสู่ระบบ</p>
      <button @click="openAddModal"
        class="mt-6 flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-emerald-700">
        <Plus class="h-5 w-5" /> สร้างประกาศใหม่
      </button>
    </div>

    <div v-else-if="filteredAnnouncements.length === 0"
      class="rounded-3xl bg-white py-16 text-center text-sm text-stone-500 ring-1 ring-stone-200">
      ไม่มีประกาศในหมวดนี้
    </div>

    <!-- Cards -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <article v-for="ann in filteredAnnouncements" :key="ann.id"
        class="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10 hover:ring-emerald-300"
        :class="{ 'opacity-80': !ann.isActive }">
        <div class="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <img v-if="ann.image" :src="getImageUrl(ann.image)"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            :class="{ 'grayscale': !ann.isActive }" @error="onImgError" />
          <div
            :class="['flex h-full w-full flex-col items-center justify-center gap-2 text-stone-400', ann.image ? 'hidden' : '']">
            <ImageIcon class="h-10 w-10" stroke-width="1.25" />
            <span class="text-xs font-medium">รูปภาพไม่พร้อมใช้งาน</span>
          </div>

          <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent">
          </div>

          <span
            class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur"
            :class="ann.isActive ? 'text-emerald-700' : 'text-stone-500'">
            <span class="relative flex h-2 w-2">
              <span v-if="ann.isActive"
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full"
                :class="ann.isActive ? 'bg-emerald-500' : 'bg-stone-400'"></span>
            </span>
            {{ ann.isActive ? 'แสดงผลอยู่' : 'ปิดการแสดงผล' }}
          </span>

          <!-- Hover actions -->
          <div
            class="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
            <button @click="openEditModal(ann)" title="แก้ไข" aria-label="แก้ไขประกาศ"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/95 text-stone-700 shadow-sm backdrop-blur transition hover:bg-emerald-600 hover:text-white">
              <Pencil class="h-4 w-4" />
            </button>
            <button @click="handleDelete(ann.id)" title="ลบ" aria-label="ลบประกาศ"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/95 text-rose-600 shadow-sm backdrop-blur transition hover:bg-rose-600 hover:text-white">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="flex flex-1 flex-col gap-4 p-5">
          <div v-if="ann.url" class="flex items-center gap-2.5 rounded-2xl bg-sky-50 px-3.5 py-2.5 text-sky-700">
            <LinkIcon class="h-4 w-4 shrink-0" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">{{ linkLabel(ann.url) }}</p>
              <a :href="ann.url" target="_blank" rel="noopener noreferrer"
                class="block truncate font-mono text-xs text-sky-600/80 hover:underline">{{ ann.url }}</a>
            </div>
          </div>
          <div v-else class="flex items-center gap-2.5 rounded-2xl bg-stone-50 px-3.5 py-2.5 text-stone-400">
            <MousePointerClick class="h-4 w-4 shrink-0" />
            <p class="text-sm">ไม่มีลิงก์ปลายทาง ดูรูปภาพอย่างเดียว</p>
          </div>

          <div class="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
            <span class="flex items-center gap-1.5 text-sm font-bold"
              :class="ann.isActive ? 'text-emerald-700' : 'text-stone-400'">
              <component :is="ann.isActive ? Eye : EyeOff" class="h-4 w-4" />
              {{ ann.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
            </span>
            <button type="button" role="switch" :aria-checked="ann.isActive"
              :aria-label="ann.isActive ? 'ปิดการแสดงประกาศ' : 'เปิดการแสดงประกาศ'" @click="toggleActive(ann)"
              class="relative h-7 w-12 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              :class="ann.isActive ? 'bg-emerald-500' : 'bg-stone-300'">
              <span class="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
                :class="ann.isActive ? 'translate-x-5' : 'translate-x-0'"></span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>

          <div
            class="modal-panel relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem] md:flex-row">
            <!-- Live preview -->
            <div
              class="relative flex shrink-0 flex-col items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 p-6 md:w-[22rem] md:p-8">
              <p class="mb-4 self-start text-sm font-bold text-stone-300">ตัวอย่างที่นักศึกษาจะเห็น</p>

              <div class="w-full max-w-[16rem] md:max-w-none">
                <div class="relative overflow-hidden rounded-2xl bg-stone-700/60 shadow-2xl ring-1 ring-white/10">
                  <img v-if="formData.image" :src="getImageUrl(formData.image)" class="aspect-[4/3] w-full object-cover"
                    alt="ตัวอย่างประกาศ" />
                  <div v-else
                    class="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-stone-400">
                    <ImageIcon class="h-10 w-10" stroke-width="1.25" />
                    <span class="text-xs">ยังไม่ได้เลือกรูปภาพ</span>
                  </div>
                  <span
                    class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white">
                    <X class="h-4 w-4" />
                  </span>
                </div>
                <p v-if="formData.url" class="mt-3 flex items-center justify-center gap-1.5 text-xs text-sky-300">
                  <MousePointerClick class="h-3.5 w-3.5" /> แตะรูปเพื่อไปที่ {{ linkLabel(formData.url) }}
                </p>
                <p v-else class="mt-3 text-center text-xs text-stone-400">แตะรูปแล้วไม่มีการเปลี่ยนหน้า</p>
              </div>
            </div>

            <!-- Form -->
            <div class="flex min-h-0 flex-1 flex-col">
              <div class="flex items-center justify-between px-6 pb-2 pt-6 sm:px-8">
                <h3 class="text-xl font-black text-stone-800">{{ isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่' }}</h3>
                <button @click="isModalOpen = false" aria-label="ปิด"
                  class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
                  <X class="h-5 w-5" />
                </button>
              </div>

              <div class="flex-1 space-y-6 overflow-y-auto px-6 py-4 sm:px-8">
                <!-- Upload -->
                <div>
                  <label class="mb-2 block text-sm font-bold text-stone-700">รูปภาพประกาศ <span
                      class="text-rose-500">*</span></label>
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

                  <button type="button" @click="triggerFileUpload" @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" :disabled="isUploading"
                    class="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition disabled:cursor-wait"
                    :class="isDragging
                      ? 'border-emerald-500 bg-emerald-100/70'
                      : isUploading
                        ? 'border-stone-200 bg-stone-50 text-stone-400'
                        : 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-50'">
                    <Loader2 v-if="isUploading" class="h-7 w-7 animate-spin text-emerald-500" />
                    <UploadCloud v-else class="h-7 w-7 text-emerald-600" />
                    <span class="text-sm font-bold" :class="isUploading ? 'text-stone-500' : 'text-emerald-700'">
                      {{ isUploading ? 'กำลังอัปโหลด...' : (formData.image ? 'เปลี่ยนรูปภาพ' :
                      'เลือกรูปภาพหรือลากมาวางที่นี่') }}
                    </span>
                    <span class="text-xs text-stone-500">แนะนำ 800 × 800 px (1:1) หรือ 800 × 600 px (4:3)</span>
                  </button>
                </div>

                <!-- Link -->
                <div>
                  <label class="mb-2 block text-sm font-bold text-stone-700">ลิงก์ปลายทาง</label>
                  <div class="relative">
                    <LinkIcon
                      class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <select v-model="formData.url"
                      class="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                      <option v-for="o in linkOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <p class="mt-1.5 text-xs text-stone-500">เมื่อเลือกหน้า นักศึกษาจะแตะรูปเพื่อเปิดหน้านั้นได้</p>
                </div>

                <!-- Active -->
                <label for="activeToggle"
                  class="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div>
                    <p class="font-bold text-stone-800">เปิดให้แสดงผลทันที</p>
                    <p class="text-xs text-stone-500">ปิดไว้ก่อนได้ แล้วเปิดภายหลังจากหน้ารายการ</p>
                  </div>
                  <input v-model="formData.isActive" type="checkbox" id="activeToggle" class="peer sr-only" />
                  <span
                    class="relative h-7 w-12 shrink-0 rounded-full bg-stone-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-500 peer-checked:[&>span]:translate-x-5">
                    <span
                      class="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"></span>
                  </span>
                </label>
              </div>

              <div class="flex justify-end gap-3 border-t border-stone-100 bg-stone-50/70 px-6 py-4 sm:px-8">
                <button @click="isModalOpen = false"
                  class="cursor-pointer rounded-xl px-5 py-2.5 font-bold text-stone-500 transition hover:bg-stone-200">
                  ยกเลิก
                </button>
                <button @click="handleSubmit" :disabled="isSaving || isUploading"
                  class="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                  <Loader2 v-if="isSaving" class="h-4 w-4 animate-spin" />
                  {{ isEditing ? 'บันทึกการแก้ไข' : 'สร้างประกาศ' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

  .animate-fade-in,
  .modal-fade-enter-active .modal-panel,
  .modal-fade-leave-active .modal-panel {
    animation: none;
    transition: none;
  }
}
</style>