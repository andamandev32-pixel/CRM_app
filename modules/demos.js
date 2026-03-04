// Demo & Trial Management Module - Enhanced with Forms
const DemosModule = {
    // Render demo request page
    renderDemoRequest() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="card-title">Demo / Trial Requests</h3>
                        <button class="btn btn-primary" onclick="DemosModule.showAddDemoForm()">
                            <i class="bi bi-plus-circle"></i> เพิ่มคำขอ Demo/Trial
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ลูกค้า</th>
                                    <th>ประเภท</th>
                                    <th>สินค้า</th>
                                    <th>ระยะเวลา</th>
                                    <th>สถานะ</th>
                                    <th>ค่าใช้จ่าย</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Storage.get('demoRequests').map(demo => `
                                    <tr>
                                        <td class="font-semibold">${getCustomerName(demo.customerId)}</td>
                                        <td>${getTypeBadge(demo.type)}</td>
                                        <td>${getTypeBadge(demo.product)}</td>
                                        <td class="text-sm">${formatDate(demo.startDate)} - ${formatDate(demo.endDate)}</td>
                                        <td>${getStatusBadge(demo.status)}</td>
                                        <td>${formatCurrency(demo.totalCost)}</td>
                                        <td>
                                            <button class="btn btn-sm btn-secondary" onclick="DemosModule.showEditDemoForm('${demo.id}')">
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
                ${renderProcessFlow('demo-trial')}
            </div>
            
            ${renderScrollButtons()}
        `;
    },

    // Show add demo form
    showAddDemoForm() {
        this.showDemoForm();
    },

    // Show edit demo form
    showEditDemoForm(demoId) {
        const demo = Storage.getById('demoRequests', demoId);
        if (!demo) {
            FormsModule.showNotification('ไม่พบข้อมูลคำขอ Demo/Trial', 'error');
            return;
        }
        this.showDemoForm(demo);
    },

    // Show demo form
    showDemoForm(demo = null) {
        const isEdit = demo !== null;
        const title = isEdit ? 'แก้ไขคำขอ Demo/Trial' : 'เพิ่มคำขอ Demo/Trial';

        const formContent = `
            <form id="demoForm" class="needs-validation" novalidate>
                ${FormsModule.generateFormField({
            type: 'select',
            name: 'customerId',
            label: 'ลูกค้า',
            value: demo?.customerId || '',
            required: true,
            options: FormsModule.getCustomerOptions()
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'type',
            label: 'ประเภท',
            value: demo?.type || '',
            required: true,
            options: [
                { value: 'demo', label: 'Demo' },
                { value: 'trial', label: 'Trial' },
                { value: 'poc', label: 'POC' }
            ]
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'product',
            label: 'สินค้า',
            value: demo?.product || '',
            required: true,
            options: [
                { value: 'HIS', label: 'HIS' },
                { value: 'Queue', label: 'Queue System' },
                { value: 'PACS', label: 'PACS' },
                { value: 'LIS', label: 'LIS' }
            ]
        })}
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'date',
            name: 'startDate',
            label: 'วันที่เริ่มต้น',
            value: demo?.startDate || '',
            required: true
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'date',
            name: 'endDate',
            label: 'วันที่สิ้นสุด',
            value: demo?.endDate || '',
            required: true
        })}
                    </div>
                </div>

                ${FormsModule.generateFormField({
            type: 'number',
            name: 'totalCost',
            label: 'ค่าใช้จ่ายรวม (บาท)',
            value: demo?.totalCost || '',
            required: true,
            min: 0,
            placeholder: '0'
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'status',
            label: 'สถานะ',
            value: demo?.status || 'pending',
            required: true,
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
            ]
        })}

                ${FormsModule.generateFormField({
            type: 'textarea',
            name: 'notes',
            label: 'หมายเหตุ',
            value: demo?.notes || '',
            rows: 3,
            placeholder: 'รายละเอียดเพิ่มเติม'
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

        const form = document.getElementById('demoForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('demoForm')) {
                this.saveDemo(demo?.id);
            }
        });
    },

    // Save demo
    saveDemo(demoId = null) {
        const formData = FormsModule.getFormData('demoForm');
        const isEdit = demoId !== null;

        // Convert to numbers
        formData.totalCost = parseFloat(formData.totalCost);

        try {
            if (isEdit) {
                Storage.update('demoRequests', demoId, formData);
                FormsModule.showNotification('บันทึกคำขอ Demo/Trial เรียบร้อยแล้ว', 'success');
            } else {
                Storage.add('demoRequests', formData);
                FormsModule.showNotification('เพิ่มคำขอ Demo/Trial เรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderDemoRequest();
        } catch (error) {
            console.error('Error saving demo:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    },

    // Render demo progress page
    renderDemoProgress() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ความคืบหน้า Demo/Trial</h3>
                </div>
                <div class="card-body">
                    ${Storage.get('demoProgress').map(progress => {
            const demo = Storage.getById('demoRequests', progress.demoId);
            return `
                            <div class="card" style="margin-bottom: var(--spacing-md);">
                                <div class="font-semibold">${demo ? getCustomerName(demo.customerId) : 'N/A'} - Round ${progress.round}</div>
                                <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">${formatDate(progress.reportDate)}</div>
                                <div style="margin-top: var(--spacing-md);">
                                    <div><strong>สถานะ:</strong> ${progress.usageStatus}</div>
                                    <div><strong>ความพึงพอใจ:</strong> ${progress.satisfaction}</div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }
};

// Legacy function wrappers for compatibility
function renderDemoRequest() {
    DemosModule.renderDemoRequest();
}

function renderDemoProgress() {
    DemosModule.renderDemoProgress();
}

console.log('✅ Demos module loaded (enhanced with forms)');
