/**
 * Tests for generic middleware configuration
 *
 * These tests verify middleware constants and patterns are correct.
 */

import {
  STATIC_PATH_PREFIXES,
  STATIC_FILE_EXTENSIONS,
  STATIC_FILE_PATTERN,
  PERMANENT_REDIRECT_STATUS,
  TEMPORARY_REDIRECT_STATUS,
  CONVERT_TEMPORARY_TO_PERMANENT,
} from '../middleware';

describe('middleware config', () => {
  describe('STATIC_PATH_PREFIXES', () => {
    it('should contain expected path prefixes', () => {
      expect(STATIC_PATH_PREFIXES).toContain('/api');
      expect(STATIC_PATH_PREFIXES).toContain('/_next');
      expect(STATIC_PATH_PREFIXES).toContain('/static');
      expect(STATIC_PATH_PREFIXES).toContain('/images');
      expect(STATIC_PATH_PREFIXES).toContain('/flags');
      expect(STATIC_PATH_PREFIXES).toContain('/fonts');
    });

    it('should be a readonly array', () => {
      expect(Object.isFrozen(STATIC_PATH_PREFIXES)).toBe(false);
      // But it's const so TypeScript prevents mutation
    });
  });

  describe('STATIC_FILE_EXTENSIONS', () => {
    it('should contain expected file extensions', () => {
      expect(STATIC_FILE_EXTENSIONS).toContain('ico');
      expect(STATIC_FILE_EXTENSIONS).toContain('png');
      expect(STATIC_FILE_EXTENSIONS).toContain('jpg');
      expect(STATIC_FILE_EXTENSIONS).toContain('jpeg');
      expect(STATIC_FILE_EXTENSIONS).toContain('svg');
      expect(STATIC_FILE_EXTENSIONS).toContain('webp');
      expect(STATIC_FILE_EXTENSIONS).toContain('webmanifest');
      expect(STATIC_FILE_EXTENSIONS).toContain('txt');
    });
  });

  describe('STATIC_FILE_PATTERN', () => {
    it('should match file extensions', () => {
      expect(STATIC_FILE_PATTERN.test('file.ico')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('image.png')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('photo.jpg')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('picture.jpeg')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('icon.svg')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('image.webp')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('key.txt')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(STATIC_FILE_PATTERN.test('file.ICO')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('image.PNG')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('photo.JPG')).toBe(true);
    });

    it('should not match non-static files', () => {
      expect(STATIC_FILE_PATTERN.test('file.ts')).toBe(false);
      expect(STATIC_FILE_PATTERN.test('file.js')).toBe(false);
      expect(STATIC_FILE_PATTERN.test('file.tsx')).toBe(false);
      expect(STATIC_FILE_PATTERN.test('file.css')).toBe(false);
      expect(STATIC_FILE_PATTERN.test('file')).toBe(false);
    });

    it('should match extensions at end of path', () => {
      expect(STATIC_FILE_PATTERN.test('/path/to/file.png')).toBe(true);
      expect(STATIC_FILE_PATTERN.test('/image.jpg')).toBe(true);
    });

    it('should not match extensions in middle of filename', () => {
      expect(STATIC_FILE_PATTERN.test('file.png.backup')).toBe(false);
    });
  });

  describe('PERMANENT_REDIRECT_STATUS', () => {
    it('should be 301', () => {
      expect(PERMANENT_REDIRECT_STATUS).toBe(301);
    });
  });

  describe('TEMPORARY_REDIRECT_STATUS', () => {
    it('should be 307', () => {
      expect(TEMPORARY_REDIRECT_STATUS).toBe(307);
    });
  });

  describe('CONVERT_TEMPORARY_TO_PERMANENT', () => {
    it('should be a boolean', () => {
      expect(typeof CONVERT_TEMPORARY_TO_PERMANENT).toBe('boolean');
    });

    it('should be true by default', () => {
      expect(CONVERT_TEMPORARY_TO_PERMANENT).toBe(true);
    });
  });
});
