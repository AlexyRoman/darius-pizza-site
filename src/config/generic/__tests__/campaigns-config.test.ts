import { findCampaignByCode, getCampaignsConfig } from '../campaigns-config';

describe('campaigns-config', () => {
  it('getCampaignsConfig returns expected shape', () => {
    const config = getCampaignsConfig();

    expect(config).toBeDefined();
    expect(typeof config.enabled).toBe('boolean');
    expect(Array.isArray(config.campaigns)).toBe(true);

    const demo = config.campaigns.find(c => c.code === 'DEMO');
    expect(demo).toBeDefined();
    expect(demo?.target).toBe('/en');
    expect(demo?.status).toBe(302);
  });

  it('findCampaignByCode is case-insensitive', () => {
    const upper = findCampaignByCode('DEMO');
    const lower = findCampaignByCode('demo');
    const mixed = findCampaignByCode('DeMo');

    expect(upper).toBeDefined();
    expect(lower).toBeDefined();
    expect(mixed).toBeDefined();

    expect(upper).toEqual(lower);
    expect(upper).toEqual(mixed);
  });

  it('findCampaignByCode returns undefined for unknown codes', () => {
    const unknown = findCampaignByCode('XXXX');
    expect(unknown).toBeUndefined();
  });
});
