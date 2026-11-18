<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import {
  Gamepad2, Coins, Check, History, Trophy, X, Star, Medal, Play,
  CircleDot, Building, Plane, RefreshCw, Calendar, ArrowLeft,
  Flame, Sparkles, ChevronRight, Award, Zap
} from '@lucide/vue'
import {
  ARCADE_GAMES,
  RANK_REWARDS,
  getArcadeLeaderboard,
  getMyBestScores,
  getCurrentWeekKey,
  arcadeResetHistory,
  triggerWeeklyResetAndDistributeCoins,
  syncArcadeDataFromServer
} from '@/data/arcadeGamesStore'
import { authUser } from '@/data/authStore'
import { isTeacherUser } from '@/data/studentsStore'
import StudentAvatar from '@/components/StudentAvatar.vue'
import { ARCADE_ACCENTS } from '@/components/arcade/arcadeTheme'

// โหลดเกมแบบ lazy เฉพาะเกมที่เลือก (ลดภาระเครื่อง)
const BasketballGame = defineAsyncComponent(() => import('@/components/arcade/BasketballGame.vue'))
const TowerStackGame = defineAsyncComponent(() => import('@/components/arcade/TowerStackGame.vue'))
const FlappyBirdGame = defineAsyncComponent(() => import('@/components/arcade/FlappyBirdGame.vue'))

const GAME_ICONS = { basketball: CircleDot, tower: Building, flappy: Plane }
const RANK_STYLES = [
  'bg-amber-400 text-slate-950',
  'bg-slate-300 text-slate-900',
  'bg-orange-700 text-white'
]

const currentScreen = ref(sessionStorage.getItem('arcade_screen') || 'lobby') // 'lobby' (หน้าเลือกเกม) | 'play' (หน้าเล่นเกม)
const activeGameId = ref(sessionStorage.getItem('arcade_active_game') || 'basketball')
const leaderboardType = ref('weekly') // 'weekly' | 'allTime'
const showResetModal = ref(false)
const showHistoryModal = ref(false)
const isResetting = ref(false)
const resetSuccessMessage = ref('')

const isTeacher = computed(() => isTeacherUser(authUser.value))
const currentWeekKey = computed(() => getCurrentWeekKey())

const activeGame = computed(() => ARCADE_GAMES.find(g => g.id === activeGameId.value) || ARCADE_GAMES[0])
const activeAccent = computed(() => ARCADE_ACCENTS[activeGame.value.badgeColor] || ARCADE_ACCENTS.emerald)
const currentLeaderboard = computed(() => getArcadeLeaderboard(activeGameId.value, leaderboardType.value))
const hiScore = computed(() => getArcadeLeaderboard(activeGameId.value, 'weekly')[0] || null)
const myStats = computed(() => getMyBestScores(activeGameId.value))
const myRank = computed(() => (leaderboardType.value === 'weekly' ? myStats.value.myWeeklyRank : myStats.value.myAllTimeRank))
const myScore = computed(() => (leaderboardType.value === 'weekly' ? myStats.value.weekly : myStats.value.allTime) || 0)
const meProfile = computed(() => {
  const entry = currentLeaderboard.value.find(e => e.isCurrentUser)
  if (entry) return entry
  return {
    avatar: authUser.value?.avatar,
    studentName: authUser.value?.name || 'คุณ',
    classroom: authUser.value?.classroom || ''
  }
})

const GAME_METADATA = {
  basketball: {
    tag: 'ชู้ตต่อเนื่อง • ไม่จำกัดเวลา',
    accentColor: 'amber',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'hover:shadow-[0_0_35px_-5px_rgba(251,191,36,0.4)]',
    cardGradient: 'from-amber-950/30 via-slate-900/90 to-purple-950/40',
    btnGradient: 'bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-amber-500/40',
    iconWrapper: 'bg-amber-500/15 border-amber-400/50 text-amber-300',
    textColor: 'text-amber-400'
  },
  tower: {
    tag: 'จับจังหวะ • คอมโบ PERFECT',
    accentColor: 'sky',
    borderColor: 'border-sky-500/40 hover:border-sky-400',
    glowColor: 'hover:shadow-[0_0_35px_-5px_rgba(56,189,248,0.4)]',
    cardGradient: 'from-sky-950/30 via-slate-900/90 to-purple-950/40',
    btnGradient: 'bg-linear-to-r from-sky-400 via-cyan-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 shadow-cyan-500/40',
    iconWrapper: 'bg-sky-500/15 border-sky-400/50 text-sky-300',
    textColor: 'text-sky-400'
  },
  flappy: {
    tag: 'นับถอยหลัง 3-2-1 • บินหลบท่อ',
    accentColor: 'emerald',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'hover:shadow-[0_0_35px_-5px_rgba(52,211,153,0.4)]',
    cardGradient: 'from-emerald-950/30 via-slate-900/90 to-purple-950/40',
    btnGradient: 'bg-linear-to-r from-emerald-400 via-teal-500 to-green-600 hover:from-emerald-300 hover:to-teal-400 shadow-emerald-500/40',
    iconWrapper: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300',
    textColor: 'text-emerald-400'
  }
}

const getGameChampion = (gameId) => {
  const list = getArcadeLeaderboard(gameId, 'weekly')
  return list && list.length > 0 && list[0].score > 0 ? list[0] : null
}

const enterGame = (gameId) => {
  activeGameId.value = gameId
  currentScreen.value = 'play'
  sessionStorage.setItem('arcade_screen', 'play')
  sessionStorage.setItem('arcade_active_game', gameId)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const backToLobby = () => {
  currentScreen.value = 'lobby'
  sessionStorage.setItem('arcade_screen', 'lobby')
  syncArcadeDataFromServer()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const switchGame = (gameId) => {
  activeGameId.value = gameId
  sessionStorage.setItem('arcade_active_game', gameId)
}

const handleScoreUpdated = () => {
  syncArcadeDataFromServer()
}

onMounted(() => {
  syncArcadeDataFromServer()
})

// ครู: รีเซ็ตสัปดาห์ + แจกเหรียญ
const winnersPreview = computed(() => {
  const result = []
  for (const game of ARCADE_GAMES) {
    const top3 = getArcadeLeaderboard(game.id, 'weekly').slice(0, 3)
    for (let i = 0; i < top3.length; i++) {
      if (top3[i].score > 0) {
        result.push({
          gameName: game.name,
          rank: i + 1,
          coins: RANK_REWARDS[i].coins,
          studentName: top3[i].studentName,
          classroom: top3[i].classroom,
          score: top3[i].score,
          unit: game.unit
        })
      }
    }
  }
  return result
})

const totalPendingCoins = computed(() => winnersPreview.value.reduce((acc, cur) => acc + cur.coins, 0))

const handleExecuteReset = async () => {
  isResetting.value = true
  try {
    const teacherName = authUser.value?.name || 'คุณครู'
    const log = await triggerWeeklyResetAndDistributeCoins(teacherName)
    showResetModal.value = false
    resetSuccessMessage.value = `รีเซ็ตคะแนนและแจกเหรียญเรียบร้อยแล้ว! (แจกไปทั้งหมด ${log.totalCoinsAwarded} Coins ให้ ${log.winners.length} อันดับ)`
    setTimeout(() => { resetSuccessMessage.value = '' }, 5000)
  } catch (err) {
    console.error('Reset error:', err)
  } finally {
    isResetting.value = false
  }
}
</script>

<template>
  <div class="arcade-page">
    <!-- พื้นหลังอาร์เคด: ตารางนีออน + ดาว + เส้นสแกน -->
    <div class="arcade-bg-stars"></div>
    <div class="arcade-bg-grid"></div>
    <div class="arcade-bg-scan"></div>

    <div class="relative w-full space-y-6">
      <!-- Toast แจ้งเตือนรีเซ็ตสัปดาห์ -->
      <div
        v-if="resetSuccessMessage"
        class="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 text-sm font-bold flex items-center gap-2 shadow-[0_0_24px_-6px_rgba(52,211,153,0.6)]"
      >
        <Check class="w-5 h-5 text-emerald-400 shrink-0" />
        <span>{{ resetSuccessMessage }}</span>
      </div>

      <!-- ========================================== -->
      <!-- หน้าที่ 1: หน้าเลือกเกม (Game Selection Lobby) -->
      <!-- ========================================== -->
      <div v-if="currentScreen === 'lobby'" class="space-y-6">
        <!-- ตู้เกม: ป้ายหัวตู้ (Arcade Marquee Header) -->
        <div class="arcade-cabinet">
          <!-- แถวบน: ชื่อเกม + การควบคุมของคุณครู & รอบสัปดาห์ -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-indigo-400/20">
            <!-- ฝั่งซ้าย: โลโก้และชื่อมินิเกม -->
            <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div class="arcade-icon-tile">
                <Gamepad2 class="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="arcade-label text-fuchsia-300">Arcade Zone</span>
                  <span class="text-white/25">•</span>
                  <span class="arcade-label text-cyan-300 flex items-center gap-1">
                    Weekly Tournament
                  </span>
                </div>
                <h1 class="arcade-title text-xl sm:text-2xl lg:text-3xl font-black leading-tight">มินิเกมคลายเครียด</h1>
                <p class="text-xs sm:text-sm text-indigo-200/80 mt-0.5">เล่นสนุกแก้เครียด ทำคะแนนติด Top 3 ของแต่ละเกมเพื่อรับเหรียญรางวัล Coins ทุกสัปดาห์</p>
              </div>
            </div>

            <!-- ฝั่งขวา: ป้ายรอบสัปดาห์ & ปุ่มควบคุมของคุณครู -->
            <div class="flex items-center flex-wrap gap-2.5 shrink-0 self-start lg:self-center">
              <div class="arcade-chip">
                <Calendar class="w-3.5 h-3.5 text-cyan-300" />
                <span class="arcade-label text-slate-300">รอบสัปดาห์</span>
                <strong class="font-mono text-cyan-300 font-bold text-xs">{{ currentWeekKey }}</strong>
              </div>

              <button v-if="isTeacher" @click="showResetModal = true" class="arcade-btn arcade-btn--gold shadow-lg shadow-amber-500/20">
                <Coins class="w-4 h-4 text-amber-950" />
                <span>แจกเหรียญ &amp; รีเซ็ตสัปดาห์</span>
              </button>
              <button @click="showHistoryModal = true" class="arcade-btn arcade-btn--ghost">
                <History class="w-3.5 h-3.5 text-slate-300" />
                <span>ประวัติการแจก</span>
              </button>
            </div>
          </div>

          <!-- แถวล่าง: รางวัล 3 อันดับ (Showcase) -->
          <div class="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="min-w-0 space-y-1.5 flex-1">
              <div class="flex items-center gap-1.5 text-amber-300/90 text-xs font-bold">
                <Trophy class="w-3.5 h-3.5 text-amber-400" />
                <span>รางวัลประจำสัปดาห์ (รับเหรียญเมื่อครูรีเซ็ตอันดับ):</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <!-- อันดับ 1 -->
                <div class="arcade-reward-card arcade-reward-card--gold">
                  <div class="arcade-reward-badge-num bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 shadow-md shadow-amber-500/40">1</div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[11px] text-amber-200/90 font-bold leading-tight">อันดับที่ 1 รับ</div>
                    <div class="text-sm font-black text-amber-300 font-mono flex items-center gap-1">
                      <Coins class="w-3.5 h-3.5 text-amber-400" />
                      +50 <span class="text-[10px] font-sans font-normal text-amber-200/70">Coins</span>
                    </div>
                  </div>
                </div>

                <!-- อันดับ 2 -->
                <div class="arcade-reward-card arcade-reward-card--silver">
                  <div class="arcade-reward-badge-num bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 shadow-md shadow-slate-400/30">2</div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[11px] text-slate-200 font-bold leading-tight">อันดับที่ 2 รับ</div>
                    <div class="text-sm font-black text-slate-100 font-mono flex items-center gap-1">
                      <Coins class="w-3.5 h-3.5 text-slate-300" />
                      +30 <span class="text-[10px] font-sans font-normal text-slate-300/70">Coins</span>
                    </div>
                  </div>
                </div>

                <!-- อันดับ 3 -->
                <div class="arcade-reward-card arcade-reward-card--bronze">
                  <div class="arcade-reward-badge-num bg-gradient-to-b from-orange-400 to-amber-700 text-white shadow-md shadow-orange-600/40">3</div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[11px] text-orange-200/90 font-bold leading-tight">อันดับที่ 3 รับ</div>
                    <div class="text-sm font-black text-orange-300 font-mono flex items-center gap-1">
                      <Coins class="w-3.5 h-3.5 text-orange-400" />
                      +15 <span class="text-[10px] font-sans font-normal text-orange-200/70">Coins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- กล่องสรุปสถานะการชิงเหรียญ -->
            <div class="arcade-chip shrink-0 self-start sm:self-center bg-fuchsia-950/40 border-fuchsia-400/30">
              <Zap class="w-3.5 h-3.5 text-fuchsia-300" />
              <span class="text-xs text-indigo-200">แข่งทั้งหมด <strong class="text-amber-300 font-mono">3 เกม</strong> • รีเซ็ตทุกสัปดาห์</span>
            </div>
          </div>
        </div>

        <!-- หัวข้อหน้าเลือกเกม (Arcade App Grid Header) -->
        <div class="flex items-center justify-between gap-3 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 shadow-md shadow-fuchsia-500/30 shrink-0">
              <Gamepad2 class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                คลังมินิเกม
                <span class="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40 uppercase tracking-widest hidden sm:inline">
                  GAME LAUNCHER
                </span>
              </h2>
              <p class="text-xs sm:text-sm text-indigo-200/80 mt-0.5">แตะที่ไอคอนเกมเพื่อเปิดเข้าเล่นและสะสมคะแนนบนตาราง Leaderboard</p>
            </div>
          </div>
        </div>

        <!-- แผงไอคอนเกมเรียงสไตล์ App Launcher / iOS Home Screen -->
        <div class="arcade-launcher-shelf relative overflow-hidden rounded-[36px] bg-[#070612] border-2 border-indigo-400/30 p-6 sm:p-10 shadow-2xl">
          <!-- Retro Rainbow Diagonal Band (ตามภาพเรฟ iOS) -->
          <div class="arcade-rainbow-stripe"></div>

          <!-- แสงฟุ้งนีออนมุมตู้ -->
          <div class="absolute -right-16 -top-16 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <!-- ตารางไอคอนเกม 3 เกม (เรียงกันแบบ App Icons ตามภาพเรฟ) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 justify-items-center relative z-10 max-w-4xl mx-auto">
            <div
              v-for="game in ARCADE_GAMES"
              :key="game.id"
              @click="enterGame(game.id)"
              class="arcade-app-launcher group cursor-pointer flex flex-col items-center text-center w-full max-w-[240px]"
            >
              <!-- ตัวไอคอน Squircle ทรงแอป iOS -->
              <div class="relative">
                <div
                  class="arcade-app-icon border-2 transition-all duration-300"
                  :class="[
                    GAME_METADATA[game.id].borderColor,
                    GAME_METADATA[game.id].glowColor
                  ]"
                >
                  <!-- รูปโลโก้เกมเต็มใบ -->
                  <img
                    v-if="game.logoUrl"
                    :src="game.logoUrl"
                    :alt="game.name"
                    class="w-full h-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-108"
                  />
                  <!-- Fallback Icon -->
                  <div v-else class="w-20 h-20 rounded-2xl flex items-center justify-center text-white">
                    <component :is="GAME_ICONS[game.id]" class="w-16 h-16" />
                  </div>

                  <!-- แสงเงาสะท้อนสไตล์กระจก iOS (Glass Sheen Overlay) -->
                  <div class="arcade-app-sheen"></div>
                </div>

                <!-- ป้ายแจ้งเตือนสไตล์ iOS Notification Badge (มุมขวาบน) -->
                <div
                  v-if="getMyBestScores(game.id).weekly > 0"
                  class="arcade-app-badge"
                  title="สถิติสัปดาห์นี้ของคุณ"
                >
                  <Star class="w-2.5 h-2.5 fill-white text-white" />
                  <span>{{ getMyBestScores(game.id).weekly }}</span>
                </div>
                <div
                  v-else
                  class="arcade-app-badge arcade-app-badge--new"
                >
                  FREE
                </div>
              </div>

              <!-- ข้อความใต้ไอคอน (ชื่อเกมสไตล์ App Name) -->
              <div class="mt-3.5 space-y-1 w-full">
                <!-- ชื่ออังกฤษตัวใหญ่เด่น -->
                <div class="font-black text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide leading-tight">
                  {{ game.nameEn }}
                </div>
                <!-- ชื่อไทย -->
                <div class="text-xs font-bold text-indigo-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {{ game.name }}
                </div>
                <!-- คำอธิบายสั้น -->
                <p class="text-[11px] text-indigo-300/70 line-clamp-1 px-2">
                  {{ game.description }}
                </p>

                <!-- ป้ายแชมป์ & ปุ่มเปิดเล่น -->
                <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs px-1">
                  <div class="text-left min-w-0 flex-1">
                    <span class="text-[10px] text-indigo-300/70 block leading-tight">แชมป์สัปดาห์นี้</span>
                    <strong class="text-amber-300 text-[11px] truncate block font-bold font-mono">
                      {{ getGameChampion(game.id) ? `${getGameChampion(game.id).studentName} (${getGameChampion(game.id).score})` : 'ยังไม่มี' }}
                    </strong>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 font-black text-[10px] transition-all flex items-center gap-1 shrink-0 text-indigo-100 shadow-sm">
                    <Play class="w-2.5 h-2.5 fill-current" /> เล่นเลย
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- แถบล่าง: ทำเนียบแชมป์สัปดาห์นี้ (Weekly Champions Hall of Fame) -->
        <div class="p-5 rounded-3xl bg-linear-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/60 border border-indigo-400/30 space-y-3">
          <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
            <div class="flex items-center gap-2 text-sm font-black text-white">
              <Trophy class="w-4 h-4 text-amber-400" />
              <span>ผู้ครองสถิติอันดับ 1 ประจำสัปดาห์ (ทั้ง 3 เกม)</span>
            </div>
            <span class="text-xs font-mono text-cyan-300 font-bold">WEEK {{ currentWeekKey }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              v-for="g in ARCADE_GAMES"
              :key="g.id"
              class="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden p-0.5" :class="GAME_METADATA[g.id].iconWrapper">
                <img v-if="g.logoUrl" :src="g.logoUrl" :alt="g.name" class="w-full h-full object-contain" />
                <component v-else :is="GAME_ICONS[g.id]" class="w-5 h-5" />
              </div>
              <div class="min-w-0 flex-1 leading-tight">
                <div class="text-[10px] text-indigo-300/80 font-bold">{{ g.name }}</div>
                <div class="text-xs font-black text-white truncate mt-0.5">
                  {{ getGameChampion(g.id) ? getGameChampion(g.id).studentName : 'ยังไม่มีผู้ครองสถิติ' }}
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="font-mono font-black text-sm text-amber-300">
                  {{ getGameChampion(g.id) ? getGameChampion(g.id).score : 0 }}
                </div>
                <div class="text-[9px] text-amber-200/60 font-mono">{{ g.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- หน้าที่ 2: หน้าเล่นเกม (Game Play Stage & Leaderboard) -->
      <!-- ========================================== -->
      <div v-else class="space-y-5">
        <!-- แถบด้านบนของห้องเล่นเกม: ปุ่มย้อนกลับ + Quick Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-linear-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border-2 border-indigo-400/40 shadow-xl">
          <!-- ปุ่มกลับหน้าเลือกเกม & ชื่อเกมปัจจุบัน -->
          <div class="flex items-center gap-3 flex-wrap">
            <button
              @click="backToLobby"
              class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <ArrowLeft class="w-4 h-4 text-cyan-300" />
              <span>กลับไปหน้าเลือกเกม</span>
            </button>

            <div class="h-6 w-px bg-white/20 hidden sm:block"></div>

            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center border" :class="GAME_METADATA[activeGameId].iconWrapper">
                <component :is="GAME_ICONS[activeGameId]" class="w-4 h-4" />
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-black text-white leading-tight flex items-center gap-2">
                  {{ activeGame.name }}
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                    PLAYING
                  </span>
                </h2>
                <p class="text-[11px] text-indigo-200/70">{{ activeGame.description }}</p>
              </div>
            </div>
          </div>

          <!-- Quick Switcher ระหว่างเกม (เผื่ออยากสลับเกมเร็วโดยไม่ต้องกลับหน้าแรก) -->
          <div class="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 self-start sm:self-auto shrink-0">
            <span class="text-[10px] font-mono text-indigo-300/70 px-2 hidden lg:inline">สลับเกม:</span>
            <button
              v-for="g in ARCADE_GAMES"
              :key="g.id"
              @click="switchGame(g.id)"
              :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                activeGameId === g.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <component :is="GAME_ICONS[g.id]" class="w-3.5 h-3.5" />
              <span>{{ g.name }}</span>
            </button>
          </div>
        </div>

        <!-- เวทีเล่นเกม + Leaderboard -->
        <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
          <!-- เวทีเล่นเกม (ใหญ่เต็มพื้นที่ 16:10) -->
          <div class="min-w-0">
            <BasketballGame v-if="activeGameId === 'basketball'" @score-updated="handleScoreUpdated" />
            <TowerStackGame v-else-if="activeGameId === 'tower'" @score-updated="handleScoreUpdated" />
            <FlappyBirdGame v-else-if="activeGameId === 'flappy'" @score-updated="handleScoreUpdated" />
          </div>

          <!-- Leaderboard (สไตล์เกมมือถือ: กรอบม่วง-ทอง + ริบบิ้นหัวข้อ) -->
          <aside class="relative pt-6">
            <!-- ริบบิ้นหัวข้อ -->
            <div class="absolute top-0 inset-x-6 z-10">
              <div class="relative h-12 rounded-2xl bg-linear-to-b from-fuchsia-500 to-pink-600 border-2 border-amber-300 shadow-lg shadow-fuchsia-900/40 flex items-center justify-center gap-2">
                <Trophy class="w-5 h-5 text-amber-200" />
                <h3 class="font-black text-lg tracking-wide text-white uppercase drop-shadow">Leaderboard</h3>
              </div>
            </div>

            <!-- กรอบหลัก -->
            <div class="rounded-[28px] p-1.5 bg-linear-to-b from-amber-300 via-amber-500 to-amber-600 shadow-2xl shadow-black/40">
              <div class="rounded-[22px] bg-linear-to-b from-violet-700 via-indigo-800 to-indigo-950 px-3.5 pt-10 pb-3.5 space-y-3">
                <!-- ชื่อเกม + สลับช่วงเวลา -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0" :class="activeAccent.soft">
                      <component :is="GAME_ICONS[activeGame.id]" class="w-4 h-4" />
                    </div>
                    <span class="font-bold text-sm text-white truncate">{{ activeGame.name }}</span>
                  </div>

                  <div class="flex p-1 bg-black/25 border border-white/10 rounded-full text-[11px] font-black shrink-0">
                    <button
                      @click="leaderboardType = 'weekly'"
                      :class="['px-3 py-1 rounded-full transition-all cursor-pointer', leaderboardType === 'weekly' ? 'bg-amber-400 text-slate-900' : 'text-indigo-200 hover:text-white']"
                    >สัปดาห์นี้</button>
                    <button
                      @click="leaderboardType = 'allTime'"
                      :class="['px-3 py-1 rounded-full transition-all cursor-pointer', leaderboardType === 'allTime' ? 'bg-amber-400 text-slate-900' : 'text-indigo-200 hover:text-white']"
                    >ตลอดกาล</button>
                  </div>
                </div>

                <!-- รายชื่ออันดับ Top 10 -->
                <div v-if="currentLeaderboard.length > 0" class="space-y-2 max-h-[470px] overflow-y-auto pr-1 arcade-scroll">
                  <div
                    v-for="entry in currentLeaderboard"
                    :key="entry.studentId"
                    :class="[
                      'lb-card',
                      entry.rank === 1 ? 'lb-card--1' : '',
                      entry.rank === 2 ? 'lb-card--2' : '',
                      entry.rank === 3 ? 'lb-card--3' : '',
                      entry.isCurrentUser ? 'lb-card--me' : ''
                    ]"
                  >
                    <!-- 1. เหรียญรางวัลอันดับ 1-3 หรือป้ายหมายเลขอันดับ 4-10 -->
                    <div class="lb-rank-slot">
                      <div v-if="entry.rank === 1" class="lb-medal lb-medal--gold" title="อันดับที่ 1">
                        <span>1</span>
                      </div>
                      <div v-else-if="entry.rank === 2" class="lb-medal lb-medal--silver" title="อันดับที่ 2">
                        <span>2</span>
                      </div>
                      <div v-else-if="entry.rank === 3" class="lb-medal lb-medal--bronze" title="อันดับที่ 3">
                        <span>3</span>
                      </div>
                      <div v-else class="lb-rank-num">
                        {{ entry.rank }}
                      </div>
                    </div>

                    <!-- 2. Avatar ผู้เล่น -->
                    <StudentAvatar
                      :avatar="entry.avatar"
                      :name="entry.studentName"
                      size="sm"
                      avatarClass="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10 bg-indigo-100 text-indigo-900"
                    />

                    <!-- 3. ชื่อผู้เล่น + ห้องเรียน -->
                    <div class="min-w-0 flex-1 leading-snug">
                      <div class="text-sm font-black text-slate-800 truncate tracking-tight">
                        {{ entry.studentName }}
                      </div>
                      <div class="text-[11px] font-bold text-amber-950/60 truncate flex items-center gap-1">
                        <span>{{ entry.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (entry.classroom || 'นักศึกษา') }}</span>
                        <span v-if="entry.isCurrentUser" class="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-600 text-white uppercase font-bold">คุณ</span>
                      </div>
                    </div>

                    <!-- 4. ป้ายคะแนนทรงป้ายทอง (Score Plaque) สไตล์ตามภาพเรฟ -->
                    <div class="shrink-0 flex flex-col items-end gap-1">
                      <div class="lb-score-plaque">
                        <div class="lb-score-star">
                          <Star class="w-3.5 h-3.5 fill-white text-white drop-shadow-xs" />
                        </div>
                        <span class="lb-score-val">{{ entry.score.toLocaleString() }}</span>
                      </div>

                      <!-- เหรียญรางวัลประจำสัปดาห์ (สำหรับอันดับ 1-3) -->
                      <div
                        v-if="leaderboardType === 'weekly' && entry.rank <= 3"
                        class="lb-coin-reward"
                        :class="'lb-coin-reward--' + entry.rank"
                      >
                        <Coins class="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>+{{ RANK_REWARDS[entry.rank - 1].coins }} Coins</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-12 text-indigo-200 text-xs">
                  <Gamepad2 class="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p class="font-bold">ยังไม่มีผู้เล่นทำคะแนนในรอบนี้</p>
                  <p class="text-[11px] mt-0.5 text-indigo-300">เป็นคนแรกที่ขึ้นอันดับ 1 เลย!</p>
                </div>

                <!-- แถวของฉัน (ปักหมุดด้านล่าง สไตล์ป้ายฟ้าในภาพเรฟ) -->
                <div
                  v-if="!isTeacher"
                  class="lb-me-bar"
                >
                  <div class="lb-me-rank">
                    {{ myRank ? (myRank > 999 ? '1K+' : myRank) : '-' }}
                  </div>
                  <StudentAvatar
                    :avatar="meProfile.avatar"
                    :name="meProfile.studentName"
                    size="sm"
                    avatarClass="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10 bg-emerald-100 text-emerald-900"
                  />
                  <div class="min-w-0 flex-1 leading-snug">
                    <div class="text-[11px] text-sky-100 font-bold truncate">
                      {{ myRank ? `อันดับของคุณ (ที่ ${myRank})` : 'ยังไม่มีอันดับในรอบนี้' }}
                    </div>
                    <div class="text-sm font-black text-white truncate drop-shadow-xs">
                      {{ meProfile.studentName }}
                    </div>
                  </div>
                  <div class="shrink-0 flex items-center">
                    <div class="lb-score-plaque">
                      <div class="lb-score-star">
                        <Star class="w-3.5 h-3.5 fill-white text-white drop-shadow-xs" />
                      </div>
                      <span class="lb-score-val">{{ myScore.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

    <!-- Reset modal (ครู) -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none"
    >
      <div class="arcade-modal w-full max-w-lg text-white rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-300/30 text-amber-300 flex items-center justify-center">
              <Trophy class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-black text-lg leading-tight">ยืนยันรีเซ็ตสัปดาห์และแจกเหรียญ</h3>
              <p class="text-xs text-slate-400">แจกเหรียญให้อันดับ 1-3 ของแต่ละเกม แล้วเริ่มสัปดาห์ใหม่</p>
            </div>
          </div>
          <button @click="showResetModal = false" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-300/25 text-xs text-amber-100 space-y-1">
          <div class="font-bold flex items-center gap-1.5">
            <Coins class="w-4 h-4 text-amber-300" />
            <span>ยอดเหรียญรวมที่จะแจก: {{ totalPendingCoins }} Coins</span>
          </div>
          <p class="text-amber-200/70">บันทึกประวัติลงใน Statement ของนักศึกษาโดยอัตโนมัติ</p>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-300">ผู้มีสิทธิ์รับเหรียญ (Top 3 ของแต่ละเกม)</span>
          <div v-if="winnersPreview.length > 0" class="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs arcade-scroll">
            <div
              v-for="(w, idx) in winnersPreview"
              :key="idx"
              class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
            >
              <div class="min-w-0">
                <strong class="text-white">{{ w.studentName }}</strong>
                <span class="text-slate-500 ml-1">({{ w.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : w.classroom }})</span>
                <div class="text-[10px] text-slate-400">{{ w.gameName }} · อันดับ {{ w.rank }} · {{ w.score }} {{ w.unit }}</div>
              </div>
              <span class="font-black text-amber-300 font-mono shrink-0">+{{ w.coins }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-500 italic text-center py-4">ยังไม่มีคะแนนในสัปดาห์นี้</p>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <button
            @click="showResetModal = false"
            class="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 font-bold text-xs cursor-pointer"
          >ยกเลิก</button>
          <button
            @click="handleExecuteReset"
            :disabled="isResetting"
            class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <RefreshCw v-if="isResetting" class="w-3.5 h-3.5 animate-spin" />
            {{ isResetting ? 'กำลังประมวลผล...' : 'ยืนยันแจกเหรียญและรีเซ็ต' }}
          </button>
        </div>
      </div>
    </div>

    <!-- History modal -->
    <div
      v-if="showHistoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none"
    >
      <div class="arcade-modal w-full max-w-lg text-white rounded-3xl p-6 space-y-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <History class="w-5 h-5 text-emerald-300" />
            <h3 class="font-black text-lg">ประวัติการรีเซ็ตและแจกเหรียญ</h3>
          </div>
          <button @click="showHistoryModal = false" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1 text-xs arcade-scroll">
          <div v-if="arcadeResetHistory.length > 0" class="space-y-3">
            <div
              v-for="log in arcadeResetHistory"
              :key="log.id"
              class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2"
            >
              <div class="flex items-center justify-between font-bold">
                <span class="text-emerald-300 font-mono text-sm">{{ log.weekKey }}</span>
                <span class="text-slate-500 text-[11px]">{{ new Date(log.resetAt).toLocaleDateString('th-TH') }}</span>
              </div>
              <div class="text-slate-400 text-[11px]">
                ผู้ดำเนินการ: <strong class="text-slate-200">{{ log.distributedBy }}</strong> · รวม
                <strong class="text-amber-300">{{ log.totalCoinsAwarded }} Coins</strong>
              </div>
              <div class="space-y-1 pt-1">
                <div v-for="(w, wi) in log.winners" :key="wi" class="flex items-center justify-between text-[11px] text-slate-300">
                  <span>{{ w.gameName }} · {{ w.studentName }} (อันดับ {{ w.rank }})</span>
                  <span class="font-mono font-bold text-amber-300">+{{ w.coins }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-slate-500 italic">ยังไม่มีประวัติการรีเซ็ต</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* ====== ธีมอาร์เคด (เฉพาะส่วนนอกเวทีเกม/Leaderboard) ====== */
.arcade-page {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 1rem;
  background:
    radial-gradient(900px 420px at 8% -5%, rgba(217, 70, 239, 0.28), transparent 60%),
    radial-gradient(800px 420px at 95% 8%, rgba(34, 211, 238, 0.2), transparent 60%),
    linear-gradient(180deg, #0a0524 0%, #130837 55%, #1b0b40 100%);
  border: 2px solid rgba(217, 70, 239, 0.35);
  box-shadow: 0 0 0 4px rgba(10, 5, 36, 0.9), 0 0 40px -8px rgba(217, 70, 239, 0.5);
}
@media (min-width: 640px) {
  .arcade-page { padding: 1.5rem; }
}

.arcade-bg-stars,
.arcade-bg-grid,
.arcade-bg-scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.arcade-bg-stars {
  background-image:
    radial-gradient(1.5px 1.5px at 20px 30px, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 90px 120px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 160px 60px, rgba(103, 232, 249, 0.6), transparent),
    radial-gradient(1px 1px at 230px 170px, rgba(244, 114, 182, 0.6), transparent);
  background-size: 260px 200px;
  opacity: 0.55;
}
.arcade-bg-grid {
  top: auto;
  height: 55%;
  background-image:
    linear-gradient(rgba(217, 70, 239, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.22) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}
.arcade-bg-scan {
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px);
}

/* ป้ายหัวตู้ */
.arcade-cabinet {
  position: relative;
  border-radius: 24px;
  padding: 1.25rem 1.25rem;
  background: linear-gradient(180deg, rgba(30, 12, 70, 0.92), rgba(12, 6, 38, 0.92));
  border: 2px solid rgba(34, 211, 238, 0.55);
  box-shadow:
    inset 0 0 24px rgba(34, 211, 238, 0.12),
    0 0 26px -6px rgba(34, 211, 238, 0.55),
    0 0 0 4px rgba(10, 5, 36, 0.8);
}
@media (min-width: 640px) {
  .arcade-cabinet { padding: 1.5rem 2rem; }
}

.arcade-icon-tile {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0abfc;
  background: rgba(217, 70, 239, 0.15);
  border: 2px solid rgba(217, 70, 239, 0.7);
  box-shadow: 0 0 18px -2px rgba(217, 70, 239, 0.8), inset 0 0 12px rgba(217, 70, 239, 0.25);
}
@media (min-width: 640px) {
  .arcade-icon-tile { width: 4rem; height: 4rem; }
}

.arcade-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.arcade-title {
  color: #fff;
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.8), 0 0 22px rgba(217, 70, 239, 0.7);
}
.arcade-glow-amber {
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
}

.arcade-led {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.55rem 0.9rem;
  border-radius: 0.9rem;
  background: #05030f;
  border: 2px solid rgba(251, 191, 36, 0.55);
  box-shadow: inset 0 0 14px rgba(251, 191, 36, 0.12), 0 0 14px -4px rgba(251, 191, 36, 0.5);
}

.arcade-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(165, 180, 252, 0.35);
}

.arcade-reward-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.85rem;
  background: rgba(12, 6, 38, 0.75);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.arcade-reward-card:hover {
  transform: translateY(-1px);
}
.arcade-reward-card--gold {
  border: 1.5px solid rgba(251, 191, 36, 0.45);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(12, 6, 38, 0.85));
  box-shadow: 0 0 12px -3px rgba(251, 191, 36, 0.25);
}
.arcade-reward-card--gold:hover {
  border-color: rgba(251, 191, 36, 0.8);
  box-shadow: 0 0 18px -2px rgba(251, 191, 36, 0.45);
}
.arcade-reward-card--silver {
  border: 1.5px solid rgba(203, 213, 225, 0.4);
  background: linear-gradient(135deg, rgba(203, 213, 225, 0.1), rgba(12, 6, 38, 0.85));
  box-shadow: 0 0 12px -3px rgba(203, 213, 225, 0.2);
}
.arcade-reward-card--silver:hover {
  border-color: rgba(203, 213, 225, 0.75);
  box-shadow: 0 0 18px -2px rgba(203, 213, 225, 0.35);
}
.arcade-reward-card--bronze {
  border: 1.5px solid rgba(249, 115, 22, 0.4);
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(12, 6, 38, 0.85));
  box-shadow: 0 0 12px -3px rgba(249, 115, 22, 0.2);
}
.arcade-reward-card--bronze:hover {
  border-color: rgba(249, 115, 22, 0.75);
  box-shadow: 0 0 18px -2px rgba(249, 115, 22, 0.35);
}

.arcade-reward-badge-num {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
}

/* ====================================================
   iOS Home Screen App Launcher Style
   ==================================================== */
.arcade-launcher-shelf {
  position: relative;
  border-radius: 36px;
  background: radial-gradient(120% 120% at 50% 10%, #15112c 0%, #080714 60%, #03030a 100%);
  border: 2px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

/* Retro Rainbow Diagonal Band (อ้างอิงจาก Wallpaper ในรูปเรฟ) */
.arcade-rainbow-stripe {
  position: absolute;
  top: 48%;
  left: -20%;
  width: 140%;
  height: 64px;
  transform: translateY(-50%) rotate(-25deg);
  pointer-events: none;
  opacity: 0.72;
  background: linear-gradient(
    180deg,
    #4cd964 0%,
    #4cd964 16.66%,
    #ffcc00 16.66%,
    #ffcc00 33.33%,
    #ff9500 33.33%,
    #ff9500 50%,
    #ff3b30 50%,
    #ff3b30 66.66%,
    #af52de 66.66%,
    #af52de 83.33%,
    #007aff 83.33%,
    #007aff 100%
  );
  filter: blur(1px);
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.85) 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.85) 85%, transparent 100%);
}

.arcade-app-launcher {
  user-select: none;
  position: relative;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.arcade-app-launcher:hover {
  transform: translateY(-6px);
}

.arcade-app-icon {
  width: 136px;
  height: 136px;
  border-radius: 32px;
  background: radial-gradient(120% 120% at 30% 20%, rgba(255, 255, 255, 0.08) 0%, rgba(20, 15, 38, 0.95) 70%, rgba(8, 6, 18, 0.98) 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 
    0 16px 32px -6px rgba(0, 0, 0, 0.85),
    0 4px 10px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (max-width: 640px) {
  .arcade-app-icon {
    width: 108px;
    height: 108px;
    border-radius: 26px;
  }
}

.arcade-app-launcher:hover .arcade-app-icon {
  transform: scale(1.06);
}
.arcade-app-launcher:active .arcade-app-icon {
  transform: scale(0.94);
}

/* iOS Glass Sheen */
.arcade-app-sheen {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 50%);
  pointer-events: none;
}

/* iOS Notification Badge */
.arcade-app-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 9999px;
  background: linear-gradient(180deg, #ff453a 0%, #d70015 100%);
  border: 2px solid #07060f;
  color: #ffffff;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 900;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 4px 10px rgba(215, 0, 21, 0.65);
  z-index: 20;
}
.arcade-app-badge--new {
  background: linear-gradient(180deg, #34c759 0%, #248a3d 100%);
  box-shadow: 0 4px 10px rgba(52, 199, 89, 0.65);
  font-size: 10px;
  letter-spacing: 0.05em;
}

.arcade-led-panel {
  padding: 0.55rem 0.85rem;
  border-radius: 0.95rem;
  background: #05030f;
  border: 1.5px solid rgba(34, 211, 238, 0.45);
  box-shadow: inset 0 0 14px rgba(34, 211, 238, 0.12), 0 0 14px -4px rgba(34, 211, 238, 0.35);
}

.arcade-led-digits {
  display: inline-flex;
  align-items: baseline;
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.35);
  box-shadow: inset 0 0 8px rgba(251, 191, 36, 0.15);
}

.arcade-reward-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(12, 6, 38, 0.75);
  border: 1px solid rgba(165, 180, 252, 0.28);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: border-color 0.15s ease;
}
.arcade-reward-badge:hover {
  border-color: rgba(251, 191, 36, 0.6);
}

.arcade-led-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.85rem;
  border-radius: 0.85rem;
  background: #05030f;
  border: 1.5px solid rgba(34, 211, 238, 0.45);
  box-shadow: inset 0 0 10px rgba(34, 211, 238, 0.1), 0 0 12px -4px rgba(34, 211, 238, 0.4);
}

.arcade-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 0.8rem;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.arcade-btn:active { transform: translateY(2px) scale(0.98); }
.arcade-btn--gold {
  color: #1c1100;
  background: linear-gradient(180deg, #fde047, #f59e0b);
  border: 2px solid #fef08a;
  box-shadow: 0 4px 0 #b45309, 0 0 18px -2px rgba(251, 191, 36, 0.7);
}
.arcade-btn--gold:hover { box-shadow: 0 4px 0 #b45309, 0 0 26px 0 rgba(251, 191, 36, 0.9); }
.arcade-btn--ghost {
  color: #e0e7ff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(165, 180, 252, 0.4);
}
.arcade-btn--ghost:hover { background: rgba(255, 255, 255, 0.12); }

/* การ์ดเลือกเกม */
.arcade-card {
  --neon: #22d3ee;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem 1rem 3.1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 1.1rem;
  background: rgba(12, 6, 38, 0.78);
  border: 2px solid rgba(165, 180, 252, 0.22);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.arcade-card--amber { --neon: #fbbf24; }
.arcade-card--sky { --neon: #38bdf8; }
.arcade-card--emerald { --neon: #34d399; }
.arcade-card:hover { border-color: var(--neon); transform: translateY(-2px); }
.arcade-card.is-active {
  background: linear-gradient(180deg, rgba(40, 18, 90, 0.95), rgba(14, 7, 42, 0.95));
  border-color: var(--neon);
  box-shadow: 0 0 0 1px var(--neon), 0 0 24px -4px var(--neon), inset 0 0 18px -6px var(--neon);
}
.arcade-card-no {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-weight: 900;
  font-size: 1rem;
  color: var(--neon);
  opacity: 0.85;
}
.arcade-card-icon {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(165, 180, 252, 0.3);
}
.arcade-card-play {
  position: absolute;
  top: 0.55rem;
  right: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon);
}

/* กะพริบแบบ "INSERT COIN" (ใช้ opacity เท่านั้น เบาต่อเครื่อง) */
.arcade-blink { animation: arcade-blink 1.4s steps(2, jump-none) infinite; }
@keyframes arcade-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.25; }
}
@media (prefers-reduced-motion: reduce) {
  .arcade-blink { animation: none; }
}

/* Modal สไตล์อาร์เคด */
.arcade-modal {
  background: linear-gradient(180deg, #1b0b40, #0b0524);
  border: 2px solid rgba(217, 70, 239, 0.6);
  box-shadow: 0 0 36px -6px rgba(217, 70, 239, 0.7), 0 0 0 4px rgba(10, 5, 36, 0.85);
}

/* การ์ดเกมหน้าเลือกเกม (Hero Game Card) */
.arcade-hero-card {
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.75);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}
.arcade-hero-card:hover {
  transform: translateY(-6px);
}

/* ====== สไตล์การ์ด Leaderboard ตามภาพเรฟเกมมือถือ ====== */
.lb-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.8rem;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, #ffffff 0%, #fff8ec 55%, #fdeacc 100%);
  border: 2px solid #ebc685;
  box-shadow: 0 3px 0 #cf9b4a, 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.lb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 0 #cf9b4a, 0 8px 16px rgba(0, 0, 0, 0.28);
}
.lb-card--1 {
  background: linear-gradient(180deg, #fffdf2 0%, #fff6d9 55%, #fee6a7 100%);
  border-color: #f59e0b;
  box-shadow: 0 3px 0 #d97706, 0 0 16px -2px rgba(245, 158, 11, 0.45);
}
.lb-card--2 {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%);
  border-color: #cbd5e1;
  box-shadow: 0 3px 0 #94a3b8, 0 4px 10px rgba(0, 0, 0, 0.2);
}
.lb-card--3 {
  background: linear-gradient(180deg, #fffaf5 0%, #ffedd5 55%, #fed7aa 100%);
  border-color: #f97316;
  box-shadow: 0 3px 0 #c2410c, 0 4px 10px rgba(0, 0, 0, 0.2);
}
.lb-card--me {
  outline: 2.5px solid #0284c7;
  outline-offset: 1px;
}

.lb-rank-slot {
  width: 2.35rem;
  height: 2.35rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-medal {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1rem;
  line-height: 1;
}
.lb-medal--gold {
  background: linear-gradient(180deg, #fef08a 0%, #f59e0b 60%, #b45309 100%);
  border: 2px solid #fef9c3;
  color: #451a03;
  box-shadow: 0 2px 0 #78350f, 0 3px 8px rgba(245, 158, 11, 0.6);
}
.lb-medal--silver {
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 60%, #64748b 100%);
  border: 2px solid #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 0 #334155, 0 3px 8px rgba(100, 116, 139, 0.5);
}
.lb-medal--bronze {
  background: linear-gradient(180deg, #fed7aa 0%, #ea580c 60%, #7c2d12 100%);
  border: 2px solid #ffedd5;
  color: #ffffff;
  box-shadow: 0 2px 0 #431407, 0 3px 8px rgba(194, 65, 12, 0.5);
}

.lb-rank-num {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: #fae1ba;
  border: 2px solid #deb074;
  color: #8c4a16;
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* ป้ายคะแนนรูปดาวสีส้มทอง */
.lb-score-plaque {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.22rem 0.75rem 0.22rem 0.28rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, #f57c00 0%, #d84315 100%);
  border: 1.5px solid #ffb74d;
  box-shadow: 0 2px 0 #bf360c, inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 3px 6px rgba(0, 0, 0, 0.25);
}
.lb-score-star {
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, #fde047 0%, #f59e0b 100%);
  border: 1px solid #fef08a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
}
.lb-score-val {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-weight: 900;
  font-size: 0.9rem;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.02em;
}

.lb-coin-reward {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 900;
  font-family: ui-monospace, monospace;
  line-height: 1;
  background: #180928;
  border: 1px solid rgba(251, 191, 36, 0.55);
  color: #fde047;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.lb-coin-reward--1 { border-color: #fbbf24; color: #fef08a; }
.lb-coin-reward--2 { border-color: #cbd5e1; color: #f1f5f9; }
.lb-coin-reward--3 { border-color: #fb923c; color: #ffedd5; }

/* แถบปักหมุดผู้เล่นปัจจุบันด้านล่าง */
.lb-me-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.8rem;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%);
  border: 2px solid #7dd3fc;
  box-shadow: 0 3px 0 #075985, 0 8px 18px rgba(2, 132, 199, 0.4);
}
.lb-me-rank {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #bae6fd;
  color: #0284c7;
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.arcade-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
