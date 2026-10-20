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
                // text/plain ให้เบราว์เซอร์แสดงไฟล์ .md ในแท็บ แทนที่จะดาวน์โหลด
                '.md': 'text/plain; charset=utf-8' };

let running = false;

/* สถานะงานล่าสุด — หน้ารวม market-reports.html สั่งผ่าน /start แล้วถาม /status เป็นระยะ
   เพราะรอบเต็ม 4 กลุ่มใช้เวลาเกิน 10 นาที (วัด 30 ก.ย. 69) รอใน request เดียวไม่ไหว */
const job = { running: false, startedAt: 0, log: '', added: 0, failed: false };

function runWatch(cb) {
  if (running) return cb({ error: 'กำลังทำงานอยู่แล้ว รอสักครู่' });
  running = true;
  Object.assign(job, { running: true, startedAt: Date.now(), log: '', added: 0, failed: false });
  const child = execFile('node', [path.join(__dirname, 'watch-daily.js')],
    { cwd: ROOT, maxBuffer: 8 * 1024 * 1024, timeout: 30 * 60 * 1000 },
    (err, stdout, stderr) => {
      running = false;
      const log = (stdout || '') + (stderr || '');
      // ดึงจำนวนงานใหม่จากบรรทัดสรุป
      const m = log.match(/พบงานใหม่รวม\s+(\d+)/);
      const out = { added: m ? Number(m[1]) : 0, log: log.trim(), failed: !!err && !m };
      Object.assign(job, out, { running: false });
      cb(out);
    });
  const tee = d => { job.log += d; };
  child.stdout.on('data', tee);
  child.stderr.on('data', tee);
}

const sendJson = (res, obj) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8',
                       'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
};

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
  if (url.pathname === '/start') {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    if (!job.running) runWatch(() => {});
    sendJson(res, { started: true });
    return;
  }
  if (url.pathname === '/status') {
    sendJson(res, { running: job.running, added: job.added, failed: job.failed,
      elapsed: job.startedAt ? Math.round((Date.now() - job.startedAt) / 1000) : 0,
      log: job.log.slice(-4000) });
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*',
                         'Access-Control-Allow-Methods': 'POST, GET' }).end();
    return;
  }

  // เสิร์ฟไฟล์ในโฟลเดอร์โปรเจกต์ (กัน path traversal)
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/market-reports.html';
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
  console.log('  http://127.0.0.1:' + PORT + '/                  ← หน้ารวมรายงานทั้งหมด');
  console.log('  http://127.0.0.1:' + PORT + '/medication-market-report.html');
  console.log('  http://127.0.0.1:' + PORT + '/his-market-report.html');
  console.log('  http://127.0.0.1:' + PORT + '/inventory-market-report.html');
  console.log('  http://127.0.0.1:' + PORT + '/logistics-market-report.html');
  console.log('\nปุ่ม "ดึงข้อมูลใหม่ตอนนี้" ในรายงานจะสั่งงานผ่านหน้านี้ได้เลย · Ctrl+C เพื่อหยุด');
});
