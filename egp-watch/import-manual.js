#!/usr/bin/env node
/* ============================================================================
   egp-watch ชั้นที่ 2 — รับผลที่คนคัดลอกมาจากหน้าเว็บ e-GP

   ทำไมต้องมี: API สพร. มีเฉพาะโครงการที่ทำสัญญาแล้ว
   ดีลที่ยัง "ประกาศเชิญชวน" (= ยังยื่นงานได้) ไม่มีใน API เลย ยืนยันแล้ว 0/16
   หน้าเว็บ e-GP มี Cloudflare Turnstile กันบอท จึงต้องให้คนเปิดเบราว์เซอร์ค้นเอง

   วิธีใช้
     1. ค้นในหน้าเว็บ e-GP แล้วคลุมตารางผลลัพธ์ → Ctrl+C
     2. วางลงไฟล์  egp-watch/inbox/YYYY-MM-DD.txt
     3. node egp-watch/import-manual.js            (หรือระบุไฟล์: ... <path>)

   รับได้ทั้งตารางที่ copy มาวาง (คั่นด้วย tab) และ CSV
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { GROUPS } = require('./config');
const md = require('./lib/mdtable');
const addedLog = require('./lib/addedlog');
const { buildAll } = require('./build-reports');

const ROOT = path.join(__dirname, '..');
const INBOX = path.join(__dirname, 'inbox');
const DRY = process.argv.includes('--dry-run');
/* --group=med|his — บังคับว่าไฟล์นี้เป็นของกลุ่มไหน
   ถ้าไม่ระบุ สคริปต์จะเดาโดยเลือกกลุ่มแรกที่มีรายการใหม่ ซึ่งผิดได้ง่าย
   เพราะ GROUPS เรียง med ก่อน his — ไฟล์ของ his จะถูกเทลงไฟล์ med แทน */
const GROUP_ARG = (process.argv.find(a => a.startsWith('--group=')) || '').split('=')[1] || null;

/* ---- แยกฟิลด์จากบรรทัดที่ copy มา ---------------------------------------- */
function splitCells(line) {
  if (line.includes('\t')) return line.split('\t').map(s => s.trim());
  // CSV แบบมี quote
  const out = []; let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const num = s => {
  const v = parseFloat(String(s || '').replace(/[^\d.]/g, ''));
  return isNaN(v) ? 0 : v;
};

/* ติดธง 🔥 ให้สถานะที่ "ยังยื่นได้" — ทั้งไฟล์ .md และ pipeline/extract-*.js
   ใช้ emoji 🔥 ในช่องสถานะเป็นตัวชี้ว่าเป็นดีลที่ยังเข้าไปเสนองานได้ (isOpen)
   ชั้นที่ 2 มีไว้เพื่อดีลพวกนี้โดยเฉพาะ ถ้าไม่ติดธงจะไม่ขึ้นในรายงานเลย */
function openStatus(s) {
  const t = String(s).replace(/^🔥\s*/, '').trim();
  if (/^ประกาศเชิญชวน|^หนังสือเชิญชวน/.test(t)) return '🔥 ประกาศเชิญชวน';
  if (/ร่าง\s*TOR|^จัดทำ\s*TOR/i.test(t))      return '🔥 จัดทำ/วิจารณ์ร่าง TOR';
  return t;
}

/* ดึงรายการจากไฟล์ที่วางมา — หาเลขโครงการ 11 หลักเป็นหลักยึด */
function parse(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = splitCells(line);
    const idCell = cells.find(c => /^\d{11}$/.test(c));
    if (!idCell) continue;
    // เดาคอลัมน์จากรูปแบบ: ตัวเลขมีคอมมา = วงเงิน, ข้อความยาวสุด = ชื่อโครงการ
    const money = cells.filter(c => /^[\d,]+(\.\d+)?$/.test(c) && c.includes(','))
                       .map(num).sort((a, b) => b - a)[0] || 0;
    const texts = cells.filter(c => c !== idCell && !/^[\d,.]+$/.test(c) && c.length > 3)
                       .sort((a, b) => b.length - a.length);
    rows.push({
      project_id: idCell,
      project_name: texts[0] || '(ไม่มีชื่อในข้อมูลที่วางมา)',
      dept_name: texts[1] || '',
      dept_sub_name: '',
      province: cells.find(c => /^[ก-๙]{3,20}$/.test(c) && c !== texts[0] && c !== texts[1]) || '—',
      project_money: money,
      project_status: openStatus(cells.find(c => /ประกาศ|ร่าง|ยกเลิก|สัญญา|ดำเนินการ/.test(c))
                                 || 'ประกาศเชิญชวน'),
      year: cells.find(c => /^25\d\d$/.test(c)) || String(require('./config').THIS_FY),
      contract: [],
      _src: 'manual',
    });
  }
  return rows;
}

/* ============================================================================ */
(() => {
  let file = process.argv.slice(2).find(a => !a.startsWith('--'));
  if (!file) {
    const f = fs.existsSync(INBOX)
      ? fs.readdirSync(INBOX).filter(x => /\.(txt|csv|tsv)$/i.test(x)).sort().pop() : null;
    if (!f) { console.error('ไม่พบไฟล์ใน egp-watch/inbox/ — วางผลที่ copy มาก่อน'); process.exit(1); }
    file = path.join(INBOX, f);
  }
  console.log('อ่าน ' + path.basename(file) + (DRY ? '  [ดูเฉย ๆ]' : ''));

  const rows = parse(fs.readFileSync(file, 'utf8'));
  if (!rows.length) {
    console.error('แยกข้อมูลไม่ได้เลย — ต้องมีเลขโครงการ 11 หลักอย่างน้อย 1 คอลัมน์');
    process.exit(1);
  }
  console.log('  แยกได้ ' + rows.length + ' รายการ');

  // แต่ละกลุ่ม: เอาเฉพาะที่ยังไม่มีในไฟล์ .md ของกลุ่มนั้น
  let total = 0;
  const targets = GROUP_ARG ? GROUPS.filter(g => g.id === GROUP_ARG) : GROUPS;
  if (GROUP_ARG && !targets.length) {
    console.error('ไม่รู้จักกลุ่ม "' + GROUP_ARG + '" — มีให้เลือก: ' + GROUPS.map(g => g.id).join(', '));
    process.exit(1);
  }
  for (const g of targets) {
    const mdPath = path.join(ROOT, g.mdFile);
    const have = md.idsInFile(mdPath);
    const fresh = rows.filter(r => !have.has(r.project_id));
    if (!fresh.length) { console.log('  [' + g.id + '] ไม่มีรายการใหม่'); continue; }

    console.log('  [' + g.id + '] ใหม่ ' + fresh.length + ' รายการ');
    fresh.slice(0, 6).forEach(r => console.log('       ' +
      md.money(r.project_money).padStart(12) + '  ' + r.project_name.slice(0, 58)));
    if (DRY) { total += fresh.length; continue; }

    const regionOf = md.provinceRegionMap(mdPath);
    let idx = md.lastIndexInSection(mdPath, g.sectionTitle);
    const newRows = fresh.map(r => md.toRow(r, {
      index: ++idx, columns: g.columns, region: regionOf[r.province] || '—' }));
    const sum = fresh.reduce((s, r) => s + r.project_money, 0);
    const moved = md.appendToSection(mdPath, g.sectionTitle, newRows, fresh.length, sum);
    addedLog.record(fresh.map(r => r.project_id));
    // บันทึกลง known-ids ด้วย ไม่งั้นรอบ watch-daily ถัดไปจะมองว่าเป็นของใหม่แล้วเติมซ้ำ
    const STATE = path.join(__dirname, 'state', 'known-ids.json');
    let known = {};
    try { known = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
    known[g.id] = Array.from(new Set((known[g.id] || []).concat(fresh.map(r => r.project_id))));
    fs.mkdirSync(path.dirname(STATE), { recursive: true });
    fs.writeFileSync(STATE, JSON.stringify(known), 'utf8');
    console.log('       ' + g.mdFile + ': ' + moved.from + ' → ' + moved.to);
    total += fresh.length;
    break;   // รายการที่ copy มาชุดหนึ่งเป็นของกลุ่มเดียว ไม่ใส่ซ้ำหลายกลุ่ม
  }

  if (DRY) { console.log('\n[--dry-run] ไม่ได้แก้ไฟล์'); return; }
  if (!total) { console.log('\nไม่มีอะไรต้องเพิ่ม'); return; }
  console.log('\nสร้างรายงานใหม่:');
  buildAll();
})();
