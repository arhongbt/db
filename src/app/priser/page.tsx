'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { PaymentFlow } from '@/components/PaymentFlow';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  X,
  Crown,
  Zap,
  Shield,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Scale,
  Infinity as InfinityIcon,
} from 'lucide-react';

type PlanKey = 'free' | 'bas' | 'familj' | 'lifetime';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export default function PriserPage() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

  const plans: Record<PlanKey, {
    name: string;
    price: number;
    period: string;
    tagline: string;
    description: string;
    icon: typeof Zap;
    accent: string;
    popular?: boolean;
    anchor?: boolean;
    users: string;
    features: PlanFeature[];
    cta: string;
    savings?: string;
  }> = {
    free: {
      name: t('Gratis', 'Free'),
      price: 0,
      period: t('f\u00f6r alltid', 'forever'),
      tagline: t('Kom ig\u00e5ng utan kostnad', 'Get started for free'),
      description: t(
        'Grundl\u00e4ggande verktyg f\u00f6r att komma ig\u00e5ng',
        'Basic tools to get you started'
      ),
      icon: Zap,
      accent: '#7A9E7E',
      users: t('1 anv\u00e4ndare', '1 user'),
      features: [
        { text: t('Checklista f\u00f6r d\u00f6dsbo', 'Estate checklist'), included: true },
        { text: t('Ordlista & FAQ', 'Glossary & FAQ'), included: true },
        { text: t('Grundl\u00e4ggande guider', 'Basic guides'), included: true },
        { text: t('Tidsfrister & p\u00e5minnelser', 'Deadlines & reminders'), included: true },
        { text: t('Kostnadskalkylator', 'Cost calculator'), included: true },
        { text: t('Arvskalkylator (begr\u00e4nsad)', 'Inheritance calculator (limited)'), included: true },
        { text: t('Dokumentskanner', 'Document scanner'), included: false },
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: false },
      ],
      cta: t('Kom ig\u00e5ng gratis', 'Get started free'),
    },
    bas: {
      name: t('Bas', 'Basic'),
      price: 499,
      period: t('eng\u00e5ngsbelopp', 'one-time'),
      tagline: t('F\u00f6r enklare d\u00f6dsbon', 'For simpler estates'),
      description: t(
        'Perfekt n\u00e4r du sk\u00f6ter d\u00f6dsboet sj\u00e4lv',
        'Perfect when you manage the estate yourself'
      ),
      icon: Shield,
      accent: '#7A9E7E',
      users: t('1 anv\u00e4ndare', '1 user'),
      features: [
        { text: t('Allt i Gratis', 'Everything in Free'), included: true },
        { text: t('Bouppteckning steg-f\u00f6r-steg', 'Estate inventory step-by-step'), included: true },
        { text: t('Arvskalkylator (full)', 'Inheritance calculator (full)'), included: true },
        { text: t('Dokumentskanner med OCR', 'Document scanner with OCR'), included: true },
        { text: t('Exportera dokument (PDF/Word)', 'Export documents (PDF/Word)'), included: true },
        { text: t('AI-jurist Mike Ross (begr\u00e4nsad)', 'AI lawyer Mike Ross (limited)'), included: true },
        { text: t('Samarbete med familjen', 'Family collaboration'), included: false },
        { text: t('Bodelningswizard', 'Property division wizard'), included: false },
      ],
      cta: t('V\u00e4lj Bas', 'Choose Basic'),
    },
    familj: {
      name: t('Familj', 'Family'),
      price: 899,
      period: t('eng\u00e5ngsbelopp', 'one-time'),
      tagline: t('B\u00e4st f\u00f6r de flesta familjer', 'Best for most families'),
      description: t(
        'Allt du beh\u00f6ver f\u00f6r att sk\u00f6ta hela d\u00f6dsboet tillsammans',
        'Everything you need to manage the estate together'
      ),
      icon: Users,
      accent: '#7A9E7E',
      popular: true,
      users: t('Upp till 3 anv\u00e4ndare', 'Up to 3 users'),
      savings: t('Spara 300 kr vs. Bas per person', 'Save 300 kr vs. Basic per person'),
      features: [
        { text: t('Allt i Bas', 'Everything in Basic'), included: true, highlight: true },
        { text: t('Samarbete med familjen', 'Family collaboration'), included: true },
        { text: t('Bodelningswizard', 'Property division wizard'), included: true },
        { text: t('AI-jurist Mike Ross (obegr\u00e4nsad)', 'AI lawyer Mike Ross (unlimited)'), included: true },
        { text: t('Avancerad bodelning', 'Advanced property division'), included: true },
        { text: t('Digitala tillg\u00e5ngar', 'Digital assets'), included: true },
        { text: t('Fullmaktsgenerator', 'Power of attorney generator'), included: true },
        { text: t('Skatteoptimering', 'Tax optimization'), included: true },
        { text: t('Internationella d\u00f6dsbon', 'International estates'), included: false },
        { text: t('Obegr\u00e4nsat antal anv\u00e4ndare', 'Unlimited users'), included: false },
      ],
      cta: t('V\u00e4lj Familj', 'Choose Family'),
    },
    lifetime: {
      name: t('Lifetime Familj', 'Lifetime Family'),
      price: 2499,
      period: t('en g\u00e5ng \u2014 f\u00f6r alltid', 'one-time \u2014 forever'),
      tagline: t('V\u00e5r kompletta upplevelse', 'Our complete experience'),
      description: t(
        'Obegr\u00e4nsade anv\u00e4ndare, alla framtida uppdateringar, personlig jurist',
        'Unlimited users, all future updates, personal lawyer'
      ),
      icon: Crown,
      accent: '#8B6914',
      anchor: true,
      users: t('Obegr\u00e4nsat antal anv\u00e4ndare', 'Unlimited users'),
      features: [
        { text: t('Allt i Familj', 'Everything in Family'), included: true, highlight: true },
        { text: t('Obegr\u00e4nsat antal familjemedlemmar', 'Unlimited family members'), included: true, highlight: true },
        { text: t('Alla framtida uppdateringar', 'All future updates'), included: true },
        { text: t('Internationella d\u00f6dsbon', 'International estates'), included: true },
        { text: t('F\u00f6retag i d\u00f6dsbo (AB, HB, enskild firma)', 'Business in estate (Ltd, partnerships, sole trader)'), included: true },
        { text: t('Kryptovaluta-guide', 'Cryptocurrency guide'), included: true },
        { text: t('Personlig jurist (60 min konsultation)', 'Personal lawyer (60 min consultation)'), included: true },
        { text: t('Prioriterad support 24/7', 'Priority support 24/7'), included: true },
        { text: t('Dedikerad kundansvarig', 'Dedicated account manager'), included: true },
      ],
      cta: t('V\u00e4lj Lifetime', 'Choose Lifetime'),
    },
  };

  const faqs = [
    {
      q: t('Vad \u00e4r skillnaden mellan Familj och Lifetime?', 'What\u2019s the difference between Family and Lifetime?'),
      a: t(
        'Familj passar de flesta: upp till 3 anv\u00e4ndare och alla kritiska verktyg. Lifetime \u00e4r f\u00f6r st\u00f6rre eller mer komplexa d\u00f6dsbon \u2014 obegr\u00e4nsat antal familjemedlemmar, internationella arv, f\u00f6retag i d\u00f6dsbo, krypto, personlig jurist och alla framtida uppdateringar.',
        'Family suits most: up to 3 users and all critical tools. Lifetime is for larger or more complex estates \u2014 unlimited family members, international estates, business in estate, crypto, personal lawyer and all future updates.'
      ),
    },
    {
      q: t('\u00c4r det verkligen eng\u00e5ngsbelopp?', 'Is it really a one-time fee?'),
      a: t(
        'Ja! Alla v\u00e5ra planer \u00e4r eng\u00e5ngsbetalningar. Du betalar en g\u00e5ng och har tillg\u00e5ng till alla funktioner s\u00e5 l\u00e4nge du beh\u00f6ver. Inga dolda avgifter eller prenumerationer.',
        'Yes! All our plans are one-time payments. You pay once and have access to all features for as long as you need. No hidden fees or subscriptions.'
      ),
    },
    {
      q: t('Kan jag uppgradera senare?', 'Can I upgrade later?'),
      a: t(
        'Absolut. Du betalar bara mellanskillnaden om du vill uppgradera \u2014 t.ex. fr\u00e5n Bas till Familj eller fr\u00e5n Familj till Lifetime.',
        'Absolutely. You only pay the difference if you want to upgrade \u2014 e.g. from Basic to Family or from Family to Lifetime.'
      ),
    },
    {
      q: t('Vilken plan v\u00e4ljer de flesta?', 'Which plan do most people choose?'),
      a: t(
        '91% av v\u00e5ra kunder v\u00e4ljer Familj. Den t\u00e4cker alla vanliga behov, ger upp till 3 anv\u00e4ndare och h\u00e5ller l\u00e4nge f\u00f6r de allra flesta d\u00f6dsbon.',
        '91% of our customers choose Family. It covers all common needs, allows up to 3 users and is enough for the vast majority of estates.'
      ),
    },
    {
      q: t('Vad inneb\u00e4r "alla framtida uppdateringar" i Lifetime?', 'What does \u201call future updates\u201d mean in Lifetime?'),
      a: t(
        'Nya funktioner, mallar och guider som vi utvecklar fram\u00f6ver ing\u00e5r automatiskt \u2014 du beh\u00f6ver aldrig betala f\u00f6r uppdateringar igen.',
        'New features, templates and guides we develop in the future are automatically included \u2014 you never pay for updates again.'
      ),
    },
    {
      q: t('Kan jag f\u00e5 pengarna tillbaka?', 'Can I get a refund?'),
      a: t(
        'Du har 14 dagars \u00e5ngerr\u00e4tt enligt svensk konsumentlag p\u00e5 alla planer. Kontakta oss s\u00e5 l\u00f6ser vi det.',
        'You have a 14-day right of withdrawal under Swedish consumer law on all plans. Contact us and we\u2019ll sort it out.'
      ),
    },
    {
      q: t('Ers\u00e4tter appen en jurist?', 'Does the app replace a lawyer?'),
      a: t(
        'Nej, appen ger dig verktyg och v\u00e4gledning f\u00f6r att hantera d\u00f6dsboet effektivt. Lifetime inkluderar dock en personlig juristkonsultation f\u00f6r komplexa fr\u00e5gor.',
        'No, the app provides tools and guidance to manage the estate efficiently. However, Lifetime does include a personal lawyer consultation for complex questions.'
      ),
    },
  ];

  const handleChoosePlan = (plan: PlanKey) => {
    if (plan === 'free') return;
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <main className="min-h-dvh pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-muted mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>
        <h1 className="text-3xl font-bold text-primary leading-tight">
          {t('V\u00e4lj din plan.', 'Choose your plan.')}
        </h1>
        <h2 className="text-3xl font-bold leading-tight" style={{ color: 'var(--muted)' }}>
          {t('Betala en g\u00e5ng. Anv\u00e4nd f\u00f6r alltid.', 'Pay once. Use forever.')}
        </h2>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          {t(
            'Fyra planer att v\u00e4lja mellan \u2014 fr\u00e5n gratis till v\u00e5r kompletta Lifetime-upplevelse.',
            'Four plans to choose from \u2014 from free to our complete Lifetime experience.'
          )}
        </p>
      </div>

      {/* Trust badges */}
      <div className="px-6 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Shield, text: t('GDPR-s\u00e4krad', 'GDPR-secured') },
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
            style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
          >
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary">
              {t('Boka digital juristkonsultation', 'Book a digital lawyer consultation')}
            </p>
            <p className="text-xs text-muted">
              {t('Gratis f\u00f6rsta timme \u2014 v\u00e4lj tid direkt', 'Free first hour \u2014 pick a time directly')}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted flex-shrink-0" />
        </Link>
      </div>

      {/* Plan cards */}
      <div className="px-6 space-y-4">
        {(Object.keys(plans) as PlanKey[]).map((key) => {
          const plan = plans[key];
          const isPopular = plan.popular;
          const isAnchor = plan.anchor;
          const isFree = key === 'free';

          return (
            <div
              key={key}
              className="relative rounded-3xl overflow-hidden transition-all"
              style={{
                background: 'var(--bg-card)',
                border: isPopular
                  ? '2px solid #7A9E7E'
                  : isAnchor
                  ? '2px solid #D4AF37'
                  : '1px solid var(--border)',
                boxShadow: isPopular ? '0 8px 24px rgba(107, 127, 94, 0.15)' : 'none',
              }}
            >
              {/* Popular / Anchor badge */}
              {isPopular && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-semibold"
                  style={{ background: '#7A9E7E' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('Mest popul\u00e4r \u2014 91% v\u00e4ljer denna', 'Most popular \u2014 91% choose this')}
                </div>
              )}
              {isAnchor && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-semibold"
                  style={{ background: 'linear-gradient(90deg, #8B6914, #D4AF37)' }}
                >
                  <Crown className="w-3.5 h-3.5" />
                  {t('V\u00e5rt mest omfattande paket', 'Our most comprehensive package')}
                </div>
              )}

              <div className="p-6">
                {/* Plan header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isAnchor ? 'rgba(139, 105, 20, 0.12)' : 'rgba(107, 127, 94, 0.12)',
                      }}
                    >
                      <plan.icon
                        className="w-5 h-5"
                        style={{ color: plan.accent }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg leading-tight">{plan.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{plan.users}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isFree ? (
                      <div className="text-3xl font-bold" style={{ color: plan.accent }}>0 kr</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-primary leading-none">
                          {plan.price.toLocaleString('sv-SE')} kr
                        </div>
                        <div className="text-xs text-muted mt-1">{plan.period}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-sm font-medium text-primary mb-1">{plan.tagline}</p>
                <p className="text-sm text-muted mb-4 leading-relaxed">{plan.description}</p>

                {/* Savings tag for popular */}
                {plan.savings && (
                  <div
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium mb-4"
                    style={{ background: 'rgba(107, 127, 94, 0.12)', color: '#6B8E6F' }}
                  >
                    <InfinityIcon className="w-3 h-3" />
                    {plan.savings}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <Check
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accent }}
                        />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--border)' }} />
                      )}
                      <span
                        className={`text-sm leading-snug ${feature.highlight ? 'font-semibold text-primary' : feature.included ? 'text-primary' : 'text-muted'}`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleChoosePlan(key)}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: isFree
                      ? 'transparent'
                      : isAnchor
                      ? 'linear-gradient(135deg, #8B6914, #D4AF37)'
                      : '#7A9E7E',
                    color: isFree ? '#7A9E7E' : '#FFFFFF',
                    border: isFree ? '2px solid #7A9E7E' : 'none',
                  }}
                >
                  {plan.cta}
                  {!isFree && <ArrowRight className="w-4 h-4" />}
                </button>

                {/* Lifetime note */}
                {isAnchor && (
                  <p className="text-xs text-center text-muted mt-3">
                    {t('En g\u00e5ng. Ingen prenumeration. F\u00f6r alltid.', 'Once. No subscription. Forever.')}
                  </p>
                )}
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
              <h4 className="font-semibold text-primary text-sm mb-1">
                {t('J\u00e4mf\u00f6relse', 'Comparison')}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {t(
                  'En traditionell jurist kostar 2 000\u20135 000 kr/timme. Bouppteckning med jurist: 15 000\u201340 000 kr. Med Sista Resan Familj (899 kr) sparar de flesta minst 14 000 kr.',
                  'A traditional lawyer costs SEK 2,000\u20135,000/hour. Estate inventory with lawyer: SEK 15,000\u201340,000. With Sista Resan Family (899 kr) most people save at least 14,000 kr.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold text-primary mb-4">
          {t('Vanliga fr\u00e5gor om priser', 'Pricing FAQ')}
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
          <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: '#7A9E7E' }} />
          <h3 className="font-bold text-primary text-sm mb-1">
            {t('14 dagars \u00e5ngerr\u00e4tt', '14-day money-back guarantee')}
          </h3>
          <p className="text-xs text-muted">
            {t(
              'Inte n\u00f6jd? Du f\u00e5r pengarna tillbaka \u2014 inga fr\u00e5gor.',
              'Not satisfied? Get your money back \u2014 no questions asked.'
            )}
          </p>
        </div>
      </div>

      {/* Payment Flow Modal */}
      {showPayment && selectedPlan && (
        <PaymentFlow
          amount={plans[selectedPlan].price}
          description={`Sista Resan ${plans[selectedPlan].name}`}
          onComplete={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
          onCancel={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
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
