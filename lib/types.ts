export type TrafficSource = {
  id: string;
  name: string;
  icon: string;
  category: "push" | "native" | "social" | "search" | "pop";
};

export type Lander = {
  id: string;
  name: string;
  url: string;
  domain: string;
  tags: string[];
  ctr?: number;
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
  type: "lander" | "offer";
  refId: string;
  weight: number;
};

export type PathSlot = {
  id: string;
  kind: "lander" | "offer";
  items: SlotItem[];
  rotation: "weighted" | "sequential" | "ai";
};

export type Path = {
  id: string;
  name?: string;
  slots: PathSlot[];
  weight: number;
};

export type SplitMode =
  | { kind: "weighted" }
  | { kind: "rule-based"; rules: Rule[] }
  | { kind: "ai"; goal: "cr" | "epc" | "roi"; minSample: number };

export type Rule = {
  id: string;
  pathId: string;
  conditions: Condition[];
};

export type Condition = {
  field: "country" | "device" | "os" | "browser" | "connection" | "time";
  operator: "is" | "is-not" | "in" | "contains";
  value: string | string[];
};

export type CostModel = {
  type: "cpc" | "cpm" | "cpa" | "revshare" | "auto" | "not-tracked";
  value?: number;
  currency?: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "archived" | "draft";
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
  stats?: {
    clicks: number;
    conversions: number;
    revenue: number;
    cost: number;
  };
};

export type TrackingConfig = {
  customDomain?: string;
  redirectMode: "302" | "meta" | "direct";
  postbackUrl?: string;
  conversionMethod: "s2s" | "pixel" | "cookie";
  tokenMappings: { from: string; to: string }[];
};

export type DraftCampaign = Omit<Campaign, "id" | "createdAt" | "updatedAt" | "stats"> & {
  id?: string;
};

export type DensityMode = "comfortable" | "compact";

export type UIState = {
  densityMode: DensityMode;
  sidebarCollapsed: boolean;
  activePopover: string | null;
  slotPickerOpen: boolean;
  slotPickerTarget: { pathId: string; slotId: string } | null;
  commandPaletteOpen: boolean;
};
