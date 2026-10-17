import { ref, watch } from 'vue'
import { addCoins, giveItemToStudent, directShopItems, boxesList } from './shopStore'
import { API_BASE_URL } from '@/config/api'

const STORAGE_KEY_QUESTS = 'kmutnb_classroom_quests_v1'
const STORAGE_KEY_QUESTS_PROGRESS = 'kmutnb_classroom_quests_progress_v1'

export const questsList = ref([])
export const studentQuestProgress = ref({})

const API_BASE = API_BASE_URL

export async function fetchQuests() {
  try {
    const res = await fetch(`${API_BASE}/quests`)
    const data = await res.json()
    questsList.value = data
  } catch (e) {
    console.error('Failed to fetch quests', e)
  }
}

export async function fetchQuestProgress(studentId) {
  try {
    const res = await fetch(`${API_BASE}/quests/progress/${studentId}`)
    const data = await res.json()
    
    const progressMap = {}
    data.forEach(p => {
      progressMap[p.questId] = p.completions
    })
    studentQuestProgress.value = progressMap
  } catch (e) {
    console.error('Failed to fetch quest progress', e)
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

// Check student progress for a quest
export function getStudentQuestCompletions(questId) {
  return studentQuestProgress.value[questId] || 0
}

// Approve/Pass quest for a student
export async function approveQuestForStudent(studentId, questId) {
  const quest = questsList.value.find(q => q.id === questId)
  if (!quest) return { success: false, message: 'ไม่พบภารกิจ' }

  const currentCompletions = getStudentQuestCompletions(questId)
  if (currentCompletions >= quest.maxCompletions && quest.maxCompletions !== 0) {
    return { success: false, message: 'นักศึกษาทำภารกิจนี้ครบจำนวนครั้งแล้ว' }
  }

  // Update progress in backend
  try {
    const res = await fetch(`${API_BASE}/quests/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, questId, completions: currentCompletions + 1 })
    })
    
    if (res.ok) {
      studentQuestProgress.value = {
        ...studentQuestProgress.value,
        [questId]: currentCompletions + 1
      }
    }
  } catch (e) {
    console.error('Failed to update progress', e)
    return { success: false, message: 'บันทึกความคืบหน้าไม่สำเร็จ' }
  }

  // Distribute rewards
  for (const reward of quest.rewards) {
    if (reward.type === 'coin') {
      addCoins(studentId, reward.amount)
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

  // Increment progress
  if (!studentQuestProgress.value[studentId]) {
    studentQuestProgress.value[studentId] = {}
  }
  studentQuestProgress.value[studentId][questId] = currentCompletions + 1

  return { success: true, message: 'มอบรางวัลสำเร็จ' }
}
