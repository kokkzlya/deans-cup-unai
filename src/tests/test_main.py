import sys
from pathlib import Path

# Ensure both 'src' and 'src/deanscupunai' are in sys.path
TEST_DIR = Path(__file__).resolve().parent
SRC_DIR = TEST_DIR.parent
PKG_DIR = SRC_DIR / "deanscupunai"

for p in [str(PKG_DIR), str(SRC_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi.testclient import TestClient

try:
    from app.main import app
except ImportError:
    from deanscupunai.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "app": "deans-cup-landing"}


def test_landing_page_renders():
    response = client.get("/")
    assert response.status_code == 200
    assert "DEAN'S CUP 2026" in response.text
    assert "Futsal Putra" in response.text
    assert "Fakultas Ekonomi" in response.text


def test_schedule_api():
    response = client.get("/api/schedule")
    assert response.status_code == 200
    data = response.json()
    assert data["event_name"] == "DEAN'S CUP 2026"
    assert len(data["matches"]) > 0


def test_matches_api_filter_sport():
    response = client.get("/api/matches?sport=futsal")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert all(m["sport_id"] == "futsal" for m in data["matches"])


def test_matches_api_filter_status():
    response = client.get("/api/matches?status=live")
    assert response.status_code == 200
    data = response.json()
    assert all(m["status"] == "live" for m in data["matches"])


def test_security_headers():
    response = client.get("/")
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "SAMEORIGIN"
