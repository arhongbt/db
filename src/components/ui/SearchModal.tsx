"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight, FileText, Calculator, BookOpen, Users, Shield, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface SearchItem {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  href: string;
  icon: React.ElementType;
  category: string;
  keywords: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  // Dokument
  { title: "Bouppteckning", titleEn: "Estate Inventory", description: "Skapa och hantera bouppteckning", descriptionEn: "Create and manage estate inventory", href: "/bouppteckning", icon: FileText, category: "Dokument", keywords: ["bouppteckning","estate","inventory","skatteverket","dödsbo"] },
  { title: "Arvskifte", titleEn: "Inheritance Distribution", description: "Fördela arvet mellan delägare", descriptionEn: "Distribute inheritance among heirs", href: "/arvskifte", icon: FileText, category: "Dokument", keywords: ["arv","skifte","fördela","inheritance"] },
  { title: "Arvskifteshandling", titleEn: "Distribution Agreement", description: "Generera arvskifteshandling som PDF/Word", descriptionEn: "Generate distribution agreement as PDF/Word", href: "/arvskifteshandling", icon: FileText, category: "Dokument", keywords: ["arvskifte","handling","dokument","pdf","word"] },
  { title: "Testamente", titleEn: "Will", description: "Hantera och granska testamente", descriptionEn: "Manage and review wills", href: "/testamente", icon: FileText, category: "Dokument", keywords: ["testamente","will","arv","villkor"] },
  { title: "Fullmakt", titleEn: "Power of Attorney", description: "Skapa fullmakter och brev", descriptionEn: "Create power of attorney documents", href: "/fullmakt", icon: FileText, category: "Dokument", keywords: ["fullmakt","power","attorney","brev","mall"] },
  { title: "Bankbrev", titleEn: "Bank Letters", description: "Skicka dödsfallsanmälan till banker", descriptionEn: "Send death notifications to banks", href: "/bankbrev", icon: FileText, category: "Dokument", keywords: ["bank","brev","dödsfallsanmälan","notification"] },
  { title: "Dödsannons", titleEn: "Obituary", description: "Skapa dödsannons", descriptionEn: "Create obituary", href: "/dodsannons", icon: Heart, category: "Dokument", keywords: ["dödsannons","obituary","annons","tidning"] },
  { title: "Kallelse", titleEn: "Meeting Summons", description: "Bjud in delägare till möte", descriptionEn: "Invite heirs to meeting", href: "/kallelse", icon: FileText, category: "Dokument", keywords: ["kallelse","möte","inbjudan","summons"] },
  { title: "Dödsboanmälan", titleEn: "Estate Notification", description: "Förenklad anmälan istället för bouppteckning", descriptionEn: "Simplified notification instead of inventory", href: "/dodsboanmalan", icon: FileText, category: "Dokument", keywords: ["dödsboanmälan","förenklad","anmälan"] },
  { title: "Bodelning", titleEn: "Property Division", description: "Dela gemensam egendom", descriptionEn: "Divide shared property", href: "/bodelning", icon: FileText, category: "Dokument", keywords: ["bodelning","dela","egendom","property"] },

  // Verktyg
  { title: "Arvskalkylator", titleEn: "Inheritance Calculator", description: "Beräkna arvsandelar", descriptionEn: "Calculate inheritance shares", href: "/arvskalkylator", icon: Calculator, category: "Verktyg", keywords: ["kalkylator","beräkna","arv","calculator","procent"] },
  { title: "Tillgångar", titleEn: "Assets", description: "Inventera tillgångar", descriptionEn: "Inventory assets", href: "/tillgangar", icon: Calculator, category: "Verktyg", keywords: ["tillgångar","assets","bank","fastighet","bil"] },
  { title: "Lösöre", titleEn: "Personal Property", description: "Hantera lösöre och värdesaker", descriptionEn: "Manage personal property", href: "/losore", icon: Calculator, category: "Verktyg", keywords: ["lösöre","möbler","smycken","konst","värdering"] },
  { title: "Kostnader", titleEn: "Expenses", description: "Spåra dödsbo-kostnader", descriptionEn: "Track estate expenses", href: "/kostnader", icon: Calculator, category: "Verktyg", keywords: ["kostnader","utgifter","begravning","expenses"] },
  { title: "Tidslinje", titleEn: "Timeline", description: "Se processen steg för steg", descriptionEn: "View the process step by step", href: "/tidslinje", icon: Clock, category: "Verktyg", keywords: ["tidslinje","timeline","process","steg","fas"] },
  { title: "Checklistor", titleEn: "Checklists", description: "Utskrivbara checklistor", descriptionEn: "Printable checklists", href: "/checklistor", icon: FileText, category: "Verktyg", keywords: ["checklista","todo","uppgifter","checklist"] },
  { title: "Skanner", titleEn: "Scanner", description: "Skanna och digitalisera dokument", descriptionEn: "Scan and digitize documents", href: "/skanner", icon: FileText, category: "Verktyg", keywords: ["skanna","ocr","dokument","scanner","foto"] },
  { title: "Exportera", titleEn: "Export", description: "Exportera all data som ZIP", descriptionEn: "Export all data as ZIP", href: "/exportera", icon: FileText, category: "Verktyg", keywords: ["exportera","zip","backup","csv","json"] },
  { title: "Begravningsplanering", titleEn: "Funeral Planning", description: "Planera begravning", descriptionEn: "Plan funeral", href: "/begravningsplanering", icon: Heart, category: "Verktyg", keywords: ["begravning","funeral","ceremoni","kyrka"] },
  { title: "Minnessida", titleEn: "Memorial Page", description: "Skapa en minnesplats", descriptionEn: "Create a memorial", href: "/minnessida", icon: Heart, category: "Verktyg", keywords: ["minne","memorial","hyllning"] },
  { title: "Påminnelser", titleEn: "Reminders", description: "Sätt deadlines och påminnelser", descriptionEn: "Set deadlines and reminders", href: "/paminelser", icon: Clock, category: "Verktyg", keywords: ["påminnelse","deadline","reminder","datum"] },

  // Guider
  { title: "Nödbroms", titleEn: "Emergency Steps", description: "Första dagarna — vad göra nu?", descriptionEn: "First days — what to do now?", href: "/nodbroms", icon: Shield, category: "Guide", keywords: ["nödbroms","akut","dag 1","emergency","first"] },
  { title: "Bankguide", titleEn: "Bank Guide", description: "Guide per bank (Swedbank, SEB...)", descriptionEn: "Guide per bank", href: "/bank-guide", icon: BookOpen, category: "Guide", keywords: ["bank","swedbank","seb","handelsbanken","nordea"] },
  { title: "Avsluta konton", titleEn: "Close Accounts", description: "Stäng konton och abonnemang", descriptionEn: "Close accounts and subscriptions", href: "/avsluta-konton", icon: BookOpen, category: "Guide", keywords: ["avsluta","konto","abonnemang","close","subscription"] },
  { title: "Skatteverket", titleEn: "Tax Agency Guide", description: "Guide till Skatteverket", descriptionEn: "Tax agency guide", href: "/skatteverket-guide", icon: BookOpen, category: "Guide", keywords: ["skatteverket","skatt","tax","deklaration"] },
  { title: "Deklarera dödsbo", titleEn: "File Estate Taxes", description: "Skattedeklaration för dödsbo", descriptionEn: "Tax return for estate", href: "/deklarera-dodsbo", icon: BookOpen, category: "Guide", keywords: ["deklarera","skatt","deklaration","tax"] },
  { title: "Försäkringar", titleEn: "Insurance", description: "Kontrollera försäkringar", descriptionEn: "Check insurance policies", href: "/forsakringar", icon: Shield, category: "Guide", keywords: ["försäkring","insurance","liv","pension"] },
  { title: "Sambo-arv", titleEn: "Cohabiting Partner Rights", description: "Sambos rättigheter vid dödsfall", descriptionEn: "Cohabiting partner inheritance rights", href: "/sambo-arv", icon: BookOpen, category: "Guide", keywords: ["sambo","sambor","rättigheter","cohabiting"] },
  { title: "Särkullbarn", titleEn: "Non-mutual Children", description: "Särkullbarns arvsrätt", descriptionEn: "Non-mutual children's rights", href: "/sarkullbarn", icon: BookOpen, category: "Guide", keywords: ["särkullbarn","barn","arvsrätt","children"] },
  { title: "Konflikthantering", titleEn: "Conflict Resolution", description: "Lösa konflikter mellan delägare", descriptionEn: "Resolve conflicts between heirs", href: "/konflikt", icon: Users, category: "Guide", keywords: ["konflikt","bråk","medling","conflict"] },
  { title: "Internationellt arv", titleEn: "International Inheritance", description: "Arv med internationell koppling", descriptionEn: "International inheritance rules", href: "/internationellt", icon: BookOpen, category: "Guide", keywords: ["internationellt","utland","eu","international"] },
  { title: "Krypto-guide", titleEn: "Crypto Guide", description: "Hantera kryptovalutor i dödsbo", descriptionEn: "Handle cryptocurrency in estate", href: "/krypto-guide", icon: BookOpen, category: "Guide", keywords: ["krypto","bitcoin","crypto","wallet"] },
  { title: "Digitala tillgångar", titleEn: "Digital Assets", description: "Konton, sociala medier, moln", descriptionEn: "Accounts, social media, cloud", href: "/digitala-tillgangar", icon: BookOpen, category: "Guide", keywords: ["digital","sociala medier","konto","cloud"] },
  { title: "Dödsbo-skulder", titleEn: "Estate Debts", description: "Skulder och ansvar", descriptionEn: "Debts and liability", href: "/dodsbo-skulder", icon: BookOpen, category: "Guide", keywords: ["skulder","lån","ansvar","debts"] },
  { title: "Ordlista", titleEn: "Glossary", description: "Juridiska termer förklarade", descriptionEn: "Legal terms explained", href: "/ordlista", icon: BookOpen, category: "Guide", keywords: ["ordlista","glossary","term","juridisk","förklaring"] },
  { title: "FAQ", titleEn: "FAQ", description: "Vanliga frågor och svar", descriptionEn: "Frequently asked questions", href: "/faq", icon: BookOpen, category: "Guide", keywords: ["faq","frågor","svar","vanliga"] },
  { title: "Juridisk hjälp", titleEn: "Legal Help", description: "AI-juridisk rådgivning", descriptionEn: "AI legal advice", href: "/juridisk-hjalp", icon: Shield, category: "Guide", keywords: ["juridisk","hjälp","advokat","legal","ai"] },
  { title: "Företag i dödsbo", titleEn: "Business in Estate", description: "Hantera företag i dödsbo", descriptionEn: "Handle business in estate", href: "/foretag-i-dodsbo", icon: BookOpen, category: "Guide", keywords: ["företag","firma","aktiebolag","business"] },
  { title: "Fastighet", titleEn: "Property", description: "Hantera fastigheter", descriptionEn: "Handle real estate", href: "/dodsbo-fastighet", icon: BookOpen, category: "Guide", keywords: ["fastighet","hus","lägenhet","property","bostad"] },

  // Samarbete
  { title: "Delägare", titleEn: "Heirs", description: "Hantera delägare och bjud in", descriptionEn: "Manage heirs and invite", href: "/delagare", icon: Users, category: "Samarbete", keywords: ["delägare","bjud in","heirs","invite"] },
  { title: "Delägare-portal", titleEn: "Heirs Portal", description: "Gemensam vy för alla delägare", descriptionEn: "Shared view for all heirs", href: "/delagare-portal", icon: Users, category: "Samarbete", keywords: ["portal","dela","gemensam","shared"] },
  { title: "Samarbete", titleEn: "Collaboration", description: "Beslut och anteckningar", descriptionEn: "Decisions and notes", href: "/samarbete", icon: Users, category: "Samarbete", keywords: ["samarbete","beslut","anteckningar","collaboration"] },

  // Övrigt
  { title: "Priser", titleEn: "Pricing", description: "Planer och priser", descriptionEn: "Plans and pricing", href: "/priser", icon: Calculator, category: "Övrigt", keywords: ["pris","plan","kostnad","pricing","betala"] },
  { title: "Inställningar", titleEn: "Settings", description: "Konto och inställningar", descriptionEn: "Account and settings", href: "/installningar", icon: Shield, category: "Övrigt", keywords: ["inställningar","konto","settings","profil"] },
];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles
      }
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX
      .filter(item => {
        const searchText = `${item.title} ${item.titleEn} ${item.description} ${item.descriptionEn} ${item.keywords.join(" ")}`.toLowerCase();
        return q.split(" ").every(word => searchText.includes(word));
      })
      .slice(0, 8);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    results.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [results]);

  function handleSelect(href: string) {
    router.push(href);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      {/* Modal */}
      <div
        className="relative w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Sök i appen...", "Search the app...")}
            className="flex-1 text-base outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="text-sm">{t("Inga resultat", "No results")}</p>
            </div>
          )}

          {!query.trim() && (
            <div className="px-4 py-4">
              <p className="text-xs text-gray-400 mb-3">{t("Populära sökningar", "Popular searches")}</p>
              <div className="flex flex-wrap gap-2">
                {["Bouppteckning", "Arvskalkylator", "Bankguide", "Fullmakt", "Nödbroms", "Tidslinje"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{category}</p>
              {items.map(item => (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors shrink-0">
                    <item.icon className="w-4 h-4 text-gray-500 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-300">⌘K {t("för att söka", "to search")}</p>
          <p className="text-[10px] text-gray-300">ESC {t("för att stänga", "to close")}</p>
        </div>
      </div>
    </div>
  );
}
