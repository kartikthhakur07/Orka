from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class TeamMember(Base):
    __tablename__ = "team_members"
    id                 = Column(Integer, primary_key=True, index=True)
    name               = Column(String(100), nullable=False)
    role               = Column(String(100))
    skills             = Column(Text)
    workload           = Column(Integer, default=50)
    availability       = Column(Integer, default=4)
    performance_rating = Column(Float, default=4.0)
    wfh_score          = Column(Float, default=60.0)
    created_at         = Column(DateTime, server_default=func.now())

class Task(Base):
    __tablename__ = "tasks"
    id               = Column(Integer, primary_key=True, index=True)
    title            = Column(String(255), nullable=False)
    required_skills  = Column(Text)
    priority         = Column(String(20), default="medium")
    status           = Column(String(50), default="assigned")
    assigned_to      = Column(String(100))
    assignment_score = Column(Float)
    estimated_hours  = Column(Float, default=8.0)
    created_at       = Column(DateTime, server_default=func.now())