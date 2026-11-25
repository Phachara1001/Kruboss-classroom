<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  pressed: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  sizeClass: {
    type: String,
    default: 'w-16 h-16'
  },
  ariaLabel: {
    type: String,
    default: 'Tinkercad Push Button'
  }
})

const emit = defineEmits(['press', 'hold-start', 'hold-end'])

const isDown = ref(false)
const isDepressed = computed(() => props.pressed || isDown.value)

const handlePointerDown = (e) => {
  isDown.value = true
  e.currentTarget.setPointerCapture?.(e.pointerId)
  emit('hold-start')
}

const handlePointerUp = () => {
  if (!isDown.value) return
  isDown.value = false
  emit('hold-end')
}
</script>

<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    @click="emit('press')"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @pointerleave="handlePointerUp"
    class="inline-flex items-center justify-center rounded-xl p-1 touch-none select-none cursor-pointer transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
    <svg viewBox="0 0 80 80" :class="[sizeClass, 'overflow-visible']">
      <!-- Optional subtle active status ring -->
      <rect
        v-if="active"
        x="10"
        y="10"
        width="60"
        height="60"
        rx="8"
        fill="none"
        stroke="rgba(52, 211, 153, 0.7)"
        stroke-width="2" />

      <!-- 4 Tactile Switch Metallic Legs (2 Top, 2 Bottom) -->
      <path d="M 22,14 L 22,5 M 19,5 L 25,5" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 58,14 L 58,5 M 55,5 L 61,5" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 22,66 L 22,75 M 19,75 L 25,75" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 58,66 L 58,75 M 55,75 L 61,75" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" />

      <!-- Square Metallic Housing -->
      <rect x="14" y="14" width="52" height="52" rx="5" fill="#d4d4d8" stroke="#71717a" stroke-width="1.5" />
      <rect x="17" y="17" width="46" height="46" rx="3.5" fill="#e4e4e7" stroke="#a1a1aa" stroke-width="0.8" />

      <!-- 4 Corner Rivets -->
      <circle cx="23" cy="23" r="4.2" fill="#3f3f46" stroke="#27272a" stroke-width="0.8" />
      <circle cx="57" cy="23" r="4.2" fill="#3f3f46" stroke="#27272a" stroke-width="0.8" />
      <circle cx="23" cy="57" r="4.2" fill="#3f3f46" stroke="#27272a" stroke-width="0.8" />
      <circle cx="57" cy="57" r="4.2" fill="#3f3f46" stroke="#27272a" stroke-width="0.8" />

      <!-- Center Tactile Plunger -->
      <g
        :style="{
          transform: isDepressed ? 'translateY(1.5px) scale(0.93)' : 'translateY(0px) scale(1)',
          transformOrigin: '40px 40px',
          transition: 'transform 80ms ease'
        }">
        <circle cx="40" cy="40" r="15" fill="#18181b" />
        <circle cx="40" cy="40" r="13.5" fill="#27272a" stroke="#52525b" stroke-width="1" />
        <path
          d="M 31,34 A 11,11 0 0 1 44,29"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          stroke-width="2"
          stroke-linecap="round" />
      </g>
    </svg>
  </button>
</template>
