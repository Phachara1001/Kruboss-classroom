import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'

export const DEFAULT_AVATAR = '/placeholder_profile.png'

export const getStudentAvatar = (studentOrAvatar) => {
  const a = typeof studentOrAvatar === 'object' && studentOrAvatar !== null
    ? studentOrAvatar.avatar
    : studentOrAvatar

  if (!a || typeof a !== 'string') return DEFAULT_AVATAR
  const trimmed = a.trim()
  if (!trimmed || trimmed === '-' || trimmed.length <= 2) return DEFAULT_AVATAR
  if (trimmed.startsWith('data:') || trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
  if (trimmed.includes('localhost')) return `http://${trimmed}`
  if (trimmed.includes('/')) return trimmed
  return DEFAULT_AVATAR
}

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

    // Auto-sanitize avatar URLs to full HTTPS domain and provide placeholder if not uploaded
    const sanitized = (data || []).map(s => {
      if (s.avatar && s.avatar.includes('/assets/')) {
        const parts = s.avatar.split('/assets/');
        if (parts.length > 1) {
          s.avatar = `https://kruboss-classroom.loeitech.ac.th/assets/${parts[1]}`;
        }
      }
      if (!s.avatar || typeof s.avatar !== 'string' || (!s.avatar.includes('/') && !s.avatar.startsWith('http') && !s.avatar.startsWith('data:'))) {
        s.avatar = DEFAULT_AVATAR;
      }
      if (s.equippedFrame && s.equippedFrame.includes('/assets/')) {
        const parts = s.equippedFrame.split('/assets/');
        if (parts.length > 1) {
          s.equippedFrame = `https://kruboss-classroom.loeitech.ac.th/assets/${parts[1]}`;
        }
      }
      if (!s.equippedFrame && (s.role === 'subject_teacher' || s.classroom === 'subject_teacher_room' || s.role === 'teacher' || s.classroom === 'teacher_room' || s.studentId === 'boss')) {
        s.equippedFrame = '/img/frame/Teacher.png';
      }
      return s;
    });

    studentsList.value = sanitized;

    // Sync logged in user profile, coins & permissions
    if (authUser.value) {
      const myId = authUser.value.studentId || authUser.value.id;
      const me = sanitized.find(s => s.studentId === myId || s.id === myId);
      if (me) {
        const patch = {};
        if (me.coins !== undefined && authUser.value.coins !== me.coins) patch.coins = me.coins;
        if (me.avatar && authUser.value.avatar !== me.avatar) patch.avatar = me.avatar;
        if (me.equippedFrame && authUser.value.equippedFrame !== me.equippedFrame) patch.equippedFrame = me.equippedFrame;
        if (me.role && authUser.value.role !== me.role) patch.role = me.role;
        if (me.classroom && authUser.value.classroom !== me.classroom) patch.classroom = me.classroom;
        if (me.canGrade !== undefined && Boolean(authUser.value.canGrade) !== Boolean(me.canGrade)) {
          patch.canGrade = Boolean(me.canGrade);
        }
        if (me.isActive !== undefined && Boolean(authUser.value.isActive !== false) !== Boolean(me.isActive !== false)) {
          patch.isActive = me.isActive !== false;
        }
        if (me.teacherPosition !== undefined && (authUser.value.teacherPosition || '') !== (me.teacherPosition || '')) {
          patch.teacherPosition = me.teacherPosition || '';
        }
        if (Array.isArray(me.courseIds) && JSON.stringify(authUser.value.courseIds || []) !== JSON.stringify(me.courseIds)) {
          patch.courseIds = me.courseIds;
        }
        if (Object.keys(patch).length > 0) {
          updateAuthUser(patch);
        }
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

export const isSubjectTeacher = (user) => {
  if (!user) return false
  return user.role === 'subject_teacher' || user.classroom === 'subject_teacher_room'
}

export const isMainTeacher = (user) => {
  if (!user || isSubjectTeacher(user)) return false
  const r = (user.role || '').toLowerCase()
  const c = (user.classroom || '').toLowerCase()
  const id = (user.studentId || user.id || '').toString().toLowerCase()
  const name = (user.name || '').toLowerCase()

  if (['อาจารย์', 'teacher', 'admin', 'ครู'].some(t => r.includes(t))) return true
  if (['teacher_room', 'อาจารย์ผู้สอน'].includes(c) || c.includes('teacher') || c.includes('อาจารย์') || c.includes('ครู')) return true
  if (id === '0000' || id === 'teacher' || id === 'boss' || id === 'admin') return true
  if (name.includes('ครู') || name.includes('อาจารย์') || name.includes('teacher') || name.includes('admin')) return true
  return false
}

export const isAnyTeacher = (user) => {
  return isMainTeacher(user) || isSubjectTeacher(user)
}

export const isTeacherUser = isAnyTeacher

export const canViewCourse = (user, courseId) => {
  if (!user) return false
  if (isMainTeacher(user)) return true
  if (!courseId) return false
  return Array.isArray(user.courseIds) && user.courseIds.includes(courseId)
}

export const canManageCourse = (user, courseId) => {
  if (!user) return false
  if (isMainTeacher(user)) return true
  if (isSubjectTeacher(user)) {
    return Boolean(user.canGrade) && canViewCourse(user, courseId)
  }
  return false
}

export const getUserRoleLabel = (user) => {
  if (!user) return 'นักศึกษา'
  if (isMainTeacher(user)) return 'ครูผู้สอน'
  if (isSubjectTeacher(user)) return user.teacherPosition || 'ครูประจำวิชา'
  return user.role || 'นักศึกษา'
}

export const isStudent = (student) => {
  if (!student) return false
  if (isAnyTeacher(student)) return false
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
