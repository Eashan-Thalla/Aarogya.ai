"""
Aarogya.ai - FastAPI Backend Server
Connects the Frontend Application to MongoDB Atlas (cluster0.ridhmnq.mongodb.net)
Provides RESTful APIs for Hospitals, Treatments, Schemes, User Profile, Expenses & Activities.
"""

import os
import time
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pymongo import MongoClient
import uvicorn

# Load environment configuration
load_dotenv()

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://eashanthalla_db_user:EvGa2UNs6Au3ojCG@cluster0.ridhmnq.mongodb.net/?retryWrites=true&w=majority"
)
DATABASE_NAME = os.getenv("DATABASE_NAME", "aarogya_db")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "127.0.0.1")

# Initialize FastAPI App
app = FastAPI(
    title="Aarogya.ai Healthcare API",
    description="Backend API connecting Aarogya.ai frontend to MongoDB Atlas",
    version="1.0.0"
)

# Enable CORS for all origins (supports file://, localhost:8000, localhost:5500, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
db_client: Optional[MongoClient] = None
db = None

def get_database():
    global db_client, db
    if db is None:
        try:
            db_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            db = db_client[DATABASE_NAME]
        except Exception as e:
            print(f"[ERROR] Failed to connect to MongoDB: {e}")
            return None
    return db

# Helper: Convert Mongo doc to JSON serializable dict
def clean_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    clean = dict(doc)
    if "_id" in clean:
        clean["_id"] = str(clean["_id"])
    return clean

# ============================================================================
# 1. DATABASE HEALTH & STATUS
# ============================================================================
@app.get("/api/status")
def get_db_status():
    """Returns real-time connection status with MongoDB Atlas cluster"""
    database = get_database()
    if database is None:
        return JSONResponse(
            status_code=503,
            content={"status": "disconnected", "error": "Could not connect to MongoDB Atlas"}
        )

    try:
        t0 = time.time()
        database.command("ping")
        latency_ms = round((time.time() - t0) * 1000, 1)

        counts = {
            "hospitals": database["hospitals"].count_documents({}),
            "treatments": database["treatments"].count_documents({}),
            "schemes": database["schemes"].count_documents({}),
            "users": database["users"].count_documents({}),
            "expenses": database["expenses"].count_documents({}),
            "activities": database["activities"].count_documents({})
        }

        # Mask connection URI for security
        cluster_host = "cluster0.ridhmnq.mongodb.net"

        return {
            "status": "connected",
            "database": DATABASE_NAME,
            "cluster": cluster_host,
            "latencyMs": latency_ms,
            "counts": counts,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# ============================================================================
# 2. SEED DATABASE
# ============================================================================
@app.post("/api/seed")
def seed_data(force: bool = Query(False)):
    """Seed or reseed the database collections with healthcare mock data"""
    try:
        from seed_db import seed_database
        seed_database(force=force)
        return {"status": "success", "message": "Database successfully seeded with healthcare data!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# 3. USER PROFILE
# ============================================================================
@app.get("/api/user")
def get_user_profile():
    """Fetch current user profile from MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    user = database["users"].find_one({"_id": "user_eashan"})
    if not user:
        user = database["users"].find_one()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return clean_doc(user)

@app.put("/api/user")
def update_user_profile(payload: Dict[str, Any]):
    """Update user profile in MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    update_fields = {k: v for k, v in payload.items() if k != "_id"}
    result = database["users"].update_one(
        {"_id": "user_eashan"},
        {"$set": update_fields},
        upsert=True
    )

    # Log activity in MongoDB
    database["activities"].insert_one({
        "id": int(time.time()),
        "text": "Profile updated in MongoDB",
        "detail": f"Updated profile fields ({', '.join(update_fields.keys())})",
        "time": "Just now",
        "icon": "profile"
    })

    return {"status": "success", "modified_count": result.modified_count}

# ============================================================================
# 4. HOSPITALS
# ============================================================================
@app.get("/api/hospitals")
def get_hospitals(
    type: Optional[str] = None,
    search: Optional[str] = None,
    service: Optional[str] = None
):
    """Retrieve hospitals from MongoDB with optional filtering"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query: Dict[str, Any] = {}
    if type and type.lower() != "all":
        query["type"] = {"$regex": f"^{type}$", "$options": "i"}

    if service and service.lower() != "all":
        query["services"] = {"$in": [service]}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"services": {"$elemMatch": {"$regex": search, "$options": "i"}}}
        ]

    docs = list(database["hospitals"].find(query))
    return [clean_doc(d) for d in docs]

@app.post("/api/hospitals")
def add_hospital(hospital: Dict[str, Any]):
    """Add a new hospital record to MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    if "id" not in hospital:
        hospital["id"] = int(time.time())

    result = database["hospitals"].insert_one(hospital)
    return {"status": "success", "inserted_id": str(result.inserted_id), "id": hospital["id"]}

# ============================================================================
# 5. TREATMENTS
# ============================================================================
@app.get("/api/treatments")
def get_treatments(category: Optional[str] = None):
    """Retrieve treatments from MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query: Dict[str, Any] = {}
    if category and category.lower() != "all":
        query["category"] = category

    docs = list(database["treatments"].find(query))
    return [clean_doc(d) for d in docs]

# ============================================================================
# 6. GOVERNMENT SCHEMES
# ============================================================================
@app.get("/api/schemes")
def get_schemes(category: Optional[str] = None):
    """Retrieve government schemes from MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query: Dict[str, Any] = {}
    if category and category.lower() != "all":
        query["category"] = category

    docs = list(database["schemes"].find(query))
    return [clean_doc(d) for d in docs]

# ============================================================================
# 7. EXPENSES
# ============================================================================
@app.get("/api/expenses")
def get_expenses():
    """Retrieve all expenses and summary statistics from MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    docs = list(database["expenses"].find().sort("date", -1))
    cleaned = [clean_doc(d) for d in docs]

    total_amount = sum(d.get("amount", 0) for d in cleaned)
    total_insurance = sum(d.get("insuranceCovered", 0) for d in cleaned)
    total_out_of_pocket = sum(d.get("outOfPocket", 0) for d in cleaned)

    return {
        "items": cleaned,
        "summary": {
            "totalAmount": total_amount,
            "totalInsurance": total_insurance,
            "totalOutOfPocket": total_out_of_pocket,
            "count": len(cleaned)
        }
    }

@app.post("/api/expenses")
def add_expense(expense: Dict[str, Any]):
    """Record a new medical expense into MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    if "id" not in expense:
        expense["id"] = int(time.time())

    result = database["expenses"].insert_one(expense)

    # Log activity
    database["activities"].insert_one({
        "id": int(time.time()),
        "text": f"Expense recorded: {expense.get('treatment', 'Treatment')}",
        "detail": f"Amount: ₹{expense.get('amount', 0):,} at {expense.get('hospital', 'Hospital')}",
        "time": "Just now",
        "icon": "wallet"
    })

    return {"status": "success", "inserted_id": str(result.inserted_id), "id": expense["id"]}

# ============================================================================
# 8. ACTIVITIES
# ============================================================================
@app.get("/api/activities")
def get_activities(limit: int = 10):
    """Retrieve recent user activities from MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    docs = list(database["activities"].find().sort("id", -1).limit(limit))
    return [clean_doc(d) for d in docs]

@app.post("/api/activities")
def add_activity(activity: Dict[str, Any]):
    """Insert a user activity log into MongoDB"""
    database = get_database()
    if database is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    if "id" not in activity:
        activity["id"] = int(time.time())

    result = database["activities"].insert_one(activity)
    return {"status": "success", "inserted_id": str(result.inserted_id)}

# ============================================================================
# 9. SERVE FRONTEND STATIC FILES
# ============================================================================
# Serve css, js, assets directories
base_dir = os.path.dirname(os.path.abspath(__file__))

app.mount("/css", StaticFiles(directory=os.path.join(base_dir, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(base_dir, "js")), name="js")
if os.path.isdir(os.path.join(base_dir, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(base_dir, "assets")), name="assets")

@app.get("/")
def serve_index():
    """Serves the main Aarogya.ai Single Page Application"""
    return FileResponse(os.path.join(base_dir, "index.html"))

# ============================================================================
# MAIN RUNNER
# ============================================================================
if __name__ == "__main__":
    print(f"==================================================")
    print(f"  Aarogya.ai Backend Server")
    print(f"  Database : {DATABASE_NAME} (MongoDB Atlas)")
    print(f"  Cluster  : cluster0.ridhmnq.mongodb.net")
    print(f"  URL      : http://{HOST}:{PORT}")
    print(f"==================================================")
    uvicorn.run("server:app", host=HOST, port=PORT, reload=False)
