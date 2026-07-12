"""
ORKA v2 - Main FastAPI Application
Complete backend with all API endpoints for the ORKA AI Project Management Platform
"""

import json
import math
import random
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import create_tables, get_db, seed_database
from model import Project, Sprint, Task, TeamMember, WorkDNA

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="ORKA v2 API",
    description="AI-powered Project Management Platform Backend",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup():
    create_tables()
    seed_database()


# ---------------------------------------------------------------------------
# Pydantic Schemas (Request Bodies)
# ---------------------------------------------------------------------------

class TaskAssignRequest(BaseModel):
    title: str
    required_skills: List[str]
    priority: str = "medium"
    complexity: int = 5
    deadline_days: int = 7


class TaskSplitRequest(BaseModel):
    task_title: str


class TaskParseRequest(BaseModel):
    description: str


class SprintGenerateRequest(BaseModel):
    task_titles: List[str]
    duration_days: int = 5


class CopilotRequest(BaseModel):
    question: str


class TeamBuildRequest(BaseModel):
    project_type: str
    required_skills: List[str]


class RebalanceRequest(BaseModel):
    trigger_member: str


# ---------------------------------------------------------------------------
# Helper Utilities
# ---------------------------------------------------------------------------

def parse_skills(skills_json: str) -> List[str]:
    """Parse JSON skill list from database field."""
    try:
        return json.loads(skills_json) if skills_json else []
    except (json.JSONDecodeError, TypeError):
        return []


def parse_json_field(field: str) -> Any:
    """Parse any JSON text field."""
    try:
        return json.loads(field) if field else []
    except (json.JSONDecodeError, TypeError):
        return []


def skill_match_score(member_skills: List[str], required_skills: List[str]) -> float:
    """Return 0-100 based on how many required skills the member has."""
    if not required_skills:
        return 100.0
    member_set = {s.lower() for s in member_skills}
    req_set = {s.lower() for s in required_skills}
    matched = member_set.intersection(req_set)
    return round((len(matched) / len(req_set)) * 100, 2)


def get_risk_level(burnout_score: float) -> str:
    if burnout_score < 40:
        return "safe"
    elif burnout_score <= 70:
        return "watch"
    else:
        return "critical"


def compute_wfh_score(member: TeamMember) -> float:
    """Compute WFH recommendation score (0-100)."""
    commute_factor = min(100, member.commute_distance * 2)
    score = (
        member.deep_work_req * 0.30
        + (100 - member.collab_req) * 0.20
        + commute_factor * 0.20
        + max(0, 100 - member.meeting_load * 10) * 0.15
        + (100 - member.burnout_score) * 0.15
    )
    return round(score, 2)


def wfh_decision_and_days(score: float):
    if score > 70:
        return "Full WFH approved", ["Monday", "Tuesday", "Wednesday"]
    elif score >= 50:
        return "Partial WFH", ["Monday", "Wednesday"]
    else:
        return "Office preferred", []


def compute_assignment_score(
    member: TeamMember,
    member_skills: List[str],
    required_skills: List[str],
    deadline_days: int,
) -> float:
    """Weighted assignment score (0-100)."""
    skill_score = skill_match_score(member_skills, required_skills)
    availability_score = (member.availability / 8.0) * 100
    workload_score = 100 - member.workload
    performance_score = member.performance_rating
    urgency = max(0, 100 - deadline_days * 5)  # more urgent = higher bonus

    total = (
        skill_score * 0.35
        + availability_score * 0.25
        + workload_score * 0.20
        + performance_score * 0.15
        + urgency * 0.05
    )
    return round(total, 2)


def build_assign_reason(
    member: TeamMember,
    member_skills: List[str],
    required_skills: List[str],
    score: float,
) -> List[str]:
    reasons = []
    matched = [s for s in required_skills if s.lower() in [x.lower() for x in member_skills]]
    if matched:
        reasons.append(f"Has required skills: {', '.join(matched)}")
    if member.availability >= 6:
        reasons.append(f"High availability: {member.availability}h/day free")
    if member.workload < 50:
        reasons.append(f"Low workload at {member.workload}%")
    if member.performance_rating >= 88:
        reasons.append(f"Strong performance rating: {member.performance_rating}/100")
    if member.burnout_score < 50:
        reasons.append("Low burnout risk – ideal time to assign new tasks")
    reasons.append(f"Overall assignment score: {score}/100")
    return reasons


# ---------------------------------------------------------------------------
# Keyword tables for task parsing
# ---------------------------------------------------------------------------

SKILL_KEYWORDS: Dict[str, List[str]] = {
    "jwt": ["Backend", "Security", "JWT"],
    "auth": ["Backend", "Security", "JWT"],
    "login": ["Backend", "Security", "JWT"],
    "api": ["Backend", "API", "Python"],
    "rest": ["Backend", "API"],
    "graphql": ["Backend", "API"],
    "database": ["Backend", "Database", "SQL"],
    "sql": ["Backend", "Database", "SQL"],
    "postgres": ["Backend", "Database"],
    "mysql": ["Backend", "Database"],
    "redis": ["Backend", "Database"],
    "react": ["React", "TypeScript", "CSS"],
    "next": ["React", "Next.js", "TypeScript"],
    "frontend": ["React", "UI", "CSS"],
    "ui": ["React", "UI", "CSS"],
    "component": ["React", "UI", "TypeScript"],
    "css": ["CSS", "UI"],
    "design": ["UI", "CSS"],
    "ml": ["Python", "ML", "AI"],
    "machine learning": ["Python", "ML", "AI"],
    "model": ["Python", "ML", "TensorFlow"],
    "tensorflow": ["Python", "ML", "TensorFlow"],
    "data": ["Python", "Data", "ML"],
    "pipeline": ["Python", "ML", "Data"],
    "docker": ["DevOps", "Docker", "Cloud"],
    "kubernetes": ["DevOps", "Cloud", "AWS"],
    "aws": ["Cloud", "AWS", "DevOps"],
    "ci": ["DevOps", "CI/CD"],
    "cd": ["DevOps", "CI/CD"],
    "deploy": ["DevOps", "Cloud", "Docker"],
    "payment": ["Backend", "API", "Security"],
    "stripe": ["Backend", "API", "Security"],
    "notification": ["Backend", "API"],
    "email": ["Backend", "API"],
    "test": ["Backend", "Python"],
    "testing": ["Backend", "Python"],
    "security": ["Backend", "Security"],
    "encryption": ["Backend", "Security"],
    "node": ["Node.js", "Backend"],
    "express": ["Node.js", "Backend"],
}

COMPLEXITY_KEYWORDS: Dict[str, int] = {
    "simple": 2, "basic": 2, "quick": 2,
    "standard": 4, "typical": 4,
    "complex": 7, "advanced": 7, "integration": 6,
    "authentication": 7, "auth": 7, "jwt": 7,
    "machine learning": 9, "ml": 9, "ai": 8, "model": 8,
    "payment": 8, "stripe": 8, "gateway": 8,
    "real-time": 8, "websocket": 7,
    "crud": 3, "list": 2, "form": 3,
    "api": 5, "rest": 5,
}

TASK_SPLIT_TEMPLATES: Dict[str, List[Dict]] = {
    "e-commerce": [
        {"title": "UI Design & Wireframes", "skill": "UI", "estimated_hours": 4, "priority": "high", "complexity": 5},
        {"title": "Backend API Endpoints", "skill": "Backend", "estimated_hours": 8, "priority": "high", "complexity": 7},
        {"title": "Database Schema Design", "skill": "Database", "estimated_hours": 3, "priority": "high", "complexity": 4},
        {"title": "Payment Integration (Stripe)", "skill": "Security", "estimated_hours": 6, "priority": "critical", "complexity": 8},
        {"title": "Shopping Cart Logic", "skill": "React", "estimated_hours": 5, "priority": "high", "complexity": 6},
        {"title": "Unit & Integration Testing", "skill": "Python", "estimated_hours": 4, "priority": "medium", "complexity": 5},
        {"title": "Deployment & CI/CD Setup", "skill": "DevOps", "estimated_hours": 3, "priority": "high", "complexity": 6},
    ],
    "website": [
        {"title": "UI/UX Design", "skill": "UI", "estimated_hours": 4, "priority": "high", "complexity": 4},
        {"title": "Frontend Development", "skill": "React", "estimated_hours": 6, "priority": "high", "complexity": 5},
        {"title": "Backend API", "skill": "Backend", "estimated_hours": 5, "priority": "high", "complexity": 5},
        {"title": "Database Setup", "skill": "Database", "estimated_hours": 2, "priority": "medium", "complexity": 3},
        {"title": "Deployment", "skill": "DevOps", "estimated_hours": 2, "priority": "medium", "complexity": 4},
    ],
    "mobile": [
        {"title": "App UI Screens", "skill": "UI", "estimated_hours": 8, "priority": "high", "complexity": 6},
        {"title": "API Integration", "skill": "Backend", "estimated_hours": 6, "priority": "high", "complexity": 6},
        {"title": "Push Notifications", "skill": "Backend", "estimated_hours": 3, "priority": "medium", "complexity": 5},
        {"title": "Authentication Flow", "skill": "Security", "estimated_hours": 4, "priority": "high", "complexity": 7},
        {"title": "App Store Deployment", "skill": "DevOps", "estimated_hours": 2, "priority": "medium", "complexity": 4},
    ],
    "ml": [
        {"title": "Data Collection & Cleaning", "skill": "Data", "estimated_hours": 5, "priority": "high", "complexity": 5},
        {"title": "Feature Engineering", "skill": "Python", "estimated_hours": 4, "priority": "high", "complexity": 6},
        {"title": "Model Development", "skill": "ML", "estimated_hours": 8, "priority": "high", "complexity": 9},
        {"title": "Model Training & Evaluation", "skill": "ML", "estimated_hours": 6, "priority": "high", "complexity": 8},
        {"title": "API Wrapper for Model", "skill": "Backend", "estimated_hours": 3, "priority": "medium", "complexity": 5},
        {"title": "Model Deployment to Production", "skill": "DevOps", "estimated_hours": 4, "priority": "high", "complexity": 7},
    ],
    "auth": [
        {"title": "User Registration Endpoint", "skill": "Backend", "estimated_hours": 3, "priority": "high", "complexity": 5},
        {"title": "JWT Token Implementation", "skill": "Security", "estimated_hours": 4, "priority": "high", "complexity": 7},
        {"title": "Login & Logout Flow", "skill": "Backend", "estimated_hours": 3, "priority": "high", "complexity": 5},
        {"title": "Password Hashing & Reset", "skill": "Security", "estimated_hours": 3, "priority": "high", "complexity": 6},
        {"title": "Frontend Auth Forms", "skill": "React", "estimated_hours": 4, "priority": "medium", "complexity": 4},
        {"title": "Auth Testing", "skill": "Python", "estimated_hours": 2, "priority": "medium", "complexity": 4},
    ],
    "payment": [
        {"title": "Payment Provider Research", "skill": "Backend", "estimated_hours": 2, "priority": "high", "complexity": 3},
        {"title": "Stripe API Integration", "skill": "Security", "estimated_hours": 5, "priority": "critical", "complexity": 8},
        {"title": "Webhook Handling", "skill": "Backend", "estimated_hours": 4, "priority": "high", "complexity": 7},
        {"title": "Payment UI Components", "skill": "React", "estimated_hours": 3, "priority": "high", "complexity": 5},
        {"title": "Transaction Database Schema", "skill": "Database", "estimated_hours": 2, "priority": "high", "complexity": 4},
        {"title": "Payment Security Testing", "skill": "Security", "estimated_hours": 3, "priority": "critical", "complexity": 8},
    ],
    "default": [
        {"title": "Requirements Analysis", "skill": "Backend", "estimated_hours": 2, "priority": "high", "complexity": 3},
        {"title": "Design & Architecture", "skill": "Backend", "estimated_hours": 3, "priority": "high", "complexity": 5},
        {"title": "Core Implementation", "skill": "Backend", "estimated_hours": 6, "priority": "high", "complexity": 6},
        {"title": "Frontend Integration", "skill": "React", "estimated_hours": 4, "priority": "medium", "complexity": 5},
        {"title": "Testing & QA", "skill": "Python", "estimated_hours": 3, "priority": "medium", "complexity": 4},
        {"title": "Documentation & Deployment", "skill": "DevOps", "estimated_hours": 2, "priority": "low", "complexity": 3},
    ],
}


def split_task_by_keyword(task_title: str) -> List[Dict]:
    """Return subtasks list based on keyword matching in the task title."""
    title_lower = task_title.lower()
    for keyword, subtasks in TASK_SPLIT_TEMPLATES.items():
        if keyword in title_lower:
            return [dict(s) for s in subtasks]
    return [dict(s) for s in TASK_SPLIT_TEMPLATES["default"]]


def parse_task_description(description: str) -> Dict:
    """Extract task metadata from a natural-language description."""
    desc_lower = description.lower()

    # Extract skills
    extracted_skills: List[str] = []
    for keyword, skills in SKILL_KEYWORDS.items():
        if keyword in desc_lower:
            for skill in skills:
                if skill not in extracted_skills:
                    extracted_skills.append(skill)

    if not extracted_skills:
        extracted_skills = ["Backend", "Python"]

    # Estimate complexity
    complexity = 5
    for kw, c in COMPLEXITY_KEYWORDS.items():
        if kw in desc_lower:
            complexity = max(complexity, c)

    # Estimate hours based on complexity
    hours_map = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 12, 10: 16}
    estimated_hours = hours_map.get(complexity, 5)

    # Priority
    priority = "medium"
    if any(w in desc_lower for w in ["urgent", "critical", "asap", "immediately"]):
        priority = "critical"
    elif any(w in desc_lower for w in ["high priority", "important", "payment", "auth", "security"]):
        priority = "high"
    elif any(w in desc_lower for w in ["low", "minor", "small"]):
        priority = "low"

    # Dependencies
    dependencies: List[str] = []
    if "jwt" in desc_lower or "auth" in desc_lower:
        dependencies.append("User Authentication Module")
    if "payment" in desc_lower:
        dependencies.append("Payment Provider Account")
    if "database" in desc_lower or "sql" in desc_lower:
        dependencies.append("Database Schema")
    if "deploy" in desc_lower:
        dependencies.append("CI/CD Pipeline")

    # Required team size
    required_team_size = 1
    if complexity >= 8:
        required_team_size = 2
    elif complexity >= 6:
        required_team_size = 1

    return {
        "extracted_skills": extracted_skills,
        "estimated_hours": estimated_hours,
        "priority": priority,
        "dependencies": dependencies,
        "complexity": complexity,
        "required_team_size": required_team_size,
    }


# ---------------------------------------------------------------------------
# GET /api/dashboard
# ---------------------------------------------------------------------------

@app.get("/api/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()
    projects = db.query(Project).all()
    tasks = db.query(Task).all()

    if not members:
        raise HTTPException(status_code=404, detail="No team members found")

    team_health = round(sum(m.performance_rating for m in members) / len(members), 1)

    # Sprint progress: done tasks / total tasks
    total_tasks = len(tasks)
    done_tasks = sum(1 for t in tasks if t.status == "done")
    sprint_progress = round((done_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)

    burnout_index = round(sum(m.burnout_score for m in members) / len(members), 1)

    # WFH rate: members whose computed WFH score > 50
    wfh_approved = sum(1 for m in members if compute_wfh_score(m) > 50)
    wfh_rate = round((wfh_approved / len(members)) * 100, 1)

    active_tasks = sum(1 for t in tasks if t.status == "in-progress")

    avg_risk = round(sum(p.risk_score for p in projects) / len(projects), 1) if projects else 0

    # Recent assignments: last 5 tasks with assigned_to
    recent = (
        db.query(Task)
        .filter(Task.assigned_to.isnot(None))
        .order_by(Task.created_at.desc())
        .limit(5)
        .all()
    )
    recent_assignments = [
        {
            "id": t.id,
            "title": t.title,
            "assigned_to": t.assigned_to,
            "priority": t.priority,
            "status": t.status,
            "confidence": t.confidence,
        }
        for t in recent
    ]

    project_healths = [
        {
            "name": p.name,
            "health_score": p.health_score,
            "status": p.status,
            "risk_score": p.risk_score,
            "deadline_days": p.deadline_days,
        }
        for p in projects
    ]

    return {
        "team_health": team_health,
        "sprint_progress": sprint_progress,
        "burnout_index": burnout_index,
        "wfh_rate": wfh_rate,
        "active_tasks": active_tasks,
        "risk_score": avg_risk,
        "recent_assignments": recent_assignments,
        "project_healths": project_healths,
    }


# ---------------------------------------------------------------------------
# POST /api/tasks/assign
# ---------------------------------------------------------------------------

@app.post("/api/tasks/assign")
def assign_task(request: TaskAssignRequest, db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()
    if not members:
        raise HTTPException(status_code=404, detail="No team members found")

    scores = []
    for m in members:
        m_skills = parse_skills(m.skills)
        score = compute_assignment_score(m, m_skills, request.required_skills, request.deadline_days)
        scores.append((m, score, m_skills))

    scores.sort(key=lambda x: x[1], reverse=True)
    best_member, best_score, best_skills = scores[0]
    backup_member = scores[1][0] if len(scores) > 1 else None

    confidence = min(100, int(best_score))
    reasons = build_assign_reason(best_member, best_skills, request.required_skills, best_score)

    # Persist the task
    new_task = Task(
        title=request.title,
        required_skills=json.dumps(request.required_skills),
        priority=request.priority,
        status="todo",
        assigned_to=best_member.name,
        assignment_score=best_score,
        confidence=float(confidence),
        estimated_hours=request.complexity * 1.2,
        complexity=request.complexity,
        deadline_days=request.deadline_days,
        created_at=datetime.now(),
    )
    db.add(new_task)

    # Update workload slightly
    best_member.workload = min(100, best_member.workload + 5)
    db.commit()
    db.refresh(new_task)

    all_scores = [
        {
            "name": m.name,
            "score": round(sc, 2),
            "skills": parse_skills(m.skills),
            "workload": m.workload,
        }
        for m, sc, _ in scores
    ]

    return {
        "task": {
            "id": new_task.id,
            "title": new_task.title,
            "priority": new_task.priority,
            "complexity": new_task.complexity,
            "deadline_days": new_task.deadline_days,
        },
        "assigned_to": best_member.name,
        "assigned_role": best_member.role,
        "confidence": confidence,
        "reason": reasons,
        "backup": backup_member.name if backup_member else None,
        "all_scores": all_scores,
    }


# ---------------------------------------------------------------------------
# POST /api/tasks/split
# ---------------------------------------------------------------------------

@app.post("/api/tasks/split")
def split_task(request: TaskSplitRequest):
    subtasks = split_task_by_keyword(request.task_title)
    return {
        "task_title": request.task_title,
        "subtask_count": len(subtasks),
        "subtasks": subtasks,
        "total_estimated_hours": sum(s["estimated_hours"] for s in subtasks),
    }


# ---------------------------------------------------------------------------
# POST /api/tasks/parse
# ---------------------------------------------------------------------------

@app.post("/api/tasks/parse")
def parse_task(request: TaskParseRequest):
    result = parse_task_description(request.description)
    return {
        "description": request.description,
        **result,
    }


# ---------------------------------------------------------------------------
# GET /api/sprint
# ---------------------------------------------------------------------------

@app.get("/api/sprint")
def get_sprint(db: Session = Depends(get_db)):
    sprint = db.query(Sprint).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="No sprint found")

    days = parse_json_field(sprint.tasks)
    return {
        "sprint_id": sprint.id,
        "sprint_name": sprint.name,
        "start_date": sprint.start_date,
        "days": days,
        "total_days": len(days),
    }


# ---------------------------------------------------------------------------
# POST /api/sprint/generate
# ---------------------------------------------------------------------------

@app.post("/api/sprint/generate")
def generate_sprint(request: SprintGenerateRequest, db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()
    if not members:
        raise HTTPException(status_code=404, detail="No team members found")

    # Build subtask list with estimated hours
    all_subtasks = []
    for title in request.task_titles:
        subtasks = split_task_by_keyword(title)
        for s in subtasks:
            all_subtasks.append({"title": s["title"], "estimated_hours": s["estimated_hours"], "parent": title})

    # Greedy assignment: assign tasks to days respecting 8hr/day limit
    # Track daily hours per member
    member_daily_hours: Dict[str, List[float]] = {
        m.name: [0.0] * request.duration_days for m in members
    }
    member_list = [m.name for m in members]

    sprint_plan = [{"day": d + 1, "date": (datetime.now() + timedelta(days=d)).strftime("%Y-%m-%d"), "tasks": []}
                   for d in range(request.duration_days)]

    for subtask in all_subtasks:
        # Find the member with least total load
        best_day = None
        best_member_name = None
        min_hours = float("inf")

        for day_idx in range(request.duration_days):
            for m_name in member_list:
                current = member_daily_hours[m_name][day_idx]
                if current + subtask["estimated_hours"] <= 8.0:
                    if current < min_hours:
                        min_hours = current
                        best_day = day_idx
                        best_member_name = m_name

        if best_day is not None and best_member_name:
            member_daily_hours[best_member_name][best_day] += subtask["estimated_hours"]
            sprint_plan[best_day]["tasks"].append({
                "title": subtask["title"],
                "assignee": best_member_name,
                "estimated_hours": subtask["estimated_hours"],
                "parent_task": subtask.get("parent", ""),
            })

    return {
        "sprint_plan": sprint_plan,
        "total_tasks": sum(len(day["tasks"]) for day in sprint_plan),
        "duration_days": request.duration_days,
        "member_daily_loads": {
            name: [{"day": i + 1, "hours": h} for i, h in enumerate(hours)]
            for name, hours in member_daily_hours.items()
        },
    }


# ---------------------------------------------------------------------------
# GET /api/burnout
# ---------------------------------------------------------------------------

@app.get("/api/burnout")
def get_burnout(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    result = []
    for m in members:
        risk = get_risk_level(m.burnout_score)
        cognitive_load = round(
            (m.context_switches * 10 + m.meeting_load * 8 + (100 - m.focus_hours * 12)) / 3, 1
        )
        cognitive_load = max(0, min(100, cognitive_load))

        actions: List[str] = []
        if m.burnout_score >= 70:
            actions.append("Reduce task assignments by 30% immediately")
            actions.append("Block dedicated focus time - no meetings before 11AM")
            actions.append("Schedule 1:1 wellness check-in with manager")
        elif m.burnout_score >= 40:
            actions.append("Monitor workload - avoid adding new tasks this week")
            actions.append("Encourage async communication to reduce context switching")
            actions.append("Consider partial WFH to reduce commute stress")
        else:
            actions.append("Team member is healthy - maintain current pace")
            actions.append("Good candidate for stretch assignments")

        if m.meeting_load >= 5:
            actions.append(f"Too many meetings ({m.meeting_load}/day) - cancel or async-ify 2+")
        if m.context_switches >= 6:
            actions.append("High context switching - batch similar tasks together")

        result.append({
            "name": m.name,
            "role": m.role,
            "burnout_score": m.burnout_score,
            "risk_level": risk,
            "stress_score": m.stress_score,
            "focus_hours": m.focus_hours,
            "meeting_load": m.meeting_load,
            "context_switches": m.context_switches,
            "actions": actions,
            "cognitive_load": cognitive_load,
        })

    avg_burnout = round(sum(m.burnout_score for m in members) / len(members), 1) if members else 0

    return {
        "members": result,
        "avg_burnout": avg_burnout,
        "critical_count": sum(1 for r in result if r["risk_level"] == "critical"),
        "watch_count": sum(1 for r in result if r["risk_level"] == "watch"),
        "safe_count": sum(1 for r in result if r["risk_level"] == "safe"),
    }


# ---------------------------------------------------------------------------
# GET /api/wfh
# ---------------------------------------------------------------------------

@app.get("/api/wfh")
def get_wfh(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    result = []
    for m in members:
        score = compute_wfh_score(m)
        decision, recommended_days = wfh_decision_and_days(score)

        reasons: List[str] = []
        if m.deep_work_req >= 75:
            reasons.append(f"High deep work requirement ({m.deep_work_req}%) - WFH boosts focus")
        if m.commute_distance >= 30:
            reasons.append(f"Long commute ({m.commute_distance}km) saves significant time WFH")
        if m.collab_req >= 65:
            reasons.append(f"High collaboration need ({m.collab_req}%) - benefits from office days")
        if m.meeting_load >= 5:
            reasons.append(f"Many meetings ({m.meeting_load}/day) - office preferable for attendance")
        if m.burnout_score >= 70:
            reasons.append("High burnout - WFH reduces commute stress")
        if m.wfh_score >= 75:
            reasons.append("Historical WFH productivity is high")

        result.append({
            "name": m.name,
            "role": m.role,
            "wfh_score": score,
            "decision": decision,
            "recommended_days": recommended_days,
            "reasons": reasons,
            "commute_distance": m.commute_distance,
            "deep_work_req": m.deep_work_req,
            "collab_req": m.collab_req,
            "meeting_load": m.meeting_load,
            "wfh_productivity": m.wfh_productivity,
        })

    return {
        "members": result,
        "full_wfh_count": sum(1 for r in result if "Full" in r["decision"]),
        "partial_wfh_count": sum(1 for r in result if "Partial" in r["decision"]),
        "office_count": sum(1 for r in result if "Office" in r["decision"]),
    }


# ---------------------------------------------------------------------------
# GET /api/deadline
# ---------------------------------------------------------------------------

@app.get("/api/deadline")
def get_deadline(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    result = []
    for p in projects:
        remaining = p.tasks_total - p.tasks_done
        if p.velocity > 0:
            days_to_completion = round(remaining / p.velocity, 1)
        else:
            days_to_completion = 999

        if days_to_completion > p.deadline_days:
            recommendation = (
                f"HIGH RISK: At current velocity ({p.velocity} tasks/day), "
                f"project will miss deadline by {round(days_to_completion - p.deadline_days, 1)} days. "
                f"Consider increasing team capacity or reducing scope."
            )
        elif days_to_completion > p.deadline_days * 0.8:
            recommendation = (
                f"WATCH: On track but tight. {remaining} tasks remain and you have {p.deadline_days} days. "
                f"Maintain velocity of {p.velocity} tasks/day."
            )
        else:
            recommendation = (
                f"ON TRACK: {remaining} tasks in {p.deadline_days} days at {p.velocity} velocity. "
                f"Expected to finish {round(p.deadline_days - days_to_completion, 1)} days early."
            )

        result.append({
            "name": p.name,
            "deadline_days": p.deadline_days,
            "tasks_total": p.tasks_total,
            "tasks_done": p.tasks_done,
            "tasks_remaining": remaining,
            "velocity": p.velocity,
            "risk_score": p.risk_score,
            "health_score": p.health_score,
            "status": p.status,
            "days_to_completion": days_to_completion,
            "will_miss_deadline": days_to_completion > p.deadline_days,
            "recommendation": recommendation,
        })

    return {
        "projects": result,
        "high_risk_count": sum(1 for r in result if r["will_miss_deadline"]),
        "on_track_count": sum(1 for r in result if not r["will_miss_deadline"]),
    }


# ---------------------------------------------------------------------------
# POST /api/copilot
# ---------------------------------------------------------------------------

@app.post("/api/copilot")
def copilot(request: CopilotRequest, db: Session = Depends(get_db)):
    q = request.question.lower()
    members = db.query(TeamMember).all()
    projects = db.query(Project).all()
    tasks = db.query(Task).all()

    answer = ""
    context_used = ""

    # --- Deadline / Late / Delayed ---
    if any(w in q for w in ["delayed", "late", "deadline", "miss", "overdue", "behind"]):
        at_risk = [p for p in projects if p.status in ("at-risk", "critical")]
        if at_risk:
            p = sorted(at_risk, key=lambda x: x.risk_score, reverse=True)[0]
            remaining = p.tasks_total - p.tasks_done
            dtc = round(remaining / p.velocity, 1) if p.velocity > 0 else 999
            answer = (
                f"The most critical deadline risk is the **{p.name}** project (risk score: {p.risk_score}/100). "
                f"It has {remaining} tasks remaining and at {p.velocity} tasks/day, will take {dtc} days — "
                f"but the deadline is only {p.deadline_days} days away. "
                f"Recommend either fast-tracking with additional team members or reducing scope. "
                f"Additionally, the **Mobile App** project has only {p.deadline_days} days left with 22 tasks still pending."
            )
            context_used = f"Projects: {[p.name for p in at_risk]}"
        else:
            answer = "All projects are currently on track! No deadline risks detected at this time."
            context_used = "Projects data"

    # --- Burnout / Stressed ---
    elif any(w in q for w in ["burnout", "stressed", "stress", "overworked", "tired", "exhausted"]):
        critical = [m for m in members if m.burnout_score > 70]
        if critical:
            top = sorted(critical, key=lambda x: x.burnout_score, reverse=True)[0]
            answer = (
                f"**{top.name}** ({top.role}) is at highest burnout risk with a score of {top.burnout_score}/100 "
                f"and stress level of {top.stress_score}/100. "
                f"They're averaging {top.focus_hours}h of focus time/day but carrying {top.meeting_load} meetings "
                f"and {top.context_switches} context switches. "
                f"Immediate actions: reduce task load by 30%, block morning focus time, "
                f"and schedule a wellness 1:1 this week."
            )
            context_used = f"Burnout data for {top.name}"
        else:
            watch = [m for m in members if 40 <= m.burnout_score <= 70]
            if watch:
                names = ", ".join(m.name for m in watch)
                answer = (
                    f"No critical burnout cases, but {names} are in the 'watch' zone (40-70 burnout score). "
                    f"Monitor their workload and avoid adding new tasks this sprint."
                )
            else:
                answer = "Great news! The entire team has healthy burnout scores below 40. Keep up the good habits!"
            context_used = "Burnout scores for all members"

    # --- Who should / assign ---
    elif any(w in q for w in ["who should", "assign", "best person", "who can", "recommend"]):
        # Find lowest-load, highest-performance member
        best = sorted(members, key=lambda m: (m.workload - m.performance_rating))[0]
        answer = (
            f"Based on current team data, **{best.name}** ({best.role}) is the best candidate for new assignments. "
            f"They have {best.workload}% workload, {best.availability}h availability/day, "
            f"and a performance rating of {best.performance_rating}/100. "
            f"Skills include: {', '.join(parse_skills(best.skills))}. "
            f"For skill-specific needs, use the /api/tasks/assign endpoint with required_skills for AI-powered matching."
        )
        context_used = f"Team workload & performance data"

    # --- Sprint ---
    elif any(w in q for w in ["sprint", "iteration", "weekly", "plan"]):
        sprint = db.query(Sprint).first()
        total = len(tasks)
        done = sum(1 for t in tasks if t.status == "done")
        pct = round(done / total * 100, 1) if total > 0 else 0
        sprint_name = sprint.name if sprint else "Sprint 14"
        answer = (
            f"**{sprint_name}** is {pct}% complete ({done}/{total} tasks done). "
            f"The sprint spans 5 days with tasks distributed across all 5 team members. "
            f"Critical items include Payment API endpoints and Production Release by Kartik. "
            f"Use /api/sprint to see the full day-by-day breakdown."
        )
        context_used = "Sprint and task data"

    # --- WFH ---
    elif any(w in q for w in ["wfh", "work from home", "remote", "office", "hybrid"]):
        wfh_approved = [m for m in members if compute_wfh_score(m) > 70]
        partial = [m for m in members if 50 <= compute_wfh_score(m) <= 70]
        office = [m for m in members if compute_wfh_score(m) < 50]
        answer = (
            f"Current WFH analysis: **{len(wfh_approved)} members approved for Full WFH** "
            f"({', '.join(m.name for m in wfh_approved)}), "
            f"**{len(partial)} on Partial WFH** ({', '.join(m.name for m in partial)}), "
            f"and **{len(office)} should come to office** ({', '.join(m.name for m in office)}). "
            f"Riya has the highest WFH score due to 40km commute and 90% deep-work requirement. "
            f"See /api/wfh for full recommendations and suggested days."
        )
        context_used = "WFH scores for all members"

    # --- Productivity / Performance ---
    elif any(w in q for w in ["productivity", "performance", "top performer", "best", "worst", "struggling"]):
        top = max(members, key=lambda m: m.productivity_score)
        bottom = min(members, key=lambda m: m.productivity_score)
        answer = (
            f"**Top performer: {top.name}** ({top.role}) with productivity score {top.productivity_score}/100, "
            f"consistency {top.consistency_score}, focus {top.focus_score}, and delivery {top.delivery_score}. "
            f"**Needs attention: {bottom.name}** ({bottom.role}) at {bottom.productivity_score}/100 — "
            f"primarily affected by high meeting load ({bottom.meeting_load}/day) and {bottom.context_switches} context switches. "
            f"Reducing meeting commitments could improve their score significantly."
        )
        context_used = f"Productivity scores: {top.name} ({top.productivity_score}), {bottom.name} ({bottom.productivity_score})"

    # --- Team / members ---
    elif any(w in q for w in ["team", "members", "people", "staff", "headcount"]):
        avg_workload = round(sum(m.workload for m in members) / len(members), 1)
        avg_perf = round(sum(m.performance_rating for m in members) / len(members), 1)
        names = ", ".join(m.name for m in members)
        answer = (
            f"The ORKA team has **{len(members)} members**: {names}. "
            f"Average workload is {avg_workload}% and average performance rating is {avg_perf}/100. "
            f"Riya leads in performance ({max(m.performance_rating for m in members)}/100) while "
            f"Aman currently has the highest workload at 70% and is showing burnout signals."
        )
        context_used = "Team member summary data"

    # --- Skills / gap ---
    elif any(w in q for w in ["skill", "gap", "missing", "hire", "train"]):
        all_skills = set()
        for m in members:
            all_skills.update(parse_skills(m.skills))
        project_needs = ["AI", "Backend", "Cloud", "React", "ML", "Security", "Mobile", "Kubernetes"]
        missing = [s for s in project_needs if s not in all_skills]
        answer = (
            f"The team collectively has skills in: {', '.join(sorted(all_skills))}. "
            f"Based on project requirements, gaps include: **{', '.join(missing) if missing else 'None identified'}**. "
            f"Mobile development is a notable gap — the Mobile App project is at critical risk partly due to this. "
            f"Recommend hiring a React Native developer or training Aman on mobile patterns."
        )
        context_used = f"Team skills: {sorted(all_skills)}"

    # --- Project health ---
    elif any(w in q for w in ["project", "health", "status", "risk"]):
        critical = [p for p in projects if p.status == "critical"]
        healthy = [p for p in projects if p.status == "healthy"]
        answer = (
            f"Project health overview: **{len(healthy)} healthy** ({', '.join(p.name for p in healthy)}), "
            f"**{len([p for p in projects if p.status == 'at-risk'])} at-risk**, "
            f"**{len(critical)} critical** ({', '.join(p.name for p in critical)}). "
            f"The Mobile App is most concerning with only 22 health score and 3 days remaining. "
            f"Payment Module and ML Pipeline are also at-risk and need immediate attention."
        )
        context_used = "Project health and status data"

    # --- Default: general team summary ---
    else:
        avg_perf = round(sum(m.performance_rating for m in members) / len(members), 1)
        avg_burnout = round(sum(m.burnout_score for m in members) / len(members), 1)
        critical_projects = sum(1 for p in projects if p.status == "critical")
        answer = (
            f"Here's your ORKA team summary: **{len(members)} team members** averaging {avg_perf}/100 performance "
            f"with {avg_burnout}/100 average burnout score. "
            f"There are {critical_projects} critical project(s) that need attention right now. "
            f"**Aman** is showing burnout signals (85/100) while **Riya** is the top performer at 95/100. "
            f"Ask me about specific topics: burnout, WFH, sprint, deadlines, productivity, or who to assign tasks to."
        )
        context_used = "General team, project, and task data"

    return {
        "question": request.question,
        "answer": answer,
        "context_used": context_used,
        "timestamp": datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# GET /api/team
# ---------------------------------------------------------------------------

@app.get("/api/team")
def get_team(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    result = []
    for m in members:
        result.append({
            "id": m.id,
            "name": m.name,
            "role": m.role,
            "skills": parse_skills(m.skills),
            "workload": m.workload,
            "availability": m.availability,
            "performance_rating": m.performance_rating,
            "stress_score": m.stress_score,
            "focus_hours": m.focus_hours,
            "meeting_load": m.meeting_load,
            "context_switches": m.context_switches,
            "wfh_score": m.wfh_score,
            "commute_distance": m.commute_distance,
            "deep_work_req": m.deep_work_req,
            "collab_req": m.collab_req,
            "burnout_score": m.burnout_score,
            "productivity_score": m.productivity_score,
            "consistency_score": m.consistency_score,
            "focus_score": m.focus_score,
            "delivery_score": m.delivery_score,
            "best_hours": m.best_hours,
            "preferred_task_type": m.preferred_task_type,
            "burnout_triggers": parse_json_field(m.burnout_triggers),
            "wfh_productivity": m.wfh_productivity,
        })

    avg_workload = round(sum(m.workload for m in members) / len(members), 1) if members else 0
    avg_performance = round(sum(m.performance_rating for m in members) / len(members), 1) if members else 0

    return {
        "members": result,
        "total_count": len(members),
        "avg_workload": avg_workload,
        "avg_performance": avg_performance,
    }


# ---------------------------------------------------------------------------
# POST /api/team/build
# ---------------------------------------------------------------------------

@app.post("/api/team/build")
def build_team(request: TeamBuildRequest, db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    suggested_team = []
    covered_skills: set = set()

    # Score each member by how many required skills they have
    scored = []
    for m in members:
        m_skills = parse_skills(m.skills)
        match = [s for s in request.required_skills if s.lower() in [x.lower() for x in m_skills]]
        if match:
            scored.append((m, match))

    scored.sort(key=lambda x: (len(x[1]), -x[0].workload), reverse=True)

    for m, match in scored:
        new_skills = [s for s in match if s not in covered_skills]
        if new_skills:
            covered_skills.update(new_skills)
            reason = f"Covers {', '.join(match)} — {m.workload}% workload, {m.performance_rating}/100 perf"
            suggested_team.append({
                "name": m.name,
                "role": m.role,
                "matched_skills": match,
                "match_reason": reason,
                "workload": m.workload,
                "performance_rating": m.performance_rating,
            })

    missing_skills = [s for s in request.required_skills if s not in covered_skills]

    hire_recommendations = []
    for skill in missing_skills:
        hire_recommendations.append({
            "skill": skill,
            "hire_or_train": "hire" if skill in ["Mobile", "Kubernetes", "AI", "Blockchain"] else "train",
            "reason": (
                f"No current team member covers {skill}. "
                f"{'Consider hiring a specialist for this critical capability.' if skill in ['Mobile', 'AI'] else 'An existing member could be upskilled with training.'}"
            ),
        })

    return {
        "project_type": request.project_type,
        "required_skills": request.required_skills,
        "suggested_team": suggested_team,
        "team_size": len(suggested_team),
        "missing_skills": missing_skills,
        "hire_recommendations": hire_recommendations,
    }


# ---------------------------------------------------------------------------
# GET /api/productivity
# ---------------------------------------------------------------------------

@app.get("/api/productivity")
def get_productivity(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    # Compute overall score and rank
    scored = []
    for m in members:
        overall = round(
            (m.productivity_score + m.consistency_score + m.focus_score + m.delivery_score) / 4, 1
        )
        scored.append((m, overall))

    scored.sort(key=lambda x: x[1], reverse=True)

    result = []
    for rank, (m, overall) in enumerate(scored, start=1):
        # Simple trend: if burnout < 50 and workload < 60, trending up
        if m.burnout_score < 50 and m.workload < 60:
            trend = "up"
        elif m.burnout_score > 70 or m.workload > 75:
            trend = "down"
        else:
            trend = "stable"

        result.append({
            "name": m.name,
            "role": m.role,
            "productivity_score": m.productivity_score,
            "consistency_score": m.consistency_score,
            "focus_score": m.focus_score,
            "delivery_score": m.delivery_score,
            "overall_score": overall,
            "overall_rank": rank,
            "trend": trend,
        })

    avg_productivity = round(sum(m.productivity_score for m in members) / len(members), 1) if members else 0

    return {
        "members": result,
        "avg_productivity": avg_productivity,
        "top_performer": result[0]["name"] if result else None,
        "needs_support": result[-1]["name"] if result else None,
    }


# ---------------------------------------------------------------------------
# GET /api/skill-gap
# ---------------------------------------------------------------------------

@app.get("/api/skill-gap")
def get_skill_gap(
    project_skills: Optional[str] = Query(
        default=None,
        description="Comma-separated skills needed for the project",
    ),
    db: Session = Depends(get_db),
):
    if project_skills:
        project_needs = [s.strip() for s in project_skills.split(",")]
    else:
        project_needs = ["AI", "Backend", "Cloud", "React", "ML", "Security"]

    members = db.query(TeamMember).all()

    team_skills: set = set()
    for m in members:
        team_skills.update(parse_skills(m.skills))

    missing = [s for s in project_needs if s not in team_skills]
    covered = [s for s in project_needs if s in team_skills]

    recommendations = []
    for skill in missing:
        is_hire = skill in ["Mobile", "Kubernetes", "AI", "Blockchain", "Swift", "Kotlin"]
        recommendations.append({
            "skill": skill,
            "hire_or_train": "hire" if is_hire else "train",
            "reason": (
                f"'{skill}' is not present in the team. "
                f"{'This is a specialized domain — recommend hiring.' if is_hire else 'An existing team member could be trained within 1-2 months.'}"
            ),
        })

    skill_coverage = []
    for skill in project_needs:
        holders = [m.name for m in members if skill.lower() in [s.lower() for s in parse_skills(m.skills)]]
        skill_coverage.append({
            "skill": skill,
            "covered": skill in team_skills,
            "covered_by": holders,
        })

    return {
        "project_needs": project_needs,
        "team_has": list(team_skills),
        "covered": covered,
        "missing": missing,
        "skill_coverage": skill_coverage,
        "coverage_rate": round(len(covered) / len(project_needs) * 100, 1) if project_needs else 100,
        "recommendations": recommendations,
    }


# ---------------------------------------------------------------------------
# GET /api/health-score
# ---------------------------------------------------------------------------

@app.get("/api/health-score")
def get_health_score(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    result = [
        {
            "name": p.name,
            "health_score": p.health_score,
            "status": p.status,
            "tasks_done": p.tasks_done,
            "tasks_total": p.tasks_total,
            "completion_rate": round(p.tasks_done / p.tasks_total * 100, 1) if p.tasks_total else 0,
            "deadline_days": p.deadline_days,
            "risk_score": p.risk_score,
            "velocity": p.velocity,
        }
        for p in projects
    ]

    overall_health = round(sum(p.health_score for p in projects) / len(projects), 1) if projects else 0

    return {
        "projects": result,
        "overall_health": overall_health,
        "healthy_count": sum(1 for p in projects if p.status == "healthy"),
        "at_risk_count": sum(1 for p in projects if p.status == "at-risk"),
        "critical_count": sum(1 for p in projects if p.status == "critical"),
    }


# ---------------------------------------------------------------------------
# POST /api/rebalance
# ---------------------------------------------------------------------------

@app.post("/api/rebalance")
def rebalance_workload(request: RebalanceRequest, db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()
    tasks = db.query(Task).filter(Task.assigned_to == request.trigger_member, Task.status != "done").all()

    trigger = next((m for m in members if m.name.lower() == request.trigger_member.lower()), None)
    if not trigger:
        raise HTTPException(status_code=404, detail=f"Member '{request.trigger_member}' not found")

    if trigger.workload < 70:
        return {
            "message": f"{trigger.name} is not overloaded (workload: {trigger.workload}%). No rebalancing needed.",
            "moved_tasks": [],
            "new_workloads": [],
        }

    # Find underloaded members
    available = sorted(
        [m for m in members if m.name != trigger.name and m.workload < 60],
        key=lambda m: m.workload,
    )

    moved_tasks = []
    old_workloads = {m.name: m.workload for m in members}

    # Move up to 2 tasks
    tasks_to_move = [t for t in tasks if t.priority in ("medium", "low")][:2]

    for i, task in enumerate(tasks_to_move):
        if i >= len(available):
            break
        recipient = available[i]
        old_assignee = task.assigned_to
        task.assigned_to = recipient.name
        trigger.workload = max(0, trigger.workload - 10)
        recipient.workload = min(100, recipient.workload + 10)
        moved_tasks.append({
            "task": task.title,
            "from": old_assignee,
            "to": recipient.name,
            "reason": (
                f"{old_assignee} is overloaded at {old_workloads[old_assignee]}% workload. "
                f"{recipient.name} has capacity at {old_workloads[recipient.name]}%."
            ),
        })

    db.commit()

    new_workloads = [
        {
            "name": m.name,
            "old_workload": old_workloads[m.name],
            "new_workload": m.workload,
            "change": m.workload - old_workloads[m.name],
        }
        for m in members
    ]

    return {
        "trigger_member": request.trigger_member,
        "moved_tasks": moved_tasks,
        "new_workloads": new_workloads,
        "message": f"Rebalanced {len(moved_tasks)} task(s) from {request.trigger_member}",
    }


# ---------------------------------------------------------------------------
# GET /api/work-dna
# ---------------------------------------------------------------------------

# Hardcoded rich Work DNA for each member
WORK_DNA_DISPLAY = {
    "Kartik": {
        "best_hours": "9AM–12PM",
        "preferred_tasks": "API design, system architecture, security reviews, backend optimisation",
        "collab_style": "Async-first; prefers GitHub comments over Slack; schedules sync calls when needed",
        "coding_speed": "Methodical — high-quality code, slightly lower velocity, rarely introduces bugs",
        "meeting_tolerance": "Low — max 2 meetings/day; anything more tanks focus",
        "focus_pattern": "Deep 3-hour blocks (9–12) → lunch break → lighter review tasks afternoon",
        "burnout_triggers": "Context switching, unclear requirements, review bottlenecks",
        "wfh_productivity": 78,
        "dna_summary": (
            "Kartik is a deep-work specialist who excels in complex backend tasks. "
            "He needs protected focus windows and minimal interruptions. "
            "Best assigned to high-complexity, high-stakes tasks in the morning slot."
        ),
    },
    "Riya": {
        "best_hours": "10AM–2PM",
        "preferred_tasks": "Model training, data analysis, research spikes, feature engineering",
        "collab_style": "Solo deep worker; shares findings via detailed written docs; async collaboration",
        "coding_speed": "Experimental — iterates rapidly on models, runs parallel experiments",
        "meeting_tolerance": "Very low — max 1 meeting/day; prefers written async updates",
        "focus_pattern": "4-hour uninterrupted focus sessions; does not respond to Slack during focus",
        "burnout_triggers": "Too many meetings, rushed ML deadlines, noisy open offices",
        "wfh_productivity": 92,
        "dna_summary": (
            "Riya is the team's highest-focus individual. She thrives on WFH days with 4-hour deep work sessions. "
            "Never schedule her for back-to-back meetings — her best work happens with zero interruptions. "
            "Top candidate for complex ML research tasks."
        ),
    },
    "Aman": {
        "best_hours": "2PM–6PM",
        "preferred_tasks": "UI component building, design implementation, user flow prototyping",
        "collab_style": "Highly collaborative — loves pair programming and design critique sessions",
        "coding_speed": "Fast on familiar React/Next.js patterns; slower when venturing into new frameworks",
        "meeting_tolerance": "High — enjoys design syncs and stakeholder demos (up to 5/day)",
        "focus_pattern": "Short 1-hour focused bursts; frequent check-ins with designers and PMs",
        "burnout_triggers": "Too many context switches, unclear or late designs, working in isolation",
        "wfh_productivity": 58,
        "dna_summary": (
            "Aman is a collaborative creative who performs best in the afternoon. "
            "He currently has the highest burnout risk and needs workload relief immediately. "
            "Prefers in-office or hybrid for design collaboration; WFH reduces his productivity."
        ),
    },
    "Priya": {
        "best_hours": "8AM–11AM",
        "preferred_tasks": "Infrastructure setup, automation scripting, monitoring & alerting, cloud architecture",
        "collab_style": "Documentation-driven; writes runbooks and shares via Confluence; minimal verbal sync",
        "coding_speed": "Steady and reliable — strong automation focus, scripts everything repetitive",
        "meeting_tolerance": "Moderate — up to 3 focused meetings/day (standups, infra reviews)",
        "focus_pattern": "2-3 hour focused infrastructure blocks; checks alerts and dashboards between",
        "burnout_triggers": "On-call incidents at night, manual repetitive tasks, poor documentation from teammates",
        "wfh_productivity": 80,
        "dna_summary": (
            "Priya is the team's reliability anchor — most productive in early morning deep work. "
            "She automates everything and hates manual toil. "
            "WFH suits her well; she's most effective when given clear infrastructure goals with minimal ambiguity."
        ),
    },
    "Hitendra": {
        "best_hours": "11AM–3PM",
        "preferred_tasks": "Full-stack feature delivery, API+UI integration, database schema work",
        "collab_style": "Flexible bridge — communicates well with both frontend and backend teams",
        "coding_speed": "Good velocity across the full stack; adapts to changing requirements",
        "meeting_tolerance": "Moderate-high — handles up to 4 meetings/day including cross-team syncs",
        "focus_pattern": "2-hour coding blocks followed by team collaboration time in afternoons",
        "burnout_triggers": "Scope creep, context switching between too many projects, accumulating tech debt",
        "wfh_productivity": 68,
        "dna_summary": (
            "Hitendra is the team's versatile glue — equally comfortable on frontend and backend. "
            "He performs best mid-day and can handle cross-functional coordination. "
            "Currently showing burnout signals (71/100) — avoid adding large new tasks this sprint."
        ),
    },
}


@app.get("/api/work-dna")
def get_work_dna(db: Session = Depends(get_db)):
    members = db.query(TeamMember).all()

    result = []
    for m in members:
        dna = WORK_DNA_DISPLAY.get(m.name, {})
        result.append({
            "name": m.name,
            "role": m.role,
            "best_hours": dna.get("best_hours", m.best_hours),
            "preferred_tasks": dna.get("preferred_tasks", m.preferred_task_type),
            "collab_style": dna.get("collab_style", ""),
            "coding_speed": dna.get("coding_speed", ""),
            "meeting_tolerance": dna.get("meeting_tolerance", ""),
            "focus_pattern": dna.get("focus_pattern", ""),
            "burnout_triggers": dna.get("burnout_triggers", ""),
            "wfh_productivity": dna.get("wfh_productivity", m.wfh_productivity),
            "dna_summary": dna.get("dna_summary", ""),
        })

    return {"members": result}


# ---------------------------------------------------------------------------
# GET /api/meetings
# ---------------------------------------------------------------------------

MEETINGS_DATA = [
    {
        "id": 1,
        "title": "Daily Status Update — All Hands",
        "attendees": ["Kartik", "Riya", "Aman", "Priya", "Hitendra"],
        "duration_min": 60,
        "verdict": "unnecessary",
        "reason": (
            "A 60-minute all-hands daily standup with 5 engineers is costing 300 engineer-minutes/day (25 hours/week). "
            "This information can be fully captured in a 5-minute async Slack thread. "
            "Convert to written async updates — save 24+ hours of focus time per week."
        ),
        "converted_tasks": [
            "Create daily async standup Slack channel with status update template",
            "Set up automated GitHub PR digest to replace manual updates",
            "Schedule weekly 30-min sync for blockers only",
        ],
    },
    {
        "id": 2,
        "title": "Payment Module Architecture Review",
        "attendees": ["Kartik", "Hitendra", "Priya"],
        "duration_min": 90,
        "verdict": "necessary",
        "reason": (
            "The Payment Module is at 82/100 risk with a 5-day deadline. "
            "Architecture decisions require synchronous alignment between Kartik (backend), "
            "Hitendra (integration), and Priya (infra/deployment). "
            "This meeting prevents expensive rework later."
        ),
        "converted_tasks": [],
    },
    {
        "id": 3,
        "title": "Bi-Weekly Sprint Retrospective Prep",
        "attendees": ["Kartik", "Aman", "Hitendra"],
        "duration_min": 45,
        "verdict": "unnecessary",
        "reason": (
            "A 45-minute prep meeting for a retrospective adds ceremony without value. "
            "Retrospective notes can be crowd-sourced asynchronously via a shared doc. "
            "Team members can add bullet points in 5 minutes at their own pace."
        ),
        "converted_tasks": [
            "Create shared retro doc in Notion — team adds items async by EOD Thursday",
            "Assign Aman to summarize top 3 themes before Friday retro",
        ],
    },
    {
        "id": 4,
        "title": "ML Pipeline Production Deployment Decision",
        "attendees": ["Riya", "Priya", "Kartik"],
        "duration_min": 60,
        "verdict": "necessary",
        "reason": (
            "The ML Pipeline is at 71/100 risk with 7 days left. "
            "Deployment strategy, rollback plans, and model versioning require a synchronous decision "
            "between Riya (ML), Priya (DevOps), and Kartik (API integration). "
            "Async communication would introduce ambiguity on a high-stakes production rollout."
        ),
        "converted_tasks": [],
    },
]


@app.get("/api/meetings")
def get_meetings():
    unnecessary = sum(1 for m in MEETINGS_DATA if m["verdict"] == "unnecessary")
    necessary = sum(1 for m in MEETINGS_DATA if m["verdict"] == "necessary")
    total_mins = sum(m["duration_min"] for m in MEETINGS_DATA)
    unnecessary_mins = sum(m["duration_min"] for m in MEETINGS_DATA if m["verdict"] == "unnecessary")

    return {
        "meetings": MEETINGS_DATA,
        "total_count": len(MEETINGS_DATA),
        "unnecessary_count": unnecessary,
        "necessary_count": necessary,
        "total_minutes": total_mins,
        "wasted_minutes": unnecessary_mins,
        "wasted_hours_per_week": round(unnecessary_mins / 60, 1),
        "focus_hours_saved": round(unnecessary_mins * len(MEETINGS_DATA) / 60 / len(MEETINGS_DATA), 1),
    }


# ---------------------------------------------------------------------------
# Root health check
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "ORKA v2 API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)