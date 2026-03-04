const fs = require('fs');
const txt = fs.readFileSync('doc/hospital_budget_status_update_ม.ค.69.csv', 'utf8');

const lines = txt.split('\n').map(line => line.trim()).filter(line => line.length > 0);
for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('ยอดรวม Pipeline') || line.startsWith(',')) {
        // WAIT! I mistakenly skipped ALL lines starting with comma!
        console.log("SKIPPED:", line);
    }
}
