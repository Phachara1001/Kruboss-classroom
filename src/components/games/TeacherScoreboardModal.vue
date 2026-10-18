<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  X, Trophy, Users, Search, CheckCircle2, Clock,
  AlertCircle, Award, FileSpreadsheet, Lock
} from '@lucide/vue'
import { studentsList, isStudent, isStudentInCourse } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

const props = defineProps({
  show: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: false },
  courseId: { type: String, required: true },
  courseName: { type: String, default: '' },
  week: { type: Number, required: true },
  weekTitle: { type: String, default: '' },
  games: {
    type: Array,
    required: true
    // [{ id: 'game-1', name: 'แยกประเภทแบบเก่า vs DevOps', maxScore: 6, isQuiz: false }, ...]
  }
})

const emit = defineEmits(['close'])

const isVisible = computed(() => props.show || props.isOpen)

const searchQuery = ref('')
const selectedClassroom = ref('all')
const statusFilter = ref('all') // 'all', 'completed', 'in_progress', 'not_started'

// Load scores on mount and when modal opens
const refreshData = () => {
  if (props.courseId && props.week) {
    fetchGameScores(props.courseId, props.week)
  }
}

watch(() => isVisible.value, (newVal) => {
  if (newVal) refreshData()
})

onMounted(() => {
  if (isVisible.value) refreshData()
})

// Enrolled students in this course
const enrolledStudents = computed(() => {
  return studentsList.value.filter(s => isStudent(s) && isStudentInCourse(s, props.courseId))
})

// Available classrooms from students
const classrooms = computed(() => {
  const rooms = new Set()
  enrolledStudents.value.forEach(s => {
    if (s.classroom) rooms.add(s.classroom)
  })
  return Array.from(rooms).sort()
})

// Build enriched student rows
const studentRows = computed(() => {
  return enrolledStudents.value.map((student, index) => {
    const sId = student.studentId || student.id
    const key = `${props.courseId}_${props.week}_${sId}`
    const record = gameScoresStore.value[key] || {}
    const scores = record.scores || {}

    const norm = calculateNormalizedScore(scores, props.games)

    let status = 'not_started'
    if (norm.isAllCompleted) {
      status = 'completed'
    } else if (norm.completedCount > 0) {
      status = 'in_progress'
    }

    return {
      index: index + 1,
      studentId: sId,
      name: student.name,
      classroom: student.classroom || '-',
      avatar: student.avatar,
      scores,
      earned: norm.earned,
      max: norm.max,
      normalized: norm.normalized,
      isAllCompleted: norm.isAllCompleted,
      completedCount: norm.completedCount,
      totalGames: norm.totalGames,
      status
    }
  })
})

// Filtered rows
const filteredRows = computed(() => {
  return studentRows.value.filter(row => {
    const matchesSearch = !searchQuery.value ||
      row.studentId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      row.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesClass = selectedClassroom.value === 'all' || row.classroom === selectedClassroom.value

    const matchesStatus = statusFilter.value === 'all' || row.status === statusFilter.value

    return matchesSearch && matchesClass && matchesStatus
  })
})

// Summary Statistics
const stats = computed(() => {
  const total = studentRows.value.length
  const completed = studentRows.value.filter(r => r.status === 'completed').length
  const inProgress = studentRows.value.filter(r => r.status === 'in_progress').length
  const notStarted = studentRows.value.filter(r => r.status === 'not_started').length

  const scoresSum = studentRows.value
    .filter(r => r.status === 'completed')
    .reduce((acc, r) => acc + Number(r.normalized), 0)

  const avgScore = completed > 0 ? (scoresSum / completed).toFixed(1) : '0.0'

  return { total, completed, inProgress, notStarted, avgScore }
})

const getScoreColorClass = (normalized) => {
  const val = Number(normalized)
  if (val >= 8.0) return 'bg-emerald-100 text-emerald-800 border-emerald-300'
  if (val >= 6.5) return 'bg-blue-100 text-blue-800 border-blue-300'
  if (val >= 5.0) return 'bg-amber-100 text-amber-800 border-amber-300'
  return 'bg-rose-100 text-rose-800 border-rose-300'
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm">
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-md border border-white/20">
                สัปดาห์ที่ {{ week }}
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-400 text-stone-900 shadow-xs">
                <Lock class="w-3 h-3" />
                โหมดดูข้อมูลเท่านั้น (แก้ไขคะแนนไม่ได้)
              </span>
            </div>
            <h2 class="text-2xl font-black flex items-center gap-2.5">
              <Award class="w-6 h-6 text-amber-300" />
              ตารางคะแนนมินิเกมและแบบทดสอบหลังเรียน
            </h2>
            <p class="text-indigo-200 text-xs sm:text-sm mt-1">
              วิชา {{ courseName }} ({{ courseId }}) • {{ weekTitle }} • คะแนนทั้งหมดรวมและหารเฉลี่ยเต็ม 10 คะแนน
            </p>
          </div>

          <button @click="emit('close')" 
            class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Summary Statistics Cards -->
        <div class="p-4 sm:p-6 bg-stone-50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span class="text-xs text-stone-500 font-medium block">นักศึกษาทั้งหมด</span>
            <div class="text-xl sm:text-2xl font-black text-stone-800 mt-0.5 flex items-center gap-2">
              <Users class="w-5 h-5 text-indigo-600" />
              <span>{{ stats.total }} คน</span>
            </div>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span class="text-xs text-stone-500 font-medium block">ทำครบทุกกิจกรรม</span>
            <div class="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-emerald-500" />
              <span>{{ stats.completed }} คน</span>
            </div>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span class="text-xs text-stone-500 font-medium block">กำลังทำ / ยังไม่ครบ</span>
            <div class="text-xl sm:text-2xl font-black text-amber-600 mt-0.5 flex items-center gap-2">
              <Clock class="w-5 h-5 text-amber-500" />
              <span>{{ stats.inProgress }} คน</span>
            </div>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span class="text-xs text-stone-500 font-medium block">คะแนนเฉลี่ยผู้ทำครบ</span>
            <div class="text-xl sm:text-2xl font-black text-indigo-700 mt-0.5 flex items-center gap-1.5">
              <Trophy class="w-5 h-5 text-amber-400" />
              <span>{{ stats.avgScore }}</span>
              <span class="text-xs font-bold text-stone-400">/ 10</span>
            </div>
          </div>
        </div>

        <!-- Filters & Search Bar -->
        <div class="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
            <div class="relative flex-1 min-w-[200px]">
              <Search class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="ค้นหารหัสนักศึกษา หรือ ชื่อ-นามสกุล..."
                class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            <select v-model="selectedClassroom" class="px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white font-medium text-stone-700 focus:outline-none">
              <option value="all">ทุกห้องเรียน</option>
              <option v-for="c in classrooms" :key="c" :value="c">ห้อง {{ c }}</option>
            </select>

            <select v-model="statusFilter" class="px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white font-medium text-stone-700 focus:outline-none">
              <option value="all">ทุกสถานะ</option>
              <option value="completed">ทำครบแล้ว</option>
              <option value="in_progress">กำลังทำ</option>
              <option value="not_started">ยังไม่เริ่ม</option>
            </select>
          </div>

          <div class="text-xs text-stone-500 font-medium">
            แสดง {{ filteredRows.length }} จาก {{ studentRows.length }} คน
          </div>
        </div>

        <!-- Scoreboard Table -->
        <div class="flex-1 overflow-auto p-4 sm:p-6">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr class="bg-stone-100 text-stone-700 border-b border-stone-200 font-black">
                <th class="py-3 px-3 text-center w-12">#</th>
                <th class="py-3 px-3 min-w-[110px]">รหัสนักศึกษา</th>
                <th class="py-3 px-3 min-w-[160px]">ชื่อ - นามสกุล</th>
                <th class="py-3 px-3 text-center min-w-[80px]">ห้อง</th>
                
                <!-- Dynamic Game Columns -->
                <th v-for="(g, gIdx) in games" :key="g.id" 
                  :class="[
                    'py-3 px-3 text-center min-w-[120px]',
                    g.isQuiz ? 'bg-cyan-50/80 text-cyan-900 border-x border-cyan-100' : ''
                  ]">
                  <div class="leading-tight">
                    <span>{{ g.name }}</span>
                    <span class="block text-[11px] font-normal text-stone-500">เต็ม {{ g.maxScore }} คะแนน</span>
                  </div>
                </th>

                <!-- Total Column (Scaled to 10) -->
                <th class="py-3 px-3 text-center min-w-[140px] bg-indigo-50/80 text-indigo-950 font-black border-l border-indigo-200">
                  <div class="leading-tight">
                    <span>คะแนนรวมทั้งหมด</span>
                    <span class="block text-[11px] font-bold text-indigo-600">(หารเฉลี่ยเต็ม 10)</span>
                  </div>
                </th>

                <th class="py-3 px-3 text-center min-w-[100px]">สถานะ</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-stone-100 font-medium text-stone-700">
              <tr v-for="row in filteredRows" :key="row.studentId" class="hover:bg-indigo-50/30 transition-colors">
                <td class="py-3 px-3 text-center text-stone-400 font-mono">{{ row.index }}</td>
                <td class="py-3 px-3 font-mono font-bold text-stone-800">{{ row.studentId }}</td>
                <td class="py-3 px-3 font-semibold text-stone-900">{{ row.name }}</td>
                <td class="py-3 px-3 text-center">
                  <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-xs font-semibold">
                    {{ row.classroom }}
                  </span>
                </td>

                <!-- Scores per Game -->
                <td v-for="g in games" :key="g.id" 
                  :class="[
                    'py-3 px-3 text-center font-mono',
                    g.isQuiz ? 'bg-cyan-50/30' : ''
                  ]">
                  <template v-if="row.scores[g.id]">
                    <span class="font-bold text-stone-900">
                      {{ row.scores[g.id].score }}
                    </span>
                    <span class="text-xs text-stone-400 font-normal">/{{ g.maxScore }}</span>
                  </template>
                  <span v-else class="text-stone-300 font-mono">-</span>
                </td>

                <!-- Total Score (Out of 10) -->
                <td class="py-3 px-3 text-center bg-indigo-50/40 border-l border-indigo-100 font-mono">
                  <template v-if="row.completedCount > 0">
                    <span :class="['px-2.5 py-1 rounded-xl text-xs font-black border shadow-2xs inline-block', getScoreColorClass(row.normalized)]">
                      {{ row.normalized }} / 10
                    </span>
                  </template>
                  <span v-else class="text-stone-300 font-mono">-</span>
                </td>

                <!-- Status Badge -->
                <td class="py-3 px-3 text-center">
                  <span v-if="row.status === 'completed'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                    <span>ครบแล้ว</span>
                  </span>
                  <span v-else-if="row.status === 'in_progress'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock class="w-3.5 h-3.5 text-amber-600" />
                    <span>{{ row.completedCount }}/{{ row.totalGames }}</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold text-stone-400 bg-stone-100">
                    <span>ยังไม่ทำ</span>
                  </span>
                </td>
              </tr>

              <tr v-if="filteredRows.length === 0">
                <td :colspan="6 + games.length" class="py-12 text-center text-stone-400">
                  <AlertCircle class="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>ไม่พบข้อมูลนักศึกษาตามเงื่อนไขการค้นหา</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Notice -->
        <div class="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div class="flex items-center gap-2">
            <Lock class="w-4 h-4 text-stone-400 shrink-0" />
            <span>ตารางนี้แสดงคะแนนจากการทำมินิเกมและแบบทดสอบจริงของนักเรียน (เล่นได้คนละ 1 ครั้ง) คะแนนรวมจะถูกคำนวณหารเฉลี่ยเต็ม 10 คะแนนอัตโนมัติ และไม่สามารถแก้ไขคะแนนได้</span>
          </div>
          <button @click="emit('close')" class="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors cursor-pointer shrink-0">
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
