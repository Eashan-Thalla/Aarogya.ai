/* ========================================================================
   Aarogya.ai — MongoDB Atlas API Client (js/api.js)
   Connects the frontend to the FastAPI + MongoDB Atlas backend
   Cluster: cluster0.ridhmnq.mongodb.net | Database: aarogya_db
   ======================================================================== */

const AarogyaAPI = {
  // Base URL configuration (auto-detects local server port 8000 or current origin)
  baseUrl: (window.location.port === '8000') ? '' : 'http://127.0.0.1:8000',
  
  // Real-time state
  state: {
    connected: false,
    cluster: 'cluster0.ridhmnq.mongodb.net',
    database: 'aarogya_db',
    latencyMs: null,
    counts: {},
    lastSynced: null,
    checking: false
  },

  /**
   * Ping and check connection status with MongoDB Atlas
   */
  async checkConnection() {
    this.state.checking = true;
    this.updateStatusBadge();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${this.baseUrl}/api/status`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.state.connected = (data.status === 'connected');
        this.state.database = data.database || 'aarogya_db';
        this.state.cluster = data.cluster || 'cluster0.ridhmnq.mongodb.net';
        this.state.latencyMs = data.latencyMs;
        this.state.counts = data.counts || {};
        this.state.lastSynced = new Date();
        
        console.log('🍃 [Aarogya.ai] Connected to MongoDB Atlas:', this.state);
        this.updateStatusBadge();
        return true;
      }
    } catch (err) {
      console.warn('⚡ [Aarogya.ai] MongoDB Backend offline. Using local mode.', err.message);
    } finally {
      this.state.checking = false;
      this.updateStatusBadge();
    }

    this.state.connected = false;
    this.updateStatusBadge();
    return false;
  },

  /**
   * Sync all cloud data from MongoDB into in-memory application data
   */
  async syncAllData() {
    const isOnline = await this.checkConnection();
    if (!isOnline) return false;

    try {
      // 1. Fetch User Profile
      try {
        const userRes = await fetch(`${this.baseUrl}/api/user`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.name) {
            Object.assign(MOCK_USER, userData);
            const greetEl = document.getElementById('headerGreeting');
            if (greetEl) greetEl.textContent = `Hello, ${MOCK_USER.name}`;
            const avatarEl = document.querySelector('.header-user-avatar');
            if (avatarEl) avatarEl.textContent = (MOCK_USER.name || 'E')[0].toUpperCase();
          }
        }
      } catch (e) {
        console.warn('Could not fetch user from DB:', e);
      }

      // 2. Fetch Hospitals
      try {
        const hospRes = await fetch(`${this.baseUrl}/api/hospitals`);
        if (hospRes.ok) {
          const hospData = await hospRes.json();
          if (Array.isArray(hospData) && hospData.length > 0) {
            // Replace or update MOCK_HOSPITALS
            MOCK_HOSPITALS.length = 0;
            hospData.forEach(h => MOCK_HOSPITALS.push(h));
            console.log(`🍃 Synced ${hospData.length} hospitals from MongoDB Atlas`);
          }
        }
      } catch (e) {
        console.warn('Could not fetch hospitals from DB:', e);
      }

      // 3. Fetch Treatments
      try {
        const treatRes = await fetch(`${this.baseUrl}/api/treatments`);
        if (treatRes.ok) {
          const treatData = await treatRes.json();
          if (Array.isArray(treatData) && treatData.length > 0) {
            MOCK_TREATMENTS.length = 0;
            treatData.forEach(t => MOCK_TREATMENTS.push(t));
          }
        }
      } catch (e) {
        console.warn('Could not fetch treatments from DB:', e);
      }

      // 4. Fetch Schemes
      try {
        const schemeRes = await fetch(`${this.baseUrl}/api/schemes`);
        if (schemeRes.ok) {
          const schemeData = await schemeRes.json();
          if (Array.isArray(schemeData) && schemeData.length > 0) {
            MOCK_SCHEMES.length = 0;
            schemeData.forEach(s => MOCK_SCHEMES.push(s));
          }
        }
      } catch (e) {
        console.warn('Could not fetch schemes from DB:', e);
      }

      // 5. Fetch Activities
      try {
        const actRes = await fetch(`${this.baseUrl}/api/activities`);
        if (actRes.ok) {
          const actData = await actRes.json();
          if (Array.isArray(actData) && actData.length > 0) {
            MOCK_ACTIVITIES.length = 0;
            actData.forEach(a => MOCK_ACTIVITIES.push(a));
          }
        }
      } catch (e) {
        console.warn('Could not fetch activities from DB:', e);
      }

      this.state.lastSynced = new Date();
      this.updateStatusBadge();
      
      // Refresh current page view with updated MongoDB data
      if (typeof window[`init${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}Page`] === 'function') {
        window[`init${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}Page`]();
      }

      return true;
    } catch (err) {
      console.error('Error syncing data with MongoDB:', err);
      return false;
    }
  },

  /**
   * Save / Update user profile to MongoDB Atlas
   */
  async saveUserProfile(userData) {
    if (!this.state.connected) {
      Object.assign(MOCK_USER, userData);
      localStorage.setItem('aarogya_user_profile', JSON.stringify(userData));
      return { success: true, mode: 'local' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        Object.assign(MOCK_USER, userData);
        return { success: true, mode: 'mongodb' };
      }
    } catch (e) {
      console.error('Error updating user in MongoDB:', e);
    }
    return { success: false };
  },

  /**
   * Add a new expense to MongoDB Atlas
   */
  async addExpense(expense) {
    if (!this.state.connected) {
      return { success: true, mode: 'local' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, mode: 'mongodb', data };
      }
    } catch (e) {
      console.error('Error adding expense to MongoDB:', e);
    }
    return { success: false };
  },

  /**
   * Add a hospital to MongoDB Atlas
   */
  async addHospital(hospital) {
    if (!this.state.connected) {
      MOCK_HOSPITALS.push(hospital);
      return { success: true, mode: 'local' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospital)
      });
      if (res.ok) {
        const data = await res.json();
        MOCK_HOSPITALS.push(hospital);
        return { success: true, mode: 'mongodb', data };
      }
    } catch (e) {
      console.error('Error saving hospital to MongoDB:', e);
    }
    return { success: false };
  },

  /**
   * Trigger database reseed
   */
  async seedDatabase(force = true) {
    try {
      const res = await fetch(`${this.baseUrl}/api/seed?force=${force}`, {
        method: 'POST'
      });
      if (res.ok) {
        await this.syncAllData();
        return true;
      }
    } catch (e) {
      console.error('Seed error:', e);
    }
    return false;
  },

  /**
   * Update the UI connection status badge in header
   */
  updateStatusBadge() {
    const badge = document.getElementById('mongoDbStatusPill');
    if (!badge) return;

    if (this.state.checking) {
      badge.className = 'mongodb-pill connecting';
      badge.innerHTML = `
        <span class="pulse-dot yellow"></span>
        <span class="pill-label">Connecting to MongoDB...</span>
      `;
    } else if (this.state.connected) {
      badge.className = 'mongodb-pill online';
      badge.innerHTML = `
        <span class="pulse-dot green"></span>
        <span class="pill-label">MongoDB Atlas</span>
        <span class="pill-tag">${this.state.latencyMs ? this.state.latencyMs + 'ms' : 'Live'}</span>
      `;
    } else {
      badge.className = 'mongodb-pill offline';
      badge.innerHTML = `
        <span class="pulse-dot gray"></span>
        <span class="pill-label">Local Data Mode</span>
        <span class="pill-tag">Offline</span>
      `;
    }
  },

  /**
   * Open the MongoDB Atlas details modal
   */
  openStatusModal() {
    let modal = document.getElementById('mongoDbModal');
    if (!modal) {
      this.createStatusModal();
      modal = document.getElementById('mongoDbModal');
    }
    this.refreshModalContent();
    modal.classList.add('active');
  },

  /**
   * Close the MongoDB Atlas details modal
   */
  closeStatusModal() {
    const modal = document.getElementById('mongoDbModal');
    if (modal) modal.classList.remove('active');
  },

  /**
   * Create the MongoDB Atlas status modal DOM
   */
  createStatusModal() {
    const modalHtml = `
      <div id="mongoDbModal" class="modal-overlay">
        <div class="modal" style="max-width: 600px;">
          <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: #e6f9ed; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 700;">MongoDB Atlas Database</h3>
                <span style="font-size: 12px; color: var(--text-muted);">Real-time Cloud Database Integration</span>
              </div>
            </div>
            <button class="modal-close" onclick="AarogyaAPI.closeStatusModal()">&times;</button>
          </div>

          <div class="modal-body" id="mongoDbModalBody" style="padding: 20px;">
            <!-- Rendered dynamically by refreshModalContent -->
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="AarogyaAPI.closeStatusModal()">Close</button>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="AarogyaAPI.triggerSeed()">⚡ Reseed Mock Data</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="AarogyaAPI.triggerRefresh()">🔄 Sync Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  /**
   * Refresh content inside the status modal
   */
  refreshModalContent() {
    const body = document.getElementById('mongoDbModalBody');
    if (!body) return;

    const isConnected = this.state.connected;
    const counts = this.state.counts || {};

    body.innerHTML = `
      <div style="background: ${isConnected ? '#f0fdf4' : '#fffbeb'}; border: 1px solid ${isConnected ? '#bbf7d0' : '#fde68a'}; border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${isConnected ? '#10b981' : '#f59e0b'}; display: inline-block; box-shadow: 0 0 0 3px ${isConnected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'};"></span>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: ${isConnected ? '#166534' : '#92400e'};">
              ${isConnected ? 'Connected to MongoDB Atlas' : 'Backend Server Offline / Local Cache Mode'}
            </div>
            <div style="font-size: 11px; color: ${isConnected ? '#15803d' : '#b45309'}; margin-top: 2px;">
              ${isConnected ? `Ping Latency: ${this.state.latencyMs || 0} ms • Sync Active` : 'Start Python backend with: python server.py'}
            </div>
          </div>
        </div>
        <span class="badge ${isConnected ? 'badge-green' : 'badge-yellow'}">
          ${isConnected ? 'LIVE CLOUD' : 'STANDALONE'}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Cluster Host</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 4px; font-family: monospace;">
            ${this.state.cluster}
          </div>
        </div>
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Database Name</div>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 4px; font-family: monospace;">
            ${this.state.database}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 10px; color: var(--text-primary);">MongoDB Atlas Collections</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.hospitals ?? MOCK_HOSPITALS.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">hospitals</div>
          </div>
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.treatments ?? MOCK_TREATMENTS.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">treatments</div>
          </div>
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.schemes ?? MOCK_SCHEMES.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">schemes</div>
          </div>
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.users ?? 1}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">users</div>
          </div>
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.expenses ?? 4}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">expenses</div>
          </div>
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; text-align: center;">
            <div style="font-size: 18px; font-weight: 700; color: var(--brand-primary);">${counts.activities ?? MOCK_ACTIVITIES.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">activities</div>
          </div>
        </div>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; font-size: 12px; color: var(--text-muted);">
        <strong style="color: var(--text-primary);">💡 Quick Run Command:</strong><br>
        To start or keep your MongoDB backend running, open a terminal in this folder and run:
        <code style="display: block; background: #1e293b; color: #38bdf8; padding: 6px 10px; border-radius: 4px; margin-top: 6px; font-family: monospace;">python server.py</code>
        or double-click <code>start_server.bat</code>.
      </div>
    `;
  },

  async triggerRefresh() {
    showToast('Syncing with MongoDB Atlas...', 'info');
    const ok = await this.syncAllData();
    this.refreshModalContent();
    if (ok) {
      showToast('Successfully synchronized with MongoDB Atlas!', 'success');
    } else {
      showToast('Could not reach backend. Verify server is running on port 8000.', 'error');
    }
  },

  async triggerSeed() {
    showToast('Seeding MongoDB Atlas with healthcare data...', 'info');
    const ok = await this.seedDatabase(true);
    this.refreshModalContent();
    if (ok) {
      showToast('MongoDB Atlas reseeded successfully!', 'success');
    } else {
      showToast('Failed to seed database. Check server connection.', 'error');
    }
  }
};

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Check connection and sync
  AarogyaAPI.syncAllData();
});
