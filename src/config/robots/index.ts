import type { RobotsConfig } from '@/types/config';

import disallowedPaths from './settings/disallowed-paths.json';
import settings from './settings/settings.json';
import userAgents from './settings/user-agents.json';

type UserAgentsConfig = { default: string; aiBots: string[] };

export function generateRules() {
  const ua = userAgents as unknown as UserAgentsConfig;
  const rules = [
    {
      userAgent: ua.default,
      allow: ['/'],
      disallow: disallowedPaths as string[],
    },
    ...ua.aiBots.map(userAgent => ({
      userAgent,
      allow: ['/'],
      disallow: disallowedPaths as string[],
    })),
  ];

  return rules;
}

export const robotsConfig: RobotsConfig = {
  rules: generateRules(),
  ...(settings as { sitemap: boolean; host: boolean }),
};

export default robotsConfig;


