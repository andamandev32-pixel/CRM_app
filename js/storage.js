// Storage.js - LocalStorage wrapper for Sale Tracking System v1.3
// Provides CRUD operations for all 46 data tables

const Storage = {
    // Namespace prefix to avoid conflicts
    prefix: 'sts_v13_',

    // Initialize storage with empty arrays for all tables
    init() {
        const tables = [
            // Core (4)
            'customers', 'contacts', 'users', 'notifications',
            // Visit & Activity (4)
            'visitPlans', 'visitPlanItems', 'visitReports', 'followUps',
            // Pipeline & Demo (6)
            'opportunities', 'demoRequests', 'demoProgress', 'demoEvaluations',
            'deviceHandovers', 'customerInsights',
            // Assessment (4)
            'segments', 'customerSegments', 'assessmentScores', 'tierMigrationLog',
            // Sales Planning (5)
            'salesQuota', 'activityPlans', 'calendarEvents', 'preVisitAssessments', 'planActualLog',
            // Dev Request & Pricing (6)
            'devRequests', 'devResponses', 'strategicPricings', 'strategicApprovals',
            'strategicKPILog', 'pricingPolicy',
            // Meeting & Documents (4)
            'meetingRecords', 'meetingActionItems', 'documentTrackers', 'documentStatusLog',
            // Project Management (6)
            'projects', 'milestones', 'projectIssues', 'deliveryLogs',
            'projectMeetings', 'customerAssignments',
            // Product Owner (7)
            'devBacklog', 'feasibilityLogs', 'requirementThreads', 'releaseNotes',
            'winLossLog', 'coachingNotes', 'teamWorkload',
            // Settings & Configuration (3)
            'pipelineTemplates', 'tierConfig', 'stageTaskLogs'
        ];

        tables.forEach(table => {
            if (!this.get(table)) {
                this.set(table, []);
            }
        });

        console.log('✅ Storage initialized with 49 tables');
    },

    // Get all records from a table
    get(table) {
        try {
            const data = localStorage.getItem(this.prefix + table);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error reading ${table}:`, e);
            return [];
        }
    },

    // Set entire table data
    set(table, data) {
        try {
            localStorage.setItem(this.prefix + table, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Error writing ${table}:`, e);
            return false;
        }
    },

    // Get single record by ID
    getById(table, id) {
        const data = this.get(table);
        return data.find(item => item.id === id);
    },

    // Add new record
    add(table, record) {
        const data = this.get(table);

        // Auto-generate ID if not provided
        if (!record.id) {
            record.id = this.generateId(table);
        }

        // Add timestamps
        if (!record.createdAt) {
            record.createdAt = new Date().toISOString();
        }

        data.push(record);
        this.set(table, data);
        return record;
    },

    // Update existing record
    update(table, id, updates) {
        const data = this.get(table);
        const index = data.findIndex(item => item.id === id);

        if (index === -1) {
            console.error(`Record ${id} not found in ${table}`);
            return null;
        }

        // Add update timestamp
        updates.updatedAt = new Date().toISOString();

        data[index] = { ...data[index], ...updates };
        this.set(table, data);
        return data[index];
    },

    // Delete record
    delete(table, id) {
        const data = this.get(table);
        const filtered = data.filter(item => item.id !== id);

        if (filtered.length === data.length) {
            console.error(`Record ${id} not found in ${table}`);
            return false;
        }

        this.set(table, filtered);
        return true;
    },

    // Query with filters
    query(table, filters = {}) {
        let data = this.get(table);

        // Apply filters
        Object.keys(filters).forEach(key => {
            const value = filters[key];

            if (value === null || value === undefined) return;

            if (Array.isArray(value)) {
                // Array filter (OR condition)
                data = data.filter(item => value.includes(item[key]));
            } else if (typeof value === 'object' && value.operator) {
                // Advanced filter with operator
                data = data.filter(item => {
                    switch (value.operator) {
                        case '>': return item[key] > value.value;
                        case '<': return item[key] < value.value;
                        case '>=': return item[key] >= value.value;
                        case '<=': return item[key] <= value.value;
                        case '!=': return item[key] !== value.value;
                        case 'contains': return item[key]?.toLowerCase().includes(value.value.toLowerCase());
                        default: return item[key] === value.value;
                    }
                });
            } else {
                // Simple equality filter
                data = data.filter(item => item[key] === value);
            }
        });

        return data;
    },

    // Generate unique ID
    generateId(table) {
        const prefix = table.substring(0, 3).toUpperCase();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    },

    // Clear all data (for testing)
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
        console.log('🗑️ All storage cleared');
    },

    // Export all data as JSON
    exportAll() {
        const data = {};
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const tableName = key.replace(this.prefix, '');
                data[tableName] = this.get(tableName);
            }
        });

        return data;
    },

    // Import data from JSON
    importAll(data) {
        Object.keys(data).forEach(table => {
            this.set(table, data[table]);
        });
        console.log('📥 Data imported successfully');
    },

    // Get storage statistics
    getStats() {
        const stats = {};
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const tableName = key.replace(this.prefix, '');
                const data = this.get(tableName);
                stats[tableName] = data.length;
            }
        });

        return stats;
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    Storage.init();
}

console.log('✅ Storage module loaded');
