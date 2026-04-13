// ============================================
// Lokal datalagring (localStorage → Supabase later)
// ============================================

import type { Transaction, BankAccount, AIMessage } from "@/types";

const STORAGE_KEYS = {
  transactions: "sr_admin_transactions",
  bankAccounts: "sr_admin_bank_accounts",
  aiMessages: "sr_admin_ai_messages",
  settings: "sr_admin_settings",
} as const;

// --- Transactions ---

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.transactions);
  return data ? JSON.parse(data) : [];
}

export function saveTransaction(tx: Transaction): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex((t) => t.id === tx.id);
  if (idx >= 0) {
    transactions[idx] = tx;
  } else {
    transactions.push(tx);
  }
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

// --- Bank Accounts ---

export function getBankAccounts(): BankAccount[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.bankAccounts);
  return data ? JSON.parse(data) : [];
}

export function saveBankAccount(account: BankAccount): void {
  const accounts = getBankAccounts();
  const idx = accounts.findIndex((a) => a.id === account.id);
  if (idx >= 0) {
    accounts[idx] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(STORAGE_KEYS.bankAccounts, JSON.stringify(accounts));
}

// --- AI Messages ---

export function getAIMessages(): AIMessage[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.aiMessages);
  return data ? JSON.parse(data) : [];
}

export function saveAIMessage(msg: AIMessage): void {
  const messages = getAIMessages();
  messages.push(msg);
  // Spara max 200 meddelanden
  const trimmed = messages.slice(-200);
  localStorage.setItem(STORAGE_KEYS.aiMessages, JSON.stringify(trimmed));
}

export function clearAIMessages(): void {
  localStorage.setItem(STORAGE_KEYS.aiMessages, JSON.stringify([]));
}

// --- Hjälpfunktioner ---

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Exportera all data som JSON (backup)
 */
export function exportAllData(): string {
  return JSON.stringify(
    {
      transactions: getTransactions(),
      bankAccounts: getBankAccounts(),
      aiMessages: getAIMessages(),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}

/**
 * Importera data från JSON-backup
 */
export function importData(json: string): void {
  const data = JSON.parse(json);
  if (data.transactions) {
    localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(data.transactions),
    );
  }
  if (data.bankAccounts) {
    localStorage.setItem(
      STORAGE_KEYS.bankAccounts,
      JSON.stringify(data.bankAccounts),
    );
  }
  if (data.aiMessages) {
    localStorage.setItem(
      STORAGE_KEYS.aiMessages,
      JSON.stringify(data.aiMessages),
    );
  }
}
