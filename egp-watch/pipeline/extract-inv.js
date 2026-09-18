/* ============================================================================
   extract-inv — อ่าน egp-inventory-erp-2569.md แล้วแปลงเป็น JSON ให้รายงาน

   ตาราง 14 ช่อง (แบบเดียวกับไฟล์ HIS ไม่มีคอลัมน์ปีงบ):
     p[2]=เลขโครงการ p[3]=ชื่อ p[4]=หน่วยงาน p[5]=จังหวัด (ภาค) p[6]=วงเงิน
     p[7]=ประเภท/วิธี p[8]=วันประกาศ p[9]=วันประกาศผล p[10]=สถานะ
     p[11]=ผู้ชนะ p[12]=ราคาที่ตกลง
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Lenovo/Documents/App_dev/CRM_app';
const INV = ROOT + '/egp-inventory-erp-2569.md';

const clean = s => (s || '').replace(/\u00a0/g, ' ').trim();
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

/* Tier — เกณฑ์ชุดเดียวกับอีกสองรายงาน (js/data/tier_config.js) */
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

/* ผลิตภัณฑ์ — แกนหลักของตลาดนี้ ลำดับสำคัญ: HERP ต้องมาก่อน ERP */
const productOf = n => /HERP/i.test(n) ? 'HERP Copilot'
  : /WAMAS/i.test(n) ? 'WAMAS'
  : /myPSD/i.test(n) ? 'myPSD'
  : /Ecount/i.test(n) ? 'Ecount ERP'
  : /HosOffice/i.test(n) ? 'ERP-HosOffice'
  : /SAP/i.test(n) ? 'SAP' : 'ไม่ระบุยี่ห้อ';

/* รูปแบบดีล — ต่ออายุรายปีคือแกนขายของหมวดนี้ */
const formOf = n => /Activation|บำรุงรักษา|ต่ออายุ|ต่อสัญญา|รายปี|ดูแล.*ระบบ/i.test(n)
  ? 'MA / Activation รายปี'
  : /^เช่า|ประกวดราคาเช่า/.test(n) ? 'เช่า' : 'จัดซื้อ/ติดตั้ง';
const PLAY = {
  'จัดซื้อ/ติดตั้ง': 'ดีลระบบใหม่',
  'MA / Activation รายปี': 'ดีลต่ออายุรายปี',
  'เช่า': 'ดีลเช่า',
};

const KEYWORDS = ['ERP', 'HERP', 'Enterprise Resource', 'วางแผนทรัพยากร', 'บริหารทรัพยากรองค์กร',
  'บริหารคลัง', 'ระบบคลัง', 'จัดการคลัง', 'โปรแกรมคลัง', 'คลังเวชภัณฑ์', 'คลังสินค้า',
  'คลังวัสดุ', 'ลูกหนี้', 'จัดเก็บรายได้'];
const keywordsOf = name => KEYWORDS.filter(k => name.toLowerCase().includes(k.toLowerCase()));

/* ============================================================================ */
const lines = fs.readFileSync(INV, 'utf8').split(/\r?\n/);
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
  // แถวที่ egp-watch เติมเข้ามาทีหลังอยู่ใน section เสริม — จัดหมวดจากชื่อโครงการแทน
  const link = splitLink(p[3]);
  const isSupp = secName.startsWith(SUPP);
  const category = isSupp
    ? (/คลังสินค้า|WAMAS/i.test(link.name) ? 'เครื่อง/ระบบคลังสินค้าอัตโนมัติ'
      : /HERP/i.test(link.name) ? 'HERP Copilot — จัดเก็บรายได้ / ลูกหนี้'
      : /\bERP\b|Enterprise\s*Resource|วางแผนทรัพยากร|บริหารทรัพยากรองค์กร/i.test(link.name)
        ? 'ERP บริหารทรัพยากรองค์กร'
        : 'โปรแกรมคลังเวชภัณฑ์ / คลังวัสดุ')
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
    source: isSupp ? 'API' : 'INV',
    product: productOf(link.name),
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
const base = records.filter(r => r.source === 'INV');
const checks = [
  ['[ล็อก] ชุดตั้งต้น', base.length, 78],
  ['[ล็อก] มูลค่าชุดตั้งต้น', base.reduce((s, r) => s + r.budget, 0).toFixed(2), '62111779.50'],
];
const info = [
  ['รวมทั้งหมด', records.length],
  ['ส่วนเสริมจาก API', records.filter(r => r.source === 'API').length],
  ['HERP Copilot', records.filter(r => r.product === 'HERP Copilot').length],
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

fs.writeFileSync(path.join(__dirname, 'data-inv.json'),
  JSON.stringify({ records, vendors, productSummary }), 'utf8');
console.log('  เขียน data-inv.json · ' + records.length + ' โครงการ');
if (!ok) process.exit(1);
