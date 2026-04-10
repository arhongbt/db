'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Heart,
  Info,
} from 'lucide-react';

function InstallningarContent() {
  const { state, dispatch } = useDodsbo();
  const router = useRouter();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-2xl font-semibold text-primary">Inställningar</h1>
      </div>

      {/* Current dödsbo info */}
      {state.deceasedName && (
        <div className="card mb-6">
          <p className="text-sm text-muted mb-1">Aktivt dödsbo</p>
          <p className="font-semibold text-primary text-lg">{state.deceasedName}</p>
          {state.deathDate && (
            <p className="text-sm text-muted">
              Dödsdatum: {new Date(state.deathDate).toLocaleDateString('sv-SE')}
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.delagare.length}</p>
              <p className="text-xs text-muted">Delägare</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tillgangar.length}</p>
              <p className="text-xs text-muted">Tillgångar</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tasks.length}</p>
              <p className="text-xs text-muted">Uppgifter</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Hjälp & information
        </h2>
        {[
          { href: '/faq', label: 'Vanliga frågor', icon: HelpCircle },
          { href: '/nodbroms', label: 'Nödbroms — dag 1-7', icon: AlertTriangle },
          { href: '/tidslinje', label: 'Tidslinje', icon: BookOpen },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-accent" />
              <span className="font-medium text-primary">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </Link>
        ))}
      </div>

      {/* Useful contacts */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Viktiga kontakter
        </h2>
        <div className="card space-y-3">
          {[
            { name: 'Skatteverket', phone: '0771-567 567', desc: 'Bouppteckning, folkbokföring' },
            { name: 'Kronofogden', phone: '0771-73 73 00', desc: 'Skulder, betalningsföreläggande' },
            { name: 'Försäkringskassan', phone: '0771-524 524', desc: 'Pension, sjukpenning' },
            { name: 'Jourhavande medmänniska', phone: '08-702 16 80', desc: 'Stöd & samtal (kvällar/nätter)' },
          ].map((contact) => (
            <div key={contact.name} className="flex items-start justify-between">
              <div>
                <p className="font-medium text-primary text-sm">{contact.name}</p>
                <p className="text-xs text-muted">{contact.desc}</p>
              </div>
              <span className="text-sm text-accent font-medium">{contact.phone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Om appen</p>
            <p className="text-sm text-primary/70 mt-1">
              Dödsbo-appen ger vägledning baserat på svensk lagstiftning.
              Den ersätter inte juridisk rådgivning. Vid komplexa fall
              rekommenderar vi att kontakta en jurist.
            </p>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-auto">
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 text-warn text-sm font-medium hover:bg-red-50 rounded-card transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Radera all data och börja om
            </span>
          </button>
        ) : (
          <div className="card border-2 border-warn">
            <p className="font-medium text-warn mb-2">Är du säker?</p>
            <p className="text-sm text-primary/70 mb-4">
              All data raderas permanent — dödsbodelägare, tillgångar, skulder, försäkringar och uppgifter.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn-secondary flex-1"
              >
                Avbryt
              </button>
              <button
                onClick={handleReset}
                className="flex-1 min-h-touch px-6 py-3 bg-warn text-white font-semibold rounded-card"
              >
                Radera allt
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function InstallningarPage() {
  return (
    <DodsboProvider>
      <InstallningarContent />
    </DodsboProvider>
  );
}
