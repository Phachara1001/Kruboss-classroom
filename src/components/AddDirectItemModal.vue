<script setup>
import { ref, watch } from 'vue'
import { X, Save, Image as ImageIcon, Check, Pencil, Sparkles, Upload } from '@lucide/vue'
import { availableFrameAssets, rarityConfig } from '../data/shopStore'
import { API_UPLOAD_URL } from '@/config/api'
import StudentAvatar from './StudentAvatar.vue'

const props = defineProps({
  isOpen: Boolean,
  itemToEdit: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save'])

const activeSourceTab = ref('css') // 'css' | 'system' | 'upload'

const cssFramePresets = [
  {
    key: 'angel',
    name: 'กรอบปีกทูตสวรรค์ Angel Wings',
    image: 'css:angel',
    rarity: 'Special Collection',
    price: 600,
    description: 'ปีกทูตสวรรค์กระพือพริ้วไหว พร้อมวงแหวนเฮโลสีทองเปล่งประกาย'
  },
  {
    key: 'witch',
    name: 'กรอบแม่มดราตรี Dark Witch',
    image: 'css:witch',
    rarity: 'Legendary',
    price: 450,
    description: 'หมวกแม่มดต้องมนต์ พร้อมค้างคาวบินวนและประกายเวทมนตร์สีม่วง'
  },
  {
    key: 'zombie',
    name: 'กรอบผีดิบซอมบี้ Bio Zombie',
    image: 'css:zombie',
    rarity: 'Epic',
    price: 350,
    description: 'มือซอมบี้ตะเกียกตะกายขึ้นจากหลุม พร้อมหมอกพิษและเมือกกรดชีวภาพ'
  },
  {
    key: 'demon',
    name: 'กรอบปีศาจอเวจี Infernal Demon',
    image: 'css:demon',
    rarity: 'Secret',
    price: 550,
    description: 'เขาปีศาจสีเลือด ดวงตาสีเพลิงลุกโชน และประกายไฟนรกอเวจี'
  },
  {
    key: 'flame',
    name: 'กรอบเพลิงกัลป์ Blazing Flame',
    image: 'css:flame',
    rarity: 'Legendary',
    price: 500,
    description: 'เปลวเพลิง 4 ชั้นลุกโชนรอบกรอบโปรไฟล์ พร้อมลูกไฟพริ้วไหวเร่าร้อน'
  },
  {
    key: 'ramen',
    name: 'กรอบโซ้ยราเมง Slurp Ramen',
    image: 'css:ramen',
    rarity: 'Legendary',
    price: 480,
    description: 'ถ้วยราเมงร้อนกรุ่นพร้อมตะเกียบคีบเส้นและช้อนตักน้ำซุปหอมฉุย'
  },
  {
    key: 'sleep',
    name: 'กรอบชุดนอนฝันดี Cozy Sleep',
    image: 'css:sleep',
    rarity: 'Epic',
    price: 380,
    description: 'หมวกนอนลายทางพร้อมพระจันทร์เสี้ยวและตัวอักษร Zzz ลอยหลับฝันดี'
  }
]

const formData = ref({
  id: '',
  name: '',
  price: 250,
  image: '',
  description: '',
  itemType: 'frame',
  rarity: 'Epic',
  isSale: true
})

const errorMessage = ref('')
const isUploading = ref(false)
const fileInput = ref(null)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.itemToEdit) {
      formData.value = { ...props.itemToEdit }
      if (formData.value.image?.startsWith('css:')) {
        activeSourceTab.value = 'css'
      } else if (formData.value.image?.includes('/img/frame/')) {
        activeSourceTab.value = 'system'
      } else {
        activeSourceTab.value = 'upload'
      }
    } else {
      const defaultPreset = cssFramePresets[0]
      formData.value = {
        id: `direct-${Date.now()}`,
        name: defaultPreset.name,
        price: defaultPreset.price,
        image: defaultPreset.image,
        description: defaultPreset.description,
        itemType: 'frame',
        rarity: defaultPreset.rarity,
        isSale: true
      }
      activeSourceTab.value = 'css'
    }
    errorMessage.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const handleSave = () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'กรุณาใส่ชื่อไอเทม'
    return
  }
  if (!formData.value.image) {
    errorMessage.value = 'กรุณาเลือกรูปภาพหรือรูปแบบกรอบไอเทม'
    return
  }

  // Only for NEW frames, set id to image path if not set. When editing, preserve existing id.
  if (!props.itemToEdit && formData.value.itemType === 'frame' && !formData.value.id.startsWith('direct-')) {
    formData.value.id = formData.value.image
  }

  emit('save', { ...formData.value })
  closeModal()
}

const selectCssPreset = (preset) => {
  formData.value.image = preset.image
  formData.value.name = preset.name
  formData.value.rarity = preset.rarity
  formData.value.price = preset.price
  formData.value.description = preset.description
  formData.value.itemType = 'frame'
}

const selectSystemAsset = (asset) => {
  formData.value.image = asset.path
  formData.value.name = `กรอบรูป ${asset.name}`
  formData.value.itemType = 'frame'
  formData.value.rarity = 'Epic'
  formData.value.description = `กรอบรูปโปรไฟล์ธีม ${asset.name}`
}

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  isUploading.value = true
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
      formData.value.image = data.url
      if (!formData.value.name) {
        formData.value.name = file.name.replace(/\.[^/.]+$/, "")
      }
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (err) {
    errorMessage.value = 'ไม่สามารถอัปโหลดรูปภาพได้: ' + err.message
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto no-scrollbar">
        <div class="absolute inset-0" @click="closeModal"></div>

        <div
          class="relative z-10 w-full max-w-3xl bg-stone-950 text-white rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-stone-800 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-[bounceIn_0.4s_ease-out]">

          <div class="p-6 sm:p-8 border-b border-stone-800 flex items-center justify-between shrink-0 bg-stone-900/50">
            <h2 class="text-xl sm:text-2xl font-black flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <ImageIcon v-if="!itemToEdit" class="w-5 h-5" />
                <Pencil v-else class="w-5 h-5" />
              </span>
              {{ itemToEdit ? 'แก้ไขไอเทม' : 'เพิ่มไอเทมในร้านค้าแฟชั่น' }}
            </h2>
            <button @click="closeModal"
              class="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white text-stone-400 flex items-center justify-center transition-all cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 sm:p-8 flex-1 overflow-y-auto no-scrollbar space-y-6">

            <div v-if="errorMessage"
              class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-2">
              <X class="w-5 h-5 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Segmented Control for Source -->
            <div class="flex p-1 bg-stone-900 rounded-2xl border border-stone-800 gap-1">
              <button type="button" @click="activeSourceTab = 'css'" :class="[
                'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeSourceTab === 'css' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-400 hover:text-white hover:bg-white/5'
              ]">
                <Sparkles class="w-4 h-4 text-amber-300" />
                <span>กรอบแอนิเมชัน CSS</span>
              </button>
              <button type="button" @click="activeSourceTab = 'system'" :class="[
                'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeSourceTab === 'system' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-400 hover:text-white hover:bg-white/5'
              ]">
                <ImageIcon class="w-4 h-4 text-cyan-300" />
                <span>กรอบรูปในระบบ (PNG/GIF)</span>
              </button>
              <button type="button" @click="activeSourceTab = 'upload'" :class="[
                'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                activeSourceTab === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-400 hover:text-white hover:bg-white/5'
              ]">
                <Upload class="w-4 h-4 text-emerald-300" />
                <span>อัปโหลดไฟล์ใหม่</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <!-- Left: Selection / Upload Area -->
              <div class="space-y-4">

                <!-- Tab 1: CSS Frame Presets -->
                <div v-if="activeSourceTab === 'css'" class="space-y-2">
                  <label class="block text-xs font-bold text-stone-400">เลือกรูปแบบแอนิเมชัน Pure CSS</label>
                  <div class="space-y-2 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                    <div v-for="preset in cssFramePresets" :key="preset.key" @click="selectCssPreset(preset)" :class="[
                      'p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all',
                      formData.image === preset.image
                        ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900'
                    ]">
                      <div class="w-12 h-12 flex items-center justify-center shrink-0">
                        <StudentAvatar :frame="preset.image" size="w-10 h-10" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-1">
                          <p class="text-xs font-bold text-white truncate">{{ preset.name }}</p>
                          <span class="text-[10px] font-bold text-amber-400 shrink-0">{{ preset.price }} เหรียญ</span>
                        </div>
                        <p class="text-[10px] text-stone-400 line-clamp-1">{{ preset.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tab 2: System Frames Grid -->
                <div v-else-if="activeSourceTab === 'system'" class="space-y-2">
                  <label class="block text-xs font-bold text-stone-400">เลือกกรอบรูปจากโฟลเดอร์ระบบ</label>
                  <div class="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                    <div v-for="asset in availableFrameAssets" :key="asset.path" @click="selectSystemAsset(asset)"
                      :class="[
                        'p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all aspect-square',
                        formData.image === asset.path
                          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900'
                      ]">
                      <StudentAvatar :frame="asset.path" size="w-10 h-10" />
                      <span class="text-[10px] font-bold text-stone-300 text-center truncate w-full">{{ asset.name
                        }}</span>
                    </div>
                  </div>
                </div>

                <!-- Tab 3: Custom File Upload -->
                <div v-else class="space-y-2">
                  <label class="block text-xs font-bold text-stone-400">อัปโหลดไฟล์กรอบรูป (PNG, WebP, GIF)</label>
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

                  <div
                    class="aspect-square rounded-3xl border-2 border-dashed border-stone-700 bg-stone-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-400/5 transition-colors relative overflow-hidden group max-h-[280px]"
                    @click="triggerFileUpload">

                    <div v-if="isUploading"
                      class="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm z-30">
                      <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin">
                      </div>
                      <span class="mt-3 text-sm font-bold text-indigo-400 animate-pulse">กำลังอัปโหลด...</span>
                    </div>

                    <div v-else-if="formData.image && !formData.image.startsWith('css:')"
                      class="relative w-full h-full flex items-center justify-center p-4">
                      <StudentAvatar :frame="formData.image" size="w-24 h-24" />
                    </div>

                    <div v-else class="text-stone-500 flex flex-col items-center gap-3">
                      <Upload class="w-10 h-10 text-stone-400" />
                      <span class="text-xs font-bold text-stone-400">คลิกเพื่ออัปโหลดไฟล์จากเครื่อง</span>
                      <span class="text-[10px] text-stone-500">รองรับ Transparent PNG, WebP, GIF</span>
                    </div>

                    <div v-if="!isUploading"
                      class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center backdrop-blur-sm">
                      <span
                        class="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg border border-indigo-500 flex items-center gap-2">
                        <Upload class="w-4 h-4" /> เลือกไฟล์รูปภาพ
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Live Preview Bar -->
                <div class="p-3 bg-stone-900/70 rounded-2xl border border-stone-800 flex items-center gap-3">
                  <div class="w-12 h-12 flex items-center justify-center shrink-0">
                    <StudentAvatar :frame="formData.image" size="w-10 h-10" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] text-stone-400 block font-bold uppercase">ตัวอย่างภาพจริง</span>
                    <span class="text-xs font-bold text-white truncate block">{{ formData.name || 'ยังไม่ได้ตั้งชื่อ'
                      }}</span>
                  </div>
                </div>

              </div>

              <!-- Right: Details Form -->
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">ชื่อไอเทม <span
                      class="text-rose-400">*</span></label>
                  <input v-model="formData.name" type="text" placeholder="เช่น กรอบนีออน Cyber HUD"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">คำอธิบาย</label>
                  <textarea v-model="formData.description" rows="2" placeholder="รายละเอียดเพิ่มเติมของไอเทม"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-400">ราคา (Coins) <span
                        class="text-rose-400">*</span></label>
                    <input v-model.number="formData.price" type="number" min="0"
                      class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-black text-amber-400 focus:outline-none focus:border-indigo-500 transition-all text-center" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-400">ระดับความหายาก</label>
                    <select v-model="formData.rarity"
                      class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option v-for="(cfg, rKey) in rarityConfig" :key="rKey" :value="rKey" :class="cfg.textColor">
                        {{ rKey }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">ประเภทไอเทม</label>
                  <select v-model="formData.itemType"
                    class="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="frame">กรอบรูปโปรไฟล์</option>
                    <option value="pet">สัตว์เลี้ยง</option>
                    <option value="privilege">การ์ดสิทธิพิเศษ</option>
                    <option value="buff">บัฟ</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-400">รหัสรูปภาพ / ค่า Presets</label>
                  <input v-model="formData.image" type="text" placeholder="css:neon หรือ /img/frame/Cyber.png"
                    class="w-full px-4 py-2.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs font-mono text-stone-300 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
            </div>

          </div>

          <div class="p-6 sm:p-8 border-t border-stone-800 flex justify-end gap-3 bg-stone-900/50 shrink-0">
            <button @click="closeModal"
              class="px-6 py-3 rounded-xl font-bold text-sm text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button @click="handleSave"
              class="px-8 py-3 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2 cursor-pointer active:scale-95">
              <Save class="w-4 h-4" />
              บันทึกไอเทม
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
