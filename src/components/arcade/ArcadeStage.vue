<script setup>
/**
 * กรอบเวทีเล่นเกมกลาง (ใช้ร่วมกันทั้ง 3 มินิเกม)
 * - แถบหัวเกม + HUD (slot "hud")
 * - พื้นที่เล่นอัตราส่วน 16:10 ขนาดใหญ่ + ปุ่มเต็มจอ
 * - slot เริ่มต้น = canvas / overlay ของแต่ละเกม
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Volume2, VolumeX, Maximize, Minimize } from '@lucide/vue'
import { ARCADE_ACCENTS } from './arcadeTheme'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  accent: { type: String, default: 'emerald' },
  soundOn: { type: Boolean, default: true }
})
const emit = defineEmits(['update:soundOn'])

const theme = ARCADE_ACCENTS[props.accent] || ARCADE_ACCENTS.emerald
const stageRef = ref(null)
const isFullscreen = ref(false)

const syncFullscreen = () => {
  isFullscreen.value = document.fullscreenElement === stageRef.value
}

const toggleFullscreen = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await stageRef.value?.requestFullscreen?.()
  } catch (e) { /* บางเบราว์เซอร์ไม่รองรับ */ }
}

onMounted(() => document.addEventListener('fullscreenchange', syncFullscreen))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', syncFullscreen))
</script>

<template>
  <div class="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 select-none">
    <!-- แถบหัวเกม -->
    <div class="px-4 sm:px-5 py-3 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-1.5 h-9 rounded-full shrink-0" :class="theme.dot"></span>
        <div class="min-w-0">
          <h3 class="font-black text-base sm:text-lg text-white leading-tight truncate">{{ title }}</h3>
          <p class="text-[11px] sm:text-xs text-slate-400 truncate">{{ subtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <slot name="hud" />

        <button
          type="button"
          @click="emit('update:soundOn', !soundOn)"
          class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          :title="soundOn ? 'ปิดเสียง' : 'เปิดเสียง'"
        >
          <Volume2 v-if="soundOn" class="w-4 h-4" />
          <VolumeX v-else class="w-4 h-4 text-rose-400" />
        </button>

        <button
          type="button"
          @click="toggleFullscreen"
          class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          :title="isFullscreen ? 'ออกจากเต็มจอ' : 'เล่นเต็มจอ'"
        >
          <Minimize v-if="isFullscreen" class="w-4 h-4" />
          <Maximize v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- พื้นที่เล่น (16:10) -->
    <div
      ref="stageRef"
      class="relative w-full bg-black overflow-hidden touch-none flex items-center justify-center"
      :class="isFullscreen ? 'h-screen' : 'aspect-[16/10] max-h-[calc(100vh-11rem)] min-h-[320px]'"
    >
      <slot />
    </div>
  </div>
</template>
