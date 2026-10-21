<script setup>
import { onMounted, onUnmounted } from 'vue'
import { X, Printer } from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'เอกสารตัวอย่างใบงาน.pdf'
  },
  subtitle: {
    type: String,
    default: 'แบบฟอร์มเอกสารทางการ ขนาด A4 (1 หน้า)'
  },
  footerText: {
    type: String,
    default: 'แบบฟอร์มใบงานมาตรฐานขนาด A4 (Assignment Format)'
  },
  showPrint: {
    type: Boolean,
    default: false
  },
  multiPage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pdf-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
      >
        <!-- Backdrop click to close -->
        <div class="absolute inset-0" @click="close"></div>

        <!-- PDF Window Container -->
        <div
          class="relative z-10 w-full max-w-4xl max-h-[94vh] flex flex-col bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
        >
          <!-- PDF Toolbar -->
          <div
            class="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-800 shrink-0"
          >
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div
                class="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xs"
              >
                PDF
              </div>
              <div class="truncate">
                <span class="font-bold text-sm text-gray-100 block truncate">
                  {{ title }}
                </span>
                <span class="text-[11px] text-gray-400 block">{{ subtitle }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="showPrint"
                @click="window.print()"
                class="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-700 cursor-pointer"
                title="พิมพ์เอกสาร A4"
              >
                <Printer class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">พิมพ์ / บันทึกเป็น PDF</span>
              </button>
              <button
                @click="close"
                class="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-gray-700 cursor-pointer"
                title="ปิดหน้าต่าง"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- PDF Document Scrollable Area -->
          <div
            class="overflow-y-auto p-4 sm:p-8 bg-slate-800/90 w-full"
            :class="multiPage ? 'flex flex-col items-center gap-6 sm:gap-8' : 'flex justify-center'"
          >
            <!-- When multiPage is true, slot provides multiple page sheets -->
            <template v-if="multiPage">
              <slot />
            </template>

            <!-- Single Page Sheet Paper (Strict A4 Dimension: 210mm x 297mm) -->
            <div
              v-else
              class="printable-a4-sheet bg-white text-gray-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 md:p-14 shadow-2xl border border-gray-300 space-y-4 text-xs sm:text-sm font-sans box-border"
              style="background-color: #ffffff !important; color: #111827 !important;"
            >
              <slot />
            </div>
          </div>

          <!-- PDF Footer Bar -->
          <div
            class="bg-gray-900 text-gray-400 text-xs px-4 py-2.5 flex items-center justify-between border-t border-gray-800 shrink-0"
          >
            <span>{{ footerText }}</span>
            <button
              @click="close"
              class="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
            >
              ปิดหน้าต่าง (Close)
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* PDF Modal Transition */
.pdf-fade-enter-active,
.pdf-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.pdf-fade-enter-from,
.pdf-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* Printable A4 Stylesheet */
@media print {
  @page {
    size: A4 portrait;
    margin: 12mm 15mm;
  }

  body * {
    visibility: hidden !important;
  }

  .printable-a4-sheet,
  .printable-a4-sheet * {
    visibility: visible !important;
  }

  .printable-a4-sheet {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto 20mm auto !important;
    padding: 12mm 15mm !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    color: black !important;
    page-break-after: always !important;
    break-after: page !important;
  }

  .printable-a4-sheet:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
    margin-bottom: 0 !important;
  }
}
</style>
