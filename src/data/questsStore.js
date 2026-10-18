import { ref } from 'vue'
import { addCoins, giveItemToStudent, directShopItems, boxesList } from './shopStore'
import { API_BASE_URL } from '@/config/api'

export const questsList = ref([])
export const studentQuestProgress = ref({}) // { [questId]: count } for current logged-in student
export const allQuestProgress = ref({})     // { [`${studentId}_${questId}`]: count } for all students

const API_BASE = API_BASE_URL

export async function fetchQuests() {
  try {
    const res = await fetch(`${API_BASE}/quests`)
    const data = await res.json()
    questsList.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to fetch quests', e)
  }
}

// Fetch quest progress for a single student
export async function fetchQuestProgress(studentId) {
  if (!studentId) return
  try {
    const res = await fetch(`${API_BASE}/quests/progress/${studentId}`)
    const data = await res.json()
    
    const progressMap = {}
    if (Array.isArray(data)) {
      data.forEach(p => {
        progressMap[p.questId] = p.completions
        allQuestProgress.value[`${studentId}_${p.questId}`] = p.completions
      })
    }
    studentQuestProgress.value = progressMap
  } catch (e) {
    console.error('Failed to fetch quest progress', e)
  }
}

// Fetch all quest progress for all students (Teacher view & grading modal)
export async function fetchAllQuestProgress() {
  try {
    const res = await fetch(`${API_BASE}/quests/progress`)
    const data = await res.json()
    if (Array.isArray(data)) {
      const map = {}
      data.forEach(p => {
        map[`${p.studentId}_${p.questId}`] = p.completions
      })
      allQuestProgress.value = map
    }
  } catch (e) {
    console.error('Failed to fetch all quest progress', e)
  }
}

export async function saveQuest(questData) {
  try {
    const isNew = !questData.id
    if (isNew) questData.id = `quest_${Date.now()}`
    
    const res = await fetch(`${API_BASE}/quests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questData)
    })
    
    const saved = await res.json()
    
    const existingIdx = questsList.value.findIndex(q => q.id === saved.id)
    if (existingIdx !== -1) {
      questsList.value[existingIdx] = saved
    } else {
      questsList.value.unshift(saved)
    }
    return saved
  } catch (e) {
    console.error('Failed to save quest', e)
  }
}

// Delete quest
export async function deleteQuest(questId) {
  try {
    await fetch(`${API_BASE}/quests/${questId}`, { method: 'DELETE' })
    questsList.value = questsList.value.filter(q => q.id !== questId)
  } catch (e) {
    console.error('Failed to delete quest', e)
  }
}

// Check student progress for a quest (Flexible signature)
// Usage: getStudentQuestCompletions(questId) OR getStudentQuestCompletions(studentId, questId) OR getStudentQuestCompletions(questId, studentId)
export function getStudentQuestCompletions(arg1, arg2) {
  if (!arg1 && !arg2) return 0

  // Unwrap Vue refs if passed
  const val1 = (arg1 && typeof arg1 === 'object' && 'value' in arg1) ? arg1.value : arg1
  const val2 = (arg2 && typeof arg2 === 'object' && 'value' in arg2) ? arg2.value : arg2

  if (!val1 && !val2) return 0

  let studentId = null
  let questId = null

  if (val2 !== undefined && val2 !== null && val2 !== '') {
    // If two arguments are passed: identify which is questId and which is studentId
    const s1 = String(val1).trim()
    const s2 = String(val2).trim()

    if (s1.startsWith('quest_') || questsList.value.some(q => q.id === s1)) {
      questId = s1
      studentId = s2
    } else if (s2.startsWith('quest_') || questsList.value.some(q => q.id === s2)) {
      studentId = s1
      questId = s2
    } else {
      // Default convention: (studentId, questId)
      studentId = s1
      questId = s2
    }
  } else {
    questId = String(val1).trim()
  }

  // 1. If studentId is known, check allQuestProgress
  if (studentId && questId) {
    const key = `${studentId}_${questId}`
    if (allQuestProgress.value[key] !== undefined) {
      return Number(allQuestProgress.value[key]) || 0
    }
  }

  // 2. Fallback to studentQuestProgress (current logged in student)
  if (questId && studentQuestProgress.value[questId] !== undefined) {
    return Number(studentQuestProgress.value[questId]) || 0
  }

  return 0
}

// Approve/Pass quest for a student
export async function approveQuestForStudent(studentId, questId) {
  const quest = questsList.value.find(q => q.id === questId)
  if (!quest) return { success: false, message: 'ไม่พบภารกิจ' }

  const currentCompletions = getStudentQuestCompletions(studentId, questId)
  if (quest.maxCompletions > 0 && currentCompletions >= quest.maxCompletions) {
    return { success: false, message: 'นักศึกษาทำภารกิจนี้ครบจำนวนครั้งแล้ว' }
  }

  const nextCompletions = currentCompletions + 1

  // 1. Update progress in backend (Atomic increment)
  try {
    const res = await fetch(`${API_BASE}/quests/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, questId, increment: true })
    })
    
    if (res.ok) {
      const data = await res.json()
      const savedCount = data?.completions !== undefined ? data.completions : nextCompletions
      allQuestProgress.value[`${studentId}_${questId}`] = savedCount
      studentQuestProgress.value[questId] = savedCount
    } else {
      allQuestProgress.value[`${studentId}_${questId}`] = nextCompletions
      studentQuestProgress.value[questId] = nextCompletions
    }
  } catch (e) {
    console.error('Failed to update quest progress on backend', e)
    // Local fallback
    allQuestProgress.value[`${studentId}_${questId}`] = nextCompletions
    studentQuestProgress.value[questId] = nextCompletions
  }

  // 2. Distribute rewards
  if (Array.isArray(quest.rewards)) {
    for (const reward of quest.rewards) {
      if (reward.type === 'coin') {
        await addCoins(studentId, Number(reward.amount) || 0)
      } else if (reward.type === 'frame') {
        const item = directShopItems.value.find(i => i.id === reward.itemId)
        if (item) {
          await giveItemToStudent(studentId, item, 'รางวัลภารกิจ', `quest_${quest.id}`)
        }
      } else if (reward.type === 'gacha') {
        const box = boxesList.value.find(b => b.id === reward.itemId)
        if (box) {
          const fakeItem = {
            id: `box_reward_${box.id}`,
            name: box.name,
            itemType: 'box',
            image: box.image,
            rarity: 'Special Collection'
          }
          await giveItemToStudent(studentId, fakeItem, 'รางวัลภารกิจ', `quest_${quest.id}`)
        }
      }
    }
  }

  return { 
    success: true, 
    completions: allQuestProgress.value[`${studentId}_${questId}`] || nextCompletions,
    message: 'มอบรางวัลสำเร็จ' 
  }
}

// Batch approve quest for multiple students
export async function batchApproveQuest(studentIds, questId) {
  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return { success: false, message: 'ไม่ได้เลือกนักศึกษา' }
  }

  let successCount = 0
  const errors = []

  for (const sId of studentIds) {
    const res = await approveQuestForStudent(sId, questId)
    if (res.success) {
      successCount++
    } else {
      errors.push(`${sId}: ${res.message}`)
    }
  }

  return {
    success: successCount > 0,
    count: successCount,
    total: studentIds.length,
    errors
  }
}
