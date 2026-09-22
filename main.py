from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Literal
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

Status = Literal["Kaydedildi", "Başvuruldu", "Görüşme", "Teklif", "Olumsuz"]
ROOT = Path(__file__).parent

app = FastAPI(title="Staj Takip Merkezi API", version="1.0.0")


class ApplicationCreate(BaseModel):
    company: str = Field(min_length=2, max_length=80)
    role: str = Field(min_length=2, max_length=100)
    status: Status = "Kaydedildi"
    application_date: date = Field(default_factory=date.today)
    notes: str = Field(default="", max_length=300)


class Application(ApplicationCreate):
    id: UUID


applications: dict[UUID, Application] = {}


def seed() -> None:
    sample = Application(
        id=uuid4(), company="Nova Yazılım", role="Yazılım Geliştirme Stajyeri",
        status="Başvuruldu", application_date=date.today(), notes="Portföy bağlantısı gönderildi."
    )
    applications[sample.id] = sample


seed()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/applications", response_model=list[Application])
def list_applications(status: Status | None = None) -> list[Application]:
    values = applications.values()
    if status:
        values = (item for item in values if item.status == status)
    return sorted(values, key=lambda item: item.application_date, reverse=True)


@app.post("/api/applications", response_model=Application, status_code=201)
def create_application(payload: ApplicationCreate) -> Application:
    item = Application(id=uuid4(), **payload.model_dump())
    applications[item.id] = item
    return item


@app.patch("/api/applications/{application_id}", response_model=Application)
def update_application(application_id: UUID, payload: ApplicationCreate) -> Application:
    if application_id not in applications:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")
    item = Application(id=application_id, **payload.model_dump())
    applications[application_id] = item
    return item


@app.delete("/api/applications/{application_id}", status_code=204)
def delete_application(application_id: UUID) -> None:
    if applications.pop(application_id, None) is None:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")


app.mount("/", StaticFiles(directory=ROOT / "frontend", html=True), name="frontend")
