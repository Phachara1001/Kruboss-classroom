<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Laptop, ExternalLink, CheckCircle, Globe, ShieldCheck, Code2, Cpu,
  UserPlus, MousePointerClick, Cable, FileCode2, Play, Lightbulb,
  AlertTriangle, Zap, ToggleRight, SlidersHorizontal, LayoutGrid, Terminal,
  Info, PieChart, Book, FileText, Target, Award, Layers, Sliders, Radio,
  RefreshCw, Gamepad2, MousePointer2, ListOrdered, FileQuestion, ChevronRight,
  Activity, Sun, Thermometer, Volume2, ArrowDownToLine, ArrowUpFromLine
} from '@lucide/vue'

import DragDropGame from '@/components/games/DragDropGame.vue'
import MatchingGame from '@/components/games/MatchingGame.vue'
import PopQuiz from '@/components/games/PopQuiz.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 1

const router = useRouter()

// Grading Criteria Data
const grading = [
  { name: 'จิตพิสัย (การเข้าเรียนและพฤติกรรม)', score: 20, color: 'bg-amber-400' },
  { name: 'คะแนนเก็บ (ใบงาน/มินิโปรเจกต์)', score: 40, color: 'bg-amber-500' },
  { name: 'สอบกลางภาคปฏิบัติ (Midterm)', score: 20, color: 'bg-orange-600' },
  { name: 'สอบปลายภาคและโครงงาน IoT (Final)', score: 20, color: 'bg-red-700' }
]

// Tinkercad Section Data
const quickFacts = [
  { icon: Globe, label: 'ใช้ฟรี', desc: 'ผ่านเว็บเบราว์เซอร์' },
  { icon: ShieldCheck, label: 'ปลอดภัย', desc: 'ไม่มีอุปกรณ์เสียหาย' },
  { icon: Code2, label: 'Blocks + C++', desc: 'เขียนโค้ดได้ 2 แบบ' },
  { icon: Cpu, label: 'Arduino Uno', desc: 'จำลองบอร์ดจริง' }
]

const reasons = [
  {
    icon: Globe, color: 'cyan',
    title: 'ใช้งานได้ฟรีผ่าน Web Browser',
    desc: 'ไม่ต้องดาวน์โหลดหรือติดตั้งโปรแกรม รองรับทั้ง Windows, Mac, iPad และ Chromebook เพียงสมัครบัญชี Autodesk ฟรีก็เริ่มได้ทันที',
    note: 'เหมาะกับห้องเรียนที่คอมพิวเตอร์มีสเปกจำกัด'
  },
  {
    icon: ShieldCheck, color: 'emerald',
    title: 'ปลอดภัย 100% ไม่ต้องกลัวอุปกรณ์ไหม้',
    desc: 'หากต่อสายผิด ช็อต หรือลืมต่อตัวต้านทาน (Resistor) ระบบจะจำลองควันหรือ LED แตกเตือนทันที โดยไม่มีอุปกรณ์จริงเสียหาย',
    note: 'ล้มเหลวได้ไม่จำกัด เรียนรู้จากข้อผิดพลาดได้เต็มที่'
  },
  {
    icon: Code2, color: 'violet',
    title: 'เขียนโค้ดได้ทั้งแบบ Blocks และ Text (C++)',
    desc: 'สลับดูโค้ด C++ ควบคู่กับบล็อกคำสั่งได้ทันที ช่วยให้เข้าใจตรรกะโปรแกรมก่อนก้าวไปสู่การเขียนโค้ดเต็มรูปแบบ',
    note: 'มีโหมด Blocks + Text แสดงสองแบบพร้อมกัน'
  },
  {
    icon: Terminal, color: 'amber',
    title: 'มี Serial Monitor ให้ตรวจสอบค่า',
    desc: 'ใช้ Serial.println() เพื่อดูค่าจากเซ็นเซอร์หรือสถานะของโปรแกรมแบบเรียลไทม์ ช่วยดีบักได้เหมือนการทำงานกับบอร์ดจริง',
    note: 'ฝึกทักษะดีบักที่ใช้ได้จริงในอนาคต'
  }
]

const steps = [
  { icon: UserPlus, title: 'สมัครและเข้าสู่ระบบ', desc: 'ไปที่ tinkercad.com สมัครบัญชี Autodesk ฟรี หรือเข้าสู่ระบบด้วยบัญชีที่มีอยู่' },
  { icon: MousePointerClick, title: 'สร้างวงจรใหม่', desc: 'เลือกเมนู Circuits แล้วกด Create new Circuit เพื่อเปิดพื้นที่ทำงานเปล่า' },
  { icon: Cable, title: 'ลากอุปกรณ์และต่อสาย', desc: 'ลาก Arduino, Breadboard, LED และ Resistor จากแถบด้านขวา แล้วคลิกที่ขาอุปกรณ์เพื่อลากสาย' },
  { icon: FileCode2, title: 'เขียนโปรแกรม', desc: 'กดปุ่ม Code เลือกโหมด Blocks, Text หรือ Blocks + Text แล้วเขียนคำสั่งควบคุมบอร์ด' },
  { icon: Play, title: 'กด Start Simulation', desc: 'ทดสอบวงจรและโค้ดได้ทันที หากผิดพลาดให้ตรวจสายและแก้โค้ดแล้วรันใหม่' }
]

const parts = [
  { icon: Cpu, name: 'Arduino Uno R3', desc: 'สมองของวงจร ประมวลผลคำสั่งที่เราเขียน' },
  { icon: LayoutGrid, name: 'Breadboard', desc: 'แผงต่อวงจรโดยไม่ต้องบัดกรี' },
  { icon: Lightbulb, name: 'LED', desc: 'หลอดไฟแสดงผล ต้องต่ออนุกรมกับ Resistor' },
  { icon: Zap, name: 'Resistor 220 Ω', desc: 'จำกัดกระแสเพื่อป้องกัน LED ไหม้' },
  { icon: ToggleRight, name: 'Pushbutton', desc: 'ปุ่มกดสำหรับรับค่าอินพุตดิจิทัล' },
  { icon: SlidersHorizontal, name: 'Potentiometer', desc: 'ตัวต้านทานปรับค่าได้ ใช้อ่านค่าอนาล็อก' }
]

const colorMap = {
  cyan: 'bg-cyan-100 text-cyan-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700'
}

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
    icon: Laptop,
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

// Arduino Devices Showcase (At least 3 for Digital & 3 for Analog)
const digitalDevices = [
  {
    name: 'Pushbutton (สวิตช์ปุ่มกด)',
    type: 'Digital Input',
    badge: 'Input',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    desc: 'สำหรับรับคำสั่งกดปุ่มจากผู้ใช้ เช่น ปุ่มเริ่มทำงานหรือปุ่มหยุด กดปุ่มคืนค่า 1 (HIGH) ปล่อยปุ่มคืนค่า 0 (LOW)',
    command: 'digitalRead(pin)'
  },
  {
    name: 'PIR Motion Sensor (เซนเซอร์ตรวจจับคน)',
    type: 'Digital Input',
    badge: 'Input',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    desc: 'ตรวจจับรังสีอินฟราเรดความร้อนจากร่างกายมนุษย์ เมื่อมีคนเดินผ่านส่งสัญญาณ HIGH (1) และเมื่อไม่มีคนส่ง LOW (0)',
    command: 'digitalRead(pin)'
  },
  {
    name: 'LED (หลอดไฟแสดงผล)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    desc: 'อุปกรณ์แสดงผลสถานะพื้นฐาน เปล่งแสงเมื่อสั่งจ่ายไฟ 5V (HIGH) และดับลงเมื่อสั่งจ่ายไฟ 0V (LOW)',
    command: 'digitalWrite(pin, HIGH/LOW)'
  },
  {
    name: 'Relay Module (โมดูลรีเลย์สวิตช์ไฟฟ้า)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
    desc: 'ใช้สัญญาณดิจิทัล 5V ควบคุมการเปิด-ปิดเครื่องใช้ไฟฟ้าแรงดันสูง 220V เช่น หลอดไฟบ้าน พัดลม หรือปั๊มน้ำ',
    command: 'digitalWrite(pin, HIGH/LOW)'
  },
  {
    name: 'Active Buzzer (ออดส่งเสียงเตือน)',
    type: 'Digital Output',
    badge: 'Output',
    badgeColor: 'bg-blue-100 text-blue-800',
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
    desc: 'หมุนแกนปรับแรงดัน 0V ถึง 5V คืนค่าตัวเลข 0 ถึง 1023 สำหรับปรับระดับเสียง ความเร็วรอบ หรือตั้งค่าเวลา',
    command: 'analogRead(A0)'
  },
  {
    name: 'LDR Photoresistor (เซนเซอร์วัดความเข้มแสง)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    desc: 'ความต้านทานเปลี่ยนแปลงตามความสว่างของแสง ยิ่งสว่างแรงดันยิ่งเปลี่ยน คืนค่า 0 ถึง 1023 สำหรับระบบไฟถนนเปิดอัตโนมัติ',
    command: 'analogRead(A1)'
  },
  {
    name: 'LM35 / Thermistor (เซนเซอร์วัดอุณหภูมิ)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    desc: 'จ่ายแรงดันแปรผันตามอุณหภูมิ (เช่น 10 mV ต่อ 1°C) นำค่า 0-1023 มาแปลงเป็นองศาเซลเซียสได้ละเอียด',
    command: 'analogRead(A2)'
  },
  {
    name: 'Soil Moisture Sensor (เซนเซอร์วัดความชื้นในดิน)',
    type: 'Analog Input',
    badge: 'Input (A0-A5)',
    badgeColor: 'bg-purple-100 text-purple-800',
    desc: 'วัดความชื้นในดินจากการนำไฟฟ้าของน้ำ คืนค่า 0 (ดินแห้งแล้ง) ถึง 1023 (ดินเปียกชุ่ม) สำหรับระบบสมาร์ตฟาร์ม',
    command: 'analogRead(A3)'
  },
  {
    name: 'DC Motor Speed / LED Fade (มอเตอร์และไฟหรี่)',
    type: 'Analog (PWM) Output',
    badge: 'PWM Output (~)',
    badgeColor: 'bg-orange-100 text-orange-800',
    desc: 'ใช้ขา PWM (มีสัญลักษณ์ ~) ส่งความถี่ Duty Cycle 0 ถึง 255 ควบคุมความเร็วรอบมอเตอร์หรือความสว่างของหลอดไฟอย่างนุ่มนวล',
    command: 'analogWrite(pin, 0-255)'
  }
]

// Interactive Pin Explorer State
const selectedPinGroup = ref('digital')

const pinGroupDetails = {
  digital: {
    title: 'Digital I/O Pins (ขา 0 ถึง 13)',
    badge: '14 พินดิจิทัล',
    color: 'border-amber-400 bg-amber-50 text-amber-950',
    desc: 'ใช้สำหรับรับหรือส่งสัญญาณแบบดิจิทัลที่มีเพียง 2 สถานะ คือ HIGH (5V หรือ ลอจิก 1) และ LOW (0V หรือ ลอจิก 0) เช่น สั่งเปิด-ปิดหลอดไฟ LED, รับค่าจากสวิตช์ปุ่มกด',
    details: [
      { pin: 'พิน 0 (RX) & 1 (TX)', func: 'ใช้สำหรับสื่อสารข้อมูลแบบอนุกรม (Serial Communication) กับคอมพิวเตอร์ ห้ามนำไปต่ออุปกรณ์อื่นขณะอัปโหลดโค้ด' },
      { pin: 'พิน 13 (Built-in LED)', func: 'มีไฟ LED สีส้มขนาดเล็กต่อพ่วงอยู่บนบอร์ด สามารถสั่งทดสอบเปิด/ปิดไฟได้ทันทีโดยไม่ต้องต่ออุปกรณ์ภายนอก' },
      { pin: 'กระแสสูงสุดต่อพิน', func: 'ไม่ควรจ่ายกระแสเกิน 20-40 mA ต่อหนึ่งพิน (หากต่อมอเตอร์ต้องใช้รีเลย์หรือทรานซิสเตอร์ช่วยขับ)' }
    ]
  },
  pwm: {
    title: 'PWM Pins (Pulse Width Modulation - มีสัญลักษณ์ ~)',
    badge: '6 พินพิเศษ (~3, ~5, ~6, ~9, ~10, ~11)',
    color: 'border-orange-400 bg-orange-50 text-orange-950',
    desc: 'พินดิจิทัลที่มีสัญลักษณ์ตัวหนอน (~) อยู่ด้านหน้า สามารถจำลองการปล่อยแรงดันแบบแอนะล็อกได้ โดยใช้วิธีเปิด/ปิดสัญญาณความถี่สูง สลับสัดส่วนช่วงเวลา (Duty Cycle)',
    details: [
      { pin: 'คำสั่งที่ใช้', func: 'ใช้คำสั่ง analogWrite(pin, value) โดย value มีค่าตั้งแต่ 0 (0V) ถึง 255 (5V)' },
      { pin: 'การประยุกต์ใช้งาน', func: 'ใช้สำหรับหรี่-เพิ่มความสว่างของหลอดไฟ LED, ควบคุมความเร็วมอเตอร์ DC, ควบคุมองศาเซอร์โวมอเตอร์' },
      { pin: 'ความถี่สัญญาณ', func: 'พิน 5, 6 ทำงานที่ความถี่ประมาณ 980 Hz ส่วนพิน 3, 9, 10, 11 ทำงานที่ 490 Hz' }
    ]
  },
  analog: {
    title: 'Analog In Pins (ขา A0 ถึง A5)',
    badge: '6 ช่องรับสัญญาณแอนะล็อก',
    color: 'border-emerald-400 bg-emerald-50 text-emerald-950',
    desc: 'ใช้สำหรับ "รับสัญญาณ" แรงดันไฟฟ้าที่มีการเปลี่ยนแปลงต่อเนื่องตั้งแต่ 0 ถึง 5 โวลต์ โดยภายในมีวงจร ADC (Analog-to-Digital Converter) ขนาด 10 บิต',
    details: [
      { pin: 'การแปลงค่า (ADC)', func: 'แปลงแรงดัน 0V - 5V ให้เป็นตัวเลขจำนวนเต็ม 0 ถึง 1023 (ความละเอียด 10-bit ละเอียด 4.9 mV ต่อ 1 ระดับ)' },
      { pin: 'คำสั่งที่ใช้', func: 'ใช้คำสั่ง analogRead(pin) เช่น int sensorValue = analogRead(A0);' },
      { pin: 'อุปกรณ์ที่ต่อ', func: 'เซนเซอร์วัดระดับความสว่าง (LDR), เซนเซอร์วัดอุณหภูมิ, วอลลุ่มปรับค่า (Potentiometer), เซนเซอร์วัดความชื้น' }
    ]
  },
  power: {
    title: 'Power & Ground Pins (แถวควบคุมพลังงาน)',
    badge: 'พินจ่ายไฟและกราวด์',
    color: 'border-rose-400 bg-rose-50 text-rose-950',
    desc: 'กลุ่มพินสำหรับจ่ายพลังงานเลี้ยงวงจรและอ้างอิงแรงดันไฟฟ้าระหว่างบอร์ดกับอุปกรณ์ต่อพ่วง',
    details: [
      { pin: '5V', func: 'จ่ายไฟเลี้ยงกระแสตรงคงที่ 5 โวลต์ (รับไฟมาจาก USB หรือตัวควบคุมแรงดันบนบอร์ด)' },
      { pin: '3.3V', func: 'จ่ายไฟเลี้ยง 3.3 โวลต์ (กระแสสูงสุด 50 mA) สำหรับเซนเซอร์รุ่นใหม่ที่ใช้ไฟ 3.3V' },
      { pin: 'GND (Ground)', func: 'ขั้วลบหรือกราวด์ของวงจร (มีทั้งหมด 3 พินบนบอร์ด) อุปกรณ์ทุกชิ้นต้องมีสายกราวด์ต่อร่วมกัน' },
      { pin: 'Vin (Voltage In)', func: 'ช่องรับไฟเลี้ยงจากภายนอก 7-12V เช่น ต่อจากแบตเตอรี่ 9V เข้าสู่ตัวคุมไฟของบอร์ดโดยตรง' },
      { pin: 'RESET', func: 'หากนำสายไปแตะกับ GND ชั่วขณะ บอร์ดจะเริ่มรันโปรแกรมใหม่ตั้งแต่ต้นเหมือนกดปุ่ม Reset' },
      { pin: 'IOREF', func: 'จ่ายแรงดันอ้างอิงของระบบ I/O (สำหรับบอร์ด Uno R3 คือ 5.0V)' }
    ]
  }
}

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
  { id: 'l1', text: '1. Microcontroller', match: 'r1' },
  { id: 'l2', text: '2. USB Port', match: 'r2' },
  { id: 'l3', text: '3. USB to Serial Chip', match: 'r3' },
  { id: 'l4', text: '5. Analog Pins (A0-A5)', match: 'r4' }
]

const matchRightDefs = [
  { id: 'r1', text: 'ชิป ATmega328P ทำหน้าที่เป็นสมองสั่งการและประมวลผลคำสั่งหลัก' },
  { id: 'r2', text: 'ช่องสำหรับเสียบสายอัปโหลดโค้ด จ่ายไฟ 5V และเชื่อมต่อ Serial กับคอมฯ' },
  { id: 'r3', text: 'ชิปแปลงสัญญาณระหว่างโปรโตคอล USB กับสัญญาณ Serial UART' },
  { id: 'r4', text: 'ช่องรับสัญญาณแรงดันแอนะล็อก 0-5V แปลงเป็นตัวเลข 0 ถึง 1023' }
]

// Game 3: Pop Quiz
const quizQuestions = [
  {
    id: 1,
    question: 'ระบบสมองกลฝังตัว (Embedded System) แตกต่างจากคอมพิวเตอร์ทั่วไป (PC) อย่างไร?',
    options: [
      { id: 'a', text: 'คอมพิวเตอร์ทั่วไปราคาถูกกว่าสมองกลฝังตัว', isCorrect: false },
      { id: 'b', text: 'สมองกลฝังตัวถูกออกแบบมาเพื่อทำงานเฉพาะทางอย่างใดอย่างหนึ่ง มีขนาดเล็กและกินไฟต่ำ', isCorrect: true },
      { id: 'c', text: 'สมองกลฝังตัวไม่สามารถเขียนโปรแกรมควบคุมได้', isCorrect: false }
    ],
    explanation: 'สมองกลฝังตัว (Embedded System) คือคอมพิวเตอร์เฉพาะทางที่ฝังอยู่ในอุปกรณ์ เช่น รีโมต, ไมโครเวฟ, แอร์ เพื่อทำหน้าที่เฉพาะ ไม่ได้เป็นคอมพิวเตอร์อเนกประสงค์เหมือน PC'
  },
  {
    id: 2,
    question: 'พินแอนะล็อก A0-A5 บนบอร์ด Arduino Uno R3 อ่านค่าแรงดัน 0-5V แล้วแปลงเป็นตัวเลขช่วงใด?',
    options: [
      { id: 'a', text: '0 ถึง 100', isCorrect: false },
      { id: 'b', text: '0 หรือ 1 เท่านั้น', isCorrect: false },
      { id: 'c', text: '0 ถึง 1023 (ความละเอียด 10 บิต)', isCorrect: true }
    ],
    explanation: 'บอร์ด Arduino Uno มีตัวแปลง ADC ขนาด 10 บิต (2^10 = 1024 ค่า) จึงแปลงแรงดันไฟฟ้า 0-5 โวลต์ออกมาเป็นตัวเลข 0 ถึง 1023'
  },
  {
    id: 3,
    question: 'ภาษาหลักที่ใช้ในการเขียนโปรแกรมควบคุมบอร์ด Arduino คือภาษาอะไร?',
    options: [
      { id: 'a', text: 'ภาษา Arduino ซึ่งมีรากฐานมาจากภาษา C / C++', isCorrect: true },
      { id: 'b', text: 'ภาษา HTML และ CSS', isCorrect: false },
      { id: 'c', text: 'ภาษา SQL', isCorrect: false }
    ],
    explanation: 'ภาษาที่ใช้ในการพัฒนา Arduino คือภาษา C/C++ ที่ถูกปรับแต่งให้มีฟังก์ชันอำนวยความสะดวก เช่น pinMode(), digitalWrite(), analogRead()'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-10 px-4 md:px-8">

    <!-- Page Header (Standardized with other courses) -->
    <div
      class="bg-white rounded-2xl p-8 md:p-12 border border-amber-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-amber-600">
        <Cpu class="w-[400px] h-[400px] -translate-y-20 translate-x-20" />
      </div>
      <div class="relative z-10 w-full md:w-3/4 lg:w-2/3">
        <span
          class="px-4 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">
          สัปดาห์ที่ 1
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-amber-900 mb-4 leading-tight">
          บทนำสู่ระบบสมองกลฝังตัว & IoT<br />
          <span class="text-3xl text-amber-700">(Introduction to Embedded Systems & IoT)</span>
        </h1>
        <p class="text-gray-600 text-xl leading-relaxed">
          ทำความรู้จักกับรายวิชา เกณฑ์การให้คะแนน และเจาะลึกระบบสมองกลฝังตัว (Embedded System), อินเทอร์เน็ตของสรรพสิ่ง
          (IoT), กายวิภาคบอร์ด Arduino Uno R3 และการจำลองวงจรบน Autodesk Tinkercad เนื้อหาบรรยายและฝึกปฏิบัติ 2
          ชั่วโมงเต็ม
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
              <li>มีทักษะในการออกแบบ จำลองวงจรอิเล็กทรอนิกส์ และเขียนโปรแกรมควบคุมบอร์ด</li>
              <li>สามารถใช้งานโปรแกรมจำลอง Autodesk Tinkercad Circuits ได้อย่างถูกต้อง</li>
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
              <li>จำลอง ต่อวงจร และเขียนคำสั่งควบคุมอุปกรณ์ Digital, PWM และ Analog ตามที่กำหนด</li>
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
              วิเคราะห์ความต้องการ ออกแบบวงจรไมโครคอนโทรลเลอร์ และพัฒนาโปรแกรมสั่งการระบบสมองกลฝังตัวและไอโอทีผ่าน
              Tinkercad พร้อมนำไปปฏิบัติจริงได้อย่างเป็นระบบและมีประสิทธิภาพ
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
        </div>

        <!-- Part 2: Tinkercad Simulator (Hands-on Lab) -->
        <div class="pt-8 border-t border-gray-100">
          <div class="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden">
            <!-- Header band -->
            <div class="relative p-6 sm:p-8 bg-gradient-to-br from-cyan-600 via-cyan-700 to-sky-800 text-white">
              <div class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
              <div class="relative flex items-start justify-between flex-wrap gap-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Laptop class="w-6 h-6" />
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-100">Hands-on Lab</span>
                    <h2 class="text-2xl sm:text-3xl font-black leading-tight">2. เครื่องมือฝึกปฏิบัติ: Autodesk
                      Tinkercad Circuits</h2>
                    <p class="text-sm text-cyan-50/90 mt-1">ห้องแล็บอิเล็กทรอนิกส์และจำลองบอร์ด Arduino
                      เสมือนจริงบนเว็บเบราว์เซอร์</p>
                  </div>
                </div>
                <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-cyan-800 font-bold text-sm shadow-lg hover:bg-cyan-50 hover:-translate-y-0.5 transition-all">
                  เข้าสู่ Tinkercad.com
                  <ExternalLink class="w-4 h-4" />
                </a>
              </div>

              <!-- Quick facts -->
              <div class="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div v-for="f in quickFacts" :key="f.label"
                  class="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur">
                  <component :is="f.icon" class="w-5 h-5 shrink-0 text-cyan-100" />
                  <div class="leading-tight">
                    <p class="text-sm font-bold">{{ f.label }}</p>
                    <p class="text-[11px] text-cyan-100/90">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 sm:p-8 space-y-10">
              <!-- Intro + preview -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <figure class="overflow-hidden rounded-2xl border border-gray-200 shadow-md group bg-gray-50">
                  <img src="/img/tinkercad_circuits_preview.jpg" alt="Autodesk Tinkercad Circuits Simulator Preview"
                    class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  <figcaption class="p-3 border-t border-gray-100 text-center text-xs text-gray-500">
                    จำลองการต่อวงจรและเขียนโปรแกรมควบคุม Arduino เสมือนจริง 100% บน Autodesk Tinkercad
                  </figcaption>
                </figure>

                <div class="space-y-4">
                  <h3 class="text-xl font-black text-gray-900">Tinkercad Circuits คืออะไร?</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Tinkercad Circuits เป็นโปรแกรมจำลองวงจรอิเล็กทรอนิกส์ออนไลน์จาก Autodesk
                    ที่ให้เราลากอุปกรณ์มาวางบนพื้นที่ทำงาน ต่อสายด้วยเมาส์ และเขียนโปรแกรมควบคุมบอร์ด Arduino
                    ได้เหมือนทำงานกับอุปกรณ์จริง
                    โดยสามารถกดจำลองการทำงานเพื่อดูผลลัพธ์ได้ทันที
                  </p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    เครื่องมือนี้เหมาะกับผู้เริ่มต้น เพราะลดอุปสรรคเรื่องค่าอุปกรณ์ ความเสี่ยงที่อุปกรณ์เสียหาย
                    และการติดตั้งโปรแกรม ทำให้เรามีเวลาโฟกัสกับ <span
                      class="font-bold text-gray-900">ตรรกะของวงจรและโปรแกรม</span> อย่างเต็มที่
                  </p>
                </div>
              </div>

              <!-- Why Tinkercad -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">ทำไมเราจึงใช้ Tinkercad ในการเริ่มต้นเรียนรู้?</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="r in reasons" :key="r.title"
                    class="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all space-y-3">
                    <div class="flex items-center gap-3">
                      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', colorMap[r.color]]">
                        <component :is="r.icon" class="w-5 h-5" />
                      </div>
                      <p class="font-bold text-gray-900 text-sm">{{ r.title }}</p>
                    </div>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ r.desc }}</p>
                    <p class="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle class="w-3.5 h-3.5" /> {{ r.note }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Workflow -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">ขั้นตอนการใช้งานเบื้องต้น</h3>
                <ol class="relative space-y-3">
                  <li v-for="(s, i) in steps" :key="s.title"
                    class="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:bg-cyan-50/40 transition-colors">
                    <div
                      class="w-9 h-9 shrink-0 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center">
                      {{ i + 1 }}
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-gray-900 text-sm">{{ s.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">{{ s.desc }}</p>
                    </div>
                    <component :is="s.icon" class="w-5 h-5 text-cyan-600 shrink-0 hidden sm:block mt-1" />
                  </li>
                </ol>
              </div>

              <!-- Components -->
              <div class="space-y-4">
                <h3 class="text-xl font-black text-gray-900">อุปกรณ์พื้นฐานที่ควรรู้จัก</h3>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="p in parts" :key="p.name"
                    class="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <component :is="p.icon" class="w-6 h-6 text-cyan-700" />
                    <p class="font-bold text-gray-900 text-sm">{{ p.name }}</p>
                    <p class="text-[11px] text-gray-500 leading-relaxed">{{ p.desc }}</p>
                  </div>
                </div>
              </div>

              <!-- Tips -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                  <p class="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                    <Lightbulb class="w-4 h-4" /> เคล็ดลับ
                  </p>
                  <ul class="text-xs text-emerald-900/80 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>กด Ctrl+S หรือรอระบบบันทึกอัตโนมัติ และตั้งชื่อวงจรให้สื่อความหมาย</li>
                    <li>เปลี่ยนสีสายไฟ (แดง = 5V, ดำ = GND) เพื่อให้ตรวจวงจรง่ายขึ้น</li>
                    <li>ทดลองเปลี่ยนค่าใน delay() เพื่อดูว่า LED กะพริบเร็วหรือช้าลง</li>
                  </ul>
                </div>
                <div class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                  <p class="flex items-center gap-2 font-bold text-amber-800 text-sm">
                    <AlertTriangle class="w-4 h-4" /> ข้อควรระวัง
                  </p>
                  <ul class="text-xs text-amber-900/80 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>แม้ในโปรแกรมจำลองจะไม่เสียหาย แต่ควรฝึกต่อ Resistor ให้ถูกต้องเหมือนวงจรจริง</li>
                    <li>ตรวจสอบขาบวก (ขายาว) และขาลบ (ขาสั้น) ของ LED ก่อนต่อวงจรเสมอ</li>
                    <li>เมื่อแก้ไขวงจรให้หยุดการจำลองก่อน แล้วค่อยเริ่มรันใหม่</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 3: Arduino Uno R3 Anatomy & Diagram (User Requested Image & 8 Components) -->
        <div class="pt-8 border-t border-gray-100">
          <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-6">
            ส่วนที่ 3: กายวิภาคและส่วนประกอบของบอร์ด Arduino Uno R3
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

        <!-- Part 4: Digital vs Analog Pin Deep Dive -->
        <div class="pt-8 border-t border-gray-100 space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-amber-900 border-l-4 border-amber-500 pl-4 mb-2">
              ส่วนที่ 4: ความแตกต่างระหว่าง Digital Pin และ Analog Pin (Digital vs Analog Deep Dive)
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

          <!-- Arduino Devices & Sensors Showcase (At least 3 for Digital & 3 for Analog) -->
          <div class="space-y-6 pt-4">
            <div>
              <h4 class="text-xl font-black text-gray-900 flex items-center gap-2">
                <Cpu class="w-5 h-5 text-amber-600" />
                ตัวอย่างอุปกรณ์ Arduino ที่ใช้พินแต่ละประเภท
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
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="d in digitalDevices" :key="d.name"
                  class="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2 hover:border-amber-400 hover:shadow-xs transition-all">
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-bold text-gray-900 text-xs">{{ d.name }}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="d.badgeColor">
                      {{ d.badge }}
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-600 leading-relaxed">{{ d.desc }}</p>
                  <div
                    class="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>คำสั่ง:</span>
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
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="d in analogDevices" :key="d.name"
                  class="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2 hover:border-emerald-400 hover:shadow-xs transition-all">
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-bold text-gray-900 text-xs">{{ d.name }}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="d.badgeColor">
                      {{ d.badge }}
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-600 leading-relaxed">{{ d.desc }}</p>
                  <div
                    class="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>คำสั่ง:</span>
                    <code class="text-emerald-800 bg-emerald-50 px-1 rounded">{{ d.command }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 5: Programming Language (C/C++ & Structure) -->
        <div class="pt-8 border-t border-gray-100 space-y-6">
          <h3 class="text-2xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4 mb-2">
            ส่วนที่ 5: ภาษาที่ใช้ในการเขียนโปรแกรม Arduino (C/C++)
          </h3>
          <p class="text-base text-gray-600">
            โปรแกรมควบคุมบอร์ด Arduino เขียนด้วยภาษา C/C++ โดยโปรแกรมทุกตัวจะมีโครงสร้างพื้นฐาน 2
            ฟังก์ชันหลักที่ต้องมีเสมอ:
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Code Structure -->
            <div
              class="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-4 font-mono text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <span class="text-amber-400 font-bold">// โครงสร้างหลักของไฟล์ .ino (Arduino Code)</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">C/C++ Syntax</span>
              </div>

              <div class="space-y-3">
                <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                  <span class="text-pink-400 font-bold">void</span> <span
                    class="text-yellow-300 font-bold">setup</span>() {<br />
                  &nbsp;&nbsp;<span class="text-slate-500">// 1. ทำงานเพียง "ครั้งเดียว" ตอนเปิดบอร์ด</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">pinMode</span>(<span class="text-orange-400">13</span>, <span
                    class="text-emerald-400">OUTPUT</span>); <span class="text-slate-500">// กำหนดให้พิน 13
                    เป็นเอาต์พุต</span><br />
                  }
                </div>

                <div class="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/30">
                  <span class="text-pink-400 font-bold">void</span> <span
                    class="text-yellow-300 font-bold">loop</span>() {<br />
                  &nbsp;&nbsp;<span class="text-slate-500">// 2. ทำงาน "วนซ้ำตลอดเวลา" ไม่รู้จบ</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">13</span>,
                  <span class="text-emerald-400">HIGH</span>); <span class="text-slate-500">// สั่งเปิดไฟ</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span
                    class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
                    class="text-slate-500">// หน่วงเวลา 1 วินาที</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">digitalWrite</span>(<span class="text-orange-400">13</span>,
                  <span class="text-emerald-400">LOW</span>);&nbsp;&nbsp;<span class="text-slate-500">//
                    สั่งดับไฟ</span><br />
                  &nbsp;&nbsp;<span class="text-cyan-300">delay</span>(<span
                    class="text-orange-400">1000</span>);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
                    class="text-slate-500">// หน่วงเวลา 1 วินาที</span><br />
                  }
                </div>
              </div>
            </div>

            <!-- Right: Explanation of Code Mode in Tinkercad -->
            <div class="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
              <h4 class="text-lg font-black text-gray-900">รูปแบบการเขียนโค้ดบน Tinkercad Circuits</h4>

              <div class="space-y-3 text-xs text-gray-600">
                <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <p class="font-bold text-amber-900 mb-1">🧱 1. Blocks Mode (บล็อกลากวาง)</p>
                  <p>เหมาะสำหรับผู้เริ่มต้น ลากบล็อกคำสั่ง เช่น <span
                      class="font-mono bg-white px-1.5 py-0.5 rounded border">set built-in LED to HIGH</span>
                    มาต่อกันเหมือนตัวต่อเลโก้</p>
                </div>

                <div class="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                  <p class="font-bold text-indigo-900 mb-1">💻 2. Text Mode (C/C++ Code)</p>
                  <p>เหมาะสำหรับนักศึกษาสายไอที/คอมพิวเตอร์ เขียนโค้ดภาษา C/C++ ด้วยมือจริง ช่วยให้เข้าใจการทำงานลึกซึ้ง
                    และนำไปใช้งานกับบอร์ดจริงในแล็บได้ 100%</p>
                </div>

                <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                  <p class="font-bold text-teal-900 mb-1">🔄 3. Blocks + Text Mode</p>
                  <p>โหมดแนะนำในสัปดาห์ที่ 1 ลากบล็อกทางซ้าย แล้วดูโค้ดภาษา C++
                    ที่ถูกสร้างขึ้นมาอัตโนมัติทางขวาเพื่อเปรียบเทียบคำสั่ง</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Game Center -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-xl text-purple-600 shadow-sm">
            <Gamepad2 class="w-6 h-6" />
          </div>
          <h2 class="text-3xl font-bold text-gray-800">Game Center: ทดสอบความเข้าใจ</h2>
        </div>
      </div>

      <!-- Game Tabs -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="activeGame = 'sort'" :class="[
          activeGame === 'sort'
            ? 'bg-purple-600 text-white shadow-lg scale-105'
            : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200',
          'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer'
        ]">
          <MousePointer2 class="w-5 h-5" /> เกมลากวาง (Drag & Drop)
        </button>

        <button @click="activeGame = 'match'" :class="[
          activeGame === 'match'
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200',
          'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer'
        ]">
          <ListOrdered class="w-5 h-5" /> เกมโยงความสัมพันธ์ (Match)
        </button>

        <button @click="activeGame = 'quiz'" :class="[
          activeGame === 'quiz'
            ? 'bg-amber-600 text-white shadow-lg scale-105'
            : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200',
          'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer'
        ]">
          <FileQuestion class="w-5 h-5" /> Pop Quiz สุดท้าย
        </button>
      </div>

      <!-- Game 1: Drag & Drop -->
      <DragDropGame v-if="activeGame === 'sort'" title="จำแนกประเภทพินและช่องเสียบของบอร์ด Arduino Uno R3"
        subtitle="ลากชื่อพินและหน้าที่ไปใส่ในหมวดหมู่ที่ถูกต้องให้ครบ!" :initialItems="dragItemsData"
        :zones="dragZonesData" />

      <!-- Game 2: Matching -->
      <MatchingGame v-if="activeGame === 'match'" title="คำศัพท์และหน้าที่สำคัญของระบบสมองกล"
        subtitle="คลิกจับคู่ฝั่งซ้ายและขวาให้ถูกต้อง!" :initialLeftTerms="matchLeftTerms"
        :initialRightDefs="matchRightDefs" />

      <!-- Game 3: Pop Quiz -->
      <PopQuiz v-if="activeGame === 'quiz'" :questions="quizQuestions">
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
      assignment-title="ใบงานที่ 1: การสมัครและเริ่มต้นสร้างวงจรเสมือนจริงบน Tinkercad" :max-score="10">
      <template #number>1</template>
      <template #description>
        ให้นักศึกษาสมัครบัญชี Autodesk Tinkercad และทดสอบสร้างวงจรจำลองบอร์ด Arduino Uno R3
        พร้อมทดลองรันโค้ดไฟกระพริบแรก (Blink) บนระบบเสมือนจริง
      </template>
      <template #tasks>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>เข้าไปที่เว็บไซต์ <a href="https://www.tinkercad.com/circuits" target="_blank"
              class="text-cyan-600 font-bold underline">tinkercad.com/circuits</a> แล้วสมัครสมาชิก (Sign Up)
            หรือเข้าสู่ระบบด้วย Google Account ของนักศึกษา</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>กดปุ่ม <strong>+ Create</strong> เลือก <strong>Circuit</strong> จากนั้นลากบอร์ด <strong>Arduino Uno
              R3</strong> ออกมาวางในพื้นที่ทำงาน</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>กดปุ่ม <strong>Code</strong> ด้านบนขวา เลือกโหมด <strong>Blocks + Text</strong> แล้วกด <strong>Start
              Simulation</strong> เพื่อสังเกตไฟสีส้มที่พิน 13 (Built-in LED) กระพริบติด-ดับ</span>
        </li>
        <li class="flex items-start gap-3 hover:translate-x-1 transition-transform">
          <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>จับภาพหน้าจอ (Screenshot) วงจรและโค้ดของตนเองบน Tinkercad นำไปอัปโหลดขึ้น Google Drive
            หรือแชร์ลิงก์สาธารณะของวงจร แล้วนำ URL มาส่งในปุ่ม <strong>ส่งงานด้วยลิงก์</strong> ด้านล่าง</span>
        </li>
      </template>
    </AssignmentSection>

  </div>
</template>
