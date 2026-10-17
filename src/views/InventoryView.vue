<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Package, User, Palette, PawPrint, Sparkles, Check, CheckCircle2, X, CircleQuestionMark } from '@lucide/vue'
import Tooltip from '../components/Tooltip.vue'
import { studentsList } from '../data/studentsStore'
import { authUser } from '../data/authStore'
import {
  activeStudentIdForShop,
  studentInventory,
  getStudentEquipment,
  equipItem,
  unequipItem,
  fetchStudentInventory
} from '../data/shopStore'

const router = useRouter()
const studentId = computed(() => activeStudentIdForShop.value)

// ---------- ข้อมูลกระเป๋า / การสวมใส่ ----------
const myInventory = computed(() => studentInventory.value[studentId.value] || [])
const myEquipment = computed(() => getStudentEquipment(studentId.value))

onMounted(() => {
  fetchStudentInventory(studentId.value)
})

const currentStudent = computed(() => {
  return studentsList.value.find(s => s.studentId === studentId.value) || authUser.value || {}
})

// ---------- ระดับความหายาก (ใช้ทั้งช่องเก็บของและการ์ดรายละเอียด) ----------
const TIERS = {
  Common: { key: 'common', stars: 1, particles: 0, tilt: false },
  Epic: { key: 'epic', stars: 2, particles: 0, tilt: false },
  Legendary: { key: 'legendary', stars: 3, particles: 10, tilt: true },
  Secret: { key: 'secret', stars: 4, particles: 12, tilt: true },
  'Special Collection': { key: 'special', stars: 5, particles: 14, tilt: true },
}
const tier = (item) => TIERS[item.rarity] ?? TIERS.Common

const RARITY_ORDER = ['Special Collection', 'Secret', 'Legendary', 'Epic', 'Common']
const RARITY_LABEL = { 'Special Collection': 'Special', Secret: 'Secret', Legendary: 'Legendary', Epic: 'Epic', Common: 'Common' }

const rarityCounts = computed(() => {
  return RARITY_ORDER.map(r => ({
    rarity: r,
    key: TIERS[r].key,
    n: myInventory.value
      .filter(i => (TIERS[i.item.rarity] ? i.item.rarity : 'Common') === r)
      .reduce((sum, i) => sum + (i.count || 1), 0),
  })).filter(x => x.n > 0)
})

const totalItems = computed(() => myInventory.value.reduce((sum, i) => sum + (i.count || 1), 0))

// ---------- แท็บ ----------
const activeTab = ref('all')
const tabs = [
  { id: 'all', label: 'ทั้งหมด', icon: Package },
  { id: 'frame', label: 'กรอบโปรไฟล์', icon: User }
]

function getItemEquipType(item) {
  const type = item.itemType
  const category = item.category
  const imgStr = item.image || ''

  if (type === 'frame' || imgStr.includes('/img/frame/')) return 'frame'
  if (type === 'theme') return 'theme'
  if (type === 'pet' || category === 'สัตว์เลี้ยงคู่หู' || imgStr.includes('/img/Gacha/')) return 'pet'

  return null
}

const filteredInventory = computed(() => {
  if (activeTab.value === 'all') return myInventory.value

  return myInventory.value.filter(inv => {
    const equipType = getItemEquipType(inv.item)

    if (activeTab.value === 'frame' && equipType === 'frame') return true
    if (activeTab.value === 'pet' && equipType === 'pet') return true
    if (activeTab.value === 'theme' && equipType === 'theme') return true
    if (activeTab.value === 'other' && !equipType) return true
    return false
  })
})

// เรียงไอเทมหายากไว้ก่อน (ลบบรรทัดนี้ถ้าไม่อยากเรียง)
const sortedInventory = computed(() =>
  [...filteredInventory.value].sort((a, b) => tier(b.item).stars - tier(a.item).stars)
)

// ---------- ช่องเก็บของ (เติมช่องว่างให้ครบแถว) ----------
const ROW = 24
const capacityFor = (n) => Math.max(ROW, Math.ceil(n / ROW) * ROW)
const totalCapacity = computed(() => capacityFor(myInventory.value.length))
const slots = computed(() => {
  const list = sortedInventory.value
  return [...list, ...Array(capacityFor(list.length) - list.length).fill(null)]
})

// ---------- สวมใส่ ----------
function checkIsEquipped(invItem) {
  const type = getItemEquipType(invItem.item)

  if (type === 'frame') return myEquipment.value.frame?.id === invItem.item.id
  if (type === 'theme') return myEquipment.value.theme?.id === invItem.item.id
  if (type === 'pet') return myEquipment.value.pet?.id === invItem.item.id

  return false
}

async function handleEquipToggle(invItem) {
  const isEquipped = checkIsEquipped(invItem)
  const equipType = getItemEquipType(invItem.item)

  if (!equipType) return

  if (isEquipped) {
    await unequipItem(studentId.value, equipType)
  } else {
    await equipItem(studentId.value, invItem.item)
  }
}

function canEquip(invItem) {
  return getItemEquipType(invItem.item) !== null
}

const equipSlots = [
  { type: 'frame', label: 'กรอบ', icon: User },
  { type: 'pet', label: 'เร็วๆนี้', icon: CircleQuestionMark },
  { type: 'theme', label: 'เร็วๆนี้', icon: CircleQuestionMark },
]

// ---------- เลือกไอเทมเพื่อดูรายละเอียด ----------
const selectedId = ref(null)
const selectedInv = computed(() => myInventory.value.find(i => i.item.id === selectedId.value) || null)

function selectSlot(inv) {
  selectedId.value = inv.item.id
}
function selectEquipped(type) {
  const eq = myEquipment.value[type]
  if (!eq) return
  const found = myInventory.value.find(i => i.item.id === eq.id)
  if (found) selectedId.value = found.item.id
}

// ---------- เอฟเฟกต์การ์ด (จาก ShopView) ----------
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
  <div class="space-y-6 w-full px-4 sm:px-6 xl:px-8 mx-auto pb-20">

    <!-- Header -->
    <div class="flex items-center gap-3 pt-4 pb-2">
      <h1 class="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
        <Package class="w-6 h-6 text-emerald-600" />
        กระเป๋าของฉัน (Inventory)
      </h1>
    </div>

    <!-- 3 Columns Layout -->
    <div class="flex flex-col xl:flex-row gap-6 items-start">

      <!-- Left Column: ตัวละคร -->
      <div class="w-full xl:w-80 shrink-0 xl:self-stretch">

        <!-- Character card -->
        <div class="bg-white rounded-3xl border border-slate-300 shadow-md overflow-hidden relative">
          <div
            class="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-200 to-transparent opacity-40 pointer-events-none">
          </div>

          <div class="relative z-10 flex flex-col items-center px-6 pt-8 pb-5">
            <!-- Avatar + Frame -->
            <div class="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <img v-if="myEquipment.frame" :src="myEquipment.frame.image"
                class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-xl z-20 transition-all duration-300" />
              <div
                class="w-full h-full rounded-full bg-slate-100 border-[4px] border-white shadow-lg flex items-center justify-center text-4xl font-black text-slate-400 overflow-hidden relative z-10">
                <img
                  v-if="currentStudent.avatar && (currentStudent.avatar.includes('/') || currentStudent.avatar.includes('http'))"
                  :src="currentStudent.avatar" class="w-full h-full object-cover object-top" />
                <span v-else>{{ currentStudent.avatar || 'U' }}</span>
              </div>
            </div>

            <h2 class="text-xl font-black text-gray-800 tracking-tight mt-6">{{ currentStudent.name || 'ผู้ใช้งาน' }}
            </h2>
            <p class="text-slate-600 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 mt-2">
              {{ myEquipment.frame?.name || (currentStudent.equippedFrame ? 'กรอบรูปปัจจุบัน' : 'ไม่มีกรอบโปรไฟล์') }}
            </p>

            <!-- ช่องสวมใส่ -->
            <div class="w-full mt-5 pt-4 border-t border-slate-200">
              <p class="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 text-center mb-3">Equipment</p>
              <div class="flex justify-center gap-4">
                <button v-for="s in equipSlots" :key="s.type" class="eq-slot" :class="{ has: myEquipment[s.type] }"
                  :title="myEquipment[s.type]?.name || 'ยังไม่ได้สวมใส่'" @click="selectEquipped(s.type)">
                  <span class="eq-box">
                    <img v-if="myEquipment[s.type]?.image" :src="myEquipment[s.type].image" :alt="s.label" />
                    <component :is="s.icon" v-else class="w-6 h-6 text-emerald-300" />
                  </span>
                  <span class="eq-label">{{ s.label }}</span>
                </button>
              </div>
            </div>

            <!-- สรุปไอเทม -->
            <div class="w-full mt-5 grid grid-cols-2 gap-2 text-center">
              <div class="rounded-xl bg-slate-100 border border-slate-200 py-2">
                <p class="text-lg font-black text-slate-800 leading-none">{{ totalItems }}</p>
                <p class="text-[10px] font-bold text-slate-500 mt-1">ไอเทมทั้งหมด</p>
              </div>
              <div class="rounded-xl bg-slate-100 border border-slate-200 py-2">
                <p class="text-lg font-black text-slate-800 leading-none">{{ myInventory.length }}</p>
                <p class="text-[10px] font-bold text-slate-500 mt-1">ชนิดที่สะสม</p>
              </div>
            </div>

            <div v-if="rarityCounts.length" class="flex flex-wrap justify-center gap-1.5 mt-3">
              <span v-for="r in rarityCounts" :key="r.rarity" class="chip" :class="'c-' + r.key">
                <i class="gem-icon gem-inline"></i>{{ RARITY_LABEL[r.rarity] }} <b>{{ r.n }}</b>
              </span>
            </div>
          </div>
        </div>


      </div>

      <!-- Middle Column: ช่องเก็บของ -->
      <div class="flex-1 min-w-0 bg-white rounded-3xl border border-slate-300 shadow-md overflow-hidden w-full">
        <!-- Tabs -->
        <div class="flex overflow-x-auto border-b border-gray-100 bg-slate-50/50 p-2 gap-2 hide-scrollbar">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer"
            :class="activeTab === tab.id
              ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-b-4 border-transparent'">
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Slot board -->
        <div class="inv-board p-4 sm:p-6">
          <div v-if="filteredInventory.length === 0"
            class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 border border-slate-200 px-5 py-4">
            <div>
              <h3 class="text-base font-black text-slate-700">กระเป๋าว่างเปล่า</h3>
              <p class="text-sm text-slate-500">คุณยังไม่มีไอเทมในหมวดหมู่นี้ ลองไปสุ่มกล่อง Gacha หรือแวะร้านค้าดูสิ!
              </p>
            </div>
            <button @click="router.push('/shop')"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer">
              ไปที่ร้านค้า
            </button>
          </div>

          <div class="slot-grid">
            <template v-for="(inv, i) in slots" :key="inv ? inv.item.id : 'empty-' + i">
              <button v-if="inv" type="button" class="slot"
                :class="['c-' + tier(inv.item).key, { 'is-selected': selectedId === inv.item.id }]"
                @click="selectSlot(inv)" @dblclick="canEquip(inv) && handleEquipToggle(inv)">
                <img :src="inv.item.image" :alt="inv.item.name" loading="lazy" />
                <div class="absolute top-[0.4rem] right-[0.4rem] z-10">
                  <Tooltip :text="'ระดับ ' + inv.item.rarity" position="bottom" align="right">
                    <i class="gem-icon" aria-hidden="true"></i>
                  </Tooltip>
                </div>
                <span class="stars" aria-hidden="true">{{ '★'.repeat(tier(inv.item).stars) }}</span>
                <span v-if="inv.count > 1" class="cnt">x{{ inv.count }}</span>
                <span v-if="checkIsEquipped(inv)"
                  class="absolute top-1 left-1 z-10 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                  <Check class="w-3 h-3" />
                </span>
              </button>
              <div v-else class="slot-empty" aria-hidden="true"></div>
            </template>
          </div>

          <p class="text-center text-[11px] font-medium text-slate-400 mt-5">
            คลิกเพื่อดูรายละเอียด • ดับเบิลคลิกเพื่อสวมใส่ / ถอดออกอย่างรวดเร็ว
          </p>
        </div>
      </div>

      <!-- Right Column: รายละเอียดไอเทม -->
      <div class="w-full xl:w-80 shrink-0 xl:self-stretch">
        <!-- Inspect panel (มือถือ = bottom sheet) -->
        <div v-if="selectedInv" class="inspect-backdrop" @click="selectedId = null"></div>
        <div class="inspect" :class="{ 'inspect-open': selectedInv }">
          <div class="rounded-3xl border border-slate-300 bg-white shadow-md p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-slate-700 flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-slate-400" /> รายละเอียดไอเทม
              </h3>
              <button v-if="selectedInv" class="inspect-close" aria-label="ปิด" @click="selectedId = null">
                <X class="w-4 h-4" />
              </button>
            </div>

            <div v-if="selectedInv" class="inspect-inner">
              <div :key="selectedInv.item.id" class="rc-card group"
                :class="['rc-' + tier(selectedInv.item).key, checkIsEquipped(selectedInv) ? 'ring-2 ring-emerald-400 ring-offset-2' : '']"
                @pointermove="onTilt($event, selectedInv.item)" @pointerleave="resetTilt">

                <span class="rc-frame" aria-hidden="true"></span>

                <div class="rc-body">
                  <div v-if="checkIsEquipped(selectedInv)"
                    class="absolute top-2 left-2 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 class="w-3 h-3" />
                    ใส่อยู่
                  </div>

                  <div v-if="selectedInv.count > 1"
                    class="absolute top-2 right-2 z-20 bg-stone-900/80 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    x{{ selectedInv.count }}
                  </div>

                  <div class="rc-stage">
                    <div class="rc-aura" aria-hidden="true"></div>

                    <div v-if="tier(selectedInv.item).particles" class="rc-p" aria-hidden="true">
                      <i v-for="n in tier(selectedInv.item).particles" :key="n" :style="particleStyle(n)"></i>
                    </div>

                    <img :src="selectedInv.item.image" :alt="selectedInv.item.name" />

                    <div class="rc-foil" aria-hidden="true"></div>

                    <div class="rc-badge" style="top: auto; bottom: 0.75rem; right: 0.75rem;">
                      <span>{{ selectedInv.item.rarity }}</span>
                    </div>
                  </div>

                  <div class="mt-2 text-center px-2 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <h3 class="rc-title text-base font-black truncate leading-relaxed py-1"
                        :class="checkIsEquipped(selectedInv) ? 'text-emerald-600' : ''">
                        {{ selectedInv.item.name }}
                      </h3>
                      <div class="flex items-center justify-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                        <Package class="w-3 h-3" /> ได้จาก: {{ selectedInv.boxName }}
                      </div>
                    </div>
                  </div>

                  <div class="rc-actions mt-3 relative z-10 flex flex-col w-full px-2">
                    <button v-if="canEquip(selectedInv)" @click="handleEquipToggle(selectedInv)"
                      class="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      :class="checkIsEquipped(selectedInv)
                        ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1'">
                      <Check v-if="checkIsEquipped(selectedInv)" class="w-3.5 h-3.5" />
                      {{ checkIsEquipped(selectedInv) ? 'ถอดออก' : 'สวมใส่' }}
                    </button>
                    <div v-else
                      class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-50 text-slate-400 border border-slate-100 text-center flex items-center justify-center gap-1">
                      ใช้สิทธิ์ / กดใช้ไปแล้ว
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else
              class="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 py-10 px-4 text-center">
              <Package class="w-9 h-9 text-slate-400 mx-auto mb-2" />
              <p class="text-sm font-bold text-slate-600">เลือกไอเทมในช่องเก็บของ</p>
              <p class="text-xs text-slate-500 mt-1">เพื่อดูรายละเอียดและสวมใส่</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/shop-card.css';

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ===== สีประจำระดับ (ใช้ร่วมกันทั้งช่อง / chip / เพชร) ===== */
.c-common {
  --c: #cbd5e1;
}

.c-epic {
  --c: #a855f7;
}

.c-legendary {
  --c: #f59e0b;
}

.c-secret {
  --c: #f43f5e;
}

.c-special {
  --c: #a78bfa;
  --g: linear-gradient(135deg, #ff6ec7, #ffb86c, #fff48a, #7dffb2, #6ee7ff, #a78bfa);
}

/* ===== กระดานช่องเก็บของ ===== */
.inv-board {
  background:
    radial-gradient(rgba(16, 185, 129, .18) 1px, transparent 1.5px) 0 0 / 14px 14px,
    linear-gradient(180deg, #ecfdf5, #f0fdfa);
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .6rem;
}

@media (min-width: 768px) {
  .slot-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .slot-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: .7rem;
  }
}

/* ===== ช่องไอเทม ===== */
.slot {
  position: relative;
  aspect-ratio: 1;
  border-radius: .85rem;
  border: 2px solid var(--c);
  cursor: pointer;
  padding: 0;
  background:
    radial-gradient(circle at 50% 115%, color-mix(in srgb, var(--c) 30%, transparent), transparent 62%),
    linear-gradient(160deg, #fff, #e8eef5);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, .9),
    inset 0 -3px 0 rgba(15, 23, 42, .07),
    0 3px 0 rgba(15, 23, 42, .14);
  transition: transform .15s ease;
}

.slot:hover {
  transform: translateY(-2px);
}

.slot:active {
  transform: translateY(1px);
}

.slot:focus-visible {
  outline: 3px solid #0d9488;
  outline-offset: 2px;
}

.slot.is-selected {
  outline: 3px solid #10b981;
  outline-offset: 2px;
  transform: translateY(-3px) scale(1.04);
  z-index: 2;
}

.slot img {
  position: absolute;
  inset: 11%;
  width: 78%;
  height: 78%;
  object-fit: contain;
  filter: drop-shadow(0 3px 3px rgba(15, 23, 42, .25));
  pointer-events: none;
}

/* แสงเรืองรอบช่อง */
.slot.c-epic::after,
.slot.c-legendary::after,
.slot.c-secret::after,
.slot.c-special::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  box-shadow: 0 0 16px 2px var(--c);
  opacity: .3;
  pointer-events: none;
}

.slot.c-legendary::after,
.slot.c-secret::after,
.slot.c-special::after {
  animation: sl-breathe 2.2s ease-in-out infinite alternate;
}

/* Special: ขอบรุ้งไหล */
.slot.c-special {
  border-color: transparent;
  background:
    radial-gradient(circle at 50% 115%, rgba(167, 139, 250, .3), transparent 62%) padding-box,
    linear-gradient(160deg, #fff, #eef2ff) padding-box,
    var(--g) border-box;
  background-size: auto, auto, 300% 300%;
  animation: sl-rainbow 5s ease-in-out infinite alternate;
}

/* เพชรบอกระดับ, ดาว, จำนวน */
.gem-icon {
  display: block;
  width: .55rem;
  height: .55rem;
  border-radius: 2px;
  transform: rotate(45deg);
  background: var(--g, var(--c));
  box-shadow: 0 0 6px var(--c);
}

.stars {
  position: absolute;
  left: .3rem;
  bottom: .15rem;
  font-size: 8px;
  letter-spacing: -1px;
  line-height: 1;
  color: color-mix(in srgb, var(--c) 75%, #0f172a);
}

.cnt {
  position: absolute;
  right: .25rem;
  bottom: .2rem;
  font-size: 11px;
  font-weight: 900;
  line-height: 1.3;
  color: #fff;
  background: rgba(15, 23, 42, .82);
  padding: 0 .35rem;
  border-radius: .4rem;
}

/* ช่องว่าง */
.slot-empty {
  aspect-ratio: 1;
  border-radius: .85rem;
  border: 2px dashed rgba(148, 163, 184, .4);
  background: rgba(241, 245, 249, .7);
  box-shadow: inset 0 3px 6px rgba(15, 23, 42, .05);
}

/* chip สรุประดับ */
.chip {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-size: 10px;
  font-weight: 800;
  color: #475569;
  background: #fff;
  border: 1.5px solid var(--c);
  border-radius: 999px;
  padding: .15rem .55rem;
}

.chip b {
  color: #0f172a;
}

.gem-inline {
  position: static;
  display: inline-block;
  top: auto;
  right: auto;
  width: .45rem;
  height: .45rem;
}

/* ===== ช่องสวมใส่ (Equipment) ===== */
.eq-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .35rem;
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0;
}

.eq-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 1rem;
  border: 2px solid #a7f3d0;
  background: linear-gradient(160deg, #fff, #d1fae5);
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, .9), inset 0 -3px 0 rgba(16, 185, 129, .15), 0 3px 0 rgba(5, 150, 105, .25);
  transition: transform .15s ease;
}

.eq-slot:hover .eq-box {
  transform: translateY(-2px);
}

.eq-slot.has .eq-box {
  border-color: #10b981;
}

.eq-box img {
  position: absolute;
  inset: 8%;
  width: 84%;
  height: 84%;
  object-fit: contain;
}

.eq-label {
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: .04em;
}

/* ===== แผงรายละเอียด ===== */
.inspect-inner {
  max-width: 17rem;
  margin: 0 auto;
}

.inspect-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: .6rem;
  color: #64748b;
  background: #f1f5f9;
  cursor: pointer;
}

.inspect-close:hover {
  background: #e2e8f0;
}

.inspect-backdrop {
  display: none;
}

/* จอเล็ก: เป็น bottom sheet */
@media (max-width: 1279px) {
  .inspect {
    display: none;
  }

  .inspect.inspect-open {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    max-height: 88vh;
    overflow-y: auto;
    padding: .75rem;
    background: rgba(15, 23, 42, .0);
    animation: sl-sheet .3s cubic-bezier(.2, 1, .3, 1);
  }

  .inspect-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(15, 23, 42, .5);
  }
}

/* จอใหญ่: แผงลอยติดขอบ */
@media (min-width: 1280px) {
  .inspect {
    position: sticky;
    top: 1.5rem;
  }
}

@keyframes sl-breathe {
  from {
    opacity: .15;
  }

  to {
    opacity: .65;
  }
}

@keyframes sl-rainbow {
  from {
    background-position: 0% 50%;
  }

  to {
    background-position: 100% 50%;
  }
}

@keyframes sl-sheet {
  from {
    transform: translateY(100%);
  }

  to {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {

  .slot,
  .slot::after,
  .eq-box,
  .inspect {
    animation: none !important;
    transition: none !important;
  }
}
</style>