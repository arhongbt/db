'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Heart,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  Users,
  FileText,
  Smartphone,
  Star,
} from 'lucide-react';
import { loadState } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.deceasedName) setHasExisting(true);
  }, []);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero */}
      <div className="flex flex-col justify-center px-5 py-8">
        <div className="mb-6">
          <div className="w-14 h-14 bg-primary-lighter rounded-2xl flex items-center justify-center mb-5">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary leading-tight mb-3">
            Hantera dödsboet{' '}
            <span className="text-accent block">steg för steg</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Sveriges första digitala dödsbohjälp. Vi guidar dig genom hela
            processen — i din egen takt, utan juridikspråk.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4 mb-8">
          {[
            {
              icon: Clock,
              title: 'Personlig tidslinje',
              desc: 'Anpassad efter din situation med automatiska påminnelser',
            },
            {
              icon: FileText,
              title: 'Bouppteckning steg för steg',
              desc: 'Samla underlag och generera dokument — utan jurist',
            },
            {
              icon: Shield,
              title: 'Byggt på svensk lag',
              desc: 'Ärvdabalken, Skatteverkets regler, alla 8 storbanker',
            },
            {
              icon: Smartphone,
              title: 'Mobil-först',
              desc: 'Fungerar på din telefon, surfplatta eller dator',
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-lighter/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-primary">{feature.title}</p>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="bg-primary-lighter/20 rounded-card p-4 mb-6">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-sm text-primary/80 italic">
            &ldquo;Hade ingen aning om var jag skulle börja. Appen tog mig genom
            allt steg för steg. Ovärderligt.&rdquo;
          </p>
          <p className="text-xs text-muted mt-1">— Framtida användare</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-8">
        {hasExisting && (
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-secondary mb-3 flex items-center justify-center gap-2"
          >
            Fortsätt där du var
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => router.push('/onboarding')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {hasExisting ? 'Starta nytt dödsbo' : 'Kom igång — gratis'}
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-center text-sm text-muted mt-3">
          2 minuter. Ingen registrering krävs.
        </p>
      </div>
    </div>
  );
}
