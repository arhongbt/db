'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Shield,
  Clock,
  ChevronRight,
  FileText,
  Scale,
  Lock,
  Bell,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { loadState } from '@/lib/store';
import { DoveLogo } from '@/components/ui/DoveLogo';

export default function LandingPage() {
  const router = useRouter();
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.deceasedName) setHasExisting(true);
  }, []);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero — empathetic, calm */}
      <section className="flex flex-col justify-center px-5 pt-10 pb-6">
        <DoveLogo size={48} className="mb-6" />
        <h1 className="text-3xl font-bold text-primary leading-tight mb-4">
          Vi hjälper dig genom det svåra
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Att hantera ett dödsbo kan kännas överväldigande.
          Sista Resan guidar dig steg för steg — i din egen takt.
        </p>
      </section>

      {/* Empathy box */}
      <section className="px-5 pb-6">
        <div className="info-box">
          <p className="text-sm text-primary/80 leading-relaxed">
            Du behöver inte ha koll på allt just nu. Vi hjälper dig se vad
            som behöver göras, i vilken ordning, och när det är dags.
          </p>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="px-5 pb-8">
        {hasExisting ? (
          <>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary mb-3 flex items-center justify-center gap-2"
            >
              Fortsätt där du var
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full py-3 text-muted font-medium text-sm transition-colors hover:text-primary flex items-center justify-center"
            >
              Eller starta nytt dödsbo
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Börja här
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-muted mt-3">
              Gratis. Inga konton, inga krav.
            </p>
          </>
        )}
      </section>

      {/* What the app helps with */}
      <section className="px-5 pb-8">
        <h2 className="text-xl font-bold text-primary mb-5">Vad appen hjälper dig med</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              icon: Clock,
              title: 'Personlig tidslinje',
              desc: 'Anpassad efter din situation — du ser bara det som är relevant just nu',
            },
            {
              icon: FileText,
              title: 'Bouppteckning',
              desc: 'Samla underlag och skapa dokument — steg för steg',
            },
            {
              icon: MessageSquare,
              title: 'Fråga när du undrar',
              desc: 'En AI-assistent som förklarar juridiken på enkel svenska',
            },
            {
              icon: Bell,
              title: 'Påminnelser',
              desc: 'Vi håller koll på fristerna — du behöver inte',
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
      </section>

      {/* How it works */}
      <section className="px-5 pb-8">
        <h2 className="text-xl font-bold text-primary mb-5">Så fungerar det</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              step: '1',
              title: 'Berätta om din situation',
              desc: 'Några enkla frågor — tar 2 minuter',
            },
            {
              step: '2',
              title: 'Följ din plan',
              desc: 'Se vad som behöver göras härnäst',
            },
            {
              step: '3',
              title: 'Ta det i din takt',
              desc: 'Ingen brådska — allt sparas automatiskt',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-primary">{item.title}</p>
                <p className="text-sm text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-5 pb-8">
        <div className="bg-primary-lighter/20 rounded-card p-5">
          <h3 className="font-semibold text-primary mb-4">Du är i trygga händer</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: Scale, text: 'Baserat på Ärvdabalken och Skatteverkets regler' },
              { icon: Lock, text: 'Dina uppgifter stannar på din enhet' },
              { icon: Shield, text: 'Grundversionen är gratis — du väljer själv om du vill låsa upp mer' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <t.icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary/80">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — SEO rich */}
      <section className="px-5 pb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Vanliga frågor</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'Vad kostar det?',
              a: 'Grundversionen är gratis — checklista, tidslinje och guider ingår. Vissa funktioner som PDF-generering och AI-assistenten kan kosta en engångsavgift längre fram.',
            },
            {
              q: 'Ersätter appen en jurist?',
              a: 'Appen ger allmän vägledning baserad på svensk lag, men ersätter inte juridisk rådgivning. Vid komplicerade ärenden rekommenderar vi alltid att kontakta en jurist.',
            },
            {
              q: 'Hur lång tid tar en bouppteckning?',
              a: 'Den ska vara klar inom 3 månader efter dödsfallet och skickas till Skatteverket inom 1 månad efter förrättningen. Appen hjälper dig hålla koll.',
            },
          ].map((faq, i) => (
            <details key={i} className="card group">
              <summary className="flex items-center justify-between cursor-pointer font-medium text-primary text-sm list-none">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-muted transition-transform group-open:rotate-90 flex-shrink-0" />
              </summary>
              <p className="text-sm text-muted mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
        <Link
          href="/faq"
          className="flex items-center justify-center gap-1 text-sm text-accent font-medium mt-4 hover:underline"
        >
          Se alla vanliga frågor
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Final CTA — soft */}
      <section className="px-5 pb-6">
        <button
          onClick={() => router.push(hasExisting ? '/dashboard' : '/onboarding')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {hasExisting ? 'Fortsätt där du var' : 'Börja här'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-8 pt-4">
        <div className="flex justify-center gap-4 text-xs text-muted mb-4">
          <Link href="/om" className="hover:text-accent transition-colors">Om oss</Link>
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">Integritetspolicy</Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">Villkor</Link>
          <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
        </div>
        <p className="text-center text-[10px] text-muted/60">
          Sista Resan ger allmän vägledning och ersätter inte juridisk rådgivning.
        </p>
      </footer>
    </div>
  );
}
