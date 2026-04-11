'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function IntegritetspolicyPage() {
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
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">
            Integritetspolicy
          </h1>
        </div>

        <p className="text-sm text-muted mb-6">
          Senast uppdaterad: {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose-custom space-y-6">
          <section>
            <h2>1. Vilka vi är</h2>
            <p>
              Dödsboappen (&ldquo;vi&rdquo;, &ldquo;oss&rdquo;, &ldquo;vår&rdquo;) är en digital tjänst som hjälper privatpersoner
              att administrera dödsbon i Sverige. Vi är personuppgiftsansvariga för de
              personuppgifter som behandlas i tjänsten.
            </p>
          </section>

          <section>
            <h2>2. Vilka uppgifter vi samlar in</h2>
            <p>Vi behandlar följande kategorier av personuppgifter:</p>
            <p>
              <strong>Kontoinformation:</strong> E-postadress och lösenord (krypterat) som du
              anger vid registrering.
            </p>
            <p>
              <strong>Dödsbouppgifter:</strong> Information om den avlidne (namn, personnummer,
              adress, dödsdatum), dödsbodelägare (namn, kontaktuppgifter, relation), tillgångar,
              skulder och försäkringar som du själv registrerar i tjänsten.
            </p>
            <p>
              <strong>Uppladdade dokument:</strong> Filer du laddar upp, t.ex. saldobesked,
              dödsbevis och testamenten.
            </p>
            <p>
              <strong>Tekniska uppgifter:</strong> IP-adress, webbläsartyp och enhetsinformation
              i samband med inloggning, för säkerhets- och felsökningsändamål.
            </p>
          </section>

          <section>
            <h2>3. Rättslig grund</h2>
            <p>
              Vi behandlar dina personuppgifter med stöd av <strong>avtal</strong> (artikel 6.1 b GDPR)
              — behandlingen är nödvändig för att tillhandahålla tjänsten du har registrerat dig för.
              Tekniska uppgifter behandlas med stöd av <strong>berättigat intresse</strong> (artikel 6.1 f GDPR)
              för att skydda tjänsten mot missbruk.
            </p>
          </section>

          <section>
            <h2>4. Hur vi skyddar dina uppgifter</h2>
            <p>
              All data lagras krypterat i EU (Irland) via Supabase, som uppfyller SOC 2 Type II.
              Kommunikation sker alltid via HTTPS. Personnummer och känsliga uppgifter krypteras
              vid lagring. Vi använder Row Level Security (RLS) så att varje användare bara
              kan se sina egna uppgifter.
            </p>
          </section>

          <section>
            <h2>5. Vilka vi delar uppgifter med</h2>
            <p>
              Vi delar <strong>inte</strong> dina personuppgifter med tredje part i marknadsföringssyfte.
              Vi använder följande underleverantörer som kan ha tillgång till uppgifter i samband
              med drift av tjänsten:
            </p>
            <p>
              <strong>Supabase Inc.</strong> — Databashantering och fillagring (EU-region).
              <br />
              <strong>Vercel Inc.</strong> — Webbhosting och CDN.
            </p>
            <p>
              Båda leverantörer har avtal om databehandling (DPA) och uppfyller GDPR-kraven
              för överföring till tredje land genom EU:s standardavtalsklausuler.
            </p>
          </section>

          <section>
            <h2>6. Hur länge vi sparar uppgifter</h2>
            <p>
              Dina uppgifter sparas så länge du har ett aktivt konto. Om du raderar ditt konto
              tar vi bort alla personuppgifter inom 30 dagar. Uppladdade dokument raderas
              omedelbart vid borttagning.
            </p>
          </section>

          <section>
            <h2>7. Dina rättigheter</h2>
            <p>Enligt GDPR har du rätt att:</p>
            <p>
              <strong>Få tillgång</strong> till dina personuppgifter (registerutdrag).
              <br />
              <strong>Rätta</strong> felaktiga uppgifter.
              <br />
              <strong>Radera</strong> dina uppgifter (&ldquo;rätten att bli glömd&rdquo;).
              <br />
              <strong>Flytta</strong> dina uppgifter till en annan tjänst (dataportabilitet).
              <br />
              <strong>Invända</strong> mot behandling som grundar sig på berättigat intresse.
            </p>
            <p>
              Kontakta oss på <strong>info@dodsboappen.se</strong> för att utöva dina rättigheter.
              Vi besvarar din begäran inom 30 dagar.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              Vi använder enbart tekniskt nödvändiga cookies för att hantera din inloggningssession.
              Vi använder inga spårningscookies eller tredjepartscookies för marknadsföring.
            </p>
          </section>

          <section>
            <h2>9. Tillsynsmyndighet</h2>
            <p>
              Om du anser att vi behandlar dina personuppgifter i strid med GDPR kan du lämna
              in ett klagomål till <strong>Integritetsskyddsmyndigheten (IMY)</strong>,{' '}
              imy.se.
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
