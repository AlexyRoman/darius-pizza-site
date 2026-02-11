import campaignsConfig from '@/config/site/campaigns.json';

export type CampaignDefinition = {
  code: string;
  target: string;
  status?: number;
};

export type CampaignsConfig = {
  enabled: boolean;
  defaultStatus?: number;
  campaigns: CampaignDefinition[];
};

/**
 * Returns the raw campaigns configuration loaded from JSON.
 * The JSON file is treated as the single source of truth.
 */
export function getCampaignsConfig(): CampaignsConfig {
  // Narrow the imported JSON to the expected shape at the boundary
  return campaignsConfig as CampaignsConfig;
}

/**
 * Case-insensitive lookup for a campaign by its short code.
 *
 * Examples:
 * - "demo" -> matches "DEMO"
 * - "DeMo" -> matches "DEMO"
 */
export function findCampaignByCode(
  code: string
): CampaignDefinition | undefined {
  const config = getCampaignsConfig();
  const normalized = code.toUpperCase();

  return config.campaigns.find(
    campaign => campaign.code.toUpperCase() === normalized
  );
}
