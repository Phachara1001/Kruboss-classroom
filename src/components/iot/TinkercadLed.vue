<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'red'
  },
  on: {
    type: Boolean,
    default: false
  },
  sizeClass: {
    type: String,
    default: 'w-14 h-16'
  }
})

const COLOR_PALETTE = {
  red: {
    haloOuter: 'rgba(239, 68, 68, 0.38)',
    haloInner: 'rgba(248, 113, 113, 0.48)',
    onFill: '#ef4444',
    offFill: '#7f1d1d',
    onStroke: '#fecaca',
    offStroke: '#991b1b',
    coreFill: '#fca5a5'
  },
  green: {
    haloOuter: 'rgba(34, 197, 94, 0.35)',
    haloInner: 'rgba(74, 222, 128, 0.45)',
    onFill: '#22c55e',
    offFill: '#14532d',
    onStroke: '#bbf7d0',
    offStroke: '#166534',
    coreFill: '#86efac'
  },
  yellow: {
    haloOuter: 'rgba(250, 204, 21, 0.38)',
    haloInner: 'rgba(253, 224, 71, 0.48)',
    onFill: '#eab308',
    offFill: '#713f12',
    onStroke: '#fef08a',
    offStroke: '#854d0e',
    coreFill: '#fef9c3'
  },
  blue: {
    haloOuter: 'rgba(56, 189, 248, 0.38)',
    haloInner: 'rgba(125, 211, 252, 0.48)',
    onFill: '#0ea5e9',
    offFill: '#0c4a6e',
    onStroke: '#bae6fd',
    offStroke: '#075985',
    coreFill: '#e0f2fe'
  }
}

const palette = computed(() => COLOR_PALETTE[props.color] || COLOR_PALETTE.red)
</script>

<template>
  <svg viewBox="0 0 60 64" :class="[sizeClass, 'mx-auto overflow-visible']">
    <circle v-if="on" cx="30" cy="24" r="26" :fill="palette.haloOuter" />
    <circle v-if="on" cx="30" cy="24" r="17" :fill="palette.haloInner" />
    <line x1="25" y1="38" x2="25" y2="54" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
    <line x1="35" y1="38" x2="35" y2="58" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
    <path
      d="M 20,34 L 20,20 A 10,10 0 0 1 40,20 L 40,34 L 42,34 L 42,38 L 18,38 L 18,34 Z"
      :fill="on ? palette.onFill : palette.offFill"
      :stroke="on ? palette.onStroke : palette.offStroke"
      stroke-width="1.2" />
    <ellipse v-if="on" cx="30" cy="23" rx="5" ry="7" :fill="palette.coreFill" opacity="0.85" />
    <path
      d="M 23,22 A 7,7 0 0 1 28,14"
      fill="none"
      stroke="rgba(255,255,255,0.45)"
      stroke-width="1.8"
      stroke-linecap="round" />
  </svg>
</template>
