// Customer Insights Module - Module 5 for STS v1.3

const InsightsModule = {
    // Initialize module
    init() {
        console.log('💡 Customer Insights module initialized');
    },

    // Render insights list
    renderList() {
        const insights = Storage.get('customerInsights');
        const stats = this.calculateStats(insights);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-lightbulb"></i> Customer Insights</h1>
                        <p class="text-muted mb-0">ข้อมูลเชิงลึกและความต้องการของลูกค้า</p>
                    </div>
                    <button class="btn btn-primary" onclick="alert('ฟีเจอร์เพิ่ม Insight จะพัฒนาในขั้นตอนถัดไป')">
                        <i class="bi bi-plus-circle"></i> เพิ่ม Insight
                    </button>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Total Insights</p>
                                <h3 class="text-primary">${stats.total}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Pending Dev</p>
                                <h3 class="text-warning">${stats.pendingDev}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">In Development</p>
                                <h3 class="text-info">${stats.inDev}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Completed</p>
                                <h3 class="text-success">${stats.completed}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Insights Table -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-list"></i> Insights List</h5>
                    </div>
                    <div class="card-body">
                        ${this.renderInsightsTable(insights)}
                    </div>
                </div>
            </div>
        `;
    },

    // Calculate stats
    calculateStats(insights) {
        return {
            total: insights.length,
            pendingDev: insights.filter(i => i.devStatus === 'pending').length,
            inDev: insights.filter(i => i.devStatus === 'in-progress').length,
            completed: insights.filter(i => i.devStatus === 'completed').length
        };
    },

    // Render insights table
    renderInsightsTable(insights) {
        if (insights.length === 0) {
            return '<p class="text-muted text-center py-3">ไม่มี Insights</p>';
        }

        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Category</th>
                            <th>Insight</th>
                            <th>Priority</th>
                            <th>Dev Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${insights.map(insight => {
            const customer = Storage.getById('customers', insight.customerId);
            return `
                                <tr>
                                    <td>${Utils.formatDate(insight.createdAt, 'short')}</td>
                                    <td><strong>${customer?.name || 'Unknown'}</strong></td>
                                    <td><span class="badge bg-info">${insight.category}</span></td>
                                    <td>${Utils.truncate(insight.insight, 60)}</td>
                                    <td><span class="badge ${Utils.getBadgeClass(insight.priority)}">${insight.priority}</span></td>
                                    <td><span class="badge ${this.getDevStatusBadge(insight.devStatus)}">${insight.devStatus}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="alert('View detail')">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Get dev status badge class
    getDevStatusBadge(status) {
        const badges = {
            'pending': 'bg-warning',
            'in-progress': 'bg-info',
            'completed': 'bg-success',
            'rejected': 'bg-danger'
        };
        return badges[status] || 'bg-secondary';
    }
};

InsightsModule.init();
console.log('✅ Insights module loaded');
