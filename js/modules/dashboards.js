// Dashboards Module - Executive, Sales, and Manager Dashboards for STS v1.3

const DashboardsModule = {
    // Initialize module
    init() {
        console.log('📊 Dashboards module initialized');
    },

    // Render executive dashboard
    renderExecutive() {
        const opportunities = Storage.get('opportunities');
        const customers = Storage.get('customers');
        const demos = Storage.get('demoRequests');
        const visits = Storage.get('visitReports');

        const stats = this.calculateExecutiveStats(opportunities, customers, demos, visits);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-speedometer2"></i> Executive Dashboard</h1>
                        <p class="text-muted mb-0">ภาพรวมธุรกิจและประสิทธิภาพการขาย</p>
                    </div>
                    <button class="btn btn-outline-info" onclick="HelpModule.showHelp('dashboard')" title="คู่มือการใช้งาน">
                        <i class="bi bi-question-circle"></i> คู่มือ
                    </button>
                </div>
                
                <!-- Key Metrics -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card border-primary">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Total Pipeline</p>
                                        <h2 class="text-primary mb-0">${Utils.formatCurrency(stats.totalPipeline)}</h2>
                                        <small class="text-success"><i class="bi bi-arrow-up"></i> +12% vs last month</small>
                                    </div>
                                    <i class="bi bi-graph-up-arrow fs-1 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-success">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Weighted Pipeline</p>
                                        <h2 class="text-success mb-0">${Utils.formatCurrency(stats.weightedPipeline)}</h2>
                                        <small class="text-muted">${stats.winRate}% win rate</small>
                                    </div>
                                    <i class="bi bi-trophy fs-1 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-warning">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Active Customers</p>
                                        <h2 class="text-warning mb-0">${stats.activeCustomers}</h2>
                                        <small class="text-muted">${stats.tier1Count} Tier 1</small>
                                    </div>
                                    <i class="bi bi-people fs-1 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-danger">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Hot Leads</p>
                                        <h2 class="text-danger mb-0">${stats.hotLeads}</h2>
                                        <small class="text-muted">${Utils.formatCurrency(stats.hotValue)}</small>
                                    </div>
                                    <i class="bi bi-fire fs-1 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Row -->
                <div class="row g-3 mb-4">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-bar-chart"></i> Pipeline by Stage</h5>
                            </div>
                            <div class="card-body">
                                ${this.renderPipelineChart(opportunities)}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-pie-chart"></i> Customer Distribution</h5>
                            </div>
                            <div class="card-body">
                                ${this.renderCustomerDistribution(customers)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Activity Summary -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-calendar-check"></i> Recent Activities</h5>
                            </div>
                            <div class="card-body">
                                ${this.renderRecentActivities(visits)}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-exclamation-triangle"></i> Alerts & Attention Needed</h5>
                            </div>
                            <div class="card-body">
                                ${this.renderAlerts(stats)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Top Opportunities -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-star"></i> Top 10 Opportunities</h5>
                    </div>
                    <div class="card-body">
                        ${this.renderTopOpportunities(opportunities)}
                    </div>
                </div>
            </div>
        `;
    },

    // Calculate executive stats
    calculateExecutiveStats(opportunities, customers, demos, visits) {
        const totalPipeline = opportunities.reduce((sum, o) => sum + o.value, 0);
        const weightedPipeline = opportunities.reduce((sum, o) => sum + Utils.calculateWeightedValue(o.value, o.probability), 0);
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const tier1Count = customers.filter(c => c.tier === 'T1').length;
        const hotOpps = opportunities.filter(o => o.interest === 'hot');
        const s6s7 = opportunities.filter(o => ['S6', 'S7'].includes(o.stage));
        const won = opportunities.filter(o => o.stage === 'S8_WON');

        return {
            totalPipeline,
            weightedPipeline,
            activeCustomers,
            tier1Count,
            hotLeads: hotOpps.length,
            hotValue: hotOpps.reduce((sum, o) => sum + o.value, 0),
            winRate: s6s7.length > 0 ? Math.round((won.length / (s6s7.length + won.length)) * 100) : 0,
            pendingDemos: demos.filter(d => d.status.includes('pending')).length,
            overdueFollowups: Storage.get('followUps').filter(f => f.status === 'overdue').length
        };
    },

    // Render pipeline chart (text-based)
    renderPipelineChart(opportunities) {
        const stages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];

        // Use PipelineModule definitions if available, otherwise fallback
        const getStageInfo = (id) => {
            const definedStage = typeof PipelineModule !== 'undefined' ? PipelineModule.STAGES.find(s => s.id === id) : null;
            if (definedStage) return definedStage;

            // Fallback
            const labels = {
                'S1': 'Suspect',
                'S2': 'Prospect',
                'S3': 'Qualified',
                'S4': 'Proposal',
                'S5': 'Consideration',
                'S6': 'Waiting Proc.',
                'S7': 'Procurement'
            };
            return { id, name: labels[id] || id, description: '' };
        };

        return `
            <div class="chart-container">
                ${stages.map(stage => {
            const stageOpps = opportunities.filter(o => o.stage === stage);
            const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0);
            const maxValue = Math.max(...stages.map(s =>
                opportunities.filter(o => o.stage === s).reduce((sum, o) => sum + o.value, 0)
            ));
            const percentage = maxValue > 0 ? (stageValue / maxValue) * 100 : 0;
            const info = getStageInfo(stage);

            return `
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <div>
                                    <span><strong>${stage}</strong> ${info.name}</span>
                                    <span class="text-muted small ms-2" style="font-size: 0.85em;">${info.description}</span>
                                </div>
                                <span class="text-muted" style="font-size: 0.9em;">${stageOpps.length} opps | ${Utils.formatCurrency(stageValue)}</span>
                            </div>
                            <div class="progress" style="height: 25px;">
                                <div class="progress-bar bg-primary" role="progressbar" 
                                    style="width: ${percentage}%" 
                                    aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                                    ${percentage > 10 ? Utils.formatCurrency(stageValue) : ''}
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    // Render customer distribution
    renderCustomerDistribution(customers) {
        const tiers = ['T1', 'T2', 'T3', 'T4'];
        const tierColors = {
            'T1': 'danger',
            'T2': 'warning',
            'T3': 'success',
            'T4': 'secondary'
        };

        return `
            <div class="tier-distribution">
                ${tiers.map(tier => {
            const count = customers.filter(c => c.tier === tier).length;
            const percentage = customers.length > 0 ? (count / customers.length) * 100 : 0;
            const tierConfig = typeof TierConfig !== 'undefined' ? TierConfig.getById(tier) : null;
            const description = tierConfig ? tierConfig.description : '';

            return `
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div>
                                    <span class="badge bg-${tierColors[tier]} me-2">${tier}</span>
                                </div>
                                <span class="small"><strong>${count}</strong> (${percentage.toFixed(1)}%)</span>
                            </div>
                            <!-- Description line -->
                            <div class="text-muted small mb-1" style="font-size: 0.8em; line-height: 1.2;">
                                ${description}
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-${tierColors[tier]}" 
                                    style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
        }).join('')}
                
                <hr>
                
                <div class="mt-3">
                    <p class="text-muted mb-2">By Status:</p>
                    ${['active', 'prospect', 'inactive'].map(status => {
            const count = customers.filter(c => c.status === status).length;
            return `
                            <div class="d-flex justify-content-between mb-1">
                                <span>${status}</span>
                                <strong>${count}</strong>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    // Render recent activities
    renderRecentActivities(visits) {
        const recent = visits.slice(0, 5);

        if (recent.length === 0) {
            return '<p class="text-muted text-center py-3">ไม่มีกิจกรรม</p>';
        }

        return `
            <div class="list-group">
                ${recent.map(visit => {
            const customer = Storage.getById('customers', visit.customerId);
            return `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="mb-1">${customer?.name || 'Unknown'}</h6>
                                    <p class="mb-1 small text-muted">${visit.objective}</p>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar"></i> ${Utils.formatDate(visit.visitDate, 'medium')}
                                    </small>
                                </div>
                                <span class="badge ${Utils.getBadgeClass(visit.interest)} align-self-start">
                                    ${visit.interest}
                                </span>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    // Render alerts
    renderAlerts(stats) {
        const alerts = [];

        if (stats.overdueFollowups > 0) {
            alerts.push({
                type: 'danger',
                icon: 'exclamation-triangle',
                message: `${stats.overdueFollowups} follow-ups เกินกำหนด`,
                action: '#/visits/followup'
            });
        }

        if (stats.pendingDemos > 0) {
            alerts.push({
                type: 'warning',
                icon: 'clock-history',
                message: `${stats.pendingDemos} demo requests รออนุมัติ`,
                action: '#/demos/approval'
            });
        }

        if (stats.hotLeads > 5) {
            alerts.push({
                type: 'info',
                icon: 'fire',
                message: `${stats.hotLeads} hot leads ต้องติดตาม`,
                action: '#/pipeline'
            });
        }

        if (alerts.length === 0) {
            return '<p class="text-success text-center py-3"><i class="bi bi-check-circle"></i> ทุกอย่างเป็นไปด้วยดี</p>';
        }

        return `
            <div class="list-group">
                ${alerts.map(alert => `
                    <a href="${alert.action}" class="list-group-item list-group-item-action list-group-item-${alert.type}">
                        <i class="bi bi-${alert.icon}"></i> ${alert.message}
                    </a>
                `).join('')}
            </div>
        `;
    },

    // Render top opportunities
    renderTopOpportunities(opportunities) {
        const top = opportunities
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Value</th>
                            <th>Stage</th>
                            <th>Probability</th>
                            <th>Expected Close</th>
                            <th>Interest</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${top.map((opp, index) => {
            const customer = Storage.getById('customers', opp.customerId);
            return `
                                <tr onclick="Router.navigate('#/pipeline/${opp.id}')" style="cursor: pointer;">
                                    <td>${index + 1}</td>
                                    <td><strong>${customer?.name || 'Unknown'}</strong></td>
                                    <td>${opp.product}</td>
                                    <td><strong class="text-primary">${Utils.formatCurrency(opp.value)}</strong></td>
                                    <td><span class="badge ${Utils.getBadgeClass(opp.stage)}">${opp.stage}</span></td>
                                    <td>${opp.probability}%</td>
                                    <td>${Utils.formatDate(opp.expectedClose, 'medium')}</td>
                                    <td><span class="badge ${Utils.getBadgeClass(opp.interest)}">${opp.interest}</span></td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Render sales dashboard
    renderSales() {
        const user = Auth.getCurrentUser();
        const myOpportunities = Storage.query('opportunities', { assignedTo: user.id });
        const myVisits = Storage.query('visitReports', { salesId: user.id });
        const myFollowUps = Storage.query('followUps', { assignedTo: user.id });

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <h1><i class="bi bi-person-badge"></i> My Sales Dashboard</h1>
                    <p class="text-muted mb-0">ภาพรวมงานขายของคุณ</p>
                </div>
                
                <!-- My Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">My Pipeline</p>
                                <h2 class="text-primary">${Utils.formatCurrency(myOpportunities.reduce((s, o) => s + o.value, 0))}</h2>
                                <small class="text-muted">${myOpportunities.length} opportunities</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Visits This Month</p>
                                <h2 class="text-success">${myVisits.length}</h2>
                                <small class="text-muted">Target: 20 visits</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Pending Follow-ups</p>
                                <h2 class="text-warning">${myFollowUps.filter(f => f.status === 'pending').length}</h2>
                                <small class="text-danger">${myFollowUps.filter(f => f.status === 'overdue').length} overdue</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Sales dashboard with personal metrics and tasks
                </div>
            </div>
        `;
    },

    // Render manager dashboard
    renderManager() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <h1><i class="bi bi-clipboard-check"></i> Manager Dashboard</h1>
                    <p class="text-muted mb-0">ภาพรวมทีมและงานที่ต้องอนุมัติ</p>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Manager dashboard with team performance and approval queue
                </div>
            </div>
        `;
    }
};

DashboardsModule.init();
console.log('✅ Dashboards module loaded');
