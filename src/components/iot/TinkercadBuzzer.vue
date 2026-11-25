<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  sizeClass: {
    type: String,
    default: 'w-20 h-20'
  }
})
</script>

<template>
  <svg viewBox="0 0 90 92" :class="[sizeClass, 'mx-auto overflow-visible']">
    <circle
      v-if="active"
      cx="45"
      cy="40"
      r="37"
      fill="none"
      stroke="#fbbf24"
      stroke-width="2"
      stroke-dasharray="6 4"
      class="animate-ping"
      style="transform-origin: 45px 40px;"
      opacity="0.7" />
    <circle
      v-if="active"
      cx="45"
      cy="40"
      r="33"
      fill="none"
      stroke="#f59e0b"
      stroke-width="1.5"
      opacity="0.8" />
    <line x1="31" y1="68" x2="31" y2="86" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
    <line x1="59" y1="68" x2="59" y2="86" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
    <circle
      cx="45"
      cy="40"
      r="30"
      fill="#2b2b2b"
      :stroke="active ? '#fbbf24' : '#52525b'"
      stroke-width="2" />
    <circle cx="45" cy="40" r="26" fill="none" stroke="#3f3f46" stroke-width="1" />
    <circle
      cx="45"
      cy="40"
      r="6.5"
      :fill="active ? '#eab308' : '#b8892c'"
      stroke="#713f12"
      stroke-width="1" />
  </svg>
</template>
