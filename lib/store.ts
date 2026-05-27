"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Campaign,
  Lander,
  Offer,
  TrafficSource,
  DraftCampaign,
  UIState,
  SplitMode,
  Condition,
  Path,
  PathSlot,
  SlotItem,
} from "@/lib/types";
import {
  MOCK_CAMPAIGNS,
  LANDERS,
  OFFERS,
  TRAFFIC_SOURCES,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

function createEmptyDraft(): DraftCampaign {
  return {
    name: "",
    status: "draft",
    trafficSourceId: "",
    country: "",
    workspace: "Main workspace",
    tags: [],
    cost: { type: "cpc" },
    paths: [],
    splitMode: { kind: "weighted" },
    tracking: {
      redirectMode: "302",
      conversionMethod: "s2s",
      tokenMappings: [],
    },
  };
}

function createEmptyPath(): Path {
  return {
    id: generateId(),
    slots: [
      { id: generateId(), kind: "offer", items: [], rotation: "weighted" },
    ],
    weight: 100,
  };
}

type Store = {
  // Data
  campaigns: Campaign[];
  landers: Lander[];
  offers: Offer[];
  trafficSources: TrafficSource[];

  // Draft
  draft: DraftCampaign;
  draftLastSaved: number | null;

  // UI
  ui: UIState;

  // Campaign actions
  createFromDraft: () => Campaign;
  duplicateCampaign: (id: string) => Campaign | null;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Draft actions
  resetDraft: () => void;
  loadCampaignIntoDraft: (id: string) => void;
  setDraft: (partial: Partial<DraftCampaign>) => void;
  saveDraft: () => void;

  // Path actions
  addPath: () => void;
  removePath: (id: string) => void;
  updatePathWeight: (id: string, weight: number) => void;
  updatePathName: (id: string, name: string) => void;

  // Slot actions
  addSlotItem: (pathId: string, slotId: string, item: SlotItem) => void;
  removeSlotItem: (pathId: string, slotId: string, refId: string) => void;
  updateSlotItemWeight: (pathId: string, slotId: string, refId: string, weight: number) => void;
  addLanderSlot: (pathId: string) => void;

  // Split mode
  setSplitMode: (mode: SplitMode) => void;
  addRule: (pathId: string, condition: Condition) => void;
  removeRule: (pathId: string, ruleId: string) => void;

  // UI actions
  setUI: (partial: Partial<UIState>) => void;
  openSlotPicker: (pathId: string, slotId: string) => void;
  closeSlotPicker: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      campaigns: MOCK_CAMPAIGNS,
      landers: LANDERS,
      offers: OFFERS,
      trafficSources: TRAFFIC_SOURCES,
      draft: createEmptyDraft(),
      draftLastSaved: null,
      ui: {
        densityMode: "comfortable",
        sidebarCollapsed: false,
        activePopover: null,
        slotPickerOpen: false,
        slotPickerTarget: null,
        commandPaletteOpen: false,
      },

      createFromDraft: () => {
        const { draft, campaigns } = get();
        const now = new Date().toISOString();
        const campaign: Campaign = {
          ...draft,
          id: generateId(),
          status: draft.status === "draft" ? "active" : draft.status,
          createdAt: now,
          updatedAt: now,
        } as Campaign;
        set({ campaigns: [campaign, ...campaigns] });
        return campaign;
      },

      duplicateCampaign: (id) => {
        const { campaigns } = get();
        const source = campaigns.find((c) => c.id === id);
        if (!source) return null;
        const now = new Date().toISOString();
        const dupe: Campaign = {
          ...source,
          id: generateId(),
          name: `${source.name} (copy)`,
          status: "draft",
          createdAt: now,
          updatedAt: now,
          stats: undefined,
        };
        set({ campaigns: [dupe, ...campaigns] });
        return dupe;
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        }));
      },

      resetDraft: () => set({ draft: createEmptyDraft(), draftLastSaved: null }),

      loadCampaignIntoDraft: (id) => {
        const { campaigns } = get();
        const campaign = campaigns.find((c) => c.id === id);
        if (!campaign) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, stats, ...draftFields } = campaign;
        set({ draft: draftFields });
      },

      setDraft: (partial) => {
        set((state) => ({ draft: { ...state.draft, ...partial } }));
      },

      saveDraft: () => set({ draftLastSaved: Date.now() }),

      addPath: () => {
        set((state) => {
          const paths = [...state.draft.paths];
          const newPath = createEmptyPath();
          // Redistribute weights evenly
          const count = paths.length + 1;
          const even = Math.floor(100 / count);
          const remainder = 100 - even * count;
          const updated = paths.map((p, i) => ({
            ...p,
            weight: even + (i === 0 ? remainder : 0),
          }));
          return {
            draft: {
              ...state.draft,
              paths: [...updated, { ...newPath, weight: even }],
            },
          };
        });
      },

      removePath: (id) => {
        set((state) => {
          const paths = state.draft.paths.filter((p) => p.id !== id);
          // Normalize weights after removal
          const total = paths.reduce((sum, p) => sum + p.weight, 0);
          const normalized = total === 0
            ? paths.map((p, i) => ({ ...p, weight: i === 0 ? 100 : 0 }))
            : paths.map((p) => ({ ...p, weight: Math.round((p.weight / total) * 100) }));
          // Fix rounding
          const diff = 100 - normalized.reduce((s, p) => s + p.weight, 0);
          if (normalized.length > 0) normalized[0].weight += diff;
          return { draft: { ...state.draft, paths: normalized } };
        });
      },

      updatePathWeight: (id, weight) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((p) =>
              p.id === id ? { ...p, weight } : p
            ),
          },
        }));
      },

      updatePathName: (id, name) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((p) =>
              p.id === id ? { ...p, name } : p
            ),
          },
        }));
      },

      addSlotItem: (pathId, slotId, item) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((path) => {
              if (path.id !== pathId) return path;
              return {
                ...path,
                slots: path.slots.map((slot) => {
                  if (slot.id !== slotId) return slot;
                  const existing = slot.items.find((i) => i.refId === item.refId);
                  if (existing) return slot;
                  const newItems = [...slot.items, item];
                  // Re-normalize weights
                  const even = Math.floor(100 / newItems.length);
                  const rem = 100 - even * newItems.length;
                  return {
                    ...slot,
                    items: newItems.map((i, idx) => ({
                      ...i,
                      weight: even + (idx === 0 ? rem : 0),
                    })),
                  };
                }),
              };
            }),
          },
        }));
      },

      removeSlotItem: (pathId, slotId, refId) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((path) => {
              if (path.id !== pathId) return path;
              return {
                ...path,
                slots: path.slots.map((slot) => {
                  if (slot.id !== slotId) return slot;
                  const items = slot.items.filter((i) => i.refId !== refId);
                  const total = items.reduce((s, i) => s + i.weight, 0);
                  const normalized = total === 0
                    ? items.map((i, idx) => ({ ...i, weight: idx === 0 ? 100 : 0 }))
                    : items.map((i) => ({ ...i, weight: Math.round((i.weight / total) * 100) }));
                  return { ...slot, items: normalized };
                }),
              };
            }),
          },
        }));
      },

      updateSlotItemWeight: (pathId, slotId, refId, weight) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((path) => {
              if (path.id !== pathId) return path;
              return {
                ...path,
                slots: path.slots.map((slot) => {
                  if (slot.id !== slotId) return slot;
                  return {
                    ...slot,
                    items: slot.items.map((i) =>
                      i.refId === refId ? { ...i, weight } : i
                    ),
                  };
                }),
              };
            }),
          },
        }));
      },

      addLanderSlot: (pathId) => {
        set((state) => ({
          draft: {
            ...state.draft,
            paths: state.draft.paths.map((path) => {
              if (path.id !== pathId) return path;
              const hasLander = path.slots.some((s) => s.kind === "lander");
              if (hasLander) return path;
              const landerSlot: PathSlot = {
                id: generateId(),
                kind: "lander",
                items: [],
                rotation: "weighted",
              };
              return { ...path, slots: [landerSlot, ...path.slots] };
            }),
          },
        }));
      },

      setSplitMode: (mode) => {
        set((state) => ({
          draft: { ...state.draft, splitMode: mode },
        }));
      },

      addRule: (pathId, condition) => {
        set((state) => {
          const splitMode = state.draft.splitMode;
          if (splitMode.kind !== "rule-based") return state;
          const existingRule = splitMode.rules.find((r) => r.pathId === pathId);
          const updatedRules = existingRule
            ? splitMode.rules.map((r) =>
                r.pathId === pathId
                  ? { ...r, conditions: [...r.conditions, condition] }
                  : r
              )
            : [
                ...splitMode.rules,
                {
                  id: generateId(),
                  pathId,
                  conditions: [condition],
                },
              ];
          return {
            draft: {
              ...state.draft,
              splitMode: { ...splitMode, rules: updatedRules },
            },
          };
        });
      },

      removeRule: (pathId, ruleId) => {
        set((state) => {
          const splitMode = state.draft.splitMode;
          if (splitMode.kind !== "rule-based") return state;
          return {
            draft: {
              ...state.draft,
              splitMode: {
                ...splitMode,
                rules: splitMode.rules.filter(
                  (r) => !(r.pathId === pathId && r.id === ruleId)
                ),
              },
            },
          };
        });
      },

      setUI: (partial) => {
        set((state) => ({ ui: { ...state.ui, ...partial } }));
      },

      openSlotPicker: (pathId, slotId) => {
        set((state) => ({
          ui: {
            ...state.ui,
            slotPickerOpen: true,
            slotPickerTarget: { pathId, slotId },
          },
        }));
      },

      closeSlotPicker: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            slotPickerOpen: false,
            slotPickerTarget: null,
          },
        }));
      },
    }),
    {
      name: "prototype-store",
      partialize: (state) => ({
        campaigns: state.campaigns,
        draft: state.draft,
        draftLastSaved: state.draftLastSaved,
        ui: { densityMode: state.ui.densityMode },
      }),
    }
  )
);
