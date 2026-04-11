'use client';

import Link from 'next/link';
import { ArrowLeft, Home, FileText, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function DodsboFastighetPage() {
  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Tillbaka
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Home className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-primary">Dödsbo och fastighet</h1>
      </div>
      <p className="text-muted mb-8">Så hanterar du bostad, hus och fastigheter i dödsboet.</p>

      {/* Intro */}
      <div className="card border-l-4 border-accent mb-6">
        <p className="text-sm text-primary/80 leading-relaxed">
          En fastighet är ofta dödsboets största tillgång. Att hantera den rätt
          är avgörande för att undvika onödiga kostnader och konflikter mellan delägare.
          Här går vi igenom de viktigaste stegen.
        </p>
      </div>

      {/* Steg */}
      <h2 className="text-lg font-semibold text-primary mb-4">Steg för steg</h2>
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

      {/* Vanliga frågor */}
      <h2 className="text-lg font-semibold text-primary mb-4">Vanliga frågor</h2>
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

      <Link href="/juridisk-hjalp" className="card border-l-4 border-accent bg-info-light flex items-center justify-between">
        <div>
          <p className="font-semibold text-accent text-sm">Har du fler frågor?</p>
          <p className="text-xs text-muted">Fråga vår juridiska AI-assistent</p>
        </div>
        <ChevronRight className="w-5 h-5 text-accent" />
      </Link>

      <p className="text-xs text-center text-muted mt-8">
        Denna information ger allmän vägledning och ersätter inte juridisk rådgivning.
      </p>

      <BottomNav />
    </div>
  );
}
