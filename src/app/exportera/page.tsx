'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Download, Package, FileText, FileSpreadsheet, Loader2, Check } from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { PaywallGate } from '@/components/PaywallGate';

function ExporteraContent() {
  const { state } = useDodsbo();
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const exportZIP = async () => {
    setExporting(true);
    try {
      // Dynamic import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // 1. Sammanfattning (JSON)
      zip.file('dodsbo-data.json', JSON.stringify(state, null, 2));

      // 2. Sammanfattning (text)
      const summary = generateSummary(state);
      zip.file('sammanfattning.txt', summary);

      // 3. Delägarlista (CSV)
      const delagareCsv = generateDelagareCsv(state);
      zip.file('delagare.csv', '\uFEFF' + delagareCsv); // BOM for Excel

      // 4. Tillgångar & skulder (CSV)
      const ekonomiCsv = generateEkonomiCsv(state);
      zip.file('tillgangar-skulder.csv', '\uFEFF' + ekonomiCsv);

      // 5. Kostnader (CSV)
      if (state.kostnader.length > 0) {
        const kostnadCsv = generateKostnadCsv(state);
        zip.file('kostnader.csv', '\uFEFF' + kostnadCsv);
      }

      // 6. Försäkringar (CSV)
      if (state.forsakringar.length > 0) {
        const forsakCsv = generateForsakringCsv(state);
        zip.file('forsakringar.csv', '\uFEFF' + forsakCsv);
      }

      // 7. Generate Word docs
      try {
        const { downloadBouppteckningDocx } = await import('@/lib/generate-bouppteckning-docx');
        // We can't easily get the blob without modifying the function,
        // so we'll generate a simplified text version
        zip.file('bouppteckning-info.txt', generateBouppteckningTxt(state));
      } catch {}

      // 8. Uppgiftslista
      const tasksTxt = generateTasksTxt(state);
      zip.file('uppgifter-checklista.txt', tasksTxt);

      // Generate ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sista-resan-${state.deceasedName?.replace(/\s+/g, '-') || 'export'}-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background pb-28">
      <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-display text-primary">Exportera allt</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Ladda ner allt som ett komplett ZIP-paket.
        </p>

        {/* Contents preview */}
        <div className="card mb-4">
          <p className="font-display text-primary text-sm mb-3">Paketet innehåller:</p>
          <div className="space-y-2">
            {[
              { icon: FileText, label: 'Sammanfattning', desc: 'Textöversikt av hela dödsboet' },
              { icon: FileSpreadsheet, label: 'Delägarlista', desc: `${state.delagare.length} dödsbodelägare (CSV)` },
              { icon: FileSpreadsheet, label: 'Tillgångar & skulder', desc: `${state.tillgangar.length} tillgångar, ${state.skulder.length} skulder (CSV)` },
              { icon: FileSpreadsheet, label: 'Kostnader', desc: `${state.kostnader.length} poster (CSV)` },
              { icon: FileSpreadsheet, label: 'Försäkringar', desc: `${state.forsakringar.length} försäkringar (CSV)` },
              { icon: FileText, label: 'Bouppteckningsinfo', desc: 'Underlag till bouppteckning' },
              { icon: FileText, label: 'Uppgifter/checklista', desc: 'Alla uppgifter med status' },
              { icon: FileText, label: 'Komplett JSON-backup', desc: 'All data i maskinläsbart format' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-sm text-primary">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={exportZIP}
          disabled={exporting}
          className="btn-primary flex items-center justify-center gap-2 mb-4"
        >
          {exporting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Exporterar...</>
          ) : done ? (
            <><Check className="w-5 h-5" /> Nedladdat!</>
          ) : (
            <><Download className="w-5 h-5" /> Ladda ner ZIP-paket</>
          )}
        </button>

        <div className="info-box">
          <p className="text-xs text-muted">
            ZIP-filen skapas lokalt i din webbläsare. Ingen data skickas till någon server.
            CSV-filerna kan öppnas direkt i Excel.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helper generators ──

function generateSummary(state: any): string {
  const lines = [
    `DÖDSBO — SAMMANFATTNING`,
    `Skapad: ${new Date().toLocaleDateString('sv-SE')}`,
    ``,
    `DEN AVLIDNE`,
    `Namn: ${state.deceasedName || '(ej angivet)'}`,
    `Dödsdatum: ${state.deathDate || '(ej angivet)'}`,
    `Personnummer: ${state.deceasedPersonnummer || '(ej angivet)'}`,
    `Adress: ${state.deceasedAddress || '(ej angivet)'}`,
    `Civilstånd: ${state.deceasedCivilstand || '(ej angivet)'}`,
    ``,
    `DÖDSBODELÄGARE (${state.delagare.length})`,
    ...state.delagare.map((d: any) => `  - ${d.name} (${d.relation}) ${d.email || ''} ${d.phone || ''}`),
    ``,
    `TILLGÅNGAR (${state.tillgangar.length})`,
    ...state.tillgangar.map((t: any) => `  - ${t.description}: ${t.confirmedValue || t.estimatedValue || 0} SEK (${t.type})`),
    `  Summa: ${state.tillgangar.reduce((s: number, t: any) => s + (t.confirmedValue || t.estimatedValue || 0), 0)} SEK`,
    ``,
    `SKULDER (${state.skulder.length})`,
    ...state.skulder.map((s: any) => `  - ${s.creditor}: ${s.amount || 0} SEK (${s.type})`),
    `  Summa: ${state.skulder.reduce((s: number, sk: any) => s + (sk.amount || 0), 0)} SEK`,
    ``,
    `KOSTNADER (${state.kostnader.length})`,
    ...state.kostnader.map((k: any) => `  - ${k.description}: ${k.amount} SEK (${k.category})`),
    `  Summa: ${state.kostnader.reduce((s: number, k: any) => s + (k.amount || 0), 0)} SEK`,
    ``,
    `---`,
    `Exporterad från Sista Resan — sistaresan.se`,
  ];
  return lines.join('\n');
}

function generateDelagareCsv(state: any): string {
  const header = 'Namn;Relation;E-post;Telefon;Personnummer';
  const rows = state.delagare.map((d: any) =>
    `${d.name};${d.relation};${d.email || ''};${d.phone || ''};${d.personnummer || ''}`
  );
  return [header, ...rows].join('\n');
}

function generateEkonomiCsv(state: any): string {
  let csv = 'Typ;Beskrivning;Belopp (SEK);Kategori\n';
  state.tillgangar.forEach((t: any) => {
    csv += `Tillgång;${t.description};${t.confirmedValue || t.estimatedValue || 0};${t.type}\n`;
  });
  state.skulder.forEach((s: any) => {
    csv += `Skuld;${s.creditor};${s.amount || 0};${s.type}\n`;
  });
  return csv;
}

function generateKostnadCsv(state: any): string {
  const header = 'Datum;Beskrivning;Belopp (SEK);Kategori;Betalare';
  const rows = state.kostnader.map((k: any) =>
    `${k.date};${k.description};${k.amount};${k.category};${k.paidBy || 'Dödsboet'}`
  );
  return [header, ...rows].join('\n');
}

function generateForsakringCsv(state: any): string {
  const header = 'Bolag;Typ;Policynummer;Förmånstagare;Värde;Kontaktad';
  const rows = state.forsakringar.map((f: any) =>
    `${f.company};${f.type};${f.policyNumber || ''};${f.beneficiary || ''};${f.estimatedValue || ''};${f.contacted ? 'Ja' : 'Nej'}`
  );
  return [header, ...rows].join('\n');
}

function generateBouppteckningTxt(state: any): string {
  return [
    'BOUPPTECKNING — UNDERLAG',
    '',
    `Dödsfall: ${state.deceasedName} (${state.deceasedPersonnummer || ''})`,
    `Dödsdatum: ${state.deathDate}`,
    `Adress: ${state.deceasedAddress || ''}`,
    `Folkbokföringsort: ${state.deceasedFolkbokforingsort || ''}`,
    `Civilstånd: ${state.deceasedCivilstand || ''}`,
    '',
    `Förrättningsdatum: ${state.forrattningsdatum || '(ej satt)'}`,
    `Förrättningsmän: ${state.forrattningsman?.map((f: any) => f.name).join(', ') || '(ej angivna)'}`,
    `Bouppgivare: ${state.bouppgivare?.name || '(ej angiven)'}`,
    '',
    'Se CSV-filerna för detaljerad ekonomisk information.',
  ].join('\n');
}

function generateTasksTxt(state: any): string {
  const lines = ['UPPGIFTER / CHECKLISTA', ''];
  const statusMap: Record<string, string> = {
    klar: '✓',
    pagaende: '→',
    ej_paborjad: '○',
    ej_aktuell: '—',
  };
  state.tasks.forEach((t: any) => {
    lines.push(`${statusMap[t.status] || '○'} ${t.title} [${t.status}]`);
    if (t.description) lines.push(`   ${t.description}`);
  });
  return lines.join('\n');
}

export default function ExporteraPage() {
  return (
    <PaywallGate feature="exportera">
      <DodsboProvider>
        <ExporteraContent />
      </DodsboProvider>
    </PaywallGate>
  );
}
