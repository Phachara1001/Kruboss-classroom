<script setup>
import { User, Bell, Lock, Globe, Save } from '@lucide/vue'
</script>

<template>
  <div class="w-full space-y-6 pb-10">
    <div>
      <h2 class="text-2xl font-bold text-green-900 mb-2">การตั้งค่า</h2>
      <p class="text-green-600">จัดการข้อมูลส่วนตัวและการตั้งค่าระบบของคุณ</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      <!-- Settings Navigation -->
      <div class="w-full md:w-64 bg-green-50/50 border-r border-green-100 p-4 shrink-0">
        <nav class="space-y-1">
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-green-100 text-green-800 font-medium rounded-lg text-left">
            <User class="w-5 h-5 text-green-600" /> โปรไฟล์
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-800 font-medium rounded-lg text-left transition-colors">
            <Bell class="w-5 h-5" /> การแจ้งเตือน
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-800 font-medium rounded-lg text-left transition-colors">
            <Lock class="w-5 h-5" /> รหัสผ่านและความปลอดภัย
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-800 font-medium rounded-lg text-left transition-colors">
            <Globe class="w-5 h-5" /> ภาษาและภูมิภาค
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="flex-1 p-6 md:p-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">ข้อมูลโปรไฟล์</h3>
        
        <div class="flex items-start gap-6 mb-8">
          <div class="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-4xl font-bold text-green-800 shrink-0 border-4 border-white shadow-md">
            U
          </div>
          <div class="space-y-2">
            <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              เปลี่ยนรูปโปรไฟล์
            </button>
            <p class="text-xs text-gray-500">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent>
          
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-green-800 border-b pb-2">ข้อมูลส่วนตัว</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">คำนำหน้า และ ชื่อ-นามสกุล</label>
                <div class="flex gap-2">
                  <select class="w-[100px] shrink-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white transition-shadow text-gray-700">
                    <option value="นาย" selected>นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                  <input type="text" value="กวินทร์ ใจดี" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white transition-shadow" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">ชื่อเล่น</label>
                <input type="text" value="วิน" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white transition-shadow" />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">รหัสนักศึกษา</label>
                <input type="text" value="6601234561" disabled class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                <input type="text" value="0812345671" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white transition-shadow" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">คำคมประจำใจ</label>
              <textarea rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white transition-shadow resize-none">เรียนไปวันๆ เดี๋ยวมันก็จบเอง</textarea>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <h4 class="text-sm font-bold text-green-800 border-b pb-2">ช่องทางการติดต่อ (Social Media)</h4>
            
            <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span class="font-bold text-blue-900 text-sm">Facebook</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-xs font-medium text-gray-600">ชื่อที่แสดง (Name)</label>
                  <input type="text" value="Gawin Jaidee" class="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="block text-xs font-medium text-gray-600">ลิงก์โปรไฟล์ (URL)</label>
                  <input type="url" value="https://facebook.com/gawin.jaidee" class="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-blue-600" />
                </div>
              </div>
            </div>

            <div class="p-4 bg-pink-50/50 rounded-xl border border-pink-100 space-y-3">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-pink-600 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span class="font-bold text-pink-900 text-sm">Instagram</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-xs font-medium text-gray-600">ชื่อที่แสดง (Name)</label>
                  <input type="text" value="gawin_j" class="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="block text-xs font-medium text-gray-600">ลิงก์โปรไฟล์ (URL)</label>
                  <input type="url" value="https://instagram.com/gawin_j" class="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white text-pink-600" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100 flex justify-end">
            <button class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium flex items-center gap-2">
              <Save class="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
