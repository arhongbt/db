# UX Audit & Research Plan — Sista Resan

> Heuristic evaluation + user research plan for a grief-aware estate management app.
> Date: 2026-04-16

---

## Part 1: Heuristic Audit

Evaluated against Nielsen's 10 Usability Heuristics, WCAG 2.1 AA, and grief-aware design principles from bereavement UX research.

### Methodology

The audit was conducted through code review of 60+ pages, component analysis, and pattern matching across the full codebase. No user testing was performed — that's covered in Part 2.

---

### Finding 1: Lost in the app (Navigation & Wayfinding)

**Heuristic violated:** #3 User Control & Freedom, #6 Recognition Rather Than Recall

**What's wrong:** 38+ pages are accessible only through the "More" menu, which contains 27 items in a 4x-grid with no search or filtering. Guide pages (bank-guide, sarkullbarn, sambo-arv, etc.) have inconsistent back navigation — some have back buttons, others don't. There are no breadcrumbs anywhere. Users who arrive at a deep page have no way to understand where they are in the app hierarchy.

**Why it matters for grieving users:** Cognitive load is already elevated during bereavement. Research shows bereaved individuals experience reduced working memory capacity and attention span (Bonanno, 2009). Forcing users to remember navigation paths or search through 27 unlabeled grid items adds unnecessary friction during the worst time of their lives.

**Evidence:**
- BottomNav "More" menu: 27 items, 4 categories, no search field
- 0 breadcrumb components exist in the codebase
- Guide pages have no consistent back-button pattern
- router.back() could navigate users outside the app entirely

**Severity:** High

**Recommendation:**
- Add search/filter to the More menu
- Add a "Recently used" section (3-4 items) at the top
- Create a consistent PageHeader component with back button
- Add breadcrumbs on all content pages
- Use smart back logic: if referrer is within app, go back; otherwise go to /dashboard

---

### Finding 2: SearchModal accessibility & dark mode gaps

**Heuristic violated:** #4 Consistency & Standards, #7 Flexibility & Efficiency

**What's wrong:** SearchModal.tsx contains 17 instances of hardcoded Tailwind gray colors (text-gray-400, bg-gray-100, border-gray-100, etc.) while the rest of the app uses CSS variables. It breaks in dark mode. No keyboard navigation for results (can't arrow through items). No loading state feedback.

**Why it matters for grieving users:** If someone is using the app late at night in dark mode (common — grief disrupts sleep patterns), a white search modal that flashes in their face is jarring. And if they're looking for something specific ("how do I handle the bank?"), an unresponsive search experience adds frustration.

**Evidence:**
- 17 hardcoded gray references in SearchModal.tsx
- 38 files across the app still contain "gray" references
- No onKeyDown handler for arrow key navigation in results
- No loading/skeleton state during search

**Severity:** Medium-High

**Recommendation:**
- Replace all hardcoded colors with CSS variables
- Add keyboard navigation (arrow keys to move, Enter to select)
- Add a loading skeleton (3 placeholder rows with pulse animation, 150ms debounce)
- Add keyboard shortcuts in footer (arrows, Enter, ESC)

---

### Finding 3: Inconsistent page structure

**Heuristic violated:** #4 Consistency & Standards

**What's wrong:** Each page builds its own header pattern from scratch. Some use large serif titles, others use small uppercase labels. Some have description text, others don't. There's no shared PageHeader or layout component — every page is a snowflake.

**Why it matters for grieving users:** Consistency creates trust. When every page looks slightly different, users subconsciously feel uncertain about whether they're in the right place. Predictable patterns reduce anxiety.

**Evidence:**
- No shared PageHeader component exists
- Header patterns vary: some use font-display, some don't
- Back button placement and style varies between pages
- Title sizing is inconsistent (24px, 20px, 18px across pages)

**Severity:** Medium

**Recommendation:**
- Create a PageHeader component with standardized props (title, subtitle, showBack, action)
- Use it across all 60+ pages for visual consistency
- Standardize title hierarchy: h1 = 24px, section labels = 11px uppercase

---

### Finding 4: Keyboard & screen reader accessibility gaps

**Heuristic violated:** WCAG 2.1 AA — 2.1.1 Keyboard, 4.1.2 Name/Role/Value

**What's wrong:** Many interactive elements use onClick without onKeyDown. The More menu closes via mousedown event (not keyboard-accessible). Expandable sections lack aria-expanded. Some custom buttons are divs without role="button".

**Evidence:**
- BottomNav more menu: closes on mousedown, not keyboard ESC
- 87 aria-label instances found (good baseline, but gaps remain)
- Interactive elements missing keyboard handlers
- Some accordion patterns lack aria-expanded

**Severity:** Medium (legal risk if app is used commercially in EU — EN 301 549)

**Recommendation:**
- Add onKeyDown handlers to all clickable elements
- Add aria-expanded to all toggle elements
- Test with VoiceOver (macOS) and keyboard-only navigation
- Add role="button" to non-button interactive elements

---

### Finding 5: No feedback for empty/error states

**Heuristic violated:** #1 Visibility of System Status, #9 Help Users Recognize & Recover

**What's wrong:** When search returns no results, the message is just "Inga resultat" — no guidance on what to try. There's no loading indicator while search is processing. Empty pages (new user with no documents) show no helpful empty state.

**Why it matters for grieving users:** Dead ends feel terrible. A bereaved person searching for help with "bank" and getting nothing feels abandoned. Empty states are opportunities for gentle guidance.

**Severity:** Medium

**Recommendation:**
- Search: Show helpful text when no results ("Try 'bouppteckning' or browse categories below")
- Add loading skeletons for async content
- Design empty states with gentle, encouraging copy

---

### Finding 6: Border-radius and style inconsistencies (minor)

**Heuristic violated:** #4 Consistency & Standards

**What's wrong:** Three different approaches to border-radius: Tailwind classes (rounded-2xl), inline styles (borderRadius: '28px'), and arbitrary values (rounded-[20px]). Functionally identical, but creates maintenance burden.

**Evidence:**
- BottomNav menu: borderRadius: '28px' (inline)
- Cards: rounded-2xl (Tailwind class = 16px)
- Featured cards: rounded-3xl (Tailwind class = 24px)

**Severity:** Low

**Recommendation:**
- Standardize on Tailwind classes where possible
- Document border-radius scale in DESIGN.md (already partially done)

---

### Audit Summary

| # | Finding | Severity | Heuristic | Effort |
|---|---------|----------|-----------|--------|
| 1 | Navigation & wayfinding | High | #3, #6 | Medium |
| 2 | SearchModal dark mode + a11y | Medium-High | #4, #7 | Low |
| 3 | Inconsistent page structure | Medium | #4 | Medium |
| 4 | Keyboard/screen reader gaps | Medium | WCAG 2.1 | Medium |
| 5 | No empty/error state feedback | Medium | #1, #9 | Low |
| 6 | Border-radius inconsistency | Low | #4 | Low |

---

## Part 2: User Research Plan

### Research Objectives

1. Validate whether the heuristic findings (Part 1) match actual user pain points
2. Understand how grieving users navigate the app and where they get stuck
3. Identify emotional triggers in the UI that cause distress or feel insensitive
4. Discover unmet needs that the current UX doesn't address

### Target Participants

**Primary:** People who have managed a Swedish estate (dödsbo) in the last 2 years.

**Screening criteria:**
- Age 25-70
- Has been responsible for or involved in estate administration
- Mix of: sole administrator vs. multiple heirs, simple vs. complex estates
- Mix of: tech-savvy vs. less comfortable with apps
- Include: at least 2 people who used a competing service (Fenix, Lavendla, manual process)

**Recruitment:** 6-8 participants. Recruit through funeral home partnerships, estate lawyer referrals, or Facebook groups for estate administration.

**Ethical considerations:** Participants are discussing a loss. Sessions must be handled with care. Offer breaks. Never push if someone gets emotional. Provide option to stop at any time.

---

### Study 1: Semi-structured Interviews (Week 1-2)

**Goal:** Understand the emotional and practical journey of estate administration.

**Duration:** 45 min per session, remote (Zoom/Teams)

**Interview Guide:**

**Warm-up (5 min)**
- "Thank you for being willing to talk about this. Before we start — there are no wrong answers, and we can stop at any time."
- "Can you briefly tell me about yourself?"

**Context (10 min)**
- "When did you go through the estate process?"
- "How did you feel when you first had to start dealing with practical matters after the loss?"
- "What was the hardest part — not emotionally, but practically? What felt most overwhelming?"
- "Did you have help? Other heirs, a lawyer, someone else?"

**Navigation & Information needs (15 min)**
- "When you needed to figure out what to do next, where did you go? Google? Ask someone? A specific app?"
- "Think about a specific moment when you were stuck. What were you looking for? How long did it take to find it?"
- "If you used any digital tool, what frustrated you? What worked well?"
- "How did you keep track of what was done and what remained?"

**Prototype reaction (10 min)**
- Show the current app (or screenshots) and ask:
- "What's your first impression?"
- "Where would you tap first?"
- "Does anything here feel confusing or unnecessary?"
- "Does anything feel insensitive or tone-deaf?"

**Emotional design (5 min)**
- "What would make a tool like this feel safe to use?"
- "Is there anything that would make you close the app and not come back?"
- "What tone do you want from an app like this — professional? Warm? Minimal?"

**Wrap-up (5 min)**
- "Is there anything we haven't talked about that you think is important?"
- "Thank you for your time and for sharing this with us."

---

### Study 2: Usability Test (Week 2-3)

**Goal:** Observe how users navigate the app and identify where they get lost.

**Duration:** 30 min per session, moderated, remote (screen share)

**Participants:** 5-6 (can overlap with interview participants)

**Tasks:**

| # | Task | What we're testing | Success metric |
|---|------|-------------------|----------------|
| 1 | "You need to notify the bank about the death. Find how to do that." | Navigation, search, More menu | Found within 60 sec |
| 2 | "You want to see what documents you've already created." | Document section discoverability | Found within 30 sec |
| 3 | "You're unsure about inheritance rights for half-siblings. Find information." | Guide discoverability, search | Found within 90 sec |
| 4 | "You want to go back to the main page from wherever you are." | Back navigation, breadcrumbs | Completed without frustration |
| 5 | "You used the estate inventory tool last week. Find it again." | More menu, recently used | Found within 45 sec |
| 6 | "Switch the app to dark mode." | Settings discoverability | Found within 60 sec |

**Observation protocol:**
- Note: time to complete, number of wrong taps, verbal expressions of confusion
- Ask "think aloud" — have users narrate what they're looking for
- After each task: "On a scale of 1-5, how easy was that?"
- After all tasks: SUS (System Usability Scale) questionnaire

---

### Study 3: Card Sort (Week 2, async)

**Goal:** Validate the More menu's information architecture.

**Method:** Open card sort using OptimalSort or similar tool.

**Cards (27 items from the More menu):**
Testamente, Arvskifte, Dödsboanmälan, Bankbrev, Dödsannons, Fullmakt, Kalender, Begravningsplanering, Skatteverket-guide, Minnesida, Samarbete, Mike Ross, Boka jurist, Delägare, Checklistor, Skanner, Exportera, Påminnelser, Digitala tillgångar, Värdering, Sammanfattning, Fastighet-guide, Särkullbarn, Sambo & arv, Skulder, Deklaration, Priser, Ordlista, FAQ, Konflikter, Internationellt, Företag i dödsbo

**Participants:** 15-20 (can recruit online, doesn't need to be moderated)

**Analysis:** Look for natural groupings that differ from current 4-category structure. Users may group by "phase" (first week, first month, later) rather than by content type.

---

### Study 4: Post-implementation Survey (Week 6-8, after changes)

**Goal:** Measure whether the UX improvements actually helped.

**Method:** In-app survey (3 questions, triggered after 3+ sessions)

**Questions:**
1. "How easy is it to find what you need in the app?" (1-5 scale)
2. "Does the app feel respectful of your situation?" (1-5 scale)
3. "What's one thing that would make this app better for you?" (free text)

**Target:** 50+ responses for statistical relevance.

---

### Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Recruit participants, prepare materials | Interview guide, task scripts |
| 1-2 | Conduct 6-8 interviews | Raw notes, recordings |
| 2 | Run card sort (async) | Card sort results |
| 2-3 | Conduct 5-6 usability tests | Task completion data, SUS scores |
| 3 | Synthesize findings (affinity mapping) | Research report with recommendations |
| 4-5 | Implement changes based on findings | Updated components |
| 6-8 | Deploy + post-implementation survey | Validation data |

---

### What we can implement NOW (validated by heuristics)

These changes are low-risk and backed by established UX principles — they don't need user validation first:

1. **SearchModal: CSS variables + dark mode** — This is a bug fix, not a design choice.
2. **SearchModal: keyboard navigation** — WCAG requirement, not debatable.
3. **SearchModal: loading skeleton** — Standard UX pattern for feedback.
4. **More menu: search field** — 27 items without filtering is objectively too many (Miller's Law: 7±2).
5. **PageHeader: consistent back button** — Users should always be able to go back. This is Nielsen's #3.

These should wait for user validation:

1. **Breadcrumbs** — Users may not need them if other navigation is clear enough.
2. **"Recently used" in More menu** — Need to confirm users actually revisit the same tools.
3. **More menu: category restructuring** — Card sort results should drive this.
4. **Empty state copy** — Tone needs to be validated with actual grieving users.

---

## Appendix: Grief-aware Design Principles

Based on bereavement psychology research (Stroebe & Schut, 1999 — Dual Process Model):

1. **Never rush the user.** Bereaved people oscillate between coping and avoiding. The app should support both modes.
2. **Use gentle language.** "When you're ready" not "Do this now." "Take your time" not "Complete by."
3. **Avoid celebration of completion.** No confetti, no "Great job!" — completing estate tasks is bittersweet.
4. **Provide quiet exits.** Every screen should have an obvious way to leave without commitment.
5. **Minimize decisions.** Reduce choices per screen. Use smart defaults.
6. **Be honest about complexity.** Don't hide that estate administration is hard. Acknowledge it.
7. **Support return visitors.** People may leave mid-task and come back days later. Save state, show where they left off.
