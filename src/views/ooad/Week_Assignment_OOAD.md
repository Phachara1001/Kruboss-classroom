# แผนเนื้อหาและใบงานรายสัปดาห์

## รายวิชา 21900-1004 หลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ

### Principle of Object-Oriented Analysis and Design (OOAD)

**ระดับ:** ปวช.1  
**รหัสวิชา:** 21900-1004  
**หน่วยกิต:** 1-2-2  
**ระยะเวลา:** 18 สัปดาห์  
**แนวทาง:** Problem-Based Learning + Project-Based Learning

---

# 1. แนวคิดการจัดการเรียนรู้

รายวิชานี้มุ่งให้ผู้เรียนสามารถ **สำรวจและวิเคราะห์ความต้องการทางธุรกิจ → สร้างแบบจำลอง UML → วิเคราะห์และออกแบบระบบเชิงวัตถุ → ประยุกต์ใช้ในการพัฒนาซอฟต์แวร์**

ใบงานแต่ละสัปดาห์จึงถูกออกแบบให้ต่อเนื่องกัน โดยให้นักเรียนเลือก **กรณีศึกษาระบบ 1 ระบบ** แล้วนำระบบเดียวกันมาต่อยอดตลอดภาคเรียน

```text
ปัญหาทางธุรกิจ
      ↓
การเก็บรวบรวมข้อมูล
      ↓
Requirements
      ↓
Object / Class
      ↓
Use Case
      ↓
Use Case Description
      ↓
Activity Diagram
      ↓
Class Diagram
      ↓
Class Relationships
      ↓
Sequence Diagram
      ↓
UI / Software Design
      ↓
Database Mapping
      ↓
Project Analysis & Design
      ↓
Presentation
```

---

# 2. ความสอดคล้องกับคำอธิบายรายวิชา

คำอธิบายรายวิชาเน้นการ **ศึกษาและปฏิบัติเกี่ยวกับหลักการวิเคราะห์และออกแบบระบบเชิงวัตถุ การเขียนโครงสร้างและความต้องการทางธุรกิจ การกำหนดกลุ่มเป้าหมาย การออกแบบแบบจำลอง UML การสำรวจข้อมูล การรวบรวมข้อมูลที่ถูกต้อง การวิเคราะห์และเลือกเครื่องมือให้สอดคล้องกับรูปแบบ รวมถึงการวิเคราะห์ความหมาย ลำดับขั้นตอน และจำแนกรูปแบบ**

ดังนั้นเนื้อหาจึงจัดเป็น 5 ช่วง:

| ช่วง | สัปดาห์ | เนื้อหาหลัก                                |
| ---- | ------- | ------------------------------------------ |
| 1    | 1–4     | ความต้องการทางธุรกิจและแนวคิดเชิงวัตถุ     |
| 2    | 5–8     | Use Case และ Activity Modeling             |
| 3    | 10–12   | Class และ Interaction Modeling             |
| 4    | 13–14   | การต่อยอด UML สู่ UI / Database / Software |
| 5    | 15–17   | โครงงานวิเคราะห์และออกแบบระบบ              |

---

# 3. ระบบตัวอย่างที่สามารถเลือกทำโครงงาน

- ระบบจัดการหอพัก
- ระบบห้องสมุด
- ระบบร้านอาหาร
- ระบบร้านค้าออนไลน์
- ระบบจองห้องประชุม
- ระบบจองสนามกีฬา
- ระบบจัดการคลินิก
- ระบบจัดการโรงเรียน
- ระบบยืม-คืนอุปกรณ์
- ระบบจัดการการซ่อมคอมพิวเตอร์
- ระบบสั่งซื้อสินค้า
- ระบบจองคิวบริการ

> **คำแนะนำ:** ให้แต่ละกลุ่มเลือกปัญหาที่นักเรียนเข้าใจจริง และมีผู้ใช้งานหรือผู้เกี่ยวข้องชัดเจน

---

# สัปดาห์ที่ 1

# ปฐมนิเทศและวิเคราะห์ความต้องการทางธุรกิจ

## Orientation & Business Requirements

### เนื้อหาที่เรียน

### 1. ความหมายของระบบ

ระบบ คือ กลุ่มองค์ประกอบที่ทำงานร่วมกันเพื่อบรรลุวัตถุประสงค์บางอย่าง

ในบริบทของ Software Application สามารถมองระบบเป็น:

```text
Input → Process → Output
```

ตัวอย่างระบบร้านค้า:

```text
ข้อมูลสินค้า + ข้อมูลลูกค้า
          ↓
       ประมวลผล
          ↓
ใบสั่งซื้อ / ยอดขาย / รายงาน
```

### 2. ระบบสารสนเทศในธุรกิจ

ศึกษาบทบาทของ Software Application เช่น:

- ระบบขายสินค้า
- ระบบบัญชี
- ระบบจัดการสมาชิก
- ระบบจองบริการ
- ระบบจัดการคลังสินค้า
- ระบบบริหารสถานศึกษา

### 3. ปัญหาทางธุรกิจ

ให้นักเรียนแยกให้ออกระหว่าง:

**ปัญหา (Problem)**  
สิ่งที่ระบบเดิมทำได้ไม่ดีหรือสร้างผลกระทบ

**สาเหตุ (Cause)**  
เหตุผลที่ทำให้เกิดปัญหา

**ผลกระทบ (Impact)**  
สิ่งที่เกิดขึ้นจากปัญหา

**ความต้องการ (Need)**  
สิ่งที่ผู้ใช้งานต้องการให้ระบบช่วยแก้ไข

### 4. กลุ่มเป้าหมายและ Stakeholder

Stakeholder คือ บุคคลหรือกลุ่มที่มีส่วนเกี่ยวข้องกับระบบ เช่น:

- เจ้าของกิจการ
- พนักงาน
- ลูกค้า
- ผู้ดูแลระบบ
- ผู้บริหาร

### 5. SDLC เบื้องต้น

แนะนำวงจรการพัฒนาระบบ:

```text
Planning
   ↓
Analysis
   ↓
Design
   ↓
Development
   ↓
Testing
   ↓
Deployment
   ↓
Maintenance
```

### ใบงานที่ 1: วิเคราะห์ระบบและปัญหาทางธุรกิจ

#### ภารกิจ 1: ข้อมูลระบบ

- ชื่อระบบ:
- ประเภทของระบบ:
- ระบบนี้มีไว้เพื่ออะไร:
- ใครเป็นผู้ใช้งาน:
- กลุ่มเป้าหมายคือใคร:

#### ภารกิจ 2: วิเคราะห์ปัญหา

| ปัญหา | สาเหตุ | ผลกระทบ |
| ----- | ------ | ------- |
|       |        |         |
|       |        |         |
|       |        |         |

#### ภารกิจ 3: Stakeholder

| Stakeholder | หน้าที่ | ความต้องการ |
| ----------- | ------- | ----------- |
|             |         |             |
|             |         |             |
|             |         |             |

#### ภารกิจ 4: Problem Statement

เขียนสรุปปัญหา 1 ย่อหน้า โดยตอบ:

> ปัจจุบันเกิดปัญหาอะไร? ใครได้รับผลกระทบ? และระบบใหม่จะช่วยแก้ปัญหาอย่างไร?

### ชิ้นงาน

**Problem Statement 1 หน้า**

---

# สัปดาห์ที่ 2

# การสำรวจปัญหาและการรวบรวมความต้องการ

## Fact-Finding & Survey Design

### เนื้อหาที่เรียน

### 1. ความหมายของ Fact-Finding

Fact-Finding คือ กระบวนการรวบรวมข้อมูลจากผู้ใช้งานและผู้เกี่ยวข้อง เพื่อนำมาใช้ในการวิเคราะห์ระบบ

### 2. เทคนิคการเก็บรวบรวมข้อมูล

#### การสัมภาษณ์

เหมาะสำหรับการถามรายละเอียดเชิงลึก

ตัวอย่าง:

> ปัจจุบันขั้นตอนการรับออเดอร์ทำอย่างไร?

#### แบบสอบถาม

เหมาะสำหรับการรวบรวมข้อมูลจากผู้ตอบจำนวนมาก

#### การสังเกต

ผู้วิเคราะห์สังเกตการทำงานจริงของผู้ใช้งาน

#### การศึกษาเอกสาร

เช่น ใบเสร็จ แบบฟอร์ม รายงาน หรือเอกสารขั้นตอนการทำงาน

### 3. หลักการสร้างคำถาม

คำถามควร:

- ชัดเจน
- ไม่กำกวม
- ไม่ชี้นำคำตอบ
- สอดคล้องกับวัตถุประสงค์
- สามารถนำคำตอบไปวิเคราะห์ได้

### ใบงานที่ 2: Fact-Finding

#### ภารกิจ 1

เลือกวิธีรวบรวมข้อมูลอย่างน้อย 2 วิธี และอธิบายเหตุผล

#### ภารกิจ 2

ออกแบบคำถามสัมภาษณ์อย่างน้อย 8 ข้อ

| ลำดับ | คำถาม | ต้องการรู้อะไร |
| ----- | ----- | -------------- |
| 1     |       |                |
| 2     |       |                |
| 3     |       |                |
| 4     |       |                |
| 5     |       |                |
| 6     |       |                |
| 7     |       |                |
| 8     |       |                |

#### ภารกิจ 3

สร้าง Google Forms อย่างน้อย 10 ข้อ

ควรมี:

- คำถามเกี่ยวกับปัญหา
- ความต้องการ
- ความถี่ในการใช้งาน
- ความคาดหวังต่อระบบ

### ชิ้นงาน

1. แบบสัมภาษณ์
2. Google Forms
3. ผลการสำรวจเบื้องต้น

---

# สัปดาห์ที่ 3

# การวิเคราะห์และจัดทำความต้องการระบบ

## Requirements Analysis

### เนื้อหาที่เรียน

### 1. Requirement คืออะไร

Requirement คือ ความต้องการหรือสิ่งที่ระบบต้องสามารถตอบสนองได้

### 2. Functional Requirement

บอกว่า **ระบบต้องทำอะไร**

ตัวอย่าง:

> ระบบสามารถเพิ่มข้อมูลสินค้าได้

> ระบบสามารถค้นหาสินค้าได้

> ระบบสามารถสร้างใบสั่งซื้อได้

### 3. Non-Functional Requirement

บอกว่า **ระบบควรมีคุณลักษณะอย่างไร**

ตัวอย่าง:

- ระบบต้องตอบสนองภายในเวลาที่เหมาะสม
- ระบบต้องมีการยืนยันตัวตน
- ระบบต้องใช้งานง่าย
- ระบบต้องสำรองข้อมูล

### 4. Requirement Prioritization

แบ่งความสำคัญเป็น:

- High
- Medium
- Low

หรือใช้ MoSCoW:

- Must Have
- Should Have
- Could Have
- Won't Have

### ใบงานที่ 3

#### Functional Requirements

อย่างน้อย 8 รายการ

| ID    | Requirement | ความสำคัญ |
| ----- | ----------- | --------- |
| FR-01 |             |           |
| FR-02 |             |           |
| FR-03 |             |           |
| FR-04 |             |           |
| FR-05 |             |           |
| FR-06 |             |           |
| FR-07 |             |           |
| FR-08 |             |           |

#### Non-Functional Requirements

อย่างน้อย 4 รายการ

| ID     | Requirement | ประเภท |
| ------ | ----------- | ------ |
| NFR-01 |             |        |
| NFR-02 |             |        |
| NFR-03 |             |        |
| NFR-04 |             |        |

### ชิ้นงาน

**Requirements Specification**

---

# สัปดาห์ที่ 4

# พื้นฐานแนวคิดเชิงวัตถุ

## Object-Oriented Concepts: Class & Object

### เนื้อหาที่เรียน

### 1. Object

Object คือ สิ่งที่เราสามารถระบุได้ว่ามีข้อมูลและพฤติกรรมของตัวเอง

ตัวอย่าง:

```text
นักเรียนคนหนึ่ง
สินค้า 1 ชิ้น
หนังสือ 1 เล่ม
รถยนต์ 1 คัน
```

### 2. Class

Class คือ แบบจำลองหรือแม่แบบที่ใช้สร้าง Object

ตัวอย่าง:

```text
Class: Student

Attributes:
- studentId
- name
- major

Methods:
- register()
- study()
```

### 3. Attribute

คือข้อมูลหรือคุณลักษณะของ Object

### 4. Method / Operation

คือพฤติกรรมหรือการทำงานของ Object

### 5. Object vs Class

```text
Class = แม่แบบ
Object = สิ่งที่สร้างจากแม่แบบ
```

ตัวอย่าง:

```text
Class: Student

Object:
student01
student02
student03
```

### ใบงานที่ 4

#### ภารกิจ 1

วิเคราะห์สิ่งของ 5 อย่าง

| Object | Class | Attribute | Method |
| ------ | ----- | --------- | ------ |
|        |       |           |        |
|        |       |           |        |
|        |       |           |        |
|        |       |           |        |
|        |       |           |        |

#### ภารกิจ 2

วิเคราะห์ระบบของกลุ่มอย่างน้อย 5 Classes

| Class | Attributes | Methods |
| ----- | ---------- | ------- |
|       |            |         |
|       |            |         |
|       |            |         |
|       |            |         |
|       |            |         |

### ชิ้นงาน

**Object & Class Identification Sheet**

---

# สัปดาห์ที่ 5

# แผนภาพยูสเคสและการระบุผู้ใช้งาน

## Use Case Diagram & Actors

### เนื้อหาที่เรียน

### 1. Actor

Actor คือ บุคคล ระบบ หรือสิ่งภายนอกที่มีปฏิสัมพันธ์กับระบบ

ตัวอย่าง:

```text
Customer
Admin
Employee
Payment System
```

### 2. Use Case

Use Case คือ ความสามารถหรือเป้าหมายที่ผู้ใช้งานต้องการให้ระบบทำ

ตัวอย่าง:

- Login
- Register
- Search Product
- Create Order
- Pay Order

### 3. System Boundary

ใช้แสดงขอบเขตของระบบ

### 4. Association

แสดงว่า Actor มีปฏิสัมพันธ์กับ Use Case

### 5. Include

ใช้เมื่อ Use Case หนึ่งต้องเรียกใช้อีก Use Case หนึ่งเสมอ

### 6. Extend

ใช้เมื่อพฤติกรรมเพิ่มเติมเกิดขึ้นภายใต้เงื่อนไข

### ใบงานที่ 5

#### Actor

| Actor | บทบาท |
| ----- | ----- |
|       |       |
|       |       |
|       |       |

#### Use Case

อย่างน้อย 6 รายการ

| ID    | Use Case | Actor |
| ----- | -------- | ----- |
| UC-01 |          |       |
| UC-02 |          |       |
| UC-03 |          |       |
| UC-04 |          |       |
| UC-05 |          |       |
| UC-06 |          |       |

#### ชิ้นงาน

สร้าง **Use Case Diagram**

---

# สัปดาห์ที่ 6

# การเขียนคำอธิบายยูสเคส

## Use Case Description & Scenarios

### เนื้อหาที่เรียน

Use Case Diagram บอกภาพรวมว่า **ใครทำอะไรกับระบบ**

แต่ Use Case Description ใช้อธิบายว่า **กิจกรรมนั้นเกิดขึ้นอย่างไร**

องค์ประกอบสำคัญ:

- Use Case Name
- Actor
- Goal
- Preconditions
- Main Flow
- Alternative Flow
- Exception Flow
- Postconditions

### Main Flow

เส้นทางปกติของการทำงาน

### Alternative Flow

เส้นทางทางเลือกที่ยังถือว่าเป็นการทำงานที่ถูกต้อง

### Exception Flow

กรณีเกิดข้อผิดพลาดหรือเงื่อนไขที่ระบบไม่สามารถดำเนินการตามปกติ

### ใบงานที่ 6

เลือก Use Case สำคัญ 2 รายการ

| รายการ           | รายละเอียด |
| ---------------- | ---------- |
| Use Case Name    |            |
| Actor            |            |
| Goal             |            |
| Preconditions    |            |
| Main Flow        |            |
| Alternative Flow |            |
| Exception Flow   |            |
| Postconditions   |            |

### ชิ้นงาน

**Use Case Specification 2 รายการ**

---

# สัปดาห์ที่ 7

# แผนภาพกิจกรรมจำลองกระบวนการธุรกิจ

## Activity Diagram

### เนื้อหาที่เรียน

Activity Diagram ใช้แสดง **ลำดับขั้นตอนของกิจกรรมหรือ Workflow**

องค์ประกอบ:

- Initial Node
- Action
- Decision
- Merge
- Fork
- Join
- Final Node
- Swimlane

ตัวอย่างกระบวนการ:

```text
เริ่มต้น
   ↓
กรอกข้อมูล
   ↓
ตรวจสอบข้อมูล
   ↓
ข้อมูลถูกต้อง?
  ↙       ↘
ใช่        ไม่ใช่
 ↓          ↓
บันทึก      แสดงข้อผิดพลาด
 ↓
สิ้นสุด
```

### Swimlane

ใช้แบ่งความรับผิดชอบของแต่ละ Actor หรือหน่วยงาน

### ใบงานที่ 7

เลือก Use Case จากสัปดาห์ที่ 6 จำนวน 1 รายการ

สร้าง Activity Diagram พร้อม:

- Initial Node
- Action
- Decision
- Final Node
- Swimlane เมื่อเหมาะสม

### ชิ้นงาน

**Activity Diagram 1 Diagram**

---

# สัปดาห์ที่ 8

# Workshop: การสร้างแบบจำลองความต้องการ

## Requirements Modeling Workshop

### เนื้อหาที่เรียน

ทบทวนความสัมพันธ์ของ:

```text
Problem
 ↓
Requirement
 ↓
Actor
 ↓
Use Case
 ↓
Use Case Description
 ↓
Activity Diagram
```

เน้นการตรวจสอบว่าแบบจำลองแต่ละชนิด **ต้องสอดคล้องกัน**

ตัวอย่าง:

ถ้า Requirement ระบุว่า:

> ระบบสามารถค้นหาสินค้าได้

ควรมี:

```text
Use Case: Search Product
       ↓
Activity: ขั้นตอนการค้นหา
       ↓
Sequence: การส่งคำขอค้นหา
       ↓
Class: Product / SearchService
```

### ใบงานที่ 8

จัดทำชุด:

1. Requirements
2. Actor
3. Use Case Diagram
4. Use Case Description
5. Activity Diagram

### Checklist

- [ ] Requirement สอดคล้องกับปัญหา
- [ ] Actor มีเหตุผล
- [ ] Use Case มาจาก Requirement
- [ ] Main Flow สอดคล้องกับ Activity
- [ ] ชื่อระบบและคำศัพท์สอดคล้องกัน

### ชิ้นงาน

**Requirements Modeling Package**

---

# สัปดาห์ที่ 9

# สอบกลางภาค

## Midterm Examination

### เนื้อหาที่ทบทวน

1. ระบบและ Software Application
2. Business Problem
3. Stakeholder
4. Fact-Finding
5. Requirements
6. Functional / Non-Functional Requirements
7. Class / Object
8. Actor / Use Case
9. Use Case Description
10. Activity Diagram

### แนวทางการสอบ

เน้นทั้ง:

- ความรู้
- การวิเคราะห์
- การอ่านแบบจำลอง
- การสร้างแบบจำลองจากสถานการณ์

---

# สัปดาห์ที่ 10

# คลาส วัตถุ และแผนภาพคลาส

## Class, Object & Class Diagram

### เนื้อหาที่เรียน

### โครงสร้าง Class

UML Class โดยทั่วไปแบ่งเป็น 3 ส่วน:

```text
┌─────────────────────┐
│ Class Name          │
├─────────────────────┤
│ Attributes          │
├─────────────────────┤
│ Operations           │
└─────────────────────┘
```

### Visibility

```text
+ public
- private
# protected
~ package
```

ตัวอย่าง:

```text
Customer
----------------
- customerId
- name
- email
----------------
+ login()
+ updateProfile()
```

### Candidate Class

เริ่มจากคำนามสำคัญใน Requirement แล้วพิจารณาว่าสิ่งนั้นควรเป็น Class หรือไม่

### ใบงานที่ 10

#### Candidate Classes

อย่างน้อย 5 Classes

| Candidate Class | เหตุผล |
| --------------- | ------ |
|                 |        |
|                 |        |
|                 |        |
|                 |        |
|                 |        |

#### Class Definition

| Class | Attributes | Operations |
| ----- | ---------- | ---------- |
|       |            |            |
|       |            |            |
|       |            |            |
|       |            |            |
|       |            |            |

### ชิ้นงาน

**Class Diagram Version 1**

---

# สัปดาห์ที่ 11

# ความสัมพันธ์ระหว่างคลาส

## Class Relationships & Multiplicity

### เนื้อหาที่เรียน

### 1. Association

ความสัมพันธ์ทั่วไป

```text
Customer ───── Order
```

### 2. Aggregation

ความสัมพันธ์แบบส่วนประกอบที่ส่วนย่อยสามารถอยู่ได้โดยไม่จำเป็นต้องขึ้นกับส่วนใหญ่ทั้งหมด

### 3. Composition

ความสัมพันธ์แบบส่วนประกอบที่ส่วนย่อยมีความเป็นเจ้าของกับส่วนใหญ่

### 4. Generalization

ความสัมพันธ์แบบสืบทอด

```text
        User
         △
       /    Student   Teacher
```

### 5. Multiplicity

ระบุจำนวนของ Object ที่สัมพันธ์กัน

ตัวอย่าง:

```text
1
0..1
*
0..*
1..*
```

ตัวอย่าง:

```text
Customer 1 ───── 0..* Order
```

หมายถึงลูกค้า 1 คนสามารถมี Order ได้ 0 หรือหลายรายการ

### ใบงานที่ 11

| Class A | Relationship | Class B | Multiplicity | เหตุผล |
| ------- | ------------ | ------- | ------------ | ------ |
|         |              |         |              |        |
|         |              |         |              |        |
|         |              |         |              |        |
|         |              |         |              |        |
|         |              |         |              |        |

### ชิ้นงาน

**Class Diagram Version 2 + อธิบาย Relationship**

---

# สัปดาห์ที่ 12

# แผนภาพลำดับขั้นตอนการทำงาน

## Sequence Diagram

### เนื้อหาที่เรียน

Sequence Diagram แสดง **การโต้ตอบระหว่าง Actor และ Object ตามลำดับเวลา**

องค์ประกอบ:

- Actor
- Lifeline
- Activation
- Message
- Return Message

ตัวอย่างแนวคิด:

```text
User
 ↓
Login Page
 ↓
Auth Controller
 ↓
User
 ↓
Database
```

### Message

ใช้แสดงการเรียกใช้งานระหว่าง Object

### Synchronous Message

ผู้ส่งรอผลลัพธ์

### Asynchronous Message

ผู้ส่งไม่จำเป็นต้องรอผลลัพธ์ทันที

### ใบงานที่ 12

เลือก Use Case สำคัญ 1 เรื่อง

เช่น:

- Login
- Register
- Create Order
- Booking
- Borrow Book

จัดทำ Sequence Diagram

### ชิ้นงาน

**Sequence Diagram 1 Diagram**

---

# สัปดาห์ที่ 13

# การบูรณาการแบบจำลอง UML

## Integrated UML Model

### เนื้อหาที่เรียน

นำ UML แต่ละแบบมาเชื่อมโยงกัน

```text
Requirement
      ↓
Use Case
      ↓
Activity
      ↓
Class
      ↓
Sequence
```

### Traceability

Traceability คือ การติดตามว่า Requirement หนึ่งรายการถูกนำไปออกแบบและสร้างเป็นส่วนใดของระบบ

ตัวอย่าง:

```text
FR-01
 ↓
UC-01
 ↓
Activity-01
 ↓
Class: Product
 ↓
Sequence-01
```

### ใบงานที่ 13

เลือก Function สำคัญ 1 Function

| Model       | สอดคล้องหรือไม่ | สิ่งที่ต้องแก้ |
| ----------- | --------------- | -------------- |
| Requirement | ✓ / ✗           |                |
| Use Case    | ✓ / ✗           |                |
| Activity    | ✓ / ✗           |                |
| Class       | ✓ / ✗           |                |
| Sequence    | ✓ / ✗           |                |

### Reflection

1. แบบจำลองใดช่วยให้เข้าใจระบบมากที่สุด?
2. พบความไม่สอดคล้องตรงไหน?
3. แก้ไขอย่างไร?

### ชิ้นงาน

**UML Integrated Model**

---

# สัปดาห์ที่ 14

# การต่อยอดแบบจำลองสู่การพัฒนาระบบ

## UI Wireframing, Database Mapping & Software Design

### เนื้อหาที่เรียน

สัปดาห์นี้เชื่อมโยง UML กับการนำไปพัฒนาระบบจริง

## 1. UI Wireframe

Wireframe คือ แบบร่างโครงสร้างหน้าจอ

ตัวอย่าง:

```text
┌───────────────────────────┐
│ Header                    │
├───────────────────────────┤
│ Menu                      │
│                           │
│  Form / Content           │
│                           │
│             [Save]        │
└───────────────────────────┘
```

## 2. User Journey

วิเคราะห์เส้นทางของผู้ใช้:

```text
Login
 ↓
Dashboard
 ↓
ค้นหาข้อมูล
 ↓
ดูรายละเอียด
 ↓
ทำรายการ
 ↓
ยืนยัน
```

## 3. Class to Database Mapping

แนวคิดเบื้องต้น:

```text
Class       → Table
Attribute   → Column
Object ID   → Primary Key
Reference   → Foreign Key
```

ตัวอย่าง:

```text
Customer
↓
customers

customerId → customer_id
name       → name
email      → email
```

## 4. Technology Stack

พิจารณา:

- Frontend
- Backend
- Database
- API
- Development Tool
- Version Control

### ใบงานที่ 14

จัดทำ:

1. Wireframe อย่างน้อย 2 หน้าจอ
2. User Journey 1 กระบวนการ
3. Class → Table Mapping
4. Technology Stack

### ชิ้นงาน

**Software Design Plan**

---

# สัปดาห์ที่ 15

# การเตรียมความพร้อมและกำหนดหัวข้อโครงงาน

## Project Preparation

### เนื้อหาที่เรียน

เรียนรู้การกำหนดโครงงานให้มีขอบเขตเหมาะสม

หัวข้อสำคัญ:

- Problem
- Target User
- Objective
- Scope
- Requirement
- Actor
- Expected Output

### หลักการกำหนด Scope

ไม่ควรกว้างเกินไป เช่น:

> ระบบบริหารธุรกิจครบวงจร

ควรเจาะจง เช่น:

> ระบบจัดการการสั่งซื้อสำหรับร้านเครื่องดื่มขนาดเล็ก

### ใบงานที่ 15

จัดทำ Project Proposal:

1. ชื่อระบบ
2. หลักการและเหตุผล
3. ปัญหา
4. กลุ่มเป้าหมาย
5. วัตถุประสงค์
6. ขอบเขต
7. Functional Requirements
8. Non-Functional Requirements
9. Actor
10. Use Case เบื้องต้น
11. สมาชิกและหน้าที่

### ชิ้นงาน

**Project Proposal**

---

# สัปดาห์ที่ 16

# โครงงานการวิเคราะห์ระบบ

## Project Analysis

### เนื้อหาที่เรียน

นำองค์ความรู้ช่วงแรกมาใช้กับโครงงานจริง

เน้น:

```text
Problem
 ↓
Fact-Finding
 ↓
Requirement
 ↓
Actor
 ↓
Use Case
 ↓
Activity
```

### ภารกิจ

จัดทำ:

1. Functional Requirements
2. Non-Functional Requirements
3. Actor
4. Use Case Diagram
5. Use Case Description 2–3 รายการ
6. Activity Diagram อย่างน้อย 2 Diagram

### ชิ้นงาน

**System Analysis Document**

---

# สัปดาห์ที่ 17

# โครงงานการออกแบบและนำเสนอ

## Project Design & Showcase

### เนื้อหาที่เรียน

นำผลการวิเคราะห์มาสู่การออกแบบระบบ

```text
Analysis
   ↓
Class Design
   ↓
Relationship
   ↓
Sequence
   ↓
UI
   ↓
Database
   ↓
Software Plan
```

### ภารกิจ

จัดทำ:

1. Class Diagram
2. Class Relationships
3. Multiplicity
4. Sequence Diagram อย่างน้อย 2 Diagram
5. UI Wireframe
6. Database Mapping
7. Integrated UML
8. Software Development Plan

### การนำเสนอ

แนะนำ 7–10 นาทีต่อกลุ่ม

1. ชื่อระบบ
2. ปัญหา
3. กลุ่มเป้าหมาย
4. Requirements
5. Use Case
6. Activity
7. Class
8. Sequence
9. UI / Database
10. แนวทางพัฒนา
11. สิ่งที่ได้เรียนรู้
12. Q&A

### ชิ้นงาน

**OOAD Project + Presentation**

---

# สัปดาห์ที่ 18

# สอบปลายภาค

## Final Examination

### เนื้อหาที่สอบ

ครอบคลุมทั้งกระบวนการ:

```text
Business Problem
       ↓
Requirements
       ↓
Object-Oriented Analysis
       ↓
Use Case
       ↓
Activity
       ↓
Class
       ↓
Sequence
       ↓
Object-Oriented Design
```

### แนวทางการสอบ

ควรมีทั้ง:

- ปรนัย/อัตนัยวัดความรู้
- วิเคราะห์สถานการณ์
- อ่าน UML
- แก้ไข UML ที่ผิด
- สร้าง UML จากโจทย์

---

# 4. ตารางสรุปเนื้อหาและใบงานทั้งภาคเรียน

| สัปดาห์ | เนื้อหา                                                             | ใบงาน/ชิ้นงาน               |
| ------- | ------------------------------------------------------------------- | --------------------------- |
| 1       | ระบบ, Business Problem, Stakeholder, SDLC                           | Problem Statement           |
| 2       | Fact-Finding, Interview, Survey                                     | Interview + Google Forms    |
| 3       | Functional / Non-Functional Requirements                            | Requirements Specification  |
| 4       | Object, Class, Attribute, Method                                    | Object/Class Identification |
| 5       | Actor, Use Case, Boundary, Include/Extend                           | Use Case Diagram            |
| 6       | Main / Alternative / Exception Flow                                 | Use Case Description        |
| 7       | Activity, Decision, Fork/Join, Swimlane                             | Activity Diagram            |
| 8       | Requirements Modeling                                               | UML Workshop                |
| 9       | ทบทวนเนื้อหาสัปดาห์ 1–8                                             | Midterm                     |
| 10      | Class Diagram, Attribute, Operation, Visibility                     | Class Diagram V1            |
| 11      | Association, Aggregation, Composition, Generalization, Multiplicity | Class Diagram V2            |
| 12      | Lifeline, Message, Activation, Interaction                          | Sequence Diagram            |
| 13      | UML Traceability / Integration                                      | Integrated UML              |
| 14      | Wireframe, User Journey, Database Mapping, Technology Stack         | Software Design Plan        |
| 15      | Project Scope / Proposal                                            | Project Proposal            |
| 16      | Project Analysis                                                    | Analysis Document           |
| 17      | Project Design + Presentation                                       | OOAD Project                |
| 18      | สรุปและประเมินผล                                                    | Final Examination           |

---

# 5. เกณฑ์ประเมินใบงาน

| ด้าน                              |    คะแนน |
| --------------------------------- | -------: |
| ความถูกต้องของเนื้อหาและหลัก OOAD |      40% |
| ความสอดคล้องของ UML               |      25% |
| การวิเคราะห์และการให้เหตุผล       |      20% |
| ความเรียบร้อยของชิ้นงาน           |      10% |
| การส่งงานและความรับผิดชอบ         |       5% |
| **รวม**                           | **100%** |

---

# 6. ผลงานสะสมปลายภาค

ผู้เรียนจะมี **OOAD Portfolio** ดังนี้:

```text
01 Problem Statement
02 Fact-Finding
03 Requirements Specification
04 Object & Class Identification
05 Use Case Diagram
06 Use Case Description
07 Activity Diagram
08 Requirements Modeling Package

10 Class Diagram
11 Class Relationships
12 Sequence Diagram
13 Integrated UML
14 UI / Database / Software Design Plan

15 Project Proposal
16 System Analysis Document
17 Project Design & Showcase
```

---

# 7. ผลลัพธ์การเรียนรู้ปลายทาง

เมื่อจบรายวิชา ผู้เรียนควรสามารถ:

1. อธิบายหลักการวิเคราะห์และออกแบบระบบเชิงวัตถุได้
2. วิเคราะห์ปัญหาและความต้องการทางธุรกิจได้
3. รวบรวมข้อมูลจากผู้ใช้งานด้วยวิธีที่เหมาะสมได้
4. ระบุ Actor และ Use Case ได้
5. เขียน Use Case Description ได้
6. สร้าง Activity Diagram ได้
7. วิเคราะห์ Class และ Object ได้
8. สร้าง Class Diagram และกำหนด Relationship ได้
9. สร้าง Sequence Diagram ได้
10. ตรวจสอบความสอดคล้องของแบบจำลอง UML ได้
11. เชื่อมโยง UML กับ UI และฐานข้อมูลเบื้องต้นได้
12. ประยุกต์กระบวนการวิเคราะห์และออกแบบระบบกับโครงงานจริงได้
13. ทำงานเป็นทีมและนำเสนอผลงานด้านการวิเคราะห์และออกแบบระบบได้

---

# 8. แนวทางการจัดการเรียนการสอนแต่ละสัปดาห์

แนะนำโครงสร้างเวลา **1-2-2** โดยเน้นการบรรยายควบคู่กับการปฏิบัติ:

```text
นำเข้าสู่บทเรียน
      ↓
อธิบายแนวคิด
      ↓
ยกตัวอย่างจากระบบจริง
      ↓
สาธิตการวิเคราะห์ / UML
      ↓
นักเรียนปฏิบัติ
      ↓
ครูให้ Feedback
      ↓
ส่งใบงาน
      ↓
Reflection
```

สำหรับนักเรียน ปวช.1 ควรใช้ **กรณีศึกษาที่ใกล้ตัว** เช่น ร้านอาหาร ร้านค้า ห้องสมุด หอพัก โรงเรียน หรือระบบยืม-คืนอุปกรณ์ เพื่อให้เข้าใจแนวคิดเชิงนามธรรมของ OOAD ได้ง่ายขึ้น

---

# 9. Project-Based Learning: ชิ้นงานเดียวตลอดภาค

เพื่อไม่ให้ผู้เรียนรู้สึกว่าแต่ละใบงานแยกจากกัน ให้กำหนดกติกาว่า:

> **“ทุกใบงานตั้งแต่สัปดาห์ที่ 1 เป็นต้นไป จะเป็นส่วนหนึ่งของระบบเดียวกัน”**

ตัวอย่าง:

```text
สัปดาห์ 1
เลือก "ระบบจัดการหอพัก"
        ↓
สัปดาห์ 2
สัมภาษณ์ผู้ดูแลหอพัก
        ↓
สัปดาห์ 3
ได้ Requirements
        ↓
สัปดาห์ 5
สร้าง Use Case
        ↓
สัปดาห์ 7
สร้าง Activity
        ↓
สัปดาห์ 10
สร้าง Class
        ↓
สัปดาห์ 12
สร้าง Sequence
        ↓
สัปดาห์ 14
ออกแบบ UI + Database
        ↓
สัปดาห์ 16–17
จัดทำโครงงานสมบูรณ์
```

แนวทางนี้ช่วยให้ผู้เรียนเห็นภาพว่า **UML ไม่ใช่การวาดแผนภาพแยก ๆ แต่เป็นเครื่องมือในการอธิบายและออกแบบระบบเดียวกันจากมุมมองที่แตกต่างกัน**

---

# 10. สรุปภาพรวมรายวิชา

```text
                    OOAD
                     │
        ┌────────────┴────────────┐
        │                         │
   BUSINESS                  OBJECT-ORIENTED
   ANALYSIS                     ANALYSIS
        │                         │
   Problem                     Object
   Stakeholder                 Class
   Requirement                 Attribute
   Fact-Finding                Method
        │                         │
        └────────────┬────────────┘
                     │
                    UML
                     │
       ┌─────────────┼─────────────┐
       │             │             │
   Use Case       Activity       Class
       │             │             │
       └─────────────┼─────────────┘
                     │
                  Sequence
                     │
                     ↓
                System Design
                     │
          ┌──────────┼──────────┐
          │          │          │
         UI       Database   Technology
          │          │          │
          └──────────┼──────────┘
                     ↓
              Project Showcase
```

**เป้าหมายสำคัญของรายวิชา:**  
ผู้เรียนไม่ได้เพียง “วาด UML ได้” แต่ต้องสามารถ **วิเคราะห์ปัญหา → เข้าใจความต้องการ → สร้างแบบจำลอง → ตรวจสอบความสอดคล้อง → ออกแบบระบบ และอธิบายแนวทางนำไปพัฒนาซอฟต์แวร์ได้**
