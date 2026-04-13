"use client";

import { useState } from "react";
import {
  Settings,
  Download,
  Upload,
  Trash2,
  Landmark,
  Shield,
  Database,
  ExternalLink,
} from "lucide-react";
import { exportAllData, importData, getTransactions } from "@/lib/store";
import { getTinkLinkUrl } from "@/lib/tink";

export default function InstallningarPage() {
  const [importStatus, setImportStatus] = useState<string>("");

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sistaresan-admin-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result as string);
        setImportStatus("Data importerad!");
        setTimeout(() => setImportStatus(""), 3000);
      } catch {
        setImportStatus("Fel vid import — kontrollera filen");
      }
    };
    reader.readAsText(file);
  }

  function handleClearAll() {
    if (confirm("Är du säker? All data raderas permanent.")) {
      if (confirm("Sista chansen — vill du verkligen radera allt?")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inställningar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Hantera din data och kopplingar</p>
      </div>

      {/* Bankkoppling */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Bankkoppling (Tink)</h2>
            <p className="text-xs text-gray-400">Importera transaktioner automatiskt</p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/60 mb-4">
          <p className="text-sm text-amber-800 font-medium">Ej aktiverad</p>
          <p className="text-xs text-amber-600 mt-1">
            Bankkoppling kräver Tink API-nycklar. Registrera dig på{" "}
            <span className="font-medium">console.tink.com</span> med ditt företags organisationsnummer.
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>Steg för att aktivera:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-500">
            <li>Skapa konto på console.tink.com</li>
            <li>Registrera din enskilda firma (org.nr)</li>
            <li>Skapa en app och få client_id + client_secret</li>
            <li>Lägg in nycklarna i .env.local</li>
            <li>Starta om appen — knappen aktiveras</li>
          </ol>
        </div>
      </div>

      {/* Data */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Database className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Data</h2>
            <p className="text-xs text-gray-400">Backup och import/export</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Exportera all data</p>
              <p className="text-[11px] text-gray-400">Ladda ner JSON-backup av alla transaktioner</p>
            </div>
          </button>

          <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-brand-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Importera data</p>
              <p className="text-[11px] text-gray-400">Återställ från JSON-backup</p>
            </div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          {importStatus && (
            <p className="text-xs text-brand-600 px-4">{importStatus}</p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold text-red-900">Riskzon</h2>
            <p className="text-xs text-red-400">Permanenta åtgärder</p>
          </div>
        </div>

        <button
          onClick={handleClearAll}
          className="px-4 py-2.5 rounded-xl border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Radera all data
        </button>
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">
              All data lagras lokalt i din webbläsare (localStorage). Inget skickas till externa servrar.
              När Supabase kopplas in sparas datan säkert i molnet med kryptering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
