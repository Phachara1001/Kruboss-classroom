<script setup>
/**
 * ฉากซ้อนทับของมินิเกม: หน้าเริ่มเกม / นับถอยหลัง / Modal สรุปคะแนน
 */
import { Play, RotateCcw, Crown } from '@lucide/vue'
import { ARCADE_ACCENTS } from './arcadeTheme'

const props = defineProps({
  mode: { type: String, default: 'start' }, // 'start' | 'countdown' | 'over'
  accent: { type: String, default: 'emerald' },
  title: { type: String, default: '' },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  startLabel: { type: String, default: 'เริ่มเล่น' },
  overTitle: { type: String, default: 'จบเกม' },
  score: { type: Number, default: 0 },
  unit: { type: String, default: 'แต้ม' },
  count: { type: [Number, String], default: 3 },
  newRecord: { type: String, default: '' },
  bestWeekly: { type: Number, default: 0 },
  bestAllTime: { type: Number, default: 0 },
  hint: { type: String, default: '' }
})
const emit = defineEmits(['start'])

const theme = ARCADE_ACCENTS[props.accent] || ARCADE_ACCENTS.emerald
</script>

<template>
  <!-- นับถอยหลัง -->
  <div
    v-if="mode === 'countdown'"
    class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/55 pointer-events-none"
  >
    <div :key="count" class="arcade-count font-black text-white leading-none text-[9rem] sm:text-[12rem] drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
      {{ count }}
    </div>
    <p class="mt-2 text-sm sm:text-base font-bold tracking-[0.3em] uppercase" :class="theme.text">เตรียมตัว</p>
  </div>

  <!-- หน้าเริ่มเกม / สรุปผล -->
  <div
    v-else
    class="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-[3px]"
  >
    <div class="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/60 overflow-hidden arcade-pop">
      <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent pointer-events-none" :class="theme.glow"></div>

      <div class="relative p-6 sm:p-8 text-center text-white">
        <!-- เริ่มเกม -->
        <template v-if="mode === 'start'">
          <div v-if="logo" class="mb-3 flex justify-center">
            <img :src="logo" :alt="title" class="max-h-24 max-w-[220px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
          </div>
          <p v-else class="text-[11px] font-bold tracking-[0.3em] uppercase mb-2" :class="theme.text">Ready to play</p>
          <h2 class="text-2xl sm:text-3xl font-black mb-2">{{ title }}</h2>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{{ description }}</p>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="rounded-2xl bg-white/5 border border-white/10 py-3">
              <div class="text-[11px] text-slate-400 mb-0.5">สถิติสัปดาห์นี้</div>
              <div class="font-mono font-black text-xl" :class="theme.textStrong">{{ bestWeekly }}</div>
            </div>
            <div class="rounded-2xl bg-white/5 border border-white/10 py-3">
              <div class="text-[11px] text-slate-400 mb-0.5">สถิติตลอดกาล</div>
              <div class="font-mono font-black text-xl" :class="theme.textStrong">{{ bestAllTime }}</div>
            </div>
          </div>

          <button
            type="button"
            @click.stop="emit('start')"
            class="w-full px-6 py-3.5 rounded-2xl font-black text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            :class="theme.button"
          >
            <Play class="w-5 h-5 fill-current" /> {{ startLabel }}
          </button>
          <p v-if="hint" class="mt-3 text-[11px] text-slate-500">{{ hint }}</p>
        </template>

        <!-- สรุปผล -->
        <template v-else>
          <p class="text-[11px] font-bold tracking-[0.3em] uppercase mb-2 text-slate-400">Game over</p>
          <h2 class="text-2xl sm:text-3xl font-black mb-5">{{ overTitle }}</h2>

          <div class="rounded-2xl bg-white/5 border border-white/10 py-5 mb-4">
            <div class="text-xs text-slate-400 mb-1">คะแนนรอบนี้</div>
            <div class="font-mono font-black text-6xl leading-none" :class="theme.textStrong">{{ score }}</div>
            <div class="text-xs text-slate-400 mt-2">{{ unit }}</div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-5 text-xs">
            <div class="rounded-xl bg-white/5 border border-white/10 py-2.5">
              <div class="text-slate-400">สูงสุดสัปดาห์นี้</div>
              <div class="font-mono font-black text-base text-white">{{ Math.max(bestWeekly, score) }}</div>
            </div>
            <div class="rounded-xl bg-white/5 border border-white/10 py-2.5">
              <div class="text-slate-400">สูงสุดตลอดกาล</div>
              <div class="font-mono font-black text-base text-white">{{ Math.max(bestAllTime, score) }}</div>
            </div>
          </div>

          <p
            v-if="newRecord"
            class="mb-5 px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5"
            :class="theme.soft"
          >
            <Crown class="w-4 h-4" /> {{ newRecord }}
          </p>

          <button
            type="button"
            @click.stop="emit('start')"
            class="w-full px-6 py-3.5 rounded-2xl font-black text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            :class="theme.button"
          >
            <RotateCcw class="w-5 h-5" /> เล่นใหม่
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arcade-count {
  animation: arcade-count-pop 0.8s ease-out both;
}
.arcade-pop {
  animation: arcade-pop-in 0.22s ease-out both;
}
@keyframes arcade-count-pop {
  0% { transform: scale(1.7); opacity: 0; }
  35% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.85; }
}
@keyframes arcade-pop-in {
  from { transform: translateY(10px) scale(0.97); opacity: 0; }
  to { transform: none; opacity: 1; }
}
</style>
