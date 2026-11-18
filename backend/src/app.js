const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { minioClient, ensureBucket } = require("./minioClient");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Ensure 'assets' bucket exists
ensureBucket("assets");

function fixAssetUrl(url) {
  if (!url || typeof url !== "string") return url;
  const idx = url.indexOf("/assets/");
  if (idx !== -1) {
    const filePart = url.substring(idx + 8);
    return `https://kruboss-classroom.loeitech.ac.th/assets/${filePart}`;
  }
  return url;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ==========================================
// 0. UPLOAD FLOW (MinIO Integration)
// ==========================================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    const bucketName = "assets";
    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const metaData = {
      "Content-Type": req.file.mimetype,
    };

    await minioClient.putObject(
      bucketName,
      fileName,
      req.file.buffer,
      req.file.size,
      metaData,
    );

    const publicBase =
      process.env.PUBLIC_STORAGE_URL || process.env.MINIO_PUBLIC_URL;
    let url;
    if (publicBase) {
      let base = publicBase.replace(/\/$/, "");
      if (base.startsWith("https://") && base.includes(":9000")) {
        base = base.replace(":9000", "");
      }
      url = base.endsWith(`/${bucketName}`)
        ? `${base}/${fileName}`
        : `${base}/${bucketName}/${fileName}`;
    } else {
      url = `/${bucketName}/${fileName}`;
    }

    res.json({ success: true, url });
  } catch (err) {
    console.error("MinIO upload error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error uploading file to MinIO" });
  }
});

// ==========================================
// 1. LOGIN FLOW (ระบบล็อคอินเดิม)
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  const rawUsername = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "").trim();
  const isBossAlias =
    rawUsername.toLowerCase() === "boss" || rawUsername === "ครูบอส";
  const username = isBossAlias ? "boss" : rawUsername;

  try {
    let student = await prisma.user.findUnique({
      where: { studentId: username },
    });

    // Auto-seed teacher 'boss' if missing in DB
    if (!student && isBossAlias) {
      const defaultHashedPassword = await bcrypt.hash(password || "100147", 10);
      student = await prisma.user.create({
        data: {
          studentId: "boss",
          name: "ครูบอส",
          password: defaultHashedPassword,
          role: "teacher",
          classroom: "teacher_room",
          avatar: "/Me.png",
          equippedFrame: "/img/frame/Teacher.png",
          courseIds: ["31901-2007", "31901-2012", "21901-2012", "21901-2007"],
          coins: 9999,
          quote: "อาจารย์ผู้สอน",
        },
      });
    }

    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "ไม่พบรหัสนักศึกษาในระบบ" });
    }

    if (student.password) {
      const isBcryptHash = /^\$2[aby]\$/.test(student.password);
      let isMatch = false;

      if (isBcryptHash) {
        isMatch = await bcrypt.compare(password, student.password);
      } else {
        // Support plain-text password in DB and auto-upgrade to bcrypt hash
        isMatch = password === student.password;
        if (isMatch) {
          const upgradedHash = await bcrypt.hash(password, 10);
          await prisma.user.update({
            where: { studentId: student.studentId },
            data: { password: upgradedHash },
          });
        }
      }

      // Fallback for teacher 'boss' default password ('100147')
      if (!isMatch && isBossAlias && password === "100147") {
        const bossHash = await bcrypt.hash("100147", 10);
        await prisma.user.update({
          where: { studentId: "boss" },
          data: { password: bossHash },
        });
        isMatch = true;
      }

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      if (isBossAlias && password) {
        // Auto-initialize password for 'boss' if password was null in DB
        const bossHash = await bcrypt.hash(password, 10);
        student = await prisma.user.update({
          where: { studentId: "boss" },
          data: { password: bossHash },
        });
      } else {
        if (!password) {
          return res.status(400).json({
            success: false,
            requireSetup: true,
            message: "กรุณาตั้งรหัสผ่านก่อนเข้าใช้งาน",
          });
        }
        return res.status(400).json({
          success: false,
          requireSetup: true,
          message: "กรุณาตั้งรหัสผ่านก่อนเข้าใช้งาน",
        });
      }
    }

    const token = jwt.sign(
      { id: student.studentId, role: student.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: student.studentId,
        studentId: student.studentId,
        role: student.role,
        name: student.name,
        classroom: student.classroom,
        courseIds: student.courseIds,
        avatar: student.avatar,
        equippedFrame: student.equippedFrame,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ตั้งรหัสผ่านครั้งแรก
app.post("/api/auth/setup-password", async (req, res) => {
  const { studentId, newPassword } = req.body;
  try {
    const student = await prisma.user.findUnique({ where: { studentId } });
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "ไม่พบรหัสนักศึกษา" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedStudent = await prisma.user.update({
      where: { studentId },
      data: { password: hashedPassword },
    });

    const token = jwt.sign(
      { id: updatedStudent.studentId, role: updatedStudent.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: updatedStudent.studentId,
        studentId: updatedStudent.studentId,
        role: updatedStudent.role,
        name: updatedStudent.name,
        classroom: updatedStudent.classroom,
        courseIds: updatedStudent.courseIds,
        avatar: updatedStudent.avatar,
        equippedFrame: updatedStudent.equippedFrame,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ขอรีเซ็ตรหัสผ่าน
app.post("/api/auth/request-reset", async (req, res) => {
  const { studentId } = req.body;
  try {
    const existing = await prisma.passwordReset.findFirst({
      where: { studentId, status: "pending" },
    });

    if (!existing) {
      await prisma.passwordReset.create({
        data: { studentId },
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ดึงรายการขอรีเซ็ตรหัสผ่านทั้งหมด (เฉพาะ pending)
app.get("/api/auth/requests", async (req, res) => {
  try {
    const requests = await prisma.passwordReset.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// อนุมัติการขอรีเซ็ตรหัสผ่าน
app.post("/api/auth/requests/:id/approve", async (req, res) => {
  try {
    const resetReq = await prisma.passwordReset.update({
      where: { id: req.params.id },
      data: { status: "approved" },
    });

    // เคลียร์รหัสผ่านเก่า
    await prisma.user.update({
      where: { studentId: resetReq.studentId },
      data: { password: null },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ปฏิเสธการขอรีเซ็ตรหัสผ่าน
app.post("/api/auth/requests/:id/reject", async (req, res) => {
  try {
    await prisma.passwordReset.update({
      where: { id: req.params.id },
      data: { status: "rejected" },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2. STUDENT MANAGEMENT FLOW (เพิ่มผู้ใช้โฟลว์เดิม)
// ==========================================

app.get("/api/students", async (req, res) => {
  try {
    const students = await prisma.user.findMany();
    const cleaned = students.map((s) => ({
      ...s,
      avatar: fixAssetUrl(s.avatar),
      equippedFrame: fixAssetUrl(s.equippedFrame),
    }));
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  const { courseIds, courseId, classroom, studentId, name, role } = req.body;

  if (!studentId || !name) {
    return res
      .status(400)
      .json({ error: "กรุณากรอกรหัสนักศึกษาและชื่อ-นามสกุล" });
  }

  let targetCourseIds = [];
  if (Array.isArray(courseIds) && courseIds.length > 0) {
    targetCourseIds = [...new Set(courseIds)];
  } else if (courseId) {
    targetCourseIds = [courseId];
  } else {
    targetCourseIds = ["31901-2007"];
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { studentId: studentId.trim() },
    });

    if (existing) {
      const mergedCourseIds = [
        ...new Set([...(existing.courseIds || []), ...targetCourseIds]),
      ];
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name.trim() || existing.name,
          classroom: classroom || existing.classroom,
          courseIds: mergedCourseIds,
          role: role && role !== "นักศึกษา" ? role : existing.role,
        },
      });
      return res.json(updated);
    }

    // Helper function for Avatar (from getAvatarInitial)
    const getAvatarInitial = (n) => {
      if (!n) return "น";
      const cleaned = n
        .replace(/^(นาย|นางสาว|นาง|ว่าที่ร้อยตรี|ด\.ช\.|ด\.ญ\.)\s*/, "")
        .trim();
      return cleaned.charAt(0) || n.charAt(0) || "น";
    };

    const newStudent = await prisma.user.create({
      data: {
        studentId: studentId.trim(),
        name: name.trim(),
        classroom: classroom || "ปวส.1/1",
        courseIds: targetCourseIds,
        role: role || "นักศึกษา",
        avatar: "/placeholder_profile.png",
        coins: 100,
      },
    });

    // Demote previous president
    if (role === "หัวหน้าห้อง") {
      await prisma.user.updateMany({
        where: {
          classroom: newStudent.classroom,
          role: "หัวหน้าห้อง",
          id: { not: newStudent.id },
        },
        data: { role: "นักศึกษา" },
      });
    }

    res.json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  const idParam = String(req.params.id || "").trim();
  try {
    let target = await prisma.user.findUnique({
      where: { studentId: idParam },
    });
    if (
      !target &&
      !isNaN(Number(idParam)) &&
      Number(idParam) > 0 &&
      Number(idParam) <= 2147483647
    ) {
      target = await prisma.user.findUnique({
        where: { id: parseInt(idParam) },
      });
    }
    if (!target) {
      return res.status(404).json({ error: "ไม่พบข้อมูลนักศึกษา" });
    }

    const fields = req.body;
    if (fields.role === "หัวหน้าห้อง") {
      const cls = fields.classroom || target.classroom;
      await prisma.user.updateMany({
        where: { classroom: cls, role: "หัวหน้าห้อง", id: { not: target.id } },
        data: { role: "นักศึกษา" },
      });
    }

    // Remove 'id' if exists in fields to avoid updating PK
    delete fields.id;

    const updated = await prisma.user.update({
      where: { id: target.id },
      data: fields,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  const idParam = String(req.params.id || "").trim();
  try {
    let target = await prisma.user.findUnique({
      where: { studentId: idParam },
    });
    if (
      !target &&
      !isNaN(Number(idParam)) &&
      Number(idParam) > 0 &&
      Number(idParam) <= 2147483647
    ) {
      target = await prisma.user.findUnique({
        where: { id: parseInt(idParam) },
      });
    }
    if (!target) {
      return res.status(404).json({ error: "ไม่พบข้อมูลนักศึกษา" });
    }
    const deleted = await prisma.user.delete({
      where: { id: target.id },
    });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. SHOP & INVENTORY FLOW
// ==========================================

// Get all direct shop items
app.get("/api/shop/direct", async (req, res) => {
  try {
    const items = await prisma.directShopItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    const cleaned = items.map((it) => ({
      ...it,
      image: fixAssetUrl(it.image),
    }));
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/shop/direct", async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.isSale; // Field not in DB

    const newItem = await prisma.directShopItem.create({
      data: payload,
    });
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const handleDirectUpdate = async (req, res) => {
  try {
    const targetId =
      req.query.id || req.body?.id || req.params[0] || req.params.id;
    if (!targetId) {
      return res.status(400).json({ error: "Missing item id" });
    }
    const payload = { ...req.body };
    delete payload.isSale;
    delete payload.id;

    let item = await prisma.directShopItem.findUnique({
      where: { id: targetId },
    });
    if (!item) {
      try {
        item = await prisma.directShopItem.findUnique({
          where: { id: decodeURIComponent(targetId) },
        });
      } catch (e) {}
    }
    if (!item) {
      item = await prisma.directShopItem.findFirst({
        where: { image: targetId },
      });
    }
    if (!item) {
      const parts = targetId.split("/");
      const filename = parts[parts.length - 1];
      if (filename) {
        item = await prisma.directShopItem.findFirst({
          where: {
            OR: [
              { id: { contains: filename } },
              { image: { contains: filename } },
            ],
          },
        });
      }
    }

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updated = await prisma.directShopItem.update({
      where: { id: item.id },
      data: payload,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating direct item:", err);
    res.status(500).json({ error: err.message });
  }
};

app.put("/api/shop/direct", handleDirectUpdate);
app.put("/api/shop/direct/:id", handleDirectUpdate);

const handleDirectDelete = async (req, res) => {
  try {
    const targetId = req.query.id || req.body?.id || req.params.id;
    if (!targetId) {
      return res.status(400).json({ error: "Missing item id" });
    }

    let item = await prisma.directShopItem.findUnique({
      where: { id: targetId },
    });
    if (!item) {
      try {
        item = await prisma.directShopItem.findUnique({
          where: { id: decodeURIComponent(targetId) },
        });
      } catch (e) {}
    }
    if (!item) {
      item = await prisma.directShopItem.findFirst({
        where: { image: targetId },
      });
    }
    if (!item) {
      const parts = targetId.split("/");
      const filename = parts[parts.length - 1];
      if (filename) {
        item = await prisma.directShopItem.findFirst({
          where: {
            OR: [
              { id: { contains: filename } },
              { image: { contains: filename } },
            ],
          },
        });
      }
    }

    if (!item) {
      return res.status(404).json({ error: "Item not found to delete" });
    }

    await prisma.directShopItem.delete({
      where: { id: item.id },
    });
    res.json({ success: true, deletedId: item.id });
  } catch (err) {
    console.error("Error deleting direct item:", err);
    res.status(500).json({ error: err.message });
  }
};

app.delete("/api/shop/direct", handleDirectDelete);
app.delete("/api/shop/direct/:id", handleDirectDelete);

// Buy an item (direct shop)
app.post("/api/shop/buy", async (req, res) => {
  const { studentId, itemId } = req.body;
  try {
    const student = await prisma.user.findUnique({ where: { studentId } });
    const item = await prisma.directShopItem.findUnique({
      where: { id: itemId },
    });

    if (!student || !item) {
      return res.status(404).json({ error: "User or item not found" });
    }
    if (student.coins < item.price) {
      return res.status(400).json({ error: "Not enough coins" });
    }

    // Deduct coins and add to inventory in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const updatedStudent = await prisma.user.update({
        where: { studentId },
        data: { coins: { decrement: item.price } },
      });

      // Upsert inventory item (increase count if exists)
      const inventoryItem = await prisma.inventoryItem.upsert({
        where: {
          studentId_itemId: { studentId, itemId },
        },
        update: {
          count: { increment: 1 },
          lastObtainedAt: new Date(),
        },
        create: {
          studentId,
          itemId,
          itemData: item,
          boxName: "Direct Shop",
          count: 1,
        },
      });

      return { updatedStudent, inventoryItem };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to inventory (for Gacha or other rewards)
app.post("/api/inventory/add", async (req, res) => {
  const { studentId, itemId, item, boxName, boxId } = req.body;
  try {
    const inventoryItem = await prisma.inventoryItem.upsert({
      where: {
        studentId_itemId: { studentId, itemId },
      },
      update: {
        count: { increment: 1 },
        lastObtainedAt: new Date(),
      },
      create: {
        studentId,
        itemId,
        itemData: item,
        boxName,
        boxId,
        count: 1,
      },
    });
    res.json(inventoryItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user inventory
app.get("/api/inventory/:studentId", async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { obtainedAt: "desc" },
    });
    const cleaned = inventory.map((inv) => {
      if (inv.itemData && typeof inv.itemData === "object") {
        return {
          ...inv,
          itemData: {
            ...inv.itemData,
            image: fixAssetUrl(inv.itemData.image),
          },
        };
      }
      return inv;
    });
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Equip an item
app.post("/api/inventory/equip", async (req, res) => {
  const { studentId, itemType, item } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { studentId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let equipment = user.equipment || { frame: null, pet: null, theme: null };
    if (typeof equipment === "string") {
      try {
        equipment = JSON.parse(equipment);
      } catch (e) {}
    }

    if (itemType === "frame") {
      equipment.frame = item;
    } else if (itemType === "pet") {
      equipment.pet = item;
    } else if (itemType === "theme") {
      equipment.theme = item;
    }

    const dataToUpdate = { equipment };
    if (itemType === "frame") {
      dataToUpdate.equippedFrame = item ? item.image : null;
    }

    const updated = await prisma.user.update({
      where: { studentId },
      data: dataToUpdate,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. Quests (ระบบภารกิจ)
// ==========================================

// Get all quests
app.get("/api/quests", async (req, res) => {
  try {
    const quests = await prisma.quest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update quest
app.post("/api/quests", async (req, res) => {
  try {
    const { id, title, description, rewards, maxCompletions, isActive } =
      req.body;
    const quest = await prisma.quest.upsert({
      where: { id },
      update: { title, description, rewards, maxCompletions, isActive },
      create: { id, title, description, rewards, maxCompletions, isActive },
    });
    res.json(quest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete quest
app.delete("/api/quests/:id", async (req, res) => {
  try {
    await prisma.quest.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all quest progress (for teachers and grading modal)
app.get("/api/quests/progress", async (req, res) => {
  try {
    const progress = await prisma.questProgress.findMany();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quest progress for a student
app.get("/api/quests/progress/:studentId", async (req, res) => {
  try {
    const progress = await prisma.questProgress.findMany({
      where: { studentId: req.params.studentId },
    });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quest progress (supports direct number or atomic increment)
app.post("/api/quests/progress", async (req, res) => {
  try {
    const { studentId, questId, completions, increment } = req.body;
    let progress;
    if (increment) {
      progress = await prisma.questProgress.upsert({
        where: {
          studentId_questId: { studentId, questId },
        },
        update: { completions: { increment: 1 } },
        create: { studentId, questId, completions: 1 },
      });
    } else {
      const count = Number(completions) || 1;
      progress = await prisma.questProgress.upsert({
        where: {
          studentId_questId: { studentId, questId },
        },
        update: { completions: count },
        create: { studentId, questId, completions: count },
      });
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. Announcement (ระบบประกาศแจ้งเตือน)
// ==========================================
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    const cleaned = announcements.map((a) => ({
      ...a,
      image: fixAssetUrl(a.image),
    }));
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/announcements", async (req, res) => {
  try {
    const { image, url, isActive } = req.body;
    const newAnnouncement = await prisma.announcement.create({
      data: { image, url, isActive: isActive ?? true },
    });
    res.json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, url, isActive } = req.body;
    const updated = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: { image, url, isActive },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. MYSTERY BOXES (ระบบกล่องสุ่มกาชา)
// ==========================================
app.get("/api/shop/boxes", async (req, res) => {
  try {
    const boxes = await prisma.mysteryBox.findMany({
      orderBy: { createdAt: "asc" },
    });
    const cleaned = boxes.map((b) => ({
      ...b,
      isSale: b.isSale !== false,
      image: fixAssetUrl(b.image),
      items: Array.isArray(b.items)
        ? b.items.map((it) => ({
            ...it,
            image: fixAssetUrl(it.image),
          }))
        : b.items,
    }));
    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/shop/boxes", async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      image,
      description,
      category,
      reqRank,
      purchaseLimit,
      badge,
      items,
      isSale,
    } = req.body;
    const boxId =
      id && String(id).trim() ? String(id).trim() : `box-${Date.now()}`;
    const boxData = {
      name: name || "กล่องสุ่มใหม่",
      price: Number(price) || 0,
      image: image || "",
      description: description || "",
      category: category || "ทั่วไป",
      reqRank: reqRank || "",
      purchaseLimit: Number(purchaseLimit) || 0,
      badge: badge || "",
      items: items || [],
      isSale: isSale !== undefined ? Boolean(isSale) : true,
    };
    const box = await prisma.mysteryBox.upsert({
      where: { id: boxId },
      update: boxData,
      create: {
        id: boxId,
        ...boxData,
      },
    });
    res.json(box);
  } catch (err) {
    console.error("Failed to upsert mystery box:", err);
    res.status(500).json({ error: err.message });
  }
});

const handleBoxUpdate = async (req, res) => {
  try {
    const targetId = req.query.id || req.body?.id || req.params.id;
    if (!targetId) return res.status(400).json({ error: "Missing box id" });

    const data = { ...req.body };
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.purchaseLimit !== undefined)
      data.purchaseLimit = Number(data.purchaseLimit);
    if (data.isSale !== undefined) data.isSale = Boolean(data.isSale);
    delete data.id;

    const updated = await prisma.mysteryBox.update({
      where: { id: targetId },
      data,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.put("/api/shop/boxes", handleBoxUpdate);
app.put("/api/shop/boxes/:id", handleBoxUpdate);

const handleBoxDelete = async (req, res) => {
  try {
    const targetId = req.query.id || req.body?.id || req.params.id;
    if (!targetId) return res.status(400).json({ error: "Missing box id" });

    await prisma.mysteryBox.delete({
      where: { id: targetId },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.delete("/api/shop/boxes", handleBoxDelete);
app.delete("/api/shop/boxes/:id", handleBoxDelete);

// ==========================================
// 5. SUBMISSIONS (ระบบส่งงาน)
// ==========================================
app.get("/api/submissions/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const submissions = await prisma.submission.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            studentId: true,
            name: true,
            avatar: true,
            classroom: true,
          },
        },
      },
    });
    const sanitized = submissions.map((s) => {
      let l = s.link ? s.link.trim() : "";
      if (l && !/^https?:\/\//i.test(l)) {
        l = `https://${l}`;
      }
      let linksList = s.links;
      if (!linksList || !Array.isArray(linksList) || linksList.length === 0) {
        linksList = l ? [{ title: "", url: l }] : [];
      }
      return {
        ...s,
        link: l,
        links: linksList,
        workType: s.workType || "individual",
        members: s.members || [],
      };
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/submissions/:courseId/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const submissions = await prisma.submission.findMany({
      where: { courseId, studentId },
    });
    const sanitized = submissions.map((s) => {
      let l = s.link ? s.link.trim() : "";
      if (l && !/^https?:\/\//i.test(l)) {
        l = `https://${l}`;
      }
      let linksList = s.links;
      if (!linksList || !Array.isArray(linksList) || linksList.length === 0) {
        linksList = l ? [{ title: "", url: l }] : [];
      }
      return {
        ...s,
        link: l,
        links: linksList,
        workType: s.workType || "individual",
        members: s.members || [],
      };
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/submissions", async (req, res) => {
  try {
    let {
      courseId,
      assignmentId,
      studentId,
      link,
      links,
      workType,
      members,
      note,
      submittedAt,
    } = req.body;

    let normalizedLinks = null;
    if (Array.isArray(links) && links.length > 0) {
      normalizedLinks = links
        .map((l) => {
          if (!l) return null;
          if (typeof l === "string") {
            let u = l.trim();
            if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
            return { title: "", url: u };
          }
          let u = (l.url || "").trim();
          if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
          return { title: l.title || "", url: u };
        })
        .filter(Boolean);
    } else if (link && typeof link === "string") {
      let u = link.trim();
      if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
      normalizedLinks = [{ title: "", url: u }];
    }

    const primaryLink =
      (normalizedLinks && normalizedLinks[0]?.url) ||
      (typeof link === "string" ? link.trim() : "");
    const timeStr = submittedAt || new Date().toLocaleString("th-TH");

    const dataToSave = {
      link: primaryLink,
      links: normalizedLinks || [],
      workType: workType || "individual",
      members: Array.isArray(members) ? members : [],
      note: note || "",
      submittedAt: timeStr,
    };

    const submission = await prisma.submission.upsert({
      where: {
        courseId_assignmentId_studentId: { courseId, assignmentId, studentId },
      },
      update: dataToSave,
      create: { courseId, assignmentId, studentId, ...dataToSave },
    });
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. ASSIGNMENT SETTINGS (บันทึกรูปแบบการส่งงาน: งานเดี่ยว/คู่/กลุ่ม, รายชื่อสุ่มคู่/กลุ่ม ลงฐานข้อมูล)
// ==========================================
const DEFAULT_ASSIGNMENTS = [
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
  { courseId: "31901-2012", assignmentId: "asm-4", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 4: เวิร์กช็อปทำความสะอาดข้อมูล (Data Cleaning)" },
  { courseId: "31901-2012", assignmentId: "asm-5", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 5: ออกแบบ Sales Performance Dashboard" },

  // วิชา 21901-2007: เทคโนโลยีระบบสมองกลฝังตัวและไอโอที
  { courseId: "21901-2007", assignmentId: "asm-1", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 1: ระบบสมองกลฝังตัว & IoT และสถาปัตยกรรมบอร์ด Arduino Uno R3" },
  { courseId: "21901-2007", assignmentId: "asm-2", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 2: วงจรไฟวิ่ง 5 ดวง วิ่งวนไปเรื่อยๆ (Running LED 5 LEDs) บน Tinkercad" },
  { courseId: "21901-2007", assignmentId: "asm-3", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 3: ระบบปุ่มกดควบคุมสถานะสัญญาณเตือนภัย (Push Button, State & Buzzer Controller) บน Tinkercad" },
  { courseId: "21901-2007", assignmentId: "asm-4", workType: "individual", maxScore: 10, customDescription: "ใบงานที่ 4: การนำ State มารวมกับ For Loop ควบคุมไฟวิ่ง LED 6 ดวง ด้วยปุ่มกด 2 ปุ่ม บน Tinkercad" }
];

async function ensureDefaultAssignments() {
  if (!prisma.assignmentSetting) return;
  try {
    const count = await prisma.assignmentSetting.count();
    if (count === 0) {
      for (const asm of DEFAULT_ASSIGNMENTS) {
        await prisma.assignmentSetting.upsert({
          where: { courseId_assignmentId: { courseId: asm.courseId, assignmentId: asm.assignmentId } },
          update: {},
          create: asm
        });
      }
    }
  } catch (e) {
    // Table might not be migrated yet
  }
}

app.get("/api/assignment-settings", async (req, res) => {
  try {
    await ensureDefaultAssignments();
    const list = await prisma.assignmentSetting.findMany();
    const data = {};
    list.forEach((s) => {
      data[`${s.courseId}_${s.assignmentId}`] = s;
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("Prisma findMany assignmentSetting error:", err.message);
    const data = {};
    DEFAULT_ASSIGNMENTS.forEach(a => {
      data[`${a.courseId}_${a.assignmentId}`] = a;
    });
    res.json({ success: true, data });
  }
});

app.get("/api/assignment-settings/:courseId", async (req, res) => {
  try {
    await ensureDefaultAssignments();
    const { courseId } = req.params;
    const list = await prisma.assignmentSetting.findMany({
      where: { courseId },
    });
    const data = {};
    list.forEach((s) => {
      data[`${s.courseId}_${s.assignmentId}`] = s;
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("Prisma findMany assignmentSetting for course error:", err.message);
    const data = {};
    DEFAULT_ASSIGNMENTS.filter(a => a.courseId === req.params.courseId).forEach(a => {
      data[`${a.courseId}_${a.assignmentId}`] = a;
    });
    res.json({ success: true, data });
  }
});

app.post("/api/assignment-settings", async (req, res) => {
  try {
    const { courseId, assignmentId, settings } = req.body;
    if (!courseId || !assignmentId) {
      return res.status(400).json({
        success: false,
        error: "courseId and assignmentId are required",
      });
    }

    const payload = {
      workType: settings.workType || "individual",
      pairingMode: settings.pairingMode || "manual",
      groupingMode: settings.groupingMode || "manual",
      groupCount: Number(settings.groupCount) || 3,
      targetClassroom: settings.targetClassroom || "all",
      randomizedPairs: settings.randomizedPairs || null,
      randomizedGroups: settings.randomizedGroups || null,
      customDescription: settings.customDescription || null,
      deadline: settings.deadline || null,
      maxScore: Number(settings.maxScore) || 10,
    };

    const record = await prisma.assignmentSetting.upsert({
      where: {
        courseId_assignmentId: { courseId, assignmentId },
      },
      update: payload,
      create: {
        courseId,
        assignmentId,
        ...payload,
      },
    });

    res.json({ success: true, setting: record });
  } catch (err) {
    console.error("Prisma upsert assignmentSetting error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. ATTENDANCE & CHECK-IN (ระบบเช็คชื่อ)
// ==========================================
app.get("/api/attendance/sessions/:courseId", async (req, res) => {
  try {
    const sessions = await prisma.checkInSession.findMany({
      where: { courseId: req.params.courseId },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/attendance/session/:courseId/:week", async (req, res) => {
  try {
    const { courseId, week } = req.params;
    const session = await prisma.checkInSession.findUnique({
      where: { courseId_week: { courseId, week: parseInt(week) } },
    });
    res.json(session || { isOpen: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/attendance/session", async (req, res) => {
  try {
    const { courseId, week, isOpen, startTime, endTime } = req.body;
    const weekNum = parseInt(week);
    const session = await prisma.checkInSession.upsert({
      where: { courseId_week: { courseId, week: weekNum } },
      update: {
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && {
          endTime: endTime ? new Date(endTime) : null,
        }),
      },
      create: {
        courseId,
        week: weekNum,
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null,
      },
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/attendance/:courseId", async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { courseId: req.params.courseId },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/attendance/check-in", async (req, res) => {
  try {
    const { courseId, week, studentId, status, note, checkedAt } = req.body;
    const weekNum = parseInt(week);
    const now = new Date();
    const defaultTime =
      status === "absent"
        ? "-"
        : `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;
    const timeStr = checkedAt || defaultTime;

    const record = await prisma.attendance.upsert({
      where: {
        courseId_week_studentId: { courseId, week: weekNum, studentId },
      },
      update: { status, checkedAt: timeStr, note },
      create: {
        courseId,
        week: weekNum,
        studentId,
        status,
        checkedAt: timeStr,
        note,
      },
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/attendance/batch", async (req, res) => {
  try {
    const { courseId, week, records } = req.body;
    const weekNum = parseInt(week);
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "records must be an array" });
    }

    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;

    const results = await prisma.$transaction(
      records.map((r) =>
        prisma.attendance.upsert({
          where: {
            courseId_week_studentId: {
              courseId,
              week: weekNum,
              studentId: r.studentId,
            },
          },
          update: {
            status: r.status,
            checkedAt: r.status === "absent" ? "-" : r.checkedAt || defaultTime,
            note: r.note,
          },
          create: {
            courseId,
            week: weekNum,
            studentId: r.studentId,
            status: r.status,
            checkedAt: r.status === "absent" ? "-" : r.checkedAt || defaultTime,
            note: r.note,
          },
        }),
      ),
    );
    res.json({ success: true, count: results.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. GRADES & ACADEMIC (ระบบคะแนน & ตัดเกรด)
// ==========================================
app.get("/api/grades/:courseId", async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { courseId: req.params.courseId },
    });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/grades/:courseId/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const { responsibility, assignments, midterm, final } = req.body;

    const updateData = {};
    if (responsibility !== undefined)
      updateData.responsibility = Number(responsibility);
    if (assignments !== undefined) updateData.assignments = assignments;
    if (midterm !== undefined) updateData.midterm = Number(midterm);
    if (final !== undefined) updateData.final = Number(final);

    const grade = await prisma.grade.upsert({
      where: { courseId_studentId: { courseId, studentId } },
      update: updateData,
      create: {
        courseId,
        studentId,
        responsibility:
          responsibility !== undefined ? Number(responsibility) : 10,
        assignments: assignments || {},
        midterm: midterm !== undefined ? Number(midterm) : 0,
        final: final !== undefined ? Number(final) : 0,
      },
    });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. WEBBOARD (กระดานสนทนา)
// ==========================================
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            studentId: true,
            name: true,
            role: true,
            avatar: true,
            equippedFrame: true,
          },
        },
        comments: {
          include: {
            author: {
              select: { studentId: true, name: true, avatar: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    let { authorId, content } = req.body;
    if (!authorId || !content) {
      return res.status(400).json({ error: "Author and content are required" });
    }

    let user = await prisma.user.findUnique({
      where: { studentId: String(authorId) },
    });

    if (!user && !isNaN(Number(authorId)) && Number(authorId) > 0) {
      user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          OR: [{ studentId: "boss" }, { role: "teacher" }],
        },
      });
    }

    if (!user) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้งานในระบบ" });
    }

    const post = await prisma.post.create({
      data: { authorId: user.studentId, content },
      include: {
        author: {
          select: {
            studentId: true,
            name: true,
            role: true,
            avatar: true,
            equippedFrame: true,
          },
        },
        comments: true,
        likes: true,
      },
    });
    res.json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: { content },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const { studentId } = req.body;
    const postId = req.params.id;

    const existing = await prisma.postLike.findUnique({
      where: { postId_studentId: { postId, studentId } },
    });

    if (existing) {
      await prisma.postLike.delete({
        where: { postId_studentId: { postId, studentId } },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      return res.json({ liked: false });
    } else {
      await prisma.postLike.create({
        data: { postId, studentId },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    let { authorId, content } = req.body;
    const postId = req.params.id;
    if (!authorId || !content) {
      return res.status(400).json({ error: "Author and content are required" });
    }

    let user = await prisma.user.findUnique({
      where: { studentId: String(authorId) },
    });

    if (!user && !isNaN(Number(authorId)) && Number(authorId) > 0) {
      user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          OR: [{ studentId: "boss" }, { role: "teacher" }],
        },
      });
    }

    if (!user) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้งานในระบบ" });
    }

    const comment = await prisma.postComment.create({
      data: { postId, authorId: user.studentId, content },
      include: {
        author: {
          select: { studentId: true, name: true, avatar: true, role: true },
        },
      },
    });
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });
    res.json(comment);
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/posts/comments/:commentId", async (req, res) => {
  try {
    const comment = await prisma.postComment.delete({
      where: { id: req.params.commentId },
    });
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. GAME SCORES (มินิเกมและแบบทดสอบหลังเรียน - บันทึกลง PostgreSQL ผ่าน Prisma)
// ==========================================

// GET all game scores for a course & week
app.get("/api/game-scores/:courseId/:week", async (req, res) => {
  try {
    const { courseId, week } = req.params;
    const records = await prisma.gameScore.findMany({
      where: {
        courseId,
        week: Number(week),
      },
    });

    const weekScores = {};
    for (const item of records) {
      if (!weekScores[item.studentId]) {
        weekScores[item.studentId] = {
          courseId: item.courseId,
          week: item.week,
          studentId: item.studentId,
          scores: {},
          lastUpdated: item.submittedAt,
        };
      }
      weekScores[item.studentId].scores[item.gameId] = {
        score: item.score,
        maxScore: item.maxScore,
        submittedAt: item.submittedAt,
      };
      if (
        new Date(item.submittedAt) >
        new Date(weekScores[item.studentId].lastUpdated)
      ) {
        weekScores[item.studentId].lastUpdated = item.submittedAt;
      }
    }

    res.json({ success: true, data: weekScores });
  } catch (err) {
    console.error("Error fetching game scores from DB:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST a game score (Only allowed once per student per game)
app.post("/api/game-scores", async (req, res) => {
  try {
    const { courseId, week, studentId, gameId, score, maxScore } = req.body;
    if (
      !courseId ||
      !week ||
      !studentId ||
      !gameId ||
      score === undefined ||
      maxScore === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    // Strict rule: Single attempt only! Check if score already exists
    const existingScore = await prisma.gameScore.findUnique({
      where: {
        courseId_week_studentId_gameId: {
          courseId,
          week: Number(week),
          studentId,
          gameId,
        },
      },
    });

    if (existingScore) {
      return res.status(400).json({
        success: false,
        message:
          "คุณได้บันทึกคะแนนกิจกรรมนี้ไปแล้ว (เล่นได้ครั้งเดียวเท่านั้น)",
        existingScore: {
          score: existingScore.score,
          maxScore: existingScore.maxScore,
          submittedAt: existingScore.submittedAt,
        },
      });
    }

    const validScore = Math.min(Number(score), Number(maxScore));
    const newRecord = await prisma.gameScore.create({
      data: {
        courseId,
        week: Number(week),
        studentId,
        gameId,
        score: validScore,
        maxScore: Number(maxScore),
      },
    });

    // Query all games played by this student for this week to return the full week record
    const allStudentScoresThisWeek = await prisma.gameScore.findMany({
      where: {
        courseId,
        week: Number(week),
        studentId,
      },
    });

    const scoresMap = {};
    for (const item of allStudentScoresThisWeek) {
      scoresMap[item.gameId] = {
        score: item.score,
        maxScore: item.maxScore,
        submittedAt: item.submittedAt,
      };
    }

    const record = {
      courseId,
      week: Number(week),
      studentId,
      scores: scoresMap,
      lastUpdated: newRecord.submittedAt,
    };

    res.json({ success: true, record });
  } catch (err) {
    console.error("Error saving game score to DB:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 10.1 TEST ATTEMPTS API (Pre-test & Post-test ตรวจสอบและบันทึกลงฐานข้อมูล)
// ==========================================
const TEST_ATTEMPTS_FILE = path.join(
  __dirname,
  "..",
  "data",
  "test_attempts_db.json",
);

function ensureTestAttemptsDir() {
  const dir = path.dirname(TEST_ATTEMPTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readTestAttemptsData() {
  try {
    ensureTestAttemptsDir();
    if (!fs.existsSync(TEST_ATTEMPTS_FILE)) {
      fs.writeFileSync(TEST_ATTEMPTS_FILE, JSON.stringify({}, null, 2), "utf8");
      return {};
    }
    return JSON.parse(fs.readFileSync(TEST_ATTEMPTS_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function writeTestAttemptsData(data) {
  try {
    ensureTestAttemptsDir();
    fs.writeFileSync(TEST_ATTEMPTS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing test attempts data:", e);
  }
}

// GET /api/test-attempts/:courseId/:week - ดึงผลการสอบ Pre-test และ Post-test ทั้งสัปดาห์จากฐานข้อมูล
app.get("/api/test-attempts/:courseId/:week", async (req, res) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = Number(week);
    const fileData = readTestAttemptsData();

    let dbRecords = [];
    try {
      dbRecords = await prisma.gameScore.findMany({
        where: {
          courseId,
          week: weekNum,
          gameId: { in: ["pre-test", "quiz"] },
        },
      });
    } catch (dbErr) {
      console.warn("Prisma query test attempts warning:", dbErr.message);
    }

    const result = {};

    // 1. Populate from Prisma GameScore DB
    for (const r of dbRecords) {
      const type = r.gameId === "pre-test" ? "pre" : "post";
      const key = `${courseId}_${weekNum}_${r.studentId}_${type}`;
      result[key] = {
        courseId: r.courseId,
        week: r.week,
        studentId: r.studentId,
        type,
        score: r.score,
        maxScore: r.maxScore,
        percentage:
          r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0,
        completedAt: r.submittedAt,
        timeSpentSeconds: 0,
        source: "database",
      };
    }

    // 2. Merge with detailed test_attempts_db.json
    for (const [k, v] of Object.entries(fileData)) {
      if (v && v.courseId === courseId && Number(v.week) === weekNum) {
        result[k] = { ...result[k], ...v };
      }
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching test attempts from DB:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/test-attempts/:courseId/:week/:studentId - ตรวจสอบจากฐานข้อมูลว่านักเรียนคนนี้เคยสอบแล้วหรือไม่
app.get("/api/test-attempts/:courseId/:week/:studentId", async (req, res) => {
  try {
    const { courseId, week, studentId } = req.params;
    const weekNum = Number(week);
    const fileData = readTestAttemptsData();

    let dbRecords = [];
    try {
      dbRecords = await prisma.gameScore.findMany({
        where: {
          courseId,
          week: weekNum,
          studentId,
          gameId: { in: ["pre-test", "quiz"] },
        },
      });
    } catch (dbErr) {
      console.warn("Prisma query student test attempt warning:", dbErr.message);
    }

    let preRec = null;
    let postRec = null;

    for (const r of dbRecords) {
      const item = {
        courseId: r.courseId,
        week: r.week,
        studentId: r.studentId,
        type: r.gameId === "pre-test" ? "pre" : "post",
        score: r.score,
        maxScore: r.maxScore,
        percentage:
          r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0,
        completedAt: r.submittedAt,
        source: "database",
      };
      if (r.gameId === "pre-test") preRec = item;
      if (r.gameId === "quiz") postRec = item;
    }

    const preKey = `${courseId}_${weekNum}_${studentId}_pre`;
    const postKey = `${courseId}_${weekNum}_${studentId}_post`;
    if (fileData[preKey]) preRec = { ...preRec, ...fileData[preKey] };
    if (fileData[postKey]) postRec = { ...postRec, ...fileData[postKey] };

    res.json({
      success: true,
      hasPreTest: !!preRec,
      hasPostTest: !!postRec,
      pre: preRec,
      post: postRec,
    });
  } catch (err) {
    console.error("Error checking student test record in DB:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/test-attempts - บันทึกผลการสอบ (Pre-test หรือ Post-test) ลง Database
app.post("/api/test-attempts", async (req, res) => {
  try {
    const {
      courseId,
      week,
      studentId,
      type,
      score,
      maxScore,
      timeSpentSeconds,
      answers,
    } = req.body;
    if (!courseId || !week || !studentId || !type || score === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    const weekNum = Number(week);
    const gameId = type === "pre" ? "pre-test" : "quiz";
    const validScore = Math.min(Number(score), Number(maxScore || 10));
    const now = new Date().toISOString();

    // 1. Save or update to Prisma GameScore Database
    let dbRecord = null;
    try {
      dbRecord = await prisma.gameScore.upsert({
        where: {
          courseId_week_studentId_gameId: {
            courseId,
            week: weekNum,
            studentId,
            gameId,
          },
        },
        update: {
          score: validScore,
          maxScore: Number(maxScore || 10),
        },
        create: {
          courseId,
          week: weekNum,
          studentId,
          gameId,
          score: validScore,
          maxScore: Number(maxScore || 10),
        },
      });
    } catch (dbErr) {
      console.warn("Prisma upsert gameScore warning:", dbErr.message);
    }

    // 2. Save full detail into test_attempts_db.json
    const fileData = readTestAttemptsData();
    const key = `${courseId}_${weekNum}_${studentId}_${type}`;
    const record = {
      courseId,
      week: weekNum,
      studentId,
      type,
      score: validScore,
      maxScore: Number(maxScore || 10),
      percentage: Math.round((validScore / Number(maxScore || 10)) * 100),
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      answers: answers || {},
      completedAt: dbRecord?.submittedAt || now,
      source: "database",
    };
    fileData[key] = record;
    writeTestAttemptsData(fileData);

    res.json({ success: true, record });
  } catch (err) {
    console.error("Error saving test attempt to DB:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 11. ARCADE SCORES & LEADERBOARD (บันทึกคะแนนรวมทั้งระบบ และกระดาน 10 อันดับ)
// ==========================================
const ARCADE_DATA_FILE = path.join(__dirname, "..", "data", "arcade_db.json");

function ensureArcadeDataDir() {
  const dir = path.dirname(ARCADE_DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readArcadeData() {
  try {
    ensureArcadeDataDir();
    if (!fs.existsSync(ARCADE_DATA_FILE)) {
      const initial = { scores: [], resetHistory: [] };
      fs.writeFileSync(
        ARCADE_DATA_FILE,
        JSON.stringify(initial, null, 2),
        "utf8",
      );
      return initial;
    }
    const raw = fs.readFileSync(ARCADE_DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading arcade data file:", e);
    return { scores: [], resetHistory: [] };
  }
}

function writeArcadeData(data) {
  try {
    ensureArcadeDataDir();
    fs.writeFileSync(ARCADE_DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing arcade data file:", e);
  }
}

// GET /api/arcade/all - ดึงคะแนนและประวัติรีเซ็ตทั้งหมด
app.get("/api/arcade/all", async (req, res) => {
  try {
    const data = readArcadeData();
    res.json({
      success: true,
      scores: data.scores || [],
      resetHistory: data.resetHistory || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/arcade/score - บันทึกคะแนนใหม่ (อัปเดตสถิติสูงสุดสัปดาห์/ตลอดกาลอัตโนมัติ)
app.post("/api/arcade/score", async (req, res) => {
  try {
    const {
      gameId,
      studentId,
      studentName,
      classroom,
      avatar,
      score,
      weekKey,
    } = req.body;
    if (!gameId || !studentId || score === undefined || !weekKey) {
      return res
        .status(400)
        .json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    const numScore = Math.max(0, parseInt(score, 10) || 0);
    const data = readArcadeData();
    if (!data.scores) data.scores = [];

    // ค้นหาเรคคอร์ดเดิมของนักเรียนคนนี้ในเกมนี้และสัปดาห์นี้
    const existingIdx = data.scores.findIndex(
      (s) =>
        s.gameId === gameId &&
        s.studentId === studentId &&
        s.weekKey === weekKey,
    );
    let isNewWeeklyBest = false;

    if (existingIdx !== -1) {
      const prev = data.scores[existingIdx];
      if (numScore > prev.score) {
        prev.score = numScore;
        prev.submittedAt = new Date().toISOString();
        isNewWeeklyBest = true;
      }
      // อัปเดตข้อมูลนักเรียนให้ทันสมัย
      if (studentName) prev.studentName = studentName;
      if (classroom) prev.classroom = classroom;
      if (avatar) prev.avatar = avatar;
    } else {
      isNewWeeklyBest = numScore > 0;
      data.scores.push({
        gameId,
        studentId,
        studentName: studentName || "นักศึกษา",
        classroom: classroom || "",
        avatar: avatar || null,
        score: numScore,
        weekKey,
        submittedAt: new Date().toISOString(),
      });
    }

    writeArcadeData(data);
    res.json({ success: true, isNewWeeklyBest, score: numScore });
  } catch (err) {
    console.error("Error recording arcade score:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/arcade/reset-week - รีเซ็ตสัปดาห์และแจกเหรียญ (เฉพาะครู)
app.post("/api/arcade/reset-week", async (req, res) => {
  try {
    const { teacherName, weekKey, winners, totalCoinsAwarded } = req.body;
    const data = readArcadeData();
    if (!data.resetHistory) data.resetHistory = [];

    const logEntry = {
      id: "reset-" + Date.now(),
      weekKey,
      distributedBy: teacherName || "คุณครู",
      totalCoinsAwarded: totalCoinsAwarded || 0,
      winners: winners || [],
      resetAt: new Date().toISOString(),
    };

    data.resetHistory.unshift(logEntry);
    writeArcadeData(data);
    res.json({ success: true, log: logEntry });
  } catch (err) {
    console.error("Error resetting arcade week:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 12. QUESTION BANK API (คลังข้อสอบกลาง Pre-test / Post-test / Quiz)
// ==========================================
const QUESTIONS_DATA_FILE = path.join(
  __dirname,
  "..",
  "data",
  "questions_db.json",
);

function ensureQuestionsDataDir() {
  const dir = path.dirname(QUESTIONS_DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readQuestionsData() {
  try {
    ensureQuestionsDataDir();
    if (!fs.existsSync(QUESTIONS_DATA_FILE)) {
      const initial = [];
      fs.writeFileSync(
        QUESTIONS_DATA_FILE,
        JSON.stringify(initial, null, 2),
        "utf8",
      );
      return initial;
    }
    const raw = fs.readFileSync(QUESTIONS_DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading questions data file:", e);
    return [];
  }
}

function writeQuestionsData(questions) {
  try {
    ensureQuestionsDataDir();
    fs.writeFileSync(
      QUESTIONS_DATA_FILE,
      JSON.stringify(questions, null, 2),
      "utf8",
    );
  } catch (e) {
    console.error("Error writing questions data file:", e);
  }
}

// GET /api/questions - ดึงข้อสอบตามวิชา และ/หรือ สัปดาห์
app.get("/api/questions", async (req, res) => {
  try {
    const { courseId, week } = req.query;
    let questions = [];

    // 1. ลองดึงจาก Prisma Database ก่อน
    if (prisma.question) {
      try {
        const whereClause = {};
        if (courseId) whereClause.courseId = courseId;
        if (week) whereClause.week = Number(week);

        questions = await prisma.question.findMany({
          where: whereClause,
          include: { options: true },
          orderBy: { createdAt: "asc" },
        });
      } catch (pErr) {
        questions = [];
      }
    }

    // 2. ถ้าใน DB ยังไม่มีหรือออฟไลน์ ให้ใช้ฐานข้อมูลไฟล์ JSON กลาง (Fallback)
    if (!questions || questions.length === 0) {
      questions = readQuestionsData();
      if (courseId) {
        questions = questions.filter(
          (q) => String(q.courseId) === String(courseId),
        );
      }
      if (week) {
        questions = questions.filter((q) => Number(q.week) === Number(week));
      }
    }

    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/questions - เพิ่มข้อสอบใหม่ 1 ข้อ
app.post("/api/questions", async (req, res) => {
  try {
    const { courseId, week, type, question, options, score, explanation } =
      req.body;
    if (!question || !courseId || !week) {
      return res
        .status(400)
        .json({ success: false, message: "ข้อมูลข้อสอบไม่ครบถ้วน" });
    }

    const newId = `qb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const formattedOptions = (Array.isArray(options) ? options : []).map(
      (opt, idx) => ({
        id: opt.id || String.fromCharCode(97 + idx),
        text: opt.text || "",
        isCorrect: !!opt.isCorrect,
      }),
    );

    const newQuestionObj = {
      id: newId,
      courseId,
      week: Number(week),
      type: type || "choice",
      question: question.trim(),
      options: formattedOptions,
      score: Number(score) || 1,
      explanation: explanation || "",
      createdAt: new Date().toISOString(),
    };

    // บันทึกลง Prisma Database
    if (prisma.question) {
      try {
        await prisma.question.create({
          data: {
            id: newId,
            courseId,
            week: Number(week),
            type: type || "choice",
            question: question.trim(),
            score: Number(score) || 1,
            explanation: explanation || "",
            options: {
              create: formattedOptions.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            },
          },
        });
      } catch (pErr) {}
    }

    // บันทึกลงฐานข้อมูลไฟล์ JSON กลางเสมอ
    const allQuestions = readQuestionsData();
    allQuestions.push(newQuestionObj);
    writeQuestionsData(allQuestions);

    res.json({ success: true, question: newQuestionObj });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/questions/bulk - นำเข้าข้อสอบเป็นชุด (Bulk Import)
app.post("/api/questions/bulk", async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ไม่มีข้อมูลข้อสอบสำหรับนำเข้า" });
    }

    const fileQuestions = readQuestionsData();
    const imported = [];

    for (const q of questions) {
      const qId =
        q.id ||
        `qb-${Date.now()}-${imported.length}-${Math.random().toString(36).substring(2, 6)}`;
      const formattedOptions = (Array.isArray(q.options) ? q.options : []).map(
        (opt, idx) => ({
          id: opt.id || String.fromCharCode(97 + idx),
          text: opt.text || "",
          isCorrect: !!opt.isCorrect,
        }),
      );

      const qObj = {
        id: qId,
        courseId: q.courseId,
        week: Number(q.week) || 1,
        type: q.type || "choice",
        question: String(q.question || "").trim(),
        options: formattedOptions,
        score: Number(q.score) || 1,
        explanation: q.explanation || "",
        createdAt: q.createdAt || new Date().toISOString(),
      };

      // บันทึก/อัปเดตลง Prisma Database
      if (prisma.question) {
        try {
          await prisma.question.upsert({
            where: { id: qId },
            update: {
              courseId: qObj.courseId,
              week: qObj.week,
              question: qObj.question,
              score: qObj.score,
              explanation: qObj.explanation,
            },
            create: {
              id: qId,
              courseId: qObj.courseId,
              week: qObj.week,
              type: qObj.type,
              question: qObj.question,
              score: qObj.score,
              explanation: qObj.explanation,
              options: {
                create: formattedOptions.map((opt) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                })),
              },
            },
          });
        } catch (pErr) {}
      }

      // ซิงค์ลงฐานข้อมูลไฟล์ JSON กลาง
      const existingIdx = fileQuestions.findIndex((item) => item.id === qId);
      if (existingIdx !== -1) {
        fileQuestions[existingIdx] = qObj;
      } else {
        fileQuestions.push(qObj);
      }
      imported.push(qObj);
    }

    writeQuestionsData(fileQuestions);
    res.json({ success: true, count: imported.length, questions: imported });
  } catch (err) {
    console.error("Error bulk importing questions:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/questions/:id - แก้ไขข้อสอบ
app.put("/api/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const allQuestions = readQuestionsData();
    const idx = allQuestions.findIndex((q) => q.id === id);

    if (idx !== -1) {
      allQuestions[idx] = {
        ...allQuestions[idx],
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      writeQuestionsData(allQuestions);
    }

    if (prisma.question) {
      try {
        await prisma.question.update({
          where: { id },
          data: {
            courseId: updated.courseId,
            week: updated.week ? Number(updated.week) : undefined,
            question: updated.question,
            score: updated.score ? Number(updated.score) : undefined,
            explanation: updated.explanation,
          },
        });
      } catch (pErr) {}
    }

    res.json({ success: true, message: "แก้ไขข้อสอบเรียบร้อย" });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/questions/:id - ลบข้อสอบ
app.delete("/api/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allQuestions = readQuestionsData();
    const filtered = allQuestions.filter((q) => q.id !== id);
    writeQuestionsData(filtered);

    if (prisma.question) {
      try {
        await prisma.question.delete({ where: { id } });
      } catch (pErr) {}
    }

    res.json({ success: true, message: "ลบข้อสอบเรียบร้อย" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
