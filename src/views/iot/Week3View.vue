<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Laptop, ExternalLink, CheckCircle, Globe, ShieldCheck, Code2, Cpu,
  UserPlus, MousePointerClick, Cable, FileCode2, Play, Lightbulb,
  AlertTriangle, Zap, ToggleRight, SlidersHorizontal, LayoutGrid, Terminal,
  Info, PieChart, Book, FileText, Target, Award, Layers, Sliders, Radio,
  RefreshCw, Gamepad2, MousePointer2, ListOrdered, FileQuestion, ChevronRight,
  Activity, Sun, Thermometer, Volume2, ArrowDownToLine, ArrowUpFromLine,
  Trophy, Lock, FileSpreadsheet, PlayCircle, StopCircle, Copy, Check,
  Sparkles, RotateCw, ArrowRight, ArrowLeft, Gauge, Boxes, Tag, BookOpen, VolumeX,
  Bell, BellRing, ToggleLeft, GitCommit, SlidersVertical, HelpCircle
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course Context
const currentCourseId = '21901-2007'
const currentWeek = 3
const showTeacherModal = ref(false)

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จำแนกคำสั่ง Serial, State & Sound)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่แนวคิด State, Serial Monitor & Buzzer)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 3 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
]

onMounted(() => {
  fetchGameScores(currentCourseId, currentWeek)
})

const currentStudentId = computed(() => authUser.value?.studentId || authUser.value?.id || '')
const isTeacher = computed(() => isTeacherUser(authUser.value))

const studentWeekScores = computed(() => {
  if (!currentStudentId.value) return {}
  const key = `${currentCourseId}_${currentWeek}_${currentStudentId.value}`
  return gameScoresStore.value[key]?.scores || {}
})

const studentNorm = computed(() => {
  return calculateNormalizedScore(studentWeekScores.value, weekGames)
})

const router = useRouter()

// Copy code feedback state
const copiedLab = ref('')
const copyCode = (labKey, codeText) => {
  navigator.clipboard.writeText(codeText)
  copiedLab.value = labKey
  setTimeout(() => { copiedLab.value = '' }, 2000)
}

// Code Snippet for Serial Monitor Demonstration (Section 1)
const serialDemoCode = `const int BUTTON_PIN = 13; // ขาสวิตช์ปุ่มกด

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  int ButtonVal = digitalRead(BUTTON_PIN);
  Serial.println(ButtonVal);
  delay(1000);
}`

// Code Snippet for State Toggle Demonstration (Section 2)
const stateDemoCode = `const int BUTTON_PIN = 13; // ขาสวิตช์ปุ่มกด

int lastButtonState = HIGH; // จำสถานะปุ่มรอบก่อนหน้า (สำหรับตรวจจับการกด)
int toggleState = 0;        // เก็บสถานะที่ต้องการสลับ (0 หรือ 1)

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("=== System Ready! (setup completed) ===");
}

void loop() {
  int buttonVal = digitalRead(BUTTON_PIN);

  // ตรวจจับจังหวะเริ่มกดปุ่ม (Falling Edge: จาก HIGH เป็น LOW)
  if (lastButtonState == HIGH && buttonVal == LOW) {
    Serial.println(">> [EVENT] Button Pressed! State Changed.");
    
    Serial.print("Old State: ");
    Serial.println(toggleState);
    
    // สลับค่า toggleState (0 -> 1, 1 -> 0)
    toggleState = !toggleState;

    Serial.print("New State: ");
    Serial.println(toggleState);

    delay(50); // Debounce ป้องกันสัญญาณปุ่มเด้งเบิ้ล
  }

  // อัปเดตเฉพาะสถานะปุ่มกดสำหรับรอบถัดไป
  lastButtonState = buttonVal;
  delay(50);
}`

// Code Snippets for Piezo Buzzer Demonstration
const simpleBuzzerCode = `const int BUZZER_PIN = 8; // ขาลำโพง Piezo Buzzer

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  tone(BUZZER_PIN, 1000); // ส่งเสียงความถี่ 1000 Hz
  delay(1000);            // ร้องค้างไว้ 1 วินาที
  noTone(BUZZER_PIN);     // ปิดเสียง
  delay(1000);            // เงียบ 1 วินาที
}`

const piezoMelodyCode = `#define NOTE_C4  262
#define NOTE_G3  196
#define NOTE_A3  220
#define NOTE_B3  247
#define NOTE_C4  262

// notes in the melody:
int melody[] = {
  NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4
};

// note durations: 4 = quarter note, 8 = eighth note, etc.:
int noteDurations[] = {
  4, 8, 8, 4, 4, 4, 4, 4
};

void setup() {
  // iterate over the notes of the melody:
  for (int thisNote = 0; thisNote < 8; thisNote++) {
    // to calculate the note duration, take one second
    // divided by the note type.
    // e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(8, melody[thisNote], noteDuration);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    
    // stop the tone playing:
    noTone(8);
  }
}

void loop() {
  // no need to repeat the melody.
}`

// Active Tutorial Step in Section 4
const currentTutorialStep = ref(1)

const step1Code = `// สเต็ปที่ 1: กำหนดตัวแปรขาพินและกำหนด Mode ใน setup()
const int BUTTON_PIN = 2; // ขาสวิตช์ปุ่มกด
const int LED_PIN = 13;   // ขาหลอดไฟ LED (ต่อผ่านตัวต้านทาน 220 โอห์ม)
const int BUZZER_PIN = 8; // ขาลำโพง Piezo Buzzer

void setup() {
  // 1. เปิดช่องทางการสื่อสาร Serial Monitor ที่ความเร็ว 9600 บอด (baud)
  Serial.begin(9600);
  Serial.println("System Ready!");

  // 2. กำหนดโหมดไฟ LED ให้เป็นเอาต์พุต (OUTPUT) จ่ายไฟ 5V ขับหลอด
  pinMode(LED_PIN, OUTPUT);

  // 3. กำหนดโหมดปุ่มกด ให้เป็นอินพุต (INPUT) เพื่อรับสัญญาณดิจิทัล
  pinMode(BUTTON_PIN, INPUT);

  // 4. กำหนดโหมดลำโพง Buzzer ให้เป็นเอาต์พุต (OUTPUT) สำหรับส่งสัญญาณเสียง
  pinMode(BUZZER_PIN, OUTPUT);
}`

const step2Code = `// สเต็ปที่ 2: อ่านค่าจากปุ่มกดและแสดงผลบน Serial Monitor
void loop() {
  // 1. อ่านค่าแรงดันดิจิทัลจากสวิตช์ปุ่มกด (ส่งค่ากลับมาเป็น 0 หรือ 1)
  int buttonVal = digitalRead(BUTTON_PIN);

  // 2. ส่งค่าไปแสดงผลบนหน้าต่าง Serial Monitor เพื่อตรวจสอบการทำงาน
  Serial.print("Button Status: ");
  Serial.println(buttonVal);

  delay(200); // หน่วงเวลาสั้นๆ 0.2 วินาที เพื่อไม่ให้ตัวอักษรวิ่งเร็วเกินไป
}`

const step3Code = `// สเต็ปที่ 3: ตรวจจับการกดปุ่ม (Falling Edge) และสาธิตการเปลี่ยน State
bool systemState = false;   // ตัวแปรจำสถานะ: false = ปิด (0), true = เปิด (1)
int lastButtonState = HIGH; // บันทึกสถานะก่อนหน้าเพื่อตรวจจับจังหวะเริ่มกดปุ่ม

void loop() {
  int currentButtonState = digitalRead(BUTTON_PIN);

  // ตรวจจับจังหวะเริ่มกด (จากเดิมเป็น HIGH ตกลงมาเป็น LOW)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    systemState = !systemState; // สลับสถานะ (Toggle: จาก 0 เป็น 1 หรือจาก 1 เป็น 0)
    delay(50); // Software Debounce ป้องกันหน้าสัมผัสสวิตช์กระดอน

    // รายงานการเปลี่ยน State ออกทาง Serial Monitor ทันที!
    Serial.print(">> [EVENT] ตรวจพบการกดปุ่ม! สลับ State เป็น: ");
    Serial.println(systemState ? "1 (ON)" : "0 (OFF)");
  }

  lastButtonState = currentButtonState; // จำสถานะปัจจุบันไว้สำหรับรอบลูปถัดไป
}`

const step4Code = `// สเต็ปที่ 4: สั่งควบคุมอุปกรณ์ (LED & Buzzer) ให้ทำงานตามตัวแปร State
  // ตรวจสอบค่าสถานะ systemState ปัจจุบัน
  if (systemState == true) {
    // เมื่อ State เป็น 1: สั่งเปิดไฟ LED และเปิดเสียงเตือน
    digitalWrite(LED_PIN, HIGH); // สั่งจ่ายไฟ 5V ไฟ LED ติดสว่าง
    tone(BUZZER_PIN, 1000);      // สั่งลำโพงส่งเสียงเตือนความถี่ 1000 Hz
  } else {
    // เมื่อ State เป็น 0: สั่งปิดไฟ LED และปิดเสียงเตือน
    digitalWrite(LED_PIN, LOW);  // สั่งตัดไฟ 0V ไฟ LED ดับ
    noTone(BUZZER_PIN);          // สั่งปิดเสียงลำโพง
  }`

const fullDemoCode = `// โค้ดฉบับสมบูรณ์: ระบบ 1 ปุ่มกด + 1 หลอดไฟ LED + 1 ลำโพง Buzzer พร้อม Serial Monitor
// สาธิตการกำหนด Pin Mode, การอ่านค่าปุ่ม และการสลับ State
const int BUTTON_PIN = 2; // สวิตช์ปุ่มกด (กำหนดโหมด INPUT)
const int LED_PIN = 13;   // หลอดไฟ LED (ต่อผ่านตัวต้านทาน 220 โอห์ม)
const int BUZZER_PIN = 8; // ลำโพง Piezo Buzzer

bool systemState = false;   // ตัวแปรจำสถานะ (State Variable): false = ปิด, true = เปิด
int lastButtonState = HIGH; // จำสถานะก่อนหน้าเพื่อตรวจจับ Falling Edge

void setup() {
  // สเต็ปที่ 1: เปิด Serial Monitor และกำหนด Mode ของแต่ละขาพิน
  Serial.begin(9600);
  Serial.println("=== ระบบเริ่มต้นทำงาน (System Ready) ===");

  pinMode(LED_PIN, OUTPUT);    // กำหนดโหมดไฟเป็น OUTPUT
  pinMode(BUTTON_PIN, INPUT);  // กำหนดโหมดปุ่มกดเป็น INPUT
  pinMode(BUZZER_PIN, OUTPUT); // กำหนดโหมดลำโพงเป็น OUTPUT
}

void loop() {
  // สเต็ปที่ 2: อ่านค่าจากปุ่มกด
  int currentButtonState = digitalRead(BUTTON_PIN);

  // สเต็ปที่ 3: ตรวจจับการกดปุ่ม (Falling Edge) และสลับ State
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    systemState = !systemState; // สลับสถานะ (จาก 0 เป็น 1 หรือ 1 เป็น 0)
    delay(50); // Software Debounce ป้องกันปุ่มเด้งเบิ้ล

    // รายงานการเปลี่ยน State ออก Serial Monitor
    Serial.print(">> [EVENT] ตรวจพบการกดปุ่ม! เปลี่ยน State เป็น: ");
    if (systemState == true) {
      Serial.println("1 (ON - ระบบเปิด ไฟติด เสียงดัง)");
    } else {
      Serial.println("0 (OFF - ระบบปิด ไฟดับ เสียงเงียบ)");
    }
  }

  // สเต็ปที่ 4: ควบคุมอุปกรณ์ฮาร์ดแวร์ตาม State ปัจจุบัน
  if (systemState == true) {
    digitalWrite(LED_PIN, HIGH); // สั่งเปิดไฟ LED
    tone(BUZZER_PIN, 1000);      // สั่งลำโพงดัง 1000 Hz
  } else {
    digitalWrite(LED_PIN, LOW);  // สั่งปิดไฟ LED
    noTone(BUZZER_PIN);          // สั่งปิดเสียงลำโพง
  }

  lastButtonState = currentButtonState;
}`

// Active Lab Tab
const activeLab = ref('lab1')

// Mini-games active tab
const activeGame = ref('sort') // 'sort', 'match', 'quiz'

// Game 1: Drag & Drop (จำแนกคำสั่ง Serial, State และ Sound)
const dragItemsData = [
  { id: 1, text: 'Serial.begin(9600);', type: 'serial' },
  { id: 2, text: 'Serial.println(buttonVal);', type: 'serial' },
  { id: 3, text: 'pinMode(2, INPUT);', type: 'state' },
  { id: 4, text: 'if (buttonState != lastButtonState)', type: 'state' },
  { id: 5, text: 'tone(8, 1000);', type: 'sound' },
  { id: 6, text: 'noTone(8);', type: 'sound' }
]

const dragZonesData = [
  {
    id: 'serial',
    title: '1. คำสั่งสื่อสารผ่าน Serial Monitor (Serial Output)',
    wrapperClass: 'border-blue-400/50 hover:bg-black/40',
    titleClass: 'text-blue-300 border-blue-400/30',
    itemBgClass: 'bg-blue-600/50 border-blue-400',
    emptyTextClass: 'text-blue-200/50',
    emptyText: 'ลากคำสั่งเปิดพอร์ตหรือส่งข้อความผ่าน Serial มาวางที่นี่'
  },
  {
    id: 'state',
    title: '2. คำสั่งอินพุตและจัดการ State (Input & State Logic)',
    wrapperClass: 'border-amber-400/50 hover:bg-black/40',
    titleClass: 'text-amber-300 border-amber-400/30',
    itemBgClass: 'bg-amber-600/50 border-amber-400',
    emptyTextClass: 'text-amber-200/50',
    emptyText: 'ลากคำสั่งกำหนดขาอินพุต หรือตรรกะตรวจจับสถานะ State มาวางที่นี่'
  },
  {
    id: 'sound',
    title: '3. คำสั่งควบคุมเสียงลำโพง (Piezo Buzzer Control)',
    wrapperClass: 'border-rose-400/50 hover:bg-black/40',
    titleClass: 'text-rose-300 border-rose-400/30',
    itemBgClass: 'bg-rose-600/50 border-rose-400',
    emptyTextClass: 'text-rose-200/50',
    emptyText: 'ลากคำสั่งขับเสียง tone / noTone มาวางที่นี่'
  }
]

// Game 2: Matching Game
const matchLeftTerms = [
  { id: 'l1', text: '1. Serial.begin(9600)', match: 'r1' },
  { id: 'l2', text: '2. Serial.println(data)', match: 'r2' },
  { id: 'l3', text: '3. pinMode(pin, INPUT)', match: 'r3' },
  { id: 'l4', text: '4. tone(pin, frequency)', match: 'r4' },
  { id: 'l5', text: '5. State Machine', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'คำสั่งเปิดพอร์ตสื่อสารระหว่างบอร์ดกับคอมพิวเตอร์ที่ความเร็ว 9,600 บอด (baud)' },
  { id: 'r2', text: 'ส่งข้อความหรือค่าตัวแปรออกหน้าจอ Serial Monitor แล้วตัดขึ้นบรรทัดใหม่ทันที' },
  { id: 'r3', text: 'กำหนดให้ขาพินทำหน้าที่เป็นทางเข้า (Input) เพื่อรับสัญญาณดิจิทัลจากภายนอก' },
  { id: 'r4', text: 'สร้างคลื่นสัญญาณความถี่เสียงส่งออกไปยังลำโพง Piezo Buzzer' },
  { id: 'r5', text: 'โมเดลควบคุมการทำงานของระบบที่มีสถานะชัดเจน เช่น Mode 0, 1, 2' }
]

// Game 3: PopQuiz 10 ข้อ
const quizQuestions = [
  {
    id: 1,
    question: 'คำสั่ง Serial.begin(9600); ในฟังก์ชัน setup() มีหน้าที่อย่างไร?',
    options: [
      { id: 'a', text: 'เปิดช่องทางการสื่อสารข้อมูลแบบอนุกรม (Serial) ระหว่างบอร์ดกับคอมพิวเตอร์ที่ความเร็ว 9600 บอด', isCorrect: true },
      { id: 'b', text: 'จ่ายกระแสไฟฟ้า 9600 มิลลิแอมป์ให้บอร์ด Arduino', isCorrect: false },
      { id: 'c', text: 'หน่วงเวลาการทำงานของบอร์ด 9.6 วินาที ก่อนเริ่มต้นระบบ', isCorrect: false },
      { id: 'd', text: 'กำหนดให้ขาพินหมายเลข 9600 เริ่มอ่านค่า', isCorrect: false }
    ],
    explanation: 'Serial.begin(baudRate) เป็นคำสั่งเปิดพอร์ต USB เพื่อส่ง-รับข้อมูลระหว่าง Arduino กับคอมพิวเตอร์ โดย 9600 คือ Baud Rate หรืออัตราความเร็วในการรับส่ง 9,600 บิตต่อวินาที'
  },
  {
    id: 2,
    question: 'ข้อใดอธิบายความแตกต่างระหว่าง Serial.print() กับ Serial.println() ได้ถูกต้องที่สุด?',
    options: [
      { id: 'a', text: 'Serial.println() จะขึ้นบรรทัดใหม่ (New Line) หลังแสดงผลเสร็จ ส่วน Serial.print() จะแสดงผลต่อท้ายในบรรทัดเดิม', isCorrect: true },
      { id: 'b', text: 'Serial.print() ใช้สำหรับข้อความ ส่วน Serial.println() ใช้ได้เฉพาะตัวเลข', isCorrect: false },
      { id: 'c', text: 'Serial.print() พิมพ์ลง Serial Monitor ส่วน Serial.println() ส่งข้อมูลไปยังเครื่องพิมพ์ภายนอก', isCorrect: false },
      { id: 'd', text: 'ทั้งสองคำสั่งทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง', isCorrect: false }
    ],
    explanation: 'คำสั่ง Serial.print() จะส่งข้อความออกไปโดยไม่ขึ้นบรรทัดใหม่ ทำให้สามารถต่อคำได้ ส่วน Serial.println() จะส่งรหัสขึ้นบรรทัดใหม่ (\\r\\n) ต่อท้ายเสมอ'
  },
  {
    id: 3,
    question: 'การใช้คำสั่ง Serial Monitor มีประโยชน์สำคัญที่สุดอย่างไรในขั้นตอนการพัฒนาโครงงาน Arduino?',
    options: [
      { id: 'a', text: 'ช่วยในการตรวจสอบค่าตัวแปรและ Debugging ทำให้เรา "มองเห็นความคิดของชิป" และตรวจหาจุดผิดพลาดในโค้ดได้ง่าย', isCorrect: true },
      { id: 'b', text: 'ช่วยเพิ่มความเร็วในการประมวลผลของ CPU ให้เร็วขึ้น 10 เท่า', isCorrect: false },
      { id: 'c', text: 'ช่วยประหยัดพลังงานแบตเตอรี่ของบอร์ด Arduino', isCorrect: false },
      { id: 'd', text: 'ช่วยแปลงภาษา C++ ให้เป็นไฟล์ Hex โดยอัตโนมัติ', isCorrect: false }
    ],
    explanation: 'เนื่องจากบอร์ด Arduino ไม่มีหน้าจอแสดงผลในตัว Serial Monitor จึงเป็นเครื่องมือ Debugging สำคัญที่สุดที่ช่วยให้โปรแกรมเมอร์ดูค่าเซนเซอร์และการเปลี่ยนสถานะได้แบบ Real-time'
  },
  {
    id: 4,
    question: 'ปัญหา "Contact Bouncing" ของสวิตช์ปุ่มกดคืออะไร?',
    options: [
      { id: 'a', text: 'แผ่นโลหะภายในปุ่มกดสั่นกระดอนไปมาหลายครั้งในเสี้ยววินาทีตอนกด ทำให้ไมโครคอนโทรลเลอร์ตรวจจับว่ากดปุ่มซ้ำหลายครั้ง', isCorrect: true },
      { id: 'b', text: 'สวิตช์ปุ่มกดกระเด็นหลุดออกจาก Breadboard', isCorrect: false },
      { id: 'c', text: 'แรงดันไฟฟ้าตกจนบอร์ดดับ', isCorrect: false },
      { id: 'd', text: 'ปุ่มกดค้างไม่ยอมเด้งคืน', isCorrect: false }
    ],
    explanation: 'กลไกสวิตช์เมื่อหน้าสัมผัสกระทบกัน แผ่นโลหะจะสปริงตัวสั่นกระดอน (Bounce) ประมาณ 5-20 มิลลิวินาที ทำให้สัญญาณดิจิทัลกระพริบถี่ๆ ส่งผลให้โปรแกรมเข้าใจว่ามีการกดปุ่มหลายสิบครั้ง'
  },
  {
    id: 5,
    question: 'วิธีแก้ปัญหา Contact Bouncing (Debounce) ในระดับเริ่มต้นที่ง่ายและนิยมใช้ในโค้ด Arduino คือข้อใด?',
    options: [
      { id: 'a', text: 'ใส่คำสั่ง delay(50); เล็กน้อยหลังตรวจพบการกด เพื่อรอให้การสั่นของหน้าสัมผัสโลหะนิ่งลง', isCorrect: true },
      { id: 'b', text: 'เพิ่มแรงดันไฟเป็น 9V', isCorrect: false },
      { id: 'c', text: 'เขียนคำสั่ง noTone() ซ้ำๆ', isCorrect: false },
      { id: 'd', text: 'เปลี่ยนขาพินจาก Digital เป็น Analog', isCorrect: false }
    ],
    explanation: 'Software Debounce อย่างง่ายทำได้โดยหน่วงเวลาสั้นๆ (เช่น 30-50 ms) หลังตรวจพบการกด เพื่อข้ามช่วงเวลาที่แผ่นโลหะกำลังกระดอน'
  },
  {
    id: 6,
    question: 'คำสั่ง tone(8, 1000); มีหน้าที่การทำงานอย่างไร?',
    options: [
      { id: 'a', text: 'สร้างสัญญาณเสียงความถี่ 1000 Hz (1 kHz) ออกไปยัง Piezo Buzzer ที่ต่ออยู่ขาพิน 8', isCorrect: true },
      { id: 'b', text: 'เปิดเสียงนาน 1000 วินาที', isCorrect: false },
      { id: 'c', text: 'ปรับความดังของเสียงเป็นระดับ 1000 เดซิเบล', isCorrect: false },
      { id: 'd', text: 'ตรวจจับเสียงความถี่ 1000 Hz จากไมโครโฟน', isCorrect: false }
    ],
    explanation: 'พารามิเตอร์ตัวแรกคือหมายเลขขาพิน (Pin 8) และพารามิเตอร์ตัวที่สองคือความถี่เสียงในหน่วย Hertz (1000 Hz เป็นเสียงโทนแหลมปานกลาง)'
  },
  {
    id: 7,
    question: 'หากต้องการสั่งให้ Piezo Buzzer ที่ต่ออยู่ขาพิน 8 "หยุดส่งเสียงทันที" ต้องใช้คำสั่งใด?',
    options: [
      { id: 'a', text: 'noTone(8);', isCorrect: true },
      { id: 'b', text: 'digitalWrite(8, LOW);', isCorrect: false },
      { id: 'c', text: 'tone(8, 0);', isCorrect: false },
      { id: 'd', text: 'stopSound(8);', isCorrect: false }
    ],
    explanation: 'คำสั่ง noTone(pin) เป็นคำสั่งมาตรฐานของ Arduino ในการหยุดตัวสร้างสัญญาณความถี่ (Timer) บนขาพินนั้นๆ'
  },
  {
    id: 8,
    question: 'ในโปรแกรมจำลอง Autodesk Tinkercad Circuits หากต้องการเปิดดูข้อความที่ส่งออกมาด้วยคำสั่ง Serial ต้องทำอย่างไร?',
    options: [
      { id: 'a', text: 'คลิกแถบ Code ด้านบน แล้วกดปุ่ม "Serial Monitor" ที่แถบด้านล่างของหน้าต่างโค้ด', isCorrect: true },
      { id: 'b', text: 'ต้องนำจอ LCD 16x2 มาต่อเพิ่มในวงจรเท่านั้น', isCorrect: false },
      { id: 'c', text: 'กดปุ่ม Export ด้านบนขวาเพื่อดาวน์โหลดไฟล์ข้อความ', isCorrect: false },
      { id: 'd', text: 'บน Tinkercad ไม่สามารถดู Serial Monitor ได้ ต้องใช้บอร์ดจริงเท่านั้น', isCorrect: false }
    ],
    explanation: 'ใน Autodesk Tinkercad Circuits หน้าต่าง Serial Monitor จะซ่อนอยู่ที่แถบด้านล่างสุดของหน้าต่าง Code เมื่อกดเปิดและเริ่ม Simulation ข้อความจะแสดงผลทันที'
  },
  {
    id: 9,
    question: 'หากต้องการสร้างสวิตช์ปุ่มกดที่กด 1 ครั้ง "เปิดระบบ" และกดอีก 1 ครั้ง "ปิดระบบ" (Toggle State) ต้องเก็บค่าสถานะอย่างไร?',
    options: [
      { id: 'a', text: 'ใช้ตัวแปรแบบบูลีน เช่น isSystemOn = !isSystemOn; สลับค่าจริง-เท็จทุกครั้งที่ตรวจพบ Falling Edge', isCorrect: true },
      { id: 'b', text: 'ใช้คำสั่ง while(true) วนลูปไม่สิ้นสุด', isCorrect: false },
      { id: 'c', text: 'ต้องตัดสายไฟทิ้งเมื่อต้องการปิด', isCorrect: false },
      { id: 'd', text: 'ใช้คำสั่ง analogRead() ตรวจสอบอุณหภูมิ', isCorrect: false }
    ],
    explanation: 'Toggle State นิยมใช้ตัวแปร bool หรือ int เพื่อจำสถานะปัจจุบัน เมื่อมีการกดปุ่มจะกลับค่าสถานะตรงข้าม (NOT) ทำให้สลับเปิด-ปิดได้เหมือนสวิตช์ไฟบ้าน'
  },
  {
    id: 10,
    question: 'คำสั่ง state = (state + 1) % 3; นิยมใช้ในกรณีใดสำหรับระบบ State Machine?',
    options: [
      { id: 'a', text: 'การวนสลับโหมดการทำงาน 3 สถานะ (0 -> 1 -> 2 -> 0 วนไปเรื่อยๆ) เมื่อมีการกดปุ่ม', isCorrect: true },
      { id: 'b', text: 'การเพิ่มความเร็วของไฟกระพริบ 3 เท่า', isCorrect: false },
      { id: 'c', text: 'การแบ่งแรงดันไฟ 5V ออกเป็น 3 ส่วน', isCorrect: false },
      { id: 'd', text: 'การลบข้อมูลในหน่วยความจำทิ้ง 30%', isCorrect: false }
    ],
    explanation: 'ตัวดำเนินการ Modulo (%) จะช่วยวนลูปตัวเลข เมื่อ state ถึง 3 ตัวเศษจะกลายเป็น 0 ทำให้เราสร้าง State Machine หมุนเวียนโหมด 0, 1, 2 ได้อย่างกระชับและแม่นยำ'
  }
]

// Code Snippets for Labs
const lab1Code = `// Lab 1: Smart Doorbell (กริ่งประตูอัจฉริยะ)
// กดปุ่มค้าง -> ไฟ LED ติด + Buzzer ดังติ๊ด, ปล่อยมือ -> ดับทันที
const int BUTTON_PIN = 2; // สวิตช์ปุ่มกด (ต่อลง GND)
const int LED_PIN = 13;   // หลอด LED
const int BUZZER_PIN = 8; // ลำโพง Piezo Buzzer

void setup() {
  pinMode(BUTTON_PIN, INPUT); // กำหนดขาปุ่มกดเป็นอินพุต
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  // เมื่อกดปุ่ม
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH); // เปิดไฟ LED
    tone(BUZZER_PIN, 1000);      // ส่งเสียงกริ่งความถี่ 1000 Hz
  } else {
    digitalWrite(LED_PIN, LOW);  // ปิดไฟ LED
    noTone(BUZZER_PIN);          // ปิดเสียงลำโพง
  }
}`

const lab2Code = `// Lab 2: Toggle Alarm Switch (สวิตช์เปิด-ปิดสัญญาณเตือนภัย + Debounce)
// กด 1 ครั้ง -> เปิดระบบเตือนภัยค้างไว้, กดอีก 1 ครั้ง -> ปิดระบบ
const int BUTTON_PIN = 2;
const int LED_PIN = 13;
const int BUZZER_PIN = 8;

bool isAlarmActive = false; // ตัวแปรจำสถานะ (State Variable)
int lastButtonState = HIGH; // บันทึกสถานะก่อนหน้าเพื่อตรวจจับ Falling Edge

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  int currentButtonState = digitalRead(BUTTON_PIN);

  // ตรวจจับจังหวะเริ่มกดปุ่ม (Falling Edge: เดิมเป็น HIGH เปลี่ยนเป็น LOW)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    isAlarmActive = !isAlarmActive; // สลับสถานะเปิด-ปิด (Toggle)
    delay(50); // Software Debounce ป้องกันหน้าสัมผัสกระเด้ง
  }
  lastButtonState = currentButtonState;

  // ทำงานตาม State ปัจจุบัน
  if (isAlarmActive) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1500); // ส่งเสียงเตือนค้างไว้
  } else {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }
}`

const lab3Code = `// Lab 3: Smart Traffic Light & Pedestrian Crossing with Buzzer
// ระบบไฟจราจรคนข้ามถนนอัจฉริยะ 3 สี พร้อมปุ่มกดและสัญญาณเสียง
const int BUTTON_PIN = 2; // สวิตช์ปุ่มกด (กำหนดโหมด INPUT)
const int BUZZER_PIN = 8; // ลำโพง Piezo Buzzer
const int RED_LED = 12;   // หลอด LED สีแดง
const int YELLOW_LED = 11;// หลอด LED สีเหลือง
const int GREEN_LED = 10; // หลอด LED สีเขียว

int trafficState = 0; // 0 = ไฟแดง (หยุด), 1 = ไฟเขียว (ไปได้)
int lastButtonState = HIGH;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  // เริ่มต้น: ไฟแดงติด ไฟเหลือง/เขียวดับ ลำโพงดับ
  digitalWrite(RED_LED, HIGH);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
  noTone(BUZZER_PIN);
}

void loop() {
  int currentButtonState = digitalRead(BUTTON_PIN);

  // ตรวจจับการกดปุ่มแบบ Falling Edge (เดิม HIGH กลายเป็น LOW)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    delay(50); // Software Debounce กรองสัญญาณหน้าสัมผัสกระดอน

    if (trafficState == 0) {
      // === State แรก: "ไปได้" ===
      // กดปุ่มแล้วไฟสีแดงดับ ไฟสีเขียวติดสว่าง พร้อม Buzzer ดังยาว 3 วินาที
      digitalWrite(RED_LED, LOW);
      digitalWrite(GREEN_LED, HIGH);
      tone(BUZZER_PIN, 1000); // Buzzer ส่งเสียงดังต่อเนื่อง
      delay(3000);            // ค้างเสียงยาว 3 วินาที
      noTone(BUZZER_PIN);     // หยุดเสียง แต่ไฟสีเขียวยังคงติดสว่างอยู่

      trafficState = 1; // สลับสถานะเป็นไฟเขียวค้าง
    } 
    else if (trafficState == 1) {
      // === State เตือนและเปลี่ยนกลับเป็นไฟแดง ===
      // 1. ไฟสีเขียวกระพริบ 3 ครั้ง โดยที่ Buzzer ส่งเสียงตามจังหวะกระพริบ
      for (int i = 0; i < 3; i++) {
        digitalWrite(GREEN_LED, HIGH);
        tone(BUZZER_PIN, 1000);
        delay(400);
        digitalWrite(GREEN_LED, LOW);
        noTone(BUZZER_PIN);
        delay(400);
      }

      // 2. เปลี่ยนเป็นไฟสีเหลืองติดค้าง 3 วินาที พร้อม Buzzer ดังยาว
      digitalWrite(YELLOW_LED, HIGH);
      tone(BUZZER_PIN, 1500); // เสียงเตือนความถี่ 1500 Hz
      delay(3000);            // ค้างไฟเหลืองและเสียงยาว 3 วินาที
      noTone(BUZZER_PIN);
      digitalWrite(YELLOW_LED, LOW);

      // 3. เปลี่ยนเป็นไฟสีแดงติดสว่าง และ Buzzer ดับสนิท
      digitalWrite(RED_LED, HIGH);

      trafficState = 0; // กลับสู่สถานะเริ่มต้น (ไฟแดง)
    }
  }

  lastButtonState = currentButtonState;
}`

// ==============================================================
// INTERACTIVE TRAFFIC LIGHT & BUZZER SIMULATOR
// ==============================================================
const simState = ref(0) // 0 = Standby/Red, 1 = Go/Green, 2 = Warning/Transition
const simRed = ref(true)
const simYellow = ref(false)
const simGreen = ref(false)
const simBuzzer = ref(false)
const simBuzzerFreq = ref(1000)
const simIsBusy = ref(false)
const simAudioEnabled = ref(false) // เริ่มต้นปิดเสียงไว้เพื่อไม่ให้รบกวน สามารถกดเปิดได้
const simStatusText = ref('สถานะเริ่มต้น (State 0): ไฟสีแดงติดค้าง ห้ามข้าม / รอคนกดปุ่ม')
const simSerialLogs = ref([
  { time: '00:00', text: 'System Initialized: Red Light ON, Buzzer OFF (State 0)' }
])

let simTimeouts = []
let audioCtx = null
let currentContinuousOsc = null

const playSimTone = (freq, durationMs) => {
  if (!simAudioEnabled.value) return
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    if (durationMs) {
      osc.stop(audioCtx.currentTime + durationMs / 1000)
    }
  } catch (e) {}
}

const startSimContinuousTone = (freq) => {
  stopSimContinuousTone()
  if (!simAudioEnabled.value) return
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    currentContinuousOsc = osc
  } catch (e) {}
}

const stopSimContinuousTone = () => {
  try {
    if (currentContinuousOsc) {
      currentContinuousOsc.stop()
      currentContinuousOsc.disconnect()
      currentContinuousOsc = null
    }
  } catch (e) {}
}

const addSimLog = (msg) => {
  const now = new Date()
  const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  simSerialLogs.value.unshift({ time: timeStr, text: msg })
  if (simSerialLogs.value.length > 8) {
    simSerialLogs.value.pop()
  }
}

const clearAllSimTimeouts = () => {
  simTimeouts.forEach(t => clearTimeout(t))
  simTimeouts = []
  stopSimContinuousTone()
}

// ผู้ใช้กดปุ่มจำลอง
const handleSimButtonPress = () => {
  if (simIsBusy.value) return // ถ้าแอนิเมชันกำลังทำงานอยู่ให้รอจนเสร็จ

  if (simState.value === 0) {
    // === กดครั้งที่ 1: เปลี่ยนเป็น State 1 (ไฟเขียวติด + Buzzer ดังยาว 3 วิ) ===
    simIsBusy.value = true
    simRed.value = false
    simYellow.value = false
    simGreen.value = true
    simBuzzer.value = true
    simBuzzerFreq.value = 1000
    startSimContinuousTone(1000)
    simStatusText.value = 'State 1 (ไปได้): ไฟเขียวติดสว่าง + Buzzer ส่งเสียงยาว 3 วินาที...'
    addSimLog('[EVENT] กดปุ่มครั้งที่ 1 -> ไฟแดงดับ, ไฟเขียวติด, Buzzer 1000Hz ทำงาน 3 วินาที')

    const t1 = setTimeout(() => {
      stopSimContinuousTone()
      simBuzzer.value = false
      simGreen.value = true // ยังคงติดค้างไว้!
      simState.value = 1
      simIsBusy.value = false
      simStatusText.value = 'State 1 (ไปได้): เสียง Buzzer หยุดลง แต่ไฟเขียวยังคงติดค้างไว้ (พร้อมให้กดปุ่มอีกครั้ง)'
      addSimLog('[INFO] ครบ 3 วินาที -> Buzzer ดับ, ไฟเขียวติดค้างต่อเนื่อง (State 1)')
    }, 3000)
    simTimeouts.push(t1)
  }
  else if (simState.value === 1) {
    // === กดครั้งที่ 2: เปลี่ยนเป็น State 2 (เขียวกระพริบ 3 ครั้ง -> เหลืองค้าง 3 วิ -> แดงติด) ===
    simIsBusy.value = true
    simState.value = 2
    simStatusText.value = 'State 2: ไฟสีเขียวกระพริบ 3 ครั้ง พร้อม Buzzer ดังตามจังหวะ...'
    addSimLog('[EVENT] กดปุ่มครั้งที่ 2 -> เริ่มต้นสัญญาณเตือน (ไฟเขียวกระพริบ 3 ครั้ง)')

    // รอบกระพริบ 3 ครั้ง (แต่ละรอบ 800ms: ติด 400ms / ดับ 400ms)
    // รอบที่ 1
    simGreen.value = true
    simBuzzer.value = true
    simBuzzerFreq.value = 1000
    playSimTone(1000, 350)

    const b1_off = setTimeout(() => {
      simGreen.value = false
      simBuzzer.value = false
    }, 400)

    // รอบที่ 2
    const b2_on = setTimeout(() => {
      simGreen.value = true
      simBuzzer.value = true
      playSimTone(1000, 350)
    }, 800)
    const b2_off = setTimeout(() => {
      simGreen.value = false
      simBuzzer.value = false
    }, 1200)

    // รอบที่ 3
    const b3_on = setTimeout(() => {
      simGreen.value = true
      simBuzzer.value = true
      playSimTone(1000, 350)
    }, 1600)
    const b3_off = setTimeout(() => {
      simGreen.value = false
      simBuzzer.value = false
    }, 2000)

    // ช่วงที่ 2: ไฟสีเหลืองติดค้าง 3 วินาที พร้อม Buzzer ดังยาว
    const yellow_start = setTimeout(() => {
      simGreen.value = false
      simYellow.value = true
      simBuzzer.value = true
      simBuzzerFreq.value = 1500
      startSimContinuousTone(1500)
      simStatusText.value = 'State 2: ไฟสีเหลืองติดค้าง 3 วินาที พร้อม Buzzer ส่งเสียงยาวเตือน...'
      addSimLog('[INFO] ไฟเขียวดับ -> ไฟเหลืองติดค้าง 3 วินาที + Buzzer 1500Hz ดังยาว')
    }, 2400)

    // ช่วงที่ 3: สลับกลับเป็นไฟแดงติดสว่าง และ Buzzer ดับสนิท (กลับสู่ State 0)
    const red_return = setTimeout(() => {
      stopSimContinuousTone()
      simBuzzer.value = false
      simYellow.value = false
      simRed.value = true
      simState.value = 0
      simIsBusy.value = false
      simStatusText.value = 'กลับสู่สถานะเริ่มต้น (State 0): ไฟสีแดงติดสว่าง และ Buzzer ดับสนิท พร้อมเริ่มรอบใหม่'
      addSimLog('[DONE] สลับกลับสู่ไฟแดงติดสว่าง, Buzzer ดับสนิท (กลับสู่ State 0)')
    }, 5400)

    simTimeouts.push(b1_off, b2_on, b2_off, b3_on, b3_off, yellow_start, red_return)
  }
}

const resetSim = () => {
  clearAllSimTimeouts()
  simState.value = 0
  simRed.value = true
  simYellow.value = false
  simGreen.value = false
  simBuzzer.value = false
  simIsBusy.value = false
  simStatusText.value = 'รีเซ็ตระบบ -> สถานะเริ่มต้น (State 0): ไฟสีแดงติดค้าง ห้ามข้าม / รอคนกดปุ่ม'
  addSimLog('[RESET] รีเซ็ตระบบกลับสู่สถานะเริ่มต้น (State 0: ไฟแดง)')
}

const toggleSimAudio = () => {
  simAudioEnabled.value = !simAudioEnabled.value
  if (!simAudioEnabled.value) {
    stopSimContinuousTone()
  } else if (simBuzzer.value) {
    startSimContinuousTone(simBuzzerFreq.value)
  }
}

onUnmounted(() => {
  clearAllSimTimeouts()
  if (audioCtx) {
    try { audioCtx.close() } catch (e) {}
  }
})
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Course Breadcrumb & Navigation -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-stone-200 shadow-xs">
      <div class="flex items-center gap-2 text-xs font-bold text-stone-600">
        <button @click="router.push('/subjects')" class="hover:text-amber-600 transition-colors cursor-pointer">
          วิชาทั้งหมด
        </button>
        <ChevronRight class="w-3.5 h-3.5 text-stone-400" />
        <button @click="router.push('/course/21901-2007')"
          class="hover:text-amber-600 transition-colors cursor-pointer">
          เทคโนโลยีระบบสมองกลฝังตัวและไอโอที (21901-2007)
        </button>
        <ChevronRight class="w-3.5 h-3.5 text-stone-400" />
        <span class="text-amber-700 font-black">สัปดาห์ที่ 3</span>
      </div>

      <div class="flex items-center gap-2">
        <button v-if="isTeacher" @click="showTeacherModal = true"
          class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
          <Trophy class="w-3.5 h-3.5" />
          <span>กระดานคะแนนห้องเรียน (Teacher)</span>
        </button>
      </div>
    </div>

    <!-- Page Header (Amber / Tinkercad Theme) -->
    <div
      class="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
      <!-- Glow & Decors -->
      <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div class="absolute right-12 top-6 opacity-20 pointer-events-none hidden md:block">
        <BellRing class="w-48 h-48 text-white" />
      </div>

      <div class="relative z-10 max-w-3xl space-y-3">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-black backdrop-blur-xs border border-white/10">
          <Cpu class="w-3.5 h-3.5" />
          <span>สัปดาห์ที่ 3 • Hardware Interaction, Serial Monitor & Sound Simulation</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          ดิจิทัลอินพุต (Push Button), การสื่อสารผ่าน Serial Monitor, การควบคุมสถานะ (State) และลำโพงบัซเซอร์ (Piezo Buzzer) บน Tinkercad
        </h1>

        <p class="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed">
          ต่อยอดจากหลอด LED สัปดาห์ก่อน! สัปดาห์นี้เราเริ่มรับข้อมูลจากโลกภายนอกผ่านสวิตช์ปุ่มกด (Push Button)
          เรียนรู้การตั้งค่าและการสื่อสารผ่าน Serial Monitor (Serial.begin, Serial.print, Serial.println), การอ่านสถานะและ Debug การทำงานของระบบแบบ Real-Time, การจัดการตัวแปรสถานะ (State Control)
          และพาเล่นอุปกรณ์ชิ้นใหม่ <strong>Piezo Buzzer (ลำโพงบัซเซอร์)</strong>
          เพื่อสร้างระบบส่งสัญญาณเสียงแจ้งเตือนอัจฉริยะบน Tinkercad
        </p>

        <!-- Quick Specs Badges -->
        <div class="pt-2 flex flex-wrap gap-2 text-xs font-bold">
          <span
            class="px-2.5 py-1 rounded-lg bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <ToggleLeft class="w-3.5 h-3.5 text-amber-300" />
            Push Button & Digital Input
          </span>
          <span
            class="px-2.5 py-1 rounded-lg bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Terminal class="w-3.5 h-3.5 text-amber-300" />
            Serial Monitor & Debugging
          </span>
          <span
            class="px-2.5 py-1 rounded-lg bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <SlidersVertical class="w-3.5 h-3.5 text-amber-300" />
            Finite State Machine (FSM)
          </span>
          <span
            class="px-2.5 py-1 rounded-lg bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Volume2 class="w-3.5 h-3.5 text-amber-300" />
            Piezo Buzzer (tone / noTone)
          </span>
          <span
            class="px-2.5 py-1 rounded-lg bg-white/15 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
            <Globe class="w-3.5 h-3.5 text-amber-300" />
            Autodesk Tinkercad Circuits
          </span>
        </div>
      </div>
    </div>

    <!-- Check-in System Bar -->
    <CheckInSystem :course-id="currentCourseId" :week="currentWeek" />

    <!-- ============================================================== -->
    <!-- SECTION 1: SERIAL COMMUNICATION & SERIAL MONITOR DEBUGGING -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      <div class="flex items-center gap-3 border-b border-stone-100 pb-4">
        <div
          class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
          <Terminal class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-stone-800">
            1. การสื่อสารและการอ่านสถานะผ่าน Serial Monitor (Serial Communication & Debugging)
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 font-semibold">
            ทำความเข้าใจการเปิดพอร์ต Serial.begin(), การใช้คำสั่งส่งออกข้อมูล Serial.print() / Serial.println() และวิธีเปิดดูผลลัพธ์บน Tinkercad
          </p>
        </div>
      </div>

      <!-- Why Serial Monitor is the "Eyes" of Embedded Systems -->
      <div
        class="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-2">
        <h3 class="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-2">
          <Lightbulb class="w-5 h-5 text-emerald-600" />
          ทำไม Serial Monitor ถึงเป็น "ดวงตาและเครื่องมือที่ดีที่สุด" ของนักพัฒนาบอร์ดสมองกล?
        </h3>
        <p class="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          เนื่องจากบอร์ด Arduino Uno เป็นไมโครคอนโทรลเลอร์ขนาดเล็กที่ <strong>ไม่มีหน้าจอแสดงผลภาพ (Display) ในตัว</strong> เมื่อเราต่อเซนเซอร์หรือปุ่มกด เราจะไม่สามารถมองเห็นด้วยตาเปล่าได้เลยว่า บอร์ดกำลังคิดอะไรอยู่ อ่านค่าแรงดันได้เท่าไหร่ หรือโค้ดกำลังทำงานติดขัดตรงจุดไหน
          การสื่อสารผ่าน <strong>Serial Communication</strong> จึงเป็นช่องทางเชื่อมโยงหลักผ่านสาย USB ที่ส่งค่าจากชิปขึ้นมาแสดงผลเป็นข้อความบนหน้าจอคอมพิวเตอร์ ทำให้นักพัฒนาสามารถ <strong>"อ่านสถานะและ Debug การทำงานของระบบได้แบบ Real-Time"</strong>
        </p>
      </div>

      <!-- 3 Foundation Pillars of Serial Communication -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Pillar 1: Configuration in setup() -->
        <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div class="flex items-center gap-2 text-stone-800">
            <Zap class="w-5 h-5 text-emerald-600" />
            <h3 class="font-black text-base">1. การตั้งค่าใน void setup()</h3>
          </div>
          <p class="text-xs text-stone-600 font-medium leading-relaxed">
            ก่อนเริ่มสื่อสาร เราต้องสั่งเปิดพอร์ตด้วยคำสั่ง <code>Serial.begin(baudRate);</code> ในฟังก์ชัน <code>setup()</code> เสมอ เพื่อกำหนด <strong>Baud Rate (ความเร็วในการส่งข้อมูล)</strong> เช่น <strong>9600 บอด</strong> (ส่งข้อมูล 9,600 บิตต่อวินาที)
          </p>
          <div class="bg-stone-900 p-2.5 rounded-xl border border-stone-800 font-mono text-xs text-white">
            <span class="text-amber-300 font-bold">Serial</span>.<span class="text-cyan-300 font-semibold">begin</span>(<span class="text-orange-400 font-bold">9600</span>);
          </div>
          <p class="text-[11px] text-stone-500 italic">
            * กฎเหล็ก: อัตรา Baud Rate ในโค้ด และในหน้าต่าง Serial Monitor ต้องเป็นเลขเดียวกันเสมอ
          </p>
        </div>

        <!-- Pillar 2: Serial.print vs Serial.println -->
        <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div class="flex items-center gap-2 text-stone-800">
            <FileCode2 class="w-5 h-5 text-blue-600" />
            <h3 class="font-black text-base">2. print() vs println() ต่างกันอย่างไร?</h3>
          </div>
          <p class="text-xs text-stone-600 font-medium leading-relaxed">
            - <strong>Serial.print(data):</strong> พิมพ์ข้อมูลออกไปโดย <strong>ไม่ขึ้นบรรทัดใหม่</strong> (เคอร์เซอร์รออยู่ที่ท้ายข้อความ เหมาะสำหรับพิมพ์คำนำหน้าหรือตัวเชื่อม)<br>
            - <strong>Serial.println(data):</strong> ย่อมาจาก Print Line พิมพ์ข้อมูลเสร็จแล้ว <strong>ตัดขึ้นบรรทัดใหม่ทันที</strong>
          </p>
          <div class="bg-stone-900 p-2.5 rounded-xl border border-stone-800 font-mono text-xs text-white space-y-1">
            <p><span class="text-amber-300 font-bold">Serial</span>.<span class="text-cyan-300">print</span>(<span class="text-emerald-300">"Button: "</span>);</p>
            <p><span class="text-amber-300 font-bold">Serial</span>.<span class="text-cyan-300">println</span>(<span class="text-blue-200">buttonVal</span>);</p>
          </div>
          <p class="text-[11px] text-stone-500 italic">
            * รวมกันเป็นคู่ Key-Value: "Button: 1" แล้วตัดขึ้นบรรทัดใหม่
          </p>
        </div>

        <!-- Pillar 3: Data Types Sent via Serial -->
        <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div class="flex items-center gap-2 text-stone-800">
            <Boxes class="w-5 h-5 text-indigo-600" />
            <h3 class="font-black text-base">3. ข้อมูลที่ส่งออกทาง Serial</h3>
          </div>
          <p class="text-xs text-stone-600 font-medium leading-relaxed">
            เราสามารถส่งออกข้อมูลได้หลากหลายรูปแบบขึ้นอยู่กับสิ่งที่เราต้องการตรวจสอบ:
          </p>
          <ul class="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
            <li><strong>ข้อความสตริง (Text):</strong> ต้องอยู่ในเครื่องหมายคำพูดคู่ เช่น <code>"System Ready!"</code></li>
            <li><strong>ตัวแปร (Variables):</strong> ระบุชื่อตัวแปรโดยไม่มีเครื่องหมายคำพูด เช่น <code>buttonVal</code> หรือ <code>systemState</code></li>
            <li><strong>ตัวเลข (Numbers):</strong> เช่น ตัวเลขค่าความถี่เสียง หรือตัวเลขบอกโหมด <code>0, 1, 2</code></li>
          </ul>
        </div>
      </div>

      <!-- Deep Dive: Baud Rate Levels & Real-World Selection Guide -->
      <div class="p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white border border-stone-800 shadow-xl space-y-5">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Gauge class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-white">
                เจาะลึก Baud Rate: อัตราความเร็วในการสื่อสาร ระดับต่างๆ และการเลือกใช้งาน
              </h3>
              <p class="text-xs text-stone-400 font-medium">
                ทำความเข้าใจหน่วยวัดความเร็ว bps, สาเหตุที่ข้อความกลายเป็นภาษาต่างดาว และเกณฑ์การเลือกความเร็วให้เหมาะกับงาน
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
            Serial Speed Guide
          </span>
        </div>

        <!-- Concept & Explanation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-2">
            <h4 class="font-bold text-amber-300 flex items-center gap-2">
              <Zap class="w-4 h-4 text-amber-400" />
              Baud Rate คืออะไร และทำงานอย่างไร?
            </h4>
            <p class="text-stone-300 leading-relaxed">
              <strong>Baud Rate (บอดเรต)</strong> คือ <strong>อัตราความเร็วในการส่งข้อมูลผ่านพอร์ต Serial</strong> วัดเป็นจำนวนสัญลักษณ์ต่อวินาที (Symbols per second) ซึ่งในระบบ UART ดิจิทัล 1 สัญลักษณ์มีค่าเท่ากับ 1 บิต จึงเทียบเท่ากับ <strong>บิตต่อวินาที (bps: bits per second)</strong>
            </p>
            <p class="text-stone-400 text-[11px] leading-relaxed">
              * การคำนวณ: 1 ตัวอักษรใช้ 10 บิต (8 Data + 1 Start + 1 Stop) ดังนั้นที่ <strong>9600 baud</strong> จะส่งข้อมูลได้ประมาณ <code>9,600 / 10 = 960 ตัวอักษรต่อวินาที</code>
            </p>
          </div>

          <div class="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <h4 class="font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-rose-400" />
              ทำไมตั้งค่าไม่ตรงกันแล้วกลายเป็นภาษาต่างดาว (Garbage Characters)?
            </h4>
            <p class="text-stone-300 leading-relaxed">
              การสื่อสารแบบ Serial <strong>ไม่มีสายสัญญาณนาฬิกา (No Clock Line)</strong> ส่งไปด้วย ทั้งสองฝั่งจึงต้องนับจังหวะเวลาในการสุ่มอ่านแรงดันไฟฟ้าด้วยความเร็วที่ตกลงกันไว้ล่วงหน้า
            </p>
            <p class="text-stone-400 text-[11px] leading-relaxed">
              หากโค้ดเขียน <code>Serial.begin(9600)</code> แต่หน้าต่าง Serial Monitor ตั้งไว้ที่ 115200 ฝั่งรับจะอ่านข้อมูลเร็วเกินไป ทำให้รหัสบิตคลาดเคลื่อนและแสดงผลเป็นอักขระสัญลักษณ์ที่อ่านไม่ออกทันที
            </p>
          </div>
        </div>

        <!-- Baud Rate Levels Table -->
        <div class="space-y-2">
          <h4 class="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Layers class="w-4 h-4 text-amber-400" />
            ตารางเปรียบเทียบระดับ Baud Rate ยอดนิยมและงานที่เหมาะสม
          </h4>
          <div class="overflow-x-auto rounded-xl border border-stone-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-stone-800/80 text-stone-300 font-mono text-[11px] uppercase border-b border-stone-700">
                <tr>
                  <th class="p-3">ระดับความเร็ว</th>
                  <th class="p-3">Baud Rate (bps)</th>
                  <th class="p-3">ความเร็วเฉลี่ย</th>
                  <th class="p-3">สภาพแวดล้อมที่เหมาะสม</th>
                  <th class="p-3">อุปกรณ์และลักษณะงานที่นิยมใช้</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-800 font-mono text-[11px] text-stone-300">
                <tr class="hover:bg-white/5">
                  <td class="p-3 font-bold text-sky-400">ความเร็วต่ำมาก</td>
                  <td class="p-3 text-white font-bold">1200 - 4800</td>
                  <td class="p-3 text-stone-400">~120 - 480 B/s</td>
                  <td class="p-3 text-stone-400 font-sans">สายยาวมาก, คลื่นวิทยุความถี่ต่ำ, สัญญาณรบกวนสูง</td>
                  <td class="p-3 font-sans text-stone-200">ระบบสื่อสารระยะไกล LoRa, สายสัญญาณโรงงาน RS-485 / Modbus ทางไกล</td>
                </tr>
                <tr class="hover:bg-white/5 bg-amber-500/10">
                  <td class="p-3 font-bold text-amber-400">มาตรฐานเริ่มต้น (Default)</td>
                  <td class="p-3 text-amber-300 font-bold">9600</td>
                  <td class="p-3 text-amber-200">~960 B/s</td>
                  <td class="p-3 text-stone-300 font-sans">เสถียรภาพสูงสุด ใช้ได้กับบอร์ดทุกชนิดและจำลองบนเว็บ</td>
                  <td class="p-3 font-sans text-white font-semibold">ค่ามาตรฐานของ Arduino Uno, Tinkercad, โมดูล GPS (NEO-6M), บลูทูธ HC-05</td>
                </tr>
                <tr class="hover:bg-white/5">
                  <td class="p-3 font-bold text-emerald-400">ความเร็วปานกลาง</td>
                  <td class="p-3 text-white font-bold">19200 - 57600</td>
                  <td class="p-3 text-stone-400">~1.9k - 5.7k B/s</td>
                  <td class="p-3 text-stone-400 font-sans">อุปกรณ์สื่อสารไร้สายระยะกลาง, บอร์ดประมวลผลขนาดเล็ก</td>
                  <td class="p-3 font-sans text-stone-200">โหมดตั้งค่า AT Command ของบลูทูธ (38400), บูตโหลดเดอร์บอร์ด Arduino Pro Mini</td>
                </tr>
                <tr class="hover:bg-white/5 bg-emerald-500/10">
                  <td class="p-3 font-bold text-emerald-300">ความเร็วสูงยอดนิยม</td>
                  <td class="p-3 text-emerald-300 font-bold">115200</td>
                  <td class="p-3 text-emerald-200">~11.5 kB/s</td>
                  <td class="p-3 text-stone-300 font-sans">ชิปรุ่นใหม่ความเร็วสูง สายต่อสั้น ข้อมูล Debug ยาว</td>
                  <td class="p-3 font-sans text-white font-semibold">ค่ามาตรฐานของบอร์ด ESP8266, ESP32, STM32, RP2040, ส่งข้อมูล JSON งาน IoT</td>
                </tr>
                <tr class="hover:bg-white/5">
                  <td class="p-3 font-bold text-purple-400">ความเร็วสูงพิเศษ</td>
                  <td class="p-3 text-white font-bold">230400 - 921600+</td>
                  <td class="p-3 text-stone-400">~23k - 92k+ B/s</td>
                  <td class="p-3 text-stone-400 font-sans">สายสั้นมาก มีชิลด์ป้องกันสัญญาณรบกวน บอร์ดประสิทธิภาพสูง</td>
                  <td class="p-3 font-sans text-stone-200">กล้องส่งภาพ ESP32-CAM, สตรีมเซนเซอร์ไจโร/วัดความเร่ง (IMU) ความถี่สูง, Flash Firmware เร็วสูง</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3 Practical Selection Criteria Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div class="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <h5 class="font-bold text-amber-300 flex items-center gap-1.5">
              <Cpu class="w-4 h-4 text-amber-400" />
              1. ดูสเปกของโมดูลภายนอก
            </h5>
            <p class="text-stone-300 text-[11px] leading-relaxed">
              เมื่อต่อเซนเซอร์หรืออุปกรณ์ภายนอก เช่น GPS หรือ Bluetooth ต้องเปิดดู Datasheet ว่าโรงงานตั้ง Baud Rate เริ่มต้นไว้เท่าใด แล้วเขียนโค้ดให้ตรงกัน
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <h5 class="font-bold text-emerald-300 flex items-center gap-1.5">
              <Cable class="w-4 h-4 text-emerald-400" />
              2. ความยาวสายและสัญญาณรบกวน
            </h5>
            <p class="text-stone-300 text-[11px] leading-relaxed">
              สายส่งสัญญาณยิ่งยาว ค่าความจุไฟฟ้าในสายจะทำให้คลื่นสัญญาณเพี้ยน จึงต้องลด Baud Rate ลงให้ต่ำเพื่อความเสถียร ส่วนสาย USB สั้นใช้ความเร็วสูงได้สบาย
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <h5 class="font-bold text-indigo-300 flex items-center gap-1.5">
              <Activity class="w-4 h-4 text-indigo-400" />
              3. ผลต่อความเร็ว CPU (Blocking)
            </h5>
            <p class="text-stone-300 text-[11px] leading-relaxed">
              หากส่งข้อความยาวๆ ที่ Baud Rate ต่ำ โปรแกรมอาจต้องหยุดรอจนกว่าข้อมูลจะพ้นบัฟเฟอร์ การใช้ความเร็วสูงขึ้นจะช่วยให้ชิปทำงานในฟังก์ชัน loop() ได้ลื่นไหลขึ้น
            </p>
          </div>
        </div>
      </div>

      <!-- Simple Serial Reading Demonstration & Step-by-Step Walkthrough -->
      <div class="rounded-2xl bg-stone-950 p-6 text-white space-y-5 border border-stone-800 shadow-xl font-mono">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div class="flex items-center gap-2">
            <Terminal class="w-5 h-5 text-emerald-400" />
            <div>
              <h3 class="text-sm sm:text-base font-bold text-white">
                ตัวอย่างโค้ดพื้นฐาน: อ่านค่าปุ่มกดและแสดงผลออกทาง Serial Monitor
              </h3>
              <p class="text-[11px] text-stone-400 font-sans font-normal">
                โค้ดเริ่มต้นที่เรียบง่ายที่สุด สำหรับฝึกอ่านค่าสถานะปุ่มกด (0 หรือ 1) ทุกๆ 1 วินาที
              </p>
            </div>
          </div>
          <button
            @click="copyCode('serialDemo', serialDemoCode)"
            class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-950 hover:text-emerald-300 border border-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Check v-if="copiedLab === 'serialDemo'" class="w-3.5 h-3.5 text-emerald-400" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copiedLab === 'serialDemo' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดอ่านค่า Serial' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <!-- Simple Code snippet -->
          <div class="bg-black/60 p-4 rounded-xl border border-white/10 space-y-2">
            <span class="text-stone-400 text-[11px] uppercase tracking-wider block font-bold">// โค้ดอ่านค่า Serial พื้นฐาน:</span>
            <pre class="text-xs text-stone-200 leading-relaxed select-text"><code><span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200">BUTTON_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">13</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// ขาสวิตช์ปุ่มกด</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">INPUT</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">begin</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">9600</span><span class="text-white font-bold">);</span>
<span class="text-white font-bold">}</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">ButtonVal</span> <span class="text-white font-bold">=</span> <span class="text-cyan-300 font-semibold">digitalRead</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-blue-200">ButtonVal</span><span class="text-white font-bold">);</span>
  <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">1000</span><span class="text-white font-bold">);</span>
<span class="text-white font-bold">}</span></code></pre>
          </div>

          <!-- Simulated Serial Monitor Screen -->
          <div class="bg-black/90 p-4 rounded-xl border border-stone-800 space-y-2 font-mono flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-stone-400 text-[11px] border-b border-stone-800 pb-1.5">
                <span>Serial Monitor [9600 baud]</span>
                <span class="text-emerald-400 font-bold">Connected</span>
              </div>
              <div class="text-[12px] space-y-1 leading-relaxed text-stone-300 select-text pt-2">
                <p>0 <span class="text-stone-500 italic">// ยังไม่ได้กดปุ่ม (LOW = 0)</span></p>
                <p>0</p>
                <p class="text-amber-300 font-bold">1 <span class="text-stone-400 italic">// กดปุ่มค้างไว้ (HIGH = 1)</span></p>
                <p class="text-amber-300 font-bold">1</p>
                <p>0 <span class="text-stone-500 italic">// ปล่อยปุ่ม กลับมาเป็น 0</span></p>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200 font-sans space-y-1">
              <strong class="text-emerald-300 font-bold flex items-center gap-1 font-mono">
                <Info class="w-3.5 h-3.5" />
                ข้อควรระวังในการพิมพ์คำสั่ง:
              </strong>
              <p class="text-stone-300 leading-relaxed text-[11px]">
                ระวังการสะกดคำสั่งหน่วงเวลา ต้องเขียนว่า <code>delay(1000);</code> (d-e-l-a-y) ห้ามพิมพ์สลับเป็น <code>dalay</code> และชื่อตัวแปรในภาษา C++ แยกตัวพิมพ์เล็ก-ใหญ่ (<code>ButtonVal</code> ต้องสะกดให้ตรงกันทั้งตอนรับค่าและตอนสั่งพิมพ์)
              </p>
            </div>
          </div>
        </div>

        <!-- Step-by-Step Walkthrough of the Simple Serial Code -->
        <div class="pt-2 border-t border-stone-800 space-y-3 font-sans">
          <h4 class="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
            <ListOrdered class="w-4 h-4 text-amber-400" />
            อธิบายทีละลำดับ พาทำทีละขั้นตอน (เข้าใจโครงสร้างโค้ดอ่านค่า Serial)
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <!-- Step 1 -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">ลำดับที่ 1</span>
                <span class="text-[10px] text-stone-400 font-mono">นอกฟังก์ชัน</span>
              </div>
              <p class="font-bold text-white">กำหนดขาพินปุ่มกด</p>
              <code class="text-[11px] text-amber-300 block font-mono">const int BUTTON_PIN = 13;</code>
              <p class="text-stone-400 text-[11px] leading-relaxed">
                <strong>ความสำคัญ:</strong> ตั้งชื่อแทนหมายเลขขา 13 ที่เราเสียบสายปุ่มกดไว้ คำว่า <code>const</code> ช่วยล็อกค่าไม่ให้เลขขาถูกเปลี่ยนโดยไม่ตั้งใจ และถ้าเปลี่ยนขาสายไฟในอนาคตก็แก้เลขที่บรรทัดนี้จุดเดียว
              </p>
            </div>

            <!-- Step 2 -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">ลำดับที่ 2</span>
                <span class="text-[10px] text-stone-400 font-mono">ใน setup()</span>
              </div>
              <p class="font-bold text-white">ตั้งโหมดขาและเปิดพอร์ต Serial</p>
              <code class="text-[11px] text-cyan-300 block font-mono">pinMode(..., INPUT); Serial.begin(9600);</code>
              <p class="text-stone-400 text-[11px] leading-relaxed">
                <strong>ความสำคัญ:</strong> ทำงานครั้งเดียวตอนเปิดเครื่อง เพื่อสั่งให้ขา 13 ทำหน้าที่เป็น <strong>ขารับสัญญาณเข้า (INPUT)</strong> และเปิดช่องทางส่งข้อมูลผ่านสาย USB ที่ความเร็วมาตรฐาน <strong>9600 บอด</strong> (ถ้าลืมบรรทัดนี้ หน้าจอ Serial จะว่างเปล่า)
              </p>
            </div>

            <!-- Step 3 -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">ลำดับที่ 3</span>
                <span class="text-[10px] text-stone-400 font-mono">ใน loop()</span>
              </div>
              <p class="font-bold text-white">อ่านค่าและสั่งพิมพ์ขึ้นบรรทัดใหม่</p>
              <code class="text-[11px] text-emerald-300 block font-mono">ButtonVal = digitalRead(13); Serial.println(ButtonVal);</code>
              <p class="text-stone-400 text-[11px] leading-relaxed">
                <strong>ความสำคัญ:</strong> <code>digitalRead()</code> จะตรวจวัดแรงดันไฟฟ้าที่ขา 13 ณ วินาทีนั้น แล้วแปลงเป็นตัวเลข <code>1</code> (HIGH) หรือ <code>0</code> (LOW) เก็บลงในตัวแปร <code>ButtonVal</code> จากนั้น <code>Serial.println()</code> จะส่งค่านั้นขึ้นไปแสดงบนหน้าจอพร้อมขึ้นบรรทัดใหม่
              </p>
            </div>

            <!-- Step 4 -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">ลำดับที่ 4</span>
                <span class="text-[10px] text-stone-400 font-mono">ท้าย loop()</span>
              </div>
              <p class="font-bold text-white">หน่วงเวลาจังหวะการอ่าน</p>
              <code class="text-[11px] text-orange-300 block font-mono">delay(1000);</code>
              <p class="text-stone-400 text-[11px] leading-relaxed">
                <strong>ความสำคัญ:</strong> สั่งให้บอร์ดหยุดรอ 1,000 มิลลิวินาที (1 วินาที) ก่อนวนไปอ่านรอบใหม่ เพื่อให้สายตามนุษย์อ่านตัวเลขบนหน้าจอ Serial Monitor ทัน ไม่ให้ตัวเลขไหลรัวเร็วเกินไป
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- How to Open & Use Serial Monitor in Tinkercad (4 Steps Guide) -->
      <div class="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
        <div class="flex items-center gap-2 text-amber-950">
          <Globe class="w-5 h-5 text-amber-600" />
          <h3 class="font-black text-base sm:text-lg">
            วิธีเปิดและใช้งานหน้าต่าง Serial Monitor ใน Autodesk Tinkercad Circuits
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <!-- Step 1 -->
          <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">1</span>
            <p class="font-bold text-stone-900">คลิกปุ่ม "Code"</p>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              ที่แถบเครื่องมือมุมขวาบนของหน้าจอ Tinkercad ให้คลิกเปิดแถบแก้ไขโค้ด (เปลี่ยนเป็นโหมด Text)
            </p>
          </div>

          <!-- Step 2 -->
          <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">2</span>
            <p class="font-bold text-stone-900">เปิด "Serial Monitor"</p>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              ที่ด้านล่างสุดของหน้าต่างเขียนโค้ด จะมีแถบปุ่มสีฟ้า/เทาเขียนว่า <strong>"Serial Monitor"</strong> ให้คลิกเพื่อกางหน้าต่างออกมา
            </p>
          </div>

          <!-- Step 3 -->
          <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">3</span>
            <p class="font-bold text-stone-900">ตรวจ Baud Rate: 9600</p>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              สังเกตเมนูดรอปดาวน์ความเร็วมุมขวาล่าง ต้องตั้งค่าเป็น <strong>9600 baud</strong> ให้ตรงกับคำสั่ง <code>Serial.begin(9600);</code> ในโค้ด
            </p>
          </div>

          <!-- Step 4 -->
          <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">4</span>
            <p class="font-bold text-stone-900">กด Start Simulation</p>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              คลิกปุ่ม <strong>Start Simulation</strong> ข้อความจากคำสั่ง Serial จะวิ่งขึ้นมาแบบสดๆ พร้อมปุ่ม Clear สำหรับล้างจอ
            </p>
          </div>
        </div>
      </div>

      <!-- Button Input Wiring Diagram Card (Pull-down Circuit) -->
      <div class="p-5 sm:p-6 rounded-2xl bg-stone-900 text-white border-2 border-amber-500/40 space-y-5 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ToggleRight class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-black text-white text-sm sm:text-base">
                ผังการต่อวงจรสวิตช์ปุ่มกด (Push Button with Pull-down Resistor) เข้ากับขา 13 บน Tinkercad
              </h4>
              <p class="text-xs text-stone-400 font-sans">
                การต่อตัวต้านทาน Pull-down 10k&Omega; ดึงลง GND เพื่อให้อ่านค่า 0 ตอนปล่อย และได้ 1 ตอนกด
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
            Hardware Wiring Guide
          </span>
        </div>

        <!-- Section 1: Overview & Circuit Image -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <!-- Left: Image Preview -->
          <div class="lg:col-span-7 bg-stone-950/80 p-3 rounded-2xl border border-stone-800 flex flex-col items-center justify-center">
            <img
              src="/img/arduino_button_circuit.png"
              alt="ผังการต่อปุ่มกด Push Button เข้ากับ Arduino Uno ขา 13 บน Tinkercad"
              class="w-full max-w-lg rounded-xl shadow-lg border border-white/5 object-contain"
            />
            <span class="text-[11px] text-stone-400 mt-2 font-mono">
              ภาพจำลองการต่อวงจรปุ่มกดจริงจาก Autodesk Tinkercad Circuits
            </span>
          </div>

          <!-- Right: Wiring Pinout Explanation -->
          <div class="lg:col-span-5 space-y-3 text-xs">
            <div class="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
              <div class="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <Cable class="w-4 h-4" />
                จุดเชื่อมต่อสายไฟทั้ง 3 เส้น:
              </div>
              <ul class="space-y-2 text-stone-300">
                <li class="flex items-start gap-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 mt-0.5 border border-white/20"></span>
                  <div>
                    <strong class="text-white">สายสีแดง (ไฟเลี้ยง 5V):</strong>
                    <span> ต่อจากขา <strong>5V</strong> ของบอร์ด Arduino ไปเข้าขา <strong>Terminal 1a</strong> (หรือ 1b) ของปุ่มกด</span>
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 mt-0.5 border border-white/20"></span>
                  <div>
                    <strong class="text-white">สายสีเขียว (สัญญาณเข้า Pin 13):</strong>
                    <span> ต่อจากขา <strong>Terminal 2b</strong> ของปุ่มกด ไปเข้าขา <strong>Digital Pin 13</strong> ของ Arduino</span>
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-stone-400 shrink-0 mt-0.5 border border-white/20"></span>
                  <div>
                    <strong class="text-white">ตัวต้านทาน 10k&Omega; + สายสีดำ (Pull-down &rarr; GND):</strong>
                    <span> ต่อตัวต้านทานค่อมจากขา <strong>Terminal 2a</strong> (ฝั่งเดียวกับขา 2b) ผ่านสายดำลงสู่ขา <strong>GND</strong></span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div class="font-bold text-xs flex items-center gap-1">
                <Lightbulb class="w-3.5 h-3.5 text-amber-400" />
                ทำไมต้องมีตัวต้านทาน Pull-down 10k&Omega;?
              </div>
              <p class="text-[11px] text-stone-300 leading-relaxed font-sans">
                เพื่อป้องกันอาการ <strong>ขาอินพุตลอย (Floating State)</strong> ซึ่งจะทำให้ Serial Monitor อ่านค่าสลับ 0 กับ 1 รัวๆ แม้ยังไม่ได้แตะปุ่ม ตัวต้านทานนี้จะช่วยยึดแรงดันให้อยู่ที่ <strong>0V (LOW = 0)</strong> เสมอตราบใดที่ยังไม่กดปุ่ม และเมื่อกดปุ่มกระแส 5V จะไหลเข้า Pin 13 เกิดเป็น <strong>HIGH = 1</strong> ทันที
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2: Deep Dive Push Button Pinout & Internal Connection (Terminal 1a, 1b, 2a, 2b) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
          <div class="flex items-center gap-2 border-b border-stone-800/80 pb-3">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h5 class="text-sm sm:text-base font-black text-cyan-300">
              เจาะลึกโครงสร้างขาของสวิตช์ปุ่มกดบน Tinkercad (ทำไมมี 4 ขา และแต่ละขาต่อกับอะไร?)
            </h5>
          </div>

          <!-- Internal Structure Diagram & Rule -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-stone-900 border border-cyan-500/30 space-y-2">
              <span class="font-bold text-cyan-200 block text-xs">โครงสร้างภายในของปุ่มกด 4 ขา (Internal Connection):</span>
              <p class="text-stone-300 leading-relaxed">
                แม้ภายนอกจะมี 4 ขา แต่จริงๆ ข้างในเป็น <strong>สวิตช์ 2 ขั้ว (คู่ 1 และ คู่ 2)</strong> ที่เชื่อมติดกันเป็นเนื้อเดียวตั้งแต่แรก:
              </p>
              <div class="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div class="p-2 rounded-lg bg-black/60 border border-stone-700 text-stone-200">
                  <span class="text-amber-300 font-bold block">คู่ที่ 1 (ฝั่งซ้าย):</span>
                  <span>Terminal 1a &#8596; 1b</span>
                  <p class="text-[10px] text-stone-400 font-sans mt-0.5">เชื่อมถึงกันตลอดเวลาด้วยแผ่นโลหะภายใน</p>
                </div>
                <div class="p-2 rounded-lg bg-black/60 border border-stone-700 text-stone-200">
                  <span class="text-emerald-300 font-bold block">คู่ที่ 2 (ฝั่งขวา):</span>
                  <span>Terminal 2a &#8596; 2b</span>
                  <p class="text-[10px] text-stone-400 font-sans mt-0.5">เชื่อมถึงกันตลอดเวลาด้วยแผ่นโลหะภายใน</p>
                </div>
              </div>
              <p class="text-[11px] text-amber-200/90 pt-1">
                * เมื่อยังไม่กดปุ่ม: <strong>คู่ 1 และ คู่ 2 จะแยกขาดจากกัน (Open Circuit)</strong><br>
                * เมื่อกดปุ่มลงไป: แผ่นโดมโลหะจะกดสะพานไฟเชื่อม <strong>คู่ 1 และ คู่ 2 เข้าด้วยกัน (Closed Circuit)</strong>
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <span class="font-bold text-rose-300 block text-xs">ข้อควรระวังในการต่อสายไฟ (ห้ามต่อผิดคู่เด็ดขาด):</span>
                <p class="text-stone-300 leading-relaxed text-[11px]">
                  <strong>ห้าม!</strong> นำสายไฟ 5V และสายสัญญาณ Pin 13 ไปต่อไว้ที่คู่เดียวกัน (เช่น 1a กับ 1b หรือ 2a กับ 2b) เพราะขาคู่นั้นถึงกันอยู่แล้ว จะทำให้วงจรช็อตติดค้างตลอดเวลา แม้ไม่ได้กดปุ่ม
                </p>
                <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-[11px] space-y-1">
                  <strong class="text-emerald-300 block">สูตรจำง่ายที่สุดในการต่อวงจร:</strong>
                  <span>ให้ฝั่งหนึ่ง (1a หรือ 1b) เป็น <strong>"ฝั่งไฟเข้า (5V)"</strong> และอีกฝั่งหนึ่ง (2a หรือ 2b) เป็น <strong>"ฝั่งสัญญาณออก (Pin 13 + R ดึงลง GND)"</strong> เสมอ!</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 4 Pins Breakdown Cards (Terminal 1a, 1b, 2a, 2b) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
            <!-- Pin 1a -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-red-500/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-red-400 text-xs">Terminal 1a</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 font-mono">ซ้ายล่าง</span>
              </div>
              <div class="font-bold text-white text-xs">ขั้วไฟเลี้ยงบวก (5V In)</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                ในภาพตัวอย่างนี้ <strong>ต่อเข้ากับสายสีแดง (ไฟเลี้ยง 5V จาก Arduino)</strong> เพื่อเตรียมส่งกระแสไฟข้ามไปยังฝั่งคู่ที่ 2 ตอนที่เรากดปุ่ม
              </p>
            </div>

            <!-- Pin 1b -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-stone-300 text-xs">Terminal 1b</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-stone-800 text-stone-400 font-mono">ซ้ายบน</span>
              </div>
              <div class="font-bold text-white text-xs">ขาเชื่อมต่อภายใน (ถึง 1a)</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                ต่อถึง 1a ภายในตัวปุ่ม ในผังวงจรนี้ <strong>ปล่อยว่างไว้ (NC: Not Connected)</strong> หรือสามารถใช้แทนขา 1a เพื่อต่อไฟ 5V ก็ได้เช่นกัน
              </p>
            </div>

            <!-- Pin 2b -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-emerald-500/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-emerald-400 text-xs">Terminal 2b</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">ขวาบน</span>
              </div>
              <div class="font-bold text-white text-xs">ขาสัญญาณออก (Signal Out)</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                ในภาพตัวอย่างนี้ <strong>ต่อสายสีเขียวเข้า Digital Pin 13 ของ Arduino</strong> เพื่อส่งระดับแรงดัน (0V หรือ 5V) เข้าไปให้คำสั่ง <code>digitalRead()</code> อ่านค่า
              </p>
            </div>

            <!-- Pin 2a -->
            <div class="p-3.5 rounded-xl bg-stone-900 border border-amber-500/40 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-amber-400 text-xs">Terminal 2a</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">ขวาล่าง</span>
              </div>
              <div class="font-bold text-white text-xs">ขาต่อตัวต้านทาน (Pull-down)</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                เชื่อมถึง 2b ภายในตัวปุ่ม ในภาพตัวอย่างนี้ <strong>ต่อขาข้างหนึ่งของตัวต้านทาน 10k&Omega;</strong> แล้วต่อสายสีดำจากปลายตัวต้านทานลงสู่ขา <strong>GND</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- SECTION 2: NEW POKÉMON OF THE WEEK - PIEZO BUZZER              -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
            <Volume2 class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-black text-stone-800">
                2. โปเกม่อนตัวใหม่ในสัปดาห์นี้: ลำโพงบัซเซอร์ (Piezo Buzzer)
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-stone-500 font-semibold">
              อุปกรณ์ชิ้นใหม่ประจำสัปดาห์: เพิ่มมิติของคลื่นความถี่เสียงและสัญญาณเตือนภัยด้วยคำสั่ง tone() และ noTone()
            </p>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 shrink-0 self-start sm:self-auto">
          โปเกม่อนสายเสียง (Sound Type)
        </span>
      </div>

      <!-- Playful Story Introduction -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-rose-50/80 border border-rose-200 text-xs text-stone-700 leading-relaxed">
        <p class="font-medium">
          หลังจากที่สัปดาห์ก่อนเราได้ฝึกใช้โปเกม่อนตัวแรกคือ <strong>หลอดไฟ LED (โปเกม่อนสายแสง: Light Type)</strong> ที่ทำหน้าที่แสดงผลผ่านความสว่าง ในสัปดาห์นี้เรามาจับและฝึกใช้งานโปเกม่อนตัวที่สองที่จะมาเป็นคู่หูในวงจร นั่นคือ <strong>Piezo Buzzer (โปเกม่อนสายเสียง: Sound Type)</strong> ซึ่งจะทำหน้าที่สร้างคลื่นความถี่เสียงเตือนภัย เสียงบี๊บยืนยัน และเสียงไซเรนฉุกเฉินให้กับโครงงานของเรา!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Explanation -->
        <div class="space-y-4">
          <p class="text-sm text-stone-700 font-medium leading-relaxed">
            <strong>Piezo Buzzer</strong> เป็นอุปกรณ์เอาต์พุตเสียงที่ใช้ผลึกเพียโซอิเล็กทริก (Piezoelectric) สั่นสะเทือนเมื่อได้รับสัญญาณไฟฟ้าความถี่ สามารถสร้างเสียง Beep สั้นๆ, เสียงไซเรนเตือนภัย, หรือแม้กระทั่งเล่นเมโลดี้เพลงง่ายๆ ได้
          </p>

          <div class="space-y-2.5">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <Zap class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-xs font-black text-stone-800">การต่อขาใน Tinkercad</p>
                <p class="text-xs text-stone-600">
                  ขั้วบวก (+) มีสัญลักษณ์สีแดง ต่อเข้ากับ Digital Pin (เช่น Pin 8) และขั้วลบ (-) สีดำ ต่อลงพิน GND โดยตรง
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <Volume2 class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-xs font-black text-stone-800">คำสั่ง tone(pin, frequency)</p>
                <p class="text-xs text-stone-600">
                  สั่งส่งสัญญาณคลื่นสี่เหลี่ยมความถี่ตามที่ระบุ เช่น <code>tone(8, 1000);</code> สำหรับเสียงโทนกริ่ง 1,000 Hz
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <VolumeX class="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-xs font-black text-stone-800">คำสั่ง noTone(pin)</p>
                <p class="text-xs text-stone-600">
                  สั่งหยุดการส่งสัญญาณเสียงทันที เช่น <code>noTone(8);</code> เมื่อต้องการปิดเสียง
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Frequency Cheat Sheet Table -->
        <div class="bg-stone-900 rounded-2xl p-5 text-white space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-stone-800 pb-2">
            <span class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders class="w-4 h-4" />
              ตารางความถี่เสียงยอดนิยม (Audio Cheat Sheet)
            </span>
            <span class="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded font-mono">Unit: Hz</span>
          </div>

          <div class="space-y-2 text-xs font-mono">
            <div class="flex items-center justify-between p-2 rounded-lg bg-stone-800/80">
              <span class="text-stone-300">เสียงกริ่งติ๊ดสั้น (Short Beep)</span>
              <span class="text-emerald-400 font-black">tone(8, 2000, 100);</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-stone-800/80">
              <span class="text-stone-300">เสียงเตือนปกติ (Alarm Tone)</span>
              <span class="text-amber-400 font-black">tone(8, 1000);</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-stone-800/80">
              <span class="text-stone-300">เสียงไซเรนฉุกเฉิน (Siren Low/High)</span>
              <span class="text-rose-400 font-black">800 Hz &lt;=&gt; 1200 Hz</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-stone-800/80">
              <span class="text-stone-300">เสียงผิดพลาด (Error Tone)</span>
              <span class="text-red-400 font-black">tone(8, 300, 300);</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Piezo Buzzer Hardware Wiring & Melody Demonstration Code Card -->
      <div class="p-5 sm:p-6 rounded-2xl bg-stone-900 text-white border-2 border-rose-500/40 space-y-5 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
              <Volume2 class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-black text-white text-sm sm:text-base">
                ผังการต่อลำโพง Piezo Buzzer เข้ากับ Arduino Uno ขา 8 บน Tinkercad และตัวอย่างโค้ดเล่นทำนองเพลง (Melody)
              </h4>
              <p class="text-xs text-stone-400 font-sans">
                เรียนรู้วิธีต่อขาขั้วบวก (+) และขั้วลบ (-) พร้อมวิเคราะห์โค้ดการคำนวณจังหวะโน้ตดนตรีทีละบรรทัด
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 shrink-0">
            Piezo Melody Demo
          </span>
        </div>

        <!-- Wiring Diagram Grid: Image + Pinout Details -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <!-- Left: Image Preview -->
          <div class="lg:col-span-6 bg-stone-950/80 p-3 rounded-2xl border border-stone-800 flex flex-col items-center justify-center">
            <img
              src="/img/arduino_buzzer_circuit.png"
              alt="ผังการต่อลำโพง Piezo Buzzer เข้ากับ Arduino Uno ขา 8 บน Tinkercad"
              class="w-full max-w-md rounded-xl shadow-lg border border-white/5 object-contain"
            />
            <span class="text-[11px] text-stone-400 mt-2 font-mono">
              ภาพจำลองการต่อวงจร Piezo Buzzer ตรงจาก Autodesk Tinkercad Circuits
            </span>
          </div>

          <!-- Right: Wiring Pinout Explanation (Plus & Minus) -->
          <div class="lg:col-span-6 space-y-3 text-xs">
            <div class="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
              <div class="font-bold text-rose-300 text-sm flex items-center gap-1.5">
                <Cable class="w-4 h-4" />
                จุดเชื่อมต่อขาทั้ง 2 ขั้วของ Piezo Buzzer:
              </div>
              <ul class="space-y-2.5 text-stone-300">
                <li class="flex items-start gap-2.5 p-2 rounded-lg bg-black/40 border border-emerald-500/30">
                  <span class="w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">+</span>
                  <div>
                    <strong class="text-white text-xs">ขั้วบวก (+) [สายสีเขียว / ขาฝั่งขวา]:</strong>
                    <p class="text-stone-300 text-[11px] mt-0.5 leading-relaxed">
                      ต่อเข้ากับ <strong>Digital Pin 8</strong> ของ Arduino Uno (ในโค้ดจะใช้คำสั่ง <code>tone(8, frequency)</code> เพื่อส่งคลื่นความถี่เสียงความถี่ต่างๆ ออกมาทางขานี้)
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-2.5 p-2 rounded-lg bg-black/40 border border-stone-700">
                  <span class="w-4 h-4 rounded-full bg-stone-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">-</span>
                  <div>
                    <strong class="text-white text-xs">ขั้วลบ (-) [สายสีดำ / ขาฝั่งซ้าย]:</strong>
                    <p class="text-stone-300 text-[11px] mt-0.5 leading-relaxed">
                      ต่อตรงลงขา <strong>GND (Ground)</strong> ของ Arduino Uno เพื่อให้กระแสไฟไหลครบวงจร
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div class="font-bold text-xs flex items-center gap-1">
                <Lightbulb class="w-3.5 h-3.5 text-amber-400" />
                ข้อสังเกตสำคัญใน Tinkercad:
              </div>
              <p class="text-[11px] text-stone-300 leading-relaxed font-sans">
                บนตัว Piezo ของ Tinkercad จะมีสัญลักษณ์เครื่องหมาย <strong>บวก (+)</strong> และ <strong>ลบ (-)</strong> สลักไว้อย่างชัดเจน การต่อขั้วผิดอาจทำให้ไม่เกิดเสียงหรือเสียงเบามาก จึงต้องนำขั้ว <strong>(+) เข้าขา Pin 8</strong> และนำขั้ว <strong>(-) เข้า GND</strong> เสมอ
              </p>
            </div>
          </div>
        </div>

        <!-- Code Snippet & Step-by-Step Breakdown -->
        <div class="pt-3 border-t border-stone-800 space-y-4">
          <!-- 1. Simple Beep Code (เอาแบบให้มีเสียงออกมาพอง่ายๆ) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-black/90 border-2 border-emerald-500/50 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] uppercase">
                  Simple Code • โค้ดส่งเสียงแบบง่ายที่สุด
                </span>
                <h5 class="font-bold text-white text-sm sm:text-base flex items-center gap-2 mt-1">
                  <Volume2 class="w-4 h-4 text-emerald-400" />
                  โค้ดสั่งให้มีเสียงร้อง ติ๊ด...ติ๊ด ออกมาพอง่ายๆ (ไม่ต้องจำตัวโน้ต)
                </h5>
                <p class="text-[11px] text-stone-400">
                  ใช้เพียง <code>tone(8, 1000)</code> ส่งเสียง 1 วินาที และ <code>noTone(8)</code> ปิดเสียง 1 วินาที วนซ้ำใน loop()
                </p>
              </div>
              <button
                @click="copyCode('simpleBuzzer', simpleBuzzerCode)"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Check v-if="copiedLab === 'simpleBuzzer'" class="w-3.5 h-3.5" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedLab === 'simpleBuzzer' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดเสียงแบบง่าย' }}</span>
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div class="lg:col-span-7 bg-black/70 p-3.5 rounded-xl border border-white/10 text-xs font-mono leading-relaxed select-text overflow-x-auto">
                <pre class="text-stone-200"><code><span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200">BUZZER_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">8</span><span class="text-white">;</span> <span class="text-stone-400 italic">// ขาลำโพง Piezo Buzzer</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white">() {</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white">,</span> <span class="text-orange-400 font-bold">OUTPUT</span><span class="text-white">);</span>
<span class="text-white">}</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white">() {</span>
  <span class="text-cyan-300 font-semibold">tone</span><span class="text-white">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white">,</span> <span class="text-orange-400 font-bold">1000</span><span class="text-white">);</span> <span class="text-stone-400 italic">// ส่งเสียงความถี่ 1000 Hz</span>
  <span class="text-cyan-300 font-semibold">delay</span><span class="text-white">(</span><span class="text-orange-400 font-bold">1000</span><span class="text-white">);</span>            <span class="text-stone-400 italic">// ร้องค้างไว้ 1 วินาที</span>

  <span class="text-cyan-300 font-semibold">noTone</span><span class="text-white">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white">);</span>     <span class="text-stone-400 italic">// ปิดเสียง</span>
  <span class="text-cyan-300 font-semibold">delay</span><span class="text-white">(</span><span class="text-orange-400 font-bold">1000</span><span class="text-white">);</span>            <span class="text-stone-400 italic">// เงียบ 1 วินาที</span>
<span class="text-white">}</span></code></pre>
              </div>

              <div class="lg:col-span-5 space-y-2 text-xs">
                <div class="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                  <span class="font-bold text-emerald-300 block">อธิบายหลักการทำงานสั้นๆ:</span>
                  <p class="text-stone-300 text-[11px] leading-relaxed">
                    1. <code>pinMode(8, OUTPUT)</code>: สั่งให้ขา 8 เป็นขาปล่อยสัญญาณไฟ<br>
                    2. <code>tone(8, 1000)</code>: สั่งสร้างคลื่นเสียงบี๊บ 1,000 ครั้ง/วินาที<br>
                    3. <code>noTone(8)</code>: สั่งดับเสียงทันที<br>
                    4. วนลูป ร้อง 1 วิ &rarr; เงียบ 1 วิ ต่อเนื่องไปเรื่อยๆ ทันทีที่กด Start Simulation!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Advanced Melody Option -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h5 class="font-bold text-amber-300 text-sm flex items-center gap-2">
                <FileCode2 class="w-4 h-4" />
                ทางเลือกเสริม: โค้ดเล่นทำนองเพลงเมโลดี้ (Melody Song Code)
              </h5>
              <p class="text-[11px] text-stone-400">
                สำหรับผู้ที่ต้องการเล่นตัวโน้ต C4, G3, A3, B3 เป็นท่วงทำนองดนตรีใน setup()
              </p>
            </div>
            <button
              @click="copyCode('piezoMelody', piezoMelodyCode)"
              class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-950 hover:text-rose-300 border border-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Check v-if="copiedLab === 'piezoMelody'" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedLab === 'piezoMelody' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดเพลง Melody' }}</span>
            </button>
          </div>

          <!-- Code Box -->
          <div class="bg-black/80 p-4 rounded-xl border border-stone-800 text-xs font-mono leading-relaxed select-text overflow-x-auto">
            <pre class="text-stone-200"><code><span class="text-rose-400 font-bold">#define</span> <span class="text-cyan-300">NOTE_C4</span>  <span class="text-orange-400">262</span>  <span class="text-stone-500">// โน้ต โด (ความถี่ 262 Hz)</span>
<span class="text-rose-400 font-bold">#define</span> <span class="text-cyan-300">NOTE_G3</span>  <span class="text-orange-400">196</span>  <span class="text-stone-500">// โน้ต ซอล (ความถี่ 196 Hz)</span>
<span class="text-rose-400 font-bold">#define</span> <span class="text-cyan-300">NOTE_A3</span>  <span class="text-orange-400">220</span>  <span class="text-stone-500">// โน้ต ลา (ความถี่ 220 Hz)</span>
<span class="text-rose-400 font-bold">#define</span> <span class="text-cyan-300">NOTE_B3</span>  <span class="text-orange-400">247</span>  <span class="text-stone-500">// โน้ต ที (ความถี่ 247 Hz)</span>

<span class="text-stone-400 italic">// ลำดับโน้ตเพลง 8 ตัวในทำนอง (melody):</span>
<span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">melody</span><span class="text-white">[] = {</span>
  <span class="text-cyan-300">NOTE_C4</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_G3</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_G3</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_A3</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_G3</span><span class="text-white">,</span> <span class="text-orange-400">0</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_B3</span><span class="text-white">,</span> <span class="text-cyan-300">NOTE_C4</span>
<span class="text-white">};</span>

<span class="text-stone-400 italic">// ความยาวตัวโน้ต: 4 = ตัวดำ (quarter note), 8 = ตัวเขบ็ต 1 ชั้น (eighth note):</span>
<span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">noteDurations</span><span class="text-white">[] = {</span>
  <span class="text-orange-400">4</span><span class="text-white">,</span> <span class="text-orange-400">8</span><span class="text-white">,</span> <span class="text-orange-400">8</span><span class="text-white">,</span> <span class="text-orange-400">4</span><span class="text-white">,</span> <span class="text-orange-400">4</span><span class="text-white">,</span> <span class="text-orange-400">4</span><span class="text-white">,</span> <span class="text-orange-400">4</span><span class="text-white">,</span> <span class="text-orange-400">4</span>
<span class="text-white">};</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white">() {</span>
  <span class="text-stone-400 italic">// วนลูปอ่านโน้ตเพลงทีละตัวตั้งแต่ตัวที่ 0 ถึง 7 (ครบ 8 ตัว):</span>
  <span class="text-purple-400 font-bold">for</span> <span class="text-white">(</span><span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">thisNote</span> <span class="text-white">=</span> <span class="text-orange-400">0</span><span class="text-white">;</span> <span class="text-blue-200">thisNote</span> <span class="text-white">&lt;</span> <span class="text-orange-400">8</span><span class="text-white">;</span> <span class="text-blue-200">thisNote</span><span class="text-white">++) {</span>

    <span class="text-stone-400 italic">// คำนวณระยะเวลาของโน้ต: นำ 1 วินาที (1000 ms) หารด้วยประเภทโน้ต</span>
    <span class="text-stone-400 italic">// เช่น ตัวดำ = 1000 / 4 = 250 ms, ตัวเขบ็ต = 1000 / 8 = 125 ms</span>
    <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">noteDuration</span> <span class="text-white">=</span> <span class="text-orange-400">1000</span> <span class="text-white">/</span> <span class="text-blue-200">noteDurations</span><span class="text-white">[</span><span class="text-blue-200">thisNote</span><span class="text-white">];</span>
    <span class="text-cyan-300 font-semibold">tone</span><span class="text-white">(</span><span class="text-orange-400 font-bold">8</span><span class="text-white">,</span> <span class="text-blue-200">melody</span><span class="text-white">[</span><span class="text-blue-200">thisNote</span><span class="text-white">],</span> <span class="text-blue-200">noteDuration</span><span class="text-white">);</span>

    <span class="text-stone-400 italic">// เว้นวรรคช่วงหยุดระหว่างตัวโน้ต ให้เสียงไม่ทึบติดกัน (+30% ของความยาวโน้ต)</span>
    <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">pauseBetweenNotes</span> <span class="text-white">=</span> <span class="text-blue-200">noteDuration</span> <span class="text-white">*</span> <span class="text-orange-400 font-bold">1.30</span><span class="text-white">;</span>
    <span class="text-cyan-300 font-semibold">delay</span><span class="text-white">(</span><span class="text-blue-200">pauseBetweenNotes</span><span class="text-white">);</span>
    
    <span class="text-stone-400 italic">// หยุดเล่นเสียงเพื่อเตรียมขึ้นตัวโน้ตถัดไป</span>
    <span class="text-cyan-300 font-semibold">noTone</span><span class="text-white">(</span><span class="text-orange-400 font-bold">8</span><span class="text-white">);</span>
  <span class="text-white">}</span>
<span class="text-white">}</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white">() {</span>
  <span class="text-stone-400 italic">// ว่างไว้: เพลงจะเล่นจบ 1 รอบใน setup() แล้วหยุด ไม่เล่นวนซ้ำ</span>
<span class="text-white">}</span></code></pre>
          </div>

          <!-- Step-by-Step Code Explanation Cards (4 Pillars) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
            <div class="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1.5">
              <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">1. กำหนดค่าโน้ต (#define)</span>
              <div class="font-bold text-white text-xs">แปลงความถี่ Hz เป็นชื่อโน้ต</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                ใช้ <code>#define</code> กำหนดตัวเลขความถี่ของแต่ละคีย์เปียโน เช่น <code>NOTE_C4 = 262 Hz</code> ช่วยให้เราอ่านและเรียบเรียงเมโลดี้ได้ง่ายโดยไม่ต้องจำตัวเลขความถี่
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1.5">
              <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">2. โครงสร้าง Array</span>
              <div class="font-bold text-white text-xs">เก็บลำดับเพลงและความยาว</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                ใช้ Array 2 ชุดคู่กัน: <code>melody[]</code> เก็บตัวโน้ตที่จะเล่น (เลข <code>0</code> คือเว้นวรรคเงียบเสียง) และ <code>noteDurations[]</code> เก็บลักษณะจังหวะของแต่ละโน้ต
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1.5">
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">3. ฟังก์ชัน tone(8, note, duration)</span>
              <div class="font-bold text-white text-xs">ส่งเสียงออกขา 8 ตามระยะเวลา</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                คำนวณเวลาจาก <code>1000 / noteDurations[thisNote]</code> เช่น โน้ตตัวดำความยาว 1/4 วินาที จะได้เวลา <code>250 ms</code> แล้วส่งออกทางขา 8
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1.5">
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">4. pauseBetweenNotes (+30%)</span>
              <div class="font-bold text-white text-xs">เว้นวรรคเสียงให้โน้ตคมชัด</div>
              <p class="text-stone-300 text-[11px] leading-relaxed">
                คูณเวลาเพิ่ม 30% (<code>* 1.30</code>) ก่อนเรียก <code>noTone(8)</code> เพื่อให้มีช่วงว่างระหว่างโน้ต 2 ตัว ทำให้หูคนเราแยกออกว่าโน้ตตัวไหนจบและตัวไหนเริ่ม
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- SECTION 3: DEEP DIVE INTO STATE & FINITE STATE MACHINE (FSM)    -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      <!-- Section Header -->
      <div class="flex items-center gap-3 border-b border-stone-100 pb-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
          <GitCommit class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-stone-800">
            3. เจาะลึกแนวคิด "State (สถานะ)" และการเขียนโค้ดสลับสถานะ (Toggle State)
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 font-semibold">
            เปลี่ยนจากการเขียนโค้ดอ่านค่าธรรมดา สู่การสร้างระบบสมองกลที่มีความจำ (Memory Logic) และการตรวจจับจังหวะกดปุ่มทีละขั้นตอน
          </p>
        </div>
      </div>

      <!-- Core Concept: Why Embedded Systems Need State -->
      <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200 space-y-3">
        <h3 class="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
          <Lightbulb class="w-5 h-5 text-amber-600" />
          ทำไมไมโครคอนโทรลเลอร์ถึงต้องมี "State (สถานะ)"?
        </h3>
        <p class="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
          ไมโครคอนโทรลเลอร์ทำงานวนซ้ำในฟังก์ชัน <code>void loop()</code> ด้วยความเร็วสูงถึง 16 ล้านคำสั่งต่อวินาที (16 MHz) หรือหลายแสนรอบต่อวินาที หากเราไม่สร้าง <strong>ตัวแปรจำสถานะ (State Variable)</strong> เอาไว้ เมื่อจบรอบลูปหนึ่ง ไมโครคอนโทรลเลอร์จะ <strong>"ลืมทุกอย่างทันที"</strong> และไม่รู้ว่าระบบกำลังอยู่ในโหมดใด
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
            <strong class="text-stone-900 font-bold flex items-center gap-1.5">
              <ToggleLeft class="w-4 h-4 text-stone-500" />
              1. ระบบไร้สถานะ (Stateless / Momentary)
            </strong>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              เปรียบเหมือน <strong>กระดิ่งหน้าบ้าน</strong> ตราบใดที่นิ้วยังกดแช่ไว้ สวิตช์ปิดวงจร เสียงจะดัง แต่ทันทีที่ยกนิ้วออก วงจรเปิด เสียงจะดับทันที ระบบไม่มีการจดจำอดีต
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
            <strong class="text-amber-950 font-bold flex items-center gap-1.5">
              <ToggleRight class="w-4 h-4 text-amber-600" />
              2. ระบบมีสถานะ (Stateful / Memory)
            </strong>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              เปรียบเหมือน <strong>สวิตช์ไฟห้องนอน หรือปุ่มเปลี่ยนโหมดพัดลม</strong> กด 1 ครั้งแล้วปล่อยมือ ระบบจะ <em>จำสถานะไว้</em> ไฟยังติดค้างอยู่ และเมื่อกดอีกครั้งจึงจะเปลี่ยนไปสู่สถานะถัดไป
            </p>
          </div>
        </div>
      </div>

      <!-- Human Speed vs CPU Speed & Edge Detection -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Left: The Problem - Human Speed vs CPU Speed -->
        <div class="p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-stone-800 pb-2">
            <span class="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle class="w-4 h-4" />
              กับดักที่โปรแกรมเมอร์มือใหม่มักเจอ
            </span>
            <span class="text-[10px] text-stone-500">Human vs CPU Speed</span>
          </div>
          <p class="text-stone-300 font-sans leading-relaxed text-xs">
            เมื่อคนเรากดปุ่ม 1 ครั้ง นิ้วจะแตะสัมผัสหน้าปุ่มเป็นเวลาอย่างน้อย <strong>150 - 300 มิลลิวินาที (ms)</strong><br>
            แต่บอร์ด Arduino ทำงานวนลูป 1 รอบใช้เวลาเพียงไม่กี่ไมโครวินาที ในเวลา 200 ms บอร์ดวนลูปไปแล้วกว่า <strong>20,000 รอบ!</strong>
          </p>
          <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-1.5">
            <p class="font-bold font-mono text-[11px] text-rose-400">// ถ้าเขียนโค้ดแบบนี้จะเกิดบั๊กทันที:</p>
            <p><code>if (digitalRead(BUTTON_PIN) == LOW) {</code></p>
            <p class="pl-4"><code>toggleState = !toggleState; // สลับสถานะ</code></p>
            <p><code>}</code></p>
            <p class="text-[11px] font-sans text-stone-400 leading-relaxed pt-1">
              ผลลัพธ์: ตลอดเวลา 200 ms ที่นิ้วกดปุ่ม ตัวแปรจะถูกสลับไปมา 20,000 ครั้ง! ผลลัพธ์สุดท้ายจะเปิดหรือปิดขึ้นอยู่กับดวง ไม่สามารถควบคุมได้
            </p>
          </div>
        </div>

        <!-- Right: The Solution - Edge Detection (Falling Edge) -->
        <div class="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-300/80 space-y-3 text-xs">
          <div class="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span class="text-emerald-900 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Zap class="w-4 h-4 text-emerald-600" />
              ทางออก: แยกตัวแปรจำสถานะปุ่ม (lastButtonState) และตัวแปรสถานะระบบ (toggleState)
            </span>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">Solution</span>
          </div>
          <p class="text-stone-700 leading-relaxed">
            หัวใจของการเปลี่ยน State ที่ถูกต้องคือ <strong>ต้องใช้ตัวแปร 2 ตัวแยกหน้าที่กันอย่างชัดเจน</strong>:
          </p>
          <div class="space-y-2">
            <div class="p-3 rounded-xl bg-white border border-emerald-200 space-y-1">
              <span class="font-mono font-bold text-emerald-800 text-[11px] block">
                1. ตัวแปร lastButtonState (จำสถานะปุ่มรอบที่แล้ว):
              </span>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                ใช้ตรวจจับ <strong>Falling Edge (ขอบขาลง: จาก HIGH เป็น LOW)</strong> ด้วยเงื่อนไข:<br>
                <code class="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">if (lastButtonState == HIGH && buttonVal == LOW)</code><br>
                เงื่อนไขนี้จะเป็นจริง <strong>เพียงรอบลูปเดียวตอนนิ้วเริ่มแตะปุ่ม!</strong> แม้จะกดปุ่มแช่ไว้ก็ไม่สลับซ้ำ
              </p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-emerald-200 space-y-1">
              <span class="font-mono font-bold text-blue-800 text-[11px] block">
                2. ตัวแปร toggleState (จำสถานะเปิด/ปิดของระบบ):
              </span>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                จะถูกสลับค่าด้วยคำสั่ง <code>toggleState = !toggleState;</code> (จาก 0 เป็น 1 หรือจาก 1 เป็น 0) <strong>เฉพาะเมื่อตรวจพบการกดปุ่มครั้งใหม่เท่านั้น</strong> ไม่ถูกเขียนทับด้วยค่าปุ่มในทุกรอบลูป
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Complete State Toggle Code & Step-by-Step Guided Walkthrough -->
      <div class="rounded-2xl bg-stone-950 p-6 text-white space-y-6 border border-stone-800 shadow-xl font-mono">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div class="flex items-center gap-2">
            <GitCommit class="w-5 h-5 text-amber-400" />
            <div>
              <h3 class="text-sm sm:text-base font-bold text-white">
                โค้ดสำหรับการเปลี่ยน State (Toggle State 0 ↔ 1) พร้อมรายงานผลผ่าน Serial Monitor
              </h3>
              <p class="text-[11px] text-stone-400 font-sans font-normal">
                โค้ดมาตรฐานสำหรับตรวจจับการกดปุ่มเพื่อสลับสถานะ Old State -> New State อย่างแม่นยำ
              </p>
            </div>
          </div>
          <button
            @click="copyCode('stateDemo', stateDemoCode)"
            class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-950 hover:text-amber-300 border border-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Check v-if="copiedLab === 'stateDemo'" class="w-3.5 h-3.5 text-emerald-400" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copiedLab === 'stateDemo' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดเปลี่ยน State' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <!-- Full State Toggle Code -->
          <div class="bg-black/60 p-4 rounded-xl border border-white/10 space-y-2 overflow-x-auto">
            <span class="text-stone-400 text-[11px] uppercase tracking-wider block font-bold">// โค้ดสำหรับการเปลี่ยน State (Full Runnable Code):</span>
            <pre class="text-xs text-stone-200 leading-relaxed select-text"><code><span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200">BUTTON_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">13</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// ขาสวิตช์ปุ่มกด</span>

<span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">HIGH</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// จำสถานะปุ่มรอบก่อนหน้า (สำหรับตรวจจับการกด)</span>
<span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">toggleState</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">0</span><span class="text-white font-bold">;</span>        <span class="text-stone-400 italic">// เก็บสถานะที่ต้องการสลับ (0 หรือ 1)</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">INPUT</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">begin</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">9600</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"=== System Ready! (setup completed) ==="</span><span class="text-white font-bold">);</span>
<span class="text-white font-bold">}</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200">buttonVal</span> <span class="text-white font-bold">=</span> <span class="text-cyan-300 font-semibold">digitalRead</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// ตรวจจับจังหวะเริ่มกดปุ่ม (Falling Edge: จาก HIGH เป็น LOW)</span>
  <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">HIGH</span> <span class="text-white font-bold">&amp;&amp;</span> <span class="text-blue-200">buttonVal</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">LOW</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-emerald-300">">> [EVENT] Button Pressed! State Changed."</span><span class="text-white font-bold">);</span>
    
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">print</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"Old State: "</span><span class="text-white font-bold">);</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-blue-200">toggleState</span><span class="text-white font-bold">);</span>
    
    <span class="text-stone-400 italic">// สลับค่า toggleState (0 -> 1, 1 -> 0)</span>
    <span class="text-blue-200">toggleState</span> <span class="text-white font-bold">=</span> <span class="text-white font-bold">!</span><span class="text-blue-200">toggleState</span><span class="text-white font-bold">;</span>

    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">print</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"New State: "</span><span class="text-white font-bold">);</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-blue-200">toggleState</span><span class="text-white font-bold">);</span>

    <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">50</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// Debounce ป้องกันสัญญาณปุ่มเด้งเบิ้ล</span>
  <span class="text-white font-bold">}</span>

  <span class="text-stone-400 italic">// อัปเดตเฉพาะสถานะปุ่มกดสำหรับรอบถัดไป</span>
  <span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-blue-200">buttonVal</span><span class="text-white font-bold">;</span>
  <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">50</span><span class="text-white font-bold">);</span>
<span class="text-white font-bold">}</span></code></pre>
          </div>

          <!-- Simulated Output of State Toggle Code -->
          <div class="bg-black/90 p-4 rounded-xl border border-stone-800 space-y-3 font-mono flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-stone-400 text-[11px] border-b border-stone-800 pb-1.5">
                <span>Serial Monitor [9600 baud]</span>
                <span class="text-emerald-400 font-bold">Connected</span>
              </div>
              <div class="text-[12px] space-y-1.5 leading-relaxed text-stone-300 select-text pt-2">
                <p class="text-stone-400">=== System Ready! (setup completed) ===</p>
                <div class="p-2 rounded bg-emerald-950/30 border border-emerald-500/20">
                  <p class="text-emerald-300 font-bold">&gt;&gt; [EVENT] Button Pressed! State Changed.</p>
                  <p class="text-stone-300">Old State: <span class="text-amber-300 font-bold">0</span></p>
                  <p class="text-stone-300">New State: <span class="text-emerald-400 font-bold">1</span> <span class="text-stone-500 italic">// กดปุ่มครั้งที่ 1 (สลับจาก 0 เป็น 1)</span></p>
                </div>
                <div class="p-2 rounded bg-indigo-950/30 border border-indigo-500/20">
                  <p class="text-indigo-300 font-bold">&gt;&gt; [EVENT] Button Pressed! State Changed.</p>
                  <p class="text-stone-300">Old State: <span class="text-emerald-400 font-bold">1</span></p>
                  <p class="text-stone-300">New State: <span class="text-amber-300 font-bold">0</span> <span class="text-stone-500 italic">// กดปุ่มครั้งที่ 2 (สลับจาก 1 กลับเป็น 0)</span></p>
                </div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-sans space-y-1">
              <strong class="text-amber-300 font-bold flex items-center gap-1 font-mono">
                <Zap class="w-3.5 h-3.5" />
                สังเกตความแตกต่างจากโค้ดอ่านค่าธรรมดา:
              </strong>
              <p class="text-stone-300 leading-relaxed text-[11px]">
                หน้าจอ Serial Monitor จะ <strong>ไม่พิมพ์ตัวเลขไหลรัวๆ ตลอดเวลา</strong> แต่จะนิ่งเงียบและพิมพ์รายงานเฉพาะจังหวะที่นิ้วกดปุ่มลงไปจริงๆ เท่านั้น!
              </p>
            </div>
          </div>
        </div>

        <!-- 6-Step Detailed Sequential Walkthrough -->
        <div class="pt-4 border-t border-stone-800 space-y-4 font-sans">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h4 class="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
              <ListOrdered class="w-5 h-5 text-amber-400" />
              เจาะลึกทีละลำดับ พาทำทีละขั้นตอน: ทำไมโค้ดเปลี่ยน State ต้องเขียนแบบนี้?
            </h4>
            <span class="text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold">
              Step-by-Step Deep Dive
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <!-- Step 1 -->
            <div class="p-4 rounded-xl bg-stone-900 border border-stone-700/80 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 1</span>
                  <span class="text-[10px] text-stone-400 font-mono">Global Variables</span>
                </div>
                <h5 class="font-bold text-white text-sm">ประกาศตัวแปรความจำ 2 ตัวนอกฟังก์ชัน</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-amber-200 space-y-0.5">
                  <p>int lastButtonState = HIGH;</p>
                  <p>int toggleState = 0;</p>
                </div>
                <p class="text-stone-300 text-[11px] leading-relaxed">
                  <strong>ความสำคัญสูงสุด:</strong> ต้องประกาศไว้ด้านบนสุด (นอก <code>setup</code> และ <code>loop</code>) เพื่อให้ตัวแปรมีอายุอยู่ตลอดการทำงาน ไม่ถูกล้างค่าทิ้งเมื่อจบรอบลูป โดยแยกหน้าที่กันชัดเจน:
                </p>
                <ul class="list-disc pl-4 text-[11px] text-stone-400 space-y-0.5">
                  <li><code>lastButtonState</code>: จำว่าในรอบที่แล้วปุ่มถูกปล่อย (HIGH) หรือกด (LOW)</li>
                  <li><code>toggleState</code>: จำสถานะของระบบที่เราต้องการสลับ (0 = ปิด, 1 = เปิด)</li>
                </ul>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="p-4 rounded-xl bg-stone-900 border border-stone-700/80 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 2</span>
                  <span class="text-[10px] text-stone-400 font-mono">ใน void setup()</span>
                </div>
                <h5 class="font-bold text-white text-sm">เตรียมความพร้อมระบบและแจ้งสถานะเริ่มต้น</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-cyan-200 space-y-0.5">
                  <p>pinMode(BUTTON_PIN, INPUT);</p>
                  <p>Serial.begin(9600);</p>
                  <p>Serial.println("=== System Ready! ===");</p>
                </div>
                <p class="text-stone-300 text-[11px] leading-relaxed">
                  <strong>ความสำคัญ:</strong> ตั้งค่าขา 13 เป็นขารับสัญญาณเข้า เปิดพอร์ตสื่อสารที่ความเร็ว 9600 baud และสั่งพิมพ์ข้อความ <code>System Ready!</code> ออกมา 1 ครั้ง เพื่อยืนยันว่าบอร์ดบูตเสร็จสมบูรณ์และสาย Serial เชื่อมต่อพร้อมใช้งานแล้ว
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="p-4 rounded-xl bg-stone-900 border border-stone-700/80 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 3</span>
                  <span class="text-[10px] text-stone-400 font-mono">ต้น void loop()</span>
                </div>
                <h5 class="font-bold text-white text-sm">อ่านค่าสถานะปุ่มกด ณ ปัจจุบัน</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-blue-200">
                  <p>int buttonVal = digitalRead(BUTTON_PIN);</p>
                </div>
                <p class="text-stone-300 text-[11px] leading-relaxed">
                  <strong>ความสำคัญ:</strong> ทุกๆ รอบของ <code>loop()</code> บอร์ดจะไปอ่านค่าแรงดันไฟฟ้าล่าสุดจากขา 13 มาเก็บไว้ในตัวแปรชั่วคราวชื่อ <code>buttonVal</code> เพื่อเตรียมนำไปเปรียบเทียบกับค่าในอดีต (<code>lastButtonState</code>) ในบรรทัดถัดไป
                </p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="p-4 rounded-xl bg-stone-900 border-2 border-emerald-500/50 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 4 (หัวใจสำคัญ)</span>
                  <span class="text-[10px] text-emerald-400 font-mono font-bold">Edge Detection</span>
                </div>
                <h5 class="font-bold text-emerald-300 text-sm">ตรวจจับจังหวะเริ่มกดปุ่ม (Falling Edge)</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-300">
                  <p>if (lastButtonState == HIGH &amp;&amp; buttonVal == LOW)</p>
                </div>
                <div class="text-stone-300 text-[11px] leading-relaxed space-y-1.5">
                  <p>
                    <strong>ความสำคัญ (จับจังหวะเริ่มแตะปุ่มครั้งแรก):</strong>
                  </p>
                  <p class="text-emerald-200/90 font-medium bg-black/40 p-2 rounded-lg border border-emerald-500/20">
                    &bull; <code>lastButtonState == HIGH</code> คือ <em>"รอบที่แล้วยังไม่ได้กดปุ่ม"</em><br>
                    &bull; <code>buttonVal == LOW</code> คือ <em>"แต่รอบนี้เพิ่งกดปุ่มลงมา!"</em>
                  </p>
                  <p class="text-stone-300">
                    แปลรวมกันคือ <strong>"ดักจับเฉพาะเสี้ยววินาทีแรกที่นิ้วเริ่มแตะโดนปุ่มพอดี"</strong> ทำให้คำสั่งสลับไฟทำงานแค่ <strong>1 ครั้งเท่านั้น</strong> แม้จะกดนิ้วแช่ค้างไว้นานแค่ไหน ไฟก็จะไม่เปิด-ปิดกระพริบรัวๆ ซ้ำอีก เพราะรอบถัดไประบบจำได้แล้วว่ากดค้างอยู่
                  </p>
                </div>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="p-4 rounded-xl bg-stone-900 border-2 border-amber-500/50 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 5 (สลับค่า)</span>
                  <span class="text-[10px] text-amber-400 font-mono font-bold">Toggle Logic</span>
                </div>
                <h5 class="font-bold text-amber-300 text-sm">พิมพ์ค่าเก่า สลับค่าด้วย ! และพิมพ์ค่าใหม่</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-amber-200 space-y-0.5">
                  <p>toggleState = !toggleState;</p>
                  <p>delay(50); // Debounce</p>
                </div>
                <p class="text-stone-300 text-[11px] leading-relaxed">
                  <strong>ความสำคัญ:</strong> เราพิมพ์ <code>Old State</code> ออกมาก่อน จากนั้นใช้เครื่องหมายอัศเจรีย์ <code>!</code> (NOT) เพื่อกลับค่าตรงข้าม (จาก <code>0</code> กลายเป็น <code>1</code>, หรือจาก <code>1</code> กลายเป็น <code>0</code>) แล้วพิมพ์ <code>New State</code> ตามด้วย <code>delay(50)</code> เพื่อกรองสัญญาณหน้าสัมผัสปุ่มสั่นกระดอน
                </p>
              </div>
            </div>

            <!-- Step 6 -->
            <div class="p-4 rounded-xl bg-stone-900 border-2 border-rose-500/50 space-y-2 flex flex-col justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-bold text-[11px]">ขั้นตอนที่ 6 (ห้ามลืมเด็ดขาด)</span>
                  <span class="text-[10px] text-rose-400 font-mono font-bold">State Update</span>
                </div>
                <h5 class="font-bold text-rose-300 text-sm">อัปเดตสถานะปุ่มกดก่อนจบรอบลูป</h5>
                <div class="p-2 rounded bg-black/60 font-mono text-[11px] text-rose-200 space-y-0.5">
                  <p>lastButtonState = buttonVal;</p>
                  <p>delay(50);</p>
                </div>
                <p class="text-stone-300 text-[11px] leading-relaxed">
                  <strong>ความสำคัญ:</strong> ก่อนจบ <code>loop()</code> ต้องนำค่าปุ่มปัจจุบัน (<code>buttonVal</code>) ไปบันทึกทับลงใน <code>lastButtonState</code> เสมอ เพื่อให้รอบถัดไปบอร์ดจำได้ว่าปุ่มถูกกดไปแล้ว (ข้อควรระวัง: อัปเดตเฉพาะ <code>lastButtonState</code> เท่านั้น ห้ามเอา <code>buttonVal</code> ไปทับ <code>toggleState</code>)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Evolutionary Levels of State in Embedded Systems -->
      <div class="space-y-3 pt-2">
        <h3 class="text-sm sm:text-base font-black text-stone-800 flex items-center gap-2">
          <Layers class="w-5 h-5 text-indigo-600" />
          วิวัฒนาการ 3 ระดับของ State ในงานสมองกลฝังตัว
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Level 1: Momentary -->
          <div class="p-5 rounded-2xl bg-stone-50 border-2 border-stone-200 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-stone-200 text-stone-700 uppercase">ระดับที่ 1</span>
                <span class="text-[11px] text-stone-500 font-mono">Stateless</span>
              </div>
              <h4 class="font-black text-base text-stone-800">Momentary State (กดติด-ปล่อยดับ)</h4>
              <p class="text-xs text-stone-600 leading-relaxed">
                อ่านค่าตรงๆ ในลูป เหมาะกับงานแตะแล้วติด เช่น กริ่งประตู, แตรลม, ไฟฉายแบบกดส่องชั่วขณะ
              </p>
            </div>
            <div class="bg-stone-900 p-2.5 rounded-xl text-[11px] font-mono text-white">
              <span class="text-purple-400 font-bold">if</span> (btn <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">LOW</span>) { <span class="text-emerald-400 font-bold">ON;</span> } <span class="text-purple-400 font-bold">else</span> { <span class="text-stone-400 font-bold">OFF;</span> }
            </div>
          </div>

          <!-- Level 2: Toggle & Edge Detection -->
          <div class="p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-200 text-indigo-800 uppercase">ระดับที่ 2</span>
                <span class="text-[11px] text-indigo-600 font-mono font-bold">1-Bit State</span>
              </div>
              <h4 class="font-black text-base text-indigo-950">Toggle State (กดสลับเปิด-ปิด)</h4>
              <p class="text-xs text-stone-600 leading-relaxed">
                สร้างตัวแปรบูลีน <code>bool state</code> จำสถานะ 0 หรือ 1 กดสลับด้วยเครื่องหมาย <code>!</code> เหมาะกับสวิตช์เปิด-ปิดอุปกรณ์
              </p>
            </div>
            <div class="bg-stone-900 p-2.5 rounded-xl text-[11px] font-mono text-white">
              <span class="text-purple-400 font-bold">if</span> (FallingEdge) { state <span class="text-white font-bold">=</span> <span class="text-white font-bold">!</span>state; <span class="text-cyan-300">delay</span>(<span class="text-orange-400">50</span>); }
            </div>
          </div>

          <!-- Level 3: Finite State Machine (FSM) -->
          <div class="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900 uppercase">ระดับที่ 3</span>
                <span class="text-[11px] text-amber-700 font-mono font-bold">Finite State Machine</span>
              </div>
              <h4 class="font-black text-base text-amber-950">Finite State Machine (วนรอบ N โหมด)</h4>
              <p class="text-xs text-stone-600 leading-relaxed">
                สร้างตัวแปรตัวเลข <code>int state</code> วนลูปโหมดด้วย Modulo <code>%</code> เช่น 0 (เขียว) -> 1 (เหลือง) -> 2 (แดง) -> วนกลับ 0
              </p>
            </div>
            <div class="bg-stone-900 p-2.5 rounded-xl text-[11px] font-mono text-white">
              state <span class="text-white font-bold">=</span> (state <span class="text-white font-bold">+</span> <span class="text-orange-400 font-bold">1</span>) <span class="text-white font-bold">%</span> <span class="text-orange-400 font-bold">3</span>;
            </div>
          </div>
        </div>
      </div>

      <!-- State Transition Visual Diagram -->
      <div class="p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3 font-mono">
        <div class="flex items-center justify-between border-b border-stone-800 pb-2">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Activity class="w-4 h-4" />
            แผนผังวงจรสถานะของระบบไฟจราจรอัจฉริยะ (State Transition Diagram)
          </span>
          <span class="text-[11px] text-stone-400">3-State Cyclic Flow</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div class="p-3.5 rounded-xl bg-stone-800 border-2 border-rose-500/60 space-y-1">
            <div class="flex items-center justify-between text-rose-300 font-bold">
              <span>State 0 (Standby)</span>
              <span class="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded">ไฟแดงติด</span>
            </div>
            <p class="text-stone-400 font-sans text-[11px]">ห้ามคนข้าม ไฟแดงติดค้าง ลำโพงเงียบ รอต้อนรับการกดปุ่ม</p>
            <div class="pt-1 text-[10px] text-amber-300 font-bold font-mono">>> เมื่อกดปุ่มครั้งที่ 1 -> เข้า State 1</div>
          </div>

          <div class="p-3.5 rounded-xl bg-stone-800 border-2 border-emerald-500/60 space-y-1">
            <div class="flex items-center justify-between text-emerald-300 font-bold">
              <span>State 1 (Crossing)</span>
              <span class="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">ไฟเขียวติด</span>
            </div>
            <p class="text-stone-400 font-sans text-[11px]">ไฟเขียวติดสว่าง อนุญาตให้คนข้ามถนน พร้อมลำโพงดังยาว 3 วินาที</p>
            <div class="pt-1 text-[10px] text-amber-300 font-bold font-mono">>> เมื่อกดปุ่มอีกครั้ง -> เข้า State 2</div>
          </div>

          <div class="p-3.5 rounded-xl bg-stone-800 border-2 border-amber-500/60 space-y-1">
            <div class="flex items-center justify-between text-amber-300 font-bold">
              <span>State 2 (Warning)</span>
              <span class="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">เขียวกระพริบ->เหลือง</span>
            </div>
            <p class="text-stone-400 font-sans text-[11px]">ไฟเขียวกระพริบเตือน 3 ครั้ง -> เปลี่ยนเป็นสีเหลืองค้าง 3 วิ พร้อมเสียงเตือน</p>
            <div class="pt-1 text-[10px] text-stone-400 font-bold font-mono">>> สิ้นสุดขั้นตอน -> วนกลับ State 0</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- SECTION 4: STEP-BY-STEP TUTORIAL (1 BUTTON, 1 LED, 1 BUZZER & SERIAL MONITOR) -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <Terminal class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-stone-800">
              4. สาธิตการต่อวงจรและสอนเขียนโค้ดทีละสเต็ป (Step-by-Step Code Walkthrough)
            </h2>
            <p class="text-xs sm:text-sm text-stone-500 font-semibold">
              ใช้อุปกรณ์ชุดพื้นฐาน: ปุ่มกด 1 ตัว + ไฟ LED 1 ดวง + ลำโพง Buzzer 1 ตัว เพื่อเรียนรู้การกำหนด Mode, การอ่านค่า Serial Monitor และการสลับ State
            </p>
          </div>
        </div>
      </div>

      <!-- Demonstration Hardware Card (1 Button + 1 LED + 1 Buzzer) -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-indigo-50/80 border border-emerald-200 space-y-3">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h3 class="text-sm font-black text-stone-900 flex items-center gap-2">
            <Cable class="w-4 h-4 text-emerald-600" />
            วงจรสาธิตการทำงาน (Minimal Demonstration Circuit: 3 Components)
          </h3>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
            วงจรชุดฝึกก่อนทำใบงาน
          </span>
        </div>

        <p class="text-xs text-stone-600 leading-relaxed">
          ก่อนที่จะไปต่อวงจรไฟจราจร 3 สีในใบงาน เราจะใช้ <strong>วงจรขนาดเล็กเพียง 3 ชิ้น</strong> เพื่อให้เห็นแก่นแท้ของการทำงาน โดยไม่สับสนกับสายไฟที่ซับซ้อน:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div class="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
            <div class="flex items-center justify-between">
              <strong class="text-blue-900 font-bold flex items-center gap-1.5">
                <ToggleLeft class="w-4 h-4 text-blue-600" /> สวิตช์ปุ่มกด (Input)
              </strong>
              <span class="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-bold">Pin 2 (Input)</span>
            </div>
            <p class="text-stone-500 text-[11px]">ใช้โหมด <code>pinMode(2, INPUT);</code> กำหนดขา 2 เป็นอินพุตเพื่ออ่านสัญญาณดิจิทัลจากสวิตช์ปุ่มกด</p>
          </div>

          <div class="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
            <div class="flex items-center justify-between">
              <strong class="text-amber-900 font-bold flex items-center gap-1.5">
                <Lightbulb class="w-4 h-4 text-amber-500" /> หลอดไฟ LED (Output)
              </strong>
              <span class="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold">Pin 13 & GND</span>
            </div>
            <p class="text-stone-500 text-[11px]">ขาขั้วบวกต่อผ่านตัวต้านทาน <code>220Ω</code> เข้า Pin 13 และขั้วลบลง GND</p>
          </div>

          <div class="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
            <div class="flex items-center justify-between">
              <strong class="text-indigo-900 font-bold flex items-center gap-1.5">
                <Volume2 class="w-4 h-4 text-indigo-500" /> Piezo Buzzer (Output)
              </strong>
              <span class="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px] font-bold">Pin 8 & GND</span>
            </div>
            <p class="text-stone-500 text-[11px]">ขั้วบวกสีแดงต่อ Pin 8 และขั้วลบสีดำต่อลง GND ใช้คำสั่ง <code>tone()</code></p>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Scrollable Tutorial Container -->
      <div class="space-y-8">
        <!-- Quick Navigation Jump Bar (เลื่อนอ่านลงมาเรื่อยๆ หรือคลิกเพื่อกระโดดไปสเต็ปที่ต้องการ) -->
        <div class="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 flex items-center justify-between flex-wrap gap-2">
          <span class="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <ListOrdered class="w-4 h-4 text-emerald-600" />
            เลื่อนอ่านลงมาเรื่อยๆ หรือคลิกข้ามสเต็ป:
          </span>
          <div class="flex items-center flex-wrap gap-1.5 text-xs">
            <a href="#tutorial-step-1" class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-all cursor-pointer">
              สเต็ป 1: กำหนด Mode
            </a>
            <a href="#tutorial-step-2" class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-all cursor-pointer">
              สเต็ป 2: อ่านค่าปุ่ม & Serial
            </a>
            <a href="#tutorial-step-3" class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition-all cursor-pointer">
              สเต็ป 3: การเปลี่ยน State
            </a>
            <a href="#tutorial-step-4" class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all cursor-pointer">
              สเต็ป 4: สั่งควบคุมอุปกรณ์
            </a>
            <a href="#tutorial-step-5" class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-xs">
              สเต็ป 5: โค้ดรวมฉบับสมบูรณ์
            </a>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STEP 1: Pin Mode Configuration in setup() -->
        <!-- ============================================================== -->
        <div id="tutorial-step-1" class="scroll-mt-6 p-6 rounded-3xl bg-white border-2 border-emerald-200/80 shadow-xs space-y-4 relative">
          <!-- Step Badge & Header -->
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-stone-900">
                  สเต็ปที่ 1: กำหนดตัวแปรขาพินและกำหนด Mode ในฟังก์ชัน setup()
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  บอกบอร์ด Arduino ว่าขาไหนเป็น INPUT หรือ OUTPUT และเปิดพอร์ตสื่อสารกับ Serial Monitor
                </p>
              </div>
            </div>
            <button
              @click="copyCode('step1', step1Code)"
              class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check v-if="copiedLab === 'step1'" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedLab === 'step1' ? 'คัดลอกแล้ว' : 'คัดลอกสเต็ป 1' }}</span>
            </button>
          </div>

          <!-- Syntax-Highlighted Code Card -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 shadow-xl overflow-hidden font-mono">
            <!-- IDE Window Title Bar -->
            <div class="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-mono text-[11px] text-stone-300 font-bold">Step1_SetupMode.ino</span>
              </div>
              <span class="text-[10px] text-stone-500 uppercase tracking-wider font-bold">C++ Arduino</span>
            </div>

            <!-- Code Content with Crisp Color Coding -->
            <div class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed select-text text-white">
              <pre class="text-white font-mono"><code class="text-white font-mono"><span class="text-stone-400 italic">// กำหนดหมายเลขขาพินของอุปกรณ์ทั้ง 3 ชิ้น</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">BUTTON_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">2</span><span class="text-white font-bold">;</span>   <span class="text-stone-400 italic">// สวิตช์ปุ่มกด (ต่อกับ GND)</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">LED_PIN</span>    <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">13</span><span class="text-white font-bold">;</span>  <span class="text-stone-400 italic">// หลอดไฟ LED (ต่อผ่านตัวต้านทาน 220 โอห์ม)</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">BUZZER_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">8</span><span class="text-white font-bold">;</span>   <span class="text-stone-400 italic">// ลำโพง Piezo Buzzer (ต่อกับ GND)</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-stone-400 italic">// 1. เปิดช่องทางการสื่อสาร Serial Monitor ที่ความเร็ว 9600 บอด (baud rate)</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">begin</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">9600</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"System Ready!"</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// 2. กำหนดโหมดไฟ LED ให้เป็นเอาต์พุต (OUTPUT) จ่ายไฟ 5V ขับหลอด</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">OUTPUT</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// 3. กำหนดโหมดปุ่มกด ให้เป็นอินพุต (INPUT) เพื่อรับสัญญาณดิจิทัล</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">INPUT</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// 4. กำหนดโหมดลำโพง Buzzer ให้เป็นเอาต์พุต (OUTPUT) ส่งคลื่นสัญญาณเสียง</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">OUTPUT</span><span class="text-white font-bold">);</span>
<span class="text-white font-bold">}</span></code></pre>
            </div>
          </div>

          <!-- Explanation Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <p class="font-bold text-stone-900 flex items-center gap-1.5">
                <Terminal class="w-4 h-4 text-emerald-600" />
                Serial.begin(9600); มีไว้ทำไม?
              </p>
              <p class="text-stone-600 leading-relaxed text-[11px]">
                เป็นการเปิดพอร์ตสื่อสารระหว่างบอร์ด Arduino กับคอมพิวเตอร์ผ่านสาย USB ที่ความเร็ว 9,600 บิตต่อวินาที เพื่อให้เราสามารถพิมพ์ข้อความและค่าตัวแปรออกมาดูบนหน้าต่าง <strong>Serial Monitor</strong> ได้
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <p class="font-bold text-stone-900 flex items-center gap-1.5">
                <Terminal class="w-4 h-4 text-blue-600" />
                Serial.print() ต่างกับ Serial.println() อย่างไร?
              </p>
              <p class="text-stone-600 leading-relaxed text-[11px]">
                <strong>Serial.print():</strong> ส่งข้อความหรือค่าตัวแปรออกไปโดยไม่ขึ้นบรรทัดใหม่ เช่น <code>Serial.print("Status: ");</code><br>
                <strong>Serial.println():</strong> ส่งค่าออกไปแล้ว <em>ตัดขึ้นบรรทัดใหม่ทันที</em> เหมาะสำหรับพิมพ์ปิดท้ายข้อความ
              </p>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STEP 2: Reading Button & Serial Monitor -->
        <!-- ============================================================== -->
        <div id="tutorial-step-2" class="scroll-mt-6 p-6 rounded-3xl bg-white border-2 border-blue-200/80 shadow-xs space-y-4 relative">
          <!-- Step Badge & Header -->
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-blue-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                2
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-stone-900">
                  สเต็ปที่ 2: อ่านค่าจากปุ่มกดและสอนการดูผลลัพธ์ผ่าน Serial Monitor
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  ใช้คำสั่ง digitalRead() อ่านแรงดันไฟฟ้า และพิมพ์ค่า 0 หรือ 1 ออกจอเพื่อตรวจสอบความถูกต้อง
                </p>
              </div>
            </div>
            <button
              @click="copyCode('step2', step2Code)"
              class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-blue-50 hover:text-blue-700 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check v-if="copiedLab === 'step2'" class="w-3.5 h-3.5 text-blue-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedLab === 'step2' ? 'คัดลอกแล้ว' : 'คัดลอกสเต็ป 2' }}</span>
            </button>
          </div>

          <!-- Syntax-Highlighted Code Card -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 shadow-xl overflow-hidden font-mono">
            <!-- IDE Window Title Bar -->
            <div class="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-mono text-[11px] text-stone-300 font-bold">Step2_ReadSerial.ino</span>
              </div>
              <span class="text-[10px] text-stone-500 uppercase tracking-wider font-bold">C++ Arduino</span>
            </div>

            <!-- Code Content with Crisp Color Coding -->
            <div class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed select-text text-white">
              <pre class="text-white font-mono"><code class="text-white font-mono"><span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-stone-400 italic">// 1. อ่านค่าแรงดันดิจิทัลจากสวิตช์ปุ่มกด (ส่งค่ากลับมาเป็น 0 หรือ 1)</span>
  <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200 font-semibold">buttonVal</span> <span class="text-white font-bold">=</span> <span class="text-cyan-300 font-semibold">digitalRead</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// 2. ส่งค่าไปแสดงผลบนหน้าต่าง Serial Monitor เพื่อตรวจสอบการทำงาน</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">print</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"Button Status: "</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-blue-200">buttonVal</span><span class="text-white font-bold">);</span>

  <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">200</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// หน่วงเวลา 0.2 วินาที เพื่อไม่ให้ข้อความไหลเร็วเกินไป</span>
<span class="text-white font-bold">}</span></code></pre>
            </div>
          </div>

          <!-- Serial Monitor Simulated Terminal Box -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 p-4 space-y-2.5 font-mono text-xs">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2 text-stone-400">
              <span class="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Terminal class="w-4 h-4" />
                จำลองหน้าต่าง Serial Monitor ใน Tinkercad (Baud: 9600)
              </span>
              <span class="text-[11px] text-stone-500">Autodesk Tinkercad Output</span>
            </div>
            <div class="space-y-1 text-emerald-400 text-xs sm:text-[13px] leading-relaxed select-text">
              <p>Button Status: 1 <span class="text-stone-500 italic">// เวลาปล่อยมือ: วงจรเปิด ขาพินถูกดึงขึ้นไปที่ 5V (HIGH)</span></p>
              <p>Button Status: 1</p>
              <p class="text-amber-300 font-bold">Button Status: 0 <span class="text-stone-400 italic font-normal">// เวลากดปุ่มลงไป: ขาพินลัดวงจรลงกราวด์ 0V (LOW) ทันที!</span></p>
              <p class="text-amber-300 font-bold">Button Status: 0</p>
              <p>Button Status: 1 <span class="text-stone-500 italic">// เมื่อปล่อยนิ้ว: แรงดันเด้งกลับขึ้นมาเป็น 1 อีกครั้ง</span></p>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-700 space-y-1">
            <strong class="text-amber-950 flex items-center gap-1.5 font-bold">
              <HelpCircle class="w-4 h-4 text-amber-600" />
              ทำไมต้องใช้ Serial Monitor?
            </strong>
            <p class="text-stone-600 leading-relaxed text-[11px]">
              เพราะบอร์ดไม่มีหน้าจอแสดงผล การเปิด Serial Monitor ช่วยให้เรา "มองเห็นความคิดของชิป" ว่าปุ่มกดทำงานจริงไหม มีสัญญาณรบกวนหรือไม่ ทำให้ค้นหาข้อผิดพลาดและเขียนโค้ดได้รวดเร็วขึ้นอย่างมาก
            </p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STEP 3: Edge Detection & State Transition -->
        <!-- ============================================================== -->
        <div id="tutorial-step-3" class="scroll-mt-6 p-6 rounded-3xl bg-white border-2 border-amber-200/80 shadow-xs space-y-4 relative">
          <!-- Step Badge & Header -->
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-amber-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                3
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-stone-900">
                  สเต็ปที่ 3: ตรวจจับการกดปุ่ม (Falling Edge) และสาธิตการเปลี่ยน State
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  สร้างตัวแปรจำสถานะ (State Variable) เพื่อให้ระบบจดจำสถานะเปิดหรือปิดได้ แม้จะปล่อยมือแล้ว
                </p>
              </div>
            </div>
            <button
              @click="copyCode('step3', step3Code)"
              class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check v-if="copiedLab === 'step3'" class="w-3.5 h-3.5 text-amber-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedLab === 'step3' ? 'คัดลอกแล้ว' : 'คัดลอกสเต็ป 3' }}</span>
            </button>
          </div>

          <!-- Syntax-Highlighted Code Card -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 shadow-xl overflow-hidden font-mono">
            <!-- IDE Window Title Bar -->
            <div class="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-mono text-[11px] text-stone-300 font-bold">Step3_ToggleState.ino</span>
              </div>
              <span class="text-[10px] text-stone-500 uppercase tracking-wider font-bold">C++ Arduino</span>
            </div>

            <!-- Code Content with Crisp Color Coding -->
            <div class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed select-text text-white">
              <pre class="text-white font-mono"><code class="text-white font-mono"><span class="text-stone-400 italic">// ประกาศตัวแปรจำสถานะ (State) ไว้นอกฟังก์ชัน loop()</span>
<span class="text-purple-400 font-bold">bool</span> <span class="text-blue-200 font-semibold">systemState</span>     <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">false</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// false = ปิด (0), true = เปิด (1)</span>
<span class="text-purple-400 font-bold">int</span>  <span class="text-blue-200 font-semibold">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">HIGH</span><span class="text-white font-bold">;</span>  <span class="text-stone-400 italic">// จำสถานะก่อนหน้า เพื่อตรวจจับจังหวะเริ่มกดปุ่ม</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200 font-semibold">currentButtonState</span> <span class="text-white font-bold">=</span> <span class="text-cyan-300 font-semibold">digitalRead</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// ตรวจจับจังหวะเริ่มกด (Falling Edge: เดิมเป็น HIGH ตกลงมาเป็น LOW)</span>
  <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">HIGH</span> <span class="text-white font-bold">&amp;&amp;</span> <span class="text-blue-200">currentButtonState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">LOW</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
    <span class="text-blue-200 font-semibold">systemState</span> <span class="text-white font-bold">=</span> <span class="text-white font-bold">!</span><span class="text-blue-200 font-semibold">systemState</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// สลับสถานะตรงข้าม (Toggle จาก 0 เป็น 1 หรือ 1 เป็น 0)</span>
    <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">50</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// Software Debounce ป้องกันหน้าสัมผัสสวิตช์กระดอน</span>

    <span class="text-stone-400 italic">// พิมพ์รายงานการเปลี่ยน State ออก Serial Monitor ทันที!</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">print</span><span class="text-white font-bold">(</span><span class="text-emerald-300">">> [EVENT] ตรวจพบการกดปุ่ม! สลับ State เป็น: "</span><span class="text-white font-bold">);</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-blue-200">systemState</span> <span class="text-white font-bold">?</span> <span class="text-emerald-300">"1 (ON)"</span> <span class="text-white font-bold">:</span> <span class="text-rose-300">"0 (OFF)"</span><span class="text-white font-bold">);</span>
  <span class="text-white font-bold">}</span>

  <span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-blue-200">currentButtonState</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// บันทึกสถานะไว้สำหรับรอบลูปถัดไป</span>
<span class="text-white font-bold">}</span></code></pre>
            </div>
          </div>

          <!-- Serial Monitor Simulated Terminal Box -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 p-4 space-y-2.5 font-mono text-xs">
            <div class="flex items-center justify-between border-b border-stone-800 pb-2 text-stone-400">
              <span class="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Terminal class="w-4 h-4" />
                รายงานผลการเปลี่ยน State บน Serial Monitor
              </span>
              <span class="text-[11px] text-stone-500">Live State Feedback</span>
            </div>
            <div class="space-y-1 text-xs sm:text-[13px] leading-relaxed select-text">
              <p class="text-stone-400">=== ระบบเริ่มต้นทำงาน (System Ready: State 0) ===</p>
              <p class="text-emerald-400 font-bold">&gt;&gt; [EVENT] ตรวจพบการกดปุ่มครั้งที่ 1! สลับ State เป็น: 1 (ON)</p>
              <p class="text-rose-400 font-bold">&gt;&gt; [EVENT] ตรวจพบการกดปุ่มครั้งที่ 2! สลับ State เป็น: 0 (OFF)</p>
              <p class="text-emerald-400 font-bold">&gt;&gt; [EVENT] ตรวจพบการกดปุ่มครั้งที่ 3! สลับ State เป็น: 1 (ON)</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <strong class="text-stone-900 font-bold">หลักการ Falling Edge:</strong>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                เงื่อนไข <code>lastButtonState == HIGH &amp;&amp; currentButtonState == LOW</code> จะเป็นจริง <strong>เพียงครั้งเดียวในเสี้ยววินาทีที่นิ้วเริ่มแตะกดปุ่มลงไป</strong> ทำให้ระบบไม่ทำงานซ้ำซ้อนขณะกดค้าง
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <strong class="text-stone-900 font-bold">การสลับสถานะ systemState = !systemState;</strong>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                เครื่องหมาย <code>!</code> (NOT) จะกลับค่าบูลีน จาก false กลายเป็น true และจาก true กลายเป็น false เสมือนการกดสวิตช์เปิด-ปิดไฟห้อง
              </p>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STEP 4: Controlling Actuators based on State -->
        <!-- ============================================================== -->
        <div id="tutorial-step-4" class="scroll-mt-6 p-6 rounded-3xl bg-white border-2 border-indigo-200/80 shadow-xs space-y-4 relative">
          <!-- Step Badge & Header -->
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-indigo-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                4
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-stone-900">
                  สเต็ปที่ 4: สั่งควบคุมอุปกรณ์ (หลอดไฟ LED & ลำโพง Buzzer) ตามตัวแปร State
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  แยกการตัดสินใจเปิด-ปิดอุปกรณ์ออกจากปุ่มกด โดยสั่งงานตามค่า State ปัจจุบัน
                </p>
              </div>
            </div>
            <button
              @click="copyCode('step4', step4Code)"
              class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check v-if="copiedLab === 'step4'" class="w-3.5 h-3.5 text-indigo-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedLab === 'step4' ? 'คัดลอกแล้ว' : 'คัดลอกสเต็ป 4' }}</span>
            </button>
          </div>

          <!-- Syntax-Highlighted Code Card -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 shadow-xl overflow-hidden font-mono">
            <!-- IDE Window Title Bar -->
            <div class="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-mono text-[11px] text-stone-300 font-bold">Step4_ControlActuators.ino</span>
              </div>
              <span class="text-[10px] text-stone-500 uppercase tracking-wider font-bold">C++ Arduino</span>
            </div>

            <!-- Code Content with Crisp Color Coding -->
            <div class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed select-text text-white">
              <pre class="text-white font-mono"><code class="text-white font-mono">  <span class="text-stone-400 italic">// สั่งควบคุมอุปกรณ์ตามค่าตัวแปร systemState ปัจจุบัน</span>
  <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200 font-semibold">systemState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">true</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
    <span class="text-stone-400 italic">// เมื่อ State เป็น 1: สั่งเปิดไฟ LED และเปิดเสียงเตือน</span>
    <span class="text-cyan-300 font-semibold">digitalWrite</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">HIGH</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// จ่ายไฟ 5V ไฟ LED ติดสว่าง</span>
    <span class="text-cyan-300 font-semibold">tone</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">1000</span><span class="text-white font-bold">);</span>      <span class="text-stone-400 italic">// สั่งลำโพงส่งเสียงความถี่ 1000 Hz</span>
  <span class="text-white font-bold">}</span> <span class="text-purple-400 font-bold">else</span> <span class="text-white font-bold">{</span>
    <span class="text-stone-400 italic">// เมื่อ State เป็น 0: สั่งปิดไฟ LED และปิดเสียงเตือน</span>
    <span class="text-cyan-300 font-semibold">digitalWrite</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">LOW</span><span class="text-white font-bold">);</span>  <span class="text-stone-400 italic">// ตัดไฟ 0V ไฟ LED ดับสนิท</span>
    <span class="text-cyan-300 font-semibold">noTone</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">);</span>          <span class="text-stone-400 italic">// สั่งปิดเสียงลำโพง</span>
  <span class="text-white font-bold">}</span></code></pre>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1.5">
              <div class="flex items-center justify-between text-emerald-950 font-bold">
                <span>เมื่อ State เป็น 1 (ON):</span>
                <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-mono">systemState == true</span>
              </div>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                - สั่ง <code>digitalWrite(LED_PIN, HIGH);</code> เพื่อจ่ายไฟ 5V ให้หลอดไฟ LED ติดสว่างค้างไว้<br>
                - สั่ง <code>tone(BUZZER_PIN, 1000);</code> เพื่อให้ลำโพงสร้างคลื่นเสียงความถี่ 1000 Hz ต่อเนื่อง
              </p>
            </div>

            <div class="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-1.5">
              <div class="flex items-center justify-between text-rose-950 font-bold">
                <span>เมื่อ State เป็น 0 (OFF):</span>
                <span class="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-mono">systemState == false</span>
              </div>
              <p class="text-stone-600 text-[11px] leading-relaxed">
                - สั่ง <code>digitalWrite(LED_PIN, LOW);</code> เพื่อตัดกระแสไฟ หลอดไฟ LED ดับสนิท<br>
                - สั่ง <code>noTone(BUZZER_PIN);</code> เพื่อหยุดสร้างคลื่นความถี่ ลำโพงเงียบสนิททันที
              </p>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STEP 5: Full Assembled Code & Tinkercad Serial Monitor Guide -->
        <!-- ============================================================== -->
        <div id="tutorial-step-5" class="scroll-mt-6 p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-md space-y-4 relative">
          <!-- Step Badge & Header -->
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                5
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  สเต็ปที่ 5: โค้ดรวมฉบับสมบูรณ์ (Full Assembled Code)
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  รวมโค้ดครบทุกสเต็ปเข้าด้วยกัน พร้อมนำไปวางและทดสอบบน Tinkercad Circuits
                </p>
              </div>
            </div>
            <button
              @click="copyCode('fullDemo', fullDemoCode)"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Check v-if="copiedLab === 'fullDemo'" class="w-4 h-4 text-emerald-200" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copiedLab === 'fullDemo' ? 'คัดลอกโค้ดสำเร็จ!' : 'คัดลอกโค้ด C++ ทั้งหมด' }}</span>
            </button>
          </div>

          <!-- Syntax-Highlighted Full Code Card -->
          <div class="rounded-2xl bg-stone-950 border border-stone-800 shadow-xl overflow-hidden font-mono">
            <!-- IDE Window Title Bar -->
            <div class="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-mono text-[11px] text-stone-300 font-bold">Complete_Controller.ino</span>
              </div>
              <span class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Ready to Compile</span>
            </div>

            <!-- Code Content with Crisp Color Coding -->
            <div class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed select-text text-white">
              <pre class="text-white font-mono"><code class="text-white font-mono"><span class="text-stone-400 italic">// โค้ดฉบับสมบูรณ์: ระบบ 1 ปุ่มกด + 1 หลอดไฟ LED + 1 ลำโพง Buzzer พร้อม Serial Monitor</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">BUTTON_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">2</span><span class="text-white font-bold">;</span>   <span class="text-stone-400 italic">// สวิตช์ปุ่มกด (กำหนดโหมด INPUT)</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">LED_PIN</span>    <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">13</span><span class="text-white font-bold">;</span>  <span class="text-stone-400 italic">// หลอดไฟ LED (ต่อผ่านตัวต้านทาน 220 โอห์ม)</span>
<span class="text-purple-400 font-bold">const int</span> <span class="text-blue-200 font-semibold">BUZZER_PIN</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">8</span><span class="text-white font-bold">;</span>   <span class="text-stone-400 italic">// ลำโพง Piezo Buzzer</span>

<span class="text-purple-400 font-bold">bool</span> <span class="text-blue-200 font-semibold">systemState</span>     <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">false</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// ตัวแปรจำสถานะ (State Variable): false = ปิด, true = เปิด</span>
<span class="text-purple-400 font-bold">int</span>  <span class="text-blue-200 font-semibold">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-orange-400 font-bold">HIGH</span><span class="text-white font-bold">;</span>  <span class="text-stone-400 italic">// จำสถานะก่อนหน้าเพื่อตรวจจับ Falling Edge</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">setup</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-stone-400 italic">// สเต็ปที่ 1: เปิด Serial Monitor และกำหนด Mode ของแต่ละขาพิน</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">begin</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">9600</span><span class="text-white font-bold">);</span>
  <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"=== ระบบเริ่มต้นทำงาน (System Ready) ==="</span><span class="text-white font-bold">);</span>

  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">OUTPUT</span><span class="text-white font-bold">);</span>          <span class="text-stone-400 italic">// กำหนดโหมดไฟเป็น OUTPUT</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">INPUT</span><span class="text-white font-bold">);</span>         <span class="text-stone-400 italic">// กำหนดโหมดปุ่มกดเป็น INPUT</span>
  <span class="text-cyan-300 font-semibold">pinMode</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">OUTPUT</span><span class="text-white font-bold">);</span>       <span class="text-stone-400 italic">// กำหนดโหมดลำโพงเป็น OUTPUT</span>
<span class="text-white font-bold">}</span>

<span class="text-purple-400 font-bold">void</span> <span class="text-yellow-300 font-bold">loop</span><span class="text-white font-bold">()</span> <span class="text-white font-bold">{</span>
  <span class="text-stone-400 italic">// สเต็ปที่ 2: อ่านค่าจากปุ่มกด</span>
  <span class="text-purple-400 font-bold">int</span> <span class="text-blue-200 font-semibold">currentButtonState</span> <span class="text-white font-bold">=</span> <span class="text-cyan-300 font-semibold">digitalRead</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUTTON_PIN</span><span class="text-white font-bold">);</span>

  <span class="text-stone-400 italic">// สเต็ปที่ 3: ตรวจจับการกดปุ่ม (Falling Edge) และสลับ State</span>
  <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">HIGH</span> <span class="text-white font-bold">&amp;&amp;</span> <span class="text-blue-200">currentButtonState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">LOW</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
    <span class="text-blue-200 font-semibold">systemState</span> <span class="text-white font-bold">=</span> <span class="text-white font-bold">!</span><span class="text-blue-200 font-semibold">systemState</span><span class="text-white font-bold">;</span> <span class="text-stone-400 italic">// สลับสถานะ (จาก 0 เป็น 1 หรือ 1 เป็น 0)</span>
    <span class="text-cyan-300 font-semibold">delay</span><span class="text-white font-bold">(</span><span class="text-orange-400 font-bold">50</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// Software Debounce ป้องกันปุ่มเด้งเบิ้ล</span>

    <span class="text-stone-400 italic">// รายงานการเปลี่ยน State ออก Serial Monitor</span>
    <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">print</span><span class="text-white font-bold">(</span><span class="text-emerald-300">">> [EVENT] ตรวจพบการกดปุ่ม! เปลี่ยน State เป็น: "</span><span class="text-white font-bold">);</span>
    <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200">systemState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">true</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
      <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-emerald-300">"1 (ON - ระบบเปิด ไฟติด เสียงดัง)"</span><span class="text-white font-bold">);</span>
    <span class="text-white font-bold">}</span> <span class="text-purple-400 font-bold">else</span> <span class="text-white font-bold">{</span>
      <span class="text-amber-300 font-bold">Serial</span><span class="text-white font-bold">.</span><span class="text-cyan-300 font-semibold">println</span><span class="text-white font-bold">(</span><span class="text-rose-300">"0 (OFF - ระบบปิด ไฟดับ เสียงเงียบ)"</span><span class="text-white font-bold">);</span>
    <span class="text-white font-bold">}</span>
  <span class="text-white font-bold">}</span>

  <span class="text-stone-400 italic">// สเต็ปที่ 4: ควบคุมอุปกรณ์ฮาร์ดแวร์ตาม State ปัจจุบัน</span>
  <span class="text-purple-400 font-bold">if</span> <span class="text-white font-bold">(</span><span class="text-blue-200">systemState</span> <span class="text-white font-bold">==</span> <span class="text-orange-400 font-bold">true</span><span class="text-white font-bold">)</span> <span class="text-white font-bold">{</span>
    <span class="text-cyan-300 font-semibold">digitalWrite</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">HIGH</span><span class="text-white font-bold">);</span> <span class="text-stone-400 italic">// สั่งเปิดไฟ LED</span>
    <span class="text-cyan-300 font-semibold">tone</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">1000</span><span class="text-white font-bold">);</span>      <span class="text-stone-400 italic">// สั่งลำโพงดัง 1000 Hz</span>
  <span class="text-white font-bold">}</span> <span class="text-purple-400 font-bold">else</span> <span class="text-white font-bold">{</span>
    <span class="text-cyan-300 font-semibold">digitalWrite</span><span class="text-white font-bold">(</span><span class="text-blue-200">LED_PIN</span><span class="text-white font-bold">,</span> <span class="text-orange-400 font-bold">LOW</span><span class="text-white font-bold">);</span>  <span class="text-stone-400 italic">// สั่งปิดไฟ LED</span>
    <span class="text-cyan-300 font-semibold">noTone</span><span class="text-white font-bold">(</span><span class="text-blue-200">BUZZER_PIN</span><span class="text-white font-bold">);</span>          <span class="text-stone-400 italic">// สั่งปิดเสียงลำโพง</span>
  <span class="text-white font-bold">}</span>

  <span class="text-blue-200">lastButtonState</span> <span class="text-white font-bold">=</span> <span class="text-blue-200">currentButtonState</span><span class="text-white font-bold">;</span>
<span class="text-white font-bold">}</span></code></pre>
            </div>
          </div>

          <!-- Guide on Opening Serial Monitor on Tinkercad -->
          <div class="p-5 rounded-2xl bg-stone-900 text-white border border-stone-700 space-y-3">
            <h4 class="text-sm font-black text-amber-300 flex items-center gap-2">
              <Terminal class="w-4 h-4 text-amber-400" />
              วิธีเปิดดูหน้าต่าง Serial Monitor ใน Autodesk Tinkercad Circuits:
            </h4>
            <ol class="space-y-2 text-xs text-stone-300 list-decimal pl-4 leading-relaxed">
              <li>คลิกปุ่ม <strong>&lt;/&gt; Code</strong> ที่แถบเครื่องมือด้านบนขวาของหน้าต่าง Tinkercad</li>
              <li>เลือกโหมดโค้ดเป็น <strong>Text</strong> แล้ววางโค้ดที่คัดลอกลงไป</li>
              <li>มองไปที่ <strong>แถบด้านล่างสุดของหน้าจอโค้ด</strong> จะมีปุ่มสีเทาเขียนว่า <strong>"Serial Monitor"</strong></li>
              <li>คลิกปุ่ม <strong>Serial Monitor</strong> หน้าต่างสีดำจะเลื่อนเปิดขึ้นมา</li>
              <li>กดปุ่ม <strong>Start Simulation</strong> สีเขียวด้านบนขวา จากนั้นคลิกที่ปุ่มกดบนบอร์ดเพื่อสังเกตข้อความรายงานสถานะแบบสดๆ!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- SECTION 5: INTERACTIVE MINI-GAMES & POST-TEST -->
    <!-- ============================================================== -->
    <GameCenterSection
      :course-id="currentCourseId"
      :week="currentWeek"
      drag-title="มินิเกมที่ 1: จัดกลุ่มคำสั่ง Serial, State & Sound สำหรับ Arduino"
      drag-subtitle="ลากชื่อคำสั่งไปใส่ในหมวดหมู่ที่ถูกต้อง: Serial Monitor, ตรรกะสถานะ (State), หรือคำสั่งควบคุมเสียง (เล่นได้ครั้งเดียว)"
      :drag-items="dragItemsData"
      :drag-zones="dragZonesData"
      match-title="มินิเกมที่ 2: จับคู่แนวคิด State, Serial Monitor & Buzzer"
      match-subtitle="จับคู่คำศัพท์ด้านซ้ายกับคำอธิบายการทำงานด้านขวาให้ถูกต้องครบทั้ง 5 คู่ (เล่นได้ครั้งเดียว)"
      :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบหลังเรียนสัปดาห์ที่ 3 (Post-test)"
      quiz-subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจเรื่อง Serial Monitor, Push Button, State & Buzzer"
      :quiz-questions="quizQuestions"
      :games="weekGames"
    />

    <!-- ============================================================== -->
    <!-- SECTION 6: ASSIGNMENT 3 SECTION (SINGLE ASSIGNMENT - TRAFFIC LIGHT) -->
    <!-- ============================================================== -->
    <AssignmentSection :course-id="currentCourseId" assignment-id="asm-3"
      assignment-title="ใบงานที่ 3: ระบบไฟจราจรคนข้ามถนนอัจฉริยะ 3 สี พร้อมปุ่มกดและสัญญาณเสียงเตือน (Smart Traffic Light Controller with Push Button & Buzzer) บน Tinkercad"
      :max-score="10">
      <template #number>3</template>
      <template #description>
        <p class="leading-relaxed">
          ในใบงานนี้นักศึกษาจะได้รับมอบหมาย <strong>ภารกิจเดี่ยวระดับเดียว (10 คะแนนเต็ม)</strong>
          ในการจำลองและเขียนโปรแกรมระบบไฟจราจรคนข้ามถนนอัจฉริยะ (Smart Traffic Light & Pedestrian Crossing with Buzzer)
          บน Autodesk Tinkercad Circuits โดยประยุกต์ใช้ความรู้เรื่อง <strong>ดิจิทัลเอาต์พุต (หลอดไฟ LED 3 สี
            เขียว-เหลือง-แดง)</strong>,
          <strong>ดิจิทัลอินพุต (Push Button: pinMode INPUT)</strong>,
          <strong>การควบคุมลำดับสถานะ (State Machine & Edge Detection)</strong>
          และ <strong>สัญญาณเสียงเตือนผู้ข้ามถนน (Piezo Buzzer: tone / noTone)</strong>
          เมื่อต่อวงจรและเขียนโปรแกรมเสร็จสมบูรณ์
          <strong>ให้ยกมือเรียกครูผู้สอนไปตรวจการทำงานจริงที่หน้าจอโต๊ะเรียน</strong> เพื่อประเมินและลงคะแนนในระบบ
        </p>
      </template>

      <template #tasks>
        <div class="space-y-6">
          <!-- Mission Overview Banner Card -->
          <div
            class="rounded-3xl p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-md relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none">
            </div>
            <div class="relative z-10 space-y-2.5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span
                  class="px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-black backdrop-blur-xs border border-white/15">
                  ภารกิจเดี่ยวระดับเดียว (Single Level) • 10 คะแนนเต็ม
                </span>
                <span
                  class="px-2.5 py-1 rounded-xl bg-white/20 text-white text-xs font-black backdrop-blur-xs flex items-center gap-1.5">
                  <Trophy class="w-4 h-4 text-amber-200" />
                  เต็ม 10 คะแนน
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white">
                ระบบไฟจราจรอัจฉริยะ 3 สี (เขียว-เหลือง-แดง) พร้อมปุ่มกดและสัญญาณเสียงเตือน
              </h3>
              <p class="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-3xl">
                จำลองไฟจราจรคนข้ามถนน: เมื่อยังไม่มีใครกดปุ่มไฟแดงจะติดค้างไว้
                เมื่อคนเดินเท้ากดปุ่มจะเปลี่ยนเป็นไฟเขียวให้ข้ามพร้อมเสียงเตือนยาว 3 วินาที
                และเมื่อกดปุ่มอีกครั้งระบบจะส่งสัญญาณเตือนด้วยไฟเขียวกระพริบ 3 ครั้งตามจังหวะเสียง ตามด้วยไฟเหลืองค้าง 3
                วินาทีพร้อมเสียงยาว ก่อนจะเปลี่ยนกลับเป็นไฟแดงและดับเสียงอย่างปลอดภัย
              </p>
            </div>
          </div>

          <!-- Hardware Pinout & Wiring Table Card -->
          <div class="rounded-2xl p-5 bg-stone-50 border border-stone-200 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4 class="text-sm font-black text-stone-900 flex items-center gap-2">
                <Cable class="w-4 h-4 text-amber-600" />
                ตารางการต่อวงจรฮาร์ดแวร์บน Tinkercad (Hardware Pinout Guide)
              </h4>
              <span
                class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                อุปกรณ์ 5 ชิ้น: LED 3 สี, ปุ่มกด 1 ตัว, ลำโพง Buzzer 1 ตัว
              </span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table class="w-full text-xs text-left text-stone-700">
                <thead class="bg-stone-100 text-stone-800 font-black border-b border-stone-200">
                  <tr>
                    <th class="p-3">อุปกรณ์ (Component)</th>
                    <th class="p-3">ขาบนอุปกรณ์ (Terminal)</th>
                    <th class="p-3">ต่อเข้าขา Arduino Uno</th>
                    <th class="p-3">ข้อกำหนด / รายละเอียดการต่อวงจร</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-200 font-medium">
                  <!-- Push Button Pin 2 -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-stone-900 flex items-center gap-1.5">
                      <ToggleLeft class="w-4 h-4 text-blue-600 shrink-0" />
                      Push Button (สวิตช์ปุ่มกด)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Terminal 1a (หรือ 1b)</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold">Digital Pin 2</span>
                    </td>
                    <td class="p-3 text-stone-600">เป็นขาตรวจจับการกดปุ่ม (ใช้โหมด
                      <code>pinMode(2, INPUT);</code>)</td>
                  </tr>
                  <!-- Push Button GND -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-stone-900 flex items-center gap-1.5">
                      <ToggleLeft class="w-4 h-4 text-blue-600 shrink-0" />
                      Push Button (ขาอีกฝั่ง)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Terminal 2a (หรือ 2b)</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-stone-200 text-stone-900 font-mono font-bold">GND (กราวด์)</span>
                    </td>
                    <td class="p-3 text-rose-600 font-bold">ห้ามต่อไฟ 5V เด็ดขาด! สวิตช์ต่อช็อตลง GND เท่านั้น</td>
                  </tr>
                  <!-- Red LED -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-rose-600 flex items-center gap-1.5">
                      <Lightbulb class="w-4 h-4 text-rose-500 shrink-0" />
                      หลอดไฟ LED สีแดง (Red)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Anode (+) ขั้วบวกขายาว</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-bold">Digital Pin 12</span>
                    </td>
                    <td class="p-3 text-stone-600">ต่อผ่านตัวต้านทาน <strong>220 โอห์ม (Ω)</strong> ก่อนเข้า Pin 12
                      (ขาลบ Cathode ลง GND)</td>
                  </tr>
                  <!-- Yellow LED -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-amber-600 flex items-center gap-1.5">
                      <Lightbulb class="w-4 h-4 text-amber-500 shrink-0" />
                      หลอดไฟ LED สีเหลือง (Yellow)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Anode (+) ขั้วบวกขายาว</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">Digital Pin
                        11</span></td>
                    <td class="p-3 text-stone-600">ต่อผ่านตัวต้านทาน <strong>220 โอห์ม (Ω)</strong> ก่อนเข้า Pin 11
                      (ขาลบ Cathode ลง GND)</td>
                  </tr>
                  <!-- Green LED -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-emerald-600 flex items-center gap-1.5">
                      <Lightbulb class="w-4 h-4 text-emerald-500 shrink-0" />
                      หลอดไฟ LED สีเขียว (Green)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Anode (+) ขั้วบวกขายาว</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold">Digital Pin
                        10</span></td>
                    <td class="p-3 text-stone-600">ต่อผ่านตัวต้านทาน <strong>220 โอห์ม (Ω)</strong> ก่อนเข้า Pin 10
                      (ขาลบ Cathode ลง GND)</td>
                  </tr>
                  <!-- Piezo Buzzer -->
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-black text-stone-900 flex items-center gap-1.5">
                      <Volume2 class="w-4 h-4 text-indigo-500 shrink-0" />
                      Piezo Buzzer (ลำโพงบัซเซอร์)
                    </td>
                    <td class="p-3 font-mono text-stone-600">Positive (+) สีแดง / Negative (-) สีดำ</td>
                    <td class="p-3"><span
                        class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono font-bold">Pin 8 และ
                        GND</span></td>
                    <td class="p-3 text-stone-600">ขาบวกต่อ Digital Pin 8, ขาลบต่อลง GND (ใช้คำสั่ง
                      <code>tone(8, freq)</code> และ <code>noTone(8)</code>)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- State Machine Sequence Cards (Flowchart of Traffic Light) -->
          <div class="space-y-4">
            <h4 class="text-sm font-black text-stone-900 flex items-center gap-2">
              <SlidersVertical class="w-4 h-4 text-amber-600" />
              ลำดับการทำงานและเงื่อนไขของสถานะ (State Machine Sequence)
            </h4>

            <!-- INTERACTIVE TRAFFIC LIGHT & BUZZER SIMULATOR -->
            <div class="rounded-3xl p-6 sm:p-8 bg-stone-900 border-2 border-stone-800 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <!-- Dynamic Background Glow based on Active Light -->
              <div v-if="simRed" class="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-rose-600/20 blur-3xl pointer-events-none transition-all duration-500"></div>
              <div v-if="simYellow" class="absolute left-1/3 -top-12 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none transition-all duration-500"></div>
              <div v-if="simGreen" class="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none transition-all duration-500"></div>

              <!-- Simulator Header & Controls Bar -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4 relative z-10">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider"
                      :class="simState === 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (simState === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')">
                      จำลองการทำงานจริง • State {{ simState }}
                    </span>
                    <span v-if="simIsBusy" class="flex items-center gap-1 text-[11px] font-bold text-amber-400 animate-pulse">
                      <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                      กำลังเปลี่ยนสถานะ...
                    </span>
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <SlidersVertical class="w-5 h-5 text-amber-400" />
                    จำลองระบบไฟจราจร 3 สี & ลำโพง Buzzer (Interactive Simulator)
                  </h3>
                  <p class="text-xs text-stone-400">
                    คลิกที่ "ปุ่มกดจำลอง" เพื่อทดสอบและดูการทำงานของหลอดไฟ 3 ดวงและเสียงลำโพงเสมือนจริง
                  </p>
                </div>

                <!-- Top Controls: Sound Toggle & Reset -->
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    @click="toggleSimAudio"
                    class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    :class="simAudioEnabled 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 hover:bg-indigo-600/40' 
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'"
                    :title="simAudioEnabled ? 'คลิกเพื่อปิดเสียง' : 'คลิกเพื่อเปิดเสียงสังเคราะห์'"
                  >
                    <Volume2 v-if="simAudioEnabled" class="w-4 h-4 text-indigo-400 animate-pulse" />
                    <VolumeX v-else class="w-4 h-4 text-stone-500" />
                    <span>{{ simAudioEnabled ? 'เปิดเสียงลำโพงอยู่' : 'ปิดเสียง (Muted)' }}</span>
                  </button>

                  <button
                    @click="resetSim"
                    class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="รีเซ็ตกลับสู่สถานะเริ่มต้น"
                  >
                    <RotateCw class="w-3.5 h-3.5" />
                    <span>รีเซ็ต</span>
                  </button>
                </div>
              </div>

              <!-- Main Interactive Stage (Lights + Buzzer + Push Button + Terminal) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <!-- Left: Traffic Light Housing (4 cols) -->
                <div class="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-950/80 rounded-2xl border border-stone-800/80 shadow-inner">
                  <span class="text-[11px] font-mono text-stone-500 uppercase tracking-widest font-black mb-3">Traffic Light Housing</span>
                  
                  <!-- The Pillar / Casing -->
                  <div class="bg-black/90 p-4 rounded-3xl border-4 border-stone-800 shadow-2xl flex flex-col items-center gap-3.5 w-28 sm:w-32 relative">
                    <!-- Red Lamp -->
                    <div class="flex flex-col items-center gap-1">
                      <div 
                        class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative"
                        :class="simRed 
                          ? 'bg-rose-500 border-rose-300 shadow-[0_0_35px_rgba(244,63,94,0.95)]' 
                          : 'bg-rose-950/40 border-stone-800 opacity-40'"
                      >
                        <div v-if="simRed" class="w-6 h-6 rounded-full bg-white/40 blur-xs"></div>
                        <span class="absolute bottom-1 text-[9px] font-black uppercase tracking-wider" :class="simRed ? 'text-white drop-shadow' : 'text-stone-600'">RED</span>
                      </div>
                    </div>

                    <!-- Yellow Lamp -->
                    <div class="flex flex-col items-center gap-1">
                      <div 
                        class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative"
                        :class="simYellow 
                          ? 'bg-amber-400 border-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.95)]' 
                          : 'bg-amber-950/40 border-stone-800 opacity-40'"
                      >
                        <div v-if="simYellow" class="w-6 h-6 rounded-full bg-white/40 blur-xs"></div>
                        <span class="absolute bottom-1 text-[9px] font-black uppercase tracking-wider" :class="simYellow ? 'text-stone-900 drop-shadow' : 'text-stone-600'">YELLOW</span>
                      </div>
                    </div>

                    <!-- Green Lamp -->
                    <div class="flex flex-col items-center gap-1">
                      <div 
                        class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative"
                        :class="simGreen 
                          ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.95)]' 
                          : 'bg-emerald-950/40 border-stone-800 opacity-40'"
                      >
                        <div v-if="simGreen" class="w-6 h-6 rounded-full bg-white/40 blur-xs"></div>
                        <span class="absolute bottom-1 text-[9px] font-black uppercase tracking-wider" :class="simGreen ? 'text-stone-900 drop-shadow' : 'text-stone-600'">GREEN</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Middle: Buzzer Indicator + Pedestrian Push Button (4 cols) -->
                <div class="lg:col-span-4 flex flex-col justify-between gap-4 h-full">
                  <!-- Buzzer Visualizer Card -->
                  <div class="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <!-- Buzzer Speaker Disk -->
                      <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center relative transition-all"
                        :class="simBuzzer 
                          ? 'bg-indigo-600/40 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.7)]' 
                          : 'bg-stone-900 border-stone-700'">
                        <!-- Center Speaker Hole -->
                        <div class="w-4 h-4 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center">
                          <div class="w-1.5 h-1.5 rounded-full" :class="simBuzzer ? 'bg-indigo-400 animate-ping' : 'bg-stone-700'"></div>
                        </div>
                        <!-- Wave Ring Animation when sound is active -->
                        <div v-if="simBuzzer" class="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-60 pointer-events-none"></div>
                      </div>

                      <div>
                        <p class="text-xs font-black text-white flex items-center gap-1.5">
                          <Volume2 class="w-3.5 h-3.5" :class="simBuzzer ? 'text-indigo-400' : 'text-stone-500'" />
                          Piezo Buzzer (Pin 8)
                        </p>
                        <p class="text-[11px] font-mono" :class="simBuzzer ? 'text-indigo-300 font-bold' : 'text-stone-500'">
                          {{ simBuzzer ? `เสียงดัง (${simBuzzerFreq} Hz)` : 'ดับสนิท (noTone)' }}
                        </p>
                      </div>
                    </div>

                    <!-- Frequency Badge -->
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                      :class="simBuzzer ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-stone-900 text-stone-600'">
                      {{ simBuzzer ? 'SOUND ACTIVE' : 'IDLE' }}
                    </span>
                  </div>

                  <!-- Pedestrian Push Button Box (ตลับปุ่มกดข้ามถนน) -->
                  <div class="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col items-center text-center space-y-3">
                    <div class="space-y-0.5">
                      <span class="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">
                        Pedestrian Crossing Button (Pin 2)
                      </span>
                      <p class="text-xs font-bold text-stone-300">
                        สวิตช์ปุ่มกดคนข้ามถนน (Digital Input Button)
                      </p>
                    </div>

                    <!-- The Clickable Big Button -->
                    <button
                      @click="handleSimButtonPress"
                      :disabled="simIsBusy"
                      class="w-full py-4 px-6 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden select-none"
                      :class="simIsBusy 
                        ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60' 
                        : (simState === 0 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/25 active:translate-y-1 cursor-pointer ring-2 ring-amber-300' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 shadow-emerald-500/25 active:translate-y-1 cursor-pointer ring-2 ring-emerald-300')"
                    >
                      <ToggleLeft class="w-5 h-5 shrink-0" />
                      <span>
                        {{ simIsBusy 
                          ? 'ระบบกำลังเปลี่ยนสถานะ...' 
                          : (simState === 0 
                            ? 'กดปุ่มเพื่อขอข้าม (ครั้งที่ 1)' 
                            : 'กดปุ่มอีกครั้ง (ครั้งที่ 2)') }}
                      </span>
                    </button>

                    <p class="text-[11px] text-stone-400 leading-tight">
                      {{ simState === 0 
                        ? 'กดปุ่ม: ไฟแดงดับ ➔ ไฟเขียวติด + เสียงดังยาว 3 วินาที' 
                        : (simState === 1 
                          ? 'กดปุ่มอีกครั้ง: เขียวกระพริบ 3 ครั้ง ➔ เหลือง 3 วิ ➔ กลับสู่ไฟแดง' 
                          : 'กำลังทำงานตามขั้นตอน...') }}
                    </p>
                  </div>
                </div>

                <!-- Right: Live Telemetry & Serial Monitor Feed (4 cols) -->
                <div class="lg:col-span-4 flex flex-col justify-between gap-3 h-full">
                  <!-- Status Banner -->
                  <div class="p-3.5 rounded-2xl border transition-all"
                    :class="simState === 0 
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' 
                      : (simState === 1 
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' 
                        : 'bg-amber-950/40 border-amber-800/80 text-amber-200')">
                    <p class="text-[11px] font-bold uppercase tracking-wider opacity-75">คำอธิบายสถานะปัจจุบัน (Status):</p>
                    <p class="text-xs font-bold leading-relaxed mt-0.5">{{ simStatusText }}</p>
                  </div>

                  <!-- Simulated Serial Monitor Terminal -->
                  <div class="p-3.5 rounded-2xl bg-black/90 border border-stone-800 font-mono text-[11px] space-y-2 shadow-inner">
                    <div class="flex items-center justify-between border-b border-stone-800 pb-1.5 text-stone-400">
                      <span class="flex items-center gap-1.5 text-amber-400 font-bold text-[10px]">
                        <Terminal class="w-3.5 h-3.5" />
                        Serial Monitor (9600 baud)
                      </span>
                      <span class="text-[9px] text-stone-500">Live Feedback</span>
                    </div>

                    <div class="h-32 overflow-y-auto space-y-1 text-stone-300 pr-1">
                      <div v-for="(log, idx) in simSerialLogs" :key="idx" class="flex items-start gap-1.5 leading-snug">
                        <span class="text-stone-500 shrink-0 text-[10px]">[{{ log.time }}]</span>
                        <span :class="log.text.includes('State 1') ? 'text-emerald-400 font-bold' : (log.text.includes('State 2') || log.text.includes('ไฟเหลือง') ? 'text-amber-400 font-bold' : (log.text.includes('State 0') ? 'text-rose-400' : 'text-stone-300'))">
                          {{ log.text }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3 State Flow Cards (Dynamically Highlighted based on simState) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Initial State -->
              <div
                class="p-5 rounded-2xl border-2 shadow-xs space-y-3 flex flex-col justify-between transition-all duration-300"
                :class="simState === 0 
                  ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-400 shadow-md scale-[1.01]' 
                  : 'bg-white border-stone-200 opacity-70 hover:opacity-100'">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-black border"
                      :class="simState === 0 ? 'bg-rose-200 text-rose-900 border-rose-300' : 'bg-rose-100 text-rose-800 border-rose-200'">
                      สถานะเริ่มต้น (Standby)
                    </span>
                    <span class="text-xs font-mono font-bold" :class="simState === 0 ? 'text-rose-700' : 'text-stone-400'">
                      State 0 {{ simState === 0 ? '• ACTIVE' : '' }}
                    </span>
                  </div>
                  <h5 class="text-sm font-black text-stone-900">
                    ไฟแดงติดค้าง (ห้ามข้าม / รอคนกดปุ่ม)
                  </h5>
                  <div class="p-3 rounded-xl border text-xs text-stone-600 space-y-1.5"
                    :class="simState === 0 ? 'bg-white border-rose-200' : 'bg-stone-50 border-stone-200'">
                    <p class="flex items-center justify-between">
                      <span>ไฟสีแดง:</span>
                      <strong class="text-rose-600 font-black">ติดสว่าง (HIGH)</strong>
                    </p>
                    <p class="flex items-center justify-between">
                      <span>ไฟสีเหลือง & เขียว:</span>
                      <span class="text-stone-400">ดับสนิท (LOW)</span>
                    </p>
                    <p class="flex items-center justify-between">
                      <span>ลำโพง Buzzer:</span>
                      <span class="text-stone-400">เงียบสนิท (noTone)</span>
                    </p>
                  </div>
                  <p class="text-[11px] text-stone-500 leading-relaxed">
                    ระบบจะหยุดนิ่งอยู่ในสถานะนี้ตลอดเวลา จนกว่าจะมีคนเดินเท้ามากดปุ่ม
                  </p>
                </div>
                <div
                  class="p-2 rounded-lg text-[11px] font-bold border text-center transition-all"
                  :class="simState === 0 ? 'bg-rose-200 text-rose-950 border-rose-300 shadow-xs' : 'bg-amber-50 text-amber-800 border-amber-200'">
                  เมื่อตรวจพบการกดปุ่มครั้งที่ 1 ➔ เข้าสู่ State 1
                </div>
              </div>

              <!-- State 1: ไปได้ -->
              <div
                class="p-5 rounded-2xl border-2 shadow-xs space-y-3 flex flex-col justify-between transition-all duration-300"
                :class="simState === 1 
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-[1.01]' 
                  : 'bg-white border-stone-200 opacity-70 hover:opacity-100'">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-black border"
                      :class="simState === 1 ? 'bg-emerald-200 text-emerald-950 border-emerald-300' : 'bg-emerald-100 text-emerald-900 border-emerald-200'">
                      State แรก: "ไปได้"
                    </span>
                    <span class="text-xs font-mono font-bold" :class="simState === 1 ? 'text-emerald-700' : 'text-stone-400'">
                      State 1 {{ simState === 1 ? '• ACTIVE' : '' }}
                    </span>
                  </div>
                  <h5 class="text-sm font-black text-stone-900">
                    ไฟเขียวติดสว่าง + Buzzer ดังยาว 3 วิ
                  </h5>
                  <div class="p-3 bg-white rounded-xl border text-xs text-stone-700 space-y-1.5"
                    :class="simState === 1 ? 'border-emerald-300' : 'border-stone-200'">
                    <p class="flex items-center justify-between">
                      <span>ไฟสีแดง:</span>
                      <span class="text-stone-400">ดับลงทันที (LOW)</span>
                    </p>
                    <p class="flex items-center justify-between">
                      <span>ไฟสีเขียว:</span>
                      <strong class="text-emerald-600 font-black">ติดสว่าง (HIGH)</strong>
                    </p>
                    <p class="flex items-center justify-between">
                      <span>ลำโพง Buzzer:</span>
                      <strong class="text-indigo-600 font-black">ดังยาว 3 วินาที</strong>
                    </p>
                  </div>
                  <p class="text-[11px] text-stone-600 leading-relaxed">
                    เมื่อกดปุ่ม: ไฟแดงดับ ไฟเขียวติดสว่าง ลำโพง Buzzer ส่งเสียงดังยาวต่อเนื่อง 3 วินาที (เช่น 1000 Hz)
                    หลังจากครบ 3 วิ เสียงจะหยุดลง แต่ <strong>ไฟสีเขียวยังคงติดสว่างค้างไว้</strong>
                    เพื่อให้คนข้ามถนนได้ต่อเนื่อง
                  </p>
                </div>
                <div
                  class="p-2 rounded-lg text-[11px] font-bold border text-center transition-all"
                  :class="simState === 1 ? 'bg-emerald-200 text-emerald-950 border-emerald-300 shadow-xs' : 'bg-emerald-100 text-emerald-900 border-emerald-200'">
                  เมื่อตรวจพบการกดปุ่มอีกทีหนึ่ง ➔ เข้าสู่ State 2
                </div>
              </div>

              <!-- State 2: สัญญาณเตือนและเปลี่ยนกลับ -->
              <div
                class="p-5 rounded-2xl border-2 shadow-xs space-y-3 flex flex-col justify-between transition-all duration-300"
                :class="simState === 2 
                  ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400 shadow-md scale-[1.01]' 
                  : 'bg-white border-stone-200 opacity-70 hover:opacity-100'">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-black border"
                      :class="simState === 2 ? 'bg-amber-200 text-amber-950 border-amber-300' : 'bg-amber-100 text-amber-900 border-amber-200'">
                      State สอง: เตือน & สลับกลับ
                    </span>
                    <span class="text-xs font-mono font-bold" :class="simState === 2 ? 'text-amber-700' : 'text-stone-400'">
                      State 2 {{ simState === 2 ? '• ACTIVE' : '' }}
                    </span>
                  </div>
                  <h5 class="text-sm font-black text-stone-900">
                    เขียวกระพริบ ➔ เหลืองค้าง ➔ กลับสู่ไฟแดง
                  </h5>
                  <div class="p-3 bg-white rounded-xl border text-xs text-stone-700 space-y-2"
                    :class="simState === 2 ? 'border-amber-300' : 'border-stone-200'">
                    <div class="space-y-1">
                      <p class="font-bold text-stone-800">1. ไฟเขียวกระพริบ 3 ครั้ง:</p>
                      <p class="text-[11px] text-stone-600 pl-2">ไฟเขียวกระพริบ 3 รอบ และ <strong>Buzzer
                          ดังตามจังหวะกระพริบ</strong></p>
                    </div>
                    <div class="space-y-1">
                      <p class="font-bold text-stone-800">2. เปลี่ยนเป็นไฟเหลืองค้าง 3 วิ:</p>
                      <p class="text-[11px] text-stone-600 pl-2">ไฟเขียวดับ ไฟเหลืองติดค้าง 3 วิ + <strong>Buzzer ดังยาว
                          3 วิ</strong></p>
                    </div>
                    <div class="space-y-1">
                      <p class="font-bold text-stone-800">3. สลับกลับเป็นไฟแดง:</p>
                      <p class="text-[11px] text-stone-600 pl-2">ไฟเหลืองดับ ไฟแดงติดสว่างขึ้นมา และ <strong>Buzzer
                          ดับสนิท</strong></p>
                    </div>
                  </div>
                </div>
                <div
                  class="p-2 rounded-lg text-[11px] font-bold border text-center transition-all"
                  :class="simState === 2 ? 'bg-amber-200 text-amber-950 border-amber-300 shadow-xs' : 'bg-stone-100 text-stone-800 border-stone-200'">
                  ระบบกลับสู่ State 0 (ไฟแดง) พร้อมเริ่มรอบใหม่
                </div>
              </div>
            </div>
          </div>


          <!-- Step-by-Step Instructions Card -->
          <div class="p-5 rounded-2xl bg-white border border-stone-200 space-y-3">
            <h4 class="text-sm font-black text-stone-900 flex items-center gap-2">
              <ListOrdered class="w-4 h-4 text-amber-600" />
              ขั้นตอนการปฏิบัติแล็บและการส่งงาน (Step-by-Step Lab & Submission Guide)
            </h4>

            <ol class="space-y-2.5 text-xs text-stone-700">
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p>
                  <strong>เข้าสู่ระบบ Tinkercad Circuits:</strong> ไปที่เว็บไซต์ <a
                    href="https://www.tinkercad.com/circuits" target="_blank"
                    class="text-amber-600 underline font-bold">tinkercad.com/circuits</a> ล็อกอินด้วยบัญชีนักศึกษา
                  แล้วกด <strong>+ Create &gt; Circuit</strong>
                </p>
              </li>

              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p>
                  <strong>ตั้งชื่อชิ้นงาน:</strong> แก้ไขชื่อโปรเจกต์ที่มุมซ้ายบนเป็น
                  <code>Lab3_IoT_[รหัสนักศึกษา]_[ชื่อ-นามสกุล]</code> เช่น <code>Lab3_IoT_66309010001_Somchai</code>
                </p>
              </li>

              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p>
                  <strong>วางอุปกรณ์และต่อวงจร:</strong> ลาก Arduino Uno R3, Breadboard Small, หลอด LED 3 สี (แดง,
                  เหลือง, เขียว), ตัวต้านทาน 220Ω (3 ตัว), Push Button (1 ตัว) และ Piezo Buzzer (1 ตัว) แล้วต่อสายไฟตาม
                  <em>ตารางการต่อวงจรฮาร์ดแวร์</em> ด้านบน (เน้นย้ำ: ปุ่มกดต่อเข้า Pin 2 กับ GND เท่านั้น ไม่ต้องต่อไฟ
                  5V)
                </p>
              </li>

              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p>
                  <strong>เขียนโค้ดภาษา C++:</strong> เปิดแท็บ Code เลือกโหมด Text แล้วเขียนโปรแกรมควบคุมตามเงื่อนไข
                  State Machine ทั้งหมด (สามารถศึกษาโค้ดตัวอย่างใน <strong>Lab 3</strong> ด้านบนเพื่อนำมาประยุกต์ใช้ได้)
                </p>
              </li>

              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                <p>
                  <strong>จำลองและทดสอบการทำงาน:</strong> กดปุ่ม <strong>Start Simulation</strong>
                  ทดลองคลิกกดปุ่มครั้งที่ 1 (ดูไฟเขียวและฟังเสียงยาว 3 วิ) จากนั้นคลิกกดปุ่มอีกครั้ง (ดูไฟเขียวกระพริบ 3
                  ครั้งพร้อมเสียง -> ไฟเหลืองค้าง 3 วิพร้อมเสียงยาว -> เปลี่ยนกลับเป็นไฟแดง)
                </p>
              </li>

              <li class="flex items-start gap-2.5 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <span
                  class="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">6</span>
                <p class="text-amber-950">
                  <strong>ยกมือเรียกครูผู้สอนตรวจที่โต๊ะ (Live Evaluation):</strong> เมื่อวงจรทำงานสมบูรณ์แล้ว
                  ให้นักศึกษายกมือเรียกครูผู้สอนเพื่อตรวจการทำงานสดที่หน้าจอคอมพิวเตอร์และบันทึกคะแนนลงระบบ
                </p>
              </li>

              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">7</span>
                <p>
                  <strong>ส่งงานในระบบ:</strong> กดปุ่ม Share ที่มุมขวาบนของ Tinkercad เลือก Copy Link
                  และบันทึกภาพหน้าจอ (Screenshot) วงจร+โค้ด จากนั้นกดปุ่ม <strong>"ส่งงาน / แนบลิงก์"</strong>
                  ในแบบฟอร์มด้านล่างนี้
                </p>
              </li>
            </ol>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal v-if="showTeacherModal" :course-id="currentCourseId" :week="currentWeek" :games="weekGames"
      @close="showTeacherModal = false" />
  </div>
</template>
