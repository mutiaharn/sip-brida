import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

export interface VerificationProps {
  onBack: () => void;
  documentId?: string;
  documentTitle?: string;
  opdName?: string;
}

export interface IndicatorItem {
  id: number;
  title: string;
  sub: string;
  points: number;
  status: "active" | "verified" | "pending";
}

const initialIndicators: IndicatorItem[] = [
  { id: 1, title: "1. Regulasi Inovasi Daerah", sub: "SK Kepala Daerah / Perwali", points: 3.0, status: "active" },
  { id: 2, title: "2. Ketersediaan dan peran SDM", sub: "SK Tim Pengelola Inovasi", points: 3.0, status: "verified" },
  { id: 3, title: "3. Dukungan Anggaran", sub: "Dokumen DPA / RKA Anggaran", points: 3.0, status: "verified" },
  { id: 4, title: "4. Wahana Inovasi", sub: "Bimtek / Pelatihan Pengelola", points: 0.0, status: "pending" },
  { id: 5, title: "5. Rancang Bangun Inovasi Daerah", sub: "Pokok Perubahan & Narasi", points: 0.0, status: "pending" },
  { id: 6, title: "6. Pedoman Teknis / Juknis", sub: "Buku Panduan / SOP Layanan", points: 0.0, status: "pending" },
  { id: 7, title: "7. Penggunaan Sumber Daya Inovasi", sub: "Pemanfaatan Sarana Prasarana", points: 0.0, status: "pending" },
  { id: 8, title: "8. Sosialisasi Inovasi Daerah", sub: "Dokumentasi Publikasi Media", points: 0.0, status: "pending" },
  { id: 9, title: "9. Keterlibatan Aktor Inovasi", sub: "Kolaborasi Pemangku Kepentingan", points: 0.0, status: "pending" },
  { id: 10, title: "10. Kemudahan Informasi Layanan", sub: "Kanal Informasi Publik", points: 0.0, status: "pending" },
  { id: 11, title: "11. Penyelesaian Layanan Pengaduan", sub: "Kanal SP4N / Media Aduan", points: 0.0, status: "pending" },
  { id: 12, title: "12. Kemudahan Proses Inovasi", sub: "Efisiensi SOP & Alur Layanan", points: 0.0, status: "pending" },
  { id: 13, title: "13. Kepuasan Pengguna", sub: "Survei SKM Penerima Layanan", points: 0.0, status: "pending" },
  { id: 14, title: "14. Sistem Monev Internal", sub: "Laporan Evaluasi Rutin OPD", points: 0.0, status: "pending" },
  { id: 15, title: "15. Kecepatan Penciptaan Inovasi", sub: "Linimasa Rancang Bangun", points: 0.0, status: "pending" },
  { id: 16, title: "16. Kemanfaatan Inovasi Daerah", sub: "Data Penerima Manfaat Nyata", points: 0.0, status: "pending" },
  { id: 17, title: "17. Replikasi Inovasi Daerah", sub: "Adopsi Unit Kerja / Daerah Lain", points: 0.0, status: "pending" },
  { id: 18, title: "18. Aksesibilitas Kelompok Rentan", sub: "Fasilitas Ramah Disabilitas", points: 0.0, status: "pending" },
  { id: 19, title: "19. Integrasi Program Inovasi", sub: "Keterpaduan Sistem SPBE", points: 0.0, status: "pending" },
  { id: 20, title: "20. Kualitas Hasil Inovasi Daerah", sub: "Capaian Indikator Kinerja Utama", points: 3.0, status: "verified" },
];

/* TAB 1: PROFIL & RANCANG BANGUN */
/* ============================== */
function ProfileTabContent({ onGoToIndicators }: { onGoToIndicators: () => void }) {
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
                Inovasi Pelayanan Publik
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Waktu Penerapan Resmi</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                01 Jan 2025 s.d. Sekarang
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
                1. Latar Belakang &amp; Analisis Kebutuhan:
              </h4>
              <p className="text-slate-600">
                Rendahnya indeks literasi membaca peserta didik sekolah dasar di kawasan pesisir dan lorong padat Kota Makassar menjadi dasar perancangan program.
              </p>
            </div>
            <div>
              <h4 className="font-poppins font-bold text-slate-900 mb-0.5">
                2. Pokok Perubahan (Kebaruan Sistem):
              </h4>
              <p className="text-slate-600">
                PLATONIK memadukan bahan ajar kurikulum merdeka dengan pendampingan langsung di lorong wisata dan pelacakan perkembangan minat baca siswa.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            C. Dampak &amp; Kemanfaatan Nyata
          </h3>
          <div className="mt-3.5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5 font-sans text-slate-700">
            <p>• Peningkatan skor capaian literasi dan numerasi sebesar 28,4% pada sekolah dasar piloting.</p>
            <p>• Terdistribusinya 1.500 modul baca inklusif dan ruang baca terbuka ramah anak pada 15 kecamatan.</p>
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
                Rp 185.000.000 (T.A. 2026)
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-[10px] font-sans text-slate-500 font-medium">Legalitas Tim Pelaksana</p>
              <p className="font-poppins font-bold text-xs text-slate-800 mt-1">
                SK Kadisdik No. 800/142/Disdik/2026
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
          <p className="text-emerald-700 font-medium">✓ Panjang narasi: 420 kata (Memenuhi syarat min. 300 kata)</p>
          <p className="text-emerald-700 font-medium">✓ 5 Unsur rancang bangun terdeteksi lengkap</p>
          <p className="text-emerald-700 font-medium">✓ Nilai orisinalitas ide: 92% (Tingkat kebaruan tinggi)</p>
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
            Verifikasi keabsahan naskah SK, SOP, DPA anggaran, dan video dokumentasi (20 Indikator) melalui viewer AI OCR.
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

/* TAB 2: EVALUASI 20 INDIKATOR  */
/* ============================= */
function IndicatorsTabContent({
  indicators,
  onUpdateIndicators,
}: {
  indicators: IndicatorItem[];
  onUpdateIndicators: (updated: IndicatorItem[]) => void;
}) {
  const [activeIndicatorId, setActiveIndicatorId] = useState<number>(1);
  const [decisions, setDecisions] = useState<{ [paramId: number]: "lolos" | "revisi" | "tolak" }>({
    1: "revisi",
    2: "tolak",
    3: "lolos",
  });
  const [reviewerNote, setReviewerNote] = useState<string>("");

  const handleSelectIndicator = (id: number) => {
    setActiveIndicatorId(id);
    onUpdateIndicators(
      indicators.map((item) => {
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
    onUpdateIndicators(
      indicators.map((item) =>
        item.id === activeIndicatorId ? { ...item, status: "verified" } : item
      )
    );
    if (activeIndicatorId < 20) {
      handleSelectIndicator(activeIndicatorId + 1);
    } else {
      alert("Seluruh 20 indikator telah selesai ditelaah!");
    }
  };

  const currentIndicator = indicators.find((item) => item.id === activeIndicatorId) || indicators[0];

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
                    ? "bg-white border-[#9B1C1C] shadow-xs ring-1 ring-[#9B1C1C]"
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

                <div className="flex items-center justify-between mt-1">
                  <p className={`text-[10px] font-sans ${isActive ? "text-[#9B1C1C]" : isVerified ? "text-emerald-700" : "text-slate-400"}`}>
                    {item.sub}
                  </p>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-poppins font-bold ${
                    item.points > 0 ? "bg-[#FEF3C7] text-[#B45309]" : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.points.toFixed(2)} pt
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
              SK_Walikota_Makassar_Dinkes.pdf
            </p>
          </div>
          <span className="text-[10px] font-sans font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Hal 1 dari 3
          </span>
        </div>

        <div className="flex-1 bg-white border border-slate-200/90 rounded-xl p-5 my-2 overflow-y-auto min-h-[580px] flex flex-col justify-between shadow-xs">
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

            <div className="mt-4 p-2.5 border border-dashed border-red-500 bg-[#FEF2F2]/60 rounded-md text-center">
              <p className="font-mono text-[9.5px] font-bold text-red-900 tracking-tight">
                KEPUTUSAN WALIKOTA NOMOR: 054.1/123/BRIDA/2026
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="h-1.5 bg-slate-300 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-11/12" />
              <div className="h-1.5 bg-slate-200 rounded w-4/5" />
            </div>

            <div className="pt-2">
              <p className="font-poppins font-bold text-[9.5px] text-slate-800">
                MEMUTUSKAN:
              </p>
              <div className="space-y-2 mt-1.5">
                <div className="h-1.5 bg-slate-300 rounded w-full" />
                <div className="h-1.5 bg-slate-200 rounded w-11/12" />
                <div className="h-1.5 bg-slate-200 rounded w-4/5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-6 border-t border-slate-100 space-y-2">
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
      </div>

      {/* KOLOM 3: FORM EVALUASI PARAMETER */}
      <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between max-h-[calc(100vh-140px)] sticky top-24 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <p className="font-poppins font-bold text-[10px] text-slate-400 uppercase tracking-wider">
              EVALUASI PARAMETER (INDIKATOR {currentIndicator.id} DARI 20)
            </p>
            <h3 className="font-poppins font-extrabold text-[15px] text-slate-900 mt-0.5 tracking-tight">
              {currentIndicator.title} (Naskah SK &amp; Regulasi Formal)
            </h3>
          </div>

          {/* Parameter 1 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
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
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-sans text-[11px] font-medium text-slate-600">Keputusan Verifikator:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                {(["lolos", "revisi", "tolak"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 1: opt })}
                    className={`px-4 py-1 text-[11px] font-poppins capitalize rounded-md transition-all ${
                      decisions[1] === opt
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

          {/* Parameter 2 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
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
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-sans text-[11px] font-medium text-slate-600">Keputusan Verifikator:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                {(["lolos", "revisi", "tolak"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 2: opt })}
                    className={`px-4 py-1 text-[11px] font-poppins capitalize rounded-md transition-all ${
                      decisions[2] === opt
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

          {/* Parameter 3 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
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
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-sans text-[11px] font-medium text-slate-600">Keputusan Verifikator:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white gap-1">
                {(["lolos", "revisi", "tolak"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDecisions({ ...decisions, 3: opt })}
                    className={`px-4 py-1 text-[11px] font-poppins capitalize rounded-md transition-all ${
                      decisions[3] === opt
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
        </div>

        {/* Footer Simpan */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={reviewerNote}
            onChange={(e) => setReviewerNote(e.target.value)}
            placeholder="Catatan tambahan verifikator untuk Indikator ini (opsional)..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#9B1C1C] transition-colors"
          />
          <button
            type="button"
            onClick={handleSaveAndNext}
            className="px-5 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white text-xs font-poppins font-bold rounded-lg shrink-0 shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            Simpan &amp; Lanjut Indikator
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
  documentTitle = "PLATONIK: Program Literasi Terpadu, Optimalisasi Kognitif, dan Integrasi Karakter",
  opdName = "Dinas Pendidikan Kota Makassar",
}: VerificationProps) {
  const [activeTab, setActiveTab] = useState<"profil" | "indikator">("profil");
  const [indicators, setIndicators] = useState<IndicatorItem[]>(initialIndicators);

  const verifiedCount = indicators.filter((i) => i.status === "verified").length;

  return (
    <div className="min-h-screen w-full bg-[#F4F5F8] text-slate-800 font-sans antialiased flex flex-col">
    
      {/* 1. TOP NAVBAR HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-poppins font-semibold transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
              84.00 Poin
            </span>
            <span className="block font-sans font-bold text-[7.5px] text-[#92400E] uppercase tracking-wider">
              Estimasi Sementara
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="font-sans text-[11px] font-semibold text-[#1D4ED8]">
              Progres: {verifiedCount} / 20 Selesai
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Seluruh telaah berhasil dikirim ke pimpinan BRIDA!")}
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
              Kategori: Tata Kelola &amp; Layanan
            </span>
          </div>
          <h2 className="font-poppins font-bold text-lg text-slate-900 leading-snug">
            {documentTitle}
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Inisiator: <strong className="text-slate-800 font-semibold">{opdName}</strong> • PIC:{" "}
            <strong className="text-slate-800 font-semibold">Dr. Sarwinah S.Pd., M.Pd</strong> (08124486746) • ID:{" "}
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
        {activeTab === "profil" ? (
          <ProfileTabContent onGoToIndicators={() => setActiveTab("indikator")} />
        ) : (
          <IndicatorsTabContent
            indicators={indicators}
            onUpdateIndicators={setIndicators}
          />
        )}
      </main>
    </div>
  );
}