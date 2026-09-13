"""
ORKA v2 - Automated Test Suite
Pytest integration for API endpoints, scoring algorithms, burnout analysis, and WFH recommendations.
"""

import pytest
from fastapi.testclient import TestClient
from main import app, compute_assignment_score, compute_wfh_score, skill_match_score, get_risk_level
from database import create_tables, seed_database

# Ensure database tables and seed data are populated for testing
create_tables()
seed_database()

client = TestClient(app)


def test_root_and_health():
    """Verify root and health endpoints return 200 OK."""
    resp_root = client.get("/")
    assert resp_root.status_code == 200
    data_root = resp_root.json()
    assert data_root["name"] == "ORKA v2 API"
    assert data_root["status"] == "running"

    resp_health = client.get("/api/health")
    assert resp_health.status_code == 200
    assert resp_health.json()["status"] == "ok"


def test_dashboard_endpoint():
    """Verify dashboard metrics endpoint returns valid health scores and stats."""
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()

    assert "team_health" in data
    assert "burnout_index" in data
    assert "sprint_progress" in data
    assert "wfh_rate" in data


def test_team_members_endpoint():
    """Verify team members list returned correctly."""
    response = client.get("/api/team")
    assert response.status_code == 200
    data = response.json()

    assert "members" in data
    assert len(data["members"]) >= 5
    first_member = data["members"][0]
    assert "name" in first_member
    assert "skills" in first_member
    assert isinstance(first_member["skills"], list)


def test_skill_match_and_assignment_logic():
    """Test pure algorithmic functions for task assignment score."""
    m_skills = ["Python", "Backend", "JWT", "Security"]
    req_skills = ["Backend", "JWT"]
    score = skill_match_score(m_skills, req_skills)
    assert score == 100.0

    partial_score = skill_match_score(m_skills, ["Backend", "React"])
    assert partial_score == 50.0


def test_task_assignment_endpoint():
    """Test POST /api/tasks/assign endpoint."""
    payload = {
        "title": "Implement OAuth2 Flow",
        "required_skills": ["Backend", "Security"],
        "priority": "high",
        "complexity": 7,
        "deadline_days": 3
    }
    response = client.post("/api/tasks/assign", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "assigned_to" in data
    assert "confidence" in data
    assert data["confidence"] > 0


def test_burnout_radar_endpoint():
    """Test GET /api/burnout endpoint."""
    response = client.get("/api/burnout")
    assert response.status_code == 200
    data = response.json()

    assert "members" in data
    assert "critical_count" in data
    assert "avg_burnout" in data
    assert data["avg_burnout"] >= 0


def test_wfh_decider_endpoint():
    """Test GET /api/wfh endpoint."""
    response = client.get("/api/wfh")
    assert response.status_code == 200
    data = response.json()

    assert "members" in data
    assert "full_wfh_count" in data
    assert len(data["members"]) >= 5


def test_copilot_endpoint():
    """Test POST /api/copilot endpoint."""
    payload = {"question": "Who has highest burnout risk?"}
    response = client.post("/api/copilot", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "answer" in data
    assert len(data["answer"]) > 0


def test_nlp_task_parser_endpoint():
    """Test POST /api/tasks/parse endpoint."""
    payload = {"description": "Build high performance ML pipeline and API backend using Python and Docker"}
    response = client.post("/api/tasks/parse", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "description" in data
    assert "extracted_skills" in data
    assert len(data["extracted_skills"]) > 0
