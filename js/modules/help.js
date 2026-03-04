// Help Module for STS v1.3
// Provides contextual help with drawer UI and flowcharts

const HelpModule = {
    currentModule: null,
    isOpen: false,

    // Initialize module
    init() {
        console.log('❓ Help module initialized');
    },

    // Help content for each module
    helpContent: {
        customers: {
            title: 'การจัดการลูกค้า',
            icon: 'people',
            steps: [
                'ดูรายชื่อลูกค้าทั้งหมดในระบบ',
                'ใช้ตัวกรองเพื่อค้นหาลูกค้าตามประเภท ภูมิภาค Tier และสถานะ',
                'คลิกปุ่ม "ดู" เพื่อเข้าสู่หน้าโปรไฟล์ลูกค้า',
                'ในหน้าโปรไฟล์ สามารถดูข้อมูล ผู้ติดต่อ กิจกรรม Pipeline และ Assessment',
                'คลิก "Export" เพื่อส่งออกข้อมูลเป็น Excel หรือ PDF',
                'คลิก "เพิ่มลูกค้าใหม่" เพื่อเพิ่มลูกค้าในระบบ'
            ],
            tiers: [
                { name: 'Tier 1 (Strategic)', desc: 'กลุ่มลูกค้าที่มีงบประมาณแล้ว รอหา บ.ที่จะมาทำ ตามงบประมาณ' },
                { name: 'Tier 2 (Key Account)', desc: 'กลุ่มลูกค้าที่มีแผนงาน ของปีงบประมาณหน้า กำลังหา บ.ที่จะมาทำ ตามงบประมาณ' },
                { name: 'Tier 3 (Standard)', desc: 'กลุ่มลูกค้าที่มีความต้องการระบบ แต่ยังไม่ทราบงบประมาณ ให้เราเสนอเพื่อดูความคุ้มค่า เพื่อลงทุน' },
                { name: 'Tier 4 (Prospect)', desc: 'กลุ่มลูกค้าที่มีความต้องการระบบใหม่ หรือระบบงานใหม่ อยากให้เราเข้าไปช่วยจัดการ หรือ จัดหา solution' }
            ],
            flowchart: `
┌─────────────────┐
│  รายชื่อลูกค้า   │
└────────┬────────┘
         │
         ├─→ ใช้ตัวกรอง (ประเภท/ภูมิภาค/Tier)
         │
         ├─→ คลิก "ดู" → โปรไฟล์ลูกค้า
         │              │
         │              ├─→ ข้อมูลทั่วไป
         │              ├─→ ผู้ติดต่อ
         │              ├─→ กิจกรรม
         │              ├─→ Pipeline
         │              └─→ Assessment
         │
         ├─→ Export (Excel/PDF)
         │
         └─→ เพิ่มลูกค้าใหม่
            `
        },
        visits: {
            title: 'รายงานการเข้าพบ',
            icon: 'calendar-check',
            steps: [
                'ดูรายงานการเข้าพบลูกค้าทั้งหมด พร้อมสถิติ (Hot Leads, Follow-up ค้าง)',
                'คลิก "สร้างรายงาน" เพื่อบันทึกผลการเข้าพบ',
                'ระบุข้อมูลการเข้าพบ: ลูกค้า, วันที่, สถานที่, วัตถุประสงค์',
                'เพิ่มผู้เข้าร่วมได้หลายคน พร้อมระบุชื่อ-สกุล, ตำแหน่ง, โทรศัพท์, อีเมล',
                'เลือกสินค้าที่สนใจ (MEDIQ, HIS, ERP, Custom) และระดับความสนใจ (Hot/Warm/Cold)',
                'บันทึกระดับงบประมาณ (Level 1-5) และปีงบประมาณ',
                'บันทึกความต้องการ/Pain Points และสรุปผลการเข้าพบ',
                'สร้าง Follow-up Task ได้หลายรายการ พร้อมกำหนดวันและความสำคัญ',
                'ดู Follow-up Dashboard เพื่อติดตามงานที่เกินกำหนด/วันนี้/สัปดาห์นี้'
            ],
            definitions: [
                { name: 'ระดับความสนใจ', desc: '<ul class="mt-1 mb-2"><li><b>🔥 Hot:</b> สนใจมาก พร้อมดำเนินการ</li><li><b>🌤️ Warm:</b> สนใจปานกลาง ต้องติดตามต่อ</li><li><b>❄️ Cold:</b> ยังไม่พร้อม เก็บข้อมูลไว้ก่อน</li></ul>' },
                { name: 'ระดับงบประมาณ (Level 1-5)', desc: '<ul class="mt-1 mb-2"><li><b>Level 1:</b> มีงบพร้อม</li><li><b>Level 2:</b> อยู่ในแผน</li><li><b>Level 3:</b> กำลังของบ</li><li><b>Level 4:</b> ยังไม่มีงบ</li><li><b>Level 5:</b> งบพิเศษ/เร่งด่วน</li></ul>' }
            ],
            flowchart: `
┌──────────────────┐
│  รายงานเข้าพบ    │
└────────┬─────────┘
         │
         ├─→ ดูสถิติ (รายงาน/Follow-up/Hot Leads)
         │
         ├─→ สร้างรายงาน
         │      │
         │      ├─→ ข้อมูลการเข้าพบ (ลูกค้า/วันที่/สถานที่/วัตถุประสงค์)
         │      ├─→ ผู้เข้าร่วม (ชื่อ/ตำแหน่ง/โทร/อีเมล) × หลายคน
         │      ├─→ สินค้าที่สนใจ (MEDIQ/HIS/ERP/Custom)
         │      ├─→ ระดับความสนใจ + งบประมาณ + ปีงบ
         │      ├─→ ความต้องการ/Pain Points
         │      ├─→ สรุปผลการเข้าพบ
         │      └─→ Follow-up Tasks (งาน/กำหนดส่ง/ความสำคัญ)
         │
         ├─→ Follow-up Dashboard
         │      ├─→ เกินกำหนด (สีแดง)
         │      ├─→ วันนี้ (สีเหลือง)
         │      └─→ สัปดาห์นี้ (สีน้ำเงิน)
         │
         └─→ คลิกรายงาน → ดูรายละเอียดใน Modal
            `
        },
        demos: {
            title: 'Demo/Trial Management',
            icon: 'display',
            steps: [
                'จัดการคำขอ Demo และ Trial ของลูกค้า',
                'ดูสถิติ: ทั้งหมด, รออนุมัติ, อนุมัติแล้ว, Trial',
                'แยกดูตาม Tab: ทั้งหมด, Demo, Trial',
                'คลิก "ขอ Demo/Trial ใหม่" เพื่อสร้างคำขอ',
                'ระบุข้อมูล: ลูกค้า, ประเภท, สินค้า, ระยะเวลา, ค่าใช้จ่าย',
                'ติดตามสถานะการอนุมัติ (Draft → Pending L1 → Pending L2 → Approved)'
            ],
            flowchart: `
┌──────────────────┐
│  Demo/Trial      │
└────────┬─────────┘
         │
         ├─→ ดูสถิติ (ทั้งหมด/รออนุมัติ/อนุมัติ/Trial)
         │
         ├─→ ขอ Demo/Trial ใหม่
         │      │
         │      ├─→ เลือกลูกค้า
         │      ├─→ เลือกประเภท (Demo/Trial)
         │      ├─→ เลือกสินค้า
         │      ├─→ กำหนดระยะเวลา
         │      └─→ ระบุค่าใช้จ่าย
         │
         ├─→ ติดตามสถานะ
         │      Draft → Pending L1 → Pending L2 → Approved
         │
         └─→ Export ข้อมูล
            `
        },
        pipeline: {
            title: 'Sales Pipeline / Dashboard',
            icon: 'funnel',
            steps: [
                'ติดตาม Sales Opportunities ในแต่ละขั้นตอน (S0-S8)',
                'ใช้ตัวกรองกลุ่มสินค้า (Product Group) ด้านบนเพื่อดูภาพรวมเฉพาะกลุ่ม',
                'ดูการ์ดสรุปผล 4 ใบซึ่งบอกภาพรวม ณ ปัจจุบัน:',
                ' - 📊 Work in Process: ยอดรวมโครงการที่กำลังติดตาม ที่ยังไม่ชนะและยังไม่แพ้',
                ' - 💰 ลูกค้าที่มีงบปี 69: ยอดรวมมูลค่าโครงการของลูกค้าที่มีแผนทำในปีงบประมาณ 69',
                ' - 📈 ลูกค้าที่มีงบปี 70 (เข้าแผนแล้ว): ยอดรวมโครงการปี 70 ที่ลูกค้าระบุเข้าแผนงบประมาณแล้ว (Level 1-2)',
                ' - 🎯 งาน Demo/Trial: การใช้งานจริง หรืองานนำเสนอแบบทดลองระบบที่กำลังดำเนินการอยู่',
                'ลากการ์ดเพื่อย้ายระหว่างชั้นตอน (Drag & Drop)',
                'คลิกดูรายละเอียดของการ์ดแต่ละใบ'
            ],
            definitions: [
                { name: 'Sale Stage (สถานะการขาย S0-S9)', desc: 'ความคืบหน้าของงานประกอบด้วย:<ul class="mt-1 mb-2"><li><b>S0 Target Identified:</b> ระบุเป้าหมาย (ยังไม่ได้ติดต่อ)</li><li><b>S1 Initial Meeting:</b> ติดต่อและเข้าพบเบื้องต้น</li><li><b>S2 Requirement:</b> สำรวจความต้องการและปัญหา (Pain Points)</li><li><b>S3 Demo/Workshop:</b> นำเสนอ/สาธิตระบบให้ลูกค้าดู</li><li><b>S4 TOR/Proposal:</b> ร่างขอบเขตงาน (TOR) / ใบเสนอราคา</li><li><b>S5 Quotation Consideration:</b> พิจารณา ใบเสนอราคา</li><li><b>S6 Waiting Procurement:</b> รอกระบวนการจัดซื้อของลูกค้า (ผ่านงบประมาณไปแล้ว)</li><li><b>S7 Procurement:</b> ลูกค้ากำลังดำเนินการจัดซื้อ/e-bidding</li><li><b>S8_WON Closed Won:</b> ชนะโครงการ/ปิดการขายสำเร็จ</li><li><b>S9 Closed Lost:</b> ไม่สำเร็จ/สูญเสียโครงการ</li></ul>' },
                { name: 'Budget Level (สถานะงบประมาณ)', desc: 'ความพร้อมด้านงบของลูกค้า ประกอบด้วย:<ul class="mt-1 mb-2"><li><b>Level 1:</b> มีงบปี 69 รอประมูล</li><li><b>Level 2:</b> อยู่ในแผนงบประมาณจริงแล้ว</li><li><b>Level 3:</b> ตั้งเป้า Push เข้าแผนงบปีถัดไป</li><li><b>Level 4:</b> มีความต้องการ ยังไม่วางแผน</li><li><b>Level 5:</b> จัดหาด่วน ไม่อยู่ในแผน (เร่งด่วน)</li></ul>' }
            ],
            flowchart: `
┌──────────────────┐
│  Sales Pipeline  │
└────────┬─────────┘
         │
         ├─→ Dashboard Summary
         │      │
         │      ├─→ Work in Process
         │      ├─→ งบปี 69 / งบปี 70 (Planned)
         │      └─→ งาน Demo/Trial
         │
         ├─→ Filter (Product Group)
         │
         ├─→ Pipeline Board (Kanban S0-S9)
         │
         └─→ คลิกการ์ด → ดูรายละเอียด/Stage History
            `
        },
        insights: {
            title: 'Customer Insights',
            icon: 'lightbulb',
            steps: [
                'บันทึกและติดตาม Insights จากลูกค้า',
                'ดูสถิติ: Insights ทั้งหมด, Pain Points, Opportunities, Competitors',
                'แยกดูตามประเภท: Pain Point, Opportunity, Competitor, Requirement',
                'คลิก "เพิ่ม Insight" เพื่อบันทึกข้อมูลใหม่',
                'ระบุลูกค้า, ประเภท, และรายละเอียด Insight',
                'ใช้ข้อมูลเพื่อวางแผนกลยุทธ์การขาย'
            ],
            flowchart: `
┌──────────────────┐
│  Insights        │
└────────┬─────────┘
         │
         ├─→ ดูสถิติตามประเภท
         │      │
         │      ├─→ Pain Points
         │      ├─→ Opportunities
         │      ├─→ Competitors
         │      └─→ Requirements
         │
         ├─→ เพิ่ม Insight ใหม่
         │      │
         │      ├─→ เลือกลูกค้า
         │      ├─→ เลือกประเภท
         │      └─→ บันทึกรายละเอียด
         │
         ├─→ วิเคราะห์ Insights
         │
         └─→ Export ข้อมูล
            `
        },
        calendar: {
            title: 'ปฏิทินกิจกรรม',
            icon: 'calendar3',
            steps: [
                'ดูกิจกรรมทั้งหมดในรูปแบบปฏิทิน',
                'สลับมุมมอง: เดือน, สัปดาห์, วัน',
                'ดูสถิติ: กิจกรรมทั้งหมด, วันนี้, สัปดาห์นี้',
                'คลิกวันในปฏิทินเพื่อเพิ่มกิจกรรม',
                'ประเภทกิจกรรม: Visit, Demo, Meeting, Follow-up, Deadline',
                'ดูรายละเอียดและแก้ไขกิจกรรมโดยคลิกที่กิจกรรม'
            ],
            flowchart: `
┌──────────────────┐
│  ปฏิทิน          │
└────────┬─────────┘
         │
         ├─→ เลือกมุมมอง (เดือน/สัปดาห์/วัน)
         │
         ├─→ ดูสถิติกิจกรรม
         │
         ├─→ คลิกวัน → เพิ่มกิจกรรม
         │      │
         │      ├─→ Visit (เข้าพบ)
         │      ├─→ Demo
         │      ├─→ Meeting
         │      ├─→ Follow-up
         │      └─→ Deadline
         │
         ├─→ คลิกกิจกรรม → ดู/แก้ไข
         │
         └─→ Export ปฏิทิน
            `
        },
        dashboard: {
            title: 'Executive Dashboard',
            icon: 'speedometer2',
            steps: [
                'ดูภาพรวมธุรกิจและประสิทธิภาพการขายทั้งหมด (Key Metrics)',
                'วิเคราะห์ Pipeline by Stage: ติดตามโอกาสการขายในแต่ละขั้นตอน (S1-S6) พร้อมมูลค่ารวม',
                'ติดตาม Trial & Demo: ตรวจสอบคำขอที่รออนุมัติ (Pending) ในส่วน Alerts',
                'วิเคราะห์ Customer Distribution: การกระจายตัวของลูกค้าตาม Tier และสถานะ',
                'ตรวจสอบ Recent Activities: กิจกรรมการเข้าพบและ Follow-up ล่าสุด',
                'ดู Alerts: แจ้งเตือนงานด่วน เช่น Follow-up เกินกำหนด หรือ Trial ที่รออนุมัติ',
                'Top 10 Opportunities: โฟกัสดีลที่มีมูลค่าสูงสุดเพื่อปิดการขาย'
            ],
            flowchart: `
┌─────────────────────┐
│  Executive Dashboard│
└──────────┬──────────┘
           │
           ├─→ Pipeline by Stage (กราฟแท่ง)
           │      │
           │      S1 (Suspect) → S2 (Prospect) → S3 (Qualified)
           │      → S4 (Proposal) → S5 (Consideration) → S6 (Waiting Proc.) → S7 (Procurement)
           │      │
           │      *แสดงจำนวนและมูลค่าในแต่ละ Stage
           │
           ├─→ Trial & Demo Monitoring
           │      │
           │      ตรวจสอบที่ Alerts & Attention Needed
           │      └─→ "x demo requests รออนุมัติ"
           │
           ├─→ Customer Distribution
           │      └─→ By Tier (T1-T4) & Status
           │
           ├─→ Key Metrics & Activities
           │      ├─→ Total/Weighted Pipeline
           │      ├─→ Hot Leads
           │      └─→ Recent Visits
           │
           └─→ Top 10 Opportunities
            `
        },
        meetings: {
            title: 'Meeting & Document Tracking',
            icon: 'chat-dots',
            steps: [
                'บันทึกและติดตามการประชุมกับลูกค้า',
                'ดูสถิติ: ประชุมทั้งหมด, Action Items, เอกสาร',
                'แยกดูตาม Tab: Meetings, Action Items, Documents',
                'คลิก "บันทึกการประชุม" เพื่อสร้างรายงาน',
                'ระบุหัวข้อ, ผู้เข้าร่วม, สรุปผล, และ Action Items',
                'แนบเอกสารที่เกี่ยวข้องและกำหนด Deadline'
            ],
            flowchart: `
┌──────────────────┐
│  Meetings        │
└────────┬─────────┘
         │
         ├─→ บันทึกการประชุม
         │      │
         │      ├─→ ระบุหัวข้อ/ลูกค้า
         │      ├─→ ผู้เข้าร่วม
         │      ├─→ สรุปผล
         │      └─→ Action Items
         │
         ├─→ Action Items
         │      │
         │      ├─→ กำหนดผู้รับผิดชอบ
         │      ├─→ กำหนด Deadline
         │      └─→ ติดตามสถานะ
         │
         ├─→ Documents
         │      │
         │      ├─→ แนบเอกสาร
         │      └─→ ติดตาม Deadline
         │
         └─→ Export รายงาน
            `
        },
        projects: {
            title: 'Project Management',
            icon: 'kanban',
            steps: [
                'จัดการโครงการติดตั้งและ Implementation',
                'ดูสถานะโครงการ: สีเขียว (ปกติ), สีเหลือง (เสี่ยง), สีแดง (วิกฤต)',
                'ติดตามความคืบหน้า (Progress %)',
                'คลิกโครงการเพื่อดู Milestones, Issues, Deliveries',
                'อัพเดทสถานะและความคืบหน้าเป็นประจำ',
                'ติดตามปัญหาและความเสี่ยง'
            ],
            flowchart: `
┌──────────────────┐
│  Projects        │
└────────┬─────────┘
         │
         ├─→ Project Board
         │      │
         │      ├─→ สถานะ (🟢🟡🔴)
         │      ├─→ ความคืบหน้า (%)
         │      └─→ PM/Timeline
         │
         ├─→ คลิกโครงการ → รายละเอียด
         │      │
         │      ├─→ Milestones
         │      ├─→ Issues & Risks
         │      ├─→ Deliveries
         │      └─→ Team Members
         │
         ├─→ อัพเดทสถานะ
         │
         └─→ Export Project Report
            `
        },
        'po-workspace': {
            title: 'PO Workspace',
            icon: 'kanban-fill',
            steps: [
                'จัดการ Dev Backlog และ Feasibility Assessment',
                'ดู Dev Backlog Kanban: Backlog → In Progress → Testing → Done',
                'ลากการ์ดเพื่อย้ายสถานะ',
                'คลิก "Feasibility Assessment" เพื่อประเมินความเป็นไปได้',
                'ประเมินด้าน: Technical, Business, Timeline, Resource',
                'ให้คะแนนและสรุปผลการประเมิน'
            ],
            flowchart: `
┌──────────────────┐
│  PO Workspace    │
└────────┬─────────┘
         │
         ├─→ Dev Backlog (Kanban)
         │      │
         │      Backlog → In Progress → Testing → Done
         │
         ├─→ ลากการ์ดย้ายสถานะ
         │
         ├─→ Feasibility Assessment
         │      │
         │      ├─→ Technical Feasibility
         │      ├─→ Business Value
         │      ├─→ Timeline Estimate
         │      └─→ Resource Availability
         │
         ├─→ ให้คะแนน (1-5)
         │
         └─→ สรุปผล (Go/No-Go)
            `
        },
        'dev-requests': {
            title: 'Dev Request & Strategic Pricing',
            icon: 'code-square',
            steps: [
                'จัดการคำขอพัฒนาและราคาพิเศษ',
                'แยกดูตาม Tab: Dev Requests, Strategic Pricing',
                'ดูสถิติ: ทั้งหมด, รออนุมัติ, อนุมัติแล้ว',
                'คลิก "ขอพัฒนาใหม่" เพื่อส่งคำขอ',
                'ระบุ Requirement, Priority, Timeline',
                'ติดตามสถานะการอนุมัติและ Development'
            ],
            flowchart: `
┌──────────────────┐
│  Dev Requests    │
└────────┬─────────┘
         │
         ├─→ ขอพัฒนาใหม่
         │      │
         │      ├─→ ระบุ Requirement
         │      ├─→ Priority (High/Medium/Low)
         │      ├─→ Timeline
         │      └─→ แนบ Mockup/Doc
         │
         ├─→ ติดตามสถานะ
         │      Draft → PM Review → PO Review → Approved
         │
         ├─→ Strategic Pricing
         │      │
         │      ├─→ ขอราคาพิเศษ
         │      ├─→ เหตุผล/Justification
         │      └─→ ติดตามการอนุมัติ
         │
         └─→ Export รายงาน
            `
        },
        'budget-dashboard': {
            title: 'Budget Control Dashboard',
            icon: 'piggy-bank',
            steps: [
                'ดูภาพรวมของ Sales Pipeline แบบ Heatmap',
                'วิเคราะห์ความสัมพันธ์ระหว่างสถานะงบประมาณ (Budget) และขั้นตอนการขาย (Sales Stage)',
                'ตรวจสอบ Urgent Actions ที่ต้องการการจัดการเร่งด่วน',
                'ดูมูลค่าโครงการแยกตามกลุ่มผลิตภัณฑ์และประเภทลูกค้า'
            ],
            definitions: [
                { name: 'Budget (สถานะงบประมาณ)', desc: 'ความพร้อมเรื่องงบประมาณของลูกค้า ประกอบด้วย:<ul class="mt-1 mb-2"><li><b>B0 Concept (แนวคิด/ยังไม่มีงบ):</b> ระดับแนวคิด ยังไม่มีงบประมาณที่ชัดเจน</li><li><b>B1 Planned (อยู่ในแผน):</b> มีการวางแผนงบประมาณไว้แล้ว</li><li><b>B2 Allocated (ตั้งงบแล้ว):</b> มีการจัดสรรตั้งงบประมาณเรียบร้อยแล้ว</li><li><b>B3 Approved (งบอนุมัติ/รอประมูล):</b> งบประมาณอนุมัติแล้วรอเข้าสู่ขั้นตอนประมูล</li><li><b>B4 Direct Purchase (จัดซื้อตรง):</b> งบประมาณพร้อมและสามารถจัดซื้อตรงได้ทันที</li></ul>' },
                { name: 'Sales Stage (ขั้นตอนการขาย)', desc: 'ความคืบหน้าของกระบวนการขาย ได้แก่:<ul class="mt-1 mb-2"><li><b>S0 Target Identified:</b> ระบุเป้าหมาย (ยังไม่ได้ติดต่อ)</li><li><b>S1 Initial Meeting:</b> ติดต่อและเข้าพบเบื้องต้น</li><li><b>S2 Requirement:</b> สำรวจความต้องการและปัญหา (Pain Points)</li><li><b>S3 Demo/Workshop:</b> นำเสนอ/สาธิตระบบให้ลูกค้าดู</li><li><b>S4 TOR/Proposal:</b> ร่างขอบเขตงาน (TOR) / ใบเสนอราคา</li><li><b>S5 Quotation Consideration:</b> พิจารณา ใบเสนอราคา</li><li><b>S6 Waiting Procurement:</b> รอกระบวนการจัดซื้อของลูกค้า (ผ่านงบประมาณไปแล้ว)</li><li><b>S7 Procurement:</b> ลูกค้ากำลังดำเนินการจัดซื้อ/e-bidding</li><li><b>S8_WON Closed Won:</b> ชนะโครงการ/ปิดการขายสำเร็จ</li><li><b>S9 Closed Lost:</b> ไม่สำเร็จ/สูญเสียโครงการ</li></ul>' },
                { name: 'Urgent Actions', desc: 'รายการที่ต้องรีบดำเนินการ เช่น ลูกค้ามีงบประมาณพร้อมแล้ว (B3/B4) แต่ขั้นตอนการขายยังอยู่ในระดับเริ่มต้น' }
            ],
            flowchart: `
┌─────────────────────────┐
│ Budget Control Dashboard│
└───────────┬─────────────┘
            │
            ├─→ Heatmap Analysis
            │      │
            │      ├─→ แกน Y: Budget (B0-B4)
            │      └─→ แกน X: Sales Stage (S0-S9)
            │
            ├─→ Product Groups Summary
            │
            ├─→ Urgent Actions (ต้องเร่งติดตาม)
            │
            └─→ Segment Summary
            `
        }
    },

    // Show help drawer
    showHelp(moduleName) {
        this.currentModule = moduleName;
        this.isOpen = true;

        const help = this.helpContent[moduleName];
        if (!help) {
            console.warn(`No help content for module: ${moduleName}`);
            return;
        }

        const drawerHTML = `
            <div id="helpDrawer" class="help-drawer show">
                <div class="help-drawer-overlay" onclick="HelpModule.closeHelp()"></div>
                <div class="help-drawer-content">
                    <div class="help-drawer-header">
                        <h5>
                            <i class="bi bi-${help.icon}"></i>
                            ${help.title}
                        </h5>
                        <button class="btn-close" onclick="HelpModule.closeHelp()"></button>
                    </div>
                    
                    <div class="help-drawer-body">
                        <!-- Two Column Layout -->
                        <div class="help-two-column-layout">
                            <!-- Left Column: Flowchart -->
                            <div class="help-flowchart-column">
                                <h6><i class="bi bi-diagram-3"></i> Flow Chart</h6>
                                <pre class="help-flowchart">${help.flowchart}</pre>
                            </div>
                            
                            <!-- Right Column: Description -->
                            <div class="help-description-column">
                                <h6><i class="bi bi-list-ol"></i> ขั้นตอนการใช้งาน</h6>
                                <ol class="help-steps">
                                    ${help.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        </div>

                        <!-- Tiers Section (Optional) -->
                        ${help.tiers ? `
                        <div class="help-section">
                            <h6><i class="bi bi-award"></i> ระดับลูกค้า (Tiers)</h6>
                            <ul class="mb-0">
                                ${help.tiers.map(t => `<li><strong>${t.name}:</strong> ${t.desc}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}

                        <!-- Definitions Section (Optional) -->
                        ${help.definitions ? `
                        <div class="help-section mt-3">
                            <h6><i class="bi bi-info-circle"></i> คำอธิบายเพิ่มเติม</h6>
                            <ul class="mb-0 text-secondary">
                                ${help.definitions.map(d => `<li class="mb-2"><strong class="text-dark">${d.name}:</strong> ${d.desc}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}

                        <!-- Tips Section -->
                        <div class="help-section">
                            <div class="alert alert-info">
                                <i class="bi bi-lightbulb"></i>
                                <strong>เคล็ดลับ:</strong>
                                <ul class="mb-0 mt-2">
                                    <li>ใช้ปุ่ม Export เพื่อส่งออกข้อมูลเป็น Excel/PDF</li>
                                    <li>กด Ctrl+K เพื่อเปิด Global Search</li>
                                    <li>คลิกที่รายการเพื่อดูรายละเอียดเพิ่มเติม</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Keyboard Shortcuts -->
                        <div class="help-section">
                            <h6><i class="bi bi-keyboard"></i> Keyboard Shortcuts</h6>
                            <table class="table table-sm">
                                <tr>
                                    <td><kbd>Ctrl</kbd> + <kbd>K</kbd></td>
                                    <td>เปิด Global Search</td>
                                </tr>
                                <tr>
                                    <td><kbd>?</kbd></td>
                                    <td>เปิด Help</td>
                                </tr>
                                <tr>
                                    <td><kbd>Esc</kbd></td>
                                    <td>ปิด Modal/Drawer</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing drawer
        const existingDrawer = document.getElementById('helpDrawer');
        if (existingDrawer) existingDrawer.remove();

        document.body.insertAdjacentHTML('beforeend', drawerHTML);

        // Add keyboard listener for ESC
        document.addEventListener('keydown', this.handleKeyPress);
    },

    // Close help drawer
    closeHelp() {
        const drawer = document.getElementById('helpDrawer');
        if (drawer) {
            drawer.classList.remove('show');
            setTimeout(() => drawer.remove(), 300);
        }
        this.isOpen = false;
        document.removeEventListener('keydown', this.handleKeyPress);
    },

    // Handle keyboard shortcuts
    handleKeyPress(e) {
        if (e.key === 'Escape' && HelpModule.isOpen) {
            HelpModule.closeHelp();
        }
    },

    // Add help button to page
    addHelpButton(moduleName) {
        // Check if button already exists
        if (document.getElementById('helpButton')) return;

        const helpButton = `
            <button id="helpButton" class="btn btn-outline-primary btn-help-float" 
                onclick="HelpModule.showHelp('${moduleName}')" 
                title="ช่วยเหลือ (?)">
                <i class="bi bi-question-circle"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', helpButton);
    },

    // Remove help button
    removeHelpButton() {
        const button = document.getElementById('helpButton');
        if (button) button.remove();
    }
};

HelpModule.init();
console.log('✅ Help module loaded');
