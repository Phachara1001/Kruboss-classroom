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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
