export type RobotsRule = {
  userAgent: string;
  allow?: string[] | string;
  disallow?: string[] | string;
};

export type RobotsConfig = {
  rules: RobotsRule[];
  sitemap?: boolean;
  host?: boolean;
};
