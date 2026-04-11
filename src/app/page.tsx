'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  FileText,
  Smartphone,
  Users,
  Scale,
  ArrowRight,
  Star,
  Zap,
  Lock,
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
      {/* Hero */}
      <section className="flex flex-col justify-center px-5 pt-10 pb-8">
        <div className="mb-8">
          <DoveLogo size={52} className="mb-6" />
          <h1 className="text-3xl font-bold text-primary leading-tight mb-4">
            Hantera dödsboet{' '}
            <span className="text-accent">steg för steg</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Sveriges första digitala dödsbohjälp. Från första dagen till arvskifte
            — utan juridikspråk, i din egen takt.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mb-4">
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
                className="w-full py-3 text-muted font-medium text-sm transition-colors hover:text-primary flex items-center justify-center gap-1"
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
                Kom igång — helt gratis
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-center text-sm text-muted mt-3">
                Tar 2 minuter. Ingen registrering krävs.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Social proof / trust bar */}
      <section className="px-5 pb-8">
        <div className="flex items-center justify-center gap-6 text-center">
          <div>
            <p className="text-xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted">Gratis att börja</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <p className="text-xl font-bold text-primary">30+</p>
            <p className="text-xs text-muted">Verktyg & guider</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <p className="text-xl font-bold text-primary">Svensk</p>
            <p className="text-xs text-muted">lag & praxis</p>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="px-5 pb-8">
        <div className="bg-red-50/60 rounded-card p-5 mb-4">
          <p className="text-sm font-semibold text-warn mb-2">Utan Sista Resan</p>
          <ul className="text-sm text-primary/70 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-warn mt-0.5">✕</span>
              Ringa banker, myndigheter, försäkringsbolag — en efter en
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warn mt-0.5">✕</span>
              Googla juridiska termer mitt i sorgen
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warn mt-0.5">✕</span>
              Betala 5 000+ kr för en juristkonsultation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warn mt-0.5">✕</span>
              Missa viktiga tidsfrister utan att veta om det
            </li>
          </ul>
        </div>
        <div className="bg-green-50/60 rounded-card p-5">
          <p className="text-sm font-semibold text-success mb-2">Med Sista Resan</p>
          <ul className="text-sm text-primary/70 space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              Personlig tidslinje baserad på din situation
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              AI-assistent som svarar på juridiska frågor dygnet runt
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              Generera bouppteckning som PDF — automatiskt
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              Påminnelser innan alla viktiga frister
            </li>
          </ul>
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
              desc: 'Svara på några enkla frågor — tar 2 minuter. Vi skapar en personlig plan.',
            },
            {
              step: '2',
              title: 'Följ din tidslinje',
              desc: 'Se exakt vad som behöver göras och när. Appen anpassar sig efter din fas.',
            },
            {
              step: '3',
              title: 'Generera dokument',
              desc: 'Bouppteckning, bankbrev, fullmakter — allt skapas automatiskt som PDF.',
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

      {/* Features grid */}
      <section className="px-5 pb-8">
        <h2 className="text-xl font-bold text-primary mb-5">Allt du behöver</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Clock, title: 'Tidslinje', desc: 'Automatiska påminnelser' },
            { icon: FileText, title: 'Bouppteckning', desc: 'PDF-generering' },
            { icon: Scale, title: 'AI-jurist', desc: 'Svar dygnet runt' },
            { icon: Users, title: 'Delägare-portal', desc: 'Samarbeta digitalt' },
            { icon: Shield, title: 'Bank-guide', desc: 'Alla 8 storbanker' },
            { icon: Smartphone, title: 'Mobil-app', desc: 'Fungerar offline' },
          ].map((f) => (
            <div key={f.title} className="card py-4 px-3">
              <f.icon className="w-5 h-5 text-accent mb-2" />
              <p className="font-medium text-primary text-sm">{f.title}</p>
              <p className="text-xs text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-5 pb-8">
        <div className="bg-primary-lighter/20 rounded-card p-5">
          <h3 className="font-semibold text-primary mb-4">Byggt för trygghet</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: Scale, text: 'Baserat på Ärvdabalken och Skatteverkets regler' },
              { icon: Lock, text: 'Dina uppgifter lagras lokalt — inte på våra servrar' },
              { icon: Shield, text: 'Granskad av juridiskt kunniga — uppdateras löpande' },
              { icon: Zap, text: 'Gratis grundversion — betala bara om du vill' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <t.icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary/80">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview — SEO rich */}
      <section className="px-5 pb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Vanliga frågor</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'Vad kostar Sista Resan?',
              a: 'Grundversionen är helt gratis. Du kan använda checklistan, tidslinjen och alla guider utan att betala. Premium-funktioner som PDF-generering och AI-assistenten kostar en engångsavgift.',
            },
            {
              q: 'Ersätter appen en jurist?',
              a: 'Appen ger allmän vägledning baserad på svensk lag, men ersätter inte juridisk rådgivning. Vid komplicerade ärenden rekommenderar vi alltid att kontakta en jurist.',
            },
            {
              q: 'Hur lång tid tar en bouppteckning?',
              a: 'En bouppteckning ska vara klar inom 3 månader efter dödsfallet och skickas till Skatteverket inom 1 månad efter förrättningen. Appen hjälper dig hålla koll på alla frister.',
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

      {/* Final CTA */}
      <section className="px-5 pb-6">
        <div className="bg-primary rounded-card p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Redo att ta första steget?
          </h2>
          <p className="text-sm text-white/70 mb-5">
            Tusentals familjer i Sverige hanterar dödsbon varje år. Låt oss hjälpa dig.
          </p>
          <button
            onClick={() => router.push(hasExisting ? '/dashboard' : '/onboarding')}
            className="w-full py-3 px-6 bg-white text-primary font-semibold rounded-card text-base transition-all hover:bg-gray-50 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {hasExisting ? 'Fortsätt där du var' : 'Kom igång — gratis'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
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
