#!/usr/bin/env node
/* ============================================================================
   ลบโครงการออกจากไฟล์ .md — ใช้คู่กับแทป "รายการใหม่" ในรายงาน

     node egp-watch/remove-ids.js 69012345678 69087654321
     node egp-watch/remove-ids.js --dry-run 69012345678

   ทำอะไร: ลบแถวออกจากตาราง · เรียงเลขลำดับใหม่ · อัปเดตยอดในหัว section ·
   จำไว้ว่าเคยลบแล้ว (กันดึงกลับมาอีกรอบหน้า) · สร้างรายงาน HTML ใหม่

   ป้องกันไว้: ลบได้เฉพาะรายการที่อยู่ใน section เสริม/eMAR เท่านั้น
   ชุดข้อมูลจากหน้าเว็บที่ตรวจสอบยอดแล้วจะไม่ถูกแตะ
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { GROUPS } = require('./config');
const md = require('./lib/mdtable');
const { buildAll } = require('./build-reports');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(__dirname, 'state', 'known-ids.json');
const LOG = path.join(__dirname, 'state', 'added-log.json');
const BLOCK = path.join(__dirname, 'state', 'removed-ids.json');
const DRY = process.argv.includes('--dry-run');

const ids = process.argv.slice(2).filter(a => /^\d{11}$/.test(a));
if (!ids.length) {
  console.error('ใส่เลขโครงการ 11 หลักอย่างน้อย 1 รายการ\n' +
                '  ตัวอย่าง: node egp-watch/remove-ids.js 69012345678');
  process.exit(1);
}

const money = n => {
  const v = Number(n || 0);
  return Number.isInteger(v) ? v.toLocaleString('en-US')
    : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

let removedTotal = 0;

for (const g of GROUPS) {
  const mdPath = path.join(ROOT, g.mdFile);
  let s = fs.readFileSync(mdPath, 'utf8');

  // ขอบเขต section ที่อนุญาตให้ลบ
  const esc = g.sectionTitle.replace(/[.*+?^${}()|[\]\\—]/g, '\\$&');
  const hdrRe = new RegExp('^## ' + esc + ' \\((\\d+) โครงการ · ([\\d,.]+) บาท\\)$', 'm');
  const hdr = s.match(hdrRe);
  if (!hdr) continue;

  const secStart = hdr.index + hdr[0].length;
  let secEnd = s.indexOf('\n## ', secStart);
  if (secEnd < 0) secEnd = s.length;
  const head = s.slice(0, secStart);
  const body = s.slice(secStart, secEnd);
  const tail = s.slice(secEnd);

  const target = new Set(ids);
  const kept = [];
  const gone = [];
  let renum = 0;

  const lines = body.split('\n').map(line => {
    const m = line.match(/^\|\s*\d+\s*\|(?:\s*(25\d\d)\s*\|)?\s*`(\d+)`/);
    if (!m) return line;
    const id = m[2];
    if (target.has(id)) {
      // เก็บวงเงินไว้หักออกจากยอดหัว section
      const cells = line.split('|');
      const budgetCell = cells[g.columns === 16 ? 7 : 6] || '0';
      gone.push({ id, budget: Number(String(budgetCell).replace(/[^\d.]/g, '')) || 0 });
      return null;
    }
    kept.push(id);
    // เรียงเลขลำดับใหม่
    return line.replace(/^\|\s*\d+\s*\|/, '| ' + (++renum) + ' |');
  }).filter(l => l !== null);

  if (!gone.length) continue;

  const newBody = lines.join('\n');
  const oldN = Number(hdr[1]), oldV = Number(hdr[2].replace(/,/g, ''));
  const cutV = gone.reduce((a, b) => a + b.budget, 0);
  const newHdr = '## ' + g.sectionTitle + ' (' + (oldN - gone.length) +
                 ' โครงการ · ' + money(oldV - cutV) + ' บาท)';

  console.log('[' + g.id + '] ' + g.mdFile);
  gone.forEach(x => console.log('   ลบ ' + x.id + '  ' + money(x.budget) + ' บาท'));
  console.log('   ' + oldN + ' → ' + (oldN - gone.length) + ' โครงการ  ·  −' + money(cutV) + ' บาท');
  removedTotal += gone.length;

  if (!DRY) {
    fs.writeFileSync(mdPath, head.replace(hdr[0], newHdr) + newBody + tail, 'utf8');
  }
}

if (!removedTotal) {
  console.log('ไม่พบเลขโครงการที่ระบุใน section ที่ลบได้');
  console.log('  (ลบได้เฉพาะรายการที่นำเข้าเพิ่ม ไม่แตะชุดข้อมูลจากหน้าเว็บ)');
  process.exit(0);
}

if (DRY) { console.log('\n[--dry-run] ไม่ได้แก้ไฟล์'); process.exit(0); }

/* ---- อัปเดต state: เอาออกจาก known/added แล้วจำว่าเคยลบ -------------------- */
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

const known = readJSON(STATE, {});
// เอาออกจาก known เฉพาะกลุ่มที่แถวนั้นหายไปจากไฟล์ .md จริง ๆ
// เลขโครงการเดียวกันอาจอยู่ในไฟล์ของอีกกลุ่มด้วย และอยู่ใน section ที่ล็อกไว้ซึ่งสคริปต์นี้ไม่แตะ
// ถ้าตัดออกจาก known ทั้งหมด รอบดึงถัดไปจะมองว่าเป็นของใหม่แล้วดึงกลับเข้ามาซ้ำ
for (const g of GROUPS) {
  if (!known[g.id]) continue;
  const stillThere = md.idsInFile(path.join(ROOT, g.mdFile));
  known[g.id] = known[g.id].filter(id => !ids.includes(id) || stillThere.has(id));
}
fs.writeFileSync(STATE, JSON.stringify(known), 'utf8');

const log = readJSON(LOG, {});
ids.forEach(id => delete log[id]);
fs.writeFileSync(LOG, JSON.stringify(log), 'utf8');

// รายการที่ถูกลบด้วยมือ = เคยตรวจแล้วว่าไม่เอา ห้ามดึงกลับมาอีก
const blocked = readJSON(BLOCK, []);
const merged = Array.from(new Set(blocked.concat(ids)));
fs.writeFileSync(BLOCK, JSON.stringify(merged), 'utf8');
console.log('\nจำไว้แล้วว่าไม่เอา ' + merged.length + ' รายการ (state/removed-ids.json)');

console.log('\nสร้างรายงานใหม่:');
buildAll();
