<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { X } from '@lucide/vue'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const toggleDesktopSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// Close mobile drawer when clicking a link inside the drawer
const handleDrawerClick = (e) => {
  const link = e.target.closest('a')
  if (link) {
    closeMobileSidebar()
  }
}

// Close mobile drawer automatically on route navigation
watch(() => route.fullPath, () => {
  isMobileSidebarOpen.value = false
})

// Prevent body scrolling when mobile drawer is open
watch(isMobileSidebarOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

// Auto-close mobile drawer if viewport is resized to desktop width
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768 && isMobileSidebarOpen.value) {
      isMobileSidebarOpen.value = false
    }
  }
  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.body.style.overflow = ''
  })
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-green-50 font-sans text-gray-800">
    <!-- Desktop Sidebar -->
    <Sidebar :isCollapsed="isSidebarCollapsed" @toggle="toggleDesktopSidebar" class="hidden md:flex z-20 shrink-0" />

    <!-- Mobile Sidebar Drawer (Teleported to body for top-level stacking) -->
    <Teleport to="body">
      <transition name="mobile-drawer">
        <div v-if="isMobileSidebarOpen" class="md:hidden fixed inset-0 z-50 flex">
          <!-- Backdrop overlay -->
          <div 
            class="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            @click="closeMobileSidebar"
          ></div>

          <!-- Slide Drawer Panel -->
          <div 
            class="relative flex flex-col w-72 max-w-[85vw] bg-emerald-900 shadow-2xl z-10 h-full mobile-drawer-panel border-r border-emerald-700/50"
            @click="handleDrawerClick"
          >
            <!-- Close Button (X) -->
            <button
              @click="closeMobileSidebar"
              class="absolute top-3.5 right-3.5 z-40 p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-90 border border-emerald-700/60"
              title="ปิดเมนู"
              aria-label="Close menu"
            >
              <X class="w-4 h-4" />
            </button>

            <Sidebar 
              :isCollapsed="false" 
              @toggle="closeMobileSidebar" 
              class="h-full w-full"
            />
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Main Content wrapper -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
      <!-- Topbar -->
      <Topbar @toggle-sidebar="toggleMobileSidebar" />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-green-50/30">
        <div class="w-full h-full">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Drawer Transitions */
.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-drawer-enter-active .mobile-drawer-panel,
.mobile-drawer-leave-active .mobile-drawer-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 0;
}

.mobile-drawer-enter-from .mobile-drawer-panel,
.mobile-drawer-leave-to .mobile-drawer-panel {
  transform: translateX(-100%);
}

.mobile-drawer-enter-to .mobile-drawer-panel,
.mobile-drawer-leave-from .mobile-drawer-panel {
  transform: translateX(0);
}
</style>
