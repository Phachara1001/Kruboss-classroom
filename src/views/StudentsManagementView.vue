<script setup>
import { ref, computed } from 'vue'
import { 
  Users, 
  UserPlus, 
  Search, 
  GraduationCap, 
  School, 
  ShieldCheck, 
  Shield, 
  User, 
  Pencil, 
  Trash2, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
  Phone,
  BookOpen,
  Link,
  Check,
  X
} from '@lucide/vue'
import { Database, GitBranch, LineChart, Cpu } from '@lucide/vue'
import { courses } from '../data/courses'
import { 
  studentsList, 
  courseClassrooms, 
  deleteStudent, 
  resetStudentsToDefault, 
  isStudentInCourse,
  isStudent,
  enrollClassroomToCourses
} from '../data/studentsStore'
import AddStudentModal from '@/components/AddStudentModal.vue'
import EditStudentProfileModal from '@/components/EditStudentProfileModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const courseIcons = {
  '31901-2007': Database,
  '21901-2012': GitBranch,
  '31901-2012': LineChart,
  '21901-2007': Cpu
}

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

// Filters
const selectedCourseFilter = ref('all') // 'all' or course.id
const selectedClassroomFilter = ref('all') // 'all' or room name
const selectedRoleFilter = ref('all') // 'all' | 'หัวหน้าห้อง' | 'รองหัวหน้าห้อง' | 'นักศึกษา'
const searchQuery = ref('')

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const studentToEdit = ref(null)

// Bulk Selection State
const selectedStudentIds = ref([])

const isAllSelected = computed(() => {
  return filteredStudents.value.length > 0 && selectedStudentIds.value.length === filteredStudents.value.length
})

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedStudentIds.value = filteredStudents.value.map(s => s.id)
  } else {
    selectedStudentIds.value = []
  }
}

const handleBulkDelete = () => {
  showConfirm(
    'ยืนยันการลบข้อมูลที่เลือก',
    `คุณต้องการลบนักศึกษาที่เลือกจำนวน ${selectedStudentIds.value.length} คน ใช่หรือไม่?`,
    'danger',
    () => {
      selectedStudentIds.value.forEach(id => {
        deleteStudent(id)
      })
      selectedStudentIds.value = []
    }
  )
}

// Batch Enroll Modal state
const showBatchEnrollModal = ref(false)
const batchSourceClassroom = ref('ปวส.1/1')
const batchTargetCourseIds = ref([])
const batchSuccessMessage = ref('')

// All distinct classrooms in the system
const allClassrooms = computed(() => {
  const roomsFromConfig = Object.values(courseClassrooms).flat()
  const studentRooms = studentsList.value.filter(s => isStudent(s)).map(s => s.classroom)
  return [...new Set([...roomsFromConfig, ...studentRooms])].filter(Boolean)
})

// Classrooms options based on course filter
const availableClassrooms = computed(() => {
  if (selectedCourseFilter.value === 'all') {
    return allClassrooms.value
  }
  const roomsFromConfig = courseClassrooms[selectedCourseFilter.value] || []
  const roomsFromData = studentsList.value
    .filter(s => isStudentInCourse(s, selectedCourseFilter.value) && isStudent(s))
    .map(s => s.classroom)
  return [...new Set([...roomsFromConfig, ...roomsFromData])].filter(Boolean)
})

// Filtered Students
const filteredStudents = computed(() => {
  return studentsList.value.filter(s => {
    if (!isStudent(s)) return false
    // Course match
    if (selectedCourseFilter.value !== 'all' && !isStudentInCourse(s, selectedCourseFilter.value)) {
      return false
    }
    // Room match
    if (selectedClassroomFilter.value !== 'all' && s.classroom !== selectedClassroomFilter.value) {
      return false
    }
    // Role match
    if (selectedRoleFilter.value !== 'all' && s.role !== selectedRoleFilter.value) {
      return false
    }
    // Query search
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true

    const nameMatch = (s.name || '').toLowerCase().includes(query)
    const idMatch = (s.studentId || '').includes(query)
    const nickMatch = (s.nickname || '').toLowerCase().includes(query)
    return nameMatch || idMatch || nickMatch
  })
})

// Counts
const totalCount = computed(() => studentsList.value.filter(s => isStudent(s)).length)
const presidentCount = computed(() => studentsList.value.filter(s => isStudent(s) && s.role === 'หัวหน้าห้อง').length)
const vicePresidentCount = computed(() => studentsList.value.filter(s => isStudent(s) && s.role === 'รองหัวหน้าห้อง').length)

const getCourseInfo = (courseId) => {
  return courses.find(c => c.id === courseId) || { name: 'ไม่พบรายวิชา', level: '-' }
}

const openEditModal = (student) => {
  studentToEdit.value = student
  showEditModal.value = true
}

const handleDelete = (student) => {
  showConfirm(
    'ยืนยันการลบข้อมูล',
    `คุณต้องการลบข้อมูล ${student.name} (${student.studentId}) ใช่หรือไม่?`,
    'danger',
    () => deleteStudent(student.id)
  )
}

const handleReset = () => {
  showConfirm(
    'ยืนยันการรีเซ็ตข้อมูล',
    'คุณต้องการรีเซ็ตรายชื่อนักศึกษากลับเป็นค่าเริ่มต้นของระบบใช่หรือไม่?',
    'danger',
    () => resetStudentsToDefault()
  )
}

// Open Batch Enroll
const openBatchEnroll = () => {
  batchSourceClassroom.value = allClassrooms.value[0] || 'ปวส.1/1'
  batchTargetCourseIds.value = []
  batchSuccessMessage.value = ''
  showBatchEnrollModal.value = true
}

const countStudentsInBatchRoom = computed(() => {
  return studentsList.value.filter(s => s.classroom === batchSourceClassroom.value).length
})

const toggleBatchCourse = (cId) => {
  const idx = batchTargetCourseIds.value.indexOf(cId)
  if (idx !== -1) {
    batchTargetCourseIds.value.splice(idx, 1)
  } else {
    batchTargetCourseIds.value.push(cId)
  }
}

const handleExecuteBatchEnroll = () => {
  if (batchTargetCourseIds.value.length === 0) {
    showConfirm('แจ้งเตือน', 'กรุณาเลือกรายวิชาปลายทางอย่างน้อย 1 วิชา', 'alert', null)
    return
  }
  const count = enrollClassroomToCourses(batchSourceClassroom.value, batchTargetCourseIds.value)
  batchSuccessMessage.value = `ลงทะเบียนนักศึกษาทั้งห้อง ${batchSourceClassroom.value} (รวม ${countStudentsInBatchRoom.value} คน) เข้าสู่รายวิชาที่เลือกเรียบร้อยแล้ว!`
  setTimeout(() => {
    showBatchEnrollModal.value = false
    batchSuccessMessage.value = ''
  }, 1200)
}
</script>

<template>
  <div class="space-y-8 pb-16 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Page Header & Stats Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-gray-900 leading-tight">ระบบจัดการนักศึกษา</h2>
            <p class="text-gray-500 text-sm">จัดการข้อมูลนักศึกษาประจำรายวิชา ประจำห้องเรียน และกำหนดบทบาทในชั้นเรียน</p>
          </div>
        </div>
      </div>

      <!-- Actions Button -->
      <div class="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
        <button 
          @click="openBatchEnroll"
          title="เชื่อมโยงนักศึกษาทั้งห้องเข้าสู่รายวิชาอื่น"
          class="px-3.5 py-2.5 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Link class="w-3.5 h-3.5" />
          <span>เชื่อมโยงห้องเรียนสู่วิชาอื่น</span>
        </button>

        <button 
          @click="handleReset"
          title="คืนค่ารายชื่อเริ่มต้น"
          class="px-3 py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">รีเซ็ต</span>
        </button>

        <button 
          @click="showAddModal = true"
          class="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <UserPlus class="w-4 h-4" />
          <span>เพิ่มนักศึกษาใหม่</span>
        </button>
      </div>
    </div>

    <!-- Stats Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-stone-500 font-semibold block">นักศึกษาทั้งหมดในระบบ</span>
          <span class="text-2xl font-black text-stone-800">{{ totalCount }} คน</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-amber-800 font-semibold block">หัวหน้าห้อง (Class Presidents)</span>
          <span class="text-2xl font-black text-amber-700">{{ presidentCount }} คน</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-blue-800 font-semibold block">รองหัวหน้าห้อง (Vice Presidents)</span>
          <span class="text-2xl font-black text-blue-700">{{ vicePresidentCount }} คน</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
      <div class="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2 text-stone-700 font-bold text-sm">
          <Filter class="w-4 h-4 text-emerald-600" />
          <span>ตัวกรองและค้นหา</span>
        </div>
        <span class="text-xs text-stone-400">
          แสดง {{ filteredStudents.length }} จาก {{ totalCount }} คน
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- 1. Course Filter -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">ประจำรายวิชา</label>
          <select 
            v-model="selectedCourseFilter"
            class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">ทุกรายวิชา (ทั้งหมด)</option>
            <option v-for="c in courses" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.level }})
            </option>
          </select>
        </div>

        <!-- 2. Classroom Filter -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">ประจำห้องเรียน</label>
          <select 
            v-model="selectedClassroomFilter"
            class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">ทุกห้องเรียน (ทั้งหมด)</option>
            <option v-for="room in availableClassrooms" :key="room" :value="room">
              {{ room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room }}
            </option>
          </select>
        </div>

        <!-- 3. Role Filter -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">บทบาท / ตำแหน่ง</label>
          <select 
            v-model="selectedRoleFilter"
            class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">ทุกบทบาท (ทั้งหมด)</option>
            <option value="หัวหน้าห้อง">หัวหน้าห้อง</option>
            <option value="รองหัวหน้าห้อง">รองหัวหน้าห้อง</option>
            <option value="นักศึกษา">นักศึกษาทั่วไป</option>
          </select>
        </div>

        <!-- 4. Text Search -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">ค้นหาชื่อหรือรหัส</label>
          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="พิมพ์ชื่อ, รหัสนักศึกษา..."
              class="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Students Data Table -->
    <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-stone-700">
          <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">
                <div class="relative flex items-center justify-center w-5 h-5 mx-auto">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected" 
                    @change="toggleSelectAll" 
                    class="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded-md checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer bg-white hover:border-emerald-400"
                  >
                  <Check class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" stroke-width="3" />
                </div>
              </th>
              <th class="py-3.5 px-4">นักศึกษา</th>
              <th class="py-3.5 px-4">รหัสนักศึกษา</th>
              <th class="py-3.5 px-4">รายวิชาที่เรียน</th>
              <th class="py-3.5 px-4">ประจำห้อง</th>
              <th class="py-3.5 px-4">บทบาท (Role)</th>
              <th class="py-3.5 px-4 text-center">การติดต่อ</th>
              <th class="py-3.5 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr 
              v-for="student in filteredStudents" 
              :key="student.id"
              :class="[
                'transition-colors',
                selectedStudentIds.includes(student.id) ? 'bg-emerald-50/50' : 'hover:bg-stone-50/80'
              ]"
            >
              <!-- Checkbox -->
              <td class="py-3.5 px-4 text-center">
                <div class="relative flex items-center justify-center w-5 h-5 mx-auto">
                  <input 
                    type="checkbox" 
                    :value="student.id" 
                    v-model="selectedStudentIds" 
                    class="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded-md checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer bg-white hover:border-emerald-400"
                  >
                  <Check class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" stroke-width="3" />
                </div>
              </td>

              <!-- Name & Avatar -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="relative w-10 h-10 shrink-0">
                    <img v-if="student.equippedFrame" :src="student.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" />
                    <div class="w-full h-full rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-sm relative z-0 overflow-hidden">
                      <img v-if="student.avatar && (student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.includes('localhost') || student.avatar.startsWith('data:'))" :src="student.avatar.startsWith('http') ? student.avatar : (student.avatar.startsWith('data:') ? student.avatar : `http://${student.avatar}`)" class="w-full h-full object-cover object-top" />
                      <span v-else>{{ student.avatar || 'U' }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="font-bold text-stone-900 block text-sm">{{ student.name }}</span>
                    <span class="text-stone-400 text-[11px]">
                      ชื่อเล่น: {{ student.nickname && student.nickname !== '-' ? student.nickname : '(ยังไม่ระบุ)' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Student ID -->
              <td class="py-3.5 px-4 font-mono font-semibold text-stone-700">
                {{ student.studentId }}
              </td>

              <!-- Enrolled Courses (Multiple) -->
              <td class="py-3.5 px-4">
                <div class="flex flex-wrap gap-1 max-w-[260px]">
                  <span 
                    v-for="cId in (student.courseIds || [student.courseId])" 
                    :key="cId"
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-semibold border inline-flex items-center gap-1.5 truncate max-w-full',
                      getCourseInfo(cId).theme?.badgeBg || 'bg-emerald-50',
                      getCourseInfo(cId).theme?.badgeText || 'text-emerald-900',
                      getCourseInfo(cId).theme?.border || 'border-emerald-200/90'
                    ]"
                    :title="getCourseInfo(cId).name"
                  >
                    <component v-if="courseIcons[cId]" :is="courseIcons[cId]" class="w-3 h-3 shrink-0" />
                    {{ getCourseInfo(cId).name }}
                  </span>
                </div>
              </td>

              <!-- Classroom -->
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg font-bold text-[11px] border border-stone-200">
                  {{ student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : student.classroom }}
                </span>
              </td>

              <!-- Role -->
              <td class="py-3.5 px-4">
                <span :class="[
                  'px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 border',
                  student.role === 'หัวหน้าห้อง' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  student.role === 'รองหัวหน้าห้อง' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-stone-100 text-stone-600 border-stone-200'
                ]">
                  <ShieldCheck v-if="student.role === 'หัวหน้าห้อง'" class="w-3.5 h-3.5 text-amber-600" />
                  <Shield v-else-if="student.role === 'รองหัวหน้าห้อง'" class="w-3.5 h-3.5 text-blue-600" />
                  <User v-else class="w-3 h-3 text-stone-500" />
                  <span>{{ student.role }}</span>
                </span>
              </td>

              <!-- Contact & Socials -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5 text-stone-400">
                  <span v-if="student.phone" class="text-green-600 text-[11px] font-mono flex items-center justify-center gap-1" :title="`โทร: ${student.phone}`">
                    <Phone class="w-3 h-3 text-emerald-600" />
                    <span>{{ student.phone }}</span>
                  </span>
                  <span v-else class="text-stone-300 italic text-[10px]">
                    (ยังไม่ได้ระบุ)
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button 
                    @click="openEditModal(student)"
                    class="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Pencil class="w-3 h-3" />
                    <span>แก้ไข</span>
                  </button>
                  <button 
                    @click="handleDelete(student)"
                    class="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="ลบนักศึกษา"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- No results -->
            <tr v-if="filteredStudents.length === 0">
              <td colspan="8" class="py-12 text-center text-stone-400">
                <p class="text-sm font-semibold">ไม่พบข้อมูลนักศึกษาตามเงื่อนไขที่เลือก</p>
                <button 
                  @click="showAddModal = true"
                  class="mt-3 text-xs text-emerald-600 hover:underline font-bold"
                >
                  + เพิ่มนักศึกษาคนใหม่
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddStudentModal 
      v-model="showAddModal" 
      :default-course-id="selectedCourseFilter !== 'all' ? selectedCourseFilter : '31901-2007'"
      :default-classroom="selectedClassroomFilter !== 'all' ? selectedClassroomFilter : ''"
    />

    <EditStudentProfileModal
      v-model="showEditModal"
      :student="studentToEdit"
    />

    <!-- Batch Enroll Classroom Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="showBatchEnrollModal" 
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-sm"
        >
          <div class="absolute inset-0" @click="showBatchEnrollModal = false"></div>
          
          <div class="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col animate-[bounceIn_0.3s_ease-out]">
            <!-- Header -->
            <div class="px-6 py-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 text-white flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-md">
                  <Link class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-black text-lg leading-tight">เชื่อมโยงห้องเรียนสู่วิชาอื่น</h3>
                  <p class="text-xs text-emerald-100">ลงทะเบียนนักศึกษาทั้งห้องเข้าสู่รายวิชาอื่นในคราวเดียว</p>
                </div>
              </div>
              <button @click="showBatchEnrollModal = false" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5 text-stone-800">
              <div v-if="batchSuccessMessage" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check class="w-4 h-4 text-emerald-600" />
                <span>{{ batchSuccessMessage }}</span>
              </div>

              <!-- 1. Select Classroom -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <School class="w-3.5 h-3.5 text-emerald-600" />
                  เลือกห้องเรียนต้นทาง
                </label>
                <select 
                  v-model="batchSourceClassroom"
                  class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
                >
                  <option v-for="room in allClassrooms" :key="room" :value="room">
                    {{ room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room }} (มีข้อมูล {{ studentsList.filter(s => s.classroom === room).length }} คน)
                  </option>
                </select>
                <p class="text-[11px] text-stone-500">
                  ห้องนี้มีนักศึกษาทั้งหมด <strong>{{ countStudentsInBatchRoom }} คน</strong>
                </p>
              </div>

              <!-- 2. Target Courses -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <BookOpen class="w-3.5 h-3.5 text-emerald-600" />
                  เลือกรายวิชาปลายทางที่ต้องการให้ทั้งห้องเรียน
                </label>
                
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div 
                    v-for="c in courses" 
                    :key="c.id"
                    @click="toggleBatchCourse(c.id)"
                    :class="[
                      'p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all',
                      batchTargetCourseIds.includes(c.id)
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 text-emerald-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    ]"
                  >
                    <div class="flex items-center gap-2.5">
                      <span 
                        :class="[
                          'w-4 h-4 rounded-md flex items-center justify-center text-[10px] border',
                          batchTargetCourseIds.includes(c.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                        ]"
                      >
                        <Check v-if="batchTargetCourseIds.includes(c.id)" class="w-3 h-3" />
                      </span>
                      <span class="text-xs">{{ c.name }}</span>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">
                      {{ c.level }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Note -->
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                เมื่อกดบันทึก นักศึกษาทั้ง {{ countStudentsInBatchRoom }} คนในห้อง {{ batchSourceClassroom }} จะมีรายชื่อปรากฏในวิชาที่เลือกทันที โดยไม่ต้องพิมพ์ข้อมูลซ้ำ
              </div>

              <!-- Footer -->
              <div class="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  @click="showBatchEnrollModal = false"
                  class="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button 
                  type="button" 
                  @click="handleExecuteBatchEnroll"
                  class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Link class="w-3.5 h-3.5" />
                  <span>ลงทะเบียนทั้งห้อง</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Global Confirm Modal -->
    <ConfirmModal 
      v-model="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :type="confirmState.type"
      @confirm="handleConfirm"
    />

    <!-- Bulk Actions Floating Bar -->
    <Transition name="fade-slide-up">
      <div 
        v-if="selectedStudentIds.length > 0" 
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-5 border border-stone-700"
      >
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check class="w-3.5 h-3.5" />
          </div>
          <span class="font-bold text-sm">เลือกแล้ว {{ selectedStudentIds.length }} รายการ</span>
        </div>
        <div class="h-6 w-px bg-stone-700"></div>
        <div class="flex items-center gap-2">
          <button 
            @click="handleBulkDelete" 
            class="px-3.5 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-red-500/20"
          >
            <Trash2 class="w-3.5 h-3.5" /> ลบที่เลือก
          </button>
          <button 
            @click="selectedStudentIds = []" 
            class="px-3.5 py-2 text-stone-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
