// Customer Management Module
// จัดการข้อมูลลูกค้าและผู้ติดต่อ

// Global variable to store current filter state
let currentCustomerFilters = {};

function renderCustomers() {
    const mainContent = document.getElementById('mainContent');

    // Apply filters
    const customers = filterCustomers(currentCustomerFilters);

    mainContent.innerHTML = `
        <!-- Customer List -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">รายชื่อลูกค้า</h3>
                <button class="btn btn-primary" onclick="openAddCustomerForm()">
                    + เพิ่มลูกค้าใหม่
                </button>
            </div>
            <div class="card-body">
                <!-- Filters -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">ประเภท</label>
                        <select class="form-select" id="filterType" onchange="applyCustomerFilters()">
                            <option value="">ทั้งหมด</option>
                            <option value="army">กองทัพบก</option>
                            <option value="government">รัฐ</option>
                            <option value="private">เอกชน</option>
                            <option value="clinic">คลินิก</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">ภูมิภาค</label>
                        <select class="form-select" id="filterRegion" onchange="applyCustomerFilters()">
                            <option value="">ทั้งหมด</option>
                            <option value="กลาง">กลาง</option>
                            <option value="เหนือ">เหนือ</option>
                            <option value="อีสาน">อีสาน</option>
                            <option value="ใต้">ใต้</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">Tier</label>
                        <select class="form-select" id="filterTier" onchange="applyCustomerFilters()">
                            <option value="">ทั้งหมด</option>
                            <option value="T1">T1</option>
                            <option value="T2">T2</option>
                            <option value="T3">T3</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">สถานะ</label>
                        <select class="form-select" id="filterStatus" onchange="applyCustomerFilters()">
                            <option value="">ทั้งหมด</option>
                            <option value="active">Active</option>
                            <option value="prospect">Prospect</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                
                <!-- Customer Table -->
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อหน่วยงาน</th>
                                <th>ประเภท</th>
                                <th>Tier</th>
                                <th>ภูมิภาค</th>
                                <th>จังหวัด</th>
                                <th>สถานะ</th>
                                <th>พนักงานขาย</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="customerTableBody">
                            ${customers.map((customer, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td class="font-semibold">${customer.name}</td>
                                    <td>${getTypeBadge(customer.type)}</td>
                                    <td>${getTierBadge(customer.tier)}</td>
                                    <td>${customer.region}</td>
                                    <td>${customer.province}</td>
                                    <td>${getStatusBadge(customer.status)}</td>
                                    <td>${getUserName(customer.assignedTo)}</td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary" onclick="viewCustomer('${customer.id}')">
                                            ดู
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Process Flow Guide (Moved to Bottom) -->
        <div style="margin-top: var(--spacing-xl);">
            ${renderProcessFlow('customer-onboarding')}
        </div>
        
        <!-- Scroll Navigation Buttons -->
        ${renderScrollButtons()}
    `;
}

function openAddCustomerForm() {
    const formContent = `
        <form onsubmit="saveCustomer(event)">
            <div class="form-group">
                <label class="form-label required">ชื่อหน่วยงาน</label>
                <input type="text" class="form-input" name="name" required 
                    placeholder="เช่น โรงพยาบาลค่ายสุรนารี">
            </div>
            
            <div class="form-group">
                <label class="form-label required">ประเภท</label>
                <select class="form-select" name="type" required>
                    <option value="">เลือกประเภท</option>
                    <option value="army">กองทัพบก</option>
                    <option value="government">รัฐ</option>
                    <option value="private">เอกชน</option>
                    <option value="clinic">คลินิก</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label required">ภูมิภาค</label>
                <select class="form-select" name="region" required>
                    <option value="">เลือกภูมิภาค</option>
                    <option value="กลาง">กลาง</option>
                    <option value="เหนือ">เหนือ</option>
                    <option value="อีสาน">อีสาน</option>
                    <option value="ใต้">ใต้</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label required">จังหวัด</label>
                <input type="text" class="form-input" name="province" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Tier</label>
                <select class="form-select" name="tier" required>
                    <option value="">เลือก Tier</option>
                    <option value="T1">T1 - ขนาดใหญ่</option>
                    <option value="T2">T2 - ขนาดกลาง</option>
                    <option value="T3">T3 - ขนาดเล็ก</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label required">สถานะ</label>
                <select class="form-select" name="status" required>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            
            <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl);">
                <button type="submit" class="btn btn-primary" style="flex: 1;">บันทึก</button>
                <button type="button" class="btn btn-secondary" onclick="closeDrawer()" style="flex: 1;">ยกเลิก</button>
            </div>
        </form>
    `;

    openDrawer('เพิ่มลูกค้าใหม่', formContent);
}

function saveCustomer(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newCustomer = {
        id: generateId('C'),
        name: formData.get('name'),
        type: formData.get('type'),
        region: formData.get('region'),
        province: formData.get('province'),
        tier: formData.get('tier'),
        status: formData.get('status'),
        assignedTo: currentUser.id,
        createdAt: new Date().toISOString().split('T')[0]
    };

    appData.customers.push(newCustomer);
    saveData('customers', appData.customers);

    closeDrawer();
    renderCustomers();
    alert('✅ บันทึกลูกค้าใหม่สำเร็จ');
}

function viewCustomer(customerId) {
    const customer = appData.customers.find(c => c.id === customerId);
    if (!customer) return;

    const contacts = appData.contacts.filter(c => c.customerId === customerId);
    const opportunities = appData.opportunities.filter(o => o.customerId === customerId);

    const content = `
        <div style="margin-bottom: var(--spacing-xl);">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-md);">${customer.name}</h2>
            <div class="flex gap-2">
                ${getTypeBadge(customer.type)}
                ${getTierBadge(customer.tier)}
                ${getStatusBadge(customer.status)}
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">ข้อมูลทั่วไป</h3>
            </div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">ภูมิภาค</div>
                        <div class="font-semibold">${customer.region}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">จังหวัด</div>
                        <div class="font-semibold">${customer.province}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">พนักงานขาย</div>
                        <div class="font-semibold">${getUserName(customer.assignedTo)}</div>
                    </div>
                    <div>
                        <div class="text-sm" style="color: var(--gray-600);">วันที่สร้าง</div>
                        <div class="font-semibold">${formatDate(customer.createdAt)}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: var(--spacing-lg);">
            <div class="card-header">
                <h3 class="card-title">ผู้ติดต่อ</h3>
            </div>
            <div class="card-body">
                ${contacts.length > 0 ? contacts.map(contact => `
                    <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--gray-200);">
                        <div class="font-semibold">${contact.name}</div>
                        <div class="text-sm" style="color: var(--gray-600);">${contact.position}</div>
                        <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                            📞 ${contact.phone} | ✉️ ${contact.email}
                        </div>
                    </div>
                `).join('') : '<div class="text-center" style="padding: var(--spacing-lg); color: var(--gray-500);">ยังไม่มีผู้ติดต่อ</div>'}
            </div>
        </div>
        
        <div class="card" style="margin-top: var(--spacing-lg);">
            <div class="card-header">
                <h3 class="card-title">Pipeline</h3>
            </div>
            <div class="card-body">
                ${opportunities.length > 0 ? opportunities.map(opp => `
                    <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div class="font-semibold">${getTypeBadge(opp.product)}</div>
                            <div class="text-sm" style="color: var(--gray-600); margin-top: 0.25rem;">
                                มูลค่า ${formatCurrency(opp.value)}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge badge-purple">${opp.stage}</span>
                            <div class="text-sm" style="margin-top: 0.25rem;">${getStatusBadge(opp.interest)}</div>
                        </div>
                    </div>
                `).join('') : '<div class="text-center" style="padding: var(--spacing-lg); color: var(--gray-500);">ยังไม่มี Opportunity</div>'}
            </div>
        </div>
    `;

    openDrawer(`ข้อมูลลูกค้า: ${customer.name}`, content);
}

// Apply customer filters
function applyCustomerFilters() {
    currentCustomerFilters = {
        type: document.getElementById('filterType')?.value || '',
        region: document.getElementById('filterRegion')?.value || '',
        tier: document.getElementById('filterTier')?.value || '',
        status: document.getElementById('filterStatus')?.value || ''
    };
    renderCustomers();
}

console.log('✅ Customers module loaded');

