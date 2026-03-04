// Sale Tracking System - Main Application Logic
// ระบบติดตามการขาย HIS & Queue Management

// Global State
let currentUser = null;
let currentPage = 'dashboard';
let appData = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 CRM Meditech Starting...');

    // Initialize sample data
    initializeSampleData();

    // Load data from localStorage
    appData = getData();

    // Set current user (default to first sales user)
    currentUser = appData.users.find(u => u.id === 'U01') || appData.users[0];
    updateUserProfile();

    // Setup navigation
    setupNavigation();

    // Setup sidebar toggle
    setupSidebarToggle();

    // Setup notification bell
    setupNotificationBell();

    // Load initial page
    loadPage('dashboard');

    // Update notification count
    updateNotificationCount();

    console.log('✅ Application initialized successfully');
});

// Update User Profile Display
function updateUserProfile() {
    const userName = document.getElementById('current-user-name');
    const userRole = document.getElementById('current-user-role');
    const userAvatars = document.querySelectorAll('.user-avatar');

    if (userName) userName.textContent = currentUser.name;
    if (userRole) {
        const roleNames = {
            'sales': 'Sales Executive',
            'manager': 'Sales Manager',
            'management': 'Management',
            'dev': 'Developer',
            'admin': 'Administrator'
        };
        userRole.textContent = roleNames[currentUser.role] || currentUser.role;
    }

    userAvatars.forEach(avatar => {
        avatar.textContent = currentUser.avatar || '👤';
    });
}

// Setup Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                loadPage(page);

                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Setup Sidebar Toggle
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');

    // Load saved sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }

    // Desktop toggle button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Close sidebar on mobile when clicking a nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
            }
        });
    });
}


// Load Page Content
function loadPage(pageName) {
    currentPage = pageName;
    const mainContent = document.getElementById('mainContent');
    const pageTitle = document.getElementById('page-title');

    // Page titles
    const pageTitles = {
        'dashboard': 'Dashboard',
        'customers': 'ลูกค้า',
        'pipeline': 'Sales Pipeline',
        'visit-plan': 'แผนการเข้าพบ',
        'visit-report': 'Visit Report',
        'followup': 'Follow-up',
        'demo-request': 'Demo / Trial Request',
        'demo-progress': 'ติดตามความคืบหน้า Demo/Trial',
        'insights': 'Customer Insight',
        'approval': 'อนุมัติ',
        'budget-dashboard': '💰 Budget Control Dashboard'
    };

    pageTitle.textContent = pageTitles[pageName] || pageName;

    // Load page content based on page name
    switch (pageName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'customers':
            renderCustomers();
            break;
        case 'pipeline':
            renderPipeline();
            break;
        case 'budget-dashboard':
            renderBudgetDashboard();
            break;
        case 'visit-plan':
            renderVisitPlan();
            break;
        case 'visit-report':
            renderVisitReport();
            break;
        case 'followup':
            renderFollowUp();
            break;
        case 'demo-request':
            renderDemoRequest();
            break;
        case 'demo-progress':
            renderDemoProgress();
            break;
        case 'insights':
            renderInsights();
            break;
        case 'approval':
            renderApproval();
            break;
        default:
            mainContent.innerHTML = '<div class="card"><h2>Page not found</h2></div>';
    }
}

// Drawer Functions
function openDrawer(title, content) {
    const drawer = document.getElementById('drawer');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerBody = document.getElementById('drawerBody');
    const backdrop = document.getElementById('modalBackdrop');

    drawerTitle.textContent = title;
    drawerBody.innerHTML = content;

    backdrop.classList.add('show');
    drawer.classList.add('show');

    // Close on backdrop click
    backdrop.onclick = closeDrawer;
}

function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('modalBackdrop');

    drawer.classList.remove('show');
    backdrop.classList.remove('show');
}

// Notification Functions
function setupNotificationBell() {
    const bell = document.getElementById('notificationBell');
    const dropdown = document.getElementById('notificationDropdown');

    bell.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        loadNotifications();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
        dropdown.classList.remove('show');
    });

    dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

function loadNotifications() {
    const notificationList = document.getElementById('notificationList');
    const notifications = appData.notifications
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    if (notifications.length === 0) {
        notificationList.innerHTML = '<div class="dropdown-item text-center">ไม่มีการแจ้งเตือน</div>';
        return;
    }

    const notificationIcons = {
        'follow_up_overdue': '⏰',
        'approval_result': '✅',
        'approval_pending': '⏳',
        'trial_progress_due': '📋',
        'trial_ending_soon': '⚠️',
        'insight_pending': '💡',
        'dev_update': '🔧',
        'budget_action_needed': '💰',
        'budget_stale': '📊'
    };

    notificationList.innerHTML = notifications.map(n => `
        <div class="dropdown-item ${n.isRead ? '' : 'font-semibold'}" onclick="markNotificationRead('${n.id}')">
            <div class="flex gap-2">
                <div style="font-size: 1.25rem;">${notificationIcons[n.type] || '📢'}</div>
                <div style="flex: 1;">
                    <div>${n.message}</div>
                    <div class="text-xs" style="color: var(--gray-500); margin-top: 0.25rem;">
                        ${formatTimeAgo(n.createdAt)}
                    </div>
                </div>
                ${!n.isRead ? '<div style="width: 8px; height: 8px; background: var(--primary-purple); border-radius: 50%;"></div>' : ''}
            </div>
        </div>
    `).join('');
}

function updateNotificationCount() {
    const count = appData.notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
    const badge = document.getElementById('notificationCount');

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function markNotificationRead(notificationId) {
    const notification = appData.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        saveData('notifications', appData.notifications);
        updateNotificationCount();
        loadNotifications();
    }
}

function markAllRead() {
    appData.notifications.forEach(n => {
        if (n.userId === currentUser.id) {
            n.isRead = true;
        }
    });
    saveData('notifications', appData.notifications);
    updateNotificationCount();
    loadNotifications();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return formatDate(dateString);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('th-TH').format(num);
}

function generateId(prefix) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
}

// Badge Helper
function getStatusBadge(status) {
    const badges = {
        'active': '<span class="badge badge-success">Active</span>',
        'prospect': '<span class="badge badge-warning">Prospect</span>',
        'inactive': '<span class="badge badge-gray">Inactive</span>',
        'pending': '<span class="badge badge-warning">รออนุมัติ</span>',
        'approved': '<span class="badge badge-success">อนุมัติแล้ว</span>',
        'rejected': '<span class="badge badge-danger">ปฏิเสธ</span>',
        'draft': '<span class="badge badge-gray">Draft</span>',
        'done': '<span class="badge badge-success">เสร็จสิ้น</span>',
        'overdue': '<span class="badge badge-danger">เกินกำหนด</span>',
        'hot': '<span class="badge badge-danger">🔴 Hot</span>',
        'warm': '<span class="badge badge-warning">🟡 Warm</span>',
        'cold': '<span class="badge badge-info">🔵 Cold</span>'
    };
    return badges[status] || `<span class="badge badge-gray">${status}</span>`;
}

function getTypeBadge(type) {
    const badges = {
        'army': '<span class="badge badge-blue">กองทัพบก</span>',
        'government': '<span class="badge badge-info">รัฐ</span>',
        'private': '<span class="badge badge-blue-light">เอกชน</span>',
        'clinic': '<span class="badge badge-gray">คลินิก</span>',
        'HIS': '<span class="badge badge-blue">HIS</span>',
        'Queue': '<span class="badge badge-blue-light">Queue</span>',
        'demo': '<span class="badge badge-info">DEMO</span>',
        'trial': '<span class="badge badge-blue">TRIAL</span>'
    };
    return badges[type] || `<span class="badge badge-gray">${type}</span>`;
}

function getTierBadge(tier) {
    const badges = {
        'T1': '<span class="badge badge-blue">T1</span>',
        'T2': '<span class="badge badge-blue-light">T2</span>',
        'T3': '<span class="badge badge-info">T3</span>'
    };
    return badges[tier] || `<span class="badge badge-gray">${tier}</span>`;
}

// Get customer name by ID
function getCustomerName(customerId) {
    const customer = appData.customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
}

// Get user name by ID
function getUserName(userId) {
    const user = appData.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
}

// ===== Contact Management Functions =====

// Get contacts for a specific customer
function getContactsByCustomer(customerId) {
    const contacts = appData.contacts || [];
    return contacts.filter(c => c.customerId === customerId);
}

// Create new contact
function createContact(contactData) {
    if (!appData.contacts) appData.contacts = [];
    const newContact = {
        id: generateId('CT'),
        ...contactData,
        createdAt: new Date().toISOString().split('T')[0]
    };
    appData.contacts.push(newContact);
    saveData('contacts', appData.contacts);
    return newContact;
}

// Update existing contact
function updateContact(contactId, contactData) {
    const index = appData.contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
        appData.contacts[index] = { ...appData.contacts[index], ...contactData };
        saveData('contacts', appData.contacts);
        return true;
    }
    return false;
}

// Delete contact
function deleteContact(contactId) {
    if (confirm('ต้องการลบผู้ติดต่อนี้หรือไม่?')) {
        appData.contacts = appData.contacts.filter(c => c.id !== contactId);
        saveData('contacts', appData.contacts);
        return true;
    }
    return false;
}

// ===== Customer Activity Functions =====

// Get activity summary for a customer
function getCustomerActivitySummary(customerId) {
    // Get last 5 visit reports
    const visitReports = (appData.visitReports || [])
        .filter(vr => vr.customerId === customerId)
        .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
        .slice(0, 5);

    // Get active follow-ups
    const followUps = (appData.followUps || [])
        .filter(fu => fu.customerId === customerId && fu.status !== 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Get opportunities
    const opportunities = (appData.opportunities || [])
        .filter(opp => opp.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { visitReports, followUps, opportunities };
}

// ===== Filter Functions =====

// Filter customers by multiple criteria
function filterCustomers(filters) {
    let filtered = [...appData.customers];

    if (filters.type) {
        filtered = filtered.filter(c => c.type === filters.type);
    }
    if (filters.region) {
        filtered = filtered.filter(c => c.region === filters.region);
    }
    if (filters.tier) {
        filtered = filtered.filter(c => c.tier === filters.tier);
    }
    if (filters.status) {
        filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.province.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
}


// Render scroll navigation buttons
function renderScrollButtons() {
    return `
        <div style="position: fixed; bottom: var(--spacing-xl); right: var(--spacing-xl); display: flex; flex-direction: column; gap: var(--spacing-sm); z-index: 100;">
            <button 
                onclick="scrollToProcessFlow()" 
                class="btn btn-primary" 
                style="width: 56px; height: 56px; border-radius: 50%; box-shadow: var(--shadow-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;"
                title="ดูกระบวนการทำงาน">
                📋
            </button>
            <button 
                onclick="scrollToTop()" 
                class="btn btn-secondary" 
                style="width: 56px; height: 56px; border-radius: 50%; box-shadow: var(--shadow-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;"
                title="กลับด้านบน">
                ⬆️
            </button>
        </div>
    `;
}

console.log('✅ App.js loaded successfully');

