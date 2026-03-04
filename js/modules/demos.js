// Demos Module - Demo & Trial Management for STS v1.3

const DemosModule = {
    // Initialize module
    init() {
        console.log('🖥️ Demos module initialized');
    },

    // Render demo/trial list
    renderList() {
        const demos = Storage.get('demoRequests');
        const stats = this.getDemoStats(demos);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-display"></i> Demo & Trial Management</h1>
                        <p class="text-muted mb-0">จัดการคำขอ Demo และ Trial</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('demos')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-primary" onclick="Router.navigate('#/demos/new')">
                            <i class="bi bi-plus-circle"></i> ขอ Demo/Trial ใหม่
                        </button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">ทั้งหมด</p>
                                        <h3>${stats.total}</h3>
                                    </div>
                                    <i class="bi bi-display fs-1 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">รออนุมัติ</p>
                                        <h3 class="text-warning">${stats.pending}</h3>
                                    </div>
                                    <i class="bi bi-clock-history fs-1 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">อนุมัติแล้ว</p>
                                        <h3 class="text-success">${stats.approved}</h3>
                                    </div>
                                    <i class="bi bi-check-circle fs-1 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">Trial</p>
                                        <h3 class="text-info">${stats.trial}</h3>
                                    </div>
                                    <i class="bi bi-laptop fs-1 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#all">
                            ทั้งหมด (${demos.length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#demo">
                            Demo (${demos.filter(d => d.type === 'demo').length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#trial">
                            Trial (${demos.filter(d => d.type === 'trial').length})
                        </a>
                    </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="all">
                        ${this.renderDemoTable(demos)}
                    </div>
                    <div class="tab-pane fade" id="demo">
                        ${this.renderDemoTable(demos.filter(d => d.type === 'demo'))}
                    </div>
                    <div class="tab-pane fade" id="trial">
                        ${this.renderDemoTable(demos.filter(d => d.type === 'trial'))}
                    </div>
                </div>
            </div>
        `;
    },

    // Render demo table
    renderDemoTable(demos) {
        if (demos.length === 0) {
            return `
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="text-muted mt-3">ไม่มีรายการ</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ลูกค้า</th>
                                    <th>ประเภท</th>
                                    <th>สินค้า</th>
                                    <th>ระยะเวลา</th>
                                    <th>ค่าใช้จ่าย</th>
                                    <th>สถานะ</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${demos.map(demo => {
            const customer = Storage.getById('customers', demo.customerId);
            const statusLabels = {
                'draft': 'ร่าง',
                'pending_l1': 'รออนุมัติ L1',
                'pending_l2': 'รออนุมัติ L2',
                'approved': 'อนุมัติแล้ว',
                'rejected': 'ไม่อนุมัติ'
            };

            return `
                                        <tr>
                                            <td><code>${demo.id}</code></td>
                                            <td><strong>${customer?.name || '-'}</strong></td>
                                            <td><span class="badge ${demo.type === 'trial' ? 'bg-info' : 'bg-secondary'}">${demo.type.toUpperCase()}</span></td>
                                            <td>${demo.product}</td>
                                            <td>
                                                ${Utils.formatDate(demo.startDate, 'short')} - 
                                                ${Utils.formatDate(demo.endDate, 'short')}
                                            </td>
                                            <td>${Utils.formatCurrency(demo.totalCost)}</td>
                                            <td><span class="badge ${Utils.getBadgeClass(demo.status)}">${statusLabels[demo.status] || demo.status}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-primary" onclick="Router.navigate('#/demos/${demo.id}')">
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

    // Get demo statistics
    getDemoStats(demos) {
        return {
            total: demos.length,
            pending: demos.filter(d => d.status.includes('pending')).length,
            approved: demos.filter(d => d.status === 'approved').length,
            trial: demos.filter(d => d.type === 'trial').length
        };
    }
};

DemosModule.init();
console.log('✅ Demos module loaded');
