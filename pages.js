/* ========================================================================
   Aarogya.ai — Page Initializers & Interactive Controllers
   Handles Dashboard, Prediction, Hospitals, Comparison, Insurance,
   Schemes, Full-page Chat, Analytics, Profile, Settings, and Admin.
   ======================================================================== */

// Global chart references so we can destroy/re-render cleanly
const activeCharts = {};

// Canvas fallback drawer in case Chart.js CDN is unavailable
function createOrUpdateChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Check if Chart.js is loaded
  if (typeof Chart !== 'undefined') {
    if (activeCharts[canvasId]) {
      activeCharts[canvasId].destroy();
    }
    const ctx = canvas.getContext('2d');
    activeCharts[canvasId] = new Chart(ctx, config);
    return activeCharts[canvasId];
  } else {
    // Elegant fallback canvas drawing
    drawFallbackChart(canvas, config);
  }
}

function drawFallbackChart(canvas, config) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 600;
  const h = canvas.height = canvas.parentElement.clientHeight || 280;
  ctx.clearRect(0, 0, w, h);

  if (config.type === 'line' || config.type === 'bar') {
    const labels = config.data.labels || [];
    const dataset = config.data.datasets[0] || { data: [] };
    const data = dataset.data || [];
    const maxVal = Math.max(...data, 100);
    const padding = 40;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      const labelVal = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText('₹' + labelVal.toLocaleString('en-IN'), 6, y + 4);
    }

    if (config.type === 'line') {
      // Draw Line
      ctx.strokeStyle = '#84CC16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const points = [];
      data.forEach((val, i) => {
        const x = padding + (chartW / (data.length - 1 || 1)) * i;
        const y = padding + chartH - (val / maxVal) * chartH;
        points.push({ x, y });
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      points.forEach(p => {
        ctx.fillStyle = '#65A30D';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else {
      // Draw Bar
      const barW = (chartW / data.length) * 0.6;
      data.forEach((val, i) => {
        const x = padding + (chartW / data.length) * i + ((chartW / data.length) - barW) / 2;
        const barH = (val / maxVal) * chartH;
        const y = padding + chartH - barH;
        ctx.fillStyle = '#84CC16';
        ctx.fillRect(x, y, barW, barH);
      });
    }

    // X Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((lbl, i) => {
      const x = padding + (chartW / (labels.length - 1 || 1)) * i;
      ctx.fillText(lbl, x, h - 12);
    });
  } else if (config.type === 'doughnut' || config.type === 'pie') {
    const dataset = config.data.datasets[0] || { data: [] };
    const data = dataset.data || [];
    const colors = dataset.backgroundColor || ['#84CC16', '#65A30D', '#a3e635', '#4d7c0f', '#bef264'];
    const total = data.reduce((a, b) => a + b, 0) || 1;
    let startAngle = -Math.PI / 2;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 30;

    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, r * 0.55, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });
  }
}

// ============================================================================
// 1. DASHBOARD PAGE
// ============================================================================
let dashboardChartTimeframe = 'monthly';

function initDashboardPage() {
  renderDashboardChart();
  renderDashboardActivities();
}

function setDashboardChartFilter(type) {
  dashboardChartTimeframe = type;
  document.querySelectorAll('#dashboardChartTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.timeframe === type);
  });
  renderDashboardChart();
}

function renderDashboardChart() {
  const canvas = document.getElementById('dashboardExpenseChart');
  if (!canvas) return;

  const isMonthly = dashboardChartTimeframe === 'monthly';
  const labels = isMonthly
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['2023', '2024', '2025', '2026'];

  const expenseData = isMonthly
    ? [2400, 1800, 3200, 2800, 1500, 4200, 2100, 3800, 2600, 1900, 1200, 2100]
    : [18500, 21400, 23800, 24500];

  const savingsData = isMonthly
    ? [800, 600, 1200, 950, 500, 1400, 750, 1100, 900, 650, 400, 700]
    : [5500, 6800, 7900, 8200];

  const config = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Estimated Expenses (₹)',
          data: expenseData,
          borderColor: '#84CC16',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#65A30D',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Identified Savings (₹)',
          data: savingsData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          borderDash: [4, 4],
          pointBackgroundColor: '#2563eb',
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true, boxWidth: 8 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: (v) => '₹' + v.toLocaleString('en-IN')
          }
        }
      }
    }
  };

  createOrUpdateChart('dashboardExpenseChart', config);
}

function renderDashboardActivities() {
  const container = document.getElementById('dashboardActivityList');
  if (!container) return;

  container.innerHTML = MOCK_ACTIVITIES.map(act => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-content" style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h4>${act.text}</h4>
          <span style="font-size: 11px; color: var(--text-muted);">${act.time}</span>
        </div>
        <p>${act.detail}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// 2. AI COST PREDICTION PAGE
// ============================================================================
let currentPredictionResult = null;

function initCostPredictionPage() {
  // Populate category select if empty
  const catSelect = document.getElementById('predCategory');
  if (catSelect && catSelect.children.length <= 1) {
    catSelect.innerHTML = '<option value="">Select Treatment Category</option>' +
      TREATMENT_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // Populate procedure select based on category
  onPredictionCategoryChange();
}

function onPredictionCategoryChange() {
  const catSelect = document.getElementById('predCategory');
  const procSelect = document.getElementById('predTreatment');
  if (!catSelect || !procSelect) return;

  const selectedCat = catSelect.value;
  const filtered = selectedCat
    ? MOCK_TREATMENTS.filter(t => t.category === selectedCat)
    : MOCK_TREATMENTS;

  procSelect.innerHTML = '<option value="">Select Procedure</option>' +
    filtered.map(t => `<option value="${t.id}">${t.name} (Avg ₹${t.avgCost.toLocaleString('en-IN')})</option>`).join('');
}

function handlePredictionFormSubmit(e) {
  if (e) e.preventDefault();

  const treatmentId = document.getElementById('predTreatment')?.value;
  const hospitalType = document.getElementById('predHospitalType')?.value || 'all';
  const age = parseInt(document.getElementById('predAge')?.value || 25);
  const hasInsurance = document.getElementById('predHasInsurance')?.value === 'yes';
  const coverage = parseFloat(document.getElementById('predCoverage')?.value || 0);

  const treatment = MOCK_TREATMENTS.find(t => t.id == treatmentId) || MOCK_TREATMENTS[0];

  // AI Cost Estimation Heuristics simulation
  let baseAvg = treatment.avgCost;
  let minCost = treatment.minCost;
  let maxCost = treatment.maxCost;

  if (hospitalType === 'government') {
    baseAvg = Math.round(baseAvg * 0.45);
    minCost = Math.round(minCost * 0.4);
    maxCost = Math.round(maxCost * 0.5);
  } else if (hospitalType === 'private') {
    baseAvg = Math.round(baseAvg * 1.35);
    minCost = Math.round(minCost * 1.2);
    maxCost = Math.round(maxCost * 1.4);
  }

  // Age factor
  if (age > 60) {
    baseAvg = Math.round(baseAvg * 1.12);
    maxCost = Math.round(maxCost * 1.15);
  }

  // Breakdown percentages
  const consultation = Math.round(baseAvg * 0.12);
  const diagnostics = Math.round(baseAvg * 0.28);
  const medicines = Math.round(baseAvg * 0.22);
  const hospitalization = Math.round(baseAvg * 0.26);
  const other = baseAvg - (consultation + diagnostics + medicines + hospitalization);

  // Potential savings vs private premium hospital
  const privateBenchmark = Math.round(treatment.maxCost * 1.25);
  const potentialSavings = Math.max(0, privateBenchmark - baseAvg);

  currentPredictionResult = {
    treatmentName: treatment.name,
    category: treatment.category,
    minCost,
    avgCost: baseAvg,
    maxCost,
    consultation,
    diagnostics,
    medicines,
    hospitalization,
    other,
    potentialSavings,
    hospitalType,
    hasInsurance,
    coverage
  };

  // Show loading skeleton simulation briefly
  const resultsCard = document.getElementById('predictionResults');
  if (resultsCard) {
    resultsCard.style.opacity = '0.4';
    resultsCard.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      resultsCard.style.opacity = '1';
      displayPredictionResults(currentPredictionResult);
      showToast('AI Cost Prediction generated successfully!', 'success');
    }, 400);
  }
}

function displayPredictionResults(res) {
  const resContainer = document.getElementById('predictionResults');
  if (!resContainer) return;
  resContainer.classList.remove('hidden');

  document.getElementById('predResTitle').textContent = res.treatmentName;
  document.getElementById('predMinVal').textContent = formatCurrency(res.minCost);
  document.getElementById('predAvgVal').textContent = formatCurrency(res.avgCost);
  document.getElementById('predMaxVal').textContent = formatCurrency(res.maxCost);
  document.getElementById('predSavingsVal').textContent = formatCurrency(res.potentialSavings);

  // Cost breakdown
  const breakdownData = [
    { name: 'Doctor Consultation', amount: res.consultation, pct: Math.round((res.consultation / res.avgCost) * 100) },
    { name: 'Diagnostic Tests & Scans', amount: res.diagnostics, pct: Math.round((res.diagnostics / res.avgCost) * 100) },
    { name: 'Medicines & Consumables', amount: res.medicines, pct: Math.round((res.medicines / res.avgCost) * 100) },
    { name: 'Hospitalization & Room Rent', amount: res.hospitalization, pct: Math.round((res.hospitalization / res.avgCost) * 100) },
    { name: 'Other Administrative Charges', amount: res.other, pct: Math.round((res.other / res.avgCost) * 100) }
  ];

  const breakdownList = document.getElementById('predBreakdownList');
  if (breakdownList) {
    breakdownList.innerHTML = breakdownData.map(item => `
      <div class="cost-breakdown-item">
        <div class="cost-breakdown-head">
          <span>${item.name}</span>
          <span style="font-weight: 700; color: var(--text-primary);">${formatCurrency(item.amount)} (${item.pct}%)</span>
        </div>
        <div class="cost-breakdown-bar">
          <div class="cost-breakdown-fill" style="width: ${Math.min(100, Math.max(5, item.pct))}%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Render doughnut chart for cost breakdown
  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: breakdownData.map(b => b.name),
      datasets: [{
        data: breakdownData.map(b => b.amount),
        backgroundColor: ['#84CC16', '#65A30D', '#a3e635', '#4d7c0f', '#bef264'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      },
      cutout: '65%'
    }
  };
  createOrUpdateChart('predictionBreakdownChart', chartConfig);
}

function downloadCurrentPredictionReport() {
  if (!currentPredictionResult) {
    showToast('Please generate an estimate first!', 'warning');
    return;
  }
  const res = currentPredictionResult;
  const content = `=====================================================
AAROGYA.AI — HEALTHCARE COST ESTIMATION REPORT
Generated on: ${new Date().toLocaleString()}
Patient: ${MOCK_USER.name} (Age: ${MOCK_USER.age}, City: ${MOCK_USER.city})
=====================================================

TREATMENT / PROCEDURE: ${res.treatmentName}
CATEGORY: ${res.category}
FACILITY PREFERENCE: ${res.hospitalType.toUpperCase()}

ESTIMATED EXPENSE RANGE:
- Minimum Estimated Cost: ${formatCurrency(res.minCost)}
- Average Benchmark Cost: ${formatCurrency(res.avgCost)}
- Maximum Estimated Cost: ${formatCurrency(res.maxCost)}

ESTIMATED COST BREAKDOWN:
- Consultation Fees: ${formatCurrency(res.consultation)}
- Diagnostic Charges: ${formatCurrency(res.diagnostics)}
- Medicines & Pharmacy: ${formatCurrency(res.medicines)}
- Hospitalization / OT: ${formatCurrency(res.hospitalization)}
- Other Incidental Costs: ${formatCurrency(res.other)}

IDENTIFIED POTENTIAL SAVINGS:
- ${formatCurrency(res.potentialSavings)} (vs Premium Private Tier)

DISCLAIMER:
This report contains machine-generated statistical approximations
for personal financial planning purposes only. It does not constitute
an official hospital billing quotation or medical advice.
=====================================================`;

  downloadReport(`Aarogya_${res.treatmentName.replace(/\s+/g, '_')}_Estimate.txt`, content);
}

// ============================================================================
// 3. HOSPITAL FINDER PAGE
// ============================================================================
let hospitalFilterState = {
  search: '',
  city: 'Hyderabad',
  type: 'all',
  service: 'all',
  maxBudget: 20000,
  minRating: 0,
  sortBy: 'cost_asc'
};

function initHospitalFinderPage() {
  renderHospitalMap();
  applyHospitalFilters();
}

function handleHospitalBudgetInput(val) {
  hospitalFilterState.maxBudget = parseInt(val);
  const pill = document.getElementById('budgetSliderVal');
  if (pill) pill.textContent = '₹' + parseInt(val).toLocaleString('en-IN');
  applyHospitalFilters();
}

function applyHospitalFilters() {
  const searchInput = document.getElementById('hospitalSearchInput')?.value.toLowerCase().trim() || '';
  const typeSelect = document.getElementById('hospitalTypeFilter')?.value || 'all';
  const sortSelect = document.getElementById('hospitalSortFilter')?.value || 'cost_asc';

  hospitalFilterState.search = searchInput;
  hospitalFilterState.type = typeSelect;
  hospitalFilterState.sortBy = sortSelect;

  let filtered = MOCK_HOSPITALS.filter(h => {
    const matchesSearch = !hospitalFilterState.search ||
      h.name.toLowerCase().includes(hospitalFilterState.search) ||
      h.location.toLowerCase().includes(hospitalFilterState.search) ||
      h.services.some(s => s.toLowerCase().includes(hospitalFilterState.search));

    const matchesType = hospitalFilterState.type === 'all' ||
      h.type.toLowerCase() === hospitalFilterState.type.toLowerCase();

    const matchesBudget = h.estimatedCost <= hospitalFilterState.maxBudget;
    const matchesRating = h.rating >= hospitalFilterState.minRating;

    return matchesSearch && matchesType && matchesBudget && matchesRating;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (hospitalFilterState.sortBy === 'cost_asc') return a.estimatedCost - b.estimatedCost;
    if (hospitalFilterState.sortBy === 'distance_asc') return a.distance - b.distance;
    if (hospitalFilterState.sortBy === 'rating_desc') return b.rating - a.rating;
    if (hospitalFilterState.sortBy === 'match') {
      // composite score: rating * 1000 - cost
      return (b.rating * 2000 - b.estimatedCost) - (a.rating * 2000 - a.estimatedCost);
    }
    return 0;
  });

  renderHospitalCards(filtered);
  updateHospitalMapPins(filtered);
}

function renderHospitalCards(hospitals) {
  const container = document.getElementById('hospitalGridContainer');
  if (!container) return;

  const countBadge = document.getElementById('hospitalResultCount');
  if (countBadge) countBadge.textContent = `${hospitals.length} facilities found`;

  if (hospitals.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <h3>No hospitals match your filter criteria</h3>
        <p>Try adjusting your search query, increasing budget limit, or removing filters.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetHospitalFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = hospitals.map(h => `
    <div class="hospital-card" data-hospital-id="${h.id}">
      <div class="hospital-card-img" style="background: linear-gradient(135deg, ${h.type === 'Government' ? '#ecfccb, #d9f99d' : '#f1f5f9, #e2e8f0'});">
        <svg viewBox="0 0 24 24"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
        <div class="hospital-card-badge">
          ${h.affordable ? '<span class="affordable-badge">Most Affordable</span>' : `<span class="badge ${h.type === 'Government' ? 'badge-blue' : 'badge-gray'}">${h.type}</span>`}
        </div>
      </div>
      <div class="hospital-card-body">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
          <h3>${h.name}</h3>
          <span class="badge badge-green" style="flex-shrink: 0;">★ ${h.rating}</span>
        </div>
        <div class="hospital-card-meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${h.location}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${h.distance} km away</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${h.doctors} Doctors • ${h.beds} Beds</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
          ${h.services.slice(0, 3).map(s => `<span class="badge badge-gray" style="font-size: 11px;">${s}</span>`).join('')}
          ${h.services.length > 3 ? `<span class="badge badge-gray" style="font-size: 11px;">+${h.services.length - 3}</span>` : ''}
        </div>
        <div class="hospital-card-price">
          ${formatCurrency(h.estimatedCost)} <small>avg procedure</small>
        </div>
        <div class="hospital-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="showHospitalDetails(${h.id})">View Details</button>
          <button class="btn btn-outline btn-sm" onclick="getHospitalDirections('${h.name}', '${h.location}')">Get Directions</button>
        </div>
      </div>
    </div>
  `).join('');
}

function resetHospitalFilters() {
  document.getElementById('hospitalSearchInput').value = '';
  document.getElementById('hospitalTypeFilter').value = 'all';
  document.getElementById('hospitalSortFilter').value = 'cost_asc';
  document.getElementById('hospitalBudgetSlider').value = 20000;
  hospitalFilterState.maxBudget = 20000;
  document.getElementById('budgetSliderVal').textContent = '₹20,000';
  applyHospitalFilters();
}

function showHospitalDetails(id) {
  const h = MOCK_HOSPITALS.find(x => x.id === id);
  if (!h) return;

  const modalBody = document.getElementById('hospitalModalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
        <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--green-100); display: flex; align-items: center; justify-content: center; color: var(--green-700);">
          <svg style="width: 28px; height: 28px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
        </div>
        <div>
          <h2 style="font-size: 18px; font-weight: 700;">${h.name}</h2>
          <span class="badge ${h.type === 'Government' ? 'badge-blue' : 'badge-green'}">${h.type} Healthcare Facility</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
        <div class="card" style="padding: 12px; background: var(--bg-main);">
          <span style="font-size: 11px; color: var(--text-muted);">Patient Rating</span>
          <h4 style="font-size: 16px; color: var(--green-700);">★ ${h.rating} / 5.0 (${h.reviews.toLocaleString()} reviews)</h4>
        </div>
        <div class="card" style="padding: 12px; background: var(--bg-main);">
          <span style="font-size: 11px; color: var(--text-muted);">Distance from You</span>
          <h4 style="font-size: 16px;">${h.distance} km</h4>
        </div>
        <div class="card" style="padding: 12px; background: var(--bg-main);">
          <span style="font-size: 11px; color: var(--text-muted);">Bed Capacity</span>
          <h4 style="font-size: 16px;">${h.beds} Hospital Beds</h4>
        </div>
        <div class="card" style="padding: 12px; background: var(--bg-main);">
          <span style="font-size: 11px; color: var(--text-muted);">Doctor Count</span>
          <h4 style="font-size: 16px;">${h.doctors} Empanelled Doctors</h4>
        </div>
      </div>
      <h4 style="font-size: 14px; margin-bottom: 8px;">Available Medical Services & Specialties</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
        ${h.services.map(s => `<span class="badge badge-green">${s}</span>`).join('')}
      </div>
      <div style="background: var(--green-50); border: 1px solid var(--green-200); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 12px; color: var(--green-800); font-weight: 600;">Average General Procedure Estimate</span>
            <h3 style="font-size: 22px; color: var(--green-700); font-weight: 800;">${formatCurrency(h.estimatedCost)}</h3>
          </div>
          ${h.affordable ? '<span class="badge badge-green">High Affordability Tier</span>' : '<span class="badge badge-gray">Standard Private Tier</span>'}
        </div>
      </div>
      <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
        <p><strong>Address:</strong> ${h.location}</p>
        <p><strong>Helpline:</strong> ${h.phone}</p>
        <p><strong>Emergency:</strong> 24/7 Trauma & Emergency Unit Available</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" style="flex: 1;" onclick="getHospitalDirections('${h.name}', '${h.location}')">Get Route Directions</button>
        <button class="btn btn-secondary" onclick="closeModal('hospitalDetailsModal')">Close</button>
      </div>
    `;
    openModal('hospitalDetailsModal');
  }
}

function getHospitalDirections(name, location) {
  showToast(`Opening route navigation for ${name} (${location})`, 'info');
}

// Canvas-based interactive stylized map of Hyderabad
function renderHospitalMap() {
  const canvas = document.getElementById('hyderabadHospitalMap');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 800;
  const h = canvas.height = canvas.parentElement.clientHeight || 280;

  // Background map texture (grid & stylized roads)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // Draw grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw stylized rivers/roads (Hussain Sagar lake & Outer Ring Road)
  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.ellipse(w * 0.52, h * 0.48, 48, 32, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.2);
  ctx.bezierCurveTo(w * 0.35, h * 0.4, w * 0.65, h * 0.35, w * 0.9, h * 0.7);
  ctx.stroke();

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.5, h * 0.38, 0, Math.PI * 2);
  ctx.stroke();

  // Draw hospital pins
  updateHospitalMapPins(MOCK_HOSPITALS);
}

function updateHospitalMapPins(hospitals) {
  const canvas = document.getElementById('hyderabadHospitalMap');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Pre-mapped normalized coordinates for Hyderabad hospitals
  const coords = [
    { x: 0.48, y: 0.35 }, // Gandhi
    { x: 0.53, y: 0.65 }, // Osmania
    { x: 0.42, y: 0.48 }, // NIMS
    { x: 0.32, y: 0.42 }, // Apollo
    { x: 0.58, y: 0.30 }, // KIMS
    { x: 0.44, y: 0.44 }, // Yashoda
    { x: 0.36, y: 0.52 }, // Care
    { x: 0.25, y: 0.25 }  // Area Hosp Kukatpally
  ];

  hospitals.forEach((hosp, idx) => {
    const c = coords[(hosp.id - 1) % coords.length];
    const px = w * c.x;
    const py = h * c.y;

    // Pin circle
    ctx.fillStyle = hosp.affordable ? '#84CC16' : '#2563eb';
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pulse ring
    ctx.strokeStyle = hosp.affordable ? 'rgba(132, 204, 22, 0.4)' : 'rgba(37, 99, 235, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText(hosp.name.split(' ')[0], px + 12, py + 3);
  });
}

// ============================================================================
// 4. COST COMPARISON PAGE
// ============================================================================
function initCostComparisonPage() {
  populateComparisonTreatments();
  updateComparisonData();
}

function populateComparisonTreatments() {
  const select = document.getElementById('compareTreatmentSelect');
  if (!select) return;
  if (select.children.length <= 1) {
    select.innerHTML = MOCK_TREATMENTS.map(t =>
      `<option value="${t.id}" ${t.name.includes('MRI') ? 'selected' : ''}>${t.name}</option>`
    ).join('');
  }
}

function updateComparisonData() {
  const treatmentId = document.getElementById('compareTreatmentSelect')?.value || 1;
  const treatment = MOCK_TREATMENTS.find(t => t.id == treatmentId) || MOCK_TREATMENTS[0];

  // Calculate scaled prices per hospital based on baseline
  const comparisonItems = MOCK_HOSPITALS.map(h => {
    let multiplier = 1.0;
    if (h.type === 'Government') {
      multiplier = h.name.includes('Gandhi') ? 0.6 : 0.55;
    } else {
      if (h.name.includes('Apollo')) multiplier = 1.6;
      else if (h.name.includes('Care')) multiplier = 1.45;
      else if (h.name.includes('KIMS')) multiplier = 1.35;
      else multiplier = 1.25;
    }
    const cost = Math.round(treatment.avgCost * multiplier);
    return {
      ...h,
      cost
    };
  });

  comparisonItems.sort((a, b) => a.cost - b.cost);
  const cheapest = comparisonItems[0];
  const expensive = comparisonItems[comparisonItems.length - 1];
  const savings = expensive.cost - cheapest.cost;

  // Update Savings Callout
  document.getElementById('compareSavingsAmount').textContent = formatCurrency(savings);
  document.getElementById('compareCheapestName').textContent = cheapest.name;
  document.getElementById('compareCheapestCost').textContent = formatCurrency(cheapest.cost);
  document.getElementById('compareExpensiveName').textContent = expensive.name;
  document.getElementById('compareExpensiveCost').textContent = formatCurrency(expensive.cost);

  // Render Table
  const tbody = document.getElementById('comparisonTableBody');
  if (tbody) {
    tbody.innerHTML = comparisonItems.map((item, idx) => {
      const isCheapest = idx === 0;
      const isExpensive = idx === comparisonItems.length - 1;
      const rowClass = isCheapest ? 'lowest-cost' : (isExpensive ? 'highest-cost' : '');

      return `
        <tr class="${rowClass}">
          <td>
            <strong>${item.name}</strong>
            ${isCheapest ? '<span class="badge badge-green" style="margin-left: 8px;">Cheapest Option</span>' : ''}
            ${isExpensive ? '<span class="badge badge-red" style="margin-left: 8px;">Highest Tier</span>' : ''}
          </td>
          <td><span class="badge ${item.type === 'Government' ? 'badge-blue' : 'badge-gray'}">${item.type}</span></td>
          <td style="font-weight: 700; color: ${isCheapest ? 'var(--green-700)' : 'var(--text-primary)'};">
            ${formatCurrency(item.cost)}
          </td>
          <td>${item.distance} km</td>
          <td>★ ${item.rating}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="showHospitalDetails(${item.id})">Details</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Cost Comparison Bar Chart
  const chartConfig = {
    type: 'bar',
    data: {
      labels: comparisonItems.map(h => h.name.replace(' Hospital', '').replace(' Hospitals', '')),
      datasets: [{
        label: `Estimated Cost for ${treatment.name} (₹)`,
        data: comparisonItems.map(h => h.cost),
        backgroundColor: comparisonItems.map((h, i) =>
          i === 0 ? '#84CC16' : (i === comparisonItems.length - 1 ? '#ef4444' : '#a3e635')
        ),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Cost: ₹${ctx.parsed.y.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          ticks: { callback: (v) => '₹' + v.toLocaleString('en-IN') },
          grid: { color: '#f1f5f9' }
        }
      }
    }
  };

  createOrUpdateChart('costComparisonBarChart', chartConfig);
}

// ============================================================================
// 5. INSURANCE CALCULATOR PAGE
// ============================================================================
function initInsuranceCalculatorPage() {
  calculateInsuranceCoverage();
}

function calculateInsuranceCoverage() {
  const treatmentCost = parseFloat(document.getElementById('insTreatmentCost')?.value || 50000);
  const coverageLimit = parseFloat(document.getElementById('insCoverageAmount')?.value || 35000);
  const deductible = parseFloat(document.getElementById('insDeductible')?.value || 5000);
  const copayPct = parseFloat(document.getElementById('insCopay')?.value || 10);
  const govtAssistance = parseFloat(document.getElementById('insGovtAssistance')?.value || 0);

  // Formula as required:
  // Patient Out-of-Pocket = Total Treatment Cost - Insurance Coverage - Government Assistance
  // Considering real-world deductible & co-payment:
  // Eligible insured amount = Math.min(treatmentCost - deductible, coverageLimit)
  // Co-payment paid by patient = eligible * (copayPct / 100)
  // Actual insurer payout = eligible - co-payment
  const eligibleAmount = Math.max(0, Math.min(treatmentCost - deductible, coverageLimit));
  const copayAmount = Math.round(eligibleAmount * (copayPct / 100));
  const insurerPayout = Math.max(0, eligibleAmount - copayAmount);

  const totalAssistance = insurerPayout + govtAssistance;
  const outOfPocket = Math.max(0, Math.round(treatmentCost - totalAssistance));
  const totalSavings = treatmentCost - outOfPocket;

  // Update cards
  document.getElementById('insResTotal').textContent = formatCurrency(treatmentCost);
  document.getElementById('insResCovered').textContent = formatCurrency(totalAssistance);
  document.getElementById('insResOutOfPocket').textContent = formatCurrency(outOfPocket);
  document.getElementById('insResSavings').textContent = formatCurrency(totalSavings);

  // Breakdown details
  document.getElementById('insBreakdownDeductible').textContent = formatCurrency(deductible);
  document.getElementById('insBreakdownCopay').textContent = formatCurrency(copayAmount);
  document.getElementById('insBreakdownInsurerPayout').textContent = formatCurrency(insurerPayout);
  document.getElementById('insBreakdownGovt').textContent = formatCurrency(govtAssistance);

  // Render doughnut comparison: Patient vs Insurer
  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Estimated Patient Out-of-Pocket', 'Insurance & Govt Coverage'],
      datasets: [{
        data: [outOfPocket, totalAssistance],
        backgroundColor: ['#f59e0b', '#84CC16'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      },
      cutout: '70%'
    }
  };

  createOrUpdateChart('insuranceBreakdownChart', chartConfig);
}

// ============================================================================
// 6. GOVERNMENT SCHEMES PAGE
// ============================================================================
let userSchemeEligibility = {
  age: 22,
  state: 'Telangana',
  income: 180000,
  familySize: 4
};

function initGovernmentSchemesPage() {
  renderSchemeCards();
}

function handleSchemeEligibilitySubmit(e) {
  if (e) e.preventDefault();

  userSchemeEligibility.age = parseInt(document.getElementById('schemeAge')?.value || 22);
  userSchemeEligibility.state = document.getElementById('schemeState')?.value || 'Telangana';
  userSchemeEligibility.income = parseFloat(document.getElementById('schemeIncome')?.value || 180000);
  userSchemeEligibility.familySize = parseInt(document.getElementById('schemeFamilySize')?.value || 4);

  renderSchemeCards();
  showToast('Eligibility criteria applied to government healthcare schemes!', 'success');
}

function renderSchemeCards() {
  const container = document.getElementById('schemeGridContainer');
  if (!container) return;

  const { income, state, age } = userSchemeEligibility;

  container.innerHTML = MOCK_SCHEMES.map(scheme => {
    // Dynamic frontend eligibility heuristic
    let statusBadge = '';
    if (scheme.shortName === 'PMJAY') {
      if (income <= 300000) {
        statusBadge = '<span class="badge badge-green">Potentially Eligible (Income &lt; ₹3L)</span>';
      } else {
        statusBadge = '<span class="badge badge-orange">Eligibility Requires Verification</span>';
      }
    } else if (scheme.shortName === 'Aarogyasri') {
      if (state === 'Telangana' && income <= 200000) {
        statusBadge = '<span class="badge badge-green">Potentially Eligible (Telangana Resident)</span>';
      } else {
        statusBadge = '<span class="badge badge-orange">Requires State Verification</span>';
      }
    } else if (scheme.shortName === 'CGHS') {
      statusBadge = '<span class="badge badge-orange">Eligibility Requires Verification (Govt Service)</span>';
    } else if (scheme.shortName === 'ESI') {
      if (income <= 252000) {
        statusBadge = '<span class="badge badge-green">Potentially Eligible (Wage &lt; ₹21k/mo)</span>';
      } else {
        statusBadge = '<span class="badge badge-gray">Not Enough Information</span>';
      }
    } else if (scheme.shortName === 'PMSBY') {
      if (age >= 18 && age <= 70) {
        statusBadge = '<span class="badge badge-green">Potentially Eligible (Age 18-70)</span>';
      } else {
        statusBadge = '<span class="badge badge-red">Age Ineligible</span>';
      }
    }

    return `
      <div class="scheme-card">
        <div class="scheme-card-header">
          <div class="scheme-icon">${scheme.icon}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <h3>${scheme.name}</h3>
              ${statusBadge}
            </div>
            <p>${scheme.category} • Coverage: ${scheme.coverage}</p>
          </div>
        </div>
        <div class="scheme-card-body">
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
            ${scheme.description}
          </p>
          <div class="scheme-detail">
            <strong>Key Benefits:</strong>
            <span>${scheme.benefits}</span>
          </div>
          <div class="scheme-detail">
            <strong>Eligibility:</strong>
            <span>${scheme.eligibility}</span>
          </div>
          <div class="scheme-detail">
            <strong>Required Docs:</strong>
            <span>${scheme.documents.join(', ')}</span>
          </div>
        </div>
        <div class="scheme-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="showSchemeModal(${scheme.id})">Detailed Guide</button>
          <a href="${scheme.applicationLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Official Portal <svg style="width: 14px; height: 14px; margin-left: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function showSchemeModal(id) {
  const scheme = MOCK_SCHEMES.find(s => s.id === id);
  if (!scheme) return;

  const modalBody = document.getElementById('schemeModalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 36px;">${scheme.icon}</span>
        <div>
          <h2 style="font-size: 18px; font-weight: 700;">${scheme.name}</h2>
          <span class="badge badge-green">${scheme.coverage}</span>
        </div>
      </div>
      <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
        ${scheme.description}
      </p>
      <h4 style="font-size: 14px; margin-bottom: 6px;">Application Procedure:</h4>
      <p style="font-size: 13px; color: var(--text-primary); background: var(--bg-main); padding: 12px; border-radius: var(--radius-md); line-height: 1.5; margin-bottom: 16px;">
        ${scheme.applicationProcess}
      </p>
      <h4 style="font-size: 14px; margin-bottom: 6px;">Checklist of Required Documents:</h4>
      <ul style="list-style: disc; padding-left: 20px; font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
        ${scheme.documents.map(d => `<li>${d}</li>`).join('')}
      </ul>
      <div style="display: flex; gap: 10px;">
        <a href="${scheme.applicationLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          Visit Official Portal
        </a>
        <button class="btn btn-secondary" onclick="closeModal('schemeDetailsModal')">Close</button>
      </div>
    `;
    openModal('schemeDetailsModal');
  }
}

// ============================================================================
// 7. FULL-PAGE AI HEALTH ASSISTANT
// ============================================================================
function initChatAssistantPage() {
  const fullPageInput = document.getElementById('fullPageChatInput');
  if (fullPageInput) {
    fullPageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendFullPageChatMessage();
    });
  }
}

function sendFullPageChatMessage(customText) {
  const inputEl = document.getElementById('fullPageChatInput');
  const text = customText || inputEl?.value.trim();
  if (!text) return;

  const messagesContainer = document.getElementById('fullPageChatMessages');
  if (!messagesContainer) return;

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = text;
  messagesContainer.appendChild(userMsg);

  if (inputEl) inputEl.value = '';

  // Typing animation
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Bot response logic
  setTimeout(() => {
    typing.remove();
    const lower = text.toLowerCase();
    let reply = CHATBOT_RESPONSES.default;
    if (lower.includes('mri') || lower.includes('scan') || lower.includes('cost')) reply = CHATBOT_RESPONSES.mri;
    else if (lower.includes('hospital') || lower.includes('find') || lower.includes('near')) reply = CHATBOT_RESPONSES.hospital;
    else if (lower.includes('scheme') || lower.includes('ayushman') || lower.includes('aarogyasri')) reply = CHATBOT_RESPONSES.scheme;
    else if (lower.includes('insurance') || lower.includes('coverage') || lower.includes('pay')) reply = CHATBOT_RESPONSES.insurance;
    else if (lower.includes('compare')) reply = CHATBOT_RESPONSES.compare;

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot';
    botMsg.innerHTML = reply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);
}

// ============================================================================
// 8. EXPENSE ANALYTICS PAGE
// ============================================================================
let analyticsTimeframe = 'monthly';

function initExpenseAnalyticsPage() {
  renderAnalyticsCharts();
}

function setAnalyticsTimeframe(timeframe) {
  analyticsTimeframe = timeframe;
  document.querySelectorAll('#analyticsFilterTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
  });
  renderAnalyticsCharts();
}

function renderAnalyticsCharts() {
  // Chart 1: Monthly Trend
  const monthlyConfig = {
    type: 'line',
    data: {
      labels: MOCK_EXPENSES.monthly.map(m => m.month),
      datasets: [
        {
          label: 'Total Expenses (₹)',
          data: MOCK_EXPENSES.monthly.map(m => m.amount),
          borderColor: '#84CC16',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Insurance Covered (₹)',
          data: MOCK_EXPENSES.monthly.map(m => m.insurance),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}` }
        }
      },
      scales: {
        y: { ticks: { callback: (v) => '₹' + v.toLocaleString('en-IN') } }
      }
    }
  };
  createOrUpdateChart('analyticsTrendChart', monthlyConfig);

  // Chart 2: Category Donut
  const categoryConfig = {
    type: 'doughnut',
    data: {
      labels: MOCK_EXPENSES.categories.map(c => c.name),
      datasets: [{
        data: MOCK_EXPENSES.categories.map(c => c.amount),
        backgroundColor: MOCK_EXPENSES.categories.map(c => c.color)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10 } },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')}` }
        }
      },
      cutout: '65%'
    }
  };
  createOrUpdateChart('analyticsCategoryChart', categoryConfig);

  // Chart 3: Hospital Cost Ratio (Govt vs Private)
  const ratioConfig = {
    type: 'bar',
    data: {
      labels: ['General Consultation', 'Blood Diagnostics', 'MRI Scan', 'Cataract Surgery', 'Knee Replacement'],
      datasets: [
        {
          label: 'Government Facilities (₹)',
          data: [250, 400, 3200, 15000, 140000],
          backgroundColor: '#84CC16',
          borderRadius: 4
        },
        {
          label: 'Private Hospitals (₹)',
          data: [1200, 1500, 10500, 45000, 320000],
          backgroundColor: '#94a3b8',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}` }
        }
      },
      scales: {
        y: { ticks: { callback: (v) => '₹' + v.toLocaleString('en-IN') } }
      }
    }
  };
  createOrUpdateChart('analyticsComparisonChart', ratioConfig);
}

function exportAnalyticsCSV() {
  let csv = 'Month,Total Expense,Insurance Covered,Patient Out-of-Pocket\n';
  MOCK_EXPENSES.monthly.forEach(m => {
    csv += `${m.month},${m.amount},${m.insurance},${m.outOfPocket}\n`;
  });
  downloadReport('Aarogya_Healthcare_Expenses.csv', csv);
}

// ============================================================================
// 9. PROFILE PAGE
// ============================================================================
function initProfilePage() {
  document.getElementById('profName').value = MOCK_USER.name;
  document.getElementById('profEmail').value = MOCK_USER.email;
  document.getElementById('profAge').value = MOCK_USER.age;
  document.getElementById('profGender').value = MOCK_USER.gender;
  document.getElementById('profCity').value = MOCK_USER.city;
  document.getElementById('profState').value = MOCK_USER.state;
  document.getElementById('profPhone').value = MOCK_USER.phone;
  document.getElementById('profBlood').value = MOCK_USER.bloodGroup;

  document.getElementById('profInsProvider').value = MOCK_USER.insurance.provider;
  document.getElementById('profInsPolicy').value = MOCK_USER.insurance.policyName;
  document.getElementById('profInsCoverage').value = MOCK_USER.insurance.coverageAmount;
  document.getElementById('profInsDeductible').value = MOCK_USER.insurance.deductible;
  document.getElementById('profInsCopay').value = MOCK_USER.insurance.coPayment;
}

function saveUserProfile(e) {
  if (e) e.preventDefault();
  MOCK_USER.name = document.getElementById('profName').value;
  MOCK_USER.email = document.getElementById('profEmail').value;
  MOCK_USER.age = parseInt(document.getElementById('profAge').value);
  MOCK_USER.city = document.getElementById('profCity').value;

  // Update header display
  const greetEl = document.getElementById('headerGreeting');
  if (greetEl) greetEl.textContent = `Hello, ${MOCK_USER.name}`;

  showToast('Profile and preferences updated successfully!', 'success');
}

// ============================================================================
// 10. SETTINGS PAGE
// ============================================================================
function initSettingsPage() {
  // Settings initialized
}

function saveSettings(e) {
  if (e) e.preventDefault();
  showToast('Platform settings saved.', 'success');
}

function resetPlatformDemoData() {
  if (confirm('Are you sure you want to reset all mock data to defaults?')) {
    localStorage.clear();
    showToast('Platform demo state reset to defaults.', 'info');
    setTimeout(() => location.reload(), 600);
  }
}

// ============================================================================
// 11. ADMIN DASHBOARD PAGE
// ============================================================================
function initAdminPage() {
  renderAdminUsersTable();
  renderAdminHospitalsTable();
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_ADMIN_USERS.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td>${u.city}</td>
      <td>${u.joined}</td>
      <td>${u.predictions}</td>
      <td><span class="badge ${u.status === 'Active' ? 'badge-green' : 'badge-gray'}">${u.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing user ${u.name}', 'info')">View</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminHospitalsTable() {
  const tbody = document.getElementById('adminHospitalsTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_HOSPITALS.map(h => `
    <tr>
      <td><strong>${h.name}</strong></td>
      <td><span class="badge ${h.type === 'Government' ? 'badge-blue' : 'badge-gray'}">${h.type}</span></td>
      <td>${h.location}</td>
      <td>${formatCurrency(h.estimatedCost)}</td>
      <td>★ ${h.rating}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showHospitalDetails(${h.id})">Edit</button>
      </td>
    </tr>
  `).join('');
}

function handleDatasetFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  showToast(`Ingesting dataset "${file.name}" into ML pipeline...`, 'info');
  setTimeout(() => {
    showToast(`Dataset "${file.name}" ingested. 1,420 treatment costs updated!`, 'success');
  }, 1200);
}
