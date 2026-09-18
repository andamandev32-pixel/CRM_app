/* ============================================================================
   เรียก API จัดซื้อจัดจ้างของ สพร. (DGA)
   คู่มือ: https://govspending.data.go.th/doc-api
   ต้องส่ง api-key ทั้งใน query string และ HTTP header — ส่งอย่างเดียวไม่พอ
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const BASE = 'https://opend.data.go.th/govspending/service/egp-contract';
const PAGE = 1000;          // สูงสุดที่ API ยอมให้ต่อครั้ง
const DELAY_MS = 1000;      // หน่วงระหว่างคำขอ ไม่ยิงถี่จนกวนระบบ
const MAX_ROWS = 6000;      // กันวนไม่รู้จบถ้า total เพี้ยน

/* อ่าน API key จาก env หรือไฟล์ .env เท่านั้น — ห้าม hardcode */
function apiKey() {
  if (process.env.EGP_API_KEY) return process.env.EGP_API_KEY.trim();
  const f = path.join(__dirname, '..', '.env');
  if (fs.existsSync(f)) {
    const m = fs.readFileSync(f, 'utf8').match(/^\s*EGP_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  throw new Error(
    'ไม่พบ API key — ใส่ไว้ที่ egp-watch/.env เป็น  EGP_API_KEY=xxxxx\n' +
    '  (ขอ key ได้ที่ https://opend.data.go.th/register_api)');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function callOnce(params) {
  const KEY = apiKey();
  const qs = new URLSearchParams({ 'api-key': KEY, ...params });
  const res = await fetch(BASE + '?' + qs, { headers: { 'api-key': KEY } });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); }
  catch { throw new Error('API ตอบไม่ใช่ JSON (HTTP ' + res.status + '): ' + text.slice(0, 150)); }
  if (json.success !== true) {
    const msg = json.message || 'ไม่ทราบสาเหตุ';
    throw new Error('API ปฏิเสธ: ' + msg + (/authentication/i.test(msg)
      ? '\n  → token ไม่ถูกต้องหรือไม่มีสิทธิ์ในบริการ govspending' : ''));
  }
  return json;
}

/* ดึงครบทุกหน้าของคีย์เวิร์ด+ปีหนึ่ง ๆ */
async function search(keyword, year) {
  const rows = [];
  let offset = 0, total = null;
  for (;;) {
    const r = await callOnce({ year, keyword, limit: PAGE, offset });
    if (total === null) total = r.total || 0;
    const batch = r.data || [];
    rows.push(...batch);
    offset += batch.length;
    if (!batch.length || offset >= total || rows.length >= MAX_ROWS) break;
    await sleep(DELAY_MS);
  }
  return { total, rows };
}

module.exports = { search, sleep, apiKey, DELAY_MS };
