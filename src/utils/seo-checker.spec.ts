/**
 * SEO Checker Tests
 *
 * Unit tests for the SEO checking functionality
 */

import { describe, it, expect } from 'vitest';
import {
  checkTitle,
  checkDescription,
  checkH1,
  checkCanonical,
  checkRobots,
  checkHtmlLang,
  checkViewport,
  checkContent,
  checkImages,
  performSEOChecks,
} from './seo-checker';

import type {
  MetaTagInfo,
  HeadingStructure,
  ImageAltInfo,
  LinkInfo,
  ContentMetrics,
  OpenGraphInfo,
  TwitterCardInfo,
  StructuredDataInfo,
} from '../types';

// Mock data for testing
const mockMetaTags: MetaTagInfo = {
  title: 'This is an optimal SEO title that meets length requirements',
  description: 'This is a test meta description that should be long enough to meet the minimum requirements for SEO best practices and optimization.',
  keywords: 'test, seo, keywords',
  robots: 'index, follow',
  canonical: 'https://example.com/test-page',
  htmlLang: 'en',
  viewport: 'width=device-width, initial-scale=1',
  charset: 'UTF-8',
};

const mockHeadings: HeadingStructure = {
  h1: {
    count: 1,
    texts: ['Main Page Heading'],
    isOptimal: true,
  },
  h2: 3,
  h3: 2,
  h4: 1,
  h5: 0,
  h6: 0,
  allHeadings: [
    { level: 1, text: 'Main Page Heading', hasProperHierarchy: true, position: 0 },
    { level: 2, text: 'Section 1', hasProperHierarchy: true, position: 1 },
    { level: 2, text: 'Section 2', hasProperHierarchy: true, position: 2 },
  ],
  hasLogicalHierarchy: true,
};

const mockImages: ImageAltInfo = {
  total: 5,
  missingAlt: 0,
  emptyAlt: 1,
  descriptiveAlt: 4,
  altTextCoverage: 100,
};

const mockLinks: LinkInfo = {
  internal: 8,
  external: 3,
  nonDescriptive: 1,
  newWindow: 2,
};

const mockContent: ContentMetrics = {
  wordCount: 450,
  readingTime: 3,
  density: 15.5,
  meetsMinLength: true,
};

const mockOpenGraph: OpenGraphInfo = {
  title: 'Test OG Title',
  description: 'Test OG Description',
  image: 'https://example.com/og-image.jpg',
  url: 'https://example.com/test-page',
  type: 'article',
  siteName: 'Test Site',
  locale: 'en_US',
};

const mockTwitterCard: TwitterCardInfo = {
  card: 'summary_large_image',
  title: 'Test Twitter Title',
  description: 'Test Twitter Description',
  image: 'https://example.com/twitter-image.jpg',
  site: '@testsite',
  creator: '@testcreator',
};

const mockStructuredData: StructuredDataInfo = {
  hasStructuredData: true,
  items: [],
  typeCount: {} as any,
  isValid: true,
  globalErrors: [],
};

describe('SEO Checker', () => {
  describe('checkTitle', () => {
    it('should pass for optimal title length', () => {
      const result = checkTitle(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(true);
    });

    it('should fail for missing title', () => {
      const emptyMeta = { ...mockMetaTags, title: '' };
      const result = checkTitle(emptyMeta);
      expect(result.status).toBe('error');
      expect(result.isCritical).toBe(true);
    });

    it('should warn for short title', () => {
      const shortMeta = { ...mockMetaTags, title: 'Short' };
      const result = checkTitle(shortMeta);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(true);
    });

    it('should warn for long title', () => {
      const longTitle = 'This is a very long title that exceeds the recommended maximum length for SEO optimization and may be truncated in search results';
      const longMeta = { ...mockMetaTags, title: longTitle };
      const result = checkTitle(longMeta);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(true);
    });
  });

  describe('checkDescription', () => {
    it('should pass for optimal description length', () => {
      const result = checkDescription(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(true);
    });

    it('should fail for missing description', () => {
      const emptyMeta = { ...mockMetaTags, description: null };
      const result = checkDescription(emptyMeta);
      expect(result.status).toBe('error');
      expect(result.isCritical).toBe(true);
    });

    it('should warn for short description', () => {
      const shortMeta = { ...mockMetaTags, description: 'Too short' };
      const result = checkDescription(shortMeta);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(true);
    });
  });

  describe('checkH1', () => {
    it('should pass for single H1 tag', () => {
      const result = checkH1(mockHeadings);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(true);
    });

    it('should fail for missing H1', () => {
      const noH1 = {
        ...mockHeadings,
        h1: { count: 0, texts: [], isOptimal: false },
      };
      const result = checkH1(noH1);
      expect(result.status).toBe('error');
      expect(result.isCritical).toBe(true);
    });

    it('should warn for multiple H1 tags', () => {
      const multipleH1 = {
        ...mockHeadings,
        h1: { count: 2, texts: ['First H1', 'Second H1'], isOptimal: false },
      };
      const result = checkH1(multipleH1);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(true);
    });
  });

  describe('checkCanonical', () => {
    it('should pass for valid canonical URL', () => {
      const result = checkCanonical(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should warn for missing canonical', () => {
      const noCanonical = { ...mockMetaTags, canonical: null };
      const result = checkCanonical(noCanonical);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });

    it('should handle relative canonical URL', () => {
      const relativeCanonical = { ...mockMetaTags, canonical: '/relative-path' };
      const result = checkCanonical(relativeCanonical);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
      expect(result.details?.isAbsolute).toBe(false);
    });
  });

  describe('checkRobots', () => {
    it('should pass for index, follow', () => {
      const result = checkRobots(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should warn for noindex', () => {
      const noindex = { ...mockMetaTags, robots: 'noindex, follow' };
      const result = checkRobots(noindex);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(true);
    });

    it('should be info for missing robots', () => {
      const noRobots = { ...mockMetaTags, robots: null };
      const result = checkRobots(noRobots);
      expect(result.status).toBe('info');
      expect(result.isCritical).toBe(false);
    });
  });

  describe('checkHtmlLang', () => {
    it('should pass for valid language code', () => {
      const result = checkHtmlLang(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should warn for missing lang attribute', () => {
      const noLang = { ...mockMetaTags, htmlLang: null };
      const result = checkHtmlLang(noLang);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });

    it('should warn for invalid language code', () => {
      const invalidLang = { ...mockMetaTags, htmlLang: 'invalid-lang' };
      const result = checkHtmlLang(invalidLang);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });
  });

  describe('checkViewport', () => {
    it('should pass for proper viewport', () => {
      const result = checkViewport(mockMetaTags);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should error for missing viewport', () => {
      const noViewport = { ...mockMetaTags, viewport: null };
      const result = checkViewport(noViewport);
      expect(result.status).toBe('error');
      expect(result.isCritical).toBe(true);
    });

    it('should warn for suboptimal viewport', () => {
      const badViewport = { ...mockMetaTags, viewport: 'width=1024' };
      const result = checkViewport(badViewport);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });
  });

  describe('checkContent', () => {
    it('should pass for adequate content length', () => {
      const result = checkContent(mockContent);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should warn for short content', () => {
      const shortContent = { ...mockContent, wordCount: 150, meetsMinLength: false };
      const result = checkContent(shortContent);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });

    it('should pass with success for excellent content length', () => {
      const excellentContent = { ...mockContent, wordCount: 800 };
      const result = checkContent(excellentContent);
      expect(result.status).toBe('success');
      expect(result.displayValue).toBe('800 words');
    });
  });

  describe('checkImages', () => {
    it('should pass when all images have alt text', () => {
      const result = checkImages(mockImages);
      expect(result.status).toBe('success');
      expect(result.isCritical).toBe(false);
    });

    it('should warn when some images are missing alt text', () => {
      const missingAlt = { ...mockImages, missingAlt: 2 };
      const result = checkImages(missingAlt);
      expect(result.status).toBe('warning');
      expect(result.isCritical).toBe(false);
    });

    it('should be info when no images are found', () => {
      const noImages = { total: 0, missingAlt: 0, emptyAlt: 0, descriptiveAlt: 0, altTextCoverage: 100 };
      const result = checkImages(noImages);
      expect(result.status).toBe('info');
      expect(result.isCritical).toBe(false);
    });
  });

  describe('performSEOChecks', () => {
    it('should return comprehensive SEO report', () => {
      const report = performSEOChecks(
        mockMetaTags,
        mockHeadings,
        mockImages,
        mockLinks,
        mockContent,
        mockOpenGraph,
        mockTwitterCard,
        mockStructuredData
      );

      expect(report).toBeDefined();
      expect(report.checks).toHaveLength(9); // Number of checks we've implemented
      expect(report.overallScore).toBeGreaterThan(0);
      expect(report.summary.total).toBe(9);
      expect(report.checksByCategory).toBeDefined();
      expect(report.rawData).toBeDefined();
    });

    it('should calculate correct summary statistics', () => {
      const report = performSEOChecks(
        mockMetaTags,
        mockHeadings,
        mockImages,
        mockLinks,
        mockContent,
        mockOpenGraph,
        mockTwitterCard,
        mockStructuredData
      );

      const { summary } = report;
      expect(summary.total).toBe(summary.passed + summary.warnings + summary.errors);
      expect(summary.critical).toBeLessThanOrEqual(summary.errors);
    });

    it('should group checks by category correctly', () => {
      const report = performSEOChecks(
        mockMetaTags,
        mockHeadings,
        mockImages,
        mockLinks,
        mockContent,
        mockOpenGraph,
        mockTwitterCard,
        mockStructuredData
      );

      const { checksByCategory } = report;
      expect(checksByCategory.essentials.length).toBeGreaterThan(0);
      expect(checksByCategory.content.length).toBeGreaterThan(0);
      expect(checksByCategory.accessibility.length).toBeGreaterThan(0);
      expect(checksByCategory.technical.length).toBeGreaterThan(0);
      expect(checksByCategory.mobile.length).toBeGreaterThan(0);
    });
  });
});
