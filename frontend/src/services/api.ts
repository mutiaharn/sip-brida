/**
 * Layanan API terpusat untuk komunikasi Frontend React ke FastAPI Backend
 */

export interface InnovationItem {
  id: string;
  numeric_id: number;
  title: string;
  opd: string;
  type?: string;
  year?: number;
  description?: string;
  status?: string;
  temporaryPoints: number;
  maxPoints?: number;
  evidenceFilled: number;
  totalEvidence: number;
  accuracy: number;
  ocrStatus: "Tanda Tangan Sah" | "Stempel Kurang Jelas";
  picName: string;
  picPhone: string;
  created_at?: string;
}

export interface ParameterItem {
  id: string;
  nama: string;
  skor: number;
  urutan: number;
  ai_assessment?: {
    rekomendasi: "LOLOS" | "PERLU_REVISI" | "TIDAK_LOLOS";
    confidence_score: number;
    ai_catatan: string;
  };
  human_decision?: {
    keputusan: "LOLOS" | "REVISI" | "TOLAK";
    catatan?: string;
    is_override?: boolean;
  };
}

export interface IndicatorDetailItem {
  id: number;
  indicator_id: string;
  title: string;
  sub: string;
  definisi?: string;
  points: number;
  status: "active" | "verified" | "pending";
  reviewer_note?: string;
  parameters: ParameterItem[];
}

export interface InnovationDetailResponse {
  id: string;
  numeric_id: number;
  title: string;
  opd: string;
  type?: string;
  year?: number;
  description?: string;
  status?: string;
  temporaryPoints: number;
  maxPoints: number;
  indicators: IndicatorDetailItem[];
}

export interface ProcessDocumentResponse {
  file_hash: string;
  page_count: number;
  is_scanned: boolean;
  nomor_surat?: string;
  instansi?: string;
  perihal?: string;
  tanggal_surat?: string;
  nama_pejabat?: string;
  jabatan_pejabat?: string;
  nip_pejabat?: string;
  verification_url?: string;
  confidence_score: number;
  needs_manual_review: boolean;
}

const API_BASE = "/api";

export async function fetchInnovations(): Promise<InnovationItem[]> {
  const resp = await fetch(`${API_BASE}/innovations`);
  if (!resp.ok) {
    throw new Error(`Gagal memuat inovasi: ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchInnovationDetail(kode: string): Promise<InnovationDetailResponse> {
  const resp = await fetch(`${API_BASE}/innovations/${kode}`);
  if (!resp.ok) {
    throw new Error(`Gagal memuat detail inovasi: ${resp.statusText}`);
  }
  return resp.json();
}

export async function saveParameterDecision(
  kode: string,
  indicatorId: string,
  parameterId: string,
  keputusan: "LOLOS" | "REVISI" | "TOLAK",
  catatan?: string,
  decidedBy: string = "Verifikator BRIDA"
): Promise<{ success: boolean; message: string }> {
  const resp = await fetch(`${API_BASE}/innovations/${kode}/decisions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      indicator_id: indicatorId,
      parameter_id: parameterId,
      keputusan,
      catatan,
      decided_by_nama: decidedBy,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Gagal menyimpan keputusan: ${resp.statusText}`);
  }
  return resp.json();
}

export async function uploadAndProcessDocument(file: File): Promise<ProcessDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch(`${API_BASE}/process`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.detail || `Gagal memproses berkas: ${resp.statusText}`);
  }

  return resp.json();
}

export interface ExtractedDocumentItem {
  id: number;
  original_filename: string;
  page_count: number;
  is_scanned: boolean;
  status: string;
  needs_manual_review: boolean;
  created_at?: string;
  extractions: Array<{
    nomor_surat?: string;
    instansi?: string;
    perihal?: string;
    tanggal_surat?: string;
    nama_pejabat?: string;
    jabatan_pejabat?: string;
    nip_pejabat?: string;
    verification_url?: string;
    confidence_score: number;
  }>;
}

export async function fetchDocuments(): Promise<ExtractedDocumentItem[]> {
  const resp = await fetch(`${API_BASE}/documents`);
  if (!resp.ok) {
    throw new Error(`Gagal memuat berkas dokumen: ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchStats() {
  const resp = await fetch(`${API_BASE}/stats`);
  if (!resp.ok) {
    throw new Error(`Gagal memuat statistik: ${resp.statusText}`);
  }
  return resp.json();
}
