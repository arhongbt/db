'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function AnvandarvillkorPage() {
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

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">
            Användarvillkor
          </h1>
        </div>

        <p className="text-sm text-muted mb-6">
          Senast uppdaterade: {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose-custom space-y-6">
          <section>
            <h2>1. Om tjänsten</h2>
            <p>
              Dödsboappen är en digital tjänst som hjälper privatpersoner att organisera och
              administrera dödsbon i Sverige. Tjänsten ger vägledning kring uppgifter,
              tidsfrister och dokumentation — men utgör <strong>inte</strong> juridisk, ekonomisk
              eller skatterättslig rådgivning.
            </p>
          </section>

          <section>
            <h2>2. Godkännande av villkor</h2>
            <p>
              Genom att skapa ett konto och använda tjänsten godkänner du dessa användarvillkor.
              Om du inte accepterar villkoren ska du inte använda tjänsten. Vi kan komma att
              uppdatera villkoren och meddelar dig i så fall via e-post eller i appen.
            </p>
          </section>

          <section>
            <h2>3. Konto och ansvar</h2>
            <p>
              Du ansvarar för att hålla dina inloggningsuppgifter säkra. All aktivitet
              som sker via ditt konto är ditt ansvar. Om du misstänker obehörig åtkomst,
              kontakta oss omedelbart på info@dodsboappen.se.
            </p>
          </section>

          <section>
            <h2>4. Korrekt information</h2>
            <p>
              Du ansvarar för att den information du registrerar i tjänsten är korrekt
              och fullständig. Dödsboappen verifierar inte uppgifter som du anger och ansvarar
              inte för konsekvenser av felaktiga uppgifter.
            </p>
          </section>

          <section>
            <h2>5. Tjänstens begränsningar</h2>
            <p>
              Dödsboappen är ett <strong>hjälpverktyg</strong> och ersätter inte professionell
              juridisk rådgivning. Informationen i appen baseras på allmänna regler i svensk
              arvsrätt och kan inte ta hänsyn till alla individuella omständigheter. Vi
              rekommenderar att du kontaktar en jurist vid komplexa ärenden.
            </p>
            <p>
              Vi garanterar inte att tjänsten är felfri eller tillgänglig utan avbrott.
              Vi strävar efter hög tillgänglighet men kan inte ansvara för tillfälliga
              driftstörningar.
            </p>
          </section>

          <section>
            <h2>6. Immateriella rättigheter</h2>
            <p>
              All kod, design, texter och grafik i Dödsboappen tillhör oss. Du får
              inte kopiera, modifiera eller distribuera material från tjänsten utan vårt
              skriftliga medgivande. Innehåll som du själv skapar i tjänsten (t.ex. uppgifter
              om dödsboet) tillhör dig.
            </p>
          </section>

          <section>
            <h2>7. Uppsägning</h2>
            <p>
              Du kan när som helst avsluta ditt konto via inställningar i appen. Vi kan
              stänga av konton som bryter mot dessa villkor. Vid uppsägning raderas dina
              uppgifter i enlighet med vår integritetspolicy.
            </p>
          </section>

          <section>
            <h2>8. Ansvarsbegränsning</h2>
            <p>
              Dödsboappen ansvarar inte för direkta eller indirekta skador som uppstår
              genom användning av tjänsten, inklusive men inte begränsat till ekonomiska
              förluster, missade tidsfrister eller felaktiga beräkningar. Vårt ansvar är
              under alla omständigheter begränsat till det belopp du har betalat för tjänsten
              under de senaste 12 månaderna.
            </p>
          </section>

          <section>
            <h2>9. Tvistlösning</h2>
            <p>
              Dessa villkor regleras av svensk lag. Tvister som inte kan lösas i
              samförstånd ska avgöras av Allmänna reklamationsnämnden (ARN) eller
              svensk allmän domstol.
            </p>
          </section>

          <section>
            <h2>10. Kontakt</h2>
            <p>
              Dödsboappen
              <br />
              E-post: info@dodsboappen.se
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
