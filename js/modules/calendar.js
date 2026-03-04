// Calendar Module - Sales Planning & Calendar for STS v1.3

const CalendarModule = {
    currentView: 'month',
    currentDate: new Date(),

    // Initialize module
    init() {
        console.log('📅 Calendar module initialized');
    },

    // Render calendar dashboard
    renderDashboard() {
        const events = Storage.get('calendarEvents') || [];
        const thisMonth = events.filter(e => {
            // Support both old (eventDate) and new (startDate) formats
            const dateStr = e.startDate || e.eventDate;
            if (!dateStr) return false;
            const eventDate = new Date(dateStr);
            const now = new Date();
            return eventDate.getMonth() === now.getMonth() &&
                eventDate.getFullYear() === now.getFullYear();
        });

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-calendar3"></i> Sales Calendar & Planning</h1>
                        <p class="text-muted mb-0">วางแผนกิจกรรมและติดตามความคืบหน้า</p>
                    </div>
                    <button class="btn btn-primary" onclick="alert('ฟีเจอร์เพิ่ม Event จะพัฒนาในขั้นตอนถัดไป')">
                        <i class="bi bi-plus-circle"></i> เพิ่ม Event
                    </button>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Events เดือนนี้</p>
                                <h3 class="text-primary">${thisMonth.length}</h3>
                                <small class="text-muted">Total: ${events.length}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Visits Planned</p>
                                <h3 class="text-success">${thisMonth.filter(e => e.type === 'visit').length}</h3>
                                <small class="text-muted">Target: 20</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Meetings</p>
                                <h3 class="text-info">${thisMonth.filter(e => e.type === 'meeting').length}</h3>
                                <small class="text-muted">This month</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Demos</p>
                                <h3 class="text-warning">${thisMonth.filter(e => e.type === 'demo').length}</h3>
                                <small class="text-muted">Scheduled</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Calendar View Selector -->
                <div class="card mb-4">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary active" onclick="CalendarModule.changeView('month')">
                                    <i class="bi bi-calendar-month"></i> Month
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="CalendarModule.changeView('week')">
                                    <i class="bi bi-calendar-week"></i> Week
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="CalendarModule.changeView('day')">
                                    <i class="bi bi-calendar-day"></i> Day
                                </button>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-secondary" onclick="CalendarModule.previousPeriod()">
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                                <span class="mx-3"><strong>${this.getMonthYearThai()}</strong></span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="CalendarModule.nextPeriod()">
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                                <button class="btn btn-sm btn-primary ms-2" onclick="CalendarModule.goToToday()">
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        ${this.renderCalendarView(events)}
                    </div>
                </div>
                
                <!-- Upcoming Events -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-list-ul"></i> Upcoming Events</h5>
                    </div>
                    <div class="card-body">
                        ${this.renderUpcomingEvents(events)}
                    </div>
                </div>
            </div>
        `;
    },

    // Get month year in Thai
    getMonthYearThai() {
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear() + 543}`;
    },

    // Render calendar view
    renderCalendarView(events) {
        if (this.currentView === 'month') {
            return this.renderMonthView(events);
        } else if (this.currentView === 'week') {
            return this.renderWeekView(events);
        } else {
            return this.renderDayView(events);
        }
    },

    // Render month view
    renderMonthView(events) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const weeks = [];
        let currentWeek = [];

        // Fill empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            currentWeek.push(null);
        }

        // Fill days
        for (let day = 1; day <= daysInMonth; day++) {
            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        // Fill remaining cells
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

        return `
            <div class="calendar-month">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            ${dayNames.map(name => `<th class="text-center">${name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${weeks.map(week => `
                            <tr>
                                ${week.map(day => {
            if (!day) return '<td class="bg-light"></td>';

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => {
                const eventDateStr = e.startDate || e.eventDate;
                return eventDateStr && eventDateStr.startsWith(dateStr);
            });
            const isToday = this.isToday(year, month, day);

            return `
                                        <td class="calendar-day ${isToday ? 'bg-primary bg-opacity-10' : ''}" style="height: 100px; vertical-align: top;">
                                            <div class="fw-bold ${isToday ? 'text-primary' : ''}">${day}</div>
                                            ${dayEvents.slice(0, 2).map(e => `
                                                <div class="badge bg-${this.getEventColor(e.type)} small d-block text-start mb-1 text-truncate" 
                                                    title="${e.title}">
                                                    ${e.title}
                                                </div>
                                            `).join('')}
                                            ${dayEvents.length > 2 ? `<small class="text-muted">+${dayEvents.length - 2} more</small>` : ''}
                                        </td>
                                    `;
        }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Render week view (simplified)
    renderWeekView(events) {
        return `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> 
                Week view - Coming soon
            </div>
        `;
    },

    // Render day view (simplified)
    renderDayView(events) {
        return `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> 
                Day view - Coming soon
            </div>
        `;
    },

    // Render upcoming events
    renderUpcomingEvents(events) {
        const now = new Date();
        const upcoming = events
            .filter(e => {
                const dateStr = e.startDate || e.eventDate;
                return dateStr && new Date(dateStr) >= now;
            })
            .sort((a, b) => {
                const dateA = new Date(a.startDate || a.eventDate);
                const dateB = new Date(b.startDate || b.eventDate);
                return dateA - dateB;
            })
            .slice(0, 10);

        if (upcoming.length === 0) {
            return '<p class="text-muted text-center py-3">ไม่มี Event ที่กำลังจะมาถึง</p>';
        }

        return `
            <div class="list-group">
                ${upcoming.map(event => {
            const customer = Storage.getById('customers', event.customerId);
            return `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">
                                        <span class="badge bg-${this.getEventColor(event.type)} me-2">${event.type}</span>
                                        ${event.title}
                                    </h6>
                                    <p class="mb-1 text-muted">${customer?.name || 'Unknown'}</p>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar"></i> ${Utils.formatDate(event.startDate || event.eventDate, 'datetime')}
                                        ${event.endDate ? ` - ${Utils.formatDate(event.endDate, 'datetime')}` : ''}
                                    </small>
                                </div>
                                <span class="text-muted">${Utils.daysFromNow(event.startDate || event.eventDate)} วัน</span>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    // Get event color by type
    getEventColor(type) {
        const colors = {
            'visit': 'primary',
            'meeting': 'info',
            'demo': 'warning',
            'training': 'success',
            'other': 'secondary'
        };
        return colors[type] || 'secondary';
    },

    // Check if date is today
    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
    },

    // Change view
    changeView(view) {
        this.currentView = view;
        this.renderDashboard();
    },

    // Navigate to previous period
    previousPeriod() {
        if (this.currentView === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.renderDashboard();
    },

    // Navigate to next period
    nextPeriod() {
        if (this.currentView === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        }
        this.renderDashboard();
    },

    // Go to today
    goToToday() {
        this.currentDate = new Date();
        this.renderDashboard();
    }
};

CalendarModule.init();
console.log('✅ Calendar module loaded');
