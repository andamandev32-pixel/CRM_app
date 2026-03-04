// Global Search Module for STS v1.3
// Provides universal search across all modules with keyboard shortcut

const GlobalSearch = {
    isOpen: false,
    recentSearches: [],
    searchResults: [],

    // Initialize module
    init() {
        console.log('🔍 Global Search module initialized');
        this.loadRecentSearches();
        this.setupKeyboardShortcut();
    },

    // Setup Ctrl+K / Cmd+K keyboard shortcut
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
            // ESC to close
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearchModal();
            }
        });
    },

    // Open search modal
    openSearchModal() {
        this.isOpen = true;
        this.renderSearchModal();

        // Focus on search input after render
        setTimeout(() => {
            const searchInput = document.getElementById('globalSearchInput');
            if (searchInput) searchInput.focus();
        }, 100);
    },

    // Close search modal
    closeSearchModal() {
        this.isOpen = false;
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
            modal.remove();
        }
    },

    // Render search modal
    renderSearchModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('globalSearchModal');
        if (existingModal) existingModal.remove();

        const modalHTML = `
            <div id="globalSearchModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div class="w-100">
                                <div class="input-group input-group-lg">
                                    <span class="input-group-text bg-white border-end-0">
                                        <i class="bi bi-search"></i>
                                    </span>
                                    <input type="text" 
                                        id="globalSearchInput" 
                                        class="form-control border-start-0 ps-0" 
                                        placeholder="ค้นหาทุกอย่าง... (Ctrl+K)"
                                        autocomplete="off">
                                    <button class="btn btn-outline-secondary" onclick="GlobalSearch.closeSearchModal()">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body" id="searchResultsContainer">
                            ${this.renderInitialState()}
                        </div>
                        <div class="modal-footer border-0 pt-0">
                            <small class="text-muted">
                                <kbd>↑</kbd> <kbd>↓</kbd> Navigate • 
                                <kbd>Enter</kbd> Select • 
                                <kbd>Esc</kbd> Close
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup search input listener
        const searchInput = document.getElementById('globalSearchInput');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Click outside to close
        document.getElementById('globalSearchModal').addEventListener('click', (e) => {
            if (e.target.id === 'globalSearchModal') {
                this.closeSearchModal();
            }
        });
    },

    // Render initial state (recent searches)
    renderInitialState() {
        if (this.recentSearches.length === 0) {
            return `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-search" style="font-size: 3rem;"></i>
                    <p class="mt-3">เริ่มค้นหาข้ามทุกโมดูล</p>
                    <small>ลูกค้า • เข้าพบ • Demo • Pipeline • Insights • ประชุม • โครงการ</small>
                </div>
            `;
        }

        return `
            <div class="mb-3">
                <h6 class="text-muted mb-2">
                    <i class="bi bi-clock-history"></i> ค้นหาล่าสุด
                </h6>
                <div class="list-group">
                    ${this.recentSearches.slice(0, 5).map(search => `
                        <a href="#" class="list-group-item list-group-item-action" 
                            onclick="GlobalSearch.searchFromRecent('${search}'); return false;">
                            <i class="bi bi-search me-2"></i> ${search}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Handle search with debouncing
    handleSearch: Utils.debounce(function (query) {
        if (!query || query.trim().length < 2) {
            document.getElementById('searchResultsContainer').innerHTML = GlobalSearch.renderInitialState();
            return;
        }

        GlobalSearch.performSearch(query.trim());
    }, 300),

    // Perform search across all modules
    performSearch(query) {
        const results = {
            customers: this.searchCustomers(query),
            visits: this.searchVisits(query),
            demos: this.searchDemos(query),
            pipeline: this.searchPipeline(query),
            insights: this.searchInsights(query),
            meetings: this.searchMeetings(query),
            projects: this.searchProjects(query),
            devRequests: this.searchDevRequests(query)
        };

        this.searchResults = results;
        this.renderSearchResults(query, results);
        this.saveRecentSearch(query);
    },

    // Search in customers
    searchCustomers(query) {
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return customers.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.province?.toLowerCase().includes(lowerQuery) ||
            c.type?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5);
    },

    // Search in visits
    searchVisits(query) {
        const visits = Storage.get('visitReports');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return visits.filter(v => {
            const customer = customers.find(c => c.id === v.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                v.objective?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in demos
    searchDemos(query) {
        const demos = Storage.get('demoRequests');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return demos.filter(d => {
            const customer = customers.find(c => c.id === d.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                d.product?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in pipeline
    searchPipeline(query) {
        const opportunities = Storage.get('opportunities');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return opportunities.filter(o => {
            const customer = customers.find(c => c.id === o.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                o.product?.toLowerCase().includes(lowerQuery) ||
                o.stage?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in insights
    searchInsights(query) {
        const insights = Storage.get('insights');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return insights.filter(i => {
            const customer = customers.find(c => c.id === i.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                i.insight?.toLowerCase().includes(lowerQuery) ||
                i.category?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in meetings
    searchMeetings(query) {
        const meetings = Storage.get('meetings');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return meetings.filter(m => {
            const customer = customers.find(c => c.id === m.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                m.topic?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in projects
    searchProjects(query) {
        const projects = Storage.get('projects');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return projects.filter(p => {
            const customer = customers.find(c => c.id === p.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                p.name?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Search in dev requests
    searchDevRequests(query) {
        const devRequests = Storage.get('devRequests');
        const customers = Storage.get('customers');
        const lowerQuery = query.toLowerCase();

        return devRequests.filter(d => {
            const customer = customers.find(c => c.id === d.customerId);
            return customer?.name.toLowerCase().includes(lowerQuery) ||
                d.product?.toLowerCase().includes(lowerQuery) ||
                d.requirement?.toLowerCase().includes(lowerQuery);
        }).slice(0, 5);
    },

    // Render search results
    renderSearchResults(query, results) {
        const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

        if (totalResults === 0) {
            document.getElementById('searchResultsContainer').innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                    <p class="mt-3">ไม่พบผลลัพธ์สำหรับ "${query}"</p>
                </div>
            `;
            return;
        }

        let html = `<div class="search-results">`;

        // Customers
        if (results.customers.length > 0) {
            html += this.renderResultGroup('ลูกค้า', 'people', results.customers, (c) => `
                <a href="#/customers/${c.id}" class="list-group-item list-group-item-action" 
                    onclick="GlobalSearch.closeSearchModal()">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${c.name}</h6>
                            <small class="text-muted">${c.province} • ${c.type}</small>
                        </div>
                        <span class="badge bg-${Utils.getStatusColor(c.status)}">${c.status}</span>
                    </div>
                </a>
            `);
        }

        // Pipeline
        if (results.pipeline.length > 0) {
            const customers = Storage.get('customers');
            html += this.renderResultGroup('Sales Pipeline', 'funnel', results.pipeline, (o) => {
                const customer = customers.find(c => c.id === o.customerId);
                return `
                    <a href="#/pipeline/${o.id}" class="list-group-item list-group-item-action" 
                        onclick="GlobalSearch.closeSearchModal()">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${customer?.name || 'Unknown'} - ${o.product}</h6>
                                <small class="text-muted">${o.stage} • ${Utils.formatCurrency(o.value)}</small>
                            </div>
                        </div>
                    </a>
                `;
            });
        }

        // Meetings
        if (results.meetings.length > 0) {
            const customers = Storage.get('customers');
            html += this.renderResultGroup('ประชุม', 'chat-dots', results.meetings, (m) => {
                const customer = customers.find(c => c.id === m.customerId);
                return `
                    <a href="#/meetings" class="list-group-item list-group-item-action" 
                        onclick="GlobalSearch.closeSearchModal()">
                        <div>
                            <h6 class="mb-1">${m.topic}</h6>
                            <small class="text-muted">${customer?.name || 'Unknown'} • ${Utils.formatDate(m.date)}</small>
                        </div>
                    </a>
                `;
            });
        }

        // Projects
        if (results.projects.length > 0) {
            const customers = Storage.get('customers');
            html += this.renderResultGroup('โครงการ', 'kanban', results.projects, (p) => {
                const customer = customers.find(c => c.id === p.customerId);
                return `
                    <a href="#/projects/${p.id}" class="list-group-item list-group-item-action" 
                        onclick="GlobalSearch.closeSearchModal()">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${p.name}</h6>
                                <small class="text-muted">${customer?.name || 'Unknown'}</small>
                            </div>
                            <span class="badge bg-${p.health === 'green' ? 'success' : p.health === 'yellow' ? 'warning' : 'danger'}">
                                ${p.health}
                            </span>
                        </div>
                    </a>
                `;
            });
        }

        html += `</div>`;
        document.getElementById('searchResultsContainer').innerHTML = html;
    },

    // Render result group
    renderResultGroup(title, icon, items, renderItem) {
        return `
            <div class="mb-3">
                <h6 class="text-muted mb-2">
                    <i class="bi bi-${icon}"></i> ${title} (${items.length})
                </h6>
                <div class="list-group">
                    ${items.map(renderItem).join('')}
                </div>
            </div>
        `;
    },

    // Save recent search
    saveRecentSearch(query) {
        if (!this.recentSearches.includes(query)) {
            this.recentSearches.unshift(query);
            this.recentSearches = this.recentSearches.slice(0, 10);
            localStorage.setItem('sts_recentSearches', JSON.stringify(this.recentSearches));
        }
    },

    // Load recent searches
    loadRecentSearches() {
        const saved = localStorage.getItem('sts_recentSearches');
        this.recentSearches = saved ? JSON.parse(saved) : [];
    },

    // Search from recent
    searchFromRecent(query) {
        document.getElementById('globalSearchInput').value = query;
        this.performSearch(query);
    },

    // Add search button to navbar
    addSearchButton() {
        const navbar = document.querySelector('.navbar .d-flex');
        if (navbar && !document.getElementById('globalSearchBtn')) {
            const searchBtn = `
                <button id="globalSearchBtn" class="btn btn-outline-light me-2" 
                    onclick="GlobalSearch.openSearchModal()" 
                    title="ค้นหา (Ctrl+K)">
                    <i class="bi bi-search"></i>
                </button>
            `;
            navbar.insertAdjacentHTML('afterbegin', searchBtn);
        }
    }
};

GlobalSearch.init();
console.log('✅ Global Search module loaded');
