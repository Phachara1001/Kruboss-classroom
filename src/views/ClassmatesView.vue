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
import StudentAvatar from '@/components/StudentAvatar.vue'
import StudentProfileModal from '@/components/StudentProfileModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { studentsList, courseClassrooms, isStudentInCourse, isStudent, isTeacherUser } from '../data/studentsStore'
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

const isTeacher = computed(() => isTeacherUser(authUser.value))

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
        <StudentAvatar
          :avatar="teacher.avatar"
          :frame="teacher.equippedFrame"
          :name="teacher.name"
          size="w-32 h-32"
          avatarClass="bg-[#E3DCD2]"
          borderClass="border-4 border-white shadow-xl ring-2 ring-emerald-500"
        >
          <template #badge>
            <div
              class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-full shadow-md whitespace-nowrap z-20">
              อาจารย์ผู้สอน
            </div>
          </template>
        </StudentAvatar>
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

    <!-- Student Profile Modal Component -->
    <StudentProfileModal
      v-model="showProfileModal"
      :student="selectedStudent"
      :course-id="course?.id"
      @edit="openEditModalFromProfile"
    />

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