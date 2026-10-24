"""
Aarogya.ai - MongoDB Atlas Seeding Script
Seeds the database with initial healthcare dataset:
- User Profile & Insurance
- Hospitals in Hyderabad (lat/lng, beds, services, costs)
- Medical Treatments & Price benchmarks
- Government Healthcare Schemes
- Health Expense tracking
- Activity Log
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://eashanthalla_db_user:EvGa2UNs6Au3ojCG@cluster0.ridhmnq.mongodb.net/?retryWrites=true&w=majority"
)
DATABASE_NAME = os.getenv("DATABASE_NAME", "aarogya_db")

USER_DATA = {
    "_id": "user_eashan",
    "name": "Eashan",
    "email": "eashan@example.com",
    "age": 22,
    "gender": "Male",
    "city": "Hyderabad",
    "state": "Telangana",
    "avatar": "E",
    "phone": "+91 98765 43210",
    "bloodGroup": "O+",
    "insurance": {
        "provider": "Star Health Insurance",
        "policyName": "Star Comprehensive",
        "coverageAmount": 500000,
        "deductible": 5000,
        "coPayment": 10
    }
}

HOSPITALS_DATA = [
    {
        "id": 1,
        "name": "Gandhi Hospital",
        "type": "Government",
        "location": "Musheerabad, Hyderabad",
        "lat": 17.4243,
        "lng": 78.5033,
        "distance": 3.2,
        "rating": 4.1,
        "reviews": 2850,
        "services": ["General Medicine", "Surgery", "Diagnostics", "Emergency", "Cardiology"],
        "estimatedCost": 3500,
        "phone": "+91 40 2345 6789",
        "image": None,
        "affordable": True,
        "beds": 1200,
        "doctors": 450
    },
    {
        "id": 2,
        "name": "Osmania General Hospital",
        "type": "Government",
        "location": "Afzalgunj, Hyderabad",
        "lat": 17.3776,
        "lng": 78.4776,
        "distance": 5.1,
        "rating": 4.0,
        "reviews": 3200,
        "services": ["General Medicine", "Orthopedics", "ENT", "Pediatrics", "Surgery"],
        "estimatedCost": 2800,
        "phone": "+91 40 2456 7890",
        "image": None,
        "affordable": True,
        "beds": 1000,
        "doctors": 380
    },
    {
        "id": 3,
        "name": "NIMS Hospital",
        "type": "Government",
        "location": "Punjagutta, Hyderabad",
        "lat": 17.4222,
        "lng": 78.4528,
        "distance": 4.5,
        "rating": 4.3,
        "reviews": 4100,
        "services": ["Cardiology", "Neurology", "Oncology", "Radiology", "Emergency"],
        "estimatedCost": 4200,
        "phone": "+91 40 2345 8901",
        "image": None,
        "affordable": False,
        "beds": 1500,
        "doctors": 600
    },
    {
        "id": 4,
        "name": "Apollo Hospitals",
        "type": "Private",
        "location": "Jubilee Hills, Hyderabad",
        "lat": 17.4259,
        "lng": 78.4111,
        "distance": 7.8,
        "rating": 4.7,
        "reviews": 5600,
        "services": ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Robotics Surgery"],
        "estimatedCost": 15000,
        "phone": "+91 40 2345 1234",
        "image": None,
        "affordable": False,
        "beds": 2000,
        "doctors": 800
    },
    {
        "id": 5,
        "name": "KIMS Hospitals",
        "type": "Private",
        "location": "Secunderabad, Hyderabad",
        "lat": 17.4399,
        "lng": 78.4983,
        "distance": 6.2,
        "rating": 4.5,
        "reviews": 3900,
        "services": ["General Surgery", "Cardiology", "Gastroenterology", "Pulmonology", "Nephrology"],
        "estimatedCost": 12000,
        "phone": "+91 40 4488 5566",
        "image": None,
        "affordable": False,
        "beds": 1000,
        "doctors": 350
    },
    {
        "id": 6,
        "name": "Yashoda Hospitals",
        "type": "Private",
        "location": "Somajiguda, Hyderabad",
        "lat": 17.4249,
        "lng": 78.4583,
        "distance": 5.5,
        "rating": 4.4,
        "reviews": 4200,
        "services": ["Cardiology", "Neurosurgery", "Orthopedics", "Urology", "Diagnostics"],
        "estimatedCost": 11000,
        "phone": "+91 40 4567 8901",
        "image": None,
        "affordable": False,
        "beds": 850,
        "doctors": 300
    },
    {
        "id": 7,
        "name": "Care Hospitals",
        "type": "Private",
        "location": "Banjara Hills, Hyderabad",
        "lat": 17.4156,
        "lng": 78.4487,
        "distance": 8.1,
        "rating": 4.6,
        "reviews": 3100,
        "services": ["Cardiac Sciences", "Neurosciences", "Oncology", "Organ Transplant", "Emergency"],
        "estimatedCost": 13500,
        "phone": "+91 40 3044 5566",
        "image": None,
        "affordable": False,
        "beds": 750,
        "doctors": 280
    },
    {
        "id": 8,
        "name": "Area Hospital Kukatpally",
        "type": "Government",
        "location": "Kukatpally, Hyderabad",
        "lat": 17.4849,
        "lng": 78.4011,
        "distance": 2.5,
        "rating": 3.8,
        "reviews": 1800,
        "services": ["General Medicine", "Pediatrics", "Gynecology", "Diagnostics", "Pharmacy"],
        "estimatedCost": 1500,
        "phone": "+91 40 2345 0000",
        "image": None,
        "affordable": True,
        "beds": 200,
        "doctors": 80
    }
]

TREATMENTS_DATA = [
    { "id": 1, "name": "MRI Scan", "category": "MRI Scan", "avgCost": 5000, "minCost": 3000, "maxCost": 12000 },
    { "id": 2, "name": "CT Scan", "category": "CT Scan", "avgCost": 3500, "minCost": 2000, "maxCost": 8000 },
    { "id": 3, "name": "Complete Blood Count (CBC)", "category": "Blood Tests", "avgCost": 500, "minCost": 200, "maxCost": 1200 },
    { "id": 4, "name": "Lipid Profile", "category": "Blood Tests", "avgCost": 700, "minCost": 300, "maxCost": 1500 },
    { "id": 5, "name": "Thyroid Function Test", "category": "Blood Tests", "avgCost": 800, "minCost": 400, "maxCost": 1800 },
    { "id": 6, "name": "General Consultation", "category": "General Consultation", "avgCost": 600, "minCost": 200, "maxCost": 1500 },
    { "id": 7, "name": "Appendectomy", "category": "Surgery", "avgCost": 45000, "minCost": 25000, "maxCost": 100000 },
    { "id": 8, "name": "Knee Replacement", "category": "Surgery", "avgCost": 250000, "minCost": 150000, "maxCost": 500000 },
    { "id": 9, "name": "Cataract Surgery", "category": "Surgery", "avgCost": 35000, "minCost": 15000, "maxCost": 80000 },
    { "id": 10, "name": "Normal Delivery", "category": "Hospital Admission", "avgCost": 30000, "minCost": 10000, "maxCost": 80000 },
    { "id": 11, "name": "X-Ray", "category": "Diagnostic Procedures", "avgCost": 800, "minCost": 300, "maxCost": 2000 },
    { "id": 12, "name": "Ultrasound", "category": "Diagnostic Procedures", "avgCost": 1500, "minCost": 600, "maxCost": 3500 },
    { "id": 13, "name": "ECG", "category": "Diagnostic Procedures", "avgCost": 400, "minCost": 150, "maxCost": 1000 },
    { "id": 14, "name": "Endoscopy", "category": "Diagnostic Procedures", "avgCost": 4000, "minCost": 2000, "maxCost": 8000 },
    { "id": 15, "name": "Dental Cleaning", "category": "Other Treatments", "avgCost": 1200, "minCost": 500, "maxCost": 3000 },
    { "id": 16, "name": "Root Canal Treatment", "category": "Other Treatments", "avgCost": 5000, "minCost": 2000, "maxCost": 12000 },
    { "id": 17, "name": "Angioplasty", "category": "Surgery", "avgCost": 200000, "minCost": 100000, "maxCost": 400000 },
    { "id": 18, "name": "Dialysis (per session)", "category": "Other Treatments", "avgCost": 2000, "minCost": 1000, "maxCost": 4000 }
]

SCHEMES_DATA = [
    {
        "id": 1,
        "name": "Ayushman Bharat PM-JAY",
        "shortName": "PMJAY",
        "description": "Provides health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        "benefits": "Free treatment at empanelled hospitals, cashless and paperless access, covers 3 days pre-hospitalization and 15 days post-hospitalization expenses.",
        "eligibility": "Families identified based on SECC 2011 deprivation and occupational criteria. Covers bottom 40% of poor and vulnerable population.",
        "coverage": "₹5,00,000 per family per year",
        "documents": ["Aadhaar Card", "Ration Card", "SECC Data", "Income Certificate"],
        "applicationLink": "https://pmjay.gov.in",
        "applicationProcess": "Visit nearest Ayushman Bharat Kendra or Common Service Centre (CSC). Check eligibility on the PMJAY website or by calling 14555.",
        "incomeLimit": 300000,
        "icon": "🏥",
        "category": "Central Government"
    },
    {
        "id": 2,
        "name": "Aarogyasri Health Care Trust",
        "shortName": "Aarogyasri",
        "description": "Telangana state health insurance scheme providing cashless treatment for identified diseases to families below poverty line.",
        "benefits": "Cashless treatment for 938 procedures, 2,406 packages covering surgeries and therapies. Coverage for pre-existing diseases.",
        "eligibility": "Families with annual income below ₹1.5 lakh in Telangana state. Must hold a white ration card.",
        "coverage": "₹2,00,000 per family per year (₹5,00,000 for specific procedures)",
        "documents": ["White Ration Card", "Aadhaar Card", "Health Card", "Income Certificate"],
        "applicationLink": "https://aarogyasri.telangana.gov.in",
        "applicationProcess": "Apply through Aarogyasri offices or designated government hospitals. Check eligibility through the Aarogyasri portal.",
        "incomeLimit": 150000,
        "icon": "🌿",
        "category": "State Government"
    },
    {
        "id": 3,
        "name": "Central Government Health Scheme (CGHS)",
        "shortName": "CGHS",
        "description": "Comprehensive healthcare scheme for central government employees and pensioners covering OPD and hospitalization.",
        "benefits": "OPD treatment, hospitalization, investigation charges, medicines. Covers family members including dependent parents.",
        "eligibility": "Central government employees, pensioners, sitting and former MPs, judges, freedom fighters and their dependents.",
        "coverage": "Based on pay scale — ranges from ₹2,00,000 to ₹10,00,000",
        "documents": ["CGHS Card", "Government ID", "Service Records", "Dependency Certificate"],
        "applicationLink": "https://cghs.gov.in",
        "applicationProcess": "Register through the CGHS dispensary. Obtain CGHS card by submitting the required documents.",
        "incomeLimit": None,
        "icon": "🏛️",
        "category": "Central Government"
    },
    {
        "id": 4,
        "name": "Employees State Insurance (ESI)",
        "shortName": "ESI",
        "description": "Social security and health insurance scheme for Indian workers providing medical, sickness, maternity and disability benefits.",
        "benefits": "Full medical care for insured person and family. Sickness benefit at 70% of wages. Maternity benefit for 26 weeks.",
        "eligibility": "Employees earning up to ₹21,000 per month in factories/establishments with 10+ employees.",
        "coverage": "Full medical coverage at ESI hospitals and dispensaries",
        "documents": ["Aadhaar Card", "Employer Certificate", "PAN Card", "Salary Slips"],
        "applicationLink": "https://esic.gov.in",
        "applicationProcess": "Registration through employer. ESI card issued after employer registers the employee on the ESIC portal.",
        "incomeLimit": 252000,
        "icon": "👷",
        "category": "Central Government"
    },
    {
        "id": 5,
        "name": "Pradhan Mantri Suraksha Bima Yojana",
        "shortName": "PMSBY",
        "description": "Accident insurance scheme offering coverage for accidental death and disability at an annual premium of ₹20.",
        "benefits": "₹2 lakh for accidental death, ₹2 lakh for total permanent disability, ₹1 lakh for partial permanent disability.",
        "eligibility": "Indian citizens aged 18-70 years with a savings bank account.",
        "coverage": "₹2,00,000 for accidental death/disability",
        "documents": ["Aadhaar Card", "Bank Account", "Nomination Form"],
        "applicationLink": "https://financialservices.gov.in/pmsby",
        "applicationProcess": "Apply through your bank's net banking portal or visit the bank branch to fill the form.",
        "incomeLimit": None,
        "icon": "🛡️",
        "category": "Central Government"
    }
]

EXPENSES_DATA = [
    {"id": 1, "date": "2026-10-15", "treatment": "MRI Brain Scan", "hospital": "Gandhi Hospital", "category": "Diagnostics", "amount": 3500, "insuranceCovered": 2500, "outOfPocket": 1000},
    {"id": 2, "date": "2026-10-02", "treatment": "General Consultation & Blood Test", "hospital": "Care Hospitals", "category": "Consultation", "amount": 1600, "insuranceCovered": 1000, "outOfPocket": 600},
    {"id": 3, "date": "2026-09-18", "treatment": "Prescription Medicines (Antibiotics + Vitamins)", "hospital": "Apollo Pharmacy", "category": "Medicines", "amount": 2200, "insuranceCovered": 1500, "outOfPocket": 700},
    {"id": 4, "date": "2026-08-25", "treatment": "Dental Root Canal Consultation", "hospital": "Osmania General Hospital", "category": "Diagnostics", "amount": 1200, "insuranceCovered": 800, "outOfPocket": 400}
]

ACTIVITIES_DATA = [
    { "id": 1, "text": "MRI Scan cost estimated", "detail": "Estimated cost: ₹5,000 — ₹8,000", "time": "2 hours ago", "icon": "scan" },
    { "id": 2, "text": "Hospital comparison completed", "detail": "Compared 4 hospitals in Hyderabad", "time": "5 hours ago", "icon": "compare" },
    { "id": 3, "text": "Insurance calculation performed", "detail": "Out-of-pocket estimate: ₹10,000", "time": "1 day ago", "icon": "insurance" },
    { "id": 4, "text": "Government scheme viewed", "detail": "Ayushman Bharat PM-JAY eligibility checked", "time": "2 days ago", "icon": "scheme" },
    { "id": 5, "text": "Blood test cost estimated", "detail": "CBC Test — Estimated: ₹200 — ₹500", "time": "3 days ago", "icon": "test" },
    { "id": 6, "text": "Profile updated", "detail": "Insurance information added", "time": "5 days ago", "icon": "profile" }
]

def seed_database(force=False):
    print(f"Connecting to MongoDB Atlas...")
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=8000)
    db = client[DATABASE_NAME]

    # Verify connection
    client.admin.command('ping')
    print(f"[OK] Connected to MongoDB Atlas: {DATABASE_NAME}")

    # 1. User
    user_col = db["users"]
    if force or user_col.count_documents({}) == 0:
        user_col.delete_many({})
        user_col.insert_one(USER_DATA)
        print(f"  * Seeded user: {USER_DATA['name']}")
    else:
        print(f"  * User collection already has data ({user_col.count_documents({})} docs)")

    # 2. Hospitals
    hosp_col = db["hospitals"]
    if force or hosp_col.count_documents({}) == 0:
        hosp_col.delete_many({})
        hosp_col.insert_many(HOSPITALS_DATA)
        print(f"  * Seeded {len(HOSPITALS_DATA)} hospitals")
    else:
        print(f"  * Hospitals collection already has data ({hosp_col.count_documents({})} docs)")

    # 3. Treatments
    treat_col = db["treatments"]
    if force or treat_col.count_documents({}) == 0:
        treat_col.delete_many({})
        treat_col.insert_many(TREATMENTS_DATA)
        print(f"  * Seeded {len(TREATMENTS_DATA)} treatments")
    else:
        print(f"  * Treatments collection already has data ({treat_col.count_documents({})} docs)")

    # 4. Schemes
    scheme_col = db["schemes"]
    if force or scheme_col.count_documents({}) == 0:
        scheme_col.delete_many({})
        scheme_col.insert_many(SCHEMES_DATA)
        print(f"  * Seeded {len(SCHEMES_DATA)} government schemes")
    else:
        print(f"  * Schemes collection already has data ({scheme_col.count_documents({})} docs)")

    # 5. Expenses
    exp_col = db["expenses"]
    if force or exp_col.count_documents({}) == 0:
        exp_col.delete_many({})
        exp_col.insert_many(EXPENSES_DATA)
        print(f"  * Seeded {len(EXPENSES_DATA)} expenses")
    else:
        print(f"  * Expenses collection already has data ({exp_col.count_documents({})} docs)")

    # 6. Activities
    act_col = db["activities"]
    if force or act_col.count_documents({}) == 0:
        act_col.delete_many({})
        act_col.insert_many(ACTIVITIES_DATA)
        print(f"  * Seeded {len(ACTIVITIES_DATA)} activities")
    else:
        print(f"  * Activities collection already has data ({act_col.count_documents({})} docs)")

    print("\n[SUCCESS] MongoDB Atlas Database seeding completed successfully!")
    print("Database:", DATABASE_NAME)
    print("Collections:", db.list_collection_names())

if __name__ == "__main__":
    seed_database(force=True)
