'use client';

import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';

export default function DeklararaDodsboPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background">
      {/* Header with back link */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E8E4DE]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('Tillbaka', 'Back')}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-primary mb-2">{t('Deklarera dödsbo', 'File estate tax return')}</h1>
          <p className="text-muted">{t('En guide till hur dödsboet deklarerar sin inkomst för Skatteverket', 'A guide to how the estate files its income to the Swedish Tax Agency')}</p>
        </div>

        {/* Warning box */}
        <div className="mb-8 p-4 flex gap-3" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
          <AlertTriangle className="w-6 h-6 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-primary mb-1">Viktigt: Deklarationsfristen</h3>
            <p className="text-sm text-primary mb-2">
              Dödsboet ska deklarera senast <span className="font-semibold">2 maj</span> året efter dödsåret
              (eller <span className="font-semibold">15 maj</span> för digitala deklarationer).
            </p>
            <p className="text-sm text-primary">
              <span className="font-semibold">Exempel:</span> Om dödsfallet inträffade 15 mars 2024,
              ska dödsboets deklaration lämnas senast 2 maj 2025.
            </p>
          </div>
        </div>

        {/* Introduction section */}
        <section className="mb-8 p-6 bg-white rounded-lg border border-[#E8E4DE]">
          <h2 className="text-xl font-display text-primary mb-4">Varför måste dödsboet deklarera?</h2>
          <div className="space-y-3 text-muted">
            <p>
              Ett dödsbo är en juridisk person som måste deklarera sin inkomst och tillgångar till Skatteverket,
              på samma sätt som en levande person eller ett företag.
            </p>
            <p>
              Dödsboet ska deklarera både för <span className="font-semibold text-primary">dödsåret</span> och
              potentiellt för <span className="font-semibold text-primary">året därefter</span> om dödsboet inte är slutfört
              vid årsskiftet (dvs. tillgångarna ännu inte fördelats mellan arvingarna).
            </p>
          </div>
        </section>

        {/* What needs to be declared section */}
        <section className="mb-8 p-6 bg-white rounded-lg border border-[#E8E4DE]">
          <h2 className="text-xl font-display text-primary mb-4">Vad ska dödsboet deklarera?</h2>
          <p className="text-muted mb-4">
            Dödsboet ska deklarera alla inkomster från den 1 januari fram till dödsdagen. Här är vad som behöver redovisas:
          </p>
          <ul className="text-sm text-muted space-y-3 list-disc list-inside">
            <li><span className="font-semibold text-primary">Inkomster från 1 januari till dödsdagen</span> — Löner, pensioner och andra inkomster som avlidna hade rätt till</li>
            <li><span className="font-semibold text-primary">Ränteintäkter och kapitalvinster</span> — Räntor från bankkonton och vinster från försäljning av värdepapper</li>
            <li><span className="font-semibold text-primary">Fastighetsförsäljning (om tillämpligt)</span> — Om dödsboet säljer någon fastighet måste försäljningsvinsten deklareras</li>
            <li><span className="font-semibold text-primary">Pensionsutbetalningar fram till dödsdagen</span> — Alla pensionsutbetalningar måste redovisas för den tid personen var i livet</li>
          </ul>
        </section>

        {/* Step-by-step section */}
        <section className="mb-8">
          <h2 className="text-xl font-display text-primary mb-4">Steg för steg</h2>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-5 bg-white rounded-lg border border-[#E8E4DE] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-primary mb-2">Samla alla handlingar</h3>
                  <p className="text-sm text-muted mb-3">
                    Samla all dokumentation om dödsboets inkomster och tillgångar:
                  </p>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>Dödsattest och testamente (om det finns)</li>
                    <li>Kontoutdrag för dödsboets bankkonto</li>
                    <li>Fastighetsbeskrivningar (om dödsboet äger fastigheter)</li>
                    <li>Dokumentation på försälјningar av tillgångar</li>
                    <li>Uppgifter om ränteintäkter och andra inkomster</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-white rounded-lg border border-[#E8E4DE] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-primary mb-2">Lägg fram en bodelning eller arvsdelning</h3>
                  <p className="text-sm text-muted">
                    En behörig representative för dödsboet (ofte dödsbodelägare tillsammans eller en särskilt utsedd dödsboförrättare)
                    måste lämna in en bodelning eller arvsdelning till Skatteverket innan deklarationen lämnas in.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-white rounded-lg border border-[#E8E4DE] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-primary mb-2">Fyll i inkomstdeklarationen</h3>
                  <p className="text-sm text-muted mb-3">
                    Dödsboet fyller i en standard inkomstdeklaration (blankett K10 eller motsvarande) med:
                  </p>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>Inkomster under året (räntor, hyror, försäljningsvinster)</li>
                    <li>Kostnader (dödsboförrättaravgift, gravöl, juridisk hjälp)</li>
                    <li>Fastighetsuppgifter (använd K-blankett för fastigheter)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 bg-white rounded-lg border border-[#E8E4DE] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-primary mb-2">Lämna in deklarationen</h3>
                  <p className="text-sm text-muted">
                    Deklarationen lämnas in via <span className="font-semibold">Skatteverkets webbtjänst</span> eller
                    på papper. Kom ihåg fristen: senast <span className="font-semibold">2 maj</span> året efter dödsåret.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-5 bg-white rounded-lg border border-[#E8E4DE] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-primary mb-2">Vänta på slutlig skatt</h3>
                  <p className="text-sm text-muted">
                    Skatteverket granskar deklarationen och skickar slutsed för dödsboet.
                    Om dödsboet har gjort förluster kan dessa ofta överföras till arvingarna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="mb-8">
          <h2 className="text-xl font-display text-primary mb-4">Vanliga frågor</h2>
          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="p-5 bg-white rounded-lg border border-[#E8E4DE] group cursor-pointer hover:bg-white transition-colors">
              <summary className="flex items-center justify-between font-semibold text-primary">
                <span>Vad är inkomstdeklaration för dödsbo?</span>
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-muted space-y-2">
                <p>
                  Inkomstdeklaration för dödsbo är ett formulär som dödsboet fyller i för att redovisa
                  sina inkomster och utgifter för det år personen avled. Det är juridiskt obligatoriskt
                  att lämna in denna deklaration även om dödsboet inte har någon skattepliktig inkomst.
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="p-5 bg-white rounded-lg border border-[#E8E4DE] group cursor-pointer hover:bg-white transition-colors">
              <summary className="flex items-center justify-between font-semibold text-primary">
                <span>Vem är ansvarig för deklarationen?</span>
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-muted space-y-2">
                <p>
                  Dödsbodelägarna tillsammans är ansvariga för att deklarationen lämnas in i rätt tid.
                  Om en dödsboförrättare eller testamentexekutor är utsedd, är ofta denna person den
                  praktiska ansvarig för att fylla i och lämna in deklarationen.
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="p-5 bg-white rounded-lg border border-[#E8E4DE] group cursor-pointer hover:bg-white transition-colors">
              <summary className="flex items-center justify-between font-semibold text-primary">
                <span>Vad är K-blankett för fastigheter?</span>
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-muted space-y-2">
                <p>
                  K-blanketten är en särskild blankett som användes för att rapportera uppgifter om
                  fastigheter och mark som dödsboet äger eller har sålt under året. Den innehåller
                  information om fastighetens värde, utgifter för underhåll och eventuella försäljningsvinster.
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="p-5 bg-white rounded-lg border border-[#E8E4DE] group cursor-pointer hover:bg-white transition-colors">
              <summary className="flex items-center justify-between font-semibold text-primary">
                <span>Vad händer om deklarationen lämnas in för sent?</span>
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-muted space-y-2">
                <p>
                  Om deklarationen lämnas in efter fristen (2 maj) kan Skatteverket ta ut en särskild
                  försening avgift. Det är dock möjligt att ansöka om förlängd tid innan fristen går ut
                  om dödsboet har särskilda skäl (t.ex. komplicerade fastighetsförhållanden).
                </p>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="p-5 bg-white rounded-lg border border-[#E8E4DE] group cursor-pointer hover:bg-white transition-colors">
              <summary className="flex items-center justify-between font-semibold text-primary">
                <span>Kan dödsboet få förluster eller avdrag?</span>
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-muted space-y-2">
                <p>
                  Ja, dödsboet kan göra vissa avdrag för kostnaderna för att förvalta dödsboet,
                  såsom dödsboförrättaravgift, juridisk rådgivning och revisorkostnader.
                  Förluster kan ofta överföras till arvingarna.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* Key info boxes */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 bg-info-light rounded-lg border border-info-light h-full">
              <div className="flex gap-3 h-full flex-col">
                <div className="flex gap-3">
                  <Calendar className="w-6 h-6 text-accent flex-shrink-0" />
                  <h3 className="font-display text-primary">Viktiga datum</h3>
                </div>
                <ul className="text-sm text-primary space-y-1">
                  <li><span className="font-semibold">2 maj:</span> Deklarationsfrist</li>
                  <li><span className="font-semibold">Före 2 maj:</span> Ansök om förlängd tid om nödvändigt</li>
                </ul>
              </div>
            </div>

            <div className="p-5 bg-accent/5 rounded-lg border border-accent/20 h-full">
              <div className="flex gap-3 h-full flex-col">
                <div className="flex gap-3">
                  <FileText className="w-6 h-6 text-accent flex-shrink-0" />
                  <h3 className="font-display text-primary">Dokument du behöver</h3>
                </div>
                <ul className="text-sm text-primary space-y-1">
                  <li>Dödsattest</li>
                  <li>Bodelning/arvsdelning</li>
                  <li>Bankutdrag och tillgångsöversikt</li>
                </ul>
              </div>
            </div>

            <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 h-full">
              <div className="flex gap-3 h-full flex-col">
                <div className="flex gap-3">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h3 className="font-display text-primary">Praktisk info från Skatteverket</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-primary">
                    Dödsboet är skattskyldigt som en egen juridisk person. Skatteverket skickar ofta
                    en förifylld deklaration direkt till dödsboet.
                  </p>
                  <p className="text-xs text-muted">
                    <span className="font-semibold">Tips:</span> Kontrollera att adressen är rätt — deklarationen
                    skickas till folkbokföringsadressen. Uppdatera adress om dödsboet har en annan adress.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-green-50 rounded-lg border border-green-200 h-full">
              <div className="flex gap-3 h-full flex-col">
                <div className="flex gap-3">
                  <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <h3 className="font-display text-primary">Efterlevandepension</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-primary">
                    Den efterlevande kan ha rätt till omställningspension via Pensionsmyndigheten.
                  </p>
                  <p className="text-xs text-muted">
                    <span className="font-semibold">Ring Pensionsmyndigheten:</span> 0771-776 776.
                    Detta gäller i 12 månader efter dödsfallet. Ansök så snart som möjligt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="mb-8 p-6 bg-accent/5 rounded-lg border border-accent/20">
          <h2 className="text-lg font-display text-primary mb-3">Behöver du juridisk hjälp?</h2>
          <p className="text-muted mb-4">
            Deklarering av dödsbo kan vara komplicerat, särskilt om dödsboet äger fastigheter
            eller har avveckling av företag. En juridisk rådgivare kan hjälpa dig att fylla i
            deklarationen korrekt och i tid.
          </p>
          <Link
            href="/juridisk-hjalp"
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-full hover:opacity-90 transition-opacity font-semibold"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          >
            Hitta juridisk hjälp
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Legal disclaimer */}
        <section className="mb-8 p-4 bg-white rounded-lg border border-gray-200 text-xs text-muted">
          <p>
            <span className="font-semibold">Juridisk ansvarsfriskrivning:</span> Denna information är allmän vägledning
            och ersätter inte rådgivning från en kvalificerad skattekonsult eller juridisk rådgivare.
            Skattesituationen kan variera beroende på personliga omständigheter.
            Kontakta alltid en expert för din specifika situation.
          </p>
        </section>
      </main>

      {/* Bottom navigation */}
    </div>
  );
}
