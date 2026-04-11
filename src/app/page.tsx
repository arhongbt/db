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
} from 'lucide-react';
import Link from 'next/link';
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

        {/* Trust indicators */}
        <div className="bg-primary-lighter/20 rounded-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-accent" />
            <p className="font-medium text-primary text-sm">Byggt för trygghet</p>
          </div>
          <p className="text-sm text-primary/70">
            Baserat på Ärvdabalken och Skatteverkets regler. Gratis att börja — ingen registrering krävs.
          </p>
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

        {/* Footer links */}
        <div className="flex justify-center gap-4 mt-6 text-xs text-muted">
          <Link href="/om" className="hover:text-accent transition-colors">Om oss</Link>
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">Integritetspolicy</Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">Villkor</Link>
        </div>
      </div>
    </div>
  );
}
