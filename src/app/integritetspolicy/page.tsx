'use client';

import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function IntegritetspolicyPage() {
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

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-xl font-display text-primary">
            {t('Integritetspolicy', 'Privacy Policy')}
          </h1>
        </div>

        <p className="text-sm text-muted mb-6">
          {t('Senast uppdaterad:', 'Last updated:')} {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose-custom space-y-6">
          <section>
            <h2 className="font-display">{t('1. Vilka vi är', '1. Who we are')}</h2>
            <p>
              {t('Sista Resan ("vi", "oss", "vår") är en digital tjänst som hjälper privatpersoner att administrera dödsbon i Sverige. Vi är personuppgiftsansvariga för de personuppgifter som behandlas i tjänsten.', 'Sista Resan ("we", "us", "our") is a digital service that helps individuals manage estates in Sweden. We are the data controller for personal information processed in the service.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('2. Vilka uppgifter vi samlar in', '2. What information we collect')}</h2>
            <p>{t('Vi behandlar följande kategorier av personuppgifter:', 'We process the following categories of personal information:')}</p>
            <p>
              <strong>{t('Kontoinformation:', 'Account information:')}</strong> {t('E-postadress och lösenord (krypterat) som du anger vid registrering.', 'Email address and password (encrypted) that you enter during registration.')}
            </p>
            <p>
              <strong>{t('Dödsbouppgifter:', 'Estate information:')}</strong> {t('Information om den avlidne (namn, personnummer, adress, dödsdatum), dödsbodelägare (namn, kontaktuppgifter, relation), tillgångar, skulder och försäkringar som du själv registrerar i tjänsten.', 'Information about the deceased (name, ID number, address, date of death), co-owners (name, contact details, relationship), assets, debts, and insurance that you register in the service.')}
            </p>
            <p>
              <strong>{t('Uppladdade dokument:', 'Uploaded documents:')}</strong> {t('Filer du laddar upp, t.ex. saldobesked, dödsbevis och testamenten.', 'Files you upload, such as account statements, death certificates, and wills.')}
            </p>
            <p>
              <strong>{t('Tekniska uppgifter:', 'Technical information:')}</strong> {t('IP-adress, webbläsartyp och enhetsinformation i samband med inloggning, för säkerhets- och felsökningsändamål.', 'IP address, browser type, and device information when logging in, for security and troubleshooting purposes.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('3. Rättslig grund', '3. Legal basis')}</h2>
            <p>
              {t('Vi behandlar dina personuppgifter med stöd av avtal (artikel 6.1 b GDPR) — behandlingen är nödvändig för att tillhandahålla tjänsten du har registrerat dig för. Tekniska uppgifter behandlas med stöd av berättigat intresse (artikel 6.1 f GDPR) för att skydda tjänsten mot missbruk.', 'We process your personal information based on contract (Article 6.1(b) GDPR) — processing is necessary to provide the service you registered for. Technical information is processed based on legitimate interest (Article 6.1(f) GDPR) to protect the service from misuse.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('4. Hur vi skyddar dina uppgifter', '4. How we protect your information')}</h2>
            <p>
              {t('All data lagras krypterat i EU (Irland) via Supabase, som uppfyller SOC 2 Type II. Kommunikation sker alltid via HTTPS. Personnummer och känsliga uppgifter krypteras vid lagring. Vi använder Row Level Security (RLS) så att varje användare bara kan se sina egna uppgifter.', 'All data is stored encrypted in the EU (Ireland) via Supabase, which meets SOC 2 Type II compliance. Communication always occurs over HTTPS. ID numbers and sensitive information are encrypted in storage. We use Row Level Security (RLS) so each user can only see their own information.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('5. Vilka vi delar uppgifter med', '5. Who we share information with')}</h2>
            <p>
              {t('Vi delar inte dina personuppgifter med tredje part i marknadsföringssyfte. Vi använder följande underleverantörer som kan ha tillgång till uppgifter i samband med drift av tjänsten:', 'We do not share your personal information with third parties for marketing purposes. We use the following subprocessors who may have access to information as part of service operations:')}
            </p>
            <p>
              <strong>Supabase Inc.</strong> — {t('Databashantering och fillagring (EU-region).', 'Database management and file storage (EU region).')}
              <br />
              <strong>Vercel Inc.</strong> — {t('Webbhosting och CDN.', 'Web hosting and CDN.')}
            </p>
            <p>
              {t('Båda leverantörer har avtal om databehandling (DPA) och uppfyller GDPR-kraven för överföring till tredje land genom EU:s standardavtalsklausuler.', 'Both providers have data processing agreements (DPA) and comply with GDPR requirements for transfers to third countries through EU Standard Contractual Clauses.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('6. Hur länge vi sparar uppgifter', '6. How long we retain information')}</h2>
            <p>
              {t('Dina uppgifter sparas så länge du har ett aktivt konto. Om du raderar ditt konto tar vi bort alla personuppgifter inom 30 dagar. Uppladdade dokument raderas omedelbart vid borttagning.', 'Your information is retained as long as you have an active account. If you delete your account, we remove all personal information within 30 days. Uploaded documents are deleted immediately upon deletion.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('7. Dina rättigheter', '7. Your rights')}</h2>
            <p>{t('Enligt GDPR har du rätt att:', 'Under GDPR, you have the right to:')}</p>
            <p>
              <strong>{t('Få tillgång', 'Access')}</strong> {t('till dina personuppgifter (registerutdrag).', 'your personal information (register extract).')}
              <br />
              <strong>{t('Rätta', 'Correct')}</strong> {t('felaktiga uppgifter.', 'inaccurate information.')}
              <br />
              <strong>{t('Radera', 'Delete')}</strong> {t('dina uppgifter ("rätten att bli glömd").', 'your information ("right to be forgotten").')}
              <br />
              <strong>{t('Flytta', 'Port')}</strong> {t('dina uppgifter till en annan tjänst (dataportabilitet).', 'your information to another service (data portability).')}
              <br />
              <strong>{t('Invända', 'Object')}</strong> {t('mot behandling som grundar sig på berättigat intresse.', 'to processing based on legitimate interest.')}
            </p>
            <p>
              {t('Kontakta oss på info@sistaresan.se för att utöva dina rättigheter. Vi besvarar din begäran inom 30 dagar.', 'Contact us at info@sistaresan.se to exercise your rights. We will respond to your request within 30 days.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('8. Cookies', '8. Cookies')}</h2>
            <p>
              {t('Vi använder enbart tekniskt nödvändiga cookies för att hantera din inloggningssession. Vi använder inga spårningscookies eller tredjepartscookies för marknadsföring.', 'We only use technically necessary cookies to manage your login session. We do not use tracking cookies or third-party cookies for marketing.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('9. Tillsynsmyndighet', '9. Supervisory authority')}</h2>
            <p>
              {t('Om du anser att vi behandlar dina personuppgifter i strid med GDPR kan du lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY), imy.se.', 'If you believe we are processing your personal information in violation of GDPR, you can lodge a complaint with the Swedish Authority for Privacy Protection (IMY), imy.se.')}
            </p>
          </section>

          <section>
            <h2 className="font-display">{t('10. Kontakt', '10. Contact')}</h2>
            <p>
              Sista Resan
              <br />
              {t('E-post:', 'Email:')} info@sistaresan.se
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
