'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { JuridiskTooltip } from '@/components/ui/JuridiskTooltip';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Users,
  Wallet,
  CreditCard,
  FileText,
  Home,
  AlertTriangle,
  ChevronRight,
  Info,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { generateBouppteckningDocument } from '@/lib/generate-bouppteckning';
import { validatePersonnummer, formatPersonnummer } from '@/lib/personnummer';
import type { Dodsbo } from '@/types';

interface BouppteckningStep {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  checkFn: () => boolean;
  href: string;
  details: string;
}

function BouppteckningContent() {
  const { state, dispatch, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ReturnType<typeof generateBouppteckningDocument> | null>(null);

  // Local form state for bouppteckning-specific fields
  const [personnummer, setPersonnummer] = useState(state.deceasedPersonnummer || '');
  const [address, setAddress] = useState(state.deceasedAddress || '');
  const [folkbokforingsort, setFolkbokforingsort] = useState(state.deceasedFolkbokforingsort || '');
  const [civilstand, setCivilstand] = useState(state.deceasedCivilstand || '');
  const [forrattningsdatum, setForrattningsdatum] = useState(state.forrattningsdatum || '');
  const [fm1Name, setFm1Name] = useState(state.forrattningsman?.[0]?.name || '');
  const [fm2Name, setFm2Name] = useState(state.forrattningsman?.[1]?.name || '');
  const [bouppgivareName, setBouppgivareName] = useState(state.bouppgivare?.name || '');
  const [pnrError, setPnrError] = useState('');

  const handlePersonnummerBlur = () => {
    if (!personnummer.trim()) {
      setPnrError('');
      saveBouppteckningInfo();
      return;
    }
    const result = validatePersonnummer(personnummer);
    if (result.valid && result.formatted) {
      setPersonnummer(result.formatted);
      setPnrError('');
    } else {
      setPnrError(result.error || 'Ogiltigt personnummer');
    }
    saveBouppteckningInfo();
  };

  const saveBouppteckningInfo = () => {
    dispatch({
      type: 'SET_BOUPPTECKNING_INFO',
      payload: {
        deceasedPersonnummer: personnummer || undefined,
        deceasedAddress: address || undefined,
        deceasedFolkbokforingsort: folkbokforingsort || undefined,
        deceasedCivilstand: (civilstand as Dodsbo['deceasedCivilstand']) || undefined,
        forrattningsdatum: forrattningsdatum || undefined,
        forrattningsman: [fm1Name, fm2Name]
          .filter(Boolean)
          .map((name) => ({ name })),
        bouppgivare: bouppgivareName ? { name: bouppgivareName } : undefined,
      },
    });
  };

  useEffect(() => setMounted(true), []);
  if (!mounted || loading) {
    return (
      <div className="min-h-dvh bg-background p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const steps: BouppteckningStep[] = [
    {
      id: 'delagare',
      title: 'Dödsbodelägare',
      description: 'Alla som har rätt till arvet ska finnas med',
      icon: Users,
      checkFn: () => state.delagare.length > 0,
      href: '/delagare',
      details: `${state.delagare.length} person(er) tillagda`,
    },
    {
      id: 'tillgangar',
      title: 'Tillgångar',
      description: 'Bankkonton, fastighet, fordon, aktier, lösöre',
      icon: Wallet,
      checkFn: () => state.tillgangar.length > 0,
      href: '/tillgangar',
      details: `${state.tillgangar.length} tillgång(ar) registrerade`,
    },
    {
      id: 'skulder',
      title: 'Skulder',
      description: 'Bolån, konsumentlån, kreditkort, skatteskulder',
      icon: CreditCard,
      checkFn: () => state.skulder.length > 0 || state.tillgangar.length > 0,
      href: '/tillgangar',
      details: `${state.skulder.length} skuld(er) registrerade`,
    },
    {
      id: 'forsakringar',
      title: 'Försäkringar',
      description: 'Liv-, grupp-, tjänste- och privata försäkringar',
      icon: Home,
      checkFn: () => state.forsakringar.length > 0,
      href: '/forsakringar',
      details: `${state.forsakringar.length} försäkring(ar)`,
    },
  ];

  const completedSteps = steps.filter((s) => s.checkFn()).length;
  const allDone = completedSteps === steps.length;

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0), 0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0), 0
  );
  const netto = totalTillgangar - totalSkulder;

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency', currency: 'SEK', maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Bouppteckning</h1>
          <p className="text-muted text-sm">
            Samla underlag steg för steg
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">
              Vad är en bouppteckning?
            </p>
            <p className="text-sm text-primary/70 mt-1">
              En förteckning av den avlidnes alla tillgångar och skulder per dödsdagen.
              Den ska upprättas inom 3 månader och skickas till Skatteverket inom 4 månader.
              Två utomstående <JuridiskTooltip term="förrättningsman">förrättningsmän</JuridiskTooltip> krävs.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-primary">
            Insamlingsprogress
          </span>
          <span className="text-sm text-muted">
            {completedSteps}/{steps.length} klara
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-2 bg-success rounded-full transition-all"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>

        {/* Deadline warning */}
        {state.deathDate && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-warn" />
            <span className="text-primary/70">
              Frist:{' '}
              {new Date(
                new Date(state.deathDate).getTime() + 90 * 24 * 60 * 60 * 1000
              ).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              (3 månader efter dödsfallet)
            </span>
          </div>
        )}
      </div>

      {/* Steps checklist */}
      <div className="flex flex-col gap-3 mb-6">
        {steps.map((step) => {
          const isComplete = step.checkFn();
          const Icon = step.icon;
          return (
            <Link
              key={step.id}
              href={step.href}
              className="card flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${isComplete ? 'text-primary' : 'text-primary'}`}>
                  {step.title}
                </p>
                <p className="text-sm text-muted">{step.details}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Bouppteckning-specific fields */}
      <button
        onClick={() => setShowExtraFields(!showExtraFields)}
        className="card flex items-center justify-between mb-4 w-full text-left"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-accent" />
          <div>
            <span className="font-medium text-primary">Komplettera för Skatteverket</span>
            <p className="text-xs text-muted">Personnummer, adress, förrättningsmän</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted transition-transform ${showExtraFields ? 'rotate-90' : ''}`} />
      </button>

      {showExtraFields && (
        <div className="card border-2 border-accent/30 mb-6 space-y-4">
          <h3 className="text-base font-semibold text-primary">Den avlidnes uppgifter</h3>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Personnummer</span>
            <input
              type="text"
              value={personnummer}
              onChange={(e) => { setPersonnummer(e.target.value); setPnrError(''); }}
              onBlur={handlePersonnummerBlur}
              placeholder="ÅÅÅÅMMDD-XXXX"
              className={`w-full px-4 py-3 text-base border-2 rounded-card focus:outline-none ${
                pnrError
                  ? 'border-warn focus:border-warn'
                  : personnummer.trim() && !pnrError
                  ? 'border-success/50 focus:border-success'
                  : 'border-gray-200 focus:border-accent'
              }`}
            />
            {pnrError && (
              <span className="text-xs text-warn mt-1 block">{pnrError}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Adress</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={saveBouppteckningInfo}
              placeholder="Gatuadress, postnummer ort"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Folkbokföringsort</span>
            <input
              type="text"
              value={folkbokforingsort}
              onChange={(e) => setFolkbokforingsort(e.target.value)}
              onBlur={saveBouppteckningInfo}
              placeholder="T.ex. Stockholms kommun"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <div>
            <span className="text-sm font-medium text-primary mb-2 block">Civilstånd</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'gift', label: 'Gift' },
                { value: 'ogift', label: 'Ogift' },
                { value: 'anka_ankling', label: 'Änka/änkling' },
                { value: 'skild', label: 'Skild' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setCivilstand(opt.value); setTimeout(saveBouppteckningInfo, 0); }}
                  className={`py-2.5 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    civilstand === opt.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-gray-200 text-muted hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />
          <h3 className="text-base font-semibold text-primary">Förrättning</h3>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Förrättningsdatum</span>
            <input
              type="date"
              value={forrattningsdatum}
              onChange={(e) => setForrattningsdatum(e.target.value)}
              onBlur={saveBouppteckningInfo}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Bouppgivare</span>
            <input
              type="text"
              value={bouppgivareName}
              onChange={(e) => setBouppgivareName(e.target.value)}
              onBlur={saveBouppteckningInfo}
              placeholder="Den som lämnar uppgifterna"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
            <span className="text-xs text-muted mt-1 block">Oftast en nära anhörig som känner till dödsboet</span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Förrättningsman 1</span>
            <input
              type="text"
              value={fm1Name}
              onChange={(e) => setFm1Name(e.target.value)}
              onBlur={saveBouppteckningInfo}
              placeholder="Namn"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">Förrättningsman 2</span>
            <input
              type="text"
              value={fm2Name}
              onChange={(e) => setFm2Name(e.target.value)}
              onBlur={saveBouppteckningInfo}
              placeholder="Namn"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
            <span className="text-xs text-muted mt-1 block">Två oberoende personer som intygar att uppgifterna stämmer</span>
          </label>
        </div>
      )}

      {/* Summary preview */}
      {(state.tillgangar.length > 0 || state.skulder.length > 0) && (
        <div className="card border-2 border-primary-lighter mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Sammanfattning
          </h2>

          {/* Deceased info */}
          <div className="pb-3 mb-3 border-b border-gray-100">
            <p className="text-sm text-muted">Den avlidne</p>
            <p className="font-medium text-primary">
              {state.deceasedName || '–'}
            </p>
            {state.deathDate && (
              <p className="text-sm text-muted">
                Dödsdatum:{' '}
                {new Date(state.deathDate).toLocaleDateString('sv-SE')}
              </p>
            )}
          </div>

          {/* Delägare */}
          <div className="pb-3 mb-3 border-b border-gray-100">
            <p className="text-sm text-muted mb-1">Dödsbodelägare</p>
            {state.delagare.length > 0 ? (
              state.delagare.map((d) => (
                <p key={d.id} className="text-sm text-primary">
                  {d.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted italic">Inga tillagda</p>
            )}
          </div>

          {/* Ekonomisk sammanfattning */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">Tillgångar</span>
              <span className="text-sm font-medium text-success">
                {formatSEK(totalTillgangar)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Skulder</span>
              <span className="text-sm font-medium text-warn">
                {formatSEK(totalSkulder)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-base font-semibold text-primary">
                Behållning
              </span>
              <span
                className={`text-base font-bold ${
                  netto >= 0 ? 'text-success' : 'text-warn'
                }`}
              >
                {formatSEK(netto)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Generate / Preview buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            const doc = generateBouppteckningDocument(state);
            setPreviewDoc(doc);
            setShowPreview(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" />
          Förhandsgranska bouppteckning
        </button>

        {!allDone && (
          <p className="text-center text-xs text-muted">
            OBS: Alla steg är inte ifyllda ({completedSteps}/{steps.length}). Du kan fortfarande förhandsgranska.
          </p>
        )}
      </div>

      {!allDone && (
        <p className="text-center text-xs text-muted mt-2">
          Du kan alltid komma tillbaka och uppdatera informationen.
        </p>
      )}

      {/* Preview modal */}
      {showPreview && previewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary">
                Förhandsgranskning
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Warnings */}
            {previewDoc.warnings.length > 0 && (
              <div className="px-5 pt-3">
                <div className="warning-box">
                  {previewDoc.warnings.map((w, i) => (
                    <p key={i} className="text-sm">{w}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Document content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-6">
                {previewDoc.sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider bg-primary-lighter/20 px-3 py-1.5 rounded-card mb-3">
                      {section.heading}
                    </h3>

                    {/* Labeled fields */}
                    {section.fields && (
                      <div className="space-y-1.5 mb-2">
                        {section.fields.map(([label, value], fi) => (
                          <div key={fi} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                            <span className="text-muted">{label}</span>
                            <span className={`font-medium ${value.startsWith('[') ? 'text-gray-400 italic' : 'text-primary'}`}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table rows */}
                    {section.tableRows && (
                      <div className="space-y-1 mb-2">
                        {section.tableRows.map(([desc, val], ti) => (
                          desc.includes('──') ? (
                            <p key={ti} className="text-xs font-semibold text-accent mt-2">
                              {desc.replace(/──/g, '').trim()}
                            </p>
                          ) : (
                            <div key={ti} className="flex justify-between text-sm border-b border-gray-50 pb-0.5">
                              <span className="text-primary/80">{desc}</span>
                              {val && <span className="font-medium text-primary">{val}</span>}
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Total row */}
                    {section.totalRow && (
                      <div className="flex justify-between text-sm font-bold text-primary border-t-2 border-accent/30 pt-1.5 mt-2">
                        <span>{section.totalRow[0]}</span>
                        <span>{section.totalRow[1]}</span>
                      </div>
                    )}

                    {/* Free text content */}
                    {section.content && (
                      <pre className="text-sm text-primary/80 whitespace-pre-wrap font-sans leading-relaxed mt-1">
                        {section.content}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-gray-200">
              <p className="text-xs text-muted text-center mb-3">
                OBS: Detta är ett utkast. En bouppteckning måste granskas av förrättningsmän
                och skickas till Skatteverket för registrering.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-primary font-medium hover:bg-gray-50 transition-colors"
                >
                  Stäng
                </button>
                <button
                  onClick={async () => {
                    if (previewDoc) {
                      const { downloadBouppteckningPDF } = await import('@/lib/generate-bouppteckning-pdf');
                      downloadBouppteckningPDF(previewDoc);
                    }
                  }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={async () => {
                    if (previewDoc) {
                      const { downloadBouppteckningDocx } = await import('@/lib/generate-bouppteckning-docx');
                      downloadBouppteckningDocx(previewDoc);
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function BouppteckningPage() {
  return (
    <DodsboProvider>
      <BouppteckningContent />
    </DodsboProvider>
  );
}
