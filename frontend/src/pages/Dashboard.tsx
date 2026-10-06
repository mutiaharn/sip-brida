import React, { useState } from "react";
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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import UploadPopUp from "../components/UploadPopUp";

export interface DocumentItem {
  id: string;
  date: string;
  title: string;
  opd: string;
  attachmentCount: number;
  ocrStatus: "Tanda Tangan Sah" | "Stempel Kurang Jelas";
  accuracy: number;
}

interface DashboardProps {
  onLogout?: () => void;
  onSelectReview?: (item: DocumentItem) => void;
}

const documentData: DocumentItem[] = [
  {
    id: "INV-2026-001",
    date: "28 Sep 2026",
    title: "Digitalisasi Pelayanan Posyandu Pintar Terpadu",
    opd: "Dinas Kesehatan Kota Makassar",
    attachmentCount: 4,
    ocrStatus: "Tanda Tangan Sah",
    accuracy: 94.2,
  },
  {
    id: "INV-2026-002",
    date: "29 Sep 2026",
    title: "Sistem Monitoring Titik Genangan Air & Drainase",
    opd: "Dinas Pekerjaan Umum Kota Makassar",
    attachmentCount: 3,
    ocrStatus: "Stempel Kurang Jelas",
    accuracy: 68.0,
  },
  {
    id: "INV-2026-003",
    date: "30 Sep 2026",
    title: "Portal Administrasi Kependudukan Lorong Wisata",
    opd: "Dinas Kependudukan & Catatan Sipil",
    attachmentCount: 5,
    ocrStatus: "Tanda Tangan Sah",
    accuracy: 91.5,
  },
];

export default function Dashboard({ onLogout, onSelectReview }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("Semua (142)");
  const [activeMenu, setActiveMenu] = useState<string>("Beranda");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const tabs = [
    "Semua (142)",
    "Menunggu Review (20)",
    "Perlu Dokumen Tambahan (142)",
    "Selesai (20)",
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#F4F5F8] text-slate-800 font-sans antialiased relative">
      {/* 1. SIDEBAR GELAP KIRI (WIDTH: 240px) */}
      <aside className="w-60 min-h-screen bg-[#15121E] text-slate-300 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Header Brand SIDARA */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-8">
            <img
              src="/images/Logo-Dashboard.svg"
              alt="Logo BRIDA"
              className="w-10 h-10 object-contain shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("Logo-Dashboard.svg")) {
                  target.src = "/images/Logo-Dashboard.svg";
                }
              }}
            />
            <div>
              <h1 className="font-poppins font-black text-sm text-white tracking-wide leading-tight">
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
              onClick={() => setActiveMenu("Beranda")}
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
              onClick={() => setActiveMenu("Antrean")}
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
                20
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("Validasi")}
              className={`w-full flex items-center gap-3 px-6 py-3 text-xs font-medium transition-all ${
                activeMenu === "Validasi"
                  ? "bg-[#291722] text-white border-r-4 border-[#A61F1B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span>Validasi Naskah</span>
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

        {/* Profil Bawah Sidebar */}
        <div 
          onClick={onLogout}
          className="p-4 m-3 bg-[#201B2B] rounded-xl flex items-center justify-between border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
          title="Klik untuk Keluar"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#A61F1B] text-white flex items-center justify-center font-poppins font-bold text-xs shrink-0">
              B
            </div>
            <div className="overflow-hidden">
              <p className="font-poppins font-bold text-xs text-white leading-tight truncate">
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
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between">
          <h2 className="font-poppins font-bold text-base text-slate-900">
            Beranda
          </h2>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="font-sans text-[11px] font-semibold text-[#065F46]">
              Verifikator Aktif
            </span>
          </div>
        </header>

        <main className="p-8 space-y-6 max-w-[1400px]">
          {/* Sapaan + Search + Tombol Unggah */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-poppins font-extrabold text-2xl text-slate-900 tracking-tight">
                Selamat Datang, BRIDA!
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Berikut ringkasan berkas inovasi daerah dan antrean verifikasi Anda hari ini
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64 xl:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari usulan, OPD, ID..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A61F1B] transition-colors"
                />
              </div>

              {/* Tombol pemicu modal unggah dokumen */}
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

          {/* 3. EMPAT KARTU METRIK RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div>
                <p className="font-sans text-xs text-slate-500 font-medium">Total Berkas</p>
                <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">142 Berkas</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="font-sans text-xs text-slate-500 font-medium">Akurasi AI</p>
                <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">90,4%</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <p className="font-sans text-xs text-slate-500 font-medium">Perlu Review</p>
                <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">20 Berkas</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-[#059669] stroke-[2.5]" />
              </div>
              <div>
                <p className="font-sans text-xs text-slate-500 font-medium">Tanda Tangan Sah</p>
                <h4 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">122 Berkas</h4>
              </div>
            </div>
          </div>

          {/* 4. TABEL ANTREAN DATA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-xs font-poppins transition-all relative ${
                      activeTab === tab
                        ? "font-bold text-slate-900"
                        : "font-medium text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{tab}</span>
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111827] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <button
                title="Filter Pengaturan"
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">ID &amp; Tanggal</th>
                    <th className="py-4 px-6">Judul Proposal &amp; Asal OPD</th>
                    <th className="py-4 px-6">Hasil Analisis OCR</th>
                    <th className="py-4 px-6">Akurasi AI</th>
                    <th className="py-4 px-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {documentData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 whitespace-nowrap align-middle">
                        <span className="inline-block px-2.5 py-0.5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#A61F1B] font-mono text-[10px] font-bold rounded">
                          {item.id}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
                      </td>

                      <td className="py-4 px-6 max-w-md align-middle">
                        <p className="font-poppins font-bold text-slate-900 leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.opd} • {item.attachmentCount} Lampiran
                        </p>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap align-middle">
                        {item.ocrStatus === "Tanda Tangan Sah" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-poppins font-semibold bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Tanda Tangan Sah</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-poppins font-semibold bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]">
                            <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />
                            <span>Stempel Kurang Jelas</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap align-middle">
                        <div className="w-28">
                          <span
                            className={`font-poppins text-xs font-bold ${
                              item.accuracy >= 80 ? "text-[#059669]" : "text-[#D97706]"
                            }`}
                          >
                            {item.accuracy}%
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full ${
                                item.accuracy >= 80 ? "bg-[#10B981]" : "bg-[#F59E0B]"
                              }`}
                              style={{ width: `${item.accuracy}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Tombol pemicu review berkas */}
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                Menampilkan 1–3 dari 142 total berkas inovasi daerah
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 text-xs"
                  disabled
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-[#9B1C1C] text-white font-poppins font-bold text-xs shadow-sm">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-poppins font-bold text-xs">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 5. POPUP UNGGAH DOKUMEN */}
      <UploadPopUp
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStartExtraction={() => {
          alert("Dokumen berhasil dikirim ke pipeline AI/OCR untuk diekstraksi!");
        }}
      />
    </div>
  );
}