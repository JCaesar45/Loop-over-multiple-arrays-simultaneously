from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

ROOT = Path(__file__).resolve().parent.parent
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

PRODUCTS = [
    {
        "id": "velvet-funnel",
        "name": "Velvet Funnel Suite",
        "category": "Conversion",
        "price": 260000,
        "margin": 0.51,
        "badge": "Growth",
        "proof": {"rating": 4.8, "sales": 2390, "retention": 0.91},
        "features": ["A/B revenue pages", "Lead scoring", "Concierge CTA flows"],
    },
    {
        "id": "obsidian-intake",
        "name": "Obsidian Client Intake",
        "category": "Client Intake",
        "price": 190000,
        "margin": 0.39,
        "badge": "Intake",
        "proof": {"rating": 4.7, "sales": 3155, "retention": 0.96},
        "features": ["Verified lead capture", "Pipeline automation", "High-value follow-up"],
    },
    {
        "id": "meridian-retention",
        "name": "Meridian Retention Suite",
        "category": "Retention",
        "price": 320000,
        "margin": 0.45,
        "badge": "Retention",
        "proof": {"rating": 4.8, "sales": 968, "retention": 0.97},
        "features": ["Churn radar", "Loyalty triggers", "Client success briefs"],
    },
    {
        "id": "aurum-signature",
        "name": "Aurum Signature Console",
        "category": "Revenue Command",
        "price": 480000,
        "margin": 0.42,
        "badge": "Flagship",
        "proof": {"rating": 4.9, "sales": 1482, "retention": 0.94},
        "features": ["Real-time revenue telemetry", "Predictive offer ranking", "Private client vault"],
    },
]

app = FastAPI(title="Aurum Atelier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class LeadPayload(BaseModel):
    email: str = Field(min_length=5, max_length=320)
    source: str = Field(default="landing", max_length=80)
    message: Optional[str] = Field(default=None, max_length=2000)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        candidate = value.strip().lower()
        if not EMAIL_PATTERN.fullmatch(candidate):
            raise ValueError("email must be valid")
        return candidate


class LeadRecord(LeadPayload):
    id: str
    received_at: str


LEADS: List[LeadRecord] = []


@app.get("/", include_in_schema=False)
def landing() -> FileResponse:
    page = ROOT / "index.html"
    if not page.is_file():
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(page, media_type="text/html")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/products")
def products() -> dict:
    return {"products": PRODUCTS}


@app.post("/api/leads", status_code=201)
def create_lead(payload: LeadPayload) -> dict:
    if any(item.email == payload.email for item in LEADS):
        raise HTTPException(status_code=409, detail="lead already exists")

    record = LeadRecord(
        id=str(uuid4()),
        received_at=datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    )

    LEADS.append(record)

    return {
        "id": record.id,
        "accepted": True,
        "email": record.email,
        "received_at": record.received_at,
    }


@app.get("/api/leads")
def list_leads() -> dict:
    return {"leads": LEADS}
