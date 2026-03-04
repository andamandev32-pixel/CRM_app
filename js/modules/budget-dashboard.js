// Budget Control Dashboard Module v1.4
// Module 13 — Sales Pipeline & Budget Control Dashboard

const BudgetDashboardModule = {
    init() {
        console.log('💰 Budget Dashboard module initialized');
    },

    // Render budget dashboard
    renderDashboard() {
        const opportunities = Storage.get('opportunities') || [];
        const customers = Storage.get('customers') || [];
        const stages = PipelineModule.STAGES;
        const budgetCodes = Object.keys(PipelineModule.BUDGET_CODES);

        // Build heatmap data: budgetCode × stage
        const heatmapData = {};
        budgetCodes.forEach(b => {
            heatmapData[b] = {};
            stages.forEach(s => {
                const opps = opportunities.filter(o => (o.budgetCode || 'B0') === b && o.stage === s.id);
                heatmapData[b][s.id] = {
                    count: opps.length,
                    value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
                    expected: opps.reduce((sum, o) => sum + PipelineModule.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
                };
            });
        });

        // Product group breakdown
        const groupKeys = Object.keys(PipelineModule.PRODUCT_GROUPS);
        const groupData = {};
        groupKeys.forEach(key => {
            const opps = opportunities.filter(o => (o.productGroup || PipelineModule.getProductGroupKey(o.product)) === key);
            groupData[key] = {
                count: opps.length,
                value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
                expected: opps.reduce((sum, o) => sum + PipelineModule.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
            };
        });

        // Segment breakdown
        const segments = [
            { key: 'army', name: 'กองทัพ', emoji: '🪖' },
            { key: 'government', name: 'รัฐบาล', emoji: '🏛️' },
            { key: 'private', name: 'เอกชน', emoji: '🏥' },
            { key: 'clinic', name: 'คลินิก', emoji: '🏪' }
        ];
        const segmentData = {};
        segments.forEach(seg => {
            const custIds = customers.filter(c => c.type === seg.key).map(c => c.id);
            const opps = opportunities.filter(o => custIds.includes(o.customerId));
            segmentData[seg.key] = {
                count: opps.length,
                value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
                expected: opps.reduce((sum, o) => sum + PipelineModule.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
            };
        });

        // Urgent actions
        const urgentActions = opportunities.filter(o =>
            (o.budgetCode === 'B3' || o.budgetCode === 'B4') &&
            ['S0', 'S1', 'S2', 'S3', 'S4'].includes(o.stage)
        );

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-piggy-bank"></i> Budget Control Dashboard</h1>
                        <p class="text-muted mb-0">Sales Pipeline & Budget Control — Module 13 (v1.4)</p>
                    </div>
                    <div>
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('budget-dashboard')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                    </div>
                </div>

                <!-- Section 1: Heatmap -->
                <div class="card mb-4">
                    <div class="card-header"><h5 class="mb-0">📊 Budget Readiness × Sales Stage Heatmap</h5></div>
                    <div class="card-body" style="overflow-x: auto;">
                        <table class="table table-bordered table-sm mb-0" style="font-size: 0.8rem;">
                            <thead>
                                <tr class="table-light">
                                    <th style="min-width:120px;">Budget \\ Stage</th>
                                    ${stages.map(s => `<th class="text-center" style="min-width:80px; font-size:0.7rem;">${s.id}<br><span class="text-muted">${s.name}</span></th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${budgetCodes.map(b => {
            const bd = PipelineModule.BUDGET_CODES[b];
            return `<tr>
                                        <td style="background:${bd.color}15; font-weight:600;">${bd.emoji} ${b}: ${bd.name}</td>
                                        ${stages.map(s => {
                const cell = heatmapData[b][s.id];
                const intensity = cell.count > 0 ? Math.min(cell.count * 25 + 15, 80) : 0;
                const bg = cell.count > 0 ? `rgba(99,102,241,${intensity / 100 * 0.4})` : '';
                return `<td class="text-center" style="background:${bg}; ${cell.count > 0 ? 'cursor:pointer;' : ''}" ${cell.count > 0 ? `title="${cell.count} รายการ, ${Utils.formatCurrency(cell.value)}"` : ''}>
                                                ${cell.count > 0 ? `<div class="fw-bold">${cell.count}</div><div class="text-muted" style="font-size:0.65rem;">${cell.value > 0 ? (cell.value / 1000000).toFixed(1) + 'M' : '-'}</div>` : '<span class="text-muted">—</span>'}
                                            </td>`;
            }).join('')}
                                    </tr>`;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Section 2: Product Groups -->
                <div class="row g-3 mb-4">
                    ${groupKeys.map(key => {
            const g = PipelineModule.PRODUCT_GROUPS[key];
            const d = groupData[key];
            return `
                            <div class="col-md-3">
                                <div class="card h-100" style="border-left: 4px solid ${g.color};">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center gap-2 mb-3">
                                            <span style="font-size:1.5rem;">${g.emoji}</span>
                                            <span class="fw-bold">${g.name}</span>
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <small class="text-muted d-block">โครงการ</small>
                                                <span class="fw-bold fs-5">${d.count}</span>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">Pipeline</small>
                                                <span class="fw-bold" style="color:${g.color};">${d.value > 0 ? Utils.formatCurrency(d.value) : '-'}</span>
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <small class="text-muted d-block">Expected Revenue</small>
                                            <span class="fw-bold text-success">${d.expected > 0 ? Utils.formatCurrency(d.expected) : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        }).join('')}
                </div>

                <!-- Section 3: Urgent Actions -->
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">⚠️ Urgent Actions — งบพร้อม แต่ Stage ต่ำ</h5>
                        <span class="badge bg-danger">${urgentActions.length} รายการ</span>
                    </div>
                    <div class="card-body p-0">
                        ${urgentActions.length > 0 ? `
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>โรงพยาบาล</th>
                                            <th class="text-center">ผลิตภัณฑ์</th>
                                            <th class="text-center">Budget</th>
                                            <th class="text-center">Stage</th>
                                            <th>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${urgentActions.map(opp => {
            const cust = Storage.getById('customers', opp.customerId);
            return `
                                                <tr style="cursor:pointer;" onclick="PipelineModule.renderDetail('${opp.id}')">
                                                    <td class="fw-bold">${cust?.name || 'Unknown'}</td>
                                                    <td class="text-center">${PipelineModule.renderProductGroupBadge(opp.productGroup || PipelineModule.getProductGroupKey(opp.product))}</td>
                                                    <td class="text-center">${PipelineModule.renderBudgetBadge(opp.budgetCode)}</td>
                                                    <td class="text-center">${PipelineModule.renderStageBadge(opp.stage)}</td>
                                                    <td>${opp.salesStatus || '-'}</td>
                                                </tr>`;
        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : '<div class="text-center py-4 text-muted">✅ ไม่มีรายการเร่งด่วน</div>'}
                    </div>
                </div>

                <!-- Section 4: Segment Summary -->
                <div class="row g-3">
                    ${segments.filter(seg => segmentData[seg.key].count > 0 || customers.some(c => c.type === seg.key)).map(seg => {
            const d = segmentData[seg.key];
            return `
                            <div class="col-md-3">
                                <div class="card h-100 text-center hover-card" onclick="BudgetDashboardModule.showSegmentProjects('${seg.key}')" style="cursor: pointer;">
                                    <div class="card-body">
                                        <div style="font-size:2rem;" class="mb-2">${seg.emoji}</div>
                                        <div class="fw-bold mb-3">${seg.name}</div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <small class="text-muted d-block">โครงการ</small>
                                                <span class="fw-bold fs-5">${d.count}</span>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">Pipeline</small>
                                                <span class="fw-bold text-primary">${d.value > 0 ? Utils.formatCurrency(d.value) : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        }).join('')}
                </div>
            </div>
        `;
    },

    showSegmentProjects(segmentKey) {
        const opportunities = Storage.get('opportunities') || [];
        const customers = Storage.get('customers') || [];

        const segments = [
            { key: 'army', name: 'กองทัพ', emoji: '🪖' },
            { key: 'government', name: 'รัฐบาล', emoji: '🏛️' },
            { key: 'private', name: 'เอกชน', emoji: '🏥' },
            { key: 'clinic', name: 'คลินิก', emoji: '🏪' }
        ];
        const seg = segments.find(s => s.key === segmentKey);
        if (!seg) return;

        const custIds = customers.filter(c => c.type === segmentKey).map(c => c.id);
        const opps = opportunities.filter(o => custIds.includes(o.customerId));

        const modalHtml = `
            <div class="modal fade" id="segmentProjectsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${seg.emoji} โครงการหมวด ${seg.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            ${opps.length > 0 ? `
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>โรงพยาบาล</th>
                                                <th class="text-center">ผลิตภัณฑ์</th>
                                                <th class="text-center">Budget</th>
                                                <th class="text-center">Stage</th>
                                                <th class="text-end pe-3">มูลค่า (Pipeline)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${opps.map(opp => {
            const cust = Storage.getById('customers', opp.customerId);
            return `
                                                    <tr style="cursor:pointer;" onclick="const m = bootstrap.Modal.getInstance(document.getElementById('segmentProjectsModal')); if(m) m.hide(); setTimeout(() => PipelineModule.renderDetail('${opp.id}'), 300);">
                                                        <td class="fw-bold">${cust?.name || 'Unknown'}</td>
                                                        <td class="text-center">${PipelineModule.renderProductGroupBadge(opp.productGroup || PipelineModule.getProductGroupKey(opp.product))}</td>
                                                        <td class="text-center">${PipelineModule.renderBudgetBadge(opp.budgetCode)}</td>
                                                        <td class="text-center">${PipelineModule.renderStageBadge(opp.stage)}</td>
                                                        <td class="text-end pe-3">${Utils.formatCurrency(opp.value || 0)}</td>
                                                    </tr>`;
        }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : '<div class="text-center py-4 text-muted">ไม่พบโครงการในหมวดนี้</div>'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('segmentProjectsModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalEl = document.getElementById('segmentProjectsModal');
        const bsModal = new bootstrap.Modal(modalEl);

        modalEl.addEventListener('hidden.bs.modal', function () {
            modalEl.remove();
        });

        bsModal.show();
    }
};

BudgetDashboardModule.init();
console.log('✅ Budget Dashboard module loaded (v1.4)');
