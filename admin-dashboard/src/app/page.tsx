"use client";

import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  PiggyBank,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getTransactions } from "@/lib/store";
import { calculateTax } from "@/lib/tax-calculator";
import { getNextVATDeadline, calculateVATForPeriod } from "@/lib/vat-calculator";
import type { Transaction } from "@/types";

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  color = "gray",
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  color?: "green" | "red" | "amber" | "blue" | "gray";
}) {
  const colors = {
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    gray: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {subtext && <p className="text-[11px] text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice(-5).reverse();

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Senaste transaktioner</h2>
        <div className="text-center py-8 text-gray-400">
          <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Inga transaktioner ännu</p>
          <Link href="/transaktioner" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
            Lägg till din första →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Senaste transaktioner</h2>
        <Link href="/transaktioner" className="text-xs text-brand-600 hover:underline">
          Visa alla →
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === "income" ? "bg-green-50" : "bg-red-50"}`}>
                {tx.type === "income" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                <p className="text-[11px] text-gray-400">{tx.date}</p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString("sv-SE")} kr
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const yearTx = transactions.filter(
      (t) => new Date(t.date).getFullYear() === currentYear,
    );
    const monthTx = yearTx.filter(
      (t) => new Date(t.date).getMonth() === currentMonth,
    );

    const monthIncome = monthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const monthExpenses = monthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const ytdIncome = yearTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const ytdExpenses = yearTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const tax = calculateTax(ytdIncome, ytdExpenses);
    const vatDeadline = getNextVATDeadline();

    // Beräkna kvartalets moms
    const quarterMap = [
      "Q1", "Q1", "Q1",
      "Q2", "Q2", "Q2",
      "Q3", "Q3", "Q3",
      "Q4", "Q4", "Q4",
    ] as const;
    const currentQuarter = quarterMap[currentMonth];
    const vatReport = calculateVATForPeriod(transactions, currentYear, currentQuarter);

    return {
      monthIncome,
      monthExpenses,
      monthProfit: monthIncome - monthExpenses,
      ytdIncome,
      ytdExpenses,
      ytdProfit: ytdIncome - ytdExpenses,
      tax,
      vatDeadline,
      vatToPay: vatReport.vat_to_pay,
    };
  }, [transactions]);

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const fmt = (n: number) => Math.round(n).toLocaleString("sv-SE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Ekonomisk översikt</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long" })} — Enskild firma
        </p>
      </div>

      {/* Alerts */}
      {stats.vatDeadline && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/60">
          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">Momsdeklaration {stats.vatDeadline.quarter}</span>
            {" "}({stats.vatDeadline.label}) — senast {stats.vatDeadline.dueDate}
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Intäkter denna månad"
          value={`${fmt(stats.monthIncome)} kr`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Utgifter denna månad"
          value={`${fmt(stats.monthExpenses)} kr`}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          label="Moms att betala"
          value={`${fmt(stats.vatToPay)} kr`}
          subtext={`${stats.vatDeadline.quarter} — ${stats.vatDeadline.label}`}
          icon={Receipt}
          color="amber"
        />
        <StatCard
          label="Sätt undan / mån"
          value={`${fmt(stats.tax.monthly_set_aside)} kr`}
          subtext={`${stats.tax.effective_tax_rate}% effektiv skatt`}
          icon={PiggyBank}
          color="blue"
        />
      </div>

      {/* YTD summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Hittills i år</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Intäkter</span>
              <span className="text-sm font-semibold text-green-600">+{fmt(stats.ytdIncome)} kr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utgifter</span>
              <span className="text-sm font-semibold text-red-600">-{fmt(stats.ytdExpenses)} kr</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Resultat</span>
              <span className={`text-sm font-bold ${stats.ytdProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {fmt(stats.ytdProfit)} kr
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Egenavgifter</span>
              <span className="text-sm text-gray-700">~{fmt(stats.tax.social_fees)} kr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Beräknad skatt</span>
              <span className="text-sm text-gray-700">~{fmt(stats.tax.total_tax)} kr</span>
            </div>
          </div>
        </div>

        <RecentTransactions transactions={transactions} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/transaktioner", label: "Ny transaktion", icon: ArrowUpRight, desc: "Logga intäkt/utgift" },
          { href: "/moms", label: "Momsrapport", icon: Receipt, desc: "Se momsberäkning" },
          { href: "/skatt", label: "Skatteplanering", icon: Calculator, desc: "Beräkna din skatt" },
          { href: "/ai-konsult", label: "Fråga AI", icon: AlertTriangle, desc: "Ställ en fråga" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white rounded-2xl border border-gray-200/60 p-4 hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <action.icon className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900">{action.label}</p>
            <p className="text-[11px] text-gray-400">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
