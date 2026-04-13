"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Receipt,
  Calculator,
  HelpCircle,
} from "lucide-react";
import {
  getTransactions,
  getAIMessages,
  saveAIMessage,
  clearAIMessages,
  generateId,
} from "@/lib/store";
import { calculateTax, calculateMonthlySetAside } from "@/lib/tax-calculator";
import { calculateVATForPeriod, getNextVATDeadline } from "@/lib/vat-calculator";
import type { AIMessage, Transaction } from "@/types";

// ============================================
// AI-konsultens kunskapsbas
// ============================================
// I framtiden kan detta kopplas till OpenAI/Claude API.
// Just nu: regelbaserat system med svenska redovisningsregler.

interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  vatToPay: number;
  nextVATDeadline: string;
  monthlySetAside: number;
  effectiveTaxRate: number;
  transactionCount: number;
  topExpenseCategory: string;
  socialFees: number;
  totalTax: number;
}

function getFinancialContext(transactions: Transaction[]): FinancialContext {
  const year = new Date().getFullYear();
  const yearTx = transactions.filter((t) => new Date(t.date).getFullYear() === year);

  const totalIncome = yearTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = yearTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const profit = totalIncome - totalExpenses;

  const tax = calculateTax(totalIncome, totalExpenses);
  const vatDeadline = getNextVATDeadline();
  const currentQ = (["Q1", "Q2", "Q3", "Q4"] as const)[Math.floor(new Date().getMonth() / 3)];
  const vat = calculateVATForPeriod(transactions, year, currentQ);

  // Hitta top-utgiftskategori
  const expByCat: Record<string, number> = {};
  yearTx.filter((t) => t.type === "expense").forEach((t) => {
    expByCat[t.category] = (expByCat[t.category] || 0) + t.amount;
  });
  const topCat = Object.entries(expByCat).sort((a, b) => b[1] - a[1])[0];

  return {
    totalIncome,
    totalExpenses,
    profit,
    vatToPay: vat.vat_to_pay,
    nextVATDeadline: vatDeadline.dueDate,
    monthlySetAside: tax.monthly_set_aside,
    effectiveTaxRate: tax.effective_tax_rate,
    transactionCount: yearTx.length,
    topExpenseCategory: topCat ? topCat[0] : "ingen",
    socialFees: tax.social_fees,
    totalTax: tax.total_tax,
  };
}

/**
 * Enkel pattern-matching AI-konsult
 * Ersätts med riktig LLM-koppling senare
 */
function generateResponse(question: string, ctx: FinancialContext): string {
  const q = question.toLowerCase();
  const fmt = (n: number) => Math.round(n).toLocaleString("sv-SE");

  // Hälsning
  if (q.match(/^(hej|hallå|tjena|god|hi|hello)/)) {
    return `Hej! Jag är din AI-redovisningskonsult. Jag kan hjälpa dig med frågor om skatt, moms, avdrag och ekonomi för din enskilda firma. Vad undrar du?`;
  }

  // Skattefrågor
  if (q.includes("skatt") || q.includes("betala") && q.includes("skatt")) {
    return `**Din beräknade skatt ${new Date().getFullYear()}:**\n\n` +
      `• Resultat: ${fmt(ctx.profit)} kr\n` +
      `• Egenavgifter: ~${fmt(ctx.socialFees)} kr (28,97%)\n` +
      `• Kommunal + statlig skatt: ~${fmt(ctx.totalTax - ctx.socialFees)} kr\n` +
      `• **Total skatt + avgifter: ~${fmt(ctx.totalTax)} kr**\n` +
      `• Effektiv skattesats: ${ctx.effectiveTaxRate}%\n\n` +
      `Jag rekommenderar att du sätter undan ~**${fmt(ctx.monthlySetAside)} kr/mån** på ett separat skattekonto.`;
  }

  // Moms
  if (q.includes("moms")) {
    return `**Momssituation:**\n\n` +
      `• Moms att betala detta kvartal: ${fmt(ctx.vatToPay)} kr\n` +
      `• Nästa momsdeklaration: ${ctx.nextVATDeadline}\n\n` +
      `**Vanliga momssatser för SaaS:**\n` +
      `• 25% — Försäljning till privatpersoner i Sverige\n` +
      `• 0% — B2B till EU-företag med giltigt VAT-nummer (omvänd skattskyldighet)\n` +
      `• 0% — Försäljning utanför EU\n\n` +
      `Kom ihåg: Du får dra av ingående moms på alla affärsrelaterade inköp!`;
  }

  // Egenavgifter
  if (q.includes("egenavgift")) {
    return `**Egenavgifter för enskild firma (2026):**\n\n` +
      `Satsen är 28,97% av överskottet i din firma. Det inkluderar:\n` +
      `• Sjukförsäkringsavgift: 3,55%\n` +
      `• Ålderspensionsavgift: 10,21%\n` +
      `• Efterlevandepensionsavgift: 0,60%\n` +
      `• Arbetsmarknadsavgift: 2,64%\n` +
      `• Allmän löneavgift: 11,62%\n` +
      `• Arbetsskadeavgift: 0,20%\n` +
      `• Föräldraförsäkringsavgift: 2,60%\n\n` +
      `Dina beräknade egenavgifter: ~**${fmt(ctx.socialFees)} kr**\n\n` +
      `Tips: Du får göra schablonavdrag med 25% av avgiftsunderlaget, vilket sänker din beskattningsbara inkomst.`;
  }

  // Avdrag
  if (q.includes("avdrag") || q.includes("dra av") || q.includes("dra af")) {
    return `**Vanliga avdrag för enskild firma (SaaS/tech):**\n\n` +
      `✅ **Kan dras av:**\n` +
      `• Server & hosting (Vercel, Supabase, AWS etc.)\n` +
      `• Domäner & DNS\n` +
      `• Mjukvara & verktyg (GitHub, Figma etc.)\n` +
      `• Telefon & internet (affärsandel)\n` +
      `• Dator & utrustning (förbrukningsmaterial < 26 250 kr direkt, annars avskrivning)\n` +
      `• Kontorsplats/coworking\n` +
      `• Facklitteratur & utbildning\n` +
      `• Marknadsföring & annonsering\n` +
      `• Resor i tjänsten\n` +
      `• Bankavgifter\n\n` +
      `⚠️ **Delvis avdragsgillt:**\n` +
      `• Hemmakontor: 2 000 kr/år schablon ELLER faktisk kostnad\n` +
      `• Egen bil: 25 kr/mil (schablon)\n` +
      `• Telefon: affärsandelen av kostnaden\n\n` +
      `Din största utgiftskategori just nu: **${ctx.topExpenseCategory}**`;
  }

  // F-skatt
  if (q.includes("f-skatt") || q.includes("f skatt")) {
    return `**F-skatt:**\n\n` +
      `Som enskild firma med F-skattsedel ansvarar du själv för att betala din preliminärskatt. ` +
      `Skatteverket skickar inbetalningskort baserat på din preliminära deklaration.\n\n` +
      `• Betalas den **12:e varje månad** (om ej på helg)\n` +
      `• Beloppet baseras på din uppskattade årsinkomst\n` +
      `• Du kan jämka (ändra beloppet) via Skatteverkets e-tjänst om inkomsten ändras\n\n` +
      `Baserat på din nuvarande takt bör din F-skatt vara ~**${fmt(ctx.totalTax / 12)} kr/mån**.`;
  }

  // Resultat / vinst
  if (q.includes("resultat") || q.includes("vinst") || q.includes("hur går det")) {
    return `**Ekonomisk sammanfattning ${new Date().getFullYear()}:**\n\n` +
      `• Intäkter: ${fmt(ctx.totalIncome)} kr\n` +
      `• Utgifter: ${fmt(ctx.totalExpenses)} kr\n` +
      `• Resultat: **${fmt(ctx.profit)} kr**\n` +
      `• Transaktioner: ${ctx.transactionCount} st\n\n` +
      `Efter skatt och avgifter har du kvar ~**${fmt(ctx.profit - ctx.totalTax)} kr** (${fmt((ctx.profit - ctx.totalTax) / 12)} kr/mån).\n\n` +
      (ctx.profit > 0
        ? `Det ser bra ut! Fortsätt hålla koll på utgifterna.`
        : `Du går minus just nu. Fokusera på att öka intäkterna eller minska utgifterna.`);
  }

  // Sätta undan
  if (q.includes("sätta undan") || q.includes("spara") || q.includes("skattekonto")) {
    return `**Rekommendation för att sätta undan:**\n\n` +
      `Baserat på din nuvarande intäkts- och utgiftstakt bör du sätta undan ~**${fmt(ctx.monthlySetAside)} kr/mån** ` +
      `på ett separat skattekonto.\n\n` +
      `Det täcker:\n` +
      `• Egenavgifter (~${fmt(ctx.socialFees)} kr/år)\n` +
      `• Kommunalskatt\n` +
      `• Eventuell statlig skatt\n\n` +
      `**Tips:** Öppna ett separat sparkonto och sätt upp en automatisk överföring varje månad!`;
  }

  // NE-bilaga / deklaration
  if (q.includes("deklaration") || q.includes("ne-bilaga") || q.includes("ne bilaga")) {
    return `**Inkomstdeklaration med NE-bilaga:**\n\n` +
      `Som enskild firma bifogar du en NE-bilaga till din vanliga inkomstdeklaration.\n\n` +
      `**Viktiga delar:**\n` +
      `• R1–R12: Intäkter\n` +
      `• R13–R15: Varuinköp\n` +
      `• R16–R23: Övriga kostnader\n` +
      `• R24: Resultat\n\n` +
      `**Deadline:** 2 maj ${new Date().getFullYear()}\n\n` +
      `Tips: Du kan deklarera digitalt via Skatteverkets e-tjänst. Om du har enkel bokföring räcker det ` +
      `med en förenklad NE-bilaga.`;
  }

  // Fallback
  return `Jag förstår inte riktigt frågan, men här är vad jag kan hjälpa dig med:\n\n` +
    `• **"Hur mycket skatt?"** — Beräknar din skatt\n` +
    `• **"Moms"** — Momsrapport och regler\n` +
    `• **"Egenavgifter"** — Vad som ingår\n` +
    `• **"Avdrag"** — Vad du kan dra av\n` +
    `• **"F-skatt"** — Preliminärskatt\n` +
    `• **"Resultat"** — Ekonomisk översikt\n` +
    `• **"Sätta undan"** — Hur mycket per månad\n` +
    `• **"Deklaration"** — NE-bilaga\n\n` +
    `Ställ din fråga så hjälper jag dig!`;
}

// ============================================
// Snabbfrågor
// ============================================
const QUICK_QUESTIONS = [
  { icon: Calculator, label: "Hur mycket skatt?", question: "Hur mycket skatt betalar jag i år?" },
  { icon: Receipt, label: "Momsrapport", question: "Visa momssammanställning" },
  { icon: TrendingUp, label: "Resultat", question: "Hur går det ekonomiskt?" },
  { icon: HelpCircle, label: "Avdrag", question: "Vilka avdrag kan jag göra?" },
];

export default function AIKonsultPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages(getAIMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(question?: string) {
    const q = question || input.trim();
    if (!q) return;

    // Spara användarmeddelande
    const userMsg: AIMessage = {
      id: generateId(),
      role: "user",
      content: q,
      timestamp: new Date().toISOString(),
    };
    saveAIMessage(userMsg);

    // Generera svar
    const transactions = getTransactions();
    const ctx = getFinancialContext(transactions);
    const response = generateResponse(q, ctx);

    const aiMsg: AIMessage = {
      id: generateId(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };
    saveAIMessage(aiMsg);

    setMessages(getAIMessages());
    setInput("");
  }

  function handleClear() {
    if (confirm("Rensa alla meddelanden?")) {
      clearAIMessages();
      setMessages([]);
    }
  }

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI-redovisningskonsult</h1>
            <p className="text-xs text-gray-400">Ställ frågor om skatt, moms & ekonomi</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 mx-auto text-gray-200 mb-4" />
            <p className="text-sm text-gray-500 mb-6">
              Hej! Jag hjälper dig med redovisning för din enskilda firma.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {QUICK_QUESTIONS.map((qq) => (
                <button
                  key={qq.label}
                  onClick={() => handleSend(qq.question)}
                  className="bg-white rounded-xl border border-gray-200/60 p-3 hover:border-brand-300 hover:shadow-sm transition-all text-left group"
                >
                  <qq.icon className="w-4 h-4 text-brand-500 mb-1.5" />
                  <p className="text-xs font-medium text-gray-700">{qq.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-brand-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200/60 text-gray-700"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
                <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-white/60" : "text-gray-300"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions (when there are messages) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_QUESTIONS.map((qq) => (
            <button
              key={qq.label}
              onClick={() => handleSend(qq.question)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-all"
            >
              {qq.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ställ en fråga om din ekonomi..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="px-4 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
