<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  X, ChevronLeft, ChevronRight, Presentation, ShieldCheck, CheckCircle2,
  Table, Eye, AlertTriangle, Lightbulb, Users, Clock, MapPin, Target,
  FileSpreadsheet, Sparkles, Award, Building2, Laptop, HelpCircle
} from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const currentSlide = ref(1)
const totalSlides = 7

const close = () => {
  emit('update:modelValue', false)
}

const nextSlide = () => {
  if (currentSlide.value < totalSlides) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 1) {
    currentSlide.value--
  }
}

const goToSlide = (page) => {
  currentSlide.value = page
}

const handleKeyDown = (e) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') nextSlide()
  if (e.key === 'ArrowLeft') prevSlide()
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
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="close"></div>

        <!-- Modal Window -->
        <div class="relative z-10 w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden max-h-[96vh]">
          
          <!-- Top Header Toolbar -->
          <div class="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Presentation class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-white text-sm sm:text-base truncate">
                    ตัวอย่างสไลด์นำเสนอ (Canva Slide Blueprint)
                  </h3>
                  <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 hidden sm:inline-block">
                    7 หน้าตามเกณฑ์
                  </span>
                </div>
                <p class="text-xs text-slate-400 truncate">
                  กรณีศึกษา: การประเมินคุณภาพการให้บริการ IT Support เพื่อพัฒนาองค์กร (IT Service Quality)
                </p>
              </div>
            </div>

            <!-- Header Controls -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {{ currentSlide }} / {{ totalSlides }}
              </span>
              <button
                @click="close"
                type="button"
                class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-slate-700"
                title="ปิดหน้าต่าง (Esc)"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Main Slide Canvas Stage (16:9 Aspect Ratio) -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950 flex items-center justify-center">
            <div class="w-full max-w-4xl aspect-[16/9] bg-white rounded-2xl shadow-xl overflow-hidden relative flex flex-col border border-slate-700/60 transition-all select-none">
              
              <!-- SLIDE 1: COVER -->
              <div v-if="currentSlide === 1" class="h-full w-full p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
                <div class="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div class="flex items-center justify-between z-10">
                  <span class="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 class="w-3.5 h-3.5 text-indigo-400" /> ORGANIZATIONAL DATA ANALYTICS
                  </span>
                  <span class="text-slate-400 text-xs font-mono">วิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล</span>
                </div>

                <div class="my-auto z-10 space-y-3">
                  <div class="inline-block px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                    รายงานการวิเคราะห์และวางแผนเก็บรวบรวมข้อมูลเพื่อพัฒนาองค์กร
                  </div>
                  <h1 class="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    การสำรวจคุณภาพการให้บริการ IT Support<br class="hidden sm:inline" />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                      และความพึงพอใจของพนักงานเพื่อพัฒนาประสิทธิภาพองค์กร
                    </span>
                  </h1>
                  <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    โครงการเก็บรวบรวมข้อมูลเพื่อลดเวลาหยุดชะงักในการทำงาน (Downtime) และยกระดับการให้บริการด้านเทคโนโลยีภายในสำนักงาน
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 z-10">
                  <div>
                    <span class="text-slate-500">ผู้จัดทำ:</span> <strong class="text-slate-200">นายสมชาย มุ่งมั่น</strong> (รหัส 67309010001)
                  </div>
                  <div>
                    <span class="text-slate-500">ระดับชั้น:</span> ปวส.1 แผนกวิชาเทคโนโลยีสารสนเทศ
                  </div>
                </div>
              </div>

              <!-- SLIDE 2: 5W1H CONTEXT -->
              <div v-else-if="currentSlide === 2" class="h-full w-full p-5 sm:p-8 flex flex-col justify-between bg-slate-50 text-slate-800">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">บริบทและที่มาของปัญหาในองค์กร (Problem Context)</span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 2 / 7</span>
                  </div>
                  <h2 class="text-base sm:text-xl font-black text-slate-900">
                    ทำไมต้องแก้ปัญหานี้? และวิเคราะห์เป้าหมายด้วยกรอบ 5W1H
                  </h2>
                </div>

                <!-- 5W1H Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2">
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">
                      <AlertTriangle class="w-3 h-3 text-rose-500" /> WHY (ทำไมต้องเก็บ)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      พนักงานแจ้งว่าระบบคอมพิวเตอร์และอินเทอร์เน็ตมีปัญหาบ่อย รอนาน ทำให้งานส่งไม่ทันกำหนด
                    </p>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-sky-600 uppercase flex items-center gap-1">
                      <Target class="w-3 h-3 text-sky-500" /> WHAT (เก็บข้อมูลอะไร)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      ประเภทปัญหาที่พบบ่อย, เวลารอคอยแก้ไข (ชั่วโมง), และคะแนนความพึงพอใจต่อ IT Support
                    </p>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                      <Users class="w-3 h-3 text-indigo-500" /> WHO (กลุ่มเป้าหมาย)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      พนักงานบริษัททุกแผนก (บัญชี, การตลาด, ขาย, HR, คลังสินค้า) จำนวน 80–120 คน
                    </p>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
                      <MapPin class="w-3 h-3 text-amber-500" /> WHERE (สถานที่ใด)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      สำนักงานใหญ่ อาคาร A และ B รวมถึงศูนย์กระจายสินค้าที่มีการใช้อุปกรณ์ IT ประจำวัน
                    </p>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                      <Clock class="w-3 h-3 text-emerald-500" /> WHEN (ช่วงเวลาใด)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      เก็บข้อมูลการใช้งานและปัญหาที่พบในรอบ 1 เดือนที่ผ่านมา (ช่วงเวลาทำงาน 08:30 - 17:30)
                    </p>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div class="text-[10px] font-bold text-purple-600 uppercase flex items-center gap-1">
                      <Award class="w-3 h-3 text-purple-500" /> HOW (ผลลัพธ์องค์กร)
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      นำเสนอฝ่ายบริหารเพื่อกำหนดมาตรฐาน SLA ให้ช่างแก้ไขเสร็จไวขึ้น และจัดหาอุปกรณ์สำรอง
                    </p>
                  </div>
                </div>

                <div class="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] flex items-center gap-2">
                  <Lightbulb class="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>เป้าหมายสูงสุด:</strong> นำข้อมูลตัวเลขจริงมาแก้ปัญหา แทนการเดาสาเหตุ เพื่อให้พนักงานทำงานได้อย่างราบรื่นและบริษัทไม่เสียโอกาสทางธุรกิจ</span>
                </div>
              </div>

              <!-- SLIDE 3: DATA REQUIREMENTS TABLE -->
              <div v-else-if="currentSlide === 3" class="h-full w-full p-4 sm:p-7 flex flex-col justify-between bg-white text-slate-800">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">ข้อกำหนดตัวแปรข้อมูล (Data Requirements)</span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 3 / 7</span>
                  </div>
                  <h2 class="text-base sm:text-lg font-black text-slate-900">
                    ตารางจำแนกตัวแปร 6 ข้อในแบบสอบถาม สู่ประเภทข้อมูลและสถิติ
                  </h2>
                </div>

                <!-- Structured Mini Table -->
                <div class="overflow-x-auto my-1 border border-slate-200 rounded-xl">
                  <table class="w-full text-[11px] text-left">
                    <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th class="p-2">ข้อที่</th>
                        <th class="p-2">คำถามในแบบสอบถาม</th>
                        <th class="p-2">ชนิดคำถามในฟอร์ม</th>
                        <th class="p-2">ประเภทข้อมูล (NOIR)</th>
                        <th class="p-2">การนำไปคำนวณ</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td class="p-1.5 font-bold">1</td>
                        <td class="p-1.5">แผนกที่สังกัด (บัญชี, การตลาด, ขาย, HR, ผลิต)</td>
                        <td class="p-1.5">Multiple Choice</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">Nominal</span></td>
                        <td class="p-1.5">นับจำนวนความถี่แจ้งซ่อมแยกแผนก (COUNT)</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold">2</td>
                        <td class="p-1.5">ประเภทปัญหาที่พบ (Hardware, Software, Wi-Fi, Printer)</td>
                        <td class="p-1.5">Multiple Choice</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">Nominal</span></td>
                        <td class="p-1.5">หาปัญหาที่เกิดบ่อยที่สุด (MODE)</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold">3</td>
                        <td class="p-1.5">จำนวนครั้งที่แจ้งซ่อม IT ในรอบ 1 เดือนที่ผ่านมา</td>
                        <td class="p-1.5">Short Answer (ตัวเลข)</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Discrete</span></td>
                        <td class="p-1.5">หาค่าเฉลี่ยครั้งที่ซ่อม (AVERAGE) และยอดรวม</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold">4</td>
                        <td class="p-1.5">ระยะเวลาเฉลี่ยที่รอช่างมาแก้ไขจนเสร็จ (ชั่วโมง)</td>
                        <td class="p-1.5">Short Answer (ทศนิยม)</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">Continuous</span></td>
                        <td class="p-1.5">คำนวณเวลารอคอยเฉลี่ย และดูค่า MIN/MAX</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold">5</td>
                        <td class="p-1.5">ระดับความพึงพอใจต่อการให้บริการของ IT (1-5 ดาว)</td>
                        <td class="p-1.5">Linear Scale (1-5)</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">Ordinal</span></td>
                        <td class="p-1.5">คำนวณคะแนนเฉลี่ยความพึงพอใจองค์กร</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold">6</td>
                        <td class="p-1.5">ข้อเสนอแนะในการปรับปรุงระบบ IT และอุปกรณ์องค์กร</td>
                        <td class="p-1.5">Paragraph Text</td>
                        <td class="p-1.5"><span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Unstructured</span></td>
                        <td class="p-1.5">วิเคราะห์คำสำคัญเพื่อจัดกลุ่มปัญหาเร่งด่วน</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>* กำหนดตัวแปรครบทั้งข้อมูลเชิงคุณภาพและเชิงปริมาณตามที่โจทย์กำหนด</span>
                  <span class="font-bold text-sky-700">ทั้งหมด 6 ตัวแปร</span>
                </div>
              </div>

              <!-- SLIDE 4: 2 DATA COLLECTION METHODS -->
              <div v-else-if="currentSlide === 4" class="h-full w-full p-4 sm:p-7 flex flex-col justify-between bg-slate-50 text-slate-800">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">เครื่องมือและการเก็บข้อมูล 2 วิธี (Collection Methods)</span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 4 / 7</span>
                  </div>
                  <h2 class="text-base sm:text-lg font-black text-slate-900">
                    เครื่องมือแบบสอบถาม Google Form และวิธีการเก็บข้อมูลร่วมในองค์กร
                  </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                  <!-- Method 1: Google Form -->
                  <div class="p-3 rounded-xl bg-white border border-sky-200 shadow-2xs space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">วิธีที่ 1</span>
                      <strong class="text-xs text-sky-950">แบบสอบถามออนไลน์ (Google Form)</strong>
                    </div>
                    <!-- Mini Form UI Preview Box -->
                    <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-[10px]">
                      <div class="font-bold text-slate-800">แบบสำรวจคุณภาพการให้บริการ IT Support องค์กร</div>
                      <div class="text-slate-500">สร้างบน forms.google.com กระจายผ่านอีเมลพนักงานและ Line องค์กร</div>
                      <div class="text-indigo-600 font-mono">ลิงก์: forms.gle/it-support-eval-01</div>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      <strong>เหตุผลที่ใช้:</strong> ส่งถึงพนักงานทุกคนได้อย่างรวดเร็ว พนักงานตอบได้สะดวกผ่านมือถือ/คอม และผลคำตอบจะเชื่อมเข้า Google Sheets ทันที
                    </p>
                  </div>

                  <!-- Method 2: In-depth Interview -->
                  <div class="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">วิธีที่ 2</span>
                      <strong class="text-xs text-purple-950">การสัมภาษณ์เชิงลึก (In-depth Interview)</strong>
                    </div>
                    <!-- Mini Method Card -->
                    <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-[10px]">
                      <div class="font-bold text-slate-800">สัมภาษณ์ตัวแทนหัวหน้าแผนก 3 ฝ่าย (บัญชี, ขาย, คลัง)</div>
                      <div class="text-slate-500">สอบถามปัญหาเฉพาะเจาะจงที่กระทบขั้นตอนการทำงานสำคัญ</div>
                      <div class="text-purple-700 font-mono">แบบบันทึกการสัมภาษณ์เชิงลึก 3 ท่าน</div>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      <strong>เหตุผลที่ใช้ร่วมกัน:</strong> แบบสอบถามให้ตัวเลขสถิติภาพรวม แต่การสัมภาษณ์ช่วยให้เข้าใจ "สาเหตุรากเหง้า" ของปัญหาที่ตัวเลขในฟอร์มไม่สามารถบอกได้
                    </p>
                  </div>
                </div>

                <div class="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px] flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>การผสมผสาน 2 วิธีช่วยให้องค์กรได้ทั้ง <strong>ข้อมูลสถิติเชิงปริมาณ (Google Form)</strong> และ <strong>ข้อมูลเชิงลึกในการแก้ปัญหา (Interview)</strong></span>
                </div>
              </div>

              <!-- SLIDE 5: SAMPLE COLLECTED DATA TABLE (GOOGLE SHEETS) -->
              <div v-else-if="currentSlide === 5" class="h-full w-full p-3.5 sm:p-6 flex flex-col justify-between bg-white text-slate-800">
                <div>
                  <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-600" /> ตัวอย่างชุดข้อมูลดิบที่จะได้ (Sample Collected Data)
                    </span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 5 / 7</span>
                  </div>
                  <h2 class="text-sm sm:text-base font-black text-slate-900">
                    ตัวอย่างตาราง Google Sheets (Responses) หลังพนักงานส่งคำตอบเข้ามาในระบบ
                  </h2>
                </div>

                <!-- Google Sheets UI Wrapper -->
                <div class="border border-slate-300 rounded-xl overflow-hidden shadow-2xs my-1 bg-white">
                  <!-- Sheets Top Bar -->
                  <div class="bg-emerald-700 text-white px-3 py-1.5 flex items-center justify-between text-[11px]">
                    <div class="flex items-center gap-2 font-mono">
                      <span class="font-bold">Google Sheets:</span>
                      <span class="text-emerald-100">IT_Support_Survey_Responses.csv</span>
                    </div>
                    <span class="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded font-mono">Auto-Synced</span>
                  </div>

                  <!-- Spreadsheet Table -->
                  <div class="overflow-x-auto max-h-[220px]">
                    <table class="w-full text-[10px] text-left border-collapse">
                      <!-- Column Headers -->
                      <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 select-none">
                        <tr>
                          <th class="p-1 text-center bg-slate-200 border-r border-slate-300 w-8 font-mono">#</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans">ประทับเวลา</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans">แผนกที่สังกัด</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans">ประเภทปัญหาที่พบ</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans text-right">จำนวนครั้งแจ้งซ่อม/เดือน</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans text-right">เวลารอแก้ไข (ชม.)</th>
                          <th class="p-1.5 border-r border-slate-200 font-sans text-center">ความพึงพอใจ (1-5)</th>
                          <th class="p-1.5 min-w-[200px] font-sans">ข้อเสนอแนะเพิ่มเติม</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 text-slate-700">
                        <!-- Row 2 -->
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="p-1 text-center bg-slate-100 font-bold border-r border-slate-200 text-slate-500 font-mono">2</td>
                          <td class="p-1.5 border-r border-slate-100 text-slate-500 font-mono">04/11/2026 09:12</td>
                          <td class="p-1.5 border-r border-slate-100 font-bold text-slate-900">ฝ่ายขาย (Sales)</td>
                          <td class="p-1.5 border-r border-slate-100">Network / Wi-Fi</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-bold text-rose-600 font-mono">4</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">3.5</td>
                          <td class="p-1.5 border-r border-slate-100 text-center font-bold text-amber-700 font-mono">2</td>
                          <td class="p-1.5 text-slate-600 italic">"Wi-Fi หลุดบ่อยมากตอนนำเสนอลูกค้าออนไลน์ อยากให้เพิ่มตัวปล่อยสัญญาณครับ"</td>
                        </tr>
                        <!-- Row 3 -->
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="p-1 text-center bg-slate-100 font-bold border-r border-slate-200 text-slate-500 font-mono">3</td>
                          <td class="p-1.5 border-r border-slate-100 text-slate-500 font-mono">04/11/2026 09:28</td>
                          <td class="p-1.5 border-r border-slate-100 font-bold text-slate-900">การเงินและบัญชี</td>
                          <td class="p-1.5 border-r border-slate-100">Printer / หมึกพิมพ์</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">2</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">1.0</td>
                          <td class="p-1.5 border-r border-slate-100 text-center font-bold text-emerald-700 font-mono">4</td>
                          <td class="p-1.5 text-slate-600 italic">"ช่างเปลี่ยนหมึกให้เร็วดี แต่เครื่องพิมพ์เอกสารบิลเริ่มเก่าอยากให้เปลี่ยนเครื่องใหม่"</td>
                        </tr>
                        <!-- Row 4 -->
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="p-1 text-center bg-slate-100 font-bold border-r border-slate-200 text-slate-500 font-mono">4</td>
                          <td class="p-1.5 border-r border-slate-100 text-slate-500 font-mono">04/11/2026 10:05</td>
                          <td class="p-1.5 border-r border-slate-100 font-bold text-slate-900">ทรัพยากรบุคคล (HR)</td>
                          <td class="p-1.5 border-r border-slate-100">Software / โปรแกรม HR</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-bold text-rose-600 font-mono">5</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">4.0</td>
                          <td class="p-1.5 border-r border-slate-100 text-center font-bold text-rose-700 font-mono">1</td>
                          <td class="p-1.5 text-slate-600 italic">"โปรแกรมคิดเงินเดือนค้างบ่อยช่วงสิ้นเดือน แจ้งแล้วรอนานเกือบครึ่งวัน"</td>
                        </tr>
                        <!-- Row 5 -->
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="p-1 text-center bg-slate-100 font-bold border-r border-slate-200 text-slate-500 font-mono">5</td>
                          <td class="p-1.5 border-r border-slate-100 text-slate-500 font-mono">04/11/2026 10:40</td>
                          <td class="p-1.5 border-r border-slate-100 font-bold text-slate-900">การตลาด (Marketing)</td>
                          <td class="p-1.5 border-r border-slate-100">Hardware / จอคอมพิวเตอร์</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">1</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">0.5</td>
                          <td class="p-1.5 border-r border-slate-100 text-center font-bold text-emerald-700 font-mono">5</td>
                          <td class="p-1.5 text-slate-600 italic">"เจ้าหน้าที่บริการรวดเร็วและสุภาพมาก อธิบายวิธีตั้งค่าเข้าใจง่ายครับ"</td>
                        </tr>
                        <!-- Row 6 -->
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="p-1 text-center bg-slate-100 font-bold border-r border-slate-200 text-slate-500 font-mono">6</td>
                          <td class="p-1.5 border-r border-slate-100 text-slate-500 font-mono">04/11/2026 11:15</td>
                          <td class="p-1.5 border-r border-slate-100 font-bold text-slate-900">คลังสินค้าและจัดส่ง</td>
                          <td class="p-1.5 border-r border-slate-100">Hardware / ตัวยิงบาร์โค้ด</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">3</td>
                          <td class="p-1.5 border-r border-slate-100 text-right font-mono">2.5</td>
                          <td class="p-1.5 border-r border-slate-100 text-center font-bold text-amber-700 font-mono">2</td>
                          <td class="p-1.5 text-slate-600 italic">"เครื่องยิงบาร์โค้ดไม่เชื่อมต่อบลูทูธ ขออุปกรณ์สำรองไว้ประจำจุดแพ็กสินค้า"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Calculated Metrics Bar -->
                <div class="grid grid-cols-3 gap-2 text-[10px] text-slate-700 pt-1">
                  <div class="p-1.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span>กลุ่มตัวอย่างจำลอง:</span>
                    <strong class="font-mono text-slate-900">5 รายการ (จากเป้า 80-120 คน)</strong>
                  </div>
                  <div class="p-1.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900">
                    <span>เวลารอคอยเฉลี่ย:</span>
                    <strong class="font-mono">2.3 ชั่วโมง / ครั้ง</strong>
                  </div>
                  <div class="p-1.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900">
                    <span>ความพึงพอใจเฉลี่ย:</span>
                    <strong class="font-mono">2.8 / 5 ดาว (ต้องปรับปรุง)</strong>
                  </div>
                </div>
              </div>

              <!-- SLIDE 6: PDPA PRIVACY MEASURES -->
              <div v-else-if="currentSlide === 6" class="h-full w-full p-4 sm:p-7 flex flex-col justify-between bg-white text-slate-800">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">การคุ้มครองข้อมูลส่วนบุคคลในที่ทำงาน (Workplace PDPA)</span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 6 / 7</span>
                  </div>
                  <h2 class="text-base sm:text-lg font-black text-slate-900">
                    มาตรการคุ้มครองข้อมูลและความปลอดภัยของผู้ตอบแบบสอบถาม
                  </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                    <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <strong class="text-xs text-slate-800 block">การไม่ระบุตัวตน (Anonymous)</strong>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      ไม่เก็บชื่อ รหัสพนักงาน หรืออีเมลส่วนตัว เพื่อให้พนักงานกล้าสะท้อนปัญหาตามความเป็นจริง โดยไม่ต้องกังวลว่าจะถูกหัวหน้างานเพ่งเล็ง
                    </p>
                  </div>

                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                    <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <strong class="text-xs text-slate-800 block">แจ้งวัตถุประสงค์ชัดเจน (Consent)</strong>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      ระบุที่ส่วนหัวฟอร์มอย่างโปร่งใสว่าข้อมูลนำไปใช้ปรับปรุงประสิทธิภาพการทำงานภายในองค์กรเท่านั้น ไม่นำไปใช้ในการประเมินตัดโบนัสหรือ KPI
                    </p>
                  </div>

                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                    <div class="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <strong class="text-xs text-slate-800 block">การจำกัดสิทธิ์เปิดดู (Access Control)</strong>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      ไฟล์สเปรดชีตผลสำรวจถูกเก็บใน Google Workspace องค์กร กำหนดสิทธิ์ดูเฉพาะทีมผู้วิเคราะห์และผู้บริหาร ไม่เผยแพร่ไฟล์ดิบสู่ภายนอก
                    </p>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>วัฒนธรรมองค์กรที่ดี (Safe Space):</strong> เมื่อพนักงานมั่นใจว่าข้อมูลปลอดภัยและไม่ระบุตัวตน จะได้ข้อมูลที่เป็นจริงและนำไปพัฒนาองค์กรได้ตรงจุด</span>
                </div>
              </div>

              <!-- SLIDE 7: DATA COLLECTION PLAN & NEXT STEPS -->
              <div v-else-if="currentSlide === 7" class="h-full w-full p-4 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-bold text-sky-400 uppercase tracking-wider">สรุปแผนการเก็บรวบรวมข้อมูล (Data Collection Action Plan)</span>
                    <span class="text-slate-400 text-xs font-mono">หน้า 7 / 7</span>
                  </div>
                  <h2 class="text-base sm:text-xl font-black text-white">
                    แผนการดำเนินงานและขั้นตอนการเก็บรวบรวมข้อมูลในองค์กร
                  </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                  <div class="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-2 backdrop-blur-sm">
                    <strong class="text-xs text-sky-300 flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-md bg-sky-500/30 text-sky-300 font-bold flex items-center justify-center text-[10px]">1</span>
                      แผนการแจกจ่ายแบบสอบถาม (Deployment Plan)
                    </strong>
                    <ul class="text-[11px] text-slate-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>• <strong>ช่องทางสื่อสาร:</strong> ส่งลิงก์ Google Form ผ่าน Email องค์กร และประกาศใน Line Group ภายในบริษัท</li>
                      <li>• <strong>กลุ่มเป้าหมาย:</strong> พนักงานทุกแผนก (ฝ่ายขาย, ตลาด, บัญชี, คลังสินค้า) เป้าหมาย 80–100 คน</li>
                      <li>• <strong>กรอบเวลา:</strong> เปิดรับคำตอบ 7 วันทำการ (มีข้อความแจ้งเตือน Follow-up ในวันที่ 3 และวันที่ 6)</li>
                    </ul>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-2 backdrop-blur-sm">
                    <strong class="text-xs text-purple-300 flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-md bg-purple-500/30 text-purple-300 font-bold flex items-center justify-center text-[10px]">2</span>
                      การส่งต่อข้อมูลสู่ขั้นตอนถัดไป (Next Steps for Data Pipeline)
                    </strong>
                    <ul class="text-[11px] text-slate-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>• <strong>การบันทึกอัตโนมัติ:</strong> ข้อมูลคำตอบไหลเข้า Google Sheets แบบ Real-time ทันทีที่กดส่ง</li>
                      <li>• <strong>การส่งออกข้อมูล:</strong> Export ข้อมูลเป็นไฟล์ CSV เพื่อจัดเก็บเป็น Raw Data Backup</li>
                      <li>• <strong>ส่งต่อไปสัปดาห์ที่ 3:</strong> นำชุดข้อมูลไปดำเนินการตรวจสอบความถูกต้องและทำความสะอาด (Data Quality & Cleaning)</li>
                    </ul>
                  </div>
                </div>

                <div class="p-3 rounded-2xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-400/30 text-center space-y-1">
                  <p class="text-xs sm:text-sm font-bold text-sky-200">
                    "การวางแผนเก็บรวบรวมข้อมูลที่รอบคอบและเลือกเครื่องมือที่ถูกต้อง คือรากฐานที่สำคัญที่สุดของกระบวนการวิเคราะห์ข้อมูล"
                  </p>
                  <p class="text-[10px] text-slate-400">ขอขอบคุณครับ / พร้อมตอบข้อซักถามเกี่ยวกับแผนการเก็บรวบรวมข้อมูล</p>
                </div>

                <div class="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>นำเสนอจบในเวลา 3 นาที</span>
                  <span class="font-mono text-purple-400">Slide Completed (7 of 7)</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Footer Navigation Bar -->
          <div class="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <!-- Slide Buttons Jump -->
            <div class="flex items-center gap-1.5 overflow-x-auto">
              <button
                v-for="page in totalSlides"
                :key="page"
                @click="goToSlide(page)"
                type="button"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border"
                :class="currentSlide === page 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'"
              >
                หน้า {{ page }}
              </button>
            </div>

            <!-- Prev / Next Controls -->
            <div class="flex items-center gap-2">
              <button
                @click="prevSlide"
                :disabled="currentSlide === 1"
                type="button"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer"
                :class="currentSlide === 1 
                  ? 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed' 
                  : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'"
              >
                <ChevronLeft class="w-3.5 h-3.5" /> ก่อนหน้า
              </button>

              <button
                @click="nextSlide"
                :disabled="currentSlide === totalSlides"
                type="button"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer"
                :class="currentSlide === totalSlides 
                  ? 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed' 
                  : 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500 shadow-sm'"
              >
                ถัดไป <ChevronRight class="w-3.5 h-3.5" />
              </button>
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
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
