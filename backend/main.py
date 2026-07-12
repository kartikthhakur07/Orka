# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="ORKA API", version="1.0.0")

# CORS — frontend ko backend se baat karne deta hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "https://orka.vercel.app",         # Vercel production (baad mein update karna)
        os.getenv("FRONTEND_URL", "*")     # Env se bhi le sakta hai
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "ORKA API is running! 🚀",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Dummy team data (hackathon ke liye)
TEAM = [
    {"id": "1", "name": "Hitendra", "skills": ["Backend", "Python", "API"], "workload": 50, "availability": 4},
    {"id": "2", "name": "Arya",     "skills": ["React", "UI", "Next.js"],   "workload": 60, "availability": 3},
    {"id": "3", "name": "Astha",    "skills": ["Python", "ML", "AI"],       "workload": 30, "availability": 6},
    {"id": "4", "name": "Kartik",   "skills": ["Testing", "DevOps"],        "workload": 45, "availability": 5},
]

@app.get("/api/team")
async def get_team():
    return {"team": TEAM}

@app.post("/api/tasks/assign")
async def assign_task(task: dict):
    """AI task assignment endpoint"""
    required_skills = task.get("required_skills", [])
    
    scores = []
    for member in TEAM:
        # Skill match
        matched = len(set(required_skills) & set(member["skills"]))
        skill_score = matched / max(len(required_skills), 1)
        
        # Availability
        avail_score = member["availability"] / 8.0
        
        # Workload (inverse — jitna free utna better)
        workload_score = (100 - member["workload"]) / 100
        
        # Final score
        final = (0.50 * skill_score + 0.30 * avail_score + 0.20 * workload_score) * 100
        
        scores.append({
            "name": member["name"],
            "score": round(final, 1),
            "skills": member["skills"],
            "workload": member["workload"]
        })
    
    scores.sort(key=lambda x: x["score"], reverse=True)
    
    return {
        "task": task.get("title", "Unknown task"),
        "assigned_to": scores[0]["name"],
        "assignment_score": scores[0]["score"],
        "backup": scores[1]["name"] if len(scores) > 1 else None,
        "all_scores": scores
    }

@app.get("/api/burnout")
async def get_burnout_status():
    """Burnout status for all team members"""
    burnout_data = [
        {"name": "Hitendra", "cognitive_load": 75, "risk_level": "watch",    "risk_score": 75},
        {"name": "Arya",     "cognitive_load": 60, "risk_level": "safe",     "risk_score": 45},
        {"name": "Astha",    "cognitive_load": 30, "risk_level": "safe",     "risk_score": 30},
        {"name": "Kartik",   "cognitive_load": 90, "risk_level": "critical", "risk_score": 90},
    ]
    return {"burnout_status": burnout_data}

@app.get("/api/wfh")
async def get_wfh_schedule():
    """WFH decisions for the week"""
    wfh_data = [
        {"name": "Hitendra", "wfh_score": 72, "recommended_days": ["Monday", "Wednesday"], "decision": "WFH approved"},
        {"name": "Arya",     "wfh_score": 87, "recommended_days": ["Monday", "Tuesday"],   "decision": "Full WFH"},
        {"name": "Astha",    "wfh_score": 55, "recommended_days": ["Wednesday"],            "decision": "1-day WFH"},
        {"name": "Kartik",   "wfh_score": 38, "recommended_days": [],                      "decision": "Office preferred"},
    ]
    return {"wfh_schedule": wfh_data}