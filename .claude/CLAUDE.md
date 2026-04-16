# Rapportering
Claude ska ALLTID rapportera proaktivt — användaren ska aldrig behöva fråga "är du klar?" eller "hur går det?".

## Under arbete
- Rapportera kort vad du gör INNAN du börjar varje delsteg
- Om något tar tid (>30 sek), ge en kort statusuppdatering
- Om du fastnar eller byter strategi — säg det direkt

## När ett steg är klart
Efter varje avslutat arbete (task, feature, fix) ska Claude ALLTID:
1. Sammanfatta kort vad som gjordes
2. Tydligt ange om det är **klart** (inga fler steg) eller om det **behövs mer** (lista vad)
3. Om det deployades — bekräfta att push skedde och länk till Vercel: https://db-three-alpha.vercel.app/
4. Om det finns nästa naturligt steg — föreslå det

Använd alltid ett av dessa avslut:
- ✅ **Klart** — [vad gjordes], inget mer behövs.
- 🔧 **Behöver mer** — [vad gjordes], nästa steg: [lista].

## Viktigt
- Tystnad = dåligt. Rapportera ALLTID, även mitt i arbete.
- Användaren ska kunna följa med i realtid utan att fråga.

# graphify
- **graphify** (`skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

# Superpowers (obra/superpowers)
Development workflow skills installed in `.claude/skills/superpowers/`. Use these for structured development:

- **writing-plans** — Create implementation plans before coding. Read `skills/superpowers/writing-plans/SKILL.md`
- **executing-plans** — Execute plans step by step with subagents. Read `skills/superpowers/executing-plans/SKILL.md`
- **brainstorming** — Structured brainstorming with visual companion. Read `skills/superpowers/brainstorming/SKILL.md`
- **subagent-driven-development** — Dispatch work to subagents with review. Read `skills/superpowers/subagent-driven-development/SKILL.md`
- **systematic-debugging** — Structured debugging methodology. Read `skills/superpowers/systematic-debugging/SKILL.md`
- **test-driven-development** — TDD workflow. Read `skills/superpowers/test-driven-development/SKILL.md`
- **requesting-code-review** — Request code review from a subagent. Read `skills/superpowers/requesting-code-review/SKILL.md`
- **verification-before-completion** — Verify work before marking done. Read `skills/superpowers/verification-before-completion/SKILL.md`
- **dispatching-parallel-agents** — Run multiple agents in parallel. Read `skills/superpowers/dispatching-parallel-agents/SKILL.md`
- **writing-skills** — Create new skills. Read `skills/superpowers/writing-skills/SKILL.md`

# Design System
See `DESIGN.md` in project root for complete design tokens (Google Stitch format).
Key: Libre Baskerville serif, sage green #6B7F5E, rounded-2xl cards, rounded-3xl featured, pill buttons.
