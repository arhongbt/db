/**
 * Validerar svenska personnummer (ÅÅMMDD-XXXX eller ÅÅÅÅMMDDXXXX).
 * Använder Luhn-algoritmen (modulus 10).
 */

/** Rensa och normalisera till 10 siffror (ÅÅMMDDXXXX) */
function normalize(input: string): string | null {
  // Ta bort alla icke-siffror och bindestreck
  const cleaned = input.replace(/\s/g, '');

  // ÅÅÅÅMMDD-XXXX eller ÅÅÅÅMMDDXXXX (12 tecken)
  const long = cleaned.match(/^(\d{4})(\d{2})(\d{2})-?(\d{4})$/);
  if (long) {
    return long[1].slice(2) + long[2] + long[3] + long[4];
  }

  // ÅÅMMDD-XXXX eller ÅÅMMDDXXXX (10-11 tecken)
  const short = cleaned.match(/^(\d{2})(\d{2})(\d{2})[-+]?(\d{4})$/);
  if (short) {
    return short[1] + short[2] + short[3] + short[4];
  }

  return null;
}

/** Luhn-check (modulus 10) */
function luhnCheck(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Kontrollera att datumet är rimligt */
function isValidDate(yy: string, mm: string, dd: string): boolean {
  const month = parseInt(mm, 10);
  const day = parseInt(dd, 10);

  // Samordningsnummer: dag + 60
  const actualDay = day > 60 ? day - 60 : day;

  if (month < 1 || month > 12) return false;
  if (actualDay < 1 || actualDay > 31) return false;
  return true;
}

export interface PersonnummerResult {
  valid: boolean;
  formatted: string | null; // ÅÅMMDD-XXXX
  error?: string;
}

/**
 * Validera ett svenskt personnummer.
 * Accepterar: 199001011234, 900101-1234, 9001011234
 */
export function validatePersonnummer(input: string): PersonnummerResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, formatted: null, error: 'Ange ett personnummer' };
  }

  const digits = normalize(input);
  if (!digits || digits.length !== 10) {
    return { valid: false, formatted: null, error: 'Ogiltigt format. Använd ÅÅMMDD-XXXX' };
  }

  const yy = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const dd = digits.slice(4, 6);

  if (!isValidDate(yy, mm, dd)) {
    return { valid: false, formatted: null, error: 'Ogiltigt datum i personnumret' };
  }

  if (!luhnCheck(digits)) {
    return { valid: false, formatted: null, error: 'Kontrollsiffran stämmer inte' };
  }

  const formatted = `${yy}${mm}${dd}-${digits.slice(6)}`;
  return { valid: true, formatted };
}

/**
 * Formatera personnummer till ÅÅMMDD-XXXX.
 * Returnerar input oförändrat om det inte kan tolkas.
 */
export function formatPersonnummer(input: string): string {
  const result = validatePersonnummer(input);
  return result.formatted || input;
}
