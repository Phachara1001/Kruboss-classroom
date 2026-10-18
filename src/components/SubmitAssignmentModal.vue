<script setup>
import { ref, computed, watch } from 'vue'
import { X, UploadCloud, Link as LinkIcon, FileText, CheckCircle2, AlertCircle, Pencil } from '@lucide/vue'
import { authUser } from '@/data/authStore'
import { submissionsStore, submitAssignmentLink, fetchSubmissions, formatExternalUrl } from '@/data/gradesStore'

const props = defineProps({
  isOpen: Boolean,
  courseId: String,
  assignmentId: String,
  assignmentTitle: String,
  initialEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const linkUrl = ref('')
const studentNote = ref('')
const isSubmitting = ref(false)
const isEditing = ref(false)

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const studentId = computed(() => authUser.value?.studentId || authUser.value?.id)

const submissionKey = computed(() => {
  if (!studentId.value || isTeacher.value) return null
  return `${props.courseId}_${studentId.value}_${props.assignmentId}`
})

const currentSubmission = computed(() => {
  if (!submissionKey.value) return null
  return submissionsStore.value[submissionKey.value] ||
    (authUser.value?.id ? submissionsStore.value[`${props.courseId}_${authUser.value.id}_${props.assignmentId}`] : null)
})

const startEdit = () => {
  if (currentSubmission.value) {
    linkUrl.value = currentSubmission.value.link || ''
    studentNote.value = currentSubmission.value.note || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  linkUrl.value = ''
  studentNote.value = ''
  isEditing.value = false
}

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialEdit) {
      startEdit()
    } else {
      isEditing.value = false
    }
    if (props.courseId) {
      fetchSubmissions(props.courseId)
    }
  }
})

const handleSubmit = async () => {
  if (!linkUrl.value) return
  isSubmitting.value = true

  try {
    await submitAssignmentLink(
      props.courseId,
      studentId.value,
      props.assignmentId,
      linkUrl.value,
      studentNote.value
    )
    linkUrl.value = ''
    studentNote.value = ''
    isEditing.value = false
    await fetchSubmissions(props.courseId)
    emit('close')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
        <h3 class="font-bold text-xl flex items-center gap-2">
          <UploadCloud class="w-6 h-6" />
          <span>{{ isEditing ? 'แก้ไขลิงก์ส่งงาน' : 'ส่งงาน' }}: {{ assignmentTitle }}</span>
        </h3>
        <button @click="emit('close')" class="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 md:p-8 space-y-6">

        <!-- Already Submitted View (Only when NOT editing) -->
        <div v-if="currentSubmission && !isEditing"
          class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h4 class="text-xl font-bold text-emerald-800">ส่งงานเรียบร้อยแล้ว!</h4>
          <p class="text-emerald-600 text-sm">ส่งเมื่อ: {{ currentSubmission.submittedAt }}</p>

          <div class="mt-4 p-3 bg-white rounded-xl border border-emerald-100 text-left">
            <p class="text-xs text-stone-500 font-bold mb-1 uppercase">แนบลิงก์ (Link)</p>
            <a :href="formatExternalUrl(currentSubmission.link)" target="_blank" rel="noopener noreferrer"
              class="text-blue-600 hover:underline text-sm break-all flex items-center gap-2">
              <LinkIcon class="w-4 h-4 shrink-0" /> {{ currentSubmission.link }}
            </a>

            <template v-if="currentSubmission.note">
              <p class="text-xs text-stone-500 font-bold mt-3 mb-1 uppercase">หมายเหตุถึงผู้สอน</p>
              <p class="text-sm text-stone-700 bg-stone-50 p-2 rounded-lg">{{ currentSubmission.note }}</p>
            </template>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button @click="startEdit"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer">
              <Pencil class="w-4 h-4" /> แก้ไขลิงก์ส่งงาน
            </button>
            <button @click="emit('close')"
              class="py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

        <!-- Submission Form View (When not yet submitted OR in editing mode) -->
        <div v-else class="space-y-6">

          <!-- Mode banner if editing -->
          <div v-if="isEditing"
            class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-bold">
            <span class="flex items-center gap-1.5">
              <Pencil class="w-4 h-4 text-amber-600" /> โหมดแก้ไขลิงก์ผลงาน
            </span>
            <button v-if="currentSubmission" type="button" @click="cancelEdit"
              class="text-stone-500 hover:text-stone-800 underline font-normal cursor-pointer">
              ยกเลิก
            </button>
          </div>

          <!-- Instructions -->
          <div v-else class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div class="text-sm text-blue-800 leading-relaxed">
              <p class="font-bold mb-1">คำแนะนำการส่งงานแบบแปะลิงก์</p>
              <ol class="list-decimal list-inside space-y-1 ml-1 text-blue-700/90">
                <li>อัปโหลดไฟล์งาน (PDF, รูปภาพ ฯลฯ) ลงใน <strong>Google Drive</strong> หรือ <strong>OneDrive</strong>
                  ของตนเอง
                </li>
                <li>ตั้งค่าการแชร์ (Share) เป็น <strong>"ทุกคนที่มีลิงก์ (Anyone with the link)"</strong>
                  เพื่อให้ผู้สอนสามารถเปิดดูได้</li>
                <li>คัดลอกลิงก์มาวางในช่องด้านล่าง แล้วกดส่งงาน</li>
              </ol>
            </div>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <LinkIcon class="w-4 h-4 text-stone-500" /> ลิงก์ผลงาน (URL) <span class="text-red-500">*</span>
              </label>
              <input v-model="linkUrl" type="url" placeholder="https://drive.google.com/file/d/..."
                class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm" />
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <FileText class="w-4 h-4 text-stone-500" /> ข้อความเพิ่มเติมถึงผู้สอน (ถ้ามี)
              </label>
              <textarea v-model="studentNote" rows="2" placeholder="พิมพ์ข้อความที่ต้องการแจ้งผู้สอน..."
                class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm resize-none"></textarea>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button v-if="isEditing && currentSubmission" type="button" @click="cancelEdit"
              class="py-3.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all cursor-pointer">
              ยกเลิก
            </button>
            <button @click="handleSubmit" :disabled="!linkUrl || isSubmitting" :class="[
              'flex-1 py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm',
              linkUrl
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            ]">
              <UploadCloud v-if="!isSubmitting" class="w-5 h-5" />
              <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSubmitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไขลิงก์' : 'ยืนยันการส่งงาน') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
