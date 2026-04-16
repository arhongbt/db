'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bitcoin className="w-8 h-8 text-accent" />
          <h1 className="text-xl font-display text-primary">{t('Kryptoguide', 'Cryptocurrency Guide')}</h1>
        </div>
        <p className="text-sm text-primary/70">
          {t('Steg-för-steg hjälp för att hantera kryptovalutor i dödsboet.', 'Step-by-step help to manage cryptocurrency in the estate.')}
        </p>
      </div>

      {/* Warning Box */}
      <div className="card mb-6 bg-warn/5" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warn mb-2">{t('Varning', 'Warning')}</p>
            <p className="text-sm text-primary mb-2">
              {t('Kryptohantering kräver teknisk kunskap. Överför inte kryptovalutor utan att först förstå processen helt. En felaktig överföring kan leda till att pengarna försvinner helt.', 'Cryptocurrency management requires technical knowledge. Do not transfer cryptocurrency without first fully understanding the process. An incorrect transfer can result in permanent loss of funds.')}
            </p>
            <p className="text-xs text-primary/70">
              {t('Kontakta en teknisk expert eller advokat om du är osäker.', 'Contact a technical expert or lawyer if you are unsure.')}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Hitta krypto */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('1. Hitta den avlidnes kryptovalutor', '1. Find the deceased\'s cryptocurrency')}</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">{t('E-postbekräftelser', 'Email confirmations')}</p>
            <p>{t('Sök efter e-post från kryptobörser. Vanliga börser i Sverige:', 'Search for emails from crypto exchanges. Common exchanges in Sweden:')}</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Coinbase</li>
              <li>Binance</li>
              <li>Kraken</li>
              <li>Avanza Crypto</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Webbläsarbokmärken och historik', 'Browser bookmarks and history')}</p>
            <p>{t('Kontrollera datorns webbläsarhistorik och sparade bokmärken efter kryptobörser eller plånböcker.', 'Check the computer\'s browser history and saved bookmarks for crypto exchanges or wallets.')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Hårdvaruplånböcker', 'Hardware wallets')}</p>
            <p>{t('Leta efter små USB-liknande enheter:', 'Look for small USB-like devices:')}</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Ledger</li>
              <li>Trezor</li>
              <li>KeepKey</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Mobilappar', 'Mobile apps')}</p>
            <p>{t('Kontrollera mobiltelefonen för kryptoappar (MetaMask, Trust Wallet, Coinbase, etc.).', 'Check the mobile phone for crypto apps (MetaMask, Trust Wallet, Coinbase, etc.).')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Personliga anteckningar', 'Personal notes')}</p>
            <p>{t('Sök i papper, dagböcker, lösenordshanterare eller krypton-anteckningar efter kontouppgifter.', 'Search in papers, diaries, password managers, or crypto notes for account information.')}</p>
          </div>
        </div>
      </div>

      {/* Section 2: Seed phrases and private keys */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('2. Seed phrases & privata nycklar', '2. Seed phrases & private keys')}</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">{t('Vad är en seed phrase?', 'What is a seed phrase?')}</p>
            <p>{t('En seed phrase (även kallad &quot;mnemonic&quot;) är en lista med 12 eller 24 ord som genereras när man skapar en plånbok. Med dessa ord kan man återställa åtkomsten till alla kryptomedel.', 'A seed phrase (also called a &quot;mnemonic&quot;) is a list of 12 or 24 words generated when creating a wallet. With these words, you can restore access to all cryptocurrency.')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Var finns seed phrases?', 'Where are seed phrases located?')}</p>
            <p>{t('Leta i:', 'Look in:')}</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>Handskrivna anteckningar (ofta på ett papper hemma)</li>
              <li>Lösenordshanterare (1Password, Bitwarden, LastPass)</li>
              <li>Säkerhetsdepåer hos banken</li>
              <li>USB-minnen eller hårdkodade enheter</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Privata nycklar', 'Private keys')}</p>
            <p>{t('En privat nyckel är en lång strängsiffror/bokstäver som ger full kontroll över kryptot. Behandla det som ett lösenord — den som har det kan ta medlen.', 'A private key is a long string of numbers/letters that gives full control of the cryptocurrency. Treat it like a password — whoever has it can take the funds.')}</p>
          </div>

          <div className="bg-warn/10 p-3 rounded border border-warn/30">
            <p className="font-medium text-warn text-xs mb-1">{t('SÄKERHET', 'SECURITY')}</p>
            <p className="text-xs">{t('Dela aldrig seed phrases eller privata nycklar digitalt. Skriv inte av dem i e-post, chatt eller bilder. Om någon får dessa kan de stjäla all krypto omedelbar.', 'Never share seed phrases or private keys digitally. Do not copy them in emails, chat, or images. If anyone gets these, they can steal all crypto immediately.')}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Valuation */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('3. Värdering för dödsboet', '3. Valuation for the estate')}</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">{t('Använd växelkursen från dödsdagen', 'Use the exchange rate from the date of death')}</p>
            <p>{t('Kryptovalutor värderas enligt kursen på dagen för dödsfall (dödsdagen). Använd:', 'Cryptocurrencies are valued according to the rate on the date of death. Use:')}</p>
            <ul className="list-disc list-inside mt-1 ml-1 text-xs">
              <li>{t('CoinMarketCap eller CoinGecko för historiska kurser', 'CoinMarketCap or CoinGecko for historical rates')}</li>
              <li>{t('Börskursen från den dag kryptomedlen fanns', 'The exchange rate from the day the cryptocurrency existed')}</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Räkna såhär', 'Calculate like this')}</p>
            <p>{t('Antalet mynt × växelkurs på dödsdagen = värde i SEK', 'Number of coins × exchange rate on date of death = value in SEK')}</p>
            <p className="text-xs mt-1 font-mono bg-background p-2 rounded">
              {t('Exempel: 1 Bitcoin × 450 000 SEK = 450 000 SEK', 'Example: 1 Bitcoin × 450,000 SEK = 450,000 SEK')}
            </p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Dokumentera allt', 'Document everything')}</p>
            <p>{t('Spara utskrifter från börser och växelkurser för Skatteverket och arvskifte-handlingar.', 'Save printouts from exchanges and exchange rates for the Swedish Tax Agency and inheritance distribution documents.')}</p>
          </div>
        </div>
      </div>

      {/* Section 4: Swedish tax */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('4. Skatt & Skatteverket', '4. Taxes & Swedish Tax Agency')}</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <div>
            <p className="font-medium text-primary mb-1">{t('Värdering för arvskifte', 'Valuation for inheritance division')}</p>
            <p>{t('Alla tillgångar i dödsboet — inklusive krypto — ska listas i bouppteckningen. Använd värtet från dödsdagen.', 'All estate assets — including crypto — must be listed in the inventory. Use the value from the date of death.')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Realiseringsvinst', 'Capital gain')}</p>
            <p>{t('Om krypton senare säljs för mer än värdet på dödsdagen uppstår en realiseringsvinst som ska redovisas.', 'If the crypto is later sold for more than its value on the date of death, a capital gain arises that must be reported.')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Schablon: 30 % skatt på kapitalvinster', 'Standard: 30% tax on capital gains')}</p>
            <p>{t('I Sverige är kapitalvinster på kryptovalutor skattepliktiga. Normalt gäller 30 % skattesats. Arv är inte skattebelagt, men senare försäljning är det.', 'In Sweden, capital gains on cryptocurrency are taxable. Normally a 30% tax rate applies. Inheritance is not taxable, but later sales are.')}</p>
          </div>

          <div>
            <p className="font-medium text-primary mb-1">{t('Rapportering', 'Reporting')}</p>
            <p>{t('Redovisa till Skatteverket i deklarationen för det år då krypton säljs (eller för dödsboets slutliquidation).', 'Report to the Swedish Tax Agency in the tax return for the year the crypto is sold (or for the final liquidation of the estate).')}</p>
          </div>

          <div className="bg-background p-3 rounded border border-[#E8E4DE]">
            <p className="text-xs font-medium mb-1">{t('Kontakt: Skatteverket', 'Contact: Swedish Tax Agency')}</p>
            <p className="text-xs">Tel: 0771-567 567 | Web: skatteverket.se</p>
          </div>
        </div>
      </div>

      {/* Section 5: Bouppteckning */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('5. Bouppteckning', '5. Estate Inventory')}</h2>
        </div>
        <div className="space-y-3 text-sm text-primary/80">
          <p>{t('Kryptovalutor ska listas i bouppteckningen tillsammans med övriga tillgångar:', 'Cryptocurrencies must be listed in the inventory along with other assets:')}</p>
          <div className="bg-background p-3 rounded border border-[#E8E4DE]">
            <p className="font-mono text-xs">
              <span className="font-medium">{t('Typ:', 'Type:')}</span> {t('Kryptovalutor', 'Cryptocurrencies')}<br />
              <span className="font-medium">{t('Beskrivning:', 'Description:')}</span> 1 BTC på Coinbase<br />
              <span className="font-medium">{t('Värde per dödsdagen:', 'Value on date of death:')}</span> 450 000 SEK
            </p>
          </div>
          <p>{t('Bifoga dokumentation (utskrifter från börser, skärmbilder) till bouppteckningen.', 'Attach documentation (exchange printouts, screenshots) to the inventory.')}</p>
        </div>
      </div>

      {/* Section 6: Common cryptos */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bitcoin className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display text-primary">{t('6. Vanliga kryptovalutor', '6. Common Cryptocurrencies')}</h2>
        </div>
        <div className="space-y-2 text-sm text-primary/80">
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">BTC</span>
            <div>
              <p className="font-medium text-primary">Bitcoin</p>
              <p className="text-xs">{t('Världens största och mest etablerade kryptovaluta.', 'The world\'s largest and most established cryptocurrency.')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">ETH</span>
            <div>
              <p className="font-medium text-primary">Ethereum</p>
              <p className="text-xs">{t('Plattform för smarta kontrakt och tokens.', 'Platform for smart contracts and tokens.')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">SOL</span>
            <div>
              <p className="font-medium text-primary">Solana</p>
              <p className="text-xs">{t('Snabb blockchain-plattform.', 'Fast blockchain platform.')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-background rounded">
            <span className="font-mono font-semibold text-accent min-w-fit">XRP</span>
            <div>
              <p className="font-medium text-primary">Ripple</p>
              <p className="text-xs">{t('Betalningsnätverk och växlingsprotokoll.', 'Payment network and exchange protocol.')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Safety */}
      <div className="card mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary mb-3">{t('Viktiga säkerhetstips', 'Important security tips')}</p>
            <ul className="space-y-2 text-sm text-primary/80">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                {t('Aldrig dela seed phrases eller privata nycklar via e-post eller chatt', 'Never share seed phrases or private keys via email or chat')}
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                {t('Kontrollera blockchain-adressen två gånger före överföring', 'Check the blockchain address twice before transferring')}
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                {t('Vänta på nätverksbekräftelse innan du anser överföringen avslutad', 'Wait for network confirmation before considering the transfer complete')}
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                {t('Använd endast officiella webplatser och appar (kontrollera URL)', 'Use only official websites and apps (check URL)')}
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                {t('Var försiktig med bedrägeri — många utger sig för att vara börser', 'Be careful of fraud — many pretend to be exchanges')}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professional Help CTA */}
      <div className="card bg-accent/5 border-2 border-accent mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-accent" />
          <p className="font-semibold text-primary">{t('Behöver du hjälp?', 'Need help?')}</p>
        </div>
        <p className="text-sm text-primary/80 mb-4">
          {t('Kryptohantering kan vara komplicerad. Kontakta en jurist eller teknisk expert om du är osäker.', 'Cryptocurrency management can be complicated. Contact a lawyer or technical expert if you are unsure.')}
        </p>
        <Link
          href="/juridisk-hjalp"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[24px] bg-accent text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {t('Juridisk hjälp', 'Legal Help')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
