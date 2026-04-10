'use client';

import { useRouter } from 'next/navigation';
import { Heart, Shield, Clock, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh px-5">
      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center py-12">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-lighter rounded-2xl flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary leading-tight mb-3">
            Hantera dödsboet
            <br />
            steg för steg
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Vi guidar dig genom hela processen — från första
            dagen till arvskifte. I din egen takt.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-base text-primary">
              Personlig tidslinje baserad på din situation
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-base text-primary">
              Byggt på svensk lag — Ärvdabalken &amp; Skatteverkets regler
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-base text-primary">
              Designat för att vara enkelt, även när allt känns svårt
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pb-8">
        <button
          onClick={() => router.push('/onboarding')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          Kom igång
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-center text-sm text-muted mt-3">
          Tar ca 2 minuter. Helt gratis.
        </p>
      </div>
    </div>
  );
}
