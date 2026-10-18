import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'

const STORAGE_KEY_GAME_SCORES = 'kmutnb_classroom_game_scores_v1'

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_GAME_SCORES)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {
    console.error('Failed to parse local game scores:', e)
    return {}
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY_GAME_SCORES, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save local game scores:', e)
  }
}

// Map: { [courseId_week_studentId]: { courseId, week, studentId, scores: { [gameId]: { score, maxScore, submittedAt } } } }
export const gameScoresStore = ref(loadFromStorage())

export const fetchGameScores = async (courseId, week) => {
  if (!courseId || !week) return {}
  try {
    const res = await fetch(`${API_BASE_URL}/game-scores/${courseId}/${week}`)
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) {
        const updated = { ...gameScoresStore.value }
        for (const [studentId, record] of Object.entries(json.data)) {
          const key = `${courseId}_${week}_${studentId}`
          updated[key] = record
        }
        gameScoresStore.value = updated
        saveToStorage(updated)
        return json.data
      }
    }
  } catch (e) {
    console.error('Failed to fetch game scores from API:', e)
  }
  return {}
}

export const hasStudentPlayedGame = (courseId, week, studentId, gameId) => {
  if (!courseId || !week || !studentId || !gameId) return false
  const key = `${courseId}_${week}_${studentId}`
  const record = gameScoresStore.value[key]
  return !!(record?.scores && record.scores[gameId])
}

export const getStudentGameScore = (courseId, week, studentId, gameId) => {
  if (!courseId || !week || !studentId || !gameId) return null
  const key = `${courseId}_${week}_${studentId}`
  const record = gameScoresStore.value[key]
  return record?.scores?.[gameId] || null
}

export const getStudentWeekScores = (courseId, week, studentId) => {
  if (!courseId || !week || !studentId) return {}
  const key = `${courseId}_${week}_${studentId}`
  return gameScoresStore.value[key]?.scores || {}
}

export const saveGameScore = async (courseId, week, studentId, gameId, score, maxScore) => {
  if (!courseId || !week || !studentId || !gameId) {
    return { success: false, message: 'ข้อมูลไม่ครบถ้วน' }
  }

  const key = `${courseId}_${week}_${studentId}`
  const existing = gameScoresStore.value[key]

  // Prevent multiple attempts (Single Attempt Rule)
  if (existing?.scores?.[gameId]) {
    return {
      success: false,
      message: 'คุณได้บันทึกคะแนนกิจกรรมนี้ไปแล้ว (เล่นได้ครั้งเดียวเท่านั้น)',
      existingScore: existing.scores[gameId]
    }
  }

  const newScoreEntry = {
    score: Math.min(Number(score), Number(maxScore)),
    maxScore: Number(maxScore),
    submittedAt: new Date().toISOString()
  }

  const currentScores = existing?.scores ? { ...existing.scores } : {}
  currentScores[gameId] = newScoreEntry

  const updatedRecord = {
    courseId,
    week: Number(week),
    studentId,
    scores: currentScores,
    lastUpdated: new Date().toISOString()
  }

  // Update locally first for instant feedback
  gameScoresStore.value = {
    ...gameScoresStore.value,
    [key]: updatedRecord
  }
  saveToStorage(gameScoresStore.value)

  // Sync to Backend API
  try {
    const res = await fetch(`${API_BASE_URL}/game-scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        week,
        studentId,
        gameId,
        score,
        maxScore
      })
    })
    const json = await res.json()
    if (json.success && json.record) {
      gameScoresStore.value = {
        ...gameScoresStore.value,
        [key]: json.record
      }
      saveToStorage(gameScoresStore.value)
      return { success: true, record: json.record }
    }
  } catch (err) {
    console.error('Failed to sync game score to server:', err)
  }

  return { success: true, record: updatedRecord }
}

// Calculate total score normalized to 10 points
export const calculateNormalizedScore = (scores = {}, gameDefs = []) => {
  if (!gameDefs.length) return { earned: 0, max: 0, normalized: '0.0', isAllCompleted: false, completedCount: 0 }

  let earnedTotal = 0
  let maxTotal = 0
  let completedCount = 0

  gameDefs.forEach((g) => {
    maxTotal += Number(g.maxScore || 1)
    if (scores[g.id]) {
      earnedTotal += Number(scores[g.id].score || 0)
      completedCount++
    }
  })

  const isAllCompleted = completedCount === gameDefs.length
  const normalized = maxTotal > 0 ? ((earnedTotal / maxTotal) * 10).toFixed(1) : '0.0'

  return {
    earned: earnedTotal,
    max: maxTotal,
    normalized,
    isAllCompleted,
    completedCount,
    totalGames: gameDefs.length
  }
}
