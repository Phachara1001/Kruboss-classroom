<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  isRewardModalOpen,
  currentReward,
  pendingRewards,
  dismissCurrentReward,
  triggerCelebrationConfetti
} from '../data/rewardNotificationStore'
import {
  X,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  FileText,
  CheckCircle2,
  ChevronRight,
  FlaskConical
} from '@lucide/vue'

const hasMultiple = computed(() => pendingRewards.value.length > 1)
const totalCount = computed(() => pendingRewards.value.length)

const handleClaim = () => dismissCurrentReward()
const handleReplayConfetti = () => triggerCelebrationConfetti()

/* ---------- Sparkle config (positions are % of the sparkle layer) ---------- */
const glints = [
  { x: 12, y: 14, s: 24, d: 0, t: 2.4 },
  { x: 76, y: 8, s: 18, d: 0.6, t: 2.1 },
  { x: 88, y: 44, s: 12, d: 1.2, t: 2.8 },
  { x: 80, y: 76, s: 22, d: 0.3, t: 2.6 },
  { x: 10, y: 72, s: 16, d: 0.9, t: 2.2 },
  { x: 2, y: 40, s: 11, d: 1.5, t: 3.0 },
  { x: 48, y: 0, s: 13, d: 1.8, t: 2.5 },
  { x: 55, y: 90, s: 11, d: 0.4, t: 2.7 },
  { x: 33, y: 29, s: 15, d: 1.0, t: 2.3 },
  { x: 62, y: 58, s: 12, d: 1.7, t: 2.9 }
]
const dust = [
  { l: 20, d: 0, t: 3.6, s: 3 },
  { l: 35, d: 1.2, t: 4.2, s: 2 },
  { l: 50, d: 0.6, t: 3.8, s: 3 },
  { l: 65, d: 1.8, t: 4.4, s: 2 },
  { l: 78, d: 0.3, t: 3.4, s: 3 },
  { l: 28, d: 2.4, t: 4.0, s: 2 },
  { l: 58, d: 2.9, t: 3.7, s: 2 },
  { l: 72, d: 2.1, t: 4.6, s: 3 }
]
const GLINT_PATH =
  'M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z'

/* ---------- Score ring ---------- */
const RING_C = 2 * Math.PI * 26
const maxScore = computed(() => Number(currentReward.value?.maxScore) || 10)
const score = computed(() => Number(currentReward.value?.score) || 0)
const pct = computed(() => Math.min(1, Math.max(0, score.value / maxScore.value)))
const ringReady = ref(false)
const ringOffset = computed(() => (ringReady.value ? RING_C * (1 - pct.value) : RING_C))

/* ---------- Coin count-up ---------- */
const displayCoins = ref(0)
let rafId = null
let startTimer = null
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const runCountUp = (target) => {
  cancelAnimationFrame(rafId)
  clearTimeout(startTimer)
  const end = Number(target) || 0
  ringReady.value = false

  if (prefersReduced() || end <= 0) {
    displayCoins.value = end
    ringReady.value = true
    return
  }

  displayCoins.value = 0
  startTimer = setTimeout(() => {
    ringReady.value = true
    const duration = 1000
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      displayCoins.value = Math.round(end * eased)
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
  }, 550)
}

const claimBtn = ref(null)

watch(
  () => [isRewardModalOpen.value, currentReward.value],
  ([open, reward]) => {
    if (open && reward) {
      runCountUp(reward.coins)
      nextTick(() => claimBtn.value?.focus())
    }
  },
  { immediate: true }
)

/* ---------- Esc to close ---------- */
const onKey = (e) => {
  if (e.key === 'Escape' && isRewardModalOpen.value) handleClaim()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(rafId)
  clearTimeout(startTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="reward-fade">
      <div v-if="isRewardModalOpen && currentReward"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-amber-400 selection:text-slate-950"
        role="dialog" aria-modal="true" aria-labelledby="reward-title">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-[#04100c]/85 backdrop-blur-md" @click="handleClaim"></div>

        <div class="relative w-full max-w-md my-auto reward-enter">
          <!-- Stacked cards behind = more rewards waiting -->
          <template v-if="hasMultiple">
            <div class="absolute inset-x-10 -bottom-4 h-full rounded-[28px] bg-[#0a1a14] border border-amber-200/10">
            </div>
            <div class="absolute inset-x-5 -bottom-2 h-full rounded-[28px] bg-[#0d221a] border border-amber-200/10">
            </div>
          </template>

          <!-- Card -->
          <div
            class="relative rounded-[28px] overflow-hidden shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7),0_0_70px_rgba(242,181,68,0.18)] ring-1 ring-amber-200/20">

            <!-- ============ HERO (dark) ============ -->
            <div class="hero relative px-6 pt-6 pb-10 sm:px-8 text-center text-white">
              <!-- Rotating light rays: the one memorable moment -->
              <div class="rays pointer-events-none absolute left-1/2 top-[148px] -translate-x-1/2 -translate-y-1/2">
              </div>

              <!-- Top bar -->
              <div class="relative z-10 flex items-center justify-between min-h-[36px]">
                <div v-if="currentReward.isTest"
                  class="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  <FlaskConical class="w-3.5 h-3.5" />
                  <span>โหมดทดสอบตัวอย่าง</span>
                </div>
                <div v-else-if="hasMultiple"
                  class="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>รอรับอีก {{ totalCount }} รายการ</span>
                </div>
                <div v-else></div>

                <button @click="handleClaim"
                  class="p-2 -mr-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                  aria-label="ปิดหน้าต่าง" title="ปิดหน้าต่าง">
                  <X class="w-5 h-5" />
                </button>
              </div>

              <!-- Coin -->
              <button type="button"
                class="coin-wrap relative z-10 mx-auto mt-1 flex h-40 w-40 items-center justify-center cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 rounded-full"
                @click="handleReplayConfetti" title="คลิกเพื่อโปรยพลุกระดาษอีกครั้ง" aria-label="โปรยพลุกระดาษอีกครั้ง">
                <span class="coin-glow absolute inset-2 rounded-full"></span>

                <span class="coin-float relative block">
                  <span
                    class="coin block select-none text-[104px] leading-none transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-95">🪙</span>
                </span>

                <!-- Sparkle layer -->
                <span class="pointer-events-none absolute -inset-8" aria-hidden="true">
                  <svg v-for="(g, i) in glints" :key="'g' + i" viewBox="0 0 24 24" class="glint absolute"
                    :style="{ left: g.x + '%', top: g.y + '%', width: g.s + 'px', height: g.s + 'px', animationDelay: g.d + 's', animationDuration: g.t + 's' }">
                    <path :d="GLINT_PATH" fill="#fff8d6" />
                  </svg>
                  <i v-for="(p, i) in dust" :key="'p' + i" class="dust absolute block rounded-full"
                    :style="{ left: p.l + '%', width: p.s + 'px', height: p.s + 'px', animationDelay: p.d + 's', animationDuration: p.t + 's' }"></i>
                </span>
              </button>

              <!-- Status -->
              <div
                class="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3.5 py-1 text-sm font-semibold text-amber-200 ring-1 ring-white/10">
                <Award v-if="currentReward.isUpgrade" class="h-4 w-4" />
                <Trophy v-else class="h-4 w-4" />
                <span>{{ currentReward.isUpgrade ? 'เกรดของคุณเลื่อนระดับ' : 'ภารกิจสำเร็จ' }}</span>
              </div>

              <h2 id="reward-title"
                class="relative z-10 mt-3 text-[26px] sm:text-3xl font-black leading-tight tracking-tight">
                ยินดีด้วย! คุณได้รับเหรียญรางวัล
              </h2>

              <!-- Amount -->
              <div class="relative z-10 mt-4 flex items-baseline justify-center gap-2">
                <span class="amount text-6xl sm:text-7xl font-black leading-none tabular-nums">+{{ displayCoins
                  }}</span>
                <span class="text-xl font-extrabold text-amber-200/90">Coins</span>
              </div>
            </div>

            <!-- ============ SLIP (ivory, tear-off receipt) ============ -->
            <div class="slip relative px-6 pb-6 pt-8 sm:px-8 sm:pb-7">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1d5a43] text-amber-100">
                    <FileText class="h-4.5 w-4.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-[#6b6a58]">ชื่องานที่ส่ง</p>
                    <p class="line-clamp-2 text-[15px] font-bold leading-snug text-[#17261f]">
                      {{ currentReward.assignmentTitle }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9d9a6] text-[#6a4b0f]">
                    <BookOpen class="h-4.5 w-4.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-[#6b6a58]">รายวิชา</p>
                    <p class="truncate text-sm font-bold text-[#17261f]">
                      {{ currentReward.courseName }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Score -->
              <div class="mt-5 flex items-center gap-4 rounded-2xl border border-[#17261f]/10 bg-white/60 p-3.5">
                <div class="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 64 64" class="h-16 w-16 -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#e4d9b6" stroke-width="7" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#1f8a5b" stroke-width="7" stroke-linecap="round"
                      :stroke-dasharray="RING_C" :stroke-dashoffset="ringOffset" class="ring-progress" />
                  </svg>
                  <span
                    class="absolute inset-0 flex items-center justify-center text-lg font-black tabular-nums text-[#17261f]">
                    {{ currentReward.score }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-[#6b6a58]">
                    <CheckCircle2 class="h-4 w-4 text-[#1f8a5b]" />
                    <span>ผลการประเมินจากผู้สอน</span>
                  </div>
                  <p class="mt-0.5 text-base font-black text-[#17261f]">
                    {{ currentReward.score }}
                    <span class="font-semibold text-[#6b6a58]">/ {{ maxScore }} คะแนน</span>
                  </p>
                </div>
              </div>

              <!-- Claim -->
              <button ref="claimBtn" @click="handleClaim"
                class="claim group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-black text-[#2a1b00] transition-all active:scale-[0.98] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d5a43]">
                <span>{{ hasMultiple ? 'รับเหรียญ และดูรายการถัดไป' : 'รับเหรียญรางวัล' }}</span>
                <ChevronRight v-if="hasMultiple" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
                <CheckCircle2 v-else class="h-5 w-5" />
              </button>

              <p class="mt-3 text-center text-xs text-[#6b6a58]">
                เหรียญถูกบันทึกเข้ากระเป๋าของคุณแล้ว นำไปแลกของรางวัลในร้านค้าได้ทันที
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  background:
    radial-gradient(120% 70% at 50% 18%, rgba(242, 181, 68, 0.22), transparent 60%),
    linear-gradient(180deg, #123226 0%, #0c241b 100%);
}

.rays {
  width: 560px;
  height: 560px;
  background: repeating-conic-gradient(from 0deg,
      rgba(255, 214, 120, 0.16) 0deg 7deg,
      transparent 7deg 22deg);
  -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 62%);
  mask-image: radial-gradient(circle, #000 0%, transparent 62%);
  animation: spin 28s linear infinite;
}

/* ---------- Coin ---------- */
.coin-wrap {
  perspective: 700px;
}

.coin {
  filter: drop-shadow(0 10px 18px rgba(242, 181, 68, 0.55)) drop-shadow(0 0 22px rgba(255, 214, 110, 0.45));
}

.coin-wrap .coin {
  animation: coinIn 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.1) 0.15s both;
}

.coin-float {
  animation: bob 3.6s ease-in-out 1.2s infinite;
}

.coin-glow {
  background: radial-gradient(circle, rgba(255, 214, 110, 0.6), transparent 68%);
  filter: blur(10px);
  animation: glowPulse 2.8s ease-in-out infinite;
}

/* sparkles */
.glint {
  opacity: 0;
  filter: drop-shadow(0 0 6px rgba(255, 214, 110, 0.95)) drop-shadow(0 0 2px #fff);
  animation: glint ease-in-out infinite;
}

.dust {
  bottom: 22%;
  opacity: 0;
  background: #ffe9a0;
  box-shadow: 0 0 6px 1px rgba(255, 214, 110, 0.9);
  animation: rise linear infinite;
}

/* ---------- Amount ---------- */
.amount {
  background: linear-gradient(180deg, #fff3c4 0%, #f6c458 60%, #e39a1e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 4px 14px rgba(242, 181, 68, 0.35));
}

/* ---------- Slip ---------- */
.slip {
  background:
    radial-gradient(circle at 50% 0, #0c241b 9px, transparent 10px) 0 0 / 22px 14px repeat-x,
    #fbf3dc;
}

.ring-progress {
  transition: stroke-dashoffset 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.claim {
  background: linear-gradient(180deg, #ffd978 0%, #f2b544 100%);
  box-shadow:
    0 8px 20px -6px rgba(214, 140, 20, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.claim:hover {
  background: linear-gradient(180deg, #ffe39a 0%, #f6c458 100%);
  box-shadow:
    0 10px 24px -6px rgba(214, 140, 20, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* ---------- Motion ---------- */
.reward-enter {
  animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes coinIn {
  0% {
    transform: rotateY(-540deg) scale(0.4);
    opacity: 0;
  }

  70% {
    opacity: 1;
  }

  100% {
    transform: rotateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes glint {

  0%,
  100% {
    opacity: 0;
    transform: scale(0.2) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }
}

@keyframes rise {
  0% {
    opacity: 0;
    transform: translateY(0);
  }

  20% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translateY(-110px);
  }
}

@keyframes bob {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes glowPulse {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

.reward-fade-enter-active,
.reward-fade-leave-active {
  transition: opacity 0.3s ease;
}

.reward-fade-enter-from,
.reward-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

  .rays,
  .coin-float,
  .coin-glow,
  .reward-enter,
  .coin-wrap .coin {
    animation: none;
  }

  .glint {
    animation: none;
    opacity: 0.85;
    transform: scale(0.8);
  }

  .dust {
    display: none;
  }

  .ring-progress {
    transition: none;
  }
}
</style>