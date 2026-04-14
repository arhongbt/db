'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ChevronLeft, Bot, FileText,
  Download, Info, AlertTriangle,
} from 'lucide-react';

interface DodsboanmalanData {
  deceasedNamn: string; deceasedPnr: string; dodsdag: string;
  senasteFolkbokforing: string; anmalarNamn: string; anmalarRelation: string;
  anmalarAdress: string; anmalarTelefon: string; tillgangar: string;
  skulder: string; begravningskostnad: string;
  boendeform: 'hyresratt' | 'bostadsratt' | 'villa' | 'annat' | '';
  testamenteFinns: boolean; forsakringFinns: boolean;
}

const INITIAL: DodsboanmalanData = {
  deceasedNamn: '', deceasedPnr: '', dodsdag: '', senasteFolkbokforing: '',
  anmalarNamn: '', anmalarRelation: '', anmalarAdress: '', anmalarTelefon: '',
  tillgangar: '', skulder: '', begravningskostnad: '', boendeform: '',
  testamenteFinns: false, forsakringFinns: false,
};

const STEPS = [
  { title: 'Är detta rätt för dig?', desc: 'Kontrollera om dödsboanmälan passar' },
  { title: 'Den avlidne', desc: 'Uppgifter om den som gått bort' },
  { title: 'Anmälare', desc: 'Vem gör anmälan?' },
  { title: 'Ekonomi & boende', desc: 'Tillgångar och skulder' },
  { title: 'Granska & ladda ner', desc: 'Se över och hämta dokumentet' },
];

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.08), rgba(107,127,94,0.03))' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white";

function DodsboanmalanContent() {
  const { state } = useDodsbo();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DodsboanmalanData>(() => ({
    ...INITIAL, deceasedNamn: state.deceasedName || '', dodsdag: state.deathDate || '',
  }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const generateText = () => {
    const today = new Date().toLocaleDateString('sv-SE');
    return `DÖDSBOANMÄLAN\n\nTill socialnämnden i ${data.senasteFolkbokforing || '_______________'} kommun\n\n────────────────────────────\n\nUPPGIFTER OM DEN AVLIDNE\n\nNamn: ${data.deceasedNamn || '_______________'}\nPersonnummer: ${data.deceasedPnr || '_______________'}\nDödsdag: ${data.dodsdag || '_______________'}\nFolkbokförd: ${data.senasteFolkbokforing || '_______________'}\n\n────────────────────────────\n\nANMÄLARE\n\nNamn: ${data.anmalarNamn || '_______________'}\nRelation: ${data.anmalarRelation || '_______________'}\nAdress: ${data.anmalarAdress || '_______________'}\nTelefon: ${data.anmalarTelefon || '_______________'}\n\n────────────────────────────\n\nTILLGÅNGAR VID DÖDSFALLET\n\n${data.tillgangar || 'Tillgångarna räcker inte till begravningskostnaderna.'}\n\nUppskattad begravningskostnad: ${data.begravningskostnad ? data.begravningskostnad + ' kr' : '_______________'}\n\nSKULDER\n\n${data.skulder || 'Se ovan.'}\n\nBOENDE: ${data.boendeform === 'hyresratt' ? 'Hyresrätt' : data.boendeform === 'bostadsratt' ? 'Bostadsrätt' : data.boendeform === 'villa' ? 'Villa/hus' : data.boendeform || '_______________'}\n\nTestamente finns: ${data.testamenteFinns ? 'Ja' : 'Nej'}\nFörsäkring finns: ${data.forsakringFinns ? 'Ja' : 'Nej'}\n\n────────────────────────────\n\nANLEDNING TILL DÖDSBOANMÄLAN\n\nTillgångarna i dödsboet räcker inte till att täcka begravningskostnaderna.\nDödsboanmälan görs i enlighet med Ärvdabalken 20 kap. 8a §.\n\n────────────────────────────\n\nUNDERSKRIFT\n\nDatum: ${today}\nOrt: ${data.senasteFolkbokforing || '_______________'}\n\n_____________________________________\n${data.anmalarNamn || '(Anmälare)'}\n\n────────────────────────────\n\nVIKTIGT ATT TÄNKA PÅ\n• Lämnas till socialnämnden i kommunen där den avlidne var folkbokförd\n• Ersätter bouppteckning när tillgångarna inte räcker till begravningen\n• Bifoga: dödsbevis, kontoutdrag, begravningsfaktura\n\nSkapat med Sista Resan — ${today}`;
  };

  const handleDownloadPDF = async () => {
    const { downloadDocumentPDF } = await import('@/lib/generate-document-pdf');
    downloadDocumentPDF('Dödsboanmälan', generateText(), `dodsboanmalan-${data.deceasedNamn || 'dokument'}`);
  };

  const handleDownloadDocx = async () => {
    const { downloadDocumentDocx } = await import('@/lib/generate-document-docx');
    downloadDocumentDocx('Dödsboanmälan', generateText(), `dodsboanmalan-${data.deceasedNamn || 'dokument'}`);
  };

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8 pb-28">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4 rounded-full">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(107,127,94,0.08)' }}>
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-display text-primary">Dödsboanmälan</h1>
          <p className="text-xs text-muted">Steg {step + 1} av {STEPS.length} — {STEPS[step].desc}</p>
        </div>
      </div>
      <div className="flex gap-1.5 my-4">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? '#6B7F5E' : '#E8E4DE' }} />
        ))}
      </div>

      {step === 0 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="En dödsboanmälan används istället för bouppteckning när den avlidne hade så lite tillgångar att de inte ens räcker till begravningen. Låt oss kolla om det passar din situation." />
          <div className="card mb-4" style={{ borderRadius: '28px' }}>
            <p className="font-display text-primary mb-3">Dödsboanmälan passar om:</p>
            <div className="space-y-2">
              {['Den avlidne hade inga eller mycket små tillgångar','Tillgångarna räcker inte till begravningskostnaderna','Det finns ingen fastighet eller bostadsrätt','Det finns inga värdefulla föremål att fördela'].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent">{i + 1}</span>
                  </div>
                  <p className="text-sm text-primary/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-5" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
            <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary/80 leading-relaxed">
              <strong>Gör istället en bouppteckning om:</strong> den avlidne ägde fastighet, bostadsrätt, bil av värde, eller om tillgångarna överstiger begravningskostnaderna.
            </p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Fyll i den avlidnes uppgifter. Kommunen behöver veta var personen var folkbokförd." />
          <div className="card space-y-4" style={{ borderRadius: '28px' }}>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Den avlidnes namn</label>
              <input value={data.deceasedNamn} onChange={(e) => setData({...data, deceasedNamn: e.target.value})} placeholder="Förnamn Efternamn" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Personnummer</label>
              <input value={data.deceasedPnr} onChange={(e) => setData({...data, deceasedPnr: e.target.value})} placeholder="XXXXXX-XXXX" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Dödsdag</label>
              <input type="date" value={data.dodsdag} onChange={(e) => setData({...data, dodsdag: e.target.value})} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Folkbokförd i kommun</label>
              <input value={data.senasteFolkbokforing} onChange={(e) => setData({...data, senasteFolkbokforing: e.target.value})} placeholder="T.ex. Stockholm" className={inputCls} /></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Vem som helst med koppling till dödsboet kan göra en dödsboanmälan — det brukar vara närmaste anhörig." />
          <div className="card space-y-4" style={{ borderRadius: '28px' }}>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Ditt namn</label>
              <input value={data.anmalarNamn} onChange={(e) => setData({...data, anmalarNamn: e.target.value})} placeholder="Förnamn Efternamn" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Relation till den avlidne</label>
              <input value={data.anmalarRelation} onChange={(e) => setData({...data, anmalarRelation: e.target.value})} placeholder="T.ex. barn, syskon, sambo" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Adress</label>
              <input value={data.anmalarAdress} onChange={(e) => setData({...data, anmalarAdress: e.target.value})} placeholder="Storgatan 1, 111 22 Stockholm" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Telefonnummer</label>
              <input value={data.anmalarTelefon} onChange={(e) => setData({...data, anmalarTelefon: e.target.value})} placeholder="070-XXX XX XX" className={inputCls} /></div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Beskriv den avlidnes ekonomi. Poängen är att visa att tillgångarna inte räcker till begravningen. Socialnämnden kan hjälpa till med begravningskostnaderna." />
          <div className="card space-y-4 mb-4" style={{ borderRadius: '28px' }}>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Tillgångar vid dödsfallet</label>
              <textarea value={data.tillgangar} onChange={(e) => setData({...data, tillgangar: e.target.value})} placeholder="T.ex. 'Bankmedel: 3 200 kr. Inga övriga tillgångar.'" rows={3} className={inputCls + ' resize-none text-sm'} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Uppskattad begravningskostnad</label>
              <input value={data.begravningskostnad} onChange={(e) => setData({...data, begravningskostnad: e.target.value})} placeholder="T.ex. 25000" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Skulder</label>
              <textarea value={data.skulder} onChange={(e) => setData({...data, skulder: e.target.value})} placeholder="T.ex. 'Hyresskuld: 5 000 kr'" rows={2} className={inputCls + ' resize-none text-sm'} /></div>
          </div>
          <div className="card space-y-4" style={{ borderRadius: '28px' }}>
            <div><label className="block text-sm font-medium text-primary mb-1.5">Boendeform</label>
              <div className="grid grid-cols-2 gap-2">
                {([['hyresratt','Hyresrätt'],['bostadsratt','Bostadsrätt'],['villa','Villa/hus'],['annat','Annat']] as const).map(([val,label]) => (
                  <button key={val} onClick={() => setData({...data, boendeform: val})}
                    className={`py-3 rounded-full text-sm font-medium transition-colors ${data.boendeform === val ? 'text-white' : 'bg-white text-primary border border-[#E8E4DE]'}`}
                    style={data.boendeform === val ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : {}}>{label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-primary">Testamente finns?</span>
              <button onClick={() => setData({...data, testamenteFinns: !data.testamenteFinns})}
                className={`w-12 h-7 rounded-full transition-colors relative ${data.testamenteFinns ? 'bg-accent' : 'bg-[#E8E4DE]'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${data.testamenteFinns ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-primary">Försäkring finns?</span>
              <button onClick={() => setData({...data, forsakringFinns: !data.forsakringFinns})}
                className={`w-12 h-7 rounded-full transition-colors relative ${data.forsakringFinns ? 'bg-accent' : 'bg-[#E8E4DE]'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${data.forsakringFinns ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Granska och ladda ner. Lämna dokumentet till socialnämnden i kommunen. Bifoga dödsbevis och kontoutdrag." />
          <div className="card mb-4" style={{ borderRadius: '28px' }}>
            <p className="text-xs font-display text-muted mb-3">Sammanfattning</p>
            <div className="space-y-2 text-sm">
              <p><strong className="text-primary">Den avlidne:</strong> <span className="text-muted">{data.deceasedNamn || '(ej ifyllt)'}</span></p>
              <p><strong className="text-primary">Kommun:</strong> <span className="text-muted">{data.senasteFolkbokforing || '(ej ifyllt)'}</span></p>
              <p><strong className="text-primary">Anmälare:</strong> <span className="text-muted">{data.anmalarNamn || '(ej ifyllt)'} ({data.anmalarRelation})</span></p>
              <p><strong className="text-primary">Begravningskostnad:</strong> <span className="text-muted">{data.begravningskostnad ? `${data.begravningskostnad} kr` : '(ej ifyllt)'}</span></p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-4" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
            <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary/80 leading-relaxed"><strong>Bifoga:</strong> dödsbevis, kontoutdrag, begravningsfaktura.</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={handleDownloadPDF} className="btn-primary flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Ladda ner som PDF
            </button>
            <button onClick={handleDownloadDocx} className="w-full py-3 rounded-[20px] text-sm font-semibold border-2 border-accent text-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Ladda ner som Word
            </button>
          </div>
          <p className="text-xs text-center text-muted mt-4 px-2">Denna mall ger allmän vägledning. Kontakta socialtjänsten vid frågor.</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={prev} className="flex-1 py-3 rounded-full text-sm font-semibold border-2 border-[#E8E4DE] text-primary hover:bg-background transition-colors flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Tillbaka
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex-1 btn-primary flex items-center justify-center gap-1">
            Nästa <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function DodsboanmalanPage() {
  return (<DodsboProvider><DodsboanmalanContent /></DodsboProvider>);
}
