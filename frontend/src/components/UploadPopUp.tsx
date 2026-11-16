import { useState, useRef } from "react";
import {
  X,
  Upload,
  ChevronDown,
  Check,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { uploadAndProcessDocument } from "../services/api";
import type { ProcessDocumentResponse } from "../services/api";

// Interface untuk tipe data file yang diunggah
interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: "PDF" | "FOTO" | "JSON";
  progress: number;
  status: "complete" | "uploading";
  rawFile?: File;
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
    "Dinas Pendidikan — Inovasi PLATONIK"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ProcessDocumentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: "1",
      name: "SK_Walikota_Inovasi_2026.pdf",
      size: "1.2 MB",
      type: "PDF",
      progress: 100,
      status: "complete",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setErrorMessage(null);

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
        rawFile: file,
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProcessExtraction = async () => {
    // Cari file PDF nyata yang dipilih pengguna
    const targetFileItem = files.find((f) => f.rawFile && f.type === "PDF");

    if (!targetFileItem || !targetFileItem.rawFile) {
      // Jika hanya file dummy/mockup, jalankan fallback callback
      if (onStartExtraction) onStartExtraction();
      onClose();
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const result = await uploadAndProcessDocument(targetFileItem.rawFile);
      setExtractionResult(result);
      if (onStartExtraction) onStartExtraction();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses dokumen IDP");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-200">
      <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="font-poppins font-bold text-base text-slate-900 tracking-tight">
              Unggah Dokumen Bukti Inovasi
            </h3>
            <p className="font-sans text-[11px] text-slate-400 mt-0.5">
              Naskah dinas akan diproses otomatis oleh Pipeline IDP (5-Stage Extractor &amp; QR/TTE).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Isi Formulir */}
        <div className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {extractionResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-poppins font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Ekstraksi IDP Selesai ({Math.round(extractionResult.confidence_score * 100)}% Confidence)</span>
                </div>
                <div className="text-[11px] font-sans text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-emerald-100">
                  <p><strong>Nomor Surat:</strong> {extractionResult.nomor_surat || "Tidak terdeteksi"}</p>
                  <p><strong>Instansi:</strong> {extractionResult.instansi || "Tidak terdeteksi"}</p>
                  <p><strong>Perihal:</strong> {extractionResult.perihal || "Tidak terdeteksi"}</p>
                  <p><strong>Tanggal Surat:</strong> {extractionResult.tanggal_surat || "-"}</p>
                  <p><strong>Penandatangan:</strong> {extractionResult.nama_pejabat || "-"} {extractionResult.nip_pejabat ? `(NIP. ${extractionResult.nip_pejabat})` : ""}</p>
                  <p><strong>TTE / QR Code:</strong> {extractionResult.verification_url ? "Terverifikasi Resmi" : "Tidak ada QR Code"}</p>
                  <p><strong>Status Scan:</strong> {extractionResult.is_scanned ? "Dokumen Hasil Scan" : "Dokumen Digital Asli"}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Dropdown OPD Pengusul */}
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
                    <option>Dinas Pendidikan — Inovasi PLATONIK</option>
                    <option>Dinas Kesehatan — Inovasi Posyandu Digital</option>
                    <option>Dinas Pekerjaan Umum — Sistem Drainase &amp; Genangan</option>
                    <option>Badan Riset &amp; Inovasi Daerah (BRIDA)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div>
                <label className="block font-poppins font-bold text-[11px] text-slate-800 mb-1">
                  Surat Keputusan (SK) / SOP / Regulasi Resmi
                </label>
                
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
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    isDragging
                      ? "border-[#9B1C1C] bg-red-50/50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />

                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2 text-[#9B1C1C]">
                    <Upload className="w-4 h-4" />
                  </div>

                  <p className="font-poppins font-bold text-xs text-slate-800">
                    Tarik berkas PDF atau gambar ke sini
                  </p>
                  <p className="font-sans text-[10px] text-slate-400 mt-0.5">
                    Mendukung PDF, PNG, JPG (Maksimal 10 MB per berkas)
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-poppins font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    Pilih File PDF Nyata
                  </button>
                </div>
              </div>

              {/* Daftar Berkas */}
              <div className="space-y-2">
                <p className="font-poppins font-bold text-[11px] text-slate-700">
                  Berkas yang Dipilih ({files.length}):
                </p>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-[#9B1C1C] shrink-0" />
                      <div className="truncate">
                        <p className="font-poppins font-bold text-[11px] text-slate-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {file.size} {file.rawFile ? "• Berkas Nyata Siap IDP" : "• Contoh"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-poppins font-semibold text-slate-700 transition-colors"
          >
            {extractionResult ? "Tutup" : "Batal"}
          </button>

          {extractionResult ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-poppins font-bold transition-all shadow-sm"
            >
              Selesai
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcessExtraction}
              className={`px-4 py-1.5 bg-[#9B1C1C] hover:bg-[#831818] active:bg-[#6c1414] text-white rounded-lg text-xs font-poppins font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                isProcessing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengekstraksi Dokumen...</span>
                </>
              ) : (
                <>
                  <span>Mulai Ekstraksi AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
