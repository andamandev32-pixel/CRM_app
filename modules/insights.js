// Customer Insights Module
function renderInsights() {
    const mainContent = document.getElementById('mainContent');

    const highPriority = appData.customerInsights.filter(i => i.priority === 'high');
    const mediumPriority = appData.customerInsights.filter(i => i.priority === 'medium');
    const lowPriority = appData.customerInsights.filter(i => i.priority === 'low');

    mainContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Customer Insights</h3>
            </div>
            <div class="card-body">
                ${highPriority.length > 0 ? `
                    <h4 style="color: var(--danger); margin-bottom: var(--spacing-md);">🔴 ความสำคัญสูง</h4>
                    ${highPriority.map(insight => `
                        <div class="card" style="margin-bottom: var(--spacing-md); border-left: 3px solid var(--danger);">
                            <div class="flex justify-between">
                                <div style="flex: 1;">
                                    <div class="flex gap-2 items-center">
                                        ${getTypeBadge(insight.product)}
                                        ${getStatusBadge(insight.status)}
                                    </div>
                                    <div class="font-semibold" style="margin-top: var(--spacing-sm);">${insight.description}</div>
                                    <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                                        พบใน ${insight.frequency} หน่วยงาน
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
                
                ${mediumPriority.length > 0 ? `
                    <h4 style="color: var(--warning); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md);">🟡 ความสำคัญกลาง</h4>
                    ${mediumPriority.map(insight => `
                        <div class="card" style="margin-bottom: var(--spacing-md); border-left: 3px solid var(--warning);">
                            <div class="flex gap-2 items-center">
                                ${getTypeBadge(insight.product)}
                                ${getStatusBadge(insight.status)}
                            </div>
                            <div class="font-semibold" style="margin-top: var(--spacing-sm);">${insight.description}</div>
                            <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                                พบใน ${insight.frequency} หน่วยงาน
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
                
                ${lowPriority.length > 0 ? `
                    <h4 style="color: var(--success); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md);">🟢 ความสำคัญต่ำ</h4>
                    ${lowPriority.map(insight => `
                        <div class="card" style="margin-bottom: var(--spacing-md); border-left: 3px solid var(--success);">
                            <div class="flex gap-2 items-center">
                                ${getTypeBadge(insight.product)}
                                ${getStatusBadge(insight.status)}
                            </div>
                            <div class="font-semibold" style="margin-top: var(--spacing-sm);">${insight.description}</div>
                            <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                                พบใน ${insight.frequency} หน่วยงาน
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
            </div>
        </div>
        
        <!-- Process Flow Guide (Moved to Bottom) -->
        <div style="margin-top: var(--spacing-xl);">
            ${renderProcessFlow('insight-workflow')}
        </div>
        
        <!-- Scroll Navigation Buttons -->
        ${renderScrollButtons()}
    `;
}

console.log('✅ Insights module loaded');
