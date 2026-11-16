import { ref, computed } from 'vue'
import { authUser } from './authStore'
import { studentsList } from './studentsStore'
import { addCoins } from './shopStore'
import { recordCoinTransaction } from './coinLedgerStore'
import { API_BASE_URL } from '@/config/api'

export const ARCADE_GAMES = [
  {
    id: 'basketball',
    name: 'ชู้ตบาสเกตบอล',
    nameEn: 'Slamshot',
    icon: 'basketball',
    badgeColor: 'amber',
    description: 'กะมุมและแรง ชู้ตลงห่วงต่อเนื่องเก็บแต้ม พลาดเมื่อไรจบเกม!',
    primaryColor: 'from-amber-500 to-orange-600',
    unit: 'แต้ม',
    logoUrl: '/gameAssets/SlamShot/SLAMSHOT_LOGO.png'
  },
  {
    id: 'tower',
    name: 'ต่อตึกระฟ้า',
    nameEn: 'Sky Stacker',
    icon: 'tower',
    badgeColor: 'sky',
    description: 'วางบล็อกอาคารให้ตรงจังหวะ ยิ่งต่อสูงยิ่งได้แต้ม วางพอดีเป๊ะรับคอมโบ!',
    primaryColor: 'from-sky-500 to-indigo-600',
    unit: 'ชั้น',
    logoUrl: '/gameAssets/Sky Stacker/SKYSTACKER_LOGO.png'
  },
  {
    id: 'flappy',
    name: 'ฟลัปปี้เบิร์ด',
    nameEn: 'Flappy Kruboss',
    icon: 'flappy',
    badgeColor: 'emerald',
    description: 'ควบคุมครูบอสบินลอดช่องท่อ ยิ่งบินไกลยิ่งได้คะแนน!',
    primaryColor: 'from-emerald-500 to-teal-600',
    unit: 'คะแนน',
    logoUrl: '/gameAssets/Flappy/FLAPPY_LOGO.png'
  }
]

export const RANK_REWARDS = [
  { rank: 1, label: 'อันดับ 1', coins: 50, icon: 'medal-gold', color: 'from-amber-400 to-yellow-500', text: 'text-amber-500' },
  { rank: 2, label: 'อันดับ 2', coins: 30, icon: 'medal-silver', color: 'from-slate-300 to-slate-400', text: 'text-slate-400' },
  { rank: 3, label: 'อันดับ 3', coins: 15, icon: 'medal-bronze', color: 'from-amber-700 to-yellow-800', text: 'text-amber-700' }
]

// Calculate ISO week format (e.g. 2026-W47)
export function getISOWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

const STORAGE_KEY_SCORES = 'kmutnb_arcade_scores_cache_v2'
const STORAGE_KEY_RESETS = 'kmutnb_arcade_resets_cache_v2'
const STORAGE_KEY_WEEK_OVERRIDE = 'kmutnb_arcade_week_override_v2'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {}
}

// Reactive States (แคชเริ่มต้นจาก LocalStorage ก่อนซิงค์กับเซิร์ฟเวอร์)
export const arcadeScores = ref(loadFromStorage(STORAGE_KEY_SCORES, []))
export const arcadeResetHistory = ref(loadFromStorage(STORAGE_KEY_RESETS, []))
export const currentArcadeWeek = ref(loadFromStorage(STORAGE_KEY_WEEK_OVERRIDE, getISOWeekKey()))
export const isSyncingArcade = ref(false)

export function getCurrentWeekKey() {
  return currentArcadeWeek.value || getISOWeekKey()
}

/**
 * ซิงค์ดึงคะแนนและประวัติรีเซ็ตทั้งหมดจากเซิร์ฟเวอร์กลาง (ทุกคนเห็นคะแนนเดียวกัน)
 */
export async function syncArcadeDataFromServer() {
  try {
    isSyncingArcade.value = true
    const res = await fetch(`${API_BASE_URL}/arcade/all?_t=${Date.now()}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success) {
        if (Array.isArray(data.scores)) {
          arcadeScores.value = data.scores
          saveToStorage(STORAGE_KEY_SCORES, data.scores)
        }
        if (Array.isArray(data.resetHistory)) {
          arcadeResetHistory.value = data.resetHistory
          saveToStorage(STORAGE_KEY_RESETS, data.resetHistory)
        }
      }
    }
  } catch (err) {
    console.warn('Cannot reach arcade server API, using local cache:', err)
  } finally {
    isSyncingArcade.value = false
  }
}

// ดึงข้อมูลจากเซิร์ฟเวอร์ทันทีเมื่อโหลดโมดูล
syncArcadeDataFromServer()

/**
 * บันทึกคะแนนลงฐานข้อมูลกลางของระบบ
 */
export async function recordArcadeScore(gameId, score) {
  const user = authUser.value
  if (!user || score === null || score === undefined || score < 0) return null

  const studentId = String(user.studentId || user.id || '').trim()
  if (!studentId) return null

  const studentInfo = studentsList.value.find(s => String(s.studentId || s.id).trim() === studentId)
  const studentName = studentInfo?.name || user.name || 'นักศึกษา'
  const classroom = studentInfo?.classroom || user.classroom || 'ทั่วไป'
  const avatar = studentInfo?.avatar || user.avatar || ''
  const weekKey = getCurrentWeekKey()
  const cleanScore = Math.round(Number(score))

  const newEntry = {
    gameId,
    studentId,
    studentName,
    classroom,
    avatar,
    score: cleanScore,
    weekKey,
    submittedAt: new Date().toISOString()
  }

  // อัปเดตแคชในเครื่องทันทีเพื่อให้หน้าจอแสดงผลได้เร็ว (Optimistic Update)
  const existingScores = arcadeScores.value.filter(s => s.gameId === gameId && s.studentId === studentId)
  const weeklyScores = existingScores.filter(s => s.weekKey === weekKey)
  const prevWeeklyBest = weeklyScores.length ? Math.max(...weeklyScores.map(s => s.score)) : 0
  const prevAllTimeBest = existingScores.length ? Math.max(...existingScores.map(s => s.score)) : 0

  const isNewWeeklyBest = cleanScore > prevWeeklyBest
  const isNewAllTimeBest = cleanScore > prevAllTimeBest

  const exIdx = arcadeScores.value.findIndex(s => s.gameId === gameId && s.studentId === studentId && s.weekKey === weekKey)
  if (exIdx !== -1) {
    if (cleanScore > arcadeScores.value[exIdx].score) {
      arcadeScores.value[exIdx].score = cleanScore
      arcadeScores.value[exIdx].submittedAt = newEntry.submittedAt
    }
  } else {
    arcadeScores.value = [newEntry, ...arcadeScores.value]
  }
  saveToStorage(STORAGE_KEY_SCORES, arcadeScores.value)

  // ส่งบันทึกลงเซิร์ฟเวอร์กลาง
  try {
    const res = await fetch(`${API_BASE_URL}/arcade/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    })
    if (res.ok) {
      const data = await res.json()
      // ดึงอัปเดตใหม่ล่าสุดเพื่อความแม่นยำ
      syncArcadeDataFromServer()
      return {
        entry: newEntry,
        isNewWeeklyBest: data.isNewWeeklyBest ?? isNewWeeklyBest,
        isNewAllTimeBest,
        prevWeeklyBest,
        prevAllTimeBest
      }
    }
  } catch (err) {
    console.error('Failed to post arcade score to server:', err)
  }

  return {
    entry: newEntry,
    isNewWeeklyBest,
    isNewAllTimeBest,
    prevWeeklyBest,
    prevAllTimeBest
  }
}

/**
 * กระดานผู้นำ (Leaderboard) แสดงเฉพาะ 10 อันดับแรกเท่านั้น (Top 10)
 * type: 'weekly' | 'allTime'
 */
export function getArcadeLeaderboard(gameId, type = 'weekly') {
  const weekKey = getCurrentWeekKey()
  const list = arcadeScores.value.filter(entry => {
    if (entry.gameId !== gameId) return false
    if (type === 'weekly' && entry.weekKey !== weekKey) return false
    return true
  })

  // Group by studentId to find each student's best score
  const studentBestMap = new Map()
  for (const item of list) {
    const sId = String(item.studentId)
    const existing = studentBestMap.get(sId)
    const itemDate = new Date(item.submittedAt || item.playedAt || 0)
    if (!existing || item.score > existing.score) {
      studentBestMap.set(sId, item)
    } else if (item.score === existing.score) {
      const existingDate = new Date(existing.submittedAt || existing.playedAt || 0)
      if (itemDate < existingDate) {
        studentBestMap.set(sId, item)
      }
    }
  }

  const sorted = Array.from(studentBestMap.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return new Date(a.submittedAt || a.playedAt || 0) - new Date(b.submittedAt || b.playedAt || 0)
  })

  // แสดงเฉพาะ 10 อันดับแรกเท่านั้น (Top 10)
  return sorted.slice(0, 10).map((entry, index) => {
    const liveStudent = studentsList.value.find(s => String(s.studentId || s.id).trim() === String(entry.studentId).trim())
    return {
      rank: index + 1,
      studentId: entry.studentId,
      studentName: liveStudent?.name || entry.studentName,
      classroom: liveStudent?.classroom || entry.classroom,
      avatar: liveStudent?.avatar || entry.avatar,
      score: entry.score,
      playedAt: entry.submittedAt || entry.playedAt,
      isCurrentUser: String(authUser.value?.studentId || authUser.value?.id).trim() === String(entry.studentId).trim()
    }
  })
}

/**
 * ดึงสถิติของตนเอง (แม้ตนเองจะไม่ได้ติด Top 10 ก็จะยังคำนวณอันดับจริงของตัวเองได้)
 */
export function getMyBestScores(gameId) {
  const user = authUser.value
  if (!user) return { weekly: 0, allTime: 0, myWeeklyRank: null, myAllTimeRank: null }
  const studentId = String(user.studentId || user.id || '').trim()

  const weekKey = getCurrentWeekKey()
  const weeklyList = arcadeScores.value.filter(s => s.gameId === gameId && s.weekKey === weekKey)
  const allTimeList = arcadeScores.value.filter(s => s.gameId === gameId)

  // คำนวณอันดับของทุกคนก่อนตัด Top 10 เพื่อหาอันดับของฉัน
  const getFullRank = (list) => {
    const map = new Map()
    for (const it of list) {
      const sId = String(it.studentId)
      const ex = map.get(sId)
      if (!ex || it.score > ex.score) map.set(sId, it)
    }
    const arr = Array.from(map.values()).sort((a, b) => b.score - a.score)
    const idx = arr.findIndex(it => String(it.studentId).trim() === studentId)
    const entry = idx !== -1 ? arr[idx] : null
    return { score: entry ? entry.score : 0, rank: idx !== -1 ? idx + 1 : null }
  }

  const weeklyRankInfo = getFullRank(weeklyList)
  const allTimeRankInfo = getFullRank(allTimeList)

  return {
    weekly: weeklyRankInfo.score,
    allTime: allTimeRankInfo.score,
    myWeeklyRank: weeklyRankInfo.rank,
    myAllTimeRank: allTimeRankInfo.rank
  }
}

/**
 * Trigger Weekly Reset and distribute Coins to Top 1, 2, 3 of all 3 games!
 */
export async function triggerWeeklyResetAndDistributeCoins(teacherName = 'ครูผู้สอน') {
  const weekKey = getCurrentWeekKey()
  const winnersList = []
  let totalCoinsAwarded = 0

  for (const game of ARCADE_GAMES) {
    const leaderboard = getArcadeLeaderboard(game.id, 'weekly')
    const top3 = leaderboard.slice(0, 3)

    for (let i = 0; i < top3.length; i++) {
      const winner = top3[i]
      const reward = RANK_REWARDS[i]
      if (winner && reward && winner.score > 0) {
        winnersList.push({
          gameId: game.id,
          gameName: game.name,
          gameIcon: game.icon,
          rank: reward.rank,
          studentId: winner.studentId,
          studentName: winner.studentName,
          classroom: winner.classroom,
          score: winner.score,
          coins: reward.coins
        })

        // Award Coins via shopStore & coinLedgerStore
        try {
          await addCoins(winner.studentId, reward.coins)
          recordCoinTransaction(winner.studentId, {
            amount: reward.coins,
            type: 'income',
            category: 'arcade',
            title: `รางวัลมินิเกมคลายเครียด (${game.name} อันดับ ${reward.rank})`,
            detail: `ทำคะแนนได้ ${winner.score} ${game.unit} ประจำสัปดาห์ ${weekKey}`
          })
          totalCoinsAwarded += reward.coins
        } catch (err) {
          console.error(`Failed to credit coins for ${winner.studentId}:`, err)
        }
      }
    }
  }

  const resetLog = {
    id: `reset_${Date.now()}`,
    weekKey,
    resetAt: new Date().toISOString(),
    distributedBy: teacherName,
    winners: winnersList,
    totalCoinsAwarded
  }

  // ส่งบันทึกประวัติการรีเซ็ตไปยังเซิร์ฟเวอร์
  try {
    await fetch(`${API_BASE_URL}/arcade/reset-week`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherName,
        weekKey,
        winners: winnersList,
        totalCoinsAwarded
      })
    })
  } catch (err) {
    console.error('Failed to post reset week to server:', err)
  }

  arcadeResetHistory.value = [resetLog, ...arcadeResetHistory.value]
  saveToStorage(STORAGE_KEY_RESETS, arcadeResetHistory.value)

  // เลื่อนสัปดาห์
  const [yearStr, wNumStr] = weekKey.split('-W')
  const nextWeekNum = (parseInt(wNumStr, 10) || 1) + 1
  currentArcadeWeek.value = `${yearStr}-W${String(nextWeekNum).padStart(2, '0')}`
  saveToStorage(STORAGE_KEY_WEEK_OVERRIDE, currentArcadeWeek.value)

  syncArcadeDataFromServer()

  return resetLog
}
