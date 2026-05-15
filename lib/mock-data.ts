import type { TrafficSource, Lander, Offer, Campaign } from "@/lib/types";

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { id: "ts-fb", name: "Facebook Ads", icon: "📘", category: "social" },
  { id: "ts-google", name: "Google Ads", icon: "🔍", category: "search" },
  { id: "ts-tiktok", name: "TikTok Ads", icon: "🎵", category: "social" },
  { id: "ts-propeller", name: "Propeller Ads", icon: "🚀", category: "push" },
  { id: "ts-richads", name: "RichAds", icon: "💎", category: "push" },
  { id: "ts-taboola", name: "Taboola", icon: "📰", category: "native" },
  { id: "ts-outbrain", name: "Outbrain", icon: "📡", category: "native" },
  { id: "ts-mgid", name: "MGID", icon: "🌐", category: "native" },
  { id: "ts-zeropark", name: "Zeropark", icon: "⚡", category: "pop" },
  { id: "ts-exoclick", name: "ExoClick", icon: "🔥", category: "pop" },
  { id: "ts-popads", name: "PopAds", icon: "💬", category: "pop" },
  { id: "ts-native", name: "Native.com", icon: "🗞️", category: "native" },
];

export const LANDERS: Lander[] = [
  { id: "l-01", name: "Sweeps Quiz v3 EN", url: "https://lp.trackdomain.com/sweeps-quiz-v3-en", domain: "lp.trackdomain.com", tags: ["sweeps", "en", "quiz"], ctr: 4.2 },
  { id: "l-02", name: "Sweeps Quiz v2 EN", url: "https://lp.trackdomain.com/sweeps-quiz-v2-en", domain: "lp.trackdomain.com", tags: ["sweeps", "en", "quiz"], ctr: 3.8 },
  { id: "l-03", name: "Crypto Hero LP", url: "https://lp.trackdomain.com/crypto-hero", domain: "lp.trackdomain.com", tags: ["crypto", "hero"], ctr: 2.9 },
  { id: "l-04", name: "Crypto Gains Calculator", url: "https://lp.trackdomain.com/crypto-calc", domain: "lp.trackdomain.com", tags: ["crypto", "tool"], ctr: 3.4 },
  { id: "l-05", name: "Nutra Before/After EN", url: "https://lp.trackdomain.com/nutra-before-after-en", domain: "lp.trackdomain.com", tags: ["nutra", "en", "vsl"], ctr: 5.1 },
  { id: "l-06", name: "Nutra Doctor Review", url: "https://lp.trackdomain.com/nutra-doctor-review", domain: "lp.trackdomain.com", tags: ["nutra", "review"], ctr: 4.7 },
  { id: "l-07", name: "Survey Funnel v4 Tier1", url: "https://lp.trackdomain.com/survey-v4-tier1", domain: "lp.trackdomain.com", tags: ["survey", "tier1"], ctr: 6.3 },
  { id: "l-08", name: "Survey Funnel v3 Tier1", url: "https://lp.trackdomain.com/survey-v3-tier1", domain: "lp.trackdomain.com", tags: ["survey", "tier1"], ctr: 5.9 },
  { id: "l-09", name: "Dating Quiz US Mobile", url: "https://lp.trackdomain.com/dating-quiz-us-mob", domain: "lp.trackdomain.com", tags: ["dating", "us", "mobile"], ctr: 7.1 },
  { id: "l-10", name: "Finance Lead Gen v2", url: "https://lp.trackdomain.com/finance-lead-v2", domain: "lp.trackdomain.com", tags: ["finance", "lead"], ctr: 3.2 },
  { id: "l-11", name: "Weight Loss VSL EN", url: "https://lp.trackdomain.com/weight-loss-vsl-en", domain: "lp.trackdomain.com", tags: ["nutra", "vsl", "weight"], ctr: 4.5 },
  { id: "l-12", name: "Ecom Flash Sale LP", url: "https://lp.trackdomain.com/ecom-flash-sale", domain: "lp.trackdomain.com", tags: ["ecom", "sale"], ctr: 8.2 },
  { id: "l-13", name: "Geo-Targeted Sweeps EU", url: "https://lp.trackdomain.com/sweeps-geo-eu", domain: "lp.trackdomain.com", tags: ["sweeps", "eu"], ctr: 3.6 },
  { id: "l-14", name: "Mobile Pop Quiz v2", url: "https://lp.trackdomain.com/pop-quiz-mob-v2", domain: "lp.trackdomain.com", tags: ["mobile", "pop", "quiz"], ctr: 4.0 },
  { id: "l-15", name: "AI Sweeps Optimized LP", url: "https://lp.trackdomain.com/ai-sweeps-opt", domain: "lp.trackdomain.com", tags: ["sweeps", "ai"], ctr: 5.8 },
];

export const OFFERS: Offer[] = [
  { id: "o-01", name: "iPhone 15 Sweepstakes US", url: "https://offers.maxbounty.com/iphone15-us", payout: 2.40, currency: "USD", country: "US", network: "MaxBounty", vertical: "sweeps", cr: 3.1, epc: 0.074 },
  { id: "o-02", name: "Amazon Gift Card $500 US", url: "https://offers.maxbounty.com/amazon-gc-us", payout: 1.80, currency: "USD", country: "US", network: "MaxBounty", vertical: "sweeps", cr: 4.2, epc: 0.076 },
  { id: "o-03", name: "Samsung Galaxy Sweeps UK", url: "https://offers.clickdealer.com/samsung-uk", payout: 1.60, currency: "GBP", country: "GB", network: "ClickDealer", vertical: "sweeps", cr: 2.8, epc: 0.045 },
  { id: "o-04", name: "NutriBoost Pro — US", url: "https://offers.performcb.com/nutriboost-us", payout: 38.00, currency: "USD", country: "US", network: "PerformCB", vertical: "nutra", cr: 1.9, epc: 0.72 },
  { id: "o-05", name: "SlimFast Keto Bundle", url: "https://offers.performcb.com/slimfast-keto", payout: 42.00, currency: "USD", country: "US", network: "PerformCB", vertical: "nutra", cr: 1.6, epc: 0.67 },
  { id: "o-06", name: "BitcoinCode Platform DE", url: "https://offers.clickdealer.com/btc-code-de", payout: 250.00, currency: "EUR", country: "DE", network: "ClickDealer", vertical: "crypto", cr: 0.8, epc: 2.00 },
  { id: "o-07", name: "CryptoWealth App UK", url: "https://offers.adcombo.com/cryptowealth-uk", payout: 300.00, currency: "GBP", country: "GB", network: "AdCombo", vertical: "crypto", cr: 0.7, epc: 2.10 },
  { id: "o-08", name: "FlirtLocal Dating US", url: "https://offers.cpagrip.com/flirtlocal-us", payout: 5.50, currency: "USD", country: "US", network: "CPAGrip", vertical: "dating", cr: 6.2, epc: 0.34 },
  { id: "o-09", name: "BangBang Dating DE", url: "https://offers.adcombo.com/bangbang-de", payout: 6.00, currency: "EUR", country: "DE", network: "AdCombo", vertical: "dating", cr: 5.1, epc: 0.31 },
  { id: "o-10", name: "MoneyLion Personal Loan", url: "https://offers.flexoffers.com/moneylion", payout: 22.00, currency: "USD", country: "US", network: "FlexOffers", vertical: "finance", cr: 2.3, epc: 0.51 },
  { id: "o-11", name: "CreditKarma Signup US", url: "https://offers.cj.com/creditkarma", payout: 12.00, currency: "USD", country: "US", network: "CJ Affiliate", vertical: "finance", cr: 3.8, epc: 0.46 },
  { id: "o-12", name: "Shein Flash Deal EU", url: "https://offers.awin.com/shein-eu", payout: 8.00, currency: "EUR", country: "EU", network: "Awin", vertical: "ecom", cr: 4.5, epc: 0.36 },
  { id: "o-13", name: "Temu Welcome Offer", url: "https://offers.impact.com/temu-welcome", payout: 5.00, currency: "USD", country: "US", network: "Impact", vertical: "ecom", cr: 5.9, epc: 0.30 },
  { id: "o-14", name: "iPad Pro Sweeps ROW", url: "https://offers.maxbounty.com/ipad-row", payout: 1.40, currency: "USD", country: "ROW", network: "MaxBounty", vertical: "sweeps", cr: 3.4, epc: 0.048 },
  { id: "o-15", name: "Nutra Max ROW", url: "https://offers.adcombo.com/nutramax-row", payout: 18.00, currency: "USD", country: "ROW", network: "AdCombo", vertical: "nutra", cr: 1.4, epc: 0.25 },
  { id: "o-16", name: "BTC Revolution AU", url: "https://offers.clickdealer.com/btc-revolution-au", payout: 280.00, currency: "AUD", country: "AU", network: "ClickDealer", vertical: "crypto", cr: 0.9, epc: 2.52 },
  { id: "o-17", name: "Sweepstakes US Mobile", url: "https://offers.maxbounty.com/sweeps-mob-us", payout: 2.20, currency: "USD", country: "US", network: "MaxBounty", vertical: "sweeps", cr: 3.8, epc: 0.084 },
  { id: "o-18", name: "EU Sweeps Gift Card", url: "https://offers.adcombo.com/sweeps-eu-gc", payout: 1.50, currency: "EUR", country: "EU", network: "AdCombo", vertical: "sweeps", cr: 2.9, epc: 0.044 },
  { id: "o-19", name: "ROW Survey Reward", url: "https://offers.cpagrip.com/survey-row", payout: 1.20, currency: "USD", country: "ROW", network: "CPAGrip", vertical: "sweeps", cr: 4.1, epc: 0.049 },
  { id: "o-20", name: "AI Sweeps Optimizer US", url: "https://offers.maxbounty.com/ai-sweeps-us", payout: 2.60, currency: "USD", country: "US", network: "MaxBounty", vertical: "sweeps", cr: 3.5, epc: 0.091 },
];

// Campaign 1: Simple — single offer, no lander
export const CAMPAIGN_1: Campaign = {
  id: "c-01",
  name: "Push US — Sweepstakes Q4",
  status: "active",
  trafficSourceId: "ts-propeller",
  country: "US",
  workspace: "Main workspace",
  tags: ["sweeps", "push", "q4"],
  cost: { type: "cpc", value: 0.045, currency: "USD" },
  paths: [
    {
      id: "p-01",
      slots: [
        { id: "s-01", kind: "offer", items: [{ type: "offer", refId: "o-01", weight: 100 }], rotation: "weighted" },
      ],
      weight: 100,
    },
  ],
  splitMode: { kind: "weighted" },
  tracking: {
    redirectMode: "302",
    conversionMethod: "s2s",
    tokenMappings: [
      { from: "{click_id}", to: "{clickid}" },
    ],
  },
  createdAt: "2024-10-08T09:14:00Z",
  updatedAt: "2024-11-03T14:22:00Z",
  stats: { clicks: 12450, conversions: 340, revenue: 816.00, cost: 560.25 },
};

// Campaign 2: Single lander → single offer
export const CAMPAIGN_2: Campaign = {
  id: "c-02",
  name: "Native ROW — Nutra Test",
  status: "active",
  trafficSourceId: "ts-mgid",
  country: "ROW",
  workspace: "Main workspace",
  tags: ["nutra", "native", "row"],
  cost: { type: "cpc", value: 0.028, currency: "USD" },
  paths: [
    {
      id: "p-02",
      slots: [
        { id: "s-02", kind: "lander", items: [{ type: "lander", refId: "l-06", weight: 100 }], rotation: "weighted" },
        { id: "s-03", kind: "offer", items: [{ type: "offer", refId: "o-15", weight: 100 }], rotation: "weighted" },
      ],
      weight: 100,
    },
  ],
  splitMode: { kind: "weighted" },
  tracking: {
    redirectMode: "302",
    conversionMethod: "s2s",
    postbackUrl: "https://mgid.com/postback?cid={clickid}&payout={payout}",
    tokenMappings: [],
  },
  createdAt: "2024-09-15T11:30:00Z",
  updatedAt: "2024-11-01T08:45:00Z",
  stats: { clicks: 8320, conversions: 116, revenue: 2088.00, cost: 232.96 },
};

// Campaign 3: 2 paths, 50/50 weighted, lander → offer each
export const CAMPAIGN_3: Campaign = {
  id: "c-03",
  name: "FB Survey Funnel — Tier1",
  status: "active",
  trafficSourceId: "ts-fb",
  country: "US",
  workspace: "Main workspace",
  tags: ["survey", "fb", "tier1"],
  cost: { type: "cpa", value: 18.00, currency: "USD" },
  paths: [
    {
      id: "p-03a",
      name: "Variant A — v4",
      slots: [
        { id: "s-03a-l", kind: "lander", items: [{ type: "lander", refId: "l-07", weight: 100 }], rotation: "weighted" },
        { id: "s-03a-o", kind: "offer", items: [{ type: "offer", refId: "o-01", weight: 100 }], rotation: "weighted" },
      ],
      weight: 50,
    },
    {
      id: "p-03b",
      name: "Variant B — v3",
      slots: [
        { id: "s-03b-l", kind: "lander", items: [{ type: "lander", refId: "l-08", weight: 100 }], rotation: "weighted" },
        { id: "s-03b-o", kind: "offer", items: [{ type: "offer", refId: "o-02", weight: 100 }], rotation: "weighted" },
      ],
      weight: 50,
    },
  ],
  splitMode: { kind: "weighted" },
  tracking: {
    redirectMode: "302",
    conversionMethod: "s2s",
    postbackUrl: "https://facebook.com/offsite_event.php?ev=Purchase&cd[value]={payout}&cd[currency]=USD",
    tokenMappings: [],
  },
  createdAt: "2024-08-22T14:00:00Z",
  updatedAt: "2024-11-02T16:10:00Z",
  stats: { clicks: 23780, conversions: 892, revenue: 16056.00, cost: 14268.00 },
};

// Campaign 4: Rule-based distribution
export const CAMPAIGN_4: Campaign = {
  id: "c-04",
  name: "Push Mobile — Geo Split",
  status: "active",
  trafficSourceId: "ts-richads",
  country: "US",
  workspace: "Main workspace",
  tags: ["push", "mobile", "geo"],
  cost: { type: "cpc", value: 0.038, currency: "USD" },
  paths: [
    {
      id: "p-04a",
      name: "US Mobile",
      slots: [
        { id: "s-04a-l", kind: "lander", items: [{ type: "lander", refId: "l-14", weight: 100 }], rotation: "weighted" },
        { id: "s-04a-o", kind: "offer", items: [{ type: "offer", refId: "o-17", weight: 100 }], rotation: "weighted" },
      ],
      weight: 50,
    },
    {
      id: "p-04b",
      name: "EU Mobile",
      slots: [
        { id: "s-04b-l", kind: "lander", items: [{ type: "lander", refId: "l-13", weight: 100 }], rotation: "weighted" },
        { id: "s-04b-o", kind: "offer", items: [{ type: "offer", refId: "o-18", weight: 100 }], rotation: "weighted" },
      ],
      weight: 30,
    },
    {
      id: "p-04c",
      name: "Fallback",
      slots: [
        { id: "s-04c-l", kind: "lander", items: [{ type: "lander", refId: "l-14", weight: 100 }], rotation: "weighted" },
        { id: "s-04c-o", kind: "offer", items: [{ type: "offer", refId: "o-14", weight: 100 }], rotation: "weighted" },
      ],
      weight: 20,
    },
  ],
  splitMode: {
    kind: "rule-based",
    rules: [
      {
        id: "r-04a",
        pathId: "p-04a",
        conditions: [
          { field: "country", operator: "is", value: "US" },
          { field: "device", operator: "is", value: "mobile" },
        ],
      },
      {
        id: "r-04b",
        pathId: "p-04b",
        conditions: [
          { field: "country", operator: "in", value: ["DE", "FR", "GB", "NL"] },
          { field: "device", operator: "is", value: "mobile" },
        ],
      },
    ],
  },
  tracking: {
    redirectMode: "302",
    conversionMethod: "s2s",
    tokenMappings: [],
  },
  createdAt: "2024-07-10T10:00:00Z",
  updatedAt: "2024-11-04T09:30:00Z",
  stats: { clicks: 41200, conversions: 1580, revenue: 3476.00, cost: 1565.60 },
};

// Campaign 5: AI distribution
export const CAMPAIGN_5: Campaign = {
  id: "c-05",
  name: "AI-Optimized Sweeps",
  status: "active",
  trafficSourceId: "ts-propeller",
  country: "US",
  workspace: "Main workspace",
  tags: ["sweeps", "ai", "push"],
  cost: { type: "cpc", value: 0.042, currency: "USD" },
  paths: [
    {
      id: "p-05a",
      name: "Path A",
      slots: [
        { id: "s-05a-l", kind: "lander", items: [{ type: "lander", refId: "l-01", weight: 100 }], rotation: "weighted" },
        { id: "s-05a-o", kind: "offer", items: [{ type: "offer", refId: "o-01", weight: 100 }], rotation: "weighted" },
      ],
      weight: 32,
    },
    {
      id: "p-05b",
      name: "Path B",
      slots: [
        { id: "s-05b-l", kind: "lander", items: [{ type: "lander", refId: "l-15", weight: 100 }], rotation: "weighted" },
        { id: "s-05b-o", kind: "offer", items: [{ type: "offer", refId: "o-20", weight: 100 }], rotation: "weighted" },
      ],
      weight: 28,
    },
    {
      id: "p-05c",
      name: "Path C",
      slots: [
        { id: "s-05c-l", kind: "lander", items: [{ type: "lander", refId: "l-02", weight: 100 }], rotation: "weighted" },
        { id: "s-05c-o", kind: "offer", items: [{ type: "offer", refId: "o-02", weight: 100 }], rotation: "weighted" },
      ],
      weight: 24,
    },
    {
      id: "p-05d",
      name: "Path D",
      slots: [
        { id: "s-05d-l", kind: "lander", items: [{ type: "lander", refId: "l-07", weight: 100 }], rotation: "weighted" },
        { id: "s-05d-o", kind: "offer", items: [{ type: "offer", refId: "o-17", weight: 100 }], rotation: "weighted" },
      ],
      weight: 16,
    },
  ],
  splitMode: { kind: "ai", goal: "epc", minSample: 1000 },
  tracking: {
    redirectMode: "302",
    conversionMethod: "s2s",
    tokenMappings: [],
  },
  createdAt: "2024-06-01T08:00:00Z",
  updatedAt: "2024-11-05T11:00:00Z",
  stats: { clicks: 56890, conversions: 2241, revenue: 5378.40, cost: 2389.38 },
};

// Campaign 6: Multi-lander slot, paused
export const CAMPAIGN_6: Campaign = {
  id: "c-06",
  name: "Crypto Lander Test",
  status: "paused",
  trafficSourceId: "ts-taboola",
  country: "DE",
  workspace: "Main workspace",
  tags: ["crypto", "native", "de"],
  cost: { type: "cpc", value: 0.18, currency: "EUR" },
  paths: [
    {
      id: "p-06a",
      name: "Multi-Lander Variant",
      slots: [
        {
          id: "s-06a-l",
          kind: "lander",
          items: [
            { type: "lander", refId: "l-03", weight: 50 },
            { type: "lander", refId: "l-04", weight: 30 },
            { type: "lander", refId: "l-10", weight: 20 },
          ],
          rotation: "weighted",
        },
        { id: "s-06a-o", kind: "offer", items: [{ type: "offer", refId: "o-06", weight: 100 }], rotation: "weighted" },
      ],
      weight: 70,
    },
    {
      id: "p-06b",
      name: "Control",
      slots: [
        { id: "s-06b-l", kind: "lander", items: [{ type: "lander", refId: "l-03", weight: 100 }], rotation: "weighted" },
        { id: "s-06b-o", kind: "offer", items: [{ type: "offer", refId: "o-06", weight: 100 }], rotation: "weighted" },
      ],
      weight: 30,
    },
  ],
  splitMode: { kind: "weighted" },
  tracking: {
    redirectMode: "meta",
    conversionMethod: "pixel",
    tokenMappings: [],
  },
  createdAt: "2024-09-28T13:00:00Z",
  updatedAt: "2024-10-20T17:45:00Z",
  stats: { clicks: 6720, conversions: 48, revenue: 12000.00, cost: 1209.60 },
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  CAMPAIGN_1,
  CAMPAIGN_2,
  CAMPAIGN_3,
  CAMPAIGN_4,
  CAMPAIGN_5,
  CAMPAIGN_6,
];
