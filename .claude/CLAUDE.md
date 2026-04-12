# Rapportering
Efter varje avslutat arbete (task, feature, fix) ska Claude ALLTID:
1. Sammanfatta kort vad som gjordes
2. Tydligt ange om det är **klart** (inga fler steg) eller om det **behövs mer** (lista vad)
3. Om det deployades — bekräfta att push skedde och länk till Vercel: https://db-three-alpha.vercel.app/

Använd alltid ett av dessa avslut:
- ✅ **Klart** — [vad gjordes], inget mer behövs.
- 🔧 **Behöver mer** — [vad gjordes], nästa steg: [lista].

# graphify
- **graphify** (`skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.
