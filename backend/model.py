"""
ORKA v2 - SQLAlchemy Models
All database table definitions
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Text,
    DateTime,
)
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class TeamMember(Base):
    """Represents a team member with all performance and wellness metrics."""
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    role = Column(String(100), nullable=False)

    # Skills stored as JSON array string: ["Python", "ML"]
    skills = Column(Text, nullable=False, default="[]")

    # Capacity & load (0-100 scale unless noted)
    workload = Column(Integer, default=0)           # 0-100 %
    availability = Column(Float, default=8.0)      # hours per day available

    # Performance metrics
    performance_rating = Column(Float, default=0.0)   # 0-100
    stress_score = Column(Float, default=0.0)         # 0-100 (higher = more stressed)
    focus_hours = Column(Float, default=0.0)          # hours of deep focus per day
    meeting_load = Column(Float, default=0.0)         # meetings per day
    context_switches = Column(Float, default=0.0)    # task switches per day

    # WFH & commute
    wfh_score = Column(Float, default=0.0)            # 0-100
    commute_distance = Column(Float, default=0.0)    # km
    deep_work_req = Column(Float, default=0.0)        # 0-100
    collab_req = Column(Float, default=0.0)           # 0-100

    # Burnout & wellness
    burnout_score = Column(Float, default=0.0)        # 0-100

    # Productivity scores
    productivity_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    focus_score = Column(Float, default=0.0)
    delivery_score = Column(Float, default=0.0)

    # Work DNA fields
    best_hours = Column(String(50), default="9AM-12PM")
    preferred_task_type = Column(String(100), default="Deep Work")
    burnout_triggers = Column(Text, default="[]")       # JSON list
    wfh_productivity = Column(Float, default=0.0)       # 0-100


class Task(Base):
    """Represents a work task that can be assigned to team members."""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)

    # Required skills stored as JSON array string
    required_skills = Column(Text, nullable=False, default="[]")

    priority = Column(String(20), default="medium")   # low, medium, high, critical
    status = Column(String(20), default="todo")        # todo, in-progress, done

    # Assignment
    assigned_to = Column(String(100), nullable=True)
    assignment_score = Column(Float, default=0.0)     # 0-100
    confidence = Column(Float, default=0.0)           # 0-100 %

    # Estimation
    estimated_hours = Column(Float, default=0.0)
    complexity = Column(Integer, default=5)            # 1-10 scale
    deadline_days = Column(Integer, default=7)

    created_at = Column(DateTime, default=datetime.now)


class Project(Base):
    """Represents a project with health and progress tracking."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)

    # Timeline
    deadline_days = Column(Integer, default=14)

    # Progress
    tasks_total = Column(Integer, default=0)
    tasks_done = Column(Integer, default=0)

    # Velocity & risk
    velocity = Column(Float, default=1.0)      # tasks completed per day
    risk_score = Column(Float, default=0.0)    # 0-100
    health_score = Column(Float, default=0.0)  # 0-100

    # Status: healthy, at-risk, critical
    status = Column(String(20), default="healthy")


class Sprint(Base):
    """Represents a sprint planning period."""
    __tablename__ = "sprints"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    start_date = Column(String(20), nullable=False)  # YYYY-MM-DD

    # Detailed daily task breakdown stored as JSON
    tasks = Column(Text, nullable=False, default="[]")


class WorkDNA(Base):
    """
    Deep work style profile for each team member.
    Stores behavioral and productivity patterns.
    """
    __tablename__ = "work_dna"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    member_id = Column(Integer, nullable=False, index=True)

    best_hours = Column(String(50), default="9AM-5PM")
    preferred_tasks = Column(Text, default="")
    collab_style = Column(Text, default="")
    coding_speed = Column(String(100), default="")
    meeting_tolerance = Column(String(100), default="")
    focus_pattern = Column(Text, default="")
    burnout_triggers = Column(Text, default="")
    wfh_productivity = Column(Float, default=0.0)   # 0-100
    learning_curve = Column(Text, default="")