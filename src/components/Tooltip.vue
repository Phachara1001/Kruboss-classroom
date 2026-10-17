<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top' // 'top' or 'bottom'
  },
  align: {
    type: String,
    default: 'center' // 'center', 'left', 'right'
  }
})
</script>

<template>
  <div class="relative flex items-center justify-center group/tooltip">
    <slot></slot>
    
    <!-- Tooltip Box -->
    <div 
      :class="[
        'absolute whitespace-nowrap px-2.5 py-1.5 bg-stone-800 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none transition-all duration-300 z-50 shadow-lg',
        'group-hover/tooltip:opacity-100',
        position === 'top' ? 'bottom-full mb-2 group-hover/tooltip:-translate-y-1' : 'top-full mt-2 group-hover/tooltip:translate-y-1',
        align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'right' ? 'right-0' : 'left-0'
      ]"
    >
      {{ text }}
      
      <!-- Arrow -->
      <div 
        :class="[
          'absolute border-[5px] border-transparent',
          position === 'top' ? 'top-full border-t-stone-800' : 'bottom-full border-b-stone-800',
          align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'right' ? 'right-3' : 'left-3'
        ]"
      ></div>
    </div>
  </div>
</template>
