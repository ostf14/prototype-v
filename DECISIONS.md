# Decisions

## 2026-05-27 — Progressive disclosure instead of a Simple/Advanced mode switch

**Decision:** One form. Complexity reveals itself through user actions: paste a URL, click _Add lander_, click _Add path_, switch the Distribution dropdown. No top-level Simple/Advanced toggle.

**Rationale:** Voluum today ships two separate forms ("Simple" and "Advanced") that confuse users. A mode switch perpetuates the split. Progressive disclosure keeps the muscle memory of the simple path intact while letting power users unlock layers in place.

**Trade-off:** Slightly more state-management complexity in the canvas (the same component renders four very different layouts). Worth it for the UX.

---

## 2026-05-27 — Interactive code prototype instead of Figma

**Decision:** Built in Next.js + Tailwind + zustand rather than Figma frames.

**Rationale:** The interesting parts of this redesign are interaction quality — adding a path, switching split mode, editing weights inline, scrolling slot tracks horizontally with sticky labels. Those don't survive translation into static frames. A code prototype also stress-tests the data model the real product would need.

**Trade-off:** Higher up-front cost. Visual polish in places where Figma would have been faster (e.g. the campaign detail page is intentionally minimal).

---

## 2026-05-27 — Condition gate left of slots, not chip after the offer

**Decision:** In rule-based mode, each path row begins with a `WHEN` gate (priority number + condition list) to the left of the lander/offer cards. The previous design — a chip appended after the offer — was removed.

**Rationale:** Reading left-to-right, the gate is the precondition for the flow that follows; placing it before the flow matches the mental model ("when X happens, route through these slots"). The trailing-chip variant required the eye to jump back left after parsing the slots. It also collided with the path's right-side controls (weight, remove).

**Trade-off:** The path-row grows wider on the left, so the slot track has less horizontal room before scrolling kicks in. Mitigated by the sticky-left + horizontal-scroll pattern (see below).

---

## 2026-05-27 — Slot weights visible inline on the canvas

**Decision:** For 2–9-item slots, each item renders as a micro-row inside the card with its weight shown next to the name and click-to-edit on the weight value. The popover holds add/remove/reorder/rotation only — weights are not editable there.

**Rationale:** The weight is the most-tweaked attribute of a multi-item slot. Hiding it behind a popover meant two clicks (open, edit) and broke the "see the distribution at a glance" property of the canvas. Surfacing weights inline turns the card itself into the editor.

**Trade-off:** The lander card grows taller with more items. Offer slot is kept fixed at the single-item compact size because offer rotation is rare in practice; mixing variable-height lander stacks with fixed offers also gives the arrow a consistent connection point.

---

## 2026-05-27 — `Advanced` section labeled `Optional`

**Decision:** The Advanced section header carries a small `Optional` badge in the muted token color, not the accent.

**Rationale:** The badge is an honest hint that nobody _has_ to open this section, in contrast to General and Destination which are required for a working campaign. The muted color keeps the badge from competing for attention with a `Modified` badge on Tracking & Redirects. Labeling it would have implied parity with the required sections.

**Trade-off:** A user who needs anti-fraud or daily-cap might not notice these settings exist on first pass. Acceptable because the form is for affiliate marketers who already know their tooling.

---

## 2026-05-27 — Single source of truth for the path label (`getPathLabel`)

**Decision:** `lib/utils.ts` exports `getPathLabel(index, pathCount, splitMode)`. Both the canvas (path-row) and the Issues panel use it.

**Rationale:** Before this helper existed, the validator emitted "Path 3 has no offer" while the canvas rendered the same path as `ELSE — all other traffic`. The internal array index leaked into UI copy. Centralizing the label keeps the two surfaces aligned.

**Trade-off:** Adds an import dependency from the validator into utils, but utils has no upstream coupling.

---

## 2026-05-27 — Shared horizontal-scroll container, no scrollLeft sync via refs

**Decision:** All path rows live inside one `overflow-x-auto` element. Each row's left column (drag handle + label or condition gate) is `position: sticky; left: 0`.

**Rationale:** A single scroll container means `scrollLeft` is automatically shared across rows — slot columns stay vertically aligned without any ref-based syncing code. CSS sticky handles the fixed left column. No JS scroll listeners, no `ResizeObserver`.

**Trade-off:** `framer-motion`'s `layout` on row enter/exit creates a transformed containing block which can in theory affect sticky behavior. In practice modern browsers resolve sticky against the nearest scrolling ancestor, and the transform animation only fires on add/remove. No jitter observed.

---

## 2026-05-27 — `Section` primitive without `overflow-hidden`

**Decision:** The reusable `Section` component does not put `overflow-hidden` on its root. Header and body each carry their own `rounded-t-md` / `rounded-b-md` so the rounded outer border isn't compromised.

**Rationale:** With `overflow-hidden` on the root, any `position: absolute` popover inside a form row (Traffic source dropdown, Country dropdown, slot popover) was clipped at the section's bottom edge. The visual cost of moving the corner-rounding from a single ancestor to two children is negligible; the unlock is that popovers escape the section.

**Trade-off:** Two extra classes on the children. Acceptable.

---

## 2026-05-15 — Manual scaffold instead of create-next-app

**Context:** `create-next-app` validates the folder name against npm package name rules. The working directory "Test Voluum" has spaces and capital letters, causing it to abort.

**Decision:** Manually authored `package.json` (name: `voluum-redesign`), `tsconfig.json`, `next.config.ts`, and `postcss.config.mjs`.

**Rationale:** Gives full control over dependency versions and avoids hacks like a temporary directory + move. Tailwind v4 also requires manual setup anyway (`@tailwindcss/postcss` instead of a `tailwind.config.js`).

---

## 2026-05-15 — Bottom action bar uses fixed positioning with left offset

**Context:** The create form has a sticky bottom action bar. With the sidebar expanded at 240px (w-60), the bar must clear the sidebar.

**Decision:** Used `left-60` (240px) on the fixed action bar. This breaks if the sidebar is collapsed. A better approach for production would be to pass sidebar state, but for a prototype this is acceptable.

**Rationale:** Simpler than a portal-based approach. Documented here as a known limitation.

---

## 2026-05-15 — No form library (react-hook-form / zod)

**Context:** The form is highly dynamic: adding paths, slots, and switching between split modes changes the shape of the data significantly.

**Decision:** Form state lives entirely in the zustand `draft` slice. Validation only on submit.

**Rationale:** Per PROMPT.md and CLAUDE.md specifications. Schema-based validation would require re-defining the schema on every structural change.

---

## 2026-05-15 — Slot picker is a custom modal, not cmdk directly

**Context:** `cmdk` was available but requires wrapping to integrate with zustand slot targeting.

**Decision:** Built a custom modal that mimics cmdk's keyboard UX (`↑↓↵Esc`) without using the cmdk library. The command palette (Cmd+K) uses the same component.

**Rationale:** Avoids fighting cmdk's internal state model. The prototype's UX requirements are met with simpler code.

---

## 2026-05-15 — Tailwind v4 CSS-first config in globals.css

**Context:** Tailwind v4 moves from `tailwind.config.js` to an `@theme {}` directive in the main CSS file.

**Decision:** All design tokens defined in `app/globals.css` via `@theme {}`. No `tailwind.config.js` exists.

**Rationale:** Per CLAUDE.md specification and Tailwind v4's intended usage pattern.
