const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { minioClient, ensureBucket } = require('./minioClient');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Ensure 'assets' bucket exists
ensureBucket('assets');

function fixAssetUrl(url) {
    if (!url || typeof url !== 'string') return url;
    const idx = url.indexOf('/assets/');
    if (idx !== -1) {
        const filePart = url.substring(idx + 8);
        return `https://kruboss-classroom.loeitech.ac.th/assets/${filePart}`;
    }
    return url;
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

// ==========================================
// 0. UPLOAD FLOW (MinIO Integration)
// ==========================================
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        const bucketName = 'assets';
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;
        const metaData = {
            'Content-Type': req.file.mimetype,
        };

        await minioClient.putObject(bucketName, fileName, req.file.buffer, req.file.size, metaData);

        const publicBase = process.env.PUBLIC_STORAGE_URL || process.env.MINIO_PUBLIC_URL;
        let url;
        if (publicBase) {
            let base = publicBase.replace(/\/$/, '');
            if (base.startsWith('https://') && base.includes(':9000')) {
                base = base.replace(':9000', '');
            }
            url = base.endsWith(`/${bucketName}`) ? `${base}/${fileName}` : `${base}/${bucketName}/${fileName}`;
        } else {
            url = `/${bucketName}/${fileName}`;
        }

        res.json({ success: true, url });
    } catch (err) {
        console.error('MinIO upload error:', err);
        res.status(500).json({ success: false, message: 'Error uploading file to MinIO' });
    }
});

// ==========================================
// 1. LOGIN FLOW (ระบบล็อคอินเดิม)
// ==========================================

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;


    try {
        // Student login logic
        const student = await prisma.user.findUnique({ where: { studentId: username } });
        
        if (!student) {
            return res.status(400).json({ success: false, message: 'ไม่พบรหัสนักศึกษาในระบบ' });
        }

        if (student.password) {
            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
            }
        } else {
            if (!password) {
                return res.status(400).json({ success: false, requireSetup: true, message: 'กรุณาตั้งรหัสผ่านก่อนเข้าใช้งาน' });
            }
            return res.status(400).json({ success: false, message: 'กรุณาตั้งรหัสผ่านให้เรียบร้อย' });
        }

        const token = jwt.sign({ id: student.studentId, role: student.role }, JWT_SECRET, { expiresIn: '1d' });
        
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
                equippedFrame: student.equippedFrame 
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ตั้งรหัสผ่านครั้งแรก
app.post('/api/auth/setup-password', async (req, res) => {
    const { studentId, newPassword } = req.body;
    try {
        const student = await prisma.user.findUnique({ where: { studentId } });
        if (!student) {
            return res.status(400).json({ success: false, message: 'ไม่พบรหัสนักศึกษา' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedStudent = await prisma.user.update({
            where: { studentId },
            data: { password: hashedPassword }
        });

        const token = jwt.sign({ id: updatedStudent.studentId, role: updatedStudent.role }, JWT_SECRET, { expiresIn: '1d' });

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
                equippedFrame: updatedStudent.equippedFrame 
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// ขอรีเซ็ตรหัสผ่าน
app.post('/api/auth/request-reset', async (req, res) => {
    const { studentId } = req.body;
    try {
        const existing = await prisma.passwordReset.findFirst({
            where: { studentId, status: 'pending' }
        });

        if (!existing) {
            await prisma.passwordReset.create({
                data: { studentId }
            });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ดึงรายการขอรีเซ็ตรหัสผ่านทั้งหมด (เฉพาะ pending)
app.get('/api/auth/requests', async (req, res) => {
    try {
        const requests = await prisma.passwordReset.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// อนุมัติการขอรีเซ็ตรหัสผ่าน
app.post('/api/auth/requests/:id/approve', async (req, res) => {
    try {
        const resetReq = await prisma.passwordReset.update({
            where: { id: req.params.id },
            data: { status: 'approved' }
        });
        
        // เคลียร์รหัสผ่านเก่า
        await prisma.user.update({
            where: { studentId: resetReq.studentId },
            data: { password: null }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ปฏิเสธการขอรีเซ็ตรหัสผ่าน
app.post('/api/auth/requests/:id/reject', async (req, res) => {
    try {
        await prisma.passwordReset.update({
            where: { id: req.params.id },
            data: { status: 'rejected' }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 2. STUDENT MANAGEMENT FLOW (เพิ่มผู้ใช้โฟลว์เดิม)
// ==========================================

app.get('/api/students', async (req, res) => {
    try {
        const students = await prisma.user.findMany();
        const cleaned = students.map(s => ({
            ...s,
            avatar: fixAssetUrl(s.avatar),
            equippedFrame: fixAssetUrl(s.equippedFrame)
        }));
        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    const { courseIds, courseId, classroom, studentId, name, role } = req.body;
    
    if (!studentId || !name) {
        return res.status(400).json({ error: 'กรุณากรอกรหัสนักศึกษาและชื่อ-นามสกุล' });
    }

    let targetCourseIds = [];
    if (Array.isArray(courseIds) && courseIds.length > 0) {
        targetCourseIds = [...new Set(courseIds)];
    } else if (courseId) {
        targetCourseIds = [courseId];
    } else {
        targetCourseIds = ['31901-2007'];
    }

    try {
        const existing = await prisma.user.findUnique({
            where: { studentId: studentId.trim() }
        });

        if (existing) {
            const mergedCourseIds = [...new Set([...(existing.courseIds || []), ...targetCourseIds])];
            const updated = await prisma.user.update({
                where: { id: existing.id },
                data: {
                    name: name.trim() || existing.name,
                    classroom: classroom || existing.classroom,
                    courseIds: mergedCourseIds,
                    role: role && role !== 'นักศึกษา' ? role : existing.role
                }
            });
            return res.json(updated);
        }

        // Helper function for Avatar (from getAvatarInitial)
        const getAvatarInitial = (n) => {
            if (!n) return 'น';
            const cleaned = n.replace(/^(นาย|นางสาว|นาง|ว่าที่ร้อยตรี|ด\.ช\.|ด\.ญ\.)\s*/, '').trim();
            return cleaned.charAt(0) || n.charAt(0) || 'น';
        };

        const newStudent = await prisma.user.create({
            data: {
                studentId: studentId.trim(),
                name: name.trim(),
                classroom: classroom || 'ปวส.1/1',
                courseIds: targetCourseIds,
                role: role || 'นักศึกษา',
                avatar: getAvatarInitial(name.trim()),
                coins: 100,
            }
        });

        // Demote previous president
        if (role === 'หัวหน้าห้อง') {
            await prisma.user.updateMany({
                where: { classroom: newStudent.classroom, role: 'หัวหน้าห้อง', id: { not: newStudent.id } },
                data: { role: 'นักศึกษา' }
            });
        }

        res.json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const idParam = String(req.params.id || '').trim();
    try {
        let target = await prisma.user.findUnique({ where: { studentId: idParam } });
        if (!target && !isNaN(Number(idParam)) && Number(idParam) > 0 && Number(idParam) <= 2147483647) {
            target = await prisma.user.findUnique({ where: { id: parseInt(idParam) } });
        }
        if (!target) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลนักศึกษา' });
        }

        const fields = req.body;
        if (fields.role === 'หัวหน้าห้อง') {
            const cls = fields.classroom || target.classroom;
            await prisma.user.updateMany({
                where: { classroom: cls, role: 'หัวหน้าห้อง', id: { not: target.id } },
                data: { role: 'นักศึกษา' }
            });
        }
        
        // Remove 'id' if exists in fields to avoid updating PK
        delete fields.id;

        const updated = await prisma.user.update({
            where: { id: target.id },
            data: fields
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const idParam = String(req.params.id || '').trim();
    try {
        let target = await prisma.user.findUnique({ where: { studentId: idParam } });
        if (!target && !isNaN(Number(idParam)) && Number(idParam) > 0 && Number(idParam) <= 2147483647) {
            target = await prisma.user.findUnique({ where: { id: parseInt(idParam) } });
        }
        if (!target) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลนักศึกษา' });
        }
        const deleted = await prisma.user.delete({
            where: { id: target.id }
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
app.get('/api/shop/direct', async (req, res) => {
    try {
        const items = await prisma.directShopItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const cleaned = items.map(it => ({
            ...it,
            image: fixAssetUrl(it.image)
        }));
        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shop/direct', async (req, res) => {
    try {
        const payload = { ...req.body };
        delete payload.isSale; // Field not in DB
        
        const newItem = await prisma.directShopItem.create({
            data: payload
        });
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/shop/direct/:id', async (req, res) => {
    try {
        const payload = { ...req.body };
        delete payload.isSale; // Field not in DB

        const updated = await prisma.directShopItem.update({
            where: { id: req.params.id },
            data: payload
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete direct shop item
app.delete('/api/shop/direct/:id', async (req, res) => {
    try {
        await prisma.directShopItem.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buy an item (direct shop)
app.post('/api/shop/buy', async (req, res) => {
    const { studentId, itemId } = req.body;
    try {
        const student = await prisma.user.findUnique({ where: { studentId } });
        const item = await prisma.directShopItem.findUnique({ where: { id: itemId } });

        if (!student || !item) {
            return res.status(404).json({ error: 'User or item not found' });
        }
        if (student.coins < item.price) {
            return res.status(400).json({ error: 'Not enough coins' });
        }

        // Deduct coins and add to inventory in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            const updatedStudent = await prisma.user.update({
                where: { studentId },
                data: { coins: { decrement: item.price } }
            });

            // Upsert inventory item (increase count if exists)
            const inventoryItem = await prisma.inventoryItem.upsert({
                where: {
                    studentId_itemId: { studentId, itemId }
                },
                update: {
                    count: { increment: 1 },
                    lastObtainedAt: new Date()
                },
                create: {
                    studentId,
                    itemId,
                    itemData: item,
                    boxName: 'Direct Shop',
                    count: 1
                }
            });

            return { updatedStudent, inventoryItem };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add item to inventory (for Gacha or other rewards)
app.post('/api/inventory/add', async (req, res) => {
    const { studentId, itemId, item, boxName, boxId } = req.body;
    try {
        const inventoryItem = await prisma.inventoryItem.upsert({
            where: {
                studentId_itemId: { studentId, itemId }
            },
            update: {
                count: { increment: 1 },
                lastObtainedAt: new Date()
            },
            create: {
                studentId,
                itemId,
                itemData: item,
                boxName,
                boxId,
                count: 1
            }
        });
        res.json(inventoryItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user inventory
app.get('/api/inventory/:studentId', async (req, res) => {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            where: { studentId: req.params.studentId },
            orderBy: { obtainedAt: 'desc' }
        });
        const cleaned = inventory.map(inv => {
            if (inv.itemData && typeof inv.itemData === 'object') {
                return {
                    ...inv,
                    itemData: {
                        ...inv.itemData,
                        image: fixAssetUrl(inv.itemData.image)
                    }
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
app.post('/api/inventory/equip', async (req, res) => {
    const { studentId, itemType, item } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { studentId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        let equipment = user.equipment || { frame: null, pet: null, theme: null };
        if (typeof equipment === 'string') {
            try { equipment = JSON.parse(equipment); } catch(e) {}
        }
        
        if (itemType === 'frame') {
            equipment.frame = item;
        } else if (itemType === 'pet') {
            equipment.pet = item;
        } else if (itemType === 'theme') {
            equipment.theme = item;
        }

        const dataToUpdate = { equipment };
        if (itemType === 'frame') {
            dataToUpdate.equippedFrame = item ? item.image : null;
        }

        const updated = await prisma.user.update({
            where: { studentId },
            data: dataToUpdate
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
app.get('/api/quests', async (req, res) => {
    try {
        const quests = await prisma.quest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(quests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create or update quest
app.post('/api/quests', async (req, res) => {
    try {
        const { id, title, description, rewards, maxCompletions, isActive } = req.body;
        const quest = await prisma.quest.upsert({
            where: { id },
            update: { title, description, rewards, maxCompletions, isActive },
            create: { id, title, description, rewards, maxCompletions, isActive }
        });
        res.json(quest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete quest
app.delete('/api/quests/:id', async (req, res) => {
    try {
        await prisma.quest.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get quest progress for a student
app.get('/api/quests/progress/:studentId', async (req, res) => {
    try {
        const progress = await prisma.questProgress.findMany({
            where: { studentId: req.params.studentId }
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update quest progress
app.post('/api/quests/progress', async (req, res) => {
    try {
        const { studentId, questId, completions } = req.body;
        const progress = await prisma.questProgress.upsert({
            where: {
                studentId_questId: { studentId, questId }
            },
            update: { completions },
            create: { studentId, questId, completions }
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 8. Announcement (ระบบประกาศแจ้งเตือน)
// ==========================================
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const cleaned = announcements.map(a => ({
            ...a,
            image: fixAssetUrl(a.image)
        }));
        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/announcements', async (req, res) => {
    try {
        const { image, url, isActive } = req.body;
        const newAnnouncement = await prisma.announcement.create({
            data: { image, url, isActive: isActive ?? true }
        });
        res.json(newAnnouncement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { image, url, isActive } = req.body;
        const updated = await prisma.announcement.update({
            where: { id: parseInt(id) },
            data: { image, url, isActive }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.announcement.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. MYSTERY BOXES (ระบบกล่องสุ่มกาชา)
// ==========================================
app.get('/api/shop/boxes', async (req, res) => {
    try {
        const boxes = await prisma.mysteryBox.findMany({
            orderBy: { createdAt: 'asc' }
        });
        const cleaned = boxes.map(b => ({
            ...b,
            image: fixAssetUrl(b.image),
            items: Array.isArray(b.items) ? b.items.map(it => ({
                ...it,
                image: fixAssetUrl(it.image)
            })) : b.items
        }));
        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shop/boxes', async (req, res) => {
    try {
        const { id, name, price, image, description, category, reqRank, purchaseLimit, badge, items } = req.body;
        const boxId = (id && String(id).trim()) ? String(id).trim() : `box-${Date.now()}`;
        const box = await prisma.mysteryBox.upsert({
            where: { id: boxId },
            update: { 
                name: name || 'กล่องสุ่มใหม่', 
                price: Number(price) || 0, 
                image: image || '', 
                description: description || '', 
                category: category || 'ทั่วไป', 
                reqRank: reqRank || '', 
                purchaseLimit: Number(purchaseLimit) || 0, 
                badge: badge || '', 
                items: items || [] 
            },
            create: { 
                id: boxId, 
                name: name || 'กล่องสุ่มใหม่', 
                price: Number(price) || 0, 
                image: image || '', 
                description: description || '', 
                category: category || 'ทั่วไป', 
                reqRank: reqRank || '', 
                purchaseLimit: Number(purchaseLimit) || 0, 
                badge: badge || '', 
                items: items || [] 
            }
        });
        res.json(box);
    } catch (err) {
        console.error('Failed to upsert mystery box:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/shop/boxes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        if (data.price !== undefined) data.price = Number(data.price);
        if (data.purchaseLimit !== undefined) data.purchaseLimit = Number(data.purchaseLimit);
        delete data.id;

        const updated = await prisma.mysteryBox.update({
            where: { id },
            data
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/shop/boxes/:id', async (req, res) => {
    try {
        await prisma.mysteryBox.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. SUBMISSIONS (ระบบส่งงาน)
// ==========================================
app.get('/api/submissions/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const submissions = await prisma.submission.findMany({
            where: { courseId },
            include: {
                student: { select: { studentId: true, name: true, avatar: true, classroom: true } }
            }
        });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/submissions/:courseId/:studentId', async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const submissions = await prisma.submission.findMany({
            where: { courseId, studentId }
        });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/submissions', async (req, res) => {
    try {
        const { courseId, assignmentId, studentId, link, note, submittedAt } = req.body;
        const timeStr = submittedAt || new Date().toLocaleString("th-TH");
        const submission = await prisma.submission.upsert({
            where: {
                courseId_assignmentId_studentId: { courseId, assignmentId, studentId }
            },
            update: { link, note, submittedAt: timeStr },
            create: { courseId, assignmentId, studentId, link, note, submittedAt: timeStr }
        });
        res.json({ success: true, submission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 7. ATTENDANCE & CHECK-IN (ระบบเช็คชื่อ)
// ==========================================
app.get('/api/attendance/sessions/:courseId', async (req, res) => {
    try {
        const sessions = await prisma.checkInSession.findMany({
            where: { courseId: req.params.courseId }
        });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance/session/:courseId/:week', async (req, res) => {
    try {
        const { courseId, week } = req.params;
        const session = await prisma.checkInSession.findUnique({
            where: { courseId_week: { courseId, week: parseInt(week) } }
        });
        res.json(session || { isOpen: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance/session', async (req, res) => {
    try {
        const { courseId, week, isOpen, startTime, endTime } = req.body;
        const weekNum = parseInt(week);
        const session = await prisma.checkInSession.upsert({
            where: { courseId_week: { courseId, week: weekNum } },
            update: {
                isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
                ...(startTime && { startTime: new Date(startTime) }),
                ...(endTime !== undefined && { endTime: endTime ? new Date(endTime) : null })
            },
            create: {
                courseId,
                week: weekNum,
                isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
                startTime: startTime ? new Date(startTime) : new Date(),
                endTime: endTime ? new Date(endTime) : null
            }
        });
        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance/:courseId', async (req, res) => {
    try {
        const records = await prisma.attendance.findMany({
            where: { courseId: req.params.courseId }
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance/check-in', async (req, res) => {
    try {
        const { courseId, week, studentId, status, note, checkedAt } = req.body;
        const weekNum = parseInt(week);
        const now = new Date();
        const defaultTime = status === 'absent' ? '-' : `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;
        const timeStr = checkedAt || defaultTime;

        const record = await prisma.attendance.upsert({
            where: { courseId_week_studentId: { courseId, week: weekNum, studentId } },
            update: { status, checkedAt: timeStr, note },
            create: { courseId, week: weekNum, studentId, status, checkedAt: timeStr, note }
        });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance/batch', async (req, res) => {
    try {
        const { courseId, week, records } = req.body;
        const weekNum = parseInt(week);
        if (!Array.isArray(records)) {
            return res.status(400).json({ error: 'records must be an array' });
        }

        const now = new Date();
        const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;

        const results = await prisma.$transaction(
            records.map(r => prisma.attendance.upsert({
                where: { courseId_week_studentId: { courseId, week: weekNum, studentId: r.studentId } },
                update: { status: r.status, checkedAt: r.status === 'absent' ? '-' : (r.checkedAt || defaultTime), note: r.note },
                create: { courseId, week: weekNum, studentId: r.studentId, status: r.status, checkedAt: r.status === 'absent' ? '-' : (r.checkedAt || defaultTime), note: r.note }
            }))
        );
        res.json({ success: true, count: results.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 8. GRADES & ACADEMIC (ระบบคะแนน & ตัดเกรด)
// ==========================================
app.get('/api/grades/:courseId', async (req, res) => {
    try {
        const grades = await prisma.grade.findMany({
            where: { courseId: req.params.courseId }
        });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/grades/:courseId/:studentId', async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const { responsibility, assignments, midterm, final } = req.body;

        const updateData = {};
        if (responsibility !== undefined) updateData.responsibility = Number(responsibility);
        if (assignments !== undefined) updateData.assignments = assignments;
        if (midterm !== undefined) updateData.midterm = Number(midterm);
        if (final !== undefined) updateData.final = Number(final);

        const grade = await prisma.grade.upsert({
            where: { courseId_studentId: { courseId, studentId } },
            update: updateData,
            create: {
                courseId,
                studentId,
                responsibility: responsibility !== undefined ? Number(responsibility) : 10,
                assignments: assignments || {},
                midterm: midterm !== undefined ? Number(midterm) : 0,
                final: final !== undefined ? Number(final) : 0
            }
        });
        res.json(grade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 9. WEBBOARD (กระดานสนทนา)
// ==========================================
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: { select: { studentId: true, name: true, role: true, avatar: true, equippedFrame: true } },
                comments: {
                    include: {
                        author: { select: { studentId: true, name: true, avatar: true, role: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                likes: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        let { authorId, content } = req.body;
        if (!authorId || !content) {
            return res.status(400).json({ error: 'Author and content are required' });
        }

        let user = await prisma.user.findUnique({
            where: { studentId: String(authorId) }
        });

        if (!user && !isNaN(Number(authorId)) && Number(authorId) > 0) {
            user = await prisma.user.findUnique({
                where: { id: Number(authorId) }
            });
        }

        if (!user) {
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { studentId: 'boss' },
                        { role: 'teacher' }
                    ]
                }
            });
        }

        if (!user) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' });
        }

        const post = await prisma.post.create({
            data: { authorId: user.studentId, content },
            include: {
                author: { select: { studentId: true, name: true, role: true, avatar: true, equippedFrame: true } },
                comments: true,
                likes: true
            }
        });
        res.json(post);
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const updated = await prisma.post.update({
            where: { id: req.params.id },
            data: { content }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await prisma.post.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/posts/:id/like', async (req, res) => {
    try {
        const { studentId } = req.body;
        const postId = req.params.id;

        const existing = await prisma.postLike.findUnique({
            where: { postId_studentId: { postId, studentId } }
        });

        if (existing) {
            await prisma.postLike.delete({
                where: { postId_studentId: { postId, studentId } }
            });
            await prisma.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            });
            return res.json({ liked: false });
        } else {
            await prisma.postLike.create({
                data: { postId, studentId }
            });
            await prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            });
            return res.json({ liked: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/posts/:id/comments', async (req, res) => {
    try {
        let { authorId, content } = req.body;
        const postId = req.params.id;
        if (!authorId || !content) {
            return res.status(400).json({ error: 'Author and content are required' });
        }

        let user = await prisma.user.findUnique({
            where: { studentId: String(authorId) }
        });

        if (!user && !isNaN(Number(authorId)) && Number(authorId) > 0) {
            user = await prisma.user.findUnique({
                where: { id: Number(authorId) }
            });
        }

        if (!user) {
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { studentId: 'boss' },
                        { role: 'teacher' }
                    ]
                }
            });
        }

        if (!user) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' });
        }

        const comment = await prisma.postComment.create({
            data: { postId, authorId: user.studentId, content },
            include: {
                author: { select: { studentId: true, name: true, avatar: true, role: true } }
            }
        });
        await prisma.post.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } }
        });
        res.json(comment);
    } catch (err) {
        console.error('Create comment error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/posts/comments/:commentId', async (req, res) => {
    try {
        const comment = await prisma.postComment.delete({
            where: { id: req.params.commentId }
        });
        await prisma.post.update({
            where: { id: comment.postId },
            data: { commentsCount: { decrement: 1 } }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 10. GAME SCORES (มินิเกมและแบบทดสอบหลังเรียน)
// ==========================================
const fs = require('fs');
const path = require('path');
const GAME_SCORES_FILE = path.join(__dirname, '../data/game_scores.json');

function loadGameScoresData() {
    try {
        const dir = path.dirname(GAME_SCORES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(GAME_SCORES_FILE)) {
            fs.writeFileSync(GAME_SCORES_FILE, JSON.stringify({}), 'utf-8');
            return {};
        }
        const data = fs.readFileSync(GAME_SCORES_FILE, 'utf-8');
        return JSON.parse(data || '{}');
    } catch (err) {
        console.error('Error loading game scores:', err);
        return {};
    }
}

function saveGameScoresData(data) {
    try {
        const dir = path.dirname(GAME_SCORES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(GAME_SCORES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error saving game scores:', err);
    }
}

// GET all game scores for a course & week
app.get('/api/game-scores/:courseId/:week', (req, res) => {
    try {
        const { courseId, week } = req.params;
        const allData = loadGameScoresData();
        const prefix = `${courseId}_${week}_`;
        const weekScores = {};

        for (const [key, value] of Object.entries(allData)) {
            if (key.startsWith(prefix)) {
                const studentId = key.replace(prefix, '');
                weekScores[studentId] = value;
            }
        }
        res.json({ success: true, data: weekScores });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST a game score (Only allowed once per student per game)
app.post('/api/game-scores', (req, res) => {
    try {
        const { courseId, week, studentId, gameId, score, maxScore } = req.body;
        if (!courseId || !week || !studentId || !gameId || score === undefined || maxScore === undefined) {
            return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
        }

        const allData = loadGameScoresData();
        const key = `${courseId}_${week}_${studentId}`;

        if (!allData[key]) {
            allData[key] = {
                courseId,
                week: Number(week),
                studentId,
                scores: {},
                lastUpdated: new Date().toISOString()
            };
        }

        // Strict rule: Single attempt only! Cannot overwrite existing score
        if (allData[key].scores[gameId]) {
            return res.status(400).json({
                success: false,
                message: 'คุณได้บันทึกคะแนนกิจกรรมนี้ไปแล้ว (เล่นได้ครั้งเดียวเท่านั้น)',
                existingScore: allData[key].scores[gameId]
            });
        }

        allData[key].scores[gameId] = {
            score: Math.min(Number(score), Number(maxScore)),
            maxScore: Number(maxScore),
            submittedAt: new Date().toISOString()
        };
        allData[key].lastUpdated = new Date().toISOString();

        saveGameScoresData(allData);
        res.json({ success: true, record: allData[key] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

