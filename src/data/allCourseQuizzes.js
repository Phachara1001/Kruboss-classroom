/**
 * Built-in Quiz Questions Repository for all open courses and weeks.
 * Pre-test and Post-test use the EXACT same 10-question set for each week,
 * recorded into separate stores (Pre-test -> quizAttemptsStore, Post-test -> gameScoresStore).
 */

export const allCourseQuizzes = {
  "31901-2007": {
    "1": [
      {
        "id": "31901-2007-w1-q1",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดต่อไปนี้จัดว่าเป็น 'ข้อมูล (Data)' ที่แท้จริง?",
        "options": [
          {
            "id": "a",
            "text": "รายงานสรุปยอดขายประจำเดือนที่พิมพ์เสนอผู้บริหาร",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ตัวเลข 150, 200, 350 ที่จดบันทึกไว้บนเศษกระดาษโดยยังไม่ได้ประมวลผล",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "กราฟแท่งเปรียบเทียบผลกำไรขาดทุนประจำปี",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "บทวิเคราะห์พฤติกรรมการซื้อสินค้าของผู้บริโภค",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ข้อมูล (Data) คือข้อเท็จจริงดิบที่ยังไม่ได้ผ่านการประมวลผล ส่วนรายงานหรือกราฟสรุปจัดเป็น 'สารสนเทศ (Information)'",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q2",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ปัญหาใดที่มักเกิดขึ้นบ่อยที่สุดในระบบแฟ้มข้อมูลแบบดั้งเดิม (File-based System)?",
        "options": [
          {
            "id": "a",
            "text": "Data Redundancy (ความซ้ำซ้อนของข้อมูลที่ถูกบันทึกไว้หลายที่)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Data Encryption (การเข้ารหัสข้อมูลที่รัดกุมเกินไป)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "System Overheating (เซิร์ฟเวอร์มีความร้อนสูงเกินปกติ)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Automatic Indexing (ระบบจัดทำดัชนีอัตโนมัติมากเกินไป)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ในระบบแฟ้มข้อมูลดั้งเดิม ข้อมูลเดียวกันมักถูกเก็บซ้ำๆ ในหลายแผนก ทำให้เปลืองเนื้อที่และนำไปสู่ข้อมูลขัดแย้ง (Inconsistency)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q3",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "การใช้โปรแกรม Microsoft Excel ในการเก็บข้อมูลพนักงาน ถือว่าเป็นระบบจัดการฐานข้อมูล (DBMS) หรือไม่ เพราะเหตุใด?",
        "options": [
          {
            "id": "a",
            "text": "เป็น เพราะ Excel สามารถเรียงลำดับและใส่สูตรคำนวณได้",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ไม่เป็น เพราะ Excel เป็น Spreadsheet ขาดระบบจัดการ Transaction และการควบคุม Concurrent Access ที่ปลอดภัย",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เป็น เพราะมีหน้าตาเป็นตารางแถวและคอลัมน์เหมือนกัน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่เป็น เพราะ Excel ไม่สามารถบันทึกข้อความภาษาไทยได้",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Excel เป็น Spreadsheet ที่ออกแบบมาสำหรับคำนวณ ไม่ใช่ DBMS เพราะขาดกลไก ACID, การล็อกระดับเรคคอร์ด และการจัดการความปลอดภัยขั้นสูง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q4",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ใครคือผู้มีหน้าที่กำหนดโครงสร้างสถาปัตยกรรมฐานข้อมูล ดูแลสิทธิ์การเข้าถึง และการสำรอง/กู้คืนข้อมูล?",
        "options": [
          {
            "id": "a",
            "text": "Database Administrator (DBA - ผู้บริหารฐานข้อมูล)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "End User (ผู้ใช้ระบบทั่วไป)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Hardware Technician (ช่างประกอบคอมพิวเตอร์)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Data Entry Clerk (เจ้าหน้าที่พิมพ์ดีดเอกสาร)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "DBA มีหน้าที่รับผิดชอบบริหารจัดการภาพรวมทั้งหมดของฐานข้อมูล รวมถึงประสิทธิภาพ ความปลอดภัย และการสำรองข้อมูล",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q5",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ระดับการมองข้อมูล (Three-Level Architecture) ระดับใดที่ซ่อนความซับซ้อนและแสดงเฉพาะข้อมูลที่ผู้ใช้นั้นมีสิทธิ์ดู?",
        "options": [
          {
            "id": "a",
            "text": "Physical Level (ระดับกายภาพ)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Logical Level (ระดับตรรกะ)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "View Level หรือ External Level (ระดับวิว/ภายนอก)",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Storage Level (ระดับตัวแผ่นแม่เหล็ก)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "View Level เป็นระดับสูงสุดที่ติดต่อกับผู้ใช้ โดยสร้างมุมมองเฉพาะ (View) ให้ผู้ใช้เห็นเฉพาะส่วนที่เกี่ยวข้องกับหน้าที่ตนเอง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q6",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ระดับตรรกะ (Logical Level หรือ Conceptual Level) มีบทบาทหน้าที่สำคัญข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "อธิบายว่าฐานข้อมูลเก็บข้อมูลอะไรบ้าง มี Entity ใด และมีความสัมพันธ์ (Relationship) อย่างไร",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "กำหนดชนิดและรอบหมุนของจานแม่เหล็กในฮาร์ดดิสก์",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ออกแบบหน้าต่างกราฟิกสำหรับกดปุ่มคลิกของแอปมือถือ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "คำนวณค่าไฟฟ้าของห้องแม่ข่ายคอมพิวเตอร์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Logical Level เป็นระดับที่ DBA ออกแบบว่าระบบประกอบด้วยข้อมูลอะไรบ้าง มีฟิลด์ใด และเชื่อมโยงกันอย่างไร โดยไม่ขึ้นกับฮาร์ดแวร์",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q7",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "Physical Level (ระดับกายภาพ) เกี่ยวข้องกับสิ่งใดโดยตรง?",
        "options": [
          {
            "id": "a",
            "text": "การจัดเก็บข้อมูลจริงลงในหน่วยความจำ ฮาร์ดดิสก์ โครงสร้างไฟล์ และดัชนี (Indexing)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การตั้งชื่อหน้าจอเมนูให้กับผู้ใช้งานภายนอก",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การเขียนเงื่อนไขทางธุรกิจในใบเสร็จรับเงิน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การนำเสนอข้อมูลต่อคณะกรรมการบริษัท",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Physical Level เป็นระดับล่างสุดที่บอกว่าข้อมูลถูกแปลงเป็นไบต์และบล็อกจัดเก็บบนสื่อบันทึกข้อมูลอย่างไร",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q8",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "คุณสมบัติ 'ความเป็นอิสระของข้อมูล' (Data Independence) มีประโยชน์อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "สามารถปรับเปลี่ยนโครงสร้างระดับล่างได้โดยไม่ต้องเขียนโปรแกรมประยุกต์ใหม่ทั้งหมด",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำให้คอมพิวเตอร์ทำงานได้โดยไม่ต้องเสียบปลั๊กไฟ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "อนุญาตให้ใครก็ได้ลบฐานข้อมูลทิ้งได้ตลอดเวลา",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ยกเลิกระบบความปลอดภัยทั้งหมดเพื่อให้เข้าถึงได้เร็วขึ้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Independence แบ่งเป็น Physical และ Logical ช่วยให้การแก้โครงสร้างข้อมูลไม่กระทบโปรแกรมที่เรียกใช้งานอยู่",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q9",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ปัญหา 'Data Inconsistency' (ความไม่สอดคล้องกันของข้อมูล) มักส่งผลเสียต่อธุรกิจอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "เกิดข้อมูลขัดแย้งกันในระบบ ทำให้รายงานไม่ตรงกันและไม่รู้ว่าข้อมูลชุดใดถูกต้อง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำให้คีย์บอร์ดพิมพ์ตัวเลขไม่ติด",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ทำให้คอมพิวเตอร์ส่งเสียงแจ้งเตือนตลอดเวลา",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำให้กระดาษพิมพ์รายงานหมดเร็วกว่าปกติ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เมื่อข้อมูลซ้ำซ้อนถูกอัปเดตไม่ครบทุกจุด จะทำให้ข้อมูลแต่ละที่ขัดแย้งกัน เช่น ยอดสต็อกในบัญชีไม่ตรงกับยอดหน้าร้าน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w1-q10",
        "courseId": "31901-2007",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดคือข้อดีที่เด่นชัดที่สุดของการเปลี่ยนจากระบบแฟ้มข้อมูลมาเป็นระบบจัดการฐานข้อมูล (DBMS)?",
        "options": [
          {
            "id": "a",
            "text": "ลดความซ้ำซ้อน มีความปลอดภัยสูง ควบคุมการใช้งานพร้อมกันได้ และข้อมูลมีความถูกต้องน่าเชื่อถือ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ไม่ต้องซื้ออุปกรณ์คอมพิวเตอร์มาใช้งานอีกต่อไป",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ยกเลิกการตั้งรหัสผ่านเพื่อให้ทำงานได้รวดเร็วที่สุด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "บังคับให้ผู้ใช้งานทุกคนต้องเขียนภาษา SQL เป็นทุกคน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "DBMS ช่วยรวมศูนย์ข้อมูล ควบคุมการเข้าถึง ป้องกันความซ้ำซ้อน และรักษาความสมบูรณ์ถูกต้อง (Integrity) ของข้อมูล",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "2": [
      {
        "id": "31901-2007-w2-q1",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ทำไมในระบบฐานข้อมูล PostgreSQL และ Supabase จึงแนะนำให้จัดเก็บ 'ยอดเงิน/ราคาสินค้า' ด้วย numeric มากกว่า float?",
        "options": [
          {
            "id": "a",
            "text": "เพราะ float ประมวลผลได้ช้ากว่า numeric มาก",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพราะ float มีข้อจำกัดเรื่อง Floating-point Rounding Error ทำให้ทศนิยมปัดเศษคลาดเคลื่อน ส่วน numeric ให้ค่าแม่นยำแน่นอน",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพราะ float เก็บค่าติดลบไม่ได้",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะ Supabase ไม่อนุญาตให้ใช้ float ในทุกกรณี",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "float ใช้เลขฐานสองแทนทศนิยม จึงเกิดการปัดเศษคลาดเคลื่อนทางคณิตศาสตร์ได้ (เช่น 0.1 + 0.2 != 0.3) สำหรับการเงินจึงต้องใช้ numeric/decimal เสมอ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q2",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดคือ 'กฎเหล็ก 2 ข้อ' ของ Primary Key (คีย์หลัก) ที่ขาดไม่ได้เด็ดขาด?",
        "options": [
          {
            "id": "a",
            "text": "ต้องเป็นตัวเลขจำนวนเต็ม และต้องเรียงลำดับจากน้อยไปมาก",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ต้องเป็นค่าที่ไม่ซ้ำซ้อนกันในตาราง (Unique) และห้ามมีค่าว่าง (Not Null)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ต้องมีความยาวไม่เกิน 10 ตัวอักษร และต้องเป็นภาษาอังกฤษ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ต้องเชื่อมโยงไปยังตารางภายนอก และต้องมีดัชนี Index เสมอ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Primary Key มีข้อบังคับพื้นฐานตามหลัก Entity Integrity คือ ต้องระบุแต่ละแถวได้อย่างเป็นเอกลักษณ์ (Unique) และต้องมีค่าเสมอ (NOT NULL)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q3",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ใน Supabase และ PostgreSQL การจัดเก็บข้อความทั่วไป เช่น ชื่อ-นามสกุล หรือ ที่อยู่ ข้อใดคือ Best Practice ที่แนะนำมากที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "ใช้ char(255) เพื่อให้พื้นที่ตารางคงที่เท่ากันทุกแถว",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ใช้ text เพราะ PostgreSQL จัดการ Storage Engine ของ text และ varchar มีประสิทธิภาพเท่ากัน ไม่จำเป็นต้องกะความยาวล่วงหน้า",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ใช้ bytea เพราะปลอดภัยต่อการถูก SQL Injection",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ใช้ blob เพราะรองรับภาษาไทยได้ดีกว่า",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ใน PostgreSQL ชนิดข้อมูล text, varchar และ varchar(n) ใช้วิธีจัดเก็บแบบเดียวกัน ความเร็วเท่ากัน จึงนิยมใช้ text เพื่อความยืดหยุ่น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q4",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "เพราะเหตุใด 'หมายเลขโทรศัพท์ (Phone Number)' และ 'เลขบัตรประชาชน 13 หลัก' จึงห้ามเก็บเป็นชนิดข้อมูล integer?",
        "options": [
          {
            "id": "a",
            "text": "เพราะฐานข้อมูลจะปฏิเสธไม่ให้บันทึกถ้ามีเลข 9",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพราะตัวเลขเหล่านี้มีเลข 0 นำหน้า ซึ่งชนิด integer จะตัดเลข 0 ตัวหน้าทิ้งทันที และข้อมูลนี้เป็นรหัสระบุตัวตนไม่ได้นำไปคำนวณ",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพราะ integer เก็บข้อมูลได้ไม่เกิน 5 หลัก",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะ Supabase บังคับให้เบอร์โทรศัพท์ต้องเป็น boolean เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เบอร์โทรศัพท์ขึ้นต้นด้วย 0 เช่น '0812345678' หากเป็น int ระบบจะตัดเลข 0 ทิ้งเหลือ 812345678 และไม่ได้นำไปบวกลบคูณหาร จึงต้องเก็บเป็น text/varchar",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q5",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อดีสำคัญที่สุดของการเลือกใช้ 'UUID' เป็น Primary Key บนระบบ Cloud DBMS (Supabase) เมื่อเทียบกับ Auto-increment (1, 2, 3...) คืออะไร?",
        "options": [
          {
            "id": "a",
            "text": "ใช้พื้นที่ฮาร์ดดิสก์น้อยกว่าตัวเลขจำนวนเต็ม",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ป้องกันการคาดเดา ID (Enumeration Attack) และสร้าง ID ได้จาก Client/หลาย Server พร้อมกันโดยไม่ชนกัน",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ค้นหาข้อมูลได้เร็วกว่าตัวเลข 10 เท่าเสมอ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "สามารถพิมพ์ด้วยตัวพิมพ์ใหญ่เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "UUID ป้องกันแฮกเกอร์เดารหัส เช่น เปลี่ยน URL จาก /orders/101 เป็น /orders/102 และเหมาะกับระบบคลาวด์แบบกระจายศูนย์ (Distributed Systems)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q6",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "หากต้องการบันทึกวันเวลาที่สร้างข้อมูล โดยปรับเวลาตามโซนเวลาสากลอัตโนมัติ ควรเลือกชนิดข้อมูลและค่า Default ใดใน Supabase?",
        "options": [
          {
            "id": "a",
            "text": "date และค่าเริ่มต้น '2026-01-01'",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "timestamptz พร้อมค่าเริ่มต้น now()",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "time พร้อมค่าเริ่มต้น CURRENT_DATE",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "varchar(20) พร้อมค่าเริ่มต้น 'today'",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "timestamptz (Timestamp with time zone) เก็บเวลาแบบ UTC และแปลงตามโซนเวลาของผู้ใช้ได้อย่างถูกต้อง คู่กับฟังก์ชัน now() หรือ CURRENT_TIMESTAMP",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q7",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อกำหนด (Constraint) ชนิดใดที่ใช้สำหรับตรวจสอบเงื่อนไขทางตรรกะของข้อมูล เช่น 'ราคาสินค้าต้องมากกว่า 0' หรือ 'อายุต้องอยู่ระหว่าง 15 ถึง 100 ปี'?",
        "options": [
          {
            "id": "a",
            "text": "FOREIGN KEY",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "CHECK Constraint",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "AUTO_INCREMENT",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "NOT NULL",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "CHECK Constraint ใช้กำหนดเงื่อนไขทางตรรกะ หากข้อมูลที่ Insert หรือ Update ไม่ผ่านเงื่อนไข ระบบจะปฏิเสธและแจ้ง Error ทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q8",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดอธิบายความแตกต่างระหว่าง 'PRIMARY KEY' และ 'UNIQUE Constraint' ได้ถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "PRIMARY KEY ยอมให้มีค่าว่าง (NULL) ได้ 1 แถว ส่วน UNIQUE ห้ามมีค่าว่าง",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "1 ตารางมี PRIMARY KEY ได้เพียงชุดเดียวและห้ามเป็น NULL ส่วน UNIQUE มีได้หลายคอลัมน์ในตารางเดียวกันและยอมให้เป็น NULL ได้",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "UNIQUE ใช้ได้เฉพาะตัวเลข ส่วน PRIMARY KEY ใช้ได้เฉพาะข้อความ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทั้งสองข้อกำหนดทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตารางมี PK ได้เพียง 1 ตัวและห้ามเป็น NULL แต่สามารถสร้าง UNIQUE Constraint ได้หลายคอลัมน์ (เช่น email, phone) และยอมรับค่า NULL หากไม่ได้ล็อก NOT NULL",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q9",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "คำสั่ง SQL DDL ข้อใดต่อไปนี้สร้างคอลัมน์ auto-increment ที่เป็น Primary Key ตามมาตรฐาน PostgreSQL ยุคใหม่บน Supabase ได้ถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "id number AUTO_INCREMENT PRIMARY KEY",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "id integer CHECK (id > 0)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "id text DEFAULT 'auto'",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "มาตรฐาน SQL สากลและ PostgreSQL ยุคใหม่ใช้ GENERATED ALWAYS/BY DEFAULT AS IDENTITY แทนชนิดข้อมูล serial แบบเก่า",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w2-q10",
        "courseId": "31901-2007",
        "week": 2,
        "type": "choice",
        "question": "หากต้องการเก็บข้อมูล 'สถานะคำสั่งซื้อ' โดยจำกัดให้ใส่ได้เพียง 'pending', 'paid', 'shipped', หรือ 'cancelled' เท่านั้น ควรใช้ข้อกำหนดใด?",
        "options": [
          {
            "id": "a",
            "text": "DEFAULT 'shipped'",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "CHECK (order_status IN ('pending', 'paid', 'shipped', 'cancelled'))",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "UNIQUE (order_status)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "PRIMARY KEY (order_status)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การใช้ CHECK ร่วมกับคำสั่ง IN ช่วยควบคุมโดเมนของข้อมูล (Domain Integrity) ป้องกันไม่ให้มีการสะกดคำผิดหรือใส่สถานะที่ไม่ได้รับอนุญาต",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "3": [
      {
        "id": "31901-2007-w3-q1",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "ตัวย่อ 'CRUD' ในการจัดการฐานข้อมูล ประกอบด้วย 4 การกระทำพื้นฐานที่มีลำดับความหมายตรงกับข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "Create (สร้าง), Remove (ลบ), Update (แก้ไข), Duplicate (ทำสำเนา)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Connect (เชื่อมต่อ), Read (อ่าน), Unlink (ยกเลิก), Delete (ลบ)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Create (เพิ่มข้อมูล), Read (อ่าน/สืบค้น), Update (แก้ไข), Delete (ลบ)",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Control (ควบคุม), Retrieve (ดึงข้อมูล), Upload (ส่งข้อมูล), Drop (ทิ้งตาราง)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "CRUD เป็นคำย่อสากลของการดำเนินการกับข้อมูล 4 ประการ ได้แก่ Create (สร้าง/เพิ่มแถวใหม่), Read (อ่านหรือคิวรีข้อมูล), Update (แก้ไขข้อมูลเดิม), และ Delete (ลบข้อมูล)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q2",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง SQL ข้อใดต่อไปนี้ใช้เพิ่มข้อมูลนักศึกษาใหม่ 1 แถวเข้าสู่ตาราง students ได้ถูกต้องตามหลักไวยากรณ์?",
        "options": [
          {
            "id": "a",
            "text": "INSERT INTO students (prefix, firstname, lastname, year) VALUES ('นาย', 'สมชาย', 'ใจดี', 1);",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "INSERT INTO students (prefix, firstname, lastname, year) SET ('นาย', 'สมชาย', 'ใจดี', 1);",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "INSERT TO students VALUES (prefix='นาย', firstname='สมชาย', lastname='ใจดี', year=1);",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "INSERT INTO students (prefix, firstname, lastname, year) VALUES (\"นาย\", \"สมชาย\", \"ใจดี\", \"1\");",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ไวยากรณ์มาตรฐานของ SQL คือ INSERT INTO ตามด้วยชื่อตาราง ระบุชื่อคอลัมน์ในวงเล็บ แล้วตามด้วยคีย์เวิร์ด VALUES พร้อมส่งค่าข้อมูลที่เรียงลำดับตรงกัน โดยข้อความต้องครอบด้วย single quote ('...')",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q3",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "ในภาษา SQL หากต้องการสืบค้นเฉพาะนักศึกษาที่ 'ยังไม่มีเบอร์โทรศัพท์' (เป็นค่าว่างในฐานข้อมูล) ต้องเขียนเงื่อนไข WHERE อย่างไรจึงจะถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "WHERE telephone = NULL;",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "WHERE telephone = '';",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "WHERE telephone == 'NULL';",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "WHERE telephone IS NULL;",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "ในฐานข้อมูลเชิงสัมพันธ์ ค่า NULL คือความว่างเปล่าที่ไม่มีค่าอยู่จริง จึงไม่สามารถใช้ตัวดำเนินการ = หรือ == เปรียบเทียบได้ ต้องใช้คำสั่ง IS NULL (หรือ IS NOT NULL) เท่านั้น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q4",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "เมื่อรันคำสั่ง 'SELECT DISTINCT year FROM students;' ผลลัพธ์ที่ได้จากการประมวลผลจะเป็นอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "แสดงรายชื่อนักศึกษาทั้งหมดโดยเรียงลำดับตามชั้นปีจากน้อยไปหามาก",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "แสดงเฉพาะค่าระดับชั้นปีที่ไม่ซ้ำกัน โดยตัดค่าชั้นปีที่ซ้ำซ้อนออกทั้งหมด",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "กรองเฉพาะแถวนักศึกษาที่ข้อมูลในคอลัมน์ year ไม่เป็นค่าว่าง (Not Null)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "คำนวณนับจำนวนนักศึกษาทั้งหมดที่สังกัดอยู่ในแต่ละระดับชั้นปี",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คีย์เวิร์ด DISTINCT ทำหน้าที่คัดกรองแถวผลลัพธ์ที่มีค่าซ้ำกันในคอลัมน์ที่เลือกออกไป เพื่อแสดงเฉพาะค่าที่เป็นเอกลักษณ์ (Unique values) เพียงค่าละ 1 บรรทัด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q5",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "ในระบบฐานข้อมูล PostgreSQL บน Supabase คำสั่ง ILIKE มีพฤติกรรมการค้นหาที่แตกต่างจากคำสั่ง LIKE ปกติอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ILIKE ใช้ค้นหาข้อมูลเฉพาะชนิดตัวเลข ส่วน LIKE ใช้ค้นหาข้อมูลชนิดข้อความ",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ILIKE บังคับค้นหาคำที่ตรงกันเป๊ะ 100% ส่วน LIKE อนุญาตให้มีคำสะกดผิดได้",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ILIKE ไม่คำนึงถึงความต่างของตัวพิมพ์เล็ก/ใหญ่ (Case-insensitive) ส่วน LIKE แยกตัวพิมพ์เล็ก/ใหญ่",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "ILIKE ค้นหาข้อมูลได้เร็วกว่าเนื่องจากระบบจะสร้าง Index ให้โดยอัตโนมัติขณะรัน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ใน PostgreSQL คำสั่ง LIKE จะเป็น Case-sensitive (เช่น 'Somchai' จะไม่เจอ 'somchai') แต่คำสั่ง ILIKE (Insensitive LIKE) จะมองข้ามความต่างของตัวพิมพ์เล็กและใหญ่ ทำให้สะดวกในการค้นหาข้อความ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q6",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง 'SELECT * FROM students WHERE firstname ILIKE '%สม%';' จะดึงข้อมูลนักศึกษาคนใดออกมาบ้าง?",
        "options": [
          {
            "id": "a",
            "text": "ดึงเฉพาะนักศึกษาที่มีชื่อว่า 'สม' พอดีเป๊ะเพียง 2 ตัวอักษรเท่านั้น",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ดึงเฉพาะนักศึกษาที่มีชื่อลงท้ายด้วยคำว่า 'สม' เท่านั้น เช่น 'พรสม'",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ดึงเฉพาะนักศึกษาที่มีชื่อขึ้นต้นด้วยคำว่า 'สม' เท่านั้น เช่น 'สมชาย', 'สมศักดิ์'",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ดึงนักศึกษาทุกคนที่มีคำว่า 'สม' ปรากฏอยู่ตรงส่วนใดก็ได้ของชื่อจริง",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "เครื่องหมาย Wildcard '%' มีความหมายว่ามีตัวอักษรใดๆ จำนวนเท่าใดก็ได้ การใส่ '%สม%' ประกบทั้งหน้าและหลังจึงหมายถึงชื่อที่มีคำว่า 'สม' อยู่ตำแหน่งใดก็ได้ (ต้นชื่อ กลางชื่อ หรือท้ายชื่อ)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q7",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง 'WHERE year BETWEEN 1 AND 2;' มีขอบเขตการดึงข้อมูลเทียบเท่ากับการเขียนเงื่อนไขในข้อใดอย่างถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "WHERE year >= 1 AND year <= 2;",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "WHERE year > 1 AND year < 2;",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "WHERE year = 1 OR year = 3;",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "WHERE year >= 1 AND year < 2;",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตัวดำเนินการ BETWEEN ในภาษา SQL มีคุณสมบัติเป็น Inclusive คือนับรวมค่าขอบเขตทั้งสองด้าน (รวมทั้งค่า 1 และ 2 เข้าไปด้วย)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q8",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการดึงรายชื่อนักศึกษาโดย 'เรียงจากชั้นปีมากไปน้อย (ปี 2 ก่อนปี 1) และจำกัดแสดงผลเพียง 5 คนแรก' ต้องเขียนคำสั่งต่อท้าย SQL อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "SORT BY year ASC LIMIT 5;",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ORDER BY year ASC LIMIT 5;",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ORDER BY year DESC LIMIT 5;",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "ORDER BY year DESC TOP 5;",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การเรียงจากมากไปน้อยต้องใช้ ORDER BY ตามด้วยคอลัมน์และคำว่า DESC (Descending) และการจำกัดจำนวนแถวใน PostgreSQL ใช้คำสั่ง LIMIT ไม่ใช่คำว่า TOP (TOP เป็นคำสั่งของ MS SQL Server)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q9",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "ทำไมการรันคำสั่ง 'UPDATE students SET year = 2;' โดยไม่มีเงื่อนไข WHERE จึงจัดเป็นข้อผิดพลาดร้ายแรง?",
        "options": [
          {
            "id": "a",
            "text": "เพราะจะทำให้คำสั่งติด Syntax Error และถูกระบบ Supabase ระงับบัญชีถาวร",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพราะระบบจะเปลี่ยนค่าชั้นปีของนักศึกษา 'ทุกแถวในตาราง' ให้กลายเป็นปี 2 ทั้งหมด",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพราะระบบจะไม่อนุญาตให้อัปเดตและจะทำการ Rollback ลบตารางทิ้งทันที",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะคำสั่งจะสุ่มเลือกอัปเดตเฉพาะแถวแรกสุดของตารางเพียงแถวเดียว",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง UPDATE หรือ DELETE ใน SQL หากไม่ระบุเงื่อนไข WHERE คำสั่งจะมีผลต่อทุกระเบียนข้อมูล (All Records) ในตารางทันทีโดยไม่มีการแจ้งเตือนถามซ้ำ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w3-q10",
        "courseId": "31901-2007",
        "week": 3,
        "type": "choice",
        "question": "ก่อนที่จะตัดสินใจรันคำสั่ง 'DELETE FROM students WHERE year = 4;' แนวปฏิบัติที่ปลอดภัยที่สุด (Safe Practice) คือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "เขียนคำสั่ง DROP TABLE students; เพื่อล้างตารางแล้วสร้างโครงสร้างใหม่",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เปลี่ยนเงื่อนไขเป็น WHERE year != 4; เพื่อทดสอบลบกลุ่มอื่นดูก่อน",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "สั่งคำสั่ง UPDATE students SET year = 0; เพื่อทำเครื่องหมายว่าพร้อมลบ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เขียนคำสั่ง SELECT * FROM students WHERE year = 4; มารันตรวจสอบแถวเป้าหมายก่อน",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "การรันคำสั่ง SELECT ด้วยเงื่อนไข WHERE เดียวกันก่อน จะช่วยให้ผู้ใช้งานมองเห็นเรคคอร์ดข้อมูลที่จะได้รับผลกระทบด้วยตาตนเองก่อนทำการลบจริง ป้องกันการลบข้อมูลผิดพลาดได้อย่างปลอดภัย 100%",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "4": [
      {
        "id": "31901-2007-w4-q1",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "สาเหตุสำคัญที่สุดที่ระบบฐานข้อมูลเชิงสัมพันธ์ (RDBMS) ต้องแยกข้อมูลออกเป็นหลายตารางคือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "ลดความซ้ำซ้อนของข้อมูล (Data Redundancy) และป้องกันความผิดพลาดในการแก้ไขหรือลบข้อมูล",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำให้พื้นที่จัดเก็บข้อมูลบนฮาร์ดดิสก์เพิ่มขึ้น 2 เท่า",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพื่อให้สามารถใส่รหัสผ่านได้หลายชุดในตารางเดียว",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ระบบฐานข้อมูลบังคับให้มีได้ตารางละ 1 คอลัมน์เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การเก็บข้อมูลทุกอย่างไว้ในตารางเดียวจะทำให้เกิดข้อมูลซ้ำซ้อน (Redundancy) เช่น พิมพ์ชื่อแผนกเดิมซ้ำเป็นพันครั้ง และเกิดปัญหาผิดพลาดเวลาแก้ไขหรือลบข้อมูล (Data Anomalies)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q2",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "ในความสัมพันธ์แบบ 1 to Many (1:N) เช่น 1 สาขาวิชา (departments) มีนักศึกษาในสังกัดได้หลายคน (students) คอลัมน์ Foreign Key (department_id) ต้องถูกสร้างไว้ที่ตารางใด?",
        "options": [
          {
            "id": "a",
            "text": "ตาราง students (ฝั่ง Many)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ตาราง departments (ฝั่ง 1)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ต้องสร้างทั้งสองตารางพร้อมกัน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่ต้องสร้างที่ไหนเลย เพราะระบบเชื่อมโยงด้วยชื่อตารางเอง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "กฎเหล็กของความสัมพันธ์ 1 to Many คือ \"Foreign Key ต้องอยู่ฝั่ง Many เสมอ\" เพื่อให้นักศึกษาแต่ละแถวเก็บรหัสอ้างอิงกลับไปยังสาขาวิชาที่ตนสังกัดได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q3",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "ข้อใดคือตัวอย่างความสัมพันธ์ของข้อมูลแบบ One-to-One (1:1) ในชีวิตจริง?",
        "options": [
          {
            "id": "a",
            "text": "ประชาชน 1 คน มีหมายเลขบัตรประจำตัวประชาชนได้ 1 ใบ และบัตรใบนั้นเป็นของคนๆ นั้นคนเดียว",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ลูกค้า 1 คน สามารถสั่งซื้อสินค้าได้หลายออเดอร์",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "นักศึกษา 1 คน ลงทะเบียนเรียนได้หลายวิชา",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "อาจารย์ 1 ท่าน สอนนักศึกษาได้หลายคน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ความสัมพันธ์แบบ 1:1 หมายถึง ข้อมูล 1 รายการในตารางแรก สัมพันธ์กับข้อมูลเพียง 1 รายการในตารางที่สอง เช่น บัตรประชาชนกับเจ้าของบัตร",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q4",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "ความสัมพันธ์แบบ Many-to-One (N:1) มีความหมายอย่างไรเมื่อเทียบกับ One-to-Many (1:N)?",
        "options": [
          {
            "id": "a",
            "text": "เป็นความสัมพันธ์แบบเดียวกัน เพียงแต่มองจากมุมของฝั่ง Many ย้อนกลับไปหาฝั่ง 1",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เป็นคนละเรื่องกันโดยสิ้นเชิง",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Many-to-One ไม่สามารถสร้าง Foreign Key ได้",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Many-to-One ใช้ได้เฉพาะกับฐานข้อมูล NoSQL เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Many-to-One เป็นเพียงการมองย้อนมุมของ 1:N เช่น \"นักศึกษาหลายคน สังกัดอยู่ 1 สาขาวิชา\" (N:1) ก็คือเรื่องเดียวกับ \"1 สาขาวิชา มีนักศึกษาหลายคน\" (1:N)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q5",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "เหตุใดระบบฐานข้อมูลเชิงสัมพันธ์จึงไม่สามารถเชื่อมโยง Many-to-Many (N:M) ระหว่าง 2 ตารางได้โดยตรง?",
        "options": [
          {
            "id": "a",
            "text": "เพราะไม่สามารถใส่รหัส ID หลายๆ ค่าเป็นลิสต์คั่นด้วยจุลภาคลงในคอลัมน์เดียวได้ (ผิดกฎความเป็นอะตอม 1NF)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพราะไมโครซอฟท์และออราเคิลไม่ได้จดสิทธิบัตรนี้ไว้",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะระบบฐานข้อมูลรองรับ Foreign Key ได้แค่ตารางละ 1 ตัว",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะตัวเลข ID ของนักศึกษาจะชนกับตัวเลข ID ของวิชาเรียน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ในฐานข้อมูลเชิงสัมพันธ์ แต่ละช่องของแถวต้องเก็บค่าเดี่ยว (Atomic Value) การเก็บ ID หลายตัวเป็นลิสต์จะทำให้ค้นหา เรียงลำดับ และตรวจสอบความถูกต้องของข้อมูลไม่ได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q6",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "ตารางตัวกลาง (Junction Table หรือ Bridge Table) ทำหน้าที่อย่างไรในการแก้ปัญหา Many-to-Many?",
        "options": [
          {
            "id": "a",
            "text": "ทำหน้าที่แตกความสัมพันธ์ Many-to-Many ออกเป็นความสัมพันธ์ 1 to Many จำนวน 2 เส้นเชื่อมเข้าหาตารางกลาง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำหน้าที่สำรองข้อมูลตารางเก่าไว้เมื่อฮาร์ดดิสก์เต็ม",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ทำหน้าที่เปลี่ยนรหัสผ่านของผู้ดูแลระบบฐานข้อมูล",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำหน้าที่ลบข้อมูลทั้งสองตารางทิ้งพร้อมกัน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Junction Table เช่น ตาราง enrollments จะเก็บ Foreign Key จากทั้งตารางนักศึกษาและตารางวิชาเรียน ทำให้ความสัมพันธ์ N:M กลายเป็น 1:N สองเส้นได้อย่างสมบูรณ์",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q7",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "ในตารางตัวกลาง enrollments ที่เชื่อมระหว่าง students กับ courses คอลัมน์ที่จำเป็นต้องมีอย่างน้อยที่สุดคือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "student_id (FK อ้างอิง students) และ course_id (FK อ้างอิง courses)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เบอร์โทรศัพท์ของนักศึกษา และชื่อวิชา",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "รหัสผ่านผู้ดูแลระบบ และ IP Address",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ยอดเงินคงเหลือในบัญชีธนาคาร",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตารางตัวกลางจะต้องมี Foreign Key อย่างน้อย 2 ตัวที่ชี้กลับไปยัง Primary Key ของตารางแม่ทั้งสองฝั่ง เพื่อบอกว่า \"ใคร (student_id) ลงทะเบียนวิชาอะไร (course_id)\"",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q8",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "เงื่อนไข ON DELETE CASCADE เมื่อกำหนดให้กับ Foreign Key มีผลต่อการทำงานอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "เมื่อแถวข้อมูลในตารางแม่ถูกลบ ข้อมูลที่เชื่อมโยงกันในตารางลูกจะถูกลบทิ้งตามไปด้วยโดยอัตโนมัติ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ห้ามลบข้อมูลในตารางแม่เด็ดขาดถ้ายังมีข้อมูลลูกอยู่",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เปลี่ยนค่า Foreign Key ให้กลายเป็นข้อความว่างเปล่า (NULL)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "สำเนาข้อมูลที่ถูกลบส่งไปยังอีเมลของอาจารย์ผู้สอน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "CASCADE หมายถึง \"การไหลต่อกันเป็นทอดๆ\" เมื่อลบข้อมูลตารางแม่ (เช่น ลบนักศึกษา) รายการลงทะเบียนเรียนของนักศึกษาคนนั้นในตารางลูกจะถูกลบทิ้งตามไปอัตโนมัติ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q9",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "หากเราต้องการป้องกันไม่ให้ผู้ใช้เผลอลบ \"สาขาวิชา\" ที่ยังมีนักศึกษาเรียนอยู่ ควรตั้งค่าข้อกำหนดการลบของ Foreign Key เป็นแบบใด?",
        "options": [
          {
            "id": "a",
            "text": "ON DELETE RESTRICT (หรือ NO ACTION) เพื่อระงับการลบและแจ้งเตือนข้อผิดพลาด",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ON DELETE CASCADE",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "DROP DATABASE ALL",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "DELETE WITHOUT WHERE",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "RESTRICT จะไม่อนุญาตให้ลบข้อมูลตารางแม่ ตราบใดที่ยังมีข้อมูลในตารางลูกอ้างอิงถึงอยู่ เพื่อป้องกันไม่ให้นักศึกษากลายเป็นเด็กไร้สังกัด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w4-q10",
        "courseId": "31901-2007",
        "week": 4,
        "type": "choice",
        "question": "บนระบบ Supabase Dashboard หากต้องการเปิดดูแผนภาพเส้นสายความสัมพันธ์ (ER Diagram) ระหว่างตารางทั้งหมด ต้องไปที่เมนูใด?",
        "options": [
          {
            "id": "a",
            "text": "เมนู Schema Visualizer ในหมวด Database",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เมนู Project Settings",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ปุ่ม Start Simulation",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เมนู Storage Buckets",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Supabase มีเครื่องมือ Schema Visualizer ที่ช่วยวาดไดอะแกรมความสัมพันธ์ระหว่างตารางและเส้นโยง Foreign Key ให้เห็นเป็นภาพกราฟิกแบบอัตโนมัติ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "5": [
      {
        "id": "31901-2007-w5-q1",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "ในการลงมือสร้างฐานข้อมูลเชิงสัมพันธ์ที่มีทั้งตาราง categories, products และ order_items เหตุใดจึงต้องสร้างตาราง categories ก่อนตาราง products เสมอ?",
        "options": [
          {
            "id": "a",
            "text": "เพราะตาราง products ต้องอ้างอิง Foreign Key ไปยัง categories(id) หากยังไม่มีตาราง categories จะเกิด Error ทันที",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพราะชื่อ categories ขึ้นต้นด้วยตัวอักษร C ซึ่งมาก่อนตัว P",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะตาราง categories เก็บข้อมูลได้น้อยกว่า",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "สามารถสร้างตารางไหนก่อนก็ได้ ระบบจะเดาตารางแม่ให้เอง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ในระบบ RDBMS ตารางปลายทางที่ถูกอ้างอิง (Parent Table) ต้องมีตัวตนอยู่ในฐานข้อมูลก่อน จึงจะสามารถสร้าง Foreign Key จากตารางลูกชี้ไปหาได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q2",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "ชนิดข้อมูล (Data Type) ของคอลัมน์ Foreign Key ในตารางลูก ต้องสัมพันธ์กับคอลัมน์ Primary Key ของตารางแม่อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ต้องเป็นชนิดข้อมูลเดียวกันหรือเข้ากันได้ (เช่น ถ้า PK เป็น BIGINT/int8 คอลัมน์ FK ก็ต้องเป็น BIGINT/int8 ด้วย)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ต้องเป็นชนิดข้อมูลต่างกันเสมอ เช่น PK เป็นตัวเลข FK ต้องเป็นข้อความ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "บังคับให้ใช้ชนิดข้อมูล BOOLEAN เท่านั้นสำหรับ Foreign Key",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่ต้องกำหนดชนิดข้อมูลให้กับคอลัมน์ Foreign Key",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คอลัมน์ Foreign Key และ Primary Key ที่เชื่อมโยงกันต้องมีชนิดข้อมูลตรงกัน เช่น BIGINT (int8) กับ BIGINT หรือ UUID กับ UUID มิฉะนั้น PostgreSQL จะไม่อนุญาตให้ผูกความสัมพันธ์",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q3",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "เมื่อสร้างตารางผ่านหน้าจอ GUI ของ Supabase Table Editor หากต้องการผูกความสัมพันธ์ Foreign Key ให้กับคอลัมน์ ต้องคลิกที่สัญลักษณ์ใด?",
        "options": [
          {
            "id": "a",
            "text": "ไอคอนรูปโซ่คล้อง (Link / Add Foreign Key Relation) ด้านขวาของคอลัมน์ หรือปุ่ม Add Foreign Key",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ไอคอนรูปถังขยะสีแดง",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ปุ่ม Log Out มุมซ้ายล่าง",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไอคอนรูปไมโครโฟน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ในหน้าต่างสร้างหรือแก้ไขคอลัมน์ของ Supabase จะมีไอคอนรูปโซ่ (Link relation) สำหรับเลือก Schema, ตารางเป้าหมาย และคอลัมน์เป้าหมาย",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q4",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "ตาราง order_items ที่เชื่อมโยงระหว่าง orders (ใบสั่งซื้อ) กับ products (สินค้า) ถือเป็นตารางประเภทใดในระบบฐานข้อมูลเชิงสัมพันธ์?",
        "options": [
          {
            "id": "a",
            "text": "Junction Table (หรือ Bridge Table) เพื่อแปลงความสัมพันธ์ Many-to-Many (N:M) ให้เป็น One-to-Many (1:N) สองฝั่ง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Log Table ใช้บันทึกข้อความ error ของระบบ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Backup Table ตารางสำรองข้อมูลชั่วคราว",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Virtual Table ตารางจำลองที่ไม่มีการเก็บข้อมูลจริง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตารางกลางที่ประกอบด้วย Foreign Key ชี้ไปยังตารางหลัก 2 ตารางเพื่อแก้ปัญหาความสัมพันธ์ N:M เรียกว่า Junction Table หรือ Bridge Table",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q5",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "หากเรากำหนดเงื่อนไขการลบ Foreign Key เป็น ON DELETE CASCADE ในตาราง order_items ชี้ไปที่ orders จะเกิดอะไรขึ้นเมื่อลบข้อมูลใบสั่งซื้อ 1 แถว?",
        "options": [
          {
            "id": "a",
            "text": "รายการสินค้าทั้งหมดใน order_items ที่ผูกกับ orders นั้นจะถูกลบออกอัตโนมัติ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ระบบจะปฏิเสธการลบและเกิดข้อผิดพลาด Error",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ตาราง orders ทั้งหมดจะถูกลบทิ้งทั้งตาราง",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ข้อมูลสินค้าใน order_items จะถูกเปลี่ยนเป็นค่า 0",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ON DELETE CASCADE หมายความว่าเมื่อแถวข้อมูลในตารางแม่ (Orders) ถูกลบ แถวข้อมูลในตารางลูก (Order_items) ที่อ้างอิงอยู่จะถูกลบทิ้งตามไปด้วยโดยอัตโนมัติ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q6",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "หากเรากำหนดเงื่อนไข ON DELETE RESTRICT (หรือ NO ACTION) ในตาราง products ชี้ไปยัง categories จะส่งผลอย่างไรเมื่อผู้ใช้พยายามลบหมวดหมู่ที่มีสินค้าผูกอยู่?",
        "options": [
          {
            "id": "a",
            "text": "ระบบจะบล็อกไม่อนุญาตให้ลบ และแจ้งข้อผิดพลาดว่ายังมีข้อมูลสินค้าลูกอ้างอิงอยู่",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "สินค้าทั้งหมดในหมวดหมู่นั้นจะถูกลบไปด้วยทันที",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "หมวดหมู่จะถูกลบ แล้วเปลี่ยนค่า category_id ของสินค้าเป็น NULL",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ระบบจะสุ่มย้ายสินค้าไปหมวดหมู่อื่นแทน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "RESTRICT หรือ NO ACTION จะช่วยป้องกันความคงสภาพของข้อมูล (Referential Integrity) โดยไม่อนุญาตให้ลบข้อมูลแม่ตราบใดที่ยังมีข้อมูลลูกอ้างอิงอยู่",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q7",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "ในระบบสั่งซื้อสินค้า ทำไมคอลัมน์ product_id ในตาราง order_items จึงควรใช้ ON DELETE RESTRICT แทนที่จะเป็น ON DELETE CASCADE?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อไม่ให้ประวัติการสั่งซื้อและสลิปรายการขายในอดีตสูญหายเมื่อมีการยกเลิกหรือลบสินค้านั้นออกจากระบบ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพื่อประหยัดพื้นที่ฮาร์ดดิสก์ของ Supabase",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะระบบ Supabase ไม่อนุญาตให้ใช้ CASCADE เกิน 1 จุด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะคำสั่ง RESTRICT ประมวลผลได้เร็วกว่า CASCADE เสมอ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หากตั้งเป็น CASCADE กับสินค้า เวลาลบสินค้าออกจากแคตตาล็อก ประวัติยอดขายในบิลเก่าๆ จะหายไปทำให้บัญชีผิดพลาด จึงต้องใช้ RESTRICT เพื่อปกป้องประวัติการซื้อขาย",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q8",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "คำสั่ง SQL ใดใช้สำหรับดึงข้อมูลจากตาราง products และตาราง categories มาแสดงผลรวมกันเฉพาะแถวที่มีความสัมพันธ์ตรงกัน?",
        "options": [
          {
            "id": "a",
            "text": "SELECT * FROM products p INNER JOIN categories c ON p.category_id = c.id;",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "SELECT * FROM products MERGE categories;",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "COMBINE TABLE products WITH categories;",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "INSERT INTO products SELECT categories;",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง INNER JOIN ... ON ... ใช้เชื่อมตารางตั้งแต่ 2 ตารางขึ้นไปโดยตรวจสอบเงื่อนไขความเท่ากันระหว่าง Foreign Key กับ Primary Key",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q9",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "หากเผลอสร้างตารางลูกเสร็จไปแล้ว แต่ลืมกำหนด Foreign Key เราสามารถเพิ่มความสัมพันธ์ในภายหลังได้อย่างไรบน Supabase?",
        "options": [
          {
            "id": "a",
            "text": "แก้ไขตารางใน Table Editor แล้วกดผูก Foreign Key หรือรันคำสั่ง ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ต้องลบโปรเจกต์ Supabase ทิ้งแล้วสมัครสมาชิกใหม่เท่านั้น",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ไม่สามารถแก้ไขได้อีกเลยตลอดไป",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ต้องเปลี่ยนชื่อตารางให้เป็นตัวพิมพ์ใหญ่ทั้งหมด",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เราสามารถเพิ่ม Foreign Key ย้อนหลังได้ทั้งผ่านปุ่ม Edit Table ในหน้า Table Editor หรือใช้คำสั่ง SQL ALTER TABLE",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2007-w5-q10",
        "courseId": "31901-2007",
        "week": 5,
        "type": "choice",
        "question": "หลังจากสร้างตารางทั้ง 5 ตารางและผูก Foreign Key เสร็จเรียบร้อย เราสามารถตรวจสอบว่าเส้นความสัมพันธ์เชื่อมต่อกันครบถ้วนหรือไม่จากเมนูใดใน Supabase?",
        "options": [
          {
            "id": "a",
            "text": "ไปที่เมนู Database > Schema Visualizer เพื่อดูแผนภาพตารางและเส้นเชื่อมโยง Foreign Key ทั้งหมด",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ไปที่เมนู Authentication > Users",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ไปที่เมนู Storage > Buckets",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไปที่เมนู Edge Functions",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Schema Visualizer ในหมวด Database จะแสดงตารางทั้งหมดพร้อมเส้นเชื่อมจากคอลัมน์ Foreign Key ไปยัง Primary Key ทำให้ตรวจสอบความถูกต้องได้ทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ]
  },
  "21901-2012": {
    "1": [
      {
        "id": "21901-2012-w1-q1",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดคือความหมายและเป้าหมายที่แท้จริงของคำว่า 'DevOps'?",
        "options": [
          {
            "id": "a",
            "text": "เครื่องมือเขียนโปรแกรมคอมไพเลอร์ภาษาใหม่",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "วัฒนธรรมและการทำงานร่วมกันอย่างใกล้ชิดระหว่างทีม Dev และ ทีม Ops เพื่อส่งมอบซอฟต์แวร์ได้อย่างรวดเร็วและมีเสถียรภาพ",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "โปรแกรมสำหรับสแกนและกำจัดไวรัสในเซิร์ฟเวอร์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "แผนกจัดซื้ออุปกรณ์ฮาร์ดแวร์ประจำองค์กร",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "DevOps ไม่ใช่แค่โปรแกรม แต่เป็น 'วัฒนธรรม' และ 'แนวปฏิบัติ' ที่ผสานทีม Development และ Operations เข้าด้วยกันเพื่อความรวดเร็วและคุณภาพ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q2",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ปัญหาคลาสสิก 'Works on my machine' (รันบนเครื่องฉันได้ แต่เครื่องคนอื่นพัง) มักเกิดจากสาเหตุใดมากที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "ความเร็วเครือข่ายอินเทอร์เน็ตของแต่ละคนไม่เท่ากัน",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "สภาพแวดล้อม (Environment) เวอร์ชันของโปรแกรม และไลบรารีไม่ตรงกันระหว่างเครื่องนักพัฒนาและเซิร์ฟเวอร์",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ขนาดหน้าจอคอมพิวเตอร์มีความกว้างต่างกัน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ยี่ห้อของเมนบอร์ดและคีย์บอร์ดไม่เหมือนกัน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ความแตกต่างของ OS, runtime version, หรือ library dependencies ระหว่างเครื่องทำให้เกิดปัญหานี้ ซึ่ง DevOps จะแก้ด้วย Container เช่น Docker",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q3",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ระบบควบคุมเวอร์ชัน (Version Control System เช่น Git) มีประโยชน์หลักอย่างไรในการทำงานเป็นทีม?",
        "options": [
          {
            "id": "a",
            "text": "ติดตามประวัติการแก้ไข รวมโค้ดของทุกคนเข้าด้วยกันอย่างเป็นระบบ และสามารถย้อนกลับเวอร์ชันเดิมได้ตลอดเวลา",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "แปลงโค้ดภาษา Python ให้กลายเป็นภาษา Java อัตโนมัติ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ป้องกันไม่ให้ใครเปิดดูโค้ดของตนเองได้",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำหน้าที่เป็นระบบปฏิบัติการแทน Windows หรือ Linux",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Git ช่วยบันทึกประวัติการเปลี่ยนแปลง (Commit) และสนับสนุนการทำงานร่วมกันแบบหลายกิ่ง (Branching) ได้อย่างมีประสิทธิภาพ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q4",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ในระบบ Git คำสั่งหรือการทำ 'Commit' มีความหมายตรงกับข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "การลบไฟล์และโฟลเดอร์ที่ไม่ต้องการออกจากฮาร์ดดิสก์",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "การเปิดหน้าต่างแก้ไขโค้ดขึ้นมาใหม่",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การบันทึกภาพถ่ายสถานะและการเปลี่ยนแปลงของไฟล์โค้ด ณ จุดนั้น พร้อมข้อความอธิบายความเปลี่ยนแปลง",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "การรีสตาร์ทเครื่องคอมพิวเตอร์เพื่อล้างหน่วยความจำ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Commit เปรียบเสมือนจุดเช็คพอยต์ (Snapshot) ที่บันทึกสถานะของงานพร้อมเหตุผลประกอบ เพื่อให้ตรวจสอบและย้อนกลับได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q5",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "การแตกสายการทำงาน (Branch) ใน Git มีจุดประสงค์เพื่ออะไร?",
        "options": [
          {
            "id": "a",
            "text": "แยกสายงานออกไปพัฒนาฟีเจอร์ใหม่โดยไม่ส่งผลกระทบต่อโค้ดหลักที่ใช้งานอยู่",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพิ่มความเร็วในการคำนวณของซีพียู",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "บีบอัดไฟล์ให้มีขนาดเล็กลงเพื่อส่งอีเมล",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ปิดไม่ให้นักพัฒนาคนอื่นเข้าถึงอินเทอร์เน็ตได้",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Branch ช่วยให้นักพัฒนาแยกไปทดลองหรือสร้างฟีเจอร์ใหม่ได้อย่างอิสระ เมื่อทดสอบเสร็จจึงค่อยนำมารวม (Merge) กลับเข้าสายงานหลัก",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q6",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ระบบ Continuous Integration (CI) มีหน้าที่สำคัญอย่างไรในวงจร DevOps?",
        "options": [
          {
            "id": "a",
            "text": "นำโค้ดของทุกคนมารวมกันที่ส่วนกลางสม่ำเสมอ พร้อม Build และรัน Automated Tests ทันทีเพื่อตรวจหาบั๊กโดยเร็ว",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ยกเลิกการทดสอบโค้ดทั้งหมดเพื่อปล่อยโปรแกรมให้เร็วที่สุด",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "จ้างพนักงานพิมพ์เอกสารรายงานข้อผิดพลาดส่งทางไปรษณีย์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ลบประวัติการเขียนโค้ดทิ้งทั้งหมดเพื่อความปลอดภัย",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "CI ช่วยผสานโค้ดอย่างสม่ำเสมอและทดสอบแบบอัตโนมัติ ทำให้พบปัญหาทันที ไม่ต้องรอจนถึงวันส่งมอบงาน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q7",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "Continuous Delivery / Deployment (CD) หมายถึงกระบวนการใด?",
        "options": [
          {
            "id": "a",
            "text": "การส่งมอบแผ่นซีดีโปรแกรมให้กับลูกค้าทางพัสดุ",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "กระบวนการนำซอฟต์แวร์ที่ผ่านการทดสอบแล้วไปติดตั้งลงสภาพแวดล้อมจริง (Production) แบบอัตโนมัติหรือคลิกเดียว",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "การสั่งซื้อเครื่องเซิร์ฟเวอร์ใหม่ทุกสัปดาห์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การเขียนโค้ดต่อเนื่องติดต่อกัน 48 ชั่วโมงโดยไม่หยุดพัก",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "CD ทำหน้าที่นำซอฟต์แวร์ที่ผ่าน CI แล้วขึ้นสู่เซิร์ฟเวอร์จริงได้อย่างราบรื่น ลดข้อผิดพลาดจากการติดตั้งด้วยมือ (Manual Error)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q8",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดเรียงลำดับขั้นตอนใน DevOps Infinity Loop 8 ขั้นตอนได้อย่างถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "Plan → Code → Build → Test → Release → Deploy → Operate → Monitor",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Deploy → Monitor → Plan → Release → Test → Build → Operate → Code",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Code → Deploy → Test → Plan → Monitor → Operate → Release → Build",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Monitor → Operate → Plan → Code → Deploy → Build → Test → Release",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "วงจรเริ่มจากฝั่ง Dev (Plan, Code, Build, Test) ต่อเนื่องไปยังฝั่ง Ops (Release, Deploy, Operate, Monitor) เป็นวงรอบต่อเนื่องไม่สิ้นสุด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q9",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "เทคโนโลยี Container เช่น 'Docker' เข้ามาช่วยแก้ปัญหาสำคัญข้อใดในยุค DevOps?",
        "options": [
          {
            "id": "a",
            "text": "ช่วยแพ็กแอปพลิเคชันพร้อม dependencies ทั้งหมดให้ทำงานได้เหมือนกันทุกที่ หมดปัญหาโค้ดรันได้แค่บางเครื่อง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพิ่มขนาดความจุของฮาร์ดดิสก์ทางกายภาพให้เพิ่มขึ้น",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ป้องกันไฟฟ้าดับในห้องควบคุมคอมพิวเตอร์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ช่วยแปลโค้ดภาษาอังกฤษเป็นภาษาไทยได้ทันที",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Container จำลองสภาพแวดล้อมที่จำเป็นสำหรับแอป ทำให้มั่นใจได้ว่าโค้ดที่รันบนเครื่อง Dev จะทำงานบนเซิร์ฟเวอร์จริงได้เหมือนกัน 100%",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w1-q10",
        "courseId": "21901-2012",
        "week": 1,
        "type": "choice",
        "question": "วัฒนธรรมการทำงานแบบ DevOps ส่งเสริมพฤติกรรมใดมากที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "การโยนความผิดให้ทีมอื่นเมื่อเซิร์ฟเวอร์ล่ม (Blaming Culture)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "การทำงานแบบแยกส่วน ปิดกั้นข้อมูลระหว่างแผนก (Silo)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ความรับผิดชอบร่วมกันตลอดทั้งวงจร (Shared Responsibility) และสื่อสารอย่างโปร่งใส",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "ปล่อยให้ทีม Ops แก้ปัญหาโค้ดทั้งหมดเพียงลำพังหลังปล่อยฟีเจอร์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หัวใจของ DevOps คือ Shared Responsibility ทั้งสองฝ่ายเป็นเจ้าของความสำเร็จและปัญหาของระบบร่วมกัน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "2": [
      {
        "id": "21901-2012-w2-q1",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "ระบบควบคุมเวอร์ชัน (Version Control System: VCS) มีบทบาทหน้าที่หลักคือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "แปลงโค้ดโปรแกรมให้เป็นไฟล์ติดตั้ง (.exe) อัตโนมัติ",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "บันทึกประวัติการเปลี่ยนแปลงของไฟล์ ทำให้สามารถตรวจสอบ ย้อนกลับ และทำงานร่วมกันเป็นทีมได้อย่างเป็นระบบ",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "สแกนไวรัสและป้องกันมัลแวร์ในเครื่องคอมพิวเตอร์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพิ่มความเร็วสัญญาณเครือข่ายอินเทอร์เน็ตของทีมพัฒนา",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "VCS ทำหน้าที่บันทึกประวัติการแก้ไขของไฟล์อย่างต่อเนื่อง ทำให้ย้อนเวลากลับไปดูหรือกู้คืนโค้ดเวอร์ชันเดิมได้ตลอดเวลา",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q2",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "ปัญหาข้อใดคือผลเสียที่ร้ายแรงที่สุดของการพัฒนาโปรแกรมโดย 'ไม่มี' การใช้ระบบควบคุมเวอร์ชัน?",
        "options": [
          {
            "id": "a",
            "text": "หน้าจอแสดงผลของโปรแกรมมีสีสันไม่สวยงาม",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "การตั้งชื่อไฟล์ซ้ำซ้อนสับสน เช่น final_v2_edit.zip และเสี่ยงต่อการเขียนไฟล์ทับงานของเพื่อนจนข้อมูลสูญหาย",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ไม่สามารถเชื่อมต่อแป้นพิมพ์และเมาส์พร้อมกันได้",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "โปรแกรมไม่ยอมเปิดให้ใช้งานหากไม่ได้เชื่อมต่อบลูทูธ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การไม่ใช้ VCS มักทำให้เกิดปัญหาไฟล์งานทับกัน (File Overwrite), สับสนเวอร์ชันล่าสุด และไม่รู้ว่าใครแก้ไขโค้ดตรงไหนเมื่อไหร่",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q3",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดคือลักษณะสำคัญของระบบควบคุมเวอร์ชันแบบรวมศูนย์ (Centralized VCS เช่น SVN)?",
        "options": [
          {
            "id": "a",
            "text": "ทุกเครื่องของนักพัฒนาจะมีสำเนาประวัติโปรเจกต์ทั้งหมดอย่างสมบูรณ์โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "มีเซิร์ฟเวอร์ส่วนกลางเพียงเครื่องเดียวที่เก็บประวัติไฟล์ทั้งหมด หากเซิร์ฟเวอร์ล่มจะทำงานไม่ได้และเสี่ยงข้อมูลสูญหาย",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ไม่สามารถใช้งานผ่านสาย LAN ได้เลย",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่บันทึกชื่อผู้แก้ไขไฟล์ลงในระบบ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Centralized VCS มีจุดบกพร่องสำคัญคือ Single Point of Failure หากเซิร์ฟเวอร์กลางเสียหายหรือเครือข่ายหลุด จะไม่สามารถบันทึกหรือย้อนประวัติได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q4",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดคือจุดเด่นที่ทำให้ระบบแบบกระจาย (Distributed VCS เช่น Git) เหนือกว่าแบบรวมศูนย์ (Centralized VCS)?",
        "options": [
          {
            "id": "a",
            "text": "นักพัฒนาทุกคนจะมีพื้นที่เก็บข้อมูล (Repository) และประวัติทั้งหมดครบถ้วนอยู่ในเครื่องตนเอง สามารถทำงานออฟไลน์ได้ 100%",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ไม่ต้องใช้พื้นที่ฮาร์ดดิสก์ในการจัดเก็บไฟล์เลย",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เขียนโค้ดได้โดยไม่ต้องพิมพ์ตัวอักษร",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "จำกัดให้มีนักพัฒนาทำงานได้เพียงคนเดียวต่อโปรเจกต์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ใน DVCS เครื่องลูกข่ายทุกเครื่องเปรียบเสมือน Backup สมบูรณ์ของเซิร์ฟเวอร์ ทำงาน ดูประวัติ และ Commit ได้โดยไม่ต้องต่อเน็ต",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q5",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดคือตัวอย่างของซอฟต์แวร์ประเภท Distributed Version Control System (DVCS)?",
        "options": [
          {
            "id": "a",
            "text": "CVS และ Microsoft Word",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Git และ Mercurial",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Apache Subversion (SVN) และ Perforce",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Adobe Photoshop และ Illustrator",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Git และ Mercurial เป็นตัวแทนของ DVCS ส่วน SVN, CVS และ Perforce เป็นระบบแบบ Centralized (CVCS)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q6",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "Git บันทึกการเปลี่ยนแปลงของไฟล์ในแต่ละช่วงเวลา (Version) ด้วยแนวคิดใด?",
        "options": [
          {
            "id": "a",
            "text": "เก็บภาพถ่ายสถานะรวมของทั้งโปรเจกต์ (Snapshot) ในจุดเวลานั้นๆ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "บันทึกเฉพาะรูปภาพหน้าจอของคอมพิวเตอร์",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ลบไฟล์เก่าทิ้งแล้วสร้างโฟลเดอร์ใหม่เสมอ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ส่งไฟล์ทั้งหมดไปเก็บไว้ที่แผ่นดิสก์เก็ต",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Git จัดเก็บข้อมูลแบบ Snapshot (เสมือนถ่ายภาพสถานะของไฟล์ทั้งหมด ณ ขณะนั้น) หากไฟล์ไหนไม่เปลี่ยนก็จะชี้ไปยังไฟล์เดิมเพื่อประหยัดเนื้อที่",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q7",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "หลังจากติดตั้ง Git ลงในเครื่องคอมพิวเตอร์แล้ว คำสั่งแรกที่ใช้สำหรับตรวจสอบว่า Git ติดตั้งสำเร็จหรือไม่คือคำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "git --version",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "git start",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git download",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git run program",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git --version' ใช้ตรวจสอบเวอร์ชันของ Git หากติดตั้งสำเร็จจะแสดงข้อความเช่น git version 2.x.x",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q8",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "คำสั่งใดใช้สำหรับตั้งค่าชื่อ (Name) ของผู้ใช้งานใน Git แบบส่วนกลาง (Global)?",
        "options": [
          {
            "id": "a",
            "text": "git set username \"สมชาย ใจดี\"",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "git config --global user.name \"สมชาย ใจดี\"",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "git user:name = \"สมชาย ใจดี\"",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git register \"สมชาย ใจดี\"",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การตั้งค่าผู้ใช้ใน Git ใช้คำสั่ง 'git config --global user.name \"ชื่อ\"' และ 'git config --global user.email \"อีเมล\"'",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q9",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "เพราะเหตุใดจึงจำเป็นต้องตั้งค่า user.name และ user.email ก่อนเริ่มใช้งาน Git?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อให้ Git แนบตัวตนของผู้แก้ไขไปกับทุกๆ Commit อย่างชัดเจน สามารถระบุได้ว่าใครเป็นคนทำอะไร",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพื่อให้ระบบหักเงินค่าบริการรายเดือนผ่านทางอีเมล",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพื่อใช้สมัครบัญชีเฟซบุ๊กอัตโนมัติ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อล็อกไม่ให้เครื่องคอมพิวเตอร์เครื่องอื่นเปิดไฟล์ได้",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ข้อมูล user.name และ user.email จะถูกฝังลงในบันทึกประวัติ (Commit Metadata) เพื่อใช้ตรวจสอบและยืนยันตัวตนของผู้เขียนโค้ด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w2-q10",
        "courseId": "21901-2012",
        "week": 2,
        "type": "choice",
        "question": "คำสั่งใดใช้สำหรับตรวจสอบรายการคอนฟิกและค่าการตั้งค่าทั้งหมดของ Git ในเครื่องปัจจุบัน?",
        "options": [
          {
            "id": "a",
            "text": "git show all",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "git config --list",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "git verify config",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git find settings",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git config --list' จะแสดงรายการค่าตัวแปรทั้งหมดที่กำหนดไว้ เช่น user.name, user.email, core.editor ฯลฯ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "3": [
      {
        "id": "21901-2012-w3-q1",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "โครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees) ของ Git ในเครื่องคอมพิวเตอร์ประกอบด้วยส่วนใดบ้างตามลำดับการทำงาน?",
        "options": [
          {
            "id": "a",
            "text": "Working Directory, Remote Repository, และ Staging Area",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Staging Area, Working Directory, และ Git Archive",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Working Directory, Staging Area, และ Local Repository",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Working Directory, Commit Cache, และ Cloud Repository",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "สถาปัตยกรรม 3 พื้นที่หลักของ Git ทำงานเรียงลำดับจาก Working Directory (พื้นที่แก้ไขไฟล์จริง) -> Staging Area (พื้นที่เตรียมพร้อมและคัดเลือกไฟล์) -> Local Repository (พื้นที่จัดเก็บ Snapshot ถาวรในโฟลเดอร์ .git)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q2",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "คำสั่งใดใช้สำหรับเริ่มต้นสร้าง Git Repository ขึ้นใหม่ในโฟลเดอร์โปรเจกต์ปัจจุบัน?",
        "options": [
          {
            "id": "a",
            "text": "git init",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "git start",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git setup",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git create",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git init' (ย่อมาจาก initialize) ใช้สร้างโฟลเดอร์ซ่อนชื่อ .git ขึ้นมาเพื่อเริ่มติดตามการเปลี่ยนแปลงไฟล์ในโฟลเดอร์นั้น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q3",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการกำหนดชื่อและอีเมลของผู้พัฒนาสำหรับใช้บันทึกประวัติการ Commit ในเครื่องเป็นค่าเริ่มต้นทุกโปรเจกต์ ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "git config --system author.name \"ชื่อ\" และ author.email \"อีเมล\"",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "git set-identity --default user.name \"ชื่อ\" และ user.email \"อีเมล\"",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git profile --all user.name \"ชื่อ\" และ user.email \"อีเมล\"",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git config --global user.name \"ชื่อ\" และ git config --global user.email \"อีเมล\"",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "Git บันทึกประวัติว่าใครแก้ไขด้วย user.name และ user.email ผ่านคำสั่ง git config --global เพื่อใช้เป็นค่าตั้งต้นร่วมกันทุกโปรเจกต์ในเครื่อง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q4",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "โฟลเดอร์ใดทำหน้าที่เป็นพื้นที่จัดเก็บประวัติ Commit, ข้อมูล Object, และการตั้งค่าทั้งหมดของ Local Repository?",
        "options": [
          {
            "id": "a",
            "text": "โฟลเดอร์ .github/",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "โฟลเดอร์ .git/",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "โฟลเดอร์ .stage/",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "โฟลเดอร์ .repo/",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "โฟลเดอร์ .git/ เป็นโฟลเดอร์ซ่อนที่เก็บฐานข้อมูล Snapshot, HEAD, Object และ Config ทั้งหมดของ Git หากลบโฟลเดอร์นี้ประวัติ Git จะหายทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q5",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "เมื่อผู้พัฒนาสร้างไฟล์โค้ดใหม่ขึ้นมาในโฟลเดอร์โปรเจกต์ แต่ยังไม่ได้สั่งคำสั่ง Git ใดๆ ไฟล์นั้นจะอยู่ในสถานะใด?",
        "options": [
          {
            "id": "a",
            "text": "Untracked (ยังไม่ได้รับการติดตาม)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Modified (ไฟล์ได้รับการแก้ไข)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Unstaged (ไฟล์รอการเตรียมพร้อม)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Ignored (ไฟล์ถูกละเว้นถาวร)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ไฟล์ที่สร้างขึ้นใหม่เอี่ยม Git จะมองเห็นเป็น Untracked หมายถึง Git รับรู้ว่ามีไฟล์นี้อยู่แต่ยังไม่ได้เริ่มติดตามบันทึกเวอร์ชัน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q6",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการนำไฟล์ที่แก้ไขแล้วเข้าสู่ Staging Area เพื่อคัดเลือกเตรียมพร้อมสำหรับการบันทึก Snapshot ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "git commit <ชื่อไฟล์>",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "git stage <ชื่อไฟล์>",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git track <ชื่อไฟล์>",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git add <ชื่อไฟล์>",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git add' ทำหน้าที่หยิบไฟล์จาก Working Directory เข้าไปวางไว้ใน Staging Area (Index) เพื่อเตรียม Commit",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q7",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "ข้อใดอธิบายวัตถุประสงค์หลักของการกำหนดไฟล์ '.gitignore' ในโปรเจกต์ได้อย่างถูกต้องที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "ป้องกันไม่ให้สมาชิกคนอื่นในทีมดึงไฟล์โค้ดไปแก้ไขโดยไม่ได้รับอนุญาต",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ระบุรายชื่อไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้ระบบ Git ติดตามและนำขึ้นระบบ",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ซ่อนไฟล์สำคัญไม่ให้แสดงบนโปรแกรมแก้ไขโค้ดเพื่อความปลอดภัยของข้อมูล",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ลบไฟล์ขยะและไฟล์ชั่วคราวออกจากระบบฮาร์ดดิสก์โดยอัตโนมัติเมื่อสั่งรันโปรแกรม",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": ".gitignore ทำหน้าที่บอกให้ Git เพิกเฉยต่อไฟล์ที่ไม่ควรขึ้นระบบ เช่น ไฟล์ชั่วคราว, ค่า Config ส่วนตัว (.env), และโฟลเดอร์ดาวน์โหลด (node_modules)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q8",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "ตามแนวคิด Atomic Commit และมาตรฐาน Conventional Commits ข้อใดคือแนวปฏิบัติที่ดีในการบันทึก Commit?",
        "options": [
          {
            "id": "a",
            "text": "รวบรวมงานทั้งหมดที่ทำตลอดสัปดาห์ไว้ใน Commit เดียวเพื่อลดประวัติที่ซ้ำซ้อน",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "บันทึก Commit ทุกครั้งที่กดปุ่ม Save ใน Text Editor เพื่อบันทึกงานให้ละเอียดที่สุด",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "แยกการบันทึกแต่ละ Commit ตามงานย่อยที่สมบูรณ์ในตัวเองพร้อมข้อความที่ชัดเจน",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "บันทึกเฉพาะไฟล์โค้ดส่วนของโปรแกรมหลักเท่านั้น ส่วนไฟล์เอกสารไม่ต้องทำ Commit",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หลักการ Atomic Commit และ Conventional Commits (เช่น feat:, fix:, docs:) ช่วยให้ย้อนประวัติ ตรวจสอบสาเหตุบั๊ก และทำงานร่วมกันในทีมได้อย่างมีประสิทธิภาพ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q9",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "คำสั่งใดใช้สำหรับตรวจสอบสถานะปัจจุบันของไฟล์ในโปรเจกต์ ทั้งไฟล์ที่แก้ไขแล้ว ไฟล์ที่อยู่ใน Staging และไฟล์ที่ยังไม่ถูกติดตาม?",
        "options": [
          {
            "id": "a",
            "text": "git log",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "git diff",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git show",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git status",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git status' เป็นคำสั่งพื้นฐานที่ใช้บ่อยที่สุดเพื่อตรวจดูสถานะของไฟล์ในแต่ละพื้นที่ก่อนทำคำสั่งถัดไป",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2012-w3-q10",
        "courseId": "21901-2012",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการคัดลอก Remote Repository จากเซิร์ฟเวอร์ (เช่น GitHub หรือ GitLab) ลงมาสร้างเป็น Local Repository ในเครื่องคอมพิวเตอร์ ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "git clone <url>",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "git pull <url>",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "git fetch <url>",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "git checkout <url>",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง 'git clone <url>' ใช้คัดลอก Repository ทางไกล (Remote Repository) พร้อมประวัติการ Commit ทั้งหมดลงมาเป็น Local Repository ในเครื่องของเราทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ]
  },
  "31901-2012": {
    "1": [
      {
        "id": "31901-2012-w1-q1",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดคือเป้าหมายสูงสุดของ 'การวิเคราะห์และนำเสนอข้อมูล' (Data Analysis & Visualization)?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อสร้างกราฟิกสีสันสดใสตกแต่งรายงานเท่านั้น",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพื่อเปลี่ยนข้อมูลดิบให้เป็นข้อค้นพบ (Insights) สนับสนุนการตัดสินใจทางธุรกิจ (Data-Driven Decision Making)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพื่อเก็บสะสมข้อมูลให้มีขนาดใหญ่ที่สุดเท่าที่จะทำได้",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อลดจำนวนพนักงานและปิดกิจการแผนกต่างๆ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หัวใจของการวิเคราะห์ข้อมูลไม่ใช่เพียงแค่การวาดชาร์ตสวยงาม แต่คือการกลั่นกรอง Insight เพื่อนำไปสู่การตัดสินใจ (Data-Driven Decision Making) ที่ลดความเสี่ยงทางธุรกิจ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q2",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดคือความแตกต่างสำคัญระหว่างการตัดสินใจด้วยความรู้สึก (Intuition) กับการตัดสินใจด้วยข้อมูล (Data-Driven)?",
        "options": [
          {
            "id": "a",
            "text": "การตัดสินใจด้วยข้อมูลใช้หลักฐานเชิงประจักษ์ที่ตรวจสอบได้และช่วยลดอคติ (Bias) ส่วนการใช้ความรู้สึกตรวจสอบความถูกต้องได้ยาก",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การใช้ความรู้สึกให้ผลลัพธ์แม่นยำกว่าการใช้ข้อมูลเสมอ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การตัดสินใจด้วยข้อมูลไม่ต้องใช้เวลาหรือเครื่องมือใดๆ ในการเก็บรวบรวม",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การตัดสินใจด้วยข้อมูลใช้ได้กับองค์กรขนาดใหญ่เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data-Driven ตัดสินใจจากหลักฐานเชิงประจักษ์ (Evidence) จึงลดอคติ ตรวจสอบที่มาที่ไปได้ และวัดผลปรับปรุงได้อย่างต่อเนื่อง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q3",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ตามพีระมิด DIKW เมื่อเรานำข้อมูลยอดขายขนมปัง 'วันจันทร์ขายได้ 25 จาก 50 ชิ้น' มาวิเคราะห์จนพบว่า 'วันธรรมดาขายได้เพียงครึ่งเดียวแต่วันหยุดขายหมดทุกสัปดาห์' ขั้นตอนนี้จัดอยู่ในระดับใด?",
        "options": [
          {
            "id": "a",
            "text": "Knowledge (ความรู้ / ความเข้าใจในแบบแผนและความสัมพันธ์ของข้อมูล)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Data (ข้อมูลดิบที่ยังไม่ได้ประมวลผล)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Hardware (อุปกรณ์คอมพิวเตอร์)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Machine Code (รหัสเครื่อง)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Knowledge คือระดับที่เห็นรูปแบบ (Pattern) หรือความสัมพันธ์เชิงสาเหตุ ตอบได้ว่า 'ทำไม' หรือเกิดแนวโน้มอย่างไร จากสารสนเทศที่จัดระเบียบแล้ว",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q4",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "เหตุใดองค์กรจึงนิยมนำเสนอข้อมูลด้วย Data Visualization มากกว่าตารางตัวเลขดิบ?",
        "options": [
          {
            "id": "a",
            "text": "เพราะสมองมนุษย์ประมวลผลการรับรู้ทางสายตา (Visual Perception) ได้เร็วกว่าการอ่านตัวเลขหลายหมื่นเท่า",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพราะกราฟมีตัวหนังสือน้อยกว่าตารางเสมอ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะคอมพิวเตอร์ไม่อนุญาตให้อ่านตัวเลขดิบ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะไม่ต้องใช้ข้อมูลจริงในการสร้างกราฟ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "สมองมนุษย์จับคู่รูปแบบ แนวโน้ม (Trends) และจุดผิดปกติ (Outliers) จากภาพและกราฟได้รวดเร็วกว่าการกวาดสายตาอ่านตัวเลขในตารางหลายสิบบรรทัด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q5",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ในวงจรชีวิตของการวิเคราะห์ข้อมูล (Data Analytics Lifecycle) ขั้นตอนแรกสุดที่นักวิเคราะห์ข้อมูลควรทำคืออะไร?",
        "options": [
          {
            "id": "a",
            "text": "ลงมือสร้าง Dashboard ทันทีโดยไม่ต้องคิด",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ทำความเข้าใจปัญหาและตั้งคำถามทางธุรกิจที่ชัดเจน (Ask / Business Understanding)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ลบข้อมูลที่คิดว่าไม่สำคัญทิ้งทั้งหมด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ซื้อโปรแกรมซอฟต์แวร์ราคาแพงที่สุดมาติดตั้ง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ขั้นตอนแรกคือการทำความเข้าใจบริบทและตั้งคำถามทางธุรกิจ (Ask) เพื่อให้ทราบว่าเรากำลังจะวิเคราะห์เพื่อตอบโจทย์อะไรและช่วยเหลือใคร",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q6",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ข้อมูลประเภท 'ข้อความรีวิวสินค้าบน Social Media และคลิปวิดีโอสัมภาษณ์ลูกค้า' จัดอยู่ในกลุ่มข้อมูลประเภทใด?",
        "options": [
          {
            "id": "a",
            "text": "Structured Data (ข้อมูลที่มีโครงสร้างตารางชัดเจน)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Unstructured Data (ข้อมูลที่ไม่มีโครงสร้างแน่นอน)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Relational Database Data",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Machine Code Binary Data",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ข้อความรีวิว ภาพถ่าย เสียง และคลิปวิดีโอ เป็นข้อมูลที่ไม่ได้จัดเก็บในรูปแบบแถวและคอลัมน์เหมือนตารางทั่วไป จึงจัดเป็น Unstructured Data",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q7",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "การวิเคราะห์ระดับใดที่มุ่งตอบคำถามว่า 'ทำไมสิ่งนี้จึงเกิดขึ้น' (Why did it happen?) โดยการเปรียบเทียบข้อมูลและหาสาเหตุที่แท้จริง?",
        "options": [
          {
            "id": "a",
            "text": "Descriptive Analytics (เชิงพรรณนา)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "Diagnostic Analytics (เชิงวินิจฉัย)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Predictive Analytics (เชิงพยากรณ์)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Prescriptive Analytics (เชิงแนะนำ)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Diagnostic Analytics มุ่งเน้นการเจาะลึกเพื่อหาสาเหตุของปัญหา (Root Cause Analysis) เช่น ตรวจสอบว่าทำไมยอดขายจึงลดลงในกลุ่มสินค้าบางประเภท",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q8",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ขั้นตอน 'Data Cleaning' (การทำความสะอาดข้อมูล) มีความสำคัญสูงสุดต่อการวิเคราะห์อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "จัดการค่าสูญหาย (Missing Values), ข้อมูลซ้ำซ้อน และข้อผิดพลาด เพื่อให้ผลลัพธ์การวิเคราะห์มีความน่าเชื่อถือ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ลบคอลัมน์ทั้งหมดให้เหลือเพียงฟิลด์เดียว",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "สแกนหาไวรัสในไฟล์ข้อมูลเท่านั้น",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เปลี่ยนภาษาในชุดข้อมูลให้เป็นภาษาละติน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Cleaning ช่วยขจัดข้อมูลผิดพลาด ข้อมูลซ้ำ และช่องว่าง เพื่อป้องกันปัญหาขยะเข้าขยะออก (Garbage In, Garbage Out)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q9",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "กฎหมาย PDPA (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล) กำหนดให้นักวิเคราะห์ข้อมูลต้องปฏิบัติตามอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ห้ามใช้คอมพิวเตอร์หลังเวลา 18.00 น.",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ต้องได้รับความยินยอมและปกป้องข้อมูลส่วนบุคคล (PII) ของลูกค้า เช่น ปกปิดข้อมูลระบุตัวตน (Anonymization)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "บังคับให้นักวิเคราะห์ข้อมูลต้องเปิดเผยเงินเดือนของตนเองต่อสาธารณะ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ห้ามวิเคราะห์ข้อมูลที่มีมูลค่ามากกว่า 1,000 บาท",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "PDPA กำหนดให้การเก็บและวิเคราะห์ข้อมูลส่วนบุคคล (PII) ต้องได้รับความยินยอมและมีมาตรการรักษาความปลอดภัย เช่น การทำ Masking หรือ Anonymization",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w1-q10",
        "courseId": "31901-2012",
        "week": 1,
        "type": "choice",
        "question": "ทักษะด้านใดของ Data Analyst ที่มีความสำคัญอย่างยิ่งในการเปลี่ยนข้อค้นพบ (Insights) ให้กลายเป็นการตัดสินใจและการลงมือทำของผู้บริหาร?",
        "options": [
          {
            "id": "a",
            "text": "การสื่อสารและเล่าเรื่องด้วยข้อมูล (Data Storytelling & Communication)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การเขียนภาษา Assembly ขั้นสูง",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การซ่อมแซมและประกอบฮาร์ดแวร์คอมพิวเตอร์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การออกแบบวงจรอิเล็กทรอนิกส์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Analyst ไม่เพียงแต่ต้องวิเคราะห์เป็น แต่ต้องมีทักษะ Data Storytelling เพื่อนำเสนอ Insight ที่เข้าใจง่าย ตรงประเด็น และสามารถโน้มน้าวผู้บริหารให้นำไปสู่การตัดสินใจเชิงกลยุทธ์ได้จริง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "2": [
      {
        "id": "31901-2012-w2-q1",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "เหตุใดในกระบวนการ Data Analytics จึงต้องเริ่มต้นด้วย 'การสอบถามข้อมูลและความต้องการ (Data Inquiry)' ก่อนการลงมือสร้างตารางหรือกราฟ?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อลดงบประมาณในการซื้อคอมพิวเตอร์เครื่องใหม่",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพื่อให้เข้าใจวัตถุประสงค์ทางธุรกิจ กลุ่มเป้าหมาย และระบุได้ว่าจำเป็นต้องใช้ข้อมูลตัวแปรใดบ้างในการตอบคำถาม",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพื่อให้เสียเวลาในการทำงานนานขึ้นตามเกณฑ์ชั่วโมงสอน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อป้องกันไม่ให้ผู้อื่นเข้าถึงโปรแกรม Power BI ได้",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การสอบถามข้อมูล (Data Inquiry) ช่วยให้นักวิเคราะห์เข้าใจเป้าหมายที่แท้จริงของผู้มีส่วนได้ส่วนเสีย (Stakeholders) ทำให้ทราบว่าต้องเก็บข้อมูลอะไรบ้าง และไม่เก็บข้อมูลที่ไม่จำเป็น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q2",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "ตามกรอบแนวคิด 5W1H ในการสอบถามข้อมูล ตัวอักษร 'Why' มุ่งเน้นไปที่การค้นหาคำตอบในเรื่องใด?",
        "options": [
          {
            "id": "a",
            "text": "สถานที่ที่จัดเก็บไฟล์ฐานข้อมูล",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เหตุผล วัตถุประสงค์ และเป้าหมายที่ต้องนำข้อมูลนี้ไปช่วยตัดสินใจแก้ไขปัญหา",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "รายชื่อโปรแกรมเมอร์ที่เป็นผู้เขียนโค้ด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "จำนวนหน่วยความจำ RAM ของเครื่องเซิร์ฟเวอร์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "'Why' คือการค้นหา 'ทำไมต้องวิเคราะห์ข้อมูลนี้ และผลลัพธ์จะนำไปแก้ปัญหาหรือพัฒนาเรื่องใด' ซึ่งเป็นหัวใจสำคัญสูงสุดของการทำ Analytics",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q3",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "หากต้องการทราบความพึงพอใจของลูกค้าจำนวน 5,000 คนทั่วประเทศต่อรสชาติอาหาร รูปแบบการสอบถามข้อมูลใดมีความเหมาะสมและคุ้มค่าที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "การเดินทางไปสัมภาษณ์ตัวต่อตัวให้ครบทั้ง 5,000 คน",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "แบบสอบถามออนไลน์ (Online Questionnaire / Google Forms) โดยส่งผ่านทาง SMS หรือ QR Code",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "การเปิดกล้องวงจรปิดสังเกตการณ์ลูกค้าทั้งวัน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การเดาและสุ่มตัวเลขยอดขายขึ้นมาเอง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "แบบสอบถามออนไลน์เหมาะสำหรับการเข้าถึงกลุ่มตัวอย่างขนาดใหญ่ (Large Scale) รวดเร็ว ประหยัดค่าใช้จ่าย และผู้ตอบสามารถตอบผ่านสมาร์ตโฟนได้สะดวก",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q4",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "คำถามแบบสอบถามลักษณะใดต่อไปนี้ จัดเป็น 'คำถามชี้นำ (Leading Question)' ซึ่งเป็นข้อผิดพลาดร้ายแรงในการเก็บข้อมูล?",
        "options": [
          {
            "id": "a",
            "text": "ท่านคิดว่าเครื่องดื่มสูตรใหม่ของเราอร่อยและคุ้มค่ามากใช่หรือไม่?",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ท่านมีความพึงพอใจต่อรสชาติเครื่องดื่มอยู่ในระดับใด (1 ถึง 5)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ใน 1 สัปดาห์ ท่านซื้อเครื่องดื่มประมาณกี่แก้ว",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ท่านชำระเงินด้วยช่องทางใดบ่อยที่สุด",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำถามที่ใส่ข้อความโน้มน้าว เช่น 'อร่อยและคุ้มค่ามากใช่หรือไม่' จะชี้นำให้ผู้ตอบเลือกตอบทางบวก ทำให้ข้อมูลที่ได้มีอคติ (Bias) และบิดเบือนจากความจริง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q5",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "การสอบถามระดับความพึงพอใจแบบ Likert Scale 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด) จัดเป็นข้อมูลประเภทใด และมีประโยชน์ต่องานวิเคราะห์อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ข้อมูลข้อความที่ไม่สามารถนำมาทำอะไรได้เลย",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ข้อมูลเชิงคุณภาพแบบเรียงลำดับ (Ordinal) ที่แปลงเป็นตัวเลขเพื่อคำนวณหาค่าเฉลี่ยและเปรียบเทียบความพึงพอใจได้",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ข้อมูลพิกัดละติจูด-ลองจิจูด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ข้อมูลไบนารีระดับล่างของฮาร์ดแวร์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Likert Scale เป็นการวัดระดับความรู้สึก (Ordinal) ที่นำมารวมเป็นสเกลคะแนน สามารถหาค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (SD) เพื่อเปรียบเทียบความพึงพอใจของแต่ละด้านได้",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q6",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดคือตัวอย่างของการรวบรวมข้อมูลแบบ 'ปฐมภูมิ (Primary Data Collection)'?",
        "options": [
          {
            "id": "a",
            "text": "การดาวน์โหลดรายงานสรุปภาวะเศรษฐกิจจากธนาคารแห่งประเทศไทย",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "การแจกแบบสอบถามเพื่อถามพฤติกรรมการเดินทางของนักศึกษาในวิทยาลัยด้วยตนเอง",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "การอ่านบทความวิจัยที่ตีพิมพ์เมื่อ 3 ปีก่อน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การคัดลอกตารางจากวิกิพีเดีย",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ข้อมูลปฐมภูมิ (Primary Data) คือข้อมูลที่ผู้ศึกษาเป็นผู้ลงมือเก็บรวบรวมขึ้นมาใหม่ด้วยตนเองโดยตรงจากกลุ่มเป้าหมายเพื่อตอบวัตถุประสงค์เฉพาะของงานวิจัยนั้น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q7",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "ในการสร้าง Google Forms การกำหนด 'Data Validation' เช่น บังคับให้กรอก 'ตัวเลขจำนวนเต็มบวก 1-100' ในช่องอายุ มีประโยชน์หลักอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ทำให้แบบฟอร์มเปลี่ยนสีสันได้ตามใจชอบ",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ป้องกันข้อมูลผิดรูปแบบตั้งแต่ต้นทาง ลดภาระในการทำ Data Cleaning และป้องกันข้อมูลขยะ (Garbage In)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ทำให้ระบบส่งอีเมลแจ้งเตือนทุกครั้งที่มีคนกดดูแบบฟอร์ม",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพิ่มจำนวนผู้ตอบแบบสอบถามขึ้นเป็นสองเท่าโดยอัตโนมัติ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Validation ช่วยตรวจสอบความถูกต้อง (Accuracy & Consistency) ตั้งแต่ตอนที่ผู้ใช้พิมพ์ข้อมูล ป้องกันการกรอกข้อความในช่องตัวเลข หรือกรอกตัวเลขติดลบ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q8",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "ข้อมูลชนิดใดที่ระบบคอมพิวเตอร์บันทึกได้โดยอัตโนมัติ โดยที่ผู้ใช้งานไม่ต้องเป็นผู้กรอกแบบสอบถามเอง?",
        "options": [
          {
            "id": "a",
            "text": "Web Server Access Log บันทึกเวลาที่เข้าชมเว็บและ IP Address",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ความฝันในอนาคตของนักศึกษา",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เหตุผลส่วนตัวที่นักศึกษาไม่ชอบวิชาคณิตศาสตร์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ความคิดเห็นเกี่ยวกับภาพยนตร์ที่ยังไม่ได้ฉาย",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Server Log, เซนเซอร์ IoT และฐานข้อมูล POS เป็นตัวอย่างของระบบบันทึกอัตโนมัติ (Automated / Transactional Data) ที่เก็บพฤติกรรมจริงโดยไม่ต้องรบกวนให้ผู้ใช้ตอบ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q9",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) เมื่อสร้างแบบฟอร์มเก็บรวบรวมข้อมูลลูกค้า สิ่งใดที่ต้องมีเสมอ?",
        "options": [
          {
            "id": "a",
            "text": "ของรางวัลแจกฟรีมูลค่ามากกว่า 1,000 บาท",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ข้อความแจ้งวัตถุประสงค์การเก็บข้อมูลและช่องให้ผู้ตอบยินยอม (Consent) อย่างชัดเจน",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "การบังคับให้ผู้ตอบต้องถ่ายรูปบัตรประชาชนส่งมาด้วยเสมอ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การระบุว่าจะนำข้อมูลไปขายต่อให้บริษัทประกันภัยทุกกรณี",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หลักการสำคัญของ PDPA คือต้องแจ้งวัตถุประสงค์ (Purpose Limitation) ว่าเก็บข้อมูลไปทำอะไร และได้รับความยินยอม (Consent) จากเจ้าของข้อมูลก่อนเสมอ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w2-q10",
        "courseId": "31901-2012",
        "week": 2,
        "type": "choice",
        "question": "เมื่อเก็บข้อมูลจากแบบสอบถามเสร็จสิ้น เอกสารใดที่ Data Analyst ควรจัดทำขึ้นเพื่ออธิบายความหมายและประเภทของแต่ละคอลัมน์?",
        "options": [
          {
            "id": "a",
            "text": "พจนานุกรมข้อมูล (Data Dictionary / Codebook)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ใบแจ้งหนี้ (Invoice)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ใบรับประกันสินค้า",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "แผนผังที่นั่งห้องเรียน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Dictionary หรือ Codebook คือเอกสารกำกับชุดข้อมูลที่ระบุชื่อคอลัมน์, คำอธิบาย, ชนิดข้อมูล (Data Type), ค่าที่เป็นไปได้ และหน่วยวัด เพื่อให้ทุกคนในทีมเข้าใจข้อมูลตรงกัน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "3": [
      {
        "id": "31901-2012-w3-q1",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "ตามหลักการจากบทความ DataTH กระบวนการ 'Data Wrangling' (หรือ Data Munging) หมายถึงข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "การลบฐานข้อมูลทั้งหมดทิ้งเพื่อประหยัดพื้นที่เซิร์ฟเวอร์",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "กระบวนการแปรสภาพ จัดโครงสร้าง และทำความสะอาดข้อมูลดิบ (Raw/Dirty Data) ให้อยู่ในรูปแบบที่พร้อมนำไปวิเคราะห์หรือสร้างโมเดล",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "การออกแบบโลโก้บริษัทด้วยโปรแกรมกราฟิก",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การติดตั้งสายแลนและซ่อมบำรุงฮาร์ดแวร์ในห้องเซิร์ฟเวอร์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Data Wrangling คือการนำข้อมูลดิบที่กระจัดกระจาย ไม่เป็นระเบียบ หรือมีข้อผิดพลาด มาจัดโครงสร้างและทำความสะอาด (Data Cleaning) ให้พร้อมใช้งานจริง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q2",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "เหตุใดขั้นตอน Data Wrangling และ Data Cleansing จึงมักใช้เวลาคิดเป็น 60% - 80% ของเวลาทำงานทั้งหมดของ Data Analyst?",
        "options": [
          {
            "id": "a",
            "text": "เพราะข้อมูลดิบจากโลกจริงมักมีช่องว่าง พิมพ์ผิด รูปแบบไม่ตรงกัน และหากไม่คลีนก่อน ผลการวิเคราะห์จะผิดเพี้ยน (Garbage In, Garbage Out)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพราะคอมพิวเตอร์ไม่สามารถบวกเลขได้เอง",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะกฎหมายบังคับให้ต้องพิมพ์ข้อมูลใหม่ด้วยมือทุกบรรทัด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพราะโปรแกรม Google Sheets อนุญาตให้เปิดไฟล์ได้วันละ 10 นาที",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตามกฎ Garbage In, Garbage Out (GIGO) หากนำข้อมูลขยะเข้าสู่วิเคราะห์ ต่อให้ใช้กราฟหรือ AI ดีเพียงใด ผลลัพธ์ที่ได้ก็จะผิดพลาดและนำไปสู่การตัดสินใจทางธุรกิจที่ผิด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q3",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "หากพบว่าในคอลัมน์ 'เวลารอคอยรับบริการ (ชั่วโมง)' มีผู้ตอบกรอกค่า 999 ชั่วโมง ปะปนอยู่กับข้อมูลส่วนใหญ่ที่อยู่ระหว่าง 0.5 - 3.0 ชั่วโมง ปัญหานี้ส่งผลเสียต่อมิติคุณภาพข้อมูลใด และเรียกว่าอะไร?",
        "options": [
          {
            "id": "a",
            "text": "กระทบต่อ Accuracy (ความถูกต้อง) และเรียกว่าค่าผิดปกติสุดโต่ง (Outlier)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "กระทบต่อ Timeliness และเรียกว่า Primary Key",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "กระทบต่อ Completeness และเรียกว่า Null Value",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่ส่งผลเสียใดๆ ต่อค่าเฉลี่ย (AVERAGE)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ค่า 999 ชั่วโมงเป็นค่าที่กระโดดออกจากกลุ่มอย่างผิดปกติ (Outlier) จากการพิมพ์ผิด ซึ่งกระทบต่อมิติความถูกต้อง (Accuracy) และดึงค่าเฉลี่ย (Mean) ให้สูงเกินจริง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q4",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "ในชุดข้อมูลที่พบว่ามีค่าสุดโต่ง (Outliers) ปะปนอยู่ หากต้องการเติมค่าว่าง (Missing Values Imputation) ในคอลัมน์ตัวเลข ควรเลือกใช้ค่าทางสถิติใดจึงจะไม่ถูกดึงให้เพี้ยน?",
        "options": [
          {
            "id": "a",
            "text": "ค่าสูงสุด (MAX)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ค่ามัธยฐาน (Median - ค่ากลางเมื่อเรียงลำดับข้อมูล)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ผลรวมทั้งหมด (SUM)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ค่าติดลบเสมอ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "มัธยฐาน (Median) คือค่าที่อยู่ตรงกลางเมื่อเรียงข้อมูลจากน้อยไปมาก จึงไม่ถูกค่าสุดโต่ง (Outliers) ดึงให้เบ้เหมือนค่าเฉลี่ยเลขคณิต (Mean)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q5",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "หากคอลัมน์ 'ชื่อแผนก' เป็นข้อมูลเชิงคุณภาพ (Categorical Data) และมีข้อมูลว่างหายไปบางแถว วิธี Imputation (การแทนค่าว่าง) ที่เหมาะสมคือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "นำชื่อแผนกมาคูณกันด้วยสูตรคณิตศาสตร์",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "แทนที่ด้วยค่าฐานนิยม (Mode - หมวดหมู่ที่พบมากที่สุด) หรือกำหนดหมวดหมู่กลาง เช่น 'ไม่ระบุ'",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ใส่ตัวเลข 9999 ลงไปแทนชื่อแผนก",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ลบคอลัมน์อื่นๆ ทิ้งทั้งหมด",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "สำหรับข้อมูลข้อความหรือหมวดหมู่ เราไม่สามารถคำนวณค่าเฉลี่ยได้ จึงนิยมใช้ฐานนิยม (Mode) หรือใส่ค่าคงที่ที่สื่อความหมายชัดเจนว่า 'ไม่ระบุ (Unknown)'",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q6",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "เมื่อใดที่เราควรเลือกวิธี 'ลบคอลัมน์ทิ้งทั้งคอลัมน์ (Drop Column)' ในการจัดการกับ Missing Values?",
        "options": [
          {
            "id": "a",
            "text": "เมื่อมีข้อมูลว่างหายไปเพียง 1 ช่องจาก 500 แถว",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เมื่อคอลัมน์นั้นมีข้อมูลว่างหายไปเป็นสัดส่วนสูงมาก (เช่น มากกว่า 60% - 80%) และไม่ใช่ตัวแปรหลักในการวิเคราะห์",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เมื่อคอลัมน์นั้นมีข้อมูลครบถ้วน 100%",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เมื่อต้องการเปลี่ยนสีตารางให้สวยงาม",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หากคอลัมน์ใดมีข้อมูลแหว่งหายเกินกว่า 60-80% การพยายามเดาหรือเติมค่า (Impute) จะสร้างข้อมูลเทียมมากเกินไป จึงควรพิจารณาตัดคอลัมน์นั้นออกหากไม่ใช่ตัวแปรสำคัญ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q7",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "ในคอลัมน์ Department พบข้อความว่า '  IT Support ' (มีเคาะวรรคข้างหน้า 2 ครั้ง และข้างหลัง 1 ครั้ง) จนทำให้โปรแกรมมองว่าเป็นคนละแผนกกับ 'IT Support' ควรใช้สูตรใดใน Google Sheets แก้ไข?",
        "options": [
          {
            "id": "a",
            "text": "=SUM()",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "=TRIM()",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "=RAND()",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "=NOW()",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ฟังก์ชัน =TRIM(text) จะช่วยตัดช่องว่าง (Leading & Trailing Spaces) ที่เกินมาด้านหน้าและด้านหลังข้อความออกทั้งหมด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q8",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "วิธีการทางสถิติใดที่นิยมใช้กำหนดขอบเขตบนและขอบเขตล่าง เพื่อคัดกรองค่าผิดปกติ (Outliers) โดยใช้ค่าควอไทล์ที่ 1 (Q1) และควอไทล์ที่ 3 (Q3)?",
        "options": [
          {
            "id": "a",
            "text": "วิธี IQR (Interquartile Range: ขอบเขต Q1 - 1.5*IQR และ Q3 + 1.5*IQR)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การเรียงตัวอักษร ก-ฮ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การนับจำนวนตัวอักษรด้วย =LEN()",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การเปลี่ยนสีพื้นหลังตาราง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เกณฑ์ 1.5 * IQR (โดย IQR = Q3 - Q1) เป็นเกณฑ์มาตรฐานสากลที่ใช้ในแผนภาพกล่อง (Box Plot) เพื่อระบุว่าค่าใดที่ต่ำกว่า Q1 - 1.5(IQR) หรือสูงกว่า Q3 + 1.5(IQR) จัดเป็น Outlier",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q9",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "ปัญหาที่คอลัมน์ Submit_Date มีทั้งรูปแบบ '2026-11-05' และ '05/11/2026' ปะปนกัน จัดเป็นความบกพร่องของมิติคุณภาพข้อมูลข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "Consistency (ความสอดคล้องของรูปแบบข้อมูล)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Uniqueness (ความเป็นเอกลักษณ์)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Completeness (ความครบถ้วน)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Hardware Failure (อุปกรณ์พัง)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Consistency คือความสอดคล้องกันของรูปแบบและมาตรฐานการบันทึกข้อมูล การใช้วันที่คนละรูปแบบจะทำให้เรียงลำดับหรือกรองข้อมูลตามเดือนผิดพลาด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "31901-2012-w3-q10",
        "courseId": "31901-2012",
        "week": 3,
        "type": "choice",
        "question": "ในการทำเวิร์กช็อปทำความสะอาดชุดข้อมูลบน Google Sheets ขั้นตอนใดถือเป็นหลักปฏิบัติที่ปลอดภัยที่สุดก่อนเริ่มลบหรือแก้ไขข้อมูล?",
        "options": [
          {
            "id": "a",
            "text": "สำรองข้อมูลดิบไว้ในแท็บ 'Raw_Data' เสมอ แล้วคัดลอกออกมาทำในแท็บ 'Cleaned_Data' เพื่อป้องกันข้อมูลต้นฉบับสูญหาย",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ลบข้อมูลต้นฉบับทิ้งทันทีโดยไม่ต้องตรวจสอบ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ผสานเซลล์ (Merge Cells) ทุกคอลัมน์เข้าด้วยกัน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "สุ่มพิมพ์ตัวเลขใหม่ทับลงไปในทุกแถว",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "กฎเหล็กของ Data Analyst คือห้ามแก้ไขทับไฟล์ Raw Data ต้นฉบับโดยตรง ต้องสำรองแท็บ Raw_Data ไว้เสมอ เพื่อให้สามารถตรวจสอบย้อนกลับ (Audit Trail) ได้เมื่อเกิดข้อผิดพลาด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ]
  },
  "21901-2007": {
    "1": [
      {
        "id": "21901-2007-w1-q1",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "บอร์ด Arduino Uno R3 ใช้ชิปไมโครคอนโทรลเลอร์ (Microcontroller) รุ่นใดเป็นสมองประมวลผลหลัก?",
        "options": [
          {
            "id": "a",
            "text": "ATmega328P",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Intel Core i5",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ESP32-S3",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "STM32F401",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "บอร์ด Arduino Uno R3 ใช้ไมโครคอนโทรลเลอร์เบอร์ ATmega328P สถาปัตยกรรม 8-bit AVR ของบริษัท Microchip (เดิม Atmel)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q2",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "พินแอนะล็อก A0 - A5 บนบอร์ด Arduino Uno R3 มีวงจร ADC ความละเอียดเท่าใด และแปลงแรงดัน 0-5V ออกมาเป็นตัวเลขช่วงใด?",
        "options": [
          {
            "id": "a",
            "text": "8 บิต (0 ถึง 255)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "10 บิต (0 ถึง 1023)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "12 บิต (0 ถึง 4095)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "16 บิต (0 ถึง 65535)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Arduino Uno R3 มีตัวแปลงสัญญาณ ADC ขนาด 10 บิต (2^10 = 1024 ค่า) จึงแปลงแรงดันไฟฟ้า 0-5 โวลต์ออกมาเป็นตัวเลข 0 ถึง 1023",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q3",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "พินดิจิทัลที่มีสัญลักษณ์ตัวหนอน (~) เช่น ขา 3, 5, 6, 9, 10, 11 มีความสามารถพิเศษใด?",
        "options": [
          {
            "id": "a",
            "text": "รองรับเฉพาะกระแสไฟสลับ 220V เท่านั้น",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ปล่อยสัญญาณ PWM (Pulse Width Modulation) จำลองแรงดันแอนะล็อก เช่น หรี่ไฟหรือคุมความเร็วมอเตอร์ได้",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ป้องกันไฟฟ้าสถิตและตัดไฟอัตโนมัติ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ใช้ต่อตรงเข้ากับสายอินเทอร์เน็ต LAN",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "พิน PWM ส่งสัญญาณคลื่นสี่เหลี่ยมความถี่สูงสลับ Duty Cycle (0-255) ด้วยคำสั่ง analogWrite() ช่วยจำลองระดับแรงดันแอนะล็อก",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q4",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดอธิบายความหมายของระบบสมองกลฝังตัว (Embedded System) ได้ถูกต้องที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "คอมพิวเตอร์ทั่วไปสำหรับพิมพ์งาน ท่องเว็บ และเล่นเกม",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ระบบคอมพิวเตอร์ขนาดเล็กที่ออกแบบมาเพื่อทำงาน \"เฉพาะทาง\" บรรจุฝังอยู่ในอุปกรณ์เครื่องใช้ต่างๆ",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เซิร์ฟเวอร์ขนาดใหญ่ในห้องศูนย์ข้อมูลคลาวด์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "โปรแกรมตัดต่อภาพยนตร์ความละเอียดสูง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Embedded System คือระบบคอมพิวเตอร์ขนาดเล็กที่มีไมโครโปรเซสเซอร์/ไมโครคอนโทรลเลอร์ ฝังตัวอยู่ในอุปกรณ์เพื่อทำงานเฉพาะด้าน เช่น ระบบแอร์ เบรก ABS ตู้เย็น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q5",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "เหตุใดการต่อหลอดไฟ LED เข้ากับพินดิจิทัลของ Arduino จึงต้องต่อตัวต้านทาน (Resistor เช่น 220 โอห์ม) อนุกรมร่วมด้วยเสมอ?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อเพิ่มความสว่างของหลอดไฟ LED ให้มากเป็นสองเท่า",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพื่อจำกัดกระแสไฟฟ้า (Current Limiting) ไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือพินบอร์ดไหม้",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "เพื่อแปลงกระแสไฟสลับให้เป็นกระแสตรง",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อเก็บประจุไฟฟ้าไว้สำรองยามไฟตก",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "LED มีความต้านทานภายในต่ำมาก หากต่อตรงกับไฟ 5V กระแสจะพุ่งสูงเกินพิกัดพิน (ปกติไม่เกิน 20-40 mA) จึงต้องมีตัวต้านทานอนุกรมไว้จำกัดกระแส",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q6",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "หากต้องการอ่านค่าความเข้มแสงจากเซนเซอร์ LDR (Photoresistor) ผ่านขา A0 ของ Arduino ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "digitalRead(A0);",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "analogRead(A0);",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "analogWrite(A0, HIGH);",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "serialRead(A0);",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การอ่านค่าแอนะล็อกที่มีการเปลี่ยนแปลงระดับแรงดันต่อเนื่อง (0-5V) จากพิน A0-A5 ต้องใช้ฟังก์ชัน analogRead()",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q7",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "ข้อใดอธิบายแนวคิดหลักของ Internet of Things (IoT) ได้ถูกต้องที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "การนำระบบสมองกลฝังตัวและเซนเซอร์มาเชื่อมต่อเข้าสู่โครงข่ายอินเทอร์เน็ต เพื่อส่งข้อมูลขึ้นคลาวด์และควบคุมสั่งการได้จากระยะไกล",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การต่อสายแลนระหว่างคอมพิวเตอร์ตั้งโต๊ะสองเครื่อง",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การดาวน์โหลดเพลงจากอินเทอร์เน็ตมาเก็บไว้ในแฟลชไดรฟ์",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การซ่อมแซมหน้าจอโทรศัพท์มือถือที่แตก",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "IoT คือการขยายขีดความสามารถของระบบสมองกลฝังตัวให้สามารถสื่อสารผ่านอินเทอร์เน็ต ทำให้ส่งข้อมูลเซนเซอร์ขึ้นคลาวด์และสั่งการจากที่ไหนก็ได้ในโลก",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q8",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "พินดิจิทัลหมายเลข 13 บนบอร์ด Arduino Uno R3 มีคุณลักษณะเฉพาะที่โดดเด่นอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "เป็นพินเดียวที่ไม่สามารถจ่ายไฟ 5V ได้",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "มีไฟ Built-in LED สีส้มต่ออยู่บนตัวบอร์ด สามารถสั่งทดสอบไฟกระพริบได้ทันทีโดยไม่ต้องต่อหลอดภายนอก",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ใช้สำหรับรีเซ็ตบอร์ดเท่านั้น ห้ามสั่งงานผ่านโปรแกรม",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "รองรับกระแสไฟฟ้าได้สูงถึง 10 แอมป์",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "พิน 13 ต่อเข้ากับ LED ดวงจิ๋ว (L) บนบอร์ด ทำให้ผู้เริ่มต้นทดลองสั่ง digitalWrite(13, HIGH) สังเกตไฟติดดับได้ทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q9",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "อุปกรณ์ข้อใดต่อไปนี้จัดอยู่ในกลุ่ม \"อุปกรณ์รับสัญญาณเข้าแบบแอนะล็อก\" (Analog Input)?",
        "options": [
          {
            "id": "a",
            "text": "สวิตช์ปุ่มกด (Pushbutton)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ตัวต้านทานปรับค่าได้ (Potentiometer / วอลลุ่ม)",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "หลอดไฟ LED",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "บัซเซอร์ส่งเสียง (Buzzer)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตัวต้านทานปรับค่าได้ (Potentiometer) จ่ายแรงดันไฟฟ้าแปรผัน 0-5V ต่อเนื่องตามองศาการหมุน จัดเป็น Analog Input ส่วน Pushbutton เป็น Digital Input",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w1-q10",
        "courseId": "21901-2007",
        "week": 1,
        "type": "choice",
        "question": "ขาพิน GND (Ground) บนบอร์ด Arduino มีความสำคัญอย่างไรในวงจรอิเล็กทรอนิกส์?",
        "options": [
          {
            "id": "a",
            "text": "เป็นพินที่จ่ายไฟแรงดันสูง 220V",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เป็นจุดอ้างอิงแรงดัน 0V (ขั้วลบ) ของวงจร อุปกรณ์ทุกตัวต้องมีสายต่อร่วมกันเพื่อให้กระแสไหลครบวงจร",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ใช้รับสัญญาณวิทยุจากเสาอากาศ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ใช้ปรับสัญญาณนาฬิกาของซีพียู",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "GND (Ground) คือขั้วลบหรือจุดอ้างอิง 0V หากไม่ต่อสายกราวด์ร่วมกัน (Common Ground) กระแสจะไม่สามารถไหลครบวงจรและอุปกรณ์จะไม่ทำงาน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "2": [
      {
        "id": "21901-2007-w2-q1",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "จุดเด่นสำคัญที่สุดของการทดลองวงจรบน Autodesk Tinkercad Circuits คือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "ใช้งานฟรีผ่านเว็บเบราว์เซอร์ ปลอดภัย 100% ทดลองและเรียนรู้ได้โดยไม่มีอุปกรณ์จริงเสียหาย",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ต้องเชื่อมต่อกับฮาร์ดแวร์จริงผ่านพอร์ต USB เสมอจึงจะรันได้",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "รองรับเฉพาะภาษา Assembly เท่านั้น ไม่รองรับภาษา C++",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ต้องเสียค่าลิขสิทธิ์รายเดือนราคาแพง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Tinkercad Circuits เป็นเว็บแอปพลิเคชันจำลองวงจรอิเล็กทรอนิกส์ฟรีจาก Autodesk ช่วยให้ฝึกต่อวงจรและเขียนโค้ดได้ทุกที่โดยไม่ต้องกลัววงจรช็อตหรืออุปกรณ์เสียหาย",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q2",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดอธิบายการทำงานของฟังก์ชัน void setup() ใน Arduino ได้ถูกต้องที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "ทำงานวนซ้ำไปเรื่อยๆ จนกว่าจะกดปุ่ม Stop",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ทำงานเพียง \"ครั้งเดียว\" เมื่อบอร์ดเริ่มทำงานหรือถูกกดรีเซ็ต เพื่อกำหนดค่าเริ่มต้น",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ทำงานเฉพาะตอนมีสัญญาณอินพุตเข้ามาเท่านั้น",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ใช้สำหรับคำนวณสูตรคณิตศาสตร์เท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "void setup() คือฟังก์ชันที่คอมไพเลอร์จะเรียกทำงานเพียงรอบเดียวตอนเปิดเครื่อง เพื่อเตรียมความพร้อม เช่น กำหนดโหมดพินด้วย pinMode()",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q3",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ข้อใดอธิบายพฤติกรรมการทำงานของฟังก์ชัน void loop() ได้ถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "ทำงานวนซ้ำคำสั่งตั้งแต่บรรทัดแรกจนถึงบรรทัดสุดท้าย แล้ววนกลับมาเริ่มใหม่ไม่รู้จบ",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำงาน 10 รอบแล้วหยุดอัตโนมัติ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ทำงานพร้อมกับ setup() สลับกันทีละคำสั่ง",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "จะทำงานก็ต่อเมื่อเกิดข้อผิดพลาดขึ้นในโปรแกรมเท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "void loop() คือวงรอบการทำงานหลัก (Main Loop) ของไมโครคอนโทรลเลอร์ ซึ่งจะทำงานวนซ้ำคำสั่งในบล็อกเรื่อยๆ ตราบใดที่มีไฟเลี้ยง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q4",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "หากต้องการให้พินดิจิทัลหมายเลข 2 ทำหน้าที่เป็นพอร์ตส่งสัญญาณออกไปเปิดหลอดไฟ LED ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "pinMode(2, OUTPUT);",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "pinMode(2, INPUT);",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "digitalWrite(2, OUTPUT);",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "digitalRead(2, HIGH);",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง pinMode(pin, mode) ใช้กำหนดทิศทางของพิน โดย OUTPUT คือส่งสัญญาณออกไปควบคุมอุปกรณ์ภายนอก",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q5",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "เมื่อต้องการสั่งจ่ายไฟ 5 โวลต์ (ตรรกะ 1) ไปยังพินดิจิทัลเพื่อให้หลอดไฟติดสว่าง ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "digitalWrite(pin, HIGH);",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "digitalWrite(pin, LOW);",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "digitalRead(pin, HIGH);",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "pinMode(pin, HIGH);",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "digitalWrite(pin, HIGH) จะส่งระดับแรงดัน 5V ออกทางพิน ทำให้หลอดไฟ LED สว่าง ส่วน LOW จะสั่งตัดไฟเป็น 0V",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q6",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ประโยชน์สำคัญของการสร้าง Function (ฟังก์ชันขึ้นมาเอง) ในการเขียนโปรแกรมควบคุมไฟคือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "ช่วยลดความซ้ำซ้อนของโค้ด ทำให้โค้ดเป็นระเบียบ อ่านง่าย และสามารถเรียกใช้งานซ้ำได้สะดวก",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ทำให้หลอดไฟสว่างมากกว่าการเขียนโค้ดใน loop() ตรงๆ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ช่วยประหยัดกระแสไฟฟ้าของบอร์ด Arduino",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำให้ไม่จำเป็นต้องต่อตัวต้านทานในวงจร",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การแยกโค้ดเป็นฟังก์ชัน (Modular Programming) ช่วยให้โปรแกรมกระชับ ไม่ต้องเขียนโค้ดเดิมซ้ำๆ และเรียกใช้งานซ้ำได้ทุกจุด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q7",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ตามรูปภาพกายวิภาคของหลอด LED ขา Anode (ขั้วบวก) มีลักษณะสังเกตภายนอกอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "เป็นขายาวกว่า (Longer lead) และแผ่นโลหะด้านในหลอดมีขนาดเล็กกว่า",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เป็นขาสั้นกว่า และขอบเลนส์พลาสติกมีรอยบากแบน",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เป็นสายสีดำเสมอ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "หลอด LED มีขาสองข้างเท่ากันทุกประการ ไม่สามารถแยกได้",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตามคู่มือ Arduino: Anode (+) คือขายาว และแผ่นด้านในเล็ก ส่วน Cathode (-) คือขาสั้น มีรอยบากแบน (Flat rim) และแผ่นในรูปทั่งใหญ่",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q8",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "การต่อขาของหลอดไฟ LED 1 ดวงเข้ากับวงจร Arduino บน Breadboard ข้อใดถูกต้อง?",
        "options": [
          {
            "id": "a",
            "text": "ขา Anode (ขายาว/ขั้วบวก) ต่อเข้าพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω) และขา Cathode (ขาสั้น/ขั้วลบ) ต่อลงพิน GND",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ขา Anode ต่อลง GND และขา Cathode ต่อเข้าพินดิจิทัล 5V โดยไม่ต้องมีตัวต้านทาน",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ต่อขาทั้งสองข้างเข้าช่อง GND ทั้งคู่",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ต้องต่อเข้ากับไฟบ้าน 220V เสมอ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ขา Anode รับไฟบอกจากพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω เพื่อจำกัดกระแส) ส่วน Cathode ต่อลง GND ของบอร์ด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q9",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ทำไมจึงต้องต่อตัวต้านทาน (Resistor) ขนาด 220 Ω อนุกรมกับหลอดไฟ LED เสมอ?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อจำกัดกระแสไฟฟ้าไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือบอร์ดเสียหาย",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพื่อเพิ่มแรงดันไฟฟ้าจาก 5V ให้เป็น 12V",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพื่อเปลี่ยนสีของหลอดไฟ LED ตามความต้านทาน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อให้หลอดไฟกระพริบได้เองโดยไม่ต้องเขียนโค้ด",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "LED มีความต้านทานภายในต่ำมาก หากไม่มีตัวต้านทานจำกัดกระแส (Current Limiting Resistor) กระแสไฟจะไหลเกินพิกัด ส่งผลให้หลอดขาดทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w2-q10",
        "courseId": "21901-2007",
        "week": 2,
        "type": "choice",
        "question": "ในการทำใบงานไฟวิ่ง 5 ดวง หากต้องการให้ไฟวิ่งเร็วขึ้น (เปลี่ยนดวงไวขึ้น) ควรปรับแต่งที่จุดใด?",
        "options": [
          {
            "id": "a",
            "text": "ลดค่าตัวเลขในคำสั่ง delay() เช่น จาก delay(500) เป็น delay(150)",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพิ่มค่าตัวเลขในคำสั่ง delay() ให้มากขึ้น เช่น delay(5000)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เปลี่ยนพินจาก Pin 2 เป็น Pin 13",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ลบฟังก์ชัน void setup() ทิ้ง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ฟังก์ชัน delay(ms) รับค่าเวลาเป็นมิลลิวินาที ยิ่งค่าน้อย ระยะเวลาหยุดรอยิ่งสั้น ทำให้ไฟสลับติดดับได้รวดเร็วขึ้น",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "3": [
      {
        "id": "21901-2007-w3-q1",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง Serial.begin(9600); ในฟังก์ชัน setup() มีหน้าที่อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "เปิดช่องทางการสื่อสารข้อมูลแบบอนุกรม (Serial) ระหว่างบอร์ดกับคอมพิวเตอร์ที่ความเร็ว 9600 บอด",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "จ่ายกระแสไฟฟ้า 9600 มิลลิแอมป์ให้บอร์ด Arduino",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "หน่วงเวลาการทำงานของบอร์ด 9.6 วินาที ก่อนเริ่มต้นระบบ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "กำหนดให้ขาพินหมายเลข 9600 เริ่มอ่านค่า",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Serial.begin(baudRate) เป็นคำสั่งเปิดพอร์ต USB เพื่อส่ง-รับข้อมูลระหว่าง Arduino กับคอมพิวเตอร์ โดย 9600 คือ Baud Rate หรืออัตราความเร็วในการรับส่ง 9,600 บิตต่อวินาที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q2",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "ข้อใดอธิบายความแตกต่างระหว่าง Serial.print() กับ Serial.println() ได้ถูกต้องที่สุด?",
        "options": [
          {
            "id": "a",
            "text": "Serial.println() จะขึ้นบรรทัดใหม่ (New Line) หลังแสดงผลเสร็จ ส่วน Serial.print() จะแสดงผลต่อท้ายในบรรทัดเดิม",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Serial.print() ใช้สำหรับข้อความ ส่วน Serial.println() ใช้ได้เฉพาะตัวเลข",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Serial.print() พิมพ์ลง Serial Monitor ส่วน Serial.println() ส่งข้อมูลไปยังเครื่องพิมพ์ภายนอก",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทั้งสองคำสั่งทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง Serial.print() จะส่งข้อความออกไปโดยไม่ขึ้นบรรทัดใหม่ ทำให้สามารถต่อคำได้ ส่วน Serial.println() จะส่งรหัสขึ้นบรรทัดใหม่ (\\r\\n) ต่อท้ายเสมอ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q3",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "การใช้คำสั่ง Serial Monitor มีประโยชน์สำคัญที่สุดอย่างไรในขั้นตอนการพัฒนาโครงงาน Arduino?",
        "options": [
          {
            "id": "a",
            "text": "ช่วยในการตรวจสอบค่าตัวแปรและ Debugging ทำให้เรา \"มองเห็นความคิดของชิป\" และตรวจหาจุดผิดพลาดในโค้ดได้ง่าย",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ช่วยเพิ่มความเร็วในการประมวลผลของ CPU ให้เร็วขึ้น 10 เท่า",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ช่วยประหยัดพลังงานแบตเตอรี่ของบอร์ด Arduino",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ช่วยแปลงภาษา C++ ให้เป็นไฟล์ Hex โดยอัตโนมัติ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เนื่องจากบอร์ด Arduino ไม่มีหน้าจอแสดงผลในตัว Serial Monitor จึงเป็นเครื่องมือ Debugging สำคัญที่สุดที่ช่วยให้โปรแกรมเมอร์ดูค่าเซนเซอร์และการเปลี่ยนสถานะได้แบบ Real-time",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q4",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "ปัญหา \"Contact Bouncing\" ของสวิตช์ปุ่มกดคืออะไร?",
        "options": [
          {
            "id": "a",
            "text": "แผ่นโลหะภายในปุ่มกดสั่นกระดอนไปมาหลายครั้งในเสี้ยววินาทีตอนกด ทำให้ไมโครคอนโทรลเลอร์ตรวจจับว่ากดปุ่มซ้ำหลายครั้ง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "สวิตช์ปุ่มกดกระเด็นหลุดออกจาก Breadboard",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "แรงดันไฟฟ้าตกจนบอร์ดดับ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ปุ่มกดค้างไม่ยอมเด้งคืน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "กลไกสวิตช์เมื่อหน้าสัมผัสกระทบกัน แผ่นโลหะจะสปริงตัวสั่นกระดอน (Bounce) ประมาณ 5-20 มิลลิวินาที ทำให้สัญญาณดิจิทัลกระพริบถี่ๆ ส่งผลให้โปรแกรมเข้าใจว่ามีการกดปุ่มหลายสิบครั้ง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q5",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "วิธีแก้ปัญหา Contact Bouncing (Debounce) ในระดับเริ่มต้นที่ง่ายและนิยมใช้ในโค้ด Arduino คือข้อใด?",
        "options": [
          {
            "id": "a",
            "text": "ใส่คำสั่ง delay(50); เล็กน้อยหลังตรวจพบการกด เพื่อรอให้การสั่นของหน้าสัมผัสโลหะนิ่งลง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพิ่มแรงดันไฟเป็น 9V",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เขียนคำสั่ง noTone() ซ้ำๆ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เปลี่ยนขาพินจาก Digital เป็น Analog",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Software Debounce อย่างง่ายทำได้โดยหน่วงเวลาสั้นๆ (เช่น 30-50 ms) หลังตรวจพบการกด เพื่อข้ามช่วงเวลาที่แผ่นโลหะกำลังกระดอน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q6",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง tone(8, 1000); มีหน้าที่การทำงานอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "สร้างสัญญาณเสียงความถี่ 1000 Hz (1 kHz) ออกไปยัง Piezo Buzzer ที่ต่ออยู่ขาพิน 8",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เปิดเสียงนาน 1000 วินาที",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ปรับความดังของเสียงเป็นระดับ 1000 เดซิเบล",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ตรวจจับเสียงความถี่ 1000 Hz จากไมโครโฟน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "พารามิเตอร์ตัวแรกคือหมายเลขขาพิน (Pin 8) และพารามิเตอร์ตัวที่สองคือความถี่เสียงในหน่วย Hertz (1000 Hz เป็นเสียงโทนแหลมปานกลาง)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q7",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการสั่งให้ Piezo Buzzer ที่ต่ออยู่ขาพิน 8 \"หยุดส่งเสียงทันที\" ต้องใช้คำสั่งใด?",
        "options": [
          {
            "id": "a",
            "text": "noTone(8);",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "digitalWrite(8, LOW);",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "tone(8, 0);",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "stopSound(8);",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "คำสั่ง noTone(pin) เป็นคำสั่งมาตรฐานของ Arduino ในการหยุดตัวสร้างสัญญาณความถี่ (Timer) บนขาพินนั้นๆ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q8",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "ในโปรแกรมจำลอง Autodesk Tinkercad Circuits หากต้องการเปิดดูข้อความที่ส่งออกมาด้วยคำสั่ง Serial ต้องทำอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "คลิกแถบ Code ด้านบน แล้วกดปุ่ม \"Serial Monitor\" ที่แถบด้านล่างของหน้าต่างโค้ด",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ต้องนำจอ LCD 16x2 มาต่อเพิ่มในวงจรเท่านั้น",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "กดปุ่ม Export ด้านบนขวาเพื่อดาวน์โหลดไฟล์ข้อความ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "บน Tinkercad ไม่สามารถดู Serial Monitor ได้ ต้องใช้บอร์ดจริงเท่านั้น",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ใน Autodesk Tinkercad Circuits หน้าต่าง Serial Monitor จะซ่อนอยู่ที่แถบด้านล่างสุดของหน้าต่าง Code เมื่อกดเปิดและเริ่ม Simulation ข้อความจะแสดงผลทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q9",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "หากต้องการสร้างสวิตช์ปุ่มกดที่กด 1 ครั้ง \"เปิดระบบ\" และกดอีก 1 ครั้ง \"ปิดระบบ\" (Toggle State) ต้องเก็บค่าสถานะอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ใช้ตัวแปรแบบบูลีน เช่น isSystemOn = !isSystemOn; สลับค่าจริง-เท็จทุกครั้งที่ตรวจพบ Falling Edge",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ใช้คำสั่ง while(true) วนลูปไม่สิ้นสุด",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ต้องตัดสายไฟทิ้งเมื่อต้องการปิด",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ใช้คำสั่ง analogRead() ตรวจสอบอุณหภูมิ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Toggle State นิยมใช้ตัวแปร bool หรือ int เพื่อจำสถานะปัจจุบัน เมื่อมีการกดปุ่มจะกลับค่าสถานะตรงข้าม (NOT) ทำให้สลับเปิด-ปิดได้เหมือนสวิตช์ไฟบ้าน",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w3-q10",
        "courseId": "21901-2007",
        "week": 3,
        "type": "choice",
        "question": "คำสั่ง state = (state + 1) % 3; นิยมใช้ในกรณีใดสำหรับระบบ State Machine?",
        "options": [
          {
            "id": "a",
            "text": "การวนสลับโหมดการทำงาน 3 สถานะ (0 -> 1 -> 2 -> 0 วนไปเรื่อยๆ) เมื่อมีการกดปุ่ม",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "การเพิ่มความเร็วของไฟกระพริบ 3 เท่า",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "การแบ่งแรงดันไฟ 5V ออกเป็น 3 ส่วน",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "การลบข้อมูลในหน่วยความจำทิ้ง 30%",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "ตัวดำเนินการ Modulo (%) จะช่วยวนลูปตัวเลข เมื่อ state ถึง 3 ตัวเศษจะกลายเป็น 0 ทำให้เราสร้าง State Machine หมุนเวียนโหมด 0, 1, 2 ได้อย่างกระชับและแม่นยำ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "4": [
      {
        "id": "21901-2007-w4-q1",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "โครงสร้างมาตรฐานของคำสั่ง for loop ในภาษา C++ ของ Arduino ประกอบด้วย 3 ส่วนใดตามลำดับ?",
        "options": [
          {
            "id": "a",
            "text": "for (เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "for (การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "for (กำหนดค่าเริ่มต้น; เงื่อนไขการวนซ้ำ; การเพิ่มหรือลดค่า)",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "for (กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ)",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "โครงสร้างของ for loop คือ for (Initialization; Condition; Update) เช่น for (int i = 0; i < 6; i++)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q2",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "หากกำหนดให้ ledCount = 4; แล้วรันคำสั่ง for (int i = 0; i < ledCount; i++) คำสั่งภายในลูปจะทำงานกี่รอบ และ i มีค่าอะไรบ้าง?",
        "options": [
          {
            "id": "a",
            "text": "ทำงาน 4 รอบ โดยค่า i คือ 1, 2, 3 และ 4",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ทำงาน 5 รอบ โดยค่า i คือ 0, 1, 2, 3 และ 4",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ทำงาน 3 รอบ โดยค่า i คือ 0, 1 และ 2",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำงาน 4 รอบ โดยค่า i คือ 0, 1, 2 และ 3",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "เริ่มจาก i = 0 และทำตราบใดที่ i < 4 ดังนั้น i จะเป็น 0, 1, 2, 3 (รวม 4 รอบ) พอ i เพิ่มเป็น 4 เงื่อนไข 4 < 4 จะเป็นเท็จและออกจากลูปทันที",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q3",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "เมื่อประกาศ const int ledPins[6] = {2, 3, 4, 5, 6, 7}; คำสั่ง ledPins[0] และ ledPins[5] อ้างอิงถึงขาพินหมายเลขใดตามลำดับ?",
        "options": [
          {
            "id": "a",
            "text": "ledPins[0] คือขาพิน 1 และ ledPins[5] คือขาพิน 6",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 7",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ledPins[0] คือขาพิน 0 และ ledPins[5] คือขาพิน 5",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 6",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "Index ของ Array เริ่มนับที่ 0 เสมอ ดังนั้น ledPins[0] มีค่าเท่ากับ 2 และ ledPins[5] (ตัวที่หก) มีค่าเท่ากับ 7",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q4",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "ส่วนแรกของ for loop คือ int i = 0; จะถูกประมวลผลกี่ครั้งต่อการรัน for loop 1 ชุด?",
        "options": [
          {
            "id": "a",
            "text": "ทำงานทุกรอบของลูป ทำให้ค่า i กลับเป็น 0 ทุกครั้ง",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ทำงานเฉพาะรอบสุดท้ายก่อนออกจากลูป",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ทำงานเท่ากับจำนวนรอบของลูปที่กำหนดไว้ในเงื่อนไข",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ทำงานเพียงครั้งเดียวตอนเริ่มเข้าสู่ลูป",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "ส่วน Initialization (int i = 0;) ทำงานแค่ครั้งเดียวตอนเริ่มเข้าลูป จากนั้นในแต่ละรอบจะทำงานเฉพาะ Condition -> Body -> Update (i++)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q5",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "ในใบงานที่มีปุ่มกด 2 ปุ่ม หากกด \"ปุ่มตั้งค่า\" ขณะที่ ledCount เท่ากับ 6 อยู่แล้ว โปรแกรมควรจัดการค่า ledCount อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 1",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้ปล่อยค่าไว้เป็น 7",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 0",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่ต้องตรวจสอบ เพราะ for loop จะหยุดเองเมื่อครบ 6 ดวง",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "มี LED 6 ดวง หากตั้งค่าเกิน 6 จะทำให้เข้าถึง Array เกินขอบเขต (Out of Bounds) จึงต้องวนค่ากลับมาเริ่มที่ 1 ใหม่ (ค่า 0 จะไม่มีไฟวิ่งเลย)",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q6",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "เหตุใดเมื่อกด \"ปุ่มเล่น\" ไฟ LED จึงวิ่งตามจำนวนที่ตั้งไว้เพียง 1 รอบแล้วหยุด ไม่วิ่งวนซ้ำตลอด?",
        "options": [
          {
            "id": "a",
            "text": "เพราะ for loop อยู่ในฟังก์ชัน setup() ซึ่งทำงานเพียงครั้งเดียว",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เพราะ Serial.begin(9600) ทำให้ลูปหยุดหลังจบ 1 รอบ",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพราะ for loop อยู่ในเงื่อนไขตรวจจับการกดปุ่มครั้งเดียว (lastBtnPlayState == HIGH && currentBtnPlay == LOW)",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "เพราะ delay(300) ทำให้ลูปถูกยกเลิกเมื่อครบเวลา",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "การวาง for loop ไว้ใน if (lastBtnPlayState == HIGH && currentBtnPlay == LOW) ทำให้ลูปรันเฉพาะจังหวะที่กดปุ่มลง 1 ครั้ง พอรันครบ 1 รอบก็กลับไปเช็คปุ่มต่อ",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q7",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "หากต้องการให้ไฟ LED วิ่งย้อนกลับจากดวงที่ 6 ลงมาดวงที่ 1 (Index 5 ลงมา 0) ต้องเขียนหัวคำสั่ง for loop อย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "for (int i = 5; i > 0; i--)",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "for (int i = 6; i >= 0; i--)",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "for (int i = 5; i >= 0; i++)",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "for (int i = 5; i >= 0; i--)",
            "isCorrect": true
          }
        ],
        "score": 1,
        "explanation": "ต้องเริ่ม i = 5, เงื่อนไข i >= 0 (เพื่อให้รวม Index 0) และลดค่าทีละ 1 ด้วย i-- ตัวเลือกอื่นพลาด Index 0, เริ่มที่ 6 ซึ่งเกิน Array หรือเพิ่มค่าแทนที่จะลด",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q8",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "ถ้าเขียนผิดเป็น for (int i = 0; i < 6; i--) ซึ่งเริ่มที่ 0 แต่ลดค่า i ลงเรื่อย ๆ (0, -1, -2, ...) จะเกิดผลอย่างไร?",
        "options": [
          {
            "id": "a",
            "text": "ลูปทำงานเพียงรอบเดียวแล้วออกจากลูปทันที",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "เกิด Infinite Loop เพราะ i ติดลบและน้อยกว่า 6 เสมอ ทำให้อ้างอิงขาพินผิดพลาด",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ลูปไม่ทำงานเลย เพราะค่าเริ่มต้นไม่ตรงกับเงื่อนไข",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ลูปทำงาน 6 รอบตามปกติ แต่ไฟวิ่งย้อนกลับ",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "เมื่อ i ลดเป็น -1, -2, -3 เงื่อนไข i < 6 จะเป็นจริงตลอด โปรแกรมจึงติดอยู่ในลูปไม่รู้จบ (Infinite Loop) และอ่านค่าหน่วยความจำนอก Array",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q9",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "ทำไมภายในลูปไฟวิ่งจึงต้องมีคำสั่ง digitalWrite(ledPins[i], LOW); ตามหลัง delay(300);?",
        "options": [
          {
            "id": "a",
            "text": "เพื่อดับไฟดวงปัจจุบันก่อนขยับไปเปิดดวงถัดไป ให้เห็นเป็นไฟวิ่งทีละดวง",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "เพื่อรีเซ็ตค่า i ให้กลับเป็น 0 ก่อนเริ่มรอบถัดไป",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "เพื่อลดแรงดันไฟที่จ่ายให้ขาพินไม่ให้สูงเกินไป",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "เพื่อให้ delay(300) ทำงานได้ถูกต้องในรอบถัดไป",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "หากสั่งแต่ HIGH โดยไม่สั่ง LOW หลอดไฟจะติดค้างสะสมไปเรื่อย ๆ การสั่ง HIGH -> delay -> LOW ในแต่ละรอบของ i จึงทำให้เห็นไฟติดและดับไล่ทีละดวง",
        "createdAt": "2026-03-01T00:00:00.000Z"
      },
      {
        "id": "21901-2007-w4-q10",
        "courseId": "21901-2007",
        "week": 4,
        "type": "choice",
        "question": "การใช้ pinMode(BTN_PIN, INPUT_PULLUP); ร่วมกับการต่อปุ่มกดลง GND มีข้อดีอย่างไรในการต่อวงจร?",
        "options": [
          {
            "id": "a",
            "text": "ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น LOW ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น HIGH",
            "isCorrect": false
          },
          {
            "id": "b",
            "text": "ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น HIGH ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น LOW",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "ใช้ตัวต้านทานภายนอกที่ต่อพ่วงในปุ่มกด ทำให้สัญญาณเป็น HIGH ปกติ",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "ไม่ใช้ตัวต้านทานเลย แต่ใช้การหน่วงเวลาในโปรแกรมแทนการกันสัญญาณรบกวน",
            "isCorrect": false
          }
        ],
        "score": 1,
        "explanation": "INPUT_PULLUP เปิดใช้ตัวต้านทาน Pull-up ภายในชิป ATmega328P ทำให้ไม่ต้องต่อตัวต้านทานภายนอก สัญญาณปกติเป็น HIGH และเมื่อกดปุ่ม (ต่อลง GND) จะเป็น LOW",
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ]
  }
};

export const allFlatQuestions = [
  {
    "id": "31901-2007-w1-q1",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดต่อไปนี้จัดว่าเป็น 'ข้อมูล (Data)' ที่แท้จริง?",
    "options": [
      {
        "id": "a",
        "text": "รายงานสรุปยอดขายประจำเดือนที่พิมพ์เสนอผู้บริหาร",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ตัวเลข 150, 200, 350 ที่จดบันทึกไว้บนเศษกระดาษโดยยังไม่ได้ประมวลผล",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "กราฟแท่งเปรียบเทียบผลกำไรขาดทุนประจำปี",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "บทวิเคราะห์พฤติกรรมการซื้อสินค้าของผู้บริโภค",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ข้อมูล (Data) คือข้อเท็จจริงดิบที่ยังไม่ได้ผ่านการประมวลผล ส่วนรายงานหรือกราฟสรุปจัดเป็น 'สารสนเทศ (Information)'",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q2",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ปัญหาใดที่มักเกิดขึ้นบ่อยที่สุดในระบบแฟ้มข้อมูลแบบดั้งเดิม (File-based System)?",
    "options": [
      {
        "id": "a",
        "text": "Data Redundancy (ความซ้ำซ้อนของข้อมูลที่ถูกบันทึกไว้หลายที่)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Data Encryption (การเข้ารหัสข้อมูลที่รัดกุมเกินไป)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "System Overheating (เซิร์ฟเวอร์มีความร้อนสูงเกินปกติ)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Automatic Indexing (ระบบจัดทำดัชนีอัตโนมัติมากเกินไป)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ในระบบแฟ้มข้อมูลดั้งเดิม ข้อมูลเดียวกันมักถูกเก็บซ้ำๆ ในหลายแผนก ทำให้เปลืองเนื้อที่และนำไปสู่ข้อมูลขัดแย้ง (Inconsistency)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q3",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "การใช้โปรแกรม Microsoft Excel ในการเก็บข้อมูลพนักงาน ถือว่าเป็นระบบจัดการฐานข้อมูล (DBMS) หรือไม่ เพราะเหตุใด?",
    "options": [
      {
        "id": "a",
        "text": "เป็น เพราะ Excel สามารถเรียงลำดับและใส่สูตรคำนวณได้",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ไม่เป็น เพราะ Excel เป็น Spreadsheet ขาดระบบจัดการ Transaction และการควบคุม Concurrent Access ที่ปลอดภัย",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เป็น เพราะมีหน้าตาเป็นตารางแถวและคอลัมน์เหมือนกัน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่เป็น เพราะ Excel ไม่สามารถบันทึกข้อความภาษาไทยได้",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Excel เป็น Spreadsheet ที่ออกแบบมาสำหรับคำนวณ ไม่ใช่ DBMS เพราะขาดกลไก ACID, การล็อกระดับเรคคอร์ด และการจัดการความปลอดภัยขั้นสูง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q4",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ใครคือผู้มีหน้าที่กำหนดโครงสร้างสถาปัตยกรรมฐานข้อมูล ดูแลสิทธิ์การเข้าถึง และการสำรอง/กู้คืนข้อมูล?",
    "options": [
      {
        "id": "a",
        "text": "Database Administrator (DBA - ผู้บริหารฐานข้อมูล)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "End User (ผู้ใช้ระบบทั่วไป)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Hardware Technician (ช่างประกอบคอมพิวเตอร์)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Data Entry Clerk (เจ้าหน้าที่พิมพ์ดีดเอกสาร)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "DBA มีหน้าที่รับผิดชอบบริหารจัดการภาพรวมทั้งหมดของฐานข้อมูล รวมถึงประสิทธิภาพ ความปลอดภัย และการสำรองข้อมูล",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q5",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ระดับการมองข้อมูล (Three-Level Architecture) ระดับใดที่ซ่อนความซับซ้อนและแสดงเฉพาะข้อมูลที่ผู้ใช้นั้นมีสิทธิ์ดู?",
    "options": [
      {
        "id": "a",
        "text": "Physical Level (ระดับกายภาพ)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Logical Level (ระดับตรรกะ)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "View Level หรือ External Level (ระดับวิว/ภายนอก)",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "Storage Level (ระดับตัวแผ่นแม่เหล็ก)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "View Level เป็นระดับสูงสุดที่ติดต่อกับผู้ใช้ โดยสร้างมุมมองเฉพาะ (View) ให้ผู้ใช้เห็นเฉพาะส่วนที่เกี่ยวข้องกับหน้าที่ตนเอง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q6",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ระดับตรรกะ (Logical Level หรือ Conceptual Level) มีบทบาทหน้าที่สำคัญข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "อธิบายว่าฐานข้อมูลเก็บข้อมูลอะไรบ้าง มี Entity ใด และมีความสัมพันธ์ (Relationship) อย่างไร",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "กำหนดชนิดและรอบหมุนของจานแม่เหล็กในฮาร์ดดิสก์",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ออกแบบหน้าต่างกราฟิกสำหรับกดปุ่มคลิกของแอปมือถือ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "คำนวณค่าไฟฟ้าของห้องแม่ข่ายคอมพิวเตอร์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Logical Level เป็นระดับที่ DBA ออกแบบว่าระบบประกอบด้วยข้อมูลอะไรบ้าง มีฟิลด์ใด และเชื่อมโยงกันอย่างไร โดยไม่ขึ้นกับฮาร์ดแวร์",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q7",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "Physical Level (ระดับกายภาพ) เกี่ยวข้องกับสิ่งใดโดยตรง?",
    "options": [
      {
        "id": "a",
        "text": "การจัดเก็บข้อมูลจริงลงในหน่วยความจำ ฮาร์ดดิสก์ โครงสร้างไฟล์ และดัชนี (Indexing)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การตั้งชื่อหน้าจอเมนูให้กับผู้ใช้งานภายนอก",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การเขียนเงื่อนไขทางธุรกิจในใบเสร็จรับเงิน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การนำเสนอข้อมูลต่อคณะกรรมการบริษัท",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Physical Level เป็นระดับล่างสุดที่บอกว่าข้อมูลถูกแปลงเป็นไบต์และบล็อกจัดเก็บบนสื่อบันทึกข้อมูลอย่างไร",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q8",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "คุณสมบัติ 'ความเป็นอิสระของข้อมูล' (Data Independence) มีประโยชน์อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "สามารถปรับเปลี่ยนโครงสร้างระดับล่างได้โดยไม่ต้องเขียนโปรแกรมประยุกต์ใหม่ทั้งหมด",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำให้คอมพิวเตอร์ทำงานได้โดยไม่ต้องเสียบปลั๊กไฟ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "อนุญาตให้ใครก็ได้ลบฐานข้อมูลทิ้งได้ตลอดเวลา",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ยกเลิกระบบความปลอดภัยทั้งหมดเพื่อให้เข้าถึงได้เร็วขึ้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Independence แบ่งเป็น Physical และ Logical ช่วยให้การแก้โครงสร้างข้อมูลไม่กระทบโปรแกรมที่เรียกใช้งานอยู่",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q9",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ปัญหา 'Data Inconsistency' (ความไม่สอดคล้องกันของข้อมูล) มักส่งผลเสียต่อธุรกิจอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "เกิดข้อมูลขัดแย้งกันในระบบ ทำให้รายงานไม่ตรงกันและไม่รู้ว่าข้อมูลชุดใดถูกต้อง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำให้คีย์บอร์ดพิมพ์ตัวเลขไม่ติด",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ทำให้คอมพิวเตอร์ส่งเสียงแจ้งเตือนตลอดเวลา",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำให้กระดาษพิมพ์รายงานหมดเร็วกว่าปกติ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เมื่อข้อมูลซ้ำซ้อนถูกอัปเดตไม่ครบทุกจุด จะทำให้ข้อมูลแต่ละที่ขัดแย้งกัน เช่น ยอดสต็อกในบัญชีไม่ตรงกับยอดหน้าร้าน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w1-q10",
    "courseId": "31901-2007",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดคือข้อดีที่เด่นชัดที่สุดของการเปลี่ยนจากระบบแฟ้มข้อมูลมาเป็นระบบจัดการฐานข้อมูล (DBMS)?",
    "options": [
      {
        "id": "a",
        "text": "ลดความซ้ำซ้อน มีความปลอดภัยสูง ควบคุมการใช้งานพร้อมกันได้ และข้อมูลมีความถูกต้องน่าเชื่อถือ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ไม่ต้องซื้ออุปกรณ์คอมพิวเตอร์มาใช้งานอีกต่อไป",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ยกเลิกการตั้งรหัสผ่านเพื่อให้ทำงานได้รวดเร็วที่สุด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "บังคับให้ผู้ใช้งานทุกคนต้องเขียนภาษา SQL เป็นทุกคน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "DBMS ช่วยรวมศูนย์ข้อมูล ควบคุมการเข้าถึง ป้องกันความซ้ำซ้อน และรักษาความสมบูรณ์ถูกต้อง (Integrity) ของข้อมูล",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q1",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ทำไมในระบบฐานข้อมูล PostgreSQL และ Supabase จึงแนะนำให้จัดเก็บ 'ยอดเงิน/ราคาสินค้า' ด้วย numeric มากกว่า float?",
    "options": [
      {
        "id": "a",
        "text": "เพราะ float ประมวลผลได้ช้ากว่า numeric มาก",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพราะ float มีข้อจำกัดเรื่อง Floating-point Rounding Error ทำให้ทศนิยมปัดเศษคลาดเคลื่อน ส่วน numeric ให้ค่าแม่นยำแน่นอน",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพราะ float เก็บค่าติดลบไม่ได้",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะ Supabase ไม่อนุญาตให้ใช้ float ในทุกกรณี",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "float ใช้เลขฐานสองแทนทศนิยม จึงเกิดการปัดเศษคลาดเคลื่อนทางคณิตศาสตร์ได้ (เช่น 0.1 + 0.2 != 0.3) สำหรับการเงินจึงต้องใช้ numeric/decimal เสมอ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q2",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดคือ 'กฎเหล็ก 2 ข้อ' ของ Primary Key (คีย์หลัก) ที่ขาดไม่ได้เด็ดขาด?",
    "options": [
      {
        "id": "a",
        "text": "ต้องเป็นตัวเลขจำนวนเต็ม และต้องเรียงลำดับจากน้อยไปมาก",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ต้องเป็นค่าที่ไม่ซ้ำซ้อนกันในตาราง (Unique) และห้ามมีค่าว่าง (Not Null)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ต้องมีความยาวไม่เกิน 10 ตัวอักษร และต้องเป็นภาษาอังกฤษ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ต้องเชื่อมโยงไปยังตารางภายนอก และต้องมีดัชนี Index เสมอ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Primary Key มีข้อบังคับพื้นฐานตามหลัก Entity Integrity คือ ต้องระบุแต่ละแถวได้อย่างเป็นเอกลักษณ์ (Unique) และต้องมีค่าเสมอ (NOT NULL)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q3",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ใน Supabase และ PostgreSQL การจัดเก็บข้อความทั่วไป เช่น ชื่อ-นามสกุล หรือ ที่อยู่ ข้อใดคือ Best Practice ที่แนะนำมากที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "ใช้ char(255) เพื่อให้พื้นที่ตารางคงที่เท่ากันทุกแถว",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ใช้ text เพราะ PostgreSQL จัดการ Storage Engine ของ text และ varchar มีประสิทธิภาพเท่ากัน ไม่จำเป็นต้องกะความยาวล่วงหน้า",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ใช้ bytea เพราะปลอดภัยต่อการถูก SQL Injection",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ใช้ blob เพราะรองรับภาษาไทยได้ดีกว่า",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ใน PostgreSQL ชนิดข้อมูล text, varchar และ varchar(n) ใช้วิธีจัดเก็บแบบเดียวกัน ความเร็วเท่ากัน จึงนิยมใช้ text เพื่อความยืดหยุ่น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q4",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "เพราะเหตุใด 'หมายเลขโทรศัพท์ (Phone Number)' และ 'เลขบัตรประชาชน 13 หลัก' จึงห้ามเก็บเป็นชนิดข้อมูล integer?",
    "options": [
      {
        "id": "a",
        "text": "เพราะฐานข้อมูลจะปฏิเสธไม่ให้บันทึกถ้ามีเลข 9",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพราะตัวเลขเหล่านี้มีเลข 0 นำหน้า ซึ่งชนิด integer จะตัดเลข 0 ตัวหน้าทิ้งทันที และข้อมูลนี้เป็นรหัสระบุตัวตนไม่ได้นำไปคำนวณ",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพราะ integer เก็บข้อมูลได้ไม่เกิน 5 หลัก",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะ Supabase บังคับให้เบอร์โทรศัพท์ต้องเป็น boolean เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เบอร์โทรศัพท์ขึ้นต้นด้วย 0 เช่น '0812345678' หากเป็น int ระบบจะตัดเลข 0 ทิ้งเหลือ 812345678 และไม่ได้นำไปบวกลบคูณหาร จึงต้องเก็บเป็น text/varchar",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q5",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อดีสำคัญที่สุดของการเลือกใช้ 'UUID' เป็น Primary Key บนระบบ Cloud DBMS (Supabase) เมื่อเทียบกับ Auto-increment (1, 2, 3...) คืออะไร?",
    "options": [
      {
        "id": "a",
        "text": "ใช้พื้นที่ฮาร์ดดิสก์น้อยกว่าตัวเลขจำนวนเต็ม",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ป้องกันการคาดเดา ID (Enumeration Attack) และสร้าง ID ได้จาก Client/หลาย Server พร้อมกันโดยไม่ชนกัน",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ค้นหาข้อมูลได้เร็วกว่าตัวเลข 10 เท่าเสมอ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "สามารถพิมพ์ด้วยตัวพิมพ์ใหญ่เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "UUID ป้องกันแฮกเกอร์เดารหัส เช่น เปลี่ยน URL จาก /orders/101 เป็น /orders/102 และเหมาะกับระบบคลาวด์แบบกระจายศูนย์ (Distributed Systems)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q6",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "หากต้องการบันทึกวันเวลาที่สร้างข้อมูล โดยปรับเวลาตามโซนเวลาสากลอัตโนมัติ ควรเลือกชนิดข้อมูลและค่า Default ใดใน Supabase?",
    "options": [
      {
        "id": "a",
        "text": "date และค่าเริ่มต้น '2026-01-01'",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "timestamptz พร้อมค่าเริ่มต้น now()",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "time พร้อมค่าเริ่มต้น CURRENT_DATE",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "varchar(20) พร้อมค่าเริ่มต้น 'today'",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "timestamptz (Timestamp with time zone) เก็บเวลาแบบ UTC และแปลงตามโซนเวลาของผู้ใช้ได้อย่างถูกต้อง คู่กับฟังก์ชัน now() หรือ CURRENT_TIMESTAMP",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q7",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อกำหนด (Constraint) ชนิดใดที่ใช้สำหรับตรวจสอบเงื่อนไขทางตรรกะของข้อมูล เช่น 'ราคาสินค้าต้องมากกว่า 0' หรือ 'อายุต้องอยู่ระหว่าง 15 ถึง 100 ปี'?",
    "options": [
      {
        "id": "a",
        "text": "FOREIGN KEY",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "CHECK Constraint",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "AUTO_INCREMENT",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "NOT NULL",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "CHECK Constraint ใช้กำหนดเงื่อนไขทางตรรกะ หากข้อมูลที่ Insert หรือ Update ไม่ผ่านเงื่อนไข ระบบจะปฏิเสธและแจ้ง Error ทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q8",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดอธิบายความแตกต่างระหว่าง 'PRIMARY KEY' และ 'UNIQUE Constraint' ได้ถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "PRIMARY KEY ยอมให้มีค่าว่าง (NULL) ได้ 1 แถว ส่วน UNIQUE ห้ามมีค่าว่าง",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "1 ตารางมี PRIMARY KEY ได้เพียงชุดเดียวและห้ามเป็น NULL ส่วน UNIQUE มีได้หลายคอลัมน์ในตารางเดียวกันและยอมให้เป็น NULL ได้",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "UNIQUE ใช้ได้เฉพาะตัวเลข ส่วน PRIMARY KEY ใช้ได้เฉพาะข้อความ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทั้งสองข้อกำหนดทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตารางมี PK ได้เพียง 1 ตัวและห้ามเป็น NULL แต่สามารถสร้าง UNIQUE Constraint ได้หลายคอลัมน์ (เช่น email, phone) และยอมรับค่า NULL หากไม่ได้ล็อก NOT NULL",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q9",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "คำสั่ง SQL DDL ข้อใดต่อไปนี้สร้างคอลัมน์ auto-increment ที่เป็น Primary Key ตามมาตรฐาน PostgreSQL ยุคใหม่บน Supabase ได้ถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "id number AUTO_INCREMENT PRIMARY KEY",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "id integer CHECK (id > 0)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "id text DEFAULT 'auto'",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "มาตรฐาน SQL สากลและ PostgreSQL ยุคใหม่ใช้ GENERATED ALWAYS/BY DEFAULT AS IDENTITY แทนชนิดข้อมูล serial แบบเก่า",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w2-q10",
    "courseId": "31901-2007",
    "week": 2,
    "type": "choice",
    "question": "หากต้องการเก็บข้อมูล 'สถานะคำสั่งซื้อ' โดยจำกัดให้ใส่ได้เพียง 'pending', 'paid', 'shipped', หรือ 'cancelled' เท่านั้น ควรใช้ข้อกำหนดใด?",
    "options": [
      {
        "id": "a",
        "text": "DEFAULT 'shipped'",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "CHECK (order_status IN ('pending', 'paid', 'shipped', 'cancelled'))",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "UNIQUE (order_status)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "PRIMARY KEY (order_status)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การใช้ CHECK ร่วมกับคำสั่ง IN ช่วยควบคุมโดเมนของข้อมูล (Domain Integrity) ป้องกันไม่ให้มีการสะกดคำผิดหรือใส่สถานะที่ไม่ได้รับอนุญาต",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q1",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "ตัวย่อ 'CRUD' ในการจัดการฐานข้อมูล ประกอบด้วย 4 การกระทำพื้นฐานที่มีลำดับความหมายตรงกับข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "Create (สร้าง), Remove (ลบ), Update (แก้ไข), Duplicate (ทำสำเนา)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Connect (เชื่อมต่อ), Read (อ่าน), Unlink (ยกเลิก), Delete (ลบ)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Create (เพิ่มข้อมูล), Read (อ่าน/สืบค้น), Update (แก้ไข), Delete (ลบ)",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "Control (ควบคุม), Retrieve (ดึงข้อมูล), Upload (ส่งข้อมูล), Drop (ทิ้งตาราง)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "CRUD เป็นคำย่อสากลของการดำเนินการกับข้อมูล 4 ประการ ได้แก่ Create (สร้าง/เพิ่มแถวใหม่), Read (อ่านหรือคิวรีข้อมูล), Update (แก้ไขข้อมูลเดิม), และ Delete (ลบข้อมูล)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q2",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง SQL ข้อใดต่อไปนี้ใช้เพิ่มข้อมูลนักศึกษาใหม่ 1 แถวเข้าสู่ตาราง students ได้ถูกต้องตามหลักไวยากรณ์?",
    "options": [
      {
        "id": "a",
        "text": "INSERT INTO students (prefix, firstname, lastname, year) VALUES ('นาย', 'สมชาย', 'ใจดี', 1);",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "INSERT INTO students (prefix, firstname, lastname, year) SET ('นาย', 'สมชาย', 'ใจดี', 1);",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "INSERT TO students VALUES (prefix='นาย', firstname='สมชาย', lastname='ใจดี', year=1);",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "INSERT INTO students (prefix, firstname, lastname, year) VALUES (\"นาย\", \"สมชาย\", \"ใจดี\", \"1\");",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ไวยากรณ์มาตรฐานของ SQL คือ INSERT INTO ตามด้วยชื่อตาราง ระบุชื่อคอลัมน์ในวงเล็บ แล้วตามด้วยคีย์เวิร์ด VALUES พร้อมส่งค่าข้อมูลที่เรียงลำดับตรงกัน โดยข้อความต้องครอบด้วย single quote ('...')",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q3",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "ในภาษา SQL หากต้องการสืบค้นเฉพาะนักศึกษาที่ 'ยังไม่มีเบอร์โทรศัพท์' (เป็นค่าว่างในฐานข้อมูล) ต้องเขียนเงื่อนไข WHERE อย่างไรจึงจะถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "WHERE telephone = NULL;",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "WHERE telephone = '';",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "WHERE telephone == 'NULL';",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "WHERE telephone IS NULL;",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "ในฐานข้อมูลเชิงสัมพันธ์ ค่า NULL คือความว่างเปล่าที่ไม่มีค่าอยู่จริง จึงไม่สามารถใช้ตัวดำเนินการ = หรือ == เปรียบเทียบได้ ต้องใช้คำสั่ง IS NULL (หรือ IS NOT NULL) เท่านั้น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q4",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "เมื่อรันคำสั่ง 'SELECT DISTINCT year FROM students;' ผลลัพธ์ที่ได้จากการประมวลผลจะเป็นอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "แสดงรายชื่อนักศึกษาทั้งหมดโดยเรียงลำดับตามชั้นปีจากน้อยไปหามาก",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "แสดงเฉพาะค่าระดับชั้นปีที่ไม่ซ้ำกัน โดยตัดค่าชั้นปีที่ซ้ำซ้อนออกทั้งหมด",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "กรองเฉพาะแถวนักศึกษาที่ข้อมูลในคอลัมน์ year ไม่เป็นค่าว่าง (Not Null)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "คำนวณนับจำนวนนักศึกษาทั้งหมดที่สังกัดอยู่ในแต่ละระดับชั้นปี",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คีย์เวิร์ด DISTINCT ทำหน้าที่คัดกรองแถวผลลัพธ์ที่มีค่าซ้ำกันในคอลัมน์ที่เลือกออกไป เพื่อแสดงเฉพาะค่าที่เป็นเอกลักษณ์ (Unique values) เพียงค่าละ 1 บรรทัด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q5",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "ในระบบฐานข้อมูล PostgreSQL บน Supabase คำสั่ง ILIKE มีพฤติกรรมการค้นหาที่แตกต่างจากคำสั่ง LIKE ปกติอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ILIKE ใช้ค้นหาข้อมูลเฉพาะชนิดตัวเลข ส่วน LIKE ใช้ค้นหาข้อมูลชนิดข้อความ",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ILIKE บังคับค้นหาคำที่ตรงกันเป๊ะ 100% ส่วน LIKE อนุญาตให้มีคำสะกดผิดได้",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ILIKE ไม่คำนึงถึงความต่างของตัวพิมพ์เล็ก/ใหญ่ (Case-insensitive) ส่วน LIKE แยกตัวพิมพ์เล็ก/ใหญ่",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "ILIKE ค้นหาข้อมูลได้เร็วกว่าเนื่องจากระบบจะสร้าง Index ให้โดยอัตโนมัติขณะรัน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ใน PostgreSQL คำสั่ง LIKE จะเป็น Case-sensitive (เช่น 'Somchai' จะไม่เจอ 'somchai') แต่คำสั่ง ILIKE (Insensitive LIKE) จะมองข้ามความต่างของตัวพิมพ์เล็กและใหญ่ ทำให้สะดวกในการค้นหาข้อความ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q6",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง 'SELECT * FROM students WHERE firstname ILIKE '%สม%';' จะดึงข้อมูลนักศึกษาคนใดออกมาบ้าง?",
    "options": [
      {
        "id": "a",
        "text": "ดึงเฉพาะนักศึกษาที่มีชื่อว่า 'สม' พอดีเป๊ะเพียง 2 ตัวอักษรเท่านั้น",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ดึงเฉพาะนักศึกษาที่มีชื่อลงท้ายด้วยคำว่า 'สม' เท่านั้น เช่น 'พรสม'",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ดึงเฉพาะนักศึกษาที่มีชื่อขึ้นต้นด้วยคำว่า 'สม' เท่านั้น เช่น 'สมชาย', 'สมศักดิ์'",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ดึงนักศึกษาทุกคนที่มีคำว่า 'สม' ปรากฏอยู่ตรงส่วนใดก็ได้ของชื่อจริง",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "เครื่องหมาย Wildcard '%' มีความหมายว่ามีตัวอักษรใดๆ จำนวนเท่าใดก็ได้ การใส่ '%สม%' ประกบทั้งหน้าและหลังจึงหมายถึงชื่อที่มีคำว่า 'สม' อยู่ตำแหน่งใดก็ได้ (ต้นชื่อ กลางชื่อ หรือท้ายชื่อ)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q7",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง 'WHERE year BETWEEN 1 AND 2;' มีขอบเขตการดึงข้อมูลเทียบเท่ากับการเขียนเงื่อนไขในข้อใดอย่างถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "WHERE year >= 1 AND year <= 2;",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "WHERE year > 1 AND year < 2;",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "WHERE year = 1 OR year = 3;",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "WHERE year >= 1 AND year < 2;",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตัวดำเนินการ BETWEEN ในภาษา SQL มีคุณสมบัติเป็น Inclusive คือนับรวมค่าขอบเขตทั้งสองด้าน (รวมทั้งค่า 1 และ 2 เข้าไปด้วย)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q8",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการดึงรายชื่อนักศึกษาโดย 'เรียงจากชั้นปีมากไปน้อย (ปี 2 ก่อนปี 1) และจำกัดแสดงผลเพียง 5 คนแรก' ต้องเขียนคำสั่งต่อท้าย SQL อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "SORT BY year ASC LIMIT 5;",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ORDER BY year ASC LIMIT 5;",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ORDER BY year DESC LIMIT 5;",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "ORDER BY year DESC TOP 5;",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การเรียงจากมากไปน้อยต้องใช้ ORDER BY ตามด้วยคอลัมน์และคำว่า DESC (Descending) และการจำกัดจำนวนแถวใน PostgreSQL ใช้คำสั่ง LIMIT ไม่ใช่คำว่า TOP (TOP เป็นคำสั่งของ MS SQL Server)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q9",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "ทำไมการรันคำสั่ง 'UPDATE students SET year = 2;' โดยไม่มีเงื่อนไข WHERE จึงจัดเป็นข้อผิดพลาดร้ายแรง?",
    "options": [
      {
        "id": "a",
        "text": "เพราะจะทำให้คำสั่งติด Syntax Error และถูกระบบ Supabase ระงับบัญชีถาวร",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพราะระบบจะเปลี่ยนค่าชั้นปีของนักศึกษา 'ทุกแถวในตาราง' ให้กลายเป็นปี 2 ทั้งหมด",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพราะระบบจะไม่อนุญาตให้อัปเดตและจะทำการ Rollback ลบตารางทิ้งทันที",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะคำสั่งจะสุ่มเลือกอัปเดตเฉพาะแถวแรกสุดของตารางเพียงแถวเดียว",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง UPDATE หรือ DELETE ใน SQL หากไม่ระบุเงื่อนไข WHERE คำสั่งจะมีผลต่อทุกระเบียนข้อมูล (All Records) ในตารางทันทีโดยไม่มีการแจ้งเตือนถามซ้ำ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w3-q10",
    "courseId": "31901-2007",
    "week": 3,
    "type": "choice",
    "question": "ก่อนที่จะตัดสินใจรันคำสั่ง 'DELETE FROM students WHERE year = 4;' แนวปฏิบัติที่ปลอดภัยที่สุด (Safe Practice) คือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "เขียนคำสั่ง DROP TABLE students; เพื่อล้างตารางแล้วสร้างโครงสร้างใหม่",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เปลี่ยนเงื่อนไขเป็น WHERE year != 4; เพื่อทดสอบลบกลุ่มอื่นดูก่อน",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "สั่งคำสั่ง UPDATE students SET year = 0; เพื่อทำเครื่องหมายว่าพร้อมลบ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เขียนคำสั่ง SELECT * FROM students WHERE year = 4; มารันตรวจสอบแถวเป้าหมายก่อน",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "การรันคำสั่ง SELECT ด้วยเงื่อนไข WHERE เดียวกันก่อน จะช่วยให้ผู้ใช้งานมองเห็นเรคคอร์ดข้อมูลที่จะได้รับผลกระทบด้วยตาตนเองก่อนทำการลบจริง ป้องกันการลบข้อมูลผิดพลาดได้อย่างปลอดภัย 100%",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q1",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "สาเหตุสำคัญที่สุดที่ระบบฐานข้อมูลเชิงสัมพันธ์ (RDBMS) ต้องแยกข้อมูลออกเป็นหลายตารางคือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "ลดความซ้ำซ้อนของข้อมูล (Data Redundancy) และป้องกันความผิดพลาดในการแก้ไขหรือลบข้อมูล",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำให้พื้นที่จัดเก็บข้อมูลบนฮาร์ดดิสก์เพิ่มขึ้น 2 เท่า",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพื่อให้สามารถใส่รหัสผ่านได้หลายชุดในตารางเดียว",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ระบบฐานข้อมูลบังคับให้มีได้ตารางละ 1 คอลัมน์เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การเก็บข้อมูลทุกอย่างไว้ในตารางเดียวจะทำให้เกิดข้อมูลซ้ำซ้อน (Redundancy) เช่น พิมพ์ชื่อแผนกเดิมซ้ำเป็นพันครั้ง และเกิดปัญหาผิดพลาดเวลาแก้ไขหรือลบข้อมูล (Data Anomalies)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q2",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "ในความสัมพันธ์แบบ 1 to Many (1:N) เช่น 1 สาขาวิชา (departments) มีนักศึกษาในสังกัดได้หลายคน (students) คอลัมน์ Foreign Key (department_id) ต้องถูกสร้างไว้ที่ตารางใด?",
    "options": [
      {
        "id": "a",
        "text": "ตาราง students (ฝั่ง Many)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ตาราง departments (ฝั่ง 1)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ต้องสร้างทั้งสองตารางพร้อมกัน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่ต้องสร้างที่ไหนเลย เพราะระบบเชื่อมโยงด้วยชื่อตารางเอง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "กฎเหล็กของความสัมพันธ์ 1 to Many คือ \"Foreign Key ต้องอยู่ฝั่ง Many เสมอ\" เพื่อให้นักศึกษาแต่ละแถวเก็บรหัสอ้างอิงกลับไปยังสาขาวิชาที่ตนสังกัดได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q3",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "ข้อใดคือตัวอย่างความสัมพันธ์ของข้อมูลแบบ One-to-One (1:1) ในชีวิตจริง?",
    "options": [
      {
        "id": "a",
        "text": "ประชาชน 1 คน มีหมายเลขบัตรประจำตัวประชาชนได้ 1 ใบ และบัตรใบนั้นเป็นของคนๆ นั้นคนเดียว",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ลูกค้า 1 คน สามารถสั่งซื้อสินค้าได้หลายออเดอร์",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "นักศึกษา 1 คน ลงทะเบียนเรียนได้หลายวิชา",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "อาจารย์ 1 ท่าน สอนนักศึกษาได้หลายคน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ความสัมพันธ์แบบ 1:1 หมายถึง ข้อมูล 1 รายการในตารางแรก สัมพันธ์กับข้อมูลเพียง 1 รายการในตารางที่สอง เช่น บัตรประชาชนกับเจ้าของบัตร",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q4",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "ความสัมพันธ์แบบ Many-to-One (N:1) มีความหมายอย่างไรเมื่อเทียบกับ One-to-Many (1:N)?",
    "options": [
      {
        "id": "a",
        "text": "เป็นความสัมพันธ์แบบเดียวกัน เพียงแต่มองจากมุมของฝั่ง Many ย้อนกลับไปหาฝั่ง 1",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เป็นคนละเรื่องกันโดยสิ้นเชิง",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Many-to-One ไม่สามารถสร้าง Foreign Key ได้",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Many-to-One ใช้ได้เฉพาะกับฐานข้อมูล NoSQL เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Many-to-One เป็นเพียงการมองย้อนมุมของ 1:N เช่น \"นักศึกษาหลายคน สังกัดอยู่ 1 สาขาวิชา\" (N:1) ก็คือเรื่องเดียวกับ \"1 สาขาวิชา มีนักศึกษาหลายคน\" (1:N)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q5",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "เหตุใดระบบฐานข้อมูลเชิงสัมพันธ์จึงไม่สามารถเชื่อมโยง Many-to-Many (N:M) ระหว่าง 2 ตารางได้โดยตรง?",
    "options": [
      {
        "id": "a",
        "text": "เพราะไม่สามารถใส่รหัส ID หลายๆ ค่าเป็นลิสต์คั่นด้วยจุลภาคลงในคอลัมน์เดียวได้ (ผิดกฎความเป็นอะตอม 1NF)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพราะไมโครซอฟท์และออราเคิลไม่ได้จดสิทธิบัตรนี้ไว้",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะระบบฐานข้อมูลรองรับ Foreign Key ได้แค่ตารางละ 1 ตัว",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะตัวเลข ID ของนักศึกษาจะชนกับตัวเลข ID ของวิชาเรียน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ในฐานข้อมูลเชิงสัมพันธ์ แต่ละช่องของแถวต้องเก็บค่าเดี่ยว (Atomic Value) การเก็บ ID หลายตัวเป็นลิสต์จะทำให้ค้นหา เรียงลำดับ และตรวจสอบความถูกต้องของข้อมูลไม่ได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q6",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "ตารางตัวกลาง (Junction Table หรือ Bridge Table) ทำหน้าที่อย่างไรในการแก้ปัญหา Many-to-Many?",
    "options": [
      {
        "id": "a",
        "text": "ทำหน้าที่แตกความสัมพันธ์ Many-to-Many ออกเป็นความสัมพันธ์ 1 to Many จำนวน 2 เส้นเชื่อมเข้าหาตารางกลาง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำหน้าที่สำรองข้อมูลตารางเก่าไว้เมื่อฮาร์ดดิสก์เต็ม",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ทำหน้าที่เปลี่ยนรหัสผ่านของผู้ดูแลระบบฐานข้อมูล",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำหน้าที่ลบข้อมูลทั้งสองตารางทิ้งพร้อมกัน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Junction Table เช่น ตาราง enrollments จะเก็บ Foreign Key จากทั้งตารางนักศึกษาและตารางวิชาเรียน ทำให้ความสัมพันธ์ N:M กลายเป็น 1:N สองเส้นได้อย่างสมบูรณ์",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q7",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "ในตารางตัวกลาง enrollments ที่เชื่อมระหว่าง students กับ courses คอลัมน์ที่จำเป็นต้องมีอย่างน้อยที่สุดคือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "student_id (FK อ้างอิง students) และ course_id (FK อ้างอิง courses)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เบอร์โทรศัพท์ของนักศึกษา และชื่อวิชา",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "รหัสผ่านผู้ดูแลระบบ และ IP Address",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ยอดเงินคงเหลือในบัญชีธนาคาร",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตารางตัวกลางจะต้องมี Foreign Key อย่างน้อย 2 ตัวที่ชี้กลับไปยัง Primary Key ของตารางแม่ทั้งสองฝั่ง เพื่อบอกว่า \"ใคร (student_id) ลงทะเบียนวิชาอะไร (course_id)\"",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q8",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "เงื่อนไข ON DELETE CASCADE เมื่อกำหนดให้กับ Foreign Key มีผลต่อการทำงานอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "เมื่อแถวข้อมูลในตารางแม่ถูกลบ ข้อมูลที่เชื่อมโยงกันในตารางลูกจะถูกลบทิ้งตามไปด้วยโดยอัตโนมัติ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ห้ามลบข้อมูลในตารางแม่เด็ดขาดถ้ายังมีข้อมูลลูกอยู่",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เปลี่ยนค่า Foreign Key ให้กลายเป็นข้อความว่างเปล่า (NULL)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "สำเนาข้อมูลที่ถูกลบส่งไปยังอีเมลของอาจารย์ผู้สอน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "CASCADE หมายถึง \"การไหลต่อกันเป็นทอดๆ\" เมื่อลบข้อมูลตารางแม่ (เช่น ลบนักศึกษา) รายการลงทะเบียนเรียนของนักศึกษาคนนั้นในตารางลูกจะถูกลบทิ้งตามไปอัตโนมัติ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q9",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "หากเราต้องการป้องกันไม่ให้ผู้ใช้เผลอลบ \"สาขาวิชา\" ที่ยังมีนักศึกษาเรียนอยู่ ควรตั้งค่าข้อกำหนดการลบของ Foreign Key เป็นแบบใด?",
    "options": [
      {
        "id": "a",
        "text": "ON DELETE RESTRICT (หรือ NO ACTION) เพื่อระงับการลบและแจ้งเตือนข้อผิดพลาด",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ON DELETE CASCADE",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "DROP DATABASE ALL",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "DELETE WITHOUT WHERE",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "RESTRICT จะไม่อนุญาตให้ลบข้อมูลตารางแม่ ตราบใดที่ยังมีข้อมูลในตารางลูกอ้างอิงถึงอยู่ เพื่อป้องกันไม่ให้นักศึกษากลายเป็นเด็กไร้สังกัด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w4-q10",
    "courseId": "31901-2007",
    "week": 4,
    "type": "choice",
    "question": "บนระบบ Supabase Dashboard หากต้องการเปิดดูแผนภาพเส้นสายความสัมพันธ์ (ER Diagram) ระหว่างตารางทั้งหมด ต้องไปที่เมนูใด?",
    "options": [
      {
        "id": "a",
        "text": "เมนู Schema Visualizer ในหมวด Database",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เมนู Project Settings",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ปุ่ม Start Simulation",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เมนู Storage Buckets",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Supabase มีเครื่องมือ Schema Visualizer ที่ช่วยวาดไดอะแกรมความสัมพันธ์ระหว่างตารางและเส้นโยง Foreign Key ให้เห็นเป็นภาพกราฟิกแบบอัตโนมัติ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q1",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "ในการลงมือสร้างฐานข้อมูลเชิงสัมพันธ์ที่มีทั้งตาราง categories, products และ order_items เหตุใดจึงต้องสร้างตาราง categories ก่อนตาราง products เสมอ?",
    "options": [
      {
        "id": "a",
        "text": "เพราะตาราง products ต้องอ้างอิง Foreign Key ไปยัง categories(id) หากยังไม่มีตาราง categories จะเกิด Error ทันที",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพราะชื่อ categories ขึ้นต้นด้วยตัวอักษร C ซึ่งมาก่อนตัว P",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะตาราง categories เก็บข้อมูลได้น้อยกว่า",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "สามารถสร้างตารางไหนก่อนก็ได้ ระบบจะเดาตารางแม่ให้เอง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ในระบบ RDBMS ตารางปลายทางที่ถูกอ้างอิง (Parent Table) ต้องมีตัวตนอยู่ในฐานข้อมูลก่อน จึงจะสามารถสร้าง Foreign Key จากตารางลูกชี้ไปหาได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q2",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "ชนิดข้อมูล (Data Type) ของคอลัมน์ Foreign Key ในตารางลูก ต้องสัมพันธ์กับคอลัมน์ Primary Key ของตารางแม่อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ต้องเป็นชนิดข้อมูลเดียวกันหรือเข้ากันได้ (เช่น ถ้า PK เป็น BIGINT/int8 คอลัมน์ FK ก็ต้องเป็น BIGINT/int8 ด้วย)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ต้องเป็นชนิดข้อมูลต่างกันเสมอ เช่น PK เป็นตัวเลข FK ต้องเป็นข้อความ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "บังคับให้ใช้ชนิดข้อมูล BOOLEAN เท่านั้นสำหรับ Foreign Key",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่ต้องกำหนดชนิดข้อมูลให้กับคอลัมน์ Foreign Key",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คอลัมน์ Foreign Key และ Primary Key ที่เชื่อมโยงกันต้องมีชนิดข้อมูลตรงกัน เช่น BIGINT (int8) กับ BIGINT หรือ UUID กับ UUID มิฉะนั้น PostgreSQL จะไม่อนุญาตให้ผูกความสัมพันธ์",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q3",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "เมื่อสร้างตารางผ่านหน้าจอ GUI ของ Supabase Table Editor หากต้องการผูกความสัมพันธ์ Foreign Key ให้กับคอลัมน์ ต้องคลิกที่สัญลักษณ์ใด?",
    "options": [
      {
        "id": "a",
        "text": "ไอคอนรูปโซ่คล้อง (Link / Add Foreign Key Relation) ด้านขวาของคอลัมน์ หรือปุ่ม Add Foreign Key",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ไอคอนรูปถังขยะสีแดง",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ปุ่ม Log Out มุมซ้ายล่าง",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไอคอนรูปไมโครโฟน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ในหน้าต่างสร้างหรือแก้ไขคอลัมน์ของ Supabase จะมีไอคอนรูปโซ่ (Link relation) สำหรับเลือก Schema, ตารางเป้าหมาย และคอลัมน์เป้าหมาย",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q4",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "ตาราง order_items ที่เชื่อมโยงระหว่าง orders (ใบสั่งซื้อ) กับ products (สินค้า) ถือเป็นตารางประเภทใดในระบบฐานข้อมูลเชิงสัมพันธ์?",
    "options": [
      {
        "id": "a",
        "text": "Junction Table (หรือ Bridge Table) เพื่อแปลงความสัมพันธ์ Many-to-Many (N:M) ให้เป็น One-to-Many (1:N) สองฝั่ง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Log Table ใช้บันทึกข้อความ error ของระบบ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Backup Table ตารางสำรองข้อมูลชั่วคราว",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Virtual Table ตารางจำลองที่ไม่มีการเก็บข้อมูลจริง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตารางกลางที่ประกอบด้วย Foreign Key ชี้ไปยังตารางหลัก 2 ตารางเพื่อแก้ปัญหาความสัมพันธ์ N:M เรียกว่า Junction Table หรือ Bridge Table",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q5",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "หากเรากำหนดเงื่อนไขการลบ Foreign Key เป็น ON DELETE CASCADE ในตาราง order_items ชี้ไปที่ orders จะเกิดอะไรขึ้นเมื่อลบข้อมูลใบสั่งซื้อ 1 แถว?",
    "options": [
      {
        "id": "a",
        "text": "รายการสินค้าทั้งหมดใน order_items ที่ผูกกับ orders นั้นจะถูกลบออกอัตโนมัติ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ระบบจะปฏิเสธการลบและเกิดข้อผิดพลาด Error",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ตาราง orders ทั้งหมดจะถูกลบทิ้งทั้งตาราง",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ข้อมูลสินค้าใน order_items จะถูกเปลี่ยนเป็นค่า 0",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ON DELETE CASCADE หมายความว่าเมื่อแถวข้อมูลในตารางแม่ (Orders) ถูกลบ แถวข้อมูลในตารางลูก (Order_items) ที่อ้างอิงอยู่จะถูกลบทิ้งตามไปด้วยโดยอัตโนมัติ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q6",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "หากเรากำหนดเงื่อนไข ON DELETE RESTRICT (หรือ NO ACTION) ในตาราง products ชี้ไปยัง categories จะส่งผลอย่างไรเมื่อผู้ใช้พยายามลบหมวดหมู่ที่มีสินค้าผูกอยู่?",
    "options": [
      {
        "id": "a",
        "text": "ระบบจะบล็อกไม่อนุญาตให้ลบ และแจ้งข้อผิดพลาดว่ายังมีข้อมูลสินค้าลูกอ้างอิงอยู่",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "สินค้าทั้งหมดในหมวดหมู่นั้นจะถูกลบไปด้วยทันที",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "หมวดหมู่จะถูกลบ แล้วเปลี่ยนค่า category_id ของสินค้าเป็น NULL",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ระบบจะสุ่มย้ายสินค้าไปหมวดหมู่อื่นแทน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "RESTRICT หรือ NO ACTION จะช่วยป้องกันความคงสภาพของข้อมูล (Referential Integrity) โดยไม่อนุญาตให้ลบข้อมูลแม่ตราบใดที่ยังมีข้อมูลลูกอ้างอิงอยู่",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q7",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "ในระบบสั่งซื้อสินค้า ทำไมคอลัมน์ product_id ในตาราง order_items จึงควรใช้ ON DELETE RESTRICT แทนที่จะเป็น ON DELETE CASCADE?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อไม่ให้ประวัติการสั่งซื้อและสลิปรายการขายในอดีตสูญหายเมื่อมีการยกเลิกหรือลบสินค้านั้นออกจากระบบ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพื่อประหยัดพื้นที่ฮาร์ดดิสก์ของ Supabase",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะระบบ Supabase ไม่อนุญาตให้ใช้ CASCADE เกิน 1 จุด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะคำสั่ง RESTRICT ประมวลผลได้เร็วกว่า CASCADE เสมอ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หากตั้งเป็น CASCADE กับสินค้า เวลาลบสินค้าออกจากแคตตาล็อก ประวัติยอดขายในบิลเก่าๆ จะหายไปทำให้บัญชีผิดพลาด จึงต้องใช้ RESTRICT เพื่อปกป้องประวัติการซื้อขาย",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q8",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "คำสั่ง SQL ใดใช้สำหรับดึงข้อมูลจากตาราง products และตาราง categories มาแสดงผลรวมกันเฉพาะแถวที่มีความสัมพันธ์ตรงกัน?",
    "options": [
      {
        "id": "a",
        "text": "SELECT * FROM products p INNER JOIN categories c ON p.category_id = c.id;",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "SELECT * FROM products MERGE categories;",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "COMBINE TABLE products WITH categories;",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "INSERT INTO products SELECT categories;",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง INNER JOIN ... ON ... ใช้เชื่อมตารางตั้งแต่ 2 ตารางขึ้นไปโดยตรวจสอบเงื่อนไขความเท่ากันระหว่าง Foreign Key กับ Primary Key",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q9",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "หากเผลอสร้างตารางลูกเสร็จไปแล้ว แต่ลืมกำหนด Foreign Key เราสามารถเพิ่มความสัมพันธ์ในภายหลังได้อย่างไรบน Supabase?",
    "options": [
      {
        "id": "a",
        "text": "แก้ไขตารางใน Table Editor แล้วกดผูก Foreign Key หรือรันคำสั่ง ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ต้องลบโปรเจกต์ Supabase ทิ้งแล้วสมัครสมาชิกใหม่เท่านั้น",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ไม่สามารถแก้ไขได้อีกเลยตลอดไป",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ต้องเปลี่ยนชื่อตารางให้เป็นตัวพิมพ์ใหญ่ทั้งหมด",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เราสามารถเพิ่ม Foreign Key ย้อนหลังได้ทั้งผ่านปุ่ม Edit Table ในหน้า Table Editor หรือใช้คำสั่ง SQL ALTER TABLE",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2007-w5-q10",
    "courseId": "31901-2007",
    "week": 5,
    "type": "choice",
    "question": "หลังจากสร้างตารางทั้ง 5 ตารางและผูก Foreign Key เสร็จเรียบร้อย เราสามารถตรวจสอบว่าเส้นความสัมพันธ์เชื่อมต่อกันครบถ้วนหรือไม่จากเมนูใดใน Supabase?",
    "options": [
      {
        "id": "a",
        "text": "ไปที่เมนู Database > Schema Visualizer เพื่อดูแผนภาพตารางและเส้นเชื่อมโยง Foreign Key ทั้งหมด",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ไปที่เมนู Authentication > Users",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ไปที่เมนู Storage > Buckets",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไปที่เมนู Edge Functions",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Schema Visualizer ในหมวด Database จะแสดงตารางทั้งหมดพร้อมเส้นเชื่อมจากคอลัมน์ Foreign Key ไปยัง Primary Key ทำให้ตรวจสอบความถูกต้องได้ทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q1",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดคือความหมายและเป้าหมายที่แท้จริงของคำว่า 'DevOps'?",
    "options": [
      {
        "id": "a",
        "text": "เครื่องมือเขียนโปรแกรมคอมไพเลอร์ภาษาใหม่",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "วัฒนธรรมและการทำงานร่วมกันอย่างใกล้ชิดระหว่างทีม Dev และ ทีม Ops เพื่อส่งมอบซอฟต์แวร์ได้อย่างรวดเร็วและมีเสถียรภาพ",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "โปรแกรมสำหรับสแกนและกำจัดไวรัสในเซิร์ฟเวอร์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "แผนกจัดซื้ออุปกรณ์ฮาร์ดแวร์ประจำองค์กร",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "DevOps ไม่ใช่แค่โปรแกรม แต่เป็น 'วัฒนธรรม' และ 'แนวปฏิบัติ' ที่ผสานทีม Development และ Operations เข้าด้วยกันเพื่อความรวดเร็วและคุณภาพ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q2",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ปัญหาคลาสสิก 'Works on my machine' (รันบนเครื่องฉันได้ แต่เครื่องคนอื่นพัง) มักเกิดจากสาเหตุใดมากที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "ความเร็วเครือข่ายอินเทอร์เน็ตของแต่ละคนไม่เท่ากัน",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "สภาพแวดล้อม (Environment) เวอร์ชันของโปรแกรม และไลบรารีไม่ตรงกันระหว่างเครื่องนักพัฒนาและเซิร์ฟเวอร์",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ขนาดหน้าจอคอมพิวเตอร์มีความกว้างต่างกัน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ยี่ห้อของเมนบอร์ดและคีย์บอร์ดไม่เหมือนกัน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ความแตกต่างของ OS, runtime version, หรือ library dependencies ระหว่างเครื่องทำให้เกิดปัญหานี้ ซึ่ง DevOps จะแก้ด้วย Container เช่น Docker",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q3",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ระบบควบคุมเวอร์ชัน (Version Control System เช่น Git) มีประโยชน์หลักอย่างไรในการทำงานเป็นทีม?",
    "options": [
      {
        "id": "a",
        "text": "ติดตามประวัติการแก้ไข รวมโค้ดของทุกคนเข้าด้วยกันอย่างเป็นระบบ และสามารถย้อนกลับเวอร์ชันเดิมได้ตลอดเวลา",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "แปลงโค้ดภาษา Python ให้กลายเป็นภาษา Java อัตโนมัติ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ป้องกันไม่ให้ใครเปิดดูโค้ดของตนเองได้",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำหน้าที่เป็นระบบปฏิบัติการแทน Windows หรือ Linux",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Git ช่วยบันทึกประวัติการเปลี่ยนแปลง (Commit) และสนับสนุนการทำงานร่วมกันแบบหลายกิ่ง (Branching) ได้อย่างมีประสิทธิภาพ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q4",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ในระบบ Git คำสั่งหรือการทำ 'Commit' มีความหมายตรงกับข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "การลบไฟล์และโฟลเดอร์ที่ไม่ต้องการออกจากฮาร์ดดิสก์",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "การเปิดหน้าต่างแก้ไขโค้ดขึ้นมาใหม่",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การบันทึกภาพถ่ายสถานะและการเปลี่ยนแปลงของไฟล์โค้ด ณ จุดนั้น พร้อมข้อความอธิบายความเปลี่ยนแปลง",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "การรีสตาร์ทเครื่องคอมพิวเตอร์เพื่อล้างหน่วยความจำ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Commit เปรียบเสมือนจุดเช็คพอยต์ (Snapshot) ที่บันทึกสถานะของงานพร้อมเหตุผลประกอบ เพื่อให้ตรวจสอบและย้อนกลับได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q5",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "การแตกสายการทำงาน (Branch) ใน Git มีจุดประสงค์เพื่ออะไร?",
    "options": [
      {
        "id": "a",
        "text": "แยกสายงานออกไปพัฒนาฟีเจอร์ใหม่โดยไม่ส่งผลกระทบต่อโค้ดหลักที่ใช้งานอยู่",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพิ่มความเร็วในการคำนวณของซีพียู",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "บีบอัดไฟล์ให้มีขนาดเล็กลงเพื่อส่งอีเมล",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ปิดไม่ให้นักพัฒนาคนอื่นเข้าถึงอินเทอร์เน็ตได้",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Branch ช่วยให้นักพัฒนาแยกไปทดลองหรือสร้างฟีเจอร์ใหม่ได้อย่างอิสระ เมื่อทดสอบเสร็จจึงค่อยนำมารวม (Merge) กลับเข้าสายงานหลัก",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q6",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ระบบ Continuous Integration (CI) มีหน้าที่สำคัญอย่างไรในวงจร DevOps?",
    "options": [
      {
        "id": "a",
        "text": "นำโค้ดของทุกคนมารวมกันที่ส่วนกลางสม่ำเสมอ พร้อม Build และรัน Automated Tests ทันทีเพื่อตรวจหาบั๊กโดยเร็ว",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ยกเลิกการทดสอบโค้ดทั้งหมดเพื่อปล่อยโปรแกรมให้เร็วที่สุด",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "จ้างพนักงานพิมพ์เอกสารรายงานข้อผิดพลาดส่งทางไปรษณีย์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ลบประวัติการเขียนโค้ดทิ้งทั้งหมดเพื่อความปลอดภัย",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "CI ช่วยผสานโค้ดอย่างสม่ำเสมอและทดสอบแบบอัตโนมัติ ทำให้พบปัญหาทันที ไม่ต้องรอจนถึงวันส่งมอบงาน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q7",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "Continuous Delivery / Deployment (CD) หมายถึงกระบวนการใด?",
    "options": [
      {
        "id": "a",
        "text": "การส่งมอบแผ่นซีดีโปรแกรมให้กับลูกค้าทางพัสดุ",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "กระบวนการนำซอฟต์แวร์ที่ผ่านการทดสอบแล้วไปติดตั้งลงสภาพแวดล้อมจริง (Production) แบบอัตโนมัติหรือคลิกเดียว",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "การสั่งซื้อเครื่องเซิร์ฟเวอร์ใหม่ทุกสัปดาห์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การเขียนโค้ดต่อเนื่องติดต่อกัน 48 ชั่วโมงโดยไม่หยุดพัก",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "CD ทำหน้าที่นำซอฟต์แวร์ที่ผ่าน CI แล้วขึ้นสู่เซิร์ฟเวอร์จริงได้อย่างราบรื่น ลดข้อผิดพลาดจากการติดตั้งด้วยมือ (Manual Error)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q8",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดเรียงลำดับขั้นตอนใน DevOps Infinity Loop 8 ขั้นตอนได้อย่างถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "Plan → Code → Build → Test → Release → Deploy → Operate → Monitor",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Deploy → Monitor → Plan → Release → Test → Build → Operate → Code",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Code → Deploy → Test → Plan → Monitor → Operate → Release → Build",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Monitor → Operate → Plan → Code → Deploy → Build → Test → Release",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "วงจรเริ่มจากฝั่ง Dev (Plan, Code, Build, Test) ต่อเนื่องไปยังฝั่ง Ops (Release, Deploy, Operate, Monitor) เป็นวงรอบต่อเนื่องไม่สิ้นสุด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q9",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "เทคโนโลยี Container เช่น 'Docker' เข้ามาช่วยแก้ปัญหาสำคัญข้อใดในยุค DevOps?",
    "options": [
      {
        "id": "a",
        "text": "ช่วยแพ็กแอปพลิเคชันพร้อม dependencies ทั้งหมดให้ทำงานได้เหมือนกันทุกที่ หมดปัญหาโค้ดรันได้แค่บางเครื่อง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพิ่มขนาดความจุของฮาร์ดดิสก์ทางกายภาพให้เพิ่มขึ้น",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ป้องกันไฟฟ้าดับในห้องควบคุมคอมพิวเตอร์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ช่วยแปลโค้ดภาษาอังกฤษเป็นภาษาไทยได้ทันที",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Container จำลองสภาพแวดล้อมที่จำเป็นสำหรับแอป ทำให้มั่นใจได้ว่าโค้ดที่รันบนเครื่อง Dev จะทำงานบนเซิร์ฟเวอร์จริงได้เหมือนกัน 100%",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w1-q10",
    "courseId": "21901-2012",
    "week": 1,
    "type": "choice",
    "question": "วัฒนธรรมการทำงานแบบ DevOps ส่งเสริมพฤติกรรมใดมากที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "การโยนความผิดให้ทีมอื่นเมื่อเซิร์ฟเวอร์ล่ม (Blaming Culture)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "การทำงานแบบแยกส่วน ปิดกั้นข้อมูลระหว่างแผนก (Silo)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ความรับผิดชอบร่วมกันตลอดทั้งวงจร (Shared Responsibility) และสื่อสารอย่างโปร่งใส",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "ปล่อยให้ทีม Ops แก้ปัญหาโค้ดทั้งหมดเพียงลำพังหลังปล่อยฟีเจอร์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หัวใจของ DevOps คือ Shared Responsibility ทั้งสองฝ่ายเป็นเจ้าของความสำเร็จและปัญหาของระบบร่วมกัน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q1",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "ระบบควบคุมเวอร์ชัน (Version Control System: VCS) มีบทบาทหน้าที่หลักคือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "แปลงโค้ดโปรแกรมให้เป็นไฟล์ติดตั้ง (.exe) อัตโนมัติ",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "บันทึกประวัติการเปลี่ยนแปลงของไฟล์ ทำให้สามารถตรวจสอบ ย้อนกลับ และทำงานร่วมกันเป็นทีมได้อย่างเป็นระบบ",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "สแกนไวรัสและป้องกันมัลแวร์ในเครื่องคอมพิวเตอร์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพิ่มความเร็วสัญญาณเครือข่ายอินเทอร์เน็ตของทีมพัฒนา",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "VCS ทำหน้าที่บันทึกประวัติการแก้ไขของไฟล์อย่างต่อเนื่อง ทำให้ย้อนเวลากลับไปดูหรือกู้คืนโค้ดเวอร์ชันเดิมได้ตลอดเวลา",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q2",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "ปัญหาข้อใดคือผลเสียที่ร้ายแรงที่สุดของการพัฒนาโปรแกรมโดย 'ไม่มี' การใช้ระบบควบคุมเวอร์ชัน?",
    "options": [
      {
        "id": "a",
        "text": "หน้าจอแสดงผลของโปรแกรมมีสีสันไม่สวยงาม",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "การตั้งชื่อไฟล์ซ้ำซ้อนสับสน เช่น final_v2_edit.zip และเสี่ยงต่อการเขียนไฟล์ทับงานของเพื่อนจนข้อมูลสูญหาย",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ไม่สามารถเชื่อมต่อแป้นพิมพ์และเมาส์พร้อมกันได้",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "โปรแกรมไม่ยอมเปิดให้ใช้งานหากไม่ได้เชื่อมต่อบลูทูธ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การไม่ใช้ VCS มักทำให้เกิดปัญหาไฟล์งานทับกัน (File Overwrite), สับสนเวอร์ชันล่าสุด และไม่รู้ว่าใครแก้ไขโค้ดตรงไหนเมื่อไหร่",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q3",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดคือลักษณะสำคัญของระบบควบคุมเวอร์ชันแบบรวมศูนย์ (Centralized VCS เช่น SVN)?",
    "options": [
      {
        "id": "a",
        "text": "ทุกเครื่องของนักพัฒนาจะมีสำเนาประวัติโปรเจกต์ทั้งหมดอย่างสมบูรณ์โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "มีเซิร์ฟเวอร์ส่วนกลางเพียงเครื่องเดียวที่เก็บประวัติไฟล์ทั้งหมด หากเซิร์ฟเวอร์ล่มจะทำงานไม่ได้และเสี่ยงข้อมูลสูญหาย",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ไม่สามารถใช้งานผ่านสาย LAN ได้เลย",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่บันทึกชื่อผู้แก้ไขไฟล์ลงในระบบ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Centralized VCS มีจุดบกพร่องสำคัญคือ Single Point of Failure หากเซิร์ฟเวอร์กลางเสียหายหรือเครือข่ายหลุด จะไม่สามารถบันทึกหรือย้อนประวัติได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q4",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดคือจุดเด่นที่ทำให้ระบบแบบกระจาย (Distributed VCS เช่น Git) เหนือกว่าแบบรวมศูนย์ (Centralized VCS)?",
    "options": [
      {
        "id": "a",
        "text": "นักพัฒนาทุกคนจะมีพื้นที่เก็บข้อมูล (Repository) และประวัติทั้งหมดครบถ้วนอยู่ในเครื่องตนเอง สามารถทำงานออฟไลน์ได้ 100%",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ไม่ต้องใช้พื้นที่ฮาร์ดดิสก์ในการจัดเก็บไฟล์เลย",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เขียนโค้ดได้โดยไม่ต้องพิมพ์ตัวอักษร",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "จำกัดให้มีนักพัฒนาทำงานได้เพียงคนเดียวต่อโปรเจกต์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ใน DVCS เครื่องลูกข่ายทุกเครื่องเปรียบเสมือน Backup สมบูรณ์ของเซิร์ฟเวอร์ ทำงาน ดูประวัติ และ Commit ได้โดยไม่ต้องต่อเน็ต",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q5",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดคือตัวอย่างของซอฟต์แวร์ประเภท Distributed Version Control System (DVCS)?",
    "options": [
      {
        "id": "a",
        "text": "CVS และ Microsoft Word",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Git และ Mercurial",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "Apache Subversion (SVN) และ Perforce",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Adobe Photoshop และ Illustrator",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Git และ Mercurial เป็นตัวแทนของ DVCS ส่วน SVN, CVS และ Perforce เป็นระบบแบบ Centralized (CVCS)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q6",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "Git บันทึกการเปลี่ยนแปลงของไฟล์ในแต่ละช่วงเวลา (Version) ด้วยแนวคิดใด?",
    "options": [
      {
        "id": "a",
        "text": "เก็บภาพถ่ายสถานะรวมของทั้งโปรเจกต์ (Snapshot) ในจุดเวลานั้นๆ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "บันทึกเฉพาะรูปภาพหน้าจอของคอมพิวเตอร์",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ลบไฟล์เก่าทิ้งแล้วสร้างโฟลเดอร์ใหม่เสมอ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ส่งไฟล์ทั้งหมดไปเก็บไว้ที่แผ่นดิสก์เก็ต",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Git จัดเก็บข้อมูลแบบ Snapshot (เสมือนถ่ายภาพสถานะของไฟล์ทั้งหมด ณ ขณะนั้น) หากไฟล์ไหนไม่เปลี่ยนก็จะชี้ไปยังไฟล์เดิมเพื่อประหยัดเนื้อที่",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q7",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "หลังจากติดตั้ง Git ลงในเครื่องคอมพิวเตอร์แล้ว คำสั่งแรกที่ใช้สำหรับตรวจสอบว่า Git ติดตั้งสำเร็จหรือไม่คือคำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "git --version",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "git start",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git download",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git run program",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git --version' ใช้ตรวจสอบเวอร์ชันของ Git หากติดตั้งสำเร็จจะแสดงข้อความเช่น git version 2.x.x",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q8",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "คำสั่งใดใช้สำหรับตั้งค่าชื่อ (Name) ของผู้ใช้งานใน Git แบบส่วนกลาง (Global)?",
    "options": [
      {
        "id": "a",
        "text": "git set username \"สมชาย ใจดี\"",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "git config --global user.name \"สมชาย ใจดี\"",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "git user:name = \"สมชาย ใจดี\"",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git register \"สมชาย ใจดี\"",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การตั้งค่าผู้ใช้ใน Git ใช้คำสั่ง 'git config --global user.name \"ชื่อ\"' และ 'git config --global user.email \"อีเมล\"'",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q9",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "เพราะเหตุใดจึงจำเป็นต้องตั้งค่า user.name และ user.email ก่อนเริ่มใช้งาน Git?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อให้ Git แนบตัวตนของผู้แก้ไขไปกับทุกๆ Commit อย่างชัดเจน สามารถระบุได้ว่าใครเป็นคนทำอะไร",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพื่อให้ระบบหักเงินค่าบริการรายเดือนผ่านทางอีเมล",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพื่อใช้สมัครบัญชีเฟซบุ๊กอัตโนมัติ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อล็อกไม่ให้เครื่องคอมพิวเตอร์เครื่องอื่นเปิดไฟล์ได้",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ข้อมูล user.name และ user.email จะถูกฝังลงในบันทึกประวัติ (Commit Metadata) เพื่อใช้ตรวจสอบและยืนยันตัวตนของผู้เขียนโค้ด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w2-q10",
    "courseId": "21901-2012",
    "week": 2,
    "type": "choice",
    "question": "คำสั่งใดใช้สำหรับตรวจสอบรายการคอนฟิกและค่าการตั้งค่าทั้งหมดของ Git ในเครื่องปัจจุบัน?",
    "options": [
      {
        "id": "a",
        "text": "git show all",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "git config --list",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "git verify config",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git find settings",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git config --list' จะแสดงรายการค่าตัวแปรทั้งหมดที่กำหนดไว้ เช่น user.name, user.email, core.editor ฯลฯ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q1",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "โครงสร้างสถาปัตยกรรม 3 พื้นที่หลัก (Three Trees) ของ Git ในเครื่องคอมพิวเตอร์ประกอบด้วยส่วนใดบ้างตามลำดับการทำงาน?",
    "options": [
      {
        "id": "a",
        "text": "Working Directory, Remote Repository, และ Staging Area",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Staging Area, Working Directory, และ Git Archive",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Working Directory, Staging Area, และ Local Repository",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "Working Directory, Commit Cache, และ Cloud Repository",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "สถาปัตยกรรม 3 พื้นที่หลักของ Git ทำงานเรียงลำดับจาก Working Directory (พื้นที่แก้ไขไฟล์จริง) -> Staging Area (พื้นที่เตรียมพร้อมและคัดเลือกไฟล์) -> Local Repository (พื้นที่จัดเก็บ Snapshot ถาวรในโฟลเดอร์ .git)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q2",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "คำสั่งใดใช้สำหรับเริ่มต้นสร้าง Git Repository ขึ้นใหม่ในโฟลเดอร์โปรเจกต์ปัจจุบัน?",
    "options": [
      {
        "id": "a",
        "text": "git init",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "git start",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git setup",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git create",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git init' (ย่อมาจาก initialize) ใช้สร้างโฟลเดอร์ซ่อนชื่อ .git ขึ้นมาเพื่อเริ่มติดตามการเปลี่ยนแปลงไฟล์ในโฟลเดอร์นั้น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q3",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการกำหนดชื่อและอีเมลของผู้พัฒนาสำหรับใช้บันทึกประวัติการ Commit ในเครื่องเป็นค่าเริ่มต้นทุกโปรเจกต์ ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "git config --system author.name \"ชื่อ\" และ author.email \"อีเมล\"",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "git set-identity --default user.name \"ชื่อ\" และ user.email \"อีเมล\"",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git profile --all user.name \"ชื่อ\" และ user.email \"อีเมล\"",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git config --global user.name \"ชื่อ\" และ git config --global user.email \"อีเมล\"",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "Git บันทึกประวัติว่าใครแก้ไขด้วย user.name และ user.email ผ่านคำสั่ง git config --global เพื่อใช้เป็นค่าตั้งต้นร่วมกันทุกโปรเจกต์ในเครื่อง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q4",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "โฟลเดอร์ใดทำหน้าที่เป็นพื้นที่จัดเก็บประวัติ Commit, ข้อมูล Object, และการตั้งค่าทั้งหมดของ Local Repository?",
    "options": [
      {
        "id": "a",
        "text": "โฟลเดอร์ .github/",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "โฟลเดอร์ .git/",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "โฟลเดอร์ .stage/",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "โฟลเดอร์ .repo/",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "โฟลเดอร์ .git/ เป็นโฟลเดอร์ซ่อนที่เก็บฐานข้อมูล Snapshot, HEAD, Object และ Config ทั้งหมดของ Git หากลบโฟลเดอร์นี้ประวัติ Git จะหายทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q5",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "เมื่อผู้พัฒนาสร้างไฟล์โค้ดใหม่ขึ้นมาในโฟลเดอร์โปรเจกต์ แต่ยังไม่ได้สั่งคำสั่ง Git ใดๆ ไฟล์นั้นจะอยู่ในสถานะใด?",
    "options": [
      {
        "id": "a",
        "text": "Untracked (ยังไม่ได้รับการติดตาม)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Modified (ไฟล์ได้รับการแก้ไข)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Unstaged (ไฟล์รอการเตรียมพร้อม)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Ignored (ไฟล์ถูกละเว้นถาวร)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ไฟล์ที่สร้างขึ้นใหม่เอี่ยม Git จะมองเห็นเป็น Untracked หมายถึง Git รับรู้ว่ามีไฟล์นี้อยู่แต่ยังไม่ได้เริ่มติดตามบันทึกเวอร์ชัน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q6",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการนำไฟล์ที่แก้ไขแล้วเข้าสู่ Staging Area เพื่อคัดเลือกเตรียมพร้อมสำหรับการบันทึก Snapshot ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "git commit <ชื่อไฟล์>",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "git stage <ชื่อไฟล์>",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git track <ชื่อไฟล์>",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git add <ชื่อไฟล์>",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git add' ทำหน้าที่หยิบไฟล์จาก Working Directory เข้าไปวางไว้ใน Staging Area (Index) เพื่อเตรียม Commit",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q7",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "ข้อใดอธิบายวัตถุประสงค์หลักของการกำหนดไฟล์ '.gitignore' ในโปรเจกต์ได้อย่างถูกต้องที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "ป้องกันไม่ให้สมาชิกคนอื่นในทีมดึงไฟล์โค้ดไปแก้ไขโดยไม่ได้รับอนุญาต",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ระบุรายชื่อไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้ระบบ Git ติดตามและนำขึ้นระบบ",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ซ่อนไฟล์สำคัญไม่ให้แสดงบนโปรแกรมแก้ไขโค้ดเพื่อความปลอดภัยของข้อมูล",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ลบไฟล์ขยะและไฟล์ชั่วคราวออกจากระบบฮาร์ดดิสก์โดยอัตโนมัติเมื่อสั่งรันโปรแกรม",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": ".gitignore ทำหน้าที่บอกให้ Git เพิกเฉยต่อไฟล์ที่ไม่ควรขึ้นระบบ เช่น ไฟล์ชั่วคราว, ค่า Config ส่วนตัว (.env), และโฟลเดอร์ดาวน์โหลด (node_modules)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q8",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "ตามแนวคิด Atomic Commit และมาตรฐาน Conventional Commits ข้อใดคือแนวปฏิบัติที่ดีในการบันทึก Commit?",
    "options": [
      {
        "id": "a",
        "text": "รวบรวมงานทั้งหมดที่ทำตลอดสัปดาห์ไว้ใน Commit เดียวเพื่อลดประวัติที่ซ้ำซ้อน",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "บันทึก Commit ทุกครั้งที่กดปุ่ม Save ใน Text Editor เพื่อบันทึกงานให้ละเอียดที่สุด",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "แยกการบันทึกแต่ละ Commit ตามงานย่อยที่สมบูรณ์ในตัวเองพร้อมข้อความที่ชัดเจน",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "บันทึกเฉพาะไฟล์โค้ดส่วนของโปรแกรมหลักเท่านั้น ส่วนไฟล์เอกสารไม่ต้องทำ Commit",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หลักการ Atomic Commit และ Conventional Commits (เช่น feat:, fix:, docs:) ช่วยให้ย้อนประวัติ ตรวจสอบสาเหตุบั๊ก และทำงานร่วมกันในทีมได้อย่างมีประสิทธิภาพ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q9",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "คำสั่งใดใช้สำหรับตรวจสอบสถานะปัจจุบันของไฟล์ในโปรเจกต์ ทั้งไฟล์ที่แก้ไขแล้ว ไฟล์ที่อยู่ใน Staging และไฟล์ที่ยังไม่ถูกติดตาม?",
    "options": [
      {
        "id": "a",
        "text": "git log",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "git diff",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git show",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git status",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git status' เป็นคำสั่งพื้นฐานที่ใช้บ่อยที่สุดเพื่อตรวจดูสถานะของไฟล์ในแต่ละพื้นที่ก่อนทำคำสั่งถัดไป",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2012-w3-q10",
    "courseId": "21901-2012",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการคัดลอก Remote Repository จากเซิร์ฟเวอร์ (เช่น GitHub หรือ GitLab) ลงมาสร้างเป็น Local Repository ในเครื่องคอมพิวเตอร์ ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "git clone <url>",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "git pull <url>",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "git fetch <url>",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "git checkout <url>",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง 'git clone <url>' ใช้คัดลอก Repository ทางไกล (Remote Repository) พร้อมประวัติการ Commit ทั้งหมดลงมาเป็น Local Repository ในเครื่องของเราทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q1",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดคือเป้าหมายสูงสุดของ 'การวิเคราะห์และนำเสนอข้อมูล' (Data Analysis & Visualization)?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อสร้างกราฟิกสีสันสดใสตกแต่งรายงานเท่านั้น",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพื่อเปลี่ยนข้อมูลดิบให้เป็นข้อค้นพบ (Insights) สนับสนุนการตัดสินใจทางธุรกิจ (Data-Driven Decision Making)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพื่อเก็บสะสมข้อมูลให้มีขนาดใหญ่ที่สุดเท่าที่จะทำได้",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อลดจำนวนพนักงานและปิดกิจการแผนกต่างๆ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หัวใจของการวิเคราะห์ข้อมูลไม่ใช่เพียงแค่การวาดชาร์ตสวยงาม แต่คือการกลั่นกรอง Insight เพื่อนำไปสู่การตัดสินใจ (Data-Driven Decision Making) ที่ลดความเสี่ยงทางธุรกิจ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q2",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดคือความแตกต่างสำคัญระหว่างการตัดสินใจด้วยความรู้สึก (Intuition) กับการตัดสินใจด้วยข้อมูล (Data-Driven)?",
    "options": [
      {
        "id": "a",
        "text": "การตัดสินใจด้วยข้อมูลใช้หลักฐานเชิงประจักษ์ที่ตรวจสอบได้และช่วยลดอคติ (Bias) ส่วนการใช้ความรู้สึกตรวจสอบความถูกต้องได้ยาก",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การใช้ความรู้สึกให้ผลลัพธ์แม่นยำกว่าการใช้ข้อมูลเสมอ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การตัดสินใจด้วยข้อมูลไม่ต้องใช้เวลาหรือเครื่องมือใดๆ ในการเก็บรวบรวม",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การตัดสินใจด้วยข้อมูลใช้ได้กับองค์กรขนาดใหญ่เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data-Driven ตัดสินใจจากหลักฐานเชิงประจักษ์ (Evidence) จึงลดอคติ ตรวจสอบที่มาที่ไปได้ และวัดผลปรับปรุงได้อย่างต่อเนื่อง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q3",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ตามพีระมิด DIKW เมื่อเรานำข้อมูลยอดขายขนมปัง 'วันจันทร์ขายได้ 25 จาก 50 ชิ้น' มาวิเคราะห์จนพบว่า 'วันธรรมดาขายได้เพียงครึ่งเดียวแต่วันหยุดขายหมดทุกสัปดาห์' ขั้นตอนนี้จัดอยู่ในระดับใด?",
    "options": [
      {
        "id": "a",
        "text": "Knowledge (ความรู้ / ความเข้าใจในแบบแผนและความสัมพันธ์ของข้อมูล)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Data (ข้อมูลดิบที่ยังไม่ได้ประมวลผล)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Hardware (อุปกรณ์คอมพิวเตอร์)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Machine Code (รหัสเครื่อง)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Knowledge คือระดับที่เห็นรูปแบบ (Pattern) หรือความสัมพันธ์เชิงสาเหตุ ตอบได้ว่า 'ทำไม' หรือเกิดแนวโน้มอย่างไร จากสารสนเทศที่จัดระเบียบแล้ว",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q4",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "เหตุใดองค์กรจึงนิยมนำเสนอข้อมูลด้วย Data Visualization มากกว่าตารางตัวเลขดิบ?",
    "options": [
      {
        "id": "a",
        "text": "เพราะสมองมนุษย์ประมวลผลการรับรู้ทางสายตา (Visual Perception) ได้เร็วกว่าการอ่านตัวเลขหลายหมื่นเท่า",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพราะกราฟมีตัวหนังสือน้อยกว่าตารางเสมอ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะคอมพิวเตอร์ไม่อนุญาตให้อ่านตัวเลขดิบ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะไม่ต้องใช้ข้อมูลจริงในการสร้างกราฟ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "สมองมนุษย์จับคู่รูปแบบ แนวโน้ม (Trends) และจุดผิดปกติ (Outliers) จากภาพและกราฟได้รวดเร็วกว่าการกวาดสายตาอ่านตัวเลขในตารางหลายสิบบรรทัด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q5",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ในวงจรชีวิตของการวิเคราะห์ข้อมูล (Data Analytics Lifecycle) ขั้นตอนแรกสุดที่นักวิเคราะห์ข้อมูลควรทำคืออะไร?",
    "options": [
      {
        "id": "a",
        "text": "ลงมือสร้าง Dashboard ทันทีโดยไม่ต้องคิด",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ทำความเข้าใจปัญหาและตั้งคำถามทางธุรกิจที่ชัดเจน (Ask / Business Understanding)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ลบข้อมูลที่คิดว่าไม่สำคัญทิ้งทั้งหมด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ซื้อโปรแกรมซอฟต์แวร์ราคาแพงที่สุดมาติดตั้ง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ขั้นตอนแรกคือการทำความเข้าใจบริบทและตั้งคำถามทางธุรกิจ (Ask) เพื่อให้ทราบว่าเรากำลังจะวิเคราะห์เพื่อตอบโจทย์อะไรและช่วยเหลือใคร",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q6",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ข้อมูลประเภท 'ข้อความรีวิวสินค้าบน Social Media และคลิปวิดีโอสัมภาษณ์ลูกค้า' จัดอยู่ในกลุ่มข้อมูลประเภทใด?",
    "options": [
      {
        "id": "a",
        "text": "Structured Data (ข้อมูลที่มีโครงสร้างตารางชัดเจน)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Unstructured Data (ข้อมูลที่ไม่มีโครงสร้างแน่นอน)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "Relational Database Data",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Machine Code Binary Data",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ข้อความรีวิว ภาพถ่าย เสียง และคลิปวิดีโอ เป็นข้อมูลที่ไม่ได้จัดเก็บในรูปแบบแถวและคอลัมน์เหมือนตารางทั่วไป จึงจัดเป็น Unstructured Data",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q7",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "การวิเคราะห์ระดับใดที่มุ่งตอบคำถามว่า 'ทำไมสิ่งนี้จึงเกิดขึ้น' (Why did it happen?) โดยการเปรียบเทียบข้อมูลและหาสาเหตุที่แท้จริง?",
    "options": [
      {
        "id": "a",
        "text": "Descriptive Analytics (เชิงพรรณนา)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Diagnostic Analytics (เชิงวินิจฉัย)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "Predictive Analytics (เชิงพยากรณ์)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Prescriptive Analytics (เชิงแนะนำ)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Diagnostic Analytics มุ่งเน้นการเจาะลึกเพื่อหาสาเหตุของปัญหา (Root Cause Analysis) เช่น ตรวจสอบว่าทำไมยอดขายจึงลดลงในกลุ่มสินค้าบางประเภท",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q8",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ขั้นตอน 'Data Cleaning' (การทำความสะอาดข้อมูล) มีความสำคัญสูงสุดต่อการวิเคราะห์อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "จัดการค่าสูญหาย (Missing Values), ข้อมูลซ้ำซ้อน และข้อผิดพลาด เพื่อให้ผลลัพธ์การวิเคราะห์มีความน่าเชื่อถือ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ลบคอลัมน์ทั้งหมดให้เหลือเพียงฟิลด์เดียว",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "สแกนหาไวรัสในไฟล์ข้อมูลเท่านั้น",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เปลี่ยนภาษาในชุดข้อมูลให้เป็นภาษาละติน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Cleaning ช่วยขจัดข้อมูลผิดพลาด ข้อมูลซ้ำ และช่องว่าง เพื่อป้องกันปัญหาขยะเข้าขยะออก (Garbage In, Garbage Out)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q9",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "กฎหมาย PDPA (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล) กำหนดให้นักวิเคราะห์ข้อมูลต้องปฏิบัติตามอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ห้ามใช้คอมพิวเตอร์หลังเวลา 18.00 น.",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ต้องได้รับความยินยอมและปกป้องข้อมูลส่วนบุคคล (PII) ของลูกค้า เช่น ปกปิดข้อมูลระบุตัวตน (Anonymization)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "บังคับให้นักวิเคราะห์ข้อมูลต้องเปิดเผยเงินเดือนของตนเองต่อสาธารณะ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ห้ามวิเคราะห์ข้อมูลที่มีมูลค่ามากกว่า 1,000 บาท",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "PDPA กำหนดให้การเก็บและวิเคราะห์ข้อมูลส่วนบุคคล (PII) ต้องได้รับความยินยอมและมีมาตรการรักษาความปลอดภัย เช่น การทำ Masking หรือ Anonymization",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w1-q10",
    "courseId": "31901-2012",
    "week": 1,
    "type": "choice",
    "question": "ทักษะด้านใดของ Data Analyst ที่มีความสำคัญอย่างยิ่งในการเปลี่ยนข้อค้นพบ (Insights) ให้กลายเป็นการตัดสินใจและการลงมือทำของผู้บริหาร?",
    "options": [
      {
        "id": "a",
        "text": "การสื่อสารและเล่าเรื่องด้วยข้อมูล (Data Storytelling & Communication)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การเขียนภาษา Assembly ขั้นสูง",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การซ่อมแซมและประกอบฮาร์ดแวร์คอมพิวเตอร์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การออกแบบวงจรอิเล็กทรอนิกส์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Analyst ไม่เพียงแต่ต้องวิเคราะห์เป็น แต่ต้องมีทักษะ Data Storytelling เพื่อนำเสนอ Insight ที่เข้าใจง่าย ตรงประเด็น และสามารถโน้มน้าวผู้บริหารให้นำไปสู่การตัดสินใจเชิงกลยุทธ์ได้จริง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q1",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "เหตุใดในกระบวนการ Data Analytics จึงต้องเริ่มต้นด้วย 'การสอบถามข้อมูลและความต้องการ (Data Inquiry)' ก่อนการลงมือสร้างตารางหรือกราฟ?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อลดงบประมาณในการซื้อคอมพิวเตอร์เครื่องใหม่",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพื่อให้เข้าใจวัตถุประสงค์ทางธุรกิจ กลุ่มเป้าหมาย และระบุได้ว่าจำเป็นต้องใช้ข้อมูลตัวแปรใดบ้างในการตอบคำถาม",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพื่อให้เสียเวลาในการทำงานนานขึ้นตามเกณฑ์ชั่วโมงสอน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อป้องกันไม่ให้ผู้อื่นเข้าถึงโปรแกรม Power BI ได้",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การสอบถามข้อมูล (Data Inquiry) ช่วยให้นักวิเคราะห์เข้าใจเป้าหมายที่แท้จริงของผู้มีส่วนได้ส่วนเสีย (Stakeholders) ทำให้ทราบว่าต้องเก็บข้อมูลอะไรบ้าง และไม่เก็บข้อมูลที่ไม่จำเป็น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q2",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "ตามกรอบแนวคิด 5W1H ในการสอบถามข้อมูล ตัวอักษร 'Why' มุ่งเน้นไปที่การค้นหาคำตอบในเรื่องใด?",
    "options": [
      {
        "id": "a",
        "text": "สถานที่ที่จัดเก็บไฟล์ฐานข้อมูล",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เหตุผล วัตถุประสงค์ และเป้าหมายที่ต้องนำข้อมูลนี้ไปช่วยตัดสินใจแก้ไขปัญหา",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "รายชื่อโปรแกรมเมอร์ที่เป็นผู้เขียนโค้ด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "จำนวนหน่วยความจำ RAM ของเครื่องเซิร์ฟเวอร์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "'Why' คือการค้นหา 'ทำไมต้องวิเคราะห์ข้อมูลนี้ และผลลัพธ์จะนำไปแก้ปัญหาหรือพัฒนาเรื่องใด' ซึ่งเป็นหัวใจสำคัญสูงสุดของการทำ Analytics",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q3",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "หากต้องการทราบความพึงพอใจของลูกค้าจำนวน 5,000 คนทั่วประเทศต่อรสชาติอาหาร รูปแบบการสอบถามข้อมูลใดมีความเหมาะสมและคุ้มค่าที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "การเดินทางไปสัมภาษณ์ตัวต่อตัวให้ครบทั้ง 5,000 คน",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "แบบสอบถามออนไลน์ (Online Questionnaire / Google Forms) โดยส่งผ่านทาง SMS หรือ QR Code",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "การเปิดกล้องวงจรปิดสังเกตการณ์ลูกค้าทั้งวัน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การเดาและสุ่มตัวเลขยอดขายขึ้นมาเอง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "แบบสอบถามออนไลน์เหมาะสำหรับการเข้าถึงกลุ่มตัวอย่างขนาดใหญ่ (Large Scale) รวดเร็ว ประหยัดค่าใช้จ่าย และผู้ตอบสามารถตอบผ่านสมาร์ตโฟนได้สะดวก",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q4",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "คำถามแบบสอบถามลักษณะใดต่อไปนี้ จัดเป็น 'คำถามชี้นำ (Leading Question)' ซึ่งเป็นข้อผิดพลาดร้ายแรงในการเก็บข้อมูล?",
    "options": [
      {
        "id": "a",
        "text": "ท่านคิดว่าเครื่องดื่มสูตรใหม่ของเราอร่อยและคุ้มค่ามากใช่หรือไม่?",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ท่านมีความพึงพอใจต่อรสชาติเครื่องดื่มอยู่ในระดับใด (1 ถึง 5)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ใน 1 สัปดาห์ ท่านซื้อเครื่องดื่มประมาณกี่แก้ว",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ท่านชำระเงินด้วยช่องทางใดบ่อยที่สุด",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำถามที่ใส่ข้อความโน้มน้าว เช่น 'อร่อยและคุ้มค่ามากใช่หรือไม่' จะชี้นำให้ผู้ตอบเลือกตอบทางบวก ทำให้ข้อมูลที่ได้มีอคติ (Bias) และบิดเบือนจากความจริง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q5",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "การสอบถามระดับความพึงพอใจแบบ Likert Scale 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด) จัดเป็นข้อมูลประเภทใด และมีประโยชน์ต่องานวิเคราะห์อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ข้อมูลข้อความที่ไม่สามารถนำมาทำอะไรได้เลย",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ข้อมูลเชิงคุณภาพแบบเรียงลำดับ (Ordinal) ที่แปลงเป็นตัวเลขเพื่อคำนวณหาค่าเฉลี่ยและเปรียบเทียบความพึงพอใจได้",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ข้อมูลพิกัดละติจูด-ลองจิจูด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ข้อมูลไบนารีระดับล่างของฮาร์ดแวร์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Likert Scale เป็นการวัดระดับความรู้สึก (Ordinal) ที่นำมารวมเป็นสเกลคะแนน สามารถหาค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (SD) เพื่อเปรียบเทียบความพึงพอใจของแต่ละด้านได้",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q6",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดคือตัวอย่างของการรวบรวมข้อมูลแบบ 'ปฐมภูมิ (Primary Data Collection)'?",
    "options": [
      {
        "id": "a",
        "text": "การดาวน์โหลดรายงานสรุปภาวะเศรษฐกิจจากธนาคารแห่งประเทศไทย",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "การแจกแบบสอบถามเพื่อถามพฤติกรรมการเดินทางของนักศึกษาในวิทยาลัยด้วยตนเอง",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "การอ่านบทความวิจัยที่ตีพิมพ์เมื่อ 3 ปีก่อน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การคัดลอกตารางจากวิกิพีเดีย",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ข้อมูลปฐมภูมิ (Primary Data) คือข้อมูลที่ผู้ศึกษาเป็นผู้ลงมือเก็บรวบรวมขึ้นมาใหม่ด้วยตนเองโดยตรงจากกลุ่มเป้าหมายเพื่อตอบวัตถุประสงค์เฉพาะของงานวิจัยนั้น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q7",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "ในการสร้าง Google Forms การกำหนด 'Data Validation' เช่น บังคับให้กรอก 'ตัวเลขจำนวนเต็มบวก 1-100' ในช่องอายุ มีประโยชน์หลักอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ทำให้แบบฟอร์มเปลี่ยนสีสันได้ตามใจชอบ",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ป้องกันข้อมูลผิดรูปแบบตั้งแต่ต้นทาง ลดภาระในการทำ Data Cleaning และป้องกันข้อมูลขยะ (Garbage In)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ทำให้ระบบส่งอีเมลแจ้งเตือนทุกครั้งที่มีคนกดดูแบบฟอร์ม",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพิ่มจำนวนผู้ตอบแบบสอบถามขึ้นเป็นสองเท่าโดยอัตโนมัติ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Validation ช่วยตรวจสอบความถูกต้อง (Accuracy & Consistency) ตั้งแต่ตอนที่ผู้ใช้พิมพ์ข้อมูล ป้องกันการกรอกข้อความในช่องตัวเลข หรือกรอกตัวเลขติดลบ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q8",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "ข้อมูลชนิดใดที่ระบบคอมพิวเตอร์บันทึกได้โดยอัตโนมัติ โดยที่ผู้ใช้งานไม่ต้องเป็นผู้กรอกแบบสอบถามเอง?",
    "options": [
      {
        "id": "a",
        "text": "Web Server Access Log บันทึกเวลาที่เข้าชมเว็บและ IP Address",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ความฝันในอนาคตของนักศึกษา",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เหตุผลส่วนตัวที่นักศึกษาไม่ชอบวิชาคณิตศาสตร์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ความคิดเห็นเกี่ยวกับภาพยนตร์ที่ยังไม่ได้ฉาย",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Server Log, เซนเซอร์ IoT และฐานข้อมูล POS เป็นตัวอย่างของระบบบันทึกอัตโนมัติ (Automated / Transactional Data) ที่เก็บพฤติกรรมจริงโดยไม่ต้องรบกวนให้ผู้ใช้ตอบ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q9",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) เมื่อสร้างแบบฟอร์มเก็บรวบรวมข้อมูลลูกค้า สิ่งใดที่ต้องมีเสมอ?",
    "options": [
      {
        "id": "a",
        "text": "ของรางวัลแจกฟรีมูลค่ามากกว่า 1,000 บาท",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ข้อความแจ้งวัตถุประสงค์การเก็บข้อมูลและช่องให้ผู้ตอบยินยอม (Consent) อย่างชัดเจน",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "การบังคับให้ผู้ตอบต้องถ่ายรูปบัตรประชาชนส่งมาด้วยเสมอ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การระบุว่าจะนำข้อมูลไปขายต่อให้บริษัทประกันภัยทุกกรณี",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หลักการสำคัญของ PDPA คือต้องแจ้งวัตถุประสงค์ (Purpose Limitation) ว่าเก็บข้อมูลไปทำอะไร และได้รับความยินยอม (Consent) จากเจ้าของข้อมูลก่อนเสมอ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w2-q10",
    "courseId": "31901-2012",
    "week": 2,
    "type": "choice",
    "question": "เมื่อเก็บข้อมูลจากแบบสอบถามเสร็จสิ้น เอกสารใดที่ Data Analyst ควรจัดทำขึ้นเพื่ออธิบายความหมายและประเภทของแต่ละคอลัมน์?",
    "options": [
      {
        "id": "a",
        "text": "พจนานุกรมข้อมูล (Data Dictionary / Codebook)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ใบแจ้งหนี้ (Invoice)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ใบรับประกันสินค้า",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "แผนผังที่นั่งห้องเรียน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Dictionary หรือ Codebook คือเอกสารกำกับชุดข้อมูลที่ระบุชื่อคอลัมน์, คำอธิบาย, ชนิดข้อมูล (Data Type), ค่าที่เป็นไปได้ และหน่วยวัด เพื่อให้ทุกคนในทีมเข้าใจข้อมูลตรงกัน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q1",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "ตามหลักการจากบทความ DataTH กระบวนการ 'Data Wrangling' (หรือ Data Munging) หมายถึงข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "การลบฐานข้อมูลทั้งหมดทิ้งเพื่อประหยัดพื้นที่เซิร์ฟเวอร์",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "กระบวนการแปรสภาพ จัดโครงสร้าง และทำความสะอาดข้อมูลดิบ (Raw/Dirty Data) ให้อยู่ในรูปแบบที่พร้อมนำไปวิเคราะห์หรือสร้างโมเดล",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "การออกแบบโลโก้บริษัทด้วยโปรแกรมกราฟิก",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การติดตั้งสายแลนและซ่อมบำรุงฮาร์ดแวร์ในห้องเซิร์ฟเวอร์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Data Wrangling คือการนำข้อมูลดิบที่กระจัดกระจาย ไม่เป็นระเบียบ หรือมีข้อผิดพลาด มาจัดโครงสร้างและทำความสะอาด (Data Cleaning) ให้พร้อมใช้งานจริง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q2",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "เหตุใดขั้นตอน Data Wrangling และ Data Cleansing จึงมักใช้เวลาคิดเป็น 60% - 80% ของเวลาทำงานทั้งหมดของ Data Analyst?",
    "options": [
      {
        "id": "a",
        "text": "เพราะข้อมูลดิบจากโลกจริงมักมีช่องว่าง พิมพ์ผิด รูปแบบไม่ตรงกัน และหากไม่คลีนก่อน ผลการวิเคราะห์จะผิดเพี้ยน (Garbage In, Garbage Out)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพราะคอมพิวเตอร์ไม่สามารถบวกเลขได้เอง",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะกฎหมายบังคับให้ต้องพิมพ์ข้อมูลใหม่ด้วยมือทุกบรรทัด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพราะโปรแกรม Google Sheets อนุญาตให้เปิดไฟล์ได้วันละ 10 นาที",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตามกฎ Garbage In, Garbage Out (GIGO) หากนำข้อมูลขยะเข้าสู่วิเคราะห์ ต่อให้ใช้กราฟหรือ AI ดีเพียงใด ผลลัพธ์ที่ได้ก็จะผิดพลาดและนำไปสู่การตัดสินใจทางธุรกิจที่ผิด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q3",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "หากพบว่าในคอลัมน์ 'เวลารอคอยรับบริการ (ชั่วโมง)' มีผู้ตอบกรอกค่า 999 ชั่วโมง ปะปนอยู่กับข้อมูลส่วนใหญ่ที่อยู่ระหว่าง 0.5 - 3.0 ชั่วโมง ปัญหานี้ส่งผลเสียต่อมิติคุณภาพข้อมูลใด และเรียกว่าอะไร?",
    "options": [
      {
        "id": "a",
        "text": "กระทบต่อ Accuracy (ความถูกต้อง) และเรียกว่าค่าผิดปกติสุดโต่ง (Outlier)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "กระทบต่อ Timeliness และเรียกว่า Primary Key",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "กระทบต่อ Completeness และเรียกว่า Null Value",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่ส่งผลเสียใดๆ ต่อค่าเฉลี่ย (AVERAGE)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ค่า 999 ชั่วโมงเป็นค่าที่กระโดดออกจากกลุ่มอย่างผิดปกติ (Outlier) จากการพิมพ์ผิด ซึ่งกระทบต่อมิติความถูกต้อง (Accuracy) และดึงค่าเฉลี่ย (Mean) ให้สูงเกินจริง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q4",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "ในชุดข้อมูลที่พบว่ามีค่าสุดโต่ง (Outliers) ปะปนอยู่ หากต้องการเติมค่าว่าง (Missing Values Imputation) ในคอลัมน์ตัวเลข ควรเลือกใช้ค่าทางสถิติใดจึงจะไม่ถูกดึงให้เพี้ยน?",
    "options": [
      {
        "id": "a",
        "text": "ค่าสูงสุด (MAX)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ค่ามัธยฐาน (Median - ค่ากลางเมื่อเรียงลำดับข้อมูล)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ผลรวมทั้งหมด (SUM)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ค่าติดลบเสมอ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "มัธยฐาน (Median) คือค่าที่อยู่ตรงกลางเมื่อเรียงข้อมูลจากน้อยไปมาก จึงไม่ถูกค่าสุดโต่ง (Outliers) ดึงให้เบ้เหมือนค่าเฉลี่ยเลขคณิต (Mean)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q5",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "หากคอลัมน์ 'ชื่อแผนก' เป็นข้อมูลเชิงคุณภาพ (Categorical Data) และมีข้อมูลว่างหายไปบางแถว วิธี Imputation (การแทนค่าว่าง) ที่เหมาะสมคือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "นำชื่อแผนกมาคูณกันด้วยสูตรคณิตศาสตร์",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "แทนที่ด้วยค่าฐานนิยม (Mode - หมวดหมู่ที่พบมากที่สุด) หรือกำหนดหมวดหมู่กลาง เช่น 'ไม่ระบุ'",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ใส่ตัวเลข 9999 ลงไปแทนชื่อแผนก",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ลบคอลัมน์อื่นๆ ทิ้งทั้งหมด",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "สำหรับข้อมูลข้อความหรือหมวดหมู่ เราไม่สามารถคำนวณค่าเฉลี่ยได้ จึงนิยมใช้ฐานนิยม (Mode) หรือใส่ค่าคงที่ที่สื่อความหมายชัดเจนว่า 'ไม่ระบุ (Unknown)'",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q6",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "เมื่อใดที่เราควรเลือกวิธี 'ลบคอลัมน์ทิ้งทั้งคอลัมน์ (Drop Column)' ในการจัดการกับ Missing Values?",
    "options": [
      {
        "id": "a",
        "text": "เมื่อมีข้อมูลว่างหายไปเพียง 1 ช่องจาก 500 แถว",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เมื่อคอลัมน์นั้นมีข้อมูลว่างหายไปเป็นสัดส่วนสูงมาก (เช่น มากกว่า 60% - 80%) และไม่ใช่ตัวแปรหลักในการวิเคราะห์",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เมื่อคอลัมน์นั้นมีข้อมูลครบถ้วน 100%",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เมื่อต้องการเปลี่ยนสีตารางให้สวยงาม",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หากคอลัมน์ใดมีข้อมูลแหว่งหายเกินกว่า 60-80% การพยายามเดาหรือเติมค่า (Impute) จะสร้างข้อมูลเทียมมากเกินไป จึงควรพิจารณาตัดคอลัมน์นั้นออกหากไม่ใช่ตัวแปรสำคัญ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q7",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "ในคอลัมน์ Department พบข้อความว่า '  IT Support ' (มีเคาะวรรคข้างหน้า 2 ครั้ง และข้างหลัง 1 ครั้ง) จนทำให้โปรแกรมมองว่าเป็นคนละแผนกกับ 'IT Support' ควรใช้สูตรใดใน Google Sheets แก้ไข?",
    "options": [
      {
        "id": "a",
        "text": "=SUM()",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "=TRIM()",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "=RAND()",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "=NOW()",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ฟังก์ชัน =TRIM(text) จะช่วยตัดช่องว่าง (Leading & Trailing Spaces) ที่เกินมาด้านหน้าและด้านหลังข้อความออกทั้งหมด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q8",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "วิธีการทางสถิติใดที่นิยมใช้กำหนดขอบเขตบนและขอบเขตล่าง เพื่อคัดกรองค่าผิดปกติ (Outliers) โดยใช้ค่าควอไทล์ที่ 1 (Q1) และควอไทล์ที่ 3 (Q3)?",
    "options": [
      {
        "id": "a",
        "text": "วิธี IQR (Interquartile Range: ขอบเขต Q1 - 1.5*IQR และ Q3 + 1.5*IQR)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การเรียงตัวอักษร ก-ฮ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การนับจำนวนตัวอักษรด้วย =LEN()",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การเปลี่ยนสีพื้นหลังตาราง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เกณฑ์ 1.5 * IQR (โดย IQR = Q3 - Q1) เป็นเกณฑ์มาตรฐานสากลที่ใช้ในแผนภาพกล่อง (Box Plot) เพื่อระบุว่าค่าใดที่ต่ำกว่า Q1 - 1.5(IQR) หรือสูงกว่า Q3 + 1.5(IQR) จัดเป็น Outlier",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q9",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "ปัญหาที่คอลัมน์ Submit_Date มีทั้งรูปแบบ '2026-11-05' และ '05/11/2026' ปะปนกัน จัดเป็นความบกพร่องของมิติคุณภาพข้อมูลข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "Consistency (ความสอดคล้องของรูปแบบข้อมูล)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Uniqueness (ความเป็นเอกลักษณ์)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Completeness (ความครบถ้วน)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "Hardware Failure (อุปกรณ์พัง)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Consistency คือความสอดคล้องกันของรูปแบบและมาตรฐานการบันทึกข้อมูล การใช้วันที่คนละรูปแบบจะทำให้เรียงลำดับหรือกรองข้อมูลตามเดือนผิดพลาด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "31901-2012-w3-q10",
    "courseId": "31901-2012",
    "week": 3,
    "type": "choice",
    "question": "ในการทำเวิร์กช็อปทำความสะอาดชุดข้อมูลบน Google Sheets ขั้นตอนใดถือเป็นหลักปฏิบัติที่ปลอดภัยที่สุดก่อนเริ่มลบหรือแก้ไขข้อมูล?",
    "options": [
      {
        "id": "a",
        "text": "สำรองข้อมูลดิบไว้ในแท็บ 'Raw_Data' เสมอ แล้วคัดลอกออกมาทำในแท็บ 'Cleaned_Data' เพื่อป้องกันข้อมูลต้นฉบับสูญหาย",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ลบข้อมูลต้นฉบับทิ้งทันทีโดยไม่ต้องตรวจสอบ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ผสานเซลล์ (Merge Cells) ทุกคอลัมน์เข้าด้วยกัน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "สุ่มพิมพ์ตัวเลขใหม่ทับลงไปในทุกแถว",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "กฎเหล็กของ Data Analyst คือห้ามแก้ไขทับไฟล์ Raw Data ต้นฉบับโดยตรง ต้องสำรองแท็บ Raw_Data ไว้เสมอ เพื่อให้สามารถตรวจสอบย้อนกลับ (Audit Trail) ได้เมื่อเกิดข้อผิดพลาด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q1",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "บอร์ด Arduino Uno R3 ใช้ชิปไมโครคอนโทรลเลอร์ (Microcontroller) รุ่นใดเป็นสมองประมวลผลหลัก?",
    "options": [
      {
        "id": "a",
        "text": "ATmega328P",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Intel Core i5",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ESP32-S3",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "STM32F401",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "บอร์ด Arduino Uno R3 ใช้ไมโครคอนโทรลเลอร์เบอร์ ATmega328P สถาปัตยกรรม 8-bit AVR ของบริษัท Microchip (เดิม Atmel)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q2",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "พินแอนะล็อก A0 - A5 บนบอร์ด Arduino Uno R3 มีวงจร ADC ความละเอียดเท่าใด และแปลงแรงดัน 0-5V ออกมาเป็นตัวเลขช่วงใด?",
    "options": [
      {
        "id": "a",
        "text": "8 บิต (0 ถึง 255)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "10 บิต (0 ถึง 1023)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "12 บิต (0 ถึง 4095)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "16 บิต (0 ถึง 65535)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Arduino Uno R3 มีตัวแปลงสัญญาณ ADC ขนาด 10 บิต (2^10 = 1024 ค่า) จึงแปลงแรงดันไฟฟ้า 0-5 โวลต์ออกมาเป็นตัวเลข 0 ถึง 1023",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q3",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "พินดิจิทัลที่มีสัญลักษณ์ตัวหนอน (~) เช่น ขา 3, 5, 6, 9, 10, 11 มีความสามารถพิเศษใด?",
    "options": [
      {
        "id": "a",
        "text": "รองรับเฉพาะกระแสไฟสลับ 220V เท่านั้น",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ปล่อยสัญญาณ PWM (Pulse Width Modulation) จำลองแรงดันแอนะล็อก เช่น หรี่ไฟหรือคุมความเร็วมอเตอร์ได้",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ป้องกันไฟฟ้าสถิตและตัดไฟอัตโนมัติ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ใช้ต่อตรงเข้ากับสายอินเทอร์เน็ต LAN",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "พิน PWM ส่งสัญญาณคลื่นสี่เหลี่ยมความถี่สูงสลับ Duty Cycle (0-255) ด้วยคำสั่ง analogWrite() ช่วยจำลองระดับแรงดันแอนะล็อก",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q4",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดอธิบายความหมายของระบบสมองกลฝังตัว (Embedded System) ได้ถูกต้องที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "คอมพิวเตอร์ทั่วไปสำหรับพิมพ์งาน ท่องเว็บ และเล่นเกม",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ระบบคอมพิวเตอร์ขนาดเล็กที่ออกแบบมาเพื่อทำงาน \"เฉพาะทาง\" บรรจุฝังอยู่ในอุปกรณ์เครื่องใช้ต่างๆ",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เซิร์ฟเวอร์ขนาดใหญ่ในห้องศูนย์ข้อมูลคลาวด์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "โปรแกรมตัดต่อภาพยนตร์ความละเอียดสูง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Embedded System คือระบบคอมพิวเตอร์ขนาดเล็กที่มีไมโครโปรเซสเซอร์/ไมโครคอนโทรลเลอร์ ฝังตัวอยู่ในอุปกรณ์เพื่อทำงานเฉพาะด้าน เช่น ระบบแอร์ เบรก ABS ตู้เย็น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q5",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "เหตุใดการต่อหลอดไฟ LED เข้ากับพินดิจิทัลของ Arduino จึงต้องต่อตัวต้านทาน (Resistor เช่น 220 โอห์ม) อนุกรมร่วมด้วยเสมอ?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อเพิ่มความสว่างของหลอดไฟ LED ให้มากเป็นสองเท่า",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพื่อจำกัดกระแสไฟฟ้า (Current Limiting) ไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือพินบอร์ดไหม้",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "เพื่อแปลงกระแสไฟสลับให้เป็นกระแสตรง",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อเก็บประจุไฟฟ้าไว้สำรองยามไฟตก",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "LED มีความต้านทานภายในต่ำมาก หากต่อตรงกับไฟ 5V กระแสจะพุ่งสูงเกินพิกัดพิน (ปกติไม่เกิน 20-40 mA) จึงต้องมีตัวต้านทานอนุกรมไว้จำกัดกระแส",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q6",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "หากต้องการอ่านค่าความเข้มแสงจากเซนเซอร์ LDR (Photoresistor) ผ่านขา A0 ของ Arduino ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "digitalRead(A0);",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "analogRead(A0);",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "analogWrite(A0, HIGH);",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "serialRead(A0);",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การอ่านค่าแอนะล็อกที่มีการเปลี่ยนแปลงระดับแรงดันต่อเนื่อง (0-5V) จากพิน A0-A5 ต้องใช้ฟังก์ชัน analogRead()",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q7",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "ข้อใดอธิบายแนวคิดหลักของ Internet of Things (IoT) ได้ถูกต้องที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "การนำระบบสมองกลฝังตัวและเซนเซอร์มาเชื่อมต่อเข้าสู่โครงข่ายอินเทอร์เน็ต เพื่อส่งข้อมูลขึ้นคลาวด์และควบคุมสั่งการได้จากระยะไกล",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การต่อสายแลนระหว่างคอมพิวเตอร์ตั้งโต๊ะสองเครื่อง",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การดาวน์โหลดเพลงจากอินเทอร์เน็ตมาเก็บไว้ในแฟลชไดรฟ์",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การซ่อมแซมหน้าจอโทรศัพท์มือถือที่แตก",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "IoT คือการขยายขีดความสามารถของระบบสมองกลฝังตัวให้สามารถสื่อสารผ่านอินเทอร์เน็ต ทำให้ส่งข้อมูลเซนเซอร์ขึ้นคลาวด์และสั่งการจากที่ไหนก็ได้ในโลก",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q8",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "พินดิจิทัลหมายเลข 13 บนบอร์ด Arduino Uno R3 มีคุณลักษณะเฉพาะที่โดดเด่นอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "เป็นพินเดียวที่ไม่สามารถจ่ายไฟ 5V ได้",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "มีไฟ Built-in LED สีส้มต่ออยู่บนตัวบอร์ด สามารถสั่งทดสอบไฟกระพริบได้ทันทีโดยไม่ต้องต่อหลอดภายนอก",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ใช้สำหรับรีเซ็ตบอร์ดเท่านั้น ห้ามสั่งงานผ่านโปรแกรม",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "รองรับกระแสไฟฟ้าได้สูงถึง 10 แอมป์",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "พิน 13 ต่อเข้ากับ LED ดวงจิ๋ว (L) บนบอร์ด ทำให้ผู้เริ่มต้นทดลองสั่ง digitalWrite(13, HIGH) สังเกตไฟติดดับได้ทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q9",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "อุปกรณ์ข้อใดต่อไปนี้จัดอยู่ในกลุ่ม \"อุปกรณ์รับสัญญาณเข้าแบบแอนะล็อก\" (Analog Input)?",
    "options": [
      {
        "id": "a",
        "text": "สวิตช์ปุ่มกด (Pushbutton)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ตัวต้านทานปรับค่าได้ (Potentiometer / วอลลุ่ม)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "หลอดไฟ LED",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "บัซเซอร์ส่งเสียง (Buzzer)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตัวต้านทานปรับค่าได้ (Potentiometer) จ่ายแรงดันไฟฟ้าแปรผัน 0-5V ต่อเนื่องตามองศาการหมุน จัดเป็น Analog Input ส่วน Pushbutton เป็น Digital Input",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w1-q10",
    "courseId": "21901-2007",
    "week": 1,
    "type": "choice",
    "question": "ขาพิน GND (Ground) บนบอร์ด Arduino มีความสำคัญอย่างไรในวงจรอิเล็กทรอนิกส์?",
    "options": [
      {
        "id": "a",
        "text": "เป็นพินที่จ่ายไฟแรงดันสูง 220V",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เป็นจุดอ้างอิงแรงดัน 0V (ขั้วลบ) ของวงจร อุปกรณ์ทุกตัวต้องมีสายต่อร่วมกันเพื่อให้กระแสไหลครบวงจร",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ใช้รับสัญญาณวิทยุจากเสาอากาศ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ใช้ปรับสัญญาณนาฬิกาของซีพียู",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "GND (Ground) คือขั้วลบหรือจุดอ้างอิง 0V หากไม่ต่อสายกราวด์ร่วมกัน (Common Ground) กระแสจะไม่สามารถไหลครบวงจรและอุปกรณ์จะไม่ทำงาน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q1",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "จุดเด่นสำคัญที่สุดของการทดลองวงจรบน Autodesk Tinkercad Circuits คือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "ใช้งานฟรีผ่านเว็บเบราว์เซอร์ ปลอดภัย 100% ทดลองและเรียนรู้ได้โดยไม่มีอุปกรณ์จริงเสียหาย",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ต้องเชื่อมต่อกับฮาร์ดแวร์จริงผ่านพอร์ต USB เสมอจึงจะรันได้",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "รองรับเฉพาะภาษา Assembly เท่านั้น ไม่รองรับภาษา C++",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ต้องเสียค่าลิขสิทธิ์รายเดือนราคาแพง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Tinkercad Circuits เป็นเว็บแอปพลิเคชันจำลองวงจรอิเล็กทรอนิกส์ฟรีจาก Autodesk ช่วยให้ฝึกต่อวงจรและเขียนโค้ดได้ทุกที่โดยไม่ต้องกลัววงจรช็อตหรืออุปกรณ์เสียหาย",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q2",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดอธิบายการทำงานของฟังก์ชัน void setup() ใน Arduino ได้ถูกต้องที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "ทำงานวนซ้ำไปเรื่อยๆ จนกว่าจะกดปุ่ม Stop",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ทำงานเพียง \"ครั้งเดียว\" เมื่อบอร์ดเริ่มทำงานหรือถูกกดรีเซ็ต เพื่อกำหนดค่าเริ่มต้น",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ทำงานเฉพาะตอนมีสัญญาณอินพุตเข้ามาเท่านั้น",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ใช้สำหรับคำนวณสูตรคณิตศาสตร์เท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "void setup() คือฟังก์ชันที่คอมไพเลอร์จะเรียกทำงานเพียงรอบเดียวตอนเปิดเครื่อง เพื่อเตรียมความพร้อม เช่น กำหนดโหมดพินด้วย pinMode()",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q3",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ข้อใดอธิบายพฤติกรรมการทำงานของฟังก์ชัน void loop() ได้ถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "ทำงานวนซ้ำคำสั่งตั้งแต่บรรทัดแรกจนถึงบรรทัดสุดท้าย แล้ววนกลับมาเริ่มใหม่ไม่รู้จบ",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำงาน 10 รอบแล้วหยุดอัตโนมัติ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ทำงานพร้อมกับ setup() สลับกันทีละคำสั่ง",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "จะทำงานก็ต่อเมื่อเกิดข้อผิดพลาดขึ้นในโปรแกรมเท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "void loop() คือวงรอบการทำงานหลัก (Main Loop) ของไมโครคอนโทรลเลอร์ ซึ่งจะทำงานวนซ้ำคำสั่งในบล็อกเรื่อยๆ ตราบใดที่มีไฟเลี้ยง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q4",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "หากต้องการให้พินดิจิทัลหมายเลข 2 ทำหน้าที่เป็นพอร์ตส่งสัญญาณออกไปเปิดหลอดไฟ LED ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "pinMode(2, OUTPUT);",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "pinMode(2, INPUT);",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "digitalWrite(2, OUTPUT);",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "digitalRead(2, HIGH);",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง pinMode(pin, mode) ใช้กำหนดทิศทางของพิน โดย OUTPUT คือส่งสัญญาณออกไปควบคุมอุปกรณ์ภายนอก",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q5",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "เมื่อต้องการสั่งจ่ายไฟ 5 โวลต์ (ตรรกะ 1) ไปยังพินดิจิทัลเพื่อให้หลอดไฟติดสว่าง ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "digitalWrite(pin, HIGH);",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "digitalWrite(pin, LOW);",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "digitalRead(pin, HIGH);",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "pinMode(pin, HIGH);",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "digitalWrite(pin, HIGH) จะส่งระดับแรงดัน 5V ออกทางพิน ทำให้หลอดไฟ LED สว่าง ส่วน LOW จะสั่งตัดไฟเป็น 0V",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q6",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ประโยชน์สำคัญของการสร้าง Function (ฟังก์ชันขึ้นมาเอง) ในการเขียนโปรแกรมควบคุมไฟคือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "ช่วยลดความซ้ำซ้อนของโค้ด ทำให้โค้ดเป็นระเบียบ อ่านง่าย และสามารถเรียกใช้งานซ้ำได้สะดวก",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ทำให้หลอดไฟสว่างมากกว่าการเขียนโค้ดใน loop() ตรงๆ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ช่วยประหยัดกระแสไฟฟ้าของบอร์ด Arduino",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำให้ไม่จำเป็นต้องต่อตัวต้านทานในวงจร",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การแยกโค้ดเป็นฟังก์ชัน (Modular Programming) ช่วยให้โปรแกรมกระชับ ไม่ต้องเขียนโค้ดเดิมซ้ำๆ และเรียกใช้งานซ้ำได้ทุกจุด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q7",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ตามรูปภาพกายวิภาคของหลอด LED ขา Anode (ขั้วบวก) มีลักษณะสังเกตภายนอกอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "เป็นขายาวกว่า (Longer lead) และแผ่นโลหะด้านในหลอดมีขนาดเล็กกว่า",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เป็นขาสั้นกว่า และขอบเลนส์พลาสติกมีรอยบากแบน",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เป็นสายสีดำเสมอ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "หลอด LED มีขาสองข้างเท่ากันทุกประการ ไม่สามารถแยกได้",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตามคู่มือ Arduino: Anode (+) คือขายาว และแผ่นด้านในเล็ก ส่วน Cathode (-) คือขาสั้น มีรอยบากแบน (Flat rim) และแผ่นในรูปทั่งใหญ่",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q8",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "การต่อขาของหลอดไฟ LED 1 ดวงเข้ากับวงจร Arduino บน Breadboard ข้อใดถูกต้อง?",
    "options": [
      {
        "id": "a",
        "text": "ขา Anode (ขายาว/ขั้วบวก) ต่อเข้าพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω) และขา Cathode (ขาสั้น/ขั้วลบ) ต่อลงพิน GND",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ขา Anode ต่อลง GND และขา Cathode ต่อเข้าพินดิจิทัล 5V โดยไม่ต้องมีตัวต้านทาน",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ต่อขาทั้งสองข้างเข้าช่อง GND ทั้งคู่",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ต้องต่อเข้ากับไฟบ้าน 220V เสมอ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ขา Anode รับไฟบอกจากพินดิจิทัล (ผ่านตัวต้านทาน 220 Ω เพื่อจำกัดกระแส) ส่วน Cathode ต่อลง GND ของบอร์ด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q9",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ทำไมจึงต้องต่อตัวต้านทาน (Resistor) ขนาด 220 Ω อนุกรมกับหลอดไฟ LED เสมอ?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อจำกัดกระแสไฟฟ้าไม่ให้ไหลผ่าน LED มากเกินไปจนหลอดขาดหรือบอร์ดเสียหาย",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพื่อเพิ่มแรงดันไฟฟ้าจาก 5V ให้เป็น 12V",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพื่อเปลี่ยนสีของหลอดไฟ LED ตามความต้านทาน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อให้หลอดไฟกระพริบได้เองโดยไม่ต้องเขียนโค้ด",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "LED มีความต้านทานภายในต่ำมาก หากไม่มีตัวต้านทานจำกัดกระแส (Current Limiting Resistor) กระแสไฟจะไหลเกินพิกัด ส่งผลให้หลอดขาดทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w2-q10",
    "courseId": "21901-2007",
    "week": 2,
    "type": "choice",
    "question": "ในการทำใบงานไฟวิ่ง 5 ดวง หากต้องการให้ไฟวิ่งเร็วขึ้น (เปลี่ยนดวงไวขึ้น) ควรปรับแต่งที่จุดใด?",
    "options": [
      {
        "id": "a",
        "text": "ลดค่าตัวเลขในคำสั่ง delay() เช่น จาก delay(500) เป็น delay(150)",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพิ่มค่าตัวเลขในคำสั่ง delay() ให้มากขึ้น เช่น delay(5000)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เปลี่ยนพินจาก Pin 2 เป็น Pin 13",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ลบฟังก์ชัน void setup() ทิ้ง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ฟังก์ชัน delay(ms) รับค่าเวลาเป็นมิลลิวินาที ยิ่งค่าน้อย ระยะเวลาหยุดรอยิ่งสั้น ทำให้ไฟสลับติดดับได้รวดเร็วขึ้น",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q1",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง Serial.begin(9600); ในฟังก์ชัน setup() มีหน้าที่อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "เปิดช่องทางการสื่อสารข้อมูลแบบอนุกรม (Serial) ระหว่างบอร์ดกับคอมพิวเตอร์ที่ความเร็ว 9600 บอด",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "จ่ายกระแสไฟฟ้า 9600 มิลลิแอมป์ให้บอร์ด Arduino",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "หน่วงเวลาการทำงานของบอร์ด 9.6 วินาที ก่อนเริ่มต้นระบบ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "กำหนดให้ขาพินหมายเลข 9600 เริ่มอ่านค่า",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Serial.begin(baudRate) เป็นคำสั่งเปิดพอร์ต USB เพื่อส่ง-รับข้อมูลระหว่าง Arduino กับคอมพิวเตอร์ โดย 9600 คือ Baud Rate หรืออัตราความเร็วในการรับส่ง 9,600 บิตต่อวินาที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q2",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "ข้อใดอธิบายความแตกต่างระหว่าง Serial.print() กับ Serial.println() ได้ถูกต้องที่สุด?",
    "options": [
      {
        "id": "a",
        "text": "Serial.println() จะขึ้นบรรทัดใหม่ (New Line) หลังแสดงผลเสร็จ ส่วน Serial.print() จะแสดงผลต่อท้ายในบรรทัดเดิม",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "Serial.print() ใช้สำหรับข้อความ ส่วน Serial.println() ใช้ได้เฉพาะตัวเลข",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "Serial.print() พิมพ์ลง Serial Monitor ส่วน Serial.println() ส่งข้อมูลไปยังเครื่องพิมพ์ภายนอก",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทั้งสองคำสั่งทำงานเหมือนกันทุกประการ ไม่มีข้อแตกต่าง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง Serial.print() จะส่งข้อความออกไปโดยไม่ขึ้นบรรทัดใหม่ ทำให้สามารถต่อคำได้ ส่วน Serial.println() จะส่งรหัสขึ้นบรรทัดใหม่ (\\r\\n) ต่อท้ายเสมอ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q3",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "การใช้คำสั่ง Serial Monitor มีประโยชน์สำคัญที่สุดอย่างไรในขั้นตอนการพัฒนาโครงงาน Arduino?",
    "options": [
      {
        "id": "a",
        "text": "ช่วยในการตรวจสอบค่าตัวแปรและ Debugging ทำให้เรา \"มองเห็นความคิดของชิป\" และตรวจหาจุดผิดพลาดในโค้ดได้ง่าย",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ช่วยเพิ่มความเร็วในการประมวลผลของ CPU ให้เร็วขึ้น 10 เท่า",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ช่วยประหยัดพลังงานแบตเตอรี่ของบอร์ด Arduino",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ช่วยแปลงภาษา C++ ให้เป็นไฟล์ Hex โดยอัตโนมัติ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เนื่องจากบอร์ด Arduino ไม่มีหน้าจอแสดงผลในตัว Serial Monitor จึงเป็นเครื่องมือ Debugging สำคัญที่สุดที่ช่วยให้โปรแกรมเมอร์ดูค่าเซนเซอร์และการเปลี่ยนสถานะได้แบบ Real-time",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q4",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "ปัญหา \"Contact Bouncing\" ของสวิตช์ปุ่มกดคืออะไร?",
    "options": [
      {
        "id": "a",
        "text": "แผ่นโลหะภายในปุ่มกดสั่นกระดอนไปมาหลายครั้งในเสี้ยววินาทีตอนกด ทำให้ไมโครคอนโทรลเลอร์ตรวจจับว่ากดปุ่มซ้ำหลายครั้ง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "สวิตช์ปุ่มกดกระเด็นหลุดออกจาก Breadboard",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "แรงดันไฟฟ้าตกจนบอร์ดดับ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ปุ่มกดค้างไม่ยอมเด้งคืน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "กลไกสวิตช์เมื่อหน้าสัมผัสกระทบกัน แผ่นโลหะจะสปริงตัวสั่นกระดอน (Bounce) ประมาณ 5-20 มิลลิวินาที ทำให้สัญญาณดิจิทัลกระพริบถี่ๆ ส่งผลให้โปรแกรมเข้าใจว่ามีการกดปุ่มหลายสิบครั้ง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q5",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "วิธีแก้ปัญหา Contact Bouncing (Debounce) ในระดับเริ่มต้นที่ง่ายและนิยมใช้ในโค้ด Arduino คือข้อใด?",
    "options": [
      {
        "id": "a",
        "text": "ใส่คำสั่ง delay(50); เล็กน้อยหลังตรวจพบการกด เพื่อรอให้การสั่นของหน้าสัมผัสโลหะนิ่งลง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพิ่มแรงดันไฟเป็น 9V",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เขียนคำสั่ง noTone() ซ้ำๆ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เปลี่ยนขาพินจาก Digital เป็น Analog",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Software Debounce อย่างง่ายทำได้โดยหน่วงเวลาสั้นๆ (เช่น 30-50 ms) หลังตรวจพบการกด เพื่อข้ามช่วงเวลาที่แผ่นโลหะกำลังกระดอน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q6",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง tone(8, 1000); มีหน้าที่การทำงานอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "สร้างสัญญาณเสียงความถี่ 1000 Hz (1 kHz) ออกไปยัง Piezo Buzzer ที่ต่ออยู่ขาพิน 8",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เปิดเสียงนาน 1000 วินาที",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ปรับความดังของเสียงเป็นระดับ 1000 เดซิเบล",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ตรวจจับเสียงความถี่ 1000 Hz จากไมโครโฟน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "พารามิเตอร์ตัวแรกคือหมายเลขขาพิน (Pin 8) และพารามิเตอร์ตัวที่สองคือความถี่เสียงในหน่วย Hertz (1000 Hz เป็นเสียงโทนแหลมปานกลาง)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q7",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการสั่งให้ Piezo Buzzer ที่ต่ออยู่ขาพิน 8 \"หยุดส่งเสียงทันที\" ต้องใช้คำสั่งใด?",
    "options": [
      {
        "id": "a",
        "text": "noTone(8);",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "digitalWrite(8, LOW);",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "tone(8, 0);",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "stopSound(8);",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "คำสั่ง noTone(pin) เป็นคำสั่งมาตรฐานของ Arduino ในการหยุดตัวสร้างสัญญาณความถี่ (Timer) บนขาพินนั้นๆ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q8",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "ในโปรแกรมจำลอง Autodesk Tinkercad Circuits หากต้องการเปิดดูข้อความที่ส่งออกมาด้วยคำสั่ง Serial ต้องทำอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "คลิกแถบ Code ด้านบน แล้วกดปุ่ม \"Serial Monitor\" ที่แถบด้านล่างของหน้าต่างโค้ด",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ต้องนำจอ LCD 16x2 มาต่อเพิ่มในวงจรเท่านั้น",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "กดปุ่ม Export ด้านบนขวาเพื่อดาวน์โหลดไฟล์ข้อความ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "บน Tinkercad ไม่สามารถดู Serial Monitor ได้ ต้องใช้บอร์ดจริงเท่านั้น",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ใน Autodesk Tinkercad Circuits หน้าต่าง Serial Monitor จะซ่อนอยู่ที่แถบด้านล่างสุดของหน้าต่าง Code เมื่อกดเปิดและเริ่ม Simulation ข้อความจะแสดงผลทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q9",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "หากต้องการสร้างสวิตช์ปุ่มกดที่กด 1 ครั้ง \"เปิดระบบ\" และกดอีก 1 ครั้ง \"ปิดระบบ\" (Toggle State) ต้องเก็บค่าสถานะอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ใช้ตัวแปรแบบบูลีน เช่น isSystemOn = !isSystemOn; สลับค่าจริง-เท็จทุกครั้งที่ตรวจพบ Falling Edge",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ใช้คำสั่ง while(true) วนลูปไม่สิ้นสุด",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ต้องตัดสายไฟทิ้งเมื่อต้องการปิด",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ใช้คำสั่ง analogRead() ตรวจสอบอุณหภูมิ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Toggle State นิยมใช้ตัวแปร bool หรือ int เพื่อจำสถานะปัจจุบัน เมื่อมีการกดปุ่มจะกลับค่าสถานะตรงข้าม (NOT) ทำให้สลับเปิด-ปิดได้เหมือนสวิตช์ไฟบ้าน",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w3-q10",
    "courseId": "21901-2007",
    "week": 3,
    "type": "choice",
    "question": "คำสั่ง state = (state + 1) % 3; นิยมใช้ในกรณีใดสำหรับระบบ State Machine?",
    "options": [
      {
        "id": "a",
        "text": "การวนสลับโหมดการทำงาน 3 สถานะ (0 -> 1 -> 2 -> 0 วนไปเรื่อยๆ) เมื่อมีการกดปุ่ม",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "การเพิ่มความเร็วของไฟกระพริบ 3 เท่า",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "การแบ่งแรงดันไฟ 5V ออกเป็น 3 ส่วน",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "การลบข้อมูลในหน่วยความจำทิ้ง 30%",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "ตัวดำเนินการ Modulo (%) จะช่วยวนลูปตัวเลข เมื่อ state ถึง 3 ตัวเศษจะกลายเป็น 0 ทำให้เราสร้าง State Machine หมุนเวียนโหมด 0, 1, 2 ได้อย่างกระชับและแม่นยำ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q1",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "โครงสร้างมาตรฐานของคำสั่ง for loop ในภาษา C++ ของ Arduino ประกอบด้วย 3 ส่วนใดตามลำดับ?",
    "options": [
      {
        "id": "a",
        "text": "for (เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "for (การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ; กำหนดค่าเริ่มต้น)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "for (กำหนดค่าเริ่มต้น; เงื่อนไขการวนซ้ำ; การเพิ่มหรือลดค่า)",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "for (กำหนดค่าเริ่มต้น; การเพิ่มหรือลดค่า; เงื่อนไขการวนซ้ำ)",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "โครงสร้างของ for loop คือ for (Initialization; Condition; Update) เช่น for (int i = 0; i < 6; i++)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q2",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "หากกำหนดให้ ledCount = 4; แล้วรันคำสั่ง for (int i = 0; i < ledCount; i++) คำสั่งภายในลูปจะทำงานกี่รอบ และ i มีค่าอะไรบ้าง?",
    "options": [
      {
        "id": "a",
        "text": "ทำงาน 4 รอบ โดยค่า i คือ 1, 2, 3 และ 4",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ทำงาน 5 รอบ โดยค่า i คือ 0, 1, 2, 3 และ 4",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ทำงาน 3 รอบ โดยค่า i คือ 0, 1 และ 2",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำงาน 4 รอบ โดยค่า i คือ 0, 1, 2 และ 3",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "เริ่มจาก i = 0 และทำตราบใดที่ i < 4 ดังนั้น i จะเป็น 0, 1, 2, 3 (รวม 4 รอบ) พอ i เพิ่มเป็น 4 เงื่อนไข 4 < 4 จะเป็นเท็จและออกจากลูปทันที",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q3",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "เมื่อประกาศ const int ledPins[6] = {2, 3, 4, 5, 6, 7}; คำสั่ง ledPins[0] และ ledPins[5] อ้างอิงถึงขาพินหมายเลขใดตามลำดับ?",
    "options": [
      {
        "id": "a",
        "text": "ledPins[0] คือขาพิน 1 และ ledPins[5] คือขาพิน 6",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 7",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ledPins[0] คือขาพิน 0 และ ledPins[5] คือขาพิน 5",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ledPins[0] คือขาพิน 2 และ ledPins[5] คือขาพิน 6",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "Index ของ Array เริ่มนับที่ 0 เสมอ ดังนั้น ledPins[0] มีค่าเท่ากับ 2 และ ledPins[5] (ตัวที่หก) มีค่าเท่ากับ 7",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q4",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "ส่วนแรกของ for loop คือ int i = 0; จะถูกประมวลผลกี่ครั้งต่อการรัน for loop 1 ชุด?",
    "options": [
      {
        "id": "a",
        "text": "ทำงานทุกรอบของลูป ทำให้ค่า i กลับเป็น 0 ทุกครั้ง",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ทำงานเฉพาะรอบสุดท้ายก่อนออกจากลูป",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ทำงานเท่ากับจำนวนรอบของลูปที่กำหนดไว้ในเงื่อนไข",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ทำงานเพียงครั้งเดียวตอนเริ่มเข้าสู่ลูป",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "ส่วน Initialization (int i = 0;) ทำงานแค่ครั้งเดียวตอนเริ่มเข้าลูป จากนั้นในแต่ละรอบจะทำงานเฉพาะ Condition -> Body -> Update (i++)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q5",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "ในใบงานที่มีปุ่มกด 2 ปุ่ม หากกด \"ปุ่มตั้งค่า\" ขณะที่ ledCount เท่ากับ 6 อยู่แล้ว โปรแกรมควรจัดการค่า ledCount อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 1",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้ปล่อยค่าไว้เป็น 7",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "ตรวจสอบว่าเกิน 6 หรือไม่ ถ้าเกินให้รีเซ็ตกลับเป็น 0",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่ต้องตรวจสอบ เพราะ for loop จะหยุดเองเมื่อครบ 6 ดวง",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "มี LED 6 ดวง หากตั้งค่าเกิน 6 จะทำให้เข้าถึง Array เกินขอบเขต (Out of Bounds) จึงต้องวนค่ากลับมาเริ่มที่ 1 ใหม่ (ค่า 0 จะไม่มีไฟวิ่งเลย)",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q6",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "เหตุใดเมื่อกด \"ปุ่มเล่น\" ไฟ LED จึงวิ่งตามจำนวนที่ตั้งไว้เพียง 1 รอบแล้วหยุด ไม่วิ่งวนซ้ำตลอด?",
    "options": [
      {
        "id": "a",
        "text": "เพราะ for loop อยู่ในฟังก์ชัน setup() ซึ่งทำงานเพียงครั้งเดียว",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เพราะ Serial.begin(9600) ทำให้ลูปหยุดหลังจบ 1 รอบ",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพราะ for loop อยู่ในเงื่อนไขตรวจจับการกดปุ่มครั้งเดียว (lastBtnPlayState == HIGH && currentBtnPlay == LOW)",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "เพราะ delay(300) ทำให้ลูปถูกยกเลิกเมื่อครบเวลา",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "การวาง for loop ไว้ใน if (lastBtnPlayState == HIGH && currentBtnPlay == LOW) ทำให้ลูปรันเฉพาะจังหวะที่กดปุ่มลง 1 ครั้ง พอรันครบ 1 รอบก็กลับไปเช็คปุ่มต่อ",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q7",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "หากต้องการให้ไฟ LED วิ่งย้อนกลับจากดวงที่ 6 ลงมาดวงที่ 1 (Index 5 ลงมา 0) ต้องเขียนหัวคำสั่ง for loop อย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "for (int i = 5; i > 0; i--)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "for (int i = 6; i >= 0; i--)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "for (int i = 5; i >= 0; i++)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "for (int i = 5; i >= 0; i--)",
        "isCorrect": true
      }
    ],
    "score": 1,
    "explanation": "ต้องเริ่ม i = 5, เงื่อนไข i >= 0 (เพื่อให้รวม Index 0) และลดค่าทีละ 1 ด้วย i-- ตัวเลือกอื่นพลาด Index 0, เริ่มที่ 6 ซึ่งเกิน Array หรือเพิ่มค่าแทนที่จะลด",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q8",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "ถ้าเขียนผิดเป็น for (int i = 0; i < 6; i--) ซึ่งเริ่มที่ 0 แต่ลดค่า i ลงเรื่อย ๆ (0, -1, -2, ...) จะเกิดผลอย่างไร?",
    "options": [
      {
        "id": "a",
        "text": "ลูปทำงานเพียงรอบเดียวแล้วออกจากลูปทันที",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "เกิด Infinite Loop เพราะ i ติดลบและน้อยกว่า 6 เสมอ ทำให้อ้างอิงขาพินผิดพลาด",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ลูปไม่ทำงานเลย เพราะค่าเริ่มต้นไม่ตรงกับเงื่อนไข",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ลูปทำงาน 6 รอบตามปกติ แต่ไฟวิ่งย้อนกลับ",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "เมื่อ i ลดเป็น -1, -2, -3 เงื่อนไข i < 6 จะเป็นจริงตลอด โปรแกรมจึงติดอยู่ในลูปไม่รู้จบ (Infinite Loop) และอ่านค่าหน่วยความจำนอก Array",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q9",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "ทำไมภายในลูปไฟวิ่งจึงต้องมีคำสั่ง digitalWrite(ledPins[i], LOW); ตามหลัง delay(300);?",
    "options": [
      {
        "id": "a",
        "text": "เพื่อดับไฟดวงปัจจุบันก่อนขยับไปเปิดดวงถัดไป ให้เห็นเป็นไฟวิ่งทีละดวง",
        "isCorrect": true
      },
      {
        "id": "b",
        "text": "เพื่อรีเซ็ตค่า i ให้กลับเป็น 0 ก่อนเริ่มรอบถัดไป",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "เพื่อลดแรงดันไฟที่จ่ายให้ขาพินไม่ให้สูงเกินไป",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "เพื่อให้ delay(300) ทำงานได้ถูกต้องในรอบถัดไป",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "หากสั่งแต่ HIGH โดยไม่สั่ง LOW หลอดไฟจะติดค้างสะสมไปเรื่อย ๆ การสั่ง HIGH -> delay -> LOW ในแต่ละรอบของ i จึงทำให้เห็นไฟติดและดับไล่ทีละดวง",
    "createdAt": "2026-03-01T00:00:00.000Z"
  },
  {
    "id": "21901-2007-w4-q10",
    "courseId": "21901-2007",
    "week": 4,
    "type": "choice",
    "question": "การใช้ pinMode(BTN_PIN, INPUT_PULLUP); ร่วมกับการต่อปุ่มกดลง GND มีข้อดีอย่างไรในการต่อวงจร?",
    "options": [
      {
        "id": "a",
        "text": "ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น LOW ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น HIGH",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "ใช้ตัวต้านทานภายในชิปดึงสัญญาณเป็น HIGH ปกติ และเมื่อกดปุ่มสัญญาณจะเป็น LOW",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "ใช้ตัวต้านทานภายนอกที่ต่อพ่วงในปุ่มกด ทำให้สัญญาณเป็น HIGH ปกติ",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "ไม่ใช้ตัวต้านทานเลย แต่ใช้การหน่วงเวลาในโปรแกรมแทนการกันสัญญาณรบกวน",
        "isCorrect": false
      }
    ],
    "score": 1,
    "explanation": "INPUT_PULLUP เปิดใช้ตัวต้านทาน Pull-up ภายในชิป ATmega328P ทำให้ไม่ต้องต่อตัวต้านทานภายนอก สัญญาณปกติเป็น HIGH และเมื่อกดปุ่ม (ต่อลง GND) จะเป็น LOW",
    "createdAt": "2026-03-01T00:00:00.000Z"
  }
];

export default allCourseQuizzes;
