// Auth.js - Mock authentication and role management for Sale Tracking System v1.3

const Auth = {
    // Current logged-in user
    currentUser: null,

    // Role definitions with permissions
    ROLES: {
        sales: {
            name: 'พนักงานขาย',
            nameEn: 'Sales',
            modules: ['customers', 'visits', 'demos', 'pipeline', 'products', 'budget-dashboard', 'insights', 'calendar', 'meetings'],
            canApprove: []
        },
        manager: {
            name: 'ผู้จัดการฝ่ายขาย',
            nameEn: 'Sales Manager',
            modules: ['customers', 'visits', 'demos', 'pipeline', 'products', 'budget-dashboard', 'insights', 'dashboards', 'calendar', 'dev-requests', 'meetings', 'projects'],
            canApprove: ['visitPlans', 'demoRequests_l1', 'strategicPricings_l1']
        },
        management: {
            name: 'ผู้บริหาร',
            nameEn: 'Management',
            modules: ['dashboards', 'pipeline', 'products', 'budget-dashboard', 'dev-requests', 'projects'],
            canApprove: ['demoRequests_l2', 'strategicPricings_l2']
        },
        po: {
            name: 'Product Owner',
            nameEn: 'Product Owner',
            modules: ['dev-requests', 'po-workspace', 'dashboards'],
            canApprove: []
        },
        pm: {
            name: 'Project Manager',
            nameEn: 'Project Manager',
            modules: ['projects', 'dashboards', 'meetings'],
            canApprove: []
        },
        admin: {
            name: 'ผู้ดูแลระบบ',
            nameEn: 'Administrator',
            modules: ['*'], // All modules
            canApprove: ['*'] // All approvals
        }
    },

    // Initialize auth system
    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('sts_v13_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            console.log('✅ User session restored:', this.currentUser.name);
        }
    },

    // Login
    login(email, password) {
        // Get users from storage
        const users = Storage.get('users');

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'ไม่พบผู้ใช้งานนี้' };
        }

        // In real app, would check password hash
        // For mock, just check if password matches email prefix
        const expectedPassword = email.split('@')[0];
        if (password !== expectedPassword && password !== 'demo123') {
            return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
        }

        // Set current user
        this.currentUser = user;
        localStorage.setItem('sts_v13_currentUser', JSON.stringify(user));

        // Create login notification
        Storage.add('notifications', {
            userId: user.id,
            type: 'system',
            message: `ยินดีต้อนรับ ${user.name}`,
            link: '#/dashboard',
            isRead: false
        });

        console.log('✅ Login successful:', user.name);
        return { success: true, user };
    },

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('sts_v13_currentUser');
        console.log('👋 Logged out');
        window.location.hash = '#/login';
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    },

    // Check if user has access to module
    canAccessModule(module) {
        if (!this.currentUser) return false;

        const role = this.ROLES[this.currentUser.role];
        if (!role) return false;

        // Admin has access to everything
        if (role.modules.includes('*')) return true;

        return role.modules.includes(module);
    },

    // Check if user can approve specific item type
    canApprove(type) {
        if (!this.currentUser) return false;

        const role = this.ROLES[this.currentUser.role];
        if (!role) return false;

        // Admin can approve everything
        if (role.canApprove.includes('*')) return true;

        return role.canApprove.includes(type);
    },

    // Get role display name
    getRoleName(role) {
        return this.ROLES[role]?.name || role;
    },

    // Require login (redirect if not logged in)
    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    },

    // Require specific role
    requireRole(roles) {
        if (!this.isLoggedIn()) {
            window.location.hash = '#/login';
            return false;
        }

        if (typeof roles === 'string') {
            roles = [roles];
        }

        if (!roles.includes(this.currentUser.role)) {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            window.location.hash = '#/dashboard';
            return false;
        }

        return true;
    },

    // Get users by role
    getUsersByRole(role) {
        const users = Storage.get('users');
        return users.filter(u => u.role === role);
    },

    // Get all managers
    getManagers() {
        return this.getUsersByRole('manager');
    },

    // Get all sales
    getSalesTeam() {
        return this.getUsersByRole('sales');
    },

    // Switch user (for testing)
    switchUser(userId) {
        const users = Storage.get('users');
        const user = users.find(u => u.id === userId);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('sts_v13_currentUser', JSON.stringify(user));
            console.log('🔄 Switched to:', user.name);
            window.location.reload();
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    Auth.init();
}

console.log('✅ Auth module loaded');
