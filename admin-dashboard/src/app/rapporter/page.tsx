"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FileBarChart,
  Download,
  TrendingUp,
  TrendingDown,
  PieChart,
} from "lucide-react";
import { getTransactions } from "@/lib/store";
import { calculateTax } from "@/lib/tax-calculator";
import { calculateVATForPeriod } from "@/lib/vat-calculator";
import type { Transaction } from "@/types";

const EXPENSE_LABELS: Record<string, string> = {
  server: "Server & hosting",
  domain: "Domän & DNS",
  software: "Mjukvara & verktyg",
  marketing: "Marknadsföring",
  office: "Kontorsmaterial",
  travel: "Resor",
  phone_internet: "Telefon & internet",
  insurance: "Försäkringar",
  bank_fees: "Bankavgifter",
  education: "Utbildning",
  legal: "Juridik & redovisning",
  other_expense: "Övrigt",
};

const INCOME_LABELS: Record<string, string> = {
  saas_subscription: "SaaS-prenumeration",
  consulting: "Konsulttjänster",
  other_income: "Övrigt",
};

export default function RapporterPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  const yearTx = useMemo(
    () => transactions.filter((t) => new Date(t.date).getFullYear() === year),
    [transactions, year],
  );

  // Månadsvis data
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(year, i).toLocaleDateString("sv-SE", { month: "short" }),
      income: 0,
      expenses: 0,
    }));

    yearTx.forEach((t) => {
      const m = new Date(t.date).getMonth();
      if (t.type === "income") months[m].income += t.amount;
      else months[m].expenses += t.amount;
    });

    return months;
  }, [yearTx, year]);

  // Kategori-fördelning
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    yearTx
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([cat, amount]) => ({ category: cat, label: EXPENSE_LABELS[cat] || cat, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [yearTx]);

  const incomeBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    yearTx
      .filter((t) => t.type === "income")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([cat, amount]) => ({ category: cat, label: INCOME_LABELS[cat] || cat, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [yearTx]);

  const totals = useMemo(() => {
    const income = yearTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = yearTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const tax = calculateTax(income, expenses);
    return { income, expenses, profit: income - expenses, tax };
  }, [yearTx]);

  function exportCSV() {
    const header = "Datum,Typ,Kategori,Beskrivning,Belopp,Moms,Totalt\n";
    const rows = yearTx
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(
        (t) =>
          `${t.date},${t.type === "income" ? "Intäkt" : "Utgift"},${t.category},"${t.description}",${t.amount},${t.vat_amount},${t.total}`,
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bokforing-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }

  const fmt = (n: number) => Math.round(n).toLocaleString("sv-SE");
  const maxMonthly = Math.max(...monthlyData.map((m) => Math.max(m.income, m.expenses)), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rapporter</h1>
          <p className="text-sm text-gray-500 mt-0.5">Resultaträkning och analys</p>
        </div>
        <div className="flex gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-500 text-white rounded-xl text-sm hover:bg-brand-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Resultaträkning */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileBarChart className="w-4 h-4 text-brand-500" />
          Förenklad resultaträkning {year}
        </h2>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Intäkter</p>
          {incomeBreakdown.map((item) => (
            <div key={item.category} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-green-600">{fmt(item.amount)} kr</span>
            </div>
          ))}
          {incomeBreakdown.length === 0 && (
            <p className="text-sm text-gray-300 italic">Inga intäkter</p>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2">
            <span>Summa intäkter</span>
            <span className="text-green-600">{fmt(totals.income)} kr</span>
          </div>

          <div className="h-3" />
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Kostnader</p>
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-red-600">-{fmt(item.amount)} kr</span>
            </div>
          ))}
          {categoryBreakdown.length === 0 && (
            <p className="text-sm text-gray-300 italic">Inga kostnader</p>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2">
            <span>Summa kostnader</span>
            <span className="text-red-600">-{fmt(totals.expenses)} kr</span>
          </div>

          <div className="h-2" />
          <div className="flex justify-between text-base font-bold border-t-2 border-gray-200 pt-3">
            <span>Resultat före skatt</span>
            <span className={totals.profit >= 0 ? "text-gray-900" : "text-red-600"}>
              {fmt(totals.profit)} kr
            </span>
          </div>
        </div>
      </div>

      {/* Monthly chart (simple bar chart using divs) */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Intäkter & utgifter per månad</h2>
        <div className="flex items-end gap-1.5 h-40">
          {monthlyData.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex gap-0.5 items-end h-32">
                <div
                  className="flex-1 bg-green-200 rounded-t"
                  style={{ height: `${(m.income / maxMonthly) * 100}%`, minHeight: m.income > 0 ? 2 : 0 }}
                />
                <div
                  className="flex-1 bg-red-200 rounded-t"
                  style={{ height: `${(m.expenses / maxMonthly) * 100}%`, minHeight: m.expenses > 0 ? 2 : 0 }}
                />
              </div>
              <span className="text-[10px] text-gray-400">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded bg-green-200" /> Intäkter
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded bg-red-200" /> Utgifter
          </span>
        </div>
      </div>

      {/* Expense distribution */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-500" />
            Utgiftsfördelning
          </h2>
          <div className="space-y-3">
            {categoryBreakdown.map((item) => {
              const pct = (item.amount / totals.expenses) * 100;
              return (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-900 font-medium">{fmt(item.amount)} kr ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
