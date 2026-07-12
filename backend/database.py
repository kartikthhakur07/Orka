"""
ORKA v2 - Database configuration and seed data
SQLite via SQLAlchemy
"""

import json
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from model import Base, TeamMember, Task, Project, Sprint, WorkDNA

DATABASE_URL = "sqlite:///./orka.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# Seed Data
# ---------------------------------------------------------------------------

TEAM_SEED = [
    {
        "name": "Kartik",
        "role": "Backend Engineer",
        "skills": json.dumps(["Backend", "Python", "API", "Security", "JWT"]),
        "workload": 45,
        "availability": 5,
        "performance_rating": 92,
        "stress_score": 65,
        "focus_hours": 6,
        "meeting_load": 3,
        "context_switches": 4,
        "wfh_score": 70,
        "commute_distance": 25,
        "deep_work_req": 80,
        "collab_req": 40,
        "burnout_score": 65,
        "productivity_score": 89,
        "consistency_score": 95,
        "focus_score": 84,
        "delivery_score": 91,
        "best_hours": "9AM-12PM",
        "preferred_task_type": "Deep Work",
        "burnout_triggers": json.dumps(["context switching", "unclear requirements"]),
        "wfh_productivity": 78,
    },
    {
        "name": "Riya",
        "role": "ML Engineer",
        "skills": json.dumps(["Python", "ML", "AI", "TensorFlow", "Data"]),
        "workload": 30,
        "availability": 7,
        "performance_rating": 95,
        "stress_score": 35,
        "focus_hours": 7,
        "meeting_load": 2,
        "context_switches": 2,
        "wfh_score": 85,
        "commute_distance": 40,
        "deep_work_req": 90,
        "collab_req": 30,
        "burnout_score": 28,
        "productivity_score": 93,
        "consistency_score": 88,
        "focus_score": 96,
        "delivery_score": 94,
        "best_hours": "10AM-2PM",
        "preferred_task_type": "Research",
        "burnout_triggers": json.dumps(["too many meetings", "rushed deadlines"]),
        "wfh_productivity": 92,
    },
    {
        "name": "Aman",
        "role": "Frontend Developer",
        "skills": json.dumps(["React", "UI", "Next.js", "CSS", "TypeScript"]),
        "workload": 70,
        "availability": 3,
        "performance_rating": 78,
        "stress_score": 82,
        "focus_hours": 4,
        "meeting_load": 6,
        "context_switches": 8,
        "wfh_score": 55,
        "commute_distance": 10,
        "deep_work_req": 60,
        "collab_req": 70,
        "burnout_score": 85,
        "productivity_score": 72,
        "consistency_score": 68,
        "focus_score": 61,
        "delivery_score": 75,
        "best_hours": "2PM-6PM",
        "preferred_task_type": "Collaborative",
        "burnout_triggers": json.dumps(["high meeting load", "context switches", "unclear designs"]),
        "wfh_productivity": 58,
    },
    {
        "name": "Priya",
        "role": "DevOps Engineer",
        "skills": json.dumps(["DevOps", "Cloud", "AWS", "Docker", "CI/CD"]),
        "workload": 55,
        "availability": 5,
        "performance_rating": 88,
        "stress_score": 55,
        "focus_hours": 6,
        "meeting_load": 4,
        "context_switches": 5,
        "wfh_score": 75,
        "commute_distance": 30,
        "deep_work_req": 75,
        "collab_req": 50,
        "burnout_score": 52,
        "productivity_score": 85,
        "consistency_score": 82,
        "focus_score": 79,
        "delivery_score": 88,
        "best_hours": "8AM-11AM",
        "preferred_task_type": "Infrastructure",
        "burnout_triggers": json.dumps(["on-call incidents", "manual repetitive tasks"]),
        "wfh_productivity": 80,
    },
    {
        "name": "Hitendra",
        "role": "Full Stack",
        "skills": json.dumps(["Backend", "React", "Node.js", "Database", "API"]),
        "workload": 60,
        "availability": 4,
        "performance_rating": 85,
        "stress_score": 75,
        "focus_hours": 5,
        "meeting_load": 5,
        "context_switches": 6,
        "wfh_score": 62,
        "commute_distance": 20,
        "deep_work_req": 70,
        "collab_req": 60,
        "burnout_score": 71,
        "productivity_score": 81,
        "consistency_score": 79,
        "focus_score": 74,
        "delivery_score": 83,
        "best_hours": "11AM-3PM",
        "preferred_task_type": "Full Stack Features",
        "burnout_triggers": json.dumps(["scope creep", "context switching", "tech debt"]),
        "wfh_productivity": 68,
    },
]

PROJECTS_SEED = [
    {
        "name": "Payment Module",
        "deadline_days": 5,
        "tasks_total": 20,
        "tasks_done": 12,
        "velocity": 1.5,
        "risk_score": 82,
        "health_score": 38,
        "status": "at-risk",
    },
    {
        "name": "User Auth System",
        "deadline_days": 10,
        "tasks_total": 15,
        "tasks_done": 13,
        "velocity": 2.0,
        "risk_score": 15,
        "health_score": 92,
        "status": "healthy",
    },
    {
        "name": "ML Pipeline",
        "deadline_days": 7,
        "tasks_total": 25,
        "tasks_done": 10,
        "velocity": 1.2,
        "risk_score": 71,
        "health_score": 45,
        "status": "at-risk",
    },
    {
        "name": "API Gateway",
        "deadline_days": 14,
        "tasks_total": 12,
        "tasks_done": 9,
        "velocity": 1.8,
        "risk_score": 25,
        "health_score": 87,
        "status": "healthy",
    },
    {
        "name": "Mobile App",
        "deadline_days": 3,
        "tasks_total": 30,
        "tasks_done": 8,
        "velocity": 0.8,
        "risk_score": 95,
        "health_score": 22,
        "status": "critical",
    },
]

TASKS_SEED = [
    {
        "title": "Implement JWT Authentication",
        "required_skills": json.dumps(["Backend", "JWT", "Security"]),
        "priority": "high",
        "status": "done",
        "assigned_to": "Kartik",
        "assignment_score": 94.5,
        "confidence": 94,
        "estimated_hours": 6,
        "complexity": 7,
        "deadline_days": 3,
    },
    {
        "title": "Design ML Model Pipeline",
        "required_skills": json.dumps(["ML", "Python", "TensorFlow"]),
        "priority": "high",
        "status": "in-progress",
        "assigned_to": "Riya",
        "assignment_score": 97.0,
        "confidence": 97,
        "estimated_hours": 8,
        "complexity": 9,
        "deadline_days": 5,
    },
    {
        "title": "Build Dashboard UI",
        "required_skills": json.dumps(["React", "TypeScript", "CSS"]),
        "priority": "medium",
        "status": "in-progress",
        "assigned_to": "Aman",
        "assignment_score": 82.0,
        "confidence": 82,
        "estimated_hours": 5,
        "complexity": 5,
        "deadline_days": 7,
    },
    {
        "title": "Setup CI/CD Pipeline",
        "required_skills": json.dumps(["DevOps", "Docker", "CI/CD"]),
        "priority": "high",
        "status": "done",
        "assigned_to": "Priya",
        "assignment_score": 91.0,
        "confidence": 91,
        "estimated_hours": 4,
        "complexity": 6,
        "deadline_days": 4,
    },
    {
        "title": "API Integration Testing",
        "required_skills": json.dumps(["Backend", "API", "Python"]),
        "priority": "medium",
        "status": "todo",
        "assigned_to": "Hitendra",
        "assignment_score": 85.0,
        "confidence": 85,
        "estimated_hours": 3,
        "complexity": 4,
        "deadline_days": 6,
    },
    {
        "title": "Payment Gateway Integration",
        "required_skills": json.dumps(["Backend", "API", "Security"]),
        "priority": "critical",
        "status": "in-progress",
        "assigned_to": "Kartik",
        "assignment_score": 91.0,
        "confidence": 91,
        "estimated_hours": 7,
        "complexity": 8,
        "deadline_days": 2,
    },
    {
        "title": "Data Preprocessing Module",
        "required_skills": json.dumps(["Python", "Data", "ML"]),
        "priority": "high",
        "status": "todo",
        "assigned_to": "Riya",
        "assignment_score": 96.0,
        "confidence": 96,
        "estimated_hours": 5,
        "complexity": 7,
        "deadline_days": 4,
    },
    {
        "title": "AWS Infrastructure Setup",
        "required_skills": json.dumps(["Cloud", "AWS", "DevOps"]),
        "priority": "high",
        "status": "done",
        "assigned_to": "Priya",
        "assignment_score": 93.0,
        "confidence": 93,
        "estimated_hours": 6,
        "complexity": 7,
        "deadline_days": 5,
    },
]

SPRINT_SEED = {
    "name": "Sprint 14 - Q3 Delivery",
    "start_date": datetime.now().strftime("%Y-%m-%d"),
    "tasks": json.dumps([
        # Day 1
        {"day": 1, "date": (datetime.now()).strftime("%Y-%m-%d"), "tasks": [
            {"title": "JWT Auth Setup", "assignee": "Kartik", "hours": 3, "priority": "high"},
            {"title": "ML Model Training", "assignee": "Riya", "hours": 4, "priority": "high"},
            {"title": "Dashboard Layout", "assignee": "Aman", "hours": 4, "priority": "medium"},
            {"title": "Docker Setup", "assignee": "Priya", "hours": 3, "priority": "high"},
            {"title": "DB Schema Design", "assignee": "Hitendra", "hours": 3, "priority": "medium"},
        ]},
        # Day 2
        {"day": 2, "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), "tasks": [
            {"title": "Payment API Endpoints", "assignee": "Kartik", "hours": 5, "priority": "critical"},
            {"title": "Feature Engineering", "assignee": "Riya", "hours": 6, "priority": "high"},
            {"title": "Component Library", "assignee": "Aman", "hours": 4, "priority": "medium"},
            {"title": "CI/CD Pipeline", "assignee": "Priya", "hours": 5, "priority": "high"},
            {"title": "REST API Integration", "assignee": "Hitendra", "hours": 4, "priority": "medium"},
        ]},
        # Day 3
        {"day": 3, "date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "tasks": [
            {"title": "Security Middleware", "assignee": "Kartik", "hours": 4, "priority": "high"},
            {"title": "Model Evaluation", "assignee": "Riya", "hours": 5, "priority": "high"},
            {"title": "Responsive Design", "assignee": "Aman", "hours": 5, "priority": "medium"},
            {"title": "AWS Deployment", "assignee": "Priya", "hours": 4, "priority": "high"},
            {"title": "Frontend-Backend Integration", "assignee": "Hitendra", "hours": 5, "priority": "high"},
        ]},
        # Day 4
        {"day": 4, "date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"), "tasks": [
            {"title": "API Testing & Docs", "assignee": "Kartik", "hours": 3, "priority": "medium"},
            {"title": "Pipeline Optimization", "assignee": "Riya", "hours": 4, "priority": "medium"},
            {"title": "UI Testing", "assignee": "Aman", "hours": 3, "priority": "medium"},
            {"title": "Monitoring Setup", "assignee": "Priya", "hours": 3, "priority": "medium"},
            {"title": "Bug Fixes", "assignee": "Hitendra", "hours": 4, "priority": "high"},
        ]},
        # Day 5
        {"day": 5, "date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"), "tasks": [
            {"title": "Production Release", "assignee": "Kartik", "hours": 2, "priority": "critical"},
            {"title": "Model Deployment", "assignee": "Riya", "hours": 3, "priority": "high"},
            {"title": "Final UI Polish", "assignee": "Aman", "hours": 4, "priority": "medium"},
            {"title": "Load Testing", "assignee": "Priya", "hours": 4, "priority": "high"},
            {"title": "End-to-End Testing", "assignee": "Hitendra", "hours": 5, "priority": "high"},
        ]},
    ]),
}

WORK_DNA_SEED = [
    {
        "member_id": 1,
        "best_hours": "9AM-12PM",
        "preferred_tasks": "API design, system architecture, security reviews",
        "collab_style": "Async-first, prefers written communication",
        "coding_speed": "Methodical - high quality, lower velocity",
        "meeting_tolerance": "Low - max 2 meetings/day",
        "focus_pattern": "Deep 3-hour blocks with 30-min breaks",
        "burnout_triggers": "Context switching, unclear requirements, too many reviews",
        "wfh_productivity": 78,
        "learning_curve": "Fast adopter of new security frameworks",
    },
    {
        "member_id": 2,
        "best_hours": "10AM-2PM",
        "preferred_tasks": "Model training, data analysis, research spikes",
        "collab_style": "Independent deep worker, async collaboration",
        "coding_speed": "Experimental - iterates quickly on models",
        "meeting_tolerance": "Very Low - max 1 meeting/day",
        "focus_pattern": "4-hour uninterrupted focus sessions",
        "burnout_triggers": "Too many meetings, rushed deadlines, noisy environments",
        "wfh_productivity": 92,
        "learning_curve": "Fast learner, always exploring new ML papers",
    },
    {
        "member_id": 3,
        "best_hours": "2PM-6PM",
        "preferred_tasks": "UI components, design implementation, user flows",
        "collab_style": "Collaborative, thrives in pair programming",
        "coding_speed": "Fast on familiar tech, slower on new patterns",
        "meeting_tolerance": "High - enjoys design discussions",
        "focus_pattern": "Short 1-hour focused bursts, frequent check-ins",
        "burnout_triggers": "Too many context switches, unclear designs, isolation",
        "wfh_productivity": 58,
        "learning_curve": "Moderate - needs structured onboarding for new frameworks",
    },
    {
        "member_id": 4,
        "best_hours": "8AM-11AM",
        "preferred_tasks": "Infrastructure setup, automation scripts, monitoring",
        "collab_style": "Documentation-driven, shares runbooks",
        "coding_speed": "Steady and reliable, strong on automation",
        "meeting_tolerance": "Moderate - up to 3 meetings/day",
        "focus_pattern": "2-3 hour focused blocks, checks alerts between",
        "burnout_triggers": "On-call incidents, manual repetitive tasks, poor documentation",
        "wfh_productivity": 80,
        "learning_curve": "Quick on cloud tools, methodical about testing",
    },
    {
        "member_id": 5,
        "best_hours": "11AM-3PM",
        "preferred_tasks": "Full-stack features, API+UI integration, database work",
        "collab_style": "Flexible, bridges frontend and backend teams",
        "coding_speed": "Good velocity across the stack",
        "meeting_tolerance": "Moderate - up to 4 meetings/day",
        "focus_pattern": "2-hour focused coding, then collaboration time",
        "burnout_triggers": "Scope creep, context switching, accumulating tech debt",
        "wfh_productivity": 68,
        "learning_curve": "Adaptive learner across multiple domains",
    },
]


def seed_database():
    """Seed all demo data if tables are empty."""
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if db.query(TeamMember).count() > 0:
            print("[ORKA] Database already seeded. Skipping.")
            return

        print("[ORKA] Seeding database with demo data...")

        # Seed team members
        members = []
        for m in TEAM_SEED:
            member = TeamMember(**m)
            db.add(member)
            members.append(member)
        db.flush()  # get IDs

        # Seed projects
        for p in PROJECTS_SEED:
            project = Project(**p)
            db.add(project)

        # Seed tasks
        for t in TASKS_SEED:
            t_copy = dict(t)
            t_copy["created_at"] = datetime.now()
            task = Task(**t_copy)
            db.add(task)

        # Seed sprint
        sprint = Sprint(**SPRINT_SEED)
        db.add(sprint)

        # Seed work DNA
        for dna in WORK_DNA_SEED:
            work_dna = WorkDNA(**dna)
            db.add(work_dna)

        db.commit()
        print("[ORKA] Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ORKA] Seed error: {e}")
        raise
    finally:
        db.close()