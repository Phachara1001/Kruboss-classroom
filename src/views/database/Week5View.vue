<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Database, Table, Code, PlusCircle, Search, Filter, ArrowUpDown,
  Edit3, Trash2, ShieldAlert, CheckCircle2, XCircle, FileText, Upload,
  AlertTriangle, Copy, Check, Terminal, BookOpen, Target, Award,
  Book, Lightbulb, Gamepad2, ListOrdered, FileQuestion,
  Clock, ArrowRight, Layers, Eye, RefreshCw, Key,
  Sparkles, CheckSquare, HelpCircle, AlertOctagon, ExternalLink,
  Play, Info, AlertCircle, Laptop, Zap, GitFork,
  Link, Unlink, Network, GitCommit, Split, Trophy, ChevronRight,
  ShieldCheck, ArrowDown, FolderTree, ShoppingCart, UserCheck, PackageCheck
} from '@lucide/vue'

import GameCenterSection from '@/components/games/GameCenterSection.vue'
import TeacherScoreboardModal from '@/components/games/TeacherScoreboardModal.vue'
import CheckInSystem from '@/components/CheckInSystem.vue'
import AssignmentSection from '@/components/AssignmentSection.vue'

import { authUser } from '@/data/authStore'
import { isStudent, isTeacherUser } from '@/data/studentsStore'
import { gameScoresStore, fetchGameScores, calculateNormalizedScore } from '@/data/gameScoresStore'

// Course & Week Context
const currentCourseId = '31901-2007'
const currentWeek = 5

const route = useRoute()
const router = useRouter()
const showTeacherModal = ref(false)

// Copy snippet feedback state
const copiedSnippet = ref('')
const copyText = (text, key) => {
  navigator.clipboard.writeText(text)
  copiedSnippet.value = key
  setTimeout(() => {
    copiedSnippet.value = ''
  }, 2000)
}

// Active Lab / Step Guide Tab in Section 3
const activeLabTab = ref('table1') // 'table1' | 'table2' | 'table3' | 'table4' | 'table5'

// Active Interactive Sandbox Mode in Section 5
const activeSandboxTab = ref('join_products') // 'join_products' | 'join_orders' | 'group_sales' | 'fk_test'

// Active SQL JOIN Type in Section 4 (Theory & Venn Diagram)
const activeJoinType = ref('inner') // 'inner' | 'left' | 'right' | 'full' | 'cross'

// Week Games Config
const weekGames = [
  { id: 'game-1', name: 'มินิเกม 1 (จัดลำดับการสร้างตารางและคำสั่งเชื่อมความสัมพันธ์)', maxScore: 6, isQuiz: false },
  { id: 'game-2', name: 'มินิเกม 2 (จับคู่คำสั่ง SQL Foreign Key & JOIN บน Supabase)', maxScore: 5, isQuiz: false },
  { id: 'quiz', name: 'แบบทดสอบหลังเรียนสัปดาห์ที่ 5 (Post-test 10 ข้อ)', maxScore: 10, isQuiz: true }
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

// ============================================================================
// DATA FOR INTERACTIVE RELATIONAL SANDBOX & JOIN SIMULATOR (SECTION 4)
// ============================================================================
const mockCategories = [
  { id: 1, category_code: 'CAT-CPU', category_name: 'หน่วยประมวลผล (Processors)', description: 'ซีพียูสำหรับเดสก์ท็อปและเซิร์ฟเวอร์' },
  { id: 2, category_code: 'CAT-GPU', category_name: 'การ์ดจอแสดงผล (Graphics Cards)', description: 'การ์ดจอสำหรับงานกราฟิกและเล่นเกม' },
  { id: 3, category_code: 'CAT-SSD', category_name: 'อุปกรณ์จัดเก็บข้อมูล (Solid State Drives)', description: 'NVMe M.2 และ SATA ความเร็วสูง' }
]

const mockProducts = [
  { id: 101, sku: 'CPU-I5', product_name: 'Intel Core i5-14500', price: 8900, stock: 15, category_id: 1 },
  { id: 102, sku: 'GPU-4060', product_name: 'NVIDIA RTX 4060 8GB', price: 11500, stock: 8, category_id: 2 },
  { id: 103, sku: 'SSD-1TB', product_name: 'WD Black SN850X 1TB NVMe', price: 3290, stock: 25, category_id: 3 },
  { id: 104, sku: 'CPU-R5', product_name: 'AMD Ryzen 5 7600X', price: 7800, stock: 12, category_id: 1 },
  { id: 105, sku: 'GPU-4070S', product_name: 'NVIDIA RTX 4070 Super 12GB', price: 23900, stock: 5, category_id: 2 }
]

const mockOrders = [
  { id: 1, order_no: 'ORD-2026-001', customer_name: 'กิตติภพ สายประกอบคอม', product_id: 101, quantity: 1, order_date: '2026-11-16 10:30', status: 'PAID' },
  { id: 2, order_no: 'ORD-2026-002', customer_name: 'พิมพ์ชนก เกมเมอร์โปร', product_id: 102, quantity: 1, order_date: '2026-11-16 11:15', status: 'PAID' },
  { id: 3, order_no: 'ORD-2026-003', customer_name: 'กิตติภพ สายประกอบคอม', product_id: 103, quantity: 2, order_date: '2026-11-16 13:40', status: 'PAID' },
  { id: 4, order_no: 'ORD-2026-004', customer_name: 'ธนวัฒน์ นักพัฒนาเว็บ', product_id: 104, quantity: 1, order_date: '2026-11-16 14:20', status: 'PAID' },
  { id: 5, order_no: 'ORD-2026-005', customer_name: 'ธนวัฒน์ นักพัฒนาเว็บ', product_id: 103, quantity: 1, order_date: '2026-11-16 15:00', status: 'PAID' }
]

const mock3TableOrdersJoin = computed(() => {
  return mockOrders.map(o => {
    const prod = mockProducts.find(p => p.id === o.product_id) || {}
    const cat = mockCategories.find(c => c.id === prod.category_id) || {}
    return {
      id: o.id,
      order_no: o.order_no,
      customer_name: o.customer_name,
      product_name: prod.product_name || 'N/A',
      price: prod.price || 0,
      category_name: cat.category_name || 'N/A',
      quantity: o.quantity,
      subtotal: (prod.price || 0) * o.quantity,
      order_date: o.order_date,
      status: o.status
    }
  })
})

const mockUnsoldProducts = computed(() => {
  return mockProducts.filter(p => !mockOrders.some(o => o.product_id === p.id)).map(p => {
    const cat = mockCategories.find(c => c.id === p.category_id) || {}
    return {
      ...p,
      category_name: cat.category_name || 'N/A'
    }
  })
})

const mockSalesSummary = [
  { category_name: 'หน่วยประมวลผล (Processors)', total_units: 2, total_revenue: 16700 },
  { category_name: 'การ์ดจอแสดงผล (Graphics Cards)', total_units: 1, total_revenue: 11500 },
  { category_name: 'อุปกรณ์จัดเก็บข้อมูล (Solid State Drives)', total_units: 3, total_revenue: 9870 }
]

const fkTestResult = ref({
  status: 'idle',
  title: 'เลือกปุ่มจำลองสถานการณ์ด้านบนเพื่อดูการทำงานของกลไก Referential Integrity',
  sql: '-- รอคำสั่งทดสอบ...',
  detail: 'PostgreSQL บน Supabase จะตรวจสอบความถูกต้องของ Foreign Key ทุกครั้งที่มีการ INSERT, UPDATE หรือ DELETE อย่างเข้มงวด'
})

const triggerFkTest = (scenario) => {
  if (scenario === 'invalid_insert') {
    fkTestResult.value = {
      status: 'error',
      title: 'ERROR 23503: foreign_key_violation (บล็อกการเพิ่มสินค้าที่มี category_id ไม่มีอยู่จริง)',
      sql: `INSERT INTO products (sku, product_name, price, stock, category_id) VALUES ('RAM-DDR5', 'Corsair 32GB', 4500, 10, 999);`,
      detail: 'ในตาราง categories มีเฉพาะ id = 1, 2, 3 เท่านั้น การใส่ category_id = 999 จะทำให้ PostgreSQL ปฏิเสธคำสั่งทันทีเพื่อป้องกันข้อมูลลูกกำพร้า (Orphan Record) ที่หาหมวดหมู่ไม่พบ'
    }
  } else if (scenario === 'restrict_delete') {
    fkTestResult.value = {
      status: 'error',
      title: 'ERROR 23503: update or delete on table "categories" violates foreign key constraint (ON DELETE RESTRICT)',
      sql: `DELETE FROM categories WHERE id = 1;`,
      detail: 'เนื่องจากตาราง products กำหนด Foreign Key ไว้เป็น ON DELETE RESTRICT และยังมีสินค้า CPU Core i5 และ Ryzen 5 อ้างอิงถึง id = 1 อยู่ ระบบจึงบล็อกการลบทันทีเพื่อป้องกันสินค้าเสียความสัมพันธ์'
    }
  } else if (scenario === 'order_fk_violation') {
    fkTestResult.value = {
      status: 'error',
      title: 'ERROR 23503: foreign_key_violation (บล็อกการสั่งซื้อสินค้าที่ไม่มีอยู่จริง)',
      sql: `INSERT INTO orders (order_no, customer_name, product_id, quantity) VALUES ('ORD-999', 'สมชาย ใจดี', 888, 1);`,
      detail: 'ในตาราง products ไม่มีสินค้า id = 888 ระบบฐานข้อมูลจึงบล็อกการสร้างคำสั่งซื้อทันทีเพื่อป้องกันบิลขายสินค้าที่ไม่มีอยู่ในคลัง'
    }
  }
}

// ============================================================================
// SQL SCRIPTS FOR HANDS-ON WORKSHOP (SECTION 5)
// ============================================================================
const sqlStep1CreateTables = `-- ============================================================================
-- สัปดาห์ที่ 5: ปฏิบัติการสร้างฐานข้อมูลเชิงสัมพันธ์ 3 ตารางใน Supabase
-- ลำดับการสร้าง: 1. categories (ตารางแม่) -> 2. products (ตารางลูก 1) -> 3. orders (ตารางลูก 2)
-- ============================================================================

-- 1. ตารางแม่: หมวดหมู่สินค้า (categories)
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category_code VARCHAR(20) NOT NULL UNIQUE,
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางลูกที่ 1: สินค้า (products)
-- มี Foreign Key ชี้ไปหา categories(id) แบบ ON DELETE RESTRICT
CREATE TABLE IF NOT EXISTS products (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  sku VARCHAR(30) NOT NULL UNIQUE,
  product_name VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางลูกที่ 2: คำสั่งซื้อ (orders)
-- มี Foreign Key ชี้ไปหา products(id) แบบ ON DELETE RESTRICT
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(30) DEFAULT 'PAID'
);`

const sqlStep2InsertData = `-- ============================================================================
-- สเต็ปที่ 2: เพิ่มข้อมูลทดสอบลงในทั้ง 3 ตารางตามลำดับความสัมพันธ์
-- ============================================================================

-- 1. เพิ่มหมวดหมู่สินค้า 3 รายการ
INSERT INTO categories (category_code, category_name, description) VALUES
  ('CAT-CPU', 'หน่วยประมวลผล (Processors)', 'ซีพียูสำหรับคอมพิวเตอร์ตั้งโต๊ะและเซิร์ฟเวอร์'),
  ('CAT-GPU', 'การ์ดจอแสดงผล (Graphics Cards)', 'การ์ดจอสำหรับงานกราฟิกและเล่นเกม'),
  ('CAT-SSD', 'อุปกรณ์จัดเก็บข้อมูล (SSD)', 'Solid State Drive ความเร็วสูง NVMe M.2');

-- 2. เพิ่มสินค้า 5 รายการ พร้อมระบุ category_id ที่มีอยู่จริงในตาราง categories
INSERT INTO products (sku, product_name, price, stock, category_id) VALUES
  ('CPU-I5-14500', 'Intel Core i5-14500', 8900.00, 15, 1),
  ('CPU-R5-7600X', 'AMD Ryzen 5 7600X', 7800.00, 12, 1),
  ('GPU-RTX4060', 'NVIDIA GeForce RTX 4060 8GB', 11500.00, 8, 2),
  ('GPU-RTX4070S', 'NVIDIA GeForce RTX 4070 Super 12GB', 23900.00, 5, 2),
  ('SSD-SN850X-1TB', 'WD Black SN850X 1TB NVMe', 3290.00, 25, 3);

-- 3. เพิ่มคำสั่งซื้อ 5 รายการ อ้างอิง product_id ของสินค้าที่มีอยู่จริง
INSERT INTO orders (order_no, customer_name, product_id, quantity, status) VALUES
  ('ORD-2026-001', 'กิตติภพ สายประกอบคอม', 1, 1, 'PAID'),
  ('ORD-2026-002', 'พิมพ์ชนก เกมเมอร์โปร', 2, 1, 'PAID'),
  ('ORD-2026-003', 'กิตติภพ สายประกอบคอม', 3, 2, 'PAID'),
  ('ORD-2026-004', 'ธนวัฒน์ นักพัฒนาเว็บ', 4, 1, 'PAID'),
  ('ORD-2026-005', 'ธนวัฒน์ นักพัฒนาเว็บ', 3, 1, 'PAID');`

const sqlStep3JoinQueries = `-- ============================================================================
-- สเต็ปที่ 3: คำสั่ง SQL เพื่อเรียกดูข้อมูลข้ามตาราง (SQL JOIN Queries)
-- ============================================================================

-- Query 1: INNER JOIN 2 ตาราง (ดูรายการสินค้าพร้อมชื่อหมวดหมู่)
SELECT
  p.sku,
  p.product_name,
  p.price,
  p.stock,
  c.category_name,
  c.category_code
FROM products p
INNER JOIN categories c ON p.category_id = c.id
ORDER BY p.id ASC;

-- Query 2: INNER JOIN 3 ตาราง (ดูใบสั่งซื้อ พร้อมชื่อสินค้า ราคา และหมวดหมู่)
SELECT
  o.order_no,
  o.customer_name,
  p.product_name,
  c.category_name,
  p.price,
  o.quantity,
  (p.price * o.quantity) AS total_price,
  o.order_date,
  o.status
FROM orders o
INNER JOIN products p ON o.product_id = p.id
INNER JOIN categories c ON p.category_id = c.id
ORDER BY o.id ASC;

-- Query 3: LEFT JOIN หาสินค้าที่ยังไม่มีคำสั่งซื้อ (Unsold Products)
SELECT
  p.sku,
  p.product_name,
  p.price,
  c.category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN orders o ON p.id = o.product_id
WHERE o.id IS NULL;

-- Query 4: สรุปยอดขายรวมแยกตามหมวดหมู่สินค้า (JOIN + GROUP BY + SUM)
SELECT
  c.category_name,
  SUM(o.quantity) AS total_units_sold,
  SUM(p.price * o.quantity) AS total_revenue
FROM orders o
INNER JOIN products p ON o.product_id = p.id
INNER JOIN categories c ON p.category_id = c.id
GROUP BY c.id, c.category_name
ORDER BY total_revenue DESC;`

// ============================================================================
// MINI-GAMES DATA (SECTION 6)
// ============================================================================
const dragItemsData = [
  { id: 1, text: 'ตาราง categories (ไม่มี Foreign Key พึ่งพาตารางอื่น ต้องสร้างเป็นอันดับแรก)', type: 'step1_parent' },
  { id: 2, text: 'ตาราง departments (ตารางแม่ฝั่ง 1 ในระบบองค์กร)', type: 'step1_parent' },
  { id: 3, text: 'ตาราง products (มี category_id REFERENCES categories(id))', type: 'step2_child1' },
  { id: 4, text: 'ตาราง employees (มี department_id REFERENCES departments(id))', type: 'step2_child1' },
  { id: 5, text: 'ตาราง orders (มี product_id REFERENCES products(id))', type: 'step3_child2' },
  { id: 6, text: 'ตาราง project_assignments (มี employee_id REFERENCES employees(id))', type: 'step3_child2' }
]

const dragZonesData = [
  {
    id: 'step1_parent',
    title: 'ลำดับที่ 1: สร้างตารางแม่ (Parent Master Table ฝั่ง 1: categories)',
    wrapperClass: 'border-emerald-400/50 hover:bg-black/40',
    titleClass: 'text-emerald-300 border-emerald-400/30',
    itemBgClass: 'bg-emerald-600/50 border-emerald-400',
    emptyTextClass: 'text-emerald-200/50',
    emptyText: 'ลากตารางแม่ที่ไม่มี Foreign Key มาวางที่นี่'
  },
  {
    id: 'step2_child1',
    title: 'ลำดับที่ 2: สร้างตารางลูกลำดับแรก (Child Table 1: products)',
    wrapperClass: 'border-sky-400/50 hover:bg-black/40',
    titleClass: 'text-sky-300 border-sky-400/30',
    itemBgClass: 'bg-sky-600/50 border-sky-400',
    emptyTextClass: 'text-sky-200/50',
    emptyText: 'ลากตารางสินค้าที่มี Foreign Key ชี้หา categories มาวางที่นี่'
  },
  {
    id: 'step3_child2',
    title: 'ลำดับที่ 3: สร้างตารางลูกลำดับถัดไป (Child Table 2: orders)',
    wrapperClass: 'border-purple-400/50 hover:bg-black/40',
    titleClass: 'text-purple-300 border-purple-400/30',
    itemBgClass: 'bg-purple-600/50 border-purple-400',
    emptyTextClass: 'text-purple-200/50',
    emptyText: 'ลากตารางคำสั่งซื้อที่มี Foreign Key ชี้หา products มาวางที่นี่'
  }
]

const matchLeftTerms = [
  { id: 'l1', text: '1. REFERENCES categories(id)', match: 'r1' },
  { id: 'l2', text: '2. INNER JOIN categories c ON p.category_id = c.id', match: 'r2' },
  { id: 'l3', text: '3. LEFT JOIN orders o ON p.id = o.product_id', match: 'r3' },
  { id: 'l4', text: '4. ไอคอนรูปโซ่คล้อง (Foreign Key Relation) ใน Supabase Table Editor', match: 'r4' },
  { id: 'l5', text: '5. ERROR 23503: foreign_key_violation', match: 'r5' }
]

const matchRightDefs = [
  { id: 'r1', text: 'คำสั่ง SQL กำหนด Foreign Key ในตาราง products ชี้ไปยังคีย์หลักของตารางหมวดหมู่' },
  { id: 'r2', text: 'คำสั่งดึงข้อมูลสินค้าคู่หมวดหมู่โดยเลือกเฉพาะแถวที่มีรหัสหมวดหมู่ตรงกัน' },
  { id: 'r3', text: 'คำสั่งดึงสินค้าทุกรายการแม้จะยังไม่มีประวัติในตารางคำสั่งซื้อ (ใช้หา Unsold Products)' },
  { id: 'r4', text: 'ปุ่มเปิดหน้าต่าง GUI Edit relation เพื่อผูกโยงคีย์นอกแบบไม่ต้องพิมพ์คำสั่ง SQL' },
  { id: 'r5', text: 'ข้อผิดพลาดเมื่อพยายามใส่ Foreign Key ที่ไม่มีในตารางแม่ หรือลบข้อมูลแม่ที่ติด ON DELETE RESTRICT' }
]

const quizQuestions = [
  {
    id: 1,
    question: 'ในการลงมือสร้างฐานข้อมูลเชิงสัมพันธ์ที่มีทั้งตาราง categories, products และ order_items เหตุใดจึงต้องสร้างตาราง categories ก่อนตาราง products เสมอ?',
    options: [
      { id: 'a', text: 'เพราะตาราง products ต้องอ้างอิง Foreign Key ไปยัง categories(id) หากยังไม่มีตาราง categories จะเกิด Error ทันที', isCorrect: true },
      { id: 'b', text: 'เพราะชื่อ categories ขึ้นต้นด้วยตัวอักษร C ซึ่งมาก่อนตัว P', isCorrect: false },
      { id: 'c', text: 'เพราะตาราง categories เก็บข้อมูลได้น้อยกว่า', isCorrect: false },
      { id: 'd', text: 'สามารถสร้างตารางไหนก่อนก็ได้ ระบบจะเดาตารางแม่ให้เอง', isCorrect: false }
    ],
    explanation: 'ในระบบ RDBMS ตารางปลายทางที่ถูกอ้างอิง (Parent Table) ต้องมีตัวตนอยู่ในฐานข้อมูลก่อน จึงจะสามารถสร้าง Foreign Key จากตารางลูกชี้ไปหาได้'
  },
  {
    id: 2,
    question: 'ชนิดข้อมูล (Data Type) ของคอลัมน์ Foreign Key ในตารางลูก ต้องสัมพันธ์กับคอลัมน์ Primary Key ของตารางแม่อย่างไร?',
    options: [
      { id: 'a', text: 'ต้องเป็นชนิดข้อมูลเดียวกันหรือเข้ากันได้ (เช่น ถ้า PK เป็น BIGINT/int8 คอลัมน์ FK ก็ต้องเป็น BIGINT/int8 ด้วย)', isCorrect: true },
      { id: 'b', text: 'ต้องเป็นชนิดข้อมูลต่างกันเสมอ เช่น PK เป็นตัวเลข FK ต้องเป็นข้อความ', isCorrect: false },
      { id: 'c', text: 'บังคับให้ใช้ชนิดข้อมูล BOOLEAN เท่านั้นสำหรับ Foreign Key', isCorrect: false },
      { id: 'd', text: 'ไม่ต้องกำหนดชนิดข้อมูลให้กับคอลัมน์ Foreign Key', isCorrect: false }
    ],
    explanation: 'คอลัมน์ Foreign Key และ Primary Key ที่เชื่อมโยงกันต้องมีชนิดข้อมูลตรงกัน เช่น BIGINT (int8) กับ BIGINT หรือ UUID กับ UUID มิฉะนั้น PostgreSQL จะไม่อนุญาตให้ผูกความสัมพันธ์'
  },
  {
    id: 3,
    question: 'เมื่อสร้างตารางผ่านหน้าจอ GUI ของ Supabase Table Editor หากต้องการผูกความสัมพันธ์ Foreign Key ให้กับคอลัมน์ ต้องคลิกที่สัญลักษณ์ใด?',
    options: [
      { id: 'a', text: 'ไอคอนรูปโซ่คล้อง (Link / Add Foreign Key Relation) ด้านขวาของคอลัมน์ หรือปุ่ม Add Foreign Key', isCorrect: true },
      { id: 'b', text: 'ไอคอนรูปถังขยะสีแดง', isCorrect: false },
      { id: 'c', text: 'ปุ่ม Log Out มุมซ้ายล่าง', isCorrect: false },
      { id: 'd', text: 'ไอคอนรูปไมโครโฟน', isCorrect: false }
    ],
    explanation: 'ในหน้าต่างสร้าง/แก้ไขตารางของ Supabase จะมีไอคอนรูปโซ่คล้อง (Foreign Key Relation) ให้คลิกเพื่อเลือกตารางปลายทางและคอลัมน์อ้างอิงได้โดยไม่ต้องพิมพ์โค้ดเอง'
  },
  {
    id: 4,
    question: 'คำสั่ง SQL ในข้อใดเขียนกำหนด Foreign Key ให้กับคอลัมน์ category_id เพื่ออ้างอิงไปยังคอลัมน์ id ของตาราง categories ได้ถูกต้อง?',
    options: [
      { id: 'a', text: 'category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT', isCorrect: true },
      { id: 'b', text: 'category_id LINK TO categories.id', isCorrect: false },
      { id: 'c', text: 'category_id CONNECT categories(id)', isCorrect: false },
      { id: 'd', text: 'FOREIGN category_id = categories.id', isCorrect: false }
    ],
    explanation: 'ไวยากรณ์มาตรฐานของ PostgreSQL คือ ชื่อคอลัมน์ ชนิดข้อมูล REFERENCES ชื่อตารางแม่(ชื่อคอลัมน์PK) ตามด้วยเงื่อนไข ON DELETE'
  },
  {
    id: 5,
    question: 'หากในตาราง categories มีเพียง id = 1, 2, 3 แต่เราสั่งรัน INSERT INTO products (..., category_id) VALUES (..., 50); ระบบ Supabase จะตอบสนองอย่างไร?',
    options: [
      { id: 'a', text: 'ปฏิเสธการเพิ่มข้อมูลและแจ้งเตือนข้อผิดพลาด violates foreign key constraint เนื่องจากไม่มีรหัสหมวดหมู่ 50 อยู่จริง', isCorrect: true },
      { id: 'b', text: 'เพิ่มข้อมูลให้ปกติแล้วสร้างหมวดหมู่ที่ 50 ชื่อว่างเปล่าขึ้นมาเอง', isCorrect: false },
      { id: 'c', text: 'ลบข้อมูลสินค้าทั้งหมดในตารางทิ้ง', isCorrect: false },
      { id: 'd', text: 'เปลี่ยนค่า 50 ให้กลายเป็น 1 โดยอัตโนมัติ', isCorrect: false }
    ],
    explanation: 'นี่คือกลไก Referential Integrity ของฐานข้อมูลเชิงสัมพันธ์ ที่ช่วยป้องกันไม่ให้มีข้อมูลลูกอ้างอิงไปยังรหัสแม่ที่ไม่มีอยู่จริง'
  },
  {
    id: 6,
    question: 'ในตารางตัวกลาง order_items ที่เชื่อมระหว่างใบสั่งซื้อ (orders) กับสินค้า (products) เหตุใดคอลัมน์ order_id จึงนิยมตั้งค่าเป็น ON DELETE CASCADE?',
    options: [
      { id: 'a', text: 'เพื่อให้เมื่อลบใบสั่งซื้อหลักออก รายการสินค้าย่อยภายในบิลใบนั้นถูกลบตามไปด้วยอัตโนมัติ ไม่ค้างเป็นขยะในระบบ', isCorrect: true },
      { id: 'b', text: 'เพื่อให้เมื่อลบใบสั่งซื้อแล้ว สินค้าในคลังถูกลบทิ้งไปด้วย', isCorrect: false },
      { id: 'c', text: 'เพื่อห้ามไม่ให้ใครแก้ไขจำนวนสินค้า', isCorrect: false },
      { id: 'd', text: 'เพื่อให้ราคาสินค้าเพิ่มขึ้น 2 เท่า', isCorrect: false }
    ],
    explanation: 'รายการย่อยในบิล (order_items) เป็นส่วนหนึ่งของใบสั่งซื้อ (orders) หากบิลหลักถูกลบ รายการย่อยของบิลนั้นก็ควรลบตามไปด้วย จึงเหมาะกับการใช้ ON DELETE CASCADE'
  },
  {
    id: 7,
    question: 'ในทางกลับกัน เหตุใดคอลัมน์ product_id ในตาราง order_items จึงนิยมตั้งค่าเป็น ON DELETE RESTRICT แทนที่จะเป็น CASCADE?',
    options: [
      { id: 'a', text: 'เพื่อป้องกันไม่ให้เผลอลบข้อมูลสินค้าหลักออกจากร้าน หากสินค้านั้นเคยถูกสั่งซื้ออยู่ในประวัติใบเสร็จของลูกค้าแล้ว', isCorrect: true },
      { id: 'b', text: 'เพื่อให้ลบสินค้าแล้วประวัติการซื้อของลูกค้าหายไปทั้งหมด', isCorrect: false },
      { id: 'c', text: 'เพราะ PostgreSQL อนุญาตให้ใช้ CASCADE ได้แค่ตารางละ 1 ครั้ง', isCorrect: false },
      { id: 'd', text: 'เพื่อบังคับให้สินค้าทุกชิ้นราคาเท่ากัน', isCorrect: false }
    ],
    explanation: 'หากตั้งเป็น CASCADE กับสินค้า เวลาลบสินค้าออกจากแคตตาล็อก ประวัติยอดขายในบิลเก่าๆ จะหายไปทำให้บัญชีผิดพลาด จึงต้องใช้ RESTRICT เพื่อปกป้องประวัติการซื้อขาย'
  },
  {
    id: 8,
    question: 'คำสั่ง SQL ใดใช้สำหรับดึงข้อมูลจากตาราง products และตาราง categories มาแสดงผลรวมกันเฉพาะแถวที่มีความสัมพันธ์ตรงกัน?',
    options: [
      { id: 'a', text: 'SELECT * FROM products p INNER JOIN categories c ON p.category_id = c.id;', isCorrect: true },
      { id: 'b', text: 'SELECT * FROM products MERGE categories;', isCorrect: false },
      { id: 'c', text: 'COMBINE TABLE products WITH categories;', isCorrect: false },
      { id: 'd', text: 'INSERT INTO products SELECT categories;', isCorrect: false }
    ],
    explanation: 'คำสั่ง INNER JOIN ... ON ... ใช้เชื่อมตารางตั้งแต่ 2 ตารางขึ้นไปโดยตรวจสอบเงื่อนไขความเท่ากันระหว่าง Foreign Key กับ Primary Key'
  },
  {
    id: 9,
    question: 'หากเผลอสร้างตารางลูกเสร็จไปแล้ว แต่ลืมกำหนด Foreign Key เราสามารถเพิ่มความสัมพันธ์ในภายหลังได้อย่างไรบน Supabase?',
    options: [
      { id: 'a', text: 'แก้ไขตารางใน Table Editor แล้วกดผูก Foreign Key หรือรันคำสั่ง ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY', isCorrect: true },
      { id: 'b', text: 'ต้องลบโปรเจกต์ Supabase ทิ้งแล้วสมัครสมาชิกใหม่เท่านั้น', isCorrect: false },
      { id: 'c', text: 'ไม่สามารถแก้ไขได้อีกเลยตลอดไป', isCorrect: false },
      { id: 'd', text: 'ต้องเปลี่ยนชื่อตารางให้เป็นตัวพิมพ์ใหญ่ทั้งหมด', isCorrect: false }
    ],
    explanation: 'เราสามารถเพิ่ม Foreign Key ย้อนหลังได้ทั้งผ่านปุ่ม Edit Table ในหน้า Table Editor หรือใช้คำสั่ง SQL ALTER TABLE'
  },
  {
    id: 10,
    question: 'หลังจากสร้างตารางทั้ง 5 ตารางและผูก Foreign Key เสร็จเรียบร้อย เราสามารถตรวจสอบว่าเส้นความสัมพันธ์เชื่อมต่อกันครบถ้วนหรือไม่จากเมนูใดใน Supabase?',
    options: [
      { id: 'a', text: 'ไปที่เมนู Database > Schema Visualizer เพื่อดูแผนภาพตารางและเส้นเชื่อมโยง Foreign Key ทั้งหมด', isCorrect: true },
      { id: 'b', text: 'ไปที่เมนู Authentication > Users', isCorrect: false },
      { id: 'c', text: 'ไปที่เมนู Storage > Buckets', isCorrect: false },
      { id: 'd', text: 'ไปที่เมนู Edge Functions', isCorrect: false }
    ],
    explanation: 'Schema Visualizer ในหมวด Database จะแสดงตารางทั้งหมดพร้อมเส้นเชื่อมจากคอลัมน์ Foreign Key ไปยัง Primary Key ทำให้ตรวจสอบความถูกต้องได้ทันที'
  }
]
</script>

<template>
  <div class="w-full space-y-10 pb-12 px-4 md:px-8">

    <!-- ============================================================== -->
    <!-- HERO HEADER BANNER                                             -->
    <!-- ============================================================== -->
    <div
      class="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-8 md:p-12 border border-emerald-700/60 shadow-2xl relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none text-emerald-400">
        <Database class="w-[420px] h-[420px] -translate-y-16 translate-x-16" />
      </div>

      <div class="relative z-10 max-w-4xl space-y-5">
        <div class="flex flex-wrap items-center gap-2.5">
          <span
            class="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-black rounded-full text-xs uppercase tracking-wider border border-emerald-400/30">
            สัปดาห์ที่ 5 • รหัสวิชา 31901-2007
          </span>
          <span class="px-3.5 py-1.5 bg-white/10 text-slate-200 text-xs rounded-full font-bold border border-white/15">
            Hands-on Relational Database Workshop in Supabase
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          ปฏิบัติการลงมือสร้างฐานข้อมูลเชิงสัมพันธ์ใน <span class="text-emerald-400 font-mono">Supabase</span><br />
          <span class="text-xl sm:text-2xl md:text-3xl text-teal-300 font-bold">
            (Foreign Keys, Junction Tables, Referential Integrity &amp; SQL JOIN)
          </span>
        </h1>

        <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          นำทฤษฎี Cardinality (1:1, 1:N, N:M) จากสัปดาห์ที่ 4 สู่เวิร์กช็อปลงมือสร้างฐานข้อมูลร้านค้าจริงบนคลาวด์
          <strong>Supabase PostgreSQL</strong> เรียนรู้การสร้างตารางแม่-ตารางลูก การผูก Foreign Key ทั้งผ่านหน้าจอ
          <strong>Table Editor GUI</strong> และ <strong>SQL Editor</strong> การทดสอบกฎความปลอดภัยของข้อมูล
          การตรวจสอบเส้นสายความสัมพันธ์ใน <strong>Schema Visualizer</strong> ตลอดจนการสืบค้นข้ามตารางด้วย <code>INNER JOIN</code>
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-2xl bg-black/35 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200 font-bold">
            <Layers class="w-4 h-4 text-emerald-400" />
            <span>ลำดับการสร้าง Parent ➔ Child ➔ Junction</span>
          </div>
          <div class="px-4 py-2 rounded-2xl bg-black/35 border border-sky-500/30 flex items-center gap-2 text-xs text-sky-200 font-bold">
            <Link class="w-4 h-4 text-sky-400" />
            <span>ผูก Foreign Key (GUI &amp; SQL REFERENCES)</span>
          </div>
          <div class="px-4 py-2 rounded-2xl bg-black/35 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-200 font-bold">
            <GitCommit class="w-4 h-4 text-purple-400" />
            <span>สืบค้นข้ามตารางด้วย INNER JOIN</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- CHECK-IN SYSTEM & TEACHER SCOREBOARD BUTTON                    -->
    <!-- ============================================================== -->
    <div class="space-y-4">
      <CheckInSystem :course-id="currentCourseId" :week="currentWeek" />

      <div v-if="isTeacher" class="flex justify-end">
        <button
          @click="showTeacherModal = true"
          class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <Trophy class="w-4 h-4" />
          <span>ดูตารางคะแนนมินิเกมและแบบทดสอบ (สำหรับครู)</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- CHAPTER OBJECTIVES & COMPETENCIES SECTION                      -->
    <!-- ============================================================== -->
    <section>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700 shadow-sm">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-800">จุดประสงค์และสมรรถนะประจำสัปดาห์ที่ 5</h2>
          <p class="text-sm text-slate-500 mt-0.5">หน่วยการเรียนรู้: การสร้างฐานข้อมูลเชิงสัมพันธ์และคีย์นอกบนคลาวด์ DBMS (ทฤษฎี 2 ชม. ปฏิบัติ 4 ชม.)</p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. ผลลัพธ์การเรียนรู้ -->
          <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-emerald-900 font-bold">
                <Lightbulb class="w-5 h-5 shrink-0 text-emerald-600" />
                <span>1. ผลลัพธ์การเรียนรู้ระดับหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                ผู้เรียนเข้าใจลำดับขั้นการสร้างตารางในฐานข้อมูลเชิงสัมพันธ์ สามารถสร้างตารางและผูก Foreign Key บน Supabase ได้ทั้งแบบ GUI และคำสั่ง SQL ตลอดจนเข้าใจกลไกความถูกต้องของการอ้างอิง (Referential Integrity)
              </p>
            </div>
          </div>

          <!-- 2. สมรรถนะประจำหน่วย -->
          <div class="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-teal-900 font-bold">
                <Award class="w-5 h-5 shrink-0 text-teal-600" />
                <span>2. สมรรถนะประจำหน่วย</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                สร้างตารางเชิงสัมพันธ์ระบบร้านค้า (Smart IT Store) 5 ตาราง กำหนด Foreign Key และ Action ON DELETE (RESTRICT / CASCADE) ตรวจสอบผ่าน Schema Visualizer และเขียนคำสั่ง SQL JOIN ดึงข้อมูลข้ามตารางได้ถูกต้อง
              </p>
            </div>
          </div>

          <!-- 3. วัตถุประสงค์เชิงพฤติกรรม -->
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-slate-900 font-bold">
                <CheckSquare class="w-5 h-5 shrink-0 text-slate-700" />
                <span>3. วัตถุประสงค์เชิงพฤติกรรม</span>
              </div>
              <ul class="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>เรียงลำดับการสร้างตารางแม่ ➔ ลูก ➔ ตัวกลาง ได้ถูกต้อง</li>
                <li>กำหนด Foreign Key ใน Supabase Table Editor และ SQL Editor ได้</li>
                <li>อธิบายความแตกต่างของ ON DELETE CASCADE และ RESTRICT ได้</li>
                <li>ใช้ Schema Visualizer ตรวจสอบเส้นสายความสัมพันธ์ได้</li>
                <li>เขียนคำสั่ง INNER JOIN ดึงข้อมูลข้ามตั้งแต่ 2 ถึง 4 ตารางได้</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 1: สถาปัตยกรรม SCHEMA 3 ตารางของ SMART IT STORE          -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-emerald-600 uppercase tracking-wider">Topic 1 • Relational Schema Architecture</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <FolderTree class="w-7 h-7 text-emerald-600 shrink-0" />
            โครงสร้างฐานข้อมูลร้านค้าไอที Smart IT Store (3 ตารางเชื่อมโยงความสัมพันธ์)
          </h2>
        </div>
        <span class="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start">
          การเชื่อมโยงความสัมพันธ์ 1:N ต่อเนื่อง 3 ระดับ
        </span>
      </div>

      <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
        ในบทเรียนสัปดาห์นี้ เราจะพานักศึกษาลงมือสร้างฐานข้อมูลสำหรับร้านค้าอุปกรณ์ไอที <strong>Smart IT Store</strong> ผ่าน <strong>3 ตารางหลัก</strong> ที่จำลองการทำงานจริงในระบบพาณิชย์อิเล็กทรอนิกส์:
      </p>

      <!-- แผนผังเส้นสายความสัมพันธ์ (Visual Relationship Map - 3 Tables Schema Visualizer) -->
      <div class="p-5 sm:p-7 rounded-3xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Network class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm sm:text-base font-black tracking-wide text-white block">
                แผนภาพโครงสร้างความสัมพันธ์ 3 ตาราง (Schema Visualizer &amp; ER Diagram)
              </span>
              <span class="text-xs text-slate-400 font-mono">
                categories (1) ──(1:N)──&gt; products (N/1) ──(1:N)──&gt; orders (N)
              </span>
            </div>
          </div>
          
          <!-- Legend Badges -->
          <div class="flex items-center gap-2 text-[11px] font-mono flex-wrap">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              <Key class="w-3 h-3 text-amber-400" /> PK (Primary Key)
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              <Link class="w-3 h-3 text-cyan-400" /> FK (Foreign Key)
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              1:N One-to-Many
            </span>
          </div>
        </div>

        <!-- Master 3-Table Diagram with Curved Field-to-Field SVG Connectors -->
        <div class="overflow-x-auto pb-4 pt-2">
          <div class="min-w-[960px] max-w-5xl mx-auto flex items-start justify-between font-mono text-xs select-none">
            
            <!-- ======================================================== -->
            <!-- TABLE 1: categories (ตารางแม่ ลำดับที่ 1)                  -->
            <!-- ======================================================== -->
            <div class="w-72 shrink-0 rounded-2xl bg-slate-800/95 border-2 border-emerald-500/50 shadow-xl overflow-visible">
              <div class="h-11 px-4 bg-emerald-950/90 border-b border-emerald-500/30 rounded-t-2xl flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Table class="w-4 h-4 text-emerald-400" />
                  <span class="font-bold text-sm text-emerald-100">categories</span>
                </div>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-sans font-bold border border-emerald-500/30">ตารางแม่ (ฝั่ง 1)</span>
              </div>
              <!-- Row 1: id [PK] (Y center = 64px) -->
              <div class="h-10 px-4 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                <span class="text-amber-300 font-bold flex items-center gap-1.5">
                  <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                </span>
                <span class="text-amber-200 font-bold text-[11px]">1 (BIGINT)</span>
                <!-- Right Port Dot connecting to products.category_id -->
                <span class="w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#fbbf24] z-10"></span>
              </div>
              <!-- Row 2: category_code -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">category_code</span>
                <span class="text-slate-400 text-[10px]">'CAT-CPU' (Unique)</span>
              </div>
              <!-- Row 3: category_name -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">category_name</span>
                <span class="text-slate-400 text-[10px]">'Processors'</span>
              </div>
              <!-- Row 4: description -->
              <div class="h-10 px-4 flex items-center justify-between rounded-b-2xl">
                <span class="text-slate-200">description</span>
                <span class="text-slate-400 text-[10px]">text</span>
              </div>
            </div>

            <!-- ======================================================== -->
            <!-- CONNECTOR 1: categories.id (1) ➔ products.category_id (N)-->
            <!-- ======================================================== -->
            <div class="w-28 shrink-0 select-none flex items-center justify-center">
              <svg width="112" height="240" viewBox="0 0 112 240" class="overflow-visible">
                <defs>
                  <linearGradient id="grad-cat-prod" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="50%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#38bdf8" />
                  </linearGradient>
                </defs>
                <!-- Glow under-stroke (From Y=64 to Y=104) -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="rgba(16, 185, 129, 0.25)" stroke-width="7" stroke-linecap="round" />
                <!-- Main Curved Bezier Line -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="url(#grad-cat-prod)" stroke-width="2.5" />
                <!-- Dashed Pulse Line -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="#e0f2fe" stroke-width="1.2" stroke-dasharray="3 3" />
                <!-- Left 1 Tick mark (at PK) -->
                <line x1="12" y1="56" x2="12" y2="72" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
                <rect x="18" y="44" width="18" height="15" rx="3" fill="#064e3b" stroke="#10b981" stroke-width="1" />
                <text x="27" y="55" text-anchor="middle" fill="#6ee7b7" font-size="9" font-family="monospace" font-weight="bold">1</text>
                <!-- Right Crow's foot N (at FK) -->
                <path d="M 96 104 L 110 96 M 96 104 L 110 104 M 96 104 L 110 112" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
                <rect x="76" y="112" width="18" height="15" rx="3" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1" />
                <text x="85" y="123" text-anchor="middle" fill="#7dd3fc" font-size="9" font-family="monospace" font-weight="bold">N</text>
              </svg>
            </div>

            <!-- ======================================================== -->
            <!-- TABLE 2: products (ตารางลูกของ categories / แม่ของ orders) -->
            <!-- ======================================================== -->
            <div class="w-80 shrink-0 rounded-2xl bg-slate-800/95 border-2 border-sky-500/60 shadow-xl overflow-visible">
              <div class="h-11 px-4 bg-sky-950/90 border-b border-sky-500/40 rounded-t-2xl flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Table class="w-4 h-4 text-sky-400" />
                  <span class="font-bold text-sm text-sky-100">products</span>
                </div>
                <span class="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-sans font-bold border border-sky-500/30">ลูก (N) ➔ แม่ (1)</span>
              </div>
              <!-- Row 1: id [PK] (Y center = 64px) -->
              <div class="h-10 px-4 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                <span class="text-amber-300 font-bold flex items-center gap-1.5">
                  <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                </span>
                <span class="text-amber-200 font-bold text-[11px]">101 (BIGINT)</span>
                <!-- Right Port Dot connecting to orders.product_id -->
                <span class="w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -right-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#fbbf24] z-10"></span>
              </div>
              <!-- Row 2: category_id [FK] (Y center = 104px) -->
              <div class="h-10 px-4 bg-sky-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                <!-- Left Port Dot receiving from categories.id -->
                <span class="w-3 h-3 rounded-full bg-sky-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#38bdf8] z-10"></span>
                <span class="text-sky-300 font-bold flex items-center gap-1.5">
                  <Link class="w-3.5 h-3.5 text-sky-400" /> category_id [FK]
                </span>
                <span class="text-sky-200 font-bold text-[11px]">1 ➔ categories</span>
              </div>
              <!-- Row 3: sku -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">sku</span>
                <span class="text-slate-400 text-[10px]">'CPU-I5' (Unique)</span>
              </div>
              <!-- Row 4: product_name -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">product_name</span>
                <span class="text-slate-300 text-[10px]">'Core i5-14500'</span>
              </div>
              <!-- Row 5: price -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">price</span>
                <span class="text-emerald-400 font-bold text-[11px]">8,900.00 ฿</span>
              </div>
              <!-- Row 6: stock -->
              <div class="h-10 px-4 flex items-center justify-between rounded-b-2xl">
                <span class="text-slate-200">stock</span>
                <span class="text-slate-400 text-[11px]">15 ชิ้น</span>
              </div>
            </div>

            <!-- ======================================================== -->
            <!-- CONNECTOR 2: products.id (1) ➔ orders.product_id (N)      -->
            <!-- ======================================================== -->
            <div class="w-28 shrink-0 select-none flex items-center justify-center">
              <svg width="112" height="240" viewBox="0 0 112 240" class="overflow-visible">
                <defs>
                  <linearGradient id="grad-prod-ord" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="50%" stop-color="#38bdf8" />
                    <stop offset="100%" stop-color="#818cf8" />
                  </linearGradient>
                </defs>
                <!-- Glow under-stroke (From Y=64 to Y=104) -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="rgba(99, 102, 241, 0.25)" stroke-width="7" stroke-linecap="round" />
                <!-- Main Curved Bezier Line -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="url(#grad-prod-ord)" stroke-width="2.5" />
                <!-- Dashed Pulse Line -->
                <path d="M 0 64 C 56 64, 56 104, 112 104" fill="none" stroke="#e0e7ff" stroke-width="1.2" stroke-dasharray="3 3" />
                <!-- Left 1 Tick mark (at products.id) -->
                <line x1="12" y1="56" x2="12" y2="72" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
                <rect x="18" y="44" width="18" height="15" rx="3" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1" />
                <text x="27" y="55" text-anchor="middle" fill="#7dd3fc" font-size="9" font-family="monospace" font-weight="bold">1</text>
                <!-- Right Crow's foot N (at orders.product_id) -->
                <path d="M 96 104 L 110 96 M 96 104 L 110 104 M 96 104 L 110 112" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" />
                <rect x="76" y="112" width="18" height="15" rx="3" fill="#312e81" stroke="#818cf8" stroke-width="1" />
                <text x="85" y="123" text-anchor="middle" fill="#c7d2fe" font-size="9" font-family="monospace" font-weight="bold">N</text>
              </svg>
            </div>

            <!-- ======================================================== -->
            <!-- TABLE 3: orders (ตารางลูก ลำดับที่ 3)                     -->
            <!-- ======================================================== -->
            <div class="w-76 shrink-0 rounded-2xl bg-slate-800/95 border-2 border-indigo-500/60 shadow-xl overflow-visible">
              <div class="h-11 px-4 bg-indigo-950/90 border-b border-indigo-500/40 rounded-t-2xl flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Table class="w-4 h-4 text-indigo-400" />
                  <span class="font-bold text-sm text-indigo-100">orders</span>
                </div>
                <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-sans font-bold border border-indigo-500/30">ตารางลูก (ฝั่ง N)</span>
              </div>
              <!-- Row 1: id [PK] (Y center = 64px) -->
              <div class="h-10 px-4 bg-amber-500/15 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-amber-300 font-bold flex items-center gap-1.5">
                  <Key class="w-3.5 h-3.5 text-amber-400" /> id [PK]
                </span>
                <span class="text-amber-200 font-bold text-[11px]">1 (BIGINT)</span>
              </div>
              <!-- Row 2: product_id [FK] (Y center = 104px) -->
              <div class="h-10 px-4 bg-indigo-500/15 border-b border-slate-700/60 flex items-center justify-between relative">
                <!-- Left Port Dot receiving from products.id -->
                <span class="w-3 h-3 rounded-full bg-indigo-400 border-2 border-slate-900 absolute -left-1.5 top-1/2 -translate-y-1/2 shadow-[0_0_8px_#818cf8] z-10"></span>
                <span class="text-indigo-300 font-bold flex items-center gap-1.5">
                  <Link class="w-3.5 h-3.5 text-indigo-400" /> product_id [FK]
                </span>
                <span class="text-indigo-200 font-bold text-[11px]">101 ➔ products</span>
              </div>
              <!-- Row 3: order_no -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">order_no</span>
                <span class="text-sky-300 font-bold text-[10px]">'ORD-2026-001'</span>
              </div>
              <!-- Row 4: customer_name -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">customer_name</span>
                <span class="text-slate-300 text-[10px]">'กิตติภพ...'</span>
              </div>
              <!-- Row 5: quantity -->
              <div class="h-10 px-4 border-b border-slate-700/60 flex items-center justify-between">
                <span class="text-slate-200">quantity</span>
                <span class="text-amber-300 font-bold text-[11px]">1 ชิ้น</span>
              </div>
              <!-- Row 6: status -->
              <div class="h-10 px-4 flex items-center justify-between rounded-b-2xl">
                <span class="text-slate-200">status</span>
                <span class="text-emerald-300 font-bold text-[10px]">'PAID'</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Relationship Summary 2 Main Chains -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <span class="font-bold text-white block">เส้นที่ 1: categories ➔ products (1:N)</span>
              <span class="text-[11px] text-slate-400">1 หมวดหมู่มีสินค้าได้หลายชนิด (FK: <code>category_id</code> อยู่ที่ products)</span>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <span class="font-bold text-white block">เส้นที่ 2: products ➔ orders (1:N)</span>
              <span class="text-[11px] text-slate-400">1 สินค้าถูกสั่งซื้อได้หลายบิลคำสั่งซื้อ (FK: <code>product_id</code> อยู่ที่ orders)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ตารางแจกแจงบทบาท 3 ตาราง -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-xs sm:text-sm text-left text-slate-700">
          <thead class="bg-slate-100 text-slate-900 font-black border-b border-slate-200">
            <tr>
              <th class="p-3.5">ลำดับการสร้าง</th>
              <th class="p-3.5">ชื่อตาราง (Table Name)</th>
              <th class="p-3.5">ประเภทตาราง</th>
              <th class="p-3.5">Primary Key</th>
              <th class="p-3.5">Foreign Key และตารางที่อ้างอิงถึง</th>
              <th class="p-3.5">หน้าที่และความหมายในระบบ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 font-medium">
            <tr class="hover:bg-emerald-50/40">
              <td class="p-3.5 text-center font-bold text-emerald-700">ลำดับที่ 1</td>
              <td class="p-3.5 font-mono font-bold text-emerald-700">categories</td>
              <td class="p-3.5"><span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">ตารางแม่ 1</span></td>
              <td class="p-3.5 font-mono text-yellow-700 font-bold">id (BIGINT)</td>
              <td class="p-3.5 text-slate-400">- ไม่มี -</td>
              <td class="p-3.5 text-slate-600">เก็บรายชื่อหมวดหมู่สินค้าหลัก (เช่น Processors, Graphics Cards, Storage)</td>
            </tr>
            <tr class="hover:bg-sky-50/40">
              <td class="p-3.5 text-center font-bold text-sky-700">ลำดับที่ 2</td>
              <td class="p-3.5 font-mono font-bold text-sky-700">products</td>
              <td class="p-3.5"><span class="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">ตารางลูก (1:N)</span></td>
              <td class="p-3.5 font-mono text-yellow-700 font-bold">id (BIGINT)</td>
              <td class="p-3.5 font-mono text-amber-700 font-bold">category_id ➔ categories(id)</td>
              <td class="p-3.5 text-slate-600">เก็บข้อมูลสินค้า รหัส SKU ราคา จำนวนสต็อก และรหัสหมวดหมู่</td>
            </tr>
            <tr class="hover:bg-indigo-50/40">
              <td class="p-3.5 text-center font-bold text-indigo-700">ลำดับที่ 3</td>
              <td class="p-3.5 font-mono font-bold text-indigo-700">orders</td>
              <td class="p-3.5"><span class="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">ตารางลูก (1:N)</span></td>
              <td class="p-3.5 font-mono text-yellow-700 font-bold">id (BIGINT)</td>
              <td class="p-3.5 font-mono text-indigo-700 font-bold">product_id ➔ products(id)</td>
              <td class="p-3.5 text-slate-600">เก็บบันทึกประวัติการสั่งซื้อ เลขที่บิล ชื่อลูกค้า รหัสสินค้า และจำนวนที่ซื้อ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 2: กฎเหล็กลำดับการสร้าง (EXECUTION ORDER RULE)          -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-amber-600 uppercase tracking-wider">Topic 2 • Critical Rule</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <ListOrdered class="w-7 h-7 text-amber-600 shrink-0" />
            ทำไมต้องสร้างตารางตามลำดับ 1 ➔ 2 ➔ 3? (Parent ➔ Child ➔ Grandchild)
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div class="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            ในระบบจัดการฐานข้อมูลเชิงสัมพันธ์อย่าง PostgreSQL หรือ Supabase เมื่อเราสั่งสร้างตารางที่มีคำสั่ง
            <code>REFERENCES categories(id)</code> ตัว DBMS จะต้องเข้าไปตรวจสอบทันทีว่า
            <strong>"มีตาราง categories และมีคอลัมน์ id อยู่จริงในฐานข้อมูลแล้วหรือยัง?"</strong>
          </p>

          <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
            <div class="font-bold flex items-center gap-1.5 text-rose-700">
              <AlertTriangle class="w-4 h-4" />
              หากสร้างสลับลำดับ (เช่น สร้าง products ก่อน categories):
            </div>
            <p class="text-xs leading-relaxed">
              ระบบจะหยุดทำงานและส่งข้อผิดพลาด: <code class="font-mono font-bold bg-white px-2 py-0.5 rounded text-rose-800">ERROR 42P01: relation "categories" does not exist</code> ทันที!
            </p>
          </div>

          <p>
            เช่นเดียวกันในขั้นตอนการใส่ข้อมูล (<code>INSERT INTO</code>) หากเราพยายามเพิ่มคำสั่งซื้อโดยระบุ <code>product_id = 999</code> ทั้งที่ในตาราง <code>products</code> ยังไม่มีสินค้านั้นอยู่ ระบบจะบล็อกคำสั่งทันทีด้วย <code>foreign_key_violation</code>
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 font-mono text-xs">
          <div class="text-amber-400 font-bold border-b border-slate-800 pb-2 flex items-center gap-2">
            <Terminal class="w-4 h-4" />
            ลำดับการรันคำสั่งที่ถูกต้อง 100% (Correct Order)
          </div>

          <div class="space-y-3 text-slate-300">
            <div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              <span class="text-white font-black">สเต็ปที่ 1:</span> CREATE TABLE categories (ตารางแม่ ไม่มีคีย์นอก)
            </div>
            <div class="text-center text-slate-500 text-[11px]">▼ มี categories ให้ชี้หาแล้ว จึงสร้าง products ได้</div>
            <div class="p-3 rounded-xl bg-sky-950/60 border border-sky-500/40 text-sky-300">
              <span class="text-white font-black">สเต็ปที่ 2:</span> CREATE TABLE products (ผูก Foreign Key ➔ categories)
            </div>
            <div class="text-center text-slate-500 text-[11px]">▼ มี products ให้ชี้หาแล้ว จึงสร้าง orders ได้</div>
            <div class="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300">
              <span class="text-white font-black">สเต็ปที่ 3:</span> CREATE TABLE orders (ผูก Foreign Key ➔ products)
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 3: สาธิตการสร้างตารางและผูก FOREIGN KEY ทีละขั้นตอน      -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-black uppercase tracking-wider">
              Topic 3 • Step-by-Step Hands-on Guide
            </span>
            <span class="text-xs text-slate-400 font-bold">• ลำดับการสร้าง: 1. categories ➔ 2. products ➔ 3. orders</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Laptop class="w-7 h-7 text-teal-600 shrink-0" />
            คู่มือสร้าง 3 ตารางและผูก Foreign Key ใน Supabase ทีละขั้นตอน
          </h2>
          <p class="text-xs sm:text-sm text-slate-500">
            เลือกแถบตารางด้านล่างเพื่อดูขั้นตอนผ่าน Supabase Dashboard (GUI) ควบคู่กับคำสั่ง SQL สร้างตารางและใส่ข้อมูล
          </p>
        </div>

        <!-- Tab Selector for 3 Tables -->
        <div class="flex flex-wrap gap-1.5 self-start bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            v-for="t in [
              { id: 'table1', num: '1', name: 'categories', type: 'ตารางแม่' },
              { id: 'table2', num: '2', name: 'products', type: 'ตารางลูก 1' },
              { id: 'table3', num: '3', name: 'orders', type: 'ตารางลูก 2' }
            ]"
            :key="t.id"
            @click="activeLabTab = t.id"
            class="px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2"
            :class="activeLabTab === t.id 
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200/80 font-black scale-102' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono text-white"
              :class="activeLabTab === t.id ? 'bg-teal-600' : 'bg-slate-400'">
              {{ t.num }}
            </span>
            <span>{{ t.name }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md font-sans"
              :class="activeLabTab === t.id ? 'bg-teal-50 text-teal-700 font-black' : 'bg-slate-200/70 text-slate-500'">
              {{ t.type }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab 1: categories (ตารางแม่ ฝั่ง 1) -->
      <div v-if="activeLabTab === 'table1'" class="space-y-6 animate-[fadeIn_0.25s_ease-out]">
        <div class="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">1</span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
                <span>ตารางที่ 1: categories (หมวดหมู่สินค้า - ตารางแม่)</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">ตารางแม่ (ฝั่ง 1)</span>
              </h3>
              <p class="text-xs text-emerald-800 font-medium">ตารางหลักสำหรับจัดกลุ่มสินค้า ต้องสร้างเป็นอันดับแรกเพื่อให้ตาราง products อ้างอิงได้ (ไม่มี Foreign Key)</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Step Cards GUI Column -->
          <div class="lg:col-span-7 space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>สร้างตารางและปิดการใช้งาน Row Level Security (RLS)</span>
              </div>
              <p class="text-xs text-slate-600 pl-8 leading-relaxed">
                คลิกเมนู <strong>Table Editor</strong> แถบซ้าย ➔ กดปุ่ม <span class="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold">+ New table</span> ➔ กำหนด Name: <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-emerald-700 font-bold font-mono">categories</code>
                <br />⚠️ <strong>ข้อควรระวัง:</strong> นำเครื่องหมายถูกที่ช่อง <strong class="text-rose-600">Enable Row Level Security (RLS)</strong> ออก เพื่อให้สามารถอ่านและเขียนข้อมูลในห้องทดลองได้สะดวก
              </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>ตรวจสอบ Primary Key คอลัมน์ id (Default)</span>
              </div>
              <p class="text-xs text-slate-600 pl-8 leading-relaxed">
                Supabase จะสร้างคอลัมน์ <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-amber-700 font-bold font-mono">id</code> ชนิด <span class="text-slate-800 font-bold">int8</span> (Identity Primary Key) ให้โดยอัตโนมัติ ไม่ต้องลบหรือแก้ไข
              </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>กด Add column เพื่อเพิ่มฟิลด์ข้อมูลตามสเปก:</span>
              </div>
              <div class="pl-8 overflow-x-auto">
                <table class="w-full text-xs text-left bg-white rounded-xl border border-slate-200 overflow-hidden font-mono">
                  <thead class="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th class="p-2">Column Name</th>
                      <th class="p-2">Data Type</th>
                      <th class="p-2">Nullable</th>
                      <th class="p-2">Unique</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td class="p-2 font-bold text-emerald-700">category_code</td>
                      <td class="p-2 text-slate-600">varchar</td>
                      <td class="p-2 text-rose-600 font-bold">No</td>
                      <td class="p-2 text-emerald-600 font-bold">Yes ✓</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-emerald-700">category_name</td>
                      <td class="p-2 text-slate-600">varchar</td>
                      <td class="p-2 text-rose-600 font-bold">No</td>
                      <td class="p-2 text-slate-400">No</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-600">description</td>
                      <td class="p-2 text-slate-600">text</td>
                      <td class="p-2 text-emerald-600 font-bold">Yes ✓</td>
                      <td class="p-2 text-slate-400">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-xs text-slate-600 pl-8">เมื่อกรอกครบแล้ว กดปุ่ม <span class="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold">Save</span> เป็นอันเสร็จสิ้นตารางที่ 1</p>
            </div>
          </div>

          <!-- SQL Code Column -->
          <div class="lg:col-span-5 flex flex-col space-y-4">
            <div class="rounded-2xl bg-slate-950 border border-slate-800 text-white p-5 font-mono text-xs flex flex-col justify-between shadow-xl">
              <div>
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Terminal class="w-4 h-4" /> CREATE TABLE SQL:
                  </span>
                  <button
                    @click="copyText(`CREATE TABLE categories (\n  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  category_code VARCHAR(20) NOT NULL UNIQUE,\n  category_name VARCHAR(100) NOT NULL,\n  description TEXT\n);`, 'sql_cat')"
                    class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy class="w-3.5 h-3.5" />
                    <span>{{ copiedSnippet === 'sql_cat' ? 'คัดลอกแล้ว ✓' : 'Copy SQL' }}</span>
                  </button>
                </div>
                <pre class="overflow-x-auto text-emerald-300 leading-relaxed text-[11px]"><code>CREATE TABLE categories (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category_code VARCHAR(20) NOT NULL UNIQUE,
  category_name VARCHAR(100) NOT NULL,
  description TEXT
);</code></pre>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
                💡 <code>GENERATED BY DEFAULT AS IDENTITY</code> คือคำสั่ง Auto-Increment ตามมาตรฐาน SQL ของ PostgreSQL
              </div>
            </div>

            <!-- Sample Insert SQL -->
            <div class="rounded-2xl bg-slate-900 border border-slate-800 text-white p-4 font-mono text-xs space-y-2">
              <div class="flex items-center justify-between text-slate-300 text-[11px]">
                <span class="text-emerald-400 font-bold">INSERT INTO categories:</span>
                <button
                  @click="copyText(`INSERT INTO categories (category_code, category_name, description) VALUES\n('CAT-CPU', 'หน่วยประมวลผล (Processors)', 'ซีพียูคอมพิวเตอร์'),\n('CAT-GPU', 'การ์ดจอแสดงผล (Graphics Cards)', 'การ์ดจอเกมมิ่ง'),\n('CAT-SSD', 'อุปกรณ์จัดเก็บข้อมูล (SSD)', 'NVMe M.2');`, 'sql_ins_cat')"
                  class="text-[10px] text-slate-400 hover:text-white"
                >
                  {{ copiedSnippet === 'sql_ins_cat' ? 'คัดลอกแล้ว' : 'คัดลอกข้อมูล' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-slate-300 text-[10px] leading-relaxed"><code>INSERT INTO categories (category_code, category_name, description) VALUES
('CAT-CPU', 'หน่วยประมวลผล (Processors)', 'ซีพียูคอมพิวเตอร์'),
('CAT-GPU', 'การ์ดจอแสดงผล (Graphics Cards)', 'การ์ดจอเกมมิ่ง'),
('CAT-SSD', 'อุปกรณ์จัดเก็บข้อมูล (SSD)', 'NVMe M.2');</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: products (ตารางลูก 1:N ผูก FK ➔ categories) -->
      <div v-if="activeLabTab === 'table2'" class="space-y-6 animate-[fadeIn_0.25s_ease-out]">
        <div class="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-sky-50/80 border border-sky-200">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shadow-sm">2</span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-sky-950 flex items-center gap-2">
                <span>ตารางที่ 2: products (สินค้า - ผูก Foreign Key ➔ categories)</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-300">ตารางลูก (ฝั่ง N)</span>
              </h3>
              <p class="text-xs text-sky-800 font-medium">สินค้าแต่ละรายการต้องระบุรหัสหมวดหมู่ category_id ที่มีอยู่จริงในตาราง categories</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span class="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>สร้างตาราง products และเพิ่มคอลัมน์พื้นฐาน</span>
              </div>
              <p class="text-xs text-slate-600 pl-8 leading-relaxed">
                สร้างตารางชื่อ <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700 font-bold font-mono">products</code> ปิด RLS เพิ่มคอลัมน์:
                <br />• <code>sku</code> (varchar, Unique, Not Null) • <code>product_name</code> (varchar, Not Null)
                <br />• <code>price</code> (numeric, Not Null) • <code>stock</code> (int4, Default: 0)
              </p>
            </div>

            <!-- Foreign Key Linking Step -->
            <div class="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border-2 border-sky-300/80 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-bold text-sky-950">
                  <span class="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>วิธีผูก Foreign Key เชื่อม category_id ➔ categories(id)</span>
                </div>
                <span class="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-300">ขั้นตอนสำคัญ</span>
              </div>
              
              <ol class="space-y-2 text-xs text-slate-700 list-decimal pl-8 leading-relaxed">
                <li>เพิ่มคอลัมน์ชื่อ <code class="font-bold text-sky-800 font-mono">category_id</code> เลือก Type เป็น <span class="font-bold">int8</span> (ชนิดเดียวกับ id ตารางแม่)</li>
                <li>มองไปที่ฝั่งขวาของแถว <code>category_id</code> คลิกที่ <strong>ไอคอนรูปโซ่คล้อง (Foreign Key Relation)</strong></li>
                <li>หน้าต่างกล่องป๊อปอัป <em>Edit relation</em> จะปรากฏขึ้น ให้ตั้งค่าตามรูปจำลอง:</li>
              </ol>

              <!-- Supabase GUI Mockup Card -->
              <div class="mx-2 sm:mx-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono space-y-2.5 shadow-inner">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-sky-400 font-sans font-bold">
                  <span class="flex items-center gap-1.5"><Link class="w-3.5 h-3.5" /> Supabase GUI Modal Preview</span>
                  <span class="text-slate-400">Edit foreign key relation</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div class="p-2 bg-slate-800/80 rounded border border-slate-700">
                    <span class="text-slate-400 block text-[9px] uppercase">Select table to reference:</span>
                    <span class="text-emerald-300 font-bold">public.categories</span>
                  </div>
                  <div class="p-2 bg-slate-800/80 rounded border border-slate-700">
                    <span class="text-slate-400 block text-[9px] uppercase">Select column:</span>
                    <span class="text-amber-300 font-bold">id</span>
                  </div>
                </div>
                <div class="p-2 bg-slate-800/80 rounded border border-slate-700 flex items-center justify-between">
                  <span class="text-slate-400 text-[10px]">Action on delete:</span>
                  <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                    RESTRICT (ห้ามลบหมวดหมู่ถ้ายังมีสินค้าอยู่)
                  </span>
                </div>
              </div>

              <p class="text-xs text-slate-600 pl-8">
                กด <strong>Save</strong> ไอคอนโซ่จะเปลี่ยนเป็นสีฟ้า แสดงว่าผูก Foreign Key ไปยัง categories สำเร็จแล้ว!
              </p>
            </div>
          </div>

          <div class="lg:col-span-5 flex flex-col space-y-4">
            <div class="rounded-2xl bg-slate-950 border border-slate-800 text-white p-5 font-mono text-xs flex flex-col justify-between shadow-xl">
              <div>
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span class="text-sky-400 font-bold flex items-center gap-1.5">
                    <Terminal class="w-4 h-4" /> CREATE TABLE SQL:
                  </span>
                  <button
                    @click="copyText(`CREATE TABLE products (\n  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  sku VARCHAR(30) NOT NULL UNIQUE,\n  product_name VARCHAR(150) NOT NULL,\n  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),\n  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),\n  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT\n);`, 'sql_prod')"
                    class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy class="w-3.5 h-3.5" />
                    <span>{{ copiedSnippet === 'sql_prod' ? 'คัดลอกแล้ว ✓' : 'Copy SQL' }}</span>
                  </button>
                </div>
                <pre class="overflow-x-auto text-sky-300 leading-relaxed text-[11px]"><code>CREATE TABLE products (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  sku VARCHAR(30) NOT NULL UNIQUE,
  product_name VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  -- Foreign Key ชี้หา categories(id)
  category_id BIGINT NOT NULL
    REFERENCES categories(id)
    ON DELETE RESTRICT
);</code></pre>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
                🛡️ <code>ON DELETE RESTRICT</code> ป้องกันการลบหมวดหมู่สินค้าโดยไม่ตั้งใจเมื่อยังมีสินค้าค้างอยู่
              </div>
            </div>

            <!-- Sample Insert SQL -->
            <div class="rounded-2xl bg-slate-900 border border-slate-800 text-white p-4 font-mono text-xs space-y-2">
              <div class="flex items-center justify-between text-slate-300 text-[11px]">
                <span class="text-sky-400 font-bold">INSERT INTO products:</span>
                <button
                  @click="copyText(`INSERT INTO products (sku, product_name, price, stock, category_id) VALUES\n('CPU-I5', 'Intel Core i5-14500', 8900.00, 15, 1),\n('GPU-4060', 'NVIDIA RTX 4060 8GB', 11500.00, 8, 2),\n('SSD-1TB', 'WD Black SN850X 1TB NVMe', 3290.00, 25, 3),\n('CPU-R5', 'AMD Ryzen 5 7600X', 7800.00, 12, 1),\n('GPU-4070S', 'NVIDIA RTX 4070 Super 12GB', 23900.00, 5, 2);`, 'sql_ins_prod')"
                  class="text-[10px] text-slate-400 hover:text-white"
                >
                  {{ copiedSnippet === 'sql_ins_prod' ? 'คัดลอกแล้ว' : 'คัดลอกข้อมูล' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-slate-300 text-[10px] leading-relaxed"><code>INSERT INTO products (sku, product_name, price, stock, category_id) VALUES
('CPU-I5', 'Intel Core i5-14500', 8900.00, 15, 1),
('GPU-4060', 'NVIDIA RTX 4060 8GB', 11500.00, 8, 2),
('SSD-1TB', 'WD Black SN850X 1TB NVMe', 3290.00, 25, 3);</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: orders (ตารางลูก 1:N ผูก FK ➔ products) -->
      <div v-if="activeLabTab === 'table3'" class="space-y-6 animate-[fadeIn_0.25s_ease-out]">
        <div class="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">3</span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
                <span>ตารางที่ 3: orders (คำสั่งซื้อ - ผูก Foreign Key ➔ products)</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-300">ตารางลูก (ฝั่ง N)</span>
              </h3>
              <p class="text-xs text-indigo-800 font-medium">ตารางเก็บประวัติการสั่งซื้อสินค้า โดยมี product_id เป็น Foreign Key ชี้ไปยังสินค้าที่ถูกซื้อ</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>สร้างตาราง orders</span>
              </div>
              <p class="text-xs text-slate-600 pl-8 leading-relaxed">
                สร้างตารางชื่อ <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-700 font-bold font-mono">orders</code> ปิด RLS เพิ่มคอลัมน์:
                <br />• <code>order_no</code> (varchar, Unique, Not Null) • <code>customer_name</code> (varchar, Not Null)
                <br />• <code>quantity</code> (int4, Default: 1) • <code>order_date</code> (timestamptz, Default: <code>now()</code>) • <code>status</code> (varchar, Default: 'PAID')
              </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-300/80 shadow-xs space-y-3">
              <div class="flex items-center gap-2 text-xs font-bold text-indigo-950">
                <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>ผูกคอลัมน์ product_id ไปยัง products(id)</span>
              </div>
              <p class="text-xs text-slate-600 pl-8 leading-relaxed">
                เพิ่มคอลัมน์ <code class="font-bold text-indigo-800 font-mono">product_id</code> ชนิด <strong>int8</strong> ➔ กดไอคอนรูปโซ่ ➔ ตั้งค่าในกล่อง:
              </p>
              
              <!-- Supabase GUI Mockup Card -->
              <div class="mx-2 sm:mx-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono space-y-2.5 shadow-inner">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-indigo-400 font-sans font-bold">
                  <span class="flex items-center gap-1.5"><Link class="w-3.5 h-3.5" /> Supabase GUI Modal Preview</span>
                  <span class="text-slate-400">Edit foreign key relation</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div class="p-2 bg-slate-800/80 rounded border border-slate-700">
                    <span class="text-slate-400 block text-[9px] uppercase">Select table:</span>
                    <span class="text-sky-300 font-bold">public.products</span>
                  </div>
                  <div class="p-2 bg-slate-800/80 rounded border border-slate-700">
                    <span class="text-slate-400 block text-[9px] uppercase">Select column:</span>
                    <span class="text-amber-300 font-bold">id</span>
                  </div>
                </div>
                <div class="p-2 bg-slate-800/80 rounded border border-slate-700 flex items-center justify-between">
                  <span class="text-slate-400 text-[10px]">Action on delete:</span>
                  <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                    RESTRICT (ห้ามลบสินค้าถ้ามีประวัติสั่งซื้อแล้ว)
                  </span>
                </div>
              </div>

              <p class="text-xs text-slate-600 pl-8">กด <strong>Save</strong> เพื่อบันทึกตารางคำสั่งซื้อ</p>
            </div>
          </div>

          <div class="lg:col-span-5 flex flex-col space-y-4">
            <div class="rounded-2xl bg-slate-950 border border-slate-800 text-white p-5 font-mono text-xs flex flex-col justify-between shadow-xl">
              <div>
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span class="text-indigo-400 font-bold flex items-center gap-1.5">
                    <Terminal class="w-4 h-4" /> CREATE TABLE SQL:
                  </span>
                  <button
                    @click="copyText(`CREATE TABLE orders (\n  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  order_no VARCHAR(30) NOT NULL UNIQUE,\n  customer_name VARCHAR(100) NOT NULL,\n  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,\n  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),\n  order_date TIMESTAMPTZ DEFAULT NOW(),\n  status VARCHAR(30) DEFAULT 'PAID'\n);`, 'sql_ord')"
                    class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy class="w-3.5 h-3.5" />
                    <span>{{ copiedSnippet === 'sql_ord' ? 'คัดลอกแล้ว ✓' : 'Copy SQL' }}</span>
                  </button>
                </div>
                <pre class="overflow-x-auto text-indigo-300 leading-relaxed text-[11px]"><code>CREATE TABLE orders (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  -- Foreign Key ชี้หา products(id)
  product_id BIGINT NOT NULL
    REFERENCES products(id)
    ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(30) DEFAULT 'PAID'
);</code></pre>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
                🧾 ตาราง <code>orders</code> เป็นตารางลูกที่สมบูรณ์ สามารถ JOIN ย้อนกลับไปยัง <code>products</code> และทะลุต่อไปยัง <code>categories</code> ได้ทันที
              </div>
            </div>

            <!-- Sample Insert SQL -->
            <div class="rounded-2xl bg-slate-900 border border-slate-800 text-white p-4 font-mono text-xs space-y-2">
              <div class="flex items-center justify-between text-slate-300 text-[11px]">
                <span class="text-indigo-400 font-bold">INSERT INTO orders:</span>
                <button
                  @click="copyText(`INSERT INTO orders (order_no, customer_name, product_id, quantity, status) VALUES\n('ORD-2026-001', 'กิตติภพ สายประกอบคอม', 1, 1, 'PAID'),\n('ORD-2026-002', 'พิมพ์ชนก เกมเมอร์โปร', 2, 1, 'PAID'),\n('ORD-2026-003', 'กิตติภพ สายประกอบคอม', 3, 2, 'PAID');`, 'sql_ins_ord')"
                  class="text-[10px] text-slate-400 hover:text-white"
                >
                  {{ copiedSnippet === 'sql_ins_ord' ? 'คัดลอกแล้ว' : 'คัดลอกข้อมูล' }}
                </button>
              </div>
              <pre class="overflow-x-auto text-slate-300 text-[10px] leading-relaxed"><code>INSERT INTO orders (order_no, customer_name, product_id, quantity, status) VALUES
('ORD-2026-001', 'กิตติภพ สายประกอบคอม', 1, 1, 'PAID'),
('ORD-2026-002', 'พิมพ์ชนก เกมเมอร์โปร', 2, 1, 'PAID'),
('ORD-2026-003', 'กิตติภพ สายประกอบคอม', 3, 2, 'PAID');</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 4: เจาะลึกการเขียนคำสั่ง SQL JOIN (THEORY & BLUEPRINTS)-->
    <!-- ============================================================== -->
    <section class="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-indigo-500/40 shadow-2xl space-y-10">
      <!-- Section Header -->
      <div class="border-b border-indigo-500/30 pb-6 space-y-2">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-500/40">
            Topic 4 • Comprehensive SQL JOIN Masterclass
          </span>
          <span class="text-xs text-indigo-400/80 font-bold">• ทฤษฎี ไวยากรณ์ และรูปแบบการใช้งานจริง</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-black text-white flex items-center gap-3">
          <Layers class="w-8 h-8 text-indigo-400 shrink-0" />
          เจาะลึกคำสั่ง SQL JOIN: ศิลปะการรวมข้อมูลจากหลายตาราง
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          เมื่อตารางในฐานข้อมูลถูกออกแบบแยกออกจากกันตามหลัก Relational Database คำถามคือ
          <strong class="text-indigo-300">"เราจะนำข้อมูลเหล่านั้นกลับมาแสดงผลร่วมกันเป็นรายงานชิ้นเดียวได้อย่างไร?"</strong>
          คำตอบคือคำสั่ง <code class="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded">JOIN</code> ซึ่งเป็นหนึ่งในคำสั่งที่สำคัญที่สุดของนักพัฒนาฐานข้อมูลทุกคน
        </p>
      </div>

      <!-- ============================================================== -->
      <!-- PART 1: คำสั่ง JOIN คืออะไร และใช้ทำอะไร? (DEFINITION & PURPOSE) -->
      <!-- ============================================================== -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">1</span>
          <div>
            <h3 class="text-xl sm:text-2xl font-black text-white">คำสั่ง SQL JOIN คืออะไร และใช้ทำอะไร?</h3>
            <p class="text-xs text-indigo-300">ความหมาย วัตถุประสงค์ และทำไมระบบฐานข้อมูลจึงขาด JOIN ไม่ได้</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Card 1: นิยาม -->
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-white text-base">นิยามของ SQL JOIN</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              คำสั่ง <code class="text-emerald-400 font-bold font-mono">JOIN</code> คือคำสั่งในภาษา SQL ที่ใช้สำหรับ <strong>รวมแถวข้อมูล (Rows) จากสองตารางขึ้นไปเข้าด้วยกัน</strong> เป็นชุดผลลัพธ์เดียว โดยอาศัยคอลัมน์ที่มีค่าตรงกัน (Related Column) ซึ่งมักจะเป็นคู่ของ <strong class="text-amber-300">Primary Key (PK)</strong> และ <strong class="text-cyan-300">Foreign Key (FK)</strong>
            </p>
          </div>

          <!-- Card 2: ทำไมต้อง JOIN -->
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div class="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Network class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-white text-base">ทำไมถึงต้องมี JOIN?</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              เพราะตามกฎ <strong>Database Normalization</strong> เราจำเป็นต้องแยกตารางเพื่อไม่ให้เก็บข้อมูลซ้ำซ้อน เช่น ไม่เขียนชื่อลูกค้าซ้ำในทุกบรรทัดสินค้า แต่เก็บเป็น <code>customer_id: 1</code> แทน และเมื่อถึงเวลาออกใบเสร็จ เราจึงใช้ <strong class="text-sky-300">JOIN เป็นสะพานดึงชื่อลูกค้ากลับมารวมกับบิล</strong>
            </p>
          </div>

          <!-- Card 3: ปัญหาถ้าไม่ใช้ JOIN -->
          <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div class="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-white text-base">ปัญหาหากไม่ใช้ JOIN</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              หากไม่มี JOIN โปรแกรมเมอร์จะต้องเขียนโค้ดหลังบ้านไปยิง Query ตารางที่หนึ่ง แล้วเอา ID แต่ละแถววนลูปไปยิง Query ตารางที่สองทีละแถว (เกิดปัญหา <strong>N+1 Query Problem</strong>) ทำให้เซิร์ฟเวอร์ทำงานหนักและโหลดหน้าเว็บช้าลงมหาศาล
            </p>
          </div>
        </div>

        <!-- Before & After Visual Comparison Box -->
        <div class="p-5 sm:p-6 rounded-2xl bg-black/50 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <span class="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Eye class="w-4 h-4 text-indigo-400" />
              ภาพเปรียบเทียบ: ก่อนใช้ JOIN vs หลังใช้ JOIN ในระบบ Smart IT Store
            </span>
            <span class="text-[11px] text-slate-400 font-mono">Visual Difference</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
            <!-- Left: Before JOIN -->
            <div class="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
              <div class="flex items-center justify-between text-rose-300 font-bold border-b border-rose-500/30 pb-1.5 font-sans">
                <span>❌ ก่อน JOIN (เปิดดูตาราง products เดี่ยวๆ)</span>
                <span class="text-[10px] bg-rose-900/80 px-2 py-0.5 rounded text-rose-200">มนุษย์อ่านไม่รู้เรื่อง</span>
              </div>
              <div class="text-[11px] text-slate-300 space-y-1">
                <div>• id: 101 | product_name: 'Core i5-14500' | <span class="text-amber-300 font-bold">category_id: 1</span></div>
                <div>• id: 102 | product_name: 'RTX 4060 8GB' | <span class="text-amber-300 font-bold">category_id: 2</span></div>
              </div>
              <p class="text-[11px] text-rose-300/90 font-sans pt-1">
                ⚠️ ปัญหา: ผู้ใช้ไม่รู้ว่า <code>category_id: 1</code> หรือ <code>2</code> คือหมวดหมู่อะไร ต้องเปิดตาราง categories มานั่งเทียบด้วยตนเอง
              </p>
            </div>

            <!-- Right: After JOIN -->
            <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <div class="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-500/30 pb-1.5 font-sans">
                <span>✅ หลังใช้ INNER JOIN (รวม products + categories)</span>
                <span class="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200">เป็นรายงานสมบูรณ์</span>
              </div>
              <div class="text-[11px] text-slate-200 space-y-1">
                <div>• 'Core i5-14500' ➔ <span class="text-emerald-400 font-bold">'หน่วยประมวลผล (Processors)'</span> (CAT-CPU)</div>
                <div>• 'RTX 4060 8GB' ➔ <span class="text-emerald-400 font-bold">'การ์ดจอแสดงผล (Graphics Cards)'</span> (CAT-GPU)</div>
              </div>
              <p class="text-[11px] text-emerald-300/90 font-sans pt-1">
                🎉 ประโยชน์: ดึงข้อมูลชื่อหมวดหมู่ออกมาประกบคู่กับสินค้าได้ทันทีในคำสั่งเดียว แสดงผลบนหน้าเว็บหรือพิมพ์รายงานได้ทันที
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-indigo-500/20" />

      <!-- ============================================================== -->
      <!-- PART 2: มีโครงสร้างไวยากรณ์อย่างไร? (SYNTAX & ANATOMY)         -->
      <!-- ============================================================== -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">2</span>
          <div>
            <h3 class="text-xl sm:text-2xl font-black text-white">โครงสร้างและไวยากรณ์ (Syntax &amp; Anatomy)</h3>
            <p class="text-xs text-indigo-300">ชำแหละ 4 ชิ้นส่วนสำคัญของคำสั่ง JOIN และการตั้งชื่อย่อ Table Alias (AS)</p>
          </div>
        </div>

        <!-- Master Syntax Box -->
        <div class="p-5 sm:p-6 rounded-2xl bg-black/60 border border-indigo-500/40 font-mono text-xs text-slate-200 space-y-3 shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-indigo-400 font-sans font-bold">
            <span class="flex items-center gap-1.5"><Terminal class="w-4 h-4" /> SQL JOIN Blueprint: โครงสร้างแม่แบบมาตรฐาน</span>
            <span>ANSI SQL Standard</span>
          </div>

          <pre class="overflow-x-auto text-amber-300 leading-relaxed text-xs sm:text-sm"><code><span class="text-purple-400 font-bold">SELECT</span>
    <span class="text-sky-300">table_A</span>.<span class="text-slate-200">column1</span>,
    <span class="text-sky-300">table_A</span>.<span class="text-slate-200">column2</span>,
    <span class="text-emerald-300">table_B</span>.<span class="text-slate-200">column_name</span>
<span class="text-purple-400 font-bold">FROM</span> <span class="text-sky-300">table_A</span>                          <span class="text-slate-500">-- 1. ตารางตั้งต้น (Left / Base Table)</span>
<span class="text-purple-400 font-bold">[INNER | LEFT | RIGHT | FULL] JOIN</span> <span class="text-emerald-300">table_B</span> <span class="text-slate-500">-- 2. ชนิดการเชื่อม &amp; ตารางที่สอง (Right Table)</span>
    <span class="text-purple-400 font-bold">ON</span> <span class="text-sky-300">table_A</span>.<span class="text-amber-400">primary_key</span> = <span class="text-emerald-300">table_B</span>.<span class="text-cyan-400">foreign_key</span> <span class="text-slate-500">-- 3. เงื่อนไขการประกบคู่ (Join Condition)</span>
<span class="text-purple-400 font-bold">WHERE</span> <span class="text-slate-200">...</span>                              <span class="text-slate-500">-- 4. กรองข้อมูลตามเงื่อนไข (Optional)</span>
<span class="text-purple-400 font-bold">ORDER BY</span> <span class="text-slate-200">...</span>;                          <span class="text-slate-500">-- 5. จัดเรียงลำดับผลลัพธ์</span></code></pre>
        </div>

        <!-- 4 Key Components Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <!-- Component 1: SELECT -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">1. SELECT</span>
            <h5 class="font-bold text-white text-sm">การเลือกคอลัมน์</h5>
            <p class="text-slate-300 leading-relaxed text-[11px]">
              ระบุว่าต้องการดึงฟิลด์ใดออกมาบ้าง แนะนำให้ระบุ <code class="text-sky-300 font-mono">ชื่อตาราง.คอลัมน์</code> เพื่อป้องกันปัญหา <em>Ambiguous column</em> หากทั้งสองตารางมีชื่อคอลัมน์ซ้ำกัน เช่น <code>id</code>
            </p>
          </div>

          <!-- Component 2: FROM -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">2. FROM</span>
            <h5 class="font-bold text-white text-sm">ตารางตั้งต้น (Left Table)</h5>
            <p class="text-slate-300 leading-relaxed text-[11px]">
              ตารางแรกที่วางไว้หลัง <code>FROM</code> จะถือเป็น <strong>"ตารางซ้าย (Left Table)"</strong> ซึ่งมีความสำคัญมากเวลาใช้คำสั่ง <code>LEFT JOIN</code>
            </p>
          </div>

          <!-- Component 3: JOIN -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">3. JOIN</span>
            <h5 class="font-bold text-white text-sm">ตารางที่นำมาประกอบ</h5>
            <p class="text-slate-300 leading-relaxed text-[11px]">
              ระบุตารางที่สอง (Right Table) พร้อมเลือกประเภทของการเชื่อม เช่น <code>INNER JOIN</code> หรือ <code>LEFT JOIN</code>
            </p>
          </div>

          <!-- Component 4: ON -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">4. ON</span>
            <h5 class="font-bold text-white text-sm">เงื่อนไขการจับคู่ (Condition)</h5>
            <p class="text-slate-300 leading-relaxed text-[11px]">
              <strong>หัวใจสำคัญที่สุด!</strong> กำหนดว่าแถวจากตารางซ้ายจะจับคู่กับตารางขวาเมื่อใด โดยเขียนคู่ <code class="text-amber-300 font-mono">PK = FK</code> เช่น <code>p.category_id = c.id</code>
            </p>
          </div>
        </div>

        <!-- Table Aliasing (AS) & Multi-Table Chaining Guide -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
          <!-- Aliasing Box -->
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div class="flex items-center gap-2 text-indigo-300 font-bold font-sans">
              <Zap class="w-4 h-4 text-amber-400" />
              <span>การใช้ Table Alias (AS) ย่อชื่อตารางให้เขียนง่าย</span>
            </div>
            <p class="text-slate-300 font-sans text-[11px] leading-relaxed">
              แทนที่จะเขียนชื่อยาวๆ อย่าง <code>products.product_name</code> เราสามารถใช้คีย์เวิร์ด <code>AS</code> (หรือเว้นวรรค) เพื่อตั้งชื่อย่อได้:
            </p>
            <pre class="p-3 rounded-xl bg-black/60 text-emerald-300 text-[11px] overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> p.product_name, c.category_name
<span class="text-purple-400">FROM</span> products <span class="text-amber-300 font-bold">AS p</span>
<span class="text-purple-400">INNER JOIN</span> categories <span class="text-amber-300 font-bold">AS c</span>
  <span class="text-purple-400">ON</span> p.category_id = c.id;</code></pre>
          </div>

          <!-- Multi-Table Chaining Box -->
          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div class="flex items-center gap-2 text-indigo-300 font-bold font-sans">
              <FolderTree class="w-4 h-4 text-sky-400" />
              <span>การ JOIN ต่อกันมากกว่า 2 ตาราง (Multi-Table Chaining)</span>
            </div>
            <p class="text-slate-300 font-sans text-[11px] leading-relaxed">
              เราสามารถเขียนคำสั่ง <code>JOIN ... ON</code> ซ้อนต่อกันกี่ชั้นก็ได้ โดยฐานข้อมูลจะประมวลผลเชื่อมต่อกันทีละคู่ตามลำดับ:
            </p>
            <pre class="p-3 rounded-xl bg-black/60 text-sky-300 text-[11px] overflow-x-auto leading-relaxed"><code><span class="text-purple-400">FROM</span> order_items oi
<span class="text-purple-400">JOIN</span> orders o <span class="text-purple-400">ON</span> oi.order_id = o.id         <span class="text-slate-500">-- ต่อที่ 1</span>
<span class="text-purple-400">JOIN</span> customers cu <span class="text-purple-400">ON</span> o.customer_id = cu.id    <span class="text-slate-500">-- ต่อที่ 2</span>
<span class="text-purple-400">JOIN</span> products p <span class="text-purple-400">ON</span> oi.product_id = p.id       <span class="text-slate-500">-- ต่อที่ 3</span>
<span class="text-purple-400">JOIN</span> categories cat <span class="text-purple-400">ON</span> p.category_id = cat.id <span class="text-slate-500">-- ต่อที่ 4</span></code></pre>
          </div>
        </div>
      </div>

      <hr class="border-indigo-500/20" />

      <!-- ============================================================== -->
      <!-- PART 3: รูปแบบการ JOIN ทั้งหมด (TYPES OF SQL JOIN)             -->
      <!-- ============================================================== -->
      <div class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">3</span>
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-white">รูปแบบการ JOIN ทั้งหมด (Types of SQL JOIN)</h3>
              <p class="text-xs text-indigo-300">สำรวจ 5 รูปแบบการรวมตาราง พร้อมแผนภาพเซต Venn Diagram และตัวอย่างการใช้งาน</p>
            </div>
          </div>

          <!-- Join Types Tabs -->
          <div class="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              v-for="jt in [
                { id: 'inner', label: '1. INNER JOIN', color: 'bg-emerald-500' },
                { id: 'left', label: '2. LEFT JOIN', color: 'bg-sky-500' },
                { id: 'right', label: '3. RIGHT JOIN', color: 'bg-indigo-500' },
                { id: 'full', label: '4. FULL JOIN', color: 'bg-purple-500' },
                { id: 'cross', label: '5. CROSS JOIN', color: 'bg-amber-500' }
              ]"
              :key="jt.id"
              @click="activeJoinType = jt.id"
              class="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
              :class="activeJoinType === jt.id ? `${jt.color} text-slate-950 font-black shadow-md scale-102` : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              {{ jt.label }}
            </button>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- JOIN TYPE 1: INNER JOIN                                      -->
        <!-- ============================================================ -->
        <div v-if="activeJoinType === 'inner'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <!-- Venn Diagram Column -->
          <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-emerald-500/30 text-center space-y-3">
            <div class="text-xs font-mono font-bold text-emerald-300 uppercase">Venn Diagram: Intersection (A ∩ B)</div>
            <svg width="220" height="140" viewBox="0 0 220 140" class="overflow-visible">
              <defs>
                <clipPath id="inner-clip-left"><circle cx="85" cy="70" r="50" /></clipPath>
              </defs>
              <!-- Circle A (Left Table) -->
              <circle cx="85" cy="70" r="50" fill="rgba(30, 41, 59, 0.6)" stroke="#64748b" stroke-width="2" />
              <!-- Circle B (Right Table) -->
              <circle cx="135" cy="70" r="50" fill="rgba(30, 41, 59, 0.6)" stroke="#64748b" stroke-width="2" />
              <!-- Intersecting Area (Highlighed Emerald) -->
              <circle cx="135" cy="70" r="50" fill="#10b981" fill-opacity="0.85" clip-path="url(#inner-clip-left)" />
              <!-- Labels -->
              <text x="55" y="75" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">ตาราง A</text>
              <text x="165" y="75" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">ตาราง B</text>
              <text x="110" y="74" text-anchor="middle" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="900">A ∩ B</text>
            </svg>
            <div class="text-[11px] text-emerald-300 font-medium">
              ดึงเฉพาะแถวที่มีค่าในเงื่อนไข <code class="font-bold">ON</code> ตรงกันทั้งสองฝั่งเท่านั้น
            </div>
          </div>

          <!-- Description & Code Column -->
          <div class="lg:col-span-8 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">รูปแบบพื้นฐานที่สุด (Default JOIN)</span>
                <span class="text-xs text-slate-400">ใช้บ่อยที่สุด 90% ของงานจริง</span>
              </div>
              <h4 class="text-xl font-black text-white">INNER JOIN: การเชื่อมข้อมูลเฉพาะส่วนที่มีคู่ตรงกัน</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                จะนำแถวจากตารางซ้ายและขวามาประกบคู่กัน <strong>เฉพาะเมื่อค่าในคอลัมน์ที่เชื่อมกันมีอยู่จริงในทั้งสองตาราง</strong> หากแถวใดในตารางหนึ่งไม่มีข้อมูลคู่ตรงกันในอีกตารางหนึ่ง แถวนั้นจะถูกตัดทิ้งไม่นำมาแสดงผล
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-emerald-300 space-y-2">
              <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                <span>SQL Example: ดึงสินค้าคู่กับชื่อหมวดหมู่</span>
                <span class="text-emerald-400">INNER JOIN</span>
              </div>
              <pre class="overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> p.id, p.product_name, p.price, c.category_name
<span class="text-purple-400">FROM</span> products p
<span class="text-emerald-400 font-bold">INNER JOIN</span> categories c <span class="text-purple-400">ON</span> p.category_id = c.id;</code></pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
              <Lightbulb class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>สถานการณ์ที่ควรใช้:</strong> เมื่อต้องการรายงานเฉพาะข้อมูลที่มีความสัมพันธ์สมบูรณ์ เช่น "รายการสั่งซื้อที่มีสินค้าจริง" หรือ "สินค้าที่มีหมวดหมู่ชัดเจน"</span>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- JOIN TYPE 2: LEFT JOIN                                       -->
        <!-- ============================================================ -->
        <div v-if="activeJoinType === 'left'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-sky-500/40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <!-- Venn Diagram Column -->
          <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-sky-500/30 text-center space-y-3">
            <div class="text-xs font-mono font-bold text-sky-300 uppercase">Venn Diagram: All Left Table (A)</div>
            <svg width="220" height="140" viewBox="0 0 220 140" class="overflow-visible">
              <!-- Circle A (Full Left Highlighted Sky) -->
              <circle cx="85" cy="70" r="50" fill="#0284c7" fill-opacity="0.85" stroke="#38bdf8" stroke-width="2.5" />
              <!-- Circle B (Right Table Unhighlighted) -->
              <circle cx="135" cy="70" r="50" fill="rgba(30, 41, 59, 0.4)" stroke="#64748b" stroke-width="2" />
              <text x="65" y="75" fill="#ffffff" font-size="11" font-family="monospace" font-weight="bold">ตาราง A</text>
              <text x="165" y="75" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">ตาราง B</text>
            </svg>
            <div class="text-[11px] text-sky-300 font-medium">
              เอาทุกแถวของตารางซ้ายมาทั้งหมด หากตารางขวาไม่มีคู่จะเติม <code class="font-bold text-amber-300">NULL</code>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">LEFT OUTER JOIN</span>
                <span class="text-xs text-slate-400">จำเป็นอย่างยิ่งสำหรับงานตรวจสอบข้อมูล</span>
              </div>
              <h4 class="text-xl font-black text-white">LEFT JOIN: ยึดตารางซ้ายเป็นหลัก ข้อมูลไม่หล่นหาย</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                ดึงข้อมูล <strong>ทุกแถวจากตารางซ้าย (FROM) ออกมาทั้งหมดอย่างแน่นอน 100%</strong> แม้ว่าตารางขวา (JOIN) จะไม่มีข้อมูลที่ตรงกับเงื่อนไขเลยก็ตาม โดยคอลัมน์ของตารางขวาในแถวนั้นจะถูกแสดงเป็นค่า <code class="text-amber-300 font-bold">NULL</code>
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-sky-300 space-y-2">
              <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                <span>SQL Example: ดึงหมวดหมู่ทั้งหมด แม้หมวดนั้นยังไม่มีสินค้าชิ้นใดลงขายเลย</span>
                <span class="text-sky-400">LEFT JOIN</span>
              </div>
              <pre class="overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> c.category_name, p.product_name, p.price
<span class="text-purple-400">FROM</span> categories c
<span class="text-sky-400 font-bold">LEFT JOIN</span> products p <span class="text-purple-400">ON</span> c.id = p.category_id;</code></pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
              <Lightbulb class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>เทคนิคระดับเซียน:</strong> หากต้องการค้นหาว่า <em>"หมวดหมู่ไหนที่ยังไม่มีสินค้าลงขายเลย?"</em> ให้ใช้ <code>LEFT JOIN</code> แล้วตามด้วย <code>WHERE p.id IS NULL</code> จะได้คำตอบทันที!</span>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- JOIN TYPE 3: RIGHT JOIN                                      -->
        <!-- ============================================================ -->
        <div v-if="activeJoinType === 'right'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-indigo-500/30 text-center space-y-3">
            <div class="text-xs font-mono font-bold text-indigo-300 uppercase">Venn Diagram: All Right Table (B)</div>
            <svg width="220" height="140" viewBox="0 0 220 140" class="overflow-visible">
              <circle cx="85" cy="70" r="50" fill="rgba(30, 41, 59, 0.4)" stroke="#64748b" stroke-width="2" />
              <circle cx="135" cy="70" r="50" fill="#6366f1" fill-opacity="0.85" stroke="#818cf8" stroke-width="2.5" />
              <text x="55" y="75" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">ตาราง A</text>
              <text x="145" y="75" fill="#ffffff" font-size="11" font-family="monospace" font-weight="bold">ตาราง B</text>
            </svg>
            <div class="text-[11px] text-indigo-300 font-medium">
              เอาทุกแถวของตารางขวามาทั้งหมด หากตารางซ้ายไม่มีคู่จะเติม <code class="font-bold text-amber-300">NULL</code>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">RIGHT OUTER JOIN</span>
                <span class="text-xs text-slate-400">มุมมองตรงข้ามกับ LEFT JOIN</span>
              </div>
              <h4 class="text-xl font-black text-white">RIGHT JOIN: ยึดตารางขวาเป็นหลัก</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                การทำงานเหมือนกับ <code>LEFT JOIN</code> ทุกประการ แต่เปลี่ยนเป็น <strong>ยึดตารางขวา (ตารางหลังคำว่า JOIN) เป็นหลัก</strong> และหากตารางซ้ายไม่มีคู่จะเติม <code>NULL</code> ให้ตารางซ้าย
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-indigo-300 space-y-2">
              <pre class="overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> p.product_name, c.category_name
<span class="text-purple-400">FROM</span> products p
<span class="text-indigo-400 font-bold">RIGHT JOIN</span> categories c <span class="text-purple-400">ON</span> p.category_id = c.id;</code></pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
              <Info class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>ข้อแนะนำในอุตสาหกรรม:</strong> โปรแกรมเมอร์ส่วนใหญ่เลือกที่จะ <em>ไม่ใช้ RIGHT JOIN</em> แต่จะใช้วิธีสลับลำดับชื่อตารางแล้วเขียนเป็น <code>LEFT JOIN</code> แทน เพื่อให้อ่านโค้ดจากซ้ายไปขวาได้อย่างเป็นธรรมชาติและไม่งง</span>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- JOIN TYPE 4: FULL OUTER JOIN                                 -->
        <!-- ============================================================ -->
        <div v-if="activeJoinType === 'full'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-purple-500/30 text-center space-y-3">
            <div class="text-xs font-mono font-bold text-purple-300 uppercase">Venn Diagram: Union All (A ∪ B)</div>
            <svg width="220" height="140" viewBox="0 0 220 140" class="overflow-visible">
              <circle cx="85" cy="70" r="50" fill="#8b5cf6" fill-opacity="0.85" stroke="#a78bfa" stroke-width="2" />
              <circle cx="135" cy="70" r="50" fill="#a855f7" fill-opacity="0.85" stroke="#c084fc" stroke-width="2" />
              <text x="65" y="75" fill="#ffffff" font-size="11" font-family="monospace" font-weight="bold">ตาราง A</text>
              <text x="145" y="75" fill="#ffffff" font-size="11" font-family="monospace" font-weight="bold">ตาราง B</text>
            </svg>
            <div class="text-[11px] text-purple-300 font-medium">
              เอาข้อมูลทั้งหมดจากทั้งสองฝั่ง หากฝั่งใดไม่มีคู่จะเติม <code class="font-bold text-amber-300">NULL</code>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">FULL OUTER JOIN</span>
                <span class="text-xs text-slate-400">การรวมเซตข้อมูลแบบสมบูรณ์</span>
              </div>
              <h4 class="text-xl font-black text-white">FULL OUTER JOIN: รวมข้อมูลทั้งหมดจากทั้งสองฝั่ง</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                เป็นการนำผลลัพธ์ของ <code>LEFT JOIN</code> มารวมกับ <code>RIGHT JOIN</code> นั่นคือ <strong>ดึงทุกแถวจากทั้งสองตารางออกมาทั้งหมด</strong> แถวที่มีคู่ตรงกันก็จะประกบกัน ส่วนแถวที่ฝั่งใดฝั่งหนึ่งไม่มีคู่ ก็จะแสดงผลโดยเติมค่า <code>NULL</code> ให้กับคอลัมน์ของฝั่งที่ขาดหายไป
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-purple-300 space-y-2">
              <pre class="overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> c.category_name, p.product_name
<span class="text-purple-400">FROM</span> categories c
<span class="text-purple-400 font-bold">FULL OUTER JOIN</span> products p <span class="text-purple-400">ON</span> c.id = p.category_id;</code></pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>การใช้งานจริง:</strong> นิยมใช้ในงาน <em>Data Audit &amp; Reconciliation</em> หรือการตรวจสอบความสมบูรณ์ของข้อมูลสองระบบว่ามีข้อมูลฝั่งใดที่ไม่มีคู่ตรงกันบ้าง</span>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- JOIN TYPE 5: CROSS JOIN                                      -->
        <!-- ============================================================ -->
        <div v-if="activeJoinType === 'cross'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-amber-500/30 text-center space-y-3">
            <div class="text-xs font-mono font-bold text-amber-300 uppercase">Cartesian Product (M × N)</div>
            <div class="p-4 rounded-xl bg-slate-800/80 border border-amber-500/30 font-mono text-xs text-amber-300">
              <span class="text-slate-400 block mb-1">ตาราง A (3 แถว) × ตาราง B (4 แถว)</span>
              <span class="text-lg font-black text-amber-400">= 12 แถวผลลัพธ์</span>
            </div>
            <div class="text-[11px] text-amber-300/90 font-medium">
              จับคู่ไขว้กันทุกแถวแบบครบทุกกรณี <strong>(ไม่ต้องมีคำสั่ง ON)</strong>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">CARTESIAN PRODUCT</span>
                <span class="text-xs text-slate-400">การจับคู่ทุกความเป็นไปได้</span>
              </div>
              <h4 class="text-xl font-black text-white">CROSS JOIN: ผลคูณคาร์ทีเซียน จับคู่ทุกแถว</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                นำทุกแถวของตารางซ้ายไปจับคู่กับทุกแถวของตารางขวาอย่างไม่มีเงื่อนไข หากตารางซ้ายมี $M$ แถว และตารางขวามี $N$ แถว ผลลัพธ์ที่ได้จะมีจำนวนทั้งหมดเท่ากับ <strong class="text-amber-400">$M \times N$ แถว</strong>
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-black/70 border border-slate-800 font-mono text-xs text-amber-300 space-y-2">
              <pre class="overflow-x-auto leading-relaxed"><code><span class="text-purple-400">SELECT</span> size.name, color.name
<span class="text-purple-400">FROM</span> sizes size
<span class="text-amber-400 font-bold">CROSS JOIN</span> colors color;</code></pre>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
              <AlertTriangle class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span><strong>ข้อควรระวัง:</strong> ห้ามใช้ <code>CROSS JOIN</code> กับตารางขนาดใหญ่ (เช่น 10,000 แถว × 10,000 แถว = 100 ล้านแถว!) เพราะจะทำให้หน่วยความจำเซิร์ฟเวอร์เต็มและระบบค้างได้ทันที</span>
            </div>
          </div>
        </div>

        <!-- Master Comparison Table -->
        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-800/90 text-slate-200 font-black border-b border-slate-700">
              <tr>
                <th class="p-3.5">รูปแบบ JOIN</th>
                <th class="p-3.5">สิ่งที่นำมาแสดงผล</th>
                <th class="p-3.5">ผลลัพธ์เมื่อไม่พบคู่ตรงกัน</th>
                <th class="p-3.5">ความถี่ในการใช้จริง</th>
                <th class="p-3.5">ตัวอย่างการใช้งานใน Smart IT Store</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 font-mono text-[11px]">
              <tr class="hover:bg-white/5">
                <td class="p-3.5 font-bold text-emerald-400">INNER JOIN</td>
                <td class="p-3.5 font-sans text-slate-200">เฉพาะแถวที่มีคู่ตรงกันทั้ง 2 ฝั่ง</td>
                <td class="p-3.5 font-sans text-rose-400 font-bold">ตัดแถวนั้นทิ้ง ไม่แสดง</td>
                <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">90% (ใช้บ่อยที่สุด)</span></td>
                <td class="p-3.5 font-sans text-slate-300">รายงานยอดขายสินค้าที่มีหมวดหมู่ชัดเจน</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="p-3.5 font-bold text-sky-400">LEFT JOIN</td>
                <td class="p-3.5 font-sans text-slate-200">ตารางซ้ายทั้งหมด + ตารางขวาที่มีคู่</td>
                <td class="p-3.5 font-sans text-amber-300 font-bold">เติม NULL ให้ฝั่งขวา</td>
                <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">9% (จำเป็นมาก)</span></td>
                <td class="p-3.5 font-sans text-slate-300">หาหมวดหมู่ที่ยังไม่มีสินค้าลงขาย</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="p-3.5 font-bold text-indigo-400">RIGHT JOIN</td>
                <td class="p-3.5 font-sans text-slate-200">ตารางขวาทั้งหมด + ตารางซ้ายที่มีคู่</td>
                <td class="p-3.5 font-sans text-amber-300 font-bold">เติม NULL ให้ฝั่งซ้าย</td>
                <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400">&lt; 1% (นิยมใช้ LEFT แทน)</span></td>
                <td class="p-3.5 font-sans text-slate-300">คล้าย LEFT JOIN แต่กลับทิศทางการเขียน</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="p-3.5 font-bold text-purple-400">FULL OUTER JOIN</td>
                <td class="p-3.5 font-sans text-slate-200">ทุกแถวจากทั้งสองตารางทั้งหมด</td>
                <td class="p-3.5 font-sans text-purple-300 font-bold">เติม NULL ให้ฝั่งที่ไม่มีคู่</td>
                <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">&lt; 1% (งาน Audit)</span></td>
                <td class="p-3.5 font-sans text-slate-300">กระทบยอดลูกค้าและคำสั่งซื้อทั้งหมด</td>
              </tr>
              <tr class="hover:bg-white/5">
                <td class="p-3.5 font-bold text-amber-400">CROSS JOIN</td>
                <td class="p-3.5 font-sans text-slate-200">จับคู่ไขว้ทุกแถว ($M \times N$)</td>
                <td class="p-3.5 font-sans text-slate-400">ไม่มี (เพราะไม่มีเงื่อนไข ON)</td>
                <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">&lt; 1% (สร้างชุดข้อมูล)</span></td>
                <td class="p-3.5 font-sans text-slate-300">สร้างตัวเลือกสีและขนาดสินค้าทั้งหมด</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>



    <!-- ============================================================== -->
    <!-- SECTION 5: INTERACTIVE RELATIONAL SANDBOX & JOIN RUNNER        -->
    <!-- ============================================================== -->
    <section class="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-emerald-400 uppercase tracking-wider">Topic 5 • Interactive Relational Sandbox</span>
          <h2 class="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Network class="w-7 h-7 text-emerald-400 shrink-0" />
            ห้องทดลองจำลองฐานข้อมูล Smart IT Store (3 ตาราง) &amp; ทดสอบ SQL JOIN
          </h2>
          <p class="text-xs sm:text-sm text-slate-400">
            เลือกโหมดด้านล่างเพื่อดูผลลัพธ์คำสั่ง <code>SELECT ... JOIN</code> ข้ามตาราง และทดลองจำลองคำสั่งที่ติดกฎความปลอดภัย
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            @click="activeSandboxTab = 'join_products'"
            class="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
            :class="activeSandboxTab === 'join_products' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            1. JOIN 2 ตาราง (สินค้า + หมวดหมู่)
          </button>
          <button
            @click="activeSandboxTab = 'join_orders'"
            class="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
            :class="activeSandboxTab === 'join_orders' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            2. JOIN 3 ตาราง (คำสั่งซื้อ + สินค้า + หมวดหมู่)
          </button>
          <button
            @click="activeSandboxTab = 'left_join'"
            class="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
            :class="activeSandboxTab === 'left_join' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            3. LEFT JOIN (หาสินค้าขายไม่ออก)
          </button>
          <button
            @click="activeSandboxTab = 'group_sales'"
            class="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
            :class="activeSandboxTab === 'group_sales' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            4. สรุปยอดขาย (GROUP BY)
          </button>
          <button
            @click="activeSandboxTab = 'fk_test'"
            class="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
            :class="activeSandboxTab === 'fk_test' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            5. ทดสอบกฎความปลอดภัย (Violations)
          </button>
        </div>
      </div>

      <!-- Tab 1: Products + Categories JOIN (2 Tables) -->
      <div v-if="activeSandboxTab === 'join_products'" class="space-y-4">
        <div class="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs text-emerald-300">
          SELECT p.sku, p.product_name, p.price, p.stock, c.category_name, c.category_code<br />
          FROM products p<br />
          INNER JOIN categories c ON p.category_id = c.id<br />
          ORDER BY p.id ASC;
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-800/90 text-slate-200 font-black border-b border-slate-700">
              <tr>
                <th class="p-3">p.sku</th>
                <th class="p-3">p.product_name</th>
                <th class="p-3">p.price</th>
                <th class="p-3">p.stock</th>
                <th class="p-3 text-amber-300">p.category_id (FK)</th>
                <th class="p-3 text-emerald-300">c.category_name (ดึงจากตาราง categories)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              <tr v-for="p in mockProducts" :key="p.id" class="hover:bg-white/5">
                <td class="p-3 text-sky-300 font-bold">{{ p.sku }}</td>
                <td class="p-3 font-sans font-bold text-white">{{ p.product_name }}</td>
                <td class="p-3 text-slate-200">{{ p.price.toLocaleString() }} ฿</td>
                <td class="p-3 text-slate-300">{{ p.stock }} ชิ้น</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    FK = {{ p.category_id }}
                  </span>
                </td>
                <td class="p-3 font-sans font-bold text-emerald-400">
                  {{ mockCategories.find(c => c.id === p.category_id)?.category_name }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: 3-Table Orders JOIN (orders + products + categories) -->
      <div v-if="activeSandboxTab === 'join_orders'" class="space-y-4">
        <div class="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs text-sky-300">
          SELECT o.order_no, o.customer_name, p.product_name, c.category_name, p.price, o.quantity, (p.price * o.quantity) AS total_amount, o.order_date, o.status<br />
          FROM orders o<br />
          INNER JOIN products p ON o.product_id = p.id<br />
          INNER JOIN categories c ON p.category_id = c.id<br />
          ORDER BY o.id ASC;
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-800/90 text-slate-200 font-black border-b border-slate-700">
              <tr>
                <th class="p-3">เลขที่สั่งซื้อ (order_no)</th>
                <th class="p-3">ชื่อลูกค้า (customer_name)</th>
                <th class="p-3">ชื่อสินค้า (product_name)</th>
                <th class="p-3">หมวดหมู่ (category_name)</th>
                <th class="p-3">จำนวน</th>
                <th class="p-3">ราคา/หน่วย</th>
                <th class="p-3 text-emerald-300">ยอดรวม (total_amount)</th>
                <th class="p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="row in mock3TableOrdersJoin" :key="row.id" class="hover:bg-white/5">
                <td class="p-3 font-mono font-bold text-sky-300">{{ row.order_no }}</td>
                <td class="p-3 font-bold text-white">{{ row.customer_name }}</td>
                <td class="p-3 text-slate-200">{{ row.product_name }}</td>
                <td class="p-3 text-slate-400 text-[11px]">{{ row.category_name }}</td>
                <td class="p-3 font-mono text-amber-300">{{ row.quantity }} ชิ้น</td>
                <td class="p-3 font-mono text-slate-300">{{ row.price.toLocaleString() }} ฿</td>
                <td class="p-3 font-mono font-black text-emerald-400">{{ row.subtotal.toLocaleString() }} ฿</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {{ row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: LEFT JOIN Unsold Products -->
      <div v-if="activeSandboxTab === 'left_join'" class="space-y-4">
        <div class="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs text-amber-300">
          SELECT p.sku, p.product_name, p.price, p.stock, c.category_name<br />
          FROM products p<br />
          INNER JOIN categories c ON p.category_id = c.id<br />
          LEFT JOIN orders o ON p.id = o.product_id<br />
          WHERE o.id IS NULL;
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-800/90 text-slate-200 font-black border-b border-slate-700">
              <tr>
                <th class="p-3">รหัสสินค้า (SKU)</th>
                <th class="p-3">ชื่อสินค้า</th>
                <th class="p-3">ราคา</th>
                <th class="p-3">คงเหลือในคลัง</th>
                <th class="p-3">หมวดหมู่</th>
                <th class="p-3 text-rose-300">สถานะคำสั่งซื้อ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              <tr v-for="p in mockUnsoldProducts" :key="p.id" class="hover:bg-white/5">
                <td class="p-3 text-sky-300 font-bold">{{ p.sku }}</td>
                <td class="p-3 font-sans font-bold text-white">{{ p.product_name }}</td>
                <td class="p-3 text-slate-200">{{ p.price.toLocaleString() }} ฿</td>
                <td class="p-3 text-amber-300">{{ p.stock }} ชิ้น</td>
                <td class="p-3 font-sans text-slate-400">{{ p.category_name }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    NULL (ยังไม่มียอดสั่งซื้อ)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: Sales Summary (GROUP BY) -->
      <div v-if="activeSandboxTab === 'group_sales'" class="space-y-4">
        <div class="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs text-purple-300">
          SELECT c.category_name, SUM(o.quantity) AS total_units, SUM(p.price * o.quantity) AS total_revenue<br />
          FROM orders o<br />
          INNER JOIN products p ON o.product_id = p.id<br />
          INNER JOIN categories c ON p.category_id = c.id<br />
          GROUP BY c.id, c.category_name<br />
          ORDER BY total_revenue DESC;
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-800/90 text-slate-200 font-black border-b border-slate-700">
              <tr>
                <th class="p-3">ชื่อหมวดหมู่สินค้า</th>
                <th class="p-3">จำนวนชิ้นที่ขายได้รวม</th>
                <th class="p-3 text-emerald-300">ยอดขายรวมทั้งหมด (Revenue)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="(row, idx) in mockSalesSummary" :key="idx" class="hover:bg-white/5">
                <td class="p-3 font-bold text-white">{{ row.category_name }}</td>
                <td class="p-3 font-mono text-amber-300 font-bold">{{ row.total_units }} ชิ้น</td>
                <td class="p-3 font-mono font-black text-emerald-400 text-sm">{{ row.total_revenue.toLocaleString() }} บาท</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 5: Referential Integrity Test -->
      <div v-if="activeSandboxTab === 'fk_test'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            @click="triggerFkTest('invalid_insert')"
            class="p-4 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-700/60 text-left space-y-1 cursor-pointer transition-all"
          >
            <div class="text-xs font-black text-rose-300">สถานการณ์ที่ 1</div>
            <div class="text-sm font-bold text-white">INSERT สินค้าที่ใส่ category_id = 999 (ไม่มีในตารางแม่)</div>
          </button>

          <button
            @click="triggerFkTest('restrict_delete')"
            class="p-4 rounded-2xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/60 text-left space-y-1 cursor-pointer transition-all"
          >
            <div class="text-xs font-black text-amber-300">สถานการณ์ที่ 2</div>
            <div class="text-sm font-bold text-white">DELETE หมวดหมู่ id = 1 ที่มีสินค้าอ้างอิงอยู่ (ON DELETE RESTRICT)</div>
          </button>

          <button
            @click="triggerFkTest('order_fk_violation')"
            class="p-4 rounded-2xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/60 text-left space-y-1 cursor-pointer transition-all"
          >
            <div class="text-xs font-black text-purple-300">สถานการณ์ที่ 3</div>
            <div class="text-sm font-bold text-white">INSERT คำสั่งซื้อที่ใส่ product_id = 888 (สินค้าไม่มีจริง)</div>
          </button>
        </div>

        <div
          class="p-5 rounded-2xl border space-y-2"
          :class="[
            fkTestResult.status === 'error' ? 'bg-rose-950/40 border-rose-700 text-rose-200' :
            fkTestResult.status === 'success' ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' :
            'bg-black/50 border-slate-800 text-slate-300'
          ]"
        >
          <div class="font-mono text-xs px-3 py-1.5 rounded bg-black/60 text-slate-200 overflow-x-auto">
            {{ fkTestResult.sql }}
          </div>
          <h4 class="font-black text-sm sm:text-base">{{ fkTestResult.title }}</h4>
          <p class="text-xs sm:text-sm opacity-90 leading-relaxed">{{ fkTestResult.detail }}</p>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 6: การตรวจสอบด้วย SCHEMA VISUALIZER                     -->
    <!-- ============================================================== -->
    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div class="space-y-1">
          <span class="text-xs font-black text-teal-600 uppercase tracking-wider">Topic 6 • Visual Validation</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Eye class="w-7 h-7 text-teal-600 shrink-0" />
            การเปิดและจัดเรียงแผนภาพใน Supabase Schema Visualizer
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-7 space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            หนึ่งในฟีเจอร์ที่ทรงพลังที่สุดของ <strong>Supabase</strong> คือ <strong>Schema Visualizer</strong> ซึ่งเป็นเครื่องมือวาดไดอะแกรม ER Diagram แสดงตารางและเส้นเชื่อมโยงความสัมพันธ์ของ Foreign Key โดยอัตโนมัติ
          </p>

          <div class="space-y-2.5">
            <div class="font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              วิธีเปิด Schema Visualizer:
            </div>
            <p class="text-xs sm:text-sm text-slate-600 pl-8">
              ที่แถบเมนูด้านซ้ายสุด ให้คลิกที่ไอคอน <strong>Database</strong> (ไอคอนทรงกระบอก) ➔ จากนั้นคลิกเมนูย่อย <strong>Schema Visualizer</strong>
            </p>

            <div class="font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              วิธีตรวจสอบเส้นเชื่อมความสัมพันธ์:
            </div>
            <p class="text-xs sm:text-sm text-slate-600 pl-8">
              เมื่อเปิดหน้าต่างขึ้นมา จะเห็นกล่องตารางทั้ง 3 ตาราง ให้ใช้เมาส์<strong>คลิกลากหัวตารางเพื่อจัดเรียงตำแหน่ง</strong> โดยวาง <code>categories</code> ไว้ด้านซ้าย วาง <code>products</code> ไว้ตรงกลาง และวาง <code>orders</code> ไว้ด้านขวา จะเห็นเส้นสายโยง Foreign Key เชื่อมต่อกันครบทั้ง 2 เส้นอย่างสวยงาม
            </p>

            <div class="font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              ข้อผิดพลาดที่พบบ่อย (Troubleshooting):
            </div>
            <ul class="text-xs sm:text-sm text-slate-600 pl-12 list-disc space-y-1">
              <li><strong>ถ้าไม่เห็นเส้นโยง:</strong> แสดงว่าสร้างคอลัมน์ชื่อ <code>category_id</code> หรือ <code>product_id</code> ขึ้นมาจริง แต่ลืมกดไอคอนรูปโซ่เพื่อผูก Foreign Key หรือสร้างผ่าน SQL แล้วลืมใส่คำสั่ง <code>REFERENCES</code></li>
              <li><strong>การแก้ไข:</strong> สามารถกด Edit table ใน Table Editor แล้วกดผูกโซ่ใหม่ได้ตลอดเวลาโดยไม่ต้องลบตารางทิ้ง</li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-5 p-5 rounded-2xl bg-teal-950 text-white space-y-3 border border-teal-800 text-xs">
          <div class="text-teal-300 font-bold border-b border-teal-800 pb-2 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4" />
            Checklist 2 เส้นความสัมพันธ์ที่ต้องปรากฏ:
          </div>
          <div class="space-y-2 text-slate-200">
            <div class="p-3 rounded-lg bg-black/40 border border-teal-700/40 space-y-1">
              <div class="font-bold text-emerald-400">เส้นที่ 1: categories ➔ products (1:N)</div>
              <div class="text-[11px] text-slate-300 font-mono">categories.id ➔ products.category_id (ON DELETE RESTRICT)</div>
            </div>
            <div class="p-3 rounded-lg bg-black/40 border border-teal-700/40 space-y-1">
              <div class="font-bold text-sky-400">เส้นที่ 2: products ➔ orders (1:N)</div>
              <div class="text-[11px] text-slate-300 font-mono">products.id ➔ orders.product_id (ON DELETE RESTRICT)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SECTION 7: MINI-GAMES & POST-TEST                              -->
    <!-- ============================================================== -->
    <GameCenterSection
      :course-id="currentCourseId"
      :week="currentWeek"
      drag-title="มินิเกมที่ 1: จัดลำดับการสร้างตารางในฐานข้อมูลเชิงสัมพันธ์ (Parent ➔ Child 1 ➔ Child 2)"
      drag-subtitle="ลากตารางด้านล่างไปวางตามลำดับการสร้างที่ถูกต้องเพื่อไม่ให้เกิดข้อผิดพลาด Foreign Key (เล่นได้ครั้งเดียว)"
      :drag-items="dragItemsData"
      :drag-zones="dragZonesData"
      match-title="มินิเกมที่ 2: จับคู่คำสั่ง SQL Foreign Key & JOIN บน Supabase"
      match-subtitle="จับคู่คำสั่งและเครื่องมือด้านซ้ายกับคำอธิบายด้านขวาให้ถูกต้องครบทั้ง 5 คู่ (เล่นได้ครั้งเดียว)"
      :match-left-terms="matchLeftTerms"
      :match-right-defs="matchRightDefs"
      quiz-title="แบบทดสอบหลังเรียนสัปดาห์ที่ 5 (Hands-on Relational Database in Supabase)"
      quiz-subtitle="แบบทดสอบ 4 ตัวเลือก 10 ข้อ วัดความเข้าใจการสร้างตารางเชิงสัมพันธ์ การผูก Foreign Key และการสืบค้นข้ามตาราง"
      :quiz-questions="quizQuestions"
      :games="weekGames"
    />

    <!-- ============================================================== -->
    <!-- SECTION 8: HANDS-ON WORKSHOP & ASSIGNMENT 5                    -->
    <!-- ============================================================== -->
    <AssignmentSection
      :course-id="currentCourseId"
      assignment-id="asm-5"
      assignment-title="ใบงานที่ 5: การออกแบบและสร้างฐานข้อมูลเชิงสัมพันธ์ร้านกาแฟ (Coffee Shop) 3 ตาราง และการเขียนคำสั่ง SQL JOIN ตามสถานการณ์"
      :max-score="10"
    >
      <template #number>5</template>
      <template #description>
        <p class="leading-relaxed">
          ให้นักศึกษาลงมือสร้างฐานข้อมูลเชิงสัมพันธ์สำหรับระบบ <strong>ร้านกาแฟ (Coffee Shop) จำนวน 3 ตาราง</strong> 
          บนคลาวด์ <strong>Supabase PostgreSQL</strong> โดยกำหนดชนิดข้อมูล (Data Types) ที่เหมาะสมด้วยตนเอง 
          พร้อมผูกความสัมพันธ์ (Foreign Key) และเขียนคำสั่ง <strong>SQL JOIN</strong> เพื่อสืบค้นข้อมูลตามสถานการณ์ทางธุรกิจที่กำหนด 
          จากนั้นบันทึกคำสั่ง SQL และแคปเจอร์ภาพหน้าจอผลลัพธ์ลงใน <strong>Google Docs</strong> เพื่อแนบลิงก์ส่งงานในระบบ
        </p>
      </template>

      <template #tasks>
        <div class="space-y-6">
          <!-- ข้อที่ 1: ตารางฐานข้อมูลร้านกาแฟ 3 ตาราง -->
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <span class="text-xs font-black text-amber-700 uppercase tracking-wider">โจทย์ข้อที่ 1 • Database Schema Specification</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                บอกเฉพาะชื่อตารางและชื่อฟิลด์ (นักศึกษากำหนด Data Type เอง)
              </span>
            </div>

            <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
              <Database class="w-5 h-5 text-amber-600" />
              1. จำลองฐานข้อมูลร้านกาแฟ (Coffee Shop) จำนวน 3 ตารางที่มีความสัมพันธ์กัน
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <!-- ตารางที่ 1: categories -->
              <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded bg-amber-600 text-white font-mono font-bold text-xs">ตารางที่ 1</span>
                  <span class="text-[11px] text-amber-800 font-bold">ตารางแม่</span>
                </div>
                <div class="font-mono font-black text-base text-stone-900">categories</div>
                <div class="text-xs text-stone-600">เก็บข้อมูลหมวดหมู่สินค้า</div>
                <div class="pt-2 border-t border-amber-200/60 space-y-1 text-xs">
                  <div class="font-bold text-stone-700">รายชื่อฟิลด์ (Fields):</div>
                  <ul class="list-disc pl-4 font-mono text-stone-800 space-y-0.5">
                    <li><strong class="text-amber-800">id</strong> (Primary Key)</li>
                    <li><strong>category_name</strong> (ชื่อหมวดหมู่ เช่น Coffee, Non-Coffee, Bakery)</li>
                  </ul>
                </div>
              </div>

              <!-- ตารางที่ 2: menus -->
              <div class="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded bg-sky-600 text-white font-mono font-bold text-xs">ตารางที่ 2</span>
                  <span class="text-[11px] text-sky-800 font-bold">ตารางลูก (FK ➔ categories)</span>
                </div>
                <div class="font-mono font-black text-base text-stone-900">menus</div>
                <div class="text-xs text-stone-600">เก็บข้อมูลเมนูเครื่องดื่มและของว่าง</div>
                <div class="pt-2 border-t border-sky-200/60 space-y-1 text-xs">
                  <div class="font-bold text-stone-700">รายชื่อฟิลด์ (Fields):</div>
                  <ul class="list-disc pl-4 font-mono text-stone-800 space-y-0.5">
                    <li><strong class="text-sky-800">id</strong> (Primary Key)</li>
                    <li><strong>menu_name</strong> (ชื่อเมนู เช่น Espresso, Green Tea, Croissant)</li>
                    <li><strong>price</strong> (ราคาต่อหน่วย)</li>
                    <li><strong class="text-amber-700">category_id</strong> (Foreign Key ชี้ไป categories.id)</li>
                  </ul>
                </div>
              </div>

              <!-- ตารางที่ 3: orders -->
              <div class="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded bg-purple-600 text-white font-mono font-bold text-xs">ตารางที่ 3</span>
                  <span class="text-[11px] text-purple-800 font-bold">ตารางลูก (FK ➔ menus)</span>
                </div>
                <div class="font-mono font-black text-base text-stone-900">orders</div>
                <div class="text-xs text-stone-600">เก็บรายการสั่งซื้อของลูกค้า</div>
                <div class="pt-2 border-t border-purple-200/60 space-y-1 text-xs">
                  <div class="font-bold text-stone-700">รายชื่อฟิลด์ (Fields):</div>
                  <ul class="list-disc pl-4 font-mono text-stone-800 space-y-0.5">
                    <li><strong class="text-purple-800">id</strong> (Primary Key)</li>
                    <li><strong>order_date</strong> (วันและเวลาที่สั่งซื้อ)</li>
                    <li><strong>quantity</strong> (จำนวนที่สั่ง)</li>
                    <li><strong>total_price</strong> (ราคารวม)</li>
                    <li><strong class="text-sky-700">menu_id</strong> (Foreign Key ชี้ไป menus.id)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-stone-100 text-xs text-stone-700 leading-relaxed">
              💡 <strong>คำแนะนำ:</strong> ให้นักศึกษาเลือกชนิดข้อมูล (Data Type) ที่เหมาะสมใน Supabase เอง เช่น Primary Key ใช้ <code>int8 (BIGINT)</code> หรือ <code>UUID</code>, ราคาใช้ <code>numeric</code>, จำนวนใช้ <code>int4</code>, วันที่ใช้ <code>timestamptz</code> เป็นต้น พร้อมเพิ่มข้อมูลตัวอย่างอย่างน้อยตารางละ 3–5 รายการ
            </div>
          </div>

          <!-- ข้อที่ 2: สร้างความสัมพันธ์ และเขียนคำสั่ง JOIN ตามสถานการณ์ -->
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-5 shadow-sm">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <span class="text-xs font-black text-emerald-700 uppercase tracking-wider">โจทย์ข้อที่ 2 • Relationships & SQL JOIN Scenarios</span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                แคปผลลัพธ์ลง Google Doc พร้อมคำสั่ง
              </span>
            </div>

            <h4 class="text-base font-black text-stone-900 flex items-center gap-2">
              <Network class="w-5 h-5 text-emerald-600" />
              2. สร้างความสัมพันธ์ (Foreign Key) และเขียนคำสั่ง SQL JOIN ตาม 4 สถานการณ์ที่กำหนด
            </h4>

            <div class="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div class="font-bold text-amber-300">🔗 เส้นความสัมพันธ์ Foreign Key ที่ต้องเชื่อมโยง:</div>
              <ul class="list-disc pl-5 space-y-1 font-mono text-slate-300">
                <li>เส้นที่ 1: ฟิลด์ <code class="text-sky-300">menus.category_id</code> เชื่อมไปยัง Primary Key <code class="text-amber-300">categories.id</code> (1:N)</li>
                <li>เส้นที่ 2: ฟิลด์ <code class="text-purple-300">orders.menu_id</code> เชื่อมไปยัง Primary Key <code class="text-sky-300">menus.id</code> (1:N)</li>
              </ul>
            </div>

            <!-- 4 สถานการณ์ -->
            <div class="space-y-3 pt-2">
              <div class="text-xs font-bold text-stone-800 uppercase tracking-wider">
                สถานการณ์ที่ต้องเขียนคำสั่ง SQL JOIN (นำคำสั่งและภาพผลลัพธ์ใส่ลง Google Doc):
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- สถานการณ์ที่ 1 -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    สถานการณ์ที่ 1 • INNER JOIN (2 ตาราง)
                  </span>
                  <p class="text-xs text-stone-700 leading-relaxed">
                    <strong>โจทย์:</strong> เจ้าของร้านต้องการดูรายชื่อเมนูทั้งหมด พร้อมแสดงชื่อหมวดหมู่และราคาของแต่ละเมนู เพื่อนำไปจัดทำแผ่นป้ายเมนูหน้าร้าน
                  </p>
                  <div class="text-[11px] font-mono text-stone-600 bg-white p-2 rounded border border-stone-200">
                    แสดงคอลัมน์: menus.menu_name, categories.category_name, menus.price
                  </div>
                </div>

                <!-- สถานการณ์ที่ 2 -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                    สถานการณ์ที่ 2 • LEFT JOIN (ตรวจสอบข้อมูลที่ยังไม่ผูก)
                  </span>
                  <p class="text-xs text-stone-700 leading-relaxed">
                    <strong>โจทย์:</strong> ผู้จัดการร้านต้องการตรวจสอบหมวดหมู่สินค้าทั้งหมด ว่ามีหมวดหมู่ใดบ้างที่ยังไม่ได้เพิ่มรายการเมนูลงไป เพื่อเตรียมคิดสูตรเครื่องดื่มใหม่
                  </p>
                  <div class="text-[11px] font-mono text-stone-600 bg-white p-2 rounded border border-stone-200">
                    แสดงคอลัมน์: categories.category_name, menus.menu_name (หมวดหมู่ที่ยังไม่มีเมนู ค่า menu_name จะแสดงเป็น NULL)
                  </div>
                </div>

                <!-- สถานการณ์ที่ 3 -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    สถานการณ์ที่ 3 • Multi-table JOIN (เชื่อมโยงครบ 3 ตาราง)
                  </span>
                  <p class="text-xs text-stone-700 leading-relaxed">
                    <strong>โจทย์:</strong> แคชเชียร์ต้องการพิมพ์ใบสรุปประวัติการสั่งซื้อของลูกค้า โดยให้แสดง รหัสออเดอร์, วันที่สั่งซื้อ, ชื่อเมนู, ชื่อหมวดหมู่, จำนวนแก้ว และราคารวม
                  </p>
                  <div class="text-[11px] font-mono text-stone-600 bg-white p-2 rounded border border-stone-200">
                    JOIN จาก orders ➔ menus ➔ categories แสดงครบทุกมิติ
                  </div>
                </div>

                <!-- สถานการณ์ที่ 4 -->
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    สถานการณ์ที่ 4 • JOIN ร่วมกับ GROUP BY / SUM (รายงานสรุปยอดขาย)
                  </span>
                  <p class="text-xs text-stone-700 leading-relaxed">
                    <strong>โจทย์:</strong> เจ้าของร้านต้องการดูรายงานสรุปยอดขายรวม (Total Revenue) และจำนวนแก้วที่ขายได้ทั้งหมด แยกตามแต่ละเมนู โดยเรียงลำดับจากเมนูที่ขายดีที่สุด
                  </p>
                  <div class="text-[11px] font-mono text-stone-600 bg-white p-2 rounded border border-stone-200">
                    ใช้ SUM(orders.quantity), SUM(orders.total_price) ร่วมกับ GROUP BY menus.menu_name
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- คำชี้แจงการจัดทำเอกสารและส่งงาน Google Docs -->
          <div class="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 space-y-4">
            <h4 class="font-black text-sm sm:text-base text-emerald-950 flex items-center gap-2">
              <FileText class="w-5 h-5 text-emerald-600" />
              ข้อกำหนดการจัดทำรายงานและการส่งงาน (Google Docs Link)
            </h4>
            <div class="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>ให้นักศึกษาเปิดโปรแกรม <strong>Google Docs</strong> แล้วจัดทำเอกสารส่งตามขั้นตอนดังต่อไปนี้:</p>
              <ol class="list-decimal pl-5 space-y-2">
                <li>
                  <strong>ส่วนหัวเอกสาร:</strong> ระบุชื่อ-นามสกุล, รหัสนักศึกษา, กลุ่มเรียน และชื่อใบงานที่ 5
                </li>
                <li>
                  <strong>ภาพรวมฐานข้อมูล (Schema Visualizer):</strong> แคปเจอร์ภาพหน้าจอจากเมนู <strong>Database ➔ Schema Visualizer</strong> บน Supabase ที่จัดเรียงทั้ง 3 ตารางและเห็นเส้นเชื่อมโยง Foreign Key ชัดเจน
                </li>
                <li>
                  <strong>การตอบโจทย์สถานการณ์ที่ 1 ถึง 4:</strong> 
                  ในแต่ละข้อ ให้ระบุหัวข้อสถานการณ์ ➔ <strong>พิมพ์คำสั่ง SQL ที่ใช้เขียนจริง</strong> ➔ <strong>แคปเจอร์ภาพผลลัพธ์ตารางข้อมูล (Query Results) จากหน้าจอ Supabase</strong> มาวางประกอบใต้คำสั่งให้ชัดเจน
                </li>
                <li>
                  <strong>การแชร์ลิงก์ส่งงาน:</strong> กดปุ่ม <em>"แชร์ (Share)"</em> ใน Google Docs แล้วตั้งค่าสิทธิ์การเข้าถึงเป็น <strong>"ทุกคนที่มีลิงก์มีสิทธิ์ดู (Anyone with the link can view)"</strong> จากนั้นคัดลอกลิงก์มาวางส่งในระบบที่ช่องส่งงานด้านล่างนี้
                </li>
              </ol>
            </div>

            <!-- เกณฑ์การให้คะแนน 10 คะแนน -->
            <div class="pt-3 border-t border-emerald-200/70">
              <div class="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                <Trophy class="w-4 h-4 text-emerald-600" />
                เกณฑ์การให้คะแนน (10 คะแนนเต็ม):
              </div>
              <ul class="text-xs text-stone-600 list-disc pl-5 space-y-1">
                <li>การสร้าง 3 ตารางถูกต้องตามโครงสร้างและผูก Foreign Key สมบูรณ์ (3 คะแนน)</li>
                <li>ความถูกต้องของคำสั่ง SQL และผลลัพธ์ในสถานการณ์ที่ 1–4 (4 คะแนน - ข้อละ 1 คะแนน)</li>
                <li>ความเรียบร้อยของรายงาน Google Docs และภาพแคปเจอร์ผลลัพธ์ที่ชัดเจน (3 คะแนน)</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </AssignmentSection>

    <!-- Teacher Scoreboard Modal -->
    <TeacherScoreboardModal
      v-if="showTeacherModal"
      :course-id="currentCourseId"
      :week="currentWeek"
      :games="weekGames"
      @close="showTeacherModal = false"
    />
  </div>
</template>
