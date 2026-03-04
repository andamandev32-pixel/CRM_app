// Meetings Module - Module 10 for STS v1.3

const MeetingsModule = {
    // Initialize module
    init() {
        console.log('💬 Meetings module initialized');
    },

    // Render meetings list
    renderList() {
        const meetings = Storage.get('meetingRecords');
        const actionItems = Storage.get('meetingActionItems');
        const documents = Storage.get('documentTrackers');
        const stats = this.calculateStats(meetings, actionItems, documents);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-chat-dots"></i> Meeting & Document Tracking</h1>
                        <p class="text-muted mb-0">บันทึกการประชุมและติดตามเอกสาร</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('meetings')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-primary" onclick="MeetingsModule.showAddMeetingForm()">
                            <i class="bi bi-plus-circle"></i> บันทึกการประชุม
                        </button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Total Meetings</p>
                                <h3 class="text-primary">${stats.totalMeetings}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Action Items</p>
                                <h3 class="text-warning">${stats.totalActions}</h3>
                                <small class="text-danger">${stats.overdueActions} overdue</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Documents</p>
                                <h3 class="text-info">${stats.totalDocs}</h3>
                                <small class="text-muted">${stats.pendingDocs} pending</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">This Month</p>
                                <h3 class="text-success">${stats.thisMonth}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#meetings">
                            Meetings (${meetings.length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#actions">
                            Action Items (${actionItems.length})
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#documents">
                            Documents (${documents.length})
                        </a>
                    </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="meetings">
                        ${this.renderMeetingsTable(meetings)}
                    </div>
                    <div class="tab-pane fade" id="actions">
                        ${this.renderActionItemsTable(actionItems)}
                    </div>
                    <div class="tab-pane fade" id="documents">
                        ${this.renderDocumentsTable(documents)}
                    </div>
                </div>
            </div>
        `;
    },

    // Calculate stats
    calculateStats(meetings, actionItems, documents) {
        const now = new Date();
        const thisMonthMeetings = meetings.filter(m => {
            const meetingDate = new Date(m.meetingDate);
            return meetingDate.getMonth() === now.getMonth() &&
                meetingDate.getFullYear() === now.getFullYear();
        });

        const overdueActions = actionItems.filter(a => {
            const deadline = new Date(a.deadline);
            return deadline < now && a.status === 'pending';
        });

        return {
            totalMeetings: meetings.length,
            totalActions: actionItems.length,
            overdueActions: overdueActions.length,
            totalDocs: documents.length,
            pendingDocs: documents.filter(d => d.status === 'pending').length,
            thisMonth: thisMonthMeetings.length
        };
    },

    // Render meetings table
    renderMeetingsTable(meetings) {
        if (meetings.length === 0) {
            return '<div class="card"><div class="card-body text-center py-3 text-muted">ไม่มีการประชุม</div></div>';
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Meeting ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Type</th>
                                    <th>Topic</th>
                                    <th>Attendees</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${meetings.map(meeting => {
            const customer = Storage.getById('customers', meeting.customerId);
            const actionItems = Storage.query('meetingActionItems', { meetingId: meeting.id });
            return `
                                        <tr>
                                            <td><strong>${meeting.id}</strong></td>
                                            <td>${Utils.formatDate(meeting.meetingDate, 'short')}</td>
                                            <td>${customer?.name || 'Unknown'}</td>
                                            <td><span class="badge bg-info">${meeting.meetingType}</span></td>
                                            <td>${Utils.truncate(meeting.topic, 40)}</td>
                                            <td><span class="badge bg-secondary">${actionItems.length} items</span></td>
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

    // Render action items table
    renderActionItemsTable(actionItems) {
        if (actionItems.length === 0) {
            return '<div class="card"><div class="card-body text-center py-3 text-muted">ไม่มี Action Items</div></div>';
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Responsible</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${actionItems.map(item => {
            const user = Storage.getById('users', item.responsibleId);
            const isOverdue = new Date(item.deadline) < new Date() && item.status === 'pending';
            return `
                                        <tr class="${isOverdue ? 'table-danger' : ''}">
                                            <td>${item.action}</td>
                                            <td>${user?.name || 'Unknown'}</td>
                                            <td>
                                                ${Utils.formatDate(item.deadline, 'short')}
                                                ${isOverdue ? '<span class="badge bg-danger ms-2">Overdue</span>' : ''}
                                            </td>
                                            <td><span class="badge ${Utils.getBadgeClass(item.status)}">${item.status}</span></td>
                                            <td><span class="badge ${Utils.getBadgeClass(item.priority)}">${item.priority}</span></td>
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

    // Render documents table
    renderDocumentsTable(documents) {
        if (documents.length === 0) {
            return '<div class="card"><div class="card-body text-center py-3 text-muted">ไม่มีเอกสาร</div></div>';
        }

        return `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Document</th>
                                    <th>Customer</th>
                                    <th>Type</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${documents.map(doc => {
            const customer = Storage.getById('customers', doc.customerId);
            return `
                                        <tr>
                                            <td><strong>${doc.documentName}</strong></td>
                                            <td>${customer?.name || 'Unknown'}</td>
                                            <td><span class="badge bg-info">${doc.documentType}</span></td>
                                            <td>${Utils.formatDate(doc.deadline, 'short')}</td>
                                            <td><span class="badge ${Utils.getBadgeClass(doc.status)}">${doc.status}</span></td>
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

    // Show add meeting form
    showAddMeetingForm() {
        this.showMeetingForm();
    },

    // Show meeting form
    showMeetingForm(meeting = null) {
        const isEdit = meeting !== null;
        const title = isEdit ? 'แก้ไขการประชุม' : 'บันทึกการประชุม';

        const formContent = `
            <form id="meetingForm" class="needs-validation" novalidate>
                ${FormsModule.generateFormField({
            type: 'select',
            name: 'customerId',
            label: 'ลูกค้า',
            value: meeting?.customerId || '',
            required: true,
            options: FormsModule.getCustomerOptions()
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'meetingType',
            label: 'ประเภทการประชุม',
            value: meeting?.meetingType || '',
            required: true,
            options: [
                { value: 'VST', label: '📝 Visit (VST)' },
                { value: 'TEC', label: '🔧 Technical (TEC)' },
                { value: 'REQ', label: '📋 Requirement (REQ)' },
                { value: 'FUP', label: '🔄 Follow-up (FUP)' },
                { value: 'OTHER', label: '📌 Other' }
            ]
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'date',
            name: 'meetingDate',
            label: 'วันที่ประชุม',
            value: meeting?.meetingDate || new Date().toISOString().split('T')[0],
            required: true
        })}
                    </div>
                </div>

                ${FormsModule.generateFormField({
            type: 'text',
            name: 'topic',
            label: 'หัวข้อการประชุม',
            value: meeting?.topic || '',
            required: true,
            placeholder: 'เช่น ประชุมเพื่อนำเสนอระบบ HIS'
        })}

                ${FormsModule.generateFormField({
            type: 'textarea',
            name: 'summary',
            label: 'สรุปการประชุม',
            value: meeting?.summary || '',
            required: true,
            rows: 5,
            placeholder: 'สรุปรายละเอียดการประชุม ประเด็นสำคัญ และข้อสรุป'
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'progress',
            label: 'ความคืบหน้า',
            value: meeting?.progress || 'good',
            required: true,
            options: [
                { value: 'great', label: 'ดีมาก (Great)' },
                { value: 'good', label: 'ดี (Good)' },
                { value: 'neutral', label: 'ปานกลาง (Neutral)' },
                { value: 'blocked', label: 'มีอุปสรรค (Blocked)' }
            ]
        })}

                <div class="d-flex gap-2 justify-content-end mt-4">
                    <button type="button" class="btn btn-secondary" onclick="FormsModule.closeModal()">
                        <i class="bi bi-x-circle"></i> ยกเลิก
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-check-circle"></i> บันทึก
                    </button>
                </div>
            </form>
        `;

        FormsModule.showModal(title, formContent);

        const form = document.getElementById('meetingForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('meetingForm')) {
                this.saveMeeting(meeting?.id);
            }
        });
    },

    // Save meeting
    saveMeeting(meetingId = null) {
        const formData = FormsModule.getFormData('meetingForm');
        const isEdit = meetingId !== null;

        try {
            if (isEdit) {
                Storage.update('meetingRecords', meetingId, formData);
                FormsModule.showNotification('บันทึกการประชุมเรียบร้อยแล้ว', 'success');
            } else {
                Storage.add('meetingRecords', formData);
                FormsModule.showNotification('เพิ่มบันทึกการประชุมเรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderList();
        } catch (error) {
            console.error('Error saving meeting:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    }
};

MeetingsModule.init();
console.log('✅ Meetings module loaded');
