<script setup>
import { ref, computed } from 'vue'
import { BookOpen, ChevronRight, GraduationCap, Layers, Award } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { courses } from '../data/courses'
import { authUser } from '../data/authStore'
import { studentsList } from '../data/studentsStore'
import { Database, GitBranch, LineChart, Cpu } from '@lucide/vue'

const courseIcons = {
  '31901-2007': Database,
  '21901-2012': GitBranch,
  '31901-2012': LineChart,
  '21901-2007': Cpu
}

const router = useRouter()
const activeTab = ref('all') // 'all' | 'ปวช.' | 'ปวส.'

const handleCourseClick = (courseId) => {
  router.push(`/course/${courseId}`)
}

const isTeacher = computed(() => authUser.value?.role === 'teacher')

const visibleCourses = computed(() => {
  if (isTeacher.value) return courses
  const student = studentsList.value.find(s => s.studentId === authUser.value?.id || s.id === authUser.value?.id)
  const studentCourseIds = student?.courseIds || []
  return courses.filter(c => studentCourseIds.includes(c.id))
})

const pchCourses = computed(() => visibleCourses.value.filter(c => c.levelGroup === 'ปวช.'))
const pwsCourses = computed(() => visibleCourses.value.filter(c => c.levelGroup === 'ปวส.'))
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Page Header & Filter Tabs -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-black text-gray-900 mb-2">รายวิชาทั้งหมดของคุณ</h2>
        <p class="text-gray-500 font-medium text-base">ภาคเรียนที่ 2 ปีการศึกษา 2569 • แผนกวิชาเทคโนโลยีสารสนเทศ</p>
      </div>

      <!-- Level Filter Tabs (ปวช. / ปวส. / ทั้งหมด) -->
      <div
        class="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl self-stretch md:self-auto border border-gray-200/80 shadow-xs">
        <button @click="activeTab = 'all'" :class="[
          'flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
          activeTab === 'all'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
        ]">
          <Layers class="w-4 h-4" />
          <span>ทั้งหมด</span>
          <span class="px-2 py-0.5 rounded-full text-xs"
            :class="activeTab === 'all' ? 'bg-gray-100 text-gray-800' : 'bg-gray-200/70 text-gray-600'">
            {{ visibleCourses.length }}
          </span>
        </button>

        <button @click="activeTab = 'ปวช.'" :class="[
          'flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
          activeTab === 'ปวช.'
            ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
            : 'text-gray-500 hover:text-purple-700 hover:bg-white/50'
        ]">
          <GraduationCap class="w-4 h-4" />
          <span>ระดับ ปวช.</span>
          <span class="px-2 py-0.5 rounded-full text-xs"
            :class="activeTab === 'ปวช.' ? 'bg-purple-700 text-purple-100' : 'bg-gray-200/70 text-gray-600'">
            {{ pchCourses.length }}
          </span>
        </button>

        <button @click="activeTab = 'ปวส.'" :class="[
          'flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
          activeTab === 'ปวส.'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
            : 'text-gray-500 hover:text-emerald-700 hover:bg-white/50'
        ]">
          <Award class="w-4 h-4" />
          <span>ระดับ ปวส.</span>
          <span class="px-2 py-0.5 rounded-full text-xs"
            :class="activeTab === 'ปวส.' ? 'bg-emerald-700 text-emerald-100' : 'bg-gray-200/70 text-gray-600'">
            {{ pwsCourses.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Section 1: ระดับประกาศนียบัตรวิชาชีพ (ปวช.) -->
    <section v-if="(activeTab === 'all' || activeTab === 'ปวช.') && pchCourses.length > 0" class="space-y-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <GraduationCap class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-black text-gray-900">ระดับประกาศนียบัตรวิชาชีพ (ปวช.)</h3>
            <p class="text-xs md:text-sm text-gray-500">รายวิชาของระดับชั้นประกาศนียบัตรวิชาชีพ (ปวช.)</p>
          </div>
        </div>
        <span
          class="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-full text-xs font-bold shadow-xs">
          {{ pchCourses.length }} รายวิชา
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="course in pchCourses" :key="course.id" @click="handleCourseClick(course.id)"
          class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col hover:shadow-2xl hover:-translate-y-2 relative">
          <!-- Decorative Background Element -->
          <div
            class="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-20"
            :class="course.theme.titleBg"></div>
          <div
            class="absolute -right-4 top-20 w-20 h-20 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-10 delay-75"
            :class="course.theme.titleBg"></div>

          <div class="p-8 flex-1 flex flex-col relative z-10">
            <div class="flex flex-col gap-4 mb-6">
              <div class="flex justify-between items-start">
                <div
                  :class="['w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6', course.theme.badgeBg, course.theme.badgeText]">
                  <component v-if="courseIcons[course.id]" :is="courseIcons[course.id]" class="w-8 h-8" />
                  <GraduationCap v-else class="w-8 h-8" />
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="course.level"
                    :class="['px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-current/20', course.theme.badgeBg, course.theme.badgeText]">
                    ห้อง {{ course.level }}
                  </span>
                  <span
                    :class="['px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors', course.theme.badgeBg, course.theme.badgeText]">
                    รหัสวิชา {{ course.code }}
                  </span>
                </div>
              </div>
            </div>

            <h3
              :class="['font-black text-2xl md:text-3xl leading-normal mb-3 transition-colors duration-300 group-hover:text-opacity-80 pb-1', course.theme.text]">
              {{ course.name }}
            </h3>

            <p v-if="course.description" class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
              {{ course.description }}
            </p>

            <div class="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
              <div class="flex gap-4">
                <span
                  class="flex items-center gap-1.5 text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <BookOpen class="w-4 h-4" /> {{ course.topics.length }} หัวข้อ
                </span>
              </div>
              <div
                :class="['font-bold flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md', course.theme.buttonBg, course.theme.buttonText, course.theme.buttonHoverBg, 'group-hover:text-white']">
                เข้าสู่ห้องเรียน
                <ChevronRight class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) -->
    <section v-if="(activeTab === 'all' || activeTab === 'ปวส.') && pwsCourses.length > 0" class="space-y-5 pt-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <Award class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-black text-gray-900">ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</h3>
            <p class="text-xs md:text-sm text-gray-500">รายวิชาของระดับชั้นประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</p>
          </div>
        </div>
        <span
          class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold shadow-xs">
          {{ pwsCourses.length }} รายวิชา
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="course in pwsCourses" :key="course.id" @click="handleCourseClick(course.id)"
          class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col hover:shadow-2xl hover:-translate-y-2 relative">
          <!-- Decorative Background Element -->
          <div
            class="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-20"
            :class="course.theme.titleBg"></div>
          <div
            class="absolute -right-4 top-20 w-20 h-20 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-10 delay-75"
            :class="course.theme.titleBg"></div>

          <div class="p-8 flex-1 flex flex-col relative z-10">
            <div class="flex flex-col gap-4 mb-6">
              <div class="flex justify-between items-start">
                <div
                  :class="['w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6', course.theme.badgeBg, course.theme.badgeText]">
                  <GraduationCap class="w-8 h-8" />
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="course.level"
                    :class="['px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-current/20', course.theme.badgeBg, course.theme.badgeText]">
                    ห้อง {{ course.level }}
                  </span>
                  <span
                    :class="['px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors', course.theme.badgeBg, course.theme.badgeText]">
                    รหัสวิชา {{ course.code }}
                  </span>
                </div>
              </div>
            </div>

            <h3
              :class="['font-black text-2xl md:text-3xl leading-normal mb-3 transition-colors duration-300 group-hover:text-opacity-80 pb-1', course.theme.text]">
              {{ course.name }}
            </h3>

            <p v-if="course.description" class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
              {{ course.description }}
            </p>

            <div class="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
              <div class="flex gap-4">
                <span
                  class="flex items-center gap-1.5 text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <BookOpen class="w-4 h-4" /> {{ course.topics.length }} หัวข้อ
                </span>
              </div>
              <div
                :class="['font-bold flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md', course.theme.buttonBg, course.theme.buttonText, course.theme.buttonHoverBg, 'group-hover:text-white']">
                เข้าสู่ห้องเรียน
                <ChevronRight class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
