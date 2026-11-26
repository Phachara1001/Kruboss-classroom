<script setup>
import { ref, reactive } from 'vue'
import {
  Table,
  GitFork,
  Link,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Check
} from '@lucide/vue'

const dataTypeOptions = [
  'BIGINT',
  'INT',
  'NUMERIC(10, 2)',
  'VARCHAR',
  'DATE',
  'BOOLEAN'
]

const tables = [
  {
    id: 'departments',
    title: '1. departments (ตารางแผนกวิชา)',
    badge: 'สร้างลำดับที่ 1',
    icon: 'table',
    cardClass: 'border-teal-200 bg-teal-50/40',
    headerClass: 'bg-teal-700',
    footerClass: 'bg-teal-50/70 border-teal-200',
    buttonClass: 'bg-teal-700 hover:bg-teal-800 text-white',
    pkBorderClass: 'border-teal-200',
    pkTextClass: 'text-teal-700',
    columns: [
      {
        id: 'id',
        name: 'id',
        isPk: true,
        constraint: 'PK (Identity)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'Primary Key แบบรันเลขอัตโนมัติ (Identity) มาตรฐาน PostgreSQL/Supabase ใช้ BIGINT เพื่อรองรับข้อมูลระยะยาวและเชื่อม FK ได้ตรงชนิดกันครับ',
        wrongReasons: {
          INT: 'ถ้าตารางลูกใช้ BIGINT เป็น FK จะเกิด Foreign Key Type Mismatch Error (และ INT รองรับได้จำกัดกว่ามาตรฐาน Identity ของ Supabase)',
          'NUMERIC(10, 2)': 'รหัส Primary Key ไม่ควรมีทศนิยม ทำ Index/Join ช้ากว่าจำนวนเต็ม และใช้กับ Identity ไม่เหมาะสมครับ',
          VARCHAR: 'ไม่สามารถรันเลขอัตโนมัติ (Identity) แบบตัวเลขได้ และทำ JOIN ช้ากว่าแบบตัวเลขครับ',
          DATE: 'ใช้วันที่เป็นรหัส PK ไม่ได้ เพราะข้อมูลซ้ำกันได้และรันเลขอัตโนมัติไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ 2 ค่า (TRUE/FALSE) จึงใช้เป็น Primary Key ห้ามซ้ำของแผนกไม่ได้เลยครับ'
        }
      },
      {
        id: 'dept_code',
        name: 'dept_code',
        constraint: 'NOT NULL UNIQUE',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(15)',
        whyCorrect: 'รหัสแผนกเป็นตัวอักษรสั้นๆ เช่น IT, COMP, ACC หรือผสมตัวเลข ใช้ VARCHAR(15) จึงเก็บตัวอักษรได้ครบไม่เสียรูปครับ',
        wrongReasons: {
          BIGINT: 'เก็บตัวอักษรเช่น IT, COMP, ACC ไม่ได้เลย ระบบจะแจ้ง Syntax/Type Error ทันทีครับ',
          INT: 'เก็บตัวอักษรเช่น IT, MKT ไม่ได้ และหากมีเลข 0 นำหน้าจะถูกตัดทิ้งครับ',
          'NUMERIC(10, 2)': 'เก็บเฉพาะตัวเลขทศนิยม ไม่สามารถเก็บตัวอักษรรหัสแผนกได้เลยครับ',
          DATE: 'รหัสแผนกไม่ใช่วันที่ จะเกิด Date Format Error ทันทีเมื่อ INSERT ครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE ไม่สามารถเก็บรหัสแผนกได้เลยครับ'
        }
      },
      {
        id: 'dept_name',
        name: 'dept_name',
        constraint: 'NOT NULL',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(100)',
        whyCorrect: 'ชื่อแผนกวิชาเป็นข้อความภาษาไทย/อังกฤษที่มีความยาวแปรผัน จึงใช้ VARCHAR(100) เพื่อให้เก็บชื่อเต็มได้พอดีครับ',
        wrongReasons: {
          BIGINT: 'เก็บข้อความชื่อแผนกที่เป็นตัวอักษรไม่ได้ จะเกิด Error ทันทีครับ',
          INT: 'เก็บได้เฉพาะเลขจำนวนเต็ม ไม่สามารถเก็บชื่อแผนกวิชาได้เลยครับ',
          'NUMERIC(10, 2)': 'ใช้เก็บตัวเลขมีทศนิยม ไม่สามารถเก็บข้อความชื่อแผนกได้ครับ',
          DATE: 'ชื่อแผนกไม่ใช่วันที่ ระบบจะปฏิเสธการบันทึกทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ค่าจริง/เท็จ ไม่สามารถเก็บข้อความชื่อแผนกได้ครับ'
        }
      },
      {
        id: 'building',
        name: 'building',
        constraint: 'NOT NULL',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(50)',
        whyCorrect: 'ชื่ออาคารมีทั้งตัวอักษรและตัวเลขผสมกัน เช่น "อาคาร 44" จึงต้องเก็บเป็นข้อความ VARCHAR(50) ครับ',
        wrongReasons: {
          BIGINT: 'เก็บข้อความอย่าง "อาคารวิทย์" หรือตัวอักษรไม่ได้ครับ',
          INT: 'หากชื่ออาคารมีคำว่า "อาคาร" หรือตัวอักษร จะ Error ทันทีครับ',
          'NUMERIC(10, 2)': 'ชื่ออาคารไม่ใช่ตัวเลขคำนวณที่มีทศนิยม เก็บข้อความไม่ได้ครับ',
          DATE: 'ชื่ออาคารไม่ใช่วันที่ เกิด Date Format Error แน่นอนครับ',
          BOOLEAN: 'เก็บได้แค่ 2 สถานะ ไม่สามารถระบุชื่ออาคารได้ครับ'
        }
      }
    ]
  },
  {
    id: 'members',
    title: '2. members (ตารางสมาชิก)',
    badge: 'สร้างลำดับที่ 2',
    icon: 'table',
    cardClass: 'border-emerald-200 bg-emerald-50/40',
    headerClass: 'bg-emerald-700',
    footerClass: 'bg-emerald-50/70 border-emerald-200',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    pkBorderClass: 'border-emerald-200',
    pkTextClass: 'text-emerald-700',
    columns: [
      {
        id: 'id',
        name: 'id',
        isPk: true,
        constraint: 'PK (Identity)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'Primary Key ของสมาชิกใช้ BIGINT แบบ Identity เพื่อรันเลขอัตโนมัติและให้ตาราง borrow_records อ้างอิง FK ได้ตรงกันครับ',
        wrongReasons: {
          INT: 'ถ้าตารางลูก borrow_records.member_id ใช้ BIGINT จะชนกันจนสร้าง Foreign Key ไม่ได้ครับ',
          'NUMERIC(10, 2)': 'PK ไม่ควรเป็นเลขทศนิยม ไม่เหมาะกับ Identity และการทำ Index เชื่อมตารางครับ',
          VARCHAR: 'ไม่สามารถรันเลขอัตโนมัติและทำ JOIN ช้ากว่าเลขจำนวนเต็มครับ',
          DATE: 'สมาชิกแต่ละคนใช้วันที่เป็นรหัสไม่ซ้ำแบบ Auto Increment ไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE ใช้เป็น PK แยกตัวสมาชิกไม่ได้ครับ'
        }
      },
      {
        id: 'member_code',
        name: 'member_code',
        constraint: 'NOT NULL UNIQUE',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: 'รหัสสมาชิกมักขึ้นต้นด้วยตัวอักษรหรือเลข 0 (เช่น STD001 หรือ 065001) ต้องใช้ VARCHAR(20) เพื่อไม่ให้ตัวอักษร/เลข 0 หายครับ',
        wrongReasons: {
          BIGINT: 'เก็บตัวอักษรอย่าง STD001 ไม่ได้ และเลข 0 ข้างหน้าจะถูกตัดทิ้งครับ',
          INT: 'เก็บตัวอักษรไม่ได้ เลข 0 นำหน้าหาย และรหัสนักศึกษา 13 หลักจะเกินขีดจำกัด INT จน Error ครับ',
          'NUMERIC(10, 2)': 'เก็บตัวอักษรไม่ได้ แถมใส่ .00 ท้ายรหัสสมาชิกและตัดเลข 0 หน้าทิ้งครับ',
          DATE: 'รหัสสมาชิกไม่ใช่วันที่ เกิด Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ค่าจริง/เท็จ เก็บรหัสสมาชิกไม่ได้ครับ'
        }
      },
      {
        id: 'full_name',
        name: 'full_name',
        constraint: 'NOT NULL',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(100)',
        whyCorrect: 'ชื่อ-นามสกุลเป็นข้อความที่มีความยาวต่างกันแต่ละคน ใช้ VARCHAR(100) จึงเก็บได้ครบถ้วนครับ',
        wrongReasons: {
          BIGINT: 'เก็บตัวอักษรชื่อ-นามสกุลไม่ได้เลยครับ',
          INT: 'เก็บได้เฉพาะตัวเลขจำนวนเต็ม เก็บชื่อคนไม่ได้ครับ',
          'NUMERIC(10, 2)': 'ใช้สำหรับเลขทศนิยม ไม่สามารถเก็บชื่อ-นามสกุลได้ครับ',
          DATE: 'ชื่อคนไม่ใช่วันที่ ระบบจะ Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE ไม่สามารถเก็บชื่อคนได้ครับ'
        }
      },
      {
        id: 'dept_id',
        name: 'dept_id',
        isFk: true,
        fkTextClass: 'text-teal-800',
        fkConstraintClass: 'text-teal-700',
        fkBorderClass: 'border-teal-200',
        constraint: 'NOT NULL REFERENCES departments(id)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'กฎเหล็กของ Foreign Key คือต้องใช้ชนิดข้อมูลตรงกับ departments(id) ที่อ้างอิง คือ BIGINT ครับ',
        wrongReasons: {
          INT: 'ชนิดข้อมูลไม่ตรงกับ departments(id) ที่เป็น BIGINT ทำให้ PostgreSQL แจ้ง Foreign Key Type Mismatch Error ครับ',
          'NUMERIC(10, 2)': 'ไม่ตรงกับชนิด BIGINT ของ PK ในตาราง departments สร้าง FK ไม่สำเร็จครับ',
          VARCHAR: 'ไม่ตรงกับชนิด BIGINT ของ departments(id) และเชื่อมความสัมพันธ์ไม่ได้ครับ',
          DATE: 'ชนิดวันที่อ้างอิง PK ที่เป็น BIGINT ไม่ได้ จะเกิด Error ทันทีครับ',
          BOOLEAN: 'ค่าจริง/เท็จอ้างอิงรหัสแผนก BIGINT ไม่ได้ สร้าง FK ล้มเหลวครับ'
        }
      },
      {
        id: 'member_type',
        name: 'member_type',
        isConstraintHighlight: true,
        constraint: "NOT NULL CHECK IN ('STUDENT','TEACHER')",
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: "ค่าใน CHECK เป็นข้อความ ('STUDENT', 'TEACHER') จึงต้องใช้ VARCHAR(20) ให้ตรงกับเงื่อนไขครับ",
        wrongReasons: {
          BIGINT: "เงื่อนไข CHECK บังคับใส่คำว่า 'STUDENT' หรือ 'TEACHER' ซึ่งเป็นตัวอักษร เก็บใน BIGINT ไม่ได้ครับ",
          INT: 'ไม่สามารถเก็บคำว่า STUDENT หรือ TEACHER ได้ เกิด Type Error ครับ',
          'NUMERIC(10, 2)': 'เก็บตัวอักษรในเงื่อนไข CHECK ไม่ได้เลยครับ',
          DATE: 'ค่าประเภทสมาชิกไม่ใช่วันที่ จะ Error ทันทีครับ',
          BOOLEAN: "ถึงจะมี 2 ค่า แต่เงื่อนไข CHECK กำหนดเป็นข้อความ 'STUDENT'/'TEACHER' ไม่ใช่ TRUE/FALSE จึงใช้ BOOLEAN ไม่ได้ครับ"
        }
      },
      {
        id: 'status',
        name: 'status',
        isConstraintHighlight: true,
        constraint: "DEFAULT 'ACTIVE' CHECK IN ('ACTIVE','SUSPENDED')",
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: "ค่า DEFAULT 'ACTIVE' และ CHECK IN ('ACTIVE','SUSPENDED') เป็นข้อความ จึงต้องกำหนดเป็น VARCHAR(20) ครับ",
        wrongReasons: {
          BIGINT: "ค่า DEFAULT 'ACTIVE' เป็นตัวอักษร ไม่สามารถตั้งในคอลัมน์ BIGINT ได้ครับ",
          INT: "ใส่คำว่า 'ACTIVE' หรือ 'SUSPENDED' ไม่ได้ ระบบจะ Error ตั้งแต่ตอน CREATE TABLE ครับ",
          'NUMERIC(10, 2)': 'ไม่สามารถเก็บค่าข้อความสถานะตามเงื่อนไข CHECK ได้ครับ',
          DATE: 'สถานะ ACTIVE/SUSPENDED ไม่ใช่วันที่ จะ Error ทันทีครับ',
          BOOLEAN: "โจทย์กำหนดให้เก็บข้อความ 'ACTIVE'/'SUSPENDED' เพื่อขยายสถานะในอนาคต ถ้าใช้ BOOLEAN จะใส่ค่า DEFAULT 'ACTIVE' ไม่ได้ครับ"
        }
      }
    ]
  },
  {
    id: 'books',
    title: '3. books (ตารางหนังสือ)',
    badge: 'สร้างลำดับที่ 3',
    icon: 'table',
    cardClass: 'border-sky-200 bg-sky-50/40',
    headerClass: 'bg-sky-700',
    footerClass: 'bg-sky-50/70 border-sky-200',
    buttonClass: 'bg-sky-700 hover:bg-sky-800 text-white',
    pkBorderClass: 'border-sky-200',
    pkTextClass: 'text-sky-700',
    columns: [
      {
        id: 'id',
        name: 'id',
        isPk: true,
        constraint: 'PK (Identity)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'Primary Key ของตารางหนังสือใช้ BIGINT แบบ Identity เพื่อความเข้ากันได้เมื่อ borrow_records อ้างอิง FK ครับ',
        wrongReasons: {
          INT: 'หากตาราง borrow_records.book_id เป็น BIGINT จะเกิด Foreign Key Type Mismatch Error ครับ',
          'NUMERIC(10, 2)': 'PK ไม่ควรมีทศนิยม ทำ Index/Join ช้ากว่าจำนวนเต็มครับ',
          VARCHAR: 'รันเลขอัตโนมัติแบบ Identity ไม่ได้ และ JOIN ช้ากว่าครับ',
          DATE: 'ใช้วันที่เป็น Primary Key ห้ามซ้ำแบบรันเลขไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ 2 ค่า ใช้เป็น PK แยกหนังสือแต่ละเล่มไม่ได้ครับ'
        }
      },
      {
        id: 'isbn',
        name: 'isbn',
        constraint: 'NOT NULL UNIQUE',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: 'รหัส ISBN อาจมีขีดคั่น (-) หรือเลข 0 นำหน้า และไม่ได้นำมาบวกลบ จึงต้องเก็บเป็น VARCHAR(20) ครับ',
        wrongReasons: {
          BIGINT: 'เก็บขีดคั่น (-) เช่น 978-616-... ไม่ได้ และเลข 0 ด้านหน้าจะหายไปครับ',
          INT: 'ISBN 13 หลัก (เช่น 978616...) ค่าเกิน 2.1 พันล้าน เกิด Integer Overflow Error ทันทีและเก็บขีดไม่ได้ครับ',
          'NUMERIC(10, 2)': 'เก็บขีดไม่ได้ เติม .00 ต่อท้าย ISBN และ 13 หลักเกินขนาด NUMERIC(10,2) จน Overflow ครับ',
          DATE: 'ISBN ไม่ใช่รูปแบบวันที่ จะเกิด Date Format Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE ไม่สามารถเก็บรหัส ISBN ได้ครับ'
        }
      },
      {
        id: 'book_title',
        name: 'book_title',
        constraint: 'NOT NULL',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(150)',
        whyCorrect: 'ชื่อหนังสือเป็นข้อความที่มีความยาวมากพอสมควร จึงใช้ VARCHAR(150) และรองรับการค้นหา LIKE / ILIKE ได้ครับ',
        wrongReasons: {
          BIGINT: 'เก็บข้อความชื่อหนังสือที่เป็นตัวอักษรไม่ได้ครับ',
          INT: 'เก็บได้แค่จำนวนเต็ม เก็บชื่อหนังสือไม่ได้ครับ',
          'NUMERIC(10, 2)': 'ใช้เก็บตัวเลขมีทศนิยม ไม่สามารถเก็บชื่อหนังสือได้ครับ',
          DATE: 'ชื่อหนังสือไม่ใช่วันที่ ระบบจะ Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ค่าจริง/เท็จ เก็บชื่อหนังสือไม่ได้ครับ'
        }
      },
      {
        id: 'category',
        name: 'category',
        constraint: 'NOT NULL',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(60)',
        whyCorrect: 'หมวดหมู่หนังสือ (เช่น Database, Programming, Network) เป็นข้อความสั้นๆ ใช้ VARCHAR(60) เพื่อนำไปจัดกลุ่ม GROUP BY category ครับ',
        wrongReasons: {
          BIGINT: 'เก็บชื่อหมวดหมู่ที่เป็นตัวอักษรไม่ได้ครับ',
          INT: 'ไม่สามารถเก็บคำว่า Database หรือ Network ได้ครับ',
          'NUMERIC(10, 2)': 'หมวดหมู่หนังสือไม่ใช่ตัวเลขทศนิยมครับ',
          DATE: 'หมวดหมู่หนังสือไม่ใช่วันที่ เกิด Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ 2 สถานะ ใช้แยกหมวดหมู่หลายหมวดไม่ได้ครับ'
        }
      },
      {
        id: 'publish_year',
        name: 'publish_year',
        isConstraintHighlight: true,
        constraint: 'NOT NULL CHECK (publish_year >= 1950)',
        correctType: 'INT',
        recommendedDisplay: 'INT',
        whyCorrect: 'ปี ค.ศ. เป็นเลขจำนวนเต็ม 4 หลัก ใช้ INT จึงเปรียบเทียบ >= 1950 หรือ < 2022 ได้แม่นยำและประหยัดพื้นที่กว่า BIGINT ครับ',
        wrongReasons: {
          BIGINT: 'ใช้เก็บปี ค.ศ. 4 หลักถือว่าใหญ่เกินความจำเป็น (8 bytes) แค่ INT ก็เก็บได้เหลือเฟือแล้วครับ',
          'NUMERIC(10, 2)': 'ปี ค.ศ. ไม่มีทศนิยม (เช่น 2022.00) และใช้พื้นที่มากกว่า INT โดยไม่จำเป็นครับ',
          VARCHAR: 'เปรียบเทียบช่วงปีด้วย >= 1950 ใน CHECK หรือ BETWEEN 2015 AND 2024 ได้ไม่ถูกต้องเหมือนตัวเลขครับ',
          DATE: 'โจทย์เก็บเฉพาะเลขปี (เช่น 2020) ไม่ใช่วันที่เต็ม (YYYY-MM-DD) จึงเปรียบเทียบ publish_year >= 1950 ไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE เก็บเลขปี ค.ศ. ไม่ได้ครับ'
        }
      },
      {
        id: 'price',
        name: 'price',
        isConstraintHighlight: true,
        constraint: 'NOT NULL CHECK (price >= 0)',
        correctType: 'NUMERIC(10, 2)',
        recommendedDisplay: 'NUMERIC(10, 2)',
        whyCorrect: 'ราคาหนังสือมีโอกาสมีเศษสตางค์ และต้องนำไปใช้ SUM() / AVG() คำนวณเงินจึงต้องใช้ NUMERIC(10, 2) ครับ',
        wrongReasons: {
          INT: 'ถ้าหนังสือมีราคาเศษสตางค์ เช่น 350.50 จะถูกตัดทศนิยมทิ้งจนราคาเพี้ยนครับ',
          BIGINT: 'เก็บได้เฉพาะจำนวนเต็ม ไม่มีทศนิยม 2 ตำแหน่งสำหรับเศษสตางค์ครับ',
          VARCHAR: 'ใช้คำนวณ ROUND(AVG(price), 2) หรือ SUM() ไม่ได้ และเปรียบเทียบ price >= 0 ผิดพลาดครับ',
          DATE: 'ตัวเลขราคาไม่ใช่วันที่ เกิด Date Format Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่จริง/เท็จ ไม่สามารถเก็บมูลค่าราคาได้ครับ'
        }
      },
      {
        id: 'total_copies',
        name: 'total_copies',
        isConstraintHighlight: true,
        constraint: 'NOT NULL CHECK (total_copies > 0)',
        correctType: 'INT',
        recommendedDisplay: 'INT',
        whyCorrect: 'จำนวนเล่มเป็นเลขจำนวนเต็มบวก ใช้ INT จึงคำนวณ SUM(total_copies) และตรวจสอบ > 0 ได้เร็วและเหมาะสมที่สุดครับ',
        wrongReasons: {
          BIGINT: 'จำนวนเล่มในห้องสมุดไม่ถึงหลายพันล้านเล่ม ใช้ BIGINT จึงสิ้นเปลืองพื้นที่โดยไม่จำเป็นครับ',
          'NUMERIC(10, 2)': 'จำนวนเล่มหนังสือไม่มีเศษทศนิยม (ไม่มีครึ่งเล่ม) ควรใช้ INT ครับ',
          VARCHAR: 'คำนวณ SUM(total_copies) และตรวจ CHECK (total_copies > 0) แบบตัวเลขไม่ได้ครับ',
          DATE: 'จำนวนเล่มไม่ใช่วันที่ เกิด Error ทันทีครับ',
          BOOLEAN: 'บอกได้แค่จริง/เท็จ บอกไม่ได้ว่ามีหนังสือทั้งหมดกี่เล่มครับ'
        }
      }
    ]
  },
  {
    id: 'borrow_records',
    title: '4. borrow_records (ตารางการยืม-คืน)',
    badge: 'สร้างลำดับที่ 4',
    icon: 'gitfork',
    cardClass: 'border-purple-200 bg-purple-50/40',
    headerClass: 'bg-purple-700',
    footerClass: 'bg-purple-50/70 border-purple-200',
    buttonClass: 'bg-purple-700 hover:bg-purple-800 text-white',
    pkBorderClass: 'border-purple-200',
    pkTextClass: 'text-purple-700',
    columns: [
      {
        id: 'id',
        name: 'id',
        isPk: true,
        constraint: 'PK (Identity)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'ตารางรายการยืม-คืนมีข้อมูลเพิ่มขึ้นต่อเนื่องทุกวัน ใช้ BIGINT แบบ Identity เพื่อรองรับประวัติย้อนหลังจำนวนมหาศาลครับ',
        wrongReasons: {
          INT: 'หากข้อมูล Transaction เติบโตจนเกิน ~2.14 พันล้านแถวจะเกิด Integer Overflow และรันรหัสใหม่ไม่ได้ครับ',
          'NUMERIC(10, 2)': 'PK ไม่ควรมีทศนิยมและไม่เหมาะกับการทำ Identity/Index ครับ',
          VARCHAR: 'รันเลขอัตโนมัติ Identity ไม่ได้ และกินพื้นที่/ช้ากว่าตัวเลขครับ',
          DATE: 'วันเดียวกันมีการยืมได้หลายรายการ จึงใช้วันที่เป็น PK ห้ามซ้ำไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ 2 ค่า ใช้เป็น PK แยกรายการยืมไม่ได้เลยครับ'
        }
      },
      {
        id: 'borrow_code',
        name: 'borrow_code',
        constraint: 'NOT NULL UNIQUE',
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: 'รหัสใบยืมมักมีตัวอักษรหรือขีดนำหน้า เช่น BRW-2025-001 จึงต้องเก็บเป็นข้อความ VARCHAR(20) ครับ',
        wrongReasons: {
          BIGINT: 'ไม่สามารถเก็บตัวอักษร BRW หรือเครื่องหมายขีด (-) ในรหัสใบยืมได้เลยครับ',
          INT: 'เก็บตัวอักษร BRW และขีด (-) ไม่ได้ แถมเลข 0 นำหน้าจะถูกตัดทิ้งครับ',
          'NUMERIC(10, 2)': 'เก็บตัวอักษรและขีดไม่ได้ครับ',
          DATE: 'รหัสใบยืมไม่ใช่วันที่ จะเกิด Date Format Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE เก็บรหัสใบยืมไม่ได้ครับ'
        }
      },
      {
        id: 'member_id',
        name: 'member_id',
        isFk: true,
        fkTextClass: 'text-emerald-800',
        fkConstraintClass: 'text-emerald-700',
        fkBorderClass: 'border-emerald-200',
        constraint: 'NOT NULL REFERENCES members(id)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'เป็น Foreign Key อ้างอิง members(id) จึงต้องใช้ BIGINT ให้ตรงกับชนิดของ PK ในตาราง members ครับ',
        wrongReasons: {
          INT: 'ชนิดไม่ตรงกับ members(id) ที่เป็น BIGINT ระบบจะแจ้ง Foreign Key Type Mismatch Error ครับ',
          'NUMERIC(10, 2)': 'ไม่ตรงกับชนิด BIGINT ของ members(id) สร้างความสัมพันธ์ไม่ได้ครับ',
          VARCHAR: 'ไม่ตรงกับชนิด BIGINT ของ members(id) เชื่อมตารางด้วย FK ไม่ได้ครับ',
          DATE: 'อ้างอิงคอลัมน์ members(id) ที่เป็น BIGINT ไม่ได้ครับ',
          BOOLEAN: 'อ้างอิงรหัสสมาชิก BIGINT ไม่ได้ สร้าง FK ล้มเหลวครับ'
        }
      },
      {
        id: 'book_id',
        name: 'book_id',
        isFk: true,
        fkTextClass: 'text-sky-800',
        fkConstraintClass: 'text-sky-700',
        fkBorderClass: 'border-sky-200',
        constraint: 'NOT NULL REFERENCES books(id)',
        correctType: 'BIGINT',
        recommendedDisplay: 'BIGINT',
        whyCorrect: 'เป็น Foreign Key อ้างอิง books(id) จึงต้องใช้ BIGINT ให้ตรงกับชนิดของ PK ในตาราง books ครับ',
        wrongReasons: {
          INT: 'ชนิดไม่ตรงกับ books(id) ที่เป็น BIGINT จะเกิด Foreign Key Type Mismatch Error ครับ',
          'NUMERIC(10, 2)': 'ไม่ตรงกับชนิด BIGINT ของ books(id) สร้าง FK ไม่ผ่านครับ',
          VARCHAR: 'ไม่ตรงกับชนิด BIGINT ของ books(id) เชื่อมความสัมพันธ์ไม่ได้ครับ',
          DATE: 'อ้างอิงรหัสหนังสือ BIGINT ไม่ได้ครับ',
          BOOLEAN: 'อ้างอิงรหัสหนังสือ BIGINT ไม่ได้ สร้าง FK ล้มเหลวครับ'
        }
      },
      {
        id: 'borrow_due_date',
        name: 'borrow_date / due_date',
        constraint: 'NOT NULL (borrow มี DEFAULT CURRENT_DATE)',
        correctType: 'DATE',
        recommendedDisplay: 'DATE',
        whyCorrect: 'ใช้เก็บวันที่ยืมและกำหนดคืนตามปฏิทิน ทำให้ตั้ง DEFAULT CURRENT_DATE และคำนวณระยะวันยืมคืนได้ถูกต้องครับ',
        wrongReasons: {
          VARCHAR: 'ตั้ง DEFAULT CURRENT_DATE แบบชนิด DATE ไม่ได้ ใส่ผิดวันอย่าง "2025-02-31" ก็ผ่าน และบวกลบวันตามปฏิทินไม่ได้ครับ',
          INT: 'ไม่สามารถเก็บเครื่องหมายขีด (-) ใน YYYY-MM-DD และใช้ DEFAULT CURRENT_DATE ไม่ได้ครับ',
          BIGINT: 'ใช้ DEFAULT CURRENT_DATE ไม่ได้ และบวกลบวันที่ตามปฏิทินไม่ได้ครับ',
          'NUMERIC(10, 2)': 'วันที่ไม่ใช่ตัวเลขทศนิยม ใช้ DEFAULT CURRENT_DATE ไม่ได้ครับ',
          BOOLEAN: 'เก็บได้แค่ TRUE/FALSE เก็บวันที่ยืม-กำหนดคืนไม่ได้ครับ'
        }
      },
      {
        id: 'actual_return_date',
        name: 'actual_return_date',
        constraint: 'NULL (เว้นว่างไว้เมื่อยังไม่คืน)',
        correctType: 'DATE',
        recommendedDisplay: 'DATE',
        whyCorrect: 'ใช้เก็บวันที่คืนจริง (และอนุญาตให้เป็น NULL เมื่อยังไม่คืน) จึงต้องเป็น DATE เพื่อให้เทียบกับ due_date ได้ครับ',
        wrongReasons: {
          VARCHAR: 'ไม่ตรวจสอบความถูกต้องของวันที่ และนำไปเปรียบเทียบ actual_return_date > due_date ได้ยากกว่า DATE ครับ',
          INT: 'เก็บวันที่รูปแบบ YYYY-MM-DD ไม่ได้ และเทียบกับ due_date แบบวันที่ไม่ได้ครับ',
          BIGINT: 'บวกลบจำนวนวันล่าช้าเทียบกับ due_date ตามปฏิทินไม่ได้ครับ',
          'NUMERIC(10, 2)': 'ไม่สามารถเก็บวันที่คืนหนังสือจริงได้เลยครับ',
          BOOLEAN: 'บอกได้แค่คืน/ไม่คืน แต่เก็บวันที่คืนจริงไม่ได้ครับ'
        }
      },
      {
        id: 'return_status',
        name: 'return_status',
        isConstraintHighlight: true,
        constraint: "CHECK IN ('BORROWED','RETURNED','OVERDUE')",
        correctType: 'VARCHAR',
        recommendedDisplay: 'VARCHAR(20)',
        whyCorrect: "สถานะการคืนมี 3 ค่าเป็นข้อความ ('BORROWED','RETURNED','OVERDUE') จึงต้องใช้ VARCHAR(20) ครับ",
        wrongReasons: {
          BIGINT: 'ไม่สามารถเก็บคำว่า BORROWED, RETURNED, OVERDUE ที่เป็นตัวอักษรได้ครับ',
          INT: 'เก็บข้อความสถานะ 3 แบบตามเงื่อนไข CHECK ไม่ได้เลยครับ',
          'NUMERIC(10, 2)': 'เก็บคำภาษาอังกฤษในเงื่อนไข CHECK ไม่ได้ครับ',
          DATE: 'สถานะการคืนไม่ใช่วันที่ จะเกิด Error ทันทีครับ',
          BOOLEAN: 'BOOLEAN เก็บได้แค่ 2 ค่า (TRUE/FALSE) แต่โจทย์มีถึง 3 สถานะ (BORROWED, RETURNED, OVERDUE) จึงใช้ไม่พอครับ'
        }
      },
      {
        id: 'fine_amount',
        name: 'fine_amount',
        isConstraintHighlight: true,
        constraint: 'DEFAULT 0 CHECK (fine_amount >= 0)',
        correctType: 'NUMERIC(10, 2)',
        recommendedDisplay: 'NUMERIC(10, 2)',
        whyCorrect: 'ค่าปรับเป็นจำนวนเงินที่อาจมีเศษสตางค์และต้องใช้ SUM(fine_amount) สรุปยอด จึงใช้ NUMERIC(10, 2) ครับ',
        wrongReasons: {
          INT: 'หากมีค่าปรับที่มีเศษสตางค์ (เช่น 15.50 บาท) ระบบจะตัดทศนิยมทิ้งทันทีครับ',
          BIGINT: 'เก็บได้เฉพาะจำนวนเต็ม ไม่มีเศษสตางค์ 2 ตำแหน่งครับ',
          VARCHAR: 'ไม่สามารถนำไปใช้ SUM(fine_amount) และตรวจเงื่อนไข >= 0 แบบตัวเลขไม่ได้ครับ',
          DATE: 'ค่าปรับที่เป็นตัวเงินไม่ใช่วันที่ จะเกิด Error ทันทีครับ',
          BOOLEAN: 'เก็บได้แค่จริง/เท็จ ไม่สามารถเก็บยอดเงินค่าปรับได้เลยครับ'
        }
      }
    ]
  }
]

const answers = reactive({})
const checkedTables = reactive({})

for (const table of tables) {
  checkedTables[table.id] = false
  for (const col of table.columns) {
    answers[`${table.id}.${col.id}`] = ''
  }
}

function getKey(tableId, colId) {
  return `${tableId}.${colId}`
}

function onSelectChange(tableId) {
  if (checkedTables[tableId]) {
    checkedTables[tableId] = false
  }
}

function checkTable(tableId) {
  checkedTables[tableId] = true
}

function resetTable(tableId) {
  const table = tables.find((t) => t.id === tableId)
  if (!table) return
  for (const col of table.columns) {
    answers[getKey(tableId, col.id)] = ''
  }
  checkedTables[tableId] = false
}

function getTableAnsweredCount(table) {
  return table.columns.filter((c) => answers[getKey(table.id, c.id)] !== '').length
}

function getTableScore(table) {
  return table.columns.filter(
    (c) => answers[getKey(table.id, c.id)] === c.correctType
  ).length
}

function getColStatus(tableId, col) {
  if (!checkedTables[tableId]) return 'idle'
  const picked = answers[getKey(tableId, col.id)]
  if (!picked) return 'unanswered'
  return picked === col.correctType ? 'correct' : 'wrong'
}

function getRowBorderClass(table, col) {
  const status = getColStatus(table.id, col)
  if (status === 'correct') return 'border-emerald-300 bg-emerald-50/40'
  if (status === 'wrong') return 'border-rose-300 bg-rose-50/40'
  if (status === 'unanswered') return 'border-amber-300 bg-amber-50/40'
  if (col.isPk) return `${table.pkBorderClass} bg-white`
  if (col.isFk) return `${col.fkBorderClass} bg-white`
  if (col.isConstraintHighlight) return 'border-amber-200 bg-white'
  return 'border-stone-200 bg-white'
}

function getConstraintTextClass(table, col) {
  if (col.isPk) return `${table.pkTextClass} font-bold`
  if (col.isFk) return `${col.fkConstraintClass} font-bold`
  if (col.isConstraintHighlight) return 'text-amber-800 font-bold'
  return 'text-stone-600'
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <div
      v-for="table in tables"
      :key="table.id"
      class="rounded-2xl border-2 overflow-hidden flex flex-col"
      :class="table.cardClass"
    >
      <!-- Table Header -->
      <div class="px-4 py-3 text-white flex items-center justify-between" :class="table.headerClass">
        <div class="font-mono font-black text-sm flex items-center gap-2">
          <GitFork v-if="table.icon === 'gitfork'" class="w-4 h-4 shrink-0" />
          <Table v-else class="w-4 h-4 shrink-0" />
          <span>{{ table.title }}</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-black/25 text-[10px] font-bold shrink-0">
          {{ table.badge }}
        </span>
      </div>

      <!-- Columns List -->
      <div class="p-4 space-y-2 text-xs flex-1">
        <div
          v-for="col in table.columns"
          :key="col.id"
          class="p-2.5 rounded-xl border transition-colors"
          :class="getRowBorderClass(table, col)"
        >
          <!-- Column Row Top Line -->
          <div class="flex flex-wrap items-center justify-between gap-2">
            <!-- Column Name -->
            <span
              class="font-mono shrink-0 flex items-center gap-1"
              :class="[
                col.isPk ? 'font-black text-stone-900' : 'font-bold',
                col.isFk ? col.fkTextClass : 'text-stone-900'
              ]"
            >
              <Link v-if="col.isFk" class="w-3 h-3 shrink-0" />
              <span>{{ col.name }}</span>
            </span>

            <!-- Compact Data Type Dropdown + Constraints -->
            <div class="flex flex-wrap items-center justify-end gap-1.5 ml-auto">
              <label :for="`dt-${table.id}-${col.id}`" class="sr-only">
                เลือก Data Type ของ {{ col.name }}
              </label>
              <select
                :id="`dt-${table.id}-${col.id}`"
                v-model="answers[getKey(table.id, col.id)]"
                @change="onSelectChange(table.id)"
                class="text-[11px] font-mono font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-colors"
                :class="{
                  'border-stone-300 bg-stone-50 text-stone-800 hover:border-teal-400 focus:border-teal-600 focus:bg-white': getColStatus(table.id, col) === 'idle',
                  'border-emerald-400 bg-emerald-100/70 text-emerald-900': getColStatus(table.id, col) === 'correct',
                  'border-rose-400 bg-rose-100/70 text-rose-900': getColStatus(table.id, col) === 'wrong',
                  'border-amber-400 bg-amber-100/70 text-amber-900': getColStatus(table.id, col) === 'unanswered'
                }"
              >
                <option value="" disabled>-- Type --</option>
                <option v-for="opt in dataTypeOptions" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>

              <span
                class="font-mono text-[10px] sm:text-[11px] text-right"
                :class="getConstraintTextClass(table, col)"
              >
                {{ col.constraint }}
              </span>
            </div>
          </div>

          <!-- Inline Check Feedback -->
          <div
            v-if="checkedTables[table.id]"
            class="mt-2 pt-2 border-t text-[11px] leading-relaxed"
            :class="{
              'border-emerald-200 text-emerald-900': getColStatus(table.id, col) === 'correct',
              'border-rose-200 text-rose-950': getColStatus(table.id, col) === 'wrong',
              'border-amber-200 text-amber-900': getColStatus(table.id, col) === 'unanswered'
            }"
          >
            <!-- Correct -->
            <div v-if="getColStatus(table.id, col) === 'correct'" class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong class="text-emerald-800">ถูกต้อง ({{ col.recommendedDisplay }}):</strong>
                {{ col.whyCorrect }}
              </div>
            </div>

            <!-- Wrong -->
            <div v-else-if="getColStatus(table.id, col) === 'wrong'" class="space-y-1">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span class="font-bold text-rose-700 flex items-center gap-1">
                  <XCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>ถ้าเลือก {{ answers[getKey(table.id, col.id)] }}:</span>
                </span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">
                  ควรใช้ {{ col.recommendedDisplay }}
                </span>
              </div>
              <p class="text-rose-900">
                {{ col.wrongReasons[answers[getKey(table.id, col.id)]] }}
              </p>
              <p class="text-stone-700 bg-white/90 rounded px-2 py-1 border border-rose-100">
                <strong class="text-emerald-700">ทำไมต้อง {{ col.correctType }}:</strong>
                {{ col.whyCorrect }}
              </p>
            </div>

            <!-- Unanswered -->
            <div v-else class="flex items-start gap-1.5">
              <AlertTriangle class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>กรุณาเลือก Data Type จาก Dropdown ก่อนกดตรวจสอบครับ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Per-Table Check Footer -->
      <div
        class="px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2"
        :class="table.footerClass"
      >
        <div class="text-xs font-bold">
          <span
            v-if="!checkedTables[table.id]"
            class="text-stone-600 font-mono"
          >
            เลือกแล้ว {{ getTableAnsweredCount(table) }}/{{ table.columns.length }} คอลัมน์
          </span>
          <span
            v-else-if="getTableScore(table) === table.columns.length"
            class="inline-flex items-center gap-1.5 text-emerald-700"
          >
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>ถูกต้องครบ {{ table.columns.length }}/{{ table.columns.length }} คอลัมน์</span>
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 text-rose-700"
          >
            <XCircle class="w-4 h-4 shrink-0" />
            <span>ถูก {{ getTableScore(table) }}/{{ table.columns.length }} คอลัมน์ (ดูคำอธิบายในแถวสีแดง)</span>
          </span>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <button
            type="button"
            @click="resetTable(table.id)"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>รีเซ็ต</span>
          </button>

          <button
            type="button"
            @click="checkTable(table.id)"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            :class="table.buttonClass"
          >
            <Check class="w-3.5 h-3.5" />
            <span>ตรวจสอบ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
