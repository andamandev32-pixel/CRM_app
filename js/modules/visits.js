// Visits Module - Visit & Activity Management for STS v1.3
// Complete visit report form with product interest tracking and follow-up tasks

const VisitsModule = {
    pendingTasks: [],

    init() {
        console.log('📅 Visits module initialized');
    },

    // ==================== RENDER LIST ====================
    renderList() {
        const visits = Storage.get('visitReports') || [];
        const followUps = Storage.get('followUps') || [];
        const pageContent = document.getElementById('pageContent');

        const visitsWithCustomer = visits.map(v => {
            const customer = Storage.getById('customers', v.customerId);
            const taskCount = followUps.filter(f => f.reportId === v.id).length;
            return { ...v, customerName: customer?.name || '-', taskCount };
        }).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

        const overdueCount = followUps.filter(f => f.status === 'overdue' || (f.status === 'pending' && new Date(f.deadline) < new Date())).length;
        const hotCount = visits.filter(v => v.interestLevel === 'hot').length;

        pageContent.innerHTML = `
            <div class="page-container">
                <div class="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="bi bi-calendar-check"></i> รายงานการเข้าพบลูกค้า</h1>
                        <p class="text-muted mb-0">จัดการรายงานการเข้าพบและ Follow-up</p>
                    </div>
                    <div>
                        <button class="btn btn-outline-info me-2" onclick="HelpModule.showHelp('visits')" title="คู่มือการใช้งาน">
                            <i class="bi bi-question-circle"></i> คู่มือ
                        </button>
                        <button class="btn btn-outline-primary me-2" onclick="Router.navigate('#/visits/followup')">
                            <i class="bi bi-list-check"></i> Follow-up Dashboard
                        </button>
                        <button class="btn btn-primary" onclick="Router.navigate('#/visits/report')">
                            <i class="bi bi-plus-circle"></i> สร้างรายงาน
                        </button>
                    </div>
                </div>

                <!-- Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="card"><div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div><p class="text-muted mb-1">รายงานทั้งหมด</p><h3>${visits.length}</h3></div>
                                <i class="bi bi-file-text fs-1 text-primary"></i>
                            </div>
                        </div></div>
                    </div>
                    <div class="col-md-4">
                        <div class="card"><div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div><p class="text-muted mb-1">Follow-up ค้าง</p><h3 class="text-danger">${overdueCount}</h3></div>
                                <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                            </div>
                        </div></div>
                    </div>
                    <div class="col-md-4">
                        <div class="card"><div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div><p class="text-muted mb-1">Hot Leads</p><h3 class="text-danger">${hotCount}</h3></div>
                                <i class="bi bi-fire fs-1 text-danger"></i>
                            </div>
                        </div></div>
                    </div>
                </div>

                <!-- Visit Reports Table -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="mb-3">รายงานการเข้าพบล่าสุด</h5>
                        ${visitsWithCustomer.length === 0 ? `
                            <div class="text-center py-5">
                                <i class="bi bi-inbox fs-1 text-muted"></i>
                                <p class="text-muted mt-2">ยังไม่มีรายงานการเข้าพบ</p>
                                <button class="btn btn-primary" onclick="Router.navigate('#/visits/report')">
                                    <i class="bi bi-plus-circle"></i> สร้างรายงานแรก
                                </button>
                            </div>
                        ` : `
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead><tr>
                                        <th>วันที่</th><th>ลูกค้า</th><th>วัตถุประสงค์</th>
                                        <th>สินค้าที่สนใจ</th><th>Interest</th><th>Tasks</th><th>Action</th>
                                    </tr></thead>
                                    <tbody>
                                        ${visitsWithCustomer.map(v => `
                                            <tr style="cursor:pointer" onclick="VisitsModule.showDetail('${v.id}')">
                                                <td>${this.fmtDate(v.visitDate)}</td>
                                                <td><strong>${v.customerName}</strong></td>
                                                <td>${(v.objective || '').substring(0, 40)}${(v.objective || '').length > 40 ? '...' : ''}</td>
                                                <td>${(v.products || []).map(p => `<span class="badge bg-info text-dark me-1">${p}</span>`).join('') || '-'}</td>
                                                <td><span class="badge ${v.interestLevel === 'hot' ? 'bg-danger' : v.interestLevel === 'warm' ? 'bg-warning text-dark' : 'bg-secondary'}">${v.interestLevel || '-'}</span></td>
                                                <td><span class="badge bg-primary">${v.taskCount}</span></td>
                                                <td><button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); VisitsModule.showDetail('${v.id}')"><i class="bi bi-eye"></i></button></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    // ==================== RENDER REPORT FORM ====================
    renderReport() {
        this.pendingTasks = [];
        const customers = Storage.get('customers') || [];
        const pageContent = document.getElementById('pageContent');
        const today = new Date().toISOString().split('T')[0];

        pageContent.innerHTML = `
            <div class="page-container" style="max-width:900px">
                <!-- Breadcrumb -->
                <nav aria-label="breadcrumb" class="mb-3">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#/visits">การเข้าพบลูกค้า</a></li>
                        <li class="breadcrumb-item active">บันทึกรายงาน</li>
                    </ol>
                </nav>

                <div class="page-header">
                    <div>
                        <h1><i class="bi bi-pencil-square"></i> บันทึกการเข้าพบลูกค้า</h1>
                        <p class="text-muted mb-0">บันทึกรายละเอียดการเข้าพบ สินค้าที่สนใจ และกำหนด Follow-up</p>
                    </div>
                </div>

                <form id="visitReportForm" onsubmit="VisitsModule.saveReport(event)">

                    <!-- Section 1: Visit Info -->
                    <div class="card mb-4">
                        <div class="card-header bg-primary bg-opacity-10">
                            <h5 class="mb-0"><i class="bi bi-info-circle text-primary"></i> ข้อมูลการเข้าพบ</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">ลูกค้า / โรงพยาบาล <span class="text-danger">*</span></label>
                                    <select id="vr_customer" class="form-select" required>
                                        <option value="">-- เลือกลูกค้า --</option>
                                        ${customers.sort((a, b) => a.name.localeCompare(b.name)).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-bold">วันที่เข้าพบ <span class="text-danger">*</span></label>
                                    <input type="date" id="vr_date" class="form-control" value="${today}" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-bold">สถานที่</label>
                                    <input type="text" id="vr_location" class="form-control" placeholder="เช่น ที่ทำการลูกค้า">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">วัตถุประสงค์ <span class="text-danger">*</span></label>
                                    <input type="text" id="vr_objective" class="form-control" placeholder="เช่น นำเสนอระบบ HIS, Follow-up Demo" required>
                                </div>
                            </div>

                            <!-- Attendees Sub-section -->
                            <div class="mt-3 pt-3 border-top">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <label class="form-label fw-bold mb-0"><i class="bi bi-people"></i> ผู้เข้าร่วม (ฝั่งลูกค้า)</label>
                                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="VisitsModule.addAttendeeRow()">
                                        <i class="bi bi-person-plus"></i> เพิ่มผู้เข้าร่วม
                                    </button>
                                </div>
                                <div id="attendeeContainer">
                                    <div class="text-center text-muted py-2" id="noAttendeeMsg">
                                        <small><i class="bi bi-person-plus"></i> กดปุ่ม "เพิ่มผู้เข้าร่วม" เพื่อระบุรายชื่อผู้เข้าพบ</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Product Interest / Needs -->
                    <div class="card mb-4">
                        <div class="card-header bg-success bg-opacity-10">
                            <h5 class="mb-0"><i class="bi bi-box-seam text-success"></i> สินค้าที่สนใจ / ความต้องการลูกค้า</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-bold">กลุ่มสินค้าที่สนใจ</label>
                                    <div class="d-flex flex-wrap gap-3">
                                        ${[
                { id: 'mediq', label: 'MEDIQ Platform', color: 'primary', icon: 'bi-people-fill' },
                { id: 'his', label: 'Medicore HIS', color: 'success', icon: 'bi-hospital' },
                { id: 'erp', label: 'ERP', color: 'info', icon: 'bi-building-gear' },
                { id: 'custom', label: 'Custom Solutions', color: 'warning', icon: 'bi-puzzle' }
            ].map(p => `
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="prod_${p.id}" value="${p.label}">
                                                <label class="form-check-label" for="prod_${p.id}">
                                                    <i class="bi ${p.icon} text-${p.color} me-1"></i> ${p.label}
                                                </label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">ระดับความสนใจ</label>
                                    <select id="vr_interest" class="form-select">
                                        <option value="hot">🔥 Hot - สนใจมาก</option>
                                        <option value="warm" selected>🌤️ Warm - ปานกลาง</option>
                                        <option value="cold">❄️ Cold - ยังไม่พร้อม</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">ระดับงบประมาณ</label>
                                    <select id="vr_budgetLevel" class="form-select">
                                        <option value="" selected>-- ยังไม่ทราบ --</option>
                                        <option value="Level 1">Level 1 - มีงบพร้อม</option>
                                        <option value="Level 2">Level 2 - อยู่ในแผน</option>
                                        <option value="Level 3">Level 3 - กำลังของบ</option>
                                        <option value="Level 4">Level 4 - ยังไม่มีงบ</option>
                                        <option value="Level 5">Level 5 - งบพิเศษ/เร่งด่วน</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">ปีงบประมาณ</label>
                                    <select id="vr_budgetYear" class="form-select">
                                        <option value="">-- ไม่ระบุ --</option>
                                        <option value="2568">ปี 2568</option>
                                        <option value="2569" selected>ปี 2569</option>
                                        <option value="2570">ปี 2570</option>
                                        <option value="2571">ปี 2571</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold">ความต้องการเฉพาะ / Pain Points</label>
                                    <textarea id="vr_needs" class="form-control" rows="3" placeholder="เช่น ต้องการระบบที่เชื่อมต่อกับ HIS เดิมได้ / มีปัญหาเรื่องคิวผู้ป่วย..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold">โมดูลที่สนใจเพิ่มเติม</label>
                                    <input type="text" id="vr_modules" class="form-control" placeholder="เช่น OPD, IPD, Pharmacy, Lab, Queue">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Summary -->
                    <div class="card mb-4">
                        <div class="card-header bg-info bg-opacity-10">
                            <h5 class="mb-0"><i class="bi bi-journal-text text-info"></i> สรุปผลการเข้าพบ</h5>
                        </div>
                        <div class="card-body">
                            <textarea id="vr_summary" class="form-control" rows="4" placeholder="สรุปผลการเข้าพบ ประเด็นสำคัญ ข้อตกลง..."></textarea>
                        </div>
                    </div>

                    <!-- Section 4: Follow-up Tasks -->
                    <div class="card mb-4">
                        <div class="card-header bg-warning bg-opacity-10 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-list-task text-warning"></i> Follow-up Tasks</h5>
                            <button type="button" class="btn btn-sm btn-outline-warning" onclick="VisitsModule.addTaskRow()">
                                <i class="bi bi-plus-lg"></i> เพิ่ม Task
                            </button>
                        </div>
                        <div class="card-body">
                            <div id="taskContainer">
                                <div class="text-center text-muted py-3" id="noTaskMsg">
                                    <i class="bi bi-clipboard-plus"></i> กดปุ่ม "เพิ่ม Task" เพื่อสร้างงานที่ต้อง Follow-up
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-flex justify-content-between mb-5">
                        <button type="button" class="btn btn-outline-secondary" onclick="Router.navigate('#/visits')">
                            <i class="bi bi-arrow-left"></i> ยกเลิก
                        </button>
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="bi bi-check-circle"></i> บันทึกรายงาน
                        </button>
                    </div>
                </form>
            </div>
        `;

        this._taskCounter = 0;
        this._attendeeCounter = 0;
    },

    // ==================== TASK ROW ====================
    addTaskRow() {
        const container = document.getElementById('taskContainer');
        const noMsg = document.getElementById('noTaskMsg');
        if (noMsg) noMsg.remove();

        this._taskCounter = (this._taskCounter || 0) + 1;
        const idx = this._taskCounter;
        const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

        const row = document.createElement('div');
        row.className = 'card mb-2 border';
        row.id = `taskRow_${idx}`;
        row.innerHTML = `
            <div class="card-body py-2 px-3">
                <div class="row g-2 align-items-end">
                    <div class="col-md-5">
                        <label class="form-label small mb-0 fw-bold">งานที่ต้องทำ</label>
                        <input type="text" class="form-control form-control-sm" id="task_desc_${idx}" placeholder="เช่น ส่งเอกสาร Proposal" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small mb-0 fw-bold">กำหนดส่ง</label>
                        <input type="date" class="form-control form-control-sm" id="task_date_${idx}" value="${nextWeek}" required>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small mb-0 fw-bold">ความสำคัญ</label>
                        <select class="form-select form-select-sm" id="task_pri_${idx}">
                            <option value="high">🔴 สูง</option>
                            <option value="medium" selected>🟡 กลาง</option>
                            <option value="low">🟢 ต่ำ</option>
                        </select>
                    </div>
                    <div class="col-md-2 text-end">
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="VisitsModule.removeTaskRow(${idx})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(row);
    },

    removeTaskRow(idx) {
        const row = document.getElementById(`taskRow_${idx}`);
        if (row) row.remove();
        const container = document.getElementById('taskContainer');
        if (container && container.children.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-3" id="noTaskMsg"><i class="bi bi-clipboard-plus"></i> กดปุ่ม "เพิ่ม Task" เพื่อสร้างงานที่ต้อง Follow-up</div>';
        }
    },

    // ==================== ATTENDEE ROWS ====================
    addAttendeeRow() {
        const container = document.getElementById('attendeeContainer');
        const noMsg = document.getElementById('noAttendeeMsg');
        if (noMsg) noMsg.remove();

        this._attendeeCounter = (this._attendeeCounter || 0) + 1;
        const idx = this._attendeeCounter;

        const row = document.createElement('div');
        row.className = 'card mb-2 border';
        row.id = `attendeeRow_${idx}`;
        row.innerHTML = `
            <div class="card-body py-2 px-3">
                <div class="row g-2 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label small mb-0 fw-bold">ชื่อ-สกุล</label>
                        <input type="text" class="form-control form-control-sm" id="att_name_${idx}" placeholder="เช่น นพ.สมชาย">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small mb-0 fw-bold">ตำแหน่ง</label>
                        <input type="text" class="form-control form-control-sm" id="att_pos_${idx}" placeholder="เช่น ผอ., หัว IT">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small mb-0 fw-bold">โทรศัพท์</label>
                        <input type="text" class="form-control form-control-sm" id="att_phone_${idx}" placeholder="08x-xxx-xxxx">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small mb-0 fw-bold">อีเมล</label>
                        <input type="email" class="form-control form-control-sm" id="att_email_${idx}" placeholder="email@...">
                    </div>
                    <div class="col-md-1 text-end">
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="VisitsModule.removeAttendeeRow(${idx})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(row);
    },

    removeAttendeeRow(idx) {
        const row = document.getElementById(`attendeeRow_${idx}`);
        if (row) row.remove();
        const container = document.getElementById('attendeeContainer');
        if (container && container.children.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-2" id="noAttendeeMsg"><small><i class="bi bi-person-plus"></i> กดปุ่ม "เพิ่มผู้เข้าร่วม" เพื่อระบุรายชื่อผู้เข้าพบ</small></div>';
        }
    },

    // ==================== SAVE REPORT ====================
    saveReport(e) {
        e.preventDefault();

        const customerId = document.getElementById('vr_customer').value;
        if (!customerId) { alert('กรุณาเลือกลูกค้า'); return; }

        // Collect selected products
        const products = [];
        ['mediq', 'his', 'erp', 'custom'].forEach(id => {
            const cb = document.getElementById(`prod_${id}`);
            if (cb && cb.checked) products.push(cb.value);
        });

        // Collect attendees
        const attendees = [];
        document.querySelectorAll('[id^="attendeeRow_"]').forEach(row => {
            const idx = row.id.split('_')[1];
            const name = document.getElementById(`att_name_${idx}`)?.value?.trim();
            const position = document.getElementById(`att_pos_${idx}`)?.value?.trim();
            const phone = document.getElementById(`att_phone_${idx}`)?.value?.trim();
            const email = document.getElementById(`att_email_${idx}`)?.value?.trim();
            if (name) attendees.push({ name, position, phone, email });
        });

        const reportId = `VIS-${Date.now()}`;
        const report = {
            id: reportId,
            customerId,
            visitDate: document.getElementById('vr_date').value,
            location: document.getElementById('vr_location').value,
            attendees: JSON.stringify(attendees),
            objective: document.getElementById('vr_objective').value,
            products,
            interestLevel: document.getElementById('vr_interest').value,
            budgetLevel: document.getElementById('vr_budgetLevel').value,
            budgetYear: document.getElementById('vr_budgetYear').value,
            needs: document.getElementById('vr_needs').value,
            modules: document.getElementById('vr_modules').value,
            summary: document.getElementById('vr_summary').value,
            createdBy: 'USR-001',
            createdAt: new Date().toISOString()
        };

        Storage.add('visitReports', report);

        // Save tasks
        const taskRows = document.querySelectorAll('[id^="taskRow_"]');
        taskRows.forEach(row => {
            const idx = row.id.split('_')[1];
            const desc = document.getElementById(`task_desc_${idx}`)?.value;
            const deadline = document.getElementById(`task_date_${idx}`)?.value;
            const priority = document.getElementById(`task_pri_${idx}`)?.value;
            if (desc && deadline) {
                Storage.add('followUps', {
                    id: `FUP-${Date.now()}-${idx}`,
                    reportId,
                    customerId,
                    action: desc,
                    deadline: new Date(deadline).toISOString(),
                    priority: priority || 'medium',
                    assignedTo: 'USR-001',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            }
        });

        // Redirect to list
        Router.navigate('#/visits');
    },

    // ==================== SHOW DETAIL (Drawer) ====================
    showDetail(reportId) {
        const report = Storage.getById('visitReports', reportId);
        if (!report) return;
        const customer = Storage.getById('customers', report.customerId);
        const tasks = (Storage.get('followUps') || []).filter(f => f.reportId === reportId);

        const content = `
            <div class="p-3">
                <h5 class="mb-3"><i class="bi bi-building"></i> ${customer?.name || '-'}</h5>
                <table class="table table-sm table-borderless">
                    <tr><td class="text-muted" style="width:140px">วันที่เข้าพบ</td><td>${this.fmtDate(report.visitDate)}</td></tr>
                    <tr><td class="text-muted">สถานที่</td><td>${report.location || '-'}</td></tr>
                    <tr><td class="text-muted">วัตถุประสงค์</td><td>${report.objective || '-'}</td></tr>
                    <tr><td class="text-muted">ระดับความสนใจ</td><td><span class="badge ${report.interestLevel === 'hot' ? 'bg-danger' : report.interestLevel === 'warm' ? 'bg-warning text-dark' : 'bg-secondary'}">${report.interestLevel || '-'}</span></td></tr>
                    <tr><td class="text-muted">สินค้าที่สนใจ</td><td>${(report.products || []).map(p => `<span class="badge bg-info text-dark me-1">${p}</span>`).join('') || '-'}</td></tr>
                    <tr><td class="text-muted">โมดูล</td><td>${report.modules || '-'}</td></tr>
                    ${report.budgetLevel ? `<tr><td class="text-muted">ระดับงบประมาณ</td><td><span class="badge bg-success">${report.budgetLevel}</span></td></tr>` : ''}
                    ${report.budgetYear ? `<tr><td class="text-muted">ปีงบประมาณ</td><td>${report.budgetYear}</td></tr>` : ''}
                </table>

                ${(() => {
                let atts = []; try { atts = JSON.parse(report.attendees || '[]'); } catch { atts = report.attendees ? [{ name: report.attendees }] : []; } return atts.length > 0 ? `
                <div class="mb-3">
                    <strong><i class="bi bi-people"></i> ผู้เข้าร่วม (${atts.length} คน):</strong>
                    <table class="table table-sm table-bordered mt-1">
                        <thead class="table-light"><tr><th>ชื่อ</th><th>ตำแหน่ง</th><th>โทร</th><th>อีเมล</th></tr></thead>
                        <tbody>${atts.map(a => `<tr><td>${a.name || '-'}</td><td>${a.position || '-'}</td><td>${a.phone || '-'}</td><td>${a.email || '-'}</td></tr>`).join('')}</tbody>
                    </table>
                </div>` : '';
            })()}
                ${report.needs ? `<div class="mb-3"><strong>ความต้องการ / Pain Points:</strong><p class="mt-1 p-2 bg-light rounded">${report.needs}</p></div>` : ''}
                ${report.summary ? `<div class="mb-3"><strong>สรุปผลการเข้าพบ:</strong><p class="mt-1 p-2 bg-light rounded">${report.summary}</p></div>` : ''}

                <h6 class="mt-4 mb-2"><i class="bi bi-list-task"></i> Follow-up Tasks (${tasks.length})</h6>
                ${tasks.length === 0 ? '<p class="text-muted">ไม่มี Task</p>' : `
                    <div class="list-group">
                        ${tasks.map(t => `
                            <div class="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="fw-bold">${t.action}</div>
                                    <small class="text-muted"><i class="bi bi-calendar"></i> ${this.fmtDate(t.deadline)}</small>
                                    <span class="badge ${t.priority === 'high' ? 'bg-danger' : t.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'} ms-2">${t.priority}</span>
                                </div>
                                <span class="badge ${t.status === 'done' ? 'bg-success' : t.status === 'overdue' ? 'bg-danger' : 'bg-primary'}">${t.status}</span>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        // Use drawer if available, otherwise modal
        if (typeof openDrawer === 'function') {
            openDrawer('รายละเอียดการเข้าพบ', content);
        } else {
            this._showModal('รายละเอียดการเข้าพบ', content);
        }
    },

    _showModal(title, body) {
        let modal = document.getElementById('visitDetailModal');
        if (modal) modal.remove();
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal fade" id="visitDetailModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${body}</div>
                    </div>
                </div>
            </div>
        `);
        new bootstrap.Modal(document.getElementById('visitDetailModal')).show();
    },

    // ==================== FOLLOW-UP DASHBOARD ====================
    renderFollowup() {
        const followUps = Storage.get('followUps') || [];
        const now = new Date();

        // Auto-update overdue status
        followUps.forEach(f => {
            if (f.status === 'pending' && new Date(f.deadline) < now) {
                f.status = 'overdue';
            }
        });

        const overdue = followUps.filter(f => f.status === 'overdue');
        const today = followUps.filter(f => {
            const d = new Date(f.deadline);
            return d.toDateString() === now.toDateString() && f.status === 'pending';
        });
        const thisWeek = followUps.filter(f => {
            const d = new Date(f.deadline);
            const weekFromNow = new Date(now.getTime() + 7 * 86400000);
            return d > now && d <= weekFromNow && f.status === 'pending';
        });

        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page-container">
                <nav aria-label="breadcrumb" class="mb-3">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#/visits">การเข้าพบลูกค้า</a></li>
                        <li class="breadcrumb-item active">Follow-up Dashboard</li>
                    </ol>
                </nav>
                <div class="page-header">
                    <h1><i class="bi bi-list-check"></i> Follow-up Dashboard</h1>
                    <p class="text-muted mb-0">ติดตามงานที่ต้องทำ</p>
                </div>

                <div class="card mb-4 border-danger">
                    <div class="card-header bg-danger text-white"><h5 class="mb-0"><i class="bi bi-exclamation-triangle"></i> เกินกำหนด (${overdue.length})</h5></div>
                    <div class="card-body">${this.renderFollowUpList(overdue)}</div>
                </div>

                <div class="card mb-4 border-warning">
                    <div class="card-header bg-warning text-dark"><h5 class="mb-0"><i class="bi bi-calendar-day"></i> วันนี้ (${today.length})</h5></div>
                    <div class="card-body">${this.renderFollowUpList(today)}</div>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-primary text-white"><h5 class="mb-0"><i class="bi bi-calendar-week"></i> สัปดาห์นี้ (${thisWeek.length})</h5></div>
                    <div class="card-body">${this.renderFollowUpList(thisWeek)}</div>
                </div>
            </div>
        `;
    },

    renderFollowUpList(followUps) {
        if (followUps.length === 0) return '<p class="text-muted text-center py-3">ไม่มีรายการ</p>';
        return `<div class="list-group">${followUps.map(f => {
            const customer = Storage.getById('customers', f.customerId);
            const daysLeft = Math.ceil((new Date(f.deadline) - new Date()) / 86400000);
            return `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${f.action}</h6>
                            <p class="mb-1 text-muted"><i class="bi bi-building"></i> ${customer?.name || '-'}</p>
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${this.fmtDate(f.deadline)}
                                ${daysLeft < 0 ? `<span class="text-danger">(เกิน ${Math.abs(daysLeft)} วัน)</span>` :
                    daysLeft === 0 ? '<span class="text-warning">(วันนี้)</span>' :
                        `<span>(อีก ${daysLeft} วัน)</span>`}
                            </small>
                            ${f.priority ? `<span class="badge ${f.priority === 'high' ? 'bg-danger' : f.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'} ms-2">${f.priority}</span>` : ''}
                        </div>
                        <button class="btn btn-sm btn-success" onclick="VisitsModule.markDone('${f.id}')"><i class="bi bi-check"></i> เสร็จ</button>
                    </div>
                </div>
            `;
        }).join('')}</div>`;
    },

    markDone(taskId) {
        Storage.update('followUps', taskId, { status: 'done' });
        this.renderFollowup();
    },

    fmtDate(d) {
        if (!d) return '-';
        try {
            return new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return d; }
    },

    filterVisits(query) {
        const rows = document.querySelectorAll('.table tbody tr');
        const q = query.toLowerCase();
        rows.forEach(row => { row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    }
};

VisitsModule.init();
console.log('✅ Visits module loaded');
