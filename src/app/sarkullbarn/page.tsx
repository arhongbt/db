'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import {
  Baby,
  ChevronRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MikeRossTip } from '@/components/ui/MikeRossTip';

interface FAQItem {
  question: string;
  answer: string;
}

const createFAQ_ITEMS = (t: any): FAQItem[] => [
  {
    question: t('Vad är särkullbarn?', 'What are non-mutual children?'),
    answer: t('Särkullbarn är barn som endast en av föräldrarna är gemensam för. I en ny relation där en eller båda parter har barn från tidigare förhållanden, är dessa barn särkullbarn gentemot den nya partnerns andra barn.', 'Non-mutual children are children who have only one parent in common. In a new relationship where one or both parties have children from previous relationships, these children are non-mutual siblings to the new partner\'s other children.'),
  },
  {
    question: t('Vilken arvsrätt har särkullbarn?', 'What inheritance rights do non-mutual children have?'),
    answer: t('Särkullbarn ärver enligt samma arvsordning som vanliga barn, men de har särskilda rättigheter. De kan kräva ut sin arvslott (laglott) omedelbar när dödsboet är till och från, utan att behöva vänta på den efterlevande makens eller makans bortgång.', 'Non-mutual children inherit according to the same rules as other children, but have special rights. They can claim their legal portion (laglott) immediately when the estate is finalized, without waiting for the surviving spouse to pass away.'),
  },
  {
    question: t('Vad är skillnaden mellan laglott och arvslott?', 'What is the difference between legal portion and inheritance share?'),
    answer: t('Arvslott är den del av arvet som utgör en arvings lagliga andel. Laglott är hälften av arvslotten, vilket är det minimibelopp en arvinge har rätt till även om testamentet fördelar arvet annorlunda. För särkullbarn är laglotten en viktig skyddsrätt.', 'Inheritance share is the portion of the estate that represents an heir\'s legal entitlement. Legal portion (laglott) is half the inheritance share, the minimum amount an heir can claim even if a will distributes otherwise. For non-mutual children, this is an important protection.'),
  },
  {
    question: t('Kan särkullbarn välja att inte ta ut sitt arv omedelbar?', 'Can non-mutual children choose not to claim their inheritance immediately?'),
    answer: t('Ja. Särkullbarn kan frivilligt välja att inte kräva ut sin laglott direkt. De kan då låta pengarna stanna i dödsboet för att stödja den återstående maken eller makan. Detta måste göras frivilligt och skriftligt.', 'Yes. Non-mutual children can voluntarily choose not to claim their portion immediately. They can allow the funds to remain in the estate to support the surviving spouse. This must be done voluntarily and in writing.'),
  },
  {
    question: t('Hur beräknas laglotten för särkullbarn?', 'How is the legal portion calculated for non-mutual children?'),
    answer: t('Laglotten är hälften av arvslotten. Arvslotten beräknas genom att dödsboets nettoförmögenhet divideras med antal arvingar. För särkullbarn: laglott = (nettoförmögenhet ÷ antal arvingar) ÷ 2.', 'The legal portion is half the inheritance share. Inheritance share is calculated by dividing the estate\'s net value by the number of heirs. For non-mutual children: legal portion = (net value ÷ number of heirs) ÷ 2.'),
  },
  {
    question: t('Kan den efterlevande maken/makan vägra särkullbarnets arv?', 'Can the surviving spouse refuse the non-mutual child\'s inheritance?'),
    answer: t('Nej. Den efterlevande maken/makan kan inte vägra särkullbarnets lagliga rätt till laglotten. Om särkullbarnet kräver sitt belopp, måste det betalas ut från dödsboet.', 'No. The surviving spouse cannot refuse the non-mutual child\'s legal right to their portion. If the non-mutual child claims their amount, it must be paid from the estate.'),
  },
  {
    question: t('Vad händer om det inte finns tillräckligt med pengar för laglotten?', 'What happens if the estate doesn\'t have enough funds for the legal portion?'),
    answer: t('Om dödsboet inte har tillräckligt med likvida medel kan dödsboet behöva sälja tillgångar (fastigheter, värdepapper) eller ta lån för att betala ut laglotten.', 'If the estate lacks liquid funds, it may need to sell assets (property, securities) or take a loan to pay out the legal portion.'),
  },
  {
    question: t('Behöver särkullbarn godkänna arvskiftet?', 'Do non-mutual children need to approve the estate distribution?'),
    answer: t('Ja, alla arvingar, inklusive särkullbarn, måste godkänna arvskifteshandlingen. Om särkullbarnet inte är myndig måste deras förälder godkänna.', 'Yes, all heirs, including non-mutual children, must approve the estate distribution document. If the non-mutual child is not an adult, their parent must approve.'),
  },
];

export default function SarkullbarnPage() {
  const { t } = useLanguage();
  const FAQ_ITEMS = createFAQ_ITEMS(t);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] pb-24">
      <Breadcrumb />
      <PageHeader
        title={t('Särkullbarn och arv', 'Non-mutual Children and Inheritance')}
        subtitle={t('Speciella rättigheter i arvskiftet', 'Special rights in estate distribution')}
      />
      <div className="px-4">

      <MikeRossTip className="mb-5" text={t('Särkullbarn är juridiskt skyddade — de kan kräva sin laglott (halva arvslotten) direkt vid dödsfallet, utan att vänta på att styvföräldern också dör. Det kan skapa ekonomisk press om bostad eller kapital är bundet. Planera detta tidigt.', 'Non-mutual children are legally protected—they can claim their legal portion (half the inheritance share) immediately upon death, without waiting for the step-parent to pass. This can create financial pressure if housing or capital is tied up. Plan ahead.')} />

      {/* Intro info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">{t('Vad är särkullbarn?', 'What are non-mutual children?')}</p>
            <p className="text-sm text-primary/70 mt-1">
              {t('Särkullbarn är barn från tidigare relationer i en ny familj. De har samma arvsrätt som andra barn, men med en viktig skillnad: de kan kräva ut sin laglott omedelbar utan att behöva vänta på den återstående makens eller makans död.', 'Non-mutual children are children from previous relationships in a new family. They have the same inheritance rights as other children, but with an important difference: they can claim their legal portion immediately without waiting for the surviving spouse to pass away.')}
            </p>
          </div>
        </div>
      </div>

      {/* Key rights section */}
      <div className="card mb-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Baby className="w-5 h-5 text-accent" />
          <h2 className="font-display text-primary">Särkullbarns speciella rättigheter</h2>
        </div>

        <div className="space-y-4">
          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">{t('1. Rätt till omedelbar utbetalning', '1. Right to immediate payment')}</p>
            <p className="text-sm text-primary/70">
              {t('Till skillnad från andra barn kan särkullbarn kräva att få sin laglott utbetald direkt från dödsboet, utan att behöva vänta på den efterlevande makens eller makans bortgång.', 'Unlike other children, non-mutual children can demand their legal portion be paid immediately from the estate, without waiting for the surviving spouse to pass away.')}
            </p>
          </div>

          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">{t('2. Laglott är ett säkrat belopp', '2. Legal portion is a protected amount')}</p>
            <p className="text-sm text-primary/70">
              {t('Laglotten är hälften av arvslotten och kan inte tas bort genom testamente. Detta är ett viktigt skydd för särkullbarn.', 'The legal portion is half the inheritance share and cannot be removed by will. This is important protection for non-mutual children.')}
            </p>
          </div>

          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">{t('3. Frivillig avstäelse möjlig', '3. Voluntary waiver possible')}</p>
            <p className="text-sm text-primary/70">
              {t('Särkullbarn kan frivilligt välja att inte ta ut sin laglott omedelbar för att stödja den efterlevande maken eller makan, men detta måste göras skriftligt.', 'Non-mutual children can voluntarily choose not to claim their legal portion immediately to support the surviving spouse, but this must be done in writing.')}
            </p>
          </div>
        </div>
      </div>

      {/* Warning about laglott calculation */}
      <div className="warning-box mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warn text-sm mb-1">Laglotten är hälften av arvslotten</p>
            <p className="text-sm text-primary/70">
              Många förväxlar laglott med arvslott. Om det finns 100 000 kr att dela mellan två arvingar är arvslotten
              50 000 kr var, men laglotten är bara 25 000 kr. Detta är viktigt att förstå vid beräkningen av vad
              särkullbarnet har rätt till.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="mb-6">
        <h2 className="font-display text-primary mb-3 text-sm">Praktiska steg för särkullbarn</h2>
        <div className="space-y-3">
          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Förstå arvsordningen</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Be någon från dödsboet förklara hur många som ärver och hur stor din andel blir.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Beräkna din laglott</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Laglotten = (dödsboets värde ÷ antal arvingar) ÷ 2. Fråga dödsboets skiftesman om du är osäker.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Besluta om du vill ha pengarna nu</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Du kan kräva utbetalning direkt eller frivilligt välja att låta pengarna stanna för den återstående makens/makans räkning.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Meddela ditt beslut skriftligt</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Berätta för dödsboets skiftesman eller de andra arvingarna vad du vill göra. Gör det skriftligt för dokumentering.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Godkänn arvskifteshandlingen</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Alla arvingar, inklusive särkullbarn, måste underteckna arvskifteshandlingen för att arvskiftet är giltigt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips section */}
      <div className="card mb-6">
        <h3 className="font-display text-primary mb-3 text-sm">Tips för särkullbarn</h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Be om en klar skriftlig redovisning av dödsboets värde och din beräknade andel.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Om du är ung eller omyndig kan din förälder göra ärenden på dina vägnar.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Spara alla brev och mötes-anteckningar från dödsboet för din dokumentation.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Du kan be att få en oberoende juridisk granskning om du misstänker något är fel.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Tala med båda dina föräldrar om du är osäker på vad som är rätt.</span>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-6">
        <h2 className="font-display text-primary mb-3 text-sm">Vanliga frågor</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              className="card text-left w-full"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-primary text-sm pr-3">{item.question}</p>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>
              {expandedFAQ === index && (
                <div className="mt-3 pt-3 border-t border-[#E8E4DE]">
                  <p className="text-sm text-primary/70">{item.answer}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTA to legal help */}
      <Link href="/juridisk-hjalp" className="btn-primary flex items-center justify-center gap-2 mb-6">
        Juridisk hjälp
        <ChevronRight className="w-5 h-5" />
      </Link>

      {/* Legal disclaimer */}
      <div className="bg-primary-lighter/30 rounded-2xl p-4 mb-4">
        <p className="text-xs text-muted leading-relaxed">
          Denna information är allmän vägledning baserad på ärvdabalken. Särkullbarns rättigheter kan vara komplexa
          och varierar beroende på testamente, familjesituation och andra faktorer. För bindande juridisk rådgivning
          och specifika frågor om ditt enskilda fall, kontakta en jurist eller skiftesman.
        </p>
      </div>

      </div>
    </div>
  );
}
