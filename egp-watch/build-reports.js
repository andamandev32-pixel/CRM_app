/* ============================================================================
   สร้างรายงาน HTML ทั้งสองไฟล์ใหม่จากไฟล์ .md ปัจจุบัน
   = extract (.md -> JSON) แล้ว inline JSON เข้า template

   ใช้ได้ทั้งเรียกจาก watch-daily.js และเรียกตรง ๆ:  node egp-watch/build-reports.js
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const HERE = __dirname;

// produced = ชื่อไฟล์ที่สคริปต์ extract เขียนออกมาในโฟลเดอร์ pipeline/
// (เดิม hardcode เป็น ternary med/his — พอมีกลุ่มที่ 3 ต้องระบุตรง ๆ ต่อ job)
const JOBS = [
  { name: 'ระบบยา',
    extract:  path.join(HERE, 'pipeline', 'extract-med.js'),
    produced: 'data.json',
    data:     path.join(HERE, 'state', 'data-med.json'),
    tpl:      path.join(HERE, 'templates', 'report-med.html'),
    out:      path.join(ROOT, 'medication-market-report.html') },
  { name: 'HIS',
    extract:  path.join(HERE, 'pipeline', 'extract-his.js'),
    produced: 'data-his.json',
    data:     path.join(HERE, 'state', 'data-his.json'),
    tpl:      path.join(HERE, 'templates', 'report-his.html'),
    out:      path.join(ROOT, 'his-market-report.html') },
  { name: 'คลัง/ERP',
    extract:  path.join(HERE, 'pipeline', 'extract-inv.js'),
    produced: 'data-inv.json',
    data:     path.join(HERE, 'state', 'data-inv.json'),
    tpl:      path.join(HERE, 'templates', 'report-inv.html'),
    out:      path.join(ROOT, 'inventory-market-report.html') },
];

function build({ name, extract, produced: producedName, data, tpl, out }, { quiet } = {}) {
  // สคริปต์ extract เขียน data.json ลงโฟลเดอร์เดียวกับตัวมันเอง
  // สคริปต์ extract จะ exit 1 เมื่อตรวจยอดไม่ผ่าน — รับ output มารายงาน ไม่ให้ล้มทั้งงาน
  let log;
  try {
    log = execFileSync('node', [extract], { encoding: 'utf8', cwd: path.dirname(extract) });
  } catch (e) {
    log = (e.stdout || '') + (e.stderr || '');
    if (!log.trim()) throw e;
  }
  const produced = path.join(path.dirname(extract), producedName);
  fs.copyFileSync(produced, data);

  const html = fs.readFileSync(tpl, 'utf8');
  if (!html.includes('/*__DATA__*/')) throw new Error('template ไม่มี placeholder: ' + tpl);
  fs.writeFileSync(out, html.replace('/*__DATA__*/null', fs.readFileSync(data, 'utf8')), 'utf8');

  const fails = log.split('\n').filter(l => l.includes('FAIL'));
  if (!quiet) {
    console.log('  ' + name.padEnd(8) + '→ ' + path.basename(out) +
                '  ' + (fs.statSync(out).size / 1024).toFixed(0) + ' KB' +
                (fails.length ? '   ⚠ ตรวจยอดไม่ผ่าน ' + fails.length + ' ข้อ' : '   ตรวจยอดผ่าน'));
    fails.forEach(f => console.log('     ' + f.trim()));
  }
  return { fails };
}

function buildAll(opts) {
  let bad = 0;
  for (const j of JOBS) bad += build(j, opts).fails.length;
  return bad;
}

module.exports = { buildAll, JOBS };

if (require.main === module) {
  console.log('สร้างรายงานใหม่จากไฟล์ .md ปัจจุบัน');
  const bad = buildAll();
  process.exit(bad ? 1 : 0);
}
