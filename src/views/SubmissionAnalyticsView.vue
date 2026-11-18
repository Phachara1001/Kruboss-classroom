<template>
  <div class="space-y-6">
    <!-- Screen View (Interactive Dashboard) - Hidden in Print -->
    <div class="space-y-6 print:hidden">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div class="space-y-1">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <BarChart3 class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-stone-900">พฤติกรรมการส่งงาน (Assignment Submission Dashboard)</h1>
              <p class="text-xs sm:text-sm text-stone-500">
                ติดตาม วินิจฉัย และรายงานพฤติกรรมการส่งงาน ส่งตรงเวลา ล่าช้า และค้างส่ง
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
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

      <!-- Filters Bar -->
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <!-- Course Selector -->
          <div>
            <label class="text-xs font-semibold text-stone-500">รายวิชา</label>
            <select
              v-model="selectedCourseId"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option v-for="c in courses" :key="c.id" :value="c.id">
                {{ c.code }} - {{ c.name || c.title }}
              </option>
            </select>
          </div>

          <!-- Classroom Selector -->
          <div>
            <label class="text-xs font-semibold text-stone-500">ห้องเรียน</label>
            <select
              v-model="selectedClassroom"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">ทุกห้องเรียน</option>
              <option v-for="cls in availableClassrooms" :key="cls" :value="cls">
                {{ cls === 'teacher_room' ? 'อาจารย์ผู้สอน' : cls }}
              </option>
            </select>
          </div>

          <!-- Period / Assignment Filter -->
          <div>
            <label class="text-xs font-semibold text-stone-500">ขอบเขตใบงาน</label>
            <select
              v-model="selectedAssignmentScope"
              class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">ใบงานทั้งหมดในวิชา ({{ currentCourseAssignments.length }} ชิ้น)</option>
              <option v-for="asm in currentCourseAssignments" :key="asm.id" :value="asm.id">
                {{ asm.title }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <!-- Total Submissions Expected -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs text-stone-500 font-medium">งานทั้งหมด</span>
          <div class="text-2xl font-black text-stone-900">{{ metrics.totalExpected }}</div>
          <span class="text-[10px] text-stone-400">ชิ้นงานที่ต้องส่ง</span>
        </div>

        <!-- Submitted -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs text-stone-500 font-medium">ส่งแล้ว</span>
          <div class="text-2xl font-black text-emerald-600">{{ metrics.totalSubmitted }}</div>
          <span class="text-[10px] text-emerald-600 font-semibold">{{ metrics.submissionRate }}% ของทั้งหมด</span>
        </div>

        <!-- On Time -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs text-stone-500 font-medium">ส่งตรงเวลา</span>
          <div class="text-2xl font-black text-teal-600">{{ metrics.totalOnTime }}</div>
          <span class="text-[10px] text-teal-600 font-semibold">{{ metrics.onTimeRate }}% ของที่ส่ง</span>
        </div>

        <!-- Late -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs text-stone-500 font-medium">ส่งล่าช้า</span>
          <div class="text-2xl font-black text-amber-600">{{ metrics.totalLate }}</div>
          <span class="text-[10px] text-amber-600 font-semibold">{{ metrics.lateRate }}% ของที่ส่ง</span>
        </div>

        <!-- Missing -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs text-stone-500 font-medium">ยังไม่ส่ง / ค้าง</span>
          <div class="text-2xl font-black text-rose-600">{{ metrics.totalMissing }}</div>
          <span class="text-[10px] text-rose-500 font-semibold">{{ metrics.missingRate }}% ที่ยังค้าง</span>
        </div>

        <!-- 100% Completed Count -->
        <div class="bg-gradient-to-tr from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-sm space-y-1">
          <span class="text-xs text-amber-100 font-medium">ส่งครบ 100%</span>
          <div class="text-2xl font-black">{{ metrics.allCompletedStudentsCount }}</div>
          <span class="text-[10px] text-amber-100">จากนักศึกษา {{ filteredStudents.length }} คน</span>
        </div>
      </div>

      <!-- Behavior Cohort Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Cohort 1: Perfect Submissions -->
        <div class="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div class="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
            <Award class="w-5 h-5 text-emerald-600" />
            <span>กลุ่มวินัยยอดเยี่ยม (ส่งครบ 100%)</span>
          </div>
          <p class="text-xs text-emerald-900 leading-relaxed">
            มีจำนวน <span class="font-bold text-emerald-700">{{ behavioralCohorts.perfect.length }} คน</span> ส่งงานครบทุกชิ้นงานโดยไม่มีงานค้างส่ง
          </p>
          <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            <span
              v-for="s in behavioralCohorts.perfect"
              :key="s.studentId"
              class="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium"
            >
              {{ s.name.split(' ')[0] }} ({{ s.studentId.slice(-4) }})
            </span>
            <span v-if="behavioralCohorts.perfect.length === 0" class="text-xs text-stone-400 italic">
              ยังไม่มีผู้ส่งครบ 100%
            </span>
          </div>
        </div>

        <!-- Cohort 2: Frequently Late -->
        <div class="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
          <div class="flex items-center space-x-2 text-amber-800 font-bold text-sm">
            <Clock class="w-5 h-5 text-amber-600" />
            <span>กลุ่มมักส่งงานล่าช้า</span>
          </div>
          <p class="text-xs text-amber-900 leading-relaxed">
            มีจำนวน <span class="font-bold text-amber-700">{{ behavioralCohorts.frequentLate.length }} คน</span> ส่งงานหลังจากเลยกำหนดส่ง (Deadline) เกิน 1 ชิ้น
          </p>
          <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            <span
              v-for="s in behavioralCohorts.frequentLate"
              :key="s.studentId"
              class="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium"
            >
              {{ s.name.split(' ')[0] }} (ช้า {{ s.lateCount }})
            </span>
            <span v-if="behavioralCohorts.frequentLate.length === 0" class="text-xs text-stone-400 italic">
              ไม่มีผู้เรียนส่งช้าบ่อย
            </span>
          </div>
        </div>

        <!-- Cohort 3: Critical Pending / At Risk -->
        <div class="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 space-y-3">
          <div class="flex items-center space-x-2 text-rose-800 font-bold text-sm">
            <AlertTriangle class="w-5 h-5 text-rose-600" />
            <span>กลุ่มค้างส่งงานวิกฤต (เสี่ยงตก)</span>
          </div>
          <p class="text-xs text-rose-900 leading-relaxed">
            มีจำนวน <span class="font-bold text-rose-700">{{ behavioralCohorts.criticalMissing.length }} คน</span> ยังไม่ได้ส่งงานเกิน 50% ของจำนวนงานทั้งหมด
          </p>
          <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            <span
              v-for="s in behavioralCohorts.criticalMissing"
              :key="s.studentId"
              class="text-[11px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-medium"
            >
              {{ s.name.split(' ')[0] }} (ค้าง {{ s.missingCount }})
            </span>
            <span v-if="behavioralCohorts.criticalMissing.length === 0" class="text-xs text-stone-400 italic">
              ไม่มีผู้เรียนค้างงานวิกฤต
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart 1: Donut Proportion (Submitted vs Missing) -->
        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-stone-900 text-base flex items-center space-x-2">
              <PieChart class="w-4 h-4 text-amber-600" />
              <span>สัดส่วนการส่งงาน</span>
            </h3>
            <p class="text-xs text-stone-500">เปรียบเทียบงานที่ส่งแล้วกับงานที่ยังค้างส่ง</p>
          </div>

          <div class="flex items-center justify-center py-2 relative">
            <svg viewBox="0 0 36 36" class="w-44 h-44">
              <path
                class="text-rose-200"
                stroke-width="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-emerald-500 transition-all duration-500"
                :stroke-dasharray="`${metrics.submissionRate}, 100`"
                stroke-dashoffset="0"
                stroke-width="3.8"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span class="text-2xl font-black text-stone-800">{{ metrics.submissionRate }}%</span>
              <span class="text-[10px] text-stone-500 font-medium">อัตราการส่งงาน</span>
            </div>
          </div>

          <div class="space-y-2 text-xs pt-2 border-t border-stone-100">
            <div class="flex items-center justify-between">
              <span class="flex items-center space-x-2 text-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>ส่งแล้วทั้งหมด</span>
              </span>
              <span class="font-bold text-stone-800">{{ metrics.totalSubmitted }} งาน ({{ metrics.submissionRate }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center space-x-2 text-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>ยังไม่ส่ง / ค้างส่ง</span>
              </span>
              <span class="font-bold text-stone-800">{{ metrics.totalMissing }} งาน ({{ metrics.missingRate }}%)</span>
            </div>
          </div>
        </div>

        <!-- Chart 2: Weekly On-time vs Late vs Missing -->
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <h3 class="font-bold text-stone-900 text-base flex items-center space-x-2">
                <BarChart2 class="w-4 h-4 text-amber-600" />
                <span>พฤติกรรมการส่งงานแต่ละใบงาน</span>
              </h3>
              <p class="text-xs text-stone-500">จำแนกตาม ตรงเวลา, ล่าช้า และค้างส่ง</p>
            </div>
            <div class="flex items-center space-x-3 text-xs">
              <span class="flex items-center space-x-1.5 text-stone-600">
                <span class="w-3 h-3 rounded-sm bg-teal-500 inline-block"></span>
                <span>ตรงเวลา</span>
              </span>
              <span class="flex items-center space-x-1.5 text-stone-600">
                <span class="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
                <span>ส่งช้า</span>
              </span>
              <span class="flex items-center space-x-1.5 text-stone-600">
                <span class="w-3 h-3 rounded-sm bg-rose-400 inline-block"></span>
                <span>ค้างส่ง</span>
              </span>
            </div>
          </div>

          <!-- Stacked Bar Chart -->
          <div class="pt-4 h-64 flex items-end justify-around border-b border-stone-200 pb-2 px-4 gap-3">
            <div
              v-for="bar in weeklyAssignmentStats"
              :key="bar.id"
              class="flex-1 flex flex-col items-center h-full justify-end max-w-[60px] group relative"
            >
              <!-- Tooltip -->
              <div class="absolute -top-12 bg-stone-900 text-white text-[11px] rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                ตรงเวลา: {{ bar.onTime }} | ช้า: {{ bar.late }} | ค้าง: {{ bar.missing }}
              </div>

              <div class="w-full flex flex-col-reverse rounded overflow-hidden h-48 bg-stone-100">
                <div
                  class="bg-teal-500 transition-all duration-300"
                  :style="{ height: `${bar.onTimePercent}%` }"
                ></div>
                <div
                  class="bg-amber-400 transition-all duration-300"
                  :style="{ height: `${bar.latePercent}%` }"
                ></div>
                <div
                  class="bg-rose-400 transition-all duration-300"
                  :style="{ height: `${bar.missingPercent}%` }"
                ></div>
              </div>

              <span class="text-[11px] font-semibold text-stone-500 mt-2 truncate w-full text-center" :title="bar.title">
                {{ bar.shortTitle }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Classroom Comparison Section -->
      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 class="font-bold text-stone-900 text-base flex items-center space-x-2">
          <Users class="w-4 h-4 text-amber-600" />
          <span>เปรียบเทียบพฤติกรรมการส่งงานระหว่างห้องเรียน</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="cr in classroomComparison"
            :key="cr.name"
            class="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-800 text-sm">{{ cr.name }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-semibold">
                {{ cr.studentCount }} คน
              </span>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-stone-500">อัตราการส่งงานรวม</span>
                <span class="font-bold text-emerald-700">{{ cr.submissionRate }}%</span>
              </div>
              <div class="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${cr.submissionRate}%` }"></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-1 text-center text-[11px]">
              <div class="bg-white p-1.5 rounded-lg border border-stone-200">
                <div class="text-stone-400">ตรงเวลา</div>
                <div class="font-bold text-teal-700">{{ cr.onTime }}</div>
              </div>
              <div class="bg-white p-1.5 rounded-lg border border-stone-200">
                <div class="text-stone-400">ส่งช้า</div>
                <div class="font-bold text-amber-700">{{ cr.late }}</div>
              </div>
              <div class="bg-white p-1.5 rounded-lg border border-stone-200">
                <div class="text-stone-400">ค้างส่ง</div>
                <div class="font-bold text-rose-700">{{ cr.missing }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Student Table Section (Screen Version) -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-stone-900 text-base">
              ตารางรายงานพฤติกรรมการส่งงานรายบุคคล
            </h3>
            <p class="text-xs text-stone-500">
              แสดงสถิติการส่งงาน ส่งตรงเวลา ล่าช้า และค้างส่งของนักศึกษาแต่ละคน
            </p>
          </div>

          <div class="relative w-full sm:w-64">
            <Search class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              v-model="tableSearchQuery"
              type="text"
              placeholder="ค้นหารหัส หรือชื่อ..."
              class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-800 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-stone-50 border-y border-stone-200 text-stone-600 font-bold">
                <th class="py-3 px-3 w-12 text-center">#</th>
                <th class="py-3 px-3">รหัสนักศึกษา</th>
                <th class="py-3 px-3">ชื่อ - นามสกุล</th>
                <th class="py-3 px-3">ห้อง</th>
                <th class="py-3 px-3 text-center">ส่งแล้ว</th>
                <th class="py-3 px-3 text-center">ตรงเวลา</th>
                <th class="py-3 px-3 text-center">ล่าช้า</th>
                <th class="py-3 px-3 text-center">ค้างส่ง</th>
                <th class="py-3 px-3 text-center">% ส่งงาน</th>
                <th class="py-3 px-3 text-center">สถานะพฤติกรรม</th>
                <th class="py-3 px-3 text-center">การกระทำ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr
                v-for="(row, idx) in filteredStudentRows"
                :key="row.studentId"
                class="hover:bg-stone-50/80 transition cursor-pointer"
                @click="openStudentDetail(row)"
              >
                <td class="py-3 px-3 text-center text-stone-400">{{ idx + 1 }}</td>
                <td class="py-3 px-3 font-mono font-bold text-stone-800">{{ row.studentId }}</td>
                <td class="py-3 px-3 font-medium text-stone-900">{{ row.name }}</td>
                <td class="py-3 px-3 text-stone-600">{{ row.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (row.classroom || '-') }}</td>
                <td class="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/40">
                  {{ row.submittedCount }} / {{ row.totalAssignments }}
                </td>
                <td class="py-3 px-3 text-center font-medium text-teal-700">
                  {{ row.onTimeCount }}
                </td>
                <td class="py-3 px-3 text-center font-medium text-amber-700">
                  {{ row.lateCount }}
                </td>
                <td class="py-3 px-3 text-center font-bold text-rose-600 bg-rose-50/40">
                  {{ row.missingCount }}
                </td>
                <td class="py-3 px-3 text-center font-black text-stone-800">
                  {{ row.submissionRate }}%
                </td>
                <td class="py-3 px-3 text-center">
                  <span
                    v-if="row.status === 'perfect'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                    <span>ส่งครบ 100%</span>
                  </span>
                  <span
                    v-else-if="row.status === 'frequentLate'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <Clock class="w-3.5 h-3.5 text-amber-600" />
                    <span>ส่งช้าบ่อย</span>
                  </span>
                  <span
                    v-else-if="row.status === 'critical'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 font-bold text-[11px] shadow-xs"
                  >
                    <AlertTriangle class="w-3.5 h-3.5 text-rose-600" />
                    <span>เสี่ยงค้างงาน</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/80 font-medium text-[11px] shadow-xs"
                  >
                    <Check class="w-3.5 h-3.5 text-stone-500" />
                    <span>ปกติ</span>
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <button
                    @click.stop="openStudentDetail(row)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 rounded-lg transition"
                  >
                    ดูรายละเอียด
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
        <p class="text-xs text-stone-700">ระบบการจัดการเรียนรู้ออนไลน์และติดตามความก้าวหน้าทางการศึกษา (LMS Student Monitoring)</p>
        <h1 class="text-base font-black pt-1">แบบรายงานสรุปและติดตามพฤติกรรมการส่งงานของผู้เรียน</h1>
        <p class="text-[11px] text-stone-600 italic">Official Student Assignment Submission & Learning Discipline Report</p>
      </div>

      <!-- Metadata Box -->
      <div class="border border-black p-3 text-xs leading-relaxed grid grid-cols-2 gap-x-6 gap-y-1.5 bg-stone-50/40">
        <div><span class="font-bold">รหัสและชื่อวิชา:</span> {{ currentCourse.code }} {{ currentCourse.name || currentCourse.title }}</div>
        <div><span class="font-bold">ภาคเรียน/ปีการศึกษา:</span> {{ filterTerm === '2567-2' ? 'ภาคเรียนที่ 2 ปีการศึกษา 2567' : 'ภาคเรียนที่ 1 ปีการศึกษา 2567' }}</div>
        <div><span class="font-bold">กลุ่มเรียน / ห้องเรียน:</span> {{ selectedClassroom === 'all' ? 'ทุกห้องเรียนในรายวิชา' : selectedClassroom }}</div>
        <div>
          <span class="font-bold">ขอบเขตใบงาน:</span> 
          {{ selectedAssignmentScope === 'all' ? `ใบงานทั้งหมด (${currentCourseAssignments.length} ชิ้นงาน)` : (currentCourseAssignments.find(a => a.id === selectedAssignmentScope)?.title || '') }}
        </div>
        <div><span class="font-bold">จำนวนนักศึกษาในรายงาน:</span> {{ filteredStudents.length }} คน</div>
        <div><span class="font-bold">วันที่ออกเอกสารรายงาน:</span> {{ currentDateThai }}</div>
      </div>

      <!-- Formal Statistical Summary Table -->
      <div>
        <h3 class="text-xs font-bold mb-1.5 text-stone-900">สรุปข้อมูลเชิงสถิติภาพรวม (Executive Summary)</h3>
        <table class="w-full text-xs border border-black border-collapse text-center">
          <thead>
            <tr class="bg-stone-200 border-b border-black font-bold">
              <th class="p-1.5 border-r border-black">ภาระงานที่ต้องส่งทั้งหมด</th>
              <th class="p-1.5 border-r border-black">ส่งงานแล้วทั้งหมด</th>
              <th class="p-1.5 border-r border-black">ส่งตรงเวลา</th>
              <th class="p-1.5 border-r border-black">ส่งล่าช้า</th>
              <th class="p-1.5 border-r border-black">ค้างส่งงาน</th>
              <th class="p-1.5">ส่งงานครบ 100%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-1.5 border-r border-black font-bold">{{ metrics.totalExpected }} ชิ้นงาน</td>
              <td class="p-1.5 border-r border-black font-bold">{{ metrics.totalSubmitted }} ({{ metrics.submissionRate }}%)</td>
              <td class="p-1.5 border-r border-black font-bold">{{ metrics.totalOnTime }} ({{ metrics.onTimeRate }}%)</td>
              <td class="p-1.5 border-r border-black font-bold">{{ metrics.totalLate }} ({{ metrics.lateRate }}%)</td>
              <td class="p-1.5 border-r border-black font-bold">{{ metrics.totalMissing }} ({{ metrics.missingRate }}%)</td>
              <td class="p-1.5 font-bold">{{ metrics.allCompletedStudentsCount }} คน</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formal Student Roster Table -->
      <div>
        <h3 class="text-xs font-bold mb-1.5 text-stone-900">ผลการติดตามพฤติกรรมรายบุคคล (Individual Submission Records)</h3>
        <table class="w-full text-[11px] border border-black border-collapse">
          <thead>
            <tr class="bg-stone-200 border-b border-black font-bold text-center">
              <th class="p-1.5 w-8 border-r border-black">ลำดับ</th>
              <th class="p-1.5 w-24 border-r border-black">รหัสนักศึกษา</th>
              <th class="p-1.5 border-r border-black text-left">ชื่อ - นามสกุล</th>
              <th class="p-1.5 w-16 border-r border-black">ห้อง</th>
              <th class="p-1.5 w-16 border-r border-black">มอบหมาย</th>
              <th class="p-1.5 w-16 border-r border-black">ส่งแล้ว</th>
              <th class="p-1.5 w-14 border-r border-black">ตรงเวลา</th>
              <th class="p-1.5 w-14 border-r border-black">ส่งช้า</th>
              <th class="p-1.5 w-14 border-r border-black">ค้างส่ง</th>
              <th class="p-1.5 w-16 border-r border-black">% ส่งงาน</th>
              <th class="p-1.5 w-28">ผลการประเมินพฤติกรรม</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in studentSubmissionStats"
              :key="row.studentId"
              class="border-b border-stone-300"
            >
              <td class="p-1 text-center border-r border-stone-300">{{ idx + 1 }}</td>
              <td class="p-1 text-center font-mono border-r border-stone-300">{{ row.studentId }}</td>
              <td class="p-1 border-r border-stone-300">{{ row.name }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (row.classroom || '-') }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.totalAssignments }}</td>
              <td class="p-1 text-center border-r border-stone-300 font-bold">{{ row.submittedCount }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.onTimeCount }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.lateCount }}</td>
              <td class="p-1 text-center border-r border-stone-300">{{ row.missingCount }}</td>
              <td class="p-1 text-center border-r border-stone-300 font-bold">{{ row.submissionRate }}%</td>
              <td class="p-1 text-center text-[10px] font-medium">
                {{ row.status === 'perfect' ? 'ส่งครบถ้วนสม่ำเสมอ' : (row.status === 'frequentLate' ? 'ส่งงานล่าช้ากว่ากำหนด' : (row.status === 'critical' ? 'มีงานค้างส่งเกินเกณฑ์' : 'ส่งงานปกติ')) }}
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

    <!-- MODAL: Student Detailed Assignments Drilldown (Screen Only) -->
    <Teleport to="body">
      <div
        v-if="showDetailModal && selectedStudent"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto print:hidden"
        @click.self="showDetailModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          <div class="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
            <div>
              <h3 class="font-bold text-base">{{ selectedStudent.name }}</h3>
              <p class="text-xs text-stone-400 font-mono">รหัส {{ selectedStudent.studentId }} • {{ selectedStudent.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : selectedStudent.classroom }}</p>
            </div>
            <button @click="showDetailModal = false" class="text-stone-400 hover:text-white">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            <!-- Student mini stats -->
            <div class="grid grid-cols-4 gap-2 text-center bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <div class="text-[10px] text-stone-400">ส่งแล้ว</div>
                <div class="text-lg font-bold text-emerald-700">{{ selectedStudent.submittedCount }}</div>
              </div>
              <div>
                <div class="text-[10px] text-stone-400">ตรงเวลา</div>
                <div class="text-lg font-bold text-teal-700">{{ selectedStudent.onTimeCount }}</div>
              </div>
              <div>
                <div class="text-[10px] text-stone-400">ล่าช้า</div>
                <div class="text-lg font-bold text-amber-700">{{ selectedStudent.lateCount }}</div>
              </div>
              <div>
                <div class="text-[10px] text-stone-400">ค้างส่ง</div>
                <div class="text-lg font-bold text-rose-700">{{ selectedStudent.missingCount }}</div>
              </div>
            </div>

            <h4 class="font-bold text-stone-800 uppercase tracking-wider text-xs">
              รายการใบงานและสถานะส่งงาน
            </h4>

            <div class="space-y-2">
              <div
                v-for="asm in selectedStudent.assignmentDetails"
                :key="asm.id"
                class="p-3 rounded-xl border border-stone-200 bg-white flex items-center justify-between"
              >
                <div>
                  <div class="font-bold text-stone-800">{{ asm.title }}</div>
                  <div class="text-[11px] text-stone-400">
                    กำหนดส่ง: {{ asm.deadlineText }}
                  </div>
                </div>

                <div class="text-right">
                  <span
                    v-if="asm.status === 'on-time'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold text-[10px]"
                  >
                    <CheckCircle2 class="w-3 h-3 text-teal-600" />
                    <span>ส่งตรงเวลา</span>
                  </span>
                  <span
                    v-else-if="asm.status === 'late'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]"
                  >
                    <Clock class="w-3 h-3 text-amber-600" />
                    <span>ส่งช้า</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]"
                  >
                    <AlertTriangle class="w-3 h-3 text-rose-600" />
                    <span>ยังไม่ส่ง</span>
                  </span>

                  <div v-if="asm.submittedAt" class="text-[10px] text-stone-400 mt-0.5">
                    {{ new Date(asm.submittedAt).toLocaleDateString('th-TH') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-3 bg-stone-50 border-t border-stone-200 text-right">
            <button
              @click="showDetailModal = false"
              class="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
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
import { ref, computed } from 'vue'
import {
  BarChart3, Printer, Download, Award, Clock, AlertTriangle,
  PieChart, BarChart2, Users, Search, X, CheckCircle2, Check
} from '@lucide/vue'
import * as XLSX from 'xlsx'
import { courses } from '@/data/courses'
import { studentsList, isStudent, isStudentInCourse } from '@/data/studentsStore'
import {
  submissionsStore,
  courseAssignments,
  assignmentSettingsStore,
  getAssignmentSetting
} from '@/data/gradesStore'

const filterTerm = ref('2567-2')
const selectedCourseId = ref(courses[0]?.id || '31901-2007')
const selectedClassroom = ref('all')
const selectedAssignmentScope = ref('all')
const tableSearchQuery = ref('')

const currentCourse = computed(() => {
  return courses.find(c => c.id === selectedCourseId.value) || courses[0]
})

const currentCourseAssignments = computed(() => {
  return courseAssignments[selectedCourseId.value] || []
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

const filteredStudents = computed(() => {
  return studentsList.value
    .filter(s => {
      if (!isStudent(s)) return false
      if (!isStudentInCourse(s, selectedCourseId.value)) return false
      if (selectedClassroom.value !== 'all' && s.classroom !== selectedClassroom.value) return false
      return true
    })
    .sort((a, b) => {
      const idA = (a.studentId || a.id || '').toString()
      const idB = (b.studentId || b.id || '').toString()
      return idA.localeCompare(idB, undefined, { numeric: true })
    })
})

// Submission evaluation engine per student
const studentSubmissionStats = computed(() => {
  const courseId = selectedCourseId.value
  let targetAssignments = currentCourseAssignments.value
  if (selectedAssignmentScope.value !== 'all') {
    targetAssignments = targetAssignments.filter(a => a.id === selectedAssignmentScope.value)
  }

  const totalAsmCount = targetAssignments.length

  return filteredStudents.value.map(s => {
    const sId = s.studentId || s.id
    let submittedCount = 0
    let onTimeCount = 0
    let lateCount = 0
    let missingCount = 0
    const assignmentDetails = []

    targetAssignments.forEach(asm => {
      const subKey = `${courseId}_${sId}_${asm.id}`
      const submission = submissionsStore.value[subKey]
      const settings = getAssignmentSetting(courseId, asm.id)

      const deadline = settings?.deadline ? new Date(settings.deadline) : null
      const submittedAt = submission?.submittedAt ? new Date(submission.submittedAt) : null

      let status = 'missing'
      if (submission && submission.link) {
        submittedCount++
        if (deadline && submittedAt && submittedAt > deadline) {
          status = 'late'
          lateCount++
        } else {
          status = 'on-time'
          onTimeCount++
        }
      } else {
        missingCount++
      }

      assignmentDetails.push({
        id: asm.id,
        title: asm.title,
        deadlineText: deadline ? deadline.toLocaleDateString('th-TH') : 'ไม่กำหนด',
        submittedAt: submission?.submittedAt || null,
        status,
        link: submission?.link || null
      })
    })

    const submissionRate = totalAsmCount > 0 ? Math.round((submittedCount / totalAsmCount) * 100) : 0

    let status = 'normal'
    if (submissionRate === 100 && totalAsmCount > 0) {
      status = 'perfect'
    } else if (lateCount >= 2) {
      status = 'frequentLate'
    } else if (missingCount > totalAsmCount / 2 && totalAsmCount > 0) {
      status = 'critical'
    }

    return {
      studentId: sId,
      name: s.name,
      classroom: s.classroom,
      totalAssignments: totalAsmCount,
      submittedCount,
      onTimeCount,
      lateCount,
      missingCount,
      submissionRate,
      status,
      assignmentDetails
    }
  })
})

// Overall Metrics
const metrics = computed(() => {
  const stats = studentSubmissionStats.value
  const totalStudents = stats.length
  let totalAssignments = currentCourseAssignments.value.length
  if (selectedAssignmentScope.value !== 'all') totalAssignments = 1

  const totalExpected = totalStudents * totalAssignments

  let totalSubmitted = 0
  let totalOnTime = 0
  let totalLate = 0
  let totalMissing = 0
  let allCompletedStudentsCount = 0

  stats.forEach(s => {
    totalSubmitted += s.submittedCount
    totalOnTime += s.onTimeCount
    totalLate += s.lateCount
    totalMissing += s.missingCount
    if (s.submissionRate === 100 && totalAssignments > 0) {
      allCompletedStudentsCount++
    }
  })

  const submissionRate = totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0
  const onTimeRate = totalSubmitted > 0 ? Math.round((totalOnTime / totalSubmitted) * 100) : 0
  const lateRate = totalSubmitted > 0 ? Math.round((totalLate / totalSubmitted) * 100) : 0
  const missingRate = totalExpected > 0 ? Math.round((totalMissing / totalExpected) * 100) : 0

  return {
    totalExpected,
    totalSubmitted,
    totalOnTime,
    totalLate,
    totalMissing,
    submissionRate,
    onTimeRate,
    lateRate,
    missingRate,
    allCompletedStudentsCount
  }
})

// Behavioral Cohorts
const behavioralCohorts = computed(() => {
  const list = studentSubmissionStats.value
  return {
    perfect: list.filter(s => s.status === 'perfect'),
    frequentLate: list.filter(s => s.status === 'frequentLate'),
    criticalMissing: list.filter(s => s.status === 'critical')
  }
})

// Weekly Assignment Stats for Stacked Bar Chart
const weeklyAssignmentStats = computed(() => {
  const courseId = selectedCourseId.value
  const assignments = currentCourseAssignments.value
  const students = filteredStudents.value
  const totalStudents = students.length

  return assignments.map(asm => {
    let onTime = 0
    let late = 0
    let missing = 0

    students.forEach(s => {
      const sId = s.studentId || s.id
      const subKey = `${courseId}_${sId}_${asm.id}`
      const submission = submissionsStore.value[subKey]
      const settings = getAssignmentSetting(courseId, asm.id)
      const deadline = settings?.deadline ? new Date(settings.deadline) : null
      const submittedAt = submission?.submittedAt ? new Date(submission.submittedAt) : null

      if (submission && submission.link) {
        if (deadline && submittedAt && submittedAt > deadline) {
          late++
        } else {
          onTime++
        }
      } else {
        missing++
      }
    })

    const onTimePercent = totalStudents > 0 ? (onTime / totalStudents) * 100 : 0
    const latePercent = totalStudents > 0 ? (late / totalStudents) * 100 : 0
    const missingPercent = totalStudents > 0 ? (missing / totalStudents) * 100 : 0

    return {
      id: asm.id,
      title: asm.title,
      shortTitle: `W${asm.week || asm.id.replace('asm-', '')}`,
      onTime,
      late,
      missing,
      onTimePercent,
      latePercent,
      missingPercent
    }
  })
})

// Classroom Comparison
const classroomComparison = computed(() => {
  const classrooms = availableClassrooms.value
  const courseId = selectedCourseId.value
  const assignments = currentCourseAssignments.value

  return classrooms.map(cr => {
    const studentsInCr = studentsList.value.filter(s =>
      isStudent(s) &&
      isStudentInCourse(s, courseId) &&
      s.classroom === cr
    )

    const expected = studentsInCr.length * assignments.length
    let submitted = 0
    let onTime = 0
    let late = 0
    let missing = 0

    studentsInCr.forEach(s => {
      const sId = s.studentId || s.id
      assignments.forEach(asm => {
        const subKey = `${courseId}_${sId}_${asm.id}`
        const submission = submissionsStore.value[subKey]
        const settings = getAssignmentSetting(courseId, asm.id)
        const deadline = settings?.deadline ? new Date(settings.deadline) : null
        const submittedAt = submission?.submittedAt ? new Date(submission.submittedAt) : null

        if (submission && submission.link) {
          submitted++
          if (deadline && submittedAt && submittedAt > deadline) {
            late++
          } else {
            onTime++
          }
        } else {
          missing++
        }
      })
    })

    const rate = expected > 0 ? Math.round((submitted / expected) * 100) : 0

    return {
      name: cr,
      studentCount: studentsInCr.length,
      submissionRate: rate,
      onTime,
      late,
      missing
    }
  })
})

// Filtered student rows
const filteredStudentRows = computed(() => {
  let list = studentSubmissionStats.value
  if (tableSearchQuery.value.trim()) {
    const q = tableSearchQuery.value.trim().toLowerCase()
    list = list.filter(s =>
      s.studentId.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
    )
  }
  return list
})

// Modal Drilldown
const showDetailModal = ref(false)
const selectedStudent = ref(null)

const openStudentDetail = (row) => {
  selectedStudent.value = row
  showDetailModal.value = true
}

// Print / PDF
const printReport = () => {
  window.print()
}

// Export to Excel (.xlsx)
const exportExcelReport = () => {
  const data = filteredStudentRows.value.map((s, index) => ({
    'ลำดับ': index + 1,
    'รหัสนักศึกษา': s.studentId,
    'ชื่อ - นามสกุล': s.name,
    'ห้องเรียน': s.classroom === 'teacher_room' ? 'อาจารย์ผู้สอน' : (s.classroom || '-'),
    'งานทั้งหมด': s.totalAssignments,
    'ส่งแล้ว': s.submittedCount,
    'ส่งตรงเวลา': s.onTimeCount,
    'ส่งล่าช้า': s.lateCount,
    'ค้างส่ง': s.missingCount,
    'อัตราการส่ง (%)': s.submissionRate,
    'สถานะพฤติกรรม': s.status === 'perfect' ? 'ส่งครบถ้วนสม่ำเสมอ' : (s.status === 'frequentLate' ? 'ส่งงานล่าช้ากว่ากำหนด' : (s.status === 'critical' ? 'มีงานค้างส่งเกินเกณฑ์' : 'ส่งงานปกติ'))
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'รายงานการส่งงาน')

  const fileName = `รายงานพฤติกรรมการส่งงาน_${selectedCourseId.value}_${new Date().toISOString().slice(0, 10)}.xlsx`
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
