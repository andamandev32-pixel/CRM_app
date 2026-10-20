#!/usr/bin/env node
/* ============================================================================
   survey-logistics — สำรวจตลาดงานโลจิสติกส์ในโรงพยาบาล ปีงบ 2569 (งานครั้งเดียว)

     node egp-watch/survey-logistics.js --probe   วัดผลดิบต่อคีย์เวิร์ด ไม่ดึงข้อมูล
     node egp-watch/survey-logistics.js           เก็บจริง → state/survey-log.json

   ต่างจาก watch-daily.js ตรงที่รอบนี้เป็นการ "ตั้งต้น" กลุ่มใหม่ จึงเก็บลง JSON
   กลางไว้ก่อน ให้ทวนตัวกรองซ้ำได้โดยไม่ต้องยิง API ใหม่ แล้วค่อยเขียนไฟล์ .md
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const api = require('./lib/api');
const { accept, IS_SYSTEM } = require('./lib/filter');
const md = require('./lib/mdtable');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'state', 'survey-log.json');
const YEAR = 2569;
const PROBE = process.argv.includes('--probe');

/* ---- คีย์เวิร์ดที่จะสำรวจ แยกตามหมวดที่ตกลงไว้ --------------------------- */
const CANDIDATES = [
  ['เปล/เคลื่อนย้ายผู้ป่วย',
    ['พนักงานเปล', 'งานเปล', 'บริการเปล', 'เคลื่อนย้ายผู้ป่วย', 'เรียกเปล']],
  ['ขนส่งของ/สิ่งส่งตรวจ/เอกสาร',
    ['ขนส่งเวชภัณฑ์', 'ขนส่งยา', 'จัดส่งยา', 'รับส่งยา', 'รับ-ส่งเอกสาร',
     'ขนส่งเอกสาร', 'สิ่งส่งตรวจ', 'ขนส่งโลหิต', 'ขนส่งพัสดุ', 'ลำเลียง']],
  ['ระบบขนส่งอัตโนมัติในอาคาร',
    ['ท่อลม', 'Pneumatic', 'AGV', 'หุ่นยนต์ขนส่ง', 'หุ่นยนต์ลำเลียง',
     'สายพานลำเลียง', 'ลิฟต์ขนของ', 'Tube System']],
  ['ซอฟต์แวร์/ระบบโลจิสติกส์',
    ['โลจิสติกส์', 'Logistic', 'RFID', 'บาร์โค้ด', 'Barcode', 'ติดตามพัสดุ',
     'ติดตามครุภัณฑ์', 'ระบบเบิกจ่าย', 'ระบบขอเบิก', 'Track', 'GPS', 'ระบบขนส่ง']],
  ['งานสนับสนุน — ซักฟอก/ขยะ/อาหาร',
    ['ซัก-อบ-รีด', 'ซักอบรีด', 'ซักฟอก', 'ผ้าผู้ป่วย', 'มูลฝอยติดเชื้อ',
     'ขยะติดเชื้อ', 'กำจัดมูลฝอย', 'ประกอบอาหาร', 'อาหารผู้ป่วย']],
  ['ยานพาหนะ/ส่งต่อ/ส่งยาถึงบ้าน',
    ['รถรับส่งผู้ป่วย', 'ส่งต่อผู้ป่วย', 'ส่งยาทางไปรษณีย์', 'ส่งยาถึงบ้าน',
     'Delivery', 'เดลิเวอรี่']],
];
const ALL = CANDIDATES.flatMap(([, ks]) => ks);

/* คีย์เวิร์ดที่ผ่านการคัดแล้ว — เขียนไว้หลังรอบ probe (ไม่มีไฟล์ = ใช้ทั้งหมด) */
let KEEP = [];
try {
  KEEP = JSON.parse(fs.readFileSync(path.join(__dirname, 'state', 'keywords-log.json'), 'utf8'));
} catch (e) {}

/* ============================================================================
   โหมด probe — วัดผลดิบอย่างเดียว
   ========================================================================= */
async function probeAll() {
  console.log('probe คีย์เวิร์ด ' + ALL.length + ' คำ · ปีงบ ' + YEAR +
              ' · ราว ' + Math.ceil(ALL.length * 2 / 60) + ' นาที\n');
  const rows = [];
  for (const [bucket, kws] of CANDIDATES) {
    for (const kw of kws) {
      let total = null, err = null;
      try { total = await api.probe(kw, YEAR); }
      catch (e) { err = e.message.split('\n')[0]; }
      rows.push({ bucket, kw, total, err });
      console.log('  ' + kw.padEnd(22) + (err ? '! ' + err : String(total).padStart(8)));
      await api.sleep(api.DELAY_MS);
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'state', 'probe-log.json'),
                   JSON.stringify(rows, null, 2), 'utf8');

  console.log('\n══ เรียงตามผลดิบ ══');
  rows.filter(r => r.total != null).sort((a, b) => b.total - a.total)
    .forEach(r => console.log('  ' + String(r.total).padStart(8) + '  ' +
      r.kw.padEnd(22) + '  ' + r.bucket));
  const big = rows.filter(r => r.total > api.MAX_ROWS);
  if (big.length) {
    console.log('\n⚠ เกิน MAX_ROWS (' + api.MAX_ROWS + ') — ต้องแตกคำให้แคบลง:');
    big.forEach(r => console.log('   ' + r.kw + ' = ' + r.total));
  }
  console.log('\nเขียน state/probe-log.json แล้ว');
}

/* ============================================================================
   โหมดเก็บจริง
   ========================================================================= */
/* เลขโครงการที่อยู่ในอีก 3 ไฟล์แล้ว — ไฟล์นี้ประกาศว่าไม่นับซ้ำ */
function idsInOtherFiles() {
  const seen = new Set();
  for (const f of ['egp-2569-healthcare-procurement.md',
                   'egp-medication-management-2568-2569.md',
                   'egp-inventory-erp-2569.md']) {
    md.idsInFile(path.join(ROOT, f)).forEach(id => seen.add(id));
  }
  return seen;
}

async function harvest() {
  const kws = KEEP.length ? KEEP : ALL;
  console.log('เก็บจริง · คีย์เวิร์ด ' + kws.length + ' คำ · ปีงบ ' + YEAR +
              (KEEP.length ? '  [ชุดที่คัดแล้วจาก state/keywords-log.json]' : '') + '\n');

  const other = idsInOtherFiles();
  console.log('  กันเลขโครงการที่อยู่ในอีก 3 ไฟล์แล้ว ' + other.size + ' รายการ\n');

  const keep = new Map();      // project_id -> record
  const drop = new Map();      // project_id -> เหตุผลที่คัดออก
  let scanned = 0, dupOther = 0;

  for (const kw of kws) {
    let r;
    try { r = await api.search(kw, YEAR); }
    catch (e) { console.error('  ! ' + kw + ' — ' + e.message.split('\n')[0]); continue; }
    scanned += r.rows.length;
    let added = 0;
    for (const rec of r.rows) {
      const id = rec.project_id;
      if (keep.has(id)) { keep.get(id)._kws.push(kw); continue; }
      if (drop.has(id)) continue;
      if (other.has(id)) { dupOther++; continue; }
      const v = accept(rec, 'log');
      if (!v.ok) {
        drop.set(id, { id, name: rec.project_name, org: rec.dept_sub_name || rec.dept_name,
                       money: rec.project_money, reason: v.reason, kw });
        continue;
      }
      keep.set(id, Object.assign({}, rec, { _kws: [kw] }));
      added++;
    }
    console.log('  ' + kw.padEnd(22) + String(r.total).padStart(7) + ' ผลดิบ · เก็บได้ ' + added);
    await api.sleep(api.DELAY_MS);
  }

  const records = Array.from(keep.values())
    .sort((a, b) => (b.project_money || 0) - (a.project_money || 0));
  const rejects = Array.from(drop.values())
    .sort((a, b) => (b.money || 0) - (a.money || 0));

  /* แยก "มีระบบ/เครื่อง" ออกจาก "จ้างเหมาแรงงานล้วน" ด้วยเกณฑ์ IS_SYSTEM เดิม */
  records.forEach(r => { r._hasSystem = IS_SYSTEM.test(r.project_name || ''); });

  const sum = records.reduce((s, r) => s + (+r.project_money || 0), 0);
  console.log('\n══ สรุป ══');
  console.log('  สแกน           ' + String(scanned).padStart(8));
  console.log('  ซ้ำไฟล์อื่น     ' + String(dupOther).padStart(8));
  console.log('  คัดออก         ' + String(rejects.length).padStart(8));
  console.log('  เก็บได้         ' + String(records.length).padStart(8) +
              '  · ' + md.money(sum) + ' บาท');
  console.log('    มีระบบ/เครื่อง' + String(records.filter(r => r._hasSystem).length).padStart(8));
  console.log('    แรงงานล้วน    ' + String(records.filter(r => !r._hasSystem).length).padStart(8));

  const byReason = {};
  rejects.forEach(r => { byReason[r.reason] = (byReason[r.reason] || 0) + 1; });
  console.log('\n  เหตุผลที่คัดออก:');
  Object.entries(byReason).sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log('    ' + String(v).padStart(6) + '  ' + k));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ year: YEAR, keywords: kws, scanned,
    records, rejects }, null, 1), 'utf8');
  console.log('\nเขียน ' + path.relative(ROOT, OUT) + ' · ' + records.length + ' โครงการ');
}

(PROBE ? probeAll() : harvest())
  .catch(e => { console.error('\n*** ' + e.message); process.exit(1); });
