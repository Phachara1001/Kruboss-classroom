<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { BookOpen, Star, Clock, ChevronRight, Lock, X, ChevronLeft, Users, Wrench, Award } from '@lucide/vue'
import { useRouter, useRoute } from 'vue-router'
import { courses } from '../data/courses'
import StudentRankCard from '@/components/StudentRankCard.vue'
import { fetchAllCourseData } from '../data/gradesStore'

const router = useRouter()
const route = useRoute()

const course = computed(() => courses.find(c => c.id === route.params.id) || courses[0])

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

const showModal = ref(false)
const selectedTopic = ref(null)

const handleTopicClick = (topic) => {
  if (topic.isOpen) {
    router.push(`/course/${course.value.id}/week/${topic.weekNumber}`)
  } else {
    selectedTopic.value = topic
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
  setTimeout(() => selectedTopic.value = null, 300)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <button @click="router.push('/courses')" class="flex items-center text-sm font-bold mb-4 hover:underline"
          :class="course.theme.bgText">
          <ChevronLeft class="w-4 h-4 mr-1" /> กลับไปหน้ารวมวิชา
        </button>
        <h2 :class="['text-3xl font-black mb-2', course.theme.text]">บทเรียนทั้งหมด ({{ course.topics.length }} สัปดาห์)
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <p :class="['font-medium text-lg', course.theme.bgText]">รหัสวิชา {{ course.code }} {{ course.name }}</p>
          <span v-if="course.level" :class="['px-2.5 py-0.5 rounded-md text-xs font-bold shadow-xs border border-current/20', course.theme.badgeBg, course.theme.badgeText]">
            ห้อง {{ course.level }}
          </span>
          <span v-if="course.credits" :class="['px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200']">
            {{ course.credits }}
          </span>
        </div>
        <p v-if="course.description" class="text-gray-600 text-sm mt-2 max-w-3xl leading-relaxed">
          {{ course.description }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <button @click="router.push(`/gradebook?courseId=${course.id}`)"
          class="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-stone-800 bg-white border border-stone-300 font-bold transition-all shadow-xs hover:shadow-md hover:bg-stone-50 cursor-pointer">
          <Award class="w-4 h-4 text-emerald-600" />
          สมุดคะแนนและเช็คชื่อ
        </button>
        <button @click="router.push(`/course/${course.id}/tools`)"
          :class="['flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110 cursor-pointer', course.theme.titleBg]">
          <Wrench class="w-4 h-4" />
          เครื่องมือเรียน
        </button>
        <button @click="router.push(`/course/${course.id}/classmates`)"
          :class="['flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110 cursor-pointer', course.theme.titleBg]">
          <Users class="w-4 h-4" />
          เพื่อนร่วมชั้น
        </button>
      </div>
    </div>

    <!-- Student Rank Tier Card -->
    <StudentRankCard :course-id="course.id" :course-name="course.name" />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-for="topic in course.topics" :key="topic.id" @click="handleTopicClick(topic)" :class="[
        'rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col block',
        topic.isOpen ? `bg-white ${course.theme.border} hover:shadow-xl hover:-translate-y-1 ${course.theme.hoverBorder}` : 'bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-90'
      ]">
        <!-- Topic Header/Image -->
        <div class="h-32 w-full relative" :class="topic.isOpen ? topic.image : 'bg-gray-400 grayscale'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <div v-if="topic.isOpen"
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/30 group-hover:scale-110 transition-transform">
              <Star class="w-5 h-5" />
            </div>
            <div v-else
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 shadow-inner border border-white/10">
              <Lock class="w-5 h-5" />
            </div>
          </div>

          <div class="absolute bottom-4 left-4 text-white">
            <span :class="[
              'px-3 py-1 backdrop-blur-md rounded-lg text-sm font-bold border border-white/20 shadow-sm',
              topic.id.includes('สอบ') ? 'bg-red-600/80' : 'bg-black/40'
            ]">
              {{ topic.id }}
            </span>
          </div>
        </div>

        <!-- Topic Info -->
        <div class="p-6 flex-1 flex flex-col">
          <h3
            :class="['font-bold text-xl leading-snug mb-3 line-clamp-2 transition-colors', topic.isOpen ? 'text-gray-900 ' + course.theme.bgText.replace('text-', 'group-hover:text-') : 'text-gray-600']">
            {{ topic.name }}
          </h3>

          <div class="mt-auto">
            <div class="flex justify-between items-center mb-5">
              <span
                :class="['text-sm font-bold uppercase tracking-wider', topic.isOpen ? course.theme.bgText : 'text-gray-500']">{{
                topic.status }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Clock class="w-4 h-4" /> 3 ชม.
              </span>
              <div
                :class="['font-bold flex items-center gap-1 text-sm px-4 py-2 rounded-xl transition-colors',
                  topic.isOpen ? `${course.theme.buttonBg} ${course.theme.buttonText} ${course.theme.buttonHoverBg} group-hover:text-white` : 'bg-gray-200 text-gray-500']">
                {{ topic.isOpen ? (topic.progress === 100 ? 'ทบทวนเนื้อหา' : 'เข้าเรียน') : 'ยังไม่เปิดให้เรียน' }}
                <ChevronRight v-if="topic.isOpen" class="w-4 h-4" />
                <Lock v-else class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Locked Topics -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

        <div class="modal-content relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="h-2 bg-red-500 w-full"></div>
          <button @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <X class="w-5 h-5" />
          </button>

          <div class="p-8 text-center flex flex-col items-center">
            <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Lock class="w-8 h-8 text-red-500 animate-wiggle" />
            </div>
            <span v-if="selectedTopic?.phase" class="px-3 py-1 bg-purple-50 text-purple-700 font-bold rounded-full text-xs mb-3 border border-purple-100">
              {{ selectedTopic.phase }}
            </span>
            <h3 class="text-xl font-black text-gray-900 mb-1">เนื้อหายังไม่เปิดให้เข้าเรียน</h3>
            <p class="text-purple-900 font-bold text-base mb-3 leading-snug">
              {{ selectedTopic?.id }}: {{ selectedTopic?.name }}
            </p>
            <div v-if="selectedTopic?.desc" class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 text-left">
              <span class="text-[11px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">เนื้อหาที่จะได้เรียนรู้</span>
              <p class="text-xs text-gray-600 leading-relaxed">{{ selectedTopic.desc }}</p>
            </div>
            <p class="text-xs text-gray-400 mb-6">
              ระบบจะเปิดให้เข้าเรียนตามกำหนดการสอนของรายวิชา
            </p>
            <button @click="closeModal"
              class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 text-sm">
              รับทราบ กลับสู่หน้ารายวิชา
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Modal Transition Styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Modal Content Bounce Animation */
.modal-enter-active .modal-content {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.modal-leave-active .modal-content {
  animation: bounceOut 0.3s ease-in forwards;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bounceOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  100% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
}

/* Continuous Lock Animations */
@keyframes wiggle {

  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(8deg) scale(1.1);
  }
}

.animate-wiggle {
  animation: wiggle 1.5s ease-in-out infinite;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.animate-pulse-glow {
  animation: pulseGlow 2s infinite;
}
</style>
