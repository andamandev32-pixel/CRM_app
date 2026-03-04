// Notifications Module
function renderNotifications() {
    loadNotifications();
}

// Approval Module
function renderApproval() {
    const mainContent = document.getElementById('mainContent');

    const pendingVisitPlans = appData.visitPlans.filter(p => p.status === 'pending');
    const pendingDemos = appData.demoRequests.filter(d => d.status === 'pending_l1' || d.status === 'pending_l2');

    mainContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">รออนุมัติ</h3>
            </div>
            <div class="card-body">
                ${pendingVisitPlans.length > 0 ? `
                    <h4 style="margin-bottom: var(--spacing-md);">📅 แผนการเข้าพบ (${pendingVisitPlans.length})</h4>
                    ${pendingVisitPlans.map(plan => `
                        <div class="card" style="margin-bottom: var(--spacing-md);">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-semibold">${getUserName(plan.salesId)} - ${plan.month}/${plan.year}</div>
                                    <div class="text-sm" style="color: var(--gray-600);">
                                        งบประมาณ: ${formatCurrency(plan.totalBudget)}
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="btn btn-sm btn-success">อนุมัติ</button>
                                    <button class="btn btn-sm btn-danger">ส่งกลับ</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
                
                ${pendingDemos.length > 0 ? `
                    <h4 style="margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md);">🔬 Demo/Trial (${pendingDemos.length})</h4>
                    ${pendingDemos.map(demo => `
                        <div class="card" style="margin-bottom: var(--spacing-md);">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-semibold">${getCustomerName(demo.customerId)}</div>
                                    <div class="text-sm" style="color: var(--gray-600);">
                                        ${getTypeBadge(demo.type)} ${getTypeBadge(demo.product)} - ${formatCurrency(demo.totalCost)}
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="btn btn-sm btn-success">อนุมัติ</button>
                                    <button class="btn btn-sm btn-danger">ปฏิเสธ</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
                
                ${pendingVisitPlans.length === 0 && pendingDemos.length === 0 ? `
                    <div class="text-center" style="padding: var(--spacing-xl); color: var(--gray-500);">
                        ✅ ไม่มีรายการรออนุมัติ
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

console.log('✅ Notifications and Approval modules loaded');
