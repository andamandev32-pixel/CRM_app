/* ============================================================================
   สร้างลิงก์หน้าโครงการใน e-GP จากเลขโครงการ

   ลิงก์ของ e-GP คือ .../announcement/procurement/<token>
   token = CryptoJS.AES.encrypt(JSON.stringify({projectId}), "RDCrypto") แล้ว encodeURIComponent 2 ชั้น
   (ถอดจาก encryptData() ในบันเดิล egp-agpc01-web — ตรวจแล้ว 30 ก.ย. 69 ว่าถอด token เดิมในไฟล์
    ได้ {"projectId":"…"} ตรงกับเลขโครงการทุกตัว)

   ใช้เติมลิงก์ให้แถวที่มาจาก API ซึ่งไม่มีลิงก์มาด้วย — salt ผูกกับเลขโครงการ
   เพื่อให้ build ซ้ำแล้วได้ลิงก์เดิม ไม่ทำให้ไฟล์รายงานเปลี่ยนทุกรอบ
   ========================================================================= */
const crypto = require('crypto');

const PREFIX = 'https://process5.gprocurement.go.th/egp-agpc01-web/announcement/procurement/';
const PASS = 'RDCrypto';

// EVP_BytesToKey (MD5) แบบเดียวกับ CryptoJS เมื่อส่ง passphrase เป็น string
function keyIv(salt) {
  let out = Buffer.alloc(0), prev = Buffer.alloc(0);
  while (out.length < 48) {
    prev = crypto.createHash('md5').update(Buffer.concat([prev, Buffer.from(PASS), salt])).digest();
    out = Buffer.concat([out, prev]);
  }
  return { key: out.subarray(0, 32), iv: out.subarray(32, 48) };
}

function token(projectId) {
  const id = String(projectId);
  const salt = crypto.createHash('md5').update('egp-watch:' + id).digest().subarray(0, 8);
  const { key, iv } = keyIv(salt);
  const c = crypto.createCipheriv('aes-256-cbc', key, iv);
  const ct = Buffer.concat([c.update(JSON.stringify({ projectId: id })), c.final()]);
  const b64 = Buffer.concat([Buffer.from('Salted__'), salt, ct]).toString('base64');
  return encodeURIComponent(encodeURIComponent(b64));
}

function decode(tok) {
  const b = Buffer.from(decodeURIComponent(decodeURIComponent(tok)), 'base64');
  const { key, iv } = keyIv(b.subarray(8, 16));
  const d = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return JSON.parse(Buffer.concat([d.update(b.subarray(16)), d.final()]).toString()).projectId;
}

const url = projectId => PREFIX + token(projectId);

module.exports = { url, token, decode, PREFIX };
