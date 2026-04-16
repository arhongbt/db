# UX/UI Polish Spec — Sista Resan

> Fas efter hardening. Fokus: visuell polish, flöden & navigation, komponentbibliotek.  
> Datum: 2026-04-16

---

## Scope & principer

Alla ändringar ska följa DESIGN.md: Libre Baskerville serif, sage green `#6B7F5E`, CSS-variabler (`var(--bg)`, `var(--text)`, etc.), `rounded-2xl` kort, pill-knappar, dark mode via `data-theme="dark"`.

**Inga nya features.** Bara polish av det som finns.

---

## 1. Visuell polish — SearchModal

### Problem
`SearchModal.tsx` använder hardkodade Tailwind-grå (`text-gray-400`, `bg-gray-50`, `bg-gray-100`, `border-gray-100`, `text-gray-900`) istället för designsystemets CSS-variabler. Saknar dark mode-stöd, loading-feedback och micro-interactions.

### Nuläge (rad-för-rad)
| Rad | Nuvarande | Problem |
|-----|-----------|---------|
| 139 | `bg-white rounded-2xl` | Hardkodad vit, funkar inte i dark mode |
| 143 | `border-gray-100` | Borde vara `var(--border)` |
| 144 | `text-gray-400` (sökikon) | Borde vara `var(--text-secondary)` |
| 151 | `text-gray-900 placeholder:text-gray-400` | Borde vara `var(--text)` / `var(--text-secondary)` |
| 153 | `hover:bg-gray-100` | Borde vara `var(--border-light)` |
| 161 | `text-gray-400` (inga resultat) | Borde vara `var(--text-secondary)` |
| 168 | `text-gray-400` (populära sökningar label) | Borde vara `var(--text-secondary)` |
| 172 | `bg-gray-100 text-gray-600` (pill-tags) | Borde vara `var(--border-light)` / `var(--text)` |
| 185 | `text-gray-400` (kategori-header) | Borde vara `var(--text-secondary)` |
| 190 | `hover:bg-gray-50` | Borde vara hover med `var(--border-light)` |
| 192 | `bg-gray-100` (ikon-cirkel) | Borde vara `var(--border-light)` |
| 193 | `text-gray-500` (ikon) | Borde vara `var(--text-secondary)` |
| 196 | `text-gray-900` (titel) | Borde vara `var(--text)` |
| 197 | `text-gray-400` (beskrivning) | Borde vara `var(--text-secondary)` |
| 199 | `text-gray-300` (pil) | Borde vara `var(--border)` |
| 207 | `border-gray-100` (footer-border) | Borde vara `var(--border)` |
| 208 | `text-gray-300` (ESC-text) | Borde vara `var(--text-secondary)` med lägre opacity |

### Åtgärder
1. **Byt alla hardkodade färger** till CSS-variabler (via inline style eller Tailwind-extend)
2. **Modal bakgrund**: `var(--bg-card)` istället för `bg-white`
3. **Lägg till `font-display`** (Libre Baskerville) på kategori-headers och modal-titel
4. **Rounded**: Öka till `rounded-3xl` för att matcha Mer-menyns stil (`borderRadius: 28px`)
5. **Micro-interactions**:
   - Resultat-items: `translateY(-1px)` on hover (som cards i designsystemet)
   - Ikon-cirkel: smooth color transition (`transition-all duration-200`)
   - Pill-tags (populära sökningar): subtle scale on tap (`active:scale-[0.97]`)
6. **Loading skeleton**: Visa 3 placeholder-rader med pulse-animation medan `query` uppdateras (debounce 150ms)
7. **Tom-state**: Lägg till en subtil illustration eller ikon + hjälptext
8. **Keyboard navigation**: Highlight aktiv rad med piltangenter, Enter för att välja

---

## 2. Flöden & navigation

### 2a. Mer-menyn — sök & gruppering

**Problem:** 32 items i 4 kategorier utan sökfunktion. Svårt att hitta rätt.

**Åtgärder:**
1. **Sökfält i toppen** av Mer-menyn — filtrera items i realtid (samma mönster som SearchModal)
2. **"Senast använda"** — visa 3-4 senast besökta items överst (spara i state/context, ej localStorage)
3. **Visuell gruppering** — lägg till subtila dividers med gradient-linje mellan kategorier
4. **Collapse/expand** — kategorier kan fällas ihop (default: alla öppna, sparar scroll)

### 2b. Breadcrumbs

**Problem:** Inga breadcrumbs på innehållssidor. Användare tappar kontext.

**Åtgärder:**
1. **Skapa `Breadcrumb.tsx`** — enkel komponent som visar `Hem > Kategori > Sida`
2. **Mapping**: Bygg en route-till-breadcrumb map baserat på `MORE_CATEGORIES` + `SEARCH_INDEX`
3. **Design**: Liten text (`text-xs`), `var(--text-secondary)`, separator `›`, klickbar hem-länk
4. **Placering**: Under sticky header, ovanför sidans h1

### 2c. Back-navigation

**Problem:** Inkonsekvent — vissa sidor har tillbaka-knapp, andra inte. `router.back()` kan ta användaren utanför appen.

**Åtgärder:**
1. **Skapa `PageHeader.tsx`** — standardkomponent med: tillbaka-pil + sidtitel + valfri action-knapp
2. **Smart back**: Om `document.referrer` är inom appen → `router.back()`, annars → `/dashboard`
3. **Konsekvent placering**: Alla innehållssidor använder `PageHeader`

---

## 3. Komponentbibliotek

### Problem
Blandade mönster: inline styles, Tailwind-klasser, CSS-variabler, hardkodade border-radius (`rounded-2xl` vs `rounded-[20px]` vs `borderRadius: '28px'`). Ingen centraliserad komponentfil.

### Åtgärder

#### 3a. Standardisera befintliga CSS-klasser
Kontrollera att `globals.css` har alla nödvändiga utility-klasser:
- `.card` — standard rounded-2xl card
- `.card-featured` — rounded-3xl featured card
- `.card-sage`, `.card-blue`, `.card-warn`, `.card-sakura` — tintade varianter
- `.btn-primary`, `.btn-secondary` — pill-knappar
- `.btn-ghost` — transparent knapp (ny, behövs)
- `.btn-icon` — ikon-knapp med cirkulär bakgrund (ny, behövs)

#### 3b. Skapa React-komponenter i `src/components/ui/`
| Komponent | Fil | Ansvar |
|-----------|-----|--------|
| `Card` | `Card.tsx` | Standard card med variant-prop (`default`, `featured`, `sage`, `blue`, `warn`, `sakura`) |
| `Button` | `Button.tsx` | Pill-knapp med variant (`primary`, `secondary`, `ghost`, `icon`) + size (`sm`, `md`, `lg`) |
| `Input` | `Input.tsx` | Text input med label, error state, focus ring |
| `Breadcrumb` | `Breadcrumb.tsx` | Se 2b ovan |
| `PageHeader` | `PageHeader.tsx` | Se 2c ovan |
| `Skeleton` | `Skeleton.tsx` | Loading placeholder med pulse |
| `Badge` | `Badge.tsx` | Status-badge (success, warn, info, sakura) |

#### 3c. Migrera befintliga sidor
Gå igenom sidorna och byt ut inline-styling mot de nya komponenterna. Prioritet:
1. Dashboard (mest synlig)
2. Bouppteckning (mest komplex)
3. Mer-menyn items-sidor
4. Guider

---

## Implementeringsplan

### Fas 1: Grund (SearchModal + komponenter) — ~4h arbete
| Steg | Uppgift | Filer |
|------|---------|-------|
| 1.1 | Fixa SearchModal — CSS-variabler + dark mode | `SearchModal.tsx` |
| 1.2 | Lägg till micro-interactions i SearchModal | `SearchModal.tsx` |
| 1.3 | Skapa Skeleton-komponent | `Skeleton.tsx` (ny) |
| 1.4 | Skapa Card-komponent | `Card.tsx` (ny) |
| 1.5 | Skapa Button-komponent | `Button.tsx` (ny) |
| 1.6 | Skapa Input-komponent | `Input.tsx` (ny) |
| 1.7 | Skapa Badge-komponent | `Badge.tsx` (ny) |

### Fas 2: Navigation (~3h arbete)
| Steg | Uppgift | Filer |
|------|---------|-------|
| 2.1 | Skapa PageHeader med smart back-nav | `PageHeader.tsx` (ny) |
| 2.2 | Skapa Breadcrumb-komponent + route map | `Breadcrumb.tsx` (ny) |
| 2.3 | Lägg till sökfält i Mer-menyn | `BottomNav.tsx` |
| 2.4 | Lägg till "Senast använda" i Mer-menyn | `BottomNav.tsx` |
| 2.5 | Integrera PageHeader + Breadcrumb på 5 viktigaste sidorna | Diverse page-filer |

### Fas 3: Migration (~3h arbete)
| Steg | Uppgift | Filer |
|------|---------|-------|
| 3.1 | Migrera Dashboard till nya komponenter | `dashboard/page.tsx` |
| 3.2 | Migrera Bouppteckning | `bouppteckning/page.tsx` |
| 3.3 | Audit: sök `bg-gray`, `text-gray`, `border-gray` i alla filer — byt ut | Alla tsx-filer |
| 3.4 | Audit: sök inkonsekvent border-radius — standardisera | Alla tsx-filer |
| 3.5 | Visuell QA i light + dark mode | Manuell check |

### Fas 4: Verifiering
| Steg | Uppgift |
|------|---------|
| 4.1 | Kör `npm run build` — inga errors |
| 4.2 | Testa alla sidor i light + dark mode |
| 4.3 | Verifiera att SearchModal fungerar korrekt med keyboard nav |
| 4.4 | Verifiera breadcrumbs + back-nav på 5+ sidor |
| 4.5 | Deploy till Vercel och smoke-test |

---

## Utanför scope
- Nya features eller sidor
- Backend/API-ändringar
- Prestandaoptimering (lazy loading, code splitting)
- Animationsbibliotek (Framer Motion etc) — vi använder CSS transitions
- Accessibility audit (separat fas)
