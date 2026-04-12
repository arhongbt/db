# SISTA RESAN - Komplett Projektsammanfattning

**Senast uppdaterad:** 2026-04-12
**GitHub:** https://github.com/arhongbt/db.git
**Vercel:** https://db-three-alpha.vercel.app/
**Viktigt:** Skicka alltid koden vid push (`git add -A && git commit -m "..." && git push origin main`)

---

## 1. VAD ÄR SISTA RESAN?

En svensk mobilapp (PWA) som guidar användare genom dödsbohantering steg-för-steg. Byggt med empati i fokus -- appen ska kännas som en vänlig hand, inte en juridisk manual. Tonen är lugn, varm och aldrig stressande.

**Kärnvärde:** "Du behöver inte ha koll på allt just nu. Vi hjälper dig se vad som behöver göras, i vilken ordning, och när det är dags."

---

## 2. TECH STACK

| Vad | Teknik |
|-----|--------|
| Framework | Next.js 14 (App Router) |
| Språk | TypeScript |
| Styling | Tailwind CSS med custom palette |
| Backend | Supabase (auth, PostgreSQL, RLS) |
| Hosting | Vercel |
| Dokument | jsPDF, docx-js, jszip |
| Ikoner | lucide-react |
| PWA | Service Worker, manifest |
| Analytics | Vercel Analytics |

---

## 3. DESIGN SYSTEM -- "Soft Structure"

### Färgpalett (tailwind.config.ts)
```
primary:    #2A2622  (warm charcoal - text)
accent:     #6B7F5E  (sage green - CTA, success)
info:       #6E8BA4  (dusty blue - informational)
warn:       #C4704B  (terracotta - warnings)
background: #F7F5F0  (warm linen - page bg)
surface:    #FFFFFF  (cards)
muted:      #6B6560  (secondary text)
border:     #E8E4DE  (soft borders)
```

### Designregler
- **Bakgrund:** Alla sidor = `bg-background` (#F7F5F0), ALDRIG `bg-white` som sidbakgrund
- **Kort:** `.card` class = vit bg, `rounded-card` (24px), soft shadow, border #F0EDE6
- **Knappar:** `.btn-primary` = sage gradient, `.btn-secondary` = border-style
- **Headers:** Sticky headers ska vara `bg-background`, inte `bg-white`
- **Border-färg:** Alltid `#E8E4DE` (style={{ borderColor: '#E8E4DE' }}), ALDRIG `border-gray-200`
- **Avrundning:** Cards = `rounded-2xl`, inputs = `rounded-xl`
- **Max bredd:** `max-w-lg` (512px) i layout.tsx -- mobilfokuserad design
- **Touch targets:** Minst 44x44px (WCAG)
- **BlobDecoration:** BORTTAGEN från nav-sidor (dashboard, tillgangar, dokument, uppgifter, auth). Finns kvar på landningssidan med z-10 wrapper.
- **Dark mode:** Avaktiverat (`color-scheme: light` i globals.css)

### Komponentmönster
- **MikeRossTip:** Delad komponent i `src/components/ui/MikeRossTip.tsx` -- grön gradient-ikon + förklaringstext
- **BottomNav:** ALLA sidor som nås via nav ska ha `<BottomNav />`. Fixed bottom, warm linen bg.
- **Nästa/Tillbaka:** Inline (INTE fixed), flex gap-3, Tillbaka = border-style, Nästa = btn-primary
- **Toggle:** Av = vänster + grå (#E8E4DE), På = höger + grön (#6B7F5E)

---

## 4. ALLA SIDOR (51 st)

### Landning & Auth
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Startsida | `page.tsx` | Hero, features, FAQ, Mike Ross intro. z-10 content wrapper. |
| Onboarding | `onboarding/page.tsx` | 4-steg: namn+datum, relation, familjesituation, banker |
| Auth | `auth/page.tsx` | Supabase email/lösenord |
| Auth callback | `auth/callback/route.ts` | Supabase OAuth callback |

### Dashboard & Kärn-navigation (BottomNav)
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Dashboard | `dashboard/page.tsx` | Progressring, snabbstats, tidsfrister, smarta uppgifter |
| Att göra | `uppgifter/page.tsx` | Checklista med uppgifter per fas |
| Ekonomi | `tillgangar/page.tsx` | Tillgångar + skulder + försäkringar |
| Dokument | `dokument/page.tsx` | Uppladdade filer |

### Dokumentgenerering
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Bouppteckning | `bouppteckning/page.tsx` | 4-stegs wizard: delägare, tillgångar, skulder, försäkringar. PDF/DOCX export. MikeRossTip tillagd. |
| Arvskifte | `arvskifte/page.tsx` | Arvsordning + fördelning. MikeRossTip tillagd. |
| Arvskifteshandling | `arvskifteshandling/page.tsx` | Generera arvskiftesavtal |
| Bodelning | `bodelning/page.tsx` | Gift/sambo egendomsdelning. Dynamisk MikeRossTip. |
| Bankbrev | `bankbrev/page.tsx` | 4-stegs wizard per bank. Inline Nästa/Tillbaka + BottomNav. |
| Dödsannons | `dodsannons/page.tsx` | 4-stegs annonsbyggare. Inline nav + BottomNav. |
| Dödsboanmälan | `dodsboanmalan/page.tsx` | Förenklad anmälan för små dödsbon |
| Testamente | `testamente/page.tsx` | Testamentesguide |
| Fullmakt | `fullmakt/page.tsx` | Fullmaktsgenerator |
| Kallelse | `kallelse/page.tsx` | Inbjudan till bouppteckningsförrättning |

### Verktyg
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Mike Ross AI | `juridisk-hjalp/page.tsx` | Chatt-UI med AI. bg-background header/input. Bubblor = #EFEDE8. |
| Dokumentskanner | `skanner/page.tsx` | Kamera (mobile) + filuppladdning. BottomNav tillagd. |
| Exportera | `exportera/page.tsx` | ZIP-export av all data. BottomNav tillagd. |
| Påminnelser | `paminelser/page.tsx` | Push-notis toggle + tidsfristöversikt. BottomNav tillagd. |
| Samarbete | `samarbete/page.tsx` | 3 flikar: Beslut, Anteckningar, Tidslinje. 100% localStorage. |
| Delägare | `delagare/page.tsx` | Hantera dödsbodelägare |
| Delägare-portal | `delagare-portal/page.tsx` | Vy för inbjudna delägare |
| Lösöre | `losore/page.tsx` | Personliga tillhörigheter |
| Kostnader | `kostnader/page.tsx` | Dödsbokostnader |
| Försäkringar | `forsakringar/page.tsx` | Försäkringsöversikt |
| Tidslinje | `tidslinje/page.tsx` | Visuell tidslinje |
| Inställningar | `installningar/page.tsx` | App-inställningar |
| Arvskalkylator | `arvskalkylator/page.tsx` | Räkna ut arvslotter |

### Guider & Information
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Nödbroms | `nodbroms/page.tsx` | Första 7 dagarna guide |
| Bank-guide | `bank-guide/page.tsx` | Bankspecifik info (8 banker) |
| Skatteverket | `skatteverket-guide/page.tsx` | Inlämning av bouppteckning |
| Begravning | `begravningsplanering/page.tsx` | Begravningsplanering (kremering borttagen) |
| Minnesida | `minnesida/page.tsx` | Digital minnesida |
| Digitala tillgångar | `digitala-tillgangar/page.tsx` | Sociala medier, abonnemang. bg-background. |
| Deklaration | `deklarera-dodsbo/page.tsx` | 4 kort i 2x2 grid. BottomNav. |
| Fastighet | `dodsbo-fastighet/page.tsx` | Bostadsrätt, villa, hyresrätt |
| Skulder | `dodsbo-skulder/page.tsx` | Skulder i dödsbo |
| Särkullbarn | `sarkullbarn/page.tsx` | Särkullbarns arvsrätt |
| Sambo & arv | `sambo-arv/page.tsx` | Sambolagens regler. bg-white kort. |
| Avsluta konton | `avsluta-konton/page.tsx` | Stäng av tjänster |
| Konflikter | `konflikt/page.tsx` | Tvistlösning |
| Internationellt | `internationellt/page.tsx` | Internationella dödsbon |
| Företag i dödsbo | `foretag-i-dodsbo/page.tsx` | AB/HB/EF i dödsbo. mb-6 på personligt ansvar. |

### Infosidor
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| FAQ | `faq/page.tsx` | Vanliga frågor |
| Ordlista | `ordlista/page.tsx` | Juridiska termer |
| Om oss | `om/page.tsx` | Om Sista Resan |
| Integritetspolicy | `integritetspolicy/page.tsx` | GDPR |
| Villkor | `anvandarvillkor/page.tsx` | Användarvillkor |

### System
| Sida | Fil | Beskrivning |
|------|-----|-------------|
| Invite | `invite/[token]/page.tsx` | Acceptera inbjudan |
| API: AI | `api/juridisk-ai/route.ts` | Mike Ross AI endpoint |
| Error | `error.tsx` | Error boundary |
| 404 | `not-found.tsx` | Sidan hittades inte |
| OG-bild | `opengraph-image.tsx` | Social media preview |
| Sitemap | `sitemap.ts` | SEO |

---

## 5. KOMPONENTSTRUKTUR

### UI-komponenter (`src/components/ui/`)
- `BottomNav.tsx` -- 4 nav items + "Mer" meny med 25+ verktyg i kategorier
- `MikeRossTip.tsx` -- Delad komponent. Props: `text`, `className?`
- `FloatingChatButton.tsx` -- Mike Ross snabbknapp (gömd på dashboard, chat, onboarding)
- `DoveLogo.tsx` -- Duva-logotyp SVG
- `Decorations.tsx` -- BlobDecoration/Leaf/Sparkle (zIndex:0, används bara på landningssidan nu)
- `JuridiskTooltip.tsx` -- Hover/klick tooltip för juridiska termer
- `StepIndicator.tsx` -- Progressprickar
- `OptionCard.tsx` -- Radio/checkbox-kort
- `SkipNav.tsx` -- Tillgänglighet

### Övriga (`src/components/`)
- `ServiceWorkerRegistration.tsx` -- PWA
- `CookieBanner.tsx` -- Cookie-samtycke
- `onboarding/OnboardingFlow.tsx` -- 4-stegs flöde

---

## 6. STATE MANAGEMENT

### Dodsbo-typen (`src/types/dodsbo.ts`)
```typescript
interface Dodsbo {
  id: string;
  deceasedName: string;
  deathDate: string;
  deceasedPersonnummer?: string;
  deceasedAddress?: string;
  deceasedCivilstand?: string;
  onboarding: OnboardingData;
  delagare: Dodsbodelaware[];     // dödsbodelägare
  tillgangar: Tillgang[];          // tillgångar
  skulder: Skuld[];                // skulder
  forsakringar: Forsakring[];      // försäkringar
  tasks: DodsboTask[];             // uppgifter
  losore: LosoreItem[];            // lösöre
  kostnader: Kostnad[];            // kostnader
  currentStep: ProcessStep;        // akut|kartlaggning|bouppteckning|arvskifte|avslutat
  forrattningsdatum?: string;
  forrattningsman?: {name:string}[];
  bouppgivare?: {name:string};
}
```

### Familjesituationer
- `gift_med_gemensamma_barn` -- Gift med gemensamma barn
- `gift_med_sarkullebarn` -- Gift med särkullbarn
- `gift_utan_barn` -- Gift utan barn
- `ogift_med_barn` -- Ogift med barn
- `sambo_med_barn` -- Sambo med barn
- `sambo_utan_barn` -- Sambo utan barn
- `ensamstaende_utan_barn` -- Ensamstående utan barn

### Relationer (13 st)
make_maka, sambo, barn, barnbarn, foralder, syskon, annan_slakting, testamentstagare, god_man, ombud, vardnadshavare, foralder_avliden, van_annan

### Context + Store (`src/lib/context.tsx`, `src/lib/store.ts`)
- `DodsboProvider` wraps alla sidor
- `useDodsbo()` hook ger state + dispatch + loading + synced
- Reducer hanterar ~20 action types
- localStorage som fallback, Supabase som primär

### Supabase Sync (`src/lib/supabase/use-supabase-sync.ts`)
- Laddar dödsbo + barn-tabeller parallellt vid mount
- Wraps dispatch för att synca varje action till Supabase
- Fire-and-forget pattern
- Mutex för dödsbo-row creation

---

## 7. SUPABASE DATABAS

### Tabeller (10 st)
```
profiles        -- Användarprofiler (id, email, full_name)
dodsbon         -- Dödsbon (id, user_id, deceased_name, death_date, onboarding JSONB, current_step)
delagare        -- Dödsbodelägare (dodsbo_id, name, relation, share, is_delagare)
tillgangar      -- Tillgångar (dodsbo_id, type, description, estimated_value, bank)
skulder         -- Skulder (dodsbo_id, type, creditor, amount)
forsakringar    -- Försäkringar (dodsbo_id, type, company, beneficiary, contacted)
tasks           -- Uppgifter (dodsbo_id, step, category, title, status, priority, deadline_days)
dokument        -- Filer (dodsbo_id, category, file_name, storage_path)
invites         -- Inbjudningar (dodsbo_id, token, invited_email, role, status)
dodsbo_members  -- Medlemmar (dodsbo_id, user_id, role: owner|viewer)
```

### Migrationer (`supabase/migrations/`)
- `001_initial.sql` -- profiles, dodsbon, delagare, tillgangar, skulder, forsakringar
- `002_tasks.sql` -- tasks + dokument
- `003_profiles_trigger.sql` -- Auto-create profile on signup
- `004_invites.sql` -- invites + dodsbo_members + RLS
- `005_losore_kostnader.sql` -- lösöre + kostnader (EJ synkade till Supabase ännu)

---

## 8. VIKTIGA LIB-FILER

| Fil | Funktion |
|-----|----------|
| `src/lib/tasks.ts` | `generateTasks()` -- Skapar ~14 personliga uppgifter baserat på onboarding |
| `src/lib/arvsordning.ts` | `getArvsordning()` -- Arvsregler per familjesituation |
| `src/lib/notifications.ts` | Push-notiser + deadlinebevakning |
| `src/lib/personnummer.ts` | Validering av svenska personnummer |
| `src/lib/export-data.ts` | ZIP-export av all data |
| `src/lib/generate-bouppteckning.ts` | Bouppteckningsdokument logik |
| `src/lib/generate-bouppteckning-pdf.ts` | PDF-export med jsPDF |
| `src/lib/generate-bouppteckning-docx.ts` | DOCX-export med docx-js |
| `src/lib/generate-bodelningsavtal.ts` | Bodelningsavtal generator |
| `src/lib/generate-kallelse-docx.ts` | Kallelse till förrättning |

---

## 9. JURIDISKA REGLER (SVENSK LAG)

### Ärvdabalken (1958:637)
- Sambor ärver INTE utan testamente
- Särkullbarn kan kräva sin del direkt (gemensamma barn väntar)
- Laglott = halva arvslotten (kan inte testamenteras bort)
- Man ärver ALDRIG skulder i Sverige

### Tidsfrister
| Deadline | Dagar | Konsekvens |
|----------|-------|------------|
| Dödsbevis | 1 dag | Krävs för allt annat |
| Kontakta bank | 7 dagar | Frysa konton |
| Kolla försäkringar | 14 dagar | Dödsfallsersättning |
| Bouppteckning klar | 90 dagar | Kan ansöka om anstånd |
| Inlämnad till Skatteverket | 120 dagar | Böter vid försening |
| Hyresrätt uppsägning | 180 dagar | 1 månads uppsägningstid |

### Processfaser
1. **Akut** (dag 1-7): Dödsbevis, bank, begravning
2. **Kartläggning** (vecka 1-4): Inventera tillgångar, digitalt, abonnemang
3. **Bouppteckning** (månad 1-3): Formellt dokument
4. **Arvskifte** (månad 3-6): Fördela arvet
5. **Avslutat**: Slutdeklaration, stäng dödsboet

---

## 10. VAD SOM ÄR GJORT (Senaste sessioner)

### Fixade buggar
- [x] Dark mode CSS förstörde hela designen -- borttagen, `color-scheme: light`
- [x] BlobDecoration z-index -- dekorationer låg ovanpå innehåll på alla sidor
- [x] BlobDecoration helt borttagna från dashboard, tillgangar, dokument, uppgifter, auth
- [x] Landningssidans färgbugg -- z-10 wrapper runt allt innehåll
- [x] RELATION_LABELS saknade 3 typer i delagare/page.tsx
- [x] Bankbrev/dödsannons Nästa/Tillbaka -- bytt till inline-mönster
- [x] BottomNav tillagd till: bankbrev, skanner, exportera, påminnelser
- [x] Push-notis toggle: av=vänster grå, på=höger grön
- [x] Deklarera-dodsbo: 4 kort i riktig 2x2 grid
- [x] Företag-i-dodsbo: mb-6 spacing på personligt ansvar
- [x] Mike Ross UI polerad: header, bubblor, chips, upgrade prompt
- [x] Kremering borttagen från begravningsplanering + nödbroms
- [x] Vita headers bytta till bg-background på bankbrev, dödsannons, samarbete
- [x] Digitala tillgångar: bg-white → bg-background
- [x] Sambo-arv: bg-card → bg-white (bg-card existerade inte som färg)
- [x] Samarbete kort: rounded-xl → rounded-2xl
- [x] MikeRossTip delad komponent skapad + tillagd på 4 sidor

### Mike Ross förklaringar tillagda på:
- Startsidan (intro)
- Bouppteckning (förrättningsmän, bouppgivare)
- Arvskifte (arvsordning, laglott, särkullbarn)
- Bodelning (dynamisk: gift/sambo/ingen)

---

## 11. VAD SOM ÅTERSTÅR (Backlog)

### Högt prioriterat
- [ ] **Multi-user samarbete (realtid):** Editor-roll i dodsbo_members, Supabase Realtime för live-uppdateringar, activity log, notifikationer, confirm/claim på tillgångar. Plan utarbetad men EJ påbörjad.
- [ ] **Mike Ross förklaringar på FLER sidor:** Alla sidor med juridiska termer bör ha MikeRossTip. 10 sidor har det redan, ~5-10 sidor saknar det (tex tidslinje, ordlista, fullmakt, kallelse).
- [ ] **Lösöre + kostnader Supabase-sync:** Tabellerna finns (migration 005) men `use-supabase-sync.ts` hanterar inte SET/ADD/REMOVE_LOSORE eller SET/ADD/REMOVE_KOSTNAD.

### Medium prioriterat
- [ ] **Skanner OCR:** Textextraktion funkar inte ännu (placeholder-text sparas). Behöver Tesseract.js eller liknande.
- [ ] **Premium/betalning:** Uppgraderingsknappen i Mike Ross gör inget. Behöver betalflöde.
- [ ] **PDF-export alla dokument:** Inte alla dokumentgeneratorer har PDF-export.
- [ ] **E-postkoppling:** Skicka bankbrev direkt via e-post.

### Lågt prioriterat
- [ ] **Dark mode:** CSS borttaget. Kräver fullständig implementation med CSS custom properties.
- [ ] **Språkstöd:** Bara svenska. Engelska, arabiska, finska efterfrågat.
- [ ] **Offline-first:** Service worker finns men begränsad funktionalitet.

---

## 12. FILSTRUKTUR

```
dodsbo/
├── src/
│   ├── app/                     # 51 page.tsx + layouts + API routes
│   │   ├── layout.tsx           # Root: AuthProvider, FloatingChat, BottomNav-excluded pages
│   │   ├── globals.css          # All global styles, components, print
│   │   ├── page.tsx             # Landing
│   │   ├── dashboard/           # Main hub
│   │   ├── api/juridisk-ai/     # AI endpoint
│   │   └── [40+ feature dirs]/
│   ├── components/
│   │   ├── ui/                  # 10 UI components
│   │   ├── onboarding/          # OnboardingFlow
│   │   ├── ServiceWorkerRegistration.tsx
│   │   └── CookieBanner.tsx
│   ├── lib/
│   │   ├── context.tsx          # DodsboProvider + useDodsbo
│   │   ├── store.ts             # Reducer + actions + localStorage
│   │   ├── tasks.ts             # Task generation
│   │   ├── arvsordning.ts       # Inheritance rules
│   │   ├── notifications.ts     # Push notifications
│   │   ├── personnummer.ts      # Swedish ID validation
│   │   ├── export-data.ts       # ZIP export
│   │   ├── generate-*.ts        # 6 document generators
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── types.ts         # Database types
│   │   │   ├── use-supabase-sync.ts  # State↔DB sync
│   │   │   └── services/        # CRUD per tabell
│   │   └── auth/
│   │       ├── context.tsx       # AuthProvider
│   │       └── safe-use-auth.ts
│   └── types/
│       └── dodsbo.ts            # All TypeScript types + constants
├── supabase/migrations/         # 5 SQL migrations
├── public/                      # PWA manifest, icons, sw.js
├── tailwind.config.ts           # Color palette + typography
├── next.config.js               # Security headers
└── package.json                 # Dependencies
```

---

## 13. MILJÖVARIABLER

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 14. KOM IHÅG

1. **Alltid `bg-background`** som sidbakgrund, aldrig `bg-white`
2. **Alltid BottomNav** på sidor som nås via navigationen
3. **Inline Nästa/Tillbaka** (inte fixed) med matching tema
4. **MikeRossTip** vid juridiska termer -- importera från `@/components/ui/MikeRossTip`
5. **Border-färg `#E8E4DE`** via style-prop, inte Tailwind gray-klasser
6. **Kort = `rounded-2xl`** konsekvent
7. **Testa på mobil** -- appen är 512px max-width
8. **Skicka alltid git-kommandon** efter ändringar
9. **Kremering finns inte** som val i appen
10. **Dark mode avaktiverat** -- rör inte
