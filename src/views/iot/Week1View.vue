<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExternalLink, CheckCircle, Globe, ShieldCheck, Code2, Cpu,
  UserPlus, MousePointerClick, Cable, FileCode2, Play, Lightbulb,
  AlertTriangle, Zap, ToggleRight, SlidersHorizontal, LayoutGrid, Terminal,
  Info, PieChart, Book, FileText, Target, Award, Layers, Sliders, Radio,
  RefreshCw, Gamepad2, MousePointer2, ListOrdered, FileQuestion, ChevronRight,
  Activity, Sun, Thermometer, Volume2, ArrowDownToLine, ArrowUpFromLine,
  Trophy, Lock, FileSpreadsheet, Box, Disc
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'
import AssignmentPdfModal from '@/components/AssignmentPdfModal.vue'

import { authUser } from '@/data/authStore'
import { isStudent } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 1
const showTeacherModal = ref(false)
const showPdfModal = ref(false)

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกพินบนบอร์ด Arduino)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (คำศัพท์และหน้าที่สำคัญของระบบสมองกล)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียน (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
]

onMounted(() => {
  fetchGameScores(currentCourseId, currentWeek)
})

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')
const isTeacher = computed(() => !isStudent(authUser.value))

const studentWeekScores = computed(() => {
  if (!currentStudentId.value) return {}
  const key = `${currentCourseId}_${currentWeek}_${currentStudentId.value}`
  return gameScoresStore.value[key]?.scores || {}
})

const studentNorm = computed(() => {
  return calculateNormalizedScore(studentWeekScores.value, weekGames)
})

const router = useRouter()

// Grading Criteria Data
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-amber-400' },
  { name: 'คะแนนเก็บ (ใบงาน/มินิโปรเจกต์)', score: 40, color: 'bg-amber-500' },
  { name: 'สอบกลางภาคปฏิบัติ (Midterm)', score: 20, color: 'bg-orange-600' },
  { name: 'สอบปลายภาคและโครงงาน IoT (Final)', score: 20, color: 'bg-red-700' }
]

// 8 Key Components of Arduino Uno R3 matching /img/Arduino.png
const arduinoComponents = [
  {
    num: 1,
    id: 'microcontroller',
    name: '1. MICROCONTROLLER (ไมโครคอนโทรลเลอร์)',
    eng: 'ATmega328P DIP-28',
    color: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
    badgeColor: 'bg-teal-500 text-stone-950',
    icon: Cpu,
    desc: 'เป็น "สมองสั่งการหลัก" ของบอร์ด Arduino ทำหน้าที่ประมวลผลคำสั่ง ควบคุมการทำงานของอินพุตและเอาต์พุตทั้งหมด',
    bullets: [
      'Flash Memory: 32 KB (ใช้เก็บโค้ดโปรแกรมภาษา C/C++ ที่เราเขียน)',
      'SRAM: 2 KB (เก็บตัวแปรขณะประมวลผล) และ EEPROM: 1 KB (บันทึกข้อมูลถาวร)',
      'Clock Speed: สัญญาณนาฬิกา 16 MHz (ประมวลผล 16 ล้านรอบคำสั่งต่อวินาที)'
    ]
  },
  {
    num: 2,
    id: 'usb-port',
    name: '2. USB PORT (พอร์ตเชื่อมต่อ USB Type-B)',
    eng: 'USB Type-B Female Connector',
    color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    badgeColor: 'bg-cyan-500 text-stone-950',
    icon: Zap,
    desc: 'ช่องทางหลักในการเชื่อมต่อบอร์ด Arduino Uno R3 เข้ากับคอมพิวเตอร์ ทำหน้าที่สำคัญ 3 อย่างพร้อมกัน',
    bullets: [
      'อัปโหลดโปรแกรม (Code Upload): ถ่ายโอนโค้ดที่คอมไพล์แล้วลงสู่หน่วยความจำ Flash',
      'จ่ายไฟเลี้ยง (Power 5V): เลี้ยงวงจรและบอร์ดขณะพัฒนาโดยไม่ต้องต่อไฟภายนอก',
      'สื่อสารข้อมูล (Serial Monitor): ส่งและรับค่าตัวแปรเพื่อตรวจเช็กสถานะการทำงานแบบเรียลไทม์'
    ]
  },
  {
    num: 3,
    id: 'usb-serial',
    name: '3. USB TO SERIAL CHIP (ชิปแปลงสัญญาณ USB)',
    eng: 'ATmega16U2 Serial Converter',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    badgeColor: 'bg-amber-500 text-stone-950',
    icon: Radio,
    desc: 'ทำหน้าที่เป็น "ล่ามสื่อสาร" แปลงสัญญาณข้อมูลระหว่างโปรโตคอล USB ของคอมพิวเตอร์ กับระบบ Serial UART (RX/TX) ของไมโครคอนโทรลเลอร์',
    bullets: [
      'บอร์ดมาตรฐานใช้ชิป ATmega16U2 (ส่วนบอร์ดทดลองทั่วไปมักใช้ชิป CH340)',
      'มีไฟ LED แสดงสถานะ TX (ส่งข้อมูล) และ RX (รับข้อมูล) กะพริบขณะอัปโหลดโค้ด'
    ]
  },
  {
    num: 4,
    id: 'digital-pins',
    name: '4. DIGITAL PINS (ขาพอร์ตดิจิทัล ขา 0 ถึง 13)',
    eng: '14 Digital I/O Pins',
    color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    badgeColor: 'bg-blue-500 text-stone-950',
    icon: ToggleRight,
    desc: 'แถบช่องเสียบ 14 ขาด้านบน สำหรับรับหรือส่งสัญญาณแบบดิจิทัล มีเพียง 2 ระดับสถานะ คือ HIGH (5V หรือ 1) และ LOW (0V หรือ 0)',
    bullets: [
      'PWM Pins (~): ขา ~3, ~5, ~6, ~9, ~10, ~11 จำลองแรงดันแอนะล็อก (หรี่ไฟ LED, คุมความเร็วมอเตอร์)',
      'Pin 13 (Built-in LED): มีไฟ LED สีส้มต่อพ่วงอยู่บนบอร์ด สั่งทดสอบโค้ดไฟกะพริบได้ทันที',
      'Pin 0 (RX) & Pin 1 (TX): ใช้สำหรับสื่อสารแบบอนุกรม (ห้ามต่ออุปกรณ์อื่นขณะอัปโหลดโค้ด)'
    ]
  },
  {
    num: 5,
    id: 'analog-pins',
    name: '5. ANALOG PINS (ขาพอร์ตแอนะล็อก ขา A0 ถึง A5)',
    eng: '6 Analog Input Pins',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    badgeColor: 'bg-emerald-500 text-stone-950',
    icon: SlidersHorizontal,
    desc: 'แถบช่องเสียบ 6 ขาด้านล่าง ทำหน้าที่เป็น Analog Input สำหรับอ่านค่าแรงดันไฟฟ้าที่มีการเปลี่ยนแปลงต่อเนื่องตั้งแต่ 0 ถึง 5 โวลต์',
    bullets: [
      'วงจรแปลงค่า (ADC 10-bit): แปลงระดับแรงดัน 0V - 5V ให้เป็นตัวเลขจำนวนเต็ม 0 ถึง 1023',
      'ใช้สำหรับต่อกับเซนเซอร์วัดค่าในธรรมชาติ เช่น เซนเซอร์แสง (LDR), เซนเซอร์วัดอุณหภูมิ, ตัวต้านทานปรับค่าได้ (Potentiometer)'
    ]
  },
  {
    num: 6,
    id: 'power-pins',
    name: '6. 5V / 3.3V (พินจ่ายพลังงานไฟเลี้ยงวงจร)',
    eng: 'Power Output Pins (5V & 3.3V)',
    color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    badgeColor: 'bg-rose-500 text-stone-950',
    icon: Zap,
    desc: 'ช่องจ่ายกระแสไฟฟ้าตรงคงที่ สำหรับนำไปเป็นไฟเลี้ยงให้กับวงจรภายนอกและเซนเซอร์ที่นำมาต่อพ่วง',
    bullets: [
      '5V Pin: แหล่งจ่ายแรงดันไฟตรง 5 โวลต์หลัก สำหรับเซนเซอร์และโมดูลส่วนใหญ่ของ Arduino',
      '3.3V Pin: จ่ายแรงดันไฟตรง 3.3 โวลต์ (กระแสสูงสุด 50-150 mA) สำหรับเซนเซอร์รุ่นใหม่'
    ]
  },
  {
    num: 7,
    id: 'gnd-pins',
    name: '7. GND (Ground - ขั้วลบหรือกราวด์)',
    eng: 'Ground Reference Pins (0V)',
    color: 'border-slate-500/40 bg-slate-950/20 text-slate-300',
    badgeColor: 'bg-slate-400 text-stone-950',
    icon: CheckCircle,
    desc: 'ขั้วลบหรือจุดอ้างอิงแรงดันไฟฟ้า 0 โวลต์ของวงจรทั้งหมด บนบอร์ดมีให้ใช้งาน 3 ขา (ฝั่ง Power 2 ขา และฝั่ง Digital 1 ขา)',
    bullets: [
      'กฎเหล็กของวงจรอิเล็กทรอนิกส์: อุปกรณ์ทุกตัวต้องมีสายต่อกลับมายัง GND ร่วมกัน (Common Ground) เสมอ',
      'หากลืมต่อสายกราวด์ กระแสไฟฟ้าจะไม่สามารถไหลครบวงจรได้ และระบบจะไม่ทำงาน'
    ]
  },
  {
    num: 8,
    id: 'vin-pin',
    name: '8. VIN (Voltage In - ช่องรับไฟเลี้ยงจากภายนอก)',
    eng: 'External DC Input Pin (7-12V)',
    color: 'border-orange-500/40 bg-orange-950/20 text-orange-300',
    badgeColor: 'bg-orange-500 text-stone-950',
    icon: Sliders,
    desc: 'ช่องสำหรับรับแรงดันไฟฟ้ากระแสตรงจากแหล่งจ่ายไฟภายนอก เช่น แบตเตอรี่ 9V หรือรางถ่าน เมื่อต้องการให้บอร์ดทำงานแบบ Standalone',
    bullets: [
      'ช่วงแรงดันที่แนะนำ: ป้อนไฟตรงได้ตั้งแต่ 7 ถึง 12 โวลต์ DC',
      'ไฟจาก VIN จะไหลผ่านตัวคุมแรงดัน (Voltage Regulator) บนบอร์ด เพื่อปรับลดให้เหลือ 5V อย่างปลอดภัย'
    ]
  }
]

// Digital vs Analog Scenarios Data
const scenarios = [
  {
    title: '1. การควบคุมระบบแสงสว่าง (Lighting Control)',
    icon: Lightbulb,
    digital: {
      title: 'สวิตช์เปิด-ปิดไฟห้องเรียน (Digital Output)',
      desc: 'กดสวิตช์เปิดไฟสว่างทันที (HIGH หรือ 5V) และกดสวิตช์ปิดไฟดับสนิท (LOW หรือ 0V) มีเพียง 2 สถานะที่ชัดเจนเท่านั้น ไม่สามารถหรี่ไฟครึ่งๆ กลางๆ ได้'
    },
    analog: {
      title: 'สวิตช์ดิมเมอร์ปรับความสว่าง (Analog / PWM Output)',
      desc: 'หมุนสวิตช์หรี่ไฟในโรงภาพยนตร์ โดยใช้คำสั่ง analogWrite(pin, 0-255) ปรับแรงดันเสมือนให้หลอดไฟค่อยๆ สลัวลงอย่างนุ่มนวล หรือปรับแสงไฟอัตโนมัติตามเซนเซอร์วัดแสงภายนอกห้อง'
    }
  },
  {
    title: '2. การตรวจจับสิ่งกีดขวางและระยะทาง (Distance & Proximity)',
    icon: Activity,
    digital: {
      title: 'สวิตช์ชนกันชนหุ่นยนต์ (Digital Input)',
      desc: 'สวิตช์ Limit Switch ที่กันชนหุ่นยนต์จะส่งค่า 1 (HIGH) เมื่อหุ่นยนต์ชนกำแพง และส่ง 0 (LOW) เมื่อไม่ชน ไม่สามารถบอกได้ว่ากำแพงอยู่ห่างกี่เซนติเมตร รู้แค่ "ชน" หรือ "ไม่ชน"'
    },
    analog: {
      title: 'เซนเซอร์วัดระยะทางอินฟราเรด (Analog Input)',
      desc: 'ส่งค่าแรงดันสะท้อนกลับมาอย่างต่อเนื่อง 0V - 5V แปลงเป็นตัวเลข 0 - 1023 บนขา A0 ทำให้คำนวณระยะห่างเป็นเซนติเมตรได้อย่างแม่นยำ เช่น ห่าง 15.4 ซม. หรือ 30 ซม.'
    }
  },
  {
    title: '3. ระบบควบคุมอุณหภูมิและความร้อน (Temperature Control)',
    icon: Thermometer,
    digital: {
      title: 'สวิตช์เทอร์โมสตัทในกาต้มน้ำ (Digital Input)',
      desc: 'สวิตช์แบบ Bimetal จะดีดตัดวงจรทันทีเมื่อน้ำเดือดถึง 100°C ส่งสัญญาณ 0 ตัดไฟ และ 1 ต้มน้ำต่อ ไม่รายงานค่าอุณหภูมิระหว่างที่กำลังต้ม'
    },
    analog: {
      title: 'เซนเซอร์วัดอุณหภูมิในห้องแล็บ LM35 (Analog Input)',
      desc: 'ปล่อยแรงดันไฟฟ้าแปรผันตามอุณหภูมิตลอดเวลา (10 mV ต่อ 1°C) บอร์ดอ่านค่าเป็นตัวเลขต่อเนื่อง เช่น 25.2°C, 25.8°C นำไปพล็อตเป็นกราฟและควบคุมแอร์อย่างแม่นยำ'
    }
  }
]

// Basic Hardware Components Data
const basicComponents = [
  {
    name: 'Breadboard (แผงทดลองวงจร)',
    role: 'ตัวกลางเชื่อมต่อวงจร',
    category: 'อุปกรณ์พื้นฐาน',
    badge: 'Prototyping',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: LayoutGrid,
    image: 'https://th.element14.com/productimages/large/en_US/56T0249-40.jpg',
    desc: 'แผงเสียบวงจรที่ช่วยให้เราทดลองต่ออุปกรณ์ได้โดยไม่ต้องบัดกรี (Solderless) ภายในมีรางโลหะนำไฟฟ้าเชื่อมถึงกัน',
    keyPoints: [
      'รางจ่ายไฟด้านข้าง (+ / -): เชื่อมต่อกันในแนวตั้งตลอดแนวยาว ใช้จ่ายไฟ 5V/3.3V และ GND',
      'รูเสียบตรงกลาง (Terminal Strips): เชื่อมต่อกันในแนวนอนแถวละ 5 รู (A-E และ F-J แยกกัน)',
      'ร่องตรงกลาง (Center Divider): ใช้สำหรับคร่อมไอซี (IC) หรือแยกวงจรสองฝั่งออกจากกัน'
    ]
  },
  {
    name: 'Resistor (ตัวต้านทาน)',
    role: 'จำกัดกระแสไฟฟ้า (Current Limiting)',
    category: 'ชิ้นส่วนอิเล็กทรอนิกส์',
    badge: 'Protection',
    badgeColor: 'bg-rose-100 text-rose-800',
    icon: Zap,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKK9_fbF9CElWBkV_bYTskud1Ygq9laj6V_PdA66pSKkJsE9H8HEgb8a9&s=10',
    desc: 'อุปกรณ์ลดแรงดันและจำกัดปริมาณกระแสไฟฟ้าที่ไหลผ่านวงจร หน่วยเป็นโอห์ม (Ω) เพื่อป้องกันอุปกรณ์เสียหาย',
    keyPoints: [
      'ตัวต้านทาน 220 Ω / 330 Ω: ใช้ต่ออนุกรมกับหลอดไฟ LED เสมอ เพื่อป้องกัน LED ไหม้จากกระแสเกิน',
      'ตัวต้านทาน 10 kΩ: นิยมใช้เป็นตัวต้านทาน Pull-up หรือ Pull-down สำหรับสวิตช์ปุ่มกด',
      'ไม่มีขั้ว: สามารถต่อสลับด้านได้อย่างอิสระโดยไม่ต้องกังวลเรื่องขั้วบวก/ลบ'
    ]
  },
  {
    name: 'LED (ไดโอดเปล่งแสง)',
    role: 'อุปกรณ์แสดงผลสถานะ (Display)',
    category: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Lightbulb,
    image: 'https://inwfile.com/s-da/rvtpo6.jpg',
    desc: 'อุปกรณ์สารกึ่งตัวนำที่เปล่งแสงเมื่อมีกระแสไฟฟ้าไหลผ่านในทิศทางที่ถูกต้อง มี 2 ขาที่ต้องต่อให้ถูกขั้ว',
    keyPoints: [
      'ขาแอโนด (Anode / ขั้วบวก): ขายาว ต่อเข้ากับพินสัญญาณของบอร์ด (ผ่านตัวต้านทาน)',
      'ขาแคโทด (Cathode / ขั้วลบ): ขาสั้นและขอบบากเรียบ ต่อกลับไปยังกราวด์ (GND)',
      'ห้ามต่อตรงกับไฟ 5V โดยไม่มีตัวต้านทาน เพราะจะทำให้หลอดขาดทันที'
    ]
  }
]

// Digital & Analog Devices Showcase
const digitalDevices = [
  {
    name: 'Pushbutton (สวิตช์ปุ่มกด)',
    type: 'Digital Input',
    badge: 'Input',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    image: 'https://shop.sirichaielectric.com/image/menu/PUSHBUTTON-SWITCH-TN2-TEND.jpg',
    desc: 'สำหรับรับคำสั่งกดปุ่มจากผู้ใช้ เช่น ปุ่มเริ่มทำงานหรือปุ่มหยุด กดปุ่มคืนค่า 1 (HIGH) ปล่อยปุ่มคืนค่า 0 (LOW)',
    command: 'digitalRead(pin)'
  },
  {
    name: 'PIR Motion Sensor (เซนเซอร์ตรวจจับคน)',
    type: 'Digital Input',
    badge: 'Input',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    image: 'https://inwfile.com/s-i/9wqk1b.jpg',
    desc: 'ตรวจจับรังสีอินฟราเรดความร้อนจากร่างกายมนุษย์ เมื่อมีคนเดินผ่านส่งสัญญาณ HIGH (1) และเมื่อไม่มีคนส่ง LOW (0)',
    command: 'digitalRead(pin)'
  },
  {
    name: 'LED (หลอดไฟแสดงผล)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: 'https://inwfile.com/s-da/rvtpo6.jpg',
    desc: 'อุปกรณ์แสดงผลสถานะพื้นฐาน เปล่งแสงเมื่อสั่งจ่ายไฟ 5V (HIGH) และดับลงเมื่อสั่งจ่ายไฟ 0V (LOW)',
    command: 'digitalWrite(pin, HIGH/LOW)'
  },
  {
    name: 'Relay Module (โมดูลรีเลย์สวิตช์ไฟฟ้า)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: 'https://static.cytron.io/image/cache/catalog/products/BB-RELAY-5V-02/BB-RELAY-5V-02-800x800.png',
    desc: 'ใช้สัญญาณดิจิทัล 5V ควบคุมการเปิด-ปิดเครื่องใช้ไฟฟ้าแรงดันสูง 220V เช่น หลอดไฟบ้าน พัดลม หรือปั๊มน้ำ',
    command: 'digitalWrite(pin, HIGH/LOW)'
  },
  {
    name: 'Active Buzzer (ออดส่งเสียงเตือน)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: 'https://inwfile.com/s-i/r3ao3y.jpg',
    desc: 'สร้างเสียง Beep เตือนภัยทันทีเมื่อบอร์ดส่งสถานะ HIGH (5V) และหยุดส่งเสียงเมื่อส่ง LOW (0V)',
    command: 'digitalWrite(pin, HIGH/LOW)'
  }
]

const analogDevices = [
  {
    name: 'Potentiometer (วอลลุ่ม / ตัวต้านทานปรับค่าได้)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: 'data:image/webp;base64,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',
    desc: 'หมุนแกนปรับแรงดัน 0V ถึง 5V คืนค่าตัวเลข 0 ถึง 1023 สำหรับปรับระดับเสียง ความเร็วรอบ หรือตั้งค่าเวลา',
    command: 'analogRead(A0)'
  },
  {
    name: 'LDR Photoresistor (เซนเซอร์วัดความเข้มแสง)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: 'https://www.ai-corporation.net/wp-content/uploads/2021/11/chto-takoe-fotorezistory-9-e1636345173290.jpg',
    desc: 'ความต้านทานเปลี่ยนแปลงตามความสว่างของแสง ยิ่งสว่างแรงดันยิ่งเปลี่ยน คืนค่า 0 ถึง 1023 สำหรับระบบไฟถนนเปิดอัตโนมัติ',
    command: 'analogRead(A1)'
  },
  {
    name: 'LM35 / Thermistor (เซนเซอร์วัดอุณหภูมิ)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: 'https://images.theengineeringprojects.com/image/main/2019/01/lm35-pinout.jpg',
    desc: 'จ่ายแรงดันแปรผันตามอุณหภูมิ (เช่น 10 mV ต่อ 1°C) นำค่า 0-1023 มาแปลงเป็นองศาเซลเซียสได้ละเอียด',
    command: 'analogRead(A2)'
  },
  {
    name: 'Soil Moisture Sensor (เซนเซอร์วัดความชื้นในดิน)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: 'https://inwfile.com/s-j/wic7gi.jpg',
    desc: 'วัดความชื้นในดินจากการนำไฟฟ้าของน้ำ คืนค่า 0 (ดินแห้งแล้ง) ถึง 1023 (ดินเปียกชุ่ม) สำหรับระบบสมาร์ตฟาร์ม',
    command: 'analogRead(A3)'
  },
  {
    name: 'DC Motor Speed / LED Fade (มอเตอร์และไฟหรี่)',
    type: 'Analog (PWM) Output',
    badge: 'PWM Output (~)',
    badgeColor: 'bg-orange-100 text-orange-800',
    image: 'https://www.circuits-diy.com/wp-content/uploads/2022/10/dc-motor-speed-control-circuit.png',
    desc: 'ใช้ขา PWM (มีสัญลักษณ์ ~) ส่งความถี่ Duty Cycle 0 ถึง 255 ควบคุมความเร็วรอบมอเตอร์หรือความสว่างของหลอดไฟอย่างนุ่มนวล',
    command: 'analogWrite(pin, 0-255)'
  }
]

// Mini-game State
const activeGame = ref('sort') // 'sort', 'match', 'quiz'

// Game 1: Drag & Drop (จำแนกหมวดพินบน Arduino)
const dragItemsData = [
  { id: 1, text: 'พิน 0 (RX) และ 1 (TX)', type: 'digital' },
  { id: 2, text: 'พิน ~3, ~5, ~6, ~9, ~10, ~11', type: 'pwm' },
  { id: 3, text: 'พิน A0 - A5 อ่านค่าเซนเซอร์ 0-1023', type: 'analog' },
  { id: 4, text: 'พิน 5V และ 3.3V จ่ายไฟเลี้ยง', type: 'power' },
  { id: 5, text: 'พิน 13 ที่มีไฟ LED บนบอร์ด', type: 'digital' },
  { id: 6, text: 'GND (ขั้วลบ/กราวด์)', type: 'power' }
]

const dragZonesData = [
  {
    id: 'digital',
    title: 'Digital Pins (0-13)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากพินดิจิทัลมาวางที่นี่'
  },
  {
    id: 'pwm',
    title: 'PWM Pins (~)',
    wrapperClass: 'border-orange-400/50 hover:bg-black/40',
    titleClass: 'text-orange-300 border-orange-400/30',
    itemBgClass: 'bg-orange-600/50 border-orange-400',
    emptyTextClass: 'text-orange-200/50',
    emptyText: 'ลากพิน PWM มาวางที่นี่'
  },
  {
    id: 'analog',
    title: 'Analog In (A0-A5)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากพินแอนะล็อกมาวางที่นี่'
  },
  {
    id: 'power',
    title: 'Power & GND',
    wrapperClass: 'border-rose-400/50 hover:bg-black/40',
    titleClass: 'text-rose-300 border-rose-400/30',
    itemBgClass: 'bg-rose-600/50 border-rose-400',
    emptyTextClass: 'text-rose-200/50',
    emptyText: 'ลากพินพลังงานมาวางที่นี่'
  }
]

// Game 2: Matching
const matchLeftTerms = [
  { id: 'l1', text: '1. Microcontroller (ATmega328P)', match: 'r1' },
  { id: 'l2', text: '2. USB Type-B Port', match: 'r2' },
  { id: 'l3', text: '3. Voltage Regulator', match: 'r3' },
  { id: 'l4', text: '4. Analog Pins (A0-A5)', match: 'r4' },
  { id: 'l5', text: '5. PWM Pins (~3, ~5, ~6, ~9, ~10, ~11)', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ชิปสมองกลหลัก ทำหน้าที่ประมวลผลและควบคุมคำสั่งทั้งหมด' },
  { id: 'r2', text: 'ช่องเชื่อมต่อคอมพิวเตอร์สำหรับอัปโหลดโค้ด จ่ายไฟ 5V และสื่อสาร Serial' },
  { id: 'r3', text: 'ตัวควบคุมและลดแรงดันไฟฟ้าจากแหล่งจ่ายภายนอก (7-12V) ให้เหลือ 5V คงที่' },
  { id: 'r4', text: 'พินอ่านค่าแรงดันต่อเนื่อง 0-5V แปลงเป็นตัวเลข 0 ถึง 1023 (10 บิต)' },
  { id: 'r5', text: 'พินดิจิทัลพิเศษที่ส่งสัญญาณความถี่ Duty Cycle จำลองแรงดันหรี่ไฟหรือเร่งมอเตอร์ได้' }
]

// Game 3: แบบทดสอบหลังเรียน Week 1 (Post-test 10 ข้อ 4 ตัวเลือก เน้นคอนเซปต์ Embed, IoT, บอร์ด และอุปกรณ์)
const quizQuestions = [
  {
    id: 1,
    question: 'บอร์ด Arduino Uno R3 ใช้ชิปไมโครคอนโทรลเลอร์ (Microcontroller) รุ่นใดเป็นสมองประมวลผลหลัก?',
    options: [
      { id: 'a', text: 'ATmega328P', isCorrect: true },
      { id: 'b', text: 'Intel Core i5', isCorrect: false },
      { id: 'c', text: 'ESP32-S3', isCorrect: false },
      { id: 'd', text: 'STM32F401', isCorrect: false }
    ],
    explanation: 'บอร์ด Arduino Uno R3 ใช้ไมโครคอนโทรลเลอร์เบอร์ ATmega328P สถาปัตยกรรม 8-bit AVR ของบริษัท Microchip (เดิม Atmel)'
  },
  {
    id: 2,
    question: 'พินแอนะล็อก A0 - A5 บนบอร์ด Arduino Uno R3 มีวงจร ADC ความละเอียดเท่าใด และแปลงแรงดัน 0-5V ออกมาเป็นตัวเลขช่วงใด?',
    options: [
      { id: 'a', text: '8 บิต (0 ถึง 255)', isCorrect: false },
      { id: 'b', text: '10 บิต (0 ถึง 1023)', isCorrect: true },
      { id: 'c', text: '12 บิต (0 ถึง 4095)', isCorrect: false },
      { id: 'd', text: '16 บิต (0 ถึง 65535)', isCorrect: false }
    ],
    explanation: 'Arduino Uno R3 มีตัวแปลงสัญญาณ ADC ขนาด 10 บิต (2^10 = 1024 ค่า) จึงแปลงแรงดันไฟฟ้า 0-5 โวลต์ออกมาเป็นตัวเลข 0 ถึง 1023'
  },
  {
    id: 3,
    question: 'พินดิจิทัลที่มีสัญลักษณ์ตัวหนอน (~) เช่น ขา 3, 5, 6, 9, 10, 11 มีความสามารถพิเศษใด?',
    options: [
      { id: 'a', text: 'รองรับเฉพาะกระแสไฟสลับ 220V เท่านั้น', isCorrect: false },
      { id: 'b', text: 'ปล่อยสัญญาณ PWM (Pulse Width Modulation) จำลองแรงดันแอนะล็อก เช่น หรี่ไฟหรือคุมความเร็วมอเตอร์ได้', isCorrect: true },
      { id: 'c', text: 'ป้องกันไฟฟ้าสถิตและตัดไฟอัตโนมัติ', isCorrect: false },
      { id: 'd', text: 'ใช้ต่อตรงเข้ากับสายอินเทอร์เน็ต LAN', isCorrect: false }
    ],
    explanation: 'พิน PWM ส่งสัญญาณคลื่นสี่เหลี่ยมความถี่สูงสลับ Duty Cycle (0-255) ด้วยคำสั่ง analogWrite() ช่วยจำลองระดับแรงดันแอนะล็อก'
  },
  {
    id: 4,
    question: 'ข้อใดอธิบายความหมายของระบบสมองกลฝังตัว (Embedded System) ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'คอมพิวเตอร์ทั่วไปสำหรับพิมพ์งาน ท่องเว็บ และเล่นเกม', isCorrect: false },
      { id: 'b', text: 'ระบบคอมพิวเตอร์ขนาดเล็กที่ออกแบบมาเพื่อทำงาน "เฉพาะทาง" บรรจุฝังอยู่ในอุปกรณ์เครื่องใช้ต่างๆ', isCorrect: true },
      { id: 'c', text: 'เซิร์ฟเวอร์ขนาดใหญ่ในห้องศูนย์ข้อมูลคลาวด์', isCorrect: false },
      { id: 'd', text: 'โปรแกรมตัดต่อภาพยนตร์ความละเอียดสูง', isCorrect: false }
    ],
    explanation: 'Embedded System คือระบบคอมพิวเตอร์ขนาดเล็กที่มีไมโครโปรเซสเซอร์/ไมโครคอนโทรลเลอร์ ฝังตัวอยู่ในอุปกรณ์เพื่อทำงานเฉพาะด้าน เช่น ระบบแอร์ เบรก ABS ตู้เย็น'
  },
  {
    id: 5,
    question: 'เหตุใดการต่อหลอดไฟ LED เข้ากับพินดิจิทัลของ Arduino จึงต้องต่อตัวต้านทาน (Resistor เช่น 220 โอห์ม) อนุกรมร่วมด้วยเสมอ?',
    options: [
      { id: 'a', text: 'เพื่อเพิ่มความสว่างของหลอดไฟ LED ให้มากเป็นสองเท่า', isCorrect: false },
      { id: 'b', text: 'เพื่อจำกัดกระแสไฟฟ้า (Current Limiting) ไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือพินบอร์ดไหม้', isCorrect: true },
      { id: 'c', text: 'เพื่อแปลงกระแสไฟสลับให้เป็นกระแสตรง', isCorrect: false },
      { id: 'd', text: 'เพื่อเก็บประจุไฟฟ้าไว้สำรองยามไฟตก', isCorrect: false }
    ],
    explanation: 'LED มีความต้านทานภายในต่ำมาก หากต่อตรงกับไฟ 5V กระแสจะพุ่งสูงเกินพิกัดพิน (ปกติไม่เกิน 20-40 mA) จึงต้องมีตัวต้านทานอนุกรมไว้จำกัดกระแส'
  },
  {
    id: 6,
    question: 'หากต้องการอ่านค่าความเข้มแสงจากเซนเซอร์ LDR (Photoresistor) ผ่านขา A0 ของ Arduino ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'digitalRead(A0);', isCorrect: false },
      { id: 'b', text: 'analogRead(A0);', isCorrect: true },
      { id: 'c', text: 'analogWrite(A0, HIGH);', isCorrect: false },
      { id: 'd', text: 'serialRead(A0);', isCorrect: false }
    ],
    explanation: 'การอ่านค่าแอนะล็อกที่มีการเปลี่ยนแปลงระดับแรงดันต่อเนื่อง (0-5V) จากพิน A0-A5 ต้องใช้ฟังก์ชัน analogRead()'
  },
  {
    id: 7,
    question: 'ข้อใดอธิบายแนวคิดหลักของ Internet of Things (IoT) ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'การนำระบบสมองกลฝังตัวและเซนเซอร์มาเชื่อมต่อเข้าสู่โครงข่ายอินเทอร์เน็ต เพื่อส่งข้อมูลขึ้นคลาวด์และควบคุมสั่งการได้จากระยะไกล', isCorrect: true },
      { id: 'b', text: 'การต่อสายแลนระหว่างคอมพิวเตอร์ตั้งโต๊ะสองเครื่อง', isCorrect: false },
      { id: 'c', text: 'การดาวน์โหลดเพลงจากอินเทอร์เน็ตมาเก็บไว้ในแฟลชไดรฟ์', isCorrect: false },
      { id: 'd', text: 'การซ่อมแซมหน้าจอโทรศัพท์มือถือที่แตก', isCorrect: false }
    ],
    explanation: 'IoT คือการขยายขีดความสามารถของระบบสมองกลฝังตัวให้สามารถสื่อสารผ่านอินเทอร์เน็ต ทำให้ส่งข้อมูลเซนเซอร์ขึ้นคลาวด์และสั่งการจากที่ไหนก็ได้ในโลก'
  },
  {
    id: 8,
    question: 'พินดิจิทัลหมายเลข 13 บนบอร์ด Arduino Uno R3 มีคุณลักษณะเฉพาะที่โดดเด่นอย่างไร?',
    options: [
      { id: 'a', text: 'เป็นพินเดียวที่ไม่สามารถจ่ายไฟ 5V ได้', isCorrect: false },
      { id: 'b', text: 'มีไฟ Built-in LED สีส้มต่ออยู่บนตัวบอร์ด สามารถสั่งทดสอบไฟกระพริบได้ทันทีโดยไม่ต้องต่อหลอดภายนอก', isCorrect: true },
      { id: 'c', text: 'ใช้สำหรับรีเซ็ตบอร์ดเท่านั้น ห้ามสั่งงานผ่านโปรแกรม', isCorrect: false },
      { id: 'd', text: 'รองรับกระแสไฟฟ้าได้สูงถึง 10 แอมป์', isCorrect: false }
    ],
    explanation: 'พิน 13 ต่อเข้ากับ LED ดวงจิ๋ว (L) บนบอร์ด ทำให้ผู้เริ่มต้นทดลองสั่ง digitalWrite(13, HIGH) สังเกตไฟติดดับได้ทันที'
  },
  {
    id: 9,
    question: 'อุปกรณ์ข้อใดต่อไปนี้จัดอยู่ในกลุ่ม "อุปกรณ์รับสัญญาณเข้าแบบแอนะล็อก" (Analog Input)?',
    options: [
      { id: 'a', text: 'สวิตช์ปุ่มกด (Pushbutton)', isCorrect: false },
      { id: 'b', text: 'ตัวต้านทานปรับค่าได้ (Potentiometer / วอลลุ่ม)', isCorrect: true },
      { id: 'c', text: 'หลอดไฟ LED', isCorrect: false },
      { id: 'd', text: 'บัซเซอร์ส่งเสียง (Buzzer)', isCorrect: false }
    ],
    explanation: 'ตัวต้านทานปรับค่าได้ (Potentiometer) จ่ายแรงดันไฟฟ้าแปรผัน 0-5V ต่อเนื่องตามองศาการหมุน จัดเป็น Analog Input ส่วน Pushbutton เป็น Digital Input'
  },
  {
    id: 10,
    question: 'ขาพิน GND (Ground) บนบอร์ด Arduino มีความสำคัญอย่างไรในวงจรอิเล็กทรอนิกส์?',
    options: [
      { id: 'a', text: 'เป็นพินที่จ่ายไฟแรงดันสูง 220V', isCorrect: false },
      { id: 'b', text: 'เป็นจุดอ้างอิงแรงดัน 0V (ขั้วลบ) ของวงจร อุปกรณ์ทุกตัวต้องมีสายต่อร่วมกันเพื่อให้กระแสไหลครบวงจร', isCorrect: true },
      { id: 'c', text: 'ใช้รับสัญญาณวิทยุจากเสาอากาศ', isCorrect: false },
      { id: 'd', text: 'ใช้ปรับสัญญาณนาฬิกาของซีพียู', isCorrect: false }
    ],
    explanation: 'GND (Ground) คือขั้วลบหรือจุดอ้างอิง 0V หากไม่ต่อสายกราวด์ร่วมกัน (Common Ground) กระแสจะไม่สามารถไหลครบวงจรและอุปกรณ์จะไม่ทำงาน'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header (Standardized with course theme) -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-amber-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-amber-600">
        <Cpu class="w-[400px] h-[400px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">
          หัวข้อที่ 1
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-amber-900 mb-4 leading-tight">
          บทนำสู่ระบบสมองกลฝังตัว & IoT<br />
          <span class="text-3xl text-amber-700">(Introduction to Embedded Systems & IoT)</span>
        </h1>
        <p class="text-gray-600 text-xl leading-relaxed">
          ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน และเจาะลึกแนวคิดระบบสมองกลฝังตัว (Embedded System),
          อินเทอร์เน็ตของสรรพสิ่ง
          (IoT), กายวิภาคและส่วนประกอบสำคัญของบอร์ด Arduino Uno R3, ระบบสัญญาณดิจิทัลและแอนะล็อก
          พร้อมแนะนำอุปกรณ์และเซนเซอร์พื้นฐาน
        </p>
      </div>
    </div>

    <!-- Check-In System Component -->
    <CheckInSystem :courseId="currentCourseId" :weekNumber="currentWeek" />

    <!-- Course Syllabus Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
          <Book class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">ข้อมูลรายวิชา (Course Syllabus)</h2>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-100 space-y-10">
        <!-- Course Code & Name -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg text-sm shadow-sm">21901-2007</span>
              <span
                class="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm border border-gray-200">1-2-2</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-amber-900">เทคโนโลยีระบบสมองกลฝังตัวและไอโอที</h3>
            <p class="text-gray-500 text-lg">Embedded Systems Technology and IoT</p>
          </div>
        </div>

        <!-- Course Description -->
        <div>
          <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText class="w-5 h-5 text-amber-500" /> คำอธิบายรายวิชา
          </h4>
          <p
            class="text-gray-700 leading-relaxed text-lg bg-amber-50 p-6 md:p-8 rounded-xl border border-amber-100 shadow-inner">
            ศึกษาและฝึกปฏิบัติเกี่ยวกับสถาปัตยกรรมระบบสมองกลฝังตัว (Embedded Systems), การใช้งานไมโครคอนโทรลเลอร์
            (Arduino Uno R3 / ESP32), การต่อวงจรและเชื่อมต่อเซนเซอร์ตรวจวัด (Sensors & Actuators),
            โปรโตคอลการสื่อสารข้อมูล (UART, I2C, SPI), การเชื่อมต่อเครือข่ายไร้สาย Wi-Fi, โปรโตคอล MQTT
            และการพัฒนาแอปพลิเคชัน Internet of Things (IoT) บนคลาวด์แพลตฟอร์ม
          </p>
        </div>

        <!-- Grid for Objectives, Competencies, Outcomes -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Objectives -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-amber-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">จุดประสงค์รายวิชา</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-base flex-1">
              <li>เข้าใจหลักการทำงานของระบบสมองกลฝังตัวและระบบไอโอที (IoT)</li>
              <li>เข้าใจกายวิภาคและหน้าที่ของส่วนประกอบต่างๆ บนบอร์ดไมโครคอนโทรลเลอร์</li>
              <li>จำแนกประเภทสัญญาณดิจิทัล สัญญาณแอนะล็อก และอุปกรณ์เซนเซอร์พื้นฐานได้อย่างถูกต้อง</li>
              <li>มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงาน มีความรับผิดชอบ และคำนึงถึงความปลอดภัย</li>
            </ol>
          </div>

          <!-- Competencies -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-orange-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Award class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">สมรรถนะรายวิชา</h4>
            </div>
            <ol class="list-decimal pl-5 text-gray-600 space-y-3 text-base flex-1">
              <li>แสดงความรู้เกี่ยวกับโครงสร้างและหลักการทำงานของระบบสมองกลฝังตัวและบอร์ดไมโครคอนโทรลเลอร์</li>
              <li>จำแนกและอธิบายหลักการทำงานของอุปกรณ์ Digital, PWM และ Analog ตามที่กำหนด</li>
              <li>ประยุกต์ใช้เทคโนโลยีสมองกลฝังตัวและ IoT ในการสร้างสรรค์นวัตกรรมแก้ไขปัญหา</li>
            </ol>
          </div>

          <!-- Outcomes -->
          <div
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1 bg-teal-500 group-hover:h-2 transition-all"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Lightbulb class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-gray-800">ผลลัพธ์การเรียนรู้ระดับรายวิชา</h4>
            </div>
            <p
              class="text-gray-600 text-base leading-relaxed flex-1 bg-teal-50/50 p-4 rounded-lg border border-teal-100/50">
              วิเคราะห์ความต้องการ ออกแบบสถาปัตยกรรมระบบสมองกลฝังตัวและไอโอที เลือกใช้อุปกรณ์และเซนเซอร์ที่เหมาะสม
              พร้อมนำไปพัฒนาโครงงานประยุกต์ใช้งานจริงได้อย่างเป็นระบบและมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Section (Standardized with other courses) -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
          <PieChart class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เกณฑ์การให้คะแนน (Course Syllabus & Grading)</h2>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-amber-100">

        <!-- Progress Bar Visualization -->
        <div class="flex h-12 rounded-xl overflow-hidden mb-10 shadow-inner group">
          <div v-for="(item, index) in grading" :key="index"
            :class="[item.color, 'h-full flex items-center justify-center text-white text-sm md:text-base font-bold transition-all duration-300 hover:scale-y-110 cursor-pointer']"
            :style="{ width: `${item.score}%` }" :title="item.name">
            {{ item.score }}%
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, index) in grading" :key="index"
            class="flex flex-col gap-3 p-6 rounded-xl border-2 border-gray-50 hover:border-amber-200 hover:bg-amber-50/50 transition-all shadow-sm group">
            <div class="flex items-center justify-between">
              <div
                :class="[item.color, 'w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white font-bold text-lg']">
                {{ item.score }}</div>
            </div>
            <p class="font-bold text-gray-800 text-lg group-hover:text-amber-800 transition-colors">{{ item.name }}</p>
          </div>
        </div>

        <!-- Total Score Prominent -->
        <div class="mt-8 pt-6">
          <div
            class="w-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-6 text-white transform hover:scale-[1.02] transition-transform cursor-default">
            <div class="bg-white/20 p-4 rounded-full">
              <PieChart class="w-10 h-10" />
            </div>
            <div class="text-center sm:text-left">
              <p class="text-amber-100 text-lg font-bold uppercase tracking-wider mb-1">คะแนนรวมทั้งหมด</p>
              <div class="text-5xl font-black drop-shadow-md">100 <span class="text-3xl font-medium">คะแนน</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-bold text-gray-800">เนื้อหาบทเรียน (Lecture Content - 2 Hours)</h2>
      </div>

      <div
        class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-100 space-y-12 text-gray-700 leading-relaxed text-lg">

        <!-- Part 1: Embedded System & IoT -->
        <div>
          <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-6">
            ส่วนที่ 1: ระบบสมองกลฝังตัว (Embedded System) และ IoT คืออะไร?
          </h3>
          <p class="mb-6">
            ในยุคปัจจุบัน เทคโนโลยีได้ก้าวข้ามจากยุคคอมพิวเตอร์ตั้งโต๊ะ (PC Era) และสมาร์ตโฟน (Mobile Era) เข้าสู่ยุคของ
            <strong>Internet of Things (IoT)</strong> และ <strong>AIoT (AI + IoT)</strong>
            ที่สิ่งของเครื่องใช้รอบตัวเราฉลาดขึ้น สามารถรับรู้สภาวะแวดล้อม และสื่อสารโต้ตอบกันเองได้อย่างอัตโนมัติ
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Card 1: Embedded System -->
            <div
              class="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs space-y-4 hover:border-amber-400 transition-colors">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Zap class="w-3.5 h-3.5" />
                <span>Embedded System (สมองกลฝังตัว)</span>
              </div>
              <h4 class="text-xl font-bold text-gray-900">คอมพิวเตอร์ขนาดจิ๋วที่สร้างมาเพื่อ "งานเฉพาะทาง"</h4>
              <p class="text-base text-gray-600 leading-relaxed">
                ไม่ใช่คอมพิวเตอร์ทั่วไป (General Purpose) ที่ใช้พิมพ์เอกสารหรือเล่นเกม
                แต่คือระบบไมโครโปรเซสเซอร์หรือไมโครคอนโทรลเลอร์
                ที่ถูกบรรจุฝังไว้ในอุปกรณ์เครื่องใช้ต่างๆ เพื่อตรวจจับ (Sensors) คำนวณ (Processing) และสั่งการตอบสนอง
                (Actuators) อัตโนมัติ
              </p>
              <div class="bg-white p-4 rounded-xl border border-amber-200/70 text-sm space-y-2 text-amber-950">
                <p class="font-bold flex items-center gap-1.5">
                  <Lightbulb class="w-4 h-4 text-amber-600" /> ตัวอย่างในชีวิตประจำวัน:
                </p>
                <ul class="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>ระบบควบคุมเครื่องปรับอากาศ:</strong> ตรวจวัดอุณหภูมิห้องแล้วสั่งเร่ง/หรี่คอมเพรสเซอร์</li>
                  <li><strong>ระบบเบรก ABS ในรถยนต์:</strong> ตรวจจับการลื่นไถลของล้อเพื่อปรับแรงดันเบรกแบบมิลลิวินาที
                  </li>
                  <li><strong>เตาอบไมโครเวฟ:</strong> ตั้งเวลา วัดน้ำหนัก ควบคุมระดับคลื่นแม่เหล็กไฟฟ้า</li>
                </ul>
              </div>
            </div>

            <!-- Card 2: IoT -->
            <div
              class="p-6 rounded-2xl bg-teal-50/50 border border-teal-200 shadow-xs space-y-4 hover:border-teal-400 transition-colors">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                <Globe class="w-3.5 h-3.5" />
                <span>Internet of Things (IoT)</span>
              </div>
              <h4 class="text-xl font-bold text-gray-900">เมื่อสมองกลฝังตัวเชื่อมต่อเข้าสู่ "โครงข่ายอินเทอร์เน็ต"</h4>
              <p class="text-base text-gray-600 leading-relaxed">
                เป็นการนำระบบสมองกลฝังตัวหลายๆ ชิ้นมาเชื่อมโยงกันผ่านเครือข่ายอินเทอร์เน็ต (ผ่าน Wi-Fi, 4G/5G, LoRaWAN)
                ทำให้อุปกรณ์สามารถ <strong>"ส่งข้อมูลขึ้นคลาวด์"</strong> และเปิดโอกาสให้เรา
                <strong>"ตรวจสอบและสั่งการข้ามโลก"</strong> ผ่านสมาร์ตโฟนได้ทุกที่ทุกเวลา
              </p>
              <div class="bg-white p-4 rounded-xl border border-teal-200/70 text-sm space-y-2 text-teal-950">
                <p class="font-bold flex items-center gap-1.5">
                  <Radio class="w-4 h-4 text-teal-600" /> ทำไมถึงต้องเรียนเรื่องนี้ในปัจจุบัน?
                </p>
                <ul class="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>Smart Home & Building:</strong> สั่งเปิดแอร์ล่วงหน้าก่อนถึงบ้าน,
                    เซนเซอร์ไฟไหม้แจ้งเตือนเข้า LINE</li>
                  <li><strong>Smart Agriculture (เกษตรแม่นยำ):</strong> รดน้ำพืชอัตโนมัติตามความชื้นในดินและพยากรณ์อากาศ
                  </li>
                  <li><strong>Smart Industry 4.0:</strong> โรงงานอัตโนมัติ ติดตามสถานะเครื่องจักร
                    ป้องกันเครื่องจักรชำรุด</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 3 Pillars of IoT Diagram -->
          <div class="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80">
            <h4 class="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
              <Layers class="w-5 h-5 text-amber-600" /> 3 องค์ประกอบหลักของระบบสมองกลฝังตัวและไอโอที (Three Core Stages)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
                <div class="flex items-center gap-2 text-emerald-700 font-bold">
                  <ArrowDownToLine class="w-5 h-5" />
                  <span>1. ตรวจจับข้อมูล (Sensors / Input)</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  รับสัญญาณการเปลี่ยนแปลงทางกายภาพรอบตัว เช่น แสง, อุณหภูมิ, การเคลื่อนไหว, ความชื้น
                  แปลงเป็นสัญญาณไฟฟ้าส่งให้สมองกล
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
                <div class="flex items-center gap-2 text-amber-700 font-bold">
                  <Cpu class="w-5 h-5" />
                  <span>2. ประมวลผลและตัดสินใจ (Processing)</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  ไมโครคอนโทรลเลอร์ (Arduino / ESP32) นำข้อมูลที่ได้มาคำนวณตามตรรกะโค้ด
                  และส่งข้อมูลผ่านเครือข่ายอินเทอร์เน็ตขึ้นสู่ระบบคลาวด์
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
                <div class="flex items-center gap-2 text-blue-700 font-bold">
                  <ArrowUpFromLine class="w-5 h-5" />
                  <span>3. สั่งการและแสดงผล (Actuators / Output)</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  ส่งคำสั่งควบคุมไปยังอุปกรณ์ขับเคลื่อนจริง เช่น สั่งเปิดรีเลย์สวิตช์ไฟ, หมุนมอเตอร์ปั๊มน้ำ,
                  ขับเสียงเตือนไซเรน หรือแสดงผลบนหน้าจอ
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2: Arduino Uno R3 Anatomy & Diagram -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-6">
            ส่วนที่ 2: กายวิภาคและส่วนประกอบของบอร์ด Arduino Uno R3
          </h3>

          <div class="bg-stone-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span
                  class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  ฮาร์ดแวร์มาตรฐานสำหรับการศึกษา
                </span>
                <h4 class="text-2xl font-black text-white mt-2">Arduino Uno R3 Key Components</h4>
              </div>
              <p class="text-xs text-stone-400 max-w-md">
                สำรวจตำแหน่ง หน้าที่ และการทำงานของ 8 ส่วนประกอบสำคัญบนบอร์ด Arduino Uno R3 ตามหมายเลขที่ระบุในแผนภาพ
              </p>
            </div>

            <!-- Board Diagram Image (Using /img/Arduino.png) -->
            <div
              class="rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-black/60 p-3 sm:p-6 flex items-center justify-center">
              <img src="/img/Arduino.png" alt="กายวิภาคและส่วนประกอบของบอร์ด Arduino Uno R3"
                class="w-full max-w-3xl h-auto object-contain mx-auto rounded-xl drop-shadow-xl" />
            </div>

            <!-- 8 Key Components Grid (Matching Image Labels 1 - 8) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div v-for="c in arduinoComponents" :key="c.num"
                class="p-4 rounded-2xl border transition-all space-y-2 hover:bg-white/10" :class="c.color">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-sm"
                    :class="c.badgeColor">
                    {{ c.num }}
                  </span>
                  <div>
                    <h5 class="font-bold text-sm flex items-center gap-1.5 text-white">
                      <component :is="c.icon" class="w-4 h-4 shrink-0" />
                      {{ c.name }}
                    </h5>
                    <span class="text-[10px] text-stone-400 font-mono">{{ c.eng }}</span>
                  </div>
                </div>

                <p class="text-stone-300 leading-relaxed text-xs">
                  {{ c.desc }}
                </p>

                <div class="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-stone-400">
                  <p v-for="(b, bIdx) in c.bullets" :key="bIdx">
                    • {{ b }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 3: Digital vs Analog Pin Deep Dive -->
        <div class="pt-8 border-t border-gray-100 space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-2">
              ส่วนที่ 3: ความแตกต่างระหว่าง Digital Pin และ Analog Pin (Digital vs Analog Deep Dive)
            </h3>
            <p class="text-base text-gray-600">
              ทำความเข้าใจความแตกต่างของสัญญาณทางกายภาพ รูปแบบคำสั่งการใช้งาน Input/Output การเปรียบเทียบในสถานการณ์จริง
              พร้อมตัวอย่างอุปกรณ์และเซนเซอร์ที่ใช้งานในระบบสมองกลฝังตัว
            </p>
          </div>

          <!-- Infographic Showcase Card (Digital_Analog.png) -->
          <div class="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span
                  class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  แผนภาพสรุปเปรียบเทียบ (Infographic Guide)
                </span>
                <h4 class="text-2xl font-black text-white mt-2">Digital Signal vs Analog Signal</h4>
              </div>
              <p class="text-xs text-stone-400 max-w-md">
                แผนภาพแสดงความแตกต่างระหว่างพินดิจิทัล (0 และ 1) กับพินแอนะล็อก (0 ถึง 1023 / 0 ถึง 255) ทั้งโหมดรับค่า
                (Input) และโหมดส่งค่า (Output)
              </p>
            </div>

            <div
              class="rounded-2xl overflow-hidden border border-slate-700 bg-white p-3 sm:p-5 flex items-center justify-center shadow-inner">
              <img src="/img/Digital_Analog.png" alt="แผนภาพเปรียบเทียบ Digital Pin vs Analog Pin ทั้ง Input และ Output"
                class="w-full max-w-3xl h-auto object-contain mx-auto rounded-lg shadow-sm" />
            </div>
            <p class="text-xs text-stone-400 text-center">
              แผนภาพเปรียบเทียบสัญญาณ Digital (สี่เหลี่ยม 0/1) และ Analog (คลื่นต่อเนื่อง) พร้อมรูปแบบคำสั่งใน Arduino
            </p>
          </div>

          <!-- Core Differences Comparison (2 Columns: Digital vs Analog) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Digital Column -->
            <div class="p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 space-y-4 shadow-xs">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                  <ToggleRight class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-lg font-black text-amber-950">DIGITAL PINS (สัญญาณดิจิทัล)</h4>
                  <span class="text-xs font-bold text-amber-700 font-mono">มีเพียง 2 สถานะ: 0 (LOW) หรือ 1 (HIGH)</span>
                </div>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed">
                สัญญาณดิจิทัลมีลักษณะเป็น <strong>คลื่นสี่เหลี่ยม (Square Wave)</strong> ที่ไม่ต่อเนื่อง (Discrete)
                แปลผลได้เพียง 2 ระดับ คือ <strong>0 โวลต์ (LOW)</strong> และ <strong>5 โวลต์ (HIGH)</strong>
                ไม่มีค่าครึ่งๆ กลางๆ
              </p>

              <div class="space-y-2 text-xs">
                <div class="p-3 rounded-xl bg-white border border-amber-200/60 space-y-1">
                  <span class="font-bold text-emerald-700 flex items-center gap-1.5">
                    <ArrowDownToLine class="w-4 h-4 shrink-0" />
                    <span>1. Digital Input (รับสัญญาณ)</span>
                  </span>
                  <p class="text-gray-600">
                    ใช้คำสั่ง <code class="font-mono bg-amber-100 text-amber-900 px-1 rounded">digitalRead(pin)</code>
                    คืนค่าเป็นตัวเลข <strong>0</strong> หรือ <strong>1</strong> เช่น ตรวจสอบว่าปุ่มกดถูกกดอยู่หรือไม่
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-white border border-amber-200/60 space-y-1">
                  <span class="font-bold text-blue-700 flex items-center gap-1.5">
                    <ArrowUpFromLine class="w-4 h-4 shrink-0" />
                    <span>2. Digital Output (ส่งสัญญาณ)</span>
                  </span>
                  <p class="text-gray-600">
                    ใช้คำสั่ง <code
                      class="font-mono bg-amber-100 text-amber-900 px-1 rounded">digitalWrite(pin, 1 หรือ 0)</code>
                    จ่ายไฟ 5V (เปิดเต็มที่) หรือตัดไฟ 0V (ดับสนิท)
                  </p>
                </div>
              </div>
            </div>

            <!-- Analog Column -->
            <div class="p-6 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200/80 space-y-4 shadow-xs">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <SlidersHorizontal class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-lg font-black text-emerald-950">ANALOG PINS (สัญญาณแอนะล็อก)</h4>
                  <span class="text-xs font-bold text-emerald-700 font-mono">ค่าต่อเนื่อง: 0 ถึง 1023 (In) / 0 ถึง 255
                    (PWM Out)</span>
                </div>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed">
                สัญญาณแอนะล็อกมีลักษณะเป็น <strong>คลื่นต่อเนื่อง (Continuous Wave)</strong> แรงดันสามารถค่อยๆ
                เปลี่ยนแปลงได้ตั้งแต่ <strong>0.0 ถึง 5.0 โวลต์</strong> ละเอียดนับพันระดับ
              </p>

              <div class="space-y-2 text-xs">
                <div class="p-3 rounded-xl bg-white border border-emerald-200/60 space-y-1">
                  <span class="font-bold text-purple-700 flex items-center gap-1.5">
                    <ArrowDownToLine class="w-4 h-4 shrink-0" />
                    <span>1. Analog Input (ขา A0-A5)</span>
                  </span>
                  <p class="text-gray-600">
                    ใช้คำสั่ง <code
                      class="font-mono bg-emerald-100 text-emerald-900 px-1 rounded">analogRead(pin)</code> แปลงแรงดัน
                    0-5V เป็นตัวเลข <strong>0 ถึง 1023</strong> (ADC 10 บิต)
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-white border border-emerald-200/60 space-y-1">
                  <span class="font-bold text-orange-700 flex items-center gap-1.5">
                    <ArrowUpFromLine class="w-4 h-4 shrink-0" />
                    <span>2. Analog Output (PWM ขา ~)</span>
                  </span>
                  <p class="text-gray-600">
                    ใช้คำสั่ง <code
                      class="font-mono bg-emerald-100 text-emerald-900 px-1 rounded">analogWrite(pin, 0-255)</code>
                    จำลองแรงดันโดยปรับ Duty Cycle 0 ถึง 255 เพื่อหรี่ไฟหรือคุมมอเตอร์
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-world Scenarios Comparison -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Lightbulb class="w-5 h-5 text-amber-600" />
              <h4 class="text-xl font-black text-gray-900">ตัวอย่างสถานการณ์จริงที่ใช้งานต่างกัน (Real-World Scenarios)
              </h4>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div v-for="s in scenarios" :key="s.title"
                class="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 hover:border-amber-300 transition-all flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <component :is="s.icon" class="w-5 h-5 text-amber-600 shrink-0" />
                    <h5 class="font-bold text-gray-900 text-sm">{{ s.title }}</h5>
                  </div>

                  <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                    <span
                      class="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">Digital
                      Mode</span>
                    <p class="text-xs font-bold text-amber-950">{{ s.digital.title }}</p>
                    <p class="text-[11px] text-gray-600 leading-relaxed">{{ s.digital.desc }}</p>
                  </div>

                  <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                    <span
                      class="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">Analog
                      Mode</span>
                    <p class="text-xs font-bold text-emerald-950">{{ s.analog.title }}</p>
                    <p class="text-[11px] text-gray-600 leading-relaxed">{{ s.analog.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 4: Basic Hardware Components & Devices Introduction -->
        <div class="pt-8 border-t border-gray-100 space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-2">
              ส่วนที่ 4: แนะนำอุปกรณ์และชิ้นส่วนอิเล็กทรอนิกส์พื้นฐาน (Basic Hardware & Components)
            </h3>
            <p class="text-base text-gray-600">
              ทำความรู้จักอุปกรณ์พื้นฐานที่จำเป็นในการประกอบวงจรสมองกลฝังตัว เช่น แผงต่อวงจร Breadboard, ตัวต้านทาน
              Resistor, หลอดไฟ LED พร้อมจำแนกเซนเซอร์และอุปกรณ์ตรวจวัดยอดนิยม
            </p>
          </div>

          <!-- Basic Circuit Components (Breadboard, Resistor, LED) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div v-for="comp in basicComponents" :key="comp.name"
              class="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">

              <div>
                <!-- Image Container with fixed W & H, object-cover, overflow-hidden -->
                <div
                  class="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/img mb-3">
                  <img :src="comp.image" :alt="comp.name"
                    class="w-full h-full object-cover object-center transition-transform duration-300 group-hover/img:scale-105"
                    loading="lazy" />
                </div>

                <div class="flex items-center justify-between mb-2">
                  <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <component :is="comp.icon" class="w-5 h-5" />
                  </div>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full" :class="comp.badgeColor">
                    {{ comp.badge }}
                  </span>
                </div>

                <h4 class="font-black text-gray-900 text-base">{{ comp.name }}</h4>
                <p class="text-xs text-amber-700 font-medium mb-1.5">{{ comp.role }}</p>
                <p class="text-xs text-gray-600 leading-relaxed">{{ comp.desc }}</p>
              </div>

              <div class="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-600">
                <p v-for="(pt, ptIdx) in comp.keyPoints" :key="ptIdx" class="flex items-start gap-1.5">
                  <span class="text-amber-500 font-bold shrink-0">•</span>
                  <span>{{ pt }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Arduino Devices & Sensors Showcase (Digital & Analog) -->
          <div class="space-y-6 pt-2">
            <div>
              <h4 class="text-xl font-black text-gray-900 flex items-center gap-2">
                <Cpu class="w-5 h-5 text-amber-600" />
                ตัวอย่างอุปกรณ์และเซนเซอร์ที่ใช้งานร่วมกับบอร์ด Arduino
              </h4>
              <p class="text-xs text-gray-500 mt-1">
                จำแนกอุปกรณ์ยอดนิยมในการสร้างโครงงาน ทั้งฝั่งดิจิทัล (Input/Output) และฝั่งแอนะล็อก (Sensors/PWM)
              </p>
            </div>

            <!-- Digital Devices Section -->
            <div class="space-y-3">
              <h5 class="font-bold text-sm text-amber-900 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                อุปกรณ์ที่ใช้ Digital Pin (พิน 0 ถึง 13)
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="d in digitalDevices" :key="d.name"
                  class="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between">
                  <div>
                    <!-- Image Container with fixed W & H, object-cover, overflow-hidden -->
                    <div
                      class="w-full h-56 sm:h-60 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/img mb-2.5">
                      <img :src="d.image" :alt="d.name"
                        class="w-full h-full object-cover object-center transition-transform duration-300 group-hover/img:scale-105"
                        loading="lazy" />
                    </div>

                    <div class="flex items-start justify-between gap-2 mb-1">
                      <span class="font-bold text-gray-900 text-xs">{{ d.name }}</span>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="d.badgeColor">
                        {{ d.badge }}
                      </span>
                    </div>
                    <p class="text-[11px] text-gray-600 leading-relaxed">{{ d.desc }}</p>
                  </div>
                  <div
                    class="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>คำสั่งที่เกี่ยวข้อง:</span>
                    <code class="text-amber-800 bg-amber-50 px-1 rounded">{{ d.command }}</code>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analog Devices Section -->
            <div class="space-y-3">
              <h5 class="font-bold text-sm text-emerald-900 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                อุปกรณ์ที่ใช้ Analog Pin (พิน A0 ถึง A5 และ PWM ~)
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="d in analogDevices" :key="d.name"
                  class="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3 hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between">
                  <div>
                    <!-- Image Container with fixed W & H, object-cover, overflow-hidden -->
                    <div
                      class="w-full h-56 sm:h-60 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/img mb-2.5">
                      <img :src="d.image" :alt="d.name"
                        class="w-full h-full object-cover object-center transition-transform duration-300 group-hover/img:scale-105"
                        loading="lazy" />
                    </div>

                    <div class="flex items-start justify-between gap-2 mb-1">
                      <span class="font-bold text-gray-900 text-xs">{{ d.name }}</span>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="d.badgeColor">
                        {{ d.badge }}
                      </span>
                    </div>
                    <p class="text-[11px] text-gray-600 leading-relaxed">{{ d.desc }}</p>
                  </div>
                  <div
                    class="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>คำสั่งที่เกี่ยวข้อง:</span>
                    <code class="text-emerald-800 bg-emerald-50 px-1 rounded">{{ d.command }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Matrix Table -->
          <div class="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <h4 class="text-lg font-black flex items-center gap-2 text-amber-400">
              <LayoutGrid class="w-5 h-5" /> ตารางสรุปการจำแนกประเภทอุปกรณ์ (Hardware Matrix)
            </h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left text-slate-300">
                <thead class="text-amber-300 uppercase bg-slate-800 text-[11px]">
                  <tr>
                    <th class="px-4 py-3 rounded-l-lg">ประเภทสัญญาณ</th>
                    <th class="px-4 py-3">โหมดรับค่า (Input)</th>
                    <th class="px-4 py-3">โหมดส่งค่า (Output)</th>
                    <th class="px-4 py-3 rounded-r-lg">ช่วงค่า / ระดับแรงดัน</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  <tr class="hover:bg-slate-800/50">
                    <td class="px-4 py-3 font-bold text-amber-400">Digital</td>
                    <td class="px-4 py-3">Pushbutton, PIR Sensor, Limit Switch</td>
                    <td class="px-4 py-3">LED, Active Buzzer, Relay Module</td>
                    <td class="px-4 py-3 font-mono text-cyan-300">0 หรือ 1 (0V หรือ 5V)</td>
                  </tr>
                  <tr class="hover:bg-slate-800/50">
                    <td class="px-4 py-3 font-bold text-emerald-400">Analog</td>
                    <td class="px-4 py-3">Potentiometer, LDR, LM35 Temp Sensor</td>
                    <td class="px-4 py-3">LED Fade (PWM), DC Motor Speed (~Pins)</td>
                    <td class="px-4 py-3 font-mono text-emerald-300">0-1023 (In) / 0-255 (PWM Out)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Interactive Game Center -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ & แบบทดสอบหลังเรียน
            </h2>
            <p class="text-sm text-gray-500 mt-0.5">เล่นได้ครั้งเดียวเท่านั้น ระบบจะบันทึกคะแนนและหารเฉลี่ยรวมเต็ม 10
              คะแนน</p>
          </div>
        </div>

        <!-- Teacher Scoreboard Button -->
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-900 to-orange-900 hover:from-amber-800 hover:to-orange-800 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 border border-amber-700 shrink-0">
          <FileSpreadsheet class="w-4 h-4 text-amber-400" />
          <span>ดูตารางคะแนนมินิเกม (สำหรับคุณครู)</span>
        </button>
      </div>

      <!-- Student Score Summary Banner -->
      <div class="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span class="text-xs font-bold text-amber-600 uppercase tracking-wider block">สรุปคะแนนของคุณประจำสัปดาห์ที่
              1</span>
            <div class="text-lg font-black text-gray-800 mt-0.5 flex items-center gap-2">
              <span>สถานะ:</span>
              <span v-if="studentNorm.isAllCompleted"
                class="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ ทำครบทุกกิจกรรมแล้ว (3/3)
              </span>
              <span v-else-if="studentNorm.completedCount > 0"
                class="text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⏳ กำลังทำ ({{ studentNorm.completedCount }}/3 กิจกรรม)
              </span>
              <span v-else
                class="text-gray-500 text-sm font-medium bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                ยังไม่ได้เริ่มทำ
              </span>
            </div>
          </div>

          <!-- Total Normalized Score (Scaled to 10) -->
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 rounded-xl border border-amber-100">
            <Trophy class="w-7 h-7 text-amber-500 shrink-0" />
            <div>
              <span class="text-xs text-amber-900 font-semibold block">คะแนนรวมทั้งหมด (หารเฉลี่ยเต็ม 10)</span>
              <div class="text-xl font-black text-amber-950 leading-tight">
                <span>{{ studentNorm.normalized }}</span>
                <span class="text-xs font-bold text-gray-400"> / 10.0 คะแนน</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 Activity Status Badges -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium">
          <!-- Game 1 -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-1'] ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">1. จำแนกพิน Arduino Uno</span>
              <span class="text-[11px] text-gray-500">เต็ม 6 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-1'] ? `${studentWeekScores['game-1'].score} / 6` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Game 2 -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['game-2'] ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">2. จับคู่คำศัพท์สมองกลฝังตัว</span>
              <span class="text-[11px] text-gray-500">เต็ม 5 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['game-2'] ? `${studentWeekScores['game-2'].score} / 5` : 'ยังไม่ได้เล่น' }}
            </span>
          </div>

          <!-- Post-test -->
          <div :class="[
            'p-3 rounded-xl border flex items-center justify-between',
            studentWeekScores['quiz'] ? 'bg-orange-50/70 border-orange-200 text-orange-900' : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div>
              <span class="font-bold block">3. แบบทดสอบหลังเรียน 10 ข้อ</span>
              <span class="text-[11px] text-gray-500">เต็ม 10 คะแนน</span>
            </div>
            <span class="font-black text-sm">
              {{ studentWeekScores['quiz'] ? `${studentWeekScores['quiz'].score} / 10` : 'ยังไม่ได้ทำ' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Game Tabs -->
      <div class="flex flex-wrap gap-3">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort' ? 'bg-amber-600 text-white shadow-lg scale-105' : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <MousePointer2 class="w-4 h-4" />
          <span>มินิเกมที่ 1: จำแนกพิน Arduino</span>
          <span v-if="studentWeekScores['game-1']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <ListOrdered class="w-4 h-4" />
          <span>มินิเกมที่ 2: จับคู่คำศัพท์สมองกล</span>
          <span v-if="studentWeekScores['game-2']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz' ? 'bg-orange-600 text-white shadow-lg scale-105' : 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200',
          'px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer'
        ]">
          <FileQuestion class="w-4 h-4" />
          <span>กิจกรรมสุดท้าย: แบบทดสอบหลังเรียน (Post-test 10 ข้อ)</span>
          <span v-if="studentWeekScores['quiz']" class="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">✓
            บันทึกแล้ว</span>
        </button>
      </div>

      <!-- Game 1: Drag & Drop -->
      <DragDropGame v-if="activeGame === 'sort'" :course-id="currentCourseId" :week="currentWeek" game-id="game-1"
        game-title="เกมลากวาง: จำแนกประเภทพิน Arduino Uno R3" title="จำแนกประเภทพินและช่องเสียบของบอร์ด Arduino Uno R3"
        subtitle="ลากชื่อพินและหน้าที่ไปใส่ในหมวดหมู่ที่ถูกต้องให้ครบ!" :initialItems="dragItemsData"
        :zones="dragZonesData" />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'" :course-id="currentCourseId" :week="currentWeek" game-id="game-2"
        game-title="เกมจับคู่: คำศัพท์และหน้าที่สำคัญของระบบสมองกล" title="คำศัพท์และหน้าที่สำคัญของระบบสมองกล"
        subtitle="จับคู่คำศัพท์ด้านซ้ายกับความหมายและหน้าที่ด้านขวาให้ถูกต้องครบทั้ง 5 คู่"
        :initialLeftTerms="matchLeftTerms" :initialRightDefs="matchRightDefs" />

      <!-- Game 3: Pop Quiz (Post-test) -->
      <PopQuiz v-if="activeGame === 'quiz'" :course-id="currentCourseId" :week="currentWeek" game-id="quiz"
        game-title="แบบทดสอบหลังเรียน Week 1 (IoT & Arduino Hardware)"
        title="แบบทดสอบหลังเรียน: สัปดาห์ที่ 1 (Embedded Systems, IoT & Hardware)"
        subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจรอบด้าน ทำได้เพียงครั้งเดียวเท่านั้น"
        :questions="quizQuestions">
        <template #actions>
          <RouterLink to="/courses"
            class="px-8 py-4 bg-amber-600 border-2 border-amber-500 text-white font-bold rounded-xl hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2">
            กลับสู่หน้ารายวิชา
          </RouterLink>
        </template>
      </PopQuiz>
    </section>

    <!-- Assignment Section -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-1"
      assignment-title="ใบงานที่ 1: ระบบสมองกลฝังตัว & IoT และสถาปัตยกรรมบอร์ด Arduino Uno R3" :max-score="10">
      <template #number>1</template>
      <template #description>
        ให้นักศึกษาสรุปความรู้เกี่ยวกับแนวคิดระบบสมองกลฝังตัว (Embedded System), สถาปัตยกรรม IoT,
        ชี้ระบุส่วนประกอบสำคัญของบอร์ด Arduino Uno R3 และจำแนกอุปกรณ์เซนเซอร์พื้นฐาน
      </template>
      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>ข้อที่ 1 (คอนเซปต์):</strong> อธิบายความหมายของระบบสมองกลฝังตัว (Embedded System)
            ต่างจากคอมพิวเตอร์ทั่วไป (General Purpose PC) อย่างไร พร้อมยกตัวอย่างอุปกรณ์ในชีวิตประจำวัน 3 ชิ้น</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>ข้อที่ 2 (IoT):</strong> อธิบาย 3 องค์ประกอบหลักของระบบ IoT (Sensors/Input, Processing,
            Actuators/Output) และอธิบายประโยชน์ของการนำอุปกรณ์เชื่อมต่ออินเทอร์เน็ต</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>ข้อที่ 3 (แนะนำบอร์ด):</strong> ชี้ระบุตำแหน่งและหน้าที่ของ 8 ส่วนประกอบหลักบนบอร์ด Arduino Uno
            R3 ตามแผนภาพกายวิภาค (เช่น ATmega328P, พินดิจิทัล, พินแอนะล็อก, GND, 5V)</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>ข้อที่ 4 (แนะนำอุปกรณ์):</strong> จำแนกอุปกรณ์ 4 ชนิด (สวิตช์ปุ่มกด, หลอด LED, วอลลุ่ม
            Potentiometer, เซนเซอร์แสง LDR) ว่าเป็น Digital หรือ Analog และเป็น Input หรือ Output</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>จัดทำเอกสารสรุปเป็นไฟล์ PDF หรือภาพ Infographic อัปโหลดขึ้น Google Drive พร้อมเปิดสิทธิ์แชร์สาธารณะ
            แล้วนำ URL มาส่งในปุ่ม <strong>ส่งงานด้วยลิงก์</strong> ด้านล่าง</span>
        </li>

        <!-- PDF Example Button Card -->
        <div class="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-amber-600" /> ต้องการดูตัวอย่างการเขียนใบงานที่ 1?
            </h5>
            <p class="text-xs text-gray-500 mt-0.5">
              กดเปิดดูตัวอย่างการเขียนใบงานที่ 1 ฉบับสมบูรณ์ (รูปแบบเอกสารมาตรฐานทางการ ขนาด A4)
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="showPdfModal = true" type="button"
              class="px-5 py-3 rounded-2xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer">
              <FileText class="w-4 h-4 text-amber-200" />
              <span>เปิดดูตัวอย่างใบงาน (PDF Preview)</span>
            </button>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Assignment PDF Modal for IoT Week 1 (Multi-page A4 Skeleton Template) -->
    <AssignmentPdfModal
      v-model="showPdfModal"
      title="โครงร่างแบบฟอร์ม_ใบงานที่_1_ระบบสมองกลฝังตัวและสถาปัตยกรรมบอร์ดArduinoUno_ปวช.pdf"
      subtitle="โครงร่างแบบฟอร์มเอกสารทางการ ขนาด A4 (จำนวน 2 หน้า)"
      footer-text="โครงร่างแบบฟอร์มมาตรฐาน ขนาด A4 • รายวิชาเทคโนโลยีระบบสมองกลฝังตัวและไอโอที (21901-2007)"
      :show-print="true"
      :multi-page="true"
    >
      <!-- ========================================================= -->
      <!-- แผ่นที่ 1: ตอนที่ 1 และ ตอนที่ 2 (หน้า 1 จาก 2)            -->
      <!-- ========================================================= -->
      <div
        class="printable-a4-sheet bg-white text-gray-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-11 shadow-2xl border border-gray-300 flex flex-col justify-between text-xs sm:text-sm font-sans box-border relative"
        style="background-color: #ffffff !important; color: #111827 !important;"
      >
        <div class="space-y-4">
          <!-- Page 1 Header -->
          <div class="border-b-2 border-black pb-3 text-center space-y-1 relative">
            <span class="absolute top-0 right-0 px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-[10px] font-mono text-gray-600">
              หน้า 1 / 2
            </span>
            <h2 class="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              ใบงานที่ 1: ระบบสมองกลฝังตัว & IoT และสถาปัตยกรรมบอร์ด Arduino Uno R3
            </h2>
          </div>

          <!-- Student Meta Line (Form Placeholders) -->
          <div
            class="py-2 text-xs text-gray-900 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
            <span><strong>ชื่อ-นามสกุล:</strong> [ ระบุชื่อ - นามสกุล นักศึกษา ]</span>
            <span><strong>รหัสนักศึกษา:</strong> [ ระบุรหัสประจำตัว ]</span>
            <span><strong>ระดับชั้น:</strong> ปวช.3/2</span>
          </div>

          <!-- Instructions Box -->
          <div class="bg-amber-50/70 p-2.5 rounded border border-amber-200 text-xs text-amber-950 leading-relaxed">
            <strong>คำชี้แจง:</strong> ให้นักศึกษาจัดทำรายงานผลการปฏิบัติงานตามโครงสร้างแบบฟอร์มที่กำหนดทั้ง 4 ตอนให้ครบถ้วน โดยพิมพ์หรือเขียนสรุปเนื้อหาลงในพื้นที่ที่จัดเตรียมไว้ พร้อมจัดรูปแบบเอกสารให้เรียบร้อยสวยงาม
          </div>

          <!-- Section 1: Embedded System vs PC -->
          <div class="space-y-2 pt-1">
            <div class="border-b border-gray-200 pb-1">
              <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
                ตอนที่ 1: คอนเซปต์ระบบสมองกลฝังตัว (Embedded System) vs คอมพิวเตอร์ทั่วไป (General-Purpose PC)
              </h4>
            </div>

            <div class="text-xs text-gray-800 space-y-2">
              <div>
                <span class="font-semibold text-gray-900 block mb-1">1.1 ความหมายและนิยามของระบบสมองกลฝังตัว:</span>
                <div class="p-2.5 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500 italic text-[11px] leading-relaxed">
                  [พื้นที่สำหรับพิมพ์/เขียนสรุป]: อธิบายความหมายของระบบสมองกลฝังตัว (Embedded System) และชี้ให้เห็นว่าแตกต่างจากคอมพิวเตอร์ทั่วไป (General Purpose PC) อย่างไรในแง่ของสถาปัตยกรรมและเป้าหมายการทำงาน...
                </div>
              </div>

              <div>
                <span class="font-semibold text-gray-900 block mb-1">1.2 ตารางเปรียบเทียบความแตกต่าง 3 มิติ:</span>
                <table class="w-full border-collapse border border-gray-300 text-[11px]">
                  <thead>
                    <tr class="bg-gray-100 text-gray-800">
                      <th class="border border-gray-300 p-1.5 text-left w-1/4">มิติเปรียบเทียบ</th>
                      <th class="border border-gray-300 p-1.5 text-left w-3/8">ระบบสมองกลฝังตัว (Embedded System)</th>
                      <th class="border border-gray-300 p-1.5 text-left w-3/8">คอมพิวเตอร์ทั่วไป (General PC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border border-gray-300 p-1.5 font-semibold">1. วัตถุประสงค์ (Purpose)</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุการทำงานเฉพาะทาง (Dedicated Task)...]</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุการทำงานอเนกประสงค์ (General Purpose)...]</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border border-gray-300 p-1.5 font-semibold">2. ระบบปฏิบัติการ (OS)</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุระดับ Firmware / RTOS / Bare-metal...]</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุ OS ขนาดใหญ่ เช่น Windows, macOS...]</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 p-1.5 font-semibold">3. พลังงานและทรัพยากร</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุการกินไฟ แรม และหน่วยประมวลผล...]</td>
                      <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุการกินไฟ แรม GB และหน่วยประมวลผล...]</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <span class="font-semibold text-gray-900 block mb-1">1.3 ตัวอย่างอุปกรณ์สมองกลฝังตัวในชีวิตประจำวัน 3 ชิ้น:</span>
                <div class="space-y-1.5 pl-2 text-[11px] text-gray-700">
                  <p>• <strong>อุปกรณ์ชิ้นที่ 1:</strong> [ระบุชื่ออุปกรณ์ เช่น เครื่องซักผ้าอัตโนมัติ] — <em>(หน้าที่การทำงาน: [ระบุเซนเซอร์/ไมโครคอนโทรลเลอร์ที่ใช้ควบคุม]...)</em></p>
                  <p>• <strong>อุปกรณ์ชิ้นที่ 2:</strong> [ระบุชื่ออุปกรณ์ เช่น ไมโครเวฟดิจิทัล] — <em>(หน้าที่การทำงาน: [ระบุเซนเซอร์/ไมโครคอนโทรลเลอร์ที่ใช้ควบคุม]...)</em></p>
                  <p>• <strong>อุปกรณ์ชิ้นที่ 3:</strong> [ระบุชื่ออุปกรณ์ เช่น เครื่องปรับอากาศ Inverter] — <em>(หน้าที่การทำงาน: [ระบุเซนเซอร์/ไมโครคอนโทรลเลอร์ที่ใช้ควบคุม]...)</em></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: IoT 3-stage Architecture -->
          <div class="space-y-2 pt-1">
            <div class="border-b border-gray-200 pb-1">
              <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
                ตอนที่ 2: สถาปัตยกรรม 3 องค์ประกอบหลักของระบบ IoT และประโยชน์เครือข่ายอินเทอร์เน็ต
              </h4>
            </div>

            <div class="text-xs text-gray-800 space-y-2">
              <span class="font-semibold text-gray-900 block">2.1 โครงสร้าง 3 องค์ประกอบหลัก:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="p-2.5 rounded border border-blue-200 bg-blue-50/50">
                  <span class="font-bold text-blue-900 block text-xs">1. Sensors (Input Layer)</span>
                  <p class="text-[11px] text-blue-700 italic mt-1 leading-relaxed">
                    [ระบุหน้าที่ตรวจวัดสภาพแวดล้อมกายภาพ และยกตัวอย่างเซนเซอร์อย่างน้อย 2 ชนิด]
                  </p>
                </div>
                <div class="p-2.5 rounded border border-amber-200 bg-amber-50/50">
                  <span class="font-bold text-amber-900 block text-xs">2. Processing Unit (Brain)</span>
                  <p class="text-[11px] text-amber-700 italic mt-1 leading-relaxed">
                    [ระบุหน้าที่ประมวลผลตรรกะ และการส่งผ่านข้อมูลเครือข่าย Wi-Fi/Cloud]
                  </p>
                </div>
                <div class="p-2.5 rounded border border-emerald-200 bg-emerald-50/50">
                  <span class="font-bold text-emerald-900 block text-xs">3. Actuators (Output Layer)</span>
                  <p class="text-[11px] text-emerald-700 italic mt-1 leading-relaxed">
                    [ระบุหน้าที่ขับเคลื่อนกลไกตอบสนอง และยกตัวอย่างอุปกรณ์ขับเคลื่อน 2 ชนิด]
                  </p>
                </div>
              </div>

              <div>
                <span class="font-semibold text-gray-900 block mb-1">2.2 ประโยชน์ของการเชื่อมต่ออุปกรณ์เข้าสู่อินเทอร์เน็ต (IoT Benefits):</span>
                <div class="p-2.5 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500 italic text-[11px] leading-relaxed">
                  [พื้นที่สำหรับพิมพ์/เขียนสรุป]: อธิบายประโยชน์ 3 ด้านหลัก ได้แก่ 1) การติดตามและสั่งการจากระยะไกล (Remote Monitoring & Control) 2) การทำงานอัตโนมัติประสานระบบ (Automation) และ 3) การวิเคราะห์ข้อมูลบนคลาวด์ (Cloud Data Analytics)...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 1 Footer -->
        <div class="pt-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>แบบฟอร์มใบงานที่ 1 • วิชาเทคโนโลยีระบบสมองกลฝังตัวและไอโอที (21901-2007)</span>
          <span class="font-bold text-gray-700">หน้า 1 / 2</span>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- แผ่นที่ 2: ตอนที่ 3 และ ตอนที่ 4 (หน้า 2 จาก 2)            -->
      <!-- ========================================================= -->
      <div
        class="printable-a4-sheet bg-white text-gray-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-11 shadow-2xl border border-gray-300 flex flex-col justify-between text-xs sm:text-sm font-sans box-border relative"
        style="background-color: #ffffff !important; color: #111827 !important;"
      >
        <div class="space-y-4">
          <!-- Page 2 Header Continuation -->
          <div class="border-b-2 border-black pb-2 flex items-center justify-between">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-black uppercase tracking-wide">
                ใบงานที่ 1: ระบบสมองกลฝังตัว & IoT และสถาปัตยกรรมบอร์ด Arduino Uno R3 (ต่อ)
              </h3>
            </div>
            <span class="px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-[10px] font-mono text-gray-600 shrink-0">
              หน้า 2 / 2
            </span>
          </div>

          <!-- Section 3: 8 Arduino Uno R3 Components -->
          <div class="space-y-2 pt-1">
            <div class="border-b border-gray-200 pb-1">
              <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
                ตอนที่ 3: ตำแหน่งและหน้าที่ของ 8 ส่วนประกอบหลักบนบอร์ด Arduino Uno R3
              </h4>
            </div>

            <p class="text-xs text-gray-700">
              <strong>คำสั่ง:</strong> ให้นักศึกษาชี้ระบุชื่อเฉพาะและหน้าที่ของ 8 ส่วนประกอบหลักบนบอร์ด Arduino Uno R3 ตามแผนภาพกายวิภาค
            </p>

            <table class="w-full border-collapse border border-gray-300 text-[11px]">
              <thead>
                <tr class="bg-gray-100 text-gray-800">
                  <th class="border border-gray-300 p-1 text-center w-12">ลำดับ</th>
                  <th class="border border-gray-300 p-1 text-left w-1/4">ส่วนประกอบบนบอร์ด</th>
                  <th class="border border-gray-300 p-1 text-left w-1/3">ชื่อเฉพาะ / รหัสระบุ</th>
                  <th class="border border-gray-300 p-1 text-left">หน้าที่และการทำงานหลักในวงจร</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 p-1 text-center font-bold">1</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">ชิปไมโครคอนโทรลเลอร์</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุ เช่น ATmega328P]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่ประมวลผลและรันโค้ดโปรแกรม...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1 text-center font-bold">2</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">พอร์ตเชื่อมต่อคอมพิวเตอร์</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุชนิดพอร์ต USB Type-B]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่จ่ายไฟและดาวน์โหลดโค้ด...]</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-1 text-center font-bold">3</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">แจ็กจ่ายไฟภายนอก (DC Jack)</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุช่วงแรงดันไฟ DC 7-12V]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่รับไฟตรงและวงจรคุมแรงดัน...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1 text-center font-bold">4</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">พินดิจิทัล (Digital I/O)</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุพิน 0-13 และพิน PWM ~]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่รับ-ส่งค่าดิจิทัล HIGH/LOW...]</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-1 text-center font-bold">5</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">พินแอนะล็อก (Analog Input)</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุพิน A0-A5]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่อ่านค่าแรงดันด้วย ADC 10-bit...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1 text-center font-bold">6</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">พินไฟเลี้ยงและกราวด์</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุพิน 5V, 3.3V, GND]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่จ่ายไฟและจุดกราวด์ 0V...]</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-1 text-center font-bold">7</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">ปุ่มรีเซ็ตการทำงาน</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุชื่อปุ่ม Reset Button]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่รีสตาร์ตระบบและเริ่มโปรแกรมใหม่...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1 text-center font-bold">8</td>
                  <td class="border border-gray-300 p-1 font-semibold text-gray-900">ไฟ LED แสดงสถานะ</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[ระบุไฟ ON, TX, RX, LED L]</td>
                  <td class="border border-gray-300 p-1 text-gray-500 italic">[อธิบายหน้าที่แสดงสถานะไฟเข้าและการสื่อสาร...]</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 4: Device Classification -->
          <div class="space-y-2 pt-1">
            <div class="border-b border-gray-200 pb-1">
              <h4 class="font-bold text-gray-900 text-xs sm:text-sm">
                ตอนที่ 4: การจำแนกประเภทอุปกรณ์พื้นฐาน (Digital/Analog & Input/Output)
              </h4>
            </div>

            <p class="text-xs text-gray-700">
              <strong>คำสั่ง:</strong> จำแนกอุปกรณ์ 4 ชนิด ว่าส่งสัญญาณชนิดใด (Digital หรือ Analog) และมีทิศทางการทำงานแบบใด (Input หรือ Output)
            </p>

            <table class="w-full border-collapse border border-gray-300 text-[11px]">
              <thead>
                <tr class="bg-gray-100 text-gray-800">
                  <th class="border border-gray-300 p-1 text-left w-1/4">ชื่ออุปกรณ์</th>
                  <th class="border border-gray-300 p-1 text-center w-28">ชนิดสัญญาณ</th>
                  <th class="border border-gray-300 p-1 text-center w-28">ทิศทาง (I/O)</th>
                  <th class="border border-gray-300 p-1 text-left">หน้าที่และฟังก์ชันคำสั่งในภาษา C++</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 p-1.5 font-semibold">1. สวิตช์ปุ่มกด (Push Button)</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Digital / Analog]</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Input / Output]</td>
                  <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุหน้าที่ และฟังก์ชัน เช่น digitalRead()...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1.5 font-semibold">2. หลอด LED</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Digital / Analog]</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Input / Output]</td>
                  <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุหน้าที่ และฟังก์ชัน เช่น digitalWrite()...]</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-1.5 font-semibold">3. วอลลุ่ม (Potentiometer)</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Digital / Analog]</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Input / Output]</td>
                  <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุหน้าที่ และฟังก์ชัน เช่น analogRead()...]</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-1.5 font-semibold">4. เซนเซอร์ตรวจวัดแสง (LDR)</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Digital / Analog]</td>
                  <td class="border border-gray-300 p-1.5 text-center text-gray-500 italic">[Input / Output]</td>
                  <td class="border border-gray-300 p-1.5 text-gray-500 italic">[ระบุหน้าที่ และฟังก์ชัน เช่น analogRead()...]</td>
                </tr>
              </tbody>
            </table>

            <!-- Design Summary Note Box -->
            <div class="p-2.5 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500 italic text-[11px] leading-relaxed">
              [พื้นที่สำหรับพิมพ์/เขียนสรุป]: อธิบายความสำคัญของการจำแนกชนิดสัญญาณและทิศทาง I/O ต่อการกำหนดคำสั่ง pinMode() ใน setup() และการเลือกใช้คำสั่งควบคุมใน loop()...
            </div>
          </div>
        </div>

        <!-- Page 2 Footer -->
        <div class="pt-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>แบบฟอร์มใบงานที่ 1 • วิชาเทคโนโลยีระบบสมองกลฝังตัวและไอโอที (21901-2007)</span>
          <span class="font-bold text-gray-700">หน้า 2 / 2</span>
        </div>
      </div>
    </AssignmentPdfModal>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal :is-open="showTeacherModal" :course-id="currentCourseId" :week="currentWeek"
      :games="weekGames" @close="showTeacherModal = false" />

  </div>
</template>
