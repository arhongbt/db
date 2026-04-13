// ============================================
// Momsberäkning — Enskild firma
// ============================================

import type { Transaction, VATReport } from "@/types";

/**
 * Momsperioder och deadlines
 * Enskild firma med omsättning < 40 mkr → kvartalsvis moms
 * Om omsättning < 1 mkr → kan välja årsvis
 */
const QUARTERLY_DEADLINES: Record<string, { label: string; due: string }> = {
  Q1: { label: "Januari–Mars", due: "05-12" },
  Q2: { label: "April–Juni", due: "08-17" },
  Q3: { label: "Juli–September", due: "11-12" },
  Q4: { label: "Oktober–December", due: "02-12" },
};

/**
 * Beräknar moms för en given period
 */
export function calculateVATForPeriod(
  transactions: Transaction[],
  year: number,
  quarter: "Q1" | "Q2" | "Q3" | "Q4",
): VATReport {
  const quarterMonths: Record<string, number[]> = {
    Q1: [0, 1, 2],
    Q2: [3, 4, 5],
    Q3: [6, 7, 8],
    Q4: [9, 10, 11],
  };

  const months = quarterMonths[quarter];
  const periodTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && months.includes(d.getMonth());
  });

  // Utgående moms (från intäkter/försäljning)
  const incomeTransactions = periodTransactions.filter(
    (t) => t.type === "income",
  );
  const outputVat25 = incomeTransactions
    .filter((t) => t.vat_rate === 25)
    .reduce((sum, t) => sum + t.vat_amount, 0);
  const outputVat12 = incomeTransactions
    .filter((t) => t.vat_rate === 12)
    .reduce((sum, t) => sum + t.vat_amount, 0);
  const outputVat6 = incomeTransactions
    .filter((t) => t.vat_rate === 6)
    .reduce((sum, t) => sum + t.vat_amount, 0);

  const totalOutputVat = outputVat25 + outputVat12 + outputVat6;

  // Ingående moms (från kostnader — avdragsgill)
  const inputVat = periodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.vat_amount, 0);

  const vatToPay = totalOutputVat - inputVat;
  const deadline = QUARTERLY_DEADLINES[quarter];
  const dueYear = quarter === "Q4" ? year + 1 : year;

  return {
    period: `${year}-${quarter}`,
    output_vat_25: Math.round(outputVat25),
    output_vat_12: Math.round(outputVat12),
    output_vat_6: Math.round(outputVat6),
    total_output_vat: Math.round(totalOutputVat),
    input_vat: Math.round(inputVat),
    vat_to_pay: Math.round(vatToPay),
    due_date: `${dueYear}-${deadline.due}`,
  };
}

/**
 * Returnerar nästa momsdeadline
 */
export function getNextVATDeadline(): { quarter: string; dueDate: string; label: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Hitta nästa kvartal att deklarera
  if (month < 4) {
    // Före maj → deklarera Q1
    return {
      quarter: "Q1",
      dueDate: `${year}-${QUARTERLY_DEADLINES.Q1.due}`,
      label: QUARTERLY_DEADLINES.Q1.label,
    };
  } else if (month < 7) {
    return {
      quarter: "Q2",
      dueDate: `${year}-${QUARTERLY_DEADLINES.Q2.due}`,
      label: QUARTERLY_DEADLINES.Q2.label,
    };
  } else if (month < 10) {
    return {
      quarter: "Q3",
      dueDate: `${year}-${QUARTERLY_DEADLINES.Q3.due}`,
      label: QUARTERLY_DEADLINES.Q3.label,
    };
  } else {
    return {
      quarter: "Q4",
      dueDate: `${year + 1}-${QUARTERLY_DEADLINES.Q4.due}`,
      label: QUARTERLY_DEADLINES.Q4.label,
    };
  }
}

/**
 * Beräknar moms från bruttobelopp
 */
export function vatFromGross(grossAmount: number, vatRate: number): {
  net: number;
  vat: number;
} {
  const vat = grossAmount - grossAmount / (1 + vatRate / 100);
  return {
    net: Math.round((grossAmount - vat) * 100) / 100,
    vat: Math.round(vat * 100) / 100,
  };
}

/**
 * Beräknar moms från nettobelopp
 */
export function vatFromNet(netAmount: number, vatRate: number): {
  gross: number;
  vat: number;
} {
  const vat = netAmount * (vatRate / 100);
  return {
    gross: Math.round((netAmount + vat) * 100) / 100,
    vat: Math.round(vat * 100) / 100,
  };
}
