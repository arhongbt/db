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
  Smartphone,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { loadState } from '@/lib/store';
import { DoveLogo } from '@/components/ui/DoveLogo';
import { MikeRossTip } from '@/components/ui/MikeRossTip';
import { BlobDecoration, LeafDecoration, SparkleDecoration } from '@/components/ui/Decorations';

export default function LandingPage() {
  const router = useRouter();
  const [hasExisting, setHasExisting] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.deceasedName) setHasExisting(true);
  }, []);

  useEffect(() => {
    // Check if dismissed in localStorage
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallBanner(false);
  };

  return (
    <div className="flex flex-col min-h-dvh relative overflow-hidden">
      {/* Decorative elements — behind all content */}
      <BlobDecoration className="-top-16 -right-20" color="#EEF2EA" size={220} />
      <BlobDecoration className="top-[55%] -left-24" color="#EDF2F6" size={180} />
      <LeafDecoration className="top-8 right-6" size={36} opacity={0.12} />
      <SparkleDecoration className="top-[25%] right-8" size={16} opacity={0.1} />
      <LeafDecoration className="bottom-[30%] left-3" size={22} opacity={0.08} color="#6E8BA4" />
      <SparkleDecoration className="bottom-16 right-12" size={12} opacity={0.08} />

      {/* All content sits above decorations */}
      <div className="relative z-10 flex flex-col min-h-dvh">

      {/* PWA Install Prompt Banner */}
      {showInstallBanner && (
        <div className="bg-accent/5 border-b border-accent/20 px-5 py-4 flex items-start justify-between gap-4 relative z-20">
          <div className="flex items-start gap-3 flex-1">
            <Smartphone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-primary text-sm">Installera Sista Resan på din telefon</p>
              <p className="text-xs text-muted mt-1">Få snabb åtkomst utan att öppna webbläsaren</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="btn-primary !py-2 !px-4 text-xs font-medium whitespace-nowrap"
            >
              Installera
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Stäng"
            >
              <X className="w-4 h-4 text-muted hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      )}

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
              className="btn-secondary !text-sm !py-2.5 flex items-center justify-center gap-1"
            >
              Starta nytt dödsbo
              <ArrowRight className="w-4 h-4" />
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
        <h2 className="text-2xl font-bold text-primary mb-5">Vad appen hjälper dig med</h2>
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
        <h2 className="text-2xl font-bold text-primary mb-5">Så fungerar det</h2>
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

      {/* Mike Ross intro */}
      <section className="px-5 pb-6">
        <MikeRossTip
          text="Dödsbo, bouppteckning, arvskifte — låter det förvirrande? Inga problem. Jag heter Mike Ross och dyker upp genom hela appen för att förklara juridiska termer på ren svenska. Du behöver inte kunna lagen — det fixar vi."
        />
      </section>

      {/* FAQ — SEO rich */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Vanliga frågor</h2>
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
        <p className="text-center text-xs text-muted/60">
          Sista Resan ger allmän vägledning och ersätter inte juridisk rådgivning.
        </p>
      </footer>
      </div>{/* end content wrapper z-10 */}
    </div>
  );
}
