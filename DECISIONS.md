# Decisions

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
