import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'
import { getAuthHeaders } from './authStore'
import { fetchStudents } from './studentsStore'

export const teachersList = ref([])
export const isLoadingTeachers = ref(false)

export const fetchTeachers = async () => {
  isLoadingTeachers.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/teachers?_t=${Date.now()}`, {
      headers: getAuthHeaders()
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'ไม่สามารถดึงข้อมูลครูประจำวิชาได้')
    }
    teachersList.value = Array.isArray(data) ? data : []
    return teachersList.value
  } finally {
    isLoadingTeachers.value = false
  }
}

export const createTeacherAccount = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/teachers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok || data.success === false) {
    throw new Error(data?.message || 'ไม่สามารถสร้างบัญชีครูประจำวิชาได้')
  }
  await Promise.all([fetchTeachers(), fetchStudents()])
  return data.teacher
}

export const updateTeacherAccount = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok || data.success === false) {
    throw new Error(data?.message || 'ไม่สามารถแก้ไขข้อมูลครูประจำวิชาได้')
  }
  await Promise.all([fetchTeachers(), fetchStudents()])
  return data.teacher
}

export const deleteTeacherAccount = async (id) => {
  const res = await fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  const data = await res.json()
  if (!res.ok || data.success === false) {
    throw new Error(data?.message || 'ไม่สามารถลบบัญชีครูประจำวิชาได้')
  }
  await Promise.all([fetchTeachers(), fetchStudents()])
  return true
}
