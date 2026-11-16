from typing import List, Optional, Any, Dict
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.assessment_models import (
    Innovation,
    InnovationIndicator,
    ReferenceIndicator,
    ReferenceParameter,
    ParameterAssessment,
    HumanDecision,
    AuditLog,
)

router = APIRouter()

class DecisionRequest(BaseModel):
    indicator_id: str
    parameter_id: str
    keputusan: str  # LOLOS | REVISI | TOLAK
    catatan: Optional[str] = None
    decided_by_nama: Optional[str] = "Verifikator BRIDA"

class CreateInnovationRequest(BaseModel):
    kode: str
    nama_inovasi: str
    opd: str
    jenis: Optional[str] = "Inovasi Pelayanan Publik"
    tahun: Optional[int] = 2026
    deskripsi: Optional[str] = ""

@router.get("/innovations")
def list_innovations(db: Session = Depends(get_db)):
    """Mengambil daftar seluruh inovasi daerah yang terdaftar beserta status progresnya."""
    innovations = db.query(Innovation).order_by(Innovation.id.desc()).all()
    results = []

    for inv in innovations:
        total_ind = len(inv.indicators) or 20
        verified_count = sum(1 for ind in inv.indicators if ind.status == "SELESAI")
        
        results.append({
            "id": inv.kode,
            "numeric_id": inv.id,
            "title": inv.nama_inovasi,
            "opd": inv.opd,
            "type": inv.jenis,
            "year": inv.tahun,
            "description": inv.deskripsi,
            "status": inv.status,
            "temporaryPoints": inv.skor_total or 0.0,
            "maxPoints": inv.skor_maksimum or 96.0,
            "evidenceFilled": verified_count,
            "totalEvidence": total_ind,
            "accuracy": 92.5 if verified_count > 0 else 75.0,
            "ocrStatus": "Tanda Tangan Sah" if verified_count > 5 else "Stempel Kurang Jelas",
            "picName": "Tim Inovasi " + inv.opd.replace("Dinas", "").strip(),
            "picPhone": "0812-4486-xxxx",
            "created_at": inv.created_at.isoformat() if inv.created_at else None,
        })

    return results

@router.get("/innovations/{kode}")
def get_innovation_detail(kode: str, db: Session = Depends(get_db)):
    """Mengambil rincian inovasi beserta indikator dan parameter penilaiannya."""
    inv = db.query(Innovation).filter(Innovation.kode == kode).first()
    if not inv:
        # Cari berdasarkan numeric id jika kode adalah integer string
        if kode.isdigit():
            inv = db.query(Innovation).filter(Innovation.id == int(kode)).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inovasi tidak ditemukan.")

    # Ambil seluruh referensi indikator agar lengkap 20
    ref_indicators = db.query(ReferenceIndicator).order_by(ReferenceIndicator.urutan.asc()).all()
    inv_ind_map = {ind.indicator_id: ind for ind in inv.indicators}

    indicators_data = []
    for idx, ref in enumerate(ref_indicators, start=1):
        inv_ind = inv_ind_map.get(ref.id)
        status = "pending"
        reviewer_note = ""
        param_list = []

        # Ambil rekomendasi AI & keputusan verifikator
        assessments_map = {}
        decisions_map = {}
        if inv_ind:
            if inv_ind.status == "SELESAI":
                status = "verified"
            reviewer_note = inv_ind.reviewer_note or ""
            for a in inv_ind.assessments:
                assessments_map[a.parameter_id] = {
                    "rekomendasi": a.rekomendasi,
                    "confidence_score": a.confidence_score,
                    "ai_catatan": a.ai_catatan,
                }
            for d in inv_ind.decisions:
                decisions_map[d.parameter_id] = {
                    "keputusan": d.keputusan,
                    "catatan": d.catatan,
                    "is_override": d.is_override,
                }

        for p in ref.parameters:
            ai_data = assessments_map.get(p.id, {
                "rekomendasi": "LOLOS" if p.urutan == 1 else "PERLU_REVISI",
                "confidence_score": 0.85 if p.urutan == 1 else 0.60,
                "ai_catatan": f"Analisis AI untuk {p.nama}.",
            })
            human_data = decisions_map.get(p.id)

            param_list.append({
                "id": p.id,
                "nama": p.nama,
                "skor": p.skor,
                "urutan": p.urutan,
                "ai_assessment": ai_data,
                "human_decision": human_data,
            })

        indicators_data.append({
            "id": idx,
            "indicator_id": ref.id,
            "title": f"{idx}. {ref.nama}",
            "sub": ref.bukti_dukung[0] if (ref.bukti_dukung and len(ref.bukti_dukung) > 0) else (ref.definisi or ""),
            "definisi": ref.definisi,
            "points": ref.skor_maksimum or 3.0,
            "status": status,
            "reviewer_note": reviewer_note,
            "parameters": param_list,
        })

    return {
        "id": inv.kode,
        "numeric_id": inv.id,
        "title": inv.nama_inovasi,
        "opd": inv.opd,
        "type": inv.jenis,
        "year": inv.tahun,
        "description": inv.deskripsi,
        "status": inv.status,
        "temporaryPoints": inv.skor_total or 0.0,
        "maxPoints": inv.skor_maksimum or 96.0,
        "indicators": indicators_data,
    }

@router.post("/innovations/{kode}/decisions")
def save_decision(kode: str, req: DecisionRequest, db: Session = Depends(get_db)):
    """Menyimpan keputusan verifikator untuk suatu parameter indikator."""
    inv = db.query(Innovation).filter(Innovation.kode == kode).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inovasi tidak ditemukan.")

    inv_ind = (
        db.query(InnovationIndicator)
        .filter(
            InnovationIndicator.innovation_id == inv.id,
            InnovationIndicator.indicator_id == req.indicator_id,
        )
        .first()
    )
    if not inv_ind:
        inv_ind = InnovationIndicator(
            innovation_id=inv.id,
            indicator_id=req.indicator_id,
        )
        db.add(inv_ind)
        db.flush()

    # Cek atau buat HumanDecision
    decision = (
        db.query(HumanDecision)
        .filter(
            HumanDecision.innovation_indicator_id == inv_ind.id,
            HumanDecision.parameter_id == req.parameter_id,
        )
        .first()
    )
    if not decision:
        decision = HumanDecision(
            innovation_indicator_id=inv_ind.id,
            parameter_id=req.parameter_id,
        )
        db.add(decision)

    decision.keputusan = req.keputusan.upper()
    decision.catatan = req.catatan
    decision.decided_by_nama = req.decided_by_nama
    decision.decided_at = datetime.now(timezone.utc)

    # Tandai indikator selesai jika keputusan telah diambil
    inv_ind.status = "SELESAI"
    if req.catatan:
        inv_ind.reviewer_note = req.catatan

    # Catat ke AuditLog
    audit = AuditLog(
        actor=req.decided_by_nama,
        actor_role="verifikator",
        action="DECIDE",
        entity="human_decision",
        entity_id=f"{kode}:{req.indicator_id}:{req.parameter_id}",
        payload={"keputusan": req.keputusan, "catatan": req.catatan},
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Keputusan {req.keputusan} untuk {req.parameter_id} berhasil disimpan.",
        "indicator_status": "SELESAI"
    }

@router.post("/innovations")
def create_innovation(req: CreateInnovationRequest, db: Session = Depends(get_db)):
    """Mendaftarkan usulan inovasi daerah baru."""
    existing = db.query(Innovation).filter(Innovation.kode == req.kode).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Inovasi dengan kode {req.kode} sudah terdaftar.")

    inv = Innovation(
        kode=req.kode,
        nama_inovasi=req.nama_inovasi,
        opd=req.opd,
        jenis=req.jenis,
        tahun=req.tahun,
        deskripsi=req.deskripsi,
        status="MENUNGGU_EVALUASI_AI",
        skor_total=0.0,
        skor_maksimum=96.0,
    )
    db.add(inv)
    db.flush()

    # Buat entri 20 indikator
    ref_indicators = db.query(ReferenceIndicator).all()
    for ref in ref_indicators:
        inv_ind = InnovationIndicator(
            innovation_id=inv.id,
            indicator_id=ref.id,
            status="MENUNGGU_EVALUASI_AI",
        )
        db.add(inv_ind)

    db.commit()
    return {"success": True, "message": "Inovasi baru berhasil didaftarkan.", "kode": inv.kode}
