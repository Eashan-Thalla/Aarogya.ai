/* ========================================================================
   Aarogya.ai — Mock Data
   All data is for demonstration purposes only.
   ======================================================================== */

const MOCK_USER = {
  name: 'Eashan',
  email: 'eashan@example.com',
  age: 22,
  gender: 'Male',
  city: 'Hyderabad',
  state: 'Telangana',
  avatar: 'E',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  insurance: {
    provider: 'Star Health Insurance',
    policyName: 'Star Comprehensive',
    coverageAmount: 500000,
    deductible: 5000,
    coPayment: 10
  }
};

const MAP_API_CONFIG = {
  geoapifyKey: localStorage.getItem('aarogya_geoapify_key') || '6d87e02422f2487295844bb55c4ac443',
  mapboxToken: localStorage.getItem('aarogya_mapbox_token') || '',
  activeProvider: localStorage.getItem('aarogya_map_provider') || 'geoapify',
  activeStyle: localStorage.getItem('aarogya_map_style') || 'osm-bright-smooth'
};

const LOCATION_PRESETS = {
  begumpet: {
    lat: 17.4125,
    lng: 78.4682,
    name: 'Begumpet, Hyderabad (Center)'
  },
  jubilee_hills: {
    lat: 17.4325,
    lng: 78.4072,
    name: 'Jubilee Hills, Hyderabad (West)'
  },
  hitec_city: {
    lat: 17.4474,
    lng: 78.3762,
    name: 'Hitec City / Madhapur (Tech Hub)'
  },
  secunderabad: {
    lat: 17.4399,
    lng: 78.5015,
    name: 'Secunderabad Junction (North-East)'
  },
  charminar: {
    lat: 17.3616,
    lng: 78.4747,
    name: 'Charminar / Old City (South)'
  },
  kukatpally: {
    lat: 17.4947,
    lng: 78.3996,
    name: 'Kukatpally Housing Board (North-West)'
  }
};

let ACTIVE_USER_LOCATION = { ...LOCATION_PRESETS.begumpet };
const MOCK_USER_LOCATION = ACTIVE_USER_LOCATION;

const MOCK_HOSPITALS = [
  {
    id: 1,
    name: 'Gandhi Hospital',
    type: 'Government',
    location: 'Musheerabad, Hyderabad',
    lat: 17.4243,
    lng: 78.5033,
    distance: 3.2,
    rating: 4.1,
    reviews: 2850,
    services: ['General Medicine', 'Surgery', 'Diagnostics', 'Emergency', 'Cardiology'],
    estimatedCost: 3500,
    phone: '+91 40 2345 6789',
    image: null,
    affordable: true,
    beds: 1200,
    doctors: 450
  },
  {
    id: 2,
    name: 'Osmania General Hospital',
    type: 'Government',
    location: 'Afzalgunj, Hyderabad',
    lat: 17.3776,
    lng: 78.4776,
    distance: 5.1,
    rating: 4.0,
    reviews: 3200,
    services: ['General Medicine', 'Orthopedics', 'ENT', 'Pediatrics', 'Surgery'],
    estimatedCost: 2800,
    phone: '+91 40 2456 7890',
    image: null,
    affordable: true,
    beds: 1000,
    doctors: 380
  },
  {
    id: 3,
    name: 'NIMS Hospital',
    type: 'Government',
    location: 'Punjagutta, Hyderabad',
    lat: 17.4222,
    lng: 78.4528,
    distance: 4.5,
    rating: 4.3,
    reviews: 4100,
    services: ['Cardiology', 'Neurology', 'Oncology', 'Radiology', 'Emergency'],
    estimatedCost: 4200,
    phone: '+91 40 2345 8901',
    image: null,
    affordable: false,
    beds: 1500,
    doctors: 600
  },
  {
    id: 4,
    name: 'Apollo Hospitals',
    type: 'Private',
    location: 'Jubilee Hills, Hyderabad',
    lat: 17.4259,
    lng: 78.4111,
    distance: 7.8,
    rating: 4.7,
    reviews: 5600,
    services: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Robotics Surgery'],
    estimatedCost: 15000,
    phone: '+91 40 2345 1234',
    image: null,
    affordable: false,
    beds: 2000,
    doctors: 800
  },
  {
    id: 5,
    name: 'KIMS Hospitals',
    type: 'Private',
    location: 'Secunderabad, Hyderabad',
    lat: 17.4399,
    lng: 78.4983,
    distance: 6.2,
    rating: 4.5,
    reviews: 3900,
    services: ['General Surgery', 'Cardiology', 'Gastroenterology', 'Pulmonology', 'Nephrology'],
    estimatedCost: 12000,
    phone: '+91 40 4488 5566',
    image: null,
    affordable: false,
    beds: 1000,
    doctors: 350
  },
  {
    id: 6,
    name: 'Yashoda Hospitals',
    type: 'Private',
    location: 'Somajiguda, Hyderabad',
    lat: 17.4249,
    lng: 78.4583,
    distance: 5.5,
    rating: 4.4,
    reviews: 4200,
    services: ['Cardiology', 'Neurosurgery', 'Orthopedics', 'Urology', 'Diagnostics'],
    estimatedCost: 11000,
    phone: '+91 40 4567 8901',
    image: null,
    affordable: false,
    beds: 850,
    doctors: 300
  },
  {
    id: 7,
    name: 'Care Hospitals',
    type: 'Private',
    location: 'Banjara Hills, Hyderabad',
    lat: 17.4156,
    lng: 78.4487,
    distance: 8.1,
    rating: 4.6,
    reviews: 3100,
    services: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Organ Transplant', 'Emergency'],
    estimatedCost: 13500,
    phone: '+91 40 3044 5566',
    image: null,
    affordable: false,
    beds: 750,
    doctors: 280
  },
  {
    id: 8,
    name: 'Area Hospital Kukatpally',
    type: 'Government',
    location: 'Kukatpally, Hyderabad',
    lat: 17.4849,
    lng: 78.4011,
    distance: 2.5,
    rating: 3.8,
    reviews: 1800,
    services: ['General Medicine', 'Pediatrics', 'Gynecology', 'Diagnostics', 'Pharmacy'],
    estimatedCost: 1500,
    phone: '+91 40 2345 0000',
    image: null,
    affordable: true,
    beds: 200,
    doctors: 80
  }
];

const MOCK_TREATMENTS = [
  { id: 1, name: 'MRI Scan', category: 'MRI Scan', avgCost: 5000, minCost: 3000, maxCost: 12000 },
  { id: 2, name: 'CT Scan', category: 'CT Scan', avgCost: 3500, minCost: 2000, maxCost: 8000 },
  { id: 3, name: 'Complete Blood Count (CBC)', category: 'Blood Tests', avgCost: 500, minCost: 200, maxCost: 1200 },
  { id: 4, name: 'Lipid Profile', category: 'Blood Tests', avgCost: 700, minCost: 300, maxCost: 1500 },
  { id: 5, name: 'Thyroid Function Test', category: 'Blood Tests', avgCost: 800, minCost: 400, maxCost: 1800 },
  { id: 6, name: 'General Consultation', category: 'General Consultation', avgCost: 600, minCost: 200, maxCost: 1500 },
  { id: 7, name: 'Appendectomy', category: 'Surgery', avgCost: 45000, minCost: 25000, maxCost: 100000 },
  { id: 8, name: 'Knee Replacement', category: 'Surgery', avgCost: 250000, minCost: 150000, maxCost: 500000 },
  { id: 9, name: 'Cataract Surgery', category: 'Surgery', avgCost: 35000, minCost: 15000, maxCost: 80000 },
  { id: 10, name: 'Normal Delivery', category: 'Hospital Admission', avgCost: 30000, minCost: 10000, maxCost: 80000 },
  { id: 11, name: 'X-Ray', category: 'Diagnostic Procedures', avgCost: 800, minCost: 300, maxCost: 2000 },
  { id: 12, name: 'Ultrasound', category: 'Diagnostic Procedures', avgCost: 1500, minCost: 600, maxCost: 3500 },
  { id: 13, name: 'ECG', category: 'Diagnostic Procedures', avgCost: 400, minCost: 150, maxCost: 1000 },
  { id: 14, name: 'Endoscopy', category: 'Diagnostic Procedures', avgCost: 4000, minCost: 2000, maxCost: 8000 },
  { id: 15, name: 'Dental Cleaning', category: 'Other Treatments', avgCost: 1200, minCost: 500, maxCost: 3000 },
  { id: 16, name: 'Root Canal Treatment', category: 'Other Treatments', avgCost: 5000, minCost: 2000, maxCost: 12000 },
  { id: 17, name: 'Angioplasty', category: 'Surgery', avgCost: 200000, minCost: 100000, maxCost: 400000 },
  { id: 18, name: 'Dialysis (per session)', category: 'Other Treatments', avgCost: 2000, minCost: 1000, maxCost: 4000 }
];

const TREATMENT_CATEGORIES = [
  'Blood Tests',
  'MRI Scan',
  'CT Scan',
  'General Consultation',
  'Surgery',
  'Hospital Admission',
  'Diagnostic Procedures',
  'Other Treatments'
];

const MOCK_SCHEMES = [
  {
    id: 1,
    name: 'Ayushman Bharat PM-JAY',
    shortName: 'PMJAY',
    description: 'Provides health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    benefits: 'Free treatment at empanelled hospitals, cashless and paperless access, covers 3 days pre-hospitalization and 15 days post-hospitalization expenses.',
    eligibility: 'Families identified based on SECC 2011 deprivation and occupational criteria. Covers bottom 40% of poor and vulnerable population.',
    coverage: '₹5,00,000 per family per year',
    documents: ['Aadhaar Card', 'Ration Card', 'SECC Data', 'Income Certificate'],
    applicationLink: 'https://pmjay.gov.in',
    applicationProcess: 'Visit nearest Ayushman Bharat Kendra or Common Service Centre (CSC). Check eligibility on the PMJAY website or by calling 14555.',
    incomeLimit: 300000,
    icon: '🏥',
    category: 'Central Government'
  },
  {
    id: 2,
    name: 'Aarogyasri Health Care Trust',
    shortName: 'Aarogyasri',
    description: 'Telangana state health insurance scheme providing cashless treatment for identified diseases to families below poverty line.',
    benefits: 'Cashless treatment for 938 procedures, 2,406 packages covering surgeries and therapies. Coverage for pre-existing diseases.',
    eligibility: 'Families with annual income below ₹1.5 lakh in Telangana state. Must hold a white ration card.',
    coverage: '₹2,00,000 per family per year (₹5,00,000 for specific procedures)',
    documents: ['White Ration Card', 'Aadhaar Card', 'Health Card', 'Income Certificate'],
    applicationLink: 'https://aarogyasri.telangana.gov.in',
    applicationProcess: 'Apply through Aarogyasri offices or designated government hospitals. Check eligibility through the Aarogyasri portal.',
    incomeLimit: 150000,
    icon: '🌿',
    category: 'State Government'
  },
  {
    id: 3,
    name: 'Central Government Health Scheme (CGHS)',
    shortName: 'CGHS',
    description: 'Comprehensive healthcare scheme for central government employees and pensioners covering OPD and hospitalization.',
    benefits: 'OPD treatment, hospitalization, investigation charges, medicines. Covers family members including dependent parents.',
    eligibility: 'Central government employees, pensioners, sitting and former MPs, judges, freedom fighters and their dependents.',
    coverage: 'Based on pay scale — ranges from ₹2,00,000 to ₹10,00,000',
    documents: ['CGHS Card', 'Government ID', 'Service Records', 'Dependency Certificate'],
    applicationLink: 'https://cghs.gov.in',
    applicationProcess: 'Register through the CGHS dispensary. Obtain CGHS card by submitting the required documents.',
    incomeLimit: null,
    icon: '🏛️',
    category: 'Central Government'
  },
  {
    id: 4,
    name: 'Employees State Insurance (ESI)',
    shortName: 'ESI',
    description: 'Social security and health insurance scheme for Indian workers providing medical, sickness, maternity and disability benefits.',
    benefits: 'Full medical care for insured person and family. Sickness benefit at 70% of wages. Maternity benefit for 26 weeks.',
    eligibility: 'Employees earning up to ₹21,000 per month in factories/establishments with 10+ employees.',
    coverage: 'Full medical coverage at ESI hospitals and dispensaries',
    documents: ['Aadhaar Card', 'Employer Certificate', 'PAN Card', 'Salary Slips'],
    applicationLink: 'https://esic.gov.in',
    applicationProcess: 'Registration through employer. ESI card issued after employer registers the employee on the ESIC portal.',
    incomeLimit: 252000,
    icon: '👷',
    category: 'Central Government'
  },
  {
    id: 5,
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    shortName: 'PMSBY',
    description: 'Accident insurance scheme offering coverage for accidental death and disability at an annual premium of ₹20.',
    benefits: '₹2 lakh for accidental death, ₹2 lakh for total permanent disability, ₹1 lakh for partial permanent disability.',
    eligibility: 'Indian citizens aged 18-70 years with a savings bank account.',
    coverage: '₹2,00,000 for accidental death/disability',
    documents: ['Aadhaar Card', 'Bank Account', 'Nomination Form'],
    applicationLink: 'https://financialservices.gov.in/pmsby',
    applicationProcess: 'Apply through your bank\'s net banking portal or visit the bank branch to fill the form.',
    incomeLimit: null,
    icon: '🛡️',
    category: 'Central Government'
  }
];

const MOCK_EXPENSES = {
  monthly: [
    { month: 'Jan', amount: 2400, insurance: 1800, outOfPocket: 600 },
    { month: 'Feb', amount: 1800, insurance: 1200, outOfPocket: 600 },
    { month: 'Mar', amount: 3200, insurance: 2400, outOfPocket: 800 },
    { month: 'Apr', amount: 2800, insurance: 2000, outOfPocket: 800 },
    { month: 'May', amount: 1500, insurance: 1000, outOfPocket: 500 },
    { month: 'Jun', amount: 4200, insurance: 3200, outOfPocket: 1000 },
    { month: 'Jul', amount: 2100, insurance: 1600, outOfPocket: 500 },
    { month: 'Aug', amount: 3800, insurance: 2800, outOfPocket: 1000 },
    { month: 'Sep', amount: 2600, insurance: 1800, outOfPocket: 800 },
    { month: 'Oct', amount: 1900, insurance: 1400, outOfPocket: 500 },
    { month: 'Nov', amount: 0, insurance: 0, outOfPocket: 0 },
    { month: 'Dec', amount: 0, insurance: 0, outOfPocket: 0 }
  ],
  categories: [
    { name: 'Diagnostics', amount: 8200, color: '#84CC16' },
    { name: 'Consultation', amount: 4800, color: '#65A30D' },
    { name: 'Medicines', amount: 5600, color: '#a3e635' },
    { name: 'Hospitalization', amount: 3200, color: '#4d7c0f' },
    { name: 'Other', amount: 2700, color: '#bef264' }
  ]
};

const MOCK_ACTIVITIES = [
  { id: 1, text: 'MRI Scan cost estimated', detail: 'Estimated cost: ₹5,000 — ₹8,000', time: '2 hours ago', icon: 'scan' },
  { id: 2, text: 'Hospital comparison completed', detail: 'Compared 4 hospitals in Hyderabad', time: '5 hours ago', icon: 'compare' },
  { id: 3, text: 'Insurance calculation performed', detail: 'Out-of-pocket estimate: ₹10,000', time: '1 day ago', icon: 'insurance' },
  { id: 4, text: 'Government scheme viewed', detail: 'Ayushman Bharat PM-JAY eligibility checked', time: '2 days ago', icon: 'scheme' },
  { id: 5, text: 'Blood test cost estimated', detail: 'CBC Test — Estimated: ₹200 — ₹500', time: '3 days ago', icon: 'test' },
  { id: 6, text: 'Profile updated', detail: 'Insurance information added', time: '5 days ago', icon: 'profile' }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Cost Prediction Ready', text: 'Your MRI scan cost estimate is ready to view.', time: '2 min ago', type: 'success' },
  { id: 2, title: 'New Scheme Available', text: 'You may be eligible for Aarogyasri scheme.', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'Savings Alert', text: 'We found a hospital with 30% lower costs.', time: '3 hours ago', type: 'success' },
  { id: 4, title: 'Insurance Reminder', text: 'Your policy renewal is due next month.', time: '1 day ago', type: 'warning' }
];

const INSURANCE_PROVIDERS = [
  'Star Health Insurance',
  'HDFC ERGO Health Insurance',
  'ICICI Lombard Health Insurance',
  'Bajaj Allianz Health Insurance',
  'Max Bupa Health Insurance',
  'New India Assurance',
  'National Insurance',
  'Oriental Insurance',
  'United India Insurance',
  'Other'
];

const CHATBOT_RESPONSES = {
  'mri': 'Based on our data, an MRI scan in Hyderabad typically costs between ₹3,000 and ₹12,000. Government hospitals like Gandhi Hospital offer MRI scans starting from ₹3,000, while private hospitals like Apollo may charge ₹8,000–₹12,000. Would you like me to help you find the most affordable option?',
  'hospital': 'I can help you find affordable hospitals near you! In Hyderabad, government hospitals like Gandhi Hospital and Osmania General Hospital offer treatments at significantly lower costs. Would you like me to show you a comparison of hospitals based on your specific treatment needs?',
  'scheme': 'There are several government healthcare schemes you might be eligible for:\n\n1. **Ayushman Bharat PM-JAY** — Up to ₹5 lakh coverage\n2. **Aarogyasri** — For Telangana residents below poverty line\n3. **ESI** — For salaried employees\n\nWould you like me to check your eligibility for any of these?',
  'insurance': 'To calculate your out-of-pocket expenses, I\'ll need:\n• Total treatment cost\n• Your insurance coverage amount\n• Deductible and co-payment details\n\nYou can use our Insurance Calculator for a detailed breakdown. Would you like me to take you there?',
  'compare': 'I can help you compare treatment costs across hospitals in Hyderabad. For example, an MRI scan ranges from ₹3,000 at government hospitals to ₹12,000 at premium private hospitals. What treatment would you like to compare?',
  'default': 'I\'m your Aarogya AI Assistant! I can help you with:\n\n• 💰 Estimating treatment costs\n• 🏥 Finding affordable hospitals\n• 📊 Comparing healthcare expenses\n• 🛡️ Understanding insurance coverage\n• 📋 Discovering government schemes\n\nWhat would you like to know?'
};

const CITIES = [
  'Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'
];

const STATES = [
  'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
  'Kerala', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh',
  'Madhya Pradesh', 'Bihar', 'Odisha', 'Punjab', 'Haryana', 'Delhi'
];

// Admin mock data
const MOCK_ADMIN_STATS = {
  totalUsers: 12458,
  totalHospitals: 342,
  totalPredictions: 45230,
  totalSchemes: 18,
  predictionAccuracy: 87.5,
  activeUsers: 3421,
  newUsersToday: 89,
  revenueThisMonth: 0
};

const MOCK_ADMIN_USERS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', city: 'Hyderabad', joined: '2026-01-15', status: 'Active', predictions: 12 },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', city: 'Mumbai', joined: '2026-02-20', status: 'Active', predictions: 8 },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', city: 'Delhi', joined: '2026-03-10', status: 'Inactive', predictions: 3 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', city: 'Hyderabad', joined: '2026-04-05', status: 'Active', predictions: 15 },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', city: 'Bangalore', joined: '2026-05-12', status: 'Active', predictions: 6 },
  { id: 6, name: 'Ananya Das', email: 'ananya@example.com', city: 'Kolkata', joined: '2026-06-18', status: 'Active', predictions: 9 },
  { id: 7, name: 'Karthik Nair', email: 'karthik@example.com', city: 'Chennai', joined: '2026-07-22', status: 'Inactive', predictions: 2 },
  { id: 8, name: 'Meera Joshi', email: 'meera@example.com', city: 'Pune', joined: '2026-08-30', status: 'Active', predictions: 11 }
];
