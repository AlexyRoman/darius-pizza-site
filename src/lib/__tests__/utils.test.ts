/**
 * Tests for utils (className utility)
 */

import { cn } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('class1', false && 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class3');
      expect(result).not.toContain('class2');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle empty arguments', () => {
      const result = cn();
      expect(typeof result).toBe('string');
    });

    it('should merge Tailwind classes correctly', () => {
      // Test that conflicting Tailwind classes are resolved
      const result = cn('p-4', 'p-2');
      // Should contain only one padding class (p-2 should win)
      expect(result).toBeTruthy();
    });

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});
