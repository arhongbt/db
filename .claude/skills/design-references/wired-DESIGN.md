# Design System Inspired by WIRED

## 1. Visual Theme & Atmosphere

WIRED's homepage feels like a printed broadsheet that someone has plugged into a wall socket. The grid is dense, the rules are thin, the type is loud, and almost every surface is paper-white or pure black with no rounded corners and no decoration that doesn't earn its place. Image rectangles butt directly against headlines, hairline dividers separate stories the way pica rules separate columns in a real magazine, and the only colors that aren't grayscale come from the photography itself. There is no "card with shadow" anywhere — the entire layout is held together by typographic weight and the discipline of rules and whitespace, the same way a Conde Nast print page would be assembled in a paste-up room.

The signature move is the **typographic stack**: a brutally large custom serif (WiredDisplay) for the main headline, a humanist serif (BreveText) for body and decks, a geometric sans (Apercu) for UI affordances, and a hard mono uppercase (WiredMono) for the kickers, eyebrows, and timestamps that mark every story. That mono kicker — usually black caps with letter-spacing wide enough to read as a Geiger-counter tick — is what makes a WIRED page instantly recognizable from across the room.

There is exactly one accent color that matters: a saturated link blue (`#057dbc`) that lights up underlined hover states like a CRT scanline. Everything else is black, paper white, and two grays — the design's confidence comes from refusing to invent more.

**Key Characteristics:**
- Newsstand-density editorial grid: rules and whitespace, never cards or shadows
- Custom serif display + technical mono kickers — the Conde-Nast-meets-engineering-lab voice
- Strictly square corners on every image, container, and ribbon (only icon buttons are circular)
- 2px hard black borders on buttons and links — printerly, not webby
- Mono ALL-CAPS eyebrows on every story with wide tracking (0.9-1.2px)
- Single ink-blue accent for links; everything else lives in pure grayscale
- Dark theme = the *footer*, not the page; the page itself is committed paper-white

## 2. Color Palette & Roles

### Primary (Editorial Ink)
- **WIRED Black** (`#000000`): Pure ink for ribbons, section dividers, button borders, headline rules — the strongest hand on the page.
- **Page Ink** (`#1a1a1a`): Near-black used for headlines and body type. Slightly softened so long-form reading doesn't feel like staring at a power button.
- **Paper White** (`#ffffff`): Default canvas for the entire site. Treat it like newsprint stock — uninterrupted, never tinted.

### Secondary (Editorial Voice)
- **Link Blue** (`#057dbc`): The single brand accent. Used for inline link hovers, breadcrumbs, and the rare button — never for backgrounds, never decorated. Think of it as the only color allowed in a black-and-white film.

### Surface & Background
- **Newsprint** (`#ffffff`): Editorial pages, story grids, hero zones.
- **Footer Ink** (`#1a1a1a`): The only inverted region on the homepage. Paper white type sits on top.
- **Hairline Tint** (`#e2e8f0`): Reserved for `<hr>` elements between sections — barely visible, like a margin rule.

### Neutrals & Text
- **Headline Black** (`#1a1a1a`): All H1/H2 display type.
- **Body Gray** (`#1a1a1a`): Long-form body text — same ink as headlines for unity.
- **Caption Gray** (`#757575`): Secondary metadata: bylines, timestamps, photo credits.
- **Disabled Gray** (`#999999`): Inactive links, low-priority labels.
- **Hairline Border** (`#e2e8f0`): Subtle separators only.

### Semantic & Accent
- **Brand Hover Blue** (`#057dbc`): Link rollover state — also serves as the only "interactive" cue.

### Gradient System
None. WIRED uses zero gradients.

## 3. Typography Rules

### Font Family
- **WiredDisplay** (custom serif, fallback `helvetica`) — Display headlines and feature titles.
- **BreveText** (humanist serif, fallback `helvetica`) — Article body, decks, longer captions.
- **Apercu** (geometric sans, fallback `helvetica`) — UI labels, buttons, navigation, mid-weight headings.
- **WiredMono** (custom monospace, fallback `helvetica`) — Eyebrows, kickers, timestamps, section labels, ALL CAPS.
- **Inter** (sans, system fallback) — Utility UI in newer modules.
- **ProximaNova** (sans, fallback `helvetica`) — Legacy UI surfaces.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display Headline (Hero) | WiredDisplay | 64px / 4.00rem | regular | 0.93 | -0.5px | Tight, almost touching descenders — newsstand presence |
| Display Headline (Mobile / Mid) | WiredDisplay | 26px / 1.63rem | regular | 1.08 | — | Same face, scaled down for grid blocks |
| Section Heading | Apercu | 20px / 1.25rem | 700 | 1.20 | -0.28px | Bold sans for module titles |
| Subheading | Apercu | 17px / 1.06rem | 700 | 1.29 | -0.144px | Story decks within feature blocks |
| Article Deck (Serif) | BreveText | 19px / 1.19rem | regular | 1.47 | 0.108px | Long-form lead paragraphs |
| Article Body (Serif) | BreveText | 16px / 1.00rem | regular | 1.50 | 0.09px | Standard paragraph text |
| UI Heading | Apercu | 16px / 1.00rem | 700 | 1.25 | 0.3px | Inline UI labels, button captions |
| Button Label | Apercu | 16px / 1.00rem | 700 | 1.25 | 0.3px | All caps optional |
| Link (Inline UI) | Apercu | 14px / 0.88rem | regular | 1.29 | 0.4px | Footer links, secondary nav |
| Eyebrow / Kicker | WiredMono | 13px / 0.81rem | regular | 1.23 | 0.92px | UPPERCASE — story category above headline |
| Section Ribbon | WiredMono | 12px / 0.75rem | 700 | 1.00 | 1.2px | UPPERCASE — black-bar section labels |
| Photo Caption | BreveText | 12.73px / 0.80rem | 700 | 2.20 | 0.108px | Generous leading — print-photo treatment |
| Timestamp / Meta | WiredMono | 12px / 0.75rem | regular | 1.33 | 1.1px | UPPERCASE, "X HOURS AGO" markers |
| Tertiary Footer Link | ProximaNova | 11px / 0.69rem | regular | 1.45 | — | Newsletter footer, legal links |

### Principles
- **Four faces, four jobs.** WiredDisplay is for shouting, BreveText is for reading, Apercu is for clicking, WiredMono is for labeling. They never trade roles.
- **Tight headlines, generous body.** Display type runs as low as 0.93 line-height, while body BreveText opens out to 1.47-1.50.
- **Mono is always uppercase.** Every WiredMono usage carries `text-transform: uppercase` and 0.9-1.2px letter-spacing.
- **Bold is rare.** Apercu uses weight 700 only for UI emphasis; the editorial layer leans entirely on size and ink color.
- **Letter-spacing has two registers**: positive (0.9-1.2px) for ALL-CAPS mono, negative (-0.144 to -0.5px) for large display serif.

### Note on Font Substitutes
If you substitute WiredDisplay with **Playfair Display** or **Libre Caslon**, loosen display line-heights by approximately **+0.10 to +0.12**. Apercu substitutes (Inter, Work Sans, Manrope) work at the token values without adjustment.

## 4. Component Stylings

### Buttons

**Primary CTA — Black Outline ("Subscribe")**
- Background: `#ffffff` (Paper White)
- Text: `#000000` (WIRED Black), Apercu 16px / 700 / 0.3px tracking
- Border: `2px solid #000000`
- Border radius: `0` (square corners)
- Padding: vertical ~12-14px, horizontal ~24px
- Hover: background flips to `#000000`, text flips to `#ffffff` — pure inversion
- Transition: ~150ms color/background only

**Secondary — Inverted (in dark zones)**
- Background: `#000000`
- Text: `#ffffff`
- Border: `2px solid #ffffff`
- Same square corners, same inversion-on-hover behavior

**Pill / Round Icon Button**
- Border radius: `50%` (the only circular shape on the site)
- Used exclusively for icon controls (search, account, social)
- Size: ~32-40px square footprint

### Cards & Containers
- **Cards do not exist.** A "story tile" is just an image rectangle stacked above a kicker + headline + deck, separated from neighbors by **1px hairline rules** or by raw whitespace.
- Hover: the headline link text shifts from `#1a1a1a` to `#057dbc`. The image does not zoom, lift, or shadow.

### Inputs & Forms
- **Newsletter input**: rectangular, `2px solid #000000` border, `0` radius, white background, Apercu 16px placeholder.
- **Focus**: border stays 2px black, no glow ring.

### Navigation
- **Top utility bar**: black (`#000000`) full-bleed strip, ~32-40px tall, mono caps links, `#ffffff` text, hover -> `#057dbc`.
- **Main nav**: paper-white row beneath the bug logo, Apercu 14-16px / regular, hover -> `#057dbc` underline.
- **Logo**: WIRED bug, ~209x42px, always pure black on white.
- **Mobile**: nav collapses to a hamburger left of the bug logo.

### Image Treatment
- **Corners**: ALWAYS 0 radius. Square.
- **Full-bleed**: hero photographs run edge-to-edge of the column they occupy.
- **Hover**: no zoom, no opacity dip — only the headline responds.

### Editorial Ribbons & Section Markers
- Black bar (`#000000`) full-bleed with white WiredMono uppercase label inside.
- Height ~32-40px.

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Section padding**: typically 32-48px vertical between major editorial blocks.
- **Inline spacing**: kickers sit ~4-8px above headlines; decks sit ~8-12px below.

### Grid & Container
- **Max width**: ~1280-1600px on desktop, centered.
- **Column patterns**: 12-column grid resolving into 2/3/4 column story arrangements.
- **Column gutters**: ~24-32px, separated by hairline rules.

### Whitespace Philosophy
WIRED treats whitespace the way a magazine art director treats margin: enough room to keep adjacent stories from arguing, never enough to suggest there's nothing on the page.

### Border Radius Scale
- `0` — every container, every image, every button, every input. The default.
- `1920px` — only inside text spans that need to look like a full pill.
- `50%` — only on round icon buttons and circular author avatars.

Three radii total. The **strictest** corner discipline of any major editorial property.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow, no border | Default editorial surface |
| 1 | 1px solid `#e2e8f0` hairline | Quiet section divider |
| 2 | 1px solid `#000000` hairline rule | Editorial column divider |
| 3 | 2px solid `#000000` border | Buttons, inputs, ribbons |
| 4 | Black ribbon bar (`#000000` fill) | Section labels |
| 5 | Inverted footer block | Dark `#1a1a1a` zone with white type |

WIRED's depth philosophy is **flat by religion**. No `box-shadow` is applied anywhere. Depth is communicated by **rule weight** (1px hairline -> 2px hard rule -> solid black ribbon).

## 7. Do's and Don'ts

### Do
- **Do** use 2px hard black borders on every primary button — no 1px softness, no rounded edges.
- **Do** put a WiredMono ALL-CAPS kicker above every story headline.
- **Do** use BreveText for any paragraph longer than two lines — Apercu is for UI, not reading.
- **Do** keep images square-cornered, edge-to-edge.
- **Do** separate story tiles with hairline rules or whitespace, never with cards or shadows.
- **Do** use `#057dbc` link blue exclusively for hover states.
- **Do** scale headlines aggressively: 64px on hero, 26px on grid blocks.

### Don't
- **Don't** add `box-shadow` to anything. Ever.
- **Don't** round corners on rectangular containers — `border-radius: 0` is law.
- **Don't** mix typefaces inside one role.
- **Don't** use color outside grayscale + `#057dbc`.
- **Don't** use Apercu in lowercase for kickers — that's WiredMono's job, UPPERCASE.
- **Don't** use gradients, blurs, glassmorphism, or atmospheric effects.
- **Don't** rely on hover lift effects. WIRED's hover is a color swap on text, nothing more.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <375px | Single column, hamburger nav, all hero modules collapse |
| Mobile | 375-767px | Single column, story grid becomes vertical scroll |
| Tablet | 768-1023px | 2-column story grid, sidebar collapses |
| Desktop | 1024-1599px | Full editorial 3-4 column grid, sidebar restored |
| Large Desktop | >=1600px | Page caps at ~1600px container |

### Touch Targets
- Primary button: ~44x44px minimum.
- Round icon buttons: ~40px circles.

### Collapsing Strategy
- **Nav**: utility bar drops below 768px; main nav collapses into hamburger drawer.
- **Grid**: 4-col -> 3-col -> 2-col -> 1-col. Hairline rules persist.
- **Type**: WiredDisplay hero scales from 64px to ~36-42px on mobile. Mono labels stay pinned at 12-13px.

### Image Behavior
- All images are responsive raster (`srcset`-driven), aspect ratios preserved.
- `loading="lazy"` on all below-the-fold imagery.

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary Ink**: "WIRED Black (`#000000`)"
- **Page Canvas**: "Paper White (`#ffffff`)"
- **Headline / Body Text**: "Page Ink (`#1a1a1a`)"
- **Caption / Metadata**: "Caption Gray (`#757575`)"
- **Hairline / Quiet Border**: "Hairline Tint (`#e2e8f0`)"
- **Link Hover Accent**: "Link Blue (`#057dbc`)"

### Example Component Prompts
1. *"Create an editorial story tile with a 16:9 image (square corners), an UPPERCASE WiredMono kicker in `#1a1a1a` above a 26px WiredDisplay headline. Separate the tile from its neighbor with a 1px black hairline rule. No card, no shadow, no border-radius."*
2. *"Design a primary subscribe button with a 2px solid `#000000` border, square corners, `#ffffff` background, Apercu 16px / 700 / 0.3px tracking text in `#000000`. Hover state inverts to black background with white text in 150ms."*
3. *"Build a 'Most Popular' module: full-bleed black ribbon header with WiredMono uppercase label in white, followed by a numbered list using 40px WiredDisplay numerals and 17px Apercu 700 headlines, separated by hairline rules."*

### Iteration Guide
1. **Audit corners first.** If you see any `border-radius` other than `0`, `50%`, or `1920px`, flatten it.
2. **Audit shadows.** Strip every `box-shadow`. Use a 2px black border or hairline rule instead.
3. **Audit typeface roles.** WiredDisplay = headlines, BreveText = reading body, Apercu = UI, WiredMono = ALL-CAPS labels.
4. **Audit color sprawl.** Only `#000`, `#1a1a1a`, `#757575`, `#e2e8f0`, `#ffffff`, `#057dbc` in chrome.
5. **Audit kickers.** Every story needs an UPPERCASE mono kicker.
6. **Audit rules.** Add hairline `1px solid #000` dividers wherever two stories meet without a clear visual break.
