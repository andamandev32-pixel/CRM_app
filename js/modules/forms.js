// Forms Module - Reusable form utilities for STS v1.3
// Provides modal display, validation, and notification functions

const FormsModule = {
    currentModal: null,

    // Show modal with form content
    showModal(title, content, options = {}) {
        const backdrop = document.getElementById('modalBackdrop');
        const drawer = document.getElementById('drawer');
        const drawerTitle = document.getElementById('drawerTitle');
        const drawerBody = document.getElementById('drawerBody');

        if (!backdrop || !drawer || !drawerTitle || !drawerBody) {
            console.error('Drawer elements not found in DOM');
            return;
        }

        drawerTitle.textContent = title;
        drawerBody.innerHTML = content;

        backdrop.style.display = 'block';
        drawer.style.display = 'block';

        // Store modal reference
        this.currentModal = { title, content, options };

        // Close on backdrop click (if not disabled)
        if (!options.disableBackdropClose) {
            backdrop.onclick = () => this.closeModal();
        }

        // Focus first input
        setTimeout(() => {
            const firstInput = drawerBody.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    },

    // Close modal
    closeModal() {
        const backdrop = document.getElementById('modalBackdrop');
        const drawer = document.getElementById('drawer');

        if (drawer) drawer.style.display = 'none';
        if (backdrop) {
            backdrop.style.display = 'none';
            backdrop.onclick = null;
        }

        this.currentModal = null;
    },

    // Validate form
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        // Check HTML5 validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        // Custom validation rules
        const errors = [];

        // Email validation
        const emailInputs = form.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            if (input.value && !this.isValidEmail(input.value)) {
                errors.push(`${input.name || 'Email'}: รูปแบบอีเมลไม่ถูกต้อง`);
            }
        });

        // Date range validation
        const startDate = form.querySelector('[name="startDate"]');
        const endDate = form.querySelector('[name="endDate"]');
        if (startDate && endDate && startDate.value && endDate.value) {
            if (new Date(startDate.value) > new Date(endDate.value)) {
                errors.push('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น');
            }
        }

        // Show errors if any
        if (errors.length > 0) {
            this.showNotification(errors.join('<br>'), 'error');
            return false;
        }

        return true;
    },

    // Get form data as object
    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            // Handle checkboxes
            if (form.elements[key]?.type === 'checkbox') {
                data[key] = form.elements[key].checked;
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    // Show notification toast
    showNotification(message, type = 'success') {
        // Create toast container if not exists
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Show animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Email validation helper
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Generate form field HTML
    generateFormField(config) {
        const {
            type = 'text',
            name,
            label,
            value = '',
            required = false,
            placeholder = '',
            options = [],
            rows = 3,
            min,
            max,
            pattern,
            help
        } = config;

        const requiredAttr = required ? 'required' : '';
        const requiredLabel = required ? '<span class="text-danger">*</span>' : '';

        let fieldHTML = '';

        switch (type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
            case 'datetime-local':
                fieldHTML = `
                    <input 
                        type="${type}" 
                        class="form-control" 
                        id="${name}" 
                        name="${name}" 
                        value="${value}"
                        placeholder="${placeholder}"
                        ${requiredAttr}
                        ${min ? `min="${min}"` : ''}
                        ${max ? `max="${max}"` : ''}
                        ${pattern ? `pattern="${pattern}"` : ''}
                    >
                `;
                break;

            case 'select':
                fieldHTML = `
                    <select class="form-select" id="${name}" name="${name}" ${requiredAttr}>
                        <option value="">-- เลือก --</option>
                        ${options.map(opt => {
                    const optValue = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    const selected = optValue === value ? 'selected' : '';
                    return `<option value="${optValue}" ${selected}>${optLabel}</option>`;
                }).join('')}
                    </select>
                `;
                break;

            case 'textarea':
                fieldHTML = `
                    <textarea 
                        class="form-control" 
                        id="${name}" 
                        name="${name}" 
                        rows="${rows}"
                        placeholder="${placeholder}"
                        ${requiredAttr}
                    >${value}</textarea>
                `;
                break;

            case 'radio':
                fieldHTML = options.map(opt => {
                    const optValue = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    const checked = optValue === value ? 'checked' : '';
                    return `
                        <div class="form-check form-check-inline">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                id="${name}_${optValue}" 
                                name="${name}" 
                                value="${optValue}"
                                ${checked}
                                ${requiredAttr}
                            >
                            <label class="form-check-label" for="${name}_${optValue}">
                                ${optLabel}
                            </label>
                        </div>
                    `;
                }).join('');
                break;

            case 'checkbox':
                const checked = value ? 'checked' : '';
                fieldHTML = `
                    <div class="form-check">
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            id="${name}" 
                            name="${name}"
                            ${checked}
                        >
                        <label class="form-check-label" for="${name}">
                            ${label}
                        </label>
                    </div>
                `;
                return fieldHTML; // Return early for checkbox (label is inline)
        }

        // Wrap field with label
        return `
            <div class="mb-3">
                <label for="${name}" class="form-label">
                    ${label} ${requiredLabel}
                </label>
                ${fieldHTML}
                ${help ? `<div class="form-text">${help}</div>` : ''}
            </div>
        `;
    },

    // Generate customer dropdown options (excludes discontinued customers)
    getCustomerOptions() {
        const customers = Storage.get('customers') || [];
        return customers
            .filter(c => c.status !== 'discontinue')
            .map(c => ({
                value: c.id,
                label: c.name
            }));
    },

    // Generate user dropdown options
    getUserOptions() {
        const users = Storage.get('users') || [];
        return users.map(u => ({
            value: u.id,
            label: u.name
        }));
    },

    // Show loading state
    showLoading(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังบันทึก...';
        }
    },

    // Hide loading state
    hideLoading(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> บันทึก';
        }
    }
};

// Initialize module
console.log('✅ Forms module loaded');
