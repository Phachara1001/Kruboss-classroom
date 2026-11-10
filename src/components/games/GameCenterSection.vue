<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Gamepad2,
  FileSpreadsheet,
  Trophy,
  MousePointer2,
  ListOrdered,
  FileQuestion,
  Check,
  Clock,
  Target
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'

import { courses } from '@/data/courses'
import { authUser } from '@/data/authStore'
import { isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    default: ''
  },
  week: {
    type: Number,
    required: true
  },
  weekTitle: {
    type: String,
    default: ''
  },
  // Game 1: Drag & Drop
  dragTitle: {
    type: String,
    default: ''
  },
  dragSubtitle: {
    type: String,
    default: 'ลากลักษณะหรือข้อความด้านล่างไปใส่กล่องที่ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)'
  },
  dragTabLabel: {
    type: String,
    default: 'มินิเกมที่ 1: แยกประเภท'
  },
  dragSummaryLabel: {
    type: String,
    default: '1. แยกประเภท (Drag & Drop)'
  },
  dragItems: {
    type: Array,
    default: () => []
  },
  dragZones: {
    type: Array,
    default: () => []
  },
  // Game 2: Matching
  matchTitle: {
    type: String,
    default: ''
  },
  matchSubtitle: {
    type: String,
    default: 'จับคู่คำศัพท์กับคำอธิบายให้ถูกต้อง ไม่เฉลยระหว่างทำ แล้วกดบันทึกคำตอบทีเดียว (เล่นได้ครั้งเดียว)'
  },
  matchTabLabel: {
    type: String,
    default: 'มินิเกมที่ 2: โยงคำศัพท์'
  },
  matchSummaryLabel: {
    type: String,
    default: '2. โยงคำศัพท์ (Matching)'
  },
  matchLeftTerms: {
    type: Array,
    default: () => []
  },
  matchRightDefs: {
    type: Array,
    default: () => []
  },
  // Game 3: Post-test Quiz
  quizTitle: {
    type: String,
    default: ''
  },
  quizSubtitle: {
    type: String,
    default: 'แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดผลความรู้หลังเรียน ตอบให้ครบแล้วกดส่งคำตอบ (ทำได้ครั้งเดียวเท่านั้น)'
  },
  quizTabLabel: {
    type: String,
    default: 'แบบทดสอบหลังเรียน (4 ชอยส์ 10 ข้อ)'
  },
  quizSummaryLabel: {
    type: String,
    default: '3. แบบทดสอบหลังเรียน 10 ข้อ'
  },
  quizQuestions: {
    type: Array,
    default: () => []
  },
  // Optional custom games config override
  games: {
    type: Array,
    default: null
  }
})

const activeGame = ref('sort') // 'sort' | 'order' | 'quiz'
const showTeacherModal = ref(false)

const currentCourseObj = computed(() => {
  return courses.find(c => c.id === props.courseId) || null
})

const currentTopicObj = computed(() => {
  if (!currentCourseObj.value?.topics) return null
  return currentCourseObj.value.topics.find(t => Number(t.weekNumber) === Number(props.week)) || null
})

const resolvedCourseName = computed(() => {
  return props.courseName || currentCourseObj.value?.name || 'รายวิชา'
})

const resolvedWeekTitle = computed(() => {
  if (props.weekTitle) return props.weekTitle
  if (currentTopicObj.value?.name) {
    return `สัปดาห์ที่ ${props.week}: ${currentTopicObj.value.name}`
  }
  return `สัปดาห์ที่ ${props.week}`
})

const maxDragScore = computed(() => props.dragItems?.length || 6)
const maxMatchScore = computed(() => props.matchLeftTerms?.length || 5)
const maxQuizScore = computed(() => props.quizQuestions?.length || 10)

const resolvedDragTitle = computed(() => {
  return props.dragTitle || `มินิเกมที่ 1: แยกประเภทประจำสัปดาห์ที่ ${props.week}`
})

const resolvedMatchTitle = computed(() => {
  return props.matchTitle || `มินิเกมที่ 2: โยงความสัมพันธ์ประจำสัปดาห์ที่ ${props.week}`
})

const resolvedQuizTitle = computed(() => {
  return props.quizTitle || `แบบทดสอบหลังเรียน (Post-test): ${resolvedWeekTitle.value}`
})

const weekGames = computed(() => {
  if (props.games && props.games.length > 0) return props.games
  return [
    { id: 'game-1', name: 'มินิเกม 1 (Drag & Drop)', maxScore: maxDragScore.value, isQuiz: false },
    { id: 'game-2', name: 'มินิเกม 2 (Matching)', maxScore: maxMatchScore.value, isQuiz: false },
    { id: 'quiz', name: `แบบทดสอบหลังเรียน (${maxQuizScore.value} ข้อ)`, maxScore: maxQuizScore.value, isQuiz: true }
  ]
})

const isTeacher = computed(() => isTeacherUser(authUser.value))
const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')

const studentWeekScores = computed(() => {
  if (!currentStudentId.value) return {}
  const key = `${props.courseId}_${props.week}_${currentStudentId.value}`
  return gameScoresStore.value[key]?.scores || {}
})

const studentNorm = computed(() => {
  return calculateNormalizedScore(studentWeekScores.value, weekGames.value)
})

onMounted(() => {
  if (props.courseId && props.week) {
    fetchGameScores(props.courseId, props.week)
  }
})

watch(
  () => [props.courseId, props.week],
  ([newCourseId, newWeek]) => {
    if (newCourseId && newWeek) {
      fetchGameScores(newCourseId, newWeek)
    }
  }
)
</script>

<template>
  <section class="space-y-6">
    <!-- Header & Teacher Scoreboard Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
          <Gamepad2 class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
            Game Center: ทดสอบความเข้าใจ &amp; แบบทดสอบหลังเรียน
          </h2>
          <p class="text-sm text-gray-500 mt-0.5">
            เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10 คะแนน
          </p>
        </div>
      </div>

      <!-- Teacher Scoreboard Button -->
      <button
        v-if="isTeacher"
        @click="showTeacherModal = true"
        class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-indigo-700 shrink-0 cursor-pointer"
      >
        <FileSpreadsheet class="w-4 h-4 text-amber-400" />
        <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
      </button>
    </div>

    <!-- Student Score Summary Banner -->
    <div class="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
            สรุปคะแนนของคุณประจำสัปดาห์ที่ {{ week }}
          </span>
          <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
            <span>สถานะ:</span>
            <span
              v-if="studentNorm.isAllCompleted"
              class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              ทำครบทุกกิจกรรมแล้ว (3/3)
            </span>
            <span
              v-else-if="studentNorm.completedCount > 0"
              class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1"
            >
              <Clock class="w-3.5 h-3.5" />
              กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
            </span>
            <span
              v-else
              class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200"
            >
              ยังไม่ได้เริ่มทำ
            </span>
          </div>
        </div>

        <!-- Total Normalized Score (Scaled to 10) -->
        <div class="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-xl border border-indigo-100">
          <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
          <div>
            <span class="text-xs text-indigo-900 font-semibold block">
              คะแนนรวมที่แปลงเป็นคะแนนเก็บ 10
            </span>
            <div class="text-xl font-black text-indigo-950 leading-tight">
              <span>{{ studentNorm.normalized }}</span>
              <span class="text-xs font-bold text-gray-400"> / 10.0 คะแนน</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Activity Status Badges -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium">
        <!-- Game 1 -->
        <div
          :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-1']
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-gray-50 border-gray-200 text-gray-600'
          ]"
        >
          <div>
            <span class="font-bold block">{{ dragSummaryLabel }}</span>
            <span class="text-[11px] text-gray-500">เต็ม {{ maxDragScore }} คะแนน</span>
          </div>
          <span class="font-black text-sm">
            {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / ${maxDragScore}` : 'ยังไม่ได้เล่น' }}
          </span>
        </div>

        <!-- Game 2 -->
        <div
          :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-2']
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-gray-50 border-gray-200 text-gray-600'
          ]"
        >
          <div>
            <span class="font-bold block">{{ matchSummaryLabel }}</span>
            <span class="text-[11px] text-gray-500">เต็ม {{ maxMatchScore }} คะแนน</span>
          </div>
          <span class="font-black text-sm">
            {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / ${maxMatchScore}` : 'ยังไม่ได้เล่น' }}
          </span>
        </div>

        <!-- Post-test -->
        <div
          :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['quiz']
              ? 'bg-cyan-50/70 border-cyan-200 text-cyan-900'
              : 'bg-gray-50 border-gray-200 text-gray-600'
          ]"
        >
          <div>
            <span class="font-bold block">{{ quizSummaryLabel }}</span>
            <span class="text-[11px] text-gray-500">เต็ม {{ maxQuizScore }} คะแนน</span>
          </div>
          <span class="font-black text-sm">
            {{ studentWeekScores['quiz'] ? `${studentWeekScores['quiz'].score} / ${maxQuizScore}` : 'ยังไม่ได้ทำ' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Game Tabs -->
    <div class="flex flex-wrap gap-3">
      <button
        @click="activeGame = 'sort'"
        :class="[
          activeGame === 'sort'
            ? 'bg-indigo-600 text-white shadow-lg scale-105'
            : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]"
      >
        <MousePointer2 class="w-4 h-4" />
        <span>{{ dragTabLabel }}</span>
        <span
          v-if="studentWeekScores['game-1']"
          class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
        >
          <Check class="w-3 h-3" />
          บันทึกแล้ว
        </span>
      </button>

      <button
        @click="activeGame = 'order'"
        :class="[
          activeGame === 'order'
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]"
      >
        <ListOrdered class="w-4 h-4" />
        <span>{{ matchTabLabel }}</span>
        <span
          v-if="studentWeekScores['game-2']"
          class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
        >
          <Check class="w-3 h-3" />
          บันทึกแล้ว
        </span>
      </button>

      <button
        @click="activeGame = 'quiz'"
        :class="[
          activeGame === 'quiz'
            ? 'bg-emerald-600 text-white shadow-lg scale-105'
            : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]"
      >
        <FileQuestion class="w-4 h-4" />
        <Target class="w-4 h-4 text-rose-500" />
        <span>{{ quizTabLabel }}</span>
        <span
          v-if="studentWeekScores['quiz']"
          class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
        >
          <Check class="w-3 h-3" />
          บันทึกแล้ว
        </span>
      </button>
    </div>

    <!-- Game 1: Drag & Drop -->
    <DragDropGame
      v-if="activeGame === 'sort'"
      :title="resolvedDragTitle"
      :subtitle="dragSubtitle"
      gameId="game-1"
      :courseId="courseId"
      :week="week"
      :initialItems="dragItems"
      :zones="dragZones"
    />

    <!-- Game 2: Matching -->
    <MatchingGame
      v-if="activeGame === 'order'"
      :title="resolvedMatchTitle"
      :subtitle="matchSubtitle"
      gameId="game-2"
      :courseId="courseId"
      :week="week"
      :initialLeftTerms="matchLeftTerms"
      :initialRightDefs="matchRightDefs"
    />

    <!-- Game 3: Final Post-test -->
    <PopQuiz
      v-if="activeGame === 'quiz'"
      :title="resolvedQuizTitle"
      :subtitle="quizSubtitle"
      gameId="quiz"
      :courseId="courseId"
      :week="week"
      :questions="quizQuestions"
    />

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal
      :show="showTeacherModal"
      :courseId="courseId"
      :courseName="resolvedCourseName"
      :week="week"
      :weekTitle="resolvedWeekTitle"
      :games="weekGames"
      @close="showTeacherModal = false"
    />
  </section>
</template>

