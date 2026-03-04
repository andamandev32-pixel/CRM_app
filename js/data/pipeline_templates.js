// Pipeline Templates - Default Templates for CRM System

const PipelineTemplates = {
    // Default templates
    defaultTemplates: [
        {
            id: 'TPL-001',
            name: 'HIS Standard',
            description: 'Pipeline มาตรฐานสำหรับโครงการ HIS',
            customerTypes: ['army', 'government', 'private'],
            isDefault: true,
            stages: [
                {
                    id: 'S1',
                    name: 'Lead/Prospect',
                    description: 'ติดต่อเบื้องต้น ทำความรู้จัก',
                    probability: 10,
                    color: '#6c757d',
                    tasks: [
                        'ติดต่อผู้มีอำนาจตัดสินใจ',
                        'ทำความเข้าใจความต้องการเบื้องต้น',
                        'นัดหมายนำเสนอ',
                        'ส่งข้อมูลบริษัทและผลงาน'
                    ]
                },
                {
                    id: 'S2',
                    name: 'Qualified',
                    description: 'คุณสมบัติและความต้องการชัดเจน',
                    probability: 25,
                    color: '#0dcaf0',
                    tasks: [
                        'ประเมินงบประมาณและกรอบเวลา',
                        'ระบุผู้มีส่วนได้ส่วนเสียหลัก',
                        'ทำความเข้าใจกระบวนการตัดสินใจ',
                        'ประเมินคู่แข่ง'
                    ]
                },
                {
                    id: 'S3',
                    name: 'Demo/Trial',
                    description: 'สาธิตหรือทดลองใช้งาน',
                    probability: 40,
                    color: '#0d6efd',
                    tasks: [
                        'จัดเตรียม Demo/Trial',
                        'นำเสนอและสาธิต',
                        'รับ Feedback',
                        'ติดตามผลการทดลองใช้',
                        'จัดทำ Evaluation Report'
                    ]
                },
                {
                    id: 'S4',
                    name: 'Proposal',
                    description: 'เสนอราคาและข้อเสนอ',
                    probability: 60,
                    color: '#6610f2',
                    tasks: [
                        'จัดทำใบเสนอราคา',
                        'เตรียม TechSpec/TOR',
                        'นำเสนอข้อเสนอ',
                        'เจรจาต่อรอง',
                        'ปรับแก้ข้อเสนอตามความต้องการ'
                    ]
                },
                {
                    id: 'S5',
                    name: 'Negotiation',
                    description: 'เจรจาสัญญาและเงื่อนไข',
                    probability: 80,
                    color: '#fd7e14',
                    tasks: [
                        'เจรจาราคาและเงื่อนไข',
                        'ตรวจสอบสัญญา',
                        'ขออนุมัติภายใน (ถ้าจำเป็น)',
                        'เตรียมเอกสารสัญญา',
                        'นัดลงนามสัญญา'
                    ]
                },
                {
                    id: 'S6',
                    name: 'Closed Won',
                    description: 'ปิดการขายสำเร็จ',
                    probability: 100,
                    color: '#198754',
                    tasks: [
                        'ลงนามสัญญา',
                        'รับ PO/สัญญา',
                        'ส่งมอบงานให้ทีม Implementation',
                        'จัดการเอกสารและการเงิน',
                        'Kickoff Meeting'
                    ]
                }
            ]
        },
        {
            id: 'TPL-002',
            name: 'Queue System Fast Track',
            description: 'Pipeline สำหรับระบบคิว (ปิดเร็ว)',
            customerTypes: ['clinic', 'private'],
            isDefault: false,
            stages: [
                {
                    id: 'Q1',
                    name: 'สอบถาม',
                    description: 'รับข้อมูลความต้องการ',
                    probability: 20,
                    color: '#0dcaf0',
                    tasks: [
                        'รับข้อมูลความต้องการ',
                        'ประเมินขนาดและความซับซ้อน',
                        'นัดหมายสาธิต (ถ้าจำเป็น)'
                    ]
                },
                {
                    id: 'Q2',
                    name: 'เสนอราคา',
                    description: 'ส่งใบเสนอราคา',
                    probability: 50,
                    color: '#0d6efd',
                    tasks: [
                        'จัดทำใบเสนอราคา',
                        'ส่งใบเสนอราคา',
                        'ติดตามผล',
                        'ตอบคำถามและชี้แจง'
                    ]
                },
                {
                    id: 'Q3',
                    name: 'เจรจา',
                    description: 'เจรจาราคาและเงื่อนไข',
                    probability: 75,
                    color: '#fd7e14',
                    tasks: [
                        'เจรจาราคา',
                        'ตกลงเงื่อนไขการชำระเงิน',
                        'ตกลงกำหนดการติดตั้ง',
                        'เตรียมสัญญา'
                    ]
                },
                {
                    id: 'Q4',
                    name: 'ปิดการขาย',
                    description: 'ลงนามและส่งมอบ',
                    probability: 100,
                    color: '#198754',
                    tasks: [
                        'ลงนามสัญญา',
                        'รับชำระเงิน (มัดจำ)',
                        'นัดติดตั้ง',
                        'ส่งมอบงานให้ทีมติดตั้ง'
                    ]
                }
            ]
        },
        {
            id: 'TPL-003',
            name: 'Government Procurement',
            description: 'Pipeline สำหรับโครงการจัดซื้อจัดจ้างภาครัฐ',
            customerTypes: ['government', 'army'],
            isDefault: false,
            stages: [
                {
                    id: 'G1',
                    name: 'Pre-TOR',
                    description: 'ติดตาม TOR และให้คำแนะนำ',
                    probability: 5,
                    color: '#6c757d',
                    tasks: [
                        'ติดตาม TOR',
                        'เสนอแนะข้อกำหนดทางเทคนิค',
                        'ให้ข้อมูลผลิตภัณฑ์',
                        'สร้างความสัมพันธ์กับผู้เกี่ยวข้อง'
                    ]
                },
                {
                    id: 'G2',
                    name: 'TOR Released',
                    description: 'TOR ออกแล้ว',
                    probability: 15,
                    color: '#0dcaf0',
                    tasks: [
                        'ศึกษา TOR อย่างละเอียด',
                        'ประเมินความเป็นไปได้',
                        'วิเคราะห์คู่แข่ง',
                        'ตัดสินใจเข้าประมูลหรือไม่'
                    ]
                },
                {
                    id: 'G3',
                    name: 'Preparing Bid',
                    description: 'เตรียมเอกสารประมูล',
                    probability: 30,
                    color: '#0d6efd',
                    tasks: [
                        'จัดทำเอกสารทางเทคนิค',
                        'จัดทำใบเสนอราคา',
                        'เตรียมเอกสารบริษัท',
                        'ตรวจสอบความครบถ้วน',
                        'ขออนุมัติหลักประกัน'
                    ]
                },
                {
                    id: 'G4',
                    name: 'Bid Submitted',
                    description: 'ยื่นเอกสารประมูลแล้ว',
                    probability: 40,
                    color: '#6610f2',
                    tasks: [
                        'ยื่นเอกสารประมูล',
                        'รอประกาศผลคัดเลือก',
                        'เตรียมตัวสำหรับการชี้แจง (ถ้ามี)'
                    ]
                },
                {
                    id: 'G5',
                    name: 'Shortlisted',
                    description: 'ผ่านการพิจารณาเบื้องต้น',
                    probability: 60,
                    color: '#d63384',
                    tasks: [
                        'เตรียมเอกสารเพิ่มเติม',
                        'เตรียมการนำเสนอ/ชี้แจง',
                        'ตอบคำถามคณะกรรมการ'
                    ]
                },
                {
                    id: 'G6',
                    name: 'Presentation',
                    description: 'นำเสนอและชี้แจง',
                    probability: 70,
                    color: '#fd7e14',
                    tasks: [
                        'นำเสนอต่อคณะกรรมการ',
                        'ตอบข้อซักถาม',
                        'Demo (ถ้าจำเป็น)',
                        'ส่งเอกสารเพิ่มเติม'
                    ]
                },
                {
                    id: 'G7',
                    name: 'Awarded',
                    description: 'ได้รับการคัดเลือก',
                    probability: 90,
                    color: '#20c997',
                    tasks: [
                        'รับหนังสือแจ้งผลการคัดเลือก',
                        'ยื่นหลักประกันสัญญา',
                        'เตรียมเอกสารทำสัญญา',
                        'ตรวจสอบร่างสัญญา'
                    ]
                },
                {
                    id: 'G8',
                    name: 'Contract Signed',
                    description: 'ลงนามสัญญาแล้ว',
                    probability: 100,
                    color: '#198754',
                    tasks: [
                        'ลงนามสัญญา',
                        'ส่งมอบหลักประกันสัญญา',
                        'รับ PO',
                        'ส่งมอบงานให้ทีม Project',
                        'จัดการเอกสารและการเงิน'
                    ]
                }
            ]
        }
    ],

    // Get all templates
    getAll() {
        return this.defaultTemplates;
    },

    // Get template by ID
    getById(id) {
        return this.defaultTemplates.find(t => t.id === id);
    },

    // Get templates by customer type
    getByCustomerType(customerType) {
        return this.defaultTemplates.filter(t =>
            t.customerTypes.includes(customerType)
        );
    },

    // Get default template
    getDefault() {
        return this.defaultTemplates.find(t => t.isDefault) || this.defaultTemplates[0];
    }
};

console.log('✅ Pipeline Templates loaded');
