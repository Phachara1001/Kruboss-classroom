<script setup>
import { Bell, Search, Menu, ShoppingBag, Package } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { activeStudentIdForShop, getStudentCoins } from '../data/shopStore'
import { computed } from 'vue'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const currentCoins = computed(() => getStudentCoins(activeStudentIdForShop.value))
</script>

<template>
  <header
    class="h-16 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-[0_2px_10px_rgba(5,150,105,0.05)] flex items-center justify-between px-3.5 sm:px-6 z-10 shrink-0 sticky top-0 transition-all">
    <!-- Left: Hamburger & Brand Info -->
    <div class="flex items-center gap-2.5 sm:gap-4 min-w-0">
      <button 
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 sm:p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/70 shadow-2xs active:scale-90 transition-all flex items-center justify-center shrink-0 cursor-pointer"
        aria-label="เปิดเมนู"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <img 
          src="/kruboss_logo.ico" 
          alt="Logo" 
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shrink-0 shadow-2xs" 
        />
        <div class="min-w-0 flex flex-col justify-center">
          <h1 class="text-sm sm:text-lg font-black text-emerald-950 tracking-tight leading-tight whitespace-nowrap truncate">
            ห้องเรียนของครูบอส
          </h1>
          <div class="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-600 font-semibold leading-none mt-0.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span>ภาคเรียนที่ 2/2569</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Quick Actions -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Inventory Quick Link -->
      <button 
        @click="router.push('/inventory')"
        class="p-2 sm:p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center justify-center group"
        title="กระเป๋าไอเทมของฉัน"
      >
        <Package class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
      </button>

      <!-- Coin Wallet Quick Link -->
      <button 
        @click="router.push('/shop')"
        class="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-amber-300/30 to-amber-400/20 border border-amber-300/90 text-amber-900 font-black text-xs flex items-center gap-1 sm:gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer group"
        title="ไปที่ร้านค้าและกล่องสุ่ม"
      >
        <span class="text-sm sm:text-base leading-none group-hover:scale-110 transition-transform">🪙</span>
        <span class="font-mono text-xs sm:text-sm font-black">{{ currentCoins }}</span>
        <span class="text-[10px] text-amber-800/80 font-bold hidden sm:inline">Coins</span>
      </button>
    </div>
  </header>
</template>
