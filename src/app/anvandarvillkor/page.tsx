'use client';

import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function AnvandarvillkorPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">
            {t('Användarvillkor', 'Terms of Use')}
          </h1>
        </div>

        <p className="text-sm text-muted mb-6">
          {t('Senast uppdaterade:', 'Last updated:')} {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose-custom space-y-6">
          <section>
            <h2>{t('1. Om tjänsten', '1. About the service')}</h2>
            <p>
              {t('Sista Resan är en digital tjänst som hjälper privatpersoner att organisera och administrera dödsbon i Sverige. Tjänsten ger vägledning kring uppgifter, tidsfrister och dokumentation — men utgör inte juridisk, ekonomisk eller skatterättslig rådgivning.', 'Sista Resan is a digital service that helps individuals organize and manage estates in Sweden. The service provides guidance on tasks, deadlines, and documentation — but does not constitute legal, financial, or tax advice.')}
            </p>
          </section>

          <section>
            <h2>{t('2. Godkännande av villkor', '2. Acceptance of terms')}</h2>
            <p>
              {t('Genom att skapa ett konto och använda tjänsten godkänner du dessa användarvillkor. Om du inte accepterar villkoren ska du inte använda tjänsten. Vi kan komma att uppdatera villkoren och meddelar dig i så fall via e-post eller i appen.', 'By creating an account and using the service, you accept these terms of use. If you do not accept the terms, you should not use the service. We may update the terms and will notify you by email or in the app.')}
            </p>
          </section>

          <section>
            <h2>{t('3. Konto och ansvar', '3. Account and responsibility')}</h2>
            <p>
              {t('Du ansvarar för att hålla dina inloggningsuppgifter säkra. All aktivitet som sker via ditt konto är ditt ansvar. Om du misstänker obehörig åtkomst, kontakta oss omedelbart på info@sistaresan.se.', 'You are responsible for keeping your login credentials secure. All activity on your account is your responsibility. If you suspect unauthorized access, contact us immediately at info@sistaresan.se.')}
            </p>
          </section>

          <section>
            <h2>{t('4. Korrekt information', '4. Accurate information')}</h2>
            <p>
              {t('Du ansvarar för att den information du registrerar i tjänsten är korrekt och fullständig. Sista Resan verifierar inte uppgifter som du anger och ansvarar inte för konsekvenser av felaktiga uppgifter.', 'You are responsible for ensuring that the information you register in the service is accurate and complete. Sista Resan does not verify information you enter and is not responsible for consequences of inaccurate information.')}
            </p>
          </section>

          <section>
            <h2>{t('5. Tjänstens begränsningar', '5. Service limitations')}</h2>
            <p>
              {t('Sista Resan är ett hjälpverktyg och ersätter inte professionell juridisk rådgivning. Informationen i appen baseras på allmänna regler i svensk arvsrätt och kan inte ta hänsyn till alla individuella omständigheter. Vi rekommenderar att du kontaktar en jurist vid komplexa ärenden.', 'Sista Resan is a tool and does not replace professional legal advice. The information in the app is based on general rules of Swedish inheritance law and cannot account for all individual circumstances. We recommend consulting a lawyer for complex matters.')}
            </p>
            <p>
              {t('Vi garanterar inte att tjänsten är felfri eller tillgänglig utan avbrott. Vi strävar efter hög tillgänglighet men kan inte ansvara för tillfälliga driftstörningar.', 'We do not guarantee that the service is error-free or available without interruption. We strive for high availability but are not responsible for temporary service interruptions.')}
            </p>
          </section>

          <section>
            <h2>{t('6. Immateriella rättigheter', '6. Intellectual property')}</h2>
            <p>
              {t('All kod, design, texter och grafik i Sista Resan tillhör oss. Du får inte kopiera, modifiera eller distribuera material från tjänsten utan vårt skriftliga medgivande. Innehåll som du själv skapar i tjänsten (t.ex. uppgifter om dödsboet) tillhör dig.', 'All code, design, text, and graphics in Sista Resan belong to us. You may not copy, modify, or distribute material from the service without our written permission. Content you create in the service (such as estate information) belongs to you.')}
            </p>
          </section>

          <section>
            <h2>{t('7. Uppsägning', '7. Termination')}</h2>
            <p>
              {t('Du kan när som helst avsluta ditt konto via inställningar i appen. Vi kan stänga av konton som bryter mot dessa villkor. Vid uppsägning raderas dina uppgifter i enlighet med vår integritetspolicy.', 'You can terminate your account at any time via settings in the app. We can close accounts that violate these terms. Upon termination, your information is deleted in accordance with our privacy policy.')}
            </p>
          </section>

          <section>
            <h2>{t('8. Ansvarsbegränsning', '8. Limitation of liability')}</h2>
            <p>
              {t('Sista Resan ansvarar inte för direkta eller indirekta skador som uppstår genom användning av tjänsten, inklusive men inte begränsat till ekonomiska förluster, missade tidsfrister eller felaktiga beräkningar. Vårt ansvar är under alla omständigheter begränsat till det belopp du har betalat för tjänsten under de senaste 12 månaderna.', 'Sista Resan is not responsible for direct or indirect damages arising from use of the service, including but not limited to financial losses, missed deadlines, or calculation errors. Our liability is in all cases limited to the amount you have paid for the service in the past 12 months.')}
            </p>
          </section>

          <section>
            <h2>{t('9. Tvistlösning', '9. Dispute resolution')}</h2>
            <p>
              {t('Dessa villkor regleras av svensk lag. Tvister som inte kan lösas i samförstånd ska avgöras av Allmänna reklamationsnämnden (ARN) eller svensk allmän domstol.', 'These terms are governed by Swedish law. Disputes that cannot be resolved by mutual agreement shall be settled by the General Complaints Board (ARN) or a Swedish court.')}
            </p>
          </section>

          <section>
            <h2>{t('10. Kontakt', '10. Contact')}</h2>
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
