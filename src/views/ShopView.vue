<script setup>
import { ref, computed, nextTick } from 'vue'
import { celebrate } from '../composables/celebration'
import PurchaseCelebration from '../components/PurchaseCelebration.vue'
import {
  Package,
  Sparkles,
  Plus,
  Trophy,
  Flame,
  RotateCcw,
  Coins,
  Info,
  Trash2,
  Pencil,
  Eye,
  Check,
  User,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  X,
  ArrowDownAZ,
  ArrowUpAZ
} from '@lucide/vue'
import {
  boxesList,
  currentRole,
  setRole,
  activeStudentIdForShop,
  getStudentCoins,
  addCoins,
  drawGacha,
  testDrawGacha,
  getStudentItems,
  deleteMysteryBox,
  rarityConfig,
  resetBoxesToDefault,
  directShopItems,
  buyDirectItemAPI,
  addDirectItem,
  editDirectItem,
  removeDirectItem,
  fetchDirectItems,
  fetchBoxes
} from '../data/shopStore'
import { studentsList, isStudent } from '../data/studentsStore'
import { authUser } from '../data/authStore'
import GachaModal from '../components/GachaModal.vue'
import AddBoxModal from '../components/AddBoxModal.vue'
import AddDirectItemModal from '../components/AddDirectItemModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { onMounted } from 'vue'

onMounted(() => {
  fetchDirectItems()
  fetchBoxes()
})

// Confirm Modal State
const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'confirm',
  onConfirm: null
})

const showConfirm = (title, message, type, onConfirm) => {
  confirmState.value = {
    isOpen: true,
    title,
    message,
    type,
    onConfirm
  }
}

const handleConfirm = () => {
  if (confirmState.value.onConfirm) {
    confirmState.value.onConfirm()
  }
}

// Current active view tab: 'boxes' | 'inventory'
const activeTab = ref('direct')
const teacherItemFilter = ref('all') // 'all', 'on_sale', 'hidden'

// Modals State
const showAddModal = ref(false)
const boxToEdit = ref(null)

const showAddDirectItemModal = ref(false)

const showGachaModal = ref(false)
const activeBoxForGacha = ref(null)
const drawnResultItem = ref(null)
const drawnIsDuplicate = ref(false)
const drawnRefundCoins = ref(0)

// Drop Rate Info Modal
const showRateModal = ref(false)
const selectedBoxForRate = ref(null)

const sortedRateItems = computed(() => {
  if (!selectedBoxForRate.value || !selectedBoxForRate.value.items) return []
  const order = { 'Special Collection': 0, 'Secret': 1, 'Legendary': 2, 'Epic': 3, 'Rare': 4, 'Uncommon': 5, 'Common': 6 }
  return [...selectedBoxForRate.value.items].sort((a, b) => {
    return (order[a.rarity] || 99) - (order[b.rarity] || 99)
  })
})

// Quick Coin Grant Modal for Teacher
const showGrantCoinModal = ref(false)
const coinGrantAmount = ref(100)
const selectedStudentToGrant = ref(activeStudentIdForShop.value)

// Direct Shop Sorting & Preview
const directSortMode = ref('desc') // 'desc' = High -> Low rarity, 'asc' = Low -> High rarity
const showPreviewModal = ref(false)
const previewItem = ref(null)

const sortedDirectItems = computed(() => {
  const order = { 'Special Collection': 0, 'Secret': 1, 'Legendary': 2, 'Epic': 3, 'Rare': 4, 'Uncommon': 5, 'Common': 6 }
  let items = [...directShopItems.value]

  if (currentRole.value !== 'teacher') {
    items = items.filter(i => i.isSale !== false)
  } else {
    if (teacherItemFilter.value === 'on_sale') {
      items = items.filter(i => i.isSale !== false)
    } else if (teacherItemFilter.value === 'hidden') {
      items = items.filter(i => i.isSale === false)
    }
  }

  return items.sort((a, b) => {
    const rankA = order[a.rarity] ?? 99
    const rankB = order[b.rarity] ?? 99
    if (rankA !== rankB) {
      return directSortMode.value === 'desc' ? rankA - rankB : rankB - rankA
    }
    return b.price - a.price
  })
})

const handlePreviewItem = (item) => {
  previewItem.value = item
  showPreviewModal.value = true
}

// Inventory Rarity Filter
const selectedRarityFilter = ref('all')

const currentStudent = computed(() => {
  return authUser.value || studentsList.value[0]
})

const currentCoins = computed(() => {
  return getStudentCoins(activeStudentIdForShop.value)
})

const studentInventoryList = computed(() => {
  const items = getStudentItems(activeStudentIdForShop.value)
  if (selectedRarityFilter.value === 'all') return items
  return items.filter(i => i.item.rarity === selectedRarityFilter.value)
})

const isItemOwned = (itemId) => {
  const items = getStudentItems(activeStudentIdForShop.value)
  return items.some(inv => inv.item && inv.item.id === itemId)
}

// Actions
const openAddBoxModal = () => {
  boxToEdit.value = null
  showAddModal.value = true
}

const openEditBoxModal = (box) => {
  boxToEdit.value = box
  showAddModal.value = true
}

const handleBoxSaved = async () => {
  showAddModal.value = false
  boxToEdit.value = null
  await fetchBoxes()
}

const handleDeleteBox = (boxId) => {
  showConfirm(
    'ยืนยันการลบกล่อง',
    'คุณต้องการลบกล่องสุ่มนี้จากฐานข้อมูลใช่หรือไม่?',
    'danger',
    async () => {
      try {
        await deleteMysteryBox(boxId)
        await fetchBoxes()
      } catch (e) {
        showConfirm('เกิดข้อผิดพลาด', 'ไม่สามารถลบกล่องสุ่มได้: ' + (e.message || 'Server error'), 'alert', null)
      }
    }
  )
}

const openRateInfo = (box) => {
  selectedBoxForRate.value = box
  showRateModal.value = true
}

// Perform Gacha Opening
const handleOpenBox = async (box) => {
  const result = await drawGacha(box.id, activeStudentIdForShop.value)
  if (!result.success) {
    showConfirm('เกิดข้อผิดพลาด', result.message, 'alert', null)
    return
  }
  activeBoxForGacha.value = box
  drawnResultItem.value = result.item
  drawnIsDuplicate.value = result.isDuplicate || false
  drawnRefundCoins.value = result.refundCoins || 0
  showGachaModal.value = true
}

// Perform Test Gacha Opening (No Coins, No Save)
const handleTestOpenBox = (box) => {
  const result = testDrawGacha(box.id)
  if (!result.success) {
    showConfirm('เกิดข้อผิดพลาด', result.message, 'alert', null)
    return
  }
  activeBoxForGacha.value = box
  drawnResultItem.value = result.item
  drawnIsDuplicate.value = result.isDuplicate || false
  drawnRefundCoins.value = result.refundCoins || 0
  showGachaModal.value = true
}

const handleDrawAgain = async () => {
  if (!activeBoxForGacha.value) return
  const box = activeBoxForGacha.value
  showGachaModal.value = false
  await nextTick()
  handleOpenBox(box)
}

const grantCoinsToStudent = () => {
  addCoins(selectedStudentToGrant.value, coinGrantAmount.value)
  showGrantCoinModal.value = false
}

const handleResetAetheria = () => {
  showConfirm(
    'ยืนยันการรีเซ็ต',
    'ต้องการรีเซ็ตและบันทึกกล่อง AETHERIA ลงฐานข้อมูลใช่หรือไม่?',
    'danger',
    async () => {
      await resetBoxesToDefault()
      await fetchBoxes()
    }
  )
}

// Buy Direct Item
const handleBuyDirect = (item) => {
  showConfirm(
    'ยืนยันการซื้อ',
    `คุณต้องการซื้อ "${item.name}" ในราคา ${item.price} เหรียญ ใช่หรือไม่?`,
    'confirm',
    async () => {
      const res = await buyDirectItemAPI(activeStudentIdForShop.value, item.id)
      if (res) {
        celebrate(item.rarity, item.name, item.image)
      } else {
        showConfirm('เกิดข้อผิดพลาด', 'เหรียญไม่พอ หรือคุณมีไอเทมนี้อยู่แล้ว', 'alert', null)
      }
    }
  )
}

const testBuySuccess = (rarity) => {
  // Use a generic placeholder image for testing
  const dummyImage = '/img/frame/Valorant.png'
  celebrate(rarity, `ไอเทมทดสอบ (${rarity})`, dummyImage)
}

const handleRemoveDirectItem = (itemId) => {
  showConfirm(
    'ยืนยันการลบไอเทม',
    'คุณต้องการลบไอเทมนี้ออกจากร้านค้าแฟชั่นใช่หรือไม่?',
    'danger',
    () => removeDirectItem(itemId)
  )
}

const itemToEdit = ref(null)

const handleEditDirectItem = (item) => {
  itemToEdit.value = { ...item }
  showAddDirectItemModal.value = true
}

const handleToggleSaleStatus = (item) => {
  showConfirm(
    item.isSale === false ? 'ยืนยันการเปิดขาย' : 'ยืนยันการปิดการขาย',
    item.isSale === false
      ? `คุณต้องการเปิดขายไอเทม "${item.name}" ให้นักศึกษาเห็นใช่หรือไม่?`
      : `คุณต้องการปิดการขายไอเทม "${item.name}" (ซ่อนจากนักศึกษา) ใช่หรือไม่?`,
    'confirm',
    () => {
      // Toggle it via shopStore or manually mutate here and save
      item.isSale = item.isSale === false ? true : false
      editDirectItem(item)
    }
  )
}

const handleSaveDirectItem = (itemData) => {
  if (itemToEdit.value && itemToEdit.value.id === itemData.id) {
    editDirectItem(itemData)
    showConfirm('สำเร็จ', 'แก้ไขไอเทมเรียบร้อยแล้ว', 'confirm', null)
  } else {
    addDirectItem(itemData)
    showConfirm('สำเร็จ', 'เพิ่มไอเทมในร้านค้าแฟชั่นเรียบร้อยแล้ว', 'confirm', null)
  }
  itemToEdit.value = null
}

const TIERS = {
  Common: { key: 'common', stars: 1, particles: 0, tilt: false },
  Epic: { key: 'epic', stars: 2, particles: 0, tilt: false },
  Legendary: { key: 'legendary', stars: 3, particles: 10, tilt: true },
  Secret: { key: 'secret', stars: 4, particles: 12, tilt: true },
  'Special Collection': { key: 'special', stars: 5, particles: 14, tilt: true },
}
const tier = (item) => TIERS[item.rarity] ?? TIERS.Common

const particleStyle = (n) => ({
  '--x': `${((n * 37 + 11) % 92) + 4}%`,
  '--y': `${((n * 53 + 7) % 88) + 4}%`,
  '--s': `${3 + (n % 3) * 2}px`,
  '--d': `${2.6 + (n % 4) * 0.7}s`,
  '--delay': `${-((n * 0.55) % 4)}s`,
})

const onTilt = (e, item) => {
  if (!tier(item).tilt || e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${px * 100}%`)
  el.style.setProperty('--my', `${py * 100}%`)
  el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`)
  el.style.setProperty('--ry', `${(px - 0.5) * 12}deg`)
}
const resetTilt = (e) => {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  el.style.setProperty('--mx', '50%')
  el.style.setProperty('--my', '50%')
}
</script>

<template>
  <div class="space-y-6 animate-[fadeIn_0.4s_ease-out]">

    <!-- ============================================== -->
    <!-- TOP HEADER: TITLE, COIN WALLET & ROLE TOGGLE   -->
    <!-- ============================================== -->
    <div
      class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border border-stone-800 shadow-2xl relative overflow-hidden">

      <!-- Ambient Glow -->
      <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

        <!-- Left: Title -->
        <div class="space-y-1.5 max-w-xl">
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <ShoppingBag class="w-3.5 h-3.5" />
              ระบบร้านค้าและกล่องสุ่มกาชา (Mystery Box Shop)
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>ร้านค้าไอเทมและกาชาปอง</span>
          </h2>
          <p class="text-xs sm:text-sm text-stone-400 leading-relaxed">
            สะสมเหรียญ Coin จากการเรียนและการทำกิจกรรม เพื่อเปิดกล่องสุ่มรับการ์ดสิทธิพิเศษและของรางวัล
          </p>
        </div>

        <!-- Right: Coin Wallet & Controls -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

          <!-- Coin Wallet Badge -->
          <div
            class="p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between sm:justify-start gap-3 shadow-lg">
            <div class="flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold shadow-sm">
                🪙
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">เหรียญ Coin สะสม</span>
                <span class="text-lg font-black font-mono text-amber-400 leading-tight">
                  {{ currentCoins }} <span class="text-xs font-normal text-stone-300">Coins</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button v-if="currentRole === 'teacher'" @click="showGrantCoinModal = true"
                class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer shrink-0"
                title="เติม Coin ให้นักเรียน">
                + เติม Coin
              </button>

              <div v-if="currentRole === 'teacher'"
                class="flex items-center gap-1 bg-stone-800/80 p-1 rounded-lg border border-stone-700/80 shrink-0">
                <span class="text-[8px] text-stone-400 px-1 font-bold uppercase tracking-wider">Test:</span>
                <button @click="testBuySuccess('Common')"
                  class="w-3.5 h-3.5 rounded-full bg-blue-500 hover:bg-blue-400 border border-blue-600 shadow-sm"
                  title="Test Common"></button>
                <button @click="testBuySuccess('Epic')"
                  class="w-3.5 h-3.5 rounded-full bg-purple-500 hover:bg-purple-400 border border-purple-600 shadow-sm"
                  title="Test Epic"></button>
                <button @click="testBuySuccess('Legendary')"
                  class="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-400 border border-amber-600 shadow-sm"
                  title="Test Legendary"></button>
                <button @click="testBuySuccess('Secret')"
                  class="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-400 border border-rose-600 shadow-sm"
                  title="Test Secret"></button>
                <button @click="testBuySuccess('Special Collection')"
                  class="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-500 hover:opacity-80 border border-pink-400 shadow-sm"
                  title="Test Special Collection"></button>
              </div>
            </div>
          </div>

        </div>

      </div>



    </div>

    <!-- ============================================== -->
    <!-- NAVIGATION TABS: BOXES vs MY INVENTORY         -->
    <!-- ============================================== -->
    <div class="flex items-center justify-between border-b border-gray-200 pb-3 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <button @click="activeTab = 'direct'" :class="[
          'px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer',
          activeTab === 'direct'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
        ]">
          <Sparkles class="w-4 h-4" />
          <span>ร้านค้าแฟชั่น ({{ directShopItems.length }})</span>
        </button>
        <button @click="activeTab = 'boxes'" :class="[
          'px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer',
          activeTab === 'boxes'
            ? 'bg-amber-500 text-stone-900 shadow-md'
            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
        ]">
          <Package class="w-4 h-4" />
          <span>กล่องสุ่ม ({{ boxesList.length }})</span>
        </button>
      </div>

      <!-- Teacher Sub-filter Tabs -->
      <div v-if="currentRole === 'teacher' && activeTab === 'direct'" class="flex items-center gap-2">
        <button @click="teacherItemFilter = 'all'" :class="[
          'px-4 py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer',
          teacherItemFilter === 'all' ? 'bg-stone-800 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        ]">ทั้งหมด</button>
        <button @click="teacherItemFilter = 'on_sale'" :class="[
          'px-4 py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer',
          teacherItemFilter === 'on_sale' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        ]">เปิดขายอยู่</button>
        <button @click="teacherItemFilter = 'hidden'" :class="[
          'px-4 py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer',
          teacherItemFilter === 'hidden' ? 'bg-stone-500 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        ]">ปิดการขาย (ซ่อน)</button>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- TAB 1: BOXES LIST GRID                         -->
    <!-- ============================================== -->
    <div v-if="activeTab === 'boxes'" class="space-y-6">

      <div v-if="boxesList.length === 0"
        class="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-sm">
        <Package class="w-12 h-12 text-stone-400 mx-auto" />
        <h4 class="text-base font-bold text-stone-800">ยังไม่มีกล่องสุ่มในร้านค้า</h4>
        <p class="text-xs text-stone-500">คุณสามารถกดเพิ่มกล่องสุ่มใหม่เพื่อเริ่มเปิดให้บริการแก่นักศึกษา</p>
        <button v-if="currentRole === 'teacher'" @click="openAddBoxModal"
          class="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-emerald-700 transition-all inline-flex items-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> เพิ่มกล่องสุ่มกล่องแรก
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="flex items-center justify-end">
          <!-- Add Box Button & Reset (Teacher) -->
          <div v-if="currentRole === 'teacher'" class="flex items-center gap-2">
            <button @click="handleResetAetheria"
              class="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold text-xs shadow-sm hover:bg-stone-50 transition-all flex items-center gap-2 cursor-pointer"
              title="รีเซ็ตกล่องสุ่มให้ตรงกับโฟลเดอร์ public/img/Gacha/AETHERIA">
              <RotateCcw class="w-4 h-4 text-amber-500" />
              <span>รีเซ็ตเซ็ต AETHERIA</span>
            </button>
            <button @click="openAddBoxModal"
              class="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-emerald-700 transition-all inline-flex items-center gap-2 cursor-pointer">
              <Plus class="w-4 h-4" /> เพิ่มกล่องสุ่มใหม่
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div v-for="box in boxesList" :key="box.id"
          class="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black text-white border border-stone-800 shadow-xl overflow-hidden flex flex-col group hover:border-amber-400/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <!-- Box Header Banner & Image -->
          <div
            class="relative h-56 w-full p-4 flex items-center justify-center overflow-hidden bg-gradient-to-t from-stone-950 to-stone-900/60">

            <!-- Ambient Box Glow -->
            <div
              class="absolute inset-0 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none">
            </div>

            <img :src="box.image" :alt="box.name"
              class="w-40 h-40 object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110 select-none" />

            <!-- Top Right: Price & Badge -->
            <div class="absolute top-4 right-4 flex flex-col items-end gap-1.5">
              <!-- Price Tag Pill -->
              <div
                class="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-300 font-mono font-black text-xs shadow-lg flex items-center gap-1.5">
                <span>🪙</span>
                <span>{{ box.price }} Coins</span>
              </div>

              <!-- Box Badge -->
              <div v-if="box.badge"
                class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase shadow-md flex items-center gap-1"
                :class="{
                  'bg-rose-500 text-white border border-rose-400': box.badge === 'HOT',
                  'bg-emerald-500 text-white border border-emerald-400': box.badge === 'NEW',
                  'bg-fuchsia-500 text-white border border-fuchsia-400': box.badge === 'LIMITED',
                  'bg-amber-500 text-stone-900 border border-amber-400': !['HOT', 'NEW', 'LIMITED'].includes(box.badge)
                }">
                {{ box.badge }}
              </div>
            </div>

            <!-- Items Count Pill -->
            <div
              class="absolute bottom-4 left-4 px-2.5 py-0.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-stone-300">
              {{ box.items?.length || 0 }} รายการของรางวัล
            </div>

            <!-- Teacher Admin Actions -->
            <div v-if="currentRole === 'teacher'" class="absolute top-4 left-4 flex items-center gap-1.5">
              <button @click.stop="openEditBoxModal(box)"
                class="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="แก้ไขกล่องนี้">
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button @click.stop="handleDeleteBox(box.id)"
                class="w-7 h-7 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-300 flex items-center justify-center transition-colors cursor-pointer"
                title="ลบกล่องนี้">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Box Info & Actions -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">

            <div class="space-y-1.5">
              <h3 class="text-lg font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {{ box.name }}
              </h3>
              <p class="text-xs text-stone-400 leading-relaxed line-clamp-2">
                {{ box.description || 'สุ่มรับไอเทมและการ์ดสิทธิพิเศษ' }}
              </p>

              <!-- Box Restrictions -->
              <div class="flex items-center gap-2 flex-wrap pt-1">
                <span v-if="box.reqRank && box.reqRank !== 'DISCOVERY'"
                  class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1">
                  <ShieldCheck class="w-3 h-3" /> ขั้นต่ำ: {{ box.reqRank }}
                </span>
                <span v-if="box.purchaseLimit > 0"
                  class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Package class="w-3 h-3" /> จำกัด {{ box.purchaseLimit }} สุ่ม/คน
                </span>
              </div>
            </div>

            <!-- Items Rarity Preview Strip -->
            <div class="pt-2 border-t border-white/10">
              <div class="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                <span>ของในกล่อง:</span>
                <button @click="openRateInfo(box)"
                  class="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer">
                  <Eye class="w-3 h-3" />
                  <span>ดูโอกาสออก (%)</span>
                </button>
              </div>

              <!-- Mini Item Thumbnails -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1.5 px-1 -mx-1 no-scrollbar">
                <div v-for="item in (box.items || []).slice(0, 5)" :key="item.id"
                  class="w-9 h-9 rounded-xl bg-white/5 border p-1 flex items-center justify-center shrink-0 relative group/item"
                  :class="rarityConfig[item.rarity]?.border || 'border-white/20'"
                  :title="`${item.name} (${item.rarity} - ${item.rate}%)`">
                  <img :src="item.image" class="w-full h-full object-contain" />
                  <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    :style="{ backgroundColor: rarityConfig[item.rarity]?.particleColor || '#fff' }"></span>
                </div>
                <div v-if="(box.items || []).length > 5" class="text-[10px] text-stone-400 font-bold px-1">
                  +{{ box.items.length - 5 }}
                </div>
              </div>
            </div>

            <!-- Open Box CTA Button -->
            <button @click="handleOpenBox(box)" :disabled="currentCoins < box.price"
              class="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
              <Sparkles class="w-4 h-4" />
              <span>เปิดกล่องสุ่ม ({{ box.price }} Coins)</span>
            </button>

            <!-- Test Open Button -->
            <button @click="handleTestOpenBox(box)"
              class="w-full py-2.5 rounded-xl font-bold text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2">
              <Eye class="w-3.5 h-3.5" />
              <span>ทดสอบเปิดกล่อง (ฟรี / ไม่เก็บเข้ากระเป๋า)</span>
            </button>

          </div>

        </div>

      </div>

      </div>

    </div>

    <!-- ============================================== -->
    <!-- TAB 1.5: DIRECT SHOP VIEW                      -->
    <!-- ============================================== -->
    <div v-else-if="activeTab === 'direct'" class="space-y-6">

      <div v-if="directShopItems.length === 0"
        class="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-sm">
        <Sparkles class="w-12 h-12 text-stone-400 mx-auto" />
        <h4 class="text-base font-bold text-stone-800">ยังไม่มีไอเทมในร้านค้าแฟชั่น</h4>
        <p class="text-xs text-stone-500">คุณครูสามารถกดเพิ่มไอเทมใหม่ลงในร้านค้าได้</p>
        <button v-if="currentRole === 'teacher'" @click="showAddDirectItemModal = true"
          class="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-indigo-700 transition-all inline-flex items-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> เพิ่มไอเทมชิ้นแรก
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <!-- Sort Button -->
          <button @click="directSortMode = directSortMode === 'desc' ? 'asc' : 'desc'"
            class="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold text-xs shadow-sm hover:bg-stone-50 transition-all flex items-center gap-2 cursor-pointer">
            <component :is="directSortMode === 'desc' ? ArrowDownAZ : ArrowUpAZ" class="w-4 h-4" />
            <span>เรียงตามระดับ: {{ directSortMode === 'desc' ? 'สูง -> ต่ำ' : 'ต่ำ -> สูง' }}</span>
          </button>

          <!-- Add Item Button (Teacher) -->
          <button v-if="currentRole === 'teacher'" @click="showAddDirectItemModal = true"
            class="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-indigo-700 transition-all inline-flex items-center gap-2 cursor-pointer">
            <Plus class="w-4 h-4" /> เพิ่มไอเทม
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-[fadeIn_0.3s_ease-out]">
          <div v-for="item in sortedDirectItems" :key="item.id" class="rc-card group" :class="'rc-' + tier(item).key"
            @pointermove="onTilt($event, item)" @pointerleave="resetTilt">

            <!-- กรอบเรืองแสง (รูปแบบต่างกันตามระดับ) -->
            <span class="rc-frame" aria-hidden="true"></span>

            <div class="rc-body">
              <!-- เวทีแสดงไอเทม -->
              <div class="rc-stage">
                <div class="rc-aura" aria-hidden="true"></div>

                <div v-if="tier(item).particles" class="rc-p" aria-hidden="true">
                  <i v-for="n in tier(item).particles" :key="n" :style="particleStyle(n)"></i>
                </div>

                <img :src="item.image" :alt="item.name" />

                <div class="rc-foil" aria-hidden="true"></div>

                <div class="rc-badge">
                  <span>{{ item.rarity }}</span>
                </div>

                <div v-if="currentRole === 'teacher'" class="absolute top-3 left-3 flex flex-col gap-2 z-[7]">
                  <!-- Teacher Edit Button -->
                  <button @click.stop="handleEditDirectItem(item)"
                    class="w-7 h-7 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                    title="แก้ไขไอเทมนี้">
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <!-- Teacher Toggle Sale Button -->
                  <button @click.stop="handleToggleSaleStatus(item)"
                    class="w-7 h-7 rounded-lg text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                    :class="item.isSale === false ? 'bg-stone-500/80 hover:bg-stone-500' : 'bg-emerald-500/80 hover:bg-emerald-500'"
                    :title="item.isSale === false ? 'ปิดการขายอยู่ (คลิกเพื่อเปิดขาย)' : 'เปิดขายอยู่ (คลิกเพื่อซ่อน)'">
                    <Eye v-if="item.isSale !== false" class="w-3.5 h-3.5" />
                    <EyeOff v-else class="w-3.5 h-3.5" />
                  </button>
                  <!-- Teacher Delete Button -->
                  <button @click.stop="handleRemoveDirectItem(item.id)"
                    class="w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                    title="ลบไอเทมนี้">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- ข้อมูล -->
              <div class="flex-1 flex flex-col justify-between relative z-[2]">
                <div class="space-y-1.5 mb-4">
                  <div class="rc-stars" :aria-label="'ระดับ ' + tier(item).stars + ' จาก 5'">
                    <span v-for="s in 5" :key="s" :class="{ on: s <= tier(item).stars }">★</span>
                  </div>
                  <h3 class="rc-title text-base font-black line-clamp-2 leading-relaxed py-1">
                    {{ item.name }}
                  </h3>
                  <p class="text-[11px] line-clamp-2" style="color: var(--sub)">
                    {{ item.description }}
                  </p>
                </div>

                <div class="rc-actions">
                  <button @click="handlePreviewItem(item)" class="rc-prev">
                    <Eye class="w-3.5 h-3.5" /> พรีวิว
                  </button>

                  <button v-if="isItemOwned(item.id)" disabled class="rc-buy poor disabled:cursor-not-allowed opacity-80 flex items-center justify-center gap-1">
                    <Check class="w-3.5 h-3.5" />
                    <span class="text-[11px] font-bold">ซื้อแล้ว</span>
                  </button>
                  <button v-else @click="handleBuyDirect(item)" class="rc-buy disabled:cursor-not-allowed" :class="{ poor: currentCoins < item.price }" :disabled="currentCoins < item.price">
                    <span class="text-[10px]">🪙</span>
                    <span>{{ item.price }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- DROP RATE INFO MODAL                           -->
    <!-- ============================================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showRateModal && selectedBoxForRate"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <div class="absolute inset-0" @click="showRateModal = false"></div>

          <div
            class="relative z-10 w-full max-w-lg bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col animate-[bounceIn_0.3s_ease-out]">

            <div
              class="px-6 py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 class="font-black text-base text-white">ตารางโอกาสออกของรางวัล (%)</h3>
                <p class="text-xs text-stone-400">{{ selectedBoxForRate.name }}</p>
              </div>
              <button @click="showRateModal = false"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="p-6 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div v-for="item in sortedRateItems" :key="item.id"
                class="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-xl bg-stone-950 p-1 flex items-center justify-center shrink-0 border border-white/15">
                    <img :src="item.image" class="w-full h-full object-contain"
                      :class="item.rarity === 'Secret' ? 'brightness-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-black"
                        :class="item.rarity === 'Secret' ? 'text-stone-500 tracking-widest' : 'text-white'">
                        {{ item.rarity === 'Secret' ? '???' : item.name }}
                      </span>
                      <span class="px-2 py-0.2 rounded text-[9px] font-black uppercase"
                        :class="rarityConfig[item.rarity]?.badgeBg">
                        {{ item.rarity }}
                      </span>
                    </div>
                    <p class="text-[11px] text-stone-400 mt-0.5">
                      {{ item.rarity === 'Secret' ? 'ความลับที่รอการค้นพบ...' : item.description }}
                    </p>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-sm font-black font-mono text-emerald-400">{{ item.rate }}%</span>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 bg-stone-950 border-t border-white/10 flex justify-end">
              <button @click="showRateModal = false"
                class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer">
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================== -->
    <!-- QUICK GRANT COIN MODAL (FOR TEACHER)           -->
    <!-- ============================================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showGrantCoinModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <div class="absolute inset-0" @click="showGrantCoinModal = false"></div>

          <div
            class="relative z-10 w-full max-w-md bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-800 p-6 space-y-5 animate-[bounceIn_0.3s_ease-out]">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 class="font-black text-base text-amber-400 flex items-center gap-2">
                <span>🪙</span> เติมเหรียญ Coin ให้นักศึกษา
              </h4>
              <button @click="showGrantCoinModal = false" class="text-stone-400 hover:text-white cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-stone-300 mb-1.5">เลือกนักศึกษา</label>
                <select v-model="selectedStudentToGrant"
                  class="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-bold outline-none">
                  <option v-for="s in studentsList.filter(s => isStudent(s))" :key="s.studentId" :value="s.studentId">
                    {{ s.name }} ({{ s.studentId }} - ห้อง {{ s.classroom }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-stone-300 mb-1.5">จำนวนเหรียญที่ต้องการเติม</label>
                <input v-model.number="coinGrantAmount" type="number" min="10" step="10"
                  class="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-bold font-mono text-base outline-none" />
              </div>

              <!-- Quick presets -->
              <div class="flex items-center gap-2">
                <button v-for="amt in [50, 100, 200, 500]" :key="amt" type="button" @click="coinGrantAmount = amt"
                  class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 font-bold font-mono text-[11px] cursor-pointer">
                  +{{ amt }}
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button @click="showGrantCoinModal = false"
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer">
                ยกเลิก
              </button>
              <button @click="grantCoinsToStudent"
                class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs cursor-pointer shadow-md">
                ยืนยันการเติม Coin
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modals -->
    <AddBoxModal :is-open="showAddModal" :box-to-edit="boxToEdit" @close="showAddModal = false; boxToEdit = null"
      @saved="handleBoxSaved" />

    <GachaModal v-if="showGachaModal" :is-open="showGachaModal" :box="activeBoxForGacha" :drawn-item="drawnResultItem"
      :is-duplicate="drawnIsDuplicate" :refund-coins="drawnRefundCoins" :student-coins="currentCoins"
      @close="showGachaModal = false" @draw-again="handleDrawAgain" />

    <AddDirectItemModal :isOpen="showAddDirectItemModal" :item-to-edit="itemToEdit"
      @close="showAddDirectItemModal = false; itemToEdit = null" @save="handleSaveDirectItem" />

    <ConfirmModal v-model="confirmState.isOpen" :title="confirmState.title" :message="confirmState.message"
      :type="confirmState.type" @confirm="handleConfirm" />

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showPreviewModal && previewItem"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <div class="absolute inset-0 cursor-pointer" @click="showPreviewModal = false"></div>

          <div
            class="relative z-10 w-full max-w-sm bg-stone-900 rounded-[2rem] border border-stone-800 p-6 flex flex-col items-center animate-[bounceIn_0.4s_ease-out] shadow-2xl"
            :class="[
              previewItem.rarity === 'Special Collection' ? 'shadow-indigo-500/20 border-indigo-500/30' :
                previewItem.rarity === 'Legendary' ? 'shadow-amber-500/20 border-amber-500/30' :
                  previewItem.rarity === 'Secret' ? 'shadow-rose-500/20 border-rose-500/30' :
                    previewItem.rarity === 'Epic' ? 'shadow-fuchsia-500/20 border-fuchsia-500/30' :
                      ''
            ]">

            <button @click="showPreviewModal = false"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
              <X class="w-4 h-4" />
            </button>

            <h3 class="text-lg font-black text-white mb-6">พรีวิวไอเทม</h3>

            <!-- Avatar Preview with Frame -->
            <div
              class="relative w-40 h-40 rounded-full bg-stone-800 flex items-center justify-center border-4 border-stone-700 shadow-inner mb-6">
              <User class="w-20 h-20 text-stone-600" />
              <img v-if="previewItem.itemType === 'frame'" :src="previewItem.image"
                class="absolute inset-0 w-full h-full object-contain scale-125 pointer-events-none drop-shadow-xl" />
              <img v-else :src="previewItem.image"
                class="absolute -bottom-2 -right-2 w-16 h-16 object-contain pointer-events-none drop-shadow-xl" />
            </div>

            <div class="text-center space-y-2 w-full">
              <div
                class="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-2 border shadow-sm"
                :class="[
                  previewItem.rarity === 'Special Collection' ? 'bg-indigo-500 border-indigo-400 text-white' :
                    previewItem.rarity === 'Legendary' ? 'bg-amber-500 border-amber-400 text-white' :
                      previewItem.rarity === 'Secret' ? 'bg-rose-500 border-rose-400 text-white' :
                        previewItem.rarity === 'Epic' ? 'bg-fuchsia-500 border-fuchsia-400 text-white' :
                          'bg-blue-500 border-blue-400 text-white'
                ]">
                {{ previewItem.rarity }}
              </div>
              <h4 class="text-xl font-black text-white leading-relaxed">{{ previewItem.name }}</h4>
              <p class="text-sm text-stone-400 px-4">{{ previewItem.description }}</p>
            </div>

            <button @click="() => { showPreviewModal = false; handleBuyDirect(previewItem); }"
              class="w-full mt-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              :class="currentCoins >= previewItem.price
                ? 'bg-amber-400 hover:bg-amber-500 text-stone-900 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1'
                : 'bg-stone-800 text-stone-500'" :disabled="currentCoins < previewItem.price">
              <span class="text-lg">🪙</span>
              <span>ซื้อในราคา {{ previewItem.price }} Coins</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <PurchaseCelebration />

  </div>
</template>

<style scoped>
@import '../assets/shop-card.css';

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
