<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // Avatar image source or text
  avatar: {
    type: String,
    default: ''
  },
  // Frame image URL or path, or CSS preset name (e.g. 'css:neon', 'css:rainbow', 'css:gold', 'css:fire', 'css:cosmic', 'css:angel', 'css:witch', 'css:zombie', 'css:demon')
  frame: {
    type: String,
    default: ''
  },
  // Explicit Pure CSS frame preset
  cssFrame: {
    type: String,
    default: ''
  },
  // Name or alt text
  name: {
    type: String,
    default: ''
  },
  // Predefined size: 'xs', 'sm', 'md', 'lg', 'xl' or custom class string (e.g. 'w-10 h-10', 'w-20 h-20')
  size: {
    type: String,
    default: 'md'
  },
  // Shape: 'circle' or 'rounded'
  shape: {
    type: String,
    default: 'circle'
  },
  // Extra effect on image frame: 'none', 'pulse', 'rainbow', 'glow', 'float'
  effect: {
    type: String,
    default: 'none'
  },
  // Custom class for the avatar image / container
  avatarClass: {
    type: String,
    default: ''
  },
  // Custom border/ring class for avatar (used when no frame is equipped)
  borderClass: {
    type: String,
    default: 'border-2 border-white shadow-xs'
  },
  // Fallback image path
  fallbackSrc: {
    type: String,
    default: '/placeholder_profile.png'
  }
})

const emit = defineEmits(['click'])

const CONIC_FRAMES = ['neon', 'rainbow', 'gold', 'fire', 'cosmic']
const EXTREME_FRAMES = ['angel', 'witch', 'zombie', 'demon', 'flame', 'ramen', 'sleep']

// Detect whether frame is a pure CSS preset
const activeCssFrame = computed(() => {
  let key = ''
  if (props.cssFrame) {
    key = props.cssFrame.trim().toLowerCase()
  } else if (props.frame && props.frame.startsWith('css:')) {
    key = props.frame.replace('css:', '').trim().toLowerCase()
  } else {
    const cleanFrame = String(props.frame || '').trim().toLowerCase()
    if (CONIC_FRAMES.includes(cleanFrame) || EXTREME_FRAMES.includes(cleanFrame)) {
      key = cleanFrame
    }
  }
  if (key === 'fire') return 'flame'
  return key || null
})

// Check if current CSS frame is one of the spinning conic gradient presets
const isConicCssFrame = computed(() => {
  return Boolean(activeCssFrame.value && CONIC_FRAMES.includes(activeCssFrame.value))
})

// Check if current CSS frame is one of the extreme character presets
const isExtremeCssFrame = computed(() => {
  return Boolean(activeCssFrame.value && EXTREME_FRAMES.includes(activeCssFrame.value))
})

// Check if frame is an image file (PNG, WebP, GIF, etc.)
const isImageFrame = computed(() => {
  if (!props.frame) return false
  if (activeCssFrame.value) return false
  return true
})

// Omit default white border when a CSS frame is active so the frame sits cleanly on top
const effectiveBorderClass = computed(() => {
  if (activeCssFrame.value) return ''
  return props.borderClass
})

// Check if avatar is an image URL, path, or data URI
const isImageUrl = computed(() => {
  if (!props.avatar) return false
  const s = String(props.avatar).trim()
  return s.startsWith('data:') || s.startsWith('blob:') || s.includes('/') || s.startsWith('http')
})

const imageLoadFailed = ref(false)

watch(() => props.avatar, () => {
  imageLoadFailed.value = false
})

const handleImageError = () => {
  imageLoadFailed.value = true
}

// Compute size class
const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-8 h-8 text-xs'
    case 'sm': return 'w-10 h-10 text-sm'
    case 'md': return 'w-12 h-12 text-base'
    case 'lg': return 'w-20 h-20 text-2xl'
    case 'xl': return 'w-28 h-28 text-3xl'
    default:
      return props.size
  }
})

// Calculate pixel size for extreme CSS frames (--af-size)
const computedAfSize = computed(() => {
  const s = String(props.size || '').trim()
  if (s === 'xs') return '32px'
  if (s === 'sm') return '40px'
  if (s === 'md') return '48px'
  if (s === 'lg') return '80px'
  if (s === 'xl') return '112px'
  const match = s.match(/w-(\d+)/)
  if (match) {
    const num = parseInt(match[1], 10)
    return `${num * 4}px`
  }
  return '48px'
})

// Frame effect class for image frames
const frameEffectClass = computed(() => {
  switch (props.effect) {
    case 'pulse': return 'animate-pulse'
    case 'glow': return 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]'
    case 'rainbow': return 'animate-frame-rainbow'
    case 'float': return 'animate-frame-float'
    default: return ''
  }
})
</script>

<template>
  <div 
    :class="[
      'relative isolate inline-flex items-center justify-center shrink-0 select-none',
      sizeClass
    ]"
    :style="{ '--af-size': computedAfSize }"
    @click="emit('click', $event)"
  >
    <!-- BASE LAYER (z-10): Avatar Circle Container -->
    <div 
      :class="[
        'w-full h-full overflow-hidden flex items-center justify-center font-black relative z-10 bg-stone-100 text-stone-700',
        shape === 'circle' ? 'rounded-full' : 'rounded-2xl',
        effectiveBorderClass,
        avatarClass
      ]"
    >
      <!-- If Image URL and not failed -->
      <img 
        v-if="isImageUrl && !imageLoadFailed"
        :src="avatar" 
        :alt="name || 'Avatar'"
        class="w-full h-full object-cover object-top"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Fallback Image if failed -->
      <img 
        v-else-if="imageLoadFailed"
        :src="fallbackSrc" 
        :alt="name || 'Avatar'"
        class="w-full h-full object-cover object-top"
      />

      <!-- Text / Initial Fallback if avatar is text or short string -->
      <span v-else-if="avatar" class="truncate px-1 select-none">
        {{ avatar }}
      </span>

      <!-- Default Placeholder if empty -->
      <img 
        v-else
        :src="fallbackSrc" 
        :alt="name || 'Avatar'"
        class="w-full h-full object-cover object-top"
      />

      <!-- Slot: Inner Overlay (e.g., hover upload overlay) -->
      <slot name="overlay" />
    </div>

    <!-- TOP LAYER (z-24 to z-30): FRAMES ALWAYS RENDER ABOVE AVATAR -->

    <!-- 1. PURE CSS CONIC FRAMES: Outer Ambient Glow -->
    <div 
      v-if="isConicCssFrame" 
      class="css-frame-ambient"
      :class="[
        activeCssFrame === 'neon' ? 'css-frame-neon-glow bg-conic-neon' : '',
        activeCssFrame === 'rainbow' ? 'css-frame-rainbow-glow bg-conic-rainbow' : '',
        activeCssFrame === 'gold' ? 'css-frame-gold-glow bg-conic-gold' : '',
        activeCssFrame === 'fire' ? 'css-frame-fire-glow bg-conic-fire' : '',
        activeCssFrame === 'cosmic' ? 'css-frame-cosmic-glow bg-conic-cosmic' : ''
      ]"
    />

    <!-- 1. PURE CSS CONIC FRAMES: Sharp Spinning Masked Ring -->
    <div 
      v-if="isConicCssFrame" 
      class="css-frame-ring-wrapper"
    >
      <div 
        class="css-frame-ring-inner"
        :class="[
          activeCssFrame === 'neon' ? 'bg-conic-neon animate-spin-slow' : '',
          activeCssFrame === 'rainbow' ? 'bg-conic-rainbow animate-spin-fast' : '',
          activeCssFrame === 'gold' ? 'bg-conic-gold animate-spin-slow' : '',
          activeCssFrame === 'fire' ? 'bg-conic-fire animate-fire-pulse' : '',
          activeCssFrame === 'cosmic' ? 'bg-conic-cosmic animate-spin-slow' : ''
        ]"
      />
    </div>

    <!-- 1. PURE CSS CONIC FRAMES: Decorative Orbital Lines -->
    <div 
      v-if="activeCssFrame === 'neon'"
      class="css-frame-orbital-neon animate-spin-reverse"
    />
    <div 
      v-else-if="activeCssFrame === 'gold'"
      class="css-frame-orbital-gold animate-pulse"
    />
    <div 
      v-else-if="activeCssFrame === 'cosmic'"
      class="css-frame-orbital-cosmic animate-spin-reverse"
    />

    <!-- 2. PURE CSS EXTREME CHARACTER FRAMES: Angel, Witch, Zombie, Demon (z-25 to z-29) -->
    <div 
      v-if="isExtremeCssFrame"
      :class="['af', `af-${activeCssFrame}`]"
      :style="{ '--af-size': computedAfSize }"
    >
      <i class="af-ring"></i>
      <i class="af-a"></i>
      <i class="af-b"></i>
      <i class="af-c"></i>
    </div>

    <!-- 3. IMAGE FRAME LAYER: PNG, Animated WebP, GIF, APNG (z-30) -->
    <img 
      v-if="isImageFrame" 
      :src="frame" 
      alt="Frame"
      :class="[
        'absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-30 object-contain',
        frameEffectClass
      ]"
    />

    <!-- Slot: Top / Badge / Corner Overlays (Always z-40 above frames) -->
    <div
      v-if="$slots.top || $slots.badge || $slots.default"
      class="absolute inset-0 z-40 pointer-events-none *:pointer-events-auto"
    >
      <slot name="top" />
      <slot name="badge" />
      <slot />
    </div>
  </div>
</template>
