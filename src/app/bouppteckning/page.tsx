'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
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
import { downloadBouppteckningPDF } from '@/lib/generate-bouppteckning-pdf';

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
  const { state, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ReturnType<typeof generateBouppteckningDocument> | null>(null);
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
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
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
              Två utomstående förrättningsmän krävs.
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
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      {section.heading}
                    </h3>
                    <pre className="text-sm text-primary/80 whitespace-pre-wrap font-sans leading-relaxed">
                      {section.content}
                    </pre>
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
                  onClick={() => {
                    if (previewDoc) {
                      downloadBouppteckningPDF(previewDoc);
                    }
                  }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Ladda ner PDF
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
