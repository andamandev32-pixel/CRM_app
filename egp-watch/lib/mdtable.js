/* ============================================================================
   อ่าน/เขียนแถวตารางในไฟล์ .md ต้นทาง
   ตารางมี 2 แบบ: 16 ช่อง (ไฟล์ระบบยา มีคอลัมน์ปีงบ) และ 14 ช่อง (ไฟล์ HIS)
   ========================================================================= */
const fs = require('fs');

const MON = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
             'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const money = n => {
  const v = Number(n || 0);
  return Number.isInteger(v) ? v.toLocaleString('en-US')
    : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/* เลขโครงการทั้งหมดที่มีอยู่ในไฟล์ .md */
function idsInFile(mdPath) {
  const s = fs.readFileSync(mdPath, 'utf8');
  const ids = new Set();
  const re = /^\|\s*\d+\s*\|(?:\s*25\d\d\s*\|)?\s*`(\d+)`/gm;
  let m;
  while ((m = re.exec(s))) ids.add(m[1]);
  return ids;
}

/* ตาราง province -> ภาค ดึงจากข้อมูลที่มีอยู่แล้วในไฟล์ */
function provinceRegionMap(mdPath) {
  const s = fs.readFileSync(mdPath, 'utf8');
  const map = {};
  const re = /\|\s*([^|()]+?)\s*\(([^)]+)\)\s*\|/g;
  let m;
  while ((m = re.exec(s))) {
    const p = m[1].trim(), r = m[2].trim();
    if (p && r.startsWith('ภาค')) map[p] = r;
  }
  return map;
}

/* แปลง record จาก API เป็นแถว markdown */
function toRow(rec, { index, columns, region }) {
  const c = (rec.contract || [])[0] || {};
  const nm = rec.project_name || '';
  const org = rec.dept_sub_name || rec.dept_name || '';
  const pv = rec.province || '—';
  let d = rec.announce_date;
  if (!d || d === '-') d = rec.transaction_date || '—';
  const agree = c.price_agree != null ? '**' + money(c.price_agree) + '**' : '—';
  const win = c.winner_name || '_ยังไม่ลงผล_';
  const form = /บำรุงรักษา|ต่ออายุ|ต่อสัญญา|รายปี/.test(nm) ? 'MA/ซ่อมบำรุง'
             : /^เช่า|ประกวดราคาเช่า/.test(nm) ? 'เช่า' : 'จัดซื้อ/ติดตั้ง';
  const typeMethod = (rec.project_type_name || '') + ' / ' + (rec.purchase_method_name || '');

  if (columns === 16) {
    // | # | ปีงบ | เลข | ชื่อ | หน่วยงาน | จังหวัด (ภาค) | วงเงิน | รูปแบบ | ประเภท/วิธี | ประกาศ | ผล | สถานะ | ผู้ชนะ | ราคา |
    return ['', index, rec.year, '`' + rec.project_id + '`', nm, org,
            pv + ' (' + region + ')', money(rec.project_money), form, typeMethod,
            d, c.contract_date || '—', rec.project_status || '—', win, agree, ''].join(' | ')
           .replace(/^ \| /, '| ').replace(/ \| $/, ' |');
  }
  // 14 ช่อง — ไม่มีคอลัมน์ปีงบ และไม่มีคอลัมน์รูปแบบ
  return ['', index, '`' + rec.project_id + '`', nm, org,
          pv + ' (' + region + ')', money(rec.project_money), typeMethod,
          d, c.contract_date || '—', rec.project_status || '—', win, agree, ''].join(' | ')
         .replace(/^ \| /, '| ').replace(/ \| $/, ' |');
}

/* เติมแถวใหม่ท้ายตารางของ section ที่ระบุ + อัปเดตยอดในหัว section */
function appendToSection(mdPath, sectionTitle, newRows, addedCount, addedValue) {
  let s = fs.readFileSync(mdPath, 'utf8');
  const esc = sectionTitle.replace(/[.*+?^${}()|[\]\\—]/g, '\\$&');
  const hdrRe = new RegExp('^## ' + esc + ' \\((\\d+) โครงการ · ([\\d,.]+) บาท\\)$', 'm');
  const hdr = s.match(hdrRe);
  if (!hdr) throw new Error('ไม่พบหัว section: ' + sectionTitle + ' ใน ' + mdPath);

  const oldN = Number(hdr[1]);
  const oldV = Number(hdr[2].replace(/,/g, ''));

  // หาแถวสุดท้ายของตารางใน section นี้
  const start = hdr.index + hdr[0].length;
  const after = s.slice(start);
  const rowRe = /^\|\s*\d+\s*\|(?:\s*25\d\d\s*\|)?\s*`\d+`.*$/gm;
  let last = null, m;
  while ((m = rowRe.exec(after))) {
    if (m.index > 0 && /\n## /.test(after.slice(0, m.index))) break;   // ข้าม section ถัดไป
    last = m;
  }
  if (!last) throw new Error('ไม่พบแถวข้อมูลใน section: ' + sectionTitle);

  const insertAt = start + last.index + last[0].length;
  s = s.slice(0, insertAt) + '\n' + newRows.join('\n') + s.slice(insertAt);
  s = s.replace(hdr[0], '## ' + sectionTitle + ' (' + (oldN + addedCount) +
                ' โครงการ · ' + money(oldV + addedValue) + ' บาท)');
  fs.writeFileSync(mdPath, s, 'utf8');
  return { from: oldN, to: oldN + addedCount };
}

/* ลำดับสูงสุดที่ใช้อยู่ใน section (ไว้ต่อเลขแถวใหม่) */
function lastIndexInSection(mdPath, sectionTitle) {
  const s = fs.readFileSync(mdPath, 'utf8');
  const esc = sectionTitle.replace(/[.*+?^${}()|[\]\\—]/g, '\\$&');
  const i = s.search(new RegExp('^## ' + esc, 'm'));
  if (i < 0) return 0;
  const after = s.slice(i);
  const end = after.indexOf('\n## ', 3);
  const body = end > 0 ? after.slice(0, end) : after;
  let n = 0, m;
  const re = /^\|\s*(\d+)\s*\|(?:\s*25\d\d\s*\|)?\s*`\d+`/gm;
  while ((m = re.exec(body))) n = Math.max(n, Number(m[1]));
  return n;
}

module.exports = { idsInFile, provinceRegionMap, toRow, appendToSection,
                   lastIndexInSection, money, MON };
