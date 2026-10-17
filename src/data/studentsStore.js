import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const getAvatarInitial = (name) => {
  if (!name) return 'น'
  const cleaned = name.replace(/^(นาย|นางสาว|นาง|ว่าที่ร้อยตรี|ด\.ช\.|ด\.ญ\.)\s*/, '').trim()
  return cleaned.charAt(0) || name.charAt(0) || 'น'
}

export const courseClassrooms = {
  '31901-2007': ['ปวส.1/1'],
  '31901-2012': ['ปวส.1/1'],
  '21901-2012': ['ปวช.2/1', 'ปวช.2/2'],
  '21901-2007': ['ปวช.3/2']
}

import { authUser, updateAuthUser } from './authStore'

export const studentsList = ref([])

export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students?_t=${Date.now()}`);
    const data = await response.json();
    studentsList.value = data;

    // Sync logged in user profile & coins
    if (authUser.value) {
      const myId = authUser.value.studentId || authUser.value.id;
      const me = data.find(s => s.studentId === myId || s.id === myId);
      if (me && me.coins !== undefined && authUser.value.coins !== me.coins) {
        updateAuthUser({ coins: me.coins });
      }
    }
  } catch (err) {
    console.error('Failed to fetch students:', err);
  }
}

// Initial fetch
fetchStudents();

export const isStudentInCourse = (student, courseId) => {
  if (!student) return false
  if (Array.isArray(student.courseIds)) {
    return student.courseIds.includes(courseId)
  }
  return student.courseId === courseId
}

export const isStudent = (student) => {
  if (!student) return false
  const r = (student.role || '').toLowerCase()
  const c = (student.classroom || '').toLowerCase()
  const id = (student.studentId || student.id || '').toString().toLowerCase()
  const name = (student.name || '').toLowerCase()

  if (['อาจารย์', 'teacher', 'admin', 'ครู'].some(t => r.includes(t))) return false
  if (['teacher_room', 'อาจารย์ผู้สอน'].includes(c) || c.includes('teacher') || c.includes('อาจารย์') || c.includes('ครู')) return false
  if (id === '0000' || id === 'teacher' || id === 'boss' || id === 'admin') return false
  if (name.includes('ครู') || name.includes('อาจารย์') || name.includes('teacher') || name.includes('admin')) return false
  return true
}

export const addStudent = async ({ courseIds, courseId, classroom, studentId, name, role = 'นักศึกษา' }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds, courseId, classroom, studentId, name, role })
    });
    const newStudent = await response.json();
    
    // Add to local list or refetch
    await fetchStudents();
    return newStudent;
  } catch (err) {
    console.error(err);
    throw new Error('ไม่สามารถเพิ่มนักศึกษาได้ (เซิร์ฟเวอร์มีปัญหา)');
  }
}

export const updateStudent = async (id, fields) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    const updated = await response.json();
    await fetchStudents();
    return updated;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE'
    });
    const deleted = await response.json();
    await fetchStudents();
    return deleted;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Note: enrollClassroomToCourses and resetStudentsToDefault might need backend implementations if heavily used,
// but for now we keep them client-side-only or simple loops
export const enrollClassroomToCourses = async (classroom, targetCourseIds) => {
  // Simplified loop calling update
  let affectedCount = 0;
  for (const s of studentsList.value) {
    if (s.classroom === classroom) {
      const current = Array.isArray(s.courseIds) ? s.courseIds : (s.courseId ? [s.courseId] : []);
      const updated = [...new Set([...current, ...targetCourseIds])];
      if (updated.length > current.length) {
        await updateStudent(s.id, { courseIds: updated, courseId: updated[0] });
        affectedCount++;
      }
    }
  }
  return affectedCount;
}

export const resetStudentsToDefault = () => {
  // Can be implemented by clearing the DB, omitted here for safety.
}
