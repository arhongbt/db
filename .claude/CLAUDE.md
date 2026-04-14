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
