// Export Module for STS v1.3
// Provides Excel and PDF export functionality

const ExportModule = {
    // Initialize module
    init() {
        console.log('📊 Export module initialized');
    },

    // Export to Excel using SheetJS
    exportToExcel(data, filename, sheetName = 'Sheet1') {
        try {
            // Check if XLSX library is loaded
            if (typeof XLSX === 'undefined') {
                alert('กรุณารอสักครู่... กำลังโหลด Excel library');
                this.loadXLSXLibrary(() => {
                    this.exportToExcel(data, filename, sheetName);
                });
                return;
            }

            // Create workbook
            const wb = XLSX.utils.book_new();

            // Create worksheet from data
            const ws = XLSX.utils.json_to_sheet(data);

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            // Generate Excel file and trigger download
            XLSX.writeFile(wb, `${filename}.xlsx`);

            this.showSuccessMessage(`ส่งออก ${filename}.xlsx สำเร็จ!`);
        } catch (error) {
            console.error('Export to Excel error:', error);
            alert('เกิดข้อผิดพลาดในการส่งออก Excel');
        }
    },

    // Export to PDF using jsPDF
    exportToPDF(title, headers, data, filename) {
        try {
            // Check if jsPDF library is loaded
            if (typeof jspdf === 'undefined') {
                alert('กรุณารอสักครู่... กำลังโหลด PDF library');
                this.loadJsPDFLibrary(() => {
                    this.exportToPDF(title, headers, data, filename);
                });
                return;
            }

            const { jsPDF } = jspdf;
            const doc = new jsPDF();

            // Add Thai font support (using default for now)
            doc.setFont('helvetica');

            // Add title
            doc.setFontSize(16);
            doc.text(title, 14, 15);

            // Add date
            doc.setFontSize(10);
            doc.text(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, 14, 22);

            // Add table using autoTable plugin
            if (typeof doc.autoTable !== 'undefined') {
                doc.autoTable({
                    head: [headers],
                    body: data,
                    startY: 30,
                    styles: { font: 'helvetica', fontSize: 9 },
                    headStyles: { fillColor: [0, 123, 255] }
                });
            } else {
                // Fallback if autoTable is not loaded
                let y = 35;
                data.forEach((row, index) => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(row.join(' | '), 14, y);
                    y += 7;
                });
            }

            // Save PDF
            doc.save(`${filename}.pdf`);

            this.showSuccessMessage(`ส่งออก ${filename}.pdf สำเร็จ!`);
        } catch (error) {
            console.error('Export to PDF error:', error);
            alert('เกิดข้อผิดพลาดในการส่งออก PDF');
        }
    },

    // Export Customers to Excel
    exportCustomersExcel() {
        const customers = Storage.get('customers');
        const data = customers.map(c => ({
            'รหัส': c.id,
            'ชื่อลูกค้า': c.name,
            'จังหวัด': c.province,
            'ประเภท': c.type,
            'สถานะ': c.status,
            'ผู้ดูแล': c.owner,
            'โทรศัพท์': c.phone || '-',
            'อีเมล': c.email || '-'
        }));

        this.exportToExcel(data, 'Customers_Export', 'Customers');
    },

    // Export Customers to PDF
    exportCustomersPDF() {
        const customers = Storage.get('customers');
        const headers = ['รหัส', 'ชื่อลูกค้า', 'จังหวัด', 'ประเภท', 'สถานะ'];
        const data = customers.map(c => [
            c.id,
            c.name,
            c.province,
            c.type,
            c.status
        ]);

        this.exportToPDF('รายชื่อลูกค้า', headers, data, 'Customers_Export');
    },

    // Export Visits to Excel
    exportVisitsExcel() {
        const visits = Storage.get('visitReports');
        const customers = Storage.get('customers');

        const data = visits.map(v => {
            const customer = customers.find(c => c.id === v.customerId);
            return {
                'วันที่': new Date(v.visitDate).toLocaleDateString('th-TH'),
                'ลูกค้า': customer?.name || '-',
                'วัตถุประสงค์': v.objective,
                'ผู้เข้าร่วม': v.attendees,
                'Interest': v.interest,
                'Next Action': v.nextAction || '-'
            };
        });

        this.exportToExcel(data, 'Visits_Export', 'Visit Reports');
    },

    // Export Demos to Excel
    exportDemosExcel() {
        const demos = Storage.get('demoRequests');
        const customers = Storage.get('customers');

        const data = demos.map(d => {
            const customer = customers.find(c => c.id === d.customerId);
            return {
                'ID': d.id,
                'ลูกค้า': customer?.name || '-',
                'ประเภท': d.type,
                'ผลิตภัณฑ์': d.product,
                'วันเริ่ม': new Date(d.startDate).toLocaleDateString('th-TH'),
                'วันสิ้นสุด': new Date(d.endDate).toLocaleDateString('th-TH'),
                'ค่าใช้จ่าย': d.totalCost,
                'สถานะ': d.status
            };
        });

        this.exportToExcel(data, 'Demos_Export', 'Demo Requests');
    },

    // Export Pipeline to Excel
    exportPipelineExcel() {
        const opportunities = Storage.get('opportunities');
        const customers = Storage.get('customers');

        const data = opportunities.map(o => {
            const customer = customers.find(c => c.id === o.customerId);
            return {
                'ID': o.id,
                'ลูกค้า': customer?.name || '-',
                'ผลิตภัณฑ์': o.product,
                'มูลค่า': o.value,
                'ขั้นตอน': o.stage,
                'โอกาสชนะ': o.probability + '%',
                'วันปิดคาดการณ์': new Date(o.expectedCloseDate).toLocaleDateString('th-TH'),
                'สถานะ': o.status
            };
        });

        this.exportToExcel(data, 'Pipeline_Export', 'Sales Pipeline');
    },

    // Export Meetings to Excel
    exportMeetingsExcel() {
        const meetings = Storage.get('meetings');
        const customers = Storage.get('customers');

        const data = meetings.map(m => {
            const customer = customers.find(c => c.id === m.customerId);
            return {
                'ID': m.id,
                'วันที่': new Date(m.date).toLocaleDateString('th-TH'),
                'ลูกค้า': customer?.name || '-',
                'ประเภท': m.type,
                'หัวข้อ': m.topic,
                'ผู้เข้าร่วม': m.attendees
            };
        });

        this.exportToExcel(data, 'Meetings_Export', 'Meetings');
    },

    // Export Projects to Excel
    exportProjectsExcel() {
        const projects = Storage.get('projects');
        const customers = Storage.get('customers');

        const data = projects.map(p => {
            const customer = customers.find(c => c.id === p.customerId);
            return {
                'ID': p.id,
                'ชื่อโครงการ': p.name,
                'ลูกค้า': customer?.name || '-',
                'PM': p.pm,
                'สถานะ': p.health,
                'ความคืบหน้า': p.progress + '%',
                'วันเริ่ม': new Date(p.startDate).toLocaleDateString('th-TH'),
                'วันสิ้นสุด': new Date(p.endDate).toLocaleDateString('th-TH')
            };
        });

        this.exportToExcel(data, 'Projects_Export', 'Projects');
    },

    // Show export modal
    showExportModal(moduleName, exportFunctions) {
        const modalHTML = `
            <div id="exportModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-download"></i> ส่งออกข้อมูล ${moduleName}
                            </h5>
                            <button type="button" class="btn-close" onclick="ExportModule.closeExportModal()"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted">เลือกรูปแบบที่ต้องการส่งออก:</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success btn-lg" onclick="${exportFunctions.excel}; ExportModule.closeExportModal();">
                                    <i class="bi bi-file-earmark-excel"></i> ส่งออกเป็น Excel (.xlsx)
                                </button>
                                ${exportFunctions.pdf ? `
                                    <button class="btn btn-danger btn-lg" onclick="${exportFunctions.pdf}; ExportModule.closeExportModal();">
                                        <i class="bi bi-file-earmark-pdf"></i> ส่งออกเป็น PDF (.pdf)
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('exportModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Click outside to close
        document.getElementById('exportModal').addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') {
                this.closeExportModal();
            }
        });
    },

    // Close export modal
    closeExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) modal.remove();
    },

    // Show success message
    showSuccessMessage(message) {
        const toast = `
            <div class="toast-container position-fixed top-0 end-0 p-3">
                <div class="toast show" role="alert">
                    <div class="toast-header bg-success text-white">
                        <i class="bi bi-check-circle me-2"></i>
                        <strong class="me-auto">สำเร็จ</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toast);

        setTimeout(() => {
            const toastEl = document.querySelector('.toast-container');
            if (toastEl) toastEl.remove();
        }, 3000);
    },

    // Load XLSX library dynamically
    loadXLSXLibrary(callback) {
        if (document.getElementById('xlsx-script')) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.id = 'xlsx-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    },

    // Load jsPDF library dynamically
    loadJsPDFLibrary(callback) {
        if (document.getElementById('jspdf-script')) {
            callback();
            return;
        }

        const script1 = document.createElement('script');
        script1.id = 'jspdf-script';
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

        const script2 = document.createElement('script');
        script2.id = 'jspdf-autotable-script';
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';

        script1.onload = () => {
            script2.onload = callback;
            document.head.appendChild(script2);
        };

        document.head.appendChild(script1);
    }
};

ExportModule.init();
console.log('✅ Export module loaded');
