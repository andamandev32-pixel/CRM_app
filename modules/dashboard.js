// Dashboard Module
// แสดงภาพรวมของระบบ KPI และข้อมูลสำคัญ

function renderDashboard() {
    const mainContent = document.getElementById('mainContent');

    // Calculate KPIs
    const myOpportunities = appData.opportunities.filter(o => o.assignedTo === currentUser.id);
    const totalPipelineValue = myOpportunities.reduce((sum, o) => sum + o.value, 0);
    const myFollowUps = appData.followUps.filter(f => f.assignedTo === currentUser.id && f.status === 'pending');
    const overdueFollowUps = appData.followUps.filter(f => f.assignedTo === currentUser.id && f.status === 'overdue');
    const myDemos = appData.demoRequests.filter(d => d.createdBy === currentUser.id && d.status === 'approved');

    // Hot opportunities
    const hotOpportunities = myOpportunities
        .filter(o => o.interest === 'hot')
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Upcoming visits
    const upcomingVisits = appData.visitPlanItems
        .filter(v => {
            const visitDate = new Date(v.visitDate);
            const today = new Date();
            const diffDays = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 14;
        })
        .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
        .slice(0, 5);

    mainContent.innerHTML = `
        <!-- KPI Cards -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">💼 Pipeline ของฉัน</div>
                <div class="kpi-value">${formatNumber(myOpportunities.length)}</div>
                <div class="text-sm" style="color: var(--gray-600);">
                    มูลค่า ${formatCurrency(totalPipelineValue)}
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-label">⏰ Follow-up ค้าง</div>
                <div class="kpi-value" style="color: ${overdueFollowUps.length > 0 ? 'var(--danger)' : 'var(--success)'};">
                    ${formatNumber(myFollowUps.length + overdueFollowUps.length)}
                </div>
                <div class="text-sm" style="color: var(--danger);">
                    ${overdueFollowUps.length > 0 ? `เกินกำหนด ${overdueFollowUps.length} รายการ` : 'ไม่มีรายการเกินกำหนด'}
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-label">🔬 Demo/Trial ที่ดำเนินอยู่</div>
                <div class="kpi-value">${formatNumber(myDemos.length)}</div>
                <div class="text-sm" style="color: var(--gray-600);">
                    ทั้งหมด ${myDemos.filter(d => d.type === 'trial').length} Trial
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-label">🔥 Hot Opportunities</div>
                <div class="kpi-value">${formatNumber(hotOpportunities.length)}</div>
                <div class="text-sm" style="color: var(--gray-600);">
                    มูลค่า ${formatCurrency(hotOpportunities.reduce((sum, o) => sum + o.value, 0))}
                </div>
            </div>
        </div>
        
        <!-- Main Dashboard Content -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); margin-top: var(--spacing-xl);">
            <!-- Hot Opportunities -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🔥 Hot Opportunities</h3>
                    <a href="#pipeline" class="btn btn-sm btn-secondary" onclick="loadPage('pipeline')">ดูทั้งหมด</a>
                </div>
                <div class="card-body">
                    ${hotOpportunities.length > 0 ? `
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ลูกค้า</th>
                                        <th>สินค้า</th>
                                        <th>มูลค่า</th>
                                        <th>Stage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${hotOpportunities.map(opp => `
                                        <tr style="cursor: pointer;" onclick="viewOpportunity('${opp.id}')">
                                            <td>
                                                <div class="font-semibold">${getCustomerName(opp.customerId)}</div>
                                            </td>
                                            <td>${getTypeBadge(opp.product)}</td>
                                            <td class="font-semibold">${formatCurrency(opp.value)}</td>
                                            <td><span class="badge badge-purple">${opp.stage}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<div class="text-center" style="padding: var(--spacing-xl); color: var(--gray-500);">ไม่มี Hot Opportunities</div>'}
                </div>
            </div>
            
            <!-- Upcoming Visits -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📅 การเข้าพบที่กำลังจะมาถึง</h3>
                    <a href="#visit-plan" class="btn btn-sm btn-secondary" onclick="loadPage('visit-plan')">ดูทั้งหมด</a>
                </div>
                <div class="card-body">
                    ${upcomingVisits.length > 0 ? `
                        ${upcomingVisits.map(visit => {
        const visitDate = new Date(visit.visitDate);
        const today = new Date();
        const diffDays = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24));
        const isToday = diffDays === 0;
        const isTomorrow = diffDays === 1;

        return `
                                <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
                                    <div style="flex: 1;">
                                        <div class="font-semibold">${getCustomerName(visit.customerId)}</div>
                                        <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                                            ${visit.purpose}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="font-semibold ${isToday ? 'text-danger' : isTomorrow ? 'text-warning' : ''}" style="color: ${isToday ? 'var(--danger)' : isTomorrow ? 'var(--warning)' : 'var(--gray-700)'};">
                                            ${formatDate(visit.visitDate)}
                                        </div>
                                        <div class="text-xs" style="color: var(--gray-500); margin-top: 0.25rem;">
                                            ${isToday ? 'วันนี้' : isTomorrow ? 'พรุ่งนี้' : `อีก ${diffDays} วัน`}
                                        </div>
                                    </div>
                                </div>
                            `;
    }).join('')}
                    ` : '<div class="text-center" style="padding: var(--spacing-xl); color: var(--gray-500);">ไม่มีการเข้าพบที่กำลังจะมาถึง</div>'}
                </div>
            </div>
        </div>
        
        <!-- Follow-up Section -->
        <div class="card" style="margin-top: var(--spacing-xl);">
            <div class="card-header">
                <h3 class="card-title">⏰ Follow-up ที่ต้องดำเนินการ</h3>
                <a href="#followup" class="btn btn-sm btn-secondary" onclick="loadPage('followup')">ดูทั้งหมด</a>
            </div>
            <div class="card-body">
                ${overdueFollowUps.length > 0 ? `
                    <div style="margin-bottom: var(--spacing-lg);">
                        <h4 style="color: var(--danger); font-weight: 600; margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: 0.5rem;">
                            🔴 เกินกำหนด (${overdueFollowUps.length})
                        </h4>
                        ${overdueFollowUps.map(fu => `
                            <div style="padding: var(--spacing-md); background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--danger); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
                                <div class="flex justify-between items-center">
                                    <div style="flex: 1;">
                                        <div class="font-semibold">${getCustomerName(fu.customerId)}</div>
                                        <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">${fu.action}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-sm" style="color: var(--danger);">กำหนด: ${formatDate(fu.deadline)}</div>
                                        <button class="btn btn-sm btn-success" style="margin-top: 0.5rem;" onclick="markFollowUpDone('${fu.id}')">
                                            ✓ ทำแล้ว
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${myFollowUps.length > 0 ? `
                    <div>
                        <h4 style="color: var(--warning); font-weight: 600; margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: 0.5rem;">
                            🟡 รอดำเนินการ (${myFollowUps.length})
                        </h4>
                        ${myFollowUps.slice(0, 5).map(fu => `
                            <div style="padding: var(--spacing-md); background: rgba(245, 158, 11, 0.05); border-left: 3px solid var(--warning); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
                                <div class="flex justify-between items-center">
                                    <div style="flex: 1;">
                                        <div class="font-semibold">${getCustomerName(fu.customerId)}</div>
                                        <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">${fu.action}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="text-sm" style="color: var(--gray-700);">กำหนด: ${formatDate(fu.deadline)}</div>
                                        <button class="btn btn-sm btn-success" style="margin-top: 0.5rem;" onclick="markFollowUpDone('${fu.id}')">
                                            ✓ ทำแล้ว
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : (overdueFollowUps.length === 0 ? '<div class="text-center" style="padding: var(--spacing-xl); color: var(--gray-500);">✅ ไม่มี Follow-up ค้าง ทำงานได้ดีมาก!</div>' : '')}
            </div>
        </div>
        
        <!-- Process Flow Guide (Moved to Bottom) -->
        <div style="margin-top: var(--spacing-xl);">
            ${renderProcessFlow('visit-workflow')}
        </div>
        
        <!-- Scroll Navigation Buttons -->
        ${renderScrollButtons()}
    `;
}

// Mark follow-up as done
function markFollowUpDone(followUpId) {
    const followUp = appData.followUps.find(f => f.id === followUpId);
    if (followUp) {
        followUp.status = 'done';
        saveData('followUps', appData.followUps);

        // Reload dashboard
        renderDashboard();
        updateNotificationCount();

        // Show success message
        alert('✅ บันทึกสำเร็จ: Follow-up ทำเสร็จแล้ว');
    }
}

// View opportunity detail
function viewOpportunity(opportunityId) {
    loadPage('pipeline');
    // In a full implementation, this would open the opportunity detail panel
}

console.log('✅ Dashboard module loaded');
