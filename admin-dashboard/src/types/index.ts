// ============================================
// Sista Resan Admin — Typdefinitioner
// ============================================

export type TransactionType = "income" | "expense";

export type IncomeCategory =
  | "saas_subscription"    // SaaS-intäkter (Standard/Premium)
  | "consulting"           // Konsulttjänster
  | "other_income";        // Övrigt

export type ExpenseCategory =
  | "server"               // Server & hosting (Vercel, Supabase)
  | "domain"               // Domän & DNS
  | "software"             // Mjukvara & verktyg
  | "marketing"            // Marknadsföring
  | "office"               // Kontorsmaterial
  | "travel"               // Resor
  | "phone_internet"       // Telefon & internet
  | "insurance"            // Försäkringar
  | "bank_fees"            // Bankavgifter
  | "education"            // Utbildning
  | "legal"                // Juridik & redovisning
  | "other_expense";       // Övrigt

export interface Transaction {
  id: string;
  date: string;              // ISO date
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
  description: string;
  amount: number;            // Belopp exkl. moms
  vat_rate: number;          // 0, 6, 12, eller 25
  vat_amount: number;        // Momsbelopp
  total: number;             // Belopp inkl. moms
  receipt_url?: string;      // Länk till kvitto
  bank_ref?: string;         // Referens från banktransaktion
  is_recurring: boolean;
  notes?: string;
  created_at: string;
}

export interface MonthlyReport {
  year: number;
  month: number;
  total_income: number;
  total_expenses: number;
  total_vat_collected: number;    // Utgående moms
  total_vat_deductible: number;   // Ingående moms
  vat_to_pay: number;             // Moms att betala
  profit_before_tax: number;
  estimated_tax: number;
  estimated_social_fees: number;  // Egenavgifter
  net_profit: number;
}

export interface TaxEstimate {
  year: number;
  total_income: number;
  total_expenses: number;
  profit: number;
  social_fees: number;            // Egenavgifter ~28.97%
  taxable_income: number;         // Profit - egenavgifter
  municipal_tax: number;          // Kommunalskatt ~32%
  state_tax: number;              // Statlig skatt (om > 598 500 kr)
  total_tax: number;
  effective_tax_rate: number;     // Procent
  monthly_set_aside: number;      // Vad du bör sätta undan per månad
}

export interface VATReport {
  period: string;                 // "2026-Q1", "2026-01" etc.
  output_vat_25: number;          // Utgående 25%
  output_vat_12: number;          // Utgående 12%
  output_vat_6: number;           // Utgående 6%
  total_output_vat: number;
  input_vat: number;              // Ingående moms (avdragsgill)
  vat_to_pay: number;             // Moms att betala/få tillbaka
  due_date: string;               // Sista dag att deklarera
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number?: string;
  balance: number;
  last_synced?: string;
  tink_account_id?: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DashboardStats {
  current_month_income: number;
  current_month_expenses: number;
  current_month_profit: number;
  ytd_income: number;
  ytd_expenses: number;
  ytd_profit: number;
  vat_to_pay: number;
  next_vat_deadline: string;
  estimated_yearly_tax: number;
  monthly_set_aside: number;
  account_balance: number;
}

// Kategori-labels för UI
export const INCOME_LABELS: Record<IncomeCategory, string> = {
  saas_subscription: "SaaS-prenumeration",
  consulting: "Konsulttjänster",
  other_income: "Övrigt",
};

export const EXPENSE_LABELS: Record<ExpenseCategory, string> = {
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

export const VAT_RATES = [0, 6, 12, 25] as const;
