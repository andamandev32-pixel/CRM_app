// Sales Pipeline Module v1.4
// จัดการ Opportunities และ Sales Pipeline — รองรับ S0-S9, B0-B4, Product Groups

function renderPipeline() {
    const mainContent = document.getElementById('mainContent');
    const opportunities = appData.opportunities;
    const stages = ForecastEngine.getAllStages();

    // Group by stage
    const oppsByStage = {};
    stages.forEach(stage => {
        oppsByStage[stage] = opportunities.filter(o => o.stage === stage);
    });

    // Pipeline summary
    const summary = ForecastEngine.getPipelineSummary(opportunities);

    mainContent.innerHTML = `
        <!-- Pipeline Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-xl);">
            <div class="card" style="margin:0; padding: var(--spacing-lg); text-align: center;">
                <div class="text-sm" style="color: var(--gray-600);">📊 Active Opportunities</div>
                <div class="font-semibold" style="font-size: 1.75rem; color: var(--primary-purple);">${summary.activeCount}</div>
            </div>
            <div class="card" style="margin:0; padding: var(--spacing-lg); text-align: center;">
                <div class="text-sm" style="color: var(--gray-600);">💰 Pipeline Value</div>
                <div class="font-semibold" style="font-size: 1.5rem; color: var(--primary-purple);">${formatCurrency(summary.totalValue)}</div>
            </div>
            <div class="card" style="margin:0; padding: var(--spacing-lg); text-align: center;">
                <div class="text-sm" style="color: var(--gray-600);">📈 Expected Revenue</div>
                <div class="font-semibold" style="font-size: 1.5rem; color: #22C55E;">${formatCurrency(summary.totalExpected)}</div>
                <div class="text-xs" style="color: var(--gray-500);">= Value × Stage Prob × Budget Weight</div>
            </div>
        </div>

        <!-- Pipeline Board -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Sales Pipeline (S0-S9)</h3>
                <button class="btn btn-primary" onclick="openAddOpportunityForm()">
                    + สร้าง Opportunity
                </button>
            </div>
            <div class="card-body">
                <!-- Kanban Board — scrollable -->
                <div style="display: flex; gap: var(--spacing-md); overflow-x: auto; padding-bottom: var(--spacing-md);">
                    ${stages.map(stage => {
        const opps = oppsByStage[stage];
        const totalValue = opps.reduce((sum, o) => sum + (o.value || 0), 0);
        const stageColor = ForecastEngine.stageColors[stage] || '#9CA3AF';
        const stageName = ForecastEngine.stageNames[stage] || stage;

        return `
                        <div style="background: var(--gray-50); border-radius: var(--radius-lg); padding: var(--spacing-md); min-width: 220px; flex-shrink: 0;">
                            <!-- Stage Header -->
                            <div style="margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-md); border-bottom: 3px solid ${stageColor};">
                                <div class="font-semibold" style="color: var(--gray-900); font-size: 0.85rem;">${stage}: ${stageName}</div>
                                <div class="text-xs" style="color: var(--gray-500);">${ForecastEngine.stageNamesTH[stage]}</div>
                                <div class="text-xs" style="color: var(--gray-600); margin-top: 0.25rem;">
                                    ${opps.length} รายการ | ${formatCurrency(totalValue)}
                                </div>
                                <div class="text-xs" style="color: var(--gray-500);">
                                    Prob: ${Math.round(ForecastEngine.getStageProbability(stage) * 100)}%
                                </div>
                            </div>
                            
                            <!-- Opportunity Cards -->
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                ${opps.map(opp => {
            const expectedRev = ForecastEngine.calculateExpectedRevenue(opp.value || 0, opp.stage, opp.budgetCode || 'B0');
            return `
                                    <div class="card" style="cursor: pointer; padding: var(--spacing-md); margin: 0;" onclick="viewOpportunityDetail('${opp.id}')">
                                        <div class="font-semibold text-sm" style="margin-bottom: 0.25rem;">${getCustomerName(opp.customerId)}</div>
                                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.5rem;">
                                            ${ForecastEngine.renderProductGroupBadge(opp.productGroup || ForecastEngine.getProductGroup(opp.product))}
                                            ${ForecastEngine.renderBudgetBadge(opp.budgetCode || 'B0')}
                                        </div>
                                        ${opp.value > 0 ? `<div class="font-semibold" style="color: var(--primary-purple);">${formatCurrency(opp.value)}</div>` : '<div class="text-xs" style="color:var(--gray-400);">ยังไม่ระบุมูลค่า</div>'}
                                        ${expectedRev > 0 ? `<div class="text-xs" style="color: #22C55E;">Expected: ${formatCurrency(expectedRev)}</div>` : ''}
                                        <div class="text-xs" style="color: var(--gray-500); margin-top: 0.25rem;">
                                            ${opp.salesStatus || ''}
                                        </div>
                                    </div>
                                `;
        }).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}
                </div>
            </div>
        </div>
        
        <!-- Process Flow Guide -->
        <div style="margin-top: var(--spacing-xl);">
            ${typeof renderProcessFlow === 'function' ? renderProcessFlow('pipeline-stages') : ''}
        </div>
        
        <!-- Scroll Navigation Buttons -->
        ${typeof renderScrollButtons === 'function' ? renderScrollButtons() : ''}
    `;
}

function openAddOpportunityForm() {
    const formContent = `
        <form onsubmit="saveOpportunity(event)">
            <div class="form-group">
                <label class="form-label required">ลูกค้า</label>
                <select class="form-select" name="customerId" required>
                    <option value="">เลือกลูกค้า</option>
                    ${appData.customers.map(c => `
                        <option value="${c.id}">${c.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label required">ผลิตภัณฑ์</label>
                <select class="form-select" name="product" required>
                    <option value="">เลือกผลิตภัณฑ์</option>
                    <option value="MediQ">MediQ (ระบบคิว)</option>
                    <option value="MediCore">MediCore (HIS)</option>
                    <option value="HIS">HIS</option>
                    <option value="ERP">ERP</option>
                    <option value="Custom">Custom Solutions</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label required">กลุ่มผลิตภัณฑ์</label>
                <select class="form-select" name="productGroup" required>
                    <option value="MEDIQ">🏥 MEDIQ Platform</option>
                    <option value="HIS">🖥️ MediCore</option>
                    <option value="ERP">📊 ERP</option>
                    <option value="Custom">🔧 Custom Solutions</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">มูลค่าที่คาดการณ์ (บาท)</label>
                <input type="number" class="form-input" name="value" min="0" step="1000"
                    placeholder="เช่น 3900000 (เว้นว่างถ้ายังไม่ทราบ)">
            </div>

            <div class="form-group">
                <label class="form-label required">Budget Readiness</label>
                <select class="form-select" name="budgetCode" required>
                    <option value="B0">💭 B0: Concept — ยังไม่มีงบ</option>
                    <option value="B1">📋 B1: Planned — อยู่ในแผน</option>
                    <option value="B2">💰 B2: Allocated — ตั้งงบแล้ว</option>
                    <option value="B3">✅ B3: Approved — งบอนุมัติ</option>
                    <option value="B4">🚀 B4: Direct Purchase — จัดซื้อตรง</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">ปีงบประมาณ</label>
                <input type="text" class="form-input" name="budgetYear" placeholder="เช่น 2569">
            </div>
            
            <div class="form-group">
                <label class="form-label required">Stage เริ่มต้น</label>
                <select class="form-select" name="stage" required>
                    ${ForecastEngine.getAllStages().map(s => `
                        <option value="${s}">${s}: ${ForecastEngine.stageNames[s]} — ${ForecastEngine.stageNamesTH[s]}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label required">วันที่คาดว่าจะปิด</label>
                <input type="date" class="form-input" name="expectedClose" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">ระดับความสนใจ</label>
                <select class="form-select" name="interest" required>
                    <option value="hot">🔴 Hot</option>
                    <option value="warm">🟡 Warm</option>
                    <option value="cold">🔵 Cold</option>
                </select>
            </div>
            
            <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl);">
                <button type="submit" class="btn btn-primary" style="flex: 1;">บันทึก</button>
                <button type="button" class="btn btn-secondary" onclick="closeDrawer()" style="flex: 1;">ยกเลิก</button>
            </div>
        </form>
    `;

    openDrawer('สร้าง Opportunity ใหม่', formContent);
}

function saveOpportunity(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const product = formData.get('product');
    const stage = formData.get('stage');
    const budgetCode = formData.get('budgetCode');
    const value = parseInt(formData.get('value') || '0');

    const newOpp = {
        id: generateId('OPP'),
        customerId: formData.get('customerId'),
        product: product,
        productGroup: formData.get('productGroup'),
        value: value,
        stage: stage,
        budgetCode: budgetCode,
        budgetYear: formData.get('budgetYear') || '',
        probability: Math.round(ForecastEngine.getStageProbability(stage) * 100),
        expectedClose: formData.get('expectedClose'),
        assignedTo: currentUser.id,
        interest: formData.get('interest'),
        salesStatus: '',
        detail: '',
        createdAt: new Date().toISOString().split('T')[0],
        stageHistory: [{
            stage: stage,
            date: new Date().toISOString().split('T')[0],
            reason: 'เริ่มต้น Opportunity'
        }]
    };

    appData.opportunities.push(newOpp);
    saveData('opportunities', appData.opportunities);

    closeDrawer();
    renderPipeline();
    alert('✅ สร้าง Opportunity สำเร็จ');
}

function viewOpportunityDetail(oppId) {
    const opp = appData.opportunities.find(o => o.id === oppId);
    if (!opp) return;

    const customer = appData.customers.find(c => c.id === opp.customerId);
    const expectedRev = ForecastEngine.calculateExpectedRevenue(opp.value || 0, opp.stage, opp.budgetCode || 'B0');

    const content = `
        <div style="margin-bottom: var(--spacing-xl);">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-md);">${customer ? customer.name : 'N/A'}</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${ForecastEngine.renderProductGroupBadge(opp.productGroup || 'Custom')}
                ${ForecastEngine.renderStageBadge(opp.stage)}
                ${ForecastEngine.renderBudgetBadge(opp.budgetCode || 'B0')}
                ${getStatusBadge(opp.interest)}
            </div>
        </div>
        
        <!-- Opportunity Info -->
        <div class="card">
            <div class="card-header"><h3 class="card-title">ข้อมูล Opportunity</h3></div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">มูลค่า</div>
                        <div class="font-semibold" style="font-size: 1.25rem; color: var(--primary-purple);">${opp.value > 0 ? formatCurrency(opp.value) : 'ยังไม่ระบุ'}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">Expected Revenue</div>
                        <div class="font-semibold" style="font-size: 1.25rem; color: #22C55E;">${formatCurrency(expectedRev)}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">ผลิตภัณฑ์</div>
                        <div class="font-semibold">${opp.product}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">Stage Probability</div>
                        <div class="font-semibold">${Math.round(ForecastEngine.getStageProbability(opp.stage) * 100)}%</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">Budget Weight</div>
                        <div class="font-semibold">${Math.round(ForecastEngine.getBudgetWeight(opp.budgetCode || 'B0') * 100)}%</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">ปีงบประมาณ</div>
                        <div class="font-semibold">${opp.budgetYear || 'ยังไม่ระบุ'}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">วันที่คาดว่าจะปิด</div>
                        <div class="font-semibold">${formatDate(opp.expectedClose)}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">พนักงานขาย</div>
                        <div class="font-semibold">${getUserName(opp.assignedTo)}</div>
                    </div>
                </div>
                ${opp.salesStatus ? `<div style="margin-top:var(--spacing-md);padding:var(--spacing-md);background:var(--gray-50);border-radius:var(--radius-md);"><div class="text-sm" style="color:var(--gray-600);">สถานะ Sale</div><div class="font-semibold">${opp.salesStatus}</div></div>` : ''}
                ${opp.detail ? `<div style="margin-top:var(--spacing-sm);padding:var(--spacing-md);background:var(--gray-50);border-radius:var(--radius-md);"><div class="text-sm" style="color:var(--gray-600);">รายละเอียด</div><div>${opp.detail}</div></div>` : ''}
            </div>
        </div>
        
        <!-- Stage History -->
        <div class="card" style="margin-top: var(--spacing-lg);">
            <div class="card-header"><h3 class="card-title">ประวัติ Stage</h3></div>
            <div class="card-body">
                ${(opp.stageHistory || []).map((history, index) => `
                    <div style="display: flex; gap: var(--spacing-md); padding: var(--spacing-md); ${index < (opp.stageHistory || []).length - 1 ? 'border-bottom: 1px solid var(--gray-200);' : ''}">
                        <div style="flex-shrink: 0; width: 32px; height: 32px; background: ${ForecastEngine.stageColors[history.stage] || 'var(--primary-gradient)'}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                            ${history.stage}
                        </div>
                        <div style="flex: 1;">
                            <div class="font-semibold">${history.stage}: ${ForecastEngine.stageNames[history.stage] || ''}</div>
                            <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">${history.reason}</div>
                            <div class="text-xs" style="color: var(--gray-500); margin-top: 0.25rem;">${formatDate(history.date)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    openDrawer(`Opportunity: ${customer ? customer.name : 'N/A'}`, content);
}

console.log('✅ Pipeline module loaded (v1.4 — S0-S9, B0-B4)');
