# Sista Resan — Design System
## "Lugn klarhet" / Calm Clarity

Inspirerad av Tiimo (mjuka former, visuell tydlighet) och japansk zen-estetik (wabi-sabi, ma, kanso).
Målet: en app som känns handgjord, empatisk och trygg — inte klinisk eller AI-genererad.

---

## Designprinciper

1. **Kanso (enkelhet)** — Ta bort allt onödigt. Varje element måste förtjäna sin plats.
2. **Ma (andrum)** — Generöst med whitespace. Tystnad är också design.
3. **Wabi-sabi (ofullkomlighet)** — Mjuka, organiska former. Inget ska vara för perfekt.
4. **Omoiyari (empati)** — Varje interaktion ska kännas omhändertagande, inte transaktionell.

---

## Färgpalett

### Primära

| Namn | Hex | Användning |
|------|-----|------------|
| Sumi (bläck) | `#1A1A2E` | Primär text, starka rubriker |
| Washi (papper) | `#FAF8F5` | Bakgrund, andrum |
| Kinari (rå silke) | `#F0EBE3` | Kort, ytor, sekundär bakgrund |

### Accenter

| Namn | Hex | Användning |
|------|-----|------------|
| Matcha | `#7A9E7E` | Primär accent, framsteg, klar |
| Sakura | `#D4A0A7` | Notifikationer, empati-element |
| Sora (himmel) | `#8BA4B8` | Länkar, info, sekundär accent |
| Kohaku (bärnsten) | `#C4956A` | Varningar, påminnelser |

### Neutrala

| Namn | Hex | Användning |
|------|-----|------------|
| Hai (aska) | `#6B6B7B` | Sekundär text |
| Kumo (moln) | `#E8E4DE` | Borders, dividers |
| Kiri (dimma) | `#F5F3EF` | Hover-states, subtila ytor |

---

## Typografi

**Font:** Inter (behålls — neutral, läsbar, bra på mobil)

| Element | Storlek | Vikt | Letter-spacing |
|---------|---------|------|----------------|
| H1 (sidrubrik) | 24px | 700 | -0.02em |
| H2 (sektion) | 18px | 600 | -0.01em |
| H3 (kort-rubrik) | 16px | 600 | 0 |
| Body | 15px | 400 | 0.01em |
| Caption | 13px | 500 | 0.02em |
| Label | 11px | 600 | 0.06em (uppercase) |

---

## Spacing (8px grid)

| Token | Värde |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

---

## Komponenter

### Kort (Card)
- **Bakgrund:** Kinari (`#F0EBE3`) — INTE vitt. Ger värme.
- **Border-radius:** 16px (mjukt, organiskt)
- **Border:** ingen — använd subtle shadow istället
- **Shadow:** `0 1px 3px rgba(26,26,46,0.04), 0 4px 12px rgba(26,26,46,0.03)`
- **Hover:** translateY(-1px), shadow ökar subtilt
- **Padding:** 20px mobil, 24px desktop

### Knappar

**Primär:**
- Bakgrund: Matcha → mjuk gradient `linear-gradient(135deg, #7A9E7E, #6B8E6F)`
- Text: Washi (#FAF8F5)
- Border-radius: 12px
- Padding: 14px 24px
- Hover: lyft + shadow, inte färgbyte
- Aktiv: scale(0.98)

**Sekundär:**
- Bakgrund: transparent
- Border: 1.5px solid Kumo
- Text: Sumi
- Hover: bakgrund Kiri

**Ghost:**
- Bara text i Sora-färg
- Underline on hover

### Bottom Nav
- Bakgrund: Washi med subtil top-border i Kumo
- Aktiv ikon: Matcha pill med vit ikon + text
- Inaktiv: Hai-färg, ingen bakgrund
- Höjd: 56px + safe-area

### Info-boxar
- Vänsterkant 3px i accentfärg (Matcha=tips, Sakura=viktigt, Kohaku=varning, Sora=info)
- Bakgrund: accentfärg med 5% opacity
- Rounded: 12px (bara höger sida)

### Progress / Steg
- Linje: 2px Kumo (inaktiv), 2px Matcha (klar)
- Cirkel: 8px fylld Matcha (klar), 8px ring Kumo (framtida), 10px ring Sakura (aktiv/nu)
- Animering: mjuk expand + fade vid completion

---

## Ikoner
- Lucide React (behålls)
- strokeWidth: 1.5 (aldrig 2 — för tjockt känns aggressivt)
- Storlek: 20px standard, 24px i navigation

---

## Mikro-interaktioner
- **Sidövergång:** fade-in 200ms (ingen slide — känns lugnare)
- **Kort hover:** translateY(-1px) + shadow 300ms ease
- **Knapp tryck:** scale(0.98) 100ms
- **Checkbox klar:** mjuk expand + Matcha-fyllning 300ms
- **Siffror/progress:** countUp-animation 600ms ease-out

---

## Mörkt tema
- Bakgrund: `#1A1A2E` (djupt indigo, inte svart)
- Kort: `#232338` (mjukt lila-mörkt)
- Text: `#E8E4DE` (Kumo som textfärg)
- Accent behålls (Matcha, Sakura etc. fungerar på mörkt)

---

## Anti-patterns (vad vi UNDVIKER)
- Perfekt vita kort på beige bakgrund (template-look)
- Identiska grid-kort (variation!)
- Gradients som accent-färg (platt > gradient för zen)
- Emojis i UI (använd ikoner)
- Drop shadows med hög spread (subtilt!)
- Stock-foto-känsla i illustrationer
- "Get started!" / aggressiv CTA-copy

---

## Ton & copy
- Tilltala som "du" (inte "ni" eller "användaren")
- Kort, tydligt, empatiskt
- Undvik utropstecken
- Formulera som stöd, inte instruktion
  - Inte: "Fyll i alla fält!"
  - Utan: "Börja med det du vet. Du kan komplettera senare."
