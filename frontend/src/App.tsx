import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Verification";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "review">("dashboard");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

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

  return (
    <Dashboard
      onSelectReview={(item: any) => {
        setSelectedDoc(item);
        setCurrentView("review");
      }}
    />
  );
}