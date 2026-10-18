<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Search,
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
  Award,
  Lock,
  Leaf
} from '@lucide/vue'
import AddStudentModal from '@/components/AddStudentModal.vue'
import EditStudentProfileModal from '@/components/EditStudentProfileModal.vue'
import MemberCard from '@/components/MemberCard.vue'
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
  if (!authUser.value) return false
  const r = (authUser.value?.role || '').toLowerCase()
  const id = (authUser.value?.studentId || authUser.value?.id || '').toString().toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r) || id === 'boss' || id === '0000'
})

const currentStudent = computed(() => {
  if (isTeacher.value || !authUser.value) return null
  const id = authUser.value.studentId || authUser.value.id
  return studentsList.value.find(s => s.studentId === id || s.id === id) || authUser.value
})

const studentClassroom = computed(() => {
  return currentStudent.value?.classroom || authUser.value?.classroom || ''
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
const selectedClassroom = ref(isTeacher.value ? 'all' : (studentClassroom.value || 'all'))
const searchQuery = ref('')

watch([studentClassroom, isTeacher], ([room, teacher]) => {
  if (!teacher && room) {
    selectedClassroom.value = room
  }
}, { immediate: true })

// Available classrooms for this course
const availableClassrooms = computed(() => {
  const roomsFromConfig = courseClassrooms[course.value.id] || []
  const roomsFromData = [...new Set(studentsList.value.filter(s => isStudentInCourse(s, course.value.id) && isStudent(s)).map(s => s.classroom))]
  return [...new Set([...roomsFromConfig, ...roomsFromData])].filter(Boolean)
})

const courseStudents = computed(() => {
  return studentsList.value.filter(s => isStudentInCourse(s, course.value.id) && isStudent(s))
})

const filteredClassmates = computed(() => {
  return courseStudents.value.filter(s => {
    // นักเรียน: ล็อคให้ดูได้แค่ห้องตัวเองเท่านั้น
    if (!isTeacher.value) {
      if (studentClassroom.value && s.classroom !== studentClassroom.value) {
        return false
      }
    } else {
      const matchRoom = selectedClassroom.value === 'all' || s.classroom === selectedClassroom.value
      if (!matchRoom) return false
    }

    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return true

    const nameMatch = (s.name || '').toLowerCase().includes(query)
    const idMatch = (s.studentId || '').includes(query)
    const nickMatch = (s.nickname || '').toLowerCase().includes(query)
    return nameMatch || idMatch || nickMatch
  })
})

// ต้นไม้: ครู (ราก) -> ห้อง (กิ่ง) -> หัวหน้า / รองหัวหน้า -> นักศึกษา (ใบ)
const classroomGroups = computed(() => {
  const map = new Map()
  filteredClassmates.value.forEach(s => {
    const key = s.classroom || 'ไม่ระบุห้อง'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(s)
  })

  const order = availableClassrooms.value
  const rank = (room) => {
    const i = order.indexOf(room)
    return i < 0 ? 999 : i
  }

  return [...map.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([room, members]) => {
      const president = members.find(m => m.role === 'หัวหน้าห้อง') || null
      const vices = members.filter(m => m.role === 'รองหัวหน้าห้อง')
      const students = members.filter(m => m !== president && m.role !== 'รองหัวหน้าห้อง')
      return {
        room,
        label: room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room,
        president,
        vices,
        students,
        total: members.length
      }
    })
})

// Student Rank Helper
const getStudentRankTier = (studentId) => {
  if (!studentId) return unrankedTier
  const scoreData = getStudentFullScore(course.value.id, studentId)
  return getStudentRank(scoreData.totalScore)
}

const avatarSrc = (a) => {
  if (!a || typeof a !== 'string') return '/placeholder_profile.png'
  if (a.startsWith('data:') || a.startsWith('http') || a.startsWith('/')) return a
  if (a.includes('localhost')) return `http://${a}`
  if (a.includes('/')) return a
  return '/placeholder_profile.png'
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

// สีแถบหัวโปรไฟล์ตามตำแหน่ง
const modalAccent = computed(() => {
  const role = selectedStudent.value?.role
  if (role === 'หัวหน้าห้อง') return 'from-amber-500 via-amber-400 to-orange-400'
  if (role === 'รองหัวหน้าห้อง') return 'from-sky-600 via-sky-500 to-cyan-500'
  return 'from-emerald-700 via-emerald-600 to-teal-500'
})
</script>

<template>
  <div class="space-y-8 pb-16 relative">

    <!-- Top Header Bar -->
    <div
      class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-stone-200 pb-6">
      <div>
        <button @click="router.push(`/course/${course.id}`)"
          class="flex items-center text-sm font-bold mb-3 hover:underline cursor-pointer transition-colors"
          :class="course.theme.bgText">
          <ChevronLeft class="w-4 h-4 mr-1" /> กลับไปหน้ารายวิชา
        </button>
        <div class="flex flex-wrap items-center gap-3">
          <h2 :class="['text-3xl font-black', course.theme.text]">สมาชิกในชั้นเรียน</h2>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Users class="w-3.5 h-3.5" />
            {{ filteredClassmates.length }} คน
            <template v-if="classroomGroups.length > 1"> · {{ classroomGroups.length }} ห้อง</template>
          </span>
        </div>
        <p :class="['font-medium text-sm mt-1', course.theme.bgText]">
          {{ course.name }} (รหัสวิชา {{ course.code }})
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="ค้นหาชื่อ หรือรหัสนักศึกษา..."
            class="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs transition-all hover:border-emerald-300" />
          <button v-if="searchQuery" @click="searchQuery = ''" aria-label="ล้างคำค้นหา"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <button @click="router.push(`/gradebook?courseId=${course.id}`)"
          class="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
          <Award class="w-4 h-4 text-emerald-600" />
          <span>สมุดคะแนนและเช็คชื่อ</span>
        </button>

        <button v-if="isTeacher" @click="showAddModal = true"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
          <UserPlus class="w-4 h-4" />
          <span>เพิ่มนักศึกษา</span>
        </button>
      </div>
    </div>

    <!-- Classroom Filter Tabs -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs font-bold text-stone-500 px-2 flex items-center gap-1">
          <School class="w-3.5 h-3.5 text-stone-600" /> ห้องเรียน:
        </span>

        <template v-if="isTeacher">
          <button @click="selectedClassroom = 'all'" :class="[
            'px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
            selectedClassroom === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-white hover:text-stone-900'
          ]">
            <span>ทั้งหมด</span>
            <span class="px-1.5 rounded-full text-[10px]"
              :class="selectedClassroom === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-600'">
              {{ courseStudents.length }}
            </span>
          </button>

          <button v-for="room in availableClassrooms" :key="room" @click="selectedClassroom = room" :class="[
            'px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
            selectedClassroom === room
              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200'
              : 'text-stone-600 hover:bg-white hover:text-emerald-700'
          ]">
            <span>{{ room === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + room }}</span>
            <span class="px-1.5 rounded-full text-[10px]"
              :class="selectedClassroom === room ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-600'">
              {{courseStudents.filter(s => s.classroom === room).length}}
            </span>
          </button>
        </template>

        <template v-else>
          <div
            class="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
            <span>ห้อง {{ studentClassroom }}</span>
            <span class="px-1.5 rounded-full text-[10px] bg-emerald-700 text-emerald-100">
              {{courseStudents.filter(s => s.classroom === studentClassroom).length}} คน
            </span>
          </div>
        </template>
      </div>

      <div class="text-[11px] text-stone-500 px-2 hidden sm:block">
        {{ isTeacher ? 'คลิกที่การ์ดเพื่อดูข้อมูล หรือกดแก้ไขเพื่อให้นักศึกษาอัปเดตโปรไฟล์' :
          'คลิกที่การ์ดเพื่อดูข้อมูลเพื่อนร่วมชั้น' }}
      </div>
    </div>

    <!-- ============ THE TREE ============ -->
    <section class="flex flex-col items-center" aria-label="โครงสร้างชั้นเรียน">

      <!-- Root: Teacher -->
      <div class="flex flex-col items-center text-center relative z-10 pb-1">
        <div class="relative w-32 h-32">
          <span
            class="absolute inset-[-10px] rounded-full bg-gradient-to-br from-emerald-200 via-emerald-100 to-transparent blur-md opacity-80"></span>
          <img v-if="teacher.equippedFrame" :src="teacher.equippedFrame" alt=""
            class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-lg z-10" />
          <div
            class="relative w-full h-full rounded-full bg-[#E3DCD2] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center ring-2 ring-emerald-500">
            <img :src="teacher.avatar || '/placeholder_profile.png'" alt="อาจารย์ผู้สอน" class="w-full h-full object-cover object-top"
              @error="$event.target.src = '/placeholder_profile.png'" />
          </div>
          <div
            class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-full shadow-md whitespace-nowrap z-20">
            อาจารย์ผู้สอน
          </div>
        </div>
        <h3 class="font-black text-xl text-stone-900 mt-6">{{ teacher.name }}</h3>
        <p class="text-xs text-stone-500">{{ teacher.role }}</p>
      </div>

      <!-- Trunk + branches -->
      <div class="relative w-full flex flex-col items-center">
        <!-- Trunk -->
        <span aria-hidden="true"
          class="tree-trunk absolute top-0 bottom-0 left-[calc(50%-1.5px)] w-[3px] rounded-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-200"></span>

        <!-- Empty state -->
        <div v-if="classroomGroups.length === 0"
          class="relative z-10 mt-10 py-14 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs w-full max-w-xl">
          <div class="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Users class="w-8 h-8" />
          </div>
          <div>
            <h4 class="text-lg font-bold text-stone-800">ไม่พบรายชื่อนักศึกษา</h4>
            <p class="text-xs text-stone-500 mt-1">ยังไม่มีนักศึกษาในห้องที่เลือก หรือคำค้นหาไม่ตรงกับข้อมูลใด</p>
          </div>
          <button v-if="isTeacher" @click="showAddModal = true"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer">
            <UserPlus class="w-4 h-4" /> เพิ่มนักศึกษาคนแรก
          </button>
        </div>

        <!-- Each classroom = one branch -->
        <div v-for="group in classroomGroups" :key="group.room"
          class="relative z-10 w-full flex flex-col items-center pt-9">
          <!-- Branch label -->
          <div
            class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-black shadow-lg shadow-emerald-200 ring-4 ring-white">
            <School class="w-4 h-4" />
            {{ group.label }}
            <span class="px-2 py-0.5 rounded-full bg-emerald-800/60 text-[11px] font-bold">{{ group.total }} คน</span>
          </div>

          <!-- President -->
          <div v-if="group.president" class="w-full flex justify-center pt-9">
            <MemberCard :student="group.president" variant="president"
              :rank="getStudentRankTier(group.president.studentId)" :can-edit="isTeacher" @view="openProfileModal"
              @edit="openEditModal" />
          </div>

          <!-- Vice presidents (bus line with drops) -->
          <div v-if="group.vices.length" class="w-full flex flex-wrap justify-center pt-9">
            <div v-for="vp in group.vices" :key="vp.id"
              class="relative pt-8 px-3 pb-1 before:absolute before:top-0 before:left-1/2 before:h-8 before:w-0.5 before:bg-emerald-300 after:absolute after:top-0 after:inset-x-0 after:h-0.5 after:bg-emerald-300 first:after:left-1/2 last:after:right-1/2 only:after:hidden">
              <MemberCard :student="vp" variant="vice" :rank="getStudentRankTier(vp.studentId)" :can-edit="isTeacher"
                @view="openProfileModal" @edit="openEditModal" />
            </div>
          </div>

          <!-- Leaves: students -->
          <div v-if="group.students.length"
            class="relative w-full mt-9 rounded-[2rem] bg-emerald-50 border border-emerald-100 px-4 py-6 md:px-7 md:py-7">
            <span
              class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white"></span>

            <div class="mb-5 flex items-center justify-center gap-2 text-sm font-bold text-emerald-900">
              <Leaf class="w-4 h-4 text-emerald-600" />
              <span>เพื่อนร่วมชั้น {{ group.students.length }} คน</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              <MemberCard v-for="student in group.students" :key="student.id" :student="student" variant="student"
                :rank="getStudentRankTier(student.studentId)" :can-edit="isTeacher" @view="openProfileModal"
                @edit="openEditModal" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Student Profile Modal -->
    <Teleport to="body">
      <div v-if="showProfileModal && selectedStudent" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="closeProfileModal"></div>

        <div
          class="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-[bounceIn_0.3s_ease-out] flex flex-col max-h-[92vh] overflow-y-auto">

          <div :class="['h-28 bg-gradient-to-r relative shrink-0', modalAccent]">
            <button @click="closeProfileModal" aria-label="ปิด"
              class="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="px-6 pb-6 flex flex-col items-center -mt-14 relative z-10">
            <div class="relative w-24 h-24 mb-3">
              <img v-if="selectedStudent.equippedFrame" :src="selectedStudent.equippedFrame" alt=""
                class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
              <div
                class="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-stone-700 border-4 border-white shadow-lg overflow-hidden">
                <img :src="avatarSrc(selectedStudent.avatar)"
                  :alt="selectedStudent.name" class="w-full h-full object-cover object-top"
                  @error="$event.target.src = '/placeholder_profile.png'" />
              </div>
            </div>

            <h3 class="font-black text-xl text-stone-800 mb-0.5 text-center">{{ selectedStudent.name }}</h3>
            <p class="text-stone-600 mb-3 font-medium text-xs">
              ชื่อเล่น: {{ selectedStudent.nickname && selectedStudent.nickname !== '-' ? selectedStudent.nickname :
                '(ยังไม่ได้ระบุ)' }}
            </p>

            <div class="flex items-center gap-2 mb-3">
              <span :class="[
                'px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1',
                selectedStudent.role === 'หัวหน้าห้อง' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  selectedStudent.role === 'รองหัวหน้าห้อง' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                    'bg-stone-100 text-stone-700 border-stone-200'
              ]">
                <ShieldCheck v-if="selectedStudent.role === 'หัวหน้าห้อง'" class="w-3.5 h-3.5 text-amber-600" />
                <Shield v-else-if="selectedStudent.role === 'รองหัวหน้าห้อง'" class="w-3.5 h-3.5 text-sky-600" />
                <span>{{ selectedStudent.role || 'นักศึกษา' }}</span>
              </span>

              <span
                class="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {{ selectedStudent.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + selectedStudent.classroom
                }}
              </span>
            </div>

            <p v-if="selectedStudent.quote" class="text-stone-500 italic text-xs mb-5 text-center px-4">
              “{{ selectedStudent.quote }}”
            </p>

            <div class="w-full bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3 text-xs">

              <!-- Rank -->
              <div
                class="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border border-stone-700 shadow-sm">
                <div
                  class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20 p-1">
                  <img v-if="getStudentRankTier(selectedStudent.studentId).id !== 'unranked'"
                    :src="getStudentRankTier(selectedStudent.studentId).logo" class="w-full h-full object-contain" />
                  <Lock v-else class="w-4 h-4 text-stone-400" />
                </div>
                <div class="flex flex-col flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-stone-400 font-bold">ระดับแรงค์ประจำวิชา</span>
                  </div>
                  <span class="font-black text-sm text-white flex items-center gap-1.5">
                    <Lock v-if="getStudentRankTier(selectedStudent.studentId).id === 'unranked'"
                      class="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    {{ getStudentRankTier(selectedStudent.studentId).name }}
                    <span class="text-xs font-normal text-stone-300 ml-1">({{
                      getStudentRankTier(selectedStudent.studentId).nameTh }})</span>
                  </span>
                </div>
              </div>

              <!-- Student ID -->
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-600 shrink-0">
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
                  <a v-if="selectedStudent.phone" :href="`tel:${selectedStudent.phone}`"
                    class="font-bold text-stone-800 hover:text-green-600">
                    {{ selectedStudent.phone }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>

              <!-- Facebook -->
              <div class="w-full h-px bg-stone-200/60"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">Facebook</span>
                  <a v-if="selectedStudent.facebook"
                    :href="selectedStudent.facebookUrl || `https://facebook.com/search/top?q=${selectedStudent.facebook}`"
                    target="_blank" rel="noopener" class="font-bold text-blue-600 hover:underline">
                    {{ selectedStudent.facebook }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>

              <!-- Instagram -->
              <div class="w-full h-px bg-stone-200/60"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 shrink-0">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-stone-400 font-medium">Instagram</span>
                  <a v-if="selectedStudent.ig"
                    :href="selectedStudent.igUrl || `https://instagram.com/${selectedStudent.ig}`" target="_blank"
                    rel="noopener" class="font-bold text-pink-600 hover:underline">
                    {{ selectedStudent.ig.startsWith('@') ? selectedStudent.ig : `@${selectedStudent.ig}` }}
                  </a>
                  <span v-else class="text-stone-400 italic">(ยังไม่ได้ระบุ)</span>
                </div>
              </div>
            </div>

            <button v-if="canEditSelectedStudentProfile" @click="openEditModalFromProfile"
              class="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
              <Pencil class="w-3.5 h-3.5" />
              <span>{{ isTeacher ? 'แก้ไขข้อมูลนักศึกษา (สำหรับอาจารย์)' : 'แก้ไขข้อมูลโปรไฟล์ของฉัน' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <AddStudentModal v-model="showAddModal" :default-course-id="course.id"
      :default-classroom="selectedClassroom !== 'all' ? selectedClassroom : ''" @added="handleStudentAdded" />

    <EditStudentProfileModal v-model="showEditModal" :student="studentToEdit" @updated="handleStudentUpdated" />
  </div>
</template>

<style scoped>
/* จังหวะเดียวของหน้า: ลำต้นค่อย ๆ งอกลงมาตอนเปิดหน้า */
.tree-trunk {
  transform-origin: top;
  animation: trunkGrow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes trunkGrow {
  from {
    transform: scaleY(0);
  }

  to {
    transform: scaleY(1);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.02);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tree-trunk {
    animation: none;
  }
}
</style>