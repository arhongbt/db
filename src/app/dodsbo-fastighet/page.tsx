'use client';

import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Home, FileText, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DodsboFastighetPage() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 rounded-full">
        <ArrowLeft className="w-4 h-4" />
        Tillbaka
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Home className="w-6 h-6 text-accent" />
        <h1 className="text-xl font-display text-primary">Dödsbo och fastighet</h1>
      </div>
      <p className="text-muted mb-8">Så hanterar du bostad, hus och fastigheter i dödsboet.</p>

      {/* Intro */}
      <div className="card mb-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
        <p className="text-sm text-primary/80 leading-relaxed">
          En fastighet är ofta dödsboets största tillgång. Att hantera den rätt
          är avgörande för att undvika onödiga kostnader och konflikter mellan delägare.
          Här går vi igenom de viktigaste stegen.
        </p>
      </div>

      {/* Steg */}
      <h2 className="text-lg font-display text-primary mb-4">Steg för steg</h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            step: '1',
            title: 'Värdera fastigheten',
            desc: 'Beställ en marknadsvärdering från mäklare. Taxeringsvärdet räcker för bouppteckningen, men marknadsvärdet behövs vid arvskiftet.',
          },
          {
            step: '2',
            title: 'Ta med i bouppteckningen',
            desc: 'Fastigheten ska tas upp till marknadsvärde i bouppteckningen. Taxeringsvärdet kan användas som alternativ om alla delägare är överens.',
          },
          {
            step: '3',
            title: 'Betala löpande kostnader',
            desc: 'Dödsboet ansvarar för räntor, försäkringar, el och uppvärmning tills fastigheten säljs eller överlåts.',
          },
          {
            step: '4',
            title: 'Besluta: sälja eller behålla?',
            desc: 'Alla dödsbodelägare måste vara överens. Om en delägare vill köpa ut de andra krävs en värdering alla accepterar.',
          },
          {
            step: '5',
            title: 'Lagfart och överlåtelse',
            desc: 'Vid försäljning behöver köparen söka lagfart hos Lantmäteriet. Vid överlåtelse till delägare krävs arvskifteshandling.',
          },
        ].map((item) => (
          <div key={item.step} className="card flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              {item.step}
            </div>
            <div>
              <p className="font-semibold text-primary text-sm">{item.title}</p>
              <p className="text-sm text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bostadsrätt */}
      <h2 className="text-lg font-display text-primary mb-4">Sälja bostadsrätt i dödsboet</h2>
      <p className="text-sm text-muted mb-4 leading-relaxed">
        Bostadsrätt följer delvis samma regler som fastigheter, men kräver godkännande från föreningen.
      </p>
      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            step: '1',
            title: 'Få registrerad bouppteckning från Skatteverket',
            desc: 'Bouppteckningen måste registreras innan försäljning kan påbörjas.',
          },
          {
            step: '2',
            title: 'Kontakta mäklare för värdering',
            desc: 'En mäklare gör en marknadsvärdering av bostadsrätten för både arvskiftet och försäljningen.',
          },
          {
            step: '3',
            title: 'Kontakta bostadsrättsföreningen – köparen måste godkännas',
            desc: 'Föreningen måste godkänna den nya ägaren innan överlåtelsen kan genomföras. Kontakta styrelsen tidigt.',
          },
          {
            step: '4',
            title: 'Alla dödsbodelägare måste skriva under köpeavtal',
            desc: 'Alla arvingar som äger andel i bostadsrätten måste underteckna köpeavtalet.',
          },
          {
            step: '5',
            title: 'Räkna med reavinstskatt om bostaden säljs med vinst',
            desc: 'Dödsboet betalar reavinstskatt (22%) på vinsten. Anskaffningsvärdet ärvs från den avlidne.',
          },
        ].map((item) => (
          <div key={item.step} className="card flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              {item.step}
            </div>
            <div>
              <p className="font-semibold text-primary text-sm">{item.title}</p>
              <p className="text-sm text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="info-box mb-8">
        <div className="flex items-start gap-2">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-accent text-sm">Föreningsgodkännande</p>
            <p className="text-sm text-primary/70 mt-1">
              Bostadsrättsföreningen måste godkänna köparen innan överlåtelsen kan genomföras. Kontakta styrelsen tidigt i processen för att undvika förseningar.
            </p>
          </div>
        </div>
      </div>

      {/* Husdjur */}
      <h2 className="text-lg font-display text-primary mb-4">Husdjur i dödsboet</h2>
      <p className="text-sm text-muted mb-4 leading-relaxed">
        Husdjur räknas juridiskt som lösöre (egendom). Så här hanterar du det:
      </p>
      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            title: 'Kontrollera testamente',
            desc: 'Undersök om den avlidne hade ett testamente med önskemål om djurens framtid. Familjemedlemmar kan vara förnamnade som målsmän.',
          },
          {
            title: 'Kontrollera djurförsäkring',
            desc: 'Se om den avlidne hade försäkring för djuren. Den kan behöva uppdateras till den nya ägarens namn eller sägas upp.',
          },
          {
            title: 'Ansvar för djurens väl',
            desc: 'Dödsboet är ansvarigt för att djuren tas väl om medan överlåtelsen planeras. Matning, vård och veterinärkostnader kan betalas från dödsboet.',
          },
          {
            title: 'Om ingen kan ta hand om djuren',
            desc: 'Kontakta lokal djurskyddsförening. De kan hjälpa till att hitta ett nytt hem eller tillfällig vård.',
          },
        ].map((item, i) => (
          <div key={i} className="card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary text-sm">{item.title}</p>
              <p className="text-sm text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vanliga frågor */}
      <h2 className="text-lg font-display text-primary mb-4">Vanliga frågor</h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            q: 'Måste vi sälja fastigheten?',
            a: 'Nej. Dödsbodelägarna kan komma överens om att en av dem tar över fastigheten, men den personen måste kompensera övriga delägare ekonomiskt. Om ni inte kan enas kan tingsrätten utse en skiftesman.',
          },
          {
            q: 'Vad händer med kapitalvinstskatten?',
            a: 'Om dödsboet säljer fastigheten betalar dödsboet reavinstskatt (22% av vinsten för privatbostäder). Anskaffningsvärdet ärvs från den avlidne — inte från dödsdagen.',
          },
          {
            q: 'Kan vi bo kvar under tiden?',
            a: 'Ja, en efterlevande make/maka har rätt att bo kvar. Andra delägare kan bo kvar med samtliga delägares godkännande, men dödsboet bör inte belastas med onödiga kostnader.',
          },
          {
            q: 'Behöver vi mäklare?',
            a: 'Det krävs inte juridiskt, men rekommenderas starkt. En mäklare hjälper med värdering, visning och juridiken kring överlåtelsen.',
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

      {/* Viktigt att tänka på */}
      <div className="warning-box mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warn text-sm">Viktigt</p>
            <p className="text-sm text-primary/70 mt-1">
              Sälj inte fastigheten innan bouppteckningen är registrerad hos Skatteverket.
              Köparen kan annars inte få lagfart.
            </p>
          </div>
        </div>
      </div>

      <Link href="/juridisk-hjalp" className="card bg-info-light flex items-center justify-between rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))', border: '1px solid rgba(139,164,184,0.15)' }}>
        <div>
          <p className="font-semibold text-accent text-sm">Har du fler frågor?</p>
          <p className="text-xs text-muted">Fråga vår juridiska AI-assistent</p>
        </div>
        <ChevronRight className="w-5 h-5 text-accent" />
      </Link>

      <p className="text-xs text-center text-muted mt-8">
        Denna information ger allmän vägledning och ersätter inte juridisk rådgivning.
      </p>

    </div>
  );
}
