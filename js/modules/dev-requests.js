// Dev Requests Module - Module 9 for STS v1.3

const DevRequestsModule = {
    // Initialize module
    init() {
        console.log('💻 Dev Requests module initialized');
    },

    // Render dev requests list
    renderList() {
        const devRequests = Storage.get('devRequests');
        const strategicPricings = Storage.get('strategicPricings');
        const stats = this.calculateStats(devRequests, strategicPricings);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-code-slash"></i> Dev Request & Strategic Pricing</h1>
                        <p class="text-muted mb-0">ขอประเมินราคาและอนุมัติราคาพิเศษ</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('dev-requests')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-primary" onclick="alert('ฟีเจอร์เพิ่ม Dev Request จะพัฒนาในขั้นตอนถัดไป')">
                            <i class="bi bi-plus-circle"></i> ขอประเมินราคา
                        </button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Total Requests</p>
                                <h3 class="text-primary">${stats.totalRequests}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Pending Response</p>
                                <h3 class="text-warning">${stats.pendingResponse}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Strategic Pricing</p>
                                <h3 class="text-danger">${stats.strategicCount}</h3>
                                <small class="text-muted">${Utils.formatCurrency(stats.strategicValue)}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Pending Approval</p>
                                <h3 class="text-info">${stats.pendingApproval}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#devRequests">
                            Dev Requests (${devRequests.length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#strategicPricing">
                            Strategic Pricing (${strategicPricings.length})
                        </a>
                    </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="devRequests">
                        ${this.renderDevRequestsTable(devRequests)}
                    </div>
                    <div class="tab-pane fade" id="strategicPricing">
                        ${this.renderStrategicPricingTable(strategicPricings)}
                    </div>
                </div>
            </div>
        `;
    },

    // Calculate stats
    calculateStats(devRequests, strategicPricings) {
        return {
            totalRequests: devRequests.length,
            pendingResponse: devRequests.filter(r => r.status === 'pending').length,
            strategicCount: strategicPricings.length,
            strategicValue: strategicPricings.reduce((sum, s) => sum + (s.gapAmount || 0), 0),
            pendingApproval: strategicPricings.filter(s => s.approvalStatus.includes('pending')).length
        };
    },

    // Render dev requests table
    renderDevRequestsTable(devRequests) {
        if (devRequests.length === 0) {
            return '<div class="card"><div class="card-body text-center py-3 text-muted">ไม่มี Dev Requests</div></div>';
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Requirement</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${devRequests.map(req => {
            const customer = Storage.getById('customers', req.customerId);
            return `
                                        <tr>
                                            <td><strong>${req.id}</strong></td>
                                            <td>${Utils.formatDate(req.createdAt, 'short')}</td>
                                            <td>${customer?.name || 'Unknown'}</td>
                                            <td>${req.product}</td>
                                            <td>${Utils.truncate(req.requirement, 50)}</td>
                                            <td><span class="badge ${Utils.getBadgeClass(req.status)}">${req.status}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // Render strategic pricing table
    renderStrategicPricingTable(strategicPricings) {
        if (strategicPricings.length === 0) {
            return '<div class="card"><div class="card-body text-center py-3 text-muted">ไม่มี Strategic Pricing</div></div>';
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Sale Price</th>
                                    <th>Cost</th>
                                    <th>Gap</th>
                                    <th>Approval Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${strategicPricings.map(sp => {
            const customer = Storage.getById('customers', sp.customerId);
            return `
                                        <tr>
                                            <td><strong>${sp.id}</strong></td>
                                            <td>${Utils.formatDate(sp.createdAt, 'short')}</td>
                                            <td>${customer?.name || 'Unknown'}</td>
                                            <td>${sp.product}</td>
                                            <td class="text-primary"><strong>${Utils.formatCurrency(sp.salePrice)}</strong></td>
                                            <td>${Utils.formatCurrency(sp.totalCost)}</td>
                                            <td class="text-danger"><strong>${Utils.formatCurrency(sp.gapAmount)}</strong></td>
                                            <td><span class="badge ${this.getApprovalBadge(sp.approvalStatus)}">${sp.approvalStatus}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // Get approval badge class
    getApprovalBadge(status) {
        const badges = {
            'pending-L1': 'bg-warning',
            'pending-L2': 'bg-info',
            'approved': 'bg-success',
            'rejected': 'bg-danger'
        };
        return badges[status] || 'bg-secondary';
    }
};

DevRequestsModule.init();
console.log('✅ Dev Requests module loaded');
