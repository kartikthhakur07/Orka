"""
ORKA v2 - Neon Serverless PostgreSQL Database Engine & Session Management
All operational telemetry, team members, tasks, projects, sprints, and Work DNA
are loaded directly from the Neon PostgreSQL cloud database.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from model import Base, TeamMember, Task, Project, Sprint, WorkDNA, User

load_dotenv()

# Neon Serverless PostgreSQL Connection String
NEON_DATABASE_URL = "postgresql://neondb_owner:npg_EJHgmOUZy9l7@ep-crimson-surf-az9agddm-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

DATABASE_URL = os.getenv("DATABASE_URL", NEON_DATABASE_URL)

# Standardize postgresql scheme for SQLAlchemy 1.4 / 2.0
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine_kwargs = {}
if "sqlite" in DATABASE_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL connection pool configuration for Neon Serverless PostgreSQL
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency providing a database session connected to Neon PostgreSQL."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Ensure database schema and tables exist in Neon PostgreSQL."""
    Base.metadata.create_all(bind=engine)


def seed_database():
    """
    Ensures table schemas are initialized in Neon PostgreSQL.
    No local mock or synthetic seed lists are generated—all data is persisted
    and served directly from Neon PostgreSQL.
    """
    create_tables()
    print("[ORKA] Connected to Neon Serverless PostgreSQL. Live database active.")