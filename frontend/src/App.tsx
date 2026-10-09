import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Verification";

export default function App() {
  const [currentView, setCurrentView] = useState<"login" | "dashboard" | "review">("login");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Tampilan Login
  if (currentView === "login") {
    return (
      <Login 
        onLoginSuccess={() => setCurrentView("dashboard")} 
      />
    );
  }

  // Tampilan Review Verifikasi
  if (currentView === "review") {
    return (
      <Verification
        onBack={() => setCurrentView("dashboard")}
        documentId={selectedDoc?.id || "INV-2026-001"}
        documentTitle={`Evaluasi Usulan: ${selectedDoc?.title || "Posyandu Digital Terintegrasi"}`}
        opdName={selectedDoc?.opd || "Dinas Kesehatan Kota Makassar"}
      />
    );
  }

  // Tampilan Dashboard (Utama)
  return (
    <Dashboard
      onLogout={() => setCurrentView("login")}
      onSelectReview={(item: any) => {
        setSelectedDoc(item);
        setCurrentView("review");
      }}
    />
  );
}