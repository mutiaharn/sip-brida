from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.assessment_models import ReferenceIndicator, ReferenceParameter

router = APIRouter()

class ParameterSchema(BaseModel):
    id: str
    indicator_id: str
    nama: str
    skor: float
    urutan: int

    class Config:
        from_attributes = True

class IndicatorSchema(BaseModel):
    id: str
    kode: str
    nama: str
    definisi: Optional[str] = None
    mandatori: bool = False
    aktif_tahap_1: bool = True
    urutan: int
    skor_maksimum: Optional[float] = None
    evidence_tags: Optional[List[str]] = None
    bukti_dukung: Optional[List[str]] = None
    parameters: List[ParameterSchema] = []

    class Config:
        from_attributes = True

@router.get("/indicators", response_model=List[IndicatorSchema])
def list_indicators(db: Session = Depends(get_db)):
    """Mengambil katalog lengkap 20 indikator beserta parameternya."""
    indicators = db.query(ReferenceIndicator).order_by(ReferenceIndicator.urutan.asc()).all()
    return indicators

@router.get("/indicators/{indicator_id}", response_model=IndicatorSchema)
def get_indicator(indicator_id: str, db: Session = Depends(get_db)):
    """Mengambil detail satu indikator berdasarkan ID (contoh: IND-01)."""
    indicator = db.query(ReferenceIndicator).filter(ReferenceIndicator.id == indicator_id.upper()).first()
    if not indicator:
        raise HTTPException(status_code=404, detail="Indikator tidak ditemukan.")
    return indicator
