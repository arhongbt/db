"use client";

import { useEffect, useState, useMemo } from "react";
import { Calculator, PiggyBank, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { getTransactions } from "@/lib/store";
import { calculateTax, calculateMonthlySetAside } from "@/lib/tax-calculator";
import type { Transaction } from "@/types";

export default function SkattPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  const year = new Date().getFullYear();

  const yearTx = useMemo(
    () => transactions.filter((t) => new Date(t.date).getFullYear() === year),
    [transactions, year],
  );

  const totalIncome = yearTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = yearTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const taxEstimate = useMemo(
    () => calculateTax(totalIncome, totalExpenses),
    [totalIncome, totalExpenses],
  );

  const monthlyAdvice = useMemo(
    () => calculateMonthlySetAside(transactions),
    [transactions],
  );

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }

  const fmt = (n: number) => Math.round(n).toLocaleString("sv-SE");
  const profit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Skatteplanering {year}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Enskild firma — beräknad skatt och egenavgifter</p>
      </div>

      {/* Monthly set-aside alert */}
      <div className="bg-brand-50 rounded-2xl border border-brand-200/60 p-5">
        <div className="flex items-start gap-3">
          <PiggyBank className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brand-800">
              Sätt undan ~{fmt(monthlyAdvice.amount)} kr / månad
            </p>
            <p className="text-xs text-brand-600 mt-1">{monthlyAdvice.breakdown}</p>
          </div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <p className="text-xs text-gray-400 mb-1">Intäkter</p>
          <p className="text-xl font-bold text-green-600">{fmt(totalIncome)} kr</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <p className="text-xs text-gray-400 mb-1">Utgifter</p>
          <p className="text-xl font-bold text-red-600">{fmt(totalExpenses)} kr</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <p className="text-xs text-gray-400 mb-1">Resultat</p>
          <p className={`text-xl font-bold ${profit >= 0 ? "text-gray-900" : "text-red-600"}`}>{fmt(profit)} kr</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <p className="text-xs text-gray-400 mb-1">Effektiv skatt</p>
          <p className="text-xl font-bold text-amber-600">{taxEstimate.effective_tax_rate}%</p>
        </div>
      </div>

      {/* Tax breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-brand-500" />
          Skatteberäkning
        </h2>

        <div className="space-y-3">
          <Row label="Intäkter" value={`${fmt(totalIncome)} kr`} />
          <Row label="Utgifter" value={`-${fmt(totalExpenses)} kr`} subtle />
          <Divider />
          <Row label="Resultat (överskott)" value={`${fmt(profit)} kr`} bold />
          <Divider />

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider pt-2">Avgifter & skatt</p>
          <Row
            label="Egenavgifter (28,97%)"
            value={`${fmt(taxEstimate.social_fees)} kr`}
            info="Beräknas på överskottet. Inkluderar sjukförsäkringsavgift, ålderspensionsavgift m.m."
          />
          <Row
            label="Kommunalskatt (~32,5%)"
            value={`${fmt(taxEstimate.municipal_tax)} kr`}
            info="Baserat på genomsnittlig kommunalskatt i Sverige."
          />
          {taxEstimate.state_tax > 0 && (
            <Row
              label="Statlig inkomstskatt (20%)"
              value={`${fmt(taxEstimate.state_tax)} kr`}
              info="Betalas på beskattningsbar förvärvsinkomst över skiktgränsen (~614 000 kr)."
            />
          )}
          <Divider />
          <Row label="Total skatt + avgifter" value={`${fmt(taxEstimate.total_tax)} kr`} bold highlight />

          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Kvar efter skatt</span>
              <span className="text-lg font-bold text-brand-600">
                {fmt(profit - taxEstimate.total_tax)} kr
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              ~{fmt((profit - taxEstimate.total_tax) / 12)} kr/mån
            </p>
          </div>
        </div>
      </div>

      {/* Important dates */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Viktiga datum {year}</h2>
        <div className="space-y-3">
          {[
            { date: `${year}-02-12`, label: "Momsdeklaration Q4 " + (year - 1) },
            { date: `${year}-03-15`, label: "Preliminärskatt period 1" },
            { date: `${year}-05-02`, label: "Inkomstdeklaration (NE-bilaga)" },
            { date: `${year}-05-12`, label: "Momsdeklaration Q1" },
            { date: `${year}-06-15`, label: "Preliminärskatt period 2" },
            { date: `${year}-08-17`, label: "Momsdeklaration Q2" },
            { date: `${year}-09-15`, label: "Preliminärskatt period 3" },
            { date: `${year}-11-12`, label: "Momsdeklaration Q3" },
            { date: `${year}-12-15`, label: "Preliminärskatt period 4" },
          ].map((item) => {
            const isPast = new Date(item.date) < new Date();
            return (
              <div key={item.date} className={`flex items-center gap-3 ${isPast ? "opacity-40" : ""}`}>
                <span className={`text-xs font-mono w-20 ${isPast ? "line-through" : "text-gray-600"}`}>
                  {item.date.slice(5)}
                </span>
                <span className="text-sm text-gray-700">{item.label}</span>
                {!isPast && new Date(item.date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">Snart</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/60">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Dessa beräkningar är uppskattningar baserade på förenklade modeller. Kontrollera alltid med
          Skatteverket eller en auktoriserad redovisningskonsult för exakta belopp.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  subtle,
  highlight,
  info,
}: {
  label: string;
  value: string;
  bold?: boolean;
  subtle?: boolean;
  highlight?: boolean;
  info?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm ${bold ? "font-semibold text-gray-900" : subtle ? "text-gray-400" : "text-gray-600"}`}>
            {label}
          </span>
          {info && (
            <button onClick={() => setShowInfo(!showInfo)} className="text-gray-300 hover:text-gray-500">
              <Info className="w-3 h-3" />
            </button>
          )}
        </div>
        <span className={`text-sm ${bold ? "font-bold" : "font-medium"} ${highlight ? "text-red-600" : "text-gray-900"}`}>
          {value}
        </span>
      </div>
      {showInfo && info && (
        <p className="text-[11px] text-gray-400 mt-1 ml-0">{info}</p>
      )}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100" />;
}
