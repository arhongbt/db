'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  FileDown,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Landmark,
  Calculator,
  Shield,
  Heart,
} from 'lucide-react';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#E8F0E8' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

interface ProcessStep {
  id: string;
  icon: React.ElementType;
  title: string;
  titleEn: string;
  items: { label: string; labelEn: string; status: 'done' | 'pending' | 'na'; href: string }[];
}

function SammanfattningContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [generating, setGenerating] = useState(false);

  // Hämta uppgiftsstatus från localStorage
  const getTaskStatus = (key: string): 'done' | 'pending' | 'na' => {
    if (typeof window === 'undefined') return 'pending';
    const tasks = JSON.parse(localStorage.getItem('sr_tasks') || '[]');
    const task = tasks.find((t: any) => t.id === key || t.title?.includes(key));
    if (task?.status === 'done') return 'done';
    return 'pending';
  };

  const PROCESS_STEPS: ProcessStep[] = [
    {
      id: 'akut',
      icon: AlertTriangle,
      title: 'Akuta åtgärder (Dag 1-7)',
      titleEn: 'Emergency Steps (Day 1-7)',
      items: [
        { label: 'Dödsbevis inhämtat', labelEn: 'Death certificate obtained', status: getTaskStatus('dödsbevis'), href: '/nodbroms' },
        { label: 'Banken kontaktad', labelEn: 'Bank notified', status: getTaskStatus('bank'), href: '/bankbrev' },
        { label: 'Försäkringar kontrollerade', labelEn: 'Insurance checked', status: getTaskStatus('försäkring'), href: '/forsakringar' },
        { label: 'Begravning planerad', labelEn: 'Funeral planned', status: getTaskStatus('begravning'), href: '/begravningsplanering' },
      ],
    },
    {
      id: 'kartlaggning',
      icon: Calculator,
      title: 'Kartläggning',
      titleEn: 'Inventory',
      items: [
        { label: 'Tillgångar inventerade', labelEn: 'Assets inventoried', status: getTaskStatus('tillgångar'), href: '/tillgangar' },
        { label: 'Skulder kartlagda', labelEn: 'Debts mapped', status: getTaskStatus('skulder'), href: '/dodsbo-skulder' },
        { label: 'Lösöre värderat', labelEn: 'Property valued', status: getTaskStatus('lösöre'), href: '/vardering' },
        { label: 'Försäkringar genomgångna', labelEn: 'Insurance reviewed', status: getTaskStatus('försäkringar'), href: '/forsakringar' },
        { label: 'Digitala tillgångar hanterade', labelEn: 'Digital assets handled', status: getTaskStatus('digitala'), href: '/digitala-tillgangar' },
      ],
    },
    {
      id: 'bouppteckning',
      icon: FileText,
      title: 'Bouppteckning',
      titleEn: 'Estate Inventory',
      items: [
        { label: 'Kallelse skickad', labelEn: 'Summons sent', status: getTaskStatus('kallelse'), href: '/kallelse' },
        { label: 'Bouppteckning genomförd', labelEn: 'Inventory completed', status: getTaskStatus('bouppteckning'), href: '/bouppteckning' },
        { label: 'Registrerad hos Skatteverket', labelEn: 'Registered with Tax Agency', status: getTaskStatus('skatteverket'), href: '/skatteverket-guide' },
      ],
    },
    {
      id: 'arvskifte',
      icon: Users,
      title: 'Arvskifte',
      titleEn: 'Inheritance Distribution',
      items: [
        { label: 'Arvskifteshandling upprättad', labelEn: 'Distribution agreement drafted', status: getTaskStatus('arvskifte'), href: '/arvskifteshandling' },
        { label: 'Alla delägare överens', labelEn: 'All heirs agree', status: getTaskStatus('överens'), href: '/samarbete' },
        { label: 'Arv fördelat', labelEn: 'Inheritance distributed', status: getTaskStatus('fördelat'), href: '/arvskifte' },
      ],
    },
    {
      id: 'avslut',
      icon: Shield,
      title: 'Avslut',
      titleEn: 'Closing',
      items: [
        { label: 'Konton avslutade', labelEn: 'Accounts closed', status: getTaskStatus('avsluta'), href: '/avsluta-konton' },
        { label: 'Deklaration inlämnad', labelEn: 'Tax return filed', status: getTaskStatus('deklaration'), href: '/deklarera-dodsbo' },
        { label: 'Dödsboet avslutat', labelEn: 'Estate closed', status: getTaskStatus('avslutat'), href: '/dashboard' },
      ],
    },
  ];

  const totalItems = PROCESS_STEPS.flatMap(s => s.items).length;
  const doneItems = PROCESS_STEPS.flatMap(s => s.items).filter(i => i.status === 'done').length;
  const progressPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const addPage = () => {
        doc.addPage();
        y = 20;
      };

      const checkPageBreak = (needed: number) => {
        if (y + needed > 270) addPage();
      };

      // Header
      doc.setFillColor(107, 127, 94);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Sista Resan — Sammanfattning', margin, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dödsbo: ${state.deceasedName || 'Ej angivet'}`, margin, 23);
      doc.text(`Genererad: ${new Date().toLocaleDateString('sv-SE')}`, margin, 29);
      y = 45;

      // Progress
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Framsteg: ${progressPct}% klart (${doneItems}/${totalItems} steg)`, margin, y);
      y += 5;
      doc.setFillColor(232, 228, 222);
      doc.roundedRect(margin, y, contentWidth, 4, 2, 2, 'F');
      if (progressPct > 0) {
        doc.setFillColor(107, 127, 94);
        doc.roundedRect(margin, y, contentWidth * (progressPct / 100), 4, 2, 2, 'F');
      }
      y += 15;

      // Deceased info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Uppgifter om den avlidne', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const info = [
        ['Namn', state.deceasedName || 'Ej angivet'],
        ['Personnummer', state.deceasedPersonnummer || 'Ej angivet'],
        ['Dödsdatum', state.deathDate || 'Ej angivet'],
        ['Familjesituation', state.onboarding?.familySituation || 'Ej angivet'],
        ['Boendeform', state.onboarding?.housingType || 'Ej angivet'],
      ];
      info.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 40, y);
        y += 6;
      });
      y += 8;

      // Process steps
      PROCESS_STEPS.forEach((step) => {
        checkPageBreak(40);
        doc.setFillColor(238, 242, 234);
        doc.roundedRect(margin, y - 3, contentWidth, 9, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 97, 69);
        doc.text(step.title, margin + 3, y + 3);
        y += 12;
        doc.setTextColor(0, 0, 0);

        step.items.forEach((item) => {
          checkPageBreak(8);
          doc.setFontSize(10);
          const icon = item.status === 'done' ? '✓' : '○';
          const color = item.status === 'done' ? [107, 127, 94] : [150, 150, 150];
          doc.setTextColor(color[0], color[1], color[2]);
          doc.text(`  ${icon}  ${item.label}`, margin + 2, y);
          y += 7;
        });
        y += 5;
      });

      // Footer
      checkPageBreak(20);
      doc.setDrawColor(232, 228, 222);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text('Genererad av Sista Resan — sistaresan.se', margin, y);
      doc.text('OBS: Detta är en sammanfattning, inte ett juridiskt dokument.', margin, y + 4);

      doc.save(`dodsbo-sammanfattning-${state.deceasedName || 'dokument'}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
    setGenerating(false);
  };

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E8F0E8' }}>
          <FileDown className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">{t('Sammanfattning', 'Summary')}</h1>
          <p className="text-xs text-muted">{t('Översikt och PDF-export', 'Overview and PDF export')}</p>
        </div>
      </div>

      <MikeRossTip text={t(
        'Här ser du en komplett översikt av hela dödsboprocessen. Du kan ladda ner allt som en PDF att skriva ut eller dela med andra delägare.',
        'Here you can see a complete overview of the entire estate process. You can download everything as a PDF to print or share with other heirs.'
      )} />

      {/* Progress bar */}
      <div className="card mb-5 animate-fadeIn">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-primary">{t('Total framsteg', 'Total progress')}</p>
          <p className="text-lg font-bold text-accent">{progressPct}%</p>
        </div>
        <div className="h-3 bg-[#E8E4DE] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
          />
        </div>
        <p className="text-xs text-muted mt-2">{doneItems} {t('av', 'of')} {totalItems} {t('steg klara', 'steps completed')}</p>
      </div>

      {/* Download button */}
      <button
        onClick={handleGeneratePDF}
        disabled={generating}
        className="btn-primary flex items-center justify-center gap-2 mb-6 press-effect"
      >
        <FileDown className="w-5 h-5" />
        {generating
          ? t('Genererar PDF...', 'Generating PDF...')
          : t('Ladda ner som PDF', 'Download as PDF')}
      </button>

      {/* Process steps */}
      <div className="space-y-4 stagger-children">
        {PROCESS_STEPS.map((step) => {
          const stepDone = step.items.filter(i => i.status === 'done').length;
          const stepTotal = step.items.length;
          const stepPct = stepTotal > 0 ? Math.round((stepDone / stepTotal) * 100) : 0;

          return (
            <div key={step.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E8F0E8' }}>
                  <step.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">{t(step.title, step.titleEn)}</p>
                  <p className="text-[11px] text-muted">{stepDone}/{stepTotal} — {stepPct}%</p>
                </div>
              </div>

              <div className="space-y-2">
                {step.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2.5 py-1.5 group"
                  >
                    {item.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted shrink-0" />
                    )}
                    <span className={`text-sm ${item.status === 'done' ? 'text-muted line-through' : 'text-primary group-hover:text-accent'} transition-colors`}>
                      {t(item.label, item.labelEn)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="info-box mt-6">
        <p className="text-sm text-primary/70">
          {t(
            'Tips: Ladda ner PDF:en regelbundet och dela med andra delägare så alla har koll på var i processen ni befinner er.',
            'Tip: Download the PDF regularly and share with other heirs so everyone knows where in the process you are.'
          )}
        </p>
      </div>

    </div>
  );
}

export default function SammanfattningPage() {
  return (
    <DodsboProvider>
      <SammanfattningContent />
    </DodsboProvider>
  );
}
