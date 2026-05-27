# Voluum Redesign Prototype

Interactive prototype of a unified campaign creation flow for a performance marketing tracker. Pure front-end, no backend.

## In scope

- Unified campaign creation form at `/campaigns/new`. Single form scales from a one-line offer URL to a multi-path setup with rule-based or AI distribution.
- Destination canvas with three split modes (Weighted, Rule-based, AI) and an empty-state URL-paste entry.
- Multi-item slots with four display tiers (1 / 2–4 / 5–9 / 10+). Inline weight editing on the card. The popover holds add/remove/reorder/rotation only.
- Rule-based layout: conditions live in a left-side `WHEN` gate. The last path is a fixed `ELSE` route — not part of priority reorder.
- Live summary sidebar with counts, distribution recap, and clickable Issues that scroll to the offending field.
- Light and dark themes via Tailwind v4 `@theme` tokens.
- Campaigns list with a compact mini-flow visualization column.

## Out of scope

- Backend, API routes, server actions. State persists in `localStorage` only.
- Drag-to-redistribute weights between paths. The visual handle is there; the handler is not wired.
- Slot item reorder via drag-and-drop. Grip handles render in the popover but aren't connected to dnd-kit yet.
- True virtualization for 10+-item slots. The list scrolls; `tanstack-virtual` is not installed.
- Campaign detail page (`/campaigns/[id]`) is intentionally a read-only stub — link in/out works, no editing surface.
- Tracking & Redirects and Advanced sections are structurally complete but only partially wired into the draft store.
- Validation runs only on submit attempt; nothing on blur.

## Tech stack

- Next.js 15 (App Router, Turbopack)
- TypeScript, strict
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, no `tailwind.config.js`)
- shadcn/ui primitives, lucide-react icons
- zustand + `persist` middleware
- framer-motion for layout transitions
- @dnd-kit (installed; reorder not wired)
- pnpm

## Run locally

```
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Lands on `/campaigns`.

`npm install && npm run dev` works too if pnpm isn't available.

## Known limitations

- The sticky bottom action bar in the create form uses a fixed `left-60` offset to clear the sidebar. Collapsing the sidebar doesn't reflow it.
- `Filter bot traffic` and `Enable anti-fraud protection` toggles use local component state — they don't round-trip through the draft store or the summary sidebar.
- pnpm 11 occasionally prompts for build-script approval on `sharp` / `unrs-resolver`. If install stalls, run `pnpm approve-builds` once, or fall back to `npm install`.
