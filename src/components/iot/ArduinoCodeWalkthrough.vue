<script setup>
import { ref, computed } from 'vue'
import {
  FileText,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Code2,
  Layers
} from '@lucide/vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  accent: {
    type: String,
    default: 'emerald'
  },
  fullCode: {
    type: String,
    required: true
  },
  steps: {
    type: Array,
    required: true
  },
  highlighter: {
    type: Function,
    required: true
  }
})

const accentStyles = {
  emerald: {
    titleText: 'text-emerald-400',
    activePill: 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm',
    inactivePill: 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400/60 hover:text-white',
    stepCounter: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-700/60',
    nextBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
  },
  sky: {
    titleText: 'text-sky-400',
    activePill: 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm',
    inactivePill: 'bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400/60 hover:text-white',
    stepCounter: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    badge: 'bg-sky-950 text-sky-300 border-sky-700/60',
    nextBtn: 'bg-sky-500 hover:bg-sky-400 text-slate-950'
  },
  amber: {
    titleText: 'text-amber-400',
    activePill: 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm',
    inactivePill: 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white',
    stepCounter: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badge: 'bg-amber-950 text-amber-300 border-amber-700/60',
    nextBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950'
  },
  indigo: {
    titleText: 'text-indigo-400',
    activePill: 'bg-indigo-500 text-white border-indigo-400 shadow-sm',
    inactivePill: 'bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-400/60 hover:text-white',
    stepCounter: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
    nextBtn: 'bg-indigo-500 hover:bg-indigo-400 text-white'
  }
}

const theme = computed(() => accentStyles[props.accent] || accentStyles.emerald)

const viewMode = ref('steps')
const activeIndex = ref(0)
const copied = ref(false)

const currentStep = computed(() => props.steps[activeIndex.value] || props.steps[0] || null)

const selectStep = (index) => {
  if (index >= 0 && index < props.steps.length) {
    activeIndex.value = index
  }
}

const prevStep = () => {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1
  }
}

const nextStep = () => {
  if (activeIndex.value < props.steps.length - 1) {
    activeIndex.value += 1
  }
}

const copyFullCode = () => {
  navigator.clipboard.writeText(props.fullCode).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>

<template>
  <div class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg text-slate-100">
    <!-- Top Bar -->
    <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-mono font-bold flex items-center gap-2" :class="theme.titleText">
          <FileText class="w-4 h-4 shrink-0" />
          <span>{{ title }}</span>
        </span>
        <span v-if="subtitle" class="text-slate-400 text-[11px]">
          {{ subtitle }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Segmented Toggle: Steps vs Full Code -->
        <div class="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-700">
          <button
            type="button"
            @click="viewMode = 'steps'"
            class="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            :class="viewMode === 'steps' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          >
            <Layers class="w-3.5 h-3.5" />
            <span>ทีละส่วน</span>
          </button>
          <button
            type="button"
            @click="viewMode = 'full'"
            class="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            :class="viewMode === 'full' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
          >
            <Code2 class="w-3.5 h-3.5" />
            <span>ดูโค้ดเต็ม</span>
          </button>
        </div>

        <button
          type="button"
          @click="copyFullCode"
          class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
          <Copy v-else class="w-3.5 h-3.5" />
          <span>{{ copied ? 'คัดลอกโค้ดเต็มแล้ว' : 'คัดลอกโค้ดเต็ม' }}</span>
        </button>
      </div>
    </div>

    <!-- Step-by-Step Walkthrough Mode -->
    <div v-if="viewMode === 'steps' && currentStep" class="p-4 sm:p-5 space-y-4">
      <!-- Numbered Step Pills -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(step, index) in steps"
          :key="index"
          type="button"
          @click="selectStep(index)"
          class="px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all"
          :class="activeIndex === index ? theme.activePill : theme.inactivePill"
        >
          {{ index + 1 }}. {{ step.tabLabel }}
        </button>
      </div>

      <!-- Step Header & Plain Summary -->
      <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full border text-[11px] font-black" :class="theme.stepCounter">
            ส่วนที่ {{ activeIndex + 1 }} / {{ steps.length }}
          </span>
          <span v-if="currentStep.badge" class="px-2.5 py-0.5 rounded-full border text-[11px] font-bold" :class="theme.badge">
            {{ currentStep.badge }}
          </span>
        </div>
        <h4 class="text-base sm:text-lg font-black text-white">
          {{ currentStep.title }}
        </h4>
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {{ currentStep.summary }}
        </p>
      </div>

      <!-- Focused Syntax-Highlighted Code Block -->
      <div class="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div class="px-4 py-2 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center gap-3 text-[11px]">
          <span class="font-bold text-slate-200">สีสำคัญ:</span>
          <span class="text-amber-300 font-bold font-mono">while / if / return</span>
          <span class="text-cyan-300 font-bold font-mono">คำสั่งบอร์ด</span>
          <span class="text-rose-300 font-bold font-mono">ขา Pin / HIGH / LOW</span>
          <span class="text-orange-300 font-mono">ตัวเลข</span>
          <span class="text-emerald-300 font-mono">"ข้อความ"</span>
          <span class="text-sky-200 italic font-mono">// คำอธิบาย</span>
        </div>
        <div
          class="p-4 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto space-y-0.5"
          v-html="highlighter(currentStep.code)"
        ></div>
      </div>

      <!-- Line-by-Line Explanation -->
      <div v-if="currentStep.lines && currentStep.lines.length" class="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <div class="text-xs font-black text-slate-200 uppercase tracking-wider">
          เจาะลึกทีละบรรทัด
        </div>
        <div class="space-y-2.5">
          <div
            v-for="(line, lIdx) in currentStep.lines"
            :key="lIdx"
            class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80"
          >
            <code class="shrink-0 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-cyan-200 font-mono text-[11px] sm:text-xs whitespace-pre-wrap">
              {{ line.code }}
            </code>
            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed sm:pt-0.5">
              {{ line.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- Optional Important Tip Box -->
      <div
        v-if="currentStep.tip"
        class="rounded-xl bg-amber-950/40 border border-amber-500/40 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-amber-100 leading-relaxed"
      >
        <Lightbulb class="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <span class="font-black text-amber-300">จุดสำคัญที่ห้ามลืม: </span>
          <span>{{ currentStep.tip }}</span>
        </div>
      </div>

      <!-- Footer Step Navigation -->
      <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          @click="prevStep"
          :disabled="activeIndex === 0"
          class="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          :class="activeIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer'"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>ส่วนก่อนหน้า</span>
        </button>

        <span class="text-xs font-mono font-bold text-slate-300">
          ส่วนที่ {{ activeIndex + 1 }} จาก {{ steps.length }}
        </span>

        <button
          type="button"
          @click="nextStep"
          :disabled="activeIndex === steps.length - 1"
          class="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
          :class="activeIndex === steps.length - 1 ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed' : `${theme.nextBtn} cursor-pointer`"
        >
          <span>ส่วนถัดไป</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Full Code Mode -->
    <div v-else>
      <div class="px-4 py-2 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center gap-3 text-[11px]">
        <span class="font-bold text-slate-200">สีสำคัญ:</span>
        <span class="text-amber-300 font-bold font-mono">while / if / return</span>
        <span class="text-cyan-300 font-bold font-mono">คำสั่งบอร์ด</span>
        <span class="text-rose-300 font-bold font-mono">ขา Pin / HIGH / LOW</span>
        <span class="text-orange-300 font-mono">ตัวเลข</span>
        <span class="text-emerald-300 font-mono">"ข้อความ"</span>
        <span class="text-sky-200 italic font-mono">// คำอธิบาย</span>
      </div>
      <div
        class="p-5 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto space-y-0.5"
        v-html="highlighter(fullCode)"
      ></div>
    </div>
  </div>
</template>
