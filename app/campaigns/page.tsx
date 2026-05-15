import { CampaignsTable } from "@/components/campaigns/campaigns-table";

export default function CampaignsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium tracking-tight text-text">
          Campaigns
        </h1>
        <p className="mt-0.5 text-sm text-text-subtle">
          All campaigns across workspaces
        </p>
      </div>
      <CampaignsTable />
    </div>
  );
}
