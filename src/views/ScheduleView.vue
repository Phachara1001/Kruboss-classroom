<script setup>
import { ref } from 'vue'
import {
  CalendarDays,
  Clock,
  Printer,
  User,
  BookOpen,
  GraduationCap,
  Coffee,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  Megaphone,
  Contact,
  ArrowRight,
  DoorOpen
} from '@lucide/vue'

const activeFilter = ref('all') // 'all' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri'
const viewMode = ref('table') // 'table' | 'cards'

const periods = [
  { num: 1, time: '08:00 - 09:00' },
  { num: 2, time: '09:00 - 10:00' },
  { num: 3, time: '10:00 - 11:00' },
  { num: 4, time: '11:00 - 12:00' },
  { num: 5, time: '12:00 - 13:00', isLunch: true },
  { num: 6, time: '13:00 - 14:00' },
  { num: 7, time: '14:00 - 15:00' },
  { num: 8, time: '15:00 - 16:00' },
  { num: 9, time: '16:00 - 17:00' },
  { num: 10, time: '17:00 - 18:00' },
  { num: 11, time: '18:00 - 19:00' }
]

const subjectSummaries = [
  {
    code: '21901-2012',
    name: 'การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม',
    level: 'ปวช.2/2 (ทวิศึกษา)',
    room: '6404',
    scheduleText: 'วันจันทร์ คาบ 4 และ วันอังคาร คาบ 1-2',
    slots: [
      { day: 'วันจันทร์', time: '11:00 - 12:00', periods: 'คาบที่ 4' },
      { day: 'วันอังคาร', time: '08:00 - 10:00', periods: 'คาบที่ 1 - 2' }
    ],
    totalPeriods: 3,
    color: 'border-indigo-200 bg-indigo-50/70 text-indigo-900',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    accentColor: 'bg-indigo-600',
    lightBg: 'bg-indigo-50'
  },

  {
    code: '31901-2007',
    name: 'เทคโนโลยีการจัดการฐานข้อมูล',
    level: 'ปวส.1/1',
    room: '6405',
    scheduleText: 'วันพฤหัสบดี คาบ 4 ถึง 9 (พักเที่ยงคาบ 5)',
    slots: [
      { day: 'วันพฤหัสบดี', time: '11:00 - 12:00', periods: 'คาบที่ 4' },
      { day: 'วันพฤหัสบดี', time: '12:00 - 13:00', periods: 'คาบที่ 5 (พักเที่ยง)', isLunch: true },
      { day: 'วันพฤหัสบดี', time: '13:00 - 17:00', periods: 'คาบที่ 6 - 9' }
    ],
    totalPeriods: 5,
    color: 'border-teal-200 bg-teal-50/70 text-teal-900',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    accentColor: 'bg-teal-600',
    lightBg: 'bg-teal-50'
  },
  {
    code: '31901-2012',
    name: 'การวิเคราะห์และนำเสนอข้อมูล',
    level: 'ปวส.1/1',
    room: '6302',
    scheduleText: 'วันศุกร์ คาบ 7 ถึง 11',
    slots: [
      { day: 'วันศุกร์', time: '14:00 - 19:00', periods: 'คาบที่ 7 - 11' }
    ],
    totalPeriods: 5,
    color: 'border-purple-200 bg-purple-50/70 text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    accentColor: 'bg-purple-600',
    lightBg: 'bg-purple-50'
  },
  {
    code: '21901-2007',
    name: 'เทคโนโลยีระบบสมองกลฝังตัวและไอโอที',
    level: 'ปวช.3/2',
    room: '6403',
    scheduleText: 'วันพุธ คาบ 6, 7 และ 10',
    slots: [
      { day: 'วันพุธ', time: '13:00 - 15:00', periods: 'คาบที่ 6 - 7' },
      { day: 'วันพุธ', time: '15:00 - 17:00', periods: 'คาบที่ 8 - 9 (กิจกรรมแผนก)', isActivity: true },
      { day: 'วันพุธ', time: '17:00 - 18:00', periods: 'คาบที่ 10 (ต่อ)' }
    ],
    totalPeriods: 3,
    color: 'border-amber-200 bg-amber-50/70 text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    accentColor: 'bg-amber-600',
    lightBg: 'bg-amber-50'
  }
]

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.3s_ease-out] print:p-0 print:space-y-4">
    <!-- Header Section -->
    <div
      class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-gray-200/80">
      <div>
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <CalendarDays class="w-3.5 h-3.5 text-emerald-700" />
          <span>ตารางสอนอาจารย์ผู้สอน • ภาคเรียนที่ 2/2569</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          ตารางสอนรายสัปดาห์
        </h1>
        <p class="text-gray-500 font-medium text-sm md:text-base mt-1 flex flex-wrap items-center gap-2">
          <span>นายพชร เพียซ้าย (ครูบอส)</span>
          <span class="text-gray-300">•</span>
          <span>แผนกวิชาเทคโนโลยีสารสนเทศ</span>
          <span class="text-gray-300">•</span>
          <span class="text-emerald-700 font-bold">รวมสอน 16 คาบ/สัปดาห์ (กิจกรรมแผนก 2 คาบ)</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 self-stretch sm:self-auto print:hidden">
        <!-- View Toggle -->
        <div class="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
          <button @click="viewMode = 'table'"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', viewMode === 'table' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900']">
            ตารางสอน
          </button>
          <button @click="viewMode = 'cards'"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', viewMode === 'cards' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900']">
            การ์ดรายวิชา
          </button>
        </div>

        <!-- Print Button -->
        <button @click="handlePrint"
          class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
          <Printer class="w-4 h-4 text-gray-500" />
          <span>พิมพ์ตารางสอน</span>
        </button>
      </div>
    </div>

    <!-- Quick Info Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <BookOpen class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">รายวิชาที่สอน</p>
          <p class="text-lg font-black text-gray-900">4 <span class="text-xs font-normal text-gray-500">วิชา</span></p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          <GraduationCap class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">กลุ่มเรียนทั้งหมด</p>
          <p class="text-lg font-black text-gray-900">3 <span
              class="text-xs font-normal text-gray-500">กลุ่มเรียน</span>
          </p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <Clock class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">ภาระงานสอนรวม</p>
          <p class="text-lg font-black text-gray-900">16 <span
              class="text-xs font-normal text-gray-500">คาบ/สัปดาห์</span></p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
          <Coffee class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">เวลาพักเที่ยง</p>
          <p class="text-sm font-black text-orange-900">คาบ 5 <span
              class="text-xs font-normal text-gray-500">(12:00-13:00)</span></p>
        </div>
      </div>
    </div>

    <!-- Teacher Contact Announcement Card -->
    <section
      class="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-teal-50 shadow-lg shadow-emerald-900/5 print:border-emerald-300 print:shadow-none">
      <!-- ลายวงกลมจางๆ พื้นหลัง -->
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl">
      </div>
      <div class="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-teal-300/20 blur-3xl">
      </div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-stretch">
        <!-- ป้ายห้อง: จุดเด่นของการ์ด -->
        <div
          class="relative flex shrink-0 flex-row items-center gap-4 overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-6 py-5 text-white md:w-60 md:flex-col md:justify-center md:gap-1 md:py-8">
          <div class="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full border-[14px] border-white/10">
          </div>
          <div
            class="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full border-[14px] border-white/10">
          </div>
          <div class="relative md:text-center">
            <p class="text-5xl font-black leading-none tracking-tight drop-shadow-sm md:mt-1 md:text-6xl">ติดต่อ</p>
          </div>
        </div>

        <!-- เนื้อหา -->
        <div class="flex flex-1 flex-col justify-between gap-5 p-6 md:flex-row md:items-center md:p-8">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                <Megaphone class="h-5 w-5" />
              </div>
              <h3 class="text-lg font-extrabold text-emerald-950 md:text-xl">ติดต่อครูผู้สอน</h3>
            </div>

            <p class="max-w-md text-sm leading-relaxed text-gray-600">
              พบคุณครูได้ที่
              <span
                class="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-0.5 font-bold text-emerald-900">
                <MapPin class="h-3.5 w-3.5 text-emerald-600" />ห้องพักครู (6202)
              </span>
              หรือห้องเรียนตามตารางสอน
              ดูช่องทางติดต่ออื่นๆ ได้ในหน้าข้อมูลครูผู้สอน
            </p>
          </div>

          <router-link to="/teacher"
            class="group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 active:scale-95 print:hidden">
            <!-- แสงวิ่งผ่านปุ่มตอน hover -->
            <span
              class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"></span>
            <Contact class="relative h-4 w-4" />
            <span class="relative">ดูข้อมูลครูผู้สอน</span>
            <ArrowRight class="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- MAIN TIMETABLE GRID (TABLE VIEW) -->
    <div v-show="viewMode === 'table'" class="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
      <!-- Table Header Title -->
      <div
        class="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 class="font-black text-gray-800 text-base md:text-lg">
            ตารางการสอนรายสัปดาห์ (Weekly Timetable)
          </h3>
        </div>
        <div class="text-xs text-gray-500 flex flex-wrap items-center gap-4">
          <span class="flex items-center gap-1.5"><span
              class="w-3 h-3 rounded bg-indigo-100 border border-indigo-300"></span> ปวช.2/2</span>
          <span class="flex items-center gap-1.5"><span
              class="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span> ปวช.3/2 (สมองกลฝังตัว & IoT)</span>
          <span class="flex items-center gap-1.5"><span
              class="w-3 h-3 rounded bg-rose-100 border border-rose-300"></span> กิจกรรมแผนก</span>
          <span class="flex items-center gap-1.5"><span
              class="w-3 h-3 rounded bg-teal-100 border border-teal-300"></span>
            ปวส.1/1 (ฐานข้อมูล)</span>
          <span class="flex items-center gap-1.5"><span
              class="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span> ปวส.1/1 (วิเคราะห์ข้อมูล)</span>
        </div>
      </div>

      <!-- Horizontal Scrollable Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-center border-collapse min-w-[1050px]">
          <!-- Columns Header -->
          <thead>
            <tr class="bg-gray-100/90 text-gray-700 text-xs font-bold border-b border-gray-200">
              <th class="py-4 px-3 w-28 border-r border-gray-200 bg-gray-100 sticky left-0 z-10 shadow-xs">
                <div class="font-extrabold text-gray-900">วัน / คาบ</div>
                <div class="text-[10px] text-gray-400 font-normal">Day \ Period</div>
              </th>
              <th v-for="period in periods" :key="period.num"
                class="py-3 px-2 border-r border-gray-200 font-bold transition-colors"
                :class="period.isLunch ? 'bg-amber-100/70 text-amber-900 w-24' : 'w-24'">
                <div class="text-xs font-black">คาบที่ {{ period.num }}</div>
                <div class="text-[10px] text-gray-500 font-medium whitespace-nowrap">{{ period.time }}</div>
                <div v-if="period.isLunch" class="text-[10px] text-amber-800 font-bold mt-0.5">พักเที่ยง</div>
              </th>
            </tr>
          </thead>

          <tbody class="text-xs divide-y divide-gray-200">
            <!-- 1. วันจันทร์ (Monday) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td
                class="py-4 px-3 border-r border-gray-200 bg-amber-50/40 text-amber-900 font-black sticky left-0 z-10 shadow-xs">
                <div class="text-sm">วันจันทร์</div>
                <div class="text-[10px] text-amber-700/80 font-medium">Monday</div>
              </td>
              <!-- Periods 1 - 3 (ว่าง) -->
              <td colspan="3" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- Period 4: ปวช.2/2 คาบที่ 4 -->
              <td colspan="1"
                class="p-2 border-r border-gray-200 bg-indigo-50/90 border-t-2 border-t-indigo-500 shadow-xs">
                <div
                  class="p-2 rounded-xl bg-white/90 border border-indigo-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-black">ปวช.2/2
                      (ทวิศึกษา)</span>
                    <span class="text-[10px] text-indigo-600 font-bold">คาบ 4</span>
                  </div>
                  <p class="font-extrabold text-indigo-950 text-xs leading-tight">21901-2012</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight line-clamp-2">
                    การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม</p>
                  <p class="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-indigo-500" />ห้อง 6404
                  </p>
                </div>
              </td>
              <!-- Period 5: พักกลางวัน (Rowspan across all 5 days) -->
              <td rowspan="5"
                class="py-4 px-2 border-r border-gray-200 bg-gradient-to-b from-amber-50/80 via-amber-100/50 to-amber-50/80 text-amber-900 font-bold select-none">
                <div class="flex flex-col items-center justify-center gap-2 py-10">
                  <div
                    class="w-8 h-8 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shadow-xs">
                    <Coffee class="w-4 h-4" />
                  </div>
                  <span class="text-xs font-black tracking-wider [writing-mode:vertical-rl] rotate-180">
                    พักรับประทานอาหารกลางวัน (12:00 - 13:00)
                  </span>
                </div>
              </td>
              <!-- Periods 6 - 11 (ว่าง) -->
              <td colspan="6" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
            </tr>

            <!-- 2. วันอังคาร (Tuesday) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td
                class="py-4 px-3 border-r border-gray-200 bg-pink-50/40 text-pink-900 font-black sticky left-0 z-10 shadow-xs">
                <div class="text-sm">วันอังคาร</div>
                <div class="text-[10px] text-pink-700/80 font-medium">Tuesday</div>
              </td>
              <!-- Periods 1 - 2: ปวช.2/2 คาบที่ 1-2 -->
              <td colspan="2"
                class="p-2 border-r border-gray-200 bg-indigo-50/90 border-t-2 border-t-indigo-500 shadow-xs">
                <div
                  class="p-2.5 rounded-xl bg-white/90 border border-indigo-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-black">ปวช.2/2
                      (ทวิศึกษา)</span>
                    <span class="text-[10px] text-indigo-600 font-bold">คาบ 1 - 2 (08:00-10:00)</span>
                  </div>
                  <p class="font-extrabold text-indigo-950 text-xs leading-tight">21901-2012</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight">การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม</p>
                  <p class="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-indigo-500" />ห้อง 6404
                  </p>
                </div>
              </td>
              <!-- Periods 3 - 4 (ว่าง) -->
              <td colspan="2" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- (Period 5 covered by rowspan!) -->
              <!-- Periods 6 - 11 (ว่าง) -->
              <td colspan="6" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
            </tr>

            <!-- 3. วันพุธ (Wednesday) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td
                class="py-4 px-3 border-r border-gray-200 bg-emerald-50/40 text-emerald-900 font-black sticky left-0 z-10 shadow-xs">
                <div class="text-sm">วันพุธ</div>
                <div class="text-[10px] text-emerald-700/80 font-medium">Wednesday</div>
              </td>
              <!-- Periods 1 - 4 (ไม่มีคาบสอน) -->
              <td colspan="4" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- (Period 5 covered by lunch break rowspan!) -->
              <!-- Period 6 - 7: ปวช.3/2 คาบที่ 6 - 7 (13:00 - 15:00) -->
              <td colspan="2"
                class="p-2 border-r border-gray-200 bg-amber-50/90 border-t-2 border-t-amber-500 shadow-xs">
                <div
                  class="p-2.5 rounded-xl bg-white/90 border border-amber-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-black">ปวช.3/2</span>
                    <span class="text-[10px] text-amber-700 font-bold">คาบ 6 - 7 (13:00-15:00)</span>
                  </div>
                  <p class="font-extrabold text-amber-950 text-xs leading-tight">21901-2007</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight">เทคโนโลยีระบบสมองกลฝังตัวและไอโอที</p>
                  <p class="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-amber-500" />ห้อง 6403
                  </p>
                </div>
              </td>
              <!-- Period 8 - 9: กิจกรรมแผนก (15:00 - 17:00) -->
              <td colspan="2" class="p-2 border-r border-gray-200 bg-rose-50/90 border-t-2 border-t-rose-500 shadow-xs">
                <div
                  class="p-2.5 rounded-xl bg-white/90 border border-rose-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black">กิจกรรมพิเศษ</span>
                    <span class="text-[10px] text-rose-700 font-bold">คาบ 8 - 9 (15:00-17:00)</span>
                  </div>
                  <p class="font-extrabold text-rose-950 text-xs leading-tight">กิจกรรมแผนก</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight">กิจกรรมแผนกวิชาเทคโนโลยีสารสนเทศ</p>
                  <p class="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                    <Sparkles class="w-3 h-3 text-rose-500" />ห้องกิจกรรม
                  </p>
                </div>
              </td>
              <!-- Period 10: ปวช.3/2 คาบที่ 10 (17:00 - 18:00) -->
              <td colspan="1"
                class="p-2 border-r border-gray-200 bg-amber-50/90 border-t-2 border-t-amber-500 shadow-xs">
                <div
                  class="p-2 rounded-xl bg-white/90 border border-amber-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-black">ปวช.3/2</span>
                    <span class="text-[10px] text-amber-700 font-bold">คาบ 10</span>
                  </div>
                  <p class="font-extrabold text-amber-950 text-xs leading-tight">21901-2007</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight line-clamp-1">สมองกลฝังตัวฯ (ต่อ)</p>
                  <p class="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-amber-500" />ห้อง 6403
                  </p>
                </div>
              </td>
              <!-- Period 11 (ว่าง) -->
              <td colspan="1" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
            </tr>

            <!-- 4. วันพฤหัสบดี (Thursday) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td
                class="py-4 px-3 border-r border-gray-200 bg-orange-50/40 text-orange-900 font-black sticky left-0 z-10 shadow-xs">
                <div class="text-sm">วันพฤหัสฯ</div>
                <div class="text-[10px] text-orange-700/80 font-medium">Thursday</div>
              </td>
              <!-- Periods 1 - 3 (ว่าง) -->
              <td colspan="3" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- Period 4: ปวส.1/1 คาบที่ 4 (ห้อง 6405) -->
              <td colspan="1" class="p-2 border-r border-gray-200 bg-teal-50/90 border-t-2 border-t-teal-500 shadow-xs">
                <div
                  class="p-2 rounded-xl bg-white/90 border border-teal-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-teal-600 text-white rounded text-[10px] font-black">ปวส.1/1</span>
                    <span class="text-[10px] text-teal-700 font-bold">คาบ 4</span>
                  </div>
                  <p class="font-extrabold text-teal-950 text-xs leading-tight">31901-2007</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight line-clamp-2">เทคโนโลยีการจัดการฐานข้อมูล
                  </p>
                  <p class="text-[10px] text-teal-800 font-bold flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-teal-600" />ห้อง 6405
                  </p>
                </div>
              </td>
              <!-- (Period 5 covered by rowspan!) -->
              <!-- Periods 6 - 9: ปวส.1/1 คาบที่ 6-9 ต่อภาคบ่าย (ห้อง 6405) -->
              <td colspan="4" class="p-2 border-r border-gray-200 bg-teal-50/90 border-t-2 border-t-teal-500 shadow-xs">
                <div
                  class="p-2.5 rounded-xl bg-white/90 border border-teal-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-teal-600 text-white rounded text-[10px] font-black">ปวส.1/1</span>
                    <span class="text-[10px] text-teal-700 font-bold">คาบ 6 - 9 (13:00-17:00)</span>
                  </div>
                  <p class="font-extrabold text-teal-950 text-xs leading-tight">31901-2007</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight">เทคโนโลยีการจัดการฐานข้อมูล (ต่อภาคบ่าย)
                  </p>
                  <div class="flex items-center justify-between text-[10px] text-gray-500">
                    <span class="flex items-center gap-1 text-teal-800 font-bold">
                      <MapPin class="w-3 h-3 text-teal-600" />ห้อง 6405
                    </span>
                    <span class="text-teal-700 font-semibold">ช่วงบ่าย 4 คาบ (รวมทั้งวัน 5 คาบ)</span>
                  </div>
                </div>
              </td>
              <!-- Periods 10 - 11 (ว่าง) -->
              <td colspan="2" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
            </tr>

            <!-- 5. วันศุกร์ (Friday) -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td
                class="py-4 px-3 border-r border-gray-200 bg-sky-50/40 text-sky-900 font-black sticky left-0 z-10 shadow-xs">
                <div class="text-sm">วันศุกร์</div>
                <div class="text-[10px] text-sky-700/80 font-medium">Friday</div>
              </td>
              <!-- Periods 1 - 4 (ว่าง) -->
              <td colspan="4" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- (Period 5 covered by rowspan!) -->
              <!-- Period 6 (ว่าง) -->
              <td colspan="1" class="py-4 px-2 border-r border-gray-100 bg-gray-50/30 text-gray-400 text-xs">
                -
              </td>
              <!-- Periods 7 - 11: ปวส.1/1 คาบที่ 7-11 (ห้อง 6302) -->
              <td colspan="5"
                class="p-2 border-r border-gray-200 bg-purple-50/90 border-t-2 border-t-purple-500 shadow-xs">
                <div
                  class="p-2.5 rounded-xl bg-white/90 border border-purple-200 text-left space-y-1 shadow-xs hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-black">ปวส.1/1</span>
                    <span class="text-[10px] text-purple-700 font-bold">คาบ 7 - 11 (14:00-19:00)</span>
                  </div>
                  <p class="font-extrabold text-purple-950 text-xs leading-tight">31901-2012</p>
                  <p class="font-bold text-gray-800 text-[11px] leading-tight">การวิเคราะห์และนำเสนอข้อมูล</p>
                  <div class="flex items-center justify-between text-[10px] text-gray-500">
                    <span class="flex items-center gap-1 text-purple-800 font-bold">
                      <MapPin class="w-3 h-3 text-purple-600" />ห้อง 6302
                    </span>
                    <span class="text-purple-700 font-semibold">5 คาบต่อเนื่อง</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer Note -->
      <div
        class="p-4 bg-gray-50/60 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <Info class="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>หมายเหตุ:</strong> เวลาเรียนคาบละ 60 นาที (พักเที่ยงคาบ 5) • ติดต่อครูได้ที่ห้องพักครู (6202)
            หรือ</span>
          <router-link to="/teacher" class="font-bold text-emerald-700 hover:underline flex items-center gap-0.5">
            ข้อมูลครูผู้สอน
            <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>
        <span class="font-medium text-gray-400">อัปเดตข้อมูลล่าสุด: ภาคเรียนที่ 2/2569</span>
      </div>
    </div>

    <!-- SUBJECT SUMMARY CARDS (CARDS VIEW & SUMMARY) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-black text-gray-900">สรุปรายละเอียดรายวิชาและกลุ่มเรียนที่สอน</h3>
          <p class="text-xs text-gray-500">ข้อมูลรายวิชา ห้องเรียน และวัน-เวลาเรียน</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="sub in subjectSummaries" :key="sub.code + sub.level"
          class="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          :class="sub.color">
          <div>
            <!-- Top Badges -->
            <div class="flex items-center justify-between mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-black border" :class="sub.badgeColor">
                ห้อง {{ sub.level }}
              </span>
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-gray-200/80 text-gray-700 shadow-2xs">
                รวม {{ sub.totalPeriods }} คาบ/สัปดาห์
              </span>
            </div>

            <!-- Subject Title -->
            <p class="text-xs font-bold text-gray-400 mb-1">รหัสวิชา {{ sub.code }}</p>
            <h4 class="text-lg font-black text-gray-900 mb-2 leading-snug">
              {{ sub.name }}
            </h4>

            <!-- Classroom / Room -->
            <div
              class="flex items-center gap-2 text-xs text-gray-700 bg-white/80 p-2.5 rounded-xl border border-gray-100 mb-4">
              <MapPin class="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>ห้องเรียน / ห้องปฏิบัติการ: <strong class="text-emerald-950 font-black">ห้อง {{ sub.room
                  }}</strong></span>
            </div>

            <!-- Teaching Slots -->
            <div class="space-y-2">
              <p class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-gray-500" /> ตารางเวลาสอน:
              </p>
              <div class="space-y-1.5 pl-1">
                <div v-for="(slot, idx) in sub.slots" :key="idx"
                  class="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg border text-gray-700"
                  :class="slot.isLunch ? 'bg-amber-50/80 border-amber-200 text-amber-800' : 'bg-white border-gray-100'">
                  <span class="font-bold">{{ slot.day }}</span>
                  <span class="font-semibold text-gray-500">{{ slot.periods }}</span>
                  <span class="font-mono text-xs px-2 py-0.5 rounded bg-gray-50 border border-gray-200">{{ slot.time
                    }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white !important;
  }
}
</style>
