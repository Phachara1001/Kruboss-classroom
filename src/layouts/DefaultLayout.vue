<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import Footer from '../components/Footer.vue'

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-green-50 font-sans text-gray-800">
    <!-- Sidebar -->
    <Sidebar :isCollapsed="isSidebarCollapsed" @toggle="toggleSidebar" class="hidden md:flex z-20" />

    <!-- Main Content wrapper -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
      <!-- Topbar -->
      <Topbar @toggle-sidebar="toggleSidebar" />

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
      
      <!-- Mobile Sidebar Overlay (if needed in future) -->
      <!-- <div v-if="!isSidebarCollapsed" class="md:hidden fixed inset-0 bg-black/50 z-10" @click="isSidebarCollapsed = true"></div> -->
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
</style>
