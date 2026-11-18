<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <div class="space-y-1">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ClipboardList class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-stone-900">จัดการใบงานรายสัปดาห์ (Assignments Management)</h1>
            <p class="text-xs sm:text-sm text-stone-500">
              กำหนดหัวข้อใบงาน รูปแบบการส่งงาน (เดี่ยว/คู่/กลุ่ม) การสุ่มจับคู่หรือจัดกลุ่ม และกำหนดส่งในแต่ละสัปดาห์
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="refreshData"
          class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 border border-stone-300"
        >
          <RotateCw class="w-4 h-4 text-stone-600" />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <!-- Course Selector -->
        <div>
          <label class="text-xs font-semibold text-stone-500">เลือกรายวิชา</label>
          <select
            v-model="selectedCourseId"
            class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option v-for="c in courses" :key="c.id" :value="c.id">
              {{ c.code }} - {{ c.name || c.title }}
            </option>
          </select>
        </div>

        <!-- Classroom Selector -->
        <div>
          <label class="text-xs font-semibold text-stone-500">ห้องเรียนเป้าหมาย (สำหรับดูการจัดกลุ่ม)</label>
          <select
            v-model="selectedClassroom"
            class="mt-1 w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">ทุกห้องเรียนในรายวิชา</option>
            <option v-for="cls in availableClassrooms" :key="cls" :value="cls">
              {{ cls === 'teacher_room' ? 'อาจารย์ผู้สอน' : 'ห้อง ' + cls }}
            </option>
          </select>
        </div>

        <!-- Search Input -->
        <div>
          <label class="text-xs font-semibold text-stone-500">ค้นหาใบงาน</label>
          <div class="relative mt-1">
            <Search class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาชื่อใบงาน หรือสัปดาห์..."
              class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-800 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Summary KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
        <span class="text-xs text-stone-500 font-medium">ใบงานทั้งหมด</span>
        <div class="text-2xl font-black text-stone-900">{{ currentAssignmentsList.length }}</div>
        <span class="text-[10px] text-stone-400">ชิ้นงานในหลักสูตร</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
        <span class="text-xs text-stone-500 font-medium">งานเดี่ยว</span>
        <div class="text-2xl font-black text-emerald-600">{{ individualCount }}</div>
        <span class="text-[10px] text-emerald-600 font-semibold">ส่งรายบุคคล</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
        <span class="text-xs text-stone-500 font-medium">งานคู่</span>
        <div class="text-2xl font-black text-blue-600">{{ pairCount }}</div>
        <span class="text-[10px] text-blue-600 font-semibold">จับคู่ส่งร่วมกัน</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
        <span class="text-xs text-stone-500 font-medium">งานกลุ่ม</span>
        <div class="text-2xl font-black text-purple-600">{{ groupCount }}</div>
        <span class="text-[10px] text-purple-600 font-semibold">ส่งเป็นทีม</span>
      </div>
    </div>

    <!-- Assignments List -->
    <div class="space-y-4">
      <div v-if="filteredAssignments.length === 0" class="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
        <FileText class="w-12 h-12 text-stone-300 mx-auto" />
        <h3 class="text-lg font-bold text-stone-700">ไม่พบใบงานตามเงื่อนไข</h3>
        <p class="text-sm text-stone-500 max-w-md mx-auto">
          ยังไม่มีข้อมูลใบงานสำหรับเงื่อนไขการค้นหานี้
        </p>
      </div>

      <div
        v-for="asm in filteredAssignments"
        :key="asm.id"
        class="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
      >
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <!-- Left: Assignment Title & Unit -->
          <div class="flex items-start space-x-3.5 flex-1">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-2xs">
              น.{{ asm.week }}
            </div>

            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
                  หน่วยการเรียนรู้ที่ {{ asm.week }}
                </span>

                <!-- Format Badge -->
                <span
                  class="text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1"
                  :class="getFormatBadgeClass(asm.formatSummary.type)"
                >
                  <Users class="w-3.5 h-3.5" />
                  <span>{{ asm.formatSummary.label }}</span>
                </span>

                <!-- Open Status -->
                <span
                  v-if="asm.topicIsOpen"
                  class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"
                >
                  เปิดให้เรียน
                </span>
                <span
                  v-else
                  class="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200"
                >
                  ยังไม่เปิด
                </span>
              </div>

              <!-- Main Assignment Title -->
              <h3 class="text-base sm:text-lg font-black text-stone-900 leading-snug">
                {{ asm.title }}
              </h3>

              <!-- Description / Instructions -->
              <p class="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                {{ asm.displayDescription }}
              </p>

              <!-- Meta info badges -->
              <div class="flex items-center gap-3 pt-1 text-xs text-stone-500 flex-wrap">
                <span class="flex items-center gap-1 text-stone-600 font-semibold">
                  <Award class="w-3.5 h-3.5 text-amber-600" />
                  <span>คะแนนเต็ม: {{ asm.maxScore }} คะแนน</span>
                </span>
                <span class="text-stone-300">•</span>
                <span class="flex items-center gap-1 text-stone-600 font-semibold">
                  <Clock class="w-3.5 h-3.5 text-purple-600" />
                  <span>กำหนดส่ง: {{ asm.deadlineText }}</span>
                </span>
                <span class="text-stone-300">•</span>
                <span class="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 class="w-3.5 h-3.5" />
                  <span>ส่งแล้ว {{ asm.submissionStats.submitted }} / {{ asm.submissionStats.totalExpected }} คน</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2 shrink-0 self-end md:self-start">
            <button
              v-if="asm.formatSummary.type !== 'individual'"
              type="button"
              @click="openRosterView(asm)"
              class="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Users class="w-3.5 h-3.5" />
              <span>ดูสมาชิกคู่/กลุ่ม</span>
            </button>

            <button
              type="button"
              @click="openSettingsModal(asm)"
              class="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Settings2 class="w-3.5 h-3.5 text-emerald-400" />
              <span>ตั้งค่าใบงาน & รูปแบบ</span>
            </button>
          </div>
        </div>

        <!-- Roster Drawer Preview if active for this assignment -->
        <div
          v-if="activeRosterAsmId === asm.id"
          class="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 animate-in fade-in duration-200 space-y-3"
        >
          <div class="flex items-center justify-between pb-2 border-b border-purple-200">
            <div class="flex items-center gap-2">
              <Users class="w-4 h-4 text-purple-700" />
              <span class="font-black text-purple-950 text-xs sm:text-sm">
                รายชื่อสมาชิกที่จัดกลุ่มไว้ ({{ asm.displayTitle }})
              </span>
            </div>
            <button
              @click="activeRosterAsmId = null"
              class="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
            >
              ปิดรายชื่อ
            </button>
          </div>

          <!-- Pairs list -->
          <div v-if="asm.formatSummary.type === 'pair'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <div
              v-for="p in asm.pairsList"
              :key="p.pairIndex"
              class="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs text-xs space-y-1.5"
            >
              <div class="flex items-center justify-between font-black text-blue-950">
                <span>{{ p.pairName }}</span>
                <span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                  {{ p.members.length }} คน
                </span>
              </div>
              <div class="space-y-1">
                <div v-for="m in p.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                  <span>{{ m.name }}</span>
                  <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Groups list -->
          <div v-else-if="asm.formatSummary.type === 'group'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <div
              v-for="g in asm.groupsList"
              :key="g.groupIndex"
              class="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs text-xs space-y-1.5"
            >
              <div class="flex items-center justify-between font-black text-purple-950">
                <span>{{ g.groupName }}</span>
                <span class="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                  {{ g.members.length }} คน
                </span>
              </div>
              <div class="space-y-1">
                <div v-for="m in g.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex items-center justify-between">
                  <span>{{ m.name }}</span>
                  <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⚙️ Assignment Settings & Format Modal -->
    <Teleport to="body">
      <div
        v-if="showModal && editingAsm"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-xs overflow-y-auto"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">
                <Settings2 class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-base sm:text-lg text-white">ตั้งค่าใบงาน & รูปแบบการส่งงาน</h3>
                <p class="text-xs text-stone-400">หน่วยการเรียนรู้ที่ {{ editingAsm.week }} • {{ currentCourse.name }}</p>
              </div>
            </div>
            <button @click="showModal = false" class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
            <!-- Assignment Title Info -->
            <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
              <ClipboardList class="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <span class="text-xs font-semibold text-purple-800">หัวข้อใบงาน:</span>
                <p class="text-sm font-black text-purple-950 leading-snug">{{ editingAsm.title }}</p>
              </div>
            </div>

            <!-- Custom Description / Instructions -->
            <div class="space-y-1.5">
              <label class="font-bold text-stone-800">คำสั่งและการมอบหมายงาน (Description)</label>
              <textarea
                v-model="modalForm.customDescription"
                rows="3"
                placeholder="ระบุข้อกำหนดเพิ่มเติม ลิงก์เอกสาร หรือเงื่อนไขการส่งงาน..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed text-xs sm:text-sm"
              ></textarea>
            </div>

            <!-- Deadline & Max Score -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="font-bold text-stone-800">กำหนดส่งงาน (Deadline)</label>
                <input
                  v-model="modalForm.deadline"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 font-medium focus:ring-2 focus:ring-purple-500 outline-none text-xs"
                />
              </div>

              <div class="space-y-1.5">
                <label class="font-bold text-stone-800">คะแนนเต็ม (Max Score)</label>
                <input
                  v-model.number="modalForm.maxScore"
                  type="number"
                  min="1"
                  max="100"
                  class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 font-bold focus:ring-2 focus:ring-purple-500 outline-none text-xs"
                />
              </div>
            </div>

            <!-- Work Type Selection (เดี่ยว / คู่ / กลุ่ม) -->
            <div class="space-y-2 pt-2 border-t border-stone-100">
              <label class="font-bold text-stone-800">เลือกประเภทรูปแบบการส่งงาน</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  @click="modalForm.workType = 'individual'"
                  class="p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                  :class="modalForm.workType === 'individual' ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-400/30' : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'"
                >
                  <User class="w-5 h-5 text-emerald-600" />
                  <span class="font-bold text-xs">งานเดี่ยว</span>
                  <span class="text-[10px] text-stone-400">ส่งแยกคนละ 1 ชิ้น</span>
                </button>

                <button
                  type="button"
                  @click="modalForm.workType = 'pair'"
                  class="p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                  :class="modalForm.workType === 'pair' ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-400/30' : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'"
                >
                  <Users class="w-5 h-5 text-blue-600" />
                  <span class="font-bold text-xs">งานคู่</span>
                  <span class="text-[10px] text-stone-400">คู่ละ 2 คน (เศษ 3)</span>
                </button>

                <button
                  type="button"
                  @click="modalForm.workType = 'group'"
                  class="p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                  :class="modalForm.workType === 'group' ? 'border-purple-500 bg-purple-50/70 text-purple-900 ring-2 ring-purple-400/30' : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'"
                >
                  <Users class="w-5 h-5 text-purple-600" />
                  <span class="font-bold text-xs">งานกลุ่ม</span>
                  <span class="text-[10px] text-stone-400">กลุ่มละหลายคน</span>
                </button>
              </div>
            </div>

            <!-- Pair Options (เมื่อเลือกงานคู่) -->
            <div v-if="modalForm.workType === 'pair'" class="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-150">
              <div class="font-bold text-blue-950 flex items-center gap-2">
                <Users class="w-4 h-4 text-blue-600" />
                <span>ตัวเลือกการจับคู่ (งานคู่)</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="modalForm.pairingMode === 'manual' ? 'border-blue-500 ring-2 ring-blue-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input type="radio" v-model="modalForm.pairingMode" value="manual" class="mt-1 text-blue-600" />
                  <div>
                    <div class="font-bold text-stone-900">ให้นักศึกษาเลือกคู่เอง</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">นักศึกษาค้นหาและจับคู่กับเพื่อนในระบบตอนส่งงาน</div>
                  </div>
                </label>

                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="modalForm.pairingMode === 'auto' ? 'border-blue-500 ring-2 ring-blue-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input type="radio" v-model="modalForm.pairingMode" value="auto" @change="rollModalPairs" class="mt-1 text-blue-600" />
                  <div>
                    <div class="font-bold text-stone-900">ระบบสุ่มจับคู่อัตโนมัติ</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">แบ่งคู่ละ 2 คน หากเศษคนสุดท้ายจะมี 1 คู่ที่มี 3 คน</div>
                  </div>
                </label>
              </div>

              <!-- Auto Randomized Pairs Preview -->
              <div v-if="modalForm.pairingMode === 'auto'" class="space-y-2.5 pt-2 border-t border-blue-100">
                <div class="flex items-center justify-between">
                  <span class="font-black text-blue-900 text-xs">
                    รายชื่อคู่ที่สุ่มได้ ({{ modalForm.randomizedPairs.length }} คู่):
                  </span>
                  <button
                    type="button"
                    @click="rollModalPairs"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    <Shuffle class="w-3.5 h-3.5" />
                    <span>สุ่มจับคู่ใหม่</span>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  <div
                    v-for="p in modalForm.randomizedPairs"
                    :key="p.pairIndex"
                    class="p-2.5 rounded-xl border bg-white border-blue-200/80 shadow-2xs text-xs space-y-1"
                  >
                    <div class="flex items-center justify-between font-black text-blue-950">
                      <span>{{ p.pairName }}</span>
                      <span class="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 rounded">{{ p.members.length }} คน</span>
                    </div>
                    <div v-for="m in p.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex justify-between">
                      <span>{{ m.name }}</span>
                      <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Group Options (เมื่อเลือกงานกลุ่ม) -->
            <div v-if="modalForm.workType === 'group'" class="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in duration-150">
              <div class="flex items-center justify-between">
                <div class="font-bold text-purple-950 flex items-center gap-2">
                  <Users class="w-4 h-4 text-purple-600" />
                  <span>ตัวเลือกการจัดกลุ่ม (งานกลุ่ม)</span>
                </div>

                <div v-if="modalForm.groupingMode === 'auto'" class="flex items-center gap-2">
                  <label class="text-xs font-bold text-purple-900">จำนวนกลุ่ม:</label>
                  <input
                    v-model.number="modalForm.groupCount"
                    @change="rollModalGroups"
                    type="number"
                    min="2"
                    max="15"
                    class="w-16 px-2 py-1 text-center font-bold bg-white rounded-lg border border-purple-300 text-xs"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="modalForm.groupingMode === 'manual' ? 'border-purple-500 ring-2 ring-purple-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input type="radio" v-model="modalForm.groupingMode" value="manual" class="mt-1 text-purple-600" />
                  <div>
                    <div class="font-bold text-stone-900">ให้นักศึกษาเลือกกลุ่มเอง</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">นักศึกษาค้นหาและเข้าร่วมกลุ่มเองในระบบ</div>
                  </div>
                </label>

                <label
                  class="p-3 bg-white rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  :class="modalForm.groupingMode === 'auto' ? 'border-purple-500 ring-2 ring-purple-400/30' : 'border-stone-200 hover:border-stone-300'"
                >
                  <input type="radio" v-model="modalForm.groupingMode" value="auto" @change="rollModalGroups" class="mt-1 text-purple-600" />
                  <div>
                    <div class="font-bold text-stone-900">ระบบสุ่มจัดกลุ่มให้อัตโนมัติ</div>
                    <div class="text-[11px] text-stone-500 mt-0.5">เกลี่ยคนลง {{ modalForm.groupCount }} กลุ่มให้เท่ากันที่สุด</div>
                  </div>
                </label>
              </div>

              <!-- Auto Randomized Groups Preview -->
              <div v-if="modalForm.groupingMode === 'auto'" class="space-y-2.5 pt-2 border-t border-purple-100">
                <div class="flex items-center justify-between">
                  <span class="font-black text-purple-900 text-xs">
                    รายชื่อสมาชิกใน {{ modalForm.randomizedGroups.length }} กลุ่ม:
                  </span>
                  <button
                    type="button"
                    @click="rollModalGroups"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    <Shuffle class="w-3.5 h-3.5" />
                    <span>สุ่มจัดกลุ่มใหม่</span>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  <div
                    v-for="g in modalForm.randomizedGroups"
                    :key="g.groupIndex"
                    class="p-2.5 rounded-xl border bg-white border-purple-200/80 shadow-2xs text-xs space-y-1"
                  >
                    <div class="flex items-center justify-between font-black text-purple-950">
                      <span>{{ g.groupName }}</span>
                      <span class="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 rounded">{{ g.members.length }} คน</span>
                    </div>
                    <div v-for="m in g.members" :key="m.studentId" class="text-stone-700 font-medium truncate flex justify-between">
                      <span>{{ m.name }}</span>
                      <span class="text-stone-400 font-mono text-[10px]">{{ m.studentId }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200 font-bold text-xs cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="saveModalSettings"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Save class="w-4 h-4" />
              <span>บันทึกการตั้งค่าใบงาน</span>
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
  ClipboardList, Search, Settings2, Users, User, Award, Clock,
  CheckCircle2, FileText, Shuffle, Save, X, RotateCw
} from '@lucide/vue'
import { courses } from '@/data/courses'
import { studentsList, isStudent, isStudentInCourse } from '@/data/studentsStore'
import {
  courseAssignments,
  submissionsStore,
  assignmentSettingsStore,
  setAssignmentSetting,
  getAssignmentSetting
} from '@/data/gradesStore'

const selectedCourseId = ref(courses[0]?.id || '31901-2007')
const selectedClassroom = ref('all')
const searchQuery = ref('')

const currentCourse = computed(() => {
  return courses.find(c => c.id === selectedCourseId.value) || courses[0]
})

const availableClassrooms = computed(() => {
  const rooms = new Set()
  studentsList.value.forEach(s => {
    if (isStudent(s) && isStudentInCourse(s, selectedCourseId.value) && s.classroom && s.classroom !== 'teacher_room') {
      rooms.add(s.classroom)
    }
  })
  return Array.from(rooms).sort()
})

const currentAssignmentsList = computed(() => {
  const asms = courseAssignments[selectedCourseId.value] || []
  const topics = currentCourse.value?.topics || []

  return asms.map(asm => {
    const topic = topics.find(t => t.weekNumber === asm.week)
    const settingKey = `${selectedCourseId.value}_${asm.id}`
    const setting = assignmentSettingsStore.value?.[settingKey] || {}

    const displayDescription = setting.customDescription?.trim() || topic?.desc || topic?.description || 'ส่งเอกสารรายงานและผลการปฏิบัติการประจำหน่วยการเรียนรู้นี้'
    const deadline = setting.deadline || null
    const deadlineText = deadline ? new Date(deadline).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : 'ยังไม่ระบุ'
    const maxScore = Number(setting.maxScore) || asm.maxScore || 10

    // Format info
    const workType = setting.workType || 'individual'
    const pairingMode = setting.pairingMode || 'manual'
    const groupingMode = setting.groupingMode || 'manual'
    const groupCount = Number(setting.groupCount) || 3
    const pairsList = setting.randomizedPairs || []
    const groupsList = setting.randomizedGroups || []

    let formatSummary = { type: 'individual', label: 'งานเดี่ยว' }
    if (workType === 'pair') {
      formatSummary = {
        type: 'pair',
        label: pairingMode === 'auto' ? 'งานคู่ (สุ่ม)' : 'งานคู่ (เลือกเอง)'
      }
    } else if (workType === 'group') {
      formatSummary = {
        type: 'group',
        label: groupingMode === 'auto' ? `งานกลุ่ม (สุ่ม ${groupsList.length || groupCount} กลุ่ม)` : 'งานกลุ่ม (เลือกเอง)'
      }
    }

    // Submission stats
    const courseStudents = studentsList.value.filter(s =>
      isStudent(s) &&
      isStudentInCourse(s, selectedCourseId.value) &&
      (selectedClassroom.value === 'all' || s.classroom === selectedClassroom.value)
    )
    let submittedCount = 0
    courseStudents.forEach(s => {
      const sId = s.studentId || s.id
      const subKey = `${selectedCourseId.value}_${sId}_${asm.id}`
      if (submissionsStore.value[subKey]?.fileUrl) submittedCount++
    })

    return {
      ...asm,
      displayDescription,
      deadline,
      deadlineText,
      maxScore,
      workType,
      pairingMode,
      groupingMode,
      groupCount,
      pairsList,
      groupsList,
      formatSummary,
      topicIsOpen: topic?.isOpen !== false && topic?.status !== 'ยังไม่เริ่ม',
      submissionStats: {
        submitted: submittedCount,
        totalExpected: courseStudents.length
      }
    }
  })
})

const filteredAssignments = computed(() => {
  let list = currentAssignmentsList.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(a =>
      a.displayTitle.toLowerCase().includes(q) ||
      a.originalTitle.toLowerCase().includes(q) ||
      `หน่วยที่ ${a.week}`.includes(q)
    )
  }
  return list
})

const individualCount = computed(() => currentAssignmentsList.value.filter(a => a.formatSummary.type === 'individual').length)
const pairCount = computed(() => currentAssignmentsList.value.filter(a => a.formatSummary.type === 'pair').length)
const groupCount = computed(() => currentAssignmentsList.value.filter(a => a.formatSummary.type === 'group').length)

const getFormatBadgeClass = (type) => {
  if (type === 'pair') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (type === 'group') return 'bg-purple-50 text-purple-700 border-purple-200'
  return 'bg-emerald-50 text-emerald-700 border-emerald-200'
}

// Roster Drawer
const activeRosterAsmId = ref(null)
const openRosterView = (asm) => {
  if (activeRosterAsmId.value === asm.id) {
    activeRosterAsmId.value = null
  } else {
    activeRosterAsmId.value = asm.id
  }
}

// Modal State
const showModal = ref(false)
const editingAsm = ref(null)
const modalForm = ref({
  customDescription: '',
  deadline: '',
  maxScore: 10,
  workType: 'individual',
  pairingMode: 'manual',
  groupingMode: 'manual',
  groupCount: 3,
  randomizedPairs: [],
  randomizedGroups: []
})

const getEligibleStudents = () => {
  return studentsList.value.filter(s => {
    if (!isStudent(s) || !isStudentInCourse(s, selectedCourseId.value)) return false
    if (selectedClassroom.value !== 'all' && s.classroom !== selectedClassroom.value) return false
    return true
  })
}

function generateRandomPairs(students) {
  const shuffled = [...students].sort(() => Math.random() - 0.5)
  const pairs = []
  let pairIdx = 1

  for (let i = 0; i < shuffled.length; i += 2) {
    if (i === shuffled.length - 3) {
      pairs.push({
        pairIndex: pairIdx,
        pairName: `คู่ที่ ${pairIdx} (3 คน)`,
        members: [
          { studentId: shuffled[i].studentId || shuffled[i].id, name: shuffled[i].name },
          { studentId: shuffled[i + 1].studentId || shuffled[i + 1].id, name: shuffled[i + 1].name },
          { studentId: shuffled[i + 2].studentId || shuffled[i + 2].id, name: shuffled[i + 2].name }
        ]
      })
      break
    } else if (i === shuffled.length - 1) {
      if (pairs.length > 0) {
        pairs[pairs.length - 1].members.push({
          studentId: shuffled[i].studentId || shuffled[i].id,
          name: shuffled[i].name
        })
        pairs[pairs.length - 1].pairName += ' (3 คน)'
      } else {
        pairs.push({
          pairIndex: pairIdx,
          pairName: `คู่ที่ ${pairIdx}`,
          members: [{ studentId: shuffled[i].studentId || shuffled[i].id, name: shuffled[i].name }]
        })
      }
      break
    } else {
      pairs.push({
        pairIndex: pairIdx,
        pairName: `คู่ที่ ${pairIdx}`,
        members: [
          { studentId: shuffled[i].studentId || shuffled[i].id, name: shuffled[i].name },
          { studentId: shuffled[i + 1].studentId || shuffled[i + 1].id, name: shuffled[i + 1].name }
        ]
      })
      pairIdx++
    }
  }
  return pairs
}

function generateRandomGroups(students, count) {
  const k = Math.max(2, Number(count) || 2)
  const shuffled = [...students].sort(() => Math.random() - 0.5)
  const groups = Array.from({ length: k }, (_, idx) => ({
    groupIndex: idx + 1,
    groupName: `กลุ่มที่ ${idx + 1}`,
    members: []
  }))

  shuffled.forEach((s, idx) => {
    const targetGroup = groups[idx % k]
    targetGroup.members.push({
      studentId: s.studentId || s.id,
      name: s.name
    })
  })
  return groups.filter(g => g.members.length > 0)
}

const rollModalPairs = () => {
  modalForm.value.randomizedPairs = generateRandomPairs(getEligibleStudents())
}

const rollModalGroups = () => {
  modalForm.value.randomizedGroups = generateRandomGroups(getEligibleStudents(), modalForm.value.groupCount)
}

const openSettingsModal = (asm) => {
  editingAsm.value = asm
  const settingKey = `${selectedCourseId.value}_${asm.id}`
  const existing = assignmentSettingsStore.value?.[settingKey] || {}

  modalForm.value = {
    customDescription: existing.customDescription || asm.displayDescription,
    deadline: existing.deadline || '',
    maxScore: Number(existing.maxScore) || asm.maxScore || 10,
    workType: existing.workType || 'individual',
    pairingMode: existing.pairingMode || 'manual',
    groupingMode: existing.groupingMode || 'manual',
    groupCount: Number(existing.groupCount) || 3,
    randomizedPairs: existing.randomizedPairs ? [...existing.randomizedPairs] : [],
    randomizedGroups: existing.randomizedGroups ? [...existing.randomizedGroups] : []
  }

  if (modalForm.value.workType === 'pair' && modalForm.value.pairingMode === 'auto' && modalForm.value.randomizedPairs.length === 0) {
    rollModalPairs()
  }
  if (modalForm.value.workType === 'group' && modalForm.value.groupingMode === 'auto' && modalForm.value.randomizedGroups.length === 0) {
    rollModalGroups()
  }

  showModal.value = true
}

const saveModalSettings = () => {
  if (!editingAsm.value) return

  setAssignmentSetting(selectedCourseId.value, editingAsm.value.id, {
    customDescription: modalForm.value.customDescription.trim(),
    deadline: modalForm.value.deadline,
    maxScore: modalForm.value.maxScore,
    workType: modalForm.value.workType,
    pairingMode: modalForm.value.pairingMode,
    groupingMode: modalForm.value.groupingMode,
    groupCount: modalForm.value.groupCount,
    randomizedPairs: modalForm.value.randomizedPairs,
    randomizedGroups: modalForm.value.randomizedGroups
  })

  showModal.value = false
}

const refreshData = () => {
  // Trigger reactivity
  selectedCourseId.value = selectedCourseId.value + ''
}
</script>
