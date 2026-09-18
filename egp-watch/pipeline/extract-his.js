const fs = require('fs');
const path = require('path');
const URL_PREFIX = 'https://process5.gprocurement.go.th/egp-agpc01-web/announcement/procurement/';
const ROOT = 'C:/Users/Lenovo/Documents/App_dev/CRM_app';
const SRC = ROOT + '/egp-2569-healthcare-procurement.md';

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
  return (2500 + Number(m[3])) + '-' + String(TH_MONTH[m[2]]).padStart(2, '0') +
         '-' + String(m[1]).padStart(2, '0');
}

/* ---- Tier: เกณฑ์ minRevenue ยกมาจาก js/data/tier_config.js ---------------- */
const TIERS = [
  { id: 'T1', minRevenue: 10000000 }, { id: 'T2', minRevenue: 5000000 },
  { id: 'T3', minRevenue: 1000000 },  { id: 'T4', minRevenue: 0 },
];
const tierOf = v => (TIERS.find(t => (v || 0) >= t.minRevenue) || TIERS[3]).id;

/* ---- Segment: ชุดเดียวกับรายงานระบบยา ------------------------------------ */
const SEGMENTS = [
  ['โรงเรียนแพทย์/มหาวิทยาลัย', /คณะแพทยศาสตร์|มหาวิทยาลัย|วิทยาลัย|ศิริราช|รามาธิบดี|จุฬาลงกรณ์|ธรรมศาสตร์|สงขลานครินทร์/],
  ['รพ.เฉพาะทาง/สถาบัน', /มะเร็ง|ธัญญารักษ์|จิตเวช|สวนปรุง|ศรีธัญญา|พระศรีมหาโพธิ์|ทรวงอก|ประสาท|ราชานุกูล|สมเด็จเจ้าพระยา|นิติจิตเวช|โรคผิวหนัง|สิรินธร.*ฟื้นฟู/],
  ['สสจ./รพ.สต./สสอ.', /^สำนักงานสาธารณสุข|ส่งเสริมสุขภาพตำบล|สาธารณสุขอำเภอ|^ศูนย์อนามัย|^ศูนย์บริการสาธารณสุข|^ศูนย์สุขภาพ|กรมอนามัย|กรมควบคุมโรค/],
  ['ทหาร/ตำรวจ', /ค่าย|ทหาร|ตำรวจ|กองทัพ|สมเด็จพระปิ่นเกล้า|ภูมิพล|พระมงกุฎ|กรมแพทย์/],
  ['สังกัด กทม.', /เวชการุณย์|ตากสิน|เจริญกรุง|ราชพิพัฒน์|หลวงพ่อทวีศักดิ์|ลาดกระบัง|คลองสามวา|บางขุนเทียน|เวชกรรม/],
];
const segmentOf = org => (SEGMENTS.find(s => s[1].test(org)) || ['รพ.ศูนย์/ทั่วไป/ชุมชน'])[0];

/* ---- ผลิตภัณฑ์ HIS ที่ปรากฏในชื่อโครงการ --------------------------------- */
const PRODUCTS = [['HOSxP', /HOSxP|hosxp|HosXP/], ['HOSOffice', /HOSOffice|HosOffice/],
                  ['E-PHIS', /E-PHIS|e-PHIS/], ['Smehims', /Smehims|SMEHIMS/]];
const productOf = name => (PRODUCTS.find(p => p[1].test(name)) || ['ไม่ระบุยี่ห้อ'])[0];

/* ---- คีย์เวิร์ด: ชุดเดิมจากภาคผนวก --------------------------------------- */
const KEYWORDS = ['ระบบคิว','คิวอัตโนมัติ','เรียกคิว','บัตรคิว','จัดคิว','Kiosk','คีออส',
  'ตู้บริการ','ตู้อเนกประสงค์','HIS','สารสนเทศโรงพยาบาล','ระบบงานโรงพยาบาล',
  'บริหารจัดการโรงพยาบาล','Paperless','ไร้กระดาษ','เวชระเบียน','EMR','ห้องบัตร','IPD',
  'เชื่อมโยงข้อมูลสุขภาพ','HOSxP','สารสนเทศทางการแพทย์','ระบบสารสนเทศเพื่อการบริหาร',
  'Smart Hospital','ระบบโรงพยาบาล','บริหารงานโรงพยาบาล','ทะเบียนผู้ป่วย',
  'Hospital Information','โปรแกรมโรงพยาบาล','ระบบบริหารโรงพยาบาล','Smehims','e-Claim',
  'ตู้อัตโนมัติ','เวชสารสนเทศ','โรงพยาบาลอัจฉริยะ'];
const keywordsOf = name => KEYWORDS.filter(k =>
  name.toLowerCase().includes(k.toLowerCase()));

/* ---- ต่ออายุ vs จัดหา: จับคำในชื่อโครงการ (ตรงตามที่ภาคผนวกอธิบาย) ------- */
// จูนกับข้อมูลจริงแล้ว: 'ประจำปี' (จาก 'ประจำปีงบประมาณ') และ 'ค่าบริการ' กว้างเกินไป
// ทำให้ดีลจัดหาถูกนับเป็นต่ออายุ — ตัดสองคำนี้ออก
const RENEW_RE = /บำรุงรักษา|ต่ออายุ|ต่อสัญญา|activation|รายปี|ดูแลระบบ|ซ่อมบำรุง|MA|ค่าธรรมเนียม/i;
const renewByName = name => RENEW_RE.test(name);

/* ========================================================================== */
const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const ROW = /^\|\s*\d+\s*\|\s*`/;

const GAP_SEC = 'ส่วนเสริมจาก API สพร. — โครงการที่รอบเก็บจากหน้าเว็บตกหล่น';
const GAP_CATS = [
  ['IPD Paperless / EMR', /Paperless|ไร้กระดาษ|EMR|เวชระเบียนอิเล็ก|ผู้ป่วยใน/i],
  ['ตู้ Kiosk', /Kiosk|คีออส|ตู้บริการ|ตู้อเนกประสงค์/i],
  ['ระบบคิว', /คิว/i],
  ['HIS', /./],
];
const CAT_OF_SECTION = {
  'ระบบคิว': 'ระบบคิว',
  'ตู้ Kiosk': 'ตู้ Kiosk',
  'HIS — จัดหา / ติดตั้ง / ปรับปรุงระบบ': 'HIS',
  'HIS — ต่ออายุ / บำรุงรักษา / Activation รายปี': 'HIS',
  'IPD Paperless / EMR': 'IPD Paperless / EMR',
};

const byId = new Map();
let section = '', catRows = 0, hotRows = 0;

for (const line of lines) {
  if (line.startsWith('## ')) { section = clean(line.slice(3)); continue; }
  if (!ROW.test(line)) continue;

  const p = line.split('|');
  const id = clean(p[2]).replace(/`/g, '');

  if (p.length === 12) {                       // section 🔥 — ติดธงอย่างเดียว
    hotRows++;
    if (byId.has(id)) byId.get(id).isOpen = true;
    continue;
  }
  if (p.length !== 14) continue;

  const secName = section.replace(/\s*\(\d+\s*โครงการ\)\s*$/, '').trim();
  const isGap = secName.startsWith(GAP_SEC);
  const category = isGap
    ? (GAP_CATS.find(g => g[1].test(clean(p[3]))) || GAP_CATS[3])[0]
    : CAT_OF_SECTION[secName];
  if (!category) continue;                     // ข้าม table อื่นที่บังเอิญ 14 ช่อง
  catRows++;
  const isRenewSection = /ต่ออายุ/.test(secName);

  if (byId.has(id)) {
    const r = byId.get(id);
    if (!r.categories.includes(category)) r.categories.push(category);
    if (category === 'HIS') r.hisSection = isRenewSection ? 'renew' : (r.hisSection || 'acquire');
    return_continue: continue;
  }

  const link = splitLink(p[3]);
  const org = clean(p[4]);
  const pv = clean(p[5]).match(/^(.*?)\s*\((.*?)\)\s*$/);
  const budget = num(p[6]) || 0;
  const tm = clean(p[7]).split(' / ');
  const statusRaw = clean(p[10]);
  const priceCell = clean(p[12]);
  const isOffer = /เสนอ/.test(priceCell);

  byId.set(id, {
    id,
    name: link.name, url: (link.url || '').replace(URL_PREFIX, ''), org,
    province: pv ? pv[1] : clean(p[5]),
    region: pv ? pv[2] : '',
    budget,
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
    source: isGap ? 'API' : 'WEB',
    hisSection: (category === 'HIS' && !isGap) ? (isRenewSection ? 'renew' : 'acquire') : null,
    dealType: null,
    tier: tierOf(budget),
    segment: segmentOf(org),
    product: productOf(link.name),
    keywords: keywordsOf(link.name),
  });
}

const records = Array.from(byId.values());

// เวลาที่แต่ละโครงการถูกเพิ่มเข้าระบบ (เก็บใน state/added-log.json โดย egp-watch)
let ADDED_LOG = {};
try { ADDED_LOG = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'state', 'added-log.json'), 'utf8')); } catch (e) {}
records.forEach(r => { if (ADDED_LOG[r.id]) r.addedAt = ADDED_LOG[r.id]; });

// dealType: section HIS เป็นตัวตัดสินก่อน ที่เหลืออนุมานจากชื่อ
const RENEW = 'ต่ออายุ / MA / Activation รายปี', ACQUIRE = 'จัดหา / ติดตั้ง / ปรับปรุง';
records.forEach(r => {
  // section HIS ของไฟล์ต้นทางชี้ขาดทั้งสองทาง — โครงการนอกหมวด HIS จึงค่อยอนุมานจากชื่อ
  r.dealType = r.hisSection === 'renew' ? RENEW
             : r.hisSection === 'acquire' ? ACQUIRE
             : renewByName(r.name) ? RENEW : ACQUIRE;
  r.dealTypeSource = r.hisSection ? 'section' : 'name';
});

// Active Account
const orgCount = {};
records.forEach(r => { orgCount[r.org] = (orgCount[r.org] || 0) + 1; });
records.forEach(r => {
  const n = orgCount[r.org];
  r.orgDeals = n;
  r.accountLevel = n >= 5 ? 'Active ซื้อ ≥5 ครั้ง' : n >= 2 ? 'ซื้อซ้ำ 2–4 ครั้ง' : 'ซื้อครั้งเดียว';
  r.needsReview = r.keywords.length === 0;
});

/* ---- Vendor League Table -------------------------------------------------- */
const vendors = [];
let inVendor = false;
for (const line of lines) {
  if (line.startsWith('## ')) { inVendor = /Vendor League Table|ผู้ขายที่ชนะงาน/.test(line); continue; }
  if (!inVendor) continue;
  const p = line.split('|');
  if (p.length !== 9 || !/^\s*\d+\s*$/.test(p[1])) continue;
  vendors.push({
    rank: Number(clean(p[1])), name: clean(p[2]), taxId: clean(p[3]),
    wins: Number(clean(p[4])), value: num(p[5]) || 0,
    provinces: Number(clean(p[6])), categories: clean(p[7]).split(', ').map(clean),
  });
}

/* ---- แผนที่ผลิตภัณฑ์ HIS: ตารางสรุป + รายชื่อ รพ. ต่อผลิตภัณฑ์ ----------- */
const productSummary = [];
const productOrgs = {};                        // { HOSxP: { จังหวัด: [รพ...] } }
let inMap = false, curProd = null;
for (const line of lines) {
  if (line.startsWith('## ')) { inMap = /แผนที่ผลิตภัณฑ์ HIS/.test(line); curProd = null; continue; }
  if (!inMap) continue;
  const dm = line.match(/<summary><b>(.+?)<\/b>/);
  if (dm) { curProd = dm[1]; productOrgs[curProd] = {}; continue; }
  const p = line.split('|');
  if (p.length !== 7 && p.length !== 4) continue;
  if (p.length === 7) {                        // ตารางสรุปผลิตภัณฑ์
    const nm = clean(p[1]).replace(/\*/g, '');
    if (!nm || nm === 'ผลิตภัณฑ์' || /^-+$/.test(nm)) continue;
    productSummary.push({ name: nm, projects: Number(clean(p[2])) || 0,
      orgs: Number(clean(p[3]).replace(/\*/g, '')) || 0,
      provinces: Number(clean(p[4])) || 0, value: num(p[5]) || 0 });
  } else if (curProd) {                        // ตารางรายชื่อในกล่อง details
    const pvn = clean(p[1]);
    if (!pvn || pvn === 'จังหวัด' || /^-+$/.test(pvn)) continue;
    productOrgs[curProd][pvn] = clean(p[2]).split(', ').map(clean).filter(Boolean);
  }
}

/* ---- ตรวจยอด -------------------------------------------------------------- */
const tally = f => records.reduce((m, r) => { const k = f(r); m[k] = (m[k] || 0) + 1; return m; }, {});
const catTally = records.reduce((m, r) => { r.categories.forEach(c => m[c] = (m[c] || 0) + 1); return m; }, {});
const total = records.reduce((s, r) => s + r.budget, 0);
const dt = tally(r => r.dealType);

const web = records.filter(r => r.source === 'WEB');
const api = records.filter(r => r.source === 'API');
// ตรวจเฉพาะชุดที่เก็บจากหน้าเว็บ ซึ่งตรวจสอบยอดแล้ว ห้ามขยับ
const checks = [
  ['[ล็อก] จากหน้าเว็บ', web.length, 1447],
  ['[ล็อก] มูลค่าจากหน้าเว็บ', web.reduce((s2,r)=>s2+r.budget,0).toFixed(2), '420880859.72'],
  ['[ล็อก] จังหวัด (หน้าเว็บ)', new Set(web.map(r => r.province)).size, 77],
  ['[ล็อก] ยกเลิก (หน้าเว็บ)', web.filter(r => r.statusFlag === 'cancel').length, 45],
  ['[ล็อก] ผู้ขาย', vendors.length, 242],
  ['[ล็อก] HOSxP โครงการ', (productSummary[0] || {}).projects, 737],
];
const info = [
  ['จาก API (เสริม)', api.length],
  ['มูลค่าจาก API', api.reduce((s2,r)=>s2+r.budget,0).toFixed(2)],
  ['รวมทั้งหมด', records.length],
  ['ยังยื่นได้', records.filter(r => r.isOpen).length],
];
let ok = true;
for (const [label, got, want] of checks) {
  const pass = String(got) === String(want);
  if (!pass) ok = false;
  console.log((pass ? '  ok  ' : '  FAIL') + '  ' + label.padEnd(22) + String(got).padStart(14) + '   คาด ' + want);
}
console.log('');
info.forEach(([k, v]) => console.log('  ..    ' + String(k).padEnd(24) + String(v).padStart(16)));
console.log('  Tier       ', JSON.stringify(tally(r => r.tier)));
console.log('  Segment    ', JSON.stringify(tally(r => r.segment)));
console.log('  Product    ', JSON.stringify(tally(r => r.product)));
console.log('  ไม่แมตช์คีย์เวิร์ด', records.filter(r => r.needsReview).length);
console.log('  รายชื่อ รพ. ต่อผลิตภัณฑ์', Object.keys(productOrgs)
  .map(k => k + ':' + Object.values(productOrgs[k]).reduce((s, a) => s + a.length, 0)).join(' · '));

fs.writeFileSync(__dirname + '/data-his.json',
  JSON.stringify({ records, vendors, productSummary, productOrgs, urlPrefix: URL_PREFIX }), 'utf8');
console.log('\n→ data-his.json  ' + (fs.statSync(__dirname + '/data-his.json').size / 1024).toFixed(0) + ' KB');
if (!ok) { console.log('\n*** ยอดไม่ตรง หยุดก่อน ***'); process.exit(1); }
