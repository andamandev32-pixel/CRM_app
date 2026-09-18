#!/usr/bin/env node
/* ============================================================================
   egp-watch — งานรายวัน: มีงานใหม่ในกลุ่มที่สนใจเข้ามาไหม

     node egp-watch/watch-daily.js            ทำจริง (เติมไฟล์ + rebuild รายงาน)
     node egp-watch/watch-daily.js --dry-run  ดูเฉย ๆ ไม่แก้ไฟล์

   ข้อจำกัดที่ต้องรู้: API สพร. มีเฉพาะโครงการที่ทำสัญญาแล้ว
   ดีลที่ยัง "ประกาศเชิญชวน" (ยื่นได้) จะไม่โผล่ที่นี่ — ต้องใช้ชั้นที่ 2
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { GROUPS, YEARS, MANUAL_KEYWORDS, THIS_FY } = require('./config');
const api = require('./lib/api');
const { accept } = require('./lib/filter');
const md = require('./lib/mdtable');
const addedLog = require('./lib/addedlog');
const { buildAll } = require('./build-reports');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(__dirname, 'state', 'known-ids.json');
const DIGEST_DIR = path.join(__dirname, 'digest');
const DRY = process.argv.includes('--dry-run');
const runStamp = require('./lib/addedlog').stamp();

const today = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
         '-' + String(d.getDate()).padStart(2, '0');
};

/* ---- state: เลขโครงการที่รู้จักแล้ว ---------------------------------------- */
function loadKnown() {
  if (fs.existsSync(STATE)) return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  // ครั้งแรก: seed จากไฟล์ .md ที่มีอยู่ (แหล่งความจริง)
  const seed = {};
  for (const g of GROUPS) {
    seed[g.id] = Array.from(md.idsInFile(path.join(ROOT, g.mdFile)));
    console.log('  seed ' + g.id + ': ' + seed[g.id].length + ' เลขโครงการจาก ' + g.mdFile);
  }
  return seed;
}

/* ============================================================================ */
(async () => {
  console.log('egp-watch · ' + today() + (DRY ? '  [ดูเฉย ๆ ไม่แก้ไฟล์]' : '') +
              '  ปีงบ ' + YEARS.join(', ') + '\n');

  const known = loadKnown();
  // รายการที่เคยตรวจแล้วลบทิ้งด้วยมือ — ห้ามดึงกลับมาอีก
  let BLOCKED = new Set();
  try { BLOCKED = new Set(JSON.parse(fs.readFileSync(path.join(__dirname,'state','removed-ids.json'),'utf8'))); } catch (e) {}
  if (BLOCKED.size) console.log('  ข้ามรายการที่เคยลบไว้ ' + BLOCKED.size + ' รายการ\n');
  const result = [];        // { group, records[] }

  for (const g of GROUPS) {
    const seen = new Set(known[g.id] || []);
    // กลุ่มที่ประกาศว่าไม่ซ้ำกับกลุ่มอื่น — ดึงเลขของกลุ่มนั้นมานับเป็น "เคยเห็นแล้ว" ด้วย
    (g.excludeIdsFrom || []).forEach(other =>
      (known[other] || []).forEach(id => seen.add(id)));
    const fresh = new Map();
    let scanned = 0, rejected = 0;
    process.stdout.write('▸ ' + g.label + '\n');

    for (const kw of g.keywords) {
      for (const year of YEARS) {
        let r;
        try { r = await api.search(kw, year); }
        catch (e) { console.error('   ! ' + kw + ' — ' + e.message.split('\n')[0]); continue; }
        scanned += r.rows.length;
        for (const rec of r.rows) {
          if (seen.has(rec.project_id) || fresh.has(rec.project_id) || BLOCKED.has(rec.project_id)) continue;
          const v = accept(rec, g.id);
          if (!v.ok) { rejected++; continue; }
          fresh.set(rec.project_id, Object.assign({}, rec, { _kw: kw }));
        }
        await api.sleep(api.DELAY_MS);
      }
    }
    const recs = Array.from(fresh.values()).sort(
      (a, b) => (b.project_money || 0) - (a.project_money || 0));
    console.log('   สแกน ' + scanned + ' · คัดออก ' + rejected +
                ' · ' + (recs.length ? 'งานใหม่ ' + recs.length : 'ไม่มีงานใหม่'));
    result.push({ group: g, records: recs });
  }

  /* ---- เขียน digest ------------------------------------------------------- */
  const total = result.reduce((s, r) => s + r.records.length, 0);
  const lines = ['# งานใหม่จาก e-GP · ' + today(), ''];
  if (!total) {
    lines.push('**ไม่มีงานใหม่** ในกลุ่มที่เฝ้าดู (ปีงบ ' + YEARS.join(', ') + ')', '');
  }
  for (const { group, records } of result) {
    if (!records.length) continue;
    const sum = records.reduce((s, r) => s + (+r.project_money || 0), 0);
    lines.push('## ' + group.label + ' — ' + records.length + ' โครงการ · ' +
               md.money(sum) + ' บาท', '',
      '| เลขโครงการ | โครงการ | หน่วยงาน | จังหวัด | วงเงิน | ผู้ชนะ | คีย์เวิร์ด |',
      '|---|---|---|---|---|---|---|');
    for (const r of records) {
      const c = (r.contract || [])[0] || {};
      lines.push('| `' + r.project_id + '` | ' + (r.project_name || '') + ' | ' +
        (r.dept_sub_name || r.dept_name || '') + ' | ' + (r.province || '—') + ' | ' +
        md.money(r.project_money) + ' | ' + (c.winner_name || '—') + ' | ' + r._kw + ' |');
    }
    lines.push('');
  }
  // ชั้นที่ 2 — เตือนทุกวันจันทร์
  if (new Date().getDay() === 1) {
    lines.push('---', '', '## ⚠ วันจันทร์ — ถึงรอบเช็คหน้าเว็บด้วยตัวเอง', '',
      'API มีเฉพาะโครงการที่**ทำสัญญาแล้ว** ดีลที่ยัง "ประกาศเชิญชวน" (ยังยื่นได้) ไม่โผล่ที่นี่เลย',
      '', '1. เปิด https://process5.gprocurement.go.th/egp-agpc01-web/announcement',
      '2. ค้นทีละคำ เลือกปีงบ ' + THIS_FY + ' — ดูเฉพาะสถานะ *ประกาศเชิญชวน* และ *ร่าง TOR*', '',
      MANUAL_KEYWORDS.map(k => '   - `' + k + '`').join('\n'), '',
      '3. คัดลอกตารางผลลัพธ์วางใน `egp-watch/inbox/' + today() + '.txt`',
      '4. รัน `node egp-watch/import-manual.js`', '');
  }

  const digestPath = path.join(DIGEST_DIR, 'งานใหม่-' + today() + '.md');
  if (!DRY) {
    fs.mkdirSync(DIGEST_DIR, { recursive: true });
    const t = new Date().toTimeString().slice(0, 5);
    if (!fs.existsSync(digestPath)) {
      fs.writeFileSync(digestPath, lines.join('\n'), 'utf8');
    } else if (!total) {
      // รันซ้ำวันเดียวกันแล้วไม่เจอของใหม่ — แค่ต่อท้ายว่าเช็คแล้ว
      fs.appendFileSync(digestPath, '\n_เช็คซ้ำ ' + t + ' — ไม่มีงานใหม่เพิ่ม_\n', 'utf8');
    } else {
      // รันซ้ำวันเดียวกันแล้วเจอของใหม่ — ต่อท้าย ห้ามทับผลรอบแรก
      // (รอบ 9 ก.ย. 69 เคยเสียไปแบบนี้: digest 149 รายการถูกรอบสอง 16 รายการเขียนทับ)
      fs.appendFileSync(digestPath,
        '\n\n---\n\n# รอบเพิ่มเติม ' + t + ' น.\n\n' + lines.slice(2).join('\n') + '\n', 'utf8');
    }
  }

  if (!total) {
    console.log('\nไม่มีงานใหม่' + (DRY ? '' : ' · เขียน ' + path.basename(digestPath) + ' แล้ว'));
    return;
  }

  console.log('\n══ พบงานใหม่รวม ' + total + ' โครงการ ══');
  for (const { group, records } of result) {
    records.slice(0, 5).forEach(r => console.log('  [' + group.id + '] ' +
      md.money(r.project_money).padStart(13) + '  ' + (r.project_name || '').slice(0, 62)));
    if (records.length > 5) console.log('  [' + group.id + '] … อีก ' + (records.length - 5) + ' รายการ');
  }

  if (DRY) { console.log('\n[--dry-run] ไม่ได้แก้ไฟล์ใด ๆ'); return; }

  /* ---- เติมเข้าไฟล์ .md แล้ว rebuild รายงาน ------------------------------- */
  console.log('');
  for (const { group, records } of result) {
    if (!records.length) continue;
    const mdPath = path.join(ROOT, group.mdFile);
    const regionOf = md.provinceRegionMap(mdPath);
    let idx = md.lastIndexInSection(mdPath, group.sectionTitle);
    const rows = records.map(r => md.toRow(r, {
      index: ++idx, columns: group.columns, region: regionOf[r.province] || '—' }));
    const sum = records.reduce((s, r) => s + (+r.project_money || 0), 0);
    const moved = md.appendToSection(mdPath, group.sectionTitle, rows, records.length, sum);
    console.log('  ' + group.mdFile + ': ' + moved.from + ' → ' + moved.to + ' โครงการ');
    known[group.id] = (known[group.id] || []).concat(records.map(r => r.project_id));
    addedLog.record(records.map(r => r.project_id), runStamp);
  }

  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify(known), 'utf8');
  console.log('\nสร้างรายงานใหม่:');
  buildAll();
  console.log('\n→ ' + path.basename(digestPath));
})().catch(e => { console.error('\n*** ' + e.message); process.exit(1); });
