// Products Module - Digital Hospital Platform Product Portfolio
// แสดงข้อมูล 4 กลุ่มผลิตภัณฑ์ สำหรับให้พนักงานทำความเข้าใจ Portfolio

const ProductsModule = {

    // Product group definitions (ข้อมูลจาก product_portfolio_digital_hospital_platform.md)
    PRODUCTS: [
        {
            id: 'mediq',
            number: '1',
            emoji: '1️⃣',
            name: 'MEDIQ Platform',
            subtitle: 'Patient Journey & Service Flow Management',
            tagline: 'แพลตฟอร์มบริหารจัดการกระบวนการให้บริการผู้ป่วยแบบครบวงจร ตั้งแต่ก่อนเข้ารับบริการ ระหว่างรับบริการ และหลังรับบริการ (End-to-End Patient Journey)',
            color: '#2563EB',
            gradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
            lightBg: '#EFF6FF',
            borderColor: '#BFDBFE',
            icon: 'bi-people-fill',
            badge: 'Front Office',
            badgeColor: '#DBEAFE',
            badgeText: '#1E40AF',
            features: [
                {
                    title: 'ระบบบริหารจัดการคิว (Smart Queue Management)',
                    icon: 'bi-list-ol',
                    items: [
                        'จัดลำดับคิวหลายจุดบริการและหลายแผนก',
                        'แสดงผลหน้าจอเรียกคิวแบบ Real-time',
                        'รองรับหลายสาขาในองค์กรเดียวกัน',
                        'เชื่อมต่อ Kiosk และระบบ HIS',
                    ]
                },
                {
                    title: 'ระบบนัดหมาย (Appointment Management)',
                    icon: 'bi-calendar-check',
                    items: [
                        'นัดหมายออนไลน์ผ่านหลายช่องทาง',
                        'บริหารตารางแพทย์และ Slot การให้บริการ',
                        'รองรับการจองล่วงหน้า',
                        'รองรับการจองจากผู้ป่วยโดยตรง และจากหน่วยงานเครือข่าย (Referral)',
                        'ช่วยลดปัญหาผู้ป่วย Walk-in',
                    ]
                },
                {
                    title: 'ระบบติดตามการนัดหมาย (Follow-up & Reminder)',
                    icon: 'bi-bell',
                    items: [
                        'แจ้งเตือนกิจกรรมก่อนวันนัด เช่น การเตรียมตัวตรวจ หรือการงดอาหาร',
                        'ลดภาระเจ้าหน้าที่ในการโทรติดตาม',
                        'แจ้งเตือนผ่าน SMS / LINE',
                        'ลดอัตรา No-show',
                        'ติดตามผู้ป่วยโรคเรื้อรังและการตรวจตามรอบ',
                    ]
                },
                {
                    title: 'ระบบ Self Check-in / Kiosk',
                    icon: 'bi-tablet',
                    items: [
                        'ลงทะเบียนอัตโนมัติ',
                        'ตรวจสอบสิทธิ์การรักษา',
                        'เชื่อมต่อข้อมูลกับ HIS แบบเรียลไทม์',
                    ]
                },
            ],
            strategic: [
                'เป็น Entry Platform ในการเริ่มต้นความร่วมมือกับโรงพยาบาล',
                'แก้ Pain Point หน้าบ้านได้อย่างรวดเร็ว',
                'เพิ่มประสบการณ์ผู้ป่วย (Patient Experience)',
                'สร้างข้อมูลเชิงสถิติสำหรับการพัฒนาระบบหลักในอนาคต',
            ]
        },
        {
            id: 'his',
            number: '2',
            emoji: '2️⃣',
            name: 'Medicore HIS',
            subtitle: 'Hospital Information System — Clinical Core System',
            tagline: 'ระบบแกนหลักสำหรับบริหารจัดการงานด้านคลินิกของโรงพยาบาล ครอบคลุมกระบวนการรักษาและการให้บริการทางการแพทย์',
            color: '#059669',
            gradient: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
            lightBg: '#ECFDF5',
            borderColor: '#A7F3D0',
            icon: 'bi-hospital',
            badge: 'Clinical Core',
            badgeColor: '#D1FAE5',
            badgeText: '#065F46',
            features: [
                {
                    title: 'โมดูลหลัก',
                    icon: 'bi-grid',
                    items: [
                        'OPD (ผู้ป่วยนอก)',
                        'IPD (ผู้ป่วยใน)',
                        'ER (ฉุกเฉิน)',
                        'Pharmacy',
                        'Laboratory',
                        'Radiology',
                        'Billing & Financial',
                        'Inventory (เชื่อมระบบคลินิก)',
                        'CPOE — Computerized Physician Order Entry',
                        'eMAR — Electronic Medication Administration Record',
                    ]
                },
                {
                    title: 'ความสามารถเพิ่มเติม',
                    icon: 'bi-stars',
                    items: [
                        'เชื่อมต่อเครื่องมือแพทย์',
                        'รองรับมาตรฐานข้อมูลสุขภาพ',
                        'ระบบรายงานวิเคราะห์ข้อมูลเพื่อผู้บริหาร',
                        'รองรับการขยายโมดูลในอนาคต',
                    ]
                },
            ],
            strategic: [
                'เป็นโครงสร้างพื้นฐานดิจิทัลของโรงพยาบาล',
                'รองรับการดำเนินงานทางการแพทย์ทั้งหมด',
                'สร้างความสัมพันธ์ระยะยาวในระดับองค์กร',
            ]
        },
        {
            id: 'erp',
            number: '3',
            emoji: '3️⃣',
            name: 'ERP',
            subtitle: 'Enterprise Resource Planning for Hospital Management',
            tagline: 'แพลตฟอร์มบริหารจัดการงานหลังบ้านของโรงพยาบาล (Back Office / Administrative System) เพื่อเพิ่มประสิทธิภาพการบริหารจัดการองค์กร และสนับสนุนความโปร่งใสในการดำเนินงาน',
            color: '#7C3AED',
            gradient: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 100%)',
            lightBg: '#F5F3FF',
            borderColor: '#DDD6FE',
            icon: 'bi-building-gear',
            badge: 'Back Office',
            badgeColor: '#EDE9FE',
            badgeText: '#5B21B6',
            features: [
                {
                    title: 'ระบบคลัง (Inventory & Warehouse)',
                    icon: 'bi-box-seam',
                    items: [
                        'ควบคุมสต็อกเวชภัณฑ์และวัสดุสิ้นเปลือง',
                        'ติดตาม Lot / Expire',
                        'รายงานมูลค่าสินค้าคงคลังแบบ Dashboard',
                    ]
                },
                {
                    title: 'ระบบจัดซื้อ (Procurement)',
                    icon: 'bi-cart-check',
                    items: [
                        'ใบขอซื้อ (PR) และใบสั่งซื้อ (PO)',
                        'เปรียบเทียบราคา',
                        'บริหารผู้ขาย (Vendor Management)',
                        'Workflow การอนุมัติหลายระดับ',
                    ]
                },
                {
                    title: 'ระบบพัสดุและครุภัณฑ์ (Asset Management)',
                    icon: 'bi-tools',
                    items: [
                        'ทะเบียนทรัพย์สิน',
                        'บันทึกการซ่อมบำรุง',
                        'คำนวณค่าเสื่อมราคา',
                        'ตรวจสอบประวัติการใช้งาน',
                    ]
                },
                {
                    title: 'ระบบบุคคล (HR Management)',
                    icon: 'bi-person-badge',
                    items: [
                        'โครงสร้างองค์กร',
                        'ข้อมูลบุคลากร',
                        'การลา และสิทธิประโยชน์',
                        'กำหนดสิทธิ์การเข้าถึงระบบ (Role-Based Access)',
                    ]
                },
                {
                    title: 'ระบบงบประมาณ (Budget Control & Monitoring)',
                    icon: 'bi-piggy-bank',
                    items: [
                        'ติดตามงบประมาณรายปี',
                        'วิเคราะห์การใช้จ่าย',
                        'รายงานรองรับการตรวจสอบภาครัฐ',
                    ]
                },
            ],
            strategic: [
                'สนับสนุนการบริหารจัดการอย่างมีประสิทธิภาพ',
                'เพิ่มความโปร่งใสและตรวจสอบได้',
                'เหมาะสำหรับหน่วยงานรัฐและโรงพยาบาลสังกัดทหาร',
            ]
        },
        {
            id: 'custom',
            number: '4',
            emoji: '4️⃣',
            name: 'Custom & Special Solutions',
            subtitle: 'โซลูชันเฉพาะทางที่พัฒนาให้สอดคล้องกับบริบทของแต่ละหน่วยงาน',
            tagline: 'โซลูชันเฉพาะทางที่พัฒนาให้สอดคล้องกับบริบท ข้อกำหนด และ TOR ของแต่ละหน่วยงาน',
            color: '#D97706',
            gradient: 'linear-gradient(135deg, #92400E 0%, #F59E0B 100%)',
            lightBg: '#FFFBEB',
            borderColor: '#FDE68A',
            icon: 'bi-puzzle',
            badge: 'Special Solutions',
            badgeColor: '#FEF3C7',
            badgeText: '#92400E',
            features: [
                {
                    title: 'ตัวอย่างระบบที่พัฒนา',
                    icon: 'bi-braces-asterisk',
                    items: [
                        'Telemedicine — ระบบพบแพทย์ออนไลน์',
                        'ระบบ IoT Health Monitoring',
                        'ระบบรายงานเฉพาะกิจ',
                        'ระบบตามข้อกำหนดโครงการภาครัฐหรือหน่วยงานทหาร',
                    ]
                },
            ],
            strategic: [
                'รองรับความต้องการเฉพาะของแต่ละองค์กร',
                'เพิ่มความสามารถในการแข่งขัน',
                'ขยายโอกาสการขายและการพัฒนาระบบต่อยอด',
            ]
        },
    ],

    // Render the main products page
    renderProducts() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        pageContent.innerHTML = this.buildPage();

        // Set active sidebar link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#/products') {
                link.classList.add('active');
            }
        });
    },

    buildPage() {
        const platformOverview = `
            <div style="background: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 56px; height: 56px; background: #EEF2FF; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #4F46E5;">
                        <i class="bi bi-hospital-fill"></i>
                    </div>
                    <div>
                        <h1 style="font-size: 1.75rem; font-weight: 700; margin: 0; color: #111827;">Digital Hospital Platform</h1>
                        <p style="color: #6B7280; margin: 0; font-size: 0.9rem;">Product Portfolio — Meditech</p>
                    </div>
                </div>
                <p style="color: #4B5563; line-height: 1.7; margin-bottom: 20px; max-width: 760px;">
                    บริษัทให้บริการแพลตฟอร์มดิจิทัลสำหรับโรงพยาบาลแบบครบวงจร ครอบคลุมทั้งงานให้บริการผู้ป่วย (Front Office)
                    ระบบงานทางคลินิก (Clinical Core) และระบบบริหารจัดการองค์กร (Back Office)
                    โดยออกแบบให้เชื่อมโยงกันเป็นระบบเดียว รองรับการพัฒนาโรงพยาบาลสู่ Digital Hospital อย่างเป็นรูปธรรม
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${['MEDIQ • Front Office', 'HIS • Clinical Core', 'ERP • Back Office', 'Custom • Special Solutions'].map((label, i) => {
            const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
            const bgColors = ['#EFF6FF', '#ECFDF5', '#F5F3FF', '#FFFBEB'];
            return `<span style="background: ${bgColors[i]}; border: 1px solid ${colors[i]}40; color: ${colors[i]}; border-radius: 20px; padding: 4px 14px; font-size: 0.8rem; font-weight: 600;">${label}</span>`;
        }).join('')}
                </div>
            </div>
        `;

        const productCards = this.PRODUCTS.map(p => this.buildProductCard(p)).join('');

        return `
            <div style="max-width: 1100px; margin: 0 auto;">
                ${platformOverview}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    ${productCards}
                </div>
                ${this.buildLayerDiagram()}
            </div>
        `;
    },

    buildProductCard(p) {
        const featureList = p.features.map(feature => `
            <div style="margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: ${p.color}; margin-bottom: 6px; font-size: 0.87rem;">
                    <i class="bi ${feature.icon}"></i>
                    ${feature.title}
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    ${feature.items.map(item => `<li style="font-size: 0.82rem; margin-bottom: 3px; line-height: 1.5;">${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        const strategicList = p.strategic.map(s => `
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                <i class="bi bi-check-circle-fill" style="color: ${p.color}; flex-shrink: 0; margin-top: 2px; font-size: 0.85rem;"></i>
                <span style="font-size: 0.82rem; color: #374151;">${s}</span>
            </div>
        `).join('');

        return `
            <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid ${p.borderColor}; display: flex; flex-direction: column;">
                <!-- Card header -->
                <div style="background: ${p.gradient}; padding: 22px 24px; color: white; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -30px; right: 30px; width: 70px; height: 70px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                        <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                            <i class="bi ${p.icon}"></i>
                        </div>
                        <div>
                            <div style="font-size: 1.1rem; font-weight: 700; line-height: 1.2;">${p.emoji} ${p.name}</div>
                            <div style="font-size: 0.75rem; opacity: 0.85;">${p.subtitle}</div>
                        </div>
                    </div>
                    <span style="display: inline-block; background: rgba(255,255,255,0.25); border-radius: 20px; padding: 3px 12px; font-size: 0.75rem; font-weight: 600;">${p.badge}</span>
                </div>

                <!-- Tagline -->
                <div style="padding: 16px 24px 12px; background: ${p.lightBg}; border-bottom: 1px solid ${p.borderColor};">
                    <p style="margin: 0; font-size: 0.83rem; color: #4B5563; line-height: 1.6;">${p.tagline}</p>
                </div>

                <!-- Features -->
                <div style="padding: 18px 24px; flex: 1;">
                    <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin-bottom: 12px;">ขอบเขตการทำงาน</div>
                    ${featureList}
                </div>

                <!-- Strategic section -->
                <div style="padding: 14px 24px 20px; background: ${p.lightBg}; border-top: 1px solid ${p.borderColor};">
                    <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin-bottom: 10px;">
                        <i class="bi bi-trophy" style="color: ${p.color};"></i> บทบาทเชิงกลยุทธ์
                    </div>
                    ${strategicList}
                </div>
            </div>
        `;
    },

    buildLayerDiagram() {
        const layers = [
            { label: 'Custom Solutions', sublabel: 'Specialized & Expansion Layer', color: '#D97706', bg: '#FEF3C7', icon: 'bi-puzzle-fill' },
            { label: 'ERP', sublabel: 'Back Office / Administrative Layer', color: '#7C3AED', bg: '#EDE9FE', icon: 'bi-building-gear' },
            { label: 'Medicore HIS', sublabel: 'Clinical Core Layer', color: '#059669', bg: '#D1FAE5', icon: 'bi-hospital-fill' },
            { label: 'MEDIQ Platform', sublabel: 'Front Office / Patient Journey Layer', color: '#2563EB', bg: '#DBEAFE', icon: 'bi-people-fill' },
        ];
        const layerHtml = layers.map((l, i) => `
            <div style="display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: ${l.bg}; border-left: 4px solid ${l.color}; border-radius: 8px; margin-bottom: ${i < layers.length - 1 ? '6px' : '0'};">
                <i class="bi ${l.icon}" style="font-size: 1.3rem; color: ${l.color}; flex-shrink: 0;"></i>
                <div>
                    <div style="font-weight: 700; color: ${l.color}; font-size: 0.95rem;">${l.label}</div>
                    <div style="font-size: 0.8rem; color: #6B7280;">${l.sublabel}</div>
                </div>
            </div>
        `).join('');

        return `
            <div style="margin-top: 28px; background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
                <h5 style="font-weight: 700; margin-bottom: 16px; color: #1F2937;">
                    <i class="bi bi-diagram-3" style="color: #6366F1;"></i>
                    โครงสร้างภาพรวมแพลตฟอร์ม
                </h5>
                <p style="color: #6B7280; font-size: 0.85rem; margin-bottom: 16px;">
                    Hospital Digital Platform ประกอบด้วย 4 ชั้น (Layers) ที่ทำงานร่วมกันอย่างบูรณาการ 
                    โดยออกแบบให้ทุกระบบสามารถเชื่อมต่อกันได้ เพื่อยกระดับประสิทธิภาพการให้บริการผู้ป่วย เพิ่มความแม่นยำทางคลินิก 
                    และเสริมความแข็งแกร่งด้านการบริหารจัดการองค์กรอย่างครบวงจร
                </p>
                <div style="max-width: 560px; margin: 0 auto;">
                    ${layerHtml}
                </div>
            </div>
        `;
    }
};

console.log('✅ Products module loaded');
