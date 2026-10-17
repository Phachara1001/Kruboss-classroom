<script setup>
import { ref, watch, computed } from 'vue'
import { X, UserPlus, ShieldCheck, Shield, User, Users, GraduationCap, School, AlertCircle, Info, Check } from '@lucide/vue'
import { courses } from '../data/courses'
import { addStudent, courseClassrooms } from '../data/studentsStore'
import * as xlsx from 'xlsx'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  defaultCourseId: {
    type: String,
    default: '31901-2007'
  },
  defaultClassroom: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'added'])

// Form State
const selectedClassroom = ref('ปวส.1/1')
const selectedCourseIds = ref([props.defaultCourseId || '31901-2007'])
const studentId = ref('')
const namePrefix = ref('นาย')
const fullName = ref('')
const selectedRole = ref('นักศึกษา') // 'หัวหน้าห้อง' | 'รองหัวหน้าห้อง' | 'นักศึกษา'
const errorMessage = ref('')
const successMessage = ref('')
const fileInput = ref(null)
const importedStudentsPreview = ref([])

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleExcelImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  errorMessage.value = ''
  successMessage.value = ''
  importedStudentsPreview.value = []
  
  try {
    const data = await file.arrayBuffer()
    const workbook = xlsx.read(data)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 })
    
    let level = 'ปวช.'
    let year = '1'
    let group = '1'

    for (let r = 0; r < Math.min(10, rows.length); r++) {
      const row = rows[r]
      if (!Array.isArray(row)) continue
      for (const cell of row) {
        if (typeof cell === 'string') {
          if (cell.includes('ประกาศนียบัตรวิชาชีพชั้นสูง')) level = 'ปวส.'
          else if (cell.includes('ประกาศนียบัตรวิชาชีพ')) level = 'ปวช.'
          
          if (cell.includes('ชั้นปีที่')) {
            const m = cell.match(/ชั้นปีที่\s*(\d+)/)
            if (m) year = m[1]
          }
          
          if (cell.includes('กลุ่มเรียนที่')) {
            const m = cell.match(/กลุ่มเรียนที่\s*(\d+)/)
            if (m) group = m[1]
          }
        }
      }
    }
    
    const parsedRoom = `${level}${year}/${group}`
    
    if (!allKnownClassrooms.value.includes(parsedRoom)) {
      allKnownClassrooms.value.push(parsedRoom)
    }
    
    selectedClassroom.value = parsedRoom
    suggestCoursesForClassroom(parsedRoom)

    let tempPreview = []
    for (const row of rows) {
      if (!Array.isArray(row)) continue

      
      const exactId = row[2] ? String(row[2]).trim() : null
      const exactName = row[6] ? String(row[6]).trim() : null
      
      const idStr = row.find(cell => typeof cell === 'string' && /^\d{10,13}$/.test(cell.trim()))
      
      let finalId = exactId || idStr
      let finalName = exactName
      
      if (finalId && finalName && /[0-9]/.test(finalId)) {
         tempPreview.push({
           studentId: finalId.trim(),
           name: finalName.trim()
         })
      }
    }
    
    if (tempPreview.length > 0) {
      importedStudentsPreview.value = tempPreview
      successMessage.value = `อ่านไฟล์สำเร็จ พบรายชื่อนักศึกษา ${tempPreview.length} คน กรุณาตรวจสอบและกดบันทึกข้อมูล`
    } else {
      errorMessage.value = 'ไม่พบข้อมูลนักศึกษาในไฟล์ Excel กรุณาตรวจสอบรูปแบบไฟล์'
    }
  } catch (err) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel'
    console.error(err)
  }
  
  if (fileInput.value) fileInput.value.value = ''
}

// All known classrooms
const allKnownClassrooms = ref(['ปวส.1/1', 'ปวช.2/1', 'ปวช.2/2', 'ปวช.3/2'])

// Auto select courses matching the classroom when classroom changes
const suggestCoursesForClassroom = (room) => {
  if (!room) return
  if (room.startsWith('ปวส.1')) {
    // ปวส.1 usually takes Database (31901-2007) and Data Analysis (31901-2012)
    selectedCourseIds.value = ['31901-2007', '31901-2012']
  } else if (room.startsWith('ปวช.2')) {
    selectedCourseIds.value = ['21901-2012']
  } else if (room.startsWith('ปวช.3')) {
    selectedCourseIds.value = ['21901-2007']
  }
}

// Toggle course selection
const toggleCourse = (cId) => {
  const idx = selectedCourseIds.value.indexOf(cId)
  if (idx !== -1) {
    if (selectedCourseIds.value.length === 1) {
      errorMessage.value = 'นักศึกษาต้องเรียนอย่างน้อย 1 รายวิชา'
      return
    }
    selectedCourseIds.value.splice(idx, 1)
  } else {
    selectedCourseIds.value.push(cId)
  }
  errorMessage.value = ''
}

// Sync props when opening
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      selectedClassroom.value = props.defaultClassroom || 'ปวส.1/1'
      
      // If opened from a specific course, include that course
      if (props.defaultCourseId) {
        if (selectedClassroom.value.startsWith('ปวส.1')) {
          selectedCourseIds.value = ['31901-2007', '31901-2012']
        } else {
          selectedCourseIds.value = [props.defaultCourseId]
        }
      } else {
        suggestCoursesForClassroom(selectedClassroom.value)
      }

      studentId.value = ''
      fullName.value = ''
      selectedRole.value = 'นักศึกษา'
      errorMessage.value = ''
      successMessage.value = ''
      importedStudentsPreview.value = []
    }
  }
)

const closeModal = () => {
  emit('update:modelValue', false)
  errorMessage.value = ''
  successMessage.value = ''
  importedStudentsPreview.value = []
}

const handleSubmit = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (selectedCourseIds.value.length === 0) {
    errorMessage.value = 'กรุณาเลือกรายวิชาที่เรียนอย่างน้อย 1 วิชา'
    return
  }

  // Handle batch import mode
  if (importedStudentsPreview.value.length > 0) {
    try {
      importedStudentsPreview.value.forEach(student => {
         addStudent({
           courseIds: selectedCourseIds.value,
           courseId: selectedCourseIds.value[0],
           classroom: selectedClassroom.value,
           studentId: student.studentId,
           name: student.name,
           role: 'นักศึกษา'
         })
      })
      successMessage.value = `นำเข้านักศึกษาสำเร็จ ${importedStudentsPreview.value.length} คน ประจำห้อง ${selectedClassroom.value}!`
      emit('added')
      setTimeout(() => { closeModal() }, 1500)
    } catch (err) {
      errorMessage.value = err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลนำเข้า'
    }
    return
  }

  // Handle single student mode
  const cleanStudentId = studentId.value.trim()
  const cleanName = fullName.value.trim()

  if (!cleanStudentId) {
    errorMessage.value = 'กรุณากรอกรหัสนักศึกษา'
    return
  }

  if (!cleanName) {
    errorMessage.value = 'กรุณากรอกชื่อ-นามสกุล'
    return
  }

  // Combine prefix if not already present
  let finalName = cleanName
  if (!finalName.startsWith('นาย') && !finalName.startsWith('นางสาว') && !finalName.startsWith('นาง')) {
    finalName = `${namePrefix.value}${finalName}`
  }

  try {
    const created = addStudent({
      courseIds: selectedCourseIds.value,
      courseId: selectedCourseIds.value[0],
      classroom: selectedClassroom.value,
      studentId: cleanStudentId,
      name: finalName,
      role: selectedRole.value
    })

    successMessage.value = `เพิ่ม ${finalName} ประจำห้อง ${selectedClassroom.value} เข้าสู่ ${selectedCourseIds.value.length} รายวิชาเรียบร้อยแล้ว!`
    emit('added', created)

    setTimeout(() => {
      closeModal()
    }, 1000)
  } catch (err) {
    errorMessage.value = err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-sm"
      >
        <!-- Backdrop click to close -->
        <div class="absolute inset-0" @click="closeModal"></div>

        <!-- Modal Dialog -->
        <div class="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-[bounceIn_0.3s_ease-out] flex flex-col max-h-[92vh]">
          
          <!-- Header -->
          <div class="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-md shadow-sm border border-white/20">
                <UserPlus class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-lg text-white leading-tight">เพิ่มนักศึกษา / นำเข้า Excel</h3>
                <p class="text-xs text-emerald-100">รองรับห้องที่เรียนวิชาเดียว หรือเรียนพร้อมกันหลายวิชา</p>
              </div>
            </div>
            
            <button 
              @click="closeModal" 
              class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body Form -->
          <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5 text-stone-800 no-scrollbar">
            
            <!-- Alert Messages -->
            <div v-if="errorMessage" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-[shake_0.4s_ease-in-out]">
              <AlertCircle class="w-4 h-4 shrink-0 text-red-500" />
              <span>{{ errorMessage }}</span>
            </div>

            <div v-if="successMessage" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-[fadeIn_0.3s_ease-out]">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{{ successMessage }}</span>
            </div>

            <!-- 1. Classroom Selection (ประจำห้อง) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <School class="w-3.5 h-3.5 text-emerald-600" />
                  ประจำห้องเรียน <span class="text-red-500">*</span>
                </label>
                <span class="text-[11px] text-stone-400">เลือกห้องเรียนของนักศึกษา</span>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button
                  v-for="room in allKnownClassrooms"
                  :key="room"
                  type="button"
                  @click="selectedClassroom = room; suggestCoursesForClassroom(room)"
                  :class="[
                    'py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer',
                    selectedClassroom === room
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  ]"
                >
                  {{ room }}
                </button>
              </div>
            </div>

            <!-- 2. Multi-Course Selection (รายวิชาที่เรียน - เลือกได้มากกว่า 1 วิชา) -->
            <div class="space-y-2 pt-1">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <GraduationCap class="w-3.5 h-3.5 text-emerald-600" />
                  รายวิชาที่ลงทะเบียนเรียน (เลือกได้มากกว่า 1 วิชา) <span class="text-red-500">*</span>
                </label>
                <span class="text-[11px] text-emerald-700 font-semibold">
                  เลือกแล้ว {{ selectedCourseIds.length }} วิชา
                </span>
              </div>

              <div class="space-y-2">
                <div 
                  v-for="c in courses" 
                  :key="c.id"
                  @click="toggleCourse(c.id)"
                  :class="[
                    'p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all',
                    selectedCourseIds.includes(c.id)
                      ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div 
                      :class="[
                        'w-5 h-5 rounded-lg flex items-center justify-center transition-colors border',
                        selectedCourseIds.includes(c.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      ]"
                    >
                      <Check v-if="selectedCourseIds.includes(c.id)" class="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <span class="text-xs font-bold text-stone-900 block">{{ c.name }}</span>
                      <span class="text-[10px] text-stone-500">รหัส {{ c.code }} • ระดับ {{ c.level }}</span>
                    </div>
                  </div>

                  <span 
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0',
                      c.levelGroup === 'ปวส.' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-purple-100 text-purple-800 border-purple-200'
                    ]"
                  >
                    {{ c.levelGroup }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. Student ID & Name (Hidden during import preview) -->
            <div v-if="importedStudentsPreview.length === 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Student ID -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-stone-700">
                  รหัสนักศึกษา <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="studentId"
                  type="text" 
                  maxlength="15"
                  placeholder="เช่น 67309010010" 
                  class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <!-- Student Name -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-stone-700">
                  ชื่อ-นามสกุล <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <select 
                    v-model="namePrefix"
                    class="w-24 shrink-0 px-2 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                  </select>
                  <input 
                    v-model="fullName"
                    type="text" 
                    placeholder="เช่น กวินทร์ ใจดี" 
                    class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- 4. Role Selection (หัวหน้าห้อง / รองหัวหน้าห้อง / นักศึกษา) -->
            <div v-if="importedStudentsPreview.length === 0" class="space-y-2 pt-1">
              <label class="block text-xs font-bold text-stone-700">
                กำหนดตำแหน่ง / บทบาทในห้อง (Role) <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-3 gap-2.5">
                <!-- Role: นักศึกษา -->
                <button
                  type="button"
                  @click="selectedRole = 'นักศึกษา'"
                  :class="[
                    'p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
                    selectedRole === 'นักศึกษา' 
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md scale-[1.02]' 
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  ]"
                >
                  <User class="w-5 h-5" :class="selectedRole === 'นักศึกษา' ? 'text-white' : 'text-stone-500'" />
                  <span class="text-xs font-bold">นักศึกษา</span>
                  <span class="text-[10px] opacity-75">สมาชิกทั่วไป</span>
                </button>

                <!-- Role: หัวหน้าห้อง -->
                <button
                  type="button"
                  @click="selectedRole = 'หัวหน้าห้อง'"
                  :class="[
                    'p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
                    selectedRole === 'หัวหน้าห้อง' 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200 scale-[1.02]' 
                      : 'bg-amber-50/50 text-amber-800 border-amber-200 hover:bg-amber-100/60'
                  ]"
                >
                  <ShieldCheck class="w-5 h-5" :class="selectedRole === 'หัวหน้าห้อง' ? 'text-white' : 'text-amber-600'" />
                  <span class="text-xs font-bold">หัวหน้าห้อง</span>
                  <span class="text-[10px] opacity-75">ผู้นำประจำห้อง</span>
                </button>

                <!-- Role: รองหัวหน้าห้อง -->
                <button
                  type="button"
                  @click="selectedRole = 'รองหัวหน้าห้อง'"
                  :class="[
                    'p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
                    selectedRole === 'รองหัวหน้าห้อง' 
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-200 scale-[1.02]' 
                      : 'bg-blue-50/50 text-blue-800 border-blue-200 hover:bg-blue-100/60'
                  ]"
                >
                  <Shield class="w-5 h-5" :class="selectedRole === 'รองหัวหน้าห้อง' ? 'text-white' : 'text-blue-600'" />
                  <span class="text-xs font-bold">รองหัวหน้าห้อง</span>
                  <span class="text-[10px] opacity-75">ผู้ช่วยดูแลห้อง</span>
                </button>
              </div>
            </div>

            <!-- Info Box: Student will edit the rest -->
            <div v-if="importedStudentsPreview.length === 0" class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
              <Info class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div class="leading-relaxed">
                <strong>อาจารย์เพิ่มเพียงรหัสและชื่อ:</strong> ข้อมูลส่วนตัวอื่นๆ (เช่น ชื่อเล่น, เบอร์โทรศัพท์, คำคมประจำใจ, ช่องทางโซเชียลมีเดีย) นักศึกษาจะสามารถเข้ามาแก้ไขได้เองในหน้าข้อมูลส่วนตัว และจะซิงค์กับทุกวิชาที่นักศึกษาเรียนอัตโนมัติ
              </div>
            </div>

            <!-- Preview Box for Excel Import -->
            <div v-if="importedStudentsPreview.length > 0" class="space-y-2 pt-2 border-t border-stone-100">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Users class="w-3.5 h-3.5 text-emerald-600" />
                  ตรวจสอบรายชื่อที่นำเข้า ({{ importedStudentsPreview.length }} คน)
                </label>
                <button 
                  type="button" 
                  @click="importedStudentsPreview = []" 
                  class="text-[11px] text-red-500 hover:text-red-700 hover:underline font-bold"
                >
                  ยกเลิกการนำเข้า
                </button>
              </div>
              
              <!-- Scrollable Preview Area -->
              <div class="max-h-56 overflow-y-auto border border-stone-200 rounded-xl bg-stone-50 p-2 space-y-1.5 custom-scrollbar shadow-inner">
                <div 
                  v-for="(student, idx) in importedStudentsPreview" 
                  :key="idx" 
                  class="flex justify-between items-center px-3 py-2.5 bg-white border border-stone-100 rounded-lg text-xs shadow-xs"
                >
                  <span class="font-mono text-stone-500 font-semibold">{{ student.studentId }}</span>
                  <span class="font-bold text-stone-800">{{ student.name }}</span>
                </div>
              </div>
            </div>

            <!-- Hidden File Input for Excel Import -->
            <input 
              type="file" 
              ref="fileInput" 
              accept=".xls,.xlsx" 
              class="hidden" 
              @change="handleExcelImport" 
            />

            <!-- Actions Footer -->
            <div class="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <button 
                type="button"
                @click="triggerFileInput"
                class="px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-spreadsheet"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>
                นำเข้าจาก Excel
              </button>
              
              <div class="flex items-center gap-2 ml-auto">
                <button 
                  type="button" 
                  @click="closeModal"
                  class="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus class="w-4 h-4" />
                  บันทึกข้อมูล
                </button>
              </div>
            </div>

          </form>

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

/* Custom Scrollbar for Preview Box */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d6d3d1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a8a29e;
}
</style>
