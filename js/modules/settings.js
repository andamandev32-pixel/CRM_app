// Settings Module - System Configuration for CRM

const SettingsModule = {
    currentTab: 'pipelines',
    editingTemplate: null,
    editingStages: [],

    // Initialize module
    init() {
        console.log('⚙️ Settings module initialized');
    },

    // Render main settings page
    renderSettings() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <h1><i class="bi bi-gear"></i> ตั้งค่าระบบ</h1>
                    <p class="text-muted mb-0">จัดการ Pipeline Templates และ Tier Configuration</p>
                </div>
                
                <ul class="nav nav-tabs mb-4" id="settingsTabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-tab="pipelines" href="#" onclick="SettingsModule.switchTab('pipelines'); return false;">
                            <i class="bi bi-diagram-3"></i> Pipeline Templates
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-tab="tiers" href="#" onclick="SettingsModule.switchTab('tiers'); return false;">
                            <i class="bi bi-star"></i> Tier Configuration
                        </a>
                    </li>
                </ul>
                
                <div id="settingsContent"></div>
            </div>
        `;

        this.renderPipelineTemplates();
    },

    // Switch tabs
    switchTab(tab) {
        this.currentTab = tab;

        // Update active tab
        document.querySelectorAll('#settingsTabs .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Render content
        if (tab === 'pipelines') {
            this.renderPipelineTemplates();
        } else if (tab === 'tiers') {
            this.renderTierConfig();
        }
    },

    // ========== PIPELINE TEMPLATES ==========

    // Render pipeline templates list
    renderPipelineTemplates() {
        const templates = Storage.get('pipelineTemplates') || [];
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4>Pipeline Templates</h4>
                        <button class="btn btn-primary" onclick="SettingsModule.createPipelineTemplate()">
                            <i class="bi bi-plus-circle"></i> สร้าง Template ใหม่
                        </button>
                    </div>
                    
                    <p class="text-muted mb-3">กำหนด Pipeline แยกตามประเภทโครงการ</p>
                    
                    <!-- Template List -->
                    <div class="list-group">
                        ${templates.map(template => `
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <div class="d-flex align-items-center mb-2">
                                            <h5 class="mb-0">${template.name}</h5>
                                            ${template.isDefault ? '<span class="badge bg-success ms-2">Default</span>' : ''}
                                        </div>
                                        <p class="text-muted mb-2">${template.description}</p>
                                        <div>
                                            <span class="badge bg-secondary">${template.stages.length} stages</span>
                                            ${template.customerTypes.map(t =>
            `<span class="badge bg-info ms-1">${Utils.getCustomerTypeLabel(t)}</span>`
        ).join('')}
                                        </div>
                                        
                                        <!-- Stages Preview -->
                                        <div class="mt-2">
                                            <small class="text-muted">Stages:</small>
                                            <div class="d-flex flex-wrap gap-1 mt-1">
                                                ${template.stages.map(stage => `
                                                    <span class="badge" style="background-color: ${stage.color}">
                                                        ${stage.id}: ${stage.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ms-3">
                                        <button class="btn btn-sm btn-outline-primary" 
                                            onclick="SettingsModule.editPipelineTemplate('${template.id}')">
                                            <i class="bi bi-pencil"></i> แก้ไข
                                        </button>
                                        ${!template.isDefault ? `
                                            <button class="btn btn-sm btn-outline-danger ms-1"
                                                onclick="SettingsModule.deletePipelineTemplate('${template.id}')">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6><i class="bi bi-lightbulb"></i> คำแนะนำ</h6>
                            <ul class="small mb-0">
                                <li>สร้าง Template แยกตามประเภทโครงการ</li>
                                <li>แต่ละ Template มี Stages และ Tasks ของตัวเอง</li>
                                <li>Opportunity จะเลือกใช้ Template ตอนสร้าง</li>
                                <li>ลูกค้า 1 รายสามารถมีหลาย Opportunity ที่ใช้ Pipeline ต่างกันได้</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mt-3">
                        <div class="card-body">
                            <h6><i class="bi bi-info-circle"></i> สถิติการใช้งาน</h6>
                            <p class="small mb-1">จำนวน Templates: <strong>${templates.length}</strong></p>
                            <p class="small mb-0">Default Template: <strong>${templates.find(t => t.isDefault)?.name || 'ไม่มี'}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Create new pipeline template
    createPipelineTemplate() {
        this.editingTemplate = {
            id: '',
            name: '',
            description: '',
            customerTypes: [],
            isDefault: false,
            stages: []
        };
        this.editingStages = [];
        this.showTemplateEditor();
    },

    // Edit existing pipeline template
    editPipelineTemplate(id) {
        const template = Storage.getById('pipelineTemplates', id);
        if (!template) {
            alert('ไม่พบ Template');
            return;
        }

        this.editingTemplate = { ...template };
        this.editingStages = [...template.stages];
        this.showTemplateEditor();
    },

    // Show template editor modal
    showTemplateEditor() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'templateEditorModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            ${this.editingTemplate.id ? 'แก้ไข' : 'สร้าง'} Pipeline Template
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Basic Info -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">ชื่อ Template <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="templateName" 
                                    value="${this.editingTemplate.name}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">คำอธิบาย</label>
                                <input type="text" class="form-control" id="templateDesc" 
                                    value="${this.editingTemplate.description}">
                            </div>
                        </div>
                        
                        <!-- Customer Types -->
                        <div class="mb-3">
                            <label class="form-label">ประเภทลูกค้าที่เหมาะสม</label>
                            <div>
                                ${['army', 'government', 'private', 'clinic'].map(type => `
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" 
                                            value="${type}" id="type_${type}"
                                            ${this.editingTemplate.customerTypes.includes(type) ? 'checked' : ''}>
                                        <label class="form-check-label" for="type_${type}">
                                            ${Utils.getCustomerTypeLabel(type)}
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Default Template -->
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="isDefault"
                                    ${this.editingTemplate.isDefault ? 'checked' : ''}>
                                <label class="form-check-label" for="isDefault">
                                    ตั้งเป็น Default Template
                                </label>
                            </div>
                        </div>
                        
                        <!-- Stages Builder -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0">Stages</label>
                                <button class="btn btn-sm btn-success" onclick="SettingsModule.addStage()">
                                    <i class="bi bi-plus"></i> เพิ่ม Stage
                                </button>
                            </div>
                            
                            <div id="stagesContainer">
                                <!-- Stages will be rendered here -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-primary" onclick="SettingsModule.saveTemplate()">
                            <i class="bi bi-save"></i> บันทึก
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Remove modal from DOM after hiding
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        // Render stages
        this.renderStages();
    },

    // Render stages in editor
    renderStages() {
        const container = document.getElementById('stagesContainer');
        if (!container) return;

        container.innerHTML = this.editingStages.map((stage, index) => `
            <div class="card mb-2 stage-card" data-stage-index="${index}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-2">
                            <label class="form-label small">Stage ID</label>
                            <input type="text" class="form-control form-control-sm" 
                                value="${stage.id}" 
                                onchange="SettingsModule.updateStageField(${index}, 'id', this.value)">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small">ชื่อ Stage</label>
                            <input type="text" class="form-control form-control-sm" 
                                value="${stage.name}"
                                onchange="SettingsModule.updateStageField(${index}, 'name', this.value)">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label small">Probability %</label>
                            <input type="number" class="form-control form-control-sm" 
                                value="${stage.probability}" min="0" max="100"
                                onchange="SettingsModule.updateStageField(${index}, 'probability', parseInt(this.value))">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label small">สี</label>
                            <input type="color" class="form-control form-control-sm form-control-color" 
                                value="${stage.color}"
                                onchange="SettingsModule.updateStageField(${index}, 'color', this.value)">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label small">คำอธิบาย</label>
                            <input type="text" class="form-control form-control-sm" 
                                value="${stage.description || ''}"
                                onchange="SettingsModule.updateStageField(${index}, 'description', this.value)">
                        </div>
                        <div class="col-md-1 text-end">
                            <label class="form-label small">&nbsp;</label>
                            <button class="btn btn-danger btn-sm d-block w-100"
                                onclick="SettingsModule.removeStage(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Tasks/Checklist -->
                    <div class="mt-3">
                        <label class="form-label small">Tasks/Checklist ที่ต้องทำใน Stage นี้</label>
                        <div id="tasks-${index}">
                            ${(stage.tasks || []).map((task, taskIndex) => `
                                <div class="input-group input-group-sm mb-2">
                                    <span class="input-group-text">
                                        <i class="bi bi-check-square"></i>
                                    </span>
                                    <input type="text" class="form-control" value="${task}"
                                        onchange="SettingsModule.updateTask(${index}, ${taskIndex}, this.value)">
                                    <button class="btn btn-outline-danger"
                                        onclick="SettingsModule.removeTask(${index}, ${taskIndex})">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm btn-outline-primary"
                            onclick="SettingsModule.addTask(${index})">
                            <i class="bi bi-plus"></i> เพิ่ม Task
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Add new stage
    addStage() {
        this.editingStages.push({
            id: `S${this.editingStages.length + 1}`,
            name: '',
            description: '',
            probability: 0,
            color: '#6c757d',
            tasks: []
        });
        this.renderStages();
    },

    // Remove stage
    removeStage(index) {
        if (confirm('ต้องการลบ Stage นี้?')) {
            this.editingStages.splice(index, 1);
            this.renderStages();
        }
    },

    // Update stage field
    updateStageField(index, field, value) {
        this.editingStages[index][field] = value;
    },

    // Add task to stage
    addTask(stageIndex) {
        if (!this.editingStages[stageIndex].tasks) {
            this.editingStages[stageIndex].tasks = [];
        }
        this.editingStages[stageIndex].tasks.push('');
        this.renderStages();
    },

    // Update task
    updateTask(stageIndex, taskIndex, value) {
        this.editingStages[stageIndex].tasks[taskIndex] = value;
    },

    // Remove task
    removeTask(stageIndex, taskIndex) {
        this.editingStages[stageIndex].tasks.splice(taskIndex, 1);
        this.renderStages();
    },

    // Save template
    saveTemplate() {
        // Get form values
        const name = document.getElementById('templateName').value.trim();
        const description = document.getElementById('templateDesc').value.trim();
        const isDefault = document.getElementById('isDefault').checked;

        // Get selected customer types
        const customerTypes = [];
        ['army', 'government', 'private', 'clinic'].forEach(type => {
            if (document.getElementById(`type_${type}`).checked) {
                customerTypes.push(type);
            }
        });

        // Validation
        if (!name) {
            alert('กรุณาระบุชื่อ Template');
            return;
        }

        if (this.editingStages.length === 0) {
            alert('กรุณาเพิ่ม Stage อย่างน้อย 1 Stage');
            return;
        }

        // Check for duplicate stage IDs
        const stageIds = this.editingStages.map(s => s.id);
        const duplicates = stageIds.filter((id, index) => stageIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            alert(`พบ Stage ID ซ้ำ: ${duplicates.join(', ')}`);
            return;
        }

        // Prepare template object
        const template = {
            ...this.editingTemplate,
            name,
            description,
            customerTypes,
            isDefault,
            stages: this.editingStages
        };

        // Generate ID if new
        if (!template.id) {
            template.id = `TPL-${Date.now()}`;
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            const templates = Storage.get('pipelineTemplates');
            templates.forEach(t => {
                if (t.id !== template.id) {
                    Storage.update('pipelineTemplates', t.id, { isDefault: false });
                }
            });
        }

        // Save to storage
        if (this.editingTemplate.id) {
            // Update existing
            Storage.update('pipelineTemplates', template.id, template);
        } else {
            // Add new
            Storage.add('pipelineTemplates', template);
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('templateEditorModal'));
        modal.hide();

        // Refresh list
        this.renderPipelineTemplates();

        alert('บันทึก Template สำเร็จ!');
    },

    // Delete pipeline template
    deletePipelineTemplate(id) {
        // Check if template is in use
        const opportunities = Storage.get('opportunities') || [];
        const inUse = opportunities.some(o => o.pipelineTemplateId === id);

        if (inUse) {
            alert('ไม่สามารถลบ Template นี้ได้ เนื่องจากมี Opportunity ที่ใช้งานอยู่');
            return;
        }

        if (confirm('ต้องการลบ Template นี้?')) {
            Storage.delete('pipelineTemplates', id);
            this.renderPipelineTemplates();
        }
    },

    // ========== TIER CONFIGURATION ==========

    // Render tier configuration
    renderTierConfig() {
        const tiers = Storage.get('tierConfig') || [];
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <h4 class="mb-3">Tier Configuration</h4>
                    <p class="text-muted mb-4">กำหนดคุณสมบัติและสิทธิประโยชน์ของแต่ละ Tier</p>
                    
                    <div class="row">
                        ${tiers.map(tier => `
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-header bg-${tier.color} text-white">
                                        <h5 class="mb-0">${tier.name}</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted">${tier.description}</p>
                                        
                                        <h6 class="mt-3">เกณฑ์:</h6>
                                        <ul class="small">
                                            <li>รายได้ขั้นต่ำ: ${Utils.formatCurrency(tier.criteria.minRevenue)}</li>
                                            <li>คะแนนขั้นต่ำ: ${tier.criteria.minScore}</li>
                                            <li>ต้องอนุมัติ: ${tier.criteria.requiresApproval ? 'ใช่' : 'ไม่'}</li>
                                        </ul>
                                        
                                        <h6 class="mt-3">สิทธิประโยชน์:</h6>
                                        <ul class="small">
                                            ${tier.benefits.map(b => `<li>${b}</li>`).join('')}
                                        </ul>
                                        
                                        <p class="small text-muted mb-0">
                                            <i class="bi bi-clock"></i> ทบทวนทุก ${tier.reviewInterval} วัน
                                        </p>
                                    </div>
                                    <div class="card-footer">
                                        <button class="btn btn-sm btn-outline-primary" 
                                            onclick="SettingsModule.editTier('${tier.id}')">
                                            <i class="bi bi-pencil"></i> แก้ไข
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Edit tier (placeholder - can be expanded)
    editTier(id) {
        alert('ฟีเจอร์แก้ไข Tier จะพัฒนาในเฟสถัดไป');
    }
};

SettingsModule.init();
console.log('✅ Settings module loaded');
