# Pre-Launch Hardening — Design Spec

**Date:** 2026-04-16
**Status:** Draft
**Scope:** Säkerhet, tester, teknisk stabilitet — allt som kan göras utan företagskonto

---

## 1. Bakgrund

Sista Resan är en dödsbohanteringsplattform som närmar sig lansering. Appen hanterar känslig data (personnummer, tillgångar, skulder, arvsinformation) och har juridiskt bindande beräkningar (arvskalkylatorn, faraid-motorn). Innan riktiga användare släpps in behöver vi täppa till säkerhetshål, verifiera att affärslogiken är korrekt, och bygga ett skyddsnät av tester.

**Begränsningar:** BankID och betalflöden väntar på företagskonto och ingår inte i denna spec. Vi fokuserar på det som kan göras idag med befintlig Supabase-instans, OpenRouter API och Vercel gratis tier.

---

## 2. Arbetsområden

### 2.1 Säkerhet — RLS-audit & API-skydd

**Problem:**
- Supabase Row Level Security (RLS) är konfigurerad men aldrig testad systematiskt. En felaktig policy kan läcka personnummer och tillgångar mellan användare.
- Rate limiting i `/api/juridisk-ai` använder en in-memory Map som försvinner vid varje deploy och inte delas mellan Vercel serverless-funktioner. I praktiken finns ingen rate limiting.
- OpenRouter API-nyckeln måste verifieras att den aldrig exponeras mot klienten.

**Lösning:**

1. **RLS-testsvit:** Skapa tester som verifierar att:
   - Användare A inte kan läsa/skriva användare B:s dödsbo
   - Användare A inte kan se delagare, tillgångar, skulder eller dokument från ett dödsbo de inte tillhör
   - Anonyma anrop blockeras helt
   - Alla 11 service-filer respekterar RLS: `dodsbo-service`, `delagare-service`, `tillgangar-service`, `skulder-service`, `dokument-service`, `forsakringar-service`, `tasks-service`, `invite-service`, `losore-service`, `kostnader-service`, `samarbete-service`

2. **Rate limiting → Upstash Redis:**
   - Ersätt in-memory `rateLimitMap` med `@upstash/ratelimit`
   - Upstash gratis tier: 10k requests/dag — mer än tillräckligt
   - Sliding window, 5 req/min per IP (behåll nuvarande gräns)

3. **API-nyckel audit:**
   - Verifiera att `OPENROUTER_API_KEY` bara refereras i server-side kod (`route.ts`)
   - Verifiera att inga env-variabler med prefix `NEXT_PUBLIC_` innehåller hemliga nycklar
   - Granska `next.config.js` för eventuell exponering

**Framgångskriterium:** Alla RLS-tester passerar. Rate limiting fungerar korrekt vid lasttest. Ingen hemlig nyckel exponerad i klientbundlen.

---

### 2.2 Tester — Affärslogik & kritiska flöden

**Problem:**
- Bara en testfil existerar (`juridisk-ai.test.ts`)
- Faraid-motorn har inbyggda test-cases (`test-cases.ts`) men ingen testsvit som kör dem
- Arvskalkylatorn beräknar juridiskt bindande fördelningar utan verifiering
- Personnummervalidering har ingen testtäckning

**Lösning:**

1. **Faraid-motorn (unit tests via Vitest):**
   - Kör alla befintliga test-cases i `lib/faraid/test-cases.ts` genom Vitest
   - Testa `engine.ts`: korrekta Quranic shares, hajb/exclusion-regler, 'awl-apportionment
   - Testa `fraction.ts`: aritmetik, förenkling, edge cases (division by zero)
   - Testa kantfall: inga arvingar, bara en arvinge, alla arvingetyper samtidigt

2. **Arvskalkylatorn (unit tests):**
   - Testa svensk arvsrätt: make/maka, barn, särkullbarn, föräldrar, syskon
   - Testa med och utan testamente
   - Testa laglottsskydd
   - Verifiera att summan alltid = 100%

3. **Personnummervalidering (unit tests):**
   - Giltiga format (YYYYMMDD-XXXX, YYMMDD-XXXX)
   - Ogiltiga checksummor
   - Edge cases: samordningsnummer, T-nummer

4. **API-endpoint (integration tests):**
   - Utöka befintliga `juridisk-ai.test.ts`
   - Testa autentiseringskrav
   - Testa rate limiting (med mockad Redis)
   - Testa att systemprompten laddas korrekt

5. **E2E-tester (Playwright) — kritiska flöden:**
   - Onboarding: hela flödet från start till dashboard
   - Skapa dödsbo: fylla i grunddata, spara
   - Lägga till delagare
   - Felhantering: vad händer vid nätverksfel?

**Framgångskriterium:** >80% coverage på `lib/faraid/`, `lib/personnummer.ts`, och arvskalkylatorn. E2E-tester passerar för de 3 kritiska flödena.

---

### 2.3 Felhantering & resiliens

**Problem:**
- Onboarding-flödet saknar synlig felhantering — misslyckade Supabase-anrop ger ingen feedback
- Formulär har ingen retry-logik eller offline-indikering
- Service worker registreras men cachar ingenting

**Lösning:**

1. **Error boundaries:**
   - Lägg till React Error Boundary runt varje sida i `app/`
   - Visa grief-medveten felmeddelande ("Något gick fel. Din data är sparad. Försök igen.")
   - Logga fel till konsolen (vi kan lägga till Sentry senare)

2. **Formulärresiliens:**
   - Lägg till loading states på alla formulär som anropar Supabase
   - Visa tydliga felmeddelanden vid misslyckade sparningar
   - Auto-save till localStorage som fallback (onboarding, bouppteckning)

3. **Grundläggande offline-stöd:**
   - Konfigurera service worker med cache-first för statiska assets
   - Visa offline-banner istället för vit sida vid tappad anslutning
   - Fullständig offline-first kan komma senare — nu räcker det med att appen inte kraschar

**Framgångskriterium:** Inga vita sidor vid nätverksfel. Alla formulär visar loading/error states. Appen laddar cache-first vid offline.

---

### 2.4 Kodkvalitet & konsolidering

**Problem:**
- Blandad styling: inline `style={{ background: 'var(--bg-card)' }}` och Tailwind i samma komponent
- AI-systemprompten (225 rader) är inbäddad i route handler
- Inga autogenererade Supabase-typer

**Lösning:**

1. **Styling-konsolidering:**
   - Inventera alla kvarvarande inline styles som använder CSS-variabler
   - Skapa Tailwind-utilities i `globals.css` för vanliga CSS-variabel-mönster (t.ex. `bg-card`, `border-default`)
   - Migrera alla inline styles till Tailwind-klasser eller de nya utilities

2. **Bryt ut AI-systemprompt:**
   - Flytta systemprompt till `lib/ai/system-prompt.ts`
   - Exportera som funktion som tar dödsbo-kontext som argument
   - Enklare att testa, versionhantera, och iterera på

3. **Supabase typgenerering:**
   - Kör `supabase gen types typescript` mot produktionsschemat
   - Spara till `types/supabase.ts`
   - Uppdatera service-filerna att använda genererade typer
   - Lägg till som npm script: `"db:types": "supabase gen types typescript --project-id <id> > src/types/supabase.ts"`

**Framgångskriterium:** Inga inline styles med CSS-variabler kvar. Systemprompt i egen fil med tester. TypeScript fångar schema-avvikelser vid build.

---

## 3. Prioritetsordning

| Prio | Område | Motivering |
|------|--------|-----------|
| P0 | 2.1 RLS-audit | Dataläcka = katastrof |
| P0 | 2.2 Faraid & arvstester | Felaktiga beräkningar = juridisk risk |
| P1 | 2.1 Rate limiting | Skyddar API-kostnad |
| P1 | 2.3 Error boundaries | Förhindrar vita sidor |
| P2 | 2.4 Supabase typgen | Förhindrar framtida buggar |
| P2 | 2.2 E2E-tester | Skyddsnät för framtida ändringar |
| P2 | 2.4 Styling + systemprompt | Kodkvalitet |
| P3 | 2.3 Offline-stöd | Nice-to-have pre-launch |

---

## 4. Utanför scope

- BankID-integration (väntar på företagskonto)
- Betalflöden / Stripe (väntar på företagskonto)
- Vercel Pro-uppgradering
- Ny funktionalitet (inga nya features i denna spec)
- Performance-optimering (inget prestandaproblem identifierat)

---

## 5. Risker

1. **RLS-policies kan kräva databasändringar** — om vi hittar luckor behöver vi skriva migrations, vilket kan påverka befintlig data
2. **Upstash kräver nytt konto** — gratis men kräver signup
3. **E2E-tester kräver testdata i Supabase** — behöver seed-script eller test-fixtures
4. **Faraid test-cases kan avslöja buggar** — om beräkningarna är fel kan fixarna vara komplexa
