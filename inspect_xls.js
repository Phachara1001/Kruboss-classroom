import * as xlsx from 'xlsx';
import fs from 'fs';

const filePath = './public/Student_Importer_Template.xls';
const workbook = xlsx.default ? xlsx.default.readFile(filePath) : xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = (xlsx.default ? xlsx.default.utils : xlsx.utils).sheet_to_json(worksheet, { header: 1 });
for(let i=0; i<20 && i<data.length; i++) {
  console.log(`Row ${i}:`, data[i]);
}
