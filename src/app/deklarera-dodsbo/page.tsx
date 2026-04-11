'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function DeklararaDodsboPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back link */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Deklarera dödsbo</h1>
          <p className="text-muted">En guide till hur dödsboet deklarerar sin inkomst för Skatteverket</p>
        </div>

        {/* Warning box */}
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Viktigt: Deklarationsfristen</h3>
              <p className="text-sm text-red-800">
                Dödsboet ska deklarera senast <span className="font-semibold">2 maj</span> året efter dödsåret.
                Ansökan om förlängd tid kan göras innan fristen går ut.
              </p>
            </div>
          </div>
        </div>

        {/* Introduction section */}
        <section className="mb-8 p-6 bg-white rounded-lg border border-border">
          <h2 className="text-xl font-bold text-primary mb-4">Varför måste dödsboet deklarera?</h2>
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

        {/* Step-by-step section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Steg för steg</h2>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-5 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Samla alla handlingar</h3>
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
            <div className="p-5 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Lägg fram en bodelning eller arvsdelning</h3>
                  <p className="text-sm text-muted">
                    En behörig representative för dödsboet (ofte dödsbodelägare tillsammans eller en särskilt utsedd dödsboförrättare)
                    måste lämna in en bodelning eller arvsdelning till Skatteverket innan deklarationen lämnas in.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Fyll i inkomstdeklarationen</h3>
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
            <div className="p-5 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Lämna in deklarationen</h3>
                  <p className="text-sm text-muted">
                    Deklarationen lämnas in via <span className="font-semibold">Skatteverkets webbtjänst</span> eller
                    på papper. Kom ihåg fristen: senast <span className="font-semibold">2 maj</span> året efter dödsåret.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-5 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Vänta på slutlig skatt</h3>
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
          <h2 className="text-2xl font-bold text-primary mb-4">Vanliga frågor</h2>
          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="p-5 bg-white rounded-lg border border-border group cursor-pointer hover:bg-gray-50 transition-colors">
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
            <details className="p-5 bg-white rounded-lg border border-border group cursor-pointer hover:bg-gray-50 transition-colors">
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
            <details className="p-5 bg-white rounded-lg border border-border group cursor-pointer hover:bg-gray-50 transition-colors">
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
            <details className="p-5 bg-white rounded-lg border border-border group cursor-pointer hover:bg-gray-50 transition-colors">
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
            <details className="p-5 bg-white rounded-lg border border-border group cursor-pointer hover:bg-gray-50 transition-colors">
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
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Viktiga datum</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><span className="font-semibold">2 maj:</span> Deklarationsfrist</li>
                  <li><span className="font-semibold">Före 2 maj:</span> Ansök om förlängd tid om nödvändigt</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-green-50 rounded-lg border border-green-200">
            <div className="flex gap-3">
              <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Dokument du behöver</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>Dödsattest</li>
                  <li>Bodelning/arvsdelning</li>
                  <li>Bankutdrag och tillgångsöversikt</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="mb-8 p-6 bg-accent/5 rounded-lg border border-accent/20">
          <h2 className="text-lg font-semibold text-primary mb-3">Behöver du juridisk hjälp?</h2>
          <p className="text-muted mb-4">
            Deklarering av dödsbo kan vara komplicerat, särskilt om dödsboet äger fastigheter
            eller har avveckling av företag. En juridisk rådgivare kan hjälpa dig att fylla i
            deklarationen korrekt och i tid.
          </p>
          <Link
            href="/juridisk-hjalp"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-semibold"
          >
            Hitta juridisk hjälp
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Legal disclaimer */}
        <section className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-muted">
          <p>
            <span className="font-semibold">Juridisk ansvarsfriskrivning:</span> Denna information är allmän vägledning
            och ersätter inte rådgivning från en kvalificerad skattekonsult eller juridisk rådgivare.
            Skattesituationen kan variera beroende på personliga omständigheter.
            Kontakta alltid en expert för din specifika situation.
          </p>
        </section>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
