/* ============================================================================
   extract-log — อ่าน egp-hospital-logistics-2569.md แล้วแปลงเป็น JSON ให้รายงาน

   ตาราง 14 ช่อง (แบบเดียวกับไฟล์ HIS และ inv ไม่มีคอลัมน์ปีงบ):
     p[2]=เลขโครงการ p[3]=ชื่อ p[4]=หน่วยงาน p[5]=จังหวัด (ภาค) p[6]=วงเงิน
     p[7]=ประเภท/วิธี p[8]=วันประกาศ p[9]=วันประกาศผล p[10]=สถานะ
     p[11]=ผู้ชนะ p[12]=ราคาที่ตกลง

   ต่างจาก extract-inv ตรงที่กลุ่มนี้มีแกนที่สี่ — `nature` แยก "มีระบบ/เครื่อง"
   ออกจาก "จ้างเหมาแรงงานล้วน" ซึ่งเป็นคำถามหลักของรายงานฉบับนี้
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { HAS_SYSTEM_LOG } = require('../lib/filter');

const ROOT = path.join(__dirname, '..', '..');
const LOG = path.join(ROOT, 'egp-hospital-logistics-2569.md');

const clean = s => (s || '').replace(/ /g, ' ').trim();
const num = s => {
  const t = clean(s).replace(/[*_`,\s]/g, '');
  if (!t || t === '—' || t === '-') return null;
  const v = parseFloat(t);
  return isNaN(v) ? null : v;
};
function splitLink(cell) {
  const m = clean(cell).match(/^\[([\s\S]*)\]\((\S+)\)$/);
  return m ? { name: clean(m[1]), url: m[2] } : { name: clean(cell), url: null };
}

const TH_MONTH = { 'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
                   'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12 };
function thDate(cell) {
  const m = clean(cell).match(/^(\d{1,2})\s+(\S+)\s+(\d{2})$/);
  if (!m || !TH_MONTH[m[2]]) return null;
  return (2500 + Number(m[3])) + '-' +
    String(TH_MONTH[m[2]]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
}

/* Tier — เกณฑ์ชุดเดียวกับอีกสามรายงาน */
const TIERS = [
  { id: 'T1', minRevenue: 10000000 }, { id: 'T2', minRevenue: 5000000 },
  { id: 'T3', minRevenue: 1000000 },  { id: 'T4', minRevenue: 0 },
];
const tierOf = v => (TIERS.find(t => (v || 0) >= t.minRevenue) || TIERS[3]).id;

const SEGMENTS = [
  ['โรงเรียนแพทย์/มหาวิทยาลัย', /คณะแพทยศาสตร์|คณะทันตแพทย|มหาวิทยาลัย|วิทยาลัย|ศิริราช|รามาธิบดี|จุฬาลงกรณ์|ธรรมศาสตร์|สงขลานครินทร์|ราชวิทยาลัย/],
  ['รพ.เฉพาะทาง/สถาบัน', /มะเร็ง|ธัญญารักษ์|จิตเวช|ทรวงอก|ประสาท|ราชานุกูล|โรคผิวหนัง|สถาบัน|องค์การเภสัชกรรม/],
  ['สสจ./รพ.สต./สสอ.', /^สำนักงานสาธารณสุข|ส่งเสริมสุขภาพตำบล|สาธารณสุขอำเภอ|^กองสาธารณสุข/],
  ['ทหาร/ตำรวจ', /ค่าย|ทหาร|ตำรวจ|กองทัพ|กลาโหม|ภูมิพล|พระมงกุฎ/],
];
const segmentOf = org => (SEGMENTS.find(s => s[1].test(org)) || ['รพ.ศูนย์/ทั่วไป/ชุมชน'])[0];

/* ผลิตภัณฑ์ — ต้องตรงกับ make-logistics-md.js ลำดับสำคัญ */
const productOf = n =>
  /ท่อลม|Pneumatic/i.test(n) ? 'ระบบท่อลมรับส่ง (Pneumatic Tube)'
  : /\bAGV\b|หุ่นยนต์/i.test(n) ? 'หุ่นยนต์ / AGV ขนส่งในอาคาร'
  : /สายพานลำเลียง|ลิฟต์(?:ขนของ|ส่งของ|ขนส่ง)/.test(n) ? 'สายพาน / ลิฟต์ขนของ'
  : /RFID|บาร์โค้ด|Barcode/i.test(n) ? 'RFID / บาร์โค้ด ติดตามพัสดุ'
  : /\bGPS\b/i.test(n) ? 'GPS ติดตามยานพาหนะ'
  : /(?:ระบบ|โปรแกรม|ซอฟต์แวร์|ซอฟแวร์|จัดการ|บริหาร)[^|]{0,12}เปล(?!ี่ยน|ือก|ว)|\bPorter\b/i.test(n) ? 'ระบบจัดเวรเปล (Porter Dispatch)'
  : /โลจิสติกส์|Logistic|ระบบเบิก|ระบบติดตาม|Track/i.test(n) ? 'ซอฟต์แวร์บริหารโลจิสติกส์'
  : /เครื่อง(?:ซัก|อบ|รีด)ผ้า/.test(n) ? 'เครื่องซัก-อบ-รีดผ้า'
  : /รถเข็น/.test(n) ? 'รถเข็นขนส่งในโรงพยาบาล'
  : /ตู้/.test(n) ? 'ตู้ / อุปกรณ์ขนส่ง'
  : HAS_SYSTEM_LOG.test(n) ? 'อื่น ๆ — ระบบ/เครื่องที่ไม่ระบุประเภท' : 'ไม่มีระบบ — งานจ้างเหมาบริการ';

/* รูปแบบดีล — ตลาดนี้ขายด้วยสัญญาจ้างรายปีเป็นหลัก ไม่ใช่การขายขาด */
const formOf = n => /บำรุงรักษา|ต่ออายุ|ต่อสัญญา|รายปี|MA\b/i.test(n) ? 'MA / ต่ออายุรายปี'
  : /^(?:ประกวดราคา)?เช่า|ราคาเช่า/.test(n) ? 'เช่า'
  : /จ้างเหมา|จ้างบริการ|บริการ/.test(n) ? 'จ้างเหมาบริการ' : 'จัดซื้อ/ติดตั้ง';
const PLAY = {
  'จัดซื้อ/ติดตั้ง': 'ดีลระบบใหม่',
  'MA / ต่ออายุรายปี': 'ดีลต่ออายุรายปี',
  'จ้างเหมาบริการ': 'ดีลสัญญาบริการ',
  'เช่า': 'ดีลเช่า',
};

const KEYWORDS = ['เปล', 'เคลื่อนย้ายผู้ป่วย', 'ขนส่ง', 'จัดส่ง', 'รับ-ส่ง', 'ลำเลียง',
  'ท่อลม', 'Pneumatic', 'AGV', 'หุ่นยนต์', 'สายพาน', 'ลิฟต์ขนของ',
  'โลจิสติกส์', 'RFID', 'บาร์โค้ด', 'Barcode', 'GPS', 'ติดตาม',
  'ซักฟอก', 'ซักรีด', 'ซัก อบ รีด', 'ผ้าผู้ป่วย', 'เครื่องซักผ้า',
  'มูลฝอยติดเชื้อ', 'ขยะติดเชื้อ', 'อาหารผู้ป่วย', 'โภชนาการ', 'จ่ายกลาง',
  'ถึงบ้าน', 'ไปรษณีย์', 'ส่งต่อผู้ป่วย'];
const keywordsOf = name => KEYWORDS.filter(k => name.toLowerCase().includes(k.toLowerCase()));

/* ============================================================================ */
const lines = fs.readFileSync(LOG, 'utf8').split(/\r?\n/);
const ROW = /^\|\s*\d+\s*\|\s*`/;
const SUPP = 'ส่วนเสริม — เก็บเพิ่มจาก API สพร.';

const byId = new Map();
let section = '';

for (const line of lines) {
  if (line.startsWith('## ')) { section = clean(line.slice(3)); continue; }
  if (!ROW.test(line)) continue;
  const p = line.split('|');
  if (p.length !== 14) continue;

  const id = clean(p[2]).replace(/`/g, '');
  const secName = section.replace(/\s*\(\d+\s*โครงการ[\s\S]*$/, '').trim();
  const link = splitLink(p[3]);
  const isSupp = secName.startsWith(SUPP);
  // แถวที่ egp-watch เติมเข้ามาทีหลังอยู่ใน section เสริม — จัดหมวดจากชื่อโครงการแทน
  const category = isSupp
    ? (/ท่อลม|Pneumatic|AGV|หุ่นยนต์|สายพานลำเลียง|ลิฟต์(?:ขนของ|ส่งของ|ขนส่ง)|ตู้ขนส่ง/i.test(link.name)
        ? 'ระบบขนส่งอัตโนมัติในอาคาร — ท่อลม · หุ่นยนต์ · สายพาน · ลิฟต์ขนของ'
      : /โลจิสติกส์|Logistic|RFID|บาร์โค้ด|Barcode|GPS|ติดตาม|ระบบเบิก|Track|(?:ระบบ|โปรแกรม|ซอฟต์แวร์|ซอฟแวร์|จัดการ|บริหาร)[^|]{0,12}เปล(?!ี่ยน|ือก|ว)|\bPorter\b/i.test(link.name)
        ? 'ซอฟต์แวร์ / ระบบบริหารโลจิสติกส์ — เวรเปล · RFID · บาร์โค้ด · GPS'
      : HAS_SYSTEM_LOG.test(link.name) && /ซัก|อบผ้า|รีดผ้า|รถเข็น|ตู้/.test(link.name)
        ? 'เครื่องจักร / ครุภัณฑ์งานโลจิสติกส์ — เครื่องซักผ้า · รถเข็น · ตู้ขนส่ง'
      : /ซัก|ผ้าผู้ป่วย/.test(link.name) ? 'จ้างเหมาบริการ — ซัก อบ รีด ผ้าผู้ป่วย'
      : /มูลฝอย|ขยะ/.test(link.name) ? 'จ้างเหมาบริการ — เก็บขน / กำจัดมูลฝอยติดเชื้อ'
      : /อาหาร|โภชนาการ/.test(link.name) ? 'จ้างเหมาบริการ — ประกอบและบริการอาหารผู้ป่วย'
      : /ยา|เวชภัณฑ์|ถึงบ้าน|ไปรษณีย์/.test(link.name)
        ? 'จ้างเหมาบริการ — ขนส่งยาและเวชภัณฑ์ · ส่งยาถึงบ้าน'
      : /ส่งต่อผู้ป่วย|รับ.?ส่งผู้ป่วย|รถ|ยานพาหนะ/.test(link.name)
        ? 'จ้างเหมาบริการ — ยานพาหนะ · ส่งต่อผู้ป่วย'
      : 'จ้างเหมาบริการ — งานเปล / ขนส่งภายในโรงพยาบาล')
    : secName;

  if (byId.has(id)) {
    const r = byId.get(id);
    if (!r.categories.includes(category)) r.categories.push(category);
    continue;
  }

  const org = clean(p[4]);
  const pv = clean(p[5]).match(/^(.*?)\s*\((.*?)\)\s*$/);
  const budget = num(p[6]) || 0;
  const tm = clean(p[7]).split(' / ');
  const statusRaw = clean(p[10]);
  const priceCell = clean(p[12]);
  const isOffer = /เสนอ/.test(priceCell);
  const form = formOf(link.name);

  byId.set(id, {
    id,
    name: link.name,
    url: link.url,
    org,
    province: pv ? pv[1] : clean(p[5]),
    region: pv ? pv[2] : '',
    budget,
    form,
    type: clean(tm[0] || ''),
    method: clean(tm[1] || ''),
    announced: thDate(p[8]),
    resulted: thDate(p[9]),
    status: statusRaw.replace(/[🔥❌]/g, '').trim(),
    statusFlag: statusRaw.includes('🔥') ? 'open' : statusRaw.includes('❌') ? 'cancel' : 'done',
    winners: clean(p[11]).split(' / ').map(clean)
      .filter(w => w && !w.startsWith('_') && w !== '—')
      .filter((w, i, a) => a.indexOf(w) === i),
    priceAgree: isOffer ? null : num(priceCell),
    priceOffered: isOffer ? num(priceCell.replace('เสนอ', '')) : null,
    categories: [category],
    isOpen: statusRaw.includes('🔥'),
    source: isSupp ? 'API' : 'LOG',
    product: productOf(link.name),
    // แกนหลักของรายงานนี้ — ตลาดที่ยังใช้แรงคน คือตลาดที่ขายระบบเข้าไปแทนได้
    nature: HAS_SYSTEM_LOG.test(link.name) ? 'มีระบบ/เครื่อง' : 'จ้างเหมาแรงงานล้วน',
    tier: tierOf(budget),
    salesPlay: PLAY[form] || form,
    segment: segmentOf(org),
    keywords: keywordsOf(link.name),
  });
}

const records = Array.from(byId.values());

let ADDED_LOG = {};
try { ADDED_LOG = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'state', 'added-log.json'), 'utf8')); } catch (e) {}
records.forEach(r => { if (ADDED_LOG[r.id]) r.addedAt = ADDED_LOG[r.id]; });

const orgCount = {};
records.forEach(r => { orgCount[r.org] = (orgCount[r.org] || 0) + 1; });
records.forEach(r => {
  const n = orgCount[r.org];
  r.orgDeals = n;
  r.accountLevel = n >= 5 ? 'Active ซื้อ ≥5 ครั้ง' : n >= 2 ? 'ซื้อซ้ำ 2–4 ครั้ง' : 'ซื้อครั้งเดียว';
  r.needsReview = r.keywords.length === 0;
});

/* ---- vendor league table -------------------------------------------------- */
const vmap = new Map();
records.forEach(r => r.winners.forEach(w => {
  if (!vmap.has(w)) vmap.set(w, { name: w, wins: 0, value: 0, provinces: new Set(), categories: new Set() });
  const v = vmap.get(w);
  v.wins++;
  v.value += (r.priceAgree != null ? r.priceAgree : 0);
  if (r.province) v.provinces.add(r.province);
  r.categories.forEach(c => v.categories.add(c));
}));
const vendors = Array.from(vmap.values())
  .sort((a, b) => b.value - a.value)
  .map((v, i) => ({ rank: i + 1, name: v.name, wins: v.wins, value: v.value,
                    provinces: v.provinces.size, categories: Array.from(v.categories) }));

/* ---- product summary ------------------------------------------------------ */
const pmap = new Map();
records.forEach(r => {
  if (!pmap.has(r.product)) pmap.set(r.product, { name: r.product, projects: 0, value: 0, orgs: new Set() });
  const p = pmap.get(r.product);
  p.projects++; p.value += r.budget; p.orgs.add(r.org);
});
const productSummary = Array.from(pmap.values())
  .sort((a, b) => b.projects - a.projects)
  .map(p => ({ name: p.name, projects: p.projects, orgs: p.orgs.size, value: p.value }));

/* ---- ตรวจยอด -------------------------------------------------------------- */
const base = records.filter(r => r.source === 'LOG');
const checks = [
  ['[ล็อก] ชุดตั้งต้น', base.length, 3019],
  ['[ล็อก] มูลค่าชุดตั้งต้น', base.reduce((s, r) => s + r.budget, 0).toFixed(2), '1126851130.96'],
];
const info = [
  ['รวมทั้งหมด', records.length],
  ['ส่วนเสริมจาก API', records.filter(r => r.source === 'API').length],
  ['มีระบบ/เครื่อง', records.filter(r => r.nature === 'มีระบบ/เครื่อง').length],
  ['จ้างเหมาแรงงานล้วน', records.filter(r => r.nature === 'จ้างเหมาแรงงานล้วน').length],
  ['ผู้ขาย', vendors.length],
  ['ติดธง ตรวจสอบ', records.filter(r => r.needsReview).length],
];
let ok = true;
for (const [label, got, want] of checks) {
  const pass = String(got) === String(want);
  if (!pass) ok = false;
  console.log((pass ? '  ok  ' : '  FAIL') + '  ' + label.padEnd(20) + String(got).padStart(16) + '   คาด ' + want);
}
info.forEach(([l, v]) => console.log('  --  ' + l.padEnd(20) + String(v).padStart(16)));

fs.writeFileSync(path.join(__dirname, 'data-log.json'),
  JSON.stringify({ records, vendors, productSummary }), 'utf8');
console.log('  เขียน data-log.json · ' + records.length + ' โครงการ');
if (!ok) process.exit(1);
