// Sample Data for Sale Tracking System v1.4
// ข้อมูลจริงจาก hospital_budget_status_update ม.ค.69.csv
// แทนที่ข้อมูลตัวอย่างเดิมด้วยข้อมูลนำเสนอจริง

const SAMPLE_DATA = {
  users: [
    { id: 'U01', name: 'สมชาย ใจดี', email: 'somchai@company.com', role: 'sales', region: 'กลาง', avatar: '👨‍💼' },
    { id: 'U02', name: 'วิภา ศรีสุข', email: 'wipa@company.com', role: 'manager', region: 'กลาง', avatar: '👩‍💼' },
    { id: 'U03', name: 'ประสิทธิ์ วงศ์ใหญ่', email: 'prasit@company.com', role: 'management', region: 'ทั้งหมด', avatar: '👔' },
    { id: 'U04', name: 'ณัฐพล เทคโนโลยี', email: 'nattapol@company.com', role: 'po', region: 'ทั้งหมด', avatar: '👨‍💻' },
    { id: 'U05', name: 'สุดา มานะ', email: 'suda@company.com', role: 'sales', region: 'เหนือ', avatar: '👩‍💼' }
  ],

  // ลูกค้าจริง 25 แห่ง จาก CSV
  customers: [
    // 🔵 กลุ่มกองทัพบก
    { id: 'C001', name: 'รพ.ค่ายประจักษ์ศิลปาคม', type: 'army', region: 'อีสาน', province: 'อุดรธานี', tier: 'T2', status: 'active', assignedTo: 'U01', createdAt: '2025-06-01' },
    { id: 'C002', name: 'รพ.ค่ายธนรัตน์', type: 'army', region: 'ใต้', province: 'ประจวบคีรีขันธ์', tier: 'T2', status: 'active', assignedTo: 'U01', createdAt: '2025-06-01' },
    { id: 'C003', name: 'รพ.ค่ายศรีสองรัก', type: 'army', region: 'อีสาน', province: 'เลย', tier: 'T2', status: 'active', assignedTo: 'U01', createdAt: '2025-07-01' },
    { id: 'C004', name: 'รพ.ค่ายสุรศักดิมนตรี', type: 'army', region: 'เหนือ', province: 'ลำปาง', tier: 'T2', status: 'active', assignedTo: 'U05', createdAt: '2025-07-01' },
    { id: 'C005', name: 'รพ.ค่ายเทพสตรีศรีสุนทร', type: 'army', region: 'ใต้', province: 'นครศรีธรรมราช', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-08-01' },
    // 🟢 กลุ่ม รพ.รัฐ
    { id: 'C006', name: 'รพ.มหาวิทยาลัยพะเยา', type: 'government', region: 'เหนือ', province: 'พะเยา', tier: 'T2', status: 'active', assignedTo: 'U05', createdAt: '2025-01-01' },
    { id: 'C007', name: 'รพ.มะเร็งลพบุรี', type: 'government', region: 'กลาง', province: 'ลพบุรี', tier: 'T1', status: 'active', assignedTo: 'U01', createdAt: '2025-03-01' },
    { id: 'C008', name: 'ศูนย์การแพทย์กาญจนาภิเษก ม.มหิดล', type: 'government', region: 'กลาง', province: 'นครปฐม', tier: 'T2', status: 'active', assignedTo: 'U01', createdAt: '2025-04-01' },
    { id: 'C009', name: 'รพ.จุฬาภรณ์ (ระบบคิว)', type: 'government', region: 'กลาง', province: 'กรุงเทพมหานคร', tier: 'T1', status: 'active', assignedTo: 'U01', createdAt: '2025-05-01' },
    { id: 'C010', name: 'รพ.จุฬาภรณ์ (HIS)', type: 'government', region: 'กลาง', province: 'กรุงเทพมหานคร', tier: 'T1', status: 'active', assignedTo: 'U01', createdAt: '2025-09-01' },
    { id: 'C011', name: 'อบจ.สระบุรี', type: 'government', region: 'กลาง', province: 'สระบุรี', tier: 'T1', status: 'active', assignedTo: 'U01', createdAt: '2025-02-01' },
    { id: 'C012', name: 'ม.สวนดุสิต', type: 'government', region: 'กลาง', province: 'กรุงเทพมหานคร', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-10-01' },
    { id: 'C013', name: 'รพ.อ่างทอง', type: 'government', region: 'กลาง', province: 'อ่างทอง', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-10-01' },
    { id: 'C014', name: 'รพ.สันทราย', type: 'government', region: 'เหนือ', province: 'เชียงใหม่', tier: 'T2', status: 'active', assignedTo: 'U05', createdAt: '2025-06-01' },
    { id: 'C015', name: 'รพ.สวรรค์ประชารักษ์', type: 'government', region: 'เหนือ', province: 'นครสวรรค์', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-11-01' },
    { id: 'C016', name: 'รพ.ชัยนาทนเรนทร', type: 'government', region: 'กลาง', province: 'ชัยนาท', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-11-01' },
    { id: 'C017', name: 'รพ.กำแพงเพชร', type: 'government', region: 'เหนือ', province: 'กำแพงเพชร', tier: 'T3', status: 'prospect', assignedTo: 'U05', createdAt: '2025-11-01' },
    { id: 'C018', name: 'ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน ม.ศรีนครินทร์', type: 'government', region: 'กลาง', province: 'นนทบุรี', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2025-12-01' },
    { id: 'C019', name: 'รพ.บางปะกง', type: 'government', region: 'กลาง', province: 'ฉะเชิงเทรา', tier: 'T3', status: 'prospect', assignedTo: 'U01', createdAt: '2026-01-01' },
    { id: 'C020', name: 'รพ.ทันตกรรม มช.', type: 'government', region: 'เหนือ', province: 'เชียงใหม่', tier: 'T3', status: 'prospect', assignedTo: 'U05', createdAt: '2026-01-01' },
    { id: 'C021', name: 'รพ.มะเร็งชลบุรี', type: 'government', region: 'กลาง', province: 'ชลบุรี', tier: 'T2', status: 'active', assignedTo: 'U01', createdAt: '2025-05-01' },
    { id: 'C022', name: 'สถาบันเด็กแห่งชาติมหาราชินี', type: 'government', region: 'กลาง', province: 'กรุงเทพมหานคร', tier: 'T2', status: 'prospect', assignedTo: 'U01', createdAt: '2025-12-01' },
    // 🟣 เอกชน
    { id: 'C023', name: 'รพ.ราชเวช (เหนือ)', type: 'private', region: 'เหนือ', province: 'เชียงใหม่', tier: 'T3', status: 'prospect', assignedTo: 'U05', createdAt: '2025-10-01' }
  ],

  contacts: [
    { id: 'CT001', customerId: 'C001', name: 'ผอ.รพ.ค่ายประจักษ์ฯ', position: 'ผู้อำนวยการ', phone: '042-000-001', email: 'director@prachak.mil.th' },
    { id: 'CT002', customerId: 'C006', name: 'หัวหน้า IT ม.พะเยา', position: 'หัวหน้าแผนก IT', phone: '054-000-001', email: 'it@up.ac.th' },
    { id: 'CT003', customerId: 'C007', name: 'ผอ.รพ.มะเร็งลพบุรี', position: 'ผู้อำนวยการ', phone: '036-000-001', email: 'dir@lopburicancer.go.th' },
    { id: 'CT004', customerId: 'C010', name: 'ผู้บริหาร รพ.จุฬาภรณ์', position: 'รองผู้อำนวยการ', phone: '02-576-6000', email: 'admin@ccmc.or.th' },
    { id: 'CT005', customerId: 'C011', name: 'นายก อบจ.สระบุรี', position: 'นายก อบจ.', phone: '036-000-002', email: 'mayor@saraburipao.go.th' },
    { id: 'CT006', customerId: 'C014', name: 'ผอ.รพ.สันทราย', position: 'ผู้อำนวยการ', phone: '053-000-001', email: 'dir@sansai.go.th' },
    { id: 'CT007', customerId: 'C021', name: 'ผอ.รพ.มะเร็งชลบุรี', position: 'ผู้อำนวยการ', phone: '038-000-001', email: 'dir@chonburicancer.go.th' }
  ],

  visitPlans: [
    { id: 'VP001', month: 1, year: 2026, salesId: 'U01', status: 'approved', approvedBy: 'U02', approvedAt: '2026-01-02', totalBudget: 25000, note: 'แผนเข้าพบ รพ.รัฐ + กองทัพ ม.ค. 69' },
    { id: 'VP002', month: 2, year: 2026, salesId: 'U05', status: 'pending', approvedBy: null, approvedAt: null, totalBudget: 15000, note: 'แผนเข้าพบ รพ.ภาคเหนือ ก.พ. 69' }
  ],

  visitPlanItems: [
    { id: 'VPI001', planId: 'VP001', customerId: 'C010', visitDate: '2026-01-15', purpose: 'นำเสนอระบบคิวครบวงจร', product: 'MediQ', estimatedCost: 5000 },
    { id: 'VPI002', planId: 'VP001', customerId: 'C007', visitDate: '2026-01-18', purpose: 'ติดตาม E-Bidding ระบบคิว', product: 'MediQ', estimatedCost: 3000 },
    { id: 'VPI003', planId: 'VP001', customerId: 'C011', visitDate: '2026-01-22', purpose: 'ติดตามผลเสนอ Proposal ระบบระบาดวิทยา', product: 'Custom', estimatedCost: 7000 },
    { id: 'VPI004', planId: 'VP002', customerId: 'C006', visitDate: '2026-02-10', purpose: 'ตรวจสอบ TOR จัดซื้อ MediQ', product: 'MediQ', estimatedCost: 6000 },
    { id: 'VPI005', planId: 'VP002', customerId: 'C014', visitDate: '2026-02-12', purpose: 'เจรจางบประมาณ MediCore', product: 'HIS', estimatedCost: 5000 }
  ],

  visitReports: [
    { id: 'VR001', customerId: 'C010', visitDate: '2026-01-15', attendees: 'ผู้บริหาร รพ.จุฬาภรณ์', products: ['MediQ'], objective: 'นำเสนอระบบคิวครบวงจร ม.ค. 2569', summary: 'ผู้บริหารต้องการนำเสนอระบบคิวครบวงจร มี E-Bidding HIS 1 ธ.ค. 2568', interest: 'hot', createdBy: 'U01', createdAt: '2026-01-15' },
    { id: 'VR002', customerId: 'C008', visitDate: '2026-01-10', attendees: 'ฝ่ายจัดซื้อ ศูนย์การแพทย์กาญจนาภิเษก', products: ['MediQ'], objective: 'Present ครั้งที่ 2 และส่ง TOR', summary: 'present 2 ครั้ง ส่ง TOR ล่าสุดให้แล้ว', interest: 'warm', createdBy: 'U01', createdAt: '2026-01-10' },
    { id: 'VR003', customerId: 'C011', visitDate: '2026-01-22', attendees: 'นายก อบจ.สระบุรี', products: ['Custom'], objective: 'ติดตามผล Proposal ระบบระบาดวิทยา', summary: 'เสนอ Proposal ลูกค้ากำลังนำเสนอเพื่อขอกงบ อบจ. ลูกค้าเลือกเราแล้ว', interest: 'hot', createdBy: 'U01', createdAt: '2026-01-22' }
  ],

  followUps: [
    { id: 'FU001', reportId: 'VR001', customerId: 'C010', action: 'เตรียมเอกสารนำเสนอระบบคิวครบวงจร', deadline: '2026-01-25', assignedTo: 'U01', status: 'done' },
    { id: 'FU002', reportId: 'VR002', customerId: 'C008', action: 'ติดตามผลที่ส่ง TOR ไป', deadline: '2026-02-15', assignedTo: 'U01', status: 'pending' },
    { id: 'FU003', reportId: 'VR003', customerId: 'C011', action: 'ติดตามอนุมัติงบ อบจ.', deadline: '2026-02-28', assignedTo: 'U01', status: 'pending' },
    { id: 'FU004', reportId: 'VR001', customerId: 'C010', action: 'นัดรอนำเสนอ รพ.จุฬาภรณ์ ม.ค. 69', deadline: '2026-01-31', assignedTo: 'U01', status: 'pending' },
    { id: 'FU005', reportId: 'VR001', customerId: 'C007', action: 'รอหน่วยงานประมูล E-Bidding', deadline: '2026-02-10', assignedTo: 'U01', status: 'overdue' }
  ],

  // Opportunities จากข้อมูลจริง CSV — 25 รายการ
  opportunities: [
    // กลุ่มกองทัพบก — MediCore
    {
      id: 'OPP001', customerId: 'C001', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S1', budgetCode: 'B3', budgetYear: '2569', probability: 5, expectedClose: '2026-09-30', assignedTo: 'U01', interest: 'warm', salesStatus: 'ติดตามเพื่อขอนำเสนองาน', detail: 'เปลี่ยน ผอ. ใหม่', createdAt: '2025-06-01', stageHistory: [
        { stage: 'S0', date: '2025-06-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2025-10-01', reason: 'ติดตามเพื่อขอนำเสนองาน — เปลี่ยน ผอ. ใหม่' }
      ]
    },
    {
      id: 'OPP002', customerId: 'C002', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S2', budgetCode: 'B3', budgetYear: '2569', probability: 10, expectedClose: '2026-09-30', assignedTo: 'U01', interest: 'warm', salesStatus: 'Work In Process', detail: '', createdAt: '2025-06-01', stageHistory: [
        { stage: 'S0', date: '2025-06-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2025-08-01', reason: 'เข้าพบแนะนำ' },
        { stage: 'S2', date: '2025-11-01', reason: 'Work In Process' }
      ]
    },
    {
      id: 'OPP003', customerId: 'C003', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S2', budgetCode: 'B3', budgetYear: '2569', probability: 10, expectedClose: '2026-09-30', assignedTo: 'U01', interest: 'warm', salesStatus: 'ทำเอกสาร คฉ เพื่อขออนุมัติให้งบ', detail: '', createdAt: '2025-07-01', stageHistory: [
        { stage: 'S0', date: '2025-07-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S2', date: '2025-12-01', reason: 'ทำเอกสาร คฉ เพื่อขออนุมัติให้งบ' }
      ]
    },
    {
      id: 'OPP004', customerId: 'C004', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S2', budgetCode: 'B3', budgetYear: '2569', probability: 10, expectedClose: '2026-09-30', assignedTo: 'U05', interest: 'warm', salesStatus: 'ทำเอกสาร คฉ เพื่อขออนุมัติให้งบ', detail: '', createdAt: '2025-07-01', stageHistory: [
        { stage: 'S0', date: '2025-07-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S2', date: '2025-12-01', reason: 'ทำเอกสาร คฉ เพื่อขออนุมัติให้งบ' }
      ]
    },
    {
      id: 'OPP005', customerId: 'C005', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'ติดตามเพื่อขอนำเสนองาน', detail: '', createdAt: '2025-08-01', stageHistory: [
        { stage: 'S1', date: '2025-08-01', reason: 'ติดตามเพื่อขอนำเสนองาน' }
      ]
    },
    // 🟢 รพ.รัฐ — MediQ / HIS / Custom
    {
      id: 'OPP006', customerId: 'C006', product: 'MediQ', productGroup: 'MEDIQ', value: 300000, stage: 'S2', budgetCode: 'B3', budgetYear: '2569', probability: 10, expectedClose: '2026-03-31', assignedTo: 'U05', interest: 'hot', salesStatus: 'Work In Process', detail: 'กำลังตรวจสอบ TOR จัดซื้อภายในต้นเดือน ธ.ค. 2568 จัดทำใบเสนอราคาคู่เทียบ ส่งมอบใน 30 วัน', createdAt: '2025-01-01', stageHistory: [
        { stage: 'S0', date: '2025-01-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2025-06-01', reason: 'เข้าพบนำเสนอ' },
        { stage: 'S2', date: '2025-12-01', reason: 'ตรวจสอบ TOR' }
      ]
    },
    {
      id: 'OPP007', customerId: 'C007', product: 'MediQ', productGroup: 'MEDIQ', value: 3900000, stage: 'S7', budgetCode: 'B3', budgetYear: '2569', probability: 85, expectedClose: '2026-03-31', assignedTo: 'U01', interest: 'hot', salesStatus: 'รอ e-bidding', detail: 'รอหน่วยงาน ประมูล / E-Bidding', createdAt: '2025-03-01', stageHistory: [
        { stage: 'S0', date: '2025-03-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2025-05-01', reason: 'เข้าพบนำเสนอ' },
        { stage: 'S5', date: '2025-09-01', reason: 'ส่งข้อเสนอ' },
        { stage: 'S7', date: '2025-12-01', reason: 'รอ E-Bidding' }
      ]
    },
    {
      id: 'OPP008', customerId: 'C008', product: 'MediQ', productGroup: 'MEDIQ', value: 250000, stage: 'S4', budgetCode: 'B2', budgetYear: '2569', probability: 35, expectedClose: '2026-06-30', assignedTo: 'U01', interest: 'warm', salesStatus: 'ติดตามผล ที่ส่ง TOR ไป', detail: 'present 2 ครั้ง ส่ง TOR ล่าสุดให้แล้ว', createdAt: '2025-04-01', stageHistory: [
        { stage: 'S1', date: '2025-04-01', reason: 'เข้าพบครั้งแรก' },
        { stage: 'S3', date: '2025-08-01', reason: 'นำเสนอครั้งที่ 2' },
        { stage: 'S4', date: '2025-11-01', reason: 'ส่ง TOR ให้แล้ว' }
      ]
    },
    {
      id: 'OPP009', customerId: 'C009', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S3', budgetCode: 'B1', budgetYear: '', probability: 20, expectedClose: '2026-12-31', assignedTo: 'U01', interest: 'warm', salesStatus: 'ขอ demo trial ระบบ', detail: 'present 2 ครั้ง ล.ค. ขอ demo trial ระบบ', createdAt: '2025-05-01', stageHistory: [
        { stage: 'S1', date: '2025-05-01', reason: 'เข้าพบครั้งแรก' },
        { stage: 'S3', date: '2025-10-01', reason: 'present 2 ครั้ง ขอ demo/trial' }
      ]
    },
    {
      id: 'OPP010', customerId: 'C010', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B3', budgetYear: '2569', probability: 5, expectedClose: '2026-06-30', assignedTo: 'U01', interest: 'hot', salesStatus: 'นัดรอนำเสนอ 20%', detail: 'ผู้บริหารต้องการนำเสนอระบบคิวครบวงจร ช่วง ม.ค. 2569 / มี E-Bidding HIS 1 ธ.ค. 2568', createdAt: '2025-09-01', stageHistory: [
        { stage: 'S0', date: '2025-09-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2025-12-01', reason: 'นัดรอนำเสนอ ม.ค. 69' }
      ]
    },
    {
      id: 'OPP011', customerId: 'C011', product: 'ระบบระบาดวิทยา', productGroup: 'Custom', value: 9000000, stage: 'S6', budgetCode: 'B0', budgetYear: '2570', probability: 70, expectedClose: '2026-09-30', assignedTo: 'U01', interest: 'hot', salesStatus: 'เลือกเราแล้ว รออนุมัติ 10%', detail: 'เสนอ Proposal ลูกค้ากำลังนำเสนอเพื่อขอกงบ อบจ.', createdAt: '2025-02-01', stageHistory: [
        { stage: 'S1', date: '2025-02-01', reason: 'เข้าพบแนะนำ' },
        { stage: 'S3', date: '2025-05-01', reason: 'นำเสนอระบบ' },
        { stage: 'S5', date: '2025-09-01', reason: 'ส่ง Proposal' },
        { stage: 'S6', date: '2025-12-01', reason: 'เลือกเราแล้ว รออนุมัติงบ อบจ.' }
      ]
    },
    {
      id: 'OPP012', customerId: 'C023', product: 'MediQ', productGroup: 'MEDIQ', value: 250000, stage: 'S3', budgetCode: 'B0', budgetYear: '', probability: 20, expectedClose: '2026-12-31', assignedTo: 'U05', interest: 'warm', salesStatus: 'รอนัดหมายติดตั้ง Demo', detail: 'รอนัดหมายติดตั้ง Demo', createdAt: '2025-10-01', stageHistory: [
        { stage: 'S1', date: '2025-10-01', reason: 'เข้าพบแนะนำ' },
        { stage: 'S3', date: '2025-12-01', reason: 'รอนัดหมายติดตั้ง Demo' }
      ]
    },
    {
      id: 'OPP013', customerId: 'C012', product: 'MediQ', productGroup: 'MEDIQ', value: 150000, stage: 'S0', budgetCode: 'B1', budgetYear: '', probability: 0, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'เริ่มต้น Lead 0%', detail: 'ยังไม่ทราบงบ / เริ่มต้น Lead', createdAt: '2025-10-01', stageHistory: [
        { stage: 'S0', date: '2025-10-01', reason: 'เริ่มต้น Lead' }
      ]
    },
    {
      id: 'OPP014', customerId: 'C013', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '2570', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'นัด Present 20%', detail: 'นัด Present / นำเสนอเพิ่มเติม', createdAt: '2025-10-01', stageHistory: [
        { stage: 'S0', date: '2025-10-01', reason: 'ระบุเป้าหมาย' },
        { stage: 'S1', date: '2026-01-01', reason: 'นัด Present' }
      ]
    },
    {
      id: 'OPP015', customerId: 'C014', product: 'MediCore', productGroup: 'HIS', value: 0, stage: 'S4', budgetCode: 'B1', budgetYear: '', probability: 35, expectedClose: '2027-03-31', assignedTo: 'U05', interest: 'warm', salesStatus: 'งบประมาณ/ร่างสัญญา', detail: 'งบประมาณ / ร่างสัญญาพัฒนาร่วมกัน', createdAt: '2025-06-01', stageHistory: [
        { stage: 'S1', date: '2025-06-01', reason: 'เข้าพบแนะนำ' },
        { stage: 'S3', date: '2025-09-01', reason: 'นำเสนอระบบ' },
        { stage: 'S4', date: '2025-12-01', reason: 'ร่างสัญญาพัฒนาร่วมกัน' }
      ]
    },
    {
      id: 'OPP016', customerId: 'C015', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'นัด Present 20%', detail: 'present 1 ครั้ง แล้ว', createdAt: '2025-11-01', stageHistory: [
        { stage: 'S1', date: '2025-11-01', reason: 'present 1 ครั้ง แล้ว' }
      ]
    },
    {
      id: 'OPP017', customerId: 'C016', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'นัด Present 20%', detail: 'นัด Present / นำเสนอเพิ่มเติม', createdAt: '2025-11-01', stageHistory: [
        { stage: 'S1', date: '2025-11-01', reason: 'นัด Present' }
      ]
    },
    {
      id: 'OPP018', customerId: 'C017', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U05', interest: 'cold', salesStatus: 'นัด Present 20%', detail: 'present 1 ครั้ง', createdAt: '2025-11-01', stageHistory: [
        { stage: 'S1', date: '2025-11-01', reason: 'present 1 ครั้ง' }
      ]
    },
    {
      id: 'OPP019', customerId: 'C018', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-03-31', assignedTo: 'U01', interest: 'cold', salesStatus: 'ติดตามผล', detail: 'present 1 ครั้ง แล้ว', createdAt: '2025-12-01', stageHistory: [
        { stage: 'S1', date: '2025-12-01', reason: 'present 1 ครั้ง แล้ว' }
      ]
    },
    {
      id: 'OPP020', customerId: 'C019', product: 'MediQ', productGroup: 'MEDIQ', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-06-30', assignedTo: 'U01', interest: 'cold', salesStatus: 'นัดหมายเข้านำเสนอ', detail: 'นัดหมายเข้านำเสนอ', createdAt: '2026-01-01', stageHistory: [
        { stage: 'S1', date: '2026-01-01', reason: 'นัดหมายเข้านำเสนอ' }
      ]
    },
    {
      id: 'OPP021', customerId: 'C020', product: 'HIS', productGroup: 'HIS', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-06-30', assignedTo: 'U05', interest: 'cold', salesStatus: 'นัดหมายเข้านำเสนอ', detail: 'นัดหมายเข้านำเสนอ', createdAt: '2026-01-01', stageHistory: [
        { stage: 'S1', date: '2026-01-01', reason: 'นัดหมายเข้านำเสนอ' }
      ]
    },
    {
      id: 'OPP022', customerId: 'C021', product: 'MediQ', productGroup: 'MEDIQ', value: 4500000, stage: 'S0', budgetCode: 'B0', budgetYear: '2570', probability: 0, expectedClose: '2027-09-30', assignedTo: 'U01', interest: 'cold', salesStatus: 'เริ่มต้น Lead 0%', detail: 'ตั้งเป้า Push เข้าแผนงบปี 70', createdAt: '2025-05-01', stageHistory: [
        { stage: 'S0', date: '2025-05-01', reason: 'เริ่มต้น Lead — ตั้งเป้า Push เข้าแผนงบปี 70' }
      ]
    },
    {
      id: 'OPP023', customerId: 'C022', product: 'HIS', productGroup: 'HIS', value: 0, stage: 'S1', budgetCode: 'B0', budgetYear: '', probability: 5, expectedClose: '2027-06-30', assignedTo: 'U01', interest: 'cold', salesStatus: 'นัดรอนำเสนอ', detail: 'นัดรอนำเสนอ', createdAt: '2025-12-01', stageHistory: [
        { stage: 'S1', date: '2025-12-01', reason: 'นัดรอนำเสนอ' }
      ]
    }
  ],

  demoRequests: [
    { id: 'DEMO001', opportunityId: 'OPP009', customerId: 'C009', type: 'demo', product: 'MediQ', modules: ['Queue Display', 'Kiosk', 'Mobile App'], startDate: '2026-02-15', endDate: '2026-02-15', status: 'pending_l1', approvedBy1: null, approvedBy2: null, totalCost: 25000, attachments: [], createdBy: 'U01', createdAt: '2026-01-20' },
    { id: 'DEMO002', opportunityId: 'OPP012', customerId: 'C023', type: 'demo', product: 'MediQ', modules: ['Queue Display'], startDate: '2026-03-01', endDate: '2026-03-01', status: 'draft', approvedBy1: null, approvedBy2: null, totalCost: 15000, attachments: [], createdBy: 'U05', createdAt: '2026-01-25' }
  ],

  demoProgress: [],

  customerInsights: [
    { id: 'INS001', customerId: 'C010', product: 'MediQ', description: 'ผู้บริหาร รพ.จุฬาภรณ์ ต้องการระบบคิวครบวงจร — ครอบคลุม OPD, IPD, Lab, X-ray', priority: 'high', frequency: 1, status: 'reviewing', reviewedBy: 'U02', devNote: '', createdBy: 'U01', createdAt: '2026-01-15' },
    { id: 'INS002', customerId: 'C011', product: 'Custom', description: 'อบจ.สระบุรี ต้องการระบบงานระบาดวิทยาเชื่อมต่อกับ สาธารณสุขจังหวัด', priority: 'high', frequency: 1, status: 'in_dev', reviewedBy: 'U02', devNote: 'กำลังพัฒนาระบบ Epidemiology Module', createdBy: 'U01', createdAt: '2025-09-01' },
    { id: 'INS003', customerId: 'C014', product: 'HIS', description: 'รพ.สันทราย ต้องการ MediCore แบบร่วมพัฒนา — ปรับแต่งตามความต้องการ', priority: 'medium', frequency: 1, status: 'new', reviewedBy: null, devNote: '', createdBy: 'U05', createdAt: '2026-01-10' }
  ],

  notifications: [
    { id: 'N001', userId: 'U01', type: 'follow_up_overdue', message: 'Follow-up เกินกำหนด: รอ E-Bidding — รพ.มะเร็งลพบุรี', link: '#followup', isRead: false, createdAt: '2026-02-11' },
    { id: 'N002', userId: 'U01', type: 'budget_action_needed', message: '⚠️ รพ.จุฬาภรณ์ มีงบพร้อม (B3) แต่ยังอยู่ใน Stage S1', link: '#pipeline', isRead: false, createdAt: '2026-02-15' },
    { id: 'N003', userId: 'U01', type: 'approval_result', message: 'แผนการเข้าพบเดือน ม.ค. 69 ได้รับการอนุมัติแล้ว', link: '#visit-plan', isRead: true, createdAt: '2026-01-02' },
    { id: 'N004', userId: 'U02', type: 'approval_pending', message: 'มีคำขอ Demo ใหม่รออนุมัติ — รพ.จุฬาภรณ์ (ระบบคิว)', link: '#demo-approval', isRead: false, createdAt: '2026-01-20' },
    { id: 'N005', userId: 'U01', type: 'budget_stale', message: '💰 Budget ของ รพ.ค่ายประจักษ์ฯ ยังไม่ได้อัปเดตนาน 30 วัน', link: '#budget-dashboard', isRead: false, createdAt: '2026-02-20' }
  ]
};

// Helper function to initialize data in localStorage
function initializeSampleData() {
  if (!localStorage.getItem('saleTrackingData')) {
    localStorage.setItem('saleTrackingData', JSON.stringify(SAMPLE_DATA));
    console.log('✅ Sample data initialized (real CSV data v1.4)');
  } else {
    console.log('ℹ️ Data already exists in localStorage');
  }
}

// Helper function to get data
function getData(key) {
  const data = JSON.parse(localStorage.getItem('saleTrackingData') || '{}');
  return key ? data[key] : data;
}

// Helper function to save data
function saveData(key, value) {
  const data = JSON.parse(localStorage.getItem('saleTrackingData') || '{}');
  data[key] = value;
  localStorage.setItem('saleTrackingData', JSON.stringify(data));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_DATA, initializeSampleData, getData, saveData };
}
