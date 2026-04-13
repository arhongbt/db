"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2,
  Filter,
  Download,
  Search,
} from "lucide-react";
import {
  getTransactions,
  saveTransaction,
  deleteTransaction,
  generateId,
} from "@/lib/store";
import { vatFromNet } from "@/lib/vat-calculator";
import type {
  Transaction,
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  INCOME_LABELS,
  EXPENSE_LABELS,
  VAT_RATES,
} from "@/types";

const INCOME_CATS: { value: IncomeCategory; label: string }[] = [
  { value: "saas_subscription", label: "SaaS-prenumeration" },
  { value: "consulting", label: "Konsulttjänster" },
  { value: "other_income", label: "Övrigt" },
];

const EXPENSE_CATS: { value: ExpenseCategory; label: string }[] = [
  { value: "server", label: "Server & hosting" },
  { value: "domain", label: "Domän & DNS" },
  { value: "software", label: "Mjukvara & verktyg" },
  { value: "marketing", label: "Marknadsföring" },
  { value: "office", label: "Kontorsmaterial" },
  { value: "travel", label: "Resor" },
  { value: "phone_internet", label: "Telefon & internet" },
  { value: "insurance", label: "Försäkringar" },
  { value: "bank_fees", label: "Bankavgifter" },
  { value: "education", label: "Utbildning" },
  { value: "legal", label: "Juridik & redovisning" },
  { value: "other_expense", label: "Övrigt" },
];

function TransactionForm({
  onSave,
  onCancel,
}: {
  onSave: (tx: Transaction) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<TransactionType>("income");
  const [category, setCategory] = useState<string>("saas_subscription");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState(25);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState("");

  const categories = type === "income" ? INCOME_CATS : EXPENSE_CATS;

  // Auto-select first category when switching type
  useEffect(() => {
    setCategory(type === "income" ? "saas_subscription" : "server");
  }, [type]);

  const parsedAmount = parseFloat(amount) || 0;
  const { gross, vat } = vatFromNet(parsedAmount, vatRate);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parsedAmount || !description) return;

    const tx: Transaction = {
      id: generateId(),
      date,
      type,
      category: category as IncomeCategory | ExpenseCategory,
      description,
      amount: parsedAmount,
      vat_rate: vatRate,
      vat_amount: vat,
      total: gross,
      is_recurring: isRecurring,
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    onSave(tx);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/60 p-6 space-y-5">
      <h2 className="font-semibold text-gray-900">Ny transaktion</h2>

      {/* Type toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            type === "income"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1.5" />
          Intäkt
        </button>
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            type === "expense"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          <TrendingDown className="w-4 h-4 inline mr-1.5" />
          Utgift
        </button>
      </div>

      {/* Date + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 bg-white"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Beskrivning</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="T.ex. Vercel Pro-plan, Kundbetalning..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          required
        />
      </div>

      {/* Amount + VAT */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Belopp (exkl. moms)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 pr-8"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kr</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Momssats</label>
          <select
            value={vatRate}
            onChange={(e) => setVatRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 bg-white"
          >
            <option value={25}>25%</option>
            <option value={12}>12%</option>
            <option value={6}>6%</option>
            <option value={0}>0% (momsfritt)</option>
          </select>
        </div>
      </div>

      {/* Calculated totals */}
      {parsedAmount > 0 && (
        <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Moms ({vatRate}%)</span>
            <span>{vat.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-900">
            <span>Totalt inkl. moms</span>
            <span>{gross.toLocaleString("sv-SE")} kr</span>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <label htmlFor="recurring" className="text-xs text-gray-600">
          Återkommande (varje månad)
        </label>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Anteckningar (valfritt)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 resize-none"
          placeholder="Extra info..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-brand-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Spara transaktion
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default function TransaktionerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  function handleSave(tx: Transaction) {
    saveTransaction(tx);
    setTransactions(getTransactions());
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (confirm("Ta bort transaktionen?")) {
      deleteTransaction(id);
      setTransactions(getTransactions());
    }
  }

  const filtered = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .filter(
      (t) =>
        !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }

  const allCats = [...INCOME_CATS, ...EXPENSE_CATS];
  const getCatLabel = (val: string) => allCats.find((c) => c.value === val)?.label || val;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transaktioner</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} transaktioner</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ny
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <TransactionForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Sök transaktioner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "Alla" : f === "income" ? "Intäkter" : "Utgifter"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
          <p className="text-lg font-bold text-green-700">{Math.round(totalIncome).toLocaleString("sv-SE")} kr</p>
          <p className="text-[11px] text-green-600">Intäkter</p>
        </div>
        <div className="bg-red-50 rounded-xl px-4 py-3 text-center">
          <p className="text-lg font-bold text-red-700">{Math.round(totalExpenses).toLocaleString("sv-SE")} kr</p>
          <p className="text-[11px] text-red-600">Utgifter</p>
        </div>
        <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
          <p className="text-lg font-bold text-blue-700">{Math.round(totalIncome - totalExpenses).toLocaleString("sv-SE")} kr</p>
          <p className="text-[11px] text-blue-600">Resultat</p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white rounded-2xl border border-gray-200/60 divide-y divide-gray-50">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Inga transaktioner att visa</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-green-50" : "bg-red-50"}`}>
                  {tx.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <p className="text-[11px] text-gray-400">
                    {tx.date} · {getCatLabel(tx.category)}
                    {tx.vat_rate > 0 && ` · ${tx.vat_rate}% moms`}
                    {tx.is_recurring && " · ↻"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString("sv-SE")} kr
                  </p>
                  {tx.vat_amount > 0 && (
                    <p className="text-[10px] text-gray-400">moms: {tx.vat_amount.toLocaleString("sv-SE")} kr</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
