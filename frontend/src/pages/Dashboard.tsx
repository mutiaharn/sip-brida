import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Inbox,
  FileCheck,
  Building2,
  Search,
  Plus,
  FileText,
  Sparkles,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";
import UploadPopUp from "../components/UploadPopUp";
import {
  fetchInnovations,
  fetchDocuments,
  fetchStats,
} from "../services/api";
import type { ExtractedDocumentItem } from "../services/api";

export interface DocumentItem {
  id: string;
  date: string;
  title: string;
  opd: string;
  picName: string;
  picPhone: string;
  temporaryPoints: number;
  evidenceFilled: number;
  totalEvidence: number;
  ocrStatus: "Tanda Tangan Sah" | "Stempel Kurang Jelas";
  accuracy: number;
}

interface DashboardProps {
  onLogout?: () => void;
  onSelectReview?: (item: DocumentItem) => void;
}

const defaultMockDocuments: DocumentItem[] = [
  {
    id: "INV-2026-001",
    date: "28 Sep 2026",
    title: "PLATONIK: Literasi Terpadu & Integrasi Karakter",
    opd: "Dinas Pendidikan Kota Makassar",
    picName: "Dr. Sarwinah S.Pd., M.Pd",
    picPhone: "08124486746",
    temporaryPoints: 84.0,
    evidenceFilled: 17,
    totalEvidence: 20,
    ocrStatus: "Tanda Tangan Sah",
    accuracy: 96.2,
  },
  {
    id: "INV-2026-002",
    date: "29 Sep 2026",
    title: "Digitalisasi Posyandu Pintar Terpadu",
    opd: "Dinas Kesehatan Kota Makassar",
    picName: "Mulyadi",
    picPhone: "082189271789",
    temporaryPoints: 18.0,
    evidenceFilled: 3,
    totalEvidence: 20,
    ocrStatus: "Stempel Kurang Jelas",
    accuracy: 68.0,
  },
  {
    id: "INV-2026-003",
    date: "30 Sep 2026",
    title: "Sistem Monitoring Genangan Air & Drainase",
    opd: "Dinas Pekerjaan Umum Kota Makassar",
    picName: "Ahmad, S.T.",
    picPhone: "082296562847",
    temporaryPoints: 43.0,
    evidenceFilled: 10,
    totalEvidence: 20,
    ocrStatus: "Tanda Tangan Sah",
    accuracy: 91.5,
  },
];

export default function Dashboard({ onLogout, onSelectReview }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState<"Beranda" | "Antrean" | "Validasi" | "OPD">("Beranda");
  const [activeTab, setActiveTab] = useState<string>("Semua Usulan");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultMockDocuments);
  const [extractedDocs, setExtractedDocs] = useState<ExtractedDocumentItem[]>([]);
  const [stats, setStats] = useState<{
    total_documents: number;
    needs_review_count: number;
    total_qr_verified: number;
    latest_accuracy: number;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const loadData = () => {
    fetchInnovations()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: DocumentItem[] = data.map((d) => ({
            id: d.id,
            date: d.created_at
              ? new Date(d.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Nov 2026",
            title: d.title,
            opd: d.opd,
            picName: d.picName,
            picPhone: d.picPhone,
            temporaryPoints: d.temporaryPoints,
            evidenceFilled: d.evidenceFilled,
            totalEvidence: d.totalEvidence,
            ocrStatus: d.ocrStatus,
            accuracy: d.accuracy,
          }));
          setDocuments(mapped);
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat inovasi dari backend:", err);
      });

    fetchStats()
      .then((s) => setStats(s))
      .catch(() => {});

    fetchDocuments()
      .then((docs) => setExtractedDocs(docs))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter daftar usulan sesuai tab dan pencarian
  const filteredDocuments = documents.filter((item) => {
    // Tab filter
    if (activeTab === "Menunggu Review") {
      if (item.evidenceFilled >= item.totalEvidence && item.ocrStatus === "Tanda Tangan Sah") return false;
    } else if (activeTab === "Perlu Perbaikan") {
      if (item.ocrStatus !== "Stempel Kurang Jelas") return false;
    } else if (activeTab === "Terverifikasi") {
      if (item.evidenceFilled < 10) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.opd.toLowerCase().includes(q) ||
        item.picName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredDocuments.length / pageSize) || 1;
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tabsList = [
    { name: "Semua Usulan", count: documents.length },
    {
      name: "Menunggu Review",
      count: documents.filter((d) => d.evidenceFilled < d.totalEvidence || d.ocrStatus === "Stempel Kurang Jelas").length,
    },
    {
      name: "Perlu Perbaikan",
      count: documents.filter((d) => d.ocrStatus === "Stempel Kurang Jelas").length,
    },
    {
      name: "Terverifikasi",
      count: documents.filter((d) => d.evidenceFilled >= 10).length,
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#F4F5F8] text-slate-800 font-sans antialiased relative">
      {/* 1. SIDEBAR NAVIGASI */}
      <aside className="w-60 min-h-screen bg-[#15121E] text-slate-300 flex flex-col justify-between shrink-0 select-none sticky top-0 h-screen">
        <div>
          {/* Header Brand SIDARA */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-8">
            <img
              src="/images/Logo-Dashboard.svg"
              alt="Logo SIDARA"
              className="w-10 h-10 object-contain shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("Logo-Dashboard.svg")) {
                  target.src = "/images/Logo-Dashboard.svg";
                }
              }}
            />
            <div>
              <h1 className="font-poppins font-black text-sm text-white tracking-wider leading-tight">
                SIDARA
              </h1>
              <p className="text-[8px] text-slate-400 font-normal leading-tight mt-0.5">
                Sistem Dashboard Analisis dan <br /> Penilaian Inovasi BRIDA
              </p>
            </div>
          </div>

          {/* Navigasi Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveMenu("Beranda");
                setActiveTab("Semua Usulan");
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-xs font-medium transition-all ${
                activeMenu === "Beranda"
                  ? "bg-[#291722] text-white border-r-4 border-[#A61F1B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-[#A61F1B]" />
                <span className="font-poppins font-semibold">Beranda</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveMenu("Antrean");
                setActiveTab("Menunggu Review");
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-xs font-medium transition-all ${
                activeMenu === "Antrean"
                  ? "bg-[#291722] text-white border-r-4 border-[#A61F1B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 text-slate-400" />
                <span>Antrean Usulan</span>
              </div>
              <span className="text-[10px] font-bold bg-[#3A1D28] text-[#F87171] px-2 py-0.5 rounded-full">
                {documents.filter((d) => d.evidenceFilled < d.totalEvidence).length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("Validasi")}
              className={`w-full flex items-center justify-between px-6 py-3 text-xs font-medium transition-all ${
                activeMenu === "Validasi"
                  ? "bg-[#291722] text-white border-r-4 border-[#A61F1B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-slate-400" />
                <span>Validasi Naskah IDP</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {extractedDocs.length || stats?.total_documents || 40}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("OPD")}
              className={`w-full flex items-center gap-3 px-6 py-3 text-xs font-medium transition-all ${
                activeMenu === "OPD"
                  ? "bg-[#291722] text-white border-r-4 border-[#A61F1B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Direktori OPD</span>
            </button>
          </nav>
        </div>

        {/* Profil Verifikator Bawah & Tombol Logout */}
        <div
          onClick={onLogout}
          className="p-4 mx-4 mb-6 bg-[#1D1929] hover:bg-[#282338] border border-white/5 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
          title="Klik untuk keluar (Logout)"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#A61F1B] flex items-center justify-center font-bold text-xs text-white">
              B
            </div>
            <div className="min-w-0">
              <p className="font-poppins font-bold text-[11px] text-white truncate">
                Tim Verifikator
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                BRIDA Makassar
              </p>
            </div>
          </div>
          <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="font-poppins font-bold text-base text-slate-900">
            {activeMenu === "Beranda"
              ? "Beranda"
              : activeMenu === "Antrean"
              ? "Antrean Usulan Inovasi"
              : activeMenu === "Validasi"
              ? "Validasi Naskah & Dokumen IDP"
              : "Direktori OPD Kota Makassar"}
          </h2>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-sans text-[11px] font-semibold text-[#065F46]">
              Verifikator Aktif
            </span>
          </div>
        </header>

        <main className="p-8 space-y-6 max-w-[1500px]">
          {/* Header Sapaan + Search + Tombol Unggah */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-poppins font-extrabold text-2xl text-slate-900 tracking-tight">
                {activeMenu === "Beranda" && "Selamat Datang, BRIDA!"}
                {activeMenu === "Antrean" && "Antrean Evaluasi Inovasi Daerah"}
                {activeMenu === "Validasi" && "Hasil Ekstraksi Pipeline IDP 5-Tahap"}
                {activeMenu === "OPD" && "Daftar Perangkat Daerah (OPD) Pengusul"}
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1">
                {activeMenu === "Beranda" &&
                  "Berikut ringkasan berkas inovasi daerah dan antrean verifikasi Anda hari ini"}
                {activeMenu === "Antrean" &&
                  "Usulan inovasi OPD yang menunggu penetapan rekomendasi dan konfirmasi indikator"}
                {activeMenu === "Validasi" &&
                  "Daftar 40 berkas PDF bukti yang diproses otomatis dengan deteksi OCR, NIP, tanggal, dan QR TTE"}
                {activeMenu === "OPD" &&
                  "Sebaran usulan inovasi daerah per instansi/OPD di lingkungan Pemerintah Kota Makassar"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64 xl:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari usulan, OPD, nomor..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A61F1B] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Unggah Dokumen</span>
              </button>
            </div>
          </div>

          {/* 3. EMPAT KARTU RINGKASAN KPI (BERANDA & ANTREAN) */}
          {(activeMenu === "Beranda" || activeMenu === "Antrean") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500 font-medium">Total Berkas</p>
                  <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                    {stats?.total_documents || documents.length} Berkas
                  </h4>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500 font-medium">Akurasi IDP</p>
                  <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                    {stats?.latest_accuracy ? `${stats.latest_accuracy}%` : "88.0%"}
                  </h4>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500 font-medium">Perlu Review</p>
                  <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                    {stats?.needs_review_count || documents.filter((d) => d.evidenceFilled < d.totalEvidence).length} Berkas
                  </h4>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#059669] stroke-[2.5]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500 font-medium">QR TTE Terverifikasi</p>
                  <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                    {stats?.total_qr_verified || 15} Berkas
                  </h4>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 1: BERANDA & ANTREAN (TABEL USULAN INOVASI) */}
          {(activeMenu === "Beranda" || activeMenu === "Antrean") && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              {/* Header Tabs Filter */}
              <div className="px-6 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {tabsList.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => {
                        setActiveTab(tab.name);
                        setCurrentPage(1);
                      }}
                      className={`py-4 text-xs font-poppins transition-all relative flex items-center gap-2 ${
                        activeTab === tab.name
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>{tab.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                          activeTab === tab.name
                            ? "bg-[#9B1C1C] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                      {activeTab === tab.name && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9B1C1C] rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabel Inovasi */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Judul Proposal &amp; Asal OPD</th>
                      <th className="py-4 px-6">Operator (PIC)</th>
                      <th className="py-4 px-6">Poin Sementara</th>
                      <th className="py-4 px-6">Status 20 Evidence</th>
                      <th className="py-4 px-6">Hasil OCR</th>
                      <th className="py-4 px-6 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* 1. Judul & OPD */}
                          <td className="py-4 px-6 max-w-sm align-middle">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-block px-2 py-0.5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#9B1C1C] font-mono text-[9.5px] font-bold rounded">
                                {item.id}
                              </span>
                              <span className="text-[11px] text-slate-400 font-sans">
                                • {item.date}
                              </span>
                            </div>
                            <p className="font-poppins font-bold text-slate-900 leading-snug">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.opd}
                            </p>
                          </td>

                          {/* 2. Operator (PIC) */}
                          <td className="py-4 px-6 whitespace-nowrap align-middle">
                            <p className="font-poppins font-semibold text-slate-800 text-[11px]">
                              {item.picName}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                              {item.picPhone}
                            </p>
                          </td>

                          {/* 3. Estimasi Poin */}
                          <td className="py-4 px-6 whitespace-nowrap align-middle">
                            <div className="inline-block px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg">
                              <span className="font-poppins font-bold text-xs text-[#B45309]">
                                {item.temporaryPoints.toFixed(2)}
                              </span>
                              <span className="block text-[7.5px] font-sans font-bold text-[#92400E] uppercase tracking-wider">
                                ESTIMASI POIN
                              </span>
                            </div>
                          </td>

                          {/* 4. Progres Evidence */}
                          <td className="py-4 px-6 whitespace-nowrap align-middle">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-sans font-semibold text-slate-700">
                                {item.evidenceFilled}/{item.totalEvidence} Terisi
                              </span>
                            </div>
                            <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.evidenceFilled >= 15
                                    ? "bg-[#10B981]"
                                    : item.evidenceFilled >= 8
                                    ? "bg-[#10B981]"
                                    : "bg-[#F59E0B]"
                                }`}
                                style={{
                                  width: `${(item.evidenceFilled / item.totalEvidence) * 100}%`,
                                }}
                              />
                            </div>
                          </td>

                          {/* 5. Hasil Analisis OCR */}
                          <td className="py-4 px-6 whitespace-nowrap align-middle">
                            {item.ocrStatus === "Tanda Tangan Sah" ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-semibold bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Tanda Tangan Sah</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-semibold bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309]">
                                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                                <span>Stempel Kurang Jelas</span>
                              </div>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1 font-sans">
                              Akurasi AI:{" "}
                              <span className="font-bold text-slate-700 font-mono">
                                {item.accuracy}%
                              </span>
                            </p>
                          </td>

                          {/* 6. Tombol Review Berkas */}
                          <td className="py-4 px-6 text-right whitespace-nowrap align-middle">
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectReview) {
                                  onSelectReview(item);
                                }
                              }}
                              className="px-4 py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold transition-all shadow-sm active:scale-95"
                            >
                              Review Berkas
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ada usulan inovasi yang cocok dengan kriteria pencarian atau tab ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bawah */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">
                  Menampilkan{" "}
                  {filteredDocuments.length === 0
                    ? 0
                    : (currentPage - 1) * pageSize + 1}
                  –
                  {Math.min(currentPage * pageSize, filteredDocuments.length)} dari{" "}
                  {filteredDocuments.length} total berkas usulan
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-xs transition-colors ${
                      currentPage <= 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 flex items-center justify-center rounded font-poppins font-bold text-xs transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#9B1C1C] text-white shadow-xs"
                            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={`w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-xs transition-colors ${
                      currentPage >= totalPages
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: VALIDASI NASKAH IDP (DAFTAR DOKUMEN ASLI DARI DATABASE) */}
          {activeMenu === "Validasi" && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-sm text-slate-900">
                    Berkas Naskah Dinas Terdaftar di Basis Data IDP
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Menampilkan {extractedDocs.length} dokumen PDF bukti Kota Makassar yang diproses oleh pipeline IDP.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="px-3.5 py-1.5 bg-[#9B1C1C] text-white rounded-lg text-xs font-poppins font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Proses Berkas Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-6">ID / Berkas PDF</th>
                      <th className="py-3 px-6">Metadata Terdeteksi</th>
                      <th className="py-3 px-6">Tipe Dokumen</th>
                      <th className="py-3 px-6">TTE / Srikandi</th>
                      <th className="py-3 px-6">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extractedDocs.slice(0, 15).map((doc) => {
                      const ext = doc.extractions?.[0];
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-mono text-[11px] text-slate-700">
                            <span className="font-bold text-[#9B1C1C]">#{doc.id}</span>
                            <p className="text-[10px] text-slate-500 font-sans truncate max-w-xs mt-0.5">
                              {doc.original_filename}
                            </p>
                            <span className="text-[9px] text-slate-400 font-sans">
                              {doc.page_count} Halaman
                            </span>
                          </td>
                          <td className="py-3.5 px-6 max-w-sm">
                            <p className="font-poppins font-bold text-slate-900 truncate">
                              {ext?.nomor_surat || "Nomor tidak terdeteksi"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {ext?.instansi || "Pemerintah Kota Makassar"}
                            </p>
                            <p className="text-[9.5px] text-slate-400 mt-0.5">
                              {ext?.tanggal_surat || "-"} {ext?.nama_pejabat ? `• ${ext.nama_pejabat}` : ""}
                            </p>
                          </td>
                          <td className="py-3.5 px-6">
                            {doc.is_scanned ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                Scan Fisik (OCR)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Digital Asli
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6">
                            {ext?.verification_url ? (
                              <a
                                href={ext.verification_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                              >
                                <span>Verifikasi TTE</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                (ext?.confidence_score || 0) >= 0.7
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {Math.round((ext?.confidence_score || 0) * 100)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: DIREKTORI OPD (KARTU OPD MAKASSAR) */}
          {activeMenu === "OPD" && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-sm text-slate-900">
                    Perangkat Daerah Aktif Berinovasi
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daftar OPD di Kota Makassar yang telah mendaftarkan inovasi ke portal SIDARA BRIDA.
                  </p>
                </div>
                <span className="text-xs font-poppins font-bold text-[#9B1C1C]">
                  {documents.length} Inovasi Terdaftar
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {documents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#9B1C1C]">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono text-[10px] font-bold">
                          {item.id}
                        </span>
                      </div>

                      <h4 className="font-poppins font-bold text-sm text-slate-900 leading-snug">
                        {item.opd}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        Inovasi: "{item.title}"
                      </p>

                      <div className="mt-3 p-3 bg-slate-50 rounded-xl text-[11px] font-sans text-slate-600 space-y-1">
                        <p>
                          <strong>PIC:</strong> {item.picName}
                        </p>
                        <p>
                          <strong>Kontak:</strong> {item.picPhone}
                        </p>
                        <p>
                          <strong>Estimasi Skor:</strong>{" "}
                          <span className="font-bold text-[#9B1C1C]">
                            {item.temporaryPoints.toFixed(2)} Poin
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectReview) onSelectReview(item);
                      }}
                      className="w-full py-2 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold shadow-sm transition-all text-center"
                    >
                      Buka Review Berkas Inovasi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 5. POPUP UNGGAH DOKUMEN */}
      <UploadPopUp
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStartExtraction={() => {
          loadData();
        }}
      />
    </div>
  );
}
