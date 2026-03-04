// Pipeline Module - Sales Pipeline Management for STS v1.4
// รองรับ S0-S9, B0-B4, Product Groups, Expected Revenue

const PipelineModule = {
    // Initialize module
    init() {
        console.log('🎯 Pipeline module initialized (v1.4)');
    },

    // Pipeline Stages Definition (S0-S8)
    STAGES: [
        { id: 'S0', name: 'Target Identified', nameTH: 'ระบุเป้าหมาย (ยังไม่ได้ติดต่อ)', probability: 0, description: 'ระบุเป้าหมาย (ยังไม่ได้ติดต่อ)' },
        { id: 'S1', name: 'Initial Meeting', nameTH: 'ติดต่อและเข้าพบเบื้องต้น', probability: 5, description: 'ติดต่อและเข้าพบเบื้องต้น' },
        { id: 'S2', name: 'Requirement', nameTH: 'สำรวจความต้องการ', probability: 10, description: 'สำรวจความต้องการและปัญหา (Pain Points)' },
        { id: 'S3', name: 'Demo/Workshop', nameTH: 'นำเสนอ/สาธิตระบบให้ลูกค้าดู', probability: 20, description: 'นำเสนอ/สาธิตระบบให้ลูกค้าดู (ถ้ามีความต้องการ)' },
        { id: 'S4', name: 'TOR Drafting/Proposal', nameTH: 'ร่าง TOR/ใบเสนอราคา', probability: 35, description: 'เราร่างขอบเขตงาน (TOR)/ใบเสนอราคา' },
        { id: 'S5', name: 'Quotation Consideration', nameTH: 'พิจารณา ใบเสนอราคา', probability: 50, description: 'ทางเราเสนองานไว้รอลูกค้าพิจารณา ให้ sale ติดตามผล' },
        { id: 'S6', name: 'Waiting Procurement', nameTH: 'รอกระบวนการจัดซื้อของลูกค้า', probability: 70, description: 'รอกระบวนการจัดซื้อของลูกค้า (ผ่านงบประมาณนำเข้าแผนจัดซื้อ)' },
        { id: 'S7', name: 'Procurement', nameTH: 'ลูกค้ากำลังดำเนินการจัดซื้อ/e-bidding', probability: 85, description: 'ลูกค้ากำลังดำเนินการจัดซื้อ/e-bidding' },
        { id: 'S8_WON', name: 'Closed Won', nameTH: 'ชนะโครงการ/ปิดการขายสำเร็จ', probability: 100, description: 'ชนะโครงการ/ปิดการขายสำเร็จ' },
        { id: 'S9', name: 'Closed Lost', nameTH: 'ไม่สำเร็จ/สูญเสียโครงการ', probability: 0, description: 'ไม่สำเร็จ/สูญเสียโครงการ' }
    ],

    // Budget Readiness (B0-B4)
    BUDGET_CODES: {
        'Level 1': { name: 'Level 1', nameTH: 'มีงบปี 69 รอประมูล', emoji: '✅', color: '#34D399', weight: 0.85 },
        'Level 2': { name: 'Level 2', nameTH: 'อยู่ในแผนงบประมาณจริงแล้ว', emoji: '📋', color: '#60A5FA', weight: 0.60 },
        'Level 3': { name: 'Level 3', nameTH: 'ตั้งเป้า Push เข้าแผนงบปี', emoji: '🎯', color: '#FBBF24', weight: 0.30 },
        'Level 4': { name: 'Level 4', nameTH: 'มีความต้องการ ยังไม่วางแผน', emoji: '💭', color: '#9CA3AF', weight: 0.10 },
        'Level 5': { name: 'Level 5', nameTH: 'จัดหาด่วน ไม่อยู่ในแผน', emoji: '🚀', color: '#F472B6', weight: 1.00 }
    },

    // Product Group definitions
    PRODUCT_GROUPS: {
        'MEDIQ': { name: 'MEDIQ Platform', emoji: '🏥', color: '#8B5CF6', products: ['MediQ', 'Queue'] },
        'HIS': { name: 'Hospital IS', emoji: '🖥️', color: '#3B82F6', products: ['HIS', 'MediCore'] },
        'ERP': { name: 'ERP', emoji: '📊', color: '#10B981', products: ['ERP'] },
        'Custom': { name: 'Custom Solutions', emoji: '🔧', color: '#F59E0B', products: ['ระบบระบาดวิทยา', 'Custom', 'Both'] }
    },

    STAGE_COLORS: {
        'S0': '#9CA3AF', 'S1': '#60A5FA', 'S2': '#818CF8', 'S3': '#A78BFA',
        'S4': '#F59E0B', 'S5': '#F97316', 'S6': '#FB923C', 'S7': '#EF4444',
        'S8_WON': '#22C55E', 'S9': '#6B7280'
    },

    // Calculate expected revenue
    calculateExpectedRevenue(value, stageId, budgetCode) {
        const stage = this.STAGES.find(s => s.id === stageId);
        const budget = this.BUDGET_CODES[budgetCode || 'Level 4'];
        if (!stage || !budget) return 0;
        return Math.round(value * (stage.probability / 100) * budget.weight);
    },

    // Current Filters
    currentGroupFilter: 'ALL',
    currentCustomerGroupFilter: 'ALL',
    currentBudgetFilter: 'ALL',

    // Set filter and re-render
    setGroupFilter(group) {
        this.currentGroupFilter = group;
        this.renderBoard();
    },
    setCustomerGroupFilter(group) {
        this.currentCustomerGroupFilter = group;
        this.renderBoard();
    },
    setBudgetFilter(budget) {
        this.currentBudgetFilter = budget;
        this.renderBoard();
    },

    // Reload data from CSV and refresh board
    async reloadData() {
        const btn = document.querySelector('button[onclick="PipelineModule.reloadData()"]');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
        }
        try {
            // Clear all stored data
            Storage.clearAll();
            Storage.init();
            if (window.localStorage) {
                window.localStorage.removeItem('mockDataVersion');
                window.localStorage.setItem('sts_last_import_date', new Date().toISOString());
                window.localStorage.setItem('sts_last_import_file', 'hospital_budget_status_update_ก.พ.69.xlsx');
            }
            // Regenerate
            await MockData.generate();
            // Re-render board
            this.renderBoard();
            // Show success toast
            this._showToast('✅ โหลดข้อมูลเริ่มต้นใหม่สำเร็จแล้ว!', 'success');
        } catch (e) {
            console.error('Reload failed:', e);
            this._showToast('❌ เกิดข้อผิดพลาด กรุณาลองใหม่', 'danger');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
            }
        }
    },

    // Handle file upload from local machine
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const btn = document.querySelector('label[for="importFileInput"]');
        const originalText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> กำลังประมวลผล...';
            btn.style.pointerEvents = 'none';
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                // Requires SheetJS (xlsx package) which is loaded in index.html
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

                // Clear existing and regenerate base data
                Storage.clearAll();
                Storage.init();
                MockData.generatePipelineTemplates();
                MockData.generateTierConfig();
                MockData.generateUsers();

                // Parse newly uploaded rows
                MockData.parseOpportunitiesFromRows(rows);

                MockData.generatePricingPolicy();

                if (window.localStorage) {
                    window.localStorage.setItem('sts_last_import_date', new Date().toISOString());
                    window.localStorage.setItem('sts_last_import_file', file.name);
                }

                // Re-render board
                this.renderBoard();
                this._showToast('✅ สร้าง Dashboard จากไฟล์สำเร็จแล้ว!', 'success');

                // Update file name display if the element is present in the newly rendered board
                const fileNameDisplay = document.getElementById('importedFileName');
                if (fileNameDisplay) {
                    fileNameDisplay.innerHTML = `สร้าง Dashboard จากไฟล์ <code>${file.name}</code>`;
                }
            } catch (err) {
                console.error('File parsing failed:', err);
                this._showToast('❌ เกิดข้อผิดพลาดในการอ่านไฟล์', 'danger');
            } finally {
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = 'auto';
                }
                event.target.value = ''; // Reset file input
            }
        };
        reader.readAsArrayBuffer(file);
    },

    // Show toast notification
    _showToast(message, type = 'success') {
        const id = 'pipelineToast_' + Date.now();
        const html = `
            <div id="${id}" class="toast align-items-center text-bg-${type} border-0 position-fixed" style="bottom: 1.5rem; right: 1.5rem; z-index: 9999; min-width: 260px;" role="alert">
                <div class="d-flex">
                    <div class="toast-body fw-bold">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        const el = document.getElementById(id);
        const toast = new bootstrap.Toast(el, { delay: 3000 });
        toast.show();
        el.addEventListener('hidden.bs.toast', () => el.remove());
    },

    // Get product group key for a product
    getProductGroupKey(product) {
        for (const [key, group] of Object.entries(this.PRODUCT_GROUPS)) {
            if (group.products.includes(product)) return key;
        }
        return 'Custom';
    },

    // Render budget badge
    renderBudgetBadge(budgetCode) {
        const b = this.BUDGET_CODES[budgetCode];
        if (!b) return '<span class="badge bg-secondary">N/A</span>';
        return `<span class="badge" style="background:${b.color};color:white" title="${b.nameTH}">${b.emoji} ${budgetCode}</span>`;
    },

    // Render product group badge
    renderProductGroupBadge(groupKey) {
        const g = this.PRODUCT_GROUPS[groupKey];
        if (!g) return '';
        return `<span class="badge" style="background:${g.color};color:white">${g.emoji} ${g.name}</span>`;
    },

    // Render stage badge
    renderStageBadge(stageId) {
        const color = this.STAGE_COLORS[stageId] || '#9CA3AF';
        const stage = this.STAGES.find(s => s.id === stageId);
        return `<span class="badge" style="background:${color};color:white">${stageId}: ${stage ? stage.name : ''}</span>`;
    },

    // Render pipeline board (Kanban)
    renderBoard() {
        let opportunities = Storage.get('opportunities') || [];

        // Filter by Product Group if not ALL
        if (this.currentGroupFilter !== 'ALL') {
            opportunities = opportunities.filter(o =>
                (o.productGroup || this.getProductGroupKey(o.product)) === this.currentGroupFilter
            );
        }

        // Filter by Customer Group if not ALL
        if (this.currentCustomerGroupFilter !== 'ALL') {
            opportunities = opportunities.filter(o => {
                const customer = Storage.getById('customers', o.customerId);
                let custGroup = customer ? customer.customerGroup : '';

                // Fallback for missing customerGroup property
                if (!custGroup && customer && customer.type) {
                    if (customer.type === 'army') custGroup = 'ทหารบก';
                    else if (customer.type === 'private') custGroup = 'รพ.เอกชน';
                    else custGroup = 'รพ.รัฐ';
                }

                return custGroup === this.currentCustomerGroupFilter;
            });
        }

        // Filter by Budget Level if not ALL
        if (this.currentBudgetFilter !== 'ALL') {
            opportunities = opportunities.filter(o =>
                (o.budgetCode || 'Level 4') === this.currentBudgetFilter
            );
        }

        const stats = this.getPipelineStats(opportunities);
        const activeStages = this.STAGES; // Show all S0-S8

        let lastImportDateStr = 'ยังไม่มีข้อมูล';
        let lastImportFile = 'hospital_budget_status_update_ก.พ.69.xlsx';
        if (window.localStorage) {
            const dateIso = window.localStorage.getItem('sts_last_import_date');
            if (dateIso) {
                const d = new Date(dateIso);
                lastImportDateStr = `${d.toLocaleDateString('th-TH')} เวลา ${d.toLocaleTimeString('th-TH')}`;
            }
            const file = window.localStorage.getItem('sts_last_import_file');
            if (file) {
                lastImportFile = file;
            }
        }

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-funnel"></i> Sales Pipeline V1.0</h1>
                        <p class="text-muted mb-0">ติดตามโอกาสทางการขาย — S0-S8 | Level 1-5</p>
                    </div>
                    <div class="d-flex align-items-center gap-3 flex-wrap justify-content-end">
                        <div class="d-flex gap-2 flex-wrap">
                            <select class="form-select w-auto" onchange="PipelineModule.setCustomerGroupFilter(this.value)">
                                <option value="ALL" ${this.currentCustomerGroupFilter === 'ALL' ? 'selected' : ''}>กลุ่มลูกค้า: ทั้งหมด</option>
                                <option value="ทหารบก" ${this.currentCustomerGroupFilter === 'ทหารบก' ? 'selected' : ''}>รพ.กองทัพบก</option>
                                <option value="รพ.รัฐ" ${this.currentCustomerGroupFilter === 'รพ.รัฐ' ? 'selected' : ''}>รพ.รัฐบาลอื่นๆ</option>
                                <option value="รพ.เอกชน" ${this.currentCustomerGroupFilter === 'รพ.เอกชน' ? 'selected' : ''}>รพ.เอกชน</option>
                            </select>
                            <select class="form-select w-auto" onchange="PipelineModule.setGroupFilter(this.value)">
                                <option value="ALL" ${this.currentGroupFilter === 'ALL' ? 'selected' : ''}>กลุ่มผลิตภัณฑ์: ทั้งหมด</option>
                                <option value="MEDIQ" ${this.currentGroupFilter === 'MEDIQ' ? 'selected' : ''}>MediQ Platform</option>
                                <option value="HIS" ${this.currentGroupFilter === 'HIS' ? 'selected' : ''}>MediCore HIS</option>
                                <option value="ERP" ${this.currentGroupFilter === 'ERP' ? 'selected' : ''}>EPR</option>
                                <option value="Custom" ${this.currentGroupFilter === 'Custom' ? 'selected' : ''}>Custom Solution</option>
                            </select>
                            <select class="form-select w-auto" onchange="PipelineModule.setBudgetFilter(this.value)">
                                <option value="ALL" ${this.currentBudgetFilter === 'ALL' ? 'selected' : ''}>งบประมาณ: ทั้งหมด</option>
                                <option value="Level 1" ${this.currentBudgetFilter === 'Level 1' ? 'selected' : ''}>Level 1: ปี 69 Wait</option>
                                <option value="Level 2" ${this.currentBudgetFilter === 'Level 2' ? 'selected' : ''}>Level 2: แผนจริง</option>
                                <option value="Level 3" ${this.currentBudgetFilter === 'Level 3' ? 'selected' : ''}>Level 3: เป้าหมาย</option>
                                <option value="Level 4" ${this.currentBudgetFilter === 'Level 4' ? 'selected' : ''}>Level 4: ความต้องการ</option>
                                <option value="Level 5" ${this.currentBudgetFilter === 'Level 5' ? 'selected' : ''}>Level 5: จัดหาด่วน</option>
                            </select>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-info" onclick="PipelineModule.showDefinitionsModal()" title="คู่มือ S0-S8 & Budget">
                                <i class="bi bi-info-circle"></i> คำอธิบาย Status
                            </button>
                            <button class="btn btn-primary" onclick="PipelineModule.renderAddForm()">
                                <i class="bi bi-plus-circle"></i> เพิ่ม Opportunity
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-12 col-md-6 col-xl">
                        <div class="card bg-light border-primary" style="border-width: 2px; cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('wip')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">📊 Work in Process</p>
                                <h4 class="text-primary mb-0">${Utils.formatCurrency(stats.wipValue)}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">${stats.wipCount} รายการติดตาม</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl">
                        <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('budget69')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">💰 ลูกค้าที่มีงบปี 69</p>
                                <h4 class="text-success mb-0">${Utils.formatCurrency(stats.budget69Value)}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">${stats.budget69Count} โครงการ</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl">
                        <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('budget70')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">📈 งบปี 70 (เข้าแผน)</p>
                                <h4 class="text-info mb-0">${Utils.formatCurrency(stats.budget70PlannedValue)}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">${stats.budget70PlannedCount} โครงการ</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl">
                        <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('s5')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">📄 รอพิจารณาเสนอราคา</p>
                                <h4 class="text-secondary mb-0">${stats.s5Count || 0}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">S5: พิจารณาใบเสนอราคา</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl">
                        <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('demoReq')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">🎯 1. ลูกค้าขอ Demo/Trial</p>
                                <h4 class="text-warning mb-0">${stats.demoRequestCount}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">มีคำขอ Demo/Trial</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-xl d-md-none d-xl-block">
                        <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('demoAct')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">🚀 2. กำลัง Demo/Workshop</p>
                                <h4 class="text-danger mb-0">${stats.demoActiveCount}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">S3: Demo/Workshop</small>
                            </div>
                        </div>
                    </div>
                    <!-- Extra column just for tablet to align evenly 6 and 6 and 1 full or 3 and 3 depends -->
                    <div class="col-12 d-none d-md-block d-xl-none">
                         <div class="card shadow-sm stat-card" style="cursor: pointer; transition: transform 0.2s;" onclick="PipelineModule.renderStatsDrawer('demoAct')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="card-body py-3 px-2 text-center h-100">
                                <p class="text-muted mb-1 fw-bold" style="font-size: 0.85rem;">🚀 2. กำลัง Demo/Workshop</p>
                                <h4 class="text-danger mb-0">${stats.demoActiveCount}</h4>
                                <small class="text-muted" style="font-size: 0.75rem;">S3: Demo/Workshop</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Pipeline Kanban Board -->
                <div class="pipeline-board">
                    <div class="d-flex gap-3" style="overflow-x: auto; padding-bottom: 1rem;">
                        ${activeStages.map(stage => this.renderStageColumn(stage, opportunities)).join('')}
                    </div>
                </div>

                <!-- Reload Data Footer -->
                <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                    <div>
                        <small class="text-muted d-block mb-1"><i class="bi bi-info-circle"></i> <span id="importedFileName">ข้อมูลดึงล่าสุดจากไฟล์ <code>${lastImportFile}</code></span> — สามารถอัพโหลดไฟล์จากในเครื่องเพื่อสร้าง Dashboard ใหม่</small>
                        <small class="text-muted fw-bold"><i class="bi bi-clock-history"></i> อัปเดตข้อมูลล่าสุดเมื่อ: ${lastImportDateStr}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <input type="file" id="importFileInput" accept=".csv, .xlsx, .xls" style="display: none;" onchange="PipelineModule.handleFileUpload(event)">
                        <button class="btn btn-outline-secondary" onclick="PipelineModule.reloadData()" title="โหลดข้อมูลเริ่มต้นใหม่">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <label for="importFileInput" class="btn btn-warning mb-0" style="cursor: pointer;" title="นำเข้าข้อมูลใหม่จากไฟล์ที่เลือกเครื่อง">
                            <i class="bi bi-upload"></i> นำเข้าข้อมูลใหม่
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    // Render stage column
    renderStageColumn(stageDef, allOpportunities) {
        const opportunities = allOpportunities.filter(o => o.stage === stageDef.id);
        const totalValue = opportunities.reduce((sum, o) => sum + (o.value || 0), 0);
        const stageColor = this.STAGE_COLORS[stageDef.id] || '#9CA3AF';

        return `
            <div style="width: 280px; min-width: 280px; flex-shrink: 0;">
                <div class="card h-100">
                    <div class="card-header bg-light" style="border-top: 3px solid ${stageColor};">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="mb-0 fw-bold">${stageDef.id}: ${stageDef.name}</h6>
                            <span class="badge bg-secondary rounded-pill">${opportunities.length}</span>
                        </div>
                        <div class="small text-muted mb-1" style="font-size: 0.7rem; line-height: 1.2;">
                            ${stageDef.nameTH} | Prob: ${stageDef.probability}%
                        </div>
                        <div class="fw-bold text-primary small">
                            ${Utils.formatCurrency(totalValue)}
                        </div>
                    </div>
                    <div class="card-body p-2 bg-light bg-opacity-10" style="min-height: 300px; max-height: 500px; overflow-y: auto;">
                        ${opportunities.length === 0 ? `
                            <div class="text-center py-4 text-muted">
                                <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                                <small>ไม่มีรายการ</small>
                            </div>
                        ` : opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Render opportunity card
    renderOpportunityCard(opp) {
        const customer = Storage.getById('customers', opp.customerId);
        const budgetCode = opp.budgetCode || 'Level 4';
        const productGroup = opp.productGroup || this.getProductGroupKey(opp.product);
        const expectedRev = this.calculateExpectedRevenue(opp.value || 0, opp.stage, budgetCode);

        return `
            <div class="card mb-2 shadow-sm" style="cursor: pointer;" onclick="PipelineModule.renderDetail('${opp.id}')">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <strong class="small">${customer?.name || 'Unknown'}</strong>
                        <span class="badge ${Utils.getBadgeClass(opp.interest)} badge-sm">${opp.interest}</span>
                    </div>
                    <div class="d-flex gap-1 flex-wrap mb-1">
                        ${this.renderProductGroupBadge(productGroup)}
                        ${this.renderBudgetBadge(budgetCode)}
                    </div>
                    ${opp.value > 0 ? `
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-primary small">${Utils.formatCurrency(opp.value)}</strong>
                        </div>
                    ` : '<small class="text-muted">ยังไม่ระบุมูลค่า</small>'}
                    ${expectedRev > 0 ? `<div class="small text-success mb-1">Expected: ${Utils.formatCurrency(expectedRev)}</div>` : ''}
                    ${opp.remark || opp.detail ? `
                        <div class="small text-muted mt-1 p-1 bg-light rounded" style="font-size: 0.75rem; border-left: 2px solid #ffc107;">
                            <i class="bi bi-chat-text text-warning"></i> ${opp.remark || opp.detail || ''}
                        </div>
                    ` : ''}
                    <div class="mt-1" title="วันที่เข้าพื้นที่ หรืออัปเดตข้อมูลล่าสุด">
                        <small class="text-muted">
                            <i class="bi bi-clock-history"></i> ล่าสุด: ${Utils.formatDate(opp.updatedAt || opp.createdAt, 'short')}
                        </small>
                    </div>
                </div>
            </div>
        `;
    },

    // Render opportunity detail
    renderDetail(oppId) {
        const opp = Storage.getById('opportunities', oppId);
        if (!opp) return;

        const customer = Storage.getById('customers', opp.customerId);
        const budgetCode = opp.budgetCode || 'Level 4';
        const productGroup = opp.productGroup || this.getProductGroupKey(opp.product);
        const expectedRev = this.calculateExpectedRevenue(opp.value || 0, opp.stage, budgetCode);
        const stageDef = this.STAGES.find(s => s.id === opp.stage);
        const budgetDef = this.BUDGET_CODES[budgetCode];

        let stageHistory = [];
        try { stageHistory = typeof opp.stageHistory === 'string' ? JSON.parse(opp.stageHistory) : (opp.stageHistory || []); } catch (e) { }

        // Create Offcanvas if it doesn't exist
        let offcanvasEl = document.getElementById('pipelineDetailOffcanvas');
        if (!offcanvasEl) {
            offcanvasEl = document.createElement('div');
            offcanvasEl.id = 'pipelineDetailOffcanvas';
            offcanvasEl.className = 'offcanvas offcanvas-end shadow';
            offcanvasEl.tabIndex = -1;
            offcanvasEl.style.width = '550px';
            document.body.appendChild(offcanvasEl);
        }

        offcanvasEl.innerHTML = `
            <div class="offcanvas-header bg-light border-bottom">
                <h5 class="offcanvas-title fw-bold">
                    <i class="bi bi-file-earmark-text"></i> รายละเอียดโครงการ
                </h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body" style="background-color: #f8f9fa;">
                <div class="mb-3">
                    <h4 class="mb-1">${customer?.name || 'Unknown'}</h4>
                    <div class="d-flex gap-2 flex-wrap mt-2">
                        ${this.renderProductGroupBadge(productGroup)}
                        ${this.renderStageBadge(opp.stage)}
                        ${this.renderBudgetBadge(budgetCode)}
                        <span class="badge ${Utils.getBadgeClass(opp.interest)}">${opp.interest}</span>
                    </div>
                </div>
                
                <div class="card mb-3 shadow-sm border-0 bg-white">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="text-muted small">มูลค่า</label>
                                <div class="fw-bold fs-5 text-primary">${opp.value > 0 ? Utils.formatCurrency(opp.value) : 'ยังไม่ระบุ'}</div>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small">Expected Revenue</label>
                                <div class="fw-bold fs-5 text-success">${Utils.formatCurrency(expectedRev)}</div>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small">ผลิตภัณฑ์</label>
                                <div class="fw-bold">${opp.product}</div>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small">Stage Probability</label>
                                <div class="fw-bold">${stageDef?.probability || 0}%</div>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small">ปีงบประมาณ</label>
                                <div class="fw-bold">${opp.budgetYear || 'ยังไม่ระบุ'}</div>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small">พนักงานขาย</label>
                                <div class="fw-bold">${opp.assignedTo}</div>
                            </div>
                        </div>
                        ${opp.salesStatus ? `
                            <div class="mt-3 p-3 bg-light rounded border">
                                <label class="text-muted small">สถานะ Sale</label>
                                <div class="fw-bold">${opp.salesStatus}</div>
                            </div>
                        ` : ''}
                        ${opp.remark ? `
                            <div class="mt-2 p-3 bg-light rounded border">
                                <label class="text-muted small">หมายเหตุ</label>
                                <div>${opp.remark}</div>
                            </div>
                        ` : ''}
                        ${opp.detail ? `
                            <div class="mt-2 p-3 bg-light rounded border">
                                <label class="text-muted small">รายละเอียด</label>
                                <div>${opp.detail}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white fw-bold"><i class="bi bi-clock-history"></i> ประวัติ Stage</div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            ${stageHistory.map(h => {
            const color = this.STAGE_COLORS[h.stage] || '#9CA3AF';
            const s = this.STAGES.find(s => s.id === h.stage);
            return `
                                    <li class="list-group-item bg-transparent">
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="badge rounded-pill" style="background:${color};color:white;min-width:32px;">${h.stage}</span>
                                            <div>
                                                <div class="fw-bold small">${s?.name || h.stage}</div>
                                                <div class="text-muted small">${h.reason || ''}</div>
                                                <div class="text-muted" style="font-size:0.75rem;">${Utils.formatDate(h.date, 'short')}</div>
                                            </div>
                                        </div>
                                    </li>
                                `;
        }).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        if (window.bootstrap && bootstrap.Offcanvas) {
            const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
            offcanvas.show();
        } else {
            console.error('Bootstrap Offcanvas is missing!');
        }
    },

    // Render stats specific drawer list
    renderStatsDrawer(type) {
        let opportunities = Storage.get('opportunities') || [];

        // Apply Global Filters before we do specific stat checking so the drawer matches active filters!
        if (this.currentGroupFilter !== 'ALL') {
            opportunities = opportunities.filter(o => (o.productGroup || this.getProductGroupKey(o.product)) === this.currentGroupFilter);
        }
        if (this.currentCustomerGroupFilter !== 'ALL') {
            opportunities = opportunities.filter(o => {
                const customer = Storage.getById('customers', o.customerId);
                let custGroup = customer ? customer.customerGroup : '';
                if (!custGroup && customer && customer.type) {
                    if (customer.type === 'army') custGroup = 'ทหารบก';
                    else if (customer.type === 'private') custGroup = 'รพ.เอกชน';
                    else custGroup = 'รพ.รัฐ';
                }
                return custGroup === this.currentCustomerGroupFilter;
            });
        }
        if (this.currentBudgetFilter !== 'ALL') {
            opportunities = opportunities.filter(o => (o.budgetCode || 'Level 4') === this.currentBudgetFilter);
        }

        let filteredOpps = [];
        let title = '';
        let icon = '';
        let colorTheme = 'primary';
        let totalVal = 0;

        switch (type) {
            case 'wip':
                filteredOpps = opportunities.filter(o => {
                    const remarkText = (o.remark || o.detail || o.salesStatus || '').toLowerCase();
                    return remarkText.includes('work in process');
                });
                title = 'Work in Process';
                icon = 'bi-bar-chart-fill';
                totalVal = filteredOpps.reduce((sum, o) => sum + (o.value || 0), 0);
                break;
            case 'budget69':
                filteredOpps = opportunities.filter(o => o.budgetYear === '2569');
                title = 'ลูกค้าที่มีงบปี 69';
                icon = 'bi-cash-coin';
                colorTheme = 'success';
                totalVal = filteredOpps.reduce((sum, o) => sum + (o.value || 0), 0);
                break;
            case 'budget70':
                filteredOpps = opportunities.filter(o => o.budgetYear === '2570' && ['Level 1', 'Level 2'].includes(o.budgetCode));
                title = 'ลูกค้าที่มีงบปี 70 (เข้าแผนแล้ว)';
                icon = 'bi-graph-up-arrow';
                colorTheme = 'info';
                totalVal = filteredOpps.reduce((sum, o) => sum + (o.value || 0), 0);
                break;
            case 's5':
                filteredOpps = opportunities.filter(o => o.stage === 'S5');
                title = 'รอพิจารณาใบเสนอราคา (S5)';
                icon = 'bi-file-earmark-text';
                colorTheme = 'secondary';
                totalVal = filteredOpps.reduce((sum, o) => sum + (o.value || 0), 0);
                break;
            case 'demoReq':
            case 'demoReq':
                filteredOpps = opportunities.filter(o => {
                    const remarkText = (o.remark || '').toLowerCase();
                    const hasKeyword = remarkText.includes('ขอ demo') ||
                        remarkText.includes('ขอ trial') ||
                        remarkText.includes('ขอdemo') ||
                        remarkText.includes('ขอtrial');
                    return hasKeyword && o.stage !== 'S3';
                });
                title = '1. ลูกค้าขอ Demo / Trial';
                icon = 'bi-bullseye';
                colorTheme = 'warning';
                break;
            case 'demoAct':
            case 'demoAct':
                filteredOpps = opportunities.filter(o => {
                    const remarkText = (o.remark || '').toLowerCase();
                    const isDemoAct = remarkText.includes('กำลัง demo') ||
                        remarkText.includes('กำลัง trial') ||
                        remarkText.includes('อยู่ระหว่าง demo') ||
                        remarkText.includes('อยู่ระหว่าง trial') ||
                        remarkText.includes('อยู่ในระหว่าง demo') ||
                        remarkText.includes('อยู่ในระหว่าง trial') ||
                        remarkText.includes('กำลังdemo') ||
                        remarkText.includes('กำลังtrial');
                    return o.stage === 'S3' || isDemoAct;
                });
                title = '2. กำลัง Demo / Workshop';
                icon = 'bi-controller';
                colorTheme = 'danger';
                break;
        }

        let offcanvasEl = document.getElementById('pipelineStatsOffcanvas');
        if (!offcanvasEl) {
            offcanvasEl = document.createElement('div');
            offcanvasEl.id = 'pipelineStatsOffcanvas';
            offcanvasEl.className = 'offcanvas offcanvas-end shadow-lg';
            offcanvasEl.tabIndex = -1;
            offcanvasEl.style.width = '600px';
            document.body.appendChild(offcanvasEl);
        }

        offcanvasEl.innerHTML = `
            <div class="offcanvas-header bg-light border-bottom">
                <div>
                    <h5 class="offcanvas-title fw-bold text-${colorTheme}">
                        <i class="bi ${icon}"></i> ${title}
                    </h5>
                    <div class="text-muted small mt-1">${filteredOpps.length} รายการ ${totalVal > 0 ? `| รวม ${Utils.formatCurrency(totalVal)}` : ''}</div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body" style="background-color: #f8f9fa;">
                ${filteredOpps.length === 0 ? `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-1"></i>
                        <p class="mt-2">ไม่มีรายการข้อมูล</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${filteredOpps.map(opp => {
            const customer = Storage.getById('customers', opp.customerId);
            const budgetCode = opp.budgetCode || 'Level 4';
            return `
                                <div class="list-group-item list-group-item-action mb-2 shadow-sm rounded border-0" style="cursor: pointer;" onclick="PipelineModule.renderDetail('${opp.id}')">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="fw-bold">${customer?.name || 'Unknown'}</div>
                                        <div class="fw-bold text-${colorTheme}">${opp.value > 0 ? Utils.formatCurrency(opp.value) : 'ไม่ระบุมูลค่า'}</div>
                                    </div>
                                    <div class="d-flex gap-2 flex-wrap mb-2">
                                        ${this.renderProductGroupBadge(opp.productGroup || this.getProductGroupKey(opp.product))}
                                        ${this.renderStageBadge(opp.stage)}
                                        ${this.renderBudgetBadge(budgetCode)}
                                    </div>
                                    ${opp.salesStatus ? `<div class="small text-muted"><i class="bi bi-info-circle"></i> ${opp.salesStatus}</div>` : ''}
                                    ${opp.remark ? `<div class="small text-muted"><i class="bi bi-journal-text"></i> ${opp.remark}</div>` : ''}
                                </div>
                            `;
        }).join('')}
                    </div>
                `}
            </div>
        `;

        // If the detail offcanvas is already open, bootstrap sometimes acts weird opening another offcanvas on top of it.
        // It's safest to hide it first, though Bootstrap 5 supports multiple via some z-indexing tricks if desired.
        const detailEl = document.getElementById('pipelineDetailOffcanvas');
        if (detailEl && detailEl.classList.contains('show')) {
            const detailInstance = bootstrap.Offcanvas.getInstance(detailEl);
            if (detailInstance) detailInstance.hide();
        }

        // Short timeout necessary to allow previous hide animations to complete flawlessly
        setTimeout(() => {
            if (window.bootstrap && bootstrap.Offcanvas) {
                const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
                offcanvas.show();
            }
        }, 300);
    },

    // Render add opportunity form
    renderAddForm() {
        const customers = Storage.get('customers') || [];

        // Create Offcanvas if it doesn't exist
        let offcanvasEl = document.getElementById('pipelineAddOffcanvas');
        if (!offcanvasEl) {
            offcanvasEl = document.createElement('div');
            offcanvasEl.id = 'pipelineAddOffcanvas';
            offcanvasEl.className = 'offcanvas offcanvas-end shadow-lg';
            offcanvasEl.tabIndex = -1;
            offcanvasEl.style.width = '600px';
            document.body.appendChild(offcanvasEl);
        }

        offcanvasEl.innerHTML = `
            <div class="offcanvas-header bg-light border-bottom">
                <h5 class="offcanvas-title fw-bold">
                    <i class="bi bi-plus-circle"></i> สร้าง Opportunity ใหม่
                </h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body" style="background-color: #f8f9fa;">
                <form onsubmit="PipelineModule.saveOpportunity(event)">
                    <div class="mb-3">
                        <label class="form-label fw-bold">ลูกค้า *</label>
                        <select class="form-select" name="customerId" required>
                            <option value="">เลือกลูกค้า</option>
                            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">ผลิตภัณฑ์ *</label>
                            <select class="form-select" name="product" required>
                                <option value="MediQ">MediQ (ระบบคิว)</option>
                                <option value="MediCore">MediCore (HIS)</option>
                                <option value="HIS">HIS</option>
                                <option value="ERP">ERP</option>
                                <option value="Custom">Custom Solutions</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">กลุ่มผลิตภัณฑ์ *</label>
                            <select class="form-select" name="productGroup" required>
                                <option value="MEDIQ">🏥 MEDIQ Platform</option>
                                <option value="HIS">🖥️ Hospital IS</option>
                                <option value="ERP">📊 ERP</option>
                                <option value="Custom">🔧 Custom Solutions</option>
                            </select>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">มูลค่า (บาท)</label>
                            <input type="number" class="form-control" name="value" min="0" step="1000" placeholder="เว้นว่างถ้ายังไม่ทราบ">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Budget Readiness *</label>
                            <select class="form-select" name="budgetCode" required>
                                <option value="Level 1">✅ Level 1: มีงบปี 69 รอประมูล</option>
                                <option value="Level 2">📋 Level 2: อยู่ในแผนงบประมาณจริงแล้ว</option>
                                <option value="Level 3">🎯 Level 3: ตั้งเป้า Push เข้าแผนงบปี</option>
                                <option value="Level 4">💭 Level 4: มีความต้องการ ยังไม่วางแผน</option>
                                <option value="Level 5">🚀 Level 5: จัดหาด่วน ไม่อยู่ในแผน</option>
                            </select>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Stage *</label>
                            <select class="form-select" name="stage" required>
                                ${this.STAGES.map(s => `<option value="${s.id}">${s.id}: ${s.name} — ${s.nameTH}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">ระดับความสนใจ *</label>
                            <select class="form-select" name="interest" required>
                                <option value="hot">🔴 Hot</option>
                                <option value="warm" selected>🟡 Warm</option>
                                <option value="cold">🔵 Cold</option>
                            </select>
                        </div>
                    </div>
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">คาดว่าจะปิด *</label>
                            <input type="date" class="form-control" name="expectedClose" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">ปีงบประมาณ</label>
                            <input type="text" class="form-control" name="budgetYear" placeholder="เช่น 2569">
                        </div>
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button type="submit" class="btn btn-primary flex-fill">บันทึก</button>
                        <button type="button" class="btn btn-secondary flex-fill" data-bs-dismiss="offcanvas">ยกเลิก</button>
                    </div>
                </form>
            </div>
        `;

        if (window.bootstrap && bootstrap.Offcanvas) {
            const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
            offcanvas.show();
        } else {
            console.error('Bootstrap Offcanvas is missing!');
        }
    },

    // Show Definitions Modal
    showDefinitionsModal() {
        const modalHtml = `
            <div class="modal fade" id="pipelineDefinitionsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title fw-bold"><i class="bi bi-info-circle text-primary"></i> คำอธิบาย คู่มือ S0-S8 และ Budget Level</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4">
                                <h6 class="fw-bold text-primary border-bottom pb-2"><i class="bi bi-funnel"></i> Sale Stage (สถานะการขาย S0-S8)</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-hover align-middle">
                                        <thead class="table-light">
                                            <tr>
                                                <th style="width: 15%">Stage</th>
                                                <th style="width: 30%">ชื่อสถานะ</th>
                                                <th>คำอธิบาย / ความหมาย</th>
                                                <th style="width: 10%" class="text-center">Prob.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${this.STAGES.map(s => {
            const color = this.STAGE_COLORS[s.id] || '#9CA3AF';
            return `
                                                <tr>
                                                    <td><span class="badge" style="background:${color};color:white">${s.id}</span></td>
                                                    <td class="fw-bold">${s.name}</td>
                                                    <td class="text-muted small">${s.nameTH} / ${s.description}</td>
                                                    <td class="text-center">${s.probability}%</td>
                                                </tr>
                                                `;
        }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div>
                                <h6 class="fw-bold text-success border-bottom pb-2"><i class="bi bi-piggy-bank"></i> Budget Level (ระดับความพร้อมงบประมาณ)</h6>
                                <div class="row g-3">
                                    ${Object.keys(this.BUDGET_CODES).map(k => {
            const b = this.BUDGET_CODES[k];
            return `
                                        <div class="col-md-6">
                                            <div class="card h-100 border-0 shadow-sm" style="border-left: 4px solid ${b.color} !important;">
                                                <div class="card-body p-3">
                                                    <div class="d-flex align-items-center gap-2 mb-1">
                                                        <span class="fs-4">${b.emoji}</span>
                                                        <strong class="fs-6">${k}</strong>
                                                    </div>
                                                    <p class="mb-0 text-muted small">${b.nameTH}</p>
                                                    <div class="text-end mt-2"><small class="text-muted">Weight: ${b.weight}</small></div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
        }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('pipelineDefinitionsModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalEl = document.getElementById('pipelineDefinitionsModal');
        const bsModal = new bootstrap.Modal(modalEl);

        modalEl.addEventListener('hidden.bs.modal', function () {
            modalEl.remove();
        });

        bsModal.show();
    },

    // Save new opportunity
    saveOpportunity(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const stage = data.get('stage');
        const stageDef = this.STAGES.find(s => s.id === stage);

        const opp = {
            customerId: data.get('customerId'),
            product: data.get('product'),
            productGroup: data.get('productGroup'),
            value: parseInt(data.get('value') || '0'),
            stage: stage,
            budgetCode: data.get('budgetCode'),
            budgetYear: data.get('budgetYear') || '',
            probability: stageDef ? stageDef.probability : 0,
            expectedClose: data.get('expectedClose'),
            assignedTo: Auth.getCurrentUser()?.id || 'USR-001',
            interest: data.get('interest'),
            salesStatus: '',
            detail: '',
            stageHistory: JSON.stringify([{
                stage: stage,
                date: new Date().toISOString(),
                reason: 'เริ่มต้น Opportunity'
            }])
        };

        Storage.add('opportunities', opp);
        alert('✅ สร้าง Opportunity สำเร็จ');

        // Hide offcanvas
        const offcanvasEl = document.getElementById('pipelineAddOffcanvas');
        if (offcanvasEl) {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }
        }

        // Refresh board or navigate
        if (window.location.hash === '#/pipeline') {
            this.renderBoard();
        } else {
            Router.navigate('#/pipeline');
        }
    },

    // Get pipeline statistics
    getPipelineStats(opportunities) {
        // 1. Work in Process (based on remark containing 'Work In Process')
        const wip = opportunities.filter(o => {
            const remarkText = (o.remark || o.detail || o.salesStatus || '').toLowerCase();
            return remarkText.includes('work in process');
        });
        const wipValue = wip.reduce((sum, o) => sum + (o.value || 0), 0);

        // 2. ลูกค้าที่มีงบปี 69
        const budget69 = opportunities.filter(o => o.budgetYear === '2569');
        const budget69Value = budget69.reduce((sum, o) => sum + (o.value || 0), 0);

        // 3. ลูกค้าที่มีงบปี 70 ที่เข้าแผนแล้ว (Level 1 หรือ Level 2)
        const budget70Planned = opportunities.filter(o => o.budgetYear === '2570' && ['Level 1', 'Level 2'].includes(o.budgetCode));
        const budget70PlannedValue = budget70Planned.reduce((sum, o) => sum + (o.value || 0), 0);

        // 4. ลูกค้าขอ Demo / Trial
        const demoRequest = opportunities.filter(o => {
            const remarkText = (o.remark || '').toLowerCase();
            const hasKeyword = remarkText.includes('ขอ demo') ||
                remarkText.includes('ขอ trial') ||
                remarkText.includes('ขอdemo') ||
                remarkText.includes('ขอtrial');
            return hasKeyword && o.stage !== 'S3';
        });

        // 5. กำลัง Demo / Trial
        const demoActive = opportunities.filter(o => {
            const remarkText = (o.remark || '').toLowerCase();
            const isDemoAct = remarkText.includes('กำลัง demo') ||
                remarkText.includes('กำลัง trial') ||
                remarkText.includes('อยู่ระหว่าง demo') ||
                remarkText.includes('อยู่ระหว่าง trial') ||
                remarkText.includes('อยู่ในระหว่าง demo') ||
                remarkText.includes('อยู่ในระหว่าง trial') ||
                remarkText.includes('กำลังdemo') ||
                remarkText.includes('กำลังtrial');
            return o.stage === 'S3' || isDemoAct;
        });

        // 6. รอพิจารณาใบเสนอราคา
        const s5 = opportunities.filter(o => o.stage === 'S5');

        // Legacy ones needed possibly elsewhere?
        const expectedRevenue = opportunities.reduce((sum, o) => {
            return sum + this.calculateExpectedRevenue(o.value || 0, o.stage, o.budgetCode || 'Level 4');
        }, 0);

        return {
            totalValue: opportunities.reduce((sum, o) => sum + (o.value || 0), 0),
            totalCount: opportunities.length,
            wipCount: wip.length,
            wipValue,
            budget69Count: budget69.length,
            budget69Value,
            budget70PlannedCount: budget70Planned.length,
            budget70PlannedValue,
            demoRequestCount: demoRequest.length,
            demoActiveCount: demoActive.length,
            s5Count: s5.length,
            expectedRevenue
        };
    }
};

PipelineModule.init();
console.log('✅ Pipeline module loaded (v1.4)');
