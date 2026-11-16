"""
Seed data contoh usulan inovasi beserta indikator dan draf rekomendasi AI
ke database lokal untuk pengembangan dan pengujian antarmuka.

Idempotent: aman dijalankan berulang. Baris yang sudah ada diperbarui.

Pemakaian:
    python scripts/seed_sample_innovations.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database.connection import SessionLocal, create_tables
from app.database.assessment_models import (
    Innovation,
    InnovationIndicator,
    ReferenceIndicator,
    ReferenceParameter,
    ParameterAssessment,
    HumanDecision,
)

SAMPLE_INNOVATIONS = [
    {
        "kode": "INV-2026-001",
        "nama_inovasi": "PLATONIK: Literasi Terpadu & Integrasi Karakter",
        "opd": "Dinas Pendidikan Kota Makassar",
        "jenis": "Inovasi Pelayanan Publik",
        "tahun": 2026,
        "deskripsi": "PLATONIK memadukan bahan ajar kurikulum merdeka dengan pendampingan langsung di lorong wisata dan pelacakan perkembangan minat baca siswa.",
        "status": "MENUNGGU_KONFIRMASI_MANUSIA",
        "skor_total": 84.0,
        "skor_maksimum": 96.0,
    },
    {
        "kode": "INV-2026-002",
        "nama_inovasi": "Digitalisasi Posyandu Pintar Terpadu",
        "opd": "Dinas Kesehatan Kota Makassar",
        "jenis": "Inovasi Tata Kelola Pemerintahan",
        "tahun": 2026,
        "deskripsi": "Pencatatan tumbuh kembang balita berbasis digital terintegrasi data stunting tingkat puskesmas dan kelurahan.",
        "status": "MENUNGGU_EVALUASI_AI",
        "skor_total": 18.0,
        "skor_maksimum": 96.0,
    },
    {
        "kode": "INV-2026-003",
        "nama_inovasi": "Sistem Monitoring Genangan Air & Drainase",
        "opd": "Dinas Pekerjaan Umum Kota Makassar",
        "jenis": "Inovasi Pelayanan Publik",
        "tahun": 2026,
        "deskripsi": "Sensor IoT pemantau debit air saluran drainase primer untuk deteksi dini titik genangan air saat curah hujan tinggi.",
        "status": "MENUNGGU_KONFIRMASI_MANUSIA",
        "skor_total": 43.0,
        "skor_maksimum": 96.0,
    },
]

def seed_sample_data():
    create_tables()
    db = SessionLocal()
    try:
        ref_indicators = db.query(ReferenceIndicator).order_by(ReferenceIndicator.urutan).all()
        if not ref_indicators:
            print("Peringatan: reference_indicators kosong. Jalankan scripts/seed_reference.py dulu.")
            return

        for item in SAMPLE_INNOVATIONS:
            inv = db.query(Innovation).filter(Innovation.kode == item["kode"]).first()
            if not inv:
                inv = Innovation(kode=item["kode"])
                db.add(inv)

            inv.nama_inovasi = item["nama_inovasi"]
            inv.opd = item["opd"]
            inv.jenis = item["jenis"]
            inv.tahun = item["tahun"]
            inv.deskripsi = item["deskripsi"]
            inv.status = item["status"]
            inv.skor_total = item["skor_total"]
            inv.skor_maksimum = item["skor_maksimum"]
            db.flush()

            # Buat entry InnovationIndicator untuk setiap reference indicator
            for ref_ind in ref_indicators:
                inv_ind = (
                    db.query(InnovationIndicator)
                    .filter(
                        InnovationIndicator.innovation_id == inv.id,
                        InnovationIndicator.indicator_id == ref_ind.id,
                    )
                    .first()
                )
                if not inv_ind:
                    inv_ind = InnovationIndicator(
                        innovation_id=inv.id,
                        indicator_id=ref_ind.id,
                    )
                    db.add(inv_ind)
                    db.flush()

                # Buat draf rekomendasi AI untuk setiap parameter indikator ini jika belum ada
                for param in ref_ind.parameters:
                    param_assessment = (
                        db.query(ParameterAssessment)
                        .filter(
                            ParameterAssessment.innovation_indicator_id == inv_ind.id,
                            ParameterAssessment.parameter_id == param.id,
                        )
                        .first()
                    )
                    if not param_assessment:
                        # Simulasi rekomendasi awal AI
                        if param.urutan == 1:
                            rekomendasi = "LOLOS"
                            conf = 0.92
                            note = f"Bukti naskah dinas terverifikasi lengkap dan memenuhi ketentuan {param.nama}."
                        elif param.urutan == 2:
                            rekomendasi = "PERLU_REVISI"
                            conf = 0.68
                            note = f"Klausul naskah dinas belum mencantumkan konsiderans lengkap untuk pemenuhan {param.nama}."
                        else:
                            rekomendasi = "TIDAK_LOLOS"
                            conf = 0.42
                            note = f"Tidak ditemukan lampiran pendukung yang memadai untuk membuktikan {param.nama}."

                        param_assessment = ParameterAssessment(
                            innovation_indicator_id=inv_ind.id,
                            parameter_id=param.id,
                            rekomendasi=rekomendasi,
                            confidence_score=conf,
                            ai_catatan=note,
                            status="OK",
                            engine="rule_based",
                            attempt_count=1,
                        )
                        db.add(param_assessment)

        db.commit()
        print(f"Berhasil memuat {len(SAMPLE_INNOVATIONS)} usulan inovasi beserta indikator dan draf AI.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_sample_data()
