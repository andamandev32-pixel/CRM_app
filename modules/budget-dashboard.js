// Budget Control Dashboard Module v1.4
// Module 13 — Sales Pipeline & Budget Control Dashboard

function renderBudgetDashboard() {
    const mainContent = document.getElementById('mainContent');
    const opportunities = appData.opportunities || [];
    const customers = appData.customers || [];
    const stages = ForecastEngine.getAllStages();
    const budgetCodes = ForecastEngine.getAllBudgetCodes();

    // Build heatmap data: budgetCode × stage
    const heatmapData = {};
    budgetCodes.forEach(b => {
        heatmapData[b] = {};
        stages.forEach(s => {
            const opps = opportunities.filter(o => (o.budgetCode || 'B0') === b && o.stage === s);
            heatmapData[b][s] = {
                count: opps.length,
                value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
                expected: opps.reduce((sum, o) => sum + ForecastEngine.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
            };
        });
    });

    // Product group breakdown
    const groupKeys = Object.keys(ForecastEngine.productGroups);
    const groupData = {};
    groupKeys.forEach(key => {
        const opps = opportunities.filter(o => (o.productGroup || ForecastEngine.getProductGroup(o.product)) === key);
        groupData[key] = {
            count: opps.length,
            value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
            expected: opps.reduce((sum, o) => sum + ForecastEngine.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
        };
    });

    // Segment (customer type) breakdown
    const segments = [
        { key: 'army', name: 'กองทัพ', emoji: '🪖' },
        { key: 'government', name: 'รัฐบาล', emoji: '🏛️' },
        { key: 'private', name: 'เอกชน', emoji: '🏥' }
    ];
    const segmentData = {};
    segments.forEach(seg => {
        const custIds = customers.filter(c => c.type === seg.key).map(c => c.id);
        const opps = opportunities.filter(o => custIds.includes(o.customerId));
        segmentData[seg.key] = {
            count: opps.length,
            value: opps.reduce((sum, o) => sum + (o.value || 0), 0),
            expected: opps.reduce((sum, o) => sum + ForecastEngine.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'B0'), 0)
        };
    });

    // Urgent actions: B3/B4 but stage < S5
    const urgentActions = ForecastEngine.getUrgentActions(opportunities);

    mainContent.innerHTML = `
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-lg);">💰 Budget Control Dashboard</h2>

        <!-- Section 1: Budget × Stage Heatmap -->
        <div class="card">
            <div class="card-header"><h3 class="card-title">📊 Budget Readiness × Sales Stage Heatmap</h3></div>
            <div class="card-body" style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                    <thead>
                        <tr>
                            <th style="padding:8px; border:1px solid var(--gray-200); background:var(--gray-100);">Budget \\ Stage</th>
                            ${stages.map(s => `<th style="padding:6px; border:1px solid var(--gray-200); background:${ForecastEngine.stageColors[s]}20; color:var(--gray-800); text-align:center; font-size:0.7rem;">${s}<br>${ForecastEngine.stageNames[s]}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${budgetCodes.map(b => {
        const bl = ForecastEngine.budgetLabels[b];
        return `<tr>
                                <td style="padding:8px; border:1px solid var(--gray-200); background:${bl.color}15; font-weight:600;">
                                    ${bl.emoji} ${b}: ${bl.name}
                                </td>
                                ${stages.map(s => {
            const cell = heatmapData[b][s];
            const intensity = cell.count > 0 ? Math.min(cell.count * 30 + 20, 100) : 0;
            const bg = cell.count > 0 ? `hsla(250, 80%, 60%, ${intensity / 100 * 0.3})` : 'transparent';
            return `<td style="padding:6px; border:1px solid var(--gray-200); text-align:center; background:${bg}; cursor:${cell.count > 0 ? 'pointer' : 'default'};" ${cell.count > 0 ? `title="${cell.count} รายการ, มูลค่า ${(cell.value / 1000000).toFixed(1)}M"` : ''}>
                                        ${cell.count > 0 ? `<div class="font-semibold">${cell.count}</div><div class="text-xs" style="color:var(--gray-600);">${cell.value > 0 ? (cell.value / 1000000).toFixed(1) + 'M' : '-'}</div>` : '<span style="color:var(--gray-300);">—</span>'}
                                    </td>`;
        }).join('')}
                            </tr>`;
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 2: Product Group Breakdown -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-md); margin-top: var(--spacing-lg);">
            ${groupKeys.map(key => {
        const g = ForecastEngine.productGroups[key];
        const d = groupData[key];
        return `
                    <div class="card" style="margin:0; padding: var(--spacing-lg); border-left: 4px solid ${g.color};">
                        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:var(--spacing-md);">
                            <span style="font-size:1.5rem;">${g.emoji}</span>
                            <span class="font-semibold">${g.name}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm);">
                            <div>
                                <div class="text-xs" style="color:var(--gray-500);">โครงการ</div>
                                <div class="font-semibold" style="font-size:1.25rem;">${d.count}</div>
                            </div>
                            <div>
                                <div class="text-xs" style="color:var(--gray-500);">Pipeline</div>
                                <div class="font-semibold" style="color:${g.color};">${d.value > 0 ? formatCurrency(d.value) : '-'}</div>
                            </div>
                        </div>
                        <div style="margin-top:var(--spacing-sm);">
                            <div class="text-xs" style="color:var(--gray-500);">Expected Revenue</div>
                            <div class="font-semibold" style="color:#22C55E;">${d.expected > 0 ? formatCurrency(d.expected) : '-'}</div>
                        </div>
                    </div>`;
    }).join('')}
        </div>

        <!-- Section 3: Urgent Actions -->
        <div class="card" style="margin-top: var(--spacing-lg);">
            <div class="card-header">
                <h3 class="card-title">⚠️ Urgent Actions — งบพร้อม แต่ Stage ต่ำ</h3>
                <span class="badge badge-danger">${urgentActions.length} รายการ</span>
            </div>
            <div class="card-body">
                ${urgentActions.length > 0 ? `
                    <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                        <thead>
                            <tr style="background:var(--gray-50);">
                                <th style="padding:8px; text-align:left; border-bottom:2px solid var(--gray-200);">โรงพยาบาล</th>
                                <th style="padding:8px; text-align:center; border-bottom:2px solid var(--gray-200);">ผลิตภัณฑ์</th>
                                <th style="padding:8px; text-align:center; border-bottom:2px solid var(--gray-200);">Budget</th>
                                <th style="padding:8px; text-align:center; border-bottom:2px solid var(--gray-200);">Stage</th>
                                <th style="padding:8px; text-align:left; border-bottom:2px solid var(--gray-200);">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${urgentActions.map(opp => `
                                <tr style="cursor:pointer;" onclick="viewOpportunityDetail('${opp.id}')">
                                    <td style="padding:8px; border-bottom:1px solid var(--gray-100);">${getCustomerName(opp.customerId)}</td>
                                    <td style="padding:8px; text-align:center; border-bottom:1px solid var(--gray-100);">${ForecastEngine.renderProductGroupBadge(opp.productGroup || 'Custom')}</td>
                                    <td style="padding:8px; text-align:center; border-bottom:1px solid var(--gray-100);">${ForecastEngine.renderBudgetBadge(opp.budgetCode)}</td>
                                    <td style="padding:8px; text-align:center; border-bottom:1px solid var(--gray-100);">${ForecastEngine.renderStageBadge(opp.stage)}</td>
                                    <td style="padding:8px; border-bottom:1px solid var(--gray-100);">${opp.salesStatus || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<div style="text-align:center;padding:var(--spacing-xl);color:var(--gray-400);">✅ ไม่มีรายการเร่งด่วน</div>'}
            </div>
        </div>

        <!-- Section 4: Segment Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-md); margin-top: var(--spacing-lg);">
            ${segments.map(seg => {
        const d = segmentData[seg.key];
        return `
                    <div class="card" style="margin:0; padding: var(--spacing-lg); text-align:center;">
                        <div style="font-size:2rem; margin-bottom:var(--spacing-sm);">${seg.emoji}</div>
                        <div class="font-semibold" style="margin-bottom:var(--spacing-md);">${seg.name}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm);">
                            <div>
                                <div class="text-xs" style="color:var(--gray-500);">โครงการ</div>
                                <div class="font-semibold" style="font-size:1.5rem;">${d.count}</div>
                            </div>
                            <div>
                                <div class="text-xs" style="color:var(--gray-500);">Pipeline</div>
                                <div class="font-semibold" style="color:var(--primary-purple);">${d.value > 0 ? formatCurrency(d.value) : '-'}</div>
                            </div>
                        </div>
                    </div>`;
    }).join('')}
        </div>
    `;
}

console.log('✅ Budget Dashboard module loaded (v1.4)');
