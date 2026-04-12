'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.tasks': 'Att göra',
    'nav.economy': 'Ekonomi',
    'nav.documents': 'Dokument',
    'nav.more': 'Mer',
    'nav.all_tools': 'Alla verktyg',

    // Common buttons
    'btn.save': 'Spara',
    'btn.next': 'Nästa',
    'btn.back': 'Tillbaka',
    'btn.cancel': 'Avbryt',
    'btn.delete': 'Radera',
    'btn.edit': 'Redigera',
    'btn.close': 'Stäng',
    'btn.add': 'Lägg till',
    'btn.remove': 'Ta bort',
    'btn.print': 'Skriv ut',
    'btn.export': 'Exportera',
    'btn.download': 'Ladda ner',
    'btn.search': 'Sök',
    'btn.filter': 'Filtrera',

    // Settings
    'settings.title': 'Inställningar',
    'settings.accessibility': 'Tillgänglighet',
    'settings.text_size': 'Textstorlek',
    'settings.text_size.normal': 'Normal',
    'settings.text_size.large': 'Stor',
    'settings.text_size.xlarge': 'Mycket stor',
    'settings.high_contrast': 'Högt kontrast',
    'settings.language': 'Språk / Language',
    'settings.swedish': 'Svenska',
    'settings.english': 'English',
    'settings.notifications': 'Påminnelser',
    'settings.notifications.push': 'Push-notiser för tidsfrister',
    'settings.logout': 'Logga ut',
    'settings.edit_info': 'Redigera uppgifter',
    'settings.data_export': 'Exportera data',
    'settings.help_info': 'Hjälp & information',
    'settings.important_contacts': 'Viktiga kontakter',
    'settings.about': 'Om appen',
    'settings.legal': 'Juridik',
    'settings.account': 'Konto',
    'settings.delete_data': 'Radera all data och börja om',
    'settings.reset_confirm': 'Är du säker?',
    'settings.reset_desc': 'All data raderas permanent — dödsbodelägare, tillgångar, skulder, försäkringar och uppgifter.',
    'settings.delete_all': 'Radera allt',

    // Dashboard
    'dashboard.welcome_back': 'Välkommen tillbaka',
    'dashboard.greeting': 'Ditt dödsbo',
    'dashboard.verify_bankid': 'Verifiera med BankID',
    'dashboard.verify_bankid_required': 'Krävs för juridiska tjänster',
    'dashboard.bankid_verified': 'BankID-verifierad',
    'dashboard.bankid_verified_desc': 'Du kan nu använda juridiska tjänster',
    'dashboard.current_phase': 'Du är i fasen',
    'dashboard.completed': 'klart',
    'dashboard.day': 'Dag',
    'dashboard.take_your_time': 'ta det i din takt',
    'dashboard.emergency_brake': 'Nödbroms — dag 1-7',
    'dashboard.emergency_brake_desc': 'Steg-för-steg guide för de första dagarna',
    'dashboard.debts_info': 'Viktigt: Du ärver INTE skulder',
    'dashboard.debts_desc': 'Dödsboets skulder betalas med dödsboets tillgångar. Om skulderna är större försvinner de — du behöver inte betala.',
    'dashboard.statistics': 'Snabbstatistik',
    'dashboard.co_owners': 'Dödsbodelägare',
    'dashboard.upcoming_deadlines': 'Kommande tidsfrister',
    'dashboard.do_this_first': 'Gör detta först',
    'dashboard.upcoming_deadlines_section': 'Kommande tidsfrister',
    'dashboard.days_left': 'dagar kvar',
    'dashboard.missed_deadlines': 'tidsfrist(er) har passerat',
    'dashboard.missed_deadlines_desc': 'Det kan fortfarande gå att ordna. Kontrollera varje punkt.',
    'dashboard.ask_mike_ross': 'Fråga Mike Ross',
    'dashboard.mike_ross_desc': 'Din juridiska AI-assistent',
    'dashboard.enable_notifications': 'Aktivera påminnelser',
    'dashboard.enable_notifications_desc': 'Få notiser innan viktiga tidsfrister',
    'dashboard.turn_on': 'Slå på',
    'dashboard.notifications_active': 'Påminnelser aktiva — du notifieras 7, 3 och 1 dag innan frister',
    'dashboard.bankbrev_ready': 'Bankbrev redo',
    'dashboard.bankbrev_ready_desc': 'bankbrev har genererats automatiskt',
    'dashboard.create_documents': 'Skapa dokument',
    'dashboard.simple_dodsbo': 'Ditt dödsbo verkar enkelt',
    'dashboard.simple_dodsbo_desc': 'Du kan troligen göra en dödsboanmälan istället för full bouppteckning.',
    'dashboard.tools_guides': 'Verktyg & guider',
    'dashboard.estate_inventory': 'Bouppteckning',
    'dashboard.will': 'Testamente',
    'dashboard.distribution': 'Arvskifte',
    'dashboard.death_report': 'Dödsboanmälan',
    'dashboard.bank_letter': 'Bankbrev',
    'dashboard.death_notice': 'Dödsannons',
    'dashboard.funeral': 'Begravning',
    'dashboard.tax_agency': 'Skatteverket',
    'dashboard.memorial': 'Minnesida',
    'dashboard.collaboration': 'Samarbete',
    'dashboard.export': 'Exportera',
    'dashboard.legal_disclaimer': 'Denna app ger allmän vägledning och ersätter inte juridisk rådgivning. Kontakta alltid en jurist vid osäkerhet.',

    // Estate terms
    'estate.estate': 'Dödsbo',
    'estate.inventory': 'Bouppteckning',
    'estate.distribution': 'Arvskifte',
    'estate.co_owner': 'Delägare',
    'estate.assets': 'Tillgångar',
    'estate.debts': 'Skulder',
    'estate.property': 'Fastighet',
    'estate.will': 'Testamente',
    'estate.deceased': 'Avliden',
    'estate.inheritance': 'Arv',
    'estate.heir': 'Arvinge',
    'estate.death_date': 'Dödsdatum',
    'estate.death_certificate': 'Dödsbevis',

    // Phase labels
    'phase.acute': 'Nödbroms (dag 1–7)',
    'phase.mapping': 'Kartläggning (vecka 1–4)',
    'phase.inventory': 'Bouppteckning (månad 1–3)',
    'phase.distribution': 'Arvskifte (månad 3–6)',
    'phase.completed': 'Avslutat',

    // Legal terms
    'legal.inheritance_law': 'Ärvdabalken',
    'legal.intestate': 'Intestat arv',
    'legal.forced_share': 'Tvingande arvsrätt',
    'legal.legal_share': 'Laglott',
    'legal.inheritance_share': 'Arvslott',
    'legal.executor': 'Boutredningsman',
    'legal.cohabitation_law': 'Sambolagen',
    'legal.estate_declaration': 'Dödsboanmälan',
    'legal.estate_inventory_report': 'Bouppteckningshandling',
    'legal.power_of_attorney': 'Fullmakt',
    'legal.personal_estate_share': 'Särkullbarn',
    'legal.cohabitation_inheritance': 'Sambo & arv',

    // Common UI
    'ui.loading': 'Laddar...',
    'ui.error': 'Ett fel uppstod',
    'ui.success': 'Klart!',
    'ui.no_data': 'Ingen data',
    'ui.back': 'Tillbaka',
    'ui.close': 'Stäng',
    'ui.confirm': 'Bekräfta',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tasks': 'Tasks',
    'nav.economy': 'Economy',
    'nav.documents': 'Documents',
    'nav.more': 'More',
    'nav.all_tools': 'All tools',

    // Common buttons
    'btn.save': 'Save',
    'btn.next': 'Next',
    'btn.back': 'Back',
    'btn.cancel': 'Cancel',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.close': 'Close',
    'btn.add': 'Add',
    'btn.remove': 'Remove',
    'btn.print': 'Print',
    'btn.export': 'Export',
    'btn.download': 'Download',
    'btn.search': 'Search',
    'btn.filter': 'Filter',

    // Settings
    'settings.title': 'Settings',
    'settings.accessibility': 'Accessibility',
    'settings.text_size': 'Text size',
    'settings.text_size.normal': 'Normal',
    'settings.text_size.large': 'Large',
    'settings.text_size.xlarge': 'Extra large',
    'settings.high_contrast': 'High contrast',
    'settings.language': 'Language / Språk',
    'settings.swedish': 'Svenska',
    'settings.english': 'English',
    'settings.notifications': 'Notifications',
    'settings.notifications.push': 'Push notifications for deadlines',
    'settings.logout': 'Log out',
    'settings.edit_info': 'Edit information',
    'settings.data_export': 'Export data',
    'settings.help_info': 'Help & information',
    'settings.important_contacts': 'Important contacts',
    'settings.about': 'About the app',
    'settings.legal': 'Legal',
    'settings.account': 'Account',
    'settings.delete_data': 'Delete all data and start over',
    'settings.reset_confirm': 'Are you sure?',
    'settings.reset_desc': 'All data will be permanently deleted — co-owners, assets, debts, insurance, and tasks.',
    'settings.delete_all': 'Delete everything',

    // Dashboard
    'dashboard.welcome_back': 'Welcome back',
    'dashboard.greeting': 'Your estate',
    'dashboard.verify_bankid': 'Verify with BankID',
    'dashboard.verify_bankid_required': 'Required for legal services',
    'dashboard.bankid_verified': 'BankID verified',
    'dashboard.bankid_verified_desc': 'You can now use legal services',
    'dashboard.current_phase': 'You are in the',
    'dashboard.completed': 'complete',
    'dashboard.day': 'Day',
    'dashboard.take_your_time': 'take your time',
    'dashboard.emergency_brake': 'Emergency brake — days 1-7',
    'dashboard.emergency_brake_desc': 'Step-by-step guide for the first days',
    'dashboard.debts_info': 'Important: You do NOT inherit debts',
    'dashboard.debts_desc': 'The estate&apos;s debts are paid from the estate&apos;s assets. If debts are larger, they disappear — you do not need to pay.',
    'dashboard.statistics': 'Quick stats',
    'dashboard.co_owners': 'Co-owners',
    'dashboard.upcoming_deadlines': 'Upcoming deadlines',
    'dashboard.do_this_first': 'Do this first',
    'dashboard.upcoming_deadlines_section': 'Upcoming deadlines',
    'dashboard.days_left': 'days left',
    'dashboard.missed_deadlines': 'deadline(s) have passed',
    'dashboard.missed_deadlines_desc': 'It may still be possible to arrange. Check each point.',
    'dashboard.ask_mike_ross': 'Ask Mike Ross',
    'dashboard.mike_ross_desc': 'Your legal AI assistant',
    'dashboard.enable_notifications': 'Enable notifications',
    'dashboard.enable_notifications_desc': 'Get notified before important deadlines',
    'dashboard.turn_on': 'Turn on',
    'dashboard.notifications_active': 'Notifications active — you will be notified 7, 3, and 1 day before deadlines',
    'dashboard.bankbrev_ready': 'Bank letters ready',
    'dashboard.bankbrev_ready_desc': 'bank letters have been generated automatically',
    'dashboard.create_documents': 'Create documents',
    'dashboard.simple_dodsbo': 'Your estate seems simple',
    'dashboard.simple_dodsbo_desc': 'You can likely do a death report instead of a full inventory.',
    'dashboard.tools_guides': 'Tools & guides',
    'dashboard.estate_inventory': 'Estate inventory',
    'dashboard.will': 'Will',
    'dashboard.distribution': 'Distribution',
    'dashboard.death_report': 'Death report',
    'dashboard.bank_letter': 'Bank letter',
    'dashboard.death_notice': 'Death notice',
    'dashboard.funeral': 'Funeral',
    'dashboard.tax_agency': 'Tax agency',
    'dashboard.memorial': 'Memorial',
    'dashboard.collaboration': 'Collaboration',
    'dashboard.export': 'Export',
    'dashboard.legal_disclaimer': 'This app provides general guidance and does not replace legal advice. Always consult a lawyer if unsure.',

    // Estate terms
    'estate.estate': 'Estate',
    'estate.inventory': 'Estate inventory',
    'estate.distribution': 'Distribution',
    'estate.co_owner': 'Co-owner',
    'estate.assets': 'Assets',
    'estate.debts': 'Debts',
    'estate.property': 'Property',
    'estate.will': 'Will',
    'estate.deceased': 'Deceased',
    'estate.inheritance': 'Inheritance',
    'estate.heir': 'Heir',
    'estate.death_date': 'Date of death',
    'estate.death_certificate': 'Death certificate',

    // Phase labels
    'phase.acute': 'Emergency brake (days 1–7)',
    'phase.mapping': 'Mapping (weeks 1–4)',
    'phase.inventory': 'Inventory (months 1–3)',
    'phase.distribution': 'Distribution (months 3–6)',
    'phase.completed': 'Completed',

    // Legal terms
    'legal.inheritance_law': 'Inheritance law',
    'legal.intestate': 'Intestate inheritance',
    'legal.forced_share': 'Forced inheritance rights',
    'legal.legal_share': 'Legal share',
    'legal.inheritance_share': 'Inheritance share',
    'legal.executor': 'Estate administrator',
    'legal.cohabitation_law': 'Cohabitation law',
    'legal.estate_declaration': 'Estate declaration',
    'legal.estate_inventory_report': 'Estate inventory report',
    'legal.power_of_attorney': 'Power of attorney',
    'legal.personal_estate_share': 'Personal estate share',
    'legal.cohabitation_inheritance': 'Cohabitation & inheritance',

    // Common UI
    'ui.loading': 'Loading...',
    'ui.error': 'An error occurred',
    'ui.success': 'Done!',
    'ui.no_data': 'No data',
    'ui.back': 'Back',
    'ui.close': 'Close',
    'ui.confirm': 'Confirm',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('sv');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sr_language') as Language | null;
      if (stored && (stored === 'sv' || stored === 'en')) {
        setLanguageState(stored);
      }
      setMounted(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sr_language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['sv'][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Default fallback so pages work during static export (no provider yet)
const defaultContext: LanguageContextType = {
  language: 'sv',
  setLanguage: () => {},
  t: (key: string) => translations['sv'][key] || key,
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context ?? defaultContext;
}
