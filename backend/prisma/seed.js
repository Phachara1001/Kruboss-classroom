const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // สร้างรหัสผ่านที่ถูกเข้ารหัส
  const hashedPassword = await bcrypt.hash("100147", 10);

  // เพิ่มครูบอส (ถ้ายังไม่มี)
  const boss = await prisma.user.upsert({
    where: { studentId: "boss" },
    update: {},
    create: {
      studentId: "boss",
      name: "ครูบอส",
      password: hashedPassword,
      role: "teacher",
      classroom: "teacher_room",
      avatar: "/Me.png",
      equippedFrame: "/img/frame/Teacher.png",
      courseIds: ["31901-2007", "31901-2012", "21901-2012", "21900-1004"],
      coins: 9999,
      quote: "อาจารย์ผู้สอน",
    },
  });

  console.log("✅ Seed completed: ", boss.name);

  // ข้อมูลตั้งต้นของใบงานทุกสัปดาห์ในระบบ
  const defaultAssignments = [
    // วิชา 31901-2007: เทคโนโลยีการจัดการฐานข้อมูล
    { courseId: "31901-2007", assignmentId: "asm-1", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 1: สำรวจปัญหาแฟ้มข้อมูล การเลือก DBMS และเริ่มต้น Supabase Cloud" },
    { courseId: "31901-2007", assignmentId: "asm-2", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 2: การออกแบบ Relational Schema และกำหนดชนิดข้อมูล คีย์หลัก และข้อกำหนดใน Supabase" },
    { courseId: "31901-2007", assignmentId: "asm-3", workType: "pair", maxScore: 10, pairingMode: "auto", customDescription: "ใบงานที่ 3: ปฏิบัติการจัดการและสืบค้นข้อมูลในตาราง Product ด้วยคำสั่ง SQL (10 ข้อ)" },
    { courseId: "31901-2007", assignmentId: "asm-4", workType: "pair", maxScore: 10, pairingMode: "auto", customDescription: "ใบงานที่ 4: การออกแบบความสัมพันธ์ของข้อมูลและ Cardinality (One-to-One, One-to-Many, Many-to-One, Many-to-Many)" },
    { courseId: "31901-2007", assignmentId: "asm-5", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 5: ปฏิบัติการสร้างฐานข้อมูลเชิงสัมพันธ์ (Relational Database) และสืบค้นข้ามตารางใน Supabase" },

    // วิชา 21901-2012: การพัฒนาระบบร่วมกันด้วยแพลตฟอร์ม
    { courseId: "21901-2012", assignmentId: "asm-1", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 1: สรุปหลักการ DevOps และวงจรการพัฒนาซอฟต์แวร์" },
    { courseId: "21901-2012", assignmentId: "asm-2", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 2: งานระบบควบคุมเวอร์ชัน (Version Control System)" },
    { courseId: "21901-2012", assignmentId: "asm-3", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 3: การเริ่มต้นสร้าง Git Repository, กำหนด .gitignore และบันทึกประวัติด้วย Commit" },
    { courseId: "21901-2012", assignmentId: "asm-4", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 4: การทำงานแบบ Branching และ Pull Request" },
    { courseId: "21901-2012", assignmentId: "asm-5", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 5: การสร้างและจัดการ Docker Container" },

    // วิชา 31901-2012: การวิเคราะห์และนำเสนอข้อมูล
    { courseId: "31901-2012", assignmentId: "asm-1", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 1: การสำรวจบทบาท Data Analyst และการขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making)" },
    { courseId: "31901-2012", assignmentId: "asm-2", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 2: การวิเคราะห์และวางแผนเก็บรวบรวมข้อมูลเพื่อพัฒนาองค์กร (Data Collection for Organizational Development)" },
    { courseId: "31901-2012", assignmentId: "asm-3", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 3: ปฏิบัติการตรวจสอบคุณภาพข้อมูลและช่วยกัน Clean ชุดข้อมูลองค์กร 500 แถว (Data Quality & Data Wrangling Workshop)" },
    { courseId: "31901-2012", assignmentId: "asm-4", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 4: ปฏิบัติการวิเคราะห์เชิงสถิติและสรุปข้อมูลแบบมีเงื่อนไข (Summary Statistics & Conditional Aggregations)" },
    { courseId: "31901-2012", assignmentId: "asm-5", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 5: ออกแบบ Sales Performance Dashboard" },

    // วิชา 21901-2007: เทคโนโลยีระบบสมองกลฝังตัวและไอโอที
    { courseId: "21901-2007", assignmentId: "asm-1", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 1: ระบบสมองกลฝังตัว & IoT และสถาปัตยกรรมบอร์ด Arduino Uno R3" },
    { courseId: "21901-2007", assignmentId: "asm-2", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 2: วงจรไฟวิ่ง 5 ดวง วิ่งวนไปเรื่อยๆ (Running LED 5 LEDs) บน Tinkercad" },
    { courseId: "21901-2007", assignmentId: "asm-3", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 3: ระบบปุ่มกดควบคุมสถานะสัญญาณเตือนภัย (Push Button, State & Buzzer Controller) บน Tinkercad" },
    { courseId: "21901-2007", assignmentId: "asm-4", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 4: การนำ State มารวมกับ For Loop ควบคุมไฟวิ่ง LED 6 ดวง ด้วยปุ่มกด 2 ปุ่ม บน Tinkercad" }
  ];

  for (const asm of defaultAssignments) {
    await prisma.assignmentSetting.upsert({
      where: {
        courseId_assignmentId: {
          courseId: asm.courseId,
          assignmentId: asm.assignmentId
        }
      },
      update: {},
      create: asm
    });
  }

  console.log(`✅ Seeded ${defaultAssignments.length} assignment settings into database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
