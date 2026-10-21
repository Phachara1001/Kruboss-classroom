import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'

const API_URL = `${API_BASE_URL}/announcements`

export const announcements = ref([])
export const isAnnouncementModalOpen = ref(false)
export const hasCheckedAnnouncements = ref(false)

export async function fetchAnnouncements() {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()
    if (res.ok) {
      announcements.value = data
    }
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
  } finally {
    hasCheckedAnnouncements.value = true
  }
}

export async function createAnnouncement(announcementData) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementData)
    })
    const data = await res.json()
    if (res.ok) {
      announcements.value.unshift(data)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to create announcement:', error)
    return false
  }
}

export async function updateAnnouncement(id, announcementData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementData)
    })
    const data = await res.json()
    if (res.ok) {
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = data
      }
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to update announcement:', error)
    return false
  }
}

export async function deleteAnnouncement(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      announcements.value = announcements.value.filter(a => a.id !== id)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to delete announcement:', error)
    return false
  }
}
