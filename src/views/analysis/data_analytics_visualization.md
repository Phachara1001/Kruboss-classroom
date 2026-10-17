# แผนการจัดการเรียนรู้: Data Analytics & Data Visualization (15 สัปดาห์)

---

## 1. ภาพรวมแผนการสอน 15 สัปดาห์ (Course Overview)

| สัปดาห์ | หัวข้อเนื้อหา | กิจกรรม / ชิ้นงาน |
| :---: | :--- | :--- |
| **1** | Introduction to Data Analytics & Data Visualization | รู้จัก Data Analyst / Workflow / ตัวอย่างการใช้ข้อมูลเพื่อการตัดสินใจ |
| **2** | Data Collection & Data Types | วิเคราะห์ Dataset และจำแนกประเภทข้อมูล |
| **3** | Data Quality | ตรวจสอบ Accuracy, Completeness, Consistency, Timeliness, Duplicate |
| **4** | Data Cleaning & Preparation | ทำความสะอาดข้อมูลด้วย Excel / Google Sheets |
| **5** | Data Analysis & Descriptive Statistics | คำนวณ SUM, AVERAGE, COUNT, %, MIN/MAX, สร้าง Pivot Table |
| **6** | Data Analysis & Finding Insight | วิเคราะห์แนวโน้ม การเปรียบเทียบ ความสัมพันธ์ และตอบคำถามจากข้อมูล |
| **7** | **สอบกลางภาค (Practical Test)** | ให้ Dataset $\rightarrow$ ตรวจสอบ $\rightarrow$ วิเคราะห์ $\rightarrow$ สรุปผล |
| **8** | Principles of Data Visualization | หลักการเลือกกราฟและ Chart ให้เหมาะสมกับรูปแบบข้อมูล |
| **9** | Data Visualization Workshop | สร้างกราฟจาก Dataset จริงและเขียนอธิบาย Insight |
| **10** | Dashboard Design | KPI, Chart, Filter, Layout และการจัดลำดับข้อมูล (Power BI) |
| **11** | User / Audience & UX | วิเคราะห์ผู้ชม $\rightarrow$ ทำความเข้าใจความต้องการ $\rightarrow$ ออกแบบ Dashboard |
| **12** | Forecasting / Calculation | การคาดการณ์ แนวโน้ม และการนำข้อมูลไปช่วยตัดสินใจทางธุรกิจ |
| **13** | Data Storytelling | เปลี่ยนข้อมูล $\rightarrow$ Insight $\rightarrow$ Story $\rightarrow$ Recommendation |
| **14** | Final Project Workshop | พัฒนา Dashboard + วิเคราะห์เชิงลึก + เตรียมนำเสนอ |
| **15** | **สอบปลายภาค (Final Presentation)** | นำเสนอ Data Visualization Project รายกลุ่ม/เดี่ยว |

---

## 2. รายละเอียดการเรียนการสอนแบ่งตาม 3 เฟส (Phases of Learning)

```
[ Phase 1: Data Analysis ] ──> [ สัปดาห์ 7: กลางภาค ] ──> [ Phase 2: Data Visualization ] ──> [ Phase 3: Data Storytelling ] ──> [ สัปดาห์ 15: ปลายภาค ]
```

---

### PHASE 1 — DATA ANALYSIS (สัปดาห์ที่ 1–6)
> **เป้าหมายหลัก:** ผู้เรียนต้องตอบให้ได้ว่า **“ข้อมูลนี้มีคุณภาพไหม และข้อมูลกำลังบอกอะไรเรา?”**

*ข้อแนะนำ: ช่วงนี้เน้นการเตรียมและการจัดการข้อมูล ยังไม่ต้องรีบสอนเครื่องมือ Dashboard ซับซ้อน*

#### ลำดับกระบวนการเรียนรู้ (Workflow)
$$\text{Data Collection} \longrightarrow \text{Data Quality} \longrightarrow \text{Data Cleaning} \longrightarrow \text{Data Preparation} \longrightarrow \text{Data Analysis} \longrightarrow \text{Insight}$$

#### รายละเอียดรายสัปดาห์
* **สัปดาห์ที่ 1: Introduction to Data Analytics & Data Visualization**
  * บทบาทของ Data Analyst และ Data Workflow
  * Case Study ตัวอย่างการขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making)
* **สัปดาห์ที่ 2: Data Collection & Data Types**
  * การสำรวจโครงสร้างและจำแนกประเภทข้อมูล (Numerical, Categorical, Time Series)
* **สัปดาห์ที่ 3: Data Quality**
  * ตรวจสอบ 5 มิติข้อมูล: Accuracy (ความถูกต้อง), Completeness (ความครบถ้วน), Consistency (ความสอดคล้อง), Timeliness (ความเป็นปัจจุบัน), Duplicate (ความซ้ำซ้อน)
* **สัปดาห์ที่ 4: Data Cleaning & Preparation**
  * เวิร์กช็อปทำความสะอาดข้อมูลด้วย Excel หรือ Google Sheets (จัดการช่องว่าง, จัด Format, แยกข้อความ)
* **สัปดาห์ที่ 5: Data Analysis & Descriptive Statistics**
  * สถิติเบื้องต้นและการสรุปผล: SUM, AVERAGE, COUNT, %, MIN/MAX และการสรุปข้อมูลด้วย Pivot Table
* **สัปดาห์ที่ 6: Data Analysis & Finding Insight**
  * การวิเคราะห์แนวโน้ม (Trends), การเปรียบเทียบ (Comparison) และความสัมพันธ์ (Correlation) เพื่อตอบโจทย์ธุรกิจ

---

### สัปดาห์ที่ 7 — สอบกลางภาค (Midterm Practical Exam)
> **รูปแบบ:** ข้อสอบปฏิบัติจริง (Practical Exam) แทนการสอบข้อเขียนบรรยาย เพื่อวัดสมรรถนะจริง

* **โจทย์:** แจกไฟล์ Dataset เช่น `sales_data.csv` (ขนาดประมาณ 300–500 records) ให้ทำภายในเวลาที่กำหนด
* **Part 1 — Data Quality:** ตรวจหา Missing Value, Duplicate, รูปแบบข้อมูลผิดปกติ (Format error), ข้อมูลไม่สมเหตุสมผล
* **Part 2 — Data Cleaning:** แก้ไขและปรับปรุง Dataset ให้พร้อมใช้งาน
* **Part 3 — Data Analysis:** ตอบคำถามธุรกิจ 5 ข้อ เช่น:
  1. สินค้าใดมียอดขายดีที่สุด?
  2. เดือนใดมียอดขายสูงที่สุดในรอบปี?
  3. จังหวัดหรือภูมิภาคใดสร้างยอดขายได้สูงที่สุด?
  4. ค่าเฉลี่ยยอดขายต่อรายการ (Average Order Value) เป็นเท่าไร?
  5. ทิศทางหรือแนวโน้มของยอดขายโดยรวมเป็นอย่างไร?
* **Part 4 — Executive Summary Report:** เขียนสรุปวิเคราะห์ข้อมูลประมาณ 1 หน้ากระดาษ (*“จากการวิเคราะห์ข้อมูล พบว่า...”*)

---

### PHASE 2 — DATA VISUALIZATION & DASHBOARD (สัปดาห์ที่ 8–12)
> **เป้าหมายหลัก:** เปลี่ยนจาก **“ข้อมูลบอกอะไร?”** เป็น **“เราจะสื่อสารสิ่งที่ข้อมูลบอกอย่างไรให้เข้าใจง่ายและตรงจุด?”**

* **สัปดาห์ที่ 8: Principles of Data Visualization**
  * เรียนรู้ประเภทของชาร์ต: Bar, Column, Line, Area, Pie/Donut, Scatter Plot, KPI Card, Table, Map
  * **Core Concept:** อย่าสอนแค่วิธีคลิกสร้างกราฟ แต่ต้องตอบได้ว่า **“คำถามนี้ควรใช้กราฟอะไร เพราะอะไร?”**
    * *ต้องการเปรียบเทียบยอดขายแต่ละสินค้า* $\rightarrow$ Bar Chart
    * *ต้องการดูแนวโน้มยอดขายรอบ 12 เดือน* $\rightarrow$ Line Chart
    * *ต้องการดูความสัมพันธ์ระหว่างสองตัวแปร* $\rightarrow$ Scatter Plot
* **สัปดาห์ที่ 9: Visualization Workshop**
  * แจก Dataset เดียวกันทั้งห้อง
  * โจทย์: สร้าง Visualization 5 รูปแบบเพื่อค้นหา Insight (ยอดขายตามเดือน, สินค้าขายดี, ยอดตามประเภทสินค้า, ยอดตามพื้นที่, KPI รวม)
  * **Key Requirement:** นักศึกษาต้องเขียนระบุใต้กราฟทุกรูปว่า **“Insight ที่ค้นพบคืออะไร?”** (เพื่อตระหนักว่า **Chart $\neq$ Insight**)
* **สัปดาห์ที่ 10: Dashboard Design (Power BI)**
  * แนะนำกระบวนการ: $\text{Dataset} \rightarrow \text{Data Model} \rightarrow \text{Calculation (DAX/Measures)} \rightarrow \text{Chart} \rightarrow \text{Dashboard}$
  * เวิร์กช็อปสร้าง One-Page Dashboard ตัวอย่าง Layout:
    ```
    ┌────────────────────────────────────────────────────────┐
    │                  SALES PERFORMANCE                     │
    ├──────────────┬──────────────┬──────────────┬───────────┤
    │ Revenue (KPI)│ Orders (KPI) │ Avg. (KPI)   │ Growth(%) │
    ├──────────────┴──────────────┴──────────────┴───────────┤
    │                                                        │
    │                      Sales Trend                       │
    │                                                        │
    ├──────────────────────────────┬─────────────────────────┤
    │         Top Products         │     Sales by Region     │
    │                              │                         │
    └──────────────────────────────┴─────────────────────────┘
    ```
* **สัปดาห์ที่ 11: User / Audience + UX for Dashboard**
  * ทำความเข้าใจผู้ใช้งาน: Dashboard เดียวกัน ไม่จำเป็นต้องออกแบบเหมือนกัน
    * *เจ้าของร้าน (Executive):* สนใจภาพรวม กำไร ยอดขาย สินค้าขายดี และแนวโน้ม
    * *พนักงานคลังสินค้า (Operations):* สนใจ Stock สินค้าคงเหลือ สินค้าใกล้หมด สินค้าที่หมุนเวียนเร็ว
  * **ใบงาน: “รู้จักผู้ชมของฉัน (Know My Audience)”** ระบุ 5 ข้อ:
    1. ผู้ใช้งานคือใคร?
    2. ผู้ใช้งานต้องการรู้อะไร?
    3. ต้องใช้ข้อมูลอะไรบ้าง?
    4. ข้อมูลอะไรที่ไม่จำเป็นต้องใส่?
    5. ผู้ใช้ต้องการนำข้อมูลนี้ไปตัดสินใจเรื่องอะไร?
* **สัปดาห์ที่ 12: Forecasting & Decision Making**
  * เน้นการคำนวณและคาดการณ์พื้นฐานเพื่อการนำไปใช้จริง (ไม่จำเป็นต้องลงลึกถึง Advanced ML)
  * สำรวจคำถาม: ยอดขายย้อนหลัง 6 เดือนเป็นอย่างไร? หากแนวโน้มยังเป็นแบบเดิม เดือนถัดไปจะเป็นเท่าใด?
  * เชื่อมโยงบริบท: $\text{Data} \longrightarrow \text{Prediction} \longrightarrow \text{Decision}$

---

### PHASE 3 — DATA STORYTELLING & FINAL PROJECT (สัปดาห์ที่ 13–15)

* **สัปดาห์ที่ 13: Data Storytelling Framework**
  * กรอบแนวคิด 5 ขั้นตอน:
    1. **Situation:** เกิดอะไรขึ้นในปัจจุบัน?
    2. **Problem:** ปัญหาหรือความท้าทายคืออะไร?
    3. **Data:** ข้อมูลเชิงประจักษ์บ่งชี้อะไร?
    4. **Insight:** สิ่งสำคัญที่ค้นพบคืออะไร?
    5. **Recommendation:** ข้อเสนอแนะเชิงกลยุทธ์ที่ควรทำต่อไปคืออะไร?
  * *ตัวอย่าง:*
    $$\text{ยอดขายกาแฟลดลง 3 เดือน} \rightarrow \text{ลูกค้าช่วงบ่ายลดลง} \rightarrow \text{เมนูเย็นยอดขายตกมาก} \rightarrow \text{กลุ่มเป้าหมายคือนักเรียน} \rightarrow \text{จัดโปรโมชันบ่าย 1-4 โมง}$$
* **สัปดาห์ที่ 14: Final Project Workshop**
  * พัฒนาโปรเจกต์หัวข้อ: **“Data Visualization for Decision Making”**
  * เลือก Dataset ตามความสนใจ (ยอดขาย, ข้อมูลนักเรียน, ร้านกาแฟ, การใช้ห้องเรียน, การยืมหนังสือห้องสมุด, สั่งอาหาร, ค้าขายออนไลน์, สต็อกสินค้า)
  * **องค์ประกอบที่ต้องส่งมอบ (Deliverables):**
    1. Dataset (ข้อมูลดิบ)
    2. Data Quality Report (รายงานตรวจสอบคุณภาพข้อมูล)
    3. Clean Dataset (ข้อมูลหลังการคลีน)
    4. Data Analysis (การคำนวณและวิเคราะห์)
    5. Visualization (อย่างน้อย 4–6 รูปแบบ)
    6. Dashboard (Dashboard หน้าเดียวที่สมบูรณ์)
    7. Insight (ข้อค้นพบสำคัญอย่างน้อย 3 ข้อ)
    8. Recommendation (ข้อเสนอแนะเชิงการตัดสินใจ 2–3 ข้อ)
    9. Presentation (สไลด์สำหรับนำเสนอ 5–7 นาที)

---

### สัปดาห์ที่ 15 — สอบปลายภาค (Final Presentation & Assessment)
* **รูปแบบการนำเสนอ:** กลุ่มละ 5–7 นาที
* **โครงสร้างเวลาการนำเสนอ (Agenda):**
  * **นาทีที่ 1:** ปัญหาและบริบท (Problem & Context)
  * **นาทีที่ 2:** แหล่งที่มาและโครงสร้างข้อมูล (Dataset)
  * **นาทีที่ 3:** การวิเคราะห์ข้อมูล (Analysis)
  * **นาทีที่ 4–5:** การสาธิต Dashboard และ Interaction (2 นาที)
  * **นาทีที่ 6:** ข้อค้นพบสำคัญ (Insight)
  * **นาทีที่ 7:** ข้อเสนอแนะเพื่อการตัดสินใจ (Recommendation)
* **ช่วง Q&A จากผู้สอน (2–3 คำถามเพื่อประเมินความเข้าใจจริง):**
  * *“ทำไมถึงเลือกใช้กราฟประเภทนี้ในการนำเสนอข้อมูลส่วนนี้?”*
  * *“หากมีข้อมูลเพิ่มขึ้นอีก 1 ปี Dashboard หน้านี้จำเป็นต้องปรับปรุงส่วนใดบ้าง?”*
  * *“Insight ข้อนี้จะส่งผลต่อการตัดสินใจเชิงปฏิบัติการจริงอย่างไร?”*

---

## 3. สัดส่วนการวัดและประเมินผล (Grading Criteria)

| รายการประเมิน | สัดส่วนคะแนน (%) |
| :--- | :---: |
| ใบงาน / Workshop ในชั้นเรียน | 15% |
| งาน Data Quality & Data Cleaning | 10% |
| งาน Data Analysis | 10% |
| สอบกลางภาค (Practical Exam) | 20% |
| ชิ้นงาน Visualization & Dashboard | 10% |
| ชิ้นงาน UX / Audience Analysis | 5% |
| เอกสารและผลงาน Final Project | 15% |
| การนำเสนอ Final Presentation ปลายภาค | 15% |
| **รวมทั้งหมด** | **100%** |