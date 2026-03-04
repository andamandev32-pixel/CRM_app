// Router.js - Client-side routing for Sale Tracking System v1.3

const Router = {
    routes: {},
    currentRoute: null,

    // Initialize router
    init() {
        // Define all routes
        this.defineRoutes();

        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();

        console.log('✅ Router initialized');
    },

    // Define all application routes
    defineRoutes() {
        this.routes = {
            // Auth
            '#/login': () => STSApp.renderLoginPage(),

            // Dashboards
            '#/dashboard': () => this.loadModule('dashboards', 'executive'),
            '#/dashboard/sales': () => this.loadModule('dashboards', 'sales'),
            '#/dashboard/manager': () => this.loadModule('dashboards', 'manager'),

            // Notifications
            '#/notifications': () => this.loadModule('notifications', 'center'),

            // Calendar
            '#/calendar': () => this.loadModule('calendar', 'dashboard'),

            // Customers
            '#/customers': () => this.loadModule('customers', 'list'),
            '#/customers/new': () => this.loadModule('customers', 'form'),
            '#/customers/:id': (id) => this.loadModule('customers', 'profile', { id }),
            '#/customers/:id/edit': (id) => this.loadModule('customers', 'form', { id }),

            // Visits
            '#/visits': () => this.loadModule('visits', 'list'),
            '#/visits/plan': () => this.loadPage('visits/plan-form'),
            '#/visits/report': () => this.loadModule('visits', 'report'),
            '#/visits/followup': () => this.loadModule('visits', 'followup'),
            '#/visits/approval': () => this.loadPage('visits/approval-inbox'),

            // Demos
            '#/demos': () => this.loadModule('demos', 'list'),
            '#/demos/new': () => this.loadPage('demos/request-form'),
            '#/demos/:id': (id) => this.loadPage('demos/detail', { id }),
            '#/demos/approval': () => this.loadPage('demos/approval-inbox'),

            // Pipeline
            '#/pipeline': () => this.loadModule('pipeline', 'board'),
            '#/pipeline/new': () => this.loadModule('pipeline', 'addForm'),
            '#/pipeline/:id': (id) => this.loadPage('pipeline/opportunity-detail', { id }),

            // Products
            '#/products': () => this.loadModule('products', 'list'),

            // Budget Dashboard (v1.4)
            '#/budget-dashboard': () => this.loadModule('budget-dashboard', 'dashboard'),

            // Insights
            '#/insights': () => this.loadModule('insights', 'list'),
            '#/insights/new': () => this.loadPage('insights/form'),

            // Dev Requests
            '#/dev-requests': () => this.loadModule('dev-requests', 'list'),
            '#/dev-requests/new': () => this.loadPage('dev-requests/request-form'),
            '#/dev-requests/strategic': () => this.loadPage('dev-requests/dashboard'),

            // Meetings
            '#/meetings': () => this.loadModule('meetings', 'list'),
            '#/meetings/new': () => this.loadPage('meetings/record-form'),

            // Projects
            '#/projects': () => this.loadModule('projects', 'board'),
            '#/projects/:id': (id) => this.loadPage('projects/detail', { id }),

            // PO Workspace
            '#/po/backlog': () => this.loadModule('po-workspace', 'backlog'),
            '#/po/feasibility': () => this.loadModule('po-workspace', 'feasibility'),

            // Settings
            '#/settings': () => this.loadModule('settings', 'main'),

            // Profile
            '#/profile': () => this.loadPage('profile'),

            // Default
            '': () => this.navigate('#/pipeline')
        };
    },

    // Handle route change
    handleRoute() {
        const hash = window.location.hash || '';

        // Check if user is logged in (except for login page)
        if (hash !== '#/login' && !Auth.isLoggedIn()) {
            this.navigate('#/login');
            return;
        }

        // If logged in and trying to access login, redirect to pipeline
        if (hash === '#/login' && Auth.isLoggedIn()) {
            this.navigate('#/pipeline');
            return;
        }

        // Find matching route
        let matched = false;

        for (const [route, handler] of Object.entries(this.routes)) {
            // Check for exact match
            if (route === hash) {
                handler();
                matched = true;
                break;
            }

            // Check for parameterized route
            if (route.includes(':')) {
                const pattern = route.replace(/:[^/]+/g, '([^/]+)');
                const regex = new RegExp(`^${pattern}$`);
                const match = hash.match(regex);

                if (match) {
                    const params = match.slice(1);
                    handler(...params);
                    matched = true;
                    break;
                }
            }
        }

        // 404 - Route not found
        if (!matched && hash !== '') {
            this.show404();
        }

        this.currentRoute = hash;
    },

    // Navigate to a route
    navigate(hash) {
        window.location.hash = hash;
    },


    // Load module (calls module-specific render methods)
    loadModule(module, action, params = {}) {
        const mainContent = document.getElementById('mainContent');

        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }

        // Check if main layout exists, if not render it first
        if (!document.getElementById('pageContent')) {
            STSApp.renderMainLayout();
        }

        // Call module-specific render method
        try {
            switch (module) {
                case 'customers':
                    if (action === 'list') {
                        CustomersModule.renderList();
                    } else if (action === 'profile') {
                        CustomersModule.renderProfile(params.id);
                    } else if (action === 'form') {
                        this.loadPage('customers/form', params);
                    }
                    break;

                case 'visits':
                    if (typeof VisitsModule !== 'undefined') {
                        if (action === 'list') VisitsModule.renderList();
                        else if (action === 'report') VisitsModule.renderReport();
                        else if (action === 'followup') VisitsModule.renderFollowup();
                    } else {
                        this.loadPage(`visits/${action}`, params);
                    }
                    break;

                case 'demos':
                    if (typeof DemosModule !== 'undefined') {
                        if (action === 'list') DemosModule.renderList();
                    } else {
                        this.loadPage(`demos/${action}`, params);
                    }
                    break;

                case 'pipeline':
                    if (typeof PipelineModule !== 'undefined') {
                        if (action === 'board') PipelineModule.renderBoard();
                        else if (action === 'addForm') PipelineModule.renderAddForm();
                    } else {
                        this.loadPage(`pipeline/${action}`, params);
                    }
                    break;

                case 'products':
                    if (typeof ProductsModule !== 'undefined') {
                        ProductsModule.renderProducts();
                    } else {
                        this.loadPage('products/list', params);
                    }
                    break;

                case 'budget-dashboard':
                    if (typeof BudgetDashboardModule !== 'undefined') {
                        if (action === 'dashboard') BudgetDashboardModule.renderDashboard();
                    } else {
                        this.loadPage(`budget-dashboard/${action}`, params);
                    }
                    break;

                case 'dashboards':
                    if (typeof DashboardsModule !== 'undefined') {
                        if (action === 'executive') DashboardsModule.renderExecutive();
                        else if (action === 'sales') DashboardsModule.renderSales();
                        else if (action === 'manager') DashboardsModule.renderManager();
                    } else {
                        this.loadPage(`dashboards/${action}`, params);
                    }
                    break;

                case 'notifications':
                    if (typeof NotificationsModule !== 'undefined') {
                        if (action === 'center') NotificationsModule.renderCenter();
                    } else {
                        this.loadPage(`notifications/${action}`, params);
                    }
                    break;

                case 'calendar':
                    if (typeof CalendarModule !== 'undefined') {
                        if (action === 'dashboard') CalendarModule.renderDashboard();
                    } else {
                        this.loadPage(`calendar/${action}`, params);
                    }
                    break;

                case 'insights':
                    if (typeof InsightsModule !== 'undefined') {
                        if (action === 'list') InsightsModule.renderList();
                    } else {
                        this.loadPage(`insights/${action}`, params);
                    }
                    break;

                case 'dev-requests':
                    if (typeof DevRequestsModule !== 'undefined') {
                        if (action === 'list') DevRequestsModule.renderList();
                    } else {
                        this.loadPage(`dev-requests/${action}`, params);
                    }
                    break;

                case 'meetings':
                    if (typeof MeetingsModule !== 'undefined') {
                        if (action === 'list') MeetingsModule.renderList();
                    } else {
                        this.loadPage(`meetings/${action}`, params);
                    }
                    break;

                case 'projects':
                    if (typeof ProjectsModule !== 'undefined') {
                        if (action === 'board') ProjectsModule.renderBoard();
                    } else {
                        this.loadPage(`projects/${action}`, params);
                    }
                    break;

                case 'po-workspace':
                    if (typeof POWorkspaceModule !== 'undefined') {
                        if (action === 'backlog') POWorkspaceModule.renderBacklog();
                        else if (action === 'feasibility') POWorkspaceModule.renderFeasibility();
                    } else {
                        this.loadPage(`po-workspace/${action}`, params);
                    }
                    break;

                case 'settings':
                    if (typeof SettingsModule !== 'undefined') {
                        SettingsModule.renderSettings();
                    } else {
                        this.loadPage(`settings/${action}`, params);
                    }
                    break;

                default:
                    this.loadPage(`${module}/${action}`, params);
            }
        } catch (error) {
            console.error(`Error loading module ${module}:`, error);
            this.loadPage(`${module}/${action}`, params);
        }
    },

    // Load page content
    loadPage(page, params = {}) {
        const mainContent = document.getElementById('mainContent');

        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }

        // Show loading
        mainContent.innerHTML = '<div class="loading">กำลังโหลด...</div>';

        // In a real app, would fetch HTML from server
        // For now, we'll dynamically generate content based on page
        setTimeout(() => {
            this.renderPage(page, params);
        }, 100);
    },

    // Render page content (placeholder)
    renderPage(page, params) {
        const mainContent = document.getElementById('mainContent');

        // Placeholder content
        mainContent.innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <h1>${this.getPageTitle(page)}</h1>
                    <p class="text-muted">หน้า: ${page}</p>
                </div>
                <div class="page-content">
                    <div class="alert alert-info">
                        <strong>🚧 กำลังพัฒนา</strong><br>
                        หน้านี้อยู่ระหว่างการพัฒนา<br>
                        Parameters: ${JSON.stringify(params)}
                    </div>
                </div>
            </div>
        `;
    },

    // Get page title
    getPageTitle(page) {
        const titles = {
            'login': 'เข้าสู่ระบบ',
            'dashboard': 'แดชบอร์ด',
            'dashboards/executive': 'แดชบอร์ดผู้บริหาร',
            'dashboards/sales': 'แดชบอร์ดพนักงานขาย',
            'dashboards/manager': 'แดชบอร์ดผู้จัดการ',
            'customers/list': 'รายชื่อลูกค้า',
            'customers/form': 'ข้อมูลลูกค้า',
            'customers/profile': 'โปรไฟล์ลูกค้า',
            'visits/list': 'รายการเข้าพบ',
            'visits/plan-form': 'แผนการเข้าพบ',
            'visits/report-form': 'รายงานการเข้าพบ',
            'visits/followup-dashboard': 'Follow-up Dashboard',
            'visits/approval-inbox': 'อนุมัติแผนการเข้าพบ',
            'demos/list': 'รายการ Demo/Trial',
            'demos/request-form': 'ขอ Demo/Trial',
            'demos/detail': 'รายละเอียด Demo/Trial',
            'demos/approval-inbox': 'อนุมัติ Demo/Trial',
            'pipeline/board': 'Sales Pipeline',
            'pipeline/opportunity-detail': 'รายละเอียด Opportunity',
            'insights/list': 'Customer Insights',
            'insights/form': 'บันทึก Insight',
            'calendar/view': 'ปฏิทิน',
            'calendar/dashboard': 'แผนการขาย',
            'dev-requests/list': 'รายการ Dev Request',
            'dev-requests/request-form': 'ขอประเมินราคา',
            'dev-requests/dashboard': 'Strategic Pricing Dashboard',
            'meetings/list': 'รายการประชุม',
            'meetings/record-form': 'บันทึกการประชุม',
            'projects/board': 'โครงการ',
            'projects/detail': 'รายละเอียดโครงการ',
            'po/backlog': 'Dev Backlog',
            'po/feasibility': 'Feasibility Assessment',
            'notifications/list': 'การแจ้งเตือน',
            'profile': 'โปรไฟล์ของฉัน'
        };

        return titles[page] || page;
    },

    // Show 404 page
    show404() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-container text-center" style="padding: 60px 20px;">
                <h1 style="font-size: 72px; color: #ccc;">404</h1>
                <h3>ไม่พบหน้าที่คุณต้องการ</h3>
                <p class="text-muted">URL: ${window.location.hash}</p>
                <button class="btn btn-primary" onclick="Router.navigate('#/pipeline')">
                    กลับหน้าแรก
                </button>
            </div>
        `;
    }
};

console.log('✅ Router module loaded');
