import { ref, computed, watch } from 'vue'
import { studentsList } from './studentsStore'
import { API_BASE_URL } from '@/config/api'

const STORAGE_KEY_BOXES = 'kmutnb_classroom_gacha_boxes_v1'
const STORAGE_KEY_COINS = 'kmutnb_classroom_student_coins_v1'
const STORAGE_KEY_INVENTORY = 'kmutnb_classroom_student_inventory_v1'
const STORAGE_KEY_EQUIPMENT = 'kmutnb_classroom_student_equipment_v1'
const STORAGE_KEY_USER_ROLE = 'kmutnb_classroom_active_role_v1'

// Dynamically load all assets from /public/img/Gacha/
const rawImages = import.meta.glob('/public/img/Gacha/**/*.{png,jpg,jpeg,gif,webp}', { eager: true, query: '?url', import: 'default' })

// Load frames so teacher can pick them in the Add Modal
const rawFrames = import.meta.glob('/public/img/frame/**/*.{png,jpg,jpeg,gif,webp}', { eager: true, query: '?url', import: 'default' })
export const availableFrameAssets = Object.keys(rawFrames).map(path => {
  const cleanPath = path.replace('/public', '')
  const filename = path.split('/').pop()
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
  return { path: cleanPath, name: nameWithoutExt, file: filename }
}).filter(f => !f.name.toLowerCase().includes('template'))

export const gachaFolderAssets = {
  boxes: [],
  companions: []
}

Object.keys(rawImages).forEach(path => {
  const cleanPath = path.replace('/public', '') // e.g. "/img/Gacha/AETHERIA/Box.png"
  const filename = path.split('/').pop()
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")

  const folderParts = path.split('/')
  const folderName = folderParts[folderParts.length - 2]

  if (filename.toLowerCase().includes('box')) {
    gachaFolderAssets.boxes.push({
      name: nameWithoutExt,
      file: filename,
      path: cleanPath,
      folder: folderName
    })
  } else {
    let rarity = 'Common'
    let defaultRate = 10
    const lowerName = nameWithoutExt.toLowerCase()
    
    if (lowerName.includes('secret')) { rarity = 'Secret'; defaultRate = 1; }
    else if (lowerName.includes('legendary')) { rarity = 'Legendary'; defaultRate = 3; }
    else if (lowerName.includes('epic')) { rarity = 'Epic'; defaultRate = 7; }
    else if (lowerName.includes('rare')) { rarity = 'Rare'; defaultRate = 10; }
    else if (lowerName.includes('uncommon')) { rarity = 'Uncommon'; defaultRate = 13; }
    else if (lowerName.includes('common')) { rarity = 'Common'; defaultRate = 6; }

    const cleanName = nameWithoutExt.split('-')[0].trim()

    gachaFolderAssets.companions.push({
      name: cleanName,
      rarity,
      file: filename,
      path: cleanPath,
      folder: folderName,
      defaultRate,
      description: 'สหายภูติผู้พิทักษ์ (อัปโหลดจากโฟลเดอร์)'
    })
  }
})

// Mock data removed
const defaultBoxes = []

export const aetheriaBoxPreset = {
  id: 'box-aetheria-companions',
  name: 'AETHERIA Companions (Default Preset)',
  price: 150,
  image: '/img/Gacha/AETHERIA/Box.png',
  description: 'กล่องสุ่มสหายภูติผู้พิทักษ์แห่งอาเธอร์เรีย',
  theme: 'AETHERIA',
  items: []
}

export function fixAssetUrl(url) {
  if (!url || typeof url !== 'string') return url
  const idx = url.indexOf('/assets/')
  if (idx !== -1) {
    const filePart = url.substring(idx + 8)
    return `https://kruboss-classroom.loeitech.ac.th/assets/${filePart}`
  }
  return url
}

export const directShopItems = ref([])

const API_BASE = API_BASE_URL

export async function fetchDirectItems() {
  try {
    const res = await fetch(`${API_BASE}/shop/direct`)
    const data = await res.json()
    directShopItems.value = (data || []).map(it => ({
      ...it,
      image: fixAssetUrl(it.image)
    }))
  } catch (e) {
    console.error('Failed to fetch direct items', e)
  }
}

export async function fetchBoxes() {
  try {
    const res = await fetch(`${API_BASE}/shop/boxes?_t=${Date.now()}`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        const cleaned = data.map(b => ({
          ...b,
          image: fixAssetUrl(b.image),
          items: Array.isArray(b.items) ? b.items.map(it => ({
            ...it,
            image: fixAssetUrl(it.image)
          })) : []
        }))
        if (cleaned.length > 0) {
          boxesList.value = cleaned
          localStorage.removeItem(STORAGE_KEY_BOXES)
        } else {
          // If database is empty, check if browser has old localStorage boxes to auto-migrate once
          const oldSaved = localStorage.getItem(STORAGE_KEY_BOXES)
          if (oldSaved) {
            try {
              const oldBoxes = JSON.parse(oldSaved)
              if (Array.isArray(oldBoxes) && oldBoxes.length > 0) {
                console.log('Migrating localStorage mystery boxes to PostgreSQL database...', oldBoxes)
                for (const b of oldBoxes) {
                  await fetch(`${API_BASE}/shop/boxes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(b)
                  })
                }
                localStorage.removeItem(STORAGE_KEY_BOXES)
                const refetched = await fetch(`${API_BASE}/shop/boxes?_t=${Date.now()}`)
                if (refetched.ok) {
                  boxesList.value = await refetched.json()
                  return
                }
              }
            } catch (err) {
              console.error('Failed to migrate localStorage boxes', err)
            }
          }
          boxesList.value = []
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch boxes from API', e)
  }
}

export async function addDirectItem(item) {
  try {
    const res = await fetch(`${API_BASE}/shop/direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
    const newItem = await res.json()
    if (!res.ok) throw new Error(newItem.error || 'Failed to add item')
    directShopItems.value.unshift(newItem)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function editDirectItem(updatedItem) {
  try {
    const res = await fetch(`${API_BASE}/shop/direct/${encodeURIComponent(updatedItem.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update item')
    const idx = directShopItems.value.findIndex(i => i.id === updatedItem.id)
    if (idx !== -1) {
      directShopItems.value[idx] = { ...directShopItems.value[idx], ...data }
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function removeDirectItem(itemId) {
  try {
    await fetch(`${API_BASE}/shop/direct/${encodeURIComponent(itemId)}`, { method: 'DELETE' })
    directShopItems.value = directShopItems.value.filter(i => i.id !== itemId)
  } catch (e) {
    console.error(e)
  }
}

// Rarity Color & Theme Config
export const rarityConfig = {
  'Special Collection': {
    label: 'พิเศษ (Special Collection)',
    badgeBg: 'bg-indigo-500/25 text-indigo-300 border-indigo-400/60',
    gradient: 'from-indigo-600 via-purple-500 to-fuchsia-500',
    border: 'border-indigo-400 ring-2 ring-indigo-500/40',
    glow: 'shadow-[0_0_40px_rgba(99,102,241,0.9)]',
    textColor: 'text-indigo-400',
    particleColor: 'rgba(99, 102, 241, 0.6)'
  },
  Secret: {
    label: 'ลับเฉพาะ (Secret / Mythic)',
    badgeBg: 'bg-rose-500/25 text-rose-300 border-rose-400/60',
    gradient: 'from-rose-500 via-fuchsia-500 to-amber-300',
    border: 'border-rose-400 ring-2 ring-rose-500/40',
    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.9)]',
    textColor: 'text-rose-400',
    particleColor: '#f43f5e'
  },
  Legendary: {
    label: 'ระดับตำนาน (Legendary)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    border: 'border-amber-400',
    glow: 'shadow-[0_0_35px_rgba(245,158,11,0.7)]',
    textColor: 'text-amber-400',
    particleColor: '#f59e0b'
  },
  Epic: {
    label: 'มหากาพย์ (Epic)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    gradient: 'from-purple-400 via-violet-500 to-indigo-600',
    border: 'border-purple-400',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
    textColor: 'text-purple-400',
    particleColor: '#a855f7'
  },
  Rare: {
    label: 'หายาก (Rare)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    border: 'border-blue-400',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    textColor: 'text-blue-400',
    particleColor: '#3b82f6'
  },
  Uncommon: {
    label: 'พิเศษ (Uncommon)',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
    gradient: 'from-teal-400 via-emerald-500 to-cyan-500',
    border: 'border-teal-400',
    glow: 'shadow-[0_0_25px_rgba(20,184,166,0.5)]',
    textColor: 'text-teal-400',
    particleColor: '#14b8a6'
  },
  Common: {
    label: 'ทั่วไป (Common)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    gradient: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    textColor: 'text-emerald-400',
    particleColor: '#10b981'
  }
}

// -------------------------------------------------------------
// Reactive State
// -------------------------------------------------------------

import { authUser, updateAuthUser } from './authStore'

export const currentRole = computed(() => authUser.value?.role || 'student')

// Keep setRole to not break old code, but it doesn't do anything now
export const setRole = (role) => {
  // Roles are now managed by authStore.js
}

// Currently active user for shop/inventory
export const activeStudentIdForShop = computed(() => {
  return authUser.value?.studentId || authUser.value?.id
})

// Boxes list (Driven directly by PostgreSQL Database)
export const boxesList = ref([])

// Initial fetch from database
fetchBoxes()

export async function resetBoxesToDefault() {
  try {
    for (const box of boxesList.value) {
      await fetch(`${API_BASE}/shop/boxes/${encodeURIComponent(box.id)}`, { method: 'DELETE' })
    }
    if (aetheriaBoxPreset) {
      await saveMysteryBox(aetheriaBoxPreset)
    }
    await fetchBoxes()
  } catch (e) {
    console.error('Failed to reset boxes in database', e)
  }
}

export function saveBoxes() {
  // Deprecated: Boxes are persisted directly into PostgreSQL database
}

// Coins dictionary { [studentId]: coins }
export const studentCoins = ref(loadCoins())

function loadCoins() {
  const saved = localStorage.getItem(STORAGE_KEY_COINS)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse student coins', e)
    }
  }
  // Initial default coins (e.g. give 250 coins to all students)
  const initial = {}
  studentsList.value.forEach(s => {
    initial[s.studentId] = 250
  })
  return initial
}

export function saveCoins() {
  localStorage.setItem(STORAGE_KEY_COINS, JSON.stringify(studentCoins.value))
}

// Inventory dictionary { [studentId]: [ { itemId, boxName, obtainedAt, count, itemDetails } ] }
export const studentInventory = ref(loadInventory())

function loadInventory() {
  const saved = localStorage.getItem(STORAGE_KEY_INVENTORY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse student inventory', e)
    }
  }
  return {}
}

export function saveInventory() {
  localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(studentInventory.value))
}

// Equipment dictionary { [studentId]: { frame: item, pet: item, theme: item } }
export const studentEquipment = ref(loadEquipment())

function loadEquipment() {
  const saved = localStorage.getItem(STORAGE_KEY_EQUIPMENT)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse student equipment', e)
    }
  }
  return {}
}

export function saveEquipment() {
  localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(studentEquipment.value))
}

export function getStudentEquipment(studentId) {
  const student = studentsList.value.find(s => s.studentId === studentId) || authUser.value
  if (!student) return { frame: null, pet: null, theme: null }
  
  let equipment = student.equipment || { frame: null, pet: null, theme: null }
  if (typeof equipment === 'string') {
    try { equipment = JSON.parse(equipment) } catch(e) {}
  }
  return equipment
}

export async function equipItem(studentId, item) {
  const imgStr = item.image || ''
  let itemType = item.itemType
  if (!itemType) {
    if (imgStr.includes('/img/frame/')) itemType = 'frame'
    else if (item.category === 'สัตว์เลี้ยงคู่หู' || imgStr.includes('/img/Gacha/')) itemType = 'pet'
  }

  try {
    const res = await fetch(`${API_BASE}/inventory/equip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, itemType, item })
    })
    const updatedUser = await res.json()
    
    // Update local store
    if (authUser.value?.studentId === studentId) {
      authUser.value = { ...authUser.value, ...updatedUser }
    }
    const idx = studentsList.value.findIndex(s => s.studentId === studentId)
    if (idx !== -1) {
      studentsList.value[idx] = { ...studentsList.value[idx], ...updatedUser }
    }
  } catch (e) {
    console.error('Failed to equip item', e)
  }
}

export async function unequipItem(studentId, itemType) {
  try {
    const res = await fetch(`${API_BASE}/inventory/equip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, itemType, item: null })
    })
    const updatedUser = await res.json()
    
    // Update local store
    if (authUser.value?.studentId === studentId) {
      authUser.value = { ...authUser.value, ...updatedUser }
    }
    const idx = studentsList.value.findIndex(s => s.studentId === studentId)
    if (idx !== -1) {
      studentsList.value[idx] = { ...studentsList.value[idx], ...updatedUser }
    }
  } catch (e) {
    console.error('Failed to unequip item', e)
  }
}

export async function fetchStudentInventory(studentId) {
  try {
    const res = await fetch(`${API_BASE}/inventory/${studentId}`)
    const data = await res.json()
    const inventory = data.map(d => ({
      item: typeof d.itemData === 'string' ? JSON.parse(d.itemData) : d.itemData,
      count: d.count,
      boxName: d.boxName,
      obtainedAt: d.obtainedAt
    }))

    // Inject Teacher frame for teacher role
    const student = studentsList.value.find(s => s.studentId === studentId) 
                    || (authUser.value?.studentId === studentId ? authUser.value : null)
                    || (authUser.value?.id === studentId ? authUser.value : null);
                    
    if (student?.role === 'teacher') {
      const hasTeacherFrame = inventory.find(i => i.item.image === '/img/frame/Teacher.png')
      if (!hasTeacherFrame) {
        inventory.unshift({
          item: {
            id: 'frame-teacher-exclusive',
            name: 'Teacher',
            image: '/img/frame/Teacher.png',
            itemType: 'frame',
            rarity: 'Special Collection',
            description: 'กรอบพิเศษสำหรับอาจารย์ผู้สอนเท่านั้น'
          },
          count: 1,
          boxName: 'System',
          obtainedAt: new Date().toISOString()
        })
      }
    }
    
    studentInventory.value[studentId] = inventory
  } catch (e) {
    console.error('Failed to fetch inventory', e)
  }
}

export async function buyDirectItemAPI(studentId, itemId) {
  try {
    const res = await fetch(`${API_BASE}/shop/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, itemId })
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    
    // Update local coins
    if (authUser.value?.studentId === studentId) {
      authUser.value.coins = data.updatedStudent.coins
    }
    const idx = studentsList.value.findIndex(s => s.studentId === studentId)
    if (idx !== -1) {
      studentsList.value[idx].coins = data.updatedStudent.coins
    }
    
    // Refresh inventory
    await fetchStudentInventory(studentId)
    return true
  } catch (e) {
    console.error('Failed to buy item', e)
    return false
  }
}


// -------------------------------------------------------------
// Methods & Actions
// -------------------------------------------------------------

export function getStudentCoins(studentId) {
  // Use id instead of studentId if studentId passed is actually the integer ID? 
  // We use studentId (the boss string) mostly.
  const student = studentsList.value.find(s => s.studentId === studentId) || (authUser.value?.studentId === studentId ? authUser.value : (authUser.value?.id === studentId ? authUser.value : null))
  if (student && student.coins !== undefined) {
    return student.coins
  }
  return 0
}

export async function addCoins(studentId, amount) {
  const current = getStudentCoins(studentId)
  const newCoins = Math.max(0, current + Number(amount))
  
  try {
    const res = await fetch(`${API_BASE}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins: newCoins })
    })
    const updatedUser = await res.json()
    const targetCoins = updatedUser.coins !== undefined ? updatedUser.coins : newCoins
    if (authUser.value?.studentId === studentId || authUser.value?.id === studentId) {
      updateAuthUser({ coins: targetCoins })
    }
    const idx = studentsList.value.findIndex(s => s.studentId === studentId || s.id === studentId)
    if (idx !== -1) {
      studentsList.value[idx] = { ...studentsList.value[idx], coins: targetCoins }
    }
    studentCoins.value[studentId] = targetCoins
    saveCoins()
    return targetCoins
  } catch(e) {
    console.error('Failed to add coins:', e)
    return current
  }
}

export async function deductCoins(studentId, amount) {
  const current = getStudentCoins(studentId)
  if (current < amount) return false
  const newCoins = Math.max(0, current - Number(amount))
  
  try {
    const res = await fetch(`${API_BASE}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins: newCoins })
    })
    const updatedUser = await res.json()
    const targetCoins = updatedUser.coins !== undefined ? updatedUser.coins : newCoins
    if (authUser.value?.studentId === studentId || authUser.value?.id === studentId) {
      updateAuthUser({ coins: targetCoins })
    }
    const idx = studentsList.value.findIndex(s => s.studentId === studentId || s.id === studentId)
    if (idx !== -1) {
      studentsList.value[idx] = { ...studentsList.value[idx], coins: targetCoins }
    }
    studentCoins.value[studentId] = targetCoins
    saveCoins()
    return true
  } catch(e) {
    console.error('Failed to deduct coins:', e)
    return false
  }
}

export function getStudentItems(studentId) {
  return studentInventory.value[studentId] || []
}

export async function giveItemToStudent(studentId, item, boxName = 'เควสต์และภารกิจ', boxId = 'quest') {
  if (!studentInventory.value[studentId]) {
    studentInventory.value[studentId] = []
  }
  const existingInInventory = studentInventory.value[studentId].find(i => i.item?.id === item.id)
  if (existingInInventory) {
    existingInInventory.count += 1
  } else {
    studentInventory.value[studentId].push({
      item,
      obtainedAt: new Date().toISOString(),
      count: 1,
      boxName,
      boxId
    })
  }
  saveInventory()

  try {
    await fetch(`${API_BASE}/inventory/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        itemId: item.id,
        item,
        boxName,
        boxId
      })
    })
    await fetchStudentInventory(studentId)
  } catch (e) {
    console.error('Failed to sync granted item to API', e)
  }
}

// Add or edit a box (Role Teacher) - Direct to PostgreSQL Database
export async function saveMysteryBox(boxData) {
  const newBox = {
    ...boxData,
    id: (boxData.id && String(boxData.id).trim()) || `box-${Date.now()}`
  }

  try {
    const res = await fetch(`${API_BASE}/shop/boxes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBox)
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to save box to database')
    }

    const saved = await res.json()
    const existingIdx = boxesList.value.findIndex(b => b.id === saved.id)
    if (existingIdx !== -1) {
      boxesList.value[existingIdx] = saved
    } else {
      boxesList.value.push(saved)
    }
    return saved
  } catch (e) {
    console.error('Failed to sync mystery box to API', e)
    throw e
  }
}

// Delete a box (Role Teacher) - Direct to PostgreSQL Database
export async function deleteMysteryBox(boxId) {
  try {
    const res = await fetch(`${API_BASE}/shop/boxes/${encodeURIComponent(boxId)}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      throw new Error('Failed to delete mystery box from database')
    }
    boxesList.value = boxesList.value.filter(b => b.id !== boxId)
    return true
  } catch (e) {
    console.error('Failed to delete mystery box via API', e)
    throw e
  }
}

// Gacha Pull Algorithm: Weighted Random Selection
export async function drawGacha(boxId, studentId) {
  const box = boxesList.value.find(b => b.id === boxId)
  if (!box) {
    return { success: false, message: 'ไม่พบกล่องสุ่มนี้ในระบบ' }
  }

  // Check coins locally first
  const currentCoins = getStudentCoins(studentId)
  if (currentCoins < box.price) {
    return { 
      success: false, 
      message: `เหรียญ Coin ไม่เพียงพอ (ต้องการ ${box.price} Coins แต่มีเพียง ${currentCoins} Coins)` 
    }
  }

  // Deduct coins
  const success = await deductCoins(studentId, box.price)
  if (!success) {
    return { 
      success: false, 
      message: 'การหักเหรียญ Coin ผิดพลาด' 
    }
  }

  // Calculate total drop weight
  const items = box.items || []
  if (items.length === 0) {
    return { success: false, message: 'กล่องนี้ยังไม่มีรายการของรางวัลข้างใน' }
  }

  const totalRate = items.reduce((sum, item) => sum + Number(item.rate || 1), 0)
  const randomVal = Math.random() * totalRate

  let cumulative = 0
  let selectedItem = items[0]

  for (const item of items) {
    cumulative += Number(item.rate || 1)
    if (randomVal <= cumulative) {
      selectedItem = item
      break
    }
  }

  // Add to inventory
  if (!studentInventory.value[studentId]) {
    studentInventory.value[studentId] = []
  }

  const refundMultiplier = {
    'Common': 0.1,
    'Uncommon': 0.2,
    'Rare': 0.3,
    'Epic': 0.4,
    'Legendary': 0.5,
    'Secret': 1.0
  }

  let isDuplicate = false
  let refundCoins = 0

  const existingInInventory = studentInventory.value[studentId]?.find(i => i.item.id === selectedItem.id)
  if (existingInInventory) {
    isDuplicate = true
    const mult = refundMultiplier[selectedItem.rarity] || 0.1
    refundCoins = Math.max(1, Math.round(box.price * mult))
    
    await addCoins(studentId, refundCoins)
  }

  // Add to Backend Inventory
  try {
    await fetch(`${API_BASE}/inventory/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        itemId: selectedItem.id,
        item: selectedItem,
        boxName: box.name,
        boxId: box.id
      })
    })
    // Refresh local inventory from API
    await fetchStudentInventory(studentId)
  } catch(e) {
    console.error('Failed to add gacha item to API', e)
  }

  return {
    success: true,
    item: selectedItem,
    box,
    isDuplicate,
    refundCoins,
    remainingCoins: getStudentCoins(studentId)
  }
}

// Test Gacha Pull (No Coins Deducted, No Inventory Saved)
export function testDrawGacha(boxId) {
  const box = boxesList.value.find(b => b.id === boxId)
  if (!box) {
    return { success: false, message: 'ไม่พบกล่องสุ่มนี้ในระบบ' }
  }

  const items = box.items || []
  if (items.length === 0) {
    return { success: false, message: 'กล่องนี้ยังไม่มีรายการของรางวัลข้างใน' }
  }

  const totalRate = items.reduce((sum, item) => sum + Number(item.rate || 1), 0)
  const randomVal = Math.random() * totalRate

  let cumulative = 0
  let selectedItem = items[0]

  for (const item of items) {
    cumulative += Number(item.rate || 1)
    if (randomVal <= cumulative) {
      selectedItem = item
      break
    }
  }

  return {
    success: true,
    item: selectedItem,
    box,
    isDuplicate: false,
    refundCoins: 0,
    remainingCoins: getStudentCoins('test')
  }
}

export const buyDirectItem = (studentId, item) => {
  const currentCoins = getStudentCoins(studentId)
  if (currentCoins < item.price) {
    return { success: false, message: 'เหรียญทองไม่พอสำหรับการซื้อไอเทมนี้' }
  }

  // Add to inventory
  if (!studentInventory.value[studentId]) {
    studentInventory.value[studentId] = []
  }

  // Check if they already own it
  const isDuplicate = studentInventory.value[studentId].some(i => i.item.id === item.id)
  if (isDuplicate) {
    return { success: false, message: 'นักศึกษามีไอเทมชิ้นนี้อยู่แล้ว!' }
  }

  // Deduct price
  studentCoins.value[studentId] = currentCoins - item.price
  saveCoins()

  // Add to inventory
  studentInventory.value[studentId].push({
    item: item,
    boxName: 'ร้านค้าโดยตรง',
    boxId: 'direct',
    count: 1,
    obtainedAt: new Date().toISOString(),
    lastObtainedAt: new Date().toISOString()
  })

  saveInventory()

  return { success: true, item: item, remainingCoins: getStudentCoins(studentId) }
}
