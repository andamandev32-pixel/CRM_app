// Notifications Module - Notification Center for STS v1.3

const NotificationsModule = {
    // Initialize module
    init() {
        console.log('🔔 Notifications module initialized');
        this.startNotificationChecks();
    },

    // Start periodic notification checks
    startNotificationChecks() {
        // Check every minute (simulated)
        setInterval(() => {
            this.checkAndGenerateNotifications();
        }, 60000);

        // Initial check
        this.checkAndGenerateNotifications();
    },

    // Check and generate notifications
    checkAndGenerateNotifications() {
        const notifications = [];

        // Check overdue follow-ups
        const followUps = Storage.get('followUps');
        const overdue = followUps.filter(f => {
            const deadline = new Date(f.deadline);
            const now = new Date();
            return deadline < now && f.status === 'pending';
        });

        overdue.forEach(f => {
            const customer = Storage.getById('customers', f.customerId);
            notifications.push({
                id: `followup_${f.id}`,
                type: 'warning',
                title: 'Follow-up เกินกำหนด',
                message: `${f.action} สำหรับ ${customer?.name || 'Unknown'}`,
                link: `#/visits/followup`,
                createdAt: new Date().toISOString(),
                read: false
            });
        });

        // Check pending demo approvals
        const demos = Storage.get('demoRequests');
        const pendingDemos = demos.filter(d => d.status.includes('pending'));

        if (pendingDemos.length > 0) {
            notifications.push({
                id: `demos_pending`,
                type: 'info',
                title: 'Demo/Trial รออนุมัติ',
                message: `มี ${pendingDemos.length} รายการรออนุมัติ`,
                link: `#/demos/approval`,
                createdAt: new Date().toISOString(),
                read: false
            });
        }

        // Check hot leads
        const opportunities = Storage.get('opportunities');
        const hotLeads = opportunities.filter(o => o.interest === 'hot');

        if (hotLeads.length > 5) {
            notifications.push({
                id: `hot_leads`,
                type: 'danger',
                title: 'Hot Leads ต้องติดตาม',
                message: `มี ${hotLeads.length} hot leads ที่ต้องให้ความสนใจ`,
                link: `#/pipeline`,
                createdAt: new Date().toISOString(),
                read: false
            });
        }

        // Store notifications (merge with existing)
        const existing = Storage.get('notifications');
        const merged = [...notifications, ...existing].slice(0, 50); // Keep last 50
        Storage.set('notifications', merged);

        // Update badge count
        this.updateBadgeCount();
    },

    // Get unread count
    getUnreadCount() {
        const notifications = Storage.get('notifications');
        return notifications.filter(n => !n.read).length;
    },

    // Update badge count in UI
    updateBadgeCount() {
        const count = this.getUnreadCount();
        const badge = document.getElementById('notificationBadge');

        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // Render notification center
    renderCenter() {
        const notifications = Storage.get('notifications');
        const unread = notifications.filter(n => !n.read);
        const read = notifications.filter(n => n.read);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-bell"></i> Notification Center</h1>
                        <p class="text-muted mb-0">การแจ้งเตือนและกิจกรรมสำคัญ</p>
                    </div>
                    <button class="btn btn-outline-primary" onclick="NotificationsModule.markAllAsRead()">
                        <i class="bi bi-check-all"></i> Mark All as Read
                    </button>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">ทั้งหมด</p>
                                        <h3>${notifications.length}</h3>
                                    </div>
                                    <i class="bi bi-bell fs-1 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">ยังไม่ได้อ่าน</p>
                                        <h3 class="text-warning">${unread.length}</h3>
                                    </div>
                                    <i class="bi bi-envelope fs-1 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="text-muted mb-1">อ่านแล้ว</p>
                                        <h3 class="text-success">${read.length}</h3>
                                    </div>
                                    <i class="bi bi-envelope-open fs-1 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#unread">
                            ยังไม่ได้อ่าน (${unread.length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#all">
                            ทั้งหมด (${notifications.length})
                        </a>
                    </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="unread">
                        ${this.renderNotificationList(unread)}
                    </div>
                    <div class="tab-pane fade" id="all">
                        ${this.renderNotificationList(notifications)}
                    </div>
                </div>
            </div>
        `;
    },

    // Render notification list
    renderNotificationList(notifications) {
        if (notifications.length === 0) {
            return `
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="text-muted mt-3">ไม่มีการแจ้งเตือน</p>
                    </div>
                </div>
            `;
        }

        const typeIcons = {
            'info': 'info-circle',
            'warning': 'exclamation-triangle',
            'danger': 'exclamation-circle',
            'success': 'check-circle'
        };

        return `
            <div class="list-group">
                ${notifications.map(notif => `
                    <a href="${notif.link}" 
                        class="list-group-item list-group-item-action ${!notif.read ? 'list-group-item-light' : ''}"
                        onclick="NotificationsModule.markAsRead('${notif.id}')">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center mb-1">
                                    <i class="bi bi-${typeIcons[notif.type]} text-${notif.type} me-2"></i>
                                    <h6 class="mb-0">${notif.title}</h6>
                                    ${!notif.read ? '<span class="badge bg-primary ms-2">New</span>' : ''}
                                </div>
                                <p class="mb-1">${notif.message}</p>
                                <small class="text-muted">
                                    <i class="bi bi-clock"></i> ${Utils.timeAgo(notif.createdAt)}
                                </small>
                            </div>
                            <i class="bi bi-chevron-right text-muted"></i>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    },

    // Mark notification as read
    markAsRead(notifId) {
        const notifications = Storage.get('notifications');
        const updated = notifications.map(n =>
            n.id === notifId ? { ...n, read: true } : n
        );
        Storage.set('notifications', updated);
        this.updateBadgeCount();
    },

    // Mark all as read
    markAllAsRead() {
        const notifications = Storage.get('notifications');
        const updated = notifications.map(n => ({ ...n, read: true }));
        Storage.set('notifications', updated);
        this.updateBadgeCount();
        this.renderCenter();
    },

    // Render notification dropdown (for navbar)
    renderDropdown() {
        const notifications = Storage.get('notifications').slice(0, 5);
        const unreadCount = this.getUnreadCount();

        if (notifications.length === 0) {
            return `
                <div class="dropdown-item text-center text-muted py-3">
                    ไม่มีการแจ้งเตือน
                </div>
            `;
        }

        return `
            <div class="dropdown-header d-flex justify-content-between align-items-center">
                <span>การแจ้งเตือน</span>
                <span class="badge bg-primary">${unreadCount} ใหม่</span>
            </div>
            ${notifications.map(notif => `
                <a class="dropdown-item ${!notif.read ? 'bg-light' : ''}" href="${notif.link}">
                    <div class="d-flex align-items-start">
                        <i class="bi bi-${notif.type === 'warning' ? 'exclamation-triangle' : 'info-circle'} text-${notif.type} me-2 mt-1"></i>
                        <div class="flex-grow-1">
                            <div class="fw-bold small">${notif.title}</div>
                            <div class="small text-muted">${Utils.truncate(notif.message, 50)}</div>
                            <div class="small text-muted">${Utils.timeAgo(notif.createdAt)}</div>
                        </div>
                    </div>
                </a>
            `).join('')}
            <div class="dropdown-divider"></div>
            <a class="dropdown-item text-center text-primary" href="#/notifications">
                ดูทั้งหมด
            </a>
        `;
    }
};

NotificationsModule.init();
console.log('✅ Notifications module loaded');
