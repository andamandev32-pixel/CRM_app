/* ============================================================================
   บันทึกว่าโครงการแต่ละรายการถูกเพิ่มเข้าระบบเมื่อไร
   เก็บแยกเป็นไฟล์ ไม่ยัดเป็นคอลัมน์ใน .md เพราะจะทำให้ตาราง 14/16 ช่องเพี้ยน

   รูปแบบ: { "<เลขโครงการ>": "2026-09-09T09:41" }
   รายการเดิมที่มีมาก่อนระบบนี้จะไม่มีในไฟล์ = ถือว่าเป็นข้อมูลตั้งต้น ไม่ใช่ของใหม่
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'state', 'added-log.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch { return {}; }
}

/** เวลาแบบท้องถิ่น YYYY-MM-DDTHH:mm (ไม่ใช้ UTC เพราะคนอ่านเป็นเวลาไทย) */
function stamp(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
         'T' + p(d.getHours()) + ':' + p(d.getMinutes());
}

/** บันทึกเวลาให้เลขโครงการชุดหนึ่ง (ไม่ทับของเดิมถ้าเคยบันทึกแล้ว) */
function record(ids, when = stamp()) {
  const log = load();
  let n = 0;
  for (const id of ids) if (!log[id]) { log[id] = when; n++; }
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(log), 'utf8');
  return n;
}

/** เวลาล่าสุดที่มีการเพิ่มข้อมูล */
function latest() {
  const v = Object.values(load());
  return v.length ? v.sort().pop() : null;
}

module.exports = { load, record, stamp, latest, FILE };
