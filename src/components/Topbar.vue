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
    class="h-16 bg-white border-b border-green-100 shadow-sm flex items-center justify-between px-6 z-10 shrink-0">
    <div class="flex items-center gap-4">
      <button @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-md hover:bg-green-50 text-green-800 transition-colors">
        <Menu class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-green-800">ห้องเรียนของครูบอส</h1>
        <p class="text-xs text-green-600">ภาคเรียนที่ 2/2569</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Inventory Quick Link -->
      <button @click="router.push('/inventory')"
        class="p-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer bg-emerald-50/50 border border-emerald-100"
        title="กระเป๋าไอเทมของฉัน">
        <Package class="w-5 h-5" />
      </button>

      <!-- Coin Wallet Quick Link -->
      <button @click="router.push('/shop')"
        class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-300 text-amber-800 font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow-md hover:bg-amber-100/60 transition-all cursor-pointer"
        title="ไปที่ร้านค้าและกล่องสุ่ม">
        <span class="text-sm">🪙</span>
        <span class="font-mono">{{ currentCoins }}</span>
        <span class="text-[10px] text-amber-700 font-semibold hidden sm:inline">Coins</span>
      </button>
    </div>
  </header>
</template>
