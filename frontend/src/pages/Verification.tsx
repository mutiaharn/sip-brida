import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export interface VerificationReviewProps {
  onBack: () => void;
  documentId?: string;
  documentTitle?: string;
  opdName?: string;
}

interface Indicator {
  id: number;
  title: string;
  sub: string;
  status: "active" | "verified" | "pending";
}

const initialIndicators: Indicator[] = [
  { id: 1, title: "1. Regulasi Inovasi Daerah", sub: "SK / Perwali • 3 Parameter AI", status: "active" },
  { id: 2, title: "2. Ketersediaan SDM Pengelola", sub: "Tata Kelola • Terverifikasi Sah", status: "verified" },
  { id: 3, title: "3. Dukungan Anggaran Inovasi", sub: "DPA/RKA • Terverifikasi Sah", status: "verified" },
  { id: 4, title: "4. Profil Potensi & Masalah", sub: "Substansi • Menunggu telaah", status: "pending" },
  { id: 5, title: "5. Kecepatan Penciptaan Inovasi", sub: "Rancang Bangun • Menunggu", status: "pending" },
  { id: 6, title: "6. Kemanfaatan Inovasi", sub: "Dampak Penerima • Menunggu", status: "pending" },
  { id: 7, title: "7. Kepuasan Pengguna (SKM)", sub: "Survei Resmi • Menunggu", status: "pending" },
  { id: 8, title: "8. Tingkat Penggunaan Layanan", sub: "Data Transaksi • Menunggu", status: "pending" },
  { id: 9, title: "9. Sosialisasi Inovasi Daerah", sub: "Publikasi Media • Menunggu", status: "pending" },
  { id: 10, title: "10. Keterlibatan Aktor Inovasi", sub: "Hexahelix • Menunggu", status: "pending" },
  { id: 11, title: "11. Panduan Teknis / SOP", sub: "Naskah SOP • Menunggu", status: "pending" },
  { id: 12, title: "12. Kemudahan Alur Proses", sub: "SOP Layanan • Menunggu", status: "pending" },
  { id: 13, title: "13. Layanan Pengaduan", sub: "Helpdesk & SP4N • Menunggu", status: "pending" },
  { id: 14, title: "14. Sertifikasi HKI / Hak Cipta", sub: "Legalitas Paten • Menunggu", status: "pending" },
  { id: 15, title: "15. Video Dokumentasi Inovasi", sub: "Video Profil • Menunggu", status: "pending" },
  { id: 16, title: "16. Integrasi Sistem / SPBE", sub: "API & Basis Data • Menunggu", status: "pending" },
  { id: 17, title: "17. Replikasi Inovasi", sub: "Adopsi Daerah • Menunggu", status: "pending" },
  { id: 18, title: "18. Keberlanjutan Inovasi", sub: "Rencana Strategis • Menunggu", status: "pending" },
  { id: 19, title: "19. Pengujian & Keamanan Siber", sub: "Audit TIK • Menunggu", status: "pending" },
  { id: 20, title: "20. Validitas Tanda Tangan Elektronik", sub: "Sertifikasi BSrE • Terverifikasi", status: "verified" },
];

export default function Verification({
  onBack,
  documentId = "INV-2026-001",
  documentTitle = "Evaluasi Usulan: Posyandu Digital Terintegrasi",
  opdName = "Dinas Kesehatan Kota Makassar",
}: VerificationReviewProps) {
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [activeIndicatorId, setActiveIndicatorId] = useState<number>(1);

  const [decisions, setDecisions] = useState<{ [paramId: number]: "lolos" | "revisi" | "tolak" }>({
    1: "revisi",
    2: "tolak",
    3: "lolos",
  });

  const [reviewerNote, setReviewerNote] = useState<string>("");

  const handleSelectIndicator = (id: number) => {
    setActiveIndicatorId(id);
    setIndicators((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: item.status === "verified" ? "verified" : "active" };
        }
        if (item.status === "active") {
          return { ...item, status: "pending" };
        }
        return item;
      })
    );
  };

  const handleSaveAndNext = () => {
    setIndicators((prev) =>
      prev.map((item) =>
        item.id === activeIndicatorId ? { ...item, status: "verified" } : item
      )
    );

    if (activeIndicatorId < 20) {
      handleSelectIndicator(activeIndicatorId + 1);
    } else {
      alert("Semua 20 indikator telah selesai ditelaah!");
    }
  };

  const currentIndicator = indicators.find((item) => item.id === activeIndicatorId) || indicators[0];
  const verifiedCount = indicators.filter((i) => i.status === "verified").length;

  return (
    <div className="min-h-screen w-full bg-[#F4F5F8] text-slate-800 font-sans antialiased flex flex-col">

      {/* 1. TOP NAVBAR HEADER */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-poppins font-semibold transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div>
            <h1 className="font-poppins font-bold text-sm text-slate-900 leading-tight">
              {documentTitle}
            </h1>
            <p className="font-sans text-[11px] text-slate-500 mt-0.5">
              {opdName} • ID Usulan: <span className="font-mono text-slate-700 font-semibold">{documentId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="font-sans text-[11.5px] font-semibold text-[#1D4ED8]">
              Progres: {verifiedCount} / 20 Terverifikasi
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Seluruh evaluasi indikator berhasil dikonfirmasi secara final!")}
            className="px-5 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold shadow-sm transition-all active:scale-95"
          >
            Konfirmasi Final
          </button>
        </div>
      </header>

      {/* 2. BODY KONTEN 3-KOLOM */}
      <main className="flex-1 p-5 grid grid-cols-12 gap-5 max-w-[1780px] w-full mx-auto items-start">
        
        {/* KOLOM KIRI: DAFTAR 20 INDIKATOR BRIDA */}
        <section className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col max-h-[calc(100vh-100px)] sticky top-20">
          <div className="pb-3 border-b border-slate-100">
            <p className="font-poppins font-bold text-[11px] text-slate-400 uppercase tracking-wider">
              DAFTAR 20 INDIKATOR BRIDA
            </p>
            <div className="mt-2.5 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px]">
              <span className="font-sans text-slate-600 font-medium">Standar Indeks Inovasi Daerah (IID)</span>
              <span className="font-sans font-semibold text-emerald-600">3 Selesai</span>
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
                      ? "bg-white border-[#9B1C1C] shadow-sm ring-1 ring-[#9B1C1C]"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <p className={`font-poppins text-xs font-bold leading-tight ${isActive ? "text-[#9B1C1C]" : "text-slate-800"}`}>
                      {item.title}
                    </p>
                    
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1" />
                    ) : isVerified ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                    ) : null}
                  </div>

                  <p className={`text-[10px] mt-1 font-sans ${isActive ? "text-[#9B1C1C]" : isVerified ? "text-emerald-700" : "text-slate-400"}`}>
                    {item.sub}
                  </p>
                </div>
              );
            })}

            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
              <span className="text-[10px] font-sans text-slate-500 font-medium">
                + Indikator 13 s.d. 20 (Scroll ke bawah)
              </span>
            </div>
          </div>
        </section>

        {/* KOLOM TENGAH: DOCUMENT PREVIEW A4 */}
        <section className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col sticky top-20 max-h-[calc(100vh-100px)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 truncate">
              <span className="px-1.5 py-0.5 font-mono text-[9px] font-bold bg-[#FEE2E2] text-[#9B1C1C] rounded">
                PDF
              </span>
              <p className="font-poppins font-bold text-xs text-slate-800 truncate">
                SK_Walikota_Makassar_Dinkes.pdf
              </p>
            </div>
            <span className="text-[10px] font-sans font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Hal 1 dari 3
            </span>
          </div>

          <div className="flex-1 bg-white border border-slate-200/90 rounded-xl p-5 my-2 overflow-y-auto flex flex-col justify-between shadow-sm min-h-[580px]">
            <div className="space-y-3.5">
              <div className="text-center pt-2">
                <h3 className="font-poppins font-extrabold text-[11px] tracking-wider text-slate-900 leading-tight">
                  PEMERINTAH KOTA MAKASSAR
                </h3>
                <h4 className="font-poppins font-bold text-[10px] text-slate-800 tracking-tight leading-tight mt-0.5">
                  BADAN RISET DAN INOVASI DAERAH
                </h4>
                
                <div className="mt-2.5 space-y-[2px]">
                  <div className="h-[2px] bg-slate-900 w-full" />
                  <div className="h-[1px] bg-slate-900 w-full" />
                </div>
              </div>

              <div className="mt-4 p-2.5 border border-dashed border-red-500 bg-[#FEF2F2]/60 rounded-md text-center">
                <p className="font-mono text-[9.5px] font-bold text-red-900 tracking-tight">
                  KEPUTUSAN WALIKOTA NOMOR: 054.1/123/BRIDA/2026
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="h-1.5 bg-slate-300 rounded w-full" />
                <div className="h-1.5 bg-slate-200 rounded w-11/12" />
                <div className="h-1.5 bg-slate-200 rounded w-4/5" />
                <div className="h-1.5 bg-slate-200 rounded w-full" />
                <div className="h-1.5 bg-slate-200 rounded w-3/4" />
              </div>

              <div className="pt-2">
                <p className="font-poppins font-bold text-[9.5px] text-slate-800">
                  MEMUTUSKAN:
                </p>
                <div className="space-y-2 mt-1.5">
                  <div className="h-1.5 bg-slate-300 rounded w-full" />
                  <div className="h-1.5 bg-slate-200 rounded w-11/12" />
                  <div className="h-1.5 bg-slate-200 rounded w-4/5" />
                  <div className="h-1.5 bg-slate-200 rounded w-10/12" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pt-6 border-t border-slate-100 space-y-2.5">
              <div className="w-16 h-16 bg-slate-950 rounded-lg p-1.5 flex items-center justify-center shadow-xs">
                <div className="grid grid-cols-3 gap-1 w-full h-full p-1 bg-white rounded-xs">
                  <div className="bg-black" />
                  <div className="bg-transparent" />
                  <div className="bg-black" />
                  <div className="bg-transparent" />
                  <div className="bg-black" />
                  <div className="bg-transparent" />
                  <div className="bg-black" />
                  <div className="bg-transparent" />
                  <div className="bg-black" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-[#065F46] text-[10px] font-poppins font-semibold">
                <Check className="w-3 h-3 text-[#059669] stroke-[3]" />
                <span>TTE BSrE Sah &amp; Valid</span>
              </div>
            </div>
          </div>
        </section>

        {/* KOLOM KANAN: EVALUASI PARAMETER */}
        <section className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between max-h-[calc(100vh-100px)] sticky top-20 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <p className="font-poppins font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                EVALUASI PARAMETER (INDIKATOR {currentIndicator.id} DARI 20)
              </p>
              <h2 className="font-poppins font-extrabold text-[15px] text-slate-900 mt-0.5 tracking-tight">
                {currentIndicator.title} (Naskah SK &amp; Regulasi Formal)
              </h2>
            </div>

            {/* CARD PARAMETER 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-poppins font-bold text-xs text-slate-900 leading-snug">
                  Parameter 1: Verifikasi Keaslian &amp; Legalitas SK Penetapan
                </h4>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[9.5px] font-poppins font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  <span>AI: Perlu Revisi (68%)</span>
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10.5px] text-slate-600 font-sans leading-relaxed">
                <p className="font-semibold text-slate-800">
                  AI Catatan: Naskah dinas terunggah lengkap, namun nomor registrasi tidak sinkron di database SIGAP.
                </p>
                <p className="text-[9.5px] text-slate-400 mt-0.5 font-normal">
                  Deteksi: PyZBar QR OK • Bounding Box SK Valid • Hash SHA-256 Sesuai
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-[11px] font-medium text-slate-600">
                  Keputusan Verifikator:
                </span>
                
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 1: "lolos" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[1] === "lolos"
                        ? "bg-[#059669] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Lolos
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 1: "revisi" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[1] === "revisi"
                        ? "bg-[#F59E0B] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 1: "tolak" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[1] === "tolak"
                        ? "bg-[#9B1C1C] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>

            {/* CARD PARAMETER 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-poppins font-bold text-xs text-slate-900 leading-snug">
                  Parameter 2: Kesesuaian Diktum Penetapan dengan Ranperda
                </h4>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[9.5px] font-poppins font-bold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>AI: Tidak Lolos (42%)</span>
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10.5px] text-slate-600 font-sans leading-relaxed">
                <p className="font-semibold text-slate-800">
                  AI Catatan: Klausul bab menimbang tidak memuat rujukan Perwali Makassar No. 20 Tahun 2024.
                </p>
                <p className="text-[9.5px] text-slate-400 mt-0.5 font-normal">
                  Peringatan: Verifikator wajib memeriksa keabsahan draft lampiran legal drafting.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-[11px] font-medium text-slate-600">
                  Keputusan Verifikator:
                </span>
                
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 2: "lolos" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[2] === "lolos"
                        ? "bg-[#059669] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Lolos
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 2: "revisi" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[2] === "revisi"
                        ? "bg-[#F59E0B] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 2: "tolak" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[2] === "tolak"
                        ? "bg-[#9B1C1C] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>

            {/* CARD PARAMETER 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-poppins font-bold text-xs text-slate-900 leading-snug">
                  Parameter 3: Keabsahan Tanda Tangan &amp; Stempel Digital Resmi
                </h4>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[9.5px] font-poppins font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  <span>AI: Lolos (94%)</span>
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10.5px] text-slate-600 font-sans leading-relaxed">
                <p className="font-semibold text-slate-800">
                  AI Catatan: Sertifikat digital terdeteksi valid, diterbitkan resmi oleh Balai Sertifikasi Elektronik (BSrE).
                </p>
                <p className="text-[9.5px] text-slate-400 mt-0.5 font-normal">
                  Validasi: Penandatangan Walikota Makassar • Integritas Dokumen Asli
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-[11px] font-medium text-slate-600">
                  Keputusan Verifikator:
                </span>
                
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 3: "lolos" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[3] === "lolos"
                        ? "bg-[#059669] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Lolos
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 3: "revisi" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[3] === "revisi"
                        ? "bg-[#F59E0B] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 3: "tolak" })}
                    className={`px-4 py-1 text-[11px] font-poppins transition-all rounded-md ${
                      decisions[3] === "tolak"
                        ? "bg-[#9B1C1C] text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER CATATAN & TOMBOL SIMPAN */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3">
            <input
              type="text"
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Catatan tambahan verifikator untuk Indikator 1 (opsional)..."
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#9B1C1C] transition-colors"
            />
            <button
              type="button"
              onClick={handleSaveAndNext}
              className="px-5 py-2.5 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white text-xs font-poppins font-bold rounded-lg shrink-0 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              Simpan &amp; Lanjut Indikator
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}