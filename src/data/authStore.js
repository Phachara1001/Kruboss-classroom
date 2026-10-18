import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api'

const STORAGE_KEY_AUTH = 'kmutnb_classroom_auth_v1'
export const authUser = ref(loadAuth())
export const isLoggedIn = ref(!!authUser.value)

export const passwordResetRequests = ref([]) // You can implement a fetch for this if needed

function sanitizeUserAvatar(user) {
  if (!user) return user
  if (!user.avatar || typeof user.avatar !== 'string' || (!user.avatar.includes('/') && !user.avatar.startsWith('http') && !user.avatar.startsWith('data:'))) {
    user.avatar = '/placeholder_profile.png'
  }
  return user
}

function loadAuth() {
  const saved = localStorage.getItem(STORAGE_KEY_AUTH)
  if (saved) {
    try {
      return sanitizeUserAvatar(JSON.parse(saved))
    } catch {
      return null
    }
  }
  return null
}

export function updateAuthUser(newFields) {
  if (authUser.value) {
    authUser.value = sanitizeUserAvatar({ ...authUser.value, ...newFields })
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser.value))
  }
}

export async function requestPasswordReset(studentId) {
  try {
    await fetch(`${API_BASE_URL}/auth/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
  } catch (err) {
    console.error(err);
  }
}

export async function fetchPasswordResetRequests() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/requests`);
    const data = await res.json();
    passwordResetRequests.value = data;
  } catch (err) {
    console.error(err);
  }
}

export async function approvePasswordReset(reqId) {
  try {
    await fetch(`${API_BASE_URL}/auth/requests/${reqId}/approve`, { method: 'POST' });
    await fetchPasswordResetRequests();
  } catch (err) {
    console.error(err);
  }
}

export async function rejectPasswordReset(reqId) {
  try {
    await fetch(`${API_BASE_URL}/auth/requests/${reqId}/reject`, { method: 'POST' });
    await fetchPasswordResetRequests();
  } catch (err) {
    console.error(err);
  }
}

// Pass in studentsList to avoid circular import issues
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const sanitizedUser = sanitizeUserAvatar(data.user);
      authUser.value = sanitizedUser;
      isLoggedIn.value = true;
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sanitizedUser));
      localStorage.setItem('auth_token', data.token); // Save token for future requests
      return { success: true };
    } else {
      if (data.requireSetup) {
        return { success: false, requireSetup: true, message: data.message };
      }
      return { success: false, message: data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  } catch (err) {
    return { success: false, message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' };
  }
}

export async function loginFirstTime(studentId, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/setup-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, newPassword })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const sanitizedUser = sanitizeUserAvatar(data.user);
      authUser.value = sanitizedUser;
      isLoggedIn.value = true;
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sanitizedUser));
      localStorage.setItem('auth_token', data.token);
      return { success: true, student: sanitizedUser };
    }
    return { success: false, message: data.message };
  } catch (err) {
    return { success: false, message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' };
  }
}

export function logout() {
  authUser.value = null
  isLoggedIn.value = false
  localStorage.removeItem(STORAGE_KEY_AUTH)
  localStorage.removeItem('auth_token')
}
