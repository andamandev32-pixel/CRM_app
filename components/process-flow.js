// Process Flow Component
// This component displays step-by-step guides and text-based flowcharts for various workflows

const PROCESS_FLOWS = {
    'customer-onboarding': {
        title: 'กระบวนการ Customer Onboarding',
        steps: [
            { id: 1, title: 'รวบรวมข้อมูลลูกค้า', description: 'รวบรวมข้อมูลพื้นฐานของโรงพยาบาล ผู้ติดต่อ และความต้องการ' },
            { id: 2, title: 'วิเคราะห์ความต้องการ', description: 'ประเมินความต้องการของลูกค้าและจับคู่กับโซลูชันที่เหมาะสม' },
            { id: 3, title: 'สร้าง Opportunity', description: 'สร้างโอกาสทางการขายในระบบ Pipeline' },
            { id: 4, title: 'วางแผนการเข้าพบ', description: 'กำหนดแผนการเข้าพบและนำเสนอ' },
            { id: 5, title: 'ติดตามและดูแล', description: 'ติดตามความคืบหน้าและดูแลความสัมพันธ์อย่างต่อเนื่อง' }
        ],
        flowchart: `
    ┌─────────────────────┐
    │  รวบรวมข้อมูลลูกค้า  │
    │   (ชื่อ, ที่อยู่,    │
    │    ผู้ติดต่อ)       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ วิเคราะห์ความต้องการ │
    │  (Pain Points &     │
    │    Requirements)    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  สร้าง Opportunity  │
    │   ในระบบ Pipeline   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  วางแผนการเข้าพบ    │
    │   (Visit Plan)      │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   ติดตามและดูแล     │
    │  (Follow-up Loop)   │
    └─────────────────────┘`
    },
    'visit-workflow': {
        title: 'กระบวนการ Visit & Activity',
        steps: [
            { id: 1, title: 'วางแผนการเข้าพบ', description: 'กำหนดวัตถุประสงค์ วันที่ เวลา และผู้เข้าร่วม' },
            { id: 2, title: 'ขออนุมัติ', description: 'ส่งแผนการเข้าพบให้ผู้จัดการอนุมัติ' },
            { id: 3, title: 'เตรียมการ', description: 'เตรียมเอกสาร Demo และข้อมูลที่จำเป็น' },
            { id: 4, title: 'ดำเนินการเข้าพบ', description: 'เข้าพบลูกค้าตามแผนที่วางไว้' },
            { id: 5, title: 'บันทึก Visit Report', description: 'บันทึกผลการเข้าพบและ Next Action' },
            { id: 6, title: 'Follow-up', description: 'ติดตามงานตาม Action Items ที่กำหนด' }
        ],
        flowchart: `
    ┌──────────────────┐
    │  วางแผนการเข้าพบ  │
    │  (Visit Plan)    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐      ❌ ไม่อนุมัติ
    │   ส่งขออนุมัติ    │ ────────────┐
    │   (Manager)      │              │
    └────────┬─────────┘              │
             │ ✅ อนุมัติ              │
             ▼                        │
    ┌──────────────────┐              │
    │   เตรียมการ      │              │
    │ (เอกสาร, Demo)   │              │
    └────────┬─────────┘              │
             │                        │
             ▼                        │
    ┌──────────────────┐              │
    │  ดำเนินการเข้าพบ  │              │
    │   (Visit)        │              │
    └────────┬─────────┘              │
             │                        │
             ▼                        │
    ┌──────────────────┐              │
    │ บันทึก Report    │              │
    │  (ผล + Action)   │              │
    └────────┬─────────┘              │
             │                        │
             ▼                        │
    ┌──────────────────┐              │
    │   Follow-up      │              │
    │  (ติดตามงาน)     │              │
    └────────┬─────────┘              │
             │                        │
             └────────────────────────┘
                  (วนกลับแก้ไข)`
    },
    'demo-trial': {
        title: 'กระบวนการ Demo/Trial',
        steps: [
            { id: 1, title: 'รับคำขอ Demo/Trial', description: 'รับคำขอจาก Sales หรือลูกค้าโดยตรง' },
            { id: 2, title: 'ประเมินความพร้อม', description: 'ตรวจสอบ Resource และความพร้อมของทีม' },
            { id: 3, title: 'อนุมัติคำขอ', description: 'ผู้จัดการพิจารณาและอนุมัติ' },
            { id: 4, title: 'เตรียมสภาพแวดล้อม', description: 'Setup ระบบ Demo/Trial สำหรับลูกค้า' },
            { id: 5, title: 'ดำเนินการ Demo/Trial', description: 'ให้ลูกค้าทดลองใช้งานระบบ' },
            { id: 6, title: 'รวบรวม Feedback', description: 'เก็บ Feedback และประเมินผล' },
            { id: 7, title: 'สรุปผล', description: 'สรุปผลและวางแผนขั้นตอนต่อไป' }
        ],
        flowchart: `
    ┌─────────────────────┐
    │  รับคำขอ Demo/Trial │
    │   (Sales/ลูกค้า)    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  ประเมินความพร้อม    │
    │  (Resource Check)   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐    ❌ ไม่อนุมัติ
    │    อนุมัติคำขอ      │ ──────────────┐
    │    (Manager)        │                │
    └──────────┬──────────┘                │
               │ ✅ อนุมัติ                 │
               ▼                           │
    ┌─────────────────────┐                │
    │ เตรียมสภาพแวดล้อม    │                │
    │   (Setup System)    │                │
    └──────────┬──────────┘                │
               │                           │
               ▼                           │
    ┌─────────────────────┐                │
    │  ดำเนินการ Demo     │                │
    │   (ลูกค้าทดลอง)     │                │
    └──────────┬──────────┘                │
               │                           │
               ▼                           │
    ┌─────────────────────┐                │
    │  รวบรวม Feedback    │                │
    │   (ประเมินผล)       │                │
    └──────────┬──────────┘                │
               │                           │
               ▼                           │
    ┌─────────────────────┐                │
    │     สรุปผล          │                │
    │  (Next Steps)       │                │
    └─────────────────────┘                │
               │                           │
               └───────────────────────────┘
                    (ปิดคำขอ)`
    },
    'pipeline-stages': {
        title: 'ขั้นตอน Sales Pipeline',
        steps: [
            { id: 1, title: 'Lead', description: 'ข้อมูลลูกค้าเป้าหมายเบื้องต้น' },
            { id: 2, title: 'Qualified', description: 'ยืนยันความสนใจและงบประมาณ' },
            { id: 3, title: 'Proposal', description: 'นำเสนอโซลูชันและใบเสนอราคา' },
            { id: 4, title: 'Negotiation', description: 'เจรจาต่อรองเงื่อนไข' },
            { id: 5, title: 'Closed Won', description: 'ปิดการขายสำเร็จ' }
        ],
        flowchart: `
    ┌──────────┐
    │   Lead   │  ← ข้อมูลลูกค้าเป้าหมาย
    └─────┬────┘
          │
          ▼
    ┌──────────┐
    │Qualified │  ← ยืนยันความสนใจ + งบประมาณ
    └─────┬────┘
          │
          ▼
    ┌──────────┐
    │ Proposal │  ← นำเสนอโซลูชัน + ใบเสนอราคา
    └─────┬────┘
          │
          ▼
    ┌────────────┐
    │Negotiation │  ← เจรจาต่อรองเงื่อนไข
    └─────┬──────┘
          │
          ├─────────┐
          │         │
          ▼         ▼
    ┌───────────┐ ┌───────────┐
    │Closed Won │ │Closed Lost│
    │   ✅ สำเร็จ│ │   ❌ ไม่สำเร็จ│
    └───────────┘ └───────────┘`
    },
    'insight-workflow': {
        title: 'กระบวนการ Customer Insight',
        steps: [
            { id: 1, title: 'รวบรวม Insight', description: 'บันทึก Feedback และความต้องการจากลูกค้า' },
            { id: 2, title: 'จัดลำดับความสำคัญ', description: 'กำหนด Priority: High, Medium, Low' },
            { id: 3, title: 'วิเคราะห์และจัดกลุ่ม', description: 'วิเคราะห์ Insight และจัดกลุ่มตามประเภท' },
            { id: 4, title: 'แชร์กับทีม', description: 'แชร์ข้อมูลกับทีมที่เกี่ยวข้อง' },
            { id: 5, title: 'นำไปปรับปรุง', description: 'นำ Insight ไปพัฒนาผลิตภัณฑ์และบริการ' }
        ],
        flowchart: `
    ┌──────────────────┐
    │  รวบรวม Insight  │
    │  (จากลูกค้า)     │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ จัดลำดับความสำคัญ │
    └────────┬─────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
    ┌────┐  ┌──────┐  ┌────┐
    │High│  │Medium│  │Low │
    └──┬─┘  └───┬──┘  └──┬─┘
       │        │        │
       └────────┼────────┘
                │
                ▼
    ┌──────────────────┐
    │ วิเคราะห์/จัดกลุ่ม│
    │  (Categorize)    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │   แชร์กับทีม     │
    │ (Product, Sales) │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │   นำไปปรับปรุง    │
    │ (Product Dev)    │
    └──────────────────┘`
    }
};

function renderProcessFlow(flowKey) {
    const flow = PROCESS_FLOWS[flowKey];
    if (!flow) return '';

    return `
        <div class="card" id="process-flow-section" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%); border-left: 4px solid var(--primary-purple); scroll-margin-top: 80px;">
            <div class="card-header" style="cursor: pointer;" onclick="toggleProcessFlow('${flowKey}')">
                <div class="flex items-center gap-2">
                    <span style="font-size: 1.25rem;">📋</span>
                    <h3 class="card-title">${flow.title}</h3>
                </div>
                <span id="flow-toggle-${flowKey}">▼</span>
            </div>
            <div class="card-body" id="flow-content-${flowKey}">
                <!-- Steps -->
                <div style="margin-bottom: var(--spacing-lg);">
                    <h4 style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--gray-700);">ขั้นตอนการทำงาน:</h4>
                    ${flow.steps.map((step, index) => `
                        <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                            <div style="flex-shrink: 0; width: 32px; height: 32px; background: var(--primary-gradient); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                ${step.id}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--gray-900); margin-bottom: 0.25rem;">${step.title}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">${step.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Text-based Flowchart -->
                <div style="background: white; padding: var(--spacing-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <h4 style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--gray-700);">แผนภาพกระบวนการ:</h4>
                    <div style="background: #1e1e1e; padding: var(--spacing-xl); border-radius: var(--radius-md); overflow-x: auto;">
                        <pre style="margin: 0; color: #d4d4d4; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.6; white-space: pre;">${flow.flowchart}</pre>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleProcessFlow(flowKey) {
    const content = document.getElementById(`flow-content-${flowKey}`);
    const toggle = document.getElementById(`flow-toggle-${flowKey}`);

    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// Scroll navigation functions
function scrollToProcessFlow() {
    const flowSection = document.getElementById('process-flow-section');
    if (flowSection) {
        flowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log('✅ Process Flow component loaded');
