'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSubscription } from '@/lib/subscription/context';
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
  Clock,
} from 'lucide-react';

type PlanKey = 'trial' | 'standard' | 'pro';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export default function PriserPage() {
  const { t } = useLanguage();
  const { tier, trialDaysLeft, isTrialActive, isTrialExpired, isPaid, upgradeTo } = useSubscription();
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
    users: string;
    features: PlanFeature[];
    cta: string;
  }> = {
    trial: {
      name: t('Provperiod', 'Trial'),
      price: 0,
      period: t('7 dagar', '7 days'),
      tagline: t('Testa allt utan kostnad', 'Try everything for free'),
      description: t(
        'Full tillgång till alla funktioner i 7 dagar. Inget betalkort krävs.',
        'Full access to all features for 7 days. No credit card required.'
      ),
      icon: Clock,
      accent: '#6B7F5E',
      users: t('1 användare', '1 user'),
      features: [
        { text: t('Alla funktioner i 7 dagar', 'All features for 7 days'), included: true, highlight: true },
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: true },
        { text: t('Bouppteckning & bodelning', 'Estate inventory & property division'), included: true },
        { text: t('Dokumentgenerering & export', 'Document generation & export'), included: true },
        { text: t('Dokumentskanner med OCR', 'Document scanner with OCR'), included: true },
        { text: t('Checklistor & tidsfrister', 'Checklists & deadlines'), included: true },
      ],
      cta: isTrialActive
        ? t(`${trialDaysLeft} dagar kvar`, `${trialDaysLeft} days left`)
        : isTrialExpired
          ? t('Provperioden har gått ut', 'Trial has expired')
          : t('Starta gratis provperiod', 'Start free trial'),
    },
    standard: {
      name: 'Standard',
      price: 699,
      period: t('engångsbelopp', 'one-time'),
      tagline: t('Allt du behöver — inklusive AI-jurist', 'Everything you need — including AI lawyer'),
      description: t(
        'Checklistor, tidslinjer, AI-jurist Mike Ross och grundläggande guider — för hela familjen.',
        'Checklists, timelines, AI lawyer Mike Ross and basic guides — for the whole family.'
      ),
      icon: Shield,
      accent: '#6B7F5E',
      users: t('Upp till 3 användare', 'Up to 3 users'),
      features: [
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: true, highlight: true },
        { text: t('Checklista för dödsbo', 'Estate checklist'), included: true },
        { text: t('Tidslinje & uppgiftshantering', 'Timeline & task management'), included: true },
        { text: t('Ordlista & FAQ', 'Glossary & FAQ'), included: true },
        { text: t('Grundläggande guider', 'Basic guides'), included: true },
        { text: t('Tidsfrister & påminnelser', 'Deadlines & reminders'), included: true },
        { text: t('Kostnadskalkylator', 'Cost calculator'), included: true },
        { text: t('Samarbete med familjen (3 pers)', 'Family collaboration (3 people)'), included: true },
        { text: t('Bodelningswizard', 'Property division wizard'), included: false },
        { text: t('Dokumentgenerering', 'Document generation'), included: false },
      ],
      cta: tier === 'standard' ? t('Din nuvarande plan', 'Your current plan') : t('Välj Standard — 699 kr', 'Choose Standard — 699 kr'),
    },
    pro: {
      name: 'Pro',
      price: 1199,
      period: t('engångsbelopp', 'one-time'),
      tagline: t('Allt + 1 timme kostnadsfri jurist', 'Everything + 1 hour free lawyer consultation'),
      description: t(
        'Alla funktioner, obegränsat antal användare och 1 timme kostnadsfri konsultation med en riktig jurist.',
        'All features, unlimited users and 1 hour free consultation with a real lawyer.'
      ),
      icon: Crown,
      accent: '#6B7F5E',
      popular: true,
      users: t('Obegränsat antal användare', 'Unlimited users'),
      features: [
        { text: t('Allt i Standard', 'Everything in Standard'), included: true, highlight: true },
        { text: t('1 timme kostnadsfri juristkonsultation', '1 hour free lawyer consultation'), included: true, highlight: true },
        { text: t('Bodelningswizard', 'Property division wizard'), included: true },
        { text: t('Generera bouppteckning (PDF)', 'Generate estate inventory (PDF)'), included: true },
        { text: t('Arvskifteshandling', 'Inheritance settlement document'), included: true },
        { text: t('Dokumentskanner med OCR', 'Document scanner with OCR'), included: true },
        { text: t('Exportera alla dokument', 'Export all documents'), included: true },
        { text: t('Obegränsat antal användare', 'Unlimited users'), included: true },
        { text: t('Avancerade guider (internationellt, krypto)', 'Advanced guides (international, crypto)'), included: true },
        { text: t('Prioriterad support', 'Priority support'), included: true },
      ],
      cta: tier === 'pro' ? t('Din nuvarande plan', 'Your current plan') : t('Välj Pro — 1 199 kr', 'Choose Pro — 1 199 kr'),
    },
  };

  const faqs = [
    {
      q: t('Hur fungerar provperioden?', 'How does the trial work?'),
      a: t(
        'Du får 7 dagars full tillgång till alla funktioner direkt — inget betalkort krävs. När provperioden tar slut väljer du Standard eller Pro.',
        'You get 7 days of full access to all features immediately — no credit card required. When the trial ends, you choose Standard or Pro.'
      ),
    },
    {
      q: t('Vad är skillnaden mellan Standard och Pro?', 'What\'s the difference between Standard and Pro?'),
      a: t(
        'Standard inkluderar AI-juristen Mike Ross, checklistor, tidslinjer och guider. Pro lägger till 1 timme kostnadsfri juristkonsultation, dokumentgenerering (bouppteckning, arvskifte), bodelningswizard, skanner, obegränsat antal användare och avancerade guider.',
        'Standard includes AI lawyer Mike Ross, checklists, timelines and guides. Pro adds 1 hour free lawyer consultation, document generation (estate inventory, inheritance settlement), property division wizard, scanner, unlimited users and advanced guides.'
      ),
    },
    {
      q: t('Kan jag uppgradera från Standard till Pro?', 'Can I upgrade from Standard to Pro?'),
      a: t(
        'Ja, du kan uppgradera när som helst. Du betalar bara mellanskillnaden mellan Standard och Pro.',
        'Yes, you can upgrade at any time. You just pay the difference between Standard and Pro.'
      ),
    },
    {
      q: t('Är det en engångsbetalning?', 'Is it a one-time payment?'),
      a: t(
        'Ja! Både Standard och Pro är engångsbelopp per dödsbo — du betalar en gång och har full tillgång tills dödsboet är avslutat. Ingen prenumeration, inga dolda avgifter.',
        'Yes! Both Standard and Pro are one-time payments per estate — you pay once and have full access until the estate is settled. No subscription, no hidden fees.'
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
    if (plan === 'trial') return;
    if ((plan === 'standard' && tier === 'standard') || (plan === 'pro' && tier === 'pro')) return;
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    if (selectedPlan === 'standard' || selectedPlan === 'pro') {
      upgradeTo(selectedPlan);
    }
    setShowPayment(false);
    setSelectedPlan(null);
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
          {t('Välj din plan.', 'Choose your plan.')}
        </h1>
        <h2 className="text-3xl font-display leading-tight" style={{ color: 'var(--muted)' }}>
          {t('Börja med 7 dagars gratis.', 'Start with 7 days free.')}
        </h2>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          {t(
            'Testa alla funktioner gratis i 7 dagar. Välj sedan den plan som passar dig bäst.',
            'Try all features free for 7 days. Then choose the plan that suits you best.'
          )}
        </p>
      </div>

      {/* Trial status banner */}
      {(isTrialActive || isTrialExpired) && !isPaid && (
        <div className="px-6 mb-4">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: isTrialExpired
                ? 'rgba(217,119,87,0.08)'
                : 'rgba(107,127,94,0.08)',
              border: `1px solid ${isTrialExpired ? 'rgba(217,119,87,0.2)' : 'rgba(107,127,94,0.15)'}`,
            }}
          >
            <Clock className="w-5 h-5 flex-shrink-0" style={{ color: isTrialExpired ? '#D97757' : '#6B7F5E' }} />
            <p className="text-sm text-primary">
              {isTrialExpired
                ? t('Din provperiod har gått ut. Välj en plan för att fortsätta.', 'Your trial has expired. Choose a plan to continue.')
                : t(`${trialDaysLeft} dagar kvar av din provperiod.`, `${trialDaysLeft} days left of your trial.`)}
            </p>
          </div>
        </div>
      )}

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
        {(['trial', 'standard', 'pro'] as PlanKey[]).map((key) => {
          const plan = plans[key];
          const isPopular = plan.popular;
          const isTrial = key === 'trial';
          const isCurrentPlan = (key === 'standard' && tier === 'standard') || (key === 'pro' && tier === 'pro');

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
                opacity: (isTrial && isTrialExpired) ? 0.6 : 1,
              }}
            >
              {/* Popular badge */}
              {isPopular && !isCurrentPlan && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2.5 text-white text-xs font-display"
                  style={{ background: '#6B7F5E' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('Mest populär', 'Most popular')}
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
                      <p className="text-xs text-muted mt-0.5">{plan.users}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isTrial ? (
                      <div className="text-3xl font-display" style={{ color: plan.accent }}>
                        {t('Gratis', 'Free')}
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl font-display text-primary leading-none">
                          {plan.price}
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
                      {feature.included ? (
                        <Check
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accent }}
                        />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--border)' }} />
                      )}
                      <span
                        className={`text-sm leading-snug ${feature.highlight ? 'font-display text-primary' : feature.included ? 'text-primary' : 'text-muted'}`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleChoosePlan(key)}
                  disabled={isTrial || isCurrentPlan}
                  className="w-full py-3.5 rounded-2xl font-display text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-default"
                  style={{
                    background: isTrial || isCurrentPlan
                      ? 'transparent'
                      : isPopular
                        ? 'linear-gradient(135deg, #6B7F5E, #5A6E4E)'
                        : '#6B7F5E',
                    color: isTrial || isCurrentPlan ? '#6B7F5E' : '#FFFFFF',
                    border: isTrial || isCurrentPlan ? '2px solid var(--border)' : 'none',
                  }}
                >
                  {plan.cta}
                  {!isTrial && !isCurrentPlan && <ArrowRight className="w-4 h-4" />}
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
                  'En traditionell jurist kostar 2 000–5 000 kr/timme. Bouppteckning med jurist: 15 000–40 000 kr. Med Sista Resan Pro (1 199 kr engångsbelopp) sparar du tusenlappar.',
                  'A traditional lawyer costs SEK 2,000–5,000/hour. Estate inventory with lawyer: SEK 15,000–40,000. With Sista Resan Pro (SEK 1,199 one-time) you save thousands.'
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
      {showPayment && selectedPlan && selectedPlan !== 'trial' && (
        <PaymentFlow
          amount={plans[selectedPlan].price}
          description={`Sista Resan ${plans[selectedPlan].name}`}
          onComplete={handlePaymentComplete}
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
