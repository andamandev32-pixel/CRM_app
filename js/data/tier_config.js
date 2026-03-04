// Tier Configuration - Default Tier Settings

const TierConfig = {
    defaultConfig: [
        {
            id: 'T1',
            name: 'Tier 1 (Strategic)',
            shortName: 'T1',
            color: 'danger',
            badgeClass: 'bg-danger',
            description: 'กลุ่มลูกค้าที่มีงบประมาณแล้ว รอหา บ.ที่จะมาทำ ตามงบประมาณ',
            criteria: {
                minRevenue: 10000000, // 10 ล้านบาท
                minScore: 80,
                requiresApproval: true
            },
            benefits: [
                'ส่วนลดพิเศษสูงสุด',
                'Support 24/7',
                'Dedicated Account Manager',
                'Priority Service',
                'Custom Development'
            ],
            reviewInterval: 90, // ทบทวนทุก 90 วัน
            autoUpgrade: false
        },
        {
            id: 'T2',
            name: 'Tier 2 (Key Account)',
            shortName: 'T2',
            color: 'warning',
            badgeClass: 'bg-warning',
            description: 'กลุ่มลูกค้าที่มีแผนงาน ของปีงบประมาณหน้า กำลังหา บ.ที่จะมาทำ ตามงบประมาณ',
            criteria: {
                minRevenue: 5000000, // 5 ล้านบาท
                minScore: 60,
                requiresApproval: false
            },
            benefits: [
                'ส่วนลดพิเศษ',
                'Support ในเวลาทำการ',
                'Account Manager',
                'Priority Support'
            ],
            reviewInterval: 120, // ทบทวนทุก 120 วัน
            autoUpgrade: true
        },
        {
            id: 'T3',
            name: 'Tier 3 (Standard)',
            shortName: 'T3',
            color: 'success',
            badgeClass: 'bg-success',
            description: 'กลุ่มลูกค้าที่มีความต้องการระบบ แต่ยังไม่ทราบงบประมาณ ให้เราเสนอเพื่อดูความคุ้มค่า เพื่อลงทุน',
            criteria: {
                minRevenue: 1000000, // 1 ล้านบาท
                minScore: 40,
                requiresApproval: false
            },
            benefits: [
                'ส่วนลดมาตรฐาน',
                'Support ในเวลาทำการ',
                'Standard Service'
            ],
            reviewInterval: 180, // ทบทวนทุก 180 วัน
            autoUpgrade: true
        },
        {
            id: 'T4',
            name: 'Tier 4 (Prospect)',
            shortName: 'T4',
            color: 'secondary',
            badgeClass: 'bg-secondary',
            description: 'กลุ่มลูกค้าที่มีความต้องการระบบใหม่ หรือระบบงานใหม่ อยากให้เราเข้าไปช่วยจัดการ หรือ จัดหา solution',
            criteria: {
                minRevenue: 0,
                minScore: 0,
                requiresApproval: false
            },
            benefits: [
                'ราคามาตรฐาน',
                'Support พื้นฐาน'
            ],
            reviewInterval: 365, // ทบทวนทุก 365 วัน
            autoUpgrade: true
        }
    ],

    // Get all tier configs
    getAll() {
        return this.defaultConfig;
    },

    // Get tier config by ID
    getById(id) {
        return this.defaultConfig.find(t => t.id === id);
    },

    // Get badge class for tier
    getBadgeClass(tierId) {
        const tier = this.getById(tierId);
        return tier ? tier.badgeClass : 'bg-secondary';
    },

    // Get tier name
    getName(tierId) {
        const tier = this.getById(tierId);
        return tier ? tier.name : tierId;
    },

    // Suggest tier based on criteria
    suggestTier(revenue, score) {
        // Start from highest tier
        for (let tier of this.defaultConfig) {
            if (revenue >= tier.criteria.minRevenue && score >= tier.criteria.minScore) {
                return tier.id;
            }
        }
        return 'T4'; // Default to lowest tier
    }
};

console.log('✅ Tier Configuration loaded');
