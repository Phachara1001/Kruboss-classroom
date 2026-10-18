<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BookOpen, Home, Settings, Users, ChevronLeft, ChevronRight, GraduationCap, Wrench, Contact, CalendarDays, Award, ShoppingBag, Package, LogOut, User, BarChart2, MoreVertical, ShieldAlert, Target, Coins } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { studentsList } from '../data/studentsStore'
import MyProfileModal from './MyProfileModal.vue'
import ResetPasswordRequestsModal from './ResetPasswordRequestsModal.vue'
import { passwordResetRequests, fetchPasswordResetRequests } from '../data/authStore'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const navGroups = [
  {
    name: 'ทั่วไป',
    items: [
      { name: 'หน้าหลัก', path: '/', icon: Home, roles: ['teacher', 'student'] },
      { name: 'ตารางสอน', path: '/schedule', icon: CalendarDays, roles: ['teacher', 'student'] },
      { name: 'ข้อมูลผู้สอน', path: '/teacher', icon: Contact, roles: ['teacher', 'student'] }
    ]
  },
  {
    name: 'การเรียนการสอน',
    items: [
      { name: 'หัวข้อการเรียน', path: '/courses', icon: BookOpen, roles: ['teacher', 'student'] },
      { name: 'ภารกิจประจำสัปดาห์', path: '/quests', icon: Target, roles: ['teacher', 'student'] },
      { name: 'สมุดคะแนนและเช็คชื่อ', path: '/gradebook', icon: Award, roles: ['student'] }
    ]
  },
  {
    name: 'ระบบผู้สอน',
    roles: ['teacher'],
    items: [
      { name: 'จัดการนักศึกษา', path: '/students', icon: Users, roles: ['teacher'] },
      { name: 'ยอดเหรียญ (Coins)', path: '/coins', icon: Coins, roles: ['teacher'] },
      { name: 'สมุดคะแนนและเช็คชื่อ', path: '/gradebook', icon: Award, roles: ['teacher'] },
      { name: 'จัดการประกาศ', path: '/announcements', icon: Target, roles: ['teacher'] }
    ]
  },
  {
    name: 'กาชาและของรางวัล',
    items: [
      { name: 'ร้านค้าและกล่องสุ่ม', path: '/shop', icon: ShoppingBag, roles: ['teacher', 'student'] },
      { name: 'กระเป๋าไอเทม', path: '/inventory', icon: Package, roles: ['teacher', 'student'] }
    ]
  }
]

import { useRouter, useRoute } from 'vue-router'
import { authUser, logout } from '../data/authStore'

const route = useRoute()

const isItemActive = (item) => {
  if (!route || !route.path) return false
  if (item.path === '/') {
    return route.path === '/'
  }
  if (item.path === '/courses') {
    return route.path === '/courses' || route.path.startsWith('/course')
  }
  return route.path === item.path || route.path.startsWith(item.path + '/')
}

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const normalizedRole = computed(() => {
  return isTeacher.value ? 'teacher' : 'student'
})

const filteredNavGroups = computed(() => {
  const role = normalizedRole.value
  return navGroups.map(group => {
    if (group.roles && !group.roles.includes(role)) return null
    const filteredItems = group.items.filter(item => !item.roles || item.roles.includes(role))
    if (filteredItems.length === 0) return null
    return { ...group, items: filteredItems }
  }).filter(Boolean)
})

// Mock Current User (merge auth user with student info if student)
const currentUser = computed(() => {
  if (!authUser.value) return null
  return studentsList.value.find(s => s.studentId === authUser.value.id) || authUser.value
})

const activeFrame = computed(() => {
  if (!currentUser.value) return null
  return currentUser.value.equippedFrame || null
})

const router = useRouter()
const handleLogout = () => {
  logout()
  router.push('/login')
}

const isProfileMenuOpen = ref(false)
const showProfileModal = ref(false)
const showRequestsModal = ref(false)

const pendingRequestsCount = computed(() => {
  return passwordResetRequests.value.filter(r => r.status === 'pending').length
})

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

// Close menu when clicking outside
const closeMenu = (e) => {
  if (!e.target.closest('.profile-menu-container')) {
    isProfileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
  if (isTeacher.value) {
    fetchPasswordResetRequests()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

const openProfileEdit = () => {
  isProfileMenuOpen.value = false
  showProfileModal.value = true
}

</script>

<template>
  <aside class="bg-green-800 text-white transition-all duration-300 ease-in-out flex flex-col relative"
    :class="isCollapsed ? 'w-20' : 'w-64'">
    <!-- Logo area -->
    <div class="flex items-center justify-center border-b border-green-700 overflow-hidden"
      :class="isCollapsed ? 'h-20 px-4' : 'p-0 relative'">
      <img v-show="!isCollapsed" src="/kruboss_logo.png" alt="KruBoss Classroom"
        class="w-full h-auto object-cover transition-all duration-300" />
      <img v-show="isCollapsed" src="/kruboss_logo.ico" alt="Logo"
        class="w-10 h-10 object-contain transition-all duration-300" />
    </div>

    <!-- Toggle button -->
    <button @click="emit('toggle')"
      class="absolute -right-3 top-20 bg-green-100 text-green-800 rounded-full p-1 shadow-md hover:bg-green-200 transition-colors z-10 focus:outline-none">
      <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <!-- Navigation -->
    <nav class="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden no-scrollbar">
      <template v-for="(group, index) in filteredNavGroups" :key="group.name">
        <!-- Group Header -->
        <div v-if="!isCollapsed" :class="['px-3 mb-1 text-[10px] font-black text-green-300/80 uppercase tracking-wider', index > 0 ? 'mt-4' : 'mt-0']">
          {{ group.name }}
        </div>
        <div v-else-if="index > 0" class="my-2 border-t border-green-700/50 mx-2"></div>
        
        <!-- Group Items -->
        <RouterLink v-for="item in group.items" :key="item.name" :to="item.path"
          class="flex items-center px-3 py-2.5 rounded-lg transition-colors group/nav"
          :class="[
            { 'justify-center': isCollapsed },
            isItemActive(item) ? 'bg-green-600 text-white shadow-sm font-bold' : 'text-green-100 hover:bg-green-700/80 hover:text-white'
          ]">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0 transition-colors"
            :class="isItemActive(item) ? 'text-white' : 'text-green-100 group-hover/nav:text-white'" />
          <span v-if="!isCollapsed" class="ml-3 text-sm whitespace-nowrap overflow-hidden">
            {{ item.name }}
          </span>
        </RouterLink>
      </template>
    </nav>

    <!-- Bottom user info -->
    <div class="relative profile-menu-container">
      
      <!-- Popover Menu -->
      <div v-if="isProfileMenuOpen" class="absolute bottom-full left-2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden text-stone-800 z-50">
        <div class="p-3 border-b border-stone-100 bg-stone-50">
          <p class="text-sm font-bold truncate">{{ currentUser?.name || 'User Name' }}</p>
          <p class="text-xs text-stone-500 truncate">{{ currentUser?.studentId || 'ID' }}</p>
        </div>
        <div class="p-1">
          <button class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-stone-100 rounded-lg transition-colors cursor-pointer text-left">
            <BarChart2 class="w-4 h-4 text-indigo-500" /> ดูผลการเรียน
          </button>
          <button @click="openProfileEdit" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-stone-100 rounded-lg transition-colors cursor-pointer text-left">
            <User class="w-4 h-4 text-emerald-500" /> แก้ไขโปรไฟล์
          </button>
        </div>
        <div v-if="isTeacher" class="p-1 border-t border-stone-100">
          <button @click="isProfileMenuOpen = false; showRequestsModal = true" class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium hover:bg-stone-100 rounded-lg transition-colors cursor-pointer text-left">
            <div class="flex items-center gap-3">
              <ShieldAlert class="w-4 h-4 text-amber-500" /> คำขอรีเซ็ตรหัส
            </div>
            <span v-if="pendingRequestsCount > 0" class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {{ pendingRequestsCount }}
            </span>
          </button>
        </div>
        <div class="p-1 border-t border-stone-100">
          <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left">
            <LogOut class="w-4 h-4" /> ล็อกเอาต์
          </button>
        </div>
      </div>

      <div @click="toggleProfileMenu" class="p-4 border-t border-green-700 bg-green-900/50 flex items-center cursor-pointer hover:bg-green-800/80 transition-colors"
        :class="{ 'justify-center': isCollapsed }">
        <div class="relative w-10 h-10 shrink-0">
          <!-- Frame -->
          <img v-if="activeFrame" :src="activeFrame" class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" />
          <div class="w-full h-full rounded-full bg-green-300 flex items-center justify-center text-green-900 font-bold overflow-hidden border border-green-400 relative z-0">
            <img :src="(currentUser?.avatar && (currentUser.avatar.includes('/') || currentUser.avatar.includes('http') || currentUser.avatar.startsWith('data:'))) ? currentUser.avatar : '/placeholder_profile.png'" class="w-full h-full object-cover object-top" @error="$event.target.src = '/placeholder_profile.png'" />
          </div>
          <!-- Notification Badge -->
          <div v-if="isTeacher && pendingRequestsCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-green-900 rounded-full animate-pulse z-20"></div>
        </div>
        
        <div v-if="!isCollapsed" class="ml-3 overflow-hidden flex-1 flex items-center justify-between">
          <div>
            <p class="text-sm font-bold whitespace-nowrap text-white truncate max-w-[120px]">{{ currentUser?.name || 'User Name' }}</p>
            <p class="text-xs text-green-300 whitespace-nowrap truncate">{{ currentUser?.role || 'Student' }}</p>
          </div>
          <MoreVertical class="w-4 h-4 text-green-400/70" />
        </div>
      </div>
    </div>
    
    <!-- Profile Edit Modal -->
    <MyProfileModal 
      v-if="currentUser" 
      v-model="showProfileModal" 
      :student="currentUser"
      @updated="() => {}" 
    />
    
    <!-- Teacher Requests Modal -->
    <ResetPasswordRequestsModal 
      v-if="isTeacher"
      v-model="showRequestsModal"
    />
    
  </aside>
</template>
