// STS App.js - Main application initialization

const STSApp = {
    // Initialize application
    init() {
        console.log('🚀 Initializing Sale Tracking System v1.3...');

        // Hide loading screen after initialization
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 500);

        // Initialize router
        Router.init();

        // Setup global event listeners
        this.setupEventListeners();

        // Add global search button
        setTimeout(() => {
            if (typeof GlobalSearch !== 'undefined') {
                GlobalSearch.addSearchButton();
            }
        }, 500);

        // Check for notifications (if logged in)
        if (Auth.isLoggedIn()) {
            this.checkNotifications();
        }

        console.log('✅ Application initialized successfully');
    },

    // Setup global event listeners
    setupEventListeners() {
        // Handle logout
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn')) {
                e.preventDefault();
                this.handleLogout();
            }
        });

        // Handle user switch (for testing)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('switch-user-btn')) {
                e.preventDefault();
                const userId = e.target.dataset.userId;
                Auth.switchUser(userId);
            }
        });
    },

    // Handle logout
    handleLogout() {
        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
            Auth.logout();
        }
    },

    // Check for new notifications
    checkNotifications() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const notifications = Storage.query('notifications', {
            userId: user.id,
            isRead: false
        });

        // Update notification badge
        const badge = document.getElementById('notificationBadge');
        if (badge && notifications.length > 0) {
            badge.textContent = notifications.length;
            badge.style.display = 'inline-block';
        }
    },

    // Render main layout (called after login)
    renderMainLayout() {
        const user = Auth.getCurrentUser();
        const role = Auth.ROLES[user.role];

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <!-- Top Navigation -->
            <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
                <div class="container-fluid">
                <a class="navbar-brand" href="#/pipeline">
                    <div class="logo-container">
                        <div class="logo-icon">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>
                        <div class="logo-text">
                            <span class="logo-title">CRM</span>
                            <span class="logo-subtitle">Meditech</span>
                        </div>
                    </div>
                </a>
                    
                    <div class="d-flex align-items-center gap-3">
                        <!-- Notifications -->
                        <div class="position-relative">
                            <a href="#/notifications" class="btn btn-link text-dark position-relative">
                                <i class="bi bi-bell fs-5"></i>
                                <span id="notificationBadge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
                                    0
                                </span>
                            </a>
                        </div>
                        
                        <!-- User Menu -->
                        <div class="dropdown">
                            <button class="btn btn-link text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-person-circle fs-5"></i>
                                <span class="ms-2">${user.name}</span>
                                <span class="badge bg-primary ms-2">${role.name}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#/profile"><i class="bi bi-person"></i> โปรไฟล์</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger logout-btn" href="#"><i class="bi bi-box-arrow-right"></i> ออกจากระบบ</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            
            <!-- Main Layout -->
            <div class="d-flex">
                <!-- Sidebar -->
                <div class="sidebar bg-light border-end" style="width: 250px; min-height: calc(100vh - 56px);">
                    <div class="p-3">
                        ${this.renderSidebarMenu(user.role)}
                    </div>
                </div>
                
                <!-- Main Content Area -->
                <div class="flex-grow-1" style="min-height: calc(100vh - 56px); background: #f8f9fa;">
                    <div id="pageContent" class="p-4">
                        <!-- Page content will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        // Update notification count
        this.checkNotifications();
    },

    // Render sidebar menu based on role
    renderSidebarMenu(role) {
        const modules = Auth.ROLES[role].modules;
        const canAccessAll = modules.includes('*');

        const menuItems = [
            { icon: 'funnel', label: 'Sales Pipeline', link: '#/pipeline', module: 'pipeline' },
            { icon: 'boxes', label: 'สินค้า / Products', link: '#/products', module: 'products' },
            { divider: true },
            { icon: 'people', label: 'ลูกค้า', link: '#/customers', module: 'customers' },
            { icon: 'calendar-check', label: 'เข้าพบลูกค้า', link: '#/visits', module: 'visits' },
            { icon: 'display', label: 'Demo/Trial', link: '#/demos', module: 'demos' },
            { icon: 'piggy-bank', label: 'Budget Control', link: '#/budget-dashboard', module: 'budget-dashboard' },
            { icon: 'lightbulb', label: 'Customer Insights', link: '#/insights', module: 'insights' },
            { divider: true },
            { icon: 'calendar3', label: 'ปฏิทิน', link: '#/calendar', module: 'calendar' },
            { icon: 'code-slash', label: 'Dev Request', link: '#/dev-requests', module: 'dev-requests' },
            { icon: 'chat-dots', label: 'ประชุม', link: '#/meetings', module: 'meetings' },
            { icon: 'kanban', label: 'โครงการ', link: '#/projects', module: 'projects' },
            { icon: 'list-check', label: 'PO Workspace', link: '#/po/backlog', module: 'po-workspace' },
            { divider: true },
            { icon: 'gear', label: 'ตั้งค่าระบบ', link: '#/settings', module: 'settings' },
            { icon: 'bell', label: 'การแจ้งเตือน', link: '#/notifications', module: 'notifications' }
        ];

        let html = '<nav class="nav flex-column">';

        menuItems.forEach(item => {
            if (item.divider) {
                html += '<hr class="my-2">';
            } else {
                // Check if user has access to this module
                const hasAccess = canAccessAll || modules.includes(item.module);

                if (hasAccess) {
                    html += `
                        <a class="nav-link text-dark" href="${item.link}">
                            <i class="bi bi-${item.icon} me-2"></i>
                            ${item.label}
                        </a>
                    `;
                }
            }
        });

        html += '</nav>';
        return html;
    },

    // Render login page
    renderLoginPage() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #0D6EFD 0%, #1A73E8 100%);">
                <div class="card shadow-lg" style="width: 100%; max-width: 400px;">
                    <div class="card-body p-5">
                        <div class="text-center mb-4">
                            <div class="logo-container justify-content-center mb-3">
                                <div class="logo-icon" style="width: 60px; height: 60px; font-size: 2rem;">
                                    <i class="bi bi-graph-up-arrow"></i>
                                </div>
                                <div class="logo-text text-start">
                                    <span class="logo-title">CRM</span>
                                    <span class="logo-subtitle">Meditech</span>
                                </div>
                            </div>
                            <p class="text-muted">ระบบติดตามการขาย HIS & Queue</p>
                        </div>
                        
                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label">อีเมล</label>
                                <input type="email" class="form-control" id="loginEmail" placeholder="example@company.com" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">รหัสผ่าน</label>
                                <input type="password" class="form-control" id="loginPassword" placeholder="••••••••" required>
                            </div>
                            
                            <div id="loginError" class="alert alert-danger d-none"></div>
                            
                            <button type="submit" class="btn btn-primary w-100 mb-3">
                                <i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ
                            </button>
                        </form>
                        
                        <hr>
                        
                        <div class="text-center">
                            <p class="text-muted small mb-2">ทดสอบระบบ (คลิกเพื่อเข้าสู่ระบบ):</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-sm btn-outline-primary switch-user-btn" data-user-id="USR-001">
                                    👨‍💼 พนักงานขาย (somchai@company.com)
                                </button>
                                <button class="btn btn-sm btn-outline-primary switch-user-btn" data-user-id="USR-002">
                                    👔 ผู้จัดการ (wichai@company.com)
                                </button>
                                <button class="btn btn-sm btn-outline-primary switch-user-btn" data-user-id="USR-003">
                                    🎯 ผู้บริหาร (prasert@company.com)
                                </button>
                                <button class="btn btn-sm btn-outline-success switch-user-btn" data-user-id="USR-004">
                                    🎨 Product Owner (suda@company.com)
                                </button>
                                <button class="btn btn-sm btn-outline-info switch-user-btn" data-user-id="USR-005">
                                    📊 Project Manager (thana@company.com)
                                </button>
                                <button class="btn btn-sm btn-outline-danger switch-user-btn" data-user-id="USR-006">
                                    🔧 Admin (admin@company.com)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Handle login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Handle quick login buttons
        document.querySelectorAll('.switch-user-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.dataset.userId;
                Auth.switchUser(userId);
            });
        });
    },

    // Handle login
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        const result = Auth.login(email, password);

        if (result.success) {
            Router.navigate('#/pipeline');
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.remove('d-none');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    STSApp.init();
});

console.log('✅ STS App module loaded');
