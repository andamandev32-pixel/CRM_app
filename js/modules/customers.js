// Customers Module - Customer Management for STS v1.3

const CustomersModule = {
    currentFilters: {
        search: '',
        type: '',
        region: '',
        tier: '',
        status: '',
        customerGroup: '',
        assignedTo: ''
    },

    // Initialize module
    init() {
        console.log('📋 Customers module initialized');
    },

    // Render customer list page
    renderList() {
        const customers = this.getFilteredCustomers();
        const stats = this.getCustomerStats();

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <!-- Page Header -->
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-people"></i> รายชื่อลูกค้า</h1>
                        <p class="text-muted mb-0">จัดการข้อมูลลูกค้าและผู้ติดต่อ</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" onclick="HelpModule.showHelp('customers')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-outline-success" onclick="ExportModule.showExportModal('ลูกค้า', {excel: 'ExportModule.exportCustomersExcel()', pdf: 'ExportModule.exportCustomersPDF()'})">
                            <i class="bi bi-download"></i> Export
                        </button>
                        <button class="btn btn-primary" onclick="CustomersModule.showAddForm()">
                            <i class="bi bi-plus-circle"></i> เพิ่มลูกค้าใหม่
                        </button>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">ลูกค้าทั้งหมด</p>
                                        <h3 class="mb-0">${stats.total}</h3>
                                    </div>
                                    <i class="bi bi-people fs-1 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Active</p>
                                        <h3 class="mb-0">${stats.active}</h3>
                                    </div>
                                    <i class="bi bi-check-circle fs-1 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Prospect</p>
                                        <h3 class="mb-0">${stats.prospect}</h3>
                                    </div>
                                    <i class="bi bi-star fs-1 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted mb-1">Tier 1</p>
                                        <h3 class="mb-0">${stats.tier1}</h3>
                                    </div>
                                    <i class="bi bi-trophy fs-1 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filters -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <label class="form-label">ค้นหา</label>
                                <input type="text" class="form-control" id="searchInput" 
                                    placeholder="ชื่อลูกค้า, จังหวัด..." 
                                    value="${this.currentFilters.search}">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">กลุ่มลูกค้า</label>
                                <select class="form-select" id="customerGroupFilter">
                                    <option value="" ${this.currentFilters.customerGroup === '' ? 'selected' : ''}>ทั้งหมด</option>
                                    <option value="ทหารบก" ${this.currentFilters.customerGroup === 'ทหารบก' ? 'selected' : ''}>รพ.กองทัพบก</option>
                                    <option value="รพ.รัฐ" ${this.currentFilters.customerGroup === 'รพ.รัฐ' ? 'selected' : ''}>รพ.รัฐบาลอื่นๆ</option>
                                    <option value="รพ.เอกชน" ${this.currentFilters.customerGroup === 'รพ.เอกชน' ? 'selected' : ''}>รพ.เอกชน</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">พนักงานผู้รับผิดชอบ</label>
                                <select class="form-select" id="assignedToFilter">
                                    <option value="">ทั้งหมด</option>
                                    ${(() => { const users = Storage.get('users') || []; return users.map(u => `<option value="${u.id}" ${this.currentFilters.assignedTo === u.id ? 'selected' : ''}>${u.name}</option>`).join(''); })()}
                                </select>
                            </div>
                            <div class="col-md-1">
                                <label class="form-label">ประเภท</label>
                                <select class="form-select" id="typeFilter">
                                    <option value="">ทั้งหมด</option>
                                    <option value="government" ${this.currentFilters.type === 'government' ? 'selected' : ''}>รัฐบาล</option>
                                    <option value="army" ${this.currentFilters.type === 'army' ? 'selected' : ''}>ทหาร</option>
                                    <option value="private" ${this.currentFilters.type === 'private' ? 'selected' : ''}>เอกชน</option>
                                    <option value="clinic" ${this.currentFilters.type === 'clinic' ? 'selected' : ''}>คลินิก</option>
                                </select>
                            </div>
                            <div class="col-md-1">
                                <label class="form-label">ภูมิภาค</label>
                                <select class="form-select" id="regionFilter">
                                    <option value="">ทั้งหมด</option>
                                    <option value="กลาง" ${this.currentFilters.region === 'กลาง' ? 'selected' : ''}>กลาง</option>
                                    <option value="เหนือ" ${this.currentFilters.region === 'เหนือ' ? 'selected' : ''}>เหนือ</option>
                                    <option value="อีสาน" ${this.currentFilters.region === 'อีสาน' ? 'selected' : ''}>อีสาน</option>
                                    <option value="ใต้" ${this.currentFilters.region === 'ใต้' ? 'selected' : ''}>ใต้</option>
                                </select>
                            </div>
                            <div class="col-md-1">
                                <label class="form-label">Tier</label>
                                <select class="form-select" id="tierFilter">
                                    <option value="">ทั้งหมด</option>
                                    <option value="T1" ${this.currentFilters.tier === 'T1' ? 'selected' : ''}>T1</option>
                                    <option value="T2" ${this.currentFilters.tier === 'T2' ? 'selected' : ''}>T2</option>
                                    <option value="T3" ${this.currentFilters.tier === 'T3' ? 'selected' : ''}>T3</option>
                                    <option value="T4" ${this.currentFilters.tier === 'T4' ? 'selected' : ''}>T4</option>
                                </select>
                            </div>
                            <div class="col-md-1">
                                <label class="form-label">สถานะ</label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">ทั้งหมด</option>
                                    <option value="active" ${this.currentFilters.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="prospect" ${this.currentFilters.status === 'prospect' ? 'selected' : ''}>Prospect</option>
                                    <option value="inactive" ${this.currentFilters.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="discontinue" ${this.currentFilters.status === 'discontinue' ? 'selected' : ''}>Discontinue</option>
                                </select>
                            </div>
                            <div class="col-md-1 d-flex align-items-end">
                                <button class="btn btn-outline-secondary w-100" onclick="CustomersModule.clearFilters()" title="ล้างตัวกรองทั้งหมด">
                                    <i class="bi bi-x-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Customer Table -->
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>ชื่อหน่วยงาน</th>
                                        <th>กลุ่มลูกค้า</th>
                                        <th>ผู้รับผิดชอบ</th>
                                        <th>ภูมิภาค</th>
                                        <th>จังหวัด</th>
                                        <th>สถานะ</th>
                                        <th>จำนวนของ pipeline</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.renderCustomerRows(customers)}
                                </tbody>
                            </table>
                        </div>
                        
                        ${customers.length === 0 ? `
                            <div class="text-center py-5">
                                <i class="bi bi-inbox fs-1 text-muted"></i>
                                <p class="text-muted mt-3">ไม่พบข้อมูลลูกค้า</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        this.attachFilterListeners();
    },

    // Render customer table rows
    renderCustomerRows(customers) {
        return customers.map((customer, index) => {
            const pipelineCount = this.getCustomerPipelineCount(customer.id);
            const users = Storage.get('users') || [];
            const assignedUser = users.find(u => u.id === customer.assignedTo);
            const assignedName = assignedUser ? assignedUser.name : '<span class="text-muted small">ยังไม่กำหนด</span>';

            // Determine customer group label
            const typeLabels = {
                'government': 'รัฐบาล',
                'army': 'ทหาร',
                'private': 'เอกชน',
                'clinic': 'คลินิก'
            };
            const groupLabel = customer.customerGroup || typeLabels[customer.type] || customer.type || 'ยังไม่กำหนด';

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${customer.name}</strong>
                    </td>
                    <td><span class="badge bg-secondary">${groupLabel}</span></td>
                    <td>${assignedName}</td>
                    <td>${customer.region || '<span class="text-muted small">ยังไม่กำหนด</span>'}</td>
                    <td>${customer.province || '<span class="text-muted small">ยังไม่กำหนด</span>'}</td>
                    <td>${customer.status ? `<span class="badge ${Utils.getBadgeClass(customer.status)}">${customer.status}</span>` : '<span class="text-muted small">ยังไม่กำหนด</span>'}</td>
                    <td><strong>${pipelineCount}</strong></td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-primary" onclick="Router.navigate('#/customers/${customer.id}')" title="ดูข้อมูล">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="CustomersModule.showEditForm('${customer.id}')" title="แก้ไข">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="CustomersModule.deleteCustomer('${customer.id}')" title="ลบ">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Get filtered customers
    getFilteredCustomers() {
        let customers = Storage.get('customers');

        // By default, hide discontinued customers unless explicitly filtered
        if (!this.currentFilters.status) {
            customers = customers.filter(c => c.status !== 'discontinue');
        }

        // Apply search
        if (this.currentFilters.search) {
            const search = this.currentFilters.search.toLowerCase();
            customers = customers.filter(c =>
                c.name.toLowerCase().includes(search) ||
                (c.province || '').toLowerCase().includes(search)
            );
        }

        // Apply customer group filter (กลุ่มลูกค้า)
        if (this.currentFilters.customerGroup) {
            customers = customers.filter(c => {
                let grp = c.customerGroup || '';
                // Fallback: derive from type if customerGroup not set
                if (!grp && c.type) {
                    if (c.type === 'army') grp = 'ทหารบก';
                    else if (c.type === 'private') grp = 'รพ.เอกชน';
                    else grp = 'รพ.รัฐ';
                }
                return grp === this.currentFilters.customerGroup;
            });
        }

        // Apply assigned-to filter (พนักงานผู้รับผิดชอบ)
        if (this.currentFilters.assignedTo) {
            customers = customers.filter(c => c.assignedTo === this.currentFilters.assignedTo);
        }

        // Apply type filter
        if (this.currentFilters.type) {
            customers = customers.filter(c => c.type === this.currentFilters.type);
        }

        // Apply region filter
        if (this.currentFilters.region) {
            customers = customers.filter(c => c.region === this.currentFilters.region);
        }

        // Apply tier filter
        if (this.currentFilters.tier) {
            customers = customers.filter(c => c.tier === this.currentFilters.tier);
        }

        // Apply status filter
        if (this.currentFilters.status) {
            customers = customers.filter(c => c.status === this.currentFilters.status);
        }

        return customers;
    },

    // Get customer statistics
    getCustomerStats() {
        const customers = Storage.get('customers');
        return {
            total: customers.length,
            active: customers.filter(c => c.status === 'active').length,
            prospect: customers.filter(c => c.status === 'prospect').length,
            tier1: customers.filter(c => c.tier === 'T1').length
        };
    },

    // Get customer pipeline (opportunity) count
    getCustomerPipelineCount(customerId) {
        const opps = Storage.query('opportunities', { customerId });
        return opps.length;
    },

    // Get customer assessment score
    getCustomerAssessment(customerId) {
        const assessments = Storage.query('assessmentScores', { customerId });
        return assessments.length > 0 ? assessments[0] : null;
    },

    // Attach filter event listeners
    attachFilterListeners() {
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const regionFilter = document.getElementById('regionFilter');
        const tierFilter = document.getElementById('tierFilter');
        const statusFilter = document.getElementById('statusFilter');
        const customerGroupFilter = document.getElementById('customerGroupFilter');
        const assignedToFilter = document.getElementById('assignedToFilter');

        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.renderList();
            }, 300));
        }

        // customerGroupFilter maps to currentFilters.customerGroup
        if (customerGroupFilter) {
            customerGroupFilter.addEventListener('change', (e) => {
                this.currentFilters.customerGroup = e.target.value;
                this.renderList();
            });
        }

        // assignedToFilter maps to currentFilters.assignedTo
        if (assignedToFilter) {
            assignedToFilter.addEventListener('change', (e) => {
                this.currentFilters.assignedTo = e.target.value;
                this.renderList();
            });
        }

        [typeFilter, regionFilter, tierFilter, statusFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', (e) => {
                    const key = e.target.id.replace('Filter', '');
                    this.currentFilters[key] = e.target.value;
                    this.renderList();
                });
            }
        });
    },

    // Clear all filters
    clearFilters() {
        this.currentFilters = {
            search: '',
            type: '',
            region: '',
            tier: '',
            status: '',
            customerGroup: '',
            assignedTo: ''
        };
        this.renderList();
    },

    // Show add customer form
    showAddForm() {
        this.showCustomerForm();
    },

    // Show edit customer form
    showEditForm(customerId) {
        const customer = Storage.getById('customers', customerId);
        if (!customer) {
            FormsModule.showNotification('ไม่พบข้อมูลลูกค้า', 'error');
            return;
        }
        this.showCustomerForm(customer);
    },

    // Show customer form (add/edit)
    showCustomerForm(customer = null) {
        const isEdit = customer !== null;
        const title = isEdit ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่';

        const formContent = `
            <form id="customerForm" class="needs-validation" novalidate>
                ${FormsModule.generateFormField({
            type: 'text',
            name: 'name',
            label: 'ชื่อหน่วยงาน',
            value: customer?.name || '',
            required: true,
            placeholder: 'เช่น โรงพยาบาลศิริราช'
        })}

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'type',
            label: 'ประเภท',
            value: customer?.type || '',
            required: true,
            options: [
                { value: 'government', label: 'รัฐบาล' },
                { value: 'army', label: 'ทหาร' },
                { value: 'private', label: 'เอกชน' },
                { value: 'clinic', label: 'คลินิก' }
            ]
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'region',
            label: 'ภูมิภาค',
            value: customer?.region || '',
            required: true,
            options: ['กลาง', 'เหนือ', 'อีสาน', 'ใต้']
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'text',
            name: 'province',
            label: 'จังหวัด',
            value: customer?.province || '',
            required: true,
            placeholder: 'เช่น กรุงเทพมหานคร'
        })}
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'tier',
            label: 'Tier',
            value: customer?.tier || 'T3',
            required: true,
            options: ['T1', 'T2', 'T3', 'T4']
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'select',
            name: 'status',
            label: 'สถานะ',
            value: customer?.status || 'prospect',
            required: true,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'prospect', label: 'Prospect' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'discontinue', label: '⛔ Discontinue' }
            ]
        })}
                    </div>
                </div>

                ${FormsModule.generateFormField({
            type: 'select',
            name: 'assignedTo',
            label: 'ผู้รับผิดชอบ',
            value: customer?.assignedTo || '',
            required: true,
            options: FormsModule.getUserOptions()
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

        // Attach form submit handler
        const form = document.getElementById('customerForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('customerForm')) {
                this.saveCustomer(customer?.id);
            }
        });
    },

    // Save customer (create or update)
    saveCustomer(customerId = null) {
        const formData = FormsModule.getFormData('customerForm');
        const isEdit = customerId !== null;

        try {
            if (isEdit) {
                // Update existing customer
                Storage.update('customers', customerId, formData);
                FormsModule.showNotification('บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว', 'success');
            } else {
                // Create new customer
                Storage.add('customers', formData);
                FormsModule.showNotification('เพิ่มลูกค้าใหม่เรียบร้อยแล้ว', 'success');
            }

            FormsModule.closeModal();
            this.renderList();
        } catch (error) {
            console.error('Error saving customer:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    },

    // Render customer profile
    renderProfile(customerId) {
        const customer = Storage.getById('customers', customerId);

        if (!customer) {
            Router.show404();
            return;
        }

        const contacts = Storage.query('contacts', { customerId });
        const opportunities = Storage.query('opportunities', { customerId });
        const visitReports = Storage.query('visitReports', { customerId });
        const assessment = this.getCustomerAssessment(customerId);

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <!-- Back Button -->
                <div class="mb-3">
                    <button class="btn btn-outline-secondary" onclick="Router.navigate('#/customers')">
                        <i class="bi bi-arrow-left"></i> กลับ
                    </button>
                </div>
                
                <!-- Customer Header -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <h2 class="mb-2">${customer.name}</h2>
                                <div class="d-flex gap-2 flex-wrap">
                                    ${customer.customerGroup ? `<span class="badge bg-primary">${customer.customerGroup}</span>` : ''}
                                    ${customer.type ? `<span class="badge bg-secondary">${{ 'government': '\u0e23\u0e31\u0e10\u0e1a\u0e32\u0e25', 'army': '\u0e17\u0e2b\u0e32\u0e23', 'private': '\u0e40\u0e2d\u0e01\u0e0a\u0e19', 'clinic': '\u0e04\u0e25\u0e34\u0e19\u0e34\u0e01' }[customer.type] || customer.type}</span>` : ''}
                                    ${customer.tier ? `<span class="badge ${Utils.getBadgeClass(customer.tier)}">${customer.tier}</span>` : ''}
                                    ${customer.status ? `<span class="badge ${Utils.getBadgeClass(customer.status)}">${customer.status}</span>` : ''}
                                    ${customer.region ? `<span class="badge bg-info">${customer.region}</span>` : ''}
                                </div>
                                <p class="text-muted mt-2 mb-0">
                                    <i class="bi bi-geo-alt"></i> ${customer.province || '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e01\u0e33\u0e2b\u0e19\u0e14'}
                                </p>
                            </div>
                            <div class="col-md-4 text-end d-flex gap-2 justify-content-end">
                                <button class="btn btn-primary" onclick="CustomersModule.showEditForm('${customerId}')">
                                    <i class="bi bi-pencil"></i> แก้ไข
                                </button>
                                <button class="btn btn-outline-danger" onclick="CustomersModule.deleteCustomer('${customerId}', true)">
                                    <i class="bi bi-trash"></i> ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4" id="customerTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button">
                            <i class="bi bi-info-circle"></i> ข้อมูลทั่วไป
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="contacts-tab" data-bs-toggle="tab" data-bs-target="#contacts" type="button">
                            <i class="bi bi-person-lines-fill"></i> ผู้ติดต่อ (${contacts.length})
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="activities-tab" data-bs-toggle="tab" data-bs-target="#activities" type="button">
                            <i class="bi bi-clock-history"></i> กิจกรรม (${visitReports.length})
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pipeline-tab" data-bs-toggle="tab" data-bs-target="#pipeline" type="button">
                            <i class="bi bi-funnel"></i> Pipeline (${opportunities.length})
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="assessment-tab" data-bs-toggle="tab" data-bs-target="#assessment" type="button">
                            <i class="bi bi-clipboard-data"></i> Assessment
                        </button>
                    </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content" id="customerTabContent">
                    <!-- Info Tab -->
                    <div class="tab-pane fade show active" id="info" role="tabpanel">
                        ${this.renderInfoTab(customer)}
                    </div>
                    
                    <!-- Contacts Tab -->
                    <div class="tab-pane fade" id="contacts" role="tabpanel">
                        ${this.renderContactsTab(contacts, customerId)}
                    </div>
                    
                    <!-- Activities Tab -->
                    <div class="tab-pane fade" id="activities" role="tabpanel">
                        ${this.renderActivitiesTab(visitReports)}
                    </div>
                    
                    <!-- Pipeline Tab -->
                    <div class="tab-pane fade" id="pipeline" role="tabpanel">
                        ${this.renderPipelineTab(opportunities)}
                    </div>
                    
                    <!-- Assessment Tab -->
                    <div class="tab-pane fade" id="assessment" role="tabpanel">
                        ${this.renderAssessmentTab(assessment)}
                    </div>
                </div>
            </div>
        `;
    },

    // Helper to display value or 'ยังไม่กำหนด'
    _orNA(val) {
        if (val === undefined || val === null || val === '' || val === 'undefined') return '<span class="text-muted">ยังไม่กำหนด</span>';
        return val;
    },

    // Render info tab
    renderInfoTab(customer) {
        const typeLabels = { 'government': 'รัฐบาล', 'army': 'ทหาร', 'private': 'เอกชน', 'clinic': 'คลินิก' };
        return `
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="mb-3">ข้อมูลพื้นฐาน</h5>
                            <table class="table table-borderless">
                                <tr>
                                    <td class="text-muted" width="160">ชื่อหน่วยงาน:</td>
                                    <td><strong>${customer.name}</strong></td>
                                </tr>
                                <tr>
                                    <td class="text-muted">กลุ่มลูกค้า:</td>
                                    <td>${this._orNA(customer.customerGroup)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">ประเภท:</td>
                                    <td>${typeLabels[customer.type] ? typeLabels[customer.type] : this._orNA(customer.type)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">ภูมิภาค:</td>
                                    <td>${this._orNA(customer.region)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">จังหวัด:</td>
                                    <td>${this._orNA(customer.province)}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h5 class="mb-3">สถานะและการจัดการ</h5>
                            <table class="table table-borderless">
                                <tr>
                                    <td class="text-muted" width="160">Tier:</td>
                                    <td>${customer.tier ? `<span class="badge ${Utils.getBadgeClass(customer.tier)}">${customer.tier}</span>` : this._orNA(null)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">สถานะ:</td>
                                    <td>${customer.status ? `<span class="badge ${Utils.getBadgeClass(customer.status)}">${customer.status}</span>` : this._orNA(null)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">พนักงานผู้รับผิดชอบ:</td>
                                    <td>${this.getUserName(customer.assignedTo)}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">สร้างเมื่อ:</td>
                                    <td>${Utils.formatDate(customer.createdAt, 'medium')}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render contacts tab
    renderContactsTab(contacts, customerId) {
        return `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">รายชื่อผู้ติดต่อ</h5>
                        <button class="btn btn-sm btn-primary" onclick="CustomersModule.showAddContactForm('${customerId}')">
                            <i class="bi bi-plus-circle"></i> เพิ่มผู้ติดต่อ
                        </button>
                    </div>
                    
                    ${contacts.length === 0 ? `
                        <div class="text-center py-5">
                            <i class="bi bi-person-x fs-1 text-muted"></i>
                            <p class="text-muted mt-3">ยังไม่มีผู้ติดต่อ</p>
                        </div>
                    ` : `
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ชื่อ-นามสกุล</th>
                                        <th>ตำแหน่ง</th>
                                        <th>โทรศัพท์</th>
                                        <th>อีเมล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${contacts.map(contact => `
                                        <tr>
                                            <td><strong>${contact.name}</strong></td>
                                            <td>${contact.position}</td>
                                            <td><i class="bi bi-telephone"></i> ${contact.phone}</td>
                                            <td><i class="bi bi-envelope"></i> ${contact.email}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // Render activities tab
    renderActivitiesTab(visitReports) {
        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="mb-3">ประวัติการเข้าพบ</h5>
                    
                    ${visitReports.length === 0 ? `
                        <div class="text-center py-5">
                            <i class="bi bi-calendar-x fs-1 text-muted"></i>
                            <p class="text-muted mt-3">ยังไม่มีรายงานการเข้าพบ</p>
                        </div>
                    ` : `
                        <div class="timeline">
                            ${visitReports.map(report => `
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h6 class="mb-1">${report.objective}</h6>
                                                <p class="text-muted small mb-2">
                                                    <i class="bi bi-calendar"></i> ${Utils.formatDate(report.visitDate, 'medium')}
                                                    <span class="ms-3"><i class="bi bi-people"></i> ${report.attendees}</span>
                                                </p>
                                                <p class="mb-2">${report.summary}</p>
                                                <span class="badge ${Utils.getBadgeClass(report.interest)}">${report.interest}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // Render pipeline tab
    renderPipelineTab(opportunities) {
        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="mb-3">Sales Opportunities</h5>
                    
                    ${opportunities.length === 0 ? `
                        <div class="text-center py-5">
                            <i class="bi bi-funnel fs-1 text-muted"></i>
                            <p class="text-muted mt-3">ยังไม่มี Opportunity</p>
                        </div>
                    ` : `
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>สินค้า</th>
                                        <th>มูลค่า</th>
                                        <th>Stage</th>
                                        <th>Probability</th>
                                        <th>Expected Close</th>
                                        <th>Interest</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${opportunities.map(opp => `
                                        <tr onclick="Router.navigate('#/pipeline/${opp.id}')" style="cursor: pointer;">
                                            <td><strong>${opp.product}</strong></td>
                                            <td>${Utils.formatCurrency(opp.value)}</td>
                                            <td><span class="badge ${Utils.getBadgeClass(opp.stage)}">${opp.stage}</span></td>
                                            <td>${opp.probability}%</td>
                                            <td>${Utils.formatDate(opp.expectedClose, 'medium')}</td>
                                            <td><span class="badge ${Utils.getBadgeClass(opp.interest)}">${opp.interest}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // Render assessment tab
    renderAssessmentTab(assessment) {
        if (!assessment) {
            return `
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-clipboard-x fs-1 text-muted"></i>
                        <p class="text-muted mt-3">ยังไม่มีการประเมิน</p>
                        <button class="btn btn-primary mt-3">
                            <i class="bi bi-plus-circle"></i> สร้างการประเมิน
                        </button>
                    </div>
                </div>
            `;
        }

        const scores = JSON.parse(assessment.scores);

        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="mb-4">Assessment Score</h5>
                    
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="text-center p-4 bg-light rounded">
                                <h1 class="display-3 text-primary mb-0">${assessment.totalScore}</h1>
                                <p class="text-muted">/ 25 คะแนน</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <table class="table table-borderless">
                                <tr>
                                    <td>Budget (งบประมาณ):</td>
                                    <td><strong>${scores.budget}/5</strong></td>
                                </tr>
                                <tr>
                                    <td>Authority (อำนาจตัดสินใจ):</td>
                                    <td><strong>${scores.authority}/5</strong></td>
                                </tr>
                                <tr>
                                    <td>Need (ความต้องการ):</td>
                                    <td><strong>${scores.need}/5</strong></td>
                                </tr>
                                <tr>
                                    <td>Timeline (กรอบเวลา):</td>
                                    <td><strong>${scores.timeline}/5</strong></td>
                                </tr>
                                <tr>
                                    <td>Champion (ผู้สนับสนุน):</td>
                                    <td><strong>${scores.champion}/5</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> 
                        ประเมินล่าสุดเมื่อ ${Utils.formatDate(assessment.date, 'datetime')}
                    </div>
                </div>
            </div>
        `;
    },

    // Get user name by ID
    getUserName(userId) {
        if (!userId || userId === '' || userId === 'undefined') return '<span class="text-muted">ยังไม่กำหนด</span>';
        const user = Storage.getById('users', userId);
        return user ? user.name : '<span class="text-muted">ยังไม่กำหนด</span>';
    },

    // Delete customer
    deleteCustomer(customerId, fromProfile = false) {
        const customer = Storage.getById('customers', customerId);
        if (!customer) {
            FormsModule.showNotification('ไม่พบข้อมูลลูกค้า', 'error');
            return;
        }

        const confirmed = confirm(`⚠️ ต้องการลบลูกค้า "${customer.name}" หรือไม่?\n\nข้อมูลที่เกี่ยวข้อง (ผู้ติดต่อ, Pipeline, ฯลฯ) จะยังคงอยู่\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`);
        if (!confirmed) return;

        Storage.delete('customers', customerId);
        FormsModule.showNotification(`ลบลูกค้า "${customer.name}" เรียบร้อยแล้ว`, 'success');

        if (fromProfile) {
            Router.navigate('#/customers');
        } else {
            this.renderList();
        }
    },


    showAddContactForm(customerId) {
        const customer = Storage.getById('customers', customerId);
        if (!customer) {
            FormsModule.showNotification('ไม่พบข้อมูลลูกค้า', 'error');
            return;
        }

        const formContent = `
            <form id="contactForm" class="needs-validation" novalidate>
                <div class="alert alert-info mb-3">
                    <i class="bi bi-info-circle"></i> เพิ่มผู้ติดต่อสำหรับ: <strong>${customer.name}</strong>
                </div>

                ${FormsModule.generateFormField({
            type: 'text',
            name: 'name',
            label: 'ชื่อ-นามสกุล',
            required: true,
            placeholder: 'เช่น นพ.สมชาย ใจดี'
        })}

                ${FormsModule.generateFormField({
            type: 'text',
            name: 'position',
            label: 'ตำแหน่ง',
            required: true,
            placeholder: 'เช่น ผู้อำนวยการ'
        })}

                <div class="row">
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'text',
            name: 'phone',
            label: 'เบอร์โทรศัพท์',
            required: true,
            placeholder: '081-234-5678',
            pattern: '[0-9-]+'
        })}
                    </div>
                    <div class="col-md-6">
                        ${FormsModule.generateFormField({
            type: 'email',
            name: 'email',
            label: 'อีเมล',
            required: true,
            placeholder: 'example@hospital.com'
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

        FormsModule.showModal('เพิ่มผู้ติดต่อ', formContent);

        // Attach form submit handler
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormsModule.validateForm('contactForm')) {
                this.saveContact(customerId);
            }
        });
    },

    // Save contact
    saveContact(customerId) {
        const formData = FormsModule.getFormData('contactForm');
        formData.customerId = customerId;

        try {
            Storage.add('contacts', formData);
            FormsModule.showNotification('เพิ่มผู้ติดต่อเรียบร้อยแล้ว', 'success');
            FormsModule.closeModal();

            // Refresh customer profile if we're on that page
            this.renderProfile(customerId);
        } catch (error) {
            console.error('Error saving contact:', error);
            FormsModule.showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
    }
};

// Initialize module
CustomersModule.init();

console.log('✅ Customers module loaded');
