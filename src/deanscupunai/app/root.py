import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent.parent

root = APIRouter()
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def get_event_data() -> dict:
    """Load event data from the JSON file."""
    data_path = BASE_DIR / "data" / "event_data.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


@root.get("/", response_class=HTMLResponse)
async def landing_page(request: Request):
    """Render the single-page sports match schedule."""
    data = get_event_data()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"request": request, "event": data}
    )


@root.get("/health")
async def health_check():
    """Health check endpoint for container probes and monitoring."""
    return {"status": "ok", "app": "deans-cup-landing"}


@root.get("/api/schedule", response_class=JSONResponse)
async def get_schedule():
    """Return complete event data in JSON format."""
    return get_event_data()


@root.get("/api/matches", response_class=JSONResponse)
async def filter_matches(
    sport: Optional[str] = Query(None, description="Sport filter: futsal, basket, esport, badminton"),
    day: Optional[str] = Query(None, description="Day filter: day-1, day-2, day-3, day-4, day-5"),
    status: Optional[str] = Query(None, description="Status filter: live, upcoming, finished"),
    q: Optional[str] = Query(None, description="Search keyword in team, stage, or venue")
):
    """Return filtered matches based on sport, day, status, and search query."""
    data = get_event_data()
    matches = data.get("matches", [])

    if sport and sport.lower() != "all":
        matches = [m for m in matches if m.get("sport_id") == sport.lower()]

    if day and day.lower() != "all":
        matches = [m for m in matches if m.get("day_id") == day.lower()]

    if status and status.lower() != "all":
        matches = [m for m in matches if m.get("status") == status.lower()]

    if q:
        query = q.strip().lower()
        matches = [
            m for m in matches
            if query in m.get("team_a", {}).get("name", "").lower()
            or query in m.get("team_b", {}).get("name", "").lower()
            or query in m.get("stage", "").lower()
            or query in m.get("venue", "").lower()
            or query in m.get("sport_name", "").lower()
        ]

    return {"count": len(matches), "matches": matches}
