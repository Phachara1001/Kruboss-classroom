<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  Code2,
  Terminal,
  Play,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Layers,
  SlidersHorizontal
} from '@lucide/vue'

import TinkercadPushButton from '@/components/iot/TinkercadPushButton.vue'
import TinkercadLed from '@/components/iot/TinkercadLed.vue'
import TinkercadBuzzer from '@/components/iot/TinkercadBuzzer.vue'

// Mission Tabs
const missions = [
  {
    id: 'while-btn',
    tabLabel: 'Workshop 1: While Loop (ปุ่มกด + LED)',
    badge: 'ฝึกเขียน While Loop',
    title: 'เติมคำสั่ง While Loop ให้ไฟแดงกะพริบตราบใดที่ยังกดปุ่มค้าง',
    goal: 'เมื่อกดปุ่มค้างไว้ (btnState == LOW) ให้เปิดไฟสีแดงกะพริบต่อเนื่อง และอ่านค่าปุ่มใหม่ก่อนจบรอบทุกครั้ง'
  },
  {
    id: 'dowhile-alarm',
    tabLabel: 'Workshop 2: Do While (ระบบเตือนภัย)',
    badge: 'ฝึกเขียน Do...While',
    title: 'เติมโครงสร้าง Do...While ให้เตือนภัยอย่างน้อย 1 รอบแล้วค่อยเช็กปุ่ม',
    goal: 'ประกาศตัวแปรนอก do จากนั้นสั่งเปิดไฟแดง + เสียงเตือนก่อน 1 รอบ แล้วค่อยตรวจ while (btnState == LOW); ตอนท้าย'
  },
  {
    id: 'while-counter',
    tabLabel: 'Workshop 3: While นับรอบ (5 ครั้ง)',
    badge: 'ฝึกเขียน While นับรอบ',
    title: 'เติมคำสั่งให้ไฟสีเขียวกะพริบครบ 5 ครั้งแล้วหยุดอัตโนมัติ',
    goal: 'กำหนดตัวนับเริ่มต้น count = 0 ตั้งเงื่อนไขให้ทำงาน 5 รอบ และเพิ่มค่า count ทีละ 1 ในตอนท้ายลูป'
  }
]

const activeMissionId = ref('while-btn')
const activeMission = computed(() => missions.find((m) => m.id === activeMissionId.value) || missions[0])

// Helper: normalize Arduino snippet spacing around punctuation/operators
const normalizeSnippet = (raw) =>
  String(raw || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),;=<>+!])\s*/g, '$1')
    .replace(/=+/g, (m) => m)

const equalsAny = (raw, acceptedList) => {
  const norm = normalizeSnippet(raw)
  return acceptedList.some((ans) => normalizeSnippet(ans) === norm)
}

const showHint = ref(false)
const showSolution = ref(false)
const copiedSolution = ref(false)

// ============================================================================
// MISSION 1 STATE: while-btn
// ============================================================================
const m1Inputs = ref({
  cond: '',
  body: '',
  update: ''
})
const m1Checked = ref(false)
const m1Status = ref({ cond: null, body: null, update: null })
const m1Feedback = ref({ cond: '', body: '', update: '' })

const m1Passed = computed(
  () => m1Status.value.cond === true && m1Status.value.body === true && m1Status.value.update === true
)

const m1Hints = [
  'ช่องที่ 1 (Condition): กดปุ่มแบบ INPUT_PULLUP จะได้ค่า LOW ให้เทียบว่า btnState == LOW',
  'ช่องที่ 2 (Loop Body): สั่งเปิดไฟแดงด้วยคำสั่ง digitalWrite(LED_RED, HIGH); (อย่าลืมเครื่องหมาย ;)',
  'ช่องที่ 3 (Update): อ่านค่าจากปุ่มกดใหม่อีกรอบด้วย btnState = digitalRead(BTN_PIN); เพื่อกัน Infinite Loop'
]

const m1SolutionCode = `int btnState = digitalRead(BTN_PIN);

while (btnState == LOW) {
  digitalWrite(LED_RED, HIGH);
  delay(200);
  digitalWrite(LED_RED, LOW);
  delay(200);

  btnState = digitalRead(BTN_PIN);
}`

// ============================================================================
// MISSION 2 STATE: dowhile-alarm
// ============================================================================
const m2Inputs = ref({
  init: '',
  kw: '',
  update: '',
  cond: ''
})
const m2Checked = ref(false)
const m2Status = ref({ init: null, kw: null, update: null, cond: null })
const m2Feedback = ref({ init: '', kw: '', update: '', cond: '' })

const m2Passed = computed(
  () =>
    m2Status.value.init === true &&
    m2Status.value.kw === true &&
    m2Status.value.update === true &&
    m2Status.value.cond === true
)

const m2Hints = [
  'ช่องที่ 1 (นอก do): ประกาศตัวแปรชื่อ btnState ด้วยชนิด int ด้านบน -> int btnState;',
  'ช่องที่ 2 (เปิดลูป): พิมพ์คำสั่งเปิดลูปแบบทำก่อนตรวจ คือคำว่า do',
  'ช่องที่ 3 (Update): อ่านค่าปุ่มใหม่ก่อนถึงปีกกาปิด -> btnState = digitalRead(BTN_PIN);',
  'ช่องที่ 4 (ท้ายลูป): ตรวจเงื่อนไข while (btnState == LOW); (ต้องใส่เครื่องหมาย ; ปิดท้ายด้วย)'
]

const m2SolutionCode = `if (digitalRead(BTN_PIN) == LOW) {
  int btnState;

  do {
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER, 1000);
    delay(200);

    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);
    delay(200);

    btnState = digitalRead(BTN_PIN);
  } while (btnState == LOW);
}`

// ============================================================================
// MISSION 3 STATE: while-counter
// ============================================================================
const m3Inputs = ref({
  init: '',
  cond: '',
  update: ''
})
const m3Checked = ref(false)
const m3Status = ref({ init: null, cond: null, update: null })
const m3Feedback = ref({ init: '', cond: '', update: '' })

const m3Passed = computed(
  () => m3Status.value.init === true && m3Status.value.cond === true && m3Status.value.update === true
)

const m3Hints = [
  'ช่องที่ 1 (Initialization): ประกาศตัวแปรจำนวนเต็มเริ่มจาก 0 -> int count = 0;',
  'ช่องที่ 2 (Condition): ให้ทำซ้ำ 5 รอบตั้งแต่ 0, 1, 2, 3, 4 -> count < 5 (หรือ count <= 4)',
  'ช่องที่ 3 (Update): เพิ่มค่าตัวนับทีละ 1 -> count++; (หรือ count = count + 1;)'
]

const m3SolutionCode = `int count = 0;

while (count < 5) {
  digitalWrite(LED_GREEN, HIGH);
  delay(250);
  digitalWrite(LED_GREEN, LOW);
  delay(250);

  count++;
}`

// ============================================================================
// CHECK / FILL / RESET / COPY HANDLERS
// ============================================================================
const checkMission1 = () => {
  m1Checked.value = true

  // 1. Condition
  if (equalsAny(m1Inputs.value.cond, ['btnState == LOW', 'LOW == btnState'])) {
    m1Status.value.cond = true
    m1Feedback.value.cond = 'ถูกต้อง: ตรวจว่า btnState == LOW ก่อนเข้าทำงานในลูป'
  } else {
    m1Status.value.cond = false
    m1Feedback.value.cond = 'ยังไม่ถูก: ให้เทียบตัวแปร btnState กับสถานะ LOW เช่น btnState == LOW'
  }

  // 2. Body
  if (equalsAny(m1Inputs.value.body, ['digitalWrite(LED_RED, HIGH);', 'digitalWrite(8, HIGH);'])) {
    m1Status.value.body = true
    m1Feedback.value.body = 'ถูกต้อง: สั่งเปิดไฟ LED_RED เป็น HIGH'
  } else if (equalsAny(m1Inputs.value.body, ['digitalWrite(LED_RED, HIGH)', 'digitalWrite(8, HIGH)'])) {
    m1Status.value.body = false
    m1Feedback.value.body = 'เกือบถูกแล้ว! อย่าลืมใส่เครื่องหมาย ; ปิดท้ายคำสั่ง digitalWrite(...);'
  } else {
    m1Status.value.body = false
    m1Feedback.value.body = 'ยังไม่ถูก: ใช้คำสั่ง digitalWrite(LED_RED, HIGH); เพื่อเปิดไฟสีแดง'
  }

  // 3. Update
  if (equalsAny(m1Inputs.value.update, ['btnState = digitalRead(BTN_PIN);', 'btnState = digitalRead(2);'])) {
    m1Status.value.update = true
    m1Feedback.value.update = 'ถูกต้อง: อ่านค่าปุ่มใหม่อีกครั้งเพื่อป้องกัน Infinite Loop'
  } else if (equalsAny(m1Inputs.value.update, ['btnState = digitalRead(BTN_PIN)', 'btnState = digitalRead(2)'])) {
    m1Status.value.update = false
    m1Feedback.value.update = 'เกือบถูกแล้ว! อย่าลืมใส่เครื่องหมาย ; ปิดท้ายคำสั่ง'
  } else {
    m1Status.value.update = false
    m1Feedback.value.update = 'ระวังติด Infinite Loop! ต้องอัปเดตด้วย btnState = digitalRead(BTN_PIN);'
  }
}

const checkMission2 = () => {
  m2Checked.value = true

  // 1. Init
  if (equalsAny(m2Inputs.value.init, ['int btnState;', 'int btnState = LOW;', 'int btnState = HIGH;'])) {
    m2Status.value.init = true
    m2Feedback.value.init = 'ถูกต้อง: ประกาศตัวแปร btnState ไว้นอกปีกกา do'
  } else if (equalsAny(m2Inputs.value.init, ['int btnState'])) {
    m2Status.value.init = false
    m2Feedback.value.init = 'เกือบถูกแล้ว! อย่าลืมใส่ ; ปิดท้าย int btnState;'
  } else {
    m2Status.value.init = false
    m2Feedback.value.init = 'ยังไม่ถูก: ให้ประกาศตัวแปรชื่อ btnState ชนิด int ด้านนอก -> int btnState;'
  }

  // 2. Keyword
  if (equalsAny(m2Inputs.value.kw, ['do'])) {
    m2Status.value.kw = true
    m2Feedback.value.kw = 'ถูกต้อง: เปิดลูปแบบ Post-test ด้วยคำสั่ง do'
  } else {
    m2Status.value.kw = false
    m2Feedback.value.kw = 'ยังไม่ถูก: หน้าปีกกาเปิด { ของลูปนี้ต้องใช้คำว่า do'
  }

  // 3. Update
  if (equalsAny(m2Inputs.value.update, ['btnState = digitalRead(BTN_PIN);', 'btnState = digitalRead(2);'])) {
    m2Status.value.update = true
    m2Feedback.value.update = 'ถูกต้อง: อัปเดตค่าปุ่มก่อนลงไปเช็กเงื่อนไขตอนท้าย'
  } else if (equalsAny(m2Inputs.value.update, ['btnState = digitalRead(BTN_PIN)', 'btnState = digitalRead(2)'])) {
    m2Status.value.update = false
    m2Feedback.value.update = 'เกือบถูกแล้ว! เติมเครื่องหมาย ; ปิดท้ายคำสั่งด้วยนะครับ'
  } else {
    m2Status.value.update = false
    m2Feedback.value.update = 'ยังไม่ถูก: อ่านค่าปุ่มใหม่ด้วยคำสั่ง btnState = digitalRead(BTN_PIN);'
  }

  // 4. Tail while condition + semicolon
  if (equalsAny(m2Inputs.value.cond, ['while (btnState == LOW);', 'while (LOW == btnState);'])) {
    m2Status.value.cond = true
    m2Feedback.value.cond = 'ถูกต้อง: ปิดท้าย do...while ด้วย while (btnState == LOW); ครบถ้วน'
  } else if (equalsAny(m2Inputs.value.cond, ['while (btnState == LOW)', 'while (LOW == btnState)'])) {
    m2Status.value.cond = false
    m2Feedback.value.cond = 'ลืมเครื่องหมาย ; ปิดท้าย! สำหรับ do...while ต้องจบด้วย while (btnState == LOW);'
  } else {
    m2Status.value.cond = false
    m2Feedback.value.cond = 'ยังไม่ถูก: ท้ายปีกกา } ต้องเขียน while (btnState == LOW);'
  }
}

const checkMission3 = () => {
  m3Checked.value = true

  // 1. Init
  if (equalsAny(m3Inputs.value.init, ['int count = 0;'])) {
    m3Status.value.init = true
    m3Feedback.value.init = 'ถูกต้อง: กำหนดตัวแปรนับรอบ count เริ่มต้นที่ 0'
  } else if (equalsAny(m3Inputs.value.init, ['int count = 0'])) {
    m3Status.value.init = false
    m3Feedback.value.init = 'เกือบถูกแล้ว! อย่าลืมใส่ ; ปิดท้าย int count = 0;'
  } else {
    m3Status.value.init = false
    m3Feedback.value.init = 'ยังไม่ถูก: ให้สร้างตัวแปร int ชื่อ count ค่าเริ่มต้น 0 -> int count = 0;'
  }

  // 2. Cond
  if (equalsAny(m3Inputs.value.cond, ['count < 5', 'count <= 4', '5 > count', '4 >= count'])) {
    m3Status.value.cond = true
    m3Feedback.value.cond = 'ถูกต้อง: เมื่อเริ่มจาก 0 เงื่อนไข count < 5 จะทำงาน 5 รอบ (0-4)'
  } else {
    m3Status.value.cond = false
    m3Feedback.value.cond = 'ยังไม่ถูก: ถ้าเริ่ม count = 0 อยากให้ทำ 5 รอบ ให้ตั้งเงื่อนไข count < 5'
  }

  // 3. Update
  if (equalsAny(m3Inputs.value.update, ['count++;', '++count;', 'count += 1;', 'count = count + 1;'])) {
    m3Status.value.update = true
    m3Feedback.value.update = 'ถูกต้อง: เพิ่มค่าตัวนับทีละ 1 ทุกจบรอบ'
  } else if (equalsAny(m3Inputs.value.update, ['count++', '++count', 'count += 1', 'count = count + 1'])) {
    m3Status.value.update = false
    m3Feedback.value.update = 'เกือบถูกแล้ว! อย่าลืมใส่เครื่องหมาย ; ปิดท้ายคำสั่ง'
  } else {
    m3Status.value.update = false
    m3Feedback.value.update = 'ยังไม่ถูก: ต้องเพิ่มค่าตัวแปรนับรอบด้วย count++; หรือ count = count + 1;'
  }
}

const checkCurrentMission = () => {
  stopAllSimulators()
  if (activeMissionId.value === 'while-btn') checkMission1()
  else if (activeMissionId.value === 'dowhile-alarm') checkMission2()
  else checkMission3()
}

const fillCurrentSolution = () => {
  stopAllSimulators()
  if (activeMissionId.value === 'while-btn') {
    m1Inputs.value = {
      cond: 'btnState == LOW',
      body: 'digitalWrite(LED_RED, HIGH);',
      update: 'btnState = digitalRead(BTN_PIN);'
    }
    checkMission1()
  } else if (activeMissionId.value === 'dowhile-alarm') {
    m2Inputs.value = {
      init: 'int btnState;',
      kw: 'do',
      update: 'btnState = digitalRead(BTN_PIN);',
      cond: 'while (btnState == LOW);'
    }
    checkMission2()
  } else {
    m3Inputs.value = {
      init: 'int count = 0;',
      cond: 'count < 5',
      update: 'count++;'
    }
    checkMission3()
  }
}

const resetCurrentMission = () => {
  stopAllSimulators()
  showHint.value = false
  showSolution.value = false
  if (activeMissionId.value === 'while-btn') {
    m1Inputs.value = { cond: '', body: '', update: '' }
    m1Checked.value = false
    m1Status.value = { cond: null, body: null, update: null }
    m1Feedback.value = { cond: '', body: '', update: '' }
  } else if (activeMissionId.value === 'dowhile-alarm') {
    m2Inputs.value = { init: '', kw: '', update: '', cond: '' }
    m2Checked.value = false
    m2Status.value = { init: null, kw: null, update: null, cond: null }
    m2Feedback.value = { init: '', kw: '', update: '', cond: '' }
  } else {
    m3Inputs.value = { init: '', cond: '', update: '' }
    m3Checked.value = false
    m3Status.value = { init: null, cond: null, update: null }
    m3Feedback.value = { init: '', cond: '', update: '' }
  }
}

const currentHints = computed(() => {
  if (activeMissionId.value === 'while-btn') return m1Hints
  if (activeMissionId.value === 'dowhile-alarm') return m2Hints
  return m3Hints
})

const currentSolutionCode = computed(() => {
  if (activeMissionId.value === 'while-btn') return m1SolutionCode
  if (activeMissionId.value === 'dowhile-alarm') return m2SolutionCode
  return m3SolutionCode
})

const currentPassed = computed(() => {
  if (activeMissionId.value === 'while-btn') return m1Passed.value
  if (activeMissionId.value === 'dowhile-alarm') return m2Passed.value
  return m3Passed.value
})

const copyCurrentSolution = () => {
  navigator.clipboard.writeText(currentSolutionCode.value).then(() => {
    copiedSolution.value = true
    setTimeout(() => {
      copiedSolution.value = false
    }, 2000)
  })
}

const switchMission = (id) => {
  stopAllSimulators()
  activeMissionId.value = id
  showHint.value = false
  showSolution.value = false
  copiedSolution.value = false
}

// ============================================================================
// INTERACTIVE HARDWARE SANDBOXES (UNLOCKED ON PASS)
// ============================================================================
// Mission 1 Simulator
const sim1BtnHeld = ref(false)
const sim1LedOn = ref(false)
const sim1Loops = ref(0)
let sim1Timer = null

const startSim1 = () => {
  if (!m1Passed.value || sim1BtnHeld.value) return
  sim1BtnHeld.value = true
  sim1LedOn.value = true
  sim1Loops.value += 1
  sim1Timer = setInterval(() => {
    sim1LedOn.value = !sim1LedOn.value
    if (sim1LedOn.value) sim1Loops.value += 1
  }, 220)
}

const stopSim1 = () => {
  sim1BtnHeld.value = false
  sim1LedOn.value = false
  if (sim1Timer) {
    clearInterval(sim1Timer)
    sim1Timer = null
  }
}

const toggleSim1Lock = () => {
  if (!m1Passed.value) return
  if (sim1BtnHeld.value) stopSim1()
  else startSim1()
}

// Mission 2 Simulator (Do-While finishes current cycle before checking exit)
const sim2Holding = ref(false)
const sim2CycleRunning = ref(false)
const sim2AlarmOn = ref(false)
const sim2Cycles = ref(0)
let sim2HalfTimer = null
let sim2EndTimer = null

const runDoWhileCycle = () => {
  if (sim2CycleRunning.value) return
  sim2CycleRunning.value = true
  sim2AlarmOn.value = true
  sim2Cycles.value += 1

  sim2HalfTimer = setTimeout(() => {
    sim2AlarmOn.value = false
    sim2EndTimer = setTimeout(() => {
      sim2CycleRunning.value = false
      // Post-test condition check at bottom of do...while
      if (sim2Holding.value && m2Passed.value) {
        runDoWhileCycle()
      }
    }, 220)
  }, 220)
}

const startSim2Hold = () => {
  if (!m2Passed.value) return
  sim2Holding.value = true
  runDoWhileCycle()
}

const stopSim2Hold = () => {
  sim2Holding.value = false
}

const triggerSingleDoWhileTap = () => {
  if (!m2Passed.value) return
  sim2Holding.value = false
  runDoWhileCycle()
}

// Mission 3 Simulator (Runs exactly 5 rounds then stops)
const sim3Running = ref(false)
const sim3LedOn = ref(false)
const sim3Count = ref(0)
let sim3Timer = null

const runCounterSim = () => {
  if (!m3Passed.value || sim3Running.value) return
  sim3Running.value = true
  sim3Count.value = 0
  sim3LedOn.value = true
  sim3Count.value = 1

  let halfTicks = 1
  sim3Timer = setInterval(() => {
    halfTicks += 1
    if (halfTicks % 2 === 0) {
      sim3LedOn.value = false
      if (sim3Count.value >= 5) {
        clearInterval(sim3Timer)
        sim3Timer = null
        sim3Running.value = false
      }
    } else {
      sim3Count.value += 1
      sim3LedOn.value = true
    }
  }, 250)
}

const stopAllSimulators = () => {
  stopSim1()
  sim1Loops.value = 0
  sim2Holding.value = false
  sim2AlarmOn.value = false
  sim2CycleRunning.value = false
  sim2Cycles.value = 0
  if (sim2HalfTimer) {
    clearTimeout(sim2HalfTimer)
    sim2HalfTimer = null
  }
  if (sim2EndTimer) {
    clearTimeout(sim2EndTimer)
    sim2EndTimer = null
  }
  sim3Running.value = false
  sim3LedOn.value = false
  sim3Count.value = 0
  if (sim3Timer) {
    clearInterval(sim3Timer)
    sim3Timer = null
  }
}

onUnmounted(() => {
  stopAllSimulators()
})

const statusInputClass = (checked, status) => {
  if (!checked || status === null) {
    return 'border-slate-600 bg-slate-900 text-amber-200 focus:border-sky-400'
  }
  if (status) {
    return 'border-emerald-400 bg-emerald-950/50 text-emerald-200 focus:border-emerald-300'
  }
  return 'border-rose-400 bg-rose-950/50 text-rose-200 focus:border-rose-300'
}
</script>

<template>
  <section class="space-y-6 pt-4">
    <!-- Section Heading -->
    <div class="flex items-center gap-3">
      <div class="p-3 bg-indigo-100 rounded-2xl text-indigo-700 shadow-sm">
        <Code2 class="w-7 h-7" />
      </div>
      <div>
        <span class="text-xs font-black text-indigo-700 uppercase tracking-wider">
          Workshop • ลงมือฝึกเขียนโค้ดด้วยตนเอง
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-stone-900">
          Workshop ฝึกเขียน <span class="font-mono text-emerald-700">While Loop</span> และ
          <span class="font-mono text-indigo-700">Do While</span>
        </h2>
      </div>
    </div>

    <div class="rounded-3xl p-6 sm:p-8 bg-white border border-indigo-200 shadow-sm space-y-6">
      <!-- Mission Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="m in missions"
          :key="m.id"
          type="button"
          @click="switchMission(m.id)"
          class="px-4 py-2 rounded-xl border text-xs sm:text-sm font-black cursor-pointer transition-all"
          :class="activeMissionId === m.id
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
            : 'bg-stone-100 text-stone-700 border-stone-200 hover:border-indigo-300 hover:bg-indigo-50'"
        >
          {{ m.tabLabel }}
        </button>
      </div>

      <!-- Active Mission Header -->
      <div class="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-4 sm:p-5 space-y-1.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black">
            {{ activeMission.badge }}
          </span>
          <span class="text-xs font-mono font-bold text-indigo-800 flex items-center gap-1.5">
            <Layers class="w-3.5 h-3.5" /> เติมคำสั่งลงในช่องว่างแล้วกดตรวจโค้ดเพื่อปลดล็อกตัวจำลองวงจร
          </span>
        </div>
        <h3 class="text-lg sm:text-xl font-black text-stone-900">
          {{ activeMission.title }}
        </h3>
        <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {{ activeMission.goal }}
        </p>
      </div>

      <!-- Main Split Layout: Editor Left + Hardware Sandbox Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <!-- Interactive Fill-in Code Editor -->
        <div class="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
          <div>
            <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="font-mono font-bold text-amber-300 flex items-center gap-2">
                <Terminal class="w-4 h-4" />
                <span>Arduino Workshop Editor</span>
              </span>
              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="currentPassed
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'"
              >
                {{ currentPassed ? 'โค้ดถูกต้อง พร้อมทดสอบวงจร!' : 'เติมคำสั่งในช่องว่างให้ครบ' }}
              </span>
            </div>

            <!-- Mission 1 Code Template -->
            <div v-if="activeMissionId === 'while-btn'" class="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-100 space-y-2.5 overflow-x-auto">
              <div class="text-sky-200 italic">// กำหนดให้ BTN_PIN = 2 (INPUT_PULLUP), LED_RED = 8</div>
              <div>
                <span class="text-violet-300 font-semibold">int</span> btnState =
                <span class="text-cyan-300 font-bold">digitalRead</span>(<span class="text-rose-300 font-bold">BTN_PIN</span>);
              </div>

              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-amber-300 font-bold">while</span>
                <span>(</span>
                <input
                  v-model="m1Inputs.cond"
                  type="text"
                  spellcheck="false"
                  placeholder="เงื่อนไข: btnState == LOW"
                  aria-label="เงื่อนไข While Loop"
                  class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-56 outline-none transition-colors"
                  :class="statusInputClass(m1Checked, m1Status.cond)"
                />
                <span>) &#123;</span>
              </div>

              <div class="pl-6 space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <input
                    v-model="m1Inputs.body"
                    type="text"
                    spellcheck="false"
                    placeholder="คำสั่งเปิดไฟ: digitalWrite(LED_RED, HIGH);"
                    aria-label="คำสั่งเปิดไฟแดง"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-72 sm:w-80 outline-none transition-colors"
                    :class="statusInputClass(m1Checked, m1Status.body)"
                  />
                </div>
                <div>
                  <span class="text-cyan-300 font-bold">delay</span>(<span class="text-orange-300">200</span>);
                </div>
                <div>
                  <span class="text-cyan-300 font-bold">digitalWrite</span>(<span class="text-rose-300 font-bold">LED_RED</span>,
                  <span class="text-rose-300 font-bold">LOW</span>);
                </div>
                <div>
                  <span class="text-cyan-300 font-bold">delay</span>(<span class="text-orange-300">200</span>);
                </div>

                <div class="pt-1 space-y-1">
                  <div class="text-sky-200 italic text-xs">// อัปเดตค่าปุ่มใหม่ก่อนจบรอบ (กัน Infinite Loop!)</div>
                  <input
                    v-model="m1Inputs.update"
                    type="text"
                    spellcheck="false"
                    placeholder="btnState = digitalRead(BTN_PIN);"
                    aria-label="คำสั่งอัปเดตค่าปุ่ม"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-72 sm:w-80 outline-none transition-colors"
                    :class="statusInputClass(m1Checked, m1Status.update)"
                  />
                </div>
              </div>

              <div>&#125;</div>
            </div>

            <!-- Mission 2 Code Template -->
            <div v-else-if="activeMissionId === 'dowhile-alarm'" class="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-100 space-y-2.5 overflow-x-auto">
              <div class="text-sky-200 italic">// กดปุ่ม (Pin 2) เพื่อเริ่มเตือนภัยอย่างน้อย 1 รอบแล้วค่อยเช็กตอนท้าย</div>
              <div>
                <span class="text-amber-300 font-bold">if</span> (<span class="text-cyan-300 font-bold">digitalRead</span>(<span class="text-rose-300 font-bold">BTN_PIN</span>) == <span class="text-rose-300 font-bold">LOW</span>) &#123;
              </div>

              <div class="pl-5 space-y-2">
                <div>
                  <input
                    v-model="m2Inputs.init"
                    type="text"
                    spellcheck="false"
                    placeholder="ประกาศตัวแปรนอกลูป: int btnState;"
                    aria-label="ประกาศตัวแปร btnState นอก do"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-64 outline-none transition-colors"
                    :class="statusInputClass(m2Checked, m2Status.init)"
                  />
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <input
                    v-model="m2Inputs.kw"
                    type="text"
                    spellcheck="false"
                    placeholder="do"
                    aria-label="คีย์เวิร์ดเปิดลูป do"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-24 outline-none transition-colors"
                    :class="statusInputClass(m2Checked, m2Status.kw)"
                  />
                  <span>&#123;</span>
                </div>

                <div class="pl-5 space-y-1.5">
                  <div>
                    <span class="text-cyan-300 font-bold">digitalWrite</span>(<span class="text-rose-300 font-bold">LED_RED</span>,
                    <span class="text-rose-300 font-bold">HIGH</span>);
                    <span class="text-cyan-300 font-bold">tone</span>(<span class="text-rose-300 font-bold">BUZZER</span>, <span class="text-orange-300">1000</span>);
                  </div>
                  <div>
                    <span class="text-cyan-300 font-bold">delay</span>(<span class="text-orange-300">200</span>);
                  </div>
                  <div>
                    <span class="text-cyan-300 font-bold">digitalWrite</span>(<span class="text-rose-300 font-bold">LED_RED</span>,
                    <span class="text-rose-300 font-bold">LOW</span>);
                    <span class="text-cyan-300 font-bold">noTone</span>(<span class="text-rose-300 font-bold">BUZZER</span>);
                  </div>
                  <div class="pt-1">
                    <input
                      v-model="m2Inputs.update"
                      type="text"
                      spellcheck="false"
                      placeholder="อัปเดตค่าปุ่ม: btnState = digitalRead(BTN_PIN);"
                      aria-label="อ่านค่าปุ่มใหม่ใน do-while"
                      class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-72 sm:w-80 outline-none transition-colors"
                      :class="statusInputClass(m2Checked, m2Status.update)"
                    />
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span>&#125;</span>
                  <input
                    v-model="m2Inputs.cond"
                    type="text"
                    spellcheck="false"
                    placeholder="while (btnState == LOW);"
                    aria-label="เงื่อนไขท้ายลูป do-while"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-64 outline-none transition-colors"
                    :class="statusInputClass(m2Checked, m2Status.cond)"
                  />
                </div>
              </div>

              <div>&#125;</div>
            </div>

            <!-- Mission 3 Code Template -->
            <div v-else class="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-100 space-y-2.5 overflow-x-auto">
              <div class="text-sky-200 italic">// ให้ไฟ LED สีเขียว (LED_GREEN) กะพริบครบ 5 ครั้งแล้วหยุด</div>
              <div>
                <input
                  v-model="m3Inputs.init"
                  type="text"
                  spellcheck="false"
                  placeholder="ตั้งตัวนับ: int count = 0;"
                  aria-label="ประกาศตัวนับเริ่มต้น"
                  class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-60 outline-none transition-colors"
                  :class="statusInputClass(m3Checked, m3Status.init)"
                />
              </div>

              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-amber-300 font-bold">while</span>
                <span>(</span>
                <input
                  v-model="m3Inputs.cond"
                  type="text"
                  spellcheck="false"
                  placeholder="เงื่อนไข: count < 5"
                  aria-label="เงื่อนไขนับ 5 รอบ"
                  class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-44 outline-none transition-colors"
                  :class="statusInputClass(m3Checked, m3Status.cond)"
                />
                <span>) &#123;</span>
              </div>

              <div class="pl-6 space-y-2">
                <div>
                  <span class="text-cyan-300 font-bold">digitalWrite</span>(<span class="text-rose-300 font-bold">LED_GREEN</span>,
                  <span class="text-rose-300 font-bold">HIGH</span>);
                  <span class="text-cyan-300 font-bold">delay</span>(<span class="text-orange-300">250</span>);
                </div>
                <div>
                  <span class="text-cyan-300 font-bold">digitalWrite</span>(<span class="text-rose-300 font-bold">LED_GREEN</span>,
                  <span class="text-rose-300 font-bold">LOW</span>);
                  <span class="text-cyan-300 font-bold">delay</span>(<span class="text-orange-300">250</span>);
                </div>
                <div class="pt-1 space-y-1">
                  <div class="text-sky-200 italic text-xs">// เพิ่มค่าตัวนับทีละ 1 ก่อนวนรอบใหม่</div>
                  <input
                    v-model="m3Inputs.update"
                    type="text"
                    spellcheck="false"
                    placeholder="count++;"
                    aria-label="เพิ่มค่าตัวนับ count"
                    class="px-2.5 py-1 rounded-lg border font-mono text-xs sm:text-sm w-48 outline-none transition-colors"
                    :class="statusInputClass(m3Checked, m3Status.update)"
                  />
                </div>
              </div>

              <div>&#125;</div>
            </div>

            <!-- Feedback List after Checking -->
            <div v-if="(activeMissionId === 'while-btn' && m1Checked) || (activeMissionId === 'dowhile-alarm' && m2Checked) || (activeMissionId === 'while-counter' && m3Checked)"
              class="mx-4 mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <template v-if="activeMissionId === 'while-btn'">
                <div v-for="key in ['cond', 'body', 'update']" :key="key" class="flex items-start gap-2"
                  :class="m1Status[key] ? 'text-emerald-300' : 'text-rose-300'">
                  <CheckCircle2 v-if="m1Status[key]" class="w-4 h-4 shrink-0 mt-0.5" />
                  <XCircle v-else class="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{{ m1Feedback[key] }}</span>
                </div>
              </template>
              <template v-else-if="activeMissionId === 'dowhile-alarm'">
                <div v-for="key in ['init', 'kw', 'update', 'cond']" :key="key" class="flex items-start gap-2"
                  :class="m2Status[key] ? 'text-emerald-300' : 'text-rose-300'">
                  <CheckCircle2 v-if="m2Status[key]" class="w-4 h-4 shrink-0 mt-0.5" />
                  <XCircle v-else class="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{{ m2Feedback[key] }}</span>
                </div>
              </template>
              <template v-else>
                <div v-for="key in ['init', 'cond', 'update']" :key="key" class="flex items-start gap-2"
                  :class="m3Status[key] ? 'text-emerald-300' : 'text-rose-300'">
                  <CheckCircle2 v-if="m3Status[key]" class="w-4 h-4 shrink-0 mt-0.5" />
                  <XCircle v-else class="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{{ m3Feedback[key] }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="checkCurrentMission"
                class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play class="w-3.5 h-3.5" />
                <span>ตรวจโค้ดที่เขียน</span>
              </button>

              <button
                type="button"
                @click="showHint = !showHint"
                class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Lightbulb class="w-3.5 h-3.5" />
                <span>{{ showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้' }}</span>
              </button>

              <button
                type="button"
                @click="showSolution = !showSolution"
                class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Code2 class="w-3.5 h-3.5" />
                <span>{{ showSolution ? 'ซ่อนเฉลย' : 'ดูเฉลย' }}</span>
              </button>
            </div>

            <button
              type="button"
              @click="resetCurrentMission"
              class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>ล้างคำตอบ</span>
            </button>
          </div>
        </div>

        <!-- Hardware Test Bench (Right Panel) -->
        <div class="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4 text-white">
          <div class="space-y-1 border-b border-slate-800 pb-3">
            <span class="text-[11px] font-mono font-bold text-sky-400 flex items-center gap-1.5 uppercase">
              <SlidersHorizontal class="w-3.5 h-3.5" />
              <span>Hardware Test Bench</span>
            </span>
            <h4 class="text-sm sm:text-base font-black text-white">
              {{ currentPassed ? 'วงจรพร้อมทดสอบการทำงานแล้ว' : 'เขียนโค้ดให้ถูกต้องเพื่อปลดล็อกวงจรทดสอบ' }}
            </h4>
          </div>

          <!-- Mission 1 Hardware Bench -->
          <div v-if="activeMissionId === 'while-btn'" class="space-y-4 flex-1 flex flex-col justify-center">
            <div class="grid grid-cols-2 gap-3 items-center">
              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-2 text-center">
                <span class="text-[11px] font-bold text-slate-300">ปุ่มกด Pin 2</span>
                <div :class="!m1Passed ? 'opacity-40 pointer-events-none' : ''">
                  <TinkercadPushButton
                    :pressed="sim1BtnHeld"
                    :active="sim1BtnHeld"
                    size-class="w-16 h-16"
                    aria-label="ทดสอบปุ่มกด Workshop 1"
                    @hold-start="startSim1"
                    @hold-end="stopSim1"
                  />
                </div>
                <button
                  type="button"
                  :disabled="!m1Passed"
                  @click="toggleSim1Lock"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors"
                  :class="!m1Passed
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-sky-300 cursor-pointer'"
                >
                  {{ sim1BtnHeld ? 'คลิกปล่อยปุ่ม (HIGH)' : 'หรือคลิกล็อกปุ่มค้าง' }}
                </button>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-2 text-center">
                <TinkercadLed color="red" :on="sim1LedOn" size-class="w-14 h-16" />
                <span class="text-xs font-bold text-rose-300">LED แดง (Pin 8)</span>
                <span class="text-[11px] font-mono text-slate-300">
                  รอบ while: <strong class="text-amber-300">{{ sim1Loops }}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Mission 2 Hardware Bench -->
          <div v-else-if="activeMissionId === 'dowhile-alarm'" class="space-y-4 flex-1 flex flex-col justify-center">
            <div class="grid grid-cols-3 gap-2 items-center">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5 text-center">
                <span class="text-[11px] font-bold text-slate-300">ปุ่มกด Pin 2</span>
                <div :class="!m2Passed ? 'opacity-40 pointer-events-none' : ''">
                  <TinkercadPushButton
                    :pressed="sim2Holding || sim2CycleRunning"
                    :active="sim2Holding || sim2CycleRunning"
                    size-class="w-14 h-14"
                    aria-label="ทดสอบปุ่มกด Workshop 2"
                    @hold-start="startSim2Hold"
                    @hold-end="stopSim2Hold"
                  />
                </div>
              </div>

              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5 text-center">
                <TinkercadLed color="red" :on="sim2AlarmOn" size-class="w-12 h-14" />
                <span class="text-[11px] font-bold text-rose-300">LED แดง</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5 text-center">
                <TinkercadBuzzer :active="sim2AlarmOn" size-class="w-14 h-14" />
                <span class="text-[11px] font-bold text-amber-300">Buzzer</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                :disabled="!m2Passed"
                @click="triggerSingleDoWhileTap"
                class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors"
                :class="!m2Passed
                  ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white cursor-pointer'"
              >
                กดสั้นๆ 1 ที (ทดสอบทำงาน 1 รอบ)
              </button>
              <span class="text-xs font-mono text-slate-300">
                จำนวนรอบที่เตือน: <strong class="text-amber-300">{{ sim2Cycles }}</strong>
              </span>
            </div>
          </div>

          <!-- Mission 3 Hardware Bench -->
          <div v-else class="space-y-4 flex-1 flex flex-col justify-center">
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-2 text-center">
              <TinkercadLed color="green" :on="sim3LedOn" size-class="w-16 h-20" />
              <div class="text-xs font-bold text-emerald-300">LED สีเขียว (Pin 9)</div>
              <div class="text-xs font-mono text-slate-200">
                รอบการทำงาน: <strong class="text-amber-300">{{ sim3Count }} / 5</strong>
                <span v-if="!sim3Running && sim3Count === 5" class="text-emerald-300 font-bold"> (ครบ 5 รอบ หยุดอัตโนมัติ!)</span>
              </div>
            </div>

            <button
              type="button"
              :disabled="!m3Passed || sim3Running"
              @click="runCounterSim"
              class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"
              :class="!m3Passed || sim3Running
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'"
            >
              <Play class="w-4 h-4" />
              <span>{{ sim3Running ? 'กำลังกะพริบ...' : 'จำลองรันโค้ด 5 รอบ' }}</span>
            </button>
          </div>

          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            <span v-if="currentPassed" class="text-emerald-300 font-bold">
              ทดลองกดทดสอบพฤติกรรมวงจรด้านบน แล้วคัดลอกโค้ดไปลองต่อจริงใน Tinkercad ได้เลยครับ
            </span>
            <span v-else>
              เติมคำสั่งในช่องว่างฝั่งซ้ายแล้วกดปุ่ม <strong>"ตรวจโค้ดที่เขียน"</strong> เพื่อเปิดใช้งานบอร์ดจำลอง
            </span>
          </div>
        </div>
      </div>

      <!-- Optional Hints Drawer -->
      <div v-if="showHint" class="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-xs text-amber-950">
        <div class="font-black text-amber-900 flex items-center gap-1.5">
          <Lightbulb class="w-4 h-4 text-amber-600" />
          <span>คำใบ้ทีละช่อง</span>
        </div>
        <ul class="space-y-1 list-disc list-inside leading-relaxed">
          <li v-for="(hint, hIdx) in currentHints" :key="hIdx">{{ hint }}</li>
        </ul>
      </div>

      <!-- Optional Solution Drawer -->
      <div v-if="showSolution" class="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-slate-100">
        <div class="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-sky-300 flex items-center gap-1.5">
            <Code2 class="w-4 h-4" />
            <span>เฉลยตัวอย่าง ({{ activeMission.tabLabel }})</span>
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="fillCurrentSolution"
              class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-colors"
            >
              กรอกเฉลยลงช่องว่าง
            </button>
            <button
              type="button"
              @click="copyCurrentSolution"
              class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Check v-if="copiedSolution" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedSolution ? 'คัดลอกแล้ว' : 'คัดลอกเฉลย' }}</span>
            </button>
          </div>
        </div>
        <pre class="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-emerald-200">{{ currentSolutionCode }}</pre>
      </div>
    </div>
  </section>
</template>
