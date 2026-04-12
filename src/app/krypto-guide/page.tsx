'use client';

import { BottomNav } from '@/components/ui/BottomNav';
import {
  AlertTriangle,
  Bitcoin,
  Lock,
  DollarSign,
  FileText,
  Shield,
  HelpCircle,
  ArrowRight,
  Search,
} from 'lucide-react';

export default function KryptoGuidePage() {
  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bitcoin className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Kryptoguide</h1>
        </div>
        <p className="text-sm text-primary/70">
          Steg-för-steg hjälp för att hantera kryptovalutor i dödsboet.
        </p>
      </div>

      {/* Warning Box */}
      <div className="card border-l-4 border-warn mb-6 bg-warn/5">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warn mb-2">Varning</p>
            <p className="text-sm text-primary mb-2">
              Kryptohantering kräver teknisk kunskap. Överför inte kryptovalutor utan att först förstå processen helt. En felaktig överföring kan leda till att pengarna försvinner helt.
            </p>
            <p className="text-xs text-primary/70">
              Kontakta en teknisk expert eller advokat om du är osäker.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Hitta krypto */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">1. Hitta den avlidnes kryptovalutor</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">E-postbekräftelser</p>
            <p>Sök efter e-post från kryptobörser. Vanliga börser i Sverige:</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Coinbase</li>
              <li>Binance</li>
              <li>Kraken</li>
              <li>Avanza Crypto</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Webbläsarbokmärken och historik</p>
            <p>Kontrollera datorns webbläsarhistorik och sparade bokmärken efter kryptobörser eller plånböcker.</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Hårdvaruplånböcker</p>
            <p>Leta efter små USB-liknande enheter:</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Ledger</li>
              <li>Trezor</li>
              <li>KeepKey</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Mobilappar</p>
            <p>Kontrollera mobiltelefonen för kryptoappar (MetaMask, Trust Wallet, Coinbase, etc.).</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Personliga anteckningar</p>
            <p>Sök i papper, dagböcker, lösenordshanterare eller krypton-anteckningar efter kontouppgifter.</p>
          </div>
        </div>
      </div>

      {/* Section 2: Seed phrases and private keys */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">2. Seed phrases & privata nycklar</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">Vad är en seed phrase?</p>
            <p>En seed phrase (även kallad &quot;mnemonic&quot;) är en lista med 12 eller 24 ord som genereras när man skapar en plånbok. Med dessa ord kan man återställa åtkomsten till alla kryptomedel.</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Var finns seed phrases?</p>
            <p>Leta i:</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Handskrivna anteckningar (ofta på ett papper hemma)</li>
              <li>Lösenordshanterare (1Password, Bitwarden, LastPass)</li>
              <li>Säkerhetsdepåer hos banken</li>
              <li>USB-minnen eller hårdkodade enheter</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Privata nycklar</p>
            <p>En privat nyckel är en lång strängsiffror/bokstäver som ger full kontroll över kryptot. Behandla det som ett lösenord — den som har det kan ta medlen.</p>
          </div>

          <div className="bg-warn/10 p-3 rounded border border-warn/30">
            <p className="font-medium text-warn text-xs mb-1">SÄKERHET</p>
            <p className="text-xs">Dela aldrig seed phrases eller privata nycklar digitalt. Skriv inte av dem i e-post, chatt eller bilder. Om någon får dessa kan de stjäla all krypto omedelbar.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Valuation */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">3. Värdering för dödsboet</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">Använd växelkursen från dödsdagen</p>
            <p>Kryptovalutor värderas enligt kursen på dagen för dödsfall (dödsdagen). Använd:</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>CoinMarketCap eller CoinGecko för historiska kurser</li>
              <li>Börskursen från den dag kryptomedlen fanns</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Räkna såhär</p>
            <p>Antalet mynt × växelkurs på dödsdagen = värde i SEK</p>
            <p className="text-xs mt-1 font-mono bg-background p-2 rounded">
              Exempel: 1 Bitcoin × 450 000 SEK = 450 000 SEK
            </p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Dokumentera allt</p>
            <p>Spara utskrifter från börser och växelkurser för Skatteverket och arvskifte-handlingar.</p>
          </div>
        </div>
      </div>

      {/* Section 4: Swedish tax */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">4. Skatt &amp; Skatteverket</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">Värdering för arvskifte</p>
            <p>Alla tillgångar i dödsboet — inklusive krypto — ska listas i bouppteckningen. Använd värdet från dödsdagen.</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Realiseringsvinst</p>
            <p>Om krypton senare säljs för mer än värdet på dödsdagen uppstår en realiseringsvinst som ska redovisas.</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Schablon: 30 % skatt på kapitalvinster</p>
            <p>I Sverige är kapitalvinster på kryptovalutor skattepliktiga. Normalt gäller 30 % skattesats. Arv är inte skattebelagt, men senare försäljning är det.</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">Rapportering</p>
            <p>Redovisa till Skatteverket i deklarationen för det år då krypton säljs (eller för dödsboets slutliquidation).</p>
          </div>

          <div className="bg-background p-3 rounded border border-[#E8E4DE]">
            <p className="text-xs font-medium mb-1">Kontakt: Skatteverket</p>
            <p className="text-xs">Tel: 0771-567 567 | Web: skatteverket.se</p>
          </div>
        </div>
      </div>

      {/* Section 5: Bouppteckning */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">5. Bouppteckning</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <p>Kryptovalutor ska listas i bouppteckningen tillsammans med övriga tillgångar:</p>
          <div className="bg-background p-3 rounded border border-[#E8E4DE]">
            <p className="font-mono text-xs">
              <span className="font-medium">Typ:</span> Kryptovalutor<br />
              <span className="font-medium">Beskrivning:</span> 1 BTC på Coinbase<br />
              <span className="font-medium">Värde per dödsdagen:</span> 450 000 SEK
            </p>
          </div>
          <p>Bifoga dokumentation (utskrifter från börser, skärmbilder) till bouppteckningen.</p>
        </div>
      </div>

      {/* Section 6: Common cryptos */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bitcoin className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">6. Vanliga kryptovalutor</h2>
        </div>
        <div className="space-y-2 text-sm text-primary/80">
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">BTC</span>
            <div>
              <p className="font-medium text-primary">Bitcoin</p>
              <p className="text-xs">Världens största och mest etablerade kryptovaluta.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">ETH</span>
            <div>
              <p className="font-medium text-primary">Ethereum</p>
              <p className="text-xs">Plattform för smarta kontrakt och tokens.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">SOL</span>
            <div>
              <p className="font-medium text-primary">Solana</p>
              <p className="text-xs">Snabb blockchain-plattform.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">XRP</span>
            <div>
              <p className="font-medium text-primary">Ripple</p>
              <p className="text-xs">Betalningsnätverk och växlingsprotokoll.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Safety */}
      <div className="card border-l-4 border-accent mb-6">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary mb-3">Viktiga säkerhetstips</p>
            <ul className="space-y-2 text-sm text-primary/80">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                Aldrig dela seed phrases eller privata nycklar via e-post eller chatt
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                Kontrollera blockchain-adressen två gånger före överföring
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                Vänta på nätverksbekräftelse innan du anser överföringen avslutad
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                Använd endast officiella webplatser och appar (kontrollera URL)
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                Var försiktig med bedrägeri — många utger sig för att vara börser
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professional Help CTA */}
      <div className="card bg-accent/5 border-2 border-accent mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-accent" />
          <p className="font-semibold text-primary">Behöver du hjälp?</p>
        </div>
        <p className="text-sm text-primary/80 mb-4">
          Kryptohantering kan vara komplicerad. Kontakta en jurist eller teknisk expert om du är osäker.
        </p>
        <a
          href="/juridisk-hjalp"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Juridisk hjälp <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <BottomNav />
    </div>
  );
}
