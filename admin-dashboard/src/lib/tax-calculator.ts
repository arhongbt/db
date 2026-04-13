// ============================================
// Skatteberäkning — Enskild firma 2026
// ============================================
// Baserat på Skatteverkets regler
// Uppdatera siffrorna årligen!

import type { TaxEstimate, Transaction } from "@/types";

// 2026 skattetabell (uppdatera årligen)
const TAX_CONFIG = {
  year: 2026,
  // Egenavgifter (enskild firma, under 65 år)
  social_fee_rate: 0.2897,
  // Kommunalskatt (genomsnitt Sverige)
  municipal_tax_rate: 0.3251,
  // Statlig inkomstskatt — skiktgräns
  state_tax_threshold: 613_900,    // Uppdatera årligen
  state_tax_rate: 0.20,
  // Grundavdrag (förenklat, beror på inkomst)
  basic_deduction_min: 16_800,
  basic_deduction_max: 40_500,
  // Prisbasbelopp
  price_base_amount: 58_800,       // 2026 (kontrollera scb.se)
};

/**
 * Beräknar grundavdrag baserat på taxerbar förvärvsinkomst
 * Förenklad modell — i verkligheten är det en trappstegsmodell
 */
function calculateBasicDeduction(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const pba = TAX_CONFIG.price_base_amount;

  if (taxableIncome <= 0.99 * pba) {
    return 0.423 * pba;
  } else if (taxableIncome <= 2.72 * pba) {
    return 0.423 * pba + 0.2 * (taxableIncome - 0.99 * pba);
  } else if (taxableIncome <= 3.11 * pba) {
    return 0.77 * pba;
  } else if (taxableIncome <= 7.88 * pba) {
    return 0.77 * pba - 0.1 * (taxableIncome - 3.11 * pba);
  } else {
    return 0.293 * pba;
  }
}

/**
 * Beräknar skatten för en enskild firma
 */
export function calculateTax(
  totalIncome: number,
  totalExpenses: number,
): TaxEstimate {
  const profit = totalIncome - totalExpenses;

  // Egenavgifter beräknas på överskottet
  const socialFees = Math.max(0, profit * TAX_CONFIG.social_fee_rate);

  // Schablonavdrag för egenavgifter (25% av avgiftsunderlaget)
  const socialFeeDeduction = profit * 0.25;

  // Taxerbar förvärvsinkomst
  const taxableBeforeDeduction = profit - socialFeeDeduction;
  const basicDeduction = calculateBasicDeduction(taxableBeforeDeduction);
  const taxableIncome = Math.max(0, taxableBeforeDeduction - basicDeduction);

  // Kommunalskatt
  const municipalTax = taxableIncome * TAX_CONFIG.municipal_tax_rate;

  // Statlig skatt (20% på inkomst över skiktgränsen)
  const stateTax =
    taxableIncome > TAX_CONFIG.state_tax_threshold
      ? (taxableIncome - TAX_CONFIG.state_tax_threshold) *
        TAX_CONFIG.state_tax_rate
      : 0;

  const totalTax = socialFees + municipalTax + stateTax;
  const effectiveRate = profit > 0 ? totalTax / profit : 0;
  const monthlySetAside = totalTax / 12;

  return {
    year: TAX_CONFIG.year,
    total_income: totalIncome,
    total_expenses: totalExpenses,
    profit,
    social_fees: Math.round(socialFees),
    taxable_income: Math.round(taxableIncome),
    municipal_tax: Math.round(municipalTax),
    state_tax: Math.round(stateTax),
    total_tax: Math.round(totalTax),
    effective_tax_rate: Math.round(effectiveRate * 1000) / 10,
    monthly_set_aside: Math.round(monthlySetAside),
  };
}

/**
 * Beräknar hur mycket du bör sätta undan per månad
 * baserat på nuvarande intäkter/utgifter-takt
 */
export function calculateMonthlySetAside(
  transactions: Transaction[],
): { amount: number; breakdown: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthsElapsed = currentMonth + 1;

  const yearTransactions = transactions.filter(
    (t) => new Date(t.date).getFullYear() === currentYear,
  );

  const totalIncome = yearTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = yearTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Extrapolera till helår
  const projectedIncome = (totalIncome / monthsElapsed) * 12;
  const projectedExpenses = (totalExpenses / monthsElapsed) * 12;

  const estimate = calculateTax(projectedIncome, projectedExpenses);

  return {
    amount: estimate.monthly_set_aside,
    breakdown: `Baserat på ${monthsElapsed} mån: ~${Math.round(projectedIncome).toLocaleString("sv-SE")} kr intäkter, ~${Math.round(projectedExpenses).toLocaleString("sv-SE")} kr utgifter → ~${estimate.effective_tax_rate}% effektiv skatt`,
  };
}
