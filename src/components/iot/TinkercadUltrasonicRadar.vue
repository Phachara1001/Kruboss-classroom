<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  distance: {
    type: Number,
    default: 45
  },
  threshold: {
    type: Number,
    default: 30
  },
  enabled: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:distance'])

const radarSvgRef = ref(null)
const isDraggingDot = ref(false)
const dotAngleDeg = ref(0)

const RADAR_CX = 180
const RADAR_CY = 225
const RADAR_R_MIN = 35
const RADAR_R_MAX = 195

const cmToRadius = (cm) => RADAR_R_MIN + ((cm - 5) / 95) * (RADAR_R_MAX - RADAR_R_MIN)

const polarToCartesian = (deg, r) => {
  const rad = (deg * Math.PI) / 180
  return {
    x: RADAR_CX + r * Math.sin(rad),
    y: RADAR_CY - r * Math.cos(rad)
  }
}

const conePath = (rInner, rOuter, halfAngleDeg = 35) => {
  const p1 = polarToCartesian(-halfAngleDeg, rOuter)
  const p2 = polarToCartesian(halfAngleDeg, rOuter)
  const p3 = polarToCartesian(halfAngleDeg, rInner)
  const p4 = polarToCartesian(-halfAngleDeg, rInner)
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${rOuter} ${rOuter} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} A ${rInner} ${rInner} 0 0 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)} Z`
}

const dotPos = computed(() => polarToCartesian(dotAngleDeg.value, cmToRadius(props.distance)))
const dangerRadius = computed(() => cmToRadius(props.threshold))
const safeConePath = conePath(RADAR_R_MIN, RADAR_R_MAX, 35)
const dangerConePath = computed(() => conePath(RADAR_R_MIN, dangerRadius.value, 35))
const thresholdArcPath = computed(() => {
  const r = dangerRadius.value
  const pStart = polarToCartesian(-35, r)
  const pEnd = polarToCartesian(35, r)
  return `M ${pStart.x.toFixed(2)} ${pStart.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${pEnd.x.toFixed(2)} ${pEnd.y.toFixed(2)}`
})
const thresholdLabelPos = computed(() => polarToCartesian(35, dangerRadius.value))
const isDanger = computed(() => props.enabled && props.distance > 0 && props.distance < props.threshold)

const updateDotFromPointer = (e) => {
  if (!radarSvgRef.value) return
  const rect = radarSvgRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const svgX = ((e.clientX - rect.left) * 360) / rect.width
  const svgY = ((e.clientY - rect.top) * 280) / rect.height
  const dx = svgX - RADAR_CX
  const dy = Math.max(10, RADAR_CY - svgY)

  const rawAngleDeg = (Math.atan2(dx, dy) * 180) / Math.PI
  dotAngleDeg.value = Math.max(-32, Math.min(32, rawAngleDeg))

  const rawR = Math.hypot(dx, dy)
  const clampedR = Math.max(RADAR_R_MIN, Math.min(RADAR_R_MAX, rawR))
  const nextCm = Math.round(5 + ((clampedR - RADAR_R_MIN) / (RADAR_R_MAX - RADAR_R_MIN)) * 95)
  emit('update:distance', nextCm)
}

const onPointerDown = (e) => {
  isDraggingDot.value = true
  e.currentTarget.setPointerCapture?.(e.pointerId)
  updateDotFromPointer(e)
}

const onPointerMove = (e) => {
  if (!isDraggingDot.value) return
  updateDotFromPointer(e)
}

const onPointerUp = () => {
  isDraggingDot.value = false
}
</script>

<template>
  <svg
    ref="radarSvgRef"
    viewBox="0 0 360 280"
    class="w-full h-auto block touch-none select-none"
    :class="isDraggingDot ? 'cursor-grabbing' : 'cursor-pointer'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp">
    <!-- Detection cone -->
    <path
      :d="safeConePath"
      :fill="enabled ? 'rgba(16, 185, 129, 0.14)' : 'rgba(148, 163, 184, 0.08)'"
      :stroke="enabled ? 'rgba(52, 211, 153, 0.35)' : 'rgba(148, 163, 184, 0.2)'"
      stroke-width="1" />

    <!-- Danger zone overlay cone -->
    <path
      :d="dangerConePath"
      :fill="enabled ? 'rgba(244, 63, 94, 0.24)' : 'rgba(148, 163, 184, 0.08)'" />

    <!-- Danger threshold arc -->
    <path
      :d="thresholdArcPath"
      fill="none"
      :stroke="enabled ? '#fb7185' : '#64748b'"
      stroke-width="1.5"
      stroke-dasharray="5 4" />
    <text
      :x="thresholdLabelPos.x + 6"
      :y="thresholdLabelPos.y + 4"
      :fill="enabled ? '#fda4af' : '#94a3b8'"
      font-size="10"
      font-family="monospace"
      font-weight="bold">
      &lt; {{ threshold }}cm
    </text>

    <!-- Two dashed ultrasonic echo lines -->
    <line
      x1="154"
      y1="240"
      :x2="dotPos.x"
      :y2="dotPos.y"
      :stroke="!enabled ? '#64748b' : isDanger ? '#fb7185' : '#38bdf8'"
      stroke-width="2"
      stroke-dasharray="6 5"
      :opacity="enabled ? '0.85' : '0.4'" />
    <line
      x1="206"
      y1="240"
      :x2="dotPos.x"
      :y2="dotPos.y"
      :stroke="!enabled ? '#64748b' : isDanger ? '#fb7185' : '#38bdf8'"
      stroke-width="2"
      stroke-dasharray="6 5"
      :opacity="enabled ? '0.85' : '0.4'" />

    <!-- Distance readout label above sensor -->
    <text
      x="180"
      y="214"
      text-anchor="middle"
      :fill="!enabled ? '#94a3b8' : isDanger ? '#fda4af' : '#7dd3fc'"
      font-size="11.5"
      font-family="monospace"
      font-weight="bold">
      {{ (distance / 2.54).toFixed(1) }}in / {{ distance }}cm
    </text>

    <!-- Draggable blue circular object dot -->
    <g :class="isDraggingDot ? 'cursor-grabbing' : 'cursor-grab'">
      <circle
        :cx="dotPos.x"
        :cy="dotPos.y"
        r="22"
        :fill="!enabled ? 'rgba(148, 163, 184, 0.18)' : isDanger ? 'rgba(244, 63, 94, 0.25)' : 'rgba(14, 165, 233, 0.25)'" />
      <circle
        :cx="dotPos.x"
        :cy="dotPos.y"
        r="14"
        fill="#0ea5e9"
        stroke="#e0f2fe"
        stroke-width="2.5" />
      <circle
        :cx="dotPos.x - 4"
        :cy="dotPos.y - 4"
        r="3.5"
        fill="rgba(255, 255, 255, 0.45)" />
    </g>

    <!-- Tinkercad-style 4-pin HC-SR04 Ultrasonic Sensor -->
    <g>
      <rect x="165" y="262" width="4" height="11" rx="1" fill="#cbd5e1" />
      <rect x="174" y="262" width="4" height="11" rx="1" fill="#cbd5e1" />
      <rect x="183" y="262" width="4" height="11" rx="1" fill="#cbd5e1" />
      <rect x="192" y="262" width="4" height="11" rx="1" fill="#cbd5e1" />
      <rect x="126" y="224" width="108" height="40" rx="6" fill="#0e4f68" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="154" cy="242" r="14" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" />
      <circle cx="154" cy="242" r="9.5" fill="#475569" stroke="#94a3b8" stroke-width="1" />
      <circle cx="154" cy="242" r="4" fill="#94a3b8" />
      <circle cx="206" cy="242" r="14" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" />
      <circle cx="206" cy="242" r="9.5" fill="#475569" stroke="#94a3b8" stroke-width="1" />
      <circle cx="206" cy="242" r="4" fill="#94a3b8" />
      <text x="180" y="236" text-anchor="middle" fill="#e0f2fe" font-size="7.5" font-family="monospace" font-weight="bold">
        HC-SR04
      </text>
      <text x="180" y="259" text-anchor="middle" fill="#bae6fd" font-size="6" font-family="monospace">
        VCC TRIG ECHO GND
      </text>
    </g>
  </svg>
</template>
