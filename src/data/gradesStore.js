import { ref, computed, watch } from "vue";
import { studentsList, isStudentInCourse, isStudent } from "./studentsStore";
import { courses } from "./courses";
import { API_BASE_URL } from "@/config/api";

const STORAGE_KEY_GRADES = "kmutnb_database_classroom_grades_v1";
const STORAGE_KEY_ATTENDANCE = "kmutnb_database_classroom_attendance_v1";
const STORAGE_KEY_SESSIONS = "kmutnb_database_classroom_checkin_sessions_v1";
const STORAGE_KEY_SUBMISSIONS = "kmutnb_database_classroom_submissions_v1";





// Standard Vocational Grading Proportions (รวม 100 คะแนน)
export const gradingConfig = {
  affective: {
    title: "จิตพิสัยและคุณธรรมจริยธรรม",
    total: 20,
    parts: {
      attendance: {
        title: "การเข้าเรียนและการตรงต่อเวลา",
        weight: 10,
        desc: "ประเมินจากการเช็คอินตรงเวลา ขาดเรียน/ไม่เช็คอินจะถูกหักคะแนน",
      },
      responsibility: {
        title: "ความรับผิดชอบและการมีส่วนร่วม",
        weight: 10,
        desc: "การส่งงานตรงต่อเวลา ความตั้งใจ และระเบียบวินัยในชั้นเรียน",
      },
    },
  },
  assignments: {
    title: "คะแนนเก็บตามภาระงาน/ใบงานปฏิบัติ",
    total: 40,
    desc: "คะแนนสะสมจากการทำใบงานและการฝึกปฏิบัติการ",
  },
  midterm: {
    title: "การประเมินผลกลางภาค (Midterm Exam)",
    total: 20,
    desc: "การทดสอบวัดความรู้เชิงทฤษฎีและทักษะปฏิบัติกลางภาค",
  },
  final: {
    title: "การประเมินผลปลายภาค (Final Exam)",
    total: 20,
    desc: "การทดสอบประมวลความรู้รวบยอดปลายภาคเรียน",
  },
  total: 100,
};

// Assignments list per course
export const courseAssignments = {
  "31901-2007": [
    {
      id: "asm-1",
      week: 1,
      title: "ใบงานที่ 1: สำรวจปัญหาแฟ้มข้อมูล การเลือก DBMS และเริ่มต้น Supabase Cloud",
      maxScore: 10,
    },
    {
      id: "asm-2",
      week: 2,
      title: "ใบงานที่ 2: การออกแบบ Relational Schema และสร้างตารางด้วย SQL DDL/DML",
      maxScore: 10,
    },
    {
      id: "asm-3",
      week: 3,
      title: "ใบงานที่ 3: เวิร์กช็อป NoSQL และการจัดการข้อมูลแบบ Document ด้วย JSONB",
      maxScore: 10,
    },
    {
      id: "asm-4",
      week: 5,
      title: "ใบงานที่ 4: การสร้างและการสืบค้นข้อมูลผ่าน View และ Row Level Security (RLS)",
      maxScore: 10,
    },
  ],
  "21901-2012": [
    {
      id: "asm-1",
      week: 1,
      title: "ใบงานที่ 1: สรุปหลักการ DevOps และวงจรการพัฒนาซอฟต์แวร์",
      maxScore: 10,
    },
    {
      id: "asm-2",
      week: 2,
      title: "ใบงานที่ 2: การติดตั้งและใช้งาน Git Version Control",
      maxScore: 10,
    },
    {
      id: "asm-3",
      week: 5,
      title: "ใบงานที่ 3: การทำงานแบบ Branching และ Pull Request",
      maxScore: 10,
    },
    {
      id: "asm-4",
      week: 10,
      title: "ใบงานที่ 4: การสร้างและจัดการ Docker Container",
      maxScore: 10,
    },
  ],
  "31901-2012": [
    {
      id: "asm-1",
      week: 1,
      title: "ใบงานที่ 1: การสำรวจบทบาท Data Analyst และการขับเคลื่อนธุรกิจด้วยข้อมูล (Data-Driven Decision Making)",
      maxScore: 10,
    },
    {
      id: "asm-2",
      week: 3,
      title: "ใบงานที่ 2: ตรวจสอบคุณภาพข้อมูล 5 มิติ (Data Quality)",
      maxScore: 10,
    },
    {
      id: "asm-3",
      week: 4,
      title: "ใบงานที่ 3: เวิร์กช็อปทำความสะอาดข้อมูล (Data Cleaning)",
      maxScore: 10,
    },
    {
      id: "asm-4",
      week: 10,
      title: "ใบงานที่ 4: ออกแบบ Sales Performance Dashboard",
      maxScore: 10,
    },
  ],
  "21901-2007": [
    {
      id: "asm-1",
      week: 1,
      title: "ใบงานที่ 1: แนะนำระบบสมองกลฝังตัวและการตั้งค่าบอร์ดทดลอง ESP32",
      maxScore: 10,
    },
    {
      id: "asm-2",
      week: 4,
      title: "ใบงานที่ 2: การควบคุมพอร์ตดิจิทัล I/O และการเชื่อมต่อหลอด LED / สวิตช์",
      maxScore: 10,
    },
    {
      id: "asm-3",
      week: 6,
      title: "ใบงานที่ 3: การเชื่อมต่อเซนเซอร์วัดอุณหภูมิและความชื้น (DHT)",
      maxScore: 10,
    },
    {
      id: "asm-4",
      week: 11,
      title: "ใบงานที่ 4: การเชื่อมต่อ Wi-Fi และส่งข้อมูลผ่าน MQTT ไปยัง IoT Dashboard",
      maxScore: 10,
    },
  ],
};

// Convert 100-point total into Thai Vocational Letter Grade & GPA
export const calculateGrade = (totalScore) => {
  const score = Math.round(Number(totalScore) * 10) / 10;
  if (score >= 80)
    return {
      grade: "4.0",
      letter: "A",
      status: "ดีเยี่ยม",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
    };
  if (score >= 75)
    return {
      grade: "3.5",
      letter: "B+",
      status: "ดีมาก",
      color: "text-teal-700 bg-teal-50 border-teal-300",
    };
  if (score >= 70)
    return {
      grade: "3.0",
      letter: "B",
      status: "ดี",
      color: "text-blue-700 bg-blue-50 border-blue-300",
    };
  if (score >= 65)
    return {
      grade: "2.5",
      letter: "C+",
      status: "ดีพอใช้",
      color: "text-cyan-700 bg-cyan-50 border-cyan-300",
    };
  if (score >= 60)
    return {
      grade: "2.0",
      letter: "C",
      status: "พอใช้",
      color: "text-amber-700 bg-amber-50 border-amber-300",
    };
  if (score >= 55)
    return {
      grade: "1.5",
      letter: "D+",
      status: "อ่อน",
      color: "text-orange-700 bg-orange-50 border-orange-300",
    };
  if (score >= 50)
    return {
      grade: "1.0",
      letter: "D",
      status: "อ่อนมาก",
      color: "text-red-600 bg-red-50 border-red-200",
    };
  return {
    grade: "0",
    letter: "F",
    status: "ไม่ผ่าน",
    color: "text-red-700 bg-red-100 border-red-300",
  };
};

// Default Grades seed
const defaultGrades = {};
const defaultAttendance = {};

// Load Stores from LocalStorage (Fallback / initial cache)
const loadGrades = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GRADES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load grades from localStorage:", e);
  }
  return defaultGrades;
};

const loadAttendance = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load attendance from localStorage:", e);
  }
  return defaultAttendance;
};

const loadCheckInSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load check-in sessions from localStorage:", e);
  }
  return {};
};

const loadSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load submissions from localStorage:", e);
  }
  return {};
};

export const gradesStore = ref(loadGrades());
export const attendanceStore = ref(loadAttendance());
export const checkInSessionsStore = ref(loadCheckInSessions());
export const submissionsStore = ref(loadSubmissions());

// Watchers for LocalStorage Cache (Offline backup)
watch(
  gradesStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true },
);

watch(
  attendanceStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true },
);

watch(
  checkInSessionsStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true },
);

watch(
  submissionsStore,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true },
);

// --- API Sync Functions ---
export const fetchGrades = async (courseId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/grades/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      data.forEach((g) => {
        const key = `${g.courseId}_${g.studentId}`;
        gradesStore.value[key] = {
          responsibility: g.responsibility ?? 10,
          assignments: g.assignments || {},
          midterm: g.midterm ?? 0,
          final: g.final ?? 0,
        };
      });
    }
  } catch (e) {
    console.error("Failed to fetch grades from API:", e);
  }
};

export const fetchAttendance = async (courseId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/attendance/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      data.forEach((a) => {
        const key = `${a.courseId}_${a.studentId}_${a.week}`;
        attendanceStore.value[key] = {
          status: a.status,
          checkedAt: a.checkedAt,
          note: a.note || "",
        };
      });
    }
  } catch (e) {
    console.error("Failed to fetch attendance from API:", e);
  }
};

export const fetchCheckInSessions = async (courseId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/attendance/sessions/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      data.forEach((s) => {
        const key = `${s.courseId}_${s.week}`;
        checkInSessionsStore.value[key] = {
          isOpen: s.isOpen,
          startTime: s.startTime,
          endTime: s.endTime,
        };
      });
    }
  } catch (e) {
    console.error("Failed to fetch check-in sessions from API:", e);
  }
};

export const formatExternalUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
};

export const fetchSubmissions = async (courseId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      data.forEach((sub) => {
        const key = `${sub.courseId}_${sub.studentId}_${sub.assignmentId}`;
        submissionsStore.value[key] = {
          link: formatExternalUrl(sub.link),
          note: sub.note || "",
          submittedAt: sub.submittedAt,
        };
      });
    }
  } catch (e) {
    console.error("Failed to fetch submissions from API:", e);
  }
};

export const fetchAllCourseData = async (courseId) => {
  if (!courseId) return;
  await Promise.all([
    fetchGrades(courseId),
    fetchAttendance(courseId),
    fetchCheckInSessions(courseId),
    fetchSubmissions(courseId),
  ]);
};

// Helper: Submit assignment
export const submitAssignmentLink = async (
  courseId,
  studentId,
  assignmentId,
  link,
  note = "",
) => {
  const cleanLink = formatExternalUrl(link);
  const key = `${courseId}_${studentId}_${assignmentId}`;
  const submittedAt = new Date().toLocaleString("th-TH");
  submissionsStore.value[key] = {
    link: cleanLink,
    note,
    submittedAt,
  };

  try {
    await fetch(`${API_BASE_URL}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        assignmentId,
        studentId,
        link: cleanLink,
        note,
        submittedAt,
      }),
    });
  } catch (e) {
    console.error("Failed to sync submission to API:", e);
  }
};

// Teacher Controls for Check-in
export const openCheckInSession = async (courseId, week) => {
  const startTime = new Date().toISOString();
  checkInSessionsStore.value[`${courseId}_${week}`] = {
    isOpen: true,
    startTime,
    endTime: null,
  };

  try {
    await fetch(`${API_BASE_URL}/attendance/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        week,
        isOpen: true,
        startTime,
        endTime: null,
      }),
    });
  } catch (e) {
    console.error("Failed to open check-in session via API:", e);
  }
};

export const closeCheckInSession = async (courseId, week) => {
  const endTime = new Date().toISOString();
  const session = checkInSessionsStore.value[`${courseId}_${week}`];
  if (session) {
    session.isOpen = false;
    session.endTime = endTime;
  } else {
    checkInSessionsStore.value[`${courseId}_${week}`] = {
      isOpen: false,
      endTime,
    };
  }

  // Automatically mark enrolled students who have not checked in as 'absent'
  const enrolledStudents = studentsList.value.filter(
    (s) => isStudentInCourse(s, courseId) && isStudent(s)
  );

  const absentBatch = [];
  enrolledStudents.forEach((s) => {
    const key = `${courseId}_${s.studentId}_${week}`;
    if (!attendanceStore.value[key]) {
      const rec = {
        courseId,
        studentId: s.studentId,
        week,
        status: "absent",
        checkedAt: "-",
        note: "หมดเวลาเช็คชื่อ (ขาดเรียน)",
      };
      attendanceStore.value[key] = rec;
      absentBatch.push(rec);
    }
  });

  try {
    await fetch(`${API_BASE_URL}/attendance/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        week,
        isOpen: false,
        endTime,
      }),
    });

    if (absentBatch.length > 0) {
      await fetch(`${API_BASE_URL}/attendance/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          week,
          records: absentBatch,
        }),
      });
    }
  } catch (e) {
    console.error("Failed to close check-in session via API:", e);
  }
};

// Helper: Calculate student's Attendance score out of 10 points
// Rule: Start with 10. Deduct proportionally based on course level (ปวช = 18 weeks, ปวส = 15 weeks).
// - Present: no deduction
// - Late: deduct half of weekly weight
// - Absent / Missed closed session: deduct full weekly weight
export const calculateStudentAttendanceScore = (
  courseId,
  studentId,
  _totalRecordedWeeks = null,
) => {
  const course = courses.find((c) => c.id === courseId);
  const totalWeeks = course && course.levelGroup === "ปวส." ? 15 : 18;

  let score = 10.0;
  const deductionPerAbsent = 10.0 / totalWeeks;
  const deductionPerLate = deductionPerAbsent / 2.0;

  for (let w = 1; w <= totalWeeks; w++) {
    const recordKey = `${courseId}_${studentId}_${w}`;
    const sessionKey = `${courseId}_${w}`;

    const record = attendanceStore.value[recordKey];
    const session = checkInSessionsStore.value[sessionKey];

    if (record) {
      if (record.status === "absent") {
        score -= deductionPerAbsent;
      } else if (record.status === "late") {
        score -= deductionPerLate;
      }
    } else {
      // If student didn't check in, and teacher closed the session -> Absent
      if (session && session.endTime) {
        score -= deductionPerAbsent;
      }
    }
  }

  // Ensure score doesn't drop below 0
  if (score < 0) score = 0;

  return Number(score.toFixed(1));
};

// Get student's complete score sheet for a course
export const getStudentFullScore = (
  courseId,
  studentId,
  totalRecordedWeeks = 4,
) => {
  const gradeKey = `${courseId}_${studentId}`;
  const data = gradesStore.value[gradeKey] || {
    responsibility: 10,
    assignments: {},
    midterm: 0,
    final: 0,
  };

  // 1. จิตพิสัย ส่วนที่ 1: การเข้าเรียน (10 คะแนน)
  const attendanceScore = calculateStudentAttendanceScore(
    courseId,
    studentId,
    totalRecordedWeeks,
  );

  // 2. จิตพิสัย ส่วนที่ 2: ความรับผิดชอบ (10 คะแนน)
  const responsibilityScore = Number(
    data.responsibility !== undefined ? data.responsibility : 10,
  );

  // รวมจิตพิสัย (20 คะแนน)
  const affectiveTotal = Math.min(
    20,
    Math.round((attendanceScore + responsibilityScore) * 10) / 10,
  );

  // 3. คะแนนเก็บใบงาน/ปฏิบัติ (40 คะแนน)
  const asms = courseAssignments[courseId] || [];
  let asmsEarned = 0;
  let asmsMax = 0;
  asms.forEach((a) => {
    asmsMax += a.maxScore;
    const scored =
      data.assignments && data.assignments[a.id] !== undefined
        ? Number(data.assignments[a.id])
        : 0;
    asmsEarned += scored;
  });
  // Scale to 40 if needed
  const assignmentsScore =
    asmsMax > 0
      ? Math.round((asmsEarned / asmsMax) * 40 * 10) / 10
      : asmsEarned;

  // 4. สอบกลางภาค (20 คะแนน)
  const midtermScore = Number(data.midterm || 0);

  // 5. สอบปลายภาค (20 คะแนน)
  const finalScore = Number(data.final || 0);

  // Total (100 คะแนน)
  const totalScore = Math.min(
    100,
    Math.round(
      (affectiveTotal + assignmentsScore + midtermScore + finalScore) * 10,
    ) / 10,
  );
  const gradeInfo = calculateGrade(totalScore);

  return {
    attendanceScore, // 10
    responsibilityScore, // 10
    affectiveTotal, // 20
    assignmentsScore, // 40
    midtermScore, // 20
    finalScore, // 20
    totalScore, // 100
    gradeInfo,
    rawAssignments: data.assignments || {},
  };
};

// Update Single Assignment Score
export const setAssignmentScore = async (
  courseId,
  studentId,
  assignmentId,
  score,
) => {
  const gradeKey = `${courseId}_${studentId}`;
  if (!gradesStore.value[gradeKey]) {
    gradesStore.value[gradeKey] = {
      responsibility: 10,
      assignments: {},
      midterm: 0,
      final: 0,
    };
  }
  if (!gradesStore.value[gradeKey].assignments) {
    gradesStore.value[gradeKey].assignments = {};
  }
  gradesStore.value[gradeKey].assignments[assignmentId] = Math.max(
    0,
    Number(score),
  );

  try {
    await fetch(`${API_BASE_URL}/grades/${courseId}/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradesStore.value[gradeKey]),
    });
  } catch (e) {
    console.error("Failed to sync assignment score to API:", e);
  }
};

// Update Exam or Responsibility Score
export const updateGradeItem = async (courseId, studentId, field, score) => {
  const gradeKey = `${courseId}_${studentId}`;
  if (!gradesStore.value[gradeKey]) {
    gradesStore.value[gradeKey] = {
      responsibility: 10,
      assignments: {},
      midterm: 0,
      final: 0,
    };
  }
  gradesStore.value[gradeKey][field] = Math.max(0, Number(score));

  try {
    await fetch(`${API_BASE_URL}/grades/${courseId}/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradesStore.value[gradeKey]),
    });
  } catch (e) {
    console.error("Failed to sync grade item to API:", e);
  }
};

// Attendance Check-in Action
export const setAttendanceCheckIn = async (
  courseId,
  studentId,
  weekNumber,
  status,
  note = "",
) => {
  const key = `${courseId}_${studentId}_${weekNumber}`;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;

  const finalNote =
    note ||
    (status === "present"
      ? "เช็คอินตรงเวลา"
      : status === "late"
        ? "มาสาย"
        : status === "absent"
          ? "ไม่เข้าเช็คอิน"
          : "ลากิจ/ลาป่วย");

  attendanceStore.value[key] = {
    status, // 'present' | 'late' | 'leave' | 'absent'
    checkedAt: status === "absent" ? "-" : timeStr,
    note: finalNote,
  };

  try {
    await fetch(`${API_BASE_URL}/attendance/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        week: weekNumber,
        studentId,
        status,
        note: finalNote,
        checkedAt: status === "absent" ? "-" : timeStr,
      }),
    });
  } catch (e) {
    console.error("Failed to sync attendance to API:", e);
  }
};

// Batch Check-in all students in a classroom for a specific week
export const batchCheckInClassroom = async (
  courseId,
  classroom,
  weekNumber,
  defaultStatus = "present",
) => {
  const studentsInRoom = studentsList.value.filter(
    (s) => s.classroom === classroom && isStudentInCourse(s, courseId) && isStudent(s),
  );

  const records = [];
  studentsInRoom.forEach((s) => {
    setAttendanceCheckIn(courseId, s.studentId, weekNumber, defaultStatus);
    records.push({
      studentId: s.studentId,
      status: defaultStatus,
      note: defaultStatus === "present" ? "เช็คอินตรงเวลา" : "ไม่เข้าเช็คอิน",
    });
  });

  try {
    await fetch(`${API_BASE_URL}/attendance/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        week: weekNumber,
        records,
      }),
    });
  } catch (e) {
    console.error("Failed to sync batch attendance to API:", e);
  }

  return studentsInRoom.length;
};

