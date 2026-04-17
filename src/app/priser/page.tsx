'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSubscription } from '@/lib/subscription/context';
import { PaymentFlow } from '@/components/PaymentFlow';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Crown,
  Shield,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Scale,
  Heart,
} from 'lucide-react';

type PlanKey = 'free' | 'premium';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export default function PriserPage() {
  const { t } = useLanguage();
  const { tier, isFree, isPremium, upgradeTo } = useSubscription();
  const [showPayment, setShowPayment] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

  const plans: Record<PlanKey, {
    name: string;
    price: number;
    period: string;
    tagline: string;
    description: string;
    icon: typeof Heart;
    accent: string;
    popular?: boolean;
    features: PlanFeature[];
    cta: string;
  }> = {
    free: {
      name: t('Gratis', 'Free'),
      price: 0,
      period: t('för alltid', 'forever'),
      tagline: t('Kom igång utan kostnad', 'Get started for free'),
      description: t(
        'Grundläggande verktyg för att organisera dödsboet — checklistor, påminnelser, guider och samarbete med familjen.',
        'Essential tools to organize the estate — checklists, reminders, guides and family collaboration.'
      ),
      icon: Heart,
      accent: '#6B7F5E',
      features: [
        { text: t('Checklista för dödsbo', 'Estate checklist'), included: true },
        { text: t('Påminnelser & tidsfrister', 'Reminders & deadlines'), included: true },
        { text: t('Guider & steg-för-steg', 'Guides & step-by-step'), included: true },
        { text: t('Ordlista & FAQ', 'Glossary & FAQ'), included: true },
        { text: t('Nödbroms — vad gör jag först?', 'Emergency — what do I do first?'), included: true },
        { text: t('Kalender', 'Calendar'), included: true },
        { text: t('Samarbete med delägare', 'Collaboration with co-owners'), included: true },
        { text: t('Tidslinje', 'Timeline'), included: true },
      ],
      cta: isFree ? t('Din nuvarande plan', 'Your current plan') : t('Gratis', 'Free'),
    },
    premium: {
      name: 'Premium',
      price: 799,
      period: t('engångsbelopp', 'one-time'),
      tagline: t('Allt du behöver — från start till slut', 'Everything you need — from start to finish'),
      description: t(
        'Alla gratisfunktioner plus AI-jurist, dokumentgenerering, PDF-export och mycket mer. En engångsbetalning — inga prenumerationer.',
        'All free features plus AI lawyer, document generation, PDF export and much more. A one-time payment — no subscriptions.'
      ),
      icon: Crown,
      accent: '#6B7F5E',
      popular: true,
      features: [
        { text: t('Allt i Gratis', 'Everything in Free'), included: true, highlight: true },
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: true, highlight: true },
        { text: t('Dokumentgenerering (bouppteckning, arvskifte, bodelning, bankbrev, dödsannons, fullmakt m.m.)', 'Document generation (estate inventory, inheritance settlement, property division, bank letter, death notice, power of attorney etc.)'), included: true },
        { text: t('PDF-export av alla dokument', 'PDF export of all documents'), included: true },
        { text: t('Skatteverket digital inlämning', 'Tax authority digital submission'), included: true },
        { text: t('Företagsmodul', 'Business module'), included: true },
        { text: t('Internationell modul', 'International module'), included: true },
        { text: t('Kryptoguide', 'Crypto guide'), included: true },
        { text: t('Dokumentskanner med OCR', 'Document scanner with OCR'), included: true },
        { text: t('Exportera all data', 'Export all data'), included: true },
      ],
      cta: isPremium ? t('Din nuvarande plan', 'Your current plan') : t('Uppgradera — 799 kr', 'Upgrade — 799 kr'),
    },
  };

  const faqs = [
    {
      q: t('Vad ingår i gratisversionen?', 'What\'s included in the free version?'),
      a: t(
        'Gratisversionen ger dig checklistor, påminnelser, tidslinjer, guider, ordlista, FAQ och samarbete med delägare. Allt du behöver för att komma igång med dödsboet.',
        'The free version gives you checklists, reminders, timelines, guides, glossary, FAQ and co-owner collaboration. Everything you need to get started with the estate.'
      ),
    },
    {
      q: t('Vad får jag med Premium?', 'What do I get with Premium?'),
      a: t(
        'Premium lägger till AI-juristen Mike Ross, dokumentgenerering (bouppteckning, arvskifte, bodelning, bankbrev, dödsannons, fullmakt m.m.), PDF-export, Skatteverket-inlämning, företags- och internationell modul, kryptoguide, dokumentskanner och dataexport.',
        'Premium adds AI lawyer Mike Ross, document generation (estate inventory, inheritance settlement, property division, bank letter, death notice, power of attorney etc.), PDF export, tax authority submission, business & international modules, crypto guide, document scanner and data export.'
      ),
    },
    {
      q: t('Är det en engångsbetalning?', 'Is it a one-time payment?'),
      a: t(
        'Ja! Premium kostar 799 kr som engångsbelopp per dödsbo — du betalar en gång och har full tillgång tills dödsboet är avslutat. Ingen prenumeration, inga dolda avgifter.',
        'Yes! Premium costs 799 kr as a one-time payment per estate — you pay once and have full access until the estate is settled. No subscription, no hidden fees.'
      ),
    },
    {
      q: t('Ersätter appen en jurist?', 'Does the app replace a lawyer?'),
      a: t(
        'Nej, appen ger dig verktyg och vägledning för att hantera dödsboet effektivt. AI-juristen Mike Ross hjälper med juridiska frågor men ersätter inte en auktoriserad jurist.',
        'No, the app provides tools and guidance to manage the estate efficiently. AI lawyer Mike Ross helps with legal questions but does not replace a licensed attorney.'
      ),
    },
    {
      q: t('Kan jag få pengarna tillbaka?', 'Can I get a refund?'),
      a: t(
        'Du har 14 dagars ångerrätt enligt svensk konsumentlag. Kontakta oss så löser vi det.',
        'You have a 14-day right of withdrawal under Swedish consumer law. Contact us and we\'ll sort it out.'
      ),
    },
  ];

  const handleChoosePlan = (plan: PlanKey) => {
    if (plan === 'free') return;
    if (isPremium) return;
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    upgradeTo('premium');
    setShowPayment(false);
  };

  return (
    <main className="min-h-dvh pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-muted mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>
        <h1 className="text-3xl font-display text-primary leading-tight">
          {t('Gratis att börja.', 'Free to start.')}
        </h1>
        <h2 className="text-3xl font-display leading-tight" style={{ color: 'var(--muted)' }}>
          {t('Premium när du är redo.', 'Premium when you\'re ready.')}
        </h2>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          {t(
            'Kom igång helt gratis med checklistor, påminnelser och guider. Uppgradera till Premium när du behöver mer.',
            'Get started completely free with checklists, reminders and guides. Upgrade to Premium when you need more.'
          )}
        </p>
      </div>

      {/* Trust badges */}
      <div className="px-6 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Shield, text: t('GDPR-säkrad', 'GDPR-secured') },
            { icon: Users, text: t('2 000+ familjer', '2,000+ families') },
            { icon: Star, text: t('4.8/5 betyg', '4.8/5 rating') },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Boka jurist CTA */}
      <div className="px-6 mb-6">
        <Link
          href="/boka-jurist"
          className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all hover:opacity-90"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          >
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display text-primary">
              {t('Boka digital juristkonsultation', 'Book a digital lawyer consultation')}
            </p>
            <p className="text-xs text-muted">
              {t('Gratis första timme — välj tid direkt', 'Free first hour — pick a time directly')}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted flex-shrink-0" />
        </Link>
      </div>

      {/* Plan cards */}
      <div className="px-6 space-y-4">
        {(['free', 'premium'] as PlanKey[]).map((key) => {
          const plan = plans[key];
          const isPopular = plan.popular;
          const isCurrentPlan = key === tier;
          const isFreeCard = key === 'free';

          return (
            <div
              key={key}
              className="relative rounded-2xl overflow-hidden transition-all"
              style={{
                background: 'var(--bg-card)',
                border: isPopular
                  ? '2px solid #6B7F5E'
                  : isCurrentPlan
                    ? '2px solid #6B7F5E'
                    : '1px solid var(--border)',
                boxShadow: isPopular ? '0 8px 24px rgba(107, 127, 94, 0.15)' : 'none',
              }}
            >
              {/* Popular badge */}
              {isPopular && !isCurrentPlan && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-display"
                  style={{ background: '#6B7F5E' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('Rekommenderad', 'Recommended')}
                </div>
              )}
              {isCurrentPlan && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-display"
                  style={{ background: '#6B7F5E' }}
                >
                  <Check className="w-3.5 h-3.5" />
                  {t('Din nuvarande plan', 'Your current plan')}
                </div>
              )}

              <div className="p-6">
                {/* Plan header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(107, 127, 94, 0.12)' }}
                    >
                      <plan.icon className="w-5 h-5" style={{ color: plan.accent }} />
                    </div>
                    <div>
                      <h3 className="font-display text-primary text-lg leading-tight">{plan.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    {isFreeCard ? (
                      <div className="text-3xl font-display" style={{ color: plan.accent }}>
                        {t('Gratis', 'Free')}
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl font-display text-primary leading-none">
                          {plan.price}
                          <span className="text-base ml-1">kr</span>
                        </div>
                        <div className="text-xs text-muted mt-1">{plan.period}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-sm font-medium text-primary mb-1">{plan.tagline}</p>
                <p className="text-sm text-muted mb-4 leading-relaxed">{plan.description}</p>

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: plan.accent }}
                      />
                      <span
                        className={`text-sm leading-snug ${feature.highlight ? 'font-display text-primary' : 'text-primary'}`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleChoosePlan(key)}
                  disabled={isFreeCard || isCurrentPlan}
                  className="w-full py-3.5 rounded-2xl font-display text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-default"
                  style={{
                    background: isFreeCard || isCurrentPlan
                      ? 'transparent'
                      : 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
                    color: isFreeCard || isCurrentPlan ? '#6B7F5E' : '#FFFFFF',
                    border: isFreeCard || isCurrentPlan ? '2px solid var(--border)' : 'none',
                  }}
                >
                  {plan.cta}
                  {!isFreeCard && !isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Value comparison note */}
      <div className="px-6 mt-8">
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}
            >
              <HelpCircle className="w-5 h-5" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h4 className="font-display text-primary text-sm mb-1">
                {t('Jämförelse', 'Comparison')}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {t(
                  'En traditionell jurist kostar 2 000–5 000 kr/timme. Bouppteckning med jurist: 15 000–40 000 kr. Med Sista Resan Premium (799 kr engångsbelopp) sparar du tusenlappar.',
                  'A traditional lawyer costs SEK 2,000–5,000/hour. Estate inventory with lawyer: SEK 15,000–40,000. With Sista Resan Premium (SEK 799 one-time) you save thousands.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-display text-primary mb-4">
          {t('Vanliga frågor om priser', 'Pricing FAQ')}
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-primary pr-2">{faq.q}</span>
                <ChevronIcon open={showFAQ === i} />
              </button>
              {showFAQ === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Money-back guarantee */}
      <div className="px-6 mt-8 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ background: 'rgba(107, 127, 94, 0.06)', borderColor: 'rgba(107, 127, 94, 0.2)' }}
        >
          <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: '#6B7F5E' }} />
          <h3 className="font-display text-primary text-sm mb-1">
            {t('14 dagars ångerrätt', '14-day money-back guarantee')}
          </h3>
          <p className="text-xs text-muted">
            {t(
              'Inte nöjd? Du får pengarna tillbaka — inga frågor.',
              'Not satisfied? Get your money back — no questions asked.'
            )}
          </p>
        </div>
      </div>

      {/* Payment Flow Modal */}
      {showPayment && (
        <PaymentFlow
          amount={799}
          description={`Sista Resan Premium`}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </main>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
