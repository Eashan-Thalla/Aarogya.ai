/* ========================================================================
   Aarogya.ai — Core Application Logic
   Navigation, Sidebar, Header, Chatbot, Toasts, Utilities
   ======================================================================== */

// ── State ─────────────────────────────────────────────────────────────
let currentPage = 'dashboard';
let sidebarOpen = false;
let chatbotOpen = false;
let notificationsOpen = false;
let profileDropdownOpen = false;

// ── SVG Icon Helper ───────────────────────────────────────────────────
const icons = {
  dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  costPrediction: '<svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  hospital: '<svg viewBox="0 0 24 24"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>',
  compare: '<svg viewBox="0 0 24 24"><path d="M16 3h5v5M8 3H3v5"/><path d="M21 3l-8.5 8.5M3 3l8.5 8.5"/><path d="M3 16v5h5M21 21v-5h-5"/><path d="M14.5 13.5 21 21M3 21l6.5-6.5"/></svg>',
  insurance: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
  scheme: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  chatbot: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  analytics: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  profile: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  send: '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  trendUp: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  trendDown: '<svg viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  star: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  directions: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  activity: '<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  printer: '<svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  building: '<svg viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  leaf: '<svg viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  crossMedical: '<svg viewBox="0 0 24 24"><path d="M8 2h8v6h6v8h-6v6H8v-6H2V8h6V2z"/></svg>',
};

// ── Utility Functions ─────────────────────────────────────────────────
function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getIcon(name) {
  return icons[name] || icons.info;
}

// ── Toast Notification System ─────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">${getIcon('close')}</button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Navigation ────────────────────────────────────────────────────────
function navigateTo(page) {
  currentPage = page;

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update page sections
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.toggle('active', section.id === `page-${page}`);
  });

  // Close mobile sidebar
  closeSidebar();
  closeAllDropdowns();

  // Initialize page content if needed
  if (typeof window[`init${capitalize(page)}Page`] === 'function') {
    window[`init${capitalize(page)}Page`]();
  }

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    costPrediction: 'Cost Prediction',
    hospitalFinder: 'Hospital Finder',
    costComparison: 'Cost Comparison',
    insuranceCalculator: 'Insurance Calculator',
    governmentSchemes: 'Government Schemes',
    chatAssistant: 'AI Health Assistant',
    expenseAnalytics: 'Expense Analytics',
    profile: 'My Profile',
    settings: 'Settings',
    admin: 'Admin Dashboard'
  };
  document.title = `${titles[page] || 'Dashboard'} — Aarogya.ai`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Sidebar ───────────────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle('open', sidebarOpen);
  overlay.classList.toggle('active', sidebarOpen);
}

function closeSidebar() {
  sidebarOpen = false;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

// ── Notifications ─────────────────────────────────────────────────────
function toggleNotifications() {
  notificationsOpen = !notificationsOpen;
  profileDropdownOpen = false;
  document.getElementById('notificationsPanel').classList.toggle('active', notificationsOpen);
  document.getElementById('profileDropdown').classList.remove('active');
}

function toggleProfileDropdown() {
  profileDropdownOpen = !profileDropdownOpen;
  notificationsOpen = false;
  document.getElementById('profileDropdown').classList.toggle('active', profileDropdownOpen);
  document.getElementById('notificationsPanel').classList.remove('active');
}

function closeAllDropdowns() {
  notificationsOpen = false;
  profileDropdownOpen = false;
  document.getElementById('notificationsPanel')?.classList.remove('active');
  document.getElementById('profileDropdown')?.classList.remove('active');
}

// ── Chatbot ───────────────────────────────────────────────────────────
function toggleChatbot() {
  chatbotOpen = !chatbotOpen;
  document.getElementById('chatbotPanel').classList.toggle('active', chatbotOpen);
}

function closeChatbot() {
  chatbotOpen = false;
  document.getElementById('chatbotPanel').classList.remove('active');
}

function sendChatMessage(text) {
  if (!text) {
    text = document.getElementById('chatInput').value.trim();
  }
  if (!text) return;

  const messagesContainer = document.getElementById('chatMessages');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = text;
  messagesContainer.appendChild(userMsg);

  // Clear input
  document.getElementById('chatInput').value = '';

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesContainer.appendChild(typing);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Simulate AI response
  setTimeout(() => {
    typing.remove();

    const lowerText = text.toLowerCase();
    let response = CHATBOT_RESPONSES.default;

    if (lowerText.includes('mri') || lowerText.includes('scan') || lowerText.includes('cost')) {
      response = CHATBOT_RESPONSES.mri;
    } else if (lowerText.includes('hospital') || lowerText.includes('find') || lowerText.includes('near')) {
      response = CHATBOT_RESPONSES.hospital;
    } else if (lowerText.includes('scheme') || lowerText.includes('government') || lowerText.includes('ayushman')) {
      response = CHATBOT_RESPONSES.scheme;
    } else if (lowerText.includes('insurance') || lowerText.includes('coverage') || lowerText.includes('pay')) {
      response = CHATBOT_RESPONSES.insurance;
    } else if (lowerText.includes('compare') || lowerText.includes('difference') || lowerText.includes('comparison')) {
      response = CHATBOT_RESPONSES.compare;
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot';
    botMsg.innerHTML = response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1200);
}

function sendSuggestion(text) {
  sendChatMessage(text);
}

// ── Search ────────────────────────────────────────────────────────────
function handleSearch(e) {
  if (e.key === 'Enter') {
    const query = e.target.value.trim().toLowerCase();
    if (!query) return;

    if (query.includes('hospital')) navigateTo('hospitalFinder');
    else if (query.includes('cost') || query.includes('predict')) navigateTo('costPrediction');
    else if (query.includes('insurance')) navigateTo('insuranceCalculator');
    else if (query.includes('scheme')) navigateTo('governmentSchemes');
    else if (query.includes('compare')) navigateTo('costComparison');
    else if (query.includes('analytics') || query.includes('expense')) navigateTo('expenseAnalytics');
    else showToast(`Searching for "${e.target.value}"...`, 'info');
    e.target.value = '';
  }
}

// ── Click outside handler ─────────────────────────────────────────────
document.addEventListener('click', function(e) {
  if (!e.target.closest('.header-btn') && !e.target.closest('.notifications-panel')) {
    document.getElementById('notificationsPanel')?.classList.remove('active');
    notificationsOpen = false;
  }
  if (!e.target.closest('.header-user') && !e.target.closest('.profile-dropdown')) {
    document.getElementById('profileDropdown')?.classList.remove('active');
    profileDropdownOpen = false;
  }
});

// ── Initialize Application ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Set greeting
  const greetEl = document.getElementById('headerGreeting');
  if (greetEl) greetEl.textContent = `Hello, ${MOCK_USER.name}`;

  // Load default page
  navigateTo('dashboard');

  // Chatbot enter key
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
});

// ── Modal Helpers ─────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

// ── Download Helper ───────────────────────────────────────────────────
function downloadReport(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Report "${filename}" downloaded successfully!`);
}
