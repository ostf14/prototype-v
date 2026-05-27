# CLAUDE.md

This file is automatically read by Claude Code at the start of every session in this repository. It contains project context, conventions, and operating rules. Follow it strictly.

---

## Project

**Prototype V** — interactive prototype of a unified campaign creation flow for a performance marketing tracker. Visual polish and interaction quality matter as much as correctness. Pure frontend, no backend.

---

## Stack & Versions

- **Next.js 15** (App Router, RSC where appropriate, but most components are client)
- **TypeScript** — strict mode, no `any` without explicit reason in a comment
- **Tailwind CSS v4** (CSS-first config in `globals.css` via `@theme`, NOT `tailwind.config.js`)
- **shadcn/ui** — install via `npx shadcn@latest add <component>`, do not handwrite primitives that exist
- **lucide-react** for icons (no other icon libraries)
- **@dnd-kit/core + @dnd-kit/sortable** for drag-and-drop
- **zustand** for global state, with `persist` middleware to localStorage
- **framer-motion** for layout transitions
- **sonner** for toasts
- **cmdk** for command palette
- **next/font** for Inter and JetBrains Mono

Package manager: **pnpm**. Use `pnpm add`, `pnpm dlx`, never `npm` or `yarn`.

---

## Design Language — non-negotiable rules

This is a DevTool-minimalism prototype (Linear / Vercel / Stripe Dashboard). The visual language is as important as functionality.

**DO:**
- 1px borders at low opacity (`border-border` token) for separation
- Spacing and typography hierarchy for structure
- Dark mode as default
- Compact density: 32px row heights, 14px base font
- Monospace for URLs, tokens, IDs, numeric data in tables
- Subtle hover states (background shift, no large transforms)
- Smooth `framer-motion layout` transitions on add/remove/expand

**DO NOT:**
- Drop shadows on cards (use borders)
- `rounded-xl` or `rounded-2xl` (max `rounded-md` = 6px)
- Gradients (single accent color only)
- Unnecessary container borders or nested cards
- Emoji in UI chrome (only as traffic source icons in mock data)
- Confetti, success animations, exclamation marks
- Brand colors beyond the single green accent
- Bold weights (use `font-medium` for emphasis)

---

## Color & Token System

Tokens are defined in `app/globals.css` via Tailwind v4's `@theme` directive. Always reference tokens, never raw hex:

```
bg-bg, bg-surface, bg-surface-2
border-border, border-border-strong
text-text, text-text-muted, text-text-subtle
text-accent, bg-accent, bg-accent-muted
text-warning, text-danger, text-info
```

Status colors are reserved:
- `accent` (green): active, success, primary actions
- `warning` (amber): paused, validation warnings
- `danger` (red): destructive actions, errors
- `info` (blue): informational badges only
- `text-subtle`: archived, disabled, drafts

---

## File & Folder Conventions

- **Components**: `kebab-case.tsx` files, `PascalCase` exports
- **One component per file** except trivial sub-components used only in the parent
- **Co-locate**: keep `destination-canvas/*` together rather than splitting by type
- **Server vs Client**: default to Server Components. Add `"use client"` only when needed (state, effects, event handlers)
- **Types**: shared types in `lib/types.ts`. Component-local types live with the component.
- **No barrel files** (`index.ts` re-exports) — they break tree-shaking and add noise
- **Imports**: absolute via `@/` alias, ordered: react/next → external → internal → relative → types → styles

---

## State Management Rules

- **Server state**: there is none. This is a pure prototype.
- **Global UI state** (current draft, density mode, opened popovers): zustand store in `lib/store.ts`
- **Local component state**: `useState` for things that don't escape one component (open/close of a single popover, hover state)
- **Form state**: lives in the zustand `draft` slice, NOT in react-hook-form. The form is too dynamic for schema-based form libraries.
- **Persistence**: `draft` and `campaigns` are persisted to localStorage. Other UI state is ephemeral.
- **Selectors**: components subscribe with narrow selectors to avoid re-renders. Example:

```ts
const pathCount = useStore((s) => s.draft.paths.length);
```

---

## TypeScript Discipline

- Strict mode is on. Don't disable it.
- `any` is forbidden except with `// reason: <why>` comment
- Discriminated unions for variant states (e.g., `SplitMode`)
- `as const` for literal arrays
- Use `satisfies` over type assertions when checking object shapes
- No `enum` — use union types or `as const` objects

---

## Component Patterns

**Composition over props:**
- Sections accept `children`, not `items` arrays
- Avoid "god components" with 10+ props — split

**Inline editing pattern:**
- Use the `<InlineEdit>` primitive. Single source of truth for click-to-edit behavior.

**Popovers vs Modals:**
- Inline edits → Popover (Radix via shadcn)
- Slot picker → cmdk dialog (centered modal, but feels lightweight)
- Never use Dialog for editing flow data — only for destructive confirmations

**Empty states:**
- Every empty list, slot, or section needs a meaningful empty state with a clear next action
- Dashed border for "fill me in" slots, plain text + button for "nothing to show"

---

## Interaction Rules

- **Esc** closes the topmost popover/modal, never the whole form
- **Cmd+K** is global: opens command palette (campaign search) or slot picker if a slot is focused
- **Cmd+Enter** submits the form
- **Cmd+D** in detail/list duplicates the focused campaign
- **j / k** navigate table rows when table is focused
- **Tab order** respects visual order, no positive `tabindex`
- **Focus rings** are 2px accent with 2px offset, always visible on keyboard nav
- **Hover states** never trigger layout shift
- **Validation**: only on submit attempt, never on blur. Show errors inline at fields, summarized in the sidebar.

---

## Animation Rules

Use framer-motion `layout` prop generously for:
- Adding/removing paths
- Expanding/collapsing sections
- Switching split modes

Durations:
- Layout transitions: 180ms, `ease-out`
- Popover open: 120ms
- No animation > 250ms

Never animate:
- Hover backgrounds (instant feels snappier in DevTools)
- Focus rings
- Toast appearance (sonner defaults are fine)

---

## Mock Data Discipline

- Realistic affiliate marketing names — no "Test Campaign 1", "Lorem Ipsum Offer"
- Numbers that look real (e.g., 12,450 clicks, not 100)
- Use realistic campaigns that demo each unlock state of the destination canvas
- Seed deterministically (no `Math.random()` at module load) so reload gives consistent state
- Export from `lib/mock-data.ts` as named consts

---

## Performance

- Virtualize lists when >50 items (tanstack-virtual). Slot tables with many landers/offers need this.
- Use `useMemo` for derived data, not for everything
- Keep zustand selectors narrow — full-store subscriptions cause cascading re-renders
- Lazy-load the rule-builder and AI-mode UIs (dynamic import) — most users never open them
- Images: use `next/image` with explicit width/height

---

## Working with This Codebase

When asked to add or change something:

1. **Re-read the relevant section here before making structural changes** (new section, new flow state, new screen)
2. **Check `lib/types.ts`** — if the data shape doesn't support what you're building, extend types FIRST
3. **Check existing components** — do not reinvent primitives. If `<Section>` exists, use it.
4. **Match neighboring style** — if files nearby use a certain pattern (e.g., zustand selector style), follow it
5. **Update `DECISIONS.md`** when you make a non-obvious choice. Format: `## YYYY-MM-DD — Topic` followed by Context, Decision, Rationale.

---

## What NOT to do

- Don't install new dependencies without checking they're justified. Prefer composing what's there.
- Don't add a tutorial / onboarding overlay. The form should be self-evident.
- Don't add success animations like confetti.
- Don't introduce a backend, API routes, or server actions — this is pure client.
- Don't use `useEffect` for derived data — compute inline or with `useMemo`
- Don't fetch from external services. All data is local mock.
- Don't write tests unless explicitly asked — this is a prototype, not production. Stable types and clean code are the safety net.
- Don't commit `node_modules`, `.next`, `.DS_Store`. Update `.gitignore` if needed.

---

## Operating Mode

- **Be concise in plans.** Bullet lists. No filler.
- **Make pragmatic choices** when something is ambiguous. Document the choice in `DECISIONS.md`. Ask the user only when the choice is irreversible or expensive to undo.
- **Commit often** with focused messages. Format: `<scope>: <change>` (e.g., `destination-canvas: implement rule-based split mode`)
- **After completing a section**, summarize what was built in 2–3 lines and what's next. No "I have successfully..." preambles.
- **If you hit an unclear architectural fork**, stop and ask. Better one short question than two hours of rework.
- **Don't fight the framework.** If Next.js / Tailwind v4 / shadcn behaves a certain way, work with it.

---

## Implementation Priority

Build in this order. Don't get ahead of the user on later steps until earlier ones are solid.

1. Foundation: Next.js setup, Tailwind tokens, fonts, layout shell (sidebar + topbar), dark theme
2. Mock data + zustand store + types
3. Campaigns list table with mini-flow viz column
4. Create form skeleton (all sections present, only General functional)
5. **Destination canvas — the hero. Spend most time here.** Build incrementally:
   - 5a. Single URL slot empty state
   - 5b. Add lander → two-card flow
   - 5c. Add path → weight controls
   - 5d. Slot picker (cmdk)
   - 5e. Multi-item slots
   - 5f. Rule-based mode
   - 5g. AI mode
   - 5h. Drag weights
6. Tracking section
7. Advanced section
8. Live summary sidebar
9. Detail page
10. Polish: keyboard shortcuts, toasts, autosave indicator, density toggle

---

## Definition of Done for a section

Before moving on, the current section must:
- Render correctly in dark and light mode
- Work with keyboard navigation
- Handle empty, partial, and full data states
- Have a `// TODO:` for known limitations rather than silent gaps
- Be reflected in the live summary sidebar (if it affects campaign config)

---

## Reference Inspirations

When in doubt about visual or interaction patterns, mimic:
- **Linear** — for tables, density, sidebar, command palette
- **Vercel Dashboard** — for forms, sections, badges
- **Stripe Dashboard** — for the live summary sidebar, configuration recap
- **Resend** — for general layout calm and typography
- **Customer.io Journeys / n8n** — for path/flow visualization (but horizontal, not graph)

Do not mimic:
- Material Design
- The legacy product being redesigned
- Bootstrap-era patterns (large modals, breadcrumbs, tabs everywhere)