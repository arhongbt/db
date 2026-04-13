// ============================================
// Tink API — Bankkoppling
// ============================================
// Tink (https://tink.com) ger tillgång till banktransaktioner
// via PSD2 Open Banking.
//
// Steg att sätta upp:
// 1. Skapa konto på console.tink.com
// 2. Registrera din enskilda firma (org.nr krävs)
// 3. Få client_id + client_secret
// 4. Implementera OAuth-flöde nedan
//
// Dokumentation: https://docs.tink.com
//
// OBS: Tink kräver att företaget är registrerat.
// Allt nedan är förberett men ej aktivt.

export interface TinkConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TinkTransaction {
  id: string;
  accountId: string;
  amount: { value: number; currencyCode: string };
  descriptions: { original: string; display: string };
  dates: { booked: string };
  categories: { pfm: { id: string; name: string } };
  status: string;
}

export interface TinkAccount {
  id: string;
  name: string;
  type: string;
  balances: {
    booked: { amount: { value: number; currencyCode: string } };
  };
  financialInstitutionId: string;
}

/**
 * Genererar Tink Link-URL för att koppla bank
 * Användaren navigeras hit för att välja bank och logga in
 */
export function getTinkLinkUrl(config: TinkConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    market: "SE",
    locale: "sv_SE",
    scope: "accounts:read,transactions:read,balances:read",
  });
  return `https://link.tink.com/1.0/transactions/connect-accounts?${params}`;
}

/**
 * Hämtar access token från Tink API
 * Anropas efter att användaren har godkänt i Tink Link
 */
export async function getAccessToken(
  config: TinkConfig,
  authorizationCode: string,
): Promise<string> {
  const res = await fetch("https://api.tink.com/api/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "authorization_code",
      code: authorizationCode,
    }),
  });

  if (!res.ok) throw new Error(`Tink auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

/**
 * Hämtar konton från Tink
 */
export async function fetchAccounts(accessToken: string): Promise<TinkAccount[]> {
  const res = await fetch("https://api.tink.com/data/v2/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Tink accounts failed: ${res.status}`);
  const data = await res.json();
  return data.accounts || [];
}

/**
 * Hämtar transaktioner från Tink
 */
export async function fetchTransactions(
  accessToken: string,
  accountId: string,
  dateFrom?: string,
): Promise<TinkTransaction[]> {
  const params = new URLSearchParams({ accountIdIn: accountId });
  if (dateFrom) params.set("bookedDateGte", dateFrom);

  const res = await fetch(`https://api.tink.com/data/v2/transactions?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Tink transactions failed: ${res.status}`);
  const data = await res.json();
  return data.transactions || [];
}

/**
 * Mappar Tink-kategori till vår kategori
 * Tink har PFM-kategorier som "expenses:food", "income:salary" etc.
 */
export function mapTinkCategory(pfmCategory: string): string {
  const map: Record<string, string> = {
    "expenses:food": "other_expense",
    "expenses:transport": "travel",
    "expenses:shopping": "other_expense",
    "expenses:entertainment": "other_expense",
    "expenses:home": "office",
    "expenses:communication": "phone_internet",
    "expenses:insurance": "insurance",
    "expenses:health": "other_expense",
    "expenses:education": "education",
    "expenses:financial": "bank_fees",
    "income:salary": "other_income",
    "income:benefits": "other_income",
    "income:pension": "other_income",
    "income:other": "other_income",
  };
  return map[pfmCategory] || (pfmCategory.startsWith("income") ? "other_income" : "other_expense");
}
