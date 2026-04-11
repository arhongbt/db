// ============================================================
// Data Export — CSV + JSON for full dödsbo backup
// ============================================================

import type { Dodsbo } from '@/types';

/**
 * Export entire dödsbo state as a JSON file (complete backup)
 */
export function exportAsJSON(state: Dodsbo): void {
  const data = JSON.stringify(state, null, 2);
  downloadFile(data, `dodsbo-${sanitize(state.deceasedName)}-backup.json`, 'application/json');
}

/**
 * Export a CSV summary with all key data in one spreadsheet-friendly file
 */
export function exportAsCSV(state: Dodsbo): void {
  const lines: string[] = [];

  // Section 1: Grundinfo
  lines.push('--- GRUNDINFORMATION ---');
  lines.push('Fält,Värde');
  lines.push(`Den avlidne,"${esc(state.deceasedName)}"`);
  lines.push(`Dödsdatum,"${esc(state.deathDate)}"`);
  lines.push(`Personnummer,"${esc(state.deceasedPersonnummer || '')}"`);
  lines.push(`Adress,"${esc(state.deceasedAddress || '')}"`);
  lines.push(`Folkbokföringsort,"${esc(state.deceasedFolkbokforingsort || '')}"`);
  lines.push(`Civilstånd,"${esc(state.deceasedCivilstand || '')}"`);
  lines.push(`Familjesituation,"${esc(state.onboarding.familySituation)}"`);
  lines.push(`Boendetyp,"${esc(state.onboarding.housingType)}"`);
  lines.push(`Testamente,"${state.onboarding.hasTestamente === true ? 'Ja' : state.onboarding.hasTestamente === false ? 'Nej' : 'Vet ej'}"`);
  lines.push('');

  // Section 2: Dödsbodelägare
  lines.push('--- DÖDSBODELÄGARE ---');
  lines.push('Namn,Relation,Personnummer,E-post,Telefon,Andel (%)');
  state.delagare.forEach(d => {
    lines.push(`"${esc(d.name)}","${esc(d.relation)}","${esc(d.personnummer || '')}","${esc(d.email || '')}","${esc(d.phone || '')}",${d.share ?? ''}`);
  });
  lines.push('');

  // Section 3: Tillgångar
  lines.push('--- TILLGÅNGAR ---');
  lines.push('Typ,Beskrivning,Uppskattat värde (kr),Bekräftat värde (kr),Bank,Anteckningar');
  state.tillgangar.forEach(t => {
    lines.push(`"${esc(t.type)}","${esc(t.description)}",${t.estimatedValue ?? ''},${t.confirmedValue ?? ''},"${esc(t.bank || '')}","${esc(t.notes || '')}"`);
  });
  const totalTillgangar = state.tillgangar.reduce((s, t) => s + (t.estimatedValue ?? 0), 0);
  lines.push(`"","SUMMA TILLGÅNGAR",${totalTillgangar},,,`);
  lines.push('');

  // Section 4: Skulder
  lines.push('--- SKULDER ---');
  lines.push('Typ,Fordringsägare,Belopp (kr),Anteckningar');
  state.skulder.forEach(s => {
    lines.push(`"${esc(s.type)}","${esc(s.creditor)}",${s.amount ?? ''},"${esc(s.notes || '')}"`);
  });
  const totalSkulder = state.skulder.reduce((s, sk) => s + (sk.amount ?? 0), 0);
  lines.push(`"","SUMMA SKULDER",${totalSkulder},`);
  lines.push('');

  // Section 5: Försäkringar
  lines.push('--- FÖRSÄKRINGAR ---');
  lines.push('Typ,Bolag,Policynummer,Förmånstagare,Värde (kr),Kontaktad');
  state.forsakringar.forEach(f => {
    lines.push(`"${esc(f.type)}","${esc(f.company)}","${esc(f.policyNumber || '')}","${esc(f.beneficiary || '')}",${f.estimatedValue ?? ''},"${f.contacted ? 'Ja' : 'Nej'}"`);
  });
  lines.push('');

  // Section 6: Lösöre
  if (state.losore && state.losore.length > 0) {
    lines.push('--- LÖSÖRE ---');
    lines.push('Namn,Kategori,Uppskattat värde (kr),Tilldelad till,Anteckningar');
    state.losore.forEach(l => {
      lines.push(`"${esc(l.name)}","${esc(l.category)}",${l.estimatedValue},"${esc(l.assignedTo || '')}","${esc(l.notes || '')}"`);
    });
    const totalLosore = state.losore.reduce((s, l) => s + l.estimatedValue, 0);
    lines.push(`"","SUMMA LÖSÖRE",${totalLosore},,`);
    lines.push('');
  }

  // Section 7: Kostnader
  if (state.kostnader && state.kostnader.length > 0) {
    lines.push('--- DÖDSBOKOSTNADER ---');
    lines.push('Kategori,Beskrivning,Belopp (kr),Datum,Utlagt av');
    state.kostnader.forEach(k => {
      lines.push(`"${esc(k.category)}","${esc(k.description)}",${k.amount},"${esc(k.date)}","${esc(k.paidBy || 'Dödsboet')}"`);
    });
    const totalKostnader = state.kostnader.reduce((s, k) => s + k.amount, 0);
    lines.push(`"","SUMMA KOSTNADER",${totalKostnader},,`);
    lines.push('');
  }

  // Section 8: Sammanfattning
  const summaryKostnader = (state.kostnader || []).reduce((s, k) => s + k.amount, 0);
  lines.push('--- SAMMANFATTNING ---');
  lines.push('Post,Belopp (kr)');
  lines.push(`Tillgångar,${totalTillgangar}`);
  lines.push(`Skulder,-${totalSkulder}`);
  lines.push(`Dödsbokostnader,-${summaryKostnader}`);
  lines.push(`Behållning (netto),${totalTillgangar - totalSkulder - summaryKostnader}`);

  const csv = '\uFEFF' + lines.join('\n'); // BOM for Excel UTF-8
  downloadFile(csv, `dodsbo-${sanitize(state.deceasedName)}-export.csv`, 'text/csv;charset=utf-8');
}

function esc(s: string): string {
  return s.replace(/"/g, '""');
}

function sanitize(name: string): string {
  return (name || 'export').toLowerCase().replace(/[^a-zåäö0-9]/g, '-').replace(/-+/g, '-');
}

function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
