/**
 * DOM Analyzer - Core SEO Data Extraction Engine
 *
 * This module provides utilities for extracting SEO-related information
 * from the DOM, following Google Search best practices.
 */

import type {
  MetaTagInfo,
  HeadingStructure,
  HeadingInfo,
  H1Info,
  ImageAltInfo,
  LinkInfo,
  ContentMetrics,
  OpenGraphInfo,
  TwitterCardInfo,
  StructuredDataInfo,
  StructuredDataItem,
  StructuredDataType,
} from '../types';

import {
  CONTENT_RULES,
  STRUCTURED_DATA_SCHEMAS,
} from '../constants';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely get meta tag content by selector
 */
export function getMetaContent(selector: string): string | null {
  const element = document.querySelector(selector);
  return element?.getAttribute('content') || null;
}

/**
 * Safely get attribute value from an element
 */
export function getElementAttribute(selector: string, attribute: string): string | null {
  const element = document.querySelector(selector);
  return element?.getAttribute(attribute) || null;
}

/**
 * Get text content from an element, handling null cases
 */
export function getElementText(selector: string): string | null {
  const element = document.querySelector(selector);
  return element?.textContent?.trim() || null;
}

/**
 * Check if a URL is internal (same domain or relative)
 */
export function isInternalLink(href: string, currentHostname: string): boolean {
  if (!href) return false;

  // Handle relative URLs
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
    return true;
  }

  // Handle absolute URLs
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname === currentHostname;
  } catch {
    // If URL parsing fails, treat as external for safety
    return false;
  }
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / CONTENT_RULES.READING_SPEED_WPM);
}

/**
 * Extract main content from the page using common selectors
 */
export function extractMainContent(): string {
  const selectors = [
    'main',
    'article[role="main"]',
    'div[role="main"]',
    '#content',
    '#main',
    '#main-content',
    '#primary',
    '.content',
    '.main-content',
    'article',
  ];

  // Try to find main content element
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return (element as HTMLElement).innerText || element.textContent || '';
    }
  }

  // Fallback: use body but exclude common non-content areas
  const bodyClone = document.body.cloneNode(true) as HTMLElement;
  const excludeSelectors = [
    'header', 'footer', 'nav', 'aside',
    'script', 'style', 'noscript', 'svg',
    '.header', '.footer', '.nav', '.sidebar',
    '.advertisement', '.ads', '.social-share',
    '#header', '#footer', '#nav', '#sidebar',
  ];

  excludeSelectors.forEach(selector => {
    bodyClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  return bodyClone.innerText || bodyClone.textContent || '';
}

// ============================================================================
// META TAG ANALYSIS
// ============================================================================

/**
 * Extract all meta tag information
 */
export function analyzeMetaTags(): MetaTagInfo {
  return {
    title: document.title || '',
    description: getMetaContent('meta[name="description"]'),
    keywords: getMetaContent('meta[name="keywords"]'),
    robots: getMetaContent('meta[name="robots"]'),
    canonical: getElementAttribute('link[rel="canonical"]', 'href'),
    htmlLang: document.documentElement.getAttribute('lang'),
    viewport: getMetaContent('meta[name="viewport"]'),
    charset: getElementAttribute('meta[charset]', 'charset') ||
      getMetaContent('meta[http-equiv="Content-Type"]'),
  };
}

// ============================================================================
// HEADING ANALYSIS
// ============================================================================

/**
 * Analyze heading structure and hierarchy
 */
export function analyzeHeadings(): HeadingStructure {
  const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allHeadings: HeadingInfo[] = [];
  const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

  // Collect all headings with their information
  headingSelectors.forEach((selector, index) => {
    const level = index + 1;
    const elements = document.querySelectorAll(selector);

    counts[selector as keyof typeof counts] = elements.length;

    elements.forEach((element, position) => {
      const text = element.textContent?.trim() || '';
      allHeadings.push({
        level,
        text,
        hasProperHierarchy: true, // Will be calculated later
        position: allHeadings.length,
      });
    });
  });

  // Sort headings by their position in the document
  allHeadings.sort((a, b) => {
    const aElement = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))[a.position];
    const bElement = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))[b.position];

    if (!aElement || !bElement) return 0;

    const position = aElement.compareDocumentPosition(bElement);
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  // Check heading hierarchy
  let hasLogicalHierarchy = true;
  let previousLevel = 0;

  allHeadings.forEach(heading => {
    // Check if heading level jumps more than 1 (e.g., H1 -> H3)
    if (previousLevel > 0 && heading.level > previousLevel + 1) {
      heading.hasProperHierarchy = false;
      hasLogicalHierarchy = false;
    }
    previousLevel = heading.level;
  });

  // Analyze H1 specifically
  const h1Elements = document.querySelectorAll('h1');
  const h1Texts = Array.from(h1Elements).map(el => el.textContent?.trim() || '');

  const h1Info: H1Info = {
    count: h1Elements.length,
    texts: h1Texts,
    isOptimal: h1Elements.length === 1,
  };

  return {
    h1: h1Info,
    h2: counts.h2,
    h3: counts.h3,
    h4: counts.h4,
    h5: counts.h5,
    h6: counts.h6,
    allHeadings,
    hasLogicalHierarchy,
  };
}

// ============================================================================
// IMAGE ANALYSIS
// ============================================================================

/**
 * Analyze images and their alt text
 */
export function analyzeImages(): ImageAltInfo {
  const images = document.querySelectorAll('img');
  const total = images.length;
  let missingAlt = 0;
  let emptyAlt = 0;
  let descriptiveAlt = 0;

  images.forEach(img => {
    const alt = img.getAttribute('alt');

    if (alt === null) {
      missingAlt++;
    } else if (alt.trim() === '') {
      emptyAlt++;
    } else if (alt.trim().length >= 10) { // Minimum descriptive length
      descriptiveAlt++;
    }
  });

  const altTextCoverage = total > 0 ? ((descriptiveAlt + emptyAlt) / total) * 100 : 100;

  return {
    total,
    missingAlt,
    emptyAlt,
    descriptiveAlt,
    altTextCoverage,
  };
}

// ============================================================================
// LINK ANALYSIS
// ============================================================================

/**
 * Analyze internal and external links
 */
export function analyzeLinks(): LinkInfo {
  const links = document.querySelectorAll('a[href]');
  const currentHostname = window.location.hostname;

  let internal = 0;
  let external = 0;
  let nonDescriptive = 0;
  let newWindow = 0;

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent?.trim() || '';
    const target = link.getAttribute('target');

    if (!href) return;

    // Skip non-HTTP links (mailto, tel, etc.)
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    // Classify as internal or external
    if (isInternalLink(href, currentHostname)) {
      internal++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      external++;
    }

    // Check for non-descriptive link text
    const nonDescriptiveTexts = [
      'click here', 'read more', 'more', 'here', 'link',
      'this', 'page', 'website', 'url', '点击这里', '更多',
    ];

    if (text.length < 3 || nonDescriptiveTexts.includes(text.toLowerCase())) {
      nonDescriptive++;
    }

    // Check for links that open in new window
    if (target === '_blank') {
      newWindow++;
    }
  });

  return {
    internal,
    external,
    nonDescriptive,
    newWindow,
  };
}

// ============================================================================
// CONTENT ANALYSIS
// ============================================================================

/**
 * Analyze content metrics
 */
export function analyzeContent(): ContentMetrics {
  const textContent = extractMainContent();
  const words = textContent.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = calculateReadingTime(wordCount);

  // Calculate content density (simplified)
  const contentLength = textContent.length;
  const htmlLength = document.documentElement.outerHTML.length;
  const density = htmlLength > 0 ? (contentLength / htmlLength) * 100 : 0;

  const meetsMinLength = wordCount >= CONTENT_RULES.MIN_WORD_COUNT;

  return {
    wordCount,
    readingTime,
    density,
    meetsMinLength,
  };
}

// ============================================================================
// SOCIAL MEDIA META ANALYSIS
// ============================================================================

/**
 * Extract Open Graph meta information
 */
export function analyzeOpenGraph(): OpenGraphInfo {
  return {
    title: getMetaContent('meta[property="og:title"]'),
    description: getMetaContent('meta[property="og:description"]'),
    image: getMetaContent('meta[property="og:image"]'),
    url: getMetaContent('meta[property="og:url"]'),
    type: getMetaContent('meta[property="og:type"]'),
    siteName: getMetaContent('meta[property="og:site_name"]'),
    locale: getMetaContent('meta[property="og:locale"]'),
  };
}

/**
 * Extract Twitter Card meta information
 */
export function analyzeTwitterCard(): TwitterCardInfo {
  return {
    card: getMetaContent('meta[name="twitter:card"]'),
    title: getMetaContent('meta[name="twitter:title"]'),
    description: getMetaContent('meta[name="twitter:description"]'),
    image: getMetaContent('meta[name="twitter:image"]'),
    site: getMetaContent('meta[name="twitter:site"]'),
    creator: getMetaContent('meta[name="twitter:creator"]'),
  };
}

// ============================================================================
// STRUCTURED DATA ANALYSIS
// ============================================================================

/**
 * Parse and validate JSON-LD structured data
 */
function parseJsonLd(script: HTMLScriptElement, position: number): StructuredDataItem | null {
  try {
    const data = JSON.parse(script.textContent || '');
    const type = data['@type'] as StructuredDataType;

    if (!type || !STRUCTURED_DATA_SCHEMAS[type]) {
      return {
        type: 'Article', // Default fallback
        data,
        isValid: false,
        errors: [`Unknown or unsupported @type: ${type}`],
        position,
      };
    }

    // Validate required fields
    const schema = STRUCTURED_DATA_SCHEMAS[type];
    const errors: string[] = [];

    schema.required.forEach(field => {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    return {
      type,
      data,
      isValid: errors.length === 0,
      errors,
      position,
    };
  } catch (error) {
    return {
      type: 'Article', // Default fallback
      data: {},
      isValid: false,
      errors: [`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      position,
    };
  }
}

/**
 * Analyze structured data on the page
 */
export function analyzeStructuredData(): StructuredDataInfo {
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const items: StructuredDataItem[] = [];
  const typeCount: Record<StructuredDataType, number> = {} as Record<StructuredDataType, number>;
  const globalErrors: string[] = [];

  // Initialize type count
  Object.keys(STRUCTURED_DATA_SCHEMAS).forEach(type => {
    typeCount[type as StructuredDataType] = 0;
  });

  // Parse each JSON-LD script
  jsonLdScripts.forEach((script, index) => {
    const item = parseJsonLd(script as HTMLScriptElement, index);
    if (item) {
      items.push(item);
      typeCount[item.type]++;
    }
  });

  // Check for global issues
  if (items.length === 0 && jsonLdScripts.length > 0) {
    globalErrors.push('JSON-LD scripts found but none could be parsed successfully');
  }

  const hasStructuredData = items.length > 0;
  const isValid = items.every(item => item.isValid) && globalErrors.length === 0;

  return {
    hasStructuredData,
    items,
    typeCount,
    isValid,
    globalErrors,
  };
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Perform complete SEO analysis of the current page
 */
export function analyzePage() {
  return {
    metaTags: analyzeMetaTags(),
    headings: analyzeHeadings(),
    images: analyzeImages(),
    links: analyzeLinks(),
    content: analyzeContent(),
    openGraph: analyzeOpenGraph(),
    twitterCard: analyzeTwitterCard(),
    structuredData: analyzeStructuredData(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// All functions are already exported with their definitions above

