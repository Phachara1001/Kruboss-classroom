import * as xlsx from "xlsx";
import ExcelJS from "exceljs";
import { courses } from "@/data/courses";
import { isStudent, isStudentInCourse } from "@/data/studentsStore";
import { attendanceStore, checkInSessionsStore } from "@/data/gradesStore";

/**
 * ส่งออกตารางการเข้าเรียนโดยดึงไฟล์ Template จริง: public/Student_CheckIn_Template.xls
 *
 * โครงสร้าง Template (ชีตแรก) — index ที่ใช้ในโค้ดเป็น 0-based:
 *  - แถว 3  : ระดับหลักสูตร {ปวช/ปวส.}
 *  - แถว 4  : ชั้นปีที่ {ชั้นปี} / กลุ่มเรียนที่ {กลุ่มเรียน} : {รหัสนศ.ไม่รวม3ตัวหลัง}
 *  - แถว 5  : วิชาเรียน {รหัส} : {ชื่อวิชา}
 *  - แถว 6-9: หัวตาราง  A ลำดับ | C รหัสประจำตัว | G ชื่อ-นามสกุล | N..AB = week 1..15
 *  - แถว 10-27: ข้อมูลนักศึกษา 18 แถว (A:B ลำดับ, C:F รหัส, G:M ชื่อ)  *แถว 10 มี placeholder*
 *  - แถว 29 : A = รหัสกลุ่ม, L = สรุปจำนวนนักเรียน
 */

const TEMPLATE_URL = "/Student_CheckIn_Template.xls";

// ตำแหน่งใน Template (0-based)
const HEADER_ROW = 5; // แถว 6
const FIRST_DATA_ROW = 9; // แถว 10
const TEMPLATE_DATA_ROWS = 18; // แถว 10-27
const FOOTER_ROW = 28; // แถว 29
const COL_NO = 0; // A
const COL_ID = 2; // C
const COL_NAME = 6; // G
const FIRST_WEEK_COL = 13; // N
const WEEK_COLS = 15; // N..AB = week 1..15
const LAST_COL = 27; // AB
const COL_FOOTER_SUMMARY = 11; // L

// สัญลักษณ์ตามคำอธิบายใน Template: / เข้าเรียน | X ขาด | ล ลา | ส มาสาย
const ATTENDANCE_SYMBOL = {
  present: "/",
  absent: "X",
  leave: "ล",
  late: "ส",
};

export const getAttendanceSymbol = (status) => ATTENDANCE_SYMBOL[status] ?? "";

/**
 * ดึงสถานะการเช็คชื่อของนักศึกษาในสัปดาห์นั้นๆ
 */
export const getStudentWeekAttendance = (courseId, studentId, week) => {
  const key = `${courseId}_${studentId}_${week}`;
  const rec = attendanceStore.value[key];
  if (rec && rec.status) return rec.status;

  // ครูปิด session เช็คชื่อสัปดาห์นั้นแล้ว แต่นักเรียนไม่ได้เช็ค -> ขาด
  const session = checkInSessionsStore.value?.[`${courseId}_${week}`];
  if (session && session.endTime && !session.isOpen) return "absent";

  return "none";
};

const isMale = (name = "") =>
  /^(นาย|ด\.ช\.|ว่าที่ร้อยตรี\s*นาย)/.test(String(name).trim());

/**
 * (สำรอง) ส่งออกจาก Template .xls ด้วย SheetJS — ไม่คง font/ขอบ/สี
 */
const exportWithSheetJS = async ({
  courseId,
  classroom = "all",
  allStudents = [],
}) => {
  const course = courses.find((c) => c.id === courseId) || {
    id: courseId,
    code: courseId,
    name: "รายวิชา",
    level: "ปวส.1/1",
    levelGroup: "ปวส.",
  };

  // 1. กรองรายชื่อนักศึกษาเฉพาะวิชาและห้องที่เลือก (เรียงตามรหัส)
  const targetStudents = allStudents
    .filter((s) => {
      if (!isStudent(s)) return false;
      if (!isStudentInCourse(s, courseId)) return false;
      if (classroom && classroom !== "all") return s.classroom === classroom;
      return true;
    })
    .sort((a, b) =>
      String(a.studentId || a.id || "").localeCompare(
        String(b.studentId || b.id || ""),
      ),
    );

  const targetClassroomText =
    classroom === "all" ? course.level || "ปวส.1/1" : classroom;

  // "ปวส.1/1" -> level "ปวส.", year "1", group "1"
  let levelPart = course.levelGroup || "ปวส.";
  let yearPart = "1";
  let groupPart = "1";
  const roomMatch = targetClassroomText.match(/(ปวช|ปวส)\.?\s*(\d+)\/(\d+)/);
  if (roomMatch) {
    levelPart = `${roomMatch[1]}.`;
    yearPart = roomMatch[2];
    groupPart = roomMatch[3];
  }

  // รหัสกลุ่ม = รหัสนักศึกษา ไม่รวม 3 ตัวหลัง
  let codePrefix = "";
  const firstId = String(
    targetStudents[0]?.studentId || targetStudents[0]?.id || "",
  ).trim();
  if (firstId.length > 3) codePrefix = firstId.slice(0, -3);

  // 2. โหลด Template
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) {
    throw new Error(`โหลดไฟล์ template ไม่สำเร็จ (${TEMPLATE_URL}) : HTTP ${res.status}`);
  }
  const workbook = xlsx.read(await res.arrayBuffer(), {
    type: "array",
    cellStyles: true,
    cellNF: true,
  });
  const ws = workbook.Sheets[workbook.SheetNames[0]];

  // ---------- helpers: เขียนค่าลง cell เดิม (คง style ของ cell ที่มีอยู่) ----------
  const ref = (r, c) => xlsx.utils.encode_cell({ r, c });
  const getText = (r, c) => {
    const cell = ws[ref(r, c)];
    return cell && cell.v != null ? String(cell.v) : "";
  };
  const setValue = (r, c, value) => {
    const addr = ref(r, c);
    const prev = ws[addr];
    if (value === "" || value == null) {
      if (prev) {
        prev.v = "";
        prev.t = "s";
        delete prev.w;
        delete prev.f;
      }
      return;
    }
    const isNum = typeof value === "number";
    if (prev) {
      prev.v = value;
      prev.t = isNum ? "n" : "s";
      delete prev.w;
      delete prev.f;
    } else {
      ws[addr] = { t: isNum ? "n" : "s", v: value };
    }
  };

  // 3. แทน placeholder ในส่วนหัว (แถว 1-5)
  const replacements = [
    [/\{ปวช\/ปวส\.\}/g, levelPart],
    [/\{ชั้นปี\}/g, yearPart],
    [/\{กลุ่มเรียน\}/g, groupPart],
    [/\{รหัส\s*นศ\.\s*ไม่รวม\s*3\s*ตัวหลัง\}/g, codePrefix],
    [/\{รหัสนศ\.ไม่รวม3ตัวหลัง\}/g, codePrefix],
    [/\{รหัส\}/g, course.code || course.id || ""],
    [/\{ชื่อวิชา\}/g, course.name || ""],
  ];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c <= LAST_COL; c++) {
      const text = getText(r, c);
      if (!text.includes("{")) continue;
      let out = text;
      for (const [re, val] of replacements) out = out.replace(re, val);
      if (out !== text) setValue(r, c, out);
    }
  }

  // 4. หัวคอลัมน์ week 1..15
  for (let w = 1; w <= WEEK_COLS; w++) {
    setValue(HEADER_ROW, FIRST_WEEK_COL + w - 1, `week ${w}`);
  }

  // 5. ถ้านักศึกษาเกิน 18 คน -> เพิ่มแถว (merge เหมือนแถวใน template) แล้วเลื่อน footer ลง
  const extra = Math.max(0, targetStudents.length - TEMPLATE_DATA_ROWS);
  let footerRow = FOOTER_ROW;
  if (extra > 0) {
    const lastDataRow = FIRST_DATA_ROW + TEMPLATE_DATA_ROWS - 1; // แถว 27 (0-based 26)
    const newFooterRow = FOOTER_ROW + extra;
    ws["!merges"] = ws["!merges"] || [];

    // ย้าย cell ของ footer (และ cell ว่างที่มี style) ลงไปแถวใหม่
    for (let c = 0; c <= LAST_COL; c++) {
      const from = ref(FOOTER_ROW, c);
      if (ws[from]) {
        ws[ref(newFooterRow, c)] = ws[from];
        delete ws[from];
      }
    }
    // ย้าย merge ของ footer
    ws["!merges"] = ws["!merges"].map((m) =>
      m.s.r === FOOTER_ROW && m.e.r === FOOTER_ROW
        ? { s: { r: newFooterRow, c: m.s.c }, e: { r: newFooterRow, c: m.e.c } }
        : m,
    );
    // สร้างแถวข้อมูลเพิ่ม โดยคัดลอก style จากแถวสุดท้ายของข้อมูล
    for (let i = 1; i <= extra; i++) {
      const r = lastDataRow + i;
      for (let c = 0; c <= LAST_COL; c++) {
        const src = ws[ref(lastDataRow, c)];
        if (src) ws[ref(r, c)] = { ...src, v: "", t: "s" };
      }
      ws["!merges"].push({ s: { r, c: 0 }, e: { r, c: 1 } }); // ลำดับ
      ws["!merges"].push({ s: { r, c: 2 }, e: { r, c: 5 } }); // รหัส
      ws["!merges"].push({ s: { r, c: 6 }, e: { r, c: 12 } }); // ชื่อ
    }
    footerRow = newFooterRow;
    ws["!ref"] = xlsx.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: newFooterRow + 1, c: LAST_COL },
    });
  }

  // 6. เติมข้อมูลนักศึกษา + สถานะรายสัปดาห์ (เขียนทับ placeholder แถว 10 ด้วย)
  const totalRows = TEMPLATE_DATA_ROWS + extra;
  for (let i = 0; i < totalRows; i++) {
    const r = FIRST_DATA_ROW + i;
    const student = targetStudents[i];

    setValue(r, COL_NO, student ? i + 1 : "");
    setValue(r, COL_ID, student ? String(student.studentId || student.id || "") : "");
    setValue(r, COL_NAME, student ? student.name || "" : "");

    for (let w = 1; w <= WEEK_COLS; w++) {
      const col = FIRST_WEEK_COL + w - 1;
      if (!student) {
        setValue(r, col, "");
        continue;
      }
      const status = getStudentWeekAttendance(
        courseId,
        student.studentId || student.id,
        w,
      );
      setValue(r, col, getAttendanceSymbol(status));
    }
  }

  // 7. Footer: รหัสกลุ่ม + สรุปจำนวน
  const male = targetStudents.filter((s) => isMale(s.name)).length;
  const female = targetStudents.length - male;
  if (codePrefix) setValue(footerRow, 0, `รหัสกลุ่ม  ${codePrefix}`);
  setValue(
    footerRow,
    COL_FOOTER_SUMMARY,
    `รวมจำนวนนักเรียนทั้งหมด  ${targetStudents.length} คน  นักเรียนชาย ${male} คน   นักเรียนหญิง  ${female} คน`,
  );

  // 8. บันทึกไฟล์ (.xls เหมือน template)
  const cleanClassroom = targetClassroomText.replace(/[/\\?%*:|"<>]/g, "_");
  const fileName = `ตารางการเข้าเรียน_${course.code || course.id}_${cleanClassroom}.xls`;
  xlsx.writeFile(workbook, fileName, { bookType: "biff8", cellStyles: true });
  return fileName;
};

// =====================================================================
// ExcelJS: ใช้ Template .xlsx — คง font / เส้นขอบ / สี / merge ของ Template ครบ
// (ตำแหน่งเป็น 1-based)
// =====================================================================
const XLSX_TEMPLATE_URL = "/Student_CheckIn_Template.xlsx";
const X_FIRST_DATA_ROW = 10;
const X_DATA_ROWS = 18;
const X_HEADER_ROW = 6;
const X_FIRST_WEEK_COL = 14; // N
const X_WEEK_COLS = 15; // N..AB
const X_LAST_COL = 28; // AB
const X_FOOTER_ROW = 29;

// สไตล์สีพื้นหลังและสีข้อความตามสถานะการเข้าเรียน (ตรงตามคำอธิบายใน Template)
const X_STATUS_STYLE = {
  present: {
    symbol: "/",
    fill: "FFC6EFCE", // เขียวอ่อน
    font: "FF006100", // เขียวเข้ม
  },
  absent: {
    symbol: "X",
    fill: "FFFFC7CE", // แดงอ่อน
    font: "FF9C0006", // แดงเข้ม
  },
  leave: {
    symbol: "ล",
    fill: "FFFFEB9C", // เหลืองอ่อน
    font: "FF9C6500", // น้ำตาล/ส้มเข้ม
  },
  late: {
    symbol: "ส",
    fill: "FFF8CBAD", // ส้มอ่อน
    font: "FFC65911", // ส้มเข้ม
  },
};

const X_FILL = {
  present: X_STATUS_STYLE.present.fill,
  absent: X_STATUS_STYLE.absent.fill,
  leave: X_STATUS_STYLE.leave.fill,
  late: X_STATUS_STYLE.late.fill,
};

const cloneStyle = (s) => JSON.parse(JSON.stringify(s || {}));

const cellText = (cell) => {
  const v = cell.value;
  if (v == null) return "";
  if (typeof v === "object" && Array.isArray(v.richText)) {
    return v.richText.map((t) => t.text).join("");
  }
  return String(v);
};

// ตั้งค่าโดยไม่แตะ style เดิมของ cell
const putValue = (cell, value) => {
  cell.value = value === "" || value == null ? null : value;
};

const downloadBuffer = (buffer, fileName) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// เพิ่มแถวเมื่อนักศึกษาเกิน 18 คน (คัดลอก style/merge จากแถวสุดท้าย) แล้วเลื่อน footer
const extendRowsAndMoveFooter = (ws, extra) => {
  if (extra <= 0) return X_FOOTER_ROW;

  const lastRow = X_FIRST_DATA_ROW + X_DATA_ROWS - 1; // 27
  const spacerRow = lastRow + 1; // 28
  const footerRow = X_FOOTER_ROW; // 29

  const footerA = ws.getCell(footerRow, 1);
  const footerL = ws.getCell(footerRow, 12);
  const saved = {
    aValue: footerA.value,
    aStyle: cloneStyle(footerA.style),
    lValue: footerL.value,
    lStyle: cloneStyle(footerL.style),
    height: ws.getRow(footerRow).height,
  };
  const spacerHeight = ws.getRow(spacerRow).height;
  const spacerStyles = [];
  for (let c = 1; c <= X_LAST_COL; c++) {
    spacerStyles[c] = cloneStyle(ws.getCell(spacerRow, c).style);
  }

  ws.unMergeCells(footerRow, 1, footerRow, 11);
  ws.unMergeCells(footerRow, 12, footerRow, X_LAST_COL);
  for (let c = 1; c <= X_LAST_COL; c++) {
    ws.getCell(footerRow, c).value = null;
    ws.getCell(footerRow, c).style = cloneStyle(spacerStyles[c]);
  }

  const srcRow = ws.getRow(lastRow);
  for (let i = 0; i < extra; i++) {
    const r = lastRow + 1 + i;
    const row = ws.getRow(r);
    row.height = srcRow.height;
    for (let c = 1; c <= X_LAST_COL; c++) {
      row.getCell(c).style = cloneStyle(srcRow.getCell(c).style);
      row.getCell(c).value = null;
    }
    ws.mergeCells(r, 1, r, 2);
    ws.mergeCells(r, 3, r, 6);
    ws.mergeCells(r, 7, r, 13);
  }

  const newSpacer = lastRow + extra + 1;
  const newFooter = newSpacer + 1;
  ws.getRow(newSpacer).height = spacerHeight;
  for (let c = 1; c <= X_LAST_COL; c++) {
    ws.getCell(newSpacer, c).style = cloneStyle(spacerStyles[c]);
    ws.getCell(newFooter, c).style = cloneStyle(spacerStyles[c]);
  }
  ws.getRow(newFooter).height = saved.height;
  ws.getCell(newFooter, 1).value = saved.aValue;
  ws.getCell(newFooter, 1).style = saved.aStyle;
  ws.getCell(newFooter, 12).value = saved.lValue;
  ws.getCell(newFooter, 12).style = saved.lStyle;
  ws.mergeCells(newFooter, 1, newFooter, 11);
  ws.mergeCells(newFooter, 12, newFooter, X_LAST_COL);

  return newFooter;
};

const exportWithExcelJS = async (buffer, { courseId, classroom, allStudents }) => {
  const course = courses.find((c) => c.id === courseId) || {
    id: courseId,
    code: courseId,
    name: "รายวิชา",
    level: "ปวส.1/1",
    levelGroup: "ปวส.",
  };

  const targetStudents = allStudents
    .filter((s) => {
      if (!isStudent(s)) return false;
      if (!isStudentInCourse(s, courseId)) return false;
      if (classroom && classroom !== "all") return s.classroom === classroom;
      return true;
    })
    .sort((a, b) =>
      String(a.studentId || a.id || "").localeCompare(String(b.studentId || b.id || "")),
    );

  const targetClassroomText = classroom === "all" ? course.level || "ปวส.1/1" : classroom;

  let levelPart = course.levelGroup || "ปวส.";
  let yearPart = "1";
  let groupPart = "1";
  const roomMatch = targetClassroomText.match(/(ปวช|ปวส)\.?\s*(\d+)\/(\d+)/);
  if (roomMatch) {
    levelPart = `${roomMatch[1]}.`;
    yearPart = roomMatch[2];
    groupPart = roomMatch[3];
  }

  let codePrefix = "";
  const firstId = String(targetStudents[0]?.studentId || targetStudents[0]?.id || "").trim();
  if (firstId.length > 3) codePrefix = firstId.slice(0, -3);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const ws = workbook.worksheets[0];

  // ล้าง Conditional Formatting เดิมที่ติดมาจาก Template
  // (เพราะกฎเดิมใน Template จะบังคับทาสีเขียวทับทุกช่องที่มีข้อมูล ทำให้ทุกสถานะกลายเป็นสีเดียวกัน)
  workbook.worksheets.forEach((sheet) => {
    sheet.conditionalFormattings = [];
    sheet.conditionalFormatting = [];
    if (typeof sheet.removeConditionalFormatting === "function") {
      try {
        sheet.removeConditionalFormatting();
      } catch (e) {}
    }
  });

  // placeholder ส่วนหัว (แถว 1-5)
  const replacements = [
    [/\{ปวช\/ปวส\.\}/g, levelPart],
    [/\{ชั้นปี\}/g, yearPart],
    [/\{กลุ่มเรียน\}/g, groupPart],
    [/\{รหัส\s*นศ\.\s*ไม่รวม\s*3\s*ตัวหลัง\}/g, codePrefix],
    [/\{รหัสนศ\.ไม่รวม3ตัวหลัง\}/g, codePrefix],
    [/\{รหัส\}/g, course.code || course.id || ""],
    [/\{ชื่อวิชา\}/g, course.name || ""],
  ];
  for (let r = 1; r <= 5; r++) {
    for (let c = 1; c <= X_LAST_COL; c++) {
      const cell = ws.getCell(r, c);
      const text = cellText(cell);
      if (!text.includes("{")) continue;
      let out = text;
      for (const [re, val] of replacements) out = out.replace(re, val);
      if (out !== text) cell.value = out;
    }
  }

  for (let w = 1; w <= X_WEEK_COLS; w++) {
    ws.getCell(X_HEADER_ROW, X_FIRST_WEEK_COL + w - 1).value = `week ${w}`;
  }

  const extra = Math.max(0, targetStudents.length - X_DATA_ROWS);
  const footerRow = extendRowsAndMoveFooter(ws, extra);
  const totalRows = X_DATA_ROWS + extra;

  for (let i = 0; i < totalRows; i++) {
    const r = X_FIRST_DATA_ROW + i;
    const student = targetStudents[i];

    putValue(ws.getCell(r, 1), student ? i + 1 : "");
    putValue(ws.getCell(r, 3), student ? String(student.studentId || student.id || "") : "");
    putValue(ws.getCell(r, 7), student ? student.name || "" : "");

    for (let w = 1; w <= X_WEEK_COLS; w++) {
      const cell = ws.getCell(r, X_FIRST_WEEK_COL + w - 1);
      const baseBorder = cloneStyle(cell.border);

      if (!student) {
        cell.value = null;
        cell.style = { border: baseBorder };
        continue;
      }

      const status = getStudentWeekAttendance(courseId, student.studentId || student.id, w);
      const symbol = getAttendanceSymbol(status);
      if (!symbol) {
        cell.value = null;
        cell.style = { border: baseBorder };
        continue;
      }

      const style = X_STATUS_STYLE[status] || {
        fill: X_FILL[status] || "FFFFFFFF",
        font: "FF000000",
      };

      cell.value = symbol;
      // ใน ExcelJS หากโหลดไฟล์ template มา cell ต่างๆ จะแชร์ style object ตัวเดียวกัน
      // ต้องกำหนด cell.style เป็น object ก้อนใหม่เสมอเพื่อไม่ให้สไตล์หลุดหรือชนกัน
      cell.style = {
        border: baseBorder,
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: style.fill },
          bgColor: { argb: style.fill },
        },
        font: {
          name: "TH SarabunPSK",
          size: 14,
          bold: true,
          color: { argb: style.font },
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
        },
      };
    }
  }

  const male = targetStudents.filter((s) => isMale(s.name)).length;
  const female = targetStudents.length - male;
  if (codePrefix) ws.getCell(footerRow, 1).value = `รหัสกลุ่ม  ${codePrefix}`;
  ws.getCell(footerRow, 12).value =
    `รวมจำนวนนักเรียนทั้งหมด  ${targetStudents.length} คน  นักเรียนชาย ${male} คน   นักเรียนหญิง  ${female} คน`;

  const cleanClassroom = targetClassroomText.replace(/[/\\?%*:|"<>]/g, "_");
  const fileName = `ตารางการเข้าเรียน_${course.code || course.id}_${cleanClassroom}.xlsx`;
  downloadBuffer(await workbook.xlsx.writeBuffer(), fileName);
  return fileName;
};

/**
 * ส่งออกตารางการเข้าเรียน
 * - ถ้ามี public/Student_CheckIn_Template.xlsx -> ใช้ ExcelJS (คง font/ขอบ/สีตาม Template)
 * - ถ้าไม่มี -> ใช้ .xls + SheetJS (จัดรูปแบบไม่ได้)
 */
export const exportAttendanceToExcel = async (options) => {
  const opts = { classroom: "all", allStudents: [], ...options };
  try {
    const res = await fetch(XLSX_TEMPLATE_URL);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const head = new Uint8Array(buf.slice(0, 2));
      // .xlsx คือ zip ขึ้นต้นด้วย "PK" (กันกรณี dev server ตอบ index.html แทน 404)
      if (head[0] === 0x50 && head[1] === 0x4b) {
        return await exportWithExcelJS(buf, opts);
      }
    }
  } catch (e) {
    console.warn("ExcelJS export failed, fallback to .xls:", e);
  }
  return exportWithSheetJS(opts);
};
