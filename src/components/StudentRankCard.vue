<script setup>
import { ref, computed } from 'vue'
import { 
  Award, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Info, 
  User, 
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Lock,
  BarChart3,
  Layers,
  Crown,
  Medal,
  Flame,
  Zap,
  Filter,
  Check,
  CheckCircle2,
  Target,
  ChevronDown,
  ChevronUp,
  Gauge
} from '@lucide/vue'
import { 
  rankTiers, 
  unrankedTier, 
  allTiersList, 
  rankMilestones,
  getStudentRank, 
  getNextRankInfo,
  getStudentExpProgress 
} from '../data/rankConfig'
import { studentsList, isStudentInCourse, isStudent } from '../data/studentsStore'
import { getStudentFullScore } from '../data/gradesStore'
import { getStudentEquipment } from '../data/shopStore'
import { authUser } from '../data/authStore'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    default: 'รายวิชา'
  }
})

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

const myStudentId = computed(() => {
  return authUser.value?.studentId || authUser.value?.id || ''
})

// Tab Navigation: 'my_rank' (แรงค์ของฉัน) | 'course_overview' (อันดับและภาพรวม)
const viewMode = ref('my_rank')

// Enrolled students in this course (Real students only, teacher excluded)
const enrolledStudents = computed(() => {
  return studentsList.value.filter(s => isStudentInCourse(s, props.courseId) && isStudent(s))
})

// Available classrooms for filtering in overview
const availableClassrooms = computed(() => {
  const rooms = enrolledStudents.value.map(s => s.classroom).filter(Boolean)
  return [...new Set(rooms)]
})

// Classroom filter for overview
const selectedRoomFilter = ref('all')

// Optional Tier filter for overview leaderboard (when clicking chart bars)
const selectedTierFilter = ref(null)

// Current selected student for "My Rank" view
const activeStudentId = ref('')

const currentStudent = computed(() => {
  if (activeStudentId.value) {
    const found = enrolledStudents.value.find(s => s.studentId === activeStudentId.value)
    if (found) return found
  }
  if (!isTeacher.value && myStudentId.value) {
    const found = enrolledStudents.value.find(s => s.studentId === myStudentId.value)
    if (found) return found
  }
  return enrolledStudents.value[0] || null
})

// Calculate Rank for current active student
const currentScoreData = computed(() => {
  if (!currentStudent.value) return null
  return getStudentFullScore(props.courseId, currentStudent.value.studentId)
})

const studentEquipment = computed(() => {
  if (!currentStudent.value) return null
  return getStudentEquipment(currentStudent.value.studentId)
})

const studentRank = computed(() => {
  if (!currentScoreData.value) return unrankedTier
  return getStudentRank(currentScoreData.value.totalScore)
})

const nextRankInfo = computed(() => {
  return getNextRankInfo(studentRank.value)
})

// EXP Progress and Score Spoiler
const studentExp = computed(() => {
  const score = currentScoreData.value ? currentScoreData.value.totalScore : 0
  return getStudentExpProgress(score)
})

// Spoiler Drawer State
const showScoreBreakdown = ref(false)

// ==========================================
// COURSE OVERVIEW & LEADERBOARD DATA
// (Strict rule: No raw numeric scores exposed)
// ==========================================
const overviewStudents = computed(() => {
  return enrolledStudents.value.filter(s => {
    if (selectedRoomFilter.value === 'all') return true
    return s.classroom === selectedRoomFilter.value
  })
})

// Full leaderboard sorted by Tier (Highest to Lowest, then by ID)
const courseLeaderboard = computed(() => {
  const list = overviewStudents.value.map(student => {
    const scoreData = getStudentFullScore(props.courseId, student.studentId)
    const tier = getStudentRank(scoreData.totalScore)
    return {
      student,
      tier,
      // For deterministic tie-breaking without showing score
      internalScore: scoreData.totalScore
    }
  })

  // Sort by tier.rankNumber ascending (1 Omniverse down to 8 Unranked), then tie-break
  list.sort((a, b) => {
    if (a.tier.rankNumber !== b.tier.rankNumber) {
      return a.tier.rankNumber - b.tier.rankNumber
    }
    return b.internalScore - a.internalScore || a.student.studentId.localeCompare(b.student.studentId)
  })

  return list.map((item, index) => ({
    rankPosition: index + 1,
    student: item.student,
    tier: item.tier
  }))
})

// Filtered leaderboard if user clicks on a specific tier in the chart
const filteredLeaderboard = computed(() => {
  if (!selectedTierFilter.value) return courseLeaderboard.value
  return courseLeaderboard.value.filter(item => item.tier.name === selectedTierFilter.value)
})

// Distribution Chart Data (all 7 tiers + unranked)
const tierDistribution = computed(() => {
  const total = overviewStudents.value.length || 1
  return allTiersList.map(tier => {
    const matchingStudents = courseLeaderboard.value.filter(item => item.tier.name === tier.name)
    const count = matchingStudents.length
    const percentage = Math.round((count / total) * 100)
    return {
      ...tier,
      count,
      percentage
    }
  })
})

// Course Stats Summary
const highestTierAchieved = computed(() => {
  const top = courseLeaderboard.value[0]
  return top ? top.tier : unrankedTier
})

const dominantTier = computed(() => {
  if (tierDistribution.value.length === 0) return unrankedTier
  const sorted = [...tierDistribution.value].sort((a, b) => b.count - a.count)
  return sorted[0] || unrankedTier
})

// Switch to student view from leaderboard
const inspectStudentRank = (studentId) => {
  activeStudentId.value = studentId
  viewMode.value = 'my_rank'
}

// Roadmap Modal state
const showRoadmapModal = ref(false)
</script>

<template>
  <div class="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-gradient-to-b from-stone-900 via-stone-950 to-black text-white p-5 sm:p-7 transition-all duration-500">
    
    <!-- Ambient Tier Background Glow -->
    <div 
      class="absolute -top-28 -right-28 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
      :class="studentRank.themeGradient ? `bg-gradient-to-br ${studentRank.themeGradient}` : 'bg-emerald-500'"
    ></div>

    <div class="relative z-10 space-y-6">
      
      <!-- Top Bar: Title & Mode Switcher Menu -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        
        <!-- Header Info -->
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-emerald-300 border border-white/10 flex items-center gap-1.5 shadow-sm">
              <Trophy class="w-3 h-3 text-amber-400" />
              ระบบจัดอันดับชั้น (Student Tier Ranking)
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            ระดับแรงค์ประจำรายวิชา
          </h3>
          <p class="text-xs text-stone-400 mt-0.5">
            สะสมผลงานการเรียนและการเข้าเรียนเพื่อเลื่อนขั้นสู่ระดับสูงสุด
          </p>
        </div>

        <!-- Controls: Tab Selector & Student/Room Dropdown -->
        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          <!-- Mode Toggle: 'my_rank' vs 'course_overview' -->
          <div class="inline-flex p-1 bg-stone-900/90 rounded-2xl border border-white/10 shadow-inner">
            <button 
              @click="viewMode = 'my_rank'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
                viewMode === 'my_rank'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              ]"
            >
              <User class="w-3.5 h-3.5" />
              <span>แรงค์ของฉัน</span>
            </button>
            <button 
              @click="viewMode = 'course_overview'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
                viewMode === 'course_overview'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              ]"
            >
              <BarChart3 class="w-3.5 h-3.5" />
              <span>อันดับและภาพรวมทั้งวิชา</span>
            </button>
          </div>

          <!-- Filter: Room Picker in 'course_overview' -->
          <div v-if="viewMode === 'course_overview'" class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 shrink-0">
            <Filter class="w-3.5 h-3.5 text-stone-400 ml-2" />
            <select 
              v-model="selectedRoomFilter"
              class="bg-transparent text-xs font-bold text-stone-200 outline-none pr-3 cursor-pointer"
            >
              <option value="all" class="bg-stone-900 text-white">ทุกห้องเรียน ({{ enrolledStudents.length }} คน)</option>
              <option 
                v-for="room in availableClassrooms" 
                :key="room" 
                :value="room"
                class="bg-stone-900 text-white"
              >
                ห้อง {{ room }}
              </option>
            </select>
          </div>

        </div>

      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: แรงค์ของฉัน (PERSONAL RANK VIEW WITH COOL ANIMATIONS) -->
      <!-- ======================================================== -->
      <div v-if="viewMode === 'my_rank' && currentStudent" class="animate-[fadeIn_0.4s_ease-out]">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 py-2">
          
          <!-- Left Column: Circular Student Profile Decorated with Rank Logo -->
          <div class="flex flex-col items-center text-center shrink-0">
            <div class="relative group cursor-pointer" @click="showRoadmapModal = true">
              
              <!-- Dynamic Cosmic / Plasma Ambient Aura Behind Profile -->
              <div 
                class="tier-aura-glow absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 scale-95"
                :class="[
                  studentEquipment?.theme?.colorClass ? `bg-gradient-to-tr ${studentEquipment.theme.colorClass}` : (studentRank.themeGradient ? `bg-gradient-to-tr ${studentRank.themeGradient}` : 'bg-stone-700'),
                  `aura-${studentRank.animClass}`
                ]"
              ></div>

              <!-- Celestial Rotating Ring Effect for Top Tiers -->
              <div 
                v-if="studentRank.rankNumber <= 2"
                class="celestial-orbit-ring absolute -inset-3 rounded-full border border-dashed border-amber-400/40 pointer-events-none"
              ></div>
              <div 
                v-if="studentRank.rankNumber === 1"
                class="celestial-orbit-ring-reverse absolute -inset-6 rounded-full border border-dotted border-rose-500/30 pointer-events-none"
              ></div>

              <!-- Main Circular Profile Frame with Rank Theme Gradient -->
              <div 
                class="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 transition-transform duration-500 group-hover:scale-105 shadow-2xl flex items-center justify-center bg-gradient-to-tr"
                :class="studentEquipment?.theme?.colorClass || studentRank.themeGradient || 'from-stone-700 to-stone-500'"
              >
                <!-- Inner Circular Student Avatar -->
                <div class="w-full h-full rounded-full bg-stone-900 border-2 border-white/25 overflow-hidden flex items-center justify-center relative shadow-inner">
                  <!-- Photo Avatar (if available) -->
                  <img 
                    v-if="currentStudent.avatar && (currentStudent.avatar.includes('/') || currentStudent.avatar.includes('http'))" 
                    :src="currentStudent.avatar" 
                    :alt="currentStudent.name"
                    class="w-full h-full object-cover" 
                  />
                  <!-- Fallback: Initials with Stylish Gradient & Classroom Info -->
                  <div 
                    v-else 
                    class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 text-white select-none p-2"
                  >
                    <span 
                      class="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr"
                      :class="studentRank.themeGradient || 'from-stone-200 to-white'"
                    >
                      {{ currentStudent.avatar || currentStudent.name.charAt(0) }}
                    </span>
                    <span class="text-[10px] font-bold text-stone-400 mt-0.5 text-center leading-tight">
                      ห้อง {{ currentStudent.classroom }}
                    </span>
                  </div>

                  <!-- Online Status Dot -->
                  <div class="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-stone-900 bg-emerald-500 shadow-xs"></div>
                </div>

                <!-- Equipped Frame -->
                <img v-if="currentStudent.equippedFrame" :src="currentStudent.equippedFrame" class="absolute inset-0 w-full h-full object-cover scale-[1.25] pointer-events-none z-30 drop-shadow-lg" />

                <!-- Equipped Pet -->
                <div v-if="studentEquipment?.pet" class="absolute -top-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 z-40 pointer-events-none drop-shadow-xl animate-bounce" style="animation-duration: 3s">
                  <img :src="studentEquipment.pet.image" class="w-full h-full object-contain filter drop-shadow-md" />
                </div>

                <!-- DECORATION: Rank Logo Badge Adorning the Profile (ประดับที่มุมล่างขวา) -->
                <div 
                  class="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-110 z-40"
                >
                  <img 
                    v-if="studentRank.badgeImg"
                    :src="studentRank.badgeImg" 
                    :alt="studentRank.name"
                    :class="[
                      'w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]',
                      studentRank.animClass || 'anim-pulsar'
                    ]"
                  />
                  <div 
                    v-else 
                    class="w-12 h-12 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center text-stone-400 shadow-lg anim-unranked"
                  >
                    <Lock class="w-5 h-5 text-stone-400" />
                  </div>
                </div>

              </div>

              <!-- Rank Number Pill (Centered below the circle) -->
              <div 
                v-if="studentRank.rankNumber <= 7"
                class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-stone-950 border border-white/20 shadow-xl whitespace-nowrap flex items-center gap-1 z-40"
                :class="studentRank.textColor"
              >
                <Sparkles class="w-3 h-3" />
                Tier #{{ studentRank.rankNumber }}
              </div>
            </div>
          </div>

          <!-- Middle Column: Rank Details & Student Meta -->
          <div class="flex-1 text-center md:text-left space-y-3">
            
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-stone-300">
              <span class="text-white">{{ currentStudent.name }}</span>
              <span class="text-stone-400 font-mono text-[11px]">({{ currentStudent.studentId }})</span>
              <span class="px-2 py-0.5 rounded bg-white/10 text-[10px] text-stone-300 font-semibold">ห้อง {{ currentStudent.classroom }}</span>
            </div>

            <!-- Rank Name and Thai Title -->
            <div>
              <div class="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h2 
                  class="text-4xl sm:text-5xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r"
                  :class="studentEquipment?.theme?.colorClass || studentRank.themeGradient || 'from-stone-200 to-stone-400'"
                >
                  {{ studentRank.name }}
                </h2>
                
                <!-- Grade Badge (Grade 4.0 - 1.0) -->
                <span 
                  v-if="studentRank.grade !== '0'"
                  class="px-3 py-1 rounded-xl text-xs sm:text-sm font-black border uppercase tracking-wider shadow-sm"
                  :class="[studentRank.bgColor, studentRank.borderColor, studentRank.textColor]"
                >
                  ระดับเกรด {{ studentRank.grade }} ({{ studentRank.letter }})
                </span>
              </div>
              
              <p class="text-base font-bold text-stone-300 mt-1">
                {{ studentRank.thaiTitle }}
              </p>
            </div>

            <p class="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xl">
              {{ studentRank.description }}
            </p>

            <!-- ============================================== -->
            <!-- 1. หลอด EXP ประจำแรงค์ (TIER EXP PROGRESS BAR) -->
            <!-- ============================================== -->
            <div class="pt-2 space-y-3">
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 shadow-lg backdrop-blur-xs">
                
                <!-- EXP Bar Header -->
                <div class="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Zap class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-black text-white tracking-wide">
                      หลอดพลังงาน EXP สะสม
                    </span>
                    <span class="px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-emerald-300">
                      Level {{ studentRank.grade }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="font-mono font-black text-sm text-emerald-400">
                      {{ studentExp.currentScore }}
                    </span>
                    <span class="text-stone-400 text-xs">
                      / {{ studentExp.isMaxRank ? '100 EXP (MAX)' : `${studentExp.tierMax} EXP` }}
                    </span>
                    <span 
                      class="px-2 py-0.5 rounded-md text-[10px] font-black border"
                      :class="[studentRank.bgColor, studentRank.borderColor, studentRank.textColor]"
                    >
                      {{ studentExp.isMaxRank ? 'MAXED' : `${studentExp.progressPercent}%` }}
                    </span>
                  </div>
                </div>

                <!-- Glowing Progress Bar Track -->
                <div class="relative h-4.5 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
                  <!-- Fill Bar -->
                  <div 
                    class="h-full rounded-full transition-all duration-1000 relative overflow-hidden bg-gradient-to-r shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    :class="studentRank.themeGradient || 'from-emerald-500 to-teal-400'"
                    :style="{ width: `${studentExp.isMaxRank ? 100 : Math.max(studentExp.progressPercent, 6)}%` }"
                  >
                    <!-- Animated Shimmer Beam -->
                    <div class="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] anim-exp-shimmer pointer-events-none"></div>
                  </div>
                </div>

                <!-- EXP Bar Subtext / Requirement -->
                <div class="flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2 pt-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
                    <span>เกณฑ์เริ่มต้นระดับนี้: <strong class="text-stone-300">{{ studentExp.tierMin }} EXP</strong></span>
                  </div>
                  <div class="text-right">
                    <span v-if="!studentExp.isMaxRank" class="text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles class="w-3 h-3 text-amber-400 inline" />
                      ขาดอีก <strong>{{ studentExp.neededScore }} EXP</strong> เพื่อเลื่อนขั้นสู่ {{ studentExp.nextRank.name }} ({{ studentExp.tierMax }} EXP)
                    </span>
                    <span v-else class="text-amber-300 font-bold flex items-center gap-1">
                      <Crown class="w-3.5 h-3.5 text-amber-400 inline" />
                      คุณบรรลุระดับจักรวาลสูงสุดของรายวิชานี้แล้ว!
                    </span>
                  </div>
                </div>

              </div>

              <!-- ======================================================== -->
              <!-- 2. เส้นทางสปอยเกณฑ์คะแนนตามขั้นแรงค์ (TIER MILESTONES ROAD) -->
              <!-- ======================================================== -->
              <div class="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Target class="w-3.5 h-3.5 text-emerald-400" />
                    <span class="text-xs font-black text-white">
                      เส้นทางสปอยคะแนนขั้นบันไดตามระดับแรงค์
                    </span>
                  </div>
                  <span class="text-[10px] text-stone-400">
                    เกณฑ์คะแนนสะสม 0 - 80+
                  </span>
                </div>

                <!-- Checkpoints Track -->
                <div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
                  <div 
                    v-for="ms in rankMilestones" 
                    :key="ms.name"
                    :class="[
                      'p-2 rounded-xl border flex flex-col items-center text-center transition-all relative group',
                      studentRank.name === ms.name 
                        ? 'bg-white/15 border-emerald-400 ring-2 ring-emerald-500/50 shadow-md' 
                        : studentExp.currentScore >= ms.score 
                          ? 'bg-white/5 border-white/20' 
                          : 'bg-black/20 border-white/5 opacity-50'
                    ]"
                  >
                    <!-- Active Marker Pill -->
                    <div 
                      v-if="studentRank.name === ms.name"
                      class="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-emerald-500 text-stone-950 text-[8px] font-black uppercase whitespace-nowrap shadow-xs"
                    >
                      คุณอยู่ตรงนี้
                    </div>

                    <!-- Mini Icon/Emblem -->
                    <div class="w-6 h-6 my-1 flex items-center justify-center">
                      <img 
                        v-if="ms.badgeImg" 
                        :src="ms.badgeImg" 
                        :alt="ms.name"
                        class="w-full h-full object-contain filter drop-shadow-xs" 
                      />
                      <Lock v-else class="w-3.5 h-3.5 text-stone-500" />
                    </div>

                    <!-- Tier Name -->
                    <span class="text-[10px] font-bold text-white truncate max-w-full">
                      {{ ms.name }}
                    </span>

                    <!-- Score Badge (สปอยคะแนน) -->
                    <span 
                      class="mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold"
                      :class="studentExp.currentScore >= ms.score ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-stone-400'"
                    >
                      {{ ms.score }}+ EXP
                    </span>
                    
                    <span class="text-[8px] text-stone-400 mt-0.5">
                      เกรด {{ ms.grade }}
                    </span>
                  </div>
                </div>

                <!-- 3. EXP Breakdown Spoiler Accordion -->
                <div class="pt-1 border-t border-white/10">
                  <button 
                    @click="showScoreBreakdown = !showScoreBreakdown"
                    class="w-full flex items-center justify-between text-[11px] text-stone-300 hover:text-white py-1 cursor-pointer transition-colors"
                  >
                    <span class="flex items-center gap-1.5 font-bold">
                      <Gauge class="w-3 h-3 text-cyan-400" />
                      สปอยที่มาของคะแนน EXP ทั้งหมด (100 คะแนนเต็ม)
                    </span>
                    <span class="flex items-center gap-1 text-[10px] text-stone-400">
                      {{ showScoreBreakdown ? 'ซ่อนรายละเอียด' : 'คลิกเพื่อดูสัดส่วนคะแนน' }}
                      <ChevronUp v-if="showScoreBreakdown" class="w-3 h-3" />
                      <ChevronDown v-else class="w-3 h-3" />
                    </span>
                  </button>

                  <div v-if="showScoreBreakdown && currentScoreData" class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 animate-[fadeIn_0.2s_ease-out]">
                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <span class="text-[10px] text-stone-400 font-medium">จิตพิสัย (เข้าเรียน+รับผิดชอบ)</span>
                      <span class="text-sm font-black text-amber-400 mt-0.5">
                        {{ currentScoreData.affectiveTotal }} <span class="text-[10px] text-stone-500">/ 20</span>
                      </span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <span class="text-[10px] text-stone-400 font-medium">ใบงานและการฝึกปฏิบัติ</span>
                      <span class="text-sm font-black text-emerald-400 mt-0.5">
                        {{ currentScoreData.assignmentsScore }} <span class="text-[10px] text-stone-500">/ 40</span>
                      </span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <span class="text-[10px] text-stone-400 font-medium">สอบวัดผลกลางภาค</span>
                      <span class="text-sm font-black text-blue-400 mt-0.5">
                        {{ currentScoreData.midtermScore }} <span class="text-[10px] text-stone-500">/ 20</span>
                      </span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <span class="text-[10px] text-stone-400 font-medium">สอบประมวลผลปลายภาค</span>
                      <span class="text-sm font-black text-purple-400 mt-0.5">
                        {{ currentScoreData.finalScore }} <span class="text-[10px] text-stone-500">/ 20</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 2: อันดับและภาพรวมทั้งวิชา (LEADERBOARD & DISTRIBUTION CHART) -->
      <!-- ======================================================== -->
      <div v-else-if="viewMode === 'course_overview'" class="space-y-6 animate-[fadeIn_0.4s_ease-out]">
        
        <!-- Summary Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Trophy class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[11px] text-stone-400 font-medium">ระดับแรงค์สูงสุดในวิชา</p>
              <p class="text-sm font-black text-white flex items-center gap-1.5">
                <span :class="highestTierAchieved.textColor">{{ highestTierAchieved.name }}</span>
                <span class="text-[10px] text-stone-400">({{ highestTierAchieved.grade }})</span>
              </p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <Zap class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[11px] text-stone-400 font-medium">แรงค์ประชากรส่วนใหญ่</p>
              <p class="text-sm font-black text-white flex items-center gap-1.5">
                <span :class="dominantTier.textColor">{{ dominantTier.name }}</span>
                <span class="text-[10px] text-stone-400">({{ dominantTier.count }} คน)</span>
              </p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[11px] text-stone-400 font-medium">จำนวนผู้เรียนในกลุ่มนี้</p>
              <p class="text-sm font-black text-white">
                {{ overviewStudents.length }} คน
              </p>
            </div>
          </div>

        </div>

        <!-- Section A: Tier Distribution Bar Chart -->
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <BarChart3 class="w-4 h-4 text-emerald-400" />
              <h4 class="text-sm font-black text-white">แผนภูมิสัดส่วนระดับแรงค์ (Rank Distribution Chart)</h4>
            </div>
            <span class="text-[11px] text-stone-400">คลิกที่แถบเพื่อกรองรายชื่อนักศึกษา</span>
          </div>

          <div class="space-y-2 pt-1">
            <div 
              v-for="tier in tierDistribution" 
              :key="tier.name"
              @click="selectedTierFilter = selectedTierFilter === tier.name ? null : tier.name"
              :class="[
                'p-2 rounded-xl transition-all cursor-pointer flex items-center gap-3 group',
                selectedTierFilter === tier.name 
                  ? 'bg-white/15 ring-1 ring-emerald-400 shadow-md' 
                  : 'hover:bg-white/5'
              ]"
            >
              <!-- Mini Emblem -->
              <div class="w-7 h-7 shrink-0 flex items-center justify-center">
                <img 
                  v-if="tier.badgeImg" 
                  :src="tier.badgeImg" 
                  :alt="tier.name"
                  class="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform" 
                />
                <div v-else class="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 text-[10px]">
                  <Lock class="w-3 h-3" />
                </div>
              </div>

              <!-- Tier Label & Grade -->
              <div class="w-28 sm:w-36 shrink-0 flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold uppercase tracking-wide truncate" :class="tier.textColor">
                    {{ tier.name }}
                  </span>
                </div>
                <span class="text-[10px] text-stone-400">เกรด {{ tier.grade }}</span>
              </div>

              <!-- Bar Container -->
              <div class="flex-1 h-3.5 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                <div 
                  class="h-full rounded-full transition-all duration-700 bg-gradient-to-r"
                  :class="tier.themeGradient || 'from-stone-600 to-stone-500'"
                  :style="{ width: `${Math.max(tier.percentage, tier.count > 0 ? 8 : 0)}%` }"
                ></div>
              </div>

              <!-- Count & Percentage -->
              <div class="w-18 sm:w-24 text-right shrink-0">
                <span class="text-xs font-bold text-white">{{ tier.count }} คน</span>
                <span class="text-[10px] text-stone-400 ml-1">({{ tier.percentage }}%)</span>
              </div>
            </div>
          </div>

          <div v-if="selectedTierFilter" class="pt-2 flex items-center justify-between text-xs text-emerald-400 border-t border-white/10">
            <span>กำลังแสดงเฉพาะระดับ: <strong>{{ selectedTierFilter }}</strong></span>
            <button 
              @click="selectedTierFilter = null"
              class="underline hover:text-white cursor-pointer"
            >
              แสดงทั้งหมด
            </button>
          </div>
        </div>

        <!-- Section B: Course Leaderboard (No numeric scores shown) -->
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <Medal class="w-4 h-4 text-amber-400" />
              <h4 class="text-sm font-black text-white">
                ทำเนียบอันดับประจำรายวิชา (Class Leaderboard)
              </h4>
              <span class="text-xs text-stone-400">({{ filteredLeaderboard.length }} คน)</span>
            </div>

            <span class="text-[11px] text-stone-400">
              จัดอันดับตามระดับขั้นแรงค์ (ไม่มีการเปิดเผยคะแนนดิบ)
            </span>
          </div>

          <!-- Top 3 Podium (If at least 3 students) -->
          <div v-if="filteredLeaderboard.length >= 3 && !selectedTierFilter" class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 pb-3">
            
            <!-- Rank #2 (Silver) -->
            <div 
              v-if="filteredLeaderboard[1]"
              @click="inspectStudentRank(filteredLeaderboard[1].student.studentId)"
              class="order-2 md:order-1 p-4 rounded-2xl bg-gradient-to-b from-stone-800/80 via-stone-900 to-black border border-stone-400/30 flex flex-col items-center text-center relative group cursor-pointer hover:border-stone-300 transition-all hover:-translate-y-1 shadow-md"
            >
              <div class="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-stone-300/20 text-stone-200 border border-stone-300/30 text-[10px] font-black uppercase flex items-center gap-1">
                <span>🥈 อันดับ 2</span>
              </div>
              
              <div class="w-16 h-16 my-2 flex items-center justify-center relative">
                <img 
                  v-if="filteredLeaderboard[1].tier.badgeImg"
                  :src="filteredLeaderboard[1].tier.badgeImg" 
                  class="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" 
                />
                <Lock v-else class="w-8 h-8 text-stone-500" />
              </div>

              <h5 class="text-sm font-bold text-white truncate max-w-[180px]">{{ filteredLeaderboard[1].student.name }}</h5>
              <p class="text-[11px] text-stone-400 font-mono">{{ filteredLeaderboard[1].student.studentId }}</p>
              
              <span 
                class="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border"
                :class="[filteredLeaderboard[1].tier.bgColor, filteredLeaderboard[1].tier.borderColor, filteredLeaderboard[1].tier.textColor]"
              >
                {{ filteredLeaderboard[1].tier.name }} (เกรด {{ filteredLeaderboard[1].tier.grade }})
              </span>
            </div>

            <!-- Rank #1 (Gold Champion) -->
            <div 
              v-if="filteredLeaderboard[0]"
              @click="inspectStudentRank(filteredLeaderboard[0].student.studentId)"
              class="order-1 md:order-2 p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-stone-900 to-black border-2 border-amber-400/50 flex flex-col items-center text-center relative group cursor-pointer hover:border-amber-400 transition-all hover:-translate-y-1.5 shadow-xl ring-2 ring-amber-400/20"
            >
              <div class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase flex items-center gap-1">
                <Crown class="w-3 h-3 text-amber-400" />
                <span>🥇 แชมป์อันดับ 1</span>
              </div>

              <div class="w-20 h-20 my-2 flex items-center justify-center relative">
                <img 
                  v-if="filteredLeaderboard[0].tier.badgeImg"
                  :src="filteredLeaderboard[0].tier.badgeImg" 
                  :class="[
                    'w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform',
                    filteredLeaderboard[0].tier.animClass
                  ]" 
                />
                <Lock v-else class="w-10 h-10 text-stone-500" />
              </div>

              <h5 class="text-base font-black text-white truncate max-w-[200px]">{{ filteredLeaderboard[0].student.name }}</h5>
              <p class="text-xs text-stone-400 font-mono">{{ filteredLeaderboard[0].student.studentId }}</p>
              
              <span 
                class="mt-2.5 px-3 py-1 rounded-full text-xs font-black uppercase border shadow-sm"
                :class="[filteredLeaderboard[0].tier.bgColor, filteredLeaderboard[0].tier.borderColor, filteredLeaderboard[0].tier.textColor]"
              >
                {{ filteredLeaderboard[0].tier.name }} (เกรด {{ filteredLeaderboard[0].tier.grade }})
              </span>
            </div>

            <!-- Rank #3 (Bronze) -->
            <div 
              v-if="filteredLeaderboard[2]"
              @click="inspectStudentRank(filteredLeaderboard[2].student.studentId)"
              class="order-3 md:order-3 p-4 rounded-2xl bg-gradient-to-b from-stone-800/80 via-stone-900 to-black border border-amber-700/30 flex flex-col items-center text-center relative group cursor-pointer hover:border-amber-600 transition-all hover:-translate-y-1 shadow-md"
            >
              <div class="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/30 text-[10px] font-black uppercase flex items-center gap-1">
                <span>🥉 อันดับ 3</span>
              </div>

              <div class="w-16 h-16 my-2 flex items-center justify-center relative">
                <img 
                  v-if="filteredLeaderboard[2].tier.badgeImg"
                  :src="filteredLeaderboard[2].tier.badgeImg" 
                  class="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" 
                />
                <Lock v-else class="w-8 h-8 text-stone-500" />
              </div>

              <h5 class="text-sm font-bold text-white truncate max-w-[180px]">{{ filteredLeaderboard[2].student.name }}</h5>
              <p class="text-[11px] text-stone-400 font-mono">{{ filteredLeaderboard[2].student.studentId }}</p>
              
              <span 
                class="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border"
                :class="[filteredLeaderboard[2].tier.bgColor, filteredLeaderboard[2].tier.borderColor, filteredLeaderboard[2].tier.textColor]"
              >
                {{ filteredLeaderboard[2].tier.name }} (เกรด {{ filteredLeaderboard[2].tier.grade }})
              </span>
            </div>

          </div>

          <!-- Leaderboard List Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white/5 text-stone-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th class="py-2.5 px-3 rounded-l-xl">อันดับ</th>
                  <th class="py-2.5 px-3">นักศึกษา</th>
                  <th class="py-2.5 px-3">ห้อง</th>
                  <th class="py-2.5 px-3">ระดับแรงค์</th>
                  <th class="py-2.5 px-3">ระดับเกรด</th>
                  <th class="py-2.5 px-3 text-right rounded-r-xl">การกระทำ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr 
                  v-for="item in filteredLeaderboard" 
                  :key="item.student.studentId"
                  @click="inspectStudentRank(item.student.studentId)"
                  class="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <!-- Rank Position -->
                  <td class="py-3 px-3">
                    <span 
                      :class="[
                        'w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-xs',
                        item.rankPosition === 1 ? 'bg-amber-400 text-stone-950 shadow-sm' :
                        item.rankPosition === 2 ? 'bg-stone-300 text-stone-950' :
                        item.rankPosition === 3 ? 'bg-amber-700 text-white' :
                        'bg-white/10 text-stone-400'
                      ]"
                    >
                      {{ item.rankPosition }}
                    </span>
                  </td>

                  <!-- Student Info -->
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
                        <img v-if="item.student.avatar && (item.student.avatar.includes('/') || item.student.avatar.includes('http') || item.student.avatar.includes('localhost') || item.student.avatar.startsWith('data:'))" :src="item.student.avatar.startsWith('http') ? item.student.avatar : (item.student.avatar.startsWith('data:') ? item.student.avatar : `http://${item.student.avatar}`)" class="w-full h-full object-cover" />
                        <span v-else>{{ item.student.avatar || item.student.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <div class="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {{ item.student.name }}
                        </div>
                        <div class="text-[10px] text-stone-400 font-mono">{{ item.student.studentId }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Classroom -->
                  <td class="py-3 px-3 text-stone-300">
                    <span class="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold">
                      {{ item.student.classroom }}
                    </span>
                  </td>

                  <!-- Rank Tier Emblem & Name -->
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 shrink-0 flex items-center justify-center">
                        <img 
                          v-if="item.tier.badgeImg"
                          :src="item.tier.badgeImg" 
                          :class="['w-full h-full object-contain', item.tier.animClass]" 
                        />
                        <Lock v-else class="w-3.5 h-3.5 text-stone-500" />
                      </div>
                      <span class="font-bold tracking-wide" :class="item.tier.textColor">
                        {{ item.tier.name }}
                      </span>
                    </div>
                  </td>

                  <!-- Grade Level -->
                  <td class="py-3 px-3">
                    <span 
                      v-if="item.tier.grade !== '0'"
                      class="px-2 py-0.5 rounded-md text-[10px] font-black border uppercase"
                      :class="[item.tier.bgColor, item.tier.borderColor, item.tier.textColor]"
                    >
                      {{ item.tier.grade }} ({{ item.tier.letter }})
                    </span>
                    <span v-else class="text-[10px] text-stone-500 italic">
                      ยังไม่มีเกรด
                    </span>
                  </td>

                  <!-- Action -->
                  <td class="py-3 px-3 text-right">
                    <button 
                      class="text-emerald-400 group-hover:text-emerald-300 font-bold text-[11px] underline flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>ดูการ์ดแรงค์</span>
                      <ChevronRight class="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- Bottom Action: Open All Rank Tiers Roadmap Modal -->
      <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <span class="flex items-center gap-1.5 text-center sm:text-left">
          <Info class="w-4 h-4 text-emerald-400 shrink-0" />
          ระบบคำนวณแรงค์จากผลคะแนนรวม (จิตพิสัย 20 + ใบงาน 40 + สอบ 40) โดยไม่เปิดเผยคะแนนตรงๆ
        </span>
        <button 
          @click="showRoadmapModal = true"
          class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>ตารางขั้นแรงค์ทั้งหมด (7 ระดับ)</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- RANK ROADMAP MODAL: แสดงทั้ง 7 แรงค์ เรียงจากมากไปน้อย -->
    <!-- ======================================================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="showRoadmapModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
        >
          <div class="absolute inset-0" @click="showRoadmapModal = false"></div>

          <div class="relative z-10 w-full max-w-3xl max-h-[92vh] bg-gradient-to-b from-stone-900 via-stone-950 to-black text-white rounded-3xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden animate-[bounceIn_0.3s_ease-out]">
            
            <!-- Modal Header -->
            <div class="px-6 py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-b border-white/10 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Trophy class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-black text-lg text-white leading-tight">ทำเนียบระดับขั้นแรงค์ (Rank Roadmap)</h3>
                  <p class="text-xs text-stone-400">จัดอันดับตามเกณฑ์ระดับเกรด (เรียงจากมากไปน้อย 4.0 ถึง 0)</p>
                </div>
              </div>
              <button 
                @click="showRoadmapModal = false"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Modal Body: 7 Tiers List (เรียงจากมากไปน้อย) -->
            <div class="p-6 overflow-y-auto space-y-4 no-scrollbar">
              
              <!-- Loop all 7 tiers -->
              <div 
                v-for="tier in rankTiers" 
                :key="tier.name"
                :class="[
                  'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden',
                  studentRank.name === tier.name 
                    ? 'bg-white/10 border-white/40 ring-2 ring-emerald-500/40 shadow-xl' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                ]"
              >
                <!-- Current Rank Pill Indicator -->
                <div 
                  v-if="studentRank.name === tier.name"
                  class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1"
                >
                  <Sparkles class="w-3 h-3" />
                  แรงค์ปัจจุบันของคุณ
                </div>

                <!-- Tier Emblem Image with its distinct animation -->
                <div class="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center p-1">
                  <img 
                    :src="tier.badgeImg" 
                    :alt="tier.name" 
                    :class="['w-full h-full object-contain filter drop-shadow-md', tier.animClass]"
                  />
                </div>

                <!-- Tier Info -->
                <div class="flex-1 text-center sm:text-left space-y-1">
                  <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span class="text-xs font-mono font-bold text-stone-400">#{{ tier.rankNumber }}</span>
                    <h4 
                      class="text-xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r"
                      :class="tier.themeGradient"
                    >
                      {{ tier.name }}
                    </h4>
                    <span 
                      class="px-2.5 py-0.5 rounded-lg text-xs font-black border"
                      :class="[tier.bgColor, tier.borderColor, tier.textColor]"
                    >
                      เกรด {{ tier.grade }} ({{ tier.letter }})
                    </span>
                  </div>

                  <p class="text-xs font-bold text-stone-200">
                    {{ tier.thaiTitle }}
                  </p>
                  <p class="text-xs text-stone-400 leading-relaxed">
                    {{ tier.description }}
                  </p>
                </div>
              </div>

              <!-- Unranked (เกรด 0 / F) -->
              <div 
                :class="[
                  'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center gap-4 relative',
                  studentRank.name === unrankedTier.name 
                    ? 'bg-white/10 border-white/40 ring-2 ring-red-500/40 shadow-xl' 
                    : 'bg-white/5 border-white/10 opacity-75'
                ]"
              >
                <div 
                  v-if="studentRank.name === unrankedTier.name"
                  class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm"
                >
                  แรงค์ปัจจุบันของคุณ
                </div>

                <div class="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-stone-800 border-2 border-dashed border-stone-600 flex items-center justify-center text-stone-500 font-bold text-xs text-center p-1 anim-unranked">
                    <Lock class="w-6 h-6" />
                  </div>
                </div>

                <div class="flex-1 text-center sm:text-left space-y-1">
                  <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span class="text-xs font-mono font-bold text-stone-400">#8</span>
                    <h4 class="text-xl font-black uppercase tracking-wider text-stone-400">
                      {{ unrankedTier.name }}
                    </h4>
                    <span class="px-2.5 py-0.5 rounded-lg text-xs font-black border bg-stone-500/10 border-stone-500/40 text-stone-400">
                      เกรด {{ unrankedTier.grade }} ({{ unrankedTier.letter }})
                    </span>
                  </div>
                  <p class="text-xs font-bold text-stone-300">
                    {{ unrankedTier.thaiTitle }}
                  </p>
                  <p class="text-xs text-stone-400 leading-relaxed">
                    {{ unrankedTier.description }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-stone-900 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 shrink-0">
              <span>เกณฑ์มาตรฐาน 7 ลำดับขั้น อิงตามผลคะแนนรวมรายวิชา</span>
              <button 
                @click="showRoadmapModal = false"
                class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
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

/* ======================================================== */
/* BESPOKE TIER ANIMATIONS (อนิเมชั่นเท่ๆ ตามระดับแรงค์) */
/* ======================================================== */

/* 1. Omniverse (Grade 4.0): Celestial God Tier Float + Radiant Shimmer + Orbit */
.anim-omniverse {
  animation: omniverseCosmic 5s ease-in-out infinite;
}
@keyframes omniverseCosmic {
  0%, 100% {
    transform: translateY(0px) scale(1) rotate(0deg);
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 35px rgba(244, 63, 94, 0.4));
  }
  30% {
    transform: translateY(-8px) scale(1.05) rotate(1.5deg);
    filter: drop-shadow(0 0 35px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 55px rgba(244, 63, 94, 0.7));
  }
  70% {
    transform: translateY(-4px) scale(1.03) rotate(-1.5deg);
    filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.9)) drop-shadow(0 0 45px rgba(239, 68, 68, 0.6));
  }
}

.celestial-orbit-ring {
  animation: celestialSpin 14s linear infinite;
}
.celestial-orbit-ring-reverse {
  animation: celestialSpinReverse 20s linear infinite;
}
@keyframes celestialSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes celestialSpinReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* 2. Pulsar (Grade 3.5): Energy Shockwave Expansion Pulse */
.anim-pulsar {
  animation: pulsarShockwave 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes pulsarShockwave {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
  }
  35% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.95)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.7));
  }
  50% {
    transform: scale(1.02);
    filter: drop-shadow(0 0 25px rgba(192, 132, 252, 0.7));
  }
}

/* 3. Hyperion (Grade 3.0): Titan Levitation + Magnetic Horizontal Jitter */
.anim-hyperion {
  animation: hyperionElectric 4s ease-in-out infinite;
}
@keyframes hyperionElectric {
  0%, 100% {
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 0 18px rgba(59, 130, 246, 0.6));
  }
  25% {
    transform: translateY(-5px) scale(1.03) skewX(0.5deg);
    filter: drop-shadow(0 0 30px rgba(6, 182, 212, 0.85)) drop-shadow(0 0 45px rgba(59, 130, 246, 0.5));
  }
  75% {
    transform: translateY(-2px) scale(1.02) skewX(-0.5deg);
    filter: drop-shadow(0 0 25px rgba(37, 99, 235, 0.8));
  }
}

/* 4. Photon (Grade 2.5): Speed-of-Light Strobe & Emerald Beam Vibration */
.anim-photon {
  animation: photonBeam 2.5s ease-in-out infinite;
}
@keyframes photonBeam {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 15px rgba(20, 184, 166, 0.5));
  }
  40% {
    transform: scale(1.05) translateY(-3px);
    filter: drop-shadow(0 0 35px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 50px rgba(20, 184, 166, 0.7));
  }
  60% {
    transform: scale(1.02);
    filter: drop-shadow(0 0 20px rgba(45, 212, 191, 0.6));
  }
}

/* 5. Spark (Grade 2.0): Electric Spark Crackle & Zigzag Micro-jumps */
.anim-spark {
  animation: sparkCrackle 2.2s ease-in-out infinite;
}
@keyframes sparkCrackle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.5));
  }
  20% {
    transform: scale(1.04) rotate(-2.5deg);
    filter: drop-shadow(0 0 28px rgba(251, 191, 36, 0.9));
  }
  45% {
    transform: scale(1.01) rotate(1.5deg);
    filter: drop-shadow(0 0 18px rgba(245, 158, 11, 0.6));
  }
  70% {
    transform: scale(1.03) rotate(-1deg);
    filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.8));
  }
}

/* 6. Cinder (Grade 1.5): Smoldering Magma Heat Distortion */
.anim-cinder {
  animation: cinderSmolder 3.8s ease-in-out infinite;
}
@keyframes cinderSmolder {
  0%, 100% {
    transform: scale(1) translateY(0);
    filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.4));
  }
  50% {
    transform: scale(1.03) translateY(-3px);
    filter: drop-shadow(0 0 28px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 40px rgba(249, 115, 22, 0.5));
  }
}

/* 7. Ember (Grade 1.0): Heartbeat Ember Pulse */
.anim-ember {
  animation: emberHeartbeat 2.8s ease-in-out infinite;
}
@keyframes emberHeartbeat {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.35));
  }
  50% {
    transform: scale(1.03);
    filter: drop-shadow(0 0 20px rgba(244, 63, 94, 0.75));
  }
}

/* 8. Unranked (Grade 0): Metallic Lock Pulse */
.anim-unranked {
  animation: unrankedLock 4s ease-in-out infinite;
}
@keyframes unrankedLock {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
}

/* EXP Progress Bar Shimmer */
.anim-exp-shimmer {
  animation: expShimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes expShimmer {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(250%);
  }
}

/* Hide scrollbars */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
