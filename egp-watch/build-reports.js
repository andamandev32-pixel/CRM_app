/* ============================================================================
   สร้างรายงาน HTML ทั้ง 4 ไฟล์ + หน้ารวม market-reports.html ใหม่จากไฟล์ .md ปัจจุบัน
   = extract (.md -> JSON) แล้ว inline JSON เข้า template

   ใช้ได้ทั้งเรียกจาก watch-daily.js และเรียกตรง ๆ:  node egp-watch/build-reports.js
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const egpLink = require('./lib/egplink');

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
    out:      path.join(ROOT, 'medication-market-report.html'),
    md: 'egp-medication-management-2568-2569.md', icon: 'i-pill',
    title: 'ตลาดระบบยาในโรงพยาบาล',
    desc: 'เครื่องจัดยา · ตู้ยา · รถเข็นจ่ายยา · วัสดุ · eMAR/Smart IPD' },
  { name: 'HIS',
    extract:  path.join(HERE, 'pipeline', 'extract-his.js'),
    produced: 'data-his.json',
    data:     path.join(HERE, 'state', 'data-his.json'),
    tpl:      path.join(HERE, 'templates', 'report-his.html'),
    out:      path.join(ROOT, 'his-market-report.html'),
    md: 'egp-2569-healthcare-procurement.md', icon: 'i-hosp',
    title: 'ตลาด HIS · ระบบคิว · Kiosk · Paperless',
    desc: 'HIS · ระบบคิว · ตู้ Kiosk · IPD Paperless / EMR' },
  { name: 'คลัง/ERP',
    extract:  path.join(HERE, 'pipeline', 'extract-inv.js'),
    produced: 'data-inv.json',
    data:     path.join(HERE, 'state', 'data-inv.json'),
    tpl:      path.join(HERE, 'templates', 'report-inv.html'),
    out:      path.join(ROOT, 'inventory-market-report.html'),
    md: 'egp-inventory-erp-2569.md', icon: 'i-box',
    title: 'ตลาดระบบคลัง · เวชภัณฑ์ · ERP',
    desc: 'ระบบคลังเวชภัณฑ์ · คลังพัสดุ · ERP' },
  { name: 'โลจิสติกส์',
    extract:  path.join(HERE, 'pipeline', 'extract-log.js'),
    produced: 'data-log.json',
    data:     path.join(HERE, 'state', 'data-log.json'),
    tpl:      path.join(HERE, 'templates', 'report-log.html'),
    out:      path.join(ROOT, 'logistics-market-report.html'),
    md: 'egp-hospital-logistics-2569.md', icon: 'i-truck',
    title: 'ตลาดงานโลจิสติกส์ในโรงพยาบาล',
    desc: 'เปล · ขนส่งยา/เอกสาร · ผ้า · ขยะติดเชื้อ · อาหาร · รถรับส่ง' },
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
  fs.writeFileSync(data, JSON.stringify(withLinks(JSON.parse(fs.readFileSync(produced, 'utf8')))), 'utf8');

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

/* แถวที่มาจาก API ไม่มีลิงก์ e-GP มาด้วย — สร้างจากเลขโครงการให้ (ดู lib/egplink.js)
   ไฟล์ HIS เก็บเฉพาะ token แล้วให้ template ต่อ urlPrefix เอง ไฟล์อื่นเก็บลิงก์เต็ม */
function withLinks(db) {
  for (const r of db.records || []) {
    if (r.url || !/^\d{11}$/.test(String(r.id))) continue;
    r.url = db.urlPrefix ? egpLink.token(r.id) : egpLink.url(r.id);
  }
  return db;
}

/* ---- หน้ารวม market-reports.html ------------------------------------------
   สรุปทุกกลุ่ม + ดีลที่ยังยื่นได้ + รายการใหม่ + รายชื่อไฟล์ทั้งหมด */
const PORTAL_TPL = path.join(HERE, 'templates', 'portal.html');
const PORTAL_OUT = path.join(ROOT, 'market-reports.html');

// เวลาท้องถิ่นแบบ ISO ไม่มีโซน (2026-09-30T15:30) ให้ตรงกับรูปแบบ addedAt
const localIso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

function buildPortal({ quiet } = {}) {
  const orgs = new Set(), open = [], added = [], years = new Set();
  let latest = '';
  const reports = JOBS.map(j => {
    const db = JSON.parse(fs.readFileSync(j.data, 'utf8'));
    const R = db.records;
    const full = u => !u ? null : /^https?:/.test(u) ? u : (db.urlPrefix || egpLink.PREFIX) + u;
    const row = r => ({ group: j.name, id: r.id, name: r.name, org: r.org, province: r.province,
      budget: r.budget || 0, status: r.status, isOpen: !!r.isOpen, announced: r.announced,
      addedAt: r.addedAt || null, winners: r.winners || [], keywords: (r.keywords || []).slice(0, 3),
      url: full(r.url) || egpLink.url(r.id) });
    R.forEach(r => {
      orgs.add(r.org);
      for (const d of [r.announced, r.resulted]) if (d && d > latest) latest = d;
      const fy = +String(r.announced || '').slice(0, 4);
      if (fy > 2500) years.add(fy);
      if (r.isOpen) open.push(row(r));
      if (r.addedAt) added.push(row(r));
    });

    // ระบบยาไม่มี productSummary — ใช้หมวดที่พบบ่อยแทน
    let topProducts, productLabel = 'ผลิตภัณฑ์/ลักษณะงานที่พบมากสุด';
    if (db.productSummary) {
      topProducts = db.productSummary.slice().sort((a, b) => b.projects - a.projects).slice(0, 3)
        .map(p => ({ name: p.name, projects: p.projects }));
    } else {
      const c = {};
      R.forEach(r => (r.categories || []).forEach(k => { c[k] = (c[k] || 0) + 1; }));
      topProducts = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([name, projects]) => ({ name, projects }));
      productLabel = 'หมวดที่พบมากสุด';
    }

    return { title: j.title, group: j.name, desc: j.desc, icon: j.icon,
      file: path.basename(j.out), md: j.md,
      projects: R.length, value: R.reduce((s, r) => s + (+r.budget || 0), 0),
      orgs: new Set(R.map(r => r.org)).size, open: R.filter(r => r.isOpen).length,
      added: R.filter(r => r.addedAt).length,
      lastAdded: R.map(r => r.addedAt).filter(Boolean).sort().pop() || null,
      productLabel, topProducts,
      topVendors: (db.vendors || []).slice().sort((a, b) => b.value - a.value).slice(0, 3)
        .map(v => ({ name: v.name.replace(/\s+/g, ' '), value: v.value })) };
  });

  const fileInfo = (rel, kind) => {
    const st = fs.statSync(path.join(ROOT, rel));
    return { path: rel.split(path.sep).join('/'), name: path.basename(rel), kind,
             kb: Math.max(1, Math.round(st.size / 1024)), mtime: localIso(st.mtime) };
  };
  const digests = fs.readdirSync(path.join(HERE, 'digest'))
    .filter(f => f.endsWith('.md')).sort().reverse();
  const files = [
    ...JOBS.map(j => fileInfo(path.basename(j.out), 'รายงาน HTML · ' + j.name)),
    ...JOBS.map(j => fileInfo(j.md, 'ไฟล์ข้อมูล .md · ' + j.name)),
    ...digests.map(f => fileInfo(path.join('egp-watch', 'digest', f), 'ผลการดึงแต่ละรอบ')),
    fileInfo(path.join('egp-watch', 'README.md'), 'คู่มือ egp-watch'),
  ];

  open.sort((a, b) => b.budget - a.budget);
  added.sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.budget - a.budget);
  const ys = [...years].sort();
  const data = { built: localIso(new Date()), latest, orgs: orgs.size,
    years: ys.length > 1 ? ys[0] + '–' + ys[ys.length - 1] : String(ys[0] || ''),
    reports, open, added, files };

  const html = fs.readFileSync(PORTAL_TPL, 'utf8');
  if (!html.includes('/*__DATA__*/null')) throw new Error('template ไม่มี placeholder: ' + PORTAL_TPL);
  // ใช้ฟังก์ชันแทน string เพราะข้อมูลอาจมี $& $' ที่ replace จะตีความเป็นคำสั่ง
  fs.writeFileSync(PORTAL_OUT, html.replace('/*__DATA__*/null', () => JSON.stringify(data)), 'utf8');
  if (!quiet) console.log('  หน้ารวม   → ' + path.basename(PORTAL_OUT) + '  ' +
    (fs.statSync(PORTAL_OUT).size / 1024).toFixed(0) + ' KB');
}

function buildAll(opts) {
  let bad = 0;
  for (const j of JOBS) bad += build(j, opts).fails.length;
  buildPortal(opts);
  return bad;
}

module.exports = { buildAll, buildPortal, JOBS };

if (require.main === module) {
  console.log('สร้างรายงานใหม่จากไฟล์ .md ปัจจุบัน');
  const bad = buildAll();
  process.exit(bad ? 1 : 0);
}
