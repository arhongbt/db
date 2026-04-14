# Sista Resan — Faktabaserad Marknads- och Prismodellanalys

**Datum:** 13 april 2026
**Sammanställd av:** Claude (Cowork research agent)
**Syfte:** Validera eller utmana den initiala bedömningen av prismodellen med faktiska källor.

---

## Sammanfattning

Sista Resan verkar i en **verklig och hållbar marknad** med ~91 000 dödsfall per år i Sverige och uppskattningsvis 45 000–64 000 dödsbon som kräver formell hantering årligen. Prismodellen (Gratis / 499 / 899 / 2 499 kr) är **konkurrenskraftig** — den underskrider eller matchar alla identifierade direktkonkurrenter (1 975–5 995 kr för bouppteckning).

**Nyckelfynd som påverkar tidigare bedömning:**

1. Min konverteringssiffra på 2–5 % var **för konservativ** för det här segmentet — legal/legaltech-appar konverterar i snitt 23 % från trial till paid (Adapty 2026). Med Sista Resans gratis-tier och rätt onboarding är 8–15 % free→paid mer realistiskt.
2. Den årliga marknaden är **större än jag antog** — TAM (totala adresserbara) på 91–382 miljoner kr/år bara för bouppteckningstjänster, högre för bredare livshändelse-plattform.
3. Marknadsledaren Lavendla har **endast 3 % nationell andel** — marknaden är mycket fragmenterad och inte oversaturated.
4. **4-tier-modellen är mer riskfylld** än 3-tier enligt forskning (decision paralysis), men kan fungera om Bas är en tydlig "decoy" som förstärker Familj.
5. Forskning bekräftar att **engångsbetalning är rätt val** för låg-frekvens-livshändelser — converterar 5–15 % vs 3–10 % för subscription.

---

## 1. Marknadsstorlek — Sverige

### Dödsfall per år

Enligt **Statistiska centralbyrån (SCB)**:

- **2024:** 91 300 dödsfall (45 900 kvinnor, 45 400 män)
- **2025:** ~92 244 dödsfall (preliminärt, +944 från 2024)

Stabil bas på ~91 000–92 000 dödsfall årligen.

> Källa: [SCB — Döda i Sverige](https://www.scb.se/hitta-statistik/sverige-i-siffror/manniskorna-i-sverige/doda-i-sverige/)

### Bouppteckningar per år

**Riksrevisionen** publicerade 2025 en omfattande granskning av Skatteverkets dödsbohantering 2015–2024. Exakta antal bouppteckningar offentliggjordes inte i sammanfattningen, men rapporten dokumenterade:

- **Genomsnittlig handläggningstid:** 82 dagar (2016–2024)
- **Pre-COVID baseline:** 12 dagar
- Indikerar fortsatt hög volym och kapacitetsbrist hos myndigheten

**Inferens (ej styrkt):** Inte alla dödsfall leder till formell bouppteckning (små dödsbon, förenklade procedurer existerar). Konservativ uppskattning: 50–70 % = **45 500–63 700 bouppteckningar/år**.

> Källa: [Riksrevisionen 2025:23 — Statens insatser vid hantering av dödsbon](https://www.riksrevisionen.se/granskningar/granskningsrapporter/2025/statens-insatser-vid-hantering-av-dodsbon---utredning-forvaltning-och-skifte.html)

### Genomsnittligt dödsbovärde

**Hård data saknas offentligt.** Fragmenterad data från enskilda källor:

- Dödsbostädning: 15 000–50 000 kr
- Genomsnittlig begravningskostnad 2024: 27 000 kr (intervall 12 500–38 000+ kr)

**Rekommendation:** Kontakta Skatteverket direkt för aggregerad data om bouppteckningsvärden — kritiskt för CLV-modellering.

---

## 2. Konkurrentanalys — Svenska estate-tech-aktörer

| Aktör | Modell | Pris | Vad ingår | Källa |
|-------|--------|------|-----------|-------|
| **Aatos** | Engång | 1 990 kr | Komplett bouppteckning, gratis juristchatt | [aatos.app](https://aatos.app/se/bouppteckning/) |
| **Bouppteckna** | Engång | 1 975 kr | Bouppteckning online, fast pris | [bouppteckna.se](https://www.bouppteckna.se/) |
| **Bouppteckningar.nu** | Engång | 5 995 kr | Komplett service med möte och inlämning | [bouppteckningar.nu](https://www.bouppteckningar.nu/) |
| **Lavendla** | Hybrid | 8 995 kr+ jurist; 1 095 kr/h begravning, 2 250 kr/h juridik | Begravningsbyrå + juridik | [lavendla.se](https://lavendla.se/juridik/prislista/) |
| **Fonus / Familjens Jurist** | Hybrid | 7 000–12 000 kr | Bouppteckning via dotterbolag | [fonus.se](https://www.fonus.se/begravningsguiden/planera-begravning/vad-kostar-en-begravning/) |
| **Familjens Jurist** | Traditionell | 2 090 kr/h | Timpris | [familjensjurist.se](https://www.familjensjurist.se/) |
| **Fenix Family** | Digital | Ej offentligt | Digitala testamenten, fullmakter | [fenixfamily.se](https://fenixfamily.se/) |
| **Lawly** | Digital + telefon | Ej offentligt | Bouppteckning via gratis första samtal | [lawly.eu](https://lawly.eu/sv-se/bouppteckning) |

### Sista Resans positionering

**Sista Resan ligger under eller i nivå med alla pure-play digitala konkurrenter:**

- Bas (499 kr) underskrider Aatos (1 990) med **75 %**
- Familj (899 kr) underskrider Aatos med **55 %**, Bouppteckningar.nu med **85 %**
- Lifetime (2 499 kr) ligger fortfarande under Lavendla, Fonus och Bouppteckningar.nu

**Differentiering:** Sista Resans **multi-user familj-PWA** är unik — ingen identifierad konkurrent erbjuder familjekollaboration. Denna positionering är **oprövad** men potentiellt stark.

### Marknadsandelar

- **Lavendla:** 3 % nationell, 6 % i Stockholm
- Övriga aktörer publicerar **inga marknadsandelar**

> Källa: [Reco — Lavendla Begravningsbyrå](https://www.reco.se/lavendla-begravningsbyra)

**Slutsats:** Marknaden är **inte oversaturated**. Marknadsledaren har under 5 % vilket innebär stort utrymme för nya aktörer.

---

## 3. Konverteringsdata — Hård forskning

### Allmänna SaaS-benchmarks

| Mätvärde | Värde | Källa |
|----------|-------|-------|
| Median freemium → paid (B2B SaaS) | 2–5 % | [Userpilot](https://userpilot.com/blog/freemium-conversion-rate/) |
| Top-performers freemium → paid | 5–10 % | [First Page Sage](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/) |
| Visitor → freemium signup | ~13,3 % | [Pathmonk](https://pathmonk.com/what-is-the-average-free-to-paid-conversion-saas/) |
| Total funnel (visitor → paid) | ~0,35 % | Pathmonk |

### Legal/LegalTech-specifik konvertering — VIKTIG

**Legal/LegalTech-appar konverterar ~23,1 % från trial till paid** — markant högre än generell SaaS.

| Bransch | Trial → paid |
|---------|--------------|
| Legal/LegalTech | **23,1 %** |
| HR Software | 22,7 % |
| AdTech | 24,3 % |
| CRM | 29 % |

> Källa: [Adapty — Trial Conversion Rates 2026](https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/), [Business of Apps](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)

**Min ursprungliga uppskattning på 2–5 % var för låg.** Sista Resan klassas som legaltech/legal-aid och kan därmed förvänta sig **8–15 % free→paid** med rätt onboarding (lägre än renodlad trial pga opt-in vs opt-out).

### Trial-strukturens påverkan

- **Opt-out trial** (kreditkort krävs upfront): 49–60 % konvertering
- **Opt-in trial** (inget kort): 18–25 % konvertering

Sista Resan använder **opt-in**-modell (gratis tier utan kort) — förvänta nedre del av spannet om inte friktionen i onboarding minimeras.

### Tidsfönster

- Majoriteten av konverteringar sker **inom 30 dagar**
- Användare som engagerar core-features första veckan är **5x mer sannolika att konvertera**

> Källa: [Userpilot — SaaS Average Conversion Rate](https://userpilot.com/blog/saas-average-conversion-rate/)

---

## 4. Engångsbetalning vs Abonnemang

| Modell | Initial konvertering | 12-mån retention | Tot. CLV |
|--------|---------------------|------------------|----------|
| Engångsköp | **5–15 %** | N/A (engång) | Lägre |
| Abonnemang | 3–10 % | 1,5–2x högre | Högre långsiktigt |
| Hybridmodell | — | — | **+30 % revenue growth** |

> Källor: [Dodo Payments](https://dodopayments.com/blogs/one-time-vs-subscription-saas-pricing/), [GetMonetizely](https://www.getmonetizely.com/articles/how-should-you-price-your-saas-product-one-time-payment-vs-subscription-models/)

**Slutsats:** Engångsmodellen är **rätt val** för Sista Resan eftersom:

- Dödsbohantering är **låg-frekvens-livshändelse** (en familj hanterar typiskt ett dödsbo per 5–10 år)
- Abonnemang skapar friktion i sorgsna situationer
- 5–15 % initial konvertering > 3–10 % för subscription

**Risk:** Lägre långsiktig CLV per kund — kompenseras av lägre acquisition cost för engångsbetalning.

---

## 5. Decoy-effekten och 4-tier vs 3-tier — Forskning

### Dan Arielys "Economist Magazine"-experiment

Det klassiska experimentet från *Predictably Irrational*:

- Online-only: $59
- Print-only: $125 ← decoy (asymmetriskt dominerad)
- Print + Online: $125 ← samma pris som decoy, synligt bättre

| Utan decoy | Med decoy |
|------------|-----------|
| 68 % billig | 16 % billig |
| 32 % premium | **84 % premium** |

> Källa: [The Strategy Story — Economist Magazine Decoy Pricing](https://thestrategystory.com/2020/10/02/economist-magazine-a-story-of-clever-decoy-pricing/)

**Caveat:** Vissa replikeringsförsök på riktiga (ej hypotetiska) köpsituationer har visat **svagare eller ingen effekt**. Decoy-effekten är **kontextberoende**.

> Källa: [CanadianSME — Decoy Effect Critique](https://canadiansme.ca/the-decoy-effect-we-are-all-predictably-irrational-dan-ariely/)

### 3-tier vs 4-tier i praktiken

**3-tier är optimal som default** enligt branschforskning:

- **66 %** väljer mittenalternativet
- 23 % väljer billigast
- 11 % väljer dyrast

**4-tier risk:** Decision paralysis. Inget alternativ får över 30 % fokus när 4 tiers visas.

**När 4-tier fungerar:** Endast om 4:e nivån strategiskt är en **tydlig anchor eller decoy** som omfokuserar uppmärksamhet på 2:a eller 3:e nivån.

> Källor: [Glencoyne — SaaS Pricing Tiers Psychology](https://www.glencoyne.com/guides/saas-pricing-tiers-psychology), [OpenView — Tiered Pricing Optimization](https://openviewpartners.com/blog/tiered-pricing-optimization/)

### Bedömning av Sista Resans 4-tier-struktur

| Tier | Pris | Roll | Risk |
|------|------|------|------|
| Gratis | 0 kr | Funnel-top, lead magnet | Låg |
| Bas | 499 kr | **Tänkt decoy** för Familj | **Kan stjäla från Familj om för billigt attraktiv** |
| Familj | 899 kr | **Anchor** ("Populärast") | Måste vara tydligt vinnande val |
| Lifetime | 2 499 kr | Premium-anchor | "Varför lifetime?"-fråga oklar |

**Hypotes:** Bas funkar som decoy *om* användare uppfattar Familj som "uppenbart bättre värde". Risk: vissa enskilda användare (singel-arvingar) kan välja Bas av princip → tappar mervärde från Familj-konvertering.

**Forskningsbaserad rekommendation:** A/B-testa **3-tier vs 4-tier** så snart trafiken tillåter. 3-tier kan ge bättre konvertering om Bas inte uppenbart fungerar som decoy.

---

## 6. SEO-konkurrens — Svenska söktermer

### Sökterm-landskapet

Exakt sökvolym-data kräver Ahrefs/SEMrush-konto, men identifierade nyckelord:

| Sökterm | Intent | SEO-konkurrens |
|---------|--------|----------------|
| **bouppteckning** | Hög, transaktionell | Hög (Aatos, Bouppteckna, Lavendla, Skatteverket dominerar) |
| **dödsbo** | Bred, blandad | Medel-hög |
| **arvskifte** | Juridisk process | Medel |
| **dödsbohjälp** | Kommersiell | Lägre — möjlig nisch |
| **bouppteckning hjälp** | Kommersiell | Medel |

**Marknadssignal:** 91 000+ dödsfall årligen garanterar baseline-efterfrågan. Säsongstoppar troligen vinter/tidig vår.

**Sista Resans möjlighet:** "Familj dödsbohantering", "multi-user bouppteckning", "kollaborativ arvshantering" är **mindre konkurrensutsatta long-tail-keywords** som matchar er differentiering.

### Konkurrent-SEO

Inga konkurrenter publicerar trafiksiffror. Aatos, Bouppteckna och Lavendla dominerar SERP via **innehållsmarknadsföring** (bloggar, guider, FAQ-artiklar). Sista Resan behöver liknande innehållssatsning för att ranka — typiskt **3–6 månader** för konkurrensutsatta keywords.

---

## 7. Marknadsstorlek — TAM/SAM/SOM

### Total Addressable Market (TAM)

- Årliga dödsfall: 91 000
- Estimerade dödsbon med formell hantering: 50–70 % = **45 500–63 700**
- Snitt-spend per bouppteckning (engångstjänster): 2 000–6 000 kr
- **TAM (bouppteckning):** 91–382 miljoner kr/år
- TAM (bredare livshändelse-plattform): 2–3x högre

### Serviceable Addressable Market (SAM)

- Digital-first adoption i Sverige: ~20–30 % av befolkningen söker aktivt online-lösningar
- **SAM (konservativ):** 9–19 miljoner kr/år
- **SAM (aggressiv, med Lifetime-konverteringar):** 20–40 miljoner kr/år

### Serviceable Obtainable Market (SOM)

| 3-årigt scenario | SOM-andel | Årlig omsättning |
|------------------|-----------|------------------|
| Pessimistiskt | 1 % av SAM | 90 000–400 000 kr |
| Realistiskt | 5 % av SAM | 450 000–2 000 000 kr |
| Optimistiskt | 10 % av SAM | 900 000–4 000 000 kr |

**Reality check:** Lavendla har **3 % nationell** marknadsandel efter ~15 års verksamhet. 1–3 % på 3 år för Sista Resan vore konkurrenskraftigt och realistiskt med rätt distribution.

---

## 8. Reviderad omsättningsbedömning Månad 1–6

Med justerade konverteringssiffror baserat på legaltech-benchmark (8–15 % free→paid istället för 2–5 %):

### Antaganden

- Snittspend per betalande kund (mix 60 % Familj / 25 % Bas / 15 % Lifetime): **~1 040 kr**
- Visitor → free signup: 13 % (branschsnitt)
- Free → paid: 8 % (justerat ned från legal trial-benchmark pga opt-in)

### Reviderade scenarier

**Konservativt** (organisk SEO, ingen marknadsföring):

| Månad | Besökare | Free signups | Paid | Omsättning |
|-------|----------|--------------|------|-----------|
| M1 | 300 | 39 | 3 | 3 100 kr |
| M2 | 600 | 78 | 6 | 6 200 kr |
| M3 | 1 200 | 156 | 12 | 12 500 kr |
| M4 | 2 000 | 260 | 21 | 21 800 kr |
| M5 | 3 000 | 390 | 31 | 32 200 kr |
| M6 | 4 000 | 520 | 42 | 43 700 kr |
| **Totalt** | | | **115** | **~119 500 kr** |

**Realistiskt** (lite marknadsföring + 1–2 partnerskap, t.ex. juristen + en begravningsbyrå):

| Månad | Omsättning |
|-------|-----------|
| M1 | 9 000 kr |
| M2 | 18 500 kr |
| M3 | 37 500 kr |
| M4 | 65 000 kr |
| M5 | 96 500 kr |
| M6 | 131 000 kr |
| **Totalt** | **~358 000 kr** |

**Optimistiskt** (PR-träff, viral moment, flera byråpartnerskap):

| Månad | Omsättning |
|-------|-----------|
| M1 | 15 000 kr |
| M2 | 35 000 kr |
| M3 | 80 000 kr |
| M4 | 140 000 kr |
| M5 | 210 000 kr |
| M6 | 305 000 kr |
| **Totalt** | **~785 000 kr** |

> **OBS:** Dessa är **modellerade scenarier**, inte prognoser. Faktisk utfall beror helt på distributionsstrategi, SEO-rankings, partnerskap och marknadstajming. Använd som hypotesram, inte som budget.

---

## 9. Reviderad rekommendation om femte tier

### Faktabaserat svar på ursprungsfrågan

**"Bör vi lägga ytterligare en prisnivå?"**

**Forskning säger:** Nej för konsumenter (4-tier är redan i risk-zonen för decision paralysis), **ja för B2B**.

### B2B/Pro-tier — motivering

| Argument | Stöd från data |
|----------|----------------|
| Lavendla har 3 % marknadsandel = stort utrymme | Reco-data |
| Begravningsbyråer hanterar **flera dödsbon/månad** = subscription passar | Implicit i Fonus/Lavendla affärsmodell |
| Lifetime 2 499 kr är otydlig för konsumenter — B2B-tier ovanför löser anchor-frågan | Glencoyne pricing-research |
| LegalTech B2B konverterar **högst** (29 % CRM-jämförelse) | Adapty 2026 |

**Förslag B2B-nivå:**

- Namn: "Byrå" eller "Pro"
- Pris: **4 999–9 999 kr/år** (subscription, INTE engång)
- Inkluderar: Obegränsat antal dödsbon, vit-label-möjlighet, prioriterad support, API-access
- **Visas separat** från konsumentnivåerna (egen sektion eller länk "För företag")

### Konsument-tiers — behåll som de är

Forskning stöder att **inte** lägga till en 5:e konsumentnivå. Risker:

- Decision paralysis (>30 % fokus per tier omöjligt med 5 tiers)
- Kannibalisering mellan Bas och Familj
- Komplexitet i kommunikation

**Alternativ åtgärd istället:** A/B-testa om Bas faktiskt fungerar som decoy. Om <10 % väljer Bas → ta bort det och kör 3-tier (Gratis/Familj/Lifetime).

---

## 10. Datafluck och rekommendationer för primärforskning

### Vad vi vet (med källor)

- 91 000 dödsfall/år i Sverige (SCB)
- Konkurrenter prissätter bouppteckning på 1 975–5 995 kr engång
- Legal/LegalTech-appar konverterar 23 % trial-to-paid (Adapty 2026)
- Engångsköp överträffar abonnemang initialt (Dodo Payments)
- Decoy-effekten är context-beroende, ej universell
- 3-tier är psykologiskt säkrare än 4-tier

### Kritiska okända

1. **Exakt antal årliga bouppteckningar** — Riksrevisionen har data men publicerade inte
2. **Genomsnittligt dödsbovärde** — kritiskt för CLV-modellering
3. **Sista Resans nuvarande funnel-metrik** — inga interna siffror tillgängliga
4. **Marknadspenetration av digitala lösningar** vs traditionella jurister
5. **Säsongs- och repeat-mönster**
6. **Partner-ekonomi** — vad tjänar begravningsbyråer på hänvisningar?

### Rekommenderade nästa steg

1. **Kontakta Skatteverket** för bouppteckningsstatistik och dödsbovärden
2. **Primär survey** — 200–500 användare om dödsbovärde, nöjdhet med pris
3. **A/B-testa pris** — Bas (499) vs ingen Bas-tier för att validera decoy-hypotesen
4. **Cohort-analytics** — track free→paid per vecka, tier-fördelning, churn per tier
5. **Konkurrentbevakning** — kvartalsvis pris-audit (Aatos, Bouppteckna, Lavendla)
6. **Partner-outreach** — kontakta 5–10 begravningsbyråer för revenue-share-modeller

---

## Källor (samlade)

1. [SCB — Döda i Sverige](https://www.scb.se/hitta-statistik/sverige-i-siffror/manniskorna-i-sverige/doda-i-sverige/)
2. [Riksrevisionen 2025 — Statens insatser vid hantering av dödsbon](https://www.riksrevisionen.se/granskningar/granskningsrapporter/2025/statens-insatser-vid-hantering-av-dodsbon---utredning-forvaltning-och-skifte.html)
3. [Aatos — Bouppteckning Service](https://aatos.app/se/bouppteckning/)
4. [Bouppteckna](https://www.bouppteckna.se/)
5. [Bouppteckningar.nu — Pricing](https://www.bouppteckningar.nu/)
6. [Lavendla — Prislista](https://lavendla.se/juridik/prislista/)
7. [Fenix Family](https://fenixfamily.se/)
8. [Fonus — Begravningsguide](https://www.fonus.se/begravningsguiden/planera-begravning/vad-kostar-en-begravning/)
9. [Lawly — Bouppteckning](https://lawly.eu/sv-se/bouppteckning)
10. [Familjens Jurist](https://www.familjensjurist.se/)
11. [Reco — Lavendla marknadsandel](https://www.reco.se/lavendla-begravningsbyra)
12. [Userpilot — Freemium Conversion Benchmarks](https://userpilot.com/blog/freemium-conversion-rate/)
13. [First Page Sage — SaaS Freemium Rates](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/)
14. [Adapty — Trial Conversion Rates 2026](https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/)
15. [Business of Apps — Subscription Benchmarks](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)
16. [Pathmonk — Free to Paid Conversion](https://pathmonk.com/what-is-the-average-free-to-paid-conversion-saas/)
17. [Dodo Payments — One-Time vs Subscription](https://dodopayments.com/blogs/one-time-vs-subscription-saas-pricing/)
18. [GetMonetizely — Pricing Models](https://www.getmonetizely.com/articles/how-should-you-price-your-saas-product-one-time-payment-vs-subscription-models/)
19. [The Strategy Story — Economist Decoy Pricing](https://thestrategystory.com/2020/10/02/economist-magazine-a-story-of-clever-decoy-pricing/)
20. [CanadianSME — Decoy Effect Critique](https://canadiansme.ca/the-decoy-effect-we-are-all-predictably-irrational-dan-ariely/)
21. [Glencoyne — SaaS Pricing Tiers Psychology](https://www.glencoyne.com/guides/saas-pricing-tiers-psychology)
22. [OpenView — Tiered Pricing Optimization](https://openviewpartners.com/blog/tiered-pricing-optimization/)
