# DESIGN.md — Sista Resan (Dödsbohjälpen)

> Estate management for grieving families. Sage green on parchment, Libre Baskerville serif, Tiimo-inspired bubbly cards, grief-aware soft UI.

---

## 1. Visual Theme & Atmosphere

| Attribute | Value |
|-----------|-------|
| Mood | Calm, warm, supportive — like a trusted friend guiding you through a hard time |
| Density | Spacious mobile-first. Single column, generous padding, breathing room between cards |
| Philosophy | Grief-aware minimalism inspired by Japanese aesthetics: **kanso** (simplicity), **ma** (breathing room), **wabi-sabi** (organic imperfection), **omoiyari** (empathy) |
| Dark mode | Full support via `data-theme="dark"` on `<html>` |
| Inspiration | Tiimo (bubbly cards, visual clarity), Notion (warm serif), Japanese zen |

---

## 2. Color Palette & Roles

### Light Mode (default)

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#FAFBF9` | Page background — warm off-white parchment |
| `--bg-card` | `#FFFFFF` | Card surface |
| `--text` | `#1A1A2E` | Primary text — deep ink |
| `--text-secondary` | `#7B7B8E` | Muted labels, helper text |
| `--border` | `#EDECEA` | Subtle card and input borders |
| `--border-light` | `#F5F5F3` | Lighter dividers, hover states |
| `--accent` | `#6B7F5E` | Primary action — sage green |
| `--accent-soft` | `#EEF2EA` | Accent tint for tip backgrounds |
| `--sakura` | `#D4A0A7` | Dusty rose — memorial, emotional content |
| `--sora` | `#8BA4B8` | Soft blue — informational, links |
| `--kohaku` | `#C4956A` | Terracotta — warnings, deadlines, attention |

### Dark Mode

| Token | Hex | Note |
|-------|-----|------|
| `--bg` | `#1A1A2E` | Deep indigo, not pure black |
| `--bg-card` | `#232338` | Soft purple-dark surface |
| `--text` | `#E4E3E0` | Warm light text |
| `--text-secondary` | `#9090A0` | Muted gray |
| `--border` | `#333350` | Dark border |
| `--accent` | `#8FAA82` | Lighter sage for contrast |
| `--accent-soft` | `#2A3340` | Dark tinted surface |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| success | `#6B7F5E` | Same as accent — completed states |
| warn | `#C4704B` | Deadlines, urgent items |
| info | `#6E8BA4` | Tips, neutral information |
| accent-dark | `#5A6E4E` | Pressed/hover accent state |

### Gradient Card Patterns

```css
/* Sage (tips, positive info) */
background: linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02));
border: 1px solid rgba(107,127,94,0.15);

/* Kohaku (warnings, deadlines) */
background: linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02));
border: 1px solid rgba(196,149,106,0.15);

/* Sora (info, links) */
background: linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02));
border: 1px solid rgba(139,164,184,0.15);

/* Sakura (memorial, emotional) */
background: linear-gradient(135deg, rgba(212,160,167,0.06), rgba(212,160,167,0.02));
border: 1px solid rgba(212,160,167,0.15);
```

---

## 3. Typography Rules

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 34px (2.125rem) | 700 | 1.2 | Hero titles |
| H1 | 26px (1.625rem) | 700 | 1.35 | Page titles |
| H2 | 20px (1.25rem) | 700 | 1.5 | Section headings, card titles |
| Body Large | 18px (1.125rem) | 400 | 1.65 | Featured paragraphs |
| Body | 16px (1rem) | 400 | 1.7 | Default text |
| Label | 14px (0.875rem) | 600 | 1.5 | Form labels, badges |
| Small | 12px (0.75rem) | 400 | 1.5 | Captions, metadata |
| Tiny | 10px | 500 | 1.2 | Bottom nav labels |

**Font:** `'Libre Baskerville', Georgia, Cambria, 'Times New Roman', serif`

**Key rule:** Everything is serif. No sans-serif anywhere. Libre Baskerville gives the app a timeless, dignified, paper-like quality befitting estate matters.

**Text scaling:** `--text-scale` CSS variable supports 1×, 1.2× (large), and 1.35× (xlarge) for accessibility.

---

## 4. Component Stylings

### Buttons

**Primary (.btn-primary)**
```
Background: linear-gradient(135deg, #6B7F5E, #5A6E4E)
Text: white, font-semibold, text-sm
Padding: 12px 20px
Min-height: 44px
Border-radius: 9999px (pill)
Shadow: 0 2px 8px rgba(107,127,94,0.15)
Hover: translateY(-1px), shadow → 0 4px 16px rgba(107,127,94,0.25)
Active: scale(0.97)
Focus: 2px solid accent, 2px offset
Disabled: opacity 50%
```

**Secondary (.btn-secondary)**
```
Background: var(--bg-card)
Border: 1.5px solid var(--border)
Text: var(--text), font-semibold
Border-radius: 9999px (pill)
Hover: bg var(--border-light), border-color accent
```

### Cards

**Standard card (.card)**
```
Background: var(--bg-card)
Padding: 16px
Border-radius: 16px (rounded-2xl)
Shadow: 0 2px 8px rgba(26,26,46,0.03), 0 1px 2px rgba(26,26,46,0.02)
Hover: translateY(-1px), enhanced shadow
Transition: 300ms all
```

**Featured card (hero, large containers)**
```
Border-radius: 24px (rounded-3xl)
```

**Tinted cards:** Use gradient patterns from section 2 + `rounded-2xl`.

### Inputs & Textareas

```
Background: var(--bg-card)
Border: 1px solid var(--border)
Border-radius: 16px (rounded-2xl)
Padding: 12px 16px
Focus: ring-2 ring-accent, border-transparent
Placeholder: var(--text-secondary)
```

### Bottom Navigation

```
Shape: pill (rounded-full), fixed bottom center
Background: rgba(255,255,255,0.92) + backdrop-filter blur(20px)
Shadow: 0 4px 20px rgba(26,26,46,0.08), 0 1px 3px rgba(26,26,46,0.04)
Border: 1px solid rgba(232,228,222,0.6)
Max-width: 420px
Layout: vertical icon + label for all items, always visible
Active: accent color, semibold, subtle circular bg rgba(107,127,94,0.12) behind icon
Inactive: var(--text-secondary), normal weight, opacity 70%
```

### Icon Bubbles

```
Sage:  bg rgba(107,127,94,0.12), color #6B7F5E
Blue:  bg rgba(110,139,164,0.12), color #6E8BA4
Warn:  bg rgba(196,112,75,0.12), color #C4704B
```

### Icons

- Library: Lucide React
- strokeWidth: 1.5 default, 2.2 for active nav
- Size: 18–20px standard, 24px navigation

---

## 5. Layout Principles

| Property | Value |
|----------|-------|
| Max content width | 672px (max-w-2xl) |
| Page padding | 16px horizontal (px-4) |
| Card gap | 16–20px |
| Section gap | 24px (mb-6) |
| Top padding | 72px (sticky header clearance) |
| Bottom padding | 96px (pb-24, bottom nav clearance) |
| Grid | Single column on mobile. Always. |
| Spacing base | 4px — scale: 4, 8, 12, 16, 20, 24, 32, 48px |

---

## 6. Depth & Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Flat backgrounds |
| 1 | `0 2px 8px rgba(26,26,46,0.03), 0 1px 2px rgba(26,26,46,0.02)` | Cards at rest |
| 2 | `0 4px 12px rgba(26,26,46,0.05), 0 2px 4px rgba(26,26,46,0.03)` | Cards on hover |
| 3 | `0 8px 30px var(--shadow-color)` | Elevated modals |
| 4 | `0 8px 40px rgba(26,26,46,0.12), 0 2px 8px rgba(26,26,46,0.04)` | Floating nav menu |
| Glass | `rgba(255,255,255,0.92)` + `blur(20px)` | Bottom nav bar |

---

## 7. Do's and Don'ts

### Do

- Use `rounded-2xl` (16px) for cards, `rounded-3xl` (24px) for featured containers, `rounded-full` for pills/buttons
- Use CSS variables for ALL colors — never hardcode hex in JSX components
- Use gradient tinted cards for info/warning/tip boxes (see section 2)
- Keep min touch target 44×44px on all interactive elements
- Add `aria-label` on icon-only buttons and navigation links
- Use subtle transitions (200–300ms) on hover/state changes
- Keep the tone calm and supportive — never urgent or aggressive
- Always use `var(--bg-card)` instead of `bg-white` (dark mode support)
- Always use `var(--border)` via style attribute instead of `border-[#hex]`
- Use Tailwind border-radius classes, never inline `borderRadius`

### Don't

- Don't use sans-serif fonts anywhere
- Don't use harsh shadows or high-contrast borders
- Don't nest interactive elements (buttons inside buttons — a11y violation)
- Don't use red for warnings — use terracotta `--kohaku` instead (less aggressive for grieving users)
- Don't create multi-column grid layouts on mobile
- Don't use exclamation marks in UI copy
- Don't use "Get started!" or aggressive CTA language
- Don't use emojis in the UI (use Lucide icons instead)
- Don't use stock photo aesthetics

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 640px (default) | Single column, full-width cards, 16px padding |
| ≥ 640px (sm) | Slight padding increase |
| ≥ 768px (md) | Max-width container (672px) centered |
| ≥ 1024px (lg) | Generous side margins |

- Touch targets: minimum 44×44px at all breakpoints
- Bottom nav: always visible, fixed pill at bottom
- Sticky header: always present with back navigation
- Safe area: `env(safe-area-inset-bottom)` for iOS home indicator

---

## 9. Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| fadeIn | 300ms | ease-out | Default element entrance |
| slideUp | 400ms | ease-out | Cards appearing, modals |
| pageEnter | 350ms | cubic-bezier(0.22, 1, 0.36, 1) | Page route transitions |
| card-hover | 250ms | cubic-bezier(0.22, 1, 0.36, 1) | Card lift on hover |
| press-effect | 150ms | ease | Button press scale(0.96) |
| shimmer | 1.5s ∞ | ease-in-out | Loading skeletons |
| stagger | +50ms per child | — | Sequential card reveals |
| countUp | 500ms | cubic-bezier(0.22, 1, 0.36, 1) | Number animations |

**Reduced motion:** All animations respect `prefers-reduced-motion: reduce`.

---

## 10. Tone & Copy

- Address user as "du" (informal Swedish), never "ni" or "användaren"
- Short, clear, empathetic
- No exclamation marks
- Frame as support, not instruction:
  - ~~"Fyll i alla fält!"~~ → "Börja med det du vet. Du kan komplettera senare."
  - ~~"Slutför nu!"~~ → "Redo att gå vidare?"

---

## 11. Agent Prompt Guide

**Quick color reference:**
```
Sage green:  #6B7F5E  (accent/primary)
Parchment:   #FAFBF9  (background)
Deep ink:    #1A1A2E  (text)
Muted gray:  #7B7B8E  (secondary text)
Terracotta:  #C4956A  (warnings)
Dusty rose:  #D4A0A7  (memorial)
Soft blue:   #8BA4B8  (info)
Border:      #EDECEA  (subtle lines)
```

**Ready-to-use prompts:**
- "Build a card using dodsbo design — sage accent, Libre Baskerville, rounded-2xl, subtle shadow, var(--bg-card)"
- "Create a warning banner with kohaku gradient, rounded-2xl, terracotta icon bubble"
- "Add a new page: sticky header with back button, single-column max-w-2xl, pb-24 for bottom nav"
- "Style a form: rounded-2xl inputs, var(--border), var(--bg-card), accent focus ring, 44px min-height"
