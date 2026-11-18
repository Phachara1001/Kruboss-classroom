<template>
  <div class="space-y-6">
    <!-- Screen View (Interactive Dashboard) - Hidden in Print -->
    <div class="space-y-6 print:hidden">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div class="space-y-1">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <TrendingUp class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-stone-900">ผลสัมฤทธิ์ทางการเรียน (Learning Achievement)</h1>
              <p class="text-xs sm:text-sm text-stone-500">
                วิเคราะห์พัฒนาการของผู้เรียน เปรียบเทียบคะแนนก่อนเรียน (Pre-test) และหลังเรียน (Post-test)
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            @click="resetFilters"
            class="px-3.5 py-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold transition"
          >
            รีเซ็ตตัวกรอง
          </button>
          <button
            @click="printReport"
            class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl transition flex items-center space-x-2 border border-stone-300"
          >
            <Printer class="w-4 h-4 text-stone-600" />
            <span>พิมพ์รายงานทางการ / PDF</span>
          </button>
          <button
            @click="exportExcelReport"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <Download class="w-4 h-4" />
            <span>ส่งออก Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <!-- Course -->
          <div>
            <label class="text-xs font-semibold text-stone-500">รายวิชา</label>
            <select
              v-model="selectedCourseId"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option v-for="c in courses" :key="c.id" :value="c.id">
                {{ c.code }} - {{ c.name || c.title }}
              </option>
            </select>
          </div>

          <!-- Classroom -->
          <div>
            <label class="text-xs font-semibold text-stone-500">ห้องเรียน</label>
            <select
              v-model="selectedClassroom"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">ทุกห้องเรียน</option>
              <option v-for="cls in availableClassrooms" :key="cls" :value="cls">
                {{ cls === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + cls }}
              </option>
            </select>
          </div>

          <!-- Week / Topic -->
          <div>
            <label class="text-xs font-semibold text-stone-500">หัวข้อการเรียน / หน่วยการเรียน</label>
            <select
              v-model="selectedWeek"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option :value="0">ภาพรวมทุกหัวข้อการเรียน</option>
              <option v-for="t in currentCourseTopics" :key="t.weekNumber" :value="t.weekNumber">
                หน่วยที่ {{ t.weekNumber }}: {{ t.name || t.title }}{{ (!t.isOpen || t.status === 'ยังไม่เริ่ม') ? ' (ยังไม่เปิด)' : '' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Card 1: Pre-test Avg -->
        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>คะแนนเฉลี่ยก่อนเรียน (Pre)</span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-stone-800">
            {{ stats.avgPreScore }} <span class="text-xs sm:text-sm font-normal text-stone-400">/ 10</span>
          </div>
          <div class="text-[11px] text-stone-500">
            คิดเป็น {{ stats.avgPrePercent }}% ของคะแนนเต็ม
          </div>
        </div>

        <!-- Card 2: Post-test Avg -->
        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>คะแนนเฉลี่ยหลังเรียน (Post)</span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-700">
            {{ stats.avgPostScore }} <span class="text-xs sm:text-sm font-normal text-emerald-400">/ 10</span>
          </div>
          <div class="text-[11px] text-stone-500">
            คิดเป็น {{ stats.avgPostPercent }}% ของคะแนนเต็ม
          </div>
        </div>

        <!-- Card 3: Score Gain -->
        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>ผลต่างคะแนนเฉลี่ย (Gain)</span>
            <ArrowUpRight v-if="stats.avgGain >= 0" class="w-4 h-4 text-emerald-600" />
            <ArrowDownRight v-else class="w-4 h-4 text-rose-600" />
          </div>
          <div :class="['text-2xl sm:text-3xl font-black', stats.avgGain >= 0 ? 'text-emerald-600' : 'text-rose-600']">
            {{ stats.avgGain >= 0 ? '+' : '' }}{{ stats.avgGain }}
          </div>
          <div class="text-[11px] text-stone-500">
            คะแนนเฉลี่ยเพิ่มขึ้น
          </div>
        </div>

        <!-- Card 4: % Development / Growth -->
        <div class="bg-gradient-to-tr from-teal-500 to-emerald-600 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-teal-100">
            <span>% พัฒนาการรวม</span>
            <Sparkles class="w-4 h-4 text-amber-300" />
          </div>
          <div class="text-2xl sm:text-3xl font-black">
            {{ stats.growthRate >= 0 ? '+' : '' }}{{ stats.growthRate }}%
          </div>
          <div class="text-[11px] text-teal-100">
            ผู้เรียนมีพัฒนาการ {{ stats.improvedCount }}/{{ stats.totalStudents }} คน
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart 1: Pre vs Post Comparison Bar Chart -->
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <h3 class="font-bold text-stone-900 text-base flex items-center space-x-2">
                <BarChart2 class="w-4 h-4 text-teal-600" />
                <span>เปรียบเทียบคะแนน Pre vs Post แต่ละสัปดาห์</span>
              </h3>
              <p class="text-xs text-stone-500">คะแนนเฉลี่ยเต็ม 10 คะแนนในแต่ละหัวข้อ</p>
            </div>
            <div class="flex items-center space-x-3 text-xs">
              <span class="flex items-center space-x-1.5 text-stone-600">
                <span class="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
                <span>Pre-test</span>
              </span>
              <span class="flex items-center space-x-1.5 text-stone-600">
                <span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                <span>Post-test</span>
              </span>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="pt-4 h-64 flex items-end justify-around border-b border-stone-200 pb-2 px-4 gap-2">
            <div
              v-for="bar in weeklyBarChartData"
              :key="bar.week"
              class="flex-1 flex flex-col items-center h-full justify-end max-w-[50px] group relative"
            >
              <!-- Tooltip -->
              <div class="absolute -top-12 bg-stone-900 text-white text-[11px] rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                Pre: {{ bar.pre }} | Post: {{ bar.post }} (Gain: {{ bar.gain >= 0 ? '+' : '' }}{{ bar.gain }})
              </div>

              <div class="w-full flex items-end justify-center space-x-1 h-48">
                <!-- Pre Bar -->
                <div
                  class="w-1/2 bg-amber-400 rounded-t transition-all duration-300"
                  :style="{ height: `${(bar.pre / 10) * 100}%` }"
                ></div>
                <!-- Post Bar -->
                <div
                  class="w-1/2 bg-emerald-500 rounded-t transition-all duration-300"
                  :style="{ height: `${(bar.post / 10) * 100}%` }"
                ></div>
              </div>

              <!-- Label -->
              <span class="text-[11px] font-semibold text-stone-500 mt-2 truncate w-full text-center">
                W{{ bar.week }}
              </span>
            </div>
          </div>
        </div>

        <!-- Chart 2: Donut Breakdown (Improved / Same / Decreased) -->
        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-stone-900 text-base flex items-center space-x-2">
              <PieChart class="w-4 h-4 text-teal-600" />
              <span>สัดส่วนผลสัมฤทธิ์</span>
            </h3>
            <p class="text-xs text-stone-500">สัดส่วนผู้เรียนตามแนวโน้มพัฒนาการ</p>
          </div>

          <!-- Circular Donut SVG -->
          <div class="flex items-center justify-center py-2 relative">
            <svg viewBox="0 0 36 36" class="w-44 h-44">
              <!-- Background circle -->
              <path
                class="text-stone-100"
                stroke-width="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <!-- Improved segment (Emerald) -->
              <path
                class="text-emerald-500 transition-all duration-500"
                :stroke-dasharray="`${stats.improvedPercent}, 100`"
                stroke-dashoffset="0"
                stroke-width="3.8"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <!-- Same segment (Amber) -->
              <path
                class="text-amber-400 transition-all duration-500"
                :stroke-dasharray="`${stats.samePercent}, 100`"
                :stroke-dashoffset="`-${stats.improvedPercent}`"
                stroke-width="3.8"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <!-- Decreased segment (Rose) -->
              <path
                class="text-rose-500 transition-all duration-500"
                :stroke-dasharray="`${stats.decreasedPercent}, 100`"
                :stroke-dashoffset="`-${stats.improvedPercent + stats.samePercent}`"
                stroke-width="3.8"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <!-- Center Content -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span class="text-2xl font-black text-stone-800">{{ stats.improvedPercent }}%</span>
              <span class="text-[10px] text-stone-500 font-medium">มีคะแนนพัฒนาขึ้น</span>
            </div>
          </div>

          <!-- Legend -->
          <div class="space-y-2 text-xs pt-2 border-t border-stone-100">
            <div class="flex items-center justify-between">
              <span class="flex items-center space-x-2 text-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>คะแนนเพิ่มขึ้น (พัฒนาการ)</span>
              </span>
              <span class="font-bold text-stone-800">{{ stats.improvedCount }} คน ({{ stats.improvedPercent }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center space-x-2 text-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>คะแนนเท่าเดิม</span>
              </span>
              <span class="font-bold text-stone-800">{{ stats.sameCount }} คน ({{ stats.samePercent }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center space-x-2 text-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>คะแนนลดลง</span>
              </span>
              <span class="font-bold text-stone-800">{{ stats.decreasedCount }} คน ({{ stats.decreasedPercent }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Table Section (Screen Version) -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-stone-900 text-base">
              รายงานผลสัมฤทธิ์รายบุคคล
            </h3>
            <p class="text-xs text-stone-500">
              คลิกที่แถวผู้เรียนเพื่อดูประวัติการทำแบบทดสอบแบบละเอียด
            </p>
          </div>

          <div class="relative w-full sm:w-64">
            <Search class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              v-model="tableSearchQuery"
              type="text"
              placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
              class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-stone-50 border-y border-stone-200 text-stone-600 font-bold">
                <th class="py-3 px-3 w-12 text-center">#</th>
                <th class="py-3 px-3">รหัสนักศึกษา</th>
                <th class="py-3 px-3">ชื่อ - นามสกุล</th>
                <th class="py-3 px-3">ห้องเรียน</th>
                <th class="py-3 px-3 text-center">Pre-test เฉลี่ย</th>
                <th class="py-3 px-3 text-center">Post-test เฉลี่ย</th>
                <th class="py-3 px-3 text-center">ผลต่าง (Gain)</th>
                <th class="py-3 px-3 text-center">% พัฒนาการ</th>
                <th class="py-3 px-3 text-center">สถานะ</th>
                <th class="py-3 px-3 text-center">การกระทำ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr
                v-for="(row, idx) in paginatedStudents"
                :key="row.studentId"
                class="hover:bg-stone-50/80 transition cursor-pointer"
                @click="openStudentDetail(row)"
              >
                <td class="py-3 px-3 text-center text-stone-400">{{ idx + 1 }}</td>
                <td class="py-3 px-3 font-mono font-bold text-stone-800">{{ row.studentId }}</td>
                <td class="py-3 px-3 font-medium text-stone-900">{{ row.name }}</td>
                <td class="py-3 px-3 text-stone-600">{{ row.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (row.classroom || '-') }}</td>
                <td class="py-3 px-3 text-center font-bold text-amber-700 bg-amber-50/40">
                  {{ row.preAvg }}
                </td>
                <td class="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/40">
                  {{ row.postAvg }}
                </td>
                <td :class="['py-3 px-3 text-center font-black', row.gain >= 0 ? 'text-emerald-600' : 'text-rose-600']">
                  {{ row.gain >= 0 ? '+' : '' }}{{ row.gain }}
                </td>
                <td class="py-3 px-3 text-center font-bold text-teal-700">
                  {{ row.gainPercent >= 0 ? '+' : '' }}{{ row.gainPercent }}%
                </td>
                <td class="py-3 px-3 text-center">
                  <span
                    v-if="row.status === 'improved'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <TrendingUp class="w-3.5 h-3.5 text-emerald-600" />
                    <span>พัฒนาขึ้น</span>
                  </span>
                  <span
                    v-else-if="row.status === 'same'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <Minus class="w-3.5 h-3.5 text-amber-600" />
                    <span>เท่าเดิม</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <TrendingDown class="w-3.5 h-3.5 text-rose-600" />
                    <span>ลดลง</span>
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <button
                    @click.stop="openStudentDetail(row)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:bg-teal-50 rounded-lg transition"
                  >
                    ดูประวัติ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📄 OFFICIAL ACADEMIC REPORT (VISIBLE ONLY IN PRINT / PDF MODE)             -->
    <!-- ========================================================================= -->
    <div class="hidden print:block font-serif text-black bg-white p-2 space-y-4 print-academic-document">
      <!-- Institutional Header -->
      <div class="text-center space-y-1 pb-3 border-b-2 border-black">
        <h2 class="text-lg font-bold tracking-wide uppercase">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</h2>
        <p class="text-xs text-stone-700">ระบบการจัดการเรียนรู้ออนไลน์และประเมินผลสัมฤทธิ์ทางการศึกษา (LMS Learning Analytics)</p>
        <h1 class="text-base font-black pt-1">แบบรายงานการประเมินและเปรียบเทียบผลสัมฤทธิ์ทางการเรียน (Pre-test / Post-test)</h1>
        <p class="text-[11px] text-stone-600 italic">Official Learning Achievement Assessment & Competency Development Report</p>
      </div>

      <!-- Metadata Box -->
      <div class="border border-black p-3 text-xs leading-relaxed grid grid-cols-2 gap-x-6 gap-y-1.5 bg-stone-50/40">
        <div><span class="font-bold">รหัสและชื่อวิชา:</span> {{ currentCourse.code }} {{ currentCourse.name || currentCourse.title }}</div>
        <div><span class="font-bold">ภาคเรียน/ปีการศึกษา:</span> ภาคเรียนที่ {{ filterSemester }} ปีการศึกษา {{ filterYear }}</div>
        <div><span class="font-bold">กลุ่มเรียน / ห้องเรียน:</span> {{ selectedClassroom === 'all' ? 'ทุกห้องเรียนในรายวิชา' : selectedClassroom }}</div>
        <div>
          <span class="font-bold">หัวข้อการเรียนที่ประเมิน:</span> 
          {{ selectedWeek === 0 ? 'ภาพรวมทุกหน่วยการเรียนตลอดภาคเรียน' : `หน่วยที่ ${selectedWeek}: ${currentCourseTopics.find(t => t.weekNumber === selectedWeek)?.name || currentCourseTopics.find(t => t.weekNumber === selectedWeek)?.title || ''}` }}
        </div>
        <div><span class="font-bold">จำนวนผู้เข้ารับการประเมิน:</span> {{ studentsPerformanceData.length }} คน</div>
        <div><span class="font-bold">วันที่ออกเอกสารรายงาน:</span> {{ currentDateThai }}</div>
      </div>

      <!-- Formal Statistical Summary Table -->
      <div>
        <h3 class="text-xs font-bold mb-1.5 text-stone-900">สรุปผลการวิเคราะห์เชิงสถิติ (Executive Summary)</h3>
        <table class="w-full text-xs border border-black border-collapse text-center">
          <thead>
            <tr class="bg-stone-200 border-b border-black font-bold">
              <th class="p-1.5 border-r border-black">คะแนนเฉลี่ย Pre-test</th>
              <th class="p-1.5 border-r border-black">คะแนนเฉลี่ย Post-test</th>
              <th class="p-1.5 border-r border-black">ผลต่างคะแนนเฉลี่ย (Gain)</th>
              <th class="p-1.5 border-r border-black">% อัตราการพัฒนา</th>
              <th class="p-1.5 border-r border-black">ผู้เรียนพัฒนาขึ้น</th>
              <th class="p-1.5 border-r border-black">คะแนนคงที่</th>
              <th class="p-1.5">ควรพัฒนาเพิ่ม</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-1.5 border-r border-black font-bold">{{ stats.avgPreScore }} / 10 ({{ stats.avgPrePercent }}%)</td>
              <td class="p-1.5 border-r border-black font-bold">{{ stats.avgPostScore }} / 10 ({{ stats.avgPostPercent }}%)</td>
              <td class="p-1.5 border-r border-black font-bold">{{ stats.avgGain >= 0 ? '+' : '' }}{{ stats.avgGain }} คะแนน</td>
              <td class="p-1.5 border-r border-black font-bold">{{ stats.growthRate >= 0 ? '+' : '' }}{{ stats.growthRate }}%</td>
              <td class="p-1.5 border-r border-black">{{ stats.improvedCount }} คน ({{ stats.improvedPercent }}%)</td>
              <td class="p-1.5 border-r border-black">{{ stats.sameCount }} คน ({{ stats.samePercent }}%)</td>
              <td class="p-1.5">{{ stats.decreasedCount }} คน ({{ stats.decreasedPercent }}%)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formal Student Roster Table -->
      <div>
        <h3 class="text-xs font-bold mb-1.5 text-stone-900">ผลการประเมินรายบุคคล (Individual Student Records)</h3>
        <table class="w-full text-[11px] border border-black border-collapse">
          <thead>
            <tr class="bg-stone-200 border-b border-black font-bold text-center">
              <th class="p-1.5 w-8 border-r border-black">ลำดับ</th>
              <th class="p-1.5 w-24 border-r border-black">รหัสนักศึกษา</th>
              <th class="p-1.5 border-r border-black text-left">ชื่อ - นามสกุล</th>
              <th class="p-1.5 w-16 border-r border-black">ห้อง</th>
              <th class="p-1.5 w-16 border-r border-black">Pre (เฉลี่ย)</th>
              <th class="p-1.5 w-16 border-r border-black">Post (เฉลี่ย)</th>
              <th class="p-1.5 w-16 border-r border-black">ผลต่าง</th>
              <th class="p-1.5 w-16 border-r border-black">% พัฒนา</th>
              <th class="p-1.5 w-28">ผลการประเมิน</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in studentsPerformanceData"
              :key="row.studentId"
              class="border-b border-stone-300"
            >
              <td class="p-1 text-center border-r border-stone-300">{{ idx + 1 }}</td>
              <td class="p-1 text-center font-mono border-r border-stone-300">{{ row.studentId }}</td>
              <td class="p-1 border-r border-stone-300">{{ row.name }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (row.classroom || '-') }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.preAvg }}</td>
              <td class="p-1 text-center border-r border-stone-300 font-bold">{{ row.postAvg }}</td>
              <td class="p-1 text-center border-r border-stone-300 font-bold">
                {{ row.gain >= 0 ? '+' : '' }}{{ row.gain }}
              </td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.gainPercent }}%</td>
              <td class="p-1 text-center text-[10px] font-medium">
                {{ row.status === 'improved' ? 'มีพัฒนาการเชิงบวก' : (row.status === 'same' ? 'ผลการเรียนคงที่' : 'ควรพัฒนาเพิ่มเติม') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formal Signatures Section -->
      <div class="pt-6 grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
        <div class="space-y-1">
          <p class="font-bold">ผู้จัดทำและรายงานผล</p>
          <div class="pt-10">
            <p>ลงชื่อ ................................................................................</p>
            <p class="pt-1">(อาจารย์ผู้รับผิดชอบรายวิชา)</p>
            <p class="pt-1">วันที่ .......... เดือน .............................. พ.ศ. ...............</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="font-bold">ผู้รับรองและตรวจสอบรายงาน</p>
          <div class="pt-10">
            <p>ลงชื่อ ................................................................................</p>
            <p class="pt-1">(หัวหน้าแผนกวิชา / หัวหน้าสาขาวิชา)</p>
            <p class="pt-1">วันที่ .......... เดือน .............................. พ.ศ. ...............</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Student Detailed History with Charts & Left/Right Split (Screen Only) -->
    <Teleport to="body">
      <div
        v-if="showDetailModal && selectedStudentRow"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-sm overflow-y-auto print:hidden"
        @click.self="showDetailModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-5xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          <!-- Top Header: ชื่อนามสกุล รหัสนักศึกษา ห้อง วิชา -->
          <div class="px-6 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div class="flex items-center space-x-3.5">
              <div class="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shrink-0">
                <User class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-black text-lg text-white tracking-tight">{{ selectedStudentRow.name }}</h3>
                  <span class="px-2 py-0.5 rounded-md bg-white/10 text-stone-300 font-mono text-xs">
                    รหัส {{ selectedStudentRow.studentId }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
                    {{ selectedStudentRow.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + selectedStudentRow.classroom }}
                  </span>
                </div>
                <p class="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                  <BookOpen class="w-3.5 h-3.5 text-teal-400" />
                  <span>รายวิชา: {{ currentCourse.name || currentCourse.title }} ({{ currentCourse.id }})</span>
                </p>
              </div>
            </div>
            <button @click="showDetailModal = false" class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body: 2 Columns (Left: Charts & Multi-view Analytics | Right: Topic Breakdown) -->
          <div class="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-stone-50/60">
            
            <!-- LEFT COLUMN: Graph & Multi-view Analytics (7 cols) -->
            <div class="lg:col-span-7 space-y-4 flex flex-col">
              <div class="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex-1 flex flex-col">
                
                <!-- Chart Title & Switcher Tabs -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h4 class="font-black text-stone-800 text-sm flex items-center gap-2">
                      <BarChart3 class="w-4 h-4 text-teal-600" />
                      <span>แผนภูมิพัฒนาการเรียนรู้รายบุคคล</span>
                    </h4>
                    <p class="text-[11px] text-stone-500">เปรียบเทียบผลคะแนนก่อนเรียนและหลังเรียน</p>
                  </div>

                  <!-- Chart Type Tabs -->
                  <div class="inline-flex p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      @click="studentModalChartType = 'groupedBar'"
                      class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                      :class="studentModalChartType === 'groupedBar' ? 'bg-white text-teal-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'"
                    >
                      <BarChart3 class="w-3.5 h-3.5" />
                      <span>แท่งคู่</span>
                    </button>
                    <button
                      type="button"
                      @click="studentModalChartType = 'trendLine'"
                      class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                      :class="studentModalChartType === 'trendLine' ? 'bg-white text-teal-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'"
                    >
                      <LineChart class="w-3.5 h-3.5" />
                      <span>เส้นแนวโน้ม</span>
                    </button>
                    <button
                      type="button"
                      @click="studentModalChartType = 'gainBar'"
                      class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                      :class="studentModalChartType === 'gainBar' ? 'bg-white text-teal-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'"
                    >
                      <Activity class="w-3.5 h-3.5" />
                      <span>ผลต่าง (+/-)</span>
                    </button>
                  </div>
                </div>

                <!-- Legend -->
                <div class="flex items-center justify-between py-2 text-xs text-stone-600">
                  <div class="flex items-center gap-4">
                    <span v-if="studentModalChartType !== 'gainBar'" class="inline-flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-sm bg-amber-400"></span>
                      <span>Pre-test (ก่อนเรียน)</span>
                    </span>
                    <span v-if="studentModalChartType !== 'gainBar'" class="inline-flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-sm bg-emerald-500"></span>
                      <span>Post-test (หลังเรียน)</span>
                    </span>
                    <span v-if="studentModalChartType === 'gainBar'" class="inline-flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-sm bg-teal-500"></span>
                      <span>ผลต่างคะแนนพัฒนาการ (+ / -)</span>
                    </span>
                  </div>
                  <span class="text-[11px] text-stone-400">เต็ม 10 คะแนน</span>
                </div>

                <!-- Interactive SVG Charts Area -->
                <div class="flex-1 min-h-[220px] flex items-center justify-center p-2 bg-stone-50/50 rounded-xl border border-stone-100">
                  
                  <!-- MODE 1: Grouped Bar Chart -->
                  <div v-if="studentModalChartType === 'groupedBar'" class="w-full h-full flex flex-col justify-end pt-4">
                    <div class="flex items-end justify-between gap-1.5 sm:gap-2.5 h-44 px-2 border-b border-stone-200">
                      <div
                        v-for="item in selectedStudentRow.weeksBreakdown"
                        :key="item.week"
                        class="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        <!-- Tooltip on Hover -->
                        <div class="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap bg-stone-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl border border-stone-700">
                          <span class="font-bold text-teal-300">หน่วยที่ {{ item.week }}: {{ item.title }}</span>
                          <span class="text-stone-300">Pre: {{ item.pre !== null ? item.pre : '-' }} | Post: {{ item.post !== null ? item.post : '-' }}</span>
                          <span :class="item.diff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'">
                            ผลต่าง: {{ item.diff !== null ? (item.diff >= 0 ? `+${item.diff}` : item.diff) : '-' }}
                          </span>
                        </div>

                        <!-- Bar Pair Container -->
                        <div class="w-full flex items-end justify-center gap-1 h-36">
                          <!-- Pre Bar (Amber) -->
                          <div class="w-1/2 max-w-[14px] flex flex-col items-center justify-end h-full">
                            <span v-if="item.pre !== null" class="text-[9px] font-mono text-amber-700 font-bold mb-0.5 leading-none">
                              {{ item.pre }}
                            </span>
                            <div
                              class="w-full rounded-t-md bg-amber-400 transition-all duration-300 group-hover:bg-amber-500"
                              :style="{ height: `${Math.max(4, ((item.pre || 0) / 10) * 100)}%` }"
                            ></div>
                          </div>

                          <!-- Post Bar (Emerald) -->
                          <div class="w-1/2 max-w-[14px] flex flex-col items-center justify-end h-full">
                            <span v-if="item.post !== null" class="text-[9px] font-mono text-emerald-700 font-bold mb-0.5 leading-none">
                              {{ item.post }}
                            </span>
                            <div
                              class="w-full rounded-t-md bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 shadow-xs"
                              :style="{ height: `${Math.max(4, ((item.post || 0) / 10) * 100)}%` }"
                            ></div>
                          </div>
                        </div>

                        <!-- X-axis Label -->
                        <span class="mt-2 text-[10px] font-bold text-stone-600 truncate max-w-full text-center">
                          น.{{ item.week }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- MODE 2: Trend Line Chart -->
                  <div v-else-if="studentModalChartType === 'trendLine'" class="w-full h-full flex flex-col justify-center px-2 py-3">
                    <svg viewBox="0 0 600 200" class="w-full h-44 overflow-visible">
                      <!-- Grid lines -->
                      <line x1="30" y1="20" x2="580" y2="20" stroke="#e7e5e4" stroke-dasharray="3 3" />
                      <line x1="30" y1="65" x2="580" y2="65" stroke="#e7e5e4" stroke-dasharray="3 3" />
                      <line x1="30" y1="110" x2="580" y2="110" stroke="#e7e5e4" stroke-dasharray="3 3" />
                      <line x1="30" y1="155" x2="580" y2="155" stroke="#d6d3d1" stroke-width="1.5" />
                      
                      <!-- Y axis labels -->
                      <text x="5" y="24" fill="#a8a29e" font-size="10" font-family="monospace">10</text>
                      <text x="12" y="69" fill="#a8a29e" font-size="10" font-family="monospace">7</text>
                      <text x="12" y="114" fill="#a8a29e" font-size="10" font-family="monospace">4</text>
                      <text x="12" y="159" fill="#a8a29e" font-size="10" font-family="monospace">0</text>

                      <!-- Computed Coordinates for Pre and Post lines -->
                      <!-- Pre-test Line (Dashed Amber) -->
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        stroke-width="2.5"
                        stroke-dasharray="4 3"
                        :points="selectedStudentRow.weeksBreakdown.map((w, idx) => {
                          const x = 50 + (idx * (520 / Math.max(1, selectedStudentRow.weeksBreakdown.length - 1)))
                          const score = w.pre !== null ? w.pre : 0
                          const y = 155 - ((score / 10) * 135)
                          return `${x},${y}`
                        }).join(' ')"
                      />

                      <!-- Post-test Line (Solid Emerald) -->
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        stroke-width="3"
                        :points="selectedStudentRow.weeksBreakdown.map((w, idx) => {
                          const x = 50 + (idx * (520 / Math.max(1, selectedStudentRow.weeksBreakdown.length - 1)))
                          const score = w.post !== null ? w.post : 0
                          const y = 155 - ((score / 10) * 135)
                          return `${x},${y}`
                        }).join(' ')"
                      />

                      <!-- Data Points & Labels -->
                      <g v-for="(w, idx) in selectedStudentRow.weeksBreakdown" :key="idx">
                        <!-- Pre Node -->
                        <circle
                          :cx="50 + (idx * (520 / Math.max(1, selectedStudentRow.weeksBreakdown.length - 1)))"
                          :cy="155 - (((w.pre !== null ? w.pre : 0) / 10) * 135)"
                          r="4"
                          fill="#f59e0b"
                          stroke="#ffffff"
                          stroke-width="1.5"
                        />
                        <!-- Post Node -->
                        <circle
                          :cx="50 + (idx * (520 / Math.max(1, selectedStudentRow.weeksBreakdown.length - 1)))"
                          :cy="155 - (((w.post !== null ? w.post : 0) / 10) * 135)"
                          r="5"
                          fill="#10b981"
                          stroke="#ffffff"
                          stroke-width="2"
                        />
                        <!-- X Label -->
                        <text
                          :x="50 + (idx * (520 / Math.max(1, selectedStudentRow.weeksBreakdown.length - 1)))"
                          y="178"
                          text-anchor="middle"
                          fill="#57534e"
                          font-size="10"
                          font-weight="bold"
                        >
                          น.{{ w.week }}
                        </text>
                      </g>
                    </svg>
                  </div>

                  <!-- MODE 3: Gain Bar Chart (+/-) -->
                  <div v-else class="w-full h-full flex flex-col justify-center px-2 py-2">
                    <div class="flex items-center justify-between gap-1.5 sm:gap-2 h-44 px-2 relative">
                      <!-- Center Zero Line -->
                      <div class="absolute inset-x-2 top-1/2 -translate-y-1/2 border-b-2 border-stone-300 z-0"></div>

                      <div
                        v-for="item in selectedStudentRow.weeksBreakdown"
                        :key="item.week"
                        class="flex-1 flex flex-col items-center justify-center h-full relative z-10 group"
                      >
                        <!-- Tooltip on Hover -->
                        <div class="absolute -top-10 z-30 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap bg-stone-900 text-white text-[10px] px-2 py-1 rounded shadow-xl">
                          <span>หน่วยที่ {{ item.week }}: {{ item.title }}</span>
                          <span class="font-bold">ผลต่าง: {{ item.diff !== null ? (item.diff >= 0 ? `+${item.diff}` : item.diff) : '-' }}</span>
                        </div>

                        <!-- Top Half (Positive gain) -->
                        <div class="h-1/2 w-full flex flex-col items-center justify-end pb-0.5">
                          <span v-if="item.diff !== null && item.diff > 0" class="text-[9px] font-mono text-emerald-700 font-black mb-0.5">
                            +{{ item.diff }}
                          </span>
                          <div
                            v-if="item.diff !== null && item.diff > 0"
                            class="w-full max-w-[18px] rounded-t-md bg-emerald-500 shadow-xs"
                            :style="{ height: `${Math.min(100, Math.max(8, (item.diff / 5) * 100))}%` }"
                          ></div>
                        </div>

                        <!-- Bottom Half (Negative gain) -->
                        <div class="h-1/2 w-full flex flex-col items-center justify-start pt-0.5">
                          <div
                            v-if="item.diff !== null && item.diff < 0"
                            class="w-full max-w-[18px] rounded-b-md bg-rose-500 shadow-xs"
                            :style="{ height: `${Math.min(100, Math.max(8, (Math.abs(item.diff) / 5) * 100))}%` }"
                          ></div>
                          <span v-if="item.diff !== null && item.diff < 0" class="text-[9px] font-mono text-rose-700 font-black mt-0.5">
                            {{ item.diff }}
                          </span>
                        </div>

                        <span class="absolute -bottom-3 text-[9px] font-bold text-stone-500">
                          น.{{ item.week }}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Diagnostic Summary Cards (3 Badges) -->
              <div v-if="studentModalInsights" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <!-- Best improvement -->
                <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                  <div class="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
                    <span>พัฒนาการสูงสุด</span>
                  </div>
                  <div class="font-black text-stone-800 text-sm mt-0.5 truncate">
                    {{ studentModalInsights.bestWeek ? `หน่วยที่ ${studentModalInsights.bestWeek.week}` : '-' }}
                  </div>
                  <div class="text-[10px] text-emerald-700 font-semibold">
                    {{ studentModalInsights.bestDiff > 0 ? `+${studentModalInsights.bestDiff} คะแนน` : 'ยังไม่มีผลบวก' }}
                  </div>
                </div>

                <!-- Consistency -->
                <div class="p-3 rounded-2xl bg-teal-50 border border-teal-200/80">
                  <div class="text-[10px] text-teal-700 font-bold flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5 text-teal-600" />
                    <span>อัตรามีพัฒนาการ</span>
                  </div>
                  <div class="font-black text-stone-800 text-sm mt-0.5">
                    {{ studentModalInsights.consistencyPercent }}%
                  </div>
                  <div class="text-[10px] text-teal-700 font-semibold">
                    เพิ่มขึ้น {{ studentModalInsights.improvedCount }}/{{ studentModalInsights.totalTestedWeeks }} หน่วย
                  </div>
                </div>

                <!-- Review recommendation -->
                <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 col-span-2 sm:col-span-1">
                  <div class="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <AlertCircle class="w-3.5 h-3.5 text-amber-600" />
                    <span>จุดที่ควรทบทวน</span>
                  </div>
                  <div class="font-black text-stone-800 text-sm mt-0.5 truncate">
                    {{ studentModalInsights.lowestWeek && studentModalInsights.lowestDiff <= 0 ? `หน่วยที่ ${studentModalInsights.lowestWeek.week}` : 'ไม่มีจุดวิกฤต' }}
                  </div>
                  <div class="text-[10px] text-amber-700 font-semibold">
                    {{ studentModalInsights.lowestWeek && studentModalInsights.lowestDiff <= 0 ? `ผลต่าง ${studentModalInsights.lowestDiff} คะแนน` : 'ผลการเรียนดีต่อเนื่อง' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: Summary & Topic Breakdown List (5 cols) -->
            <div class="lg:col-span-5 space-y-3.5 flex flex-col">
              
              <!-- 3 KPI Summary Boxes -->
              <div class="grid grid-cols-3 gap-2 text-center bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div class="p-1">
                  <div class="text-[10px] font-bold text-stone-400 uppercase">Pre-test เฉลี่ย</div>
                  <div class="text-xl font-black text-amber-600 mt-0.5">{{ selectedStudentRow.preAvg }}</div>
                  <div class="text-[9px] text-stone-400">เต็ม 10</div>
                </div>
                <div class="p-1 border-x border-stone-100">
                  <div class="text-[10px] font-bold text-stone-400 uppercase">Post-test เฉลี่ย</div>
                  <div class="text-xl font-black text-emerald-600 mt-0.5">{{ selectedStudentRow.postAvg }}</div>
                  <div class="text-[9px] text-stone-400">เต็ม 10</div>
                </div>
                <div class="p-1">
                  <div class="text-[10px] font-bold text-stone-400 uppercase">ผลต่างคะแนน</div>
                  <div :class="['text-xl font-black mt-0.5', selectedStudentRow.gain >= 0 ? 'text-emerald-600' : 'text-rose-600']">
                    {{ selectedStudentRow.gain >= 0 ? '+' : '' }}{{ selectedStudentRow.gain }}
                  </div>
                  <div :class="['text-[9px] font-bold', selectedStudentRow.gain >= 0 ? 'text-emerald-600' : 'text-rose-600']">
                    {{ selectedStudentRow.gainPercent >= 0 ? '+' : '' }}{{ selectedStudentRow.gainPercent }}%
                  </div>
                </div>
              </div>

              <!-- Topic Breakdown List Header -->
              <div class="flex items-center justify-between px-1">
                <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>สรุปผลรายหน่วย</span>
                  <span class="text-stone-400 font-normal">({{ selectedStudentRow.weeksBreakdown.length }} หน่วย)</span>
                </h4>
                <span class="text-[11px] text-stone-400">เลื่อนดูรายละเอียด</span>
              </div>

              <!-- Scrollable Topics Cards -->
              <div class="space-y-2 overflow-y-auto max-h-[380px] pr-1 flex-1">
                <div
                  v-for="weekItem in selectedStudentRow.weeksBreakdown"
                  :key="weekItem.week"
                  class="p-3 rounded-2xl border border-stone-200/80 bg-white hover:border-teal-300 transition-colors shadow-2xs text-xs"
                >
                  <!-- Unit Header & Full Title -->
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="font-bold text-stone-900 leading-snug">
                      <span class="text-teal-700 font-black">หน่วยที่ {{ weekItem.week }}:</span>
                      {{ weekItem.title }}
                      <span v-if="!weekItem.isOpen || weekItem.status === 'ยังไม่เริ่ม'" class="text-[11px] font-normal text-stone-400 ml-1">
                        (ยังไม่เปิด)
                      </span>
                    </div>
                  </div>

                  <!-- Scores Badges Row -->
                  <div class="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                    <div class="flex items-center gap-3">
                      <div>
                        <span class="text-[10px] text-stone-400 block leading-tight">Pre-test</span>
                        <span class="font-bold font-mono text-amber-700">
                          {{ weekItem.pre !== null ? `${weekItem.pre} / 10` : '-' }}
                        </span>
                      </div>
                      <div class="border-l border-stone-200 pl-3">
                        <span class="text-[10px] text-stone-400 block leading-tight">Post-test</span>
                        <span class="font-bold font-mono text-emerald-700">
                          {{ weekItem.post !== null ? `${weekItem.post} / 10` : '-' }}
                        </span>
                      </div>
                    </div>

                    <!-- Diff Badge -->
                    <div class="text-right">
                      <span class="text-[10px] text-stone-400 block leading-tight">ผลต่าง</span>
                      <span
                        v-if="weekItem.diff !== null"
                        class="inline-flex items-center font-black font-mono px-2 py-0.5 rounded-md text-[11px]"
                        :class="weekItem.diff > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : (weekItem.diff < 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-stone-100 text-stone-600 border border-stone-200')"
                      >
                        {{ weekItem.diff >= 0 ? `+${weekItem.diff}` : weekItem.diff }}
                      </span>
                      <span v-else class="text-stone-300 font-mono">-</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <div class="text-xs text-stone-500 font-medium flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>ข้อมูลผลคะแนนจริงจากระบบ Quiz & Test Database</span>
            </div>
            <button
              @click="showDetailModal = false"
              class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  TrendingUp, TrendingDown, Minus, BarChart2, BarChart3, LineChart, Activity,
  PieChart, Sparkles, ArrowUpRight, ArrowDownRight, Search, User, X, Printer,
  Download, BookOpen, CheckCircle2, AlertCircle
} from '@lucide/vue'
import * as XLSX from 'xlsx'
import { courses } from '@/data/courses'
import { studentsList, isStudent, isStudentInCourse } from '@/data/studentsStore'
import { quizAttemptsStore, getStudentTestRecord, fetchTestAttempts } from '@/data/questionBankStore'
import { gameScoresStore, fetchGameScores } from '@/data/gameScoresStore'

const filterYear = ref('2567')
const filterSemester = ref('2')
const selectedCourseId = ref(courses[0]?.id || '31901-2007')
const selectedClassroom = ref('all')
const selectedWeek = ref(0)
const tableSearchQuery = ref('')

const loadCourseAttempts = async () => {
  const cId = selectedCourseId.value
  const openWeeks = (currentCourse.value?.topics || []).filter(t => t.isOpen).map(t => t.weekNumber)
  try {
    await Promise.all(
      openWeeks.map(w => Promise.all([
        fetchTestAttempts(cId, w),
        fetchGameScores(cId, w)
      ]))
    )
  } catch (err) {
    console.warn('Failed to load test attempts from DB:', err)
  }
}

onMounted(() => {
  loadCourseAttempts()
})

watch(selectedCourseId, () => {
  loadCourseAttempts()
})

const currentCourse = computed(() => {
  return courses.find(c => c.id === selectedCourseId.value) || courses[0]
})

const currentCourseTopics = computed(() => {
  return currentCourse.value?.topics || []
})

const currentDateThai = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const availableClassrooms = computed(() => {
  const classrooms = new Set()
  studentsList.value.forEach(s => {
    if (s.classroom && s.classroom !== 'teacher_room' && isStudent(s)) classrooms.add(s.classroom)
  })
  return Array.from(classrooms).sort()
})

const resetFilters = () => {
  selectedClassroom.value = 'all'
  selectedWeek.value = 0
  tableSearchQuery.value = ''
}

// Compute student dataset with pre/post scores
const studentsPerformanceData = computed(() => {
  const courseId = selectedCourseId.value
  const targetWeek = selectedWeek.value

  const list = studentsList.value
    .filter(s => {
      if (!isStudent(s)) return false
      if (!isStudentInCourse(s, courseId)) return false
      if (selectedClassroom.value !== 'all' && s.classroom !== selectedClassroom.value) return false
      return true
    })
    .sort((a, b) => {
      const idA = (a.studentId || a.id || '').toString()
      const idB = (b.studentId || b.id || '').toString()
      return idA.localeCompare(idB, undefined, { numeric: true })
    })

  return list.map(student => {
    const sId = student.studentId || student.id
    const topics = currentCourseTopics.value

    let totalPre = 0
    let countPre = 0
    let totalPost = 0
    let countPost = 0
    const weeksBreakdown = []

    topics.forEach(t => {
      if (targetWeek > 0 && t.weekNumber !== targetWeek) return

      const preRec = getStudentTestRecord(courseId, t.weekNumber, sId, 'pre')
      const postRec = getStudentTestRecord(courseId, t.weekNumber, sId, 'post')

      const preScore = preRec ? Number(preRec.score) : null
      const postScore = postRec ? Number(postRec.score) : null

      if (preScore !== null) {
        totalPre += preScore
        countPre++
      }
      if (postScore !== null) {
        totalPost += postScore
        countPost++
      }

      const diff = (preScore !== null && postScore !== null) ? Number((postScore - preScore).toFixed(1)) : null
      weeksBreakdown.push({
        week: t.weekNumber,
        title: t.name || t.title || `หัวข้อที่ ${t.weekNumber}`,
        isOpen: t.isOpen,
        status: t.status,
        pre: preScore,
        post: postScore,
        diff
      })
    })

    const preAvg = countPre > 0 ? Number((totalPre / countPre).toFixed(1)) : 0
    const postAvg = countPost > 0 ? Number((totalPost / countPost).toFixed(1)) : 0
    const gain = Number((postAvg - preAvg).toFixed(1))
    const gainPercent = preAvg > 0 ? Math.round((gain / preAvg) * 100) : (postAvg > 0 ? 100 : 0)

    let status = 'same'
    if (gain > 0) status = 'improved'
    else if (gain < 0) status = 'decreased'

    return {
      studentId: sId,
      name: student.name,
      classroom: student.classroom,
      preAvg,
      postAvg,
      gain,
      gainPercent,
      status,
      weeksBreakdown
    }
  })
})

// KPI Stats
const stats = computed(() => {
  const data = studentsPerformanceData.value
  const totalStudents = data.length
  if (totalStudents === 0) {
    return {
      avgPreScore: 0,
      avgPrePercent: 0,
      avgPostScore: 0,
      avgPostPercent: 0,
      avgGain: 0,
      growthRate: 0,
      improvedCount: 0,
      sameCount: 0,
      decreasedCount: 0,
      improvedPercent: 0,
      samePercent: 0,
      decreasedPercent: 0,
      totalStudents: 0
    }
  }

  const sumPre = data.reduce((acc, cur) => acc + cur.preAvg, 0)
  const sumPost = data.reduce((acc, cur) => acc + cur.postAvg, 0)
  const avgPre = Number((sumPre / totalStudents).toFixed(1))
  const avgPost = Number((sumPost / totalStudents).toFixed(1))
  const avgGain = Number((avgPost - avgPre).toFixed(1))
  const growthRate = avgPre > 0 ? Math.round((avgGain / avgPre) * 100) : 0

  const improved = data.filter(d => d.status === 'improved').length
  const same = data.filter(d => d.status === 'same').length
  const decreased = data.filter(d => d.status === 'decreased').length

  const improvedPercent = Math.round((improved / totalStudents) * 100)
  const samePercent = Math.round((same / totalStudents) * 100)
  const decreasedPercent = Math.max(0, 100 - improvedPercent - samePercent)

  return {
    avgPreScore: avgPre,
    avgPrePercent: Math.round((avgPre / 10) * 100),
    avgPostScore: avgPost,
    avgPostPercent: Math.round((avgPost / 10) * 100),
    avgGain,
    growthRate,
    improvedCount: improved,
    sameCount: same,
    decreasedCount: decreased,
    improvedPercent,
    samePercent,
    decreasedPercent,
    totalStudents
  }
})

// Bar Chart data per week
const weeklyBarChartData = computed(() => {
  const courseId = selectedCourseId.value
  const topics = currentCourseTopics.value
  const students = studentsList.value.filter(s => isStudent(s) && isStudentInCourse(s, courseId))

  return topics.map(t => {
    let preSum = 0
    let preCount = 0
    let postSum = 0
    let postCount = 0

    students.forEach(s => {
      const sId = s.studentId || s.id
      const preRec = getStudentTestRecord(courseId, t.weekNumber, sId, 'pre')
      const postRec = getStudentTestRecord(courseId, t.weekNumber, sId, 'post')

      if (preRec) {
        preSum += Number(preRec.score)
        preCount++
      }
      if (postRec) {
        postSum += Number(postRec.score)
        postCount++
      }
    })

    const pre = preCount > 0 ? Number((preSum / preCount).toFixed(1)) : 0
    const post = postCount > 0 ? Number((postSum / postCount).toFixed(1)) : 0
    const gain = Number((post - pre).toFixed(1))

    return {
      week: t.weekNumber,
      title: t.title,
      pre,
      post,
      gain
    }
  })
})

// Table filtering
const paginatedStudents = computed(() => {
  let list = studentsPerformanceData.value
  if (tableSearchQuery.value.trim()) {
    const q = tableSearchQuery.value.trim().toLowerCase()
    list = list.filter(s =>
      s.studentId.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
    )
  }
  return list
})

// Detail modal
const showDetailModal = ref(false)
const selectedStudentRow = ref(null)
const studentModalChartType = ref('groupedBar') // 'groupedBar' | 'trendLine' | 'gainBar'

const studentModalInsights = computed(() => {
  if (!selectedStudentRow.value?.weeksBreakdown) return null
  const weeks = selectedStudentRow.value.weeksBreakdown.filter(w => w.pre !== null || w.post !== null)
  if (weeks.length === 0) return null

  let bestWeek = null
  let bestDiff = -999
  let lowestWeek = null
  let lowestDiff = 999
  let improvedCount = 0
  let totalTestedWeeks = 0

  weeks.forEach(w => {
    if (w.diff !== null) {
      totalTestedWeeks++
      if (w.diff > 0) improvedCount++
      if (w.diff > bestDiff) {
        bestDiff = w.diff
        bestWeek = w
      }
      if (w.diff < lowestDiff) {
        lowestDiff = w.diff
        lowestWeek = w
      }
    }
  })

  return {
    bestWeek,
    bestDiff: bestDiff > -900 ? bestDiff : 0,
    lowestWeek,
    lowestDiff: lowestDiff < 900 ? lowestDiff : 0,
    improvedCount,
    totalTestedWeeks,
    consistencyPercent: totalTestedWeeks > 0 ? Math.round((improvedCount / totalTestedWeeks) * 100) : 0
  }
})

const openStudentDetail = (row) => {
  selectedStudentRow.value = row
  studentModalChartType.value = 'groupedBar'
  showDetailModal.value = true
}

// Print / PDF
const printReport = () => {
  window.print()
}

// Export to Excel (.xlsx)
const exportExcelReport = () => {
  const data = studentsPerformanceData.value.map((s, index) => ({
    'ลำดับ': index + 1,
    'รหัสนักศึกษา': s.studentId,
    'ชื่อ - นามสกุล': s.name,
    'ห้องเรียน': s.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (s.classroom || '-'),
    'Pre-test (เฉลี่ย)': s.preAvg,
    'Post-test (เฉลี่ย)': s.postAvg,
    'ผลต่างคะแนน (Gain)': s.gain,
    'อัตราพัฒนาการ (%)': s.gainPercent,
    'ผลการประเมิน': s.status === 'improved' ? 'มีพัฒนาการเชิงบวก' : (s.status === 'same' ? 'ผลการเรียนคงที่' : 'ควรพัฒนาเพิ่มเติม')
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'ผลสัมฤทธิ์ทางการเรียน')

  const fileName = `รายงานผลสัมฤทธิ์ทางการเรียน_${selectedCourseId.value}_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(wb, fileName)
}
</script>

<style scoped>
@media print {
  .print-academic-document {
    font-family: 'Sarabun', 'TH Sarabun New', 'Angsana New', serif !important;
  }
  table {
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
}
</style>
