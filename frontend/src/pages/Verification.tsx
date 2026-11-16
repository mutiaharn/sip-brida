import { useState, useEffect } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import {
  fetchInnovationDetail,
  saveParameterDecision,
} from "../services/api";
import type {
  IndicatorDetailItem,
  InnovationDetailResponse,
} from "../services/api";

export interface VerificationProps {
  onBack: () => void;
  documentId?: string;
  documentTitle?: string;
  opdName?: string;
}

/* TAB 1: PROFIL & RANCANG BANGUN */
/* ============================== */
function ProfileTabContent({
  innovation,
  onGoToIndicators,
}: {
  innovation?: InnovationDetailResponse | null;
  onGoToIndicators: () => void;
}) {
  const [profileDecision, setProfileDecision] = useState<"layak" | "revisi" | "tolak">("layak");
  const [profileNote, setProfileNote] = useState<string>(
    "Substansi rancang bangun dan pokok perubahan telah memenuhi kriteria kebaruan. Silakan lanjutkan verifikasi kelengkapan naskah dinas."
  );

  return (
    <div className="grid grid-cols-12 gap-5 items-start">
      {/* Kolom Kiri: Narasi Proposal */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            A. Ringkasan Parameter Inovasi
          </h3>
          <div className="grid grid-cols-3 gap-3.5 mt-3.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Tahapan Inovasi</p>
              <p className="font-poppins font-bold text-xs text-emerald-700 mt-1">
                Penerapan (Uji Coba Selesai)
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Bentuk Inovasi</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                {innovation?.type || "Inovasi Pelayanan Publik"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Waktu Penerapan Resmi</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                Tahun {innovation?.year || 2026}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            B. Rancang Bangun Pokok Perubahan
          </h3>
          <div className="mt-3.5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 text-xs leading-relaxed font-sans text-slate-700">
            <div>
              <h4 className="font-poppins font-bold text-slate-900 mb-0.5">
                Deskripsi Substansi Inovasi:
              </h4>
              <p className="text-slate-600">
                {innovation?.description ||
                  "Program inovasi daerah yang memadukan peningkatan kualitas tata kelola dengan layanan publik terintegrasi di Kota Makassar."}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            C. Dampak &amp; Kemanfaatan Nyata
          </h3>
          <div className="mt-3.5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5 font-sans text-slate-700">
            <p>• Peningkatan efisiensi waktu layanan dan keterpaduan data instansi.</p>
            <p>• Terverifikasi dalam sistem Indeks Inovasi Daerah (IID) BRIDA Kota Makassar.</p>
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            D. Anggaran &amp; Tim Pelaksana
          </h3>
          <div className="grid grid-cols-2 gap-3.5 mt-3.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Alokasi DPA APBD</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                Terlampir pada Bukti Dukung (IND-03)
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Legalitas Tim Pelaksana</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                SK Penetapan Tim (IND-02)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Panel Keputusan Profil */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 sticky top-24">
        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900">
            Form Verifikasi Kelayakan Proposal
          </h3>
          <p className="font-sans text-[11px] text-slate-500 mt-0.5">
            Pemeriksaan substansi awal sebelum menelaah 20 berkas evidence.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-[11px] font-sans">
          <p className="font-poppins font-bold text-slate-800 mb-1">
            AI Check: Substansi &amp; Syarat Narasi
          </p>
          <p className="text-emerald-700 font-medium">✓ Narasi proposal memenuhi kriteria awal</p>
          <p className="text-emerald-700 font-medium">✓ Unsur rancang bangun terdeteksi lengkap</p>
          <p className="text-emerald-700 font-medium">✓ Memenuhi syarat evaluasi 19 indikator aktif</p>
        </div>

        <div>
          <label className="block text-xs font-poppins font-semibold text-slate-700 mb-2">
            Keputusan Verifikator untuk Profil Ini:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProfileDecision("layak")}
              className={`py-2 px-2 text-[11px] font-poppins rounded-lg transition-all ${
                profileDecision === "layak"
                  ? "bg-[#059669] text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              ✓ Profil Layak
            </button>
            <button
              type="button"
              onClick={() => setProfileDecision("revisi")}
              className={`py-2 px-2 text-[11px] font-poppins rounded-lg transition-all ${
                profileDecision === "revisi"
                  ? "bg-[#F59E0B] text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              Perlu Revisi
            </button>
            <button
              type="button"
              onClick={() => setProfileDecision("tolak")}
              className={`py-2 px-2 text-[11px] font-poppins rounded-lg transition-all ${
                profileDecision === "tolak"
                  ? "bg-[#9B1C1C] text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              Tolak Usulan
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
            Catatan Asistensi untuk Inisiator OPD:
          </label>
          <textarea
            rows={3}
            value={profileNote}
            onChange={(e) => setProfileNote(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9B1C1C] transition-colors resize-none"
          />
        </div>

        <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-2.5">
          <p className="font-poppins font-bold text-xs text-[#92400E]">
            Langkah Selanjutnya:
          </p>
          <p className="font-sans text-[11px] text-[#78350F] leading-relaxed">
            Verifikasi keabsahan naskah SK, SOP, DPA anggaran, dan bukti dukung (20 Indikator) melalui sistem evaluasi AI OCR.
          </p>
          <button
            type="button"
            onClick={onGoToIndicators}
            className="w-full py-2.5 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white text-xs font-poppins font-bold rounded-lg shadow-sm transition-all active:scale-95 text-center block"
          >
            Buka Workspace 20 Indikator (AI OCR) →
          </button>
        </div>
      </div>
    </div>
  );
}

/* TAB 2: EVALUASI 20 INDIKATOR */
/* ============================= */
function IndicatorsTabContent({
  documentId,
  indicators,
  onUpdateIndicators,
}: {
  documentId: string;
  indicators: IndicatorDetailItem[];
  onUpdateIndicators: (updated: IndicatorDetailItem[]) => void;
}) {
  const [activeIndicatorId, setActiveIndicatorId] = useState<number>(1);
  const [decisions, setDecisions] = useState<{ [paramId: string]: "lolos" | "revisi" | "tolak" }>({});
  const [reviewerNote, setReviewerNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const currentIndicator =
    indicators.find((item) => item.id === activeIndicatorId) || indicators[0];

  const handleSelectIndicator = (id: number) => {
    setActiveIndicatorId(id);
    const selected = indicators.find((item) => item.id === id);
    if (selected) {
      setReviewerNote(selected.reviewer_note || "");
    }
  };

  const handleSelectDecision = async (paramId: string, opt: "lolos" | "revisi" | "tolak") => {
    setDecisions((prev) => ({ ...prev, [paramId]: opt }));

    // Simpan otomatis ke backend
    if (currentIndicator) {
      try {
        await saveParameterDecision(
          documentId,
          currentIndicator.indicator_id,
          paramId,
          opt.toUpperCase() as "LOLOS" | "REVISI" | "TOLAK",
          reviewerNote
        );
      } catch (err) {
        console.warn("Auto-save keputusan:", err);
      }
    }
  };

  const handleSaveAndNext = async () => {
    setIsSaving(true);
    try {
      // Simpan semua parameter yang sudah dipilih keputusannya
      if (currentIndicator && currentIndicator.parameters) {
        for (const p of currentIndicator.parameters) {
          const dec = decisions[p.id];
          if (dec) {
            await saveParameterDecision(
              documentId,
              currentIndicator.indicator_id,
              p.id,
              dec.toUpperCase() as "LOLOS" | "REVISI" | "TOLAK",
              reviewerNote
            );
          }
        }
      }

      // Perbarui status indikator jadi verified
      onUpdateIndicators(
        indicators.map((item) =>
          item.id === activeIndicatorId
            ? { ...item, status: "verified", reviewer_note: reviewerNote }
            : item
        )
      );

      if (activeIndicatorId < indicators.length) {
        handleSelectIndicator(activeIndicatorId + 1);
      } else {
        alert("Seluruh 20 indikator telah selesai ditelaah!");
      }
    } catch (err: any) {
      alert("Gagal menyimpan telaah: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const verifiedCount = indicators.filter((i) => i.status === "verified").length;

  return (
    <div className="grid grid-cols-12 gap-5 items-start">
      {/* KOLOM 1: DAFTAR 20 INDIKATOR */}
      <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col max-h-[calc(100vh-140px)] sticky top-24">
        <div className="pb-3 border-b border-slate-100">
          <p className="font-poppins font-bold text-[11px] text-slate-400 uppercase tracking-wider">
            DAFTAR 20 INDIKATOR BRIDA
          </p>
          <div className="mt-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px]">
            <span className="font-sans text-slate-600 font-medium">Standar Pengukuran IID</span>
            <span className="font-sans font-semibold text-emerald-600">
              {verifiedCount} / {indicators.length} Selesai
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 mt-3 space-y-2.5">
          {indicators.map((item) => {
            const isActive = item.id === activeIndicatorId;
            const isVerified = item.status === "verified";

            return (
              <div
                key={item.id}
                onClick={() => handleSelectIndicator(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none relative ${
                  isActive
                    ? "bg-white border-[#9B1C1C] shadow-xs ring-1 ring-[#9B1C1C]"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <p
                    className={`font-poppins text-xs font-bold leading-tight ${
                      isActive ? "text-[#9B1C1C]" : "text-slate-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1" />
                  ) : isVerified ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                  ) : null}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-[10px] font-sans truncate max-w-[160px] ${
                      isActive ? "text-[#9B1C1C]" : isVerified ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {item.sub}
                  </p>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] font-poppins font-bold ${
                      item.points > 0 ? "bg-[#FEF3C7] text-[#B45309]" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.points.toFixed(1)} pt
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KOLOM 2: DOCUMENT PREVIEW A4 + OCR BOUNDING BOX */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sticky top-24 max-h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.5 font-mono text-[9px] font-bold bg-[#FEE2E2] text-[#9B1C1C] rounded">
              PDF
            </span>
            <p className="font-poppins font-bold text-xs text-slate-800 truncate">
              Bukti_{currentIndicator?.indicator_id || "IND-01"}.pdf
            </p>
          </div>
          <span className="text-[10px] font-sans font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Halaman 1
          </span>
        </div>

        <div className="flex-1 bg-white border border-slate-200/90 rounded-xl p-5 my-2 overflow-y-auto min-h-[520px] flex flex-col justify-between shadow-xs">
          <div className="space-y-3.5">
            <div className="text-center pt-2">
              <h4 className="font-poppins font-extrabold text-[11px] tracking-wider text-slate-900 leading-tight">
                PEMERINTAH KOTA MAKASSAR
              </h4>
              <h5 className="font-poppins font-bold text-[10px] text-slate-800 tracking-tight leading-tight mt-0.5">
                BADAN RISET DAN INOVASI DAERAH
              </h5>
              <div className="mt-2.5 space-y-[2px]">
                <div className="h-[2px] bg-slate-900 w-full" />
                <div className="h-[1px] bg-slate-900 w-full" />
              </div>
            </div>

            <div className="p-3 bg-red-50/50 border border-red-200/70 rounded-lg space-y-1">
              <span className="text-[9px] font-mono text-[#9B1C1C] font-bold block">
                [IDP EXTRACTED METADATA - {currentIndicator?.indicator_id}]
              </span>
              <p className="text-[11px] font-sans font-semibold text-slate-800">
                {currentIndicator?.title}
              </p>
              <p className="text-[10px] font-sans text-slate-600 mt-1">
                <strong>Definisi:</strong> {currentIndicator?.definisi || "Sesuai petunjuk teknis IID."}
              </p>
              <p className="text-[10px] font-sans text-slate-500 mt-1">
                <strong>Ketentuan Bukti:</strong> {currentIndicator?.sub}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-[#065F46] text-[10px] font-poppins font-semibold">
              <Check className="w-3 h-3 text-[#059669] stroke-[3]" />
              <span>Pipeline IDP: TTE &amp; Naskah Valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* KOLOM 3: FORM EVALUASI PARAMETER DINAMIS */}
      <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between max-h-[calc(100vh-140px)] sticky top-24 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <p className="font-poppins font-bold text-[10px] text-slate-400 uppercase tracking-wider">
              EVALUASI PARAMETER ({currentIndicator?.indicator_id} DARI {indicators.length})
            </p>
            <h3 className="font-poppins font-extrabold text-[15px] text-slate-900 mt-0.5 tracking-tight">
              {currentIndicator?.title}
            </h3>
          </div>

          {/* List Parameter Dinamis */}
          {currentIndicator?.parameters && currentIndicator.parameters.length > 0 ? (
            currentIndicator.parameters.map((param, pIdx) => {
              const currentDecision =
                decisions[param.id] ||
                (param.human_decision?.keputusan
                  ? (param.human_decision.keputusan.toLowerCase() as any)
                  : undefined);

              const aiRec = param.ai_assessment?.rekomendasi || "PERLU_REVISI";
              const confPercent = Math.round((param.ai_assessment?.confidence_score || 0.7) * 100);

              return (
                <div
                  key={param.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-poppins font-bold text-xs text-slate-900 leading-snug">
                      Parameter {pIdx + 1}: {param.nama}
                    </h4>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full text-[9.5px] font-poppins font-bold flex items-center gap-1 border ${
                        aiRec === "LOLOS"
                          ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                          : aiRec === "PERLU_REVISI"
                          ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                          : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          aiRec === "LOLOS"
                            ? "bg-[#059669]"
                            : aiRec === "PERLU_REVISI"
                            ? "bg-[#D97706]"
                            : "bg-[#DC2626]"
                        }`}
                      />
                      <span>
                        AI: {aiRec} ({confPercent}%)
                      </span>
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10.5px] text-slate-600 font-sans leading-relaxed">
                    <p className="font-semibold text-slate-800">
                      AI Catatan: {param.ai_assessment?.ai_catatan || "Terpenuhi sesuai bukti dukung."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-sans text-[11px] font-medium text-slate-600">
                      Keputusan Verifikator:
                    </span>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                      {(["lolos", "revisi", "tolak"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectDecision(param.id, opt)}
                          className={`px-3 py-1 text-[11px] font-poppins capitalize rounded-md transition-all ${
                            currentDecision === opt
                              ? opt === "lolos"
                                ? "bg-[#059669] text-white font-bold"
                                : opt === "revisi"
                                ? "bg-[#F59E0B] text-white font-bold"
                                : "bg-[#9B1C1C] text-white font-bold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
              Indikator ini tidak memiliki parameter turunan bertingkat.
            </div>
          )}
        </div>

        {/* Footer Simpan */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={reviewerNote}
            onChange={(e) => setReviewerNote(e.target.value)}
            placeholder="Catatan verifikator untuk indikator ini..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#9B1C1C] transition-colors"
          />
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndNext}
            className={`px-5 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white text-xs font-poppins font-bold rounded-lg shrink-0 shadow-sm transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
              isSaving ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>Simpan &amp; Lanjut Indikator</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* KOMPONEN UTAMA VERIFICATION */
/* =========================== */
export default function Verification({
  onBack,
  documentId = "INV-2026-001",
  documentTitle = "PLATONIK: Literasi Terpadu & Integrasi Karakter",
  opdName = "Dinas Pendidikan Kota Makassar",
}: VerificationProps) {
  const [activeTab, setActiveTab] = useState<"profil" | "indikator">("profil");
  const [innovationData, setInnovationData] = useState<InnovationDetailResponse | null>(null);
  const [indicators, setIndicators] = useState<IndicatorDetailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchInnovationDetail(documentId)
      .then((data) => {
        setInnovationData(data);
        if (data.indicators && data.indicators.length > 0) {
          setIndicators(data.indicators);
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat detail inovasi dari API:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [documentId]);

  const verifiedCount = indicators.filter((i) => i.status === "verified").length;
  const currentTitle = innovationData?.title || documentTitle;
  const currentOpd = innovationData?.opd || opdName;
  const currentPoints = innovationData?.temporaryPoints || 84.0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* 1. TOP BAR */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-poppins font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <h1 className="font-poppins font-bold text-sm text-slate-900 leading-tight">
              Review Evaluasi Usulan Inovasi
            </h1>
            <p className="font-sans text-[11px] text-slate-500">
              SIDARA • Modul Verifikasi Indeks Inovasi Daerah (IID)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-center">
            <span className="block font-poppins font-bold text-xs text-[#B45309] leading-tight">
              {currentPoints.toFixed(2)} Poin
            </span>
            <span className="block font-sans font-bold text-[7.5px] text-[#92400E] uppercase tracking-wider">
              Estimasi Sementara
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="font-sans text-[11px] font-semibold text-[#1D4ED8]">
              Progres: {verifiedCount} / {indicators.length || 20} Selesai
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Seluruh telaah berhasil diverifikasi!")}
            className="px-5 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold shadow-sm transition-all active:scale-95"
          >
            Kirim Telaah
          </button>
        </div>
      </header>

      {/* 2. BODY KONTEN */}
      <main className="flex-1 p-6 max-w-[1720px] w-full mx-auto space-y-5">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#9B1C1C]" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] font-poppins font-bold text-[9px] rounded">
              IMA 2026
            </span>
            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 font-sans font-medium text-[9px] rounded">
              {innovationData?.type || "Inovasi Pelayanan Publik"}
            </span>
          </div>
          <h2 className="font-poppins font-bold text-lg text-slate-900 leading-snug">
            {currentTitle}
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Inisiator: <strong className="text-slate-800 font-semibold">{currentOpd}</strong> • ID:{" "}
            <span className="font-mono text-slate-700 font-semibold">{documentId}</span>
          </p>
        </section>

        {/* Tab Switcher */}
        <section className="inline-flex p-1 bg-slate-200/80 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`px-5 py-2 rounded-lg text-xs font-poppins transition-all ${
              activeTab === "profil"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            1. Profil &amp; Rancang Bangun (Narasi)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("indikator")}
            className={`px-5 py-2 rounded-lg text-xs font-poppins transition-all ${
              activeTab === "indikator"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            2. Evaluasi 20 Bukti Indikator (AI)
          </button>
        </section>

        {/* Render Tab Bersyarat */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#9B1C1C]" />
            <span className="text-sm font-poppins">Memuat data indikator dari backend...</span>
          </div>
        ) : activeTab === "profil" ? (
          <ProfileTabContent
            innovation={innovationData}
            onGoToIndicators={() => setActiveTab("indikator")}
          />
        ) : (
          <IndicatorsTabContent
            documentId={documentId}
            indicators={indicators}
            onUpdateIndicators={setIndicators}
          />
        )}
      </main>
    </div>
  );
}
