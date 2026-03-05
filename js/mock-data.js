// Mock Data Generator for Sale Tracking System v1.3
// Generates comprehensive Thai sample data for all 46 tables

const MockData = {
    // Thai names database
    thaiFirstNames: [
        'สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'ประเสริฐ', 'มาลี', 'สมศักดิ์', 'วิไล',
        'ชัยวัฒน์', 'สุภาพร', 'ธนา', 'กัญญา', 'อนุชา', 'พิมพ์ใจ', 'ราชัน', 'ศิริพร',
        'เจริญ', 'อรุณี', 'บุญมี', 'สุดารัตน์', 'วีระ', 'นภา', 'สุรชัย', 'ปราณี'
    ],

    thaiLastNames: [
        'ใจดี', 'รักดี', 'มั่นคง', 'สุขสันต์', 'เจริญสุข', 'พัฒนา', 'วิริยะกุล', 'สมบูรณ์',
        'ทองดี', 'เพชรรัตน์', 'ศรีสุข', 'บุญเรือง', 'วงศ์ใหญ่', 'ชัยชนะ', 'รุ่งเรือง', 'เกียรติศักดิ์'
    ],

    // Hospital names — Real data from hospital_budget_status_update CSV
    hospitals: [
        // กลุ่มกองทัพบก (Army)
        { name: 'รพ.ค่ายประจักษ์ศิลปาคม', type: 'army', province: 'อุดรธานี', region: 'อีสาน' },
        { name: 'รพ.ค่ายธนรัตน์', type: 'army', province: 'ประจวบคีรีขันธ์', region: 'กลาง' },
        { name: 'รพ.ค่ายศรีสองรัก', type: 'army', province: 'เลย', region: 'อีสาน' },
        { name: 'รพ.ค่ายสุรศักดิ์มนตรี', type: 'army', province: 'ลำปาง', region: 'เหนือ' },
        { name: 'รพ.ค่ายเทพสตรีศรีสุนทร', type: 'army', province: 'นครศรีธรรมราช', region: 'ใต้' },
        // กลุ่ม รพ.รัฐ (Government) & เอกชน (Private)
        { name: 'รพ.มหาวิทยาลัยพะเยา', type: 'government', province: 'พะเยา', region: 'เหนือ' },
        { name: 'รพ.มะเร็งลพบุรี', type: 'government', province: 'ลพบุรี', region: 'กลาง' },
        { name: 'ศูนย์การแพทย์กาญจนาภิเษก ม.มหิดล', type: 'government', province: 'นครปฐม', region: 'กลาง' },
        { name: 'รพ.จุฬาภรณ์ (ระบบคิว)', type: 'government', province: 'กรุงเทพฯ', region: 'กลาง' },
        { name: 'รพ.ราชเวช (เหนือ)', type: 'private', province: 'เชียงใหม่', region: 'เหนือ' },
        { name: 'อบจ.สระบุรี', type: 'government', province: 'สระบุรี', region: 'กลาง' },
        { name: 'รพ.จุฬาภรณ์', type: 'government', province: 'กรุงเทพฯ', region: 'กลาง' },
        { name: 'ม.สวนดุสิต', type: 'government', province: 'กรุงเทพฯ', region: 'กลาง' },
        { name: 'รพ.อ่างทอง', type: 'government', province: 'อ่างทอง', region: 'กลาง' },
        { name: 'รพ.สันทราย', type: 'government', province: 'เชียงใหม่', region: 'เหนือ' },
        { name: 'รพ.สวรรค์ประชารักษ์', type: 'government', province: 'นครสวรรค์', region: 'เหนือ' },
        { name: 'รพ.ชัยนาทนเรนทร', type: 'government', province: 'ชัยนาท', region: 'กลาง' },
        { name: 'รพ.กำแพงเพชร', type: 'government', province: 'กำแพงเพชร', region: 'กลาง' },
        { name: 'ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน ม.ศรีนครินทร์', type: 'government', province: 'นนทบุรี', region: 'กลาง' },
        { name: 'รพ.บางปะกง', type: 'government', province: 'ฉะเชิงเทรา', region: 'ตะวันออก' },
        { name: 'รพ.ทันตกรรม มช.', type: 'government', province: 'เชียงใหม่', region: 'เหนือ' },
        { name: 'รพ.มะเร็งชลบุรี', type: 'government', province: 'ชลบุรี', region: 'ตะวันออก' },
        { name: 'สถาบันเด็กแห่งชาติมหาราชินี', type: 'government', province: 'กรุงเทพฯ', region: 'กลาง' }
    ],

    // Positions
    positions: [
        'ผู้อำนวยการ', 'รองผู้อำนวยการ', 'หัวหน้าแผนก IT', 'หัวหน้าแผนกการเงิน',
        'เจ้าหน้าที่ IT', 'พยาบาลหัวหน้า', 'แพทย์หัวหน้าแผนก', 'เภสัชกร',
        'นักวิชาการคอมพิวเตอร์', 'ผู้จัดการฝ่ายจัดซื้อ'
    ],

    // Generate all mock data
    async generate() {
        console.log('🔄 Generating mock data...');

        // Clear existing data
        Storage.clearAll();
        Storage.init();

        // Generate data for each table
        this.generatePipelineTemplates(); // NEW
        this.generateTierConfig(); // NEW
        this.generateUsers();

        // --- REMOVED DUMMY GENERATION TO FOCUS ON REAL PIPELINE DATA ---
        // this.generateCustomers();
        // this.generateContacts();

        await this.generateOpportunities(); // This now parses CSV and creates BOTH customers and opportunities

        // this.generateVisitReports();
        // this.generateFollowUps();
        // this.generateDemoRequests();
        // this.generateNotifications();
        // this.generateAssessmentScores();
        // this.generateCalendarEvents();
        // this.generateMeetingRecords();
        // this.generateProjects();
        // this.generateDevRequests();

        this.generatePricingPolicy();

        console.log('✅ Mock data generated successfully!');
        console.log('📊 Statistics:', Storage.getStats());

        // Ensure UI refreshes if already on pipeline page
        if (window.location.hash.includes('pipeline') && window.PipelineModule) {
            window.PipelineModule.renderBoard();
        }
    },

    // Generate users — real sales team
    generateUsers() {
        const users = [
            {
                id: 'USR-001',
                name: 'พี่หม๋วย',
                email: 'muay@company.com',
                role: 'sales',
                region: null,
                phone: '',
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'USR-002',
                name: 'พี่มายด์',
                email: 'mind@company.com',
                role: 'sales',
                region: null,
                phone: '',
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'USR-003',
                name: 'พี่โอ๋',
                email: 'o@company.com',
                role: 'sales',
                region: null,
                phone: '',
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'USR-006',
                name: 'Admin System',
                email: 'admin@company.com',
                role: 'admin',
                region: null,
                phone: '',
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'USR-007',
                name: 'ผู้บริหาร',
                email: 'management@company.com',
                role: 'management',
                region: null,
                phone: '',
                createdAt: '2024-01-01T00:00:00Z'
            }
        ];

        users.forEach(user => Storage.add('users', user));
        console.log(`✓ Generated ${users.length} users (real sales team)`);
    },

    // Generate customers
    generateCustomers() {
        const tiers = ['T1', 'T2', 'T3', 'T4'];
        const statuses = ['active', 'prospect', 'inactive'];

        this.hospitals.forEach((hospital, index) => {
            const customer = {
                id: `CUS-${(index + 1).toString().padStart(3, '0')}`,
                name: hospital.name,
                type: hospital.type,
                region: hospital.region,
                province: hospital.province,
                tier: Utils.randomItem(tiers),
                status: index < 15 ? 'active' : Utils.randomItem(statuses),
                assignedTo: 'USR-001',
                createdAt: Utils.randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)).toISOString()
            };

            Storage.add('customers', customer);
        });

        console.log(`✓ Generated ${this.hospitals.length} customers`);
    },

    // Generate contacts
    generateContacts() {
        const customers = Storage.get('customers');
        let contactId = 1;

        customers.forEach(customer => {
            // Generate 2-4 contacts per customer
            const numContacts = Utils.randomNumber(2, 4);

            for (let i = 0; i < numContacts; i++) {
                const contact = {
                    id: `CON-${contactId.toString().padStart(3, '0')}`,
                    customerId: customer.id,
                    name: `${Utils.randomItem(this.thaiFirstNames)} ${Utils.randomItem(this.thaiLastNames)}`,
                    position: Utils.randomItem(this.positions),
                    phone: `08${Utils.randomNumber(1, 9)}-${Utils.randomNumber(100, 999)}-${Utils.randomNumber(1000, 9999)}`,
                    email: `contact${contactId}@${customer.name.replace(/[^a-z]/gi, '').toLowerCase()}.com`,
                    createdAt: customer.createdAt
                };

                Storage.add('contacts', contact);
                contactId++;
            }
        });

        console.log(`✓ Generated ${contactId - 1} contacts`);
    },

    async generateOpportunities() {
        let rows = [];

        try {
            const response = await fetch('./doc/hospital_budget_status_update_ก.พ.69.xlsx');
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
            } else {
                console.error('Failed to fetch Excel, fallback to empty data');
                return;
            }
        } catch (e) {
            console.error('Error fetching Excel:', e);
            return;
        }

        this.parseOpportunitiesFromRows(rows);
    },

    parseOpportunitiesFromRows(rows) {
        let opportunitiesCreated = 0;
        let customerMap = new Map();
        let customerIdCounter = 1;

        // Skip headers. Look for the row where first or second column is '#' or 'โรงพยาบาล'
        let startRowIndex = 0;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === '#' || rows[i][0] === 'ที่' || String(rows[i][1]).includes('โรงพยาบาล')) {
                startRowIndex = i + 1;
                break;
            }
        }
        if (startRowIndex === 0) startRowIndex = 2; // Fallback to index 2 (row 3)

        for (let i = startRowIndex; i < rows.length; i++) {
            const parts = rows[i] || [];
            if (parts.length === 0) continue;

            // Convert everything to string for processing
            const strParts = parts.map(p => String(p));

            const hospName = strParts[1] ? strParts[1].trim() : '';
            if (!hospName || hospName.startsWith('🔵') || hospName.startsWith('🟢') || hospName.includes('ยอดรวม')) continue;

            const group = strParts[2] ? strParts[2].trim() : '';
            // Handle Customer Creation
            let customerId;
            if (customerMap.has(hospName)) {
                customerId = customerMap.get(hospName);
            } else {
                customerId = `CUS-${customerIdCounter.toString().padStart(3, '0')}`;
                customerMap.set(hospName, customerId);
                const customerGroup = group || 'รพ.รัฐ';

                Storage.add('customers', {
                    id: customerId,
                    name: hospName,
                    customerGroup: customerGroup,
                    type: customerGroup.includes('เอกชน') ? 'private' : 'government',
                    status: 'active',
                    assignedTo: 'USR-001',
                    createdAt: new Date().toISOString()
                });
                customerIdCounter++;
            }

            let valStr = strParts[4] ? strParts[4].replace(/"/g, '').replace(/,/g, '').trim() : '';
            const value = (valStr === '-' || !valStr) ? 0 : parseInt(valStr) || 0;

            const product = strParts[5] ? strParts[5].trim() : '';
            const budgetRaw = strParts[6] ? strParts[6].trim() : '';
            const budgetYear = strParts[7] ? strParts[7].trim() : '';
            const stageRaw = strParts[8] ? strParts[8].trim() : '';
            const detail = strParts[9] ? strParts[9].trim() : '';
            const remark = strParts.length > 10 && strParts[10] ? strParts[10].trim() : '';

            // Parse Level
            let budgetCode = 'Level 4';
            if (budgetRaw.startsWith('1')) budgetCode = 'Level 1';
            else if (budgetRaw.startsWith('2')) budgetCode = 'Level 2';
            else if (budgetRaw.startsWith('3')) budgetCode = 'Level 3';
            else if (budgetRaw.startsWith('4')) budgetCode = 'Level 4';
            else if (budgetRaw.startsWith('5')) budgetCode = 'Level 5';

            // Parse Stage
            let stage = 'S0';
            const sMatch = stageRaw.match(/^S[0-9]+(-[0-9]+)?(_WON)?/i);
            if (sMatch) {
                let code = sMatch[0].toUpperCase();
                if (code === 'S4-1') code = 'S5'; // old S4-1 mapping fallback
                if (code === 'S7_WON') code = 'S8_WON'; // old S7_WON mapping fallback
                stage = code;
            } else {
                const ls = stageRaw.toLowerCase();
                if (ls.includes('won') || ls.includes('ชนะ')) stage = 'S8_WON';
                else if (ls.includes('lost') || ls.includes('ไม่สำเร็จ') || ls.includes('สูญเสีย')) stage = 'S9';
                else if (ls.includes('กำลังดำเนินการจัดซื้อ') || ls.includes('e-bidding') || ls.includes('s7')) stage = 'S7';
                else if (ls.includes('รอกระบวนการจัดซื้อ') || ls.includes('รออนุมัติ') || ls.includes('s6')) stage = 'S6';
                else if (ls.includes('พิจารณา') || ls.includes('s5') || ls.includes('s4-1')) stage = 'S5';
                else if (ls.includes('tor') || ls.includes('เสนอราคา') || ls.includes('s4')) stage = 'S4';
                else if (ls.includes('demo') || ls.includes('trial') || ls.includes('s3')) stage = 'S3';
                else if (ls.includes('คฉ') || ls.includes('ความต้องการ') || ls.includes('s2')) stage = 'S2';
                else if (ls.includes('ติดต่อ') || ls.includes('เข้าพบ') || ls.includes('s1')) stage = 'S1';
            }

            const productGroup = product.includes('MediQ') ? 'MEDIQ' : (product.includes('HIS') || product.includes('MediCore') ? 'HIS' : 'Custom');
            const stageMap = { 'S0': 0, 'S1': 5, 'S2': 10, 'S3': 20, 'S4': 35, 'S5': 50, 'S6': 70, 'S7': 85, 'S8_WON': 100, 'S9': 0 };

            const opp = {
                id: `OPP-${(opportunitiesCreated + 1).toString().padStart(3, '0')}`,
                customerId: customerId,
                product: product,
                productGroup: productGroup,
                value: value,
                stage: stage,
                budgetCode: budgetCode,
                budgetYear: budgetYear,
                probability: stageMap[stage] || 0,
                salesStatus: stageRaw,
                detail: detail,
                remark: remark,
                expectedClose: Utils.randomDate(new Date(), new Date(2025, 11, 31)).toISOString(),
                assignedTo: 'USR-001',
                interest: ['Level 1', 'Level 5'].includes(budgetCode) ? 'hot' : (['Level 2', 'Level 3'].includes(budgetCode) ? 'warm' : 'cold'),
                stageHistory: JSON.stringify([
                    { stage: stage, date: new Date().toISOString(), reason: 'Imported from Excel/CSV' }
                ]),
                createdAt: new Date().toISOString()
            };

            Storage.add('opportunities', opp);
            opportunitiesCreated++;
        }

        console.log(`✓ Generated ${opportunitiesCreated} opportunities and ${customerIdCounter - 1} customers directly from file parsing!`);
    },

    // Generate visit reports
    generateVisitReports() {
        const customers = Storage.get('customers').filter(c => c.status === 'active').slice(0, 20);
        const interests = ['hot', 'warm', 'cold'];
        const products = ['HIS', 'Queue', 'Both'];

        customers.forEach((customer, index) => {
            const report = {
                id: `VIS-${(index + 1).toString().padStart(3, '0')}`,
                customerId: customer.id,
                visitDate: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString(),
                attendees: 'ผู้อำนวยการ, หัวหน้าแผนก IT',
                products: Utils.randomItem(products),
                objective: 'นำเสนอระบบ HIS และ Queue Management',
                summary: 'ลูกค้าให้ความสนใจในระบบ มีแผนจัดซื้อในปีงบประมาณหน้า ขอเอกสารเพิ่มเติมและนัดดู Demo',
                interest: Utils.randomItem(interests),
                createdBy: 'USR-001',
                createdAt: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString()
            };

            Storage.add('visitReports', report);
        });

        console.log('✓ Generated 20 visit reports');
    },

    // Generate follow-ups
    generateFollowUps() {
        const reports = Storage.get('visitReports');
        const statuses = ['pending', 'done', 'overdue'];

        reports.forEach((report, index) => {
            const followUp = {
                id: `FUP-${(index + 1).toString().padStart(3, '0')}`,
                reportId: report.id,
                customerId: report.customerId,
                action: 'ส่งเอกสารเพิ่มเติมและนัดดู Demo',
                deadline: Utils.randomDate(new Date(), new Date(2025, 2, 31)).toISOString(),
                assignedTo: 'USR-001',
                status: index < 5 ? 'overdue' : index < 15 ? 'pending' : 'done',
                createdAt: report.createdAt
            };

            Storage.add('followUps', followUp);
        });

        console.log('✓ Generated 20 follow-ups');
    },

    // Generate demo requests
    generateDemoRequests() {
        const opportunities = Storage.get('opportunities').filter(o => ['S3', 'S4', 'S5'].includes(o.stage)).slice(0, 10);
        const types = ['demo', 'trial'];
        const statuses = ['approved', 'pending_l1', 'pending_l2', 'draft'];

        opportunities.forEach((opp, index) => {
            const type = Utils.randomItem(types);
            const demo = {
                id: `DEM-${(index + 1).toString().padStart(3, '0')}`,
                opportunityId: opp.id,
                customerId: opp.customerId,
                type: type,
                product: opp.product,
                modules: JSON.stringify(['OPD', 'IPD', 'Pharmacy']),
                startDate: Utils.randomDate(new Date(), new Date(2025, 2, 1)).toISOString(),
                endDate: Utils.randomDate(new Date(2025, 2, 1), new Date(2025, 5, 1)).toISOString(),
                status: Utils.randomItem(statuses),
                approvedBy1: index < 7 ? 'USR-002' : null,
                approvedBy2: type === 'trial' && index < 5 ? 'USR-003' : null,
                totalCost: type === 'demo' ? Utils.randomNumber(10000, 50000) : Utils.randomNumber(100000, 300000),
                attachments: null,
                createdBy: 'USR-001',
                createdAt: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString()
            };

            Storage.add('demoRequests', demo);
        });

        console.log('✓ Generated 10 demo requests');
    },

    // Generate notifications
    generateNotifications() {
        const notifications = [
            {
                userId: 'USR-001',
                type: 'follow_up_overdue',
                message: 'คุณมี Follow-up ที่เกินกำหนด 3 รายการ',
                link: '#/followup',
                isRead: false
            },
            {
                userId: 'USR-001',
                type: 'approval_result',
                message: 'แผนการเข้าพบเดือน ก.พ. ได้รับการอนุมัติแล้ว',
                link: '#/visits/plan',
                isRead: false
            },
            {
                userId: 'USR-002',
                type: 'approval_pending',
                message: 'มีคำขอ Demo ใหม่รออนุมัติ 2 รายการ',
                link: '#/approval',
                isRead: false
            }
        ];

        notifications.forEach(notif => Storage.add('notifications', notif));
        console.log('✓ Generated 3 notifications');
    },

    // Generate assessment scores
    generateAssessmentScores() {
        const customers = Storage.get('customers').filter(c => c.status === 'active').slice(0, 15);

        customers.forEach(customer => {
            const score = {
                id: `ASS-${customer.id}`,
                customerId: customer.id,
                date: new Date().toISOString(),
                source: 'visit',
                scores: JSON.stringify({
                    budget: Utils.randomNumber(1, 5),
                    authority: Utils.randomNumber(1, 5),
                    need: Utils.randomNumber(1, 5),
                    timeline: Utils.randomNumber(1, 5),
                    champion: Utils.randomNumber(1, 5)
                }),
                totalScore: Utils.randomNumber(5, 25),
                tier: customer.tier,
                triggeredBy: 'USR-001',
                createdAt: new Date().toISOString()
            };

            Storage.add('assessmentScores', score);
        });

        console.log('✓ Generated 15 assessment scores');
    },

    // Generate calendar events
    generateCalendarEvents() {
        const customers = Storage.get('customers').filter(c => c.status === 'active').slice(0, 10);
        const types = ['visit', 'meeting', 'demo', 'training'];

        customers.forEach((customer, index) => {
            const startDate = Utils.randomDate(new Date(), new Date(2025, 2, 31));
            const event = {
                id: `EVT-${(index + 1).toString().padStart(3, '0')}`,
                salesId: 'USR-001',
                customerId: customer.id,
                type: Utils.randomItem(types),
                title: `นำเสนอระบบ - ${customer.name}`,
                startDate: startDate.toISOString(),
                endDate: new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
                purpose: 'นำเสนอระบบและสาธิต',
                isPlanned: true,
                status: 'planned',
                linkedReportId: null,
                createdAt: new Date().toISOString()
            };

            Storage.add('calendarEvents', event);
        });

        console.log('✓ Generated 10 calendar events');
    },


    // Generate meeting records
    generateMeetingRecords() {
        const opportunities = Storage.get('opportunities').slice(0, 8);
        const types = ['VST', 'TEC', 'REQ', 'FUP'];

        opportunities.forEach((opp, index) => {
            const meeting = {
                id: `MTG-${(index + 1).toString().padStart(3, '0')}`,
                opportunityId: opp.id,
                customerId: opp.customerId,
                type: Utils.randomItem(types),
                meetingDate: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString(),
                startTime: '10:00',
                endTime: '12:00',
                location: 'ที่ทำการลูกค้า',
                isOnline: false,
                attendees: JSON.stringify(['ผู้อำนวยการ', 'หัวหน้า IT', 'ทีมขาย']),
                agenda: JSON.stringify(['นำเสนอระบบ', 'Q&A', 'กำหนดขั้นตอนถัดไป']),
                summary: 'ประชุมเป็นไปด้วยดี ลูกค้าสนใจระบบ',
                progress: 'good',
                interest: 'warm',
                risks: null,
                linkedEventId: null,
                createdBy: 'USR-001',
                createdAt: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString()
            };

            Storage.add('meetingRecords', meeting);
        });

        console.log('✓ Generated 8 meeting records');
    },

    // Generate projects
    generateProjects() {
        const opportunities = Storage.get('opportunities').filter(o => o.stage === 'S6').slice(0, 5);
        const stages = ['planning', 'development', 'uat', 'training', 'golive'];
        const healthStatuses = ['green', 'yellow', 'red'];

        opportunities.forEach((opp, index) => {
            const project = {
                id: `PRJ-${(index + 1).toString().padStart(3, '0')}`,
                opportunityId: opp.id,
                customerId: opp.customerId,
                name: `โครงการติดตั้งระบบ ${opp.product}`,
                product: opp.product,
                contractValue: opp.value,
                pmId: 'USR-005',
                startDate: Utils.randomDate(new Date(2024, 6, 1), new Date(2024, 10, 1)).toISOString(),
                plannedEndDate: Utils.randomDate(new Date(2025, 0, 1), new Date(2025, 5, 1)).toISOString(),
                actualEndDate: null,
                status: 'active',
                stage: Utils.randomItem(stages),
                healthStatus: Utils.randomItem(healthStatuses),
                createdAt: Utils.randomDate(new Date(2024, 6, 1), new Date(2024, 10, 1)).toISOString()
            };

            Storage.add('projects', project);
        });

        console.log('✓ Generated 5 projects');
    },

    // Generate dev requests
    generateDevRequests() {
        const opportunities = Storage.get('opportunities').filter(o => ['S3', 'S4'].includes(o.stage)).slice(0, 6);
        const statuses = ['draft', 'pending', 'responded', 'closed'];

        opportunities.forEach((opp, index) => {
            const request = {
                id: `DEV-${(index + 1).toString().padStart(3, '0')}`,
                opportunityId: opp.id,
                customerId: opp.customerId,
                requestType: 'estimate',
                modules: JSON.stringify(['OPD', 'IPD', 'Pharmacy', 'Lab']),
                specialRequirements: 'ต้องการ Custom Report และ Integration กับระบบเดิม',
                targetPrice: opp.value,
                targetPriceReason: 'ตามงบประมาณลูกค้า',
                urgency: index < 2 ? 'urgent' : 'normal',
                deadline: Utils.randomDate(new Date(), new Date(2025, 2, 1)).toISOString(),
                attachments: null,
                status: Utils.randomItem(statuses),
                createdBy: 'USR-001',
                createdAt: Utils.randomDate(new Date(2024, 10, 1), new Date()).toISOString()
            };

            Storage.add('devRequests', request);
        });

        console.log('✓ Generated 6 dev requests');
    },

    // Generate pricing policy
    generatePricingPolicy() {
        const policy = {
            id: 'POL-001',
            maxLossPerProject: 500000,
            maxLossPerYear: 3000000,
            levelThresholds: JSON.stringify({
                manager: 200000,
                board: 500000
            }),
            mandatoryConditions: JSON.stringify([
                'ต้องมีแผนชดเชยที่ชัดเจน',
                'Pipeline ที่คาดหวังต้องมากกว่า 5 เท่าของยอดขาดทุน'
            ]),
            minPipelineRatio: 5,
            updatedBy: 'USR-003',
            updatedAt: new Date().toISOString()
        };

        Storage.add('pricingPolicy', policy);
        console.log('✓ Generated pricing policy');
    },

    // Generate Pipeline Templates
    generatePipelineTemplates() {
        // Load default templates from PipelineTemplates
        PipelineTemplates.defaultTemplates.forEach(template => {
            Storage.add('pipelineTemplates', template);
        });
        console.log(`✓ Generated ${PipelineTemplates.defaultTemplates.length} pipeline templates`);
    },

    // Generate Tier Configuration
    generateTierConfig() {
        // Load default tier config from TierConfig
        TierConfig.defaultConfig.forEach(tier => {
            Storage.add('tierConfig', tier);
        });
        console.log(`✓ Generated ${TierConfig.defaultConfig.length} tier configurations`);
    }
};

// Auto-generate on first load if no data exists or old format detected
if (typeof window !== 'undefined') {
    // Only auto-generate if we have Storage
    if (window.Storage) {
        const customers = Storage.get('customers');
        const dataVersion = window.localStorage ? window.localStorage.getItem('mockDataVersion') : null;
        let needsRegen = (!customers || customers.length === 0 || dataVersion !== 'v2.0');

        if (needsRegen && window.localStorage) {
            window.localStorage.setItem('mockDataVersion', 'v2.0');
        }

        // If we have old dummy data that lacks the customerGroup property, force regenerate
        if (!needsRegen && customers[0] && customers[0].customerGroup === undefined) {
            needsRegen = true;
        }

        if (needsRegen) {
            console.log('📦 No existing data or old format found, generating mock data...');
            // Need an async wrapper for the new async generate function
            setTimeout(() => {
                MockData.generate();
            }, 100);
        } else {
            console.log('✅ Mock data already exists');
        }
    }
}

console.log('✅ Mock data module loaded');
