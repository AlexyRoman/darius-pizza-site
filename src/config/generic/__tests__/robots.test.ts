/**
 * Tests for robots.txt generation
 *
 * These tests verify that robots.txt rules are generated correctly
 * from configuration files.
 */

// Mock the JSON imports BEFORE importing the module
// In TypeScript/Next.js, JSON imports are default exports
jest.mock('../robots/settings/user-agents.json', () => ({
  default: '*',
  aiBots: ['GPTBot', 'ChatGPT-User', 'CCBot'],
}), { virtual: true });

jest.mock('../robots/settings/settings.json', () => ({
  sitemap: true,
  host: true,
}), { virtual: true });

jest.mock('@/config/site/robots/settings/disallowed-paths.json', () => [
  '/api/*',
  '/admin',
  '/dashboard',
], { virtual: true });

import { generateRules, robotsConfig } from '../robots';

describe('robots config', () => {
  describe('generateRules', () => {
    it('should generate rules for default user agent', () => {
      const rules = generateRules();
      expect(rules).toBeDefined();
      expect(rules.length).toBeGreaterThan(0);

      const defaultRule = rules.find(r => r.userAgent === '*');
      expect(defaultRule).toBeDefined();
      expect(defaultRule?.allow).toEqual(['/']);
      expect(defaultRule?.disallow).toEqual(['/api/*', '/admin', '/dashboard']);
    });

    it('should generate rules for AI bots', () => {
      const rules = generateRules();
      const aiBotRules = rules.filter(
        r => r.userAgent !== '*' && ['GPTBot', 'ChatGPT-User', 'CCBot'].includes(r.userAgent)
      );
      expect(aiBotRules).toHaveLength(3);

      aiBotRules.forEach(rule => {
        expect(rule.allow).toEqual(['/']);
        expect(rule.disallow).toEqual(['/api/*', '/admin', '/dashboard']);
      });
    });

    it('should include all user agents from config', () => {
      const rules = generateRules();
      const userAgents = rules.map(r => r.userAgent);
      expect(userAgents).toContain('*');
      expect(userAgents).toContain('GPTBot');
      expect(userAgents).toContain('ChatGPT-User');
      expect(userAgents).toContain('CCBot');
    });

    it('should apply same disallow paths to all rules', () => {
      const rules = generateRules();
      const expectedDisallow = ['/api/*', '/admin', '/dashboard'];

      rules.forEach(rule => {
        expect(rule.disallow).toEqual(expectedDisallow);
      });
    });
  });

  describe('robotsConfig', () => {
    it('should include generated rules', () => {
      expect(robotsConfig.rules).toBeDefined();
      expect(robotsConfig.rules.length).toBeGreaterThan(0);
    });

    it('should include sitemap setting', () => {
      expect(robotsConfig.sitemap).toBe(true);
    });

    it('should include host setting', () => {
      expect(robotsConfig.host).toBe(true);
    });

    it('should match generateRules output', () => {
      const generatedRules = generateRules();
      expect(robotsConfig.rules).toEqual(generatedRules);
    });
  });
});

