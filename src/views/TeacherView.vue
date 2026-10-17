<script setup>
import { Phone, Mail, MapPin } from '@lucide/vue'
</script>

<template>
  <div
    class="min-h-[85vh] bg-[#E3DCD2] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row relative shadow-sm animate-[fadeIn_0.5s_ease-out]">
    <!-- Left Content -->
    <div class="w-full md:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
      <p class="text-xl md:text-2xl text-stone-600 mb-2 font-medium tracking-wide">ยินดีต้อนรับนักศึกษาทุกคน,
        กระผม </p>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-stone-800 tracking-tight leading-none mb-4">
        นายพชร เพียซ้าย
      </h1>
      <p class="text-stone-600 italic text-lg md:text-xl mb-10 opacity-80 border-l-4 border-stone-400 pl-4">
        "ครูผู้สอนรายวิชา เทคโนโลยีการจัดการฐานข้อมูล"
      </p>

      <a href="#contact"
        class="inline-block bg-[#5C554D] text-white px-8 py-4 w-max font-bold tracking-wider hover:bg-stone-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 mb-16 rounded-lg">
        ติดต่อสอบถาม
      </a>

      <!-- Contact Grid (Inspired by the stats section in the reference) -->
      <div id="contact" class="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 pt-8 border-t border-stone-300/50">
        <!-- Facebook -->
        <div class="flex flex-col group">
          <div
            class="flex items-center gap-3 text-stone-800 font-black text-3xl mb-3 transition-transform group-hover:scale-105 origin-left">
            <svg class="w-8 h-8 text-[#5C554D] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            FB
          </div>
          <a href="https://www.facebook.com/phachara.piasai.2025/" target="_blank"
            class="text-stone-600 text-lg hover:text-stone-900 transition-colors">
            Phachara Piasai
          </a>
        </div>

        <!-- Instagram -->
        <div class="flex flex-col group">
          <div
            class="flex items-center gap-3 text-stone-800 font-black text-3xl mb-3 transition-transform group-hover:scale-105 origin-left">
            <svg class="w-8 h-8 text-[#5C554D] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            IG
          </div>
          <a href="https://instagram.com/ppphachara_" target="_blank"
            class="text-stone-600 text-lg hover:text-stone-900 transition-colors">
            @ppphachara_
          </a>
        </div>

        <!-- Phone -->
        <div class="flex flex-col group">
          <div
            class="flex items-center gap-3 text-stone-800 font-black text-3xl mb-3 transition-transform group-hover:scale-105 origin-left">
            <Phone class="w-8 h-8 text-[#5C554D]" /> เบอร์มือถือ
          </div>
          <a href="tel:0629045675" class="text-stone-600 text-lg hover:text-stone-900 transition-colors">
            062-904-5675
          </a>
        </div>
      </div>
    </div>

    <!-- Right Image Area -->
    <div class="w-full md:w-1/2 relative min-h-[400px] flex items-end justify-center pt-10 group cursor-pointer">
      <!-- Decorative circle behind the image -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-stone-300/30 rounded-full blur-3xl transition-colors duration-700 group-hover:bg-green-200/40">
      </div>

      <div class="relative w-[85%] max-w-lg z-10">
        <img :src="'/Me.png'" alt="นายพชร เพียซ้าย (ครูบอส)"
          class="w-full h-auto object-contain object-bottom drop-shadow-2xl transition-all duration-700 group-hover:opacity-0 group-hover:scale-[1.02]" />
        <img :src="'/Me2.png'" alt="นายพชร เพียซ้าย (ครูบอส)"
          class="w-full h-auto object-contain object-bottom drop-shadow-2xl absolute bottom-0 left-0 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.02]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
