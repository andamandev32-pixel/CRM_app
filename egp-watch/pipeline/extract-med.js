const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Lenovo/Documents/App_dev/CRM_app';
const MED = ROOT + '/egp-medication-management-2568-2569.md';
const HIS = ROOT + '/egp-2569-healthcare-procurement.md';

const clean = s => (s || '').replace(/\u00a0/g, ' ').trim();
const num = s => {
  const t = clean(s).replace(/[*_`,\s]/g, '');
  if (!t || t === '—' || t === '-') return null;
  const v = parseFloat(t);
  return isNaN(v) ? null : v;
};

// ---- ชื่อโครงการมาในรูป [ชื่อ](url) ----------------------------------------
function splitLink(cell) {
  const m = clean(cell).match(/^\[([\s\S]*)\]\((\S+)\)$/);
  return m ? { name: clean(m[1]), url: m[2] } : { name: clean(cell), url: null };
}

// ---- วันที่ไทย "23 มิ.ย. 69" -> "2569-06-23" -------------------------------
const TH_MONTH = { 'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
                   'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12 };
function thDate(cell) {
  const m = clean(cell).match(/^(\d{1,2})\s+(\S+)\s+(\d{2})$/);
  if (!m || !TH_MONTH[m[2]]) return null;
  const y = 2500 + Number(m[3]);
  return y + '-' + String(TH_MONTH[m[2]]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
}

// ---- Tier: เกณฑ์ minRevenue ยกมาจาก js/data/tier_config.js ------------------
const TIERS = [
  { id: 'T1', name: 'T1 Strategic',   minRevenue: 10000000, badge: 'danger'    },
  { id: 'T2', name: 'T2 Key Account', minRevenue: 5000000,  badge: 'warning'   },
  { id: 'T3', name: 'T3 Standard',    minRevenue: 1000000,  badge: 'success'   },
  { id: 'T4', name: 'T4 Prospect',    minRevenue: 0,        badge: 'secondary' },
];
const tierOf = v => (TIERS.find(t => (v || 0) >= t.minRevenue) || TIERS[3]).id;

// ---- Sales Play จากคอลัมน์ "รูปแบบ" ----------------------------------------
const PLAY = {
  'จัดซื้อ/ติดตั้ง': 'ดีลเครื่องใหม่',
  'เช่า': 'ดีลเช่า',
  'MA/ซ่อมบำรุง': 'ดีล MA ต่ออายุ',
  'วัสดุสิ้นเปลือง': 'ดีลวัสดุสิ้นเปลือง',
};

// ---- Segment: ลำดับการเช็คสำคัญ ห้ามสลับ (ชื่อซ้อนกัน) ---------------------
const SEGMENTS = [
  ['โรงเรียนแพทย์/มหาวิทยาลัย', /คณะแพทยศาสตร์|มหาวิทยาลัย|วิทยาลัย|ศิริราช|รามาธิบดี|จุฬาลงกรณ์|ธรรมศาสตร์|สงขลานครินทร์/],
  ['รพ.เฉพาะทาง/สถาบัน', /มะเร็ง|ธัญญารักษ์|จิตเวช|สวนปรุง|ศรีธัญญา|พระศรีมหาโพธิ์|ทรวงอก|ประสาท|ราชานุกูล|สมเด็จเจ้าพระยา|นิติจิตเวช|โรคผิวหนัง|สิรินธร.*ฟื้นฟู/],
  ['สสจ./รพ.สต./สสอ.', /^สำนักงานสาธารณสุข|ส่งเสริมสุขภาพตำบล|สาธารณสุขอำเภอ/],
  ['ทหาร/ตำรวจ', /ค่าย|ทหาร|ตำรวจ|กองทัพ|สมเด็จพระปิ่นเกล้า|ภูมิพล|พระมงกุฎ/],
  ['สังกัด กทม.', /เวชการุณย์|ตากสิน|เจริญกรุง|กลาง|ราชพิพัฒน์|สิรินธร|หลวงพ่อทวีศักดิ์|ลาดกระบัง|บางนา|คลองสามวา|บางขุนเทียน|ผู้สูงอายุบางขุนเทียน/],
];
const segmentOf = org => (SEGMENTS.find(s => s[1].test(org)) || ['รพ.ศูนย์/ทั่วไป/ชุมชน'])[0];

// ---- จุดบริการ OPD / IPD ---------------------------------------------------
function careSettingOf(name) {
  const opd = /ผู้ป่วยนอก|OPD|opd/.test(name);
  const ipd = /ผู้ป่วยใน|IPD|ipd|หอผู้ป่วย/.test(name);
  if (opd && ipd) return 'OPD+IPD';
  if (opd) return 'OPD';
  if (ipd) return 'IPD';
  if (/ห้องผ่าตัด|ฉุกเฉิน|ER|วิสัญญี|ICU/.test(name)) return 'จุดบริการอื่น';
  return 'ไม่ระบุ';
}

// ---- คีย์เวิร์ด: ชุดเดิมจากภาคผนวก + คำวัสดุที่โผล่ในชื่อจริง --------------
const KEYWORDS = [
  'จัดยาอัตโนมัติ', 'เครื่องจัดยา', 'รถเข็นจ่ายยา', 'นับเม็ดยา', 'จ่ายยาอัตโนมัติ',
  'ซองยา', 'เครื่องผสมยา', 'ระบบจ่ายยา', 'ตู้เก็บยา', 'ซองบรรจุยา', 'คลังยา',
  'หุ่นยนต์จัดยา', 'ตู้จ่ายยา', 'เครื่องจ่ายยา', 'รถจ่ายยา',
  'หมึกพิมพ์', 'บรรจุภัณฑ์', 'ผ้าหมึก',
];
const EMAR_CAT_ = 'ระบบบันทึกการให้ยาผู้ป่วยใน (eMAR) / Smart IPD';
const KEYWORDS_EMAR = ['IPD Paperless', 'Paperless', 'EMR', 'eMAR', 'เวชระเบียน', 'ไร้กระดาษ',
  'ผู้ป่วยใน', 'บริหารยา', 'บันทึกข้อมูล', 'Smart IPD', 'HOSxP', 'สารสนเทศ',
  'บริหารจัดการผู้ป่วยใน', 'Electronic Administration Record',
  // คำจากรอบดึงเพิ่มผ่าน API ทางการ (9 ก.ย. 69)
  'บริหารจัดการยา', 'หอผู้ป่วย', 'Smart OPD', 'เวชภัณฑ์'];
const keywordsOf = (name, isEmar) =>
  (isEmar ? KEYWORDS_EMAR : KEYWORDS).filter(k => name.toLowerCase().includes(k.toLowerCase()));

// ---- กลุ่มงาน: หมวด eMAR/Smart IPD มาจากการดึงคนละรอบ ต้องแยกให้เห็นชัด -----
const EMAR_CAT = 'ระบบบันทึกการให้ยาผู้ป่วยใน (eMAR) / Smart IPD';
const groupOf = cats => cats.includes(EMAR_CAT) ? 'Smart IPD / eMAR' : 'ระบบยา';

// ============================================================================
const medLines = fs.readFileSync(MED, 'utf8').split(/\r?\n/);
const ROW = /^\|\s*\d+\s*\|\s*25\d\d\s*\|\s*`/;

const byId = new Map();
let section = '', catRows = 0, hotRows = 0;

for (const line of medLines) {
  if (line.startsWith('## ')) { section = clean(line.slice(3)); continue; }
  if (!ROW.test(line)) continue;

  const p = line.split('|');
  const id = clean(p[3]).replace(/`/g, '');

  // section 🔥 มี 13 ช่อง — ไม่สร้าง record ใหม่ แค่ติดธง
  if (p.length === 13) {
    hotRows++;
    if (byId.has(id)) byId.get(id).isOpen = true;
    continue;
  }
  if (p.length !== 16) continue;
  catRows++;

  const category = section.replace(/\s*\(\d+\s*โครงการ[\s\S]*$/, '').trim();

  if (byId.has(id)) {                        // โครงการเดิม อยู่หลายหมวด
    const r = byId.get(id);
    if (!r.categories.includes(category)) r.categories.push(category);
    continue;
  }

  const link = splitLink(p[4]);
  const org = clean(p[5]);
  const pv = clean(p[6]).match(/^(.*?)\s*\((.*?)\)\s*$/);
  const budget = num(p[7]) || 0;
  const form = clean(p[8]);
  const tm = clean(p[9]).split(' / ');
  const statusRaw = clean(p[12]);
  const priceCell = clean(p[14]);
  const isOffer = /เสนอ/.test(priceCell);

  byId.set(id, {
    id,
    fy: Number(clean(p[2])),
    name: link.name,
    url: link.url,
    org,
    province: pv ? pv[1] : clean(p[6]),
    region: pv ? pv[2] : '',
    budget,
    form,
    type: clean(tm[0] || ''),
    method: clean(tm[1] || ''),
    announced: thDate(p[10]),
    resulted: thDate(p[11]),
    status: statusRaw.replace(/[🔥❌]/g, '').trim(),
    statusFlag: statusRaw.includes('🔥') ? 'open' : statusRaw.includes('❌') ? 'cancel' : 'done',
    winners: clean(p[13]).split(' / ').map(clean)
      .filter(w => w && !w.startsWith('_') && w !== '—')
      .filter((w, i, a) => a.indexOf(w) === i),
    priceAgree: isOffer ? null : num(priceCell),
    priceOffered: isOffer ? num(priceCell.replace('เสนอ', '')) : null,
    categories: [category],
    isOpen: statusRaw.includes('🔥'),
    source: 'MED',
    group: groupOf([category]),
    tier: tierOf(budget),
    salesPlay: PLAY[form] || form,
    segment: segmentOf(org),
    careSetting: careSettingOf(link.name),
    keywords: keywordsOf(link.name, category === EMAR_CAT_),
  });
}

const records = Array.from(byId.values());

// เวลาที่แต่ละโครงการถูกเพิ่มเข้าระบบ (เก็บใน state/added-log.json โดย egp-watch)
let ADDED_LOG = {};
try { ADDED_LOG = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'state', 'added-log.json'), 'utf8')); } catch (e) {}
records.forEach(r => { if (ADDED_LOG[r.id]) r.addedAt = ADDED_LOG[r.id]; });

// ---- Active Account: นับครั้งต่อหน่วยงาน (ต้องรอโหลดครบก่อน) ---------------
const orgCount = {};
records.forEach(r => { orgCount[r.org] = (orgCount[r.org] || 0) + 1; });
records.forEach(r => { r.group = groupOf(r.categories); });
records.forEach(r => {
  const n = orgCount[r.org];
  r.orgDeals = n;
  r.accountLevel = n >= 5 ? 'Active ซื้อ ≥5 ครั้ง' : n >= 2 ? 'ซื้อซ้ำ 2–4 ครั้ง' : 'ซื้อครั้งเดียว';
  r.needsReview = r.group === 'ระบบยา' && r.keywords.length === 0;
});

// ---- Vendor League Table ---------------------------------------------------
const vendors = [];
let inVendor = false;
for (const line of medLines) {
  if (line.startsWith('## ')) { inVendor = /Vendor League Table/.test(line); continue; }
  if (!inVendor) continue;
  const p = line.split('|');
  if (p.length !== 9 || !/^\s*\d+\s*$/.test(p[1])) continue;
  vendors.push({
    rank: Number(clean(p[1])),
    name: clean(p[2]),
    taxId: clean(p[3]),
    wins: Number(clean(p[4])),
    value: num(p[5]) || 0,
    provinces: Number(clean(p[6])),
    categories: clean(p[7]).split(', ').map(clean),
  });
}

// ---- 2 โครงการเกี่ยวเนื่องจากไฟล์ HIS/คิว ----------------------------------
const hisLines = fs.readFileSync(HIS, 'utf8').split(/\r?\n/);
const hisRelated = [];
hisLines.forEach((line, i) => {
  if (!/^\|\s*\d+\s*\|\s*`/.test(line)) return;
  if (!/ห้องจ่ายยา|ใบสั่งยา/.test(line)) return;
  const p = line.split('|');
  const link = splitLink(p[3]);
  const pv = clean(p[5]).match(/^(.*?)\s*\((.*?)\)\s*$/);
  hisRelated.push({
    line: i + 1,
    id: clean(p[2]).replace(/`/g, ''),
    name: link.name, url: link.url, org: clean(p[4]),
    province: pv ? pv[1] : clean(p[5]),
    region: pv ? pv[2] : '',
    budget: num(p[6]) || 0,
    source: 'HIS',
  });
});

// ---- ตรวจยอด ---------------------------------------------------------------
const tally = f => records.reduce((m, r) => { const k = f(r); m[k] = (m[k] || 0) + 1; return m; }, {});
const total = records.reduce((s, r) => s + r.budget, 0);
const kwHit = records.filter(r => r.keywords.length > 0).length;

const med = records.filter(r => r.group === 'ระบบยา');
const emar = records.filter(r => r.group === 'Smart IPD / eMAR');
// ตรวจเฉพาะ "ยอดที่ห้ามขยับ" — ชุดข้อมูลจากหน้าเว็บที่ตรวจสอบแล้ว
// ยอดอื่นเปลี่ยนได้ทุกวันเมื่อ egp-watch เติมงานใหม่ จึงแค่รายงาน ไม่ fail
const checks = [
  ['[ล็อก] กลุ่มระบบยา', med.length, 444],
  ['[ล็อก] มูลค่ากลุ่มระบบยา', med.reduce((s2, r) => s2 + r.budget, 0).toFixed(2), '1054974118.65'],
  ['[ล็อก] หน่วยงาน (ระบบยา)', new Set(med.map(r => r.org)).size, 181],
  ['[ล็อก] จังหวัด (ระบบยา)', new Set(med.map(r => r.province)).size, 65],
  ['[ล็อก] ยังยื่นได้ (ระบบยา)', med.filter(r => r.isOpen).length, 9],
  ['[ล็อก] ยกเลิก (ระบบยา)', med.filter(r => r.statusFlag === 'cancel').length, 17],
  ['[ล็อก] ผู้ขาย', vendors.length, 104],
];
const info = [
  ['กลุ่ม Smart IPD/eMAR', emar.length],
  ['มูลค่ากลุ่ม Smart IPD', emar.reduce((s2, r) => s2 + r.budget, 0).toFixed(2)],
  ['รวมทั้งสองกลุ่ม', records.length],
  ['ติดธง ตรวจสอบ', records.filter(r => r.needsReview).length],
];
let ok = true;
for (const [label, got, want] of checks) {
  const pass = String(got) === String(want);
  if (!pass) ok = false;
  console.log((pass ? '  ok  ' : '  FAIL') + '  ' + label.padEnd(18) + String(got).padStart(16) + '   คาด ' + want);
}
console.log('');
info.forEach(([k, v]) => console.log('  ..    ' + String(k).padEnd(24) + String(v).padStart(16)));
console.log('  Tier        ', JSON.stringify(tally(r => r.tier)));
console.log('  Segment     ', JSON.stringify(tally(r => r.segment)));
const orgLevel = {};
Object.keys(orgCount).forEach(o => {
  const n = orgCount[o];
  const k = n >= 5 ? 'Active ซื้อ ≥5 ครั้ง' : n >= 2 ? 'ซื้อซ้ำ 2–4 ครั้ง' : 'ซื้อครั้งเดียว';
  orgLevel[k] = (orgLevel[k] || 0) + 1;
});
console.log('  Account(โครงการ)', JSON.stringify(tally(r => r.accountLevel)));
console.log('  Account(แห่ง)   ', JSON.stringify(orgLevel), 'คาด 24/60/97');
console.log('  CareSetting ', JSON.stringify(tally(r => r.careSetting)));
console.log('  หมวดสินค้า  ', JSON.stringify(records.reduce((m, r) => {
  r.categories.forEach(c => { m[c] = (m[c] || 0) + 1; }); return m;
}, {})));
console.log('  ต้องตรวจสอบ ', records.filter(r => r.needsReview).map(r => r.id).join(', '));

fs.writeFileSync(__dirname + '/data.json', JSON.stringify({ records, vendors, hisRelated }), 'utf8');
console.log('\n→ data.json  ' + (fs.statSync(__dirname + '/data.json').size / 1024).toFixed(0) + ' KB');
if (!ok) { console.log('\n*** ยอดไม่ตรง หยุดก่อน ***'); process.exit(1); }
