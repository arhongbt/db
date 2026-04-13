"use client";

import { useEffect, useState, useMemo } from "react";
import { Receipt, AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { getTransactions } from "@/lib/store";
import { calculateVATForPeriod, getNextVATDeadline } from "@/lib/vat-calculator";
import type { Transaction, VATReport } from "@/types";

export default function MomsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  const quarters = useMemo(() => {
    const qs: (VATReport & { status: "upcoming" | "current" | "past" })[] = [];
    const now = new Date();
    const currentQ = Math.ceil((now.getMonth() + 1) / 3);

    (["Q1", "Q2", "Q3", "Q4"] as const).forEach((q, i) => {
      const report = calculateVATForPeriod(transactions, selectedYear, q);
      const qNum = i + 1;
      let status: "upcoming" | "current" | "past" = "upcoming";
      if (selectedYear < now.getFullYear()) status = "past";
      else if (selectedYear === now.getFullYear()) {
        if (qNum < currentQ) status = "past";
        else if (qNum === currentQ) status = "current";
      }
      qs.push({ ...report, status });
    });
    return qs;
  }, [transactions, selectedYear]);

  const yearTotal = useMemo(() => {
    return {
      outputVat: quarters.reduce((s, q) => s + q.total_output_vat, 0),
      inputVat: quarters.reduce((s, q) => s + q.input_vat, 0),
      toPay: quarters.reduce((s, q) => s + q.vat_to_pay, 0),
    };
  }, [quarters]);

  const nextDeadline = getNextVATDeadline();

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }

  const fmt = (n: number) => Math.round(n).toLocaleString("sv-SE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Momsrapport</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kvartalsvis momsredovisning</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Next deadline alert */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/60">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Nästa momsdeklaration: {nextDeadline.quarter} ({nextDeadline.label})
          </p>
          <p className="text-xs text-amber-600">Senast {nextDeadline.dueDate}</p>
        </div>
      </div>

      {/* Year summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 text-center">
          <p className="text-lg font-bold text-gray-900">{fmt(yearTotal.outputVat)} kr</p>
          <p className="text-xs text-gray-500">Utgående moms</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 text-center">
          <p className="text-lg font-bold text-green-600">{fmt(yearTotal.inputVat)} kr</p>
          <p className="text-xs text-gray-500">Ingående moms</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 text-center">
          <p className={`text-lg font-bold ${yearTotal.toPay >= 0 ? "text-red-600" : "text-green-600"}`}>
            {fmt(yearTotal.toPay)} kr
          </p>
          <p className="text-xs text-gray-500">{yearTotal.toPay >= 0 ? "Att betala" : "Att få tillbaka"}</p>
        </div>
      </div>

      {/* Quarterly breakdown */}
      <div className="space-y-4">
        {quarters.map((q) => (
          <div
            key={q.period}
            className={`bg-white rounded-2xl border p-5 ${
              q.status === "current"
                ? "border-brand-300 ring-1 ring-brand-100"
                : "border-gray-200/60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {q.status === "past" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : q.status === "current" ? (
                  <AlertCircle className="w-4 h-4 text-brand-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-300" />
                )}
                <h3 className="font-semibold text-gray-900">{q.period}</h3>
                {q.status === "current" && (
                  <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                    Pågående
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">Deadline: {q.due_date}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Utg. 25%</p>
                <p className="text-sm font-medium">{fmt(q.output_vat_25)} kr</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Utg. 12%</p>
                <p className="text-sm font-medium">{fmt(q.output_vat_12)} kr</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Utg. 6%</p>
                <p className="text-sm font-medium">{fmt(q.output_vat_6)} kr</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Ingående</p>
                <p className="text-sm font-medium text-green-600">-{fmt(q.input_vat)} kr</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">Moms att {q.vat_to_pay >= 0 ? "betala" : "få tillbaka"}</span>
              <span className={`text-base font-bold ${q.vat_to_pay >= 0 ? "text-red-600" : "text-green-600"}`}>
                {fmt(Math.abs(q.vat_to_pay))} kr
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-xs text-blue-700">
          <span className="font-medium">Tips:</span> SaaS-tjänster som säljs till privatpersoner i Sverige beskattas med 25% moms.
          B2B-försäljning till EU (med giltigt VAT-nr) är momsfritt — använd 0% momssats.
        </p>
      </div>
    </div>
  );
}
