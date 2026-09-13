"""
ORKA v2 - Database configuration and seed data
IBM HR Analytics Employee Attrition & Performance Dataset Integration
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
# Seed Data — Derived from IBM HR Analytics Attrition Dataset
# ---------------------------------------------------------------------------

TEAM_SEED = [
    {
        "name": "Kartik",
        "role": "Backend Engineer",
        "skills": json.dumps(["Backend", "Python", "API", "Security", "JWT"]),
        "workload": 45,
        "availability": 5.0,
        "performance_rating": 92.0,
        "stress_score": 65.0,
        "focus_hours": 6.0,
        "meeting_load": 3.0,
        "context_switches": 4.0,
        "wfh_score": 70.0,
        "commute_distance": 25.0,
        "deep_work_req": 80.0,
        "collab_req": 40.0,
        "burnout_score": 65.0,
        "productivity_score": 89.0,
        "consistency_score": 95.0,
        "focus_score": 84.0,
        "delivery_score": 91.0,
        "best_hours": "9AM-12PM",
        "preferred_task_type": "Deep Work",
        "burnout_triggers": json.dumps(["context switching", "unclear requirements"]),
        "wfh_productivity": 78.0,
        # IBM HR Analytics Dataset attributes
        "work_life_balance": 2,      # Good / Moderate strain
        "job_satisfaction": 3,       # High
        "env_satisfaction": 3,       # High
        "job_involvement": 3,        # High
        "overtime": "Yes",           # Working extra hours
        "years_at_company": 4,
        "years_with_manager": 3,
        "monthly_income": 9500.0,
        "attrition_label": "No",
    },
    {
        "name": "Riya",
        "role": "ML Engineer",
        "skills": json.dumps(["Python", "ML", "AI", "TensorFlow", "Data"]),
        "workload": 30,
        "availability": 7.0,
        "performance_rating": 95.0,
        "stress_score": 35.0,
        "focus_hours": 7.0,
        "meeting_load": 2.0,
        "context_switches": 2.0,
        "wfh_score": 85.0,
        "commute_distance": 40.0,
        "deep_work_req": 90.0,
        "collab_req": 30.0,
        "burnout_score": 28.0,
        "productivity_score": 93.0,
        "consistency_score": 88.0,
        "focus_score": 96.0,
        "delivery_score": 94.0,
        "best_hours": "10AM-2PM",
        "preferred_task_type": "Research",
        "burnout_triggers": json.dumps(["too many meetings", "rushed deadlines"]),
        "wfh_productivity": 92.0,
        # IBM HR Analytics Dataset attributes
        "work_life_balance": 4,      # Best
        "job_satisfaction": 4,       # Very High
        "env_satisfaction": 4,       # Very High
        "job_involvement": 4,        # Very High
        "overtime": "No",
        "years_at_company": 5,
        "years_with_manager": 4,
        "monthly_income": 12000.0,
        "attrition_label": "No",
    },
    {
        "name": "Aman",
        "role": "Frontend Developer",
        "skills": json.dumps(["React", "UI", "Next.js", "CSS", "TypeScript"]),
        "workload": 70,
        "availability": 3.0,
        "performance_rating": 78.0,
        "stress_score": 82.0,
        "focus_hours": 4.0,
        "meeting_load": 6.0,
        "context_switches": 8.0,
        "wfh_score": 55.0,
        "commute_distance": 10.0,
        "deep_work_req": 60.0,
        "collab_req": 70.0,
        "burnout_score": 85.0,
        "productivity_score": 72.0,
        "consistency_score": 68.0,
        "focus_score": 61.0,
        "delivery_score": 75.0,
        "best_hours": "2PM-6PM",
        "preferred_task_type": "Collaborative",
        "burnout_triggers": json.dumps(["high meeting load", "context switches", "unclear designs"]),
        "wfh_productivity": 58.0,
        # IBM HR Analytics Dataset attributes
        "work_life_balance": 1,      # Bad (High Attrition Risk)
        "job_satisfaction": 2,       # Medium
        "env_satisfaction": 2,       # Medium
        "job_involvement": 2,        # Medium
        "overtime": "Yes",           # Mandatory overtime
        "years_at_company": 2,
        "years_with_manager": 1,
        "monthly_income": 6200.0,
        "attrition_label": "Yes",    # IBM HR Attrition Marker
    },
    {
        "name": "Priya",
        "role": "DevOps Engineer",
        "skills": json.dumps(["DevOps", "Cloud", "AWS", "Docker", "CI/CD"]),
        "workload": 55,
        "availability": 5.0,
        "performance_rating": 88.0,
        "stress_score": 55.0,
        "focus_hours": 6.0,
        "meeting_load": 4.0,
        "context_switches": 5.0,
        "wfh_score": 75.0,
        "commute_distance": 30.0,
        "deep_work_req": 75.0,
        "collab_req": 50.0,
        "burnout_score": 52.0,
        "productivity_score": 85.0,
        "consistency_score": 82.0,
        "focus_score": 79.0,
        "delivery_score": 88.0,
        "best_hours": "8AM-11AM",
        "preferred_task_type": "Infrastructure",
        "burnout_triggers": json.dumps(["on-call incidents", "manual repetitive tasks"]),
        "wfh_productivity": 80.0,
        # IBM HR Analytics Dataset attributes
        "work_life_balance": 3,      # Better
        "job_satisfaction": 3,       # High
        "env_satisfaction": 3,       # High
        "job_involvement": 3,        # High
        "overtime": "No",
        "years_at_company": 6,
        "years_with_manager": 5,
        "monthly_income": 10500.0,
        "attrition_label": "No",
    },
    {
        "name": "Hitendra",
        "role": "Full Stack",
        "skills": json.dumps(["Backend", "React", "Node.js", "Database", "API"]),
        "workload": 60,
        "availability": 4.0,
        "performance_rating": 85.0,
        "stress_score": 75.0,
        "focus_hours": 5.0,
        "meeting_load": 5.0,
        "context_switches": 6.0,
        "wfh_score": 62.0,
        "commute_distance": 20.0,
        "deep_work_req": 70.0,
        "collab_req": 60.0,
        "burnout_score": 71.0,
        "productivity_score": 81.0,
        "consistency_score": 79.0,
        "focus_score": 74.0,
        "delivery_score": 83.0,
        "best_hours": "11AM-3PM",
        "preferred_task_type": "Full Stack Features",
        "burnout_triggers": json.dumps(["scope creep", "context switching", "tech debt"]),
        "wfh_productivity": 68.0,
        # IBM HR Analytics Dataset attributes
        "work_life_balance": 2,      # Good / High workload strain
        "job_satisfaction": 3,       # High
        "env_satisfaction": 2,       # Medium
        "job_involvement": 3,        # High
        "overtime": "Yes",
        "years_at_company": 3,
        "years_with_manager": 2,
        "monthly_income": 8800.0,
        "attrition_label": "No",
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
    """Seed all demo data with IBM HR Analytics dataset attributes."""
    db: Session = SessionLocal()
    try:
        # Drop and recreate tables to ensure schema matches new columns
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

        print("[ORKA] Seeding database with IBM HR Analytics dataset...")

        # Seed team members
        members = []
        for m in TEAM_SEED:
            member = TeamMember(**m)
            db.add(member)
            members.append(member)
        db.flush()

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
        print("[ORKA] Database seeded successfully with IBM HR Analytics Dataset!")

    except Exception as e:
        db.rollback()
        print(f"[ORKA] Seed error: {e}")
        raise
    finally:
        db.close()