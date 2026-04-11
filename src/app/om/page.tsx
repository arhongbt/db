'use client';

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
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Link>

        <h1 className="text-2xl font-semibold text-primary mb-2">
          Om Sista Resan
        </h1>
        <p className="text-muted mb-8">
          Sveriges digitala hjälp för dödsbohantering — trygg, strukturerad och enkel.
        </p>

        {/* Mission */}
        <div className="card mb-6 border-l-4 border-accent">
          <div className="flex items-start gap-3">
            <Heart className="w-6 h-6 text-accent mt-0.5 shrink-0" />
            <div>
              <h2 className="font-semibold text-primary mb-2">Varför vi finns</h2>
              <p className="text-sm text-primary/80">
                Att förlora en närstående är svårt nog. Att dessutom behöva navigera juridik,
                bankkontakter, försäkringsärenden och Skatteverket gör sorgen ännu tyngre.
                Sista Resan skapades för att ge dig en tydlig väg genom processen — steg för steg,
                i din egen takt.
              </p>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <h2 className="text-lg font-semibold text-primary mb-4">
          Så skyddar vi dig och dina uppgifter
        </h2>

        <div className="space-y-4 mb-8">
          <div className="card flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">Krypterad data</p>
              <p className="text-xs text-muted mt-1">
                All data överförs via HTTPS och lagras krypterat. Personnummer och
                känsliga uppgifter får extra skydd.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Server className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">Lagring inom EU</p>
              <p className="text-xs text-muted mt-1">
                Din data lagras på servrar i EU (Irland) via Supabase, som uppfyller
                SOC 2 Type II-certifiering. Vi använder inga amerikanska molntjänster
                för datalagring.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">GDPR-anpassad</p>
              <p className="text-xs text-muted mt-1">
                Tjänsten är byggd med GDPR som grund. Du kan begära ut, ändra eller
                radera alla dina uppgifter. Vi säljer aldrig dina data.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <Scale className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">Svensk lag som grund</p>
              <p className="text-xs text-muted mt-1">
                All vägledning och automatik baseras på ärvdabalken, skatteförfarandelagen
                och Skatteverkets rutiner. Vi uppdaterar löpande vid lagändringar.
              </p>
            </div>
          </div>
        </div>

        {/* What's included */}
        <h2 className="text-lg font-semibold text-primary mb-4">
          Det här ingår
        </h2>

        <div className="card mb-8">
          <div className="space-y-3">
            {[
              'Steg-för-steg-guide genom hela dödsboprocessen',
              'Automatisk bouppteckning (SKV 4600-format)',
              'Hantering av tillgångar, skulder och försäkringar',
              'Dokumentuppladdning och säker fillagring',
              'Bjud in medarvingar att följa processen',
              'Checklista med tidsfrister och påminnelser',
              'Fungerar offline — din data finns alltid tillgänglig',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-primary/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-primary-lighter/30 rounded-card p-4 mb-6">
          <p className="text-xs text-muted leading-relaxed">
            Sista Resan ger allmän vägledning baserad på svensk lag och ersätter inte
            juridisk rådgivning. Vid komplexa ärenden — t.ex. testamentstvister,
            internationella arv eller företagsinnehav — rekommenderar vi att du kontaktar
            en jurist eller boutredningsman.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">
            Integritetspolicy
          </Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">
            Användarvillkor
          </Link>
          <a href="mailto:info@sistaresan.se" className="hover:text-accent transition-colors">
            info@sistaresan.se
          </a>
        </div>
      </div>
    </div>
  );
}
