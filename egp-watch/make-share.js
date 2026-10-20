/* ============================================================================
   แพ็กรายงานตลาด e-GP เป็น ZIP สำหรับส่งให้คนอื่น (LINE / อีเมล)

   รายงานทุกไฟล์ฝังข้อมูลไว้ในตัวเองแล้ว จึงแค่คัดลอก 5 ไฟล์ HTML ไปไว้โฟลเดอร์เดียว
   แล้วซ่อนสิ่งที่ใช้ได้เฉพาะเครื่องเจ้าของ (ปุ่มสั่ง egp-watch, ลิงก์ไฟล์ .md, แท็บไฟล์)
   ไฟล์ต้นฉบับไม่ถูกแก้

   node egp-watch/make-share.js   → share/egp-market-reports-YYYY-MM-DD.zip
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SHARE = path.join(ROOT, 'share');
const NAME = 'egp-market-reports';
const OUT_DIR = path.join(SHARE, NAME);

const FILES = [
  'market-reports.html',
  'medication-market-report.html',
  'his-market-report.html',
  'inventory-market-report.html',
  'logistics-market-report.html',
];

// ใช้ CSS เพราะเนื้อหาถูก render ด้วย JS — ครอบคลุมของที่สร้างทีหลังโดยไม่ต้องแก้ logic
const HIDE_CSS = '<style>/* ฉบับแชร์ (make-share.js) */' +
  '#btnRun,#runBox{display:none!important}' +                    // สั่ง egp-watch ได้แค่เครื่องเจ้าของ
  'a[href$=".md"]{display:none!important}' +                     // ไฟล์ .md ไม่ได้แนบไปด้วย
  'nav.tabs button[data-tab="files"]{display:none!important}' +  // hub: แท็บนี้ชี้ไฟล์ที่ไม่ได้แนบ
  '</style>\n';

const README =
  'รายงานตลาด e-GP — AndamanTech\r\n\r\n' +
  'วิธีเปิด: แตกไฟล์ ZIP ให้ครบทั้งโฟลเดอร์ก่อน แล้วดับเบิลคลิก market-reports.html\r\n' +
  '(เปิดด้วย Chrome หรือ Edge) — ไม่ต้องต่อเน็ตก็ดูได้\r\n\r\n' +
  'ถ้าเปิดจากในแอปแชทหรือในหน้าต่าง ZIP โดยตรง ลิงก์ระหว่างรายงานจะใช้ไม่ได้\r\n';

const today = () => {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
};

function zip(dir, out) {
  // tar.exe ของ Windows 10+ (bsdtar) — -a เลือกรูปแบบจากนามสกุล .zip
  // ระบุ path ตรง ๆ เพราะ tar ของ Git Bash (GNU) ทำ zip ไม่ได้
  const tar = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe');
  try {
    execFileSync(tar, ['-a', '-c', '-f', out, '-C', path.dirname(dir), path.basename(dir)], { stdio: 'pipe' });
  } catch (e) {
    execFileSync('powershell', ['-NoProfile', '-Command',
      `Compress-Archive -Path '${dir}' -DestinationPath '${out}' -Force`], { stdio: 'pipe' });
  }
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const f of FILES) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (!html.includes('</head>')) throw new Error('ไม่พบ </head> ใน ' + f);
  fs.writeFileSync(path.join(OUT_DIR, f), html.replace('</head>', () => HIDE_CSS + '</head>'), 'utf8');
}
// ชื่อไฟล์ภาษาไทยเพี้ยนใน ZIP บนบางเครื่อง จึงใช้ชื่ออังกฤษ
fs.writeFileSync(path.join(OUT_DIR, 'README.txt'), '﻿' + README, 'utf8');

const zipPath = path.join(SHARE, NAME + '-' + today() + '.zip');
fs.rmSync(zipPath, { force: true });
zip(OUT_DIR, zipPath);

console.log('ZIP → ' + path.relative(ROOT, zipPath) + '  ' +
  (fs.statSync(zipPath).size / 1024 / 1024).toFixed(1) + ' MB');
