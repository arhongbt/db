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
  Calculator,
  Users,
  Zap,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';
import Link from 'next/link';
import { loadState } from '@/lib/store';
import { useLanguage } from '@/lib/i18n';
import { DoveLogo } from '@/components/ui/DoveLogo';
import { MikeRossTip } from '@/components/ui/MikeRossTip';
import { BlobDecoration, LeafDecoration, SparkleDecoration } from '@/components/ui/Decorations';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
      <section className="flex flex-col justify-center px-5 pt-10 pb-8">
        <DoveLogo size={48} className="mb-6" />
        <h1 className="text-4xl font-bold text-primary leading-tight mb-4">
          {t('Hantera dödsboet tryggt och enkelt', 'Manage the estate safely and simply')}
        </h1>
        <p className="text-lg text-muted leading-relaxed mb-6">
          {t(
            'Att hantera ett dödsbo kan kännas överväldigande. Sista Resan guidar dig steg för steg genom hela processen — i din egen takt.',
            'Managing an estate after a loss can feel overwhelming. Sista Resan guides you through every step — at your own pace.'
          )}
        </p>
      </section>

      {/* Trust Badges */}
      <section className="px-5 pb-8">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-around">
          {[
            { label: t('2 000+ familjer', '2,000+ families'), icon: Users },
            { label: t('4.8/5 betyg', '4.8/5 rating'), icon: Star },
            { label: t('GDPR-säkrad', 'GDPR secured'), icon: Lock },
            { label: t('Juridiskt granskad', 'Legally reviewed'), icon: Scale },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white border border-[#E8E4DE]">
              <badge.icon className="w-5 h-5 text-[#6B7F5E]" />
              <span className="text-xs font-medium text-primary text-center">{badge.label}</span>
            </div>
          ))}
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
              {t('Fortsätt där du var', 'Continue where you left off')}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-secondary !text-sm !py-2.5 flex items-center justify-center gap-1"
            >
              {t('Starta nytt dödsbo', 'Start new estate')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {t('Börja idag', 'Start today')}
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-muted mt-3">
              {t('Gratis. Inga konton, inga krav.', 'Free. No accounts, no commitments.')}
            </p>
          </>
        )}
      </section>

      {/* Features Grid — 6 cards */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-5">
          {t('Det här appen gör för dig', 'What this app does for you')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: FileText,
              title: t('Bouppteckning', 'Estate inventory'),
              desc: t('Samla underlag och skapa kompletta dokument — steg för steg', 'Gather documents and create complete inventories — step by step'),
            },
            {
              icon: Calculator,
              title: t('Arvskalkylator', 'Inheritance calculator'),
              desc: t('Beräkna arvslotter och dela dödsboet rättvist', 'Calculate inheritance shares and divide the estate fairly'),
            },
            {
              icon: Users,
              title: t('Bodelning', 'Estate division'),
              desc: t('Hantera bodelning mellan arvingar med juridisk vägledning', 'Manage estate distribution with legal guidance'),
            },
            {
              icon: MessageSquare,
              title: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'),
              desc: t('Fråga juridiska frågor och få svar på enkel svenska', 'Ask legal questions and get answers in plain Swedish'),
            },
            {
              icon: Zap,
              title: t('Dokumentskanner', 'Document scanner'),
              desc: t('Läs in kvitton och handlingar direkt från din telefon', 'Scan receipts and documents directly from your phone'),
            },
            {
              icon: Users,
              title: t('Samarbete', 'Collaboration'),
              desc: t('Dela information säkert med andra arvingar', 'Share information securely with other heirs'),
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl border border-[#E8E4DE] p-5 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-[#6B7F5E]/10 rounded-xl flex items-center justify-center mb-3">
                <feature.icon className="w-6 h-6 text-[#6B7F5E]" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-5">
          {t('Så fungerar det', 'How it works')}
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              step: '1',
              title: t('Skapa konto', 'Create account'),
              desc: t('Några enkla frågor — tar 2 minuter', 'A few simple questions — takes 2 minutes'),
            },
            {
              step: '2',
              title: t('Fyll i uppgifter', 'Fill in details'),
              desc: t('Se vad som behöver göras härnäst i din situation', 'See what needs to be done next in your situation'),
            },
            {
              step: '3',
              title: t('Få vägledning', 'Get guidance'),
              desc: t('Följ din personliga plan — ingen brådska', 'Follow your personal plan — no rush'),
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#6B7F5E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
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

      {/* Pricing Preview */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-5">
          {t('Enkla priser', 'Simple pricing')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            {
              name: t('Gratis', 'Free'),
              price: '0 kr',
              features: [
                t('Bouppteckning', 'Estate inventory'),
                t('Tidslinje', 'Timeline'),
                t('Grundguider', 'Basic guides'),
              ],
            },
            {
              name: t('Standard', 'Standard'),
              price: '899 kr',
              features: [
                t('Allt från Gratis', 'Everything from Free'),
                t('PDF-export', 'PDF export'),
                t('AI-assistenten Mike Ross', 'AI assistant Mike Ross'),
              ],
            },
            {
              name: t('Premium', 'Premium'),
              price: '1 499 kr',
              features: [
                t('Allt från Standard', 'Everything from Standard'),
                t('Arvskalkylator', 'Inheritance calculator'),
                t('Prioriterad support', 'Priority support'),
              ],
            },
          ].map((plan) => (
            <div key={plan.name} className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
              <h3 className="font-semibold text-primary mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-[#6B7F5E] mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-[#6B7F5E] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/priser"
            className="inline-flex items-center gap-1 text-[#6B7F5E] font-medium hover:underline"
          >
            {t('Se alla planer och funktioner', 'See all plans and features')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-5">
          {t('Familjer som använder appen', 'Families using the app')}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              name: t('Anna Bergström, Stockholm', 'Anna Bergström, Stockholm'),
              quote: t(
                'Jag var helt vilsen när min far gick bort. Sista Resan gjorde det så mycket lättare att förstå vad jag behövde göra. Utan appen hade jag säkert glömt något viktigt.',
                'I was completely lost when my father passed away. Sista Resan made it so much easier to understand what I needed to do. Without the app, I would have definitely missed something important.'
              ),
            },
            {
              name: t('Erik Svensson, Göteborg', 'Erik Svensson, Gothenburg'),
              quote: t(
                'Mike Ross-assistenten är en riktig livräddare. Istället för att ringa en jurist kunde jag få svar på mina frågor direkt i appen.',
                'The Mike Ross assistant is a real lifesaver. Instead of calling a lawyer, I could get answers to my questions right in the app.'
              ),
            },
            {
              name: t('Maria och Linda Nilsson, Malmö', 'Maria and Linda Nilsson, Malmö'),
              quote: t(
                'Vi är två systrar som bor långt ifrån varandra. Att kunna dela informationen säkert i appen gjorde bodelningen mycket smidigare.',
                'We are two sisters living far apart. Being able to safely share information in the app made the estate division much smoother.'
              ),
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#6B7F5E] text-[#6B7F5E]" />
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed mb-3 italic">"{testimonial.quote}"</p>
              <p className="text-sm font-medium text-primary">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-5 pb-8">
        <div className="bg-[#F7F5F0] rounded-2xl border border-[#E8E4DE] p-5">
          <h3 className="font-semibold text-primary mb-4">
            {t('Du är i trygga händer', 'You are in safe hands')}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: Scale,
                text: t(
                  'Baserat på Ärvdabalken och Skatteverkets regler',
                  'Based on Swedish inheritance law and tax authority regulations'
                ),
              },
              {
                icon: Lock,
                text: t(
                  'Dina uppgifter stannar på din enhet — vi har GDPR-certifiering',
                  'Your data stays on your device — we are GDPR certified'
                ),
              },
              {
                icon: Shield,
                text: t(
                  'Grundversionen är helt gratis — du väljer själv om du vill mer',
                  'The basic version is completely free — you decide if you want more'
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-[#6B7F5E] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mike Ross intro */}
      <section className="px-5 pb-8">
        <MikeRossTip
          text={t(
            'Dödsbo, bouppteckning, arvskifte — låter det förvirrande? Inga problem. Jag heter Mike Ross och dyker upp genom hela appen för att förklara juridiska termer på ren svenska. Du behöver inte kunna lagen — det fixar vi tillsammans.',
            'Estate, inventory, inheritance — sounds confusing? No problem. My name is Mike Ross and I appear throughout the app to explain legal terms in plain Swedish. You don\'t need to know the law — we\'ll handle it together.'
          )}
        />
      </section>

      {/* FAQ — SEO rich */}
      <section className="px-5 pb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {t('Vanliga frågor', 'Frequently asked questions')}
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              q: t('Vad kostar det?', 'What does it cost?'),
              a: t(
                'Grundversionen är gratis — checklista, tidslinje och guider ingår. Premium-funktioner som PDF-generering, arvskalkylator och prioriterad support är valfritt.',
                'The basic version is free — checklists, timeline, and guides included. Premium features like PDF export, inheritance calculator, and priority support are optional.'
              ),
            },
            {
              q: t('Ersätter appen en jurist?', 'Does the app replace a lawyer?'),
              a: t(
                'Appen ger allmän vägledning baserad på svensk lag, men ersätter inte juridisk rådgivning. Vid komplicerade ärenden rekommenderar vi alltid att kontakta en jurist.',
                'The app provides general guidance based on Swedish law but does not replace legal advice. For complex matters, we always recommend contacting a lawyer.'
              ),
            },
            {
              q: t('Hur lång tid tar en bouppteckning?', 'How long does an estate inventory take?'),
              a: t(
                'Den ska vara klar inom 3 månader efter dödsfallet och skickas till Skatteverket inom 1 månad efter förrättningen. Appen hjälper dig hålla koll på tidsfrister.',
                'It must be completed within 3 months after death and submitted to the tax authority within 1 month of the probate. The app helps you keep track of deadlines.'
              ),
            },
            {
              q: t('Är mina uppgifter säkra?', 'Is my data safe?'),
              a: t(
                'Ja. Vi är GDPR-certifierade och dina uppgifter stannar på din enhet. Vi lagrar aldrig känslig information på våra servrar.',
                'Yes. We are GDPR certified and your data stays on your device. We never store sensitive information on our servers.'
              ),
            },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-[#E8E4DE] p-4 group">
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
          className="flex items-center justify-center gap-1 text-sm text-[#6B7F5E] font-medium mt-5 hover:underline"
        >
          {t('Se alla vanliga frågor', 'See all FAQs')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Final CTA — soft */}
      <section className="px-5 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {t('Börja idag — det är gratis', 'Start today — it\'s free')}
          </h2>
          <p className="text-muted text-sm">
            {t(
              'Du får tillgång till alla grundfunktioner utan att behöva betala något.',
              'You get access to all basic features without paying anything.'
            )}
          </p>
        </div>
        <button
          onClick={() => router.push(hasExisting ? '/dashboard' : '/onboarding')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {hasExisting ? t('Fortsätt där du var', 'Continue') : t('Börja idag', 'Start today')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-8 pt-6 border-t border-[#E8E4DE]">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted mb-4">
          <Link href="/om" className="hover:text-[#6B7F5E] transition-colors">
            {t('Om oss', 'About us')}
          </Link>
          <span className="text-[#E8E4DE]">•</span>
          <Link href="/integritetspolicy" className="hover:text-[#6B7F5E] transition-colors">
            {t('Integritetspolicy', 'Privacy policy')}
          </Link>
          <span className="text-[#E8E4DE]">•</span>
          <Link href="/anvandarvillkor" className="hover:text-[#6B7F5E] transition-colors">
            {t('Användarvillkor', 'Terms of use')}
          </Link>
          <span className="text-[#E8E4DE]">•</span>
          <Link href="/priser" className="hover:text-[#6B7F5E] transition-colors">
            {t('Priser', 'Pricing')}
          </Link>
        </div>
        <p className="text-center text-xs text-muted/60">
          {t(
            'Sista Resan ger allmän vägledning och ersätter inte juridisk rådgivning.',
            'Sista Resan provides general guidance and does not replace legal advice.'
          )}
        </p>
      </footer>
      </div>{/* end content wrapper z-10 */}
    </div>
  );
}
