#!/usr/bin/env node
/* ============================================================================
   egp-watch — เปิดรายงานพร้อมปุ่ม "ดึงข้อมูลใหม่ตอนนี้" ที่สั่งงานได้จริง

     node egp-watch/serve.js

   แล้วเปิด http://127.0.0.1:8899/medication-market-report.html
   (ถ้าเปิดไฟล์ .html ตรง ๆ ปุ่มจะสั่งงานไม่ได้ เพราะหน้าเว็บรันคำสั่งเองไม่ได้
    ปุ่มจะคัดลอกคำสั่งให้เอาไปวางในเทอร์มินัลแทน)

   ผูกกับ 127.0.0.1 เท่านั้น — เครื่องอื่นในเครือข่ายเข้าไม่ได้
   ========================================================================= */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = 8899;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
                '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
                '.md': 'text/markdown; charset=utf-8' };

let running = false;

function runWatch(cb) {
  if (running) return cb({ error: 'กำลังทำงานอยู่แล้ว รอสักครู่' });
  running = true;
  execFile('node', [path.join(__dirname, 'watch-daily.js')],
    { cwd: ROOT, maxBuffer: 8 * 1024 * 1024, timeout: 15 * 60 * 1000 },
    (err, stdout, stderr) => {
      running = false;
      const log = (stdout || '') + (stderr || '');
      // ดึงจำนวนงานใหม่จากบรรทัดสรุป
      const m = log.match(/พบงานใหม่รวม\s+(\d+)/);
      cb({ added: m ? Number(m[1]) : 0, log: log.trim(), failed: !!err && !m });
    });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (url.pathname === '/run') {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    runWatch(out => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8',
                           'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(out));
    });
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*',
                         'Access-Control-Allow-Methods': 'POST, GET' }).end();
    return;
  }

  // เสิร์ฟไฟล์ในโฟลเดอร์โปรเจกต์ (กัน path traversal)
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/medication-market-report.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('nope'); return; }
  fs.readFile(file, (e, buf) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
                .end('ไม่พบไฟล์: ' + p); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('egp-watch พร้อมใช้งานที่');
  console.log('  http://127.0.0.1:' + PORT + '/medication-market-report.html');
  console.log('  http://127.0.0.1:' + PORT + '/his-market-report.html');
  console.log('\nปุ่ม "ดึงข้อมูลใหม่ตอนนี้" ในรายงานจะสั่งงานผ่านหน้านี้ได้เลย · Ctrl+C เพื่อหยุด');
});
