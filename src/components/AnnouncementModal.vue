<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, ChevronLeft, ChevronRight } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { announcements, fetchAnnouncements } from '../data/announcementStore'

const router = useRouter()
const isVisible = ref(false)
const activeAnnouncements = ref([])
const currentIndex = ref(0)

const currentAnnouncement = computed(() => activeAnnouncements.value[currentIndex.value])

onMounted(async () => {
  await fetchAnnouncements()

  // Find ALL active announcements
  const active = announcements.value.filter(a => a.isActive)

  if (active && active.length > 0) {
    activeAnnouncements.value = active
    currentIndex.value = 0
    isVisible.value = true
  }
})

const nextAnnouncement = (e) => {
  e.stopPropagation()
  currentIndex.value = (currentIndex.value + 1) % activeAnnouncements.value.length
}

const prevAnnouncement = (e) => {
  e.stopPropagation()
  currentIndex.value = (currentIndex.value - 1 + activeAnnouncements.value.length) % activeAnnouncements.value.length
}

const closeModal = () => {
  isVisible.value = false
}

const handleClickImage = () => {
  if (currentAnnouncement.value?.url) {
    window.open(currentAnnouncement.value.url, '_blank')
  }
}

const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed
  }
  return `https://${trimmed}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative bg-transparent max-w-2xl w-full flex flex-col items-center animate-[popIn_0.3s_ease-out]">

          <!-- Close Button -->
          <button @click="closeModal"
            class="absolute -top-10 right-0 md:-right-10 w-8 h-8 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer">
            <X class="w-5 h-5" />
          </button>

          <!-- Image Container -->
          <div
            class="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 group cursor-pointer transition-transform hover:scale-[1.02]"
            @click="handleClickImage">
            <!-- Navigation Buttons (if > 1) -->
            <template v-if="activeAnnouncements.length > 1">
              <button @click="prevAnnouncement"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100">
                <ChevronLeft class="w-6 h-6" />
              </button>
              <button @click="nextAnnouncement"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100">
                <ChevronRight class="w-6 h-6" />
              </button>
            </template>

            <Transition name="slide-image" mode="out-in">
              <img :key="currentIndex" :src="getImageUrl(currentAnnouncement?.image)" alt="Announcement"
                class="w-full h-auto object-cover block" />
            </Transition>

            <!-- Click Hint -->
            <div v-if="currentAnnouncement?.url"
              class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10">
              <span>คลิกเพื่อดูรายละเอียด</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>

            <!-- Pagination Dots -->
            <div v-if="activeAnnouncements.length > 1"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
              <div v-for="(_, idx) in activeAnnouncements" :key="idx" class="w-2 h-2 rounded-full transition-all"
                :class="idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'"></div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-image-enter-active,
.slide-image-leave-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.slide-image-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.slide-image-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
