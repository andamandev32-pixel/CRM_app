// Forecast Engine for Sale Tracking System v1.4
// คำนวณ Expected Revenue = Proposal Value × Stage Probability × Budget Weight

const ForecastEngine = {
    // Stage Probability (S0-S8)
    stageProbability: {
        'S0': 0.00, 'S1': 0.05, 'S2': 0.10, 'S3': 0.20, 'S4': 0.35,
        'S5': 0.50, 'S6': 0.70, 'S7': 0.85, 'S8_WON': 1.00, 'S9': 0.00
    },

    // Budget Weight (B0-B4)
    budgetWeight: {
        'B0': 0.10, 'B1': 0.30, 'B2': 0.60, 'B3': 0.85, 'B4': 1.00
    },

    // Stage names (English)
    stageNames: {
        'S0': 'Target Identified', 'S1': 'Initial Meeting', 'S2': 'Requirement Discussion',
        'S3': 'Demo/Workshop', 'S4': 'TOR Drafting/Proposal', 'S5': 'Quotation Consideration',
        'S6': 'Waiting Procurement', 'S7': 'Procurement', 'S8_WON': 'Closed Won', 'S9': 'Closed Lost'
    },

    stageNamesTH: {
        'S0': 'ระบุเป้าหมาย', 'S1': 'เข้าพบเบื้องต้น', 'S2': 'สำรวจความต้องการ',
        'S3': 'นำเสนอ/สาธิตระบบ', 'S4': 'ร่าง TOR/เสนอราคา', 'S5': 'พิจารณา ใบเสนอราคา',
        'S6': 'รอกระบวนการจัดซื้อ', 'S7': 'จัดซื้อ/e-bidding', 'S8_WON': 'ปิดการขายสำเร็จ', 'S9': 'ไม่สำเร็จ/สูญเสียโครงการ'
    },

    // Budget code labels
    budgetLabels: {
        'B0': { name: 'Concept', emoji: '💭', color: '#9CA3AF', th: 'แนวคิด/ยังไม่มีงบ' },
        'B1': { name: 'Planned', emoji: '📋', color: '#60A5FA', th: 'อยู่ในแผน' },
        'B2': { name: 'Allocated', emoji: '💰', color: '#FBBF24', th: 'ตั้งงบแล้ว' },
        'B3': { name: 'Approved', emoji: '✅', color: '#34D399', th: 'งบอนุมัติ/รอประมูล' },
        'B4': { name: 'Direct Purchase', emoji: '🚀', color: '#F472B6', th: 'จัดซื้อตรง' }
    },

    // Product group definitions
    productGroups: {
        'MEDIQ': { name: 'MEDIQ Platform', emoji: '🏥', color: '#8B5CF6', products: ['MediQ', 'Queue'] },
        'HIS': { name: 'Hospital IS', emoji: '🖥️', color: '#3B82F6', products: ['HIS', 'MediCore'] },
        'ERP': { name: 'ERP', emoji: '📊', color: '#10B981', products: ['ERP'] },
        'Custom': { name: 'Custom Solutions', emoji: '🔧', color: '#F59E0B', products: ['ระบบระบาดวิทยา', 'Custom'] }
    },

    // Stage colors for badges
    stageColors: {
        'S0': '#9CA3AF', 'S1': '#60A5FA', 'S2': '#818CF8', 'S3': '#A78BFA',
        'S4': '#F59E0B', 'S5': '#F97316', 'S6': '#FB923C', 'S7': '#EF4444',
        'S8_WON': '#22C55E', 'S9': '#6B7280'
    },

    // Calculate expected revenue
    calculateExpectedRevenue(value, stageCode, budgetCode) {
        const prob = this.stageProbability[stageCode] || 0;
        const weight = this.budgetWeight[budgetCode] || 0.10;
        return Math.round(value * prob * weight);
    },

    // Get stage probability
    getStageProbability(stageCode) {
        return this.stageProbability[stageCode] || 0;
    },

    // Get budget weight
    getBudgetWeight(budgetCode) {
        return this.budgetWeight[budgetCode] || 0.10;
    },

    // Get product group for a product
    getProductGroup(product) {
        for (const [key, group] of Object.entries(this.productGroups)) {
            if (group.products.includes(product)) return key;
        }
        return 'Custom';
    },

    // Render budget badge HTML
    renderBudgetBadge(budgetCode) {
        const b = this.budgetLabels[budgetCode];
        if (!b) return '<span class="badge" style="background:#9CA3AF;color:white">N/A</span>';
        return `<span class="badge" style="background:${b.color};color:white" title="${b.th}">${b.emoji} ${budgetCode}</span>`;
    },

    // Render product group badge HTML
    renderProductGroupBadge(groupKey) {
        const g = this.productGroups[groupKey];
        if (!g) return '';
        return `<span class="badge" style="background:${g.color};color:white">${g.emoji} ${g.name}</span>`;
    },

    // Render stage badge HTML
    renderStageBadge(stageCode) {
        const color = this.stageColors[stageCode] || '#9CA3AF';
        const name = this.stageNames[stageCode] || stageCode;
        return `<span class="badge" style="background:${color};color:white">${stageCode}: ${name}</span>`;
    },

    // Get all stages array
    getAllStages() {
        return ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8_WON', 'S9'];
    },

    // Get all budget codes array
    getAllBudgetCodes() {
        return ['B0', 'B1', 'B2', 'B3', 'B4'];
    },

    // Pipeline summary stats
    getPipelineSummary(opportunities) {
        const totalValue = opportunities.reduce((s, o) => s + (o.value || 0), 0);
        const totalExpected = opportunities.reduce((s, o) => {
            return s + this.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0');
        }, 0);
        const activeCount = opportunities.filter(o => o.stage !== 'S8_WON' && o.stage !== 'S9').length;
        return { totalValue, totalExpected, activeCount, totalCount: opportunities.length };
    },

    // Get urgent actions: high budget (B3/B4) but low stage (<S5)
    getUrgentActions(opportunities) {
        return opportunities.filter(o =>
            (o.budgetCode === 'B3' || o.budgetCode === 'B4') &&
            ['S0', 'S1', 'S2', 'S3', 'S4'].includes(o.stage)
        );
    }
};

console.log('✅ Forecast Engine loaded (v1.4)');
