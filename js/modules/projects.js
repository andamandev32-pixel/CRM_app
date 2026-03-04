// Projects Module - Module 11 for STS v1.3

const ProjectsModule = {
    // Initialize module
    init() {
        console.log('📊 Projects module initialized');
    },

    // Render projects board
    renderBoard() {
        const projects = Storage.get('projects');
        const stats = this.calculateStats(projects);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-kanban"></i> Project Management</h1>
                        <p class="text-muted mb-0">ติดตามโครงการและ Milestones</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('projects')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-primary" onclick="ProjectsModule.showAddProjectForm()">
                            <i class="bi bi-plus-circle"></i> เพิ่มโครงการ
                        </button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="text-muted mb-1">Active Projects</p>
                                <h3 class="text-primary">${stats.active}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-success">
                            <div class="card-body">
                                <p class="text-muted mb-1">On Track</p>
                                <h3 class="text-success">${stats.onTrack}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-warning">
                            <div class="card-body">
                                <p class="text-muted mb-1">At Risk</p>
                                <h3 class="text-warning">${stats.atRisk}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-danger">
                            <div class="card-body">
                                <p class="text-muted mb-1">Delayed</p>
                                <h3 class="text-danger">${stats.delayed}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Projects Grid -->
                <div class="row g-3">
                    ${projects.map(project => this.renderProjectCard(project)).join('')}
                </div>
            </div>
        `;
    },

    // Calculate stats
    calculateStats(projects) {
        return {
            active: projects.filter(p => p.status === 'active').length,
            onTrack: projects.filter(p => p.healthStatus === 'green').length,
            atRisk: projects.filter(p => p.healthStatus === 'yellow').length,
            delayed: projects.filter(p => p.healthStatus === 'red').length
        };
    },

    // Render project card
    renderProjectCard(project) {
        const customer = Storage.getById('customers', project.customerId);
        const pm = Storage.getById('users', project.pmId);
        const milestones = Storage.query('milestones', { projectId: project.id });
        const issues = Storage.query('projectIssues', { projectId: project.id });

        const completedMilestones = milestones.filter(m => m.status === 'completed').length;
        const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

        const healthColor = {
            'green': 'success',
            'yellow': 'warning',
            'red': 'danger'
        }[project.healthStatus] || 'secondary';

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-${healthColor}">
                    <div class="card-header bg-${healthColor} bg-opacity-10">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1"><strong>${project.projectName}</strong></h6>
                                <small class="text-muted">${customer?.name || 'Unknown'}</small>
                            </div>
                            <span class="badge bg-${healthColor}">${project.healthStatus.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <small class="text-muted">Progress</small>
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar bg-${healthColor}" style="width: ${progress}%">
                                    ${Math.round(progress)}%
                                </div>
                            </div>
                            <small class="text-muted">${completedMilestones}/${milestones.length} milestones</small>
                        </div>
                        
                        <div class="mb-2">
                            <i class="bi bi-person text-muted"></i>
                            <small>PM: ${pm?.name || 'Unknown'}</small>
                        </div>
                        
                        <div class="mb-2">
                            <i class="bi bi-calendar text-muted"></i>
                            <small>Start: ${Utils.formatDate(project.startDate, 'short')}</small>
                        </div>
                        
                        <div class="mb-2">
                            <i class="bi bi-calendar-check text-muted"></i>
                            <small>End: ${Utils.formatDate(project.endDate, 'short')}</small>
                        </div>
                        
                        <div class="d-flex gap-2 mt-3">
                            <span class="badge bg-info">${milestones.length} milestones</span>
                            <span class="badge bg-warning">${issues.filter(i => i.status === 'open').length} issues</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="alert('View project detail')">
                            <i class="bi bi-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Show add project form
    showAddProjectForm() {
        this.showProjectForm();
    },

    // Show project form
    showProjectForm(project = null) {
        const isEdit = project !== null;
        const title = isEdit ? 'แก้ไขโครงการ' : 'เพิ่มโครงการ';

        const formContent = `
            <form id="projectForm" class="needs-validation" novalidate>
                ${FormsModule.generateFormField({
            type: 'text',
            name: 'projectName',
            label: 'ชื่อโครงการ',
            value: project?.projectName || '',
            required: true,
            placeholder: 'เช่น ติดตั้งระบบ HIS โรงพยาบาลศิริราช'
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'customerId',
            label: 'ลูกค้า',
            value: project?.customerId || '',
            required: true,
            options: FormsModule.getCustomerOptions()
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'product',
            label: 'ผลิตภัณฑ์',
            value: project?.product || '',
            required: true,
            options: [
                { value: 'HIS', label: 'HIS' },
                { value: 'Queue', label: 'Queue System' },
                { value: 'PACS', label: 'PACS' },
                { value: 'LIS', label: 'LIS' }
            ]
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'number',
            name: 'contractValue',
            label: 'มูลค่าสัญญา (บาท)',
            value: project?.contractValue || '',
            required: true,
            min: 0,
            placeholder: '0'
        })}
                    </div>
                </div>

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'pmId',
            label: 'Project Manager',
            value: project?.pmId || '',
            required: true,
            options: FormsModule.getUserOptions()
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'date',
            name: 'startDate',
            label: 'วันที่เริ่มต้น',
            value: project?.startDate || '',
            required: true
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'date',
            name: 'endDate',
            label: 'วันที่สิ้นสุด (แผน)',
            value: project?.endDate || '',
            required: true
        })}
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'status',
            label: 'สถานะ',
            value: project?.status || 'planning',
            required: true,
            options: [
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'closed', label: 'Closed' }
            ]
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'healthStatus',
            label: 'Health Status',
            value: project?.healthStatus || 'green',
            required: true,
            options: [
                { value: 'green', label: '🟢 Green (On Track)' },
                { value: 'yellow', label: '🟡 Yellow (At Risk)' },
                { value: 'red', label: '🔴 Red (Delayed)' }
            ]
        })}
                    </div>
                </div>

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

        const form = document.getElementById('projectForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('projectForm')) {
                this.saveProject(project?.id);
            }
        });
    },

    // Save project
    saveProject(projectId = null) {
        const formData = FormsModule.getFormData('projectForm');
        const isEdit = projectId !== null;

        // Convert to numbers
        formData.contractValue = parseFloat(formData.contractValue);

        try {
            if (isEdit) {
                Storage.update('projects', projectId, formData);
                FormsModule.showNotification('บันทึกโครงการเรียบร้อยแล้ว', 'success');
            } else {
                Storage.add('projects', formData);
                FormsModule.showNotification('เพิ่มโครงการเรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderBoard();
        } catch (error) {
            console.error('Error saving project:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    }
};

ProjectsModule.init();
console.log('✅ Projects module loaded');
