'use client';

import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Lock,
  Server,
  Scale,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export default function OmPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        <h1 className="text-2xl font-display text-primary mb-2">
          {t('Om Sista Resan', 'About Sista Resan')}
        </h1>
        <p className="text-muted mb-8">
          {t('Sveriges digitala hjälp för dödsbohantering — trygg, strukturerad och enkel.', "Sweden's digital estate management help — secure, structured, and simple.")}
        </p>

        {/* Mission */}
        <div className="card mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
          <div className="flex items-start gap-3">
            <Heart className="w-6 h-6 text-accent mt-0.5 shrink-0" />
            <div>
              <h2 className="font-display text-primary mb-2">{t('Varför vi finns', 'Why we exist')}</h2>
              <p className="text-sm text-primary/80">
                {t('Att förlora en närstående är svårt nog. Att dessutom behöva navigera juridik, bankkontakter, försäkringsärenden och Skatteverket gör sorgen ännu tyngre. Sista Resan skapades för att ge dig en tydlig väg genom processen — steg för steg, i din egen takt.', 'Losing a loved one is hard enough. Having to navigate law, banks, insurance matters, and the tax agency makes grief even heavier. Sista Resan was created to give you a clear path through the process — step by step, at your own pace.')}
              </p>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <h2 className="text-lg font-display text-primary mb-4">
          {t('Så skyddar vi dig och dina uppgifter', 'How we protect you and your data')}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="card flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">{t('Krypterad data', 'Encrypted data')}</p>
              <p className="text-xs text-muted mt-1">
                {t('All data överförs via HTTPS och lagras krypterat. Personnummer och känsliga uppgifter får extra skydd.', 'All data is transmitted over HTTPS and stored encrypted. Personal numbers and sensitive information receive extra protection.')}
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Server className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">{t('Lagring inom EU', 'Storage within EU')}</p>
              <p className="text-xs text-muted mt-1">
                {t('Din data lagras på servrar i EU (Irland) via Supabase, som uppfyller SOC 2 Type II-certifiering. Vi använder inga amerikanska molntjänster för datalagring.', 'Your data is stored on servers in the EU (Ireland) via Supabase, which meets SOC 2 Type II certification. We do not use US cloud services for data storage.')}
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">{t('GDPR-anpassad', 'GDPR compliant')}</p>
              <p className="text-xs text-muted mt-1">
                {t('Tjänsten är byggd med GDPR som grund. Du kan begära ut, ändra eller radera alla dina uppgifter. Vi säljer aldrig dina data.', 'The service is built with GDPR as its foundation. You can request, modify, or delete all your information. We never sell your data.')}
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Scale className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">{t('Svensk lag som grund', 'Swedish law as foundation')}</p>
              <p className="text-xs text-muted mt-1">
                {t('All vägledning och automatik baseras på ärvdabalken, skatteförfarandelagen och Skatteverkets rutiner. Vi uppdaterar löpande vid lagändringar.', 'All guidance and automation is based on the Inheritance Code, Tax Administration Act, and Swedish Tax Agency procedures. We update continuously as laws change.')}
              </p>
            </div>
          </div>
        </div>

        {/* What's included */}
        <h2 className="text-lg font-display text-primary mb-4">
          {t('Det här ingår', "What's included")}
        </h2>

        <div className="card mb-8">
          <div className="space-y-3">
            {[
              t('Steg-för-steg-guide genom hela dödsboprocessen', 'Step-by-step guide through the entire estate process'),
              t('Automatisk bouppteckning (SKV 4600-format)', 'Automatic estate inventory (SKV 4600 format)'),
              t('Hantering av tillgångar, skulder och försäkringar', 'Management of assets, debts, and insurance'),
              t('Dokumentuppladdning och säker fillagring', 'Document upload and secure file storage'),
              t('Bjud in medarvingar att följa processen', 'Invite co-heirs to follow the process'),
              t('Checklista med tidsfrister och påminnelser', 'Checklist with deadlines and reminders'),
              t('Fungerar offline — din data finns alltid tillgänglig', 'Works offline — your data is always accessible'),
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-primary/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
          <p className="text-xs text-muted leading-relaxed">
            {t('Sista Resan ger allmän vägledning baserad på svensk lag och ersätter inte juridisk rådgivning. Vid komplexa ärenden — t.ex. testamentstvister, internationella arv eller företagsinnehav — rekommenderar vi att du kontaktar en jurist eller boutredningsman.', 'Sista Resan provides general guidance based on Swedish law and does not replace legal advice. For complex matters — such as will disputes, international inheritance, or business assets — we recommend contacting a lawyer or estate administrator.')}
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">
            {t('Integritetspolicy', 'Privacy Policy')}
          </Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">
            {t('Användarvillkor', 'Terms of Use')}
          </Link>
          <a href="mailto:info@sistaresan.se" className="hover:text-accent transition-colors">
            info@sistaresan.se
          </a>
        </div>
      </div>
    </div>
  );
}
