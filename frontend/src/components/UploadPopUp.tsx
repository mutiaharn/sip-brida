import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  ChevronDown,
  Check,
  ArrowRight,
  LogOut,
} from "lucide-react";

// Interface untuk tipe data file yang diunggah
interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: "PDF" | "FOTO" | "JSON";
  progress: number;
  status: "complete" | "uploading";
}

// Interface props untuk komponen UploadPopUp
interface UploadPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExtraction?: () => void;
}

export default function UploadPopUp({
  isOpen,
  onClose,
  onStartExtraction,
}: UploadPopUpProps) {
  const [selectedOpd, setSelectedOpd] = useState(
    "Dinas Kesehatan — Inovasi Posyandu Digital"
  );
  const [isDragging, setIsDragging] = useState(false);

  // Tampilan dummy
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: "1",
      name: "SK_Walikota_Posyandu_Sehat_2026.pdf",
      size: "3.8 MB",
      type: "PDF",
      progress: 100,
      status: "complete",
    },
    {
      id: "2",
      name: "Dokumentasi_Foto_Lapang.png",
      size: "1.2 MB",
      type: "FOTO",
      progress: 75,
      status: "uploading",
    },
  ]);

  // Ref untuk mengontrol input file HTML asli
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Jika state isOpen false, jangan render apapun
  if (!isOpen) return null;

  // Handler saat file dipilih secara nyata dari komputer
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: UploadedFileItem[] = Array.from(selectedFiles).map((file, idx) => {
      const ext = file.name.split(".").pop()?.toUpperCase() || "";
      const fileType: "PDF" | "FOTO" | "JSON" =
        ext === "PDF" ? "PDF" : ext === "JSON" ? "JSON" : "FOTO";
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

      return {
        id: `${Date.now()}-${idx}`,
        name: file.name,
        size: sizeMB,
        type: fileType,
        progress: 100,
        status: "complete",
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  return (

    // blur
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-200">
      
      {/* Container Kotak Putih Modal Popup */}
      <div className="bg-white w-full max-w-[540px] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/*  Header Modal  */}
        <div className="px-6 pt-5 pb-2 flex items-start justify-between">
          <div>
            <h3 className="font-poppins font-bold text-base text-slate-900 tracking-tight">
              Unggah Dokumen Inovasi
            </h3>
            <p className="font-sans text-[11px] text-slate-400 mt-0.5 font-normal">
              Masukkan naskah dinas bukti dukung untuk diekstraksi otomatis oleh sistem AI.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/*  Isi Formulir  */}
        <div className="px-6 py-3 space-y-3.5">
          
          {/* 1. Dropdown OPD Pengusul */}
          <div>
            <label className="block font-poppins font-bold text-[11px] text-slate-800 mb-1">
              Dinas / OPD Pengusul Inovasi
            </label>
            <div className="relative">
              <select
                value={selectedOpd}
                onChange={(e) => setSelectedOpd(e.target.value)}
                className="w-full appearance-none px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-[#9B1C1C] transition-colors pr-9 cursor-pointer"
              >
                <option>Dinas Kesehatan — Inovasi Posyandu Digital</option>
                <option>Dinas Pekerjaan Umum — Sistem Drainase &amp; Genangan</option>
                <option>Dinas Kependudukan &amp; Catatan Sipil — Portal Lorong</option>
                <option>Badan Pendapatan Daerah — Retribusi Pasar QRIS</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 2. Drag & Drop Area */}
          <div>
            <label className="block font-poppins font-bold text-[11px] text-slate-800 mb-1">
              Surat Keputusan (SK) / SOP / Regulasi Resmi
            </label>
            
            {/* Kotak Upload Interaktif */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelect(e.dataTransfer.files);
              }}
              className={`border border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-[#9B1C1C] bg-red-50/30"
                  : "border-red-200 bg-[#FFFDFD]"
              }`}
            >
              {/* Input file asli (tersembunyi) */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Ikon Panah Unggah Merah */}
              <div className="w-6 h-6 rounded-full bg-red-50 text-[#A61F1B] flex items-center justify-center mx-auto mb-2">
                <Upload className="w-3.5 h-3.5" />
              </div>

              <p className="font-poppins font-bold text-slate-800 text-[11px]">
                Tarik dan letakkan berkas PDF di sini
              </p>
              <p className="font-sans text-[10px] text-slate-400 mt-0.5">
                Format PDF naskah dinas resmi pemerintah (Maksimal 20 MB)
              </p>

              {/* Tombol Pilih dari Komputer */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-sans font-medium text-slate-600 shadow-2xs transition-all active:scale-95"
              >
                Pilih dari Komputer
              </button>
            </div>
          </div>

          {/* 3. Banner Mode Simulasi (JSON) */}
          <div className="p-2.5 bg-[#FFFDF5] border border-[#FDE68A] rounded-xl flex items-center justify-between gap-3 shadow-inner-sm">
           
            {/* Input file JSON tersembunyi */}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div className="flex items-start gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-[8px] mt-0.5 shrink-0">
                i
              </div>
              <div>
                <p className="font-poppins font-bold text-[10.5px] text-slate-800">
                  Mode Simulasi Pengujian / Demo RPL (JSON)
                </p>
                <p className="font-sans text-[9.5px] text-slate-500 font-normal">
                  Muat berkas teks indikator dummy jika server SIGAP utama belum terhubung.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => jsonInputRef.current?.click()}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-poppins font-bold text-slate-700 shadow-2xs shrink-0 whitespace-nowrap active:scale-95"
            >
              Pilih JSON
            </button>
          </div>

          {/* 4. Daftar Berkas Terlampir (Siap diekstrak) */}
          <div className="space-y-1.5 pt-0.5">
            <p className="font-poppins font-bold text-[11px] text-slate-800">
              Berkas Terlampir Siap Diekstrak:
            </p>

            {files.map((file) => (
              <div
                key={file.id}
                className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                 
                  {/* Badge Tipe File */}
                  <span
                    className={`px-1.5 py-0.5 font-mono text-[8.5px] font-bold rounded shrink-0 ${
                      file.type === "PDF"
                        ? "bg-red-100/70 text-[#A61F1B]"
                        : file.type === "JSON"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {file.type}
                  </span>

                  {/* Informasi File */}
                  <div className="min-w-0 flex-1">
                    <p className="font-poppins font-bold text-[11px] text-slate-900 leading-tight truncate">
                      {file.name}
                    </p>

                    {file.status === "complete" ? (
                     
                     // Status Berhasil
                      <p className="font-sans text-[9px] text-[#059669] flex items-center gap-1 mt-0.5 font-medium">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Ukuran {file.size} • Dokumen Lengkap</span>
                      </p>
                    ) : (
                    
                        // Status Progress Uploading
                      <div className="w-full mt-1">
                        <p className="font-sans text-[9px] text-slate-400 font-normal">
                          Mengunggah... • {file.progress}%
                        </p>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-[#9B1C1C] rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Hapus (X) */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-slate-400 hover:text-red-500 p-1 shrink-0 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/*  Footer Modal (Tombol Aksi)  */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-poppins font-semibold text-slate-700 transition-colors active:scale-95"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => {
              if (onStartExtraction) onStartExtraction();
              onClose(); 
            }}
            className="px-4 py-1.5 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] active:scale-95 text-white rounded-lg text-xs font-poppins font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Mulai Ekstraksi AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}