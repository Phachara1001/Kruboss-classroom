<script setup>
import { ref, watch, computed } from 'vue'
import { 
  X, 
  Plus, 
  Trash2, 
  Package, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle, 
  Check, 
  Layers,
  Filter,
  FolderOpen,
  Eye,
  EyeOff
} from '@lucide/vue'
import { 
  saveMysteryBox, 
  rarityConfig, 
  gachaFolderAssets
} from '../data/shopStore'
import { API_UPLOAD_URL } from '@/config/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  boxToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// Presets for quick image selection
const boxImagePresets = [
  { name: '✨ Default Box.png', url: gachaFolderAssets.boxes[0]?.path || '' },
  { name: 'Gold Oracle Chest', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cyberpunk Tech Box', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cosmic Crystal Box', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80' }
]

const isUploadingBox = ref(false)
const uploadingItemIndex = ref(null)
const fileInputBox = ref(null)
const fileInputItem = ref(null)

const triggerBoxUpload = () => {
  if (fileInputBox.value) fileInputBox.value.click()
}

const triggerItemUpload = (index) => {
  uploadingItemIndex.value = index
  if (fileInputItem.value) fileInputItem.value.click()
}

const handleFileUpload = async (event, targetType) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (targetType === 'box') {
    isUploadingBox.value = true
  }
  errorMessage.value = ''

  const uploadData = new FormData()
  uploadData.append('file', file)

  try {
    const res = await fetch(API_UPLOAD_URL, {
      method: 'POST',
      body: uploadData
    })
    
    if (!res.ok) throw new Error('Upload failed')
    
    const data = await res.json()
    if (data.success && data.url) {
      if (targetType === 'box') {
        formData.value.image = data.url
      } else {
        const idx = uploadingItemIndex.value
        if (idx !== null && formData.value.items[idx]) {
          formData.value.items[idx].image = data.url
          if (!formData.value.items[idx].name) {
            formData.value.items[idx].name = file.name.replace(/\.[^/.]+$/, "")
          }
        }
      }
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (err) {
    errorMessage.value = 'ไม่สามารถอัปโหลดรูปภาพได้: ' + err.message
  } finally {
    if (targetType === 'box') isUploadingBox.value = false
    else uploadingItemIndex.value = null
    event.target.value = '' // reset input
  }
}

// Form State
const formData = ref({
  id: '',
  name: '',
  price: 50,
  image: gachaFolderAssets.boxes[0]?.path || '',
  description: '',
  category: 'สัตว์เลี้ยงคู่หู',
  reqRank: 'DISCOVERY',
  purchaseLimit: 0,
  badge: '',
  isSale: true,
  items: []
})

const errorMessage = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.boxToEdit) {
      formData.value = JSON.parse(JSON.stringify(props.boxToEdit))
    } else {
      // Start with a blank form
      formData.value = {
        id: `box-${Date.now()}`,
        name: '',
        price: 50,
        image: '',
        description: '',
        category: 'สัตว์เลี้ยงคู่หู',
        reqRank: 'DISCOVERY',
        purchaseLimit: 0,
        badge: '',
        isSale: true,
        items: []
      }
    }
    errorMessage.value = ''
  }
})

// Calculate total drop rate %
const totalRate = computed(() => {
  const sum = formData.value.items.reduce((sum, item) => sum + Number(item.rate || 0), 0)
  return Math.round(sum * 10) / 10
})

// Add blank new item to box
const addItem = () => {
  formData.value.items.push({
    id: `item-${Date.now()}-${formData.value.items.length + 1}`,
    name: '',
    rarity: 'Common',
    rate: 10,
    image: '',
    description: '',
    itemType: 'pet'
  })
}

// Remove item from box
const removeItem = (index) => {
  if (formData.value.items.length <= 1) {
    errorMessage.value = 'กล่องสุ่มต้องมีของรางวัลอย่างน้อย 1 ชิ้น'
    return
  }
  formData.value.items.splice(index, 1)
}

// Auto normalize drop rates to 100% based on Rarity (Secret = lowest, Common = highest)
const normalizeRates = () => {
  const items = formData.value.items
  if (items.length === 0) return

  const rarityOrder = { 'Special Collection': 0, 'Secret': 1, 'Legendary': 2, 'Epic': 3, 'Rare': 4, 'Uncommon': 5, 'Common': 6 }
  items.sort((a, b) => (rarityOrder[a.rarity] || 99) - (rarityOrder[b.rarity] || 99))
  
  const weights = {
    'Special Collection': 1,
    'Secret': 1,       // Very hard
    'Legendary': 5,
    'Epic': 15,
    'Rare': 30,
    'Uncommon': 60,
    'Common': 100      // Very easy
  }

  const secretItems = items.filter(item => item.rarity === 'Secret')
  const otherItems = items.filter(item => item.rarity !== 'Secret')

  secretItems.forEach(item => item.rate = 1) // Secret must be 1% exactly

  if (otherItems.length === 0) return

  const remainingPercent = 100 - (secretItems.length * 1)

  let totalWeight = 0
  otherItems.forEach(item => {
    totalWeight += (weights[item.rarity] || 50)
  })

  if (totalWeight === 0) return

  let sumRate = 0
  otherItems.forEach((item, index) => {
    const weight = weights[item.rarity] || 50
    let rate = Math.round((weight / totalWeight) * remainingPercent * 10) / 10 // 1 decimal place

    if (index === otherItems.length - 1) {
      rate = Math.max(0.1, Math.round((remainingPercent - sumRate) * 10) / 10)
    }
    item.rate = rate
    sumRate += rate
  })
}

const isSaving = ref(false)

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'กรุณาระบุชื่อกล่องสุ่ม'
    return
  }
  if (formData.value.price === null || formData.value.price === undefined || formData.value.price < 0) {
    errorMessage.value = 'กรุณาระบุราคากล่องสุ่มให้ถูกต้อง'
    return
  }
  if (!formData.value.image.trim()) {
    errorMessage.value = 'กรุณาระบุรูปภาพกล่องสุ่ม'
    return
  }
  if (formData.value.items.length === 0) {
    errorMessage.value = 'กรุณาเพิ่มรายการของรางวัลข้างในกล่องอย่างน้อย 1 ชิ้น'
    return
  }
  // Validate items
  for (let i = 0; i < formData.value.items.length; i++) {
    const item = formData.value.items[i]
    if (!item.name.trim()) {
      errorMessage.value = `กรุณาระบุชื่อของรางวัลชิ้นที่ ${i + 1}`
      return
    }
    if (!item.rate || item.rate <= 0) {
      errorMessage.value = `โอกาสออกของรางวัล "${item.name}" ต้องมากกว่า 0%`
      return
    }
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    await saveMysteryBox(formData.value)
    emit('saved')
    emit('close')
  } catch (err) {
    errorMessage.value = 'ไม่สามารถบันทึกกล่องลงฐานข้อมูลได้: ' + (err.message || 'Server error')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none"
      >
        <div class="absolute inset-0" @click="emit('close')"></div>

        <div class="relative z-10 w-full max-w-3xl max-h-[92vh] bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden animate-[bounceIn_0.3s_ease-out]">
          
          <!-- Header -->
          <div class="px-6 py-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-b border-white/10 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Package class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-lg text-white leading-tight">
                  {{ boxToEdit ? 'แก้ไขกล่องสุ่ม' : 'เพิ่มกล่องสุ่มใหม่ (Role ครู)' }}
                </h3>
                <p class="text-xs text-stone-400">
                  กำหนดรูปกล่อง, ราคา Coin, และรายการของรางวัลข้างในพร้อมโอกาสออก
                </p>
              </div>
            </div>
            <button 
              @click="emit('close')"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body Form -->
          <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-6 text-xs no-scrollbar flex-1">
            
            <!-- Error Banner -->
            <div v-if="errorMessage" class="p-3.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- SECTION 1: BOX DETAILS -->
            <div class="space-y-4 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <h4 class="font-black text-sm text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles class="w-4 h-4" /> ข้อมูลทั่วไปของกล่องสุ่ม
                </h4>
              </div>

              <!-- Box Name -->
              <div>
                <label class="block font-bold text-stone-300 mb-1.5">ชื่อกล่องสุ่ม *</label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  placeholder="เช่น AETHERIA: Mystic Companions"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-medium focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <!-- Price & Description -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-stone-300 mb-1.5">ราคา (Coins) *</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">🪙</span>
                    <input 
                      v-model.number="formData.price"
                      type="number" 
                      min="0"
                      class="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-bold font-mono focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-stone-300 mb-1.5">คำอธิบายกล่อง</label>
                  <input 
                    v-model="formData.description"
                    type="text" 
                    placeholder="เช่น กล่องสุ่มสัตว์เลี้ยงและภูติผู้พิทักษ์แห่งอาณาจักร Aetheria"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <!-- Box Image Path & Preview -->
              <div>
                <label class="block font-bold text-stone-300 mb-1.5">รูปกล่องสุ่ม (Image Path / URL) *</label>
                <div class="flex gap-3 items-center">
                  <div class="w-14 h-14 rounded-xl bg-stone-950 border border-white/20 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img 
                      :src="formData.image" 
                      class="w-full h-full object-contain" 
                      onerror="this.src='/img/Gacha/AETHERIA/Box.png'" 
                    />
                  </div>
                  <input type="file" ref="fileInputBox" class="hidden" accept="image/*" @change="e => handleFileUpload(e, 'box')" />
                  <input 
                    v-model="formData.image"
                    type="text" 
                    placeholder="URL หรือ Path รูปภาพ หรือกดปุ่มเพื่ออัปโหลดไฟล์"
                    class="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    required
                  />
                  <button 
                    type="button"
                    @click="triggerBoxUpload"
                    class="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="อัปโหลดไฟล์รูปกล่อง"
                  >
                    <ImageIcon v-if="!isUploadingBox" class="w-4 h-4" />
                    <span v-else class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                    <span class="hidden sm:inline">{{ isUploadingBox ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ' }}</span>
                  </button>
                </div>

                <!-- Presets -->
                <div class="mt-2.5 flex items-center gap-2 flex-wrap">
                  <span class="text-[10px] text-stone-400">รูปตัวอย่าง:</span>
                  <button 
                    v-for="p in boxImagePresets" 
                    :key="p.name"
                    type="button"
                    @click="formData.image = p.url"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer"
                    :class="formData.image === p.url ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-stone-300 border-white/10'"
                  >
                    {{ p.name }}
                  </button>
                </div>
              </div>

            </div>

            <!-- SECTION 1.5: เงื่อนไขการสุ่ม (BOX SETTINGS) -->
            <div class="space-y-4 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
              <h4 class="font-black text-sm text-fuchsia-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Wand2 class="w-4 h-4" /> เงื่อนไขการสุ่ม (Box Settings)
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Rank Requirement -->
                <div>
                  <label class="block font-bold text-stone-300 mb-1.5">แรงค์ขั้นต่ำ *</label>
                  <select 
                    v-model="formData.reqRank"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-bold focus:outline-none focus:border-fuchsia-400 cursor-pointer"
                  >
                    <option value="DISCOVERY">🌟 DISCOVERY (เปิดได้ทุกคน)</option>
                    <option value="BRONZE">🥉 BRONZE ขึ้นไป</option>
                    <option value="SILVER">🥈 SILVER ขึ้นไป</option>
                    <option value="GOLD">🥇 GOLD ขึ้นไป</option>
                    <option value="PLATINUM">💎 PLATINUM ขึ้นไป</option>
                  </select>
                </div>

                <!-- Purchase Limit -->
                <div>
                  <label class="block font-bold text-stone-300 mb-1.5">จำกัดการสุ่ม/คน (0 = ไม่จำกัด)</label>
                  <input 
                    v-model.number="formData.purchaseLimit"
                    type="number" 
                    min="0"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-mono focus:outline-none focus:border-fuchsia-400"
                  />
                </div>

                <!-- Box Badge -->
                <div>
                  <label class="block font-bold text-stone-300 mb-1.5">ป้ายกำกับ (Badge)</label>
                  <select 
                    v-model="formData.badge"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white font-bold focus:outline-none focus:border-fuchsia-400 cursor-pointer"
                  >
                    <option value="">-- ไม่มีป้าย --</option>
                    <option value="NEW">✨ NEW (มาใหม่)</option>
                    <option value="HOT">🔥 HOT (ยอดฮิต)</option>
                    <option value="LIMITED">⏳ LIMITED (จำกัดเวลา)</option>
                  </select>
                </div>

                <!-- Sale Status (เปิดขาย / ปิดการขาย) -->
                <div class="sm:col-span-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <label class="block font-bold text-stone-200 text-xs">สถานะการขายในร้านค้า</label>
                    <p class="text-[10px] text-stone-400">หากปิดการขาย กล่องนี้จะถูกซ่อนจากหน้าร้านค้าของนักศึกษา</p>
                  </div>
                  <button 
                    type="button" 
                    @click="formData.isSale = formData.isSale === false ? true : false"
                    class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm border"
                    :class="formData.isSale !== false ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-stone-800 text-stone-400 border-stone-700'"
                  >
                    <Eye v-if="formData.isSale !== false" class="w-4 h-4 text-emerald-300" />
                    <EyeOff v-else class="w-4 h-4 text-stone-400" />
                    <span>{{ formData.isSale !== false ? 'เปิดขายให้นักศึกษา' : 'ปิดการขาย (ซ่อนจากร้านค้า)' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- SECTION 2: ITEMS INSIDE BOX -->
            <div class="space-y-4 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 class="font-black text-sm text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Layers class="w-4 h-4" /> รายการของข้างในกล่อง (ITEMS INSIDE)
                  </h4>
                  <p class="text-[11px] text-stone-400 mt-0.5">
                    กำหนดชื่อ, รูป, ระดับความหายาก, และโอกาสออก (%) (มีทั้งหมด {{ formData.items.length }} ชิ้น)
                  </p>
                </div>

                <!-- Total Rate Badge & Balance Button -->
                <div class="flex items-center gap-2">
                  <div 
                    class="px-3 py-1 rounded-xl text-xs font-mono font-black border flex items-center gap-1.5"
                    :class="totalRate === 100 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'"
                  >
                    <span>รวมโอกาสออก: {{ totalRate }}%</span>
                    <Check v-if="totalRate === 100" class="w-3.5 h-3.5" />
                  </div>
                  <button 
                    type="button" 
                    @click="normalizeRates"
                    class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/10 hover:bg-emerald-500/30 hover:text-emerald-300 text-stone-200 transition-all cursor-pointer flex items-center gap-1 border border-white/10"
                    title="ปรับสัดส่วนโอกาสออกให้รวมเป็น 100% อัตโนมัติ (เรียงตามระดับความหายาก)"
                  >
                    <Filter class="w-3 h-3" /> เกลี่ย % อัตโนมัติตามระดับ
                  </button>
                </div>
              </div>

              <!-- File input for items -->
              <input type="file" ref="fileInputItem" class="hidden" accept="image/*" @change="e => handleFileUpload(e, 'item')" />

              <!-- Items List Repeater -->
              <div class="space-y-3">
                <div 
                  v-for="(item, idx) in formData.items" 
                  :key="item.id"
                  class="p-3 sm:p-3.5 rounded-xl bg-stone-950/80 border border-white/15 space-y-3 relative group hover:border-white/30 transition-all"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-black text-[11px] text-stone-300 flex items-center gap-1.5">
                      <span class="text-stone-400">#{{ idx + 1 }}</span>
                      <span 
                        class="px-2 py-0.5 rounded-md text-[10px] font-black border uppercase"
                        :class="[rarityConfig[item.rarity]?.badgeBg || 'bg-stone-800 text-white border-white/20']"
                      >
                        {{ item.rarity }}
                      </span>
                      <span class="text-white font-bold ml-1">{{ item.name }}</span>
                    </span>

                    <button 
                      type="button"
                      @click="removeItem(idx)"
                      class="text-stone-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="ลบของรางวัลชิ้นนี้"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Item Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    
                    <!-- Item Image Preview & Path -->
                    <div class="sm:col-span-5 flex items-center gap-2">
                      <div class="w-10 h-10 rounded-lg bg-stone-900 border border-white/20 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        <img 
                          :src="item.image" 
                          class="w-full h-full object-contain" 
                          onerror="this.src='/img/Gacha/AETHERIA/Aetherwyrm - secret.png'" 
                        />
                      </div>
                      <input 
                        v-model="item.image"
                        type="text" 
                        placeholder="Path รูปภาพ หรืออัปโหลด"
                        class="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-[11px] font-mono text-white focus:outline-none focus:border-emerald-400"
                        required
                      />
                      <button 
                        type="button"
                        @click="triggerItemUpload(idx)"
                        class="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-[10px] font-bold border border-white/10 cursor-pointer shrink-0 flex items-center gap-1"
                        title="อัปโหลดไฟล์รูปภาพ"
                      >
                        <ImageIcon v-if="uploadingItemIndex !== idx" class="w-3 h-3" />
                        <span v-else class="w-3 h-3 border border-stone-300 border-t-transparent rounded-full animate-spin"></span>
                        อัปโหลด
                      </button>
                    </div>

                    <!-- Item Name -->
                    <div class="sm:col-span-3">
                      <input 
                        v-model="item.name"
                        type="text" 
                        placeholder="ชื่อของรางวัล *"
                        class="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                        required
                      />
                    </div>

                    <!-- Rarity Select (All 6 Tiers) -->
                    <div class="sm:col-span-2">
                      <select 
                        v-model="item.rarity"
                        class="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-xs font-bold text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Special Collection" class="bg-stone-900 text-indigo-400 font-bold">Special Collection</option>
                        <option value="Secret" class="bg-stone-900 text-rose-400 font-bold">Secret</option>
                        <option value="Legendary" class="bg-stone-900 text-amber-400 font-bold">Legendary</option>
                        <option value="Epic" class="bg-stone-900 text-purple-400 font-bold">Epic</option>
                        <option value="Rare" class="bg-stone-900 text-blue-400 font-bold">Rare</option>
                        <option value="Uncommon" class="bg-stone-900 text-teal-400 font-bold">Uncommon</option>
                        <option value="Common" class="bg-stone-900 text-emerald-400 font-bold">Common</option>
                      </select>
                    </div>

                    <!-- Drop Rate % -->
                    <div class="sm:col-span-2 flex items-center gap-1">
                      <input 
                        v-model.number="item.rate"
                        type="number" 
                        min="0.1"
                        step="0.1"
                        max="100"
                        placeholder="%"
                        class="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-xs font-mono font-bold text-amber-300 text-center focus:outline-none focus:border-amber-400"
                        required
                      />
                      <span class="text-stone-400 text-xs font-bold">%</span>
                    </div>

                  </div>

                  <!-- Description & Category -->
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-1">
                    <div class="sm:col-span-8">
                      <input 
                        v-model="item.description"
                        type="text" 
                        placeholder="คำอธิบายไอเทม (ไม่บังคับ)"
                        class="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-[11px] text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div class="sm:col-span-4">
                      <select 
                        v-model="item.itemType"
                        class="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-white/20 text-[11px] font-bold text-emerald-200 focus:outline-none cursor-pointer"
                      >
                        <option value="pet">สัตว์เลี้ยง</option>
                        <option value="privilege">การ์ดสิทธิพิเศษ</option>
                        <option value="buff">บัฟคะแนน</option>
                        <option value="frame">กรอบรูป</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Add Blank Item Button -->
              <button 
                type="button" 
                @click="addItem"
                class="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus class="w-4 h-4" />
                <span>เพิ่มของรางวัลแบบกำหนดเอง</span>
              </button>

            </div>

            <!-- Footer Actions -->
            <div class="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button"
                @click="emit('close')"
                class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-black tracking-wide transition-all shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSaving ? 'กำลังบันทึกลงฐานข้อมูล...' : (boxToEdit ? 'บันทึกการแก้ไข' : 'สร้างกล่องสุ่ม') }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </Transition>
  </Teleport>


</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
