<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { 
  Search, 
  MoreHorizontal, 
  ShieldCheck, 
  Shield, 
  Phone, 
  X, 
  ChevronLeft, 
  UserPlus, 
  Pencil, 
  School, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Award, 
  Lock 
} from '@lucide/vue'
import Tooltip from '@/components/Tooltip.vue'
import AddStudentModal from '@/components/AddStudentModal.vue'
import EditStudentProfileModal from '@/components/EditStudentProfileModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { studentsList, courseClassrooms, isStudentInCourse, isStudent } from '../data/studentsStore'
import { getStudentRank, unrankedTier } from '../data/rankConfig'
import { getStudentFullScore, fetchAllCourseData } from '../data/gradesStore'
import { authUser } from '../data/authStore'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (course.value?.id) {
    fetchAllCourseData(course.value.id)
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchAllCourseData(newId)
  }
})

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const currentStudent = computed(() => {
  if (isTeacher.value || !authUser.value) return null
  const id = authUser.value.studentId || authUser.value.id
  return studentsList.value.find(s => s.studentId === id || s.id === id) || authUser.value
})

const studentClassroom = computed(() => {
  return currentStudent.value?.classroom || authUser.value?.classroom || 'ปวส.1/1'
})

const course = computed(() => courses.find(c => c.id === route.params.id) || courses[0])

const teacher = computed(() => {
  const t = studentsList.value.find(s => s.role === 'teacher' || s.classroom === 'teacher_room' || s.studentId === '0000')
  return t ? {
    name: t.name || 'นายพชร เพียซ้าย (ครูบอส)',
    role: 'อาจารย์ผู้สอนหลัก',
    avatar: t.avatar || '/Me.png',
    equippedFrame: t.equippedFrame || null
  } : {
    name: 'นายพชร เพียซ้าย (ครูบอส)',
    role: 'อาจารย์ผู้สอนหลัก',
    avatar: '/Me.png',
    equippedFrame: null
  }
})

// Classroom Filter State
const selectedClassroom = ref(isTeacher.value ? 'all' : studentClassroom.value) // 'all' or specific room name like 'ปวส.1/1'
const searchQuery = ref('')

watch(studentClassroom, (room) => {
  if (!isTeacher.value && room) {
    selectedClassroom.value = room
  }
}, { immediate: true })

// Available classrooms for this course
const availableClassrooms = computed(() => {
  const roomsFromConfig = courseClassrooms[course.value.id] || []
  const roomsFromData = [...new Set(studentsList.value.filter(s => isStudentInCourse(s, course.value.id) && isStudent(s)).map(s => s.classroom))]
  return [...new Set([...roomsFromConfig, ...roomsFromData])].filter(Boolean)
})

// Filtered Classmates (Real students only, teacher is in hero section above)
const courseStudents = computed(() => {
  return studentsList.value.filter(s => isStudentInCourse(s, course.value.id) && isStudent(s))
})

const filteredClassmates = computed(() => {
  return courseStudents.value.filter(s => {
    const matchRoom = selectedClassroom.value === 'all' || s.classroom === selectedClassroom.value
    if (!matchRoom) return false

    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true

    const nameMatch = (s.name || '').toLowerCase().includes(query)
    const idMatch = (s.studentId || '').includes(query)
    const nickMatch = (s.nickname || '').toLowerCase().includes(query)
    return nameMatch || idMatch || nickMatch
  })
})

// Grouped by Roles
const president = computed(() => filteredClassmates.value.find(c => c.role === 'หัวหน้าห้อง'))
const vicePresidents = computed(() => filteredClassmates.value.filter(c => c.role === 'รองหัวหน้าห้อง'))
const regularStudents = computed(() => filteredClassmates.value.filter(c => c.role === 'นักศึกษา' || !c.role))

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-400'
    default: return 'bg-gray-300'
  }
}

// Student Rank Helper
const getStudentRankTier = (studentId) => {
  if (!studentId) return unrankedTier
  const scoreData = getStudentFullScore(course.value.id, studentId)
  return getStudentRank(scoreData.totalScore)
}

// Modals State
const showProfileModal = ref(false)
const selectedStudent = ref(null)

const showAddModal = ref(false)
const showEditModal = ref(false)
const studentToEdit = ref(null)

const openProfileModal = (student) => {
  selectedStudent.value = student
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
  setTimeout(() => {
    selectedStudent.value = null
  }, 300)
}

const openEditModalFromProfile = () => {
  studentToEdit.value = selectedStudent.value
  showProfileModal.value = false
  showEditModal.value = true
}

const openEditModal = (student) => {
  studentToEdit.value = student
  showEditModal.value = true
}

const handleStudentAdded = (newStudent) => {
  // If the added student is in a specific room, select that room tab so teacher immediately sees them
  if (newStudent && newStudent.classroom) {
    selectedClassroom.value = newStudent.classroom
  }
}

const handleStudentUpdated = (updated) => {
  if (selectedStudent.value && selectedStudent.value.id === updated.id) {
    selectedStudent.value = updated
  }
}

const canEditSelectedStudentProfile = computed(() => {
  if (!selectedStudent.value) return false
  if (isTeacher.value) return true
  const myId = authUser.value?.studentId || authUser.value?.id
  return !!(myId && myId === selectedStudent.value.studentId)
})
</script>

<template>
  <div class="space-y-10 pb-16 relative animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Top Header Bar -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-100 pb-6">
      <div>
        <button 
          @click="router.push(`/course/${course.id}`)" 
          class="flex items-center text-sm font-bold mb-3 hover:underline cursor-pointer transition-colors" 
          :class="course.theme.bgText"
        >
          <ChevronLeft class="w-4 h-4 mr-1" /> กลับไปหน้ารายวิชา
        </button>
        <div class="flex flex-wrap items-center gap-3">
          <h2 :class="['text-3xl font-black', course.theme.text]">สมาชิกในชั้นเรียน</h2>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
            {{ filteredClassmates.length }} คน
          </span>
        </div>
        <p :class="['font-medium text-sm mt-1', course.theme.bgText]">
          {{ course.name }} (รหัสวิชา {{ course.code }})
        </p>
      </div>
      
      <!-- Actions: Search + Add Student Button -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        <!-- Search Input -->
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="ค้นหาชื่อ หรือรหัสนักศึกษา..." 
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs transition-all hover:border-emerald-300"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Gradebook Quick Button -->
        <button 
          @click="router.push(`/gradebook?courseId=${course.id}`)"
          class="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Award class="w-4 h-4 text-emerald-600" />
          <span>สมุดคะแนนและเช็คชื่อ</span>
        </button>

        <!-- Add Student Button (Teacher Only) -->
        <button 
          v-if="isTeacher"
          @click="showAddModal = true"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:-translate-y-0.5"
        >
          <UserPlus class="w-4 h-4" />
          <span>เพิ่มนักศึกษา</span>
        </button>
      </div>
    </div>

    <!-- Classroom Filter Tabs (ประจำห้อง) -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs font-bold text-stone-500 px-2 flex items-center gap-1">
          <School class="w-3.5 h-3.5 text-stone-600" /> ห้องเรียน:
        </span>

        <!-- If Teacher: show full classroom tabs -->
        <template v-if="isTeacher">
          <!-- Tab All -->
          <button
            @click="selectedClassroom = 'all'"
            :class="[
              'px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              selectedClassroom === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-white hover:text-stone-900'
            ]"
          >
            <span>ทั้งหมด</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="selectedClassroom === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-600'">
              {{ courseStudents.length }}
            </span>
          </button>

          <!-- Dynamic Classroom Tabs -->
          <button
            v-for="room in availableClassrooms"
            :key="room"
            @click="selectedClassroom = room"
            :class="[
              'px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              selectedClassroom === room
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200'
                : 'text-stone-600 hover:bg-white hover:text-emerald-700'
            ]"
          >
            <span>{{ room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room }}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="selectedClassroom === room ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-600'">
              {{ courseStudents.filter(s => s.classroom === room).length }}
            </span>
          </button>
        </template>

        <!-- If Student: show locked classroom badge -->
        <template v-else>
          <div class="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
            <span>ห้อง {{ studentClassroom }}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-emerald-100">
              {{ courseStudents.filter(s => s.classroom === studentClassroom).length }} คน
            </span>
          </div>
        </template>
      </div>

      <!-- Quick Info -->
      <div class="text-[11px] text-stone-500 px-2 hidden sm:block">
        {{ isTeacher ? 'คลิกที่การ์ดเพื่อดูข้อมูล หรือกดแก้ไขเพื่อให้นักศึกษาอัปเดตโปรไฟล์' : 'คลิกที่การ์ดเพื่อดูข้อมูลเพื่อนร่วมชั้น' }}
      </div>
    </div>

    <!-- Main Hierarchy Layout: Teacher Always Shows -->
    <div class="flex flex-col items-center space-y-10">
      
      <!-- 1. Teacher Section -->
      <div class="flex flex-col items-center text-center animate-[fadeIn_0.5s_ease-out]">
        <div class="relative mb-3 group cursor-pointer z-0">
          <div class="relative w-28 h-28 mx-auto">
            <!-- Frame -->
            <img v-if="teacher.equippedFrame" :src="teacher.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-lg z-10" />
            <!-- Avatar Circle -->
            <div class="w-full h-full rounded-full bg-[#E3DCD2] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105 relative">
              <img :src="teacher.avatar" alt="Teacher" class="w-full h-full object-cover object-top" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="hidden w-full h-full items-center justify-center text-3xl font-bold text-[#5C554D]">พ</div>
            </div>
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-stone-800 text-white text-[11px] font-bold rounded-full shadow-md whitespace-nowrap z-20">
            อาจารย์ผู้สอน
          </div>
        </div>
        <h3 class="font-black text-lg text-gray-900 mt-2">{{ teacher.name }}</h3>
        <p class="text-xs text-gray-500">{{ teacher.role }}</p>
      </div>

      <!-- Spacer -->
      <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>
      <div v-if="filteredClassmates.length === 0" class="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs w-full">
        <div class="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-2xl font-bold">
          <Users class="w-8 h-8" />
        </div>
        <div>
          <h4 class="text-lg font-bold text-stone-800">ไม่พบรายชื่อนักศึกษาในห้องนี้</h4>
          <p class="text-xs text-stone-500 mt-1">ยังไม่มีนักศึกษาในเงื่อนไขที่เลือก หรือคำค้นหาไม่ตรงกับข้อมูลใด</p>
        </div>
        <button 
          v-if="isTeacher"
          @click="showAddModal = true"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <UserPlus class="w-4 h-4" /> เพิ่มนักศึกษาคนแรกในห้องนี้
        </button>
      </div>

      <!-- 2. Class President (หัวหน้าห้อง) & Students -->
      <template v-else>


      <!-- 2. Class President (หัวหน้าห้อง) -->
      <div v-if="president" class="flex flex-col items-center text-center w-full max-w-sm animate-[fadeIn_0.6s_ease-out]">
        <div class="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl shadow-amber-100/60 flex flex-col items-center w-full relative transition-all hover:-translate-y-1 group">
          
          <!-- Shield Badge -->
          <div class="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[11px] font-bold">
            <ShieldCheck class="w-3.5 h-3.5 text-amber-600" />
            <span>{{ president.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + president.classroom }}</span>
          </div>

          <!-- Quick Edit Icon Button (Teacher Only) -->
          <button 
            v-if="isTeacher"
            @click.stop="openEditModal(president)" 
            title="แก้ไขข้อมูล / ปรับตำแหน่ง" 
            class="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-400 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Pencil class="w-3.5 h-3.5" />
          </button>

          <!-- Avatar -->
          <div @click="openProfileModal(president)" class="relative mb-3 mt-4 cursor-pointer z-0">
            <div class="relative w-20 h-20 mx-auto">
              <!-- Frame -->
              <img v-if="president.equippedFrame" :src="president.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
              <!-- Avatar Circle -->
              <div class="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl font-black text-amber-700 border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105 overflow-hidden relative z-0">
                <img v-if="president.avatar && (president.avatar.startsWith('data:') || president.avatar.includes('/') || president.avatar.includes('http'))" :src="president.avatar" class="w-full h-full object-cover object-top" />
                <span v-else>{{ president.avatar }}</span>
              </div>
            </div>
          </div>

          <h4 @click="openProfileModal(president)" class="font-bold text-lg text-gray-900 mb-0.5 cursor-pointer hover:text-amber-700 transition-colors">
            {{ president.name }} 
            <span v-if="president.nickname && president.nickname !== '-'" class="text-gray-500 text-sm font-normal">({{ president.nickname }})</span>
          </h4>
          <p class="text-xs font-mono text-gray-500 mb-2">{{ president.studentId }}</p>

          <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full mb-2 flex items-center gap-1.5 shadow-xs">
            <ShieldCheck class="w-3.5 h-3.5" />
            {{ president.role }}
          </span>

          <!-- Student Rank Badge -->
          <div v-if="getStudentRankTier(president.studentId).id !== 'unranked'" class="mb-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-white border border-stone-700 shadow-xs text-xs font-bold">
            <img :src="getStudentRankTier(president.studentId).logo" class="w-4 h-4 object-contain" />
            <span class="tracking-wide">{{ getStudentRankTier(president.studentId).name }}</span>
            <span class="text-[10px] text-stone-400 font-normal">({{ getStudentRankTier(president.studentId).gradeLevel }})</span>
          </div>
          <div v-else class="mb-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-[11px] font-medium">
            <Lock class="w-3 h-3 text-stone-400" />
            <span>Unranked</span>
          </div>

          <p class="text-gray-500 italic text-xs mb-4 text-center px-2 line-clamp-2 before:content-['&quot;'] after:content-['&quot;']">
            {{ president.quote }}
          </p>

          <!-- Actions Footer on President Card -->
          <div class="w-full pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
            <button 
              @click="openProfileModal(president)"
              class="text-amber-800 hover:underline font-bold cursor-pointer"
            >
              ดูโปรไฟล์
            </button>
            <button 
              v-if="isTeacher"
              @click="openEditModal(president)" 
              class="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Pencil class="w-3 h-3" /> แก้ไขข้อมูล
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Vice President(s) (รองหัวหน้าห้อง) -->
      <div v-if="vicePresidents.length > 0" class="flex flex-wrap justify-center gap-6 w-full animate-[fadeIn_0.7s_ease-out]">
        <div v-for="vp in vicePresidents" :key="vp.id" class="flex flex-col items-center text-center w-full max-w-[280px]">
          <div class="bg-white rounded-3xl p-5 border border-blue-200 shadow-md shadow-blue-50 flex flex-col items-center w-full relative transition-all hover:-translate-y-1 group">
            
            <div class="absolute top-3 left-3 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-[10px] font-bold">
              {{ vp.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + vp.classroom }}
            </div>

            <button 
              v-if="isTeacher"
              @click.stop="openEditModal(vp)" 
              title="แก้ไขข้อมูล" 
              class="absolute top-3 right-3 w-6 h-6 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-400 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Pencil class="w-3 h-3" />
            </button>

            <div @click="openProfileModal(vp)" class="relative mb-2 mt-4 cursor-pointer z-0">
              <div class="relative w-16 h-16 mx-auto">
                <img v-if="vp.equippedFrame" :src="vp.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <div class="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl font-black text-blue-700 border-2 border-white shadow-xs transition-transform duration-300 group-hover:scale-105 overflow-hidden relative z-0">
                  <img v-if="vp.avatar && (vp.avatar.startsWith('data:') || vp.avatar.includes('/') || vp.avatar.includes('http'))" :src="vp.avatar" class="w-full h-full object-cover object-top" />
                  <span v-else>{{ vp.avatar }}</span>
                </div>
              </div>
            </div>

            <h4 @click="openProfileModal(vp)" class="font-bold text-gray-800 text-sm mb-0.5 cursor-pointer hover:text-blue-700 transition-colors">
              {{ vp.name }} 
              <span v-if="vp.nickname && vp.nickname !== '-'" class="text-gray-500 font-normal">({{ vp.nickname }})</span>
            </h4>
            <p class="text-xs font-mono text-gray-500 mb-2">{{ vp.studentId }}</p>

            <span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-2 flex items-center gap-1">
              <Shield class="w-3 h-3" />
              {{ vp.role }}
            </span>

            <!-- Student Rank Badge -->
            <div v-if="getStudentRankTier(vp.studentId).id !== 'unranked'" class="mb-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 text-white border border-stone-700 shadow-xs text-[11px] font-bold">
              <img :src="getStudentRankTier(vp.studentId).logo" class="w-3.5 h-3.5 object-contain" />
              <span class="tracking-wide">{{ getStudentRankTier(vp.studentId).name }}</span>
            </div>
            <div v-else class="mb-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-medium">
              <Lock class="w-2.5 h-2.5 text-stone-400" />
              <span>Unranked</span>
            </div>

            <p class="text-gray-500 italic text-[11px] mb-3 text-center px-1 line-clamp-2 before:content-['&quot;'] after:content-['&quot;']">
              {{ vp.quote }}
            </p>

            <!-- Actions Footer -->
            <div class="w-full pt-2.5 border-t border-blue-100 flex items-center justify-between text-xs">
              <button 
                @click="openProfileModal(vp)"
                class="text-blue-700 hover:underline font-bold cursor-pointer"
              >
                ดูโปรไฟล์
              </button>
              <button 
                v-if="isTeacher"
                @click="openEditModal(vp)" 
                class="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Pencil class="w-3 h-3" /> แก้ไข
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- 4. Students Grid (สมาชิกในห้อง) -->
      <div class="w-full pt-6 animate-[fadeIn_0.8s_ease-out]">
        <div class="mb-6 flex items-center justify-center gap-4">
          <div class="h-px bg-gray-200 flex-1 max-w-[120px]"></div>
          <h3 class="text-base font-bold text-gray-600 flex items-center gap-2">
            <Users class="w-4 h-4 text-emerald-600" />
            <span>เพื่อนร่วมชั้นทั้งหมด ({{ regularStudents.length }} คน)</span>
          </h3>
          <div class="h-px bg-gray-200 flex-1 max-w-[120px]"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          <div 
            v-for="student in regularStudents" 
            :key="student.id"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center text-center relative group"
          >
            <!-- Room Badge -->
            <div class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">
              {{ student.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : student.classroom }}
            </div>

            <!-- Edit Button on Card -->
            <button 
              v-if="isTeacher"
              @click.stop="openEditModal(student)" 
              title="แก้ไขข้อมูลโปรไฟล์"
              class="absolute top-2.5 right-2.5 text-gray-400 hover:text-emerald-600 p-1 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            
            <div @click="openProfileModal(student)" class="relative mb-3 mt-4 cursor-pointer group/avatar z-0">
              <div class="relative w-14 h-14 mx-auto">
                <img v-if="student.equippedFrame" :src="student.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" />
                <div class="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center text-lg font-bold text-emerald-800 border-2 border-white shadow-xs transition-transform group-hover/avatar:scale-105 overflow-hidden relative z-0">
                  <img v-if="student.avatar && (student.avatar.startsWith('data:') || student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.includes('localhost'))" :src="student.avatar.startsWith('http') ? student.avatar : (student.avatar.startsWith('data:') ? student.avatar : `http://${student.avatar}`)" class="w-full h-full object-cover object-top" />
                  <span v-else>{{ student.avatar }}</span>
                </div>
              </div>
            </div>
            
            <h4 @click="openProfileModal(student)" class="font-bold text-gray-800 text-xs sm:text-sm mb-0.5 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors">
              {{ student.name }}
            </h4>
            <p v-if="student.nickname && student.nickname !== '-'" class="text-xs text-gray-500 mb-0.5">({{ student.nickname }})</p>
            <p v-else class="text-[11px] text-gray-400 italic mb-0.5">(ยังไม่ระบุชื่อเล่น)</p>
            
            <p class="text-[11px] font-mono text-gray-400 mb-1.5">{{ student.studentId }}</p>
            
            <!-- Student Rank Badge -->
            <div v-if="getStudentRankTier(student.studentId).id !== 'unranked'" class="mb-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-900 text-white border border-stone-700 shadow-xs text-[10px] font-bold">
              <img :src="getStudentRankTier(student.studentId).logo" class="w-3 h-3 object-contain" />
              <span class="tracking-wide">{{ student.studentId ? getStudentRankTier(student.studentId).name : '' }}</span>
            </div>
            <div v-else class="mb-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-medium">
              <Lock class="w-2.5 h-2.5 text-stone-400" />
              <span>Unranked</span>
            </div>
            
            <p class="text-gray-500 italic text-[10px] mb-3 text-center px-1 line-clamp-2 before:content-['&quot;'] after:content-['&quot;'] min-h-[1.5rem]">
              {{ student.quote }}
            </p>
            
            <!-- Card Bottom Action: View Profile / Edit -->
            <div class="w-full pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] mt-auto">
              <button 
                @click="openProfileModal(student)" 
                class="text-stone-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                ดูโปรไฟล์
              </button>
              <button 
                v-if="isTeacher"
                @click="openEditModal(student)" 
                class="text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Pencil class="w-3 h-3" /> แก้ไข
              </button>
            </div>

          </div>
        </div>
      </div>
      </template>
    </div>

    <!-- Student Profile Modal (View Details) -->
    <Teleport to="body">
      <div v-if="showProfileModal && selectedStudent" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" @click="closeProfileModal"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-[bounceIn_0.3s_ease-out] flex flex-col">
          
          <!-- Header background -->
          <div class="h-28 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <button 
              @click="closeProfileModal" 
              class="absolute top-4 right-4 text-white hover:text-stone-200 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 pb-6 flex flex-col items-center -mt-14 relative z-10">
            <div class="relative mb-3 z-0">
              <div class="relative w-24 h-24 mx-auto">
                <img v-if="selectedStudent.equippedFrame" :src="selectedStudent.equippedFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-stone-700 border-4 border-white shadow-lg shadow-stone-200/50 overflow-hidden relative z-0">
                  <img v-if="selectedStudent.avatar && (selectedStudent.avatar.startsWith('data:') || selectedStudent.avatar.includes('/') || selectedStudent.avatar.includes('http'))" :src="selectedStudent.avatar" class="w-full h-full object-cover object-top" />
                  <span v-else>{{ selectedStudent.avatar }}</span>
                </div>
              </div>
            </div>
            
            <h3 class="font-black text-xl text-stone-800 mb-0.5 text-center">{{ selectedStudent.name }}</h3>
            <p class="text-stone-600 mb-2 font-medium text-xs">
              ชื่อเล่น: {{ selectedStudent.nickname && selectedStudent.nickname !== '-' ? selectedStudent.nickname : '(ยังไม่ได้ระบุ)' }}
            </p>
            
            <div class="flex items-center gap-2 mb-3">
              <span :class="[
                'px-3 py-1 text-xs font-bold rounded-full shadow-xs border flex items-center gap-1',
                selectedStudent.role === 'หัวหน้าห้อง' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                selectedStudent.role === 'รองหัวหน้าห้อง' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-stone-100 text-stone-700 border-stone-200'
              ]">
                <ShieldCheck v-if="selectedStudent.role === 'หัวหน้าห้อง'" class="w-3.5 h-3.5 text-amber-600" />
                <Shield v-else-if="selectedStudent.role === 'รองหัวหน้าห้อง'" class="w-3.5 h-3.5 text-blue-600" />
                <span>{{ selectedStudent.role }}</span>
              </span>

              <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {{ selectedStudent.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + selectedStudent.classroom }}
              </span>
            </div>
            
            <p v-if="selectedStudent.quote" class="text-stone-500 italic text-xs mb-5 text-center px-4 before:content-['&quot;'] after:content-['&quot;']">
              {{ selectedStudent.quote }}
            </p>

            <div class="w-full bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3 text-xs">
              
              <!-- Rank Tier in Profile -->
              <div class="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border border-stone-700 shadow-sm">
                <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20 p-1">
                  <img 
                    v-if="getStudentRankTier(selectedStudent.studentId).id !== 'unranked'" 
                    :src="getStudentRankTier(selectedStudent.studentId).logo" 
                    class="w-full h-full object-contain" 
                  />
                  <Lock v-else class="w-4 h-4 text-stone-400" />
                </div>
                <div class="flex flex-col flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">ระดับแรงค์ประจำวิชา</span>
                    <span class="text-[10px] font-black px-1.5 py-0.2 rounded bg-white/10 text-emerald-300">
                      {{ getStudentRankTier(selectedStudent.studentId).gradeLevel }}
                    </span>
                  </div>
                  <span class="font-black text-sm tracking-wide text-white">
                    {{ getStudentRankTier(selectedStudent.studentId).name }}
                    <span class="text-xs font-normal text-stone-300 ml-1">({{ getStudentRankTier(selectedStudent.studentId).nameTh }})</span>
                  </span>
                </div>
              </div>

              <!-- Student ID -->
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-600 shrink-0">
                  <GraduationCap class="w-4 h-4" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">รหัสนักศึกษา</span>
                  <span class="font-bold font-mono text-stone-800">{{ selectedStudent.studentId }}</span>
                </div>
              </div>

              <!-- Phone -->
              <div class="w-full h-px bg-stone-200/60"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                  <Phone class="w-4 h-4" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">เบอร์โทรศัพท์</span>
                  <a v-if="selectedStudent.phone" :href="`tel:${selectedStudent.phone}`" class="font-bold text-stone-800 hover:text-green-600">
                    {{ selectedStudent.phone }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>

              <!-- Facebook -->
              <div class="w-full h-px bg-stone-200/60"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">Facebook</span>
                  <a v-if="selectedStudent.facebook" :href="selectedStudent.facebookUrl || `https://facebook.com/search/top?q=${selectedStudent.facebook}`" target="_blank" class="font-bold text-blue-600 hover:underline">
                    {{ selectedStudent.facebook }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>

              <!-- Instagram -->
              <div class="w-full h-px bg-stone-200/60"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 shrink-0">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">Instagram</span>
                  <a v-if="selectedStudent.ig" :href="selectedStudent.igUrl || `https://instagram.com/${selectedStudent.ig}`" target="_blank" class="font-bold text-pink-600 hover:underline">
                    {{ selectedStudent.ig.startsWith('@') ? selectedStudent.ig : `@${selectedStudent.ig}` }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>

            </div>

            <!-- Student Edit Button in Modal -->
            <button 
              v-if="canEditSelectedStudentProfile"
              @click="openEditModalFromProfile"
              class="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Pencil class="w-3.5 h-3.5" />
              <span>{{ isTeacher ? 'แก้ไขข้อมูลนักศึกษา (สำหรับอาจารย์)' : 'แก้ไขข้อมูลโปรไฟล์ของฉัน' }}</span>
            </button>

          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add Student Modal -->
    <AddStudentModal 
      v-model="showAddModal" 
      :default-course-id="course.id"
      :default-classroom="selectedClassroom !== 'all' ? selectedClassroom : ''"
      @added="handleStudentAdded"
    />

    <!-- Edit Student Profile Modal -->
    <EditStudentProfileModal
      v-model="showEditModal"
      :student="studentToEdit"
      @updated="handleStudentUpdated"
    />

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
