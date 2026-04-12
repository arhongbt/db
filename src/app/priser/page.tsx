'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { BottomNav } from '@/components/ui/BottomNav';
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
} from 'lucide-react';

type PlanKey = 'free' | 'standard' | 'premium';

interface PlanFeature {
  text: string;
  included: boolean;
}

export default function PriserPage() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  const plans: Record<PlanKey, {
    name: string;
    price: number;
    annualPrice: number;
    period: string;
    description: string;
    icon: typeof Zap;
    color: string;
    bgColor: string;
    borderColor: string;
    popular?: boolean;
    users: string;
    features: PlanFeature[];
    cta: string;
  }> = {
    free: {
      name: t('Gratis', 'Free'),
      price: 0,
      annualPrice: 0,
      period: t('för alltid', 'forever'),
      description: t(
        'Kom igång med grundläggande dödsbohantering',
        'Get started with basic estate management'
      ),
      icon: Zap,
      color: '#6B7F5E',
      bgColor: '#F0F4ED',
      borderColor: '#D4DED0',
      users: t('1 användare', '1 user'),
      features: [
        { text: t('Checklista för dödsbo', 'Estate checklist'), included: true },
        { text: t('Ordlista & FAQ', 'Glossary & FAQ'), included: true },
        { text: t('Grundläggande guider', 'Basic guides'), included: true },
        { text: t('Tidsfrister & påminnelser', 'Deadlines & reminders'), included: true },
        { text: t('Kostnadskalkylator', 'Cost calculator'), included: true },
        { text: t('Arvskalkylator (begränsad)', 'Inheritance calculator (limited)'), included: true },
        { text: t('Dokumentskanner', 'Document scanner'), included: false },
        { text: t('Bodelningswizard', 'Property division wizard'), included: false },
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: false },
        { text: t('Exportera dokument', 'Export documents'), included: false },
      ],
      cta: t('Kom igång gratis', 'Get started free'),
    },
    standard: {
      name: 'Standard',
      price: 899,
      annualPrice: 799,
      period: t('engångsbelopp', 'one-time'),
      description: t(
        'Allt du behöver för att hantera ett dödsbo — för hela familjen',
        'Everything you need to manage an estate — for the whole family'
      ),
      icon: Shield,
      color: '#6B7F5E',
      bgColor: '#6B7F5E',
      borderColor: '#5A6E4F',
      popular: true,
      users: t('Upp till 3 användare', 'Up to 3 users'),
      features: [
        { text: t('Allt i Gratis', 'Everything in Free'), included: true },
        { text: t('Arvskalkylator (full)', 'Inheritance calculator (full)'), included: true },
        { text: t('Bodelningswizard', 'Property division wizard'), included: true },
        { text: t('Dokumentskanner med OCR', 'Document scanner with OCR'), included: true },
        { text: t('AI-jurist Mike Ross', 'AI lawyer Mike Ross'), included: true },
        { text: t('Exportera alla dokument', 'Export all documents'), included: true },
        { text: t('Samarbete med familjen', 'Family collaboration'), included: true },
        { text: t('Bouppteckning steg-för-steg', 'Estate inventory step-by-step'), included: true },
        { text: t('Internationella dödsbon', 'International estates'), included: false },
        { text: t('Företag i dödsbo', 'Business in estate'), included: false },
      ],
      cta: t('Välj Standard', 'Choose Standard'),
    },
    premium: {
      name: 'Premium',
      price: 1499,
      annualPrice: 1299,
      period: t('engångsbelopp', 'one-time'),
      description: t(
        'För komplexa dödsbon med företag, utlandstillgångar eller krypto',
        'For complex estates with businesses, foreign assets or crypto'
      ),
      icon: Crown,
      color: '#8B6914',
      bgColor: '#FFF8E7',
      borderColor: '#E8D5A0',
      users: t('Upp till 3 användare', 'Up to 3 users'),
      features: [
        { text: t('Allt i Standard', 'Everything in Standard'), included: true },
        { text: t('Internationella dödsbon', 'International estates'), included: true },
        { text: t('Företag i dödsbo (AB, HB, enskild firma)', 'Business in estate (Ltd, partnerships, sole trader)'), included: true },
        { text: t('Kryptovaluta-guide', 'Cryptocurrency guide'), included: true },
        { text: t('Prioriterad support', 'Priority support'), included: true },
        { text: t('Avancerad bodelning', 'Advanced property division'), included: true },
        { text: t('Skatteoptimering', 'Tax optimization'), included: true },
        { text: t('Digitala tillgångar', 'Digital assets'), included: true },
        { text: t('Fullmaktsgenerator', 'Power of attorney generator'), included: true },
        { text: t('Personlig rådgivning (30 min)', 'Personal consultation (30 min)'), included: true },
      ],
      cta: t('Välj Premium', 'Choose Premium'),
    },
  };

  const faqs = [
    {
      q: t('Är det verkligen engångsbelopp?', 'Is it really a one-time fee?'),
      a: t(
        'Ja! Du betalar en gång och har tillgång till alla funktioner så länge du behöver. Inga dolda avgifter eller prenumerationer.',
        'Yes! You pay once and have access to all features for as long as you need. No hidden fees or subscriptions.'
      ),
    },
    {
      q: t('Kan jag uppgradera senare?', 'Can I upgrade later?'),
      a: t(
        'Absolut. Du betalar bara mellanskillnaden om du vill uppgradera från Standard till Premium.',
        'Absolutely. You only pay the difference if you want to upgrade from Standard to Premium.'
      ),
    },
    {
      q: t('Vad menas med "upp till 3 användare"?', 'What does "up to 3 users" mean?'),
      a: t(
        'Du kan bjuda in upp till 2 familjemedlemmar att samarbeta i samma dödsbo. Alla får tillgång till samma verktyg och dokument.',
        'You can invite up to 2 family members to collaborate on the same estate. Everyone gets access to the same tools and documents.'
      ),
    },
    {
      q: t('Är min data säker?', 'Is my data secure?'),
      a: t(
        'Ja. All data krypteras och lagras säkert i Sverige. Vi följer GDPR och säljer aldrig din information.',
        'Yes. All data is encrypted and stored securely in Sweden. We comply with GDPR and never sell your information.'
      ),
    },
    {
      q: t('Kan jag få pengarna tillbaka?', 'Can I get a refund?'),
      a: t(
        'Du har 14 dagars ångerrätt enligt svensk konsumentlag. Kontakta oss så löser vi det.',
        'You have a 14-day right of withdrawal under Swedish consumer law. Contact us and we\'ll sort it out.'
      ),
    },
    {
      q: t('Ersätter appen en jurist?', 'Does the app replace a lawyer?'),
      a: t(
        'Nej, appen ger dig verktyg och vägledning för att hantera dödsboet effektivt. För komplexa juridiska frågor rekommenderar vi alltid att konsultera en jurist.',
        'No, the app provides tools and guidance to manage the estate efficiently. For complex legal questions, we always recommend consulting a lawyer.'
      ),
    },
  ];

  const handleChoosePlan = (plan: PlanKey) => {
    if (plan === 'free') return;
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <main className="min-h-dvh bg-background pb-28">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-muted mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>
        <h1 className="text-2xl font-bold text-primary">
          {t('Välj din plan', 'Choose your plan')}
        </h1>
        <p className="text-muted mt-1">
          {t(
            'Engångsbelopp — ingen prenumeration. Betala en gång, använd så länge du behöver.',
            'One-time fee — no subscription. Pay once, use as long as you need.'
          )}
        </p>
      </div>

      {/* Trust badges */}
      <div className="px-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Shield, text: t('GDPR-säkrad', 'GDPR-secured') },
            { icon: Users, text: t('2 000+ familjer', '2,000+ families') },
            { icon: Star, text: t('4.8/5 betyg', '4.8/5 rating') },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-muted bg-white rounded-full px-3 py-1.5 border" style={{ borderColor: '#E8E4DE' }}>
              <Icon className="w-3.5 h-3.5 text-accent" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="px-6 space-y-4">
        {(Object.keys(plans) as PlanKey[]).map((key) => {
          const plan = plans[key];
          const isPopular = plan.popular;
          const isPremium = key === 'premium';
          const isFree = key === 'free';

          return (
            <div
              key={key}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: isPopular ? plan.bgColor : '#FFFFFF',
                border: `2px solid ${isPopular ? plan.borderColor : '#E8E4DE'}`,
              }}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="flex items-center justify-center gap-1.5 py-2 text-white text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('Mest populär — 91% väljer denna', 'Most popular — 91% choose this')}
                </div>
              )}

              <div className={`p-5 ${isPopular ? 'bg-white rounded-t-xl' : ''}`}>
                {/* Plan header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: isPremium ? '#FFF8E7' : plan.bgColor,
                        }}
                      >
                        <plan.icon
                          className="w-5 h-5"
                          style={{ color: isPremium ? '#8B6914' : '#6B7F5E' }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary text-lg">{plan.name}</h3>
                        <p className="text-xs text-muted">{plan.users}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isFree ? (
                      <div className="text-2xl font-bold text-accent">0 kr</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-primary">
                          {plan.price.toLocaleString('sv-SE')} kr
                        </div>
                        <div className="text-xs text-muted">{plan.period}</div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted mb-4">{plan.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-5">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-primary' : 'text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleChoosePlan(key)}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    background: isFree ? 'transparent' : isPopular ? '#6B7F5E' : isPremium ? '#8B6914' : '#6B7F5E',
                    color: isFree ? '#6B7F5E' : '#FFFFFF',
                    border: isFree ? '2px solid #6B7F5E' : 'none',
                  }}
                >
                  {plan.cta}
                  {!isFree && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison note */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#E8E4DE' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm mb-1">
                {t('Visste du?', 'Did you know?')}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {t(
                  'En traditionell jurist kostar 2 000–5 000 kr/timme för dödsbohantering. Med Sista Resan sparar du tusentals kronor och gör det mesta själv — med rätt vägledning.',
                  'A traditional lawyer costs SEK 2,000–5,000/hour for estate management. With Sista Resan you save thousands and do most of it yourself — with the right guidance.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold text-primary mb-4">
          {t('Vanliga frågor om priser', 'Pricing FAQ')}
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border overflow-hidden"
              style={{ borderColor: '#E8E4DE' }}
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
        <div className="bg-accent/5 rounded-2xl border border-accent/20 p-5 text-center">
          <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-primary text-sm mb-1">
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

      <BottomNav />
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
