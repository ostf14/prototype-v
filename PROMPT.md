# Voluum Redesign — Unified Campaign Creation Prototype

You are building a high-fidelity interactive prototype that redesigns Voluum's campaign creation flow. This is a portfolio/interview piece showcasing progressive disclosure UX in a complex B2B AdTech product. Visual quality and interaction polish matter as much as functionality.

## Context

Voluum is a performance marketing tracker for affiliates and media buyers. The current product has TWO separate campaign creation forms ("Simple" and "Advanced") which confuses users. We're unifying them into ONE form that scales from beginner to power user via progressive disclosure.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **shadcn/ui** components
- **lucide-react** for icons
- **@dnd-kit** for drag-and-drop
- **zustand** for state management
- **framer-motion** for transitions
- No backend — all data in-memory, seeded from a mock file

## Design Language

DevTool minimalism (Linear / Vercel / Stripe Dashboard).

**Strict rules:**
- NO drop shadows on cards (use 1px borders at 8% opacity instead)
- NO rounded-2xl, max `rounded-md` (6px)
- NO gradients except for a single accent color
- NO unnecessary container borders — use spacing + typography hierarchy
- Dark mode as DEFAULT, light mode as toggle
- Compact density: 32px row heights, 14px base font, 13px for secondary text

**Color tokens (Tailwind v4 in `globals.css`):**
```css
@theme {
  --color-bg: #0A0A0B;
  --color-surface: #111113;
  --color-surface-2: #18181B;
  --color-border: #27272A;
  --color-border-strong: #3F3F46;
  --color-text: #FAFAFA;
  --color-text-muted: #A1A1AA;
  --color-text-subtle: #71717A;
  --color-accent: #10B981; /* Voluum green */
  --color-accent-muted: #064E3B;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
}
```

**Typography:**
- `font-sans`: Inter (next/font)
- `font-mono`: JetBrains Mono (for URLs, tokens, IDs)
- Sizes: `text-xs` (12px), `text-sm` (13px), `text-base` (14px), `text-lg` (16px)
- Headings: medium weight, never bold. `font-medium tracking-tight`

**Spacing rhythm:** 4px grid. Form rows: 12px vertical padding. Sections: 24px gap.

---

## App Structure

```
app/
  layout.tsx              # Root with dark theme + Inter
  page.tsx                # Redirect → /campaigns
  campaigns/
    page.tsx              # Campaigns list (table)
    new/page.tsx          # Unified create form
    [id]/page.tsx         # Campaign detail (read-only summary)
components/
  layout/
    sidebar.tsx           # Left nav (Voluum-like)
    topbar.tsx            # Search + Create button + workspace switcher
  campaigns/
    campaigns-table.tsx
    campaign-row.tsx
    create-form/
      create-form.tsx           # Main container
      general-section.tsx       # Name, traffic source, country, cost
      destination-section.tsx   # The hero: flow canvas
      tracking-section.tsx      # Collapsed by default
      advanced-section.tsx      # Collapsed by default
      summary-sidebar.tsx       # Live preview on the right
    destination-canvas/
      flow-canvas.tsx           # Horizontal flow renderer
      path-row.tsx              # Single path lane
      slot-card.tsx             # Lander or Offer card
      slot-picker.tsx           # cmd-k style picker
      weight-controls.tsx       # %, rules, or AI
      condition-builder.tsx     # Rule chip inline editor
  primitives/
    section.tsx           # Collapsible section with optional badge
    kbd.tsx               # Keyboard shortcut hint
    inline-edit.tsx       # Click to edit text
    empty-slot.tsx        # Dashed border + plus icon
lib/
  store.ts                # zustand store
  mock-data.ts            # Seed campaigns, landers, offers, traffic sources
  types.ts                # All TypeScript types
  utils.ts                # cn(), formatters
```

---

## Data Model (lib/types.ts)

```ts
export type TrafficSource = {
  id: string;
  name: string;
  icon: string;        // emoji or initial
  category: 'push' | 'native' | 'social' | 'search' | 'pop';
};

export type Lander = {
  id: string;
  name: string;
  url: string;
  domain: string;
  tags: string[];
  ctr?: number;        // historical
};

export type Offer = {
  id: string;
  name: string;
  url: string;
  payout: number;
  currency: string;
  country: string;
  network: string;
  vertical: string;
  cr?: number;
  epc?: number;
};

export type SlotItem = {
  type: 'lander' | 'offer';
  refId: string;
  weight: number;      // 0–100, normalized within slot
};

export type PathSlot = {
  id: string;
  kind: 'lander' | 'offer';
  items: SlotItem[];   // empty = unconfigured slot
  rotation: 'weighted' | 'sequential' | 'ai';
};

export type Path = {
  id: string;
  name?: string;
  slots: PathSlot[];   // ordered: lander → offer, or just offer
  weight: number;      // 0–100
};

export type SplitMode =
  | { kind: 'weighted' }
  | { kind: 'rule-based'; rules: Rule[] }
  | { kind: 'ai'; goal: 'cr' | 'epc' | 'roi'; minSample: number };

export type Rule = {
  id: string;
  pathId: string;
  conditions: Condition[];
};

export type Condition = {
  field: 'country' | 'device' | 'os' | 'browser' | 'connection' | 'time';
  operator: 'is' | 'is-not' | 'in' | 'contains';
  value: string | string[];
};

export type CostModel = {
  type: 'cpc' | 'cpm' | 'cpa' | 'revshare' | 'auto' | 'not-tracked';
  value?: number;
  currency?: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived' | 'draft';
  trafficSourceId: string;
  country: string;
  workspace: string;
  tags: string[];
  cost: CostModel;
  paths: Path[];
  splitMode: SplitMode;
  tracking: TrackingConfig;
  createdAt: string;
  updatedAt: string;
  stats?: { clicks: number; conversions: number; revenue: number; cost: number };
};

export type TrackingConfig = {
  customDomain?: string;
  redirectMode: '302' | 'meta' | 'direct';
  postbackUrl?: string;
  conversionMethod: 's2s' | 'pixel' | 'cookie';
  tokenMappings: { from: string; to: string }[];
};
```

---

## Mock Data (lib/mock-data.ts)

Seed with **6 campaigns** that demonstrate progressive complexity. This is critical — each campaign showcases a different unlock state. Generate realistic affiliate marketing names.

1. **"Push US — Sweepstakes Q4"** — Simple: single offer, no lander, CPC model. Status: active. Stats: 12,450 clicks, 340 conversions.

2. **"Native ROW — Nutra Test"** — Single lander → single offer. CPC. Status: active.

3. **"FB Survey Funnel — Tier1"** — 2 paths, 50/50 weighted, lander → offer each. CPA. Status: active.

4. **"Push Mobile — Geo Split"** — 3 paths with **rule-based** distribution: Path A for US mobile, Path B for EU mobile, Path C fallback. Status: active.

5. **"AI-Optimized Sweeps"** — 4 paths with AI distribution (goal: EPC, minSample: 1000). Status: active.

6. **"Crypto Lander Test"** — 2 paths, multi-lander slot (3 landers rotating weighted in first slot of Path A), single offer in slot 2. Status: paused.

Also seed:
- **12 traffic sources**: Facebook Ads, Google Ads, TikTok Ads, Propeller Ads, RichAds, Taboola, Outbrain, MGID, Zeropark, ExoClick, PopAds, Native.
- **15 landers** with realistic names like "Sweeps Quiz v3 EN", "Crypto Hero LP", "Nutra Before/After", with tags.
- **20 offers** across verticals: sweeps, nutra, crypto, dating, finance, e-commerce. Include payout, country, network (MaxBounty, ClickDealer, etc.).

---

## Screen 1: Campaigns List (`/campaigns`)

**Layout:** Sidebar (240px) + main content with topbar.

**Sidebar nav items** (icon + label, Linear style):
- Dashboard, **Campaigns (active)**, Landers, Offers, Traffic Sources, Reports, Automizer, Settings.

**Topbar:**
- Left: workspace switcher ("Main workspace ▾")
- Center: search (`Cmd+K` to focus, with kbd hint)
- Right: **Create campaign** button (accent color, with `+` icon)

**Main:**
- Page title "Campaigns" + subtitle showing count
- Filter bar: status pills (All / Active / Paused / Draft / Archived), traffic source filter, date range
- Table with columns:
  - Checkbox (bulk select)
  - **Name** (clickable, with tag pills underneath)
  - **Status** (dot + label: green/yellow/grey/red)
  - **Flow** — compact mini-visualization (e.g., `[L]→[O]` icons, or `[L]→[O] · 2 paths`, or `AI · 4 paths`). This is the SIGNATURE element showing campaign complexity at a glance.
  - **Traffic Source** (icon + name)
  - **Clicks** (right-aligned, mono)
  - **CR** (with sparkline if possible, otherwise just %)
  - **Revenue** (mono, right-aligned)
  - **Updated** (relative time)
  - Action menu (⋯): Edit, Duplicate, Pause, Archive
- Row hover: subtle bg, action menu appears
- Row click: navigates to detail page

---

## Screen 2: Unified Create Form (`/campaigns/new`)

This is the centerpiece. The form has **two columns**:
- **Left (main, ~720px):** form sections
- **Right (~340px, sticky):** live summary sidebar

### Form Sections (top to bottom)

#### Section 1: General (always expanded)

Five fields, dense, single-column layout:

1. **Campaign name** — text input. Autosuggests format like `[TS] [Country] [Vertical] [Date]` based on other fields.
2. **Traffic source** — combobox with grouped options (icons + categories). Recent at top.
3. **Country** — combobox with flags. Sets default currency + timezone.
4. **Cost model** — segmented control: `Auto | CPC | CPM | CPA | RevShare | Not tracked`. Value field appears inline when applicable.
5. **Workspace + Tags** — same row, compact.

Below: subtle horizontal divider.

#### Section 2: Destination (THE HERO — always expanded)

This is the most important UX innovation. Implement carefully.

**Header row:**
- Title "Destination"
- Right side: a small density toggle (Comfortable / Compact)
- A "Switch to legacy view" link (decorative, just to signal we know about the old way)

**Initial state (Trigger 0):**
A single empty card that says:
- Large dashed-border slot, full-width, ~96px tall
- Center: "Paste destination URL or pick an offer"
- Below: small inline buttons: `+ Add lander` `Pick from library`
- Bottom right of card: subtle hint `↵ to confirm`

When user pastes a URL → it becomes an Offer slot card (auto-detects from URL or marks as "Direct offer").

**Trigger 1 — Add lander:** Clicking `+ Add lander` transforms the layout into a horizontal flow:

```
┌─────────┐    ┌─────────┐
│ Lander  │ →  │  Offer  │
│ [empty] │    │ [empty] │
└─────────┘    └─────────┘
```

Each card is ~240×88px with:
- Top-left: type badge (L/O) with color (purple for lander, green for offer)
- Center: object name + domain (or "Click to select")
- Bottom: subtle metric chip if filled (CTR or CR)
- Cards connected by a thin 1px arrow line with optional transition type label (`302` by default, click to change)

**Trigger 2 — Add path:** Below the existing flow row, an "Add path" button. Click it → adds a second path row. NOW a **weight control bar** appears above all paths:

```
                       ┌──────────────────────────┐
                       │ Distribution: 50% / 50%  │  [Weighted ▾]
                       └──────────────────────────┘
┌─────────┐   ┌─────────┐
│ L Quiz  │ → │ O Sweep │   Path 1  50%  ⋯
└─────────┘   └─────────┘
┌─────────┐   ┌─────────┐
│ L Hero  │ → │ O Sweep │   Path 2  50%  ⋯
└─────────┘   └─────────┘
        [ + Add path ]
```

The path weight is **inline editable** — click `50%` to edit. Drag a divider between paths to redistribute (this is the drag-drop interaction).

**Trigger 3 — Rule-based mode:** The "Weighted ▾" dropdown in distribution control has three options:
- **Weighted** (default, % per path)
- **Rule-based** — per-path weight slot becomes a condition chip ("if country = US")
- **AI** — weights become "AI optimizing" badges, header shows config (goal + min sample)

When switching to Rule-based:
- Each path row's weight area shows a condition chip with `+` to add conditions
- Click chip → inline condition builder popover: `[field ▾] [operator ▾] [value]`
- Conditions: country, device, os, browser, connection type, time of day
- Last path automatically becomes "Fallback" (uneditable conditions)

When switching to AI:
- A config row appears: `Optimize for [EPC ▾]   Min sample: [1000]`
- Each path shows live "AI weight" badge (mock data, e.g., "32%" with a small ↑ trend)

**Slot picker (cmd-k style):**
Clicking an empty slot opens a **command palette** modal (centered, 560px wide):
- Search input at top
- Tabs: All / Recent / Tags
- List of items with thumbnail, name, domain, last-used time, performance metric
- Hover preview on right side (mini preview of the URL)
- `↑ ↓` to navigate, `↵` to select
- Bottom: "or paste URL: [_______________]" inline create

**Slot with multiple items (multi-lander/multi-offer):**
Click a filled slot → popover with:
- List of current items with weights
- Drag handles to reorder
- "+ Add another lander/offer" button
- Rotation mode toggle: Weighted / Sequential / AI

When a slot has 2+ items, the card shows a stack indicator (`Quiz v3 +2 more · weighted 50/30/20`).

When 10+ items, the slot expands to a compact inline table (search + virtualized list).

#### Section 3: Tracking (collapsed by default)

Collapsed header with a chip showing diff from defaults:
- "Tracking & redirects" + chip `Default` (or `Modified` in accent if changed)
- Click to expand

Expanded fields:
- Custom tracking domain (combobox with user's domains)
- Redirect mode (segmented: `302 | Meta | Direct`)
- Postback URL (with token autocomplete: `{clickid}`, `{payout}`, etc.)
- Conversion method (radio: S2S / Pixel / Cookie)
- Token mappings (small key-value table, add/remove rows)

#### Section 4: Advanced (collapsed, off-screen-feel)

Truly advanced things. Most users never open this.
- Bot filtering
- Anti-fraud
- IP/UA blocking
- Custom JS injection
- Cap settings

### Right Sidebar: Live Summary

Sticky, scrolls with form. Sections:

1. **Mini flow visualization** — a tiny SVG diagram showing the current paths/slots. Updates in real-time.
2. **Configuration summary:**
   - "1 path · 1 lander · 1 offer" (counts update)
   - Cost: "CPC $0.45"
   - Distribution: "Weighted 50/50" or "Rule-based · 3 conditions" or "AI · EPC"
3. **Warnings list** (if any):
   - "Path 2 has no offer" (yellow dot)
   - "Tracking domain not set" (yellow)
4. **Token preview:** A mono-font preview of the final tracking URL with values substituted.
5. **Keyboard shortcuts hint:** `⌘+↵ Save · ⌘+D Duplicate · Esc Cancel`

### Bottom action bar (sticky)

- Left: "Draft auto-saved 12s ago"
- Right: `Cancel` (ghost) + `Save as draft` + `Create campaign` (accent, with `⌘+↵`)

---

## Screen 3: Campaign Detail (`/campaigns/[id]`)

Simple read-only view of a campaign showing:
- Header with name, status, edit button
- The same flow visualization (read-only, larger)
- Stats cards
- General/Tracking config as definition lists

Click "Edit" → opens the same form pre-filled.

---

## State Management (lib/store.ts)

Use zustand with the following slices:

- `campaigns`: list, CRUD operations
- `landers`, `offers`, `trafficSources`: read-only mock data
- `draft`: current campaign being edited (full Campaign object)
- `ui`: density mode, sidebar collapsed, current popover

Actions to implement:
- `setDraft(partial)`, `addPath()`, `removePath(id)`, `updatePathWeight(id, weight)`
- `addSlotItem(pathId, slotId, item)`, `removeSlotItem(...)`
- `setSplitMode(mode)`, `addRule(pathId, condition)`
- `duplicateCampaign(id)`, `createFromDraft()`

Persist to `localStorage` so the prototype survives reload.

---

## Critical Interactions

1. **Pasting a URL into the destination URL field** → instantly creates an Offer slot with parsed domain
2. **Drag between path weight dividers** to redistribute (use @dnd-kit, snap to 5% increments)
3. **Cmd+K anywhere** opens the slot picker if a slot is focused, otherwise opens campaign search
4. **Esc** closes any popover, never the whole form
5. **Auto-save draft** every 2 seconds (debounced) to localStorage
6. **Section "Modified" badges** — compare current section values to defaults, show badge if different
7. **Smooth transitions** when unlocking layers (framer-motion `layout` prop on path rows)

---

## Polish details that matter

- **Empty states**: every empty slot has a friendly hint, not just dashed border
- **Skeleton loaders** on first paint of campaigns table
- **Toast notifications** (sonner) for: Created, Duplicated, Deleted
- **Keyboard nav** in tables: `j/k` to move, `Enter` to open, `d` to duplicate
- **Focus rings** are clean 2px accent with offset
- **No emoji in UI** except as traffic source icons (where they replace logos in mock)
- **Date formatting**: relative ("2h ago", "Yesterday") in tables, absolute in details
- **Number formatting**: thousands with thin space, currency with proper locale

---

## Implementation order

1. Set up Next.js + Tailwind v4 + shadcn/ui + dark mode
2. Build layout (sidebar + topbar)
3. Mock data + zustand store
4. Campaigns list with the flow mini-viz column
5. Create form skeleton with all sections
6. **Destination canvas — spend most time here**:
   a. Single slot empty state
   b. Trigger 1: add lander, two-card flow
   c. Trigger 2: add path, weight controls
   d. Slot picker (cmd-k modal)
   e. Multi-item slots (popover)
   f. Trigger 3: rule-based mode
   g. Trigger 4: AI mode
   h. Drag-to-redistribute weights
7. Tracking + Advanced collapsibles
8. Live summary sidebar
9. Detail page
10. Toasts, keyboard shortcuts, autosave, polish

---

## What NOT to do

- Don't add a tutorial / onboarding overlay — the form should be self-evident
- Don't use modal dialogs for in-form editing — always inline popover
- Don't show validation errors on blur — only on submit attempt
- Don't add success animations like confetti — this is a pro tool
- Don't use brand colors other than the single accent green
- Don't build any actual API integration — pure client-side state

---

When done, the prototype should let me:
1. Browse 6 pre-seeded campaigns of varying complexity in the list
2. Click "Create campaign" and build a simple one in under 60 seconds
3. Progressively add complexity: lander → second path → rules → AI
4. Duplicate any existing campaign and tweak it
5. See the live summary update as I configure
6. Use keyboard shortcuts throughout

Start with the foundation, then move section by section. Ask me only if a critical architectural decision is unclear — otherwise make pragmatic choices and explain them in a `DECISIONS.md` file as you go.