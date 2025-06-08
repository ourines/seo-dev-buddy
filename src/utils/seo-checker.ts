/**
 * SEO Checker - Rule-based SEO Analysis Engine
 *
 * This module implements the core SEO checking logic based on Google Search
 * best practices and generates actionable reports with scoring.
 */

import type {
  SEOCheckResult,
  SEOReport,
  SEOCheckConfig,
  SEOStatusLevel,
  SEOCheckCategory,
  MetaTagInfo,
  HeadingStructure,
  ImageAltInfo,
  LinkInfo,
  ContentMetrics,
  OpenGraphInfo,
  TwitterCardInfo,
  StructuredDataInfo,
} from '../types';

import {
  SEO_CHECK_IDS,
  TITLE_RULES,
  DESCRIPTION_RULES,
  CONTENT_RULES,
  HEADING_RULES,
  IMAGE_RULES,
  LINK_RULES,
  SEO_MESSAGES,
  HELP_URLS,
} from '../constants';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a standardized SEO check result
 */
function createCheckResult(
  id: string,
  label: string,
  category: SEOCheckCategory,
  status: SEOStatusLevel,
  value: any,
  displayValue: string,
  description: string,
  recommendation: string,
  isCritical = false,
  details?: Record<string, any>,
  helpUrl?: string
): SEOCheckResult {
  return {
    id,
    label,
    category,
    status,
    value,
    displayValue,
    description,
    recommendation,
    isCritical,
    details,
    helpUrl,
  };
}

/**
 * Calculate score based on check results
 */
function calculateScore(results: SEOCheckResult[]): number {
  const totalChecks = results.length;
  let passedChecks = 0;
  let warningChecks = 0;

  results.forEach(result => {
    switch (result.status) {
      case 'success':
        passedChecks += 1;
        break;
      case 'warning':
        warningChecks += 0.5; // Half points for warnings
        break;
      case 'error':
        // No points for errors
        break;
      case 'info':
        passedChecks += 0.8; // Most points for info
        break;
    }
  });

  return totalChecks > 0 ? Math.round(((passedChecks + warningChecks) / totalChecks) * 100) : 0;
}

// ============================================================================
// SEO CHECK FUNCTIONS
// ============================================================================

/**
 * Check title tag compliance
 */
export function checkTitle(metaTags: MetaTagInfo): SEOCheckResult {
  const { title } = metaTags;

  if (!title || title.trim() === '') {
    return createCheckResult(
      SEO_CHECK_IDS.TITLE,
      'Title Tag',
      'essentials',
      'error',
      null,
      'Missing',
      'Page is missing a title tag',
      'Add a unique, descriptive title tag between 30-60 characters',
      true,
      undefined,
      'https://developers.google.com/search/docs/appearance/title-link'
    );
  }

  const length = title.length;

  if (length < TITLE_RULES.MIN_LENGTH) {
    return createCheckResult(
      SEO_CHECK_IDS.TITLE,
      'Title Tag',
      'essentials',
      'warning',
      title,
      `${length} characters`,
      `Title is too short (${length} characters)`,
      `Expand title to at least ${TITLE_RULES.MIN_LENGTH} characters for better SEO`,
      true,
      { length, minLength: TITLE_RULES.MIN_LENGTH },
      'https://developers.google.com/search/docs/appearance/title-link'
    );
  }

  if (length > TITLE_RULES.MAX_LENGTH) {
    return createCheckResult(
      SEO_CHECK_IDS.TITLE,
      'Title Tag',
      'essentials',
      'warning',
      title,
      `${length} characters`,
      `Title is too long (${length} characters)`,
      `Shorten title to under ${TITLE_RULES.MAX_LENGTH} characters to avoid truncation`,
      true,
      { length, maxLength: TITLE_RULES.MAX_LENGTH },
      'https://developers.google.com/search/docs/appearance/title-link'
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.TITLE,
    'Title Tag',
    'essentials',
    'success',
    title,
    `${length} characters`,
    'Title length is optimal',
    'Title follows best practices for length and should perform well in search results',
    true,
    { length },
    'https://developers.google.com/search/docs/appearance/title-link'
  );
}

/**
 * Check meta description compliance
 */
export function checkDescription(metaTags: MetaTagInfo): SEOCheckResult {
  const { description } = metaTags;

  if (!description || description.trim() === '') {
    return createCheckResult(
      SEO_CHECK_IDS.DESCRIPTION,
      'Meta Description',
      'essentials',
      'error',
      null,
      'Missing',
      'Page is missing a meta description',
      'Add a compelling meta description between 120-160 characters',
      true,
      undefined,
      'https://developers.google.com/search/docs/appearance/snippet'
    );
  }

  const length = description.length;

  if (length < DESCRIPTION_RULES.MIN_LENGTH) {
    return createCheckResult(
      SEO_CHECK_IDS.DESCRIPTION,
      'Meta Description',
      'essentials',
      'warning',
      description,
      `${length} characters`,
      `Meta description is too short (${length} characters)`,
      `Expand description to at least ${DESCRIPTION_RULES.MIN_LENGTH} characters`,
      true,
      { length, minLength: DESCRIPTION_RULES.MIN_LENGTH },
      'https://developers.google.com/search/docs/appearance/snippet'
    );
  }

  if (length > DESCRIPTION_RULES.MAX_LENGTH) {
    return createCheckResult(
      SEO_CHECK_IDS.DESCRIPTION,
      'Meta Description',
      'essentials',
      'warning',
      description,
      `${length} characters`,
      `Meta description is too long (${length} characters)`,
      `Shorten description to under ${DESCRIPTION_RULES.MAX_LENGTH} characters`,
      true,
      { length, maxLength: DESCRIPTION_RULES.MAX_LENGTH },
      'https://developers.google.com/search/docs/appearance/snippet'
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.DESCRIPTION,
    'Meta Description',
    'essentials',
    'success',
    description,
    `${length} characters`,
    'Meta description length is optimal',
    'Description follows best practices and should display well in search results',
    true,
    { length },
    'https://developers.google.com/search/docs/appearance/snippet'
  );
}

/**
 * Check H1 tag compliance
 */
export function checkH1(headings: HeadingStructure): SEOCheckResult {
  const { h1 } = headings;

  if (h1.count === 0) {
    return createCheckResult(
      SEO_CHECK_IDS.H1_COUNT,
      'H1 Tag',
      'essentials',
      'error',
      null,
      'Missing',
      'Page is missing an H1 tag',
      'Add exactly one H1 tag to define the main topic of the page',
      true,
      { count: 0 },
      HELP_URLS.HEADINGS
    );
  }

  if (h1.count > HEADING_RULES.MAX_H1_COUNT) {
    return createCheckResult(
      SEO_CHECK_IDS.H1_COUNT,
      'H1 Tag',
      'essentials',
      'warning',
      h1.texts,
      `${h1.count} H1 tags`,
      `Multiple H1 tags found (${h1.count})`,
      'Use only one H1 tag per page for better SEO structure',
      true,
      { count: h1.count, texts: h1.texts },
      HELP_URLS.HEADINGS
    );
  }

  const h1Text = h1.texts[0] || '';
  const length = h1Text.length;

  if (length < 10) {
    return createCheckResult(
      SEO_CHECK_IDS.H1_CONTENT,
      'H1 Content',
      'content',
      'warning',
      h1Text,
      `"${h1Text}" (${length} chars)`,
      'H1 text is very short',
      'Make H1 more descriptive and informative (at least 10 characters)',
      false,
      { text: h1Text, length },
      HELP_URLS.HEADINGS
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.H1_COUNT,
    'H1 Tag',
    'essentials',
    'success',
    h1Text,
    `"${h1Text}"`,
    'H1 structure is optimal',
    'Page has exactly one H1 tag with appropriate content',
    true,
    { count: h1.count, text: h1Text },
    HELP_URLS.HEADINGS
  );
}

/**
 * Check canonical URL
 */
export function checkCanonical(metaTags: MetaTagInfo): SEOCheckResult {
  const { canonical } = metaTags;

  if (!canonical) {
    return createCheckResult(
      SEO_CHECK_IDS.CANONICAL,
      'Canonical URL',
      'technical',
      'warning',
      null,
      'Missing',
      'Page is missing a canonical URL',
      'Add a canonical link tag to prevent duplicate content issues',
      false,
      undefined,
      HELP_URLS.CANONICAL
    );
  }

  // Basic URL validation
  try {
    const url = new URL(canonical, window.location.origin);
    const isAbsolute = canonical.startsWith('http://') || canonical.startsWith('https://');

    return createCheckResult(
      SEO_CHECK_IDS.CANONICAL,
      'Canonical URL',
      'technical',
      'success',
      canonical,
      isAbsolute ? canonical : `${window.location.origin}${canonical}`,
      'Canonical URL is properly set',
      'Canonical URL helps prevent duplicate content issues',
      false,
      { url: canonical, isAbsolute },
      HELP_URLS.CANONICAL
    );
  } catch (error) {
    return createCheckResult(
      SEO_CHECK_IDS.CANONICAL,
      'Canonical URL',
      'technical',
      'error',
      canonical,
      canonical,
      'Canonical URL is malformed',
      'Fix the canonical URL format to be a valid URL',
      false,
      { url: canonical, error: 'Invalid URL format' },
      HELP_URLS.CANONICAL
    );
  }
}

/**
 * Check robots meta tag
 */
export function checkRobots(metaTags: MetaTagInfo): SEOCheckResult {
  const { robots } = metaTags;

  if (!robots) {
    return createCheckResult(
      SEO_CHECK_IDS.ROBOTS,
      'Robots Meta',
      'technical',
      'info',
      null,
      'Not specified',
      'No robots meta tag found',
      'Consider adding robots meta tag if you need specific crawling instructions',
      false,
      undefined,
      HELP_URLS.ROBOTS
    );
  }

  const robotsLower = robots.toLowerCase();
  const hasNoindex = robotsLower.includes('noindex');
  const hasNofollow = robotsLower.includes('nofollow');

  if (hasNoindex) {
    return createCheckResult(
      SEO_CHECK_IDS.ROBOTS,
      'Robots Meta',
      'technical',
      'warning',
      robots,
      robots,
      'Page is set to noindex',
      'This page will not be indexed by search engines. Remove noindex if you want it indexed',
      true,
      { directive: robots, noindex: true, nofollow: hasNofollow },
      HELP_URLS.ROBOTS
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.ROBOTS,
    'Robots Meta',
    'technical',
    'success',
    robots,
    robots,
    'Robots directive allows indexing',
    'Page can be properly indexed and crawled by search engines',
    false,
    { directive: robots, noindex: false, nofollow: hasNofollow },
    HELP_URLS.ROBOTS
  );
}

/**
 * Check HTML lang attribute
 */
export function checkHtmlLang(metaTags: MetaTagInfo): SEOCheckResult {
  const { htmlLang } = metaTags;

  if (!htmlLang) {
    return createCheckResult(
      SEO_CHECK_IDS.HTML_LANG,
      'HTML Lang',
      'accessibility',
      'warning',
      null,
      'Missing',
      'HTML lang attribute is missing',
      'Add lang attribute to <html> tag for better accessibility and SEO',
      false,
      undefined,
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang'
    );
  }

  // Basic lang code validation (simplified)
  const isValidLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(htmlLang);

  if (!isValidLang) {
    return createCheckResult(
      SEO_CHECK_IDS.HTML_LANG,
      'HTML Lang',
      'accessibility',
      'warning',
      htmlLang,
      htmlLang,
      'HTML lang attribute format may be invalid',
      'Use standard language codes like "en", "en-US", "zh-CN"',
      false,
      { lang: htmlLang, isValid: false },
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang'
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.HTML_LANG,
    'HTML Lang',
    'accessibility',
    'success',
    htmlLang,
    htmlLang,
    'HTML lang attribute is properly set',
    'Language is properly declared for accessibility and SEO',
    false,
    { lang: htmlLang, isValid: true },
    'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang'
  );
}

/**
 * Check viewport meta tag
 */
export function checkViewport(metaTags: MetaTagInfo): SEOCheckResult {
  const { viewport } = metaTags;

  if (!viewport) {
    return createCheckResult(
      SEO_CHECK_IDS.VIEWPORT,
      'Viewport Meta',
      'mobile',
      'error',
      null,
      'Missing',
      'Viewport meta tag is missing',
      'Add viewport meta tag for mobile responsiveness',
      true,
      undefined,
      HELP_URLS.MOBILE
    );
  }

  const hasWidthDevice = viewport.includes('width=device-width');
  const hasInitialScale = viewport.includes('initial-scale=1');

  if (!hasWidthDevice || !hasInitialScale) {
    return createCheckResult(
      SEO_CHECK_IDS.VIEWPORT,
      'Viewport Meta',
      'mobile',
      'warning',
      viewport,
      viewport,
      'Viewport configuration may not be optimal',
      'Use "width=device-width, initial-scale=1" for best mobile experience',
      false,
      { viewport, hasWidthDevice, hasInitialScale },
      HELP_URLS.MOBILE
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.VIEWPORT,
    'Viewport Meta',
    'mobile',
    'success',
    viewport,
    viewport,
    'Viewport is properly configured',
    'Page is optimized for mobile devices',
    false,
    { viewport, hasWidthDevice, hasInitialScale },
    HELP_URLS.MOBILE
  );
}

/**
 * Check content quality
 */
export function checkContent(content: ContentMetrics): SEOCheckResult {
  const { wordCount, meetsMinLength } = content;

  if (!meetsMinLength) {
    return createCheckResult(
      SEO_CHECK_IDS.WORD_COUNT,
      'Content Length',
      'content',
      'warning',
      wordCount,
      `${wordCount} words`,
      `Content is too short (${wordCount} words)`,
      `Add more valuable content. Aim for at least ${CONTENT_RULES.MIN_WORD_COUNT} words`,
      false,
      { wordCount, minRequired: CONTENT_RULES.MIN_WORD_COUNT },
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'
    );
  }

  if (wordCount >= CONTENT_RULES.RECOMMENDED_WORD_COUNT) {
    return createCheckResult(
      SEO_CHECK_IDS.WORD_COUNT,
      'Content Length',
      'content',
      'success',
      wordCount,
      `${wordCount} words`,
      'Content length is excellent',
      'Page has substantial content that provides value to users',
      false,
      { wordCount, recommended: CONTENT_RULES.RECOMMENDED_WORD_COUNT },
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.WORD_COUNT,
    'Content Length',
    'content',
    'success',
    wordCount,
    `${wordCount} words`,
    'Content length meets minimum requirements',
    'Page has adequate content length for SEO',
    false,
    { wordCount, minRequired: CONTENT_RULES.MIN_WORD_COUNT },
    'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'
  );
}

/**
 * Check image alt text
 */
export function checkImages(images: ImageAltInfo): SEOCheckResult {
  const { total, missingAlt, altTextCoverage } = images;

  if (total === 0) {
    return createCheckResult(
      SEO_CHECK_IDS.IMAGE_ALT,
      'Image Alt Text',
      'accessibility',
      'info',
      0,
      'No images found',
      'No images found on the page',
      'When you add images, ensure they have descriptive alt text',
      false,
      { total: 0 },
      HELP_URLS.IMAGES
    );
  }

  if (missingAlt > 0) {
    const missingPercentage = Math.round((missingAlt / total) * 100);
    return createCheckResult(
      SEO_CHECK_IDS.IMAGE_ALT,
      'Image Alt Text',
      'accessibility',
      'warning',
      { total, missingAlt, coverage: altTextCoverage },
      `${missingAlt}/${total} missing alt text`,
      `${missingAlt} images are missing alt text (${missingPercentage}%)`,
      'Add descriptive alt text to all images for accessibility and SEO',
      false,
      { total, missingAlt, coverage: altTextCoverage, missingPercentage },
      HELP_URLS.IMAGES
    );
  }

  return createCheckResult(
    SEO_CHECK_IDS.IMAGE_ALT,
    'Image Alt Text',
    'accessibility',
    'success',
    { total, missingAlt: 0, coverage: altTextCoverage },
    `${total} images with alt text`,
    'All images have alt text',
    'Images are properly optimized for accessibility and SEO',
    false,
    { total, missingAlt: 0, coverage: altTextCoverage },
    HELP_URLS.IMAGES
  );
}

/**
 * Perform comprehensive SEO analysis
 */
export function performSEOChecks(
  metaTags: MetaTagInfo,
  headings: HeadingStructure,
  images: ImageAltInfo,
  links: LinkInfo,
  content: ContentMetrics,
  openGraph: OpenGraphInfo,
  twitterCard: TwitterCardInfo,
  structuredData: StructuredDataInfo,
  config?: SEOCheckConfig
): SEOReport {
  const checks: SEOCheckResult[] = [];

  // Essential SEO checks
  checks.push(checkTitle(metaTags));
  checks.push(checkDescription(metaTags));
  checks.push(checkH1(headings));
  checks.push(checkCanonical(metaTags));
  checks.push(checkRobots(metaTags));
  checks.push(checkHtmlLang(metaTags));

  // Content checks
  checks.push(checkContent(content));

  // Accessibility checks
  checks.push(checkImages(images));
  checks.push(checkViewport(metaTags));

  // Group checks by category
  const checksByCategory: Record<SEOCheckCategory, SEOCheckResult[]> = {
    essentials: [],
    content: [],
    accessibility: [],
    social: [],
    technical: [],
    performance: [],
    mobile: [],
    links: [],
  };

  checks.forEach(check => {
    checksByCategory[check.category].push(check);
  });

  // Calculate overall score
  const overallScore = calculateScore(checks);

  // Count results by status
  const passed = checks.filter(r => r.status === 'success').length;
  const warnings = checks.filter(r => r.status === 'warning').length;
  const errors = checks.filter(r => r.status === 'error').length;
  const critical = checks.filter(r => r.isCritical && r.status === 'error').length;

  return {
    timestamp: new Date(),
    url: window.location.href,
    pageTitle: metaTags.title,
    overallScore,
    checks,
    checksByCategory,
    summary: {
      total: checks.length,
      passed,
      warnings,
      errors,
      critical,
    },
    rawData: {
      metaTags,
      headings,
      images,
      links,
      content,
      openGraph,
      twitterCard,
      structuredData,
    },
  };
}
