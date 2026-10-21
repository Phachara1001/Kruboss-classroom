import { ref, computed, watch } from 'vue'
import { authUser } from './authStore'
import { isAnnouncementModalOpen } from './announcementStore'
import { courses } from './courses'
import { courseAssignments, gradesStore, fetchGrades } from './gradesStore'
import confetti from 'canvas-confetti'

// Key for saving claimed rewards per student in localStorage
const getStorageKey = (studentId) => `kmutnb_claimed_assignment_rewards_v2_${studentId}`

// Queue of pending rewards
export const pendingRewards = ref([])
export const isRewardModalOpen = ref(false)
export const isCheckingRewards = ref(false)
export const currentReward = computed(() => pendingRewards.value[0] || null)

// Function to get claimed data from localStorage
export function getClaimedData(studentId) {
  if (!studentId) return {}
  try {
    const raw = localStorage.getItem(getStorageKey(studentId))
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    console.error('Failed to parse claimed rewards:', e)
    return {}
  }
}

// Function to mark a reward as claimed
export function markRewardAsClaimed(studentId, rewardKey, score) {
  if (!studentId || !rewardKey) return
  try {
    const data = getClaimedData(studentId)
    data[rewardKey] = {
      score: Number(score) || 0,
      claimedAt: new Date().toISOString()
    }
    localStorage.setItem(getStorageKey(studentId), JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save claimed reward:', e)
  }
}

// Function to clear/reset claimed rewards (for testing & re-verification)
export function resetClaimedRewards(studentId) {
  const targetId = studentId || authUser.value?.studentId || authUser.value?.id
  if (!targetId) return
  localStorage.removeItem(getStorageKey(targetId))
  console.log(`[RewardStore] Reset claimed rewards for: ${targetId}`)
}

// Confetti celebratory explosion
export function triggerCelebrationConfetti() {
  try {
    // Stage 1: Big gold & emerald burst
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#FBBF24', '#34D399', '#6366F1']
    })
    // Stage 2: Dual side fireworks
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#F59E0B', '#FCD34D', '#10B981']
      })
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#F59E0B', '#FCD34D', '#10B981']
      })
    }, 280)
  } catch (e) {
    console.log('Confetti effect unavailable:', e)
  }
}

// Anti-collision scheduler: Will NEVER show while AnnouncementModal is open!
export function scheduleModalDisplay() {
  if (pendingRewards.value.length === 0) return

  // If AnnouncementModal is currently active, wait until it closes!
  if (isAnnouncementModalOpen.value) {
    console.log('[RewardStore] AnnouncementModal is open. Reward modal is queuing...')
    const unwatch = watch(isAnnouncementModalOpen, (isOpen) => {
      if (!isOpen) {
        unwatch()
        // Wait 400ms after announcement fades out for a sleek, non-jarring transition
        setTimeout(() => {
          if (pendingRewards.value.length > 0) {
            triggerRewardDisplay()
          }
        }, 400)
      }
    })
    return
  }

  // If no announcement is open, wait 600ms after page mount
  setTimeout(() => {
    // Re-verify that announcement hasn't opened in the meantime
    if (isAnnouncementModalOpen.value) {
      scheduleModalDisplay()
      return
    }
    triggerRewardDisplay()
  }, 600)
}

function triggerRewardDisplay() {
  if (pendingRewards.value.length === 0) return
  isRewardModalOpen.value = true
  triggerCelebrationConfetti()
}

// Dismiss current reward and step to next or finish
export function dismissCurrentReward() {
  const current = currentReward.value
  if (!current) {
    isRewardModalOpen.value = false
    return
  }

  const studentId = authUser.value?.studentId || authUser.value?.id
  // Only mark in localStorage if this is a real student reward (not a test preview)
  if (studentId && current.id && !current.isTest) {
    markRewardAsClaimed(studentId, current.id, current.score)
  }

  // Remove current reward from pending queue
  pendingRewards.value.shift()

  // If more rewards exist, show next reward with sound/confetti
  if (pendingRewards.value.length > 0) {
    triggerCelebrationConfetti()
  } else {
    isRewardModalOpen.value = false
  }
}

// Check grades for student and queue any newly graded assignments
export async function checkAndQueueStudentRewards(studentId, customCourseIds = null) {
  if (!studentId) return []
  if (isCheckingRewards.value) return []
  isCheckingRewards.value = true

  try {
    const claimedData = getClaimedData(studentId)
    const targetCourseIds = customCourseIds || authUser.value?.courseIds || courses.map(c => c.id)

    // Ensure grades are fetched for target courses
    await Promise.allSettled(targetCourseIds.map(cid => fetchGrades(cid)))

    const newRewards = []

    targetCourseIds.forEach(courseId => {
      const gradeKey = `${courseId}_${studentId}`
      const studentGrade = gradesStore.value?.[gradeKey]
      if (!studentGrade || !studentGrade.assignments) return

      const courseObj = courses.find(c => c.id === courseId)
      const courseName = courseObj?.name ? `${courseObj.name} (${courseId})` : courseId
      const assignmentsList = courseAssignments[courseId] || []

      Object.entries(studentGrade.assignments).forEach(([asmId, scoreVal]) => {
        const score = Number(scoreVal)
        if (isNaN(score) || score <= 0) return

        const asmObj = assignmentsList.find(a => a.id === asmId)
        const asmTitle = asmObj?.title || `ใบงานที่ ${asmId}`
        const maxScore = asmObj?.maxScore || 10
        const rewardKey = `${courseId}_${asmId}`

        const prevClaimed = claimedData[rewardKey]
        const prevScore = prevClaimed ? Number(prevClaimed.score) : 0

        // If never claimed, or teacher regraded and increased score
        if (!prevClaimed || score > prevScore) {
          const coinsEarned = prevClaimed ? Math.round((score - prevScore) * 4) : Math.round(score * 4)
          if (coinsEarned > 0) {
            newRewards.push({
              id: rewardKey,
              courseId,
              courseName,
              assignmentId: asmId,
              assignmentTitle: asmTitle,
              coins: coinsEarned,
              score,
              maxScore,
              isUpgrade: !!prevClaimed,
              isTest: false
            })
          }
        }
      })
    })

    if (newRewards.length > 0) {
      pendingRewards.value = newRewards
      scheduleModalDisplay()
    }

    return newRewards
  } catch (err) {
    console.error('[RewardStore] Error checking rewards:', err)
    return []
  } finally {
    isCheckingRewards.value = false
  }
}

// Test trigger for instant manual preview
export function triggerTestReward(customData = {}) {
  pendingRewards.value = [
    {
      id: 'test-preview-' + Date.now(),
      courseId: '31901-2007',
      courseName: 'เทคโนโลยีการจัดการฐานข้อมูล (31901-2007)',
      assignmentId: 'asm-1',
      assignmentTitle: 'ใบงานที่ 1: การสำรวจปัญหาแฟ้มข้อมูล และเริ่มต้น Supabase Cloud',
      coins: customData.coins || 40,
      score: customData.score || 10,
      maxScore: customData.maxScore || 10,
      isUpgrade: false,
      isTest: true,
      ...customData
    }
  ]
  isRewardModalOpen.value = true
  triggerCelebrationConfetti()
}

// Expose dev testing helper on window
if (typeof window !== 'undefined') {
  window.__testRewardModal = (coins = 40, title, course) => {
    triggerTestReward({
      coins: Number(coins) || 40,
      assignmentTitle: title || 'ใบงานที่ 1: การสำรวจปัญหาแฟ้มข้อมูล และเริ่มต้น Supabase Cloud',
      courseName: course || 'เทคโนโลยีการจัดการฐานข้อมูล (31901-2007)'
    })
  }

  window.__resetRewardClaims = (studentId) => {
    const sId = studentId || authUser.value?.studentId || authUser.value?.id
    resetClaimedRewards(sId)
    alert(`[สำเร็จ] รีเซ็ตประวัติการรับแจ้งเตือนของ ${sId} เรียบร้อยแล้ว! เมื่อเด็กล็อกอินเข้ามาใหม่ จะเห็น Modal อีกครั้ง`)
  }
}
