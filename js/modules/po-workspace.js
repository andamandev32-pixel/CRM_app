// PO Workspace Module - Module 12 for STS v1.3

const POWorkspaceModule = {
    // Initialize module
    init() {
        console.log('🎯 PO Workspace module initialized');
    },

    // Render backlog
    renderBacklog() {
        const backlog = Storage.get('devBacklog');
        const stats = this.calculateBacklogStats(backlog);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-list-check"></i> Product Owner Workspace</h1>
                        <p class="text-muted mb-0">Dev Backlog & Feature Management</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('po-workspace')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-primary" onclick="alert('ฟีเจอร์เพิ่ม Backlog Item จะพัฒนาในขั้นตอนถัดไป')">
                            <i class="bi bi-plus-circle"></i> เพิ่ม Backlog
                        </button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Total Items</p>
                                <h3 class="text-primary">${stats.total}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">In Progress</p>
                                <h3 class="text-info">${stats.inProgress}</h3>
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
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">High Priority</p>
                                <h3 class="text-danger">${stats.highPriority}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Backlog Kanban -->
                <div class="row g-3">
                    ${this.renderBacklogColumn('backlog', 'Backlog', backlog.filter(b => b.status === 'backlog'))}
                    ${this.renderBacklogColumn('in-progress', 'In Progress', backlog.filter(b => b.status === 'in-progress'))}
                    ${this.renderBacklogColumn('testing', 'Testing', backlog.filter(b => b.status === 'testing'))}
                    ${this.renderBacklogColumn('completed', 'Completed', backlog.filter(b => b.status === 'completed'))}
                </div>
            </div>
        `;
    },

    // Calculate backlog stats
    calculateBacklogStats(backlog) {
        return {
            total: backlog.length,
            inProgress: backlog.filter(b => b.status === 'in-progress').length,
            completed: backlog.filter(b => b.status === 'completed').length,
            highPriority: backlog.filter(b => b.priority === 'high').length
        };
    },

    // Render backlog column
    renderBacklogColumn(status, title, items) {
        const colors = {
            'backlog': 'secondary',
            'in-progress': 'primary',
            'testing': 'warning',
            'completed': 'success'
        };

        return `
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header bg-${colors[status]} text-white">
                        <h6 class="mb-0">${title} (${items.length})</h6>
                    </div>
                    <div class="card-body" style="min-height: 400px; max-height: 600px; overflow-y: auto;">
                        ${items.length === 0 ?
                '<p class="text-muted text-center">ไม่มีรายการ</p>' :
                items.map(item => this.renderBacklogCard(item)).join('')
            }
                    </div>
                </div>
            </div>
        `;
    },

    // Render backlog card
    renderBacklogCard(item) {
        const priorityColors = {
            'high': 'danger',
            'medium': 'warning',
            'low': 'info'
        };

        return `
            <div class="card mb-2 shadow-sm">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <small class="text-muted">${item.id}</small>
                        <span class="badge bg-${priorityColors[item.priority]}">${item.priority}</span>
                    </div>
                    <h6 class="mb-2">${item.featureName}</h6>
                    <p class="small text-muted mb-2">${Utils.truncate(item.description, 60)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-person"></i> ${item.requestedBy}
                        </small>
                        <span class="badge bg-secondary">${item.category}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // Render feasibility
    renderFeasibility() {
        const feasibilityLogs = Storage.get('feasibilityLogs');

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <h1><i class="bi bi-clipboard-check"></i> Feasibility Assessment</h1>
                    <p class="text-muted mb-0">ประเมินความเป็นไปได้ของฟีเจอร์</p>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Requested By</th>
                                        <th>Effort</th>
                                        <th>Impact</th>
                                        <th>Feasibility</th>
                                        <th>Decision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${feasibilityLogs.map(log => `
                                        <tr>
                                            <td><strong>${log.featureName}</strong></td>
                                            <td>${log.requestedBy}</td>
                                            <td><span class="badge bg-${this.getEffortBadge(log.effortEstimate)}">${log.effortEstimate}</span></td>
                                            <td><span class="badge bg-${this.getImpactBadge(log.businessImpact)}">${log.businessImpact}</span></td>
                                            <td>${log.feasibilityScore}/10</td>
                                            <td><span class="badge ${Utils.getBadgeClass(log.decision)}">${log.decision}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get effort badge
    getEffortBadge(effort) {
        const badges = {
            'low': 'success',
            'medium': 'warning',
            'high': 'danger'
        };
        return badges[effort] || 'secondary';
    },

    // Get impact badge
    getImpactBadge(impact) {
        const badges = {
            'low': 'secondary',
            'medium': 'info',
            'high': 'success'
        };
        return badges[impact] || 'secondary';
    }
};

POWorkspaceModule.init();
console.log('✅ PO Workspace module loaded');
