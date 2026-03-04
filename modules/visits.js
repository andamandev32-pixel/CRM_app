// Visit Management Module - Enhanced with Forms
const VisitsModule = {
    // Render visit plan page
    renderVisitPlan() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="card-title">แผนการเข้าพบ</h3>
                        <button class="btn btn-primary" onclick="VisitsModule.showAddVisitPlanForm()">
                            <i class="bi bi-plus-circle"></i> เพิ่มแผนการเข้าพบ
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>เดือน/ปี</th>
                                    <th>พนักงานขาย</th>
                                    <th>จำนวนรายการ</th>
                                    <th>งบประมาณ</th>
                                    <th>สถานะ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Storage.get('visitPlans').map(plan => `
                                    <tr>
                                        <td>${plan.month}/${plan.year}</td>
                                        <td>${getUserName(plan.salesId)}</td>
                                        <td>${Storage.query('visitPlanItems', { planId: plan.id }).length}</td>
                                        <td>${formatCurrency(plan.totalBudget)}</td>
                                        <td>${getStatusBadge(plan.status)}</td>
                                        <td>
                                            <button class="btn btn-sm btn-secondary" onclick="VisitsModule.showEditVisitPlanForm('${plan.id}')">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Process Flow Guide -->
            <div style="margin-top: var(--spacing-xl);">
                ${renderProcessFlow('visit-workflow')}
            </div>
            
            ${renderScrollButtons()}
        `;
    },

    // Show add visit plan form
    showAddVisitPlanForm() {
        this.showVisitPlanForm();
    },

    // Show edit visit plan form
    showEditVisitPlanForm(planId) {
        const plan = Storage.getById('visitPlans', planId);
        if (!plan) {
            FormsModule.showNotification('ไม่พบข้อมูลแผนการเข้าพบ', 'error');
            return;
        }
        this.showVisitPlanForm(plan);
    },

    // Show visit plan form
    showVisitPlanForm(plan = null) {
        const isEdit = plan !== null;
        const title = isEdit ? 'แก้ไขแผนการเข้าพบ' : 'เพิ่มแผนการเข้าพบ';

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const formContent = `
            <form id="visitPlanForm" class="needs-validation" novalidate>
                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'month',
            label: 'เดือน',
            value: plan?.month || currentMonth,
            required: true,
            options: [
                { value: 1, label: 'มกราคม' },
                { value: 2, label: 'กุมภาพันธ์' },
                { value: 3, label: 'มีนาคม' },
                { value: 4, label: 'เมษายน' },
                { value: 5, label: 'พฤษภาคม' },
                { value: 6, label: 'มิถุนายน' },
                { value: 7, label: 'กรกฎาคม' },
                { value: 8, label: 'สิงหาคม' },
                { value: 9, label: 'กันยายน' },
                { value: 10, label: 'ตุลาคม' },
                { value: 11, label: 'พฤศจิกายน' },
                { value: 12, label: 'ธันวาคม' }
            ]
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'number',
            name: 'year',
            label: 'ปี (ค.ศ.)',
            value: plan?.year || currentYear,
            required: true,
            min: currentYear,
            max: currentYear + 2
        })}
                    </div>
                </div>

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'salesId',
            label: 'พนักงานขาย',
            value: plan?.salesId || '',
            required: true,
            options: FormsModule.getUserOptions()
        })}

                ${FormsModule.generateFormField({
            type: 'number',
            name: 'totalBudget',
            label: 'งบประมาณรวม (บาท)',
            value: plan?.totalBudget || '',
            required: true,
            min: 0,
            placeholder: '0'
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'status',
            label: 'สถานะ',
            value: plan?.status || 'draft',
            required: true,
            options: [
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
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

        const form = document.getElementById('visitPlanForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('visitPlanForm')) {
                this.saveVisitPlan(plan?.id);
            }
        });
    },

    // Save visit plan
    saveVisitPlan(planId = null) {
        const formData = FormsModule.getFormData('visitPlanForm');
        const isEdit = planId !== null;

        // Convert to numbers
        formData.month = parseInt(formData.month);
        formData.year = parseInt(formData.year);
        formData.totalBudget = parseFloat(formData.totalBudget);

        try {
            if (isEdit) {
                Storage.update('visitPlans', planId, formData);
                FormsModule.showNotification('บันทึกแผนการเข้าพบเรียบร้อยแล้ว', 'success');
            } else {
                Storage.add('visitPlans', formData);
                FormsModule.showNotification('เพิ่มแผนการเข้าพบเรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderVisitPlan();
        } catch (error) {
            console.error('Error saving visit plan:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    },

    // Render visit report page
    renderVisitReport() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="card-title">Visit Report</h3>
                        <button class="btn btn-primary" onclick="VisitsModule.showAddVisitReportForm()">
                            <i class="bi bi-plus-circle"></i> เพิ่มรายงานการเข้าพบ
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    ${Storage.get('visitReports').map(report => `
                        <div class="card" style="margin-bottom: var(--spacing-md);">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div class="font-semibold">${getCustomerName(report.customerId)}</div>
                                    <div class="text-sm" style="color: var(--gray-600);">${formatDate(report.visitDate)}</div>
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                    ${getStatusBadge(report.interest)}
                                    <button class="btn btn-sm btn-secondary" onclick="VisitsModule.showEditVisitReportForm('${report.id}')">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="text-sm" style="margin-top: var(--spacing-md);">${report.summary}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Show add visit report form
    showAddVisitReportForm() {
        this.showVisitReportForm();
    },

    // Show edit visit report form
    showEditVisitReportForm(reportId) {
        const report = Storage.getById('visitReports', reportId);
        if (!report) {
            FormsModule.showNotification('ไม่พบข้อมูลรายงาน', 'error');
            return;
        }
        this.showVisitReportForm(report);
    },

    // Show visit report form
    showVisitReportForm(report = null) {
        const isEdit = report !== null;
        const title = isEdit ? 'แก้ไขรายงานการเข้าพบ' : 'เพิ่มรายงานการเข้าพบ';

        const formContent = `
            <form id="visitReportForm" class="needs-validation" novalidate>
                ${FormsModule.generateFormField({
            type: 'select',
            name: 'customerId',
            label: 'ลูกค้า',
            value: report?.customerId || '',
            required: true,
            options: FormsModule.getCustomerOptions()
        })}

                ${FormsModule.generateFormField({
            type: 'date',
            name: 'visitDate',
            label: 'วันที่เข้าพบ',
            value: report?.visitDate || new Date().toISOString().split('T')[0],
            required: true
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'interest',
            label: 'ระดับความสนใจ',
            value: report?.interest || '',
            required: true,
            options: [
                { value: 'high', label: 'สูง (High)' },
                { value: 'medium', label: 'ปานกลาง (Medium)' },
                { value: 'low', label: 'ต่ำ (Low)' }
            ]
        })}

                ${FormsModule.generateFormField({
            type: 'textarea',
            name: 'summary',
            label: 'สรุปการเข้าพบ',
            value: report?.summary || '',
            required: true,
            rows: 5,
            placeholder: 'สรุปรายละเอียดการเข้าพบ ความต้องการของลูกค้า และแผนติดตามผล'
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

        const form = document.getElementById('visitReportForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('visitReportForm')) {
                this.saveVisitReport(report?.id);
            }
        });
    },

    // Save visit report
    saveVisitReport(reportId = null) {
        const formData = FormsModule.getFormData('visitReportForm');
        const isEdit = reportId !== null;

        try {
            if (isEdit) {
                Storage.update('visitReports', reportId, formData);
                FormsModule.showNotification('บันทึกรายงานเรียบร้อยแล้ว', 'success');
            } else {
                Storage.add('visitReports', formData);
                FormsModule.showNotification('เพิ่มรายงานเรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderVisitReport();
        } catch (error) {
            console.error('Error saving visit report:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    },

    // Render follow-up page
    renderFollowUp() {
        const mainContent = document.getElementById('mainContent');
        const myFollowUps = Storage.query('followUps', { assignedTo: currentUser.id });
        const overdue = myFollowUps.filter(f => f.status === 'overdue');
        const pending = myFollowUps.filter(f => f.status === 'pending');

        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Follow-up Dashboard</h3>
                </div>
                <div class="card-body">
                    ${overdue.length > 0 ? `
                        <h4 style="color: var(--danger); margin-bottom: var(--spacing-md);">🔴 เกินกำหนด (${overdue.length})</h4>
                        ${overdue.map(fu => `
                            <div style="padding: var(--spacing-md); background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--danger); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
                                <div class="flex justify-between">
                                    <div>
                                        <div class="font-semibold">${getCustomerName(fu.customerId)}</div>
                                        <div class="text-sm">${fu.action}</div>
                                    </div>
                                    <button class="btn btn-sm btn-success" onclick="VisitsModule.markFollowUpDone('${fu.id}')">✓ ทำแล้ว</button>
                                </div>
                            </div>
                        `).join('')}
                    ` : ''}
                    
                    ${pending.length > 0 ? `
                        <h4 style="color: var(--warning); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md);">🟡 รอดำเนินการ (${pending.length})</h4>
                        ${pending.map(fu => `
                            <div style="padding: var(--spacing-md); background: rgba(245, 158, 11, 0.05); border-left: 3px solid var(--warning); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
                                <div class="flex justify-between">
                                    <div>
                                        <div class="font-semibold">${getCustomerName(fu.customerId)}</div>
                                        <div class="text-sm">${fu.action}</div>
                                    </div>
                                    <button class="btn btn-sm btn-success" onclick="VisitsModule.markFollowUpDone('${fu.id}')">✓ ทำแล้ว</button>
                                </div>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Mark follow-up as done
    markFollowUpDone(followUpId) {
        try {
            Storage.update('followUps', followUpId, { status: 'completed' });
            FormsModule.showNotification('ทำเครื่องหมายเรียบร้อยแล้ว', 'success');
            this.renderFollowUp();
        } catch (error) {
            console.error('Error updating follow-up:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาด', 'error');
        }
    }
};

// Legacy function wrappers for compatibility
function renderVisitPlan() {
    VisitsModule.renderVisitPlan();
}

function renderVisitReport() {
    VisitsModule.renderVisitReport();
}

function renderFollowUp() {
    VisitsModule.renderFollowUp();
}

function markFollowUpDone(id) {
    VisitsModule.markFollowUpDone(id);
}

console.log('✅ Visits module loaded (enhanced with forms)');
