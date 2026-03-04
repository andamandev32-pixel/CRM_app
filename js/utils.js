// Utils.js - Utility functions for Sale Tracking System v1.3

const Utils = {
    // Format date to Thai format
    formatDate(date, format = 'full') {
        if (!date) return '-';

        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';

        const thaiMonths = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];

        const thaiMonthsFull = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear() + 543; // Buddhist year
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');

        switch (format) {
            case 'short':
                return `${day}/${month + 1}/${year}`;
            case 'medium':
                return `${day} ${thaiMonths[month]} ${year}`;
            case 'full':
                return `${day} ${thaiMonthsFull[month]} ${year}`;
            case 'datetime':
                return `${day} ${thaiMonths[month]} ${year} ${hours}:${minutes}`;
            case 'time':
                return `${hours}:${minutes}`;
            default:
                return `${day} ${thaiMonthsFull[month]} ${year}`;
        }
    },

    // Format currency (Thai Baht)
    formatCurrency(amount) {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Format number with commas
    formatNumber(num) {
        if (num === null || num === undefined) return '-';
        return new Intl.NumberFormat('th-TH').format(num);
    },

    // Calculate days between dates
    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Calculate days from now
    daysFromNow(date) {
        const now = new Date();
        const target = new Date(date);
        const diffTime = target - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Time ago in Thai
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = {
            'ปี': 31536000,
            'เดือน': 2592000,
            'สัปดาห์': 604800,
            'วัน': 86400,
            'ชั่วโมง': 3600,
            'นาที': 60,
            'วินาที': 1
        };

        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${name}ที่แล้ว`;
            }
        }

        return 'เมื่อสักครู่';
    },

    // Generate random ID
    generateId(prefix = 'ID') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    },

    // Get badge class by status
    getBadgeClass(status, type = 'default') {
        const statusMap = {
            // General
            'active': 'badge-success',
            'inactive': 'badge-gray',
            'pending': 'badge-warning',
            'approved': 'badge-success',
            'rejected': 'badge-danger',
            'draft': 'badge-gray',

            // Pipeline stages
            'S1': 'badge-gray',
            'S2': 'badge-info',
            'S3': 'badge-blue',
            'S4': 'badge-warning',
            'S5': 'badge-success',
            'S6': 'badge-success',

            // Interest levels
            'hot': 'badge-danger',
            'warm': 'badge-warning',
            'cold': 'badge-info',

            // Tiers
            'T1': 'badge-danger',
            'T2': 'badge-warning',
            'T3': 'badge-success',
            'T4': 'badge-gray',

            // Project health
            'green': 'badge-success',
            'yellow': 'badge-warning',
            'red': 'badge-danger',

            // Priority
            'high': 'badge-danger',
            'medium': 'badge-warning',
            'low': 'badge-success',

            // Demo/Trial
            'demo': 'badge-info',
            'trial': 'badge-blue'
        };

        return statusMap[status?.toLowerCase()] || 'badge-gray';
    },

    // Get status icon
    getStatusIcon(status) {
        const iconMap = {
            'pending': '⏳',
            'approved': '✅',
            'rejected': '❌',
            'draft': '📝',
            'hot': '🔴',
            'warm': '🟡',
            'cold': '🔵',
            'green': '🟢',
            'yellow': '🟡',
            'red': '🔴',
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        };

        return iconMap[status?.toLowerCase()] || '';
    },

    // Truncate text
    truncate(text, length = 50) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    // Debounce function
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Download JSON as file
    downloadJSON(data, filename = 'export.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0D6EFD'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone (Thai format)
    isValidPhone(phone) {
        const re = /^[0-9]{9,10}$/;
        return re.test(phone.replace(/[-\s]/g, ''));
    },

    // Calculate percentage
    percentage(value, total) {
        if (!total || total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    // Sort array by field
    sortBy(array, field, order = 'asc') {
        return array.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    },

    // Group array by field
    groupBy(array, field) {
        return array.reduce((groups, item) => {
            const key = item[field];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    },

    // Get random item from array
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Get random number between min and max
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Get random date between two dates
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    // Get customer type label in Thai
    getCustomerTypeLabel(type) {
        const labels = {
            'army': 'กองทัพ',
            'government': 'รัฐบาล',
            'private': 'เอกชน',
            'clinic': 'คลินิก'
        };
        return labels[type] || type;
    },

    // Calculate win rate
    calculateWinRate(won, total) {
        if (!total || total === 0) return 0;
        return Math.round((won / total) * 100);
    },

    // Calculate weighted pipeline
    calculateWeightedValue(value, probability) {
        return Math.round(value * (probability / 100));
    }
};

console.log('✅ Utils module loaded');
