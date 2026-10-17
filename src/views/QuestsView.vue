<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { questsList, saveQuest, deleteQuest, approveQuestForStudent, getStudentQuestCompletions, fetchQuests, fetchQuestProgress } from '../data/questsStore'
import { authUser } from '../data/authStore'
import { studentsList, isStudent } from '../data/studentsStore'
import { directShopItems } from '../data/shopStore'
import { Target, Plus, CheckCircle, Edit, Trash2, ShieldAlert, Coins, Gift, Search, X, Check, Image as ImageIcon, BadgeCheck } from '@lucide/vue'

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})
const activeStudentId = computed(() => authUser.value?.studentId || authUser.value?.id)

onMounted(() => {
  fetchQuests()
  if (activeStudentId.value && !isTeacher.value) {
    fetchQuestProgress(activeStudentId.value)
  }
})

watch(activeStudentId, (newId) => {
  if (newId && !isTeacher.value) {
    fetchQuestProgress(newId)
  }
})

// Modals state
const showAddModal = ref(false)
const showAwardModal = ref(false)
const editingQuest = ref(null)
const awardingQuest = ref(null)

// Add/Edit Quest Form
const formData = ref({
  id: '',
  title: '',
  description: '',
  maxCompletions: 1,
  isActive: true,
  rewards: [{ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' }]
})

const openAddModal = () => {
  editingQuest.value = null
  formData.value = {
    id: '',
    title: '',
    description: '',
    maxCompletions: 1,
    isActive: true,
    rewards: [{ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' }]
  }
  showAddModal.value = true
}

const openEditModal = (quest) => {
  editingQuest.value = quest
  formData.value = JSON.parse(JSON.stringify(quest))
  showAddModal.value = true
}

const handleSaveQuest = async () => {
  await saveQuest(formData.value)
  showAddModal.value = false
}

const handleDeleteQuest = (id) => {
  if (confirm('คุณต้องการลบภารกิจนี้ใช่หรือไม่?')) {
    deleteQuest(id)
  }
}

// Awarding Quest Form
const selectedStudentId = ref('')
const studentSearchQuery = ref('')
const awardMessage = ref('')
const awardError = ref('')

const filteredStudents = computed(() => {
  if (!studentSearchQuery.value) return studentsList.value.filter(s => isStudent(s))
  const query = studentSearchQuery.value.toLowerCase()
  return studentsList.value.filter(s =>
    isStudent(s) &&
    (s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query))
  )
})

const openAwardModal = (quest) => {
  awardingQuest.value = quest
  selectedStudentId.value = ''
  studentSearchQuery.value = ''
  awardMessage.value = ''
  awardError.value = ''
  showAwardModal.value = true
}

const handleAwardQuest = () => {
  awardMessage.value = ''
  awardError.value = ''

  if (!selectedStudentId.value) {
    awardError.value = 'กรุณาเลือกนักศึกษา'
    return
  }

  const res = approveQuestForStudent(selectedStudentId.value, awardingQuest.value.id)
  if (res.success) {
    awardMessage.value = 'มอบรางวัลให้นักศึกษาสำเร็จ!'
    setTimeout(() => {
      showAwardModal.value = false
    }, 1500)
  } else {
    awardError.value = res.message
  }
}

// Helpers
const getRewardIcon = (type) => {
  if (type === 'coin') return Coins
  if (type === 'frame') return ImageIcon
  return Gift
}

const getRewardImage = (reward) => {
  if (reward.type === 'frame' && reward.itemId) {
    const item = directShopItems.value.find(i => i.id === reward.itemId)
    return item ? item.image : null
  }
  return null
}
</script>

<template>
  <div class="space-y-6 animate-[fadeIn_0.5s_ease-out]">

    <!-- Header -->
    <div
      class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
      <!-- Decorative background -->
      <div
        class="absolute -right-20 -top-20 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse">
      </div>
      <div
        class="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style="animation-delay: 2s;"></div>

      <div class="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3 drop-shadow-md">
            <Target class="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400" />
            ภารกิจประจำสัปดาห์
          </h1>
          <p class="text-indigo-200 text-sm sm:text-base max-w-lg font-medium drop-shadow">
            ทำภารกิจที่ได้รับมอบหมายแล้วส่งหลักฐานให้ครูผู้สอนเพื่อรับรางวัลสุดพิเศษ
          </p>
        </div>

        <div v-if="isTeacher">
          <button @click="openAddModal"
            class="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer">
            <Plus class="w-5 h-5" /> สร้างภารกิจใหม่
          </button>
        </div>
      </div>
    </div>

    <!-- Quests List -->
    <div class="flex flex-col gap-4 w-full">
      <div v-if="questsList.length === 0"
        class="py-16 text-center text-stone-400 bg-white rounded-3xl border-2 border-dashed border-stone-200">
        <Target class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p class="text-xl font-bold">ยังไม่มีภารกิจในขณะนี้</p>
        <p class="text-sm mt-2">โปรดรอครูผู้สอนเพิ่มภารกิจประจำสัปดาห์</p>
      </div>

      <div v-for="quest in questsList" :key="quest.id"
        class="rounded-[2rem] p-4 sm:p-5 border-2 transition-all duration-300 w-full"
        :class="[
          !isTeacher && getStudentQuestCompletions(activeStudentId, quest.id) >= quest.maxCompletions 
            ? 'bg-[#e5f4d3] border-transparent' 
            : 'bg-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative group hover:-translate-y-1 ' + (quest.isActive ? 'border-indigo-100 hover:border-indigo-300 shadow-indigo-100/30' : 'border-stone-200 opacity-60')
        ]">

        <!-- COMPLETED STUDENT VIEW -->
        <template v-if="!isTeacher && getStudentQuestCompletions(activeStudentId, quest.id) >= quest.maxCompletions">
          <div class="flex items-center gap-4 px-1 py-1 sm:px-2 w-full relative group/complete cursor-default">
            
            <div class="shrink-0 flex items-center justify-center text-[#55b359] relative">
              <!-- Pulsing glow behind the badge -->
              <div class="absolute inset-0 bg-[#55b359] blur-md opacity-40 animate-pulse rounded-full"></div>
              
              <!-- Badge with slight hover pop and spin -->
              <BadgeCheck class="w-10 h-10 relative z-10 transition-transform duration-500 group-hover/complete:scale-110 group-hover/complete:rotate-[15deg]" fill="currentColor" stroke="#e5f4d3" stroke-width="2.5" />
            </div>

            <div class="flex-1 w-full relative z-10">
              <h3 class="font-black text-lg sm:text-xl text-[#469e4a] transition-all duration-300 group-hover/complete:translate-x-1 drop-shadow-sm">{{ quest.title }}</h3>
            </div>
          </div>
        </template>

        <!-- TEACHER VIEW OR IN-PROGRESS STUDENT VIEW -->
        <template v-else>
          <!-- Left: Icon -->
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner bg-indigo-100 text-indigo-500">
            <Target class="w-8 h-8" />
          </div>

          <!-- Middle: Info & Progress -->
          <div class="flex-1 w-full relative">
            <span v-if="!quest.isActive"
              class="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px] font-bold mb-1">
              ปิดรับภารกิจ
            </span>
            <h3 class="font-black text-lg sm:text-xl text-stone-800 leading-tight mb-2">{{ quest.title }}</h3>

            <div class="flex items-center gap-3 mt-1">
              <!-- Progress text & bar -->
              <div
                class="flex-1 max-w-[200px] flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200/60">
                <span class="text-[11px] font-black text-stone-600 w-8 text-right shrink-0">
                  {{ !isTeacher ? getStudentQuestCompletions(activeStudentId, quest.id) : '0' }} / {{ quest.maxCompletions }}
                </span>
                <div class="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 transition-all duration-500 rounded-full"
                    :style="`width: ${Math.min(100, (!isTeacher ? getStudentQuestCompletions(activeStudentId, quest.id) : 0) / quest.maxCompletions * 100)}%`">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Actions & Rewards -->
          <div class="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <template v-if="isTeacher">
              <button @click="openAwardModal(quest)"
                class="px-5 py-2.5 bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 text-sm font-black rounded-xl transition-colors cursor-pointer w-full sm:w-auto text-center border border-stone-200 hover:border-emerald-200 shadow-sm">
                ตรวจภารกิจ
              </button>
              <div class="flex gap-1 justify-end w-full">
                <button @click="openEditModal(quest)"
                  class="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDeleteQuest(quest.id)"
                  class="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-end">
                <!-- Reward Card -->
                <div class="flex flex-row items-center gap-2">
                  <div v-for="(reward, idx) in quest.rewards" :key="idx"
                    class="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-2xl p-2 w-16 h-16 shadow-sm relative group overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img v-if="getRewardImage(reward)" :src="getRewardImage(reward)" class="w-7 h-7 object-contain mb-1 relative z-10 drop-shadow-sm" />
                    <span v-else-if="reward.type === 'coin'" class="text-2xl mb-1 relative z-10 leading-none">🪙</span>
                    <component v-else :is="getRewardIcon(reward.type)" class="w-6 h-6 text-amber-500 mb-1 relative z-10" />
                    <span class="text-[10px] font-black text-stone-600 relative z-10 mt-0.5">x{{ reward.type === 'coin' ? (reward.amount || 1) : 1 }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Modals -->

    <!-- Add/Edit Quest Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
        <div
          class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div
            class="px-6 py-5 bg-gradient-to-r from-indigo-800 to-purple-900 text-white flex justify-between items-center shrink-0">
            <h3 class="font-black text-lg flex items-center gap-2">
              <Target class="w-5 h-5 text-fuchsia-400" />
              {{ editingQuest ? 'แก้ไขภารกิจ' : 'สร้างภารกิจใหม่' }}
            </h3>
            <button @click="showAddModal = false" class="text-white/60 hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSaveQuest" class="p-6 overflow-y-auto space-y-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">ชื่อภารกิจ</label>
              <input v-model="formData.title" type="text" required placeholder="เช่น ส่งงานตรงเวลา 3 ครั้ง"
                class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">รายละเอียด</label>
              <textarea v-model="formData.description" required rows="2" placeholder="อธิบายเงื่อนไขภารกิจ..."
                class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">จำนวนครั้งที่ทำได้ (ต่อคน)</label>
                <input v-model.number="formData.maxCompletions" type="number" min="1" required
                  class="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div class="flex items-center pt-6">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.isActive" class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner">
                  </div>
                  <span class="ml-3 text-sm font-bold text-stone-700">เปิดใช้งานภารกิจนี้</span>
                </label>
              </div>
            </div>

            <!-- Rewards Section -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Gift class="w-4 h-4" /> ของรางวัล (สามารถให้ได้หลายชิ้น)
                </p>
                <button type="button"
                  @click="formData.rewards.push({ type: 'coin', amount: 50, itemId: '', name: 'เหรียญ 50 Coins' })"
                  class="text-[10px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                  <Plus class="w-3 h-3" /> เพิ่มรางวัล
                </button>
              </div>

              <div v-for="(reward, index) in formData.rewards" :key="index"
                class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative group transition-all flex gap-4">

                <button v-if="formData.rewards.length > 1" type="button" @click="formData.rewards.splice(index, 1)"
                  class="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer z-10"
                  title="ลบรางวัลนี้">
                  <Trash2 class="w-4 h-4" />
                </button>

                <!-- Reward Preview -->
                <div class="w-16 h-16 shrink-0 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-sm relative overflow-hidden mt-1">
                  <div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent"></div>
                  <img v-if="getRewardImage(reward)" :src="getRewardImage(reward)" class="w-8 h-8 object-contain mb-1 relative z-10 drop-shadow-sm" />
                  <span v-else-if="reward.type === 'coin'" class="text-2xl mb-1 relative z-10 leading-none">🪙</span>
                  <component v-else :is="getRewardIcon(reward.type)" class="w-7 h-7 text-amber-500 mb-1 relative z-10" />
                  <span class="text-[10px] font-black text-indigo-900 relative z-10 leading-none">x{{ reward.type === 'coin' ? (reward.amount || 1) : 1 }}</span>
                </div>

                <div class="flex-1 space-y-3 pr-6">
                  <div>
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">ประเภทของรางวัล</label>
                    <select v-model="reward.type"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none">
                      <option value="coin">เหรียญ (Coins)</option>
                      <option value="frame">ไอเทม/กรอบรูป (จากร้านค้า)</option>
                    </select>
                  </div>

                  <div v-if="reward.type === 'coin'">
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">จำนวนเหรียญ</label>
                    <input v-model.number="reward.amount" type="number" min="1"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none" />
                  </div>

                  <div v-if="reward.type === 'frame'">
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">เลือกไอเทม</label>
                    <select v-model="reward.itemId"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none">
                      <option value="" disabled>-- เลือกไอเทม --</option>
                      <option v-for="item in directShopItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[10px] font-bold text-indigo-700 mb-1">ชื่อที่แสดงให้ผู้เรียนเห็น</label>
                    <input v-model="reward.name" type="text" placeholder="เช่น เหรียญ 50 Coins"
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" @click="showAddModal = false"
                class="px-4 py-2 rounded-xl text-stone-500 font-bold hover:bg-stone-100 cursor-pointer">ยกเลิก</button>
              <button type="submit"
                class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-2">
                <Check class="w-4 h-4" /> บันทึกภารกิจ
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Award Quest Modal -->
    <Teleport to="body">
      <div v-if="showAwardModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="showAwardModal = false"></div>
        <div
          class="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[75vh] animate-[bounceIn_0.3s_ease-out]">
          <div class="px-6 py-5 bg-emerald-600 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 class="font-black text-lg flex items-center gap-2">
                <CheckCircle class="w-5 h-5" />
                มอบรางวัล: {{ awardingQuest?.title }}
              </h3>
            </div>
            <button @click="showAwardModal = false" class="text-white/60 hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 flex-1 overflow-hidden flex flex-col bg-stone-50">

            <div v-if="awardError"
              class="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0">
              <ShieldAlert class="w-4 h-4" /> {{ awardError }}
            </div>

            <div v-if="awardMessage"
              class="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0">
              <Check class="w-4 h-4" /> {{ awardMessage }}
            </div>

            <div v-if="!awardMessage" class="flex-1 flex flex-col min-h-0">
              <!-- Search -->
              <div class="mb-4 relative shrink-0">
                <Search class="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                <input v-model="studentSearchQuery" type="text" placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..."
                  class="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
              </div>

              <!-- Grid -->
              <div class="flex-1 overflow-y-auto pr-2 no-scrollbar">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="student in filteredStudents" :key="student.studentId"
                    @click="selectedStudentId = student.studentId"
                    class="bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer flex items-center gap-3 shadow-sm"
                    :class="selectedStudentId === student.studentId ? 'border-emerald-500 bg-emerald-50' : 'border-stone-100 hover:border-emerald-200'">
                    <div class="relative w-10 h-10 shrink-0">
                      <img v-if="student.equippedFrame" :src="student.equippedFrame"
                        class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-sm z-10" />
                      <div
                        class="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden border border-emerald-200 relative z-0">
                        <img v-if="student.avatar && (student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.includes('localhost') || student.avatar.startsWith('data:'))"
                          :src="student.avatar.startsWith('http') ? student.avatar : (student.avatar.startsWith('data:') ? student.avatar : `http://${student.avatar}`)" class="w-full h-full object-cover object-top" />
                        <span v-else>{{ student.avatar || 'น' }}</span>
                      </div>
                    </div>
                    <div class="overflow-hidden">
                      <p class="text-xs font-bold text-stone-800 truncate">{{ student.name }}</p>
                      <p class="text-[10px] text-stone-500 font-mono">{{ student.studentId }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="filteredStudents.length === 0" class="py-10 text-center text-stone-400">
                  <Search class="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p class="font-bold text-sm">ไม่พบรายชื่อนักศึกษา</p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-white border-t border-stone-100 flex justify-end gap-3 shrink-0">
            <button @click="showAwardModal = false"
              class="px-5 py-2.5 rounded-xl text-stone-500 font-bold hover:bg-stone-100 cursor-pointer text-sm">
              {{ awardMessage ? 'ปิดหน้าต่าง' : 'ยกเลิก' }}
            </button>
            <button v-if="!awardMessage" @click="handleAwardQuest" :disabled="!selectedStudentId"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50 text-sm">
              <Gift class="w-4 h-4" /> ยืนยันมอบรางวัล
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
