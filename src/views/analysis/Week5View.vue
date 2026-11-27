<script setup>
import { ref, computed } from 'vue'
import {
  Database,
  FileSpreadsheet,
  Users,
  Target,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ExternalLink,
  ArrowRight,
  Sparkles,
  BarChart3,
  Link,
  Search,
  FileText,
  ClipboardList
} from '@lucide/vue'

import AssignmentSection from '@/components/AssignmentSection.vue'

// Course & Week Context
const currentCourseId = '31901-2012'
const currentWeek = 5

// 5-Step Horizontal Roadmap Strip Navigation
const activeRoadmapStep = ref('step-1')
const roadmapSteps = [
  { id: 'step-1', num: '01', title: 'ทำสไลด์ & เปิดข้อมูลเสนอครู', desc: 'นำเสนอหน้าห้องก่อนเริ่มทำ' },
  { id: 'step-2', num: '02', title: 'แบ่งหน้าที่ในกลุ่ม', desc: '3 กลุ่ม: 4 / 4 / 3 คน' },
  { id: 'step-3', num: '03', title: 'วิเคราะห์หาสถิติใน Sheets', desc: '2 ชีต • สูตรตอบคำถาม' },
  { id: 'step-4', num: '04', title: 'สไลด์ & สุ่มนำเสนอ 1 คน', desc: '8 หน้า • เล่าเป็นเรื่องราว' },
  { id: 'step-5', num: '05', title: 'ตรวจเกณฑ์ & ส่ง 3 ลิงก์', desc: 'Sheet + Kaggle + Slides' }
]

const scrollToSection = (id) => {
  activeRoadmapStep.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Step 01: 4 Mandatory Framing Questions before selecting/starting
const framingQuestions = [
  {
    code: 'Q1 • WHY',
    title: 'ทำชุดข้อมูลนี้ไปทำไม?',
    desc: 'ระบุปัญหาหรือข้อสงสัยตั้งต้นให้ชัดว่าอยากรู้อะไรจากข้อมูลชุดนี้ (ไม่ใช่แค่เลือกเพราะไฟล์สวยหรือแถวน้อย)',
    example: 'เช่น อยากรู้ว่ายอดขายที่ดูเยอะในร้านออนไลน์ จริงๆ แล้วกำไรสูงทุกหมวดหรือไม่?'
  },
  {
    code: 'Q2 • WHO',
    title: 'ใครคือผู้รับผลวิเคราะห์?',
    desc: 'กำหนดกลุ่มเป้าหมายที่จะนำผลสรุปของกลุ่มเราไปอ่านและใช้งานต่อได้จริง',
    example: 'เช่น เจ้าของธุรกิจอีคอมเมิร์ซ, ฝ่ายบุคคล (HR), ผู้บริหารสถานศึกษา หรือผู้บริโภคทั่วไป'
  },
  {
    code: 'Q3 • GOAL / ACTION',
    title: 'เอาไปใช้ตัดสินใจเรื่องอะไร?',
    desc: 'ตั้งเป้าหมายปลายทางให้ชัดว่าหากวิเคราะห์เสร็จแล้ว จะนำผลลัพธ์ไปช่วยปรับปรุงหรือแก้ปัญหาเรื่องใด',
    example: 'เช่น เอาไปปรับกลยุทธ์ลดสินค้าขาดทุน หรือจัดโปรโมชันจับกลุ่มลูกค้าที่ซื้อซ้ำสูง'
  },
  {
    code: 'Q4 • QUESTIONS',
    title: 'ตั้งคำถามย่อย 4–5 ข้อ',
    desc: 'เขียนคำถามเฉพาะเจาะจงที่ต้องใช้ตัวเลขจาก Dataset มาพิสูจน์คำตอบ ไม่ใช่ถามกว้างๆ แบบไร้ทิศทาง',
    example: 'เช่น ภูมิภาคใดขายดีสุด, ช่วงราคาไหนกำไรเฉลี่ยสูงสุด, มีบิล Outlier ดึงค่าหรือไม่?'
  }
]

// Step 01: Kaggle Qualification Rules & Suggested Topics
const kaggleRules = [
  {
    num: '01',
    title: 'ห้ามซ้ำกันระหว่างกลุ่ม',
    desc: '1 ชุดข้อมูล ต่อ 1 กลุ่มเท่านั้น แจ้งลิงก์ Kaggle กับครูก่อนลงมือทำเพื่อป้องกันหัวข้อซ้ำ'
  },
  {
    num: '02',
    title: 'ขนาด 500 – 5,000 แถว',
    desc: 'น้อยกว่า 500 แถวจะง่ายเกินไป หากไฟล์จริงใหญ่เป็นหมื่นแถว ให้คัดเฉพาะปีล่าสุดเหลือ 1,000–3,000 แถว'
  },
  {
    num: '03',
    title: 'อย่างน้อย 6 คอลัมน์ (ครบ 3 ประเภท)',
    desc: 'ต้องมีครบ: หมวดหมู่ (Category >= 2) + ตัวเลข (Numeric >= 2) + วันที่/ช่วงเวลา (Date/Year >= 1)'
  },
  {
    num: '04',
    title: 'ตอบเป้าหมายที่ตั้งไว้ได้จริง',
    desc: 'คอลัมน์ในไฟล์ต้องเพียงพอสำหรับนำมาพิสูจน์คำถามทั้ง 4–5 ข้อและเล่าเรื่องต่อได้'
  }
]

const proposalSlideTopics = [
  '1) ชื่อหัวข้อและลิงก์ Dataset จาก Kaggle (ไม่ซ้ำกลุ่มอื่น)',
  '2) จะทำเรื่องอะไร ทำไปทำไม ใครใช้งานต่อ และคำถามตั้งต้น 4–5 ข้อ'
]

const liveDataInspectItems = [
  '3) เปิดตารางข้อมูลจริงบนหน้าจอให้ดูว่ามีคอลัมน์อะไรบ้าง หน้าตาข้อมูลเป็นอย่างไร',
  '4) ชี้ให้เห็นว่ามีส่วนไหนที่เสียต้องคลีนไหม (ค่าว่าง ข้อมูลซ้ำ Format เพี้ยน Outlier) พร้อมแนวทางคลีนใน 02_Analysis_Data'
]

const suggestedKaggleTopics = [
  {
    topic: 'E-Commerce / Superstore Sales',
    cols: 'หมวดสินค้า, ภูมิภาค, วันที่สั่งซื้อ, ยอดขาย, กำไร, ส่วนลด',
    storyHook: 'ทำไมหมวดที่ขายได้เยอะที่สุดกลับทำกำไรน้อยกว่าหมวดรองลงมา?'
  },
  {
    topic: 'HR Employee Attrition (การลาออก)',
    cols: 'แผนก, ตำแหน่ง, อายุงาน, OT, เงินเดือน, สถานะการลาออก',
    storyHook: 'กลุ่มเงินเดือนระดับไหนและแผนกใดที่ทำ OT แล้วเสี่ยงลาออกสูงสุด?'
  },
  {
    topic: 'Food Delivery / Cafe Orders',
    cols: 'ประเภทอาหาร, ช่วงเวลา, เวลาจัดส่ง, ราคา, คะแนนรีวิว',
    storyHook: 'ช่วงเวลาเร่งด่วนทำให้ส่งช้าลงกี่นาที และส่งผลต่อคะแนนรีวิวจริงหรือไม่?'
  },
  {
    topic: 'Student Exam Performance',
    cols: 'เพศ, กลุ่มติวสอบ, ชั่วโมงอ่านหนังสือ, คะแนนคณิต/อ่าน/เขียน',
    storyHook: 'การเข้าคอร์สติวช่วยดึงคะแนนกลุ่มไหนขึ้นมากที่สุดเมื่อดูค่าเฉลี่ยเทียบค่ากลาง?'
  },
  {
    topic: 'Streaming / Mobile App Usage',
    cols: 'แพ็กเกจ, ประเทศ, เพศ, อายุ, เวลาใช้งาน, ค่าบริการรายเดือน',
    storyHook: 'แพ็กเกจใดครองสัดส่วนรายได้สูงสุด และกลุ่มอายุใดใช้งานคุ้มค่าที่สุด?'
  },
  {
    topic: 'Hospital / Healthcare Insurance Cost',
    cols: 'อายุ, BMI, พฤติกรรมสูบบุหรี่, ภูมิภาค, จำนวนบุตร, ค่ารักษา',
    storyHook: 'ปัจจัยใดร่วมกันทำให้ค่ารักษาพุ่งสูงจนดึงค่าเฉลี่ยให้สูงกว่าค่ามัธยฐาน?'
  }
]

// Step 02: Team Roles Breakdown (For 3 Groups: 4 / 4 / 3)
const teamRoles = [
  {
    roleNo: '01',
    title: 'Data Curator & Health Auditor',
    ownerHint: 'ผู้จัดเตรียมชุดข้อมูลและตรวจสุขภาพข้อมูล',
    borderClass: 'border-sky-200 bg-sky-50/50',
    badgeClass: 'bg-sky-600 text-white',
    duties: [
      'นำชุดข้อมูล Kaggle ที่ผ่านการอนุมัติจากครูแล้วมาวางในชีต 01_Master_Data โดยห้ามแก้ไขต้นฉบับ',
      'คัดลอกข้อมูลวางฝั่งซ้ายใน 02_Analysis_Data พร้อมทำส่วนตรวจนับแถว ช่องว่าง และข้อมูลซ้ำ'
    ]
  },
  {
    roleNo: '02',
    title: 'Data Cleaner & Statistics Lead',
    ownerHint: 'ผู้คลีนข้อมูลและหาค่าสถิติหลัก',
    borderClass: 'border-cyan-200 bg-cyan-50/50',
    badgeClass: 'bg-cyan-600 text-white',
    duties: [
      'จัดการจุดเสียที่พบในขั้นที่ 01 และจัดเตรียมข้อมูลให้พร้อมวิเคราะห์ภายในชีต 02_Analysis_Data',
      'สร้างคอลัมน์คำนวณเพิ่ม (ถ้าจำเป็นต่อโจทย์) และหาค่าสถิติพื้นฐานที่จำเป็นเพื่อตอบคำถามของกลุ่ม'
    ]
  },
  {
    roleNo: '03',
    title: 'Formula & Insight Analyst',
    ownerHint: 'ผู้วางโครงสูตรเปรียบเทียบตอบคำถาม',
    borderClass: 'border-indigo-200 bg-indigo-50/50',
    badgeClass: 'bg-indigo-600 text-white',
    duties: [
      'ออกแบบตารางสรุปและเลือกใช้สูตรที่เรียนมาเองเพื่อเจาะลึกคำตอบของคำถามตั้งต้น',
      'ตรวจสอบว่าทุกช่องคำตอบผูกสูตรถูกต้อง 100% (ไม่พิมพ์คำตอบมือ และไม่ดึงข้ามชีต)'
    ]
  },
  {
    roleNo: '04',
    title: 'Data Storyteller & Slide Lead',
    ownerHint: 'ผู้เล่าเรื่อง Insight และออกแบบสไลด์',
    borderClass: 'border-teal-200 bg-teal-50/50',
    badgeClass: 'bg-teal-600 text-white',
    duties: [
      'นำสถิติและคำตอบที่ได้จากชีต 02_Analysis_Data มาเชื่อมโยงตอบเป้าหมายที่ตั้งไว้',
      'ร้อยเรียงเป็นสไลด์เล่าเรื่อง 8 หน้าพร้อมสรุปหน้าที่ทุกคน และซ้อมให้ทั้งทีมพูดแทนกันได้'
    ]
  }
]

// Step 03: Open-ended guiding principles inside 02_Analysis_Data (problem-driven)
const analysisPrinciples = [
  {
    no: '01',
    title: 'คลีนข้อมูลให้พร้อมใช้ใน 02_Analysis_Data',
    badge: 'Data Preparation',
    borderClass: 'border-sky-200 bg-sky-50/50',
    badgeClass: 'bg-sky-600 text-white',
    bullets: [
      'คัดลอกข้อมูลจาก 01_Master_Data มาทำทั้งหมดใน 02_Analysis_Data โดยห้ามแก้ไขชีตต้นฉบับ',
      'แก้ไขจุดเสียที่ตรวจเจอตอนเปิดข้อมูลหน้าห้องในขั้นที่ 01 ให้เรียบร้อยก่อนเริ่มคำนวณ',
      'สร้างคอลัมน์คำนวณเพิ่มได้ตามความเหมาะสม หากช่วยให้ตอบคำถามของกลุ่มได้ชัดเจนขึ้น'
    ]
  },
  {
    no: '02',
    title: 'หาสถิติและคำนวณด้วยสูตรเพื่อตอบคำถามที่ตั้งไว้',
    badge: 'Formula-Driven Analysis',
    borderClass: 'border-indigo-200 bg-indigo-50/50',
    badgeClass: 'bg-indigo-600 text-white',
    bullets: [
      'กลุ่มออกแบบตารางวิเคราะห์และเลือกใช้สูตรที่เรียนมาเองได้อย่างอิสระเพื่อให้ได้คำตอบของคำถามที่ตั้งไว้',
      'เลือกวิเคราะห์มุมมองที่เหมาะกับข้อมูลจริง เช่น ภาพรวมสถิติ การเปรียบเทียบตามเงื่อนไข สัดส่วนร้อยละ หรือการจัดอันดับ',
      'กติกาบังคับ: ต้องผูกสูตรทั้งหมด ห้ามพิมพ์ตัวเลขคำตอบลงไปเอง และห้ามดึงสูตรข้ามชีต'
    ]
  },
  {
    no: '03',
    title: 'ผลลัพธ์ต้องลึกพอจะเล่าเรื่องและนำไปตัดสินใจได้จริง',
    badge: 'Decision-Ready Output',
    borderClass: 'border-teal-200 bg-teal-50/50',
    badgeClass: 'bg-teal-600 text-white',
    bullets: [
      'สถิติและตารางสรุปที่หาได้ ต้องตอบคำถามและเป้าหมายที่นำเสนอให้ครูอนุมัติไว้ในขั้นที่ 01 ได้ครบ',
      'มีหลักฐานตัวเลขหรือมุมมองเปรียบเทียบที่ชัดเจนพอจะนำไปเล่าเป็นเรื่องราวต่อในสไลด์ได้',
      'เตรียมพร้อมตอบคำถามเมื่ออาจารย์สุ่มคลิกดู Formula Bar ในวันนำเสนอ'
    ]
  }
]

// Step 04: 8-Slide Storytelling Structure
const slideOutline = [
  {
    slideNo: 'Slide 01',
    title: 'หน้าปก & พาดหัวเรื่องราว (Hook Title)',
    detail: 'ตั้งชื่อเรื่องให้น่าสนใจเหมือนบทความวิเคราะห์ (เช่น "ทำไมลูกค้าที่ซื้อบ่อยสุดอาจไม่ใช่กลุ่มที่ทำกำไรสูงสุด?") พร้อมชื่อกลุ่มและสมาชิกทุกคน'
  },
  {
    slideNo: 'Slide 02',
    title: 'เป้าหมาย คำถามตั้งต้น & ชุดข้อมูล Kaggle',
    detail: 'เล่าเหตุผลว่าทำชุดข้อมูลนี้ทำไม เอาไปใช้อะไร เป้าหมายคืออะไร ใครคือผู้ใช้ พร้อมคำถามตั้งต้น 4–5 ข้อที่ผ่านการอนุมัติจากครู'
  },
  {
    slideNo: 'Slide 03',
    title: 'เบื้องหลังสิ่งที่กลุ่มทำใน 02_Analysis_Data',
    detail: 'เล่าว่ากลุ่มสร้างคอลัมน์เสริมอะไรเพิ่ม ตรวจเช็กคุณภาพข้อมูลเจออะไร และสร้างตารางเปรียบเทียบแบบไหน (แคปภาพการทำงานในชีตมาประกอบ)'
  },
  {
    slideNo: 'Slide 04',
    title: 'ภาพรวม & ความจริงจากค่าเฉลี่ย vs ค่ากลาง',
    detail: 'เปิดด้วยภาพรวมใหญ่ แล้วชี้จุดหักมุมว่าค่าเฉลี่ยถูกข้อมูลสุดโต่งดึงไปทางไหน และพบรายการ Top/Bottom อะไรที่น่าสนใจบ้าง'
  },
  {
    slideNo: 'Slide 05',
    title: 'เรื่องราวเจาะลึก ประเด็นที่ 1 (What/So What)',
    detail: 'เล่าความจริงที่เจอจากการเทียบหลายเงื่อนไข -> อธิบายความหมายเชิงลึกว่าทำไมจึงเกิดแบบนี้ -> ชี้โอกาสหรือจุดเสี่ยงที่พบ'
  },
  {
    slideNo: 'Slide 06',
    title: 'เรื่องราวเจาะลึก ประเด็นที่ 2–3 (สัดส่วน & อันดับ)',
    detail: 'เปรียบเทียบสัดส่วน % และอันดับระหว่างกลุ่มสำคัญ เล่าให้เห็นความเชื่อมโยงระหว่างตัวแปร ไม่ใช่อ่านตัวเลขเรียงทีละบรรทัด'
  },
  {
    slideNo: 'Slide 07',
    title: 'บทสรุป & ข้อเสนอแนะที่ทำได้จริง',
    detail: 'สรุปคำตอบให้ตรงกับเป้าหมายตั้งต้น และเสนอ Action Plan 2–3 ข้อที่ผู้เกี่ยวข้องนำไปตัดสินใจต่อได้ทันทีโดยอ้างอิงตัวเลขที่วิเคราะห์'
  },
  {
    slideNo: 'Slide 08',
    title: 'สรุปหน้าที่สมาชิก & ความพร้อมของทั้งทีม',
    detail: 'แสดงตารางชัดว่าสมาชิกแต่ละคนรับผิดชอบส่วนไหน (ย้ำ: วันนำเสนอจะสุ่มเรียกสมาชิกเพียง 1 คนขึ้นมานำเสนอและตอบคำถามแทนทั้งกลุ่ม)'
  }
]

// Step 05: Grading Rubric (10 Points)
const rubricItems = [
  {
    title: '1. เป้าหมายชัดเจน + Kaggle + โครงสร้าง 2 ชีต',
    score: '1.5 คะแนน',
    colorClass: 'border-sky-200 bg-sky-50/60',
    badgeClass: 'bg-sky-600 text-white',
    desc: 'ตั้งคำถาม-เป้าหมายชัด ผ่านการอนุมัติจากครูก่อนทำ Kaggle ตรงเกณฑ์ (500–5,000 แถว, >= 6 คอลัมน์) และแยก 01_Master_Data + 02_Analysis_Data ถูกต้องไม่ดึงข้ามชีต'
  },
  {
    title: '2. การหาสถิติ & ความถูกต้องของการใช้สูตร',
    score: '4.0 คะแนน',
    colorClass: 'border-indigo-200 bg-indigo-50/60',
    badgeClass: 'bg-indigo-600 text-white',
    desc: 'เลือกใช้สูตรและออกแบบตารางสถิติได้สอดคล้องกับคำถามที่ตั้งไว้ (เช่น สถิติภาพรวม เปรียบเทียบตามเงื่อนไข สัดส่วน หรือจัดอันดับ) โดยผูกสูตร 100% ไม่พิมพ์คำตอบมือ'
  },
  {
    title: '3. การเล่าเรื่องในสไลด์ (Storytelling)',
    score: '2.5 คะแนน',
    colorClass: 'border-teal-200 bg-teal-50/60',
    badgeClass: 'bg-teal-600 text-white',
    desc: 'เล่าเป็นเรื่องราวต่อเนื่อง (What -> So What -> Now What) ตอบเป้าหมายที่ตั้งไว้ได้จริง ไม่ใช่แค่อ่านเลข 10, 20 ลอยๆ บนสไลด์'
  },
  {
    title: '4. ตัวแทนสุ่ม 1 คนนำเสนอแทนทั้งทีม',
    score: '2.0 คะแนน',
    colorClass: 'border-amber-200 bg-amber-50/60',
    badgeClass: 'bg-amber-600 text-white',
    desc: 'สุ่มสมาชิกในทีมเพียง 1 คนขึ้นมานำเสนอและตอบคำถามหน้าจอแทนทั้งกลุ่ม (ประเมินทั้งความเข้าใจเป้าหมายข้อมูล สูตรที่กลุ่มใช้ และการตอบคำถามร่วมกัน)'
  }
]

// Step 05: Interactive Pre-Submission Checklist (6 concise checks)
const checklistItems = ref([
  { id: 'c1', label: 'ทำสไลด์เสนอเป้าหมาย + เปิดข้อมูลจริงหน้าห้อง (ระบุจุดเสียที่ต้องคลีน) และได้รับอนุมัติจากครูผ่านแล้ว', checked: false },
  { id: 'c2', label: 'Google Sheets มีเฉพาะ 01_Master_Data (ห้ามแตะ) และคลีนข้อมูลพร้อมวิเคราะห์ใน 02_Analysis_Data โดยไม่ดึงข้ามชีต', checked: false },
  { id: 'c3', label: 'หาสถิติและสรุปผลตอบคำถามที่ตั้งไว้ได้ครบถ้วน โดยผูกสูตรทั้งหมดใน 02_Analysis_Data (ไม่พิมพ์คำตอบมือ)', checked: false },
  { id: 'c4', label: 'ผลวิเคราะห์ลึกพอจะนำไปตีความเปรียบเทียบและเสนอข้อแนะนำตัดสินใจได้จริง (ไม่ใช่แค่ผลรวมพื้นๆ)', checked: false },
  { id: 'c5', label: 'สไลด์ 8 หน้าเล่าเป็นเรื่องราว (What -> So What -> Now What) และสมาชิกทุกคนซ้อมพร้อมเป็นตัวแทนสุ่ม 1 คนแล้ว', checked: false },
  { id: 'c6', label: 'เปิดสิทธิ์แชร์ Viewer (ทุกคนที่มีลิงก์ดูได้) ทั้ง Google Sheets และ Slides แล้วแนบส่งครบทั้ง 3 ลิงก์', checked: false }
])

const checkedCount = computed(() => checklistItems.value.filter((item) => item.checked).length)
</script>

<template>
  <div class="w-full space-y-10 pb-12 px-4 md:px-8 text-slate-800">
    <!-- =================================================================== -->
    <!-- HERO HEADER BANNER & 5-STEP HORIZONTAL ROADMAP STRIP                 -->
    <!-- =================================================================== -->
    <div class="space-y-4">
      <div
        class="bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-950 rounded-3xl p-8 md:p-11 border border-sky-800/60 shadow-2xl relative overflow-hidden text-white">
        <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-sky-300">
          <BarChart3 class="w-[380px] h-[380px] -translate-y-12 translate-x-12" />
        </div>

        <div class="relative z-10 max-w-5xl space-y-5">
          <div class="flex flex-wrap items-center gap-2.5">
            <span
              class="px-4 py-1.5 bg-sky-500/20 text-sky-200 font-black rounded-full text-xs uppercase tracking-wider border border-sky-400/30">
              สัปดาห์ที่ 5 • รหัสวิชา 31901-2012
            </span>
            <span
              class="px-3.5 py-1.5 bg-amber-500/20 text-amber-200 text-xs rounded-full font-black border border-amber-400/40">
              Group Mini-Project • 10 คะแนนเต็ม
            </span>
            <span
              class="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-200 text-xs rounded-full font-bold border border-emerald-400/30">
              ด่านแรก: ทำสไลด์เสนอหัวข้อ + เปิดข้อมูลสดหน้าห้อง
            </span>
            <span
              class="px-3.5 py-1.5 bg-rose-500/25 text-rose-200 text-xs rounded-full font-black border border-rose-400/40">
              สุ่มสมาชิกในกลุ่มเพียง 1 คนนำเสนอแทนทีม
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Mini-Project: วิเคราะห์ข้อมูลจริงจาก Kaggle<br />
            <span class="text-lg sm:text-2xl md:text-3xl text-cyan-300 font-bold">
              สไลด์เสนอเป้าหมาย + เปิดข้อมูลหน้าห้อง • อนุมัติแล้วจึงทำ • เล่าเรื่อง Data Storytelling
            </span>
          </h1>

          <p class="text-slate-200 text-sm sm:text-base leading-relaxed max-w-4xl">
            เริ่มจาก <strong>ตั้งคำถามและกำหนดเป้าหมายให้ชัด</strong> ว่าจะทำชุดข้อมูลนี้ไปทำไมและเอาไปใช้อะไร
            จากนั้นเลือก Dataset บน <strong>Kaggle</strong> แล้ว <strong>ทำสไลด์สั้นๆ ขึ้นนำเสนอหน้าห้องพร้อมเปิดไฟล์ข้อมูลจริงให้ดู</strong>
            ว่ามีข้อมูลอะไรบ้างและมีจุดเสียที่ต้องคลีนหรือไม่ หากครูอนุมัติผ่านแล้วจึงทำวิเคราะห์ต่อในชีต
            <code>02_Analysis_Data</code>
            พร้อมซักซ้อมทั้งทีมเพราะวันนำเสนอสรุปผลจะสุ่มสมาชิกเพียง 1 คนขึ้นพูดแทนกลุ่ม
          </p>

          <div class="pt-1 flex flex-wrap items-center gap-3">
            <a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition-colors shadow-md">
              <Search class="w-4 h-4" />
              <span>เปิดเว็บ Kaggle Datasets</span>
              <ExternalLink class="w-4 h-4" />
            </a>
            <button type="button" @click="scrollToSection('step-5')"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition-colors cursor-pointer">
              <Link class="w-4 h-4 text-amber-300" />
              <span>ข้ามไปดูรายการส่ง 3 ลิงก์</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 5-Step Interactive Roadmap Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <button v-for="step in roadmapSteps" :key="step.id" type="button" @click="scrollToSection(step.id)"
          class="p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 shadow-xs"
          :class="activeRoadmapStep === step.id
            ? 'bg-sky-700 text-white border-sky-600 shadow-md'
            : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50'
            ">
          <span class="w-10 h-10 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0"
            :class="activeRoadmapStep === step.id
              ? 'bg-white/20 text-white'
              : 'bg-sky-100 text-sky-800'
              ">
            {{ step.num }}
          </span>
          <div class="min-w-0">
            <div class="font-black text-sm truncate">{{ step.title }}</div>
            <div class="text-xs truncate" :class="activeRoadmapStep === step.id ? 'text-sky-100' : 'text-slate-500'">
              {{ step.desc }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- VERTICAL 5-MILESTONE ROADMAP TRACK                                  -->
    <!-- =================================================================== -->
    <div class="relative space-y-8">
      <!-- Vertical Roadmap Connector Rail (Desktop) -->
      <div
        class="hidden lg:block absolute left-6 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-sky-300 via-cyan-300 to-indigo-300">
      </div>

      <!-- ================================================================= -->
      <!-- MILESTONE 01: GOAL FRAMING, KAGGLE SELECTION & TEACHER APPROVAL   -->
      <!-- ================================================================= -->
      <section id="step-1" class="relative scroll-mt-6">
        <div
          class="hidden lg:flex absolute left-0 top-6 w-13 h-13 rounded-2xl bg-sky-600 text-white font-mono font-black text-lg items-center justify-center shadow-md border-4 border-white z-10">
          01
        </div>

        <div class="lg:ml-16 rounded-3xl bg-white border-2 border-sky-200 shadow-xs overflow-hidden">
          <div class="px-6 py-4 bg-sky-50/80 border-b border-sky-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="lg:hidden px-2.5 py-1 rounded-xl bg-sky-600 text-white font-mono font-black text-xs">STEP
                01</span>
              <div>
                <div class="text-xs font-black text-sky-700 uppercase tracking-wider">ขั้นที่ 1 จาก 5 •
                  ด่านแรกบังคับก่อนลงมือทำ</div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900">ตั้งเป้าหมาย ทำสไลด์เสนอหัวข้อ &amp; เปิดข้อมูลจริงหน้าห้องให้ครูอนุมัติ</h2>
              </div>
            </div>
            <span
              class="px-3.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
              ผลลัพธ์ขั้นนี้: พรีเซนต์หน้าห้อง + เปิดไฟล์ดูจุดเสียผ่านอนุมัติแล้ว
            </span>
          </div>

          <div class="p-6 sm:p-7 space-y-6">
            <!-- Part A: 4 Framing Questions Before Selecting/Analyzing -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
                <Target class="w-5 h-5 text-sky-600" />
                <span>1.1 ตอบให้ชัดก่อนเลือกไฟล์: ทำชุดข้อมูลนี้ทำไม เอาไปใช้อะไร และเป้าหมายคืออะไร?</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                <div v-for="fq in framingQuestions" :key="fq.code"
                  class="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2 flex flex-col">
                  <span
                    class="self-start px-2.5 py-0.5 rounded-lg bg-sky-700 text-white font-mono text-[11px] font-bold">
                    {{ fq.code }}
                  </span>
                  <h3 class="text-sm font-black text-slate-900">{{ fq.title }}</h3>
                  <p class="text-xs text-slate-700 leading-relaxed flex-1">{{ fq.desc }}</p>
                  <div class="text-[11px] text-sky-900 bg-white border border-sky-100 rounded-xl p-2.5 leading-relaxed">
                    <strong>ตัวอย่าง:</strong> {{ fq.example }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Part B: 4 Mandatory Kaggle Criteria -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
                  <Database class="w-5 h-5 text-blue-600" />
                  <span>1.2 เกณฑ์คัดเลือก Dataset บน Kaggle ให้สอดคล้องกับเป้าหมาย</span>
                </div>
                <a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:text-blue-900">
                  <span>เปิด Kaggle.com/datasets</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </a>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                <div v-for="rule in kaggleRules" :key="rule.num"
                  class="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 font-mono text-xs font-black">เกณฑ์ {{
                      rule.num }}</span>
                    <span class="text-xs sm:text-sm font-black text-cyan-200">{{ rule.title }}</span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">{{ rule.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Part C: Teacher Approval Gate Banner -->
            <div class="rounded-2xl p-5 sm:p-6 bg-amber-50 border-2 border-amber-400 space-y-4">
              <div class="flex items-start gap-3">
                <ShieldCheck class="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <h3 class="text-base sm:text-lg font-black text-amber-950">
                    1.3 ด่านนำเสนอหน้าห้องเพื่อขออนุมัติ: ทำสไลด์เสนอเรื่อง + เปิดไฟล์ข้อมูลจริงให้ดูสด (ผ่านแล้วจึงทำต่อได้!)
                  </h3>
                  <p class="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    เมื่อรวมกลุ่มและเลือก Dataset จาก Kaggle แล้ว ให้ทำ <strong>สไลด์สั้นๆ ขึ้นนำเสนอหน้าห้อง</strong> คู่กับการ
                    <strong>เปิดไฟล์ข้อมูลจริงบนหน้าจอ</strong> ให้ครูและเพื่อนดูว่ามีข้อมูลอะไรบ้างและมีจุดเสียที่ต้องคลีนหรือไม่
                    <strong>หากผ่านการอนุมัติจากครูแล้ว จึงจะเริ่มลงมือทำขั้นที่ 2–5 ต่อได้</strong>
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-2.5">
                  <div class="font-black text-sky-900 flex items-center gap-2 text-sm">
                    <FileText class="w-4 h-4 text-sky-600 shrink-0" />
                    <span>ส่วนที่ A: สไลด์นำเสนอหัวข้อหน้าห้อง (Proposal Slides)</span>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(item, idx) in proposalSlideTopics"
                      :key="idx"
                      class="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 text-slate-800 font-medium leading-relaxed"
                    >
                      {{ item }}
                    </div>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-white border border-amber-200 space-y-2.5">
                  <div class="font-black text-emerald-900 flex items-center gap-2 text-sm">
                    <FileSpreadsheet class="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ส่วนที่ B: เปิดไฟล์ข้อมูลจริงให้ดูบนหน้าจอ (Live Dataset Check)</span>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(item, idx) in liveDataInspectItems"
                      :key="idx"
                      class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-slate-800 font-medium leading-relaxed"
                    >
                      {{ item }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Part D: 6 Suggested Topics -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
                <Sparkles class="w-4 h-4 text-amber-500" />
                <span>แนวทางหัวข้อจาก Kaggle ที่ตั้งเป้าหมายและเล่าเรื่องได้ดี (ใช้เป็นไอเดียได้)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                <div v-for="item in suggestedKaggleTopics" :key="item.topic"
                  class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div class="font-black text-sm text-sky-900">{{ item.topic }}</div>
                  <div class="text-xs text-slate-600">
                    <strong>คอลัมน์เด่น:</strong> {{ item.cols }}
                  </div>
                  <div class="text-xs text-teal-900 bg-teal-50 border border-teal-200 rounded-xl p-2.5">
                    <strong>ตัวอย่างประเด็นเล่าเรื่อง:</strong> {{ item.storyHook }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MILESTONE 02: TEAM GROUPING (11 STUDENTS -> 4 / 4 / 3) & ROLES    -->
      <!-- ================================================================= -->
      <section id="step-2" class="relative scroll-mt-6">
        <div
          class="hidden lg:flex absolute left-0 top-6 w-13 h-13 rounded-2xl bg-blue-600 text-white font-mono font-black text-lg items-center justify-center shadow-md border-4 border-white z-10">
          02
        </div>

        <div class="lg:ml-16 rounded-3xl bg-white border-2 border-blue-200 shadow-xs overflow-hidden">
          <div
            class="px-6 py-4 bg-blue-50/80 border-b border-blue-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="lg:hidden px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs">STEP
                02</span>
              <div>
                <div class="text-xs font-black text-blue-700 uppercase tracking-wider">ขั้นที่ 2 จาก 5 •
                  หลังครูอนุมัติแล้ว: แบ่งหน้าที่ลงมือทำ</div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900">จัดกลุ่ม (ห้อง 11 คน แบ่ง 3 กลุ่ม: 4 / 4 / 3)
                  &amp; กระจายหน้าที่ทุกคน</h2>
              </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-800 text-xs font-black">
              ผลลัพธ์ขั้นนี้: แบ่งหน้าที่ครบ + ทุกคนเข้าใจงานร่วมกัน
            </span>
          </div>

          <div class="p-6 sm:p-7 space-y-5">
            <div
              class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>การจัดกลุ่มห้อง 11 คน:</strong> แบ่งเป็น <strong>3 กลุ่ม</strong> (<strong>กลุ่มละ 4 คน 2
                  กลุ่ม</strong> และ <strong>3 คน 1 กลุ่ม</strong>)
                สำหรับกลุ่มที่มี 3 คน ให้สมาชิก 1 คนควบตำแหน่ง Role 01+02 หรือ 02+03
              </p>
              <div class="shrink-0 flex items-center gap-2 text-xs font-mono font-bold">
                <span class="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">กลุ่ม 1: 4 คน</span>
                <span class="px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-800 border border-cyan-200">กลุ่ม 2: 4
                  คน</span>
                <span class="px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200">กลุ่ม 3: 3
                  คน</span>
              </div>
            </div>

            <!-- Important Team Sync Warning -->
            <div
              class="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3 text-xs sm:text-sm text-rose-950">
              <AlertTriangle class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>กติกาวันนำเสนอ (สุ่ม 1 คนพูดแทนทั้งทีม):</strong> แม้จะแบ่งหน้าที่ทำคนละส่วน
                แต่ตอนนำเสนออาจารย์จะ
                <strong>สุ่มสมาชิกในกลุ่มเพียง 1 คน</strong> ขึ้นมานำเสนอสไลด์และอธิบายชีตวิเคราะห์แทนทั้งกลุ่ม
                ดังนั้นทุกคนในกลุ่มต้องสอนกันและเข้าใจงานทุกส่วนร่วมกัน 100%
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div v-for="role in teamRoles" :key="role.roleNo" class="p-4 sm:p-5 rounded-2xl border space-y-3"
                :class="role.borderClass">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold mb-1.5"
                    :class="role.badgeClass">
                    ROLE {{ role.roleNo }}
                  </span>
                  <h3 class="text-sm sm:text-base font-black text-slate-900">{{ role.title }}</h3>
                  <p class="text-xs text-slate-600">{{ role.ownerHint }}</p>
                </div>
                <ul class="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc pl-4">
                  <li v-for="(duty, idx) in role.duties" :key="idx">{{ duty }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MILESTONE 03: GOOGLE SHEETS (2 SHEETS ONLY) & 5 TASKS TO DO       -->
      <!-- ================================================================= -->
      <section id="step-3" class="relative scroll-mt-6">
        <div
          class="hidden lg:flex absolute left-0 top-6 w-13 h-13 rounded-2xl bg-cyan-600 text-white font-mono font-black text-lg items-center justify-center shadow-md border-4 border-white z-10">
          03
        </div>

        <div class="lg:ml-16 rounded-3xl bg-white border-2 border-cyan-200 shadow-xs overflow-hidden">
          <div
            class="px-6 py-4 bg-cyan-50/80 border-b border-cyan-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="lg:hidden px-2.5 py-1 rounded-xl bg-cyan-600 text-white font-mono font-black text-xs">STEP
                03</span>
              <div>
                <div class="text-xs font-black text-cyan-700 uppercase tracking-wider">ขั้นที่ 3 จาก 5 • สิ่งที่ต้องทำใน
                  Google Sheets</div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900">วิเคราะห์และหาสถิติใน 2 ชีต เพื่อตอบคำถามที่กลุ่มตั้งไว้</h2>
              </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-xl bg-white border border-cyan-300 text-cyan-800 text-xs font-black">
              ผลลัพธ์ขั้นนี้: ได้สถิติและคำตอบแบบผูกสูตรครบทุกคำถาม
            </span>
          </div>

          <div class="p-6 sm:p-7 space-y-6">
            <!-- 2-Sheet Architecture + Single Sheet Workspace Diagram -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div class="xl:col-span-5 grid grid-cols-1 gap-4">
                <div class="rounded-2xl p-5 bg-slate-50 border-2 border-slate-300 space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 font-mono font-black text-sm sm:text-base text-slate-900">
                      <Database class="w-4 h-4 text-slate-700" />
                      <span>ชีต 1: 01_Master_Data</span>
                    </div>
                    <span
                      class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-black">
                      ห้ามแตะ / ห้ามแก้ไข
                    </span>
                  </div>
                  <p class="text-xs text-slate-700 leading-relaxed">
                    วางข้อมูลต้นฉบับจาก Kaggle ทิ้งไว้เท่านั้น ห้ามลบแถว ห้ามแก้ตัวเลข และห้ามเขียนสูตรในชีตนี้
                  </p>
                </div>

                <div class="rounded-2xl p-5 bg-sky-50/80 border-2 border-sky-300 space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 font-mono font-black text-sm sm:text-base text-sky-950">
                      <FileSpreadsheet class="w-4 h-4 text-sky-700" />
                      <span>ชีต 2: 02_Analysis_Data</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black">
                      ทำทั้งหมดในชีตนี้
                    </span>
                  </div>
                  <p class="text-xs text-sky-950 leading-relaxed">
                    คัดลอกข้อมูลจาก <code>01_Master_Data</code> มาวางฝั่งซ้าย (หากพบส่วนที่เสียตอนเปิดข้อมูลในขั้นที่ 01 ให้คลีนให้เรียบร้อยในชีตนี้โดยห้ามแตะต้นฉบับ)
                    แล้ววิเคราะห์หาสถิติตอบคำถามทุกข้อฝั่งขวาบนชีตเดียวกัน
                    <strong>ห้ามดึงสูตรข้ามชีตเด็ดขาด</strong>
                  </p>
                </div>
              </div>

              <!-- Workspace Layout Diagram -->
              <div
                class="xl:col-span-7 rounded-2xl p-5 sm:p-6 bg-slate-950 border border-slate-800 text-white flex flex-col justify-between space-y-4">
                <div class="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  ผังการจัดพื้นที่ภายในชีต 02_Analysis_Data (ซ้าย -&gt; ขวา ในชีตเดียว)
                </div>
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-stretch flex-1">
                  <div class="md:col-span-5 p-4 rounded-2xl bg-sky-500/15 border border-sky-400/40 space-y-1.5">
                    <div class="font-mono font-black text-sky-300">ฝั่งซ้าย: ข้อมูลที่คลีนพร้อมใช้</div>
                    <p class="text-slate-300 leading-relaxed">
                      วางข้อมูลจาก Kaggle ที่คลีนจุดเสียเรียบร้อยแล้ว (เพิ่มคอลัมน์คำนวณเสริมได้ตามความเหมาะสมของโจทย์)
                    </p>
                  </div>
                  <div class="md:col-span-1 flex items-center justify-center text-slate-400 font-mono text-[11px]">
                    <ArrowRight class="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                  <div class="md:col-span-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 space-y-1.5">
                    <div class="font-mono font-black text-emerald-300">ฝั่งขวา: โซนหาสถิติและคำตอบด้วยสูตร</div>
                    <p class="text-slate-200 leading-relaxed">
                      สร้างตารางสรุปสถิติและตารางเปรียบเทียบในรูปแบบที่กลุ่มออกแบบเอง เพื่อตอบคำถามทุกข้อจากขั้นที่ 01 โดยต้องผูกสูตร 100% บนชีตนี้
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3 Open Analysis Principles (NO rigid 5-part formula checklist) -->
            <div class="space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 class="text-base sm:text-lg font-black text-slate-900">
                    กรอบการวิเคราะห์ในชีต 02_Analysis_Data (เลือกออกแบบตารางและสูตรเองเพื่อตอบคำถาม)
                  </h3>
                  <p class="text-xs text-slate-600">
                    ไม่จำกัดรูปแบบตารางตายตัว แต่ต้องสะท้อนการคิดวิเคราะห์จริงด้วยสูตรที่เรียนมา (ไม่ใช่แค่หาผลรวมหรือค่าเฉลี่ยธรรมดา)
                  </p>
                </div>
                <span class="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
                  วันนำเสนอ อาจารย์สุ่มคลิกตรวจสูตรในชีตจริง
                </span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div v-for="item in analysisPrinciples" :key="item.no"
                  class="p-5 rounded-2xl border space-y-3 flex flex-col" :class="item.borderClass">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold" :class="item.badgeClass">
                      หลักการ {{ item.no }}
                    </span>
                    <span class="text-[11px] font-mono font-bold text-slate-500">{{ item.badge }}</span>
                  </div>
                  <h4 class="text-sm sm:text-base font-black text-slate-900">{{ item.title }}</h4>
                  <ul class="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc pl-4 flex-1">
                    <li v-for="(b, idx) in item.bullets" :key="idx">{{ b }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MILESTONE 04: DATA STORYTELLING SLIDES & RANDOM 1 PRESENTER       -->
      <!-- ================================================================= -->
      <section id="step-4" class="relative scroll-mt-6">
        <div
          class="hidden lg:flex absolute left-0 top-6 w-13 h-13 rounded-2xl bg-teal-600 text-white font-mono font-black text-lg items-center justify-center shadow-md border-4 border-white z-10">
          04
        </div>

        <div class="lg:ml-16 rounded-3xl bg-white border-2 border-teal-200 shadow-xs overflow-hidden">
          <div
            class="px-6 py-4 bg-teal-50/80 border-b border-teal-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="lg:hidden px-2.5 py-1 rounded-xl bg-teal-600 text-white font-mono font-black text-xs">STEP
                04</span>
              <div>
                <div class="text-xs font-black text-teal-700 uppercase tracking-wider">ขั้นที่ 4 จาก 5 • สไลด์เล่าเรื่อง
                  &amp; กติกาการนำเสนอ</div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900">ทำสไลด์เล่าเรื่อง 8 หน้า (สุ่มสมาชิกเพียง 1
                  คนนำเสนอแทนทั้งทีม)</h2>
              </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-800 text-xs font-black">
              ผลลัพธ์ขั้นนี้: ได้ Link สไลด์ + ทุกคนพร้อมนำเสนอแทนทีม
            </span>
          </div>

          <div class="p-6 sm:p-7 space-y-6">
            <!-- Random 1 Presenter Banner -->
            <div class="rounded-2xl p-4 sm:p-5 bg-slate-900 text-white border border-slate-800 flex items-start gap-3">
              <Users class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div class="space-y-1 text-xs sm:text-sm leading-relaxed">
                <div class="font-black text-amber-300">
                  กติกาสำคัญวันนำเสนอ: สุ่มสมาชิกในทีมขึ้นมานำเสนอเพียง 1 คนต่อกลุ่ม!
                </div>
                <p class="text-slate-200">
                  เมื่อถึงคิวนำเสนอ อาจารย์จะ <strong>สุ่มชื่อสมาชิก 1 คนในกลุ่ม</strong>
                  ให้เป็นตัวแทนเล่าเรื่องทั้งหมดตั้งแต่ต้นจนจบและเปิดไฟล์ตอบคำถามแทนเพื่อนทั้งกลุ่ม
                  หากตัวแทนที่ถูกสุ่มตอบไม่ได้ว่าส่วนอื่นของเพื่อนทำอย่างไร จะมีผลต่อคะแนนทั้งกลุ่มทันที
                </p>
              </div>
            </div>

            <!-- Bad vs Good Example -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="rounded-2xl p-5 bg-rose-50/70 border-2 border-rose-200 space-y-2.5">
                <div class="flex items-center gap-2 text-rose-800 font-black text-sm sm:text-base">
                  <XCircle class="w-5 h-5 text-rose-600 shrink-0" />
                  <span>แบบที่ห้ามทำ: เล่าแค่ตัวเลข 10, 20, 50</span>
                </div>
                <div
                  class="p-3.5 rounded-xl bg-white border border-rose-100 text-xs text-rose-950 italic leading-relaxed">
                  "กลุ่มเราเลือกข้อมูลร้านค้ามา มี 1,200 แถว หมวด A ขายได้ 450,000 หมวด B ขายได้ 180,000 หมวด C ได้
                  95,000 ค่าเฉลี่ย 604 บาท จบการนำเสนอครับ"
                </div>
                <p class="text-xs text-rose-800">
                  <strong>ปัญหา:</strong> คนฟังได้แค่เลขเรียงกัน ไม่รู้สาเหตุและไม่รู้ว่าควรตัดสินใจทำอะไรต่อ
                </p>
              </div>

              <div class="rounded-2xl p-5 bg-emerald-50/70 border-2 border-emerald-200 space-y-2.5">
                <div class="flex items-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
                  <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>แบบที่ต้องการ: เล่าเรื่องแบบ What -&gt; So What -&gt; Now What</span>
                </div>
                <div
                  class="p-3.5 rounded-xl bg-white border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                  "แม้หมวด A จะครองรายได้ 62% (What) แต่เมื่อเช็กค่าเฉลี่ยเทียบค่ากลางพบว่าโดนออเดอร์ใหญ่ไม่กี่ใบดึงค่า
                  ขณะที่หมวด B ซื้อซ้ำสม่ำเสมอและค่าเฉลี่ยต่อบิลสูงกว่ากลุ่มปกติ 2.1 เท่า (So What)
                  เราจึงเสนอให้จัดโปรจับคู่ในหมวด B เพื่อโตกำไรที่มั่นคงกว่า (Now What)"
                </div>
                <p class="text-xs text-emerald-800">
                  <strong>จุดเด่น:</strong> หยิบผลลัพธ์จากการวิเคราะห์ใน <code>02_Analysis_Data</code>
                  มาเล่าเป็นเรื่องราวที่มีเหตุผลรองรับชัดเจน
                </p>
              </div>
            </div>

            <!-- 8-Slide Order -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
                <FileText class="w-5 h-5 text-teal-600" />
                <span>ลำดับโครงสร้างสไลด์ 8 หน้า (ไล่เรียงตามนี้จากซ้ายไปขวา)</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                <div v-for="slide in slideOutline" :key="slide.slideNo"
                  class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col">
                  <span
                    class="self-start px-2.5 py-0.5 rounded-lg bg-teal-600 text-white font-mono text-[11px] font-bold">
                    {{ slide.slideNo }}
                  </span>
                  <h3 class="text-sm font-black text-slate-900 leading-snug">{{ slide.title }}</h3>
                  <p class="text-xs text-slate-600 leading-relaxed flex-1">{{ slide.detail }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MILESTONE 05: RUBRIC, 3 LINKS, CHECKLIST & SUBMISSION             -->
      <!-- ================================================================= -->
      <section id="step-5" class="relative scroll-mt-6">
        <div
          class="hidden lg:flex absolute left-0 top-6 w-13 h-13 rounded-2xl bg-indigo-600 text-white font-mono font-black text-lg items-center justify-center shadow-md border-4 border-white z-10">
          05
        </div>

        <div class="lg:ml-16 rounded-3xl bg-white border-2 border-indigo-200 shadow-xs overflow-hidden">
          <div
            class="px-6 py-4 bg-indigo-50/80 border-b border-indigo-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="lg:hidden px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs">STEP
                05</span>
              <div>
                <div class="text-xs font-black text-indigo-700 uppercase tracking-wider">ขั้นที่ 5 จาก 5 •
                  ตรวจสอบและส่งงาน</div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900">เช็กเกณฑ์คะแนน 10 คะแนน &amp;
                  แนบส่งงานกลุ่มครบ 3 ลิงก์</h2>
              </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-xl bg-white border border-indigo-300 text-indigo-800 text-xs font-black">
              ผลลัพธ์ขั้นนี้: ส่งครบ 3 ลิงก์ (เปิดสิทธิ์ Viewer แล้ว)
            </span>
          </div>

          <div class="p-6 sm:p-7 space-y-6">
            <!-- Rubric (4 columns horizontal) -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div v-for="r in rubricItems" :key="r.title" class="p-4 sm:p-5 rounded-2xl border space-y-2"
                :class="r.colorClass">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="text-sm font-black text-slate-900 leading-snug">{{ r.title }}</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black shrink-0" :class="r.badgeClass">
                    {{ r.score }}
                  </span>
                </div>
                <p class="text-xs text-slate-700 leading-relaxed">{{ r.desc }}</p>
              </div>
            </div>

            <!-- Mandatory 3-Link Reminder -->
            <div class="rounded-2xl p-5 bg-amber-50 border-2 border-amber-300 space-y-4">
              <div class="flex items-start gap-3">
                <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <h3 class="text-sm sm:text-base font-black text-amber-950">
                    กด "+ เพิ่มลิงก์" ส่งให้ครบทั้ง 3 ลิงก์ และเปิดสิทธิ์ทุกคนที่มีลิงก์ดูได้ (Viewer)
                  </h3>
                  <p class="text-xs text-amber-900">
                    เลือกสมาชิกกลุ่มให้ครบในกล่องส่งงานด้านล่าง แล้วแนบลิงก์ให้ครบ 3 รายการต่อไปนี้
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div class="font-black text-emerald-700 flex items-center gap-1.5">
                    <FileSpreadsheet class="w-4 h-4 shrink-0" />
                    <span>1. Link Google Sheets</span>
                  </div>
                  <p class="text-slate-600">มีครบ <code>01_Master_Data</code> และ <code>02_Analysis_Data</code></p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div class="font-black text-sky-700 flex items-center gap-1.5">
                    <Database class="w-4 h-4 shrink-0" />
                    <span>2. Link ชุดข้อมูล Kaggle</span>
                  </div>
                  <p class="text-slate-600">ลิงก์หน้า Dataset ต้นทางบน <code>kaggle.com</code></p>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div class="font-black text-indigo-700 flex items-center gap-1.5">
                    <Layers class="w-4 h-4 shrink-0" />
                    <span>3. Link สไลด์นำเสนอ</span>
                  </div>
                  <p class="text-slate-600">Canva หรือ Google Slides (8 หน้า + หน้าที่สมาชิก)</p>
                </div>
              </div>
            </div>

            <!-- Interactive Checklist -->
            <div class="rounded-2xl p-5 bg-slate-50 border border-slate-200 space-y-3.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
                  <ClipboardList class="w-5 h-5 text-sky-600" />
                  <span>เช็กลิสต์ตรวจสอบงานกลุ่มก่อนกดส่ง (6 ข้อ)</span>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-mono font-bold"
                  :class="checkedCount === checklistItems.length ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'">
                  พร้อมแล้ว {{ checkedCount }} / {{ checklistItems.length }} ข้อ
                </span>
              </div>

              <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                  :style="{ width: `${(checkedCount / checklistItems.length) * 100}%` }"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                <label v-for="item in checklistItems" :key="item.id"
                  class="p-3 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors text-xs leading-relaxed"
                  :class="item.checked
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                    ">
                  <input type="checkbox" v-model="item.checked"
                    class="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer" />
                  <span>{{ item.label }}</span>
                </label>
              </div>
            </div>

            <!-- Submission Box -->
            <AssignmentSection :course-id="currentCourseId" assignment-id="asm-5"
              assignment-title="Mini-Project (งานกลุ่ม): วิเคราะห์ชุดข้อมูลจริงจาก Kaggle และสไลด์เล่าเรื่อง Data Storytelling"
              :max-score="10" work-type="group" :min-members="3" :max-members="4">
              <template #number>5</template>
              <template #description>
                <p class="leading-relaxed">
                  งานกลุ่ม <strong>3–4 คน (ห้อง 11 คน แบ่ง 3 กลุ่ม: 4 / 4 / 3 คน)</strong>
                  เริ่มจากตั้งคำถาม-เป้าหมาย ทำสไลด์เสนอหัวข้อพร้อมเปิดไฟล์ <strong>Kaggle Dataset</strong> ให้ครูอนุมัติหน้าห้องก่อนทำ
                  จากนั้นคลีนจุดเสีย (ถ้ามี) และวิเคราะห์ทั้งหมดด้วยสูตรภายในชีต <code>02_Analysis_Data</code> (ไม่ดึงข้ามชีตจาก
                  <code>01_Master_Data</code>)
                  จัดทำสไลด์เล่าเรื่อง 8 หน้า (<strong>วันนำเสนอสุ่มสมาชิกเพียง 1 คนพูดแทนทั้งกลุ่ม</strong>)
                  และให้ตัวแทนกลุ่มเลือกชื่อสมาชิกให้ครบแล้วกดส่งลิงก์ทั้งหมดด้านล่าง
                </p>
              </template>

              <template #tasks>
                <div
                  class="rounded-2xl bg-sky-50 border border-sky-200 p-4 space-y-2.5 text-xs sm:text-sm text-sky-950">
                  <div class="font-black flex items-center gap-2 text-sky-900">
                    <Link class="w-4 h-4 text-sky-700 shrink-0" />
                    <span>สิ่งที่ต้องส่งในระบบ (กด "+ เพิ่มลิงก์" ให้ครบทั้ง 3 ลิงก์
                      และเปิดสิทธิ์ทุกคนที่มีลิงก์ดูได้)</span>
                  </div>
                  <ol class="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
                    <li>
                      <strong>Link Google Sheets:</strong> มีครบ 2 ชีต (<code>01_Master_Data</code> ต้นฉบับห้ามแก้ไข และ
                      <code>02_Analysis_Data</code> ที่คลีนข้อมูลและหาสถิติตอบคำถามด้วยสูตรครบทั้งหมดในชีตเดียว ไม่ดึงข้ามชีต)
                    </li>
                    <li>
                      <strong>Link ชุดข้อมูลต้นทางบน Kaggle:</strong> URL หน้า Dataset จาก <code>kaggle.com</code>
                      ที่ผ่านการอนุมัติจากครูแล้ว (ขนาด 500–5,000 แถว และห้ามซ้ำกับกลุ่มอื่น)
                    </li>
                    <li>
                      <strong>Link สไลด์นำเสนอ (Canva / Google Slides):</strong> ครบ 8 หน้า เล่าเป็นเรื่องราวแบบ
                      <code>What -&gt; So What -&gt; Now What</code> พร้อมหน้าสรุปหน้าที่ความรับผิดชอบของสมาชิกทุกคน
                    </li>
                  </ol>
                </div>
              </template>
            </AssignmentSection>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
